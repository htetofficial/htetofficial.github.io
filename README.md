# Htet Official (ထက်) — Personal Editorial & Research Platform

တရားဝင် ဝက်ဘ်ဆိုဒ် ပလက်ဖောင်း — [https://htetofficial.github.io/](https://htetofficial.github.io/)  
(Burmese Transgirl Writer, Political Philosophy Researcher & Activist)

---

## 🌟 အဓိက အသွင်အပြင်များနှင့် နည်းပညာစနစ် (Architecture & Features)

1. **Soft Sino-Japanese Editorial Aesthetic:**
   - Palette: `ivory` (`#FAF8F5`), `cream` (`#F2ECE4`), `taupe` (`#9C8F83`), `charcoal` (`#2B2927`), `vermilion` (`#B83A2D`).
   - Cultural Accent: Traditional Red Hanko Seal Stamp (`assets/seal-stamp.svg`), hairline borders, and generous whitespace (*Ma* / 間).
   - Wabi-Sabi Paper Grain texture overlay for authentic literary tactile experience.

2. **Dual-Language i18n System (မြန်မာ & English):**
   - မြန်မာစာ (Pyidaungsu Unicode default, line-height 2.15) နှင့် English (Cormorant Garamond + Plus Jakarta Sans).
   - `data-mm="..."` နှင့် `data-en="..."` attributes များဖြင့် Reload လုပ်စရာမလိုဘဲ ချက်ချင်း DOM ဘာသာပြန်စနစ်။
   - `localStorage.getItem('site_lang')` ဖြင့် အသုံးပြုသူ ရွေးချယ်မှု မှတ်သားခြင်း။

3. **High-Contrast Dark Mode & Multi-Theme System:**
   - **Light Mode (ရိုးရာစက္ကူဖြူ):** နေ့ခင်းစာဖတ်ရှုရန် နူးညံ့သောအဖြူ။
   - **Sepia Mode (ရှေးဟောင်းကျမ်းစာပေအသွင်):** မျက်စိအေးသက်သာစေသော Parchment အဝါနု။
   - **Dark Mode (ဇိမ်ခံမှောင်ရီအနက်ရောင်):** `#F5EFE6` High-contrast ivory text, `#D1C9BE` body text, `#1A1816` card backgrounds ဖြင့် စာလုံးတိုင်း ၁၀၀% ရှင်းလင်းပြတ်သားစွာ ဖတ်ရှုနိုင်သော စနစ်။
   - Keyboard Shortcut `T` ဖြင့် မုဒ်များကို အလွယ်တကူ အလှည့်ကျ ပြောင်းလဲနိုင်ခြင်း။

4. **Global Spotlight Search (⌘K / Ctrl+K):**
   - မည်သည့်စာမျက်နှာမှမဆို `⌘K` သို့မဟုတ် Header Search ခလုတ်ကို နှိပ်၍ ဆောင်းပါးများ၊ ဒဿနသဘောတရားများ၊ ဂျာနယ်မှတ်စုများကို Real-time ရှာဖွေနိုင်ခြင်း။

5. **Bookmarks & Reading List Drawer (စာဖတ်မှတ်တမ်း ဆွဲထုတ်ခန်း):**
   - နှစ်သက်သော စာမူများကို Bookmark လုပ်၍ `localStorage` တွင် သိမ်းဆည်းနိုင်ခြင်း။
   - Header ပေါ်ရှိ Bookmark Icon (တိုက်ရိုက်အရေအတွက် Badge ပါဝင်) ကို ကလစ်နှိပ်ရုံဖြင့် စာဖတ်မှတ်တမ်း Panel ပွင့်လာပြီး ချက်ချင်း ဖတ်ရှုနိုင်ခြင်း။
   - သိမ်းဆည်းချိန်တွင် ပျော်ရွှင်ဖွယ် Canvas Confetti ဖောက်ပေးခြင်း။

6. **ဒဿနနှင့် ဂျန်ဒါ သဘောတရား အဘိဓာန် (`glossary.html`):**
   - Intersectionality, Gender Performativity, Hegemony, Epistemic Injustice, Biopolitics, Subalternity စသည့် အဓိက သဘောတရားများကို ပညာရှင်များ၊ အသံထွက်လမ်းညွှန်၊ မြန်မာ့လူ့ဘောင်နှင့် ဆက်စပ်မှုများဖြင့် ပြည့်စုံစွာ ဖော်ပြထားသော နှစ်ဘာသာ အဘိဓာန်။

7. **သုတေသနစာစောင်များနှင့် ကျမ်းကိုးစနစ် (`publications.html`):**
   - သုတေသန မိုနိုဂရပ်ဖ်များ၊ မူဝါဒစာတမ်းများနှင့် လူထုလက်စွဲ ဇင်းန် (Zines) စုစည်းမှု။
   - APA 7, Chicago 17th, MLA 9th နှင့် BibTeX ပုံစံများဖြင့် Academic Citation ချက်ချင်း ကူးယူနိုင်သော စနစ်။

8. **နေ့စဉ် ဒဿနဉာဏ်အလင်းပွင့် ဝစ်ဂျက် (Daily Wisdom Generator):**
   - အစ်မထက်၏ တန်ဖိုးထား ဒဿနစကားရပ်များကို “နောက်တစ်ပုဒ်” ခလုတ်ဖြင့် လှည့်လည်ဖတ်ရှုနိုင်ပြီး၊ Citation ပါဝင်သော Quote အဖြစ် Copy ယူနိုင်ခြင်း သို့မဟုတ် Telegram သို့ ချက်ချင်း မျှဝေနိုင်ခြင်း။

9. **အသံမှတ်တမ်းနှင့် ဒဿနစကားဝိုင်း UI (Spoken Reflections Audio Player):**
   - `journal.html` တွင် နှုတ်ဖြင့် ဒဿနအတွေးစကားဝိုင်းများကို အမြန်နှုန်းချိန်ညှိမှု (1x, 1.25x, 1.5x) ဖြင့် နားဆင်နိုင်သော အသံ UI စနစ်။

10. **Dual Data Layer with Zero-Fail Fallback (ကြံ့ခိုင်မှု အမြင့်ဆုံး စနစ်):**
    - ပုံမှန်အခြေအနေတွင် `data/*.json` မှ fetch လုပ်သည်။
    - `file://` protocol သို့မဟုတ် ကွန်ရက်ပြတ်တောက်ချိန်များတွင် အလိုအလျောက် `js/data/*-backup.js` မှ fallback dataset သို့ ကူးပြောင်းပေးသဖြင့် မည်သည့်အခါမျှ Error မတက်ပါ။

11. **5-Language i18n, 14 Themes & PWA Offline Support:**
    - မြန်မာ၊ English၊ 中文၊ ภาษาไทย နှင့် 日本語 (၅ ဘာသာ) + 0ms Anti-FOUC Theme ၁၄ မျိုး။
    - `manifest.webmanifest`, `sw.js` နှင့် `offline.html` တို့ဖြင့် PWA အဖြစ် ထည့်သွင်းအသုံးပြုနိုင်ခြင်း။

12. **SEO, Open Graph (Facebook/Telegram Link Preview) & JSON-LD Structured Data:**
    - စာမျက်နှာ ၁၀ ခုလုံးတွင် `meta[name="description"]`, `robots`, `<link rel="canonical">`, Open Graph (`og:*`), Twitter Cards နှင့် Schema.org JSON-LD များ ထည့်သွင်းထားခြင်း။
    - `article.html?id=...` တွင် `js/reader.js` မှတစ်ဆင့် ဆောင်းပါးတစ်ပုဒ်ချင်းစီ၏ Title, Description, Cover Image, Canonical URL နှင့် `ScholarlyArticle` JSON-LD တို့ကို အလိုအလျောက် Dynamic Update လုပ်ပေးခြင်း။

---

## 📁 ဖိုင်ဖွဲ့စည်းပုံ (Directory Structure)

```
.
├── index.html                 # ပင်မ စာမျက်နှာ (Editorial Showcase, Hero, Daily Wisdom, Pillars)
├── about.html                 # ကိုယ်ရေးအကျဉ်း၊ ပညာရပ်နောက်ခံနှင့် တန်ဖိုးထားရပ်တည်ချက်များ
├── articles.html              # သုတေသန စာတမ်းများ အပြည့်အစုံ (Live Search & Category Filter)
├── article.html               # သီးသန့် စာဖတ်ခန်း (?id=slug စနစ်ဖြင့် dynamically load)
├── glossary.html              # ဒဿနနှင့် ဂျန်ဒါ သဘောတရားအဘိဓာန် (Searchable Lexicon)
├── publications.html          # စာစောင်များ၊ မိုနိုဂရပ်ဖ်များနှင့် Citation Generator Modal
├── journal.html               # နေ့စဉ် အတွေးစများ၊ အသံမှတ်တမ်းနှင့် လှုပ်ရှားမှု Timeline
├── contact.html               # Telegram, Facebook တိုက်ရိုက် ဆက်သွယ်ရန်နှင့် စာလွှာဖောင်
├── 404.html                   # Sino-Japanese "無" ရသ ၄၀၄ စာမျက်နှာ
├── css/
│   ├── bootstrap.min.css      # Downloaded Bootstrap 5.3 framework
│   ├── bootstrap-icons.min.css# Downloaded Bootstrap Icons CSS
│   ├── fonts/                 # Bootstrap Icons WOFF/WOFF2 font binaries
│   ├── aos.css                # Downloaded AOS scroll animations
│   └── custom.css             # Pyidaungsu Font-face, High-Contrast Dark Mode & Master Styles
├── js/
│   ├── bootstrap.bundle.min.js# Downloaded Bootstrap 5.3 JS
│   ├── aos.js                 # Downloaded AOS Library JS
│   ├── confetti.browser.min.js# Downloaded Canvas Confetti Library JS
│   ├── data-loader.js         # Articles, Posts, Glossary, Publications & Quotes Data Engine
│   ├── theme.js               # Light / Sepia / Dark mode switch, shortcuts & storage
│   ├── i18n.js                # Instant dual-language switcher (data-mm / data-en)
│   ├── reader.js              # TOC, Reading Progress, Font Resizer, Citations
│   ├── main.js                # Spotlight (⌘K), Bookmarks Drawer, Quote Generator, UI Engine
│   └── data/
│       ├── articles-backup.js # Backup dataset for articles
│       ├── posts-backup.js    # Backup dataset for journal posts
│       ├── glossary-backup.js # Backup dataset for philosophical glossary
│       └── publications-backup.js # Backup dataset for research monographs
├── data/
│   ├── articles.json          # Main articles dataset (JSON)
│   ├── posts.json             # Main posts dataset (JSON)
│   ├── glossary.json          # Conceptual glossary dataset (JSON)
│   └── publications.json      # Research monographs dataset (JSON)
└── assets/
    ├── favicon.svg            # Hanko seal favicon
    └── seal-stamp.svg         # Stylized vermilion seal stamp vector
```

---

## 📬 တရားဝင် ဆက်သွယ်ရန် (Official Contact)

* **Email:**  | `htethtet2025ideahub@gmail.com`
* **Telegram:** [@htetmmofficial](https://t.me/htetmmofficial)
