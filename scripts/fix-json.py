import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

with open('src/data/products.json', 'r', encoding='utf-8-sig') as f:
    c = f.read()

# Fix corrupted escaped quotes
c = c.replace('.webp\\"', '.webp"')

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    f.write(c)

import json
with open('src/data/products.json', 'r') as f:
    d = json.load(f)
imgs = [i for p in d for i in p.get('images', [])]
webp_count = sum(1 for i in imgs if i.endswith('.webp'))
print(f'OK: {len(d)} products, {webp_count} webp refs')
print(f'Sample: {d[0]["images"][0]}')
