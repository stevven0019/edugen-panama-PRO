# -*- coding: utf-8 -*-
"""
EduGen Panama - Kindergarten Scenario 1 Theme 1 Master Activity Packet Builder
Curriculum: Scenario 1 "It's a School Day!" • Theme 1: "Let's Listen!" • Lesson 1: Listening
Architecture: Pixel-perfect 816px x 1056px Vertical Canva-Style Printable Workbook (Opción A).
Embedded high-resolution classroom assets from public/assets/nouns/
"""

import os
import base64

BASE_DIR = r"c:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas"
NOUNS_DIR = os.path.join(BASE_DIR, "public", "assets", "nouns")
OUTPUT_HTML = os.path.join(BASE_DIR, "public", "Kinder_Scenario_1_Theme_1_Lesson_1_Listening_Packet.html")

def get_b64_img(filename):
    path = os.path.join(NOUNS_DIR, filename)
    if not os.path.exists(path):
        print(f"Warning: {filename} not found!")
        return ""
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    ext = os.path.splitext(filename)[1].replace(".", "").lower()
    return f"data:image/{ext};base64,{data}"

# Pre-encode required classroom assets
BOOK = get_b64_img("book.png")
CHAIR = get_b64_img("chair.png")
DESK = get_b64_img("desk.png")
DOOR = get_b64_img("door.png")
WINDOW = get_b64_img("window.png")
TEACHER = get_b64_img("teacher.png")
STUDENT = get_b64_img("student.png")
PENCIL = get_b64_img("pencil.png")
CHILD = get_b64_img("child.png")
MUSIC = get_b64_img("music.png")

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap');

@page {
  size: 816px 1056px;
  margin: 0;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  padding: 0;
  background: #f1f5f9;
  font-family: 'Poppins', sans-serif;
  color: #1e293b;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.workbook-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 24px 0;
}
.page {
  width: 816px;
  height: 1056px;
  background: #ffffff;
  position: relative;
  overflow: hidden;
  page-break-after: always;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
@media print {
  body {
    background: #fff;
  }
  .workbook-container {
    padding: 0;
    gap: 0;
  }
  .page {
    box-shadow: none;
    margin: 0;
  }
}

/* Header & Badges */
.stage-badge {
  display: inline-block;
  padding: 6px 20px;
  border-radius: 9999px;
  font-family: 'Fredoka', cursive;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #ffffff;
  margin-bottom: 8px;
}
.stage-0 { background: #0284c7; }
.stage-1 { background: #f59e0b; }
.stage-2 { background: #16a34a; }
.stage-3 { background: #9333ea; }
.stage-4 { background: #e11d48; }
.stage-5 { background: #ea580c; }
.stage-6 { background: #0d9488; }
.stage-t { background: #475569; }

.page-header {
  padding: 24px 36px 12px;
  text-align: center;
}
.main-title {
  font-family: 'Fredoka', cursive;
  font-size: 38px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1.15;
}
.subtitle {
  font-size: 15px;
  font-weight: 600;
  color: #0284c7;
  margin: 4px 0 0;
}
.student-bar {
  display: flex;
  gap: 16px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 10px 18px;
  margin: 12px 36px 0;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}
.student-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}
.student-line {
  flex: 1;
  border-bottom: 1.5px dashed #94a3b8;
  height: 14px;
}

/* Footer */
.page-footer {
  margin-top: auto;
  padding: 14px 36px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1.5px solid #e2e8f0;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: #ffffff;
}
.footer-badge {
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 8px;
  color: #334155;
}

/* Card grids & components */
.content-area {
  padding: 12px 36px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.card {
  background: #ffffff;
  border-radius: 18px;
  border: 2px solid #e2e8f0;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
}
.instruction-box {
  background: #eff6ff;
  border-left: 5px solid #3b82f6;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 13.5px;
  color: #1e3a8a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.instruction-icon {
  font-size: 24px;
  flex-shrink: 0;
}
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.item-card {
  background: #ffffff;
  border: 2.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.item-img {
  width: 85px;
  height: 85px;
  object-fit: contain;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.08));
}
.item-name {
  font-family: 'Fredoka', cursive;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}
.action-bubble {
  font-family: 'Fredoka', cursive;
  background: #e0f2fe;
  border: 2px dashed #0284c7;
  color: #0369a1;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  margin-top: 6px;
}
"""

def render_page_1():
    return f"""
    <!-- PAGE 1: COVER -->
    <div class="page" style="background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 40%);">
      <div class="page-header" style="padding-top: 36px;">
        <span class="stage-badge stage-0">STAGE 0 • COVER & READINESS</span>
        <h1 class="main-title" style="font-size: 44px; color: #0f766e;">It's a School Day!</h1>
        <p class="subtitle" style="font-size: 18px; color: #0d9488;">Lesson 1 • Listening • Let's Listen!</p>
      </div>

      <div style="text-align: center; margin: 10px 36px 0;">
        <div style="display: flex; justify-content: center; align-items: flex-end; gap: 24px; height: 260px; background: #f0fdfa; border-radius: 24px; padding: 20px; border: 3px solid #99f6e4; position: relative; overflow: hidden;">
          <img src="{TEACHER}" style="height: 195px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15)); z-index: 2;" />
          <img src="{STUDENT}" style="height: 180px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15)); z-index: 2;" />
          <img src="{DESK}" style="height: 130px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15)); z-index: 2;" />
          <img src="{BOOK}" style="height: 110px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15)); z-index: 2;" />
          <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 35px; background: #6ee7b7; border-radius: 0 0 20px 20px;"></div>
        </div>
      </div>

      <div class="student-bar">
        <div class="student-field"><span>Name:</span><div class="student-line"></div></div>
        <div class="student-field"><span>Date:</span><div class="student-line"></div></div>
        <div class="student-field"><span>Class:</span><div class="student-line" style="flex:0.6;"></div></div>
      </div>

      <div class="content-area" style="padding-top: 14px;">
        <div style="background: #f8fafc; border: 2.5px solid #cbd5e1; border-radius: 18px; padding: 14px 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0f172a;">🏫 Classroom Objects Word Bank</span>
            <span style="font-size:11px; font-weight:700; color:#0d9488; background:#ccfbf1; padding:2px 8px; border-radius:6px;">8 Core Objects</span>
          </div>
          <div class="grid-4" style="gap: 10px;">
            <div class="item-card" style="padding: 8px; border-color: #93c5fd;">
              <img src="{BOOK}" style="width: 50px; height: 50px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">book</span>
              <span style="font-size: 11px; color:#1e40af; background:#dbeafe; padding:1px 6px; border-radius:9999px;">open book</span>
            </div>
            <div class="item-card" style="padding: 8px; border-color: #fde047;">
              <img src="{CHAIR}" style="width: 50px; height: 50px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">chair</span>
              <span style="font-size: 11px; color:#854d0e; background:#fef08a; padding:1px 6px; border-radius:9999px;">sit down</span>
            </div>
            <div class="item-card" style="padding: 8px; border-color: #86efac;">
              <img src="{DESK}" style="width: 50px; height: 50px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">desk</span>
              <span style="font-size: 11px; color:#15803d; background:#dcfce7; padding:1px 6px; border-radius:9999px;">touch desk</span>
            </div>
            <div class="item-card" style="padding: 8px; border-color: #fca5a5;">
              <img src="{DOOR}" style="width: 50px; height: 50px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">door</span>
              <span style="font-size: 11px; color:#b91c1c; background:#fee2e2; padding:1px 6px; border-radius:9999px;">look at door</span>
            </div>
            <div class="item-card" style="padding: 8px; border-color: #c7d2fe;">
              <img src="{WINDOW}" style="width: 50px; height: 50px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">window</span>
              <span style="font-size: 11px; color:#4338ca; background:#e0e7ff; padding:1px 6px; border-radius:9999px;">point window</span>
            </div>
            <div class="item-card" style="padding: 8px; border-color: #fed7aa;">
              <img src="{PENCIL}" style="width: 50px; height: 50px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">pencil</span>
              <span style="font-size: 11px; color:#c2410c; background:#ffedd5; padding:1px 6px; border-radius:9999px;">hold pencil</span>
            </div>
            <div class="item-card" style="padding: 8px; border-color: #fbcfe8;">
              <img src="{TEACHER}" style="width: 50px; height: 50px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">teacher</span>
              <span style="font-size: 11px; color:#be185d; background:#fce7f3; padding:1px 6px; border-radius:9999px;">listen</span>
            </div>
            <div class="item-card" style="padding: 8px; border-color: #99f6e4;">
              <img src="{STUDENT}" style="width: 50px; height: 50px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">student</span>
              <span style="font-size: 11px; color:#0f766e; background:#ccfbf1; padding:1px 6px; border-radius:9999px;">stand up</span>
            </div>
          </div>
        </div>

        <!-- Target Goal -->
        <div style="display: flex; align-items: center; gap: 14px; background: #eff6ff; border: 2px solid #bfdbfe; border-radius: 16px; padding: 12px 18px; margin-top: 14px;">
          <div style="font-size: 32px;">🎯</div>
          <div>
            <div style="font-family:'Fredoka'; font-size:15px; font-weight:700; color:#1e40af;">My Lesson Goal:</div>
            <div style="font-size:13.5px; font-weight:600; color:#1d4ed8;">I can listen to classroom instructions and follow commands with gestures!</div>
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span class="footer-badge">Kindergarten • CEFR Pre-A1.2</span>
        <span>Scenario 1 • Theme 1 • Lesson 1 Listening</span>
        <span style="font-weight:700; color:#0f172a;">Page 1 of 8</span>
      </div>
    </div>
    """

def render_page_2():
    return f"""
    <!-- PAGE 2: STAGE 1 WARM-UP -->
    <div class="page">
      <div class="page-header">
        <span class="stage-badge stage-1">STAGE 1 • WARM-UP / PRE-TASK</span>
        <h2 class="main-title" style="font-size: 32px;">Classroom Commands & Sounds</h2>
        <p class="subtitle">Engagement, Modeling & Physical Response (TPR)</p>
      </div>

      <div class="content-area">
        <div class="instruction-box">
          <div class="instruction-icon">👂</div>
          <div><b>Teacher Prompt:</b> "Good morning students! Listen carefully: When you hear <i>'Stand up!'</i> stand tall! When you hear <i>'Sit down!'</i> sit quietly!"</div>
        </div>

        <!-- Part A: TPR Command Pairs -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">A. Core Classroom Commands (Listen & Do)</div>
        <div class="grid-2" style="margin-bottom: 16px;">
          <div class="card" style="border: 2.5px solid #0284c7; background: #f0f9ff; text-align: center; padding: 16px;">
            <img src="{STUDENT}" style="width: 90px; height: 90px; object-fit: contain; margin-bottom: 6px;" />
            <div style="font-family:'Fredoka'; font-size: 22px; font-weight:700; color:#0369a1;">"Stand up!"</div>
            <div style="font-size:13px; font-weight:700; background:#0284c7; color:#fff; border-radius:9999px; padding:4px 14px; margin-top:6px; display:inline-block;">🧍 Stand up tall!</div>
            <div style="font-size:12px; color:#64748b; margin-top:6px;">Listen for command 👂</div>
          </div>
          <div class="card" style="border: 2.5px solid #f59e0b; background: #fffbeb; text-align: center; padding: 16px;">
            <img src="{CHAIR}" style="width: 90px; height: 90px; object-fit: contain; margin-bottom: 6px;" />
            <div style="font-family:'Fredoka'; font-size: 22px; font-weight:700; color:#b45309;">"Sit down!"</div>
            <div style="font-size:13px; font-weight:700; background:#f59e0b; color:#fff; border-radius:9999px; padding:4px 14px; margin-top:6px; display:inline-block;">🪑 Sit in your chair!</div>
            <div style="font-size:12px; color:#64748b; margin-top:6px;">Quiet and ready 🤫</div>
          </div>
        </div>

        <!-- Part B: Phonics & Initial Letter Focus -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">B. Letter & Sound Focus</div>
        <div class="grid-3" style="margin-bottom: 16px;">
          <div class="card" style="text-align: center; border-color: #38bdf8;">
            <div style="font-family:'Fredoka'; font-size: 34px; color:#0284c7; font-weight:700;">Ss</div>
            <img src="{STUDENT}" style="width: 60px; height: 60px; object-fit: contain;" />
            <div style="font-weight:700; font-size:14px; color:#0f172a;">S is for School</div>
            <div style="font-size:12px; color:#0284c7; font-weight:600;">/s/ sound</div>
          </div>
          <div class="card" style="text-align: center; border-color: #4ade80;">
            <div style="font-family:'Fredoka'; font-size: 34px; color:#16a34a; font-weight:700;">Ll</div>
            <img src="{TEACHER}" style="width: 60px; height: 60px; object-fit: contain;" />
            <div style="font-weight:700; font-size:14px; color:#0f172a;">L is for Listen</div>
            <div style="font-size:12px; color:#16a34a; font-weight:600;">/l/ sound</div>
          </div>
          <div class="card" style="text-align: center; border-color: #f87171;">
            <div style="font-family:'Fredoka'; font-size: 34px; color:#dc2626; font-weight:700;">Bb</div>
            <img src="{BOOK}" style="width: 60px; height: 60px; object-fit: contain;" />
            <div style="font-weight:700; font-size:14px; color:#0f172a;">B is for Book</div>
            <div style="font-size:12px; color:#dc2626; font-weight:600;">/b/ sound</div>
          </div>
        </div>

        <!-- Part C: CCQ Questions -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">C. Clarification Check (Circle YES or NO)</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:2px solid #e2e8f0; border-radius:12px; padding:8px 16px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <img src="{BOOK}" style="width:40px; height:40px; object-fit:contain;" />
              <span style="font-weight:600; font-size:14px;">Is this a book?</span>
            </div>
            <div style="display:flex; gap:10px;">
              <span style="border:2.5px solid #22c55e; background:#dcfce7; color:#15803d; padding:4px 12px; border-radius:8px; font-weight:700; font-size:12px;">YES ✓</span>
              <span style="border:2px solid #cbd5e1; padding:4px 12px; border-radius:8px; font-weight:700; font-size:12px;">NO</span>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:2px solid #e2e8f0; border-radius:12px; padding:8px 16px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <img src="{CHAIR}" style="width:40px; height:40px; object-fit:contain;" />
              <span style="font-weight:600; font-size:14px;">Do we stand up when the teacher says "Sit down"?</span>
            </div>
            <div style="display:flex; gap:10px;">
              <span style="border:2px solid #cbd5e1; padding:4px 12px; border-radius:8px; font-weight:700; font-size:12px;">YES</span>
              <span style="border:2.5px solid #22c55e; background:#dcfce7; color:#15803d; padding:4px 12px; border-radius:8px; font-weight:700; font-size:12px;">NO ✓</span>
            </div>
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span class="footer-badge">Kindergarten • CEFR Pre-A1.2</span>
        <span>Stage 1: Engagement & Modeling</span>
        <span style="font-weight:700; color:#0f172a;">Page 2 of 8</span>
      </div>
    </div>
    """

def render_page_3():
    return f"""
    <!-- PAGE 3: STAGE 2 PRESENTATION -->
    <div class="page">
      <div class="page-header">
        <span class="stage-badge stage-2">STAGE 2 • PRESENTATION / INPUT</span>
        <h2 class="main-title" style="font-size: 32px;">Listen and Point to the Object</h2>
        <p class="subtitle">Scenario: "It's a School Day!" — Listening to Instructions</p>
      </div>

      <div class="content-area">
        <div class="instruction-box" style="border-left-color: #16a34a; background:#f0fdf4;">
          <div class="instruction-icon">👉</div>
          <div><b>Activity 1:</b> The teacher says an instruction. Listen carefully and <b>POINT</b> to the correct classroom object!</div>
        </div>

        <!-- 3 Big Cards -->
        <div class="grid-3" style="margin-bottom: 20px;">
          <div class="card" style="border: 3px solid #93c5fd; text-align: center; padding: 18px;">
            <div style="width:32px; height:32px; border-radius:50%; background:#dbeafe; color:#1e40af; font-weight:800; font-size:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 8px;">1</div>
            <img src="{BOOK}" style="width: 105px; height: 105px; object-fit: contain; margin-bottom: 8px;" />
            <div style="font-family:'Fredoka'; font-size: 22px; font-weight:700; color:#0f172a;">Book</div>
            <div class="action-bubble">"Open the book!"</div>
            <div style="font-size:12px; font-weight:600; color:#64748b; margin-top:8px;">Gesture: open hands 📖</div>
          </div>
          <div class="card" style="border: 3px solid #fde047; text-align: center; padding: 18px;">
            <div style="width:32px; height:32px; border-radius:50%; background:#fef08a; color:#854d0e; font-weight:800; font-size:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 8px;">2</div>
            <img src="{CHAIR}" style="width: 105px; height: 105px; object-fit: contain; margin-bottom: 8px;" />
            <div style="font-family:'Fredoka'; font-size: 22px; font-weight:700; color:#0f172a;">Chair</div>
            <div class="action-bubble" style="background:#fef08a; border-color:#ca8a04; color:#854d0e;">"Sit on your chair!"</div>
            <div style="font-size:12px; font-weight:600; color:#64748b; margin-top:8px;">Gesture: sit down 🪑</div>
          </div>
          <div class="card" style="border: 3px solid #86efac; text-align: center; padding: 18px;">
            <div style="width:32px; height:32px; border-radius:50%; background:#dcfce7; color:#15803d; font-weight:800; font-size:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 8px;">3</div>
            <img src="{DESK}" style="width: 105px; height: 105px; object-fit: contain; margin-bottom: 8px;" />
            <div style="font-family:'Fredoka'; font-size: 22px; font-weight:700; color:#0f172a;">Desk</div>
            <div class="action-bubble" style="background:#dcfce7; border-color:#22c55e; color:#15803d;">"Touch the desk!"</div>
            <div style="font-size:12px; font-weight:600; color:#64748b; margin-top:8px;">Gesture: touch wood ✋</div>
          </div>
        </div>

        <!-- Activity 2: Movement & Environmental Listening -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">Activity 2: Look, Listen, and Move</div>
        <div class="grid-2">
          <div style="display:flex; align-items:center; gap:16px; background:#f8fafc; border:2px solid #e2e8f0; border-radius:16px; padding:12px 18px;">
            <img src="{DOOR}" style="width: 65px; height: 65px; object-fit: contain;" />
            <div>
              <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a;">"Look at the door!" 🚪</div>
              <div style="font-size:13px; color:#475569;">Turn your head and point to the classroom door.</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:16px; background:#f8fafc; border:2px solid #e2e8f0; border-radius:16px; padding:12px 18px;">
            <img src="{WINDOW}" style="width: 65px; height: 65px; object-fit: contain;" />
            <div>
              <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a;">"Look at the window!" 🪟</div>
              <div style="font-size:13px; color:#475569;">See the sunny morning outside.</div>
            </div>
          </div>
        </div>

        <!-- Activity 3: Polite Language Focus -->
        <div style="margin-top: 18px; background: #ecfeff; border: 2px solid #a5f3fc; border-radius: 16px; padding: 14px 20px; display:flex; justify-content:space-around; align-items:center;">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="{TEACHER}" style="width:55px; height:55px; object-fit:contain;" />
            <div>
              <div style="font-weight:700; font-size:14px; color:#0e7490;">Teacher says politely:</div>
              <div style="font-size:13px; color:#155e75;"><i>"Please, stand up."</i></div>
            </div>
          </div>
          <div style="width:2px; height:45px; background:#67e8f9;"></div>
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="{STUDENT}" style="width:55px; height:55px; object-fit:contain;" />
            <div>
              <div style="font-weight:700; font-size:14px; color:#0e7490;">Students respond:</div>
              <div style="font-size:13px; color:#155e75;">Stand up with a smile 😊</div>
            </div>
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span class="footer-badge">Kindergarten • CEFR Pre-A1.2</span>
        <span>Stage 2: Input & Comprehension</span>
        <span style="font-weight:700; color:#0f172a;">Page 3 of 8</span>
      </div>
    </div>
    """

def render_page_4():
    return f"""
    <!-- PAGE 4: STAGE 3 PRACTICE -->
    <div class="page">
      <div class="page-header">
        <span class="stage-badge stage-3">STAGE 3 • PREPARATION / PRACTICE</span>
        <h2 class="main-title" style="font-size: 32px;">Musical Commands & Classroom Game</h2>
        <p class="subtitle">Controlled Practice: Movement, Imperatives, and Accuracy</p>
      </div>

      <div class="content-area">
        <div class="instruction-box" style="border-left-color: #9333ea; background:#faf5ff;">
          <div class="instruction-icon">🎵</div>
          <div><b>Activity 1: Musical Classroom!</b> Walk around gently to the music. When the music stops, <b>FREEZE</b> and do the teacher's command!</div>
        </div>

        <!-- 4 Command Stations -->
        <div class="grid-4" style="margin-bottom: 20px;">
          <div class="item-card" style="border: 2.5px solid #0284c7; padding: 14px;">
            <div style="font-family:'Fredoka'; font-size: 16px; font-weight:700; color:#0284c7; margin-bottom:4px;">Command 1</div>
            <img src="{STUDENT}" class="item-img" style="width:75px; height:75px;" />
            <div class="item-name" style="font-size:16px;">Stand up!</div>
            <div style="font-size:11px; font-weight:700; color:#0284c7; margin-top:4px;">🧍 Reach high!</div>
          </div>
          <div class="item-card" style="border: 2.5px solid #f59e0b; padding: 14px;">
            <div style="font-family:'Fredoka'; font-size: 16px; font-weight:700; color:#d97706; margin-bottom:4px;">Command 2</div>
            <img src="{CHAIR}" class="item-img" style="width:75px; height:75px;" />
            <div class="item-name" style="font-size:16px;">Sit down!</div>
            <div style="font-size:11px; font-weight:700; color:#d97706; margin-top:4px;">🪑 Sit quietly!</div>
          </div>
          <div class="item-card" style="border: 2.5px solid #16a34a; padding: 14px;">
            <div style="font-family:'Fredoka'; font-size: 16px; font-weight:700; color:#16a34a; margin-bottom:4px;">Command 3</div>
            <img src="{BOOK}" class="item-img" style="width:75px; height:75px;" />
            <div class="item-name" style="font-size:16px;">Open book!</div>
            <div style="font-size:11px; font-weight:700; color:#16a34a; margin-top:4px;">📖 Open hands!</div>
          </div>
          <div class="item-card" style="border: 2.5px solid #ef4444; padding: 14px;">
            <div style="font-family:'Fredoka'; font-size: 16px; font-weight:700; color:#dc2626; margin-bottom:4px;">Command 4</div>
            <img src="{DESK}" class="item-img" style="width:75px; height:75px;" />
            <div class="item-name" style="font-size:16px;">Touch desk!</div>
            <div style="font-size:11px; font-weight:700; color:#dc2626; margin-top:4px;">✋ Touch desk!</div>
          </div>
        </div>

        <!-- Activity 2: Teacher Says, You Do! -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">Activity 2: Teacher Says, You Do!</div>
        <div class="grid-2" style="margin-bottom: 20px;">
          <div style="background:#f8fafc; border:2px solid #e2e8f0; border-radius:16px; padding:14px; display:flex; align-items:center; gap:14px;">
            <div style="font-size:32px;">👂</div>
            <div>
              <div style="font-weight:700; font-size:14px; color:#0f172a;">"Teacher says: Listen quietly!"</div>
              <div style="font-size:12px; color:#64748b; margin-top:2px;">Put one finger to your lips: <i>"Shh..."</i> 🤫</div>
            </div>
          </div>
          <div style="background:#f8fafc; border:2px solid #e2e8f0; border-radius:16px; padding:14px; display:flex; align-items:center; gap:14px;">
            <div style="font-size:32px;">🧹</div>
            <div>
              <div style="font-weight:700; font-size:14px; color:#0f172a;">"Teacher says: Clean up your table!"</div>
              <div style="font-size:12px; color:#64748b; margin-top:2px;">Put pencils neatly in the box! ✏️</div>
            </div>
          </div>
        </div>

        <!-- Activity 3: Pair Interaction -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">Activity 3: Partner Command Exchange</div>
        <div style="background:#f1f5f9; border:2px dashed #94a3b8; border-radius:16px; padding:14px 20px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="font-size:32px;">🤝</div>
            <div>
              <div style="font-weight:700; font-size:14px; color:#1e293b;">Be the Classroom Helper!</div>
              <div style="font-size:12.5px; color:#475569;">Student A says politely: <i>"Please stand up!"</i><br>Student B listens and stands up! Then take turns.</div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <img src="{TEACHER}" style="width:45px; height:45px; object-fit:contain;" />
            <img src="{STUDENT}" style="width:45px; height:45px; object-fit:contain;" />
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span class="footer-badge">Kindergarten • CEFR Pre-A1.2</span>
        <span>Stage 3: Guided Practice</span>
        <span style="font-weight:700; color:#0f172a;">Page 4 of 8</span>
      </div>
    </div>
    """

def render_page_5():
    return f"""
    <!-- PAGE 5: STAGE 4 PRODUCTION -->
    <div class="page">
      <div class="page-header">
        <span class="stage-badge stage-4">STAGE 4 • PERFORMANCE / PRODUCTION</span>
        <h2 class="main-title" style="font-size: 30px;">Simon Says: School Commands Game!</h2>
        <p class="subtitle">Collaborative Group Game (Groups of 3–4 Learners)</p>
      </div>

      <div class="content-area">
        <div class="instruction-box" style="border-left-color: #e11d48; background:#fff1f2;">
          <div class="instruction-icon">👑</div>
          <div><b>How to Play:</b> One student is "Simon". Simon gives a command: <b>"Simon says, open the book!"</b> Only follow the action if Simon says the magic words!</div>
        </div>

        <!-- Roles & Questions Banner -->
        <div class="grid-2" style="margin-bottom: 14px;">
          <div style="background:#fff7ed; border:2px solid #fdba74; border-radius:14px; padding:10px 16px;">
            <div style="font-family:'Fredoka'; font-size:14px; font-weight:700; color:#c2410c;">👥 Group Roles (3-4 kids):</div>
            <div style="font-size:12px; color:#7c2d12; margin-top:2px;">
              • <b>Simon (Leader):</b> Holds the command card.<br>
              • <b>Students:</b> Listen carefully and follow.<br>
              • <b>Referees:</b> Check who listened without mistakes!
            </div>
          </div>
          <div style="background:#eff6ff; border:2px solid #93c5fd; border-radius:14px; padding:10px 16px;">
            <div style="font-family:'Fredoka'; font-size:14px; font-weight:700; color:#1e40af;">💬 Phrases to Say:</div>
            <div style="font-size:12px; color:#1e3a8a; margin-top:2px;">
              • <i>"Simon says: Stand up!"</i><br>
              • <i>"Simon says: Touch your desk!"</i><br>
              • <i>"Good job listening!"</i>
            </div>
          </div>
        </div>

        <!-- 6 Cutout Action Cards for the Game -->
        <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0f172a; margin-bottom: 6px;">✂️ Simon Says Game Cards (Cut or Point)</div>
        <div class="grid-3" style="gap: 12px; margin-bottom: 14px;">
          <div style="border: 2px dashed #0284c7; border-radius:14px; padding:10px; text-align:center; background:#f0f9ff;">
            <img src="{STUDENT}" style="width:65px; height:65px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0369a1;">Stand up!</div>
            <div style="font-size:11.5px; font-weight:700; color:#0284c7;">"Simon says: Stand up!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Stand tall 🧍</div>
          </div>
          <div style="border: 2px dashed #f59e0b; border-radius:14px; padding:10px; text-align:center; background:#fffbeb;">
            <img src="{CHAIR}" style="width:65px; height:65px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#b45309;">Sit down!</div>
            <div style="font-size:11.5px; font-weight:700; color:#f59e0b;">"Simon says: Sit down!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Sit in chair 🪑</div>
          </div>
          <div style="border: 2px dashed #16a34a; border-radius:14px; padding:10px; text-align:center; background:#f0fdf4;">
            <img src="{BOOK}" style="width:65px; height:65px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#15803d;">Open book!</div>
            <div style="font-size:11.5px; font-weight:700; color:#16a34a;">"Simon says: Open book!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Open hands 📖</div>
          </div>
          <div style="border: 2px dashed #dc2626; border-radius:14px; padding:10px; text-align:center; background:#fef2f2;">
            <img src="{DESK}" style="width:65px; height:65px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#b91c1c;">Touch desk!</div>
            <div style="font-size:11.5px; font-weight:700; color:#dc2626;">"Simon says: Touch desk!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Touch wood ✋</div>
          </div>
          <div style="border: 2px dashed #7c3aed; border-radius:14px; padding:10px; text-align:center; background:#f5f3ff;">
            <img src="{DOOR}" style="width:65px; height:65px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#6d28d9;">Point door!</div>
            <div style="font-size:11.5px; font-weight:700; color:#7c3aed;">"Simon says: Point to door!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Point finger 👉</div>
          </div>
          <div style="border: 2px dashed #0d9488; border-radius:14px; padding:10px; text-align:center; background:#f0fdfa;">
            <img src="{TEACHER}" style="width:65px; height:65px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0f766e;">Listen!</div>
            <div style="font-size:11.5px; font-weight:700; color:#0d9488;">"Simon says: Listen!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Hand to ear 👂</div>
          </div>
        </div>

        <!-- Checklist -->
        <div style="background:#f8fafc; border:2px solid #e2e8f0; border-radius:14px; padding:10px 16px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; font-size:13px; color:#334155;">Did everyone listen carefully to Simon?</span>
          <div style="display:flex; gap:14px; font-weight:700; font-size:12px;">
            <span>[ ] Yes, we all played together! 🌟</span>
            <span>[ ] Great listening team! 👍</span>
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span class="footer-badge">Kindergarten • CEFR Pre-A1.2</span>
        <span>Stage 4: Collaborative Task</span>
        <span style="font-weight:700; color:#0f172a;">Page 5 of 8</span>
      </div>
    </div>
    """

def render_page_6():
    return f"""
    <!-- PAGE 6: STAGE 5 ASSESSMENT -->
    <div class="page">
      <div class="page-header">
        <span class="stage-badge stage-5">STAGE 5 • ASSESSMENT / POST-TASK</span>
        <h2 class="main-title" style="font-size: 32px;">Listen and Circle the Command</h2>
        <p class="subtitle">Formative Assessment & Student Exit Ticket</p>
      </div>

      <div class="content-area">
        <div class="instruction-box" style="border-left-color: #ea580c; background:#fff7ed;">
          <div class="instruction-icon">🎧</div>
          <div><b>Teacher Assessment:</b> The teacher says a classroom command. Circle the picture that matches!</div>
        </div>

        <!-- Item 1 -->
        <div style="background:#ffffff; border:2.5px solid #e2e8f0; border-radius:18px; padding:12px 18px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0f172a;">Item 1 • Teacher Audio: "Stand up!"</span>
            <span style="font-size:11px; font-weight:700; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:6px;">Circle the correct one</span>
          </div>
          <div class="grid-2">
            <div style="border:2px solid #94a3b8; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{STUDENT}" style="width:70px; height:70px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700;">Stand up!</div>
                <div style="font-size:12px; color:#16a34a; font-weight:700;">Standing tall</div>
              </div>
            </div>
            <div style="border:2px solid #e2e8f0; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{CHAIR}" style="width:70px; height:70px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#64748b;">Sit down</div>
                <div style="font-size:12px; color:#64748b;">Chair</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Item 2 -->
        <div style="background:#ffffff; border:2.5px solid #e2e8f0; border-radius:18px; padding:12px 18px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0f172a;">Item 2 • Teacher Audio: "Open your book!"</span>
            <span style="font-size:11px; font-weight:700; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:6px;">Circle the correct one</span>
          </div>
          <div class="grid-2">
            <div style="border:2px solid #e2e8f0; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{PENCIL}" style="width:70px; height:70px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#64748b;">Pencil</div>
                <div style="font-size:12px; color:#64748b;">Hold pencil</div>
              </div>
            </div>
            <div style="border:2px solid #94a3b8; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{BOOK}" style="width:70px; height:70px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700;">Book</div>
                <div style="font-size:12px; color:#16a34a; font-weight:700;">Open book</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Item 3 -->
        <div style="background:#ffffff; border:2.5px solid #e2e8f0; border-radius:18px; padding:12px 18px; margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0f172a;">Item 3 • Teacher Audio: "Touch your desk!"</span>
            <span style="font-size:11px; font-weight:700; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:6px;">Circle the correct one</span>
          </div>
          <div class="grid-2">
            <div style="border:2px solid #94a3b8; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{DESK}" style="width:70px; height:70px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700;">Desk</div>
                <div style="font-size:12px; color:#16a34a; font-weight:700;">Touch desk</div>
              </div>
            </div>
            <div style="border:2px solid #e2e8f0; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{WINDOW}" style="width:70px; height:70px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#64748b;">Window</div>
                <div style="font-size:12px; color:#64748b;">Look out window</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Student Exit Ticket -->
        <div style="background:#f8fafc; border:2px dashed #0284c7; border-radius:18px; padding:14px 20px;">
          <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0284c7; margin-bottom:6px;">🎟️ Student Exit Ticket</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:13px; font-weight:600; color:#334155;">Can you listen and follow teacher instructions today?</div>
            <div style="display:flex; gap:18px; font-size:20px;">
              <label style="cursor:pointer; display:flex; align-items:center; gap:4px; font-size:14px; font-weight:700;"><span>👍</span> Yes, I can!</label>
              <label style="cursor:pointer; display:flex; align-items:center; gap:4px; font-size:14px; font-weight:700;"><span>👎</span> Need help</label>
            </div>
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span class="footer-badge">Kindergarten • CEFR Pre-A1.2</span>
        <span>Stage 5: Formative Assessment</span>
        <span style="font-weight:700; color:#0f172a;">Page 6 of 8</span>
      </div>
    </div>
    """

def render_page_7():
    return f"""
    <!-- PAGE 7: STAGE 6 REFLECTION & CHANT -->
    <div class="page">
      <div class="page-header">
        <span class="stage-badge stage-6">STAGE 6 • REFLECTION & EXTENSION</span>
        <h2 class="main-title" style="font-size: 32px;">Stand Up, Sit Down! • School Song</h2>
        <p class="subtitle">Shared Choral Action Song & Student Self-Reflection</p>
      </div>

      <div class="content-area">
        <div class="instruction-box" style="border-left-color: #0d9488; background:#f0fdfa;">
          <div class="instruction-icon">🎤</div>
          <div><b>Choral Song:</b> Sing together and do the movements with the teacher!</div>
        </div>

        <!-- Choral Song Lyric Box -->
        <div style="background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%); border: 3px solid #0d9488; border-radius: 20px; padding: 20px; text-align: center; margin-bottom: 20px;">
          <div style="font-family:'Fredoka'; font-size: 24px; font-weight:700; color:#0f766e; margin-bottom: 12px;">🎶 Stand Up, Sit Down, School Day! 🎶</div>
          <div style="font-size: 15px; font-weight:600; line-height: 1.8; color:#134e4a;">
            <b>Stand up tall</b>, look around the hall! 🧍<br>
            <b>Sit down now</b>, make a little bow! 🪑<br>
            <b>Open your book</b>, take a quiet look! 📖<br>
            <b>Touch your desk</b>, take a little rest! ✋<br>
            <b>Listen, listen</b>, school has begun! 👂🎉
          </div>
          <div style="display:flex; justify-content:center; gap:20px; margin-top:14px;">
            <img src="{STUDENT}" style="width:45px; height:45px; object-fit:contain;" />
            <img src="{CHAIR}" style="width:45px; height:45px; object-fit:contain;" />
            <img src="{BOOK}" style="width:45px; height:45px; object-fit:contain;" />
            <img src="{DESK}" style="width:45px; height:45px; object-fit:contain;" />
          </div>
        </div>

        <!-- Self Reflection -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">💭 Student Self-Reflection</div>
        <div class="card" style="margin-bottom: 16px;">
          <div style="font-weight:600; font-size:14px; margin-bottom: 10px;">Which action was your FAVORITE today? (Color or point)</div>
          <div class="grid-4">
            <div style="border:2px solid #e2e8f0; border-radius:12px; padding:8px; text-align:center;">
              <img src="{STUDENT}" style="width:45px; height:45px; object-fit:contain;" />
              <div style="font-weight:700; font-size:12px;">Stand up!</div>
            </div>
            <div style="border:2px solid #e2e8f0; border-radius:12px; padding:8px; text-align:center;">
              <img src="{CHAIR}" style="width:45px; height:45px; object-fit:contain;" />
              <div style="font-weight:700; font-size:12px;">Sit down!</div>
            </div>
            <div style="border:2px solid #e2e8f0; border-radius:12px; padding:8px; text-align:center;">
              <img src="{BOOK}" style="width:45px; height:45px; object-fit:contain;" />
              <div style="font-weight:700; font-size:12px;">Open book!</div>
            </div>
            <div style="border:2px solid #e2e8f0; border-radius:12px; padding:8px; text-align:center;">
              <img src="{DESK}" style="width:45px; height:45px; object-fit:contain;" />
              <div style="font-weight:700; font-size:12px;">Touch desk!</div>
            </div>
          </div>
        </div>

        <!-- Bridge to Lesson 2 -->
        <div style="background:#fef3c7; border:2px solid #fde047; border-radius:16px; padding:12px 18px; display:flex; align-items:center; gap:14px;">
          <div style="font-size:30px;">📖</div>
          <div>
            <div style="font-family:'Fredoka'; font-size:14px; font-weight:700; color:#92400e;">Preview: Lesson 2 — Reading Classroom Words</div>
            <div style="font-size:12.5px; color:#b45309;">Next class we will read and match the written words: <b>Book, Desk, Chair!</b></div>
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span class="footer-badge">Kindergarten • CEFR Pre-A1.2</span>
        <span>Stage 6: Reflection & Song</span>
        <span style="font-weight:700; color:#0f172a;">Page 7 of 8</span>
      </div>
    </div>
    """

def render_page_8():
    return f"""
    <!-- PAGE 8: TEACHER GUIDE & MEDUCA RUBRIC -->
    <div class="page" style="background:#f8fafc;">
      <div class="page-header" style="padding-bottom:6px;">
        <span class="stage-badge stage-t">TEACHER SCRIPT & EVIDENCE GUIDE</span>
        <h2 class="main-title" style="font-size: 28px;">Official Teacher Guide & Alignment</h2>
        <p class="subtitle" style="color:#475569;">Panama MEDUCA English Curriculum • Kindergarten Pre-A1.2</p>
      </div>

      <div class="content-area" style="padding-top:6px;">
        <!-- Verbatim Script Box -->
        <div class="card" style="background:#ffffff; margin-bottom:12px; padding:12px 16px;">
          <div style="font-family:'Fredoka'; font-size:15px; font-weight:700; color:#0f172a; margin-bottom:4px;">📜 Verbatim Read-Aloud Scripts (Word for Word)</div>
          <div style="font-size:12px; line-height:1.6; color:#334155;">
            • <b>Stage 1:</b> "Good morning boys and girls! Welcome to school. Let's listen! When I say 'Stand up', everybody stand up tall! (teacher models). When I say 'Sit down', sit in your chair quietly!"<br>
            • <b>Stage 2:</b> "Look at my picture: This is a book. Open your book! (teacher opens hands). This is a chair. Sit on your chair! This is a desk. Touch your desk!"<br>
            • <b>Stage 3:</b> "Teacher says: Touch your chair! Teacher says: Open your book! Now freeze!"<br>
            • <b>Stage 5 (Assessment):</b> "Item 1: Stand up! (pause). Item 2: Open your book! (pause). Item 3: Touch your desk!"
          </div>
        </div>

        <!-- Answer Key & Acceptable Responses -->
        <div class="grid-2" style="margin-bottom:12px;">
          <div class="card" style="background:#ffffff; padding:10px 14px;">
            <div style="font-family:'Fredoka'; font-size:13px; font-weight:700; color:#15803d;">🔑 Answer Key (Stage 5)</div>
            <div style="font-size:11.5px; color:#334155; margin-top:2px;">
              • Item 1: <b>Stand up</b> (Option A - Student standing)<br>
              • Item 2: <b>Book</b> (Option B - Open Book)<br>
              • Item 3: <b>Desk</b> (Option A - Desk)
            </div>
          </div>
          <div class="card" style="background:#ffffff; padding:10px 14px;">
            <div style="font-family:'Fredoka'; font-size:13px; font-weight:700; color:#0369a1;">👁️ Acceptable Pupil Responses</div>
            <div style="font-size:11.5px; color:#334155; margin-top:2px;">
              • Performing physical command (TPR)<br>
              • Pointing to correct picture card<br>
              • Circling option on sheet / Eye gaze
            </div>
          </div>
        </div>

        <!-- Formative Observation Rubric -->
        <div class="card" style="background:#ffffff; padding:12px 16px;">
          <div style="font-family:'Fredoka'; font-size:15px; font-weight:700; color:#0f172a; margin-bottom:8px;">📊 Formative Observation Checklist (MEDUCA Standard)</div>
          <table style="width:100%; border-collapse:collapse; font-size:11.5px; text-align:left;">
            <thead>
              <tr style="background:#f1f5f9; border-bottom:2px solid #cbd5e1;">
                <th style="padding:6px 8px;">Learning Outcome Criterion</th>
                <th style="padding:6px 8px; text-align:center; width:65px;">Not Yet</th>
                <th style="padding:6px 8px; text-align:center; width:75px;">Emerging</th>
                <th style="padding:6px 8px; text-align:center; width:80px;">Developing</th>
                <th style="padding:6px 8px; text-align:center; width:80px;">Consistent</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:6px 8px;">1. Follows simple instructions with visual cues (e.g., 'sit down' with gestures).</td>
                <td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:6px 8px;">2. Follows visual signals to do tasks (e.g., 'clean up' supported with a picture).</td>
                <td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:6px 8px;">3. Engages in interactive Simon Says game by responding to commands.</td>
                <td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:6px 8px;">4. Discriminates initial sounds: /s/ 'school', /l/ 'listen', /b/ 'book'.</td>
                <td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td>
              </tr>
            </tbody>
          </table>
          <div style="margin-top:8px; font-size:11px; color:#64748b;">
            <b>Teacher Notes:</b> _________________________________________________________________________
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span class="footer-badge">Kindergarten • CEFR Pre-A1.2</span>
        <span>Curriculum Alignment: MEDUCA 2026</span>
        <span style="font-weight:700; color:#0f172a;">Page 8 of 8</span>
      </div>
    </div>
    """

def build_html():
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Kindergarten - Scenario 1: It's a School Day! - Lesson 1 Listening</title>
  <style>
{CSS}
  </style>
</head>
<body>
  <div class="workbook-container">
    {render_page_1()}
    {render_page_2()}
    {render_page_3()}
    {render_page_4()}
    {render_page_5()}
    {render_page_6()}
    {render_page_7()}
    {render_page_8()}
  </div>
</body>
</html>
"""
    with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Workbook generated successfully at: {OUTPUT_HTML}")

if __name__ == "__main__":
    build_html()
