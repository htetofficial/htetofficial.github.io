/**
 * Htet Official — Telegram Mini App (TMA) & WebApp Engine
 * Seamless integration for Telegram iOS, Android, Desktop, and Web
 * Supports Theme Sync, Native BackButton, MainButton, Haptics, CloudStorage, Safe-Area & Instant View Sharing
 */

(function() {
  'use strict';

  var tg = (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;

  var TelegramMiniApp = {
    isAvailable: !!tg,
    user: (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) ? tg.initDataUnsafe.user : null,
    platform: (tg && tg.platform) ? tg.platform : 'unknown',
    version: (tg && tg.version) ? tg.version : 'unknown',
    colorScheme: (tg && tg.colorScheme) ? tg.colorScheme : 'light',

    init: function() {
      if (!tg) {
        // Not running inside Telegram WebApp
        return;
      }

      try {
        // 1. Mark DOM root
        document.documentElement.classList.add('telegram-webapp');
        if (document.body) document.body.classList.add('telegram-webapp');

        // 2. Expand viewport to 100% height (eliminates initial sheet swipe threshold)
        if (typeof tg.expand === 'function') {
          tg.expand();
        }

        // 3. Enable closing confirmation to prevent accidental swipe dismissals
        if (typeof tg.enableClosingConfirmation === 'function') {
          tg.enableClosingConfirmation();
        }

        // 4. Synchronize Theme & Colors with Telegram
        this.syncTheme();
        if (typeof tg.onEvent === 'function') {
          tg.onEvent('themeChanged', function() {
            TelegramMiniApp.syncTheme();
          });
          tg.onEvent('viewportChanged', function() {
            if (!tg.isExpanded && typeof tg.expand === 'function') {
              tg.expand();
            }
          });
        }

        // 5. Setup Native BackButton Navigation
        this.setupBackButton();

        // 6. Setup Haptic Feedback on interactive elements
        this.bindHaptics();

        // 7. Inject Telegram Safe-Area CSS Variables
        this.applySafeAreaStyles();

        // 8. Personalize greeting if user is known
        this.displayUserBadge();

        // 9. Notify Telegram the WebApp is ready
        if (typeof tg.ready === 'function') {
          tg.ready();
        }

        console.log('[Htet Mini App] Telegram WebApp initialized:', {
          platform: this.platform,
          version: this.version,
          user: this.user ? (this.user.username || this.user.first_name) : 'guest'
        });
      } catch (err) {
        console.warn('[Htet Mini App] Init error:', err);
      }
    },

    /**
     * Synchronize site theme with Telegram themeParams & colorScheme
     */
    syncTheme: function() {
      if (!tg) return;

      var scheme = tg.colorScheme || 'light';
      var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      var isDark = (scheme === 'dark');

      // If user theme mode doesn't match Telegram color scheme, sync it
      if (isDark && currentTheme !== 'dark' && currentTheme !== 'amoled') {
        if (window.ThemeManager && typeof window.ThemeManager.setTheme === 'function') {
          window.ThemeManager.setTheme('dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.documentElement.classList.add('dark');
        }
      } else if (!isDark && (currentTheme === 'dark' || currentTheme === 'amoled')) {
        if (window.ThemeManager && typeof window.ThemeManager.setTheme === 'function') {
          window.ThemeManager.setTheme('light');
        } else {
          document.documentElement.setAttribute('data-theme', 'light');
          document.documentElement.classList.remove('dark');
        }
      }

      // Update Telegram header & background color to Japanese Editorial tones
      try {
        var headerColor = isDark ? '#141312' : '#FAF8F5';
        var bgColor = isDark ? '#121110' : '#FAF8F5';

        if (typeof tg.setHeaderColor === 'function') {
          tg.setHeaderColor(headerColor);
        }
        if (typeof tg.setBackgroundColor === 'function') {
          tg.setBackgroundColor(bgColor);
        }
        if (typeof tg.setBottomBarColor === 'function') {
          tg.setBottomBarColor(headerColor);
        }
      } catch (e) {}
    },

    /**
     * Setup Telegram's Native BackButton for subpages and modals
     */
    setupBackButton: function() {
      if (!tg || !tg.BackButton) return;

      var path = window.location.pathname.split('/').pop() || 'index.html';
      var isRoot = (path === '' || path === 'index.html');

      // If on a subpage or reader, show Telegram BackButton
      if (!isRoot) {
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }

      // Handle BackButton click
      tg.BackButton.onClick(function() {
        TelegramMiniApp.haptic('light');

        // Check if any open modals or drawers exist
        var modalSelectors = [
          '#journal-reader-modal.is-open',
          '#spotlight-modal:not(.hidden)',
          '#mobile-menu-drawer.is-open',
          '#libre-settings-modal:not(.hidden)',
          '#reading-settings-modal:not(.hidden)'
        ];

        for (var i = 0; i < modalSelectors.length; i++) {
          var openModal = document.querySelector(modalSelectors[i]);
          if (openModal) {
            // Close modal
            if (openModal.id === 'mobile-menu-drawer' && window.MobileMenu) {
              window.MobileMenu.close();
              return;
            }
            if (openModal.id === 'spotlight-modal') {
              openModal.classList.add('hidden');
              return;
            }
            if (openModal.id === 'journal-reader-modal' && window.JournalApp) {
              window.JournalApp.closeModal();
              return;
            }
            openModal.classList.add('hidden');
            return;
          }
        }

        // If on article.html, navigate back to articles or index
        if (path === 'article.html') {
          if (document.referrer && document.referrer.indexOf(window.location.host) !== -1) {
            window.history.back();
          } else {
            window.location.href = 'articles.html';
          }
          return;
        }

        // If on another subpage, navigate to index.html
        if (!isRoot) {
          if (window.history.length > 1 && document.referrer && document.referrer.indexOf(window.location.host) !== -1) {
            window.history.back();
          } else {
            window.location.href = 'index.html';
          }
        }
      });
    },

    /**
     * Haptic feedback helper
     * @param {'light'|'medium'|'heavy'|'rigid'|'soft'|'selection'|'success'|'warning'|'error'} style
     */
    haptic: function(style) {
      if (!tg || !tg.HapticFeedback) return;
      try {
        if (style === 'selection') {
          tg.HapticFeedback.selectionChanged();
        } else if (style === 'success' || style === 'warning' || style === 'error') {
          tg.HapticFeedback.notificationOccurred(style);
        } else {
          tg.HapticFeedback.impactOccurred(style || 'light');
        }
      } catch (e) {}
    },

    /**
     * Bind haptic feedback to buttons and interactive cards
     */
    bindHaptics: function() {
      if (!tg || !tg.HapticFeedback) return;

      document.addEventListener('click', function(e) {
        var target = e.target.closest('button, .nav-link-pill, .drawer-nav-item, .dict-tab-btn, .touch-target, a[href]');
        if (target) {
          TelegramMiniApp.haptic('light');
        }
      }, { passive: true });
    },

    /**
     * Apply Telegram Safe-Area CSS variables
     */
    applySafeAreaStyles: function() {
      var style = document.createElement('style');
      style.id = 'telegram-webapp-safe-area';
      style.textContent = [
        ':root {',
        '  --tg-viewport-height: 100vh;',
        '  --tg-viewport-stable-height: 100vh;',
        '}',
        'html.telegram-webapp body {',
        '  padding-bottom: env(safe-area-inset-bottom, 16px);',
        '  overscroll-behavior-y: contain;',
        '}',
        'html.telegram-webapp .tg-hide { display: none !important; }',
        'html.telegram-webapp .tg-only { display: block !important; }',
        '.tg-user-greeting {',
        '  display: inline-flex;',
        '  align-items: center;',
        '  gap: 6px;',
        '  padding: 4px 10px;',
        '  border-radius: 9999px;',
        '  font-size: 11px;',
        '  background: rgba(42, 171, 238, 0.12);',
        '  color: #2AABEE;',
        '  border: 1px solid rgba(42, 171, 238, 0.3);',
        '}'
      ].join('\n');
      document.head.appendChild(style);
    },

    /**
     * Display subtle Telegram user greeting pill if user info exists
     */
    displayUserBadge: function() {
      if (!this.user) return;

      var name = this.user.first_name || (this.user.username ? '@' + this.user.username : 'User');
      var greetingContainers = document.querySelectorAll('.telegram-greeting-slot');

      greetingContainers.forEach(function(el) {
        el.innerHTML = '<span class="tg-user-greeting"><i class="ri-telegram-fill"></i><span>မင်္ဂလာပါ ' + escapeHtml(name) + '</span></span>';
      });
    },

    /**
     * Configure Telegram native MainButton
     * @param {Object} opts { text, onClick, color, textColor, isVisible }
     */
    setMainButton: function(opts) {
      if (!tg || !tg.MainButton) return;

      if (!opts || !opts.isVisible) {
        tg.MainButton.hide();
        return;
      }

      if (opts.text) tg.MainButton.setText(opts.text);
      if (opts.color) tg.MainButton.setParams({ color: opts.color, text_color: opts.textColor || '#ffffff' });

      if (opts.onClick) {
        tg.MainButton.offClick(this._mainButtonClick);
        this._mainButtonClick = function() {
          TelegramMiniApp.haptic('medium');
          opts.onClick();
        };
        tg.MainButton.onClick(this._mainButtonClick);
      }

      tg.MainButton.show();
      tg.MainButton.enable();
    },

    hideMainButton: function() {
      if (tg && tg.MainButton) {
        tg.MainButton.hide();
      }
    },

    /**
     * Share article or page to Telegram chat with Instant View compatibility
     * @param {string} title
     * @param {string} url
     * @param {string} [ivRhash] Optional Instant View template hash
     */
    shareArticle: function(title, url, ivRhash) {
      this.haptic('medium');
      var shareUrl = url || window.location.href;

      // If IV rhash provided, construct Instant View url
      if (ivRhash) {
        shareUrl = 'https://t.me/iv?url=' + encodeURIComponent(shareUrl) + '&rhash=' + ivRhash;
      }

      var text = (title ? title + '\n\n' : '') + 'ထက် (Htet) ၏ တရားဝင် စာဖတ်ခန်းမှ မျှဝေပါသည်။';
      var tgIntentUrl = 'https://t.me/share/url?url=' + encodeURIComponent(shareUrl) + '&text=' + encodeURIComponent(text);

      if (tg && typeof tg.openTelegramLink === 'function') {
        tg.openTelegramLink(tgIntentUrl);
      } else {
        window.open(tgIntentUrl, '_blank', 'noopener,noreferrer');
      }
    },

    /**
     * Open external link via Telegram safe handler
     */
    openLink: function(url) {
      if (tg && typeof tg.openLink === 'function') {
        tg.openLink(url);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      TelegramMiniApp.init();
    });
  } else {
    TelegramMiniApp.init();
  }

  // Export to global scope
  window.TelegramMiniApp = TelegramMiniApp;
})();
