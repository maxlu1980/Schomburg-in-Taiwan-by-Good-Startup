# contact sheet: python3 sheet4.py out.jpg maxw cols files…
import sys
from PIL import Image
out, maxw, cols = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); files = sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in files]
cw = maxw // cols; ims = [im.resize((cw, int(im.height * cw / im.width))) for im in ims]
rows = (len(ims) + cols - 1) // cols; rh = [max(ims[r * cols + c].height for c in range(cols) if r * cols + c < len(ims)) for r in range(rows)]
sheet = Image.new('RGB', (cols * cw, sum(rh)), (255, 255, 255)); y = 0
for r in range(rows):
    for c in range(cols):
        i = r * cols + c
        if i < len(ims): sheet.paste(ims[i], (c * cw, y))
    y += rh[r]
sheet.save(out, quality=82); print(out, sheet.size)
