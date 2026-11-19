/**
 * Htet Official — Interactive Reading Vocabulary & Glossary Pop-up Engine
 * Seamless word and concept lookup while reading articles, essays, and monographs.
 * 
 * Features:
 *   1. Auto-detected curated Glossary terms (117 political philosophy & feminist concepts)
 *   2. Ornagai & Myanmar Tools Dual Dictionary lookup (111,000+ words)
 *   3. 12,021 HuggingFace Parallel Sentence Corpus lookup
 *   4. Zero-key Neural MT instant fallback
 *   5. Smart popover positioning (touch-friendly, mobile safe-area adaptive)
 *   6. 1-tap TTS Audio pronunciation (Normal speed rate 1.0)
 *   7. 1-tap Copy & Jump to Full Studio
 */

(function() {
  'use strict';

  var popoverEl = null;
  var glossaryCache = null;
  var dictCache = {};
  var activeRange = null;
  var hideTimeout = null;
  var isHandlingLookup = false;

  var VocabLookup = {
    isInitialized: false,

    /**
     * Initialize vocabulary lookup on the specified container or standard article containers
     * @param {string} [containerSelector]
     */
    init: function(containerSelector) {
      if (this.isInitialized) return;
      this.isInitialized = true;

      this.createPopoverElement();
      this.loadGlossaryData();
      this.bindSelectionEvents(containerSelector || '#article-content-body, #journal-modal-body, .article-prose, #dict-def-card, #sentence-results-list, .dict-view-tab, .dict-entry-card, .reading-prose, main p, article');
      this.bindGlobalDismissEvents();

      console.log('[Htet VocabLookup] Interactive Reading Vocabulary Pop-up initialized.');
    },

    /**
     * Create the liquid-glass popover DOM element
     */
    createPopoverElement: function() {
      if (document.getElementById('reader-vocab-popover')) {
        popoverEl = document.getElementById('reader-vocab-popover');
        return;
      }

      popoverEl = document.createElement('div');
      popoverEl.id = 'reader-vocab-popover';
      popoverEl.setAttribute('role', 'dialog');
      popoverEl.setAttribute('aria-modal', 'false');
      popoverEl.className = 'reader-vocab-popover-card';
      document.body.appendChild(popoverEl);

      // Prevent clicks inside popover from dismissing it
      popoverEl.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    },

    /**
     * Preload curated glossary concepts (Only on dedicated reading pages)
     */
    loadGlossaryData: function() {
      var container = document.getElementById('article-content-body');
      if (!container) return; // Do not preload 70KB glossary on homepage or non-reading pages

      if (window.HtetGlossaryData && Array.isArray(window.HtetGlossaryData)) {
        glossaryCache = window.HtetGlossaryData;
        this.scanAndHighlightGlossary();
        return;
      }

      if (window.DataLoader && typeof window.DataLoader.loadGlossary === 'function') {
        window.DataLoader.loadGlossary().then(function(data) {
          glossaryCache = data;
          VocabLookup.scanAndHighlightGlossary();
        }).catch(function() {});
      } else {
        fetch('data/glossary.json')
          .then(function(r) { return r.ok ? r.json() : []; })
          .then(function(data) {
            glossaryCache = data;
            VocabLookup.scanAndHighlightGlossary();
          })
          .catch(function() {});
      }
    },

    /**
     * Automatically underline curated glossary concepts in the article body
     */
    scanAndHighlightGlossary: function() {
      if (!glossaryCache || !glossaryCache.length) return;

      var container = document.getElementById('article-content-body');
      if (!container) return;

      // Collect top 40 key English & Burmese terms
      var termsMap = {};
      glossaryCache.forEach(function(item) {
        if (item.term_en && item.term_en.length >= 4) {
          termsMap[item.term_en.toLowerCase()] = item;
        }
      });

      var termKeys = Object.keys(termsMap).sort(function(a, b) { return b.length - a.length; });
      if (!termKeys.length) return;

      // Regex pattern matching word boundaries
      var escaped = termKeys.map(function(k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); });
      var pattern = new RegExp('\\b(' + escaped.join('|') + ')\\b', 'gi');

      // Walk text nodes only
      var walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            var parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            var tag = parent.tagName.toLowerCase();
            if (['a', 'button', 'script', 'style', 'code', 'pre', 'h1', 'h2', 'h3'].indexOf(tag) !== -1) {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.classList.contains('reader-glossary-term') || parent.classList.contains('citation-badge')) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      var nodesToReplace = [];
      var node;
      while ((node = walker.nextNode())) {
        if (pattern.test(node.nodeValue)) {
          nodesToReplace.push(node);
        }
      }

      nodesToReplace.forEach(function(textNode) {
        var val = textNode.nodeValue;
        var parent = textNode.parentNode;
        if (!parent) return;

        var frag = document.createDocumentFragment();
        var lastIdx = 0;

        val.replace(pattern, function(match, term, offset) {
          // Add preceding text
          if (offset > lastIdx) {
            frag.appendChild(document.createTextNode(val.substring(lastIdx, offset)));
          }

          var span = document.createElement('span');
          span.className = 'reader-glossary-term';
          span.textContent = match;
          span.setAttribute('data-term', match);
          span.setAttribute('title', 'ဝေါဟာရ အဓိပ္ပာယ် ဖွင့်ဆိုချက် ကြည့်မည်');
          frag.appendChild(span);

          lastIdx = offset + match.length;
          return match;
        });

        if (lastIdx < val.length) {
          frag.appendChild(document.createTextNode(val.substring(lastIdx)));
        }

        parent.replaceChild(frag, textNode);
      });
    },

    /**
     * Bind text selection and touch tap events (Optimized for Mobile Touch & Tap-to-Define)
     */
    bindSelectionEvents: function(selector) {
      // 1. Click on highlighted glossary terms
      document.addEventListener('click', function(e) {
        var termEl = e.target.closest('.reader-glossary-term');
        if (termEl) {
          e.preventDefault();
          e.stopPropagation();
          var term = termEl.getAttribute('data-term') || termEl.textContent.trim();
          var rect = termEl.getBoundingClientRect();
          VocabLookup.lookupAndShow(term, rect);
        }
      });

      // 2. Mouse selection release (Desktop)
      document.addEventListener('mouseup', function(e) {
        if (e.target.closest('#reader-vocab-popover') || e.target.closest('.reader-glossary-term') || e.target.closest('button, a, input, textarea, select')) {
          return;
        }

        var container = document.querySelector(selector);
        if (!container || !container.contains(e.target)) return;

        setTimeout(function() {
          var sel = window.getSelection();
          if (!sel || sel.isCollapsed) return;

          var text = sel.toString().trim();
          if (text.length >= 2 && text.length <= 80 && text.split(/\s+/).length <= 6) {
            var range = sel.getRangeAt(0);
            var rect = range.getBoundingClientRect();
            VocabLookup.lookupAndShow(text, rect);
          }
        }, 120);
      });

      // 3. Desktop double-click to look up single word
      document.addEventListener('dblclick', function(e) {
        if (e.target.closest('#reader-vocab-popover') || e.target.closest('.reader-glossary-term') || e.target.closest('button, a, input, textarea, select')) {
          return;
        }
        var container = document.querySelector(selector);
        if (!container || !container.contains(e.target)) return;

        var sel = window.getSelection();
        if (sel && !sel.isCollapsed) {
          var text = sel.toString().trim();
          if (text.length >= 2 && text.length <= 60) {
            var range = sel.getRangeAt(0);
            VocabLookup.lookupAndShow(text, range.getBoundingClientRect());
          }
        }
      });

      // 4. Mobile & Touch: Instant Tap-to-Define & Selection Handlers
      var touchStartX = 0, touchStartY = 0, touchStartTime = 0;
      document.addEventListener('touchstart', function(e) {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchStartTime = Date.now();
        }
      }, { passive: true });

      document.addEventListener('touchend', function(e) {
        if (e.target.closest('#reader-vocab-popover') || e.target.closest('.reader-glossary-term') || e.target.closest('button, a, input, textarea, select, label')) {
          return;
        }

        var container = document.querySelector(selector);
        if (!container || !container.contains(e.target)) return;

        var elapsed = Date.now() - touchStartTime;
        var touch = e.changedTouches && e.changedTouches[0];
        if (!touch) return;
        var dist = Math.hypot(touch.clientX - touchStartX, touch.clientY - touchStartY);

        setTimeout(function() {
          // 4a. If user selected a range with touch handles
          var sel = window.getSelection();
          if (sel && !sel.isCollapsed) {
            var text = sel.toString().trim();
            if (text.length >= 2 && text.length <= 80 && text.split(/\s+/).length <= 6) {
              var range = sel.getRangeAt(0);
              var rect = range.getBoundingClientRect();
              VocabLookup.lookupAndShow(text, rect);
              return;
            }
          }

          // 4b. Instant Tap: Single tap on any word on mobile phone (< 450ms, < 15px movement)
          if (elapsed < 450 && dist < 15) {
            var wordInfo = VocabLookup.getWordAtPoint(touch.clientX, touch.clientY);
            if (wordInfo && wordInfo.word) {
              VocabLookup.lookupAndShow(wordInfo.word, wordInfo.rect);
            }
          }
        }, 140);
      });
    },

    /**
     * Helper: Extract exact word and its bounding rect at touch/click coordinates
     */
    getWordAtPoint: function(x, y) {
      var range = null, textNode = null, offset = 0;
      if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(x, y);
        if (range) {
          textNode = range.startContainer;
          offset = range.startOffset;
        }
      } else if (document.caretPositionFromPoint) {
        var pos = document.caretPositionFromPoint(x, y);
        if (pos) {
          textNode = pos.offsetNode;
          offset = pos.offset;
        }
      }

      if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return null;
      var parent = textNode.parentElement;
      if (parent && (parent.closest('button, a, input, textarea, select, #reader-vocab-popover') || parent.tagName === 'BUTTON' || parent.tagName === 'A')) {
        return null;
      }

      var text = textNode.nodeValue;
      if (!text) return null;

      // Unicode Word Boundary Matcher: English, Digits, and Burmese Unicode (U+1000 - U+109F, U+AA60 - U+AA7F, U+A9E0 - U+A9FF)
      var isWordChar = function(ch) {
        return /[\w\u1000-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF]/.test(ch);
      };

      if (offset >= text.length) offset = text.length - 1;
      if (offset < 0) return null;
      if (!isWordChar(text[offset])) {
        if (offset > 0 && isWordChar(text[offset - 1])) {
          offset--;
        } else {
          return null;
        }
      }

      var start = offset;
      while (start > 0 && isWordChar(text[start - 1])) {
        start--;
      }
      var end = offset;
      while (end < text.length && isWordChar(text[end])) {
        end++;
      }

      var word = text.substring(start, end).trim();
      if (word.length >= 2) {
        try {
          var wordRange = document.createRange();
          wordRange.setStart(textNode, start);
          wordRange.setEnd(textNode, end);
          return { word: word, rect: wordRange.getBoundingClientRect() };
        } catch (err) {
          return { word: word, rect: { top: y - 10, bottom: y + 10, left: x - 20, right: x + 20, width: 40, height: 20 } };
        }
      }
      return null;
    },

    /**
     * Bind global clicks to dismiss popover
     */
    bindGlobalDismissEvents: function() {
      var dismissFn = function(e) {
        if (popoverEl && popoverEl.classList.contains('popover-visible') && !popoverEl.contains(e.target) && !e.target.closest('.reader-glossary-term')) {
          VocabLookup.hide();
        }
      };
      document.addEventListener('mousedown', dismissFn);
      document.addEventListener('touchstart', function(e) {
        if (popoverEl && popoverEl.classList.contains('popover-visible') && !popoverEl.contains(e.target) && !e.target.closest('.reader-glossary-term')) {
          VocabLookup.hide();
        }
      }, { passive: true });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          VocabLookup.hide();
        }
      });

      var lastScrollY = 0;
      window.addEventListener('scroll', function() {
        if (!popoverEl || !popoverEl.classList.contains('popover-visible')) return;
        var currentY = window.scrollY || window.pageYOffset || 0;
        if (Math.abs(currentY - lastScrollY) > 120) {
          VocabLookup.hide();
          lastScrollY = currentY;
        }
      }, { passive: true });
    },

    /**
     * Main Lookup Algorithm: Glossary -> Dictionary -> Parallel Corpus -> MT Fallback
     */
    lookupAndShow: function(term, rect) {
      if (!term || !rect) return;
      var cleanTerm = term.trim().replace(/^["'“”‘’.,;:!?()\[\]]+|["'“”‘’.,;:!?()\[\]]+$/g, '');
      if (!cleanTerm) return;

      this.showLoading(rect, cleanTerm);

      // 1. Try Curated Glossary match
      var glossaryMatch = this.findInGlossary(cleanTerm);
      if (glossaryMatch) {
        this.renderGlossaryMatch(glossaryMatch, rect);
        return;
      }

      // 2. Try Dictionary match (Ornagai 111K+ & Myanmar Tools)
      this.findInDictionary(cleanTerm).then(function(dictMatch) {
        if (dictMatch) {
          VocabLookup.renderDictionaryMatch(cleanTerm, dictMatch, rect);
          return;
        }

        // 3. Try Parallel Translation Corpus (12,021 Pairs)
        var corpusMatch = VocabLookup.findInCorpus(cleanTerm);
        if (corpusMatch) {
          VocabLookup.renderCorpusMatch(cleanTerm, corpusMatch, rect);
          return;
        }

        // 4. Try Cloud Neural MT Fallback
        VocabLookup.fetchNeuralTranslate(cleanTerm).then(function(mtMatch) {
          if (mtMatch) {
            VocabLookup.renderTranslationMatch(cleanTerm, mtMatch, rect);
          } else {
            VocabLookup.renderNotFound(cleanTerm, rect);
          }
        });
      });
    },

    findInGlossary: function(term) {
      if (!glossaryCache || !glossaryCache.length) return null;
      var q = term.toLowerCase();

      // Exact term_en match
      for (var i = 0; i < glossaryCache.length; i++) {
        var g = glossaryCache[i];
        if (g.term_en && g.term_en.toLowerCase() === q) return g;
        if (g.term_mm && g.term_mm.toLowerCase().indexOf(q) !== -1) return g;
        if (g.slug && g.slug.toLowerCase() === q.replace(/\s+/g, '-')) return g;
      }
      return null;
    },

    findInDictionary: function(term) {
      var word = term.toLowerCase().trim();
      var first = word[0];
      if (!first || !/^[a-z]$/.test(first)) {
        return Promise.resolve(null);
      }

      // Check cache
      if (dictCache[first]) {
        var data = dictCache[first];
        return Promise.resolve(data[word] || null);
      }

      var varName = 'HTET_DICT_' + first.toUpperCase();
      if (window[varName]) {
        dictCache[first] = window[varName];
        return Promise.resolve(window[varName][word] || null);
      }

      return new Promise(function(resolve) {
        var isFile = (window.location.protocol === 'file:');
        if (!isFile) {
          fetch('data/dictionary/' + first + '.json')
            .then(function(r) { return r.ok ? r.json() : null; })
            .then(function(data) {
              if (data) {
                dictCache[first] = data;
                window[varName] = data;
                resolve(data[word] || null);
                return;
              }
              throw new Error('Fallback to script');
            })
            .catch(function() {
              VocabLookup.loadDictScript(first, varName, function(d) {
                resolve((d && d[word]) || null);
              });
            });
        } else {
          VocabLookup.loadDictScript(first, varName, function(d) {
            resolve((d && d[word]) || null);
          });
        }
      });
    },

    loadDictScript: function(letter, varName, cb) {
      var s = document.createElement('script');
      s.src = 'js/data/dictionary/' + letter + '.js';
      s.async = true;
      s.onload = function() {
        dictCache[letter] = window[varName] || {};
        cb(dictCache[letter]);
      };
      s.onerror = function() {
        cb(null);
      };
      document.head.appendChild(s);
    },

    findInCorpus: function(term) {
      var pairs = window.HTET_TRANSLATIONS;
      if (!pairs || !pairs.length) return null;
      var q = term.toLowerCase().trim();

      for (var i = 0; i < pairs.length; i++) {
        var p = pairs[i];
        if (p.en && p.en.toLowerCase() === q) return p;
        if (p.my && p.my.trim() === q) return p;
      }
      for (var j = 0; j < pairs.length; j++) {
        var item = pairs[j];
        if (item.en && item.en.toLowerCase().indexOf(q) !== -1) return item;
        if (item.my && item.my.indexOf(q) !== -1) return item;
      }
      return null;
    },

    fetchNeuralTranslate: function(text) {
      var isMy = /[က-႟]/.test(text);
      var sl = isMy ? 'my' : 'en';
      var tl = isMy ? 'en' : 'my';

      var url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=' + sl + '&tl=' + tl + '&dt=t&q=' + encodeURIComponent(text);
      return fetch(url)
        .then(function(r) { return r.ok ? r.json() : null; })
        .then(function(d) {
          if (d && d[0]) {
            return d[0].map(function(part) { return part[0]; }).join('');
          }
          return null;
        })
        .catch(function() { return null; });
    },

    /**
     * Render Initial Loading State
     */
    showLoading: function(rect, term) {
      if (!popoverEl) this.createPopoverElement();

      popoverEl.innerHTML = [
        '<div class="sm:hidden w-10 h-1.5 rounded-full bg-charcoal/20 dark:bg-white/20 mx-auto -mt-1 mb-2.5 cursor-grab"></div>',
        '<div class="flex items-center justify-between pb-2 mb-2 border-b border-hairline/60">',
        '  <div class="flex items-center space-x-2">',
        '    <span class="hanko-stamp px-2 py-0.5 text-[10px] font-bold">ဝေါဟာရ</span>',
        '    <span class="font-serif-editorial font-bold text-sm text-charcoal truncate max-w-[200px]">' + escapeHtml(term) + '</span>',
        '  </div>',
        '  <button onclick="window.VocabLookup.hide()" class="text-muted hover:text-charcoal p-1 text-sm"><i class="ri-close-line"></i></button>',
        '</div>',
        '<div class="py-3 flex items-center space-x-2 text-xs text-muted">',
        '  <span class="w-3.5 h-3.5 border-2 border-vermilion border-t-transparent rounded-full animate-spin"></span>',
        '  <span>ဝေါဟာရ အဓိပ္ပာယ် ဖွင့်ဆိုချက် ရှာဖွေနေပါသည်...</span>',
        '</div>'
      ].join('\n');

      this.positionPopover(rect);
      popoverEl.classList.add('popover-visible');
    },

    /**
     * Render Curated Glossary Match (Rich Philosophical Definition)
     */
    renderGlossaryMatch: function(g, rect) {
      var title = g.term_en || g.term_mm;
      var subtitle = g.term_mm || '';
      var ipa = g.pronunciation || '';
      var category = g.category_mm || g.category_en || 'ဒဿနိကဗေဒ ဝေါဟာရ';
      var def = g.definition_mm || g.definition_en || '';
      var context = g.context_mm || g.example_mm || '';
      var thinker = g.thinker || '';

      var html = [
        '<div class="vocab-popover-content space-y-3">',
'  <div class="sm:hidden w-10 h-1.5 rounded-full bg-charcoal/20 dark:bg-white/20 mx-auto -mt-1 mb-2.5 cursor-grab"></div>',

        '  <div class="flex items-center justify-between pb-2 border-b border-hairline/60">',
        '    <div class="flex items-center space-x-2 min-w-0">',
        '      <span class="hanko-stamp px-2 py-0.5 text-[10px] font-bold shrink-0">ဒဿန ဝေါဟာရ</span>',
        '      <h4 class="font-serif-editorial font-bold text-base text-charcoal truncate m-0">' + escapeHtml(title) + '</h4>',
        '    </div>',
        '    <div class="flex items-center space-x-1 shrink-0">',
        '      <button onclick="window.VocabLookup.speak(\'' + escapeJs(title) + '\', \'en\')" title="အသံထွက် နားဆင်မည်" class="p-1 rounded-lg text-muted hover:text-vermilion hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-volume-up-line text-sm"></i></button>',
        '      <button onclick="window.VocabLookup.copyText(\'' + escapeJs(title + ': ' + def) + '\')" title="ကူးယူမည်" class="p-1 rounded-lg text-muted hover:text-charcoal hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-file-copy-line text-sm"></i></button>',
        '      <button onclick="window.VocabLookup.hide()" title="ပိတ်မည်" class="p-1 rounded-lg text-muted hover:text-charcoal hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-close-line text-sm"></i></button>',
        '    </div>',
        '  </div>',

        '  <div class="flex flex-wrap items-center gap-1.5 text-[11px] font-sans-ui text-muted">',
        ipa ? '    <span class="font-mono bg-cream/70 dark:bg-stone-800 px-2 py-0.5 rounded-full text-indigo-700 dark:text-indigo-300 font-semibold">' + escapeHtml(ipa) + '</span>' : '',
        '    <span class="px-2 py-0.5 rounded-full bg-vermilion/10 text-vermilion font-medium">' + escapeHtml(category) + '</span>',
        thinker ? '    <span class="text-faint truncate max-w-[150px]"><i class="ri-user-star-line mr-0.5"></i>' + escapeHtml(thinker) + '</span>' : '',
        '  </div>',

        '  <div class="text-xs sm:text-[13px] text-charcoal leading-relaxed font-sans-ui font-medium py-1">',
        '    ' + escapeHtml(def),
        '  </div>',

        context ? [
          '  <div class="p-2.5 rounded-2xl bg-cream/50 dark:bg-stone-900/50 border border-hairline/60 text-[11px] text-muted italic leading-relaxed">',
          '    <span class="font-bold font-sans-ui not-italic text-charcoal/80">အသုံးချ သဘောတရား: </span>' + escapeHtml(context),
          '  </div>'
        ].join('\n') : '',

        '  <div class="pt-2 border-t border-hairline/60 flex items-center justify-between gap-2">',
        '    <a href="glossary.html#' + encodeURIComponent(g.id || g.slug) + '" class="text-[11px] font-bold text-vermilion hover:underline flex items-center space-x-1"><i class="ri-book-open-line"></i><span>ဝေါဟာရ အပြည့်အစုံ ကြည့်မည်</span></a>',
        '    <a href="translate.html?q=' + encodeURIComponent(title) + '" class="text-[11px] text-muted hover:text-charcoal flex items-center space-x-1"><i class="ri-translate"></i><span>စတူဒီယို</span></a>',
        '  </div>',
        '</div>'
      ].join('\n');

      popoverEl.innerHTML = html;
      this.positionPopover(rect);
    },

    /**
     * Render Ornagai Dictionary Match (Part of speech, IPA, Burmese transcription, examples)
     */
    renderDictionaryMatch: function(word, dictEntries, rect) {
      var entry = Array.isArray(dictEntries) ? dictEntries[0] : dictEntries;
      if (!entry) return;
      var pos = entry.p || entry.pos || '';
      var ipa = entry.i || entry.ipa || '';
      var pronMm = entry.m || '';
      var def = entry.d || entry.def || (typeof entry === 'string' ? entry : '');
      var examples = entry.e || entry.examples || [];

      var html = [
        '<div class="vocab-popover-content space-y-3">',
'  <div class="sm:hidden w-10 h-1.5 rounded-full bg-charcoal/20 dark:bg-white/20 mx-auto -mt-1 mb-2.5 cursor-grab"></div>',

        '  <div class="flex items-center justify-between pb-2 border-b border-hairline/60">',
        '    <div class="flex items-center space-x-2 min-w-0">',
        '      <span class="hanko-stamp px-2 py-0.5 text-[10px] font-bold shrink-0">အဘိဓာန်</span>',
        '      <h4 class="font-serif-editorial font-bold text-base text-charcoal truncate m-0">' + escapeHtml(word.toUpperCase()) + '</h4>',
        '    </div>',
        '    <div class="flex items-center space-x-1 shrink-0">',
        '      <button onclick="window.VocabLookup.speak(\'' + escapeJs(word) + '\', \'en\')" title="အသံထွက် နားဆင်မည်" class="p-1 rounded-lg text-muted hover:text-vermilion hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-volume-up-line text-sm"></i></button>',
        '      <button onclick="window.VocabLookup.copyText(\'' + escapeJs(word + ': ' + def) + '\')" title="ကူးယူမည်" class="p-1 rounded-lg text-muted hover:text-charcoal hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-file-copy-line text-sm"></i></button>',
        '      <button onclick="window.VocabLookup.hide()" title="ပိတ်မည်" class="p-1 rounded-lg text-muted hover:text-charcoal hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-close-line text-sm"></i></button>',
        '    </div>',
        '  </div>',

        '  <div class="flex flex-wrap items-center gap-1.5 text-[11px] font-sans-ui text-muted">',
        pos ? '    <span class="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold">(' + escapeHtml(pos) + ')</span>' : '',
        ipa ? '    <span class="font-mono bg-cream/70 dark:bg-stone-800 px-2 py-0.5 rounded-full text-charcoal font-semibold">' + escapeHtml(ipa) + '</span>' : '',
        pronMm ? '    <span class="text-muted font-sans-ui">[' + escapeHtml(pronMm) + ']</span>' : '',
        '  </div>',

        '  <div class="text-xs sm:text-[13px] text-charcoal leading-relaxed font-sans-ui font-medium py-1">',
        '    ' + escapeHtml(def),
        '  </div>',

        examples && examples.length ? [
          '  <div class="space-y-1 pt-1">',
          '    <span class="text-[10px] font-bold text-muted uppercase tracking-wider block">နမူနာ ဝါကျ:</span>',
          '    <div class="text-[11px] text-muted italic leading-relaxed pl-2 border-l-2 border-teal-500">',
          '      ' + escapeHtml(examples[0]),
          '    </div>',
          '  </div>'
        ].join('\n') : '',

        '  <div class="pt-2 border-t border-hairline/60 flex items-center justify-between gap-2">',
        '    <a href="dictionary.html?q=' + encodeURIComponent(word) + '" class="text-[11px] font-bold text-teal-700 dark:text-teal-300 hover:underline flex items-center space-x-1"><i class="ri-book-2-line"></i><span>အဘိဓာန် အပြည့်အစုံ ကြည့်မည်</span></a>',
        '    <a href="translate.html?q=' + encodeURIComponent(word) + '" class="text-[11px] text-muted hover:text-charcoal flex items-center space-x-1"><i class="ri-translate"></i><span>ဘာသာပြန်</span></a>',
        '  </div>',
        '</div>'
      ].join('\n');

      popoverEl.innerHTML = html;
      this.positionPopover(rect);
    },

    /**
     * Render 12,021 Parallel Corpus Match
     */
    renderCorpusMatch: function(query, item, rect) {
      var isMy = /[က-႟]/.test(query);
      var translated = isMy ? item.en : item.my;

      var html = [
        '<div class="vocab-popover-content space-y-3">',
'  <div class="sm:hidden w-10 h-1.5 rounded-full bg-charcoal/20 dark:bg-white/20 mx-auto -mt-1 mb-2.5 cursor-grab"></div>',

        '  <div class="flex items-center justify-between pb-2 border-b border-hairline/60">',
        '    <div class="flex items-center space-x-2 min-w-0">',
        '      <span class="hanko-stamp px-2 py-0.5 text-[10px] font-bold shrink-0">Corpus Match</span>',
        '      <h4 class="font-serif-editorial font-bold text-sm text-charcoal truncate m-0">' + escapeHtml(query) + '</h4>',
        '    </div>',
        '    <div class="flex items-center space-x-1 shrink-0">',
        '      <button onclick="window.VocabLookup.speak(\'' + escapeJs(translated) + '\', \'' + (isMy ? 'en' : 'my') + '\')" title="အသံထွက် နားဆင်မည်" class="p-1 rounded-lg text-muted hover:text-vermilion hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-volume-up-line text-sm"></i></button>',
        '      <button onclick="window.VocabLookup.copyText(\'' + escapeJs(translated) + '\')" title="ကူးယူမည်" class="p-1 rounded-lg text-muted hover:text-charcoal hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-file-copy-line text-sm"></i></button>',
        '      <button onclick="window.VocabLookup.hide()" title="ပိတ်မည်" class="p-1 rounded-lg text-muted hover:text-charcoal hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-close-line text-sm"></i></button>',
        '    </div>',
        '  </div>',

        '  <div class="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 font-bold flex items-center space-x-1">',
        '    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>',
        '    <span>၁၂,၀၂၁ Human-Verified Parallel Corpus (100% Offline)</span>',
        '  </div>',

        '  <div class="text-xs sm:text-[13px] text-charcoal leading-relaxed font-sans-ui font-bold py-1 bg-cream/40 dark:bg-stone-900/40 p-2.5 rounded-2xl border border-hairline/60">',
        '    ' + escapeHtml(translated),
        '  </div>',

        '  <div class="pt-2 border-t border-hairline/60 flex items-center justify-between gap-2">',
        '    <a href="translate.html?q=' + encodeURIComponent(query) + '" class="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:underline flex items-center space-x-1"><i class="ri-translate"></i><span>ဘာသာပြန်စတူဒီယိုတွင် ကြည့်မည်</span></a>',
        '  </div>',
        '</div>'
      ].join('\n');

      popoverEl.innerHTML = html;
      this.positionPopover(rect);
    },

    /**
     * Render Neural Translation Match
     */
    renderTranslationMatch: function(query, translated, rect) {
      var isMy = /[က-႟]/.test(query);

      var html = [
        '<div class="vocab-popover-content space-y-3">',
'  <div class="sm:hidden w-10 h-1.5 rounded-full bg-charcoal/20 dark:bg-white/20 mx-auto -mt-1 mb-2.5 cursor-grab"></div>',

        '  <div class="flex items-center justify-between pb-2 border-b border-hairline/60">',
        '    <div class="flex items-center space-x-2 min-w-0">',
        '      <span class="hanko-stamp px-2 py-0.5 text-[10px] font-bold shrink-0">ဘာသာပြန်</span>',
        '      <h4 class="font-serif-editorial font-bold text-sm text-charcoal truncate m-0">' + escapeHtml(query) + '</h4>',
        '    </div>',
        '    <div class="flex items-center space-x-1 shrink-0">',
        '      <button onclick="window.VocabLookup.speak(\'' + escapeJs(translated) + '\', \'' + (isMy ? 'en' : 'my') + '\')" title="အသံထွက် နားဆင်မည်" class="p-1 rounded-lg text-muted hover:text-vermilion hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-volume-up-line text-sm"></i></button>',
        '      <button onclick="window.VocabLookup.copyText(\'' + escapeJs(translated) + '\')" title="ကူးယူမည်" class="p-1 rounded-lg text-muted hover:text-charcoal hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-file-copy-line text-sm"></i></button>',
        '      <button onclick="window.VocabLookup.hide()" title="ပိတ်မည်" class="p-1 rounded-lg text-muted hover:text-charcoal hover:bg-cream dark:hover:bg-stone-800 transition-colors"><i class="ri-close-line text-sm"></i></button>',
        '    </div>',
        '  </div>',

        '  <div class="text-[10px] font-mono text-indigo-700 dark:text-indigo-300 font-bold flex items-center space-x-1">',
        '    <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>',
        '    <span>Neural Machine Translation</span>',
        '  </div>',

        '  <div class="text-xs sm:text-[13px] text-charcoal leading-relaxed font-sans-ui font-bold py-1 bg-cream/40 dark:bg-stone-900/40 p-2.5 rounded-2xl border border-hairline/60">',
        '    ' + escapeHtml(translated),
        '  </div>',

        '  <div class="pt-2 border-t border-hairline/60 flex items-center justify-between gap-2">',
        '    <a href="translate.html?q=' + encodeURIComponent(query) + '" class="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:underline flex items-center space-x-1"><i class="ri-translate"></i><span>ဘာသာပြန်စတူဒီယိုတွင် ကြည့်မည်</span></a>',
        '  </div>',
        '</div>'
      ].join('\n');

      popoverEl.innerHTML = html;
      this.positionPopover(rect);
    },

    renderNotFound: function(term, rect) {
      popoverEl.innerHTML = [
        '<div class="flex items-center justify-between pb-2 mb-2 border-b border-hairline/60">',
        '  <span class="font-serif-editorial font-bold text-sm text-charcoal truncate max-w-[200px]">' + escapeHtml(term) + '</span>',
        '  <button onclick="window.VocabLookup.hide()" class="text-muted hover:text-charcoal p-1 text-sm"><i class="ri-close-line"></i></button>',
        '</div>',
        '<div class="py-2 text-xs text-muted leading-relaxed">',
        '  ဤဝေါဟာရအတွက် အဘိဓာန် အဓိပ္ပာယ်ဖွင့်ဆိုချက် မတွေ့ရှိပါရှင်။ ဘာသာပြန်စတူဒီယိုတွင် ရှာဖွေနိုင်ပါသည်။',
        '</div>',
        '<div class="pt-2 border-t border-hairline/60">',
        '  <a href="translate.html?q=' + encodeURIComponent(term) + '" class="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:underline flex items-center space-x-1"><i class="ri-translate"></i><span>ဘာသာပြန်စတူဒီယိုသို့ သွားမည်</span></a>',
        '</div>'
      ].join('\n');
      this.positionPopover(rect);
    },

    /**
     * Smart Popover Positioning Engine
     */
    positionPopover: function(rect) {
      if (!popoverEl) return;

      popoverEl.classList.add('popover-visible');
      var isMobile = (window.innerWidth < 640);

      if (isMobile) {
        // Mobile Mode: Render as fixed bottom floating sheet for perfect thumb reachability without covering text
        popoverEl.classList.add('popover-mobile-sheet');
        popoverEl.classList.remove('popover-flipped');
        popoverEl.style.position = 'fixed';
        popoverEl.style.bottom = '12px';
        popoverEl.style.left = '12px';
        popoverEl.style.right = '12px';
        popoverEl.style.top = 'auto';
        popoverEl.style.width = 'auto';
        popoverEl.style.maxWidth = 'calc(100vw - 24px)';
        popoverEl.style.maxHeight = '75vh';
        popoverEl.style.zIndex = '9999';
        return;
      }

      // Desktop Mode: Floating relative to selection
      popoverEl.classList.remove('popover-mobile-sheet');
      popoverEl.style.position = 'absolute';
      popoverEl.style.bottom = 'auto';
      popoverEl.style.right = 'auto';
      popoverEl.style.maxHeight = 'none';
      popoverEl.style.zIndex = '1050';

      var scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;

      var popWidth = Math.min(390, window.innerWidth - 24);
      var popHeight = popoverEl.offsetHeight || 220;

      // Vertical positioning: default to placing above selection
      var top;
      var isFlipped = false;

      if (rect.top - popHeight - 16 >= 10) {
        top = rect.top + scrollY - popHeight - 12;
      } else {
        // Place below selection
        top = rect.bottom + scrollY + 12;
        isFlipped = true;
      }

      // Horizontal positioning: center on selection, clamped to window
      var centerTarget = rect.left + scrollX + (rect.width / 2);
      var left = centerTarget - (popWidth / 2);

      var minLeft = scrollX + 12;
      var maxLeft = scrollX + window.innerWidth - popWidth - 12;

      left = Math.max(minLeft, Math.min(maxLeft, left));

      popoverEl.style.width = popWidth + 'px';
      popoverEl.style.left = left + 'px';
      popoverEl.style.top = top + 'px';

      if (isFlipped) {
        popoverEl.classList.add('popover-flipped');
      } else {
        popoverEl.classList.remove('popover-flipped');
      }

      // Position caret arrow
      var arrowLeft = Math.max(16, Math.min(popWidth - 16, centerTarget - left));
      popoverEl.style.setProperty('--arrow-left', arrowLeft + 'px');
    },

    hide: function() {
      if (popoverEl) {
        popoverEl.classList.remove('popover-visible');
      }
    },

    speak: function(text, lang) {
      if (!text) return;
      if (window.HtetTranslator && typeof window.HtetTranslator.speak === 'function') {
        window.HtetTranslator.speak(text, lang);
      } else if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = (lang === 'my') ? 'my-MM' : 'en-US';
        u.rate = 1.0;
        window.speechSynthesis.speak(u);
      }
    },

    copyText: function(text) {
      if (!text) return;
      navigator.clipboard.writeText(text).then(function() {
        if (typeof window.showToast === 'function') {
          window.showToast('ကူးယူပြီးပါပြီ');
        } else {
          alert('ကူးယူပြီးပါပြီ');
        }
      }).catch(function() {});
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

  function escapeJs(str) {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, ' ');
  }

  // Export to global scope
  window.VocabLookup = VocabLookup;
  window.HtetVocabLookup = VocabLookup;

  // Auto initialize on idle if reading container exists
  document.addEventListener('DOMContentLoaded', function() {
    var hasReadingContainer = !!document.querySelector('#article-content-body, #journal-modal-body, .article-prose, #dict-def-card, #sentence-results-list, .dict-view-tab, .reading-prose, main');
    if (hasReadingContainer) {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(function() { VocabLookup.init(); }, { timeout: 2500 });
      } else {
        setTimeout(function() { VocabLookup.init(); }, 150);
      }
    }
  });
})();
