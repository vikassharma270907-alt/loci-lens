import math
import os
from PIL import Image, ImageDraw, ImageFont

W = 1280
H = 720

img = Image.new("RGBA", (W, H), (7, 9, 14, 255))
draw = ImageDraw.Draw(img)

# Fonts
FONT_DIR = r"C:\Windows\Fonts"
try:
    f_title = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 68)
    f_h1 = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 38)
    f_h2 = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 26)
    f_body = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 20)
    f_small = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 15)
    f_mono = ImageFont.truetype(os.path.join(FONT_DIR, "consola.ttf"), 16)
except Exception:
    f_title = ImageFont.load_default()
    f_h1 = f_title
    f_h2 = f_title
    f_body = f_title
    f_small = f_title
    f_mono = f_title

# Background radial gradient simulation
for r in range(500, 0, -20):
    alpha = int(35 * (1.0 - r / 500))
    draw.ellipse([850 - r, 360 - r, 850 + r, 360 + r], fill=(56, 189, 248, alpha))

# Top Platform Badge
draw.rounded_rectangle([60, 50, 480, 88], radius=8, fill=(15, 23, 42), outline=(56, 189, 248), width=2)
draw.text((78, 58), "SNAP SPECS • DEVPOST LEARN 2026", font=f_small, fill=(56, 189, 248))

# Big Hero Title
draw.text((60, 110), "LOCI LENS", font=f_title, fill=(248, 250, 252))
draw.text((60, 195), "Augmented-Reality Memory Palace", font=f_h1, fill=(56, 189, 248))
draw.text((60, 245), "Turn any physical room into an active recall palace.", font=f_body, fill=(148, 163, 184))

# Key Features Pill List
pills = [
    ("🌱 Place Cards on Furniture", (34, 197, 94)),
    ("🚶 Hands-Free Stroll Mode", (56, 189, 248)),
    ("🔒 Occluded Active Recall Test", (245, 158, 11)),
    ("📊 Leitner 3-Box Spaced Repetition", (168, 85, 247))
]
y_p = 310
for text, col in pills:
    draw.rounded_rectangle([60, y_p, 520, y_p + 46], radius=8, fill=(18, 22, 32), outline=col, width=1)
    draw.text((80, y_p + 10), text, font=f_body, fill=(248, 250, 252))
    y_p += 58

# Bottom Trust Badges
draw.rounded_rectangle([60, 570, 520, 640], radius=10, fill=(4, 6, 10), outline=(34, 197, 94), width=2)
draw.text((80, 582), "✓ 100% LEAF & Node.js Test Pass Rate", font=f_body, fill=(34, 197, 94))
draw.text((80, 610), "✓ Approved Devpost Brief (plan-lens)", font=f_small, fill=(148, 163, 184))

# Right Side: AR Optical View Simulation
draw.rounded_rectangle([580, 60, 1220, 660], radius=24, fill=(10, 14, 20), outline=(56, 189, 248), width=2)

# Waveguide Frame
draw.rounded_rectangle([620, 90, 1180, 630], radius=20, outline=(56, 189, 248, 140), width=2)
draw.text((740, 105), "SNAP SPECS OPTICAL WAVEGUIDE (37° × 32°)", font=f_small, fill=(56, 189, 248))

# Active 3D Card
draw.rounded_rectangle([660, 160, 1140, 480], radius=14, fill=(18, 22, 32), outline=(34, 197, 94), width=3)
draw.text((690, 185), "TEST MODE: CARD 1 OF 6 (BIOLOGY)", font=f_h2, fill=(56, 189, 248))
draw.text((690, 230), "Locus: Study Desk Lamp", font=f_small, fill=(148, 163, 184))
draw.text((690, 265), "What is the primary light-absorbing\npigment in photosynthesis?", font=f_h2, fill=(248, 250, 252))

# Revealed Answer Box
draw.rounded_rectangle([690, 345, 1110, 415], radius=8, fill=(15, 23, 42), outline=(34, 197, 94), width=1)
draw.text((710, 355), "REVEALED ANSWER: Chlorophyll-a", font=f_body, fill=(34, 197, 94))
draw.text((710, 385), "Absorbs red & blue wavelengths; reflects green", font=f_small, fill=(148, 163, 184))

# SIK Buttons
draw.rounded_rectangle([690, 430, 880, 465], radius=6, fill=(34, 197, 94))
draw.text((735, 438), "✓ Got It", font=f_body, fill=(3, 7, 18))
draw.rounded_rectangle([910, 430, 1100, 465], radius=6, fill=(245, 158, 11))
draw.text((965, 438), "✕ Missed", font=f_body, fill=(3, 7, 18))

# Peripheral HUD
px, py, pr = 1090, 560, 55
draw.ellipse([px - pr, py - pr, px + pr, py + pr], fill=(18, 22, 32), outline=(56, 189, 248), width=2)
draw.text((px - 22, py - 30), "TEST", font=f_small, fill=(148, 163, 184))
draw.text((px - 20, py - 12), "6/6", font=f_h2, fill=(56, 189, 248))
draw.text((px - 34, py + 16), "18° PERIPHERY", font=f_mono, fill=(148, 163, 184))

img.save("loci_lens_youtube_thumbnail.png", "PNG")
print("Thumbnail generated: loci_lens_youtube_thumbnail.png (1280x720)")

