import math
import os
from PIL import Image, ImageDraw, ImageFont

W = 1280
H = 720

img = Image.new("RGBA", (W, H), (8, 12, 18, 255))
draw = ImageDraw.Draw(img)

# Fonts
FONT_DIR = r"C:\Windows\Fonts"
try:
    f_title = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 64)
    f_h1 = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 34)
    f_h2 = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 24)
    f_body = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 19)
    f_small = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 15)
    f_mono = ImageFont.truetype(os.path.join(FONT_DIR, "consola.ttf"), 15)
    f_mono_small = ImageFont.truetype(os.path.join(FONT_DIR, "consola.ttf"), 13)
except Exception:
    f_title = ImageFont.load_default()
    f_h1 = f_title
    f_h2 = f_title
    f_body = f_title
    f_small = f_title
    f_mono = f_title
    f_mono_small = f_title

# Subtle radial cyan glow behind right waveguide
for r in range(450, 0, -20):
    alpha = int(30 * (1.0 - r / 450))
    draw.ellipse([920 - r, 360 - r, 920 + r, 360 + r], fill=(0, 240, 255, alpha))

# Top Platform Badge
draw.rounded_rectangle([50, 40, 480, 78], radius=8, fill=(15, 23, 42), outline=(0, 240, 255), width=2)
draw.text((68, 48), "SNAP SPECS 27 • DEVPOST LEARN 2026", font=f_small, fill=(0, 240, 255))

# Big Hero Title
draw.text((50, 95), "TORQUELOCK AR", font=f_title, fill=(248, 250, 252))
draw.text((50, 175), "Spatial Memory & Procedural Flange Torquing", font=f_h1, fill=(0, 240, 255))
draw.text((50, 222), "Transform the 6-bolt flange itself into a memory palace.", font=f_body, fill=(148, 163, 184))

# Key Features Pill List
pills = [
    ("⚓ 6-Loci Spatial Memory Palace (ASME PCC-1)", (74, 222, 128)),
    ("🎯 Cognitive Focus Mode (Henderson & Feiner)", (0, 240, 255)),
    ("⚠️ Real-Time Gasket Warp Detection (1.8mm)", (255, 77, 77)),
    ("📊 Leitner 3-Box Spaced Repetition Retraining", (250, 204, 21))
]
y_p = 285
for text, col in pills:
    draw.rounded_rectangle([50, y_p, 540, y_p + 44], radius=8, fill=(15, 22, 34), outline=col, width=1)
    draw.text((70, y_p + 10), text, font=f_body, fill=(248, 250, 252))
    y_p += 54

# Bottom Trust Badges
draw.rounded_rectangle([50, 530, 540, 650], radius=10, fill=(4, 8, 14), outline=(74, 222, 128), width=2)
draw.text((70, 545), "✓ 100% LEAF & Node.js Test Pass Rate (20/20)", font=f_body, fill=(74, 222, 128))
draw.text((70, 580), "✓ Approved Devpost Brief (learn-specs skill pack)", font=f_small, fill=(148, 163, 184))
draw.text((70, 610), "✓ Decoupled Pure TypeScript Domain Architecture", font=f_mono_small, fill=(0, 240, 255))

# Right Side: AR Optical View Simulation inside SPECS Waveguide
draw.rounded_rectangle([590, 40, 1230, 670], radius=24, fill=(12, 17, 26), outline=(0, 240, 255), width=2)

# Waveguide Frame
draw.rounded_rectangle([615, 65, 1205, 645], radius=18, outline=(0, 240, 255, 140), width=2)
draw.text((740, 78), "SNAP SPECS OPTICAL WAVEGUIDE (37° × 32°)", font=f_small, fill=(0, 240, 255))

# 3D Flange Center
fc_x = 910
fc_y = 360

# Flange Outer & Inner Rims
draw.ellipse([fc_x - 170, fc_y - 170, fc_x + 170, fc_y + 170], fill=(18, 26, 38), outline=(0, 240, 255, 180), width=3)
draw.ellipse([fc_x - 75, fc_y - 75, fc_x + 75, fc_y + 75], fill=(12, 17, 26), outline=(0, 240, 255, 100), width=2)

# Bolt Circle Dotted
draw.ellipse([fc_x - 120, fc_y - 120, fc_x + 120, fc_y + 120], outline=(0, 240, 255, 50), width=1)

# Star Pattern Lines
star_coords = [
    (fc_x, fc_y - 120),        # 1 (Top)
    (fc_x, fc_y + 120),        # 4 (Bottom)
    (fc_x + 104, fc_y - 60),   # 2 (Upper Right)
    (fc_x - 104, fc_y + 60),   # 5 (Lower Left)
    (fc_x + 104, fc_y + 60),   # 3 (Lower Right)
    (fc_x - 104, fc_y - 60)    # 6 (Upper Left)
]
for i in range(len(star_coords) - 1):
    draw.line([star_coords[i], star_coords[i+1]], fill=(0, 240, 255, 180), width=2)

# Draw 6 Bolts
bolt_positions = [
    (1, fc_x, fc_y - 120),
    (2, fc_x + 104, fc_y - 60),
    (3, fc_x + 104, fc_y + 60),
    (4, fc_x, fc_y + 120),
    (5, fc_x - 104, fc_y + 60),
    (6, fc_x - 104, fc_y - 60)
]

for b_id, bx, by in bolt_positions:
    if b_id == 1:
        # Active target
        draw.ellipse([bx - 30, by - 30, bx + 30, by + 30], outline=(0, 240, 255), width=3)
        draw.ellipse([bx - 18, by - 18, bx + 18, by + 18], fill=(20, 60, 80), outline=(0, 240, 255), width=2)
        draw.text((bx - 5, by - 10), "1", font=f_mono, fill=(248, 250, 252))
    elif b_id in (4, 2):
        draw.ellipse([bx - 16, by - 16, bx + 16, by + 16], fill=(25, 33, 46), outline=(74, 222, 128), width=2)
        draw.text((bx - 5, by - 9), str(b_id), font=f_mono_small, fill=(74, 222, 128))
    else:
        draw.ellipse([bx - 16, by - 16, bx + 16, by + 16], fill=(25, 33, 46), outline=(148, 163, 184), width=1)
        draw.text((bx - 5, by - 9), str(b_id), font=f_mono_small, fill=(148, 163, 184))

# Focus Mode Pill Hovering over Bolt 1
draw.rounded_rectangle([fc_x - 140, fc_y - 200, fc_x + 140, fc_y - 155], radius=10, fill=(15, 23, 42), outline=(74, 222, 128), width=2)
draw.text((fc_x - 120, fc_y - 190), "FOCUS: P1 · B1 · 35 Nm", font=f_h2, fill=(74, 222, 128))

# Bottom Disclaimer in Waveguide
draw.rounded_rectangle([640, 605, 1180, 635], radius=6, fill=(4, 8, 14), outline=(148, 163, 184), width=1)
draw.text((660, 612), "PREVIEW STAND-IN: SIMULATED BLE TORQUE WRENCH · ASME PCC-1", font=f_mono_small, fill=(148, 163, 184))

img.save("torquelock_ar_youtube_thumbnail.png", "PNG")
print("TorqueLock AR thumbnail generated: torquelock_ar_youtube_thumbnail.png (1280x720)")
