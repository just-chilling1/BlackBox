from PIL import Image

src = Image.open("public/logo-source.png").convert("RGB")
w, h = src.size
px = src.load()

regions = []
visited = [[False] * w for _ in range(h)]


def is_content(r: int, g: int, b: int) -> bool:
    return r > 35 or g > 35 or b > 35


for y in range(h):
    for x in range(w):
        if visited[y][x]:
            continue
        r, g, b = px[x, y]
        if not is_content(r, g, b):
            continue

        stack = [(x, y)]
        visited[y][x] = True
        min_x = max_x = x
        min_y = max_y = y
        count = 0

        while stack:
            cx, cy = stack.pop()
            count += 1
            min_x = min(min_x, cx)
            max_x = max(max_x, cx)
            min_y = min(min_y, cy)
            max_y = max(max_y, cy)
            for nx, ny in ((cx - 1, cy), (cx + 1, cy), (cx, cy - 1), (cx, cy + 1)):
                if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx]:
                    nr, ng, nb = px[nx, ny]
                    if is_content(nr, ng, nb):
                        visited[ny][nx] = True
                        stack.append((nx, ny))

        box_w = max_x - min_x + 1
        box_h = max_y - min_y + 1
        if count < 200 or box_w < 15 or box_h < 15:
            continue
        regions.append(
            {
                "box": (min_x, min_y, max_x + 1, max_y + 1),
                "size": (box_w, box_h),
                "aspect": box_w / box_h,
                "count": count,
            }
        )

for r in sorted(regions, key=lambda x: -x["count"]):
    print(r)
