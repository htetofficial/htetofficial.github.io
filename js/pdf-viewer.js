/**
 * Htet Official - Mozilla PDF.js & Native Hybrid In-Browser Interactive Viewer Engine
 * Robust offline-first reader supporting both HTML5 Canvas (PDF.js) and Native Embed/Iframe
 * 100% compatible with file://, localhost, PWA, and HTTPS.
 */
(function() {
  'use strict';

  // Configure PDF.js worker if available
  if (window.pdfjsLib) {
    try {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf/pdf.worker.min.js';
    } catch(e) {}
  }

  var pdfState = {
    pdfDoc: null,
    pageNum: 1,
    pageRendering: false,
    pageNumPending: null,
    scale: 1.25,
    pdfUrl: '',
    pdfTitle: '',
    rotation: 0,
    mode: 'canvas' // 'canvas' or 'native'
  };

  var viewerElements = null;

  function initViewerElements() {
    if (viewerElements) return viewerElements;

    var modal = document.getElementById('pdf-reader-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'pdf-reader-modal';
      modal.className = 'fixed inset-0 z-50 hidden flex flex-col bg-charcoal/95 backdrop-blur-md text-white transition-opacity duration-300';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'PDF Reader');

      modal.innerHTML = `
        <!-- Top Toolbar -->
        <header class="flex items-center justify-between px-3 sm:px-6 py-2.5 bg-stone-900/95 border-b border-white/10 shrink-0 select-none">
          <div class="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-vermilion/20 text-vermilion text-sm font-bold shrink-0">
              <i class="ri-file-pdf-2-line"></i>
            </span>
            <div class="truncate">
              <h3 id="pdf-viewer-title" class="text-xs sm:text-sm font-semibold truncate text-white/90">စာတမ်းဖတ်ရှုခန်း</h3>
              <p id="pdf-viewer-subtitle" class="text-[10px] text-white/50 truncate font-mono">PDF Interactive Viewer Engine</p>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center space-x-1 sm:space-x-2">
            <!-- Zoom Controls (Canvas Mode) -->
            <div id="pdf-zoom-controls" class="hidden sm:flex items-center bg-stone-800/80 rounded-lg p-0.5 border border-white/10 text-xs">
              <button id="pdf-zoom-out" class="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded text-white/80 hover:text-white" title="Zoom Out (-)">
                <i class="ri-zoom-out-line"></i>
              </button>
              <span id="pdf-zoom-val" class="px-2 font-mono text-[11px] text-white/70 min-w-[42px] text-center">125%</span>
              <button id="pdf-zoom-in" class="w-7 h-7 flex items-center justify-center hover:bg-white/10 rounded text-white/80 hover:text-white" title="Zoom In (+)">
                <i class="ri-zoom-in-line"></i>
              </button>
              <button id="pdf-zoom-fit" class="px-2 h-7 flex items-center justify-center hover:bg-white/10 rounded text-[10px] font-mono text-white/70 hover:text-white" title="Fit Page Width">
                FIT
              </button>
            </div>

            <!-- Open in New Tab Button -->
            <a id="pdf-newtab-btn" href="#" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1.5 bg-stone-800/80 hover:bg-white/20 rounded-lg border border-white/10 text-white/80 hover:text-white text-xs flex items-center space-x-1 transition-colors" title="Tab အသစ်တွင် ဖွင့်ဖတ်ရှုရန်">
              <i class="ri-external-link-line"></i>
              <span class="hidden sm:inline">Tab အသစ်</span>
            </a>

            <!-- Download Button -->
            <a id="pdf-download-btn" href="#" download class="w-8 h-8 flex items-center justify-center bg-stone-800/80 hover:bg-vermilion rounded-lg border border-white/10 text-white/80 hover:text-white text-sm transition-colors" title="မူရင်း PDF ဒေါင်းလုဒ်ရယူရန်">
              <i class="ri-download-2-line"></i>
            </a>

            <!-- Fullscreen Button -->
            <button id="pdf-fullscreen-btn" class="hidden md:flex w-8 h-8 items-center justify-center bg-stone-800/80 hover:bg-white/20 rounded-lg border border-white/10 text-white/80 hover:text-white text-sm transition-colors" title="မျက်နှာပြင်ပြည့် (Fullscreen)">
              <i class="ri-fullscreen-line"></i>
            </button>

            <!-- Close Button -->
            <button id="pdf-close-btn" class="w-8 h-8 flex items-center justify-center bg-stone-800/80 hover:bg-red-600 rounded-lg border border-white/10 text-white/80 hover:text-white text-sm transition-colors cursor-pointer" title="ပိတ်ရန် (Esc)" aria-label="Close Viewer">
              <i class="ri-close-line text-lg"></i>
            </button>
          </div>
        </header>

        <!-- Body Viewport Container -->
        <div id="pdf-viewport-container" class="flex-1 overflow-auto p-2 sm:p-4 flex items-center justify-center relative bg-stone-950/80">
          <div id="pdf-loading-spinner" class="absolute inset-0 flex flex-col items-center justify-center bg-stone-950/70 z-10 transition-opacity">
            <div class="w-10 h-10 border-3 border-vermilion border-t-transparent rounded-full animate-spin mb-3"></div>
            <p class="text-xs text-white/70 font-mono tracking-wider">PDF စာတမ်းအား ဖွင့်လှစ်နေပါသည်...</p>
          </div>
          
          <!-- Mode A: Canvas Wrapper (PDF.js) -->
          <div id="pdf-canvas-wrapper" class="relative shadow-2xl rounded bg-white hidden">
            <canvas id="pdf-canvas" class="block rounded"></canvas>
          </div>

          <!-- Mode B: Native Embed Frame (file:// & universal fallback) -->
          <iframe id="pdf-native-frame" class="w-full h-full min-h-[82vh] rounded-2xl border-0 shadow-2xl bg-white hidden" title="PDF Document Viewer"></iframe>
        </div>

        <!-- Floating Bottom Navigator Capsule (Canvas Mode) -->
        <footer id="pdf-bottom-nav" class="flex items-center justify-between px-4 sm:px-8 py-2 bg-stone-900/90 border-t border-white/10 shrink-0 select-none">
          <div class="flex items-center space-x-1.5 sm:space-x-3 text-xs">
            <button id="pdf-prev-page" class="px-2.5 py-1 bg-stone-800 hover:bg-white/10 rounded-lg border border-white/10 flex items-center space-x-1 transition-colors disabled:opacity-30 disabled:pointer-events-none">
              <i class="ri-arrow-left-s-line"></i>
              <span class="hidden sm:inline">ရှေ့စာမျက်နှာ</span>
            </button>

            <div class="flex items-center space-x-1 font-mono text-xs text-white/80 px-2 py-0.5 rounded bg-black/40 border border-white/5">
              <span>စာမျက်နှာ</span>
              <input id="pdf-page-num" type="number" min="1" value="1" class="w-10 bg-transparent text-center text-vermilion font-bold focus:outline-none focus:ring-1 focus:ring-vermilion rounded">
              <span>/</span>
              <span id="pdf-page-count" class="text-white/60">0</span>
            </div>

            <button id="pdf-next-page" class="px-2.5 py-1 bg-stone-800 hover:bg-white/10 rounded-lg border border-white/10 flex items-center space-x-1 transition-colors disabled:opacity-30 disabled:pointer-events-none">
              <span class="hidden sm:inline">နောက်စာမျက်နှာ</span>
              <i class="ri-arrow-right-s-line"></i>
            </button>
          </div>

          <div class="text-[11px] text-white/50 font-mono hidden sm:flex items-center space-x-3">
            <span>အတိုးအလျော့: <kbd class="px-1.5 py-0.5 rounded bg-stone-800 text-white/70">+</kbd> / <kbd class="px-1.5 py-0.5 rounded bg-stone-800 text-white/70">-</kbd></span>
            <span>စာမျက်နှာကူးရန်: <kbd class="px-1.5 py-0.5 rounded bg-stone-800 text-white/70">←</kbd> / <kbd class="px-1.5 py-0.5 rounded bg-stone-800 text-white/70">→</kbd></span>
          </div>
        </footer>
      `;
      document.body.appendChild(modal);
    }

    viewerElements = {
      modal: modal,
      title: document.getElementById('pdf-viewer-title'),
      subtitle: document.getElementById('pdf-viewer-subtitle'),
      newtabBtn: document.getElementById('pdf-newtab-btn'),
      downloadBtn: document.getElementById('pdf-download-btn'),
      closeBtn: document.getElementById('pdf-close-btn'),
      zoomControls: document.getElementById('pdf-zoom-controls'),
      zoomInBtn: document.getElementById('pdf-zoom-in'),
      zoomOutBtn: document.getElementById('pdf-zoom-out'),
      zoomFitBtn: document.getElementById('pdf-zoom-fit'),
      zoomVal: document.getElementById('pdf-zoom-val'),
      fullscreenBtn: document.getElementById('pdf-fullscreen-btn'),
      viewportContainer: document.getElementById('pdf-viewport-container'),
      spinner: document.getElementById('pdf-loading-spinner'),
      canvasWrapper: document.getElementById('pdf-canvas-wrapper'),
      canvas: document.getElementById('pdf-canvas'),
      nativeFrame: document.getElementById('pdf-native-frame'),
      bottomNav: document.getElementById('pdf-bottom-nav'),
      prevBtn: document.getElementById('pdf-prev-page'),
      nextBtn: document.getElementById('pdf-next-page'),
      pageNumInput: document.getElementById('pdf-page-num'),
      pageCountSpan: document.getElementById('pdf-page-count')
    };

    attachViewerEvents();
    return viewerElements;
  }

  function renderPage(num) {
    if (!pdfState.pdfDoc) return;
    pdfState.pageRendering = true;
    var els = initViewerElements();
    els.spinner.style.display = 'flex';
    els.spinner.style.opacity = '1';

    pdfState.pdfDoc.getPage(num).then(function(page) {
      var viewport = page.getViewport({ scale: pdfState.scale, rotation: pdfState.rotation });
      var canvas = els.canvas;
      var ctx = canvas.getContext('2d');

      var dpr = window.devicePixelRatio || 1;
      canvas.height = viewport.height * dpr;
      canvas.width = viewport.width * dpr;
      canvas.style.height = viewport.height + 'px';
      canvas.style.width = viewport.width + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      var renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };
      var renderTask = page.render(renderContext);

      renderTask.promise.then(function() {
        pdfState.pageRendering = false;
        els.spinner.style.opacity = '0';
        setTimeout(function() { els.spinner.style.display = 'none'; }, 200);

        if (pdfState.pageNumPending !== null) {
          renderPage(pdfState.pageNumPending);
          pdfState.pageNumPending = null;
        }
      }).catch(function(err) {
        pdfState.pageRendering = false;
        els.spinner.style.display = 'none';
        console.error('Error rendering page:', err);
      });
    });

    els.pageNumInput.value = num;
    els.prevBtn.disabled = (num <= 1);
    els.nextBtn.disabled = (num >= (pdfState.pdfDoc ? pdfState.pdfDoc.numPages : 1));
    els.zoomVal.textContent = Math.round(pdfState.scale * 100) + '%';
  }

  function queueRenderPage(num) {
    if (pdfState.pageRendering) {
      pdfState.pageNumPending = num;
    } else {
      renderPage(num);
    }
  }

  function onPrevPage() {
    if (pdfState.pageNum <= 1) return;
    pdfState.pageNum--;
    queueRenderPage(pdfState.pageNum);
  }

  function onNextPage() {
    if (!pdfState.pdfDoc || pdfState.pageNum >= pdfState.pdfDoc.numPages) return;
    pdfState.pageNum++;
    queueRenderPage(pdfState.pageNum);
  }

  function zoomIn() {
    if (pdfState.scale >= 3.0) return;
    pdfState.scale = Math.min(3.0, +(pdfState.scale + 0.2).toFixed(2));
    queueRenderPage(pdfState.pageNum);
  }

  function zoomOut() {
    if (pdfState.scale <= 0.6) return;
    pdfState.scale = Math.max(0.6, +(pdfState.scale - 0.2).toFixed(2));
    queueRenderPage(pdfState.pageNum);
  }

  function zoomFit() {
    var els = initViewerElements();
    var containerWidth = els.viewportContainer.clientWidth - 48;
    if (pdfState.pdfDoc) {
      pdfState.pdfDoc.getPage(pdfState.pageNum).then(function(page) {
        var baseViewport = page.getViewport({ scale: 1.0 });
        pdfState.scale = Math.max(0.6, Math.min(2.5, +(containerWidth / baseViewport.width).toFixed(2)));
        queueRenderPage(pdfState.pageNum);
      });
    }
  }

  function closeViewer() {
    var els = initViewerElements();
    els.modal.classList.add('hidden');
    document.body.style.overflow = '';
    if (els.nativeFrame) {
      els.nativeFrame.src = 'about:blank';
      els.nativeFrame.classList.add('hidden');
    }
    if (els.canvasWrapper) {
      els.canvasWrapper.classList.add('hidden');
    }
  }

  /**
   * Render using Native Frame (immune to file:// CORS restrictions)
   */
  function renderNativeMode(url, title) {
    var els = initViewerElements();
    pdfState.mode = 'native';

    if (els.canvasWrapper) els.canvasWrapper.classList.add('hidden');
    if (els.zoomControls) els.zoomControls.classList.add('hidden');
    if (els.bottomNav) els.bottomNav.classList.add('hidden');

    if (els.nativeFrame) {
      els.nativeFrame.classList.remove('hidden');
      els.nativeFrame.src = url;
      els.nativeFrame.title = title || 'PDF Reader';
    }

    els.spinner.style.opacity = '0';
    setTimeout(function() {
      if (els.spinner) els.spinner.style.display = 'none';
    }, 300);
  }

  /**
   * Render using Mozilla PDF.js Canvas
   */
  function renderCanvasMode(url) {
    var els = initViewerElements();
    pdfState.mode = 'canvas';

    if (els.nativeFrame) els.nativeFrame.classList.add('hidden');
    if (els.canvasWrapper) els.canvasWrapper.classList.remove('hidden');
    if (els.zoomControls) els.zoomControls.classList.remove('hidden');
    if (els.bottomNav) els.bottomNav.classList.remove('hidden');

    window.pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
      pdfState.pdfDoc = pdfDoc_;
      els.pageCountSpan.textContent = pdfDoc_.numPages;
      els.pageNumInput.max = pdfDoc_.numPages;
      renderPage(pdfState.pageNum);
    }).catch(function(err) {
      console.warn('PDF.js canvas failed, falling back to Native Embed Frame:', err);
      renderNativeMode(url, pdfState.pdfTitle);
    });
  }

  function openPdf(url, title, subtitle) {
    var els = initViewerElements();
    pdfState.pdfUrl = url;
    pdfState.pdfTitle = title || url.split('/').pop().replace(/\.pdf$/i, '').replace(/-/g, ' ');
    pdfState.pageNum = 1;
    pdfState.scale = (window.innerWidth < 640) ? 0.85 : 1.25;

    els.title.textContent = pdfState.pdfTitle;
    els.subtitle.textContent = subtitle || url;
    if (els.newtabBtn) els.newtabBtn.href = url;
    if (els.downloadBtn) els.downloadBtn.href = url;
    els.modal.classList.remove('hidden');
    els.spinner.style.display = 'flex';
    els.spinner.style.opacity = '1';
    document.body.style.overflow = 'hidden';

    // Check environment: file:// protocol triggers CORS block on XHR/fetch in PDF.js
    var isFileProtocol = (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:');

    if (isFileProtocol || !window.pdfjsLib) {
      renderNativeMode(url, pdfState.pdfTitle);
    } else {
      renderCanvasMode(url);
    }
  }

  function attachViewerEvents() {
    var els = viewerElements;
    if (!els) return;
    if (els.closeBtn) els.closeBtn.addEventListener('click', closeViewer);
    if (els.prevBtn) els.prevBtn.addEventListener('click', onPrevPage);
    if (els.nextBtn) els.nextBtn.addEventListener('click', onNextPage);
    if (els.zoomInBtn) els.zoomInBtn.addEventListener('click', zoomIn);
    if (els.zoomOutBtn) els.zoomOutBtn.addEventListener('click', zoomOut);
    if (els.zoomFitBtn) els.zoomFitBtn.addEventListener('click', zoomFit);

    if (els.pageNumInput) els.pageNumInput.addEventListener('change', function() {
      var val = parseInt(els.pageNumInput.value, 10);
      if (val >= 1 && val <= (pdfState.pdfDoc ? pdfState.pdfDoc.numPages : 1)) {
        pdfState.pageNum = val;
        queueRenderPage(pdfState.pageNum);
      } else {
        els.pageNumInput.value = pdfState.pageNum;
      }
    });

    if (els.fullscreenBtn) {
      els.fullscreenBtn.addEventListener('click', function() {
        if (!document.fullscreenElement) {
          els.modal.requestFullscreen().catch(function(){});
        } else {
          document.exitFullscreen().catch(function(){});
        }
      });
    }

    // Keyboard shortcuts
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('keydown', function(e) {
        if (!els || !els.modal || els.modal.classList.contains('hidden')) return;

        if (e.key === 'Escape') {
          closeViewer();
        } else if (pdfState.mode === 'canvas') {
          if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            onPrevPage();
          } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            onNextPage();
          } else if (e.key === '+' || e.key === '=') {
            zoomIn();
          } else if (e.key === '-') {
            zoomOut();
          }
        }
      });
    }

    // Delegate click on any [data-open-pdf]
    if (typeof document !== 'undefined' && document.addEventListener) {
      document.addEventListener('click', function(e) {
        var trigger = e.target.closest('[data-open-pdf]');
        if (trigger) {
          e.preventDefault();
          var url = trigger.getAttribute('data-open-pdf');
          var title = trigger.getAttribute('data-pdf-title') || trigger.innerText;
          var sub = trigger.getAttribute('data-pdf-sub') || url;
          openPdf(url, title, sub);
        }
      });
    }
  }

  // Export to window
  window.HtetPDFViewer = {
    open: openPdf,
    close: closeViewer
  };

  // Auto initialize on DOM ready
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initViewerElements);
    } else {
      initViewerElements();
    }
  }
})();
