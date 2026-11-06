# -*- coding: utf-8 -*-
"""
EduGen Panama - Scenario 1 Theme 1 Complete Prototype Generator
Grade 4 • CEFR Level: Beginner A1.2
Curriculum: Scenario 1 "A Walk in the Neighborhood" • Theme 1: "This Is My Favorite."
Generates 5 distinct skill packets (Listening, Reading, Speaking, Writing, Mediation),
each strictly 8 pages (6 student pages following AOA stages 1-6 + 2 teacher guide pages).
"""

import os
import subprocess
import sys

BASE_DIR = r"c:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas"
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
ASSETS_DIR = os.path.join(PUBLIC_DIR, "assets", "nouns")
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

def asset_url(filename):
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
      background: #E2E8F0;
      color: #1E293B;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 8.5in;
      height: 11in;
      margin: 0 auto 20px auto;
      background: #FFFDF9;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      padding: 0.50in 0.48in 0.35in 0.48in;
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    @media print {
      body { background: #FFF; }
      .page { margin: 0; box-shadow: none; }
    }

    /* Awning Canopy */
    .canopy-strip {
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 34px;
      display: flex;
      z-index: 10;
    }
    .canopy-col {
      flex: 1; height: 100%;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
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
      margin-top: 2px;
      margin-bottom: 6px;
      align-items: center;
      flex-wrap: wrap;
    }
    .pill {
      font-size: 8pt;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 999px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .pill-grade { background: #1E293B; color: #FFF; }
    .pill-scenario { background: #2A9D8F; color: #FFF; }
    .pill-theme { background: #457B9D; color: #FFF; }
    .pill-skill { background: #E76F51; color: #FFF; }
    .pill-cefr { background: #E9C46A; color: #1E293B; }

    /* Student Info Bar */
    .student-bar {
      display: flex;
      background: #F1F5F9;
      border: 1.5px solid #CBD5E1;
      border-radius: 9px;
      padding: 4px 10px;
      font-size: 8.5pt;
      font-weight: 700;
      color: #475569;
      margin-bottom: 8px;
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
      height: 11px;
    }

    /* Stage Banner */
    .stage-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #1E293B 0%, #334155 100%);
      color: #FFF;
      padding: 5px 12px;
      border-radius: 9px;
      margin-bottom: 9px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }
    .stage-title {
      font-family: 'Fredoka One', cursive;
      font-size: 11.5pt;
      letter-spacing: 0.4px;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .stage-time {
      font-size: 7.8pt;
      background: rgba(255,255,255,0.22);
      padding: 2px 7px;
      border-radius: 5px;
      font-weight: 700;
    }

    /* Content Area */
    .content-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* Cards */
    .card {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 11px;
      padding: 10px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .card-header {
      font-family: 'Fredoka One', cursive;
      font-size: 10.5pt;
      color: #2A9D8F;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .instruction-box {
      background: #FEF3C7;
      border-left: 3.5px solid #F59E0B;
      padding: 5px 9px;
      border-radius: 5px;
      font-size: 8.8pt;
      font-weight: 700;
      color: #92400E;
      margin-bottom: 6px;
      line-height: 1.3;
    }

    /* Mascot Strip */
    .mascot-strip {
      margin-top: auto;
      background: #F8FAFC;
      border: 1.5px dashed #CBD5E1;
      border-radius: 9px;
      padding: 5px 9px;
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 8.2pt;
      font-weight: 700;
      color: #475569;
    }
    .mascot-icon {
      font-size: 13pt;
    }
    .page-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 7.2pt;
      color: #94A3B8;
      font-weight: 700;
      margin-top: 4px;
      padding-top: 3px;
      border-top: 1px solid #E2E8F0;
    }

    /* Dialogue */
    .dialogue-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .bubble-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }
    .bubble-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 2px solid #2A9D8F;
      background: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 9.5pt;
      flex-shrink: 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    }
    .bubble {
      background: #F8FAFC;
      border: 1.5px solid #CBD5E1;
      border-radius: 11px;
      padding: 6px 10px;
      font-size: 9.2pt;
      position: relative;
      flex: 1;
      line-height: 1.35;
    }
    .bubble.user-a { border-color: #2A9D8F; background: #F0FDFA; }
    .bubble.user-b { border-color: #F4A261; background: #FFFBEB; }

    /* Grids */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 7px; }

    /* Scrambled Item Boxes */
    .item-box {
      border: 1.5px solid #CBD5E1;
      border-radius: 9px;
      background: #FFF;
      padding: 6px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    }
    .item-img {
      width: 58px;
      height: 58px;
      object-fit: contain;
    }
    .number-circle {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      border: 2px dashed #457B9D;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 10pt;
      color: #457B9D;
      margin-top: 3px;
      background: #F0F9FF;
    }

    /* Handwriting Guide Lines */
    .hw-line-group {
      margin-bottom: 5px;
    }
    .hw-line-label {
      font-size: 8pt;
      font-weight: 800;
      color: #64748B;
      margin-bottom: 2px;
    }
    .hw-guide {
      height: 30px;
      background: repeating-linear-gradient(
        to bottom,
        #E2E8F0,
        #E2E8F0 1px,
        transparent 1px,
        transparent 9px,
        #CBD5E1 9px,
        #CBD5E1 10px,
        transparent 10px,
        transparent 19px,
        #94A3B8 19px,
        #94A3B8 20px
      );
      border-bottom: 1.5px solid #94A3B8;
      border-radius: 4px;
      padding: 0 8px;
      display: flex;
      align-items: center;
      font-size: 10pt;
      font-family: 'Fredoka One', cursive;
      color: #1E293B;
      letter-spacing: 0.6px;
    }

    /* Tables */
    .styled-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8.5pt;
    }
    .styled-table th, .styled-table td {
      border: 1px solid #CBD5E1;
      padding: 5px 7px;
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
      border-radius: 9px;
      padding: 8px;
      margin-bottom: 6px;
    }
    .tg-title {
      font-weight: 800;
      font-size: 9pt;
      color: #1E293B;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .tg-script {
      background: #FFF;
      border-left: 3px solid #2A9D8F;
      padding: 4px 7px;
      font-size: 8.2pt;
      font-style: italic;
      color: #334155;
      margin-top: 2px;
      border-radius: 0 5px 5px 0;
      line-height: 1.3;
    }
    .rubric-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.4pt;
      margin-top: 4px;
    }
    .rubric-table th, .rubric-table td {
      border: 1px solid #CBD5E1;
      padding: 4px 5px;
      text-align: left;
      line-height: 1.25;
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
      <span class="pill pill-scenario">Scenario 1: A Walk in the Neighborhood</span>
      <span class="pill pill-theme">Theme 1: This Is My Favorite.</span>
      <span class="pill pill-skill">Lesson {lesson_num}: {skill_name}</span>
      <span class="pill pill-cefr">CEFR A1.2</span>
    </div>
    <div class="student-bar">
      <div class="field"><span>Student:</span><span class="line" style="width: 160px;"></span></div>
      <div class="field"><span>Date:</span><span class="line" style="width: 85px;"></span></div>
      <div class="field"><span>Score:</span><span class="line" style="width: 45px;"></span> / 100</div>
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

print("Base setup loaded.")
