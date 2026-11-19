#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Htet Official — Telegram Bot Engine & Mini App Gateway
A pure, zero-external-dependency Telegram Bot with:
  • Mini App WebApp Buttons & Persistent Menu Button
  • Ornagai En-My Dual Dictionary Lookup (/dict)
  • Universal Machine Translation (/translate)
  • Articles & Publications Catalog with Instant View links (/articles, /publications)
  • Daw Aung San Suu Kyi 81st Birthday Tribute & Freedom from Fear (/suukyi, /birthday)
  • Audio Voice Essays & Speech (/audio)
  • Inline Query Provider (@BotName <query>)
"""

import sys
import os
import json
import time
import urllib.request
import urllib.parse
import urllib.error
import re
from datetime import datetime

# Path resolution: find project root
BOT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BOT_DIR, '..'))

DEFAULT_WEBAPP_URL = "https://web.htetofficial.workers.dev"
TELEGRAM_API_BASE = "https://api.telegram.org/bot"

# Load Configuration
def get_bot_token():
    # 1. Environment variable
    token = os.environ.get("TELEGRAM_BOT_TOKEN")
    if token:
        return token.strip()
    
    # 2. Command line flag --token
    for i, arg in enumerate(sys.argv):
        if arg == '--token' and i + 1 < len(sys.argv):
            return sys.argv[i + 1].strip()

    # 3. Local config file
    cfg_path = os.path.join(BOT_DIR, 'config.json')
    if os.path.exists(cfg_path):
        try:
            with open(cfg_path, 'r', encoding='utf-8') as f:
                c = json.load(f)
                if c.get('bot_token'):
                    return c['bot_token'].strip()
        except Exception:
            pass

    return None

def get_webapp_url():
    cfg_path = os.path.join(BOT_DIR, 'config.json')
    if os.path.exists(cfg_path):
        try:
            with open(cfg_path, 'r', encoding='utf-8') as f:
                c = json.load(f)
                if c.get('webapp_url'):
                    return c['webapp_url'].strip()
        except Exception:
            pass
    return os.environ.get("WEBAPP_URL", DEFAULT_WEBAPP_URL)

WEBAPP_URL = get_webapp_url()

# ---------------------------------------------------------------------------
# Telegram Bot API Helper (Pure urllib, zero pip requirements)
# ---------------------------------------------------------------------------
class TelegramAPI:
    def __init__(self, token):
        self.token = token
        self.endpoint = f"{TELEGRAM_API_BASE}{token}/"

    def request(self, method, data=None):
        url = self.endpoint + method
        headers = {'User-Agent': 'HtetOfficialBot/1.0'}
        req_data = None
        if data is not None:
            headers['Content-Type'] = 'application/json'
            req_data = json.dumps(data).encode('utf-8')

        req = urllib.request.Request(url, data=req_data, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=35) as resp:
                body = resp.read().decode('utf-8')
                return json.loads(body)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode('utf-8', errors='replace')
            print(f"[API Error] HTTP {e.code} on {method}: {err_body}", file=sys.stderr)
            try:
                return json.loads(err_body)
            except Exception:
                return {"ok": False, "description": err_body}
        except Exception as e:
            print(f"[Network Error] {method}: {e}", file=sys.stderr)
            return {"ok": False, "description": str(e)}

    def get_me(self):
        return self.request('getMe')

    def set_my_commands(self, commands):
        return self.request('setMyCommands', {'commands': commands})

    def set_chat_menu_button(self, webapp_url):
        data = {
            "menu_button": {
                "type": "web_app",
                "text": "📖 Htet Mini App",
                "web_app": {
                    "url": webapp_url
                }
            }
        }
        return self.request('setChatMenuButton', data)

    def send_message(self, chat_id, text, reply_markup=None, parse_mode='HTML', disable_preview=False):
        data = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': parse_mode,
            'disable_web_page_preview': disable_preview
        }
        if reply_markup:
            data['reply_markup'] = reply_markup
        return self.request('sendMessage', data)

    def send_photo(self, chat_id, photo_url, caption=None, reply_markup=None, parse_mode='HTML'):
        data = {
            'chat_id': chat_id,
            'photo': photo_url,
            'parse_mode': parse_mode
        }
        if caption:
            data['caption'] = caption
        if reply_markup:
            data['reply_markup'] = reply_markup
        return self.request('sendPhoto', data)

    def answer_inline_query(self, inline_query_id, results, cache_time=300):
        data = {
            'inline_query_id': inline_query_id,
            'results': results,
            'cache_time': cache_time
        }
        return self.request('answerInlineQuery', data)

    def get_updates(self, offset=None, timeout=25):
        data = {'timeout': timeout}
        if offset is not None:
            data['offset'] = offset
        return self.request('getUpdates', data)

# ---------------------------------------------------------------------------
# Data Repository Loaders (Articles, Dictionary, Translations)
# ---------------------------------------------------------------------------
class DataRepo:
    def __init__(self):
        self.articles = []
        self.publications = []
        self.translation_pairs = []
        self.load_all()

    def load_all(self):
        # 1. Articles
        art_path = os.path.join(PROJECT_ROOT, 'data', 'articles.json')
        if os.path.exists(art_path):
            try:
                with open(art_path, 'r', encoding='utf-8') as f:
                    self.articles = json.load(f)
            except Exception as e:
                print(f"[Repo] Error loading articles: {e}")

        # 2. Publications
        pub_path = os.path.join(PROJECT_ROOT, 'data', 'publications.json')
        if os.path.exists(pub_path):
            try:
                with open(pub_path, 'r', encoding='utf-8') as f:
                    self.publications = json.load(f)
            except Exception as e:
                print(f"[Repo] Error loading publications: {e}")

        # 3. Translation pairs
        trans_path = os.path.join(PROJECT_ROOT, 'data', 'translations', 'pairs.json')
        if os.path.exists(trans_path):
            try:
                with open(trans_path, 'r', encoding='utf-8') as f:
                    self.translation_pairs = json.load(f)
            except Exception as e:
                print(f"[Repo] Error loading translations: {e}")

    def lookup_dictionary(self, word):
        word = word.strip().lower()
        if not word:
            return None
        
        # Check first char bucket
        first_char = word[0] if word[0].isalpha() else 'other'
        fname = os.path.join(PROJECT_ROOT, 'data', 'dictionary', f'{first_char}.json')
        if not os.path.exists(fname):
            fname = os.path.join(PROJECT_ROOT, 'data', 'dictionary', 'other.json')

        if os.path.exists(fname):
            try:
                with open(fname, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if word in data:
                        return data[word]
                    for k, v in data.items():
                        if k.lower() == word:
                            return v
            except Exception:
                pass
        return None

    def lookup_translation(self, query):
        q = query.strip().lower()
        if not q or not self.translation_pairs:
            return None
        
        # Exact match
        for item in self.translation_pairs:
            if q == item.get('en', '').lower() or q == item.get('my', '').strip():
                return item
        # Substring match
        for item in self.translation_pairs:
            if q in item.get('en', '').lower() or q in item.get('my', ''):
                return item
        return None

# ---------------------------------------------------------------------------
# Online Translation Engine Fallback (Multi-Cloud GTX / MyMemory)
# ---------------------------------------------------------------------------
def online_translate(text, src='auto', tgt='my'):
    """Zero-key Neural MT lookup using Google Translate client endpoint"""
    try:
        url = (
            "https://translate.googleapis.com/translate_a/single"
            "?client=gtx&sl=" + urllib.parse.quote(src) +
            "&tl=" + urllib.parse.quote(tgt) +
            "&dt=t&q=" + urllib.parse.quote(text)
        )
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data and data[0]:
                out = "".join([part[0] for part in data[0] if part and part[0]])
                return out
    except Exception:
        pass
    return None

# ---------------------------------------------------------------------------
# Bot Command & Event Handlers
# ---------------------------------------------------------------------------
repo = DataRepo()

def handle_start(api, msg):
    chat_id = msg['chat']['id']
    from_user = msg.get('from', {})
    user_name = from_user.get('first_name', 'မိတ်ဆွေ')

    welcome_text = (
        f"🌸 <b>မင်္ဂလာပါ {user_name} ရှင့်၊</b>\n\n"
        f"<b>ထက် (Htet)</b> ၏ တရားဝင် Telegram Official Bot နှင့် Mini App မှ နွေးထွေးစွာ ကြိုဆိုပါသည်ရှင်။\n\n"
        f"နိုင်ငံရေးဒဿနိကဗေဒ၊ အမျိုးသမီးဝါဒနှင့် သုတေသနဆောင်းပါးများကို Telegram ထဲတွင် တိုက်ရိုက်ဖတ်ရှုနိုင်သလို "
        f"ခေတ်မီ <b>Telegram Mini App</b> ဖြင့်လည်း ချောမွေ့စွာ ဝင်ရောက်အသုံးပြုနိုင်ပါသည်။\n\n"
        f"🕊️ <b>ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့ဂုဏ်ပြုလွှာနှင့် Freedom from Fear</b> စာတမ်းများကိုလည်း "
        f"အောက်ပါခလုတ်များဖြင့် ချက်ချင်း ဖတ်ရှု/နားဆင်နိုင်ပါပြီရှင်။"
    )

    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "📖 Htet Official Mini App ဖွင့်ရန်",
                    "web_app": {"url": WEBAPP_URL}
                }
            ],
            [
                {
                    "text": "🌐 ဘာသာပြန်စတူဒီယို (Translate)",
                    "web_app": {"url": f"{WEBAPP_URL}/translate.html"}
                },
                {
                    "text": "📚 အဘိဓာန် (Dictionary)",
                    "web_app": {"url": f"{WEBAPP_URL}/dictionary.html"}
                }
            ],
            [
                {
                    "text": "🕊️ Freedom from Fear (1990)",
                    "web_app": {"url": f"{WEBAPP_URL}/article.html?id=aung-san-suu-kyi-freedom-from-fear-1990-mm"}
                },
                {
                    "text": "🎂 ၈၁ နှစ်ပြည့် မွေးနေ့ဂုဏ်ပြုလွှာ",
                    "web_app": {"url": f"{WEBAPP_URL}/article.html?id=daw-aung-san-suu-kyi-81st-birthday-tribute"}
                }
            ],
            [
                {
                    "text": "📢 Telegram Channel: @htetmmofficial",
                    "url": "https://t.me/htetmmofficial"
                },
                {
                    "text": "📚 စာကြည့်တိုက်: @ideahublibrary",
                    "url": "https://t.me/ideahublibrary"
                }
            ]
        ]
    }

    api.send_message(chat_id, welcome_text, reply_markup=keyboard)

def handle_app(api, msg):
    chat_id = msg['chat']['id']
    text = (
        "🚀 <b>Htet Official Telegram Mini App</b>\n\n"
        "ဝက်ဘ်ဆိုက်တစ်ခုလုံးကို Telegram ထဲမှ ထွက်စရာမလိုဘဲ အပြည့်အဝ အသုံးပြုနိုင်ရန် "
        "အောက်ပါခလုတ်ကို နှိပ်၍ ဖွင့်လှစ်နိုင်ပါသည်ရှင်။"
    )
    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🚀 Mini App ကို မျက်နှာပြည့် ဖွင့်မည်",
                    "web_app": {"url": WEBAPP_URL}
                }
            ],
            [
                {
                    "text": "🌐 ဘာသာပြန်စတူဒီယို",
                    "web_app": {"url": f"{WEBAPP_URL}/translate.html"}
                },
                {
                    "text": "📚 အဘိဓာန်နှင့် NLP စတူဒီယို",
                    "web_app": {"url": f"{WEBAPP_URL}/dictionary.html"}
                }
            ]
        ]
    }
    api.send_message(chat_id, text, reply_markup=keyboard)

def handle_suukyi(api, msg):
    chat_id = msg['chat']['id']
    text = (
        "🕊️ <b>ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့နှင့် Freedom from Fear စာတမ်း</b>\n\n"
        "<i>\"The only real prison is fear, and the only real freedom is Freedom from Fear.\"</i>\n"
        "— Aung San Suu Kyi (1990)\n\n"
        "၈၁ နှစ်ပြည့် မွေးနေ့မှသည် အလုံးစုံ လွတ်မြောက်ရေးဆီသို့ မျှော်ရည်၍ လူထုခေါင်းဆောင်၏ "
        "ဂုဏ်ပြုလွှာနှင့် သမိုင်းဝင် Freedom from Fear စာတမ်းအား အင်္ဂလိပ်/မြန်မာ အသံဖိုင်နှင့်တကွ ဖတ်ရှုနိုင်ပါသည်ရှင်။"
    )

    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🎂 ၈၁ နှစ်ပြည့် မွေးနေ့ဂုဏ်ပြုလွှာ ဖတ်ရန်",
                    "web_app": {"url": f"{WEBAPP_URL}/article.html?id=daw-aung-san-suu-kyi-81st-birthday-tribute"}
                }
            ],
            [
                {
                    "text": "📖 Freedom from Fear (Essay + Audio)",
                    "web_app": {"url": f"{WEBAPP_URL}/article.html?id=aung-san-suu-kyi-freedom-from-fear-1990-mm"}
                }
            ],
            [
                {
                    "text": "📥 မူရင်း PDF ဒေါင်းလုဒ် ရယူရန်",
                    "url": f"{WEBAPP_URL}/downloads/aung-san-suu-kyi-freedom-from-fear-1990-mm.pdf"
                }
            ]
        ]
    }
    api.send_message(chat_id, text, reply_markup=keyboard)

def handle_articles(api, msg):
    chat_id = msg['chat']['id']
    arts = repo.articles[:6] # Top 6
    text = "📚 <b>နောက်ဆုံးထုတ်ဝေထားသော သုတေသနဆောင်းပါးများ</b>\n\n"

    for i, a in enumerate(arts, 1):
        title = a.get('title', {}).get('mm', a.get('title', 'ဆောင်းပါး')) if isinstance(a.get('title'), dict) else a.get('title', 'ဆောင်းပါး')
        aid = a.get('id', '')
        date = a.get('date', '')
        text += f"<b>{i}။ {title}</b>\n"
        if date:
            text += f"📅 <i>{date}</i>\n"
        text += f"🔗 <a href='{WEBAPP_URL}/article.html?id={aid}'>စာမူဖတ်ရှုရန် (Web / Instant View)</a>\n\n"

    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "📑 ဆောင်းပါးများအားလုံး ကြည့်မည် (Mini App)",
                    "web_app": {"url": f"{WEBAPP_URL}/articles.html"}
                }
            ]
        ]
    }
    api.send_message(chat_id, text, reply_markup=keyboard)

def handle_publications(api, msg):
    chat_id = msg['chat']['id']
    pubs = repo.publications[:5]
    text = "📑 <b>နိုင်ငံရေးဒဿနနှင့် သုတေသန စာတမ်းငယ်များ (Monographs)</b>\n\n"

    for i, p in enumerate(pubs, 1):
        title = p.get('title', {}).get('mm', p.get('title', 'စာတမ်း')) if isinstance(p.get('title'), dict) else p.get('title', 'စာတမ်း')
        pdf = p.get('pdfUrl', '')
        text += f"<b>{i}။ {title}</b>\n"
        if pdf:
            text += f"📥 <a href='{WEBAPP_URL}/{pdf}'>PDF တိုက်ရိုက်ဒေါင်းလုဒ်</a>\n\n"

    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "📚 စာတမ်း ၄၂ စောင်လုံး ကြည့်မည် (Mini App)",
                    "web_app": {"url": f"{WEBAPP_URL}/publications.html"}
                }
            ]
        ]
    }
    api.send_message(chat_id, text, reply_markup=keyboard)

def handle_dict(api, msg, query):
    chat_id = msg['chat']['id']
    query = query.strip()
    if not query:
        api.send_message(chat_id, "📖 <b>အသုံးပြုပုံ:</b> <code>/dict &lt;English Word&gt;</code>\nဥပမာ: <code>/dict freedom</code> သို့မဟုတ် <code>/dict democracy</code>")
        return

    results = repo.lookup_dictionary(query)
    if not results:
        api.send_message(chat_id, f"🔍 <b>'{query}'</b> အတွက် အဘိဓာန် အဓိပ္ပာယ်ဖွင့်ဆိုချက် မတွေ့ရှိပါရှင်။ စာလုံးပေါင်း မှန်မမှန် ပြန်လည်စစ်ဆေးပေးပါရှင်။")
        return

    text = f"📚 <b>Ornagai & Myanmar Tools အဘိဓာန်:</b>\n\n<b>{query.upper()}</b>"
    first = results[0]
    pos = first.get('p', '')
    ipa = first.get('i', '')
    my_pron = first.get('m', '')
    desc = first.get('d', '')

    if ipa or my_pron or pos:
        sub = []
        if pos: sub.append(f"<i>({pos})</i>")
        if ipa: sub.append(f"<code>{ipa}</code>")
        if my_pron: sub.append(f"[{my_pron}]")
        text += f" {' • '.join(sub)}\n\n"
    else:
        text += "\n\n"

    text += f"📝 <b>အဓိပ္ပာယ်:</b>\n{desc}\n\n"

    examples = first.get('e', [])
    if examples:
        text += "💡 <b>နမူနာ ဝါကျများ:</b>\n"
        for ex in examples[:3]:
            text += f"• <i>{ex}</i>\n"

    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🔍 အဘိဓာန်စတူဒီယိုတွင် ဖွင့်ကြည့်မည်",
                    "web_app": {"url": f"{WEBAPP_URL}/dictionary.html?q={urllib.parse.quote(query)}"}
                }
            ]
        ]
    }
    api.send_message(chat_id, text, reply_markup=keyboard)

def handle_translate(api, msg, query):
    chat_id = msg['chat']['id']
    query = query.strip()
    if not query:
        api.send_message(chat_id, "🌐 <b>အသုံးပြုပုံ:</b> <code>/translate &lt;စာသား&gt;</code>\nဥပမာ: <code>/translate The only real prison is fear</code>")
        return

    # 1. Check Offline Parallel Corpus (12,021 Pairs)
    corpus_match = repo.lookup_translation(query)
    translated_text = None
    engine_badge = "12,021 Parallel Corpus (Human-Verified)"

    if corpus_match:
        # Determine direction
        if re.search(r'[က-႟]', query):
            translated_text = corpus_match.get('en')
        else:
            translated_text = corpus_match.get('my')

    # 2. Online Neural MT Fallback
    if not translated_text:
        src = 'my' if re.search(r'[က-႟]', query) else 'en'
        tgt = 'en' if src == 'my' else 'my'
        translated_text = online_translate(query, src, tgt)
        engine_badge = "Neural Machine Translation (Cloud MT)"

    if not translated_text:
        api.send_message(chat_id, "⚠️ ဘာသာပြန်ဆို၍ မရပါရှင်။ စာသားကို စစ်ဆေးပြီး ထပ်မံကြိုးစားကြည့်ပါရှင်။")
        return

    text = (
        f"🌐 <b>ဘာသာပြန်ဆိုချက်:</b>\n\n"
        f"<b>မူရင်း:</b>\n<i>{query}</i>\n\n"
        f"<b>ဘာသာပြန်:</b>\n<b>{translated_text}</b>\n\n"
        f"⚡ <i>အင်ဂျင်: {engine_badge}</i>"
    )

    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🌐 မျက်နှာပြည့် ဘာသာပြန်စတူဒီယို ဖွင့်မည်",
                    "web_app": {"url": f"{WEBAPP_URL}/translate.html"}
                }
            ]
        ]
    }
    api.send_message(chat_id, text, reply_markup=keyboard)

def handle_audio(api, msg):
    chat_id = msg['chat']['id']
    text = (
        "🎙️ <b>အသံသွင်းစာတမ်းများနှင့် မိန့်ခွန်းများ (Voice Essays)</b>\n\n"
        "၁။ <b>Freedom from Fear (မူရင်းအင်္ဂလိပ်အသံ)</b>\n"
        "— ဒေါ်အောင်ဆန်းစုကြည်၏ သမိုင်းဝင် Essay အင်္ဂလိပ်အသံသွင်း\n\n"
        "၂။ <b>ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့ဂုဏ်ပြုလွှာ</b>\n"
        "— လူထုခေါင်းဆောင်၏ မွေးနေ့ဆုတောင်း သဝဏ်လွှာ အသံဖိုင်\n\n"
        "၃။ <b>I Have a Dream</b>\n"
        "— Martin Luther King Jr. သမိုင်းဝင် မိန့်ခွန်း\n\n"
        "၄။ <b>Malala Yousafzai — Gender Apartheid</b>\n"
        "— နယ်လ်ဆင်မင်ဒဲလား အောက်မေ့ဖွယ် မိန့်ခွန်း"
    )
    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🎧 Freedom from Fear အသံဖိုင် နားဆင်ရန်",
                    "web_app": {"url": f"{WEBAPP_URL}/article.html?id=aung-san-suu-kyi-freedom-from-fear-1990-mm"}
                }
            ],
            [
                {
                    "text": "🎂 မွေးနေ့ဆုတောင်းလွှာ အသံဖိုင် နားဆင်ရန်",
                    "web_app": {"url": f"{WEBAPP_URL}/article.html?id=daw-aung-san-suu-kyi-81st-birthday-tribute"}
                }
            ]
        ]
    }
    api.send_message(chat_id, text, reply_markup=keyboard)

def handle_help(api, msg):
    chat_id = msg['chat']['id']
    text = (
        "📖 <b>Htet Official Bot — အသုံးပြုနိုင်သော Commands များ</b>\n\n"
        "• <code>/start</code> - နှုတ်ခွန်းဆက်နှင့် Mini App ဖွင့်ရန်\n"
        "• <code>/app</code> - Telegram Mini App မျက်နှာပြည့် ဖွင့်ရန်\n"
        "• <code>/suukyi</code> သို့မဟုတ် <code>/birthday</code> - ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့နှင့် Freedom from Fear စာတမ်း\n"
        "• <code>/dict &lt;word&gt;</code> - အင်္ဂလိပ်-မြန်မာ အဘိဓာန် ရှာဖွေရန်\n"
        "• <code>/translate &lt;text&gt;</code> - မြန်မာ ↔ အင်္ဂလိပ် စက်ဘာသာပြန်ဆိုရန်\n"
        "• <code>/articles</code> - သုတေသနဆောင်းပါးများ စာရင်း\n"
        "• <code>/publications</code> - ဒေါင်းလုဒ်ရယူနိုင်သော စာတမ်းငယ်များနှင့် PDF များ\n"
        "• <code>/audio</code> - နားဆင်နိုင်သော အသံသွင်းစာတမ်းများ\n"
        "• <code>/help</code> - ဤလမ်းညွှန်ကို ပြန်လည်ပြသရန်\n\n"
        "💡 <i>Tip: Chat တွင် အင်္ဂလိပ်စကားလုံး ရိုက်ထည့်လိုက်ရုံဖြင့် အဘိဓာန်အဓိပ္ပာယ်ကို အလိုအလျောက် ရှာဖွေပေးပါသည်ရှင်။</i>"
    )
    api.send_message(chat_id, text)

# ---------------------------------------------------------------------------
# Inline Query Handler (@BotName <query>)
# ---------------------------------------------------------------------------
def handle_inline_query(api, iq):
    iq_id = iq['id']
    query = iq.get('query', '').strip()
    results = []

    if not query:
        # Show default cards
        results.append({
            'type': 'article',
            'id': 'default-app',
            'title': '📖 Htet Official Mini App',
            'description': 'ဝက်ဘ်ဆိုက်နှင့် စာဖတ်ခန်းအား Telegram Mini App ဖြင့် ဖွင့်မည်',
            'input_message_content': {
                'message_text': f"📖 <b>Htet Official Telegram Mini App</b>\n\nနိုင်ငံရေးဒဿနိကဗေဒနှင့် သုတေသန စာဖတ်ခန်းကို အောက်ပါလင့်ခ်ဖြင့် ဝင်ရောက်နိုင်ပါသည်ရှင်။\n{WEBAPP_URL}",
                'parse_mode': 'HTML'
            },
            'reply_markup': {
                'inline_keyboard': [[{'text': '🚀 Mini App ဖွင့်ရန်', 'web_app': {'url': WEBAPP_URL}}]]
            }
        })
        results.append({
            'type': 'article',
            'id': 'default-suukyi',
            'title': '🕊️ Freedom from Fear (1990) — Aung San Suu Kyi',
            'description': 'ဒေါ်အောင်ဆန်းစုကြည်၏ သမိုင်းဝင် စာတမ်းနှင့် မွေးနေ့ဂုဏ်ပြုလွှာ',
            'input_message_content': {
                'message_text': (
                    "🕊️ <b>\"The only real prison is fear, and the only real freedom is Freedom from Fear.\"</b>\n\n"
                    "— ဒေါ်အောင်ဆန်းစုကြည်၏ သမိုင်းဝင် Freedom from Fear စာတမ်းအား အောက်ပါခလုတ်ဖြင့် ဖတ်ရှုနိုင်ပါသည်ရှင်။"
                ),
                'parse_mode': 'HTML'
            },
            'reply_markup': {
                'inline_keyboard': [
                    [{'text': '📖 စာတမ်းဖတ်ရန်', 'web_app': {'url': f"{WEBAPP_URL}/article.html?id=aung-san-suu-kyi-freedom-from-fear-1990-mm"}}]
                ]
            }
        })
    else:
        # Check dictionary
        dict_res = repo.lookup_dictionary(query)
        if dict_res:
            first = dict_res[0]
            desc = first.get('d', '')
            results.append({
                'type': 'article',
                'id': f'dict-{query}',
                'title': f'📚 အဘိဓာန်: {query.upper()}',
                'description': desc[:100],
                'input_message_content': {
                    'message_text': f"📚 <b>{query.upper()}</b>\n\n📝 <b>အဓိပ္ပာယ်:</b> {desc}",
                    'parse_mode': 'HTML'
                },
                'reply_markup': {
                    'inline_keyboard': [
                        [{'text': '🔍 အဘိဓာန်တွင် ကြည့်မည်', 'web_app': {'url': f"{WEBAPP_URL}/dictionary.html?q={urllib.parse.quote(query)}"}}]
                    ]
                }
            })

        # Check translation
        src = 'my' if re.search(r'[က-႟]', query) else 'en'
        tgt = 'en' if src == 'my' else 'my'
        trans = online_translate(query, src, tgt)
        if trans:
            results.append({
                'type': 'article',
                'id': f'trans-{query}',
                'title': f'🌐 ဘာသာပြန်: {trans}',
                'description': f'မူရင်း: {query}',
                'input_message_content': {
                    'message_text': f"🌐 <b>ဘာသာပြန်ဆိုချက်:</b>\n\n<b>မူရင်း:</b> {query}\n<b>ဘာသာပြန်:</b> <b>{trans}</b>",
                    'parse_mode': 'HTML'
                },
                'reply_markup': {
                    'inline_keyboard': [
                        [{'text': '🌐 ဘာသာပြန်စတူဒီယို ဖွင့်မည်', 'web_app': {'url': f"{WEBAPP_URL}/translate.html"}}]
                    ]
                }
            })

    api.answer_inline_query(iq_id, results[:10])

# ---------------------------------------------------------------------------
# Message Router
# ---------------------------------------------------------------------------
def process_message(api, msg):
    text = msg.get('text', '').strip()
    if not text:
        return

    # Commands
    if text.startswith('/start'):
        handle_start(api, msg)
    elif text.startswith('/app') or text.startswith('/mini'):
        handle_app(api, msg)
    elif text.startswith('/suukyi') or text.startswith('/birthday'):
        handle_suukyi(api, msg)
    elif text.startswith('/articles'):
        handle_articles(api, msg)
    elif text.startswith('/publications'):
        handle_publications(api, msg)
    elif text.startswith('/dict'):
        parts = text.split(maxsplit=1)
        handle_dict(api, msg, parts[1] if len(parts) > 1 else '')
    elif text.startswith('/translate'):
        parts = text.split(maxsplit=1)
        handle_translate(api, msg, parts[1] if len(parts) > 1 else '')
    elif text.startswith('/audio'):
        handle_audio(api, msg)
    elif text.startswith('/help'):
        handle_help(api, msg)
    else:
        # If user types a single word, check dictionary
        if len(text.split()) == 1 and re.match(r'^[a-zA-Z]+$', text):
            handle_dict(api, msg, text)
        elif len(text.split()) > 1:
            # Offer translation
            handle_translate(api, msg, text)
        else:
            handle_help(api, msg)

# ---------------------------------------------------------------------------
# Main Long-Polling Loop
# ---------------------------------------------------------------------------
def main():
    token = get_bot_token()
    if not token:
        print("=" * 60)
        print("❌ TELEGRAM BOT TOKEN မတွေ့ရှိပါ!")
        print("=" * 60)
        print("Bot ကို စတင်ရန် အောက်ပါနည်းလမ်းများထဲမှ တစ်ခုကို အသုံးပြုနိုင်ပါသည်:")
        print("1) Environment variable: export TELEGRAM_BOT_TOKEN='your_bot_token_here'")
        print("2) Command line: python3 bot.py --token 'your_bot_token_here'")
        print("3) Config file: telegram_bot/config.json တွင် bot_token ထည့်သွင်းခြင်း")
        print("=" * 60)
        sys.exit(1)

    api = TelegramAPI(token)
    me = api.get_me()
    if not me.get('ok'):
        print(f"❌ Bot Token မှားယွင်းနေပါသည် သို့မဟုတ် ချိတ်ဆက်မရပါ: {me.get('description')}")
        sys.exit(1)

    bot_info = me['result']
    bot_username = bot_info.get('username')
    print("=" * 60)
    print(f"🤖 Htet Official Telegram Bot အောင်မြင်စွာ ချိတ်ဆက်ပြီးပါပြီ!")
    print(f"• Bot Name: {bot_info.get('first_name')}")
    print(f"• Username: @{bot_username}")
    print(f"• WebApp URL: {WEBAPP_URL}")
    print("=" * 60)

    # 1. Register commands with Telegram
    commands = [
        {"command": "start", "description": "မင်္ဂလာပါ နှုတ်ခွန်းဆက်နှင့် Mini App ဖွင့်ရန်"},
        {"command": "app", "description": "Htet Mini App မျက်နှာပြည့် ဖွင့်ရန်"},
        {"command": "translate", "description": "မြန်မာ ↔ အင်္ဂလိပ် စက်ဘာသာပြန်ဆိုရန်"},
        {"command": "dict", "description": "Ornagai အင်္ဂလိပ်-မြန်မာ အဘိဓာန် ရှာရန်"},
        {"command": "articles", "description": "နောက်ဆုံးထုတ်ဝေထားသော ဆောင်းပါးများ"},
        {"command": "suukyi", "description": "ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့နှင့် စာတမ်း"},
        {"command": "publications", "description": "သုတေသန စာတမ်းငယ်များနှင့် PDF များ"},
        {"command": "audio", "description": "နားဆင်နိုင်သော အသံသွင်းစာတမ်းများ"},
        {"command": "help", "description": "အသုံးပြုနည်း လမ်းညွှန်"}
    ]
    api.set_my_commands(commands)

    # 2. Set persistent Menu Button to launch Mini App
    menu_res = api.set_chat_menu_button(WEBAPP_URL)
    if menu_res.get('ok'):
        print("✅ Telegram Chat Menu Button အား Mini App သို့ ချိတ်ဆက်ပြီးပါပြီ။")

    # 3. Start Polling Loop
    print(f"🚀 Telegram Bot စတင် လည်ပတ်နေပါပြီ... (Press Ctrl+C to stop)")
    offset = None

    while True:
        try:
            updates = api.get_updates(offset=offset, timeout=25)
            if not updates.get('ok'):
                time.sleep(2)
                continue

            for item in updates.get('result', []):
                offset = item['update_id'] + 1

                if 'message' in item:
                    process_message(api, item['message'])
                elif 'inline_query' in item:
                    handle_inline_query(api, item['inline_query'])

        except KeyboardInterrupt:
            print("\n🛑 Telegram Bot ရပ်တန့်လိုက်ပါပြီ။")
            break
        except Exception as e:
            print(f"[Polling loop warning] {e}")
            time.sleep(3)

if __name__ == '__main__':
    main()
