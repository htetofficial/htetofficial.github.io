/**
 * Htet Official — Multilingual i18n Engine (Deluxe Touch & Mouse Dual-Engine)
 * Supports: Burmese (mm), English (en), Chinese (zh), Thai (th), Japanese (ja)
 * Seamlessly engineered for Touchscreens, Mobile Devices, Tablets & Desktop Mice.
 * Zero-FOUC persistence, Liquid Glass bottom sheet modal, and responsive dropdown.
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'site_lang';
  const DEFAULT_LANG = 'mm'; // Pyidaungsu Unicode Burmese as default
  const VALID_LANGS = ['mm', 'en', 'zh', 'th', 'ja'];

  const LANG_METADATA = {
    mm: {
      code: 'MM',
      name: 'မြန်မာ',
      native: 'မြန်မာဘာသာ',
      desc: 'ပြည်ထောင်စု ယူနီကုဒ် (မူလ)',
      flag: '🇲🇲',
      tag: 'my'
    },
    en: {
      code: 'EN',
      name: 'English',
      native: 'English',
      desc: 'International Edition',
      flag: '🇬🇧',
      tag: 'en'
    },
    zh: {
      code: 'ZH',
      name: '中文',
      native: '简体中文',
      desc: '学术研究与国际读者',
      flag: '🇨🇳',
      tag: 'zh-Hans'
    },
    th: {
      code: 'TH',
      name: 'ไทย',
      native: 'ภาษาไทย',
      desc: 'ฉบับภาษาไทยและเพื่อนบ้าน',
      flag: '🇹🇭',
      tag: 'th'
    },
    ja: {
      code: 'JA',
      name: '日本語',
      native: '日本語',
      desc: '学術研究・日本読者向け',
      flag: '🇯🇵',
      tag: 'ja'
    }
  };

  const I18n = {
    currentLang: DEFAULT_LANG,
    isDropdownOpen: false,
    controlsBound: false,

    init() {
      const saved = localStorage.getItem(STORAGE_KEY);
      this.currentLang = (saved && VALID_LANGS.includes(saved)) ? saved : DEFAULT_LANG;
      this.applyLanguage(this.currentLang);
      document.documentElement.classList.remove('i18n-cloaked');
      if (!this.controlsBound) {
        this.bindControls();
        this.controlsBound = true;
      }
    },

    getLang() {
      return this.currentLang;
    },

    getMeta(lang) {
      return LANG_METADATA[lang || this.currentLang] || LANG_METADATA.mm;
    },

    setLang(lang, silent = false) {
      if (!VALID_LANGS.includes(lang)) return;
      this.currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      this.applyLanguage(lang);

      // Feedback toast with haptic vibration if supported
      if (!silent) {
        if (navigator.vibrate) {
          try { navigator.vibrate(15); } catch(e) {}
        }
        if (window.HtetUI && typeof window.HtetUI.showToast === 'function') {
          const labels = {
            mm: '🇲🇲 မြန်မာဘာသာသို့ ပြောင်းလဲပြီးပါပြီ ✓',
            en: '🇬🇧 Switched to English ✓',
            zh: '🇨🇳 已切换至中文 (Chinese) ✓',
            th: '🇹🇭 เปลี่ยนภาษาเป็นภาษาไทยแล้ว (Thai) ✓',
            ja: '🇯🇵 日本語に切り替えました (Japanese) ✓'
          };
          window.HtetUI.showToast(labels[lang] || lang);
        }
      }

      // Dispatch event for dynamic page components (articles, journal, etc.)
      window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    },

    applyLanguage(lang) {
      const meta = this.getMeta(lang);
      document.documentElement.lang = meta.tag || 'my';
      document.documentElement.setAttribute('data-lang', lang);
      if (document.body) {
        document.body.setAttribute('data-lang', lang);
      }
      document.documentElement.classList.remove('i18n-cloaked');

      // 1. Text Content Translation (Strictly preserves <i> icon elements)
      const elements = document.querySelectorAll('[data-mm], [data-en], [data-zh], [data-th], [data-ja]');
      elements.forEach(el => {
        // Skip icon elements themselves
        if (el.tagName === 'I' || el.classList.contains('ri-') || el.classList.contains('bi-')) return;

        let text = el.getAttribute('data-' + lang);
        if (!text) {
          // Intelligent Fallback Cascade: target -> en -> mm
          text = el.getAttribute('data-en') || el.getAttribute('data-mm');
        }
        if (text === null) return;

        const innerSpan = el.querySelector('span');
        const icon = el.querySelector('i, svg');

        if (innerSpan && icon) {
          innerSpan.innerHTML = text;
        } else if (icon) {
          let updated = false;
          el.childNodes.forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim().length > 0) { // Text node
              node.textContent = ' ' + text;
              updated = true;
            }
          });
          if (!updated) {
            const span = document.createElement('span');
            span.innerHTML = text;
            el.appendChild(span);
          }
        } else {
          el.innerHTML = text;
        }
      });

      // 2. Placeholders
      const inputs = document.querySelectorAll('[data-mm-placeholder], [data-en-placeholder], [data-zh-placeholder]');
      inputs.forEach(input => {
        let ph = input.getAttribute('data-' + lang + '-placeholder') || input.getAttribute('data-en-placeholder') || input.getAttribute('data-mm-placeholder');
        if (ph !== null) input.placeholder = ph;
      });

      // 3. Document Title
      const pageTitleMeta = document.querySelector('title[data-mm], title[data-en]');
      if (pageTitleMeta) {
        const titleText = pageTitleMeta.getAttribute('data-' + lang) || pageTitleMeta.getAttribute('data-en') || pageTitleMeta.getAttribute('data-mm');
        if (titleText) document.title = titleText;
      }

      // 4. Update language toggle button states & labels across entire page
      document.querySelectorAll('#current-lang-label, .current-lang-label').forEach(el => {
        el.textContent = meta.code;
      });

      document.querySelectorAll('#current-lang-flag, .current-lang-flag').forEach(el => {
        el.textContent = meta.flag;
      });

      document.querySelectorAll('#current-lang-name, .current-lang-name').forEach(el => {
        el.textContent = meta.name;
      });

      // Update all toggle buttons in drawer & navbar
      const toggleBtns = document.querySelectorAll('.lang-toggle-btn, [data-switch-lang]');
      toggleBtns.forEach(btn => {
        const target = btn.getAttribute('data-target-lang') || btn.getAttribute('data-switch-lang');
        if (target && VALID_LANGS.includes(target)) {
          const isActive = (target === lang);
          if (btn.classList.contains('lang-toggle-btn')) {
            if (isActive) {
              btn.classList.add('bg-vermilion', 'text-white', 'shadow-sm', 'font-bold');
              btn.classList.remove('text-charcoal', 'opacity-70');
            } else {
              btn.classList.remove('bg-vermilion', 'text-white', 'shadow-sm', 'font-bold');
              btn.classList.add('text-charcoal', 'opacity-70');
            }
          }

          // Checkmarks in dropdown
          const checkIcon = btn.querySelector('.ri-check-line, [class*="lang-check"]');
          if (checkIcon) {
            if (isActive) {
              checkIcon.classList.remove('opacity-0');
              checkIcon.classList.add('opacity-100');
              btn.classList.add('bg-vermilion/10', 'font-bold');
            } else {
              checkIcon.classList.add('opacity-0');
              checkIcon.classList.remove('opacity-100');
              btn.classList.remove('bg-vermilion/10', 'font-bold');
            }
          }
        }
      });

      // 5. Update modal active states if modal is currently open
      this.updateModalActiveStates(lang);

      // 6. Synchronize International Evaluator Dossier tabs if present on page
      if (typeof window.switchDossierLang === 'function') {
        window.switchDossierLang(lang, false);
      }

      // Ensure anti-flicker cloak is removed after translation completes
      document.documentElement.classList.remove('i18n-cloaked');
    },

    /**
     * Deluxe Liquid Glass International Language Modal (Touch & Mobile Optimized)
     */
    openLanguageModal() {
      if (document.getElementById('htet-lang-modal')) {
        this.closeLanguageModal();
        return;
      }

      // Close desktop dropdown if open
      this.closeDesktopDropdown();

      const current = this.currentLang;
      const modal = document.createElement('div');
      modal.id = 'htet-lang-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Select Language');

      const modalTitles = {
        mm: { title: 'ဘာသာစကား ရွေးချယ်ရန်', sub: 'နိုင်ငံတကာ စာဖတ်သူများနှင့် ပညာရပ်ဆိုင်ရာ တည်းဖြတ်မှု (၅) မျိုး', close: 'ပိတ်ရန်' },
        en: { title: 'Select Language', sub: '5 International Academic Editions & Translations', close: 'Close' },
        zh: { title: '选择阅读语言', sub: '面向国际学者与中文读者的5种多语言版本', close: '关闭' },
        th: { title: 'เลือกภาษาการอ่าน', sub: '5 ภาษามาตรฐานสากลสำหรับผู้อ่านและนักวิชาการ', close: 'ปิด' },
        ja: { title: '言語を選択してください', sub: '国際読者・研究者向け 5言語エディション', close: '閉じる' }
      };
      const t = modalTitles[current] || modalTitles.mm;

      const itemsHtml = VALID_LANGS.map(code => {
        const item = LANG_METADATA[code];
        const isActive = (current === code);
        return `
          <button data-switch-lang="${code}" class="w-full p-3.5 sm:p-4 rounded-2xl border transition-all text-left flex items-center justify-between group lang-btn-card cursor-pointer ${
            isActive
              ? 'border-vermilion bg-vermilion/10 shadow-sm ring-1 ring-vermilion/80 text-charcoal'
              : 'border-hairline hover:border-vermilion/50 bg-card/80 hover:bg-cream/80 text-charcoal'
          }" style="touch-action: manipulation;">
            <div class="flex items-center space-x-3.5">
              <span class="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-2xl shadow-xs border border-white/20 bg-cream/70 dark:bg-stone-800/70 shrink-0 lang-flag-badge">
                ${item.flag}
              </span>
              <div>
                <div class="text-sm sm:text-base font-bold text-charcoal flex items-center gap-2">
                  <span>${item.native}</span>
                  ${isActive ? '<span class="text-[9px] px-2 py-0.5 rounded-full bg-vermilion text-white font-mono font-bold tracking-wider">ACTIVE</span>' : ''}
                </div>
                <div class="text-xs text-muted flex items-center space-x-1.5 mt-0.5">
                  <span class="font-mono font-bold uppercase opacity-80">${item.code}</span>
                  <span>•</span>
                  <span>${item.desc}</span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2 shrink-0">
              <span class="w-6 h-6 rounded-full border border-hairline flex items-center justify-center transition-all ${
                isActive ? 'bg-vermilion border-vermilion text-white shadow-xs' : 'bg-transparent text-transparent group-hover:border-vermilion/40'
              }">
                <i class="ri-check-line text-sm font-bold"></i>
              </span>
            </div>
          </button>
        `;
      }).join('');

      modal.innerHTML = `
        <div class="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-card border border-hairline p-5 sm:p-6 shadow-2xl relative max-h-[90vh] flex flex-col lang-modal-glass transform transition-transform duration-300">
          <!-- Mobile Pull Handle -->
          <div class="w-12 h-1 rounded-full bg-charcoal/20 dark:bg-white/25 mx-auto mb-3 sm:hidden"></div>

          <!-- Modal Header -->
          <div class="flex items-center justify-between pb-3.5 mb-3 border-b border-hairline shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-vermilion/10 text-vermilion flex items-center justify-center text-lg sm:text-xl shadow-xs border border-vermilion/20 shrink-0">
                <i class="ri-translate-2"></i>
              </div>
              <div>
                <h3 class="font-serif text-base sm:text-lg font-bold text-charcoal leading-tight">${t.title}</h3>
                <span class="text-[11px] text-muted font-sans-ui line-clamp-1">${t.sub}</span>
              </div>
            </div>
            <button id="close-lang-modal" class="w-8 h-8 rounded-full border border-hairline/80 flex items-center justify-center text-muted hover:text-charcoal hover:border-charcoal/40 transition-all cursor-pointer active:scale-90" aria-label="${t.close}">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>

          <!-- Language List Items -->
          <div class="space-y-2.5 overflow-y-auto pr-1 py-1 flex-1 max-h-[60vh]">
            ${itemsHtml}
          </div>

          <!-- Bottom Micro Notice -->
          <div class="mt-4 pt-3 border-t border-hairline flex items-center justify-between text-[11px] text-muted font-sans-ui shrink-0">
            <span class="flex items-center space-x-1.5 opacity-80">
              <i class="ri-flashlight-line text-vermilion"></i>
              <span data-mm="ချက်ချင်း တိုက်ရိုက်ပြောင်းလဲမှု" data-en="Instant 0-Latency Switch">Instant 0-Latency Switch</span>
            </span>
            <span class="font-mono text-[10px] opacity-60">5 EDITIONS</span>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Prevent body scrolling while modal is open
      document.body.style.overflow = 'hidden';

      // Event handlers for modal
      const closeModal = () => this.closeLanguageModal();

      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.closest('#close-lang-modal')) {
          closeModal();
        }
      });

      const keyHandler = (e) => {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', keyHandler);
        }
      };
      document.addEventListener('keydown', keyHandler);
    },

    closeLanguageModal() {
      const modal = document.getElementById('htet-lang-modal');
      if (modal) {
        modal.classList.add('opacity-0');
        modal.classList.remove('animate-fade-in');
        setTimeout(() => {
          if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
          document.body.style.overflow = '';
        }, 150);
      }
    },

    updateModalActiveStates(lang) {
      const modal = document.getElementById('htet-lang-modal');
      if (!modal) return;
      modal.querySelectorAll('[data-switch-lang]').forEach(btn => {
        const target = btn.getAttribute('data-switch-lang');
        const isActive = (target === lang);
        if (isActive) {
          btn.className = 'w-full p-3.5 sm:p-4 rounded-2xl border transition-all text-left flex items-center justify-between group lang-btn-card cursor-pointer border-vermilion bg-vermilion/10 shadow-sm ring-1 ring-vermilion/80 text-charcoal';
          const iconSpan = btn.querySelector('.ri-check-line')?.parentElement;
          if (iconSpan) iconSpan.className = 'w-6 h-6 rounded-full border border-hairline flex items-center justify-center transition-all bg-vermilion border-vermilion text-white shadow-xs';
        } else {
          btn.className = 'w-full p-3.5 sm:p-4 rounded-2xl border transition-all text-left flex items-center justify-between group lang-btn-card cursor-pointer border-hairline hover:border-vermilion/50 bg-card/80 hover:bg-cream/80 text-charcoal';
          const iconSpan = btn.querySelector('.ri-check-line')?.parentElement;
          if (iconSpan) iconSpan.className = 'w-6 h-6 rounded-full border border-hairline flex items-center justify-center transition-all bg-transparent text-transparent group-hover:border-vermilion/40';
        }
      });
    },

    /**
     * Desktop Floating Glass Dropdown Control
     */
    toggleDesktopDropdown(forceState) {
      const dropdownMenu = document.getElementById('lang-dropdown-menu');
      const dropdownBtn = document.getElementById('lang-dropdown-btn');
      if (!dropdownMenu) return;

      const shouldOpen = (typeof forceState === 'boolean') ? forceState : dropdownMenu.classList.contains('hidden');

      if (shouldOpen) {
        dropdownMenu.classList.remove('hidden');
        if (dropdownBtn) {
          dropdownBtn.classList.add('is-open');
          dropdownBtn.setAttribute('aria-expanded', 'true');
        }
        this.isDropdownOpen = true;
      } else {
        dropdownMenu.classList.add('hidden');
        if (dropdownBtn) {
          dropdownBtn.classList.remove('is-open');
          dropdownBtn.setAttribute('aria-expanded', 'false');
        }
        this.isDropdownOpen = false;
      }
    },

    closeDesktopDropdown() {
      this.toggleDesktopDropdown(false);
    },

    bindControls() {
      const isTouchOrSmallScreen = () => {
        return (window.innerWidth < 768) || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(pointer: coarse)').matches;
      };

      // Header button click/touch handler
      document.addEventListener('click', (e) => {
        const dropdownBtn = e.target.closest('#lang-dropdown-btn');
        const modalTrigger = e.target.closest('#drawer-lang-modal-btn, [data-open-lang-modal]');

        if (modalTrigger) {
          e.preventDefault();
          this.openLanguageModal();
          return;
        }

        if (dropdownBtn) {
          e.preventDefault();
          // On mobile screens (< 768px), open the deluxe touch sheet; on desktop, toggle dropdown
          if (window.innerWidth < 768) {
            this.openLanguageModal();
          } else {
            this.toggleDesktopDropdown();
          }
          return;
        }

        // Language selection click
        const switchBtn = e.target.closest('[data-switch-lang]');
        if (switchBtn) {
          e.preventDefault();
          const target = switchBtn.getAttribute('data-switch-lang');
          if (target === 'toggle') {
            this.setLang(this.currentLang === 'mm' ? 'en' : 'mm');
          } else if (VALID_LANGS.includes(target)) {
            this.setLang(target);
          }

          // Close menus smoothly
          this.closeDesktopDropdown();
          if (document.getElementById('htet-lang-modal')) {
            setTimeout(() => this.closeLanguageModal(), 180);
          }
          return;
        }

        // Close dropdown when clicking outside
        const dropdownMenu = document.getElementById('lang-dropdown-menu');
        if (dropdownMenu && !dropdownMenu.classList.contains('hidden') && !e.target.closest('#lang-dropdown-menu') && !e.target.closest('#lang-dropdown-btn')) {
          this.closeDesktopDropdown();
        }
      });

      // Escape key to dismiss dropdown
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isDropdownOpen) {
          this.closeDesktopDropdown();
        }
      });
    }
  };

  window.I18n = I18n;

  // Instant synchronous execution if body is present, plus DOMContentLoaded sync
  if (document.body) {
    I18n.init();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18n.init());
  } else {
    I18n.init();
  }
})();
