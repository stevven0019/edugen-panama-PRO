# -*- coding: utf-8 -*-
"""
EduGen Panama - Scenario Classroom Anchor Poster Generator (Canva Style v2)
Compact header (top 20-25% / less than one-third) + Maximized learning and vocabulary area.
"""

import os
import json
import base64

BASE_DIR = r"c:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas"
NOUNS_DIR = os.path.join(BASE_DIR, "public", "assets", "nouns")
CURRICULUM_PATH = os.path.join(BASE_DIR, "public", "curriculums", "English_Curriculum_Grade_1.json")
OUTPUT_DIR = os.path.join(BASE_DIR, "posters", "1st Grade")
OUTPUT_HTML = os.path.join(OUTPUT_DIR, "Poster_1st_Grade_Scenario_1_All_Week_Long.html")

os.makedirs(OUTPUT_DIR, exist_ok=True)

with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
    curriculum = json.load(f)

grade = curriculum.get("grade", 1)
cefr = curriculum.get("cefr_level", "Pre A1.3")
scenario = curriculum["scenarios"][0]
sc_num = scenario.get("scenario_number", 1)
sc_title = scenario.get("scenario_title", "All Week Long!")
category = scenario.get("category", "Expressing Ourselves and Connecting with Others")

themes = scenario.get("themes", [])
t1_title = themes[0].get("theme_title", "Today Is Tuesday!") if len(themes) > 0 else ""
t2_title = themes[1].get("theme_title", "It's the Weekend.") if len(themes) > 1 else ""

communicative = scenario.get("communicative_competences", {})
linguistic = communicative.get("linguistic", {})
vocab = linguistic.get("vocabulary", {})
nouns = vocab.get("nouns", ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "weekend", "day", "week"])
adjectives = vocab.get("adjectives", ["relaxing", "exciting", "busy", "quiet"])
time_adverbs = vocab.get("adverbs_of_time", ["today", "tomorrow"])
prepositions = vocab.get("prepositions_of_time", ["on", "before", "after"])
phonics = linguistic.get("pronunciation_and_phonemic_awareness", {}).get("pronunciation", '/w/ in "weekend" and /d/ in "day"')

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Anchor Poster: 1st Grade • {sc_title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {{
      size: 816px 1150px;
      margin: 0;
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      background: #cbd5e1;
      font-family: 'Poppins', sans-serif;
      color: #1e293b;
      display: flex;
      justify-content: center;
      padding: 24px 10px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    .poster {{
      width: 816px;
      min-height: 1150px;
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 6px solid #2563eb;
    }}
    @media print {{
      body {{
        background: transparent;
        padding: 0;
      }}
      .poster {{
        border: none;
        box-shadow: none;
        border-radius: 0;
        width: 100%;
        min-height: 100%;
      }}
    }}

    /* Top Strip */
    .top-strip {{
      height: 10px;
      background: linear-gradient(90deg, #ef4444 0%, #f59e0b 20%, #10b981 40%, #06b6d4 60%, #3b82f6 80%, #8b5cf6 100%);
    }}

    /* COMPACT HEADER (Under 22% of page height) */
    .compact-header {{
      background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%);
      color: white;
      padding: 16px 26px 14px 26px;
      border-bottom: 4px solid #facc15;
    }}
    .header-top-row {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }}
    .meduca-badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 3px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #f8fafc;
    }}
    .grade-badge {{
      background: #facc15;
      color: #713f12;
      font-family: 'Fredoka', cursive;
      font-size: 13px;
      font-weight: 700;
      padding: 3px 14px;
      border-radius: 999px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.18);
    }}
    
    .title-banner {{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      margin-bottom: 10px;
    }}
    .scenario-main {{
      flex: 1;
    }}
    .sc-number {{
      font-size: 11px;
      font-weight: 800;
      color: #93c5fd;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }}
    .scenario-heading {{
      font-family: 'Fredoka', cursive;
      font-size: 32px;
      font-weight: 700;
      line-height: 1.1;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }}

    /* Compact Theme Badges */
    .themes-pill-bar {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }}
    .theme-mini-pill {{
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 10px;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }}
    .theme-dot {{
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #facc15;
      flex-shrink: 0;
    }}
    .theme-dot.green {{
      background: #4ade80;
    }}
    .theme-mini-title {{
      font-size: 11px;
      color: #e2e8f0;
      line-height: 1.2;
    }}
    .theme-mini-title b {{
      font-family: 'Fredoka', cursive;
      font-size: 13px;
      color: #ffffff;
      display: block;
    }}

    /* POSTER BODY (78% of page - generous and well-distributed) */
    .poster-body {{
      padding: 20px 24px 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex: 1;
    }}

    /* Section Headings */
    .section-bar {{
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Fredoka', cursive;
      font-size: 18px;
      font-weight: 700;
      color: #1e3a8a;
      margin-bottom: 8px;
    }}
    .section-bar::after {{
      content: '';
      flex: 1;
      height: 2.5px;
      background: #e2e8f0;
      border-radius: 999px;
    }}

    /* 1. Large Days of the Week Grid */
    .days-cluster {{
      display: grid;
      grid-template-columns: repeat(5, 1fr) 1.2fr 1.2fr;
      gap: 8px;
    }}
    .day-card {{
      border-radius: 14px;
      padding: 12px 6px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 6px -1px rgba(0,0,0,0.06);
      border: 2px solid;
    }}
    .day-card.mon {{ border-color: #38bdf8; background: #f0f9ff; }}
    .day-card.tue {{ border-color: #f59e0b; background: #fffbeb; }}
    .day-card.wed {{ border-color: #10b981; background: #f0fdf4; }}
    .day-card.thu {{ border-color: #8b5cf6; background: #f5f3ff; }}
    .day-card.fri {{ border-color: #ec4899; background: #fdf2f8; }}
    .day-card.sat {{ border-color: #6366f1; background: #e0e7ff; }}
    .day-card.sun {{ border-color: #f97316; background: #ffedd5; }}

    .dc-badge {{
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 4px;
    }}
    .dc-name {{
      font-family: 'Fredoka', cursive;
      font-size: 17px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }}
    .dc-tag {{
      font-size: 9px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 999px;
      background: rgba(0,0,0,0.06);
      text-transform: uppercase;
    }}
    .day-card.sat .dc-tag, .day-card.sun .dc-tag {{
      background: #dbeafe;
      color: #1d4ed8;
      font-weight: 800;
    }}

    /* 2. Main Two Column Grid: Speaking Frames (Left) + Vocabulary Vault (Right) */
    .middle-layout {{
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 16px;
    }}

    /* Speaking Frames */
    .frames-panel {{
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }}
    .bubble-card {{
      background: white;
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.04);
      border-left: 5px solid #2563eb;
    }}
    .bubble-card.green {{
      border-left-color: #10b981;
    }}
    .bubble-card.amber {{
      border-left-color: #f59e0b;
    }}
    .bubble-card.purple {{
      border-left-color: #8b5cf6;
    }}
    .bubble-avatar {{
      font-size: 24px;
      line-height: 1;
    }}
    .bubble-content {{
      flex: 1;
    }}
    .bubble-phrase {{
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.25;
    }}
    .bubble-phrase mark {{
      background: transparent;
      color: #2563eb;
      font-weight: 800;
      font-family: 'Fredoka', cursive;
    }}
    .bubble-sub {{
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }}

    /* Vocabulary & Linguistic Vault */
    .vocab-panel {{
      display: flex;
      flex-direction: column;
      gap: 10px;
    }}
    .vocab-card {{
      background: white;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 12px 14px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }}
    .vocab-header {{
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Fredoka', cursive;
      font-size: 13px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }}
    .chips-flex {{
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }}
    .vchip {{
      font-family: 'Fredoka', cursive;
      font-size: 14px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid;
    }}
    .vchip.blue {{
      background: #eff6ff;
      color: #1d4ed8;
      border-color: #bfdbfe;
    }}
    .vchip.orange {{
      background: #fff7ed;
      color: #c2410c;
      border-color: #fed7aa;
    }}
    .vchip.emerald {{
      background: #f0fdf4;
      color: #15803d;
      border-color: #bbf7d0;
    }}

    /* 3. Bottom Educational Strip: Phonics & Classroom Action */
    .bottom-strip {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      background: #fffbeb;
      border: 2px dashed #fcd34d;
      border-radius: 16px;
      padding: 12px 16px;
    }}
    .bs-box {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .bs-icon {{
      font-size: 26px;
      line-height: 1;
    }}
    .bs-title {{
      font-family: 'Fredoka', cursive;
      font-size: 13px;
      font-weight: 700;
      color: #92400e;
      text-transform: uppercase;
    }}
    .bs-text {{
      font-size: 12px;
      color: #78350f;
      line-height: 1.3;
    }}

    /* Footer */
    .poster-footer {{
      margin-top: auto;
      padding: 10px 24px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }}
  </style>
</head>
<body>

  <div class="poster">
    <div class="top-strip"></div>

    <!-- COMPACT HEADER (Under 22% of page height) -->
    <div class="compact-header">
      <div class="header-top-row">
        <span class="meduca-badge">🇵🇦 MEDUCA • Enfoque Orientado a la Acción (AoA)</span>
        <span class="grade-badge">🌟 1st Grade • CEFR {cefr}</span>
      </div>

      <div class="title-banner">
        <div class="scenario-main">
          <div class="sc-number">Scenario {sc_num} Anchor Poster</div>
          <div class="scenario-heading">"{sc_title}"</div>
        </div>
      </div>

      <!-- Compact Two Theme Pods -->
      <div class="themes-pill-bar">
        <div class="theme-mini-pill">
          <div class="theme-dot"></div>
          <div class="theme-mini-title">Theme 1 (Receptive): <b>{t1_title}</b></div>
        </div>
        <div class="theme-mini-pill">
          <div class="theme-dot green"></div>
          <div class="theme-mini-title">Theme 2 (Interactive): <b>{t2_title}</b></div>
        </div>
      </div>
    </div>

    <!-- MAIN LEARNING & VOCABULARY CANVAS (Over 78% of the poster) -->
    <div class="poster-body">

      <!-- 1. The 7 Days of the Week Grid -->
      <div>
        <div class="section-bar">
          <span>🗓️ The 7 Days of the Week</span>
        </div>
        <div class="days-cluster">
          <div class="day-card mon">
            <span class="dc-badge">Day 1</span>
            <span class="dc-name">Monday</span>
            <span class="dc-tag">Weekday</span>
          </div>
          <div class="day-card tue">
            <span class="dc-badge">Day 2</span>
            <span class="dc-name">Tuesday</span>
            <span class="dc-tag">Weekday</span>
          </div>
          <div class="day-card wed">
            <span class="dc-badge">Day 3</span>
            <span class="dc-name">Wednesday</span>
            <span class="dc-tag">Weekday</span>
          </div>
          <div class="day-card thu">
            <span class="dc-badge">Day 4</span>
            <span class="dc-name">Thursday</span>
            <span class="dc-tag">Weekday</span>
          </div>
          <div class="day-card fri">
            <span class="dc-badge">Day 5</span>
            <span class="dc-name">Friday</span>
            <span class="dc-tag">Weekday</span>
          </div>
          <div class="day-card sat">
            <span class="dc-badge">Day 6</span>
            <span class="dc-name">Saturday</span>
            <span class="dc-tag">🎉 Weekend</span>
          </div>
          <div class="day-card sun">
            <span class="dc-badge">Day 7</span>
            <span class="dc-name">Sunday</span>
            <span class="dc-tag">🎉 Weekend</span>
          </div>
        </div>
      </div>

      <!-- 2. Middle Layout: Daily Speaking Frames + Communicative Competences -->
      <div class="middle-layout">

        <!-- Left: Classroom Daily Speaking Dialogue Frames -->
        <div class="frames-panel">
          <div class="section-bar" style="margin-bottom: 4px;">
            <span>💬 Daily Speaking Frames</span>
          </div>

          <div class="bubble-card">
            <div class="bubble-avatar">❓</div>
            <div class="bubble-content">
              <div class="bubble-phrase">"What day is <mark>today</mark>?"</div>
              <div class="bubble-sub">Teacher opens the morning routine</div>
            </div>
          </div>

          <div class="bubble-card green">
            <div class="bubble-avatar">👉</div>
            <div class="bubble-content">
              <div class="bubble-phrase">"<mark>Today is</mark> Tuesday!"</div>
              <div class="bubble-sub">Students point to calendar and answer</div>
            </div>
          </div>

          <div class="bubble-card amber">
            <div class="bubble-avatar">⏩</div>
            <div class="bubble-content">
              <div class="bubble-phrase">"<mark>Tomorrow is</mark> Wednesday."</div>
              <div class="bubble-sub">Connecting yesterday, today, and tomorrow</div>
            </div>
          </div>

          <div class="bubble-card purple">
            <div class="bubble-avatar">🎈</div>
            <div class="bubble-content">
              <div class="bubble-phrase">"It is the <mark>weekend</mark>!"</div>
              <div class="bubble-sub">Saturday & Sunday are family days</div>
            </div>
          </div>
        </div>

        <!-- Right: Communicative Competences (Nouns, Adjectives, Helpers) -->
        <div class="vocab-panel">

          <!-- Time Nouns -->
          <div class="vocab-card">
            <div class="vocab-header">
              <span>⏰ Time Nouns & Adverbs</span>
            </div>
            <div class="chips-flex">
              <span class="vchip blue">today</span>
              <span class="vchip blue">tomorrow</span>
              <span class="vchip blue">day</span>
              <span class="vchip blue">week</span>
              <span class="vchip blue">weekend</span>
            </div>
          </div>

          <!-- Descriptive Adjectives -->
          <div class="vocab-card">
            <div class="vocab-header">
              <span>✨ Describing Days (Adjectives)</span>
            </div>
            <div class="chips-flex">
              <span class="vchip orange">relaxing</span>
              <span class="vchip orange">exciting</span>
              <span class="vchip orange">busy</span>
              <span class="vchip orange">quiet</span>
            </div>
          </div>

          <!-- Grammar Anchors -->
          <div class="vocab-card">
            <div class="vocab-header">
              <span>🧩 Key Helpers (Prepositions & Verbs)</span>
            </div>
            <div class="chips-flex">
              <span class="vchip emerald">on Monday</span>
              <span class="vchip emerald">before / after</span>
              <span class="vchip emerald">is / are</span>
              <span class="vchip emerald">Numbers 1–20</span>
            </div>
          </div>

        </div>

      </div>

      <!-- 3. Bottom Bar: Phonics & 21st Century Challenge -->
      <div class="bottom-strip">
        <div class="bs-box">
          <div class="bs-icon">👂</div>
          <div>
            <div class="bs-title">Phonics & Sound Focus</div>
            <div class="bs-text">Practice sound <b>/w/</b> in <i>"weekend"</i> & <i>"Wednesday"</i> and <b>/d/</b> in <i>"day"</i>.</div>
          </div>
        </div>

        <div class="bs-box">
          <div class="bs-icon">🏆</div>
          <div>
            <div class="bs-title">21st Century Project</div>
            <div class="bs-text"><b>Class Calendar:</b> Point to today's day, track weather, and illustrate favorite activities!</div>
          </div>
        </div>
      </div>

    </div>

    <!-- Compact Footer -->
    <div class="poster-footer">
      <div>
        <span>🏫 EduGen Panama PRO • Scenario Master Poster</span>
      </div>
      <div>
        <span>Scenario 1 • Valid for All 10 Lessons (50 Hours)</span>
      </div>
    </div>

  </div>

</body>
</html>
"""

with open(OUTPUT_HTML, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Successfully generated updated HTML Poster prototype at: {OUTPUT_HTML}")
