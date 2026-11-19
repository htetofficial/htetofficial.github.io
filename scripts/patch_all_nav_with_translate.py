# -*- coding: utf-8 -*-
import glob, re

files = ['index.html', 'articles.html', 'publications.html', 'journal.html', 'glossary.html', 'about.html', 'contact.html', 'article.html']

desktop_link = '<a href="translate.html" class="nav-link-pill px-2.5 2xl:px-3 py-1 2xl:py-1.5 rounded-full text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/80 dark:hover:bg-stone-800/80 font-medium transition-all" data-mm="ဘာသာပြန်" data-en="Translate" data-zh="智能翻译" data-th="แปลภาษา" data-ja="翻訳">ဘာသာပြန်</a>'

drawer_link = '''        <a href="translate.html" class="drawer-nav-item flex items-center justify-between px-3 py-2.5 rounded-2xl font-medium transition-all text-charcoal/80 dark:text-[#D1C9BE] hover:text-vermilion hover:bg-cream/70 dark:hover:bg-stone-800/60 group">
          <span class="flex items-center space-x-2.5 min-w-0">
            <span class="w-7 h-7 rounded-lg bg-cream dark:bg-stone-800/80 border border-hairline/70 flex items-center justify-center text-muted group-hover:text-vermilion group-hover:bg-vermilion/10 transition-colors shrink-0">
              <i class="ri-translate-2 text-sm"></i>
            </span>
            <span class="whitespace-nowrap text-[13px]" data-mm="ဘာသာပြန်စတူဒီယို" data-en="Translate">ဘာသာပြန်စတူဒီယို</span>
          </span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-cream dark:bg-stone-800 text-muted font-mono font-bold shrink-0">Neural</span>
        </a>'''

footer_link = '          <li><a href="translate.html" class="hover:text-vermilion transition-colors flex items-center space-x-2 group" data-mm="ဘာသာပြန်" data-en="Translate"><i class="ri-translate-2 text-vermilion/70 group-hover:text-vermilion group-hover:translate-x-0.5 transition-all"></i> <span>ဘာသာပြန်စတူဒီယို</span></a></li>'

for fn in files:
    with open(fn, 'r', encoding='utf-8') as f:
        c = f.read()
    
    if 'href="translate.html"' in c:
        print(f'{fn} already has translate.html')
        continue

    # Desktop nav injection
    dict_pattern = r'(<a href="dictionary\.html"[^>]*>.*?</a>)'
    if re.search(dict_pattern, c):
        # Insert desktop link right after dictionary link in nav capsule
        c = re.sub(dict_pattern, r'\1\n          ' + desktop_link, c, count=1)

    # Drawer nav injection
    drawer_dict_pattern = r'(<a href="dictionary\.html" class="drawer-nav-item[^>]*>.*?</a>)'
    if re.search(drawer_dict_pattern, c, re.DOTALL):
        c = re.sub(drawer_dict_pattern, r'\1\n\n' + drawer_link, c, count=1, flags=re.DOTALL)

    # Footer injection
    footer_dict_pattern = r'(<li><a href="dictionary\.html"[^>]*>.*?</a></li>)'
    if re.search(footer_dict_pattern, c):
        c = re.sub(footer_dict_pattern, r'\1\n' + footer_link, c, count=1)

    with open(fn, 'w', encoding='utf-8') as f:
        f.write(c)
    print(f'Patched navigation in {fn}')

