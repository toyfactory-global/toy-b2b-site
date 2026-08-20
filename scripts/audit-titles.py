import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

print(f'Total: {len(d)} products')
print()
for p in d:
    seo = p.get('seo_title', '')
    flag = 'OK' if seo else 'SIMPLE'
    print(f'{p["id"]} [{flag}] {p["name"][:55]}')
