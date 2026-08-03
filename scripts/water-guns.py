import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')
with open('src/data/products.json', 'r') as f:
    d = json.load(f)
wg = [p for p in d if p['category'] == 'Water Guns']
print(f'Water Guns: {len(wg)}')
for p in wg:
    print(f'{p["id"]}: {p["name"][:60]} | MOQ={p["moq"]} | ${p["price"]}')
