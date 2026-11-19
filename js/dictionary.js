/**
 * Htet Official — Dual-Direction Dictionary, 12K+ Parallel Corpus & BurmeseNLP Controller
 * Integrates:
 *   - Ornagai English-Myanmar Dictionary (111,232 words)
 *   - Reverse Myanmar-to-English Headwords Index (196,202 pairs)
 *   - Myanmar Tools myanmar-words (42,787 categorized words & POS)
 *   - HuggingFace kalixlouiis Myanmar-English Parallel Translation Corpus (12,021 pairs)
 *   - BurmeseNLP Engine (Zawgyi/Unicode normalization, Sylbreak, Segmentation, POS)
 *   - Mozilla PDF.js In-Browser Offline Academic Reader
 */

(function() {
  'use strict';

  const enCache = {};
  const myCache = {};
  const mwCache = {};
  let currentEnWord = null;
  let currentMyWord = null;
  let activeLetter = null;
  let activeConsonant = 'ka';
  let activePosFilter = 'n';
  let searchDirection = 'auto'; // 'auto', 'en-my', 'my-en'
  let bookmarks = [];

  try {
    bookmarks = JSON.parse(localStorage.getItem('htet_dict_bookmarks') || '[]');
  } catch(e) {
    bookmarks = [];
  }

  // -------------------------------------------------------------
  // 1. HELPERS & DETECTION
  // -------------------------------------------------------------
  const MYANMAR_CHAR_REGEX = /[\u1000-\u109F]/;

  function isMyanmarText(str) {
    return MYANMAR_CHAR_REGEX.test(str);
  }

  function getEnBucket(str) {
    if (!str) return 'other';
    const ch = str.trim()[0].toLowerCase();
    if (ch >= 'a' && ch <= 'z') return ch;
    return 'other';
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlightKeyword(text, keyword) {
    if (!text || !keyword) return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const escapedKw = escapeHtml(keyword).trim();
    if (!escapedKw) return escapedText;
    try {
      const re = new RegExp(`(${escapedKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return escapedText.replace(re, '<mark class="bg-teal-500/20 text-teal-900 dark:text-teal-200 px-1 py-0.5 rounded font-bold">$1</mark>');
    } catch (e) {
      return escapedText;
    }
  }

  // -------------------------------------------------------------
  // 2. PARALLEL SENTENCE SEARCH (12,021 PAIRS CORPUS)
  // -------------------------------------------------------------
  function findSentenceExamples(query, limit = 4) {
    if (!window.HTET_TRANSLATIONS || !query) return [];
    const qLower = String(query).toLowerCase().trim();
    if (!qLower) return [];
    const results = [];
    const list = window.HTET_TRANSLATIONS;
    const isMm = isMyanmarText(qLower);

    for (let i = 0; i < list.length; i++) {
      const pair = list[i];
      let match = false;
      if (isMm) {
        if (pair.my.indexOf(qLower) !== -1) match = true;
      } else {
        const enLower = pair.en.toLowerCase();
        if (enLower.indexOf(qLower) !== -1) match = true;
      }
      if (match) {
        results.push(pair);
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  function searchSentences(query) {
    const listEl = document.getElementById('sentence-results-list');
    const countEl = document.getElementById('sentence-match-count');
    const emptyEl = document.getElementById('sentence-empty-state');
    if (!listEl) return;

    const raw = String(query || '').trim();
    if (!raw) {
      listEl.innerHTML = '';
      if (countEl) countEl.textContent = 'ဝါကျပေါင်း ၁၂,၀၂၁ ခု အသင့်ရှိသည်';
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    let processed = raw;
    if (window.BurmeseNLP && window.BurmeseNLP.isZawgyi(raw)) {
      processed = window.BurmeseNLP.zg2uni(raw);
    }

    const matches = findSentenceExamples(processed, 50);

    if (countEl) {
      countEl.textContent = `တွေ့ရှိမှု ${matches.length} ခု (ရှာဖွေချက်: "${processed}")`;
    }

    if (matches.length === 0) {
      listEl.innerHTML = `
        <div class="p-8 text-center rounded-2xl bg-card border border-hairline text-muted space-y-2">
          <i class="ri-file-search-line text-3xl text-teal-600"></i>
          <p class="font-medium text-sm text-charcoal">ကိုက်ညီသော ဝါကျ မတွေ့ရှိပါ</p>
          <p class="text-xs">အခြားစကားလုံး သို့မဟုတ် ဝေါဟာရအသစ်ဖြင့် ထပ်မံစမ်းသပ်ကြည့်ပါ</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = matches.map((m, idx) => `
      <div class="p-4 sm:p-5 rounded-2xl bg-card border border-hairline/80 hover:border-teal-500/50 shadow-2xs transition-all space-y-2.5 group">
        <div class="flex items-start justify-between gap-3">
          <div class="space-y-1">
            <span class="inline-flex items-center space-x-1 text-[10px] font-mono text-muted">
              <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
              <span>PAIRS #${m.id || (idx + 1)}</span>
            </span>
            <p class="text-sm sm:text-base font-semibold text-charcoal leading-relaxed font-sans-ui">
              ${highlightKeyword(m.en, processed)}
            </p>
          </div>
          <div class="flex items-center space-x-1 shrink-0 pt-1">
            <button onclick="window.HtetDict.speak('${escapeHtml(m.en).replace(/'/g, "\\'")}')" class="p-2 rounded-lg bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-vermilion transition-all text-xs" title="အင်္ဂလိပ် အသံနားထောင်ရန် (Speech Synthesis)">
              <i class="ri-volume-up-line"></i>
            </button>
            <button onclick="window.HtetDict.copyDef('${escapeHtml(m.en).replace(/'/g, "\\'")}')" class="p-2 rounded-lg bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-teal-600 transition-all text-xs" title="English ကူးယူရန်">
              <i class="ri-file-copy-line"></i>
            </button>
          </div>
        </div>

        <div class="pt-2 border-t border-hairline/60 flex items-start justify-between gap-3">
          <p class="text-xs sm:text-sm text-muted font-sans-ui leading-relaxed">
            ${highlightKeyword(m.my, processed)}
          </p>
          <button onclick="window.HtetDict.copyDef('${escapeHtml(m.my).replace(/'/g, "\\'")}')" class="p-2 rounded-lg bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-teal-600 transition-all text-xs shrink-0" title="မြန်မာပြန် ကူးယူရန်">
            <i class="ri-file-copy-2-line"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  // -------------------------------------------------------------
  // 3. ENGLISH ORNAGAI PARTITION LOADER
  // -------------------------------------------------------------
  function loadEnLetter(letter) {
    letter = getEnBucket(letter);
    if (enCache[letter]) return Promise.resolve(enCache[letter]);

    const varName = `HTET_DICT_${letter.toUpperCase()}`;
    if (window[varName]) {
      enCache[letter] = window[varName];
      return Promise.resolve(enCache[letter]);
    }

    return new Promise((resolve) => {
      const isFileProto = window.location.protocol === 'file:';
      if (!isFileProto) {
        fetch(`data/dictionary/${letter}.json`)
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data) {
              enCache[letter] = data;
              window[varName] = data;
              resolve(data);
              return;
            }
            throw new Error('Not found');
          })
          .catch(() => loadEnScriptTag(letter, varName, resolve));
      } else {
        loadEnScriptTag(letter, varName, resolve);
      }
    });
  }

  function loadEnScriptTag(letter, varName, resolve) {
    const s = document.createElement('script');
    s.src = `js/data/dictionary/${letter}.js`;
    s.async = true;
    s.onload = () => {
      enCache[letter] = window[varName] || {};
      resolve(enCache[letter]);
    };
    s.onerror = () => {
      enCache[letter] = {};
      resolve({});
    };
    document.head.appendChild(s);
  }

  // -------------------------------------------------------------
  // 4. REVERSE MYANMAR-TO-ENGLISH PARTITION LOADER
  // -------------------------------------------------------------
  function loadMyReverseLetter(bucket) {
    bucket = (bucket || 'ka').toLowerCase();
    if (myCache[bucket]) return Promise.resolve(myCache[bucket]);

    const varName = `HTET_DICT_MY_${bucket.toUpperCase()}`;
    if (window[varName]) {
      myCache[bucket] = window[varName];
      return Promise.resolve(myCache[bucket]);
    }

    return new Promise((resolve) => {
      const isFileProto = window.location.protocol === 'file:';
      if (!isFileProto) {
        fetch(`data/dictionary/reverse/${bucket}.json`)
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data) {
              myCache[bucket] = data;
              window[varName] = data;
              resolve(data);
              return;
            }
            throw new Error('Not found');
          })
          .catch(() => loadMyReverseScriptTag(bucket, varName, resolve));
      } else {
        loadMyReverseScriptTag(bucket, varName, resolve);
      }
    });
  }

  function loadMyReverseScriptTag(bucket, varName, resolve) {
    const s = document.createElement('script');
    s.src = `js/data/dictionary/reverse/${bucket}.js`;
    s.async = true;
    s.onload = () => {
      myCache[bucket] = window[varName] || {};
      resolve(myCache[bucket]);
    };
    s.onerror = () => {
      myCache[bucket] = {};
      resolve({});
    };
    document.head.appendChild(s);
  }

  // -------------------------------------------------------------
  // 5. MYANMAR WORDS (MYANMAR TOOLS) PARTITION LOADER
  // -------------------------------------------------------------
  function loadMyanmarWordsPartition(bucket) {
    bucket = (bucket || 'ka').toLowerCase();
    if (mwCache[bucket]) return Promise.resolve(mwCache[bucket]);

    const varName = `HTET_MW_${bucket.toUpperCase()}`;
    if (window[varName]) {
      mwCache[bucket] = window[varName];
      return Promise.resolve(mwCache[bucket]);
    }

    return new Promise((resolve) => {
      const isFileProto = window.location.protocol === 'file:';
      if (!isFileProto) {
        fetch(`data/myanmar-words/${bucket}.json`)
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data) {
              mwCache[bucket] = data;
              window[varName] = data;
              resolve(data);
              return;
            }
            throw new Error('Not found');
          })
          .catch(() => loadMwScriptTag(bucket, varName, resolve));
      } else {
        loadMwScriptTag(bucket, varName, resolve);
      }
    });
  }

  function loadMwScriptTag(bucket, varName, resolve) {
    const s = document.createElement('script');
    s.src = `js/data/myanmar-words/${bucket}.js`;
    s.async = true;
    s.onload = () => {
      mwCache[bucket] = window[varName] || {};
      resolve(mwCache[bucket]);
    };
    s.onerror = () => {
      mwCache[bucket] = {};
      resolve({});
    };
    document.head.appendChild(s);
  }

  // -------------------------------------------------------------
  // 6. BIDIRECTIONAL LOOKUP ENGINE
  // -------------------------------------------------------------
  async function lookup(word) {
    if (!word) return;
    const raw = String(word).trim();
    if (!raw) return;

    let isZg = false;
    let query = raw;
    if (window.BurmeseNLP && window.BurmeseNLP.isZawgyi(raw)) {
      isZg = true;
      query = window.BurmeseNLP.zg2uni(raw);
    }

    const isMy = isMyanmarText(query);
    updateDirectionBadge(isMy ? 'my-en' : 'en-my', isZg);

    if (isMy) {
      await lookupMyanmarWord(query, isZg, raw);
    } else {
      await lookupEnglishWord(query);
    }
  }

  async function lookupEnglishWord(word) {
    currentEnWord = word.trim().toLowerCase();
    currentMyWord = null;
    const letter = getEnBucket(currentEnWord);

    const statusEl = document.getElementById('dict-search-status');
    if (statusEl) statusEl.textContent = `ရှာဖွေနေပါသည်: "${word}"...`;

    let entry = (window.HTET_DICT_COMMON && window.HTET_DICT_COMMON[currentEnWord]) || null;

    if (!entry) {
      const letterDict = await loadEnLetter(letter);
      entry = letterDict[currentEnWord] || null;
    }

    if (statusEl) statusEl.textContent = '';

    if (entry) {
      renderEnDefinitionCard(currentEnWord, entry);
      updateActiveLetter(letter);
    } else {
      renderNotFoundCard(currentEnWord, 'en');
    }
  }

  async function lookupMyanmarWord(myWord, isZg, rawInput) {
    currentMyWord = myWord.trim();
    currentEnWord = null;

    const statusEl = document.getElementById('dict-search-status');
    if (statusEl) statusEl.textContent = `မြန်မာဝေါဟာရ ရှာဖွေနေပါသည်: "${myWord}"...`;

    const bucket = window.BurmeseNLP ? window.BurmeseNLP.getConsonantBucket(myWord) : 'ka';

    let enMatches = (window.HTET_DICT_MY_COMMON && window.HTET_DICT_MY_COMMON[myWord]) || null;

    if (!enMatches || enMatches.length === 0) {
      const revDict = await loadMyReverseLetter(bucket);
      enMatches = revDict[myWord] || [];
    }

    const mwDict = await loadMyanmarWordsPartition(bucket);
    const mwInfo = mwDict[myWord] || null;

    let segmentTokens = [];
    if (window.BurmeseNLP) {
      segmentTokens = window.BurmeseNLP.wordTokenize(myWord);
    }

    if (statusEl) statusEl.textContent = '';

    renderMyReverseDefinitionCard(myWord, enMatches, mwInfo, segmentTokens, isZg, rawInput);
  }

  // -------------------------------------------------------------
  // 7. RENDER CARDS WITH LIVE PARALLEL SENTENCES
  // -------------------------------------------------------------
  function renderEnDefinitionCard(word, senses) {
    const cardEl = document.getElementById('dict-def-card');
    const emptyEl = document.getElementById('dict-empty-state');
    if (!cardEl) return;
    if (emptyEl) emptyEl.classList.add('hidden');

    const firstSense = senses[0] || {};
    const ipa = firstSense.i || '';
    const mmPhonetic = firstSense.m || '';
    const isBookmarked = bookmarks.includes(word);

    // Fetch matching sentence examples from 12K+ corpus
    const examples = findSentenceExamples(word, 4);

    let html = `
      <div class="p-6 md:p-8 rounded-3xl bg-card border border-hairline shadow-sm space-y-6 animate-fade-in">
        <!-- Word Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
          <div class="space-y-1">
            <div class="flex items-center space-x-3">
              <h2 class="text-3xl sm:text-4xl font-black font-serif-editorial text-charcoal tracking-tight m-0">
                ${escapeHtml(word)}
              </h2>
              <button onclick="window.HtetDict.speak('${escapeHtml(word)}')" class="w-9 h-9 rounded-full bg-vermilion/10 text-vermilion hover:bg-vermilion hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-xs" title="အသံထွက် နားထောင်ရန်">
                <i class="ri-volume-up-line text-lg"></i>
              </button>
            </div>
            
            <div class="flex flex-wrap items-center gap-2 pt-1">
              ${ipa ? `<span class="px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-xs border border-hairline">${escapeHtml(ipa)}</span>` : ''}
              ${mmPhonetic ? `<span class="text-xs text-muted font-sans-ui flex items-center space-x-1"><i class="ri-voiceprint-line text-vermilion"></i><span>အသံထွက်: <strong>${escapeHtml(mmPhonetic)}</strong></span></span>` : ''}
            </div>
          </div>

          <div class="flex items-center space-x-2 shrink-0">
            <button onclick="window.HtetDict.toggleBookmark('${escapeHtml(word)}')" class="p-2.5 rounded-xl border border-hairline bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-vermilion transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer">
              <i class="${isBookmarked ? 'ri-bookmark-fill text-amber-500' : 'ri-bookmark-line'} text-sm"></i>
              <span>${isBookmarked ? 'သိမ်းဆည်းပြီး' : 'မှတ်သားမည်'}</span>
            </button>
            <button onclick="window.HtetDict.copyDef('${escapeHtml(word)}')" class="p-2.5 rounded-xl border border-hairline bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-vermilion transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer" title="ကူးယူရန်">
              <i class="ri-file-copy-line text-sm"></i>
              <span>ကူးယူ</span>
            </button>
          </div>
        </div>

        <!-- Senses & Definitions List -->
        <div class="space-y-4">
          <h3 class="text-xs font-bold text-muted uppercase tracking-wider font-mono">အဓိပ္ပာယ် ဖွင့်ဆိုချက်များ (${senses.length})</h3>
          <div class="space-y-3">
    `;

    senses.forEach((sense, idx) => {
      const pos = sense.p || 'pos';
      const def = sense.d || '';
      const posLabel = (window.BurmeseNLP && window.BurmeseNLP.POS_TAGS && window.BurmeseNLP.POS_TAGS[pos]) 
        ? window.BurmeseNLP.POS_TAGS[pos].name 
        : pos;

      html += `
        <div class="p-4 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline/80 space-y-2">
          <div class="flex items-center space-x-2">
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-400/30">
              ${escapeHtml(pos)} • ${escapeHtml(posLabel)}
            </span>
            <span class="text-xs text-muted font-mono">#${idx + 1}</span>
          </div>
          <p class="text-base sm:text-lg text-charcoal font-sans-ui font-medium leading-relaxed pl-1">
            ${escapeHtml(def)}
          </p>
        </div>
      `;
    });

    html += `</div></div>`;

    // 12K+ Parallel Sentence Examples Section
    if (examples && examples.length > 0) {
      html += `
        <div class="pt-6 border-t border-hairline space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-charcoal font-sans-ui flex items-center space-x-1.5 uppercase tracking-wider">
              <i class="ri-translate-2 text-teal-600"></i>
              <span>စကားစပ်ဝါကျ နမူနာများ (12K+ Parallel Corpus)</span>
            </h4>
            <button onclick="window.HtetDict.switchTab('tab-sentences'); document.getElementById('sentence-search-input').value = '${escapeHtml(word)}'; window.HtetDict.searchSentences('${escapeHtml(word)}');" class="text-[11px] text-teal-600 hover:text-teal-700 font-semibold cursor-pointer">
              ဝါကျအားလုံး ကြည့်ရန် →
            </button>
          </div>
          <div class="space-y-2.5">
            ${examples.map(ex => `
              <div class="p-3.5 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline/80 space-y-1.5 text-xs">
                <div class="flex items-start justify-between gap-2">
                  <p class="font-medium text-charcoal/90 leading-relaxed font-sans-ui">${highlightKeyword(ex.en, word)}</p>
                  <button onclick="window.HtetDict.speak('${escapeHtml(ex.en).replace(/'/g, "\\'")}')" class="text-muted hover:text-vermilion p-1 shrink-0" title="အသံနားထောင်ရန်">
                    <i class="ri-volume-up-line"></i>
                  </button>
                </div>
                <p class="text-muted font-sans-ui leading-relaxed">${highlightKeyword(ex.my, word)}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    html += `</div>`;
    cardEl.innerHTML = html;
  }

  function renderMyReverseDefinitionCard(word, enMatches, mwInfo, segmentTokens, isZg, rawInput) {
    const cardEl = document.getElementById('dict-def-card');
    const emptyEl = document.getElementById('dict-empty-state');
    if (!cardEl) return;
    if (emptyEl) emptyEl.classList.add('hidden');

    const examples = findSentenceExamples(word, 4);

    let html = `
      <div class="p-6 md:p-8 rounded-3xl bg-card border border-hairline shadow-sm space-y-6 animate-fade-in">
        <!-- Word Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-hairline">
          <div class="space-y-1">
            <div class="flex items-center space-x-3">
              <h2 class="text-3xl sm:text-4xl font-black font-serif-editorial text-charcoal tracking-tight m-0">
                ${escapeHtml(word)}
              </h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-400/30">
                မြန်မာ ➔ အင်္ဂလိပ်
              </span>
            </div>
            
            ${isZg ? `
              <div class="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs border border-amber-400/30 flex items-center space-x-2">
                <i class="ri-alert-line text-sm"></i>
                <span>Zawgyi စာလုံးပေါင်းမှ Unicode သို့ အလိုအလျောက် ပြောင်းလဲရှာဖွေထားပါသည် ("${escapeHtml(rawInput)}" ➔ "${escapeHtml(word)}")</span>
              </div>
            ` : ''}

            <!-- Tokenized Breakdown -->
            ${segmentTokens && segmentTokens.length > 1 ? `
              <div class="flex items-center space-x-1.5 pt-1 text-xs text-muted">
                <span class="font-bold">စကားလုံး ခွဲခြမ်းမှု:</span>
                <div class="flex flex-wrap gap-1">
                  ${segmentTokens.map(tok => `
                    <button onclick="window.HtetDict.lookup('${escapeHtml(tok)}')" class="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-charcoal hover:text-vermilion text-xs font-sans-ui border border-hairline cursor-pointer">
                      ${escapeHtml(tok)}
                    </button>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>

          <div class="flex items-center space-x-2 shrink-0">
            <button onclick="window.HtetDict.copyDef('${escapeHtml(word)}')" class="p-2.5 rounded-xl border border-hairline bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-vermilion transition-all flex items-center space-x-1.5 text-xs font-semibold cursor-pointer">
              <i class="ri-file-copy-line text-sm"></i>
              <span>ကူးယူ</span>
            </button>
          </div>
        </div>

        <!-- POS Info from Myanmar Tools -->
        ${mwInfo ? `
          <div class="p-4 rounded-2xl bg-teal-500/5 border border-teal-500/20 space-y-1">
            <div class="flex items-center space-x-2">
              <span class="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase font-mono">
                သဒ္ဒါအမျိုးအစား (Myanmar Tools Lexicon):
              </span>
              <span class="px-2 py-0.5 rounded-md bg-teal-600 text-white text-[10px] font-mono font-bold">
                ${escapeHtml(mwInfo.pos || 'n')}
              </span>
            </div>
            ${mwInfo.sources ? `<p class="text-xs text-muted">ရင်းမြစ်: ${escapeHtml(mwInfo.sources.join(', '))}</p>` : ''}
          </div>
        ` : ''}

        <!-- English Matches from Reverse Ornagai -->
        <div class="space-y-4">
          <h3 class="text-xs font-bold text-muted uppercase tracking-wider font-mono">
            ကိုက်ညီသော အင်္ဂလိပ် ဝေါဟာရများ (${enMatches ? enMatches.length : 0})
          </h3>

          ${enMatches && enMatches.length > 0 ? `
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${enMatches.map(m => `
                <div class="p-4 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline/80 hover:border-teal-500/40 transition-all space-y-1 group">
                  <div class="flex items-center justify-between">
                    <button onclick="window.HtetDict.lookup('${escapeHtml(m.word)}')" class="text-base sm:text-lg font-bold font-serif-editorial text-charcoal group-hover:text-vermilion transition-colors cursor-pointer text-left">
                      ${escapeHtml(m.word)}
                    </button>
                    <button onclick="window.HtetDict.speak('${escapeHtml(m.word)}')" class="text-muted hover:text-vermilion p-1" title="အသံနားထောင်ရန်">
                      <i class="ri-volume-up-line"></i>
                    </button>
                  </div>
                  <div class="flex items-center space-x-2 text-xs">
                    <span class="px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-mono text-muted uppercase">${escapeHtml(m.pos)}</span>
                    <span class="text-muted font-sans-ui truncate">${escapeHtml(m.def)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="p-6 rounded-2xl bg-cream/30 dark:bg-stone-900/30 border border-hairline text-center space-y-2">
              <p class="text-sm text-muted">ဤမြန်မာစကားလုံးအတွက် တိုက်ရိုက်အင်္ဂလိပ်ဝေါဟာရ မတွေ့ရှိသေးပါ။</p>
              <p class="text-xs text-muted">ဝေါဟာရ အစိတ်အပိုင်းများကို ခွဲခြမ်း၍ အထက်တွင် ရှာဖွေနိုင်ပါသည်။</p>
            </div>
          `}
        </div>
      `;

      // Parallel Sentences
      if (examples && examples.length > 0) {
        html += `
          <div class="pt-6 border-t border-hairline space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-charcoal font-sans-ui flex items-center space-x-1.5 uppercase tracking-wider">
                <i class="ri-translate-2 text-teal-600"></i>
                <span>စကားစပ်ဝါကျ နမူနာများ (12K+ Parallel Corpus)</span>
              </h4>
              <button onclick="window.HtetDict.switchTab('tab-sentences'); document.getElementById('sentence-search-input').value = '${escapeHtml(word)}'; window.HtetDict.searchSentences('${escapeHtml(word)}');" class="text-[11px] text-teal-600 hover:text-teal-700 font-semibold cursor-pointer">
                ဝါကျအားလုံး ကြည့်ရန် →
              </button>
            </div>
            <div class="space-y-2.5">
              ${examples.map(ex => `
                <div class="p-3.5 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline/80 space-y-1.5 text-xs">
                  <div class="flex items-start justify-between gap-2">
                    <p class="font-medium text-charcoal/90 leading-relaxed font-sans-ui">${highlightKeyword(ex.en, word)}</p>
                    <button onclick="window.HtetDict.speak('${escapeHtml(ex.en).replace(/'/g, "\\'")}')" class="text-muted hover:text-vermilion p-1 shrink-0" title="အသံနားထောင်ရန်">
                      <i class="ri-volume-up-line"></i>
                    </button>
                  </div>
                  <p class="text-muted font-sans-ui leading-relaxed">${highlightKeyword(ex.my, word)}</p>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }

      html += `</div>`;
      cardEl.innerHTML = html;
  }

  function renderNotFoundCard(word, lang) {
    const cardEl = document.getElementById('dict-def-card');
    if (!cardEl) return;

    cardEl.innerHTML = `
      <div class="p-8 rounded-3xl bg-card border border-hairline text-center space-y-4 animate-fade-in">
        <div class="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center text-2xl">
          <i class="ri-question-mark"></i>
        </div>
        <h3 class="text-xl font-bold font-serif-editorial text-charcoal m-0">
          "${escapeHtml(word)}" ကို မတွေ့ရှိပါ
        </h3>
        <p class="text-sm text-muted max-w-md mx-auto">
          စာလုံးပေါင်း မှန်ကန်မှု ရှိ/မရှိ စစ်ဆေးပေးပါ သို့မဟုတ် အနီးစပ်ဆုံး စကားလုံးများဖြင့် ရှာဖွေနိုင်ပါသည်။
        </p>
        <div class="pt-2 flex justify-center gap-2">
          <button onclick="window.HtetDict.switchTab('tab-sentences'); document.getElementById('sentence-search-input').value = '${escapeHtml(word)}'; window.HtetDict.searchSentences('${escapeHtml(word)}');" class="px-4 py-2 rounded-xl bg-teal-600 text-white font-medium text-xs">
            ဝါကျပေါင်း ၁၂,၀၂၁ ထဲတွင် ရှာမည်
          </button>
          <button onclick="window.HtetDict.lookup('freedom')" class="px-4 py-2 rounded-xl bg-cream/70 dark:bg-stone-800 text-charcoal text-xs border border-hairline">
            "freedom" စမ်းသပ်ရှာမည်
          </button>
        </div>
      </div>
    `;
  }

  function updateDirectionBadge(dir, isZg) {
    const el = document.getElementById('dict-direction-indicator');
    if (!el) return;
    if (dir === 'my-en') {
      el.innerHTML = `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-400/30">မြန်မာ ➔ English${isZg ? ' (ZG)' : ''}</span>`;
    } else {
      el.innerHTML = `<span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-400/30">English ➔ မြန်မာ</span>`;
    }
  }

  // -------------------------------------------------------------
  // 8. LIVE SUGGESTIONS
  // -------------------------------------------------------------
  let searchTimer = null;
  function handleInput(e) {
    clearTimeout(searchTimer);
    const val = e.target.value.trim();
    if (!val) {
      const listEl = document.getElementById('dict-suggestions-list');
      if (listEl) listEl.innerHTML = '';
      return;
    }

    searchTimer = setTimeout(() => {
      fetchSuggestions(val);
    }, 180);
  }

  async function fetchSuggestions(query) {
    const listEl = document.getElementById('dict-suggestions-list');
    if (!listEl) return;

    let isZg = false;
    let normalized = query;
    if (window.BurmeseNLP && window.BurmeseNLP.isZawgyi(query)) {
      isZg = true;
      normalized = window.BurmeseNLP.zg2uni(query);
    }

    const isMy = isMyanmarText(normalized);
    updateDirectionBadge(isMy ? 'my-en' : 'en-my', isZg);

    if (isMy) {
      const bucket = window.BurmeseNLP ? window.BurmeseNLP.getConsonantBucket(normalized) : 'ka';
      const revDict = await loadMyReverseLetter(bucket);
      const keys = Object.keys(revDict);
      const matches = keys.filter(k => k.startsWith(normalized)).slice(0, 15);

      if (matches.length === 0) {
        listEl.innerHTML = '<p class="text-xs text-muted p-2 italic">ကိုက်ညီမှု မရှိပါ</p>';
        return;
      }

      listEl.innerHTML = matches.map(k => `
        <button onclick="window.HtetDict.lookup('${escapeHtml(k)}')" class="w-full text-left px-3 py-2 rounded-xl hover:bg-teal-500/10 text-charcoal text-xs font-sans-ui flex items-center justify-between group transition-colors">
          <span class="font-medium">${escapeHtml(k)}</span>
          <span class="text-[10px] text-muted font-mono">${revDict[k].length} EN senses</span>
        </button>
      `).join('');
    } else {
      const letter = getEnBucket(normalized);
      const dict = await loadEnLetter(letter);
      const keys = Object.keys(dict);
      const qLower = normalized.toLowerCase();
      const matches = keys.filter(k => k.startsWith(qLower)).slice(0, 15);

      if (matches.length === 0) {
        listEl.innerHTML = '<p class="text-xs text-muted p-2 italic">ကိုက်ညီမှု မရှိပါ</p>';
        return;
      }

      listEl.innerHTML = matches.map(k => `
        <button onclick="window.HtetDict.lookup('${escapeHtml(k)}')" class="w-full text-left px-3 py-2 rounded-xl hover:bg-vermilion/10 text-charcoal text-xs font-serif-editorial flex items-center justify-between group transition-colors">
          <span class="font-bold">${escapeHtml(k)}</span>
          <span class="text-[10px] text-muted font-sans-ui truncate max-w-[120px]">${escapeHtml((dict[k][0] && dict[k][0].d) || '')}</span>
        </button>
      `).join('');
    }
  }

  // -------------------------------------------------------------
  // 9. A-Z BROWSER & TABS
  // -------------------------------------------------------------
  async function browseLetter(letter) {
    letter = getEnBucket(letter);
    updateActiveLetter(letter);
    const dict = await loadEnLetter(letter);
    const keys = Object.keys(dict).slice(0, 50);

    const listEl = document.getElementById('dict-suggestions-list');
    if (!listEl) return;

    listEl.innerHTML = keys.map(k => `
      <button onclick="window.HtetDict.lookup('${escapeHtml(k)}')" class="w-full text-left px-3 py-2 rounded-xl hover:bg-vermilion/10 text-charcoal text-xs font-serif-editorial flex items-center justify-between group transition-colors">
        <span class="font-bold">${escapeHtml(k)}</span>
        <span class="text-[10px] text-muted font-mono uppercase">${escapeHtml((dict[k][0] && dict[k][0].p) || '')}</span>
      </button>
    `).join('');

    if (keys.length > 0) {
      lookup(keys[0]);
    }
  }

  function updateActiveLetter(letter) {
    activeLetter = letter;
    document.querySelectorAll('[data-letter-btn]').forEach(b => {
      if (b.getAttribute('data-letter-btn') === letter) {
        b.classList.add('bg-teal-600', 'text-white');
        b.classList.remove('bg-cream/60', 'text-charcoal');
      } else {
        b.classList.remove('bg-teal-600', 'text-white');
        b.classList.add('bg-cream/60', 'text-charcoal');
      }
    });
  }

  function switchTab(tabId) {
    document.querySelectorAll('.dict-view-tab').forEach(el => {
      el.classList.add('hidden');
    });
    const target = document.getElementById(tabId);
    if (target) {
      target.classList.remove('hidden');
    }

    document.querySelectorAll('.dict-tab-btn').forEach(btn => {
      const match = btn.getAttribute('data-tab-target') === tabId;
      if (match) {
        btn.classList.add('active', 'bg-teal-600', 'text-white');
        btn.classList.remove('text-muted');
      } else {
        btn.classList.remove('active', 'bg-teal-600', 'text-white');
        btn.classList.add('text-muted');
      }
    });

    try {
      history.replaceState(null, '', '#' + tabId);
    } catch(e) {}

    if (tabId === 'tab-explorer') {
      loadExplorerContent();
    } else if (tabId === 'tab-nlp') {
      runNlpWorkbench();
    } else if (tabId === 'tab-sentences') {
      const sentInput = document.getElementById('sentence-search-input');
      if (sentInput && sentInput.value) {
        searchSentences(sentInput.value);
      } else {
        searchSentences('freedom');
      }
    }
  }

  // -------------------------------------------------------------
  // 10. BURMESENLP WORKBENCH
  // -------------------------------------------------------------
  function runNlpWorkbench() {
    const inputEl = document.getElementById('nlp-workbench-input');
    const outSyllables = document.getElementById('nlp-out-syllables');
    const outTokens = document.getElementById('nlp-out-tokens');
    const outPos = document.getElementById('nlp-out-pos');
    const outZgUni = document.getElementById('nlp-out-zguni');
    if (!inputEl) return;

    const text = inputEl.value.trim();
    if (!text || !window.BurmeseNLP) return;

    // Check Encoding
    const isZg = window.BurmeseNLP.isZawgyi(text);
    const uniText = isZg ? window.BurmeseNLP.zg2uni(text) : text;
    const zgText = window.BurmeseNLP.uni2zg(uniText);

    if (outZgUni) {
      outZgUni.innerHTML = `
        <div class="space-y-2 text-xs">
          <div class="flex items-center space-x-2">
            <span class="font-bold">Detected Encoding:</span>
            <span class="px-2 py-0.5 rounded-full ${isZg ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold' : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold'}">
              ${isZg ? 'Zawgyi Font' : 'Standard Unicode'}
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div class="p-3 rounded-xl bg-cream/70 dark:bg-stone-800 border border-hairline space-y-1">
              <span class="text-[10px] text-muted uppercase font-mono">Unicode Text:</span>
              <p class="font-sans-ui text-sm font-medium text-charcoal break-words">${escapeHtml(uniText)}</p>
            </div>
            <div class="p-3 rounded-xl bg-cream/70 dark:bg-stone-800 border border-hairline space-y-1">
              <span class="text-[10px] text-muted uppercase font-mono">Zawgyi Converted:</span>
              <p class="font-sans-ui text-sm font-medium text-charcoal break-words">${escapeHtml(zgText)}</p>
            </div>
          </div>
        </div>
      `;
    }

    // Sylbreak
    const syllables = window.BurmeseNLP.sylbreak(uniText);
    if (outSyllables) {
      outSyllables.innerHTML = syllables.map(s => `
        <span class="px-2 py-1 rounded-md bg-stone-100 dark:bg-stone-800 text-charcoal text-xs font-sans-ui border border-hairline">
          ${escapeHtml(s)}
        </span>
      `).join('');
    }

    // Word Tokenize
    const tokens = window.BurmeseNLP.wordTokenize(uniText);
    if (outTokens) {
      outTokens.innerHTML = tokens.map(t => `
        <button onclick="window.HtetDict.switchTab('tab-dict'); window.HtetDict.lookup('${escapeHtml(t)}');" class="px-2.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-800 dark:text-teal-200 text-xs font-semibold font-sans-ui border border-teal-400/30 cursor-pointer transition-all">
          ${escapeHtml(t)}
        </button>
      `).join('');
    }

    // POS Tagging
    const posResults = window.BurmeseNLP.tagSentence(uniText);
    if (outPos) {
      outPos.innerHTML = posResults.map(p => `
        <div class="inline-flex flex-col items-center p-2 rounded-xl bg-cream/60 dark:bg-stone-800 border border-hairline text-center space-y-1">
          <span class="font-bold text-sm text-charcoal font-sans-ui">${escapeHtml(p.word)}</span>
          <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-teal-600 text-white">
            ${escapeHtml(p.pos)}
          </span>
          <span class="text-[9px] text-muted font-sans-ui">${escapeHtml(p.posLabel)}</span>
        </div>
      `).join('');
    }
  }

  function setWorkbenchSample(text) {
    const inputEl = document.getElementById('nlp-workbench-input');
    if (inputEl) {
      inputEl.value = text;
      runNlpWorkbench();
    }
  }

  // -------------------------------------------------------------
  // 11. MYANMAR WORDS EXPLORER
  // -------------------------------------------------------------
  async function loadExplorerContent() {
    const gridEl = document.getElementById('mw-explorer-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '<div class="col-span-full py-8 text-center text-xs text-muted">ဝေါဟာရများအား တင်ယူနေပါသည်...</div>';

    const dict = await loadMyanmarWordsPartition(activeConsonant);
    let words = Object.keys(dict);

    if (activePosFilter) {
      words = words.filter(w => dict[w] && dict[w].pos === activePosFilter);
    }

    if (words.length === 0) {
      gridEl.innerHTML = '<div class="col-span-full py-8 text-center text-xs text-muted italic">ဤအုပ်စုတွင် ဝေါဟာရ မရှိသေးပါ။</div>';
      return;
    }

    gridEl.innerHTML = words.slice(0, 120).map(w => {
      const item = dict[w];
      const pos = item.pos || 'n';
      return `
        <button onclick="window.HtetDict.switchTab('tab-dict'); window.HtetDict.lookup('${escapeHtml(w)}');" class="p-3 rounded-2xl bg-card border border-hairline/80 hover:border-teal-500 hover:shadow-xs transition-all text-left space-y-1 group cursor-pointer">
          <p class="font-bold text-sm text-charcoal group-hover:text-teal-600 transition-colors font-sans-ui truncate m-0">
            ${escapeHtml(w)}
          </p>
          <div class="flex items-center space-x-1 text-[10px] font-mono text-muted">
            <span class="px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 uppercase">${escapeHtml(pos)}</span>
            <span>${item.sources ? item.sources.length + ' src' : ''}</span>
          </div>
        </button>
      `;
    }).join('');
  }

  function setConsonantFilter(cons) {
    activeConsonant = cons;
    document.querySelectorAll('[data-cons-btn]').forEach(b => {
      if (b.getAttribute('data-cons-btn') === cons) {
        b.classList.add('bg-teal-600', 'text-white');
        b.classList.remove('bg-cream/60', 'text-charcoal');
      } else {
        b.classList.remove('bg-teal-600', 'text-white');
        b.classList.add('bg-cream/60', 'text-charcoal');
      }
    });
    loadExplorerContent();
  }

  function setPosFilter(pos) {
    activePosFilter = pos;
    document.querySelectorAll('[data-pos-filter]').forEach(b => {
      if (b.getAttribute('data-pos-filter') === pos) {
        b.classList.add('bg-teal-600', 'text-white');
        b.classList.remove('bg-cream/60', 'text-charcoal');
      } else {
        b.classList.remove('bg-teal-600', 'text-white');
        b.classList.add('bg-cream/60', 'text-charcoal');
      }
    });
    loadExplorerContent();
  }

  // -------------------------------------------------------------
  // 12. AUDIO PRONUNCIATION & BOOKMARKS
  // -------------------------------------------------------------
  function speakWord(word) {
    if (!('speechSynthesis' in window)) {
      alert('ဤ Browser တွင် Speech Synthesis အသံစနစ် မရရှိသေးပါ။');
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(word);
    utt.lang = 'en-US';
    utt.rate = 1.0; // Normal rate as instructed by user
    window.speechSynthesis.speak(utt);
  }

  function toggleBookmark(word) {
    const idx = bookmarks.indexOf(word);
    if (idx !== -1) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.unshift(word);
      if (bookmarks.length > 50) bookmarks.pop();
    }
    localStorage.setItem('htet_dict_bookmarks', JSON.stringify(bookmarks));
    renderBookmarksList();
    if (currentEnWord === word) {
      lookup(word);
    }
  }

  function copyDef(word) {
    navigator.clipboard.writeText(word).then(() => {
      if (typeof window.showToast === 'function') {
        window.showToast(`"${word}" ကို ကူးယူပြီးပါပြီ`);
      } else {
        alert(`"${word}" ကို ကူးယူပြီးပါပြီ`);
      }
    });
  }

  function renderBookmarksList() {
    const listEl = document.getElementById('dict-bookmarks-container');
    if (!listEl) return;
    if (bookmarks.length === 0) {
      listEl.innerHTML = '<p class="text-xs text-muted italic">မှတ်သားထားသော စကားလုံး မရှိသေးပါ။</p>';
      return;
    }
    listEl.innerHTML = bookmarks.map(w => `
      <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cream/70 dark:bg-stone-800 text-charcoal border border-hairline text-xs font-medium">
        <button onclick="window.HtetDict.lookup('${escapeHtml(w)}')" class="hover:text-vermilion cursor-pointer font-bold">${escapeHtml(w)}</button>
        <button onclick="window.HtetDict.toggleBookmark('${escapeHtml(w)}')" class="text-muted hover:text-red-500 cursor-pointer" title="ဖယ်ထုတ်ရန်">×</button>
      </span>
    `).join('');
  }

  // -------------------------------------------------------------
  // 12.5. LIBRETRANSLATE ENGINE CONTROLLER
  // -------------------------------------------------------------
  async function runLibreTranslate() {
    const inputEl = document.getElementById('libre-source-text');
    const outputEl = document.getElementById('libre-target-text');
    const badgeEl = document.getElementById('libre-engine-badge');
    const srcLangEl = document.getElementById('libre-src-lang');
    const tgtLangEl = document.getElementById('libre-tgt-lang');
    const btnEl = document.getElementById('libre-translate-btn');

    if (!inputEl || !outputEl) return;
    const text = inputEl.value.trim();
    if (!text) {
      outputEl.value = '';
      if (badgeEl) badgeEl.innerHTML = '';
      return;
    }

    const srcLang = srcLangEl ? srcLangEl.value : 'auto';
    const tgtLang = tgtLangEl ? tgtLangEl.value : 'my';

    if (btnEl) {
      btnEl.disabled = true;
      btnEl.innerHTML = '<i class="ri-loader-4-line animate-spin text-base"></i><span>ဘာသာပြန်နေပါသည်...</span>';
    }

    try {
      if (window.HtetLibreTranslate) {
        const res = await window.HtetLibreTranslate.translate(text, srcLang, tgtLang);
        outputEl.value = res.translatedText || '';

        if (badgeEl) {
          if (res.engine === 'libretranslate') {
            badgeEl.innerHTML = `
              <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>LibreTranslate Neural MT (${escapeHtml(res.endpoint || 'Connected')})</span>
              </span>
            `;
          } else if (res.engine === 'offline-corpus') {
            badgeEl.innerHTML = `
              <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-400/30">
                <i class="ri-database-2-line text-xs"></i>
                <span>12K+ Parallel Corpus Match (${res.matchType || 'Corpus'})</span>
              </span>
            `;
          } else {
            badgeEl.innerHTML = `
              <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-400/30">
                <i class="ri-book-2-line text-xs"></i>
                <span>Offline Lexicon &amp; Grammar Synthesis</span>
              </span>
            `;
          }
        }
      }
    } catch(err) {
      console.error('Translation error:', err);
    } finally {
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = '<i class="ri-translate-2 text-base"></i><span>ဘာသာပြန်ဆိုမည်</span>';
      }
    }
  }

  function swapTranslateLangs() {
    const srcLangEl = document.getElementById('libre-src-lang');
    const tgtLangEl = document.getElementById('libre-tgt-lang');
    const inputEl = document.getElementById('libre-source-text');
    const outputEl = document.getElementById('libre-target-text');

    if (!srcLangEl || !tgtLangEl) return;
    let s = srcLangEl.value;
    let t = tgtLangEl.value;
    if (s === 'auto') {
      s = (outputEl && isMyanmarText(outputEl.value)) ? 'my' : 'en';
    }
    srcLangEl.value = t;
    tgtLangEl.value = s;

    if (inputEl && outputEl && outputEl.value) {
      const temp = inputEl.value;
      inputEl.value = outputEl.value;
      outputEl.value = temp;
      runLibreTranslate();
    }
  }

  function openLibreTranslateSettings() {
    const modal = document.getElementById('libre-settings-modal');
    const inputUrl = document.getElementById('libre-setting-url');
    if (!modal) return;
    if (window.HtetLibreTranslate && inputUrl) {
      inputUrl.value = window.HtetLibreTranslate.getEndpoint();
    }
    modal.classList.remove('hidden');
  }

  function closeLibreTranslateSettings() {
    const modal = document.getElementById('libre-settings-modal');
    if (modal) modal.classList.add('hidden');
  }

  function saveLibreTranslateSettings() {
    const inputUrl = document.getElementById('libre-setting-url');
    const inputKey = document.getElementById('libre-setting-key');
    const url = inputUrl ? inputUrl.value.trim() : '';
    const key = inputKey ? inputKey.value.trim() : '';
    if (window.HtetLibreTranslate) {
      window.HtetLibreTranslate.setEndpoint(url, key);
    }
    closeLibreTranslateSettings();
    if (typeof window.showToast === 'function') {
      window.showToast('LibreTranslate ဆာဗာလိပ်စာ သိမ်းဆည်းပြီးပါပြီ');
    } else {
      alert('LibreTranslate ဆာဗာလိပ်စာ သိမ်းဆည်းပြီးပါပြီ');
    }
  }

  // -------------------------------------------------------------
  // 13. INITIALIZATION
  // -------------------------------------------------------------
  function init() {
    const input = document.getElementById('dict-search-input');
    if (input) {
      input.addEventListener('input', handleInput);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          lookup(input.value);
          const listEl = document.getElementById('dict-suggestions-list');
          if (listEl) listEl.classList.add('hidden');
        }
      });
    }

    const sentInput = document.getElementById('sentence-search-input');
    if (sentInput) {
      let sentTimer = null;
      sentInput.addEventListener('input', (e) => {
        clearTimeout(sentTimer);
        sentTimer = setTimeout(() => {
          searchSentences(e.target.value);
        }, 200);
      });
      sentInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          searchSentences(sentInput.value);
        }
      });
    }

    renderBookmarksList();

    // Check hash route or query parameters
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      switchTab(hash);
    }

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const letter = params.get('letter');

    if (q) {
      if (input) input.value = q;
      lookup(q);
    } else if (letter) {
      browseLetter(letter);
    } else {
      lookup('freedom');
    }
  }

  window.HtetDict = {
    lookup,
    speak: speakWord,
    toggleBookmark,
    copyDef,
    browseLetter,
    switchTab,
    runNlpWorkbench,
    setWorkbenchSample,
    setConsonantFilter,
    setPosFilter,
    searchSentences,
    runLibreTranslate,
    swapTranslateLangs,
    openLibreTranslateSettings,
    closeLibreTranslateSettings,
    saveLibreTranslateSettings,
    init
  };

  document.addEventListener('DOMContentLoaded', init);
})();
