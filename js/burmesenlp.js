/**
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
    const clean = word.trim().replace(/^[၊။\s,;"']+/, '');
    if (!clean) return 'other';
    return CONSONANT_MAP[clean[0]] || 'other';
  }

  // -------------------------------------------------------------
  // 3. TEXT NORMALIZATION (NFC & Zero-Width Stripping)
  // -------------------------------------------------------------
  const ZERO_WIDTH_REGEX = /[\u200B\u200C\u200D\u2060\uFEFF]/g;

  function normalize(text) {
    if (typeof text !== 'string') return '';
    return text.replace(ZERO_WIDTH_REGEX, '').normalize('NFC');
  }

  // -------------------------------------------------------------
  // 4. ZAWGYI DETECTION & CONVERSION RULES
  // -------------------------------------------------------------
  const ZAWGYI_HINTS = /[\u105A\u1060-\u1097]|(?:^|[^\u1000-\u1021\u103A-\u103F])[\u1031\u103B]|\u1031\u1031|\u103A\u103A/;

  function isZawgyi(text) {
    if (!text || typeof text !== 'string') return false;
    return ZAWGYI_HINTS.test(text);
  }

  const ZG2UNI_RULES = [{"f": "([ိီွု့႕])\\1+", "t": "$1"}, {"f": "​", "t": ""}, {"f": "ွြ", "t": "ႊ"}, {"f": "(ွ|ႇ)", "t": "ှ"}, {"f": "ြ", "t": "ွ"}, {"f": "(ျ|ၾ|ၿ|ႀ|ႁ|ႂ|ႃ|ႄ)", "t": "ြ"}, {"f": "(်|ၽ)", "t": "ျ"}, {"f": "္", "t": "်"}, {"f": "(ၦ|ၧ)", "t": "္ဆ"}, {"f": "ၪ", "t": "ဉ"}, {"f": "ၫ", "t": "ည"}, {"f": "ၬ", "t": "္ဋ"}, {"f": "ၭ", "t": "္ဌ"}, {"f": "ၮ", "t": "ဍ္ဍ"}, {"f": "ၯ", "t": "ဍ္ဎ"}, {"f": "ၰ", "t": "္ဏ"}, {"f": "(ၱ|ၲ)", "t": "္တ"}, {"f": "ၠ", "t": "္က"}, {"f": "ၡ", "t": "္ခ"}, {"f": "ၢ", "t": "္ဂ"}, {"f": "ၣ", "t": "္ဃ"}, {"f": "ၥ", "t": "္စ"}, {"f": "ၨ", "t": "္ဇ"}, {"f": "ၩ", "t": "္ဈ"}, {"f": "(ၳ|ၴ)", "t": "္ထ"}, {"f": "ၵ", "t": "္ဒ"}, {"f": "ၶ", "t": "္ဓ"}, {"f": "ၷ", "t": "္န"}, {"f": "ၸ", "t": "္ပ"}, {"f": "ၹ", "t": "္ဖ"}, {"f": "ၺ", "t": "္ဗ"}, {"f": "ၼ", "t": "္မ"}, {"f": "ႅ", "t": "္လ"}, {"f": "ဳ", "t": "ု"}, {"f": "ဴ", "t": "ူ"}, {"f": "ဿ", "t": "ူ"}, {"f": "ႆ", "t": "ဿ"}, {"f": "ံႈ", "t": "ႈံ"}, {"f": "ႈ", "t": "ှု"}, {"f": "ႉ", "t": "ှူ"}, {"f": "ႊ", "t": "ွှ"}, {"f": "ျၤ", "t": "ၤျ"}, {"f": "ြ([က-အ])([ၤႋႍ])", "t": "$1ြ$2"}, {"f": "(ေ)?([က-အ၀-၉])(ြ)?ၤ", "t": "င်္$1$2$3"}, {"f": "(ေ)?([က-အ])(ျ|ြ)?ႋ", "t": "င်္$1$2$3ိ"}, {"f": "(ေ)?([က-အ])(ျ)?ႌ", "t": "င်္$1$2$3ီ"}, {"f": "(ေ)?([က-အ])([ျြ])?ႍ", "t": "င်္$1$2$3ံ"}, {"f": "ႎ", "t": "ိံ"}, {"f": "ႏ", "t": "န"}, {"f": "႐", "t": "ရ"}, {"f": "႑", "t": "ဏ္ဍ"}, {"f": "႒", "t": "ဋ္ဌ"}, {"f": "မာ(ၻ|႓)", "t": "မ္ဘာ"}, {"f": "(ၻ|႓)", "t": "္ဘ"}, {"f": "(႔|႕)", "t": "့"}, {"f": "([က-အ])့ဲ", "t": "$1ဲ့"}, {"f": "႖", "t": "္တွ"}, {"f": "႗", "t": "ဋ္ဋ"}, {"f": "ြ([က-အ])([က-အ])?", "t": "$1ြ$2"}, {"f": "([က-အ])ြ်", "t": "ြ$1်"}, {"f": "၇(?=[ာ-ူဲံ-းွး])", "t": "ရ"}, {"f": "ေ၇", "t": "ေရ"}, {"f": "၀(ီ|ု|ို|ူ|ံ|ွ|ှ)", "t": "ဝ$1"}, {"f": "([^၀၁၂၃၄၅၆၇၈၉])၀ါ", "t": "$1ဝါ"}, {"f": "([၀၁၂၃၄၅၆၇၈၉])၀ါ(?!း)", "t": "$1ဝါ"}, {"f": "^၀(?=ါ)", "t": "ဝ"}, {"f": "၀ိ(?! ?/)", "t": "ဝိ"}, {"f": "([^၀-၉])၀([^၀-၉ ]|[၊။])", "t": "$1ဝ$2"}, {"f": "([^၀-၉])၀(?=[\\f\\n\\r])", "t": "$1ဝ"}, {"f": "([^၀-၉])၀$", "t": "$1ဝ"}, {"f": "ေ([က-အဿ])(ှ)?(ျ)?", "t": "$1$2$3ေ"}, {"f": "([က-အ])ေ([ျြွှ]+)", "t": "$1$2ေ"}, {"f": "ဲွ", "t": "ွဲ"}, {"f": "([ိီ])ျ", "t": "ျ$1"}, {"f": "ွျ", "t": "ျွ"}, {"f": "့်", "t": "့်"}, {"f": "ု(ိ|ီ|ံ|့)ု", "t": "ု$1"}, {"f": "(ု|ူ)(ိ|ီ)", "t": "$2$1"}, {"f": "(ှ)(ျ|ြ)", "t": "$2$1"}, {"f": "ဥ(?=[့]?[်ာ])", "t": "ဉ"}, {"f": "ဦ", "t": "ဦ"}, {"f": "စျ", "t": "ဈ"}, {"f": "ံ(ု|ူ)", "t": "$1ံ"}, {"f": "ေ့ှ", "t": "ှေ့"}, {"f": "ေှာ", "t": "ှော"}, {"f": "ၚ", "t": "ါ်"}, {"f": "ေျှ", "t": "ျှေ"}, {"f": "(ိ|ီ)(ွ|ှ)", "t": "$2$1"}, {"f": "ာ္([က-အ])", "t": "္$1ာ"}, {"f": "္ြ်္([က-အ])", "t": "်္$1ြ"}, {"f": "ြ္([က-အ])", "t": "္$1ြ"}, {"f": "ံ္([က-အ])", "t": "္$1ံ"}, {"f": "၎", "t": "၎င်း"}, {"f": "၀(ါ|ာ|ံ)", "t": "ဝ$1"}, {"f": "ဥ္", "t": "ဉ္"}, {"f": "([က-အ])ြေွ", "t": "$1ြွေ"}, {"f": "([က-အ])ျေွ(ှ)?", "t": "$1ျွ$2ေ"}, {"f": "([က-အ])ွေျ", "t": "$1ျွေ"}, {"f": "([က-အ])ေ(္[က-အ]ွ?)", "t": "$1$2ေ"}, {"f": "း်", "t": "်း"}, {"f": "ိ်|်ိ", "t": "ိ"}, {"f": "ို်", "t": "ို"}, {"f": " ့", "t": "့"}, {"f": "့ံ", "t": "ံ့"}, {"f": "[ိ]+", "t": "ိ"}, {"f": "[်]+", "t": "်"}, {"f": "[ွ]+", "t": "ွ"}, {"f": "[့]+", "t": "့"}, {"f": "[ီ]+", "t": "ီ"}, {"f": "ိီ|ီိ", "t": "ီ"}, {"f": "ုိ", "t": "ို"}, {"f": "့့", "t": "့"}, {"f": "ဲဲ", "t": "ဲ"}, {"f": "၄င်း", "t": "၎င်း"}, {"f": "([ိီ])္([က-အ])", "t": "္$2$1"}, {"f": "(ြေ)္([က-အ])", "t": "္$2$1"}, {"f": "ံွ", "t": "ွံ"}, {"f": "၇((?=[က-အ]်)|(?=[ာ-ူဲံ-းွှ]))", "t": "ရ"}];
  const UNI2ZG_RULES = [{"f": "င်္", "t": "ၤ"}, {"f": "္တွ", "t": "႖"}, {"f": "ါ်", "t": "ၚ"}, {"f": "ိံ", "t": "ႎ"}, {"f": "၎င်း", "t": "၎"}, {"f": "[ဥဉ](?=္)", "t": "ၪ"}, {"f": "ဉ(?=[ုူ])", "t": "ဥ"}, {"f": "[ဥဉ](?=[့]?[်])", "t": "ဥ"}, {"f": "ည(?=[္ွ])", "t": "ၫ"}, {"f": "(္[က-အ])(ိ){0,1}ု", "t": "$1$2ဳ"}, {"f": "(္[က-အ])ူ", "t": "$1ဴ"}, {"f": "န(?=[ိီု်]?[ူွှု္])", "t": "ႏ"}, {"f": "န(?=်ု )", "t": "ႏ"}, {"f": "နြ", "t": "ႏြ"}, {"f": "္က", "t": "ၠ"}, {"f": "္ခ", "t": "ၡ"}, {"f": "္ဂ", "t": "ၢ"}, {"f": "္ဃ", "t": "ၣ"}, {"f": "္စ", "t": "ၥ"}, {"f": "္ဆ", "t": "ၦ"}, {"f": "္ဇ", "t": "ၨ"}, {"f": "္ဈ", "t": "ၩ"}, {"f": "္ဋ", "t": "ၬ"}, {"f": "ဋ္ဌ", "t": "႒"}, {"f": "္ဌ", "t": "ၭ"}, {"f": "ဍ္ဍ", "t": "ၮ"}, {"f": "ဍ္ဎ", "t": "ၯ"}, {"f": "္ဏ", "t": "ၰ"}, {"f": "္တ", "t": "ၱ"}, {"f": "္ထ", "t": "ၳ"}, {"f": "္ဒ", "t": "ၵ"}, {"f": "္ဓ", "t": "ၶ"}, {"f": "္[နႏ]", "t": "ၷ"}, {"f": "္ပ", "t": "ၸ"}, {"f": "္ဖ", "t": "ၹ"}, {"f": "္ဗ", "t": "ၺ"}, {"f": "္ဘ", "t": "ၻ"}, {"f": "္မ", "t": "ၼ"}, {"f": "္လ", "t": "ႅ"}, {"f": "ဿ", "t": "ႆ"}, {"f": "ွှ", "t": "ႊ"}, {"f": "(ၤ)([က-အ])([ျြ]?)ိ", "t": "$2$3ႋ"}, {"f": "(ၤ)([က-အ])([ျြ]?)ီ", "t": "$2$3ႌ"}, {"f": "(ၤ)([က-အ])([ျြ]?)ံ", "t": "$2$3ႍ"}, {"f": "(ၤ)([က-အ၀-၉])([ျြ]?)([ေ]?)", "t": "$2$3$4$1"}, {"f": "ရ(?=([ိီ]?)[ုူွႊ])", "t": "႐"}, {"f": "ဏ္ဍ", "t": "႑"}, {"f": "ဋ္ဋ", "t": "႗"}, {"f": "([က-အႏဩၪၮၯႆ႐႑႒႗႖])([ၠ-ၩၬၭၰ-ၼႅႊ])?([ျ-ှ]*)?ေ", "t": "ေ$1$2$3"}, {"f": "ြှ", "t": "ြႇ"}, {"f": "([က-အႏဩ])([ၠ-ၩၬၭၰ-ၼႅ])?(ြ)", "t": "$3$1$2"}, {"f": "်", "t": "္"}, {"f": "ျ", "t": "်"}, {"f": "ြ", "t": "ျ"}, {"f": "ွ", "t": "ြ"}, {"f": "ှ", "t": "ွ"}, {"f": "([^်ည])ွ([ိီ]?)ု", "t": "$1ႈ$2"}, {"f": "([ရ်ြႊႈ႐])([ူွ])?([ဲံ္ိီႋႌႍႎ]?)(ု)?့", "t": "$1$2$3$4႕"}, {"f": "([ုနူွ])([ဲံ္ိီႋႌႍႎ]?)့", "t": "$1$2႔"}, {"f": "([ျ])([က-အ])([ႇ]?)([ံိီႋႌႍႎ]?)ု", "t": "$1$2$3$4ဳ"}, {"f": "([ျ])([က-အ])([ႇ]?)([ံိီႋႌႍႎ]?)ူ", "t": "$1$2$3$4ဴ"}, {"f": "([်ြညဈဋဌဍဠဥ])([ွ]?)([ံိီႋႌႍႎ]?)ု", "t": "$1$2$3ဳ"}, {"f": "([်ြညဈဋဌဍဠဥ])(ွ?)([ံိီႋႌႍႎ]?)ူ", "t": "$1$2$3ဴ"}, {"f": "([ညဠဉ])ွ", "t": "$1ႇ"}, {"f": "ွူ", "t": "ႉ"}, {"f": "ျ([ကဃဆဏတထဘယလယသဟ])", "t": "ၾ$1"}, {"f": "ၾ([ကဃဆဏတထဘယလယသဟ])([ြႊ])([ဲံိီႋႌႍႎ])", "t": "ႄ$1$2$3"}, {"f": "ၾ([ကဃဆဏတထဘယလယသဟ])([ြႊ])", "t": "ႂ$1$2"}, {"f": "ၾ([ကဃဆဏတထဘယလယသဟ])([ဳဴ]?)([ဲံိီႋႌႍႎ])", "t": "ႀ$1$2$3"}, {"f": "ျ([က-အ])([ြႊ])([ဲံိီႋႌႍႎ])", "t": "ႃ$1$2$3"}, {"f": "ျ([က-အ])([ြႊ])", "t": "ႁ$1$2"}, {"f": "ျ([က-အ])([ဳဴ]?)([ဲံိီႋႌႍႎ])", "t": "ၿ$1$2$3"}, {"f": "်ွ", "t": "ွ်"}, {"f": "်([ြႊ])", "t": "$1ၽ"}, {"f": "([ဳဴ])(ံ?)႔", "t": "$1$2႕"}, {"f": "ႏၱ", "t": "ႏၲ"}, {"f": "ႏၳ", "t": "ႏၴ"}, {"f": "([က-အ])([ၻၦ])ာ", "t": "$1ာ$2"}, {"f": "ာ([ၻၦ])့", "t": "ာ$1႔"}, {"f": "၇((?=[က-အ]္)|(?=[ာ-ူဲံ-းြွ]))", "t": "ရ"}];

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
  const SYLBREAK_PAT = /(?<!\u1039)[\u1000-\u1021](?![\u103A\u1039])|[\u1023-\u102A\u104C-\u104F]|(?<![\u1040-\u1049])[\u1040-\u1049]|[\u104A\u104B]/g;

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

  const COMMON_LEXICON = {"ကျွန်တော်": ["pron"], "ကျွန်မ": ["pron"], "သူ": ["pron"], "သူတို့": ["n"], "ငါ": ["pron"], "မိမိ": ["pron"], "ကိုယ်": ["pron"], "ဒီ": ["pron"], "ထို": ["adj"], "ယင်း": ["adj"], "ဘာ": ["pron"], "ဘယ်": ["pron"], "ကျောင်း": ["n"], "အိမ်": ["n"], "လူ": ["n"], "နိုင်ငံ": ["n"], "ပြည်သူ": ["n"], "အစိုးရ": ["n"], "တရား": ["n"], "ဥပဒေ": ["n"], "အလုပ်": ["n"], "အချိန်": ["n"], "နေ့": ["n"], "နှစ်": ["n"], "စနစ်": ["n"], "အဖွဲ့": ["n"], "ကမ္ဘာ": ["n"], "သမိုင်း": ["n"], "ခေတ်": ["n"], "စကား": ["n"], "စာအုပ်": ["n"], "အတွေး": ["n"], "စိတ်": ["n"], "အသိ": ["n"], "ပညာ": ["n"], "အမှန်တရား": ["n"], "လွတ်လပ်ခွင့်": ["n"], "ဒီမိုကရေစီ": ["n"], "လူ့အခွင့်အရေး": ["n"], "တန်းတူညီမျှရေး": ["n"], "တရားမျှတမှု": ["n"], "ငြိမ်းချမ်းရေး": ["n"], "သတ္တိ": ["n"], "ကြောက်ရွံ့ခြင်း": ["n"], "အာဏာ": ["n"], "ခေါင်းဆောင်": ["n"], "သွား": ["v", "n"], "လာ": ["v"], "စား": ["v"], "လုပ်": ["v"], "ပြော": ["v"], "ဖြစ်": ["v"], "ရှိ": ["v"], "သိ": ["v"], "မြင်": ["v"], "ယူ": ["v"], "ပေး": ["part"], "ရ": ["v"], "နိုင်": ["part"], "လို": ["v"], "ထင်": ["v"], "နေ": ["v", "n", "part"], "ကောင်း": ["adj"], "ဆိုး": ["v"], "ကြီး": ["adj"], "ငယ်": ["adj"], "များ": ["part"], "နည်း": ["n"], "သစ်": ["adj"], "ဟောင်း": ["adj"], "မှန်": ["v"], "လွတ်လပ်": ["v"], "စစ်မှန်": ["adj"], "အရေးကြီး": ["v"], "တက္ကသိုလ်": ["n"], "ဆရာ": ["n"], "ကျောင်းသား": ["n"], "မိဘ": ["n"], "မိတ်ဆွေ": ["n"], "အမျိုးသမီး": ["n"], "အမျိုးသား": ["n"], "ကလေး": ["n"], "လူငယ်": ["n"], "လူကြီး": ["n"], "ဆေး": ["n"], "၁၀၀": ["n"], "အပင်": ["n"], "မှ": ["postp"], "ထား": ["v", "part"], "တာ": ["part"], "တယ်": ["part"], "အသစ်": ["adj"], "ဝယ်": ["v"], "တဲ့": ["part"], "အသီး": ["n"], "ပါ": ["part"], "ပေါ့": ["part"], "လျှင်": ["conj"], "နတ်": ["n"], "ထံ": ["postp"], "တို့": ["part"], "အား": ["postp", "n"], "သည်": ["part"], "နဝမ": ["adj"], "ကောသလ": ["n"], "သော": ["part"], "ရေကန်": ["n"], "တစ်": ["n"], "ခု": ["part"], "တွင်": ["postp"], "ဆင်း": ["v"], "ကြ": ["part"], "ကြည့်": ["v"], "ရင်": ["conj"], "ခက်": ["v"], "သလို": ["conj"], "တကယ့်": ["adv"], "တော့": ["part"], "အဲဒီ": ["pron"], "ဟုတ်": ["v"], "ဘူး": ["part"], "ကို": ["postp"], "ပြု": ["v"], "မှာ": ["postp"], "ပန်း": ["n"], "နဲ့": ["conj"], "လိမ့်": ["part"], "မယ်": ["postp"], "လိုက်": ["part"], "သို့": ["postp"], "ပြန်": ["v"], "ဘဲ": ["part"], "စလုံး": ["part"], "ပင်": ["part"], "သည့်": ["part"], "ဘက်": ["n"], "လေ": ["part"], "ညနေ": ["n"], "နာရီ": ["n"], "ခွဲ": ["v"], "တိတိ": ["part"], "လောက်": ["part"], "ကြာ": ["v"], "လေ့လာ": ["v"], "သခင်": ["n"], "နှင့်": ["conj"], "ဖွဲ့": ["part"], "ရန်": ["conj"], "လို့": ["part"], "စီး": ["part"], "ပို": ["adv", "adj"], "မင်း": ["pron"], "အဲ့ဒီ": ["pron"], "အခန်း": ["n"], "ရဲ့": ["postp"], "ထိုင်": ["v"], "ဘယ်သူ": ["pron"], "လဲ": ["part"], "ထဲ": ["postp"], "သူဌေး": ["n"], "မနက်": ["n"], "ရှေး": ["adj"], "သထုံ": ["n"], "ခဲ့": ["part"], "ဥပမာ": ["n"], "အမည်": ["n"], "အသက်": ["n"], "ပြီ": ["postp"], "လွယ်": ["v"], "ပဲ": ["part"], "မမ": ["n"], "ဟေ့": ["part"], "နို့": ["n"], "ဝမ်း": ["n"], "ဘလက်": ["n"], "တူး": ["v"], "တီး": ["v"], "ဆွဲ": ["v"], "မုန့်": ["n"], "ဦး": ["part"], "မလား": ["part"], "အရှေ့": ["n"], "နား": ["n"], "ဆူ": ["part"], "မြို့": ["n"], "ပေါ်": ["n"], "ဟူ၍": ["part"], "မျိုး": ["n"], "တောင်": ["n"], "အေး": ["adj"], "တွေ": ["part"], "ကြည့်": ["v"], "ပြီး": ["conj"], "သိရှိ": ["v"], "တွေ့": ["v"], "ခုန": ["n"], "သေး": ["part"], "သလား": ["part"], "သူ့": ["pron"], "မလဲ": ["part"], "အပြာ": ["n"], "အခြား": ["adj"], "လည်း": ["part"], "ဒါ": ["pron"], "လမ်းမ": ["n"], "အပြင်": ["n"], "စွာ": ["part"], "အမြန်": ["adv"], "ထွက်": ["v"], "စာ": ["n"], "ချိန်": ["n"], "လား": ["part"], "ရရှိ": ["v"], "အောင်": ["conj"], "ရေး": ["v"], "တာဝန်": ["n"], "အမြဲ": ["adv"], "သတိရ": ["v"], "စေ": ["part"], "ဖို့": ["part"], "ရောက်": ["v"], "စုဝေး": ["v"], "လေ့": ["part"], "သမ္မတ": ["n"], "ဦးနု": ["n"], "ပြ": ["v"], "ကာ": ["conj"], "မည်": ["pron"], "ရုပ်": ["n"], "ထည့်": ["v"], "တိုင်": ["v"], "မျှ": ["part"], "ပေ": ["part"], "ရွာ": ["v"], "ငါ့": ["pron"], "ရော": ["part"], "လည်": ["v"], "စဉ်": ["conj"], "အတွက်": ["postp"], "ခပ်": ["part"], "တူ": ["v"], "လူ့": ["n"], "ဝေဖန်": ["v"], "ကိစ္စ": ["n"], "လျော့": ["v"], "ယခု": ["n"], "ဟု": ["part"], "ဆို": ["v"], "နော်": ["part"], "တုန်း": ["part"], "ကြေမွ": ["v"], "စသော": ["part"], "တရုတ်": ["n"], "သန်း": ["v"], "၁၀၀၀": ["n"], "ခန့်": ["part"], "အထိ": ["postp"], "ဗုဒ္ဓ": ["n"], "ဂျပန်": ["n"], "အလွန်": ["adv"], "ခံ": ["v"], "ကဗျာ": ["n"], "ဘီစီ": ["n"], "အရ": ["postp"], "ကြယ်": ["n"], "လေး": ["part"], "ဟာ": ["part"], "ငါး": ["n"], "ရာသီ": ["n"], "တတ်": ["part"], "ပေါက်": ["v"], "ရေ": ["n"], "လုံး": ["part"], "ဖြင့်": ["postp"], "လိမ့်": ["part"], "၁၆၀၆": ["n"], "ထဲက": ["postp"], "သုံး": ["v"], "ဆောင်": ["v"], "ခေါက်": ["n"], "အိတ်": ["n"], "ထည့်": ["v"], "ဆံပင်": ["n"], "ညှပ်": ["v"], "သိပ်": ["adv"], "တော်": ["v"], "ရာ": ["part"], "ကျော်": ["part"], "ဗီဇ": ["n"], "ဆက်ခံ": ["v"], "ငှက်": ["n"], "ရှေ့": ["n"], "သာ": ["part"], "စပါး": ["n"], "ကုန်": ["n"], "အဓိက": ["n"], "ဦးတည်": ["v"], "လယ်ယာ": ["n"], "အကြား": ["n"], "ဆက်ဆံ": ["v"], "ဖုန်း": ["n"], "ဝက်": ["n"], "ရာ၌": ["conj"], "ဦးရေ": ["n"], "အမွေး": ["n"], "ထက်": ["conj"], "အရသာ": ["n"], "ဝင်": ["v"], "ဝင်လာ": ["v"], "အရမ်း": ["adv"], "လွန်း": ["adv"], "စူး": ["v"], "ထိပ်": ["n"], "ပြည့်": ["v"], "ကူညီ": ["v"], "ပြဿနာ": ["n"], "နှေး": ["v"], "မြန်": ["adj"], "ကျပ်": ["v"], "ဈေး": ["n"], "ဇုန်": ["n"], "စေရန်": ["conj"], "ပွေလီ": ["v"], "ဖွင့်": ["v"], "နောက်": ["n"], "မဲ့": ["part"], "နေရာ": ["n"], "လှပ": ["adj"], "ရွှေ": ["n"], "ငွေ": ["n"], "လက်ရာ": ["n"], "လျက်": ["conj"], "ဝေမျှ": ["v"], "ခံစား": ["v"], "အဖြစ်": ["n"], "ဆန္ဒ": ["n"], "ကြိမ်": ["part"], "ဖက်": ["part"], "အထူး": ["adj"], "တန်": ["n"], "အခု": ["n"], "စာရေး": ["v"], "အခါ": ["n"], "မင်": ["n"], "ကညစ်": ["n"], "ရယ်": ["part"], "ပေမဲ့": ["conj"], "ထမင်း": ["n"], "ချက်": ["v"], "ပါရဂူ": ["n"], "အဆို": ["n"], "လေထု": ["n"], "စရိတ်": ["n"], "ကျဉ်း": ["adj"], "ချေ": ["part"], "လက်ခံ": ["v"], "၁၉၄၈": ["n"], "ရက်": ["n"], "သလဲ": ["part"], "ဆုံးမ": ["n"], "အာရှ": ["n"], "ဒီဂရီ": ["n"], "၃၂": ["n"], "မိနစ်": ["n"], "၂၈": ["n"], "၃၁": ["n"], "၉၂": ["n"], "၁ဝ": ["n"], "၁ဝ၁": ["n"], "၁၁": ["n"], "ခြင်း": ["part"], "မှု": ["part"], "ကြား": ["v"], "ဥရောပ": ["n"], "ဒုတိယ": ["adj"], "ဘာသာ": ["adv"], "တည်း": ["part"], "ဒေသ": ["n"], "အပေါ်": ["n"], "မူတည်": ["v"], "စာသား": ["n"], "အများ": ["n"], "ခေါ်": ["v"], "ကောက်": ["v"], "ဂျုံ": ["n"], "ဧက": ["n"], "စိုက်": ["v"], "မယ့်": ["postp"], "ဇနီး": ["n"], "အဆင့်": ["n"], "တက်": ["v"], "ခရစ်": ["n"], "၁၇ဝဝ": ["n"], "ပြည့်": ["adj"], "တွက်": ["v"], "ပမာဏ": ["n"], "ရှင်း": ["v"], "ဟူသော": ["part"], "မဏ္ဍလ": ["n"], "ပုဒ်": ["part"], "ယူဆ": ["v"], "ယူနန်": ["n"], "ထိ": ["postp"], "မိုး": ["n"], "ပုံ": ["n"], "ရိုက်": ["v"], "ဒီလို": ["pron"], "ဒဲဂူ": ["n"], "ခွက်": ["n"], "ပိုင်": ["v"], "၁၉၄၃": ["n"], "ပါဝင်": ["v"], "စပ်": ["v"], "ကချင်": ["n"], "ပင်မ": ["n"], "ကျမ်း": ["n"], "ရပ်": ["v"], "ကား": ["n"], "ပျက်": ["v"], "ဘယ်နှ": ["adj"], "အသွား": ["n"], "ဗဟို": ["n"], "ခဲတံ": ["n"], "မြင့်": ["adj"], "အောက်": ["n"], "အမြီး": ["n"], "လှုပ်": ["v"], "ခါ": ["part"], "အသံ": ["n"], "သာမန်": ["adj"], "ပုဂံ": ["n"], "၁၉၆၂": ["n"], "၂၈၇၈၃": ["n"], "ချင်": ["part"], "ရေယို": ["v"], "အပို": ["n"], "ပြုစု": ["v"], "တီဗွီ": ["n"], "ပါစေ": ["postp"], "ညနေစာ": ["n"], "ကွယ်": ["part"], "သင့်": ["v"], "ဝတ္တု": ["n"], "ဖတ်": ["v"], "အရာ": ["n"], "ရင်း": ["conj"], "ဖိတ်": ["v"], "ကျွေး": ["v"], "၂၀၀၈": ["n"], "ထောင်": ["v"]};

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
    const paragraphs = norm.split(/([\s၊။]+)/);
    const words = [];

    for (const para of paragraphs) {
      if (!para) continue;
      if (/^[\s၊။]+$/.test(para)) {
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
    if (typeof words === 'string') {
      words = wordTokenize(words);
    }
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
        return { word: w, tag: primary, pos: primary, posLabel: info.name || primary, ...info };
      }

      // Context heuristics
      const nextWord = words[idx + 1];
      if (nextWord && (PPM_MARKERS.has(nextWord) || NOUN_SUFFIXES.has(nextWord))) {
        return { word: w, tag: 'n', ...POS_LABELS['n'] };
      }
      if (nextWord && (FINAL_PARTICLES.has(nextWord) || VERB_AUXILIARIES.has(nextWord))) {
        return { word: w, tag: 'v', ...POS_LABELS['v'] };
      }

      return { word: w, tag: 'unk', pos: 'unk', posLabel: 'သတ်မှတ်မထား (Unknown)', ...POS_LABELS['unk'] };
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
    sylbreak: syllableBreak,
    tokenizeSyllables,
    wordTokenize,
    posTag,
    tagSentence: posTag,
    POS_TAGS: POS_LABELS,
    analyze,
    lookupMyanmarToEnglish,
    loadConsonantPartition,
    getConsonantBucket,
    POS_LABELS,
    VERSION: '1.2.0-web'
  };
}));
