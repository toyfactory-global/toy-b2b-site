import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

new_product = {
    "id": "TF216208",
    "name": "Track Dinosaur Head Storage Box with 150pcs Electric Train",
    "moq": 120,
    "price": 6.42,
    "category": "Track Toys",
    "sort": 0,
    "seo_title": "Dinosaur Head Storage Box Track Set 150pcs Electric Train Wholesale",
    "seo_description": "T-Rex dinosaur head storage box track toy set with 150 pieces including electric train, flexible track, 6 dinosaur figures and palm trees. Factory-direct wholesale from TOYFACTORY, MOQ 120 PCS.",
    "seo_keywords": "Dinosaur Track Toy, Dinosaur Storage Box, Electric Train Track Set, T-Rex Storage Case Toy, Track Toys Wholesale China, Dinosaur World Playset",
    "specs": {
      "packing_size": "31.5 x 20.5 x 19.5 cm",
      "carton_size": "96 x 42 x 81 cm",
      "inner_qty": "Display Box",
      "qty_per_carton": "24 PCS",
      "gw_nw": "21 / 18 KG",
      "cbm": "0.327"
    },
    "images": [
      "/images/products/TF216208.webp",
      "/images/products/TF216208-1.webp",
      "/images/products/TF216208-2.webp",
      "/images/products/TF216208-3.webp",
      "/images/products/TF216208-4.webp",
      "/images/products/TF216208-5.webp"
    ]
}

d.append(new_product)

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print('Added TF216208. Total:', len(d))
print('Category:', d[-1]['category'], '| MOQ:', d[-1]['moq'], '| Price:', d[-1]['price'])
