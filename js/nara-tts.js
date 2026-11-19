/**
 * Htet Official — Hybrid Nara Mini v1 Text-to-Speech Engine (Method 1 + Method 3)
 *
 * Method 1: Instant pre-generated audio playback from data/audio-manifest.json (zero model download)
 * Method 3: Opt-in on-device Burmese + English AI Voice via ONNX Runtime Web (YeeNyunn/nara-mini-v1)
 *   - Explicit user consent modal (<dialog>) BEFORE downloading (~181.2 MB per voice)
 *   - Live byte-level streaming progress (MB, %, MB/s, ETA, Cancel via AbortController)
 *   - Persistent Cache Storage ('nara-mini-v1-models-v1') for offline reuse + Clear Cache control
 *   - High-speed gapless playback engine:
 *       * Dedicated Web Worker inference (off-main-thread, auto-fallback if restricted)
 *       * Leading/trailing silence trimming + 10ms click-free fade + natural 85ms breath
 *       * 4-chunk background lookahead queue + sample-accurate Web Audio timeline scheduling
 *       * Immediate tensor.dispose() memory hygiene
 *
 * Attribution (Apache License 2.0):
 * Nara Mini v1 — Copyright 2026 Nara contributors (https://naraaudio.app)
 * Adapted from Kokoro (hexgrad, Apache 2.0) and VoxCPM2 (OpenBMB, Apache 2.0).
 */
(function () {
  'use strict';

  const HF_BASE = 'https://huggingface.co/YeeNyunn/nara-mini-v1/resolve/main/onnx';
  const MODEL_CACHE_NAME = 'nara-mini-v1-models-v1';
  const ORT_LOCAL_SCRIPT = 'js/ort/ort.wasm.min.js';
  const ORT_LOCAL_WASM_BASE = 'js/ort/';
  const ORT_CDN_SCRIPT = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.1/dist/ort.wasm.min.js';
  const ORT_CDN_WASM_BASE = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.1/dist/';
  const SAMPLE_RATE = 24000;
  const LOOKAHEAD_CHUNKS = 4; // Pre-synthesize up to 4 chunks ahead of current playback
  const INITIAL_PREBUFFER = 2; // Build a 2-chunk runway before starting gapless schedule

  const VOICES = [
    { id: 'htet-myat', labelMm: 'ထက်မြတ် (Htet Myat)', labelEn: 'Htet Myat', gender: 'Female', sizeMb: 181.2 },
    { id: 'shoon', labelMm: 'ရွှန်း (Shoon)', labelEn: 'Shoon', gender: 'Female', sizeMb: 181.2 },
    { id: 'thazin', labelMm: 'သဇင် (Thazin)', labelEn: 'Thazin', gender: 'Female', sizeMb: 181.2 },
    { id: 'ko-banyar', labelMm: 'ကိုဗညား (Ko Banyar)', labelEn: 'Ko Banyar', gender: 'Male', sizeMb: 181.2 }
  ];

  const FILE_SPECS = [
    { name: 'voice.json', fallbackBytes: 40669, mime: 'application/json' },
    { name: 'encoder.onnx', fallbackBytes: 78268090, mime: 'application/octet-stream' },
    { name: 'decoder.onnx', fallbackBytes: 111686677, mime: 'application/octet-stream' }
  ];

  const TOTAL_EST_BYTES = FILE_SPECS.reduce((acc, f) => acc + f.fallbackBytes, 0);

  const state = {
    articleId: null,
    manifest: null,
    pregeneratedTrack: null,
    mode: 'auto', // 'pregenerated' | 'ondevice'
    selectedVoice: localStorage.getItem('htet_nara_voice') || 'htet-myat',
    speed: parseFloat(localStorage.getItem('htet_nara_speed') || '1.0') || 1.0,
    installedVoices: new Set(),
    lexicon: null,
    // Inference backend (Web Worker preferred; main-thread fallback)
    worker: null,
    workerReadyVoice: null,
    workerReqId: 0,
    workerPending: new Map(),
    useWorker: true,
    // Main-thread fallback sessions
    ortReady: false,
    loadedVoiceId: null,
    voiceMeta: null,
    encoderSession: null,
    decoderSession: null,
    styleCache: new Map(),
    // Download state
    downloading: false,
    abortCtrl: null,
    // Gapless playback & lookahead buffer state
    chunks: [],
    currentChunkIdx: 0,
    audioBuffers: new Map(), // chunkIdx -> trimmed Float32Array
    synthPromises: new Map(), // chunkIdx -> Promise<Float32Array>
    synthChain: Promise.resolve(), // Serialize ONNX calls cleanly
    isPlaying: false,
    isPaused: false,
    playRunId: 0,
    audioCtx: null,
    scheduledSources: new Set(),
    nextStartTime: 0,
    // Method 1 <audio> element
    audioEl: null
  };

  function modelFileUrl(voiceId, fileName) {
    return `${HF_BASE}/${voiceId}/${fileName}`;
  }

  function formatMb(bytes) {
    return (bytes / (1024 * 1024)).toFixed(1);
  }

  function formatTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return '0:00';
    const total = Math.floor(sec);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function getVoiceLabel(voiceId) {
    if (voiceId === 'daniel-uk') return 'Daniel (UK English - Normal Speed)';
    const v = VOICES.find(x => x.id === voiceId);
    return v ? v.labelMm : (voiceId || 'ရွှန်း (Shoon)');
  }

  function toast(msg) {
    if (typeof window.showToast === 'function') window.showToast(msg);
  }

  // ==================== AUDIO POST-PROCESSING (ZERO-GAP SILENCE TRIM & FADE) ====================
  /**
   * Trims Kokoro's excessive leading/trailing silence (often 300-500ms each end)
   * down to a crisp 18ms lead-in and natural 85ms breath, with a 10ms click-free fade.
   */
  function trimSilenceAndFade(rawSamples, sampleRate = SAMPLE_RATE) {
    const len = rawSamples.length;
    if (len < 1200) return rawSamples;

    const threshold = 0.008;
    let first = 0;
    while (first < len && Math.abs(rawSamples[first]) < threshold) first++;
    let last = len - 1;
    while (last > first && Math.abs(rawSamples[last]) < threshold) last--;

    if (first >= last) {
      return new Float32Array(Math.round(sampleRate * 0.12));
    }

    const leadPad = Math.round(sampleRate * 0.018); // 18ms crisp start
    const tailPad = Math.round(sampleRate * 0.085); // 85ms natural sentence breath
    const start = Math.max(0, first - leadPad);
    const end = Math.min(len, last + tailPad);
    const outLen = end - start;
    const out = new Float32Array(outLen);
    out.set(rawSamples.subarray(start, end));

    // Smooth 10ms fade-in & fade-out to eliminate boundary clicks
    const fadeLen = Math.min(Math.round(sampleRate * 0.01), Math.floor(outLen / 4));
    for (let i = 0; i < fadeLen; i++) {
      const gain = 0.5 - 0.5 * Math.cos((Math.PI * i) / fadeLen);
      out[i] *= gain;
      out[outLen - 1 - i] *= gain;
    }
    return out;
  }

  // ==================== CACHE MANAGEMENT ====================
  async function scanInstalledVoices() {
    state.installedVoices.clear();
    if (!('caches' in window)) return state.installedVoices;
    try {
      const cache = await caches.open(MODEL_CACHE_NAME);
      for (const v of VOICES) {
        const checks = await Promise.all(
          FILE_SPECS.map(f => cache.match(modelFileUrl(v.id, f.name)))
        );
        if (checks.every(Boolean)) state.installedVoices.add(v.id);
      }
    } catch (err) {
      console.warn('[NaraTTS] Cache scan warning:', err);
    }
    return state.installedVoices;
  }

  function resetInferenceState() {
    if (state.worker) {
      try { state.worker.terminate(); } catch (e) {}
      state.worker = null;
      state.workerReadyVoice = null;
      state.workerPending.clear();
    }
    state.loadedVoiceId = null;
    state.encoderSession = null;
    state.decoderSession = null;
    state.voiceMeta = null;
    state.styleCache.clear();
    state.audioBuffers.clear();
    state.synthPromises.clear();
  }

  async function clearCachedModels(voiceId = null) {
    if (!('caches' in window)) return;
    try {
      stopOnDevicePlayback(true);
      if (voiceId) {
        const cache = await caches.open(MODEL_CACHE_NAME);
        for (const f of FILE_SPECS) {
          await cache.delete(modelFileUrl(voiceId, f.name));
        }
        if (state.loadedVoiceId === voiceId || state.workerReadyVoice === voiceId) {
          resetInferenceState();
        }
      } else {
        await caches.delete(MODEL_CACHE_NAME);
        resetInferenceState();
      }
      await scanInstalledVoices();
      renderUI();
      toast('ဖုန်းထဲတွင် သိမ်းထားသော AI Voice Model ကို ဖျက်ပြီးပါပြီ ✓');
    } catch (err) {
      console.warn('[NaraTTS] Clear cache failed:', err);
    }
  }

  // ==================== STREAMING DOWNLOAD WITH LIVE PROGRESS ====================
  async function downloadVoiceWithProgress(voiceId, onProgress) {
    if (!('caches' in window)) {
      throw new Error('ဤ Browser တွင် Offline Cache Storage မပံ့ပိုးပါ (HTTPS လိုအပ်ပါသည်)');
    }
    const cache = await caches.open(MODEL_CACHE_NAME);
    const abortCtrl = new AbortController();
    state.abortCtrl = abortCtrl;
    state.downloading = true;

    let completedPriorBytes = 0;
    let totalExpectedBytes = TOTAL_EST_BYTES;
    const startTime = performance.now();

    try {
      for (let idx = 0; idx < FILE_SPECS.length; idx++) {
        const spec = FILE_SPECS[idx];
        const url = modelFileUrl(voiceId, spec.name);

        const existing = await cache.match(url);
        if (existing) {
          const buf = await existing.clone().arrayBuffer();
          completedPriorBytes += buf.byteLength;
          onProgress({
            fileIndex: idx + 1,
            fileCount: FILE_SPECS.length,
            fileName: spec.name,
            loadedBytes: completedPriorBytes,
            totalBytes: Math.max(totalExpectedBytes, completedPriorBytes),
            speedBps: 0,
            etaSec: 0
          });
          continue;
        }

        const resp = await fetch(url, { signal: abortCtrl.signal, mode: 'cors' });
        if (!resp.ok) throw new Error(`${spec.name} download failed (HTTP ${resp.status})`);

        const contentLen = parseInt(resp.headers.get('content-length') || '0', 10) || spec.fallbackBytes;
        totalExpectedBytes = totalExpectedBytes - spec.fallbackBytes + contentLen;

        const chunks = [];
        let fileLoaded = 0;

        if (resp.body && typeof resp.body.getReader === 'function') {
          const reader = resp.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            fileLoaded += value.byteLength;

            const totalLoaded = completedPriorBytes + fileLoaded;
            const elapsedSec = Math.max((performance.now() - startTime) / 1000, 0.15);
            const speedBps = totalLoaded / elapsedSec;
            const remainingBytes = Math.max(totalExpectedBytes - totalLoaded, 0);
            const etaSec = speedBps > 0 ? remainingBytes / speedBps : 0;

            onProgress({
              fileIndex: idx + 1,
              fileCount: FILE_SPECS.length,
              fileName: spec.name,
              loadedBytes: totalLoaded,
              totalBytes: Math.max(totalExpectedBytes, totalLoaded),
              speedBps,
              etaSec
            });
          }
        } else {
          const buf = new Uint8Array(await resp.arrayBuffer());
          chunks.push(buf);
          fileLoaded = buf.byteLength;
        }

        const blob = new Blob(chunks, { type: spec.mime });
        const cacheResp = new Response(blob, {
          status: 200,
          headers: { 'Content-Type': spec.mime, 'Content-Length': String(blob.size) }
        });
        await cache.put(url, cacheResp);
        completedPriorBytes += fileLoaded;
      }

      await scanInstalledVoices();
      return true;
    } finally {
      state.downloading = false;
      state.abortCtrl = null;
    }
  }

  // ==================== INLINE WEB WORKER (OFF-MAIN-THREAD ONNX ENGINE) ====================
  function buildWorkerSource(ortScriptUrl, wasmBaseUrl, numThreads) {
    return `
      'use strict';
      let encoderSession = null;
      let decoderSession = null;
      let voiceMeta = null;
      let styleCache = new Map();

      function repeatAxis2(srcData, dims, durations) {
        const C = dims[1];
        const T = dims[2];
        let totalFrames = 0;
        const durs = new Int32Array(T);
        for (let t = 0; t < T; t++) {
          const d = Math.max(1, Math.round(Number(durations[t])));
          durs[t] = d;
          totalFrames += d;
        }
        if (totalFrames < 1 || totalFrames > 20000) {
          throw new Error('Invalid predicted duration sum: ' + totalFrames);
        }
        const out = new Float32Array(C * totalFrames);
        for (let c = 0; c < C; c++) {
          const srcOff = c * T;
          let dstPos = c * totalFrames;
          for (let t = 0; t < T; t++) {
            const val = srcData[srcOff + t];
            const rep = durs[t];
            for (let r = 0; r < rep; r++) out[dstPos++] = val;
          }
        }
        return { data: out, dims: [1, C, totalFrames] };
      }

      self.onmessage = async (e) => {
        const msg = e.data;
        try {
          if (msg.type === 'init') {
            if (!self.ort) {
              importScripts(${JSON.stringify(ortScriptUrl)});
              self.ort.env.wasm.wasmPaths = ${JSON.stringify(wasmBaseUrl)};
              self.ort.env.wasm.numThreads = ${Number(numThreads)};
              self.ort.env.wasm.proxy = false;
            }
            if (encoderSession && encoderSession.release) await encoderSession.release().catch(() => {});
            if (decoderSession && decoderSession.release) await decoderSession.release().catch(() => {});
            styleCache.clear();
            voiceMeta = msg.voiceMeta;
            const opts = { executionProviders: ['wasm'], graphOptimizationLevel: 'all' };
            encoderSession = await self.ort.InferenceSession.create(new Uint8Array(msg.encBuf), opts);
            decoderSession = await self.ort.InferenceSession.create(new Uint8Array(msg.decBuf), opts);
            self.postMessage({ id: msg.id, ok: true });
          } else if (msg.type === 'synth') {
            const tokens = msg.tokens;
            if (!tokens.length) {
              const empty = new Float32Array(2400);
              self.postMessage({ id: msg.id, ok: true, pcm: empty.buffer }, [empty.buffer]);
              return;
            }
            let bestIdx = 0, bestDiff = Infinity;
            for (let i = 0; i < voiceMeta.centers.length; i++) {
              const diff = Math.abs(voiceMeta.centers[i] - tokens.length);
              if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
            }
            let styleVec = styleCache.get(bestIdx);
            if (!styleVec) {
              styleVec = Float32Array.from(voiceMeta.styles[bestIdx]);
              styleCache.set(bestIdx, styleVec);
            }
            const styleTensor = new self.ort.Tensor('float32', styleVec, [1, styleVec.length]);
            const tokenIds = new BigInt64Array(tokens.length + 2);
            tokenIds[0] = 0n;
            for (let i = 0; i < tokens.length; i++) tokenIds[i + 1] = BigInt(tokens[i]);
            tokenIds[tokens.length + 1] = 0n;
            const tokensTensor = new self.ort.Tensor('int64', tokenIds, [1, tokenIds.length]);

            const encOut = await encoderSession.run({ tokens: tokensTensor, style: styleTensor });
            tokensTensor.dispose();

            const durations = encOut.durations.data;
            const repProsody = repeatAxis2(encOut.prosody.data, encOut.prosody.dims, durations);
            const repText = repeatAxis2(encOut.text.data, encOut.text.dims, durations);
            encOut.durations.dispose();
            encOut.prosody.dispose();
            encOut.text.dispose();

            const pTensor = new self.ort.Tensor('float32', repProsody.data, repProsody.dims);
            const tTensor = new self.ort.Tensor('float32', repText.data, repText.dims);
            const decOut = await decoderSession.run({ prosody: pTensor, text: tTensor, style: styleTensor });
            pTensor.dispose();
            tTensor.dispose();
            styleTensor.dispose();

            const firstKey = Object.keys(decOut)[0];
            const raw = decOut[firstKey].data;
            const clipped = new Float32Array(raw.length);
            for (let i = 0; i < raw.length; i++) {
              const v = raw[i];
              clipped[i] = Number.isFinite(v) ? (v > 1 ? 1 : (v < -1 ? -1 : v)) : 0;
            }
            decOut[firstKey].dispose();
            self.postMessage({ id: msg.id, ok: true, pcm: clipped.buffer }, [clipped.buffer]);
          }
        } catch (err) {
          self.postMessage({ id: msg.id, ok: false, error: (err && err.message) ? err.message : String(err) });
        }
      };
    `;
  }

  function callWorker(payload, transferables = []) {
    return new Promise((resolve, reject) => {
      const id = ++state.workerReqId;
      state.workerPending.set(id, { resolve, reject });
      state.worker.postMessage({ ...payload, id }, transferables);
    });
  }

  async function tryInitWorker(voiceId, voiceMeta, encBuf, decBuf) {
    if (!state.useWorker || typeof Worker === 'undefined') return false;
    try {
      const isFileProto = window.location.protocol === 'file:';
      const ortScriptUrl = isFileProto ? ORT_CDN_SCRIPT : new URL(ORT_LOCAL_SCRIPT, window.location.href).href;
      const wasmBaseUrl = isFileProto ? ORT_CDN_WASM_BASE : new URL(ORT_LOCAL_WASM_BASE, window.location.href).href;
      const threads = (typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated)
        ? Math.min(4, navigator.hardwareConcurrency || 2)
        : 1;

      if (!state.worker) {
        const blob = new Blob([buildWorkerSource(ortScriptUrl, wasmBaseUrl, threads)], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        const w = new Worker(workerUrl);
        w.onmessage = (e) => {
          const { id, ok, pcm, error } = e.data;
          const pending = state.workerPending.get(id);
          if (!pending) return;
          state.workerPending.delete(id);
          if (ok) pending.resolve(pcm ? new Float32Array(pcm) : true);
          else pending.reject(new Error(error || 'Worker inference error'));
        };
        w.onerror = (err) => {
          for (const [, p] of state.workerPending) p.reject(new Error(err.message || 'Worker crashed'));
          state.workerPending.clear();
        };
        state.worker = w;
        setTimeout(() => URL.revokeObjectURL(workerUrl), 5000);
      }

      // Transfer ArrayBuffers cleanly (clone copy kept only if fallback needed)
      const encCopy = encBuf.buffer.slice(0);
      const decCopy = decBuf.buffer.slice(0);
      await callWorker({ type: 'init', voiceMeta, encBuf: encCopy, decBuf: decCopy }, [encCopy, decCopy]);
      state.workerReadyVoice = voiceId;
      state.voiceMeta = voiceMeta;
      return true;
    } catch (err) {
      console.warn('[NaraTTS] Off-thread Worker unavailable, falling back to main thread:', err);
      if (state.worker) {
        try { state.worker.terminate(); } catch (e) {}
        state.worker = null;
      }
      state.useWorker = false;
      return false;
    }
  }

  // ==================== MAIN-THREAD FALLBACK ONNX ENGINE ====================
  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Script load failed: ${src}`));
      document.head.appendChild(s);
    });
  }

  async function ensureOrtLoadedMain() {
    if (window.ort) {
      state.ortReady = true;
      return window.ort;
    }
    const isFileProto = window.location.protocol === 'file:';
    let wasmBase = isFileProto ? ORT_CDN_WASM_BASE : ORT_LOCAL_WASM_BASE;
    try {
      await loadScriptOnce(ORT_LOCAL_SCRIPT);
    } catch {
      wasmBase = ORT_CDN_WASM_BASE;
      await loadScriptOnce(ORT_CDN_SCRIPT);
    }
    if (!window.ort) throw new Error('ONNX Runtime Web ကို စတင်၍ မရပါ');
    window.ort.env.wasm.wasmPaths = isFileProto ? ORT_CDN_WASM_BASE : new URL(wasmBase, window.location.href).href;
    window.ort.env.wasm.numThreads = (typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated)
      ? Math.min(4, navigator.hardwareConcurrency || 2)
      : 1;
    window.ort.env.wasm.proxy = false;
    state.ortReady = true;
    return window.ort;
  }

  async function ensureLexiconLoaded() {
    if (state.lexicon) return state.lexicon;
    if (window.HTET_NARA_LEXICON_BACKUP) {
      state.lexicon = window.NaraG2P.prepareLexicon(window.HTET_NARA_LEXICON_BACKUP);
      return state.lexicon;
    }
    const resp = await fetch('data/nara-lexicon.json');
    if (!resp.ok) throw new Error('data/nara-lexicon.json ကို ဖတ်၍မရပါ');
    state.lexicon = window.NaraG2P.prepareLexicon(await resp.json());
    return state.lexicon;
  }

  async function loadVoiceSessions(voiceId, setStatus) {
    if (state.workerReadyVoice === voiceId && state.worker && state.voiceMeta) return;
    if (!state.useWorker && state.loadedVoiceId === voiceId && state.encoderSession && state.decoderSession && state.voiceMeta) return;

    await ensureLexiconLoaded();

    setStatus('၁/၂ — ဖုန်းထဲတွင် သိမ်းထားသော Model ဖိုင်များကို ဖတ်နေပါသည်...');
    const cache = await caches.open(MODEL_CACHE_NAME);
    const metaResp = await cache.match(modelFileUrl(voiceId, 'voice.json'));
    const encResp = await cache.match(modelFileUrl(voiceId, 'encoder.onnx'));
    const decResp = await cache.match(modelFileUrl(voiceId, 'decoder.onnx'));
    if (!metaResp || !encResp || !decResp) {
      throw new Error('Model ဖိုင်များ မပြည့်စုံသေးပါ — ကျေးဇူးပြု၍ ထပ်မံ Download ဆွဲပါ');
    }

    const voiceMeta = await metaResp.json();
    const encBuf = new Uint8Array(await encResp.arrayBuffer());
    const decBuf = new Uint8Array(await decResp.arrayBuffer());

    setStatus('၂/၂ — Fast Background AI Engine ကို ဖွင့်နေပါသည်...');
    const workerOk = await tryInitWorker(voiceId, voiceMeta, encBuf, decBuf);
    if (workerOk) return;

    // Main-thread fallback
    const ort = await ensureOrtLoadedMain();
    const opts = { executionProviders: ['wasm'], graphOptimizationLevel: 'all' };
    try {
      state.encoderSession = await ort.InferenceSession.create(encBuf, opts);
      state.decoderSession = await ort.InferenceSession.create(decBuf, opts);
    } catch (e) {
      throw new Error(`ONNX WASM Session စတင်မရပါ — ${e.message || e}`);
    }
    state.voiceMeta = voiceMeta;
    state.loadedVoiceId = voiceId;
    state.styleCache.clear();
  }

  function repeatAxis2Main(srcData, dims, durations) {
    const C = dims[1];
    const T = dims[2];
    let totalFrames = 0;
    const durs = new Int32Array(T);
    for (let t = 0; t < T; t++) {
      const d = Math.max(1, Math.round(Number(durations[t])));
      durs[t] = d;
      totalFrames += d;
    }
    if (totalFrames < 1 || totalFrames > 20000) {
      throw new Error(`Invalid predicted duration sum: ${totalFrames}`);
    }
    const out = new Float32Array(C * totalFrames);
    for (let c = 0; c < C; c++) {
      const srcOffset = c * T;
      let dstPos = c * totalFrames;
      for (let t = 0; t < T; t++) {
        const val = srcData[srcOffset + t];
        const rep = durs[t];
        for (let r = 0; r < rep; r++) out[dstPos++] = val;
      }
    }
    return { data: out, dims: [1, C, totalFrames] };
  }

  function textToTokens(pieceText) {
    const meta = state.voiceMeta;
    const chars = window.NaraG2P.phonemize(pieceText, state.lexicon, true);
    const tokens = [];
    for (const ch of chars) {
      if (Object.prototype.hasOwnProperty.call(meta.vocab, ch)) {
        tokens.push(meta.vocab[ch]);
      }
    }
    return tokens.slice(0, 506);
  }

  async function runChunkInference(pieceText) {
    const tokens = textToTokens(pieceText);
    if (!tokens.length) return new Float32Array(2400);

    let rawPcm;
    if (state.worker && state.workerReadyVoice === state.selectedVoice) {
      rawPcm = await callWorker({ type: 'synth', tokens });
    } else {
      const ort = window.ort;
      const meta = state.voiceMeta;
      let bestIdx = 0, bestDiff = Infinity;
      for (let i = 0; i < meta.centers.length; i++) {
        const diff = Math.abs(meta.centers[i] - tokens.length);
        if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
      }
      let styleVec = state.styleCache.get(bestIdx);
      if (!styleVec) {
        styleVec = Float32Array.from(meta.styles[bestIdx]);
        state.styleCache.set(bestIdx, styleVec);
      }
      const styleTensor = new ort.Tensor('float32', styleVec, [1, styleVec.length]);
      const tokenIds = new BigInt64Array(tokens.length + 2);
      tokenIds[0] = 0n;
      for (let i = 0; i < tokens.length; i++) tokenIds[i + 1] = BigInt(tokens[i]);
      tokenIds[tokens.length + 1] = 0n;
      const tokensTensor = new ort.Tensor('int64', tokenIds, [1, tokenIds.length]);

      const encOut = await state.encoderSession.run({ tokens: tokensTensor, style: styleTensor });
      tokensTensor.dispose();

      const repProsody = repeatAxis2Main(encOut.prosody.data, encOut.prosody.dims, encOut.durations.data);
      const repText = repeatAxis2Main(encOut.text.data, encOut.text.dims, encOut.durations.data);
      encOut.durations.dispose();
      encOut.prosody.dispose();
      encOut.text.dispose();

      const pTensor = new ort.Tensor('float32', repProsody.data, repProsody.dims);
      const tTensor = new ort.Tensor('float32', repText.data, repText.dims);
      const decOut = await state.decoderSession.run({ prosody: pTensor, text: tTensor, style: styleTensor });
      pTensor.dispose();
      tTensor.dispose();
      styleTensor.dispose();

      const firstKey = Object.keys(decOut)[0];
      const samples = decOut[firstKey].data;
      rawPcm = new Float32Array(samples.length);
      for (let i = 0; i < samples.length; i++) {
        const v = samples[i];
        rawPcm[i] = Number.isFinite(v) ? (v > 1 ? 1 : (v < -1 ? -1 : v)) : 0;
      }
      decOut[firstKey].dispose();
    }

    return trimSilenceAndFade(rawPcm, SAMPLE_RATE);
  }

  /**
   * Queues synthesis of a specific chunk index serially through the ONNX engine
   * while deduplicating concurrent requests for the same chunk.
   */
  function requestChunkPcm(idx, runId) {
    if (state.audioBuffers.has(idx)) return Promise.resolve(state.audioBuffers.get(idx));
    if (state.synthPromises.has(idx)) return state.synthPromises.get(idx);
    if (idx < 0 || idx >= state.chunks.length) return Promise.resolve(null);

    const p = state.synthChain.then(async () => {
      if (runId !== state.playRunId) return null;
      if (state.audioBuffers.has(idx)) return state.audioBuffers.get(idx);
      const pcm = await runChunkInference(state.chunks[idx]);
      if (runId !== state.playRunId) return null;
      state.audioBuffers.set(idx, pcm);
      return pcm;
    });

    state.synthChain = p.catch(() => {});
    state.synthPromises.set(idx, p);
    p.finally(() => state.synthPromises.delete(idx));
    return p;
  }

  function primeLookahead(fromIdx, runId) {
    const end = Math.min(state.chunks.length, fromIdx + LOOKAHEAD_CHUNKS + 1);
    for (let i = fromIdx; i < end; i++) {
      if (!state.audioBuffers.has(i) && !state.synthPromises.has(i)) {
        requestChunkPcm(i, runId).then(() => {
          if (runId === state.playRunId && state.isPlaying && !state.isPaused) {
            updateBufferedCounter();
          }
        }).catch(() => {});
      }
    }
  }

  function countReadyAhead(fromIdx) {
    let n = 0;
    for (let i = fromIdx; i < state.chunks.length; i++) {
      if (state.audioBuffers.has(i)) n++;
      else break;
    }
    return n;
  }

  function updateBufferedCounter() {
    if (!state.isPlaying) return;
    const ready = countReadyAhead(state.currentChunkIdx);
    const engineTag = state.workerReadyVoice ? '⚡ Fast Worker' : 'WASM';
    const base = state.isPaused
      ? `ခေတ္တရပ်ထားသည် (${state.currentChunkIdx + 1}/${state.chunks.length})`
      : `ဖတ်ပြနေသည် (${state.currentChunkIdx + 1}/${state.chunks.length}) • ${engineTag} • အသင့်ပြင်ပြီး +${Math.max(0, ready - 1)} ပိုဒ်`;
    setPlayerStatus(base, state.chunks[state.currentChunkIdx] || '');
  }

  // ==================== WAV ENCODER ====================
  function encodeWavBlob(floatSamples, sampleRate = SAMPLE_RATE) {
    const buffer = new ArrayBuffer(44 + floatSamples.length * 2);
    const view = new DataView(buffer);
    const writeStr = (off, str) => {
      for (let i = 0; i < str.length; i++) view.setUint8(off + i, str.charCodeAt(i));
    };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + floatSamples.length * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, floatSamples.length * 2, true);
    let offset = 44;
    for (let i = 0; i < floatSamples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, floatSamples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return new Blob([buffer], { type: 'audio/wav' });
  }

  // ==================== ARTICLE TEXT EXTRACTION ====================
  function extractArticleText() {
    const titleEl = document.getElementById('article-title');
    const bodyEl = document.getElementById('article-content-body');
    const parts = [];
    if (titleEl && titleEl.innerText.trim()) parts.push(titleEl.innerText.trim());
    if (bodyEl) {
      const clone = bodyEl.cloneNode(true);
      clone.querySelectorAll('script, style, svg, button, nav, .no-tts').forEach(el => el.remove());
      const raw = (clone.innerText || clone.textContent || '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\[[0-9:\-–]+\]/g, '')
        .replace(/\n{2,}/g, '\n')
        .trim();
      if (raw) parts.push(raw);
    }
    return parts.join('။\n');
  }

  // ==================== GAPLESS WEB AUDIO TIMELINE SCHEDULER ====================
  function ensureAudioCtx() {
    if (!state.audioCtx) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      try {
        state.audioCtx = new Ctx({ sampleRate: SAMPLE_RATE });
      } catch {
        state.audioCtx = new Ctx();
      }
    }
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume().catch(() => {});
    }
    return state.audioCtx;
  }

  function stopOnDevicePlayback(resetIdx = false) {
    state.playRunId++;
    state.isPlaying = false;
    state.isPaused = false;
    state.nextStartTime = 0;
    for (const src of state.scheduledSources) {
      try { src.onended = null; src.stop(); } catch (e) {}
    }
    state.scheduledSources.clear();
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      try { state.audioCtx.resume(); } catch (e) {}
    }
    if (resetIdx) state.currentChunkIdx = 0;
    renderUI();
  }

  async function startOnDevicePlayback(fromIndex = null) {
    const voiceId = state.selectedVoice;
    if (!state.installedVoices.has(voiceId)) {
      openConsentDialog(voiceId);
      return;
    }

    if (state.audioEl && !state.audioEl.paused) state.audioEl.pause();

    const fullText = extractArticleText();
    if (!fullText) {
      toast('ဖတ်ပြရန် ဆောင်းပါးစာသား မတွေ့သေးပါ');
      return;
    }

    const chunks = window.NaraG2P.splitSpeech(fullText, 165, 85);
    if (!chunks.length) return;
    if (chunks.length !== state.chunks.length || chunks[0] !== state.chunks[0]) {
      state.chunks = chunks;
      state.audioBuffers.clear();
      state.synthPromises.clear();
      state.currentChunkIdx = 0;
    }
    if (typeof fromIndex === 'number') {
      state.currentChunkIdx = Math.max(0, Math.min(state.chunks.length - 1, fromIndex));
    }

    stopOnDevicePlayback(false);
    const runId = ++state.playRunId;
    state.isPlaying = true;
    state.isPaused = false;
    ensureAudioCtx();
    renderUI();

    try {
      await loadVoiceSessions(voiceId, msg => setPlayerStatus(msg));
      if (runId !== state.playRunId) return;

      // Build initial runway (chunk 0 + chunk 1) so speech flows smoothly right from the start
      const startIdx = state.currentChunkIdx;
      setPlayerStatus(`စာပိုဒ် ${startIdx + 1} / ${state.chunks.length} ကို အသင့်ပြင်ဆင်နေပါသည်...`, state.chunks[startIdx]);
      await requestChunkPcm(startIdx, runId);
      if (runId !== state.playRunId) return;

      // Kick off background lookahead immediately (up to 4 chunks ahead!)
      primeLookahead(startIdx + 1, runId);

      // If there's a second chunk and we are on main-thread fallback, pre-warm 1 extra chunk for smoothness
      if (!state.workerReadyVoice && startIdx + 1 < state.chunks.length && !state.audioBuffers.has(startIdx + 1)) {
        setPlayerStatus(`ဆက်တိုက်ချောမွေ့စေရန် စာပိုဒ် ${startIdx + 2} ကို ကြိုပြင်နေပါသည်...`, state.chunks[startIdx]);
        await requestChunkPcm(startIdx + 1, runId);
        if (runId !== state.playRunId) return;
      }

      // Gapless timeline scheduler loop
      const ctx = ensureAudioCtx();
      state.nextStartTime = ctx.currentTime + 0.03;
      let scheduleIdx = startIdx;

      while (scheduleIdx < state.chunks.length && runId === state.playRunId) {
        // Keep background synthesis pipeline saturated 4 chunks ahead
        primeLookahead(scheduleIdx + 1, runId);

        const pcm = await requestChunkPcm(scheduleIdx, runId);
        if (!pcm || runId !== state.playRunId) return;

        // Wait if we already have 2 chunks queued on Web Audio timeline (prevents excessive memory / lets speed changes apply)
        while (state.scheduledSources.size >= 2 && runId === state.playRunId) {
          await new Promise(r => setTimeout(r, 60));
        }
        if (runId !== state.playRunId) return;

        // Wait while paused
        while (state.isPaused && runId === state.playRunId) {
          await new Promise(r => setTimeout(r, 80));
        }
        if (runId !== state.playRunId) return;

        const audioBuf = ctx.createBuffer(1, pcm.length, SAMPLE_RATE);
        audioBuf.copyToChannel(pcm, 0);
        const src = ctx.createBufferSource();
        src.buffer = audioBuf;
        src.playbackRate.value = state.speed;
        src.connect(ctx.destination);

        const now = ctx.currentTime;
        const startAt = Math.max(now + 0.015, state.nextStartTime);
        const playDur = audioBuf.duration / state.speed;

        // Contextual human breath pause between sentences/clauses
        const chunkText = (state.chunks[scheduleIdx] || '').trim();
        const pauseSec = (chunkText.endsWith('။') || chunkText.endsWith('.') || chunkText.endsWith('?') || chunkText.endsWith('!'))
          ? 0.38
          : (chunkText.endsWith('၊') || chunkText.endsWith(','))
          ? 0.20
          : 0.09;
        state.nextStartTime = startAt + playDur + (pauseSec / state.speed);

        const thisIdx = scheduleIdx;
        state.scheduledSources.add(src);

        // Update UI right when this chunk actually begins speaking on the audio clock
        const delayMs = Math.max(0, Math.round((startAt - now) * 1000));
        setTimeout(() => {
          if (runId !== state.playRunId) return;
          state.currentChunkIdx = thisIdx;
          updateBufferedCounter();
          renderUI();
        }, delayMs);

        src.onended = () => {
          state.scheduledSources.delete(src);
          if (runId !== state.playRunId) return;
          if (thisIdx === state.chunks.length - 1 && state.scheduledSources.size === 0) {
            state.isPlaying = false;
            state.currentChunkIdx = 0;
            setPlayerStatus('ဆောင်းပါးတစ်ပုဒ်လုံး ဖတ်ပြပြီးစီးပါပြီ ✓');
            renderUI();
          }
        };

        src.start(startAt);
        scheduleIdx++;
      }
    } catch (err) {
      console.error('[NaraTTS] Synthesis error:', err);
      state.isPlaying = false;
      setPlayerStatus(`အမှားဖြစ်ပွားပါသည် — ${err.message || err}`);
      renderUI();
    }
  }

  function togglePauseOnDevice() {
    if (!state.audioCtx || !state.isPlaying) return;
    if (state.audioCtx.state === 'running') {
      state.audioCtx.suspend();
      state.isPaused = true;
      updateBufferedCounter();
    } else if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
      state.isPaused = false;
      updateBufferedCounter();
    }
    renderUI();
  }

  function exportSynthesizedWav() {
    if (!state.audioBuffers.size) {
      toast('အသံဖိုင်ထုတ်ရန် အရင်ဆုံး Play နှိပ်၍ နားထောင်ပါ');
      return;
    }
    const orderedKeys = Array.from(state.audioBuffers.keys()).sort((a, b) => a - b);
    let total = 0;
    orderedKeys.forEach(k => { total += state.audioBuffers.get(k).length; });
    const merged = new Float32Array(total);
    let off = 0;
    orderedKeys.forEach(k => {
      const b = state.audioBuffers.get(k);
      merged.set(b, off);
      off += b.length;
    });
    const blob = encodeWavBlob(merged, SAMPLE_RATE);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.articleId || 'htet-article'}-${state.selectedVoice}.wav`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast('WAV အသံဖိုင် ဒေါင်းလုဒ်ဆွဲပြီးပါပြီ ✓');
  }

  // ==================== CONSENT & DOWNLOAD PROGRESS DIALOG ====================
  function openConsentDialog(voiceId) {
    const dlg = document.getElementById('nara-tts-consent-dialog');
    if (!dlg) return;
    if (voiceId) {
      state.selectedVoice = voiceId;
      localStorage.setItem('htet_nara_voice', voiceId);
    }
    updateConsentDialogUI();
    if (!dlg.open) dlg.showModal();
  }

  function updateConsentDialogUI() {
    document.querySelectorAll('input[name="nara-consent-voice"]').forEach(r => {
      r.checked = (r.value === state.selectedVoice);
      const badge = r.closest('label')?.querySelector('.nara-voice-status-badge');
      if (badge) {
        const installed = state.installedVoices.has(r.value);
        badge.textContent = installed ? '✓ ဖုန်းထဲတွင် သွင်းပြီး' : '~181 MB';
        badge.className = installed
          ? 'nara-voice-status-badge text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
          : 'nara-voice-status-badge text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-stone-700 text-muted';
      }
    });

    const isInstalled = state.installedVoices.has(state.selectedVoice);
    const confirmBtn = document.getElementById('nara-consent-download-btn');
    const progBox = document.getElementById('nara-download-progress-box');
    const actionRow = document.getElementById('nara-consent-action-row');
    const clearRow = document.getElementById('nara-consent-clear-row');

    if (confirmBtn) {
      confirmBtn.innerHTML = isInstalled
        ? '<i class="ri-play-circle-line text-base" aria-hidden="true"></i> <span>သွင်းပြီးသား အသံဖြင့် ချက်ချင်းနားထောင်မည်</span>'
        : '<i class="ri-download-cloud-2-line text-base" aria-hidden="true"></i> <span>ဖုန်းထဲသို့ Download ဆွဲပြီး သွင်းမည် (~181 MB)</span>';
    }
    if (progBox) progBox.hidden = !state.downloading;
    if (actionRow) actionRow.hidden = state.downloading;
    if (clearRow) clearRow.hidden = (state.installedVoices.size === 0 || state.downloading);
  }

  async function handleConsentDownloadClick() {
    const dlg = document.getElementById('nara-tts-consent-dialog');
    if (state.installedVoices.has(state.selectedVoice)) {
      if (dlg && dlg.open) dlg.close('use-installed');
      state.mode = 'ondevice';
      renderUI();
      startOnDevicePlayback();
      return;
    }

    const progBox = document.getElementById('nara-download-progress-box');
    const actionRow = document.getElementById('nara-consent-action-row');
    const barEl = document.getElementById('nara-dl-bar');
    const fillEl = document.getElementById('nara-dl-fill');
    const pctEl = document.getElementById('nara-dl-pct');
    const fileEl = document.getElementById('nara-dl-file');
    const bytesEl = document.getElementById('nara-dl-bytes');
    const speedEl = document.getElementById('nara-dl-speed');
    const errEl = document.getElementById('nara-dl-error');

    if (errEl) { errEl.hidden = true; errEl.textContent = ''; }
    if (progBox) progBox.hidden = false;
    if (actionRow) actionRow.hidden = true;

    try {
      await downloadVoiceWithProgress(state.selectedVoice, (info) => {
        const pct = Math.min(100, (info.loadedBytes / info.totalBytes) * 100);
        if (barEl) barEl.value = Math.round(pct);
        if (fillEl) fillEl.style.width = `${pct.toFixed(1)}%`;
        if (pctEl) pctEl.textContent = `${pct.toFixed(1)}%`;
        if (fileEl) fileEl.textContent = `ဖိုင် (${info.fileIndex}/${info.fileCount}): ${info.fileName}`;
        if (bytesEl) bytesEl.textContent = `${formatMb(info.loadedBytes)} MB / ${formatMb(info.totalBytes)} MB`;
        if (speedEl) {
          const mbps = info.speedBps > 0 ? `${(info.speedBps / (1024 * 1024)).toFixed(2)} MB/s` : 'ချိတ်ဆက်နေသည်...';
          const eta = info.etaSec > 1 ? ` • ~${Math.ceil(info.etaSec)} စက္ကန့် ကျန်` : '';
          speedEl.textContent = `${mbps}${eta}`;
        }
      });

      toast(`Nara Mini v1 (${state.selectedVoice}) ကို ဖုန်းထဲသို့ သွင်းပြီးပါပြီ ✓`);
      if (dlg && dlg.open) dlg.close('downloaded');
      state.mode = 'ondevice';
      renderUI();
      startOnDevicePlayback();
    } catch (err) {
      if (errEl) {
        errEl.hidden = false;
        errEl.textContent = (err && err.name === 'AbortError')
          ? 'Download ဆွဲခြင်းကို ရပ်တန့်လိုက်ပါပြီ။'
          : `Download မအောင်မြင်ပါ — ${err.message || err}`;
      }
      if (progBox) progBox.hidden = true;
      if (actionRow) actionRow.hidden = false;
      updateConsentDialogUI();
    }
  }

  // ==================== UI RENDERING ====================
  function setPlayerStatus(msg, excerpt = '') {
    const statusEl = document.getElementById('nara-tts-status');
    const excerptEl = document.getElementById('nara-tts-excerpt');
    if (statusEl) statusEl.textContent = msg;
    if (excerptEl) {
      if (excerpt) {
        excerptEl.textContent = `“${excerpt}”`;
        excerptEl.hidden = false;
      } else if (!state.isPlaying) {
        excerptEl.hidden = true;
      }
    }
  }

  // ==================== METHOD 1: STUDIO INSTANT AUDIO PLAYER ====================
  function updatePreAudioUI() {
    const audio = state.audioEl;
    if (!audio || !state.pregeneratedTrack) return;

    const playBtn = document.getElementById('nara-pre-play-btn');
    const curEl = document.getElementById('nara-pre-cur-time');
    const durEl = document.getElementById('nara-pre-dur-time');
    const seekEl = document.getElementById('nara-pre-seek');
    const dlBtn = document.getElementById('nara-pre-download-btn');

    const playing = !audio.paused && !audio.ended;
    const dur = (Number.isFinite(audio.duration) && audio.duration > 0)
      ? audio.duration
      : (Number(state.pregeneratedTrack.duration_sec) || 0);
    const cur = Number.isFinite(audio.currentTime) ? audio.currentTime : 0;

    if (playBtn) {
      playBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      playBtn.innerHTML = playing
        ? '<i class="ri-pause-fill text-base" aria-hidden="true"></i><span>ခေတ္တရပ် (Pause)</span>'
        : (cur > 0.5 && cur < dur - 0.5
          ? '<i class="ri-play-fill text-base" aria-hidden="true"></i><span>ဆက်နားထောင်ရန် (Resume)</span>'
          : '<i class="ri-play-fill text-base" aria-hidden="true"></i><span>ချက်ချင်းနားထောင်ရန် (Play)</span>');
    }

    if (curEl) curEl.textContent = formatTime(cur);
    if (durEl) durEl.textContent = formatTime(dur);

    if (seekEl && !seekEl.dataset.scrubbing) {
      const maxVal = dur > 0 ? dur : 100;
      seekEl.max = String(maxVal);
      seekEl.value = String(Math.min(cur, maxVal));
    }

    if (dlBtn) {
      dlBtn.href = state.pregeneratedTrack.url;
      const ext = (state.pregeneratedTrack.url.split('.').pop() || 'mp3').split('?')[0];
      dlBtn.setAttribute('download', `${state.articleId || 'htet-audio'}-${state.pregeneratedTrack.voice || 'shoon'}.${ext}`);
    }
  }

  function wirePreAudioControls() {
    const audio = state.audioEl;
    if (!audio || audio.dataset.wired === '1') return;
    audio.dataset.wired = '1';

    const playBtn = document.getElementById('nara-pre-play-btn');
    const backBtn = document.getElementById('nara-pre-back15');
    const fwdBtn = document.getElementById('nara-pre-fwd15');
    const seekEl = document.getElementById('nara-pre-seek');

    playBtn?.addEventListener('click', async () => {
      if (!state.pregeneratedTrack) return;
      stopOnDevicePlayback(false);
      try {
        audio.playbackRate = state.speed;
        if (audio.paused || audio.ended) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch (err) {
        console.error('[NaraTTS] Instant audio playback error:', err);
        toast('အသံဖိုင် ဖွင့်၍မရပါ — ကျေးဇူးပြု၍ ထပ်မံကြိုးစားပါ');
      }
      updatePreAudioUI();
    });

    backBtn?.addEventListener('click', () => {
      if (!audio) return;
      audio.currentTime = Math.max(0, (audio.currentTime || 0) - 15);
      updatePreAudioUI();
    });

    fwdBtn?.addEventListener('click', () => {
      if (!audio) return;
      const dur = (Number.isFinite(audio.duration) && audio.duration > 0)
        ? audio.duration
        : (Number(state.pregeneratedTrack?.duration_sec) || 0);
      audio.currentTime = dur > 0 ? Math.min(dur, (audio.currentTime || 0) + 15) : (audio.currentTime || 0) + 15;
      updatePreAudioUI();
    });

    if (seekEl) {
      seekEl.addEventListener('pointerdown', () => { seekEl.dataset.scrubbing = '1'; });
      seekEl.addEventListener('pointerup', () => { delete seekEl.dataset.scrubbing; });
      seekEl.addEventListener('input', () => {
        const target = parseFloat(seekEl.value);
        if (Number.isFinite(target)) {
          const curEl = document.getElementById('nara-pre-cur-time');
          if (curEl) curEl.textContent = formatTime(target);
        }
      });
      seekEl.addEventListener('change', () => {
        delete seekEl.dataset.scrubbing;
        const target = parseFloat(seekEl.value);
        if (Number.isFinite(target)) audio.currentTime = target;
        updatePreAudioUI();
      });
    }

    ['loadedmetadata', 'durationchange', 'timeupdate', 'play', 'pause', 'ended', 'ratechange'].forEach(ev => {
      audio.addEventListener(ev, updatePreAudioUI);
    });
  }

  function renderUI() {
    const root = document.getElementById('nara-tts-player');
    if (!root) return;

    const hasPre = Boolean(state.pregeneratedTrack);
    const activeMode = (state.mode === 'auto') ? (hasPre ? 'pregenerated' : 'ondevice') : state.mode;

    const modeBadge = document.getElementById('nara-mode-badge');
    const prePane = document.getElementById('nara-pregenerated-pane');
    const aiPane = document.getElementById('nara-ondevice-pane');
    const switchToPreBtn = document.getElementById('nara-switch-pre');
    const switchToAiBtn = document.getElementById('nara-switch-ai');

    if (switchToPreBtn) {
      switchToPreBtn.hidden = !hasPre;
      switchToPreBtn.setAttribute('aria-pressed', activeMode === 'pregenerated' ? 'true' : 'false');
    }
    if (switchToAiBtn) {
      switchToAiBtn.setAttribute('aria-pressed', activeMode === 'ondevice' ? 'true' : 'false');
    }

    if (prePane) prePane.hidden = (activeMode !== 'pregenerated');
    if (aiPane) aiPane.hidden = (activeMode !== 'ondevice');

    if (modeBadge) {
      if (activeMode === 'pregenerated') {
        const durTxt = state.pregeneratedTrack.duration_sec ? ` • ${formatTime(state.pregeneratedTrack.duration_sec)}` : '';
        modeBadge.textContent = `⚡ အသင့်နားထောင်နိုင်သော MP3 အသံဖိုင် (0.0s Instant Play${durTxt})`;
      } else if (state.installedVoices.has(state.selectedVoice)) {
        modeBadge.textContent = `✓ Offline AI Voice (${state.selectedVoice}) ဖုန်းထဲတွင် သွင်းပြီး • Gapless Fast Engine`;
      } else {
        modeBadge.textContent = 'On-Device AI Voice — User ခွင့်ပြုမှသာ Download ဆွဲမည် (~181 MB)';
      }
    }

    const voiceSel = document.getElementById('nara-voice-select');
    if (voiceSel) {
      Array.from(voiceSel.options).forEach(opt => {
        const v = VOICES.find(x => x.id === opt.value);
        if (v) {
          opt.textContent = state.installedVoices.has(v.id)
            ? `✓ ${v.labelMm} [သွင်းပြီး]`
            : `${v.labelMm} [Download ~181 MB]`;
        }
      });
      voiceSel.value = state.selectedVoice;
    }

    const playBtn = document.getElementById('nara-play-btn');
    const pauseBtn = document.getElementById('nara-pause-btn');
    const stopBtn = document.getElementById('nara-stop-btn');
    const prevBtn = document.getElementById('nara-prev-btn');
    const nextBtn = document.getElementById('nara-next-btn');
    const wavBtn = document.getElementById('nara-export-wav-btn');
    const manageBtn = document.getElementById('nara-manage-models-btn');

    const installed = state.installedVoices.has(state.selectedVoice);
    if (playBtn) {
      if (!installed) {
        playBtn.innerHTML = '<i class="ri-download-cloud-2-line text-base" aria-hidden="true"></i><span>AI အသံစနစ် သွင်း၍ နားထောင်ရန်</span>';
      } else if (state.isPlaying && !state.isPaused) {
        playBtn.innerHTML = '<i class="ri-volume-up-line text-base animate-pulse" aria-hidden="true"></i><span>ဖတ်ပြနေသည်...</span>';
      } else {
        playBtn.innerHTML = '<i class="ri-play-fill text-base" aria-hidden="true"></i><span>AI အသံဖြင့် ဖတ်ပြရန် (Play)</span>';
      }
    }
    if (pauseBtn) {
      pauseBtn.hidden = !state.isPlaying;
      pauseBtn.innerHTML = state.isPaused
        ? '<i class="ri-play-line" aria-hidden="true"></i><span>ဆက်ဖွင့်</span>'
        : '<i class="ri-pause-line" aria-hidden="true"></i><span>ခေတ္တရပ်</span>';
    }
    if (stopBtn) stopBtn.hidden = !state.isPlaying;
    if (prevBtn) prevBtn.disabled = !state.isPlaying || state.currentChunkIdx <= 0;
    if (nextBtn) nextBtn.disabled = !state.isPlaying || state.currentChunkIdx >= state.chunks.length - 1;
    if (wavBtn) wavBtn.hidden = (state.audioBuffers.size === 0);
    if (manageBtn) {
      manageBtn.textContent = state.installedVoices.size > 0
        ? `Model စီမံရန် (${state.installedVoices.size} သွင်းပြီး)`
        : 'AI Voice ရွေး / Download ဆွဲရန်';
    }

    if (hasPre && state.audioEl) {
      const expectedSrc = state.pregeneratedTrack.url;
      if (state.audioEl.dataset.loadedSrc !== expectedSrc) {
        state.audioEl.src = expectedSrc;
        state.audioEl.dataset.loadedSrc = expectedSrc;
        state.audioEl.playbackRate = state.speed;
      }
      const preMeta = document.getElementById('nara-pre-meta');
      if (preMeta) {
        const vLabel = getVoiceLabel(state.pregeneratedTrack.voice || 'shoon');
        const sz = state.pregeneratedTrack.size || '';
        const dur = state.pregeneratedTrack.duration_sec ? formatTime(state.pregeneratedTrack.duration_sec) : '';
        preMeta.textContent = `⚡ ${vLabel}${dur ? ' • ' + dur : ''}${sz ? ' • ' + sz : ''} • Nara Mini v1`;
      }
      updatePreAudioUI();
    }
  }

  // ==================== INITIALIZATION ====================
  async function loadAudioManifest() {
    // 1. Prefer live JSON on http(s), but gracefully fall back (or start immediately) with backup JS on file://
    const isFileProto = window.location.protocol === 'file:';
    if (isFileProto && window.HTET_AUDIO_MANIFEST_BACKUP) {
      return window.HTET_AUDIO_MANIFEST_BACKUP;
    }
    try {
      const resp = await fetch('data/audio-manifest.json');
      if (resp.ok) return await resp.json();
    } catch (err) {}
    if (window.HTET_AUDIO_MANIFEST_BACKUP) {
      return window.HTET_AUDIO_MANIFEST_BACKUP;
    }
    return null;
  }

  async function initNaraTTS() {
    const root = document.getElementById('nara-tts-player');
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    state.articleId = params.get('id')
      || (window.Reader && window.Reader.articleData && window.Reader.articleData.id)
      || (Array.isArray(window.HTET_ARTICLES_BACKUP) && window.HTET_ARTICLES_BACKUP[0] && window.HTET_ARTICLES_BACKUP[0].id)
      || '';
    state.audioEl = document.getElementById('nara-pre-audio');

    state.manifest = await loadAudioManifest();
    
    function resolvePregeneratedTrack() {
      const isEn = (document.documentElement.getAttribute('data-lang') === 'en') ||
                   (localStorage.getItem('site_lang') === 'en');
      const baseId = state.articleId ? state.articleId.replace(/-mm$/, '') : '';
      const enTrackId = baseId ? (baseId + '-en') : '';
      if (isEn && enTrackId && state.manifest && state.manifest.tracks && state.manifest.tracks[enTrackId]) {
        return state.manifest.tracks[enTrackId];
      }
      if (state.articleId && state.manifest && state.manifest.tracks && state.manifest.tracks[state.articleId]) {
        return state.manifest.tracks[state.articleId];
      }
      if (enTrackId && state.manifest && state.manifest.tracks && state.manifest.tracks[enTrackId]) {
        return state.manifest.tracks[enTrackId];
      }
      return null;
    }

    state.pregeneratedTrack = resolvePregeneratedTrack();

    // Re-resolve track if user toggles language between MM and EN
    window.addEventListener('languageChanged', () => {
      const updated = resolvePregeneratedTrack();
      if (updated && updated !== state.pregeneratedTrack) {
        state.pregeneratedTrack = updated;
        if (state.audioEl) {
          state.audioEl.dataset.loadedSrc = '';
        }
        renderUI();
      }
    });

    wirePreAudioControls();
    await scanInstalledVoices();

    const voiceSel = document.getElementById('nara-voice-select');
    if (voiceSel) {
      voiceSel.addEventListener('change', () => {
        stopOnDevicePlayback(false);
        state.audioBuffers.clear();
        state.synthPromises.clear();
        state.selectedVoice = voiceSel.value;
        localStorage.setItem('htet_nara_voice', state.selectedVoice);
        renderUI();
      });
    }

    const speedSel = document.getElementById('nara-speed-select');
    if (speedSel) {
      speedSel.value = String(state.speed);
      speedSel.addEventListener('change', () => {
        state.speed = parseFloat(speedSel.value) || 1.0;
        localStorage.setItem('htet_nara_speed', String(state.speed));
        if (state.audioEl) state.audioEl.playbackRate = state.speed;
        // Re-schedule cleanly from current chunk at new speed if currently playing
        if (state.isPlaying && !state.isPaused) {
          startOnDevicePlayback(state.currentChunkIdx);
        }
      });
    }

    document.getElementById('nara-switch-pre')?.addEventListener('click', () => {
      stopOnDevicePlayback(false);
      state.mode = 'pregenerated';
      renderUI();
    });
    document.getElementById('nara-switch-ai')?.addEventListener('click', () => {
      if (state.audioEl && !state.audioEl.paused) state.audioEl.pause();
      state.mode = 'ondevice';
      renderUI();
    });

    document.getElementById('nara-play-btn')?.addEventListener('click', () => {
      if (state.isPlaying && state.isPaused) togglePauseOnDevice();
      else startOnDevicePlayback();
    });
    document.getElementById('nara-pause-btn')?.addEventListener('click', togglePauseOnDevice);
    document.getElementById('nara-stop-btn')?.addEventListener('click', () => {
      stopOnDevicePlayback(true);
      setPlayerStatus('ရပ်တန့်လိုက်ပါပြီ။');
    });
    document.getElementById('nara-prev-btn')?.addEventListener('click', () => {
      if (state.currentChunkIdx > 0) startOnDevicePlayback(state.currentChunkIdx - 1);
    });
    document.getElementById('nara-next-btn')?.addEventListener('click', () => {
      if (state.currentChunkIdx < state.chunks.length - 1) startOnDevicePlayback(state.currentChunkIdx + 1);
    });
    document.getElementById('nara-export-wav-btn')?.addEventListener('click', exportSynthesizedWav);
    document.getElementById('nara-manage-models-btn')?.addEventListener('click', () => openConsentDialog(state.selectedVoice));

    const dlg = document.getElementById('nara-tts-consent-dialog');
    if (dlg) {
      dlg.addEventListener('close', () => {
        if (state.downloading && state.abortCtrl) state.abortCtrl.abort();
        dlg.returnValue = '';
      });
      document.querySelectorAll('input[name="nara-consent-voice"]').forEach(radio => {
        radio.addEventListener('change', () => {
          state.selectedVoice = radio.value;
          localStorage.setItem('htet_nara_voice', state.selectedVoice);
          updateConsentDialogUI();
          renderUI();
        });
      });
      document.getElementById('nara-consent-download-btn')?.addEventListener('click', handleConsentDownloadClick);
      document.getElementById('nara-dl-cancel-btn')?.addEventListener('click', () => {
        if (state.abortCtrl) state.abortCtrl.abort();
      });
      document.getElementById('nara-clear-cache-btn')?.addEventListener('click', async () => {
        await clearCachedModels(null);
        updateConsentDialogUI();
      });
    }

    renderUI();
  }

  window.NaraHybridTTS = {
    init: initNaraTTS,
    openConsentDialog,
    clearCachedModels
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNaraTTS);
  } else {
    initNaraTTS();
  }
})();
