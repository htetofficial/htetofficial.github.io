/**
 * Htet Official — LibreTranslate Client & Offline Hybrid Translation Engine
 * Open Source Machine Translation Integration (LibreTranslate / Argos Translate)
 * Features:
 *   - REST API Client for self-hosted & public LibreTranslate instances
 *   - Auto language detection (Burmese, English, Chinese, Thai, Japanese)
 *   - Seamless offline fallback to 12,021 HuggingFace corpus + Ornagai 111K+ dictionary
 *   - Endpoint configuration (localhost:5000, custom server, or public mirrors)
 */

(function() {
  'use strict';

  var DEFAULT_ENDPOINT = 'http://localhost:5000';
  var storageUrlKey = 'htet_libretranslate_url';
  var storageApiKeyKey = 'htet_libretranslate_key';

  var config = {
    endpoint: (function() {
      try { return localStorage.getItem(storageUrlKey) || DEFAULT_ENDPOINT; } catch(e) { return DEFAULT_ENDPOINT; }
    })(),
    apiKey: (function() {
      try { return localStorage.getItem(storageApiKeyKey) || ''; } catch(e) { return ''; }
    })()
  };

  var SUPPORTED_LANGUAGES = [
    { code: 'auto', name: 'အလိုအလျောက် စစ်ဆေးခြင်း (Auto Detect)' },
    { code: 'en', name: 'English (အင်္ဂလိပ်)' },
    { code: 'my', name: 'မြန်မာ (Burmese)' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'th', name: 'ภาษาไทย (Thai)' },
    { code: 'ja', name: '日本語 (Japanese)' }
  ];

  var MYANMAR_CHAR_REGEX = /[\u1000-\u109F]/;

  function isMyanmarText(str) {
    return MYANMAR_CHAR_REGEX.test(str);
  }

  function getEndpoint() {
    return config.endpoint;
  }

  function setEndpoint(url, apiKey) {
    config.endpoint = url || DEFAULT_ENDPOINT;
    if (apiKey !== undefined) config.apiKey = apiKey || '';
    try {
      localStorage.setItem(storageUrlKey, config.endpoint);
      localStorage.setItem(storageApiKeyKey, config.apiKey);
    } catch(e) {}
  }

  function detectLanguage(text) {
    if (!text || !text.trim()) return 'en';
    if (isMyanmarText(text)) return 'my';
    // Basic Hanzi/Kanji detection
    if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
    // Thai script
    if (/[\u0E00-\u0E7F]/.test(text)) return 'th';
    // Hiragana/Katakana
    if (/[\u3040-\u30FF]/.test(text)) return 'ja';
    return 'en';
  }

  /**
   * Offline Hybrid Translation Fallback:
   * Uses 12,021 HuggingFace parallel corpus & Ornagai dictionary
   */
  function fallbackOfflineTranslate(text, source, target) {
    var raw = text.trim();
    if (!raw) return Promise.resolve({ translatedText: '', engine: 'offline-empty' });

    // 1. Check exact match in 12,021 HuggingFace parallel corpus
    if (window.HTET_TRANSLATIONS && window.HTET_TRANSLATIONS.length > 0) {
      var list = window.HTET_TRANSLATIONS;
      var rawLower = raw.toLowerCase();

      for (var i = 0; i < list.length; i++) {
        var pair = list[i];
        if (source === 'en' || (!isMyanmarText(raw))) {
          if (pair.en.toLowerCase() === rawLower) {
            return Promise.resolve({
              translatedText: pair.my,
              engine: 'offline-corpus',
              sourceLang: 'en',
              targetLang: 'my',
              matchType: 'exact'
            });
          }
        } else {
          if (pair.my.trim() === raw) {
            return Promise.resolve({
              translatedText: pair.en,
              engine: 'offline-corpus',
              sourceLang: 'my',
              targetLang: 'en',
              matchType: 'exact'
            });
          }
        }
      }

      // Check substring / sentence start match in corpus
      for (var j = 0; j < list.length; j++) {
        var p = list[j];
        if (source === 'en' || (!isMyanmarText(raw))) {
          if (p.en.toLowerCase().indexOf(rawLower) !== -1) {
            return Promise.resolve({
              translatedText: p.my,
              engine: 'offline-corpus',
              sourceLang: 'en',
              targetLang: 'my',
              matchType: 'sub-corpus'
            });
          }
        } else {
          if (p.my.indexOf(raw) !== -1) {
            return Promise.resolve({
              translatedText: p.en,
              engine: 'offline-corpus',
              sourceLang: 'my',
              targetLang: 'en',
              matchType: 'sub-corpus'
            });
          }
        }
      }
    }

    // 2. Lexical word-by-word / phrase fallback
    if (!isMyanmarText(raw)) {
      // English -> Myanmar
      var words = raw.split(/\s+/);
      var translatedWords = [];
      var common = window.HTET_DICT_COMMON || {};

      for (var w = 0; w < words.length; w++) {
        var cleanWord = words[w].toLowerCase().replace(/[^a-z0-9]/g, '');
        if (common[cleanWord] && common[cleanWord][0]) {
          translatedWords.push(common[cleanWord][0].d || cleanWord);
        } else {
          translatedWords.push(words[w]);
        }
      }

      return Promise.resolve({
        translatedText: translatedWords.join(' '),
        engine: 'offline-lexicon',
        sourceLang: 'en',
        targetLang: 'my'
      });
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

      return Promise.resolve({
        translatedText: enWords.join(' '),
        engine: 'offline-lexicon',
        sourceLang: 'my',
        targetLang: 'en'
      });
    }
  }

  /**
   * Main Translation Request
   * Tries LibreTranslate API first with a short timeout; falls back to offline engine on failure
   */
  function translate(text, sourceLang, targetLang) {
    if (!text || !text.trim()) {
      return Promise.resolve({ translatedText: '', engine: 'none' });
    }

    if (!sourceLang || sourceLang === 'auto') {
      sourceLang = detectLanguage(text);
    }
    if (!targetLang) {
      targetLang = (sourceLang === 'my') ? 'en' : 'my';
    }

    var payload = {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text'
    };
    if (config.apiKey) {
      payload.api_key = config.apiKey;
    }

    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timeoutId = null;
    if (controller) {
      timeoutId = setTimeout(function() { controller.abort(); }, 4000);
    }

    var fetchOpts = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    };

    var endpointUrl = config.endpoint.replace(/\/+$/, '') + '/translate';

    return fetch(endpointUrl, fetchOpts)
      .then(function(res) {
        if (timeoutId) clearTimeout(timeoutId);
        if (res.ok) {
          return res.json().then(function(data) {
            return {
              translatedText: data.translatedText || '',
              engine: 'libretranslate',
              sourceLang: sourceLang,
              targetLang: targetLang,
              endpoint: config.endpoint
            };
          });
        }
        throw new Error('LibreTranslate server responded with ' + res.status);
      })
      .catch(function(err) {
        if (timeoutId) clearTimeout(timeoutId);
        // Fallback to local offline corpus & lexicon
        return fallbackOfflineTranslate(text, sourceLang, targetLang);
      });
  }

  window.HtetLibreTranslate = {
    translate: translate,
    detectLanguage: detectLanguage,
    fallbackOfflineTranslate: fallbackOfflineTranslate,
    getEndpoint: getEndpoint,
    setEndpoint: setEndpoint,
    SUPPORTED_LANGUAGES: SUPPORTED_LANGUAGES,
    VERSION: 'LibreTranslate-1.5.0-Hybrid'
  };
})();
