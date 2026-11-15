# Htet Official (ထက်) — Personal Editorial & Research Platform

[[https://img.shields.io/badge/Website-htetofficial.github.io-B83A2D?style=flat-square]](https://htetofficial.github.io/)
[[https://img.shields.io/badge/Apps-Android%20%7C%20macOS%20%7C%20Windows-252321?style=flat-square]](https://github.com/htetofficial/htetofficial.github.io/releases)
[[https://img.shields.io/badge/Languages-MM%20%7C%20EN%20%7C%20ZH%20%7C%20TH%20%7C%20JA-0EA5E9?style=flat-square]](https://htetofficial.github.io/)
[[https://img.shields.io/badge/Community-Discussions-7C3AED?style=flat-square]](https://github.com/htetofficial/htetofficial.github.io/discussions)

**Official Website:** [https://htetofficial.github.io/](https://htetofficial.github.io/)  
**Author:** Htet Myat Ekri (ထက်မြတ်ဧကရီ) — *Writer · Political Philosophy Researcher · Activist*

**Htet Official** is a multilingual digital research library and literary archive dedicated to Political Philosophy, Federalism, Gender Studies, and Burmese Literature, engineered with a Sino-Japanese Wabi-Sabi editorial aesthetic, full offline PWA support, and companion mobile/desktop apps.

---

## 🌐 Quick Links & Navigation

- **Home & Showcase:** [https://htetofficial.github.io/](https://htetofficial.github.io/)
- **Research Articles (25 Papers):** [https://htetofficial.github.io/articles.html](https://htetofficial.github.io/articles.html)
- **Publications & Monographs (26 + 4 Books):** [https://htetofficial.github.io/publications.html](https://htetofficial.github.io/publications.html)
- **Journal & Spoken Reflections (37 Posts):** [https://htetofficial.github.io/journal.html](https://htetofficial.github.io/journal.html)
- **Philosophical & Gender Glossary (12 Terms):** [https://htetofficial.github.io/glossary.html](https://htetofficial.github.io/glossary.html)
- **About & Contact:** [About](https://htetofficial.github.io/about.html) · [Contact](https://htetofficial.github.io/contact.html)
- **Multilingual Academic Dossier (PDF):** [Download PDF](https://htetofficial.github.io/downloads/Htet_International_Academic_Dossier_Multilingual.pdf)
- **Wiki & User Guide:** [GitHub Wiki](https://github.com/htetofficial/htetofficial.github.io/wiki)

---

## 📱 Mobile & Desktop Apps (Beta Releases)

Download standalone native wrappers from the [GitHub Releases](https://github.com/htetofficial/htetofficial.github.io/releases) page:

- **Android APK (`v1.2.0 Beta`):** Fullscreen reader with App Links (`.well-known/assetlinks.json`) and remote announcements (`app-update.json`).
  - *Install:* Download `.apk`, allow **"Install unknown apps"**, and optionally enable **Settings > Apps > Htet Official > Open by default > Open supported links**.
- **macOS Desktop App (`v1.0.0 Beta`):** Dedicated `1200×800` desktop reader with Rice Paper (`#FAF8F5`) canvas and fullscreen support.
  - *First Launch (Gatekeeper):* If macOS shows *"Apple could not verify Htet Official.app"*, click **Done**, open **System Settings > Privacy & Security > Security > Open Anyway** (or run `xattr -cr "/Applications/Htet Official.app"` in Terminal after moving to Applications).
- **Progressive Web App (PWA):** Open `https://htetofficial.github.io/` in Chrome, Safari, or Edge and click **"Add to Home Screen"** / **"Install App"** for offline reading.

---

## 📊 Archive Corpus Overview (မာတိကာ အနှစ်ချုပ်)

| Section / ကဏ္ဍ | Count | Description / ဖော်ပြချက် |
| :--- | :---: | :--- |
| **Research Articles (`articles.json`)** | 25 | Long-form papers on political philosophy, federalism, gender studies, and neuroscience |
| **Publications (`publications.json`)** | 26 | Downloadable PDF monographs, policy papers, translations, and magazine essays |
| **Books & Monographs (`books.json`)** | 4 | Full-length theoretical books and monographs |
| **Journal Posts (`posts.json`)** | 37 | Daily reflections, commentary, and essays (81 total feed items) |
| **Daily Wisdom Quotes (`quotes.json`)** | 19 | Curated philosophical quotes with instant copy and Telegram share |
| **Glossary (`glossary.json`)** | 12 | Multilingual lexicon (Intersectionality, Biopolitics, Hegemony, Subalternity, etc.) |

---

## 🌟 Architecture & Core Features (နည်းပညာစနစ်နှင့် အသွင်အပြင်များ)

1. **Soft Sino-Japanese Editorial Aesthetic:**
   - Palette: Rice Paper `ivory` (`#FAF8F5`), `cream` (`#F3ECE2`), `taupe` (`#9C8F83`), `charcoal` (`#252321`), and Hanko `vermilion` (`#B83A2D`).
   - Traditional Red Hanko Seal Stamp (`assets/seal-stamp.svg`), *Ma* (間) whitespace, and subtle Wabi-Sabi paper grain overlay.

2. **5-Language Internationalization (`js/i18n.js`):**
   - Instant zero-reload switching across **🇲🇲 မြန်မာ (Burmese)**, **🇬🇧 English**, **🇨🇳 简体中文 (Chinese)**, **🇹🇭 ภาษาไทย (Thai)**, and **🇯🇵 日本語 (Japanese)**.
   - Burmese typography rendered in local Pyidaungsu Unicode (`fonts/Pyidaungsu-*.ttf`), paired with Cormorant Garamond and Plus Jakarta Sans.

3. **14-Theme Reading Studio (`js/theme.js`):**
   - Includes **Light (Rice Paper)**, **Sepia (Parchment)**, **Dark (High-Contrast Obsidian `#121110`)**, **AMOLED Pitch Black**, plus curated Rose, Sakura, Peach, Amethyst, Lavender, Plum, Indigo, Ruby, Crimson, and Rosewood editions.
   - Zero-FOUC initialization and keyboard shortcut (`T`) toggling.

4. **Global Spotlight Search (`⌘K` / `Ctrl+K`) & Reading List Drawer:**
   - Real-time cross-corpus search across articles, glossary terms, publications, and journal posts.
   - Persistent `localStorage` bookmarks drawer with live badge counts and Canvas Confetti feedback.

5. **Interactive Academic Reader (`js/reader.js`):**
   - Scrollspy Table of Contents, reading progress bar, font size scaler, Zen Focus Mode, KaTeX math rendering, Leaflet interactive maps, and clickable inline citation popovers.
   - One-click academic citation export in **APA 7**, **Chicago 17th**, **MLA 9th**, and **BibTeX**.

6. **Dual Data Layer with Zero-Fail Fallback:**
   - Loads from `data/*.json` and automatically falls back to `js/data/*-backup.js` on `file://` or offline/network errors.

7. **SEO, Open Graph, PWA & App Integration:**
   - Full `meta` tags, Open Graph (`og-preview.jpeg`), Twitter Cards, and Schema.org JSON-LD across all 10 HTML pages, plus dynamic `ScholarlyArticle` JSON-LD in `js/reader.js`.
   - `sitemap.xml`, `robots.txt`, `manifest.json` / `manifest.webmanifest`, `sw.js`, `offline.html`, `.well-known/assetlinks.json`, `.nojekyll`, and `app-update.json`.

---

## 📁 Directory Structure (ဖိုင်ဖွဲ့စည်းပုံ)

```text
.
├── index.html                 # Editorial showcase, hero, daily wisdom, pillars
├── about.html                 # Author biography, academic background, initiatives
├── articles.html              # Research articles catalog (search & category filters)
├── article.html               # Dynamic article reader (?id=slug)
├── publications.html          # Monographs, PDFs & citation generator
├── journal.html               # Reflections, spoken audio player & 6 layout modes
├── glossary.html              # Searchable political & gender philosophy lexicon
├── contact.html               # Direct contact & social channels
├── 404.html / offline.html    # Custom Sino-Japanese 404 & PWA offline fallback
├── sitemap.xml / robots.txt   # Search engine indexing configuration
├── manifest.json              # Web App Manifest (PWA)
├── sw.js                      # Service Worker for offline caching
├── app-update.json            # FreeWebToApk Remote Update manifest
├── .well-known/assetlinks.json# Android Digital Asset Links verification
├── css/                       # Bootstrap, AOS, KaTeX, Leaflet, RemixIcon & custom.css
├── js/                        # i18n, theme, reader, data-loader, pwa, main & backups
├── data/                      # Primary JSON datasets (articles, posts, books, etc.)
├── downloads/                 # PDFs, Markdown essays, BibTeX, CV & Press Kit
├── fonts/                     # Pyidaungsu Unicode & KaTeX local font binaries
└── assets/                    # Icons, Hanko seal SVG/PNG, cover images
