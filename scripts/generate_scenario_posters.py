# -*- coding: utf-8 -*-
"""
EduGen Panama - Classroom Scenario Anchor Poster Engine (Canva Style)
Generates high-resolution vertical posters (HTML, PDF, and PNG) for each scenario.
Proportion: Compact header (top 20-22%) + Maximized communicative learning canvas (80%).
"""

import os
import sys
import json
import base64
import subprocess
import argparse
import pymupdf

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = r"c:\Users\esteb\AppData\..\..\.gemini\antigravity\scratch\edugen-panama-saas" if not os.path.exists(r"c:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas") else r"c:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas"
NOUNS_DIR = os.path.join(BASE_DIR, "public", "assets", "nouns")
CURRICULUMS_DIR = os.path.join(BASE_DIR, "public", "curriculums")
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

GRADE_FILE_MAP = {
    'Prekinder': 'English_Curriculum_Prekinder.json',
    'Pre-K': 'English_Curriculum_Prekinder.json',
    'Kinder': 'English_Curriculum_Kinder.json',
    'Kindergarten': 'English_Curriculum_Kinder.json',
    '1st Grade': 'English_Curriculum_Grade_1.json',
    '2nd Grade': 'English_Curriculum_Grade_2.json',
    '3rd Grade': 'English_Curriculum_Grade_3.json',
    '4th Grade': 'English_Curriculum_Grade_4.json',
    '5th Grade': 'English_Curriculum_Grade_5.json',
    '6th Grade': 'English_Curriculum_Grade_6.json',
    '7th Grade': 'English_Curriculum_Grade_7.json',
    '8th Grade': 'English_Curriculum_Grade_8.json',
    '9th Grade': 'English_Curriculum_Grade_9.json',
    '10th Grade': 'English_Curriculum_Grade_10.json',
    '11th Grade': 'English_Curriculum_Grade_11.json',
    '12th Grade': 'English_Curriculum_Grade_12.json'
}

GRADE_CEFR_MAP = {
    'Prekinder': 'Pre-A1.1',
    'Kinder': 'Pre-A1.2',
    '1st Grade': 'Pre-A1.3',
    '2nd Grade': 'Pre-A1.4',
    '3rd Grade': 'A1.1',
    '4th Grade': 'A1.2',
    '5th Grade': 'A1.3',
    '6th Grade': 'A2.1',
    '7th Grade': 'A2.2',
    '8th Grade': 'A2.3',
    '9th Grade': 'A2.4',
    '10th Grade': 'B1.1',
    '11th Grade': 'B1.2',
    '12th Grade': 'B1.3'
}

def sanitize(name):
    return (name or '').replace(':', ' -').replace('/', '-').replace('\\', '-').replace('?', '').replace('*', '').replace('"', '').strip()

def get_b64(filename):
    if not filename:
        return ""
    path = os.path.join(NOUNS_DIR, filename)
    if not os.path.exists(path):
        return ""
    with open(path, "rb") as f:
        data = base64.b64encode(f.read()).decode("utf-8")
    ext = os.path.splitext(filename)[1].replace(".", "").lower()
    return f"data:image/{ext};base64,{data}"

def parse_scenario_data(scenario, index):
    num = scenario.get("id") or scenario.get("scenario_number") or scenario.get("scenarioNum") or (index + 1)
    title = scenario.get("title") or scenario.get("scenario_title") or scenario.get("scenarioName") or f"Scenario {num}"
    
    # Themes extraction
    themes_raw = scenario.get("themes") or []
    themes = []
    if isinstance(themes_raw, list):
        for t in themes_raw:
            if isinstance(t, str):
                themes.append(t)
            elif isinstance(t, dict):
                themes.append(t.get("theme_title") or t.get("title") or "")
    if not themes:
        if scenario.get("theme1"):
            themes.append(scenario.get("theme1"))
        if scenario.get("theme2"):
            themes.append(scenario.get("theme2"))
            
    t1 = themes[0] if len(themes) > 0 else "Theme 1"
    t2 = themes[1] if len(themes) > 1 else ""

    # Communicative Competences
    nouns = []
    verbs = []
    adjectives = []
    helpers = []
    speech_frames = []
    phonics = ""
    project = ""

    # Check Prekinder style
    rec_vocab = scenario.get("recommended_vocabulary") or {}
    if isinstance(rec_vocab, dict):
        if rec_vocab.get("nouns"):
            nouns.extend([w.strip() for w in rec_vocab.get("nouns", "").split(",") if w.strip()])
        if rec_vocab.get("verbs"):
            verbs.extend([w.strip() for w in rec_vocab.get("verbs", "").split(",") if w.strip()])
        if rec_vocab.get("adjectives"):
            adjectives.extend([w.strip() for w in rec_vocab.get("adjectives", "").split(",") if w.strip()])
        if rec_vocab.get("interjections"):
            helpers.extend([w.strip() for w in rec_vocab.get("interjections", "").split(",") if w.strip()])
        if rec_vocab.get("prepositions"):
            helpers.extend([w.strip() for w in rec_vocab.get("prepositions", "").split(",") if w.strip()])

    # Check Standard Grade 1-12 style
    comm = scenario.get("communicative_competences") or scenario.get("communicativeCompetences") or {}
    ling = comm.get("linguistic") or {}
    vocab = ling.get("vocabulary") or {}
    if isinstance(vocab, dict):
        if isinstance(vocab.get("nouns"), list):
            nouns.extend(vocab.get("nouns"))
        if isinstance(vocab.get("verbs"), list):
            verbs.extend(vocab.get("verbs"))
        if isinstance(vocab.get("adjectives"), list):
            adjectives.extend(vocab.get("adjectives"))
        if isinstance(vocab.get("prepositions_of_time"), list):
            helpers.extend(vocab.get("prepositions_of_time"))
        if isinstance(vocab.get("adverbs_of_time"), list):
            helpers.extend(vocab.get("adverbs_of_time"))

    # Linguistic sentences
    ling_comp = scenario.get("linguistic_competences") or []
    if isinstance(ling_comp, list):
        for item in ling_comp:
            if isinstance(item, str) and '(' in item and ')' in item:
                # Extract e.g. from parentheses
                part = item[item.find('(')+1 : item.rfind(')')].replace('e.g.,', '').replace('"', '').strip()
                if part:
                    speech_frames.append(part)
            elif isinstance(item, str):
                speech_frames.append(item)

    if not speech_frames:
        gf = ling.get("grammatical_features") or []
        for g in gf:
            if '(' in g and ')' in g:
                part = g[g.find('(')+1 : g.rfind(')')].replace('e.g.,', '').replace('"', '').strip()
                if part:
                    speech_frames.append(part)

    # Fallback speech frames if none parsed
    if not speech_frames:
        speech_frames = [f"I like {t1}.", f"This is our {title}.", f"Let's practice together!"]

    # Phonics
    pron = scenario.get("pronunciation") or ling.get("pronunciation_and_phonemic_awareness", {}).get("pronunciation") or ""
    if isinstance(pron, str):
        phonics = pron
    elif isinstance(pron, dict):
        phonics = pron.get("pronunciation") or ""

    # Projects
    projs = scenario.get("projects") or scenario.get("twenty_first_century_projects") or []
    if isinstance(projs, list) and len(projs) > 0:
        first = projs[0]
        if isinstance(first, dict):
            project = first.get("title") or first.get("overview") or ""
        elif isinstance(first, str):
            project = first

    return {
        "num": num,
        "title": title,
        "t1": t1,
        "t2": t2,
        "nouns": list(dict.fromkeys(nouns))[:10],
        "verbs": list(dict.fromkeys(verbs))[:8],
        "adjectives": list(dict.fromkeys(adjectives))[:6],
        "helpers": list(dict.fromkeys(helpers))[:6],
        "speech_frames": speech_frames[:4],
        "phonics": phonics or "Practice clear pronunciation and natural sentence intonation.",
        "project": project or "Create a collaborative classroom poster illustrating the theme!"
    }

def generate_poster_html(grade_name, data):
    cefr = GRADE_CEFR_MAP.get(grade_name, "A1")
    num = data["num"]
    title = data["title"]
    t1 = data["t1"]
    t2 = data["t2"]

    # Palette styles per scenario for visual variety
    palettes = [
        {"main": "#2563eb", "sub": "#1e3a8a", "accent": "#facc15", "badge": "#38bdf8"},
        {"main": "#059669", "sub": "#064e3b", "accent": "#fde047", "badge": "#34d399"},
        {"main": "#7c3aed", "sub": "#4c1d95", "accent": "#fbbf24", "badge": "#a78bfa"},
        {"main": "#ea580c", "sub": "#7c2d12", "accent": "#fef08a", "badge": "#fb923c"},
        {"main": "#0284c7", "sub": "#0c4a6e", "accent": "#fde047", "badge": "#38bdf8"},
        {"main": "#db2777", "sub": "#831843", "accent": "#fef08a", "badge": "#f472b6"},
        {"main": "#16a34a", "sub": "#14532d", "accent": "#facc15", "badge": "#4ade80"},
        {"main": "#4f46e5", "sub": "#312e81", "accent": "#fef08a", "badge": "#818cf8"},
    ]
    p = palettes[(num - 1) % len(palettes)]

    # Format speech frames into bubbles
    bubble_colors = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"]
    bubble_icons = ["💬", "👉", "✨", "🎉"]
    speech_cards_html = ""
    for i, sf in enumerate(data["speech_frames"]):
        color = bubble_colors[i % len(bubble_colors)]
        icon = bubble_icons[i % len(bubble_icons)]
        speech_cards_html += f"""
        <div class="speech-card" style="border-left: 5px solid {color};">
          <div class="speech-icon">{icon}</div>
          <div class="speech-text">"{sf}"</div>
        </div>
        """

    # Format Noun chips
    noun_chips_html = "".join([f'<span class="chip noun">{n}</span>' for n in data["nouns"]]) or '<span class="chip noun">General Vocabulary</span>'
    verb_chips_html = "".join([f'<span class="chip verb">{v}</span>' for v in data["verbs"]]) or '<span class="chip verb">Action Verbs</span>'
    adj_chips_html = "".join([f'<span class="chip adj">{a}</span>' for a in data["adjectives"]]) or '<span class="chip adj">Descriptive Words</span>'
    helper_chips_html = "".join([f'<span class="chip helper">{h}</span>' for h in data["helpers"]]) or '<span class="chip helper">Key Helpers</span>'

    theme2_html = ""
    if t2:
        theme2_html = f"""
        <div class="theme-badge t2">
          <span class="theme-dot green"></span>
          <span><b>Theme 2:</b> {t2}</span>
        </div>
        """

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{grade_name} • Scenario {num}: {title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Poppins:wght@400;500;600;700;800&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
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
      background: #f1f5f9;
      font-family: 'Poppins', sans-serif;
      color: #1e293b;
      display: flex;
      justify-content: center;
      padding: 20px 10px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    .poster {{
      width: 816px;
      min-height: 1150px;
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 20px 40px -10px rgba(0,0,0,0.18);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 6px solid {p['main']};
    }}
    @media print {{
      body {{ background: transparent; padding: 0; }}
      .poster {{ border: none; box-shadow: none; border-radius: 0; width: 100%; min-height: 100%; }}
    }}

    /* Top Strip */
    .top-strip {{
      height: 10px;
      background: linear-gradient(90deg, #ef4444 0%, #f59e0b 20%, #10b981 40%, #06b6d4 60%, #3b82f6 80%, #8b5cf6 100%);
    }}

    /* COMPACT HEADER (Under 22% of poster height) */
    .compact-header {{
      background: linear-gradient(135deg, #0f172a 0%, {p['sub']} 50%, {p['main']} 100%);
      color: white;
      padding: 16px 26px 14px 26px;
      border-bottom: 4px solid {p['accent']};
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
      background: {p['accent']};
      color: #713f12;
      font-family: 'Fredoka', cursive;
      font-size: 13px;
      font-weight: 700;
      padding: 3px 14px;
      border-radius: 999px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.18);
    }}
    
    .title-banner {{
      margin-bottom: 10px;
    }}
    .sc-number {{
      font-size: 11px;
      font-weight: 800;
      color: {p['badge']};
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

    /* Themes Bar */
    .themes-bar {{
      display: grid;
      grid-template-columns: { '1fr 1fr' if t2 else '1fr' };
      gap: 10px;
    }}
    .theme-badge {{
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 10px;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #f1f5f9;
    }}
    .theme-dot {{
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: {p['accent']};
      flex-shrink: 0;
    }}
    .theme-dot.green {{ background: #4ade80; }}

    /* POSTER BODY (80% of canvas - maximized learning space) */
    .poster-body {{
      padding: 20px 24px 16px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      flex: 1;
    }}

    .section-bar {{
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Fredoka', cursive;
      font-size: 18px;
      font-weight: 700;
      color: {p['sub']};
      margin-bottom: 8px;
    }}
    .section-bar::after {{
      content: '';
      flex: 1;
      height: 2.5px;
      background: #e2e8f0;
      border-radius: 999px;
    }}

    /* Main Grid Split */
    .main-grid {{
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 16px;
      flex: 1;
    }}

    /* Left: Speaking & Sentences */
    .speaking-box {{
      background: #f8fafc;
      border: 2px solid #e2e8f0;
      border-radius: 18px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }}
    .speech-card {{
      background: white;
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.04);
    }}
    .speech-icon {{
      font-size: 24px;
      line-height: 1;
    }}
    .speech-text {{
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.3;
    }}

    /* Right: Vocabulary Vault */
    .vocab-box {{
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
    .chip {{
      font-family: 'Fredoka', cursive;
      font-size: 14px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid;
    }}
    .chip.noun {{ background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }}
    .chip.verb {{ background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }}
    .chip.adj {{ background: #fff7ed; color: #c2410c; border-color: #fed7aa; }}
    .chip.helper {{ background: #faf5ff; color: #7e22ce; border-color: #e9d5ff; }}

    /* Bottom Educational Strip */
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
    .bs-icon {{ font-size: 26px; line-height: 1; }}
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

    /* Compact Footer */
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
        <span class="grade-badge">🌟 {grade_name} • CEFR {cefr}</span>
      </div>

      <div class="title-banner">
        <div class="sc-number">Scenario {num} Master Poster</div>
        <div class="scenario-heading">"{title}"</div>
      </div>

      <div class="themes-bar">
        <div class="theme-badge t1">
          <span class="theme-dot"></span>
          <span><b>Theme 1:</b> {t1}</span>
        </div>
        {theme2_html}
      </div>
    </div>

    <!-- LEARNING CANVAS (Over 78% of the poster) -->
    <div class="poster-body">

      <!-- Main Two Column Grid: Speaking Routines + Communicative Competences -->
      <div class="main-grid">

        <!-- Left: Classroom Daily Speaking Dialogue Frames -->
        <div class="speaking-box">
          <div class="section-bar">
            <span>💬 Daily Speaking Frames</span>
          </div>
          {speech_cards_html}
        </div>

        <!-- Right: Communicative Competences (Nouns, Verbs, Adjectives) -->
        <div class="vocab-box">

          <!-- Nouns & Vocabulary -->
          <div class="vocab-card">
            <div class="vocab-header">
              <span>🎒 Core Nouns & Concepts</span>
            </div>
            <div class="chips-flex">
              {noun_chips_html}
            </div>
          </div>

          <!-- Action Verbs -->
          <div class="vocab-card">
            <div class="vocab-header">
              <span>⚡ Action Verbs</span>
            </div>
            <div class="chips-flex">
              {verb_chips_html}
            </div>
          </div>

          <!-- Describing Words & Helpers -->
          <div class="vocab-card">
            <div class="vocab-header">
              <span>✨ Describing Words & Helpers</span>
            </div>
            <div class="chips-flex">
              {adj_chips_html}
              {helper_chips_html}
            </div>
          </div>

        </div>

      </div>

      <!-- Phonics & 21st Century Challenge -->
      <div class="bottom-strip">
        <div class="bs-box">
          <div class="bs-icon">👂</div>
          <div>
            <div class="bs-title">Phonics & Sound Focus</div>
            <div class="bs-text">{data['phonics']}</div>
          </div>
        </div>

        <div class="bs-box">
          <div class="bs-icon">🏆</div>
          <div>
            <div class="bs-title">21st Century Mission</div>
            <div class="bs-text">{data['project']}</div>
          </div>
        </div>
      </div>

    </div>

    <!-- Footer -->
    <div class="poster-footer">
      <div>
        <span>🏫 EduGen Panama PRO • Scenario Anchor Poster</span>
      </div>
      <div>
        <span>Scenario {num} of 8 • Valid for All Sequential Lessons</span>
      </div>
    </div>

  </div>

</body>
</html>
"""
    return html

def render_poster_files(grade_name, scenario_data, out_folder):
    sc_num = scenario_data["num"]
    sc_title = scenario_data["title"]
    base_name = f"Poster Escenario {sc_num} - {sanitize(sc_title)}"
    
    html_path = os.path.join(out_folder, f"{base_name}.html")
    pdf_path = os.path.join(out_folder, f"{base_name}.pdf")
    png_path = os.path.join(out_folder, f"{base_name}.png")

    # 1. Generate HTML
    html_content = generate_poster_html(grade_name, scenario_data)
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    # 2. Render PDF with Edge Headless
    if os.path.exists(EDGE_EXE):
        cmd = [
            EDGE_EXE,
            "--headless",
            "--disable-gpu",
            f"--print-to-pdf={pdf_path}",
            html_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 3. Render PNG from PDF with PyMuPDF
    if os.path.exists(pdf_path):
        doc = pymupdf.open(pdf_path)
        if len(doc) > 0:
            page = doc[0]
            pix = page.get_pixmap(dpi=200)
            pix.save(png_path)
            doc.close()

    print(f"  ✅ [SCENARIO {sc_num}] Created:")
    print(f"     HTML: {base_name}.html")
    print(f"     PDF : {base_name}.pdf ({os.path.getsize(pdf_path) if os.path.exists(pdf_path) else 0} bytes)")
    print(f"     PNG : {base_name}.png ({os.path.getsize(png_path) if os.path.exists(png_path) else 0} bytes)")

def process_grade(grade_name):
    curr_file = GRADE_FILE_MAP.get(grade_name)
    if not curr_file:
        print(f"Error: Unknown grade {grade_name}")
        return

    curr_path = os.path.join(CURRICULUMS_DIR, curr_file)
    if not os.path.exists(curr_path):
        print(f"Error: Curriculum file {curr_path} not found.")
        return

    with open(curr_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    scenarios = data.get("scenarios") or []
    print(f"\n=======================================================")
    print(f" GENERATING CLASSROOM POSTERS FOR: {grade_name}")
    print(f" Total Scenarios: {len(scenarios)}")
    print(f"=======================================================")

    for base_target in ["postes", "posters"]:
        target_dir = os.path.join(BASE_DIR, base_target, grade_name)
        os.makedirs(target_dir, exist_ok=True)
        print(f"\n📁 Target Directory: {target_dir}")

        for i, s in enumerate(scenarios):
            parsed = parse_scenario_data(s, i)
            render_poster_files(grade_name, parsed, target_dir)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--grade", type=str, default="Prekinder", help="Grade to generate posters for")
    args = parser.parse_args()

    process_grade(args.grade)
