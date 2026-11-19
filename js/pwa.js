/**
 * Htet Official PWA Engine & Cross-Platform Native App Suite
 * Specialized for Android, iOS, iPadOS, macOS, and Windows
 * Integrates Remote App Config, Android APK Release, Digital Asset Links,
 * Full Offline Caching Engine, Synthesized Audio Chimes, Native Notifications,
 * Standalone Exit Confirmation & Deep Linking Architecture.
 */
(function() {
  'use strict';

  const PWA = {
    deferredPrompt: null,
    isStandalone: false,
    platform: 'unknown',
    swRegistration: null,
    refreshing: false,
    offlineModalEl: null,

    init() {
      this.detectPlatform();
      this.checkStandalone();
      this.registerServiceWorker();
      this.bindInstallPrompt();
      this.bindNetworkStatus();
      this.injectInstallUI();
      this.initAnnouncement();
      this.initExitConfirmation();
      this.initDeepLinks();
      this.bindOfflineTriggers();
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
        Boolean(document.referrer && document.referrer.includes('android-app://'))
      );
      if (this.isStandalone) {
        document.documentElement.classList.add('is-pwa-standalone');
      }
    },

    /**
     * High-Reliability Service Worker Registration:
     * - updateViaCache: 'none' ensures GitHub Pages doesn't serve a stale sw.js
     * - controllerchange listener cleanly refreshes page after skipWaiting
     * - Auto-checks updates on visibilitychange & periodic 15-minute interval
     */
    registerServiceWorker() {
      if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        // 1. Controllerchange listener: reload page once when new SW takes control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!this.refreshing) {
            this.refreshing = true;
            window.location.reload();
          }
        });

        // 2. Listen for messages from SW (e.g., Full Offline caching progress)
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHE_PROGRESS') {
            this.onCacheProgress(event.data);
          }
        });

        window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' })
            .then((registration) => {
              this.swRegistration = registration;

              // Check if a worker is already waiting (e.g. from previous background fetch)
              if (registration.waiting && navigator.serviceWorker.controller) {
                this.showUpdateBanner(registration.waiting);
              }

              // Listen for new worker updates
              registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (!newWorker) return;
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    this.showUpdateBanner(newWorker);
                  }
                });
              });

              // 3. Auto-check on App resume / tab visibility change
              document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible' && this.swRegistration) {
                  this.swRegistration.update().catch(() => {});
                }
              });

              // 4. Periodic background update check (every 15 minutes)
              setInterval(() => {
                if (this.swRegistration) {
                  this.swRegistration.update().catch(() => {});
                }
              }, 15 * 60 * 1000);
            })
            .catch((err) => {
              console.warn('[PWA] Service Worker registration failed:', err);
            });
        });
      }
    },

    /**
     * Synthesized Offline Web Audio Chime (100% Offline, zero external audio assets)
     */
    playUpdateChime() {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        const ctx = new AudioContextClass();
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        const now = ctx.currentTime;

        // Note 1: E5 (659.25 Hz)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, now);
        gain1.gain.setValueAtTime(0.12, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.35);

        // Note 2: B5 (987.77 Hz) - harmonic chime
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(987.77, now + 0.12);
        gain2.gain.setValueAtTime(0.16, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.65);
      } catch (e) {
        // Audio policy or unsupported; silent fallback
      }
    },

    /**
     * Dispatch Native Browser Notification if user permitted
     */
    dispatchNativeNotification(title, options) {
      if ('Notification' in window && Notification.permission === 'granted') {
        const defaultOptions = {
          body: 'အသစ်ထွက်ရှိသော ဒဿနနှင့် စာပေဆောင်းပါးများကို ဖတ်ရှုနိုင်ပါပြီ။',
          icon: 'assets/favicon-192x192.png',
          badge: 'assets/seal-stamp.svg',
          tag: 'htet-update-tag',
          renotify: true,
          ...options
        };
        try {
          if (navigator.serviceWorker && navigator.serviceWorker.controller) {
            navigator.serviceWorker.ready.then(reg => {
              reg.showNotification(title, defaultOptions);
            }).catch(() => {
              new Notification(title, defaultOptions);
            });
          } else {
            new Notification(title, defaultOptions);
          }
        } catch (e) {}
      }
    },

    /**
     * High-Impact Update Banner & Dialog with Audio Chime & Native Notification
     */
    showUpdateBanner(worker) {
      if (document.getElementById('pwa-update-banner')) return;

      // Play soft chime sound
      this.playUpdateChime();

      // Trigger native notification if permission granted
      this.dispatchNativeNotification('ထက် (Htet) — စနစ်နှင့် စာမူအသစ် ရရှိနေပါပြီ', {
        body: 'စာမူအသစ်များနှင့် ဒီဇိုင်းအဆင့်မြှင့်တင်မှုများကို အသုံးပြုနိုင်ရန် "အပ်ဒိတ်" ကို နှိပ်ပါ။'
      });

      const banner = document.createElement('div');
      banner.id = 'pwa-update-banner';
      banner.className = 'fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:w-[410px] z-50 p-4 sm:p-4.5 rounded-3xl bg-card/95 border border-hairline/80 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex flex-col gap-3.5 animate-slide-up backdrop-blur-2xl transition-all';
      banner.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-2xl bg-vermilion/10 text-vermilion border border-vermilion/20 flex items-center justify-center text-xl shrink-0 shadow-2xs">
              <i class="ri-refresh-line animate-spin"></i>
            </div>
            <div>
              <div class="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-1.5">
                <span>စာမူနှင့် စနစ်အပ်ဒိတ်အသစ် ရရှိပါပြီ</span>
                <span class="text-[9px] px-1.5 py-0.2 rounded-md bg-vermilion/15 text-vermilion font-mono font-bold">New</span>
              </div>
              <div class="text-[11px] text-muted leading-relaxed mt-0.5">
                နောက်ဆုံးထွက် စာမူများနှင့် စွမ်းဆောင်ရည်မြှင့်တင်မှုများကို ရယူရန်
              </div>
            </div>
          </div>
          <button id="pwa-update-dismiss-btn" class="w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-charcoal hover:bg-cream/80 transition-colors cursor-pointer shrink-0" title="ခဏထားဦး" aria-label="Dismiss">
            <i class="ri-close-line text-base"></i>
          </button>
        </div>

        <div class="flex items-center justify-end space-x-2 pt-1 border-t border-hairline/50">
          <button id="pwa-update-later-btn" class="px-3 py-1.5 rounded-full border border-hairline text-muted hover:text-charcoal text-xs font-medium hover:bg-cream/60 transition-all cursor-pointer">
            ခဏထားဦး
          </button>
          <button id="pwa-update-now-btn" class="px-4 py-1.5 rounded-full bg-vermilion text-white text-xs font-semibold hover:bg-vermilion-hover shadow-xs flex items-center space-x-1.5 cursor-pointer transition-all hover:scale-102">
            <i class="ri-download-cloud-2-line text-xs"></i>
            <span>ယခု အပ်ဒိတ်လုပ်မည်</span>
          </button>
        </div>
      `;
      document.body.appendChild(banner);

      const doUpdate = () => {
        if (worker) {
          worker.postMessage({ type: 'SKIP_WAITING' });
        }
        banner.remove();
        // If controllerchange doesn't fire within 800ms, force reload
        setTimeout(() => {
          if (!this.refreshing) window.location.reload();
        }, 800);
      };

      document.getElementById('pwa-update-now-btn')?.addEventListener('click', doUpdate);
      document.getElementById('pwa-update-later-btn')?.addEventListener('click', () => banner.remove());
      document.getElementById('pwa-update-dismiss-btn')?.addEventListener('click', () => banner.remove());
    },

    bindInstallPrompt() {
      window.addEventListener('beforeinstallprompt', (e) => {
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
      document.querySelectorAll('[data-pwa-install]').forEach(btn => {
        btn.classList.remove('hidden');
        btn.style.display = 'inline-flex';
      });

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
      const isAndroid = this.platform === 'android';

      pill.innerHTML = `
        <div class="flex items-center space-x-2.5 overflow-hidden">
          <div class="nav-brand-glass-icon w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
            <img src="assets/favicon.svg" alt="ထက်" class="w-full h-full object-contain">
          </div>
          <div class="truncate">
            <div class="text-xs font-bold text-charcoal leading-snug">ထက် (Htet) App</div>
            <div class="text-[10px] text-muted truncate">${isApple ? 'Home Screen တွင် ထည့်သွင်းဖတ်ရှုရန်' : (isAndroid ? 'Android App & PWA ရယူရန်' : 'ဖုန်းနှင့် ကွန်ပျူတာတွင် အက်ပ်သွင်းရန်')}</div>
          </div>
        </div>

        <div class="flex items-center space-x-1.5 shrink-0">
          <button id="pwa-action-install-btn" class="px-3 py-1.5 rounded-full bg-vermilion text-white text-xs font-medium hover:bg-vermilion-hover transition-all flex items-center space-x-1 shadow-xs cursor-pointer">
            <i class="${isApple ? 'ri-share-box-line' : (isAndroid ? 'ri-android-line' : 'ri-download-2-line')} text-xs"></i>
            <span>${isApple ? 'နည်းလမ်း' : (isAndroid ? 'App ရယူရန်' : 'သွင်းယူမည်')}</span>
          </button>
          <button id="pwa-dismiss-btn" class="w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-charcoal hover:bg-cream/80 transition-colors cursor-pointer" title="ပိတ်ရန်" aria-label="Dismiss">
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
      if (this.platform === 'android') {
        this.showAndroidGuidanceModal();
      } else if (this.platform === 'ios' || this.platform === 'ipados') {
        this.showIOSGuidanceModal();
      } else if (this.platform === 'mac') {
        this.showMacGuidanceModal();
      } else if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] User accepted installation');
          }
          this.deferredPrompt = null;
          this.hideInstallUI();
        });
      } else {
        this.showGenericInstallModal();
      }
    },

    showAndroidGuidanceModal() {
      const modal = document.createElement('div');
      modal.id = 'pwa-guide-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in';
      modal.innerHTML = `
        <div class="w-full max-w-sm rounded-3xl bg-card border border-hairline p-5 sm:p-6 shadow-2xl relative">
          <button class="absolute top-4 right-4 w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:text-charcoal cursor-pointer" onclick="document.getElementById('pwa-guide-modal').remove()">
            <i class="ri-close-line"></i>
          </button>

          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
              <i class="ri-android-line"></i>
            </div>
            <div>
              <h3 class="font-serif text-lg font-bold text-charcoal">Android App ရွေးချယ်မှု</h3>
              <span class="text-[10px] text-muted font-mono uppercase tracking-wider">Official Android Release & PWA</span>
            </div>
          </div>

          <p class="text-xs text-muted mb-4 leading-relaxed">
            Android ဖုန်းများအတွက် သီးသန့်ထုတ်လုပ်ထားသော တရားဝင် App (.apk) သို့မဟုတ် Browser မှတစ်ဆင့် Web App (PWA) အဖြစ် ရွေးချယ်ထည့်သွင်းနိုင်ပါသည်။
          </p>

          <div class="space-y-2.5 mb-5">
            <a href="https://github.com/htetofficial/htetofficial.github.io/releases/tag/v1.2.0-beta" target="_blank" rel="noopener noreferrer" class="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/30 hover:border-emerald-500/60 transition-all flex items-center justify-between group">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                  <i class="ri-download-2-line"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-charcoal flex items-center gap-1.5">
                    <span>Android APK ဒေါင်းလုဒ်</span>
                    <span class="text-[9px] px-1.5 py-0.2 rounded-md bg-emerald-600 text-white font-mono font-bold">v1.2.0-beta</span>
                  </div>
                  <div class="text-[10px] text-muted">တရားဝင် Android App Package Installer</div>
                </div>
              </div>
              <i class="ri-arrow-right-line text-muted group-hover:text-emerald-600 transition-colors"></i>
            </a>

            <button id="android-pwa-trigger-btn" class="w-full p-3.5 rounded-2xl border border-hairline bg-cream/70 dark:bg-stone-900/60 hover:bg-cream dark:hover:bg-stone-900 transition-all flex items-center justify-between text-left group cursor-pointer">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 rounded-xl bg-vermilion text-white flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
                  <i class="ri-window-line"></i>
                </div>
                <div>
                  <div class="text-xs font-bold text-charcoal flex items-center gap-1.5">
                    <span>Instant Web App (PWA)</span>
                    <span class="text-[9px] px-1.5 py-0.2 rounded-md bg-vermilion/15 text-vermilion font-mono font-bold">PWA</span>
                  </div>
                  <div class="text-[10px] text-muted">Chrome မှတစ်ဆင့် Home Screen တွင် သွင်းရန်</div>
                </div>
              </div>
              <i class="ri-arrow-right-line text-muted group-hover:text-vermilion transition-colors"></i>
            </button>
          </div>

          <button class="w-full py-2.5 rounded-full border border-hairline text-charcoal font-medium text-xs hover:bg-cream/60 transition-all cursor-pointer" onclick="document.getElementById('pwa-guide-modal').remove()">
            ပိတ်ရန်
          </button>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('android-pwa-trigger-btn')?.addEventListener('click', () => {
        modal.remove();
        if (this.deferredPrompt) {
          this.deferredPrompt.prompt();
          this.deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('[PWA] User accepted installation');
            }
            this.deferredPrompt = null;
            this.hideInstallUI();
          });
        } else {
          this.showGenericInstallModal();
        }
      });
    },

    showIOSGuidanceModal() {
      const modal = document.createElement('div');
      modal.id = 'pwa-guide-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in';
      modal.innerHTML = `
        <div class="w-full max-w-sm rounded-3xl bg-card border border-hairline p-5 sm:p-6 shadow-2xl relative">
          <button class="absolute top-4 right-4 w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:text-charcoal cursor-pointer" onclick="document.getElementById('pwa-guide-modal').remove()">
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

          <button class="w-full py-2.5 rounded-full bg-vermilion text-white font-medium text-xs hover:bg-vermilion-hover transition-all cursor-pointer" onclick="document.getElementById('pwa-guide-modal').remove()">
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
          <button class="absolute top-4 right-4 w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:text-charcoal cursor-pointer" onclick="document.getElementById('pwa-guide-modal').remove()">
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

          <button class="w-full py-2.5 rounded-full bg-vermilion text-white font-medium text-xs hover:bg-vermilion-hover transition-all cursor-pointer" onclick="document.getElementById('pwa-guide-modal').remove()">
            နားလည်ပါပြီ
          </button>
        </div>
      `;
      document.body.appendChild(modal);
    },

    showGenericInstallModal() {
      const modal = document.createElement('div');
      modal.id = 'pwa-guide-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in';
      modal.innerHTML = `
        <div class="w-full max-w-sm rounded-3xl bg-card border border-hairline p-5 sm:p-6 shadow-2xl relative">
          <button class="absolute top-4 right-4 w-8 h-8 rounded-full border border-hairline flex items-center justify-center text-muted hover:text-charcoal cursor-pointer" onclick="document.getElementById('pwa-guide-modal').remove()">
            <i class="ri-close-line"></i>
          </button>

          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 rounded-2xl bg-vermilion/10 text-vermilion flex items-center justify-center text-2xl shrink-0">
              <i class="ri-download-cloud-2-line"></i>
            </div>
            <div>
              <h3 class="font-serif text-lg font-bold text-charcoal">App သွင်းယူနည်း</h3>
              <span class="text-[10px] text-muted font-mono">CROSS-PLATFORM APP</span>
            </div>
          </div>

          <p class="text-xs text-muted mb-4 leading-relaxed">
            Browser Menu (⋮ သို့မဟုတ် ⋯) ကို နှိပ်၍ <strong>"Install App"</strong> သို့မဟုတ် <strong>"Add to Home Screen"</strong> ကို ရွေးချယ်နိုင်ပါသည်။
          </p>

          <div class="mb-5">
            <a href="https://github.com/htetofficial/htetofficial.github.io/releases/tag/v1.2.0-beta" target="_blank" rel="noopener noreferrer" class="p-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/70 dark:bg-emerald-950/30 hover:border-emerald-500/60 transition-all flex items-center justify-between group">
              <div class="flex items-center space-x-2.5">
                <i class="ri-android-line text-lg text-emerald-600"></i>
                <div class="text-xs font-bold text-charcoal">Android ဖုန်းသုံးစွဲသူများအတွက် APK ရယူရန်</div>
              </div>
              <i class="ri-external-link-line text-muted group-hover:text-emerald-600"></i>
            </a>
          </div>

          <button class="w-full py-2.5 rounded-full bg-vermilion text-white font-medium text-xs hover:bg-vermilion-hover transition-all cursor-pointer" onclick="document.getElementById('pwa-guide-modal').remove()">
            နားလည်ပါပြီ
          </button>
        </div>
      `;
      document.body.appendChild(modal);
    },

    injectInstallUI() {
      document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-pwa-install], [data-pwa-trigger]');
        if (target) {
          e.preventDefault();
          this.triggerInstall();
        }
      });

      if ((this.platform === 'ios' || this.platform === 'ipados' || this.platform === 'android') && !this.isStandalone) {
        const dismissed = localStorage.getItem('htet_pwa_dismissed');
        if (!dismissed) {
          setTimeout(() => {
            this.showFloatingInstallPill();
          }, 3500);
        }
      }
    },

    /**
     * Standalone Mode Double-Back Exit Confirmation Toast
     */
    initExitConfirmation() {
      if (!this.isStandalone) return;

      let backPressedOnce = false;
      // Push state so first back button doesn't close immediately
      try {
        window.history.pushState({ page: 'pwa-home' }, '', window.location.href);
      } catch (e) {}

      window.addEventListener('popstate', (e) => {
        // First check if any reader modal or overlay is open; close it instead of exiting app
        const openModal = document.querySelector('#journal-reader-modal:not(.hidden), #pwa-guide-modal, #theme-studio-modal:not(.hidden), #full-offline-modal');
        if (openModal) {
          if (typeof window.closeJournalModal === 'function' && openModal.id === 'journal-reader-modal') {
            window.closeJournalModal();
          } else {
            openModal.remove();
          }
          try {
            window.history.pushState({ page: 'pwa-home' }, '', window.location.href);
          } catch(err) {}
          return;
        }

        if (backPressedOnce) {
          // Allowed exit
          window.history.back();
          return;
        }

        backPressedOnce = true;
        try {
          window.history.pushState({ page: 'pwa-home' }, '', window.location.href);
        } catch(err) {}

        if (window.HtetUI && window.HtetUI.showToast) {
          window.HtetUI.showToast('အက်ပ်မှ ထွက်ရန် နောက်တစ်ကြိမ် ထပ်နှိပ်ပါ (Press back again to exit)');
        }

        setTimeout(() => {
          backPressedOnce = false;
        }, 2200);
      });
    },

    /**
     * Deep Linking Architecture:
     * - ?id=slug or #post-slug: opens journal/article popup
     * - ?lang=mm|en|zh|th|ja: sets language
     * - ?theme=themeName: sets reading theme
     * - ?pwa=install: opens install modal
     * - ?offline=download: triggers full offline caching
     */
    initDeepLinks() {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      const hash = url.hash;

      // 1. Language deep link
      const langParam = params.get('lang');
      if (langParam && ['mm', 'en', 'zh', 'th', 'ja'].includes(langParam)) {
        if (window.HtetI18n && typeof window.HtetI18n.setLanguage === 'function') {
          window.HtetI18n.setLanguage(langParam);
        } else {
          localStorage.setItem('site_lang', langParam);
        }
      }

      // 2. Theme deep link
      const themeParam = params.get('theme');
      if (themeParam && window.HtetTheme && typeof window.HtetTheme.setTheme === 'function') {
        window.HtetTheme.setTheme(themeParam);
      }

      // 3. Install deep link
      if (params.get('pwa') === 'install') {
        setTimeout(() => this.triggerInstall(), 500);
      }

      // 4. Full offline deep link
      if (params.get('offline') === 'download') {
        setTimeout(() => this.cacheAllOfflineContent(), 500);
      }

      // 5. Post reader deep link (?id=slug or #post-slug)
      let postSlug = params.get('id');
      if (!postSlug && hash.startsWith('#post-')) {
        postSlug = hash.replace('#post-', '');
      }

      if (postSlug) {
        const tryOpen = (attempts = 0) => {
          if (typeof window.openJournalModal === 'function') {
            window.openJournalModal(postSlug);
          } else if (attempts < 15) {
            setTimeout(() => tryOpen(attempts + 1), 200);
          }
        };
        setTimeout(tryOpen, 300);
      }
    },

    /**
     * Contextual Permission Request (Notifications & Storage Persistence)
     */
    async requestAppPermissions() {
      let notiGranted = false;
      let storagePersisted = false;

      // 1. Request Notification
      if ('Notification' in window) {
        try {
          const perm = await Notification.requestPermission();
          notiGranted = (perm === 'granted');
        } catch (e) {}
      }

      // 2. Request Persistent Storage (prevents browser from evicting offline cache)
      if (navigator.storage && navigator.storage.persist) {
        try {
          storagePersisted = await navigator.storage.persist();
        } catch (e) {}
      }

      if (window.HtetUI && window.HtetUI.showToast) {
        if (notiGranted || storagePersisted) {
          window.HtetUI.showToast('အသိပေးချက်နှင့် အော့ဖ်လိုင်းသိုလှောင်မှု ခွင့်ပြုချက် အောင်မြင်ပါသည်');
        } else {
          window.HtetUI.showToast('ခွင့်ပြုချက်များကို ဆက်တင်တွင် ပြောင်းလဲနိုင်ပါသည်');
        }
      }

      return { notiGranted, storagePersisted };
    },

    /**
     * Full Offline Mode Engine:
     * Caches all 25 articles, data JSONs, Pyidaungsu fonts, and essential assets with live progress
     */
    bindOfflineTriggers() {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-pwa-offline-full], [data-action="full-offline"]');
        if (trigger) {
          e.preventDefault();
          this.cacheAllOfflineContent();
        }

        const permTrigger = e.target.closest('[data-pwa-request-permissions]');
        if (permTrigger) {
          e.preventDefault();
          this.requestAppPermissions();
        }
      });
    },

    cacheAllOfflineContent() {
      const urlsToCache = [
        './',
        './index.html',
        './articles.html',
        './publications.html',
        './journal.html',
        './about.html',
        './contact.html',
        './glossary.html',
        './article.html',
        './offline.html',
        './manifest.webmanifest',
        './config.json',
        './app-config.json',
        './app-update.json',
        './sitemap.xml',
        './robots.txt',
        './css/custom.css',
        './css/remixicon.css',
        './css/aos.css',
        './css/bootstrap.min.css',
        './css/bootstrap-icons.min.css',
        './js/tailwind.min.js',
        './js/main.js',
        './js/theme.js',
        './js/pwa.js',
        './js/data-loader.js',
        './js/i18n.js',
        './js/confetti.browser.min.js',
        './js/aos.js',
        './js/bootstrap.bundle.min.js',
        './data/articles.json',
        './data/posts.json',
        './data/glossary.json',
        './data/publications.json',
        './data/quotes.json',
        './fonts/Pyidaungsu-Regular.ttf',
        './fonts/Pyidaungsu-Bold.ttf',
        './fonts/Pyidaungsu-Numbers.ttf',
        './assets/favicon.svg',
        './assets/favicon-16x16.png',
        './assets/favicon-32x32.png',
        './assets/favicon-192x192.png',
        './assets/favicon-512x512.png',
        './assets/apple-touch-icon.png',
        './assets/seal-stamp.svg',
        './assets/images/og-preview.jpeg'
      ];

      this.showFullOfflineModal(urlsToCache.length);

      // Request persistent storage in parallel
      if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().catch(() => {});
      }

      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_ALL_OFFLINE',
          urls: urlsToCache
        });
      } else {
        // Fallback: direct cache fetch in page context
        this.cacheDirectly(urlsToCache);
      }
    },

    showFullOfflineModal(total) {
      if (document.getElementById('full-offline-modal')) return;

      const modal = document.createElement('div');
      modal.id = 'full-offline-modal';
      modal.className = 'fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in';
      modal.innerHTML = `
        <div class="w-full max-w-md rounded-3xl bg-card border border-hairline/80 p-6 shadow-2xl relative text-center">
          <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-vermilion/10 text-vermilion border border-vermilion/20 flex items-center justify-center text-3xl shadow-xs">
            <i id="offline-modal-icon" class="ri-download-cloud-2-line animate-bounce"></i>
          </div>

          <h3 id="offline-modal-title" class="font-serif text-xl font-bold text-charcoal mb-1">
            Full Offline Mode ပြင်ဆင်နေပါသည်
          </h3>
          <p id="offline-modal-desc" class="text-xs text-muted mb-5 leading-relaxed">
            စာမူ ၂၅ ပုဒ်လုံး၊ မြန်မာဖောင့် (Pyidaungsu) နှင့် စနစ်ဖိုင်များကို သင့်ဖုန်းထဲသို့ သိမ်းဆည်းနေပါသည်...
          </p>

          <!-- Progress Bar Container -->
          <div class="w-full bg-cream dark:bg-stone-800 rounded-full h-3 mb-2.5 overflow-hidden p-0.5 border border-hairline">
            <div id="offline-progress-bar" class="bg-gradient-to-r from-vermilion to-rose-500 h-full rounded-full transition-all duration-200" style="width: 5%"></div>
          </div>

          <div class="flex items-center justify-between text-[11px] text-muted font-mono mb-4 px-1">
            <span id="offline-progress-count">1 / ${total} ဖိုင်</span>
            <span id="offline-progress-percent" class="font-bold text-vermilion">5%</span>
          </div>

          <div id="offline-file-name" class="text-[10px] text-faint truncate font-mono mb-5 px-2">
            စာရင်းစတင်နေပါသည်...
          </div>

          <button id="offline-modal-close-btn" class="w-full py-2.5 rounded-full border border-hairline text-charcoal font-medium text-xs hover:bg-cream transition-all cursor-pointer hidden">
            ပိတ်ရန် (ပြီးပါပြီ)
          </button>
        </div>
      `;
      document.body.appendChild(modal);
      this.offlineModalEl = modal;

      document.getElementById('offline-modal-close-btn')?.addEventListener('click', () => {
        modal.remove();
      });
    },

    onCacheProgress(data) {
      const progressBar = document.getElementById('offline-progress-bar');
      const progressPercent = document.getElementById('offline-progress-percent');
      const progressCount = document.getElementById('offline-progress-count');
      const fileNameEl = document.getElementById('offline-file-name');
      const titleEl = document.getElementById('offline-modal-title');
      const descEl = document.getElementById('offline-modal-desc');
      const iconEl = document.getElementById('offline-modal-icon');
      const closeBtn = document.getElementById('offline-modal-close-btn');

      if (!progressBar) return;

      const pct = Math.min(100, Math.round((data.completed / data.total) * 100));
      progressBar.style.width = pct + '%';
      if (progressPercent) progressPercent.textContent = pct + '%';
      if (progressCount) progressCount.textContent = `${data.completed} / ${data.total} ဖိုင်`;
      if (fileNameEl && data.url) {
        const basename = data.url.split('/').pop() || data.url;
        fileNameEl.textContent = `သိမ်းဆည်းပြီး: ${basename}`;
      }

      if (data.completed >= data.total) {
        this.playUpdateChime();
        if (titleEl) titleEl.textContent = 'Full Offline Mode အဆင်သင့်ဖြစ်ပါပြီ!';
        if (descEl) descEl.textContent = 'ဝက်ဘ်ဆိုက်တစ်ခုလုံး၊ ဆောင်းပါးအားလုံးနှင့် မြန်မာဖောင့်တို့ကို အင်တာနက်လုံးဝမရှိဘဲ ဖတ်ရှုနိုင်ပါပြီ။';
        if (iconEl) {
          iconEl.className = 'ri-checkbox-circle-fill text-emerald-500 animate-none';
          iconEl.parentElement.className = 'w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center text-3xl shadow-xs';
        }
        if (closeBtn) closeBtn.classList.remove('hidden');
        if (window.HtetUI && window.HtetUI.showToast) {
          window.HtetUI.showToast('Full Offline အောင်မြင်စွာ သိမ်းဆည်းပြီးပါပြီ!');
        }
      }
    },

    async cacheDirectly(urls) {
      if (!('caches' in window)) return;
      try {
        const cache = await caches.open('htet-pwa-v2.4');
        let done = 0;
        for (const u of urls) {
          try {
            const res = await fetch(u, { cache: 'reload' });
            if (res && res.ok) await cache.put(u, res);
          } catch(e) {}
          done++;
          this.onCacheProgress({ completed: done, total: urls.length, url: u });
        }
      } catch (err) {
        console.warn('[PWA] Direct caching failed', err);
      }
    },

    initAnnouncement() {
      const defaultAnnouncement = {
        announcementText: "Htet Official App (Beta) — လက်ရှိတွင် စမ်းသပ်ဆဲကာလ ဖြစ်ပါသည်။ အကြံပြုချက်များနှင့် အမှားအယွင်းများ တွေ့ရှိပါက @htetmmofficial သို့ ဆက်သွယ်အသိပေးနိုင်ပါသည်။",
        announcementId: "a1",
        announcementBgColor: "B83A2D",
        announcementTextColor: "FFFFFF",
        contactEmail: "htethtet2025ideahub@gmail.com"
      };

      const renderBanner = (config) => {
        if (!config || !config.announcementText) return;
        const targetId = config.announcementId || 'a1';
        const dismissed = localStorage.getItem('htet_announcement_dismissed');
        const existingBar = document.getElementById('htet-announcement-bar');

        if (existingBar) {
          if (dismissed === targetId) {
            existingBar.style.display = 'none';
            return;
          }
          // Wire dismiss handler if pre-rendered in static HTML
          const closeBtn = document.getElementById('htet-announcement-close-btn');
          if (closeBtn && !closeBtn._hasListener) {
            closeBtn._hasListener = true;
            closeBtn.addEventListener('click', () => {
              existingBar.remove();
              localStorage.setItem('htet_announcement_dismissed', targetId);
            });
          }
          return;
        }

        if (dismissed === targetId) return;

        const bar = document.createElement('div');
        bar.id = 'htet-announcement-bar';
        bar.className = 'w-full py-2 px-3 sm:px-4 text-xs font-sans-ui flex items-center justify-between gap-2 shadow-xs transition-all z-40 relative';
        bar.style.backgroundColor = '#' + config.announcementBgColor.replace('#', '');
        bar.style.color = '#' + config.announcementTextColor.replace('#', '');

        bar.innerHTML = `
          <div class="max-w-7xl mx-auto w-full flex items-center justify-between gap-2">
            <div class="flex items-center space-x-2 overflow-hidden text-left flex-1 min-w-0">
              <span class="w-2 h-2 rounded-full bg-white animate-pulse shrink-0"></span>
              <span class="truncate font-medium">${config.announcementText}</span>
            </div>
            <div class="flex items-center space-x-2 shrink-0">
              <a href="https://github.com/htetofficial/htetofficial.github.io/releases/tag/v1.2.0-beta" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-full bg-white text-[#8A2B1D] hover:bg-cream font-bold text-[11px] flex items-center space-x-1 transition-all shadow-xs" aria-label="Android App ရယူရန်">
                <i class="ri-android-line text-xs"></i>
                <span class="hidden sm:inline">Android App</span>
                <span>ရယူရန်</span>
              </a>
              <button id="htet-announcement-close-btn" class="w-6 h-6 rounded-full hover:bg-black/20 flex items-center justify-center text-white transition-colors cursor-pointer" title="ပိတ်ရန်" aria-label="Close Announcement">
                <i class="ri-close-line text-sm"></i>
              </button>
            </div>
          </div>
        `;

        const header = document.querySelector('header');
        if (header && header.parentNode) {
          header.parentNode.insertBefore(bar, header);
        } else {
          document.body.prepend(bar);
        }

        document.getElementById('htet-announcement-close-btn')?.addEventListener('click', () => {
          bar.remove();
          localStorage.setItem('htet_announcement_dismissed', targetId);
        });
      };

      // Avoid CORS error when testing locally via file:// protocol
      if (window.location.protocol === 'file:') {
        renderBanner(defaultAnnouncement);
        return;
      }

      fetch('config.json')
        .then(res => res.json())
        .then(data => {
          renderBanner(data.config || defaultAnnouncement);
        })
        .catch(() => {
          renderBanner(defaultAnnouncement);
        });
    }
  };

  window.PWA = PWA;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PWA.init());
  } else {
    PWA.init();
  }
})();
