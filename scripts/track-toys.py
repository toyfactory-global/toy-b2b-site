import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')
with open('src/data/products.json', 'r') as f:
    d = json.load(f)
tt = [p for p in d if p['category'] == 'Track Toys']
print(f'Track Toys: {len(tt)}')
for p in tt:
    print(f'{p["id"]}: {p["name"][:55]} | MOQ={p["moq"]} | ${p["price"]}')
