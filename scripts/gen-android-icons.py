#!/usr/bin/env python3
"""Generate the Android launcher icons and splash screens from the club mark.

The mark mirrors public/favicon.svg exactly: an ink (#1b1b18) rounded square with
a paper (#f4f4f1) six-line asterisk. Everything is drawn from that geometry and
written straight into android/app/src/main/res, so there is no dependency on
@capacitor/assets / sharp (whose native binary won't install in every sandbox).

Run from anywhere:  python scripts/gen-android-icons.py
Requires Pillow:    python -m pip install pillow

The adaptive-icon background colour lives in
android/app/src/main/res/values/ic_launcher_background.xml (set to #1b1b18).
"""
import os
from PIL import Image, ImageDraw

INK = (27, 27, 24, 255)       # #1b1b18  brand ink
PAPER = (244, 244, 241, 255)  # #f4f4f1  brand paper
CLEAR = (0, 0, 0, 0)

RES = os.path.join(os.path.dirname(__file__), "..", "android", "app", "src", "main", "res")
MASTER = 1024  # supersampled master; every asset is downscaled from here with LANCZOS


def round_line(d, p0, p1, width, fill):
    """A line with round caps (PIL has no linecap, so cap it with circles)."""
    d.line([p0, p1], fill=fill, width=width)
    r = width / 2.0
    for x, y in (p0, p1):
        d.ellipse([x - r, y - r, x + r, y + r], fill=fill)


def box_pt(cx, cy, B, u, v):
    """Map a point (u,v) in the SVG's 64-unit box to a centered pixel coord."""
    return (cx - B / 2.0 + u * B / 64.0, cy - B / 2.0 + v * B / 64.0)


def draw_mark(d, cx, cy, B, color=PAPER):
    w = max(1, int(round(5 * B / 64.0)))
    for a, b in [((32, 16), (32, 48)), ((18.1, 24), (45.9, 40)), ((18.1, 40), (45.9, 24))]:
        round_line(d, box_pt(cx, cy, B, *a), box_pt(cx, cy, B, *b), w, color)


def draw_logo(d, cx, cy, L, square=INK, mark=PAPER):
    r = 14 / 64.0 * L
    d.rounded_rectangle([cx - L / 2, cy - L / 2, cx + L / 2, cy + L / 2], radius=r, fill=square)
    draw_mark(d, cx, cy, L, mark)


def new(size):
    img = Image.new("RGBA", (size, size), CLEAR)
    return img, ImageDraw.Draw(img)


def build_masters():
    sq, d = new(MASTER)          # legacy square icon: full favicon
    draw_logo(d, MASTER / 2, MASTER / 2, MASTER)

    rnd, d = new(MASTER)         # round icon: ink circle + mark
    d.ellipse([0, 0, MASTER, MASTER], fill=INK)
    draw_mark(d, MASTER / 2, MASTER / 2, MASTER, PAPER)

    fg, d = new(MASTER)          # adaptive foreground: mark only, inside the safe zone
    draw_mark(d, MASTER / 2, MASTER / 2, MASTER, PAPER)
    return sq, rnd, fg


def save(img, *parts):
    path = os.path.join(RES, *parts)
    img.save(path)
    return os.path.relpath(path, RES).replace("\\", "/")


def main():
    sq, rnd, fg = build_masters()

    # Legacy + round icons, and adaptive foreground, per density.
    launcher = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
    foreground = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}
    written = []
    for dens, s in launcher.items():
        written.append(save(sq.resize((s, s), Image.LANCZOS), f"mipmap-{dens}", "ic_launcher.png"))
        written.append(save(rnd.resize((s, s), Image.LANCZOS), f"mipmap-{dens}", "ic_launcher_round.png"))
    for dens, s in foreground.items():
        written.append(save(fg.resize((s, s), Image.LANCZOS), f"mipmap-{dens}", "ic_launcher_foreground.png"))

    # Splash screens: paper field with the logo centered. Sizes must match the
    # existing files so the resource graph stays intact.
    splashes = [
        ("drawable", 480, 320),
        ("drawable-land-mdpi", 480, 320),
        ("drawable-land-hdpi", 800, 480),
        ("drawable-land-xhdpi", 1280, 720),
        ("drawable-land-xxhdpi", 1600, 960),
        ("drawable-land-xxxhdpi", 1920, 1280),
        ("drawable-port-mdpi", 320, 480),
        ("drawable-port-hdpi", 480, 800),
        ("drawable-port-xhdpi", 720, 1280),
        ("drawable-port-xxhdpi", 960, 1600),
        ("drawable-port-xxxhdpi", 1280, 1920),
    ]
    for folder, w, h in splashes:
        ss = 2
        img = Image.new("RGBA", (w * ss, h * ss), PAPER)
        draw_logo(ImageDraw.Draw(img), w * ss / 2, h * ss / 2, min(w, h) * ss * 0.30)
        out = img.resize((w, h), Image.LANCZOS).convert("RGB")
        written.append(save(out, folder, "splash.png"))

    print(f"Wrote {len(written)} files:")
    for p in written:
        print("  ", p)


if __name__ == "__main__":
    main()
