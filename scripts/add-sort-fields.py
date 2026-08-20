import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

# New products get sort=0 (show first). Order among them preserved by insertion.
new_ids = ['TF216414', 'TF199679', 'TF211492', 'TF214001']
for p in d:
    if p['id'] in new_ids and 'sort' not in p:
        p['sort'] = 0
        print('Added sort=0 to', p['id'])

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)
print('Done')
