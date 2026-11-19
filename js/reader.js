/**
 * Htet Official — Immersive Academic Reader Engine (Upgraded)
 * - Interactive Inline Citations with Floating Popover Cards
 * - Bi-directional Citation Jumping & Return to Reading Position
 * - Heading Enhancements (Anchor links, section pills, read-time estimates)
 * - Dynamic Active Scrollspy Table of Contents
 * - KaTeX Academic Notation Auto-Render
 * - Responsive Font Scaler with Persistence
 * - Keyboard Shortcuts & Clean Sino-Japanese Wabi-Sabi Aesthetics
 */
(function() {
  'use strict';

  // Instant global handlers for slide gallery and checklist
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

  const FONT_SIZE_KEY = 'reader_font_size';
  const DEFAULT_FONT_SIZE = 19; // px optimal for Pyidaungsu & Cormorant Garamond

  const Reader = {
    fontSize: DEFAULT_FONT_SIZE,
    articleData: null,
    overrideLang: null, // null follows site lang; 'mm' or 'en' forces specific language
    parsedCitations: [],
    activeBadge: null,
    popoverEl: null,
    hidePopoverTimeout: null,
    scrollSpyObserver: null,
    activeCharts: {},
    earthquakeMap: null,

    init() {
      this.initFontSize();
      this.initProgressBar();
      this.initReadingHeader();
      this.initArticleView();
      this.initKeyboardShortcuts();
      this.initPopoverElement();
      this.initZenFocusMode();
      this.initLangToggle();
      this.initFloatingCompanion();
    },

    // --------------------------------------------------------------------------
    // 1. Font Size Engine
    // --------------------------------------------------------------------------
    initFontSize() {
      if (window.FontEngine) {
        window.FontEngine.init();
      }
      const saved = localStorage.getItem(FONT_SIZE_KEY);
      this.fontSize = saved ? parseFloat(saved) : this.getOptimalBaseFontSize();
      this.applyFontSize();

      document.addEventListener('click', (e) => {
        if (e.target.closest('#font-increase, [data-font-action="increase"]')) {
          if (window.FontEngine) {
            window.FontEngine.increase();
          } else if (this.fontSize < 26) {
            this.fontSize += 1.5;
            this.saveFontSize();
          }
        } else if (e.target.closest('#font-decrease, [data-font-action="decrease"]')) {
          if (window.FontEngine) {
            window.FontEngine.decrease();
          } else if (this.fontSize > 14) {
            this.fontSize -= 1.5;
            this.saveFontSize();
          }
        } else if (e.target.closest('#font-reset, [data-font-action="reset"]')) {
          if (window.FontEngine) {
            window.FontEngine.reset();
          } else {
            this.fontSize = this.getOptimalBaseFontSize();
            this.saveFontSize();
          }
        }
      });
    },

    getOptimalBaseFontSize() {
      const w = window.innerWidth;
      if (w <= 375) return 16.5;
      if (w <= 640) return 17.5;
      if (w <= 1024) return 18.5;
      return 19.5;
    },

    saveFontSize() {
      localStorage.setItem(FONT_SIZE_KEY, this.fontSize);
      this.applyFontSize();
    },

    applyFontSize() {
      const container = document.getElementById('article-content-body');
      if (container) {
        const scale = window.FontEngine ? window.FontEngine.getScale().scale : 1.0;
        container.style.fontSize = `${this.fontSize * scale}px`;
      }
    },

    // --------------------------------------------------------------------------
    // 2. Reading Progress & Remaining Time
    // --------------------------------------------------------------------------
    initProgressBar() {
      const bar = document.getElementById('reading-progress');
      const timeRemainingEl = document.getElementById('reading-time-remaining');
      const progressCircle = document.getElementById('reading-progress-circle');
      const companion = document.getElementById('floating-reading-companion');

      const updateProgress = () => {
        const docElem = document.documentElement;
        const totalHeight = docElem.scrollHeight - docElem.clientHeight;
        const currentY = window.pageYOffset || window.scrollY;
        const progress = totalHeight > 0 ? Math.min(100, Math.max(0, (currentY / totalHeight) * 100)) : 0;

        if (bar) {
          bar.style.width = `${progress}%`;
          if (currentY > 40 && progress > 0.5) {
            bar.classList.add('is-active');
          } else {
            bar.classList.remove('is-active');
          }
        }

        // Update SVG circular ring (circumference 2 * pi * 12.5 = 78.54)
        if (progressCircle) {
          const circumference = 78.54;
          const offset = circumference - (progress / 100) * circumference;
          progressCircle.style.strokeDashoffset = Math.max(0, Math.min(circumference, offset));
        }

        const percentEl = document.getElementById('article-scroll-percent');
        if (percentEl) {
          percentEl.textContent = `${Math.round(progress)}%`;
        }

        const drawerPercent = document.getElementById('drawer-scroll-percent');
        const drawerBar = document.getElementById('drawer-progress-bar');
        if (drawerPercent) drawerPercent.textContent = `${Math.round(progress)}%`;
        if (drawerBar) drawerBar.style.width = `${progress}%`;

        // Top button subtle opacity indicator when at very top
        const topBtn = document.getElementById('article-scroll-top-btn');
        if (topBtn) {
          if (currentY < 40) {
            topBtn.classList.add('opacity-60');
          } else {
            topBtn.classList.remove('opacity-60');
          }
        }

        // Dynamically compute remaining minutes
        if (timeRemainingEl) {
          const rawMinutes = parseInt(this.articleData?.read_time_en || this.articleData?.read_time_mm, 10) || 12;
          const fractionLeft = totalHeight > 0 ? Math.max(0, 1 - (currentY / totalHeight)) : 1;
          const minsLeft = Math.max(1, Math.ceil(rawMinutes * fractionLeft));
          const lang = window.I18n ? window.I18n.getLang() : 'mm';
          timeRemainingEl.innerHTML = (lang === 'mm') 
            ? `<i class="ri-hourglass-2-line animate-pulse"></i> <span>ဖတ်ရန် ${minsLeft} မိနစ် ခန့်ကျန်</span>`
            : `<i class="ri-hourglass-2-line animate-pulse"></i> <span>~${minsLeft} min remaining</span>`;
        }

        // Master Floating Navigation Hub & Companion is ALWAYS accessible & visible
        if (companion) {
          companion.classList.add('visible');
          companion.style.opacity = '1';
          companion.style.pointerEvents = 'auto';
          companion.style.transform = 'translateY(0)';
        }
      };

      this.updateProgress = updateProgress;
      window.addEventListener('scroll', updateProgress, { passive: true });
      updateProgress();
    },

    // --------------------------------------------------------------------------
    // 2.5. Immersive Reading Header (Auto-hides on reading down, reveals on scroll up)
    // --------------------------------------------------------------------------
    initReadingHeader() {
      const header = document.querySelector('header.sticky');
      if (!header) return;

      let lastScrollY = window.pageYOffset || window.scrollY;
      let isHidden = false;
      let ticking = false;

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScrollY = window.pageYOffset || window.scrollY;

            // When near top (first 120px), header is always visible
            if (currentScrollY < 120) {
              if (isHidden) {
                header.style.transform = 'translateY(0)';
                isHidden = false;
              }
              lastScrollY = currentScrollY;
              ticking = false;
              return;
            }

            // Scrolling down into the article: hide header for 100% immersive reading
            if (currentScrollY > lastScrollY + 8) {
              if (!isHidden) {
                header.style.transform = 'translateY(-100%)';
                isHidden = true;
              }
            } 
            // Scrolling up: reveal header so user can access menu/tools
            else if (currentScrollY < lastScrollY - 8) {
              if (isHidden) {
                header.style.transform = 'translateY(0)';
                isHidden = false;
              }
            }

            lastScrollY = currentScrollY;
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    },
    async initArticleView() {
      const contentContainer = document.getElementById('article-content-body');
      if (!contentContainer) return; // Not on article detail page

      const urlParams = new URLSearchParams(window.location.search);
      const rawParam = urlParams.get('id') || urlParams.get('slug') || 'myanmar-on-the-tightrope';
      let articleId = rawParam;
      try {
        articleId = decodeURIComponent(rawParam);
      } catch(e) {}
      const lower = String(articleId).toLowerCase().trim();
      const rawLower = String(rawParam).toLowerCase().trim();

      // 1. Instant Synchronous In-Memory Render (0ms latency, zero delay or flicker)
      const backupList = window.HTET_ARTICLES_BACKUP || window.articlesData || [];
      let article = backupList.find(a => 
        (a.id && (a.id.toLowerCase() === lower || a.id.toLowerCase() === rawLower)) || 
        (a.slug && (a.slug.toLowerCase() === lower || a.slug.toLowerCase() === rawLower))
      ) || null;

      if (article) {
        this.articleData = article;
        this.renderArticle();
        this.initDownloadMenu();
      }

      // 2. Background Asynchronous Re-sync with HtetData if fresh updates exist
      if (window.HtetData) {
        window.HtetData.getArticleById(articleId).then(freshArticle => {
          if (freshArticle) {
            const hasChanged = !this.articleData || (this.articleData.id !== freshArticle.id) || (this.articleData.date !== freshArticle.date);
            if (hasChanged) {
              this.articleData = freshArticle;
              this.renderArticle();
              this.initDownloadMenu();
            }
          } else if (!this.articleData) {
            this.renderNotFound();
          }
        }).catch(err => {
          console.warn('[Reader] Background data fetch completed/fallback kept.', err);
          if (!this.articleData) {
            this.renderNotFound();
          }
        });
      } else if (!article) {
        this.renderNotFound();
      }

      // Listen to language changes to re-render dynamically
      if (!this._langListenerBound) {
        this._langListenerBound = true;
        window.addEventListener('langchange', () => {
          this.overrideLang = null;
          if (this.articleData) {
            this.renderArticle();
          }
        });
      }
    },

    renderArticle() {
      const article = this.articleData;
      const siteLang = window.I18n ? window.I18n.getLang() : 'mm';
      const effectiveLang = this.overrideLang || siteLang;
      const lang = effectiveLang;
      this.updateMetaAndSchema(article, lang);

      // Update #article-lang-toggle-btn label and title
      const langToggleBtn = document.getElementById('article-lang-toggle-btn');
      const langFlag = document.getElementById('article-lang-flag');
      const langText = document.getElementById('article-lang-text');
      if (langToggleBtn) {
        if (siteLang !== 'mm') {
          if (this.overrideLang === 'mm') {
            if (langFlag) langFlag.textContent = '🌐';
            if (langText) langText.textContent = `ပြန်ဆိုချက် (${siteLang.toUpperCase()})`;
            langToggleBtn.title = `Switch back to ${siteLang.toUpperCase()} translation`;
          } else {
            if (langFlag) langFlag.textContent = '🇲🇲';
            if (langText) langText.textContent = 'မူရင်းစာမူ (မြန်မာ)';
            langToggleBtn.title = 'View original Burmese text (မူရင်းမြန်မာဘာသာဖြင့် ဖတ်ရှုရန်)';
          }
        } else {
          // Site is in Burmese
          if (this.overrideLang === 'en' && article.content_en) {
            if (langFlag) langFlag.textContent = '🇲🇲';
            if (langText) langText.textContent = 'မူရင်းစာမူ (မြန်မာ)';
            langToggleBtn.title = 'မူရင်းမြန်မာစာမူသို့ ပြန်သွားရန်';
          } else if (article.content_en) {
            if (langFlag) langFlag.textContent = '🌐';
            if (langText) langText.textContent = 'English Translation';
            langToggleBtn.title = 'View English translation';
          } else {
            if (langFlag) langFlag.textContent = '🇲🇲';
            if (langText) langText.textContent = 'မူရင်းစာမူ (မြန်မာ)';
            langToggleBtn.title = 'မူရင်းမြန်မာဘာသာ စာတမ်း';
          }
        }
      }

      // Title & Excerpt
      const titleEl = document.getElementById('article-title');
      if (titleEl) {
        titleEl.textContent = (lang === 'mm' ? (article.title_mm || article.title_en) : (article.title_en || article.title_mm)) || '';
      }

      const categoryEl = document.getElementById('article-category');
      if (categoryEl) {
        const cats = (lang === 'mm')
          ? (article.categories_mm || (article.category_mm ? [article.category_mm] : []))
          : (article.categories_en || (article.category_en ? [article.category_en] : []));
        categoryEl.innerHTML = cats.map(c => `
          <a href="articles.html?category=${encodeURIComponent(c)}" class="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cream dark:bg-stone-900 hover:bg-taupe-light text-charcoal border border-hairline text-xs font-sans-ui transition-colors shadow-2xs">
            <i class="ri-folder-2-line text-vermilion"></i>
            <span>${c}</span>
          </a>
        `).join('');
      }

      const dateEl = document.getElementById('article-date');
      if (dateEl) dateEl.textContent = article.date || '2026-02-14';

      const readTimeEl = document.getElementById('article-read-time');
      if (readTimeEl) {
        readTimeEl.textContent = (lang === 'mm' ? (article.read_time_mm || article.read_time_en) : (article.read_time_en || article.read_time_mm)) || (lang === 'mm' ? '၁၂ မိနစ် ဖတ်ရှုရန်' : '12 min read');
      }

      const excerptEl = document.getElementById('article-lead-excerpt');
      if (excerptEl) {
        excerptEl.textContent = (lang === 'mm' ? (article.excerpt_mm || article.excerpt_en) : (article.excerpt_en || article.excerpt_mm)) || '';
      }

      // Full Version PDF Action Banner
      const pdfBanner = document.getElementById('article-pdf-banner');
      if (pdfBanner) {
        if (article.pdf_file) {
          pdfBanner.classList.remove('hidden');
          const dlBtn = document.getElementById('article-pdf-banner-download-btn');
          const viewBtn = document.getElementById('article-pdf-banner-view-btn');
          const titleEl = document.getElementById('article-pdf-banner-title');
          const descEl = document.getElementById('article-pdf-banner-desc');
          const btnTextEl = document.getElementById('article-pdf-banner-btn-text');
          const badgeEl = document.getElementById('article-pdf-banner-badge');

          const filename = article.pdf_file.split('/').pop();
          if (dlBtn) {
            dlBtn.href = article.pdf_file;
            dlBtn.setAttribute('download', filename);
          }
          if (viewBtn) {
            viewBtn.href = article.pdf_file;
          }
          if (badgeEl) {
            badgeEl.textContent = article.file_size ? article.file_size.split('/')[0].trim() : 'PDF';
          }
          if (lang === 'mm') {
            if (titleEl) titleEl.textContent = 'Full Version PDF စာတမ်းအပြည့်အစုံ';
            if (descEl) descEl.textContent = 'အော့ဖ်လိုင်းဖတ်ရှုရန် သို့မဟုတ် ပုံနှိပ်ထုတ်ယူရန် တရားဝင် မူရင်း PDF ဖိုင်ကို တိုက်ရိုက် ရယူနိုင်ပါသည်။';
            if (btnTextEl) btnTextEl.textContent = 'Full Version PDF ဒေါင်းလုဒ် ရယူရန်';
          } else {
            if (titleEl) titleEl.textContent = 'Full Version Official PDF Paper';
            if (descEl) descEl.textContent = 'Direct download of official complete PDF for offline reading and citation.';
            if (btnTextEl) btnTextEl.textContent = 'Download Full PDF';
          }
        } else {
          pdfBanner.classList.add('hidden');
        }
      }

      // External Original Source Link (မူရင်း Blogpost / Source)
      const origSourceBtn = document.getElementById('article-original-source-btn');
      if (origSourceBtn) {
        const sourceUrl = article.source_url || (article.content_mm && article.content_mm.match(/https?:\/\/[^\s"'<>]+/)?.[0]);
        if (sourceUrl) {
          origSourceBtn.href = sourceUrl;
          origSourceBtn.classList.remove('hidden');
          origSourceBtn.classList.add('inline-flex');
        } else {
          origSourceBtn.classList.add('hidden');
          origSourceBtn.classList.remove('inline-flex');
        }
      }

      // Featured Cover Image
      const imgWrapper = document.getElementById('article-featured-image-wrapper');
      const imgEl = document.getElementById('article-featured-image');
      const imgCaption = document.getElementById('article-featured-image-caption');
      if (imgWrapper && imgEl) {
        const imgSrc = article.image || article.cover_image;
        if (imgSrc) {
          imgEl.src = imgSrc;
          imgEl.alt = (lang === 'mm') ? article.title_mm : article.title_en;
          if (imgCaption) {
            imgCaption.textContent = (lang === 'mm') ? article.title_mm : article.title_en;
          }
          imgWrapper.classList.remove('hidden');
        } else {
          imgWrapper.classList.add('hidden');
        }
      }

      // Body Content
      const contentContainer = document.getElementById('article-content-body');
      if (contentContainer) {
        let bodyHtml = (lang === 'mm') ? (article.content_mm || '') : (article.content_en || article.content_mm || '');
        
        // Auto-format plain-text content if no HTML markup tags are present
        if (bodyHtml && !/<[a-z][\s\S]*>/i.test(bodyHtml)) {
          const paragraphs = bodyHtml.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
          bodyHtml = paragraphs.map(p => {
            if (p.startsWith('အပိုင်း') || p.startsWith('အခန်း') || p.startsWith('Section') || p.startsWith('Chapter') || p.startsWith('#')) {
              const cleanTitle = p.replace(/^#+\s*/, '');
              return `<h2 class="text-xl sm:text-2xl font-serif-editorial text-charcoal font-semibold mt-8 mb-4">${cleanTitle}</h2>`;
            }
            return `<p class="mb-5 leading-relaxed text-charcoal text-base sm:text-lg font-sans-ui">${p}</p>`;
          }).join('\n');
        }

        contentContainer.innerHTML = bodyHtml;
        this.applyFontSize();

        // Re-execute any script tags inserted via innerHTML so dynamic inline components activate
        const embeddedScripts = contentContainer.querySelectorAll('script');
        embeddedScripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.textContent = oldScript.textContent;
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        // Auto-wrap any data tables in an overflow-x scroll container to prevent mobile screen clipping
        contentContainer.querySelectorAll('table').forEach(table => {
          if (!table.parentElement.classList.contains('table-responsive-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive-wrapper overflow-x-auto max-w-full my-6 rounded-xl border border-hairline';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
          }
        });

        // 1. Enhance Headings (Anchors, badges, reading time)
        this.enhanceHeadings(contentContainer);

        // 2. Parse and Initialize Inline Citations
        this.initInlineCitations(contentContainer, article.citations);

        // 3. Render Bibliography List with Actions
        this.renderCitationsList(article.citations);

        // 4. Generate Table of Contents
        this.generateTOC(contentContainer);

        // 5. Initialize Active Scrollspy
        this.initScrollSpy(contentContainer);

        // 6. Initialize KaTeX math rendering if available
        this.initKatex(contentContainer);

        // 7. Check for initial URL anchor jump (#section-... or #cite-...)
        setTimeout(() => this.checkInitialAnchorJump(), 250);

        // 8. Initialize Scientific Interactive Widgets (Charts, Leaflet Map, Go-Bag Checklist)
        this.initInteractiveWidgets(contentContainer, article.id);
      }

      // Tags
      const tagsContainer = document.getElementById('article-tags');
      if (tagsContainer && Array.isArray(article.tags)) {
        tagsContainer.innerHTML = article.tags.map(tag => `
          <span class="inline-flex items-center px-3 py-1 text-xs border border-taupe-light bg-cream/50 rounded-full text-muted mr-2 mb-2 font-sans-ui hover:border-vermilion transition-colors">
            #${tag}
          </span>
        `).join('');
      }

      // Related Articles & Adjacent Navigation
      this.renderRelatedArticles(article.id);
      this.renderAdjacentArticles(article.id);
      this.initHeaderBookmarkButton();
      this.updateBookmarkButtonState();
      if (typeof this.updateProgress === 'function') {
        this.updateProgress();
      }
    },

    // --------------------------------------------------------------------------
    // 4. Heading Enhancements (Anchors, Badges, Section Read-Time)
    // --------------------------------------------------------------------------
    updateMetaAndSchema(article, lang) {
      if (!article) return;
      const baseUrl = 'https://htetofficial.github.io/';
      const slug = article.id || article.slug || '';
      const pageUrl = `${baseUrl}article.html?id=${encodeURIComponent(slug)}`;
      const title = ((lang === 'mm' ? (article.title_mm || article.title_en) : (article.title_en || article.title_mm)) || 'Htet Official') + ' | Htet Official';
      const desc = ((lang === 'mm' ? (article.excerpt_mm || article.excerpt_en) : (article.excerpt_en || article.excerpt_mm)) || '').trim();
      const rawImg = article.image || article.cover_image || 'assets/images/phoenix-from-ashes-cover.jpg';
      const imageUrl = rawImg.startsWith('http') ? rawImg : (baseUrl + rawImg.replace(/^\//, ''));

      document.title = title;

      const setMeta = (selector, attr, val) => {
        if (!val) return;
        const el = document.querySelector(selector);
        if (el) el.setAttribute(attr, val);
      };

      setMeta('meta[name="description"]', 'content', desc);
      setMeta('link[rel="canonical"]', 'href', pageUrl);
      setMeta('meta[property="og:title"]', 'content', title);
      setMeta('meta[property="og:description"]', 'content', desc);
      setMeta('meta[property="og:url"]', 'content', pageUrl);
      setMeta('meta[property="og:image"]', 'content', imageUrl);
      setMeta('meta[property="og:image:secure_url"]', 'content', imageUrl);
      setMeta('meta[property="og:image:alt"]', 'content', title);
      setMeta('meta[name="twitter:title"]', 'content', title);
      setMeta('meta[name="twitter:description"]', 'content', desc);
      setMeta('meta[name="twitter:image"]', 'content', imageUrl);
      setMeta('meta[name="twitter:image:alt"]', 'content', title);

      const ldScript = document.getElementById('article-jsonld');
      if (ldScript) {
        const schema = {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'ScholarlyArticle',
              '@id': pageUrl + '#article',
              'headline': title.replace(' | Htet Official', ''),
              'description': desc,
              'datePublished': article.date || '2026-02-14',
              'author': {
                '@type': 'Person',
                'name': 'Htet Myat Ekri',
                'alternateName': 'ထက်မြတ်ဧကရီ',
                'url': baseUrl + 'about.html'
              },
              'publisher': {
                '@type': 'Person',
                'name': 'Htet Official',
                'url': baseUrl
              },
              'mainEntityOfPage': pageUrl,
              'image': imageUrl,
              'keywords': Array.isArray(article.tags) ? article.tags.join(', ') : '',
              'inLanguage': lang === 'mm' ? 'my' : 'en'
            },
            {
              '@type': 'BreadcrumbList',
              'itemListElement': [
                { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': baseUrl },
                { '@type': 'ListItem', 'position': 2, 'name': 'Articles', 'item': baseUrl + 'articles.html' },
                { '@type': 'ListItem', 'position': 3, 'name': title.replace(' | Htet Official', ''), 'item': pageUrl }
              ]
            }
          ]
        };
        ldScript.textContent = JSON.stringify(schema, null, 2);
      }
    },

    enhanceHeadings(container) {
      const headings = container.querySelectorAll('h2, h3, h4');
      const lang = window.I18n ? window.I18n.getLang() : 'mm';
      const articleId = this.articleData ? this.articleData.id : '';
      const mainTitle = (this.articleData?.title_mm || this.articleData?.title_en || '').trim();

      let sectionCounter = 0;

      headings.forEach((heading, idx) => {
        // Skip already wrapped headings (prevents duplicate nesting)
        if (heading.parentElement && heading.parentElement.classList.contains('heading-inner-row')) {
          return;
        }

        // Skip title monograph banner heading if it matches the main title
        const hText = heading.textContent.trim();
        if (idx === 0 && (hText === mainTitle || (mainTitle && hText.includes(mainTitle.substring(0, 20))))) {
          return;
        }

        const tag = heading.tagName.toLowerCase();
        let sectionId = heading.id || `section-${idx + 1}`;
        heading.id = sectionId;

        // Calculate approximate reading time for this section
        const readTimeMinutes = this.calculateSectionReadTime(heading, tag);
        const readTimeText = (lang === 'mm')
          ? `~${readTimeMinutes} မိနစ် ဖတ်ရှုရန်`
          : `~${readTimeMinutes} min read`;

        // Section numbering
        let sectionBadgeText = '';
        if (tag === 'h2') {
          sectionCounter++;
          const numFormatted = String(sectionCounter).padStart(2, '0');
          sectionBadgeText = (lang === 'mm')
            ? `§ ${this.toBurmeseNumeral(sectionCounter)}`
            : `§ ${numFormatted}`;
        }

        // Build heading wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'heading-wrapper';
        wrapper.id = `${sectionId}-wrapper`;

        // Meta row
        const metaRow = document.createElement('div');
        metaRow.className = 'heading-meta-row';
        if (sectionBadgeText) {
          metaRow.innerHTML = `
            <span class="heading-section-badge"><i class="ri-git-commit-line text-xs"></i> ${sectionBadgeText}</span>
            <span class="heading-read-time"><i class="ri-time-line text-xs"></i> ${readTimeText}</span>
          `;
        } else {
          metaRow.innerHTML = `
            <span class="heading-read-time"><i class="ri-time-line text-xs"></i> ${readTimeText}</span>
          `;
        }

        // Inner row with anchor button
        const innerRow = document.createElement('div');
        innerRow.className = 'heading-inner-row';

        const anchorBtn = document.createElement('button');
        anchorBtn.type = 'button';
        anchorBtn.className = 'heading-anchor-btn';
        anchorBtn.setAttribute('title', (lang === 'mm') ? 'အပိုင်းလင့်ခ် ကူးယူရန်' : 'Copy section link');
        anchorBtn.setAttribute('aria-label', `Link to ${heading.textContent.trim()}`);
        anchorBtn.innerHTML = `<i class="ri-hashtag text-base"></i>`;

        anchorBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const cleanUrl = `${window.location.origin}${window.location.pathname}?id=${articleId}#${sectionId}`;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(cleanUrl).then(() => {
              anchorBtn.innerHTML = `<i class="ri-check-line text-base text-emerald-500"></i>`;
              this.showToast((lang === 'mm') ? 'အပိုင်းလင့်ခ်ကို ကူးယူပြီးပါပြီ ✓' : 'Section link copied to clipboard ✓');
              setTimeout(() => {
                anchorBtn.innerHTML = `<i class="ri-hashtag text-base"></i>`;
              }, 2000);
            });
          }
          history.pushState(null, null, `#${sectionId}`);
        });

        // Insert wrapper around heading
        heading.parentNode.insertBefore(wrapper, heading);
        wrapper.appendChild(metaRow);
        innerRow.appendChild(heading);
        innerRow.appendChild(anchorBtn);
        wrapper.appendChild(innerRow);
      });
    },

    calculateSectionReadTime(headingEl, currentTag) {
      let charCount = 0;
      let nextNode = headingEl.parentElement ? headingEl.parentElement.nextElementSibling : headingEl.nextElementSibling;

      while (nextNode) {
        if (nextNode.querySelector('h2') || (currentTag === 'h3' && nextNode.querySelector('h3'))) {
          break;
        }
        charCount += nextNode.textContent ? nextNode.textContent.length : 0;
        nextNode = nextNode.nextElementSibling;
      }

      // Myanmar text reading speed: ~350 characters/minute, English: ~1000 characters/minute
      const estMinutes = Math.max(1, Math.round(charCount / 400));
      return estMinutes;
    },

    toBurmeseNumeral(n) {
      const myanmarDigits = ['၀', '၁', '၂', '၃', '၄', '၅', '၆', '၇', '၈', '၉'];
      return String(n).split('').map(d => myanmarDigits[parseInt(d, 10)] || d).join('');
    },

    // --------------------------------------------------------------------------
    // 5. Interactive Inline Citations Engine
    // --------------------------------------------------------------------------
    initInlineCitations(container, rawCitations) {
      if (!Array.isArray(rawCitations) || rawCitations.length === 0) return;

      this.parsedCitations = this.parseAllCitations(rawCitations);
      const citeRegex = /\(([A-Za-z\s.,&'\-–]+?(?:\(\d{4}\))?),\s*(\d{4}(?:,\s*[A-Za-z]+)?)\)/g;

      // Find eligible text nodes using TreeWalker
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            // Don't replace inside code, scripts, buttons, headings, or already replaced badges
            if (['script', 'style', 'pre', 'code', 'button', 'h1', 'h2', 'h3'].includes(tag) || parent.closest('.inline-citation-badge')) {
              return NodeFilter.FILTER_REJECT;
            }
            if (node.nodeValue && citeRegex.test(node.nodeValue)) {
              citeRegex.lastIndex = 0; // reset
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          }
        }
      );

      const targetNodes = [];
      while (walker.nextNode()) {
        targetNodes.push(walker.currentNode);
      }

      // Process matched text nodes safely
      targetNodes.forEach(textNode => {
        this.replaceTextNodeWithCitations(textNode, citeRegex);
      });

      // Bind global event listeners for badges
      this.bindCitationBadgeEvents(container);
    },

    replaceTextNodeWithCitations(textNode, regex) {
      const text = textNode.nodeValue;
      regex.lastIndex = 0;

      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        const start = match.index;
        const end = regex.lastIndex;

        // Append text preceding the citation
        if (start > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, start)));
        }

        const authorStr = match[1];
        const yearStr = match[2];
        const matchedIndex = this.findBestCitationMatch(authorStr, yearStr);

        if (matchedIndex !== -1) {
          const citeNum = matchedIndex + 1;
          const citeData = this.parsedCitations[matchedIndex];
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'inline-citation-badge';
          btn.dataset.citeIdx = citeNum;
          btn.dataset.citeTarget = `cite-${citeNum}`;
          btn.setAttribute('aria-label', `Citation [${citeNum}]: ${authorStr} (${yearStr})`);
          btn.innerHTML = `${match[0]}<sup class="cite-num-sup">[${citeNum}]</sup>`;
          fragment.appendChild(btn);
        } else {
          fragment.appendChild(document.createTextNode(match[0]));
        }

        lastIndex = end;
      }

      // Append remaining text
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }

      if (textNode.parentNode) {
        textNode.parentNode.replaceChild(fragment, textNode);
      }
    },

    findBestCitationMatch(authorStr, yearStr) {
      const cleanAuthor = authorStr.toLowerCase()
        .replace(/[&,\-.]/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\(\d{4}\)/g, '')
        .trim();
      const authorKeywords = cleanAuthor.split(' ').filter(w => w.length > 2);
      const yearFirst = (yearStr.match(/\d{4}/) || [''])[0];

      let bestIdx = -1;
      let highestScore = 0;

      this.parsedCitations.forEach((item, idx) => {
        const lowerC = item.raw.toLowerCase();
        let score = 0;
        if (yearFirst && lowerC.includes(yearFirst)) {
          score += 5;
        }
        authorKeywords.forEach(kw => {
          if (lowerC.includes(kw)) score += 3;
        });

        if (score > highestScore && score >= 5) {
          highestScore = score;
          bestIdx = idx;
        }
      });

      return bestIdx;
    },

    parseAllCitations(citations) {
      return citations.map((c, idx) => {
        const urlMatch = c.match(/https?:\/\/[^\s]+/);
        const url = urlMatch ? urlMatch[0].replace(/[.,)>]+$/, '') : '';
        const cleanC = c.replace(/Retrieved from.*$/i, '').trim();
        const yearRegex = /\((\d{4}[^)]*)\)/g;
        const yearMatches = [...cleanC.matchAll(yearRegex)];
        const year = yearMatches.length > 0 ? yearMatches[yearMatches.length - 1][1] : '';

        const firstParenIdx = cleanC.search(/\(\d{4}/);
        let author = firstParenIdx !== -1 ? cleanC.substring(0, firstParenIdx).replace(/\.\s*$/, '').trim() : 'Reference';

        let title = '';
        if (yearMatches.length > 0) {
          const lastYearMatch = yearMatches[yearMatches.length - 1];
          const afterYear = cleanC.substring(lastYearMatch.index + lastYearMatch[0].length).replace(/^[\s.:]+/, '');
          const periodIdx = afterYear.indexOf('. ');
          title = periodIdx !== -1 ? afterYear.substring(0, periodIdx) : afterYear;
        }
        if (!title) title = cleanC;

        return {
          idx: idx + 1,
          author,
          year,
          title,
          url,
          raw: c
        };
      });
    },

    // --------------------------------------------------------------------------
    // 6. Floating Citation Popover Card Engine
    // --------------------------------------------------------------------------
    initPopoverElement() {
      let popover = document.getElementById('citation-floating-popover');
      if (!popover) {
        popover = document.createElement('div');
        popover.id = 'citation-floating-popover';
        popover.setAttribute('role', 'dialog');
        popover.setAttribute('aria-modal', 'false');
        document.body.appendChild(popover);
      }
      this.popoverEl = popover;

      // Keep popover alive if cursor moves onto it
      popover.addEventListener('mouseenter', () => {
        clearTimeout(this.hidePopoverTimeout);
      });
      popover.addEventListener('mouseleave', () => {
        this.hideCitationPopover();
      });
    },

    bindCitationBadgeEvents(container) {
      const badges = container.querySelectorAll('.inline-citation-badge');
      badges.forEach(badge => {
        const citeIdx = parseInt(badge.dataset.citeIdx, 10);
        const citeData = this.parsedCitations[citeIdx - 1];
        if (!citeData) return;

        badge.addEventListener('mouseenter', () => {
          clearTimeout(this.hidePopoverTimeout);
          this.showCitationPopover(badge, citeData);
        });

        badge.addEventListener('mouseleave', () => {
          this.hidePopoverTimeout = setTimeout(() => {
            this.hideCitationPopover();
          }, 260);
        });

        badge.addEventListener('focus', () => {
          this.showCitationPopover(badge, citeData);
        });

        badge.addEventListener('blur', () => {
          this.hidePopoverTimeout = setTimeout(() => {
            this.hideCitationPopover();
          }, 260);
        });

        badge.addEventListener('click', (e) => {
          e.preventDefault();
          this.showCitationPopover(badge, citeData);
        });
      });
    },

    showCitationPopover(badge, citeData) {
      const popover = this.popoverEl;
      if (!popover) return;

      this.activeBadge = badge;
      const lang = window.I18n ? window.I18n.getLang() : 'mm';

      popover.innerHTML = `
        <div class="citation-popover-header">
          <div class="citation-popover-badge">
            <i class="ri-book-mark-line"></i>
            <span>${(lang === 'mm') ? `ကျမ်းကိုး ရည်ညွှန်းချက် [${citeData.idx}]` : `Academic Citation [${citeData.idx}]`}</span>
          </div>
          <button type="button" class="text-faint hover:text-charcoal p-1 close-popover-btn" title="Close">
            <i class="ri-close-line text-sm"></i>
          </button>
        </div>
        <div class="citation-popover-title">${citeData.title}</div>
        <div class="citation-popover-author">
          <span class="font-medium text-charcoal">${citeData.author}</span> • <span class="text-vermilion font-medium">(${citeData.year})</span>
        </div>
        <div class="citation-popover-actions">
          ${citeData.url ? `
            <a href="${citeData.url}" target="_blank" rel="noopener noreferrer" class="citation-popover-btn btn-primary-cite">
              <i class="ri-external-link-line"></i> <span>${(lang === 'mm') ? 'မူရင်းဖွင့်ရန်' : 'Open Source'}</span>
            </a>
          ` : ''}
          <button type="button" class="citation-popover-btn copy-cite-action" data-cite-idx="${citeData.idx}">
            <i class="ri-file-copy-line"></i> <span>${(lang === 'mm') ? 'APA ကူးယူရန်' : 'Copy APA'}</span>
          </button>
          <button type="button" class="citation-popover-btn jump-cite-action" data-cite-idx="${citeData.idx}">
            <i class="ri-arrow-down-line"></i> <span>${(lang === 'mm') ? 'ကျမ်းကိုးစာရင်းသို့' : 'To Bibliography'}</span>
          </button>
        </div>
      `;

      // Position popover
      this.positionPopover(popover, badge);
      popover.classList.add('popover-visible');

      // Bind Popover action buttons
      const closeBtn = popover.querySelector('.close-popover-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.hideCitationPopover());
      }

      const copyBtn = popover.querySelector('.copy-cite-action');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(citeData.raw).then(() => {
              copyBtn.innerHTML = `<i class="ri-check-line text-emerald-500"></i> <span>${(lang === 'mm') ? 'ကူးယူပြီးပါပြီ ✓' : 'Copied ✓'}</span>`;
              this.showToast((lang === 'mm') ? 'ကျမ်းကိုးကို ကူးယူပြီးပါပြီ ✓' : 'Citation copied to clipboard ✓');
              setTimeout(() => {
                copyBtn.innerHTML = `<i class="ri-file-copy-line"></i> <span>${(lang === 'mm') ? 'APA ကူးယူရန်' : 'Copy APA'}</span>`;
              }, 2000);
            });
          }
        });
      }

      const jumpBtn = popover.querySelector('.jump-cite-action');
      if (jumpBtn) {
        jumpBtn.addEventListener('click', () => {
          this.jumpToCitation(citeData.idx, badge);
          this.hideCitationPopover();
        });
      }
    },

    positionPopover(popover, badge) {
      const rect = badge.getBoundingClientRect();
      const popoverWidth = Math.min(350, Math.max(280, window.innerWidth - 24));
      popover.style.width = `${popoverWidth}px`;

      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;

      let left = rect.left + scrollX + (rect.width / 2) - (popoverWidth / 2);
      const minLeft = scrollX + 12;
      const maxLeft = scrollX + window.innerWidth - popoverWidth - 12;
      left = Math.max(minLeft, Math.min(maxLeft, left));

      const popoverHeight = popover.offsetHeight || 190;
      let top = rect.top + scrollY - popoverHeight - 12;
      let isFlipped = false;

      // Flip below if not enough room on top
      if (rect.top - popoverHeight - 12 < 15) {
        top = rect.bottom + scrollY + 12;
        isFlipped = true;
      }

      popover.style.left = `${left}px`;
      popover.style.top = `${top}px`;

      if (isFlipped) {
        popover.classList.add('popover-flipped');
      } else {
        popover.classList.remove('popover-flipped');
      }

      // Point arrow to center of trigger badge
      const triggerCenter = rect.left + scrollX + (rect.width / 2);
      const arrowLeft = Math.max(20, Math.min(popoverWidth - 20, triggerCenter - left));
      popover.style.setProperty('--arrow-left', `${arrowLeft}px`);
    },

    hideCitationPopover() {
      if (this.popoverEl) {
        this.popoverEl.classList.remove('popover-visible');
      }
    },

    jumpToCitation(citeNum, originBadge) {
      this.activeBadge = originBadge;
      const target = document.getElementById(`cite-${citeNum}`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('citation-highlight-pulse');
        setTimeout(() => {
          target.classList.remove('citation-highlight-pulse');
        }, 3600);
      }
    },

    // --------------------------------------------------------------------------
    // 7. Bibliography List Renderer & Return-to-Text Button
    // --------------------------------------------------------------------------
    renderCitationsList(rawCitations) {
      const citationsContainer = document.getElementById('article-citations');
      const citationsList = document.getElementById('citations-list');
      if (!citationsContainer || !citationsList) return;

      if (!Array.isArray(rawCitations) || rawCitations.length === 0) {
        citationsContainer.classList.add('hidden');
        return;
      }

      // Ensure citations are parsed even if inline walker didn't trigger
      if (!Array.isArray(this.parsedCitations) || this.parsedCitations.length === 0) {
        this.parsedCitations = this.parseAllCitations(rawCitations);
      }

      citationsContainer.classList.remove('hidden');
      const lang = window.I18n ? window.I18n.getLang() : 'mm';

      citationsList.innerHTML = this.parsedCitations.map(item => {
        // Turn any URLs into clickable external links
        let formattedText = item.raw;
        if (item.url) {
          formattedText = formattedText.replace(
            item.url,
            `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="text-vermilion hover:underline inline-flex items-center gap-1 font-mono text-[11px] break-all max-w-full">${item.url} <i class="ri-external-link-line text-xs"></i></a>`
          );
        }

        return `
          <li id="cite-${item.idx}" class="mb-3.5 text-xs sm:text-sm text-muted font-sans-ui leading-relaxed p-3.5 rounded-xl border border-transparent hover:border-vermilion/30 bg-card/60 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-3 shadow-xs">
            <div class="flex-grow">
              <span class="font-bold text-vermilion mr-1.5 font-mono">[${item.idx}]</span>
              <span>${formattedText}</span>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0 pt-1 sm:pt-0">
              <button type="button" class="cite-copy-btn" data-cite-idx="${item.idx}" title="${(lang === 'mm') ? 'ကိုးကားချက် ကူးယူရန်' : 'Copy APA Citation'}">
                <i class="ri-file-copy-line"></i> <span>${(lang === 'mm') ? 'ကူးယူရန်' : 'Copy'}</span>
              </button>
              <button type="button" class="cite-return-btn" data-return-to="${item.idx}" title="${(lang === 'mm') ? 'မူလစာဖတ်နေရာသို့ ပြန်သွားရန်' : 'Return to reading position'}">
                <i class="ri-arrow-up-line"></i> <span>${(lang === 'mm') ? 'ပြန်သွားရန်' : 'Return'}</span>
              </button>
            </div>
          </li>
        `;
      }).join('');

      // Event handlers for copy and return buttons in bibliography
      citationsList.querySelectorAll('.cite-copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.citeIdx, 10);
          const item = this.parsedCitations[idx - 1];
          if (item && navigator.clipboard) {
            navigator.clipboard.writeText(item.raw).then(() => {
              btn.innerHTML = `<i class="ri-check-line text-emerald-500"></i> <span>${(lang === 'mm') ? 'ကူးယူပြီး ✓' : 'Copied ✓'}</span>`;
              this.showToast((lang === 'mm') ? 'ကျမ်းကိုးကို ကူးယူပြီးပါပြီ ✓' : 'Citation copied to clipboard ✓');
              setTimeout(() => {
                btn.innerHTML = `<i class="ri-file-copy-line"></i> <span>${(lang === 'mm') ? 'ကူးယူရန်' : 'Copy'}</span>`;
              }, 2000);
            });
          }
        });
      });

      citationsList.querySelectorAll('.cite-return-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.returnTo, 10);
          // Find matching badge in article body
          let targetBadge = this.activeBadge;
          if (!targetBadge || parseInt(targetBadge.dataset.citeIdx, 10) !== idx) {
            targetBadge = document.querySelector(`.inline-citation-badge[data-cite-idx="${idx}"]`);
          }

          if (targetBadge) {
            targetBadge.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetBadge.classList.add('citation-highlight-pulse');
            setTimeout(() => {
              targetBadge.classList.remove('citation-highlight-pulse');
            }, 3000);
          }
        });
      });
    },

    // --------------------------------------------------------------------------
    // 8. Dynamic Table of Contents & Active Scrollspy
    // --------------------------------------------------------------------------
    generateTOC(contentContainer) {
      const tocList = document.getElementById('table-of-contents-list');
      const tocWrapper = document.getElementById('table-of-contents');
      if (!tocList || !contentContainer) return;

      const rawHeadings = Array.from(contentContainer.querySelectorAll('h2, h3, h4'));
      const mainTitle = (this.articleData?.title_mm || this.articleData?.title_en || '').trim();
      const headings = rawHeadings.filter((h, idx) => {
        if (h.closest('#article-citations') || h.closest('#related-articles-list')) {
          return false;
        }
        const text = h.textContent.trim();
        if (!text) return false;
        // Skip duplicate title banner at top
        if (idx === 0 && (text === mainTitle || (mainTitle && text.includes(mainTitle.substring(0, 20))))) {
          return false;
        }
        return true;
      });

      if (headings.length < 1) {
        if (tocWrapper) tocWrapper.classList.add('hidden');
        return;
      }

      if (tocWrapper) tocWrapper.classList.remove('hidden');
      tocList.innerHTML = '';

      // Wire up TOC Collapsible Toggle Button
      const tocToggleBtn = document.getElementById('toc-toggle-btn');
      const tocToggleText = document.getElementById('toc-toggle-text');
      const tocToggleIcon = document.getElementById('toc-toggle-icon');
      if (tocToggleBtn && !tocToggleBtn.dataset.bound) {
        tocToggleBtn.dataset.bound = 'true';
        tocToggleBtn.addEventListener('click', () => {
          const isCollapsed = tocList.classList.toggle('hidden');
          const lang = window.I18n ? window.I18n.getLang() : 'mm';
          if (tocToggleText) {
            tocToggleText.textContent = isCollapsed 
              ? (lang === 'mm' ? 'ပြသရန်' : 'Show') 
              : (lang === 'mm' ? 'ဝှက်ရန်' : 'Hide');
          }
          if (tocToggleIcon) {
            tocToggleIcon.className = isCollapsed ? 'ri-arrow-down-s-line text-sm' : 'ri-arrow-up-s-line text-sm';
          }
        });
      }

      headings.forEach((heading, idx) => {
        const tag = heading.tagName.toLowerCase();
        const id = heading.id || `section-${idx + 1}`;
        heading.id = id;

        const isSub = tag === 'h3' || tag === 'h4';
        const li = document.createElement('li');
        li.className = (tag === 'h4')
          ? 'text-xs font-normal pl-6 sm:pl-7 my-0.5'
          : (tag === 'h3'
              ? 'text-xs font-normal pl-4 sm:pl-5 my-0.5' 
              : 'text-sm font-medium pt-1.5 pb-0.5 first:pt-0');

        const iconClass = isSub 
          ? 'ri-corner-down-right-line text-[11px] text-muted/60' 
          : 'ri-arrow-right-s-line text-xs text-vermilion/70';

        li.innerHTML = `
          <a href="#${id}" data-target-id="${id}" class="text-muted hover:text-vermilion transition-all block py-1 border-l-2 border-transparent pl-2.5 flex items-center space-x-1.5 ${isSub ? 'hover:translate-x-0.5' : ''}">
            <i class="${iconClass}"></i>
            <span class="truncate">${heading.textContent.trim()}</span>
          </a>
        `;
        tocList.appendChild(li);
      });

      // Smooth scrolling for TOC links
      tocList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('data-target-id');
          const targetHeading = document.getElementById(targetId);
          if (targetHeading) {
            const headerOffset = 100;
            const elementPosition = targetHeading.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });

            history.pushState(null, null, `#${targetId}`);
          }
        });
      });
    },

    initScrollSpy(contentContainer) {
      const tocLinks = document.querySelectorAll('#table-of-contents-list a[data-target-id]');
      if (tocLinks.length === 0) return;

      const headings = contentContainer.querySelectorAll('h2[id], h3[id]');
      if (headings.length === 0) return;

      window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 140;
        let currentSectionId = '';

        headings.forEach(heading => {
          if (heading.offsetTop <= scrollPosition) {
            currentSectionId = heading.id;
          }
        });

        tocLinks.forEach(link => {
          if (link.getAttribute('data-target-id') === currentSectionId) {
            link.classList.add('toc-active');
          } else {
            link.classList.remove('toc-active');
          }
        });
      }, { passive: true });
    },

    // --------------------------------------------------------------------------
    // 9. KaTeX Math Notation Auto-Renderer
    // --------------------------------------------------------------------------
    initKatex(contentContainer) {
      if (window.renderMathInElement) {
        try {
          window.renderMathInElement(contentContainer, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false },
              { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false
          });
        } catch (err) {
          console.warn('KaTeX rendering notice:', err);
        }
      }
    },

    // --------------------------------------------------------------------------
    // 10. URL Hash Jump Handler on Initial Load
    // --------------------------------------------------------------------------
    checkInitialAnchorJump() {
      const hash = window.location.hash;
      if (!hash) return;

      const cleanHash = hash.substring(1);
      const target = document.getElementById(cleanHash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        target.classList.add('citation-highlight-pulse');
        setTimeout(() => target.classList.remove('citation-highlight-pulse'), 3000);
      }
    },

    // --------------------------------------------------------------------------
    // 11. Related Articles Recommendation
    // --------------------------------------------------------------------------
    async renderRelatedArticles(currentId) {
      const container = document.getElementById('related-articles-list');
      if (!container) return;

      let all = [];
      if (window.HtetData) {
        try {
          all = await window.HtetData.getArticles();
        } catch (e) {
          all = window.HTET_ARTICLES_BACKUP || window.articlesData || [];
        }
      }
      if (!all || all.length === 0) {
        all = window.HTET_ARTICLES_BACKUP || window.articlesData || [];
      }

      const lang = window.I18n ? window.I18n.getLang() : 'mm';
      const current = all.find(a => a.id === currentId);
      const currentCats = current ? (current.categories_en || (current.category_en ? [current.category_en] : [])) : [];
      const currentTags = current ? (current.tags || []) : [];

      const scored = all.filter(a => a.id !== currentId).map(other => {
        let score = 0;
        const otherCats = other.categories_en || (other.category_en ? [other.category_en] : []);
        const otherTags = other.tags || [];

        currentCats.forEach(c => {
          if (otherCats.some(oc => oc.toLowerCase() === c.toLowerCase())) score += 3;
        });
        currentTags.forEach(t => {
          if (otherTags.some(ot => ot.toLowerCase() === t.toLowerCase())) score += 1;
        });
        return { article: other, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const related = scored.slice(0, 2).map(s => s.article);

      if (related.length === 0) {
        container.parentElement.classList.add('hidden');
        return;
      }

      container.innerHTML = related.map(item => {
        const cats = (lang === 'mm')
          ? (item.categories_mm || (item.category_mm ? [item.category_mm] : []))
          : (item.categories_en || (item.category_en ? [item.category_en] : []));
        const author = (lang === 'mm') ? (item.author_mm || "ထက်မြတ်ဧကရီ") : (item.author_en || "Htet Myat Ekri");
        const relTitle = (lang === 'mm' ? (item.title_mm || item.title_en) : (item.title_en || item.title_mm)) || '';
        const relExcerpt = (lang === 'mm' ? (item.excerpt_mm || item.excerpt_en) : (item.excerpt_en || item.excerpt_mm)) || '';
        const relReadTime = (lang === 'mm' ? (item.read_time_mm || item.read_time_en) : (item.read_time_en || item.read_time_mm)) || (lang === 'mm' ? '၁၂ မိနစ် ဖတ်ရှုရန်' : '12 min read');

        return `
          <a href="article.html?id=${item.id}" class="related-article-card glass-3d-card card-3d-interactive group block p-6 rounded-2xl border border-taupe-light hover:border-vermilion transition-all shadow-sm">
            <div class="flex flex-wrap items-center gap-1.5 mb-2 text-xs">
              ${cats.map(c => `
                <span class="px-2 py-0.5 rounded-full bg-cream text-charcoal border border-hairline text-[10px] font-sans-ui flex items-center space-x-1">
                  <i class="ri-folder-2-line text-vermilion"></i>
                  <span>${c}</span>
                </span>
              `).join('')}
              <span class="text-faint">•</span>
              <span class="text-faint text-[10px] font-sans-ui">${relReadTime}</span>
            </div>

            <h4 class="font-serif-editorial text-xl text-charcoal group-hover:text-vermilion font-medium transition-colors mb-2">
              ${relTitle}
            </h4>
            <p class="text-xs text-muted leading-relaxed line-clamp-2 font-sans-ui mb-3">
              ${relExcerpt}
            </p>

            <div class="flex items-center justify-between text-xs text-vermilion font-sans-ui font-medium pt-2 border-t border-hairline">
              <span class="text-faint text-[10px] flex items-center space-x-1">
                <span class="hanko-stamp w-3.5 h-3.5 text-[7px] flex items-center justify-center font-bold">ထက်</span>
                <span>${author}</span>
              </span>
              <span class="flex items-center space-x-0.5 group-hover:translate-x-1 transition-transform">
                <span>${lang === 'mm' ? 'ဖတ်ရှုရန်' : 'Read'}</span>
                <i class="ri-arrow-right-line"></i>
              </span>
            </div>
          </a>
        `;
      }).join('');

      if (window.HtetUI && typeof window.HtetUI.init3DTiltAndFloatingEffects === 'function') {
        window.HtetUI.init3DTiltAndFloatingEffects();
      }
    },

    // --------------------------------------------------------------------------
    // 11.5. Adjacent Articles Navigation (Previous & Next Essays)
    // --------------------------------------------------------------------------
    async renderAdjacentArticles(currentId) {
      const container = document.getElementById('article-prev-next-nav');
      if (!container) return;

      let all = [];
      if (window.HtetData) {
        try {
          all = await window.HtetData.getArticles();
        } catch (e) {
          all = window.HTET_ARTICLES_BACKUP || window.articlesData || [];
        }
      }
      if (!all || all.length === 0) {
        all = window.HTET_ARTICLES_BACKUP || window.articlesData || [];
      }

      const lowerCurrent = String(currentId).toLowerCase().trim();
      const currentIndex = all.findIndex(a => 
        (a.id && a.id.toLowerCase() === lowerCurrent) || 
        (a.slug && a.slug.toLowerCase() === lowerCurrent)
      );

      if (currentIndex === -1) {
        container.classList.add('hidden');
        return;
      }

      const prev = currentIndex > 0 ? all[currentIndex - 1] : null;
      const next = currentIndex < all.length - 1 ? all[currentIndex + 1] : null;

      if (!prev && !next) {
        container.classList.add('hidden');
        return;
      }

      container.classList.remove('hidden');
      const lang = window.I18n ? window.I18n.getLang() : 'mm';

      let html = '';
      if (prev) {
        const prevTitle = (lang === 'mm' ? (prev.title_mm || prev.title_en) : (prev.title_en || prev.title_mm)) || '';
        const prevReadTime = (lang === 'mm' ? (prev.read_time_mm || prev.read_time_en) : (prev.read_time_en || prev.read_time_mm)) || (lang === 'mm' ? '၁၂ မိနစ် ဖတ်ရှုရန်' : '12 min read');
        html += `
          <a href="article.html?id=${prev.slug || prev.id}" class="adjacent-article-card glass-3d-card card-3d-interactive group p-5 rounded-2xl border border-taupe-light hover:border-vermilion transition-all flex flex-col justify-between shadow-sm">
            <span class="text-[11px] font-sans-ui text-faint flex items-center space-x-1.5 mb-2">
              <i class="ri-arrow-left-line text-vermilion text-sm group-hover:-translate-x-0.5 transition-transform"></i>
              <span>${lang === 'mm' ? 'ရှေ့ဆောင်းပါး' : 'Previous Essay'}</span>
            </span>
            <h4 class="font-serif-editorial text-lg font-medium text-charcoal group-hover:text-vermilion transition-colors line-clamp-2 leading-snug">
              ${prevTitle}
            </h4>
            <span class="text-[11px] text-muted font-sans-ui mt-3 flex items-center space-x-1">
              <i class="ri-time-line text-vermilion text-xs"></i>
              <span>${prevReadTime}</span>
            </span>
          </a>
        `;
      } else {
        html += `<div class="hidden sm:block"></div>`;
      }

      if (next) {
        const nextTitle = (lang === 'mm' ? (next.title_mm || next.title_en) : (next.title_en || next.title_mm)) || '';
        const nextReadTime = (lang === 'mm' ? (next.read_time_mm || next.read_time_en) : (next.read_time_en || next.read_time_mm)) || (lang === 'mm' ? '၁၂ မိနစ် ဖတ်ရှုရန်' : '12 min read');
        html += `
          <a href="article.html?id=${next.slug || next.id}" class="adjacent-article-card glass-3d-card card-3d-interactive group p-5 rounded-2xl border border-taupe-light hover:border-vermilion transition-all flex flex-col justify-between items-end text-right shadow-sm">
            <span class="text-[11px] font-sans-ui text-faint flex items-center space-x-1.5 mb-2">
              <span>${lang === 'mm' ? 'နောက်ဆောင်းပါး' : 'Next Essay'}</span>
              <i class="ri-arrow-right-line text-vermilion text-sm group-hover:translate-x-0.5 transition-transform"></i>
            </span>
            <h4 class="font-serif-editorial text-lg font-medium text-charcoal group-hover:text-vermilion transition-colors line-clamp-2 leading-snug">
              ${nextTitle}
            </h4>
            <span class="text-[11px] text-muted font-sans-ui mt-3 flex items-center space-x-1">
              <i class="ri-time-line text-vermilion text-xs"></i>
              <span>${nextReadTime}</span>
            </span>
          </a>
        `;
      }

      container.innerHTML = html;

      if (window.HtetUI && typeof window.HtetUI.init3DTiltAndFloatingEffects === 'function') {
        window.HtetUI.init3DTiltAndFloatingEffects();
      }
    },

    // --------------------------------------------------------------------------
    // 11.6. Floating Reading Companion & Combined Icon Navigation Hub
    // --------------------------------------------------------------------------
    initFloatingCompanion() {
      const topBtn = document.getElementById('article-scroll-top-btn') || document.getElementById('back-to-top-progress-btn');
      if (topBtn) {
        topBtn.addEventListener('click', (e) => {
          if (e.target.closest('#article-scroll-bottom-btn') || e.target.closest('#article-scroll-menu-btn')) return;
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      const bottomBtn = document.getElementById('article-scroll-bottom-btn');
      if (bottomBtn) {
        bottomBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const maxScroll = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
          ) - window.innerHeight;
          window.scrollTo({ top: maxScroll, behavior: 'smooth' });
        });
      }

      const progressBadge = document.getElementById('article-scroll-progress-badge');
      if (progressBadge) {
        progressBadge.addEventListener('click', (e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      const floatingZenBtn = document.getElementById('floating-zen-btn');
      const articleZenBtn = document.getElementById('article-zen-focus-btn');
      if (floatingZenBtn && articleZenBtn) {
        floatingZenBtn.addEventListener('click', (e) => {
          e.preventDefault();
          articleZenBtn.click();
        });
      }

      // 3-dots Menu Button & Flyout Navigation Hub
      const menuBtn = document.getElementById('article-scroll-menu-btn');
      const flyout = document.getElementById('article-scroll-flyout');
      const companion = document.getElementById('floating-reading-companion');
      const hideBtn = document.getElementById('article-scroll-hide-btn');

      function getOrCreateArticleRestoreBtn() {
        let restoreBtn = document.getElementById('article-scroll-restore-btn');
        if (!restoreBtn) {
          restoreBtn = document.createElement('button');
          restoreBtn.id = 'article-scroll-restore-btn';
          restoreBtn.className = 'hidden fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 w-9 h-9 rounded-full bg-card/90 dark:bg-stone-900/90 border border-hairline/80 shadow-lg flex items-center justify-center text-muted hover:text-vermilion hover:scale-110 active:scale-95 transition-all text-sm cursor-pointer glass-3d-pill no-print';
          restoreBtn.title = 'ဖတ်ရှုမှု ကိရိယာများ ပြန်ဖော်ရန် (Restore Reading Hub)';
          restoreBtn.setAttribute('aria-label', 'Restore Reading Hub');
          restoreBtn.innerHTML = '<i class="ri-compass-3-line text-sm"></i>';
          document.body.appendChild(restoreBtn);

          restoreBtn.addEventListener('click', () => {
            localStorage.removeItem('htet_all_in_one_hidden');
            restoreBtn.classList.add('hidden');
            if (companion) {
              companion.classList.remove('all-in-one-dismissed');
              companion.style.display = '';
            }
            if (window.HtetUI && typeof window.HtetUI.showToast === 'function') {
              window.HtetUI.showToast('ဖတ်ရှုမှု ကိရိယာများ ပြန်လည်ဖော်ပြပြီးပါပြီ ✓');
            }
          });
        }
        return restoreBtn;
      }

      if (localStorage.getItem('htet_all_in_one_hidden') === 'true' && companion) {
        companion.classList.add('all-in-one-dismissed');
        companion.style.display = 'none';
        const restoreBtn = getOrCreateArticleRestoreBtn();
        restoreBtn.classList.remove('hidden');
      }

      if (hideBtn && companion) {
        hideBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          localStorage.setItem('htet_all_in_one_hidden', 'true');
          companion.classList.add('all-in-one-dismissed');
          companion.style.display = 'none';
          if (flyout) flyout.classList.add('hidden');
          const restoreBtn = getOrCreateArticleRestoreBtn();
          restoreBtn.classList.remove('hidden');
          if (window.HtetUI && typeof window.HtetUI.showToast === 'function') {
            window.HtetUI.showToast('ဖတ်ရှုမှု ကိရိယာခလုတ်ကို ဖျောက်ထားပါသည် (ပြန်ဖော်ရန် ညာဘက်အောက်ထောင့်ရှိ အိုင်ကွန်ကို နှိပ်ပါ)');
          }
        });
      }

      if (menuBtn && flyout) {
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          flyout.classList.toggle('hidden');
          flyout.classList.toggle('is-open');
        });

        document.addEventListener('click', (e) => {
          if (companion && !companion.contains(e.target)) {
            flyout.classList.add('hidden');
            flyout.classList.remove('is-open');
          }
        });
      }

      // Flyout Zen Mode Action
      const flyoutZen = document.getElementById('article-flyout-zen-btn');
      if (flyoutZen) {
        flyoutZen.addEventListener('click', () => {
          if (flyout) {
            flyout.classList.add('hidden');
            flyout.classList.remove('is-open');
          }
          const articleZenBtn = document.getElementById('article-zen-focus-btn');
          if (articleZenBtn) articleZenBtn.click();
        });
      }

      // Flyout Language Toggle Action
      const flyoutLang = document.getElementById('article-flyout-lang-btn');
      if (flyoutLang) {
        flyoutLang.addEventListener('click', () => {
          if (flyout) {
            flyout.classList.add('hidden');
            flyout.classList.remove('is-open');
          }
          const langToggleBtn = document.getElementById('article-lang-toggle-btn');
          if (langToggleBtn) langToggleBtn.click();
        });
      }

      // Flyout Search Action
      const flyoutSearch = document.getElementById('article-flyout-search-btn');
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

      // Flyout Bookmark Action
      const flyoutBookmark = document.getElementById('article-flyout-bookmark-btn');
      if (flyoutBookmark) {
        flyoutBookmark.addEventListener('click', () => {
          if (this.articleData && window.HtetUI && window.HtetUI.BookmarkSystem) {
            window.HtetUI.BookmarkSystem.toggle(this.articleData.id);
            this.updateBookmarkButtonState();
          }
        });
      }

      // Flyout Reading List Drawer Action
      const flyoutReadingList = document.getElementById('article-flyout-readinglist-btn');
      if (flyoutReadingList) {
        flyoutReadingList.addEventListener('click', () => {
          if (flyout) {
            flyout.classList.add('hidden');
            flyout.classList.remove('is-open');
          }
          const trigger = document.getElementById('reading-list-trigger');
          if (trigger) trigger.click();
        });
      }

      // Flyout Theme Switcher Action
      const flyoutTheme = document.getElementById('article-flyout-theme-btn');
      if (flyoutTheme) {
        flyoutTheme.addEventListener('click', () => {
          if (window.Theme && window.Theme.openThemeModal) {
            window.Theme.openThemeModal();
          } else if (window.Theme && window.Theme.cycleTheme) {
            window.Theme.cycleTheme();
          }
        });
      }

      // Flyout Share Action
      const flyoutShare = document.getElementById('article-flyout-share-btn');
      if (flyoutShare) {
        flyoutShare.addEventListener('click', () => {
          if (navigator.share && this.articleData) {
            navigator.share({
              title: this.articleData.title_mm || this.articleData.title_en,
              url: window.location.href
            }).catch(() => {});
          } else {
            navigator.clipboard.writeText(window.location.href);
            if (window.HtetUI && window.HtetUI.showToast) {
              window.HtetUI.showToast('စာမူ လင့်ခ်ကို ကူးယူပြီးပါပြီ (Copied to clipboard)');
            }
          }
        });
      }
    },

    // --------------------------------------------------------------------------
    // 11.7. Article Header Bookmark Button System
    // --------------------------------------------------------------------------
    initHeaderBookmarkButton() {
      const btn = document.getElementById('article-header-bookmark-btn');
      if (!btn || !this.articleData) return;

      this.updateBookmarkButtonState();

      if (!btn.dataset.bound) {
        btn.dataset.bound = 'true';
        btn.addEventListener('click', () => {
          if (window.HtetUI && window.HtetUI.BookmarkSystem) {
            window.HtetUI.BookmarkSystem.toggle(this.articleData.id);
            this.updateBookmarkButtonState();
          }
        });
      }
    },

    updateBookmarkButtonState() {
      if (!this.articleData) return;
      const isSaved = window.HtetUI && window.HtetUI.BookmarkSystem 
        ? window.HtetUI.BookmarkSystem.isBookmarked(this.articleData.id) 
        : false;

      // Header button
      const btn = document.getElementById('article-header-bookmark-btn');
      const lang = window.I18n ? window.I18n.getLang() : 'mm';

      if (btn) {
        if (isSaved) {
          btn.innerHTML = `<i class="ri-bookmark-fill text-vermilion"></i> <span id="article-header-bookmark-text" class="text-xs text-vermilion font-semibold">${lang === 'mm' ? 'သိမ်းဆည်းပြီး' : 'Saved'}</span>`;
          btn.classList.add('border-vermilion/50', 'bg-vermilion/10');
        } else {
          btn.innerHTML = `<i class="ri-bookmark-line text-vermilion"></i> <span id="article-header-bookmark-text" class="text-xs">${lang === 'mm' ? 'မှတ်ထားရန်' : 'Bookmark'}</span>`;
          btn.classList.remove('border-vermilion/50', 'bg-vermilion/10');
        }
      }

      // Flyout button label and icon
      const flyoutText = document.getElementById('article-flyout-bookmark-text');
      if (flyoutText) {
        flyoutText.textContent = isSaved 
          ? (lang === 'mm' ? 'သိမ်းဆည်းပြီး ✓' : 'Bookmarked ✓') 
          : (lang === 'mm' ? 'ဤစာမူ သိမ်းရန်' : 'Bookmark Essay');
      }
      const flyoutIcon = document.getElementById('article-flyout-bookmark-icon');
      if (flyoutIcon) {
        flyoutIcon.className = isSaved 
          ? 'ri-bookmark-fill text-vermilion text-sm' 
          : 'ri-bookmark-line text-vermilion text-sm';
      }
    },

    // --------------------------------------------------------------------------
    // 12. Toast Feedback System
    // --------------------------------------------------------------------------
    showToast(message) {
      let toast = document.getElementById('reader-floating-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'reader-floating-toast';
        toast.className = 'fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-charcoal text-ivory text-xs font-sans-ui shadow-2xl flex items-center space-x-2 transition-all transform translate-y-12 opacity-0 pointer-events-none';
        document.body.appendChild(toast);
      }

      toast.innerHTML = `<i class="ri-check-line text-emerald-400 text-sm"></i> <span>${message}</span>`;
      toast.classList.remove('translate-y-12', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-12', 'opacity-0');
      }, 2600);
    },

    // --------------------------------------------------------------------------
    // 13. Keyboard Shortcuts & 404
    // --------------------------------------------------------------------------
    initKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

        if (e.key === 'Escape') {
          this.hideCitationPopover();
        } else if (e.key === 't' || e.key === 'T') {
          if (window.Theme) window.Theme.cycleTheme();
        } else if (e.key === 'l' || e.key === 'L') {
          if (window.I18n) {
            const current = window.I18n.getLang();
            window.I18n.setLang(current === 'mm' ? 'en' : 'mm');
          }
        } else if (e.key === '+' || e.key === '=') {
          if (this.fontSize < 26) {
            this.fontSize += 1.5;
            this.saveFontSize();
          }
        } else if (e.key === '-' || e.key === '_') {
          if (this.fontSize > 15) {
            this.fontSize -= 1.5;
            this.saveFontSize();
          }
        }
      });
    },

    // --------------------------------------------------------------------------
    // 10. Article Download & Export Engine
    // --------------------------------------------------------------------------
    initDownloadMenu() {
      const trigger = document.getElementById('article-download-trigger');
      const dropdown = document.getElementById('article-download-dropdown');
      const mobileBtn = document.getElementById('mobile-download-btn');
      const btnPdf = document.getElementById('download-action-pdf');
      const btnMd = document.getElementById('download-action-md');
      const btnTxt = document.getElementById('download-action-txt');
      const btnBib = document.getElementById('download-action-bib');

      if (trigger && dropdown) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
          dropdown.classList.add('hidden');
        });
      }

      if (mobileBtn) {
        mobileBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.triggerDownload('pdf');
        });
      }

      if (btnPdf) {
        btnPdf.addEventListener('click', (e) => {
          e.preventDefault();
          if (dropdown) dropdown.classList.add('hidden');
          this.triggerDownload('pdf');
        });
      }

      if (btnMd) {
        btnMd.addEventListener('click', (e) => {
          e.preventDefault();
          if (dropdown) dropdown.classList.add('hidden');
          this.triggerDownload('md');
        });
      }

      if (btnTxt) {
        btnTxt.addEventListener('click', (e) => {
          e.preventDefault();
          if (dropdown) dropdown.classList.add('hidden');
          this.triggerDownload('txt');
        });
      }

      if (btnBib) {
        btnBib.addEventListener('click', (e) => {
          e.preventDefault();
          if (dropdown) dropdown.classList.add('hidden');
          this.triggerDownload('bib');
        });
      }
    },

    triggerDownload(type) {
      if (!this.articleData) return;
      const article = this.articleData;
      const lang = window.I18n ? window.I18n.getLang() : 'mm';
      const title = lang === 'mm' ? article.title_mm : article.title_en;
      const content = lang === 'mm' ? article.content_mm : article.content_en;

      if (type === 'pdf') {
        if (article.pdf_file) {
          const link = document.createElement('a');
          link.href = article.pdf_file;
          link.download = article.pdf_file.split('/').pop();
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          if (window.HtetUI) window.HtetUI.showToast(lang === 'mm' ? 'မူရင်း PDF စာတမ်း ဒေါင်းလုဒ် ရယူပြီးပါပြီ' : 'Official PDF downloaded');
        } else {
          window.print();
        }
      } else if (type === 'md') {
        const filename = `${article.id}.md`;
        const link = document.createElement('a');
        link.href = `downloads/${filename}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (window.HtetUI) window.HtetUI.showToast('Markdown (.md) စာတမ်း ဒေါင်းလုဒ် ရယူပြီးပါပြီ');
      } else if (type === 'txt') {
        const textContent = content.replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n\n').trim();
        const header = `${title}\n${'='.repeat(Math.min(title.length, 60))}\nစာရေးသူ: ထက်မြတ်ဧကရီ (Htet Myat Ekri)\nရက်စွဲ: ${article.date}\nကဏ္ဍ: ${article.category_mm}\n\n`;
        const blob = new Blob([header + textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${article.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        if (window.HtetUI) window.HtetUI.showToast('Plain Text (.txt) စာတမ်း ဒေါင်းလုဒ် ရယူပြီးပါပြီ');
      } else if (type === 'bib') {
        const safeId = article.id.replace(/-/g, '_');
        const bib = `@article{htet_${safeId},
  author  = {Htet Myat Ekri},
  title   = {{${article.title_en || article.title_mm}}},
  journal = {Htet Official Autonomous Monograph Series},
  year    = {${article.date.split('-')[0]}},
  url     = {https://htetofficial.wordpress.com/article.html?id=${article.id}}
}`;
        const blob = new Blob([bib], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${article.id}.bib`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        if (window.HtetUI) window.HtetUI.showToast('BibTeX (.bib) ကိုးကားချက် ဒေါင်းလုဒ် ရယူပြီးပါပြီ');
      }
    },


    // --------------------------------------------------------------------------
    // 9. Scientific & Disaster Interactive Widgets Engine
    // --------------------------------------------------------------------------
    initInteractiveWidgets(container, articleId) {
      if (!container) return;
      const lang = window.I18n ? window.I18n.getLang() : 'mm';

      if (articleId === 'early-puberty-scientific-feminist-analysis') {
        this.initEarlyPubertyCharts(container, lang);
      } else if (articleId === 'myanmar-earthquake-special-article-2025') {
        this.initEarthquakeWidgets(container, lang);
      } else if (articleId === 'cisgender-privilege-easy-mode') {
        this.initCisgenderGallery(container, lang);
      }
    },

    initEarlyPubertyCharts(container, lang) {
      const isMM = lang === 'mm';

      // 1. Secular Trend Chart (Line Chart)
      const trendCanvas = document.getElementById('puberty-secular-trend-chart');
      if (trendCanvas && typeof Chart !== 'undefined') {
        if (this.activeCharts['puberty-trend']) {
          this.activeCharts['puberty-trend'].destroy();
        }

        const labels = isMM
          ? ['၁၈၄၀ (စက်မှုခေတ်ဦး)', '၁၈၈၀', '၁၉၂၀', '၁၉၅၀ (စစ်ပြီးခေတ်)', '၁၉၈၀', '၂၀၀၀ (ပလတ်စတစ်)', '၂၀၂၅ (လက်ရှိ)', 'Precocious (စောစီးမှု)']
          : ['1840 (Early Ind.)', '1880', '1920', '1950 (Post-war)', '1980', '2000 (Plastics Era)', '2025 (Present)', 'Precocious Onset'];
        const values = [17.0, 16.0, 14.8, 13.6, 12.8, 12.5, 12.2, 8.5];

        this.activeCharts['puberty-trend'] = new Chart(trendCanvas, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: isMM ? 'ရာသီစတင်ပေါ်ပေါက်သည့် ပျမ်းမျှအသက် (နှစ်)' : 'Average Age at Menarche (Years)',
              data: values,
              borderColor: '#e11d48',
              backgroundColor: 'rgba(225, 29, 72, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.35,
              pointBackgroundColor: '#e11d48',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 9
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
                labels: { font: { family: 'Pyidaungsu, sans-serif', size: 12 } }
              },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { family: 'Pyidaungsu, sans-serif' },
                bodyFont: { family: 'Pyidaungsu, sans-serif' },
                callbacks: {
                  label: function(ctx) {
                    return (isMM ? 'ပျမ်းမျှအသက်: ' : 'Average Age: ') + ctx.parsed.y + (isMM ? ' နှစ်' : ' years');
                  }
                }
              }
            },
            scales: {
              y: {
                min: 7,
                max: 18,
                title: {
                  display: true,
                  text: isMM ? 'အသက် (နှစ်)' : 'Age (Years)',
                  font: { family: 'Pyidaungsu, sans-serif', size: 12 }
                },
                grid: { color: 'rgba(0,0,0,0.05)' }
              },
              x: {
                title: {
                  display: true,
                  text: isMM ? 'သမိုင်းခေတ်ကာလများ (Historical Timeline)' : 'Historical Timeline',
                  font: { family: 'Pyidaungsu, sans-serif', size: 12 }
                },
                grid: { display: false }
              }
            }
          }
        });
      }

      // 2. EDCs Sources Chart (Doughnut Chart)
      const edcCanvas = document.getElementById('puberty-edc-sources-chart');
      if (edcCanvas && typeof Chart !== 'undefined') {
        if (this.activeCharts['puberty-edc']) {
          this.activeCharts['puberty-edc'].destroy();
        }

        const edcLabels = isMM
          ? ['BPA/BPS (ပလတ်စတစ်ဗူးနှင့် အစွပ်များ)', 'Phthalates/Parabens (အလှကုန်/ရေမွှေး)', 'PFAS (အမြန်စာထုပ်ပိုးနှင့် ရေ)', 'Pesticides (ပိုးသတ်ဆေးကြွင်း)']
          : ['BPA/BPS (Plastics/Resin Liners)', 'Phthalates/Parabens (Cosmetics/Fragrance)', 'PFAS (Fast Food Packaging & Water)', 'Pesticides (Agricultural Runoff)'];

        this.activeCharts['puberty-edc'] = new Chart(edcCanvas, {
          type: 'doughnut',
          data: {
            labels: edcLabels,
            datasets: [{
              data: [35, 25, 20, 20],
              backgroundColor: ['#e11d48', '#f43f5e', '#fb7185', '#fda4af'],
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  boxWidth: 12,
                  font: { family: 'Pyidaungsu, sans-serif', size: 11 },
                  padding: 12
                }
              },
              tooltip: {
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                titleFont: { family: 'Pyidaungsu, sans-serif' },
                bodyFont: { family: 'Pyidaungsu, sans-serif' },
                callbacks: {
                  label: function(ctx) {
                    return ctx.label + ': ' + ctx.parsed + '%';
                  }
                }
              }
            }
          }
        });
      }
    },

    initEarthquakeWidgets(container, lang) {
      const isMM = lang === 'mm';

      // 1. Leaflet Interactive Seismic Map
      const mapContainer = document.getElementById('earthquake-leaflet-map');
      if (mapContainer && typeof L !== 'undefined') {
        if (this.earthquakeMap) {
          try { this.earthquakeMap.remove(); } catch(e) {}
          this.earthquakeMap = null;
        }

        const map = L.map('earthquake-leaflet-map', {
          center: [21.98, 95.95],
          zoom: 7,
          scrollWheelZoom: false
        });
        this.earthquakeMap = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Seismology: USGS & Htet Research',
          maxZoom: 18
        }).addTo(map);

        // Sagaing Fault Polyline
        const sagaingFaultCoords = [
          [25.8, 96.3], [24.8, 96.15], [23.5, 96.0], [22.4, 95.96],
          [21.98, 95.95], [21.5, 96.02], [20.5, 96.12], [19.75, 96.2],
          [18.5, 96.35], [17.3, 96.48], [15.8, 96.8]
        ];
        L.polyline(sagaingFaultCoords, {
          color: '#dc2626',
          weight: 4,
          dashArray: '8, 6',
          opacity: 0.9
        }).addTo(map).bindPopup(isMM
          ? '<b>စစ်ကိုင်းပြတ်ရွေ့ကြောကြီး (Active Sagaing Fault)</b><br>အရှည် ၁,၂၀၀ ကီလိုမီတာရှိသော အဓိက လှုပ်ရှားပြတ်ရွေ့ကြောကြီး။'
          : '<b>Active Sagaing Fault</b><br>1,200 km continental transform strike-slip fault.');

        // Isoseismal Zones
        L.circle([21.98, 95.95], { radius: 45000, color: '#dc2626', fillColor: '#ef4444', fillOpacity: 0.25, weight: 2 }).addTo(map)
          .bindPopup(isMM ? '<b>MMI IX (အလွန်ပြင်းထန် - ပျက်စီးမှုကြီးမား)</b><br>စစ်ကိုင်း၊ အင်းဝ၊ အမရပူရ၊ မန္တလေးမြို့' : '<b>MMI IX (Violent Shaking)</b><br>Sagaing, Inwa, Amarapura, Mandalay');
        L.circle([21.98, 95.95], { radius: 100000, color: '#ea580c', fillColor: '#f97316', fillOpacity: 0.15, weight: 1.5 }).addTo(map)
          .bindPopup(isMM ? '<b>MMI VIII (အလွန်အားပြင်း)</b><br>ကျောက်ဆည်၊ မြင်းခြံ၊ ရွှေဘို' : '<b>MMI VIII (Severe Shaking)</b><br>Kyaukse, Myingyan, Shwebo');
        L.circle([21.98, 95.95], { radius: 220000, color: '#d97706', fillColor: '#fbbf24', fillOpacity: 0.1, weight: 1 }).addTo(map)
          .bindPopup(isMM ? '<b>MMI VII (အားပြင်းလှုပ်ခတ်)</b><br>မိတ္ထီလာ၊ ပျဉ်းမနား၊ နေပြည်တော်' : '<b>MMI VII (Very Strong)</b><br>Meiktila, Pyinmana, Naypyitaw');
        L.circle([21.98, 95.95], { radius: 500000, color: '#eab308', fillColor: '#fef08a', fillOpacity: 0.05, weight: 1 }).addTo(map)
          .bindPopup(isMM ? '<b>MMI V (အသင့်အတင့်)</b><br>ရန်ကုန်၊ တောင်ကြီး၊ မော်လမြိုင်' : '<b>MMI V (Moderate)</b><br>Yangon, Taunggyi, Mawlamyine');

        // Epicenter Marker
        const epicenterMarker = L.circleMarker([21.98, 95.95], {
          radius: 12,
          color: '#7f1d1d',
          fillColor: '#dc2626',
          fillOpacity: 0.95,
          weight: 3
        }).addTo(map);
        epicenterMarker.bindPopup(isMM
          ? '<b>၂၀၂၅ မတ် ၂၈ ငလျင်ဗဟိုချက် (Epicenter)</b><br><b>ပမာဏ:</b> Mw 7.7<br><b>အနက်:</b> ၁၀ ကီလိုမီတာ<br><b>တည်နေရာ:</b> စစ်ကိုင်းမြို့၏ အနောက်မြောက်ဘက် ၁၆ ကီလိုမီတာ<br><b>အချိန်:</b> ၁၂:၅၀:၅၄ MMT (06:20:54 UTC)'
          : '<b>March 28, 2025 Epicenter</b><br><b>Magnitude:</b> Mw 7.7<br><b>Depth:</b> 10 km<br><b>Location:</b> 16 km NNW of Sagaing<br><b>Origin Time:</b> 12:50:54 MMT (06:20:54 UTC)').openPopup();

        // Landmark Markers
        const avaBridge = L.marker([21.875, 95.985]).addTo(map);
        avaBridge.bindPopup(isMM
          ? '<b>သမိုင်းဝင် အင်းဝတံတားကြီး (စစ်ကိုင်းတံတား)</b><br>၁၉၃၄ တည်ဆောက်ခဲ့သော ဗြိတိသျှခေတ် သံပေါင်တံတားကြီး ဧရာဝတီမြစ်ထဲသို့ လုံးဝပြိုကျပျက်စီးခဲ့သည့် နေရာ။'
          : '<b>Historic Ava Bridge (Inwa Bridge)</b><br>1934 British steel truss landmark collapsed completely into Irrawaddy River.');

        const mandalayPalace = L.marker([21.99, 96.085]).addTo(map);
        mandalayPalace.bindPopup(isMM
          ? '<b>မန္တလေး နန်းမြို့ရိုးနှင့် အဆောက်အအုံများ</b><br>ရှေးဟောင်းနန်းမြို့ရိုး အပိုင်းအစများ ပြိုကျပျက်စီးခြင်း။'
          : '<b>Mandalay Royal Palace Walls</b><br>Historic masonry fissures and wall segment collapse.');

        const naypyitaw = L.marker([19.75, 96.1]).addTo(map);
        naypyitaw.bindPopup(isMM
          ? '<b>နေပြည်တော် ဝန်ကြီးဌာနများဇုန်</b><br>အဝေးပြေးလမ်းမကြီးများ အက်ကွဲဟက်တက်ကွဲခြင်းနှင့် အဆောက်အအုံမျက်နှာကြက်များ ပြိုကျခြင်း။'
          : '<b>Naypyitaw Capital Zone</b><br>Buckled highways and ministry ceiling collapses.');

        const bangkok = L.marker([13.75, 100.5]).addTo(map);
        bangkok.bindPopup(isMM
          ? '<b>ဘန်ကောက်မြို့ (ထိုင်းနိုင်ငံ)</b><br>ကောင်းကင်ဘုံတိုက်မြင့်များ ပြင်းထန်စွာ လှုပ်ခါပြီး စစ်တုစတ်ဆောက်လုပ်ရေး အဆောက်အအုံ ပြိုကျခဲ့သည်။'
          : '<b>Bangkok (Thailand)</b><br>High-rise swaying; Chatuchak building collapse.');

        setTimeout(() => { map.invalidateSize(); }, 400);
      }

      // 2. Wave Speed Chart
      const waveCanvas = document.getElementById('earthquake-wave-speed-chart');
      if (waveCanvas && typeof Chart !== 'undefined') {
        if (this.activeCharts['earthquake-wave']) {
          this.activeCharts['earthquake-wave'].destroy();
        }

        const waveLabels = isMM
          ? ['P-Wave (ဖိသိပ်လှိုင်း)', 'S-Wave (ကန့်လန့်ဖြတ်လှိုင်း)', 'Love Wave (မျက်နှာပြင်လှိုင်း)', 'Rayleigh Wave (လိပ်ခဲတည်းခဲလှိုင်း)']
          : ['P-Wave (Compressional)', 'S-Wave (Shear)', 'Love Wave (Surface)', 'Rayleigh Wave (Surface)'];

        this.activeCharts['earthquake-wave'] = new Chart(waveCanvas, {
          type: 'bar',
          data: {
            labels: waveLabels,
            datasets: [{
              label: isMM ? 'အလျင် (km/s)' : 'Velocity (km/s)',
              data: [6.5, 3.8, 3.4, 3.0],
              backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444', '#b91c1c'],
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function(ctx) {
                    return (isMM ? 'အလျင်: ' : 'Speed: ') + ctx.parsed.y + ' km/s';
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 8,
                title: { display: true, text: isMM ? 'ကီလိုမီတာ / စက္ကန့် (km/s)' : 'Kilometers per Second (km/s)' }
              }
            }
          }
        });
      }

      // 3. PAGER Loss Chart
      const pagerCanvas = document.getElementById('earthquake-pager-loss-chart');
      if (pagerCanvas && typeof Chart !== 'undefined') {
        if (this.activeCharts['earthquake-pager']) {
          this.activeCharts['earthquake-pager'].destroy();
        }

        const pagerLabels = isMM
          ? ['Green (<$1M)', 'Yellow ($1M-$10M)', 'Orange ($10M-$100M)', 'Red (> $100M / 30% GDP)']
          : ['Green (<$1M)', 'Yellow ($1M-$10M)', 'Orange ($10M-$100M)', 'Red (> $100M / 30% GDP)'];

        this.activeCharts['earthquake-pager'] = new Chart(pagerCanvas, {
          type: 'bar',
          data: {
            labels: pagerLabels,
            datasets: [{
              label: isMM ? 'ဆုံးရှုံးနိုင်ခြေ ရာခိုင်နှုန်း (%)' : 'Probability (%)',
              data: [5, 15, 35, 45],
              backgroundColor: ['#22c55e', '#eab308', '#f97316', '#dc2626'],
              borderRadius: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function(ctx) {
                    return (isMM ? 'ဖြစ်နိုင်ခြေ: ' : 'Probability: ') + ctx.parsed.y + '%';
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 60,
                title: { display: true, text: isMM ? 'ဖြစ်နိုင်ခြေ ရာခိုင်နှုန်း (%)' : 'Probability (%)' }
              }
            }
          }
        });
      }

      // 4. Interactive Emergency Go Bag Checklist
      const gobagContainer = document.getElementById('earthquake-gobag-interactive');
      if (gobagContainer) {
        const STORAGE_KEY = 'htet_earthquake_gobag_state';
        const checkboxes = gobagContainer.querySelectorAll('input[type="checkbox"]');
        const progressBar = document.getElementById('gobag-progress-bar');
        const progressText = document.getElementById('gobag-progress-text');
        const progressPercent = document.getElementById('gobag-progress-percent');
        const resetBtn = document.getElementById('gobag-reset-btn');
        const selectAllBtn = document.getElementById('gobag-select-all-btn');

        let saved = {};
        try {
          saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch(e) { saved = {}; }

        checkboxes.forEach((cb, idx) => {
          const id = cb.getAttribute('data-item-id') || `item-${idx}`;
          if (saved[id] === true) {
            cb.checked = true;
          }
          cb.addEventListener('change', () => {
            saved[id] = cb.checked;
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch(e) {}
            updateProgress();
          });
        });

        function updateProgress() {
          let checkedCount = 0;
          checkboxes.forEach(cb => { if (cb.checked) checkedCount++; });
          const total = checkboxes.length || 14;
          const percent = Math.round((checkedCount / total) * 100);

          if (progressBar) progressBar.style.width = `${percent}%`;
          if (progressPercent) progressPercent.textContent = `${percent}%`;
          if (progressText) {
            progressText.textContent = isMM
              ? `ပစ္စည်း ${total} မျိုးအနက် ${checkedCount} မျိုး ပြင်ဆင်ပြီးစီးပါပြီ`
              : `${checkedCount} of ${total} essential items packed`;
          }
        }

        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            checkboxes.forEach(cb => { cb.checked = false; });
            saved = {};
            try { localStorage.removeItem(STORAGE_KEY); } catch(e) {}
            updateProgress();
          });
        }

        if (selectAllBtn) {
          selectAllBtn.addEventListener('click', () => {
            checkboxes.forEach((cb, idx) => {
              cb.checked = true;
              const id = cb.getAttribute('data-item-id') || `item-${idx}`;
              saved[id] = true;
            });
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); } catch(e) {}
            updateProgress();
          });
        }

        updateProgress();
      }

      // 5. Image Modal Zoom (for ShakeMaps)
      const zoomImgs = container.querySelectorAll('.zoomable-shakemap');
      zoomImgs.forEach(img => {
        img.addEventListener('click', () => {
          const modal = document.createElement('div');
          modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-pointer';
          modal.innerHTML = `
            <div class="relative max-w-5xl max-h-[90vh] overflow-auto rounded-2xl bg-black border border-white/20 p-2">
              <img src="${img.src}" alt="ShakeMap Zoom" class="w-full h-auto rounded-lg">
              <button class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                <i class="ri-close-line text-lg"></i>
              </button>
            </div>
          `;
          modal.addEventListener('click', () => {
            if (document.body.contains(modal)) {
              document.body.removeChild(modal);
            }
          });
          document.body.appendChild(modal);
        });
      });
    },

    // --------------------------------------------------------------------------
    // 10. Cisgender Privilege 18-Slide Presentation Gallery & Interactive Checklist
    // --------------------------------------------------------------------------
    initCisgenderGallery(container, lang) {
      if (!container) return;
      const isMM = (lang === 'mm');

      const slides = [
        "slide-01-cover.jpg",
        "slide-02-intro.jpg",
        "slide-03-hello.jpg",
        "slide-04-part1-title.jpg",
        "slide-05-part1-restroom.jpg",
        "slide-06-part2-title.jpg",
        "slide-07-part2-nrc.jpg",
        "slide-08-part3-title.jpg",
        "slide-09-part3-syndrome.jpg",
        "slide-10-part4-title.jpg",
        "slide-11-part4-dating.jpg",
        "slide-12-part5-title.jpg",
        "slide-13-part5-wittig.jpg",
        "slide-14-part5-intersectionality.jpg",
        "slide-15-part6-title.jpg",
        "slide-16-part6-media.jpg",
        "slide-17-checklist.jpg",
        "slide-18-conclusion.jpg"
      ];

      let currentSlide = 1;

      const toDigits = (n) => {
        if (!isMM) return String(n);
        const map = { '0':'၀','1':'၁','2':'၂','3':'၃','4':'၄','5':'၅','6':'၆','7':'၇','8':'၈','9':'၉' };
        return String(n).replace(/\d/g, d => map[d] || d);
      };

      const setSlide = (num) => {
        if (num === 'prev') num = currentSlide - 1;
        else if (num === 'next') num = currentSlide + 1;
        else num = parseInt(num, 10);

        if (isNaN(num)) num = 1;
        if (num < 1) num = slides.length;
        if (num > slides.length) num = 1;
        currentSlide = num;

        const img = document.getElementById('active-slide-img');
        const counter = document.getElementById('slide-counter');

        if (img) {
          img.style.opacity = '0.35';
          img.src = 'assets/images/cisgender-privilege/' + slides[currentSlide - 1];
          img.alt = `Cisgender Privilege Slide ${currentSlide}`;
          setTimeout(() => { img.style.opacity = '1'; }, 70);
        }

        if (counter) {
          counter.textContent = isMM
            ? `ဆလိုက် ${toDigits(currentSlide)} / ${toDigits(slides.length)}`
            : `Slide ${currentSlide} of ${slides.length}`;
        }

        // Update active thumb styling
        const thumbs = container.querySelectorAll('.slide-thumb');
        thumbs.forEach((btn, idx) => {
          if (idx === currentSlide - 1) {
            btn.classList.add('border-pink-600', 'ring-2', 'ring-pink-400');
            btn.classList.remove('border-transparent');
            btn.setAttribute('aria-current', 'true');
            try {
              btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } catch (e) {}
          } else {
            btn.classList.remove('border-pink-600', 'ring-2', 'ring-pink-400');
            btn.classList.add('border-transparent');
            btn.removeAttribute('aria-current');
          }
        });
      };

      // Expose globally on window & Reader instance
      window.setSlide = setSlide;
      this.setSlide = setSlide;

      // Previous & Next navigation buttons
      const prevBtn = document.getElementById('prev-slide-btn');
      const nextBtn = document.getElementById('next-slide-btn');

      if (prevBtn) {
        prevBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setSlide(currentSlide - 1);
        };
      }

      if (nextBtn) {
        nextBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          setSlide(currentSlide + 1);
        };
      }

      // Thumbnails click handling
      const thumbs = container.querySelectorAll('.slide-thumb');
      thumbs.forEach((thumb, idx) => {
        thumb.setAttribute('data-slide-index', idx + 1);
        thumb.onclick = (e) => {
          e.preventDefault();
          setSlide(idx + 1);
        };
      });

      // Active slide image click -> Lightbox Modal Zoom
      const activeImg = document.getElementById('active-slide-img');
      if (activeImg) {
        activeImg.style.cursor = 'zoom-in';
        activeImg.title = isMM ? 'မျက်နှာပြင်ပြည့် ရှင်းလင်းစွာ ကြည့်ရှုရန် နှိပ်ပါ' : 'Click to view full screen slide';
        activeImg.onclick = () => {
          const modal = document.createElement('div');
          modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6 cursor-pointer backdrop-blur-xs';
          modal.innerHTML = `
            <div class="relative max-w-6xl max-h-[95vh] flex flex-col items-center">
              <img src="assets/images/cisgender-privilege/${slides[currentSlide - 1]}" alt="Slide ${currentSlide} Full View" class="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl">
              <div class="mt-3 flex items-center gap-3">
                <span class="px-4 py-1.5 rounded-full bg-stone-900/90 text-white text-xs font-mono border border-white/20">
                  ${isMM ? `ဆလိုက် ${toDigits(currentSlide)} / ${toDigits(slides.length)} (ပိတ်ရန် နေရာလွတ်ကို နှိပ်ပါ)` : `Slide ${currentSlide} of ${slides.length} (Click anywhere to close)`}
                </span>
              </div>
              <button class="absolute -top-3 -right-3 sm:top-2 sm:right-2 w-9 h-9 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105" aria-label="Close">
                <i class="ri-close-line text-xl"></i>
              </button>
            </div>
          `;
          modal.onclick = () => {
            if (document.body.contains(modal)) document.body.removeChild(modal);
          };
          document.body.appendChild(modal);
        };

        // Touch Swipe gestures on mobile
        let touchStartX = 0;
        let touchEndX = 0;
        activeImg.addEventListener('touchstart', (e) => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        activeImg.addEventListener('touchend', (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const diff = touchEndX - touchStartX;
          if (diff > 45) {
            setSlide(currentSlide - 1);
          } else if (diff < -45) {
            setSlide(currentSlide + 1);
          }
        }, { passive: true });
      }

      // Keyboard left/right arrow navigation
      const keyNav = (e) => {
        if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
        if (!document.getElementById('slide-gallery')) return;
        if (e.key === 'ArrowLeft') {
          setSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight') {
          setSlide(currentSlide + 1);
        }
      };
      window.removeEventListener('keydown', keyNav);
      window.addEventListener('keydown', keyNav);

      // Initialize slide 1
      setSlide(1);

      // Interactive Checklist Scoring
      const updatePrivScore = () => {
        const checks = container.querySelectorAll('.priv-check');
        let count = 0;
        checks.forEach(c => { if (c.checked) count++; });
        const box = document.getElementById('priv-score-box');
        if (box) {
          const feedback = isMM
            ? (count >= 4
                ? 'သင်သည် ဘဝကို "Easy Mode" ဖြင့် ဖြတ်သန်းခွင့်ရနေသော ကံကောင်းသူတစ်ဦး ဖြစ်ပါသည်!'
                : count >= 2
                ? 'အလယ်အလတ် Privilege ရှိပြီး အချို့သော အတားအဆီးများကို နားလည်နိုင်သူ ဖြစ်ပါသည်။'
                : 'ဖိနှိပ်မှုနှင့် အတားအဆီးများကို ကောင်းစွာ ရင်ဆိုင်ဖြတ်သန်းနေရသူ ဖြစ်ပါသည်။')
            : (count >= 4
                ? 'You are navigating life on "Easy Mode" with high gender privilege!'
                : count >= 2
                ? 'Moderate privilege with awareness of structural social barriers.'
                : 'Facing substantial daily barriers and social friction.');

          box.innerHTML = `
            <div>
              <span class="font-bold">${isMM ? `ရမှတ်: ${toDigits(count)} / ${toDigits(checks.length)} ချက် ပြည့်စုံသည်` : `Score: ${count} of ${checks.length} items checked`}</span>
              <div class="text-xs text-pink-700 dark:text-pink-300 mt-0.5">${feedback}</div>
            </div>
            <i class="ri-sparkling-fill text-2xl text-pink-600"></i>
          `;
        }
      };

      window.updatePrivScore = updatePrivScore;
      this.updatePrivScore = updatePrivScore;

      container.querySelectorAll('.priv-check').forEach(cb => {
        cb.onchange = () => updatePrivScore();
      });
      updatePrivScore();
    },

    // --------------------------------------------------------------------------
    // 9. Zen Focus Mode (အာရုံစူးစိုက် ဖတ်ရှုခြင်းစနစ်)
    // --------------------------------------------------------------------------
    initZenFocusMode() {
      const focusBtn = document.getElementById('article-zen-focus-btn');
      if (!focusBtn) return;

      focusBtn.addEventListener('click', () => {
        const isFocus = document.body.classList.toggle('zen-focus-active');
        const lang = window.I18n ? window.I18n.getLang() : 'mm';
        
        let focusBanner = document.getElementById('zen-focus-indicator-banner');
        if (isFocus) {
          if (!focusBanner) {
            focusBanner = document.createElement('div');
            focusBanner.id = 'zen-focus-indicator-banner';
            focusBanner.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-charcoal text-white dark:bg-ivory dark:text-charcoal font-sans-ui text-xs font-semibold shadow-2xl flex items-center space-x-2 transition-all cursor-pointer';
            focusBanner.innerHTML = `
              <i class="ri-focus-2-line text-vermilion"></i>
              <span>${lang === 'mm' ? 'အာရုံစူးစိုက် ဖတ်ရှုခြင်းစနစ် ဖွင့်ထားပါသည် (ထွက်ရန် နှိပ်ပါ သို့မဟုတ် Esc)' : 'Zen Focus Mode Active (Click or Esc to exit)'}</span>
              <i class="ri-close-line text-sm opacity-70"></i>
            `;
            focusBanner.addEventListener('click', () => {
              document.body.classList.remove('zen-focus-active');
              if (focusBanner) focusBanner.remove();
            });
            document.body.appendChild(focusBanner);
          }
        } else {
          if (focusBanner) focusBanner.remove();
        }
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.body.classList.contains('zen-focus-active')) {
          document.body.classList.remove('zen-focus-active');
          const focusBanner = document.getElementById('zen-focus-indicator-banner');
          if (focusBanner) focusBanner.remove();
        }
      });
    },

    // --------------------------------------------------------------------------
    // 10. Original Language / Translation Toggle Engine
    // --------------------------------------------------------------------------
    initLangToggle() {
      const toggleBtn = document.getElementById('article-lang-toggle-btn');
      if (!toggleBtn) return;

      toggleBtn.addEventListener('click', () => {
        const siteLang = window.I18n ? window.I18n.getLang() : 'mm';
        if (siteLang !== 'mm') {
          // In foreign language: toggle between forced 'mm' (original) and default (foreign)
          this.overrideLang = (this.overrideLang === 'mm') ? null : 'mm';
        } else {
          // In Burmese: toggle between 'en' (translation) and default ('mm')
          this.overrideLang = (this.overrideLang === 'en') ? null : 'en';
        }

        this.renderArticle();

        if (window.HtetUI && typeof window.HtetUI.showToast === 'function') {
          const effectiveLang = this.overrideLang || siteLang;
          if (effectiveLang === 'mm') {
            window.HtetUI.showToast('မူရင်းမြန်မာဘာသာ စာမူသို့ ပြောင်းလဲပြသထားပါသည် ✓');
          } else {
            window.HtetUI.showToast('ဘာသာပြန်ဆိုချက်သို့ ပြောင်းလဲပြသထားပါသည် ✓');
          }
        }
      });
    },

    renderNotFound() {
      const container = document.getElementById('article-content-body');
      if (container) {
        container.innerHTML = `
          <div class="py-16 text-center">
            <span class="hanko-stamp text-xl px-4 py-2 mb-4 inline-block">မတွေ့ပါ</span>
            <h2 class="text-2xl font-serif-editorial mt-4">ဆောင်းပါး ရှာမတွေ့ပါ / Article Not Found</h2>
            <p class="text-muted mt-2">တောင်းဆိုထားသော စာမူကို မတွေ့ရှိပါ။ မူလစာမျက်နှာသို့ ပြန်လည်သွားရောက်နိုင်ပါသည်။</p>
            <a href="articles.html" class="inline-block mt-6 px-6 py-2 border border-vermilion text-vermilion rounded-lg hover:bg-vermilion hover:text-white transition-colors">
              ဆောင်းပါးများအားလုံး ပြန်ကြည့်ရန်
            </a>
          </div>
        `;
      }
    }
  };

  window.Reader = Reader;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Reader.init());
  } else {
    Reader.init();
  }
})();
