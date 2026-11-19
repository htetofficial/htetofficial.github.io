# Htet Official — Telegram Bot & Telegram Mini App (TMA) Suite

ဤ Directory သည် **ထက် (Htet)** ၏ တရားဝင် ဝက်ဘ်ဆိုက်တစ်ခုလုံးကို **Telegram Mini App (TMA)** အဖြစ် ပြောင်းလဲပေးနိုင်သော စနစ်၊ **Telegram Instant View (IV)** စနစ်နှင့် **Telegram Bot Engine** တို့အတွက် ပြီးပြည့်စုံသော စနစ်တွဲ ဖြစ်ပါသည်။

> [!TIP]
> **VPN မလိုဘဲ အသုံးပြုနိုင်သော Vercel Edge Node** ဖြင့် အဓိက ချိတ်ဆက်ထားသဖြင့် မြန်မာနိုင်ငံတွင်းမှ မိတ်ဆွေများ အဆင်ပြေချောမွေ့စွာ ဝင်ရောက်နိုင်ပါသည်။

---

## ၁။ ပါဝင်သော စနစ်များ (System Overview)

| ဖိုင်အမည် | ဖော်ပြချက် |
| :--- | :--- |
| `bot.py` | Python Standard Library ဖြင့် ရေးသားထားသော Zero-Dependency Telegram Bot (Local / VPS Polling + VPN-Free Node) |
| `cloudflare-worker.js` | Cloudflare Workers ပေါ်တွင် အခမဲ့ (Free 24/7) အမြဲ Run ထားနိုင်သော Serverless Webhook Bot |
| `set_webhook.py` | Telegram Webhook စစ်ဆေးခြင်း၊ ချိတ်ဆက်ခြင်းနှင့် ဖြုတ်ခြင်း ပြုလုပ်ပေးသော Script |
| `config.json` | Bot Token နှင့် WebApp URL များ ချိတ်ဆက်မှု configuration ဖိုင် |
| `../js/telegram-webapp.js` | ဝက်ဘ်ဆိုက်တစ်ခုလုံးကို Telegram Mini App အဖြစ် ချိတ်ဆက်ပေးသော Core Engine (Theme Sync, Native BackButton, SettingsButton, VerticalSwipesControl, Haptics, CloudStorage) |
| `../telegram-instant-view-rules.txt` | Telegram Instant View 2.1 XPath တရားဝင် စည်းမျဉ်းများ (အင်တာနက်မလိုဘဲ တိုက်ရိုက်ဖတ်နိုင်သော စနစ်) |

---

## ၂။ အဓိက စွမ်းဆောင်ရည်သစ်များနှင့် အဆင့်မြှင့်တင်မှုများ

1. **VPN မလို Vercel Edge ချိတ်ဆက်မှု:**
   Telegram Mini App အား `https://htetofficialgithubio.vercel.app` ဖြင့် ချိတ်ဆက်ထားသဖြင့် မြန်မာနိုင်ငံတွင်းမှ VPN မလိုဘဲ ၁ ချက်နှိပ်ရုံဖြင့် တိုက်ရိုက် ဖွင့်လှစ်နိုင်ခြင်း။
2. **Persistent Menu Button:**
   Telegram Chat ၏ ဘယ်ဘက်အောက်ထောင့်တွင် `📖 Htet Mini App (VPN မလို)` အမြဲတမ်း ပေါ်နေစေရန် Bot Engine မှ အလိုအလျောက် သတ်မှတ်ပေးခြင်း။
3. **1-Tap Quick Action Keyboard:**
   ဖုန်းဖြင့် အသုံးပြုသူများအတွက် command ရိုက်စရာမလိုဘဲ အောက်ခြေ keyboard မှတစ်ဆင့် Mini App, ဆောင်းပါးများ, အဘိဓာန်, ဘာသာပြန်, ဒေါ်အောင်ဆန်းစုကြည်စာတမ်း တို့ကို ချက်ချင်း ရွေးချယ်နိုင်ခြင်း။
4. **Full-Text Article Search (`/search`):**
   မြန်မာ/အင်္ဂလိပ် ခေါင်းစဉ်နှင့် စာသားများအလိုက် ဆောင်းပါး ၄၀+ ထဲမှ ရှာဖွေနိုင်ခြင်း။
5. **Anti-Dismissal Scroll Control (`disableVerticalSwipes`):**
   ဆောင်းပါးရှည်များ ဖတ်ရှုရာတွင် လက်ချော်၍ အောက်သို့ဆွဲချမိပါက Mini App ပိတ်မသွားစေရန် တားဆီးပေးခြင်း။
6. **Native SettingsButton & CloudStorage:**
   Telegram Header ရှိ Settings ခလုတ်ဖြင့် စာဖတ်/Theme ရွေးချယ်မှု စနစ်ကို ဖွင့်နိုင်ပြီး Telegram Cloud ပေါ်တွင် မှတ်သားနိုင်ခြင်း။

---

## ၃။ Bot Commands များ စာရင်း

```text
start - နှုတ်ခွန်းဆက်နှင့် Mini App ဖွင့်ရန် (VPN မလို)
app - Htet Mini App မျက်နှာပြည့် ဖွင့်ရန်
search - သုတေသန ဆောင်းပါးများ ရှာဖွေရန်
about - စာရေးသူ အကြောင်းနှင့် ORCID သုတေသီ မှတ်ပုံတင်
mirrors - တရားဝင် Mirror လင့်ခ်များနှင့် VPN အကြံပြုချက်
translate - မြန်မာ ↔ အင်္ဂလိပ် စက်ဘာသာပြန်ဆိုရန်
dict - Ornagai အင်္ဂလိပ်-မြန်မာ အဘိဓာန် ရှာရန်
articles - နောက်ဆုံးထုတ်ဝေထားသော ဆောင်းပါးများ
suukyi - ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့နှင့် စာတမ်း
publications - သုတေသန စာတမ်းငယ်များနှင့် PDF များ
audio - နားဆင်နိုင်သော အသံသွင်းစာတမ်းများ
ping - Node နှင့် Server အခြေအနေ စစ်ဆေးရန်
help - အသုံးပြုနည်း လမ်းညွှန်
```

---

## ၄။ Python Bot ကို Run နည်း

မည်သည့် External Library (pip) မှ သွင်းရန်မလိုဘဲ Python 3 ဖြင့် ချက်ချင်း Run နိုင်ပါသည်:

```bash
# telegram_bot/config.json တွင် bot_token ထည့်ပြီးနောက်:
python3 telegram_bot/bot.py
```
