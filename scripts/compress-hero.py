from PIL import Image
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

path = 'public/images/hero-factory.webp'
img = Image.open(path)
print('Before:', img.size, os.path.getsize(path) // 1024, 'KB')

new_w = 1920
ratio = new_w / img.width
new_h = int(img.height * ratio)
img_resized = img.resize((new_w, new_h), Image.LANCZOS)
img_resized.save(path, 'WEBP', quality=80, method=6)
print('After:', (new_w, new_h), os.path.getsize(path) // 1024, 'KB')
