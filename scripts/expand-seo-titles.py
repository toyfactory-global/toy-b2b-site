import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

with open('src/data/products.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

# SEO title extensions per product (keyword expansion, <= 70 chars)
title_map = {
    "TF208740": "Orbital Magnetic Levitation Track Car Electric Toy Wholesale Factory",
    "TF209512": "Magnetic Track Car 126pcs DIY Building Toy Wholesale China Factory",
    "TF211082": "3D Track Car 121pcs Building Set Racing Toy Wholesale Factory Direct",
    "TF211091": "3D Creative Magic Stereo Track Car Luxury Toy Wholesale Factory",
    "TF212344": "PVC Double Track Sliding Car Race Toy Wholesale Factory Direct",
    "TF213426": "Dinosaur Swallow Track Storage Car 12 Alloy Cars Wholesale Factory",
    "TF213249": "Music Crown Electric Bubble Magic Wand Toy Wholesale Factory China",
    "TF213293": "Seven Color Flower Bubble Machine Standing Outdoor Wholesale Factory",
    "TF213301": "Garden Bulb Bubble Machine Outdoor Electric Wholesale Factory China",
    "TF213303": "Sunflower Bubble Machine Electric Auto Bubble Blower Wholesale Factory",
    "TF213393": "8-Hole Automatic Bubble Machine 70ml Bubble Water Wholesale Factory",
    "TF213395": "Rocket Thruster Bubble Machine 2x50ml Auto Electric Wholesale Factory",
    "TF213415": "Storage Dinosaur Car 6 Pull Back Cars Toy Wholesale Factory China",
    "TF208799": "New Arrow Dancing Mat Music Game Toy Wholesale Factory China",
    "TF211030": "Interactive Dinosaur Phonics Reader 800 Words Learning Toy Wholesale",
    "TF213143": "DIY Bouquet Pressing Machine Set Light Music Craft Toy Wholesale",
    "TF213184": "Magic House Balloon Machine Upgraded Electric Party Wholesale Factory",
    "TF197926": "Ceramic Clay Machine DIY Pottery Craft Toy Wholesale Factory China",
    "TF210951": "Space Ring Fire Breathing Water Gun Electric Blaster Wholesale Factory",
    "TF210956": "Space Fire Breathing Water Gun Drum Electric Blaster Wholesale Factory",
    "TF210960": "Fire Breathing Drum Water Gun Automatic Electric Blaster Wholesale",
    "TF210965": "Fire Breathing MSR Water Gun Automatic Electric Blaster Wholesale",
    "TF210969": "Ice Mouse Fire Breathing Water Gun Electric Blaster Wholesale Factory",
    "TF211013": "2nd Gen Fire Breathing Integrated Water Gun Electric Wholesale Factory",
    "TF211017": "AK47 Transparent Light Electric Water Gun Racing Wholesale Factory",
    "TF211497": "2nd Gen Desert Fire Breathing Water Gun Transparent Wholesale Factory",
    "TF211526": "Gatling Water Gun 350ml Electric Multi Barrel Blaster Wholesale Factory",
    "TF211527": "Single Tube Gatling Water Gun Continuous Fire Electric Wholesale",
    "TF212336": "Electric Water Gun LED Light Automatic Blaster Wholesale Factory China",
    "TF212706": "Ice Burst Aurora Electric Water Gun LED Blaster Wholesale Factory",
}

updated = 0
for p in d:
    if p['id'] in title_map and not p.get('seo_title'):
        p['seo_title'] = title_map[p['id']]
        p['seo_description'] = p.get('seo_description') or f"{p['name']} — wholesale direct from TOYFACTORY, ISO 9001:2015 certified B2B toy factory in Shantou, China."
        updated += 1
        print(f"OK {p['id']}: {title_map[p['id']]}")
    elif p['id'] in title_map and p.get('seo_title'):
        print(f"SKIP {p['id']}: already has seo_title")

with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, ensure_ascii=False, indent=2)

print(f'\nUpdated: {updated}')
