#!/usr/bin/env python3
"""
Build Myanmar Words & BurmeseNLP Lexicons and Reverse Dictionary
- Merges myanmartools/myanmar-words (26,182 words) + burmesenlp (24,268 words)
- Partitions into 34 Myanmar consonant buckets (ka, kha, ga, ... + other)
- Generates JSON for HTTP fetch and JS globals for file:// protocol
- Builds Reverse Myanmar-to-English dictionary index from Ornagai 111,232 words
- Exports Zawgyi/Unicode converter rules and lexicon index for js/burmesenlp.js
"""

import os
import sys
import json
import glob
import re
from pathlib import Path
from collections import defaultdict

SCRATCH_DIR = Path('/Users/htet/.gemini/antigravity/brain/b69d2b67-7dfa-4a96-8f68-65a3296b7c51/scratch/repos')
MW_DIR = SCRATCH_DIR / 'myanmar-words'
BNLP_DIR = SCRATCH_DIR / 'burmesenlp'

OUT_MW_DATA = Path('data/myanmar-words')
OUT_MW_JS = Path('js/data/myanmar-words')

OUT_REV_DATA = Path('data/dictionary/reverse')
OUT_REV_JS = Path('js/data/dictionary/reverse')

OUT_MW_DATA.mkdir(parents=True, exist_ok=True)
OUT_MW_JS.mkdir(parents=True, exist_ok=True)
OUT_REV_DATA.mkdir(parents=True, exist_ok=True)
OUT_REV_JS.mkdir(parents=True, exist_ok=True)

# 33 Myanmar consonants + mapping
CONSONANTS = [
    ('ka', 'က'), ('kha', 'ခ'), ('ga', 'ဂ'), ('gha', 'ဃ'), ('nga', 'င'),
    ('ca', 'စ'), ('cha', 'ဆ'), ('za', 'ဇ'), ('zha', 'ဈ'), ('nya', 'ည'),
    ('tta', 'ဋ'), ('ttha', 'ဌ'), ('dda', 'ဍ'), ('ddha', 'ဎ'), ('nna', 'ဏ'),
    ('ta', 'တ'), ('tha', 'ထ'), ('da', 'ဒ'), ('dha', 'ဓ'), ('na', 'န'),
    ('pa', 'ပ'), ('pha', 'ဖ'), ('ba', 'ဗ'), ('bha', 'ဘ'), ('ma', 'မ'),
    ('ya', 'ယ'), ('ra', 'ရ'), ('la', 'လ'), ('wa', 'ဝ'), ('sa', 'သ'),
    ('ha', 'ဟ'), ('lla', 'ဠ'), ('a', 'အ')
]
CHAR_TO_BUCKET = {char: bname for bname, char in CONSONANTS}

# Independent vowels map to 'a' bucket
INDEP_VOWELS = 'ဣဤဥဦဧဩဪ၌၍၎၏'
for iv in INDEP_VOWELS:
    CHAR_TO_BUCKET[iv] = 'a'

POS_LABEL_MM = {
    'n': 'နာမ် (Noun)',
    'v': 'ကြိယာ (Verb)',
    'adj': 'နာမဝိသေသန (Adjective)',
    'adv': 'ကြိယာဝိသေသန (Adverb)',
    'pron': 'နာမ်စား (Pronoun)',
    'postp': 'ဝိဘတ် (Postposition)',
    'part': 'ပစ္စည်း (Particle)',
    'conj': 'သမ္ဗန္ဓ (Conjunction)',
    'num': 'သင်္ချာ/ဂဏန်း (Numeral)',
    'punct': 'ပုဒ်ဖြတ်ပုဒ်ရပ် (Punctuation)',
    'interj': 'အာမေဍိတ် (Interjection)'
}

def get_bucket(word: str) -> str:
    clean = word.strip().lstrip('၊။\s,;\"\'')
    if not clean:
        return 'other'
    first = clean[0]
    return CHAR_TO_BUCKET.get(first, 'other')

def main():
    print("=== Step 1: Merging myanmartools/myanmar-words and burmesenlp ===")
    
    # 1. Load myanmar-words
    mw_json_dir = MW_DIR / 'json-files'
    mw_pos_map = {
        'nouns.json': 'n',
        'verbs.json': 'v',
        'adjectives.json': 'adj',
        'adverbs.json': 'adv',
        'conjunctions.json': 'conj',
        'particles.json': 'part',
        'postpositions.json': 'postp',
        'pronouns.json': 'pron'
    }
    
    word_db = {} # word -> {"pos": [...], "sources": [...]}
    
    for fname, ptag in mw_pos_map.items():
        fpath = mw_json_dir / fname
        if fpath.exists():
            with open(fpath, 'r', encoding='utf-8') as f:
                entries = json.load(f)
                for w in entries:
                    w = w.strip()
                    if not w:
                        continue
                    if w not in word_db:
                        word_db[w] = {"pos": set(), "src": {"myanmar-words"}}
                    word_db[w]["pos"].add(ptag)
                    word_db[w]["src"].add("myanmar-words")
    
    print(f"Loaded {len(word_db)} unique words from myanmartools/myanmar-words")
    
    # 2. Load burmesenlp default.json
    bnlp_lex_path = BNLP_DIR / 'src' / 'burmesenlp' / 'lexicon' / 'data' / 'default.json'
    if bnlp_lex_path.exists():
        with open(bnlp_lex_path, 'r', encoding='utf-8') as f:
            bnlp_lex = json.load(f)
            for w, tags in bnlp_lex.items():
                w = w.strip()
                if not w:
                    continue
                if w not in word_db:
                    word_db[w] = {"pos": set(), "src": {"burmesenlp"}}
                word_db[w]["src"].add("burmesenlp")
                for t in tags:
                    tl = t.lower()
                    if 'noun' in tl: word_db[w]["pos"].add('n')
                    elif 'verb' in tl: word_db[w]["pos"].add('v')
                    elif 'adj' in tl: word_db[w]["pos"].add('adj')
                    elif 'adv' in tl: word_db[w]["pos"].add('adv')
                    elif 'postp' in tl: word_db[w]["pos"].add('postp')
                    elif 'part' in tl: word_db[w]["pos"].add('part')
                    elif 'pron' in tl: word_db[w]["pos"].add('pron')
                    elif 'conj' in tl: word_db[w]["pos"].add('conj')
                    elif 'num' in tl: word_db[w]["pos"].add('num')
                    elif 'punct' in tl: word_db[w]["pos"].add('punct')
    
    print(f"Total combined Myanmar words database: {len(word_db)} unique entries")
    
    # 3. Partition Myanmar Words by Consonant
    mw_buckets = defaultdict(dict)
    pos_index = defaultdict(list)
    
    for word, meta in sorted(word_db.items()):
        bucket = get_bucket(word)
        pos_list = sorted(list(meta["pos"])) if meta["pos"] else ["n"]
        sources = sorted(list(meta["src"]))
        mw_buckets[bucket][word] = {
            "p": pos_list,
            "s": sources
        }
        for p in pos_list:
            if len(pos_index[p]) < 500: # Index first 500 per POS for fast browsing
                pos_index[p].append(word)

    print("=== Step 2: Writing Myanmar Words Partitions ===")
    meta_buckets = {}
    for bname, _ in CONSONANTS:
        bdata = mw_buckets.get(bname, {})
        meta_buckets[bname] = len(bdata)
        out_json = OUT_MW_DATA / f"{bname}.json"
        out_js = OUT_MW_JS / f"{bname}.js"
        with open(out_json, 'w', encoding='utf-8') as f:
            json.dump(bdata, f, ensure_ascii=False)
        with open(out_js, 'w', encoding='utf-8') as f:
            f.write(f"window.HTET_MW_{bname.upper()} = " + json.dumps(bdata, ensure_ascii=False) + ";\n")
    
    # Other bucket
    other_data = mw_buckets.get('other', {})
    meta_buckets['other'] = len(other_data)
    with open(OUT_MW_DATA / "other.json", 'w', encoding='utf-8') as f:
        json.dump(other_data, f, ensure_ascii=False)
    with open(OUT_MW_JS / "other.js", 'w', encoding='utf-8') as f:
        f.write("window.HTET_MW_OTHER = " + json.dumps(other_data, ensure_ascii=False) + ";\n")
        
    # POS index
    with open(OUT_MW_DATA / "pos_index.json", 'w', encoding='utf-8') as f:
        json.dump(dict(pos_index), f, ensure_ascii=False, indent=2)
    with open(OUT_MW_JS / "pos_index.js", 'w', encoding='utf-8') as f:
        f.write("window.HTET_MW_POS_INDEX = " + json.dumps(dict(pos_index), ensure_ascii=False) + ";\n")

    # Meta
    mw_meta = {
        "total_words": len(word_db),
        "buckets": meta_buckets,
        "consonants": CONSONANTS,
        "pos_labels": POS_LABEL_MM
    }
    with open(OUT_MW_DATA / "meta.json", 'w', encoding='utf-8') as f:
        json.dump(mw_meta, f, ensure_ascii=False, indent=2)
    with open(OUT_MW_JS / "meta.js", 'w', encoding='utf-8') as f:
        f.write("window.HTET_MW_META = " + json.dumps(mw_meta, ensure_ascii=False, indent=2) + ";\n")
    
    print(f"Created 34 Myanmar Words partitions in {OUT_MW_DATA} and {OUT_MW_JS}")
    
    # === Step 3: Build Reverse Myanmar-to-English Dictionary Index from Ornagai ===
    print("=== Step 3: Building Reverse Myanmar-to-English Index from Ornagai ===")
    my_to_en = defaultdict(lambda: defaultdict(list)) # bucket -> my_word -> [en_words]
    split_pat = re.compile(r'[၊။\s,;()\[\]\"\'\<\>\/\-]+')
    
    en_files = sorted(glob.glob('data/dictionary/[a-z].json') + ['data/dictionary/other.json'])
    total_reverse_pairs = 0
    
    for ef in en_files:
        with open(ef, 'r', encoding='utf-8') as f:
            en_data = json.load(f)
            for en_word, senses in en_data.items():
                for s in senses:
                    d = s.get('d', '')
                    d_clean = re.sub(r'<[^>]+>', ' ', d)
                    tokens = split_pat.split(d_clean)
                    for t in tokens:
                        t = t.strip()
                        # Only Myanmar words of length >= 2
                        if len(t) >= 2 and any('\u1000' <= ch <= '\u109f' for ch in t):
                            bucket = get_bucket(t)
                            if en_word not in my_to_en[bucket][t]:
                                if len(my_to_en[bucket][t]) < 10: # Keep up to 10 top English matches
                                    my_to_en[bucket][t].append(en_word)
                                    total_reverse_pairs += 1
    
    total_my_words = sum(len(b) for b in my_to_en.values())
    print(f"Built reverse index with {total_my_words} Myanmar headwords ({total_reverse_pairs} associations)")
    
    # Write reverse partitions
    rev_meta_buckets = {}
    for bname, _ in CONSONANTS:
        bdata = dict(my_to_en.get(bname, {}))
        rev_meta_buckets[bname] = len(bdata)
        out_json = OUT_REV_DATA / f"{bname}.json"
        out_js = OUT_REV_JS / f"{bname}.js"
        with open(out_json, 'w', encoding='utf-8') as f:
            json.dump(bdata, f, ensure_ascii=False)
        with open(out_js, 'w', encoding='utf-8') as f:
            f.write(f"window.HTET_DICT_MY_{bname.upper()} = " + json.dumps(bdata, ensure_ascii=False) + ";\n")
            
    other_rev = dict(my_to_en.get('other', {}))
    rev_meta_buckets['other'] = len(other_rev)
    with open(OUT_REV_DATA / "other.json", 'w', encoding='utf-8') as f:
        json.dump(other_rev, f, ensure_ascii=False)
    with open(OUT_REV_JS / "other.js", 'w', encoding='utf-8') as f:
        f.write("window.HTET_DICT_MY_OTHER = " + json.dumps(other_rev, ensure_ascii=False) + ";\n")
        
    # Reverse Meta
    rev_meta = {
        "total_my_words": total_my_words,
        "total_pairs": total_reverse_pairs,
        "buckets": rev_meta_buckets
    }
    with open(OUT_REV_DATA / "meta.json", 'w', encoding='utf-8') as f:
        json.dump(rev_meta, f, ensure_ascii=False, indent=2)
    with open(OUT_REV_JS / "meta.js", 'w', encoding='utf-8') as f:
        f.write("window.HTET_DICT_MY_META = " + json.dumps(rev_meta, ensure_ascii=False, indent=2) + ";\n")
        
    # High-priority Reverse Common words for 0ms initial search
    common_my_terms = [
        'လွတ်လပ်ခွင့်', 'ဒီမိုကရေစီ', 'လူ့အခွင့်အရေး', 'ကြောက်ရွံ့ခြင်း', 'သတ္တိ',
        'ငြိမ်းချမ်းရေး', 'တရားမျှတမှု', 'တန်းတူညီမျှရေး', 'အမျိုးသမီး', 'ကုလသမဂ္ဂ',
        'မေတ္တာ', 'ပညာရေး', 'ကျန်းမာရေး', 'နိုင်ငံရေး', 'စီးပွားရေး', 'လူ့ဘောင်',
        'ခွဲခြားဆက်ဆံမှု', 'အာဏာ', 'လွတ်လပ်မှု', 'သစ္စာ', 'ဂုဏ်သိက္ခာ'
    ]
    common_rev = {}
    for cterm in common_my_terms:
        cbucket = get_bucket(cterm)
        if cterm in my_to_en[cbucket]:
            common_rev[cterm] = my_to_en[cbucket][cterm]
            
    with open(OUT_REV_DATA / "common.json", 'w', encoding='utf-8') as f:
        json.dump(common_rev, f, ensure_ascii=False, indent=2)
    with open(OUT_REV_JS / "common.js", 'w', encoding='utf-8') as f:
        f.write("window.HTET_DICT_MY_COMMON = " + json.dumps(common_rev, ensure_ascii=False, indent=2) + ";\n")
        
    print(f"Created 34 Reverse Dictionary partitions in {OUT_REV_DATA} and {OUT_REV_JS}")
    print("Done successfully!")

if __name__ == '__main__':
    main()
