# -*- coding: utf-8 -*-
"""
EduGen Panama - Grade 4 Scenario 1 Theme 1 Master Activity Packet Builder
Curriculum: Scenario 1 "A Walk in the Neighborhood" • Theme 1: "This Is My Favorite."
Architecture: Pure vector SVG + pixel-perfect 816px x 1056px Canva-style layout (based on build.py).
Compiles into public/Grade_4_Scenario_1_Theme_1_AWalkInTheNeighborhood_Worksheet_Packet.pdf
"""

import os
import subprocess
from art_neighborhood import (
    n_svg, person, BOY_LUCAS, GIRL_MIA, awning, badge_tag,
    park_scene, star, pencil, NAVY
)

BASE_DIR = r"c:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas"
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

N = NAVY

CSS = '''
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

@page {
  size: 816px 1056px;
  margin: 0;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  color: #12285a;
  font-size: 15px;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.page {
  width: 816px;
  height: 1056px;
  position: relative;
  overflow: hidden;
  page-break-after: always;
  background: #fffaf0;
}
.abs {
  position: absolute;
}
.card {
  position: absolute;
  background: #fff;
  border: 3px solid #8bc34a;
  border-radius: 22px;
}
.pill {
  position: absolute;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 6px 18px;
  border-radius: 20px;
}
.rib {
  position: absolute;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  padding: 6px 22px 6px 16px;
  text-transform: uppercase;
}
.title {
  position: absolute;
  left: 0;
  width: 816px;
  text-align: center;
  font-weight: 700;
  color: #12285a;
  line-height: 1.08;
}
.blk {
  display: inline-block;
  border-bottom: 2.5px solid #12285a;
  height: 20px;
  vertical-align: baseline;
}
.gl {
  position: relative;
  height: 50px;
  border-top: 2.5px solid #64b5f6;
  border-bottom: 2.5px solid #ef9a9a;
}
.gl i {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-top: 1.5px dashed #90caf9;
}
.num {
  display: inline-block;
  width: 34px;
  height: 34px;
  border-radius: 17px;
  color: #fff;
  font-weight: 700;
  text-align: center;
  line-height: 34px;
  font-size: 17px;
}
.chip {
  display: inline-block;
  border: 2.5px solid #12285a;
  background: #fff;
  border-radius: 12px;
  padding: 5px 14px;
  font-weight: 700;
  margin: 3px 4px;
  font-size: 16px;
}
.big {
  font-weight: 700;
  font-size: 21px;
}
.dot {
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 7px;
  background: #43a047;
}
.sp {
  font-weight: 700;
}
.cb {
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 2.5px solid #43a047;
  border-radius: 8px;
  background: #fff;
}
'''

def page(body):
    return f'<div class="page">{body}</div>'

def top():
    return f'<div class="abs" style="left:0;top:0">{awning()}</div>'

def card(l, t, w, h, inner, color='#8bc34a', extra=''):
    return f'<div class="card" style="left:{l}px;top:{t}px;width:{w}px;height:{h}px;border-color:{color};{extra}">{inner}</div>'

def rib(l, t, txt, color):
    return f'<div class="rib" style="left:{l}px;top:{t}px;background:{color};border-radius:0 8px 8px 0;">{txt}</div>'

def pill(l, r, t, txt, color, side='l'):
    pos = f'left:{l}px' if side == 'l' else f'right:{r}px'
    return f'<div class="pill" style="{pos};top:{t}px;background:{color}">{txt}</div>'

def blank(w):
    return f'<span class="blk" style="width:{w}px"></span>'

def ab(l, t, inner, extra=''):
    return f'<div class="abs" style="left:{l}px;top:{t}px;{extra}">{inner}</div>'

def title(t, txt, size=52):
    return f'<div class="title" style="top:{t}px;font-size:{size}px">{txt}</div>'

def pagenum(n):
    return f'<div class="abs" style="right:34px;bottom:12px;font-size:11px;color:#8a97b5">Scenario 1 &bull; Theme 1 &bull; Page {n}</div>'

def build_packet():
    pages = []

    # =========================================================================
    # PAGE 1: STAGE 1 - WARM-UP & MODELING (VOCABULARY & PENMANSHIP)
    # =========================================================================
    words = ['park', 'playground', 'street', 'building', 'tree', 'flower']
    grid = ''
    for i, w in enumerate(words):
        c, r = i % 3, i // 3
        grid += card(
            24 + c * 142, 66 + r * 158, 132, 148,
            f'<div style="text-align:center;padding-top:10px">{n_svg(w, 84)}<div style="font-weight:700;font-size:16px;margin-top:2px">{w}</div></div>',
            extra='border-radius:16px;border-width:2px'
        )

    p1 = top() + pill(30, 0, 76, 'Scenario 1 • A Walk in the Neighborhood', '#2e7d32') + pill(0, 30, 76, 'Grade 4 • A1.2', '#29a8e0', 'r')
    p1 += title(118, 'Today I Can Explore<br>My Neighborhood!', 48)

    # Warm-up card
    inner = rib(-3, 14, 'Warm-up: Neighborhood Places', '#43a047') + grid
    inner += '<div class="abs" style="left:462px;top:16px;width:270px;text-align:center;font-weight:700;font-size:17px">What is your favorite place?</div>'
    inner += ab(470, 50, f'<div style="text-align:center">{n_svg("park", 140)}</div>')
    inner += '<div class="abs" style="left:464px;top:204px;width:268px;height:136px;border:2.5px dashed #8bc34a;border-radius:16px;background:#f8fafc;display:flex;align-items:center;justify-content:center;font-weight:700;color:#64748b;font-size:13px;text-align:center;padding:10px">Draw or paste your favorite neighborhood place here!</div>'
    inner += '<div class="abs" style="left:450px;top:14px;height:330px;border-left:2.5px dashed #8bc34a"></div>'
    p1 += card(30, 262, 756, 372, inner)

    # Writing practice with handwriting guidelines
    wp = rib(-3, 14, 'Writing practice', '#29a8e0') + ab(24, 62, '<span style="font-weight:700;font-size:17px">Copy the target words on the guidelines.</span>')
    for i, wd in enumerate(['park', 'playground', 'street']):
        y = 104 + i * 74
        wp += ab(26, y + 2, f'<span style="font-size:34px;font-weight:700">{wd}</span>') + ab(300, y, '<div class="gl" style="width:424px;height:56px"><i></i></div>')
    p1 += card(30, 648, 756, 318, wp, color='#64b5f6')

    # Footer banner
    p1 += '<div class="abs" style="left:300px;top:980px;width:216px;height:66px;background:#2b3a42;border:4px solid #a1672f;border-radius:12px;text-align:center;color:#fff;font-weight:700;font-size:16px;line-height:1.2;padding-top:10px">Clean, Green<br>& Safe!</div>'
    p1 += pagenum(1)
    pages.append(page(p1))

    # =========================================================================
    # PAGE 2: STAGE 2 - PRESENTATION & LOOK AND WRITE (OPINIONS & 'BECAUSE')
    # =========================================================================
    p2 = top() + title(78, 'Look and Learn: In the Neighborhood', 38)
    p2 += ab(30, 146, park_scene(330, 290))

    dl = rib(-3, 12, 'Presentation: Read and Learn', '#42a5f5')
    dialogue_lines = [
        ('Lucas:', 'Hello Mia! Look at our neighborhood today. What is your favorite place?', '#12285a'),
        ('Mia:', 'My favorite place is Sunshine Park because it has tall trees and beautiful flowers!', '#2e7d32'),
        ('Lucas:', 'I like Joy Playground the best because it has big swings and slides!', '#12285a'),
        ('Mia:', 'Our neighborhood is clean and friendly. Let’s explore together!', '#2e7d32')
    ]
    y = 56
    for sp, tx, col in dialogue_lines:
        dl += f'<div class="abs" style="left:16px;top:{y}px;width:350px;font-size:14px;line-height:1.35"><span class="sp" style="color:{col}">{sp}</span> <b>{tx}</b></div>'
        y += 54 if len(tx) > 60 else 44
    p2 += card(380, 146, 406, 290, dl, color='#42a5f5')

    # Comprehension questions
    q = rib(-3, 12, 'Read and answer', '#7e57c2')
    q += ab(24, 56, f'<span class="num" style="background:#7e57c2">1</span> <b>What is Mia’s favorite place?</b> {blank(220)}')
    q += ab(24, 100, f'<span class="num" style="background:#7e57c2">2</span> <b>Why does Lucas like the playground?</b> Because it has {blank(180)}')
    p2 += card(30, 452, 756, 156, q, color='#9575cd')

    # Write the opinion
    wr = rib(-3, 12, 'Write the opinion', '#fbc02d').replace('color:#fff', 'color:#12285a')
    opinion_items = [
        ('park', 'Sunshine Park — The best place!', True),
        ('playground', 'Joy Playground — It is fun because it has swings.', False),
        ('street', 'Oak Street — It is safe because it is clean.', False)
    ]
    for i, (item_name, label_text, is_example) in enumerate(opinion_items):
        y = 58 + i * 86
        wr += ab(20, y, n_svg(item_name, 64))
        if is_example:
            wr += ab(100, y + 8, f'<div style="border:2.5px solid #fbc02d;border-radius:14px;padding:8px 18px;font-weight:700;font-size:20px;width:480px;background:#fffde7">{label_text}</div>')
            wr += ab(600, y + 16, '<span style="color:#8a97b5;font-size:13px;font-weight:700">&larr; example</span>')
        else:
            wr += ab(100, y + 6, f'<div style="font-weight:700;font-size:18px;color:#12285a">{blank(220)} — because {blank(210)}</div>')
    p2 += card(30, 624, 756, 368, wr, color='#fbc02d')
    p2 += pagenum(2)
    pages.append(page(p2))

    # =========================================================================
    # PAGE 3: STAGE 3 - PRACTICE PART 1 (MATCH, MISSING LETTERS, SCRAMBLE)
    # =========================================================================
    p3 = top() + title(76, '<span style="color:#2e7d32">Practice 1:</span> Match and Complete', 36)

    # Match Part (Scrambled words!)
    m = rib(-3, 12, 'Match', '#43a047') + ab(24, 52, '<b>Match each picture to the correct word.</b> (Trace lines between the dots!)')
    scrambled_words = ['building', 'park', 'playground', 'street']
    match_pics = ['playground', 'street', 'park', 'building']
    for i, f in enumerate(match_pics):
        y = 86 + i * 58
        m += ab(24, y + 10, f'<span class="num" style="background:#43a047">{i+1}</span>') + ab(72, y - 2, n_svg(f, 54))
        m += f'<div class="dot" style="left:300px;top:{y+20}px"></div><div class="dot" style="left:440px;top:{y+20}px"></div>'
        m += ab(480, y + 8, f'<span style="font-size:24px;font-weight:700">{scrambled_words[i]}</span>')
    p3 += card(30, 126, 756, 326, m)

    # Complete missing letters
    c = rib(-3, 12, 'Complete', '#29a8e0') + ab(24, 50, '<b>Write the missing letters.</b>')
    missing_words = [
        ('P _ R K', '  (green nature place)'),
        ('P L _ Y G R _ U N D', '  (swings & slides)'),
        ('S T R _ _ T', '  (road for cars and bikes)'),
        ('B _ I L D I N G', '  (tall library or house)')
    ]
    for i, (w, note) in enumerate(missing_words):
        y = 82 + i * 36
        c += ab(24, y, f'<span class="num" style="background:#29a8e0">{i+1}</span>') + ab(72, y - 4, f'<span style="font-size:24px;font-weight:700;letter-spacing:2px">{w}</span><span style="font-size:12px;color:#5c6b8f">{note}</span>')
    c += ab(490, 48, n_svg('tree', 110))
    p3 += card(30, 464, 756, 260, c, color='#64b5f6')

    # Sentence scramble
    s = rib(-3, 12, 'Sentence scramble', '#ff8a3d') + ab(24, 50, '<b>Put the word chips in order. Write the sentence.</b>')
    scramble_sentences = [
        ['The park', 'is', 'the best', 'place.'],
        ['I like it', 'because', 'it has', 'swings.']
    ]
    for i, ws in enumerate(scramble_sentences):
        y = 86 + i * 86
        s += ab(24, y, f'<span class="num" style="background:#ff8a3d">{i+1}</span> ' + ''.join(f'<span class="chip">{w}</span>' for w in ws))
        s += ab(24, y + 42, '<div style="width:700px;height:34px;border-bottom:2.5px solid #64b5f6"></div>')
    p3 += card(30, 736, 756, 280, s, color='#ffb27a')
    p3 += pagenum(3)
    pages.append(page(p3))

    # =========================================================================
    # PAGE 4: STAGE 3 - PRACTICE PART 2 (NEIGHBORHOOD DIALOGUE & WORD BANK)
    # =========================================================================
    p4 = top() + title(76, '<span style="color:#2e7d32">Practice 2:</span> Neighborhood Dialogue', 33)
    p4 += ab(0, 128, '<div style="width:816px;text-align:center;font-weight:700;font-size:16px">Use the word bank to complete the dialogue between Lucas and Mia.</div>')

    dialogue_cards = [
        ('Lucas', BOY_LUCAS, 'Hello Mia! What is your favorite place?', 0, '', '#e3f2fd', '#42a5f5'),
        ('Mia', GIRL_MIA, 'My favorite place is the', 140, 'because it is quiet.', '#fce4ec', '#f06292'),
        ('Lucas', BOY_LUCAS, 'I like the', 140, 'the best because it has swings!', '#e3f2fd', '#42a5f5'),
        ('Mia', GIRL_MIA, 'Our neighborhood is', 120, 'and safe.', '#fce4ec', '#f06292')
    ]
    for i, (who, pp, txt, bw, end, bg, bc) in enumerate(dialogue_cards):
        y = 166 + i * 128
        p4 += ab(36 if who == 'Lucas' else 676, y, person(100, **pp))
        left = 150 if who == 'Lucas' else 36
        bubble = f'<div style="font-weight:700;font-size:12px;color:{bc};margin-bottom:4px">{who.upper()}</div><span class="big">{txt} </span>'
        if bw > 0:
            bubble += blank(bw) + f'<span class="big"> {end}</span>'
        p4 += ab(left, y + 4, f'<div style="width:630px;height:100px;background:{bg};border:3px solid {bc};border-radius:24px;padding:14px 22px">{bubble}</div>')

    # Word Bank
    wb = rib(-3, 12, 'Word bank', '#43a047')
    chips = ''.join(f'<span class="chip" style="font-size:18px;margin:5px 8px">{w}</span>' for w in ['park', 'playground', 'street', 'clean', 'swings', 'best'])
    wb += ab(20, 58, f'<div style="width:700px;text-align:center">{chips}</div>')
    p4 += card(30, 686, 756, 130, wb)

    # Supported Option
    sup = ab(18, 12, pencil(58)) + ab(96, 10, '<b>Supported option:</b> trace or copy the words.<br><b>Choose and label 3 neighborhood places.</b>')
    for i, f in enumerate(['park', 'playground', 'street']):
        sup += ab(440 + i * 100, 6, n_svg(f, 50)) + ab(430 + i * 100, 64, '<div style="width:84px;border-bottom:2.5px solid #12285a;height:20px"></div>')
    p4 += card(30, 830, 756, 126, sup, color='#64b5f6', extra='background:#e3f2fd')
    p4 += pagenum(4)
    pages.append(page(p4))

    # =========================================================================
    # PAGE 5: STAGE 4 - ACTION-ORIENTED PRODUCTION (MY FAVORITE PLACES)
    # =========================================================================
    p5 = top() + ab(0, 76, '<div style="width:816px;text-align:center"><span class="pill" style="position:static;background:#43a047">Lesson 1</span><div style="font-weight:700;font-size:16px;margin-top:8px">This Is My Favorite!</div></div>')
    p5 += title(138, 'My Favorite Places', 56)
    p5 += ab(150, 222, '<div style="width:516px;text-align:center;background:#7cb342;color:#fff;font-weight:700;padding:7px;border-radius:6px">Write three sentences about places you like.</div>')

    task_colors = ['#ef5350', '#42a5f5', '#7cb342']
    sentence_prompts = [
        'My favorite place is the',
        'I like it because it has',
        'The street is safe because it is'
    ]
    for i in range(3):
        y = 280 + i * 168
        p5 += ab(34, y + 44, f'<span class="num" style="background:{task_colors[i]};width:40px;height:40px;line-height:40px;border-radius:20px;font-size:20px">{i+1}</span>')
        p5 += ab(90, y + 46, f'<span class="big" style="font-size:22px">{sentence_prompts[i]} {blank(130)}.</span>')
        p5 += card(450, y, 336, 148, '<div style="text-align:center;font-weight:700;font-size:13px;margin-top:8px">Draw it!</div>', color='#8bc34a', extra='border-radius:18px')

    p5 += ab(40, 786, n_svg('park', 130))
    p5 += ab(630, 786, n_svg('playground', 130))
    p5 += ab(30, 976, f'<div style="width:756px;height:60px;border:3px solid #7cb342;border-radius:16px;background:#fffde7;padding:12px 16px 0 70px;font-size:14px"><b>Challenge:</b> Tell your partner why the park is the best place using the word <i>because</i>!</div>') + ab(40, 986, star(42))
    p5 += pagenum(5)
    pages.append(page(p5))

    # =========================================================================
    # PAGE 6: STAGE 5 - GUIDED REPORT & WORK CHECKLIST
    # =========================================================================
    p6 = top() + title(78, 'My Neighborhood Mini-Report', 42)

    # Feature board
    pb = rib(-3, 12, 'Neighborhood Places Board', '#fbc02d').replace('color:#fff', 'color:#12285a')
    places_board = [
        ('park', 'Sunshine Park', 'Quiet & Green'),
        ('playground', 'Joy Playground', 'Swings & Slides'),
        ('street', 'Oak Street', 'Clean Sidewalks'),
        ('building', 'Public Library', 'Books & Study'),
        ('tree', 'Green Trees', 'Shade & Fresh Air'),
        ('flower', 'Garden Flowers', 'Bright & Pretty')
    ]
    for i, (icon, p_name, sub) in enumerate(places_board):
        x = 14 + i * 122
        pb += ab(x, 56, f'<div style="width:114px;text-align:center">{n_svg(icon, 52)}<div style="font-weight:700;font-size:12px;margin-top:2px">{p_name}</div><div style="font-size:10px;color:#64748b;margin-top:1px">{sub}</div></div>')
    p6 += card(30, 136, 756, 196, pb, color='#fbc02d')

    # Step actions
    action_steps = [
        ('1. Explore with your class or family.', '#ef5350'),
        ('2. Choose your favorite 2 places.', '#42a5f5'),
        ('3. Write your report with reasons.', '#7cb342')
    ]
    st = ''
    for i, (t, col) in enumerate(action_steps):
        st += ab(18 + i * 246, 0, f'<span class="num" style="background:{col}">{i+1}</span> <span style="font-weight:700;font-size:13px;display:inline-block;width:178px;vertical-align:middle;line-height:1.2">{t}</span>')
    p6 += ab(30, 344, st)

    # Report card
    rp = rib(-3, 12, 'My report', '#7e57c2')
    rp += ab(24, 52, '<span class="big">I walked around my neighborhood today.</span>')
    rp += ab(24, 96, f'<span class="big">My favorite place is {blank(240)}.</span>')
    rp += ab(24, 140, f'<span class="big">It is the best place because it has {blank(200)}.</span>')
    rp += ab(24, 184, f'<span class="big">I also visited {blank(220)}.</span>')
    rp += ab(24, 228, f'<span class="big">I like it because {blank(260)}.</span>')
    rp += ab(24, 272, f'<span class="big">Our neighborhood is {blank(150)} and {blank(150)}!</span>')
    p6 += card(30, 396, 756, 328, rp, color='#9575cd')

    # Check your work checklist
    ck = rib(-3, 12, 'Check your work', '#43a047')
    checklist_items = [
        'I started each sentence with a capital letter.',
        'I put a full stop (.) at the end of every sentence.',
        'I used the connector "because" to give clear reasons.',
        'I used the word "best" to describe my favorite place.',
        'I checked my spelling with the neighborhood board.'
    ]
    for i, t in enumerate(checklist_items):
        ck += ab(24, 52 + i * 32, f'<span class="cb"></span> <span style="font-weight:700;font-size:14px;vertical-align:middle;margin-left:6px">{t}</span>')
    ck += ab(520, 50, n_svg('tree', 66)) + ab(590, 70, n_svg('flower', 56)) + ab(660, 50, n_svg('park', 64))
    ck += ab(500, 140, '<div style="width:240px;font-size:13px;font-weight:700;color:#2e7d32;text-align:center">Swap with a partner.<br>Circle one great sentence!</div>')
    p6 += card(30, 736, 756, 230, ck)
    p6 += pagenum(6)
    pages.append(page(p6))

    # =========================================================================
    # PAGE 7: STAGE 6 - ASSESSMENT & REFLECTION (CAN-DO & HOMEWORK)
    # =========================================================================
    p7 = top() + title(80, 'Check and Reflect', 50)

    # Self-Check Table
    rows_c = [
        'Can I name 5 places in my neighborhood?',
        'Can I say which place is my favorite?',
        'Can I use the word "because" to give a reason?',
        'Can I write sentences using capital letters and periods?',
        'Can I read and complete a neighborhood report?'
    ]
    sc = rib(-3, 12, 'Self-check', '#43a047')
    sc += ''.join(ab(430 + i * 100, 14, f'<div style="width:90px;text-align:center;font-weight:700;font-size:13px">{t}</div>') for i, t in enumerate(['Yes', 'A little', 'Not yet']))
    for i, t in enumerate(rows_c):
        y = 54 + i * 48
        sc += f'<div class="abs" style="left:0;right:0;top:{y-4}px;border-top:2px solid #dcedc8"></div>' + ab(22, y + 6, f'<b>{t}</b>')
        sc += ''.join(ab(462 + j * 100, y + 4, '<span class="cb" style="width:30px;height:30px"></span>') for j in range(3))
    p7 += card(30, 144, 756, 310, sc)

    # Reflection
    rf = rib(-3, 12, 'Reflection', '#29a8e0') + ab(24, 52, '<b>What was easy to write or say today?</b>')
    rf += ''.join(ab(24, 86 + i * 32, '<div style="width:700px;border-bottom:2px solid #90caf9;height:24px"></div>') for i in range(2))
    rf += ab(24, 166, '<b>What was difficult?</b>')
    rf += ''.join(ab(24, 200 + i * 32, '<div style="width:700px;border-bottom:2px solid #90caf9;height:24px"></div>') for i in range(2))
    p7 += card(30, 470, 756, 280, rf, color='#64b5f6')

    # Homework Box
    hw = rib(-3, 12, 'Homework', '#fbc02d').replace('color:#fff', 'color:#12285a') + ab(20, 52, '<b>Draw your neighborhood street.<br>Write three sentences using<br>“My favorite place is ___ because ___.”</b>')
    p7 += card(30, 766, 380, 180, hw, color='#fbc02d')
    p7 += ab(440, 770, n_svg('park', 130))
    p7 += '<div class="abs" style="left:580px;top:816px;background:#fff;border-radius:12px;padding:6px 16px;font-weight:700;font-size:20px;text-align:center;line-height:1.15;border:2.5px solid #cfd8dc;box-shadow:0 3px 6px rgba(0,0,0,0.06)">GOOD<br>JOB! 🎉</div>'
    p7 += ab(30, 966, f'<div style="width:756px;height:54px;border-radius:18px;background:#ffd54f;border:3px solid #fbc02d;text-align:center;font-weight:700;font-size:22px;padding-top:8px">Next class: My Neighborhood Superheroes!</div>')
    p7 += pagenum(7)
    pages.append(page(p7))

    # =========================================================================
    # PAGE 8: TEACHER PAGE - ANSWER KEY & PEDAGOGICAL NOTES
    # =========================================================================
    p8 = top() + title(80, 'Teacher Page: Answer Key & Guide', 38)
    p8 += ab(0, 128, '<div style="width:816px;text-align:center;font-size:13px;color:#c62828;font-weight:700">MEDUCA Standards Aligned &bull; Grade 4 &bull; Scenario 1 &bull; Theme 1 &bull; CEFR A1.2</div>')

    def kb(t, body, col):
        return f'<div style="margin-bottom:12px"><div style="font-weight:700;color:{col};font-size:14.5px;margin-bottom:2px">{t}</div><div style="font-size:13px;line-height:1.45">{body}</div></div>'

    key = (
        kb('Page 2 &bull; Read and answer', '1) Sunshine Park &bull; 2) It has big swings and slides. (Accept: swings / slides). Write the opinion: Joy Playground &bull; Oak Street.', '#42a5f5') +
        kb('Page 3 &bull; Match (Scrambled Order)', '1 Playground &rarr; playground &bull; 2 Street &rarr; street &bull; 3 Park &rarr; park &bull; 4 Building &rarr; building.', '#43a047') +
        kb('Page 3 &bull; Complete (Missing Letters)', '1. PARK (A) &bull; 2. PLAYGROUND (A, O) &bull; 3. STREET (E, E) &bull; 4. BUILDING (U).', '#29a8e0') +
        kb('Page 3 &bull; Sentence Scramble', '1) The park is the best place. &bull; 2) I like it because it has swings.', '#ff8a3d') +
        kb('Page 4 &bull; Dialogue (Sample Answers)', 'Mia: My favorite place is the <b>park</b> because it is quiet. &bull; Lucas: I like the <b>playground</b> the best because it has swings! &bull; Mia: Our neighborhood is <b>clean</b> and safe.', '#66bb6a') +
        kb('Page 6 &bull; Model Report', 'I walked around my neighborhood today. My favorite place is Sunshine Park. It is the best place because it has tall trees. I also visited Joy Playground. I like it because it is fun. Our neighborhood is clean and safe!', '#9575cd') +
        kb('Formative Assessment (MEDUCA)', 'Evaluate using the 4-criteria rubric: Vocabulary mastery (park, street, playground), Syntactic accuracy with connector "because", Superlative form "the best", and Mechanics (capitalization and punctuation).', '#ef5350')
    )
    p8 += card(30, 160, 756, 680, ab(24, 20, f'<div style="width:700px">{key}</div>'), color='#cfd8dc')
    p8 += ab(80, 860, n_svg('tree', 110)) + ab(350, 860, n_svg('park', 110)) + ab(620, 860, n_svg('playground', 110))
    p8 += pagenum(8)
    pages.append(page(p8))

    html = f'<!DOCTYPE html><html><head><meta charset="utf-8"><title>Grade 4 • Scenario 1 Theme 1 • A Walk in the Neighborhood</title><style>{CSS}</style></head><body>{"".join(pages)}</body></html>'
    html_file = os.path.join(PUBLIC_DIR, "Grade_4_Scenario_1_Theme_1_AWalkInTheNeighborhood_Worksheet_Packet.html")
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Generated HTML: {html_file}")

    pdf_file = os.path.join(PUBLIC_DIR, "Grade_4_Scenario_1_Theme_1_AWalkInTheNeighborhood_Worksheet_Packet.pdf")
    print(f"Compiling PDF via Headless Edge...")
    cmd = [
        EDGE_EXE,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_file}",
        f"file:///{os.path.abspath(html_file)}"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_file) and os.path.getsize(pdf_file) > 1000:
        print(f"SUCCESS: Compiled {pdf_file} ({os.path.getsize(pdf_file)} bytes)")
        return html_file, pdf_file, True
    else:
        print(f"ERROR: Failed to compile {pdf_file}")
        print("Stdout:", res.stdout)
        print("Stderr:", res.stderr)
        return html_file, pdf_file, False

if __name__ == "__main__":
    build_packet()
