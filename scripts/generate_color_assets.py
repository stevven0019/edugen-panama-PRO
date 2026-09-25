from PIL import Image, ImageDraw, ImageFont
import os

target_dir = 'public/assets/nouns'
os.makedirs(target_dir, exist_ok=True)

# Colors definitions (RGBA)
ITEMS = [
    {
        'name': 'green',
        'fill': (34, 197, 94, 255),      # Emerald #22C55E
        'border': (21, 128, 61, 255),    # Dark Green #15803D
        'accent': (134, 239, 172, 255),  # Light Green
        'text': 'GREEN',
        'type': 'color'
    },
    {
        'name': 'blue',
        'fill': (59, 130, 246, 255),     # Blue #3B82F6
        'border': (29, 78, 216, 255),    # Dark Blue #1D4ED8
        'accent': (147, 197, 253, 255),  # Light Blue
        'text': 'BLUE',
        'type': 'color'
    },
    {
        'name': 'red',
        'fill': (239, 68, 68, 255),      # Red #EF4444
        'border': (185, 28, 28, 255),    # Dark Red #B91C1C
        'accent': (252, 165, 165, 255),  # Light Red
        'text': 'RED',
        'type': 'color'
    },
    {
        'name': 'yellow',
        'fill': (234, 179, 8, 255),      # Golden Yellow #EAB308
        'border': (161, 98, 7, 255),     # Dark Amber #A16207
        'accent': (254, 240, 138, 255),  # Light Yellow
        'text': 'YELLOW',
        'type': 'color'
    },
    {
        'name': 'purple',
        'fill': (168, 85, 247, 255),     # Purple #A855F7
        'border': (126, 34, 206, 255),   # Dark Purple #7E22CE
        'accent': (216, 180, 254, 255),  # Light Purple
        'text': 'PURPLE',
        'type': 'color'
    },
    {
        'name': 'small',
        'fill': (241, 245, 249, 255),
        'border': (100, 116, 139, 255),
        'accent': (59, 130, 246, 255),
        'text': 'SMALL',
        'type': 'size_small'
    },
    {
        'name': 'big',
        'fill': (241, 245, 249, 255),
        'border': (100, 116, 139, 255),
        'accent': (239, 68, 68, 255),
        'text': 'BIG',
        'type': 'size_big'
    }
]

for item in ITEMS:
    size = (500, 500)
    img = Image.new('RGBA', size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Outer soft circular badge
    if item['type'] == 'color':
        # Main vibrant color disk
        draw.ellipse([60, 60, 440, 440], fill=item['fill'], outline=item['border'], width=12)
        # Inner highlight arc
        draw.arc([90, 90, 410, 410], start=200, end=320, fill=item['accent'], width=10)
        # Center subtle swatch core
        draw.ellipse([190, 190, 310, 310], fill=item['border'])
        draw.ellipse([200, 200, 300, 300], fill=(255, 255, 255, 230))
    elif item['type'] == 'size_small':
        # Background card
        draw.rounded_rectangle([40, 40, 460, 460], radius=40, fill=(248, 250, 252, 255), outline=item['border'], width=8)
        # Big reference box (dashed/light)
        draw.rounded_rectangle([80, 80, 250, 420], radius=20, fill=(226, 232, 240, 120), outline=(148, 163, 184, 255), width=4)
        # Small highlighted object
        draw.ellipse([300, 240, 400, 340], fill=(59, 130, 246, 255), outline=(29, 78, 216, 255), width=8)
        # Label indicator
        draw.line([350, 200, 350, 230], fill=(30, 41, 59, 255), width=6)
    elif item['type'] == 'size_big':
        # Background card
        draw.rounded_rectangle([40, 40, 460, 460], radius=40, fill=(248, 250, 252, 255), outline=item['border'], width=8)
        # Big highlighted object
        draw.ellipse([80, 80, 380, 380], fill=(239, 68, 68, 255), outline=(185, 28, 28, 255), width=10)
        # Small reference circle
        draw.ellipse([395, 330, 445, 380], fill=(203, 213, 225, 255), outline=(148, 163, 184, 255), width=4)

    out_path = os.path.join(target_dir, f"{item['name']}.png")
    img.save(out_path, 'PNG')
    print(f"Generated {out_path}")

print("All color and size assets generated successfully!")
