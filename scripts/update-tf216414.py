import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for p in d:
    if p['id'] == 'TF216414':
        p['specs'] = {
            "packing_size": "13.5 x 13.5 x 16.7 cm",
            "carton_size": "84.5 x 43 x 70 cm",
            "inner_qty": "Sealed Box",
            "qty_per_carton": "72 PCS",
            "gw_nw": "29.4 / 27.8 KG",
            "cbm": "0.254"
        }
        p['images'].append("/images/products/TF216414-6.webp")
        print('Updated TF216414 specs + 6th image')
        break

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print('Images:', d[[p['id'] for p in d].index('TF216414')]['images'])
