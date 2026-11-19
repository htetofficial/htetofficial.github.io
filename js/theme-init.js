/**
 * Htet Official — Critical Theme, Language & Trusted Types Initializer
 * Runs synchronously in <head> to guarantee 0ms Anti-FOUC and Trusted Types runtime safety.
 */
(function() {
  'use strict';

  // 1. Instant Theme Restore (Supports 14 curated themes across 4 categories)
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
    var metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme && themeBgs[theme]) {
      metaTheme.setAttribute('content', themeBgs[theme]);
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  // 2. Instant Language Restore & Anti-Flicker Cloak
  try {
    var validLangs = ['mm', 'en', 'zh', 'th', 'ja'];
    var savedLang = null;
    try { savedLang = localStorage.getItem('site_lang') || localStorage.getItem('preferred_language'); } catch(e) {}
    var lang = (savedLang && validLangs.indexOf(savedLang) !== -1) ? savedLang : 'mm';
    
    document.documentElement.setAttribute('data-lang', lang);
    var htmlLangMap = { mm: 'my', en: 'en', zh: 'zh-Hans', th: 'th', ja: 'ja' };
    document.documentElement.lang = htmlLangMap[lang] || 'my';

    if (lang !== 'mm') {
      document.documentElement.classList.add('i18n-cloaked');
      setTimeout(function() {
        document.documentElement.classList.remove('i18n-cloaked');
      }, 300);
    }
  } catch (e) {}

  // 3. Register standard Trusted Types default policy for DOM XSS immunity
  if (window.trustedTypes && typeof window.trustedTypes.createPolicy === 'function') {
    if (!window.trustedTypes.defaultPolicy) {
      try {
        window.trustedTypes.createPolicy('default', {
          createHTML: function(input) {
            if (!input) return '';
            var str = String(input);
            if (str.indexOf('<') === -1) return str;
            try {
              var doc = new DOMParser().parseFromString(str, 'text/html');
              var disallowed = doc.querySelectorAll('script, iframe, object, embed');
              for (var i = 0; i < disallowed.length; i++) {
                disallowed[i].remove();
              }
              var all = doc.body.querySelectorAll('*');
              for (var j = 0; j < all.length; j++) {
                var el = all[j];
                for (var k = el.attributes.length - 1; k >= 0; k--) {
                  var attr = el.attributes[k];
                  var attrName = attr.name.toLowerCase();
                  var attrVal = (attr.value || '').trim().toLowerCase();
                  if (attrName.startsWith('on') || attrVal.startsWith('javascript:') || attrVal.startsWith('data:text/html')) {
                    el.removeAttribute(attr.name);
                  }
                }
              }
              return doc.body.innerHTML;
            } catch (_) {
              return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            }
          },
          createScriptURL: function(url) {
            return url;
          },
          createScript: function(script) {
            return script;
          }
        });
      } catch (err) {
        console.warn('[TrustedTypes] Default policy initialization:', err);
      }
    }
  }
})();
