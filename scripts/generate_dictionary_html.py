# -*- coding: utf-8 -*-
import os

html_content = '''<!DOCTYPE html>
<html lang="my" data-lang="mm">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">

  <!-- Critical Anti-FOUC & Anti-Flash Engine -->
  <script>
    (function() {
      try {
        var validThemes = [
          'light', 'sepia', 'dark', 'amoled',
          'green', 'green-forest',
          'blue', 'blue-sapphire',
          'red', 'red-crimson', 'red-rosewood',
          'purple', 'purple-lavender', 'purple-plum', 'purple-indigo',
          'pink', 'pink-peach', 'pink-rose'
        ];
        var savedTheme = null;
        try { savedTheme = localStorage.getItem('site_theme'); } catch(e) {}
        var theme = (savedTheme && validThemes.indexOf(savedTheme) !== -1) ? savedTheme : 'light';
        
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark' || theme === 'amoled') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        var themeBgs = {
          light: '#FAF8F5',
          sepia: '#F5EEDB',
          dark: '#121110',
          amoled: '#000000',
          green: '#F5FAF6',
          'green-forest': '#F4F8F5',
          blue: '#F4F8FD',
          'blue-sapphire': '#F3F7FC',
          red: '#FAF5F5',
          'red-crimson': '#FAF4F5',
          'red-rosewood': '#FAF6F3',
          purple: '#F8F6FD',
          'purple-lavender': '#F8F7FD',
          'purple-plum': '#F9F5FA',
          'purple-indigo': '#F5F6FC',
          pink: '#FDF6F8',
          'pink-peach': '#FDF7F4',
          'pink-rose': '#FDF5F7'
        };
        if (themeBgs[theme]) {
          document.documentElement.style.backgroundColor = themeBgs[theme];
        }
      } catch (e) {}

      try {
        var validLangs = ['mm', 'en', 'zh', 'th', 'ja'];
        var savedLang = localStorage.getItem('site_lang');
        var lang = (validLangs.indexOf(savedLang) !== -1) ? savedLang : 'mm';
        document.documentElement.setAttribute('data-lang', lang);
      } catch (e) {}
    })();
  </script>

  <title>အဘိဓာန်၊ ဘာသာပြန်နှင့် မြန်မာစာ NLP စတူဒီယို | Htet Official Dual Dictionary & BurmeseNLP</title>
  <meta name="description" content="Ornagai အင်္ဂလိပ်-မြန်မာ အဘိဓာန် (111K+ Words)၊ Reverse Myanmar-to-English (196K+ Words)၊ Myanmar Tools ဝေါဟာရများ (42K+ Words)၊ HuggingFace ဝါကျစုံတွဲများ (12K+ Pairs) နှင့် Mozilla PDF.js Offline Reader ပေါင်းစပ် ဘာသာစကားစနစ်။">

  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="stylesheet" href="css/custom.css">
  <link rel="stylesheet" href="css/remixicon.css">

  <style>
    @font-face {
      font-family: 'Pyidaungsu';
      src: url('fonts/Pyidaungsu-Regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Pyidaungsu';
      src: url('fonts/Pyidaungsu-Bold.ttf') format('truetype');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Cormorant Garamond';
      src: url('fonts/CormorantGaramond-Regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Cormorant Garamond';
      src: url('fonts/CormorantGaramond-Bold.ttf') format('truetype');
      font-weight: bold;
      font-style: normal;
      font-display: swap;
    }
    body {
      font-family: 'Pyidaungsu', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .font-serif-editorial {
      font-family: 'Cormorant Garamond', 'Pyidaungsu', Georgia, serif;
    }
    .font-sans-ui {
      font-family: 'Pyidaungsu', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .hanko-stamp {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid #C84B31;
      color: #C84B31;
      border-radius: 4px;
      line-height: 1;
      font-weight: 700;
      letter-spacing: 0.05em;
      user-select: none;
    }
  </style>

  <!-- Tailwind CDN & Config -->
  <script src="js/tailwind.min.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            vermilion: '#C84B31',
            charcoal: '#2D4263',
            ivory: '#FAF8F5',
            cream: '#F5EEDB',
            hairline: 'rgba(45, 66, 99, 0.12)',
            faint: 'rgba(45, 66, 99, 0.05)',
            muted: '#6B7280',
            card: 'var(--bg-card, #FFFFFF)'
          }
        }
      }
    };
  </script>
  <script src="js/theme.js"></script>
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
          <a href="journal.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="မှတ်စုနှင့် ပို့စ်များ" data-en="Journal & Posts" data-zh="随笔日志" data-th="บันทึกและข้อคิด" data-ja="ジャーナル・日誌">မှတ်စုနှင့် ပို့စ်များ</a>
          <a href="glossary.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="ဝေါဟာရအဘိဓာန်" data-en="Glossary" data-zh="术语辞典" data-th="พจนานุกรมศัพท์" data-ja="用語辞典">ဝေါဟာရအဘိဓာန်</a>
          <a href="dictionary.html" class="nav-link-pill px-2.5 2xl:px-3.5 py-1 2xl:py-1.5 rounded-full active bg-vermilion text-white font-medium shadow-xs" data-mm="အဘိဓာန်" data-en="Dictionary" data-zh="英语词典" data-th="พจนานุกรม" data-ja="英緬辞典">အဘိဓာန်</a>
          <a href="about.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="စာရေးသူအကြောင်း" data-en="About" data-zh="关于作者" data-th="เกี่ยวกับผู้เขียน" data-ja="著者について">စာရေးသူအကြောင်း</a>
          <a href="contact.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="ဆက်သွယ်ရန်" data-en="Contact" data-zh="联系作者" data-th="ติดต่อ" data-ja="お問い合わせ">ဆက်သွယ်ရန်</a>
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
              <span data-mm="ဘာသာစကား ရွေးရန်" data-en="Select Language">ဘာသာစကား ရွေးရန်</span>
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
                <span class="font-semibold text-charcoal">ภาษาไทย</span>
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

        <!-- Direct Telegram Quick Link -->
        <a href="https://t.me/htetmmofficial" target="_blank" rel="noopener noreferrer" class="hidden 2xl:flex nav-util-btn w-8 h-8 rounded-full border border-hairline/80 bg-cream/60 dark:bg-stone-900/50 text-[#2AABEE] hover:bg-[#2AABEE] hover:text-white hover:border-[#2AABEE] transition-all items-center justify-center shadow-xs" title="Official Telegram (@htetmmofficial)">
          <i class="ri-telegram-fill text-sm"></i>
        </a>

        <!-- Mobile Menu Toggle -->
        <button id="mobile-menu-toggle" class="lg:hidden nav-util-btn w-8 h-8 rounded-full border border-hairline/80 bg-cream/60 dark:bg-stone-900/50 flex items-center justify-center text-charcoal hover:text-vermilion focus:outline-none transition-colors" aria-label="Open Navigation">
          <i class="ri-menu-3-line text-base"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Menu Overlay & Drawer -->
  <div id="mobile-menu-overlay" style="display: none;" class="fixed inset-0 bg-charcoal/40 dark:bg-black/60 backdrop-blur-sm z-40 hidden opacity-0 transition-opacity duration-300"></div>

  <div id="mobile-menu-drawer" style="visibility: hidden; transform: translateX(-100%); -webkit-transform: translateX(-100%); pointer-events: none;" class="fixed top-0 left-0 bottom-0 w-80 sm:w-88 max-w-[88vw] bg-ivory dark:bg-[#141312] z-50 border-r border-hairline p-4 sm:p-5 flex flex-col justify-between shadow-2xl overflow-y-auto overscroll-contain">
    <div>
      <div class="flex items-center justify-between pb-4 border-b border-hairline">
        <a href="index.html" class="flex items-center space-x-3 group">
          <div class="nav-brand-glass-icon w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-hairline/80">
            <img src="assets/favicon.svg" alt="ထက်" class="w-6 h-6 object-contain">
          </div>
          <div class="flex flex-col">
            <span class="font-serif-editorial text-xl font-bold tracking-tight text-charcoal leading-none">HTET</span>
            <span class="text-[10px] tracking-wider text-muted uppercase font-sans-ui mt-1" data-mm="စာရေးဆရာမ • သုတေသီ">စာရေးဆရာမ • သုတေသီ</span>
          </div>
        </a>
        <button id="mobile-menu-close" class="w-8 h-8 rounded-full border border-hairline/80 bg-cream/50 dark:bg-stone-900/50 flex items-center justify-center text-muted hover:text-charcoal cursor-pointer" aria-label="Close Navigation">
          <i class="ri-close-line text-lg"></i>
        </button>
      </div>

      <nav class="flex flex-col space-y-1 py-3 font-sans-ui text-sm">
        <a href="index.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60">
          <span class="flex items-center space-x-2.5">
            <i class="ri-home-5-line text-muted"></i>
            <span>ပင်မ</span>
          </span>
          <i class="ri-arrow-right-s-line text-sm text-muted/50"></i>
        </a>
        <a href="articles.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60">
          <span class="flex items-center space-x-2.5">
            <i class="ri-article-line text-muted"></i>
            <span>ဆောင်းပါးများ</span>
          </span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-cream dark:bg-stone-800 text-muted font-mono font-bold">25</span>
        </a>
        <a href="publications.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60">
          <span class="flex items-center space-x-2.5">
            <i class="ri-book-2-line text-muted"></i>
            <span>ထုတ်ဝေမှုများ</span>
          </span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-cream dark:bg-stone-800 text-muted font-mono font-bold">4</span>
        </a>
        <a href="journal.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60">
          <span class="flex items-center space-x-2.5">
            <i class="ri-booklet-line text-muted"></i>
            <span>မှတ်စုနှင့် ပို့စ်များ</span>
          </span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-cream dark:bg-stone-800 text-muted font-mono font-bold">14</span>
        </a>
        <a href="glossary.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60">
          <span class="flex items-center space-x-2.5">
            <i class="ri-book-read-line text-muted"></i>
            <span>ဝေါဟာရအဘိဓာန်</span>
          </span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-cream dark:bg-stone-800 text-muted font-mono font-bold">42</span>
        </a>
        <a href="dictionary.html" class="drawer-nav-item active flex items-center justify-between px-3 py-2 rounded-2xl font-medium bg-vermilion text-white shadow-xs">
          <span class="flex items-center space-x-2.5">
            <i class="ri-book-2-fill text-white"></i>
            <span>အဘိဓာန်နှင့် NLP</span>
          </span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono font-bold">111K+</span>
        </a>
        <a href="about.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60">
          <span class="flex items-center space-x-2.5">
            <i class="ri-user-smile-line text-muted"></i>
            <span>စာရေးသူအကြောင်း</span>
          </span>
        </a>
        <a href="contact.html" class="drawer-nav-item flex items-center justify-between px-3 py-2 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60">
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
        <span>ပင်မ</span>
      </a>
      <span class="opacity-40">/</span>
      <span class="text-charcoal font-semibold flex items-center space-x-1">
        <i class="ri-book-2-line text-vermilion"></i>
        <span>အဘိဓာန်နှင့် ဘာသာစကား NLP စတူဒီယို</span>
      </span>
    </div>
  </div>

  <!-- Main Content Container -->
  <main class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
    
    <!-- Hero Banner with Japanese Editorial Hanko Stamp -->
    <div class="text-center space-y-3 max-w-3xl mx-auto">
      <div class="flex items-center justify-center space-x-2">
        <span class="hanko-stamp px-2.5 py-0.5 text-xs font-semibold">အဘိဓာန်</span>
        <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-300 dark:border-teal-700/60 shadow-xs">
          <i class="ri-translate-2"></i>
          <span>Ornagai • Myanmar Tools • BurmeseNLP • kalixlouiis Corpus</span>
        </span>
      </div>

      <h1 class="text-3xl sm:text-5xl font-black font-serif-editorial text-charcoal tracking-tight">
        အဘိဓာန်၊ ဘာသာပြန်နှင့် NLP စတူဒီယို
      </h1>
      <p class="text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
        Ornagai အင်္ဂလိပ်-မြန်မာ (၁၁၁,၂၃၂ လုံး)၊ Myanmar Tools ဝေါဟာရများ (၄၂,၇၈၇ လုံး)၊ HuggingFace ဝါကျစုံတွဲများ (၁၂,၀၂၁ ခု) နှင့် Mozilla PDF.js Offline Reader ပေါင်းစပ် ဘာသာစကားသုတေသနစနစ်။
      </p>

      <!-- Stats Chips -->
      <div class="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-xs">
        <span class="px-2.5 py-1 rounded-lg bg-cream/70 dark:bg-stone-800 text-charcoal border border-hairline font-bold">111,232 En Words</span>
        <span class="px-2.5 py-1 rounded-lg bg-cream/70 dark:bg-stone-800 text-charcoal border border-hairline font-bold">196,202 Reverse Pairs</span>
        <span class="px-2.5 py-1 rounded-lg bg-cream/70 dark:bg-stone-800 text-charcoal border border-hairline font-bold">42,787 My Words</span>
        <span class="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-300 font-bold">12,021 Parallel Pairs</span>
        <span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 font-bold">100% Offline Ready</span>
      </div>

      <!-- Feature Tabs Switcher (5 Subsystems) -->
      <div class="pt-4 flex justify-center overflow-x-auto pb-1">
        <div class="inline-flex items-center p-1.5 rounded-2xl bg-cream/80 dark:bg-stone-900 border border-hairline shadow-xs font-sans-ui text-xs font-semibold gap-1">
          <button onclick="window.HtetDict.switchTab('tab-dict')" data-tab-target="tab-dict" class="dict-tab-btn active px-3.5 py-2 rounded-xl bg-teal-600 text-white shadow-xs transition-all cursor-pointer flex items-center space-x-1.5 shrink-0">
            <i class="ri-book-2-line"></i>
            <span>အဘိဓာန် ရှာဖွေမှု (Dual Dict)</span>
          </button>
          <button onclick="window.HtetDict.switchTab('tab-sentences')" data-tab-target="tab-sentences" class="dict-tab-btn px-3.5 py-2 rounded-xl text-muted hover:text-charcoal transition-all cursor-pointer flex items-center space-x-1.5 shrink-0">
            <i class="ri-translate-2"></i>
            <span>ဝါကျဘာသာပြန် (12K+ Corpus)</span>
          </button>
          <button onclick="window.HtetDict.switchTab('tab-nlp')" data-tab-target="tab-nlp" class="dict-tab-btn px-3.5 py-2 rounded-xl text-muted hover:text-charcoal transition-all cursor-pointer flex items-center space-x-1.5 shrink-0">
            <i class="ri-cpu-line"></i>
            <span>မြန်မာစာ NLP (Workbench)</span>
          </button>
          <button onclick="window.HtetDict.switchTab('tab-explorer')" data-tab-target="tab-explorer" class="dict-tab-btn px-3.5 py-2 rounded-xl text-muted hover:text-charcoal transition-all cursor-pointer flex items-center space-x-1.5 shrink-0">
            <i class="ri-folder-word-line"></i>
            <span>သဒ္ဒါအလိုက် ဝေါဟာရများ (42K+)</span>
          </button>
          <button onclick="window.HtetDict.switchTab('tab-pdf')" data-tab-target="tab-pdf" class="dict-tab-btn px-3.5 py-2 rounded-xl text-muted hover:text-charcoal transition-all cursor-pointer flex items-center space-x-1.5 shrink-0">
            <i class="ri-file-pdf-2-line text-vermilion"></i>
            <span>သုတေသန PDF စာတမ်းများ</span>
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
            autocomplete="off" 
            autocorrect="off" 
            autocapitalize="off"
            spellcheck="false"
            class="w-full py-4 px-2 text-base sm:text-lg bg-transparent text-charcoal placeholder-muted focus:outline-none font-medium"
          >
          <div id="dict-direction-indicator" class="mr-2 hidden sm:block shrink-0">
            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-400/30">Auto Detect</span>
          </div>
          <button onclick="window.HtetDict.lookup(document.getElementById('dict-search-input').value)" class="mr-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all cursor-pointer shadow-xs active:scale-95 shrink-0">
            ရှာဖွေရန်
          </button>
        </div>

        <!-- Quick Word Suggestions -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs text-muted font-medium scrollbar-thin">
          <span class="shrink-0 text-slate-500 font-bold">စမ်းသပ်ရန်:</span>
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
            <span>အင်္ဂလိပ် အက္ခရာအလိုက် ရှာဖွေရန် (Browse English A to Z)</span>
          </span>
          <span class="text-[11px] text-muted font-mono">27 Letter Partitions</span>
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
                <span>စကားလုံးများ စာရင်း</span>
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
                <span>မှတ်သားထားသော စကားလုံးများ</span>
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
            <h3 class="text-xl font-bold font-serif-editorial text-charcoal">စကားလုံး ရှာဖွေပါ</h3>
            <p class="text-sm text-muted max-w-md mx-auto">
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
            autocomplete="off" 
            class="w-full py-4 px-2 text-base sm:text-lg bg-transparent text-charcoal placeholder-muted focus:outline-none font-medium"
          >
          <button onclick="window.HtetDict.searchSentences(document.getElementById('sentence-search-input').value)" class="mr-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all cursor-pointer shadow-xs shrink-0">
            ရှာဖွေရန်
          </button>
        </div>

        <!-- Quick Sample Queries -->
        <div class="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs text-muted font-medium scrollbar-thin">
          <span class="shrink-0 text-slate-500 font-bold">နမူနာများ:</span>
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
          <span id="sentence-match-count" class="font-mono text-[11px] font-bold text-teal-700 dark:text-teal-300">
            ဝါကျပေါင်း ၁၂,၀၂၁ ခု အသင့်ရှိသည်
          </span>
        </div>

        <!-- Results List -->
        <div id="sentence-results-list" class="space-y-3"></div>

        <div id="sentence-empty-state" class="p-12 text-center rounded-3xl bg-card border border-hairline text-muted space-y-3">
          <div class="w-14 h-14 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center text-2xl">
            <i class="ri-chat-check-line"></i>
          </div>
          <h3 class="text-lg font-bold font-serif-editorial text-charcoal">ရှာဖွေလိုသော စကားစု ရိုက်ထည့်ပါ</h3>
          <p class="text-xs text-muted max-w-md mx-auto">
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
            <h2 class="text-2xl font-bold font-serif-editorial text-charcoal m-0">BurmeseNLP Workbench</h2>
            <p class="text-xs text-muted font-sans-ui m-0">မြန်မာစာ သရ/ဗျည်းအဖြတ်အတောက် (Sylbreak)၊ စကားလုံးခွဲခြမ်းခြင်း နှင့် သဒ္ဒါခွဲခြားမှု စနစ်</p>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-400/30 shrink-0">
            burmesenlp Web Engine + Myanmar Dataset Collection
          </span>
        </div>

        <!-- Sample Presets -->
        <div class="flex flex-wrap items-center gap-1.5 text-xs text-muted">
          <span class="font-bold">နမူနာ စာကြောင်းများ:</span>
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
            class="w-full p-4 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline focus:border-teal-500 focus:outline-none text-charcoal font-sans-ui text-base leading-relaxed"
          >စစ်မှန်သော လွတ်မြောက်ခြင်းသည် ကြောက်ရွံ့မှုမှ လွတ်မြောက်ခြင်း ဖြစ်သည်။</textarea>

          <div class="flex items-center justify-between">
            <span class="text-xs text-muted italic">Client-side Offline Execution • Zero Latency</span>
            <button onclick="window.HtetDict.runNlpWorkbench()" class="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all cursor-pointer shadow-xs active:scale-95">
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
              <span>၁။ ဖောင့်ကုဒ်စနစ် စစ်ဆေးခြင်း (Font Encoding Detection & Conversion)</span>
            </h3>
            <div id="nlp-out-zguni"></div>
          </div>

          <!-- 2. Sylbreak Output -->
          <div class="space-y-2">
            <h3 class="text-xs font-bold text-muted uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <i class="ri-scissors-cut-line text-teal-600"></i>
              <span>၂။ သရ/ဗျည်း အဖြတ်အတောက် (Syllable Segmentation)</span>
            </h3>
            <div id="nlp-out-syllables" class="flex flex-wrap gap-1.5 p-4 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline min-h-[50px] items-center"></div>
          </div>

          <!-- 3. Word Tokenization -->
          <div class="space-y-2">
            <h3 class="text-xs font-bold text-muted uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <i class="ri-node-tree text-teal-600"></i>
              <span>၃။ စကားလုံး ခွဲခြမ်းမှု (Greedy Longest Match Tokenization)</span>
            </h3>
            <div id="nlp-out-tokens" class="flex flex-wrap gap-1.5 p-4 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline min-h-[50px] items-center"></div>
          </div>

          <!-- 4. POS Tagging -->
          <div class="space-y-2">
            <h3 class="text-xs font-bold text-muted uppercase tracking-wider font-mono flex items-center space-x-1.5">
              <i class="ri-price-tag-3-line text-teal-600"></i>
              <span>၄။ သဒ္ဒါခွဲခြားမှု (Part-of-Speech Tagging - myPOS)</span>
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
            <h2 class="text-xl font-bold font-serif-editorial text-charcoal m-0">Myanmar Tools ဝေါဟာရ စူးစမ်းခန်း (၄၂,၇၈၇ လုံး)</h2>
            <p class="text-xs text-muted font-sans-ui m-0">မြန်မာစာပေ သဒ္ဒါအမျိုးအစားများနှင့် ဗျည်းအက္ခရာ ၃၃ လုံးအလိုက် အမျိုးအစားခွဲခြားထားသော ဝေါဟာရဘဏ်</p>
          </div>

          <!-- 9 POS Filter Pills -->
          <div class="space-y-2">
            <span class="text-xs font-bold text-charcoal font-sans-ui">သဒ္ဒါ အမျိုးအစား ရွေးချယ်ရန်:</span>
            <div class="flex flex-wrap gap-1.5">
              <button onclick="window.HtetDict.setPosFilter('n')" data-pos-filter="n" class="px-3 py-1 rounded-xl bg-teal-600 text-white font-sans-ui text-xs font-semibold cursor-pointer shadow-xs">နာမ် (Noun)</button>
              <button onclick="window.HtetDict.setPosFilter('v')" data-pos-filter="v" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer">ကြိယာ (Verb)</button>
              <button onclick="window.HtetDict.setPosFilter('adj')" data-pos-filter="adj" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer">နာမဝိသေသန (Adj)</button>
              <button onclick="window.HtetDict.setPosFilter('adv')" data-pos-filter="adv" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer">ကြိယာဝိသေသန (Adv)</button>
              <button onclick="window.HtetDict.setPosFilter('postp')" data-pos-filter="postp" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer">ဝိဘတ် (Postposition)</button>
              <button onclick="window.HtetDict.setPosFilter('conj')" data-pos-filter="conj" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer">စကားစပ် (Conjunction)</button>
              <button onclick="window.HtetDict.setPosFilter('part')" data-pos-filter="part" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer">ပစ္စည်း (Particle)</button>
              <button onclick="window.HtetDict.setPosFilter('interj')" data-pos-filter="interj" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer">အာမေဍိတ် (Interjection)</button>
              <button onclick="window.HtetDict.setPosFilter('pron')" data-pos-filter="pron" class="px-3 py-1 rounded-xl bg-cream/60 dark:bg-stone-800 text-charcoal font-sans-ui text-xs font-semibold hover:bg-teal-600 hover:text-white cursor-pointer">နာမ်စား (Pronoun)</button>
            </div>
          </div>

          <!-- Consonants Bar -->
          <div class="space-y-2 pt-2 border-t border-hairline">
            <span class="text-xs font-bold text-charcoal font-sans-ui">ဗျည်းအက္ခရာ ရွေးချယ်ရန်:</span>
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

    <!-- ======================================================== -->
    <!-- TAB 5: MOZILLA PDF.JS ACADEMIC READER VIEW                -->
    <!-- ======================================================== -->
    <div id="tab-pdf" class="dict-view-tab space-y-6 hidden">
      <div class="max-w-5xl mx-auto space-y-6">
        
        <!-- Header Banner -->
        <div class="p-6 rounded-3xl bg-card border border-hairline shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center space-x-2">
              <span class="w-8 h-8 rounded-xl bg-vermilion/10 text-vermilion flex items-center justify-center text-lg">
                <i class="ri-file-pdf-2-line"></i>
              </span>
              <h2 class="text-xl sm:text-2xl font-bold font-serif-editorial text-charcoal m-0">
                သုတေသန စာတမ်းများ ဖတ်ရှုခန်း
              </h2>
            </div>
            <p class="text-xs text-muted font-sans-ui m-0">
              Mozilla PDF.js Offline Engine ဖြင့် စာတမ်းများကို ဒေါင်းလုဒ်မလိုဘဲ Browser တွင် တိုက်ရိုက် ကြည်လင်ပြတ်သားစွာ ဖတ်ရှုနိုင်ပါသည်။
            </p>
          </div>

          <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30 shrink-0">
            PDF.js v3.11 Offline Engine Active
          </span>
        </div>

        <!-- Featured Research Publications Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <!-- Card 1: Aung San Suu Kyi 81st Birthday Tribute -->
          <div class="p-5 rounded-3xl bg-card border border-hairline/80 hover:border-vermilion/40 transition-all shadow-xs space-y-4 flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                <img src="assets/images/daw-aung-san-suu-kyi-81st-birthday-tribute.jpg" alt="ဒေါ်အောင်ဆန်းစုကြည်" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-vermilion text-white text-[10px] font-bold">၈၁ နှစ်ပြည့် မွေးနေ့</span>
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-mono text-muted uppercase">Tribute &amp; Historical Study</span>
                <h3 class="text-base font-bold font-serif-editorial text-charcoal leading-snug group-hover:text-vermilion transition-colors">
                  ဒေါ်အောင်ဆန်းစုကြည်၏ (၈၁) နှစ်ပြည့် မွေးနေ့ဆုတောင်းနှင့် သမိုင်းဝင်မိန့်ခွန်းများ
                </h3>
                <p class="text-xs text-muted leading-relaxed line-clamp-3">
                  "The only real prison is fear, and the only real freedom is Freedom from Fear" — နိုင်ငံတော်၏ အတိုင်ပင်ခံပုဂ္ဂိုလ်၏ သမိုင်းဝင် အမှာစကားများနှင့် နိုင်ငံရေးအတွေးအခေါ် စာတမ်း။
                </p>
              </div>
            </div>

            <div class="pt-3 border-t border-hairline flex items-center justify-between gap-2">
              <button data-open-pdf="downloads/daw-aung-san-suu-kyi-81st-birthday-tribute.pdf" data-pdf-title="ဒေါ်အောင်ဆန်းစုကြည် (၈၁) နှစ်ပြည့် မွေးနေ့ဆုတောင်း စာတမ်း" class="flex-1 py-2 px-3 rounded-xl bg-vermilion hover:bg-vermilion/90 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs">
                <i class="ri-book-open-line"></i>
                <span>PDF ဖတ်ရှုမည်</span>
              </button>
              <a href="downloads/daw-aung-san-suu-kyi-81st-birthday-tribute.pdf" download class="p-2 rounded-xl bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-vermilion border border-hairline transition-colors text-xs" title="မူရင်း PDF ဒေါင်းလုဒ်">
                <i class="ri-download-2-line"></i>
              </a>
            </div>
          </div>

          <!-- Card 2: Freedom from Fear (1990) -->
          <div class="p-5 rounded-3xl bg-card border border-hairline/80 hover:border-vermilion/40 transition-all shadow-xs space-y-4 flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                <img src="assets/images/daw-aung-san-suu-kyi-2019-portrait.jpg" alt="Freedom from Fear" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-charcoal text-white text-[10px] font-bold">၁၉၉၀ သမိုင်းဝင် Essay</span>
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-mono text-muted uppercase">Political Philosophy</span>
                <h3 class="text-base font-bold font-serif-editorial text-charcoal leading-snug group-hover:text-vermilion transition-colors">
                  Aung San Suu Kyi — Freedom from Fear (ကြောက်ရွံ့ခြင်းမှ လွတ်ကင်းရေး)
                </h3>
                <p class="text-xs text-muted leading-relaxed line-clamp-3">
                  အာဏာသည် ဖျက်ဆီးတတ်သည် မဟုတ်၊ ကြောက်ရွံ့ခြင်းကသာ အာဏာကိုင်စွဲသူတို့ကို ဖျက်ဆီးခြင်းဖြစ်သည်ဟူသော ဒေါ်အောင်ဆန်းစုကြည်၏ ဂန္ထဝင်စာတမ်း မူရင်းနှင့် မြန်မာပြန်။
                </p>
              </div>
            </div>

            <div class="pt-3 border-t border-hairline flex items-center justify-between gap-2">
              <button data-open-pdf="downloads/aung-san-suu-kyi-freedom-from-fear-1990-mm.pdf" data-pdf-title="Freedom from Fear — ကြောက်ရွံ့ခြင်းမှ လွတ်ကင်းရေး" class="flex-1 py-2 px-3 rounded-xl bg-vermilion hover:bg-vermilion/90 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs">
                <i class="ri-book-open-line"></i>
                <span>PDF ဖတ်ရှုမည်</span>
              </button>
              <a href="downloads/aung-san-suu-kyi-freedom-from-fear-1990-mm.pdf" download class="p-2 rounded-xl bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-vermilion border border-hairline transition-colors text-xs" title="မူရင်း PDF ဒေါင်းလုဒ်">
                <i class="ri-download-2-line"></i>
              </a>
            </div>
          </div>

          <!-- Card 3: Nobel Peace Acceptance Speech 1991 -->
          <div class="p-5 rounded-3xl bg-card border border-hairline/80 hover:border-vermilion/40 transition-all shadow-xs space-y-4 flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                <img src="assets/images/daw-aung-san-suu-kyi-1991-nobel-study-cover.svg" alt="Nobel Speech" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold">နိုဘယ်ငြိမ်းချမ်းရေးဆု</span>
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-mono text-muted uppercase">Nobel Peace Prize 1991</span>
                <h3 class="text-base font-bold font-serif-editorial text-charcoal leading-snug group-hover:text-vermilion transition-colors">
                  ဒေါ်အောင်ဆန်းစုကြည် ၁၉၉၁ နိုဘယ်ငြိမ်းချမ်းရေးဆု မိန့်ခွန်း မြန်မာပြန်လေ့လာချက်
                </h3>
                <p class="text-xs text-muted leading-relaxed line-clamp-3">
                  သားဖြစ်သူ အလက်ဇန်းဒါးအဲရစ် ကိုယ်စားဖတ်ကြားခဲ့သော နိုဘယ်မိန့်ခွန်းနှင့် မြန်မာ့ဒီမိုကရေစီလှုပ်ရှားမှု သမိုင်းမှတ်တမ်း။
                </p>
              </div>
            </div>

            <div class="pt-3 border-t border-hairline flex items-center justify-between gap-2">
              <button data-open-pdf="downloads/aung-san-suu-kyi-1991-nobel-acceptance-speech-mm.pdf" data-pdf-title="၁၉၉၁ နိုဘယ်ငြိမ်းချမ်းရေးဆု မိန့်ခွန်း မြန်မာပြန်" class="flex-1 py-2 px-3 rounded-xl bg-vermilion hover:bg-vermilion/90 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs">
                <i class="ri-book-open-line"></i>
                <span>PDF ဖတ်ရှုမည်</span>
              </button>
              <a href="downloads/aung-san-suu-kyi-1991-nobel-acceptance-speech-mm.pdf" download class="p-2 rounded-xl bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-vermilion border border-hairline transition-colors text-xs" title="မူရင်း PDF ဒေါင်းလုဒ်">
                <i class="ri-download-2-line"></i>
              </a>
            </div>
          </div>

          <!-- Card 4: Helen Keller Monograph -->
          <div class="p-5 rounded-3xl bg-card border border-hairline/80 hover:border-vermilion/40 transition-all shadow-xs space-y-4 flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                <img src="assets/images/helen-keller-cover.jpg" alt="Helen Keller" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-bold">လူမှုတော်လှန်ရေး</span>
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-mono text-muted uppercase">Socialist Activism &amp; Disability Rights</span>
                <h3 class="text-base font-bold font-serif-editorial text-charcoal leading-snug group-hover:text-vermilion transition-colors">
                  အမှောင်ထုထဲမှ တွန်းလှန်အသံများ: ဟယ်လင်ကဲလား၏ လူမှုတော်လှန်ရေး သမိုင်း
                </h3>
                <p class="text-xs text-muted leading-relaxed line-clamp-3">
                  စာမျက်နှာ ၄၆ မျက်နှာပါ ဟယ်လင်ကဲလား၏ ဆိုရှယ်လစ်နိုင်ငံရေး အတွေးအခေါ်နှင့် အလုပ်သမားလူတန်းစား တိုက်ပွဲဝင်မှု ပြည့်စုံသော စာတမ်း။
                </p>
              </div>
            </div>

            <div class="pt-3 border-t border-hairline flex items-center justify-between gap-2">
              <button data-open-pdf="downloads/Helen-Keller-Radical-Monograph-MM.pdf" data-pdf-title="ဟယ်လင်ကဲလား၏ လူမှုတော်လှန်ရေး စာတမ်း" class="flex-1 py-2 px-3 rounded-xl bg-vermilion hover:bg-vermilion/90 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs">
                <i class="ri-book-open-line"></i>
                <span>PDF ဖတ်ရှုမည်</span>
              </button>
              <a href="downloads/Helen-Keller-Radical-Monograph-MM.pdf" download class="p-2 rounded-xl bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-vermilion border border-hairline transition-colors text-xs" title="မူရင်း PDF ဒေါင်းလုဒ်">
                <i class="ri-download-2-line"></i>
              </a>
            </div>
          </div>

          <!-- Card 5: Revolutionary Government Monograph -->
          <div class="p-5 rounded-3xl bg-card border border-hairline/80 hover:border-vermilion/40 transition-all shadow-xs space-y-4 flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                <img src="assets/images/revolutionary-government-cover.jpg" alt="Revolutionary Monograph" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-700 text-white text-[10px] font-bold">မဟာဗျူဟာစာတမ်း</span>
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-mono text-muted uppercase">Political Science &amp; Warfare</span>
                <h3 class="text-base font-bold font-serif-editorial text-charcoal leading-snug group-hover:text-vermilion transition-colors">
                  စစ်ဘုရင်ဗျူရိုကရေစီနှင့် တော်လှန်ရေးအစိုးရ တည်ဆောက်ရေး မိုနိုဂရပ်ဖ်
                </h3>
                <p class="text-xs text-muted leading-relaxed line-clamp-3">
                  ဖက်ဒရယ်ဒီမိုကရေစီနှင့် တော်လှန်ရေးအစိုးရ တည်ဆောက်မှုဆိုင်ရာ နက်နဲသော သုတေသန စာတမ်း။
                </p>
              </div>
            </div>

            <div class="pt-3 border-t border-hairline flex items-center justify-between gap-2">
              <button data-open-pdf="downloads/Htet-Monograph-Revolutionary-Warfare-MM.pdf" data-pdf-title="စစ်ဘုရင်ဗျူရိုကရေစီနှင့် တော်လှန်ရေးအစိုးရ မိုနိုဂရပ်ဖ်" class="flex-1 py-2 px-3 rounded-xl bg-vermilion hover:bg-vermilion/90 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs">
                <i class="ri-book-open-line"></i>
                <span>PDF ဖတ်ရှုမည်</span>
              </button>
              <a href="downloads/Htet-Monograph-Revolutionary-Warfare-MM.pdf" download class="p-2 rounded-xl bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-vermilion border border-hairline transition-colors text-xs" title="မူရင်း PDF ဒေါင်းလုဒ်">
                <i class="ri-download-2-line"></i>
              </a>
            </div>
          </div>

          <!-- Card 6: Toxic Positivity Article -->
          <div class="p-5 rounded-3xl bg-card border border-hairline/80 hover:border-vermilion/40 transition-all shadow-xs space-y-4 flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
                <img src="assets/images/toxic-positivity-cover.svg" alt="Toxic Positivity" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <span class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">စိတ်ပညာနှင့် ဒဿန</span>
              </div>
              <div class="space-y-1">
                <span class="text-[10px] font-mono text-muted uppercase">Psychology &amp; Critical Thinking</span>
                <h3 class="text-base font-bold font-serif-editorial text-charcoal leading-snug group-hover:text-vermilion transition-colors">
                  အကောင်းမြင်လွန်းရင် ဘာဖြစ်မလဲ? (Toxic Positivity) သုတေသနစာတမ်း
                </h3>
                <p class="text-xs text-muted leading-relaxed line-clamp-3">
                  Positive Thinking ၏ နောက်ကွယ်က မမြင်နိုင်သော အန္တရာယ်များနှင့် စိတ်ခံစားမှု သဘာဝကို ဝေဖန်ဆန်းစစ်ချက်။
                </p>
              </div>
            </div>

            <div class="pt-3 border-t border-hairline flex items-center justify-between gap-2">
              <button data-open-pdf="downloads/toxic-positivity.pdf" data-pdf-title="Toxic Positivity သုတေသနစာတမ်း" class="flex-1 py-2 px-3 rounded-xl bg-vermilion hover:bg-vermilion/90 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs">
                <i class="ri-book-open-line"></i>
                <span>PDF ဖတ်ရှုမည်</span>
              </button>
              <a href="downloads/toxic-positivity.pdf" download class="p-2 rounded-xl bg-cream/70 dark:bg-stone-800 text-charcoal hover:text-vermilion border border-hairline transition-colors text-xs" title="မူရင်း PDF ဒေါင်းလုဒ်">
                <i class="ri-download-2-line"></i>
              </a>
            </div>
          </div>

        </div>

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
        <p class="leading-relaxed" data-mm="မြန်မာ Transgirl စာရေးဆရာမ၊ နိုင်ငံရေးဒဿနိကဗေဒ သုတေသီနှင့် လူမှုတက်ကြွလှုပ်ရှားသူ ထက်၏ တရားဝင် ဝက်ဘ်စာမျက်နှာ။" data-en="Official platform of Htet — Burmese trans writer, political philosophy researcher, and activist.">
          မြန်မာ Transgirl စာရေးဆရာမ၊ နိုင်ငံရေးဒဿနိကဗေဒ သုတေသီနှင့် လူမှုတက်ကြွလှုပ်ရှားသူ ထက်၏ တရားဝင် ဝက်ဘ်စာမျက်နှာ။
        </p>
      </div>

      <div>
        <h4 class="font-semibold text-charcoal uppercase tracking-wider mb-3 text-[11px]" data-mm="စာမျက်နှာများ" data-en="Navigation">စာမျက်နှာများ</h4>
        <ul class="space-y-2">
          <li><a href="index.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-home-5-line text-vermilion/70 group-hover:text-vermilion"></i> <span>ပင်မ</span></a></li>
          <li><a href="articles.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-article-line text-vermilion/70 group-hover:text-vermilion"></i> <span>ဆောင်းပါးများ</span></a></li>
          <li><a href="publications.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-file-paper-2-line text-vermilion/70 group-hover:text-vermilion"></i> <span>ထုတ်ဝေမှုများ</span></a></li>
          <li><a href="journal.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-booklet-line text-vermilion/70 group-hover:text-vermilion"></i> <span>မှတ်စုနှင့် ပို့စ်များ</span></a></li>
          <li><a href="glossary.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-book-read-line text-vermilion/70 group-hover:text-vermilion"></i> <span>ဝေါဟာရအဘိဓာန်</span></a></li>
          <li><a href="dictionary.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group text-vermilion font-semibold"><i class="ri-book-2-fill text-vermilion"></i> <span>အဘိဓာန်</span></a></li>
          <li><a href="about.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-user-smile-line text-vermilion/70 group-hover:text-vermilion"></i> <span>စာရေးသူအကြောင်း</span></a></li>
          <li><a href="contact.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group"><i class="ri-mail-send-line text-vermilion/70 group-hover:text-vermilion"></i> <span>ဆက်သွယ်ရန်</span></a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-semibold text-charcoal uppercase tracking-wider mb-3 text-[11px]" data-mm="တိုက်ရိုက်လိုင်းများ" data-en="Direct Channels">တိုက်ရိုက်လိုင်းများ</h4>
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
        <h4 class="font-semibold text-charcoal uppercase tracking-wider mb-3 text-[11px]" data-mm="တန်ဖိုးထားမှု" data-en="Commitment">တန်ဖိုးထားမှု</h4>
        <p class="leading-relaxed" data-mm="ခွဲခြားဆက်ဆံမှု ကင်းမဲ့သော၊ ကျား၊ မ တန်းတူညီမျှပြီး တရားမျှတသော လူ့ဘောင် တည်ဆောက်ရေး။" data-en="Committed to an egalitarian, anti-oppressive society rooted in absolute justice.">
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

  <!-- Mozilla PDF.js & Viewer Engine -->
  <script src="js/pdf/pdf.min.js"></script>
  <script src="js/pdf-viewer.js"></script>

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
</body>
</html>
'''

with open('dictionary.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f'Successfully wrote updated dictionary.html ({len(html_content)} bytes)')
