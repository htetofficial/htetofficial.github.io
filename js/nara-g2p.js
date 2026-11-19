/**
 * Nara Mini v1 — Burmese + English G2P & Number Verbalization Frontend (JS Port)
 * Faithfully ported from YeeNyunn/nara-mini-v1 (Apache License 2.0)
 * Attribution: Nara Mini v1 — Copyright 2026 Nara contributors (https://naraaudio.app)
 * Modified/ported to JavaScript for browser ONNX Runtime Web inference on Htet Official Archive.
 */
(function (global) {
  'use strict';

  // ==================== 1. BURMESE NUMBER VERBALIZATION (my_numbers.py) ====================
  const DIGITS = ['သုည', 'တစ်', 'နှစ်', 'သုံး', 'လေး', 'ငါး', 'ခြောက်', 'ခုနစ်', 'ရှစ်', 'ကိုး'];
  const PLACES = { 1: 'ဆယ်', 2: 'ရာ', 3: 'ထောင်', 4: 'သောင်း' };
  const CREAKY = { 'ဆယ်': 'ဆယ့်', 'ရာ': 'ရာ့', 'ထောင်': 'ထောင့်' };
  const MY_DIGITS = '၀၁၂၃၄၅၆၇၈၉';

  function myToAscii(s) {
    return s.replace(/[၀-၉]/g, ch => String(MY_DIGITS.indexOf(ch)));
  }

  function belowLakh(n) {
    const s = String(n);
    const parts = [];
    for (let i = 0; i < s.length; i++) {
      const d = Number(s[i]);
      const place = s.length - 1 - i;
      if (d) parts.push([d, place]);
    }
    const words = [];
    for (let j = 0; j < parts.length; j++) {
      const [d, place] = parts[j];
      if (place === 0) {
        words.push(DIGITS[d]);
        continue;
      }
      let unit = PLACES[place];
      if (j < parts.length - 1 && CREAKY[unit]) unit = CREAKY[unit];
      const lead = (d === 1 && place === 1 && j === 0) ? '' : DIGITS[d];
      words.push(lead + unit);
    }
    return words.join('');
  }

  function numberWords(n) {
    if (n === 0) return DIGITS[0];
    if (n < 100000) return belowLakh(n);
    const lakhs = Math.floor(n / 100000);
    const rest = n % 100000;
    return numberWords(lakhs) + 'သိန်း' + (rest ? belowLakh(rest) : '');
  }

  function digitByDigit(s) {
    return Array.from(s).map(c => DIGITS[Number(c)]).join(' ');
  }

  const D_CLS = '[0-9၀-၉]';
  const WA_RUN_RE = /(?:[၀-၉]|ဝ(?![ါ-ှ]))+/g;
  const NUM_RE = new RegExp(
    `(${D_CLS}{1,3}(?:,${D_CLS}{3})+|${D_CLS}+)(?:\\.(${D_CLS}+))?([kK](?![A-Za-z]))?(\\s?%)?(\\s?(?:Ks|KS|ks|MMK|mmk|Kyats?|kyats?)\\b)?`,
    'g'
  );

  function verbalize(text) {
    if (!/[0-9၀-၉]/.test(text)) return text;
    text = text.replace(WA_RUN_RE, m => (/[၀-၉]/.test(m) ? m.replace(/ဝ/g, '၀') : m));
    text = text.replace(NUM_RE, (_all, intPart, fracPart, kPart, pctPart, curPart) => {
      const raw = myToAscii(intPart).replace(/,/g, '');
      let out;
      if ((raw.length > 1 && raw[0] === '0' && !fracPart) || raw.length > 10) {
        out = digitByDigit(raw);
      } else {
        let n = parseInt(raw, 10);
        if (kPart) n *= 1000;
        out = numberWords(n);
        if (fracPart) {
          out += ' ဒသမ ' + digitByDigit(myToAscii(fracPart));
        }
      }
      if (pctPart) out += ' ရာခိုင်နှုန်း';
      if (curPart) out += ' ကျပ်';
      return ` ${out} `;
    });
    text = text.replace(/[ \t]{2,}/g, ' ');
    return text.replace(/ (?=[!?.,။၊])/g, '').trim();
  }

  // ==================== 2. ROMANIZED BURMESE NAMES (nara_names.py) ====================
  const NAME_MAP = {
    ma: 'ma→', daw: 'dɔ→', ko: 'ko→', u: 'ʔu↗', tin: 'tiɴ→', shwe: 'ʃwe→',
    aung: 'ʔaʊɴ→', kyaw: 'ʧɔ→', zaw: 'zɔ→', hla: 'ʰla→', htet: 'tʰɛʔ',
    naing: 'naɪɴ→', thu: 'θu→', moe: 'mo↗', myat: 'mjaʔ', min: 'miɴ→',
    nyunt: 'ɲʊɴ↓', khin: 'kʰiɴ→', mya: 'mja↗', hnin: 'ʰniɴ→', su: 'su→',
    phyo: 'pʰjo↗', htun: 'tʰʊɴ→', tun: 'tʊɴ→', oo: 'ʔu↗', zin: 'ziɴ→',
    thet: 'θɛʔ', nay: 'ne→', lin: 'liɴ→', kaung: 'kaʊɴ→', shein: 'ʃeɪɴ→',
    hein: 'heɪɴ→', myo: 'mjo↗', thant: 'θaɴ↓', san: 'saɴ↗', win: 'wɪɴ→',
    may: 'me→', soe: 'so↗', ye: 'jɛ↗', wai: 'we→', thida: 'θi→ də ɡa→'
  };
  const AMBIG = new Set(['win', 'may', 'san', 'u', 'so', 'soe', 'ye', 'tin', 'ma']);

  function prepareNames(text) {
    const re = /\b[A-Z][a-z]+\b|\bU\b/g;
    const words = [];
    let m;
    while ((m = re.exec(text)) !== null) {
      words.push({ text: m[0], start: m.index, end: m.index + m[0].length });
    }
    const keep = new Set();
    for (let i = 0; i < words.length; i++) {
      const w = words[i].text.toLowerCase();
      if (!(w in NAME_MAP)) continue;
      if (AMBIG.has(w)) {
        const prevOk = i > 0 && (words[i - 1].text.toLowerCase() in NAME_MAP) && text.slice(words[i - 1].end, words[i].start).trim() === '';
        const nextOk = i + 1 < words.length && (words[i + 1].text.toLowerCase() in NAME_MAP) && text.slice(words[i].end, words[i + 1].start).trim() === '';
        if (!prevOk && !nextOk) continue;
      }
      keep.add(i);
    }
    const out = [];
    let last = 0;
    for (let i = 0; i < words.length; i++) {
      if (keep.has(i)) {
        out.push(text.slice(last, words[i].start));
        out.push(NAME_MAP[words[i].text.toLowerCase()]);
        last = words[i].end;
      }
    }
    out.push(text.slice(last));
    return out.join('');
  }

  // ==================== 3. LIGHTWEIGHT ENGLISH PHONEMIZER FALLBACK ====================
  // Handles common English words/terms inside bilingual Burmese articles smoothly in-browser
  const EN_DICT = {
    the: 'ðə', and: 'ænd', of: 'ʌv', to: 'tu', in: 'ɪn', a: 'ə', is: 'ɪz',
    for: 'fɔɹ', that: 'ðæt', on: 'ɑn', with: 'wɪð', as: 'æz', by: 'baɪ',
    not: 'nɑt', be: 'bi', are: 'ɑɹ', this: 'ðɪs', from: 'fɹʌm', or: 'ɔɹ',
    we: 'wi', you: 'ju', it: 'ɪt', they: 'ðeɪ', she: 'ʃi', he: 'hi', her: 'hɜɹ',
    myanmar: 'mjɑnmɑɹ', burma: 'bɜɹmə', burmese: 'bɜɹmiz',
    democracy: 'dɪmɑkɹəsi', federal: 'fɛdəɹəl', freedom: 'fɹidəm', fear: 'fɪɹ',
    human: 'hjumən', rights: 'ɹaɪts', women: 'wɪmɪn', woman: 'wʊmən',
    gender: 'ʤɛndəɹ', feminist: 'fɛmɪnɪst', feminism: 'fɛmɪnɪzəm',
    transgender: 'tɹænzʤɛndəɹ', trans: 'tɹænz', transwoman: 'tɹænz wʊmən',
    transgirl: 'tɹænz gɜɹl', cisgender: 'sɪsʤɛndəɹ', lgbtq: 'ɛl ʤi bi ti kju',
    stem: 'stɛm', ai: 'eɪ aɪ', pdf: 'pi di ɛf', ged: 'ʤi i di',
    commufemocratism: 'kɑmju fɛmɑkɹətɪzəm', ideahub: 'aɪdiə hʌb',
    social: 'soʊʃəl', political: 'pəlɪtɪkəl', science: 'saɪəns',
    philosophy: 'fɪlɑsəfi', legitimacy: 'ləʤɪtɪməsi', sociology: 'soʊsiɑləʤi',
    stereotype: 'stɛɹioʊtaɪp', femininity: 'fɛmɪnɪnəti', weakness: 'wiknəs',
    horror: 'hɔɹəɹ', movie: 'muvi', action: 'ækʃən', thriller: 'θɹɪləɹ',
    crime: 'kɹaɪm', makeup: 'meɪkʌp', dress: 'dɹɛs', popcorn: 'pɑpkɔɹn',
    game: 'geɪm', romantic: 'ɹoʊmæntɪk', personality: 'pɜɹsənæləti',
    serious: 'sɪɹiəs', dynamic: 'daɪnæmɪk', biological: 'baɪəlɑʤɪkəl',
    sex: 'sɛks', identity: 'aɪdɛntəti', supreme: 'səpɹim', court: 'kɔɹt',
    equality: 'ɪkwɑləti', act: 'ækt', uk: 'ju keɪ', us: 'ju ɛs',
    china: 'ʧaɪnə', america: 'əmɛɹɪkə', asean: 'ɑsiɑn',
    hello: 'həloʊ', world: 'wɜɹld', peace: 'pis', justice: 'ʤʌstɪs',
    power: 'paʊəɹ', truth: 'tɹuθ', dream: 'dɹim', education: 'ɛʤəkeɪʃən',
    revolution: 'ɹɛvəluʃən', history: 'hɪstəɹi', future: 'fjuʧəɹ',
    club: 'klʌb', friday: 'fɹaɪdeɪ', show: 'ʃoʊ', yoshi: 'joʊʃi',
    rowling: 'ɹoʊlɪŋ', harry: 'hæɹi', potter: 'pɑtəɹ',
    nara: 'nɑɹə', mini: 'mɪni', audio: 'ɔdioʊ'
  };

  function approxEnglishWord(word) {
    const clean = word.toLowerCase().replace(/[^a-z']/g, '');
    if (!clean) return '';
    if (EN_DICT[clean]) return EN_DICT[clean];
    // Simple grapheme-to-IPA heuristic for unknown English tokens in mixed text
    let s = clean
      .replace(/tion\b/g, 'ʃən')
      .replace(/sion\b/g, 'ʒən')
      .replace(/ough/g, 'oʊ')
      .replace(/ight/g, 'aɪt')
      .replace(/ph/g, 'f')
      .replace(/sh/g, 'ʃ')
      .replace(/ch/g, 'ʧ')
      .replace(/th/g, 'θ')
      .replace(/ng/g, 'ŋ')
      .replace(/ck/g, 'k')
      .replace(/qu/g, 'kw')
      .replace(/ee/g, 'i')
      .replace(/oo/g, 'u')
      .replace(/ea/g, 'i')
      .replace(/ai|ay/g, 'eɪ')
      .replace(/oi|oy/g, 'ɔɪ')
      .replace(/ou|ow/g, 'aʊ')
      .replace(/c(?=[eiy])/g, 's')
      .replace(/c/g, 'k')
      .replace(/x/g, 'ks')
      .replace(/y\b/g, 'i')
      .replace(/j/g, 'ʤ')
      .replace(/r/g, 'ɹ')
      .replace(/([a-z])e\b/g, '$1');
    return s;
  }

  function englishToTokens(text) {
    if (!/[A-Za-z]/.test(text)) return text;
    // Skip strings that already look like IPA tokens from prepareNames
    return text.replace(/[A-Za-z][A-Za-z'\-]*/g, (m, offset, full) => {
      const prev = full[offset - 1] || '';
      const next = full[offset + m.length] || '';
      if (/[ʰ→↗↓ʔɔɛəŋɲʃθðʧʤɴɪʊ]/.test(prev) || /[ʰ→↗↓ʔɔɛəŋɲʃθðʧʤɴɪʊ]/.test(next)) return m;
      return approxEnglishWord(m);
    });
  }

  // ==================== 4. BURMESE G2P ENGINE (g2p_my.py + char_map.py) ====================
  const INDEP_TO_A = [
    ['ဣ', 'အိ'], ['ဤ', 'အီ'], ['ဥ', 'အု'], ['ဦ', 'အူ'],
    ['ဧ', 'အေ'], ['ဩ', 'အော'], ['ဪ', 'အော်']
  ];

  function normalize(text) {
    text = text.replace(/[\u200b\ufeff]/g, '');
    text = text.replace(/့်/g, '့်');
    text = text.replace(/သြော်/g, 'ဪ').replace(/သြ/g, 'ဩ');
    for (const [a, b] of INDEP_TO_A) text = text.split(a).join(b);
    text = text.replace(/င်္/g, 'င်');
    text = text.replace(/([\u1000-\u1021])\u1039/g, '$1်');
    text = text.replace(/ဿ/g, 'သ်သ').replace(/၎င်း/g, 'လည်းကောင်း');
    text = text.replace(/၌/g, 'နှိုက်').replace(/၍/g, 'ရွေ့').replace(/၏/g, 'အိ');
    return text;
  }

  const IS_CONS_INDEP = /^[က-အဣ-ဧဩဪ]$/;
  const COMBINING = new Set('ါာိီုူေဲံ့း်ျြွှ\ue001'.split(''));
  const ASAT = '်';

  function splitSyllables(text) {
    const out = [];
    let cur = '';
    let i = 0;
    const n = text.length;
    while (i < n) {
      const ch = text[i];
      if (IS_CONS_INDEP.test(ch)) {
        const isFinal = (i + 1 < n) && (text[i + 1] === ASAT);
        if (cur && !isFinal) {
          out.push(cur);
          cur = ch;
        } else {
          cur += ch;
        }
        i++;
      } else if (COMBINING.has(ch)) {
        cur += ch;
        i++;
      } else {
        if (cur) {
          out.push(cur);
          cur = '';
        }
        const slice = text.slice(i);
        const lm = slice.match(/^[A-Za-zæðθŋʒɐ-ʯᵻˈˌː→↗↓ʔɔɛəŋɲʃʧʤɴɪʊ][A-Za-zæðθŋʒɐ-ʯᵻˈˌː→↗↓ʔɔɛəŋɲʃʧʤɴɪʊ']*/);
        if (lm) {
          out.push(lm[0]);
          i += lm[0].length;
          continue;
        }
        out.push(ch);
        i++;
      }
    }
    if (cur) out.push(cur);
    return out;
  }

  const ONSET = {
    'က': 'k', 'ခ': 'kʰ', 'ဂ': 'g', 'ဃ': 'g', 'င': 'ŋ',
    'စ': 's', 'ဆ': 'sʰ', 'ဇ': 'z', 'ဈ': 'z', 'ည': 'ɲ', 'ဉ': 'ɲ',
    'ဋ': 't', 'ဌ': 'tʰ', 'ဍ': 'd', 'ဎ': 'd', 'ဏ': 'n',
    'တ': 't', 'ထ': 'tʰ', 'ဒ': 'd', 'ဓ': 'd', 'န': 'n',
    'ပ': 'p', 'ဖ': 'pʰ', 'ဗ': 'b', 'ဘ': 'b', 'မ': 'm',
    'ယ': 'j', 'ရ': 'j', 'လ': 'l', 'ဝ': 'w', 'သ': 'θ', 'ဟ': 'h', 'ဠ': 'l', 'အ': 'ʔ'
  };
  const VELAR_PAL = { k: 'tɕ', 'kʰ': 'tɕʰ', g: 'dʑ' };
  const ASPIRATE = { m: 'm̥', n: 'n̥', ɲ: 'ɲ̥', ŋ: 'ŋ̊', l: 'l̥', j: 'ʃ', w: 'w̥' };
  const INDEP_SYL = {
    'ဣ': ['ʔ', 'i', 'ˀ'], 'ဤ': ['ʔ', 'i', '˧'], 'ဥ': ['ʔ', 'u', 'ˀ'],
    'ဦ': ['ʔ', 'u', '˧'], 'ဧ': ['ʔ', 'e', '˧'], 'ဩ': ['ʔ', 'ɔ', '˥'], 'ဪ': ['ʔ', 'ɔ', '˧']
  };
  const V_MAP = {
    '': ['a', 'ˀ'], 'ာ': ['a', '˧'], 'ိ': ['i', 'ˀ'], 'ီ': ['i', '˧'],
    'ု': ['u', 'ˀ'], 'ူ': ['u', '˧'], 'ေ': ['e', '˧'], 'ဲ': ['ɛ', '˥'],
    'ော': ['ɔ', '˥'], 'ို': ['o', '˧']
  };
  const RHYME_CLOSED = {
    '|F_K': 'ɛʔ', '|F_S': 'ɪʔ', '|F_T': 'aʔ',
    'ိ|F_T': 'eɪʔ', 'ု|F_T': 'oʊʔ', 'ွ|F_T': 'ʊʔ',
    'ို|F_K': 'aɪʔ', 'ော|F_K': 'aʊʔ', 'ွ|F_S': 'ɪʔ',
    'ိ|F_S': 'ɪʔ', 'ု|F_S': 'ʊʔ', '|F_NG': 'ɪɴ',
    '|F_NY': 'ɪɴ', '|F_N': 'aɴ', 'ာ|F_T': 'aʔ',
    'ာ|F_N': 'aɴ', 'ေ|F_T': 'ɪʔ', 'ု|F_K': 'oʊʔ',
    'ာ|F_NY': 'ɪɴ', 'ိ|F_K': 'eɪʔ', 'ိ|F_NG': 'eɪɴ',
    'ို|F_N': 'aɪɴ', 'ိ|F_N': 'eɪɴ', 'ု|F_N': 'oʊɴ',
    'ွ|F_N': 'ʊɴ', 'ို|F_NG': 'aɪɴ', 'ော|F_NG': 'aʊɴ'
  };

  function finalClass(c) {
    if ('ကဂ'.includes(c)) return 'F_K';
    if ('စဇ'.includes(c)) return 'F_S';
    if ('တဒပဗဋဍသ'.includes(c)) return 'F_T';
    if ('နမဏ'.includes(c)) return 'F_N';
    if (c === 'င') return 'F_NG';
    if (c === 'ဉ') return 'F_NY';
    return null;
  }

  const PUNCT = { '၊': ',', '။': '.', ',': ',', '.': '.', '?': '?', '!': '!', ' ': ' ' };
  const SYL_RE = /^([က-အ])([ျြွှ]*)([ါာိီုူေဲ]*)(?:([က-အ])်)?(ံ?)(့?)(း?)(့?)$/;
  const VOWEL_ORDER = 'ေိီုူာဲ';

  function parseSyllable(s) {
    if (INDEP_SYL[s]) return INDEP_SYL[s].join('-');
    const m = s.match(SYL_RE);
    if (!m) return null;
    const [, base, meds, rawVows, fin, anusvara, dot1, visarga, dot2] = m;
    const dot = dot1 || dot2;
    let onset = ONSET[base];
    let medial = '';
    if (meds.includes('ှ')) onset = ASPIRATE[onset] || onset;
    if (meds.includes('ျ') || meds.includes('ြ')) {
      if (VELAR_PAL[onset]) onset = VELAR_PAL[onset];
      else if (onset === 'ŋ') onset = 'ɲ';
      else if (onset !== 'ʃ' && onset !== 'j') medial = 'j';
    }
    let hasW = meds.includes('ွ');
    const vows = rawVows.replace(/ါ/g, 'ာ');
    const vkey = Array.from(vows).sort((a, b) => VOWEL_ORDER.indexOf(a) - VOWEL_ORDER.indexOf(b)).join('');

    let rhyme, tone;
    if (fin || anusvara) {
      const fc = anusvara ? 'F_N' : finalClass(fin);
      if (fin && fin === 'ယ') {
        [rhyme, tone] = (vkey === 'ို') ? ['o', '˧'] : ['ɛ', '˧'];
      } else if (fin && 'လဟ'.includes(fin)) {
        const vv = V_MAP[vkey];
        if (!vv) return null;
        rhyme = vv[0];
        tone = '˧';
      } else if (fin && fin === 'ည') {
        [rhyme, tone] = (vkey === 'ေ') ? ['ɛ', '˧'] : ['e', '˧'];
      } else if (fc) {
        const wkey = (hasW && (`ွ|${fc}` in RHYME_CLOSED) && !vkey) ? 'ွ' : vkey;
        if (wkey === 'ွ') hasW = false;
        rhyme = RHYME_CLOSED[`${wkey}|${fc}`];
        if (!rhyme) return null;
        if (base === 'ဝ' && !vkey) {
          if (rhyme === 'aʔ') rhyme = 'ʊʔ';
          else if (rhyme === 'aɴ') rhyme = 'ʊɴ';
        }
        tone = rhyme.endsWith('ʔ') ? null : '˧';
      } else {
        return null;
      }
    } else {
      const vv = V_MAP[vkey];
      if (!vv) return null;
      [rhyme, tone] = vv;
    }

    if (tone !== null) {
      if (visarga) tone = '˥';
      else if (dot) tone = 'ˀ';
    }

    const parts = [onset];
    if (hasW) medial = medial ? medial + 'w' : 'w';
    if (medial) parts.push(medial);
    parts.push(rhyme);
    if (tone) parts.push(tone);
    return parts.join('-');
  }

  const VOICE_MAP = {
    k: 'g', 'kʰ': 'g', s: 'z', 'sʰ': 'z', t: 'd', 'tʰ': 'd',
    p: 'b', 'pʰ': 'b', tɕ: 'dʑ', 'tɕʰ': 'dʑ', θ: 'ð'
  };
  const CLASSIFIERS = new Set([
    'ယောက်', 'ခု', 'ခါ', 'နေ့', 'ချက်', 'ချောင်း', 'လုံး', 'ဖက်', 'ကောင်', 'ရက်',
    'မျိုး', 'ပတ်', 'ခေါက်', 'စု', 'ပါး', 'စီး', 'ဆူ', 'ရွက်', 'စောင်', 'လက်',
    'ပင်', 'အုပ်', 'ထည်', 'ခွန်း', 'လှမ်း', 'ဝိုင်း', 'သျှူး', 'ချောင်', 'နာရီ',
    'မိနစ်', 'လ', 'နှစ်', 'ကြိမ်', 'ဦး', 'ပုဒ်', 'ခန်း', 'တန်း'
  ]);

  function titReduces(chunk, i) {
    const nxt = chunk[i + 1];
    if (CLASSIFIERS.has(nxt)) return true;
    if (i > 0) {
      const b0 = chunk[i - 1], b1 = chunk[i];
      if (chunk[i + 1] === b0 && chunk[i + 2] === b1) return false;
      if (i >= 3 && chunk[i - 3] === b0 && chunk[i - 2] === b1) return false;
      if (b0 === nxt) return false;
    }
    return true;
  }

  function applyMined(chunk, parses, minedV, minedS) {
    const out = parses.slice();
    for (let i = 0; i < chunk.length; i++) {
      const syl = chunk[i];
      const p = out[i];
      if (p === null) continue;
      const parts = p.split('-');
      if (syl === 'တစ်' && i + 1 < chunk.length && titReduces(chunk, i)) {
        out[i] = 't-ə';
        continue;
      }
      if (i > 0 && minedV.has(`${chunk[i - 1]}\t${syl}`) && VOICE_MAP[parts[0]]) {
        parts[0] = VOICE_MAP[parts[0]];
        out[i] = parts.join('-');
      }
      if (i + 1 < chunk.length && minedS.has(`${chunk[i + 1]}\t${syl}`)) {
        out[i] = parts[0] + '-ə';
      }
    }
    return out;
  }

  const CHAR = {
    k: 'k', g: 'ɡ', ŋ: 'ŋ', s: 's', z: 'z', ɲ: 'ɲ', t: 't', d: 'd', n: 'n',
    p: 'p', b: 'b', m: 'm', j: 'j', r: 'r', l: 'l', w: 'w', θ: 'θ', ð: 'ð',
    h: 'h', 'ʔ': 'ʔ', ʃ: 'ʃ', f: 'f', 'kʰ': 'kʰ', 'sʰ': 'sʰ', 'tʰ': 'tʰ', 'pʰ': 'pʰ',
    tɕ: 'ʧ', 'tɕʰ': 'ʧʰ', dʑ: 'ʤ', 'm̥': 'ʰm', 'n̥': 'ʰn', 'ɲ̥': 'ʰɲ', 'ŋ̊': 'ʰŋ',
    'l̥': 'ʰl', 'w̥': 'w', a: 'a', i: 'i', u: 'u', e: 'e', ɛ: 'ɛ', ɔ: 'ɔ', o: 'o',
    ə: 'ə', ɴ: 'ɴ', 'ʔfin': 'ʔ', eɪ: 'A', oʊ: 'O', aɪ: 'I', aʊ: 'W',
    '˧': '→', '˥': '↗', 'ˀ': '↓'
  };
  const RHYME_SPLIT = {
    'ɪɴ': ['i', 'ɴ'], 'aɴ': ['a', 'ɴ'], 'eɪɴ': ['A', 'ɴ'], 'oʊɴ': ['O', 'ɴ'],
    'ʊɴ': ['u', 'ɴ'], 'aɪɴ': ['I', 'ɴ'], 'aʊɴ': ['W', 'ɴ'],
    'ɪʔ': ['i', 'ʔ'], 'ʊʔ': ['u', 'ʔ'], 'aʔ': ['a', 'ʔ'], 'ɛʔ': ['ɛ', 'ʔ'],
    'eɪʔ': ['A', 'ʔ'], 'oʊʔ': ['O', 'ʔ'], 'aɪʔ': ['I', 'ʔ'], 'aʊʔ': ['W', 'ʔ'],
    a: ['a'], i: ['i'], u: ['u'], e: ['e'], ɛ: ['ɛ'], ɔ: ['ɔ'], o: ['o'], ə: ['ə']
  };

  function sylToChars(syl) {
    const parts = syl.split('-');
    const last = parts[parts.length - 1];
    const tone = (last === '˧' || last === '˥' || last === 'ˀ') ? last : null;
    const core = tone ? parts.slice(0, -1) : parts;
    if (core.length < 2) return '';
    const onset = core[0];
    const meds = core.slice(1, -1);
    const rhyme = core[core.length - 1];
    if (!(onset in CHAR) || !(rhyme in RHYME_SPLIT)) return '';
    const out = [CHAR[onset]];
    for (const m of meds) {
      if (!(m in CHAR)) return '';
      out.push(CHAR[m]);
    }
    for (const c of RHYME_SPLIT[rhyme]) {
      out.push(CHAR[c] || c);
    }
    if (tone) out.push(CHAR[tone]);
    return out.join('');
  }

  const MIDSYL = new Set('ါာိီုူေဲံ့း်ျြွှ'.split(''));
  const EN_IPA_RE = /[A-Za-zæðθŋʒɐ-ʯᵻˈˌː]/;

  function g2p(text, lexData) {
    const lex = (lexData && lexData.lexicon) || {};
    const minedV = (lexData && lexData.voicingSet) || new Set();
    const minedS = (lexData && lexData.schwaSet) || new Set();
    const keys = (lexData && lexData.sortedKeys) || Object.keys(lex).sort((a, b) => b.length - a.length);

    text = normalize(text).replace(/ော်/g, '\ue001').replace(/ေါ်/g, '\ue001');
    const chunks = [];
    let i = 0;
    const n = text.length;
    while (i < n) {
      let hit = null;
      for (let ki = 0; ki < keys.length; ki++) {
        const k = keys[ki];
        if (text.startsWith(k, i)) {
          const j = i + k.length;
          if (j < n && MIDSYL.has(text[j])) continue;
          hit = k;
          break;
        }
      }
      if (hit) {
        chunks.push(['PHON', lex[hit]]);
        i += hit.length;
      } else {
        chunks.push(['RAW', text[i]]);
        i++;
      }
    }

    const out = [];
    function flush(buf) {
      const syls = splitSyllables(buf);
      let runsyl = [];
      function closeRun() {
        if (!runsyl.length) return;
        const parses = runsyl.map(s => {
          if (s === '\ue001') return 'ʔ-ɔ-˧';
          if (s.includes('\ue001')) {
            const p = parseSyllable(s.replace(/\ue001/g, 'ော'));
            return p ? p.replace(/ɔ-˥$/, 'ɔ-˧') : null;
          }
          return parseSyllable(s);
        });
        for (const p of applyMined(runsyl, parses, minedV, minedS)) {
          if (p !== null) out.push(p);
        }
        runsyl = [];
      }
      for (const syl of syls) {
        if (/^[က-အဣ-ဧဩဪ]/.test(syl) || syl.includes('\ue001')) {
          runsyl.push(syl);
        } else {
          closeRun();
          if (syl in PUNCT) out.push(PUNCT[syl]);
          else if (syl.trim()) out.push(syl);
          else out.push(' ');
        }
      }
      closeRun();
    }

    let buf = '';
    for (const [kind, val] of chunks) {
      if (kind === 'RAW') {
        buf += val;
      } else {
        if (buf) { flush(buf); buf = ''; }
        out.push(val);
      }
    }
    if (buf) flush(buf);

    const isEn = tok => !tok.includes('-') && EN_IPA_RE.test(tok);
    const merged = [];
    for (let idx = 0; idx < out.length; idx++) {
      const tok = out[idx];
      if (tok === ' ') {
        let nxt = null;
        for (let k = idx + 1; k < out.length; k++) {
          if (out[k] !== ' ') { nxt = out[k]; break; }
        }
        const prev = merged[merged.length - 1];
        if (merged.length && !',.?!'.includes(prev) && !isEn(prev) && (nxt === null || !isEn(nxt))) {
          merged.push(',');
        }
      } else if ('.?!,'.includes(tok)) {
        const prev = merged[merged.length - 1];
        if (merged.length && prev === ',') {
          merged[merged.length - 1] = tok;
        } else if (merged.length && '.?!'.includes(prev)) {
          if (tok !== prev) merged.push(tok);
        } else {
          merged.push(tok);
        }
      } else {
        merged.push(tok);
      }
    }
    while (merged.length && merged[merged.length - 1] === ',') merged.pop();
    while (merged.length && ',.?!'.includes(merged[0])) merged.shift();
    return merged.join(' ');
  }

  function phonemize(text, lexData, normalizeNumbers = true) {
    let s = normalizeNumbers ? verbalize(text) : text;
    s = englishToTokens(prepareNames(s));
    const phon = g2p(s, lexData);
    const out = [];
    for (const tok of phon.split(/\s+/)) {
      if (!tok) continue;
      if (tok === ',' || tok === '.' || tok === '?' || tok === '!') {
        out.push(tok);
      } else if (tok.includes('-') || (tok in RHYME_SPLIT)) {
        const mapped = tok.includes('-') ? sylToChars(tok) : tok;
        if (mapped) out.push(mapped);
      } else if (EN_IPA_RE.test(tok)) {
        out.push(tok);
      }
    }
    return out.join(' ');
  }

  // ==================== 5. PROGRESSIVE PROSODIC SPEECH CHUNKER (Smart Phrasing & Natural Pauses) ====================
  const MULTI_CONNECTORS = [
    'ဖြစ်သောကြောင့်', 'ဖြစ်သော်လည်း', 'သို့သော်လည်း', 'သို့သော်', 'သို့မဟုတ်',
    'ထို့အပြင်', 'ထို့ကြောင့်', 'တစ်ပြိုင်နက်တည်းတွင်', 'အမှန်စင်စစ်', 'အထူးသဖြင့်',
    'ထို့နောက်', 'ဖြစ်စေရန်', 'ဖြစ်သည်မှာ', 'ပါသည်ဟု', 'ပါသော်လည်း', 'သောအခါ',
    'ပြီးနောက်', 'ကြောင့်', 'အတွက်', 'အဖြစ်', 'အကြောင်း', 'အပေါ်', 'သဖြင့်'
  ];

  function findClauseCut(text, limit = 135, minLen = 40) {
    if (text.length <= limit) return text.length;
    const sub = text.slice(0, limit);
    let best = -1;
    for (const conn of MULTI_CONNECTORS) {
      const p = sub.lastIndexOf(conn);
      if (p >= minLen) {
        const endP = p + conn.length;
        if (endP <= limit && endP > best) best = endP;
      }
    }
    if (best > 0) return best;
    const sp = sub.lastIndexOf(' ');
    if (sp >= minLen) return sp + 1;
    return limit;
  }

  function splitSpeech(text, limit = 135, firstLimit = 85) {
    const pieces = [];
    const rawParagraphs = text.replace(/\r\n|\r/g, '\n').split(/\n{2,}/);

    for (const para of rawParagraphs) {
      const p = para.trim();
      if (!p) continue;
      const sentences = p.split(/(?<=[။!?…])\s+|\n+/);
      for (const sent of sentences) {
        const s = sent.trim();
        if (!s) continue;
        const cap = pieces.length === 0 ? firstLimit : limit;

        if (s.length <= cap) {
          pieces.push(s);
        } else {
          const clauses = s.split(/(?<=[၊,;])\s*/);
          for (let clause of clauses) {
            clause = clause.trim();
            if (!clause) continue;
            while (clause.length > limit) {
              const cut = findClauseCut(clause, limit, 35);
              const head = clause.slice(0, cut).trim();
              clause = clause.slice(cut).trim();
              if (head) pieces.push(head);
            }
            if (clause) pieces.push(clause);
          }
        }
      }
    }
    return pieces;
  }

  function prepareLexicon(rawJson) {
    const lexicon = (rawJson && rawJson.lexicon) || {};
    return {
      lexicon,
      sortedKeys: Object.keys(lexicon).sort((a, b) => b.length - a.length),
      voicingSet: new Set((rawJson && rawJson.voicing) || []),
      schwaSet: new Set((rawJson && rawJson.schwa) || [])
    };
  }

  global.NaraG2P = {
    verbalize,
    prepareNames,
    phonemize,
    splitSpeech,
    prepareLexicon
  };
})(typeof window !== 'undefined' ? window : globalThis);
