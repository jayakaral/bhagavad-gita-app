from pathlib import Path
from PIL import Image

icon_path = Path(__file__).resolve().parents[1] / "assets" / "images" / "icon.png"
image = Image.open(icon_path).convert("RGBA")
image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
palette = image.convert("P", palette=Image.Palette.ADAPTIVE, colors=256)
palette.save(icon_path, format="PNG", optimize=True)

print(f"Optimized {icon_path.name}: {icon_path.stat().st_size} bytes")
