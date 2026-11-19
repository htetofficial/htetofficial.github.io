#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build partitioned English-Myanmar Dictionary (Ornagai dataset) for Htet Official Archive.
Converts StarDict format (111,232 headwords, 127,930 senses, 249,103 examples) into:
  - data/dictionary/<letter>.json (for HTTP fetch)
  - js/data/dictionary/<letter>.js (for local file:// instant browsing via window.HTET_DICT_<LETTER>)
  - data/dictionary/meta.json & js/data/dictionary/meta.js
  - data/dictionary/common.json & js/data/dictionary/common.js (pre-cached essential vocabulary)
"""
import struct
import json
import re
import time
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parent.parent
BASE = Path('/Users/htet/.gemini/antigravity/brain/b69d2b67-7dfa-4a96-8f68-65a3296b7c51/scratch/ornagai/ornagai-en-my')
IDX_PATH = BASE / 'ornagai-en-my.idx'
DICT_PATH = BASE / 'ornagai-en-my.dict'

DATA_DICT_DIR = ROOT / 'data' / 'dictionary'
JS_DICT_DIR = ROOT / 'js' / 'data' / 'dictionary'

COMMON_PRIORITY_WORDS = {
    'freedom', 'fear', 'courage', 'love', 'peace', 'democracy', 'justice', 'truth', 'human',
    'rights', 'constitution', 'institution', 'institutions', 'education', 'university', 'research',
    'power', 'state', 'government', 'revolution', 'people', 'nation', 'world', 'society',
    'culture', 'identity', 'feminism', 'gender', 'equality', 'philosophy', 'science', 'ethics',
    'moral', 'speech', 'voice', 'book', 'article', 'essay', 'hope', 'life', 'dignity',
    'citizen', 'citizenship', 'legitimacy', 'autonomy', 'sovereignty', 'law', 'legal', 'rule',
    'happy', 'sad', 'think', 'thought', 'learn', 'knowledge', 'wisdom', 'mind', 'spirit',
    'body', 'health', 'mental', 'resilience', 'empathy', 'compassion', 'kindness', 'respect',
    'friend', 'family', 'future', 'history', 'time', 'dream', 'change', 'action', 'solidarity'
}

def parse_senses(raw_html: str):
    blocks = re.split(r'<br\s*/?>\s*<br\s*/?>', raw_html)
    senses = []
    for b in blocks:
        b = b.strip()
        if not b:
            continue
        pos_m = re.search(r'<b>(.*?)</b>', b)
        pos = pos_m.group(1).strip() if pos_m else ''
        ipa_m = re.search(r'<i>(/.*?/)</i>', b)
        ipa = ipa_m.group(1).strip() if ipa_m else ''
        my_m = re.search(r'\[(.*?)\]', b)
        my_pron = my_m.group(1).strip() if my_m else ''
        examples = [m.strip().lstrip('•').strip() for m in re.findall(r'<i>•\s*(.*?)</i>', b)]
        clean = re.sub(r'<b>.*?</b>', '', b)
        clean = re.sub(r'<i>/.*?/</i>', '', clean)
        clean = re.sub(r'\[.*?\]', '', clean)
        clean = re.sub(r'<i>•.*?</i>', '', clean)
        clean = re.sub(r'<br\s*/?>', ' ', clean)
        clean = re.sub(r'\s+', ' ', clean).strip()
        clean = re.sub(r'^\d+\.\s*', '', clean)
        sense = {'d': clean}
        if pos: sense['p'] = pos
        if ipa: sense['i'] = ipa
        if my_pron: sense['m'] = my_pron
        if examples: sense['e'] = examples
        senses.append(sense)
    return senses

def main():
    print(f"Reading Ornagai StarDict files from: {BASE}")
    t0 = time.time()
    
    DATA_DICT_DIR.mkdir(parents=True, exist_ok=True)
    JS_DICT_DIR.mkdir(parents=True, exist_ok=True)

    with open(IDX_PATH, 'rb') as f_idx:
        idx_data = f_idx.read()

    buckets = defaultdict(dict)
    wordlist_per_letter = defaultdict(list)
    common_dict = {}

    with open(DICT_PATH, 'rb') as f_dict:
        pos = 0
        count = 0
        while pos < len(idx_data):
            null_pos = idx_data.find(b'\x00', pos)
            word = idx_data[pos:null_pos].decode('utf-8', errors='replace')
            pos = null_pos + 1
            offset, length = struct.unpack('>II', idx_data[pos:pos+8])
            pos += 8

            f_dict.seek(offset)
            raw_bytes = f_dict.read(length)
            raw_html = raw_bytes.decode('utf-8', errors='replace')

            first_char = word[0].lower() if word and word[0].isalpha() and ord(word[0].lower()) < 128 else 'other'
            senses = parse_senses(raw_html)
            buckets[first_char][word] = senses
            wordlist_per_letter[first_char].append(word)

            if word.lower() in COMMON_PRIORITY_WORDS or (count < 2500 and len(word) <= 6 and word.isalpha()):
                common_dict[word] = senses

            count += 1

    t_read = time.time()
    print(f"Parsed {count} words in {t_read - t0:.2f}s. Writing partitioned JSON & JS files...")

    meta = {
        "title": "Ornagai English-Myanmar Comprehensive Dictionary",
        "title_mm": "အော်နဂါး အင်္ဂလိပ်-မြန်မာ အဘိဓာန် အပြည့်အစုံ",
        "author": "Ornagai (Exported 2026-11-15)",
        "website": "https://ornagai.com",
        "license": "Non-Commercial Educational & Research Integration",
        "total_words": count,
        "letters": {}
    }

    # Write each letter
    for letter in sorted(buckets.keys()):
        var_name = f"HTET_DICT_{letter.upper()}"
        data = buckets[letter]
        words = wordlist_per_letter[letter]
        meta["letters"][letter] = {
            "count": len(words),
            "sample_words": words[:15]
        }

        # JSON file
        json_path = DATA_DICT_DIR / f"{letter}.json"
        json_path.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')

        # JS file (for file:// local browsing)
        js_path = JS_DICT_DIR / f"{letter}.js"
        js_content = f"window.{var_name} = " + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ";\n"
        js_path.write_text(js_content, encoding='utf-8')

        size_kb = json_path.stat().st_size / 1024
        print(f"  Letter '{letter}': {len(words)} words ({size_kb:.1f} KB)")

    # Write common dictionary
    (DATA_DICT_DIR / "common.json").write_text(json.dumps(common_dict, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    (JS_DICT_DIR / "common.js").write_text("window.HTET_DICT_COMMON = " + json.dumps(common_dict, ensure_ascii=False, separators=(',', ':')) + ";\n", encoding='utf-8')
    print(f"  Pre-cached common vocabulary: {len(common_dict)} words ({(DATA_DICT_DIR / 'common.json').stat().st_size / 1024:.1f} KB)")

    # Write metadata
    (DATA_DICT_DIR / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding='utf-8')
    (JS_DICT_DIR / "meta.js").write_text("window.HTET_DICT_META = " + json.dumps(meta, ensure_ascii=False, indent=2) + ";\n", encoding='utf-8')

    t_end = time.time()
    print(f"Done! Created 27 letter partitions + common + meta in {t_end - t0:.2f}s.")

if __name__ == '__main__':
    main()
