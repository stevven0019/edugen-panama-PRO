# -*- coding: utf-8 -*-
"""
EduGen Panama - Scenario 3 Theme 1 Generator (5 Lesson Skills)
Grade 4 • CEFR A1.2 • Scenario 3: Shopping at the Market • Theme 1: How Much Is the Pineapple?
Generates 5 distinct 4-page activity packets:
1. Lesson 1: Listening
2. Lesson 2: Reading
3. Lesson 3: Speaking
4. Lesson 4: Writing
5. Lesson 5: Mediation (21st Century Skills)
"""
import os
import sys
import subprocess

PUBLIC_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public')
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

COMMON_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800;900&display=swap');

@page {
  size: 816px 1056px;
  margin: 0;
}
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Nunito', sans-serif;
  background: #f1f5f9;
  color: #1e293b;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.sheet {
  width: 816px;
  height: 1056px;
  position: relative;
  background: #fffdf9;
  margin: 20px auto;
  overflow: hidden;
  page-break-after: always;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
@media print {
  body { background: transparent; }
  .sheet { margin: 0; box-shadow: none; }
}

.top-nav {
  position: absolute;
  top: 44px;
  left: 36px;
  right: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  border-radius: 20px;
  font-family: 'Fredoka', cursive;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  color: #fff;
}
.pill-teal { background: #0d9488; }
.pill-amber { background: #d97706; }
.pill-indigo { background: #4f46e5; }
.pill-rose { background: #e11d48; }
.pill-green { background: #16a34a; }

.student-meta {
  display: flex;
  gap: 16px;
  font-family: 'Fredoka', cursive;
  font-size: 13.5px;
  color: #475569;
}
.meta-field {
  border-bottom: 2px dashed #94a3b8;
  padding: 0 36px 2px 4px;
  color: #0f172a;
}

.mission-banner {
  position: absolute;
  left: 36px;
  right: 36px;
  color: white;
  border-radius: 14px;
  padding: 9px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}
.mission-title {
  font-family: 'Fredoka', cursive;
  font-size: 19px;
  font-weight: 700;
  letter-spacing: 0.4px;
}
.mission-subtitle {
  font-size: 12px;
  font-weight: 700;
  opacity: 0.92;
}

.comic-grid {
  position: absolute;
  top: 154px;
  left: 36px;
  right: 36px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 14px;
}
.comic-panel {
  background: white;
  border: 3px solid #0f172a;
  border-radius: 16px;
  padding: 12px;
  position: relative;
  height: 330px;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 4px 0px #0f172a;
}
.panel-num {
  position: absolute;
  top: -12px;
  left: 12px;
  background: #facc15;
  border: 2px solid #0f172a;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', cursive;
  font-weight: 700;
  font-size: 14px;
  color: #0f172a;
  z-index: 5;
}
.panel-art {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}
.speech-bubble {
  background: #fff;
  border: 2px solid #0f172a;
  border-radius: 14px;
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.35;
  position: relative;
  box-shadow: 2px 2px 0px #cbd5e1;
}
.speech-bubble b {
  color: #0369a1;
}
.fill-blank {
  display: inline-block;
  min-width: 65px;
  border-bottom: 2px solid #0284c7;
  text-align: center;
  font-family: 'Fredoka', cursive;
  color: #0369a1;
  font-weight: 700;
}

.mission-box {
  position: absolute;
  bottom: 48px;
  left: 36px;
  right: 36px;
  background: #fefce8;
  border: 2.5px dashed #eab308;
  border-radius: 16px;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mission-box-title {
  font-family: 'Fredoka', cursive;
  font-size: 15px;
  font-weight: 700;
  color: #854d0e;
  margin-bottom: 4px;
}
.clue-chips {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}
.clue-chip {
  background: white;
  border: 1.5px solid #ca8a04;
  border-radius: 12px;
  padding: 3px 10px;
  font-family: 'Fredoka', cursive;
  font-size: 12.5px;
  font-weight: 600;
  color: #854d0e;
}
.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 3px;
}
.check-circle {
  width: 15px;
  height: 15px;
  border: 2px solid #64748b;
  border-radius: 4px;
}

.puzzle-split {
  position: absolute;
  top: 154px;
  left: 36px;
  right: 36px;
  bottom: 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 18px;
}
.puzzle-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 18px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.puzzle-card-header {
  font-family: 'Fredoka', cursive;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 2px solid #f1f5f9;
  margin-bottom: 10px;
}

.board-container {
  position: absolute;
  top: 150px;
  left: 36px;
  right: 36px;
  height: 840px;
  background: white;
  border: 3.5px solid #0f172a;
  border-radius: 24px;
  padding: 16px;
  box-shadow: 6px 6px 0px #0f172a;
}
.board-grid {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 8px;
}
.space {
  border: 2px solid #0f172a;
  border-radius: 12px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 10px;
  line-height: 1.25;
  font-weight: 700;
  position: relative;
}
.space-num {
  position: absolute;
  top: 4px;
  left: 6px;
  background: #0f172a;
  color: white;
  border-radius: 50%;
  width: 17px;
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', cursive;
  font-size: 10.5px;
}
.space-title {
  margin-top: 12px;
  font-family: 'Fredoka', cursive;
  font-size: 11.5px;
  font-weight: 700;
}
.sp-start { background: #bbf7d0; border-color: #16a34a; }
.sp-finish { background: #fef08a; border-color: #ca8a04; }
.sp-green { background: #dcfce7; }
.sp-blue { background: #e0f2fe; }
.sp-amber { background: #fef3c7; }
.sp-rose { background: #ffe4e6; }
.sp-purple { background: #f3e8ff; }

.game-hub {
  grid-column: 2 / 5;
  grid-row: 2 / 5;
  background: #f8fafc;
  border: 2px dashed #94a3b8;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
}
.hub-title {
  font-family: 'Fredoka', cursive;
  font-size: 19px;
  font-weight: 700;
  color: #0369a1;
}
.hub-rules {
  font-size: 11.5px;
  line-height: 1.4;
  color: #334155;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 8px 12px;
  max-width: 320px;
}

.creative-top {
  position: absolute;
  top: 150px;
  left: 36px;
  right: 36px;
  height: 380px;
  background: white;
  border: 2.5px solid #0f172a;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 4px 4px 0px #0f172a;
  display: flex;
  flex-direction: column;
}
.draw-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.draw-title {
  font-family: 'Fredoka', cursive;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 8px;
}
.draw-canvas {
  flex: 1;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  background: #fafaf9;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.creative-bottom {
  position: absolute;
  top: 546px;
  left: 36px;
  right: 36px;
  height: 440px;
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  grid-gap: 16px;
}
.project-card {
  background: #fffdf7;
  border: 2.5px solid #0f172a;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 4px 4px 0px #0f172a;
  position: relative;
  display: flex;
  flex-direction: column;
}
.cert-card {
  background: #fefce8;
  border: 2.5px solid #0f172a;
  border-radius: 20px;
  padding: 15px;
  box-shadow: 4px 4px 0px #0f172a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
}
.p-line {
  border-bottom: 2px solid #94a3b8;
  display: inline-block;
}
.asset-img {
  width: 55px;
  height: 55px;
  object-fit: contain;
}
"""

def v_awning(w=816, h=36):
    cols = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444']
    n = 16
    sw = w / n
    s = ''
    for i in range(n):
        x = i * sw
        s += f'<path d="M{x:.1f} 0 h{sw:.1f} v{h - sw/2:.1f} a{sw/2:.1f} {sw/2:.1f} 0 0 1 {-sw:.1f} 0 z" fill="{cols[i % len(cols)]}"/>'
    return f'<svg width="{w}" height="{h + 8}" viewBox="0 0 {w} {h + 8}" style="position:absolute;top:0;left:0;z-index:20;">{s}</svg>'

def v_price_tag(price, sz=50):
    return (
        f'<svg width="{sz}" height="{sz*0.65:.0f}" viewBox="0 0 100 65">'
        f'<path d="M4 32.5 L24 6 H92 Q96 6 96 10 V55 Q96 59 92 59 H24 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>'
        f'<circle cx="22" cy="32.5" r="5" fill="#fff" stroke="#ca8a04" stroke-width="2"/>'
        f'<text x="60" y="42" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="28" fill="#1e293b">{price}</text>'
        f'</svg>'
    )

def v_spinner(sz=110):
    return (
        f'<svg width="{sz}" height="{sz}" viewBox="0 0 120 120">'
        f'<circle cx="60" cy="60" r="56" fill="#f8fafc" stroke="#334155" stroke-width="3"/>'
        f'<path d="M60 60 L60 4 A56 56 0 0 1 116 60 Z" fill="#fee2e2"/>'
        f'<path d="M60 60 L116 60 A56 56 0 0 1 60 116 Z" fill="#fef3c7"/>'
        f'<path d="M60 60 L60 116 A56 56 0 0 1 4 60 Z" fill="#dcfce7"/>'
        f'<path d="M60 60 L4 60 A56 56 0 0 1 60 4 Z" fill="#e0e7ff"/>'
        f'<line x1="60" y1="4" x2="60" y2="116" stroke="#475569" stroke-width="2"/>'
        f'<line x1="4" y1="60" x2="116" y2="60" stroke="#475569" stroke-width="2"/>'
        f'<text x="84" y="44" font-family="Fredoka" font-size="20" font-weight="700" fill="#dc2626" text-anchor="middle">1</text>'
        f'<text x="84" y="90" font-family="Fredoka" font-size="20" font-weight="700" fill="#d97706" text-anchor="middle">2</text>'
        f'<text x="36" y="90" font-family="Fredoka" font-size="20" font-weight="700" fill="#16a34a" text-anchor="middle">3</text>'
        f'<text x="36" y="44" font-family="Fredoka" font-size="20" font-weight="700" fill="#4f46e5" text-anchor="middle">4</text>'
        f'<circle cx="60" cy="60" r="10" fill="#0f172a"/>'
        f'<circle cx="60" cy="60" r="4" fill="#ffffff"/>'
        f'</svg>'
    )

def v_badge(title="MEDUCA STAR", sz=75):
    return (
        f'<svg width="{sz}" height="{sz}" viewBox="0 0 80 80">'
        f'<path d="M28 50 L20 74 L32 68 L40 74 L36 50 Z" fill="#b91c1c"/>'
        f'<path d="M52 50 L60 74 L48 68 L40 74 L44 50 Z" fill="#991b1b"/>'
        f'<circle cx="40" cy="36" r="28" fill="#fbbf24" stroke="#d97706" stroke-width="3"/>'
        f'<circle cx="40" cy="36" r="23" fill="#f59e0b"/>'
        f'<path d="M40 18 L44 28 L54 29 L46 36 L48 46 L40 40 L32 46 L34 36 L26 29 L36 28 Z" fill="#ffffff"/>'
        f'</svg>'
    )

def v_dice(val=4, sz=44):
    pips = {
        1: '<circle cx="30" cy="30" r="5" fill="#ffffff"/>',
        2: '<circle cx="18" cy="18" r="4.5" fill="#ffffff"/><circle cx="42" cy="42" r="4.5" fill="#ffffff"/>',
        3: '<circle cx="16" cy="16" r="4" fill="#ffffff"/><circle cx="30" cy="30" r="4" fill="#ffffff"/><circle cx="44" cy="44" r="4" fill="#ffffff"/>',
        4: '<circle cx="18" cy="18" r="4" fill="#ffffff"/><circle cx="42" cy="18" r="4" fill="#ffffff"/><circle cx="18" cy="42" r="4" fill="#ffffff"/><circle cx="42" cy="42" r="4" fill="#ffffff"/>',
        5: '<circle cx="16" cy="16" r="3.8" fill="#ffffff"/><circle cx="44" cy="16" r="3.8" fill="#ffffff"/><circle cx="30" cy="30" r="3.8" fill="#ffffff"/><circle cx="16" cy="44" r="3.8" fill="#ffffff"/><circle cx="44" cy="44" r="3.8" fill="#ffffff"/>',
    }
    return (
        f'<svg width="{sz}" height="{sz}" viewBox="0 0 60 60">'
        f'<rect x="4" y="4" width="52" height="52" rx="12" fill="#e11d48" stroke="#9f1239" stroke-width="2.5"/>'
        f'<rect x="6" y="6" width="48" height="24" rx="8" fill="#fb7185" opacity=".4"/>'
        f'{pips.get(val, pips[4])}'
        f'</svg>'
    )

def asset(name):
    return f'assets/nouns/{name}'

# -------------------------------------------------------------
# 1. LESSON 1: LISTENING PACKET
# -------------------------------------------------------------
def get_lesson1_pages():
    # Page 1 to 4 as defined previously
    p1 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav">
        <div style="display:flex;gap:8px;"><span class="pill pill-teal">Grade 4 • CEFR A1.2</span><span class="pill pill-indigo">Scenario 3 • Theme 1 • Lesson 1: Listening</span></div>
        <div class="student-meta"><div>Student: <span class="meta-field">_____________________</span></div><div>Date: <span class="meta-field">__________</span></div></div>
      </div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#0d9488,#115e59);">
        <div><div class="mission-title">🎧 MISSION 1: The Market Audio Detective!</div><div class="mission-subtitle">Listen to the conversation between the customer and vendor. Match the prices!</div></div>
        <div>{v_price_tag("$3",48)}</div>
      </div>
      <div class="comic-grid">
        <div class="comic-panel"><div class="panel-num">1</div><div class="panel-art" style="background:#e0f2fe;"><img src="{asset('pineapple.png')}" class="asset-img" style="width:70px;height:70px;margin-right:12px;">{v_price_tag("$3",60)}</div><div class="speech-bubble"><b>Customer:</b> "Good morning! How much is the <b>pineapple</b>?"<br><b>Vendor:</b> "It is <b>three dollars ($3)</b>, very sweet!"</div></div>
        <div class="comic-panel"><div class="panel-num">2</div><div class="panel-art" style="background:#fef3c7;"><img src="{asset('apple.png')}" class="asset-img" style="width:65px;height:65px;margin-right:12px;">{v_price_tag("$1",55)}</div><div class="speech-bubble"><b>Customer:</b> "How many apples do you have?"<br><b>Vendor:</b> "Fresh red apples! They are <b>one dollar ($1) each</b>."</div></div>
        <div class="comic-panel"><div class="panel-num">3</div><div class="panel-art" style="background:#ecfdf5;"><img src="{asset('banana.png')}" class="asset-img" style="width:70px;height:70px;margin-right:12px;">{v_price_tag("$1",55)}</div><div class="speech-bubble"><b>Customer:</b> "I need bananas too!"<br><b>Vendor:</b> "Two yellow bananas for <b>one dollar ($1)</b>!"</div></div>
        <div class="comic-panel"><div class="panel-num">4</div><div class="panel-art" style="background:#fff1f2;"><img src="{asset('money.png')}" class="asset-img" style="width:65px;height:65px;margin-right:12px;">{v_price_tag("$5",60)}</div><div class="speech-bubble"><b>Customer:</b> "Here is <b>five dollars ($5)</b>. Thank you!"<br><b>Vendor:</b> "Thank you! Have a wonderful day!"</div></div>
      </div>
      <div class="mission-box">
        <div><div class="mission-box-title">👂 Listening Comprehension Check:</div><div class="clue-chips"><span class="clue-chip">Pineapple: $3</span><span class="clue-chip">Apple: $1</span><span class="clue-chip">Bananas: 2 for $1</span><span class="clue-chip">Total: $5</span></div></div>
        <div style="border-left:2px solid #ca8a04;padding-left:14px;"><div class="check-item"><div class="check-circle"></div> Circle correct price</div><div class="check-item"><div class="check-circle"></div> Listen to /p/ in pineapple</div></div>
      </div>
    </div>
    """
    p2 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-teal">Grade 4 • Listening</span><span class="pill pill-amber">Stage 3 • Practice</span></div><div class="student-meta"><div>Student: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#0d9488,#115e59);"><div><div class="mission-title">🧩 MISSION 2: Market Sound Detective & Price Match!</div><div class="mission-subtitle">Phonics /p/ & /m/ sound hunt • Listen and connect items with prices!</div></div><div>{v_badge("SOUNDS",45)}</div></div>
      <div class="puzzle-split">
        <div class="puzzle-card">
          <div class="puzzle-card-header"><span>🔊 The /p/ and /m/ Sound Hunt!</span></div>
          <div style="font-size:12.5px;color:#475569;margin-bottom:10px;">Listen to your teacher read the words. Color items with <b>/p/</b> in BLUE and items with <b>/m/</b> in RED!</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;grid-gap:10px;flex:1;align-content:center;">
            <div style="border:2px solid #cbd5e1;border-radius:12px;padding:8px;text-align:center;background:#f8fafc;"><img src="{asset('pineapple.png')}" class="asset-img" style="width:48px;height:48px;"><br><b style="font-family:'Fredoka';font-size:13px;color:#0f172a;">Pineapple</b></div>
            <div style="border:2px solid #cbd5e1;border-radius:12px;padding:8px;text-align:center;background:#f8fafc;"><img src="{asset('money.png')}" class="asset-img" style="width:48px;height:48px;"><br><b style="font-family:'Fredoka';font-size:13px;color:#0f172a;">Money</b></div>
            <div style="border:2px solid #cbd5e1;border-radius:12px;padding:8px;text-align:center;background:#f8fafc;"><img src="{asset('potatoes.png')}" class="asset-img" style="width:48px;height:48px;"><br><b style="font-family:'Fredoka';font-size:13px;color:#0f172a;">Potatoes</b></div>
            <div style="border:2px solid #cbd5e1;border-radius:12px;padding:8px;text-align:center;background:#f8fafc;"><img src="{asset('price.png')}" class="asset-img" style="width:48px;height:48px;"><br><b style="font-family:'Fredoka';font-size:13px;color:#0f172a;">Market Price</b></div>
          </div>
          <div style="margin-top:10px;background:#e0f2fe;border-radius:10px;padding:8px;font-size:12px;text-align:center;">🔵 Sound /p/: <b>P</b>ineapple • <b>P</b>otato • <b>P</b>rice<br>🔴 Sound /m/: <b>M</b>arket • <b>M</b>oney</div>
        </div>
        <div class="puzzle-card">
          <div class="puzzle-card-header"><span>🏷️ Listen & Match the Price Tag!</span></div>
          <div style="font-size:12.5px;color:#475569;margin-bottom:10px;">Draw a line from the fruit to the price tag you hear in the dialogue!</div>
          <div style="display:flex;flex-direction:column;gap:12px;justify-content:center;flex:1;">
            <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1.5px dashed #e2e8f0;padding-bottom:6px;"><div style="display:flex;align-items:center;gap:8px;"><img src="{asset('pineapple.png')}" style="width:42px;height:42px;"><b style="font-family:'Fredoka';font-size:14px;">1 Pineapple</b></div><div>{v_price_tag("$3",52)}</div></div>
            <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1.5px dashed #e2e8f0;padding-bottom:6px;"><div style="display:flex;align-items:center;gap:8px;"><img src="{asset('apple.png')}" style="width:42px;height:42px;"><b style="font-family:'Fredoka';font-size:14px;">1 Apple</b></div><div>{v_price_tag("$1",52)}</div></div>
            <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1.5px dashed #e2e8f0;padding-bottom:6px;"><div style="display:flex;align-items:center;gap:8px;"><img src="{asset('banana.png')}" style="width:42px;height:42px;"><b style="font-family:'Fredoka';font-size:14px;">2 Bananas</b></div><div>{v_price_tag("$1",52)}</div></div>
            <div style="display:flex;align-items:center;justify-content:space-between;"><div style="display:flex;align-items:center;gap:8px;"><img src="{asset('potatoes.png')}" style="width:42px;height:42px;"><b style="font-family:'Fredoka';font-size:14px;">2 Potatoes</b></div><div>{v_price_tag("$2",52)}</div></div>
          </div>
        </div>
      </div>
    </div>
    """
    p3 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-rose">Grade 4 • Listening</span><span class="pill pill-teal">Stage 4 • Interactive Board Game</span></div><div class="student-meta"><div>Players: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#e11d48,#be123c);"><div><div class="mission-title">🎲 MISSION 3: "Audio Market Trail" Board Game!</div><div class="mission-subtitle">Spin 1-4 • Listen to your partner read the tile • Say the answer to stay!</div></div><div>{v_dice(val=3,sz=44)}</div></div>
      <div class="board-container">
        <div class="board-grid">
          <div class="space sp-start"><div class="space-num">1</div><div class="space-title">START! 🛒</div><div>Take your empty shopping basket!</div></div>
          <div class="space sp-green"><div class="space-num">2</div><div class="space-title">Apple Stand 🍎</div><div>Listen: "Apples are $1 each!"</div></div>
          <div class="space sp-blue"><div class="space-num">3</div><div class="space-title">Cashier Bell 🔔</div><div>Cha-ching! Move forward +1 space!</div></div>
          <div class="space sp-rose"><div class="space-num">4</div><div class="space-title">Spilled Box! 📦</div><div>Help pick up carrots! Wait 1 turn.</div></div>
          <div class="space sp-amber"><div class="space-num">5</div><div class="space-title">Pineapple 🍍</div><div>Say out loud: "It is three dollars!"</div></div>
          <div class="space sp-finish"><div class="space-num">16</div><div class="space-title">FINISH! 🏆</div><div>Shout: "I love the market!"</div></div>
          <div class="game-hub">
            <div class="hub-title">🧺 Market Shopping Trail!</div>
            <div style="display:flex;align-items:center;gap:14px;"><div>{v_spinner(105)}</div><div class="hub-rules"><b>Rules:</b><br>1. Put your token on START.<br>2. Spin the pencil & paperclip.<br>3. Your partner reads the card aloud.<br>4. Repeat the price in English to stay!</div></div>
            <div style="background:#fefce8;border:1.5px solid #ca8a04;border-radius:10px;padding:6px 14px;font-size:12px;font-weight:700;color:#854d0e;">🗣️ Audio Clue: "How much is the...?" • "It is... dollars!"</div>
          </div>
          <div class="space sp-purple"><div class="space-num">6</div><div class="space-title">Sweet Banana 🍌</div><div>Say 2 words with /p/ or /m/!</div></div>
          <div class="space sp-blue"><div class="space-num">15</div><div class="space-title">Total Check 💵</div><div>Count 1 to 5 in English!</div></div>
          <div class="space sp-green"><div class="space-num">7</div><div class="space-title">Orange Stall 🍊</div><div>Say: "I want two oranges!"</div></div>
          <div class="space sp-amber"><div class="space-num">14</div><div class="space-title">Fresh Bread 🥖</div><div>Mmm! Smells warm and good!</div></div>
          <div class="space sp-blue"><div class="space-num">8</div><div class="space-title">Rest Bench 🪑</div><div>Drink water and take a rest!</div></div>
          <div class="space sp-rose"><div class="space-num">13</div><div class="space-title">Heavy Bag! 🛍️</div><div>Carry with two hands! +1 space.</div></div>
          <div class="space sp-green"><div class="space-num">12</div><div class="space-title">Cassava Stand 🥔</div><div>Listen: "Yuca is 2 dollars!"</div></div>
          <div class="space sp-purple"><div class="space-num">11</div><div class="space-title">Potato Sack 🥔</div><div>Say: "I need five potatoes!"</div></div>
          <div class="space sp-blue"><div class="space-num">10</div><div class="space-title">Carrot Box 🥕</div><div>Crunchy orange carrots!</div></div>
          <div class="space sp-amber"><div class="space-num">9</div><div class="space-title">Shortcut Alley ⚡</div><div>Spell P-I-N-E to roll again!</div></div>
        </div>
      </div>
    </div>
    """
    p4 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-teal">Grade 4 • Listening</span><span class="pill pill-green">Stage 5 & 6 • Assessment</span></div><div class="student-meta"><div>Student: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#0d9488,#115e59);"><div><div class="mission-title">🎨 MISSION 4: Draw Your Basket & Listening Passport!</div><div class="mission-subtitle">Draw the items from the audio prompt and claim your MEDUCA Listening Badge!</div></div><div>{v_badge("LISTENER",45)}</div></div>
      <div class="creative-top">
        <div class="draw-header"><div class="draw-title"><span>✏️ Task A: Draw What You Heard!</span></div><div style="font-size:12px;font-weight:700;color:#64748b;">Audio prompt: "Draw 1 pineapple, 2 bananas, and 3 red apples in the cart!"</div></div>
        <div class="draw-canvas"><div style="text-align:center;color:#94a3b8;font-family:'Fredoka';font-size:15px;">🛒 Draw the 3 fruits inside your market basket!<br><span style="font-size:12px;color:#cbd5e1;">(1 Pineapple • 2 Bananas • 3 Apples)</span></div></div>
      </div>
      <div class="creative-bottom">
        <div class="project-card">
          <div style="font-family:'Fredoka';font-size:16px;font-weight:700;color:#0d9488;border-bottom:2px solid #e2e8f0;padding-bottom:6px;margin-bottom:10px;">📝 Listening Exit Ticket</div>
          <div style="font-size:13.5px;line-height:1.8;color:#1e293b;">
            <div>1. The pineapple costs: <b>$ <span class="p-line" style="width:60px;">3</span></b></div>
            <div>2. Two bananas cost: <b>$ <span class="p-line" style="width:60px;">1</span></b></div>
            <div>3. The sound in <u>P</u>ineapple is: <b>/ <span class="p-line" style="width:50px;">p</span> /</b></div>
            <div>4. Did you understand the audio? <b>[ ] YES &nbsp; [ ] A LITTLE</b></div>
          </div>
        </div>
        <div class="cert-card">
          <div><div style="font-family:'Fredoka';font-size:16px;font-weight:700;color:#854d0e;">CERTIFIED LISTENER</div><div style="font-size:12px;color:#a16207;font-weight:700;">Grade 4 • Scenario 3 Theme 1</div></div>
          <div style="margin:6px 0;">{v_badge("CEFR A1.2",80)}</div>
          <div style="text-align:left;font-size:11.5px;color:#334155;line-height:1.6;"><div>✔️ Listened to Market Dialogue</div><div>✔️ Matched Fruit Price Tags</div><div>✔️ Mastered /p/ and /m/ sounds</div></div>
          <div style="border-top:1.5px dashed #ca8a04;width:100%;padding-top:4px;font-size:11px;font-weight:700;color:#854d0e;">Teacher: ____________________</div>
        </div>
      </div>
    </div>
    """
    return COMMON_CSS, p1 + p2 + p3 + p4

# -------------------------------------------------------------
# 2. LESSON 2: READING PACKET
# -------------------------------------------------------------
def get_lesson2_pages():
    p1 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav">
        <div style="display:flex;gap:8px;"><span class="pill pill-amber">Grade 4 • CEFR A1.2</span><span class="pill pill-indigo">Scenario 3 • Theme 1 • Lesson 2: Reading</span></div>
        <div class="student-meta"><div>Reader: <span class="meta-field">_____________________</span></div><div>Date: <span class="meta-field">__________</span></div></div>
      </div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#d97706,#b45309);">
        <div><div class="mission-title">📖 MISSION 1: A Trip to the Market!</div><div class="mission-subtitle">Read the illustrated story with Sofia and Leo. Discover the prices and answer the questions!</div></div>
        <div>{v_price_tag("$3",48)}</div>
      </div>
      <div class="comic-grid">
        <div class="comic-panel"><div class="panel-num">1</div><div class="panel-art" style="background:#e0f2fe;"><img src="{asset('store.png')}" style="width:75px;height:75px;"></div><div class="speech-bubble">Today, Sofia and Leo visit the <b>central market</b>. The market has colorful stalls with fresh, sweet fruits!</div></div>
        <div class="comic-panel"><div class="panel-num">2</div><div class="panel-art" style="background:#fef3c7;"><img src="{asset('banana.png')}" style="width:65px;height:65px;margin-right:10px;"><img src="{asset('apple.png')}" style="width:65px;height:65px;"></div><div class="speech-bubble">"Look at the bananas!" says Sofia. The sign says: <b>Two bananas cost $1</b>. The red apples cost <b>$1 each</b>!</div></div>
        <div class="comic-panel"><div class="panel-num">3</div><div class="panel-art" style="background:#ecfdf5;"><img src="{asset('pineapple.png')}" style="width:70px;height:70px;margin-right:10px;">{v_price_tag("$3",55)}</div><div class="speech-bubble">"How much is the <b>pineapple</b>?" asks Leo. The vendor smiles: "It is <b>three dollars ($3)</b>, very juicy!"</div></div>
        <div class="comic-panel"><div class="panel-num">4</div><div class="panel-art" style="background:#fff1f2;"><img src="{asset('potatoes.png')}" style="width:65px;height:65px;margin-right:10px;"><img src="{asset('money.png')}" style="width:65px;height:65px;"></div><div class="speech-bubble">They also buy two potatoes for $1. Total cost: <b>$6</b>. "Shopping at the market is cheap and healthy!"</div></div>
      </div>
      <div class="mission-box">
        <div><div class="mission-box-title">🔍 Reading Comprehension Questions:</div>
          <div style="font-size:13px;line-height:1.6;color:#1e293b;">
            1. How much is the pineapple? &nbsp; <b>[ ] $1 &nbsp; [x] $3 &nbsp; [ ] $10</b><br>
            2. How many bananas cost $1? &nbsp; <b>[ ] 1 &nbsp; [x] 2 &nbsp; [ ] 5</b>
          </div>
        </div>
        <div style="border-left:2px solid #ca8a04;padding-left:14px;"><div class="check-item"><div class="check-circle"></div> Read with a partner</div><div class="check-item"><div class="check-circle"></div> Check the price signs</div></div>
      </div>
    </div>
    """
    p2 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-amber">Grade 4 • Reading</span><span class="pill pill-teal">Stage 3 • Phonics & Crossword</span></div><div class="student-meta"><div>Reader: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#d97706,#b45309);"><div><div class="mission-title">🧩 MISSION 2: Market Crossword & Phonics Blending!</div><div class="mission-subtitle">Blend sounds to form words • Solve the market crossword puzzle!</div></div><div>{v_badge("READING",45)}</div></div>
      <div class="puzzle-split">
        <div class="puzzle-card">
          <div class="puzzle-card-header"><span>✏️ Market Reading Crossword</span></div>
          <div style="font-size:12.5px;color:#475569;margin-bottom:8px;">Read the clues and write the words in the puzzle:</div>
          <div style="background:#f8fafc;border:2px solid #cbd5e1;border-radius:12px;padding:12px;line-height:1.8;font-size:13px;flex:1;">
            <b>ACROSS ➔</b><br>
            <b>1.</b> Big, sweet tropical fruit with spiky crown: <span class="fill-blank" style="min-width:110px;">P I N E A P P L E</span><br>
            <b>2.</b> Yellow fruit, monkeys love it: <span class="fill-blank" style="min-width:90px;">B A N A N A</span><br>
            <b>3.</b> Round red fruit: <span class="fill-blank" style="min-width:80px;">A P P L E</span><br><br>
            <b>DOWN ⬇</b><br>
            <b>4.</b> Brown veggie that grows underground: <span class="fill-blank" style="min-width:90px;">P O T A T O</span><br>
            <b>5.</b> Place with many food stalls: <span class="fill-blank" style="min-width:90px;">M A R K E T</span>
          </div>
        </div>
        <div class="puzzle-card">
          <div class="puzzle-card-header"><span>🔤 Phonemic Awareness Blending!</span></div>
          <div style="font-size:12.5px;color:#475569;margin-bottom:10px;">Say the onset and rhyme sounds aloud, then blend them to read the word!</div>
          <div style="display:flex;flex-direction:column;gap:12px;flex:1;justify-content:center;">
            <div style="background:#fef3c7;border:1.5px solid #ca8a04;border-radius:10px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;">
              <span style="font-family:'Fredoka';font-size:16px;">/ t / &nbsp;+&nbsp; / ɛn / &nbsp;=</span>
              <span style="background:white;padding:4px 14px;border-radius:8px;font-family:'Fredoka';font-size:16px;color:#b45309;font-weight:700;">TEN</span>
            </div>
            <div style="background:#e0f2fe;border:1.5px solid #0284c7;border-radius:10px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;">
              <span style="font-family:'Fredoka';font-size:16px;">/ c / &nbsp;+&nbsp; / ɔst / &nbsp;=</span>
              <span style="background:white;padding:4px 14px;border-radius:8px;font-family:'Fredoka';font-size:16px;color:#0369a1;font-weight:700;">COST</span>
            </div>
            <div style="background:#dcfce7;border:1.5px solid #16a34a;border-radius:10px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;">
              <span style="font-family:'Fredoka';font-size:16px;">/ p / &nbsp;+&nbsp; / ɛn / &nbsp;=</span>
              <span style="background:white;padding:4px 14px;border-radius:8px;font-family:'Fredoka';font-size:16px;color:#15803d;font-weight:700;">PEN</span>
            </div>
            <div style="background:#fce7f3;border:1.5px solid #db2777;border-radius:10px;padding:8px 12px;display:flex;align-items:center;justify-content:space-between;">
              <span style="font-family:'Fredoka';font-size:16px;">/ m / &nbsp;+&nbsp; / ʌn.i / &nbsp;=</span>
              <span style="background:white;padding:4px 14px;border-radius:8px;font-family:'Fredoka';font-size:16px;color:#be185d;font-weight:700;">MONEY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    """
    p3 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-amber">Grade 4 • Reading</span><span class="pill pill-rose">Stage 4 • Interactive Board Game</span></div><div class="student-meta"><div>Players: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#d97706,#b45309);"><div><div class="mission-title">🎲 MISSION 3: "Read & Move!" Market Board Game</div><div class="mission-subtitle">Spin 1-4 • Read the sign aloud • Move forward if you read correctly!</div></div><div>{v_dice(val=2,sz=44)}</div></div>
      <div class="board-container">
        <div class="board-grid">
          <div class="space sp-start"><div class="space-num">1</div><div class="space-title">START! 🚪</div><div>Enter the Reading Market!</div></div>
          <div class="space sp-green"><div class="space-num">2</div><div class="space-title">Sign A 🏷️</div><div>Read: "Fresh apples $1"</div></div>
          <div class="space sp-blue"><div class="space-num">3</div><div class="space-title">Banana Stand 🍌</div><div>Read: "Two bananas $1!" Move +1!</div></div>
          <div class="space sp-rose"><div class="space-num">4</div><div class="space-title">Closed Stall 🛑</div><div>Sign says: "Back at 2:00". Wait!</div></div>
          <div class="space sp-amber"><div class="space-num">5</div><div class="space-title">Pineapple 🍍</div><div>Read: "Sweet Pineapple $3!"</div></div>
          <div class="space sp-finish"><div class="space-num">16</div><div class="space-title">FINISH! 🏆</div><div>Read: "Thank you for shopping!"</div></div>
          <div class="game-hub">
            <div class="hub-title">📖 Reading Market Trail!</div>
            <div style="display:flex;align-items:center;gap:14px;"><div>{v_spinner(105)}</div><div class="hub-rules"><b>Rules:</b><br>1. Place your token on START.<br>2. Spin the spinner (1-4).<br>3. Read the sign text on the tile.<br>4. If read correctly, stay on space!</div></div>
            <div style="background:#fefce8;border:1.5px solid #ca8a04;border-radius:10px;padding:6px 14px;font-size:12px;font-weight:700;color:#854d0e;">⭐ Reading Tip: Look for price numbers and fruit names!</div>
          </div>
          <div class="space sp-purple"><div class="space-num">6</div><div class="space-title">Juice Bar 🥤</div><div>Read: "Pineapple Juice $2"</div></div>
          <div class="space sp-blue"><div class="space-num">15</div><div class="space-title">Receipt 🧾</div><div>Read: "Total is $6 dollars!"</div></div>
          <div class="space sp-green"><div class="space-num">7</div><div class="space-title">Carrot Bag 🥕</div><div>Read: "Four carrots cost $1!"</div></div>
          <div class="space sp-amber"><div class="space-num">14</div><div class="space-title">Bakery Sign 🥖</div><div>Read: "Warm bread $1!"</div></div>
          <div class="space sp-blue"><div class="space-num">8</div><div class="space-title">Market Bench 🪑</div><div>Rest your eyes for 1 turn.</div></div>
          <div class="space sp-rose"><div class="space-num">13</div><div class="space-title">Wet Floor ⚠️</div><div>Read: "Caution! Be careful!"</div></div>
          <div class="space sp-green"><div class="space-num">12</div><div class="space-title">Cassava Sign 🥔</div><div>Read: "Yuca is $2 dollars!"</div></div>
          <div class="space sp-purple"><div class="space-num">11</div><div class="space-title">Potato Box 🥔</div><div>Read: "Potatoes are cheap!"</div></div>
          <div class="space sp-blue"><div class="space-num">10</div><div class="space-title">Orange Sign 🍊</div><div>Read: "Oranges $2 per bag!"</div></div>
          <div class="space sp-amber"><div class="space-num">9</div><div class="space-title">Quick Quiz ❓</div><div>What fruit has leaves? (Pineapple)</div></div>
        </div>
      </div>
    </div>
    """
    p4 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-amber">Grade 4 • Reading</span><span class="pill pill-green">Stage 5 & 6 • Project & Assessment</span></div><div class="student-meta"><div>Reader: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#d97706,#b45309);"><div><div class="mission-title">🎨 MISSION 4: Be a Market Sign Maker!</div><div class="mission-subtitle">Design 2 price signs for the fruit stall and earn your MEDUCA Reading Star!</div></div><div>{v_badge("STAR",45)}</div></div>
      <div class="creative-top">
        <div class="draw-header"><div class="draw-title"><span>✏️ Task A: Draw & Write 2 Market Signs!</span></div><div style="font-size:12px;font-weight:700;color:#64748b;">Include: Fruit drawing • Item name in English • Price tag ($1, $2, or $3)</div></div>
        <div class="draw-canvas">
          <div style="display:grid;grid-template-columns:1fr 1fr;grid-gap:20px;width:90%;height:85%;">
            <div style="border:2px dashed #ca8a04;border-radius:12px;background:#fffdf7;padding:10px;text-align:center;display:flex;flex-direction:column;justify-content:space-between;">
              <b style="font-family:'Fredoka';color:#b45309;">SIGN #1: PINEAPPLE</b>
              <div style="color:#94a3b8;font-size:12px;">(Draw pineapple & write price)</div>
              <div style="font-family:'Fredoka';font-size:14px;color:#1e293b;">Price: <b>$ 3.00</b></div>
            </div>
            <div style="border:2px dashed #0284c7;border-radius:12px;background:#f0f9ff;padding:10px;text-align:center;display:flex;flex-direction:column;justify-content:space-between;">
              <b style="font-family:'Fredoka';color:#0369a1;">SIGN #2: BANANAS</b>
              <div style="color:#94a3b8;font-size:12px;">(Draw bananas & write price)</div>
              <div style="font-family:'Fredoka';font-size:14px;color:#1e293b;">Price: <b>$ 1.00</b></div>
            </div>
          </div>
        </div>
      </div>
      <div class="creative-bottom">
        <div class="project-card">
          <div style="font-family:'Fredoka';font-size:16px;font-weight:700;color:#d97706;border-bottom:2px solid #e2e8f0;padding-bottom:6px;margin-bottom:10px;">📋 Reading Reflection & Can-Do</div>
          <div style="font-size:13px;line-height:1.8;color:#1e293b;">
            <div>✔️ I can read price signs at the market. &nbsp; <b>[ ] YES &nbsp; [ ] ALMOST</b></div>
            <div>✔️ I can find the price of a pineapple. &nbsp; <b>[ ] YES &nbsp; [ ] ALMOST</b></div>
            <div>✔️ I can blend onsets and rhymes (/t/ + /en/). &nbsp; <b>[ ] YES &nbsp; [ ] ALMOST</b></div>
            <div style="margin-top:6px;font-style:italic;color:#64748b;">"Reading in English is fun and helps me buy food!"</div>
          </div>
        </div>
        <div class="cert-card">
          <div><div style="font-family:'Fredoka';font-size:16px;font-weight:700;color:#854d0e;">CERTIFIED READER</div><div style="font-size:12px;color:#a16207;font-weight:700;">Grade 4 • Scenario 3 Theme 1</div></div>
          <div style="margin:6px 0;">{v_badge("A1.2 STAR",80)}</div>
          <div style="text-align:left;font-size:11.5px;color:#334155;line-height:1.6;"><div>✔️ Read "A Trip to the Market"</div><div>✔️ Completed Crossword Puzzle</div><div>✔️ Blended Phonics Sounds</div></div>
          <div style="border-top:1.5px dashed #ca8a04;width:100%;padding-top:4px;font-size:11px;font-weight:700;color:#854d0e;">Teacher: ____________________</div>
        </div>
      </div>
    </div>
    """
    return COMMON_CSS, p1 + p2 + p3 + p4

# -------------------------------------------------------------
# 3. LESSON 3: SPEAKING PACKET
# -------------------------------------------------------------
def get_lesson3_pages():
    p1 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav">
        <div style="display:flex;gap:8px;"><span class="pill pill-rose">Grade 4 • CEFR A1.2</span><span class="pill pill-indigo">Scenario 3 • Theme 1 • Lesson 3: Speaking</span></div>
        <div class="student-meta"><div>Speaker: <span class="meta-field">_____________________</span></div><div>Date: <span class="meta-field">__________</span></div></div>
      </div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#e11d48,#be123c);">
        <div><div class="mission-title">🗣️ MISSION 1: The Market Role-Play!</div><div class="mission-subtitle">Practice asking for prices and quantities using numbers up to 100!</div></div>
        <div>{v_price_tag("$3",48)}</div>
      </div>
      <div class="comic-grid">
        <div class="comic-panel"><div class="panel-num">1</div><div class="panel-art" style="background:#e0f2fe;"><img src="{asset('pineapple.png')}" style="width:70px;height:70px;margin-right:12px;">{v_price_tag("$3",60)}</div><div class="speech-bubble"><b>Customer:</b> "Excuse me! <b>How much is the pineapple?</b>"<br><b>Vendor:</b> "It is <b>three dollars ($3)</b>. How many do you need?"</div></div>
        <div class="comic-panel"><div class="panel-num">2</div><div class="panel-art" style="background:#fef3c7;"><img src="{asset('apple.png')}" style="width:65px;height:65px;margin-right:12px;">{v_price_tag("$1",55)}</div><div class="speech-bubble"><b>Customer:</b> "I need <b>one pineapple</b> and <b>three apples</b>, please."<br><b>Vendor:</b> "Apples are one dollar each."</div></div>
        <div class="comic-panel"><div class="panel-num">3</div><div class="panel-art" style="background:#ecfdf5;"><img src="{asset('banana.png')}" style="width:70px;height:70px;margin-right:12px;">{v_price_tag("$1",55)}</div><div class="speech-bubble"><b>Vendor:</b> "Do you need bananas today?"<br><b>Customer:</b> "Yes, <b>two bananas</b>, please!"</div></div>
        <div class="comic-panel"><div class="panel-num">4</div><div class="panel-art" style="background:#fff1f2;"><img src="{asset('money.png')}" style="width:65px;height:65px;margin-right:12px;">{v_price_tag("$6",60)}</div><div class="speech-bubble"><b>Vendor:</b> "That is <b>six dollars ($6)</b> in total."<br><b>Customer:</b> "Here is the money. Thank you!"</div></div>
      </div>
      <div class="mission-box">
        <div><div class="mission-box-title">💬 Speaking Key Phrases:</div><div class="clue-chips"><span class="clue-chip">Excuse me...</span><span class="clue-chip">How much is it?</span><span class="clue-chip">I need... please</span><span class="clue-chip">It is... dollars</span></div></div>
        <div style="border-left:2px solid #ca8a04;padding-left:14px;"><div class="check-item"><div class="check-circle"></div> Practice with partner</div><div class="check-item"><div class="check-circle"></div> Use polite tone</div></div>
      </div>
    </div>
    """
    p2 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-rose">Grade 4 • Speaking</span><span class="pill pill-amber">Stage 3 • Role Cards</span></div><div class="student-meta"><div>Speaker: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#e11d48,#be123c);"><div><div class="mission-title">🎭 MISSION 2: Market Role-Play Cards!</div><div class="mission-subtitle">Pick a role card with your partner. Act out the conversation out loud!</div></div><div>{v_badge("SPEAK",45)}</div></div>
      <div class="puzzle-split">
        <div class="puzzle-card">
          <div class="puzzle-card-header"><span>🛒 Customer Role Cards</span></div>
          <div style="background:#f0fdf4;border:2px dashed #16a34a;border-radius:12px;padding:10px;margin-bottom:12px;">
            <b style="color:#15803d;font-family:'Fredoka';font-size:14px;">CARD A: FRUIT SHOPPER</b><br>
            <div style="font-size:12.5px;color:#334155;margin-top:4px;">
              • You need: <b>1 Pineapple</b> & <b>3 Apples</b>.<br>
              • Say: <i>"Excuse me! How much is the pineapple?"</i><br>
              • Budget: You have <b>$10 dollars</b>.
            </div>
          </div>
          <div style="background:#fef3c7;border:2px dashed #ca8a04;border-radius:12px;padding:10px;">
            <b style="color:#854d0e;font-family:'Fredoka';font-size:14px;">CARD B: VEGGIE SHOPPER</b><br>
            <div style="font-size:12.5px;color:#334155;margin-top:4px;">
              • You need: <b>4 Carrots</b> & <b>2 Potatoes</b>.<br>
              • Say: <i>"Hello! How much are the potatoes?"</i><br>
              • Budget: You have <b>$5 dollars</b>.
            </div>
          </div>
        </div>
        <div class="puzzle-card">
          <div class="puzzle-card-header"><span>🏪 Vendor Price Cards</span></div>
          <div style="background:#e0f2fe;border:2px dashed #0284c7;border-radius:12px;padding:10px;margin-bottom:12px;">
            <b style="color:#0369a1;font-family:'Fredoka';font-size:14px;">CARD C: FRUIT VENDOR</b><br>
            <div style="font-size:12.5px;color:#334155;margin-top:4px;">
              • Pineapple: <b>$3.00 each</b><br>
              • Apple: <b>$1.00 each</b><br>
              • Bananas: <b>$1.00 for two</b><br>
              • Say: <i>"They are fresh and sweet!"</i>
            </div>
          </div>
          <div style="background:#fce7f3;border:2px dashed #db2777;border-radius:12px;padding:10px;">
            <b style="color:#be185d;font-family:'Fredoka';font-size:14px;">CARD D: VEGGIE VENDOR</b><br>
            <div style="font-size:12.5px;color:#334155;margin-top:4px;">
              • Potatoes: <b>$2.00 for two</b><br>
              • Carrots: <b>$1.00 for four</b><br>
              • Cassava (Yuca): <b>$2.00</b><br>
              • Say: <i>"Thank you for shopping here!"</i>
            </div>
          </div>
        </div>
      </div>
    </div>
    """
    p3 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-rose">Grade 4 • Speaking</span><span class="pill pill-teal">Stage 4 • Interactive Board Game</span></div><div class="student-meta"><div>Players: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#e11d48,#be123c);"><div><div class="mission-title">🎲 MISSION 3: "Market Talk Quest" Board Game</div><div class="mission-subtitle">Spin 1-4 • Complete the speaking challenge on your tile to stay!</div></div><div>{v_dice(val=5,sz=44)}</div></div>
      <div class="board-container">
        <div class="board-grid">
          <div class="space sp-start"><div class="space-num">1</div><div class="space-title">START! 🗣️</div><div>Greet your partner: "Hello!"</div></div>
          <div class="space sp-green"><div class="space-num">2</div><div class="space-title">Ask Price 🍍</div><div>Say: "How much is the pineapple?"</div></div>
          <div class="space sp-blue"><div class="space-num">3</div><div class="space-title">Polite Word ✨</div><div>Say "Excuse me" with a smile!</div></div>
          <div class="space sp-rose"><div class="space-num">4</div><div class="space-title">No Change! 🪙</div><div>Wait 1 turn while vendor gets coins.</div></div>
          <div class="space sp-amber"><div class="space-num">5</div><div class="space-title">Three Apples 🍎</div><div>Say: "I need three red apples!"</div></div>
          <div class="space sp-finish"><div class="space-num">16</div><div class="space-title">FINISH! 🏆</div><div>Say: "Have a nice day!" 🎉</div></div>
          <div class="game-hub">
            <div class="hub-title">🎙️ Market Speaking Game!</div>
            <div style="display:flex;align-items:center;gap:14px;"><div>{v_spinner(105)}</div><div class="hub-rules"><b>Rules:</b><br>1. Token on START.<br>2. Spin 1 to 4.<br>3. Speak the sentence in English.<br>4. If your partner approves, stay!</div></div>
            <div style="background:#fefce8;border:1.5px solid #ca8a04;border-radius:10px;padding:6px 14px;font-size:12px;font-weight:700;color:#854d0e;">💬 Helpful Tip: Speak clearly with good pronunciation!</div>
          </div>
          <div class="space sp-purple"><div class="space-num">6</div><div class="space-title">Two Bananas 🍌</div><div>Ask: "How much are the bananas?"</div></div>
          <div class="space sp-blue"><div class="space-num">15</div><div class="space-title">Pay Money 💵</div><div>Say: "Here is the money!"</div></div>
          <div class="space sp-green"><div class="space-num">7</div><div class="space-title">Orange Deal 🍊</div><div>Say: "Two dollars for oranges!"</div></div>
          <div class="space sp-amber"><div class="space-num">14</div><div class="space-title">Thank You 🙏</div><div>Say: "Thank you very much!"</div></div>
          <div class="space sp-blue"><div class="space-num">8</div><div class="space-title">Water Break 🥤</div><div>Say: "Water is delicious!"</div></div>
          <div class="space sp-rose"><div class="space-num">13</div><div class="space-title">Heavy Cart 🛒</div><div>Say: "My shopping cart is full!"</div></div>
          <div class="space sp-green"><div class="space-num">12</div><div class="space-title">Count Yucas 🥔</div><div>Say: "One, two yucas!"</div></div>
          <div class="space sp-purple"><div class="space-num">11</div><div class="space-title">Five Potatoes 🥔</div><div>Say: "I need five potatoes!"</div></div>
          <div class="space sp-blue"><div class="space-num">10</div><div class="space-title">Number 10 🔟</div><div>Count from 1 to 10 aloud!</div></div>
          <div class="space sp-amber"><div class="space-num">9</div><div class="space-title">Fast Tongue 👅</div><div>Say "Pineapple price" 3 times!</div></div>
        </div>
      </div>
    </div>
    """
    p4 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-rose">Grade 4 • Speaking</span><span class="pill pill-green">Stage 5 & 6 • Action Project</span></div><div class="student-meta"><div>Speaker: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#e11d48,#be123c);"><div><div class="mission-title">🎨 MISSION 4: Design Your Stall & Present!</div><div class="mission-subtitle">Action-Oriented Task: Draw your fruit stall and present your prices to the class!</div></div><div>{v_badge("ORAL",45)}</div></div>
      <div class="creative-top">
        <div class="draw-header"><div class="draw-title"><span>✏️ Task A: Design Your Market Stall!</span></div><div style="font-size:12px;font-weight:700;color:#64748b;">Draw 3 items you sell and write the price tag for each item!</div></div>
        <div class="draw-canvas"><div style="text-align:center;color:#94a3b8;font-family:'Fredoka';font-size:15px;">🏪 Draw your dream fruit or veggie stall here!<br><span style="font-size:12px;color:#cbd5e1;">(Add item names & price tags: $1, $2, $3...)</span></div></div>
      </div>
      <div class="creative-bottom">
        <div class="project-card">
          <div style="font-family:'Fredoka';font-size:16px;font-weight:700;color:#e11d48;border-bottom:2px solid #e2e8f0;padding-bottom:6px;margin-bottom:10px;">🗣️ Oral Presentation Script</div>
          <div style="font-size:13.5px;line-height:1.9;color:#1e293b;">
            <div>"Welcome to my stall! My name is <span class="p-line" style="width:130px;"></span>."</div>
            <div>"I sell <span class="p-line" style="width:110px;"></span> for <b>$ <span class="p-line" style="width:50px;"></span></b>."</div>
            <div>"My favorite fruit is <span class="p-line" style="width:110px;"></span> because it is sweet."</div>
            <div>"Thank you for visiting my stall!"</div>
          </div>
        </div>
        <div class="cert-card">
          <div><div style="font-family:'Fredoka';font-size:16px;font-weight:700;color:#854d0e;">CERTIFIED SPEAKER</div><div style="font-size:12px;color:#a16207;font-weight:700;">Grade 4 • Scenario 3 Theme 1</div></div>
          <div style="margin:6px 0;">{v_badge("SPEAK A1.2",80)}</div>
          <div style="text-align:left;font-size:11.5px;color:#334155;line-height:1.6;"><div>✔️ Asked: "How much is...?"</div><div>✔️ Answered: "It is... dollars"</div><div>✔️ Spoke with polite tone</div></div>
          <div style="border-top:1.5px dashed #ca8a04;width:100%;padding-top:4px;font-size:11px;font-weight:700;color:#854d0e;">Teacher: ____________________</div>
        </div>
      </div>
    </div>
    """
    return COMMON_CSS, p1 + p2 + p3 + p4

# -------------------------------------------------------------
# 4. LESSON 4: WRITING PACKET (Directly from pasted user planner!)
# -------------------------------------------------------------
def get_lesson4_pages():
    p1 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav">
        <div style="display:flex;gap:8px;"><span class="pill pill-indigo">Grade 4 • CEFR A1.2</span><span class="pill pill-amber">Scenario 3 • Theme 1 • Lesson 4: Writing</span></div>
        <div class="student-meta"><div>Writer: <span class="meta-field">_____________________</span></div><div>Date: <span class="meta-field">__________</span></div></div>
      </div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#4f46e5,#3730a3);">
        <div><div class="mission-title">✍️ MISSION 1: The Market Shopping Dialogue!</div><div class="mission-subtitle">Read the shopping list and complete the customer-vendor written dialogue!</div></div>
        <div>{v_price_tag("$3",48)}</div>
      </div>
      <div class="comic-grid">
        <div class="comic-panel"><div class="panel-num">1</div><div class="panel-art" style="background:#e0f2fe;"><img src="{asset('apple.png')}" style="width:65px;height:65px;margin-right:12px;">{v_price_tag("$2",55)}</div><div class="speech-bubble"><b>Customer:</b> "Hello! I need three <span class="fill-blank">a _ _ _ _ s</span>. How much are they?"<br><b>Vendor:</b> "They are <b>two dollars ($2)</b>."</div></div>
        <div class="comic-panel"><div class="panel-num">2</div><div class="panel-art" style="background:#fef3c7;"><img src="{asset('pineapple.png')}" style="width:70px;height:70px;margin-right:12px;">{v_price_tag("$3",60)}</div><div class="speech-bubble"><b>Customer:</b> "And one <span class="fill-blank">p _ _ _ _ _ _ _ e</span>. How much is it?"<br><b>Vendor:</b> "It is <b>three dollars ($3)</b>."</div></div>
        <div class="comic-panel"><div class="panel-num">3</div><div class="panel-art" style="background:#ecfdf5;"><img src="{asset('carrot.png')}" style="width:65px;height:65px;margin-right:12px;">{v_price_tag("$1",55)}</div><div class="speech-bubble"><b>Customer:</b> "I also need two <span class="fill-blank">c _ _ _ _ _ s</span>."<br><b>Vendor:</b> "Carrots are <b>one dollar ($1)</b>!"</div></div>
        <div class="comic-panel"><div class="panel-num">4</div><div class="panel-art" style="background:#fff1f2;"><img src="{asset('money.png')}" style="width:65px;height:65px;margin-right:12px;">{v_price_tag("$6",60)}</div><div class="speech-bubble"><b>Vendor:</b> "Your total is <b>six dollars ($6)</b>."<br><b>Customer:</b> "Here is the money. Thank you!"</div></div>
      </div>
      <div class="mission-box">
        <div><div class="mission-box-title">📝 Stage 2 Shopping List:</div><div class="clue-chips"><span class="clue-chip">1. Apples - 3</span><span class="clue-chip">2. Pineapple - 1</span><span class="clue-chip">3. Carrots - 2</span><span class="clue-chip">Total: $6</span></div></div>
        <div style="border-left:2px solid #ca8a04;padding-left:14px;"><div class="check-item"><div class="check-circle"></div> Write missing words</div><div class="check-item"><div class="check-circle"></div> Capitalize first letter</div></div>
      </div>
    </div>
    """
    p2 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-indigo">Grade 4 • Writing</span><span class="pill pill-teal">Stage 3 • Practice Puzzles</span></div><div class="student-meta"><div>Writer: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#4f46e5,#3730a3);"><div><div class="mission-title">🧩 MISSION 2: Missing Letters & Sentence Scramble!</div><div class="mission-subtitle">Stage 3 Practice: Complete spelling and unscramble shopping sentences!</div></div><div>{v_badge("WRITE",45)}</div></div>
      <div class="puzzle-split">
        <div class="puzzle-card">
          <div class="puzzle-card-header"><span>🔤 1. Missing Letters (Spelling Focus)</span></div>
          <div style="font-size:12.5px;color:#475569;margin-bottom:12px;">Fill in the missing letters to spell the market items:</div>
          <div style="display:flex;flex-direction:column;gap:12px;flex:1;justify-content:center;font-family:'Fredoka';font-size:15px;letter-spacing:2px;">
            <div style="display:flex;align-items:center;gap:10px;"><img src="{asset('pineapple.png')}" style="width:36px;height:36px;"> <b>P _ N _ A P P L _</b></div>
            <div style="display:flex;align-items:center;gap:10px;"><img src="{asset('banana.png')}" style="width:36px;height:36px;"> <b>B _ N A _ A</b></div>
            <div style="display:flex;align-items:center;gap:10px;"><img src="{asset('orange.png')}" style="width:36px;height:36px;"> <b>O _ A N _ E</b></div>
            <div style="display:flex;align-items:center;gap:10px;"><img src="{asset('carrot.png')}" style="width:36px;height:36px;"> <b>C _ R R _ T</b></div>
          </div>
          <div style="background:#fefce8;border:1.5px dashed #ca8a04;border-radius:10px;padding:6px;text-align:center;font-size:12px;font-family:'Fredoka';color:#854d0e;">
            Word Bank: PINEAPPLE • BANANA • ORANGE • CARROT
          </div>
        </div>
        <div class="puzzle-card">
          <div class="puzzle-card-header"><span>🔀 2. Sentence Scramble</span></div>
          <div style="font-size:12.5px;color:#475569;margin-bottom:10px;">Unscramble the words to write complete sentences:</div>
          <div style="display:flex;flex-direction:column;gap:14px;flex:1;justify-content:center;font-size:13px;">
            <div>
              <span style="background:#f1f5f9;padding:3px 8px;border-radius:6px;font-family:'Fredoka';">apples / I / need / three .</span><br>
              ➔ <span class="p-line" style="width:250px;">I need three apples.</span>
            </div>
            <div>
              <span style="background:#f1f5f9;padding:3px 8px;border-radius:6px;font-family:'Fredoka';">costs / The / pineapple / three / dollars .</span><br>
              ➔ <span class="p-line" style="width:250px;">The pineapple costs three dollars.</span>
            </div>
            <div>
              <span style="background:#f1f5f9;padding:3px 8px;border-radius:6px;font-family:'Fredoka';">dollars / are / They / two .</span><br>
              ➔ <span class="p-line" style="width:250px;">They are two dollars.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    """
    p3 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-indigo">Grade 4 • Writing</span><span class="pill pill-rose">Stage 4 • Interactive Board Game</span></div><div class="student-meta"><div>Players: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#4f46e5,#3730a3);"><div><div class="mission-title">🎲 MISSION 3: "Shopping List Builder" Board Game</div><div class="mission-subtitle">Spin 1-4 • Write the item name and quantity on your notepad as you play!</div></div><div>{v_dice(val=4,sz=44)}</div></div>
      <div class="board-container">
        <div class="board-grid">
          <div class="space sp-start"><div class="space-num">1</div><div class="space-title">START! 📝</div><div>Take your blank notepad!</div></div>
          <div class="space sp-green"><div class="space-num">2</div><div class="space-title">Apple Stand 🍎</div><div>Write: "3 apples"</div></div>
          <div class="space sp-blue"><div class="space-num">3</div><div class="space-title">Bonus Step! 🌟</div><div>Write: "1 pineapple" Move +1!</div></div>
          <div class="space sp-rose"><div class="space-num">4</div><div class="space-title">Broken Pencil ✏️</div><div>Sharpen pencil! Wait 1 turn.</div></div>
          <div class="space sp-amber"><div class="space-num">5</div><div class="space-title">Carrot Bin 🥕</div><div>Write: "2 carrots"</div></div>
          <div class="space sp-finish"><div class="space-num">16</div><div class="space-title">FINISH! 🏆</div><div>Check your completed list!</div></div>
          <div class="game-hub">
            <div class="hub-title">📋 List Builder Game!</div>
            <div style="display:flex;align-items:center;gap:14px;"><div>{v_spinner(105)}</div><div class="hub-rules"><b>Rules:</b><br>1. Token on START.<br>2. Spin 1 to 4.<br>3. Write the item name on your list.<br>4. Reach FINISH with 4 items written!</div></div>
            <div style="background:#fefce8;border:1.5px solid #ca8a04;border-radius:10px;padding:6px 14px;font-size:12px;font-weight:700;color:#854d0e;">✏️ Writing Tip: Check your spelling with the word bank!</div>
          </div>
          <div class="space sp-purple"><div class="space-num">6</div><div class="space-title">Banana Stand 🍌</div><div>Write: "2 bananas"</div></div>
          <div class="space sp-blue"><div class="space-num">15</div><div class="space-title">Total Calc 💵</div><div>Write: "Total = $6 dollars"</div></div>
          <div class="space sp-green"><div class="space-num">7</div><div class="space-title">Orange Box 🍊</div><div>Write: "4 oranges"</div></div>
          <div class="space sp-amber"><div class="space-num">14</div><div class="space-title">Fresh Bread 🥖</div><div>Write: "1 bread"</div></div>
          <div class="space sp-blue"><div class="space-num">8</div><div class="space-title">Rest Bench 🪑</div><div>Relax and review your notes.</div></div>
          <div class="space sp-rose"><div class="space-num">13</div><div class="space-title">Raindrop! 💧</div><div>Cover your paper! +1 space.</div></div>
          <div class="space sp-green"><div class="space-num">12</div><div class="space-title">Cassava 🥔</div><div>Write: "1 yuca"</div></div>
          <div class="space sp-purple"><div class="space-num">11</div><div class="space-title">Potato Sack 🥔</div><div>Write: "5 potatoes"</div></div>
          <div class="space sp-blue"><div class="space-num">10</div><div class="space-title">Clean Hands 🧼</div><div>Wash hands before writing!</div></div>
          <div class="space sp-amber"><div class="space-num">9</div><div class="space-title">Bonus Dice 🎲</div><div>Spell C-A-R-R-O-T to spin again!</div></div>
        </div>
      </div>
    </div>
    """
    p4 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-indigo">Grade 4 • Writing</span><span class="pill pill-green">Stage 4 & 5 • Performance Report</span></div><div class="student-meta"><div>Writer: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#4f46e5,#3730a3);"><div><div class="mission-title">📄 MISSION 4: "My Market Trip Report"</div><div class="mission-subtitle">Stage 4 Individual Task: Write your shopping report and complete the peer check!</div></div><div>{v_badge("REPORT",45)}</div></div>
      <div class="creative-top" style="height:360px;">
        <div class="draw-header"><div class="draw-title"><span>✏️ Stage 4: Individual Market Report</span></div><div style="font-size:12px;font-weight:700;color:#64748b;">Write clearly following the model structure from class!</div></div>
        <div class="draw-canvas" style="padding:18px;align-items:flex-start;justify-content:flex-start;">
          <div style="font-family:'Fredoka';font-size:14.5px;line-height:2.2;color:#1e293b;width:100%;">
            I went to the market today.<br>
            I bought <span class="p-line" style="width:190px;">three apples</span>. They cost <span class="p-line" style="width:140px;">two dollars</span>.<br>
            I also bought <span class="p-line" style="width:180px;">one pineapple</span>. It cost <span class="p-line" style="width:140px;">three dollars</span>.<br>
            My total was <span class="p-line" style="width:130px;">five</span> dollars.<br>
            It was fun!
          </div>
        </div>
      </div>
      <div class="creative-bottom" style="top:526px;height:460px;">
        <div class="project-card">
          <div style="font-family:'Fredoka';font-size:16px;font-weight:700;color:#4f46e5;border-bottom:2px solid #e2e8f0;padding-bottom:6px;margin-bottom:8px;">🔍 Stage 5: Peer Check & Evaluation</div>
          <div style="font-size:13px;line-height:1.7;color:#1e293b;">
            <b>Peer Reviewer Name:</b> <span class="p-line" style="width:140px;"></span><br>
            <div>[ ] Quantities match the shopping list</div>
            <div>[ ] Prices are written correctly with dollar sign ($)</div>
            <div>[ ] Sentences begin with capital letters</div>
            <div>[ ] Clear handwriting and neat presentation</div>
            <div style="margin-top:6px;background:#f8fafc;padding:6px 10px;border-radius:8px;font-size:12px;color:#475569;">
              <b>Peer Feedback:</b> "Great job! I liked how you wrote the prices clearly!"
            </div>
          </div>
        </div>
        <div class="cert-card">
          <div><div style="font-family:'Fredoka';font-size:16px;font-weight:700;color:#854d0e;">CERTIFIED WRITER</div><div style="font-size:12px;color:#a16207;font-weight:700;">Grade 4 • Scenario 3 Theme 1</div></div>
          <div style="margin:6px 0;">{v_badge("WRITER",80)}</div>
          <div style="text-align:left;font-size:11.5px;color:#334155;line-height:1.6;"><div>✔️ Completed Missing Letters</div><div>✔️ Unscrambled Sentences</div><div>✔️ Wrote Market Trip Report</div></div>
          <div style="border-top:1.5px dashed #ca8a04;width:100%;padding-top:4px;font-size:11px;font-weight:700;color:#854d0e;">Teacher: ____________________</div>
        </div>
      </div>
    </div>
    """
    return COMMON_CSS, p1 + p2 + p3 + p4

# -------------------------------------------------------------
# 5. LESSON 5: MEDIATION PACKET (Directly from pasted user planner!)
# -------------------------------------------------------------
def get_lesson5_pages():
    p1 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav">
        <div style="display:flex;gap:8px;"><span class="pill pill-green">Grade 4 • CEFR A1.2</span><span class="pill pill-indigo">Scenario 3 • Theme 1 • Lesson 5: Mediation</span></div>
        <div class="student-meta"><div>Mediator: <span class="meta-field">_____________________</span></div><div>Date: <span class="meta-field">__________</span></div></div>
      </div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#16a34a,#15803d);">
        <div><div class="mission-title">🤝 MISSION 1: Helping Our Absent Friend!</div><div class="mission-subtitle">Explain the market trip, items, and prices using words, numbers, and gestures!</div></div>
        <div>{v_price_tag("$3",48)}</div>
      </div>
      <div class="comic-grid">
        <div class="comic-panel"><div class="panel-num">1</div><div class="panel-art" style="background:#e0f2fe;"><img src="{asset('store.png')}" style="width:70px;height:70px;"></div><div class="speech-bubble"><b>Leo:</b> "Our classmate Carlos was absent yesterday! Let's explain what we bought at the market!"</div></div>
        <div class="comic-panel"><div class="panel-num">2</div><div class="panel-art" style="background:#fef3c7;"><img src="{asset('apple.png')}" style="width:65px;height:65px;margin-right:12px;">{v_price_tag("$2",55)}</div><div class="speech-bubble"><b>Mia (showing fingers):</b> "Look, Carlos! These are <b>two apples</b>. One, two! They cost <b>two dollars ($2)</b>. It's cheap!"</div></div>
        <div class="comic-panel"><div class="panel-num">3</div><div class="panel-art" style="background:#ecfdf5;"><img src="{asset('pineapple.png')}" style="width:70px;height:70px;margin-right:12px;">{v_price_tag("$3",60)}</div><div class="speech-bubble"><b>Leo:</b> "The <b>pineapple costs three dollars ($3)</b>. Two dollars plus three dollars equals <b>five dollars ($5)</b>!"</div></div>
        <div class="comic-panel"><div class="panel-num">4</div><div class="panel-art" style="background:#fff1f2;"><img src="{asset('money.png')}" style="width:65px;height:65px;margin-right:12px;">{v_price_tag("$5",60)}</div><div class="speech-bubble"><b>Carlos:</b> "Thank you, friends! Now I understand how much everything costs at the market!"</div></div>
      </div>
      <div class="mission-box">
        <div><div class="mission-box-title">🤝 Mediation Competences:</div><div class="clue-chips"><span class="clue-chip">Explain to peers</span><span class="clue-chip">Show with fingers</span><span class="clue-chip">Math concept: $2 + $3 = $5</span><span class="clue-chip">Kind & helpful</span></div></div>
        <div style="border-left:2px solid #ca8a04;padding-left:14px;"><div class="check-item"><div class="check-circle"></div> Use gestures</div><div class="check-item"><div class="check-circle"></div> Count 1 to 5 with hands</div></div>
      </div>
    </div>
    """
    p2 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-green">Grade 4 • Mediation</span><span class="pill pill-amber">Stage 3 • Practice & Math</span></div><div class="student-meta"><div>Mediator: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#16a34a,#15803d);"><div><div class="mission-title">🧩 MISSION 2: Quantity Drill & Math Explanation!</div><div class="mission-subtitle">Practice explaining quantities and prices with objects, drawings, and math!</div></div><div>{v_badge("MEDIATOR",45)}</div></div>
      <div class="puzzle-split">
        <div class="puzzle-card">
          <div class="puzzle-card-header"><span>🖐️ 1. Quantity Explanation Drill</span></div>
          <div style="font-size:12.5px;color:#475569;margin-bottom:12px;">Hold up your fingers and explain to your partner:</div>
          <div style="display:flex;flex-direction:column;gap:12px;flex:1;justify-content:center;font-size:13px;">
            <div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:10px;">
              <img src="{asset('potatoes.png')}" style="width:40px;height:40px;">
              <div><b>5 Potatoes:</b> "I need <u>five</u> potatoes. (Hold up 5 fingers!)"</div>
            </div>
            <div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:10px;">
              <img src="{asset('pineapple.png')}" style="width:40px;height:40px;">
              <div><b>1 Pineapple:</b> "This is <u>one</u> pineapple. It costs $3."</div>
            </div>
            <div style="background:#f8fafc;border:1.5px solid #cbd5e1;border-radius:10px;padding:8px 12px;display:flex;align-items:center;gap:10px;">
              <img src="{asset('apple.png')}" style="width:40px;height:40px;">
              <div><b>3 Apples:</b> "These are <u>three</u> apples. One, two, three!"</div>
            </div>
          </div>
        </div>
        <div class="puzzle-card">
          <div class="puzzle-card-header"><span>🧮 2. Price Math Explanation</span></div>
          <div style="font-size:12.5px;color:#475569;margin-bottom:10px;">Explain how the market prices add up together:</div>
          <div style="display:flex;flex-direction:column;gap:14px;flex:1;justify-content:center;font-size:13.5px;font-family:'Fredoka';">
            <div style="background:#f0fdf4;border:1.5px solid #86efac;border-radius:10px;padding:10px;">
              🍍 1 Pineapple ($3) &nbsp;+&nbsp; 🍎 2 Apples ($2)<br>
              ➔ Total: <b>$ <span class="p-line" style="width:50px;">5.00</span> dollars</b>
            </div>
            <div style="background:#fef3c7;border:1.5px solid #fde047;border-radius:10px;padding:10px;">
              🍌 2 Bananas ($1) &nbsp;+&nbsp; 🥕 4 Carrots ($1)<br>
              ➔ Total: <b>$ <span class="p-line" style="width:50px;">2.00</span> dollars</b>
            </div>
            <div style="background:#e0f2fe;border:1.5px solid #7dd3fc;border-radius:10px;padding:10px;">
              🥔 2 Potatoes ($2) &nbsp;+&nbsp; 🍍 1 Pineapple ($3)<br>
              ➔ Total: <b>$ <span class="p-line" style="width:50px;">5.00</span> dollars</b>
            </div>
          </div>
        </div>
      </div>
    </div>
    """
    p3 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-green">Grade 4 • Mediation</span><span class="pill pill-rose">Stage 4 • Interactive Board Game</span></div><div class="student-meta"><div>Team: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#16a34a,#15803d);"><div><div class="mission-title">🎲 MISSION 3: "Team Market Quest" Board Game</div><div class="mission-subtitle">Collaborate in pairs • Help your partner explain prices and quantities!</div></div><div>{v_dice(val=3,sz=44)}</div></div>
      <div class="board-container">
        <div class="board-grid">
          <div class="space sp-start"><div class="space-num">1</div><div class="space-title">START! 🤝</div><div>Form a 2-person team!</div></div>
          <div class="space sp-green"><div class="space-num">2</div><div class="space-title">Explain Fruit 🍍</div><div>Explain why pineapples are sweet!</div></div>
          <div class="space sp-blue"><div class="space-num">3</div><div class="space-title">Help Partner 🤲</div><div>Help partner count to 5! Move +1!</div></div>
          <div class="space sp-rose"><div class="space-num">4</div><div class="space-title">Confused Shopper 🤔</div><div>Explain prices politely!</div></div>
          <div class="space sp-amber"><div class="space-num">5</div><div class="space-title">Fingers Drill 🖐️</div><div>Show $3 with three fingers!</div></div>
          <div class="space sp-finish"><div class="space-num">16</div><div class="space-title">FINISH! 🏆</div><div>High-five your partner! 🎉</div></div>
          <div class="game-hub">
            <div class="hub-title">🤝 Teamwork Trail!</div>
            <div style="display:flex;align-items:center;gap:14px;"><div>{v_spinner(105)}</div><div class="hub-rules"><b>Rules:</b><br>1. Team token on START.<br>2. Spin 1 to 4.<br>3. Explain the concept together.<br>4. Take turns being the teacher!</div></div>
            <div style="background:#fefce8;border:1.5px solid #ca8a04;border-radius:10px;padding:6px 14px;font-size:12px;font-weight:700;color:#854d0e;">🤝 Mediation Tip: Use examples and gestures to make it easy to understand!</div>
          </div>
          <div class="space sp-purple"><div class="space-num">6</div><div class="space-title">Draw Clue ✏️</div><div>Draw an apple on paper for friend!</div></div>
          <div class="space sp-blue"><div class="space-num">15</div><div class="space-title">Math Check 🧮</div><div>Explain: "$2 + $1 = $3 dollars!"</div></div>
          <div class="space sp-green"><div class="space-num">7</div><div class="space-title">Cheap or Not? 💰</div><div>Explain: "Apples are cheap!"</div></div>
          <div class="space sp-amber"><div class="space-num">14</div><div class="space-title">Team Cheer 📣</div><div>Shout together: "We love English!"</div></div>
          <div class="space sp-blue"><div class="space-num">8</div><div class="space-title">Rest Bench 🪑</div><div>Rest together for 1 turn.</div></div>
          <div class="space sp-rose"><div class="space-num">13</div><div class="space-title">Lost List 📄</div><div>Help classmate remember: "Bananas!"</div></div>
          <div class="space sp-green"><div class="space-num">12</div><div class="space-title">Yuca Math 🥔</div><div>Explain: "Two yucas cost $4 dollars!"</div></div>
          <div class="space sp-purple"><div class="space-num">11</div><div class="space-title">Five Potatoes 🥔</div><div>Demonstrate counting: 1, 2, 3, 4, 5!</div></div>
          <div class="space sp-blue"><div class="space-num">10</div><div class="space-title">Cashier Role 🛒</div><div>Act as the kind cashier!</div></div>
          <div class="space sp-amber"><div class="space-num">9</div><div class="space-title">Bonus Spin ⚡</div><div>Explain 1 word with /p/ to spin again!</div></div>
        </div>
      </div>
    </div>
    """
    p4 = f"""
    <div class="sheet">{v_awning()}
      <div class="top-nav"><div style="display:flex;gap:8px;"><span class="pill pill-green">Grade 4 • Mediation</span><span class="pill pill-teal">Stage 4 & 5 • 21st Century Project</span></div><div class="student-meta"><div>Mediator: <span class="meta-field">_____________________</span></div></div></div>
      <div class="mission-banner" style="top:88px;background:linear-gradient(135deg,#16a34a,#15803d);"><div><div class="mission-title">🌟 MISSION 4: 21st Century Project Presentation</div><div class="mission-subtitle">Stage 4 Project: Explain your role-play transactions and complete your Exit Ticket!</div></div><div>{v_badge("PROJECT",45)}</div></div>
      <div class="creative-top" style="height:360px;">
        <div class="draw-header"><div class="draw-title"><span>✏️ Stage 4: Market Role-Play Explanation Project</span></div><div style="font-size:12px;font-weight:700;color:#64748b;">Explain what happened in your group role-play to another team!</div></div>
        <div class="draw-canvas" style="padding:18px;align-items:flex-start;justify-content:flex-start;">
          <div style="font-family:'Fredoka';font-size:14.5px;line-height:2.2;color:#1e293b;width:100%;">
            In our role-play, I was the <span class="p-line" style="width:130px;">customer</span>.<br>
            My partner was the <span class="p-line" style="width:130px;">vendor</span>.<br>
            I wanted one <span class="p-line" style="width:140px;">pineapple</span>. Look, one pineapple!<br>
            I asked: <i>"Excuse me, how much is the pineapple?"</i><br>
            The vendor explained: <i>"It is three dollars."</i><br>
            We used our fingers to show the price. It was easy to understand!
          </div>
        </div>
      </div>
      <div class="creative-bottom" style="top:526px;height:460px;">
        <div class="project-card">
          <div style="font-family:'Fredoka';font-size:16px;font-weight:700;color:#16a34a;border-bottom:2px solid #e2e8f0;padding-bottom:6px;margin-bottom:8px;">🎫 Stage 5: Student Exit Ticket</div>
          <div style="font-size:13px;line-height:1.8;color:#1e293b;">
            <div>1. I can explain how much one pineapple costs using my words and fingers: <br>
            &nbsp; <b>[ ] YES &nbsp; [ ] A LITTLE &nbsp; [ ] NO</b></div>
            <div>2. Was it easy to explain our market project to my friends? <br>
            &nbsp; <b>[ ] YES &nbsp; [ ] A LITTLE &nbsp; [ ] NO</b></div>
            <div>3. One thing I explained very well today was: <br>
            &nbsp; <span class="p-line" style="width:260px;">the price of the apples and pineapple</span></div>
          </div>
        </div>
        <div class="cert-card">
          <div><div style="font-family:'Fredoka';font-size:16px;font-weight:700;color:#854d0e;">CERTIFIED MEDIATOR</div><div style="font-size:12px;color:#a16207;font-weight:700;">Grade 4 • 21st Century Skills</div></div>
          <div style="margin:6px 0;">{v_badge("MEDIATOR",80)}</div>
          <div style="text-align:left;font-size:11.5px;color:#334155;line-height:1.6;"><div>✔️ Explained Market Trip to Peers</div><div>✔️ Demonstrated Math Prices</div><div>✔️ Collaborated in 21st C. Project</div></div>
          <div style="border-top:1.5px dashed #ca8a04;width:100%;padding-top:4px;font-size:11px;font-weight:700;color:#854d0e;">Teacher: ____________________</div>
        </div>
      </div>
    </div>
    """
    return COMMON_CSS, p1 + p2 + p3 + p4

def generate_packet(name, title_text, get_pages_fn):
    css, pages_html = get_pages_fn()
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{title_text}</title>
  <style>{css}</style>
</head>
<body>
  {pages_html}
</body>
</html>
"""
    html_file = os.path.join(PUBLIC_DIR, f"{name}.html")
    pdf_file = os.path.join(PUBLIC_DIR, f"{name}.pdf")
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Generated HTML: {html_file} ({len(html)} bytes)")

    cmd = [
        EDGE_EXE,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_file}",
        f"file:///{os.path.abspath(html_file)}"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_file):
        print(f"SUCCESS: Compiled PDF: {pdf_file} ({os.path.getsize(pdf_file)} bytes)")
    else:
        print(f"ERROR: Failed to compile {pdf_file}")
        print("Stderr:", res.stderr)

if __name__ == '__main__':
    packets = [
        ("Grade_4_Scenario_3_Theme_1_Lesson_1_Listening", "Grade 4 • Scenario 3 Theme 1 • Lesson 1: Listening", get_lesson1_pages),
        ("Grade_4_Scenario_3_Theme_1_Lesson_2_Reading", "Grade 4 • Scenario 3 Theme 1 • Lesson 2: Reading", get_lesson2_pages),
        ("Grade_4_Scenario_3_Theme_1_Lesson_3_Speaking", "Grade 4 • Scenario 3 Theme 1 • Lesson 3: Speaking", get_lesson3_pages),
        ("Grade_4_Scenario_3_Theme_1_Lesson_4_Writing", "Grade 4 • Scenario 3 Theme 1 • Lesson 4: Writing", get_lesson4_pages),
        ("Grade_4_Scenario_3_Theme_1_Lesson_5_Mediation", "Grade 4 • Scenario 3 Theme 1 • Lesson 5: Mediation", get_lesson5_pages)
    ]
    for name, title, fn in packets:
        print(f"\n--- Generating {name} ---")
        generate_packet(name, title, fn)
    print("\nALL 5 LESSONS GENERATED SUCCESSFULLY!")
