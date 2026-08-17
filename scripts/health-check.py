import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

with open('src/data/products.json', 'r') as f:
    d = json.load(f)

missing = []
for p in d:
    for img in p.get('images', []):
        path = 'public' + img
        if not os.path.exists(path):
            missing.append(f'{p["id"]}: {img} (missing)')
        elif os.path.getsize(path) == 0:
            missing.append(f'{p["id"]}: {img} (zero-byte)')

if missing:
    print('ISSUES:', len(missing))
    for m in missing[:30]:
        print(m)
else:
    print(f'ALL OK: {len(d)} products, all images exist')

# Check videos
print('\n--- VIDEOS ---')
for p in d:
    v = p.get('video')
    if v and v.startswith('/'):
        path = 'public' + v
        if not os.path.exists(path):
            print(f'MISSING VIDEO: {p["id"]}: {v}')
        else:
            size = os.path.getsize(path)
            flag = ' <25MB OK' if size < 25*1024*1024 else ' OVER 25MB!'
            print(f'{p["id"]}: {size//1024}KB{flag}')
