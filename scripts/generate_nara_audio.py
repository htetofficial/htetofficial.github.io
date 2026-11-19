#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Method 1 Pre-Generated Instant Audio Generator for Htet Official Archive (Nara Mini v1)

Enhanced Prosodic Phrasing & Natural Cadence Edition:
  - Smart prosodic phrasing & clause segmentation (သဘာဝကျသော အဖြတ်အတောက် စနစ်)
  - Natural human breathing pauses:
      * Paragraphs & Headings: ~550ms - 600ms
      * Full sentences (။, !, ?): ~360ms - 400ms
      * Sub-clauses & commas (၊, ,): ~180ms - 220ms
      * Continuation & breath pauses: ~90ms - 120ms
  - Calibrated normal English speech rate (အင်္ဂလိပ် အသံထွက် ပုံမှန်အမြန်နှုန်း)
  - Whole-word English IPA tokenization (eliminating artificial space explosion)
  - Comprehensive Burmese & English academic / mental health phonetic lexicon
  - Click-free cosine fade transitions & 48 kbps mono MP3 encoding via ffmpeg
  - Updates BOTH data/audio-manifest.json and js/data/audio-manifest-backup.js

Attribution: Nara Mini v1 (Apache-2.0 — https://naraaudio.app / YeeNyunn)
"""
import argparse
import html
import json
import math
import re
import shutil
import subprocess
import sys
import time
import wave
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional, Tuple

ROOT = Path(__file__).resolve().parent.parent
ARTICLES_JSON = ROOT / 'data' / 'articles.json'
MANIFEST_JSON = ROOT / 'data' / 'audio-manifest.json'
MANIFEST_JS = ROOT / 'js' / 'data' / 'audio-manifest-backup.js'
AUDIO_DIR = ROOT / 'assets' / 'audio'
SAMPLE_RATE = 24000

_LATIN_RE = re.compile(r'[A-Za-z]')
_LATIN_RUN_RE = re.compile(r"[A-Za-z][A-Za-z'\-. ]*[A-Za-z]|[A-Za-z]")

# Comprehensive academic, psychological, philosophical & modern English IPA dictionary
EN_IPA_DICT = {
    # Core Function Words
    'the': 'ðə', 'and': 'ænd', 'of': 'ʌv', 'to': 'tuː', 'in': 'ɪn', 'is': 'ɪz', 'it': 'ɪt',
    'for': 'fɔːɹ', 'that': 'ðæt', 'with': 'wɪð', 'as': 'æz', 'on': 'ɑn', 'are': 'ɑːɹ', 'be': 'biː',
    'by': 'baɪ', 'this': 'ðɪs', 'from': 'fɹʌm', 'or': 'ɔːɹ', 'not': 'nɑt', 'but': 'bʌt',
    'we': 'wiː', 'they': 'ðeɪ', 'you': 'juː', 'she': 'ʃiː', 'he': 'hiː', 'her': 'hɜːɹ', 'his': 'hɪz',
    'an': 'æn', 'at': 'æt', 'if': 'ɪf', 'so': 'soʊ', 'no': 'noʊ', 'all': 'ɔːl', 'my': 'maɪ',

    # Psychology, Mental Health & Emotional Regulation
    'positive': 'ˈpɑzətɪv', 'positivity': 'ˌpɑzəˈtɪvəti', 'thinking': 'ˈθɪŋkɪŋ',
    'toxic': 'ˈtɑksɪk', 'optimism': 'ˈɑptəmɪzəm', 'optimistic': 'ˌɑptəˈmɪstɪk',
    'pessimism': 'ˈpɛsəmɪzəm', 'pessimistic': 'ˌpɛsəˈmɪstɪk',
    'realism': 'ˈɹiːəlɪzəm', 'realistic': 'ˌɹiːəˈlɪstɪk', 'empirical': 'ɛmˈpɪɹɪkəl',
    'guilt': 'ɡɪlt', 'secondary': 'ˈsɛkəndɛɹi', 'suppression': 'səˈpɹɛʃən', 'suppress': 'səˈpɹɛs',
    'gaslighting': 'ˈɡæslaɪtɪŋ', 'gaslight': 'ˈɡæslaɪt', 'invalidation': 'ɪnˌvæləˈdeɪʃən',
    'acceptance': 'ækˈsɛptəns', 'commitment': 'kəˈmɪtmənt', 'therapy': 'ˈθɛɹəpi',
    'psychology': 'saɪˈkɑlədʒi', 'psychological': 'ˌsaɪkəˈlɑdʒɪkəl', 'mental': 'ˈmɛntəl',
    'health': 'hɛlθ', 'healthy': 'ˈhɛlθi', 'emotion': 'ɪˈmoʊʃən', 'emotional': 'ɪˈmoʊʃənəl',
    'emotions': 'ɪˈmoʊʃənz', 'regulation': 'ˌɹɛɡjəˈleɪʃən', 'authentic': 'ɔːˈθɛntɪk',
    'authenticity': 'ˌɔːθɛnˈtɪsəti', 'carl': 'kɑːɹl', 'rogers': 'ˈɹɑdʒəɹz',
    'unconditional': 'ˌʌnkənˈdɪʃənəl', 'regard': 'ɹɪˈɡɑːɹd', 'resilience': 'ɹɪˈzɪljəns',
    'vulnerability': 'ˌvʌlnəɹəˈbɪləti', 'mindfulness': 'ˈmaɪndfəlnəs', 'empathy': 'ˈɛmpəθi',
    'empathetic': 'ˌɛmpəˈθɛtɪk', 'compassion': 'kəmˈpæʃən', 'self': 'sɛlf', 'trauma': 'ˈtɹɔːmə',
    'stigma': 'ˈstɪɡmə', 'coping': 'ˈkoʊpɪŋ', 'mechanism': 'ˈmɛkənɪzəm', 'burnout': 'ˈbɜːɹnaʊt',
    'depression': 'dɪˈpɹɛʃən', 'anxiety': 'æŋˈzaɪəti', 'delusion': 'dɪˈluːʒən',
    'ground': 'ɡɹaʊnd', 'acknowledge': 'ækˈnɑlɪdʒ', 'listener': 'ˈlɪsənəɹ',

    # Sociology, Politics & Philosophy
    'institution': 'ˌɪnstɪˈtuːʃən', 'institutions': 'ˌɪnstɪˈtuːʃənz',
    'family': 'ˈfæməli', 'educational': 'ˌɛdʒʊˈkeɪʃənəl', 'religious': 'ɹɪˈlɪdʒəs',
    'economic': 'ˌɛkəˈnɑmɪk', 'economy': 'ɪˈkɑnəmi', 'government': 'ˈɡʌvəɹnmənt',
    'state': 'steɪt', 'legitimacy': 'ləˈdʒɪtɪməsi', 'sovereignty': 'ˈsɑvɹənti',
    'constitution': 'ˌkɑnstɪˈtuːʃən', 'constitutional': 'ˌkɑnstɪˈtuːʃənəl',
    'democracy': 'dɪˈmɑkɹəsi', 'democratic': 'ˌdɛməˈkɹætɪk',
    'federal': 'ˈfɛdəɹəl', 'federalism': 'ˈfɛdəɹəlɪzəm', 'autonomy': 'ɔːˈtɑnəmi',
    'politics': 'ˈpɑlətɪks', 'political': 'pəˈlɪtɪkəl', 'philosophy': 'fɪˈlɑsəfi',
    'philosophical': 'ˌfɪləˈsɑfɪkəl', 'sociology': 'ˌsoʊsiˈɑlədʒi', 'society': 'səˈsaɪəti',
    'culture': 'ˈkʌltʃəɹ', 'cultural': 'ˈkʌltʃəɹəl', 'history': 'ˈhɪstəɹi',
    'revolution': 'ˌɹɛvəˈluːʃən', 'spring': 'spɹɪŋ', 'resistance': 'ɹɪˈzɪstəns',
    'marxist': 'ˈmɑːɹksɪst', 'marxism': 'ˈmɑːɹksɪzəm', 'marx': 'mɑːɹks', 'karl': 'kɑːɹl',
    'bourgeoisie': 'ˌbʊəɹʒwɑːˈziː', 'proletariat': 'ˌpɹoʊləˈtɛɹiət',
    'capitalism': 'ˈkæpɪtəlɪzəm', 'capitalist': 'ˈkæpɪtəlɪst',
    'socialism': 'ˈsoʊʃəlɪzəm', 'socialist': 'ˈsoʊʃəlɪst',
    'hegemony': 'hɪˈdʒɛməni', 'alienation': 'ˌeɪliəˈneɪʃən', 'socialization': 'ˌsoʊʃələˈzeɪʃən',
    'critique': 'kɹɪˈtiːk', 'ideology': 'ˌaɪdiˈɑlədʒi', 'ideological': 'ˌaɪdiəˈlɑdʒɪkəl',
    'authoritarian': 'ɔːˌθɔːɹəˈtɛɹiən', 'authoritarianism': 'ɔːˌθɔːɹəˈtɛɹiənɪzəm',
    'totalitarian': 'toʊˌtæləˈtɛɹiən', 'dictator': 'ˈdɪkteɪtəɹ', 'dictatorship': 'dɪkˈteɪtəɹʃɪp',
    'junta': 'ˈhʊntə', 'sham': 'ʃæm', 'election': 'ɪˈlɛkʃən', 'elections': 'ɪˈlɛkʃənz',

    # Gender & Human Rights
    'feminism': 'ˈfɛmɪnɪzəm', 'feminist': 'ˈfɛmɪnɪst', 'femininity': 'ˌfɛmɪˈnɪnəti',
    'masculinity': 'ˌmæskjʊˈlɪnəti', 'gender': 'ˈdʒɛndəɹ', 'transgender': 'tɹænzˈdʒɛndəɹ',
    'trans': 'tɹænz', 'woman': 'ˈwʊmən', 'women': 'ˈwɪmɪn', 'womanhood': 'ˈwʊmənhʊd',
    'man': 'mæn', 'men': 'mɛn', 'rights': 'ɹaɪts', 'human': 'ˈhjuːmən',
    'dignity': 'ˈdɪɡnəti', 'freedom': 'ˈfɹiːdəm', 'justice': 'ˈdʒʌstɪs',
    'peace': 'piːs', 'queer': 'kwɪəɹ', 'lgbt': 'ˌɛl dʒiː biː ˈtiː',
    'lgbtq': 'ˌɛl dʒiː biː tiː ˈkjuː', 'binary': 'ˈbaɪnəɹi', 'cisgender': 'sɪsˈdʒɛndəɹ',
    'consent': 'kənˈsɛnt', 'bodily': 'ˈbɑdəli', 'patriarchy': 'ˈpeɪtɹiɑːɹki',

    # STEM & Inventions
    'stem': 'stɛm', 'science': 'ˈsaɪəns', 'technology': 'tɛkˈnɑlədʒi',
    'engineering': 'ˌɛndʒəˈnɪɹɪŋ', 'mathematics': 'ˌmæθəˈmætɪks',
    'inventor': 'ɪnˈvɛntəɹ', 'inventors': 'ɪnˈvɛntəɹz', 'invention': 'ɪnˈvɛnʃən',
    'inventions': 'ɪnˈvɛnʃənz', 'algorithm': 'ˈælɡəˌɹɪðəm', 'computer': 'kəmˈpjuːtəɹ',
    'ada': 'ˈeɪdə', 'lovelace': 'ˈlʌvleɪs', 'curie': 'kjʊˈɹiː', 'marie': 'məˈɹiː',
    'hedy': 'ˈhɛdi', 'lamarr': 'ləˈmɑːɹ', 'katherine': 'ˈkæθɹɪn', 'johnson': 'ˈdʒɑnsən',
    'chien': 'tʃiˈɛn', 'shiung': 'ʃiˈʊŋ', 'wu': 'wuː',

    # Named Figures & Historical Names
    'htet': 'tɛt', 'myat': 'mjæt', 'ekri': 'ˈɛkɹi',
    'aung': 'aʊŋ', 'san': 'sɑn', 'suu': 'suː', 'kyi': 'tʃiː', 'daw': 'dɔː',
    'bogyoke': 'boʊdʒoʊk', 'pridi': 'ˈpɹiːdi', 'banomyong': 'bɑːnoʊmˈjɑŋ',
    'malala': 'məˈlɑːlə', 'yousafzai': 'ˈjuːsəfzaɪ',
    'rowling': 'ˈɹoʊlɪŋ', 'jk': 'ˌdʒeɪ ˈkeɪ', 'harry': 'ˈhæɹi', 'potter': 'ˈpɑtəɹ',
    'yoshi': 'ˈjoʊʃi', 'rinrada': 'ɹɪnˈɹɑːdə', 'club': 'klʌb', 'friday': 'ˈfɹaɪdeɪ',
    'mandela': 'mænˈdɛlə', 'gandhi': 'ˈɡɑːndi', 'king': 'kɪŋ', 'luther': 'ˈluːθəɹ',
    'simone': 'sɪˈmoʊn', 'beauvoir': 'boʊˈvwɑːɹ', 'judith': 'ˈdʒuːdɪθ', 'butler': 'ˈbʌtləɹ',
    'foucault': 'fuːˈkoʊ', 'arendt': 'ˈɑːɹənt', 'hannah': 'ˈhænə',
    'weber': 'ˈveɪbəɹ', 'kant': 'kɑnt', 'plato': 'ˈpleɪtoʊ', 'aristotle': 'ˈæɹɪstɑtəl',
    'nietzsche': 'ˈniːtʃə', 'camus': 'kæˈmuː', 'sartre': 'ˈsɑːɹtɹə', 'orwell': 'ˈɔːɹwɛl',

    # Dates, Months & Common Words
    'june': 'dʒuːn', 'january': 'ˈdʒænjuˌɛɹi', 'february': 'ˈfɛbjuˌɛɹi', 'march': 'mɑːɹtʃ',
    'april': 'ˈeɪpɹəl', 'may': 'meɪ', 'july': 'dʒuːˈlaɪ', 'august': 'ɔːˈɡʌst',
    'september': 'sɛpˈtɛmbəɹ', 'october': 'ɑkˈtoʊbəɹ', 'november': 'noʊˈvɛmbəɹ', 'december': 'dɪˈsɛmbəɹ',
    'eighteen': 'eɪˈtiːn', 'twenty': 'ˈtwɛnti', 'nineteen': 'ˌnaɪnˈtiːn',
    'first': 'fɜːɹst', 'second': 'ˈsɛkənd', 'third': 'θɜːɹd', 'fourth': 'fɔːɹθ', 'fifth': 'fɪfθ',
    'ai': 'ˌeɪ ˈaɪ', 'uk': 'ˌjuː ˈkeɪ', 'us': 'ˌjuː ˈɛs', 'un': 'ˌjuː ˈɛn', 'eu': 'ˌiː ˈjuː',
    'pdf': 'ˌpiː diː ˈɛf', 'ged': 'ˌdʒiː iː ˈdiː', 'mnou': 'ˌɛm ɛn oʊ ˈjuː', 'nara': 'ˈnɑɹə',
    'myanmar': 'ˈmjɑːnmɑːɹ', 'burma': 'ˈbɜːɹmə', 'burmese': 'bɜːɹˈmiːz',
    'thailand': 'ˈtaɪlænd', 'thai': 'taɪ', 'miss': 'mɪs', 'tiffany': 'ˈtɪfəni', 'universe': 'ˈjuːnɪvɜːɹs',
    'supreme': 'səˈpɹiːm', 'court': 'kɔːɹt', 'equality': 'ɪˈkwɑləti', 'act': 'ækt',
    'britain': 'ˈbɹɪtən', 'british': 'ˈbɹɪtɪʃ', 'london': 'ˈlʌndən', 'scotland': 'ˈskɑtlənd',
    'digital': 'ˈdɪdʒɪtəl', 'online': 'ˈɑnlaɪn', 'internet': 'ˈɪntəɹnɛt', 'media': 'ˈmiːdiə',
    'facebook': 'ˈfeɪsbʊk', 'telegram': 'ˈtɛlɪɡɹæm', 'youtube': 'ˈjuːtjuːb', 'google': 'ˈɡuːɡəl',
    'essay': 'ˈɛseɪ', 'article': 'ˈɑːɹtɪkəl', 'interview': 'ˈɪntəɹvjuː', 'story': 'ˈstɔːɹi',
    'book': 'bʊk', 'life': 'laɪf', 'voice': 'vɔɪs', 'dream': 'dɹiːm', 'hope': 'hoʊp', 'love': 'lʌv',
    'conclusion': 'kənˈkluːʒən', 'introduction': 'ˌɪntɹəˈdʌkʃən'
}

_LETTER_IPA = {
    'a': 'eɪ', 'b': 'biː', 'c': 'siː', 'd': 'diː', 'e': 'iː', 'f': 'ɛf', 'g': 'dʒiː',
    'h': 'eɪtʃ', 'i': 'aɪ', 'j': 'dʒeɪ', 'k': 'keɪ', 'l': 'ɛl', 'm': 'ɛm', 'n': 'ɛn',
    'o': 'oʊ', 'p': 'piː', 'q': 'kjuː', 'r': 'ɑːɹ', 's': 'ɛs', 't': 'tiː', 'u': 'juː',
    'v': 'viː', 'w': 'ˈdʌbəljuː', 'x': 'ɛks', 'y': 'waɪ', 'z': 'ziː',
}

# Burmese multi-syllable grammatical connectors for intelligent clause division
MULTI_CONNECTORS = [
    'ဖြစ်သောကြောင့်', 'ဖြစ်သော်လည်း', 'သို့သော်လည်း', 'သို့သော်', 'သို့မဟုတ်',
    'ထို့အပြင်', 'ထို့ကြောင့်', 'တစ်ပြိုင်နက်တည်းတွင်', 'အမှန်စင်စစ်', 'အထူးသဖြင့်',
    'ထို့နောက်', 'ဖြစ်စေရန်', 'ဖြစ်သည်မှာ', 'ပါသည်ဟု', 'ပါသော်လည်း', 'သောအခါ',
    'ပြီးနောက်', 'ကြောင့်', 'အတွက်', 'အဖြစ်', 'အကြောင်း', 'အပေါ်',
    'အခြေအနေတွင်', 'ကာလအတွင်း', 'သဖြင့်'
]

PARTICLES = ['တွင်', 'မှာ', 'သို့', 'ကို', 'ဖြင့်', 'နှင့်', 'က', 'မှ', '၍']
COMBINING_MARKS = set('ါာိီုူေဲံ့း်ျြွှ\ue001\u1039')


@dataclass
class SpeechPhrase:
    text: str
    pause_after_sec: float
    boundary: str  # 'heading', 'paragraph', 'sentence', 'clause', 'continuation'


def _heuristic_en_word_to_ipa(word: str) -> str:
    clean = re.sub(r"[^a-z]", "", word.lower())
    if not clean:
        return ''
    if clean in EN_IPA_DICT:
        return EN_IPA_DICT[clean]
    if word.isupper() and 2 <= len(clean) <= 5:
        return ' '.join(_LETTER_IPA.get(c, c) for c in clean)

    # Clean grapheme-to-IPA rules for unknown English words
    s = clean
    rules = [
        ('tion', 'ʃən'), ('sion', 'ʒən'), ('cious', 'ʃəs'), ('tious', 'ʃəs'),
        ('igh', 'aɪ'), ('tch', 'tʃ'), ('dge', 'dʒ'), ('ough', 'oʊ'),
        ('ch', 'tʃ'), ('sh', 'ʃ'), ('th', 'θ'), ('ph', 'f'), ('ng', 'ŋ'),
        ('ck', 'k'), ('qu', 'kw'), ('wh', 'w'), ('ee', 'iː'), ('ea', 'iː'),
        ('oo', 'uː'), ('ou', 'aʊ'), ('ow', 'oʊ'), ('ai', 'eɪ'), ('ay', 'eɪ'),
        ('oi', 'ɔɪ'), ('oy', 'ɔɪ'), ('au', 'ɔː'), ('aw', 'ɔː'), ('er', 'əɹ'),
        ('ar', 'ɑːɹ'), ('or', 'ɔːɹ'), ('ir', 'ɜːɹ'), ('ur', 'ɜːɹ'),
    ]
    out = []
    i = 0
    while i < len(s):
        matched = False
        for g, p in rules:
            if s.startswith(g, i):
                out.append(p)
                i += len(g)
                matched = True
                break
        if matched:
            continue
        ch = s[i]
        mapping = {
            'a': 'æ', 'b': 'b', 'c': 'k', 'd': 'd', 'e': 'ɛ', 'f': 'f', 'g': 'ɡ',
            'h': 'h', 'i': 'ɪ', 'j': 'dʒ', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n',
            'o': 'ɑ', 'p': 'p', 'q': 'k', 'r': 'ɹ', 's': 's', 't': 't', 'u': 'ʌ',
            'v': 'v', 'w': 'w', 'x': 'ks', 'y': 'i' if i == len(s) - 1 else 'j', 'z': 'z'
        }
        if ch == 'e' and i == len(s) - 1 and len(s) > 2:
            i += 1
            continue
        out.append(mapping.get(ch, ''))
        i += 1
    return ''.join(out)


def build_english_converter():
    """Converts English words into continuous whole-word IPA tokens."""
    def _fallback_conv(text: str) -> str:
        if not _LATIN_RE.search(text):
            return text
        out, last = [], 0
        for m in _LATIN_RUN_RE.finditer(text):
            out.append(text[last:m.start()])
            words = re.findall(r"[A-Za-z]+(?:'[A-Za-z]+)?", m.group(0))
            ipa_parts = [_heuristic_en_word_to_ipa(w) for w in words]
            out.append(' '.join(p for p in ipa_parts if p))
            last = m.end()
        out.append(text[last:])
        return re.sub('  +', ' ', ''.join(out)).strip()

    return _fallback_conv, 'builtin-ipa-lexicon'


def strip_html(raw_html: str) -> str:
    text = re.sub(
        r'<(script|style|svg|blockquote[^>]*class="[^"]*no-tts[^"]*")[^>]*>.*?</\1>',
        ' ', raw_html, flags=re.S | re.I
    )
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.I)
    text = re.sub(r'</(p|div|li|blockquote|tr)>', '\n\n', text, flags=re.I)
    text = re.sub(r'</(h[1-6])>', '။\n\n', text, flags=re.I)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = html.unescape(text)
    text = re.sub(r'https?://\S+', '', text)
    text = re.sub(r'\[[0-9:\-–]+\]', '', text)
    text = re.sub(r'[•—–]{2,}', ' ', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'။\s*။+', '။', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def find_best_clause_cut(text: str, limit: int = 135, min_len: int = 40) -> int:
    """Finds natural Burmese grammatical juncture to break extra-long clauses."""
    if len(text) <= limit:
        return len(text)
    sub = text[:limit]

    # Priority 1: Multi-syllable connectors
    best = -1
    for conn in MULTI_CONNECTORS:
        p = sub.rfind(conn)
        if p >= min_len:
            end_p = p + len(conn)
            if end_p <= limit and end_p > best:
                best = end_p
    if best > 0:
        return best

    # Priority 2: Standalone particles
    for part in PARTICLES:
        p = sub.rfind(part)
        if p >= min_len:
            end_p = p + len(part)
            if end_p <= limit and end_p > best:
                if end_p < len(sub) and sub[end_p] in COMBINING_MARKS:
                    continue
                best = end_p
    if best > 0:
        return best

    # Priority 3: Spaces
    sp = sub.rfind(' ')
    if sp >= min_len:
        return sp + 1

    # Priority 4: Safe syllable boundary
    for i in range(limit, min_len, -1):
        if sub[i] not in COMBINING_MARKS and (i + 1 >= len(sub) or sub[i + 1] not in ('်', '\u1039')):
            return i

    return limit


def split_speech_into_phrases(raw_text: str, limit: int = 135) -> List[SpeechPhrase]:
    """
    Parses text into natural prosodic phrasing units with context-aware pauses:
      - Headings: 550ms
      - Paragraphs: 580ms
      - Full sentences (။, !, ?, …): 380ms
      - Sub-clauses (၊, ,, ;): 200ms
      - Mid-clause continuation: 100ms
    """
    raw_text = re.sub(r'\r\n|\r', '\n', raw_text).strip()
    paras = [p.strip() for p in re.split(r'\n{2,}', raw_text) if p.strip()]
    phrases = []

    for p_idx, para in enumerate(paras):
        is_last_para = (p_idx == len(paras) - 1)
        is_heading = len(para) < 100 and ('\n' not in para) and (not para.endswith('။')) and (not para.endswith('.'))

        raw_sentences = [s.strip() for s in re.split(r'(?<=[။!?…])\s+|\n+', para) if s.strip()]

        for s_idx, sent in enumerate(raw_sentences):
            is_last_sent = (s_idx == len(raw_sentences) - 1)

            if is_heading:
                sent_pause = 0.550
                b_type = 'heading'
            elif is_last_sent:
                sent_pause = 0.580 if not is_last_para else 0.380
                b_type = 'paragraph'
            else:
                sent_pause = 0.380
                b_type = 'sentence'

            if len(sent) <= limit:
                phrases.append(SpeechPhrase(text=sent, pause_after_sec=sent_pause, boundary=b_type))
            else:
                clauses = [c.strip() for c in re.split(r'(?<=[၊,;])\s*', sent) if c.strip()]
                for c_idx, clause in enumerate(clauses):
                    is_last_clause = (c_idx == len(clauses) - 1)
                    clause_pause = sent_pause if is_last_clause else 0.200
                    c_b_type = b_type if is_last_clause else 'clause'

                    if len(clause) <= limit:
                        phrases.append(SpeechPhrase(text=clause, pause_after_sec=clause_pause, boundary=c_b_type))
                    else:
                        while len(clause) > limit:
                            cut = find_best_clause_cut(clause, limit=limit, min_len=40)
                            head = clause[:cut].strip()
                            clause = clause[cut:].strip()
                            if head:
                                phrases.append(SpeechPhrase(text=head, pause_after_sec=0.100, boundary='continuation'))
                        if clause:
                            phrases.append(SpeechPhrase(text=clause, pause_after_sec=clause_pause, boundary=c_b_type))

    return phrases


def trim_silence_and_fade(np_mod, samples, sample_rate: int = SAMPLE_RATE):
    """Trims raw synthesis down to a crisp 15ms lead and 25ms release with click-free cosine fade."""
    n = samples.size
    if n < 1200:
        return samples
    mask = np_mod.abs(samples) >= 0.008
    if not mask.any():
        return np_mod.zeros(int(sample_rate * 0.05), dtype=np_mod.float32)
    idx = np_mod.flatnonzero(mask)
    lead_pad = int(sample_rate * 0.015)   # 15ms crisp attack
    tail_pad = int(sample_rate * 0.025)   # 25ms release
    start = max(0, int(idx[0]) - lead_pad)
    end = min(n, int(idx[-1]) + tail_pad)
    out = samples[start:end].astype(np_mod.float32, copy=True)

    fade_len = min(int(sample_rate * 0.010), out.size // 4)
    if fade_len > 1:
        ramp = 0.5 - 0.5 * np_mod.cos(np_mod.linspace(0.0, math.pi, fade_len, dtype=np_mod.float32))
        out[:fade_len] *= ramp
        out[-fade_len:] *= ramp[::-1]
    return out


def format_size(num_bytes: int) -> str:
    if num_bytes >= 1024 * 1024:
        return f"{num_bytes / (1024 * 1024):.1f} MB"
    return f"{max(1, round(num_bytes / 1024))} KB"


def find_ffmpeg() -> Optional[str]:
    return shutil.which('ffmpeg') or (
        '/opt/homebrew/bin/ffmpeg' if Path('/opt/homebrew/bin/ffmpeg').exists() else None
    )


def save_manifest(manifest: dict) -> None:
    MANIFEST_JSON.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    MANIFEST_JS.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST_JS.write_text(
        'window.HTET_AUDIO_MANIFEST_BACKUP = ' + json.dumps(manifest, ensure_ascii=False, indent=2) + ';\n',
        encoding='utf-8'
    )


def main():
    parser = argparse.ArgumentParser(description='Enhanced Studio MP3 Audio Generator with Natural Phrasing for Htet Archive.')
    parser.add_argument('--model-dir', type=Path, default=ROOT / 'scripts' / 'nara-mini-v1',
                        help='Local path to downloaded YeeNyunn/nara-mini-v1 repository')
    parser.add_argument('--voice', choices=['htet-myat', 'shoon', 'thazin', 'ko-banyar'], default='shoon')
    parser.add_argument('--article', help='Specific article id to synthesize')
    parser.add_argument('--ids', nargs='+', help='List of specific article ids to synthesize')
    parser.add_argument('--limit', type=int, default=5, help='Synthesize top N newest articles')
    parser.add_argument('--all', action='store_true', help='Synthesize all articles in data/articles.json')
    parser.add_argument('--threads', type=int, default=6, help='CPU threads for ONNX Runtime')
    parser.add_argument('--bitrate', default='48k', help='MP3 bitrate when ffmpeg is installed (default: 48k)')
    parser.add_argument('--speed', type=float, default=1.0, help='Overall speech rate multiplier (default: 1.0)')
    parser.add_argument('--en-speed', type=float, default=1.0, help='English speech rate multiplier (default: 1.0 for normal speed)')
    parser.add_argument('--overwrite', action='store_true', help='Re-generate existing audio files')
    args = parser.parse_args()

    voice_folder = args.model_dir / 'onnx' / args.voice
    if not (voice_folder / 'encoder.onnx').exists() or not (args.model_dir / 'frontend' / 'nara_frontend.py').exists():
        print(f"ERROR: Nara Mini v1 files not found at {args.model_dir} (missing frontend or onnx/{args.voice})")
        sys.exit(1)

    sys.path.insert(0, str(args.model_dir))
    import numpy as np
    import onnxruntime as ort
    import frontend.g2p_my as g2p_module
    from frontend.my_numbers import verbalize  # type: ignore
    from frontend.nara_frontend import phonemize, prepare_names  # type: ignore

    # CRITICAL FIX: Patch _LATIN_RUN in g2p_my so IPA characters are recognized as continuous whole words!
    g2p_module._LATIN_RUN = re.compile(r"[A-Za-zæðθŋʒɐ-ʯᵻˈˌː]+(?:'[A-Za-zæðθŋʒɐ-ʯᵻˈˌː]+)?")

    en_to_tokens, en_mode = build_english_converter()
    print(f"Loading Nara Mini v1 voice '{args.voice}' ({args.threads} threads, prosodic phrasing engine, en-speed: {args.en_speed}x normal)...", flush=True)

    metadata = json.loads((voice_folder / 'voice.json').read_text(encoding='utf-8'))
    vocab = metadata['vocab']
    centers = np.asarray(metadata['centers'])
    styles = metadata['styles']

    sess_opts = ort.SessionOptions()
    sess_opts.intra_op_num_threads = max(1, args.threads)
    sess_opts.inter_op_num_threads = 1
    encoder = ort.InferenceSession(str(voice_folder / 'encoder.onnx'), sess_opts, providers=['CPUExecutionProvider'])
    decoder = ort.InferenceSession(str(voice_folder / 'decoder.onnx'), sess_opts, providers=['CPUExecutionProvider'])

    articles = json.loads(ARTICLES_JSON.read_text(encoding='utf-8'))
    if args.article:
        targets = [a for a in articles if a.get('id') == args.article]
    elif args.ids:
        id_set = set(args.ids)
        targets = [a for a in articles if a.get('id') in id_set]
    elif args.all:
        targets = articles
    else:
        targets = articles[:args.limit]

    if not targets:
        print("ERROR: No matching articles found.")
        sys.exit(1)

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    if MANIFEST_JSON.exists():
        manifest = json.loads(MANIFEST_JSON.read_text(encoding='utf-8'))
    else:
        manifest = {
            'engine': 'Nara Mini v1 (Apache-2.0 — https://naraaudio.app)',
            'default_voice': args.voice,
            'tracks': {}
        }

    ffmpeg = find_ffmpeg()

    for idx, art in enumerate(targets, 1):
        art_id = art['id']
        ext = 'mp3' if ffmpeg else 'wav'
        out_file = AUDIO_DIR / f"{art_id}.{ext}"
        if out_file.exists() and not args.overwrite and art_id in manifest.get('tracks', {}):
            print(f"[{idx}/{len(targets)}] Skipping existing {out_file.name}")
            continue

        t0 = time.perf_counter()
        title = art.get('title_mm') or art.get('title_en') or art_id
        body = strip_html(art.get('content_mm') or art.get('content_en') or '')
        full_text = verbalize(f"{title}။\n\n{body}".strip())
        phrases = split_speech_into_phrases(full_text, limit=135)
        print(f"[{idx}/{len(targets)}] Synthesizing '{art_id}' ({len(phrases)} prosodic phrases, {len(full_text)} chars)...", flush=True)

        audio_parts = []
        for p_idx, phrase in enumerate(phrases):
            chars = phonemize(en_to_tokens(prepare_names(phrase.text)))
            tokens = [vocab[c] for c in chars if c in vocab][:506]
            if not tokens:
                continue
            style_idx = int(np.argmin(np.abs(centers - len(tokens))))
            style = np.asarray([styles[style_idx]], dtype=np.float32)
            durations, prosody, encoded_text = encoder.run(
                ['durations', 'prosody', 'text'],
                {'tokens': np.asarray([[0, *tokens, 0]], dtype=np.int64), 'style': style}
            )

            # Speech rate scaling (calibrated normal rate)
            raw_durs = durations[0]
            if args.speed != 1.0:
                durs = np.maximum(1, np.rint(raw_durs / args.speed).astype(np.int64))
            else:
                durs = np.maximum(1, np.rint(raw_durs).astype(np.int64))

            if durs.sum() < 1 or durs.sum() > 20000:
                continue

            raw_samples = decoder.run(None, {
                'prosody': np.repeat(prosody, durs, axis=2),
                'text': np.repeat(encoded_text, durs, axis=2),
                'style': style,
            })[0].reshape(-1)
            if raw_samples.size < 2400 or not np.isfinite(raw_samples).all():
                continue

            clean_samples = trim_silence_and_fade(np, np.clip(raw_samples, -1.0, 1.0), SAMPLE_RATE)
            audio_parts.append(clean_samples)

            # Insert natural human acoustic breath pause based on syntactic boundary
            if phrase.pause_after_sec > 0:
                pause_samples = np.zeros(int(SAMPLE_RATE * phrase.pause_after_sec), dtype=np.float32)
                audio_parts.append(pause_samples)

        if not audio_parts:
            print(f"    WARNING: No audio chunks produced for '{art_id}', skipping.")
            continue

        merged = np.clip(np.concatenate(audio_parts), -1.0, 1.0)
        duration_sec = round(merged.size / SAMPLE_RATE, 1)

        wav_tmp = AUDIO_DIR / f"{art_id}.tmp.wav"
        with wave.open(str(wav_tmp), 'wb') as wf:
            wf.setparams((1, 2, SAMPLE_RATE, 0, 'NONE', 'not compressed'))
            wf.writeframes((merged * 32767).astype('<i2').tobytes())

        if ffmpeg:
            subprocess.run(
                [ffmpeg, '-y', '-i', str(wav_tmp), '-ac', '1', '-ar', str(SAMPLE_RATE),
                 '-codec:a', 'libmp3lame', '-b:a', args.bitrate, str(out_file)],
                check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )
            wav_tmp.unlink(missing_ok=True)
        else:
            wav_tmp.replace(out_file)

        size_str = format_size(out_file.stat().st_size)
        manifest['tracks'][art_id] = {
            'url': f"assets/audio/{out_file.name}",
            'voice': args.voice,
            'duration_sec': duration_sec,
            'size': size_str
        }
        save_manifest(manifest)
        elapsed = time.perf_counter() - t0
        print(f"    Saved {out_file.relative_to(ROOT)} ({duration_sec}s audio, {size_str}, built in {elapsed:.1f}s)", flush=True)

    print(f"Done! Manifest updated: {len(manifest['tracks'])} instant tracks ready.")


if __name__ == '__main__':
    main()
