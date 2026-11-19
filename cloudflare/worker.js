/**
 * Htet Official — Cloudflare Worker Edge Engine
 * Features:
 * 1. Edge Dynamic OpenGraph & Meta Injection for Telegram, Facebook, Twitter & Social Crawlers
 * 2. High-Speed Cloudflare R2 Asset Streaming (Range Requests, Audio, 0 Egress Cost)
 * 3. Telegram Mini App Acceleration & CORS Handler
 * 4. 100% Cloudflare Free Tier Compatible (100,000 requests/day free)
 */

const SECURITY_CSP = [
  "default-src 'self'",
  "script-src 'self' https://telegram.org 'wasm-unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self' https://web.htetofficial.workers.dev https://app.htetofficial.workers.dev https://htetofficialgithubio.vercel.app https://api.mymemory.translated.net https://libretranslate.com https://translate.googleapis.com https://huggingface.co https://*.telegram.org",
  "media-src 'self' data: blob: https://web.htetofficial.workers.dev https://app.htetofficial.workers.dev",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self' https://web.telegram.org https://*.telegram.org https://telegram.org",
  "frame-src 'self' https://drive.google.com https://www.youtube.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "form-action 'self'"
].join('; ');

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

    // 1. Detect Social Media Bots & Crawlers (Telegram, Facebook, WhatsApp, etc.)
    const isBot = /telegrambot|twitterbot|facebookexternalhit|whatsapp|meta-externalagent|slackbot|discordbot|linkedinbot|viber/i.test(userAgent);

    // 2. Dynamic Open Graph & Meta Rewrite for Article Sharing
    if ((url.pathname === '/article.html' || url.pathname === '/article') && url.searchParams.has('id')) {
      const articleId = url.searchParams.get('id');

      // Fetch base article.html from Static Assets
      let response;
      const articleReq = new Request(new URL('/article.html', url), { headers: request.headers });
      if (env.ASSETS) {
        response = await env.ASSETS.fetch(articleReq);
      } else {
        response = await fetch(articleReq);
      }

      // If it's a social bot (or instant view crawler), inject dynamic meta tags
      if (isBot && response) {
        let articlesData = null;
        try {
          if (env.CDN_BUCKET) {
            const obj = await env.CDN_BUCKET.get('data/articles.json');
            if (obj) {
              articlesData = await obj.json();
            }
          }
          if (!articlesData && env.ASSETS) {
            const artResp = await env.ASSETS.fetch(new Request(new URL('/data/articles.json', url)));
            if (artResp.ok) articlesData = await artResp.json();
          }
        } catch (e) {
          console.error('Error fetching articles.json at edge:', e);
        }

        if (Array.isArray(articlesData)) {
          const article = articlesData.find(a => (a.id === articleId || a.slug === articleId));
          if (article) {
            const title = (article.title_mm || article.title_en || 'စာတမ်း') + ' — ထက် (Htet Official)';
            const excerpt = (article.excerpt_mm || article.excerpt_en || '').replace(/[\r\n]+/g, ' ').trim();
            const rawImg = article.image || article.cover_image || 'assets/images/phoenix-from-ashes-cover.jpg';
            const imageUrl = rawImg.startsWith('http') ? rawImg : `${url.origin}/${rawImg.replace(/^\//, '')}`;
            const canonicalUrl = `${url.origin}/article.html?id=${encodeURIComponent(articleId)}`;

            let html = await response.text();

            // Replace Title
            html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

            // Replace Canonical
            html = html.replace(/<link rel="canonical" href="[^"]*">/i, `<link rel="canonical" href="${canonicalUrl}">`);

            // Replace OpenGraph meta tags
            html = html.replace(/<meta property="og:title" content="[^"]*">/i, `<meta property="og:title" content="${escapeAttr(title)}">`);
            html = html.replace(/<meta property="og:description" content="[^"]*">/i, `<meta property="og:description" content="${escapeAttr(excerpt)}">`);
            html = html.replace(/<meta property="og:image" content="[^"]*">/i, `<meta property="og:image" content="${imageUrl}">`);
            html = html.replace(/<meta property="og:image:secure_url" content="[^"]*">/i, `<meta property="og:image:secure_url" content="${imageUrl}">`);
            html = html.replace(/<meta property="og:url" content="[^"]*">/i, `<meta property="og:url" content="${canonicalUrl}">`);

            // Replace Twitter Card meta tags
            html = html.replace(/<meta name="twitter:title" content="[^"]*">/i, `<meta name="twitter:title" content="${escapeAttr(title)}">`);
            html = html.replace(/<meta name="twitter:description" content="[^"]*">/i, `<meta name="twitter:description" content="${escapeAttr(excerpt)}">`);
            html = html.replace(/<meta name="twitter:image" content="[^"]*">/i, `<meta name="twitter:image" content="${imageUrl}">`);

            return new Response(html, {
              status: 200,
              headers: {
                'content-type': 'text/html; charset=utf-8',
                'cache-control': 'public, max-age=3600, s-maxage=86400',
                'access-control-allow-origin': '*',
                'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
                'x-content-type-options': 'nosniff',
                'cross-origin-opener-policy': 'same-origin-allow-popups',
                'referrer-policy': 'strict-origin-when-cross-origin',
                'permissions-policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                'content-security-policy': SECURITY_CSP,
                'x-edge-worker': 'active-og-injected'
              }
            });
          }
        }
      }

      return response;
    }

    // 3. Cloudflare R2 Streaming for Heavy Downloads & Media
    const r2Prefixes = ['/downloads/', '/assets/images/', '/Htet_Official_Research_Bundle.zip'];
    const matchesR2 = r2Prefixes.some(prefix => url.pathname.startsWith(prefix) || url.pathname === prefix);

    if (matchesR2 && env.CDN_BUCKET) {
      const key = url.pathname.replace(/^\//, '');
      try {
        const obj = await env.CDN_BUCKET.get(key, {
          range: request.headers,
          onlyIf: request.headers
        });

        if (obj) {
          const headers = new Headers();
          obj.writeHttpMetadata(headers);
          headers.set('etag', obj.httpEtag);
          headers.set('access-control-allow-origin', '*');
          headers.set('cache-control', 'public, max-age=31536000, immutable');

          if (request.headers.has('range')) {
            headers.set('accept-ranges', 'bytes');
          }

          const status = obj.body ? (request.headers.has('range') ? 206 : 200) : 304;
          return new Response(obj.body, { status, headers });
        }
      } catch (e) {
        console.warn('R2 direct lookup fallback to static assets:', e);
      }
    }

    // 4. Default Static Asset Serving via Cloudflare Pages / Workers Assets
    if (env.ASSETS) {
      const resp = await env.ASSETS.fetch(request);
      if (resp.ok) {
        const newH = new Headers(resp.headers);
        newH.set('strict-transport-security', 'max-age=63072000; includeSubDomains; preload');
        newH.set('x-content-type-options', 'nosniff');
        newH.set('cross-origin-opener-policy', 'same-origin-allow-popups');
        newH.set('referrer-policy', 'strict-origin-when-cross-origin');
        newH.set('permissions-policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

        // Ensure proper charset on HTML responses to satisfy character encoding audits
        const ct = newH.get('content-type');
        if (ct && ct.includes('text/html') && !ct.includes('charset')) {
          newH.set('content-type', 'text/html; charset=utf-8');
        } else if (!ct && (url.pathname === '/' || url.pathname.endsWith('.html'))) {
          newH.set('content-type', 'text/html; charset=utf-8');
        }

        // Apply comprehensive CSP header with strict clickjacking mitigation & Telegram Mini App support
        newH.set('content-security-policy', SECURITY_CSP);

        // Ensure CORS for Telegram Mini App & API requests
        if (url.pathname.endsWith('.json') || url.pathname.endsWith('.txt') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
          newH.set('access-control-allow-origin', '*');
        }

        // Optimize Cache Lifetimes for Static Edge Delivery
        if (url.pathname === '/sw.js' || url.pathname === '/js/theme-init.js') {
          newH.set('cache-control', 'public, max-age=0, must-revalidate');
        } else if (/\.(woff2?|ttf|otf|eot|svg|png|jpe?g|webp|gif|ico|css|js)$/i.test(url.pathname)) {
          newH.set('cache-control', 'public, max-age=31536000, immutable');
        } else if (url.pathname.endsWith('.json')) {
          newH.set('cache-control', 'public, max-age=3600, stale-while-revalidate=86400');
        }
        return new Response(resp.body, { status: resp.status, headers: newH });
      }
      return resp;
    }

    return fetch(request);
  }
};

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
