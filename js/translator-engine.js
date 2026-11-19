/**
 * Htet Official — Universal Translation Engine (Cross-Platform)
 * Multi-Engine Architecture for Mobile, Tablet, Laptop, iOS, Android, Windows, Mac, Linux
 *
 * Engines:
 *   1. 12,021 HuggingFace Parallel Sentence Corpus (0ms, 100% Offline, Human-Quality)
 *   2. LibreTranslate Open Source Neural MT (Self-hosted or Public instances)
 *   3. Free Multi-Cloud Neural Translation APIs (Google GTX & MyMemory zero-key endpoints)
 *   4. Rule-Based Offline Lexical Synthesizer (BurmeseNLP + Ornagai 111K+ & Myanmar Tools 42K+)
 */

(function() {
  'use strict';

  var DEFAULT_LIBRE_ENDPOINT = 'http://localhost:5000';
  var STORAGE_ENDPOINT_KEY = 'htet_libretranslate_url';
  var STORAGE_APIKEY_KEY = 'htet_libretranslate_key';
  var STORAGE_HISTORY_KEY = 'htet_translation_history';
  var STORAGE_FAVS_KEY = 'htet_translation_favs';

  var config = {
    libreEndpoint: (function() {
      try { return localStorage.getItem(STORAGE_ENDPOINT_KEY) || DEFAULT_LIBRE_ENDPOINT; } catch(e) { return DEFAULT_LIBRE_ENDPOINT; }
    })(),
    libreApiKey: (function() {
      try { return localStorage.getItem(STORAGE_APIKEY_KEY) || ''; } catch(e) { return ''; }
    })(),
    preferEngine: 'hybrid' // 'hybrid', 'libre', 'corpus', 'cloud'
  };

  var SUPPORTED_LANGS = [
    { code: 'auto', name: 'အလိုအလျောက် စစ်ဆေးခြင်း (Auto Detect)', flag: '🌐' },
    { code: 'my', name: 'မြန်မာ (Burmese)', flag: '🇲🇲' },
    { code: 'en', name: 'English (အင်္ဂလိပ်)', flag: '🇬🇧' },
    { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳' },
    { code: 'th', name: 'ภาษาไทย (Thai)', flag: '🇹🇭' },
    { code: 'ja', name: '日本語 (Japanese)', flag: '🇯🇵' }
  ];

  var MYANMAR_CHAR_REGEX = /[\u1000-\u109F]/;

  function isMyanmar(str) {
    return MYANMAR_CHAR_REGEX.test(str);
  }

  function detectLanguage(text) {
    if (!text || !text.trim()) return 'en';
    var clean = text.trim();
    if (isMyanmar(clean)) return 'my';
    if (/[\u4E00-\u9FFF]/.test(clean)) return 'zh';
    if (/[\u0E00-\u0E7F]/.test(clean)) return 'th';
    if (/[\u3040-\u30FF]/.test(clean)) return 'ja';
    return 'en';
  }

  // -------------------------------------------------------------
  // TIER 1: 12,021 HUGGINGFACE PARALLEL CORPUS (Offline 0ms)
  // -------------------------------------------------------------
  function matchCorpus(text, source, target) {
    if (!window.HTET_TRANSLATIONS || !text) return null;
    var raw = text.trim();
    var rawLower = raw.toLowerCase();
    var list = window.HTET_TRANSLATIONS;
    var isMm = isMyanmar(raw);

    // Exact Match First
    for (var i = 0; i < list.length; i++) {
      var pair = list[i];
      if (isMm) {
        if (pair.my.trim() === raw) {
          return {
            text: pair.en,
            engine: 'corpus',
            badge: '12K+ Parallel Corpus (Exact)',
            confidence: 1.0,
            matchType: 'exact',
            pairId: pair.id
          };
        }
      } else {
        if (pair.en.trim().toLowerCase() === rawLower) {
          return {
            text: pair.my,
            engine: 'corpus',
            badge: '12K+ Parallel Corpus (Exact)',
            confidence: 1.0,
            matchType: 'exact',
            pairId: pair.id
          };
        }
      }
    }

    // Substring / High-relevance match for phrases
    for (var j = 0; j < list.length; j++) {
      var p = list[j];
      if (isMm) {
        if (p.my.indexOf(raw) !== -1 && raw.length >= 4) {
          return {
            text: p.en,
            engine: 'corpus',
            badge: '12K+ Parallel Corpus (Context)',
            confidence: 0.9,
            matchType: 'context',
            pairId: p.id
          };
        }
      } else {
        if (p.en.toLowerCase().indexOf(rawLower) !== -1 && rawLower.length >= 6) {
          return {
            text: p.my,
            engine: 'corpus',
            badge: '12K+ Parallel Corpus (Context)',
            confidence: 0.9,
            matchType: 'context',
            pairId: p.id
          };
        }
      }
    }

    return null;
  }

  // -------------------------------------------------------------
  // TIER 2: LIBRETRANSLATE (Self-hosted or Public API)
  // -------------------------------------------------------------
  function translateLibre(text, source, target) {
    var endpoint = (config.libreEndpoint || DEFAULT_LIBRE_ENDPOINT).replace(/\/+$/, '') + '/translate';
    var payload = {
      q: text,
      source: source,
      target: target,
      format: 'text'
    };
    if (config.libreApiKey) {
      payload.api_key = config.libreApiKey;
    }

    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timer = null;
    if (controller) {
      timer = setTimeout(function() { controller.abort(); }, 3500);
    }

    return fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    }).then(function(res) {
      if (timer) clearTimeout(timer);
      if (res.ok) {
        return res.json().then(function(d) {
          if (d && d.translatedText) {
            return {
              text: d.translatedText,
              engine: 'libretranslate',
              badge: 'LibreTranslate Neural MT (' + (config.libreEndpoint.indexOf('localhost') !== -1 ? 'Local' : 'Server') + ')',
              confidence: 0.95
            };
          }
          throw new Error('Empty translation text');
        });
      }
      throw new Error('LibreTranslate status ' + res.status);
    }).catch(function(err) {
      if (timer) clearTimeout(timer);
      return null;
    });
  }

  // -------------------------------------------------------------
  // TIER 3: ZERO-KEY NEURAL WEB ENGINES (GTX & MyMemory)
  // -------------------------------------------------------------
  function translateWebGTX(text, source, target) {
    var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' +
      encodeURIComponent(source) + '&tl=' + encodeURIComponent(target) + '&dt=t&q=' + encodeURIComponent(text);

    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timer = null;
    if (controller) {
      timer = setTimeout(function() { controller.abort(); }, 4000);
    }

    return fetch(url, { signal: controller ? controller.signal : undefined })
      .then(function(res) {
        if (timer) clearTimeout(timer);
        if (res.ok) {
          return res.json().then(function(data) {
            if (data && data[0] && Array.isArray(data[0])) {
              var result = data[0].map(function(seg) { return seg[0] || ''; }).join('');
              if (result.trim()) {
                return {
                  text: result.trim(),
                  engine: 'neural-cloud',
                  badge: 'Cloud Neural Engine (GTX)',
                  confidence: 0.92
                };
              }
            }
            throw new Error('Malformed GTX data');
          });
        }
        throw new Error('GTX error ' + res.status);
      })
      .catch(function() {
        if (timer) clearTimeout(timer);
        return null;
      });
  }

  function translateMyMemory(text, source, target) {
    var pair = source + '|' + target;
    var url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + encodeURIComponent(pair);

    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timer = null;
    if (controller) {
      timer = setTimeout(function() { controller.abort(); }, 3500);
    }

    return fetch(url, { signal: controller ? controller.signal : undefined })
      .then(function(res) {
        if (timer) clearTimeout(timer);
        if (res.ok) {
          return res.json().then(function(data) {
            if (data && data.responseData && data.responseData.translatedText) {
              return {
                text: data.responseData.translatedText.trim(),
                engine: 'mymemory',
                badge: 'MyMemory Open Corpus',
                confidence: 0.85
              };
            }
            throw new Error('Empty MyMemory text');
          });
        }
        throw new Error('MyMemory status ' + res.status);
      })
      .catch(function() {
        if (timer) clearTimeout(timer);
        return null;
      });
  }

  // -------------------------------------------------------------
  // TIER 4: RULE-BASED OFFLINE SYNTHESIS (100% Offline)
  // -------------------------------------------------------------
  function synthesizeOfflineLexicon(text, source, target) {
    var raw = text.trim();
    if (!raw) return { text: '', engine: 'none', badge: 'Empty', confidence: 0 };

    var isMm = isMyanmar(raw);
    if (!isMm) {
      // English -> Myanmar
      var words = raw.split(/\s+/);
      var translated = [];
      var common = window.HTET_DICT_COMMON || {};

      for (var i = 0; i < words.length; i++) {
        var w = words[i].toLowerCase().replace(/[^a-z0-9]/g, '');
        if (common[w] && common[w][0]) {
          translated.push(common[w][0].d || w);
        } else {
          translated.push(words[i]);
        }
      }

      return {
        text: translated.join(' '),
        engine: 'offline-lexicon',
        badge: 'Ornagai 111K+ အော့ဖ်လိုင်း အဘိဓာန်ပေါင်းစပ်',
        confidence: 0.75
      };
    } else {
      // Myanmar -> English
      var tokens = (window.BurmeseNLP && window.BurmeseNLP.wordTokenize)
        ? window.BurmeseNLP.wordTokenize(raw)
        : [raw];
      var revCommon = window.HTET_DICT_MY_COMMON || {};
      var enWords = [];

      for (var k = 0; k < tokens.length; k++) {
        var tok = tokens[k];
        if (revCommon[tok] && revCommon[tok][0]) {
          enWords.push(revCommon[tok][0].word || tok);
        } else {
          enWords.push(tok);
        }
      }

      return {
        text: enWords.join(' '),
        engine: 'offline-lexicon',
        badge: 'BurmeseNLP & Reverse Myanmar အော့ဖ်လိုင်း ပေါင်းစပ်',
        confidence: 0.75
      };
    }
  }

  // -------------------------------------------------------------
  // MASTER TRANSLATE DISPATCHER
  // -------------------------------------------------------------
  async function translate(text, sourceLang, targetLang) {
    if (!text || !text.trim()) {
      return { text: '', engine: 'none', badge: 'Empty', sourceLang: 'auto', targetLang: 'my' };
    }

    var cleanText = text.trim();

    // Zawgyi normalization
    if (window.BurmeseNLP && window.BurmeseNLP.isZawgyi && window.BurmeseNLP.isZawgyi(cleanText)) {
      cleanText = window.BurmeseNLP.zg2uni(cleanText);
    }

    if (!sourceLang || sourceLang === 'auto') {
      sourceLang = detectLanguage(cleanText);
    }
    if (!targetLang || targetLang === sourceLang) {
      targetLang = (sourceLang === 'my') ? 'en' : 'my';
    }

    // Step 1: Check 12,021 Parallel Corpus (Human-reviewed, exact)
    var corpusMatch = matchCorpus(cleanText, sourceLang, targetLang);
    if (corpusMatch) {
      corpusMatch.sourceLang = sourceLang;
      corpusMatch.targetLang = targetLang;
      saveHistory(cleanText, corpusMatch.text, sourceLang, targetLang, corpusMatch.badge);
      return corpusMatch;
    }

    // Step 2: Try LibreTranslate (if online or local server running)
    var libreRes = await translateLibre(cleanText, sourceLang, targetLang);
    if (libreRes && libreRes.text) {
      libreRes.sourceLang = sourceLang;
      libreRes.targetLang = targetLang;
      saveHistory(cleanText, libreRes.text, sourceLang, targetLang, libreRes.badge);
      return libreRes;
    }

    // Step 3: Try Cloud Neural Engines (GTX / MyMemory)
    var gtxRes = await translateWebGTX(cleanText, sourceLang, targetLang);
    if (gtxRes && gtxRes.text) {
      gtxRes.sourceLang = sourceLang;
      gtxRes.targetLang = targetLang;
      saveHistory(cleanText, gtxRes.text, sourceLang, targetLang, gtxRes.badge);
      return gtxRes;
    }

    var myMemRes = await translateMyMemory(cleanText, sourceLang, targetLang);
    if (myMemRes && myMemRes.text) {
      myMemRes.sourceLang = sourceLang;
      myMemRes.targetLang = targetLang;
      saveHistory(cleanText, myMemRes.text, sourceLang, targetLang, myMemRes.badge);
      return myMemRes;
    }

    // Step 4: Final 100% Offline Rule-Based Synthesizer
    var synthRes = synthesizeOfflineLexicon(cleanText, sourceLang, targetLang);
    synthRes.sourceLang = sourceLang;
    synthRes.targetLang = targetLang;
    saveHistory(cleanText, synthRes.text, sourceLang, targetLang, synthRes.badge);
    return synthRes;
  }

  // -------------------------------------------------------------
  // SPEECH SYNTHESIS (Natural Rate 1.0 for English)
  // -------------------------------------------------------------
  function speak(text, lang) {
    if (!('speechSynthesis' in window)) {
      alert('ဤ Browser တွင် အသံထွက်ဖတ်ကြားမှုစနစ် (Speech Synthesis) မပါဝင်သေးပါ။');
      return;
    }
    window.speechSynthesis.cancel();
    var utt = new SpeechSynthesisUtterance(text);
    utt.rate = 1.0; // Normal rate as requested by user

    var langMap = {
      'en': 'en-US',
      'my': 'my-MM',
      'zh': 'zh-CN',
      'th': 'th-TH',
      'ja': 'ja-JP'
    };
    utt.lang = langMap[lang] || 'en-US';
    window.speechSynthesis.speak(utt);
  }

  // -------------------------------------------------------------
  // HISTORY & BOOKMARKS STORAGE
  // -------------------------------------------------------------
  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY) || '[]');
    } catch(e) {
      return [];
    }
  }

  function saveHistory(sourceText, targetText, sLang, tLang, badge) {
    if (!sourceText || !targetText) return;
    try {
      var hist = getHistory();
      // Remove existing duplicate
      hist = hist.filter(function(item) {
        return item.sourceText !== sourceText;
      });
      hist.unshift({
        id: Date.now(),
        sourceText: sourceText,
        targetText: targetText,
        sourceLang: sLang,
        targetLang: tLang,
        badge: badge,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      if (hist.length > 25) hist.pop();
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(hist));
    } catch(e) {}
  }

  function clearHistory() {
    try {
      localStorage.removeItem(STORAGE_HISTORY_KEY);
    } catch(e) {}
  }

  // Export to global scope
  window.HtetTranslator = {
    translate: translate,
    detectLanguage: detectLanguage,
    speak: speak,
    getHistory: getHistory,
    clearHistory: clearHistory,
    SUPPORTED_LANGS: SUPPORTED_LANGS,
    getLibreEndpoint: function() { return config.libreEndpoint; },
    setLibreEndpoint: function(url, key) {
      config.libreEndpoint = url || DEFAULT_LIBRE_ENDPOINT;
      if (key !== undefined) config.libreApiKey = key || '';
      try {
        localStorage.setItem(STORAGE_ENDPOINT_KEY, config.libreEndpoint);
        localStorage.setItem(STORAGE_APIKEY_KEY, config.libreApiKey);
      } catch(e) {}
    },
    VERSION: 'Htet-Universal-Translator-v2.0'
  };
})();
