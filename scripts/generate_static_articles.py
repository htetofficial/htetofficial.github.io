#!/usr/bin/env python3
"""
Generate Static Article Pages for all articles in data/articles.json
Creates articles/<id>.html for 100% accurate OpenGraph sharing,
Telegram Instant View compatibility, and clean static URL access.
"""

import json
import os
import re
import html

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(ROOT_DIR, 'data', 'articles.json')
TEMPLATE_FILE = os.path.join(ROOT_DIR, 'articles', 'aung-san-suu-kyi-freedom-from-fear-1990-mm.html')
ARTICLES_DIR = os.path.join(ROOT_DIR, 'articles')

def main():
    if not os.path.exists(DATA_FILE):
        print(f"Error: {DATA_FILE} not found")
        return

    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        articles = json.load(f)

    with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
        base_template = f.read()

    # Pre-calculate slice points for article-content-body
    tag_start = base_template.find('<div id="article-content-body"')
    if tag_start == -1:
        print("Error: Could not find <div id=\"article-content-body\" in template")
        return
    content_start = base_template.find('>', tag_start) + 1
    tags_marker = base_template.find('<!-- Tags -->', content_start)
    if tags_marker == -1:
        print("Error: Could not find <!-- Tags --> marker in template")
        return
    content_end = base_template.rfind('</div>', content_start, tags_marker)

    before_body_tpl = base_template[:content_start]
    after_body_tpl = base_template[content_end:]

    os.makedirs(ARTICLES_DIR, exist_ok=True)

    print(f"Generating static pages for {len(articles)} articles...")

    for a in articles:
        slug = a.get('id') or a.get('slug')
        if not slug:
            continue

        title_mm = a.get('title_mm') or 'ဆောင်းပါး'
        title_en = a.get('title_en') or ''
        author_mm = a.get('author_mm') or a.get('author') or 'ထက်မြတ်ဧကရီ'
        author_en = a.get('author_en') or 'Htet Myat Ekri'
        date_str = a.get('date', '1990-07-19')
        read_time = a.get('read_time_mm') or (str(a.get('reading_time', 5)) + ' မိနစ် ဖတ်ရှုရန်')
        excerpt = a.get('excerpt_mm') or a.get('excerpt_en') or ''
        content = a.get('content_mm') or ''
        img = a.get('image') or a.get('cover_image') or ''

        # Clean description for meta tags
        clean_desc = re.sub(r'<[^>]+>', '', excerpt).replace('"', '&quot;').replace('\n', ' ').strip()
        if not clean_desc:
            clean_desc = f"{title_mm} — ထက်မြတ်ဧကရီ (Htet Myat Ekri) ၏ သုတေသန စာတမ်း။"

        # Determine OG Image (avoid SVG for Instant View validator)
        if img:
            img_clean = img.lstrip('/')
            if img_clean.endswith('.svg'):
                base_img = img_clean[:-4]
                if os.path.exists(os.path.join(ROOT_DIR, base_img + '.jpg')):
                    og_img = f"https://htetofficial.github.io/{base_img}.jpg"
                elif os.path.exists(os.path.join(ROOT_DIR, base_img + '.png')):
                    og_img = f"https://htetofficial.github.io/{base_img}.png"
                else:
                    og_img = "https://htetofficial.github.io/assets/images/phoenix-from-ashes-cover.jpg"
            else:
                og_img = f"https://htetofficial.github.io/{img_clean}"
        else:
            og_img = "https://htetofficial.github.io/assets/images/phoenix-from-ashes-cover.jpg"

        article_url = f"https://htetofficial.github.io/articles/{slug}.html"
        full_title = f"{title_mm} — {author_mm}"

        # Customize the template head & body
        before = before_body_tpl
        after = after_body_tpl

        # Canonical & OG URL
        before = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{article_url}">', before)
        before = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{article_url}">', before)

        # Meta Article ID
        if '<meta name="article-id"' in before:
            before = re.sub(r'<meta name="article-id" content="[^"]*">', f'<meta name="article-id" content="{slug}">', before)
        else:
            before = before.replace('<meta name="robots"', f'<meta name="article-id" content="{slug}">\n  <meta name="robots"')

        # Title Tag
        before = re.sub(r'<title[^>]*>.*?</title>', f'<title data-mm="{html.escape(title_mm)}" data-en="{html.escape(title_en)}">{html.escape(full_title)}</title>', before)

        # Meta Description & OG/Twitter tags
        before = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{clean_desc}">', before)
        before = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{html.escape(title_mm)}">', before)
        before = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{clean_desc}">', before)
        before = re.sub(r'<meta property="og:image" content="[^"]*">', f'<meta property="og:image" content="{og_img}">', before)
        before = re.sub(r'<meta property="og:image:secure_url" content="[^"]*">', f'<meta property="og:image:secure_url" content="{og_img}">', before)
        before = re.sub(r'<meta property="og:image:alt" content="[^"]*">', f'<meta property="og:image:alt" content="{html.escape(title_mm)}">', before)
        before = re.sub(r'<meta property="article:published_time" content="[^"]*">', f'<meta property="article:published_time" content="{date_str}">', before)
        before = re.sub(r'<meta property="article:author" content="[^"]*">', f'<meta property="article:author" content="{html.escape(author_mm)}">', before)

        # Twitter Card
        before = re.sub(r'<meta name="twitter:title" content="[^"]*">', f'<meta name="twitter:title" content="{html.escape(title_mm)}">', before)
        before = re.sub(r'<meta name="twitter:description" content="[^"]*">', f'<meta name="twitter:description" content="{clean_desc}">', before)
        before = re.sub(r'<meta name="twitter:image" content="[^"]*">', f'<meta name="twitter:image" content="{og_img}">', before)
        before = re.sub(r'<meta name="twitter:image:alt" content="[^"]*">', f'<meta name="twitter:image:alt" content="{html.escape(title_mm)}">', before)

        # JSON-LD Schema
        jsonld_pattern = r'<script id="article-jsonld" type="application/ld\+json">.*?</script>'
        schema_data = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "ScholarlyArticle",
                    "@id": f"{article_url}#article",
                    "isPartOf": {
                        "@type": "WebSite",
                        "@id": "https://htetofficial.github.io/#website",
                        "name": "Htet Official (ထက်)",
                        "url": "https://htetofficial.github.io/"
                    },
                    "headline": title_mm,
                    "description": clean_desc,
                    "url": article_url,
                    "inLanguage": ["my", "en"],
                    "datePublished": date_str,
                    "image": og_img,
                    "author": {
                        "@type": "Person",
                        "name": author_mm,
                        "url": "https://htetofficial.github.io/about.html"
                    },
                    "publisher": {
                        "@type": "Person",
                        "name": "Htet Myat Ekri (ထက်မြတ်ဧကရီ)",
                        "url": "https://htetofficial.github.io/about.html"
                    }
                }
            ]
        }
        jsonld_str = f'<script id="article-jsonld" type="application/ld+json">\n{json.dumps(schema_data, ensure_ascii=False, indent=2)}\n  </script>'
        before = re.sub(jsonld_pattern, jsonld_str, before, flags=re.DOTALL)

        # Header Title (h1)
        before = re.sub(
            r'<h1 id="article-title"[^>]*>.*?</h1>',
            f'<h1 id="article-title" class="font-serif-editorial text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-charcoal leading-tight break-words">\n          {html.escape(title_mm)}\n        </h1>',
            before,
            flags=re.DOTALL
        )

        # Lead Excerpt
        before = re.sub(
            r'<p id="article-lead-excerpt"[^>]*>.*?</p>',
            f'<p id="article-lead-excerpt" class="text-sm sm:text-base text-muted font-sans-ui italic leading-relaxed">\n            {excerpt}\n          </p>',
            before,
            flags=re.DOTALL
        )

        # Article Date & Read Time
        before = re.sub(r'<span id="article-date">.*?</span>', f'<span id="article-date">{date_str}</span>', before)
        before = re.sub(r'<span id="article-read-time">.*?</span>', f'<span id="article-read-time">{read_time}</span>', before)

        # Featured Image
        if img:
            img_rel = f"../{img.lstrip('/')}"
            feat_img_html = f'''<div id="article-featured-image-wrapper" class="mb-10 rounded-2xl sm:rounded-3xl overflow-hidden border border-taupe-light shadow-md bg-stone-900/5 dark:bg-stone-950/70">
        <img id="article-featured-image" src="{img_rel}" alt="{html.escape(title_mm)}" class="w-full h-auto object-contain max-h-[600px] mx-auto" loading="eager" fetchpriority="high">
        <div id="article-featured-image-caption" class="py-2.5 px-4 bg-cream/80 dark:bg-stone-900/80 text-xs text-muted font-sans-ui text-center border-t border-hairline">{html.escape(title_mm)}</div>
      </div>'''
        else:
            feat_img_html = '<div id="article-featured-image-wrapper" class="hidden"></div>'

        before = re.sub(
            r'<div id="article-featured-image-wrapper"[^>]*>.*?</div>\s*</div>',
            feat_img_html,
            before,
            flags=re.DOTALL
        )

        # Pre-generated audio check
        audio_path = f"assets/audio/{slug}.mp3"
        if os.path.exists(os.path.join(ROOT_DIR, audio_path)):
            audio_html = f'<audio id="nara-pre-audio" src="../{audio_path}" preload="metadata" class="sr-only"></audio>'
        else:
            audio_html = '<audio id="nara-pre-audio" src="../assets/audio/aung-san-suu-kyi-freedom-from-fear-1990-en.mp3" preload="metadata" class="sr-only"></audio>'
        before = re.sub(r'<audio id="nara-pre-audio"[^>]*>.*?</audio>', audio_html, before)

        # Assemble full HTML
        full_page = before + "\n" + content + "\n      " + after

        # Output path
        out_path = os.path.join(ARTICLES_DIR, f"{slug}.html")
        with open(out_path, 'w', encoding='utf-8') as out_f:
            out_f.write(full_page)

    print(f"Successfully generated {len(articles)} static article pages in articles/!")

if __name__ == '__main__':
    main()
