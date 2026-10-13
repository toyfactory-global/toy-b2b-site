import re, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

files = ['dist/product/TF216208/index.html', 'dist/blog/index.html', 'dist/index.html', 'dist/category/water-guns/index.html']

for f in files:
    if not os.path.exists(f):
        print(f, '-> NOT FOUND')
        continue
    with open(f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    canon = re.search(r'<link rel="canonical" href="([^"]+)"', c)
    ogurls = re.findall(r'og:url" content="([^"]+)"', c)
    print(f)
    print('  canonical:', canon.group(1) if canon else 'MISSING')
    print('  og:url   :', ogurls)
