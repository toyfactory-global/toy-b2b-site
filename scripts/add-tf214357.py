import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

new_product = {
    "id": "TF214357",
    "name": "Dinosaur Track Storage Engineering Vehicle with 227pcs Electric T-Rex Car",
    "moq": 90,
    "price": 7.57,
    "category": "Track Toys",
    "seo_title": "Dinosaur Track Storage Engineering Vehicle 227pcs Electric T-Rex Wholesale",
    "seo_description": "Dinosaur track storage engineering vehicle set with electric T-Rex car, 227 pieces including flexible DIY track, tunnels, bridges, PVC dinosaurs, houses, trees and volcano. Factory-direct wholesale from TOYFACTORY, MOQ 90 PCS.",
    "seo_keywords": "Dinosaur Track Toy, Dinosaur Storage Vehicle, Electric T-Rex Car, DIY Track Toys, Dinosaur Engineering Vehicle Wholesale, Track Toys China Factory",
    "specs": {
      "packing_size": "35.7 x 11.2 x 26.7 cm",
      "carton_size": "81 x 37.5 x 81 cm",
      "inner_qty": "Sealed Box",
      "qty_per_carton": "18 PCS",
      "gw_nw": "23.5 / 21 KG",
      "cbm": "0.246"
    },
    "images": [
      "/images/products/TF214357.webp",
      "/images/products/TF214357-2.webp",
      "/images/products/TF214357-3.webp",
      "/images/products/TF214357-4.webp",
      "/images/products/TF214357-5.webp",
      "/images/products/TF214356.webp"
    ]
}

d.append(new_product)

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print('Added TF214357. Total:', len(d))
print('Category:', d[-1]['category'], '| MOQ:', d[-1]['moq'], '| Price:', d[-1]['price'], '| sort:', d[-1].get('sort', 'none (at end)'))
