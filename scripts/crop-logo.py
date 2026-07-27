from PIL import Image

src = Image.open("public/logo-source.png").convert("RGBA")


def remove_dark_bg(im: Image.Image, threshold: int = 28) -> Image.Image:
    out = im.copy()
    px = out.load()
    w, h = out.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r <= threshold and g <= threshold and b <= threshold:
                px[x, y] = (r, g, b, 0)
    return out


def trim_alpha(im: Image.Image, pad: int = 6) -> Image.Image:
    alpha = im.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        return im
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(im.width, right + pad)
    bottom = min(im.height, bottom + pad)
    return im.crop((left, top, right, bottom))


icon = remove_dark_bg(src.crop((125, 228, 375, 338)))
lockup = trim_alpha(remove_dark_bg(src.crop((360, 250, 980, 430))))

icon.save("public/logo-icon.png")
lockup.save("public/logo.png")

square = icon.copy()
square.thumbnail((512, 512), Image.Resampling.LANCZOS)
canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
ox = (512 - square.width) // 2
oy = (512 - square.height) // 2
canvas.paste(square, (ox, oy), square)
canvas.save("public/apple-touch-icon.png")
canvas.resize((32, 32), Image.Resampling.LANCZOS).save("public/favicon.png")

print("icon", icon.size, "lockup", lockup.size)
