/**
 * Htet Official — Master UI Controller with Online Libraries & Rich Icons
 * AOS Animations, Canvas Confetti, Back-to-Top, Interactive Hanko Ripple,
 * Text Selection Quote Popover, Global Spotlight Search (Cmd+K),
 * Bookmarks & Reading List Drawer, Glossary Explorer, Publications & Citations,
 * Daily Philosophical Wisdom Generator, and Audio Essay Player.
 */
(function() {
  'use strict';

  // Global fallbacks for interactive slide gallery and checklist
  window.setSlide = window.setSlide || function(n) {
    if (window.Reader && typeof window.Reader.setSlide === 'function') {
      window.Reader.setSlide(n);
    }
  };
  window.updatePrivScore = window.updatePrivScore || function() {
    if (window.Reader && typeof window.Reader.updatePrivScore === 'function') {
      window.Reader.updatePrivScore();
    }
  };

  // 1. Mobile Menu Drawer
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-menu-drawer');
    const overlay = document.getElementById('mobile-menu-overlay');
    const closeBtn = document.getElementById('mobile-menu-close');

    if (!toggleBtn || !drawer) return;

    function openMenu() {
      drawer.classList.remove('-translate-x-full');
      if (overlay) {
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
      }
      document.body.classList.add('overflow-hidden');
    }

    function closeMenu() {
      drawer.classList.add('-translate-x-full');
      if (overlay) {
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
      }
      document.body.classList.remove('overflow-hidden');
    }

    toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // 2. Refined Toast Notification with Icon
  function showToast(message) {
    let toast = document.getElementById('htet-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'htet-toast';
      toast.className = 'fixed bottom-6 right-6 z-50 transform translate-y-10 opacity-0 transition-all duration-300 pointer-events-none px-5 py-3 rounded-2xl shadow-2xl border border-taupe-light bg-card text-charcoal font-sans-ui text-xs flex items-center space-x-2.5 backdrop-blur-md';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <span class="w-6 h-6 rounded-full bg-vermilion/15 text-vermilion flex items-center justify-center flex-shrink-0 text-sm">
        <i class="ri-check-line font-bold"></i>
      </span>
      <span class="font-medium">${message}</span>
    `;
    toast.classList.remove('translate-y-10', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
  }

  // 3. Online AOS Library Initialization (Animate on Scroll)
  function initAOS() {
    if (window.AOS) {
      window.AOS.init({
        duration: 650,
        easing: 'ease-out-cubic',
        once: true,
        offset: 30
      });
    }
  }

  // 4. Smart Combined Back-to-Top & Navigation Pill
  function initBackToTop() {
    // If on article.html or if companion already exists, avoid duplicate button overlap
    if (document.getElementById('floating-reading-companion') || 
        document.getElementById('back-to-top-progress-btn') || 
        window.location.pathname.includes('article.html')) {
      const existing = document.getElementById('smart-back-to-top') || document.getElementById('back-to-top');
      if (existing) existing.remove();
      return;
    }

    let pill = document.getElementById('smart-back-to-top') || document.getElementById('back-to-top');
    if (!pill) {
      pill = document.createElement('div');
      pill.id = 'smart-back-to-top';
      pill.className = 'smart-scroll-pill fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center rounded-full p-1 transition-all duration-300 font-sans-ui no-print opacity-0 pointer-events-none translate-y-3';
      pill.setAttribute('role', 'toolbar');
      pill.setAttribute('aria-label', 'Smart Scroll Navigation');
      pill.innerHTML = `
        <!-- Scroll to Top Action -->
        <button id="smart-scroll-top-btn" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-charcoal hover:text-vermilion hover:bg-vermilion/10 dark:hover:bg-vermilion/20 transition-all cursor-pointer group" title="ထိပ်ဆုံးသို့ ပြန်သွားရန် (Scroll to Top)" aria-label="Back to top">
          <i class="ri-arrow-up-line text-sm sm:text-base font-bold group-hover:-translate-y-0.5 transition-transform"></i>
        </button>

        <!-- Combined Progress Gauge / Percentage Indicator -->
        <div id="smart-scroll-progress-badge" class="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center my-0.5 cursor-pointer group" title="ဖတ်ရှုပြီးမြောက်မှု ရာခိုင်နှုန်း (Reading Progress)" aria-label="Reading progress">
          <svg class="w-8 h-8 sm:w-9 sm:h-9 -rotate-90 pointer-events-none absolute inset-0" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="14" class="stroke-taupe-light/40 dark:stroke-stone-700/50 fill-none" stroke-width="2.5"></circle>
            <circle id="smart-progress-circle" cx="18" cy="18" r="14" class="stroke-vermilion fill-none transition-all duration-100" stroke-width="2.5" stroke-dasharray="87.96" stroke-dashoffset="87.96" stroke-linecap="round"></circle>
          </svg>
          <span id="smart-progress-text" class="text-[9px] sm:text-[10px] font-mono font-bold text-charcoal group-hover:text-vermilion transition-colors z-10 leading-none">0%</span>
        </div>

        <!-- Scroll to Bottom Action -->
        <button id="smart-scroll-bottom-btn" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-charcoal hover:text-vermilion hover:bg-vermilion/10 dark:hover:bg-vermilion/20 transition-all cursor-pointer group" title="အောက်ခြေသို့ ဆင်းရန် (Jump to Bottom)" aria-label="Jump to bottom">
          <i class="ri-arrow-down-line text-sm sm:text-base font-bold group-hover:translate-y-0.5 transition-transform"></i>
        </button>

        <!-- Quick Actions Toggle / Menu (3-dots) -->
        <div class="h-px w-5 bg-hairline my-0.5 opacity-60"></div>
        <button id="smart-scroll-menu-btn" class="w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-vermilion hover:bg-vermilion/10 transition-colors cursor-pointer" title="အမြန်ခလုတ်များ (Quick Shortcuts)" aria-label="Quick Shortcuts">
          <i class="ri-more-line text-xs"></i>
        </button>

        <!-- Flyout Menu of Quick Actions (Search, Bookmarks, Theme) -->
        <div id="smart-scroll-flyout" class="hidden absolute right-full mr-2 bottom-0 bg-card dark:bg-stone-900 border border-hairline shadow-2xl rounded-2xl p-1.5 flex flex-col space-y-1.5 z-50">
          <button id="flyout-search-btn" class="w-8 h-8 rounded-xl flex items-center justify-center text-charcoal hover:text-vermilion hover:bg-vermilion/10 transition-colors cursor-pointer" title="ရှာဖွေရန် (Search - Cmd+K)" aria-label="Search">
            <i class="ri-search-2-line text-sm"></i>
          </button>
          <button id="flyout-bookmarks-btn" class="w-8 h-8 rounded-xl flex items-center justify-center text-charcoal hover:text-vermilion hover:bg-vermilion/10 transition-colors cursor-pointer" title="သိမ်းဆည်းထားသော စာမူများ (Bookmarks)" aria-label="Bookmarks">
            <i class="ri-bookmark-line text-sm"></i>
          </button>
          <button id="flyout-theme-btn" class="w-8 h-8 rounded-xl flex items-center justify-center text-charcoal hover:text-vermilion hover:bg-vermilion/10 transition-colors cursor-pointer" title="ရောင်စဉ်ပြောင်းရန် (Theme Switcher)" aria-label="Theme">
            <i class="ri-contrast-2-line text-sm"></i>
          </button>
        </div>
      `;
      document.body.appendChild(pill);
    }

    const scrollTopBtn = document.getElementById('smart-scroll-top-btn');
    const scrollBottomBtn = document.getElementById('smart-scroll-bottom-btn');
    const progressCircle = document.getElementById('smart-progress-circle');
    const progressText = document.getElementById('smart-progress-text');
    const progressBadge = document.getElementById('smart-scroll-progress-badge');
    const menuBtn = document.getElementById('smart-scroll-menu-btn');
    const flyout = document.getElementById('smart-scroll-flyout');

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (scrollBottomBtn) {
      scrollBottomBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const maxScroll = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        ) - window.innerHeight;
        window.scrollTo({ top: maxScroll, behavior: 'smooth' });
      });
    }

    if (progressBadge) {
      progressBadge.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    if (menuBtn && flyout) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        flyout.classList.toggle('hidden');
        flyout.classList.toggle('is-open');
      });

      document.addEventListener('click', (e) => {
        if (!pill.contains(e.target)) {
          flyout.classList.add('hidden');
          flyout.classList.remove('is-open');
        }
      });
    }

    const flyoutSearch = document.getElementById('flyout-search-btn');
    if (flyoutSearch) {
      flyoutSearch.addEventListener('click', () => {
        if (flyout) {
          flyout.classList.add('hidden');
          flyout.classList.remove('is-open');
        }
        const trigger = document.getElementById('spotlight-search-trigger');
        if (trigger) trigger.click();
      });
    }

    const flyoutBookmarks = document.getElementById('flyout-bookmarks-btn');
    if (flyoutBookmarks) {
      flyoutBookmarks.addEventListener('click', () => {
        if (flyout) {
          flyout.classList.add('hidden');
          flyout.classList.remove('is-open');
        }
        const trigger = document.getElementById('reading-list-trigger');
        if (trigger) trigger.click();
      });
    }

    const flyoutTheme = document.getElementById('flyout-theme-btn');
    if (flyoutTheme) {
      flyoutTheme.addEventListener('click', () => {
        if (window.Theme && window.Theme.openThemeModal) {
          window.Theme.openThemeModal();
        } else if (window.Theme && window.Theme.cycleTheme) {
          window.Theme.cycleTheme();
        }
      });
    }

    const circumference = 87.96; // 2 * PI * 14
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const current = window.pageYOffset || window.scrollY;

      if (current > 120) {
        pill.classList.add('visible');
        pill.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-3');
      } else {
        pill.classList.remove('visible');
        pill.classList.add('opacity-0', 'pointer-events-none', 'translate-y-3');
        if (flyout) {
          flyout.classList.add('hidden');
          flyout.classList.remove('is-open');
        }
      }

      if (total > 0) {
        const percent = Math.min(100, Math.max(0, Math.round((current / total) * 100)));
        if (progressText) progressText.textContent = `${percent}%`;
        if (progressCircle) {
          const offset = circumference - (percent / 100) * circumference;
          progressCircle.style.strokeDashoffset = Math.max(0, Math.min(circumference, offset));
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 5. Interactive Hanko Stamp Ripple Effect
  function initHankoRipple() {
    document.addEventListener('click', (e) => {
      const stamp = e.target.closest('.hanko-stamp');
      if (stamp) {
        stamp.style.transform = 'scale(0.92) rotate(-3deg)';
        setTimeout(() => {
          stamp.style.transform = '';
        }, 180);
      }
    });
  }

  // 6. Article Bookmarking System (localStorage) with Confetti & Badge Sync
  const BookmarkSystem = {
    KEY: 'htet_saved_articles',
    getBookmarks() {
      try {
        return JSON.parse(localStorage.getItem(this.KEY) || '[]');
      } catch {
        return [];
      }
    },
    isBookmarked(id) {
      return this.getBookmarks().includes(id);
    },
    updateBadge() {
      const badges = document.querySelectorAll('#reading-list-badge');
      const count = this.getBookmarks().length;
      badges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
          badge.classList.remove('hidden');
        } else {
          badge.classList.add('hidden');
        }
      });
    },
    toggle(id) {
      const list = this.getBookmarks();
      const index = list.indexOf(id);
      let added = false;
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(id);
        added = true;
      }
      localStorage.setItem(this.KEY, JSON.stringify(list));
      this.updateBadge();
      
      const lang = window.I18n ? window.I18n.getLang() : 'mm';
      const msg = added
        ? (lang === 'mm' ? 'စာမူကို စာဖတ်မှတ်တမ်းထဲ သိမ်းဆည်းလိုက်ပါပြီ။' : 'Article bookmarked!')
        : (lang === 'mm' ? 'စာမူကို စာဖတ်မှတ်တမ်းမှ ဖယ်ရှားလိုက်ပါပြီ။' : 'Removed from bookmarks.');
      showToast(msg);

      // Trigger micro confetti on save
      if (added && window.confetti) {
        window.confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.85 },
          colors: ['#B83A2D', '#F2ECE4', '#E05349']
        });
      }
      return added;
    }
  };

  // 7. Reading List / Bookmarks Slide-Out Drawer
  function initReadingListDrawer() {
    let drawer = document.getElementById('reading-list-drawer');
    let overlay = document.getElementById('reading-list-overlay');

    if (!drawer) {
      overlay = document.createElement('div');
      overlay.id = 'reading-list-overlay';
      overlay.className = 'fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-300 pointer-events-none';
      document.body.appendChild(overlay);

      drawer = document.createElement('div');
      drawer.id = 'reading-list-drawer';
      drawer.className = 'fixed top-0 right-0 bottom-0 w-80 sm:w-96 max-w-[88vw] bg-card z-50 transform translate-x-full transition-transform duration-300 p-4 sm:p-6 flex flex-col justify-between shadow-2xl border-l border-taupe-light font-sans-ui hidden pointer-events-none';
      drawer.innerHTML = `
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between pb-4 border-b border-hairline mb-4">
            <div class="flex items-center space-x-2">
              <span class="hanko-stamp px-1.5 py-0.2 text-[10px]">မှတ်တမ်း</span>
              <h3 class="font-serif-editorial text-xl font-semibold text-charcoal" data-mm="သိမ်းဆည်းထားသော စာမူများ" data-en="Saved Reading List">သိမ်းဆည်းထားသော စာမူများ</h3>
            </div>
            <button id="reading-list-close" class="p-1 text-muted hover:text-charcoal"><i class="ri-close-line text-2xl"></i></button>
          </div>

          <div id="reading-list-items" class="flex-grow overflow-y-auto space-y-3 pr-1">
            <!-- Items injected dynamically -->
          </div>

          <div class="pt-4 border-t border-hairline flex items-center justify-between text-xs text-muted">
            <button id="clear-all-bookmarks" class="text-faint hover:text-vermilion transition-colors">
              <i class="ri-delete-bin-line"></i> <span data-mm="အားလုံးရှင်းလင်းရန်" data-en="Clear All">အားလုံးရှင်းလင်းရန်</span>
            </button>
            <span class="text-faint text-[11px]" id="bookmarks-count-footer">0 articles</span>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);
    }

    async function populateReadingList() {
      const itemsContainer = document.getElementById('reading-list-items');
      const footerCount = document.getElementById('bookmarks-count-footer');
      if (!itemsContainer || !window.HtetData) return;

      const savedIds = BookmarkSystem.getBookmarks();
      const articles = await window.HtetData.getArticles();
      const savedArticles = articles.filter(a => savedIds.includes(a.id));
      const lang = window.I18n ? window.I18n.getLang() : 'mm';

      if (footerCount) footerCount.textContent = `${savedArticles.length} ${lang === 'mm' ? 'ပုဒ်' : 'articles'}`;

      if (savedArticles.length === 0) {
        itemsContainer.innerHTML = `
          <div class="py-16 text-center text-muted">
            <i class="ri-bookmark-line text-4xl text-faint mb-2 block"></i>
            <p class="text-xs" data-mm="သိမ်းဆည်းထားသော စာမူ မရှိသေးပါ။" data-en="No saved articles yet.">သိမ်းဆည်းထားသော စာမူ မရှိသေးပါ။</p>
          </div>
        `;
        return;
      }

      itemsContainer.innerHTML = savedArticles.map(a => {
        const catStr = (lang === 'mm' ? (a.category_mm || a.category_en) : (a.category_en || a.category_mm)) || '';
        const titleStr = (lang === 'mm' ? (a.title_mm || a.title_en) : (a.title_en || a.title_mm)) || '';
        const readTimeStr = (lang === 'mm' ? (a.read_time_mm || a.read_time_en) : (a.read_time_en || a.read_time_mm)) || (lang === 'mm' ? '၁၂ မိနစ်' : '12 min');

        return `
        <div class="p-3.5 rounded-xl border border-hairline bg-ivory hover:border-vermilion/50 transition-all flex items-start justify-between group">
          <a href="article.html?id=${a.id}" class="flex-grow pr-2">
            <span class="text-[10px] text-vermilion font-medium block uppercase mb-0.5">${catStr}</span>
            <h4 class="font-serif-editorial text-sm font-semibold text-charcoal group-hover:text-vermilion transition-colors line-clamp-2">
              ${titleStr}
            </h4>
            <span class="text-[10px] text-faint flex items-center space-x-1 mt-1">
              <i class="ri-time-line"></i> <span>${readTimeStr}</span>
            </span>
          </a>
          <button data-remove-bmark="${a.id}" class="text-faint hover:text-vermilion p-1 transition-colors" title="Remove">
            <i class="ri-close-circle-line text-base"></i>
          </button>
        </div>
      `;
      }).join('');

      itemsContainer.querySelectorAll('[data-remove-bmark]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.getAttribute('data-remove-bmark');
          BookmarkSystem.toggle(id);
          populateReadingList();
        });
      });
    }

    function openDrawer() {
      populateReadingList();
      drawer.classList.remove('hidden', 'pointer-events-none');
      void drawer.offsetWidth;
      drawer.classList.remove('translate-x-full');
      drawer.classList.add('is-open');
      if (overlay) {
        overlay.classList.remove('hidden', 'pointer-events-none');
        overlay.classList.add('is-open', 'visible');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
      }
      document.body.classList.add('overflow-hidden');
    }

    function closeDrawer() {
      drawer.classList.add('translate-x-full');
      drawer.classList.remove('is-open');
      if (overlay) {
        overlay.classList.add('opacity-0');
        overlay.classList.remove('is-open', 'visible');
        setTimeout(() => {
          overlay.classList.add('hidden', 'pointer-events-none');
        }, 300);
      }
      setTimeout(() => {
        if (!drawer.classList.contains('is-open')) {
          drawer.classList.add('hidden', 'pointer-events-none');
        }
      }, 300);
      document.body.classList.remove('overflow-hidden');
    }

    document.querySelectorAll('#reading-list-trigger').forEach(btn => {
      btn.addEventListener('click', openDrawer);
    });

    const closeBtn = document.getElementById('reading-list-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    const clearBtn = document.getElementById('clear-all-bookmarks');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        localStorage.removeItem(BookmarkSystem.KEY);
        BookmarkSystem.updateBadge();
        populateReadingList();
        showToast('All bookmarks cleared.');
      });
    }

    BookmarkSystem.updateBadge();
  }

  // 8. Global Spotlight Search Modal (Cmd+K / Ctrl+K / Search Trigger)
  function initSpotlightSearch() {
    let modal = document.getElementById('spotlight-search-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'spotlight-search-modal';
      modal.className = 'fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-50 hidden opacity-0 transition-opacity duration-200 flex items-start justify-center pt-10 sm:pt-20 p-3 sm:p-4 pointer-events-none';
      modal.innerHTML = `
        <div class="bg-card w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-taupe-light shadow-2xl overflow-hidden font-sans-ui transform scale-95 transition-transform duration-200">
          <div class="p-3.5 sm:p-4 border-b border-hairline flex items-center space-x-2.5 sm:space-x-3 bg-ivory">
            <i class="ri-search-2-line text-lg sm:text-xl text-vermilion"></i>
            <input 
              type="text" 
              id="spotlight-input" 
              placeholder="Search essays, concepts, journals, or topics... (Esc to close)" 
              class="w-full bg-transparent text-charcoal placeholder-faint text-xs sm:text-sm focus:outline-none"
            />
            <span class="text-[10px] font-mono text-faint border border-hairline px-1.5 py-0.5 rounded">ESC</span>
          </div>

          <div id="spotlight-results" class="max-h-[60vh] sm:max-h-96 overflow-y-auto p-3 sm:p-4 space-y-2">
            <div class="py-12 text-center text-muted text-xs">
              <i class="ri-compass-3-line text-3xl text-faint mb-2 block"></i>
              <span>Type keyword to search across essays, glossary, and journal updates.</span>
            </div>
          </div>

          <div class="px-4 py-2.5 bg-cream/50 border-t border-hairline flex items-center justify-between text-[11px] text-faint">
            <span class="flex items-center space-x-2">
              <span class="border border-hairline px-1 rounded">↵</span> <span>to select</span>
              <span class="border border-hairline px-1 rounded">↑↓</span> <span>to navigate</span>
            </span>
            <span class="hanko-stamp px-1.5 py-0.1 text-[9px]">ထက်</span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const input = document.getElementById('spotlight-input');
    const resultsContainer = document.getElementById('spotlight-results');

    function openSpotlight() {
      modal.classList.remove('hidden', 'pointer-events-none');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
        if (input) {
          input.value = '';
          input.focus();
        }
      }, 10);
      document.body.classList.add('overflow-hidden');
    }

    function closeSpotlight() {
      modal.classList.add('opacity-0');
      modal.querySelector('.transform').classList.add('scale-95');
      setTimeout(() => modal.classList.add('hidden', 'pointer-events-none'), 200);
      document.body.classList.remove('overflow-hidden');
    }

    // Keyboard Shortcuts: Cmd+K, Ctrl+K, or Slash /
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        modal.classList.contains('hidden') ? openSpotlight() : closeSpotlight();
      } else if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeSpotlight();
      }
    });

    document.querySelectorAll('#spotlight-search-trigger').forEach(btn => {
      btn.addEventListener('click', openSpotlight);
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeSpotlight();
    });

    // Real-Time Global Search Execution
    if (input && resultsContainer) {
      input.addEventListener('input', async (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
          resultsContainer.innerHTML = `
            <div class="py-12 text-center text-muted text-xs">
              <i class="ri-compass-3-line text-3xl text-faint mb-2 block"></i>
              <span>Type keyword to search across essays, glossary, and journal updates.</span>
            </div>
          `;
          return;
        }

        const lang = window.I18n ? window.I18n.getLang() : 'mm';
        const articles = (await window.HtetData.getArticles()) || [];
        const glossary = (await window.HtetData.getGlossary()) || [];
        const posts = (await window.HtetData.getPosts()) || [];

        // Match articles
        const matchedArticles = articles.filter(a => {
          const t = `${a.title_mm || ''} ${a.title_en || ''} ${a.excerpt_mm || ''} ${a.excerpt_en || ''} ${(a.tags || []).join(' ')}`.toLowerCase();
          return t.includes(query);
        }).map(a => ({
          type: 'Essay',
          title: (lang === 'mm' ? (a.title_mm || a.title_en) : (a.title_en || a.title_mm)) || '',
          subtitle: (lang === 'mm' ? (a.category_mm || a.category_en) : (a.category_en || a.category_mm)) || '',
          url: `article.html?id=${a.id || a.slug}`,
          icon: 'ri-article-line'
        }));

        // Match glossary
        const matchedGlossary = glossary.filter(g => {
          const t = `${g.term_en || ''} ${g.term_mm || ''} ${g.definition_en || ''} ${g.definition_mm || ''} ${g.thinker || ''}`.toLowerCase();
          return t.includes(query);
        }).map(g => ({
          type: 'Concept',
          title: (lang === 'mm' ? (g.term_mm || g.term_en) : (g.term_en || g.term_mm)) || '',
          subtitle: g.thinker || '',
          url: `glossary.html#${g.id}`,
          icon: 'ri-book-read-line'
        }));

        // Match posts
        const matchedPosts = posts.filter(p => {
          const postText = `${p.title_mm || ''} ${p.title_en || ''} ${p.content_mm || ''} ${p.content_en || ''} ${p.category_mm || ''} ${p.category_en || ''}`.toLowerCase();
          return postText.includes(query);
        }).map(p => {
          const postTitle = (lang === 'mm' ? (p.title_mm || p.title_en) : (p.title_en || p.title_mm));
          const postContent = (lang === 'mm' ? (p.content_mm || p.content_en) : (p.content_en || p.content_mm)) || '';
          return {
            type: 'Journal',
            title: postTitle ? postTitle : (postContent.slice(0, 60) + '...'),
            subtitle: p.date || '',
            url: `journal.html#${p.id}`,
            icon: 'ri-booklet-line'
          };
        });

        const combined = [...matchedArticles, ...matchedGlossary, ...matchedPosts];

        if (combined.length === 0) {
          resultsContainer.innerHTML = `
            <div class="py-12 text-center text-muted text-xs">
              <i class="ri-inbox-line text-3xl text-faint mb-2 block"></i>
              <span>No results found for "${query}".</span>
            </div>
          `;
          return;
        }

        resultsContainer.innerHTML = combined.map(item => `
          <a href="${item.url}" class="p-3 rounded-xl hover:bg-cream border border-transparent hover:border-hairline transition-all flex items-center justify-between group">
            <div class="flex items-center space-x-3 overflow-hidden">
              <span class="w-8 h-8 rounded-lg bg-cream text-charcoal group-hover:bg-vermilion group-hover:text-white transition-colors flex items-center justify-center flex-shrink-0 text-base">
                <i class="${item.icon}"></i>
              </span>
              <div class="truncate">
                <h4 class="font-serif-editorial text-sm font-semibold text-charcoal group-hover:text-vermilion transition-colors truncate">
                  ${item.title}
                </h4>
                <span class="text-[11px] text-faint truncate block">${item.subtitle}</span>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-cream text-charcoal flex-shrink-0 ml-2">
              ${item.type}
            </span>
          </a>
        `).join('');
      });
    }
  }

  // 9. Interactive Text Selection Quote Popover with Remix Icons
  function initQuoteSelectionPopover() {
    let popover = document.getElementById('quote-popover');
    if (!popover) {
      popover = document.createElement('div');
      popover.id = 'quote-popover';
      popover.style.display = 'none';
      popover.innerHTML = `
        <button id="quote-copy-btn" class="px-2.5 py-1 text-xs rounded-lg hover:bg-cream flex items-center space-x-1.5 text-charcoal font-medium transition-colors">
          <i class="ri-file-copy-2-line text-vermilion"></i> <span>Copy Quote</span>
        </button>
        <span class="text-faint opacity-40">|</span>
        <button id="quote-share-btn" class="px-2.5 py-1 text-xs rounded-lg hover:bg-cream flex items-center space-x-1.5 text-charcoal font-medium transition-colors">
          <i class="ri-telegram-fill text-[#2AABEE]"></i> <span>Telegram</span>
        </button>
      `;
      document.body.appendChild(popover);
    }

    let selectedText = '';

    document.addEventListener('mouseup', (e) => {
      const selection = window.getSelection();
      selectedText = selection ? selection.toString().trim() : '';

      if (selectedText.length > 10 && e.target.closest('#article-content-body')) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        popover.style.top = `${rect.top + window.scrollY}px`;
        popover.style.left = `${rect.left + rect.width / 2}px`;
        popover.style.display = 'flex';
      } else if (!e.target.closest('#quote-popover')) {
        popover.style.display = 'none';
      }
    });

    popover.querySelector('#quote-copy-btn').addEventListener('click', () => {
      const formattedQuote = `“${selectedText}”\n— Htet (ထက်) | ${window.location.href}`;
      navigator.clipboard.writeText(formattedQuote).then(() => {
        showToast('Quote copied with citation!');
        popover.style.display = 'none';
      });
    });

    popover.querySelector('#quote-share-btn').addEventListener('click', () => {
      const formattedQuote = `“${selectedText}”\n— Htet (ထက်)`;
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent(formattedQuote);
      window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
      popover.style.display = 'none';
    });
  }

  // 10. Global Share Buttons with Rich Remix Icons
  function initShareButtons() {
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('[data-share="copy"]');
      if (copyBtn) {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href).then(() => {
          const lang = window.I18n ? window.I18n.getLang() : 'mm';
          const msg = (lang === 'mm') ? 'လင့်ခ် ကူးယူပြီးပါပြီ။' : 'Link copied to clipboard!';
          showToast(msg);
        });
      }

      const teleBtn = e.target.closest('[data-share="telegram"]');
      if (teleBtn) {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(document.title);
        window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
      }

      const fbBtn = e.target.closest('[data-share="facebook"]');
      if (fbBtn) {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
      }

      // Bookmark Button Handler
      const bmarkBtn = e.target.closest('[data-bookmark-id]');
      if (bmarkBtn) {
        e.preventDefault();
        const id = bmarkBtn.getAttribute('data-bookmark-id');
        const isNowBookmarked = BookmarkSystem.toggle(id);
        const icon = bmarkBtn.querySelector('i');
        if (icon) {
          icon.className = isNowBookmarked ? 'ri-bookmark-3-fill text-vermilion text-base' : 'ri-bookmark-3-line text-faint text-base';
        }
      }
    });
  }

  // Helper: Map category name to one of 7 curated dots
  function getCategoryDotClass(catName) {
    if (!catName) return "dot-royal-blue";
    const lower = catName.toLowerCase();
    if (lower.includes("ကျား") || lower.includes("မ") || lower.includes("gender") || lower.includes("trans") || lower.includes("queer") || lower.includes("lesbian") || lower.includes("feminism")) {
      return "dot-pink";
    }
    if (lower.includes("ဒဿန") || lower.includes("philosophy") || lower.includes("epistemology") || lower.includes("စာပေ") || lower.includes("ပညာ")) {
      return "dot-royal-blue";
    }
    if (lower.includes("နိုင်ငံရေး") || lower.includes("တရားမျှတမှု") || lower.includes("justice") || lower.includes("activism") || lower.includes("revolution")) {
      return "dot-true-red";
    }
    if (lower.includes("ဝေဖန်ရေး") || lower.includes("critique") || lower.includes("theory") || lower.includes("စနစ်")) {
      return "dot-violet";
    }
    if (lower.includes("ကဗျာ") || lower.includes("poem") || lower.includes("poetry") || lower.includes("အနုပညာ")) {
      return "dot-soft-pink";
    }
    if (lower.includes("အမှတ်တရ") || lower.includes("memory") || lower.includes("ရင်ဖွင့်") || lower.includes("lament")) {
      return "dot-rose";
    }
    if (lower.includes("မီဒီယာ") || lower.includes("media") || lower.includes("ကျောင်း") || lower.includes("လူငယ်")) {
      return "dot-sky-blue";
    }
    const dots = ["dot-sky-blue", "dot-true-red", "dot-royal-blue", "dot-violet", "dot-pink", "dot-soft-pink", "dot-rose"];
    let hash = 0;
    for (let i = 0; i < catName.length; i++) hash = (hash + catName.charCodeAt(i)) % dots.length;
    return dots[hash];
  }

  // 11. Articles Archive Render with Enhanced Space-Saving Multi-Category Filter
  async function initArticlesArchive() {
    const listContainer = document.getElementById("articles-archive-list");
    if (!listContainer || !window.HtetData) return;

    const searchInput = document.getElementById("articles-search");
    const searchClearBtn = document.getElementById("articles-search-clear");
    const categoryFilterContainer = document.getElementById("articles-category-filter");
    const countBadge = document.getElementById("articles-count-badge");
    const sortSelect = document.getElementById("articles-sort");
    const activeFiltersBar = document.getElementById("articles-active-filters");
    const resetFiltersBtn = document.getElementById("articles-reset-filters");

    // Multi-Category Space-Saving Controls
    const scrollLeftBtn = document.getElementById("articles-scroll-left");
    const scrollRightBtn = document.getElementById("articles-scroll-right");
    const toggleExpandBtn = document.getElementById("articles-toggle-expand");
    const drawerContainer = document.getElementById("articles-category-drawer");
    const drawerPillsContainer = document.getElementById("articles-drawer-pills");
    const drawerClearBtn = document.getElementById("articles-drawer-clear-btn");
    const multiCountBadge = document.getElementById("articles-multi-count-badge");
    const activeTagsList = document.getElementById("articles-active-tags-list");

    const articles = await window.HtetData.getArticles();
    let selectedCategories = new Set();
    let searchQuery = "";
    let currentSort = "newest";

    // Read URL query parameter ?category=... or ?categories=...
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get("category") || urlParams.get("categories");
    if (initialCategory && initialCategory !== "all") {
      initialCategory.split(",").map(c => c.trim()).filter(Boolean).forEach(c => selectedCategories.add(c));
    }

    // Build Dynamic Category Pills with live item counts (Both compact track & expanded drawer)
    function renderCategoryPills() {
      if (!categoryFilterContainer) return;
      const lang = window.I18n ? window.I18n.getLang() : "mm";

      // Collect categories and counts
      const counts = { "all": articles.length };
      const categoryMap = new Map(); // key -> { mm, en, key }

      articles.forEach(art => {
        const catsMM = art.categories_mm || (art.category_mm ? [art.category_mm] : []);
        const catsEN = art.categories_en || (art.category_en ? [art.category_en] : []);
        
        catsMM.forEach((catMM, idx) => {
          const catEN = catsEN[idx] || catMM;
          const key = (lang === "mm") ? catMM : catEN;
          counts[key] = (counts[key] || 0) + 1;
          if (!categoryMap.has(key)) {
            categoryMap.set(key, { mm: catMM, en: catEN, key: key });
          }
        });
      });

      const isAllActive = (selectedCategories.size === 0);

      // Helper to generate a pill button
      function createPill(catKey, label, count, isActive, isAll = false) {
        const dotClass = isAll ? "" : getCategoryDotClass(catKey);
        return `
          <button type="button" data-category="${catKey}" class="category-pill ${isActive ? "active" : ""}" title="${label} (${count})">
            ${isAll 
              ? `<i class="ri-apps-2-line ${isActive ? "text-white" : "text-vermilion"}"></i>`
              : `<span class="category-color-dot ${dotClass}"></span>`
            }
            <span>${label}</span>
            <span class="category-pill-count">${count}</span>
            ${(!isAll && isActive) ? `<i class="ri-check-line text-[11px] ml-0.5"></i>` : ""}
          </button>
        `;
      }

      let allPillHtml = createPill(
        "all", 
        lang === "mm" ? "အားလုံး" : "All Categories", 
        counts["all"], 
        isAllActive, 
        true
      );

      let pillsListHtml = "";
      categoryMap.forEach(cat => {
        const count = counts[cat.key] || 0;
        const isActive = selectedCategories.has(cat.key) || selectedCategories.has(cat.mm) || selectedCategories.has(cat.en);
        pillsListHtml += createPill(cat.key, cat.key, count, isActive, false);
      });

      categoryFilterContainer.innerHTML = allPillHtml + pillsListHtml;

      if (drawerPillsContainer) {
        drawerPillsContainer.innerHTML = allPillHtml + pillsListHtml;
      }

      // Update Header Multi-Count Badge
      if (multiCountBadge) {
        if (selectedCategories.size > 0) {
          multiCountBadge.classList.remove("hidden");
          multiCountBadge.textContent = `${selectedCategories.size} ${lang === "mm" ? "ခု ရွေးထားသည်" : "selected"}`;
        } else {
          multiCountBadge.classList.add("hidden");
          multiCountBadge.textContent = "";
        }
      }
    }

    function renderList() {
      const lang = window.I18n ? window.I18n.getLang() : "mm";

      // 1. Filter articles by Multi-Category & Search Query
      let filtered = articles.filter(article => {
        const catsMM = article.categories_mm || (article.category_mm ? [article.category_mm] : []);
        const catsEN = article.categories_en || (article.category_en ? [article.category_en] : []);
        const allCats = [...catsMM, ...catsEN, article.category_mm, article.category_en].filter(Boolean);

        // Multi-category match: empty set = match all; non-empty set = article has at least one matching category
        const matchesCategory = (selectedCategories.size === 0) || 
          allCats.some(c => Array.from(selectedCategories).some(sc => sc.toLowerCase() === c.toLowerCase()));

        const title = (lang === "mm") ? article.title_mm : article.title_en;
        const excerpt = (lang === "mm") ? article.excerpt_mm : article.excerpt_en;
        const content = (lang === "mm") ? article.content_mm : article.content_en;
        const tags = Array.isArray(article.tags) ? article.tags.join(" ") : "";
        const author = (lang === "mm") ? (article.author_mm || "") : (article.author_en || "");
        const haystack = `${title} ${excerpt} ${tags} ${author} ${allCats.join(" ")}`.toLowerCase();

        const matchesSearch = !searchQuery || haystack.includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      // 2. Sort articles
      filtered.sort((a, b) => {
        if (currentSort === "oldest") {
          return (a.date || "").localeCompare(b.date || "");
        } else if (currentSort === "longest") {
          const lenA = (a.content_mm || "").length;
          const lenB = (b.content_mm || "").length;
          return lenB - lenA;
        } else if (currentSort === "shortest") {
          const lenA = (a.content_mm || "").length;
          const lenB = (b.content_mm || "").length;
          return lenA - lenB;
        }
        return (b.date || "").localeCompare(a.date || "");
      });

      if (countBadge) countBadge.textContent = filtered.length;

      // Update Active Filter bar & Tag chips
      if (activeFiltersBar) {
        const hasFilters = (selectedCategories.size > 0 || searchQuery !== "");
        if (hasFilters) {
          activeFiltersBar.classList.remove("hidden");
          if (activeTagsList) {
            let tagsHtml = "";
            if (searchQuery) {
              tagsHtml += `
                <span class="active-filter-chip">
                  <i class="ri-search-line text-xs"></i>
                  <span>"${searchQuery}"</span>
                  <button type="button" id="articles-clear-search-chip" title="Clear query">
                    <i class="ri-close-line"></i>
                  </button>
                </span>
              `;
            }
            selectedCategories.forEach(cat => {
              tagsHtml += `
                <span class="active-filter-chip">
                  <span class="category-color-dot ${getCategoryDotClass(cat)}"></span>
                  <span>${cat}</span>
                  <button type="button" data-remove-cat="${cat}" title="Remove ${cat}">
                    <i class="ri-close-line"></i>
                  </button>
                </span>
              `;
            });
            tagsHtml += `
              <span class="text-[11px] text-faint ml-1 font-mono">(${filtered.length} ${lang === "mm" ? "ပုဒ် တွေ့ရှိ" : "found"})</span>
            `;
            activeTagsList.innerHTML = tagsHtml;

            // Wire clear search chip
            const clearSearchChip = document.getElementById("articles-clear-search-chip");
            if (clearSearchChip) {
              clearSearchChip.addEventListener("click", () => {
                searchQuery = "";
                if (searchInput) searchInput.value = "";
                if (searchClearBtn) searchClearBtn.classList.add("hidden");
                renderList();
              });
            }

            // Wire individual tag remove buttons
            activeTagsList.querySelectorAll("[data-remove-cat]").forEach(btn => {
              btn.addEventListener("click", () => {
                const catToRemove = btn.getAttribute("data-remove-cat");
                selectedCategories.delete(catToRemove);
                renderCategoryPills();
                renderList();
              });
            });
          }
        } else {
          activeFiltersBar.classList.add("hidden");
        }
      }

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="py-16 text-center border border-dashed border-taupe-light rounded-2xl bg-card" data-aos="fade-up">
            <span class="text-4xl text-faint mb-2 block font-serif-editorial"><i class="ri-inbox-line"></i></span>
            <p class="text-muted text-sm font-sans-ui">
              ${lang === "mm" ? "မည်သည့် စာမူမျှ ရှာမတွေ့ပါ။ စစ်ထုတ်မှုများကို ပြန်လည်ရှင်းလင်းကြည့်ပါ။" : "No articles found matching your criteria. Try resetting filters."}
            </p>
            <button onclick="document.getElementById('articles-reset-filters')?.click()" class="mt-4 px-4 py-2 rounded-xl bg-vermilion text-white text-xs font-sans-ui hover:bg-vermilion-dark transition-colors cursor-pointer">
              ${lang === "mm" ? "စစ်ထုတ်မှု အားလုံး ရှင်းလင်းရန်" : "Reset All Filters"}
            </button>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = filtered.map((article, idx) => {
        const isSaved = BookmarkSystem.isBookmarked(article.id);
        const iconClass = isSaved ? "ri-bookmark-3-fill text-vermilion" : "ri-bookmark-3-line text-faint";
        const cats = (lang === "mm")
          ? (article.categories_mm || (article.category_mm ? [article.category_mm] : []))
          : (article.categories_en || (article.category_en ? [article.category_en] : []));
        const author = (lang === "mm") ? (article.author_mm || "ဧကရီ (ထက်)") : (article.author_en || "Ekri (Htet)");
        const citationsCount = Array.isArray(article.citations) ? article.citations.length : 0;

        return `
          <article class="glass-3d-card card-3d-interactive p-6 md:p-8 rounded-2xl border border-taupe-light bg-card transition-all duration-300 relative group shadow-sm" data-aos="fade-up" data-aos-delay="${idx * 60}">
            
            <!-- Metadata Top Row -->
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-faint font-sans-ui">
              <div class="flex flex-wrap items-center gap-1.5">
                ${cats.map(c => `
                  <button type="button" class="article-cat-chip px-2.5 py-0.5 rounded-full bg-cream hover:bg-taupe-light text-charcoal font-medium border border-hairline flex items-center space-x-1 cursor-pointer transition-colors" data-filter-cat="${c}">
                    <span class="category-color-dot ${getCategoryDotClass(c)}"></span>
                    <span>${c}</span>
                  </button>
                `).join("")}
                <span>•</span>
                <span class="flex items-center space-x-1">
                  <i class="ri-calendar-2-line"></i>
                  <span>${article.date}</span>
                </span>
              </div>
              <div class="flex items-center space-x-3">
                <span class="flex items-center space-x-1">
                  <i class="ri-time-line text-vermilion"></i>
                  <span>${lang === "mm" ? (article.read_time_mm || '၁၂ မိနစ် ဖတ်ရှုရန်') : (article.read_time_en || '12 min read')}</span>
                </span>
                <button data-bookmark-id="${article.id}" class="hover:text-vermilion transition-colors p-1" title="Bookmark article">
                  <i class="${iconClass} text-base"></i>
                </button>
              </div>
            </div>

            <!-- Title -->
            <h2 class="font-serif-editorial text-2xl md:text-3xl text-charcoal group-hover:text-vermilion font-medium transition-colors mb-3">
              <a href="article.html?id=${article.id}" class="hover:underline">
                ${lang === "mm" ? article.title_mm : article.title_en}
              </a>
            </h2>

            ${(article.image || article.cover_image) ? `
              <div class="mb-4 rounded-xl overflow-hidden border border-hairline shadow-2xs max-h-60 sm:max-h-72">
                <a href="article.html?id=${article.id}">
                  <img src="${article.image || article.cover_image}" alt="${lang === 'mm' ? article.title_mm : article.title_en}" class="w-full h-48 sm:h-56 object-cover object-center group-hover:scale-102 transition-transform duration-500" loading="lazy">
                </a>
              </div>
            ` : ""}

            <!-- Excerpt -->
            <p class="text-muted text-base leading-relaxed mb-6 font-sans-ui line-clamp-3">
              ${lang === "mm" ? article.excerpt_mm : article.excerpt_en}
            </p>

            <!-- Bottom Row: Author Badge, Citations, Tags, and Read CTA -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-hairline text-xs font-sans-ui">
              <div class="flex flex-wrap items-center gap-2">
                <span class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cream text-charcoal border border-hairline text-[11px]">
                  <span class="hanko-seal-3d w-4 h-4 text-[8px] flex items-center justify-center font-bold">ထက်</span>
                  <span>${author}</span>
                </span>
                ${citationsCount > 0 ? `
                  <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 text-[11px]">
                    <i class="bi bi-journal-bookmark text-xs"></i>
                    <span>${citationsCount} ${lang === "mm" ? "စာကိုး" : "citations"}</span>
                  </span>
                ` : ""}
                ${(article.tags || []).slice(0, 3).map(t => `<span class="px-2 py-0.5 rounded bg-cream/70 text-faint flex items-center space-x-0.5 text-[11px]"><i class="ri-hashtag text-[9px]"></i><span>${t}</span></span>`).join("")}
              </div>

              <div class="flex flex-wrap items-center gap-2.5">
                <a href="article.html?id=${article.id}" class="btn-3d-tactile inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-vermilion text-white hover:bg-vermilion-dark font-medium text-xs shadow-xs transition-all" title="${lang === 'mm' ? 'ဆောင်းပါး အပြည့်အစုံ ဖတ်ရှုရန်' : 'Read Full Article'}">
                  <i class="ri-book-open-line"></i>
                  <span>${lang === 'mm' ? 'ဆောင်းပါးဖတ်ရန်' : 'Read Article'}</span>
                </a>
                <button type="button" class="btn-3d-tactile article-card-lang-toggle-btn px-2.5 py-1.5 rounded-xl border border-hairline bg-cream hover:bg-taupe-light dark:bg-zinc-800 text-charcoal font-medium text-xs flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs" data-article-id="${article.id}" data-showing-original="${lang === 'mm' ? 'true' : 'false'}" title="${lang === 'mm' ? 'အင်္ဂလိပ်ဘာသာပြန်ချက် ကြည့်ရန်' : 'မူရင်းမြန်မာဘာသာဖြင့် ကြည့်ရန် (View Original Burmese)'}">
                  <span class="lang-toggle-flag text-xs">${lang === 'mm' ? '🌐' : '🇲🇲'}</span>
                  <span class="lang-toggle-label text-[11px] font-sans-ui">${lang === 'mm' ? 'English' : 'Original (MM)'}</span>
                </button>
                ${article.source_url ? `
                  <a href="${article.source_url}" target="_blank" rel="noopener noreferrer" class="btn-3d-tactile px-2.5 py-1.5 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs flex items-center space-x-1 border border-hairline transition-colors" title="မူရင်း Blogpost သို့">
                    <i class="ri-external-link-line text-amber-600"></i>
                    <span>Blog</span>
                  </a>
                ` : ''}
                ${article.pdf_file ? `
                  <a href="${article.pdf_file.startsWith('downloads/') ? article.pdf_file : 'downloads/' + article.pdf_file}" download class="btn-3d-tactile px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-900/60 flex items-center space-x-1 transition-colors shadow-2xs" title="Download Full Version PDF">
                    <i class="ri-file-pdf-line text-red-500"></i>
                    <span>PDF</span>
                  </a>
                ` : ''}
              </div>
            </div>
          </article>
        `;
      }).join("");

      initAOS();
      if (typeof init3DTiltAndFloatingEffects === 'function') {
        init3DTiltAndFloatingEffects();
      }

      // Inline card language toggle handler (Burmese Original <-> Translation)
      listContainer.querySelectorAll(".article-card-lang-toggle-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const articleId = btn.getAttribute("data-article-id");
          const article = articles.find(a => a.id === articleId);
          if (!article) return;
          const card = btn.closest("article");
          if (!card) return;

          const isShowingOriginal = btn.getAttribute("data-showing-original") === "true";
          const siteLang = window.I18n ? window.I18n.getLang() : "mm";
          const willShowOriginal = !isShowingOriginal;

          btn.setAttribute("data-showing-original", willShowOriginal ? "true" : "false");
          const flagEl = btn.querySelector(".lang-toggle-flag") || btn.querySelector("span:first-child");
          const labelEl = btn.querySelector(".lang-toggle-label");

          if (siteLang !== "mm") {
            if (willShowOriginal) {
              if (flagEl) flagEl.textContent = "🌐";
              if (labelEl) labelEl.textContent = siteLang.toUpperCase();
              btn.title = `Switch back to ${siteLang.toUpperCase()} translation`;
            } else {
              if (flagEl) flagEl.textContent = "🇲🇲";
              if (labelEl) labelEl.textContent = "Original (MM)";
              btn.title = "View Original Burmese (မူရင်းမြန်မာဘာသာဖြင့် ကြည့်ရန်)";
            }
          } else {
            if (willShowOriginal) {
              if (flagEl) flagEl.textContent = "🌐";
              if (labelEl) labelEl.textContent = "English";
              btn.title = "View English translation";
            } else {
              if (flagEl) flagEl.textContent = "🇲🇲";
              if (labelEl) labelEl.textContent = "Original (MM)";
              btn.title = "မူရင်းမြန်မာစာမူသို့ ပြန်သွားရန်";
            }
          }

          const titleLink = card.querySelector("h2 a");
          if (titleLink) {
            titleLink.textContent = willShowOriginal ? (article.title_mm || article.title_en) : (article.title_en || article.title_mm);
          }
          const excerptP = card.querySelector("p.line-clamp-3");
          if (excerptP) {
            excerptP.textContent = willShowOriginal ? (article.excerpt_mm || article.excerpt_en) : (article.excerpt_en || article.excerpt_mm);
          }

          if (window.HtetUI && typeof window.HtetUI.showToast === "function") {
            window.HtetUI.showToast(willShowOriginal 
              ? "မူရင်းမြန်မာဘာသာ စာမူသို့ ပြောင်းလဲပြသထားပါသည် ✓" 
              : "ဘာသာပြန်ဆိုချက်သို့ ပြောင်းလဲပြသထားပါသည် ✓");
          }
        });
      });

      // In-article category tag click: toggles category filter
      listContainer.querySelectorAll(".article-cat-chip").forEach(chip => {
        chip.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const targetCat = chip.getAttribute("data-filter-cat");
          if (selectedCategories.has(targetCat)) {
            selectedCategories.delete(targetCat);
          } else {
            selectedCategories.add(targetCat);
          }
          renderCategoryPills();
          renderList();
          window.scrollTo({ top: categoryFilterContainer.offsetTop - 120, behavior: "smooth" });
        });
      });
    }

    // Category button click delegation handler (works for both compact track & drawer)
    function handleCategoryClick(e) {
      const catBtn = e.target.closest("[data-category]");
      if (catBtn) {
        e.preventDefault();
        const clickedCat = catBtn.getAttribute("data-category");
        if (clickedCat === "all") {
          selectedCategories.clear();
        } else {
          if (selectedCategories.has(clickedCat)) {
            selectedCategories.delete(clickedCat);
          } else {
            selectedCategories.add(clickedCat);
          }
        }
        renderCategoryPills();
        renderList();
      }
    }

    if (categoryFilterContainer) {
      categoryFilterContainer.addEventListener("click", handleCategoryClick);
    }
    if (drawerPillsContainer) {
      drawerPillsContainer.addEventListener("click", handleCategoryClick);
    }

    // Scroll buttons
    if (scrollLeftBtn && categoryFilterContainer) {
      scrollLeftBtn.addEventListener("click", () => {
        categoryFilterContainer.scrollBy({ left: -240, behavior: "smooth" });
      });
    }
    if (scrollRightBtn && categoryFilterContainer) {
      scrollRightBtn.addEventListener("click", () => {
        categoryFilterContainer.scrollBy({ left: 240, behavior: "smooth" });
      });
    }

    // Expand Drawer Toggle
    if (toggleExpandBtn && drawerContainer) {
      toggleExpandBtn.addEventListener("click", () => {
        const lang = window.I18n ? window.I18n.getLang() : "mm";
        const isOpen = drawerContainer.classList.contains("open");
        const labelEl = document.getElementById("articles-expand-label");
        const iconEl = document.getElementById("articles-expand-icon");
        if (isOpen) {
          drawerContainer.classList.remove("open");
          if (labelEl) labelEl.textContent = lang === "mm" ? "အားလုံးဖြန့်ကြည့်ရန်" : "Expand All";
          if (iconEl) iconEl.className = "ri-arrow-down-s-line text-xs";
        } else {
          drawerContainer.classList.add("open");
          if (labelEl) labelEl.textContent = lang === "mm" ? "ပြန်သိမ်းရန်" : "Collapse";
          if (iconEl) iconEl.className = "ri-arrow-up-s-line text-xs";
        }
      });
    }

    if (drawerClearBtn) {
      drawerClearBtn.addEventListener("click", () => {
        selectedCategories.clear();
        renderCategoryPills();
        renderList();
      });
    }

    // Search input
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim();
        if (searchClearBtn) {
          searchClearBtn.classList.toggle("hidden", searchQuery.length === 0);
        }
        renderList();
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener("click", () => {
        searchInput.value = "";
        searchQuery = "";
        searchClearBtn.classList.add("hidden");
        renderList();
      });
    }

    // Sort select
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderList();
      });
    }

    // Reset filters
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", () => {
        selectedCategories.clear();
        searchQuery = "";
        if (searchInput) searchInput.value = "";
        if (searchClearBtn) searchClearBtn.classList.add("hidden");
        if (sortSelect) sortSelect.value = "newest";
        currentSort = "newest";
        renderCategoryPills();
        renderList();
      });
    }

    renderCategoryPills();
    renderList();
    window.addEventListener("langchange", () => {
      renderCategoryPills();
      renderList();
    });
  }

  // 12. Journal / Micro-Blog Timeline Render with Categorized Social Media Architecture & Personal User Favorites
  async function initJournalFeed() {
    const feedContainer = document.getElementById("journal-feed-list");
    const compactGridContainer = document.getElementById("index-journal-compact-grid");
    if (!feedContainer && !compactGridContainer) return;
    if (!window.HtetData) return;

    const searchInput = document.getElementById("journal-search");
    const searchClearBtn = document.getElementById("journal-search-clear");
    const sortSelect = document.getElementById("journal-sort");
    const resultsCounter = document.getElementById("journal-results-counter");
    const tabButtons = document.querySelectorAll(".journal-tab-btn");

    // Profile header stats
    const statTotalEl = document.getElementById("stat-count-total");
    const statArticlesEl = document.getElementById("stat-count-articles");
    const statQuotesEl = document.getElementById("stat-count-quotes");
    const statNotesEl = document.getElementById("stat-count-notes");
    const statActivismEl = document.getElementById("stat-count-activism");

    // Tab badges
    const tabCountAllEl = document.getElementById("tab-count-all");
    const tabCountArticlesEl = document.getElementById("tab-count-articles");
    const tabCountQuotesEl = document.getElementById("tab-count-quotes");
    const tabCountPoetryEl = document.getElementById("tab-count-poetry");
    const tabCountNotesEl = document.getElementById("tab-count-notes");
    const tabCountActivismEl = document.getElementById("tab-count-activism");
    const tabCountFavoritesEl = document.getElementById("tab-count-favorites");

    // Copy Restriction Alert Banner Trigger
    function showCopyRestrictedWarning() {
      const lang = window.I18n ? window.I18n.getLang() : "mm";
      const title = (lang === "mm")
        ? "⚠️ မူပိုင်ခွင့် ကာကွယ်ထားသော စာမူ"
        : "⚠️ Copyright Protected Content";
      const msg = (lang === "mm")
        ? "ဤဝက်ဘ်ဆိုက်ရှိ ထက် (Htet) ၏ အတွေးစကားနှင့် စာသားများကို တိုက်ရိုက်ကူးယူခွင့် မပြုပါ။ စာဖတ်မှတ်တမ်း (Favorites) ထဲတွင်သာ သိမ်းဆည်းဖတ်ရှုပေးပါရန် မေတ္တာရပ်ခံအပ်ပါသည်။"
        : "Direct copying of text from this journal is restricted. Please save to your personal favorites instead.";

      let banner = document.getElementById("htet-copy-guard-alert");
      if (!banner) {
        banner = document.createElement("div");
        banner.id = "htet-copy-guard-alert";
        banner.className = "fixed top-6 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-[92vw] px-5 py-4 rounded-2xl bg-card border-2 border-rose-500 shadow-2xl text-charcoal font-sans-ui text-xs sm:text-sm flex items-start space-x-3 transition-all duration-300 pointer-events-auto backdrop-blur-lg";
        document.body.appendChild(banner);
      }
      banner.innerHTML = `
        <div class="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 text-lg shadow-sm">
          <i class="ri-shield-keyhole-line"></i>
        </div>
        <div class="flex-grow space-y-1">
          <div class="font-bold text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-center justify-between">
            <span>${title}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300 font-mono">Protected</span>
          </div>
          <p class="text-charcoal/90 text-xs leading-relaxed">
            ${msg}
          </p>
        </div>
      `;
      banner.style.opacity = "1";
      banner.style.transform = "translate(-50%, 0)";

      clearTimeout(banner._timer);
      banner._timer = setTimeout(() => {
        banner.style.opacity = "0";
        banner.style.transform = "translate(-50%, -20px)";
      }, 4500);

      if (window.HtetUI && typeof window.HtetUI.showToast === "function") {
        window.HtetUI.showToast(title + ": " + msg);
      }
    }

    // Bind Copy & Keyboard Protection
    document.addEventListener("copy", (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      e.preventDefault();
      if (e.clipboardData) e.clipboardData.clearData();
      showCopyRestrictedWarning();
    });

    document.addEventListener("cut", (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      e.preventDefault();
      showCopyRestrictedWarning();
    });

    document.addEventListener("keydown", (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
      if (ctrlOrCmd && (e.key === "c" || e.key === "C" || e.key === "x" || e.key === "X")) {
        e.preventDefault();
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
        }
        showCopyRestrictedWarning();
      }
    });

    document.addEventListener("contextmenu", (e) => {
      if (e.target.closest("#journal-feed-list") || e.target.closest(".journal-card") || e.target.closest("#journal-reader-modal")) {
        e.preventDefault();
        showCopyRestrictedWarning();
      }
    });

    // Helper: Convert Arabic numbers to Burmese digits
    function toBurmeseNumber(num) {
      const burmeseDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
      return String(num).replace(/[0-9]/g, (d) => burmeseDigits[+d]);
    }

    // Helper: Escape HTML strings for attributes and text
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Helper: Format ISO date string into readable text
    function formatFeedDate(dateStr, lang) {
      if (!dateStr) return '';
      if (lang === 'mm') {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
          const months = ['ဇန်နဝါရီ', 'ဖေဖော်ဝါရီ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်', 'ဇူလိုင်', 'ဩဂုတ်', 'စက်တင်ဘာ', 'အောက်တိုဘာ', 'နိုဝင်ဘာ', 'ဒီဇင်ဘာ'];
          const mIdx = parseInt(parts[1], 10) - 1;
          const mName = months[mIdx] || parts[1];
          return `${toBurmeseNumber(parts[0])} ${mName} ${toBurmeseNumber(parseInt(parts[2], 10))}`;
        }
      }
      return dateStr;
    }

    // Personal User Favorites / Liked Storage (No fake pre-filled numbers)
    const FAVORITES_KEY = "htet_user_favorites";
    function loadUserFavorites() {
      try {
        const raw = localStorage.getItem(FAVORITES_KEY);
        return raw ? new Set(JSON.parse(raw)) : new Set();
      } catch (err) {
        return new Set();
      }
    }
    function saveUserFavorites(favSet) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favSet]));
      } catch (err) {}
    }

    let userFavorites = loadUserFavorites();

    function updateFavoritesBadge() {
      if (tabCountFavoritesEl) {
        tabCountFavoritesEl.textContent = userFavorites.size;
      }
    }

    // 1. Fetch & normalize raw data collections
    const rawArticles = (await window.HtetData.getArticles()) || [];
    let rawQuotes = [];
    if (typeof window.HtetData.getQuotes === 'function') {
      rawQuotes = window.HtetData.getQuotes() || [];
    }
    if (!rawQuotes.length && window.HTET_QUOTES_BACKUP) {
      rawQuotes = window.HTET_QUOTES_BACKUP;
    }
    if (!rawQuotes.length) {
      try {
        const qRes = await fetch('data/quotes.json');
        if (qRes.ok) rawQuotes = await qRes.json();
      } catch (err) {}
    }
    const rawPosts = (await window.HtetData.getPosts()) || [];

    // Normalize Articles (25 items)
    const articlesList = rawArticles.map(a => ({
      id: a.id || a.slug,
      slug: a.slug || a.id,
      feedType: 'article',
      date: a.date || '2025-09-01',
      title_mm: a.title_mm || a.title || '',
      title_en: a.title_en || a.title || '',
      excerpt_mm: a.excerpt_mm || '',
      excerpt_en: a.excerpt_en || '',
      category_mm: a.category || a.category_mm || 'ဆောင်းပါးနှင့် စာတမ်း',
      category_en: a.category_en || 'Research Article',
      image: a.image || '',
      reading_time: a.reading_time || 5,
      tags: a.tags || [],
      pdf: a.pdf || '',
      markdown: a.markdown || '',
      source_url: a.source_url || (a.content_mm && a.content_mm.match(/https?:\/\/[^\s"'<>]+/)?.[0]) || ''
    }));

    // Normalize Quotes (19 items)
    const quotesList = rawQuotes.map((q, idx) => ({
      id: `quote-${idx + 1}`,
      feedType: 'quote',
      date: q.date || '2025-11-18',
      quote_mm: q.quote_mm || '',
      quote_en: q.quote_en || '',
      quote_zh: q.quote_zh || '',
      quote_th: q.quote_th || '',
      quote_ja: q.quote_ja || '',
      topic_mm: q.topic_mm || '',
      topic_en: q.topic_en || '',
      source_mm: q.source_mm || q.source || 'ထက်',
      source_en: q.source_en || q.source || 'Htet',
      tags: ['Quote', 'Philosophy', 'EthicsOfCare'],
      source_url: q.source_url || 'https://htetofficialmm.blogspot.com'
    }));

    // Normalize Posts (split into Poetry: 3, Activism: 8, Notes: 24)
    const poetryList = [];
    const notesList = [];
    const activismList = [];

    rawPosts.forEach((p, idx) => {
      const cat = (p.category_mm || p.category || '').toLowerCase();
      const pType = (p.type || '').toLowerCase();
      const id = p.id || `post-${idx + 1}`;
      const title = (p.title_mm || '').toLowerCase();

      const isPoem = id === 'post-queer-poetry-to-mama' ||
                     id === 'post-revolutionary-poem-feb13' ||
                     id === 'post-philosophical-poem-thought-wave' ||
                     id === 'post-we-too-can-love-like-a-real-flower' ||
                     id === 'post-warm-embrace-longing-poem' ||
                     pType === 'poetry' ||
                     cat.includes('ကဗျာ') || title.includes('ကဗျာ');

      const isActivism = cat.includes('လှုပ်ရှားမှု') || 
                         cat.includes('ထုတ်ပြန်ချက်') || 
                         cat.includes('သဘာဝဘေး') || 
                         cat.includes('အင်တာဗျူး') || 
                         pType === 'activism' || 
                         pType === 'statement' || 
                         id === 'post-pinned-statement-sexual-harassment' ||
                         id === 'post-honest-information-interview-cdm-htet' ||
                         id === 'post-honest-information-sham-election-analysis' ||
                         id === 'post-myanmar-earthquake-special-article-2025' ||
                         id === 'post-commufemocratism-manifesto-2025' ||
                         id === 'post-youth-anti-militarism' ||
                         id === 'post-political-science-power-sharing';

      const urlMatch = (p.content_mm || '').match(/https?:\/\/[^\s"'<>]+/);
      const detectedUrl = p.source_url || (urlMatch ? urlMatch[0] : (p.article_link || ''));

      const item = {
        id: id,
        slug: p.slug || '',
        feedType: isPoem ? 'poetry' : (isActivism ? 'activism' : 'note'),
        theme: p.theme || '',
        date: p.date || '2025-08-31',
        title_mm: p.title_mm || '',
        title_en: p.title_en || '',
        content_mm: p.content_mm || '',
        content_en: p.content_en || '',
        category_mm: p.category_mm || (isPoem ? 'အချစ်ကဗျာနှင့် စာလွှာ' : (isActivism ? 'လှုပ်ရှားမှုနှင့် ထုတ်ပြန်ချက်' : 'အတွေးမှတ်စု')),
        category_en: p.category_en || (isPoem ? 'Poetry & Letters' : (isActivism ? 'Activism & Statement' : 'Micro-Note')),
        location_mm: p.location_mm || 'ရန်ကုန်',
        location_en: p.location_en || 'Yangon',
        image: p.image || '',
        tags: p.tags || [],
        article_link: p.article_link || '',
        pdf_download: p.pdf_download || '',
        source_url: detectedUrl
      };

      if (isPoem) {
        poetryList.push(item);
      } else if (isActivism) {
        activismList.push(item);
      } else {
        notesList.push(item);
      }
    });

    const totalCount = articlesList.length + quotesList.length + poetryList.length + notesList.length + activismList.length;

    // Populate static stats and tab badges
    if (statTotalEl) statTotalEl.textContent = totalCount;
    if (statArticlesEl) statArticlesEl.textContent = articlesList.length;
    if (statQuotesEl) statQuotesEl.textContent = quotesList.length;
    if (statNotesEl) statNotesEl.textContent = notesList.length;
    if (statActivismEl) statActivismEl.textContent = activismList.length;

    if (tabCountAllEl) tabCountAllEl.textContent = totalCount;
    if (tabCountArticlesEl) tabCountArticlesEl.textContent = articlesList.length;
    if (tabCountQuotesEl) tabCountQuotesEl.textContent = quotesList.length;
    if (tabCountPoetryEl) tabCountPoetryEl.textContent = poetryList.length;
    if (tabCountNotesEl) tabCountNotesEl.textContent = notesList.length;
    if (tabCountActivismEl) tabCountActivismEl.textContent = activismList.length;
    updateFavoritesBadge();

    // Map of all 81 dispatches for instant O(1) Pop-Up Reading Modal lookup
    const allFeedItemsMap = new Map();
    [...articlesList, ...quotesList, ...poetryList, ...notesList, ...activismList].forEach(item => {
      allFeedItemsMap.set(item.id, item);
    });

    // =========================================================================
    // HTET POP-UP DISPLAY READING CONTROLLER (လှပသော Pop-Up ဖတ်ရှုခြင်းစနစ်)
    // =========================================================================
    const readerModal = document.getElementById("journal-reader-modal");
    const modalContainer = document.getElementById("journal-modal-container");
    const modalHeader = document.getElementById("journal-modal-header");
    const modalBody = document.getElementById("journal-modal-body");
    const modalFooter = document.getElementById("journal-modal-footer");
    const modalCloseBtn = document.getElementById("modal-close-btn");
    const modalFooterCloseBtn = document.getElementById("modal-footer-close-btn");
    const modalBackdrop = document.getElementById("journal-modal-backdrop");
    const modalCategoryBadge = document.getElementById("modal-category-badge");
    const modalDateDisplay = document.getElementById("modal-date-display");
    const modalShareBtn = document.getElementById("modal-share-btn");
    const modalFavBtn = document.getElementById("modal-fav-btn");
    const modalFontDecrease = document.getElementById("modal-font-decrease");
    const modalFontIncrease = document.getElementById("modal-font-increase");
    const modalToggleLangBtn = document.getElementById("modal-toggle-lang-btn");
    const modalLangToggleFlag = document.getElementById("modal-lang-toggle-flag");
    const modalLangToggleLabel = document.getElementById("modal-lang-toggle-label");
    let modalItemLangOverride = null;

    const fontLevels = [
      'text-sm sm:text-base leading-relaxed',
      'text-base sm:text-lg leading-loose',
      'text-lg sm:text-xl leading-loose',
      'text-xl sm:text-2xl leading-loose'
    ];
    let currentModalFontLevel = 1;
    let activeModalItem = null;

    function applyModalFontSize() {
      if (!modalBody) return;
      const textEls = modalBody.querySelectorAll(".modal-text-content");
      textEls.forEach(textEl => {
        fontLevels.forEach(cls => {
          cls.split(' ').forEach(c => textEl.classList.remove(c));
        });
        fontLevels[currentModalFontLevel].split(' ').forEach(c => textEl.classList.add(c));
      });
    }

    if (modalFontIncrease) {
      modalFontIncrease.addEventListener("click", () => {
        if (currentModalFontLevel < fontLevels.length - 1) {
          currentModalFontLevel++;
          applyModalFontSize();
        }
      });
    }
    if (modalFontDecrease) {
      modalFontDecrease.addEventListener("click", () => {
        if (currentModalFontLevel > 0) {
          currentModalFontLevel--;
          applyModalFontSize();
        }
      });
    }

    // Modal Original Burmese / Translation Toggle Button Listener
    if (modalToggleLangBtn) {
      modalToggleLangBtn.addEventListener("click", () => {
        if (!activeModalItem) return;
        const siteLang = window.I18n ? window.I18n.getLang() : "mm";
        if (siteLang !== "mm") {
          modalItemLangOverride = (modalItemLangOverride === "mm") ? null : "mm";
        } else {
          modalItemLangOverride = (modalItemLangOverride === "en") ? null : "en";
        }
        renderModalContent(activeModalItem);
        if (window.HtetUI && typeof window.HtetUI.showToast === "function") {
          const effectiveLang = modalItemLangOverride || siteLang;
          if (effectiveLang === "mm") {
            window.HtetUI.showToast("မူရင်းမြန်မာဘာသာဖြင့် ဖတ်ရှုနေပါသည် ✓");
          } else {
            window.HtetUI.showToast("ဘာသာပြန်ဆိုချက်သို့ ပြောင်းလဲပြသထားပါသည် ✓");
          }
        }
      });
    }

    function updateModalFavBtnState(itemId) {
      if (!modalFavBtn) return;
      const isFav = userFavorites.has(itemId);
      modalFavBtn.innerHTML = isFav 
        ? '<i class="ri-heart-fill text-rose-600 text-base sm:text-sm"></i>' 
        : '<i class="ri-heart-line text-base sm:text-sm"></i>';
      modalFavBtn.className = isFav
        ? 'p-2 rounded-xl border border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 transition-all hover:scale-110 cursor-pointer flex items-center justify-center'
        : 'p-2 rounded-xl border border-hairline hover:border-rose-300 text-muted hover:text-rose-600 transition-all hover:scale-110 cursor-pointer flex items-center justify-center';
      modalFavBtn.setAttribute('data-item-id', itemId);
      modalFavBtn.title = isFav ? "စာဖတ်မှတ်တမ်းမှ ဖယ်ရှားရန်" : "စာဖတ်မှတ်တမ်းထဲ သိမ်းဆည်းရန်";
    }

    if (modalFavBtn) {
      modalFavBtn.addEventListener("click", () => {
        if (!activeModalItem) return;
        const itemId = activeModalItem.id;
        const isFav = userFavorites.has(itemId);
        if (isFav) {
          userFavorites.delete(itemId);
        } else {
          userFavorites.add(itemId);
          if (typeof confetti === "function") {
            try {
              confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
            } catch (err) {}
          }
        }
        saveUserFavorites(userFavorites);
        updateFavoritesBadge();
        updateModalFavBtnState(itemId);

        // Sync all matching cards in the DOM if visible
        const feedCardFavBtns = document.querySelectorAll(`.journal-fav-btn[data-item-id="${itemId}"]`);
        feedCardFavBtns.forEach(btn => {
          if (userFavorites.has(itemId)) {
            btn.innerHTML = '<i class="ri-heart-fill text-rose-600 text-sm"></i>';
            btn.className = 'journal-fav-btn p-2 rounded-xl border bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950/60 dark:border-rose-800 transition-all hover:scale-110 flex items-center justify-center cursor-pointer';
          } else {
            btn.innerHTML = '<i class="ri-heart-line text-sm"></i>';
            btn.className = 'journal-fav-btn p-2 rounded-xl border border-hairline text-faint hover:text-rose-500 hover:border-rose-300 transition-all hover:scale-110 flex items-center justify-center cursor-pointer';
          }
        });

        if (window.HtetUI && typeof window.HtetUI.showToast === "function") {
          const lang = window.I18n ? window.I18n.getLang() : "mm";
          const msg = userFavorites.has(itemId)
            ? (lang === "mm" ? "စာဖတ်မှတ်တမ်း (Favorites) ထဲသို့ ထည့်သွင်းပြီးပါပြီ" : "Saved to My Favorites")
            : (lang === "mm" ? "စာဖတ်မှတ်တမ်း (Favorites) မှ ဖယ်ရှားပြီးပါပြီ" : "Removed from My Favorites");
          window.HtetUI.showToast(msg);
        }
      });
    }

    function renderModalContent(item) {
      if (!item || !modalContainer || !modalBody) return;
      activeModalItem = item;
      const siteLang = window.I18n ? window.I18n.getLang() : "mm";
      const lang = modalItemLangOverride || siteLang;
      const formattedDate = formatFeedDate(item.date, lang);

      // Update modal language toggle button UI
      if (modalToggleLangBtn) {
        if (siteLang !== 'mm') {
          if (modalItemLangOverride === 'mm') {
            if (modalLangToggleFlag) modalLangToggleFlag.textContent = '🌐';
            if (modalLangToggleLabel) modalLangToggleLabel.textContent = `ပြန်ဆိုချက် (${siteLang.toUpperCase()})`;
            modalToggleLangBtn.title = `Switch back to ${siteLang.toUpperCase()} translation`;
          } else {
            if (modalLangToggleFlag) modalLangToggleFlag.textContent = '🇲🇲';
            if (modalLangToggleLabel) modalLangToggleLabel.textContent = 'မူရင်း (မြန်မာ)';
            modalToggleLangBtn.title = 'View in Original Burmese (မူရင်းမြန်မာဘာသာဖြင့် ဖတ်ရှုရန်)';
          }
        } else {
          const hasEnglish = Boolean(item.content_en || item.quote_en || item.title_en || item.excerpt_en);
          if (modalItemLangOverride === 'en') {
            if (modalLangToggleFlag) modalLangToggleFlag.textContent = '🇲🇲';
            if (modalLangToggleLabel) modalLangToggleLabel.textContent = 'မူရင်း (မြန်မာ)';
            modalToggleLangBtn.title = 'မူရင်းမြန်မာဘာသာသို့ ပြန်သွားရန်';
          } else if (hasEnglish) {
            if (modalLangToggleFlag) modalLangToggleFlag.textContent = '🌐';
            if (modalLangToggleLabel) modalLangToggleLabel.textContent = 'English';
            modalToggleLangBtn.title = 'View English translation';
          } else {
            if (modalLangToggleFlag) modalLangToggleFlag.textContent = '🇲🇲';
            if (modalLangToggleLabel) modalLangToggleLabel.textContent = 'မူရင်း (မြန်မာ)';
            modalToggleLangBtn.title = 'Original Burmese text';
          }
        }
      }

      // Reset base modal structure
      modalContainer.className = "relative z-10 w-full max-w-2xl sm:max-w-3xl max-h-[92vh] flex flex-col rounded-3xl transition-all duration-300 ease-out overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.5)]";
      modalHeader.className = "relative z-20 shrink-0 px-5 sm:px-7 py-3.5 sm:py-4 border-b flex items-center justify-between gap-3 transition-colors backdrop-blur-md";
      modalFooter.className = "relative z-20 shrink-0 px-5 sm:px-7 py-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs font-sans-ui transition-colors backdrop-blur-md";

      const isAnimeForest = item.id === 'post-warm-embrace-longing-poem' || item.theme === 'forest-moon-anime';
      const isLovePoem = item.feedType === 'poetry' && !isAnimeForest;
      const isQuote = item.feedType === 'quote';
      const isArticle = item.feedType === 'article';
      const isActivism = item.feedType === 'activism';

      // Theme Styles Application
      if (isAnimeForest) {
        modalContainer.classList.add("bg-gradient-to-b", "from-[#021b14]", "via-[#052b20]", "to-[#01140e]", "text-emerald-50", "border-2", "border-emerald-400/60", "shadow-[0_0_60px_rgba(16,185,129,0.35)]");
        modalHeader.classList.add("bg-[#021b14]/90", "border-emerald-800/60", "text-emerald-100");
        modalFooter.classList.add("bg-[#01140e]/95", "border-emerald-800/60", "text-emerald-300/80");

        modalCategoryBadge.className = "inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 font-bold border border-emerald-400/60 text-xs shadow-[0_0_12px_rgba(16,185,129,0.35)]";
        modalCategoryBadge.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <i class="ri-moon-foggy-line text-emerald-300"></i>
          <span>${lang === 'mm' ? 'လမင်း၊ ကြယ်စင်နှင့် သစ်တောည • ANIME FOREST VIBE' : 'MOONLIT FOREST POEM'}</span>
        `;
      } else if (isLovePoem) {
        modalContainer.classList.add("bg-gradient-to-br", "from-rose-50/95", "via-card", "to-pink-50/90", "dark:from-[#200d14]", "dark:via-card", "dark:to-[#260f18]", "text-charcoal", "border-2", "border-rose-300", "dark:border-rose-800", "shadow-[0_0_50px_rgba(244,63,94,0.3)]");
        modalHeader.classList.add("bg-card/90", "border-rose-200/60", "dark:border-rose-900/60");
        modalFooter.classList.add("bg-card/90", "border-rose-200/60", "dark:border-rose-900/60", "text-muted");

        modalCategoryBadge.className = "inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/15 to-pink-500/15 text-rose-700 dark:text-rose-300 font-bold border border-rose-300/70 dark:border-rose-800/70 text-xs";
        modalCategoryBadge.innerHTML = `
          <i class="ri-heart-pulse-fill text-rose-500"></i>
          <span>${lang === 'mm' ? 'အချစ်ကဗျာနှင့် စာလွှာ' : 'LOVE POETRY & LETTERS'}</span>
        `;
      } else if (isQuote) {
        modalContainer.classList.add("bg-gradient-to-br", "from-amber-50/95", "via-card", "to-amber-100/50", "dark:from-[#1f1707]", "dark:via-card", "dark:to-[#171105]", "text-charcoal", "border-2", "border-amber-400/50", "shadow-[0_0_50px_rgba(245,158,11,0.25)]");
        modalHeader.classList.add("bg-card/90", "border-amber-200/60", "dark:border-amber-900/60");
        modalFooter.classList.add("bg-card/90", "border-amber-200/60", "dark:border-amber-900/60", "text-muted");

        modalCategoryBadge.className = "inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-200 font-bold border border-amber-300/70 dark:border-amber-800/70 text-xs";
        modalCategoryBadge.innerHTML = `
          <i class="ri-chat-quote-fill text-amber-500"></i>
          <span>${lang === 'mm' ? 'ဒဿနအတွေးစကား' : 'PHILOSOPHICAL QUOTE'}</span>
        `;
      } else if (isArticle) {
        modalContainer.classList.add("bg-card", "text-charcoal", "border", "border-hairline/80");
        modalHeader.classList.add("bg-card/95", "border-hairline/60");
        modalFooter.classList.add("bg-card/95", "border-hairline/60", "text-muted");

        modalCategoryBadge.className = "inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900/60 text-xs";
        modalCategoryBadge.innerHTML = `
          <i class="ri-article-line text-blue-500"></i>
          <span>${lang === 'mm' ? (item.category_mm || 'ဆောင်းပါးနှင့် စာတမ်း') : (item.category_en || 'Research Article')}</span>
        `;
      } else if (isActivism) {
        modalContainer.classList.add("bg-card", "text-charcoal", "border", "border-hairline/80");
        modalHeader.classList.add("bg-card/95", "border-hairline/60");
        modalFooter.classList.add("bg-card/95", "border-hairline/60", "text-muted");

        modalCategoryBadge.className = "inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold border border-rose-300/70 dark:border-rose-900/60 text-xs";
        modalCategoryBadge.innerHTML = `
          <i class="ri-megaphone-fill text-rose-500"></i>
          <span>${lang === 'mm' ? (item.category_mm || 'လှုပ်ရှားမှုနှင့် ထုတ်ပြန်ချက်') : (item.category_en || 'Activism & Statement')}</span>
        `;
      } else {
        modalContainer.classList.add("bg-card", "text-charcoal", "border", "border-hairline/80");
        modalHeader.classList.add("bg-card/95", "border-hairline/60");
        modalFooter.classList.add("bg-card/95", "border-hairline/60", "text-muted");

        modalCategoryBadge.className = "inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-900/60 text-xs";
        modalCategoryBadge.innerHTML = `
          <i class="ri-quill-pen-line text-purple-500"></i>
          <span>${lang === 'mm' ? (item.category_mm || 'အတွေးမှတ်စု') : (item.category_en || 'Micro-Note')}</span>
        `;
      }

      if (modalDateDisplay) {
        modalDateDisplay.textContent = formattedDate;
      }

      if (modalShareBtn) {
        const shareTitle = (lang === 'en' && item.title_en) ? item.title_en : (item.title_mm || item.quote_mm || "Htet Journal");
        const shareText = encodeURIComponent(shareTitle + " — Htet (@Htet_Myat_Ekri)");
        modalShareBtn.href = "https://t.me/share/url?url=" + encodeURIComponent("https://htetofficialmm.blogspot.com") + "&text=" + shareText;
      }

      updateModalFavBtnState(item.id);

      const fontClass = fontLevels[currentModalFontLevel] || fontLevels[1];

      if (isAnimeForest) {
        const poemContent = (lang === 'en' && item.content_en) ? item.content_en : item.content_mm;
        modalBody.innerHTML = `
          <div class="relative space-y-6 animate-modal-content">
            <div class="absolute -top-10 -right-6 w-80 h-80 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none select-none"></div>

            <!-- Glowing Moon & Solitary Flying Bird in Top Bar -->
            <div class="flex items-center justify-between pb-2 border-b border-emerald-800/40 relative z-10">
              <div class="flex items-center space-x-2 text-emerald-300 font-serif italic text-sm">
                <i class="ri-flutter-fill text-lg animate-bird-float text-emerald-300"></i>
                <span>အချစ်ငှက်ငယ်... ညကောင်းကင်သို့</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-100 via-emerald-100 to-teal-100 border border-emerald-300/80 shadow-[0_0_20px_rgba(167,243,208,0.85)] flex items-center justify-center text-emerald-950 animate-moon-pulse">
                  <i class="ri-moon-clear-fill text-xl text-emerald-800"></i>
                </div>
                <span class="text-xs font-mono tracking-widest text-emerald-300/80 uppercase">SILVER MOON</span>
              </div>
            </div>

            <!-- Star particles -->
            <div class="pointer-events-none select-none overflow-hidden absolute inset-0 -z-0">
              <span class="absolute top-12 left-10 text-emerald-200/50 text-xs animate-star-twinkle">✦</span>
              <span class="absolute top-28 right-16 text-teal-200/60 text-sm animate-star-twinkle" style="animation-delay: 1s;">✧</span>
              <span class="absolute bottom-20 left-12 text-amber-200/60 text-xs animate-star-twinkle" style="animation-delay: 1.8s;">✨</span>
              <span class="absolute top-44 left-1/3 text-emerald-300/40 text-[10px] animate-leaf-drift">🍃</span>
            </div>

            <!-- Title & Subtitle -->
            <div class="space-y-2 relative z-10">
              <h2 id="modal-post-title" class="font-serif-editorial text-2xl sm:text-3xl font-bold text-emerald-50 leading-snug drop-shadow-[0_2px_15px_rgba(16,185,129,0.5)]">
                ${(lang === 'en' && item.title_en) ? item.title_en : item.title_mm}
              </h2>
              <p class="text-xs sm:text-sm text-emerald-300/85 italic font-serif flex items-center space-x-1.5">
                <i class="ri-drop-line text-teal-300"></i>
                <span>မျက်ရည်တွေ ဝဲလို့မည်းနေတဲ့ ည... အချစ်ငှက်ငယ်ကို မျှော်လင့်ခြင်း</span>
              </p>
            </div>

            <!-- Stanzas in Enchanted Glass Panel -->
            <div class="relative z-10 pl-5 sm:pl-7 border-l-4 border-emerald-400/90 bg-[#021f17]/90 rounded-r-3xl py-6 pr-6 shadow-inner backdrop-blur-md">
              <div class="modal-text-content font-serif ${fontClass} text-emerald-100/95 italic whitespace-pre-line">
                ${poemContent}
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap items-center gap-1.5 pt-2 relative z-10">
              ${(item.tags || []).map(t => `<span class="text-[11px] px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-2xs font-mono">#${t}</span>`).join('')}
            </div>

            <!-- Pine silhouette base -->
            <div class="h-10 opacity-30 pointer-events-none select-none">
              <svg class="w-full h-full text-emerald-950" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
                <path d="M0,120 L0,70 L25,30 L50,70 L75,20 L100,75 L130,15 L160,80 L200,35 L240,75 L280,10 L320,80 L360,25 L400,70 L440,30 L480,85 L520,15 L560,75 L600,20 L640,80 L680,35 L720,70 L760,10 L800,80 L840,30 L880,75 L920,20 L960,85 L1000,15 L1040,75 L1080,30 L1120,70 L1160,20 L1200,60 L1200,120 Z"></path>
              </svg>
            </div>
          </div>
        `;
      } else if (isLovePoem) {
        const poemContent = (lang === 'en' && item.content_en) ? item.content_en : item.content_mm;
        modalBody.innerHTML = `
          <div class="relative space-y-5 animate-modal-content">
            <div class="absolute -right-4 -bottom-4 text-9xl text-rose-500/10 select-none pointer-events-none font-serif">❦</div>

            <div class="space-y-2">
              <h2 id="modal-post-title" class="font-serif-editorial text-2xl sm:text-3xl font-bold text-rose-950 dark:text-rose-200 leading-snug flex items-center space-x-2">
                <span>${(lang === 'en' && item.title_en) ? item.title_en : item.title_mm}</span>
                <span class="text-rose-400 text-lg">❦</span>
              </h2>
              <div class="text-xs text-rose-600 dark:text-rose-400 font-serif italic">
                <span>❦ ထက် (Htet) ရေးဖွဲ့သည့် ရင်ဖွင့်အချစ်ကဗျာ</span>
              </div>
            </div>

            <div class="pl-5 sm:pl-7 border-l-4 border-rose-400/80 dark:border-rose-600/80 bg-rose-50/70 dark:bg-rose-950/40 rounded-r-3xl py-6 pr-6 shadow-inner">
              <div class="modal-text-content font-serif ${fontClass} text-charcoal/95 italic whitespace-pre-line">
                ${poemContent}
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-1.5 pt-2">
              ${(item.tags || []).map(t => `<span class="text-[11px] px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-sans-ui">#${t}</span>`).join('')}
            </div>
          </div>
        `;
      } else if (isQuote) {
        let quoteContent = item.quote_mm;
        let sourceContent = item.source_mm || item.source;
        if (lang === 'en' && item.quote_en) {
          quoteContent = item.quote_en;
          sourceContent = item.source_en || item.source;
        }
        modalBody.innerHTML = `
          <div class="relative space-y-6 animate-modal-content py-4">
            <div class="text-6xl text-amber-500/30 select-none pointer-events-none font-serif leading-none">“</div>
            <div class="pl-4 sm:pl-6 border-l-4 border-amber-400/80">
              <blockquote class="modal-text-content font-serif ${fontClass} font-bold text-charcoal italic whitespace-pre-line leading-relaxed sm:leading-loose">
                ${quoteContent}
              </blockquote>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-amber-200/60 dark:border-amber-900/60 text-xs">
              <div class="flex items-center space-x-2 text-amber-800 dark:text-amber-300 font-serif italic text-sm">
                <i class="ri-quill-pen-line text-base text-amber-600"></i>
                <span>${sourceContent || 'Htet (ထက်)'}</span>
              </div>
              ${item.topic_mm ? `
              <span class="px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-200 border border-amber-300/60 font-sans-ui text-xs font-semibold">
                ${lang === 'en' && item.topic_en ? item.topic_en : item.topic_mm}
              </span>` : ''}
            </div>

            ${(item.quote_en && lang === 'mm') ? `
            <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/40 text-xs font-serif italic text-charcoal/80">
              <span class="font-bold text-[10px] uppercase font-sans-ui text-amber-700 dark:text-amber-400 block mb-1">English Translation:</span>
              ${item.quote_en}
            </div>` : ''}
          </div>
        `;
      } else if (isArticle) {
        const excerptText = (lang === 'en' && item.excerpt_en) ? item.excerpt_en : item.excerpt_mm;
        modalBody.innerHTML = `
          <div class="space-y-5 animate-modal-content">
            ${item.image ? `
            <div class="overflow-hidden rounded-2xl border border-hairline/60 bg-cream/30 max-h-64 sm:max-h-72">
              <img src="${item.image}" alt="${escapeHtml(item.title_mm)}" class="w-full h-full object-cover">
            </div>` : ''}

            <div class="space-y-2">
              <h2 id="modal-post-title" class="font-serif-editorial text-2xl sm:text-3xl font-bold text-charcoal leading-snug">
                ${(lang === 'en' && item.title_en) ? item.title_en : item.title_mm}
              </h2>
              <div class="flex flex-wrap items-center gap-3 text-xs text-muted font-sans-ui">
                <span class="flex items-center space-x-1">
                  <i class="ri-time-line text-blue-500"></i>
                  <span>${item.reading_time || 5} min read</span>
                </span>
                <span>•</span>
                <span class="flex items-center space-x-1">
                  <i class="ri-user-line text-vermilion"></i>
                  <span>ထက် (Htet)</span>
                </span>
              </div>
            </div>

            <div class="p-5 sm:p-6 rounded-2xl bg-cream/40 dark:bg-zinc-800/40 border border-hairline/70">
              <div class="modal-text-content font-sans-ui ${fontClass} text-charcoal/90 leading-relaxed whitespace-pre-line">
                ${excerptText}
              </div>
            </div>

            <!-- Primary Action Links -->
            <div class="flex flex-wrap items-center gap-3 pt-2">
              <a href="article.html?id=${item.slug || item.id}" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-2xs transition-all hover:scale-105">
                <i class="ri-book-open-line"></i>
                <span>${lang === 'mm' ? 'ဆောင်းပါး အပြည့်အစုံ ဖတ်ရှုရန်' : 'Read Full Article Page'}</span>
              </a>
              ${item.pdf ? `
              <a href="${item.pdf}" download class="px-3.5 py-2 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs flex items-center space-x-1.5 border border-hairline transition-colors">
                <i class="ri-file-pdf-2-line text-rose-600"></i>
                <span>PDF Download</span>
              </a>` : ''}
              ${item.markdown ? `
              <a href="${item.markdown}" download class="px-3.5 py-2 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs flex items-center space-x-1.5 border border-hairline transition-colors">
                <i class="ri-markdown-line text-blue-600"></i>
                <span>Markdown</span>
              </a>` : ''}
            </div>

            <div class="flex flex-wrap items-center gap-1.5 pt-2">
              ${(item.tags || []).map(t => `<span class="text-[11px] px-3 py-1 rounded-lg bg-cream text-muted border border-hairline font-sans-ui">#${t}</span>`).join('')}
            </div>
          </div>
        `;
      } else {
        // Micro-Note or Activism
        const contentText = (lang === 'en' && item.content_en) ? item.content_en : item.content_mm;
        modalBody.innerHTML = `
          <div class="space-y-5 animate-modal-content">
            <div class="space-y-2">
              <h2 id="modal-post-title" class="font-serif-editorial text-2xl sm:text-3xl font-bold text-charcoal leading-snug">
                ${(lang === 'en' && item.title_en) ? item.title_en : item.title_mm}
              </h2>
              <div class="flex items-center space-x-2 text-xs text-muted font-sans-ui">
                <i class="ri-map-pin-line text-vermilion"></i>
                <span>${(lang === 'en' && item.location_en) ? item.location_en : (item.location_mm || 'ရန်ကုန်')}</span>
                <span>•</span>
                <span>ထက် (Htet)</span>
              </div>
            </div>

            <div class="p-5 sm:p-6 rounded-2xl bg-cream/40 dark:bg-zinc-800/40 border border-hairline/70">
              <div class="modal-text-content font-sans-ui ${fontClass} text-charcoal/90 leading-relaxed sm:leading-loose whitespace-pre-line">
                ${contentText}
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-1.5 pt-2">
              ${(item.tags || []).map(t => `<span class="text-[11px] px-3 py-1 rounded-lg bg-cream text-muted border border-hairline font-sans-ui">#${t}</span>`).join('')}
            </div>
          </div>
        `;
      }

      // Dynamic Footer Actions: Direct Link & Original Source
      if (modalFooter) {
        modalFooter.innerHTML = `
          <div class="flex items-center space-x-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span id="modal-footer-reading-mode" class="font-medium text-charcoal/80">${lang === 'mm' ? 'အာရုံစိုက် ဖတ်ရှုခြင်းစနစ်' : 'Pop-Up Reading Mode'} • Htet (ထက်)</span>
          </div>
          <div class="flex items-center space-x-2">
            <button type="button" class="modal-copy-link-btn px-2.5 py-1.5 rounded-xl border border-hairline bg-cream hover:bg-taupe-light dark:bg-zinc-800 dark:hover:bg-zinc-700 text-charcoal flex items-center space-x-1 cursor-pointer transition-colors" data-item-id="${item.id}" title="${lang === 'mm' ? 'ဤစာမူ၏ သီးသန့်လင့်ခ် ကူးယူရန်' : 'Copy Direct Link'}">
              <i class="ri-link text-xs text-vermilion"></i>
              <span>${lang === 'mm' ? 'သီးသန့်လင့်ခ်' : 'Direct Link'}</span>
            </button>
            ${item.source_url ? `
            <a href="${item.source_url}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1.5 rounded-xl bg-vermilion text-white hover:bg-vermilion-dark flex items-center space-x-1 font-semibold transition-colors shadow-2xs" title="${lang === 'mm' ? 'မူရင်း Blogpost / အရင်းအမြစ်သို့ သွားရန်' : 'Original Blogpost'}">
              <i class="ri-external-link-line text-xs"></i>
              <span>${lang === 'mm' ? 'မူရင်း Blogpost' : 'Original Source'}</span>
            </a>` : ''}
            <button id="modal-footer-close-btn" type="button" class="px-3 py-1.5 rounded-xl bg-cream dark:bg-zinc-800 hover:bg-taupe-light dark:hover:bg-zinc-700 text-charcoal font-medium transition-colors cursor-pointer border border-hairline/60">
              ${lang === 'mm' ? 'ပိတ်ရန်' : 'Close'}
            </button>
          </div>
        `;
        const newCloseBtn = modalFooter.querySelector("#modal-footer-close-btn");
        if (newCloseBtn) newCloseBtn.addEventListener("click", closeReaderModal);
        const copyLinkBtn = modalFooter.querySelector(".modal-copy-link-btn");
        if (copyLinkBtn) {
          copyLinkBtn.addEventListener("click", () => {
            const url = `${window.location.origin}${window.location.pathname.replace(/[^/]+$/, '')}journal.html?item=${item.id}`;
            navigator.clipboard.writeText(url).then(() => {
              if (window.HtetUI && typeof window.HtetUI.showToast === 'function') {
                window.HtetUI.showToast(lang === 'mm' ? 'ဤစာမူ၏ သီးသန့်လင့်ခ်ကို ကူးယူပြီးပါပြီ' : 'Direct link copied!');
              }
            });
          });
        }
      }
    }

    function openReaderModal(itemId) {
      const item = allFeedItemsMap.get(itemId);
      if (!item || !readerModal || !modalContainer) return;

      renderModalContent(item);

      readerModal.classList.remove("hidden");
      readerModal.classList.add("animate-modal-backdrop");
      modalContainer.classList.add("animate-modal-spring");

      requestAnimationFrame(() => {
        readerModal.classList.remove("opacity-0");
        modalContainer.classList.remove("scale-95", "translate-y-4");
        modalContainer.classList.add("scale-100", "translate-y-0");
      });

      document.body.classList.add("overflow-hidden");
    }

    function closeReaderModal() {
      if (!readerModal || !modalContainer) return;
      modalItemLangOverride = null;
      readerModal.classList.add("opacity-0");
      modalContainer.classList.remove("scale-100", "translate-y-0");
      modalContainer.classList.add("scale-95", "translate-y-4");

      setTimeout(() => {
        readerModal.classList.add("hidden");
        readerModal.classList.remove("animate-modal-backdrop");
        modalContainer.classList.remove("animate-modal-spring");
        document.body.classList.remove("overflow-hidden");
      }, 250);
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", closeReaderModal);
    }
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeReaderModal);
    }
    if (modalFooterCloseBtn) {
      modalFooterCloseBtn.addEventListener("click", closeReaderModal);
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && readerModal && !readerModal.classList.contains("hidden")) {
        closeReaderModal();
      }
    });

    // State
    let currentTab = "all";
    let searchQuery = "";
    let currentSort = "newest";
    const PAGE_CHUNK = 16;
    let visibleCount = PAGE_CHUNK;

    // Copy Channel Link Button
    const copyChannelBtn = document.getElementById("copy-channel-link-btn");
    if (copyChannelBtn) {
      copyChannelBtn.addEventListener("click", () => {
        navigator.clipboard.writeText("https://t.me/Htet_Myat_Ekri").then(() => {
          if (window.HtetUI && typeof window.HtetUI.showToast === 'function') {
            window.HtetUI.showToast("ချန်နယ်လင့်ခ် ကူးယူပြီးပါပြီ (@Htet_Myat_Ekri)");
          }
        });
      });
    }

    // Scroll Sentinel for Lightning-Fast Infinite Scroll
    let scrollObserver = null;

    // Compact 4 Mini-Cards Renderer for Index (ပိစိလေး အကွက် ၄ ခု)
    function renderCompactIndexGrid() {
      if (!compactGridContainer) return;
      const lang = window.I18n ? window.I18n.getLang() : "mm";

      // Curated 4 Iconic Dispatches for Index
      const targetIds = [
        'post-warm-embrace-longing-poem',
        'post-who-owns-htet-identity-thoughts',
        'quote-2',
        'quote-1'
      ];

      const fourItems = targetIds.map(id => allFeedItemsMap.get(id)).filter(Boolean);

      let gridHtml = "";

      fourItems.forEach((item, index) => {
        const formattedDate = formatFeedDate(item.date, lang);
        const isFav = userFavorites.has(item.id);
        const heartIcon = isFav ? "ri-heart-fill text-rose-600" : "ri-heart-line text-muted hover:text-rose-600";
        const favBorder = isFav ? "border-rose-300 bg-rose-50 dark:bg-rose-950/60" : "border-hairline bg-cream hover:bg-rose-50";

        let badgeLabel = "";
        let badgeClass = "";
        let title = "";
        let excerpt = "";
        let cardBorder = "";
        let cardBg = "";
        let buttonLabel = lang === "mm" ? "ဖတ်ရှုရန်" : "Read";
        let buttonClass = "bg-cream hover:bg-taupe-light text-charcoal";

        if (item.feedType === "poetry") {
          badgeLabel = lang === "mm" ? "🌙 အချစ်ကဗျာ" : "🌙 Poetry";
          badgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800";
          cardBorder = "border-emerald-500/30 hover:border-emerald-500/60";
          cardBg = "bg-gradient-to-b from-emerald-500/5 via-card to-emerald-500/10";
          title = (lang === "en" && item.title_en) ? item.title_en : item.title_mm;
          const cleanText = ((lang === "en" && item.content_en) ? item.content_en : item.content_mm).replace(/[#*]/g, "");
          excerpt = cleanText.split("\n").filter(Boolean).slice(1, 4).join(" ");
          buttonLabel = lang === "mm" ? "ကဗျာဖတ်ရန်" : "Read Poem";
          buttonClass = "bg-emerald-600 hover:bg-emerald-700 text-white";
        } else if (item.feedType === "quote") {
          badgeLabel = lang === "mm" ? "💬 ဒဿနစကား" : "💬 Quote";
          badgeClass = "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800";
          cardBorder = "border-amber-400/40 hover:border-amber-500/70";
          cardBg = "bg-gradient-to-br from-amber-500/5 via-card to-amber-500/10";
          title = item.topic_mm ? ((lang === "en" && item.topic_en) ? item.topic_en : item.topic_mm) : ((lang === "mm") ? "ဒဿနအတွေးစကား" : "Reflection");
          excerpt = (lang === "en" && item.quote_en) ? item.quote_en : item.quote_mm;
          buttonLabel = lang === "mm" ? "အတွေးစကား ဖတ်ရန်" : "Read Quote";
          buttonClass = "bg-amber-600 hover:bg-amber-700 text-white";
        } else if (item.feedType === "article") {
          badgeLabel = lang === "mm" ? "📄 ဆောင်းပါး" : "📄 Article";
          badgeClass = "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800";
          cardBorder = "border-blue-500/30 hover:border-blue-500/60";
          cardBg = "bg-gradient-to-br from-blue-500/5 via-card to-blue-500/10";
          title = (lang === "en" && item.title_en) ? item.title_en : item.title_mm;
          excerpt = (lang === "en" && item.excerpt_en) ? item.excerpt_en : item.excerpt_mm;
          buttonLabel = lang === "mm" ? "ဆောင်းပါး ဖတ်ရန်" : "Read Article";
          buttonClass = "bg-blue-600 hover:bg-blue-700 text-white";
        } else {
          badgeLabel = lang === "mm" ? "⚡ အတွေးစာမူ" : "⚡ Dispatch";
          badgeClass = "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800";
          cardBorder = "border-purple-500/30 hover:border-purple-500/60";
          cardBg = "bg-gradient-to-br from-purple-500/5 via-card to-purple-500/10";
          title = (lang === "en" && item.title_en) ? item.title_en : item.title_mm;
          const cleanText = ((lang === "en" && item.content_en) ? item.content_en : item.content_mm).replace(/[#*]/g, "");
          excerpt = cleanText.split("\n").filter(Boolean).slice(0, 3).join(" ");
          buttonLabel = lang === "mm" ? "မှတ်စု ဖတ်ရန်" : "Read Dispatch";
          buttonClass = "bg-purple-600 hover:bg-purple-700 text-white";
        }

        gridHtml += `
          <div class="journal-compact-card flex flex-col justify-between p-4 sm:p-5 rounded-2xl sm:rounded-3xl border ${cardBorder} ${cardBg} shadow-xs hover:shadow-md transition-all duration-300 group relative" data-aos="fade-up" data-aos-delay="${index * 70}">
            
            <!-- Top Metadata -->
            <div>
              <div class="flex items-center justify-between mb-3 text-[11px] font-sans-ui">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full font-bold border ${badgeClass}">
                  ${badgeLabel}
                </span>
                <span class="text-muted text-[11px] font-mono">${formattedDate}</span>
              </div>

              <!-- Title -->
              <h3 class="font-serif-editorial text-base sm:text-lg font-bold text-charcoal group-hover:text-vermilion transition-colors leading-snug line-clamp-2 mb-2">
                <button type="button" class="journal-popup-read-btn text-left hover:underline cursor-pointer" data-item-id="${item.id}">
                  ${title}
                </button>
              </h3>

              <!-- Excerpt snippet -->
              <p class="text-xs text-charcoal/80 font-sans-ui leading-relaxed line-clamp-3 mb-4">
                ${excerpt}
              </p>
            </div>

            <!-- Bottom Actions Bar: Dedicated Single-Item View Button -->
            <div class="pt-3 border-t border-hairline/60 flex items-center justify-between gap-2 text-xs font-sans-ui mt-auto">
              <button type="button" class="journal-popup-read-btn flex-grow py-2 px-3 rounded-xl ${buttonClass} font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-2xs transition-all hover:scale-102 cursor-pointer" data-item-id="${item.id}" title="${lang === 'mm' ? 'Pop-Up ဖြင့် ဖတ်ရှုရန်' : 'Open in Pop-Up Reader'}">
                <i class="ri-focus-2-line text-sm"></i>
                <span>${buttonLabel}</span>
              </button>

              <button type="button" class="journal-card-lang-toggle-btn p-2 rounded-xl border border-hairline bg-cream hover:bg-taupe-light dark:bg-zinc-800 text-charcoal text-xs font-semibold flex items-center justify-center shrink-0 cursor-pointer shadow-2xs transition-all hover:scale-105" data-item-id="${item.id}" data-showing-original="${lang === 'mm' ? 'true' : 'false'}" title="${lang === 'mm' ? 'အင်္ဂလိပ်ဘာသာပြန်ချက် ကြည့်ရန်' : 'မူရင်းမြန်မာဘာသာဖြင့် ကြည့်ရန် (View Original Burmese)'}">
                <span class="lang-toggle-flag text-xs">${lang === 'mm' ? '🌐' : '🇲🇲'}</span>
              </button>

              <button type="button" class="journal-fav-btn p-2 rounded-xl border ${favBorder} transition-all hover:scale-110 flex items-center justify-center cursor-pointer shrink-0" data-item-id="${item.id}" title="${isFav ? 'စာဖတ်မှတ်တမ်းမှ ဖယ်ရှားရန်' : 'စာဖတ်မှတ်တမ်းထဲ သိမ်းဆည်းရန်'}">
                <i class="${heartIcon} text-sm"></i>
              </button>
            </div>

          </div>
        `;
      });

      compactGridContainer.innerHTML = gridHtml;
      if (typeof init3DTiltAndFloatingEffects === 'function') {
        init3DTiltAndFloatingEffects();
      }
    }

    // Render Function
    function renderFeed() {
      if (!feedContainer) return;
      const lang = window.I18n ? window.I18n.getLang() : "mm";

      // Helper to generate inline original Burmese <-> translation toggle button
      function renderCardLangToggleBtn(item, curLang, extraCls = '') {
        const isBurmese = curLang === 'mm';
        const hasEnglish = Boolean(item.content_en || item.quote_en || item.title_en || item.excerpt_en);
        if (isBurmese && !hasEnglish) return '';
        
        const flag = isBurmese ? '🌐' : '🇲🇲';
        const label = isBurmese ? 'English' : 'Original (MM)';
        const title = isBurmese 
          ? 'အင်္ဂလိပ်ဘာသာပြန်ဆိုချက် ကြည့်ရန် (View English Translation)' 
          : 'မူရင်းမြန်မာဘာသာဖြင့် ကြည့်ရန် (View Original Burmese)';
        
        return `
          <button type="button" class="journal-card-lang-toggle-btn px-2.5 py-1.5 rounded-xl border border-hairline bg-cream hover:bg-taupe-light dark:bg-zinc-800 text-charcoal font-medium text-xs flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs ${extraCls}" data-item-id="${item.id}" data-showing-original="${isBurmese ? 'true' : 'false'}" title="${title}">
            <span class="lang-toggle-flag text-xs">${flag}</span>
            <span class="lang-toggle-label text-[11px] font-sans-ui">${label}</span>
          </button>
        `;
      }

      // 1. Filter by active category/tab
      let baseList = [];
      if (currentTab === "all") {
        baseList = [...articlesList, ...quotesList, ...poetryList, ...notesList, ...activismList];
      } else if (currentTab === "articles") {
        baseList = [...articlesList];
      } else if (currentTab === "quotes") {
        baseList = [...quotesList];
      } else if (currentTab === "poetry") {
        baseList = [...poetryList];
      } else if (currentTab === "notes") {
        baseList = [...notesList];
      } else if (currentTab === "activism") {
        baseList = [...activismList];
      } else if (currentTab === "favorites") {
        const allItems = [...articlesList, ...quotesList, ...poetryList, ...notesList, ...activismList];
        baseList = allItems.filter(item => userFavorites.has(item.id));
      }

      // 2. Filter by search query
      const query = searchQuery.trim().toLowerCase();
      let filtered = baseList.filter(item => {
        if (!query) return true;
        const searchPool = [
          item.title_mm, item.title_en,
          item.quote_mm, item.quote_en,
          item.content_mm, item.content_en,
          item.excerpt_mm, item.excerpt_en,
          item.topic_mm, item.topic_en,
          item.source_mm, item.source_en,
          (item.tags || []).join(" ")
        ].filter(Boolean).join(" ").toLowerCase();
        return searchPool.includes(query);
      });

      // 3. Sort
      filtered.sort((a, b) => {
        const dateA = a.date || "";
        const dateB = b.date || "";
        if (currentSort === "oldest") {
          return dateA.localeCompare(dateB);
        }
        const cmp = dateB.localeCompare(dateA);
        if (cmp !== 0) return cmp;
        if (a.id === 'post-warm-embrace-longing-poem') return -1;
        if (b.id === 'post-warm-embrace-longing-poem') return 1;
        return 0;
      });

      // Update results counter
      if (resultsCounter) {
        if (lang === "mm") {
          resultsCounter.textContent = `ဖော်ပြနေသော မှတ်တမ်း: ${toBurmeseNumber(filtered.length)} ခု`;
        } else {
          resultsCounter.textContent = `Showing ${filtered.length} Dispatches`;
        }
      }

      // Empty State for Favorites Tab
      if (currentTab === "favorites" && filtered.length === 0) {
        feedContainer.innerHTML = `
          <div class="p-12 text-center rounded-3xl border border-dashed border-rose-300 dark:border-rose-900/60 bg-card my-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center text-3xl shadow-2xs">
              <i class="ri-heart-3-line"></i>
            </div>
            <h4 class="font-serif-editorial text-lg font-bold text-charcoal mb-2" data-mm="သင် ကြိုက်နှစ်သက်ထားသော မှတ်တမ်း မရှိသေးပါ" data-en="No Favorites Saved Yet">
              ${lang === 'mm' ? 'သင် ကြိုက်နှစ်သက်ထားသော မှတ်တမ်း မရှိသေးပါ' : 'No Favorites Saved Yet'}
            </h4>
            <p class="text-xs text-muted max-w-sm mx-auto font-sans-ui leading-relaxed" data-mm="မိမိ နှစ်သက်သဘောကျသည့် ဆောင်းပါး၊ ဒဿနအတွေးစကား သို့မဟုတ် မှတ်စုများရှိ အသည်းပုံ (❤️) ကို နှိပ်၍ ဤနေရာတွင် စုစည်းသိမ်းဆည်း ပြန်လည်ဖတ်ရှုနိုင်ပါသည်။" data-en="Click the heart (❤️) icon on any article, quote, or note to save it here for quick reference.">
              ${lang === 'mm' ? 'မိမိ နှစ်သက်သဘောကျသည့် ဆောင်းပါး၊ ဒဿနအတွေးစကား သို့မဟုတ် မှတ်စုများရှိ အသည်းပုံ (❤️) ကို နှိပ်၍ ဤနေရာတွင် စုစည်းသိမ်းဆည်း ပြန်လည်ဖတ်ရှုနိုင်ပါသည်။' : 'Click the heart (❤️) icon on any article, quote, or note to save it here for quick reference.'}
            </p>
          </div>
        `;
        return;
      }

      // General Empty State
      if (filtered.length === 0) {
        feedContainer.innerHTML = `
          <div class="p-12 text-center rounded-3xl border border-taupe-light bg-card my-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cream flex items-center justify-center text-3xl text-faint">
              <i class="ri-inbox-line"></i>
            </div>
            <h4 class="font-serif-editorial text-lg font-bold text-charcoal mb-1" data-mm="ရှာဖွေမှုရလဒ် မတွေ့ရှိပါ" data-en="No Dispatches Found">
              ${lang === 'mm' ? 'ရှာဖွေမှုရလဒ် မတွေ့ရှိပါ' : 'No Dispatches Found'}
            </h4>
            <p class="text-xs text-muted max-w-sm mx-auto font-sans-ui" data-mm="သင်ရှာဖွေနေသော စကားလုံးနှင့် ကိုက်ညီသည့် ပို့စ် သို့မဟုတ် စာတမ်း မရှိသေးပါ။" data-en="No posts or quotes match your search criteria.">
              ${lang === 'mm' ? 'သင်ရှာဖွေနေသော စကားလုံးနှင့် ကိုက်ညီသည့် ပို့စ် သို့မဟုတ် စာတမ်း မရှိသေးပါ။' : 'No posts or quotes match your search criteria.'}
            </p>
          </div>
        `;
        return;
      }

      // 4. Slice for Pagination
      const visibleItems = filtered.slice(0, visibleCount);
      const hasMore = filtered.length > visibleCount;

      let cardsHtml = "";

      visibleItems.forEach((item) => {
        const formattedDate = formatFeedDate(item.date, lang);
        const isFavorited = userFavorites.has(item.id);
        const heartIconClass = isFavorited ? "ri-heart-fill text-rose-600 text-sm" : "ri-heart-line text-sm";
        const favBtnClass = isFavorited 
          ? "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/50 text-rose-600" 
          : "bg-cream hover:bg-rose-50 text-muted hover:text-rose-600 border-hairline";
        const favTitle = isFavorited 
          ? (lang === 'mm' ? 'ကြိုက်နှစ်သက်ပြီး (Saved in favorites)' : 'Saved in favorites')
          : (lang === 'mm' ? 'ကြိုက်နှစ်သက်သည့် စာရင်းသို့ သိမ်းဆည်းရန်' : 'Save to favorites');

        // Card Type 1: ARTICLE
        if (item.feedType === "article") {
          const hasImage = Boolean(item.image);
          const excerptText = lang === 'en' && item.excerpt_en ? item.excerpt_en : (item.excerpt_mm || '');
          const isLongExcerpt = excerptText.length > 160;

          cardsHtml += `
            <article class="journal-card group rounded-3xl border border-blue-500/20 bg-card p-5 sm:p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden" data-category="articles">
              <!-- Card Header Badge & Date -->
              <div class="flex items-center justify-between mb-3 text-xs font-sans-ui">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-900/50 text-[11px]">
                    <i class="ri-article-line"></i>
                    <span data-mm="ဆောင်းပါးနှင့် စာတမ်း" data-en="RESEARCH ARTICLE">${lang === 'mm' ? 'ဆောင်းပါးနှင့် စာတမ်း' : 'RESEARCH ARTICLE'}</span>
                  </span>
                  <span class="text-faint">•</span>
                  <span class="text-muted text-[11px]">${formattedDate}</span>
                </div>
                <span class="text-[11px] text-muted font-sans-ui flex items-center space-x-1 bg-cream/70 dark:bg-zinc-800/60 px-2.5 py-0.5 rounded-lg border border-hairline">
                  <i class="ri-time-line text-blue-500"></i>
                  <span>${item.reading_time || 5} min read</span>
                </span>
              </div>

              <!-- Main Content Grid -->
              <div class="grid grid-cols-1 ${hasImage ? 'md:grid-cols-12 gap-5' : ''} items-start">
                ${hasImage ? `
                <div class="md:col-span-4 shrink-0 overflow-hidden rounded-2xl border border-hairline/60 bg-cream/30 mb-3 md:mb-0">
                  <a href="article.html?id=${item.slug || item.id}" class="block overflow-hidden">
                    <img src="${item.image}" alt="${escapeHtml(item.title_mm)}" class="w-full h-44 sm:h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
                  </a>
                </div>
                ` : ''}
                <div class="${hasImage ? 'md:col-span-8' : ''} space-y-2.5">
                  <h3 class="font-serif-editorial text-lg sm:text-xl font-bold text-charcoal group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    <a href="article.html?id=${item.slug || item.id}">
                      ${lang === 'en' && item.title_en ? item.title_en : item.title_mm}
                    </a>
                  </h3>

                  <!-- Excerpt with See More -->
                  <div class="expandable-wrap" data-collapsed="${isLongExcerpt ? 'true' : 'false'}">
                    <p class="expandable-text text-xs sm:text-sm text-charcoal/85 leading-relaxed font-sans-ui ${isLongExcerpt ? 'line-clamp-3' : ''}">
                      ${excerptText}
                    </p>
                    ${isLongExcerpt ? `
                    <button class="see-more-toggle-btn text-[11px] text-blue-600 dark:text-blue-400 font-semibold hover:underline mt-1 inline-flex items-center space-x-1 cursor-pointer">
                      <span class="see-more-label">${lang === 'mm' ? 'ပိုမိုဖတ်ရှုရန်... (See more)' : 'See more...'}</span>
                      <i class="ri-arrow-down-s-line text-xs"></i>
                    </button>
                    ` : ''}
                  </div>

                  <div class="flex flex-wrap items-center gap-1.5 pt-1">
                    ${(item.tags || []).slice(0, 4).map(t => `<span class="text-[10px] px-2 py-0.5 rounded-md bg-cream text-muted border border-hairline">#${t}</span>`).join('')}
                  </div>

                  <!-- Actions Bar -->
                  <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-hairline/60 text-xs font-sans-ui">
                    <div class="flex flex-wrap items-center gap-2">
                      <button type="button" class="journal-popup-read-btn px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-2xs transition-all hover:scale-105 cursor-pointer" data-item-id="${item.id}" title="${lang === 'mm' ? 'Pop-Up ဖြင့် ဖတ်ရှုရန်' : 'Read in Pop-Up'}">
                        <i class="ri-focus-2-line text-xs"></i>
                        <span data-mm="အစအဆုံး ဖတ်ရန်" data-en="Read Full">${lang === 'mm' ? 'အစအဆုံး ဖတ်ရန်' : 'Read Full'}</span>
                      </button>
                      ${renderCardLangToggleBtn(item, lang)}
                      <a href="article.html?id=${item.slug || item.id}" class="px-3 py-1.5 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-semibold text-xs flex items-center space-x-1 border border-hairline transition-colors">
                        <i class="ri-external-link-line"></i>
                        <span data-mm="ဆောင်းပါးစာမျက်နှာ" data-en="Full Page">${lang === 'mm' ? 'ဆောင်းပါးစာမျက်နှာ' : 'Full Page'}</span>
                      </a>
                      ${item.source_url ? `
                      <a href="${item.source_url}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1.5 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs flex items-center space-x-1 border border-hairline transition-colors" title="မူရင်း Blogpost သို့">
                        <i class="ri-external-link-line text-amber-600"></i>
                        <span>Blog</span>
                      </a>` : ''}
                      ${item.pdf ? `
                      <a href="${item.pdf}" download class="px-2.5 py-1.5 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs flex items-center space-x-1 border border-hairline transition-colors">
                        <i class="ri-file-pdf-2-line text-rose-600"></i>
                        <span>PDF</span>
                      </a>` : ''}
                      ${item.markdown ? `
                      <a href="${item.markdown}" download class="px-2.5 py-1.5 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs flex items-center space-x-1 border border-hairline transition-colors">
                        <i class="ri-markdown-line text-blue-600"></i>
                        <span>MD</span>
                      </a>` : ''}
                    </div>
                    <div class="flex items-center space-x-2">
                      <button class="journal-share-btn p-1.5 rounded-lg bg-cream hover:bg-taupe-light text-muted hover:text-charcoal transition-colors" data-share-url="article.html?id=${item.slug || item.id}" data-share-title="${escapeHtml(item.title_mm)}" title="Share">
                        <i class="ri-share-line"></i>
                      </button>
                      <button class="journal-fav-btn p-2 rounded-xl border ${favBtnClass} transition-all hover:scale-110 flex items-center justify-center cursor-pointer" data-item-id="${item.id}" title="${favTitle}">
                        <i class="${heartIconClass}"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          `;
        }

        // Card Type 2: QUOTE (Distinct Luxury Amber Aesthetic)
        else if (item.feedType === "quote") {
          let quoteContent = item.quote_mm;
          let topicContent = item.topic_mm;
          let sourceContent = item.source_mm || item.source;
          if (lang === 'en' && item.quote_en) {
            quoteContent = item.quote_en;
            topicContent = item.topic_en;
            sourceContent = item.source_en || item.source;
          } else if (lang === 'zh' && item.quote_zh) {
            quoteContent = item.quote_zh;
          } else if (lang === 'th' && item.quote_th) {
            quoteContent = item.quote_th;
          } else if (lang === 'ja' && item.quote_ja) {
            quoteContent = item.quote_ja;
          }

          const isLongQuote = quoteContent.length > 160;
          const shareTelegramUrl = "https://t.me/share/url?url=" + encodeURIComponent("https://htetofficialmm.blogspot.com") + "&text=" + encodeURIComponent(quoteContent + " — " + (sourceContent || "ထက်") + " (@Htet_Myat_Ekri)");

          cardsHtml += `
            <article class="journal-card group rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-500/5 via-card to-amber-500/10 p-5 sm:p-7 shadow-xs hover:shadow-md transition-all relative overflow-hidden" data-category="quotes">
              <!-- Decorative Quotation Mark Watermark -->
              <div class="absolute -right-2 -bottom-6 text-7xl sm:text-8xl font-serif text-amber-500/10 select-none pointer-events-none font-bold">
                “
              </div>

              <!-- Header: Quote Badge & Date -->
              <div class="flex items-center justify-between mb-4 text-xs font-sans-ui relative z-10">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 font-bold border border-amber-300 dark:border-amber-800 text-[11px] shadow-2xs">
                    <i class="ri-chat-quote-line text-amber-600"></i>
                    <span data-mm="ဒဿန အတွေးစကား" data-en="PHILOSOPHICAL QUOTE">${lang === 'mm' ? 'ဒဿန အတွေးစကား' : 'PHILOSOPHICAL QUOTE'}</span>
                  </span>
                  <span class="text-faint">•</span>
                  <span class="text-muted text-[11px]">${formattedDate}</span>
                </div>
                <span class="hanko-stamp px-2 py-0.2 text-[10px] text-vermilion border-vermilion shadow-2xs">ထက်</span>
              </div>

              <!-- Quote Body with See More -->
              <div class="relative z-10 my-2 space-y-2">
                <div class="text-amber-600 dark:text-amber-400 text-2xl font-serif leading-none select-none">“</div>
                <div class="expandable-wrap" data-collapsed="${isLongQuote ? 'true' : 'false'}">
                  <blockquote class="expandable-quote font-serif-editorial text-base sm:text-lg md:text-xl font-medium text-charcoal leading-relaxed pl-2 sm:pl-3 border-l-3 border-amber-400/70 whitespace-pre-line ${isLongQuote ? 'line-clamp-3' : ''}">
                    ${quoteContent}
                  </blockquote>
                  ${isLongQuote ? `
                  <button class="see-more-toggle-btn text-[11px] text-amber-700 dark:text-amber-300 font-bold hover:underline mt-1.5 inline-flex items-center space-x-1 pl-3 cursor-pointer">
                    <span class="see-more-label">${lang === 'mm' ? 'ပိုမိုဖတ်ရှုရန်... (See more)' : 'See more...'}</span>
                    <i class="ri-arrow-down-s-line text-xs"></i>
                  </button>
                  ` : ''}
                </div>
                <div class="text-right text-amber-600 dark:text-amber-400 text-2xl font-serif leading-none select-none">”</div>
              </div>

              <!-- Topic & Source Attribution -->
              <div class="relative z-10 pt-2 pb-1 space-y-1 text-xs font-sans-ui">
                ${topicContent ? `
                <div class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-lg bg-amber-500/10 text-amber-900 dark:text-amber-200 text-[11px] font-semibold">
                  <i class="ri-bookmark-3-line text-amber-600"></i>
                  <span>${topicContent}</span>
                </div>
                ` : ''}
                <div class="text-[11px] text-muted italic flex items-center space-x-1 pt-0.5">
                  <i class="ri-quill-pen-line text-amber-600"></i>
                  <span>${sourceContent || 'Htet (ထက်)'}</span>
                </div>
              </div>

              <!-- Action Bar -->
              <div class="relative z-10 flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 border-t border-amber-300/40 dark:border-amber-800/40 text-xs font-sans-ui">
                <div class="flex items-center space-x-2">
                  <button type="button" class="journal-popup-read-btn px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-xs flex items-center space-x-1.5 shadow-2xs transition-all hover:scale-105 cursor-pointer" data-item-id="${item.id}" title="${lang === 'mm' ? 'Pop-Up ဖြင့် ဖတ်ရှုရန်' : 'Read in Pop-Up'}">
                    <i class="ri-focus-2-line text-xs"></i>
                    <span data-mm="အတွေးစကား ဖတ်ရန်" data-en="Read Quote">${lang === 'mm' ? 'အတွေးစကား ဖတ်ရန်' : 'Read Quote'}</span>
                  </button>
                  ${renderCardLangToggleBtn(item, lang, 'border-amber-300/60 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200')}
                  <a href="${shareTelegramUrl}" target="_blank" rel="noopener" class="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-medium text-xs flex items-center space-x-1 border border-amber-300/50 transition-all">
                    <i class="ri-telegram-fill text-amber-700 dark:text-amber-300"></i>
                    <span data-mm="မျှဝေရန်" data-en="Share">${lang === 'mm' ? 'မျှဝေရန်' : 'Share'}</span>
                  </a>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="journal-fav-btn p-2 rounded-xl border ${favBtnClass} transition-all hover:scale-110 flex items-center justify-center cursor-pointer" data-item-id="${item.id}" title="${favTitle}">
                    <i class="${heartIconClass}"></i>
                  </button>
                </div>
              </div>
            </article>
          `;
        }

        // Card Type 3: POETRY & ROMANTIC LETTERS
        else if (item.feedType === "poetry") {
          const isAnimeForestPoem = item.id === 'post-warm-embrace-longing-poem' || item.theme === 'forest-moon-anime';
          const isLovePoem = item.id === 'post-queer-poetry-to-mama' || (item.tags || []).includes('LesbianPoem') || isAnimeForestPoem || item.id === 'post-we-too-can-love-like-a-real-flower';
          const poemContent = lang === 'en' && item.content_en ? item.content_en : (item.content_mm || '');
          const isLongPoem = poemContent.length > 200;
          const shareTelegramUrl = "https://t.me/share/url?url=" + encodeURIComponent("https://htetofficialmm.blogspot.com") + "&text=" + encodeURIComponent(item.title_mm + " — Htet (@Htet_Myat_Ekri)");

          if (isAnimeForestPoem) {
            cardsHtml += `
            <article class="journal-card group rounded-3xl border-2 border-emerald-400/50 dark:border-emerald-500/60 bg-gradient-to-b from-[#021b14] via-[#052b20] to-[#01140e] text-emerald-50 shadow-[0_12px_45px_-8px_rgba(5,150,105,0.35)] hover:shadow-[0_16px_50px_-6px_rgba(16,185,129,0.45)] transition-all relative overflow-hidden my-4" data-category="poetry">
              <!-- Glowing Moonlight Halo and Night Sky Radial Gradient -->
              <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/15 blur-3xl pointer-events-none select-none"></div>
              <div class="absolute top-1/2 left-0 w-72 h-72 rounded-full bg-teal-500/10 blur-3xl pointer-events-none select-none"></div>

              <!-- Anime Forest Canopy & Mist Overlay -->
              <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-[#01140e]/90 pointer-events-none select-none"></div>

              <!-- Pine Forest Silhouette along the base -->
              <div class="absolute inset-x-0 bottom-0 h-16 pointer-events-none select-none opacity-30 z-0 overflow-hidden">
                <svg class="w-full h-full text-emerald-950" viewBox="0 0 1200 120" preserveAspectRatio="none" fill="currentColor">
                  <path d="M0,120 L0,70 L25,30 L50,70 L75,20 L100,75 L130,15 L160,80 L200,35 L240,75 L280,10 L320,80 L360,25 L400,70 L440,30 L480,85 L520,15 L560,75 L600,20 L640,80 L680,35 L720,70 L760,10 L800,80 L840,30 L880,75 L920,20 L960,85 L1000,15 L1040,75 L1080,30 L1120,70 L1160,20 L1200,60 L1200,120 Z"></path>
                </svg>
              </div>

              <!-- Twinkling Stardust & Anime Constellations -->
              <div class="absolute inset-0 pointer-events-none select-none overflow-hidden z-10">
                <span class="absolute top-6 left-12 text-emerald-200/50 text-xs animate-pulse">✦</span>
                <span class="absolute top-16 left-1/3 text-teal-200/60 text-sm animate-pulse" style="animation-delay: 1s;">✧</span>
                <span class="absolute top-8 right-32 text-amber-200/70 text-xs">✨</span>
                <span class="absolute top-28 right-16 text-emerald-300/40 text-[10px]">✦</span>
                <span class="absolute bottom-28 left-8 text-emerald-300/40 text-xs">✧</span>
                <span class="absolute bottom-36 right-1/4 text-teal-200/50 text-[11px] animate-pulse" style="animation-delay: 1.5s;">✦</span>
                <span class="absolute top-36 left-20 text-emerald-400/30 text-[10px]">🍃</span>
                <span class="absolute bottom-20 right-10 text-emerald-400/30 text-[10px]">🍃</span>
              </div>

              <!-- Luminous Celestial Moon & Lonely Flying Bird Silhouette -->
              <div class="absolute top-4 right-4 sm:top-5 sm:right-6 flex items-center space-x-3 pointer-events-none select-none z-20">
                <!-- Solitary Bird in Flight -->
                <div class="flex items-center space-x-1 text-emerald-200/75 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transform -translate-y-1">
                  <i class="ri-flutter-fill text-lg sm:text-xl transform -rotate-12 animate-pulse"></i>
                  <span class="text-[9px] font-serif italic text-emerald-300/70 hidden sm:inline">အချစ်ငှက်ငယ်</span>
                </div>

                <!-- Glowing Anime Moon with Radiant Halo -->
                <div class="relative flex items-center justify-center">
                  <div class="absolute w-14 h-14 rounded-full bg-emerald-400/25 blur-lg animate-pulse"></div>
                  <div class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-100 via-emerald-100 to-teal-100 border border-emerald-300/80 shadow-[0_0_20px_rgba(167,243,208,0.85)] flex items-center justify-center text-emerald-950">
                    <i class="ri-moon-clear-fill text-xl text-emerald-800"></i>
                  </div>
                </div>
              </div>

              <!-- Card Body -->
              <div class="relative z-20 p-5 sm:p-7 space-y-4">
                <!-- Header Badge & Meta -->
                <div class="flex flex-wrap items-center justify-between gap-2 text-xs font-sans-ui pr-24 sm:pr-28">
                  <div class="flex items-center space-x-2">
                    <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 font-bold border border-emerald-400/60 text-[11px] shadow-[0_0_12px_rgba(16,185,129,0.35)] backdrop-blur-md">
                      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                      <i class="ri-moon-foggy-line text-emerald-300"></i>
                      <span>လမင်း၊ ကြယ်စင်နှင့် သစ်တောည • ANIME FOREST VIBE</span>
                    </span>
                    <span class="text-emerald-500/70">•</span>
                    <span class="text-emerald-300/80 text-[11px] flex items-center space-x-1">
                      <i class="ri-calendar-line text-xs"></i>
                      <span>${formattedDate}</span>
                    </span>
                  </div>
                  <div class="text-emerald-300/90 font-serif italic text-sm flex items-center space-x-1">
                    <i class="ri-sparkling-fill text-xs text-amber-300"></i>
                    <span>Htet (ထက်)</span>
                  </div>
                </div>

                <!-- Title with Luminous Emerald Glow -->
                <div>
                  <h3 class="font-serif-editorial text-xl sm:text-2xl font-bold text-emerald-50 leading-snug drop-shadow-[0_2px_12px_rgba(16,185,129,0.5)] flex items-center space-x-2">
                    <span>${lang === 'en' && item.title_en ? item.title_en : item.title_mm}</span>
                    <span class="text-emerald-300 text-base">🌕</span>
                  </h3>
                  <p class="text-xs sm:text-sm text-emerald-300/85 italic font-serif mt-1 flex items-center space-x-1.5">
                    <i class="ri-drop-line text-teal-300"></i>
                    <span>မျက်ရည်တွေ ဝဲလို့မည်းနေတဲ့ ည... အချစ်ငှက်ငယ်ကို မျှော်လင့်ခြင်း</span>
                  </p>
                </div>

                <!-- Poetry Stanzas (Enchanted Glass Panel) -->
                <div class="expandable-wrap relative z-20 my-2" data-collapsed="${isLongPoem ? 'true' : 'false'}">
                  <div class="expandable-content pl-5 sm:pl-7 border-l-3 border-emerald-400/90 bg-[#021f17]/85 rounded-r-2xl py-4 pr-5 font-serif text-sm sm:text-base leading-relaxed sm:leading-loose text-emerald-100/95 italic whitespace-pre-line backdrop-blur-md shadow-inner ${isLongPoem ? 'line-clamp-4' : ''}">
                    ${poemContent}
                  </div>
                  ${isLongPoem ? `
                  <button class="see-more-toggle-btn text-xs text-emerald-300 hover:text-emerald-100 font-bold hover:underline mt-2 inline-flex items-center space-x-1.5 pl-5 cursor-pointer">
                    <span class="see-more-label">${lang === 'mm' ? 'ပိုမိုဖတ်ရှုရန်... (See more)' : 'See more...'}</span>
                    <i class="ri-arrow-down-s-line text-xs"></i>
                  </button>
                  ` : ''}
                </div>

                <!-- Tags in Emerald/Teal Glow -->
                <div class="flex flex-wrap items-center gap-1.5 pt-1">
                  ${(item.tags || []).map(t => `<span class="text-[10px] px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 shadow-2xs font-mono">#${t}</span>`).join('')}
                </div>

                <!-- Actions Bar -->
                <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-emerald-800/60 text-xs font-sans-ui">
                  <div class="flex items-center space-x-2">
                    <button type="button" class="journal-popup-read-btn px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-[0_4px_15px_rgba(16,185,129,0.4)] transition-all hover:scale-105 cursor-pointer" data-item-id="${item.id}" title="${lang === 'mm' ? 'Pop-Up ဖြင့် ကဗျာဖတ်ရှုရန်' : 'Read Poem in Pop-Up'}">
                      <i class="ri-focus-2-line text-xs"></i>
                      <span data-mm="ကဗျာဖတ်ရန်" data-en="Read Poem">${lang === 'mm' ? 'ကဗျာဖတ်ရန်' : 'Read Poem'}</span>
                    </button>
                    ${renderCardLangToggleBtn(item, lang, 'border-emerald-700/60 bg-emerald-950/80 text-emerald-200')}
                    <a href="${shareTelegramUrl}" target="_blank" rel="noopener" class="px-3 py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-900/80 text-emerald-200 font-medium text-xs flex items-center space-x-1 border border-emerald-700/60 transition-all hover:scale-105">
                      <i class="ri-telegram-fill text-white text-xs"></i>
                      <span data-mm="တယ်လီဂရမ်" data-en="Telegram">${lang === 'mm' ? 'တယ်လီဂရမ်' : 'Telegram'}</span>
                    </a>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button class="journal-fav-btn p-2 rounded-xl border ${favBtnClass} transition-all hover:scale-110 flex items-center justify-center cursor-pointer bg-emerald-950/70" data-item-id="${item.id}" title="${favTitle}">
                      <i class="${heartIconClass}"></i>
                    </button>
                  </div>
                </div>
              </div>
            </article>
            `;
          } else {
            cardsHtml += `
            <article class="journal-card group rounded-3xl border-2 border-rose-300/50 dark:border-rose-800/50 bg-gradient-to-br from-rose-50/70 via-card to-pink-50/60 dark:from-rose-950/20 dark:via-card dark:to-pink-950/20 shadow-xs hover:shadow-md transition-all relative overflow-hidden" data-category="poetry">
              <!-- Romantic Decorative Floral Watermark -->
              <div class="absolute -right-4 -bottom-6 text-7xl sm:text-8xl text-rose-500/10 select-none pointer-events-none font-serif">
                ❦
              </div>

              <!-- Header Badge & Date -->
              <div class="flex items-center justify-between mb-3 text-xs font-sans-ui relative z-10">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-rose-500/15 to-pink-500/15 text-rose-700 dark:text-rose-300 font-bold border border-rose-300/70 dark:border-rose-800/70 text-[11px] shadow-2xs">
                    <i class="ri-heart-pulse-fill text-rose-500"></i>
                    <span data-mm="${isLovePoem ? 'အချစ်ကဗျာနှင့် စာလွှာ' : 'ကဗျာနှင့် စာပေ'}" data-en="${isLovePoem ? 'LOVE POETRY & LETTERS' : 'POETRY & LITERATURE'}">
                      ${lang === 'mm' ? (isLovePoem ? 'အချစ်ကဗျာနှင့် စာလွှာ' : 'ကဗျာနှင့် စာပေ') : (isLovePoem ? 'LOVE POETRY & LETTERS' : 'POETRY & LITERATURE')}
                    </span>
                  </span>
                  <span class="text-faint">•</span>
                  <span class="text-muted text-[11px]">${formattedDate}</span>
                </div>
                <span class="text-rose-500 font-serif italic text-sm">❦ Htet</span>
              </div>

              <!-- Title with Flourish -->
              <h3 class="font-serif-editorial text-lg sm:text-xl font-bold text-rose-950 dark:text-rose-200 leading-snug flex items-center space-x-2 relative z-10">
                <span>${lang === 'en' && item.title_en ? item.title_en : item.title_mm}</span>
                <span class="text-rose-400 text-sm">❦</span>
              </h3>

              <!-- Poetry Stanza Layout with See More -->
              <div class="expandable-wrap relative z-10 my-3" data-collapsed="${isLongPoem ? 'true' : 'false'}">
                <div class="expandable-content pl-4 sm:pl-6 border-l-3 border-rose-400/80 dark:border-rose-600/80 bg-rose-50/60 dark:bg-rose-950/30 rounded-r-2xl py-3.5 pr-4 font-serif text-sm sm:text-base leading-relaxed sm:leading-loose text-charcoal/95 italic whitespace-pre-line ${isLongPoem ? 'line-clamp-4' : ''}">
                  ${poemContent}
                </div>
                ${isLongPoem ? `
                <button class="see-more-toggle-btn text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline mt-1.5 inline-flex items-center space-x-1 pl-4 cursor-pointer">
                  <span class="see-more-label">${lang === 'mm' ? 'ပိုမိုဖတ်ရှုရန်... (See more)' : 'See more...'}</span>
                  <i class="ri-arrow-down-s-line text-xs"></i>
                </button>
                ` : ''}
              </div>

              <!-- Tags in Soft Rose -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1 relative z-10">
                ${(item.tags || []).map(t => `<span class="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50">#${t}</span>`).join('')}
              </div>

              <!-- Actions Bar -->
              <div class="flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 border-t border-rose-200/50 dark:border-rose-900/40 text-xs font-sans-ui relative z-10">
                <div class="flex items-center space-x-2">
                  <button type="button" class="journal-popup-read-btn px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-2xs transition-all hover:scale-105 cursor-pointer" data-item-id="${item.id}" title="${lang === 'mm' ? 'Pop-Up ဖြင့် ကဗျာဖတ်ရှုရန်' : 'Read Poem in Pop-Up'}">
                    <i class="ri-focus-2-line text-xs"></i>
                    <span data-mm="ကဗျာဖတ်ရန်" data-en="Read Poem">${lang === 'mm' ? 'ကဗျာဖတ်ရန်' : 'Read Poem'}</span>
                  </button>
                  ${renderCardLangToggleBtn(item, lang, 'border-rose-300/60 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200')}
                  <a href="${shareTelegramUrl}" target="_blank" rel="noopener" class="px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-medium text-xs flex items-center space-x-1 border border-rose-200 dark:border-rose-900/60 transition-all">
                    <i class="ri-telegram-fill text-rose-600 dark:text-rose-400"></i>
                    <span data-mm="မျှဝေရန်" data-en="Share">${lang === 'mm' ? 'မျှဝေရန်' : 'Share'}</span>
                  </a>
                </div>
                <div class="flex items-center space-x-2">
                  <button class="journal-fav-btn p-2 rounded-xl border ${favBtnClass} transition-all hover:scale-110 flex items-center justify-center cursor-pointer" data-item-id="${item.id}" title="${favTitle}">
                    <i class="${heartIconClass}"></i>
                  </button>
                </div>
              </div>
            </article>
            `;
          }
        }

        // Card Type 4: MICRO-NOTE (Purple Aesthetic)
        else if (item.feedType === "note") {
          const noteContent = lang === 'en' && item.content_en ? item.content_en : (item.content_mm || '');
          const isLongNote = noteContent.length > 200;

          cardsHtml += `
            <article class="journal-card group rounded-3xl border border-purple-500/20 bg-card p-5 sm:p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden" data-category="notes">
              <!-- Header -->
              <div class="flex items-center justify-between mb-3 text-xs font-sans-ui">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-semibold border border-purple-200 dark:border-purple-900/50 text-[11px]">
                    <i class="ri-quill-pen-line"></i>
                    <span data-mm="အတွေးမှတ်စု" data-en="MICRO-NOTE">${lang === 'mm' ? 'အတွေးမှတ်စု' : 'MICRO-NOTE'}</span>
                  </span>
                  <span class="text-faint">•</span>
                  <span class="text-muted text-[11px]">${formattedDate}</span>
                </div>
                <span class="text-[11px] text-muted font-sans-ui flex items-center space-x-1">
                  <i class="ri-map-pin-line text-purple-500"></i>
                  <span>${lang === 'en' ? item.location_en : item.location_mm}</span>
                </span>
              </div>

              <!-- Body with See More -->
              <div class="space-y-2.5">
                <h3 class="font-serif-editorial text-base sm:text-lg font-bold text-charcoal leading-snug">
                  ${lang === 'en' && item.title_en ? item.title_en : item.title_mm}
                </h3>

                <div class="expandable-wrap" data-collapsed="${isLongNote ? 'true' : 'false'}">
                  <div class="expandable-content text-xs sm:text-sm text-charcoal/90 leading-relaxed font-sans-ui whitespace-pre-line ${isLongNote ? 'line-clamp-4' : ''}">
                    ${noteContent}
                  </div>
                  ${isLongNote ? `
                  <button class="see-more-toggle-btn text-[11px] text-purple-600 dark:text-purple-400 font-semibold hover:underline mt-1.5 inline-flex items-center space-x-1 cursor-pointer">
                    <span class="see-more-label">${lang === 'mm' ? 'ပိုမိုဖတ်ရှုရန်... (See more)' : 'See more...'}</span>
                    <i class="ri-arrow-down-s-line text-xs"></i>
                  </button>
                  ` : ''}
                </div>

                ${item.image ? `
                <div class="my-3 overflow-hidden rounded-2xl border border-hairline/60">
                  <img src="${item.image}" alt="${escapeHtml(item.title_mm)}" class="w-full max-h-80 object-cover" loading="lazy">
                </div>
                ` : ''}

                <div class="flex flex-wrap items-center gap-1.5 pt-1">
                  ${(item.tags || []).map(t => `<span class="text-[10px] px-2 py-0.5 rounded-md bg-cream text-muted border border-hairline">#${t}</span>`).join('')}
                </div>

                <!-- Actions Bar -->
                <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-hairline/60 text-xs font-sans-ui">
                  <div class="flex flex-wrap items-center gap-2">
                    <button type="button" class="journal-popup-read-btn px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60 text-xs font-semibold flex items-center space-x-1.5 transition-all hover:scale-105 cursor-pointer shadow-2xs" data-item-id="${item.id}" title="${lang === 'mm' ? 'Pop-Up ဖြင့် ဖတ်ရှုရန်' : 'Read Note in Pop-Up'}">
                      <i class="ri-focus-2-line text-xs"></i>
                      <span data-mm="မှတ်စု ဖတ်ရန်" data-en="Read Note">${lang === 'mm' ? 'မှတ်စု ဖတ်ရန်' : 'Read Note'}</span>
                    </button>
                    ${renderCardLangToggleBtn(item, lang, 'border-purple-300/60 bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-200')}
                    ${item.source_url ? `
                    <a href="${item.source_url}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1.5 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs flex items-center space-x-1 border border-hairline transition-colors" title="မူရင်း Blogpost သို့">
                      <i class="ri-external-link-line text-purple-600"></i>
                      <span>Blog</span>
                    </a>` : (item.article_link ? `
                    <a href="${item.article_link}" class="px-3 py-1.5 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs flex items-center space-x-1 border border-hairline transition-colors">
                      <i class="ri-external-link-line"></i>
                      <span data-mm="အပြည့်အစုံဖတ်ရန်" data-en="Full Article">${lang === 'mm' ? 'အပြည့်အစုံဖတ်ရန်' : 'Full Article'}</span>
                    </a>` : '')}
                  </div>
                  <div class="flex items-center space-x-2">
                    <button class="journal-share-btn p-1.5 rounded-lg bg-cream hover:bg-taupe-light text-muted hover:text-charcoal transition-colors" data-share-text="${escapeHtml(item.title_mm)}" title="Share">
                      <i class="ri-share-line"></i>
                    </button>
                    <button class="journal-fav-btn p-2 rounded-xl border ${favBtnClass} transition-all hover:scale-110 flex items-center justify-center cursor-pointer" data-item-id="${item.id}" title="${favTitle}">
                      <i class="${heartIconClass}"></i>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          `;
        }

        // Card Type 5: ACTIVISM (Rose / Crimson Aesthetic)
        else if (item.feedType === "activism") {
          const activismContent = lang === 'en' && item.content_en ? item.content_en : (item.content_mm || '');
          const isLongActivism = activismContent.length > 200;

          cardsHtml += `
            <article class="journal-card group rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/5 via-card to-rose-500/10 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden" data-category="activism">
              <!-- Header -->
              <div class="flex items-center justify-between mb-3 text-xs font-sans-ui">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-900/50 text-[11px]">
                    <i class="ri-megaphone-line text-rose-600"></i>
                    <span data-mm="လှုပ်ရှားမှုနှင့် ထုတ်ပြန်ချက်" data-en="ACTIVISM & DISPATCH">${lang === 'mm' ? 'လှုပ်ရှားမှုနှင့် ထုတ်ပြန်ချက်' : 'ACTIVISM & DISPATCH'}</span>
                  </span>
                  <span class="text-faint">•</span>
                  <span class="text-muted text-[11px]">${formattedDate}</span>
                </div>
                <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 text-[10px] font-bold">
                  <span class="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span>
                  <span>DISPATCH</span>
                </span>
              </div>

              <!-- Body with See More -->
              <div class="space-y-2.5">
                <h3 class="font-serif-editorial text-base sm:text-lg font-bold text-charcoal leading-snug">
                  ${lang === 'en' && item.title_en ? item.title_en : item.title_mm}
                </h3>

                <div class="expandable-wrap" data-collapsed="${isLongActivism ? 'true' : 'false'}">
                  <div class="expandable-content text-xs sm:text-sm text-charcoal/90 leading-relaxed font-sans-ui whitespace-pre-line ${isLongActivism ? 'line-clamp-4' : ''}">
                    ${activismContent}
                  </div>
                  ${isLongActivism ? `
                  <button class="see-more-toggle-btn text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline mt-1.5 inline-flex items-center space-x-1 cursor-pointer">
                    <span class="see-more-label">${lang === 'mm' ? 'ပိုမိုဖတ်ရှုရန်... (See more)' : 'See more...'}</span>
                    <i class="ri-arrow-down-s-line text-xs"></i>
                  </button>
                  ` : ''}
                </div>

                ${item.image ? `
                <div class="my-3 overflow-hidden rounded-2xl border border-hairline/60">
                  <img src="${item.image}" alt="${escapeHtml(item.title_mm)}" class="w-full max-h-80 object-cover" loading="lazy">
                </div>
                ` : ''}

                <!-- Actions Bar -->
                <div class="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-hairline/60 text-xs font-sans-ui">
                  <div class="flex flex-wrap items-center gap-2">
                    <button type="button" class="journal-popup-read-btn px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-xs font-semibold flex items-center space-x-1.5 transition-all hover:scale-105 cursor-pointer shadow-2xs" data-item-id="${item.id}" title="${lang === 'mm' ? 'Pop-Up ဖြင့် ဖတ်ရှုရန်' : 'Read in Pop-Up'}">
                      <i class="ri-focus-2-line text-xs"></i>
                      <span data-mm="ထုတ်ပြန်ချက် ဖတ်ရန်" data-en="Read Dispatch">${lang === 'mm' ? 'ထုတ်ပြန်ချက် ဖတ်ရန်' : 'Read Dispatch'}</span>
                    </button>
                    ${renderCardLangToggleBtn(item, lang, 'border-rose-300/60 bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200')}
                    ${item.source_url ? `
                    <a href="${item.source_url}" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1.5 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs flex items-center space-x-1 border border-hairline transition-colors" title="မူရင်း Blogpost သို့">
                      <i class="ri-external-link-line text-vermilion"></i>
                      <span>Blog</span>
                    </a>` : (item.article_link ? `
                    <a href="${item.article_link}" class="px-3 py-1.5 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs flex items-center space-x-1 border border-hairline transition-colors">
                      <i class="ri-external-link-line"></i>
                      <span data-mm="အသေးစိတ်ဖတ်ရန်" data-en="Read Full">${lang === 'mm' ? 'အသေးစိတ်ဖတ်ရန်' : 'Read Full'}</span>
                    </a>` : '')}
                  </div>
                  <div class="flex items-center space-x-2">
                    <button class="journal-share-btn p-1.5 rounded-lg bg-cream hover:bg-taupe-light text-muted hover:text-charcoal transition-colors" data-share-text="${escapeHtml(item.title_mm)}" title="Share">
                      <i class="ri-share-line"></i>
                    </button>
                    <button class="journal-fav-btn p-2 rounded-xl border ${favBtnClass} transition-all hover:scale-110 flex items-center justify-center cursor-pointer" data-item-id="${item.id}" title="${favTitle}">
                      <i class="${heartIconClass}"></i>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          `;
        }
      });

      // Append Load More button or Sentinel Anchor for Auto-scroll
      if (hasMore) {
        const remaining = filtered.length - visibleCount;
        cardsHtml += `
          <div id="journal-scroll-sentinel" class="pt-6 pb-2 text-center">
            <button id="journal-load-more-btn" class="px-6 py-3 rounded-2xl bg-card border-2 border-taupe-light hover:border-vermilion text-charcoal hover:text-vermilion font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center space-x-2 mx-auto cursor-pointer">
              <i class="ri-loader-4-line text-base animate-spin hidden" id="journal-load-more-spinner"></i>
              <span data-mm="နောက်ထပ် ဖော်ပြရန်" data-en="Load More Dispatches">${lang === 'mm' ? 'နောက်ထပ် ဖော်ပြရန်' : 'Load More Dispatches'}</span>
              <span class="px-2 py-0.5 rounded-full bg-vermilion/10 text-vermilion text-[11px] font-bold font-mono">
                ${lang === 'mm' ? `+${toBurmeseNumber(remaining)} ခု` : `+${remaining}`}
              </span>
            </button>
          </div>
        `;
      } else if (filtered.length > PAGE_CHUNK) {
        cardsHtml += `
          <div class="pt-6 pb-2 text-center text-xs text-muted font-sans-ui">
            <span class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cream border border-hairline">
              <i class="ri-check-double-line text-emerald-600"></i>
              <span data-mm="မှတ်တမ်းအားလုံး ဖော်ပြပြီးပါပြီ" data-en="All Dispatches Loaded">${lang === 'mm' ? 'မှတ်တမ်းအားလုံး ဖော်ပြပြီးပါပြီ' : 'All Dispatches Loaded'}</span>
            </span>
          </div>
        `;
      }

      feedContainer.innerHTML = cardsHtml;
      if (typeof init3DTiltAndFloatingEffects === 'function') {
        init3DTiltAndFloatingEffects();
      }

      // Fast IntersectionObserver for Instant Auto-load on Fast Scrolling
      if (scrollObserver) {
        scrollObserver.disconnect();
      }

      const sentinel = document.getElementById("journal-scroll-sentinel");
      if (sentinel && hasMore) {
        let isObserverLoading = false;
        scrollObserver = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !isObserverLoading) {
            isObserverLoading = true;
            visibleCount += PAGE_CHUNK;
            renderFeed();
          }
        }, { rootMargin: "600px" });
        scrollObserver.observe(sentinel);
      }

      // Manual click fallback for load more button
      const loadMoreBtn = document.getElementById("journal-load-more-btn");
      if (loadMoreBtn) {
        loadMoreBtn.addEventListener("click", () => {
          visibleCount += PAGE_CHUNK;
          renderFeed();
        });
      }
    }

    // Tab Buttons switching
    tabButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-journal-tab");
        if (!tab || tab === currentTab) return;

        tabButtons.forEach(b => {
          b.classList.remove("active", "bg-vermilion", "text-white", "shadow-xs");
          b.classList.add("text-charcoal", "hover:bg-cream", "dark:hover:bg-zinc-800");
          const badge = b.querySelector(".tab-badge");
          if (badge) {
            badge.classList.remove("bg-white/20", "text-white");
          }
        });

        btn.classList.add("active", "bg-vermilion", "text-white", "shadow-xs");
        btn.classList.remove("text-charcoal", "hover:bg-cream", "dark:hover:bg-zinc-800");
        const activeBadge = btn.querySelector(".tab-badge");
        if (activeBadge) {
          activeBadge.classList.add("bg-white/20", "text-white");
        }

        currentTab = tab;
        visibleCount = PAGE_CHUNK;
        renderFeed();
      });
    });

    // Realtime Search
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        if (searchClearBtn) {
          if (searchQuery.length > 0) {
            searchClearBtn.classList.remove("hidden");
          } else {
            searchClearBtn.classList.add("hidden");
          }
        }
        visibleCount = PAGE_CHUNK;
        renderFeed();
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        searchQuery = "";
        searchClearBtn.classList.add("hidden");
        visibleCount = PAGE_CHUNK;
        renderFeed();
      });
    }

    // Sort Select
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        visibleCount = PAGE_CHUNK;
        renderFeed();
      });
    }

    // Inline Card Original Language Toggle Function
    function toggleJournalCardLanguage(btn) {
      const itemId = btn.getAttribute("data-item-id");
      if (!itemId || !allFeedItemsMap) return;
      const item = allFeedItemsMap.get(itemId);
      if (!item) return;

      const card = btn.closest(".journal-card, .journal-compact-card");
      if (!card) return;

      const isShowingOriginal = btn.getAttribute("data-showing-original") === "true";
      const siteLang = window.I18n ? window.I18n.getLang() : "mm";
      const willShowOriginal = !isShowingOriginal;

      btn.setAttribute("data-showing-original", willShowOriginal ? "true" : "false");
      const flagEl = btn.querySelector(".lang-toggle-flag") || btn.querySelector("span:first-child");
      const labelEl = btn.querySelector(".lang-toggle-label");

      if (siteLang !== "mm") {
        if (willShowOriginal) {
          if (flagEl) flagEl.textContent = "🌐";
          if (labelEl) labelEl.textContent = siteLang.toUpperCase();
          btn.title = `Switch back to ${siteLang.toUpperCase()} translation`;
        } else {
          if (flagEl) flagEl.textContent = "🇲🇲";
          if (labelEl) labelEl.textContent = "Original (MM)";
          btn.title = "View Original Burmese (မူရင်းမြန်မာဘာသာဖြင့် ကြည့်ရန်)";
        }
      } else {
        if (willShowOriginal) {
          if (flagEl) flagEl.textContent = "🌐";
          if (labelEl) labelEl.textContent = "English";
          btn.title = "View English translation";
        } else {
          if (flagEl) flagEl.textContent = "🇲🇲";
          if (labelEl) labelEl.textContent = "Original (MM)";
          btn.title = "မူရင်းမြန်မာစာမူသို့ ပြန်သွားရန်";
        }
      }

      // 1. Article
      if (item.feedType === "article") {
        const titleLink = card.querySelector("h3 a, h3 button");
        if (titleLink) {
          titleLink.textContent = willShowOriginal ? (item.title_mm || item.title_en) : (item.title_en || item.title_mm);
        }
        const excerptEl = card.querySelector(".expandable-text, p.font-sans-ui");
        if (excerptEl) {
          excerptEl.textContent = willShowOriginal ? (item.excerpt_mm || item.excerpt_en) : (item.excerpt_en || item.excerpt_mm);
        }
      }
      // 2. Quote
      else if (item.feedType === "quote") {
        const quoteEl = card.querySelector(".expandable-quote, blockquote");
        if (quoteEl) {
          const transQuote = item.quote_en || item.quote_zh || item.quote_ja || item.quote_th || item.quote_mm;
          quoteEl.textContent = willShowOriginal ? item.quote_mm : transQuote;
        }
        const topicEl = card.querySelector(".inline-flex span:last-child");
        if (topicEl && (item.topic_mm || item.topic_en)) {
          topicEl.textContent = willShowOriginal ? (item.topic_mm || item.topic_en) : (item.topic_en || item.topic_mm);
        }
      }
      // 3. Poetry
      else if (item.feedType === "poetry") {
        const titleEl = card.querySelector("h3 span:first-child, h3");
        if (titleEl) {
          titleEl.textContent = willShowOriginal ? item.title_mm : (item.title_en || item.title_mm);
        }
        const contentEl = card.querySelector(".expandable-content, .font-serif.italic");
        if (contentEl) {
          contentEl.textContent = willShowOriginal ? item.content_mm : (item.content_en || item.content_mm);
        }
      }
      // 4. Note / Activism
      else {
        const titleEl = card.querySelector("h3");
        if (titleEl) {
          titleEl.textContent = willShowOriginal ? item.title_mm : (item.title_en || item.title_mm);
        }
        const contentEl = card.querySelector(".expandable-content, p.leading-relaxed");
        if (contentEl) {
          contentEl.textContent = willShowOriginal ? item.content_mm : (item.content_en || item.content_mm);
        }
      }

      if (window.HtetUI && typeof window.HtetUI.showToast === "function") {
        window.HtetUI.showToast(willShowOriginal 
          ? "မူရင်းမြန်မာဘာသာ စာသားသို့ ပြောင်းလဲပြသထားပါသည် ✓" 
          : "ဘာသာပြန်ဆိုချက်သို့ ပြောင်းလဲပြသထားပါသည် ✓");
      }
    }

    // Global Click Delegation for Dynamic Cards (See More / See Less, Favorites Toggle, Share)
    document.addEventListener("click", (e) => {
      // 1. See More / See Less Toggle
      const seeMoreBtn = e.target.closest(".see-more-toggle-btn");
      if (seeMoreBtn) {
        const wrap = seeMoreBtn.closest(".expandable-wrap");
        if (!wrap) return;
        const isCollapsed = wrap.getAttribute("data-collapsed") !== "false";
        const targetEl = wrap.querySelector(".expandable-text, .expandable-quote, .expandable-content");
        const label = seeMoreBtn.querySelector(".see-more-label");
        const icon = seeMoreBtn.querySelector("i");
        const lang = window.I18n ? window.I18n.getLang() : "mm";

        if (isCollapsed) {
          wrap.setAttribute("data-collapsed", "false");
          if (targetEl) {
            targetEl.classList.remove("line-clamp-3", "line-clamp-4");
          }
          if (label) label.textContent = (lang === "mm") ? "ပြန်သိမ်းရန် (See less)" : "See less";
          if (icon) icon.className = "ri-arrow-up-s-line text-xs";
        } else {
          wrap.setAttribute("data-collapsed", "true");
          if (targetEl) {
            const clampClass = targetEl.classList.contains("expandable-content") ? "line-clamp-4" : "line-clamp-3";
            targetEl.classList.add(clampClass);
          }
          if (label) label.textContent = (lang === "mm") ? "ပိုမိုဖတ်ရှုရန်... (See more)" : "See more...";
          if (icon) icon.className = "ri-arrow-down-s-line text-xs";
        }
        return;
      }

      // 2. Personal User Favorites / Heart Button Toggle (No fake counters)
      const favBtn = e.target.closest(".journal-fav-btn");
      if (favBtn) {
        const itemId = favBtn.getAttribute("data-item-id");
        if (!itemId) return;

        const lang = window.I18n ? window.I18n.getLang() : "mm";
        const wasFavorited = userFavorites.has(itemId);

        if (wasFavorited) {
          userFavorites.delete(itemId);
          saveUserFavorites(userFavorites);
          updateFavoritesBadge();

          const toastMsg = (lang === "mm")
            ? "ကြိုက်နှစ်သက်သည့် စာရင်းမှ ဖယ်ရှားလိုက်ပါပြီ"
            : "Removed from your favorites.";
          if (window.HtetUI && typeof window.HtetUI.showToast === "function") {
            window.HtetUI.showToast(toastMsg);
          }

          if (currentTab === "favorites") {
            renderFeed();
          } else {
            favBtn.className = "journal-fav-btn p-2 rounded-xl border bg-cream hover:bg-rose-50 text-muted hover:text-rose-600 border-hairline transition-all hover:scale-110 flex items-center justify-center cursor-pointer";
            favBtn.innerHTML = '<i class="ri-heart-line text-sm"></i>';
            favBtn.title = (lang === "mm") ? "ကြိုက်နှစ်သက်သည့် စာရင်းသို့ သိမ်းဆည်းရန်" : "Save to favorites";
          }
        } else {
          userFavorites.add(itemId);
          saveUserFavorites(userFavorites);
          updateFavoritesBadge();

          const toastMsg = (lang === "mm")
            ? "ကြိုက်နှစ်သက်သည့် စာရင်းထဲသို့ ထည့်သွင်းလိုက်ပါပြီ (Saved)"
            : "Added to your personal favorites.";
          if (window.HtetUI && typeof window.HtetUI.showToast === "function") {
            window.HtetUI.showToast(toastMsg);
          }

          if (typeof confetti === "function") {
            confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
          }

          favBtn.className = "journal-fav-btn p-2 rounded-xl border bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900/50 text-rose-600 transition-all hover:scale-110 flex items-center justify-center cursor-pointer";
          favBtn.innerHTML = '<i class="ri-heart-fill text-rose-600 text-sm"></i>';
          favBtn.title = (lang === "mm") ? "ကြိုက်နှစ်သက်ပြီး (Saved in favorites)" : "Saved in favorites";
        }
        return;
      }

      // 2b. Inline Card Original Language Toggle Trigger (Burmese Original <-> Translation)
      const cardLangToggle = e.target.closest(".journal-card-lang-toggle-btn");
      if (cardLangToggle) {
        e.preventDefault();
        toggleJournalCardLanguage(cardLangToggle);
        return;
      }

      // 3. Pop-Up Reading Modal Open Trigger
      const popupTrigger = e.target.closest(".journal-popup-read-btn, .journal-title-popup-trigger");
      if (popupTrigger) {
        e.preventDefault();
        const itemId = popupTrigger.getAttribute("data-item-id");
        if (itemId) {
          openReaderModal(itemId);
        }
        return;
      }

      // 4. Share Button
      const shareBtn = e.target.closest(".journal-share-btn");
      if (shareBtn) {
        const shareUrl = shareBtn.getAttribute("data-share-url") || window.location.href;
        const shareTitle = shareBtn.getAttribute("data-share-title") || shareBtn.getAttribute("data-share-text") || document.title;
        if (navigator.share) {
          navigator.share({ title: shareTitle, url: shareUrl }).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.origin + "/" + shareUrl).then(() => {
            if (window.HtetUI && typeof window.HtetUI.showToast === 'function') {
              window.HtetUI.showToast("လင့်ခ်ကို ကူးယူပြီးပါပြီ (Link Copied)");
            }
          });
        }
        return;
      }
    });

    // Language Change Listener
    window.addEventListener("langchange", () => {
      if (feedContainer) renderFeed();
      if (compactGridContainer) renderCompactIndexGrid();
    });

    // Initial Render
    if (feedContainer) renderFeed();
    if (compactGridContainer) renderCompactIndexGrid();

    // Direct Single Item Deep-Link auto-open (?item=... or ?id=...)
    const urlParams = new URLSearchParams(window.location.search);
    const directItemId = urlParams.get('item') || urlParams.get('id');
    if (directItemId && allFeedItemsMap.has(directItemId)) {
      setTimeout(() => {
        openReaderModal(directItemId);
      }, 250);
    }
  }

  // 13. Glossary Page Explorer Renderer
  async function initGlossaryPage() {
    const listContainer = document.getElementById('glossary-terms-list');
    if (!listContainer || !window.HtetData) return;

    const searchInput = document.getElementById('glossary-search');
    const categoryContainer = document.getElementById('glossary-category-filter');
    const countBadge = document.getElementById('glossary-count-badge');

    const terms = (await window.HtetData.getGlossary()) || [];
    let activeCategory = 'all';
    let searchQuery = '';

    function renderGlossary() {
      const lang = window.I18n ? window.I18n.getLang() : 'mm';

      const filtered = terms.filter(t => {
        const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
        const haystack = `${t.term_en} ${t.term_mm} ${t.definition_en} ${t.definition_mm} ${t.thinker}`.toLowerCase();
        const matchesSearch = !searchQuery || haystack.includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      });

      if (countBadge) countBadge.textContent = filtered.length;

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="col-span-full py-16 text-center border border-dashed border-taupe-light rounded-2xl bg-card">
            <i class="ri-book-open-line text-4xl text-faint mb-2 block"></i>
            <p class="text-muted text-sm font-sans-ui">${lang === 'mm' ? 'မည်သည့် သဘောတရားမျှ ရှာမတွေ့ပါ။' : 'No conceptual terms found matching query.'}</p>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = filtered.map((t, idx) => `
        <div id="${t.id}" class="glass-3d-card card-3d-interactive p-6 md:p-8 rounded-3xl border border-taupe-light bg-card transition-all shadow-sm flex flex-col justify-between" data-aos="fade-up" data-aos-delay="${idx * 60}">
          <div>
            <div class="flex items-center justify-between mb-3 text-xs font-sans-ui">
              <span class="px-3 py-1 rounded-full bg-cream text-charcoal font-medium border border-hairline flex items-center space-x-1">
                <i class="ri-bookmark-2-line text-vermilion"></i>
                <span>${lang === 'mm' ? t.category_mm : t.category_en}</span>
              </span>
              <span class="font-mono text-faint text-[11px]">${t.pronunciation || ''}</span>
            </div>

            <h3 class="font-serif-editorial text-2xl font-bold text-charcoal mb-1">
              ${lang === 'mm' ? t.term_mm : t.term_en}
            </h3>
            <span class="text-xs text-faint font-sans-ui block mb-3 font-medium">
              ${lang === 'mm' ? t.term_en : t.term_mm} • ${t.thinker}
            </span>

            <p class="text-sm text-muted leading-relaxed font-sans-ui mb-4">
              ${lang === 'mm' ? t.definition_mm : t.definition_en}
            </p>

            <div class="p-3.5 rounded-2xl bg-ivory border border-hairline text-xs font-sans-ui text-charcoal mb-4">
              <span class="font-semibold text-vermilion block mb-1 flex items-center space-x-1">
                <i class="ri-lightbulb-line"></i>
                <span>${lang === 'mm' ? 'မြန်မာ့လူ့ဘောင်နှင့် ဆက်စပ်မှု' : 'Context & Relevance'}</span>
              </span>
              <p class="text-muted leading-relaxed">
                ${lang === 'mm' ? t.context_mm : t.context_en}
              </p>
            </div>
          </div>

          <div class="pt-4 border-t border-hairline flex items-center justify-between text-xs font-sans-ui">
            <span class="hanko-seal-3d px-2.5 py-0.5 text-[10px] rounded-full">ထက်</span>
            <div class="flex items-center space-x-2">
              <button onclick="navigator.clipboard.writeText('“${t.term_en} (${t.term_mm})” — ${t.thinker}\\n${t.definition_mm}'); HtetUI.showToast('Concept copied!');" class="btn-3d-tactile p-1.5 rounded-lg hover:bg-cream text-muted hover:text-vermilion transition-colors" title="Copy definition">
                <i class="ri-file-copy-line text-sm"></i>
              </button>
              <button onclick="window.open('https://t.me/share/url?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent('${t.term_en}: ${t.definition_en}'), '_blank');" class="btn-3d-tactile p-1.5 rounded-lg hover:bg-cream text-muted hover:text-[#2AABEE] transition-colors" title="Share on Telegram">
                <i class="ri-telegram-fill text-sm"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('');

      initAOS();
      if (typeof init3DTiltAndFloatingEffects === 'function') {
        init3DTiltAndFloatingEffects();
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderGlossary();
      });
    }

    if (categoryContainer) {
      categoryContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-category]');
        if (btn) {
          e.preventDefault();
          activeCategory = btn.getAttribute('data-category');

          categoryContainer.querySelectorAll('[data-category]').forEach(b => {
            b.classList.remove('bg-vermilion', 'text-white', 'shadow-md');
            b.classList.add('bg-cream', 'text-charcoal');
          });

          btn.classList.remove('bg-cream', 'text-charcoal');
          btn.classList.add('bg-vermilion', 'text-white', 'shadow-md');
          renderGlossary();
        }
      });
    }

    renderGlossary();
    window.addEventListener('langchange', renderGlossary);
  }

  // 14. Publications Page & Academic Citation Modal
  async function initPublicationsPage() {
    const listContainer = document.getElementById('publications-list');
    if (!listContainer) return;

    let pubs = [];
    if (window.HtetData && typeof window.HtetData.getPublications === 'function') {
      try {
        pubs = (await window.HtetData.getPublications()) || [];
      } catch (err) {
        console.warn('[initPublicationsPage] HtetData error:', err);
      }
    }
    if ((!pubs || pubs.length === 0) && (window.HTET_PUBLICATIONS_BACKUP || window.HtetPublicationsBackup)) {
      pubs = window.HTET_PUBLICATIONS_BACKUP || window.HtetPublicationsBackup || [];
    }

    const modal = document.getElementById('citation-modal');
    const modalClose = document.getElementById('citation-modal-close');
    const display = document.getElementById('citation-content-display');
    const copyBtn = document.getElementById('copy-citation-btn');
    const tabsContainer = document.getElementById('citation-format-tabs');

    let currentCitations = null;
    let activeFormat = 'apa';
    let currentCategory = 'all';

    function renderPubs() {
      const lang = window.I18n ? window.I18n.getLang() : 'mm';
      const filteredPubs = currentCategory === 'all'
        ? pubs
        : pubs.filter(p => (p.category || 'monograph') === currentCategory);

      if (filteredPubs.length === 0) {
        listContainer.innerHTML = `
          <div class="text-center py-16 p-8 rounded-3xl border border-hairline bg-card">
            <i class="ri-book-open-line text-4xl text-vermilion mb-3 inline-block"></i>
            <h4 class="font-serif-editorial text-xl font-bold text-charcoal mb-1">
              ${lang === 'mm' ? 'ဤကဏ္ဍတွင် ထုတ်ဝေမှုများ မရှိသေးပါ' : 'No publications in this category'}
            </h4>
            <p class="text-xs text-muted font-sans-ui">
              ${lang === 'mm' ? 'အခြားကဏ္ဍများကို ရွေးချယ်ကြည့်ရှုနိုင်ပါသည်။' : 'Please check other publication categories.'}
            </p>
          </div>
        `;
        return;
      }

      listContainer.innerHTML = filteredPubs.map((p, idx) => {
        const typeStr = (lang === 'mm' ? (p.type_mm || p.type_en) : (p.type_en || p.type_mm)) || (lang === 'mm' ? 'သုတေသန စာတမ်း' : 'Research Monograph');
        const yearStr = p.year || '2026';
        const pagesStr = p.pages || (lang === 'mm' ? 'စာတမ်းအပြည့်အစုံ' : 'Full Monograph');
        const titleStr = (lang === 'mm' ? (p.title_mm || p.title_en) : (p.title_en || p.title_mm)) || '';
        const abstractStr = (lang === 'mm' ? (p.abstract_mm || p.abstract_en) : (p.abstract_en || p.abstract_mm)) || '';

        const artLink = p.article_link || p.read_link;
        const pdfFile = p.pdf_file || (p.pdf ? (p.pdf.startsWith('downloads/') ? p.pdf : 'downloads/' + p.pdf) : null);
        let dlHref = null;
        if (p.download_file) {
          dlHref = p.download_file.startsWith('downloads/') ? p.download_file : 'downloads/' + p.download_file;
        } else if (pdfFile) {
          dlHref = pdfFile;
        }
        let mdHref = null;
        if (p.markdown_file) {
          mdHref = p.markdown_file.startsWith('downloads/') ? p.markdown_file : 'downloads/' + p.markdown_file;
        } else if (p.markdown) {
          mdHref = p.markdown.startsWith('downloads/') ? p.markdown : 'downloads/' + p.markdown;
        } else if (p.slug) {
          mdHref = `downloads/${p.slug}.md`;
        }

        return `
        <div class="glass-3d-card card-3d-interactive p-6 md:p-8 rounded-3xl border border-taupe-light bg-card transition-all shadow-sm group" data-aos="fade-up" data-aos-delay="${(idx % 6) * 60}">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs font-sans-ui text-faint">
            <div class="flex items-center space-x-2">
              <span class="px-3 py-0.5 rounded-full bg-cream text-charcoal font-medium border border-hairline flex items-center space-x-1">
                <i class="ri-book-mark-line text-vermilion"></i>
                <span>${typeStr}</span>
              </span>
              <span>•</span>
              <span>${yearStr}</span>
              <span>•</span>
              <span>${pagesStr}</span>
            </div>
            <span class="hanko-seal-3d px-2.5 py-0.5 text-[10px] rounded-full">သုတေသန</span>
          </div>

          <h3 class="font-serif-editorial text-2xl md:text-3xl font-semibold text-charcoal group-hover:text-vermilion transition-colors mb-3">
            ${titleStr}
          </h3>

          ${p.image ? `
            <div class="mb-4 rounded-xl overflow-hidden border border-hairline shadow-2xs max-w-sm">
              <img src="${p.image}" alt="${titleStr}" class="w-full h-auto max-h-48 object-cover object-center" loading="lazy">
            </div>
          ` : ""}

          <p class="text-muted text-sm md:text-base leading-relaxed font-sans-ui mb-5">
            ${abstractStr}
          </p>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-hairline text-xs font-sans-ui overflow-hidden">
            <div class="flex flex-wrap gap-1.5 max-w-full">
              ${(p.tags || []).map(t => `<span class="px-2.5 py-0.5 rounded-lg bg-cream text-charcoal text-[11px]"><i class="ri-hashtag text-vermilion"></i> ${t}</span>`).join('')}
            </div>

            <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end max-w-full">
              ${artLink ? `
                <a href="${artLink}" class="btn-3d-tactile px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center space-x-1.5 transition-all shadow-sm max-w-full group/btn" title="Web Version ဖတ်ရှုရန်">
                  <i class="ri-chrome-line text-base shrink-0 group-hover/btn:rotate-12 transition-transform"></i>
                  <span class="truncate" data-mm="Web Version ဖတ်ရှုရန်" data-en="Web Version">Web Version ဖတ်ရှုရန်</span>
                </a>
              ` : ''}
              ${pdfFile ? `
                <a href="${pdfFile}" download class="btn-3d-tactile px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center space-x-1.5 transition-all shadow-sm max-w-full" title="Official Full Version PDF">
                  <i class="ri-file-pdf-2-line text-base shrink-0"></i>
                  <span class="truncate" data-mm="Full Version PDF" data-en="Full Version PDF">Full Version PDF</span>
                </a>
              ` : ''}
              ${dlHref ? `
                <a href="${dlHref}" download class="btn-3d-tactile px-3.5 py-2 rounded-xl bg-vermilion hover:bg-vermilion-dark text-white font-semibold flex items-center space-x-1.5 transition-all shadow-sm max-w-full" title="စာတမ်း ဒေါင်းလုဒ်">
                  <i class="ri-download-cloud-2-line shrink-0"></i>
                  <span class="truncate" data-mm="စာတမ်း ဒေါင်းလုဒ်" data-en="Download Monograph">စာတမ်း ဒေါင်းလုဒ်</span>
                </a>
              ` : ''}
              <button data-open-cite="${p.id}" class="btn-3d-tactile px-3 py-2 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium flex items-center space-x-1.5 transition-colors border border-hairline shadow-2xs" title="Citation Export">
                <i class="ri-double-quotes-l text-vermilion shrink-0"></i>
                <span data-mm="ကိုးကားချက်" data-en="Cite">ကိုးကားချက်</span>
              </button>
              ${mdHref ? `
                <a href="${mdHref}" download class="btn-3d-tactile px-2.5 py-2 rounded-xl bg-cream hover:bg-taupe-light text-muted hover:text-charcoal font-medium flex items-center space-x-1 transition-colors border border-hairline text-xs" title="Markdown Source">
                  <i class="ri-markdown-line text-vermilion shrink-0"></i>
                  <span>.md</span>
                </a>
              ` : ''}
            </div>
          </div>
        </div>
        `;
      }).join('');

      initAOS();
      if (typeof init3DTiltAndFloatingEffects === 'function') {
        init3DTiltAndFloatingEffects();
      }

      // Attach Cite button handlers
      listContainer.querySelectorAll('[data-open-cite]').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-open-cite');
          const pub = pubs.find(x => x.id === id);
          if (pub && modal) {
            currentCitations = pub.citations;
            activeFormat = 'apa';
            updateModalDisplay();
            modal.classList.remove('hidden');
            setTimeout(() => {
              modal.classList.remove('opacity-0');
              modal.querySelector('.transform').classList.remove('scale-95');
            }, 10);
            document.body.classList.add('overflow-hidden');
          }
        });
      });
    }

    // Attach Category Filter handlers
    document.querySelectorAll('[data-pub-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-pub-filter');
        currentCategory = cat;
        document.querySelectorAll('[data-pub-filter]').forEach(b => {
          if (b.getAttribute('data-pub-filter') === currentCategory) {
            b.className = 'pub-filter-btn px-4 py-2 rounded-xl bg-vermilion text-white font-semibold shadow-xs transition-all flex items-center space-x-1.5';
          } else {
            b.className = 'pub-filter-btn px-4 py-2 rounded-xl bg-card hover:bg-cream dark:hover:bg-stone-800 text-charcoal border border-hairline font-medium transition-all flex items-center space-x-1.5';
          }
        });
        renderPubs();
      });
    });

    function updateModalDisplay() {
      if (!currentCitations || !display) return;
      display.textContent = currentCitations[activeFormat] || '';

      if (tabsContainer) {
        tabsContainer.querySelectorAll('[data-cite-format]').forEach(tab => {
          const fmt = tab.getAttribute('data-cite-format');
          if (fmt === activeFormat) {
            tab.className = 'px-3 py-1 rounded-lg bg-vermilion text-white font-medium';
          } else {
            tab.className = 'px-3 py-1 rounded-lg bg-cream text-charcoal font-medium hover:bg-taupe-light';
          }
        });
      }
    }

    if (tabsContainer) {
      tabsContainer.addEventListener('click', (e) => {
        const tab = e.target.closest('[data-cite-format]');
        if (tab) {
          activeFormat = tab.getAttribute('data-cite-format');
          updateModalDisplay();
        }
      });
    }

    if (modalClose && modal) {
      function closeModal() {
        modal.classList.add('opacity-0');
        modal.querySelector('.transform').classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 200);
        document.body.classList.remove('overflow-hidden');
      }
      modalClose.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        if (display && display.textContent) {
          navigator.clipboard.writeText(display.textContent).then(() => {
            showToast('Citation copied in ' + activeFormat.toUpperCase() + ' format!');
            if (window.confetti) {
              window.confetti({ particleCount: 20, spread: 35, origin: { y: 0.6 } });
            }
          });
        }
      });
    }

    const dlCiteBtn = document.getElementById('download-citation-file-btn');
    if (dlCiteBtn) {
      dlCiteBtn.addEventListener('click', () => {
        if (display && display.textContent) {
          const ext = activeFormat === 'bibtex' ? 'bib' : 'txt';
          const blob = new Blob([display.textContent], { type: 'text/plain;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `citation-${activeFormat}.${ext}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          showToast('Citation downloaded in ' + activeFormat.toUpperCase() + ' format!');
        }
      });
    }

    renderPubs();
    window.addEventListener('langchange', renderPubs);
  }

  // 15. Daily Philosophical Wisdom & Quote Widget (Rotating with smooth crossfade)
  function initDailyQuoteWidget() {
    const card = document.getElementById('daily-quote-card');
    if (!card || !window.HtetData) return;

    const quotes = window.HtetData.getQuotes() || [];
    if (quotes.length === 0) return;

    let currentIndex = 0;
    const textEl = document.getElementById('daily-quote-text');
    const topicEl = document.getElementById('daily-quote-topic');
    const sourceEl = document.getElementById('daily-quote-source');
    const nextBtn = document.getElementById('daily-quote-next');
    const copyBtn = document.getElementById('daily-quote-copy');
    const shareBtn = document.getElementById('daily-quote-share');

    function updateQuote(index) {
      const q = quotes[index];
      const lang = window.I18n ? window.I18n.getLang() : 'mm';

      if (textEl) {
        textEl.style.opacity = '0';
        setTimeout(() => {
          const text = (lang === 'mm') ? q.quote_mm : (q[`quote_${lang}`] || q.quote_en);
          textEl.textContent = `“${text}”`;
          textEl.style.opacity = '1';
        }, 180);
      }

      if (topicEl) {
        topicEl.textContent = (lang === 'mm') ? q.topic_mm : (q[`topic_${lang}`] || q.topic_en);
      }
      if (sourceEl) {
        sourceEl.textContent = (lang === 'mm') ? (q.source_mm || q.source) : (q[`source_${lang}`] || q.source_en || q.source);
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % quotes.length;
        updateQuote(currentIndex);
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const q = quotes[currentIndex];
        const lang = window.I18n ? window.I18n.getLang() : 'mm';
        const text = (lang === 'mm') ? q.quote_mm : (q[`quote_${lang}`] || q.quote_en);
        const src = (lang === 'mm') ? (q.source_mm || q.source) : (q[`source_${lang}`] || q.source_en || q.source);
        const formatted = `“${text}”\n— ${src}`;
        navigator.clipboard.writeText(formatted).then(() => {
          showToast('Quote copied to clipboard!');
        });
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const q = quotes[currentIndex];
        const lang = window.I18n ? window.I18n.getLang() : 'mm';
        const text = (lang === 'mm') ? q.quote_mm : (q[`quote_${lang}`] || q.quote_en);
        const formatted = `“${text}” — Htet`;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(formatted)}`, '_blank');
      });
    }

    updateQuote(0);
    window.addEventListener('langchange', () => updateQuote(currentIndex));
  }

  // 16. Contact Form with Confetti Celebration
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value;
      const email = document.getElementById('contact-email')?.value;
      const subject = document.getElementById('contact-subject')?.value;
      const message = document.getElementById('contact-message')?.value;

      const record = { name, email, subject, message, date: new Date().toISOString() };
      const saved = JSON.parse(localStorage.getItem('htet_messages') || '[]');
      saved.push(record);
      localStorage.setItem('htet_messages', JSON.stringify(saved));

      // Trigger Confetti Celebration
      if (window.confetti) {
        window.confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#B83A2D', '#2AABEE', '#F3ECE2', '#E05349']
        });
      }

      const lang = window.I18n ? window.I18n.getLang() : 'mm';
      const successMsg = (lang === 'mm') 
        ? 'ကျေးဇူးတင်ပါသည်။ သင်၏ စာလွှာကို အောင်မြင်စွာ မှတ်သားထားပြီး ဖြစ်ပါသည်။' 
        : 'Thank you! Your solidarity message has been recorded.';
      showToast(successMsg);

      form.reset();
    });
  }

  // 17. Dynamic Milestone Metrics & Stats Controller (Variables calculated live from JSON/JS)
  async function initDynamicMetrics() {
    if (!window.HtetData) return;

    try {
      const [articles, books, publications, posts] = await Promise.all([
        window.HtetData.getArticles(),
        window.HtetData.getBooks(),
        window.HtetData.getPublications(),
        window.HtetData.getPosts()
      ]);

      const mmDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
      function toBurmeseDigits(numStr) {
        return String(numStr).replace(/[0-9]/g, d => mmDigits[d]);
      }

      function updateStatsDisplay() {
        const lang = window.I18n ? window.I18n.getLang() : 'mm';

        // 1. Featured Book Pages (The Road of Slow Walkers: 171 pages)
        const primaryBook = (Array.isArray(books) && books[0]) ? books[0] : {};
        const bookPagesNum = parseInt(primaryBook.pages) || 171;
        const bookPagesFormatted = (lang === 'mm') ? toBurmeseDigits(bookPagesNum) : String(bookPagesNum);

        const elBookPages = document.getElementById('stat-book-pages');
        if (elBookPages) elBookPages.textContent = bookPagesFormatted;

        const elFeaturedBookPagesBox = document.getElementById('featured-book-pages-box');
        if (elFeaturedBookPagesBox) {
          elFeaturedBookPagesBox.textContent = (lang === 'mm') ? `${bookPagesFormatted} မျက်နှာ` : `${bookPagesNum} Pages`;
        }

        const elFeaturedBookBadge = document.getElementById('featured-book-pages-badge');
        if (elFeaturedBookBadge) {
          elFeaturedBookBadge.textContent = (lang === 'mm')
            ? `စာမျက်နှာ (${bookPagesFormatted}) ပါ စာအုပ်သစ်`
            : `FEATURED PUBLICATION (${bookPagesNum} PAGES)`;
        }

        // 2. Mw 7.7 Earthquake & Crisis Research Monograph Pages (40 pp.)
        const monographPagesFormatted = (lang === 'mm') ? `${toBurmeseDigits(40)}` : '40';
        const elReaders = document.getElementById('stat-readers-reached');
        if (elReaders) elReaders.textContent = monographPagesFormatted;

        // 3. In-Depth Research Papers Count (Live variable: articles.length)
        const articlesCount = Array.isArray(articles) ? articles.length : 9;
        const articlesFormatted = (lang === 'mm') ? `${toBurmeseDigits(articlesCount)}+` : `${articlesCount}+`;
        const elArticlesCount = document.getElementById('stat-articles-count');
        if (elArticlesCount) elArticlesCount.textContent = articlesFormatted;

        // 4. Academic Citations Count (Live variable: total citations calculated across all articles)
        const totalCitations = Array.isArray(articles)
          ? articles.reduce((sum, a) => sum + (Array.isArray(a.citations) ? a.citations.length : 0), 0)
          : 43;
        const citationsFormatted = (lang === 'mm') ? `${toBurmeseDigits(totalCitations)}+` : `${totalCitations}+`;
        const elCitations = document.getElementById('stat-citations-count');
        if (elCitations) elCitations.textContent = citationsFormatted;

        // 5. Total Publications count
        const pubCount = Array.isArray(publications) ? publications.length : 9;
        const elPubCount = document.getElementById('stat-publications-count');
        if (elPubCount) elPubCount.textContent = (lang === 'mm') ? `${toBurmeseDigits(pubCount)}+` : `${pubCount}+`;

        // 6. Total Posts count
        const postsCount = Array.isArray(posts) ? posts.length : 15;
        const elPostsCount = document.getElementById('stat-posts-count');
        if (elPostsCount) elPostsCount.textContent = (lang === 'mm') ? `${toBurmeseDigits(postsCount)}` : `${postsCount}`;

        // 7. Institutional Honors & Certificates count (3)
        const elHonorsCount = document.getElementById('stat-honors-count');
        if (elHonorsCount) elHonorsCount.textContent = (lang === 'mm') ? `${toBurmeseDigits(3)}` : '3';
      }

      updateStatsDisplay();
      window.addEventListener('langchange', updateStatsDisplay);
    } catch (err) {
      console.warn('[initDynamicMetrics] Failed to load dynamic counts:', err);
    }
  }

  // 18. Dynamic Featured Essays on index.html
  async function initFeaturedArticlesOnIndex() {
    const container = document.getElementById('index-featured-articles');
    if (!container || !window.HtetData) return;

    try {
      const articles = await window.HtetData.getArticles();
      if (!Array.isArray(articles) || articles.length === 0) return;

      const mmDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
      function toBurmeseDigits(numStr) {
        return String(numStr).replace(/[0-9]/g, d => mmDigits[d]);
      }

      function renderFeatured() {
        const lang = window.I18n ? window.I18n.getLang() : 'mm';
        const featured = articles.slice(0, 6);

        container.innerHTML = featured.map((art, idx) => {
          const title = (lang === 'mm') ? (art.title_mm || art.title_en) : (art.title_en || art.title_mm);
          const excerpt = (lang === 'mm') ? (art.excerpt_mm || art.excerpt_en) : (art.excerpt_en || art.excerpt_mm);
          const cat = (lang === 'mm')
            ? (art.category_mm || art.category_en || (art.category === 'essay' ? 'အတွေးခေါ်နှင့် ဒဿနဆိုင်ရာ အက်ဆေး' : (art.category || 'ဆောင်းပါးနှင့် စာတမ်း')))
            : (art.category_en || art.category_mm || (art.category === 'essay' ? 'Philosophical Essay' : (art.category || 'Research Article')));
          const readTime = (lang === 'mm')
            ? (art.read_time_mm || (art.reading_time ? `${toBurmeseDigits(parseInt(art.reading_time) || 6)} မိနစ် ဖတ်ရှုရန်` : '၁၂ မိနစ် ဖတ်ရှုရန်'))
            : (art.read_time_en || art.reading_time || '12 min read');
          const citationsCount = Array.isArray(art.citations) ? art.citations.length : (Array.isArray(art.references) ? art.references.length : 0);
          const citationsLabel = (lang === 'mm')
            ? `${toBurmeseDigits(citationsCount)} ခု ကိုးကား`
            : `${citationsCount} Citations`;

          return `
            <article class="glass-3d-card card-3d-interactive p-6 sm:p-8 lg:p-9 rounded-2xl sm:rounded-3xl border border-taupe-light flex flex-col justify-between group shadow-sm hover:shadow-md" data-aos="fade-up" data-aos-delay="${(idx + 1) * 80}">
              <div>
                <div class="flex flex-wrap items-center gap-2 text-xs text-faint font-sans-ui mb-3.5">
                  <span class="glass-3d-pill px-3 py-1 text-charcoal font-medium border border-hairline flex items-center space-x-1.5 shadow-2xs">
                    <i class="ri-quill-pen-line text-vermilion"></i>
                    <span>${cat}</span>
                  </span>
                  <span class="text-hairline">•</span>
                  <span class="flex items-center space-x-1">
                    <i class="ri-time-line text-muted"></i>
                    <span>${readTime}</span>
                  </span>
                  ${citationsCount > 0 ? `
                    <span class="text-hairline">•</span>
                    <span class="flex items-center space-x-1 text-vermilion/90 font-medium">
                      <i class="ri-book-mark-line"></i>
                      <span>${citationsLabel}</span>
                    </span>
                  ` : ''}
                </div>

                <h3 class="font-serif-editorial text-2xl sm:text-3xl font-medium text-charcoal group-hover:text-vermilion transition-colors leading-[1.38] mb-3.5">
                  <a href="article.html?id=${art.id || art.slug}">
                    <span>${title}</span>
                  </a>
                </h3>

                <p class="text-muted text-xs sm:text-sm leading-[2.1] font-sans-ui mb-6">
                  ${excerpt}
                </p>
              </div>

              <div class="pt-4 border-t border-hairline flex flex-wrap items-center justify-between gap-2.5 text-xs font-sans-ui">
                <span class="text-faint flex items-center space-x-1.5">
                  <i class="ri-calendar-line"></i>
                  <span>${art.date || '2026-02-14'}</span>
                </span>
                <div class="flex flex-wrap items-center gap-2">
                  ${art.pdf_file ? `
                    <a href="${art.pdf_file.startsWith('downloads/') ? art.pdf_file : 'downloads/' + art.pdf_file}" download class="btn-3d-tactile px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-900/60 flex items-center space-x-1 transition-all shadow-2xs" title="Download Full Version PDF">
                      <i class="ri-file-pdf-line text-red-500"></i>
                      <span>PDF</span>
                    </a>
                  ` : ''}
                  <button type="button" class="btn-3d-tactile article-card-lang-toggle-btn px-2.5 py-1.5 rounded-xl border border-hairline bg-cream hover:bg-taupe-light dark:bg-zinc-800 text-charcoal font-medium text-xs flex items-center space-x-1 cursor-pointer transition-all shadow-2xs" data-article-id="${art.id || art.slug}" data-showing-original="${lang === 'mm' ? 'true' : 'false'}" title="${lang === 'mm' ? 'အင်္ဂလိပ်ဘာသာပြန်ချက် ကြည့်ရန်' : 'မူရင်းမြန်မာဘာသာဖြင့် ကြည့်ရန် (View Original Burmese)'}">
                    <span class="lang-toggle-flag text-xs">${lang === 'mm' ? '🌐' : '🇲🇲'}</span>
                    <span class="lang-toggle-label text-[11px] font-sans-ui">${lang === 'mm' ? 'English' : 'Original (MM)'}</span>
                  </button>
                  <a href="article.html?id=${art.id || art.slug}" class="btn-3d-tactile px-3.5 py-1.5 rounded-xl bg-vermilion text-white font-semibold flex items-center space-x-1.5 hover:bg-vermilion-dark transition-all shadow-xs group-hover:translate-x-0.5" title="${lang === 'mm' ? 'ဆောင်းပါး အပြည့်အစုံ ဖတ်ရှုရန်' : 'Read Full Article'}">
                    <i class="ri-book-open-line text-xs"></i>
                    <span>${lang === 'mm' ? 'ဆောင်းပါး ဖတ်ရန်' : 'Read Article'}</span>
                  </a>
                </div>
              </div>
            </article>
          `;
        }).join('');

        init3DTiltAndFloatingEffects();
      }

      renderFeatured();
      window.addEventListener('langchange', renderFeatured);

      // Inline card language toggle handler on index featured essays
      container.addEventListener('click', (e) => {
        const btn = e.target.closest('.article-card-lang-toggle-btn');
        if (!btn) return;
        e.preventDefault();
        const articleId = btn.getAttribute('data-article-id');
        const article = articles.find(a => (a.id === articleId || a.slug === articleId));
        if (!article) return;
        const card = btn.closest('article');
        if (!card) return;

        const isShowingOriginal = btn.getAttribute('data-showing-original') === 'true';
        const siteLang = window.I18n ? window.I18n.getLang() : 'mm';
        const willShowOriginal = !isShowingOriginal;

        btn.setAttribute('data-showing-original', willShowOriginal ? 'true' : 'false');
        const flagEl = btn.querySelector('.lang-toggle-flag') || btn.querySelector('span:first-child');
        const labelEl = btn.querySelector('.lang-toggle-label');

        if (siteLang !== 'mm') {
          if (willShowOriginal) {
            if (flagEl) flagEl.textContent = '🌐';
            if (labelEl) labelEl.textContent = siteLang.toUpperCase();
            btn.title = `Switch back to ${siteLang.toUpperCase()} translation`;
          } else {
            if (flagEl) flagEl.textContent = '🇲🇲';
            if (labelEl) labelEl.textContent = 'Original (MM)';
            btn.title = 'View Original Burmese (မူရင်းမြန်မာဘာသာဖြင့် ကြည့်ရန်)';
          }
        } else {
          if (willShowOriginal) {
            if (flagEl) flagEl.textContent = '🌐';
            if (labelEl) labelEl.textContent = 'English';
            btn.title = 'View English translation';
          } else {
            if (flagEl) flagEl.textContent = '🇲🇲';
            if (labelEl) labelEl.textContent = 'Original (MM)';
            btn.title = 'မူရင်းမြန်မာစာမူသို့ ပြန်သွားရန်';
          }
        }

        const titleSpan = card.querySelector('h3 a span');
        if (titleSpan) {
          titleSpan.textContent = willShowOriginal ? (article.title_mm || article.title_en) : (article.title_en || article.title_mm);
        }
        const excerptP = card.querySelector('p.text-muted');
        if (excerptP) {
          excerptP.textContent = willShowOriginal ? (article.excerpt_mm || article.excerpt_en) : (article.excerpt_en || article.excerpt_mm);
        }

        if (window.HtetUI && typeof window.HtetUI.showToast === 'function') {
          window.HtetUI.showToast(willShowOriginal 
            ? 'မူရင်းမြန်မာဘာသာ စာမူသို့ ပြောင်းလဲပြသထားပါသည် ✓' 
            : 'ဘာသာပြန်ဆိုချက်သို့ ပြောင်းလဲပြသထားပါသည် ✓');
        }
      });
    } catch (err) {
      console.warn('[initFeaturedArticlesOnIndex] Failed to render featured essays:', err);
    }
  }

  // 19. Copy Bio Text Helper for Media Press Kit
  window.copyBioText = function(elementId, btn) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText || el.textContent;
    navigator.clipboard.writeText(text.trim()).then(() => {
      if (btn) {
        const origHTML = btn.innerHTML;
        btn.innerHTML = '<i class="ri-check-line text-emerald-500 text-sm"></i> <span class="text-emerald-600 dark:text-emerald-400 font-semibold">ကူးယူပြီးပါပြီ / Copied!</span>';
        setTimeout(() => { btn.innerHTML = origHTML; }, 2200);
      }
      showToast('Bio စာသားကို ကူးယူပြီးပါပြီ (Copied to clipboard)');
    }).catch(err => {
      console.warn('Clipboard write failed:', err);
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text.trim();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast('Bio စာသားကို ကူးယူပြီးပါပြီ (Copied to clipboard)');
    });
  };

  // 20. Interactive 3D Tilt, Floating Physics & Specular Glass Reflection Engine
  function init3DTiltAndFloatingEffects() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const cards = document.querySelectorAll(
      '.card-3d-interactive, .glass-3d-card, .card-hover-lift, .journal-card, .journal-compact-card, .milestone-stat-card, #daily-quote-card, .cert-card, .adjacent-article-card, .related-article-card'
    );

    cards.forEach(card => {
      if (card.dataset.tiltInitialized === 'true') return;
      card.dataset.tiltInitialized = 'true';

      let bounds = null;
      let rafId = null;

      function onMouseEnter(e) {
        bounds = card.getBoundingClientRect();
        card.style.transition = 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.12s ease';
      }

      function onMouseMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          // Calm, non-intrusive elevation that keeps text 100% stable and comfortable for reading
          card.style.transform = 'translateY(-2.5px)';

          const glareX = (mouseX / bounds.width) * 100;
          const glareY = (mouseY / bounds.height) * 100;
          card.style.setProperty('--glare-x', `${glareX.toFixed(1)}%`);
          card.style.setProperty('--glare-y', `${glareY.toFixed(1)}%`);
          card.style.setProperty('--glare-opacity', '0.65');
        });
      }

      function onMouseLeave() {
        if (rafId) cancelAnimationFrame(rafId);
        bounds = null;
        card.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'translateY(0px)';
        card.style.setProperty('--glare-opacity', '0');
      }

      card.addEventListener('mouseenter', onMouseEnter, { passive: true });
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initShareButtons();
    initAOS();
    initBackToTop();
    initHankoRipple();
    initQuoteSelectionPopover();
    initReadingListDrawer();
    initSpotlightSearch();
    initArticlesArchive();
    initJournalFeed();
    initGlossaryPage();
    initPublicationsPage();
    initDailyQuoteWidget();
    initContactForm();
    initDynamicMetrics();
    initFeaturedArticlesOnIndex();
    init3DTiltAndFloatingEffects();
  });

  window.HtetUI = {
    showToast,
    BookmarkSystem,
    initDynamicMetrics,
    initFeaturedArticlesOnIndex,
    init3DTiltAndFloatingEffects
  };
})();
