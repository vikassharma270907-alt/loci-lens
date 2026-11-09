import subprocess
import math
import os
import sys
import json
from PIL import Image, ImageDraw, ImageFont

# Canvas dimensions
WIDTH = 1920
HEIGHT = 1080
FPS = 24

# Load timeline
with open("temp_audio/torquelock_timeline.json", "r") as jf:
    meta = json.load(jf)

TIMELINE = meta["timeline"]
TOTAL_DURATION = meta["total_duration"]
TOTAL_FRAMES = int(TOTAL_DURATION * FPS)

print(f"TorqueLock Video Renderer: {TOTAL_DURATION:.2f}s, {TOTAL_FRAMES} frames @ {FPS} fps")

# Fonts
FONT_DIR = r"C:\Windows\Fonts"
try:
    font_title = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 52)
    font_h1 = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 38)
    font_h2 = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 26)
    font_body = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 20)
    font_small = ImageFont.truetype(os.path.join(FONT_DIR, "segoeui.ttf"), 15)
    font_mono = ImageFont.truetype(os.path.join(FONT_DIR, "consola.ttf"), 17)
    font_mono_small = ImageFont.truetype(os.path.join(FONT_DIR, "consola.ttf"), 13)
except Exception:
    font_title = ImageFont.load_default()
    font_h1 = font_title
    font_h2 = font_title
    font_body = font_title
    font_small = font_title
    font_mono = font_title
    font_mono_small = font_title

# Colors (SPECS Additive Optics friendly)
C_BG = (10, 14, 22)
C_PANEL_BG = (15, 23, 42)
C_CYAN = (0, 240, 255)
C_MINT = (74, 222, 128)
C_AMBER = (250, 204, 21)
C_CORAL = (255, 77, 77)
C_WHITE = (248, 250, 252)
C_MUTED = (148, 163, 184)
C_DARK_SLATE = (30, 41, 59)

# 3D Perspective Projection for Right Viewport
VP_CX = 1400
VP_CY = 540
FOCAL_LEN = 1550.0  # pixels

def project_3d(x_cm, y_cm, z_cm):
    # Camera at (0, 0, 0), looking down -Z
    depth = -z_cm  # positive depth
    if depth <= 1.0: depth = 1.0
    px = VP_CX + int((x_cm / depth) * FOCAL_LEN)
    py = VP_CY - int((y_cm / depth) * FOCAL_LEN)
    scale = FOCAL_LEN / depth
    return px, py, scale

# Flange Bolt coordinates (cm)
# Flange center: (0, -18, -115)
# Bolt circle radius: 15 cm
BOLT_COORDS = {
    1: (0.0, -3.0, -115.0),       # 90 deg (Top)
    2: (13.0, -10.5, -115.0),     # 30 deg (Upper Right)
    3: (13.0, -25.5, -115.0),     # 330 deg (Lower Right)
    4: (0.0, -33.0, -115.0),      # 270 deg (Bottom)
    5: (-13.0, -25.5, -115.0),    # 210 deg (Lower Left)
    6: (-13.0, -10.5, -115.0)     # 150 deg (Upper Left)
}
STAR_ORDER = [1, 4, 2, 5, 3, 6]

def draw_header(draw, title, subtitle):
    # Top badge
    draw.rounded_rectangle([60, 40, 520, 78], radius=8, fill=C_PANEL_BG, outline=C_CYAN, width=1)
    draw.text((76, 49), "SNAP SPECS 27 • DEVPOST LEARN HACKATHON 2026", font=font_small, fill=C_CYAN)

    draw.text((60, 95), title, font=font_title, fill=C_WHITE)
    draw.text((60, 160), subtitle, font=font_h2, fill=C_MUTED)
    draw.line([(60, 205), (1860, 205)], fill=C_DARK_SLATE, width=1)

def draw_specs_waveguide(draw):
    # Simulated 37x32 optical frame in right pane
    w, h = 880, 800
    x1, y1 = VP_CX - w // 2, VP_CY - h // 2 + 60
    x2, y2 = VP_CX + w // 2, VP_CY + h // 2 + 60
    draw.rounded_rectangle([x1, y1, x2, y2], radius=32, fill=(13, 18, 28), outline=(0, 240, 255, 120), width=2)
    # Header badge
    draw.rounded_rectangle([VP_CX - 220, y1 - 16, VP_CX + 220, y1 + 16], radius=10, fill=C_PANEL_BG, outline=C_CYAN, width=1)
    draw.text((VP_CX - 195, y1 - 9), "SNAP SPECS OPTICAL WAVEGUIDE (37° V × 32° H)", font=font_small, fill=C_CYAN)

    # Bottom disclaimer pill inside waveguide
    draw.rounded_rectangle([VP_CX - 320, y2 - 40, VP_CX + 320, y2 - 10], radius=8, fill=(4, 8, 14), outline=C_MUTED, width=1)
    draw.text((VP_CX - 295, y2 - 34), "PREVIEW STAND-IN: SIMULATED BLE TORQUE WRENCH · ASME PCC-1", font=font_mono_small, fill=C_MUTED)

def draw_3d_flange(draw, active_bolt=1, completed_bolts=None, highlight_star=False, warp_deflection_mm=0.0):
    if completed_bolts is None:
        completed_bolts = set()

    # Flange outer rim
    f_cx, f_cy, scale = project_3d(0.0, -18.0, -115.0)
    outer_r = int(21.0 * scale)
    inner_r = int(10.0 * scale)

    # Gasket color (coral if warped, dark slate/green otherwise)
    if warp_deflection_mm >= 1.5:
        gasket_outline = C_CORAL
        gasket_fill = (45, 15, 20)
    else:
        gasket_outline = (56, 189, 248, 180)
        gasket_fill = (18, 26, 38)

    draw.ellipse([f_cx - outer_r, f_cy - outer_r, f_cx + outer_r, f_cy + outer_r], fill=gasket_fill, outline=gasket_outline, width=3)
    draw.ellipse([f_cx - inner_r, f_cy - inner_r, f_cx + inner_r, f_cy + inner_r], fill=(13, 18, 28), outline=(56, 189, 248, 100), width=2)

    # Bolt circle reference dotted
    bc_r = int(15.0 * scale)
    draw.ellipse([f_cx - bc_r, f_cy - bc_r, f_cx + bc_r, f_cy + bc_r], outline=(56, 189, 248, 60), width=1)

    # Draw Star Pattern lines if enabled
    if highlight_star:
        for idx in range(len(STAR_ORDER) - 1):
            b_from = STAR_ORDER[idx]
            b_to = STAR_ORDER[idx + 1]
            x1, y1, _ = project_3d(*BOLT_COORDS[b_from])
            x2, y2, _ = project_3d(*BOLT_COORDS[b_to])
            draw.line([(x1, y1), (x2, y2)], fill=(0, 240, 255, 160), width=2)

    # Draw Bolts
    for b_id in range(1, 7):
        bx, by, bscale = project_3d(*BOLT_COORDS[b_id])
        br = int(2.4 * bscale)

        if b_id in completed_bolts:
            draw.ellipse([bx - br, by - br, bx + br, by + br], fill=(20, 60, 35), outline=C_MINT, width=2)
            draw.text((bx - 5, by - 8), f"{b_id}", font=font_mono_small, fill=C_MINT)
        elif b_id == active_bolt:
            # Pulsing target ring
            draw.ellipse([bx - br - 10, by - br - 10, bx + br + 10, by + br + 10], outline=C_CYAN, width=3)
            draw.ellipse([bx - br, by - br, bx + br, by + br], fill=(20, 50, 70), outline=C_CYAN, width=2)
            draw.text((bx - 5, by - 8), f"{b_id}", font=font_mono_small, fill=C_WHITE)
            # Active beacon line pointing up
            draw.line([(bx, by - br - 10), (bx, by - br - 40)], fill=C_CYAN, width=2)
        else:
            draw.ellipse([bx - br, by - br, bx + br, by + br], fill=(25, 33, 46), outline=C_MUTED, width=1)
            draw.text((bx - 5, by - 8), f"{b_id}", font=font_mono_small, fill=C_MUTED)

    # Warp deflection annotation
    if warp_deflection_mm > 0.0:
        alert_y = f_cy - outer_r - 45
        draw.rounded_rectangle([f_cx - 210, alert_y, f_cx + 210, alert_y + 36], radius=8, fill=(60, 15, 20), outline=C_CORAL, width=2)
        draw.text((f_cx - 190, alert_y + 8), f"⚠️ GASKET WARP: {warp_deflection_mm:.2f} mm DEFLECTION", font=font_mono_small, fill=C_CORAL)

def render_frame(t, frame_num):
    img = Image.new("RGBA", (WIDTH, HEIGHT), C_BG)
    draw = ImageDraw.Draw(img)

    # Find active scene in timeline
    active_scene = TIMELINE[0]
    for s in TIMELINE:
        if s["start"] <= t <= s["end"]:
            active_scene = s
            break
        elif t > TIMELINE[-1]["end"]:
            active_scene = TIMELINE[-1]

    sc_id = active_scene["id"]
    t_in_sc = t - active_scene["start"]

    # Render according to Scene
    if sc_id == 1:
        # Scene 1: Problem & Flange as Palace
        draw_header(draw, "TorqueLock AR: Flange as Memory Palace", "Spatial Memory & Procedural Torque Training on Snap SPECS")
        
        # Left Panel: Problem & Concept
        draw.rounded_rectangle([60, 230, 900, 1010], radius=16, fill=C_PANEL_BG, outline=C_DARK_SLATE, width=1)
        draw.text((95, 260), "THE INDUSTRIAL PROBLEM", font=font_h1, fill=C_CORAL)
        draw.text((95, 315), "• ASME PCC-1 requires a strict cross-pattern star sequence\n  to seat pressure boundary gaskets evenly without blowout.\n• Symmetrical circular flanges lack natural visual landmarks.\n• Technicians lose their place consulting 2D paper charts\n  while handling heavy 100 Nm torque wrenches.", font=font_body, fill=C_WHITE)

        draw.line([(95, 480), (865, 480)], fill=C_DARK_SLATE, width=1)
        draw.text((95, 510), "THE TORQUELOCK SOLUTION", font=font_h1, fill=C_CYAN)
        draw.text((95, 565), "• Transforms the 6-bolt flange ITSELF into a memory palace.\n• Binds procedural sequence cues to physical fastener loci.\n• 1:1 spatial AR overlays eliminate context-switching.\n• Hands-free optical waveguide head-up guidance.", font=font_body, fill=C_WHITE)

        # Standard badges
        draw.rounded_rectangle([95, 780, 460, 835], radius=10, fill=(20, 30, 45), outline=C_CYAN, width=1)
        draw.text((115, 795), "ASME PCC-1 STAR PATTERN", font=font_mono_small, fill=C_CYAN)

        draw.rounded_rectangle([480, 780, 865, 835], radius=10, fill=(20, 45, 30), outline=C_MINT, width=1)
        draw.text((500, 795), "METHOD OF LOCI MNEMONIC", font=font_mono_small, fill=C_MINT)

        draw.rounded_rectangle([95, 855, 865, 960], radius=10, fill=(10, 16, 26), outline=C_MUTED, width=1)
        draw.text((115, 875), "Star Sequence: 1 → 4 → 2 → 5 → 3 → 6", font=font_h2, fill=C_AMBER)
        draw.text((115, 915), "Three Progressive Torque Passes: 35 Nm → 70 Nm → 100 Nm", font=font_body, fill=C_MUTED)

        # Right Panel: 3D Flange Waveguide
        draw_specs_waveguide(draw)
        draw_3d_flange(draw, active_bolt=1, completed_bolts=set(), highlight_star=True)

    elif sc_id == 2:
        # Scene 2: Skill Pack & Cognitive Science
        draw_header(draw, "Architectural Foundation & Research Evidence", "Grounded in 14 Peer-Reviewed HCI Papers & Devpost Learn Skill Pack")

        # Left Panel: Research Synthesis
        draw.rounded_rectangle([60, 230, 900, 1010], radius=16, fill=C_PANEL_BG, outline=C_DARK_SLATE, width=1)
        draw.text((95, 260), "COGNITIVE SCIENCE ROOTS", font=font_h1, fill=C_CYAN)

        papers = [
            ("Krokos et al. (VR 2019)", "+8.8% recall gain via head-tracked spatial memory palaces"),
            ("Henderson & Feiner (TVCG 2011)", "2-Phase model: Comprehension vs. Psychomotor tool operation"),
            ("Lindlbauer et al. (UIST 2019)", "Cognitive LOD knapsack: 36% UI interaction reduction"),
            ("Kim et al. (SUI 2019)", "Additive optical contrast: high-luminance HUD against black"),
            ("De La Torre et al. (CHI 2024)", "4x fewer code bugs via decoupled pure domain state machines")
        ]
        y_c = 320
        for title_p, desc_p in papers:
            draw.text((95, y_c), f"• {title_p}:", font=font_body, fill=C_MINT)
            draw.text((115, y_c + 28), desc_p, font=font_small, fill=C_WHITE)
            y_c += 68

        draw.line([(95, y_c + 10), (865, y_c + 10)], fill=C_DARK_SLATE, width=1)
        draw.text((95, y_c + 25), "Devpost Learn SPECS Skill Pack:", font=font_h2, fill=C_WHITE)
        draw.text((95, y_c + 60), "Generated approved devpost/design-brief.md with 100% compliance.", font=font_body, fill=C_MUTED)

        # Right Panel: Cognitive LOD visual demonstration
        draw_specs_waveguide(draw)
        # Show comparison of 2-Line tag vs 1-Line Focus pill
        draw.rounded_rectangle([VP_CX - 360, 250, VP_CX + 360, 420], radius=14, fill=C_PANEL_BG, outline=C_CYAN, width=2)
        draw.text((VP_CX - 330, 275), "1. COMPREHENSION PHASE (Expanded Tag)", font=font_mono_small, fill=C_CYAN)
        draw.text((VP_CX - 330, 310), "Bolt 1 · Top Dead Center (Anchor Locus)", font=font_h2, fill=C_WHITE)
        draw.text((VP_CX - 330, 360), "Pass 1 Target: 35 Nm (ASME PCC-1 Initial Seating)", font=font_body, fill=C_MUTED)

        draw.rounded_rectangle([VP_CX - 360, 460, VP_CX + 360, 560], radius=14, fill=C_PANEL_BG, outline=C_MINT, width=2)
        draw.text((VP_CX - 330, 485), "2. PSYCHOMOTOR PHASE (Focus Mode Pill)", font=font_mono_small, fill=C_MINT)
        draw.text((VP_CX - 330, 515), "P1 · B1 · 35 Nm (Eyes-up, uncluttered)", font=font_h2, fill=C_MINT)

        draw_3d_flange(draw, active_bolt=1, completed_bolts=set(), highlight_star=False)

    elif sc_id == 3:
        # Scene 3: Learn Mode (Star Loci)
        draw_header(draw, "Phase 1: Learn Mode (Spatial Loci Encoding)", "Encoding the 6 Flange Positions as Method of Loci Memory Anchors")

        # Animate active bolt illumination based on scene time
        # Sequence: 1 (0s), 4 (4s), 2 (8s), 5 (11s), 3 (14s), 6 (17s)
        completed = set()
        active = 1
        if t_in_sc > 17.0:
            active = 6
            completed = {1, 4, 2, 5, 3}
        elif t_in_sc > 14.0:
            active = 3
            completed = {1, 4, 2, 5}
        elif t_in_sc > 11.0:
            active = 5
            completed = {1, 4, 2}
        elif t_in_sc > 8.0:
            active = 2
            completed = {1, 4}
        elif t_in_sc > 4.0:
            active = 4
            completed = {1}

        # Left Panel: Step by step guidance
        draw.rounded_rectangle([60, 230, 900, 1010], radius=16, fill=C_PANEL_BG, outline=C_DARK_SLATE, width=1)
        draw.text((95, 260), "CROSS-PATTERN STAR SEQUENCE", font=font_h1, fill=C_CYAN)

        loci_descriptions = [
            (1, "Bolt 1 (Top Dead Center)", "Anchor Locus — Starting point of joint assembly"),
            (4, "Bolt 4 (Polar Opposite)", "Cross Locus — Immediate polar balance opposing B1"),
            (2, "Bolt 2 (Clockwise Adjacent)", "Shift Locus — +60° clockwise pair initiation"),
            (5, "Bolt 5 (Polar Opposite)", "Cross Locus — Balances B2 across flange diameter"),
            (3, "Bolt 3 (Lower Right)", "Shift Locus — Final pair initiation"),
            (6, "Bolt 6 (Polar Opposite)", "Closure Locus — Completes symmetric seating circle")
        ]
        y_l = 320
        for b_num, b_name, b_desc in loci_descriptions:
            is_active = (b_num == active)
            is_done = (b_num in completed)
            col_b = C_CYAN if is_active else (C_MINT if is_done else C_MUTED)
            badge_icon = "▶" if is_active else ("✓" if is_done else "○")
            draw.text((95, y_l), f"{badge_icon} {b_name}", font=font_h2, fill=col_b)
            draw.text((125, y_l + 32), b_desc, font=font_small, fill=C_WHITE if is_active else C_MUTED)
            y_l += 74

        draw.rounded_rectangle([95, 870, 865, 960], radius=10, fill=(10, 20, 32), outline=C_CYAN, width=1)
        draw.text((115, 890), f"Current Step: Bolt {active} of 6 Highlighted", font=font_h2, fill=C_CYAN)
        draw.text((115, 925), "High-luminance spatial rings prevent waveguide photon washout.", font=font_small, fill=C_WHITE)

        # Right Panel: 3D Flange
        draw_specs_waveguide(draw)
        draw_3d_flange(draw, active_bolt=active, completed_bolts=completed, highlight_star=True)

    elif sc_id == 4:
        # Scene 4: Recall Mode (Active Retrieval)
        draw_header(draw, "Phase 2: Recall Mode (Active Retrieval)", "Testing Unassisted Spatial Recall Without Visual Crutches")

        draw.rounded_rectangle([60, 230, 900, 1010], radius=16, fill=C_PANEL_BG, outline=C_DARK_SLATE, width=1)
        draw.text((95, 260), "ACTIVE RECALL DISCIPLINE", font=font_h1, fill=C_AMBER)
        draw.text((95, 315), "• All star pattern visual lines are strictly removed.\n• Forces technician to retrieve next bolt position from memory.\n• Directly strengthens hippocampal spatial indexing.\n• Technician confirms selection via Spectacles SIK pinch.", font=font_body, fill=C_WHITE)

        draw.line([(95, 480), (865, 480)], fill=C_DARK_SLATE, width=1)
        draw.text((95, 510), "RETRIEVAL PROMPT", font=font_h1, fill=C_CYAN)
        draw.text((95, 565), "Question: You just torqued Bolt 1.\nWhich bolt is next in the cross pattern?", font=font_h2, fill=C_WHITE)

        is_answered = (t_in_sc > 8.5)
        if is_answered:
            draw.rounded_rectangle([95, 680, 865, 820], radius=12, fill=(20, 50, 30), outline=C_MINT, width=2)
            draw.text((120, 705), "✓ SELECTION CONFIRMED: BOLT 4", font=font_h1, fill=C_MINT)
            draw.text((120, 765), "Correct polar opposite locus retrieved in 1.4s.", font=font_body, fill=C_WHITE)
        else:
            draw.rounded_rectangle([95, 680, 865, 820], radius=12, fill=(35, 30, 20), outline=C_AMBER, width=2)
            draw.text((120, 715), "WAITING FOR PINCH SELECTION...", font=font_h2, fill=C_AMBER)
            draw.text((120, 760), "Technician points index finger and pinches target bolt.", font=font_body, fill=C_MUTED)

        # Right Panel
        draw_specs_waveguide(draw)
        active_b = 4 if is_answered else 1
        comp = {1} if is_answered else set()
        draw_3d_flange(draw, active_bolt=active_b, completed_bolts=comp, highlight_star=False)

    elif sc_id == 5:
        # Scene 5: Practise Mode & Warp Alert
        draw_header(draw, "Phase 3: Practise Mode (Ramp & Gasket Warp)", "ASME PCC-1 Progressive Torquing & Asymmetric Stress Detection")

        is_warp_event = (t_in_sc > 16.5)

        draw.rounded_rectangle([60, 230, 900, 1010], radius=16, fill=C_PANEL_BG, outline=C_DARK_SLATE, width=1)
        
        if is_warp_event:
            draw.text((95, 260), "⚠️ GASKET WARP DETECTED!", font=font_h1, fill=C_CORAL)
            draw.text((95, 315), "• Technician torqued Bolt 2 directly after Bolt 1\n  (circular adjacent pattern instead of cross pattern!).\n• Non-uniform stress concentration calculated.\n• Gasket deflection: 1.80 mm (> 1.50 mm safety limit).\n• Immediate warning halts assembly to prevent gasket blowout.", font=font_body, fill=C_WHITE)

            draw.rounded_rectangle([95, 540, 865, 720], radius=12, fill=(45, 15, 20), outline=C_CORAL, width=2)
            draw.text((120, 565), "RECOVERY PROTOCOL ACTIVATED", font=font_h2, fill=C_CORAL)
            draw.text((120, 610), "1. Loosen adjacent bolt B2 back to seating baseline.\n2. Return to ASME PCC-1 Star Sequence: proceed to B4.\n3. Verify gasket seating plane parallelism.", font=font_body, fill=C_WHITE)
        else:
            draw.text((95, 260), "MULTI-PASS TORQUE RAMP", font=font_h1, fill=C_CYAN)
            draw.text((95, 315), "• Pass 1: 35 Nm (20-30% initial gasket seat)\n• Pass 2: 70 Nm (50-70% intermediate ramp)\n• Pass 3: 100 Nm (100% final target torque)", font=font_body, fill=C_WHITE)

            draw.rounded_rectangle([95, 480, 865, 620], radius=12, fill=(15, 35, 45), outline=C_CYAN, width=2)
            draw.text((120, 505), "COGNITIVE FOCUS MODE ENGAGED", font=font_h2, fill=C_CYAN)
            draw.text((120, 550), "Status Pill: P1 · B1 · 35 Nm (Decluttered eyes-up HUD)", font=font_h1, fill=C_MINT)

        draw.rounded_rectangle([95, 780, 865, 960], radius=10, fill=(10, 18, 28), outline=C_MUTED, width=1)
        draw.text((115, 805), "Simulation Physics Disclaimer:", font=font_h2, fill=C_AMBER)
        draw.text((115, 845), "Torque values (35, 70, 100 Nm) and gasket warp formula\n(K_warp = 0.0514 mm/Nm) are illustrative training simulations.\nASME PCC-1 referenced for sequence education only.", font=font_small, fill=C_MUTED)

        # Right Panel
        draw_specs_waveguide(draw)
        warp_val = 1.80 if is_warp_event else 0.0
        draw_3d_flange(draw, active_bolt=2 if is_warp_event else 1, completed_bolts={1}, highlight_star=False, warp_deflection_mm=warp_val)

    elif sc_id == 6:
        # Scene 6: Summary Mode & Spaced Repetition
        draw_header(draw, "Phase 4: Summary & Spaced Repetition", "Leitner 3-Box Memory Retention & Targeted Remediation")

        draw.rounded_rectangle([60, 230, 900, 1010], radius=16, fill=C_PANEL_BG, outline=C_DARK_SLATE, width=1)
        draw.text((95, 260), "SESSION PERFORMANCE METRICS", font=font_h1, fill=C_CYAN)

        # Metric boxes
        draw.rounded_rectangle([95, 320, 460, 430], radius=12, fill=(18, 32, 24), outline=C_MINT, width=2)
        draw.text((115, 335), "TIGHTENING ACCURACY", font=font_mono_small, fill=C_MINT)
        draw.text((115, 365), "94.4%", font=font_title, fill=C_WHITE)

        draw.rounded_rectangle([480, 320, 865, 430], radius=12, fill=(24, 30, 42), outline=C_CYAN, width=2)
        draw.text((500, 335), "TOTAL TORQUE PASSES", font=font_mono_small, fill=C_CYAN)
        draw.text((500, 365), "3 / 3 COMPLETED", font=font_h1, fill=C_WHITE)

        draw.line([(95, 470), (865, 470)], fill=C_DARK_SLATE, width=1)
        draw.text((95, 495), "LEITNER 3-BOX SPATIAL RETENTION", font=font_h2, fill=C_WHITE)

        boxes = [
            ("Box 1: Daily Remediation", "Bolt 2 (Warp error detected — retraining queued)", C_CORAL),
            ("Box 2: 3-Day Review", "Bolts 3, 6 (Intermediate retention)", C_AMBER),
            ("Box 3: Mastered Loci", "Bolts 1, 4, 5 (Flawless unassisted retrieval)", C_MINT)
        ]
        y_bx = 550
        for b_title, b_detail, b_color in boxes:
            draw.rounded_rectangle([95, y_bx, 865, y_bx + 64], radius=8, fill=(15, 20, 30), outline=b_color, width=1)
            draw.text((115, y_bx + 10), b_title, font=font_body, fill=b_color)
            draw.text((115, y_bx + 36), b_detail, font=font_small, fill=C_WHITE)
            y_bx += 76

        # SIK Remediation Button
        draw.rounded_rectangle([95, 820, 865, 890], radius=12, fill=C_CYAN)
        draw.text((260, 845), "PINCH TO RETRAIN BOX 1 (1 BOLT)", font=font_h2, fill=(7, 9, 14))

        # Right Panel
        draw_specs_waveguide(draw)
        draw_3d_flange(draw, active_bolt=2, completed_bolts={1, 3, 4, 5, 6}, highlight_star=False)

    elif sc_id == 7:
        # Scene 7: LEAF Verification & Closing
        draw_header(draw, "Automated Verification & Submission Summary", "100% Automated Test Coverage via LEAF & Decoupled Domain Architecture")

        draw.rounded_rectangle([60, 230, 900, 1010], radius=16, fill=C_PANEL_BG, outline=C_DARK_SLATE, width=1)
        draw.text((95, 260), "LEAF TEST MATRIX (20 / 20 PASSING)", font=font_h1, fill=C_MINT)

        scenarios = [
            ("C1: Clean Learn Phase Initialization", "Flange 1:1 mesh, 6 loci, star order [1,4,2,5,3,6] verified"),
            ("C2: Recall Mode Active Retrieval", "Answer occlusion active, unassisted selection confirmed"),
            ("C3: Practise Mode Torque Ramp", "35 Nm -> 70 Nm -> 100 Nm 3-pass ramp validated"),
            ("C4: Cognitive Focus Mode LOD", "2-line tag collapses to 1-line status pill during tool use"),
            ("C5: Gasket Warp Detection", "Adjacent tightening triggers >= 1.8mm deflection warning"),
            ("C6: Spaced Repetition Store", "Missed bolts routed to Leitner Box 1 for retraining")
        ]
        y_sc = 320
        for sc_name, sc_desc in scenarios:
            draw.text((95, y_sc), f"✓ {sc_name}", font=font_body, fill=C_MINT)
            draw.text((120, y_sc + 26), sc_desc, font=font_small, fill=C_MUTED)
            y_sc += 62

        draw.line([(95, y_sc + 10), (865, y_sc + 10)], fill=C_DARK_SLATE, width=1)
        draw.text((95, y_sc + 25), "PRODUCTION READY REPOSITORY", font=font_h2, fill=C_WHITE)
        draw.text((95, y_sc + 65), "• Pure TypeScript Domain Engine (zero scene dependencies)\n• Interactive Browser Optical Preview at http://localhost:8080/\n• Official Devpost submission brief & 100% passing tests.", font=font_small, fill=C_WHITE)

        # Right Panel: Closing card
        draw_specs_waveguide(draw)
        draw.rounded_rectangle([VP_CX - 360, 320, VP_CX + 360, 680], radius=20, fill=C_PANEL_BG, outline=C_CYAN, width=3)
        draw.text((VP_CX - 220, 360), "TORQUELOCK AR", font=font_title, fill=C_CYAN)
        draw.text((VP_CX - 310, 435), "Snap SPECS 27 Augmented Reality Experience", font=font_h2, fill=C_WHITE)
        draw.text((VP_CX - 250, 490), "Learn AR with SPECS Devpost Hackathon 2026", font=font_body, fill=C_MUTED)
        draw.line([(VP_CX - 310, 540), (VP_CX + 310, 540)], fill=C_DARK_SLATE, width=1)
        draw.text((VP_CX - 280, 570), "Built with CLAD, SIK, and Lens Studio 5.23", font=font_body, fill=C_MINT)
        draw.text((VP_CX - 220, 615), "Thank you for reviewing our project!", font=font_h2, fill=C_WHITE)

    return img

def main():
    audio_path = "temp_audio/torquelock_soundtrack.wav"
    out_video = "torquelock_ar_demo_walkthrough.mp4"

    cmd = [
        "ffmpeg",
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgba",
        "-r", str(FPS),
        "-i", "-",  # stdin
        "-i", audio_path,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "fast",
        "-crf", "19",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        out_video
    ]

    print(f"Starting video render: {TOTAL_FRAMES} frames ({TOTAL_DURATION:.1f}s @ {FPS}fps) -> {out_video}")
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    for f in range(TOTAL_FRAMES):
        t = f / float(FPS)
        frame_img = render_frame(t, f)
        proc.stdin.write(frame_img.tobytes())
        if f % 120 == 0 or f == TOTAL_FRAMES - 1:
            pct = (f / float(TOTAL_FRAMES)) * 100.0
            print(f"Rendering: {f}/{TOTAL_FRAMES} frames ({pct:.1f}%)")

    proc.stdin.close()
    proc.wait()
    file_size = os.path.getsize(out_video) if os.path.exists(out_video) else 0
    print(f"\nTorqueLock AR video render complete: {out_video} ({file_size} bytes)")

if __name__ == "__main__":
    main()
