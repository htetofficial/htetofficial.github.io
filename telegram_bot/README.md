# Htet Official — Telegram Bot & Telegram Mini App (TMA) Suite

ဤ Directory သည် **ထက် (Htet)** ၏ တရားဝင် ဝက်ဘ်ဆိုက်တစ်ခုလုံးကို **Telegram Mini App (TMA)** အဖြစ် ပြောင်းလဲပေးနိုင်သော စနစ်၊ **Telegram Instant View (IV)** စနစ်နှင့် **Telegram Bot Engine** တို့အတွက် ပြီးပြည့်စုံသော စနစ်တွဲ ဖြစ်ပါသည်။

---

## ၁။ ပါဝင်သော စနစ်များ (System Overview)

| ဖိုင်အမည် | ဖော်ပြချက် |
| :--- | :--- |
| `bot.py` | Python Standard Library ဖြင့် ရေးသားထားသော Zero-Dependency Telegram Bot (Local / VPS Polling) |
| `cloudflare-worker.js` | Cloudflare Workers ပေါ်တွင် အခမဲ့ (Free 24/7) အမြဲ Run ထားနိုင်သော Serverless Webhook Bot |
| `set_webhook.py` | Telegram Webhook စစ်ဆေးခြင်း၊ ချိတ်ဆက်ခြင်းနှင့် ဖြုတ်ခြင်း ပြုလုပ်ပေးသော Script |
| `config.json.example` | Bot Configuration နမူနာဖိုင် |
| `../js/telegram-webapp.js` | ဝက်ဘ်ဆိုက်တစ်ခုလုံးကို Telegram Mini App အဖြစ် ချိတ်ဆက်ပေးသော Core Engine (Theme Sync, Native BackButton, MainButton, Haptics) |
| `../telegram-instant-view-rules.txt` | Telegram Instant View 2.1 XPath တရားဝင် စည်းမျဉ်းများ (အင်တာနက်မလိုဘဲ တိုက်ရိုက်ဖတ်နိုင်သော စနစ်) |

---

## ၂။ Telegram Bot အသစ် ဖန်တီးခြင်း (BotFather Setup)

### အဆင့် (၁) - Bot Token ရယူခြင်း
1. Telegram တွင် [@BotFather](https://t.me/BotFather) သို့ သွားပါ။
2. `/newbot` ဟု ရိုက်ပို့ပါ။
3. Bot အမည် (ဥပမာ: `Htet Official Bot`) ပေးပါ။
4. Bot Username (ဥပမာ: `HtetOfficialBot` သို့မဟုတ် `HtetReaderBot`) ပေးပါ။
5. BotFather မှ ပေးပို့လာသော **HTTP API Token** (ဥပမာ: `7123456789:AAH...`) ကို ကူးယူထားပါ။

---

### အဆင့် (၂) - Telegram Mini App ခလုတ် သတ်မှတ်ခြင်း (Menu Button)
အသုံးပြုသူများသည် Bot ၏ Chat ထဲသို့ ဝင်လိုက်သည်နှင့် ဘယ်ဘက်အောက်ထောင့်တွင် Mini App ဖွင့်ရန် ခလုတ်ကို အမြဲမြင်တွေ့နေရစေရန်:
1. `@BotFather` ထံ `/setmenubutton` ဟု ရိုက်ပို့ပါ။
2. မိမိ Bot ကို ရွေးချယ်ပါ။
3. Menu Button URL အဖြစ် `https://htetofficial.github.io` ကို ထည့်ပါ။
4. ခလုတ်အမည်အဖြစ် `📖 Htet Mini App` ဟု သတ်မှတ်ပါ။

*(မှတ်ချက် - `bot.py` ကို စတင် Run လိုက်သည်နှင့် ဤ Menu Button ကို API မှတစ်ဆင့် အလိုအလျောက် သတ်မှတ်ပေးပါသည်)*

---

### အဆင့် (၃) - Bot Commands များ စာရင်းသွင်းခြင်း
`@BotFather` ထံ `/setcommands` ပို့ပြီး အောက်ပါစာရင်းကို Copy ကူး၍ ပို့ပါ:
```text
start - မင်္ဂလာပါ နှုတ်ခွန်းဆက်နှင့် Mini App ဖွင့်ရန်
app - Htet Mini App မျက်နှာပြည့် ဖွင့်ရန်
translate - မြန်မာ ↔ အင်္ဂလိပ် စက်ဘာသာပြန်ဆိုရန်
dict - Ornagai အင်္ဂလိပ်-မြန်မာ အဘိဓာန် ရှာရန်
articles - နောက်ဆုံးထုတ်ဝေထားသော ဆောင်းပါးများ
suukyi - ဒေါ်အောင်ဆန်းစုကြည် ၈၁ နှစ်ပြည့် မွေးနေ့နှင့် Freedom from Fear စာတမ်း
publications - သုတေသန စာတမ်းငယ်များနှင့် PDF များ
audio - နားဆင်နိုင်သော အသံသွင်းစာတမ်းများ
help - အသုံးပြုနည်း လမ်းညွှန်
```

---

## ၃။ Python Bot ကို မိမိစက် သို့မဟုတ် VPS တွင် Run နည်း

မည်သည့် External Library (pip) မှ သွင်းရန်မလိုဘဲ Python 3 တင်ထားရုံဖြင့် ချက်ချင်း Run နိုင်ပါသည်:

```bash
# နည်းလမ်း (၁): Environment Variable ဖြင့် Run ခြင်း
export TELEGRAM_BOT_TOKEN="your_bot_token_here"
python3 telegram_bot/bot.py

# နည်းလမ်း (၂): Command-line Flag ဖြင့် Run ခြင်း
python3 telegram_bot/bot.py --token "your_bot_token_here"

# နည်းလမ်း (၃): config.json ဖန်တီး၍ Run ခြင်း
cp telegram_bot/config.json.example telegram_bot/config.json
# config.json ထဲတွင် bot_token ထည့်ပြီးနောက်:
python3 telegram_bot/bot.py
```

---

## ၄။ Cloudflare Workers ဖြင့် အခမဲ့ ၂၄ နာရီ Serverless Run နည်း (Recommended)

မိမိကွန်ပျူတာကို အမြဲဖွင့်မထားလိုပါက Cloudflare Workers ပေါ်တွင် အခမဲ့ (100% Free Forever) အမြဲ Run ထားနိုင်ပါသည်:

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) သို့ ဝင်ရောက်ပြီး **Workers & Pages** -> **Create Application** ကို နှိပ်ပါ။
2. Worker တစ်ခုဖန်တီးပြီး `telegram_bot/cloudflare-worker.js` ထဲမှ ကုဒ်အားလုံးကို ကူးယူထည့်သွင်းပါ။
3. **Settings** -> **Variables** တွင် အောက်ပါတို့ကို ထည့်ပါ:
   * Variable Name: `BOT_TOKEN` | Value: `မိမိ၏ Bot Token`
   * Variable Name: `WEBAPP_URL` | Value: `https://htetofficial.github.io`
4. **Deploy** ကို နှိပ်ပါ။ ရရှိလာသော Worker URL ကို ကူးယူပါ (ဥပမာ: `https://htet-bot.yourname.workers.dev`)။
5. အောက်ပါ Command ဖြင့် Webhook သတ်မှတ်ပါ:
   ```bash
   python3 telegram_bot/set_webhook.py set <BOT_TOKEN> "https://htet-bot.yourname.workers.dev"
   ```
   သို့မဟုတ် Browser မှတစ်ဆင့် ဖွင့်ပါ:
   `https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://htet-bot.yourname.workers.dev`

---

## ၅။ Telegram Instant View (IV) စနစ် သတ်မှတ်နည်း

Telegram တွင် ဆောင်းပါးလင့်ခ်များ မျှဝေသည့်အခါ အင်တာနက်နှေးကွေးသည့်တိုင် စက္ကန့်မဆိုင်း တိုက်ရိုက်ဖတ်ရှုနိုင်သော **Instant View** ခလုတ် ပေါ်ပေါက်လာစေရန်:

1. [https://instantview.telegram.org/](https://instantview.telegram.org/) သို့ Telegram အကောင့်ဖြင့် ဝင်ပါ။
2. **My Templates** သို့ သွားပြီး `htetofficial.github.io` ကို ထည့်ပါ။
3. [telegram-instant-view-rules.txt](../telegram-instant-view-rules.txt) ဖိုင်ထဲမှ XPath စည်းမျဉ်းများကို ကူးယူထည့်သွင်းပါ။
4. Sample URL အဖြစ် `https://htetofficial.github.io/article.html?id=aung-san-suu-kyi-freedom-from-fear-1990-mm` ကို ထည့်ပြီး စမ်းသပ်ပါ။
5. **View in Telegram** ဖြင့် Instant View စာမျက်နှာကို စမ်းသပ်ကြည့်ရှုနိုင်ပြီး `rhash` ရရှိပါက စာမျက်နှာအားလုံးတွင် အလိုအလျောက် Instant View ပေါ်ပေါက်လာမည် ဖြစ်ပါသည်။
6. `article.html` တွင်လည်း **"Telegram IV"** ခလုတ်ကို တိုက်ရိုက် ထည့်သွင်းပေးထားပြီး ဖြစ်ပါသည်။

---

## ၆။ Telegram Mini App ၏ အထူးစွမ်းဆောင်ရည်များ

* **Theme Sync:** Telegram ၏ Dark/Light Mode နှင့် အညီ Htet ၏ Japanese Editorial အပြင်အဆင် အလိုအလျောက် လိုက်လျောညီထွေ ပြောင်းလဲခြင်း။
* **Native BackButton:** စာဖတ်ခန်း (`article.html`) သို့မဟုတ် အခြားစာမျက်နှာများသို့ ရောက်ရှိနေချိန်တွင် Telegram ၏ မူရင်း BackButton ပေါ်လာပြီး တစ်ချက်နှိပ်ရုံဖြင့် မူလနေရာသို့ ပြန်လည်ရောက်ရှိခြင်း။
* **Native MainButton:** ဘာသာပြန်စတူဒီယို (`translate.html`) တွင် စာရိုက်လိုက်သည်နှင့် Telegram ၏ အောက်ခြေ MainButton ("ဘာသာပြန်ဆိုမည်") အလိုအလျောက် ပေါ်လာခြင်း။
* **Haptic Feedback:** ခလုတ်များ၊ စာညွှန်းများနှင့် အသံဖိုင်ဖွင့်ခလုတ်များ နှိပ်တိုင်း သဘာဝကျသော လက်တုန်ခါမှု (Haptic Vibration) ပေးစွမ်းခြင်း။
* **Safe Area Insets:** iPhone နှင့် Android ဖုန်းများ၏ Status Bar၊ Gesture Pill များနှင့် မထပ်စေဘဲ သပ်ရပ်စွာ ပေါ်လွင်ခြင်း။
