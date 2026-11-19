/**
 * Htet Official — Cloudflare Worker Edge Engine
 * Features:
 * 1. Edge Dynamic OpenGraph & Meta Injection for Telegram, Facebook, Twitter & Social Crawlers
 * 2. High-Speed Cloudflare R2 Asset Streaming (Range Requests, Audio, 0 Egress Cost)
 * 3. Telegram Mini App Acceleration & CORS Handler
 * 4. 100% Cloudflare Free Tier Compatible (100,000 requests/day free)
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

    // 1. Detect Social Media Bots & Crawlers (Telegram, Facebook, WhatsApp, etc.)
    const isBot = /telegrambot|twitterbot|facebookexternalhit|whatsapp|meta-externalagent|slackbot|discordbot|linkedinbot|viber/i.test(userAgent);

    // 2. Dynamic Open Graph & Meta Rewrite for Article Sharing
    if (url.pathname === '/article.html' && url.searchParams.has('id')) {
      const articleId = url.searchParams.get('id');

      // Fetch base article.html from Static Assets
      let response;
      if (env.ASSETS) {
        response = await env.ASSETS.fetch(request);
      } else {
        response = await fetch(request);
      }

      // If it's a social bot (or instant view crawler), inject dynamic meta tags
      if (isBot && response.ok) {
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
              status: response.status,
              headers: {
                'content-type': 'text/html; charset=utf-8',
                'cache-control': 'public, max-age=3600, s-maxage=86400',
                'access-control-allow-origin': '*'
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
      // Ensure CORS for Telegram Mini App
      if (resp.ok && (url.pathname.endsWith('.json') || url.pathname.endsWith('.txt'))) {
        const newH = new Headers(resp.headers);
        newH.set('access-control-allow-origin', '*');
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
