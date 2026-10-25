import pymupdf as f, sys
src, out = sys.argv[1], sys.argv[2]
d = f.open(src)
blank = []
for i, p in enumerate(d):
    if not p.get_text().strip() and not p.get_image_info():
        blank.append(i)
if blank:
    d.delete_pages(blank)
d.save(out, garbage=3, deflate=True)
print('pages', len(d), 'removed blank', len(blank))
