#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Htet Official — Telegram Bot Engine & Mini App Gateway
A pure, zero-external-dependency Telegram Bot with:
  • Mini App WebApp Buttons & Persistent Menu Button (VPN-Free Vercel Node)
  • Full-Text Article & Publications Search (/search)
  • Ornagai En-My Dual Dictionary Lookup (/dict)
  • Universal Machine Translation (/translate)
  • Articles & Publications Catalog with Instant View links (/articles, /publications)
  • Daw Aung San Suu Kyi 81st Birthday Tribute & Freedom from Fear (/suukyi, /birthday)
  • Audio Voice Essays & Speech (/audio)
  • Mirror Status & VPN Network Guidance (/mirrors)
  • Ping & Node Health Diagnostics (/ping)
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

# Primary VPN-Free WebApp URL (Accessible across Myanmar without VPN)
DEFAULT_WEBAPP_URL = "https://htetofficialgithubio.vercel.app"
VERCEL_WEBAPP_URL = "https://htetofficialgithubio.vercel.app"
WORKERS_WEBAPP_URL = "https://web.htetofficial.workers.dev"
GITHUB_WEBAPP_URL = "https://htetofficial.github.io"

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
# Telegram Bot API Helper (Pure urllib, zero external pip dependencies)
# ---------------------------------------------------------------------------
class TelegramAPI:
    def __init__(self, token):
        self.token = token
        self.endpoint = f"{TELEGRAM_API_BASE}{token}/"

    def request(self, method, data=None):
        url = self.endpoint + method
        headers = {'User-Agent': 'HtetOfficialBot/2.0'}
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

    def set_chat_menu_button(self, webapp_url, text="📖 Htet Mini App (VPN မလို)"):
        data = {
            "menu_button": {
                "type": "web_app",
                "text": text,
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
# Persistent Reply Keyboard (Fast 1-Tap Access for Touch Devices)
# ---------------------------------------------------------------------------
def get_main_reply_keyboard():
    return {
        "keyboard": [
            [
                {
                    "text": "📖 Htet Mini App ဖွင့်ရန် (VPN မလို)",
                    "web_app": {"url": WEBAPP_URL}
                }
            ],
            [
                {"text": "📚 ဆောင်းပါးများ"},
                {"text": "📑 စာတမ်းငယ်များ"},
                {"text": "🔍 ဆောင်းပါးရှာရန်"}
            ],
            [
                {"text": "🌐 ဘာသာပြန်စတူဒီယို"},
                {"text": "📖 အဘိဓာန်"},
                {"text": "🕊️ ဒေါ်အောင်ဆန်းစုကြည်"}
            ],
            [
                {"text": "🆔 စာရေးသူအကြောင်း"},
                {"text": "🎙️ အသံစာတမ်းများ"},
                {"text": "🌐 Mirror လင့်ခ်များ"}
            ]
        ],
        "resize_keyboard": True,
        "is_persistent": True
    }

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

    def search_articles(self, query, limit=5):
        """Full-text search in articles and monographs across Burmese & English"""
        q = query.strip().lower()
        if not q:
            return []
        
        matches = []
        for a in self.articles:
            title_mm = (a.get('title', {}).get('mm', '') if isinstance(a.get('title'), dict) else a.get('title', '')).lower()
            title_en = (a.get('title', {}).get('en', '') if isinstance(a.get('title'), dict) else '').lower()
            desc_mm = (a.get('description', {}).get('mm', '') if isinstance(a.get('description'), dict) else a.get('description', '')).lower()
            desc_en = (a.get('description', {}).get('en', '') if isinstance(a.get('description'), dict) else '').lower()
            cat_mm = str(a.get('category_mm', '')).lower()
            cat_en = str(a.get('category_en', '')).lower()
            tags = " ".join(a.get('tags', []) if isinstance(a.get('tags'), list) else []).lower()

            score = 0
            if q in title_mm: score += 15
            if q in title_en: score += 12
            if q in desc_mm or q in desc_en: score += 7
            if q in cat_mm or q in cat_en: score += 5
            if q in tags: score += 4

            if score > 0:
                matches.append((score, a))

        matches.sort(key=lambda x: x[0], reverse=True)
        return [item[1] for item in matches[:limit]]

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
        f"🇲🇲 <b>မြန်မာနိုင်ငံတွင်းမှ မိတ်ဆွေများအတွက်:</b>\n"
        f"Telegram Mini App အား <b>VPN မလိုဘဲ တိုက်ရိုက်အသုံးပြုနိုင်သော Vercel Node</b> ဖြင့် ချိတ်ဆက်ထားပေးထားပါသဖြင့် "
        f"လွယ်ကူလျင်မြန်စွာ ဝင်ရောက်ဖတ်ရှုနိုင်ပါပြီရှင်။\n\n"
        f"📖 <b>အဓိကကဏ္ဍများ:</b>\n"
        f"• နိုင်ငံရေးဒဿနိကဗေဒ၊ အမျိုးသမီးဝါဒနှင့် သုတေသနဆောင်းပါးများ\n"
        f"• ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့နှင့် Freedom from Fear စာတမ်း\n"
        f"• စာလုံး ၁၂,၀၀၀+ အဘိဓာန်နှင့် မြန်မာ ↔ အင်္ဂလိပ် ဘာသာပြန်စတူဒီယို\n"
        f"• သုတေသီ မှတ်ပုံတင် (ORCID iD: <code>0009-0004-7908-2949</code>)"
    )

    inline_keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🚀 Htet Mini App ဖွင့်ရန် (VPN မလို Vercel)",
                    "web_app": {"url": WEBAPP_URL}
                }
            ],
            [
                {
                    "text": "⚡ Workers Edge Mini App",
                    "web_app": {"url": WORKERS_WEBAPP_URL}
                }
            ],
            [
                {
                    "text": "🌐 ဘာသာပြန်စတူဒီယို",
                    "web_app": {"url": f"{WEBAPP_URL}/translate.html"}
                },
                {
                    "text": "📚 အဘိဓာန်စတူဒီယို",
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
                    "text": "🌐 တရားဝင် Mirror လင့်ခ်များ (VPN လမ်းညွှန်)",
                    "callback_data": "menu_mirrors" if False else None,
                    "url": "https://htetofficialgithubio.vercel.app"
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

    # First send with Reply Keyboard to permanently dock at the bottom
    api.send_message(chat_id, welcome_text, reply_markup=inline_keyboard)
    
    # Prompt persistent keyboard hint
    hint_text = "💡 <i>အောက်ခြေရှိ အမြန်ခလုတ်များကို နှိပ်၍လည်း Mini App နှင့် ကဏ္ဍစုံသို့ ချက်ချင်း သွားရောက်နိုင်ပါသည်ရှင်။</i>"
    api.send_message(chat_id, hint_text, reply_markup=get_main_reply_keyboard())

def handle_app(api, msg):
    chat_id = msg['chat']['id']
    text = (
        "🚀 <b>Htet Official Telegram Mini App</b>\n\n"
        "မြန်မာနိုင်ငံတွင်းမှ မိတ်ဆွေများအတွက် VPN မလိုဘဲ တိုက်ရိုက်ဖွင့်နိုင်သော "
        "<b>Vercel Edge Node</b> အား အဓိကထား ချိတ်ဆက်ထားပေးပါသည်ရှင်။\n\n"
        "ဝက်ဘ်ဆိုက်တစ်ခုလုံးကို Telegram ထဲမှ ထွက်စရာမလိုဘဲ အပြည့်အဝ အသုံးပြုနိုင်ရန် "
        "အောက်ပါခလုတ်များထဲမှ မိမိနှစ်သက်ရာ Node ကို နှိပ်၍ ဖွင့်လှစ်နိုင်ပါသည်ရှင်။"
    )
    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🚀 Mini App မျက်နှာပြည့် ဖွင့်မည် (VPN မလို Vercel)",
                    "web_app": {"url": WEBAPP_URL}
                }
            ],
            [
                {
                    "text": "⚡ Cloudflare Workers Edge Node",
                    "web_app": {"url": WORKERS_WEBAPP_URL}
                }
            ],
            [
                {
                    "text": "🌐 ဘာသာပြန်စတူဒီယို",
                    "web_app": {"url": f"{WEBAPP_URL}/translate.html"}
                },
                {
                    "text": "📚 အဘိဓာန်နှင့် NLP",
                    "web_app": {"url": f"{WEBAPP_URL}/dictionary.html"}
                }
            ],
            [
                {
                    "text": "📑 သုတေသန စာတမ်း ၄၂ စောင်လုံး",
                    "web_app": {"url": f"{WEBAPP_URL}/publications.html"}
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
        "ဂုဏ်ပြုလွှာနှင့် သမိုင်းဝင် Freedom from Fear စာတမ်းအား အင်္ဂလိပ်/မြန်မာ အသံဖိုင်နှင့်တကွ ဖတ်ရှုနားဆင်နိုင်ပါသည်ရှင်။"
    )

    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🎂 ၈၁ နှစ်ပြည့် မွေးနေ့ဂုဏ်ပြုလွှာ ဖတ်ရန် (VPN မလို)",
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
                    "text": "📑 ဆောင်းပါးများအားလုံး ကြည့်မည် (Mini App - VPN မလို)",
                    "web_app": {"url": f"{WEBAPP_URL}/articles.html"}
                }
            ]
        ]
    }
    api.send_message(chat_id, text, reply_markup=keyboard)

def handle_search(api, msg, query):
    chat_id = msg['chat']['id']
    query = query.strip()
    if not query:
        api.send_message(
            chat_id,
            "🔍 <b>ဆောင်းပါး ရှာဖွေနည်း:</b>\n\n"
            "<code>/search &lt;စကားလုံး သို့မဟုတ် ခေါင်းစဉ်&gt;</code> ဟု ရိုက်ထည့်ပါရှင်။\n"
            "ဥပမာ: <code>/search ဖီမင်နစ်</code> သို့မဟုတ် <code>/search suu kyi</code>"
        )
        return

    results = repo.search_articles(query, limit=5)
    if not results:
        api.send_message(
            chat_id,
            f"🔍 <b>'{query}'</b> နှင့် ကိုက်ညီသော ဆောင်းပါး မတွေ့ရှိပါရှင်။\n\n"
            f"💡 <i>Tip: အင်္ဂလိပ်စာလုံး ဖြစ်ပါက <code>/dict {query}</code> ဖြင့် အဘိဓာန် ရှာနိုင်သလို "
            f"<code>/translate {query}</code> ဖြင့်လည်း ဘာသာပြန်နိုင်ပါသည်ရှင်။</i>"
        )
        return

    text = f"🔍 <b>'{query}' အတွက် ရှာဖွေတွေ့ရှိသော ဆောင်းပါးများ ({len(results)} စောင်):</b>\n\n"
    buttons = []

    for i, a in enumerate(results, 1):
        title = a.get('title', {}).get('mm', a.get('title', 'ဆောင်းပါး')) if isinstance(a.get('title'), dict) else a.get('title', 'ဆောင်းပါး')
        aid = a.get('id', '')
        cat = a.get('category_mm', '')
        text += f"<b>{i}။ {title}</b>\n"
        if cat:
            text += f"🏷️ <i>{cat}</i>\n"
        text += f"🔗 <a href='{WEBAPP_URL}/article.html?id={aid}'>ဖတ်ရှုရန် (Mini App)</a>\n\n"
        buttons.append([{
            "text": f"📖 {title[:28]}...",
            "web_app": {"url": f"{WEBAPP_URL}/article.html?id={aid}"}
        }])

    buttons.append([{
        "text": "📚 ဆောင်းပါးအားလုံး ကြည့်မည် (Mini App)",
        "web_app": {"url": f"{WEBAPP_URL}/articles.html"}
    }])

    api.send_message(chat_id, text, reply_markup={"inline_keyboard": buttons})

def handle_about(api, msg):
    chat_id = msg['chat']['id']
    text = (
        "🌸 <b>စာရေးသူနှင့် သုတေသီ ထက် (Htet Myat Ekri) အကြောင်း</b>\n\n"
        "• <b>အမည်:</b> ထက်မြတ်ဧကရီ (Htet Myat Ekri)\n"
        "• <b>နယ်ပယ်:</b> နိုင်ငံရေးဒဿနိကဗေဒ၊ ဖီမင်နစ်နှင့် လူမှုလွတ်မြောက်ရေး လှုပ်ရှားမှု\n"
        "• <b>ဖော်ထုတ်ထားသော ဝါဒ:</b> Commufemocratism (ကွန်မြူဖီမိုကရက်တစ်ဝါဒ)\n"
        "• <b>ဂုဏ်ပြုမှတ်တမ်း:</b> မြန်မာ့နွေဦးတက္ကသိုလ် (MNOU) ၃ နှစ်ပြည့် နှစ်လည်မဂ္ဂဇင်း ရွေးချယ်ခံဆောင်းပါးနှင့် ဂုဏ်ပြုဆု (၂၀၂၅)\n"
        "• <b>တည်ထောင်မှုများ:</b> Women Nation, IdeaHub Public Digital Library (၁,၅၂၂+ အုပ်)\n\n"
        "🆔 <b>နိုင်ငံတကာ သုတေသီ မှတ်ပုံတင် (ORCID iD):</b>\n"
        "🔗 <a href='https://orcid.org/0009-0004-7908-2949'>0009-0004-7908-2949</a>"
    )
    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🆔 ORCID Profile ဖွင့်ရန် ↗",
                    "url": "https://orcid.org/0009-0004-7908-2949"
                },
                {
                    "text": "📖 အပြည့်အစုံ ဖတ်ရှုရန် (Mini App)",
                    "web_app": {"url": f"{WEBAPP_URL}/about.html"}
                }
            ],
            [
                {
                    "text": "📥 Official CV (PDF ဒေါင်းလုဒ်)",
                    "url": f"{WEBAPP_URL}/downloads/Htet_Myat_Ekri_Curriculum_Vitae.pdf"
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
                    "text": "📚 စာတမ်း ၄၂ စောင်လုံး ကြည့်မည် (Mini App - VPN မလို)",
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
                    "text": "🔍 အဘိဓာန်စတူဒီယိုတွင် ဖွင့်ကြည့်မည် (VPN မလို)",
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
                    "text": "🌐 မျက်နှာပြည့် ဘာသာပြန်စတူဒီယို ဖွင့်မည် (VPN မလို)",
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
                    "text": "🎧 Freedom from Fear အသံဖိုင် နားဆင်ရန် (VPN မလို)",
                    "web_app": {"url": f"{WEBAPP_URL}/article.html?id=aung-san-suu-kyi-freedom-from-fear-1990-mm"}
                }
            ],
            [
                {
                    "text": "🎂 မွေးနေ့ဆုတောင်းလွှာ အသံဖိုင် နားဆင်ရန် (VPN မလို)",
                    "web_app": {"url": f"{WEBAPP_URL}/article.html?id=daw-aung-san-suu-kyi-81st-birthday-tribute"}
                }
            ]
        ]
    }
    api.send_message(chat_id, text, reply_markup=keyboard)

def handle_mirrors(api, msg):
    chat_id = msg['chat']['id']
    text = (
        "🌐 <b>Htet Official — တရားဝင် ဝက်ဘ်ဆိုက်နှင့် Mirror လင့်ခ်များ</b>\n\n"
        "မြန်မာနိုင်ငံတွင်းမှ စာဖတ်သူများ အဆင်ပြေချောမွေ့စွာ ဝင်ရောက်ဖတ်ရှုနိုင်ရန် Mirror အများအပြားဖြင့် လွှင့်တင်ထားပါသည်ရှင်။\n\n"
        "🟢 <b>၁။ Vercel Mirror (VPN မလို — အထူးအကြံပြု)</b>\n"
        "👉 https://htetofficialgithubio.vercel.app\n"
        "<i>(မြန်မာနိုင်ငံတွင်းမှ VPN မလိုဘဲ တိုက်ရိုက် ဝင်ရောက်ဖတ်ရှုနိုင်ပါသည်)</i>\n\n"
        "⚡ <b>၂။ Cloudflare Workers Edge (Web & App)</b>\n"
        "👉 https://web.htetofficial.workers.dev\n"
        "👉 https://app.htetofficial.workers.dev\n"
        "<i>(ကမ္ဘာတစ်ဝှမ်း Edge CDN မြန်နှုန်းမြင့် Node)</i>\n\n"
        "🐙 <b>၃။ GitHub Pages (မူရင်း Platform)</b>\n"
        "👉 https://htetofficial.github.io\n\n"
        "━━━━━━━━━━━━━━━━━━━━━\n"
        "🛡️ <b>ဒီဂျစ်တယ် လုံခြုံရေး အကြံပြုချက်:</b>\n"
        "Vercel လင့်ခ်သည် မြန်မာနိုင်ငံတွင်းမှ VPN မလိုဘဲ ဝင်ရောက်နိုင်သော်လည်း၊ "
        "မိမိတို့၏ ကိုယ်ရေးကိုယ်တာလုံခြုံရေး (Privacy & Digital Safety) အတွက် "
        "<b>မည်သည့်လင့်ခ်ကိုမဆို VPN ချိတ်ဆက်၍ ဝင်ရောက်ဖတ်ရှုရန်</b> အလေးအနက် အကြံပြုအပ်ပါသည်။"
    )

    keyboard = {
        "inline_keyboard": [
            [
                {
                    "text": "🟢 Vercel Mini App (VPN မလို)",
                    "web_app": {"url": VERCEL_WEBAPP_URL}
                },
                {
                    "text": "⚡ Workers Mini App",
                    "web_app": {"url": WORKERS_WEBAPP_URL}
                }
            ],
            [
                {
                    "text": "🟢 Vercel Browser ဖြင့် ဖွင့်ရန် ↗",
                    "url": VERCEL_WEBAPP_URL
                },
                {
                    "text": "🐙 GitHub Pages ↗",
                    "url": GITHUB_WEBAPP_URL
                }
            ]
        ]
    }
    api.send_message(chat_id, text, reply_markup=keyboard)

def handle_ping(api, msg):
    chat_id = msg['chat']['id']
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    text = (
        f"⚡ <b>Htet Official Bot — Node Diagnostics</b>\n\n"
        f"• <b>Status:</b> 🟢 Operational (Online)\n"
        f"• <b>Active WebApp Node:</b> 🇲🇲 Vercel Edge (VPN-Free)\n"
        f"• <b>WebApp URL:</b> <code>{WEBAPP_URL}</code>\n"
        f"• <b>Articles Loaded:</b> {len(repo.articles)} စောင်\n"
        f"• <b>Publications:</b> {len(repo.publications)} စောင်\n"
        f"• <b>Translations Corpus:</b> {len(repo.translation_pairs):,} pairs\n"
        f"• <b>Timestamp:</b> <i>{now}</i>"
    )
    keyboard = {
        "inline_keyboard": [
            [{"text": "📖 Mini App စမ်းသပ်ဖွင့်မည်", "web_app": {"url": WEBAPP_URL}}]
        ]
    }
    api.send_message(chat_id, text, reply_markup=keyboard)

def handle_help(api, msg):
    chat_id = msg['chat']['id']
    text = (
        "📖 <b>Htet Official Bot — အသုံးပြုနိုင်သော Commands များ</b>\n\n"
        "• <code>/start</code> - နှုတ်ခွန်းဆက်နှင့် Mini App ဖွင့်ရန် (VPN မလို)\n"
        "• <code>/app</code> - Telegram Mini App မျက်နှာပြည့် ဖွင့်ရန်\n"
        "• <code>/search &lt;query&gt;</code> - သုတေသန ဆောင်းပါးများ ရှာဖွေရန်\n"
        "• <code>/dict &lt;word&gt;</code> - အင်္ဂလိပ်-မြန်မာ အဘိဓာန် ရှာဖွေရန်\n"
        "• <code>/translate &lt;text&gt;</code> - မြန်မာ ↔ အင်္ဂလိပ် စက်ဘာသာပြန်ဆိုရန်\n"
        "• <code>/articles</code> - နောက်ဆုံးထုတ်ဝေထားသော ဆောင်းပါးများ\n"
        "• <code>/publications</code> - သုတေသန စာတမ်းငယ်များနှင့် PDF များ\n"
        "• <code>/suukyi</code> - ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့နှင့် Freedom from Fear စာတမ်း\n"
        "• <code>/audio</code> - နားဆင်နိုင်သော အသံသွင်းစာတမ်းများ\n"
        "• <code>/about</code> - စာရေးသူ အကြောင်းနှင့် ORCID သုတေသီ မှတ်ပုံတင်\n"
        "• <code>/mirrors</code> - တရားဝင် Mirror လင့်ခ်များနှင့် VPN အကြံပြုချက်\n"
        "• <code>/ping</code> - Bot နှင့် Server အခြေအနေ စစ်ဆေးရန်\n"
        "• <code>/help</code> - ဤလမ်းညွှန်ကို ပြန်လည်ပြသရန်\n\n"
        "💡 <i>Tip: စကားလုံးတစ်လုံးတည်း ရိုက်ထည့်ပါက အဘိဓာန် ရှာပေးပြီး၊ ဝါကျရှည် ရိုက်ထည့်ပါက ဆောင်းပါးရှာဖွေခြင်း သို့မဟုတ် ဘာသာပြန်ခြင်းကို အလိုအလျောက် ဆောင်ရွက်ပေးပါသည်ရှင်။</i>"
    )
    api.send_message(chat_id, text, reply_markup=get_main_reply_keyboard())

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
            'title': '📖 Htet Official Mini App (VPN မလို)',
            'description': 'မြန်မာနိုင်ငံတွင်းမှ VPN မလိုဘဲ ဝက်ဘ်ဆိုက်နှင့် စာဖတ်ခန်း ဖွင့်မည်',
            'input_message_content': {
                'message_text': f"📖 <b>Htet Official Telegram Mini App</b>\n\nနိုင်ငံရေးဒဿနိကဗေဒနှင့် သုတေသန စာဖတ်ခန်းကို အောက်ပါလင့်ခ်ဖြင့် ဝင်ရောက်နိုင်ပါသည်ရှင်။ (VPN မလိုပါ)\n{WEBAPP_URL}",
                'parse_mode': 'HTML'
            },
            'reply_markup': {
                'inline_keyboard': [[{'text': '🚀 Mini App ဖွင့်ရန် (VPN မလို)', 'web_app': {'url': WEBAPP_URL}}]]
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
                    [{'text': '📖 စာတမ်းဖတ်ရန် (Mini App)', 'web_app': {'url': f"{WEBAPP_URL}/article.html?id=aung-san-suu-kyi-freedom-from-fear-1990-mm"}}]
                ]
            }
        })
        results.append({
            'type': 'article',
            'id': 'default-about',
            'title': '🆔 စာရေးသူ ထက် (Htet Myat Ekri) & ORCID',
            'description': 'ORCID iD: 0009-0004-7908-2949 | Commufemocratism',
            'input_message_content': {
                'message_text': (
                    "🌸 <b>စာရေးသူနှင့် သုတေသီ ထက် (Htet Myat Ekri)</b>\n\n"
                    "• <b>နယ်ပယ်:</b> နိုင်ငံရေးဒဿနိကဗေဒနှင့် ဖီမင်နစ်သုတေသန\n"
                    "• <b>ORCID iD:</b> <code>0009-0004-7908-2949</code>\n\n"
                    f"🔗 <a href='{WEBAPP_URL}/about.html'>ကိုယ်ရေးအကျဉ်း ဖတ်ရှုရန်</a>"
                ),
                'parse_mode': 'HTML'
            },
            'reply_markup': {
                'inline_keyboard': [
                    [{'text': '🆔 ORCID Profile ↗', 'url': 'https://orcid.org/0009-0004-7908-2949'}],
                    [{'text': '📖 အပြည့်အစုံ ဖတ်ရန် (Mini App)', 'web_app': {'url': f"{WEBAPP_URL}/about.html"}}]
                ]
            }
        })
    else:
        # 1. Search Articles
        matched_articles = repo.search_articles(query, limit=3)
        for art in matched_articles:
            title = art.get('title', {}).get('mm', art.get('title', 'ဆောင်းပါး')) if isinstance(art.get('title'), dict) else art.get('title', 'ဆောင်းပါး')
            aid = art.get('id', '')
            desc = art.get('description', {}).get('mm', '') if isinstance(art.get('description'), dict) else art.get('description', '')
            results.append({
                'type': 'article',
                'id': f'art-{aid}',
                'title': f'📄 {title}',
                'description': desc[:120],
                'input_message_content': {
                    'message_text': f"📄 <b>{title}</b>\n\n{desc[:250]}...\n\n🔗 <a href='{WEBAPP_URL}/article.html?id={aid}'>Mini App ဖြင့် ဖတ်ရှုရန်</a>",
                    'parse_mode': 'HTML'
                },
                'reply_markup': {
                    'inline_keyboard': [
                        [{'text': '📖 စာမူဖတ်ရှုရန် (Mini App)', 'web_app': {'url': f"{WEBAPP_URL}/article.html?id={aid}"}}]
                    ]
                }
            })

        # 2. Check dictionary if single word
        if len(query.split()) == 1 and re.match(r'^[a-zA-Z]+$', query):
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
                            [{'text': '🔍 အဘိဓာန်တွင် ကြည့်မည် (VPN မလို)', 'web_app': {'url': f"{WEBAPP_URL}/dictionary.html?q={urllib.parse.quote(query)}"}}]
                        ]
                    }
                })

        # 3. Check translation
        src = 'my' if re.search(r'[က-႟]', query) else 'en'
        tgt = 'en' if src == 'my' else 'my'
        trans = online_translate(query, src, tgt)
        if trans:
            results.append({
                'type': 'article',
                'id': f'trans-{query[:20]}',
                'title': f'🌐 ဘာသာပြန်: {trans}',
                'description': f'မူရင်း: {query}',
                'input_message_content': {
                    'message_text': f"🌐 <b>ဘာသာပြန်ဆိုချက်:</b>\n\n<b>မူရင်း:</b> {query}\n<b>ဘာသာပြန်:</b> <b>{trans}</b>",
                    'parse_mode': 'HTML'
                },
                'reply_markup': {
                    'inline_keyboard': [
                        [{'text': '🌐 ဘာသာပြန်စတူဒီယို ဖွင့်မည် (VPN မလို)', 'web_app': {'url': f"{WEBAPP_URL}/translate.html"}}]
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

    # Check Reply Keyboard taps
    if text == "📖 Htet Mini App ဖွင့်ရန် (VPN မလို)":
        handle_app(api, msg)
        return
    elif text in ("📚 ဆောင်းပါးများ", "/articles"):
        handle_articles(api, msg)
        return
    elif text in ("📑 စာတမ်းငယ်များ", "/publications"):
        handle_publications(api, msg)
        return
    elif text in ("🔍 ဆောင်းပါးရှာရန်", "🔍 ရှာဖွေရန်"):
        handle_search(api, msg, '')
        return
    elif text in ("🌐 ဘာသာပြန်စတူဒီယို", "🌐 ဘာသာပြန်"):
        api.send_message(
            msg['chat']['id'],
            "🌐 <b>ဘာသာပြန် စတူဒီယို:</b>\n\n<code>/translate &lt;စာသား&gt;</code> ဟု ရိုက်ထည့်ပါရှင်။\nဥပမာ: <code>/translate Freedom and democracy</code>",
            reply_markup={
                "inline_keyboard": [
                    [{"text": "🌐 ဘာသာပြန်စတူဒီယို မျက်နှာပြည့် ဖွင့်မည် (VPN မလို)", "web_app": {"url": f"{WEBAPP_URL}/translate.html"}}]
                ]
            }
        )
        return
    elif text in ("📖 အဘိဓာန်", "/dict"):
        api.send_message(
            msg['chat']['id'],
            "📖 <b>အဘိဓာန် ရှာဖွေရန်:</b>\n\n<code>/dict &lt;English Word&gt;</code> ဟု ရိုက်ထည့်ပါရှင်။\nဥပမာ: <code>/dict autonomy</code>",
            reply_markup={
                "inline_keyboard": [
                    [{"text": "📚 အဘိဓာန်စတူဒီယို ဖွင့်မည် (VPN မလို)", "web_app": {"url": f"{WEBAPP_URL}/dictionary.html"}}]
                ]
            }
        )
        return
    elif text in ("🕊️ ဒေါ်အောင်ဆန်းစုကြည်", "/suukyi", "/birthday"):
        handle_suukyi(api, msg)
        return
    elif text in ("🆔 စာရေးသူအကြောင်း", "/about", "/author", "/bio", "/orcid"):
        handle_about(api, msg)
        return
    elif text in ("🎙️ အသံစာတမ်းများ", "/audio"):
        handle_audio(api, msg)
        return
    elif text in ("🌐 Mirror လင့်ခ်များ", "/mirrors", "/mirror", "/links", "/vpn"):
        handle_mirrors(api, msg)
        return

    # Commands
    if text.startswith('/start'):
        handle_start(api, msg)
    elif text.startswith('/app') or text.startswith('/mini'):
        handle_app(api, msg)
    elif text.startswith('/search') or text.startswith('/find'):
        parts = text.split(maxsplit=1)
        handle_search(api, msg, parts[1] if len(parts) > 1 else '')
    elif text.startswith('/about') or text.startswith('/author') or text.startswith('/bio') or text.startswith('/orcid'):
        handle_about(api, msg)
    elif text.startswith('/mirrors') or text.startswith('/mirror') or text.startswith('/links') or text.startswith('/vpn'):
        handle_mirrors(api, msg)
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
    elif text.startswith('/ping') or text.startswith('/status'):
        handle_ping(api, msg)
    elif text.startswith('/help'):
        handle_help(api, msg)
    else:
        # Smart routing:
        # 1. If user typed single English word -> lookup dictionary
        if len(text.split()) == 1 and re.match(r'^[a-zA-Z]+$', text):
            handle_dict(api, msg, text)
        # 2. If user typed a search phrase in Burmese -> try searching articles first
        elif re.search(r'[က-႟]', text):
            matched = repo.search_articles(text, limit=3)
            if matched:
                handle_search(api, msg, text)
            else:
                handle_translate(api, msg, text)
        # 3. If user typed multi-word English phrase -> translate
        elif len(text.split()) > 1:
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
    print(f"• WebApp URL (VPN မလို Vercel): {WEBAPP_URL}")
    print("=" * 60)

    # 1. Register commands with Telegram
    commands = [
        {"command": "start", "description": "နှုတ်ခွန်းဆက်နှင့် Mini App ဖွင့်ရန် (VPN မလို)"},
        {"command": "app", "description": "Htet Mini App မျက်နှာပြည့် ဖွင့်ရန်"},
        {"command": "search", "description": "သုတေသန ဆောင်းပါးများ ရှာဖွေရန်"},
        {"command": "about", "description": "စာရေးသူ အကြောင်းနှင့် ORCID သုတေသီ မှတ်ပုံတင်"},
        {"command": "mirrors", "description": "တရားဝင် Mirror လင့်ခ်များနှင့် VPN အကြံပြုချက်"},
        {"command": "translate", "description": "မြန်မာ ↔ အင်္ဂလိပ် စက်ဘာသာပြန်ဆိုရန်"},
        {"command": "dict", "description": "Ornagai အင်္ဂလိပ်-မြန်မာ အဘိဓာန် ရှာရန်"},
        {"command": "articles", "description": "နောက်ဆုံးထုတ်ဝေထားသော ဆောင်းပါးများ"},
        {"command": "suukyi", "description": "ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့နှင့် စာတမ်း"},
        {"command": "publications", "description": "သုတေသန စာတမ်းငယ်များနှင့် PDF များ"},
        {"command": "audio", "description": "နားဆင်နိုင်သော အသံသွင်းစာတမ်းများ"},
        {"command": "ping", "description": "Node နှင့် Server အခြေအနေ စစ်ဆေးရန်"},
        {"command": "help", "description": "အသုံးပြုနည်း လမ်းညွှန်"}
    ]
    api.set_my_commands(commands)

    # 2. Set persistent Menu Button to launch VPN-free Vercel Mini App
    menu_res = api.set_chat_menu_button(WEBAPP_URL, "📖 Htet Mini App (VPN မလို)")
    if menu_res.get('ok'):
        print("✅ Telegram Chat Menu Button အား Mini App (VPN မလို Vercel) သို့ ချိတ်ဆက်ပြီးပါပြီ။")

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
