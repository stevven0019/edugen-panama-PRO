# -*- coding: utf-8 -*-
"""
EduGen Panama - Kindergarten Scenario 5 Theme 1 Master Activity Packet Builder
Curriculum: Scenario 5 "What's that Sound?" • Theme 1: "The Cat Says 'Meow'." • Lesson 1: Listening
Architecture: Pixel-perfect 816px x 1056px Vertical Canva-Style Printable Workbook (Opción A).
Embedded high-resolution domestic animal assets from public/assets/nouns/
"""

import os
import base64

BASE_DIR = r"c:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas"
NOUNS_DIR = os.path.join(BASE_DIR, "public", "assets", "nouns")
OUTPUT_HTML = os.path.join(BASE_DIR, "public", "Kinder_Scenario_5_Theme_1_Lesson_1_Listening_Packet.html")

def get_b64_img(filename):
    path = os.path.join(NOUNS_DIR, filename)
    if not os.path.exists(path):
        print(f"Warning: {filename} not found!")
        return ""
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    ext = os.path.splitext(filename)[1].replace(".", "").lower()
    return f"data:image/{ext};base64,{data}"

# Pre-encode required animal assets
CAT = get_b64_img("cat.png")
DOG = get_b64_img("dog.png")
COW = get_b64_img("cow.png")
ROOSTER = get_b64_img("rooster.png")
DUCK = get_b64_img("duck.png")
PIG = get_b64_img("pig.png")
SHEEP = get_b64_img("sheep.png")
HORSE = get_b64_img("horse.png")
BIRD = get_b64_img("bird.png")
FISH = get_b64_img("fish.png")

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
.stage-0 { background: #f59e0b; }
.stage-1 { background: #0284c7; }
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

.animal-card {
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
.animal-img {
  width: 90px;
  height: 90px;
  object-fit: contain;
  margin-bottom: 8px;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.08));
}
.animal-name {
  font-family: 'Fredoka', cursive;
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}
.animal-sound {
  font-size: 13px;
  font-weight: 700;
  color: #0284c7;
  background: #e0f2fe;
  padding: 3px 10px;
  border-radius: 9999px;
  margin-top: 4px;
  display: inline-block;
}
.sound-bubble {
  font-family: 'Fredoka', cursive;
  background: #fef08a;
  border: 2px dashed #ca8a04;
  color: #854d0e;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  margin-top: 6px;
}

.action-badge {
  font-size: 11px;
  font-weight: 700;
  color: #15803d;
  background: #dcfce7;
  padding: 3px 8px;
  border-radius: 6px;
  margin-top: 5px;
}
"""

def render_page_1():
    return f"""
    <!-- PAGE 1: COVER -->
    <div class="page" style="background: linear-gradient(180deg, #ecfeff 0%, #ffffff 40%);">
      <div class="page-header" style="padding-top: 36px;">
        <span class="stage-badge stage-0">STAGE 0 • COVER & READINESS</span>
        <h1 class="main-title" style="font-size: 44px; color: #0369a1;">What's that Sound?</h1>
        <p class="subtitle" style="font-size: 18px; color: #0284c7;">Lesson 1 • Listening • The Cat Says 'Meow'.</p>
      </div>

      <div style="text-align: center; margin: 10px 36px 0;">
        <div style="display: flex; justify-content: center; align-items: flex-end; gap: 20px; height: 260px; background: #e0f2fe; border-radius: 24px; padding: 20px; border: 3px solid #bae6fd; position: relative; overflow: hidden;">
          <img src="{CAT}" style="height: 180px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15)); z-index: 2;" />
          <img src="{DOG}" style="height: 195px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15)); z-index: 2;" />
          <img src="{ROOSTER}" style="height: 160px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15)); z-index: 2;" />
          <img src="{COW}" style="height: 190px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.15)); z-index: 2;" />
          <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 35px; background: #86efac; border-radius: 0 0 20px 20px;"></div>
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
            <span style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0f172a;">🐾 Animal Sound Word Bank</span>
            <span style="font-size:11px; font-weight:700; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:6px;">8 Target Animals</span>
          </div>
          <div class="grid-4" style="gap: 10px;">
            <div class="animal-card" style="padding: 8px; border-color: #fde047;">
              <img src="{CAT}" style="width: 52px; height: 52px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">cat</span>
              <span class="animal-sound" style="font-size: 11px; padding: 1px 6px;">meow</span>
            </div>
            <div class="animal-card" style="padding: 8px; border-color: #93c5fd;">
              <img src="{DOG}" style="width: 52px; height: 52px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">dog</span>
              <span class="animal-sound" style="font-size: 11px; padding: 1px 6px; background:#dbeafe; color:#1d4ed8;">woof</span>
            </div>
            <div class="animal-card" style="padding: 8px; border-color: #86efac;">
              <img src="{COW}" style="width: 52px; height: 52px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">cow</span>
              <span class="animal-sound" style="font-size: 11px; padding: 1px 6px; background:#dcfce7; color:#15803d;">moo</span>
            </div>
            <div class="animal-card" style="padding: 8px; border-color: #fca5a5;">
              <img src="{ROOSTER}" style="width: 52px; height: 52px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">rooster</span>
              <span class="animal-sound" style="font-size: 10px; padding: 1px 5px; background:#fee2e2; color:#b91c1c;">cock-a-doodle</span>
            </div>
            <div class="animal-card" style="padding: 8px; border-color: #fed7aa;">
              <img src="{DUCK}" style="width: 52px; height: 52px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">duck</span>
              <span class="animal-sound" style="font-size: 11px; padding: 1px 6px; background:#ffedd5; color:#c2410c;">quack</span>
            </div>
            <div class="animal-card" style="padding: 8px; border-color: #fbcfe8;">
              <img src="{PIG}" style="width: 52px; height: 52px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">pig</span>
              <span class="animal-sound" style="font-size: 11px; padding: 1px 6px; background:#fce7f3; color:#be185d;">oink</span>
            </div>
            <div class="animal-card" style="padding: 8px; border-color: #e2e8f0;">
              <img src="{SHEEP}" style="width: 52px; height: 52px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">sheep</span>
              <span class="animal-sound" style="font-size: 11px; padding: 1px 6px; background:#f1f5f9; color:#475569;">baa</span>
            </div>
            <div class="animal-card" style="padding: 8px; border-color: #c7d2fe;">
              <img src="{BIRD}" style="width: 52px; height: 52px; object-fit: contain;" />
              <span style="font-size: 13px; font-weight: 700;">bird</span>
              <span class="animal-sound" style="font-size: 11px; padding: 1px 6px; background:#e0e7ff; color:#4338ca;">tweet</span>
            </div>
          </div>
        </div>

        <!-- Target Goal -->
        <div style="display: flex; align-items: center; gap: 14px; background: #ecfdf5; border: 2px solid #a7f3d0; border-radius: 16px; padding: 12px 18px; margin-top: 14px;">
          <div style="font-size: 32px;">🎯</div>
          <div>
            <div style="font-family:'Fredoka'; font-size:15px; font-weight:700; color:#065f46;">My Lesson Goal:</div>
            <div style="font-size:13.5px; font-weight:600; color:#047857;">I can listen to animal sounds and point to the matching domestic animal!</div>
          </div>
        </div>
      </div>

      <div class="page-footer">
        <span class="footer-badge">Kindergarten • CEFR Pre-A1.2</span>
        <span>Scenario 5 • Theme 1 • Lesson 1 Listening</span>
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
        <h2 class="main-title" style="font-size: 32px;">Sound Awakening & Letters</h2>
        <p class="subtitle">Engagement, TPR Modeling and Concept Check</p>
      </div>

      <div class="content-area">
        <div class="instruction-box">
          <div class="instruction-icon">👂</div>
          <div><b>Teacher Prompt:</b> "Listen carefully! Stand up if you hear a cat! Sit down when you hear a dog!"</div>
        </div>

        <!-- Part A: TPR Listening Cards -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">A. Listen & Do the Action (TPR)</div>
        <div class="grid-2" style="margin-bottom: 16px;">
          <div class="card" style="border: 2.5px solid #0284c7; background: #f0f9ff; text-align: center; padding: 16px;">
            <img src="{CAT}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 6px;" />
            <div style="font-family:'Fredoka'; font-size: 22px; font-weight:700; color:#0369a1;">Cat says "Meow!"</div>
            <div class="action-badge" style="font-size:13px; padding: 4px 14px; background:#0284c7; color:#fff; border-radius: 9999px;">🧍 Stand up and stretch!</div>
            <div style="font-size:12px; color:#64748b; margin-top:6px;">Sound is quiet 🤫</div>
          </div>
          <div class="card" style="border: 2.5px solid #ea580c; background: #fff7ed; text-align: center; padding: 16px;">
            <img src="{DOG}" style="width: 100px; height: 100px; object-fit: contain; margin-bottom: 6px;" />
            <div style="font-family:'Fredoka'; font-size: 22px; font-weight:700; color:#c2410c;">Dog says "Woof!"</div>
            <div class="action-badge" style="font-size:13px; padding: 4px 14px; background:#ea580c; color:#fff; border-radius: 9999px;">🪑 Sit down quietly!</div>
            <div style="font-size:12px; color:#64748b; margin-top:6px;">Sound is loud 📢</div>
          </div>
        </div>

        <!-- Part B: Letter & Sound Awakening -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">B. Letter & Sound Focus</div>
        <div class="grid-3" style="margin-bottom: 16px;">
          <div class="card" style="text-align: center; border-color: #38bdf8;">
            <div style="font-family:'Fredoka'; font-size: 34px; color:#0284c7; font-weight:700;">Cc</div>
            <img src="{CAT}" style="width: 65px; height: 65px; object-fit: contain;" />
            <div style="font-weight:700; font-size:14px; color:#0f172a;">C is for Cat</div>
            <div style="font-size:12px; color:#0284c7; font-weight:600;">/m/ in meow</div>
          </div>
          <div class="card" style="text-align: center; border-color: #f87171;">
            <div style="font-family:'Fredoka'; font-size: 34px; color:#dc2626; font-weight:700;">Rr</div>
            <img src="{ROOSTER}" style="width: 65px; height: 65px; object-fit: contain;" />
            <div style="font-weight:700; font-size:14px; color:#0f172a;">R is for Rooster</div>
            <div style="font-size:12px; color:#dc2626; font-weight:600;">/r/ sound</div>
          </div>
          <div class="card" style="text-align: center; border-color: #4ade80;">
            <div style="font-family:'Fredoka'; font-size: 34px; color:#16a34a; font-weight:700;">Dd</div>
            <img src="{DOG}" style="width: 65px; height: 65px; object-fit: contain;" />
            <div style="font-weight:700; font-size:14px; color:#0f172a;">D is for Dog</div>
            <div style="font-size:12px; color:#16a34a; font-weight:600;">/d/ sound</div>
          </div>
        </div>

        <!-- Part C: CCQ Questions -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">C. Clarification Check (Circle YES or NO)</div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:2px solid #e2e8f0; border-radius:12px; padding:8px 16px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <img src="{DOG}" style="width:40px; height:40px; object-fit:contain;" />
              <span style="font-weight:600; font-size:14px;">Does the dog say 'meow'?</span>
            </div>
            <div style="display:flex; gap:10px;">
              <span style="border:2px solid #cbd5e1; padding:4px 12px; border-radius:8px; font-weight:700; font-size:12px;">YES</span>
              <span style="border:2.5px solid #22c55e; background:#dcfce7; color:#15803d; padding:4px 12px; border-radius:8px; font-weight:700; font-size:12px;">NO ✓</span>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:2px solid #e2e8f0; border-radius:12px; padding:8px 16px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <img src="{CAT}" style="width:40px; height:40px; object-fit:contain;" />
              <span style="font-weight:600; font-size:14px;">Does the cat say 'meow'?</span>
            </div>
            <div style="display:flex; gap:10px;">
              <span style="border:2.5px solid #22c55e; background:#dcfce7; color:#15803d; padding:4px 12px; border-radius:8px; font-weight:700; font-size:12px;">YES ✓</span>
              <span style="border:2px solid #cbd5e1; padding:4px 12px; border-radius:8px; font-weight:700; font-size:12px;">NO</span>
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
        <h2 class="main-title" style="font-size: 32px;">Listen and Point to the Animal</h2>
        <p class="subtitle">Scenario: "What's that Sound?" — Sound & Body Actions</p>
      </div>

      <div class="content-area">
        <div class="instruction-box" style="border-left-color: #16a34a; background:#f0fdf4;">
          <div class="instruction-icon">👉</div>
          <div><b>Activity 1:</b> The teacher plays an animal sound. Listen and <b>POINT</b> to the correct animal card.</div>
        </div>

        <!-- 3 Big Cards -->
        <div class="grid-3" style="margin-bottom: 20px;">
          <div class="card" style="border: 3px solid #fde047; text-align: center; padding: 18px;">
            <div style="width:32px; height:32px; border-radius:50%; background:#fef08a; color:#854d0e; font-weight:800; font-size:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 8px;">1</div>
            <img src="{CAT}" style="width: 110px; height: 110px; object-fit: contain; margin-bottom: 8px;" />
            <div style="font-family:'Fredoka'; font-size: 22px; font-weight:700; color:#0f172a;">Cat</div>
            <div class="sound-bubble">"Meow!"</div>
            <div style="font-size:12px; font-weight:600; color:#64748b; margin-top:8px;">Quiet sound 🤫</div>
          </div>
          <div class="card" style="border: 3px solid #93c5fd; text-align: center; padding: 18px;">
            <div style="width:32px; height:32px; border-radius:50%; background:#dbeafe; color:#1e40af; font-weight:800; font-size:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 8px;">2</div>
            <img src="{DOG}" style="width: 110px; height: 110px; object-fit: contain; margin-bottom: 8px;" />
            <div style="font-family:'Fredoka'; font-size: 22px; font-weight:700; color:#0f172a;">Dog</div>
            <div class="sound-bubble" style="background:#dbeafe; border-color:#3b82f6; color:#1e40af;">"Woof!"</div>
            <div style="font-size:12px; font-weight:600; color:#64748b; margin-top:8px;">Loud sound 📢</div>
          </div>
          <div class="card" style="border: 3px solid #fca5a5; text-align: center; padding: 18px;">
            <div style="width:32px; height:32px; border-radius:50%; background:#fee2e2; color:#991b1b; font-weight:800; font-size:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 8px;">3</div>
            <img src="{ROOSTER}" style="width: 110px; height: 110px; object-fit: contain; margin-bottom: 8px;" />
            <div style="font-family:'Fredoka'; font-size: 22px; font-weight:700; color:#0f172a;">Rooster</div>
            <div class="sound-bubble" style="background:#fee2e2; border-color:#ef4444; color:#991b1b; font-size:12px;">"Cock-a-doodle-doo!"</div>
            <div style="font-size:12px; font-weight:600; color:#64748b; margin-top:8px;">Loud sound 📢</div>
          </div>
        </div>

        <!-- Activity 2: Say the Sound & Movement (TPR Verbs) -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">Activity 2: Animals in Action (Movement Verbs)</div>
        <div class="grid-2">
          <div style="display:flex; align-items:center; gap:16px; background:#f8fafc; border:2px solid #e2e8f0; border-radius:16px; padding:12px 18px;">
            <img src="{BIRD}" style="width: 65px; height: 65px; object-fit: contain;" />
            <div>
              <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a;">"Birds fly!" 🕊️</div>
              <div style="font-size:13px; color:#475569;">Flap your arms like wings & say "Tweet!"</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:16px; background:#f8fafc; border:2px solid #e2e8f0; border-radius:16px; padding:12px 18px;">
            <img src="{FISH}" style="width: 65px; height: 65px; object-fit: contain;" />
            <div>
              <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a;">"Fish swim!" 🐟</div>
              <div style="font-size:13px; color:#475569;">Make swimming hand waves quietly.</div>
            </div>
          </div>
        </div>

        <!-- Activity 3: Big/Small & Loud/Quiet Box -->
        <div style="margin-top: 18px; background: #fefce8; border: 2px solid #fef08a; border-radius: 16px; padding: 14px 20px; display:flex; justify-content:space-around; align-items:center;">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="{COW}" style="width:60px; height:60px; object-fit:contain;" />
            <div>
              <div style="font-weight:700; font-size:15px; color:#854d0e;">The Cow:</div>
              <div style="font-size:13px; color:#a16207;">Big animal • Loud "Moo!"</div>
            </div>
          </div>
          <div style="width:2px; height:45px; background:#fde047;"></div>
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="{DUCK}" style="width:60px; height:60px; object-fit:contain;" />
            <div>
              <div style="font-weight:700; font-size:15px; color:#854d0e;">The Duck:</div>
              <div style="font-size:13px; color:#a16207;">Small animal • Quiet "Quack!"</div>
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
        <h2 class="main-title" style="font-size: 32px;">Musical Animals & Volume Practice</h2>
        <p class="subtitle">Controlled Practice: Movement, Commands, and Discrimination</p>
      </div>

      <div class="content-area">
        <div class="instruction-box" style="border-left-color: #9333ea; background:#faf5ff;">
          <div class="instruction-icon">🎵</div>
          <div><b>Activity 1: Musical Animals!</b> Walk to music. When the music stops, <b>FREEZE</b> and point to the animal making the sound!</div>
        </div>

        <!-- 4 Sound Stations -->
        <div class="grid-4" style="margin-bottom: 20px;">
          <div class="animal-card" style="border: 2.5px solid #ef4444; padding: 14px;">
            <div style="font-family:'Fredoka'; font-size: 18px; font-weight:700; color:#dc2626; margin-bottom:4px;">woof</div>
            <img src="{DOG}" class="animal-img" style="width:85px; height:85px;" />
            <div class="animal-name">Dog</div>
            <div style="font-size:12px; font-weight:700; color:#dc2626; margin-top:4px;">LOUD 📢</div>
          </div>
          <div class="animal-card" style="border: 2.5px solid #0284c7; padding: 14px;">
            <div style="font-family:'Fredoka'; font-size: 18px; font-weight:700; color:#0284c7; margin-bottom:4px;">meow</div>
            <img src="{CAT}" class="animal-img" style="width:85px; height:85px;" />
            <div class="animal-name">Cat</div>
            <div style="font-size:12px; font-weight:700; color:#0284c7; margin-top:4px;">QUIET 🤫</div>
          </div>
          <div class="animal-card" style="border: 2.5px solid #16a34a; padding: 14px;">
            <div style="font-family:'Fredoka'; font-size: 18px; font-weight:700; color:#16a34a; margin-bottom:4px;">moo</div>
            <img src="{COW}" class="animal-img" style="width:85px; height:85px;" />
            <div class="animal-name">Cow</div>
            <div style="font-size:12px; font-weight:700; color:#16a34a; margin-top:4px;">LOUD 📢</div>
          </div>
          <div class="animal-card" style="border: 2.5px solid #f59e0b; padding: 14px;">
            <div style="font-family:'Fredoka'; font-size: 18px; font-weight:700; color:#d97706; margin-bottom:4px;">quack</div>
            <img src="{DUCK}" class="animal-img" style="width:85px; height:85px;" />
            <div class="animal-name">Duck</div>
            <div style="font-size:12px; font-weight:700; color:#d97706; margin-top:4px;">QUIET 🤫</div>
          </div>
        </div>

        <!-- Activity 2: Teacher Says, You Do! -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">Activity 2: Teacher Says, You Do! (Follow Commands)</div>
        <div class="grid-2" style="margin-bottom: 20px;">
          <div style="background:#f8fafc; border:2px solid #e2e8f0; border-radius:16px; padding:14px; display:flex; align-items:center; gap:14px;">
            <div style="font-size:32px;">🐮</div>
            <div>
              <div style="font-weight:700; font-size:14px; color:#0f172a;">"Teacher says: Make a 'moo' sound and jump!"</div>
              <div style="font-size:12px; color:#64748b; margin-top:2px;">Say "Moo!" and jump up once! ⬆️</div>
            </div>
          </div>
          <div style="background:#f8fafc; border:2px solid #e2e8f0; border-radius:16px; padding:14px; display:flex; align-items:center; gap:14px;">
            <div style="font-size:32px;">🐕</div>
            <div>
              <div style="font-weight:700; font-size:14px; color:#0f172a;">"Teacher says: Sit down when you hear a dog!"</div>
              <div style="font-size:12px; color:#64748b; margin-top:2px;">Listen for "Woof!" and sit down! 🪑</div>
            </div>
          </div>
        </div>

        <!-- Activity 3: Sound Match-Up in Pairs -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">Activity 3: Sound Match-Up (Pair Interaction)</div>
        <div style="background:#f1f5f9; border:2px dashed #94a3b8; border-radius:16px; padding:14px 20px; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:14px;">
            <div style="font-size:32px;">🤝</div>
            <div>
              <div style="font-weight:700; font-size:14px; color:#1e293b;">Partner Sound Secret</div>
              <div style="font-size:12.5px; color:#475569;">Student A secretly chooses an animal and makes the sound: <i>"What sound is this?"</i><br>Student B listens and points to the card: <i>"The cat says meow!"</i></div>
            </div>
          </div>
          <div style="display:flex; gap:8px;">
            <img src="{PIG}" style="width:45px; height:45px; object-fit:contain;" />
            <img src="{SHEEP}" style="width:45px; height:45px; object-fit:contain;" />
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
        <h2 class="main-title" style="font-size: 30px;">Animal Sound Charades Game</h2>
        <p class="subtitle">Collaborative Group Task (Groups of 3–4 Learners)</p>
      </div>

      <div class="content-area">
        <div class="instruction-box" style="border-left-color: #e11d48; background:#fff1f2;">
          <div class="instruction-icon">🎭</div>
          <div><b>How to Play:</b> One child picks a secret card, makes the sound and movement! The group listens and guesses: <b>"That's a rooster!"</b></div>
        </div>

        <!-- Roles & Questions Banner -->
        <div class="grid-2" style="margin-bottom: 14px;">
          <div style="background:#fff7ed; border:2px solid #fdba74; border-radius:14px; padding:10px 16px;">
            <div style="font-family:'Fredoka'; font-size:14px; font-weight:700; color:#c2410c;">👥 Group Roles (3-4 kids):</div>
            <div style="font-size:12px; color:#7c2d12; margin-top:2px;">
              • <b>Actor:</b> Makes the animal sound + action.<br>
              • <b>Detectives:</b> Listen and point to the right card.<br>
              • <b>Reporter:</b> Says: <i>"The cat says meow!"</i>
            </div>
          </div>
          <div style="background:#eff6ff; border:2px solid #93c5fd; border-radius:14px; padding:10px 16px;">
            <div style="font-family:'Fredoka'; font-size:14px; font-weight:700; color:#1e40af;">💬 Phrases to Say:</div>
            <div style="font-size:12px; color:#1e3a8a; margin-top:2px;">
              • <i>"What sound is this?"</i><br>
              • <i>"That's a dog!"</i> / <i>"It's a cow!"</i><br>
              • <i>"The cat says meow."</i>
            </div>
          </div>
        </div>

        <!-- 6 Cutout Action Cards for the Game -->
        <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0f172a; margin-bottom: 6px;">✂️ Charades Game Cards (Cut or Point)</div>
        <div class="grid-3" style="gap: 12px; margin-bottom: 14px;">
          <div style="border: 2px dashed #0284c7; border-radius:14px; padding:10px; text-align:center; background:#f0f9ff;">
            <img src="{CAT}" style="width:70px; height:70px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0369a1;">Cat</div>
            <div style="font-size:11.5px; font-weight:700; color:#0284c7;">Sound: "Meow!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Purr & stretch hands 🐱</div>
          </div>
          <div style="border: 2px dashed #ea580c; border-radius:14px; padding:10px; text-align:center; background:#fff7ed;">
            <img src="{DOG}" style="width:70px; height:70px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#c2410c;">Dog</div>
            <div style="font-size:11.5px; font-weight:700; color:#ea580c;">Sound: "Woof!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Crawl & pant 🐶</div>
          </div>
          <div style="border: 2px dashed #dc2626; border-radius:14px; padding:10px; text-align:center; background:#fef2f2;">
            <img src="{ROOSTER}" style="width:70px; height:70px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#b91c1c;">Rooster</div>
            <div style="font-size:11.5px; font-weight:700; color:#dc2626;">Sound: "Cock-a-doodle!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Flap wings 🐓</div>
          </div>
          <div style="border: 2px dashed #16a34a; border-radius:14px; padding:10px; text-align:center; background:#f0fdf4;">
            <img src="{COW}" style="width:70px; height:70px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#15803d;">Cow</div>
            <div style="font-size:11.5px; font-weight:700; color:#16a34a;">Sound: "Moo!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Slow stomp 🐮</div>
          </div>
          <div style="border: 2px dashed #d97706; border-radius:14px; padding:10px; text-align:center; background:#fffbeb;">
            <img src="{DUCK}" style="width:70px; height:70px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#b45309;">Duck</div>
            <div style="font-size:11.5px; font-weight:700; color:#d97706;">Sound: "Quack!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Waddle walk 🦆</div>
          </div>
          <div style="border: 2px dashed #db2777; border-radius:14px; padding:10px; text-align:center; background:#fdf2f8;">
            <img src="{PIG}" style="width:70px; height:70px; object-fit:contain;" />
            <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#be185d;">Pig</div>
            <div style="font-size:11.5px; font-weight:700; color:#db2777;">Sound: "Oink!"</div>
            <div style="font-size:11px; color:#64748b;">Action: Touch nose 🐷</div>
          </div>
        </div>

        <!-- Checklist -->
        <div style="background:#f8fafc; border:2px solid #e2e8f0; border-radius:14px; padding:10px 16px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:700; font-size:13px; color:#334155;">Did our group guess all animals?</span>
          <div style="display:flex; gap:14px; font-weight:700; font-size:12px;">
            <span>[ ] Yes, we got all! 🌟</span>
            <span>[ ] We had fun practicing! 👍</span>
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
        <h2 class="main-title" style="font-size: 32px;">Listen and Circle the Animal</h2>
        <p class="subtitle">Formative Assessment & Student Exit Ticket</p>
      </div>

      <div class="content-area">
        <div class="instruction-box" style="border-left-color: #ea580c; background:#fff7ed;">
          <div class="instruction-icon">🎧</div>
          <div><b>Teacher Assessment:</b> The teacher plays or makes the animal sound. Circle the animal you hear!</div>
        </div>

        <!-- Item 1 -->
        <div style="background:#ffffff; border:2.5px solid #e2e8f0; border-radius:18px; padding:12px 18px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0f172a;">Item 1 • Teacher Audio: "Meow! Meow!"</span>
            <span style="font-size:11px; font-weight:700; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:6px;">Circle the correct one</span>
          </div>
          <div class="grid-2">
            <div style="border:2px solid #94a3b8; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{CAT}" style="width:75px; height:75px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700;">Cat</div>
                <div style="font-size:12px; color:#16a34a; font-weight:700;">Says 'Meow'</div>
              </div>
            </div>
            <div style="border:2px solid #e2e8f0; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{DOG}" style="width:75px; height:75px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#64748b;">Dog</div>
                <div style="font-size:12px; color:#64748b;">Says 'Woof'</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Item 2 -->
        <div style="background:#ffffff; border:2.5px solid #e2e8f0; border-radius:18px; padding:12px 18px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0f172a;">Item 2 • Teacher Audio: "Moo! Moo!"</span>
            <span style="font-size:11px; font-weight:700; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:6px;">Circle the correct one</span>
          </div>
          <div class="grid-2">
            <div style="border:2px solid #e2e8f0; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{DUCK}" style="width:75px; height:75px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#64748b;">Duck</div>
                <div style="font-size:12px; color:#64748b;">Says 'Quack'</div>
              </div>
            </div>
            <div style="border:2px solid #94a3b8; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{COW}" style="width:75px; height:75px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700;">Cow</div>
                <div style="font-size:12px; color:#16a34a; font-weight:700;">Says 'Moo'</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Item 3 -->
        <div style="background:#ffffff; border:2.5px solid #e2e8f0; border-radius:18px; padding:12px 18px; margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0f172a;">Item 3 • Teacher Audio: "Cock-a-doodle-doo!"</span>
            <span style="font-size:11px; font-weight:700; color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:6px;">Circle the correct one</span>
          </div>
          <div class="grid-2">
            <div style="border:2px solid #94a3b8; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{ROOSTER}" style="width:75px; height:75px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700;">Rooster</div>
                <div style="font-size:12px; color:#16a34a; font-weight:700;">Morning Sound</div>
              </div>
            </div>
            <div style="border:2px solid #e2e8f0; border-radius:14px; padding:8px; text-align:center; display:flex; align-items:center; justify-content:center; gap:16px;">
              <img src="{PIG}" style="width:75px; height:75px; object-fit:contain;" />
              <div style="text-align:left;">
                <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#64748b;">Pig</div>
                <div style="font-size:12px; color:#64748b;">Says 'Oink'</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Student Exit Ticket -->
        <div style="background:#f8fafc; border:2px dashed #0284c7; border-radius:18px; padding:14px 20px;">
          <div style="font-family:'Fredoka'; font-size:16px; font-weight:700; color:#0284c7; margin-bottom:6px;">🎟️ Student Exit Ticket</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:13px; font-weight:600; color:#334155;">Did you like hearing the animal sounds today?</div>
            <div style="display:flex; gap:18px; font-size:20px;">
              <label style="cursor:pointer; display:flex; align-items:center; gap:4px; font-size:14px; font-weight:700;"><span>👍</span> Yes!</label>
              <label style="cursor:pointer; display:flex; align-items:center; gap:4px; font-size:14px; font-weight:700;"><span>👎</span> Need practice</label>
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
        <h2 class="main-title" style="font-size: 32px;">The Animals Say! • Action Chant</h2>
        <p class="subtitle">Shared Choral Performance & Student Self-Reflection</p>
      </div>

      <div class="content-area">
        <div class="instruction-box" style="border-left-color: #0d9488; background:#f0fdfa;">
          <div class="instruction-icon">🎤</div>
          <div><b>Choral Song:</b> Sing together and do the movements with the teacher!</div>
        </div>

        <!-- Choral Chant Lyric Box -->
        <div style="background: linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%); border: 3px solid #0d9488; border-radius: 20px; padding: 20px; text-align: center; margin-bottom: 20px;">
          <div style="font-family:'Fredoka'; font-size: 24px; font-weight:700; color:#0f766e; margin-bottom: 12px;">🎶 The Animals Say! 🎶</div>
          <div style="font-size: 15px; font-weight:600; line-height: 1.8; color:#134e4a;">
            The little <b>cat</b> says: <i>"Meow, meow, meow!"</i> (stretch arms! 🐱)<br>
            The happy <b>dog</b> says: <i>"Woof, woof, woof!"</i> (wag hands! 🐶)<br>
            The big brown <b>cow</b> says: <i>"Moo, moo, moo!"</i> (stomp feet! 🐮)<br>
            And the morning <b>rooster</b> says: <i>"Cock-a-doodle-doo!"</i> (flap wings! 🐓)
          </div>
          <div style="display:flex; justify-content:center; gap:20px; margin-top:14px;">
            <img src="{CAT}" style="width:50px; height:50px; object-fit:contain;" />
            <img src="{DOG}" style="width:50px; height:50px; object-fit:contain;" />
            <img src="{COW}" style="width:50px; height:50px; object-fit:contain;" />
            <img src="{ROOSTER}" style="width:50px; height:50px; object-fit:contain;" />
          </div>
        </div>

        <!-- Self Reflection -->
        <div style="font-family:'Fredoka'; font-size:18px; font-weight:700; color:#0f172a; margin-bottom: 8px;">💭 Student Self-Reflection</div>
        <div class="card" style="margin-bottom: 16px;">
          <div style="font-weight:600; font-size:14px; margin-bottom: 10px;">Which animal sound was your FAVORITE today? (Color or point)</div>
          <div class="grid-4">
            <div style="border:2px solid #e2e8f0; border-radius:12px; padding:8px; text-align:center;">
              <img src="{CAT}" style="width:50px; height:50px; object-fit:contain;" />
              <div style="font-weight:700; font-size:12px;">Cat (meow)</div>
            </div>
            <div style="border:2px solid #e2e8f0; border-radius:12px; padding:8px; text-align:center;">
              <img src="{DOG}" style="width:50px; height:50px; object-fit:contain;" />
              <div style="font-weight:700; font-size:12px;">Dog (woof)</div>
            </div>
            <div style="border:2px solid #e2e8f0; border-radius:12px; padding:8px; text-align:center;">
              <img src="{COW}" style="width:50px; height:50px; object-fit:contain;" />
              <div style="font-weight:700; font-size:12px;">Cow (moo)</div>
            </div>
            <div style="border:2px solid #e2e8f0; border-radius:12px; padding:8px; text-align:center;">
              <img src="{ROOSTER}" style="width:50px; height:50px; object-fit:contain;" />
              <div style="font-weight:700; font-size:12px;">Rooster</div>
            </div>
          </div>
        </div>

        <!-- Bridge to Lesson 2 -->
        <div style="background:#fef3c7; border:2px solid #fde047; border-radius:16px; padding:12px 18px; display:flex; align-items:center; gap:14px;">
          <div style="font-size:30px;">📖</div>
          <div>
            <div style="font-family:'Fredoka'; font-size:14px; font-weight:700; color:#92400e;">Preview: Lesson 2 — Reading Comprehension</div>
            <div style="font-size:12.5px; color:#b45309;">Next class we will look at a picture story and read the words: <b>Cat, Dog, Cow!</b></div>
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
            • <b>Stage 1:</b> "Good morning boys and girls! Look at my card: This is a cat. The cat says 'meow'. Stand up if you hear a cat! (plays meow). Now sit down!"<br>
            • <b>Stage 2:</b> "Listen! What sound is this? (plays woof). That's a dog! Point to the dog! Can you say woof? What does the bird do? Birds fly! (flaps arms)."<br>
            • <b>Stage 3:</b> "Teacher says: Make a 'moo' sound and jump! Teacher says: Sit down when you hear a dog!"<br>
            • <b>Stage 5 (Assessment):</b> "Listen and circle: Item 1: 'Meow, meow!' (pause). Item 2: 'Moo, moo!' (pause). Item 3: 'Cock-a-doodle-doo!'"
          </div>
        </div>

        <!-- Answer Key & Acceptable Responses -->
        <div class="grid-2" style="margin-bottom:12px;">
          <div class="card" style="background:#ffffff; padding:10px 14px;">
            <div style="font-family:'Fredoka'; font-size:13px; font-weight:700; color:#15803d;">🔑 Answer Key (Stage 5)</div>
            <div style="font-size:11.5px; color:#334155; margin-top:2px;">
              • Item 1: <b>Cat</b> (Option A)<br>
              • Item 2: <b>Cow</b> (Option B)<br>
              • Item 3: <b>Rooster</b> (Option A)
            </div>
          </div>
          <div class="card" style="background:#ffffff; padding:10px 14px;">
            <div style="font-family:'Fredoka'; font-size:13px; font-weight:700; color:#0369a1;">👁️ Acceptable Pupil Responses</div>
            <div style="font-size:11.5px; color:#334155; margin-top:2px;">
              • Pointing to picture card<br>
              • Mimicking animal sound or action<br>
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
                <td style="padding:6px 8px;">1. Follows simple instructions with visual cues (e.g. 'Point to the animal').</td>
                <td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:6px 8px;">2. Responds to simple questions with sound effects ('What sound is this? -> Meow!').</td>
                <td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:6px 8px;">3. Discriminates loud vs. quiet sounds (Cow moo vs. Cat meow).</td>
                <td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td><td style="text-align:center;">○</td>
              </tr>
              <tr style="border-bottom:1px solid #e2e8f0;">
                <td style="padding:6px 8px;">4. Actively participates in group Charades Game with peers.</td>
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
  <title>Kindergarten - Scenario 5: What's that Sound? - Lesson 1 Listening</title>
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
