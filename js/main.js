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

  // 1. Mobile Menu Drawer (Toggleable on 1st & 2nd Tap)
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-menu-drawer');
    const overlay = document.getElementById('mobile-menu-overlay');
    const closeBtn = document.getElementById('mobile-menu-close');

    if (!drawer) return;

    function openMenu() {
      drawer.style.visibility = 'visible';
      drawer.style.transform = 'translateX(0)';
      drawer.style.webkitTransform = 'translateX(0)';
      drawer.style.pointerEvents = 'auto';
      drawer.classList.add('is-open');

      if (overlay) {
        overlay.classList.add('is-open');
        overlay.classList.remove('hidden');
        overlay.style.display = 'block';
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
      }
      document.body.classList.add('overflow-hidden');
      updateMenuButtonsState(true);
    }

    function closeMenu() {
      drawer.classList.remove('is-open');
      drawer.style.transform = 'translateX(-100%)';
      drawer.style.webkitTransform = 'translateX(-100%)';
      drawer.style.pointerEvents = 'none';

      if (overlay) {
        overlay.classList.remove('is-open');
        overlay.classList.add('opacity-0');
        setTimeout(() => {
          if (!drawer.classList.contains('is-open')) {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
          }
        }, 300);
      }
      document.body.classList.remove('overflow-hidden');
      setTimeout(() => {
        if (!drawer.classList.contains('is-open')) {
          drawer.style.visibility = 'hidden';
        }
      }, 300);
      updateMenuButtonsState(false);
    }

    function toggleMenu() {
      if (drawer.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    }

    function updateMenuButtonsState(isOpen) {
      // Bottom App Bar Menu Button: toggle icon & active highlight
      const bottomMenuBtn = document.getElementById('bottom-nav-menu-btn');
      if (bottomMenuBtn) {
        const icon = bottomMenuBtn.querySelector('i');
        const text = bottomMenuBtn.querySelector('span');
        if (icon) {
          icon.className = isOpen ? 'ri-close-line text-lg text-vermilion font-bold' : 'ri-menu-line text-lg';
        }
        if (text) {
          text.setAttribute('data-mm', isOpen ? 'ပိတ်ရန်' : 'မီနူး');
          text.textContent = isOpen ? 'ပိတ်ရန်' : 'မီနူး';
        }
        if (isOpen) {
          bottomMenuBtn.classList.add('text-vermilion', 'font-bold');
        } else {
          bottomMenuBtn.classList.remove('text-vermilion', 'font-bold');
        }
      }

      // Top Header Hamburger Toggle: toggle icon & active highlight
      if (toggleBtn) {
        const hIcon = toggleBtn.querySelector('i');
        if (hIcon) {
          hIcon.className = isOpen ? 'ri-close-line text-base text-vermilion font-bold' : 'ri-menu-3-line text-base';
        }
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (navigator.vibrate) try { navigator.vibrate(12); } catch(err) {}
        toggleMenu();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
      });
    }

    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    window.openMobileMenu = openMenu;
    window.closeMobileMenu = closeMenu;
    window.toggleMobileMenu = toggleMenu;
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

  // 4. Smart Combined Back-to-Top & Navigation Pill (with Dismiss 'X' & Restore Support)
  function initBackToTop() {
    // If on article.html or if companion already exists, avoid duplicate button overlap
    if (document.getElementById('floating-reading-companion') || 
        document.getElementById('back-to-top-progress-btn') || 
        window.location.pathname.includes('article.html')) {
      const existing = document.getElementById('smart-back-to-top') || document.getElementById('back-to-top');
      if (existing) existing.remove();
      return;
    }

    // Helper: get or create floating restore trigger icon
    function getOrCreateRestoreBtn() {
      let restoreBtn = document.getElementById('smart-scroll-restore-btn');
      if (!restoreBtn) {
        restoreBtn = document.createElement('button');
        restoreBtn.id = 'smart-scroll-restore-btn';
        restoreBtn.className = 'hidden fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-9 h-9 rounded-full bg-card/90 dark:bg-stone-900/90 border border-hairline/80 shadow-lg flex items-center justify-center text-muted hover:text-vermilion hover:scale-110 active:scale-95 transition-all text-sm cursor-pointer glass-3d-pill no-print';
        restoreBtn.title = 'All-in-One ပြန်ဖော်ရန် (Restore Navigation Hub)';
        restoreBtn.setAttribute('aria-label', 'Restore All-in-One Navigation Hub');
        restoreBtn.innerHTML = '<i class="ri-compass-3-line text-sm"></i>';
        document.body.appendChild(restoreBtn);

        restoreBtn.addEventListener('click', () => {
          localStorage.removeItem('htet_all_in_one_hidden');
          restoreBtn.classList.add('hidden');
          if (pill) {
            pill.classList.remove('all-in-one-dismissed');
            onScroll();
          }
          if (window.HtetUI && typeof window.HtetUI.showToast === 'function') {
            window.HtetUI.showToast('All-in-One Navigation Hub ပြန်လည်ဖော်ပြပြီးပါပြီ ✓');
          }
        });
      }
      return restoreBtn;
    }

    let pill = document.getElementById('smart-back-to-top') || document.getElementById('back-to-top');
    if (!pill) {
      pill = document.createElement('div');
      pill.id = 'smart-back-to-top';
      pill.className = 'smart-scroll-pill fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-center rounded-full p-1 transition-all duration-300 font-sans-ui no-print opacity-0 pointer-events-none translate-y-3';
      pill.setAttribute('role', 'toolbar');
      pill.setAttribute('aria-label', 'Smart Scroll Navigation');
      pill.innerHTML = `
        <!-- Dismiss / Hide 'X' Action (အမှားခြစ် ခလုတ်) -->
        <button id="smart-scroll-hide-btn" class="w-6 h-6 rounded-full flex items-center justify-center text-muted/60 hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer mb-0.5" title="All-in-One ခလုတ် ဖျောက်ထားရန် (Dismiss / Hide)" aria-label="Dismiss Navigation Hub">
          <i class="ri-close-line text-xs font-bold"></i>
        </button>

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
    const hideBtn = document.getElementById('smart-scroll-hide-btn');

    if (hideBtn) {
      hideBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        localStorage.setItem('htet_all_in_one_hidden', 'true');
        pill.classList.add('all-in-one-dismissed', 'opacity-0', 'pointer-events-none');
        if (flyout) {
          flyout.classList.add('hidden');
          flyout.classList.remove('is-open');
        }
        const restoreBtn = getOrCreateRestoreBtn();
        restoreBtn.classList.remove('hidden');
        if (window.HtetUI && typeof window.HtetUI.showToast === 'function') {
          window.HtetUI.showToast('All-in-One ခလုတ်ကို ဖျောက်ထားပါသည် (ပြန်ဖော်ရန် ညာဘက်အောက်ထောင့်ရှိ အိုင်ကွန်ကို နှိပ်ပါ)');
        }
      });
    }

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
      const isHiddenByUser = localStorage.getItem('htet_all_in_one_hidden') === 'true';
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const current = window.pageYOffset || window.scrollY;

      if (isHiddenByUser) {
        pill.classList.add('all-in-one-dismissed', 'opacity-0', 'pointer-events-none');
        const restoreBtn = getOrCreateRestoreBtn();
        if (current > 120) {
          restoreBtn.classList.remove('hidden');
        } else {
          restoreBtn.classList.add('hidden');
        }
        return;
      } else {
        const restoreBtn = document.getElementById('smart-scroll-restore-btn');
        if (restoreBtn) restoreBtn.classList.add('hidden');
      }

      if (current > 120) {
        pill.classList.add('visible');
        pill.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-3', 'all-in-one-dismissed');
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

  // Mobile App Bottom Navigation Bar & Tactile Controls
  function initAppBottomNav() {
    let nav = document.getElementById('app-bottom-nav');
    const isNew = !nav;
    if (isNew) {
      nav = document.createElement('nav');
      nav.id = 'app-bottom-nav';
    }
    if (isNew || !nav.children.length) {
      nav.className = 'sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 dark:bg-[#121110]/95 backdrop-blur-xl border-t border-hairline/80 px-1 py-1 flex items-center justify-around font-sans-ui no-print select-none shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]';
      nav.setAttribute('aria-label', 'Mobile Bottom Navigation');

      const path = (window.location.pathname || '').toLowerCase();
      const isHome = path.endsWith('index.html') || path.endsWith('/') || path === '' || (!path.includes('.html') && !path.includes('/'));
      const isArticles = path.includes('article') && !isHome;
      const isPublications = path.includes('publication');
      const isJournal = path.includes('journal');

      nav.innerHTML = `
        <a href="index.html" class="app-tab-btn flex flex-col items-center justify-center py-1 px-2 ${isHome ? 'text-vermilion font-bold active-tab' : 'text-muted hover:text-vermilion'} transition-all active:scale-95" data-nav="home">
          <i class="${isHome ? 'ri-home-5-fill' : 'ri-home-5-line'} text-lg"></i>
          <span class="text-[10px] mt-0.5 tracking-tight" data-mm="ပင်မ" data-en="Home">ပင်မ</span>
          ${isHome ? '<span class="w-1 h-1 rounded-full bg-vermilion mt-0.5"></span>' : ''}
        </a>
        <a href="articles.html" class="app-tab-btn flex flex-col items-center justify-center py-1 px-2 ${isArticles ? 'text-vermilion font-bold active-tab' : 'text-muted hover:text-vermilion'} transition-all active:scale-95" data-nav="articles">
          <i class="${isArticles ? 'ri-book-open-fill' : 'ri-book-open-line'} text-lg"></i>
          <span class="text-[10px] mt-0.5 tracking-tight" data-mm="ဆောင်းပါး" data-en="Articles">ဆောင်းပါး</span>
          ${isArticles ? '<span class="w-1 h-1 rounded-full bg-vermilion mt-0.5"></span>' : ''}
        </a>
        <a href="publications.html" class="app-tab-btn flex flex-col items-center justify-center py-1 px-2 ${isPublications ? 'text-vermilion font-bold active-tab' : 'text-muted hover:text-vermilion'} transition-all active:scale-95" data-nav="publications">
          <i class="${isPublications ? 'ri-file-paper-2-fill' : 'ri-file-paper-2-line'} text-lg"></i>
          <span class="text-[10px] mt-0.5 tracking-tight" data-mm="စာစောင်များ" data-en="Publications">စာစောင်များ</span>
          ${isPublications ? '<span class="w-1 h-1 rounded-full bg-vermilion mt-0.5"></span>' : ''}
        </a>
        <a href="journal.html" class="app-tab-btn flex flex-col items-center justify-center py-1 px-2 ${isJournal ? 'text-vermilion font-bold active-tab' : 'text-muted hover:text-vermilion'} transition-all active:scale-95" data-nav="journal">
          <i class="${isJournal ? 'ri-quill-pen-fill' : 'ri-quill-pen-line'} text-lg"></i>
          <span class="text-[10px] mt-0.5 tracking-tight" data-mm="ဂျာနယ်" data-en="Journal">ဂျာနယ်</span>
          ${isJournal ? '<span class="w-1 h-1 rounded-full bg-vermilion mt-0.5"></span>' : ''}
        </a>
        <button type="button" id="bottom-nav-theme-btn" class="app-tab-btn flex flex-col items-center justify-center py-1 px-2 text-muted hover:text-vermilion transition-all active:scale-95 cursor-pointer relative" data-nav="theme" title="Themes / ရောင်စဉ်">
          <div class="relative">
            <i class="ri-palette-line text-lg"></i>
            <span class="absolute -top-0.5 -right-1 w-1.5 h-1.5 rounded-full theme-active-dot ring-1 ring-white/60"></span>
          </div>
          <span class="text-[10px] mt-0.5 tracking-tight" data-mm="ရောင်စဉ်" data-en="Theme">ရောင်စဉ်</span>
        </button>
      `;
      if (isNew) {
        document.body.appendChild(nav);
      }

      document.body.classList.add('has-bottom-nav');

      const themeBtn = document.getElementById('bottom-nav-theme-btn');
      if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          if (navigator.vibrate) try { navigator.vibrate(15); } catch(e) {}
          if (window.Theme && window.Theme.openThemeModal) {
            window.Theme.openThemeModal();
          } else if (window.Theme && window.Theme.cycleTheme) {
            window.Theme.cycleTheme();
          }
        });
      }

      // Smooth scroll to top when tapping the already active tab
      nav.querySelectorAll('a.app-tab-btn').forEach(tab => {
        tab.addEventListener('click', (e) => {
          if (tab.classList.contains('active-tab')) {
            e.preventDefault();
            if (navigator.vibrate) try { navigator.vibrate(10); } catch(err) {}
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      });

      // Live synchronize active dot on bottom nav theme button
      const syncBottomThemeDot = () => {
        const dot = nav.querySelector('.theme-active-dot');
        if (dot && window.Theme) {
          const current = document.documentElement.getAttribute('data-theme') || 'light';
          const meta = (window.Theme.THEME_METADATA && window.Theme.THEME_METADATA[current]) ? window.Theme.THEME_METADATA[current] : null;
          if (meta) {
            dot.style.backgroundColor = meta.accent;
            dot.style.boxShadow = `0 0 8px ${meta.accent}`;
          }
        }
      };
      syncBottomThemeDot();
      window.addEventListener('themechange', syncBottomThemeDot);
    }
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
        let rawQuery = e.target.value.trim();
        if (!rawQuery) {
          resultsContainer.innerHTML = `
            <div class="py-12 text-center text-muted text-xs">
              <i class="ri-compass-3-line text-3xl text-faint mb-2 block"></i>
              <span>Type keyword to search across essays, glossary, and journal updates.</span>
            </div>
          `;
          return;
        }

        if (window.BurmeseNLP) {
          rawQuery = window.BurmeseNLP.toUnicode(rawQuery);
        }
        const query = rawQuery.toLowerCase();

        const lang = window.I18n ? window.I18n.getLang() : 'mm';
        const articles = (await window.HtetData.getArticles()) || [];
        const glossary = (await window.HtetData.getGlossary()) || [];
        const posts = (await window.HtetData.getPosts()) || [];

        // Match Dictionary
        const matchedDict = [];
        if (query.length >= 2) {
          matchedDict.push({
            type: 'Dictionary',
            title: `အဘိဓာန်တွင် "${rawQuery}" ရှာဖွေဖတ်ရှုရန်`,
            subtitle: `Ornagai & BurmeseNLP Dual Dictionary Lookup`,
            url: `dictionary.html?q=${encodeURIComponent(rawQuery)}`,
            icon: 'ri-book-2-line'
          });
        }

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

        const combined = [...matchedArticles, ...matchedGlossary, ...matchedPosts, ...matchedDict];

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

  // 10. Intelligent Global Article & Page Share Engine
  window.HtetShare = {
    getShareData: function() {
      var baseUrl = 'https://htetofficial.github.io';
      var currentHref = window.location.href;
      var cleanUrl = currentHref;
      var title = document.title;
      var excerpt = '';
      var author = 'ထက်မြတ်ဧကရီ';

      // 1. If inside Reader, get rich article metadata
      if (window.Reader && window.Reader.articleData) {
        var a = window.Reader.articleData;
        var slug = a.id || a.slug;
        cleanUrl = baseUrl + '/article.html?id=' + encodeURIComponent(slug);
        title = a.title_mm || a.title_en || title;
        excerpt = a.excerpt_mm || a.excerpt_en || '';
        author = a.author_mm || a.author || author;
      } else {
        var p = new URLSearchParams(window.location.search);
        var id = p.get('id') || p.get('slug');
        if (id) {
          cleanUrl = baseUrl + '/article.html?id=' + encodeURIComponent(id);
        } else {
          var m = window.location.pathname.match(/\/articles\/([^\/\.]+)(?:\.html)?/i) ||
                  window.location.pathname.match(/\/([^\/\.]+)\.html$/i);
          if (m && m[1] && m[1] !== 'article' && m[1] !== 'articles' && m[1] !== 'index') {
            cleanUrl = baseUrl + '/article.html?id=' + encodeURIComponent(m[1]);
          }
        }
      }

      // Telegram Instant View URL
      var ivUrl = 'https://t.me/iv?url=' + encodeURIComponent(cleanUrl) + '&rhash=c3ae18b005432f';

      return {
        url: cleanUrl,
        ivUrl: ivUrl,
        title: title,
        excerpt: excerpt,
        author: author
      };
    },

    shareTelegramIV: function() {
      var d = this.getShareData();
      var text = '📖 ' + d.title;
      if (d.excerpt) text += '\n\n❝ ' + d.excerpt + ' ❞';
      text += '\n\n✍️ ' + d.author + '\n⚡ Telegram Instant View ဖြင့် ဖတ်ရှုရန် -';

      var shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(d.ivUrl) + '&text=' + encodeURIComponent(text);
      if (window.TelegramMiniApp && window.TelegramMiniApp.openLink) {
        window.TelegramMiniApp.openLink(shareUrl);
      } else {
        window.open(shareUrl, '_blank');
      }
    },

    shareTelegram: function() {
      var d = this.getShareData();
      var text = '📖 ' + d.title;
      if (d.excerpt) text += '\n\n❝ ' + d.excerpt + ' ❞';
      text += '\n\n✍️ ' + d.author;

      var shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(d.url) + '&text=' + encodeURIComponent(text);
      if (window.TelegramMiniApp && window.TelegramMiniApp.openLink) {
        window.TelegramMiniApp.openLink(shareUrl);
      } else {
        window.open(shareUrl, '_blank');
      }
    },

    shareFacebook: function() {
      var d = this.getShareData();
      var shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(d.url);
      window.open(shareUrl, '_blank');
    },

    copyLink: function() {
      var d = this.getShareData();
      var msg = 'ဆောင်းပါးလင့်ခ် ကူးယူပြီးပါပြီ။';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(d.url).then(function() {
          showToast(msg);
        }).catch(function() {
          showToast('ဆောင်းပါးလင့်ခ်: ' + d.url);
        });
      } else {
        showToast(msg);
      }
    },

    shareNative: function() {
      var d = this.getShareData();
      if (navigator.share) {
        navigator.share({
          title: d.title,
          text: d.excerpt ? ('❝ ' + d.excerpt + ' ❞ — ' + d.author) : d.title,
          url: d.url
        }).catch(function() {});
      } else {
        this.copyLink();
      }
    }
  };

  // 10. Global Share Buttons with Rich Remix Icons
  function initShareButtons() {
    document.addEventListener('click', (e) => {
      const copyBtn = e.target.closest('[data-share="copy"]');
      if (copyBtn) {
        e.preventDefault();
        window.HtetShare.copyLink();
      }

      const teleBtn = e.target.closest('[data-share="telegram"]');
      if (teleBtn) {
        e.preventDefault();
        window.HtetShare.shareTelegram();
      }

      const fbBtn = e.target.closest('[data-share="facebook"]');
      if (fbBtn) {
        e.preventDefault();
        window.HtetShare.shareFacebook();
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

  // 11. Articles Archive Studio v2 — 100% Dynamic Primary Categories, Multi-Select (OR/AND), 4 View Modes, 5 Sort Orders & Full Uncropped Covers
  async function initArticlesArchive() {
    const listContainer = document.getElementById("articles-archive-list");
    if (!listContainer || !window.HtetData) return;

    const searchInput = document.getElementById("articles-search");
    const searchClearBtn = document.getElementById("articles-search-clear");
    const categoryFilterContainer = document.getElementById("articles-category-filter");
    const countBadge = document.getElementById("articles-count-badge");
    const totalBadge = document.getElementById("articles-total-badge");
    const primaryCountBadge = document.getElementById("articles-primary-count-badge");
    const subcatTotalPill = document.getElementById("articles-subcat-total-pill");
    const sortSelect = document.getElementById("articles-sort");
    const activeFiltersBar = document.getElementById("articles-active-filters");
    const resetFiltersBtn = document.getElementById("articles-reset-filters");
    const liveStatusEl = document.getElementById("articles-live-status");

    // Primary Categories Directory Controls
    const primaryCatContainer = document.getElementById("articles-primary-categories");
    const primaryResetBtn = document.getElementById("articles-primary-reset");

    // 4-Mode View Switcher & Multi-Select Controls
    const viewSwitcher = document.getElementById("articles-view-switcher");
    const matchModeBtns = document.querySelectorAll("[data-match-mode]");
    const scrollLeftBtn = document.getElementById("articles-scroll-left");
    const scrollRightBtn = document.getElementById("articles-scroll-right");
    const toggleExpandBtn = document.getElementById("articles-toggle-expand");
    const drawerContainer = document.getElementById("articles-category-drawer");
    const drawerPillsContainer = document.getElementById("articles-drawer-pills");
    const drawerClearBtn = document.getElementById("articles-drawer-clear-btn");
    const catSearchInput = document.getElementById("articles-cat-search");
    const multiCountBadge = document.getElementById("articles-multi-count-badge");
    const activeTagsList = document.getElementById("articles-active-tags-list");

    // Native <dialog> Full-Image Lightbox Elements
    const lightboxDialog = document.getElementById("article-image-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxTitle = document.getElementById("lightbox-caption-title");
    const lightboxMeta = document.getElementById("lightbox-meta");
    const lightboxArticleLink = document.getElementById("lightbox-article-link");
    const lightboxCloseBtn = document.getElementById("lightbox-close-btn");

    const escHtml = (str) => String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    // Load Articles Dynamically from JSON / JS Backup
    const articles = await window.HtetData.getArticles();

    // Sync Mobile Drawer Dynamic Counters (Zero Hardcoded Counts)
    (async () => {
      try {
        const setDynCount = (key, val) => {
          document.querySelectorAll(`[data-dynamic-count="${key}"]`).forEach(el => {
            el.textContent = val;
          });
        };
        setDynCount("articles", articles.length);
        if (typeof window.HtetData.getPublications === "function") {
          const pubs = await window.HtetData.getPublications();
          setDynCount("publications", pubs.length);
        }
        if (typeof window.HtetData.getPosts === "function") {
          const posts = await window.HtetData.getPosts();
          setDynCount("posts", posts.length);
        }
        if (typeof window.HtetData.getGlossary === "function") {
          const glossary = await window.HtetData.getGlossary();
          setDynCount("glossary", glossary.length);
        }
      } catch (_) {}
    })();

    // Dynamic Primary Category Taxonomy (Auto-computed from JSON fields; auto-adds unknown buckets)
    const PRIMARY_TAXONOMY = [
      {
        id: "political-philosophy",
        icon: "ri-scales-3-line",
        labels: {
          mm: "နိုင်ငံရေးဒဿနနှင့် မူဝါဒ",
          en: "Political Philosophy & Policy",
          zh: "政治哲学与政策",
          th: "ปรัชญาการเมืองและนโยบาย",
          ja: "政治哲学・政策"
        },
        match: (hay) => /နိုင်ငံရေး|ပထဝီ|တော်လှန်ရေး|ဖက်ဒရယ်|အာဏာ|လူ့ဘောင်သစ်|politic|geopolitic|federal|commufemocrat|revolutionary|sovereignty|election|jinggangshan|systemicfear|tightrope/.test(hay)
      },
      {
        id: "feminism-gender",
        icon: "ri-women-line",
        labels: {
          mm: "ဖီမင်နစ်ဇင်နှင့် ကျားမတရားမျှတမှု",
          en: "Feminism & Gender Justice",
          zh: "女性主义与性别正义",
          th: "สตรีนิยมและความยุติธรรมทางเพศ",
          ja: "フェミニズム・ジェンダー正義"
        },
        match: (hay) => /ဖီမင်|ဖီမီနစ်|ကျား|ဂျန်ဒါ|အမျိုးသမီး|trans|lgbtq|gender|feminis|cisgender|womanhood|bodily|rape|consent|apartheid|clothing/.test(hay)
      },
      {
        id: "historical-archives",
        icon: "ri-quill-pen-line",
        labels: {
          mm: "သမိုင်းဝင်မော်ကွန်းနှင့် ဘာသာပြန်",
          en: "Historical Archives & Translations",
          zh: "历史文献与经典译作",
          th: "เอกสารประวัติศาสตร์และงานแปล",
          ja: "歴史アーカイブ・翻訳"
        },
        match: (hay, art) => art.category === "historical-archive" || /သမိုင်း|မော်ကွန်း|ဘာသာပြန်|နိုဘယ်|မင်ဒဲလား|အောင်ဆန်း|ပရီဒီ|ဟယ်လင်|historical|archive|nobel|mandela|suu kyi|aung san|pridi|thammasat|sakharov|translation|keller/.test(hay)
      },
      {
        id: "human-rights-society",
        icon: "ri-shield-star-line",
        labels: {
          mm: "လူ့အခွင့်အရေးနှင့် လူမှုဝေဖန်ရေး",
          en: "Human Rights & Social Critique",
          zh: "人权与社会批判",
          th: "สิทธิมนุษยชนและสังคมวิจารณ์",
          ja: "人権・社会批評"
        },
        match: (hay) => /လူ့အခွင့်အရေး|တရားမျှတ|လူမှု|ယဉ်ကျေးမှု|မီဒီယာ|ကလေးသူငယ်|မျိုးဆက်|human rights|social|justice|dignity|equality|grooming|culture|critic|dream/.test(hay)
      },
      {
        id: "education-youth-science",
        icon: "ri-graduation-cap-line",
        labels: {
          mm: "ပညာရေး၊ သိပ္ပံနှင့် လူငယ်",
          en: "Education, Science & Youth",
          zh: "教育、科学与青年",
          th: "การศึกษา วิทยาศาสตร์ และเยาวชน",
          ja: "教育・科学・ユース"
        },
        match: (hay) => /ပညာရေး|လူငယ်|သိပ္ပံ|ကျန်းမာရေး|ဒစ်ဂျစ်တယ်|ငလျင်|အလုပ်သမား|education|youth|science|neuroscience|puberty|digital|skills|earthquake|labor|pedagogy|cdm/.test(hay)
      },
      {
        id: "identity-existential",
        icon: "ri-sparkling-2-line",
        labels: {
          mm: "ဖြစ်တည်မှုဒဿနနှင့် ကိုယ်ပိုင်လက္ခဏာ",
          en: "Identity & Existential Philosophy",
          zh: "身份认同与存在哲学",
          th: "อัตลักษณ์และปรัชญาการดำรงอยู่",
          ja: "アイデンティティ・実存哲学"
        },
        match: (hay) => /ဖြစ်တည်မှု|ကိုယ်ပိုင်လက္ခဏာ|စိတ်ပညာ|ရသ|ကိုယ်တွေ့|identity|existential|authenticity|phoenix|slow walkers|rules|fear|courage|confession/.test(hay)
      }
    ];

    function getArticlePrimaryIds(art) {
      if (Array.isArray(art.primary_categories) && art.primary_categories.length > 0) {
        return art.primary_categories;
      }
      if (art.primary_category) {
        return [art.primary_category];
      }
      const hay = [
        art.category, art.category_mm, art.category_en,
        ...(art.categories_mm || []), ...(art.categories_en || []),
        ...(art.tags || []), art.title_mm, art.title_en
      ].filter(Boolean).join(" ").toLowerCase();

      const matched = [];
      PRIMARY_TAXONOMY.forEach(group => {
        if (group.match(hay, art)) matched.push(group.id);
      });
      if (matched.length === 0) {
        matched.push("general-archive");
      }
      return matched;
    }

    function computePrimaryGroups() {
      const counts = new Map();
      const customMeta = new Map();

      articles.forEach(art => {
        const ids = getArticlePrimaryIds(art);
        ids.forEach(id => {
          counts.set(id, (counts.get(id) || 0) + 1);
          if (!PRIMARY_TAXONOMY.some(t => t.id === id) && !customMeta.has(id)) {
            customMeta.set(id, {
              id,
              icon: "ri-bookmark-2-line",
              labels: {
                mm: art.category_mm || id,
                en: art.category_en || id,
                zh: art.category_en || id,
                th: art.category_en || id,
                ja: art.category_en || id
              }
            });
          }
        });
      });

      const list = [];
      PRIMARY_TAXONOMY.forEach(group => {
        const c = counts.get(group.id) || 0;
        if (c > 0) list.push({ ...group, count: c });
      });
      customMeta.forEach((meta, id) => {
        const c = counts.get(id) || 0;
        if (c > 0) list.push({ ...meta, count: c });
      });

      list.sort((a, b) => b.count - a.count);
      return list;
    }

    function getLocalizedLabel(labels, lang) {
      return labels[lang] || labels.en || labels.mm || "";
    }

    function parseReadMinutes(art) {
      const raw = String(art.reading_time || art.read_time_en || "");
      const m = raw.match(/(\d+)/);
      if (m) return parseInt(m[1], 10);
      const len = (art.content_mm || art.content_en || "").length;
      return Math.max(1, Math.round(len / 900));
    }

    function getPopularityScore(art) {
      const views = Number(art.views) || 0;
      const shares = Number(art.shares) || 0;
      const cites = Array.isArray(art.citations) ? art.citations.length : 0;
      return views + (shares * 3) + (cites * 25);
    }

    // State Initialization (with URL + localStorage persistence)
    const urlParams = new URLSearchParams(window.location.search);
    const validViews = ["editorial", "grid", "magazine", "compact"];
    const validSorts = ["newest", "oldest", "popular", "longest", "title_az"];

    let selectedPrimaryCategories = new Set();
    let selectedCategories = new Set();
    let searchQuery = urlParams.get("q") || "";
    let catSearchQuery = "";
    let matchMode = (urlParams.get("mode") === "and") ? "and" : "or";

    let savedView = "editorial";
    try { savedView = localStorage.getItem("htet_articles_view") || "editorial"; } catch (_) {}
    let currentView = validViews.includes(urlParams.get("view")) ? urlParams.get("view")
      : (validViews.includes(savedView) ? savedView : "editorial");

    let currentSort = validSorts.includes(urlParams.get("sort")) ? urlParams.get("sort") : "newest";

    const initialPrimary = urlParams.get("primary");
    if (initialPrimary && initialPrimary !== "all") {
      initialPrimary.split(",").map(c => c.trim()).filter(Boolean).forEach(c => selectedPrimaryCategories.add(c));
    }
    const initialCategory = urlParams.get("category") || urlParams.get("categories");
    if (initialCategory && initialCategory !== "all") {
      initialCategory.split(",").map(c => c.trim()).filter(Boolean).forEach(c => selectedCategories.add(c));
    }

    if (searchInput && searchQuery) {
      searchInput.value = searchQuery;
      if (searchClearBtn) searchClearBtn.classList.remove("hidden");
    }
    if (sortSelect) sortSelect.value = currentSort;
    if (totalBadge) totalBadge.textContent = articles.length;

    // Sync view mode buttons & attribute
    function applyViewMode(mode, persist = true) {
      if (!validViews.includes(mode)) mode = "editorial";
      currentView = mode;
      listContainer.setAttribute("data-view", currentView);
      if (viewSwitcher) {
        viewSwitcher.querySelectorAll("[data-view-mode]").forEach(btn => {
          const isMatch = btn.getAttribute("data-view-mode") === currentView;
          btn.classList.toggle("active", isMatch);
          btn.setAttribute("aria-pressed", isMatch ? "true" : "false");
        });
      }
      if (persist) {
        try { localStorage.setItem("htet_articles_view", currentView); } catch (_) {}
      }
    }

    function applyMatchMode(mode) {
      matchMode = (mode === "and") ? "and" : "or";
      matchModeBtns.forEach(btn => {
        const isMatch = btn.getAttribute("data-match-mode") === matchMode;
        btn.classList.toggle("active", isMatch);
        btn.setAttribute("aria-pressed", isMatch ? "true" : "false");
      });
    }

    // Render Primary Categories Overview Cards (100% Dynamic)
    function renderPrimaryCategories() {
      if (!primaryCatContainer) return;
      const lang = window.I18n ? window.I18n.getLang() : "mm";
      const groups = computePrimaryGroups();
      if (primaryCountBadge) primaryCountBadge.textContent = groups.length;

      const isAllPrimary = selectedPrimaryCategories.size === 0;
      if (primaryResetBtn) {
        primaryResetBtn.classList.toggle("hidden", isAllPrimary);
      }

      const allLabel = {
        mm: "အားလုံး (All)",
        en: "All Themes",
        zh: "全部分类",
        th: "ทุกหมวดหมู่",
        ja: "すべての分野"
      }[lang] || "All Themes";

      const allCard = `
        <button type="button" data-primary-cat="all" aria-pressed="${isAllPrimary ? "true" : "false"}" class="primary-cat-card ${isAllPrimary ? "active" : ""}">
          <span class="flex items-center space-x-2 min-w-0">
            <span class="primary-cat-icon"><i class="ri-apps-2-line" aria-hidden="true"></i></span>
            <span class="text-xs font-semibold leading-snug line-clamp-2">${escHtml(allLabel)}</span>
          </span>
          <span class="primary-cat-count">${articles.length}</span>
        </button>
      `;

      const groupCards = groups.map(g => {
        const isActive = selectedPrimaryCategories.has(g.id);
        const label = getLocalizedLabel(g.labels, lang);
        return `
          <button type="button" data-primary-cat="${escHtml(g.id)}" aria-pressed="${isActive ? "true" : "false"}" class="primary-cat-card ${isActive ? "active" : ""}">
            <span class="flex items-center space-x-2 min-w-0">
              <span class="primary-cat-icon"><i class="${g.icon}" aria-hidden="true"></i></span>
              <span class="text-xs font-semibold leading-snug line-clamp-2">${escHtml(label)}</span>
            </span>
            <span class="flex items-center gap-1 shrink-0">
              ${isActive ? `<i class="ri-check-line text-xs" aria-hidden="true"></i>` : ""}
              <span class="primary-cat-count">${g.count}</span>
            </span>
          </button>
        `;
      }).join("");

      primaryCatContainer.innerHTML = allCard + groupCards;
    }

    // Build Dynamic Sub-Category Pills sorted by frequency (Compact track + Searchable Drawer)
    function renderCategoryPills() {
      if (!categoryFilterContainer) return;
      const lang = window.I18n ? window.I18n.getLang() : "mm";

      const counts = { "all": articles.length };
      const categoryMap = new Map();

      articles.forEach(art => {
        const catsMM = art.categories_mm || (art.category_mm ? [art.category_mm] : []);
        const catsEN = art.categories_en || (art.category_en ? [art.category_en] : []);

        catsMM.forEach((catMM, idx) => {
          const catEN = catsEN[idx] || catMM;
          const key = (lang === "mm") ? catMM : catEN;
          counts[key] = (counts[key] || 0) + 1;
          if (!categoryMap.has(key)) {
            categoryMap.set(key, { mm: catMM, en: catEN, key });
          }
        });
      });

      // Sort categories by frequency descending, then alphabetically
      const sortedCats = Array.from(categoryMap.values()).sort((a, b) => {
        const diff = (counts[b.key] || 0) - (counts[a.key] || 0);
        if (diff !== 0) return diff;
        return a.key.localeCompare(b.key);
      });

      if (subcatTotalPill) subcatTotalPill.textContent = sortedCats.length;

      const isAllActive = (selectedCategories.size === 0);

      function createPill(catKey, label, count, isActive, isAll = false) {
        const dotClass = isAll ? "" : getCategoryDotClass(catKey);
        return `
          <button type="button" data-category="${escHtml(catKey)}" aria-pressed="${isActive ? "true" : "false"}" class="category-pill ${isActive ? "active" : ""}">
            ${isAll
              ? `<i class="ri-apps-2-line ${isActive ? "text-white" : "text-vermilion"}" aria-hidden="true"></i>`
              : `<span class="category-color-dot ${dotClass}" aria-hidden="true"></span>`
            }
            <span>${escHtml(label)}</span>
            <span class="category-pill-count">${count}</span>
            ${(!isAll && isActive) ? `<i class="ri-check-line text-[11px] ml-0.5" aria-hidden="true"></i>` : ""}
          </button>
        `;
      }

      const allPillHtml = createPill(
        "all",
        lang === "mm" ? "အားလုံး" : "All Sub-Categories",
        counts["all"],
        isAllActive,
        true
      );

      const trackPillsHtml = sortedCats.map(cat => {
        const count = counts[cat.key] || 0;
        const isActive = selectedCategories.has(cat.key) || selectedCategories.has(cat.mm) || selectedCategories.has(cat.en);
        return createPill(cat.key, cat.key, count, isActive, false);
      }).join("");

      categoryFilterContainer.innerHTML = allPillHtml + trackPillsHtml;

      if (drawerPillsContainer) {
        const q = catSearchQuery.trim().toLowerCase();
        const drawerCats = q
          ? sortedCats.filter(c => c.key.toLowerCase().includes(q) || c.mm.toLowerCase().includes(q) || c.en.toLowerCase().includes(q))
          : sortedCats;

        if (drawerCats.length === 0) {
          drawerPillsContainer.innerHTML = `<p class="text-xs text-muted py-2 m-0">${lang === "mm" ? "ကိုက်ညီသော ကဏ္ဍအမည် မတွေ့ပါ။" : "No matching categories found."}</p>`;
        } else {
          const drawerHtml = drawerCats.map(cat => {
            const count = counts[cat.key] || 0;
            const isActive = selectedCategories.has(cat.key) || selectedCategories.has(cat.mm) || selectedCategories.has(cat.en);
            return createPill(cat.key, cat.key, count, isActive, false);
          }).join("");
          drawerPillsContainer.innerHTML = (q ? "" : allPillHtml) + drawerHtml;
        }
      }

      const totalSelectedCount = selectedPrimaryCategories.size + selectedCategories.size;
      if (multiCountBadge) {
        if (totalSelectedCount > 0) {
          multiCountBadge.classList.remove("hidden");
          multiCountBadge.textContent = `${totalSelectedCount} ${lang === "mm" ? "ခု ရွေးထားသည်" : "selected"}`;
        } else {
          multiCountBadge.classList.add("hidden");
          multiCountBadge.textContent = "";
        }
      }
    }

    // Open Native <dialog> Full-Image Lightbox
    function openLightbox(imgSrc, titleText, metaText, articleUrl) {
      if (!lightboxDialog || !lightboxImg) return;
      lightboxImg.src = imgSrc;
      lightboxImg.alt = titleText;
      if (lightboxTitle) lightboxTitle.textContent = titleText;
      if (lightboxMeta) lightboxMeta.textContent = metaText;
      if (lightboxArticleLink) lightboxArticleLink.setAttribute("href", articleUrl);
      if (typeof lightboxDialog.showModal === "function") {
        lightboxDialog.showModal();
      } else {
        lightboxDialog.setAttribute("open", "open");
      }
    }

    if (lightboxCloseBtn && lightboxDialog) {
      lightboxCloseBtn.addEventListener("click", () => {
        if (typeof lightboxDialog.close === "function") lightboxDialog.close();
        else lightboxDialog.removeAttribute("open");
      });
      lightboxDialog.addEventListener("click", (e) => {
        if (e.target === lightboxDialog) {
          if (typeof lightboxDialog.close === "function") lightboxDialog.close();
          else lightboxDialog.removeAttribute("open");
        }
      });
    }

    // Core Render Function
    function renderList() {
      const lang = window.I18n ? window.I18n.getLang() : "mm";
      const primaryGroups = computePrimaryGroups();
      const primaryLabelMap = new Map(primaryGroups.map(g => [g.id, getLocalizedLabel(g.labels, lang)]));

      // 1. Filter articles by Primary Categories + Sub-Categories (OR / AND) + Search Query
      let filtered = articles.filter(article => {
        const artPrimaryIds = getArticlePrimaryIds(article);
        const catsMM = article.categories_mm || (article.category_mm ? [article.category_mm] : []);
        const catsEN = article.categories_en || (article.category_en ? [article.category_en] : []);
        const allCatsLower = [...catsMM, ...catsEN, article.category_mm, article.category_en]
          .filter(Boolean)
          .map(c => c.toLowerCase());

        // Primary Categories check
        let matchesPrimary = true;
        if (selectedPrimaryCategories.size > 0) {
          const selPrim = Array.from(selectedPrimaryCategories);
          matchesPrimary = (matchMode === "and")
            ? selPrim.every(pid => artPrimaryIds.includes(pid))
            : selPrim.some(pid => artPrimaryIds.includes(pid));
        }

        // Sub-Categories check
        let matchesSub = true;
        if (selectedCategories.size > 0) {
          const selSub = Array.from(selectedCategories).map(c => c.toLowerCase());
          matchesSub = (matchMode === "and")
            ? selSub.every(sc => allCatsLower.includes(sc))
            : selSub.some(sc => allCatsLower.includes(sc));
        }

        const title = `${article.title_mm || ""} ${article.title_en || ""}`;
        const excerpt = `${article.excerpt_mm || ""} ${article.excerpt_en || ""}`;
        const tags = Array.isArray(article.tags) ? article.tags.join(" ") : "";
        const author = `${article.author || ""} ${article.author_mm || ""} ${article.author_en || ""}`;
        const haystack = `${title} ${excerpt} ${tags} ${author} ${allCatsLower.join(" ")}`.toLowerCase();

        const matchesSearch = !searchQuery || haystack.includes(searchQuery.toLowerCase());
        return matchesPrimary && matchesSub && matchesSearch;
      });

      // 2. Sort articles across all 5 Sort Orders
      filtered.sort((a, b) => {
        if (currentSort === "oldest") {
          return (a.date || "").localeCompare(b.date || "");
        } else if (currentSort === "popular") {
          const diff = getPopularityScore(b) - getPopularityScore(a);
          return diff !== 0 ? diff : (b.date || "").localeCompare(a.date || "");
        } else if (currentSort === "longest") {
          const minDiff = parseReadMinutes(b) - parseReadMinutes(a);
          if (minDiff !== 0) return minDiff;
          return (b.content_mm || "").length - (a.content_mm || "").length;
        } else if (currentSort === "title_az") {
          const tA = (lang === "mm" ? (a.title_mm || a.title_en) : (a.title_en || a.title_mm)) || "";
          const tB = (lang === "mm" ? (b.title_mm || b.title_en) : (b.title_en || b.title_mm)) || "";
          return tA.localeCompare(tB, lang === "mm" ? "my" : "en", { sensitivity: "base" });
        }
        // Default: newest
        return (b.date || "").localeCompare(a.date || "");
      });

      if (countBadge) countBadge.textContent = filtered.length;
      if (totalBadge) totalBadge.textContent = articles.length;
      if (liveStatusEl) {
        liveStatusEl.textContent = lang === "mm"
          ? `စာမူ ${filtered.length} ပုဒ် တွေ့ရှိပြသထားပါသည်`
          : `Showing ${filtered.length} of ${articles.length} articles`;
      }

      // 3. Update Active Filter Chips Bar
      if (activeFiltersBar) {
        const hasFilters = (selectedPrimaryCategories.size > 0 || selectedCategories.size > 0 || searchQuery !== "");
        if (hasFilters) {
          activeFiltersBar.classList.remove("hidden");
          if (activeTagsList) {
            let tagsHtml = "";
            if (searchQuery) {
              tagsHtml += `
                <span class="active-filter-chip">
                  <i class="ri-search-line text-xs" aria-hidden="true"></i>
                  <span>"${escHtml(searchQuery)}"</span>
                  <button type="button" id="articles-clear-search-chip" aria-label="Clear search query" class="cursor-pointer">
                    <i class="ri-close-line" aria-hidden="true"></i>
                  </button>
                </span>
              `;
            }
            selectedPrimaryCategories.forEach(pid => {
              const pLabel = primaryLabelMap.get(pid) || pid;
              tagsHtml += `
                <span class="active-filter-chip" style="background: rgba(217, 119, 6, 0.14); color: #B45309;">
                  <i class="ri-compass-3-line text-xs" aria-hidden="true"></i>
                  <span>${escHtml(pLabel)}</span>
                  <button type="button" data-remove-primary="${escHtml(pid)}" aria-label="Remove ${escHtml(pLabel)}" class="cursor-pointer">
                    <i class="ri-close-line" aria-hidden="true"></i>
                  </button>
                </span>
              `;
            });
            selectedCategories.forEach(cat => {
              tagsHtml += `
                <span class="active-filter-chip">
                  <span class="category-color-dot ${getCategoryDotClass(cat)}" aria-hidden="true"></span>
                  <span>${escHtml(cat)}</span>
                  <button type="button" data-remove-cat="${escHtml(cat)}" aria-label="Remove ${escHtml(cat)}" class="cursor-pointer">
                    <i class="ri-close-line" aria-hidden="true"></i>
                  </button>
                </span>
              `;
            });
            if (selectedPrimaryCategories.size + selectedCategories.size > 1) {
              tagsHtml += `
                <span class="px-2 py-0.5 rounded-full bg-cream border border-hairline text-[10px] font-mono font-bold text-charcoal">
                  ${matchMode.toUpperCase()}
                </span>
              `;
            }
            tagsHtml += `
              <span class="text-[11px] text-faint ml-1 font-mono">(${filtered.length} / ${articles.length} ${lang === "mm" ? "ပုဒ်" : "found"})</span>
            `;
            activeTagsList.innerHTML = tagsHtml;

            const clearSearchChip = document.getElementById("articles-clear-search-chip");
            if (clearSearchChip) {
              clearSearchChip.addEventListener("click", () => {
                searchQuery = "";
                if (searchInput) searchInput.value = "";
                if (searchClearBtn) searchClearBtn.classList.add("hidden");
                renderList();
              });
            }
            activeTagsList.querySelectorAll("[data-remove-primary]").forEach(btn => {
              btn.addEventListener("click", () => {
                selectedPrimaryCategories.delete(btn.getAttribute("data-remove-primary"));
                renderPrimaryCategories();
                renderCategoryPills();
                renderList();
              });
            });
            activeTagsList.querySelectorAll("[data-remove-cat]").forEach(btn => {
              btn.addEventListener("click", () => {
                selectedCategories.delete(btn.getAttribute("data-remove-cat"));
                renderCategoryPills();
                renderList();
              });
            });
          }
        } else {
          activeFiltersBar.classList.add("hidden");
        }
      }

      // 4. Empty State
      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="col-span-full py-16 px-4 text-center border border-dashed border-taupe-light rounded-2xl bg-card" data-aos="fade-up">
            <span class="text-4xl text-faint mb-2 block"><i class="ri-inbox-line" aria-hidden="true"></i></span>
            <p class="text-muted text-sm font-sans-ui mb-2">
              ${lang === "mm"
                ? (matchMode === "and"
                  ? "ရွေးချယ်ထားသော ကဏ္ဍအားလုံး တစ်ပြိုင်နက်ပါဝင်သည့် စာမူ မတွေ့ပါ။ OR စနစ်သို့ ပြောင်းကြည့်ပါ သို့မဟုတ် စစ်ထုတ်မှုရှင်းလင်းပါ။"
                  : "မည်သည့် စာမူမျှ ရှာမတွေ့ပါ။ စစ်ထုတ်မှုများကို ပြန်လည်ရှင်းလင်းကြည့်ပါ။")
                : (matchMode === "and"
                  ? "No articles match ALL selected categories simultaneously. Try switching to OR mode or clearing filters."
                  : "No articles found matching your criteria. Try resetting filters.")}
            </p>
            <div class="flex flex-wrap items-center justify-center gap-2 mt-4">
              ${matchMode === "and" ? `
                <button type="button" id="empty-switch-or-btn" class="px-4 py-2 rounded-xl border border-vermilion text-vermilion text-xs font-sans-ui hover:bg-vermilion/10 transition-colors cursor-pointer">
                  ${lang === "mm" ? "OR (တစ်ခုခုပါလျှင်) သို့ ပြောင်းရန်" : "Switch to OR (Any) Mode"}
                </button>
              ` : ""}
              <button type="button" id="empty-reset-all-btn" class="px-4 py-2 rounded-xl bg-vermilion text-white text-xs font-sans-ui hover:bg-vermilion-dark transition-colors cursor-pointer">
                ${lang === "mm" ? "စစ်ထုတ်မှု အားလုံး ရှင်းလင်းရန်" : "Reset All Filters"}
              </button>
            </div>
          </div>
        `;
        const switchOrBtn = document.getElementById("empty-switch-or-btn");
        if (switchOrBtn) {
          switchOrBtn.addEventListener("click", () => {
            applyMatchMode("or");
            renderList();
          });
        }
        const emptyResetBtn = document.getElementById("empty-reset-all-btn");
        if (emptyResetBtn && resetFiltersBtn) {
          emptyResetBtn.addEventListener("click", () => resetFiltersBtn.click());
        }
        return;
      }

      // 5. Render Cards Across All 4 Modes with Full Uncropped Images
      listContainer.innerHTML = filtered.map((article, idx) => {
        const isSaved = BookmarkSystem.isBookmarked(article.id);
        const iconClass = isSaved ? "ri-bookmark-3-fill text-vermilion" : "ri-bookmark-3-line text-faint";
        const cats = (lang === "mm")
          ? (article.categories_mm || (article.category_mm ? [article.category_mm] : []))
          : (article.categories_en || (article.category_en ? [article.category_en] : []));
        const author = (lang === "mm") ? (article.author_mm || article.author || "ထက် (Htet)") : (article.author_en || article.author || "Htet");
        const citationsCount = Array.isArray(article.citations) ? article.citations.length : 0;
        const titleText = (lang === "mm" ? (article.title_mm || article.title_en) : (article.title_en || article.title_mm)) || "";
        const excerptText = (lang === "mm" ? (article.excerpt_mm || article.excerpt_en) : (article.excerpt_en || article.excerpt_mm)) || "";
        const readTimeText = lang === "mm" ? (article.read_time_mm || `${parseReadMinutes(article)} မိနစ် ဖတ်ရှုရန်`) : (article.read_time_en || `${parseReadMinutes(article)} min read`);
        const imgSrc = article.image || article.cover_image || "";
        const primaryIds = getArticlePrimaryIds(article);
        const primaryBadgeLabel = primaryLabelMap.get(primaryIds[0]) || "";
        const isHeroPriority = idx < 2; // LCP image priority optimization (no lazy on first 2)
        const imgPriorityAttrs = isHeroPriority ? `fetchpriority="high" decoding="async"` : `loading="lazy" decoding="async"`;
        const isMagazineLead = (currentView === "magazine" && idx === 0);
        const isCompact = (currentView === "compact");
        const isGrid = (currentView === "grid");

        const titleSizeClass = isCompact
          ? "text-base sm:text-lg"
          : (isGrid ? "text-lg sm:text-xl" : (isMagazineLead ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"));

        const excerptClampClass = isCompact
          ? "line-clamp-1 text-xs"
          : (isGrid ? "line-clamp-3 text-[13px] sm:text-sm" : "line-clamp-3 sm:line-clamp-4 text-sm sm:text-[15px]");

        const maxVisibleCats = isCompact ? 1 : (isGrid ? 2 : 3);
        const visibleCats = cats.slice(0, maxVisibleCats);
        const extraCatsCount = Math.max(0, cats.length - maxVisibleCats);

        return `
          <article class="article-archive-card glass-3d-card shadow-sm relative group" data-aos="fade-up" data-aos-delay="${Math.min(idx * 40, 240)}">
            <div class="article-card-shell">
              ${imgSrc ? `
                <div class="article-cover-stage">
                  <a href="article.html?id=${escHtml(article.id)}" class="article-cover-link" aria-label="${escHtml(titleText)}">
                    <img src="${escHtml(imgSrc)}" alt="${escHtml(titleText)}" class="article-cover-img" ${imgPriorityAttrs}>
                  </a>
                  <button type="button" class="article-zoom-btn" data-zoom-src="${escHtml(imgSrc)}" data-zoom-title="${escHtml(titleText)}" data-zoom-meta="${escHtml(`${author} • ${article.date || ""} • ${readTimeText}`)}" data-zoom-url="article.html?id=${escHtml(article.id)}" aria-label="${escHtml(lang === 'mm' ? 'ပုံအပြည့်ကြည့်ရန် — ' + titleText : 'View full cover image — ' + titleText)}">
                    <i class="ri-fullscreen-line" aria-hidden="true"></i>
                    <span>${lang === "mm" ? "ပုံအပြည့်" : "Full View"}</span>
                  </button>
                </div>
              ` : ""}

              <div class="article-card-content">
                <!-- Metadata Top Row -->
                <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-faint font-sans-ui">
                  <div class="flex flex-wrap items-center gap-1.5 min-w-0">
                    ${primaryBadgeLabel ? `
                      <button type="button" data-card-primary="${escHtml(primaryIds[0])}" class="px-2 py-0.5 rounded-md bg-vermilion/10 hover:bg-vermilion/20 text-vermilion font-semibold border border-vermilion/20 cursor-pointer transition-colors text-[10px] sm:text-[11px]">
                        ${escHtml(primaryBadgeLabel)}
                      </button>
                    ` : ""}
                    ${visibleCats.map(c => `
                      <button type="button" class="article-cat-chip px-2 py-0.5 rounded-full bg-cream hover:bg-taupe-light text-charcoal font-medium border border-hairline inline-flex items-center space-x-1 cursor-pointer transition-colors text-[10px] sm:text-[11px]" data-filter-cat="${escHtml(c)}">
                        <span class="category-color-dot ${getCategoryDotClass(c)}" aria-hidden="true"></span>
                        <span class="truncate max-w-[14rem]">${escHtml(c)}</span>
                      </button>
                    `).join("")}
                    ${extraCatsCount > 0 ? `<span class="text-[10px] text-faint font-mono">+${extraCatsCount}</span>` : ""}
                  </div>
                  <div class="flex items-center space-x-2.5 shrink-0">
                    <span class="inline-flex items-center space-x-1">
                      <i class="ri-calendar-2-line" aria-hidden="true"></i>
                      <span>${escHtml(article.date || "")}</span>
                    </span>
                    <span class="inline-flex items-center space-x-1">
                      <i class="ri-time-line text-vermilion" aria-hidden="true"></i>
                      <span>${escHtml(readTimeText)}</span>
                    </span>
                    <button type="button" data-bookmark-id="${escHtml(article.id)}" class="hover:text-vermilion transition-colors p-1 cursor-pointer" aria-label="${escHtml(lang === 'mm' ? 'သိမ်းဆည်းရန် — ' + titleText : 'Bookmark ' + titleText)}">
                      <i class="${iconClass} text-base" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>

                <!-- Title -->
                <h3 class="article-card-title ${titleSizeClass}">
                  <a href="article.html?id=${escHtml(article.id)}" class="hover:underline focus-visible:outline-none">
                    ${escHtml(titleText)}
                  </a>
                </h3>

                <!-- Excerpt -->
                <p class="article-card-excerpt font-sans-ui ${excerptClampClass}">
                  ${escHtml(excerptText)}
                </p>

                <!-- Footer: Author, Telemetry & Actions -->
                <footer class="article-card-footer text-xs font-sans-ui">
                  <div class="flex flex-wrap items-center gap-1.5 min-w-0">
                    <span class="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cream text-charcoal border border-hairline text-[11px] max-w-full">
                      <span class="hanko-seal-3d w-4 h-4 text-[8px] flex items-center justify-center font-bold shrink-0" aria-hidden="true">ထက်</span>
                      <span class="truncate max-w-[15rem]">${escHtml(author)}</span>
                    </span>
                    ${(!isGrid && citationsCount > 0) ? `
                      <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 text-[10px]">
                        <i class="bi bi-journal-bookmark" aria-hidden="true"></i>
                        <span>${citationsCount} ${lang === "mm" ? "စာကိုး" : "cites"}</span>
                      </span>
                    ` : ""}
                    ${(!isGrid && !isCompact && article.views) ? `
                      <span class="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cream/80 text-faint border border-hairline text-[10px] font-mono">
                        <i class="ri-eye-line" aria-hidden="true"></i>
                        <span>${Number(article.views).toLocaleString()}</span>
                      </span>
                    ` : ""}
                  </div>

                  <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <a href="article.html?id=${escHtml(article.id)}" class="btn-3d-tactile inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-vermilion text-white hover:bg-vermilion-dark font-medium text-xs shadow-xs transition-all">
                      <i class="ri-book-open-line" aria-hidden="true"></i>
                      <span>${lang === "mm" ? "ဖတ်ရှုရန်" : "Read"}</span>
                      <span class="visually-hidden"> — ${escHtml(titleText)}</span>
                    </a>
                    ${!isCompact ? `
                      <button type="button" class="btn-3d-tactile article-card-lang-toggle-btn px-2.5 py-1.5 rounded-xl border border-hairline bg-cream hover:bg-taupe-light dark:bg-zinc-800 text-charcoal font-medium text-xs inline-flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs" data-article-id="${escHtml(article.id)}" data-showing-original="${lang === 'mm' ? 'true' : 'false'}" aria-label="${escHtml(lang === 'mm' ? 'အင်္ဂလိပ်ဘာသာပြန်ကြည့်ရန် — ' + titleText : 'View original Burmese — ' + titleText)}">
                        <span class="lang-toggle-flag text-xs" aria-hidden="true">${lang === "mm" ? "🌐" : "🇲🇲"}</span>
                        <span class="lang-toggle-label text-[11px] font-sans-ui">${lang === "mm" ? "EN" : "MM"}</span>
                      </button>
                    ` : ""}
                    ${article.pdf_file ? `
                      <a href="${escHtml(article.pdf_file.startsWith('downloads/') ? article.pdf_file : 'downloads/' + article.pdf_file)}" download class="btn-3d-tactile px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-900/60 inline-flex items-center space-x-1 transition-colors shadow-2xs text-xs" aria-label="${escHtml('Download PDF — ' + titleText)}">
                        <i class="ri-file-pdf-line text-red-500" aria-hidden="true"></i>
                        <span>PDF</span>
                      </a>
                    ` : ""}
                    ${(!isGrid && !isCompact && article.source_url && /^https?:\/\//.test(article.source_url)) ? `
                      <a href="${escHtml(article.source_url)}" target="_blank" rel="noopener noreferrer" class="btn-3d-tactile px-2.5 py-1.5 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs inline-flex items-center space-x-1 border border-hairline transition-colors" aria-label="${escHtml('Original source — ' + titleText)}">
                        <i class="ri-external-link-line text-amber-600" aria-hidden="true"></i>
                        <span>${lang === "mm" ? "မူရင်း" : "Source"}</span>
                      </a>
                    ` : ""}
                  </div>
                </footer>
              </div>
            </div>
          </article>
        `;
      }).join("");

      initAOS();
      if (typeof init3DTiltAndFloatingEffects === "function") {
        init3DTiltAndFloatingEffects();
      }

      // Wire Full-Image Lightbox Zoom Buttons
      listContainer.querySelectorAll(".article-zoom-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          openLightbox(
            btn.getAttribute("data-zoom-src"),
            btn.getAttribute("data-zoom-title"),
            btn.getAttribute("data-zoom-meta"),
            btn.getAttribute("data-zoom-url")
          );
        });
      });

      // Wire Inline Card Language Toggle
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
          const willShowOriginal = !isShowingOriginal;
          btn.setAttribute("data-showing-original", willShowOriginal ? "true" : "false");

          const flagEl = btn.querySelector(".lang-toggle-flag");
          const labelEl = btn.querySelector(".lang-toggle-label");
          if (flagEl) flagEl.textContent = willShowOriginal ? "🌐" : "🇲🇲";
          if (labelEl) labelEl.textContent = willShowOriginal ? "EN" : "MM";

          const titleLink = card.querySelector(".article-card-title a");
          if (titleLink) {
            titleLink.textContent = willShowOriginal ? (article.title_mm || article.title_en) : (article.title_en || article.title_mm);
          }
          const excerptP = card.querySelector(".article-card-excerpt");
          if (excerptP) {
            excerptP.textContent = willShowOriginal ? (article.excerpt_mm || article.excerpt_en) : (article.excerpt_en || article.excerpt_mm);
          }

          if (window.HtetUI && typeof window.HtetUI.showToast === "function") {
            window.HtetUI.showToast(willShowOriginal
              ? "မူရင်းမြန်မာဘာသာ စာမူသို့ ပြောင်းလဲပြသထားပါသည် ✓"
              : "English ဘာသာပြန်အနှစ်ချုပ်သို့ ပြောင်းလဲပြသထားပါသည် ✓");
          }
        });
      });

      // Wire In-Card Primary Badge Click
      listContainer.querySelectorAll("[data-card-primary]").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const pid = btn.getAttribute("data-card-primary");
          if (selectedPrimaryCategories.has(pid)) selectedPrimaryCategories.delete(pid);
          else selectedPrimaryCategories.add(pid);
          renderPrimaryCategories();
          renderCategoryPills();
          renderList();
        });
      });

      // Wire In-Card Sub-Category Tag Click
      listContainer.querySelectorAll(".article-cat-chip").forEach(chip => {
        chip.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const targetCat = chip.getAttribute("data-filter-cat");
          if (selectedCategories.has(targetCat)) selectedCategories.delete(targetCat);
          else selectedCategories.add(targetCat);
          renderCategoryPills();
          renderList();
        });
      });
    }

    // Primary Category Click Delegation (Multi-Select Enabled!)
    if (primaryCatContainer) {
      primaryCatContainer.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-primary-cat]");
        if (!btn) return;
        e.preventDefault();
        const pid = btn.getAttribute("data-primary-cat");
        if (pid === "all") {
          selectedPrimaryCategories.clear();
        } else {
          if (selectedPrimaryCategories.has(pid)) selectedPrimaryCategories.delete(pid);
          else selectedPrimaryCategories.add(pid);
        }
        renderPrimaryCategories();
        renderCategoryPills();
        renderList();
      });
    }

    if (primaryResetBtn) {
      primaryResetBtn.addEventListener("click", () => {
        selectedPrimaryCategories.clear();
        renderPrimaryCategories();
        renderCategoryPills();
        renderList();
      });
    }

    // Sub-Category Pill Click Delegation (Multi-Select Track & Drawer)
    function handleCategoryClick(e) {
      const catBtn = e.target.closest("[data-category]");
      if (!catBtn) return;
      e.preventDefault();
      const clickedCat = catBtn.getAttribute("data-category");
      if (clickedCat === "all") {
        selectedCategories.clear();
      } else {
        if (selectedCategories.has(clickedCat)) selectedCategories.delete(clickedCat);
        else selectedCategories.add(clickedCat);
      }
      renderCategoryPills();
      renderList();
    }

    if (categoryFilterContainer) categoryFilterContainer.addEventListener("click", handleCategoryClick);
    if (drawerPillsContainer) drawerPillsContainer.addEventListener("click", handleCategoryClick);

    // 4-Mode View Switcher Events
    if (viewSwitcher) {
      viewSwitcher.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-view-mode]");
        if (!btn) return;
        const mode = btn.getAttribute("data-view-mode");
        applyViewMode(mode, true);
        renderList();
      });
    }

    // OR / AND Multi-Select Match Mode Events
    matchModeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-match-mode");
        applyMatchMode(mode);
        renderList();
      });
    });

    // Horizontal Track Scroll Buttons
    if (scrollLeftBtn && categoryFilterContainer) {
      scrollLeftBtn.addEventListener("click", () => {
        categoryFilterContainer.scrollBy({ left: -260, behavior: "smooth" });
      });
    }
    if (scrollRightBtn && categoryFilterContainer) {
      scrollRightBtn.addEventListener("click", () => {
        categoryFilterContainer.scrollBy({ left: 260, behavior: "smooth" });
      });
    }

    // Expandable Multi-Select Drawer Toggle
    if (toggleExpandBtn && drawerContainer) {
      toggleExpandBtn.addEventListener("click", () => {
        const lang = window.I18n ? window.I18n.getLang() : "mm";
        const isOpen = drawerContainer.classList.contains("open");
        const labelEl = document.getElementById("articles-expand-label");
        const iconEl = document.getElementById("articles-expand-icon");
        if (isOpen) {
          drawerContainer.classList.remove("open");
          toggleExpandBtn.setAttribute("aria-expanded", "false");
          if (labelEl) labelEl.textContent = lang === "mm" ? "ကဏ္ဍအားလုံး ဖြန့်ရွေးရန်" : "Expand Multi-Select";
          if (iconEl) iconEl.className = "ri-arrow-down-s-line text-xs";
        } else {
          drawerContainer.classList.add("open");
          toggleExpandBtn.setAttribute("aria-expanded", "true");
          if (labelEl) labelEl.textContent = lang === "mm" ? "ပြန်သိမ်းရန်" : "Collapse";
          if (iconEl) iconEl.className = "ri-arrow-up-s-line text-xs";
        }
      });
    }

    // Live Search Inside Expanded Category Drawer
    if (catSearchInput) {
      catSearchInput.addEventListener("input", (e) => {
        catSearchQuery = e.target.value;
        renderCategoryPills();
      });
    }

    if (drawerClearBtn) {
      drawerClearBtn.addEventListener("click", () => {
        selectedCategories.clear();
        catSearchQuery = "";
        if (catSearchInput) catSearchInput.value = "";
        renderCategoryPills();
        renderList();
      });
    }

    // Main Article Search Input
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value.trim();
        if (searchClearBtn) searchClearBtn.classList.toggle("hidden", searchQuery.length === 0);
        renderList();
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        searchQuery = "";
        searchClearBtn.classList.add("hidden");
        renderList();
      });
    }

    // 5-Option Sort Select
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderList();
      });
    }

    // Master Reset All Filters
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener("click", () => {
        selectedPrimaryCategories.clear();
        selectedCategories.clear();
        searchQuery = "";
        catSearchQuery = "";
        if (searchInput) searchInput.value = "";
        if (catSearchInput) catSearchInput.value = "";
        if (searchClearBtn) searchClearBtn.classList.add("hidden");
        if (sortSelect) sortSelect.value = "newest";
        currentSort = "newest";
        applyMatchMode("or");
        renderPrimaryCategories();
        renderCategoryPills();
        renderList();
      });
    }

    // Initial Boot
    applyViewMode(currentView, false);
    applyMatchMode(matchMode);
    renderPrimaryCategories();
    renderCategoryPills();
    renderList();

    window.addEventListener("langchange", () => {
      renderPrimaryCategories();
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
        modalContainer.classList.add("bg-card", "text-charcoal", "border-2", "border-rose-400/50", "dark:border-rose-800/60", "shadow-[0_0_50px_rgba(244,63,94,0.25)]", "love-poem-modal");
        modalHeader.classList.add("bg-card/95", "border-rose-300/40", "dark:border-rose-900/60");
        modalFooter.classList.add("bg-card/95", "border-rose-300/40", "dark:border-rose-900/60", "text-muted");

        modalCategoryBadge.className = "inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 font-bold border border-rose-400/50 text-xs";
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
              <h2 id="modal-post-title" class="font-serif-editorial text-2xl sm:text-3xl font-bold text-charcoal leading-snug flex items-center space-x-2">
                <span>${(lang === 'en' && item.title_en) ? item.title_en : item.title_mm}</span>
                <span class="text-rose-500 text-lg">❦</span>
              </h2>
              <div class="text-xs text-rose-600 dark:text-rose-400 font-serif italic">
                <span>❦ ထက် (Htet) ရေးဖွဲ့သည့် ရင်ဖွင့်အချစ်ကဗျာ</span>
              </div>
            </div>

            <div class="pl-5 sm:pl-7 border-l-4 border-rose-500 bg-cream/60 dark:bg-stone-900/40 rounded-r-3xl py-6 pr-6 shadow-xs">
              <div class="modal-text-content font-serif ${fontClass} text-charcoal italic whitespace-pre-line leading-relaxed sm:leading-loose">
                ${poemContent}
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-1.5 pt-2">
              ${(item.tags || []).map(t => `<span class="text-[11px] px-3 py-1 rounded-lg bg-cream/80 dark:bg-rose-950/60 text-charcoal border border-rose-300/40 dark:border-rose-900/60 font-sans-ui">#${t}</span>`).join('')}
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

      readerModal.classList.add("is-open");
      readerModal.classList.remove("hidden");
      readerModal.style.display = "flex";
      readerModal.classList.add("animate-modal-backdrop");
      modalContainer.classList.add("animate-modal-spring");

      requestAnimationFrame(() => {
        readerModal.classList.remove("opacity-0");
        modalContainer.classList.remove("scale-95", "translate-y-4", "translate-y-full");
        modalContainer.classList.add("scale-100", "translate-y-0");
        modalContainer.style.transform = '';
      });

      document.body.classList.add("overflow-hidden");
    }

    function closeReaderModal() {
      if (!readerModal || !modalContainer) return;
      modalItemLangOverride = null;
      readerModal.classList.remove("is-open");
      readerModal.classList.add("opacity-0");
      modalContainer.classList.remove("scale-100", "translate-y-0");
      modalContainer.classList.add("scale-95", "translate-y-4");

      setTimeout(() => {
        readerModal.classList.add("hidden");
        readerModal.style.display = "none";
        readerModal.classList.remove("animate-modal-backdrop");
        modalContainer.classList.remove("animate-modal-spring");
        modalContainer.style.transform = '';
        document.body.classList.remove("overflow-hidden");
      }, 250);
    }

    // Expose global modal controllers for PWA and external navigation
    window.openJournalReaderModal = openReaderModal;
    window.closeJournalModal = closeReaderModal;

    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", closeReaderModal);
    }
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener("click", closeReaderModal);
    }
    if (modalFooterCloseBtn) {
      modalFooterCloseBtn.addEventListener("click", closeReaderModal);
    }

    // Native Mobile Swipe-Down to Dismiss Bottom Sheet
    if (modalContainer) {
      let touchStartY = 0;
      let touchDiffY = 0;
      modalContainer.addEventListener('touchstart', (e) => {
        if (!modalBody || modalBody.scrollTop <= 0) {
          touchStartY = e.touches[0].clientY;
          touchDiffY = 0;
        } else {
          touchStartY = 0;
        }
      }, { passive: true });

      modalContainer.addEventListener('touchmove', (e) => {
        if (!touchStartY) return;
        const currentY = e.touches[0].clientY;
        touchDiffY = currentY - touchStartY;
        if (touchDiffY > 0) {
          modalContainer.style.transform = `translateY(${touchDiffY}px)`;
        }
      }, { passive: true });

      modalContainer.addEventListener('touchend', () => {
        if (!touchStartY) return;
        if (touchDiffY > 75) {
          closeReaderModal();
        } else {
          modalContainer.style.transition = 'transform 0.2s ease-out';
          modalContainer.style.transform = '';
          setTimeout(() => { modalContainer.style.transition = ''; }, 200);
        }
        touchStartY = 0;
        touchDiffY = 0;
      }, { passive: true });
    }

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && readerModal && (readerModal.classList.contains("is-open") || !readerModal.classList.contains("hidden"))) {
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
            <article class="journal-card group rounded-2xl sm:rounded-3xl border border-blue-500/20 bg-card p-3.5 sm:p-5 md:p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden cursor-pointer" data-category="articles" data-item-id="${item.id}">
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
            <article class="journal-card group rounded-2xl sm:rounded-3xl border-2 border-amber-400/40 bg-gradient-to-br from-amber-500/5 via-card to-amber-500/10 p-3.5 sm:p-5 md:p-7 shadow-xs hover:shadow-md transition-all relative overflow-hidden cursor-pointer" data-category="quotes" data-item-id="${item.id}">
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
            <article class="journal-card group rounded-3xl border-2 border-emerald-400/50 dark:border-emerald-500/60 bg-gradient-to-b from-[#021b14] via-[#052b20] to-[#01140e] text-emerald-50 shadow-[0_12px_45px_-8px_rgba(5,150,105,0.35)] hover:shadow-[0_16px_50px_-6px_rgba(16,185,129,0.45)] transition-all relative overflow-hidden my-4 cursor-pointer" data-category="poetry" data-item-id="${item.id}">
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
              <div class="relative z-20 p-3.5 sm:p-5 md:p-7 space-y-4">
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
            <article class="journal-card group rounded-2xl sm:rounded-3xl border-2 border-rose-400/40 dark:border-rose-800/50 bg-card p-3.5 sm:p-5 md:p-7 shadow-xs hover:shadow-md transition-all relative overflow-hidden cursor-pointer" data-category="poetry" data-item-id="${item.id}">
              <!-- Romantic Decorative Floral Watermark -->
              <div class="absolute -right-4 -bottom-6 text-7xl sm:text-8xl text-rose-500/10 select-none pointer-events-none font-serif">
                ❦
              </div>

              <!-- Header Badge & Date -->
              <div class="flex items-center justify-between mb-3 text-xs font-sans-ui relative z-10">
                <div class="flex items-center space-x-2">
                  <span class="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 font-bold border border-rose-400/50 text-[11px] shadow-2xs">
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
              <h3 class="font-serif-editorial text-lg sm:text-xl font-bold text-charcoal group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors leading-snug flex items-center space-x-2 relative z-10">
                <span>${lang === 'en' && item.title_en ? item.title_en : item.title_mm}</span>
                <span class="text-rose-500 text-sm">❦</span>
              </h3>

              <!-- Poetry Stanza Layout with See More -->
              <div class="expandable-wrap relative z-10 my-3" data-collapsed="${isLongPoem ? 'true' : 'false'}">
                <div class="expandable-content pl-3 sm:pl-6 border-l-3 border-rose-500 bg-cream/60 dark:bg-stone-900/40 rounded-r-xl sm:rounded-r-2xl py-2.5 sm:py-3.5 pr-2.5 sm:pr-4 font-serif text-sm sm:text-base leading-relaxed sm:leading-loose text-charcoal italic whitespace-pre-line ${isLongPoem ? 'line-clamp-4' : ''}">
                  ${poemContent}
                </div>
                ${isLongPoem ? `
                <button class="see-more-toggle-btn text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline mt-1.5 inline-flex items-center space-x-1 pl-3 sm:pl-4 cursor-pointer">
                  <span class="see-more-label">${lang === 'mm' ? 'ပိုမိုဖတ်ရှုရန်... (See more)' : 'See more...'}</span>
                  <i class="ri-arrow-down-s-line text-xs"></i>
                </button>
                ` : ''}
              </div>

              <!-- Tags in Soft Rose -->
              <div class="flex flex-wrap items-center gap-1.5 pt-1 relative z-10">
                ${(item.tags || []).map(t => `<span class="text-[10px] px-2 py-0.5 rounded-md bg-cream/80 dark:bg-rose-950/40 text-charcoal/80 border border-rose-300/40 dark:border-rose-900/50">#${t}</span>`).join('')}
              </div>

              <!-- Actions Bar -->
              <div class="flex flex-wrap items-center justify-between gap-2 pt-3 mt-2 border-t border-rose-200/50 dark:border-rose-900/40 text-xs font-sans-ui relative z-10">
                <div class="flex items-center space-x-2">
                  <button type="button" class="journal-popup-read-btn px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-2xs transition-all hover:scale-105 cursor-pointer" data-item-id="${item.id}" title="${lang === 'mm' ? 'Pop-Up ဖြင့် ကဗျာဖတ်ရှုရန်' : 'Read Poem in Pop-Up'}">
                    <i class="ri-focus-2-line text-xs"></i>
                    <span data-mm="ကဗျာဖတ်ရန်" data-en="Read Poem">${lang === 'mm' ? 'ကဗျာဖတ်ရန်' : 'Read Poem'}</span>
                  </button>
                  ${renderCardLangToggleBtn(item, lang, 'border-rose-300/50 bg-cream/80 dark:bg-rose-950/60 text-charcoal')}
                  <a href="${shareTelegramUrl}" target="_blank" rel="noopener" class="px-3 py-1.5 rounded-xl bg-cream/80 hover:bg-cream dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-charcoal font-medium text-xs flex items-center space-x-1 border border-rose-300/50 dark:border-rose-900/60 transition-all">
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
            <article class="journal-card group rounded-2xl sm:rounded-3xl border border-purple-500/20 bg-card p-3.5 sm:p-5 md:p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden cursor-pointer" data-category="notes" data-item-id="${item.id}">
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
            <article class="journal-card group rounded-2xl sm:rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/5 via-card to-rose-500/10 p-3.5 sm:p-5 md:p-6 shadow-xs hover:shadow-md transition-all relative overflow-hidden cursor-pointer" data-category="activism" data-item-id="${item.id}">
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

      // 3b. Native Mobile Card Tap-to-Read Delegation
      const journalCard = e.target.closest(".journal-card, .journal-compact-card");
      if (journalCard) {
        // Disregard clicks on interactive buttons, links, inputs, or controls
        if (e.target.closest("button, a, input, textarea, select, .see-more-toggle-btn, .journal-fav-btn, .journal-share-btn, .journal-card-lang-toggle-btn")) {
          return;
        }
        const itemId = journalCard.getAttribute("data-item-id") || journalCard.querySelector("[data-item-id]")?.getAttribute("data-item-id");
        if (itemId) {
          e.preventDefault();
          openReaderModal(itemId);
          return;
        }
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

  // 13. Glossary Page Explorer Renderer (Conceptual Glossary & Philosophy Lexicon)
  async function initGlossaryPage() {
    const listContainer = document.getElementById('glossary-terms-list');
    if (!listContainer) return;

    // Load glossary data
    let terms = [];
    if (window.HtetData && typeof window.HtetData.getGlossary === 'function') {
      try {
        terms = (await window.HtetData.getGlossary()) || [];
      } catch (e) {
        console.warn('[initGlossaryPage] HtetData error:', e);
      }
    }
    if ((!terms || terms.length === 0) && (window.HTET_GLOSSARY_BACKUP || window.HtetGlossaryBackup)) {
      terms = window.HTET_GLOSSARY_BACKUP || window.HtetGlossaryBackup || [];
    }

    if (!terms || terms.length === 0) return;

    // Load articles for cross-linking
    let allArticles = [];
    if (window.HtetData && typeof window.HtetData.getArticles === 'function') {
      try {
        allArticles = (await window.HtetData.getArticles()) || [];
      } catch (e) {
        // non-blocking
      }
    }
    if ((!allArticles || allArticles.length === 0) && (window.HTET_ARTICLES_BACKUP || window.HtetArticlesBackup)) {
      allArticles = window.HTET_ARTICLES_BACKUP || window.HtetArticlesBackup || [];
    }

    // Related article mapping by concept slug
    const GLOSSARY_ARTICLE_MAP = {
      'intersectionality': ['is-gender-a-social-construct', 'cisgender-privilege-easy-mode', 'from-the-margins-of-womanhood-trans-confession'],
      'gender-performativity': ['is-gender-a-social-construct', 'who-defines-womanhood', 'clothing-culture-conflict'],
      'cisnormativity': ['cisgender-privilege-easy-mode', 'is-gender-a-social-construct'],
      'heteronormativity': ['cisgender-privilege-easy-mode', 'from-the-margins-of-womanhood-trans-confession'],
      'transmisogyny': ['from-the-margins-of-womanhood-trans-confession', 'who-defines-womanhood'],
      'patriarchy': ['is-gender-a-social-construct', 'revolutionary-government-philosophy'],
      'hegemonic-masculinity': ['is-gender-a-social-construct', 'from-jinggangshan-to-yanan'],
      'compulsory-heterosexuality': ['cisgender-privilege-easy-mode', 'who-defines-womanhood'],
      'ecofeminism': ['myanmar-earthquake-special-article-2025', 'commufemocratism-manifesto'],
      'homonationalism': ['myanmar-on-the-tightrope', 'honest-information-sham-election-analysis'],
      'queer-utopianism': ['commufemocratism-manifesto', 'who-owns-htet-identity-thoughts'],
      'affect-theory': ['who-owns-htet-identity-thoughts', 'mosaic-brain-gender-neuroscience'],
      'hegemony': ['commufemocratism-manifesto', 'honest-information-sham-election-analysis', 'from-jinggangshan-to-yanan'],
      'epistemic-injustice': ['the-world-is-growing-opportunities', 'essential-future-skills-for-youth-digital-era'],
      'biopolitics': ['mosaic-brain-gender-neuroscience', 'early-puberty-scientific-feminist-analysis'],
      'commufemocratism': ['commufemocratism-manifesto', 'revolutionary-government-philosophy'],
      'wae-thi-democracy': ['commufemocratism-manifesto', 'revolutionary-government-philosophy'],
      'ethics-of-care': ['commufemocratism-manifesto', 'when-stars-fall-are-prostitutes-laughing'],
      'standpoint-epistemology': ['who-defines-womanhood', 'honest-information-interview-cdm-htet'],
      'panopticism': ['who-owns-htet-identity-thoughts', 'from-jinggangshan-to-yanan'],
      'banality-of-evil': ['honest-information-sham-election-analysis', 'from-jinggangshan-to-yanan'],
      'prefigurative-politics': ['commufemocratism-manifesto', 'classrooms-of-spring-revolution'],
      'dialectical-materialism': ['commufemocratism-manifesto', 'revolutionary-helen-keller'],
      'alienation': ['who-owns-htet-identity-thoughts', 'the-road-of-slow-walkers'],
      'decommodification': ['commufemocratism-manifesto', 'when-stars-fall-are-prostitutes-laughing'],
      'tyranny-of-merit': ['the-world-is-growing-opportunities', 'three-generation-gap-parents'],
      'mutual-aid': ['commufemocratism-manifesto', 'classrooms-of-spring-revolution'],
      'economizing-care': ['commufemocratism-manifesto', 'when-stars-fall-are-prostitutes-laughing'],
      'subaltern-studies': ['classrooms-of-spring-revolution', 'honest-information-interview-cdm-htet'],
      'abolition-feminism': ['commufemocratism-manifesto', 'revolutionary-helen-keller'],
      'social-reproduction-theory': ['commufemocratism-manifesto', 'when-stars-fall-are-prostitutes-laughing'],
      'necropolitics': ['honest-information-interview-cdm-htet', 'from-jinggangshan-to-yanan'],
      'redistribution-recognition': ['commufemocratism-manifesto', 'cisgender-privilege-easy-mode'],
      'structural-violence': ['phoenix-from-ashes-history-written-in-tears', 'honest-information-interview-cdm-htet'],
      'decolonial-feminism': ['phoenix-from-ashes-history-written-in-tears', 'clothing-culture-conflict'],
      'ideological-state-apparatus': ['honest-information-sham-election-analysis', 'classrooms-of-spring-revolution'],
      'manufactured-consent': ['honest-information-sham-election-analysis', 'myanmar-on-the-tightrope'],
      'critical-pedagogy': ['classrooms-of-spring-revolution', 'essential-future-skills-for-youth-digital-era'],
      'orientalism-othering': ['myanmar-on-the-tightrope', 'clothing-culture-conflict'],
      'subaltern-counterpublics': ['classrooms-of-spring-revolution', 'from-the-margins-of-womanhood-trans-confession'],
      'radical-equality': ['revolutionary-helen-keller', 'commufemocratism-manifesto'],
      'transformative-justice': ['commufemocratism-manifesto', 'war-on-child-grooming'],
      'bodily-autonomy': ['bodily-autonomy-workplace-ethics', 'from-the-margins-of-womanhood-trans-confession'],
      'multispecies-justice': ['commufemocratism-manifesto', 'myanmar-earthquake-special-article-2025'],
      'reproductive-justice': ['bodily-autonomy-workplace-ethics', 'early-puberty-scientific-feminist-analysis'],
      'disability-justice': ['revolutionary-helen-keller', 'the-road-of-slow-walkers'],
      'transfeminism': ['cisgender-privilege-easy-mode', 'who-defines-womanhood', 'from-the-margins-of-womanhood-trans-confession'],
      'cissexism': ['cisgender-privilege-easy-mode', 'is-gender-a-social-construct'],
      'cisgender-privilege': ['cisgender-privilege-easy-mode', 'who-defines-womanhood'],
      'misogynoir': ['who-defines-womanhood', 'phoenix-from-ashes-history-written-in-tears'],
      'matrix-of-domination': ['is-gender-a-social-construct', 'commufemocratism-manifesto'],
      'queer-temporality': ['who-owns-htet-identity-thoughts', 'the-road-of-slow-walkers'],
      'gender-dysphoria': ['mosaic-brain-gender-neuroscience', 'who-owns-htet-identity-thoughts'],
      'gender-euphoria': ['who-defines-womanhood', 'from-the-margins-of-womanhood-trans-confession'],
      'somatechnics': ['mosaic-brain-gender-neuroscience', 'who-owns-htet-identity-thoughts'],
      'kyriarchy': ['commufemocratism-manifesto', 'revolutionary-government-philosophy'],
      'sexual-scripting': ['is-gender-a-social-construct', 'clothing-culture-conflict'],
      'toxic-masculinity': ['from-jinggangshan-to-yanan', 'war-on-child-grooming'],
      'passing': ['from-the-margins-of-womanhood-trans-confession', 'who-defines-womanhood'],
      'neuroqueer': ['mosaic-brain-gender-neuroscience', 'who-owns-htet-identity-thoughts'],
      'reproductive-labor': ['commufemocratism-manifesto', 'when-stars-fall-are-prostitutes-laughing'],
      'gender-trouble': ['is-gender-a-social-construct', 'clothing-culture-conflict'],
      'historical-materialism': ['commufemocratism-manifesto', 'revolutionary-helen-keller'],
      'base-and-superstructure': ['commufemocratism-manifesto', 'revolutionary-government-philosophy'],
      'commodity-fetishism': ['commufemocratism-manifesto', 'the-world-is-growing-opportunities'],
      'surplus-value': ['commufemocratism-manifesto', 'when-stars-fall-are-prostitutes-laughing'],
      'social-contract': ['revolutionary-government-philosophy', 'commufemocratism-manifesto'],
      'general-will': ['revolutionary-government-philosophy', 'commufemocratism-manifesto'],
      'radical-democracy': ['commufemocratism-manifesto', 'classrooms-of-spring-revolution'],
      'agonistic-pluralism': ['revolutionary-government-philosophy', 'myanmar-on-the-tightrope'],
      'epistemic-violence': ['classrooms-of-spring-revolution', 'phoenix-from-ashes-history-written-in-tears'],
      'sovereign-power': ['revolutionary-government-philosophy', 'from-jinggangshan-to-yanan'],
      'bare-life': ['from-jinggangshan-to-yanan', 'honest-information-interview-cdm-htet'],
      'state-of-exception': ['honest-information-sham-election-analysis', 'from-jinggangshan-to-yanan'],
      'disciplinary-power': ['classrooms-of-spring-revolution', 'who-owns-htet-identity-thoughts'],
      'governmentality': ['revolutionary-government-philosophy', 'early-puberty-scientific-feminist-analysis'],
      'anarcho-communism': ['commufemocratism-manifesto', 'classrooms-of-spring-revolution'],
      'democratic-confederalism': ['commufemocratism-manifesto', 'revolutionary-government-philosophy'],
      'de-alienation': ['who-owns-htet-identity-thoughts', 'the-road-of-slow-walkers', 'commufemocratism-manifesto'],
      'substantive-democracy': ['revolutionary-government-philosophy', 'commufemocratism-manifesto'],
      'coloniality-of-power': ['phoenix-from-ashes-history-written-in-tears', 'myanmar-on-the-tightrope'],
      'border-thinking': ['phoenix-from-ashes-history-written-in-tears', 'classrooms-of-spring-revolution'],
      'mimicry-and-hybridity': ['clothing-culture-conflict', 'myanmar-on-the-tightrope'],
      'cultural-imperialism': ['clothing-culture-conflict', 'phoenix-from-ashes-history-written-in-tears'],
      'interpellation': ['honest-information-sham-election-analysis', 'classrooms-of-spring-revolution'],
      'cultural-capital': ['the-world-is-growing-opportunities', 'three-generation-gap-parents'],
      'symbolic-violence': ['is-gender-a-social-construct', 'clothing-culture-conflict'],
      'habitus': ['three-generation-gap-parents', 'who-owns-htet-identity-thoughts'],
      'the-gaze': ['who-defines-womanhood', 'when-stars-fall-are-prostitutes-laughing'],
      'carceral-feminism': ['commufemocratism-manifesto', 'bodily-autonomy-workplace-ethics'],
      'postcolonial-state': ['from-jinggangshan-to-yanan', 'revolutionary-government-philosophy'],
      'zone-of-non-being': ['phoenix-from-ashes-history-written-in-tears', 'honest-information-interview-cdm-htet'],
      'spectacle-society': ['honest-information-sham-election-analysis', 'who-owns-htet-identity-thoughts'],
      'surveillance-capitalism': ['who-owns-htet-identity-thoughts', 'honest-information-sham-election-analysis'],
      'restorative-justice': ['commufemocratism-manifesto', 'war-on-child-grooming'],
      'distributive-justice': ['commufemocratism-manifesto', 'the-world-is-growing-opportunities'],
      'intergenerational-justice': ['myanmar-earthquake-special-article-2025', 'commufemocratism-manifesto'],
      'environmental-justice': ['myanmar-earthquake-special-article-2025', 'commufemocratism-manifesto'],
      'right-to-the-city': ['commufemocratism-manifesto', 'when-stars-fall-are-prostitutes-laughing'],
      'universal-basic-services': ['commufemocratism-manifesto', 'revolutionary-government-philosophy'],
      'the-commons': ['commufemocratism-manifesto', 'essential-future-skills-for-youth-digital-era'],
      'care-drain': ['from-the-margins-of-womanhood-trans-confession', 'when-stars-fall-are-prostitutes-laughing'],
      'emotional-labor': ['when-stars-fall-are-prostitutes-laughing', 'the-road-of-slow-walkers'],
      'climate-reparations': ['myanmar-earthquake-special-article-2025', 'myanmar-on-the-tightrope'],
      'priestcraft': ['problems-for-burmas-freedom-1946', 'revolutionary-government-philosophy', 'commufemocratism-manifesto'],
      'economic-fascism': ['problems-for-burmas-freedom-1946', 'commufemocratism-manifesto', 'classrooms-of-spring-revolution'],
      'anti-hero-worship': ['problems-for-burmas-freedom-1946', 'classrooms-of-spring-revolution', 'revolutionary-government-philosophy'],
      'scientific-internationalism': ['problems-for-burmas-freedom-1946', 'myanmar-on-the-tightrope', 'phoenix-from-ashes-history-written-in-tears'],
      'university-as-public-well': ['classrooms-of-spring-revolution', 'pridi-banomyong-thammasat-inauguration-1934', 'essential-future-skills-for-youth-digital-era']
    };

    // State
    let activeCategory = 'all';
    let activeLetter = 'ALL';
    let searchQuery = '';
    let viewMode = localStorage.getItem('htet_glossary_view_mode') || 'grid';
    let savedFavorites = [];
    try {
      savedFavorites = JSON.parse(localStorage.getItem('htet_glossary_favorites') || '[]');
      if (!Array.isArray(savedFavorites)) savedFavorites = [];
    } catch (e) {
      savedFavorites = [];
    }

    // Modal state
    let activeModalTerm = null;
    let activeCiteFormat = 'apa';

    // DOM Elements
    const searchInput = document.getElementById('glossary-search');
    const searchClear = document.getElementById('glossary-search-clear');
    const categoryContainer = document.getElementById('glossary-category-filter');
    const countBadge = document.getElementById('glossary-count-badge');
    const activeCountBadge = document.getElementById('glossary-active-count');
    const activeFilterLabel = document.getElementById('glossary-active-filter-label');
    const resetFiltersBtn = document.getElementById('glossary-reset-filters-btn');
    const randomBtn = document.getElementById('glossary-random-btn');
    const favFilterBtn = document.getElementById('glossary-fav-filter-btn');
    const favCountBadge = document.getElementById('glossary-fav-count');
    const viewGridBtn = document.getElementById('glossary-view-grid');
    const viewCompactBtn = document.getElementById('glossary-view-compact');
    const azBar = document.getElementById('glossary-az-bar');

    // Detail Modal Elements
    const modal = document.getElementById('glossary-detail-modal');
    const modalBackdrop = document.getElementById('glossary-modal-backdrop');
    const modalClose = document.getElementById('glossary-modal-close');
    const modalCloseBottom = document.getElementById('glossary-modal-close-bottom');
    const modalCategoryBadge = document.getElementById('glossary-modal-category-badge');
    const modalIpa = document.getElementById('glossary-modal-ipa');
    const modalSpeechBtn = document.getElementById('glossary-modal-speech-btn');
    const modalFavBtn = document.getElementById('glossary-modal-fav-btn');
    const modalTerm = document.getElementById('glossary-modal-term');
    const modalSubterm = document.getElementById('glossary-modal-subterm');
    const modalThinker = document.getElementById('glossary-modal-thinker');
    const modalDefPrimary = document.getElementById('glossary-modal-def-primary');
    const modalDefSecondary = document.getElementById('glossary-modal-def-secondary');
    const modalContext = document.getElementById('glossary-modal-context');
    const modalCiteOutput = document.getElementById('glossary-cite-output');
    const modalCopyCiteBtn = document.getElementById('glossary-copy-cite-btn');
    const modalCiteTabs = document.getElementById('glossary-cite-format-tabs');
    const modalArticlesList = document.getElementById('glossary-modal-articles-list');
    const modalCopyLink = document.getElementById('glossary-modal-copy-link');
    const modalShareTg = document.getElementById('glossary-modal-share-tg');

    // Speech synthesis helper
    function speakTerm(englishTerm, btnEl) {
      if (!('speechSynthesis' in window)) {
        if (window.HtetUI) window.HtetUI.showToast('Speech synthesis is not supported on this device.');
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(englishTerm);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const icon = btnEl ? btnEl.querySelector('i') : null;
      if (icon) {
        icon.className = 'ri-volume-vibrate-line speech-playing';
      }

      utterance.onend = () => {
        if (icon) icon.className = 'ri-volume-up-line';
      };
      utterance.onerror = () => {
        if (icon) icon.className = 'ri-volume-up-line';
      };

      window.speechSynthesis.speak(utterance);
    }

    // Toggle favorite
    function toggleFavorite(id) {
      const idx = savedFavorites.indexOf(id);
      if (idx >= 0) {
        savedFavorites.splice(idx, 1);
        if (window.HtetUI) window.HtetUI.showToast('Bookmark removed');
      } else {
        savedFavorites.push(id);
        if (window.HtetUI) window.HtetUI.showToast('Concept bookmarked ⭐');
      }
      localStorage.setItem('htet_glossary_favorites', JSON.stringify(savedFavorites));
      updateFavBadges();
      renderGlossary();
    }

    function updateFavBadges() {
      if (favCountBadge) favCountBadge.textContent = savedFavorites.length;
    }

    // Build A-Z alphabet bar
    function initAlphabetBar() {
      if (!azBar) return;
      const initialLetters = new Set();
      terms.forEach(t => {
        if (t.term_en && t.term_en.length > 0) {
          const firstChar = t.term_en.charAt(0).toUpperCase();
          if (/[A-Z]/.test(firstChar)) {
            initialLetters.add(firstChar);
          }
        }
      });
      const sortedLetters = Array.from(initialLetters).sort();

      const pills = ['ALL', ...sortedLetters];
      azBar.innerHTML = pills.map(letter => {
        const isActive = activeLetter === letter;
        return `
          <button data-az="${letter}" class="glossary-az-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap ${
            isActive 
              ? 'bg-vermilion text-white shadow-xs font-bold' 
              : 'bg-card text-charcoal hover:bg-cream dark:hover:bg-stone-800 border border-hairline'
          }">
            ${letter}
          </button>
        `;
      }).join('');

      azBar.querySelectorAll('[data-az]').forEach(btn => {
        btn.addEventListener('click', () => {
          activeLetter = btn.getAttribute('data-az');
          azBar.querySelectorAll('[data-az]').forEach(b => {
            b.className = 'glossary-az-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap bg-card text-charcoal hover:bg-cream dark:hover:bg-stone-800 border border-hairline';
          });
          btn.className = 'glossary-az-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap bg-vermilion text-white shadow-xs';
          renderGlossary();
        });
      });
    }

    // Academic citation formatter
    function generateCitations(t) {
      const match = (t.thinker || '').match(/^([^(]+)(?:\(([^)]+)\))?/);
      const author = match ? match[1].trim() : (t.thinker || 'Htet');
      const year = match && match[2] ? match[2].trim() : '2026';
      const cleanTerm = t.term_en || 'Theoretical Term';
      const url = `https://htetofficial.github.io/glossary.html#${t.id}`;

      return {
        apa: `${author}. (${year}). ${cleanTerm} [Theoretical concept]. In Htet (Ed.), Conceptual Glossary & Philosophy Lexicon. Yangon: Htet Official Research Platform. ${url}`,
        chicago: `${author}. "${cleanTerm}." In Conceptual Glossary & Philosophy Lexicon, edited by Htet. Yangon: Htet Official, ${year}. ${url}.`,
        mla: `${author}. "${cleanTerm}." Conceptual Glossary & Philosophy Lexicon, edited by Htet, 2026, ${url}.`,
        harvard: `${author}, ${year}. '${cleanTerm}', in Htet (ed.), Conceptual Glossary & Philosophy Lexicon, Htet Official Platform, viewed ${new Date().toLocaleDateString('en-GB')}, <${url}>.`
      };
    }

    function updateModalCitation() {
      if (!activeModalTerm || !modalCiteOutput) return;
      const citations = generateCitations(activeModalTerm);
      modalCiteOutput.textContent = citations[activeCiteFormat] || citations.apa;

      if (modalCiteTabs) {
        modalCiteTabs.querySelectorAll('[data-cite]').forEach(tab => {
          const fmt = tab.getAttribute('data-cite');
          if (fmt === activeCiteFormat) {
            tab.className = 'px-2.5 py-1 rounded-lg bg-vermilion text-white font-medium cursor-pointer shadow-xs';
          } else {
            tab.className = 'px-2.5 py-1 rounded-lg bg-cream text-charcoal font-medium hover:bg-taupe-light cursor-pointer';
          }
        });
      }
    }

    // Open Deep Dive Modal
    function openConceptModal(termId) {
      const t = terms.find(x => x.id === termId);
      if (!t || !modal) return;
      activeModalTerm = t;

      const lang = window.I18n ? window.I18n.getLang() : 'mm';

      // Header info
      if (modalCategoryBadge) {
        modalCategoryBadge.textContent = lang === 'mm' ? (t.category_mm || t.category) : (t.category_en || t.category);
      }
      if (modalIpa) {
        modalIpa.textContent = t.pronunciation || '';
      }
      if (modalTerm) {
        modalTerm.textContent = lang === 'mm' ? t.term_mm : t.term_en;
      }
      if (modalSubterm) {
        modalSubterm.textContent = lang === 'mm' ? t.term_en : t.term_mm;
      }
      if (modalThinker) {
        modalThinker.textContent = t.thinker || '';
      }

      // Definitions
      if (modalDefPrimary) {
        modalDefPrimary.textContent = lang === 'mm' ? t.definition_mm : t.definition_en;
      }
      if (modalDefSecondary) {
        modalDefSecondary.textContent = lang === 'mm' ? t.definition_en : t.definition_mm;
      }
      if (modalContext) {
        modalContext.textContent = lang === 'mm' ? (t.context_mm || t.example_mm) : (t.context_en || t.example_en);
      }

      // Bookmark button state
      const isFav = savedFavorites.includes(t.id);
      if (modalFavBtn) {
        const icon = modalFavBtn.querySelector('i');
        if (icon) {
          icon.className = isFav ? 'ri-star-fill text-lg text-amber-500' : 'ri-star-line text-lg';
        }
      }

      // Audio pronounce button in modal
      if (modalSpeechBtn) {
        modalSpeechBtn.onclick = () => speakTerm(t.term_en, modalSpeechBtn);
      }

      // Citation
      activeCiteFormat = 'apa';
      updateModalCitation();

      // Related articles by Htet
      if (modalArticlesList) {
        const mappedSlugs = GLOSSARY_ARTICLE_MAP[t.id] || [];
        const related = allArticles.filter(a => mappedSlugs.includes(a.id) || mappedSlugs.includes(a.slug));

        if (related.length > 0) {
          modalArticlesList.innerHTML = related.map(art => `
            <a href="article.html?slug=${art.slug || art.id}" class="p-3 rounded-xl border border-hairline bg-cream/50 hover:bg-cream dark:bg-stone-900/40 dark:hover:bg-stone-800 transition-all flex items-start space-x-2.5 group">
              <i class="ri-article-line text-vermilion mt-0.5 text-sm shrink-0 group-hover:scale-110 transition-transform"></i>
              <div class="min-w-0">
                <span class="block text-xs font-semibold text-charcoal group-hover:text-vermilion transition-colors line-clamp-1">
                  ${lang === 'mm' ? (art.title_mm || art.title_en) : (art.title_en || art.title_mm)}
                </span>
                <span class="text-[10px] text-faint font-sans-ui block mt-0.5 line-clamp-1">
                  ${art.category_mm || art.category} • ${art.date || '2025–2026'}
                </span>
              </div>
            </a>
          `).join('');
          const relatedSec = document.getElementById('glossary-modal-related-section');
          if (relatedSec) relatedSec.classList.remove('hidden');
        } else {
          modalArticlesList.innerHTML = `
            <div class="col-span-full text-xs text-muted font-sans-ui italic">
              ${lang === 'mm' ? 'ဤသဘောတရားနှင့် တိုက်ရိုက်သက်ဆိုင်သော ဆောင်းပါးများကို ထပ်မံဖြည့်စွက်နေပါသည်။' : 'Further connected essays are being curated.'}
            </div>
          `;
        }
      }

      // Copy link & share buttons
      const directUrl = `${window.location.origin}${window.location.pathname}#${t.id}`;
      if (modalCopyLink) {
        modalCopyLink.onclick = () => {
          navigator.clipboard.writeText(directUrl).then(() => {
            if (window.HtetUI) window.HtetUI.showToast('Concept link copied to clipboard!');
          });
        };
      }
      if (modalShareTg) {
        modalShareTg.onclick = () => {
          const text = encodeURIComponent(`“${t.term_en} (${t.term_mm})” — ${t.thinker}\n\n${t.definition_mm}\n\n`);
          window.open(`https://t.me/share/url?url=${encodeURIComponent(directUrl)}&text=${text}`, '_blank');
        };
      }

      // Update URL hash cleanly
      try {
        history.replaceState(null, '', `#${t.id}`);
      } catch (e) {
        // safe ignore
      }

      // Show modal
      modal.classList.add('is-open');
      modal.classList.remove('hidden');
      setTimeout(() => {
        modal.classList.remove('opacity-0');
        const container = modal.querySelector('#glossary-modal-container');
        if (container) {
          container.classList.remove('scale-95', 'translate-y-4');
        }
      }, 10);
      document.body.classList.add('overflow-hidden');
    }

    function closeConceptModal() {
      if (!modal) return;
      modal.classList.add('opacity-0');
      const container = modal.querySelector('#glossary-modal-container');
      if (container) {
        container.classList.add('scale-95', 'translate-y-4');
      }
      setTimeout(() => {
        modal.classList.remove('is-open');
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }, 200);

      // Clean URL hash
      try {
        if (window.location.hash) {
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }
      } catch (e) {
        // safe ignore
      }
    }

    // Modal listeners
    if (modalClose) modalClose.addEventListener('click', closeConceptModal);
    if (modalCloseBottom) modalCloseBottom.addEventListener('click', closeConceptModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeConceptModal);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) {
        closeConceptModal();
      }
    });

    if (modalFavBtn) {
      modalFavBtn.addEventListener('click', () => {
        if (activeModalTerm) {
          toggleFavorite(activeModalTerm.id);
          const isFav = savedFavorites.includes(activeModalTerm.id);
          const icon = modalFavBtn.querySelector('i');
          if (icon) {
            icon.className = isFav ? 'ri-star-fill text-lg text-amber-500' : 'ri-star-line text-lg';
          }
        }
      });
    }

    if (modalCiteTabs) {
      modalCiteTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-cite]');
        if (btn) {
          activeCiteFormat = btn.getAttribute('data-cite');
          updateModalCitation();
        }
      });
    }

    if (modalCopyCiteBtn) {
      modalCopyCiteBtn.addEventListener('click', () => {
        if (modalCiteOutput && modalCiteOutput.textContent) {
          navigator.clipboard.writeText(modalCiteOutput.textContent).then(() => {
            if (window.HtetUI) window.HtetUI.showToast(`Citation copied in ${activeCiteFormat.toUpperCase()} format!`);
            if (window.confetti) {
              window.confetti({ particleCount: 25, spread: 40, origin: { y: 0.6 } });
            }
          });
        }
      });
    }

    // Search query highlight helper
    function highlightQuery(text, query) {
      if (!query || !text) return text;
      try {
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return text.replace(regex, '<mark class="glossary-highlight">$1</mark>');
      } catch (e) {
        return text;
      }
    }

    // Main render function
    function renderGlossary() {
      const lang = window.I18n ? window.I18n.getLang() : 'mm';

      const filtered = terms.filter(t => {
        // Category filter
        let matchesCategory = true;
        if (activeCategory === 'saved') {
          matchesCategory = savedFavorites.includes(t.id);
        } else if (activeCategory !== 'all') {
          matchesCategory = t.category === activeCategory;
        }

        // Letter filter
        let matchesLetter = true;
        if (activeLetter !== 'ALL') {
          const firstChar = (t.term_en || '').charAt(0).toUpperCase();
          matchesLetter = firstChar === activeLetter;
        }

        // Search query
        let matchesSearch = true;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const haystack = `${t.term_en} ${t.term_mm} ${t.definition_en} ${t.definition_mm} ${t.thinker} ${t.context_mm || ''} ${t.context_en || ''}`.toLowerCase();
          matchesSearch = haystack.includes(q);
        }

        return matchesCategory && matchesLetter && matchesSearch;
      });

      // Update counters
      if (countBadge) countBadge.textContent = terms.length;
      if (activeCountBadge) activeCountBadge.textContent = filtered.length;

      // Update category pill count badges dynamically
      if (categoryContainer) {
        const catGender = categoryContainer.querySelector('[data-category="gender"] .cat-count-badge');
        if (catGender) catGender.textContent = `(${terms.filter(t => t.category === 'gender').length})`;

        const catPhil = categoryContainer.querySelector('[data-category="philosophy"] .cat-count-badge');
        if (catPhil) catPhil.textContent = `(${terms.filter(t => t.category === 'philosophy').length})`;

        const catCrit = categoryContainer.querySelector('[data-category="critical-theory"] .cat-count-badge');
        if (catCrit) catCrit.textContent = `(${terms.filter(t => t.category === 'critical-theory').length})`;

        const catRights = categoryContainer.querySelector('[data-category="rights"] .cat-count-badge');
        if (catRights) catRights.textContent = `(${terms.filter(t => t.category === 'rights').length})`;
      }

      // Sync drawer navigation badges across the page
      document.querySelectorAll('a[href="glossary.html"].drawer-nav-item span.font-mono').forEach(el => {
        el.textContent = terms.length;
      });

      // Update filter label and reset button
      const hasActiveFilters = activeCategory !== 'all' || activeLetter !== 'ALL' || searchQuery.length > 0;
      if (resetFiltersBtn) {
        resetFiltersBtn.classList.toggle('hidden', !hasActiveFilters);
      }
      if (activeFilterLabel) {
        if (hasActiveFilters) {
          let label = '';
          if (activeCategory !== 'all') label += `ကဏ္ဍ: ${activeCategory} `;
          if (activeLetter !== 'ALL') label += `အစကားလုံး: ${activeLetter} `;
          if (searchQuery) label += `ရှာဖွေချက်: "${searchQuery}"`;
          activeFilterLabel.textContent = label.trim();
          activeFilterLabel.classList.remove('hidden');
        } else {
          activeFilterLabel.classList.add('hidden');
        }
      }

      // Empty state
      if (filtered.length === 0) {
        listContainer.className = 'grid grid-cols-1';
        listContainer.innerHTML = `
          <div class="col-span-full py-16 text-center border border-dashed border-taupe-light rounded-3xl bg-card p-6" data-aos="fade-up">
            <div class="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center mb-4 text-vermilion">
              <i class="ri-book-open-line text-3xl"></i>
            </div>
            <h4 class="font-serif-editorial text-xl font-bold text-charcoal mb-2">
              ${lang === 'mm' ? 'မည်သည့် သဘောတရားမျှ ရှာမတွေ့ပါ' : 'No conceptual terms found'}
            </h4>
            <p class="text-muted text-xs sm:text-sm font-sans-ui max-w-md mx-auto mb-5 leading-relaxed">
              ${activeCategory === 'saved' 
                ? (lang === 'mm' ? 'သင် သိမ်းဆည်းထားသော သဘောတရား မရှိသေးပါ။ ကြယ်ပွင့် (⭐) အမှတ်အသားကို နှိပ်၍ အလွယ်တကူ သိမ်းဆည်းနိုင်ပါသည်။' : 'You have not bookmarked any concepts yet. Click the star icon to save favorites.')
                : (lang === 'mm' ? 'ရှာဖွေမှု စကားလုံး သို့မဟုတ် ကဏ္ဍစစ်ထုတ်မှုကို ပြန်လည်စစ်ဆေးပေးပါ။' : 'Try adjusting your search keywords or active filters.')}
            </p>
            <button onclick="document.getElementById('glossary-reset-filters-btn').click();" class="px-4 py-2 rounded-xl bg-vermilion text-white font-medium text-xs font-sans-ui shadow-sm hover:opacity-95 transition-all">
              ${lang === 'mm' ? 'စစ်ထုတ်မှုများ အကုန်ဖျက်မည်' : 'Clear All Filters'}
            </button>
          </div>
        `;
        return;
      }

      // Apply view mode styling to container
      if (viewMode === 'compact') {
        listContainer.className = 'flex flex-col gap-3';
      } else {
        listContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6';
      }

      // Render cards
      listContainer.innerHTML = filtered.map((t, idx) => {
        const isFav = savedFavorites.includes(t.id);
        const categoryClass = `glossary-accent-${t.category}`;
        
        let categoryColorTag = 'bg-cream text-charcoal border-hairline';
        if (t.category === 'gender') categoryColorTag = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
        else if (t.category === 'philosophy') categoryColorTag = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
        else if (t.category === 'critical-theory') categoryColorTag = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
        else if (t.category === 'rights') categoryColorTag = 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';

        const termMmHighlighted = highlightQuery(t.term_mm, searchQuery);
        const termEnHighlighted = highlightQuery(t.term_en, searchQuery);
        const defMmHighlighted = highlightQuery(t.definition_mm, searchQuery);
        const defEnHighlighted = highlightQuery(t.definition_en, searchQuery);
        const thinkerHighlighted = highlightQuery(t.thinker, searchQuery);

        // COMPACT LIST VIEW
        if (viewMode === 'compact') {
          return `
            <div id="${t.id}" class="glossary-card ${categoryClass} p-3 sm:p-4 rounded-2xl border border-taupe-light bg-card transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 group" data-aos="fade-up" data-aos-delay="${Math.min(idx * 25, 300)}">
              <div class="min-w-0 flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-sans-ui font-medium border ${categoryColorTag}">
                    ${lang === 'mm' ? (t.category_mm || t.category) : (t.category_en || t.category)}
                  </span>
                  <span class="font-mono text-faint text-[10px] hidden sm:inline">${t.pronunciation || ''}</span>
                </div>
                <div class="flex flex-wrap items-baseline gap-2">
                  <h3 class="font-serif-editorial text-lg sm:text-xl font-bold text-charcoal group-hover:text-vermilion transition-colors cursor-pointer" onclick="window.HtetGlossary.openModal('${t.id}')">
                    ${lang === 'mm' ? termMmHighlighted : termEnHighlighted}
                  </h3>
                  <span class="text-xs text-faint font-sans-ui">
                    (${lang === 'mm' ? termEnHighlighted : termMmHighlighted})
                  </span>
                  <span class="text-xs text-vermilion font-medium font-sans-ui">
                    • ${thinkerHighlighted}
                  </span>
                </div>
                <p class="text-xs text-muted leading-relaxed font-sans-ui mt-1 line-clamp-2">
                  ${lang === 'mm' ? defMmHighlighted : defEnHighlighted}
                </p>
              </div>

              <div class="flex items-center justify-end space-x-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-hairline/60">
                <button onclick="window.HtetGlossary.speak('${t.term_en.replace(/'/g, "\\'")}', this)" class="p-1.5 rounded-lg hover:bg-cream text-muted hover:text-vermilion transition-colors cursor-pointer" title="Speak English Term">
                  <i class="ri-volume-up-line text-sm"></i>
                </button>
                <button onclick="window.HtetGlossary.toggleFav('${t.id}')" class="p-1.5 rounded-lg hover:bg-cream transition-colors cursor-pointer" title="Bookmark">
                  <i class="${isFav ? 'ri-star-fill text-amber-500' : 'ri-star-line text-muted hover:text-amber-500'} text-sm"></i>
                </button>
                <button onclick="window.HtetGlossary.openModal('${t.id}')" class="px-3 py-1.5 rounded-xl bg-cream hover:bg-taupe-light text-charcoal font-medium text-xs font-sans-ui transition-colors flex items-center space-x-1 cursor-pointer">
                  <span data-mm="အသေးစိတ်" data-en="Deep Dive">အသေးစိတ်</span>
                  <i class="ri-arrow-right-up-line text-xs"></i>
                </button>
              </div>
            </div>
          `;
        }

        // GRID CARD VIEW (EXPANSIVE 3D EDITORIAL)
        return `
          <div id="${t.id}" class="glossary-card ${categoryClass} p-4 sm:p-6 md:p-7 rounded-2xl sm:rounded-3xl border border-taupe-light bg-card transition-all shadow-sm flex flex-col justify-between group" data-aos="fade-up" data-aos-delay="${Math.min(idx * 40, 400)}">
            <div>
              <!-- Header Badges -->
              <div class="flex items-center justify-between mb-3 text-xs font-sans-ui">
                <span class="px-2.5 py-0.8 rounded-full text-[10px] font-medium border flex items-center space-x-1.5 ${categoryColorTag}">
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  <span>${lang === 'mm' ? (t.category_mm || t.category) : (t.category_en || t.category)}</span>
                </span>
                
                <div class="flex items-center space-x-1">
                  <span class="font-mono text-faint text-[10px] sm:text-[11px]">${t.pronunciation || ''}</span>
                  <button onclick="window.HtetGlossary.speak('${t.term_en.replace(/'/g, "\\'")}', this)" class="p-1 rounded-md hover:bg-cream text-faint hover:text-vermilion transition-colors cursor-pointer" title="Listen pronunciation">
                    <i class="ri-volume-up-line text-xs"></i>
                  </button>
                </div>
              </div>

              <!-- Term Titles -->
              <h3 class="font-serif-editorial text-xl sm:text-2xl font-bold text-charcoal mb-1 group-hover:text-vermilion transition-colors cursor-pointer leading-snug" onclick="window.HtetGlossary.openModal('${t.id}')">
                ${lang === 'mm' ? termMmHighlighted : termEnHighlighted}
              </h3>
              <div class="text-xs text-faint font-sans-ui flex flex-wrap items-center gap-1.5 mb-3 font-medium">
                <span class="text-charcoal/80 font-semibold">${lang === 'mm' ? termEnHighlighted : termMmHighlighted}</span>
                <span>•</span>
                <span class="text-vermilion">${thinkerHighlighted}</span>
              </div>

              <!-- Primary Definition -->
              <p class="text-xs sm:text-sm text-muted leading-relaxed font-sans-ui mb-4">
                ${lang === 'mm' ? defMmHighlighted : defEnHighlighted}
              </p>

              <!-- Myanmar Context Callout -->
              <div class="p-3 sm:p-3.5 rounded-xl bg-ivory border border-hairline text-xs font-sans-ui text-charcoal mb-4">
                <span class="font-semibold text-vermilion block mb-1 flex items-center space-x-1 text-[11px]">
                  <i class="ri-lightbulb-line"></i>
                  <span>${lang === 'mm' ? 'မြန်မာ့လူ့ဘောင်နှင့် ဆက်စပ်မှု' : 'Relevance in Myanmar'}</span>
                </span>
                <p class="text-muted leading-relaxed line-clamp-3">
                  ${lang === 'mm' ? (t.context_mm || t.example_mm) : (t.context_en || t.example_en)}
                </p>
              </div>
            </div>

            <!-- Card Bottom Bar -->
            <div class="pt-3.5 border-t border-hairline flex items-center justify-between text-xs font-sans-ui">
              <div class="flex items-center space-x-2">
                <span class="hanko-seal-3d px-2 py-0.5 text-[9px] rounded-full">ထက်</span>
                <button onclick="window.HtetGlossary.openModal('${t.id}')" class="text-charcoal hover:text-vermilion font-semibold transition-colors flex items-center space-x-1 text-[11px] cursor-pointer">
                  <span data-mm="အသေးစိတ်ဖတ်ရှုရန်" data-en="Deep Dive">အသေးစိတ်ဖတ်ရှုရန်</span>
                  <i class="ri-arrow-right-up-line"></i>
                </button>
              </div>

              <div class="flex items-center space-x-1">
                <!-- Favorite Toggle -->
                <button onclick="window.HtetGlossary.toggleFav('${t.id}')" class="btn-3d-tactile p-1.5 rounded-lg hover:bg-cream transition-colors cursor-pointer" title="Bookmark">
                  <i class="${isFav ? 'ri-star-fill text-amber-500' : 'ri-star-line text-muted hover:text-amber-500'} text-sm"></i>
                </button>
                <!-- Copy definition -->
                <button onclick="navigator.clipboard.writeText('“${t.term_en} (${t.term_mm})” — ${t.thinker}\\n${t.definition_mm}'); if(window.HtetUI) window.HtetUI.showToast('Concept definition copied!');" class="btn-3d-tactile p-1.5 rounded-lg hover:bg-cream text-muted hover:text-vermilion transition-colors cursor-pointer" title="Copy definition">
                  <i class="ri-file-copy-line text-sm"></i>
                </button>
                <!-- Telegram Share -->
                <button onclick="window.open('https://t.me/share/url?url=' + encodeURIComponent(window.location.origin + window.location.pathname + '#' + '${t.id}') + '&text=' + encodeURIComponent('“${t.term_en} (${t.term_mm})” — ${t.thinker}\\n${t.definition_mm}'), '_blank');" class="btn-3d-tactile p-1.5 rounded-lg hover:bg-cream text-muted hover:text-[#2AABEE] transition-colors cursor-pointer" title="Share on Telegram">
                  <i class="ri-telegram-fill text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      initAOS();
      if (typeof init3DTiltAndFloatingEffects === 'function') {
        init3DTiltAndFloatingEffects();
      }
    }

    // Expose global methods for inline HTML events
    window.HtetGlossary = {
      openModal: openConceptModal,
      closeModal: closeConceptModal,
      speak: speakTerm,
      toggleFav: toggleFavorite
    };

    // Live search event
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        if (searchClear) {
          searchClear.classList.toggle('hidden', searchQuery.length === 0);
        }
        renderGlossary();
      });

      // Clear search button
      if (searchClear) {
        searchClear.addEventListener('click', () => {
          searchInput.value = '';
          searchQuery = '';
          searchClear.classList.add('hidden');
          searchInput.focus();
          renderGlossary();
        });
      }

      // Keyboard shortcut '/' to focus search
      window.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== searchInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
          e.preventDefault();
          searchInput.focus();
        }
      });
    }

    // Category button filter click
    if (categoryContainer) {
      categoryContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-category]');
        if (btn) {
          e.preventDefault();
          activeCategory = btn.getAttribute('data-category');

          categoryContainer.querySelectorAll('[data-category]').forEach(b => {
            b.classList.remove('bg-vermilion', 'text-white', 'shadow-sm');
            b.classList.add('bg-cream', 'text-charcoal');
          });

          btn.classList.remove('bg-cream', 'text-charcoal');
          btn.classList.add('bg-vermilion', 'text-white', 'shadow-sm');

          // Reset favorites button styling
          if (favFilterBtn) {
            favFilterBtn.classList.remove('bg-amber-500/15', 'border-amber-500/50');
          }

          renderGlossary();
        }
      });
    }

    // Favorites Filter Button
    if (favFilterBtn) {
      favFilterBtn.addEventListener('click', () => {
        if (activeCategory === 'saved') {
          activeCategory = 'all';
          favFilterBtn.classList.remove('bg-amber-500/15', 'border-amber-500/50');
          const allBtn = categoryContainer.querySelector('[data-category="all"]');
          if (allBtn) {
            categoryContainer.querySelectorAll('[data-category]').forEach(b => {
              b.classList.remove('bg-vermilion', 'text-white', 'shadow-sm');
              b.classList.add('bg-cream', 'text-charcoal');
            });
            allBtn.classList.remove('bg-cream', 'text-charcoal');
            allBtn.classList.add('bg-vermilion', 'text-white', 'shadow-sm');
          }
        } else {
          activeCategory = 'saved';
          favFilterBtn.classList.add('bg-amber-500/15', 'border-amber-500/50');
          categoryContainer.querySelectorAll('[data-category]').forEach(b => {
            b.classList.remove('bg-vermilion', 'text-white', 'shadow-sm');
            b.classList.add('bg-cream', 'text-charcoal');
          });
        }
        renderGlossary();
      });
    }

    // Random Concept button ("ကျပန်း သဘောတရား")
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        const randomTerm = terms[Math.floor(Math.random() * terms.length)];
        if (randomTerm) {
          openConceptModal(randomTerm.id);
          if (window.confetti) {
            window.confetti({ particleCount: 20, spread: 35, origin: { y: 0.5 } });
          }
        }
      });
    }

    // View Mode Toggle (Grid vs Compact)
    if (viewGridBtn && viewCompactBtn) {
      function updateViewModeButtons() {
        if (viewMode === 'grid') {
          viewGridBtn.className = 'p-1.5 rounded-lg bg-vermilion text-white transition-all shadow-xs cursor-pointer';
          viewCompactBtn.className = 'p-1.5 rounded-lg text-muted hover:text-charcoal transition-all cursor-pointer';
        } else {
          viewGridBtn.className = 'p-1.5 rounded-lg text-muted hover:text-charcoal transition-all cursor-pointer';
          viewCompactBtn.className = 'p-1.5 rounded-lg bg-vermilion text-white transition-all shadow-xs cursor-pointer';
        }
      }

      viewGridBtn.addEventListener('click', () => {
        viewMode = 'grid';
        localStorage.setItem('htet_glossary_view_mode', 'grid');
        updateViewModeButtons();
        renderGlossary();
      });

      viewCompactBtn.addEventListener('click', () => {
        viewMode = 'compact';
        localStorage.setItem('htet_glossary_view_mode', 'compact');
        updateViewModeButtons();
        renderGlossary();
      });

      updateViewModeButtons();
    }

    // Reset Filters button
    if (resetFiltersBtn) {
      resetFiltersBtn.addEventListener('click', () => {
        activeCategory = 'all';
        activeLetter = 'ALL';
        searchQuery = '';
        if (searchInput) searchInput.value = '';
        if (searchClear) searchClear.classList.add('hidden');

        if (categoryContainer) {
          categoryContainer.querySelectorAll('[data-category]').forEach(b => {
            b.classList.remove('bg-vermilion', 'text-white', 'shadow-sm');
            b.classList.add('bg-cream', 'text-charcoal');
          });
          const allBtn = categoryContainer.querySelector('[data-category="all"]');
          if (allBtn) {
            allBtn.classList.remove('bg-cream', 'text-charcoal');
            allBtn.classList.add('bg-vermilion', 'text-white', 'shadow-sm');
          }
        }

        if (azBar) {
          azBar.querySelectorAll('[data-az]').forEach(b => {
            b.className = 'glossary-az-btn px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer whitespace-nowrap bg-card text-charcoal hover:bg-cream dark:hover:bg-stone-800 border border-hairline';
          });
          const allAzBtn = azBar.querySelector('[data-az="ALL"]');
          if (allAzBtn) {
            allAzBtn.className = 'glossary-az-btn px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap bg-vermilion text-white shadow-xs';
          }
        }

        if (favFilterBtn) {
          favFilterBtn.classList.remove('bg-amber-500/15', 'border-amber-500/50');
        }

        renderGlossary();
      });
    }

    // Initialize components
    updateFavBadges();
    initAlphabetBar();
    renderGlossary();

    // Check URL Hash deep-linking on page load
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetTerm = terms.find(t => t.id === targetId || t.slug === targetId);
      if (targetTerm) {
        setTimeout(() => {
          const el = document.getElementById(targetTerm.id);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('glossary-card-target');
          }
          openConceptModal(targetTerm.id);
        }, 350);
      }
    }

    // Handle hash change dynamically
    window.addEventListener('hashchange', () => {
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetTerm = terms.find(t => t.id === targetId || t.slug === targetId);
        if (targetTerm && (!activeModalTerm || activeModalTerm.id !== targetTerm.id)) {
          openConceptModal(targetTerm.id);
        }
      }
    });

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
        <div class="glass-3d-card card-3d-interactive p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-taupe-light bg-card transition-all shadow-sm group" data-aos="fade-up" data-aos-delay="${(idx % 6) * 60}">
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
    const counterEl = document.getElementById('daily-quote-counter');
    const copyBtn = document.getElementById('daily-quote-copy');
    const shareBtn = document.getElementById('daily-quote-share');

    function updateQuote(index, animate = true) {
      const q = quotes[index];
      const lang = window.I18n ? window.I18n.getLang() : 'mm';

      if (counterEl) {
        counterEl.textContent = `${index + 1}/${quotes.length}`;
      }

      if (textEl) {
        const text = (lang === 'mm') ? q.quote_mm : (q[`quote_${lang}`] || q.quote_en);
        if (animate) {
          textEl.style.opacity = '0';
          textEl.style.transform = 'translateY(4px)';
          setTimeout(() => {
            textEl.textContent = `“${text}”`;
            textEl.style.opacity = '1';
            textEl.style.transform = 'translateY(0)';
          }, 150);
        } else {
          textEl.textContent = `“${text}”`;
          textEl.style.opacity = '1';
          textEl.style.transform = 'translateY(0)';
        }
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
        updateQuote(currentIndex, true);

        // Tactile icon spin + pulse feedback on click/tap
        nextBtn.classList.remove('is-clicked');
        void nextBtn.offsetWidth;
        nextBtn.classList.add('is-clicked');
        setTimeout(() => nextBtn.classList.remove('is-clicked'), 520);
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

  // 18. Dynamic Featured Essays on index.html (with Uncropped Full Covers + Instant Topic Tabs)
  async function initFeaturedArticlesOnIndex() {
    const container = document.getElementById('index-featured-articles');
    if (!container || !window.HtetData) return;

    try {
      const articles = await window.HtetData.getArticles();
      if (!Array.isArray(articles) || articles.length === 0) return;

      const filterBar = document.getElementById('index-featured-filter');
      let activeTopic = 'latest';

      const escHtml = (str) => String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

      const mmDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
      function toBurmeseDigits(numStr) {
        return String(numStr).replace(/[0-9]/g, d => mmDigits[d]);
      }

      const topicMatchers = {
        geopolitics: (hay) => /နိုင်ငံရေး|ပထဝီ|တော်လှန်ရေး|ဖက်ဒရယ်|အာဏာ|လူ့ဘောင်သစ်|politic|geopolitic|federal|commufemocrat|tightrope|revolutionary|systemicfear|election/.test(hay),
        feminism: (hay) => /ဖီမင်|ဖီမီနစ်|ကျား|ဂျန်ဒါ|အမျိုးသမီး|trans|lgbtq|gender|feminis|cisgender|womanhood|bodily|consent|apartheid|clothing|dream/.test(hay),
        archives: (hay, art) => art.category === 'historical-archive' || /သမိုင်း|မော်ကွန်း|ဘာသာပြန်|နိုဘယ်|မင်ဒဲလား|အောင်ဆန်း|ပရီဒီ|ဟယ်လင်|historical|archive|nobel|mandela|suu kyi|aung san|pridi|sakharov|translation/.test(hay)
      };

      function getFilteredFeatured() {
        if (activeTopic === 'latest' || !topicMatchers[activeTopic]) {
          return articles.slice(0, 6);
        }
        const matcher = topicMatchers[activeTopic];
        const matched = articles.filter(art => {
          const hay = [
            art.category, art.category_mm, art.category_en,
            ...(art.categories_mm || []), ...(art.categories_en || []),
            ...(art.tags || []), art.title_mm, art.title_en
          ].filter(Boolean).join(' ').toLowerCase();
          return matcher(hay, art);
        });
        return matched.slice(0, 6);
      }

      function renderFeatured() {
        const lang = window.I18n ? window.I18n.getLang() : 'mm';
        const featured = getFilteredFeatured();

        container.innerHTML = featured.map((art, idx) => {
          const id = art.id || art.slug;
          const title = (lang === 'mm') ? (art.title_mm || art.title_en) : (art.title_en || art.title_mm);
          const excerpt = (lang === 'mm') ? (art.excerpt_mm || art.excerpt_en) : (art.excerpt_en || art.excerpt_mm);
          const cat = (lang === 'mm')
            ? (art.category_mm || art.category_en || 'ဆောင်းပါးနှင့် စာတမ်း')
            : (art.category_en || art.category_mm || 'Research Article');
          const readTime = (lang === 'mm')
            ? (art.read_time_mm || (art.reading_time ? `${toBurmeseDigits(parseInt(art.reading_time) || 6)} မိနစ် ဖတ်ရှုရန်` : '၁၂ မိနစ် ဖတ်ရှုရန်'))
            : (art.read_time_en || art.reading_time || '12 min read');
          const citationsCount = Array.isArray(art.citations) ? art.citations.length : (Array.isArray(art.references) ? art.references.length : 0);
          const citationsLabel = (lang === 'mm')
            ? `${toBurmeseDigits(citationsCount)} စာကိုး`
            : `${citationsCount} Cites`;
          const imgSrc = art.image || art.cover_image || '';

          return `
            <article class="glass-3d-card card-3d-interactive rounded-2xl sm:rounded-3xl border border-taupe-light flex flex-col justify-between overflow-hidden group shadow-sm hover:shadow-md" data-aos="fade-up" data-aos-delay="${Math.min((idx + 1) * 55, 250)}">
              <div>
                ${imgSrc ? `
                  <a href="article.html?id=${escHtml(id)}" class="index-featured-cover-stage block" aria-label="${escHtml(title)}">
                    <img src="${escHtml(imgSrc)}" alt="${escHtml(title)}" class="index-featured-cover-img" loading="lazy" decoding="async">
                  </a>
                ` : ''}

                <div class="p-4 sm:p-6 pb-3">
                  <div class="flex flex-wrap items-center gap-1.5 text-[11px] text-faint font-sans-ui mb-3">
                    <span class="glass-3d-pill px-2.5 py-0.5 text-charcoal font-medium border border-hairline inline-flex items-center space-x-1 shadow-2xs max-w-full">
                      <i class="ri-quill-pen-line text-vermilion shrink-0" aria-hidden="true"></i>
                      <span class="truncate max-w-[14rem]">${escHtml(cat)}</span>
                    </span>
                    <span class="text-hairline" aria-hidden="true">•</span>
                    <span class="inline-flex items-center space-x-1">
                      <i class="ri-time-line text-muted" aria-hidden="true"></i>
                      <span>${escHtml(readTime)}</span>
                    </span>
                    ${citationsCount > 0 ? `
                      <span class="text-hairline" aria-hidden="true">•</span>
                      <span class="inline-flex items-center space-x-1 text-vermilion/90 font-medium">
                        <i class="ri-book-mark-line" aria-hidden="true"></i>
                        <span>${escHtml(citationsLabel)}</span>
                      </span>
                    ` : ''}
                  </div>

                  <h3 class="font-serif-editorial text-xl sm:text-[1.35rem] font-semibold text-charcoal group-hover:text-vermilion transition-colors leading-[1.42] mb-2.5">
                    <a href="article.html?id=${escHtml(id)}" class="hover:underline">
                      <span>${escHtml(title)}</span>
                    </a>
                  </h3>

                  <p class="text-muted text-xs sm:text-[13.5px] leading-[1.9] font-sans-ui line-clamp-3 m-0">
                    ${escHtml(excerpt)}
                  </p>
                </div>
              </div>

              <div class="px-4 sm:px-6 pb-4 sm:pb-5 pt-3 mt-2 border-t border-hairline flex flex-wrap items-center justify-between gap-2 text-xs font-sans-ui">
                <span class="text-faint inline-flex items-center space-x-1">
                  <i class="ri-calendar-line" aria-hidden="true"></i>
                  <span>${escHtml(art.date || '2026')}</span>
                </span>
                <div class="flex flex-wrap items-center gap-1.5">
                  ${art.pdf_file ? `
                    <a href="${escHtml(art.pdf_file.startsWith('downloads/') ? art.pdf_file : 'downloads/' + art.pdf_file)}" download class="btn-3d-tactile px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 font-semibold border border-red-200 dark:border-red-900/60 inline-flex items-center space-x-1 transition-all shadow-2xs" aria-label="${escHtml('Download PDF — ' + title)}">
                      <i class="ri-file-pdf-line text-red-500" aria-hidden="true"></i>
                      <span>PDF</span>
                    </a>
                  ` : ''}
                  <button type="button" class="btn-3d-tactile article-card-lang-toggle-btn px-2 py-1.5 rounded-xl border border-hairline bg-cream hover:bg-taupe-light dark:bg-zinc-800 text-charcoal font-medium text-xs inline-flex items-center space-x-1 cursor-pointer transition-all shadow-2xs" data-article-id="${escHtml(id)}" data-showing-original="${lang === 'mm' ? 'true' : 'false'}" aria-label="${escHtml(lang === 'mm' ? 'Switch to English summary — ' + title : 'View original Burmese — ' + title)}">
                    <span class="lang-toggle-flag text-xs" aria-hidden="true">${lang === 'mm' ? '🌐' : '🇲🇲'}</span>
                    <span class="lang-toggle-label text-[11px] font-sans-ui">${lang === 'mm' ? 'EN' : 'MM'}</span>
                  </button>
                  <a href="article.html?id=${escHtml(id)}" class="btn-3d-tactile px-3 py-1.5 rounded-xl bg-vermilion text-white font-semibold inline-flex items-center space-x-1 hover:bg-vermilion-dark transition-all shadow-xs">
                    <i class="ri-book-open-line text-xs" aria-hidden="true"></i>
                    <span>${lang === 'mm' ? 'ဖတ်ရှုရန်' : 'Read'}</span>
                    <span class="visually-hidden"> — ${escHtml(title)}</span>
                  </a>
                </div>
              </div>
            </article>
          `;
        }).join('');

        init3DTiltAndFloatingEffects();
      }

      if (filterBar) {
        filterBar.addEventListener('click', (e) => {
          const tab = e.target.closest('[data-index-topic]');
          if (!tab) return;
          activeTopic = tab.getAttribute('data-index-topic') || 'latest';
          filterBar.querySelectorAll('[data-index-topic]').forEach(btn => {
            const isMatch = btn === tab;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
          });
          renderFeatured();
        });
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
        const willShowOriginal = !isShowingOriginal;

        btn.setAttribute('data-showing-original', willShowOriginal ? 'true' : 'false');
        const flagEl = btn.querySelector('.lang-toggle-flag');
        const labelEl = btn.querySelector('.lang-toggle-label');
        if (flagEl) flagEl.textContent = willShowOriginal ? '🌐' : '🇲🇲';
        if (labelEl) labelEl.textContent = willShowOriginal ? 'EN' : 'MM';

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
            : 'English ဘာသာပြန်အနှစ်ချုပ်သို့ ပြောင်းလဲပြသထားပါသည် ✓');
        }
      });
    } catch (err) {
      console.warn('[initFeaturedArticlesOnIndex] Failed to render featured essays:', err);
    }
  }

  // 19. Copy Bio Text Engine (Invoker Commands + Async Clipboard + Accessible Status Bubble)
  const bioCopyTimers = new WeakMap();
  let lastBioCopyMessage = '';

  function legacyCopyText(text) {
    const field = Object.assign(document.createElement('textarea'), { value: text });
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
    document.body.append(field);
    field.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      field.remove();
    }
  }

  function reportBioCopy(button, ok) {
    if (!button) return;
    const tip = button.nextElementSibling && button.nextElementSibling.getAttribute('role') === 'status'
      ? button.nextElementSibling
      : null;

    clearTimeout(bioCopyTimers.get(button));
    button.removeAttribute('data-copied');
    button.removeAttribute('data-failed');

    let message = ok ? 'ကူးယူပြီးပါပြီ ✓ (Copied)' : 'ကူးယူမရပါ — ကျေးဇူးပြု၍ ကိုယ်တိုင် Select လုပ်ကူးယူပါ (Copy failed)';
    if (message === lastBioCopyMessage) message += '\u00A0'; // VoiceOver re-announcement guard
    lastBioCopyMessage = message;

    if (tip) tip.textContent = '';
    void button.offsetWidth; // restart feedback animation on repeat clicks
    button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
    if (tip) {
      requestAnimationFrame(() => {
        tip.textContent = message;
      });
    }

    bioCopyTimers.set(button, setTimeout(() => {
      button.removeAttribute('data-copied');
      button.removeAttribute('data-failed');
      if (tip) tip.textContent = '';
    }, 2200));

    showToast(ok ? 'Bio စာသားကို ကူးယူပြီးပါပြီ (Copied to clipboard) ✓' : 'Clipboard ခွင့်ပြုချက် မရရှိပါ (Copy failed)');
  }

  async function copyBioTarget(button, target) {
    if (!target) return;
    if (navigator.vibrate) try { navigator.vibrate(15); } catch (err) {}
    const text = target.matches('input, textarea')
      ? target.value.trim()
      : (target.innerText || target.textContent || '').replace(/\s+\n/g, '\n').trim();
    if (!text) return;

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else if (!legacyCopyText(text)) {
        throw new Error('Copy failed');
      }
      reportBioCopy(button, true);
    } catch {
      if (legacyCopyText(text)) {
        reportBioCopy(button, true);
      } else {
        reportBioCopy(button, false);
      }
    }
  }

  // Backward-compatible global helper
  window.copyBioText = function(elementId, btn) {
    const el = document.getElementById(elementId);
    if (el) copyBioTarget(btn, el);
  };

  // Native Invoker Commands (`command="--copy" commandfor="..."`) with single-path fallback
  if ('CommandEvent' in window) {
    document.addEventListener('command', (event) => {
      if (event.command && event.command.startsWith('--copy')) {
        copyBioTarget(event.source, event.target);
      }
    }, true);
  } else {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('button[command^="--copy"]');
      if (!button) return;
      const target = document.getElementById(button.getAttribute('commandfor'));
      if (target) copyBioTarget(button, target);
    });
  }

  // 19b. Accessible Bio Snippets Tabs (Arrow Keys, hidden="until-found" beforematch, Global Sync)
  function initBioCardTabs() {
    const bioCards = Array.from(document.querySelectorAll('.bio-card'));
    if (!bioCards.length) return;

    function applyCardTabMode(card, mode, focusSelected = false) {
      const buttons = Array.from(card.querySelectorAll('.bio-tab-btn'));
      const selectedBtn = buttons.find(b => b.dataset.bioTab === mode) || buttons[0];
      if (!selectedBtn) return;

      buttons.forEach(b => {
        const isSelected = b === selectedBtn;
        b.classList.toggle('active', isSelected);
        b.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        b.setAttribute('tabindex', isSelected ? '0' : '-1');
      });

      if (focusSelected) selectedBtn.focus();

      const mmBlock = card.querySelector('.bio-block-mm');
      const enBlock = card.querySelector('.bio-block-en');

      if (mode === 'mm') {
        if (mmBlock) mmBlock.removeAttribute('hidden');
        if (enBlock) enBlock.setAttribute('hidden', 'until-found');
      } else if (mode === 'en') {
        if (mmBlock) mmBlock.setAttribute('hidden', 'until-found');
        if (enBlock) enBlock.removeAttribute('hidden');
      } else {
        if (mmBlock) mmBlock.removeAttribute('hidden');
        if (enBlock) enBlock.removeAttribute('hidden');
      }
    }

    bioCards.forEach(card => {
      const tabGroup = card.querySelector('.bio-card-tabs');
      if (!tabGroup) return;
      const buttons = Array.from(tabGroup.querySelectorAll('.bio-tab-btn'));

      buttons.forEach((btn, idx) => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (navigator.vibrate) try { navigator.vibrate(12); } catch (err) {}
          applyCardTabMode(card, btn.dataset.bioTab);
        });

        btn.addEventListener('keydown', (e) => {
          let nextIdx = null;
          if (e.key === 'ArrowRight') nextIdx = (idx + 1) % buttons.length;
          else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + buttons.length) % buttons.length;
          else if (e.key === 'Home') nextIdx = 0;
          else if (e.key === 'End') nextIdx = buttons.length - 1;
          if (nextIdx !== null) {
            e.preventDefault();
            applyCardTabMode(card, buttons[nextIdx].dataset.bioTab, true);
          }
        });
      });

      // Sync tab state automatically if browser Find-in-Page matches hidden="until-found" text
      const mmBlock = card.querySelector('.bio-block-mm');
      const enBlock = card.querySelector('.bio-block-en');
      if (mmBlock) mmBlock.addEventListener('beforematch', () => applyCardTabMode(card, 'mm'));
      if (enBlock) enBlock.addEventListener('beforematch', () => applyCardTabMode(card, 'en'));
    });

    // Global Language Sync Buttons (flip all 4 bio cards at once)
    const globalBtns = Array.from(document.querySelectorAll('[data-bio-global-lang]'));
    globalBtns.forEach(gBtn => {
      gBtn.addEventListener('click', () => {
        const mode = gBtn.dataset.bioGlobalLang;
        globalBtns.forEach(b => b.setAttribute('aria-pressed', b === gBtn ? 'true' : 'false'));
        bioCards.forEach(card => applyCardTabMode(card, mode));
      });
    });
  }

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

  async function syncGlobalDynamicCounts() {
    if (!window.HtetData) return;
    const nodes = document.querySelectorAll('[data-dynamic-count]');
    if (!nodes || nodes.length === 0) return;
    try {
      const setCount = (key, val) => {
        document.querySelectorAll(`[data-dynamic-count="${key}"]`).forEach(el => {
          el.textContent = val;
        });
      };
      if (document.querySelector('[data-dynamic-count="articles"]') && typeof window.HtetData.getArticles === 'function') {
        const list = await window.HtetData.getArticles();
        setCount('articles', list.length);
      }
      if (document.querySelector('[data-dynamic-count="publications"]') && typeof window.HtetData.getPublications === 'function') {
        const list = await window.HtetData.getPublications();
        setCount('publications', list.length);
      }
      if (document.querySelector('[data-dynamic-count="posts"]') && typeof window.HtetData.getPosts === 'function') {
        const list = await window.HtetData.getPosts();
        setCount('posts', list.length);
      }
      if (document.querySelector('[data-dynamic-count="glossary"]') && typeof window.HtetData.getGlossary === 'function') {
        const list = await window.HtetData.getGlossary();
        setCount('glossary', list.length);
      }
      if (document.querySelector('[data-dynamic-count="quotes"]') && typeof window.HtetData.getQuotes === 'function') {
        const list = window.HtetData.getQuotes() || [];
        setCount('quotes', list.length);
      }
    } catch (_) {}
  }

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initAppBottomNav();
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
    initBioCardTabs();
    init3DTiltAndFloatingEffects();
    syncGlobalDynamicCounts();
  });

  
  window.HtetUI = {
    showToast,
    BookmarkSystem,
    initDynamicMetrics,
    initFeaturedArticlesOnIndex,
    init3DTiltAndFloatingEffects
  };
})();
