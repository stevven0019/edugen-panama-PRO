# -*- coding: utf-8 -*-
"""
EduGen Panama - Vector Artwork Generator for Neighborhood Theme
Grade 4 • Scenario 1: A Walk in the Neighborhood
Handcrafted SVG vector graphics for 100% crisp printing at any resolution.
"""

NAVY = '#12285a'

def n_svg(n, size=80, extra=''):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 100 100" {extra}>{neighborhood_g(n)}</svg>'

def neighborhood_g(n):
    if n == 'park':
        # Green grassy hill, two lush trees, warm smiling sun, wooden bench
        return (
            '<circle cx="80" cy="24" r="14" fill="#fbc02d" opacity=".9"/>'
            '<path d="M0 90 Q 50 65 100 90 L 100 100 L 0 100 Z" fill="#81c784"/>'
            '<path d="M0 82 Q 50 55 100 82 L 100 100 L 0 100 Z" fill="#4caf50"/>'
            # Tree 1 (left)
            '<rect x="24" y="52" width="7" height="26" rx="2" fill="#795548"/>'
            '<circle cx="27" cy="46" r="18" fill="#2e7d32" stroke="#1b5e20" stroke-width="1.5"/>'
            '<circle cx="22" cy="40" r="11" fill="#43a047"/>'
            # Tree 2 (center-right)
            '<rect x="68" y="48" width="8" height="30" rx="2" fill="#5d4037"/>'
            '<circle cx="72" cy="40" r="22" fill="#388e3c" stroke="#1b5e20" stroke-width="1.5"/>'
            '<circle cx="76" cy="34" r="13" fill="#66bb6a"/>'
            # Bench
            '<rect x="38" y="70" width="24" height="4" rx="1.5" fill="#a1672f"/>'
            '<line x1="42" y1="74" x2="42" y2="84" stroke="#424242" stroke-width="2.5"/>'
            '<line x1="58" y1="74" x2="58" y2="84" stroke="#424242" stroke-width="2.5"/>'
        )
    if n == 'playground':
        # A-frame swing set with two swings + slide
        return (
            '<rect x="0" y="86" width="100" height="14" rx="4" fill="#81c784"/>'
            # Swing frame
            '<line x1="10" y1="86" x2="26" y2="24" stroke="#e53935" stroke-width="3.5" stroke-linecap="round"/>'
            '<line x1="42" y1="86" x2="26" y2="24" stroke="#e53935" stroke-width="3.5" stroke-linecap="round"/>'
            '<line x1="20" y1="24" x2="68" y2="24" stroke="#e53935" stroke-width="4" stroke-linecap="round"/>'
            '<line x1="52" y1="86" x2="68" y2="24" stroke="#e53935" stroke-width="3.5" stroke-linecap="round"/>'
            '<line x1="84" y1="86" x2="68" y2="24" stroke="#e53935" stroke-width="3.5" stroke-linecap="round"/>'
            # Swings
            '<line x1="34" y1="26" x2="33" y2="60" stroke="#757575" stroke-width="1.5"/>'
            '<line x1="44" y1="26" x2="43" y2="60" stroke="#757575" stroke-width="1.5"/>'
            '<rect x="30" y="60" width="17" height="4.5" rx="1.5" fill="#fdd835" stroke="#f57f17" stroke-width="1"/>'
            # Slide
            '<path d="M72 86 L 86 50 L 94 86" stroke="#1e88e5" stroke-width="3" fill="none"/>'
            '<path d="M86 50 Q 94 65 98 86" stroke="#fb8c00" stroke-width="4.5" fill="none" stroke-linecap="round"/>'
        )
    if n == 'street':
        # Road with perspective, yellow dashed dividing line, zebra crosswalk, and small red car
        return (
            '<rect x="0" y="0" width="100" height="100" rx="14" fill="#e8f5e9"/>'
            # Sidewalks
            '<rect x="8" y="0" width="84" height="100" fill="#cfd8dc"/>'
            # Asphalt
            '<rect x="18" y="0" width="64" height="100" fill="#455a64"/>'
            # Zebra crosswalk
            '<line x1="22" y1="20" x2="34" y2="20" stroke="#ffffff" stroke-width="4"/>'
            '<line x1="42" y1="20" x2="54" y2="20" stroke="#ffffff" stroke-width="4"/>'
            '<line x1="62" y1="20" x2="74" y2="20" stroke="#ffffff" stroke-width="4"/>'
            # Dashed line
            '<line x1="50" y1="36" x2="50" y2="50" stroke="#fbc02d" stroke-width="3"/>'
            '<line x1="50" y1="62" x2="50" y2="76" stroke="#fbc02d" stroke-width="3"/>'
            '<line x1="50" y1="88" x2="50" y2="100" stroke="#fbc02d" stroke-width="3"/>'
            # Cute car
            '<rect x="30" y="62" width="22" height="16" rx="4" fill="#e53935"/>'
            '<rect x="34" y="66" width="14" height="6" rx="2" fill="#e1f5fe"/>'
            '<circle cx="33" cy="78" r="3" fill="#212121"/>'
            '<circle cx="49" cy="78" r="3" fill="#212121"/>'
        )
    if n == 'building':
        # Modern tall apartment / library building with windows and glass door
        return (
            '<rect x="0" y="86" width="100" height="14" fill="#90a4ae"/>'
            # Building body
            '<rect x="20" y="14" width="60" height="74" rx="4" fill="#42a5f5" stroke="#1565c0" stroke-width="2.5"/>'
            # Roof top feature
            '<rect x="36" y="8" width="28" height="6" rx="2" fill="#1565c0"/>'
            # Windows grid (3 rows x 3 cols)
            + ''.join(
                f'<rect x="{28 + c*16}" y="{22 + r*16}" width="10" height="10" rx="2" fill="#ffffff" stroke="#bbdefb" stroke-width="1"/>'
                for r in range(3) for c in range(3)
            ) +
            # Front door
            '<rect x="42" y="70" width="16" height="18" rx="2" fill="#fdd835" stroke="#f57f17" stroke-width="1.5"/>'
            '<line x1="50" y1="70" x2="50" y2="88" stroke="#f57f17" stroke-width="1"/>'
        )
    if n == 'tree':
        # Big leafy neighborhood shade tree
        return (
            '<path d="M10 92 Q 50 82 90 92 L 90 100 L 10 100 Z" fill="#81c784"/>'
            '<rect x="44" y="52" width="12" height="42" rx="3" fill="#6d4c41"/>'
            '<path d="M44 64 Q 30 54 26 48" stroke="#6d4c41" stroke-width="4" fill="none" stroke-linecap="round"/>'
            '<path d="M56 60 Q 70 52 74 46" stroke="#6d4c41" stroke-width="4" fill="none" stroke-linecap="round"/>'
            '<circle cx="50" cy="40" r="28" fill="#43a047" stroke="#2e7d32" stroke-width="2"/>'
            '<circle cx="34" cy="32" r="16" fill="#66bb6a"/>'
            '<circle cx="66" cy="32" r="16" fill="#388e3c"/>'
            '<circle cx="50" cy="22" r="15" fill="#81c784"/>'
        )
    if n == 'flower':
        # Bright smiling tropical flower
        petals = ''.join(
            f'<ellipse cx="50" cy="24" rx="8" ry="14" fill="#e91e63" transform="rotate({a} 50 50)"/>'
            for a in range(0, 360, 45)
        )
        return (
            '<path d="M50 50 Q 45 74 50 94" stroke="#43a047" stroke-width="4" fill="none"/>'
            '<path d="M48 72 Q 30 68 28 60 Q 40 60 48 72 Z" fill="#66bb6a"/>'
            '<path d="M50 78 Q 68 76 70 68 Q 60 66 50 78 Z" fill="#43a047"/>'
            + petals +
            '<circle cx="50" cy="50" r="14" fill="#fdd835" stroke="#f57f17" stroke-width="2"/>'
            '<circle cx="45" cy="48" r="2" fill="#333"/>'
            '<circle cx="55" cy="48" r="2" fill="#333"/>'
            '<path d="M46 54 Q 50 58 54 54" stroke="#333" stroke-width="1.5" fill="none" stroke-linecap="round"/>'
        )
    return ''

def person_g(shirt='#1e88e5', hair='#3e2723', apron=None, cap=None, bandana=False, pig=False):
    s = f'<rect x="22" y="68" width="56" height="44" rx="18" fill="{shirt}"/>'
    if apron:
        s += f'<path d="M32 74 h36 v38 h-36 z" fill="{apron}"/><path d="M34 74 L42 66 M66 74 L58 66" stroke="{apron}" stroke-width="4"/>'
    s += '<rect x="43" y="58" width="14" height="14" rx="5" fill="#eeb98c"/>'
    if pig:
        s += f'<circle cx="21" cy="52" r="9" fill="{hair}"/><circle cx="79" cy="52" r="9" fill="{hair}"/>'
    s += '<circle cx="50" cy="40" r="27" fill="#f6cba2" stroke="#e0a97a" stroke-width="1.5"/>'
    if cap:
        s += f'<path d="M23 36 C 24 8, 76 8, 77 36 Z" fill="{cap}"/><ellipse cx="68" cy="35" rx="23" ry="5" fill="{cap}"/>'
    elif bandana:
        s += f'<path d="M23 38 C 24 8, 76 8, 77 38 C 62 26, 38 26, 23 38 Z" fill="#43a047"/>' + ''.join(f'<circle cx="{x}" cy="{y}" r="2.3" fill="#fff"/>' for x, y in [(34, 24), (48, 17), (62, 22), (72, 30), (28, 32), (55, 28)])
    else:
        s += f'<path d="M23 40 C 20 8, 80 8, 77 40 C 72 26, 58 20, 48 22 C 38 24, 28 28, 23 40 Z" fill="{hair}"/>'
    s += (
        '<circle cx="40" cy="43" r="3.4" fill="#222"/><circle cx="60" cy="43" r="3.4" fill="#222"/>'
        '<circle cx="41" cy="42" r="1.1" fill="#fff"/><circle cx="61" cy="42" r="1.1" fill="#fff"/>'
        '<ellipse cx="33" cy="52" rx="5" ry="3" fill="#ff9e9e" opacity=".65"/><ellipse cx="67" cy="52" rx="5" ry="3" fill="#ff9e9e" opacity=".65"/>'
        '<path d="M40 53 Q50 65 60 53 Z" fill="#c62828"/><path d="M44 57 Q50 61 56 57 Q50 58 44 57Z" fill="#fff"/>'
    )
    return s

def person(size=110, **k):
    return f'<svg width="{size}" height="{size*1.1:.0f}" viewBox="0 0 100 110">{person_g(**k)}</svg>'

BOY_LUCAS = dict(shirt='#1e88e5', hair='#3e2723')
GIRL_MIA = dict(shirt='#f06292', hair='#212121', pig=True)

def awning(w=816, h=56, cols=('#2a9d8f', '#457b9d', '#e9c46a', '#f4a261', '#e76f51')):
    n = int(w / 68) + 1
    sw = w / n
    s = ''
    for i in range(n):
        x = i * sw
        s += f'<path d="M{x:.1f} 0 h{sw:.1f} v{h - sw/2:.1f} a{sw/2:.1f} {sw/2:.1f} 0 0 1 {-sw:.1f} 0 z" fill="{cols[i % len(cols)]}"/>'
    return f'<svg width="{w}" height="{h + 8}" viewBox="0 0 {w} {h + 8}">{s}</svg>'

def badge_tag(text, color='#2a9d8f', w=110):
    return (
        f'<svg width="{w}" height="{w*0.4:.0f}" viewBox="0 0 120 48">'
        f'<rect x="2" y="4" width="116" height="40" rx="20" fill="{color}" stroke="#ffffff" stroke-width="2"/>'
        f'<text x="60" y="28" text-anchor="middle" font-family="Poppins" font-weight="700" font-size="14" fill="#ffffff">{text}</text>'
        f'</svg>'
    )

def park_scene(w=330, h=300):
    # Illustrated park scene with sunny sky, hill, green trees, bench, children walking
    s = (
        f'<rect width="330" height="300" rx="18" fill="#e0f2fe"/>'
        f'<circle cx="280" cy="46" r="28" fill="#fbc02d" opacity=".9"/>'
        f'<circle cx="60" cy="50" r="20" fill="#ffffff" opacity=".8"/>'
        f'<circle cx="86" cy="54" r="16" fill="#ffffff" opacity=".8"/>'
        f'<ellipse cx="50" cy="180" rx="90" ry="70" fill="#81c784"/>'
        f'<ellipse cx="280" cy="170" rx="100" ry="80" fill="#a5d6a7"/>'
        f'<rect x="0" y="220" width="330" height="80" fill="#4caf50"/>'
        # Trees
        f'<rect x="40" y="90" width="10" height="130" fill="#795548"/>'
        f'<circle cx="45" cy="80" r="44" fill="#2e7d32"/>'
        f'<circle cx="54" cy="70" r="30" fill="#388e3c"/>'
        f'<rect x="250" y="100" width="10" height="120" fill="#795548"/>'
        f'<circle cx="255" cy="90" r="40" fill="#2e7d32"/>'
        # Flowers in grass
        f'<circle cx="120" cy="250" r="5" fill="#e91e63"/>'
        f'<circle cx="140" cy="265" r="5" fill="#fdd835"/>'
        f'<circle cx="180" cy="255" r="5" fill="#e91e63"/>'
        f'<circle cx="205" cy="268" r="5" fill="#00bcd4"/>'
        # Characters
        f'<g transform="translate(90 142) scale(1.1)">{person_g(**BOY_LUCAS)}</g>'
        f'<g transform="translate(160 142) scale(1.1)">{person_g(**GIRL_MIA)}</g>'
    )
    return f'<svg width="{w}" height="{h}" viewBox="0 0 330 300">{s}</svg>'

def star(sz=40):
    return (
        f'<svg width="{sz}" height="{sz}" viewBox="0 0 40 40">'
        f'<circle cx="20" cy="20" r="19" fill="#f59e0b"/>'
        f'<path d="M20 7 l3.8 8 8.7 1.1 -6.4 6 1.7 8.7 -7.8-4.3 -7.8 4.3 1.7-8.7 -6.4-6 8.7-1.1z" fill="#fff"/>'
        f'</svg>'
    )

def pencil(sz=60):
    return (
        f'<svg width="{sz}" height="{sz}" viewBox="0 0 64 64">'
        f'<circle cx="32" cy="32" r="30" fill="#bbdefb" stroke="#64b5f6" stroke-width="2"/>'
        f'<g transform="rotate(40 32 32)">'
        f'<rect x="26" y="10" width="12" height="34" fill="#1e88e5"/>'
        f'<path d="M26 44 h12 l-6 12 z" fill="#ffcc80"/>'
        f'<path d="M30 52 h4 l-2 4z" fill="#37474f"/>'
        f'<rect x="26" y="8" width="12" height="6" fill="#ef9a9a"/>'
        f'</g></svg>'
    )

def dice(val=3, sz=50):
    # Cute rounded colorful die
    pips = {
        1: '<circle cx="30" cy="30" r="5" fill="#ffffff"/>',
        2: '<circle cx="18" cy="18" r="4.5" fill="#ffffff"/><circle cx="42" cy="42" r="4.5" fill="#ffffff"/>',
        3: '<circle cx="16" cy="16" r="4" fill="#ffffff"/><circle cx="30" cy="30" r="4" fill="#ffffff"/><circle cx="44" cy="44" r="4" fill="#ffffff"/>',
        4: '<circle cx="18" cy="18" r="4" fill="#ffffff"/><circle cx="42" cy="18" r="4" fill="#ffffff"/><circle cx="18" cy="42" r="4" fill="#ffffff"/><circle cx="42" cy="42" r="4" fill="#ffffff"/>',
        5: '<circle cx="16" cy="16" r="3.8" fill="#ffffff"/><circle cx="44" cy="16" r="3.8" fill="#ffffff"/><circle cx="30" cy="30" r="3.8" fill="#ffffff"/><circle cx="16" cy="44" r="3.8" fill="#ffffff"/><circle cx="44" cy="44" r="3.8" fill="#ffffff"/>',
        6: '<circle cx="18" cy="14" r="3.5" fill="#ffffff"/><circle cx="42" cy="14" r="3.5" fill="#ffffff"/><circle cx="18" cy="30" r="3.5" fill="#ffffff"/><circle cx="42" cy="30" r="3.5" fill="#ffffff"/><circle cx="18" cy="46" r="3.5" fill="#ffffff"/><circle cx="42" cy="46" r="3.5" fill="#ffffff"/>',
    }
    return (
        f'<svg width="{sz}" height="{sz}" viewBox="0 0 60 60">'
        f'<rect x="4" y="4" width="52" height="52" rx="12" fill="#e76f51" stroke="#b23b18" stroke-width="2.5"/>'
        f'<rect x="6" y="6" width="48" height="24" rx="8" fill="#f4a261" opacity=".4"/>'
        f'{pips.get(val, pips[3])}'
        f'</svg>'
    )

def spinner(sz=110):
    # Circular spinner for pencil + paperclip
    return (
        f'<svg width="{sz}" height="{sz}" viewBox="0 0 120 120">'
        f'<circle cx="60" cy="60" r="56" fill="#f8fafc" stroke="#334155" stroke-width="3"/>'
        # 4 slices: 1, 2, 3, 4
        f'<path d="M60 60 L60 4 A56 56 0 0 1 116 60 Z" fill="#fee2e2"/>'
        f'<path d="M60 60 L116 60 A56 56 0 0 1 60 116 Z" fill="#fef3c7"/>'
        f'<path d="M60 60 L60 116 A56 56 0 0 1 4 60 Z" fill="#dcfce7"/>'
        f'<path d="M60 60 L4 60 A56 56 0 0 1 60 4 Z" fill="#e0e7ff"/>'
        f'<line x1="60" y1="4" x2="60" y2="116" stroke="#475569" stroke-width="2"/>'
        f'<line x1="4" y1="60" x2="116" y2="60" stroke="#475569" stroke-width="2"/>'
        # Numbers
        f'<text x="84" y="44" font-family="Fredoka" font-size="20" font-weight="700" fill="#dc2626" text-anchor="middle">1</text>'
        f'<text x="84" y="90" font-family="Fredoka" font-size="20" font-weight="700" fill="#d97706" text-anchor="middle">2</text>'
        f'<text x="36" y="90" font-family="Fredoka" font-size="20" font-weight="700" fill="#16a34a" text-anchor="middle">3</text>'
        f'<text x="36" y="44" font-family="Fredoka" font-size="20" font-weight="700" fill="#4f46e5" text-anchor="middle">4</text>'
        # Center target for pencil
        f'<circle cx="60" cy="60" r="10" fill="#0f172a"/>'
        f'<circle cx="60" cy="60" r="4" fill="#ffffff"/>'
        f'</svg>'
    )

def puppy(sz=70):
    # Cute little puppy Sparky
    return (
        f'<svg width="{sz}" height="{sz}" viewBox="0 0 80 80">'
        f'<rect width="80" height="80" rx="16" fill="#fef3c7" opacity=".3"/>'
        # Head
        f'<ellipse cx="40" cy="42" rx="22" ry="18" fill="#d97706"/>'
        # Snout
        f'<ellipse cx="40" cy="48" rx="11" ry="8" fill="#fde68a"/>'
        f'<ellipse cx="40" cy="44" rx="4" ry="3" fill="#1e293b"/>'
        # Tongue
        f'<path d="M38 52 q2 4 4 0" stroke="#f43f5e" stroke-width="3" fill="none" stroke-linecap="round"/>'
        # Eyes
        f'<circle cx="32" cy="38" r="3.5" fill="#1e293b"/>'
        f'<circle cx="48" cy="38" r="3.5" fill="#1e293b"/>'
        f'<circle cx="33" cy="37" r="1.2" fill="#ffffff"/>'
        f'<circle cx="49" cy="37" r="1.2" fill="#ffffff"/>'
        # Ears (floppy)
        f'<ellipse cx="20" cy="36" rx="6" ry="12" fill="#b45309" transform="rotate(-20 20 36)"/>'
        f'<ellipse cx="60" cy="36" rx="6" ry="12" fill="#b45309" transform="rotate(20 60 36)"/>'
        # Collar with star
        f'<rect x="28" y="58" width="24" height="5" rx="2" fill="#dc2626"/>'
        f'<circle cx="40" cy="63" r="3" fill="#fbbf24"/>'
        f'</svg>'
    )

def magnifying_glass(sz=60):
    return (
        f'<svg width="{sz}" height="{sz}" viewBox="0 0 60 60">'
        f'<circle cx="26" cy="26" r="16" fill="#e0f2fe" stroke="#0284c7" stroke-width="4"/>'
        f'<path d="M20 18 a10 10 0 0 1 12 0" stroke="#bae6fd" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
        f'<line x1="38" y1="38" x2="52" y2="52" stroke="#475569" stroke-width="6" stroke-linecap="round"/>'
        f'<line x1="38" y1="38" x2="43" y2="43" stroke="#f59e0b" stroke-width="6"/>'
        f'</svg>'
    )

def traffic_light(sz=50):
    return (
        f'<svg width="{sz}" height="{sz}" viewBox="0 0 40 60">'
        f'<rect x="8" y="4" width="24" height="52" rx="8" fill="#1e293b"/>'
        f'<circle cx="20" cy="14" r="6" fill="#ef4444"/>'
        f'<circle cx="20" cy="30" r="6" fill="#f59e0b"/>'
        f'<circle cx="20" cy="46" r="6" fill="#22c55e"/>'
        f'</svg>'
    )

def explorer_badge(sz=75):
    return (
        f'<svg width="{sz}" height="{sz}" viewBox="0 0 80 80">'
        # Ribbon tails
        f'<path d="M28 50 L20 74 L32 68 L40 74 L36 50 Z" fill="#b91c1c"/>'
        f'<path d="M52 50 L60 74 L48 68 L40 74 L44 50 Z" fill="#991b1b"/>'
        # Outer rosette
        f'<circle cx="40" cy="36" r="28" fill="#fbbf24" stroke="#d97706" stroke-width="3"/>'
        f'<circle cx="40" cy="36" r="23" fill="#f59e0b"/>'
        # Inner star
        f'<path d="M40 18 L44 28 L54 29 L46 36 L48 46 L40 40 L32 46 L34 36 L26 29 L36 28 Z" fill="#ffffff"/>'
        f'</svg>'
    )

