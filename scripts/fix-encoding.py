import glob, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.chdir('..')

files = glob.glob('src/pages/*.astro') + glob.glob('src/pages/blog/*.astro')
total_fixed = 0

for f in files:
    with open(f, 'r', encoding='utf-8-sig', errors='replace') as fh:
        c = fh.read()
    
    orig = c
    # 锟斤拷 = em dash corrupted by double-encoding
    c = c.replace('\u951f\u65a4\u62f7', '\u2014')  # 锟斤拷 -> —
    # 锟�? patterns with replacement char
    c = c.replace('\u951f\ufffd', '\u2014')        # 锟� -> —
    c = c.replace('\ufffd', '\u2014')              # any remaining U+FFFD -> —
    
    if c != orig:
        with open(f, 'w', encoding='utf-8') as fh:
            fh.write(c)
        n = orig.count('\u951f') + orig.count('\ufffd')
        total_fixed += n
        print(f'FIXED {f}: {n} chars')

print(f'Total fixed: {total_fixed}')
