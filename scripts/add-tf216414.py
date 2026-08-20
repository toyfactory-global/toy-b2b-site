import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

new_product = {
    "id": "TF216414",
    "name": "Dinosaur Egg Bubble Machine with Lights & Music (3 Colors)",
    "moq": 216,
    "price": 2.65,
    "category": "Bubble Toys",
    "seo_title": "Dinosaur Egg Bubble Machine with Lights Music Wholesale",
    "seo_description": "Dinosaur egg bubble machine with 6-hole bubbling, dynamic music and cool lights. Mini prehistoric scene inside. Factory-direct wholesale from TOYFACTORY, MOQ 216 PCS.",
    "seo_keywords": "Dinosaur Egg Bubble Machine, Bubble Machine with Lights Music, Dinosaur Toy Bubble Wholesale, Electric Bubble Machine China, Egg Bubble Toy Factory",
    "specs": {
      "packing_size": "20.8 x 14.8 x 14.3 cm",
      "carton_size": "",
      "inner_qty": "Colour Box",
      "qty_per_carton": "",
      "gw_nw": "",
      "cbm": ""
    },
    "images": [
      "/images/products/TF216414-1.webp",
      "/images/products/TF216414-2.webp",
      "/images/products/TF216414-3.webp",
      "/images/products/TF216414-4.webp",
      "/images/products/TF216414-5.webp"
    ]
}

d.append(new_product)

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print('Added TF216414. Total:', len(d))
print('Category:', d[-1]['category'], '| MOQ:', d[-1]['moq'], '| Price:', d[-1]['price'])
