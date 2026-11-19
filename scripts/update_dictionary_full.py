#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate dictionary.html with:
1. Complete removal of Mozilla PDF.js feature, cards, and tab.
2. Complete 5-language multilingual UI (mm, en, zh, th, ja) for all elements,
   placeholders, buttons, headers, and badges.
3. Mobile tap-to-define popover integration via js/vocab-lookup.js.
4. Clean 4-tab workflow: Dual Dict, Sentences Corpus, BurmeseNLP, 42K Words Explorer.
"""

html_content = '''<!DOCTYPE html>
<html lang="my" data-lang="mm">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">

  <!-- Critical Anti-FOUC & Anti-Flash Engine & Trusted Types Policy -->
  <script src="js/theme-init.js?v=2.1"></script>
  <style>
    /* Critical zero-latency base paint to completely eliminate theme and language flash */
    html { color-scheme: light dark; }
    html[data-announcement-dismissed="true"] #htet-announcement-bar { display: none !important; }
    html[data-theme="amoled"], html[data-theme="amoled"].dark { background-color: #000000 !important; }
    html[data-theme="amoled"] body, html[data-theme="amoled"].dark body { background-color: #000000 !important; color: #FFFFFF !important; }
    html[data-theme="amoled"] header.sticky { background-color: rgba(0, 0, 0, 0.95) !important; }
    html[data-theme="dark"], html.dark { background-color: #121110 !important; }
    html[data-theme="dark"] body, html.dark body { background-color: #121110 !important; color: #F5EFE6 !important; }
    html[data-theme="dark"] .bg-cream, html.dark .bg-cream { background-color: #221F1C !important; }
    html[data-theme="dark"] header.sticky, html.dark header.sticky { background-color: rgba(18, 17, 16, 0.85) !important; }
    html[data-theme="sepia"] { background-color: #F5EEDB !important; }
    html[data-theme="sepia"] body, html.sepia body { background-color: #F5EEDB !important; color: #342A1E !important; }
    html[data-theme="light"] { background-color: #FAF8F5; }
    html[data-theme="light"] body { background-color: #FAF8F5; color: #252321; }

    /* Red Themes (3) */
    html[data-theme="red"] { background-color: #FAF5F5 !important; }
    html[data-theme="red"] body { background-color: #FAF5F5 !important; color: #2A1717 !important; }
    html[data-theme="red-crimson"] { background-color: #FAF4F5 !important; }
    html[data-theme="red-crimson"] body { background-color: #FAF4F5 !important; color: #2E1218 !important; }
    html[data-theme="red-ruby"] { background-color: #12080A !important; }
    html[data-theme="red-ruby"] body { background-color: #12080A !important; color: #F5E8EA !important; }

    /* Yellow Themes (3) */
    html[data-theme="yellow"] { background-color: #FDFCF0 !important; }
    html[data-theme="yellow"] body { background-color: #FDFCF0 !important; color: #2E2914 !important; }
    html[data-theme="yellow-amber"] { background-color: #FCF8EC !important; }
    html[data-theme="yellow-amber"] body { background-color: #FCF8EC !important; color: #2C2210 !important; }
    html[data-theme="yellow-gold"] { background-color: #14120A !important; }
    html[data-theme="yellow-gold"] body { background-color: #14120A !important; color: #F8F2DC !important; }

    /* Green Themes (3) */
    html[data-theme="green"] { background-color: #F3F8F4 !important; }
    html[data-theme="green"] body { background-color: #F3F8F4 !important; color: #16261A !important; }
    html[data-theme="green-sage"] { background-color: #F1F6F2 !important; }
    html[data-theme="green-sage"] body { background-color: #F1F6F2 !important; color: #1A261D !important; }
    html[data-theme="green-forest"] { background-color: #0A140D !important; }
    html[data-theme="green-forest"] body { background-color: #0A140D !important; color: #E8F4EB !important; }

    /* Blue Themes (3) */
    html[data-theme="blue"] { background-color: #F2F7FB !important; }
    html[data-theme="blue"] body { background-color: #F2F7FB !important; color: #142230 !important; }
    html[data-theme="blue-sky"] { background-color: #F0F8FF !important; }
    html[data-theme="blue-sky"] body { background-color: #F0F8FF !important; color: #102438 !important; }
    html[data-theme="blue-midnight"] { background-color: #080E18 !important; }
    html[data-theme="blue-midnight"] body { background-color: #080E18 !important; color: #E4EEF8 !important; }

    /* Violet Themes (3) */
    html[data-theme="violet"] { background-color: #F8F4FB !important; }
    html[data-theme="violet"] body { background-color: #F8F4FB !important; color: #241630 !important; }
    html[data-theme="violet-lavender"] { background-color: #F6F3FA !important; }
    html[data-theme="violet-lavender"] body { background-color: #F6F3FA !important; color: #231830 !important; }
    html[data-theme="violet-deep"] { background-color: #100A18 !important; }
    html[data-theme="violet-deep"] body { background-color: #100A18 !important; color: #F2EAF8 !important; }
  </style>

  <title data-mm="အဘိဓာန်နှင့် ဘာသာစကား NLP စတူဒီယို — Htet Official" data-en="Dictionary & Linguistic NLP Studio — Htet Official" data-zh="词典与缅甸语自然语言处理工作室 — Htet Official" data-th="พจนานุกรมและสตูดิโอประมวลผลภาษาพม่า NLP — Htet Official" data-ja="辞書・ビルマ語言語処理スタジオ — Htet Official">အဘိဓာန်နှင့် ဘာသာစကား NLP စတူဒီယို — Htet Official</title>
  <meta name="description" content="Ornagai အင်္ဂလိပ်-မြန်မာ (၁၁၁,၂၃၂ လုံး)၊ ဝေါဟာရစုံတွဲ (၁၉၆,၂၀၂ စုံ)၊ Myanmar Tools ဝေါဟာရများ (၄၂,၇၈၇ လုံး) နှင့် 12K+ Parallel Corpus ဘာသာစကား သုတေသန စနစ်။">
  <link rel="canonical" href="https://htetofficial.github.io/dictionary.html">

  <!-- Open Graph / Meta -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="အဘိဓာန်နှင့် ဘာသာစကား NLP စတူဒီယို — Htet Official">
  <meta property="og:description" content="Ornagai အင်္ဂလိပ်-မြန်မာ (၁၁၁,၂၃၂ လုံး)၊ Reverse Pairs (၁၉၆,၂၀၂ စုံ)၊ Myanmar Tools (၄၂,၇၈၇ လုံး) နှင့် 12K+ Parallel Corpus ဘာသာစကား သုတေသန စနစ်။">
  <meta property="og:image" content="https://htetofficial.github.io/assets/images/og-cover.png">
  <meta property="og:url" content="https://htetofficial.github.io/dictionary.html">

  <link rel="apple-touch-icon" sizes="180x180" href="assets/apple-touch-icon.png">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="manifest" href="site.webmanifest">
  <meta name="theme-color" content="#B83A2D">

  <!-- Core Performance Prefetch & CDN Links -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="fonts/fonts.css">
  <link rel="stylesheet" href="css/remixicon.css">

  <!-- Framework & Icon Stylesheets -->
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/bootstrap-icons.min.css">
  <link rel="stylesheet" href="css/remixicon.css">
  <link rel="stylesheet" href="css/aos.css">

  <!-- Custom Editorial CSS (Minified for Fast Paint) -->
  <link rel="stylesheet" href="css/custom.min.css">

  <!-- Tailwind CSS Configuration Defined Before Script -->
  <script src="js/tailwind-config.js"></script>
  <script src="js/tailwind.min.js"></script>
  <script defer src="js/theme.js"></script>
</head>

<body class="min-h-screen flex flex-col bg-cream/30 text-charcoal antialiased transition-colors duration-200">

  <!-- Master Minimalist Header -->
  <header class="sticky top-0 z-40 bg-ivory/85 dark:bg-[#121110]/85 backdrop-blur-md border-b border-hairline transition-colors duration-300 w-full max-w-full overflow-x-clip left-0 right-0">
    <div class="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-4 xl:px-6 2xl:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-3 w-full">
      
      <!-- Minimalist Brand Identity -->
      <a href="index.html" class="flex items-center space-x-2 sm:space-x-2.5 group shrink-0" aria-label="Htet — Home">
        <div class="nav-brand-glass-icon w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0" title="ထက် (Htet)">
          <img src="assets/favicon.svg" alt="ထက်" class="w-full h-full object-contain">
        </div>
        <div class="flex flex-col">
          <span class="font-serif-editorial text-lg sm:text-xl font-bold tracking-tight text-charcoal group-hover:text-vermilion transition-colors leading-none">HTET</span>
          <span class="nav-brand-subtitle text-[9px] tracking-wider text-muted uppercase font-sans-ui mt-0.5 leading-none hidden xs:inline sm:inline truncate max-w-[130px]" data-mm="စာရေးဆရာမ • သုတေသီ" data-en="WRITER • RESEARCHER" data-zh="作家 • 政治哲学研究者" data-th="นักเขียน • นักวิจัยปรัชญา" data-ja="作家・政治哲学研究者">စာရေးဆရာမ • သုတေသီ</span>
        </div>
      </a>

      <!-- Floating Minimalist Navigation Capsule -->
      <div class="hidden lg:flex flex-1 justify-center items-center min-w-0 px-1 sm:px-2">
        <nav class="flex items-center p-1 rounded-full border border-hairline/80 bg-cream/70 dark:bg-stone-900/60 nav-capsule font-sans-ui text-xs 2xl:text-[13px] shadow-xs shrink-0">
          <a href="index.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="ပင်မ" data-en="Home" data-zh="首页" data-th="หน้าแรก" data-ja="ホーム">ပင်မ</a>
          <a href="articles.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="ဆောင်းပါးများ" data-en="Articles" data-zh="学术文章" data-th="บทความ" data-ja="論考・論文">ဆောင်းပါးများ</a>
          <a href="publications.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="ထုတ်ဝေမှုများ" data-en="Publications" data-zh="出版专著" data-th="ผลงานตีพิมพ์" data-ja="出版物・著作">ထုတ်ဝေမှုများ</a>
          <a href="journal.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="မှတ်စုနှင့် ပို့စ်များ" data-en="Posts" data-zh="随笔日志" data-th="บันทึกและข้อคิด" data-ja="ジャーナル・日誌">မှတ်စုနှင့် ပို့စ်များ</a>
          <a href="glossary.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="ဝေါဟာရအဘိဓာန်" data-en="Glossary" data-zh="术语辞典" data-th="พจนานุกรมศัพท์" data-ja="用語辞典">ဝေါဟာရအဘိဓာန်</a>
          <a href="about.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="စာရေးသူအကြောင်း" data-en="About" data-zh="关于作者" data-th="เกี่ยวกับผู้เขียน" data-ja="著者について">စာရေးသူအကြောင်း</a>
          <a href="contact.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="ဆက်သွယ်ရန်" data-en="Contact" data-zh="联系交流" data-th="ติดต่อเรา" data-ja="お問い合わせ">ဆက်သွယ်ရန်</a>
        </nav>
      </div>

      <!-- Action Utilities Cluster -->
      <div class="flex items-center space-x-1 sm:space-x-1.5 2xl:space-x-2 shrink-0">
        <!-- Spotlight Search Trigger (Cmd+K) -->
        <button id="spotlight-search-trigger" class="nav-util-btn w-8 h-8 rounded-full border border-hairline/80 bg-cream/60 dark:bg-stone-900/50 text-charcoal hover:text-vermilion hover:border-vermilion/50 transition-all flex items-center justify-center shadow-xs" title="Global Search (⌘K)" aria-label="Search">
          <i class="ri-search-line text-xs sm:text-sm"></i>
        </button>

        <!-- Typography Font Size Scaler -->
        <div class="hidden sm:flex items-center space-x-0.5 border border-hairline/80 rounded-full px-1 py-0.5 bg-cream/60 dark:bg-stone-900/50 shadow-xs">
          <button id="font-dec-btn" class="nav-font-btn w-6 h-6 rounded-full flex items-center justify-center text-charcoal hover:text-vermilion text-[10px] font-bold font-mono transition-colors" title="Decrease Font Size" aria-label="A-">A-</button>
          <span class="w-px h-3 bg-hairline/80 mx-0.5"></span>
          <button id="font-inc-btn" class="nav-font-btn w-6 h-6 rounded-full flex items-center justify-center text-charcoal hover:text-vermilion text-xs font-bold font-mono transition-colors" title="Increase Font Size" aria-label="A+">A+</button>
        </div>

        <!-- 4 Quick Theme Buttons + Palette Studio Trigger -->
        <div class="flex items-center bg-cream/60 dark:bg-stone-900/50 border border-hairline/80 rounded-full p-0.5 shadow-xs text-charcoal">
          <div class="hidden md:flex items-center space-x-0.5">
            <button data-set-theme="light" data-theme-btn="light" title="Light / နေ့ခင်းဖြူ" class="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer active:scale-90">
              <i class="ri-sun-cloudy-line text-xs"></i>
            </button>
            <button data-set-theme="sepia" data-theme-btn="sepia" title="Sepia / စာအုပ်ညို" class="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer active:scale-90">
              <i class="ri-book-open-line text-xs"></i>
            </button>
            <button data-set-theme="dark" data-theme-btn="dark" title="Dark / မှောင်ရိပ်" class="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer active:scale-90">
              <i class="ri-moon-clear-line text-xs"></i>
            </button>
            <button data-set-theme="amoled" data-theme-btn="amoled" title="AMOLED / အနက်စစ်" class="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all cursor-pointer active:scale-90">
              <i class="ri-contrast-drop-2-line text-xs"></i>
            </button>
            <span class="w-px h-3.5 bg-hairline/60 mx-0.5"></span>
          </div>
          <button data-set-theme="palette" title="စာဖတ်ရောင်စဉ် စတူဒီယို (18 Themes Studio)" class="w-7 h-7 rounded-full flex items-center justify-center text-xs text-charcoal hover:text-vermilion hover:bg-vermilion/10 transition-all cursor-pointer btn-palette-glow active:scale-90 relative" aria-label="Open Theme Palette Studio">
            <i class="ri-palette-line text-xs"></i>
            <span class="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full theme-active-dot ring-1 ring-white/60"></span>
          </button>
        </div>

        <!-- 5-Language Dropdown -->
        <div class="relative lang-switcher-container">
          <button id="lang-dropdown-btn" class="nav-lang-btn flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-2.5 py-1 rounded-full border border-hairline/80 bg-cream/60 dark:bg-stone-900/50 hover:border-vermilion/50 text-charcoal text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95" aria-label="Select Language" aria-haspopup="true" aria-expanded="false" title="ဘာသာစကား ရွေးချယ်ရန် (Choose Language)">
            <span id="current-lang-flag" class="text-sm">🇲🇲</span>
            <span id="current-lang-label" class="font-mono text-xs font-bold">MM</span>
            <i class="ri-arrow-down-s-line text-[11px] opacity-60 lang-chevron transition-transform duration-200"></i>
          </button>
          <div id="lang-dropdown-menu" class="absolute right-0 mt-2 w-52 py-2 rounded-2xl shadow-2xl z-50 hidden transition-all font-sans-ui text-xs border border-hairline lang-dropdown-glass bg-card" role="menu" aria-orientation="vertical">
            <div class="px-3 py-1 mb-1 border-b border-hairline/60 flex items-center justify-between text-[10px] text-muted font-mono uppercase tracking-wider">
              <span data-mm="ဘာသာစကား ရွေးရန်" data-en="Select Language" data-zh="选择语言" data-th="เลือกภาษา" data-ja="言語を選択">ဘာသာစကား ရွေးရန်</span>
              <span class="text-vermilion font-bold">5 LANGS</span>
            </div>
            <button data-switch-lang="mm" class="w-full text-left px-3 py-2 hover:bg-vermilion/10 dark:hover:bg-white/10 flex items-center justify-between transition-all rounded-xl mx-auto my-0.5 cursor-pointer" role="menuitem">
              <span class="flex items-center space-x-2.5">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-2xs border border-hairline/60 bg-card">🇲🇲</span>
                <span class="font-semibold text-charcoal">မြန်မာ</span>
              </span>
              <span class="text-[10px] font-mono opacity-50">MM</span>
            </button>
            <button data-switch-lang="en" class="w-full text-left px-3 py-2 hover:bg-vermilion/10 dark:hover:bg-white/10 flex items-center justify-between transition-all rounded-xl mx-auto my-0.5 cursor-pointer" role="menuitem">
              <span class="flex items-center space-x-2.5">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-2xs border border-hairline/60 bg-card">🇬🇧</span>
                <span class="font-semibold text-charcoal">English</span>
              </span>
              <span class="text-[10px] font-mono opacity-50">EN</span>
            </button>
            <button data-switch-lang="zh" class="w-full text-left px-3 py-2 hover:bg-vermilion/10 dark:hover:bg-white/10 flex items-center justify-between transition-all rounded-xl mx-auto my-0.5 cursor-pointer" role="menuitem">
              <span class="flex items-center space-x-2.5">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-2xs border border-hairline/60 bg-card">🇨🇳</span>
                <span class="font-semibold text-charcoal">中文</span>
              </span>
              <span class="text-[10px] font-mono opacity-50">ZH</span>
            </button>
            <button data-switch-lang="th" class="w-full text-left px-3 py-2 hover:bg-vermilion/10 dark:hover:bg-white/10 flex items-center justify-between transition-all rounded-xl mx-auto my-0.5 cursor-pointer" role="menuitem">
              <span class="flex items-center space-x-2.5">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-2xs border border-hairline/60 bg-card">🇹🇭</span>
                <span class="font-semibold text-charcoal">ไทย</span>
              </span>
              <span class="text-[10px] font-mono opacity-50">TH</span>
            </button>
            <button data-switch-lang="ja" class="w-full text-left px-3 py-2 hover:bg-vermilion/10 dark:hover:bg-white/10 flex items-center justify-between transition-all rounded-xl mx-auto my-0.5 cursor-pointer" role="menuitem">
              <span class="flex items-center space-x-2.5">
                <span class="w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-2xs border border-hairline/60 bg-card">🇯🇵</span>
                <span class="font-semibold text-charcoal">日本語</span>
              </span>
              <span class="text-[10px] font-mono opacity-50">JA</span>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer Toggle -->
        <button id="mobile-menu-open-btn" class="lg:hidden nav-util-btn w-8 h-8 rounded-full border border-hairline/80 bg-cream/60 dark:bg-stone-900/50 text-charcoal hover:text-vermilion flex items-center justify-center shadow-xs" aria-label="Open Navigation Drawer">
          <i class="ri-menu-3-line text-sm"></i>
        </button>
      </div>

    </div>
  </header>

  <!-- Mobile Minimalist Drawer Navigation Menu -->
  <div id="mobile-nav-backdrop" class="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300" aria-hidden="true"></div>
  <div id="mobile-nav-drawer" class="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-ivory dark:bg-[#181614] border-l border-hairline shadow-2xl transform translate-x-full transition-transform duration-300 ease-in-out flex flex-col justify-between p-6">
    <div class="space-y-6">
      <div class="flex items-center justify-between pb-4 border-b border-hairline">
        <div class="flex items-center space-x-2.5">
          <div class="nav-brand-glass-icon w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
            <img src="assets/favicon.svg" alt="ထက်" class="w-full h-full object-contain">
          </div>
          <span class="font-serif-editorial text-lg font-bold text-charcoal">HTET</span>
        </div>
        <button id="mobile-menu-close-btn" class="w-8 h-8 rounded-full hover:bg-cream dark:hover:bg-stone-800 flex items-center justify-center text-muted hover:text-charcoal cursor-pointer" aria-label="Close menu">
          <i class="ri-close-line text-lg"></i>
        </button>
      </div>

      <nav class="space-y-1 font-sans-ui text-sm">
        <a href="index.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60" data-mm="ပင်မ" data-en="Home" data-zh="首页" data-th="หน้าแรก" data-ja="ホーム">
          <span class="flex items-center space-x-2.5">
            <i class="ri-home-5-line text-muted"></i>
            <span>ပင်မ</span>
          </span>
        </a>
        <a href="articles.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60" data-mm="ဆောင်းပါးများ" data-en="Articles" data-zh="学术文章" data-th="บทความ" data-ja="論考・論文">
          <span class="flex items-center space-x-2.5">
            <i class="ri-article-line text-muted"></i>
            <span>ဆောင်းပါးများ</span>
          </span>
        </a>
        <a href="publications.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60" data-mm="ထုတ်ဝေမှုများ" data-en="Publications" data-zh="出版专著" data-th="ผลงานตีพิมพ์" data-ja="出版物・著作">
          <span class="flex items-center space-x-2.5">
            <i class="ri-file-paper-2-line text-muted"></i>
            <span>ထုတ်ဝေမှုများ</span>
          </span>
        </a>
        <a href="journal.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60" data-mm="မှတ်စုနှင့် ပို့စ်များ" data-en="Journal & Posts" data-zh="随笔日志" data-th="บันทึกและข้อคิด" data-ja="ジャーナル・日誌">
          <span class="flex items-center space-x-2.5">
            <i class="ri-booklet-line text-muted"></i>
            <span>မှတ်စုနှင့် ပို့စ်များ</span>
          </span>
        </a>
        <a href="glossary.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60" data-mm="ဝေါဟာရအဘိဓာန်" data-en="Glossary" data-zh="术语辞典" data-th="พจนานุกรมศัพท์" data-ja="用語辞典">
          <span class="flex items-center space-x-2.5">
            <i class="ri-book-read-line text-muted"></i>
            <span>ဝေါဟာရအဘိဓာန်</span>
          </span>
        </a>
        <a href="dictionary.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-bold transition-all bg-vermilion text-white shadow-xs" data-mm="အဘိဓာန်နှင့် NLP" data-en="Dictionary & NLP" data-zh="词典与NLP" data-th="พจนานุกรมและ NLP" data-ja="辞書とNLP">
          <span class="flex items-center space-x-2.5">
            <i class="ri-book-2-fill text-white"></i>
            <span>အဘိဓာန်နှင့် NLP</span>
          </span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">111K+</span>
        </a>
        <a href="about.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60" data-mm="စာရေးသူအကြောင်း" data-en="About" data-zh="关于作者" data-th="เกี่ยวกับผู้เขียน" data-ja="著者について">
          <span class="flex items-center space-x-2.5">
            <i class="ri-user-smile-line text-muted"></i>
            <span>စာရေးသူအကြောင်း</span>
          </span>
        </a>
        <a href="contact.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60" data-mm="ဆက်သွယ်ရန်" data-en="Contact" data-zh="联系作者" data-th="ติดต่อ" data-ja="お問い合わせ">
          <span class="flex items-center space-x-2.5">
            <i class="ri-mail-send-line text-muted"></i>
            <span>ဆက်သွယ်ရန်</span>
          </span>
        </a>
      </nav>
    </div>
  </div>

  <!-- Breadcrumb Bar -->
  <div class="border-b border-hairline/60 bg-cream/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center space-x-2 text-xs text-muted font-sans-ui">
      <a href="index.html" class="hover:text-vermilion flex items-center space-x-1">
        <i class="ri-home-5-line"></i>
        <span data-mm="ပင်မ" data-en="Home" data-zh="首页" data-th="หน้าแรก" data-ja="ホーム">ပင်မ</span>
      </a>
      <span class="opacity-40">/</span>
      <span class="text-charcoal font-semibold flex items-center space-x-1">
        <i class="ri-book-2-line text-vermilion"></i>
        <span data-mm="အဘိဓာန်နှင့် ဘာသာစကား NLP စတူဒီယို" data-en="Dictionary & Linguistic NLP Studio" data-zh="词典与自然语言处理工作室" data-th="พจนานุกรมและสตูดิโอ NLP" data-ja="辞書・自然言語処理スタジオ">အဘိဓာန်နှင့် ဘာသာစကား NLP စတူဒီယို</span>
      </span>
    </div>
  </div>

  <!-- Main Content Container -->
  <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
    
    <!-- Hero Banner with Japanese Editorial Hanko Stamp -->
    <div class="text-center space-y-3 max-w-3xl mx-auto">
      <div class="flex items-center justify-center space-x-2">
        <span class="hanko-stamp px-2.5 py-0.5 text-xs font-semibold" data-mm="အဘိဓာန်" data-en="Dictionary" data-zh="词典" data-th="พจนานุกรม" data-ja="辞書">အဘိဓာန်</span>
        <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-300 dark:border-teal-700/60 shadow-xs">
          <i class="ri-translate-2"></i>
          <span>Ornagai • Myanmar Tools • BurmeseNLP • kalixlouiis Corpus</span>
        </span>
      </div>

      <h1 class="text-3xl sm:text-5xl font-black font-serif-editorial text-charcoal tracking-tight" data-mm="အဘိဓာန်၊ ဘာသာပြန်နှင့် NLP စတူဒီယို" data-en="Dictionary, Translation & NLP Studio" data-zh="词典、机器翻译与NLP语言工作室" data-th="สตูดิโอพจนานุกรม การแปลภาษา และ NLP" data-ja="辞書・翻訳・自然言語処理スタジオ">
        အဘိဓာန်၊ ဘာသာပြန်နှင့် NLP စတူဒီယို
      </h1>
      <p class="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed" data-mm="Ornagai အင်္ဂလိပ်-မြန်မာ (၁၁၁,၂၃၂ လုံး)၊ ဝေါဟာရစုံတွဲ (၁၉၆,၂၀၂ စုံ)၊ Myanmar Tools ဝေါဟာရများ (၄၂,၇၈၇ လုံး) နှင့် 12K+ Parallel Corpus ဘာသာစကား သုတေသန စနစ်။" data-en="Ornagai English-Myanmar (111,232 words), reverse pairs (196,202), Myanmar Words (42,787), and 12K+ parallel corpus for linguistic research." data-zh="Ornagai 英缅词典（111,232词）、反向词对（196,202对）、缅文词库（42,787词）及12,000+平行语料库研究平台。" data-th="พจนานุกรม Ornagai อังกฤษ-พม่า (111,232 คำ), คู่คำย้อนกลับ (196,202 คู่), คำศัพท์พม่า (42,787 คำ) และคลังประโยคคู่ขนาน 12K+" data-ja="Ornagai 英語-ミャンマー語（111,232語）、逆引きペア（196,202組）、42,787語彙および12,000+並列コーパス研究基盤。">
        Ornagai အင်္ဂလိပ်-မြန်မာ (၁၁၁,၂၃၂ လုံး)၊ ဝေါဟာရစုံတွဲ (၁၉၆,၂၀၂ စုံ)၊ Myanmar Tools ဝေါဟာရများ (၄၂,၇၈၇ လုံး) နှင့် 12K+ Parallel Corpus ဘာသာစကား သုတေသန စနစ်။
      </p>

      <!-- Stats Chips -->
      <div class="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-xs">
        <span class="px-2.5 py-1 rounded-lg bg-cream/70 dark:bg-stone-800 text-charcoal border border-hairline font-bold" data-mm="၁၁၁,၂၃၂ En Words" data-en="111,232 En Words" data-zh="111,232 英语单词" data-th="111,232 คำอังกฤษ" data-ja="111,232 英語語彙">111,232 En Words</span>
        <span class="px-2.5 py-1 rounded-lg bg-cream/70 dark:bg-stone-800 text-charcoal border border-hairline font-bold" data-mm="၁၉၆,၂၀၂ Reverse Pairs" data-en="196,202 Reverse Pairs" data-zh="196,202 逆向匹配对" data-th="196,202 คู่คำย้อนกลับ" data-ja="196,202 逆引きペア">196,202 Reverse Pairs</span>
        <span class="px-2.5 py-1 rounded-lg bg-cream/70 dark:bg-stone-800 text-charcoal border border-hairline font-bold" data-mm="၄၂,၇၈၇ My Words" data-en="42,787 My Words" data-zh="42,787 缅语词汇" data-th="42,787 คำพม่า" data-ja="42,787 緬語語彙">42,787 My Words</span>
        <span class="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-300 font-bold" data-mm="၁၂,၀၂၁ Parallel Pairs" data-en="12,021 Parallel Pairs" data-zh="12,021 平行句对" data-th="12,021 ประโยคคู่ขนาน" data-ja="12,021 対訳ペア">12,021 Parallel Pairs</span>
        <span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 font-bold" data-mm="100% အော့ဖ်လိုင်းအသင့်" data-en="100% Offline Ready" data-zh="100% 离线支持" data-th="100% ใช้งานออฟไลน์ได้" data-ja="100% オフライン完全対応">100% Offline Ready</span>
      </div>

      <!-- Feature Tabs Switcher (4 Core Subsystems — PDF Tab Excluded) -->
      <div class="pt-4 flex justify-center overflow-x-auto pb-1">
        <div class="inline-flex items-center p-1.5 rounded-2xl bg-cream/80 dark:bg-stone-900 border border-hairline shadow-xs font-sans-ui text-xs font-semibold gap-1">
          <button onclick="window.HtetDict.switchTab('tab-dict')" data-tab-target="tab-dict" class="dict-tab-btn active px-3.5 py-2 rounded-xl bg-teal-600 text-white shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 shrink-0">
            <i class="ri-book-2-line"></i>
            <span data-mm="အဘိဓာန် ရှာဖွေမှု (Dual Dict)" data-en="Dictionary Search (Dual Dict)" data-zh="双向词典搜索 (Dual Dict)" data-th="ค้นหาพจนานุกรม (Dual Dict)" data-ja="辞書検索 (日英・緬英)">အဘိဓာန် ရှာဖွေမှု (Dual Dict)</span>
          </button>
          <button onclick="window.HtetDict.switchTab('tab-sentences')" data-tab-target="tab-sentences" class="dict-tab-btn px-3.5 py-2 rounded-xl text-muted hover:text-charcoal transition-all cursor-pointer flex items-center space-x-1.5 shrink-0">
            <i class="ri-translate-2"></i>
            <span data-mm="ဝါကျဘာသာပြန် (12K+ Corpus)" data-en="Sentence Translation (12K+ Corpus)" data-zh="例句与机器翻译 (12K+语料)" data-th="แปลประโยค (12K+ Corpus)" data-ja="用例翻訳 (12K+コーパス)">ဝါကျဘာသာပြန် (12K+ Corpus)</span>
          </button>
          <button onclick="window.HtetDict.switchTab('tab-nlp')" data-tab-target="tab-nlp" class="dict-tab-btn px-3.5 py-2 rounded-xl text-muted hover:text-charcoal transition-all cursor-pointer flex items-center space-x-1.5 shrink-0">
            <i class="ri-cpu-line"></i>
            <span data-mm="မြန်မာစာ NLP (Workbench)" data-en="Burmese NLP (Workbench)" data-zh="缅甸语NLP工作台 (Workbench)" data-th="การประมวลผลภาษาพม่า NLP" data-ja="ビルマ語NLPワークベンチ">မြန်မာစာ NLP (Workbench)</span>
          </button>
          <button onclick="window.HtetDict.switchTab('tab-explorer')" data-tab-target="tab-explorer" class="dict-tab-btn px-3.5 py-2 rounded-xl text-muted hover:text-charcoal transition-all cursor-pointer flex items-center space-x-1.5 shrink-0">
            <i class="ri-folder-word-line"></i>
            <span data-mm="သဒ္ဒါအလိုက် ဝေါဟာရများ (42K+)" data-en="Grammar & Vocabulary (42K+)" data-zh="语法与词类词库 (42K+)" data-th="คลังคำศัพท์ตามไวยากรณ์ (42K+)" data-ja="品詞別語彙エクスプローラー (42K+)">သဒ္ဒါအလိုက် ဝေါဟာရများ (42K+)</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 1: DUAL DICTIONARY SEARCH VIEW (EN ⇄ MY)              -->
    <!-- ======================================================== -->
    <div id="tab-dict" class="dict-view-tab space-y-8">
      
      <!-- Search Box with Direction Indicator -->
      <div class="max-w-3xl mx-auto space-y-3">
        <div class="relative flex items-center shadow-lg rounded-2xl overflow-hidden border-2 border-teal-500/50 focus-within:border-teal-600 bg-card transition-all">
          <div class="pl-4 pr-2 text-teal-600 dark:text-teal-400">
            <i class="ri-search-line text-xl"></i>
          </div>
          <input 
            type="text" 
            id="dict-search-input" 
            placeholder="အင်္ဂလိပ် သို့မဟုတ် မြန်မာစကားလုံး ရိုက်ထည့်ပါ (freedom, လွတ်လပ်ခွင့်, သတ္တိ)..."
            data-mm-placeholder="အင်္ဂလိပ် သို့မဟုတ် မြန်မာစကားလုံး ရိုက်ထည့်ပါ (freedom, လွတ်လပ်ခွင့်, သတ္တိ)..."
            data-en-placeholder="Type an English or Myanmar word (e.g. freedom, လွတ်လပ်ခွင့်, courage)..."
            data-zh-placeholder="输入英语或缅甸语单词（如：freedom, လွတ်လပ်ခွင့်, courage）..."
            data-th-placeholder="พิมพ์คำภาษาอังกฤษหรือภาษาพม่า (เช่น freedom, လွတ်လပ်ခွင့်, courage)..."
            data-ja-placeholder="英語またはミャンマー語の単語を入力（例: freedom, လွတ်လပ်ခွင့်, courage）..."
            autocomplete="off" 
            autocorrect="off" 
            autocapitalize="off"
            spellcheck="false"
            class="w-full py-4 px-2 text-base sm:text-lg bg-transparent text-charcoal placeholder-muted focus:outline-none font-medium"
          >
          <div id="dict-direction-indicator" class="mr-2 hidden sm:block shrink-0">
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-400/30">Auto Detect</span>
          </div>
          <button onclick="window.HtetDict.lookup(document.getElementById('dict-search-input').value)" class="mr-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all cursor-pointer shadow-xs active:scale-95 shrink-0" data-mm="ရှာဖွေရန်" data-en="Search" data-zh="搜索" data-th="ค้นหา" data-ja="検索">
            ရှာဖွေရန်
          </button>
        </div>

        <!-- Quick Word Suggestions -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs text-muted font-medium scrollbar-thin">
          <span class="shrink-0 text-slate-500 font-bold" data-mm="စမ်းသပ်ရန်:" data-en="Try:" data-zh="快速尝试:" data-th="ลองค้นหา:" data-ja="お試し:">စမ်းသပ်ရန်:</span>
          <button onclick="window.HtetDict.lookup('freedom')" class="px-2 py-0.5 rounded-md bg-cream/70 dark:bg-stone-800 hover:text-vermilion cursor-pointer shrink-0 font-mono">freedom</button>
          <button onclick="window.HtetDict.lookup('လွတ်လပ်ခွင့်')" class="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:text-teal-800 cursor-pointer shrink-0 font-sans-ui font-semibold">လွတ်လပ်ခွင့်</button>
          <button onclick="window.HtetDict.lookup('courage')" class="px-2 py-0.5 rounded-md bg-cream/70 dark:bg-stone-800 hover:text-vermilion cursor-pointer shrink-0 font-mono">courage</button>
          <button onclick="window.HtetDict.lookup('သတ္တိ')" class="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:text-teal-800 cursor-pointer shrink-0 font-sans-ui font-semibold">သတ္တိ</button>
          <button onclick="window.HtetDict.lookup('democracy')" class="px-2 py-0.5 rounded-md bg-cream/70 dark:bg-stone-800 hover:text-vermilion cursor-pointer shrink-0 font-mono">democracy</button>
          <button onclick="window.HtetDict.lookup('ဒီမိုကရေစီ')" class="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:text-teal-800 cursor-pointer shrink-0 font-sans-ui font-semibold">ဒီမိုကရေစီ</button>
          <button onclick="window.HtetDict.lookup('peace')" class="px-2 py-0.5 rounded-md bg-cream/70 dark:bg-stone-800 hover:text-vermilion cursor-pointer shrink-0 font-mono">peace</button>
          <button onclick="window.HtetDict.lookup('ငြိမ်းချမ်းရေး')" class="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:text-teal-800 cursor-pointer shrink-0 font-sans-ui font-semibold">ငြိမ်းချမ်းရေး</button>
        </div>

        <div id="dict-search-status" class="text-xs text-muted italic"></div>
      </div>

      <!-- Alphabetical A-Z Letter Explorer -->
      <div class="max-w-5xl mx-auto p-3 sm:p-4 rounded-2xl bg-card border border-hairline shadow-xs">
        <div class="flex items-center justify-between mb-2 px-1">
          <span class="text-xs font-bold text-charcoal font-sans-ui flex items-center space-x-1.5">
            <i class="ri-sort-alphabet-asc text-teal-600"></i>
            <span data-mm="အင်္ဂလိပ် အက္ခရာအလိုက် ရှာဖွေရန် (Browse English A to Z)" data-en="Browse English Alphabet (A to Z)" data-zh="按英文字母浏览 (A 至 Z)" data-th="เรียกดูตามตัวอักษรภาษาอังกฤษ (A ถึง Z)" data-ja="英語アルファベット別ブラウズ (A-Z)">အင်္ဂလိပ် အက္ခရာအလိုက် ရှာဖွေရန် (Browse English A to Z)</span>
          </span>
          <span class="text-[11px] text-muted font-mono" data-mm="၂၇ ပိုင်းခွဲထားသည်" data-en="27 Letter Partitions" data-zh="27个字母分区" data-th="27 ส่วนตัวอักษร" data-ja="27文字区分">27 Letter Partitions</span>
        </div>
        <div class="flex flex-wrap gap-1 sm:gap-1.5 justify-center">
          <button onclick="window.HtetDict.browseLetter('a')" data-letter-btn="a" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">A</button>
          <button onclick="window.HtetDict.browseLetter('b')" data-letter-btn="b" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">B</button>
          <button onclick="window.HtetDict.browseLetter('c')" data-letter-btn="c" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">C</button>
          <button onclick="window.HtetDict.browseLetter('d')" data-letter-btn="d" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">D</button>
          <button onclick="window.HtetDict.browseLetter('e')" data-letter-btn="e" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">E</button>
          <button onclick="window.HtetDict.browseLetter('f')" data-letter-btn="f" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">F</button>
          <button onclick="window.HtetDict.browseLetter('g')" data-letter-btn="g" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">G</button>
          <button onclick="window.HtetDict.browseLetter('h')" data-letter-btn="h" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">H</button>
          <button onclick="window.HtetDict.browseLetter('i')" data-letter-btn="i" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">I</button>
          <button onclick="window.HtetDict.browseLetter('j')" data-letter-btn="j" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">J</button>
          <button onclick="window.HtetDict.browseLetter('k')" data-letter-btn="k" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">K</button>
          <button onclick="window.HtetDict.browseLetter('l')" data-letter-btn="l" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">L</button>
          <button onclick="window.HtetDict.browseLetter('m')" data-letter-btn="m" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">M</button>
          <button onclick="window.HtetDict.browseLetter('n')" data-letter-btn="n" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">N</button>
          <button onclick="window.HtetDict.browseLetter('o')" data-letter-btn="o" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">O</button>
          <button onclick="window.HtetDict.browseLetter('p')" data-letter-btn="p" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">P</button>
          <button onclick="window.HtetDict.browseLetter('q')" data-letter-btn="q" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">Q</button>
          <button onclick="window.HtetDict.browseLetter('r')" data-letter-btn="r" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">R</button>
          <button onclick="window.HtetDict.browseLetter('s')" data-letter-btn="s" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">S</button>
          <button onclick="window.HtetDict.browseLetter('t')" data-letter-btn="t" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">T</button>
          <button onclick="window.HtetDict.browseLetter('u')" data-letter-btn="u" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">U</button>
          <button onclick="window.HtetDict.browseLetter('v')" data-letter-btn="v" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">V</button>
          <button onclick="window.HtetDict.browseLetter('w')" data-letter-btn="w" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">W</button>
          <button onclick="window.HtetDict.browseLetter('x')" data-letter-btn="x" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">X</button>
          <button onclick="window.HtetDict.browseLetter('y')" data-letter-btn="y" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">Y</button>
          <button onclick="window.HtetDict.browseLetter('z')" data-letter-btn="z" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">Z</button>
          <button onclick="window.HtetDict.browseLetter('other')" data-letter-btn="other" class="px-2.5 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-mono text-xs font-bold hover:bg-teal-600 hover:text-white transition-all cursor-pointer">#</button>
        </div>
      </div>

      <!-- Two-Column Dictionary Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
        
        <!-- Left Column: Suggestions & Bookmarks (4 cols) -->
        <div class="lg:col-span-4 space-y-4">
          <!-- Suggestions Panel -->
          <div class="p-4 rounded-3xl bg-card border border-hairline shadow-xs space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-hairline">
              <span class="text-xs font-bold text-charcoal font-sans-ui flex items-center space-x-1.5">
                <i class="ri-list-check-2 text-vermilion"></i>
                <span data-mm="စကားလုံးများ စာရင်း" data-en="Live Matches" data-zh="匹配词条列表" data-th="รายการคำที่ตรงกัน" data-ja="一致単語リスト">စကားလုံးများ စာရင်း</span>
              </span>
              <span class="text-[10px] text-muted font-mono">LIVE MATCHES</span>
            </div>
            <div id="dict-suggestions-list" class="space-y-1 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin"></div>
          </div>

          <!-- Bookmarks Panel -->
          <div class="p-4 rounded-3xl bg-card border border-hairline shadow-xs space-y-3">
            <div class="flex items-center justify-between pb-2 border-b border-hairline">
              <span class="text-xs font-bold text-charcoal font-sans-ui flex items-center space-x-1.5">
                <i class="ri-bookmark-3-line text-amber-500"></i>
                <span data-mm="မှတ်သားထားသော စကားလုံးများ" data-en="Saved Words" data-zh="已收藏词汇" data-th="คำศัพท์ที่บันทึกไว้" data-ja="保存した単語">မှတ်သားထားသော စကားလုံးများ</span>
              </span>
              <span class="text-[10px] text-muted font-mono">SAVED</span>
            </div>
            <div id="dict-bookmarks-container" class="flex flex-wrap gap-1.5 pt-1"></div>
          </div>
        </div>

        <!-- Right Column: Definition Card Display (8 cols) -->
        <div class="lg:col-span-8">
          <div id="dict-empty-state" class="p-12 rounded-3xl bg-card border border-hairline text-center space-y-4 hidden">
            <div class="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center text-3xl">
              <i class="ri-book-open-line"></i>
            </div>
            <h3 class="text-xl font-bold font-serif-editorial text-charcoal" data-mm="စကားလုံး ရှာဖွေပါ" data-en="Search Vocabulary" data-zh="开始查询词汇" data-th="ค้นหาคำศัพท์" data-ja="単語を検索">စကားလုံး ရှာဖွေပါ</h3>
            <p class="text-sm text-muted max-w-md mx-auto" data-mm="ရှာဖွေလိုသော အင်္ဂလိပ် သို့မဟုတ် မြန်မာစကားလုံးကို အထက်ပါ search box တွင် ရိုက်ထည့်ပါ သို့မဟုတ် အက္ခရာများအလိုက် နှိပ်၍ ကြည့်ရှုနိုင်ပါသည်။" data-en="Enter an English or Myanmar word in the search box above, or browse alphabetically." data-zh="请在上方输入英语或缅甸语单词，亦可按字母索引浏览。" data-th="พิมพ์คำภาษาอังกฤษหรือภาษาพม่าในช่องค้นหาด้านบน หรือเลือกตามตัวอักษร" data-ja="上の検索ボックスに英語またはミャンマー語を入力するか、アルファベット順に閲覧してください。">
              ရှာဖွေလိုသော အင်္ဂလိပ် သို့မဟုတ် မြန်မာစကားလုံးကို အထက်ပါ search box တွင် ရိုက်ထည့်ပါ သို့မဟုတ် အက္ခရာများအလိုက် နှိပ်၍ ကြည့်ရှုနိုင်ပါသည်။
            </p>
          </div>

          <div id="dict-def-card" class="space-y-6"></div>
        </div>

      </div>

    </div>

    <!-- ======================================================== -->
    <!-- TAB 2: PARALLEL SENTENCES (12,021 PAIRS CORPUS)           -->
    <!-- ======================================================== -->
    <div id="tab-sentences" class="dict-view-tab space-y-6 hidden">
      <div class="max-w-4xl mx-auto space-y-4">
        <!-- Search Bar -->
        <div class="relative flex items-center shadow-lg rounded-2xl overflow-hidden border-2 border-teal-500/50 focus-within:border-teal-600 bg-card transition-all">
          <div class="pl-4 pr-2 text-teal-600 dark:text-teal-400">
            <i class="ri-translate-2 text-xl"></i>
          </div>
          <input 
            type="text" 
            id="sentence-search-input" 
            placeholder="အင်္ဂလိပ် သို့မဟုတ် မြန်မာစကားစပ်ဝါကျ ရှာဖွေပါ (ဥပမာ: freedom, democracy, peace, လွတ်လပ်ခွင့်, ငြိမ်းချမ်းရေး)..."
            data-mm-placeholder="အင်္ဂလိပ် သို့မဟုတ် မြန်မာစကားစပ်ဝါကျ ရှာဖွေပါ (ဥပမာ: freedom, democracy, peace, လွတ်လပ်ခွင့်, ငြိမ်းချမ်းရေး)..."
            data-en-placeholder="Search bilingual parallel sentences (e.g. freedom, democracy, peace, လွတ်လပ်ခွင့်)..."
            data-zh-placeholder="搜索双语平行例句（如：freedom, democracy, peace, လွတ်လပ်ခွင့်）..."
            data-th-placeholder="ค้นหาประโยคคู่ขนานสองภาษา (เช่น freedom, democracy, peace)..."
            data-ja-placeholder="バイリンガル対訳文を検索（例: freedom, democracy, peace, လွတ်လပ်ခွင့်）..."
            autocomplete="off" 
            class="w-full py-4 px-2 text-base sm:text-lg bg-transparent text-charcoal placeholder-muted focus:outline-none font-medium"
          >
          <button onclick="window.HtetDict.searchSentences(document.getElementById('sentence-search-input').value)" class="mr-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all cursor-pointer shadow-xs shrink-0" data-mm="ရှာဖွေရန်" data-en="Search" data-zh="搜索" data-th="ค้นหา" data-ja="検索">
            ရှာဖွေရန်
          </button>
        </div>

        <!-- Quick Sample Queries -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs text-muted font-medium scrollbar-thin">
          <span class="shrink-0 text-slate-500 font-bold" data-mm="နမူနာများ:" data-en="Samples:" data-zh="常用示例:" data-th="ตัวอย่าง:" data-ja="用例サンプル:">နမူနာများ:</span>
          <button onclick="document.getElementById('sentence-search-input').value = 'freedom'; window.HtetDict.searchSentences('freedom')" class="px-2 py-0.5 rounded-md bg-cream/70 dark:bg-stone-800 hover:text-vermilion cursor-pointer shrink-0 font-mono">freedom</button>
          <button onclick="document.getElementById('sentence-search-input').value = 'peace'; window.HtetDict.searchSentences('peace')" class="px-2 py-0.5 rounded-md bg-cream/70 dark:bg-stone-800 hover:text-vermilion cursor-pointer shrink-0 font-mono">peace</button>
          <button onclick="document.getElementById('sentence-search-input').value = 'country'; window.HtetDict.searchSentences('country')" class="px-2 py-0.5 rounded-md bg-cream/70 dark:bg-stone-800 hover:text-vermilion cursor-pointer shrink-0 font-mono">country</button>
          <button onclick="document.getElementById('sentence-search-input').value = 'လွတ်လပ်'; window.HtetDict.searchSentences('လွတ်လပ်')" class="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:text-teal-800 cursor-pointer shrink-0 font-sans-ui font-semibold">လွတ်လပ်</button>
          <button onclick="document.getElementById('sentence-search-input').value = 'လူထု'; window.HtetDict.searchSentences('လူထု')" class="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:text-teal-800 cursor-pointer shrink-0 font-sans-ui font-semibold">လူထု</button>
          <button onclick="document.getElementById('sentence-search-input').value = 'မေတ္တာ'; window.HtetDict.searchSentences('မေတ္တာ')" class="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:text-teal-800 cursor-pointer shrink-0 font-sans-ui font-semibold">မေတ္တာ</button>
          <button onclick="document.getElementById('sentence-search-input').value = 'ပညာရေး'; window.HtetDict.searchSentences('ပညာရေး')" class="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:text-teal-800 cursor-pointer shrink-0 font-sans-ui font-semibold">ပညာရေး</button>
        </div>

        <!-- Corpus Meta Banner -->
        <div class="flex items-center justify-between p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs">
          <div class="flex items-center space-x-2 text-teal-800 dark:text-teal-200">
            <i class="ri-database-2-line text-sm"></i>
            <span class="font-bold">HuggingFace kalixlouiis Myanmar-English Parallel Corpus</span>
          </div>
          <span id="sentence-match-count" class="font-mono text-[11px] font-bold text-teal-700 dark:text-teal-300" data-mm="ဝါကျပေါင်း ၁၂,၀၂၁ ခု အသင့်ရှိသည်" data-en="12,021 Parallel Sentences Ready" data-zh="12,021对双语例句已加载" data-th="12,021 ประโยคคู่ขนานพร้อมใช้งาน" data-ja="12,021組の対訳文を準備完了">
            ဝါကျပေါင်း ၁၂,၀၂၁ ခု အသင့်ရှိသည်
          </span>
        </div>

        <!-- Results List -->
        <div id="sentence-results-list" class="space-y-3"></div>

        <div id="sentence-empty-state" class="p-12 text-center rounded-3xl bg-card border border-hairline text-muted space-y-3">
          <div class="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center text-2xl">
            <i class="ri-chat-check-line"></i>
          </div>
          <h3 class="text-lg font-bold font-serif-editorial text-charcoal" data-mm="ရှာဖွေလိုသော စကားစု ရိုက်ထည့်ပါ" data-en="Enter Words or Phrases" data-zh="输入要检索的短语或句意" data-th="พิมพ์คำหรือวลีที่ต้องการค้นหา" data-ja="検索する語句を入力">ရှာဖွေလိုသော စကားစု ရိုက်ထည့်ပါ</h3>
          <p class="text-xs text-muted max-w-md mx-auto" data-mm="HuggingFace kalixlouiis ဒေတာဘေ့စ်မှ လူသုံးအများဆုံး အင်္ဂလိပ်-မြန်မာ ဝါကျစုံတွဲ ၁၂,၀၂၁ ခုထဲမှ စကားစပ်ဝါကျများကို စက္ကန့်ပိုင်းအတွင်း ရှာဖွေပေးပါမည်။" data-en="Instant lookup across 12,021 high-frequency Myanmar-English parallel sentence pairs from the HuggingFace corpus." data-zh="从HuggingFace kalixlouiis语料库的12,021对缅英双语平行例句中实时智能检索。" data-th="ค้นหาประโยคคู่ขนานภาษาพม่า-อังกฤษ 12,021 ประโยคจาก HuggingFace ได้ทันที" data-ja="HuggingFaceの12,021組のミャンマー語・英語並列コーパスから文脈用例を即座に検索します。">
            HuggingFace kalixlouiis ဒေတာဘေ့စ်မှ လူသုံးအများဆုံး အင်္ဂလိပ်-မြန်မာ ဝါကျစုံတွဲ ၁၂,၀၂၁ ခုထဲမှ စကားစပ်ဝါကျများကို စက္ကန့်ပိုင်းအတွင်း ရှာဖွေပေးပါမည်။
          </p>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 3: BURMESENLP WORKBENCH VIEW                          -->
    <!-- ======================================================== -->
    <div id="tab-nlp" class="dict-view-tab space-y-6 hidden">
      <div class="max-w-4xl mx-auto p-6 md:p-8 rounded-3xl bg-card border border-hairline shadow-sm space-y-6">
        <div class="border-b border-hairline pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 class="text-2xl font-bold font-serif-editorial text-charcoal m-0" data-mm="BurmeseNLP Workbench" data-en="BurmeseNLP Workbench" data-zh="缅甸语自然语言处理工作台" data-th="เวิร์กเบนช์ BurmeseNLP" data-ja="ビルマ語NLPワークベンチ">BurmeseNLP Workbench</h2>
            <p class="text-xs text-muted font-sans-ui m-0" data-mm="မြန်မာစာ သရ/ဗျည်းအဖြတ်အတောက် (Sylbreak)၊ စကားလုံးခွဲခြမ်းခြင်း နှင့် သဒ္ဒါခွဲခြားမှု စနစ်" data-en="Syllable segmentation (Sylbreak), word tokenization, and Part-of-Speech tagging system." data-zh="音节切分 (Sylbreak)、最长匹配分词以及词性标注 (myPOS) 处理系统。" data-th="ระบบตัดพยางค์ (Sylbreak) ตัดคำ และกำกับหน้าที่ของคำ (myPOS) ภาษาพม่า" data-ja="音節分割 (Sylbreak)、最長一致形態素トークン化、品詞タグ付け (myPOS) システム。">မြန်မာစာ သရ/ဗျည်းအဖြတ်အတောက် (Sylbreak)၊ စကားလုံးခွဲခြမ်းခြင်း နှင့် သဒ္ဒါခွဲခြားမှု စနစ်</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-400/30 shrink-0">
            burmesenlp Web Engine + Myanmar Dataset Collection
          </span>
        </div>

        <!-- Sample Presets -->
        <div class="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <span class="font-bold" data-mm="နမူနာ စာကြောင်းများ:" data-en="Sample Sentences:" data-zh="测试样句:" data-th="ประโยคตัวอย่าง:" data-ja="サンプル文章:">နမူနာ စာကြောင်းများ:</span>
          <button onclick="window.HtetDict.setWorkbenchSample('ကျွန်တော်ကျောင်းသို့သွားသည်။')" class="px-2.5 py-1 rounded-xl bg-cream/70 dark:bg-stone-800 hover:text-teal-600 cursor-pointer">ကျွန်တော်ကျောင်းသို့သွားသည်။</button>
          <button onclick="window.HtetDict.setWorkbenchSample('စစ်မှန်သော လွတ်မြောက်ခြင်းသည် ကြောက်ရွံ့မှုမှ လွတ်မြောက်ခြင်း ဖြစ်သည်။')" class="px-2.5 py-1 rounded-xl bg-cream/70 dark:bg-stone-800 hover:text-teal-600 cursor-pointer">ကြောက်ရွံ့မှုမှ လွတ်မြောက်ခြင်း</button>
          <button onclick="window.HtetDict.setWorkbenchSample('ဒီမိုကရေစီစနစ်သည် လူ့အခွင့်အရေးနှင့် တန်းတူညီမျှမှုကို အခြေခံသည်။')" class="px-2.5 py-1 rounded-xl bg-cream/70 dark:bg-stone-800 hover:text-teal-600 cursor-pointer">ဒီမိုကရေစီနှင့် လူ့အခွင့်အရေး</button>
        </div>

        <!-- Textarea Input -->
        <div class="space-y-3">
          <textarea 
            id="nlp-workbench-input" 
            rows="4" 
            placeholder="စစ်ဆေးလိုသော မြန်မာစာကြောင်း သို့မဟုတ် စာပိုဒ်ကို ရိုက်ထည့်ပါ (Zawgyi ရိုက်ထည့်ပါကလည်း အလိုအလျောက် Unicode သို့ ပြောင်းလဲစစ်ဆေးပေးပါသည်)..."
            data-mm-placeholder="စစ်ဆေးလိုသော မြန်မာစာကြောင်း သို့မဟုတ် စာပိုဒ်ကို ရိုက်ထည့်ပါ (Zawgyi ရိုက်ထည့်ပါကလည်း အလိုအလျောက် Unicode သို့ ပြောင်းလဲစစ်ဆေးပေးပါသည်)..."
            data-en-placeholder="Enter Burmese text or sentences to analyze (Zawgyi is automatically converted to Unicode)..."
            data-zh-placeholder="请输入需要分析的缅文句子或段落（Zawgyi编码将自动转换为Unicode）..."
            data-th-placeholder="กรอกประโยคหรือข้อความภาษาพม่าที่ต้องการวิเคราะห์ (รองรับการแปลง Zawgyi เป็น Unicode อัตโนมัติ)..."
            data-ja-placeholder="解析するビルマ語の文章を入力してください（Zawgyiは自動的にUnicodeに変換されます）..."
            class="w-full p-4 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline focus:border-teal-500 focus:outline-none text-charcoal font-sans-ui text-base leading-relaxed"
          >စစ်မှန်သော လွတ်မြောက်ခြင်းသည် ကြောက်ရွံ့မှုမှ လွတ်မြောက်ခြင်း ဖြစ်သည်။</textarea>

          <div class="flex items-center justify-between">
            <span class="text-xs text-muted italic" data-mm="Client-side အော့ဖ်လိုင်း စစ်ဆေးခြင်း • ကြန့်ကြာမှုမရှိ" data-en="Client-side Offline Execution • Zero Latency" data-zh="客户端完全离线计算 • 零网络延迟" data-th="ประมวลผลออฟไลน์บนเครื่อง • ไม่มีความล่าช้า" data-ja="クライアント側完全オフライン実行 • ゼロ遅延">Client-side Offline Execution • Zero Latency</span>
            <button onclick="window.HtetDict.runNlpWorkbench()" class="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all cursor-pointer shadow-xs active:scale-95" data-mm="စစ်ဆေးခွဲခြမ်းမည်" data-en="Analyze Text" data-zh="开始自然语言分析" data-th="วิเคราะห์ข้อความ" data-ja="自然言語解析を実行">
              စစ်ဆေးခွဲခြမ်းမည်
            </button>
          </div>
        </div>

        <!-- Output Sections -->
        <div class="space-y-6 pt-4 border-t border-hairline">
          <!-- 1. Font Encoding Check -->
          <div class="space-y-2">
            <h3 class="text-xs font-bold text-muted uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <i class="ri-font-size text-teal-600"></i>
              <span data-mm="၁။ ဖောင့်ကုဒ်စနစ် စစ်ဆေးခြင်း (Font Encoding Detection & Conversion)" data-en="1. Font Encoding Detection & Conversion (Zawgyi ⇄ Unicode)" data-zh="1. 字体编码检测与自动转换 (Zawgyi ⇄ Unicode)" data-th="1. การตรวจจับและแปลงรหัสฟอนต์ (Zawgyi ⇄ Unicode)" data-ja="1. フォントエンコーディング検出と変換 (Zawgyi ⇄ Unicode)">၁။ ဖောင့်ကုဒ်စနစ် စစ်ဆေးခြင်း (Font Encoding Detection & Conversion)</span>
            </h3>
            <div id="nlp-out-zguni"></div>
          </div>

          <!-- 2. Sylbreak Output -->
          <div class="space-y-2">
            <h3 class="text-xs font-bold text-muted uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <i class="ri-scissors-cut-line text-teal-600"></i>
              <span data-mm="၂။ သရ/ဗျည်း အဖြတ်အတောက် (Syllable Segmentation)" data-en="2. Syllable Segmentation (Sylbreak)" data-zh="2. 缅语音节智能切分 (Syllable Segmentation)" data-th="2. การตัดพยางค์ภาษาพม่า (Syllable Segmentation)" data-ja="2. 音節セグメンテーション (Syllable Segmentation)">၂။ သရ/ဗျည်း အဖြတ်အတောက် (Syllable Segmentation)</span>
            </h3>
            <div id="nlp-out-syllables" class="flex flex-wrap gap-1.5 p-4 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline min-h-[50px] items-center"></div>
          </div>

          <!-- 3. Word Tokenization -->
          <div class="space-y-2">
            <h3 class="text-xs font-bold text-muted uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <i class="ri-node-tree text-teal-600"></i>
              <span data-mm="၃။ စကားလုံး ခွဲခြမ်းမှု (Greedy Longest Match Tokenization)" data-en="3. Word Tokenization (Greedy Longest Match)" data-zh="3. 贪婪最长匹配词汇分词 (Word Tokenization)" data-th="3. การตัดคำภาษาพม่า (Word Tokenization)" data-ja="3. 単語トークン化 (最長一致形態素解析)">၃။ စကားလုံး ခွဲခြမ်းမှု (Greedy Longest Match Tokenization)</span>
            </h3>
            <div id="nlp-out-tokens" class="flex flex-wrap gap-1.5 p-4 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline min-h-[50px] items-center"></div>
          </div>

          <!-- 4. POS Tagging -->
          <div class="space-y-2">
            <h3 class="text-xs font-bold text-muted uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <i class="ri-price-tag-3-line text-teal-600"></i>
              <span data-mm="၄။ သဒ္ဒါခွဲခြားမှု (Part-of-Speech Tagging - myPOS)" data-en="4. Part-of-Speech Tagging (myPOS)" data-zh="4. 词性标注分类 (Part-of-Speech - myPOS)" data-th="4. การกำกับหน้าที่ของคำ (Part-of-Speech - myPOS)" data-ja="4. 品詞タギング (myPOS分類)">၄။ သဒ္ဒါခွဲခြားမှု (Part-of-Speech Tagging - myPOS)</span>
            </h3>
            <div id="nlp-out-pos" class="flex flex-wrap gap-2 p-4 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline min-h-[60px] items-center"></div>
          </div>
        </div>

        <!-- Reference Ecosystem Banner (Myanmar Language Dataset Collection) -->
        <div class="p-4 rounded-2xl bg-cream/50 dark:bg-stone-900/50 border border-hairline space-y-2 text-xs">
          <div class="flex items-center space-x-2 font-bold text-charcoal">
            <i class="ri-links-line text-vermilion"></i>
            <span>Myanmar NLP Dataset Ecosystem References:</span>
          </div>
          <div class="flex flex-wrap gap-2 text-muted">
            <span class="px-2 py-1 rounded bg-card border border-hairline">myPOS (Aung Thu Hein)</span>
            <span class="px-2 py-1 rounded bg-card border border-hairline">myNER (Named Entity Recognition)</span>
            <span class="px-2 py-1 rounded bg-card border border-hairline">Myanmar Text Segmentation</span>
            <span class="px-2 py-1 rounded bg-card border border-hairline">Myanmar Language Dataset Collection (Chuu Htet Naing)</span>
            <span class="px-2 py-1 rounded bg-card border border-hairline">Translation-From-English-To-Burmese (Ye-Bhone-Lin)</span>
          </div>
        </div>

      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 4: MYANMAR WORDS EXPLORER (42K+ POS LEXICON)          -->
    <!-- ======================================================== -->
    <div id="tab-explorer" class="dict-view-tab space-y-6 hidden">
      <div class="max-w-6xl mx-auto space-y-6">
        
        <div class="p-6 rounded-3xl bg-card border border-hairline shadow-xs space-y-4">
          <div>
            <h2 class="text-xl font-bold font-serif-editorial text-charcoal m-0" data-mm="Myanmar Tools ဝေါဟာရ စူးစမ်းခန်း (၄၂,၇၈၇ လုံး)" data-en="Myanmar Words Lexicon Explorer (42,787 Words)" data-zh="缅甸语42,787常用词汇探索库" data-th="คลังสำรวจคำศัพท์พม่า 42,787 คำ" data-ja="ミャンマー語42,787語彙エクスプローラー">Myanmar Tools ဝေါဟာရ စူးစမ်းခန်း (၄၂,၇၈၇ လုံး)</h2>
            <p class="text-xs text-muted font-sans-ui m-0" data-mm="မြန်မာစာပေ သဒ္ဒါအမျိုးအစားများနှင့် ဗျည်းအက္ခရာ ၃၃ လုံးအလိုက် အမျိုးအစားခွဲခြားထားသော ဝေါဟာရဘဏ်" data-en="Lexicon classified across 9 parts-of-speech and 33 consonant categories." data-zh="涵盖9大语法词类与33个辅音字母体系的词汇库。" data-th="คลังคำศัพท์ที่จัดหมวดหมู่ตามหน้าที่ของคำ 9 ชนิดและพยัญชนะ 33 ตัว" data-ja="9つの品詞カテゴリと33の子音分類に整理された包括的語彙データベース。">မြန်မာစာပေ သဒ္ဒါအမျိုးအစားများနှင့် ဗျည်းအက္ခရာ ၃၃ လုံးအလိုက် အမျိုးအစားခွဲခြားထားသော ဝေါဟာရဘဏ်</p>
          </div>

          <!-- 9 POS Filter Pills -->
          <div class="space-y-2">
            <span class="text-xs font-bold text-charcoal font-sans-ui" data-mm="သဒ္ဒါ အမျိုးအစား ရွေးချယ်ရန်:" data-en="Select Part-of-Speech:" data-zh="选择词性分类:" data-th="เลือกชนิดของคำ:" data-ja="品詞を選択:">သဒ္ဒါ အမျိုးအစား ရွေးချယ်ရန်:</span>
            <div class="flex flex-wrap gap-1.5">
              <button onclick="window.HtetDict.setPosFilter('n')" data-pos-filter="n" class="px-3 py-1 rounded-xl bg-teal-600 text-white font-sans-ui text-xs font-semibold cursor-pointer shadow-xs" data-mm="နာမ် (Noun)" data-en="Noun" data-zh="名词 (Noun)" data-th="คำนาม (Noun)" data-ja="名詞 (Noun)">နာမ် (Noun)</button>
              <button onclick="window.HtetDict.setPosFilter('v')" data-pos-filter="v" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer" data-mm="ကြိယာ (Verb)" data-en="Verb" data-zh="动词 (Verb)" data-th="คำกริยา (Verb)" data-ja="動詞 (Verb)">ကြိယာ (Verb)</button>
              <button onclick="window.HtetDict.setPosFilter('adj')" data-pos-filter="adj" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer" data-mm="နာမဝိသေသန (Adj)" data-en="Adjective" data-zh="形容词 (Adj)" data-th="คำคุณศัพท์ (Adj)" data-ja="形容詞 (Adj)">နာမဝိသေသန (Adj)</button>
              <button onclick="window.HtetDict.setPosFilter('adv')" data-pos-filter="adv" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer" data-mm="ကြိယာဝိသေသန (Adv)" data-en="Adverb" data-zh="副词 (Adv)" data-th="คำวิเศษณ์ (Adv)" data-ja="副詞 (Adv)">ကြိယာဝိသေသန (Adv)</button>
              <button onclick="window.HtetDict.setPosFilter('postp')" data-pos-filter="postp" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer" data-mm="ဝိဘတ် (Postposition)" data-en="Postposition" data-zh="后置词 (Postp)" data-th="คำบุพบท (Postp)" data-ja="後置詞 (Postp)">ဝိဘတ် (Postposition)</button>
              <button onclick="window.HtetDict.setPosFilter('conj')" data-pos-filter="conj" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer" data-mm="စကားစပ် (Conjunction)" data-en="Conjunction" data-zh="连词 (Conj)" data-th="คำสันธาน (Conj)" data-ja="接続詞 (Conj)">စကားစပ် (Conjunction)</button>
              <button onclick="window.HtetDict.setPosFilter('part')" data-pos-filter="part" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer" data-mm="ပစ္စည်း (Particle)" data-en="Particle" data-zh="助词 (Particle)" data-th="คำอนุภาค (Part)" data-ja="助詞 (Particle)">ပစ္စည်း (Particle)</button>
              <button onclick="window.HtetDict.setPosFilter('interj')" data-pos-filter="interj" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer" data-mm="အာမေဍိတ် (Interjection)" data-en="Interjection" data-zh="感叹词 (Interj)" data-th="คำอุทาน (Interj)" data-ja="感嘆詞 (Interj)">အာမေဍိတ် (Interjection)</button>
              <button onclick="window.HtetDict.setPosFilter('pron')" data-pos-filter="pron" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer" data-mm="နာမ်စား (Pronoun)" data-en="Pronoun" data-zh="代词 (Pronoun)" data-th="คำสรรพนาม (Pron)" data-ja="代名詞 (Pronoun)">နာမ်စား (Pronoun)</button>
            </div>
          </div>

          <!-- Consonants Bar -->
          <div class="space-y-2 pt-2 border-t border-hairline">
            <span class="text-xs font-bold text-charcoal font-sans-ui" data-mm="ဗျည်းအက္ခရာ ရွေးချယ်ရန်:" data-en="Select Consonant:" data-zh="选择辅音字母:" data-th="เลือกพยัญชนะ:" data-ja="子音を選択:">ဗျည်းအက္ခရာ ရွေးချယ်ရန်:</span>
            <div class="flex flex-wrap gap-1">
              <button onclick="window.HtetDict.setConsonantFilter('ka')" data-cons-btn="ka" class="w-8 h-8 rounded-lg bg-teal-600 text-white font-sans-ui text-sm font-bold cursor-pointer">က</button>
              <button onclick="window.HtetDict.setConsonantFilter('kha')" data-cons-btn="kha" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ခ</button>
              <button onclick="window.HtetDict.setConsonantFilter('ga')" data-cons-btn="ga" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဂ</button>
              <button onclick="window.HtetDict.setConsonantFilter('gha')" data-cons-btn="gha" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဃ</button>
              <button onclick="window.HtetDict.setConsonantFilter('nga')" data-cons-btn="nga" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">င</button>
              <button onclick="window.HtetDict.setConsonantFilter('ca')" data-cons-btn="ca" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">စ</button>
              <button onclick="window.HtetDict.setConsonantFilter('cha')" data-cons-btn="cha" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဆ</button>
              <button onclick="window.HtetDict.setConsonantFilter('ja')" data-cons-btn="ja" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဇ</button>
              <button onclick="window.HtetDict.setConsonantFilter('jha')" data-cons-btn="jha" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဈ</button>
              <button onclick="window.HtetDict.setConsonantFilter('nya')" data-cons-btn="nya" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဉ/ည</button>
              <button onclick="window.HtetDict.setConsonantFilter('tta')" data-cons-btn="tta" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဋ/ဌ</button>
              <button onclick="window.HtetDict.setConsonantFilter('dda')" data-cons-btn="dda" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဍ/ဎ</button>
              <button onclick="window.HtetDict.setConsonantFilter('nna')" data-cons-btn="nna" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဏ</button>
              <button onclick="window.HtetDict.setConsonantFilter('ta')" data-cons-btn="ta" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">တ</button>
              <button onclick="window.HtetDict.setConsonantFilter('tha')" data-cons-btn="tha" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ထ</button>
              <button onclick="window.HtetDict.setConsonantFilter('da')" data-cons-btn="da" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဒ</button>
              <button onclick="window.HtetDict.setConsonantFilter('dha')" data-cons-btn="dha" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဓ</button>
              <button onclick="window.HtetDict.setConsonantFilter('na')" data-cons-btn="na" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">န</button>
              <button onclick="window.HtetDict.setConsonantFilter('pa')" data-cons-btn="pa" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ပ</button>
              <button onclick="window.HtetDict.setConsonantFilter('pha')" data-cons-btn="pha" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဖ</button>
              <button onclick="window.HtetDict.setConsonantFilter('ba')" data-cons-btn="ba" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဗ</button>
              <button onclick="window.HtetDict.setConsonantFilter('bha')" data-cons-btn="bha" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဘ</button>
              <button onclick="window.HtetDict.setConsonantFilter('ma')" data-cons-btn="ma" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">မ</button>
              <button onclick="window.HtetDict.setConsonantFilter('ya')" data-cons-btn="ya" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ယ</button>
              <button onclick="window.HtetDict.setConsonantFilter('ra')" data-cons-btn="ra" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ရ</button>
              <button onclick="window.HtetDict.setConsonantFilter('la')" data-cons-btn="la" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">လ</button>
              <button onclick="window.HtetDict.setConsonantFilter('wa')" data-cons-btn="wa" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဝ</button>
              <button onclick="window.HtetDict.setConsonantFilter('sa')" data-cons-btn="sa" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">သ</button>
              <button onclick="window.HtetDict.setConsonantFilter('ha')" data-cons-btn="ha" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဟ</button>
              <button onclick="window.HtetDict.setConsonantFilter('lla')" data-cons-btn="lla" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">ဠ</button>
              <button onclick="window.HtetDict.setConsonantFilter('a')" data-cons-btn="a" class="w-8 h-8 rounded-lg bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-sm font-bold hover:bg-teal-600 hover:text-white cursor-pointer">အ</button>
            </div>
          </div>
        </div>

        <!-- Words Grid Display -->
        <div id="mw-explorer-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"></div>

      </div>
    </div>

  </main>

  <!-- Editorial Master 4-Column Footer -->
  <footer class="border-t border-hairline bg-cream/70 dark:bg-stone-900/60 py-12 text-xs text-muted font-sans-ui transition-colors">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <div class="nav-brand-glass-icon w-8 h-8 rounded-xl flex items-center justify-center shrink-0" title="ထက် (Htet)">
            <img src="assets/favicon.svg" alt="ထက်" class="w-full h-full object-contain">
          </div>
          <span class="font-serif-editorial text-lg font-semibold text-charcoal">Htet Official</span>
        </div>
        <p class="leading-relaxed" data-mm="မြန်မာ Transgirl စာရေးဆရာမ၊ နိုင်ငံရေးဒဿနိကဗေဒ သုတေသီနှင့် လူမှုတက်ကြွလှုပ်ရှားသူ ထက်၏ တရားဝင် ဝက်ဘ်စာမျက်နှာ။" data-en="Official platform of Htet — Burmese trans writer, political philosophy researcher, and activist." data-zh="缅甸跨性别女性作家、政治哲学研究者及社会活动家 Htet 的官方平台。" data-th="แพลตฟอร์มอย่างเป็นทางการของ Htet — นักเขียนทรานส์เกิร์ลพม่า นักวิจัยปรัชญาการเมือง และนักกิจกรรม" data-ja="ミャンマーのトランス女性作家・政治哲学研究者・アクティビスト Htet（テッ）の公式プラットフォーム。">
          မြန်မာ Transgirl စာရေးဆရာမ၊ နိုင်ငံရေးဒဿနိကဗေဒ သုတေသီနှင့် လူမှုတက်ကြွလှုပ်ရှားသူ ထက်၏ တရားဝင် ဝက်ဘ်စာမျက်နှာ။
        </p>
      </div>

      <div>
        <h4 class="font-semibold text-charcoal uppercase tracking-wider mb-3 text-[11px]" data-mm="စာမျက်နှာများ" data-en="Navigation" data-zh="页面导航" data-th="การนำทาง" data-ja="ナビゲーション">စာမျက်နှာများ</h4>
        <ul class="space-y-2">
          <li><a href="index.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-home-5-line text-vermilion/70 group-hover:text-vermilion"></i> <span data-mm="ပင်မ" data-en="Home" data-zh="首页" data-th="หน้าแรก" data-ja="ホーム">ပင်မ</span></a></li>
          <li><a href="articles.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-article-line text-vermilion/70 group-hover:text-vermilion"></i> <span data-mm="ဆောင်းပါးများ" data-en="Articles" data-zh="学术文章" data-th="บทความ" data-ja="論考・論文">ဆောင်းပါးများ</span></a></li>
          <li><a href="publications.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-file-paper-2-line text-vermilion/70 group-hover:text-vermilion"></i> <span data-mm="ထုတ်ဝေမှုများ" data-en="Publications" data-zh="出版专著" data-th="ผลงานตีพิมพ์" data-ja="出版物・著作">ထုတ်ဝေမှုများ</span></a></li>
          <li><a href="journal.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-booklet-line text-vermilion/70 group-hover:text-vermilion"></i> <span data-mm="မှတ်စုနှင့် ပို့စ်များ" data-en="Journal & Posts" data-zh="随笔日志" data-th="บันทึกและข้อคิด" data-ja="ジャーナル・日誌">မှတ်စုနှင့် ပို့စ်များ</span></a></li>
          <li><a href="glossary.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-book-read-line text-vermilion/70 group-hover:text-vermilion"></i> <span data-mm="ဝေါဟာရအဘိဓာန်" data-en="Glossary" data-zh="术语辞典" data-th="พจนานุกรมศัพท์" data-ja="用語辞典">ဝေါဟာရအဘိဓာန်</span></a></li>
          <li><a href="dictionary.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group text-vermilion font-semibold"><i class="ri-book-2-fill text-vermilion"></i> <span data-mm="အဘိဓာန်" data-en="Dictionary" data-zh="英语词典" data-th="พจนานุกรม" data-ja="英緬辞典">အဘိဓာန်</span></a></li>
          <li><a href="about.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-user-smile-line text-vermilion/70 group-hover:text-vermilion"></i> <span data-mm="စာရေးသူအကြောင်း" data-en="About" data-zh="关于作者" data-th="เกี่ยวกับผู้เขียน" data-ja="著者について">စာရေးသူအကြောင်း</span></a></li>
          <li><a href="contact.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-mail-send-line text-vermilion/70 group-hover:text-vermilion"></i> <span data-mm="ဆက်သွယ်ရန်" data-en="Contact" data-zh="联系作者" data-th="ติดต่อ" data-ja="お問い合わせ">ဆက်သွယ်ရန်</span></a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold text-charcoal uppercase tracking-wider mb-3 text-[11px]" data-mm="တိုက်ရိုက်လိုင်းများ" data-en="Direct Channels" data-zh="官方频道" data-th="ช่องทางติดต่อ" data-ja="公式チャンネル">တိုက်ရိုက်လိုင်းများ</h4>
        <ul class="space-y-2">
          <li><a href="https://github.com/htetofficial/htetofficial.github.io/releases/tag/v1.2.0-beta" target="_blank" rel="noopener noreferrer" class="hover:text-vermilion transition-colors flex items-center space-x-1.5"><i class="ri-android-line text-emerald-600"></i> <span class="font-medium text-emerald-700 dark:text-emerald-400">Android App (v1.2.0-beta APK)</span></a></li>
          <li><a href="https://t.me/htetmmofficial" target="_blank" rel="noopener noreferrer" class="hover:text-vermilion transition-colors flex items-center space-x-1.5"><i class="ri-telegram-fill text-[#2AABEE]"></i> <span>Telegram: @htetmmofficial</span></a></li>
          <li><a href="https://t.me/womennationwomenkingdom" target="_blank" rel="noopener noreferrer" class="hover:text-vermilion transition-colors flex items-center space-x-1.5"><i class="ri-telegram-fill text-[#2AABEE]"></i> <span>@womennationwomenkingdom</span></a></li>
          <li><a href="https://t.me/ideahubmyanmar" target="_blank" rel="noopener noreferrer" class="hover:text-vermilion transition-colors flex items-center space-x-1.5"><i class="ri-telegram-fill text-[#2AABEE]"></i> <span>@ideahubmyanmar</span></a></li>
          <li><a href="https://t.me/ideahublibrary" target="_blank" rel="noopener noreferrer" class="hover:text-vermilion transition-colors flex items-center space-x-1.5"><i class="ri-book-open-fill text-amber-600"></i> <span>Library: @ideahublibrary (1,522+ PDFs)</span></a></li>
          <li><a href="https://facebook.com/htetmyatekri" target="_blank" rel="noopener noreferrer" class="hover:text-vermilion transition-colors flex items-center space-x-1.5"><i class="ri-facebook-circle-fill text-[#1877F2]"></i> <span>Facebook: htetmyatekri</span></a></li>
          <li><a href="mailto:htethtet2025ideahub@gmail.com" class="hover:text-vermilion transition-colors flex items-center space-x-1.5"><i class="ri-mail-line text-vermilion"></i> <span>htethtet2025ideahub@gmail.com</span></a></li>
        </ul>
      </div>

      <div class="space-y-3">
        <h4 class="font-semibold text-charcoal uppercase tracking-wider mb-3 text-[11px]" data-mm="တန်ဖိုးထားမှု" data-en="Commitment" data-zh="核心价值" data-th="พันธกิจ" data-ja="理念と使命">တန်ဖိုးထားမှု</h4>
        <p class="leading-relaxed" data-mm="ခွဲခြားဆက်ဆံမှု ကင်းမဲ့သော၊ ကျား၊ မ တန်းတူညီမျှပြီး တရားမျှတသော လူ့ဘောင် တည်ဆောက်ရေး။" data-en="Committed to an egalitarian, anti-oppressive society rooted in absolute justice." data-zh="致力于建设一个消除一切歧视、性别平等且崇尚正义的社会。" data-th="มุ่งมั่นสร้างสังคมที่ปราศจากการเลือกปฏิบัติ มีความเท่าเทียมทางเพศและความยุติธรรม" data-ja="あらゆる差別を撤廃し、ジェンダー平等と正義に基づく共生社会の構築を目指して。">
          ခွဲခြားဆက်ဆံမှု ကင်းမဲ့သော၊ ကျား၊ မ တန်းတူညီမျှပြီး တရားမျှတသော လူ့ဘောင် တည်ဆောက်ရေး။
        </p>
        <div class="pt-2">
          <span class="text-[11px] text-faint">© 2026 Htet (ထက်). All Rights Reserved.</span>
        </div>
      </div>
    </div>
  </footer>

  <!-- Core Scripts & Libraries -->
  <script src="js/bootstrap.bundle.min.js"></script>
  <script src="js/aos.js"></script>
  <script src="js/confetti.browser.min.js"></script>
  <script src="js/i18n.js"></script>
  <script src="js/pwa.js"></script>
  <script src="js/data-loader.js"></script>

  <!-- BurmeseNLP Engine -->
  <script src="js/burmesenlp.js"></script>

  <!-- Mobile Tap-to-Define & Interactive Vocabulary Popover Engine -->
  <script defer src="js/vocab-lookup.js"></script>

  <!-- Parallel Sentences Corpus (12,021 Pairs) -->
  <script src="js/data/translations/pairs.js"></script>

  <!-- Dictionary Metadata & Pre-cached Dictionaries -->
  <script src="js/data/dictionary/meta.js"></script>
  <script src="js/data/dictionary/common.js"></script>
  <script src="js/data/dictionary/reverse/meta.js"></script>
  <script src="js/data/dictionary/reverse/common.js"></script>
  <script src="js/data/myanmar-words/meta.js"></script>
  <script src="js/data/myanmar-words/pos_index.js"></script>

  <!-- Dictionary & NLP Workbench Controller -->
  <script src="js/dictionary.js"></script>

  <!-- Master Site Framework (Flyout Menu, Spotlight Search Modal ⌘K, Theme Sync) -->
  <script src="js/main.js"></script>

  <!-- LibreTranslate Server Settings Modal -->
  <div id="libre-settings-modal" class="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="w-full max-w-md p-6 rounded-3xl bg-card border border-hairline shadow-2xl space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-hairline">
        <div class="flex items-center space-x-2">
          <i class="ri-server-line text-indigo-600 text-xl"></i>
          <h3 class="text-lg font-bold font-serif-editorial text-charcoal m-0" data-mm="LibreTranslate ဆာဗာ သတ်မှတ်ချက်" data-en="LibreTranslate Server Settings" data-zh="LibreTranslate 服务器设置" data-th="การตั้งค่าเซิร์ฟเวอร์ LibreTranslate" data-ja="LibreTranslate サーバー設定">LibreTranslate ဆာဗာ သတ်မှတ်ချက်</h3>
        </div>
        <button onclick="window.HtetDict.closeLibreTranslateSettings()" class="w-8 h-8 rounded-full hover:bg-cream dark:hover:bg-stone-800 flex items-center justify-center text-muted hover:text-charcoal cursor-pointer" aria-label="Close">
          <i class="ri-close-line text-lg"></i>
        </button>
      </div>

      <div class="space-y-3 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-charcoal block">LibreTranslate API Endpoint URL:</label>
          <input 
            type="url" 
            id="libre-setting-url" 
            placeholder="http://localhost:5000" 
            class="w-full p-2.5 rounded-xl bg-cream/40 dark:bg-stone-900/40 border border-hairline font-mono text-charcoal focus:border-indigo-500 focus:outline-none"
          >
          <p class="text-[11px] text-muted">ဥပမာ: http://localhost:5000 (Local Docker) သို့မဟုတ် https://libretranslate.com</p>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-charcoal block">API Key (သတ်မှတ်ထားပါက):</label>
          <input 
            type="password" 
            id="libre-setting-key" 
            placeholder="Optional API Key" 
            class="w-full p-2.5 rounded-xl bg-cream/40 dark:bg-stone-900/40 border border-hairline font-mono text-charcoal focus:border-indigo-500 focus:outline-none"
          >
        </div>

        <div class="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 text-indigo-900 dark:text-indigo-200 space-y-1">
          <span class="font-bold flex items-center space-x-1"><i class="ri-terminal-box-line"></i><span>Local Docker ဖြင့် အသုံးပြုလိုပါက:</span></span>
          <pre class="font-mono text-[10px] p-2 rounded-lg bg-black/40 text-emerald-300 overflow-x-auto select-all">docker run -ti --rm -p 5000:5000 libretranslate/libretranslate</pre>
        </div>
      </div>

      <div class="flex items-center justify-end space-x-2 pt-2 border-t border-hairline">
        <button onclick="window.HtetDict.closeLibreTranslateSettings()" class="px-4 py-2 rounded-xl text-muted hover:text-charcoal cursor-pointer font-medium text-xs" data-mm="မလုပ်ဆောင်ပါ" data-en="Cancel" data-zh="取消" data-th="ยกเลิก" data-ja="キャンセル">
          မလုပ်ဆောင်ပါ
        </button>
        <button onclick="window.HtetDict.saveLibreTranslateSettings()" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors" data-mm="သိမ်းဆည်းမည်" data-en="Save Settings" data-zh="保存设置" data-th="บันทึกการตั้งค่า" data-ja="設定を保存">
          သိမ်းဆည်းမည်
        </button>
      </div>
    </div>
  </div>

</body>
</html>
'''

with open('dictionary.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

with open('scripts/generate_dictionary_html.py', 'w', encoding='utf-8') as f:
    f.write(f'''#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generator script for dictionary.html"""

html_content = \'\'\'{html_content}\'\'\'

with open('dictionary.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Successfully generated dictionary.html ({{len(html_content)}} bytes)")
''')

print(f"Successfully wrote updated dictionary.html and synced scripts/generate_dictionary_html.py ({len(html_content)} bytes)")
