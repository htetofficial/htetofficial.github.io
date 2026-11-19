# -*- coding: utf-8 -*-

with open('dictionary.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update meta description and subtitle to include LibreTranslate
html = html.replace(
    'HuggingFace ဝါကျစုံတွဲများ (12K+ Pairs) နှင့် Mozilla PDF.js Offline Reader',
    'LibreTranslate စက်ဘာသာပြန်အင်ဂျင်၊ HuggingFace ဝါကျစုံတွဲများ (12K+ Pairs) နှင့် Mozilla PDF.js Offline Reader'
)

# 2. Update stats chips in hero banner
old_stats = '''        <span class="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-300 font-bold">12,021 Parallel Pairs</span>
        <span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 font-bold">100% Offline Ready</span>'''

new_stats = '''        <span class="px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-300 font-bold">LibreTranslate Neural MT</span>
        <span class="px-2.5 py-1 rounded-lg bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-300 font-bold">12,021 Parallel Pairs</span>
        <span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 font-bold">100% Offline Ready</span>'''

html = html.replace(old_stats, new_stats)

# 3. Update Tab button label
html = html.replace(
    '<span>ဝါကျဘာသာပြန် (12K+ Corpus)</span>',
    '<span>LibreTranslate ဘာသာပြန်စတူဒီယို</span>'
)

# 4. Overhaul Tab 2 content with full LibreTranslate UI
old_tab2 = '''    <!-- ======================================================== -->
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
    </div>'''

new_tab2 = '''    <!-- ======================================================== -->
    <!-- TAB 2: LIBRETRANSLATE STUDIO & PARALLEL CORPUS            -->
    <!-- ======================================================== -->
    <div id="tab-sentences" class="dict-view-tab space-y-8 hidden">
      <div class="max-w-5xl mx-auto space-y-6">
        
        <!-- LibreTranslate Banner -->
        <div class="p-5 sm:p-6 rounded-3xl bg-card border border-hairline shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-hairline">
            <div class="flex items-center space-x-2.5">
              <span class="w-9 h-9 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shrink-0">
                <i class="ri-translate"></i>
              </span>
              <div>
                <h2 class="text-xl sm:text-2xl font-bold font-serif-editorial text-charcoal m-0">
                  LibreTranslate စက်ဘာသာပြန် စတူဒီယို
                </h2>
                <p class="text-xs text-muted font-sans-ui m-0">
                  Open Source Neural Machine Translation (Argos Translate Engine) • Offline Hybrid Fallback
                </p>
              </div>
            </div>

            <!-- Settings Button -->
            <button onclick="window.HtetDict.openLibreTranslateSettings()" class="px-3 py-1.5 rounded-xl border border-hairline bg-cream/60 dark:bg-stone-800 text-charcoal hover:text-indigo-600 flex items-center space-x-1.5 text-xs font-semibold cursor-pointer shadow-2xs self-start sm:self-center transition-all">
              <i class="ri-settings-3-line text-sm"></i>
              <span>ဆာဗာလိပ်စာ ပြင်ဆင်ရန်</span>
            </button>
          </div>

          <!-- Language Selector Bar -->
          <div class="flex items-center justify-between gap-2 p-2 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline text-xs font-semibold">
            <div class="flex items-center space-x-1.5 flex-1 min-w-0">
              <span class="text-muted text-[10px] uppercase font-mono hidden sm:inline">မူရင်းဘာသာ:</span>
              <select id="libre-src-lang" class="w-full bg-card text-charcoal border border-hairline rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-sans-ui">
                <option value="auto">အလိုအလျောက် စစ်ဆေးခြင်း (Auto Detect)</option>
                <option value="en">English (အင်္ဂလိပ်)</option>
                <option value="my">မြန်မာ (Burmese)</option>
                <option value="zh">中文 (Chinese)</option>
                <option value="th">ภาษาไทย (Thai)</option>
                <option value="ja">日本語 (Japanese)</option>
              </select>
            </div>

            <button onclick="window.HtetDict.swapTranslateLangs()" class="w-8 h-8 rounded-xl bg-card border border-hairline hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center cursor-pointer shadow-2xs shrink-0" title="ဘာသာစကား နေရာလဲလှယ်ရန်">
              <i class="ri-arrow-left-right-line text-xs"></i>
            </button>

            <div class="flex items-center space-x-1.5 flex-1 min-w-0">
              <span class="text-muted text-[10px] uppercase font-mono hidden sm:inline">ပစ်မှတ်ဘာသာ:</span>
              <select id="libre-tgt-lang" class="w-full bg-card text-charcoal border border-hairline rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500 font-sans-ui">
                <option value="my" selected>မြန်မာ (Burmese)</option>
                <option value="en">English (အင်္ဂလိပ်)</option>
                <option value="zh">中文 (Chinese)</option>
                <option value="th">ภาษาไทย (Thai)</option>
                <option value="ja">日本語 (Japanese)</option>
              </select>
            </div>
          </div>

          <!-- Dual Translation Boxes Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <!-- Source Input Box -->
            <div class="space-y-2 flex flex-col justify-between p-4 rounded-2xl bg-card border border-hairline shadow-2xs focus-within:border-indigo-500 transition-colors">
              <div class="space-y-2">
                <div class="flex items-center justify-between pb-1 border-b border-hairline/60 text-[11px] text-muted">
                  <span class="font-mono uppercase font-bold">Source Text</span>
                  <button onclick="document.getElementById('libre-source-text').value = '';" class="hover:text-red-500 text-[11px] cursor-pointer">ရှင်းလင်းမည်</button>
                </div>
                <textarea 
                  id="libre-source-text" 
                  rows="5" 
                  placeholder="ဘာသာပြန်လိုသော အင်္ဂလိပ် သို့မဟုတ် မြန်မာစာကြောင်းအား ရိုက်ထည့်ပါ (ဥပမာ: The only real prison is fear, and the only real freedom is Freedom from Fear)..." 
                  class="w-full bg-transparent text-charcoal placeholder-muted text-sm sm:text-base focus:outline-none resize-none font-sans-ui leading-relaxed"
                >The only real prison is fear, and the only real freedom is Freedom from Fear.</textarea>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-hairline/60 text-xs">
                <button onclick="window.HtetDict.speak(document.getElementById('libre-source-text').value)" class="p-1.5 rounded-lg hover:bg-cream dark:hover:bg-stone-800 text-muted hover:text-charcoal" title="အသံနားထောင်ရန်">
                  <i class="ri-volume-up-line text-sm"></i>
                </button>
                <span id="libre-char-count" class="font-mono text-[10px] text-muted">Characters</span>
              </div>
            </div>

            <!-- Target Translation Box -->
            <div class="space-y-2 flex flex-col justify-between p-4 rounded-2xl bg-cream/40 dark:bg-stone-900/40 border border-hairline shadow-2xs">
              <div class="space-y-2">
                <div class="flex items-center justify-between pb-1 border-b border-hairline/60 text-[11px] text-muted">
                  <span class="font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400">Translated Result</span>
                  <span id="libre-engine-badge">
                    <span class="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-400/30">
                      <i class="ri-sparkling-fill text-xs text-teal-600"></i>
                      <span>Hybrid Neural &amp; Offline Ready</span>
                    </span>
                  </span>
                </div>
                <textarea 
                  id="libre-target-text" 
                  rows="5" 
                  readonly 
                  placeholder="ဘာသာပြန် ရလဒ် ဤနေရာတွင် ပေါ်လာပါမည်..." 
                  class="w-full bg-transparent text-charcoal placeholder-muted text-sm sm:text-base focus:outline-none resize-none font-sans-ui leading-relaxed font-medium"
                >စစ်မှန်သော အကျဉ်းထောင်ဟူသည် ကြောက်ရွံ့ခြင်းသာဖြစ်ပြီး စစ်မှန်သော လွတ်မြောက်ခြင်းဟူသည်မှာလည်း ကြောက်ရွံ့ခြင်းမှ လွတ်ကင်းခြင်းသာ ဖြစ်သည်။</textarea>
              </div>

              <div class="flex items-center justify-between pt-2 border-t border-hairline/60 text-xs">
                <button onclick="window.HtetDict.speak(document.getElementById('libre-target-text').value)" class="p-1.5 rounded-lg hover:bg-cream dark:hover:bg-stone-800 text-muted hover:text-charcoal" title="အသံနားထောင်ရန်">
                  <i class="ri-volume-up-line text-sm"></i>
                </button>
                <button onclick="window.HtetDict.copyDef(document.getElementById('libre-target-text').value)" class="p-1.5 rounded-lg hover:bg-cream dark:hover:bg-stone-800 text-indigo-600 font-semibold flex items-center space-x-1 cursor-pointer" title="ကူးယူရန်">
                  <i class="ri-file-copy-line text-sm"></i>
                  <span>ရလဒ် ကူးယူမည်</span>
                </button>
              </div>
            </div>

          </div>

          <!-- Translate Action Button & Presets -->
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div class="flex flex-wrap items-center gap-1.5 text-xs text-muted">
              <span class="font-bold">နမူနာ စာကြောင်းများ:</span>
              <button onclick="document.getElementById('libre-source-text').value = 'The only real prison is fear, and the only real freedom is Freedom from Fear.'; window.HtetDict.runLibreTranslate();" class="px-2.5 py-1 rounded-xl bg-cream/70 dark:bg-stone-800 hover:text-indigo-600 cursor-pointer font-sans-ui">Freedom from Fear</button>
              <button onclick="document.getElementById('libre-source-text').value = 'Democracy is not just a form of government, but a way of living.'; window.HtetDict.runLibreTranslate();" class="px-2.5 py-1 rounded-xl bg-cream/70 dark:bg-stone-800 hover:text-indigo-600 cursor-pointer font-sans-ui">Democracy</button>
            </div>

            <button id="libre-translate-btn" onclick="window.HtetDict.runLibreTranslate()" class="w-full sm:w-auto px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center space-x-2 shrink-0">
              <i class="ri-translate-2 text-base"></i>
              <span>ဘာသာပြန်ဆိုမည် (Translate)</span>
            </button>
          </div>
        </div>

        <!-- Section 2: 12,021 Parallel Sentences Search -->
        <div class="space-y-4 pt-4 border-t border-hairline">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-bold font-serif-editorial text-charcoal m-0">၁၂,၀၂၁ အပြိုင်ဝါကျစုံတွဲများထဲမှ ရှာဖွေခြင်း</h3>
              <p class="text-xs text-muted m-0">HuggingFace kalixlouiis Myanmar-English Parallel Corpus Search</p>
            </div>
            <span id="sentence-match-count" class="font-mono text-xs font-bold text-teal-700 dark:text-teal-300">
              ဝါကျ ၁၂,၀၂၁ ခု အသင့်ရှိသည်
            </span>
          </div>

          <div class="relative flex items-center shadow-md rounded-2xl overflow-hidden border-2 border-teal-500/40 focus-within:border-teal-600 bg-card transition-all">
            <div class="pl-4 pr-2 text-teal-600 dark:text-teal-400">
              <i class="ri-search-2-line text-lg"></i>
            </div>
            <input 
              type="text" 
              id="sentence-search-input" 
              placeholder="အင်္ဂလိပ် သို့မဟုတ် မြန်မာစကားစပ်ဝါကျ ရှာဖွေပါ (freedom, peace, country, လွတ်လပ်, လူထု)..." 
              autocomplete="off" 
              class="w-full py-3.5 px-2 text-sm sm:text-base bg-transparent text-charcoal placeholder-muted focus:outline-none font-medium"
            >
            <button onclick="window.HtetDict.searchSentences(document.getElementById('sentence-search-input').value)" class="mr-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all cursor-pointer shadow-xs shrink-0">
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
          </div>

          <div id="sentence-results-list" class="space-y-3"></div>

          <div id="sentence-empty-state" class="p-8 text-center rounded-3xl bg-card border border-hairline text-muted space-y-2">
            <i class="ri-chat-check-line text-3xl text-teal-600"></i>
            <p class="font-medium text-sm text-charcoal">ရှာဖွေလိုသော စကားစု ရိုက်ထည့်ပါ</p>
            <p class="text-xs text-muted max-w-md mx-auto">ဝါကျပေါင်း ၁၂,၀၂၁ ခုထဲမှ စကားစပ်ဝါကျများကို စက္ကန့်ပိုင်းအတွင်း ရှာဖွေပေးပါမည်။</p>
          </div>
        </div>

      </div>
    </div>'''

html = html.replace(old_tab2, new_tab2)

# 5. Insert LibreTranslate Settings Modal before </body>
modal_html = '''  <!-- LibreTranslate Server Settings Modal -->
  <div id="libre-settings-modal" class="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="w-full max-w-md p-6 rounded-3xl bg-card border border-hairline shadow-2xl space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-hairline">
        <div class="flex items-center space-x-2">
          <i class="ri-server-line text-indigo-600 text-xl"></i>
          <h3 class="text-lg font-bold font-serif-editorial text-charcoal m-0">LibreTranslate ဆာဗာ သတ်မှတ်ချက်</h3>
        </div>
        <button onclick="window.HtetDict.closeLibreTranslateSettings()" class="w-8 h-8 rounded-full hover:bg-cream dark:hover:bg-stone-800 flex items-center justify-center text-muted hover:text-charcoal cursor-pointer">
          <i class="ri-close-line text-lg"></i>
        </button>
      </div>

      <div class="space-y-3 text-xs">
        <div class="space-y-1">
          <label class="font-semibold text-charcoal block">LibreTranslate API Endpoint URL:</label>
          <input 
            type="url" 
            id="libre-setting-url" 
            placeholder="http://localhost:5000" 
            class="w-full p-2.5 rounded-xl bg-cream/40 dark:bg-stone-900/40 border border-hairline font-mono text-charcoal focus:border-indigo-500 focus:outline-none"
          >
          <p class="text-[11px] text-muted">ဥပမာ: http://localhost:5000 (Local Docker) သို့မဟုတ် https://libretranslate.com</p>
        </div>

        <div class="space-y-1">
          <label class="font-semibold text-charcoal block">API Key (သတ်မှတ်ထားပါက):</label>
          <input 
            type="password" 
            id="libre-setting-key" 
            placeholder="Optional API Key" 
            class="w-full p-2.5 rounded-xl bg-cream/40 dark:bg-stone-900/40 border border-hairline font-mono text-charcoal focus:border-indigo-500 focus:outline-none"
          >
        </div>

        <div class="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 text-indigo-900 dark:text-indigo-200 space-y-1">
          <span class="font-bold flex items-center space-x-1"><i class="ri-terminal-box-line"></i><span>Local Docker ဖြင့် အသုံးပြုလိုပါက:</span></span>
          <pre class="font-mono text-[10px] p-2 rounded-lg bg-black/40 text-emerald-300 overflow-x-auto select-all">docker run -ti --rm -p 5000:5000 libretranslate/libretranslate</pre>
        </div>
      </div>

      <div class="flex items-center justify-end space-x-2 pt-2 border-t border-hairline">
        <button onclick="window.HtetDict.closeLibreTranslateSettings()" class="px-4 py-2 rounded-xl text-muted hover:text-charcoal cursor-pointer font-medium text-xs">
          မလုပ်ဆောင်ပါ
        </button>
        <button onclick="window.HtetDict.saveLibreTranslateSettings()" class="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors">
          သိမ်းဆည်းမည်
        </button>
      </div>
    </div>
  </div>
'''

if 'libre-settings-modal' not in html:
    html = html.replace('</body>', modal_html + '\n</body>')

# 6. Include js/libretranslate.js script
if 'js/libretranslate.js' not in html:
    script_target = '<script src="js/dictionary.js"></script>'
    script_replacement = '<script src="js/libretranslate.js"></script>\n  <script src="js/dictionary.js"></script>'
    html = html.replace(script_target, script_replacement)

with open('dictionary.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated dictionary.html with LibreTranslate Studio UI')
