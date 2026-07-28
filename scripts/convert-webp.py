import os, sys
from PIL import Image

img_dir = r'b2b-toy-site\public\images'
converted = 0
skipped = 0
total_saved = 0

for root, dirs, files in os.walk(img_dir):
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png')):
            src = os.path.join(root, f)
            name_no_ext = os.path.splitext(f)[0]
            dst = os.path.join(root, name_no_ext + '.webp')

            # Skip if webp already exists
            if os.path.exists(dst):
                skipped += 1
                continue

            try:
                img = Image.open(src)
                orig_size = os.path.getsize(src)
                # Convert RGBA to RGB if needed
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGBA')
                    img.save(dst, 'WEBP', quality=82, lossless=False)
                else:
                    img = img.convert('RGB')
                    img.save(dst, 'WEBP', quality=82)
                new_size = os.path.getsize(dst)
                saved = orig_size - new_size
                total_saved += saved
                converted += 1
                if converted <= 5 or converted % 50 == 0:
                    print(f'OK: {f}  ({orig_size//1024}KB -> {new_size//1024}KB, -{saved*100//orig_size}%)')
            except Exception as e:
                print(f'ERR: {f} - {e}')

print(f'\nDone. Converted: {converted}, Skipped: {skipped}, Saved: {total_saved//1024}KB')
