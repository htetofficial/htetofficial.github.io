#!/usr/bin/env python3
"""
Generate js/burmesenlp.js from burmesenlp scratch files.
"""

import json
from pathlib import Path

BNLP_DIR = Path('/Users/htet/.gemini/antigravity/brain/b69d2b67-7dfa-4a96-8f68-65a3296b7c51/scratch/repos/burmesenlp')
ZG2UNI_PATH = BNLP_DIR / 'src' / 'burmesenlp' / 'zawgyi' / 'zg2uni_rules.json'
UNI2ZG_PATH = BNLP_DIR / 'src' / 'burmesenlp' / 'zawgyi' / 'uni2zg_rules.json'

with open(ZG2UNI_PATH, 'r', encoding='utf-8') as f:
    zg2uni_raw = json.load(f)

with open(UNI2ZG_PATH, 'r', encoding='utf-8') as f:
    uni2zg_raw = json.load(f)

# Build high-priority pre-cached common words
BNLP_LEX_PATH = BNLP_DIR / 'src' / 'burmesenlp' / 'lexicon' / 'data' / 'default.json'
with open(BNLP_LEX_PATH, 'r', encoding='utf-8') as f:
    bnlp_all = json.load(f)

common_list = [
    'ကျွန်တော်', 'ကျွန်မ', 'သူ', 'သူတို့', 'ငါ', 'မိမိ', 'ကိုယ်', 'ဒီ', 'ထို', 'ယင်း', 'ဘာ', 'ဘယ်',
    'ကျောင်း', 'အိမ်', 'လူ', 'နိုင်ငံ', 'ပြည်သူ', 'အစိုးရ', 'တရား', 'ဥပဒေ', 'အလုပ်', 'အချိန်', 'နေ့', 'နှစ်',
    'စနစ်', 'အဖွဲ့', 'ကမ္ဘာ', 'သမိုင်း', 'ခေတ်', 'စကား', 'စာအုပ်', 'အတွေး', 'စိတ်', 'အသိ', 'ပညာ', 'အမှန်တရား',
    'လွတ်လပ်ခွင့်', 'ဒီမိုကရေစီ', 'လူ့အခွင့်အရေး', 'တန်းတူညီမျှရေး', 'တရားမျှတမှု', 'ငြိမ်းချမ်းရေး', 'သတ္တိ', 'ကြောက်ရွံ့ခြင်း', 'အာဏာ', 'ခေါင်းဆောင်',
    'သွား', 'လာ', 'စား', 'လုပ်', 'ပြော', 'ဖြစ်', 'ရှိ', 'သိ', 'မြင်', 'ယူ', 'ပေး', 'ရ', 'နိုင်', 'လို', 'ထင်', 'နေ',
    'ကောင်း', 'ဆိုး', 'ကြီး', 'ငယ်', 'များ', 'နည်း', 'သစ်', 'ဟောင်း', 'မှန်', 'လွတ်လပ်', 'စစ်မှန်', 'အရေးကြီး',
    'တက္ကသိုလ်', 'ဆရာ', 'ကျောင်းသား', 'မိဘ', 'မိတ်ဆွေ', 'အမျိုးသမီး', 'အမျိုးသား', 'ကလေး', 'လူငယ်', 'လူကြီး'
]
for k in bnlp_all:
    if len(common_list) >= 450: break
    if k not in common_list and 2 <= len(k) <= 5 and any('\u1000' <= c <= '\u109f' for c in k):
        common_list.append(k)

common_lex = {}
for w in common_list:
    tags = bnlp_all.get(w, ['NOUN'])
    clean_tags = []
    for t in tags:
        tl = t.lower()
        if 'noun' in tl: clean_tags.append('n')
        elif 'verb' in tl: clean_tags.append('v')
        elif 'adj' in tl: clean_tags.append('adj')
        elif 'adv' in tl: clean_tags.append('adv')
        elif 'postp' in tl: clean_tags.append('postp')
        elif 'part' in tl: clean_tags.append('part')
        elif 'pron' in tl: clean_tags.append('pron')
        elif 'conj' in tl: clean_tags.append('conj')
    common_lex[w] = clean_tags or ['n']

def clean_rules(rules):
    out = []
    for r in rules:
        f = r['from']
        t = r['to']
        for i in range(1, 10):
            t = t.replace(f'\\{i}', f'${i}')
        out.append({'f': f, 't': t})
    return out

zg2uni_rules = clean_rules(zg2uni_raw)
uni2zg_rules = clean_rules(uni2zg_raw)

template = '''/**
 * BurmeseNLP (JavaScript Web Engine)
 * Rule-based Myanmar (Burmese) NLP toolkit for browsers and local file:// execution.
 * 
 * Ported & adapted from:
 *   - burmesenlp (https://github.com/aungthuhein2005/burmesenlp) by Aung Thu Hein
 *   - myanmar-words (https://github.com/myanmartools/myanmar-words) by Myanmar Tools
 *   - Rabbit Converter (https://github.com/Rabbit-Converter/Rabbit)
 * 
 * Features:
 *   1. Unicode Normalization & ZWSP stripping (NFC standard)
 *   2. Zawgyi Detection & Dual-direction Conversion (zg2uni, uni2zg)
 *   3. Syllable Segmentation (sylbreak regex standard by Ye Kyaw Thu)
 *   4. Longest-match Word Segmentation
 *   5. Rule-based POS Tagging (Noun, Verb, Adjective, Adverb, Postposition, Particle, etc.)
 *   6. Reverse Myanmar-to-English dictionary lookup hook
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BurmeseNLP = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // -------------------------------------------------------------
  // 1. GRAMMATICAL CONSTANTS & CLOSED-CLASS MARKERS
  // -------------------------------------------------------------
  const PPM_MARKERS = new Set([
    'က', 'ကို', 'မှာ', 'မှ', '၌', 'တွင်', 'အား', 'သို့',
    'ဖြင့်', 'နှင့်', 'နဲ့', 'ရဲ့', '၏', 'ကတော့'
  ]);

  const CONJUNCTIONS = new Set([
    'သို့မဟုတ်', 'ဒါပေမယ့်', 'ဒါမှမဟုတ်', 'ဘာဖြစ်လို့လဲဆိုတော့',
    'ထိုနည်းတူ', 'ထို့ကြောင့်', 'သို့သော်', 'ပြီးတော့', 'လျှင်',
    'သလို', 'ပေမဲ့'
  ]);

  const FINAL_PARTICLES = new Set(['သည်', 'တယ်', 'မည်', 'ပြီ', 'လား', 'မလား', '၏']);
  const SENTENCE_FINAL_PARTICLES = new Set(['သည်', 'တယ်', 'မည်', 'ပြီ', 'လား', 'မလား']);
  const POST_FINAL_CONTINUATIONS = new Set(['ဟု', 'ဟူ', 'လို့', 'ဆို', 'ဆိုပြီး']);
  const VERB_AUXILIARIES = new Set(['နေ', 'ခဲ့', 'ထား', 'ပေး', 'လိုက်', 'ပစ်', 'ဖူး']);
  const NOUN_SUFFIXES = new Set(['များ', 'တွေ', 'မှု', 'ချက်', 'ခြင်း', 'ရေး']);
  const COUNTER_CLASSIFIERS = new Set([
    'ယောက်', 'ဦး', 'ကောင်', 'ခု', 'လုံး', 'ချောင်း', 'စင်း', 'ထည်', 'တွဲ',
    'ပါး', 'ဆူ', 'လက်', 'ပင်', 'ပွင့်', 'ရွက်', 'စီး', 'စောင်', 'သုတ်', 'စု'
  ]);

  const POS_LABELS = {
    'n': { mm: 'နာမ်', en: 'Noun', color: 'bg-blue-500/10 text-blue-600 border-blue-400/30' },
    'v': { mm: 'ကြိယာ', en: 'Verb', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-400/30' },
    'adj': { mm: 'နာမဝိသေသန', en: 'Adjective', color: 'bg-amber-500/10 text-amber-600 border-amber-400/30' },
    'adv': { mm: 'ကြိယာဝိသေသန', en: 'Adverb', color: 'bg-purple-500/10 text-purple-600 border-purple-400/30' },
    'pron': { mm: 'နာမ်စား', en: 'Pronoun', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-400/30' },
    'postp': { mm: 'ဝိဘတ်', en: 'Postposition', color: 'bg-rose-500/10 text-rose-600 border-rose-400/30' },
    'part': { mm: 'ပစ္စည်း', en: 'Particle', color: 'bg-teal-500/10 text-teal-600 border-teal-400/30' },
    'conj': { mm: 'သမ္ဗန္ဓ', en: 'Conjunction', color: 'bg-orange-500/10 text-orange-600 border-orange-400/30' },
    'num': { mm: 'သင်္ချာ', en: 'Numeral', color: 'bg-cyan-500/10 text-cyan-600 border-cyan-400/30' },
    'punct': { mm: 'ပုဒ်ဖြတ်', en: 'Punctuation', color: 'bg-stone-500/10 text-stone-600 border-stone-400/30' },
    'aux': { mm: 'ကူကြိယာ', en: 'Auxiliary Verb', color: 'bg-lime-500/10 text-lime-600 border-lime-400/30' },
    'unk': { mm: 'စကားလုံး', en: 'Word', color: 'bg-stone-500/10 text-stone-600 border-stone-400/30' }
  };

  // -------------------------------------------------------------
  // 2. CONSONANT BUCKET MAPPING (33 Consonants)
  // -------------------------------------------------------------
  const CONSONANT_MAP = {
    'က': 'ka', 'ခ': 'kha', 'ဂ': 'ga', 'ဃ': 'gha', 'င': 'nga',
    'စ': 'ca', 'ဆ': 'cha', 'ဇ': 'za', 'ဈ': 'zha', 'ည': 'nya',
    'ဋ': 'tta', 'ဌ': 'ttha', 'ဍ': 'dda', 'ဎ': 'ddha', 'ဏ': 'nna',
    'တ': 'ta', 'ထ': 'tha', 'ဒ': 'da', 'ဓ': 'dha', 'န': 'na',
    'ပ': 'pa', 'ဖ': 'pha', 'ဗ': 'ba', 'ဘ': 'bha', 'မ': 'ma',
    'ယ': 'ya', 'ရ': 'ra', 'လ': 'la', 'ဝ': 'wa', 'သ': 'sa',
    'ဟ': 'ha', 'ဠ': 'lla', 'အ': 'a'
  };

  const INDEP_VOWELS = 'ဣဤဥဦဧဩဪ၌၍၎၏';
  for (let i = 0; i < INDEP_VOWELS.length; i++) {
    CONSONANT_MAP[INDEP_VOWELS[i]] = 'a';
  }

  function getConsonantBucket(word) {
    if (!word) return 'other';
    const clean = word.trim().replace(/^[၊။\\s,;"']+/, '');
    if (!clean) return 'other';
    return CONSONANT_MAP[clean[0]] || 'other';
  }

  // -------------------------------------------------------------
  // 3. TEXT NORMALIZATION (NFC & Zero-Width Stripping)
  // -------------------------------------------------------------
  const ZERO_WIDTH_REGEX = /[\\u200B\\u200C\\u200D\\u2060\\uFEFF]/g;

  function normalize(text) {
    if (typeof text !== 'string') return '';
    return text.replace(ZERO_WIDTH_REGEX, '').normalize('NFC');
  }

  // -------------------------------------------------------------
  // 4. ZAWGYI DETECTION & CONVERSION RULES
  // -------------------------------------------------------------
  const ZAWGYI_HINTS = /[\\u105A\\u1060-\\u1097]|(?:^|[^\\u1000-\\u1021\\u103A-\\u103F])[\\u1031\\u103B]|\\u1031\\u1031|\\u103A\\u103A/;

  function isZawgyi(text) {
    if (!text || typeof text !== 'string') return false;
    return ZAWGYI_HINTS.test(text);
  }

  const ZG2UNI_RULES = %ZG2UNI_RULES%;
  const UNI2ZG_RULES = %UNI2ZG_RULES%;

  const compiledZg2Uni = ZG2UNI_RULES.map(r => ({
    regex: new RegExp(r.f, 'g'),
    replace: r.t
  }));

  const compiledUni2Zg = UNI2ZG_RULES.map(r => ({
    regex: new RegExp(r.f, 'g'),
    replace: r.t
  }));

  function zg2uni(text) {
    if (!text) return '';
    let out = String(text);
    for (let i = 0; i < compiledZg2Uni.length; i++) {
      out = out.replace(compiledZg2Uni[i].regex, compiledZg2Uni[i].replace);
    }
    return normalize(out);
  }

  function uni2zg(text) {
    if (!text) return '';
    let out = String(text);
    for (let i = 0; i < compiledUni2Zg.length; i++) {
      out = out.replace(compiledUni2Zg[i].regex, compiledUni2Zg[i].replace);
    }
    return out;
  }

  function toUnicode(text) {
    if (!text) return '';
    if (isZawgyi(text)) {
      return zg2uni(text);
    }
    return normalize(text);
  }

  // -------------------------------------------------------------
  // 5. DETERMINISTIC SYLLABLE TOKENIZATION (Sylbreak Standard)
  // -------------------------------------------------------------
  const SYLBREAK_PAT = /(?<!\\u1039)[\\u1000-\\u1021](?![\\u103A\\u1039])|[\\u1023-\\u102A\\u104C-\\u104F]|(?<![\\u1040-\\u1049])[\\u1040-\\u1049]|[\\u104A\\u104B]/g;

  function syllableBreak(text) {
    const norm = normalize(text);
    if (!norm) return [];

    const indices = [];
    let m;
    SYLBREAK_PAT.lastIndex = 0;
    while ((m = SYLBREAK_PAT.exec(norm)) !== null) {
      indices.push(m.index);
    }

    if (indices.length === 0) {
      return norm.trim() ? [norm] : [];
    }

    const syllables = [];
    if (indices[0] > 0) {
      const lead = norm.slice(0, indices[0]);
      if (lead) syllables.push(lead);
    }

    for (let i = 0; i < indices.length; i++) {
      const start = indices[i];
      const end = (i + 1 < indices.length) ? indices[i + 1] : norm.length;
      syllables.push(norm.slice(start, end));
    }

    return syllables;
  }

  function tokenizeSyllables(text) {
    const norm = normalize(text);
    if (!norm) return [];

    const indices = [];
    let m;
    SYLBREAK_PAT.lastIndex = 0;
    while ((m = SYLBREAK_PAT.exec(norm)) !== null) {
      indices.push(m.index);
    }

    const tokens = [];
    if (indices.length === 0) {
      return [{ text: norm, start: 0, end: norm.length, kind: 'syllable' }];
    }

    if (indices[0] > 0) {
      tokens.push({
        text: norm.slice(0, indices[0]),
        start: 0,
        end: indices[0],
        kind: 'other'
      });
    }

    for (let i = 0; i < indices.length; i++) {
      const start = indices[i];
      const end = (i + 1 < indices.length) ? indices[i + 1] : norm.length;
      const sText = norm.slice(start, end);
      tokens.push({
        text: sText,
        start: start,
        end: end,
        kind: /^[၊။]$/.test(sText) ? 'punct' : (/^[၀-၉0-9]+$/.test(sText) ? 'digits' : 'syllable')
      });
    }

    return tokens;
  }

  // -------------------------------------------------------------
  // 6. DYNAMIC LEXICON & PARTITION LOADER
  // -------------------------------------------------------------
  const loadedPartitions = new Set();
  const partitionPromises = new Map();

  async function loadConsonantPartition(bucket) {
    bucket = bucket.toLowerCase();
    if (loadedPartitions.has(bucket)) return true;
    if (partitionPromises.has(bucket)) return partitionPromises.get(bucket);

    const promise = (async () => {
      // 1. If global window.HTET_MW_<BUCKET> already exists, mark loaded
      const varName = 'HTET_MW_' + bucket.toUpperCase();
      if (typeof window !== 'undefined' && window[varName]) {
        loadedPartitions.add(bucket);
        return true;
      }

      // 2. Try HTTP fetch on web servers
      const isFileProto = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');
      if (!isFileProto) {
        try {
          const res = await fetch(`data/myanmar-words/${bucket}.json`);
          if (res.ok) {
            const data = await res.json();
            if (typeof window !== 'undefined') window[varName] = data;
            loadedPartitions.add(bucket);
            return true;
          }
        } catch(e) {}
      }

      // 3. Fallback: dynamic script tag for file:// protocol
      if (typeof document !== 'undefined') {
        await new Promise((resolve) => {
          const s = document.createElement('script');
          s.src = `js/data/myanmar-words/${bucket}.js`;
          s.onload = () => { loadedPartitions.add(bucket); resolve(true); };
          s.onerror = () => { resolve(false); };
          document.head.appendChild(s);
        });
        return true;
      }
      return false;
    })();

    partitionPromises.set(bucket, promise);
    return promise;
  }

  const COMMON_LEXICON = %COMMON_LEXICON%;

  function getWordPOSFromLexicon(word) {
    if (COMMON_LEXICON[word]) return COMMON_LEXICON[word];
    const bucket = getConsonantBucket(word);
    const varName = 'HTET_MW_' + bucket.toUpperCase();
    if (typeof window !== 'undefined' && window[varName] && window[varName][word]) {
      return window[varName][word].p || ['n'];
    }
    return null;
  }

  // -------------------------------------------------------------
  // 7. GREEDY LONGEST-MATCH WORD SEGMENTATION
  // -------------------------------------------------------------
  function isKnownWord(word) {
    if (COMMON_LEXICON[word]) return true;
    if (PPM_MARKERS.has(word) || FINAL_PARTICLES.has(word) || CONJUNCTIONS.has(word)) return true;
    if (NOUN_SUFFIXES.has(word) || VERB_AUXILIARIES.has(word)) return true;
    const bucket = getConsonantBucket(word);
    const varName = 'HTET_MW_' + bucket.toUpperCase();
    if (typeof window !== 'undefined' && window[varName] && window[varName][word]) return true;
    return false;
  }

  function wordTokenize(text, maxLookahead = 6) {
    const norm = normalize(text);
    if (!norm) return [];

    // Split on whitespace / punctuation first to preserve paragraphs
    const paragraphs = norm.split(/([\\s၊။]+)/);
    const words = [];

    for (const para of paragraphs) {
      if (!para) continue;
      if (/^[\\s၊။]+$/.test(para)) {
        const trimmed = para.trim();
        if (trimmed) words.push(trimmed);
        continue;
      }

      const syllables = syllableBreak(para);
      let i = 0;
      const n = syllables.length;

      while (i < n) {
        let matched = false;
        const upper = Math.min(n, i + maxLookahead);

        // Try longest sequence down to 2
        for (let j = upper; j > i + 1; j--) {
          const candidate = syllables.slice(i, j).join('');
          if (isKnownWord(candidate)) {
            words.push(candidate);
            i = j;
            matched = true;
            break;
          }
        }

        if (!matched) {
          // Check digit + classifier pattern (e.g. ၃ခု, ၅ယောက်)
          if (/^[၀-၉0-9]+$/.test(syllables[i]) && i + 1 < n && COUNTER_CLASSIFIERS.has(syllables[i + 1])) {
            words.push(syllables[i] + syllables[i + 1]);
            i += 2;
          } else {
            words.push(syllables[i]);
            i++;
          }
        }
      }
    }

    return words;
  }

  // -------------------------------------------------------------
  // 8. RULE-BASED POS TAGGING
  // -------------------------------------------------------------
  function posTag(words) {
    if (!Array.isArray(words)) return [];

    return words.map((w, idx) => {
      if (/^[၊။.,;:!?()]+$/.test(w)) return { word: w, tag: 'punct', ...POS_LABELS['punct'] };
      if (/^[၀-၉0-9]+$/.test(w)) return { word: w, tag: 'num', ...POS_LABELS['num'] };
      if (PPM_MARKERS.has(w)) return { word: w, tag: 'postp', ...POS_LABELS['postp'] };
      if (FINAL_PARTICLES.has(w)) return { word: w, tag: 'part', ...POS_LABELS['part'] };
      if (CONJUNCTIONS.has(w)) return { word: w, tag: 'conj', ...POS_LABELS['conj'] };
      if (VERB_AUXILIARIES.has(w)) return { word: w, tag: 'aux', ...POS_LABELS['aux'] };
      if (NOUN_SUFFIXES.has(w)) return { word: w, tag: 'part', ...POS_LABELS['part'] };

      // Lookup in Myanmar Words Lexicon
      const lexiconPOS = getWordPOSFromLexicon(w);
      if (lexiconPOS && lexiconPOS.length > 0) {
        const primary = lexiconPOS[0];
        const info = POS_LABELS[primary] || POS_LABELS['unk'];
        return { word: w, tag: primary, ...info };
      }

      // Context heuristics
      const nextWord = words[idx + 1];
      if (nextWord && (PPM_MARKERS.has(nextWord) || NOUN_SUFFIXES.has(nextWord))) {
        return { word: w, tag: 'n', ...POS_LABELS['n'] };
      }
      if (nextWord && (FINAL_PARTICLES.has(nextWord) || VERB_AUXILIARIES.has(nextWord))) {
        return { word: w, tag: 'v', ...POS_LABELS['v'] };
      }

      return { word: w, tag: 'unk', ...POS_LABELS['unk'] };
    });
  }

  // -------------------------------------------------------------
  // 9. REVERSE MYANMAR-TO-ENGLISH DICTIONARY LOOKUP
  // -------------------------------------------------------------
  async function lookupMyanmarToEnglish(myWord) {
    if (!myWord) return [];
    myWord = toUnicode(myWord.trim());
    const bucket = getConsonantBucket(myWord);
    const varName = 'HTET_DICT_MY_' + bucket.toUpperCase();

    // 1. Check if partition is loaded
    if (typeof window !== 'undefined' && window[varName] && window[varName][myWord]) {
      return window[varName][myWord];
    }

    // 2. Check common
    if (typeof window !== 'undefined' && window.HTET_DICT_MY_COMMON && window.HTET_DICT_MY_COMMON[myWord]) {
      return window.HTET_DICT_MY_COMMON[myWord];
    }

    // 3. Load partition dynamically
    const isFileProto = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');
    if (!isFileProto) {
      try {
        const res = await fetch(`data/dictionary/reverse/${bucket}.json`);
        if (res.ok) {
          const data = await res.json();
          if (typeof window !== 'undefined') window[varName] = data;
          return data[myWord] || [];
        }
      } catch(e) {}
    }

    if (typeof document !== 'undefined') {
      await new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = `js/data/dictionary/reverse/${bucket}.js`;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.appendChild(s);
      });
      if (typeof window !== 'undefined' && window[varName] && window[varName][myWord]) {
        return window[varName][myWord];
      }
    }

    return [];
  }

  // -------------------------------------------------------------
  // 10. UNIFIED ANALYZE PIPELINE
  // -------------------------------------------------------------
  async function analyze(rawText) {
    const detectedZawgyi = isZawgyi(rawText);
    const unicodeText = detectedZawgyi ? zg2uni(rawText) : normalize(rawText);
    const syllables = syllableBreak(unicodeText);

    // Pre-load consonant buckets for words present in text
    const neededBuckets = new Set();
    for (const s of syllables) {
      neededBuckets.add(getConsonantBucket(s));
    }
    if (typeof window !== 'undefined') {
      await Promise.all(Array.from(neededBuckets).map(b => loadConsonantPartition(b)));
    }

    const words = wordTokenize(unicodeText);
    const tagged = posTag(words);

    return {
      original: rawText,
      normalized: unicodeText,
      isZawgyi: detectedZawgyi,
      syllables: syllables,
      words: tagged,
      stats: {
        chars: unicodeText.length,
        syllables: syllables.length,
        words: words.length
      }
    };
  }

  // Public API
  return {
    normalize,
    isZawgyi,
    zg2uni,
    uni2zg,
    toUnicode,
    syllableBreak,
    tokenizeSyllables,
    wordTokenize,
    posTag,
    analyze,
    lookupMyanmarToEnglish,
    loadConsonantPartition,
    getConsonantBucket,
    POS_LABELS,
    VERSION: '1.2.0-web'
  };
}));
'''

code = template.replace('%ZG2UNI_RULES%', json.dumps(zg2uni_rules, ensure_ascii=False))
code = code.replace('%UNI2ZG_RULES%', json.dumps(uni2zg_rules, ensure_ascii=False))
code = code.replace('%COMMON_LEXICON%', json.dumps(common_lex, ensure_ascii=False))

out_path = Path('js/burmesenlp.js')
out_path.write_text(code, encoding='utf-8')
print(f"Generated {out_path} ({len(code)} bytes, {len(zg2uni_rules)} ZG2UNI rules, {len(uni2zg_rules)} UNI2ZG rules)")
