import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

for p in d:
    if p['id'] == 'TF214357':
        p['name'] = "Dinosaur Track Storage Engineering Vehicle with 231pcs Electric Train"
        p['seo_title'] = "Dinosaur Track Storage Engineering Vehicle 231pcs Electric Train Wholesale"
        p['seo_description'] = "Dinosaur track storage engineering vehicle set with electric train, 231 pieces including flexible DIY track, tunnels, bridges, PVC dinosaurs, houses, trees and volcano. Factory-direct wholesale from TOYFACTORY, MOQ 90 PCS."
        p['seo_keywords'] = "Dinosaur Track Toy, Dinosaur Storage Vehicle, Electric Train Track, DIY Track Toys, Dinosaur Engineering Vehicle Wholesale, Track Toys China Factory"
        print('Fixed TF214357: 231pcs Electric Train')
        break

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

p = [x for x in d if x['id'] == 'TF214357'][0]
print('Name:', p['name'])
print('MOQ:', p['moq'], '| Price:', p['price'])
