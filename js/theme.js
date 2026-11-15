/**
 * Htet Official — Reading Theme & Typography Engine (Deluxe 14-Theme Studio)
 * Supports 14 Curated Aesthetic Themes:
 * - 4 Classics: Light, Sepia, Dark Obsidian, AMOLED Pure Black
 * - 3 Red Themes: Imperial Ruby, Crimson Velvet, Antique Rosewood
 * - 4 Purple Themes: Royal Amethyst, Soft Lavender Mist, Velvet Plum, Twilight Indigo
 * - 3 Pink Themes: Sakura Rose, Warm Peach Blossom, Antique Desert Rose
 *
 * Fully hardened for direct file:// browsing, zero-latency persistence,
 * duplicate-listener protection, and tactile liquid glass aesthetics.
 */
(function() {
  'use strict';

  // Safe Storage layer: 100% resilient on file:// and restricted browser sandboxes
  const safeStorage = {
    get(key, fallback = null) {
      try {
        const val = localStorage.getItem(key);
        return val !== null ? val : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, val) {
      try {
        localStorage.setItem(key, val);
      } catch (e) {
        // Silently fallback if localStorage is unavailable
      }
    }
  };

  const THEME_KEY = 'site_theme';
  const VALID_THEMES = [
    'light', 'sepia', 'dark', 'amoled',
    'red', 'red-crimson', 'red-rosewood',
    'purple', 'purple-lavender', 'purple-plum', 'purple-indigo',
    'pink', 'pink-peach', 'pink-rose'
  ];

  const THEME_METADATA = {
    // 1. Foundation Classics (4)
    light: {
      category: 'classic',
      name_mm: 'စာရွက်ဖြူ (Light)',
      name_en: 'Light Mode',
      desc_mm: 'သဘာဝ စာရွက်ဖြူ နေ့ဘက်ဖတ်ရှုရန်',
      color: '#FAF8F5',
      accent: '#B83A2D',
      icon: 'ri-sun-cloudy-line'
    },
    sepia: {
      category: 'classic',
      name_mm: 'စာအုပ်ညို (Sepia)',
      name_en: 'Sepia Mode',
      desc_mm: 'ရှေးဟောင်း စာအုပ်ညိုရောင် မျက်စိအေး',
      color: '#F5EEDB',
      accent: '#A83626',
      icon: 'ri-book-open-line'
    },
    dark: {
      category: 'classic',
      name_mm: 'မှောင်ရိပ် (Dark)',
      name_en: 'Dark Obsidian',
      desc_mm: 'ကျောက်မည်းရောင် ညဘက်ဖတ်ရှုရန်',
      color: '#121110',
      accent: '#E55C52',
      icon: 'ri-moon-clear-line'
    },
    amoled: {
      category: 'classic',
      name_mm: 'AMOLED အနက်စစ်',
      name_en: 'AMOLED Pure Black',
      desc_mm: 'OLED ဘက်ထရီ ချွေတာသော အနက်စစ် #000000',
      color: '#000000',
      accent: '#FF4D42',
      icon: 'ri-flashlight-line'
    },

    // 2. Red Variants (3)
    red: {
      category: 'red',
      name_mm: 'သွေးကြောနီ (Imperial Ruby)',
      name_en: 'Imperial Ruby Red',
      desc_mm: 'ရဲရင့်တောက်ပသော တော်လှန်ရေး သွေးနီရောင်',
      color: '#FAF5F5',
      accent: '#DC2626',
      icon: 'ri-fire-line'
    },
    'red-crimson': {
      category: 'red',
      name_mm: 'ကြက်သွေးနီ (Crimson Velvet)',
      name_en: 'Crimson Velvet',
      desc_mm: 'နက်ရှိုင်းခန့်ညားသော ကြက်သွေးနီဝိုင်ရောင်',
      color: '#FAF4F5',
      accent: '#9F1239',
      icon: 'ri-drop-line'
    },
    'red-rosewood': {
      category: 'red',
      name_mm: 'နှင်းဆီသစ်နီ (Antique Rosewood)',
      name_en: 'Antique Rosewood',
      desc_mm: 'နွေးထွေးတည်ကြည်သော ရှေးဟောင်း သစ်နီညိုရောင်',
      color: '#FAF6F3',
      accent: '#B43403',
      icon: 'ri-compass-3-line'
    },

    // 3. Purple Variants (4)
    purple: {
      category: 'purple',
      name_mm: 'ခရမ်းသလင်း (Royal Amethyst)',
      name_en: 'Royal Amethyst',
      desc_mm: 'နန်းဆန်သော ခရမ်းရောင် သလင်းကျောက်',
      color: '#F8F6FD',
      accent: '#7C3AED',
      icon: 'ri-magic-line'
    },
    'purple-lavender': {
      category: 'purple',
      name_mm: 'လာဗင်ဒါခရမ်းနု (Lavender Mist)',
      name_en: 'Soft Lavender Mist',
      desc_mm: 'ချိုမြိန်အေးဆေးသော လာဗင်ဒါပန်းခရမ်းနုရောင်',
      color: '#F8F7FD',
      accent: '#8B5CF6',
      icon: 'ri-windy-line'
    },
    'purple-plum': {
      category: 'purple',
      name_mm: 'စပျစ်သီးရင့်ခရမ်း (Velvet Plum)',
      name_en: 'Royal Velvet Plum',
      desc_mm: 'နက်မှောင်ခန့်ညားသော စပျစ်သီးရင့်ခရမ်းရောင်',
      color: '#F9F5FA',
      accent: '#A21CAF',
      icon: 'ri-sparkling-2-line'
    },
    'purple-indigo': {
      category: 'purple',
      name_mm: 'မိုးပြာခရမ်းရင့် (Twilight Indigo)',
      name_en: 'Twilight Indigo Violet',
      desc_mm: 'ညနေဆည်းဆာ မိုးပြာခရမ်းရင့် ကဗျာဆန်ဆန်',
      color: '#F5F6FC',
      accent: '#4F46E5',
      icon: 'ri-moon-foggy-line'
    },

    // 4. Pink Variants (3)
    pink: {
      category: 'pink',
      name_mm: 'ချယ်ရီပန်းရောင် (Sakura Blossom)',
      name_en: 'Sakura Rose Pink',
      desc_mm: 'ချိုမြိန်နူးညံ့သော နှင်းဆီပန်းရောင်စဉ်',
      color: '#FDF6F8',
      accent: '#D94676',
      icon: 'ri-heart-3-line'
    },
    'pink-peach': {
      category: 'pink',
      name_mm: 'မက်မွန်ပန်းရောင် (Warm Peach)',
      name_en: 'Warm Peach Blossom',
      desc_mm: 'နွေးထွေးအေးချမ်းသော မက်မွန်ပန်းရောင်စဉ်',
      color: '#FDF7F4',
      accent: '#F43F5E',
      icon: 'ri-sun-line'
    },
    'pink-rose': {
      category: 'pink',
      name_mm: 'နှင်းဆီရင့်ရောင် (Desert Rose Quartz)',
      name_en: 'Antique Desert Rose',
      desc_mm: 'ဆန်းပြားရင့်ကျက်သော နှင်းဆီကျောက်သလင်းရောင်',
      color: '#FDF5F7',
      accent: '#BE185D',
      icon: 'ri-flower-line'
    }
  };

  const Theme = {
    currentTheme: 'dark',
    controlsBound: false,

    init() {
      const saved = safeStorage.get(THEME_KEY);
      if (VALID_THEMES.includes(saved)) {
        this.currentTheme = saved;
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.currentTheme = 'dark';
      }
      this.applyTheme(this.currentTheme);
      if (!this.controlsBound) {
        this.bindControls();
        this.controlsBound = true;
      }
    },

    setTheme(theme, silent = false) {
      if (!VALID_THEMES.includes(theme)) return;
      this.currentTheme = theme;
      safeStorage.set(THEME_KEY, theme);

      // Temporarily enable smooth transitions only during manual user toggle
      if (document.body) {
        document.body.classList.add('theme-transitioning');
      }
      this.applyTheme(theme);
      setTimeout(() => {
        if (document.body) {
          document.body.classList.remove('theme-transitioning');
        }
      }, 350);

      // Haptic feedback on touch devices
      if (!silent && navigator.vibrate) {
        try { navigator.vibrate(15); } catch(e) {}
      }

      // Toast feedback when changed
      if (!silent && window.HtetUI && typeof window.HtetUI.showToast === 'function') {
        const lang = window.I18n ? window.I18n.getLang() : 'mm';
        const meta = THEME_METADATA[theme];
        const msg = meta ? (lang === 'mm' ? `${meta.name_mm} သို့ ပြောင်းလဲပြီးပါပြီ ✓` : `${meta.name_en} Activated ✓`) : theme;
        window.HtetUI.showToast(msg);
      }

      // Sync active state in modal if open
      this.updateModalActiveStates(theme);

      // Dispatch event
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    },

    applyTheme(theme) {
      if (!VALID_THEMES.includes(theme)) theme = 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      if (document.body) {
        document.body.setAttribute('data-theme', theme);
      }

      // Toggle .dark class for Tailwind dark-mode utilities (dark and amoled)
      if (theme === 'dark' || theme === 'amoled') {
        document.documentElement.classList.add('dark');
        if (document.body) document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        if (document.body) document.body.classList.remove('dark');
      }

      // Update button highlights across all pages
      document.querySelectorAll('[data-theme-btn]').forEach(btn => {
        const t = btn.getAttribute('data-theme-btn');
        if (t === theme) {
          btn.classList.add('bg-vermilion', 'text-white', 'shadow-sm', 'font-bold');
          btn.classList.remove('text-charcoal', 'opacity-60');
        } else {
          btn.classList.remove('bg-vermilion', 'text-white', 'shadow-sm', 'font-bold');
          btn.classList.add('text-charcoal', 'opacity-60');
        }
      });

      // Update active dot indicators on navbar theme buttons
      const meta = THEME_METADATA[theme] || THEME_METADATA.dark;
      document.querySelectorAll('.theme-active-dot').forEach(dot => {
        dot.style.backgroundColor = meta.accent;
        dot.style.boxShadow = `0 0 8px ${meta.accent}`;
      });

      // Update Meta theme-color for mobile browsers & status bars
      let metaTheme = document.querySelector('meta[name="theme-color"]');
      if (!metaTheme) {
        metaTheme = document.createElement('meta');
        metaTheme.name = 'theme-color';
        document.head.appendChild(metaTheme);
      }
      metaTheme.content = meta.color || '#121110';
      document.documentElement.style.backgroundColor = meta.color || '';
    },

    cycleTheme() {
      const nextIndex = (VALID_THEMES.indexOf(this.currentTheme) + 1) % VALID_THEMES.length;
      this.setTheme(VALID_THEMES[nextIndex]);
    },

    /**
     * Deluxe Liquid Glass 14-Theme Palette Studio Modal
     */
    openThemeModal() {
      if (document.getElementById('theme-palette-modal')) {
        this.closeThemeModal();
        return;
      }

      const lang = window.I18n ? window.I18n.getLang() : 'mm';
      const current = this.currentTheme;

      const modal = document.createElement('div');
      modal.id = 'theme-palette-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Reading Theme Studio');

      // Filter Categories
      const categories = [
        { id: 'all', label_mm: 'အားလုံး (၁၄ မျိုး)', label_en: 'All 14 Themes', icon: 'ri-apps-2-line' },
        { id: 'classic', label_mm: 'အခြေခံ (၄)', label_en: 'Classics', icon: 'ri-contrast-2-line' },
        { id: 'pink', label_mm: 'ပန်းရောင် (၃)', label_en: 'Pink Sakura', icon: 'ri-heart-3-line' },
        { id: 'purple', label_mm: 'ခရမ်းရောင် (၄)', label_en: 'Purple Violet', icon: 'ri-magic-line' },
        { id: 'red', label_mm: 'အနီရောင် (၃)', label_en: 'Ruby & Crimson', icon: 'ri-fire-line' }
      ];

      const tabsHtml = categories.map((cat, idx) => `
        <button data-theme-filter="${cat.id}" class="theme-filter-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
          idx === 0 
            ? 'bg-vermilion text-white shadow-xs' 
            : 'bg-cream/60 dark:bg-stone-900/60 text-muted hover:text-charcoal border border-hairline/60'
        }">
          <i class="${cat.icon} mr-1 text-[11px]"></i>
          <span>${lang === 'mm' ? cat.label_mm : cat.label_en}</span>
        </button>
      `).join('');

      const themeOptionsHtml = VALID_THEMES.map(key => {
        const item = THEME_METADATA[key];
        const isActive = (current === key);
        return `
          <button data-select-theme="${key}" data-category="${item.category}" class="theme-card-option w-full p-3 sm:p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
            isActive 
              ? 'border-vermilion bg-vermilion/10 shadow-sm ring-1 ring-vermilion text-charcoal' 
              : 'border-hairline hover:border-vermilion/50 bg-card/85 hover:bg-cream/80 text-charcoal'
          }" style="touch-action: manipulation;">
            <div class="flex items-center space-x-3.5">
              <span class="w-10 h-10 rounded-2xl flex items-center justify-center text-base shadow-xs border border-white/20 shrink-0 relative overflow-hidden" style="background-color: ${item.color}; color: ${item.accent};">
                <i class="${item.icon}"></i>
                <span class="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white/80" style="background-color: ${item.accent};"></span>
              </span>
              <div>
                <div class="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-1.5">
                  <span>${lang === 'mm' ? item.name_mm : item.name_en}</span>
                  ${isActive ? '<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-vermilion text-white font-mono font-bold tracking-wider">ACTIVE</span>' : ''}
                </div>
                <div class="text-[11px] text-muted line-clamp-1 mt-0.5">${lang === 'mm' ? item.desc_mm : item.name_en}</div>
              </div>
            </div>
            <div class="flex items-center space-x-2 shrink-0">
              <span class="w-6 h-6 rounded-full border border-hairline flex items-center justify-center transition-all ${
                isActive ? 'bg-vermilion border-vermilion text-white shadow-xs' : 'bg-transparent text-transparent group-hover:border-vermilion/40'
              }">
                <i class="ri-check-line text-xs font-bold"></i>
              </span>
            </div>
          </button>
        `;
      }).join('');

      modal.innerHTML = `
        <div class="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-card border border-hairline p-5 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col lang-modal-glass transform transition-transform duration-300">
          <!-- Mobile Pull Handle -->
          <div class="w-12 h-1 rounded-full bg-charcoal/20 dark:bg-white/25 mx-auto mb-3 sm:hidden"></div>

          <!-- Header -->
          <div class="flex items-center justify-between pb-3.5 mb-2.5 border-b border-hairline shrink-0">
            <div class="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-vermilion/10 text-vermilion flex items-center justify-center text-lg sm:text-xl shadow-xs border border-vermilion/20 shrink-0">
                <i class="ri-palette-line"></i>
              </div>
              <div class="min-w-0">
                <h3 class="font-serif text-base sm:text-lg font-bold text-charcoal leading-tight truncate">
                  ${lang === 'mm' ? 'စာဖတ်ရောင်စဉ် စတူဒီယို' : 'Reading Palette Studio'}
                </h3>
                <span class="text-[10px] sm:text-[11px] text-muted font-sans-ui block truncate">
                  ${lang === 'mm' ? 'အနုပညာရောင်စဉ် ၁၄ မျိုး • စာဖတ်အမြင်အေး' : '14 Curated Themes • High Legibility'}
                </span>
              </div>
            </div>
            <button id="theme-modal-close-btn" class="w-8 h-8 rounded-full border border-hairline/80 flex items-center justify-center text-muted hover:text-charcoal hover:border-charcoal/40 transition-all cursor-pointer active:scale-90 shrink-0 ml-2" aria-label="Close">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>

          <!-- Category Filter Bar -->
          <div class="flex items-center space-x-1.5 overflow-x-auto py-2 shrink-0 no-scrollbar">
            ${tabsHtml}
          </div>

          <!-- Theme Cards List -->
          <div id="theme-options-container" class="space-y-2 overflow-y-auto pr-1 py-1 flex-1 max-h-[58vh]">
            ${themeOptionsHtml}
          </div>

          <!-- Bottom Footer Bar -->
          <div class="mt-3 pt-3 border-t border-hairline flex items-center justify-between text-xs text-muted font-sans-ui shrink-0">
            <span class="flex items-center space-x-1.5 opacity-80">
              <i class="ri-sparkling-fill text-vermilion"></i>
              <span id="theme-modal-current-name">${THEME_METADATA[current]?.name_mm || current.toUpperCase()}</span>
            </span>
            <button id="theme-modal-done-btn" class="px-4 py-1.5 rounded-full bg-vermilion text-white font-sans text-xs font-semibold hover:bg-vermilion-hover transition-all cursor-pointer shadow-xs active:scale-95">
              ${lang === 'mm' ? 'ပြီးပါပြီ' : 'Done'}
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.style.overflow = 'hidden';

      // Category filter click
      modal.querySelectorAll('[data-theme-filter]').forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          const catId = tab.getAttribute('data-theme-filter');
          modal.querySelectorAll('[data-theme-filter]').forEach(t => {
            t.className = 'theme-filter-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer bg-cream/60 dark:bg-stone-900/60 text-muted hover:text-charcoal border border-hairline/60';
          });
          tab.className = 'theme-filter-pill px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer bg-vermilion text-white shadow-xs';

          modal.querySelectorAll('.theme-card-option').forEach(card => {
            const cardCat = card.getAttribute('data-category');
            if (catId === 'all' || cardCat === catId) {
              card.style.display = 'flex';
            } else {
              card.style.display = 'none';
            }
          });
        });
      });

      // Theme option selection
      modal.querySelectorAll('[data-select-theme]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const t = btn.getAttribute('data-select-theme');
          this.setTheme(t);
        });
      });

      // Close handlers
      const closeModal = () => this.closeThemeModal();
      document.getElementById('theme-modal-close-btn')?.addEventListener('click', closeModal);
      document.getElementById('theme-modal-done-btn')?.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });

      const keyHandler = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', keyHandler);
        }
      };
      document.addEventListener('keydown', keyHandler);
    },

    closeThemeModal() {
      const modal = document.getElementById('theme-palette-modal');
      if (modal) {
        modal.classList.add('opacity-0');
        modal.classList.remove('animate-fade-in');
        setTimeout(() => {
          if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
          document.body.style.overflow = '';
        }, 150);
      }
    },

    updateModalActiveStates(theme) {
      const modal = document.getElementById('theme-palette-modal');
      if (!modal) return;
      const meta = THEME_METADATA[theme] || THEME_METADATA.dark;

      const nameEl = document.getElementById('theme-modal-current-name');
      if (nameEl) nameEl.textContent = meta.name_mm;

      modal.querySelectorAll('[data-select-theme]').forEach(btn => {
        const key = btn.getAttribute('data-select-theme');
        const isActive = (key === theme);
        if (isActive) {
          btn.className = 'theme-card-option w-full p-3 sm:p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between group cursor-pointer border-vermilion bg-vermilion/10 shadow-sm ring-1 ring-vermilion text-charcoal';
          const iconSpan = btn.querySelector('.ri-check-line')?.parentElement;
          if (iconSpan) iconSpan.className = 'w-6 h-6 rounded-full border border-hairline flex items-center justify-center transition-all bg-vermilion border-vermilion text-white shadow-xs';
        } else {
          btn.className = 'theme-card-option w-full p-3 sm:p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between group cursor-pointer border-hairline hover:border-vermilion/50 bg-card/85 hover:bg-cream/80 text-charcoal';
          const iconSpan = btn.querySelector('.ri-check-line')?.parentElement;
          if (iconSpan) iconSpan.className = 'w-6 h-6 rounded-full border border-hairline flex items-center justify-center transition-all bg-transparent text-transparent group-hover:border-vermilion/40';
        }
      });
    },

    bindControls() {
      document.addEventListener('click', (e) => {
        const themeBtn = e.target.closest('[data-set-theme]');
        if (themeBtn) {
          e.preventDefault();
          const targetTheme = themeBtn.getAttribute('data-set-theme');
          if (targetTheme === 'cycle') {
            this.cycleTheme();
          } else if (targetTheme === 'modal' || targetTheme === 'palette') {
            this.openThemeModal();
          } else {
            this.setTheme(targetTheme);
          }
          return;
        }

        const paletteBtn = e.target.closest('#open-theme-palette, #flyout-theme-btn, [data-theme-palette-trigger]');
        if (paletteBtn && !paletteBtn.hasAttribute('data-set-theme')) {
          e.preventDefault();
          this.openThemeModal();
          return;
        }
      });
    }
  };

  /**
   * Device-Adaptive Multi-Scale Typography Engine
   */
  const FONT_SCALE_KEY = 'site_font_scale';
  const SCALES = [
    { id: 'sm', scale: 0.90, label_mm: 'ကျစ်လျစ်သော ဖောင့် (Compact)', label_en: 'Compact Font' },
    { id: 'md', scale: 1.00, label_mm: 'မူလပုံမှန် ဖောင့် (Normal)', label_en: 'Standard Font' },
    { id: 'lg', scale: 1.12, label_mm: 'ကြီးမားသော ဖောင့် (Large)', label_en: 'Large Font' },
    { id: 'xl', scale: 1.25, label_mm: 'အထူးကြီးမားသော ဖောင့် (Extra Large)', label_en: 'Extra Large Font' }
  ];

  const FontEngine = {
    currentIndex: 1, // default 'md' (1.00)
    controlsBound: false,

    init() {
      const saved = safeStorage.get(FONT_SCALE_KEY);
      if (saved) {
        const foundIdx = SCALES.findIndex(s => s.id === saved || Math.abs(s.scale - parseFloat(saved)) < 0.02);
        if (foundIdx !== -1) this.currentIndex = foundIdx;
      }
      this.applyScale(false);
      if (!this.controlsBound) {
        this.bindControls();
        this.controlsBound = true;
      }
    },

    getScale() {
      return SCALES[this.currentIndex];
    },

    setScale(scaleIdOrIndex, showFeedback = true) {
      if (typeof scaleIdOrIndex === 'number') {
        this.currentIndex = Math.max(0, Math.min(SCALES.length - 1, scaleIdOrIndex));
      } else {
        const idx = SCALES.findIndex(s => s.id === scaleIdOrIndex);
        if (idx !== -1) this.currentIndex = idx;
      }

      const current = SCALES[this.currentIndex];
      safeStorage.set(FONT_SCALE_KEY, current.id);
      this.applyScale(showFeedback);
    },

    increase(showFeedback = true) {
      if (this.currentIndex < SCALES.length - 1) {
        this.setScale(this.currentIndex + 1, showFeedback);
      } else if (showFeedback && window.HtetUI && typeof window.HtetUI.showToast === 'function') {
        const lang = window.I18n ? window.I18n.getLang() : 'mm';
        window.HtetUI.showToast(lang === 'mm' ? 'အကြီးဆုံး ဖောင့်အရွယ်အစားသို့ ရောက်ရှိနေပါပြီ' : 'Maximum font size reached');
      }
    },

    decrease(showFeedback = true) {
      if (this.currentIndex > 0) {
        this.setScale(this.currentIndex - 1, showFeedback);
      } else if (showFeedback && window.HtetUI && typeof window.HtetUI.showToast === 'function') {
        const lang = window.I18n ? window.I18n.getLang() : 'mm';
        window.HtetUI.showToast(lang === 'mm' ? 'အသေးဆုံး ဖောင့်အရွယ်အစားသို့ ရောက်ရှိနေပါပြီ' : 'Minimum font size reached');
      }
    },

    reset(showFeedback = true) {
      this.setScale(1, showFeedback);
    },

    applyScale(showFeedback = false) {
      const current = SCALES[this.currentIndex];
      document.documentElement.style.setProperty('--user-font-scale', current.scale);
      document.documentElement.setAttribute('data-font-size', current.id);
      if (document.body) {
        document.body.setAttribute('data-font-size', current.id);
      }

      // Update button highlights across all pages
      document.querySelectorAll('[data-font-action]').forEach(btn => {
        const action = btn.getAttribute('data-font-action');
        if (action === 'reset' && current.id === 'md') {
          btn.classList.add('bg-vermilion', 'text-white', 'shadow-xs');
          btn.classList.remove('text-charcoal');
        } else if (action === 'decrease' && current.id === 'sm') {
          btn.classList.add('bg-vermilion', 'text-white', 'shadow-xs');
          btn.classList.remove('text-charcoal');
        } else if (action === 'increase' && (current.id === 'lg' || current.id === 'xl')) {
          btn.classList.add('bg-vermilion', 'text-white', 'shadow-xs');
          btn.classList.remove('text-charcoal');
        } else {
          btn.classList.remove('bg-vermilion', 'text-white', 'shadow-xs');
          btn.classList.add('text-charcoal');
        }
      });

      // Synchronize with Reader.js if present
      if (window.Reader && typeof window.Reader.applyFontSize === 'function') {
        window.Reader.applyFontSize();
      }

      // Toast feedback
      if (showFeedback && window.HtetUI && typeof window.HtetUI.showToast === 'function') {
        const lang = window.I18n ? window.I18n.getLang() : 'mm';
        const msg = (lang === 'mm') ? current.label_mm : current.label_en;
        window.HtetUI.showToast(msg);
      }
    },

    bindControls() {
      document.addEventListener('click', (e) => {
        const fontBtn = e.target.closest('[data-font-action]');
        if (!fontBtn) return;
        e.preventDefault();

        const action = fontBtn.getAttribute('data-font-action') || fontBtn.id.replace('font-', '');
        if (action === 'increase') {
          this.increase(true);
        } else if (action === 'decrease') {
          this.decrease(true);
        } else if (action === 'reset') {
          this.reset(true);
        }
      });
    }
  };

  window.Theme = Theme;
  window.FontEngine = FontEngine;

  // Immediate synchronous init if body is present, plus DOMContentLoaded sync
  if (document.body) {
    Theme.init();
    FontEngine.init();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      Theme.init();
      FontEngine.init();
    });
  } else {
    Theme.init();
    FontEngine.init();
  }
})();
