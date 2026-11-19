# -*- coding: utf-8 -*-

with open('js/dictionary.js', 'r', encoding='utf-8') as f:
    code = f.read()

insertion = '''  // -------------------------------------------------------------
  // 12.5. LIBRETRANSLATE ENGINE CONTROLLER
  // -------------------------------------------------------------
  async function runLibreTranslate() {
    const inputEl = document.getElementById('libre-source-text');
    const outputEl = document.getElementById('libre-target-text');
    const badgeEl = document.getElementById('libre-engine-badge');
    const srcLangEl = document.getElementById('libre-src-lang');
    const tgtLangEl = document.getElementById('libre-tgt-lang');
    const btnEl = document.getElementById('libre-translate-btn');

    if (!inputEl || !outputEl) return;
    const text = inputEl.value.trim();
    if (!text) {
      outputEl.value = '';
      if (badgeEl) badgeEl.innerHTML = '';
      return;
    }

    const srcLang = srcLangEl ? srcLangEl.value : 'auto';
    const tgtLang = tgtLangEl ? tgtLangEl.value : 'my';

    if (btnEl) {
      btnEl.disabled = true;
      btnEl.innerHTML = '<i class="ri-loader-4-line animate-spin text-base"></i><span>ဘာသာပြန်နေပါသည်...</span>';
    }

    try {
      if (window.HtetLibreTranslate) {
        const res = await window.HtetLibreTranslate.translate(text, srcLang, tgtLang);
        outputEl.value = res.translatedText || '';

        if (badgeEl) {
          if (res.engine === 'libretranslate') {
            badgeEl.innerHTML = `
              <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>LibreTranslate Neural MT (${escapeHtml(res.endpoint || 'Connected')})</span>
              </span>
            `;
          } else if (res.engine === 'offline-corpus') {
            badgeEl.innerHTML = `
              <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-400/30">
                <i class="ri-database-2-line text-xs"></i>
                <span>12K+ Parallel Corpus Match (${res.matchType || 'Corpus'})</span>
              </span>
            `;
          } else {
            badgeEl.innerHTML = `
              <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-400/30">
                <i class="ri-book-2-line text-xs"></i>
                <span>Offline Lexicon &amp; Grammar Synthesis</span>
              </span>
            `;
          }
        }
      }
    } catch(err) {
      console.error('Translation error:', err);
    } finally {
      if (btnEl) {
        btnEl.disabled = false;
        btnEl.innerHTML = '<i class="ri-translate-2 text-base"></i><span>ဘာသာပြန်ဆိုမည်</span>';
      }
    }
  }

  function swapTranslateLangs() {
    const srcLangEl = document.getElementById('libre-src-lang');
    const tgtLangEl = document.getElementById('libre-tgt-lang');
    const inputEl = document.getElementById('libre-source-text');
    const outputEl = document.getElementById('libre-target-text');

    if (!srcLangEl || !tgtLangEl) return;
    let s = srcLangEl.value;
    let t = tgtLangEl.value;
    if (s === 'auto') {
      s = (outputEl && isMyanmarText(outputEl.value)) ? 'my' : 'en';
    }
    srcLangEl.value = t;
    tgtLangEl.value = s;

    if (inputEl && outputEl && outputEl.value) {
      const temp = inputEl.value;
      inputEl.value = outputEl.value;
      outputEl.value = temp;
      runLibreTranslate();
    }
  }

  function openLibreTranslateSettings() {
    const modal = document.getElementById('libre-settings-modal');
    const inputUrl = document.getElementById('libre-setting-url');
    if (!modal) return;
    if (window.HtetLibreTranslate && inputUrl) {
      inputUrl.value = window.HtetLibreTranslate.getEndpoint();
    }
    modal.classList.remove('hidden');
  }

  function closeLibreTranslateSettings() {
    const modal = document.getElementById('libre-settings-modal');
    if (modal) modal.classList.add('hidden');
  }

  function saveLibreTranslateSettings() {
    const inputUrl = document.getElementById('libre-setting-url');
    const inputKey = document.getElementById('libre-setting-key');
    const url = inputUrl ? inputUrl.value.trim() : '';
    const key = inputKey ? inputKey.value.trim() : '';
    if (window.HtetLibreTranslate) {
      window.HtetLibreTranslate.setEndpoint(url, key);
    }
    closeLibreTranslateSettings();
    if (typeof window.showToast === 'function') {
      window.showToast('LibreTranslate ဆာဗာလိပ်စာ သိမ်းဆည်းပြီးပါပြီ');
    } else {
      alert('LibreTranslate ဆာဗာလိပ်စာ သိမ်းဆည်းပြီးပါပြီ');
    }
  }

'''

target = '  // -------------------------------------------------------------\n  // 13. INITIALIZATION\n  // -------------------------------------------------------------'
if 'LIBRETRANSLATE ENGINE CONTROLLER' not in code:
    code = code.replace(target, insertion + target)

export_target = '''    searchSentences,
    init
  };'''

export_replacement = '''    searchSentences,
    runLibreTranslate,
    swapTranslateLangs,
    openLibreTranslateSettings,
    closeLibreTranslateSettings,
    saveLibreTranslateSettings,
    init
  };'''

if 'runLibreTranslate,' not in code:
    code = code.replace(export_target, export_replacement)

with open('js/dictionary.js', 'w', encoding='utf-8') as f:
    f.write(code)

print('Updated js/dictionary.js with LibreTranslate methods')
