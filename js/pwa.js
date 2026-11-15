/**
 * Htet Official PWA Engine & Cross-Platform Native Installer
 * Specialized for Android, iOS, iPadOS, macOS, and Windows
 */
(function() {
  'use strict';

  const PWA = {
    deferredPrompt: null,
    isStandalone: false,
    platform: 'unknown',

    init() {
      this.detectPlatform();
      this.checkStandalone();
      this.registerServiceWorker();
      this.bindInstallPrompt();
      this.bindNetworkStatus();
      this.injectInstallUI();
    },

    detectPlatform() {
      const ua = navigator.userAgent || '';
      const platform = navigator.platform || '';

      const isIOS = /iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isIPad = /iPad/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      const isAndroid = /Android/.test(ua);
      const isMac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(ua) && !isIOS;
      const isWindows = /Win32|Win64|Windows|WinCE/.test(ua);

      if (isIPad) this.platform = 'ipados';
      else if (isIOS) this.platform = 'ios';
      else if (isAndroid) this.platform = 'android';
      else if (isMac) this.platform = 'mac';
      else if (isWindows) this.platform = 'windows';
      else this.platform = 'desktop';

      document.documentElement.setAttribute('data-os', this.platform);
    },

    checkStandalone() {
      this.isStandalone = (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://')
      );
      if (this.isStandalone) {
        document.documentElement.classList.add('is-pwa-standalone');
      }
    },

    registerServiceWorker() {
      if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js', { scope: './' })
            .then((registration) => {
              // Check for SW updates
              registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.showUpdateBanner(newWorker);
                  }
                });
              });
            })
            .catch((err) => {
              console.warn('[PWA] Service Worker registration failed:', err);
            });
        });
      }
    },

    showUpdateBanner(worker) {
      if (document.getElementById('pwa-update-banner')) return;
      const banner = document.createElement('div');
      banner.id = 'pwa-update-banner';
      banner.className = 'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 p-4 rounded-2xl bg-card border border-hairline shadow-2xl flex items-center justify-between gap-3 animate-slide-up backdrop-blur-xl';
      banner.innerHTML = `
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-xl bg-vermilion/10 text-vermilion flex items-center justify-center text-lg shrink-0">
            <i class="ri-refresh-line animate-spin"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-charcoal">အပ်ဒိတ်အသစ် ရရှိနေပါပြီ</div>
            <div class="text-[11px] text-muted">အသစ်ထွက်ရှိသော စာမူများကို ဖတ်ရှုရန်</div>
          </div>
        </div>
        <button id="pwa-update-now-btn" class="px-3.5 py-1.5 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-vermilion-hover transition-all shrink-0">
          အပ်ဒိတ်
        </button>
      `;
      document.body.appendChild(banner);

      const updateBtn = document.getElementById('pwa-update-now-btn');
      if (updateBtn) {
        updateBtn.addEventListener('click', () => {
          worker.postMessage({ type: 'SKIP_WAITING' });
          banner.remove();
          window.location.reload();
        });
      }
    },

    bindInstallPrompt() {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent default mini-infobar on mobile Chrome
        e.preventDefault();
        this.deferredPrompt = e;
        this.renderInstallButton();
      });

      window.addEventListener('appinstalled', () => {
        this.deferredPrompt = null;
        this.isStandalone = true;
        document.documentElement.classList.add('is-pwa-standalone');
        this.hideInstallUI();
        if (window.HtetUI && window.HtetUI.showToast) {
          window.HtetUI.showToast('ထက် (Htet) App အား အောင်မြင်စွာ ထည့်သွင်းပြီးပါပြီ!');
        }
      });
    },

    bindNetworkStatus() {
      window.addEventListener('online', () => {
        if (window.HtetUI && window.HtetUI.showToast) {
          window.HtetUI.showToast('အင်တာနက် လိုင်းပြန်လည်ရရှိပါပြီ (Online)');
        }
      });

      window.addEventListener('offline', () => {
        if (window.HtetUI && window.HtetUI.showToast) {
          window.HtetUI.showToast('အော့ဖ်လိုင်းမုဒ်သို့ ရောက်ရှိနေပါသည် (Offline)');
        }
      });
    },

    renderInstallButton() {
      // Reveal any static install buttons with [data-pwa-install]
      document.querySelectorAll('[data-pwa-install]').forEach(btn => {
        btn.classList.remove('hidden');
        btn.style.display = 'inline-flex';
      });

      // Show bottom install pill if not dismissed recently
      const dismissed = localStorage.getItem('htet_pwa_dismissed');
      if (!dismissed && !this.isStandalone) {
        this.showFloatingInstallPill();
      }
    },

    showFloatingInstallPill() {
      if (document.getElementById('pwa-floating-pill') || this.isStandalone) return;

      const pill = document.createElement('div');
      pill.id = 'pwa-floating-pill';
      pill.className = 'fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 p-3 sm:p-3.5 rounded-2xl border border-hairline/80 bg-card/95 dark:bg-[#181614]/95 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 animate-fade-in transition-all';
      
      const isApple = this.platform === 'ios' || this.platform === 'ipados';

      pill.innerHTML = `
        <div class="flex items-center space-x-2.5 overflow-hidden">
          <div class="nav-brand-glass-icon w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
            <img src="assets/favicon.svg" alt="ထက်" class="w-full h-full object-contain">
          </div>
          <div class="truncate">
            <div class="text-xs font-bold text-charcoal leading-snug">ထက် (Htet) App</div>
            <div class="text-[10px] text-muted truncate">${isApple ? 'Home Screen တွင် ထည့်သွင်းဖတ်ရှုရန်' : 'ဖုန်းနှင့် ကွန်ပျူတာတွင် အက်ပ်သွင်းရန်'}</div>
          </div>
        </div>

        <div class="flex items-center space-x-1.5 shrink-0">
          <button id="pwa-action-install-btn" class="px-3 py-1.5 rounded-full bg-vermilion text-white text-xs font-medium hover:bg-vermilion-hover transition-all flex items-center space-x-1 shadow-xs">
            <i class="${isApple ? 'ri-share-box-line' : 'ri-download-2-line'} text-xs"></i>
            <span>${isApple ? 'နည်းလမ်း' : 'သွင်းယူမည်'}</span>
          </button>
          <button id="pwa-dismiss-btn" class="w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-charcoal hover:bg-cream/80 transition-colors" title="ပိတ်ရန်" aria-label="Dismiss">
            <i class="ri-close-line text-sm"></i>
          </button>
        </div>
      `;

      document.body.appendChild(pill);

      document.getElementById('pwa-action-install-btn')?.addEventListener('click', () => {
        this.triggerInstall();
      });

      document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
        pill.remove();
        localStorage.setItem('htet_pwa_dismissed', Date.now());
      });
    },

    hideInstallUI() {
      document.getElementById('pwa-floating-pill')?.remove();
      document.querySelectorAll('[data-pwa-install]').forEach(btn => {
        btn.classList.add('hidden');
      });
    },

    triggerInstall() {
      if (this.deferredPrompt) {
        // Native browser install prompt (Android, Chrome, Edge)
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] User accepted installation');
          }
          this.deferredPrompt = null;
          this.hideInstallUI();
        });
      } else if (this.platform === 'ios' || this.platform === 'ipados') {
        // iOS / iPadOS Safari modal guidance
        this.showIOSGuidanceModal();
      } else if (this.platform === 'mac') {
        // macOS Sonoma Safari "Add to Dock" guidance
        this.showMacGuidanceModal();
      } else {
        // Generic fallback dialog
        this.showGenericInstallModal();
      }
    },

    showIOSGuidanceModal() {
      const modal = document.createElement('div');
      modal.id = 'pwa-guide-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in';
      modal.innerHTML = `
        <div class="w-full max-w-sm rounded-3xl bg-card border border-hairline p-5 sm:p-6 shadow-2xl relative">
          <button class="absolute top-4 right-4 w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:text-charcoal" onclick="document.getElementById('pwa-guide-modal').remove()">
            <i class="ri-close-line"></i>
          </button>

          <div class="flex items-center space-x-3 mb-4">
            <div class="nav-brand-glass-icon w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <img src="assets/favicon.svg" alt="ထက်" class="w-full h-full object-contain">
            </div>
            <div>
              <h3 class="font-serif text-lg font-bold text-charcoal">Apple iOS / iPadOS တွင် ထည့်သွင်းနည်း</h3>
              <span class="text-[10px] text-muted font-mono">SAFARI HOME SCREEN APP</span>
            </div>
          </div>

          <div class="space-y-3 text-xs text-charcoal/90 mb-5">
            <div class="p-3 rounded-2xl bg-cream/70 flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-vermilion text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">၁</span>
              <span>Safari browser ၏ အောက်ဘက် (သို့မဟုတ် အပေါ်ဘက်) ရှိ <strong>Share ခလုတ်</strong> <i class="ri-share-box-line text-sm text-vermilion"></i> ကို နှိပ်ပါ။</span>
            </div>
            <div class="p-3 rounded-2xl bg-cream/70 flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-vermilion text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">၂</span>
              <span>စာရင်းထဲတွင် အောက်သို့ဆွဲချ၍ <strong>"Add to Home Screen" <i class="ri-add-box-line text-sm text-vermilion"></i></strong> ကို ရွေးချယ်ပါ။</span>
            </div>
            <div class="p-3 rounded-2xl bg-cream/70 flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-vermilion text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">၃</span>
              <span>ညာဘက်အပေါ်ထောင့်ရှိ <strong>"Add"</strong> ကို နှိပ်လိုက်ပါက သင့် iPhone/iPad မျက်နှာပြင်တွင် App အဖြစ် တိုက်ရိုက်ရောက်ရှိသွားပါမည်။</span>
            </div>
          </div>

          <button class="w-full py-2.5 rounded-full bg-vermilion text-white font-medium text-xs hover:bg-vermilion-hover transition-all" onclick="document.getElementById('pwa-guide-modal').remove()">
            နားလည်ပါပြီ
          </button>
        </div>
      `;
      document.body.appendChild(modal);
    },

    showMacGuidanceModal() {
      const modal = document.createElement('div');
      modal.id = 'pwa-guide-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in';
      modal.innerHTML = `
        <div class="w-full max-w-sm rounded-3xl bg-card border border-hairline p-5 sm:p-6 shadow-2xl relative">
          <button class="absolute top-4 right-4 w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:text-charcoal" onclick="document.getElementById('pwa-guide-modal').remove()">
            <i class="ri-close-line"></i>
          </button>

          <div class="flex items-center space-x-3 mb-4">
            <div class="nav-brand-glass-icon w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <img src="assets/favicon.svg" alt="ထက်" class="w-full h-full object-contain">
            </div>
            <div>
              <h3 class="font-serif text-lg font-bold text-charcoal">macOS တွင် App အဖြစ် သိမ်းဆည်းနည်း</h3>
              <span class="text-[10px] text-muted font-mono">DOCK WEB APP</span>
            </div>
          </div>

          <div class="space-y-3 text-xs text-charcoal/90 mb-5">
            <div class="p-3 rounded-2xl bg-cream/70 flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-vermilion text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">၁</span>
              <span>Safari တွင် <strong>File Menu -> "Add to Dock..."</strong> ကို ရွေးပါ။</span>
            </div>
            <div class="p-3 rounded-2xl bg-cream/70 flex items-start space-x-3">
              <span class="w-5 h-5 rounded-full bg-vermilion text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">၂</span>
              <span>Chrome/Edge တွင် ညာဘက်အပေါ်ရှိ <strong>Install Icon <i class="ri-download-2-line text-vermilion"></i></strong> ကို နှိပ်၍ Desktop App အဖြစ် ထည့်သွင်းနိုင်ပါသည်။</span>
            </div>
          </div>

          <button class="w-full py-2.5 rounded-full bg-vermilion text-white font-medium text-xs hover:bg-vermilion-hover transition-all" onclick="document.getElementById('pwa-guide-modal').remove()">
            နားလည်ပါပြီ
          </button>
        </div>
      `;
      document.body.appendChild(modal);
    },

    showGenericInstallModal() {
      if (window.HtetUI && window.HtetUI.showToast) {
        window.HtetUI.showToast('Browser Menu (⋮) ကိုဖွင့်၍ "Install App" သို့မဟုတ် "Add to Home Screen" ကို ရွေးပါ');
      }
    },

    injectInstallUI() {
      // Listen for click on any [data-pwa-trigger] or [data-pwa-install]
      document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-pwa-install], [data-pwa-trigger]');
        if (target) {
          e.preventDefault();
          this.triggerInstall();
        }
      });

      // If on iOS or iPadOS and not standalone, show the install option after 5 seconds
      if ((this.platform === 'ios' || this.platform === 'ipados') && !this.isStandalone) {
        const dismissed = localStorage.getItem('htet_pwa_dismissed');
        if (!dismissed) {
          setTimeout(() => {
            this.showFloatingInstallPill();
          }, 3500);
        }
      }
    }
  };

  window.PWA = PWA;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PWA.init());
  } else {
    PWA.init();
  }
})();
