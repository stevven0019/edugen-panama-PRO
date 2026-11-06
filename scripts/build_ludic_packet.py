# -*- coding: utf-8 -*-
"""
EduGen Panama - Ludic 4-Page Activity Packet Generator
Grade 4 • Scenario 1 Theme 1: A Walk in the Neighborhood
Authentic playful format:
- Page 1: Comic Mission Adventure (Speech bubbles, clues, observation)
- Page 2: Detective Crossword & Word Search Puzzle
- Page 3: 2-Player Speaking Board Game with Spinner
- Page 4: Creative Project (Design your spot, Postcard to a friend & Explorer Badge)
"""
import os
import sys

# Add scripts directory to path to import art_neighborhood
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from art_neighborhood import (
    n_svg, awning, person_g, BOY_LUCAS, GIRL_MIA,
    dice, spinner, puppy, magnifying_glass, traffic_light, explorer_badge, star, pencil
)

def build_html():
    css = """
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

/* Header & Top Bar */
.top-nav {
  position: absolute;
  top: 46px;
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

.student-meta {
  display: flex;
  gap: 16px;
  font-family: 'Fredoka', cursive;
  font-size: 14px;
  color: #475569;
}
.meta-field {
  border-bottom: 2px dashed #94a3b8;
  padding: 0 40px 2px 4px;
  color: #0f172a;
}

/* Titles & Banners */
.mission-banner {
  position: absolute;
  left: 36px;
  right: 36px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
  border-radius: 14px;
  padding: 10px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
}
.mission-title {
  font-family: 'Fredoka', cursive;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.mission-subtitle {
  font-size: 12px;
  font-weight: 700;
  color: #e0f2fe;
}

/* Comic Panel Grid */
.comic-grid {
  position: absolute;
  top: 156px;
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
  font-size: 13.5px;
  line-height: 1.35;
  position: relative;
  box-shadow: 2px 2px 0px #cbd5e1;
}
.speech-bubble b {
  color: #0369a1;
}
.fill-blank {
  display: inline-block;
  min-width: 70px;
  border-bottom: 2px solid #0284c7;
  text-align: center;
  font-family: 'Fredoka', cursive;
  color: #0369a1;
  font-weight: 700;
}

/* Comic Bottom Box */
.mission-box {
  position: absolute;
  bottom: 50px;
  left: 36px;
  right: 36px;
  background: #fefce8;
  border: 2.5px dashed #eab308;
  border-radius: 16px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mission-box-left {
  flex: 1;
}
.mission-box-title {
  font-family: 'Fredoka', cursive;
  font-size: 16px;
  font-weight: 700;
  color: #854d0e;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.clue-chips {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}
.clue-chip {
  background: white;
  border: 1.5px solid #ca8a04;
  border-radius: 12px;
  padding: 4px 12px;
  font-family: 'Fredoka', cursive;
  font-size: 13px;
  font-weight: 600;
  color: #854d0e;
}
.check-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 3px;
}
.check-circle {
  width: 16px;
  height: 16px;
  border: 2px solid #64748b;
  border-radius: 4px;
}

/* Page 2: Crossword & Word Search */
.puzzle-split {
  position: absolute;
  top: 156px;
  left: 36px;
  right: 36px;
  bottom: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
}
.puzzle-card {
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.puzzle-card-header {
  font-family: 'Fredoka', cursive;
  font-size: 17px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f1f5f9;
  margin-bottom: 12px;
}

/* Crossword Grid Styles */
.crossword-container {
  display: flex;
  justify-content: center;
  margin: 10px 0 16px 0;
}
.cw-grid {
  display: grid;
  grid-template-columns: repeat(10, 26px);
  grid-template-rows: repeat(10, 26px);
  gap: 2px;
}
.cw-cell {
  width: 26px;
  height: 26px;
  background: white;
  border: 1.5px solid #0f172a;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', cursive;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}
.cw-cell.empty {
  background: transparent;
  border-color: transparent;
}
.cw-num {
  position: absolute;
  top: 1px;
  left: 2px;
  font-family: 'Nunito', sans-serif;
  font-size: 8px;
  font-weight: 800;
  color: #0284c7;
  line-height: 1;
}

.clue-list {
  font-size: 12.5px;
  line-height: 1.45;
  color: #334155;
}
.clue-title {
  font-family: 'Fredoka', cursive;
  font-weight: 700;
  font-size: 13px;
  color: #0284c7;
  margin-top: 6px;
  margin-bottom: 2px;
  text-transform: uppercase;
}

/* Word Search Grid */
.ws-container {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.ws-grid {
  display: grid;
  grid-template-columns: repeat(10, 30px);
  grid-template-rows: repeat(10, 30px);
  gap: 3px;
}
.ws-cell {
  width: 30px;
  height: 30px;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', cursive;
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
}
.ws-cell.highlight {
  background: #fef08a;
  border-color: #eab308;
  color: #854d0e;
}
.word-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
  justify-content: center;
}
.word-tag {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 3px 10px;
  font-family: 'Fredoka', cursive;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
}

/* Page 3: Board Game */
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
  position: relative;
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
  font-size: 10.5px;
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
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Fredoka', cursive;
  font-size: 11px;
}
.space-title {
  margin-top: 14px;
  font-family: 'Fredoka', cursive;
  font-size: 12px;
  font-weight: 700;
}
.sp-start { background: #bbf7d0; border-color: #16a34a; }
.sp-finish { background: #fef08a; border-color: #ca8a04; }
.sp-green { background: #dcfce7; }
.sp-blue { background: #e0f2fe; }
.sp-amber { background: #fef3c7; }
.sp-rose { background: #ffe4e6; }
.sp-purple { background: #f3e8ff; }

/* Center Game Hub */
.game-hub {
  grid-column: 2 / 5;
  grid-row: 2 / 5;
  background: #f8fafc;
  border: 2px dashed #94a3b8;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
}
.hub-title {
  font-family: 'Fredoka', cursive;
  font-size: 20px;
  font-weight: 700;
  color: #0369a1;
}
.hub-rules {
  font-size: 12px;
  line-height: 1.4;
  color: #334155;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 8px 12px;
  max-width: 320px;
}

/* Page 4: Creative Action Project & Postcard */
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
  margin-bottom: 10px;
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
.draw-prompt {
  font-family: 'Fredoka', cursive;
  font-size: 14px;
  color: #94a3b8;
  text-align: center;
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

/* Postcard Frame */
.postcard-card {
  background: #fffdf7;
  border: 2.5px solid #0f172a;
  border-radius: 20px;
  padding: 18px;
  box-shadow: 4px 4px 0px #0f172a;
  position: relative;
  display: flex;
  flex-direction: column;
}
.postcard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
  margin-bottom: 12px;
}
.postcard-title {
  font-family: 'Fredoka', cursive;
  font-size: 16px;
  font-weight: 700;
  color: #0284c7;
}
.stamp-box {
  width: 48px;
  height: 56px;
  border: 2px dashed #94a3b8;
  border-radius: 6px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
}
.postcard-body {
  font-family: 'Fredoka', cursive;
  font-size: 14px;
  line-height: 1.9;
  color: #1e293b;
}
.p-line {
  border-bottom: 2px solid #94a3b8;
  display: inline-block;
}

/* Explorer Certificate */
.cert-card {
  background: #fefce8;
  border: 2.5px solid #0f172a;
  border-radius: 20px;
  padding: 16px;
  box-shadow: 4px 4px 0px #0f172a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
}
.cert-title {
  font-family: 'Fredoka', cursive;
  font-size: 16px;
  font-weight: 700;
  color: #854d0e;
}
.cert-subtitle {
  font-size: 12px;
  color: #a16207;
  font-weight: 700;
}
.cert-checklist {
  text-align: left;
  width: 100%;
  font-size: 12px;
  color: #334155;
  line-height: 1.7;
}
    """

    # -------------------------------------------------------------
    # PAGE 1: Comic Mission Adventure
    # -------------------------------------------------------------
    p1 = f"""
    <div class="sheet">
      {awning(w=816, h=36)}
      
      <div class="top-nav">
        <div style="display:flex; gap:8px;">
          <span class="pill pill-teal">Grade 4 • CEFR A1.2</span>
          <span class="pill pill-indigo">Scenario 1 • Theme 1</span>
        </div>
        <div class="student-meta">
          <div>Explorer: <span class="meta-field">_____________________</span></div>
          <div>Date: <span class="meta-field">__________</span></div>
        </div>
      </div>

      <div class="mission-banner" style="top: 88px;">
        <div>
          <div class="mission-title">🕵️ MISSION 1: The Mystery of the Lost Puppy!</div>
          <div class="mission-subtitle">Read the comic panels. Follow the clues with Leo and Mia to find Sparky!</div>
        </div>
        <div style="display:flex; gap:6px;">
          {magnifying_glass(44)}
        </div>
      </div>

      <div class="comic-grid">
        <!-- Panel 1 -->
        <div class="comic-panel">
          <div class="panel-num">1</div>
          <div class="panel-art" style="background:#e0f2fe;">
            <svg width="240" height="150" viewBox="0 0 240 150">
              <rect x="0" y="110" width="240" height="40" fill="#cbd5e1"/>
              <g transform="translate(20, 20) scale(0.9)">{person_g(**BOY_LUCAS)}</g>
              <g transform="translate(85, 20) scale(0.9)">{person_g(**GIRL_MIA)}</g>
              <!-- Poster on wall -->
              <rect x="165" y="25" width="60" height="75" rx="6" fill="#fff" stroke="#dc2626" stroke-width="2"/>
              <text x="195" y="40" font-family="Fredoka" font-size="9" font-weight="700" fill="#dc2626" text-anchor="middle">LOST PUPPY!</text>
              <g transform="translate(175, 45) scale(0.5)">{puppy(sz=70)}</g>
              <text x="195" y="92" font-family="Fredoka" font-size="8" font-weight="700" fill="#1e293b" text-anchor="middle">"SPARKY"</text>
            </svg>
          </div>
          <div class="speech-bubble">
            <b>Leo:</b> "Oh no! Look at the poster! Sparky is lost in our neighborhood!"<br>
            <b>Mia:</b> "Let's check his <b>favorite place</b> first!"
          </div>
        </div>

        <!-- Panel 2 -->
        <div class="comic-panel">
          <div class="panel-num">2</div>
          <div class="panel-art" style="background:#fef3c7;">
            <svg width="240" height="150" viewBox="0 0 240 150">
              <rect x="0" y="100" width="240" height="50" fill="#86efac"/>
              <g transform="translate(10, 10)">{n_svg('tree', 100)}</g>
              <g transform="translate(130, 20)">{n_svg('park', 110)}</g>
            </svg>
          </div>
          <div class="speech-bubble">
            <b>Leo:</b> "Where does Sparky like to go?"<br>
            <b>Mia:</b> "He loves the <span class="fill-blank">p _ _ k</span> because there are big green <span class="fill-blank">t _ _ _ s</span> to sniff!"
          </div>
        </div>

        <!-- Panel 3 -->
        <div class="comic-panel">
          <div class="panel-num">3</div>
          <div class="panel-art" style="background:#f1f5f9;">
            <svg width="240" height="150" viewBox="0 0 240 150">
              <g transform="translate(20, 15)">{n_svg('street', 110)}</g>
              <g transform="translate(135, 20)">{traffic_light(sz=80)}</g>
            </svg>
          </div>
          <div class="speech-bubble">
            <b>Leo:</b> "Wait! Stop at the red light!"<br>
            <b>Mia:</b> "Look both ways before crossing the <span class="fill-blank">s _ _ _ _ t</span>!"
          </div>
        </div>

        <!-- Panel 4 -->
        <div class="comic-panel">
          <div class="panel-num">4</div>
          <div class="panel-art" style="background:#ecfdf5;">
            <svg width="240" height="150" viewBox="0 0 240 150">
              <rect x="0" y="105" width="240" height="45" fill="#a7f3d0"/>
              <g transform="translate(15, 20)">{n_svg('playground', 110)}</g>
              <g transform="translate(150, 40) scale(1.1)">{puppy(sz=70)}</g>
              <text x="185" y="32" font-family="Fredoka" font-size="12" font-weight="700" fill="#d97706">Woof! 🐶</text>
            </svg>
          </div>
          <div class="speech-bubble">
            <b>Mia:</b> "Hurray! There he is near the swings!"<br>
            <b>Leo:</b> "He is happy at the <span class="fill-blank">p _ _ _ _ _ _ _ _ d</span>!"
          </div>
        </div>
      </div>

      <div class="mission-box">
        <div class="mission-box-left">
          <div class="mission-box-title">
            <span>🎒 Word Bank for Detective Notes:</span>
          </div>
          <div class="clue-chips">
            <span class="clue-chip">park</span>
            <span class="clue-chip">trees</span>
            <span class="clue-chip">street</span>
            <span class="clue-chip">playground</span>
            <span class="clue-chip">favorite</span>
          </div>
        </div>
        <div style="border-left: 2px solid #fef08a; padding-left: 16px;">
          <div class="check-item"><div class="check-circle"></div> Spot the puppy collar</div>
          <div class="check-item"><div class="check-circle"></div> Fill in the 4 blanks</div>
          <div class="check-item"><div class="check-circle"></div> Read comic with a partner!</div>
        </div>
      </div>
    </div>
    """

    # -------------------------------------------------------------
    # PAGE 2: Detective Crossword & Word Search
    # -------------------------------------------------------------
    # Crossword cells:
    # 1 Across: TREE (row 1, col 2-5)
    # 2 Across: STREET (row 3, col 0-5)
    # 3 Across: PARK (row 5, col 3-6)
    # 4 Down: PLAYGROUND (row 0 to 9, col 3) - crosses P at row 5 col 3
    # 5 Down: FLOWER (row 4 to 9, col 8)
    cw_cells = ""
    # 10 rows x 10 cols
    cw_data = [
        ['', '', '', ('P','4'), '', '', '', '', '', ''],
        ['', '', ('T','1'), ('L',''), 'E', 'E', '', '', '', ''],
        ['', '', '', ('A',''), '', '', '', '', '', ''],
        [('S','2'), 'T', 'R', ('Y',''), 'E', 'T', '', '', '', ''],
        ['', '', '', ('G',''), '', '', '', '', ('F','5'), ''],
        ['', '', '', ('R','3'), 'A', 'R', 'K', '', 'L', ''],
        ['', '', '', ('O',''), '', '', '', '', 'O', ''],
        ['', '', '', ('U',''), '', '', '', '', 'W', ''],
        ['', '', '', ('N',''), '', '', '', '', 'E', ''],
        ['', '', '', ('D',''), '', '', '', '', 'R', ''],
    ]
    for r in range(10):
        for c in range(10):
            item = cw_data[r][c]
            if item == '':
                cw_cells += '<div class="cw-cell empty"></div>'
            elif isinstance(item, tuple):
                ch, num = item
                num_tag = f'<span class="cw-num">{num}</span>' if num else ''
                cw_cells += f'<div class="cw-cell">{num_tag}{ch}</div>'
            else:
                cw_cells += f'<div class="cw-cell">{item}</div>'

    # Word search grid 10x10
    # Words: BENCH, GRASS, SWING, SLIDE, BIRD, SUNNY
    ws_letters = [
        ['S','W','I','N','G','X','B','E','N','C'],
        ['U','B','G','R','A','S','S','Y','O','H'],
        ['N','I','J','K','L','L','I','D','E','B'],
        ['N','R','T','R','E','E','M','N','P','E'],
        ['Y','D','S','L','I','D','E','Q','R','N'],
        ['F','A','V','O','R','I','T','E','W','C'],
        ['K','B','E','N','C','H','Z','O','U','H'],
        ['L','I','B','R','A','R','Y','P','T','Q'],
        ['F','L','O','W','E','R','S','A','V','E'],
        ['S','T','R','E','E','T','B','R','K','Z']
    ]
    ws_cells = ""
    for r in range(10):
        for c in range(10):
            letter = ws_letters[r][c]
            # highlight the secret word FAVORITE at row 5
            is_hl = (r == 5 and 0 <= c <= 7)
            cls = "ws-cell highlight" if is_hl else "ws-cell"
            ws_cells += f'<div class="{cls}">{letter}</div>'

    p2 = f"""
    <div class="sheet">
      {awning(w=816, h=36)}
      
      <div class="top-nav">
        <div style="display:flex; gap:8px;">
          <span class="pill pill-amber">Grade 4 • CEFR A1.2</span>
          <span class="pill pill-teal">Scenario 1 • Theme 1</span>
        </div>
        <div class="student-meta">
          <div>Explorer: <span class="meta-field">_____________________</span></div>
          <div>Date: <span class="meta-field">__________</span></div>
        </div>
      </div>

      <div class="mission-banner" style="top: 88px; background: linear-gradient(135deg, #d97706 0%, #b45309 100%);">
        <div>
          <div class="mission-title">🧩 MISSION 2: Detective Word Puzzles!</div>
          <div class="mission-subtitle">Solve the clues, crack the crossword, and find the hidden neighborhood words!</div>
        </div>
        <div style="display:flex; gap:6px;">
          {magnifying_glass(44)}
        </div>
      </div>

      <div class="puzzle-split">
        <!-- Crossword Card -->
        <div class="puzzle-card">
          <div class="puzzle-card-header">
            <span>✏️ Neighborhood Crossword</span>
          </div>
          <div class="crossword-container">
            <div class="cw-grid">
              {cw_cells}
            </div>
          </div>
          <div class="clue-list">
            <div class="clue-title">Across ➔</div>
            <div><b>1.</b> Tall and green with wood branches.</div>
            <div><b>2.</b> Cars drive here and people cross.</div>
            <div><b>3.</b> Big green area to play and relax.</div>
            <div class="clue-title">Down ⬇</div>
            <div><b>4.</b> Place with swings, slides, and games!</div>
            <div><b>5.</b> Colorful plant that smells sweet.</div>
          </div>
        </div>

        <!-- Word Search Card -->
        <div class="puzzle-card">
          <div class="puzzle-card-header">
            <span>🔍 Secret Word Search</span>
          </div>
          <div class="ws-container">
            <div class="ws-grid">
              {ws_cells}
            </div>
          </div>
          <div style="font-size:12px; font-weight:700; color:#475569; text-align:center;">Find these 6 words:</div>
          <div class="word-tags">
            <span class="word-tag">SWING</span>
            <span class="word-tag">BENCH</span>
            <span class="word-tag">GRASS</span>
            <span class="word-tag">SLIDE</span>
            <span class="word-tag">BIRD</span>
            <span class="word-tag">SUNNY</span>
          </div>
          <div style="margin-top:14px; background:#fefce8; border:2px dashed #ca8a04; border-radius:12px; padding:8px 12px; text-align:center;">
            <div style="font-family:'Fredoka'; font-size:12.5px; font-weight:700; color:#854d0e;">⭐ Detective Secret Password:</div>
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0369a1; letter-spacing:4px; margin-top:2px;">F A V O R I T E</div>
          </div>
        </div>
      </div>
    </div>
    """

    # -------------------------------------------------------------
    # PAGE 3: The Big Neighborhood Board Game!
    # -------------------------------------------------------------
    p3 = f"""
    <div class="sheet">
      {awning(w=816, h=36)}
      
      <div class="top-nav">
        <div style="display:flex; gap:8px;">
          <span class="pill pill-rose">Grade 4 • CEFR A1.2</span>
          <span class="pill pill-indigo">Scenario 1 • Theme 1</span>
        </div>
        <div class="student-meta">
          <div>Players: <span class="meta-field">_____________________</span></div>
        </div>
      </div>

      <div class="mission-banner" style="top: 88px; background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);">
        <div>
          <div class="mission-title">🎲 MISSION 3: "Walk & Talk" Board Game!</div>
          <div class="mission-subtitle">2 Players • Spin the pencil or roll a die • Speak in English to advance!</div>
        </div>
        <div>
          {dice(val=5, sz=44)}
        </div>
      </div>

      <div class="board-container">
        <div class="board-grid">
          <!-- Row 1 (Top: 1 to 5) -->
          <div class="space sp-start">
            <div class="space-num">1</div>
            <div class="space-title">START! 🏠</div>
            <div>Place your tokens at your house!</div>
          </div>
          <div class="space sp-green">
            <div class="space-num">2</div>
            <div class="space-title">Big Tree 🌳</div>
            <div>Say 2 colors you see on a tree!</div>
          </div>
          <div class="space sp-blue">
            <div class="space-num">3</div>
            <div class="space-title">Crosswalk 🚶</div>
            <div>Look both ways! Move +1 space!</div>
          </div>
          <div class="space sp-rose">
            <div class="space-num">4</div>
            <div class="space-title">Red Light 🛑</div>
            <div>Say "STOP!". Wait 1 turn.</div>
          </div>
          <div class="space sp-amber">
            <div class="space-num">5</div>
            <div class="space-title">Swings! 🎪</div>
            <div>Say: "Wheee! I like to swing!"</div>
          </div>

          <!-- Row 2: Space 16 (left) and Space 6 (right) -->
          <div class="space sp-finish">
            <div class="space-num">16</div>
            <div class="space-title">FINISH! 🏆</div>
            <div>Shout: "I love my neighborhood!"</div>
          </div>
          
          <!-- Center Hub (Columns 2,3,4 x Rows 2,3,4) -->
          <div class="game-hub">
            <div class="hub-title">🏘️ Neighborhood Walk & Talk!</div>
            <div style="display:flex; align-items:center; gap:16px;">
              <div>{spinner(110)}</div>
              <div class="hub-rules">
                <b>How to Play:</b><br>
                1. Put an eraser on <b>START</b>.<br>
                2. Put a pencil point through a paperclip on the spinner.<br>
                3. Flick the paperclip! Move that many spaces.<br>
                4. Say the phrase in English to stay on the space!
              </div>
            </div>
            <div style="background:#fefce8; border:1.5px solid #ca8a04; border-radius:10px; padding:6px 14px; font-size:12px; font-weight:700; color:#854d0e;">
              💬 Phrase Helper: "My favorite place is..." • "I like it because..."
            </div>
          </div>

          <div class="space sp-purple">
            <div class="space-num">6</div>
            <div class="space-title">Ice Cream 🍦</div>
            <div>Name your favorite ice cream flavor!</div>
          </div>

          <!-- Row 3: Space 15 (left) and Space 7 (right) -->
          <div class="space sp-blue">
            <div class="space-num">15</div>
            <div class="space-title">Court 🏀</div>
            <div>Jump & score! Say 1 sport you like.</div>
          </div>
          <div class="space sp-green">
            <div class="space-num">7</div>
            <div class="space-title">Puppy! 🐶</div>
            <div>Pet Sparky! Move forward 1 space!</div>
          </div>

          <!-- Row 4: Space 14 (left) and Space 8 (right) -->
          <div class="space sp-amber">
            <div class="space-num">14</div>
            <div class="space-title">Bakery 🥖</div>
            <div>Mmm, fresh bread! Name 2 foods.</div>
          </div>
          <div class="space sp-blue">
            <div class="space-num">8</div>
            <div class="space-title">Bench 🪑</div>
            <div>Rest for 1 turn or say: "I am happy!"</div>
          </div>

          <!-- Row 5 (Bottom: 13 to 9) -->
          <div class="space sp-rose">
            <div class="space-num">13</div>
            <div class="space-title">Puddle! 💦</div>
            <div>Splash! Shake your feet and laugh!</div>
          </div>
          <div class="space sp-green">
            <div class="space-num">12</div>
            <div class="space-title">Bike Path 🚲</div>
            <div>Ring bell: "Ding ding!" Move +2 spaces!</div>
          </div>
          <div class="space sp-purple">
            <div class="space-num">11</div>
            <div class="space-title">Flowers 🌸</div>
            <div>Count 5 flowers in English out loud!</div>
          </div>
          <div class="space sp-blue">
            <div class="space-num">10</div>
            <div class="space-title">Library 📚</div>
            <div>Whisper: "Quiet please! I love books."</div>
          </div>
          <div class="space sp-amber">
            <div class="space-num">9</div>
            <div class="space-title">Shortcut ⚡</div>
            <div>Spell P-A-R-K out loud to roll again!</div>
          </div>
        </div>
      </div>
    </div>
    """

    # -------------------------------------------------------------
    # PAGE 4: Creative Action Challenge & Postcard
    # -------------------------------------------------------------
    p4 = f"""
    <div class="sheet">
      {awning(w=816, h=36)}
      
      <div class="top-nav">
        <div style="display:flex; gap:8px;">
          <span class="pill pill-indigo">Grade 4 • CEFR A1.2</span>
          <span class="pill pill-rose">Scenario 1 • Theme 1</span>
        </div>
        <div class="student-meta">
          <div>Explorer: <span class="meta-field">_____________________</span></div>
          <div>Date: <span class="meta-field">__________</span></div>
        </div>
      </div>

      <div class="mission-banner" style="top: 88px; background: linear-gradient(135deg, #4f46e5 0%, #3730a3 100%);">
        <div>
          <div class="mission-title">🎨 MISSION 4: Design Your Spot & Send a Postcard!</div>
          <div class="mission-subtitle">Action-Oriented Project: Draw your favorite place, write to a friend, and get certified!</div>
        </div>
        <div style="display:flex; gap:6px;">
          {star(40)}
        </div>
      </div>

      <!-- Top Drawing Canvas -->
      <div class="creative-top">
        <div class="draw-header">
          <div class="draw-title">
            <span>✏️ Task A: Draw Your Dream Neighborhood Spot!</span>
          </div>
          <div style="font-size:12px; font-weight:700; color:#64748b;">Include: 1 place • 1 tree or flower • You and a friend!</div>
        </div>
        <div class="draw-canvas">
          <div class="draw-prompt">
            🖼️ Draw and color your favorite neighborhood place here!<br>
            <span style="font-size:12px; color:#cbd5e1;">(Park, playground, bakery, or street)</span>
          </div>
        </div>
      </div>

      <!-- Bottom Postcard & Explorer Certificate -->
      <div class="creative-bottom">
        <!-- Postcard -->
        <div class="postcard-card">
          <div class="postcard-header">
            <div class="postcard-title">📬 Official Neighborhood Postcard</div>
            <div class="stamp-box">
              {star(22)}
              <span>POST</span>
            </div>
          </div>
          <div class="postcard-body">
            <div>Dear <span class="p-line" style="width:170px;"></span>,</div>
            <div style="margin-top:6px;">Greetings from my neighborhood!</div>
            <div>My favorite place is the <span class="p-line" style="width:130px;"></span>.</div>
            <div>I like it because <span class="p-line" style="width:170px;"></span>.</div>
            <div>Here you can see <span class="p-line" style="width:160px;"></span>.</div>
            <div style="margin-top:6px;">Come and visit me soon!</div>
            <div style="margin-top:12px; text-align:right;">
              Your friend, <span class="p-line" style="width:120px;"></span>
            </div>
          </div>
        </div>

        <!-- Certificate -->
        <div class="cert-card">
          <div>
            <div class="cert-title">🏅 NEIGHBORHOOD EXPLORER</div>
            <div class="cert-subtitle">Official MEDUCA Grade 4 Passport</div>
          </div>
          
          <div style="margin: 8px 0;">
            {explorer_badge(85)}
          </div>

          <div class="cert-checklist">
            <div>✔️ Solved Comic Mission 1</div>
            <div>✔️ Completed Crossword & Puzzle</div>
            <div>✔️ Played the Board Game</div>
            <div>✔️ Sent Postcard to a friend</div>
          </div>

          <div style="border-top:1.5px dashed #ca8a04; width:100%; padding-top:6px; font-size:11px; font-weight:700; color:#854d0e;">
            Teacher Signature: __________________
          </div>
        </div>
      </div>
    </div>
    """

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grade 4 • Scenario 1 Theme 1 • Ludic Activity Packet</title>
  <style>
    {css}
  </style>
</head>
<body>
  {p1}
  {p2}
  {p3}
  {p4}
</body>
</html>
"""
    return full_html

if __name__ == '__main__':
    import subprocess
    public_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public')
    out_html = os.path.join(public_dir, 'Grade_4_Scenario_1_Theme_1_Ludic_Activity_Packet.html')
    out_pdf = os.path.join(public_dir, 'Grade_4_Scenario_1_Theme_1_Ludic_Activity_Packet.pdf')
    html_content = build_html()
    with open(out_html, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"Generated HTML: {out_html} ({len(html_content)} bytes)")

    edge_exe = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    cmd = [
        edge_exe,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={out_pdf}",
        f"file:///{os.path.abspath(out_html)}"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_pdf):
        print(f"SUCCESS: Compiled PDF: {out_pdf} ({os.path.getsize(out_pdf)} bytes)")
    else:
        print(f"ERROR: Edge compilation failed")
        print("Stdout:", res.stdout)
        print("Stderr:", res.stderr)

