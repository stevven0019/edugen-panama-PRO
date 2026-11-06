# -*- coding: utf-8 -*-
"""
EduGen Panama - Shared Templates & Helpers for Scenario 1 Theme 1 Prototypes
Grade 4 • CEFR Level: Beginner A1.2
"""

import os
import subprocess

BASE_DIR = r"c:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas"
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
ASSETS_DIR = os.path.join(PUBLIC_DIR, "assets", "nouns")
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

def get_asset(filename):
    return f"assets/nouns/{filename}"

SHARED_CSS = """
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

    @page {
      size: letter portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Nunito', sans-serif;
      background: #CBD5E1;
      color: #1E293B;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 8.5in;
      height: 11in;
      margin: 0 auto 16px auto;
      background: #FFFDF9;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      padding: 0.44in 0.46in 0.32in 0.46in;
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    @media print {
      body { background: #FFF; }
      .page { margin: 0; box-shadow: none; }
    }

    /* Awning Canopy */
    .canopy-strip {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 32px;
      display: flex;
      z-index: 10;
    }
    .canopy-col {
      flex: 1; height: 100%;
      border-bottom-left-radius: 9px;
      border-bottom-right-radius: 9px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    }
    .canopy-col:nth-child(5n+1) { background: #2A9D8F; }
    .canopy-col:nth-child(5n+2) { background: #457B9D; }
    .canopy-col:nth-child(5n+3) { background: #E9C46A; }
    .canopy-col:nth-child(5n+4) { background: #F4A261; }
    .canopy-col:nth-child(5n+5) { background: #E76F51; }

    /* Top Nav Pills */
    .top-pills {
      display: flex;
      gap: 5px;
      margin-top: 1px;
      margin-bottom: 5px;
      align-items: center;
      flex-wrap: wrap;
    }
    .pill {
      font-size: 7.8pt;
      font-weight: 800;
      padding: 2.5px 7.5px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .pill-grade { background: #1E293B; color: #FFF; }
    .pill-scenario { background: #2A9D8F; color: #FFF; }
    .pill-theme { background: #457B9D; color: #FFF; }
    .pill-skill { background: #E76F51; color: #FFF; }
    .pill-cefr { background: #E9C46A; color: #1E293B; }

    /* Student Bar */
    .student-bar {
      display: flex;
      background: #F1F5F9;
      border: 1.5px solid #CBD5E1;
      border-radius: 8px;
      padding: 3.5px 10px;
      font-size: 8.2pt;
      font-weight: 700;
      color: #475569;
      margin-bottom: 7px;
      justify-content: space-between;
      align-items: center;
    }
    .student-bar .field {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .student-bar .line {
      display: inline-block;
      border-bottom: 1.5px dashed #94A3B8;
      height: 10px;
    }

    /* Stage Banner */
    .stage-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
      color: #FFF;
      padding: 5px 11px;
      border-radius: 8px;
      margin-bottom: 7px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.06);
    }
    .stage-title {
      font-family: 'Fredoka One', cursive;
      font-size: 11pt;
      letter-spacing: 0.3px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .stage-time {
      font-size: 7.5pt;
      background: rgba(255,255,255,0.2);
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }

    /* Content Area */
    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    /* Cards */
    .card {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 10px;
      padding: 9px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .card-header {
      font-family: 'Fredoka One', cursive;
      font-size: 10pt;
      color: #2A9D8F;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .instruction-box {
      background: #FEF3C7;
      border-left: 3.5px solid #F59E0B;
      padding: 4.5px 8px;
      border-radius: 5px;
      font-size: 8.5pt;
      font-weight: 700;
      color: #92400E;
      margin-bottom: 5px;
      line-height: 1.25;
    }

    /* Footer & Mascot */
    .mascot-strip {
      margin-top: auto;
      background: #F8FAFC;
      border: 1.5px dashed #CBD5E1;
      border-radius: 8px;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 8pt;
      font-weight: 700;
      color: #475569;
    }
    .mascot-icon {
      font-size: 12pt;
    }
    .page-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7pt;
      color: #94A3B8;
      font-weight: 700;
      margin-top: 3px;
      padding-top: 2px;
      border-top: 1px solid #E2E8F0;
    }

    /* Grids */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px; }

    /* Dialogue */
    .dialogue-container {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .bubble-row {
      display: flex;
      align-items: flex-start;
      gap: 7px;
    }
    .bubble-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid #2A9D8F;
      background: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 9pt;
      flex-shrink: 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    }
    .bubble {
      background: #F8FAFC;
      border: 1.5px solid #CBD5E1;
      border-radius: 10px;
      padding: 5px 9px;
      font-size: 8.8pt;
      position: relative;
      flex: 1;
      line-height: 1.3;
    }
    .bubble.user-a { border-color: #2A9D8F; background: #F0FDFA; }
    .bubble.user-b { border-color: #F4A261; background: #FFFBEB; }

    /* Item Box */
    .item-box {
      border: 1.5px solid #CBD5E1;
      border-radius: 8px;
      background: #FFF;
      padding: 5px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .item-img {
      width: 52px;
      height: 52px;
      object-fit: contain;
    }
    .number-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px dashed #457B9D;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 9.5pt;
      color: #457B9D;
      margin-top: 2px;
      background: #F0F9FF;
    }

    /* Handwriting Guide Lines */
    .hw-line-group {
      margin-bottom: 4px;
    }
    .hw-line-label {
      font-size: 7.8pt;
      font-weight: 800;
      color: #64748B;
      margin-bottom: 1px;
    }
    .hw-guide {
      height: 28px;
      background: repeating-linear-gradient(
        to bottom,
        #E2E8F0,
        #E2E8F0 1px,
        transparent 1px,
        transparent 8px,
        #CBD5E1 8px,
        #CBD5E1 9px,
        transparent 9px,
        transparent 17px,
        #94A3B8 17px,
        #94A3B8 18px
      );
      border-bottom: 1.5px solid #94A3B8;
      border-radius: 4px;
      padding: 0 6px;
      display: flex;
      align-items: center;
      font-size: 9.5pt;
      font-family: 'Fredoka One', cursive;
      color: #1E293B;
      letter-spacing: 0.5px;
    }

    /* Tables */
    .styled-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }
    .styled-table th, .styled-table td {
      border: 1px solid #CBD5E1;
      padding: 4px 6px;
      text-align: left;
    }
    .styled-table th {
      background: #1E293B;
      color: #FFF;
      font-weight: 800;
    }
    .styled-table tr:nth-child(even) { background: #F8FAFC; }

    /* Teacher Guide Cards */
    .tg-box {
      background: #F8FAFC;
      border: 1.5px solid #CBD5E1;
      border-radius: 8px;
      padding: 6px 8px;
      margin-bottom: 5px;
    }
    .tg-title {
      font-weight: 800;
      font-size: 8.6pt;
      color: #1E293B;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .tg-script {
      background: #FFF;
      border-left: 3px solid #2A9D8F;
      padding: 3px 6px;
      font-size: 7.8pt;
      font-style: italic;
      color: #334155;
      margin-top: 2px;
      border-radius: 0 4px 4px 0;
      line-height: 1.25;
    }
    .rubric-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.2pt;
      margin-top: 3px;
    }
    .rubric-table th, .rubric-table td {
      border: 1px solid #CBD5E1;
      padding: 3px 5px;
      text-align: left;
      line-height: 1.2;
    }
    .rubric-table th {
      background: #1E293B;
      color: #FFF;
      font-weight: 800;
      text-align: center;
    }
    .rubric-table tr:nth-child(even) { background: #F8FAFC; }
"""

def build_awning():
    return """
    <div class="canopy-strip">
      <div class="canopy-col"></div><div class="canopy-col"></div><div class="canopy-col"></div>
      <div class="canopy-col"></div><div class="canopy-col"></div><div class="canopy-col"></div>
      <div class="canopy-col"></div><div class="canopy-col"></div><div class="canopy-col"></div>
      <div class="canopy-col"></div><div class="canopy-col"></div><div class="canopy-col"></div>
    </div>
    """

def build_top_nav(lesson_num, skill_name):
    return f"""
    <div class="top-pills">
      <span class="pill pill-grade">Grade 4</span>
      <span class="pill pill-scenario">Scenario 1: Neighborhood</span>
      <span class="pill pill-theme">Theme 1: This Is My Favorite.</span>
      <span class="pill pill-skill">Lesson {lesson_num}: {skill_name}</span>
      <span class="pill pill-cefr">CEFR A1.2</span>
    </div>
    <div class="student-bar">
      <div class="field"><span>Student:</span><span class="line" style="width: 150px;"></span></div>
      <div class="field"><span>Date:</span><span class="line" style="width: 80px;"></span></div>
      <div class="field"><span>Score:</span><span class="line" style="width: 40px;"></span> / 100</div>
    </div>
    """

def build_tg_nav(lesson_num, skill_name, part_num, part_title):
    return f"""
    <div class="top-pills">
      <span class="pill pill-grade">Grade 4 MEDUCA</span>
      <span class="pill pill-scenario">Scenario 1: Neighborhood</span>
      <span class="pill pill-skill">Lesson {lesson_num}: {skill_name}</span>
      <span class="pill pill-cefr">Teacher Guide &bull; Part {part_num}</span>
    </div>
    <div class="stage-banner" style="background: linear-gradient(135deg, #0F766E 0%, #115E59 100%);">
      <div class="stage-title">📘 TEACHER PEDAGOGICAL GUIDE &bull; {part_title}</div>
      <div class="stage-time">MEDUCA Standards Aligned</div>
    </div>
    """

def build_footer(page_num, skill_name):
    return f"""
    <div class="page-footer">
      <span>EduGen Panama &bull; MEDUCA Curriculum Framework &bull; Grade 4</span>
      <span>Scenario 1 &bull; Theme 1 &bull; {skill_name}</span>
      <span>Page {page_num} of 8</span>
    </div>
    """

def wrap_html(title, body_content):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{title}</title>
  <style>
{SHARED_CSS}
  </style>
</head>
<body>
{body_content}
</body>
</html>
"""

def compile_pdf(html_path, pdf_path):
    print(f"Compiling PDF: {pdf_path}...")
    cmd = [
        EDGE_EXE,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        f"file:///{os.path.abspath(html_path)}"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 1000:
        print(f"SUCCESS: Compiled {pdf_path} ({os.path.getsize(pdf_path)} bytes)")
        return True
    else:
        print(f"ERROR: Failed to compile {pdf_path}")
        print("Stdout:", res.stdout)
        print("Stderr:", res.stderr)
        return False
