import os
import json
import re
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image as RLImage
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

# Register fonts
font = "Helvetica"
bold = "Helvetica-Bold"
for path, name in [(r"C:\Windows\Fonts\arial.ttf", "DocFont"), (r"C:\Windows\Fonts\calibri.ttf", "DocFont")]:
    if os.path.exists(path):
        pdfmetrics.registerFont(TTFont(name, path))
        font = name
        break
for path, name in [(r"C:\Windows\Fonts\arialbd.ttf", "DocFontBold"), (r"C:\Windows\Fonts\calibrib.ttf", "DocFontBold")]:
    if os.path.exists(path):
        pdfmetrics.registerFont(TTFont(name, path))
        bold = name
        break

# Palette
c_navy = colors.HexColor("#0D3B66")
c_teal = colors.HexColor("#0081A7")
c_amber = colors.HexColor("#E07A5F")
c_card_bg = colors.HexColor("#F8FAFC")
c_dark = colors.HexColor("#1E293B")
c_muted = colors.HexColor("#64748B")
c_border = colors.HexColor("#CBD5E1")
c_gold_bg = colors.HexColor("#FEF3C7")
c_gold_border = colors.HexColor("#F59E0B")
c_green = colors.HexColor("#059669")
c_green_bg = colors.HexColor("#ECFDF5")
c_blue_bg = colors.HexColor("#EFF6FF")
c_blue_border = colors.HexColor("#3B82F6")
c_purple_bg = colors.HexColor("#FAF5FF")
c_purple_border = colors.HexColor("#A855F7")

styles = getSampleStyleSheet()

styles.add(ParagraphStyle(name="DocHeaderTitle", fontName=bold, fontSize=14, leading=18, textColor=c_navy, alignment=TA_CENTER, spaceAfter=2))
styles.add(ParagraphStyle(name="DocHeaderSub", fontName=font, fontSize=8, leading=10.5, textColor=c_muted, alignment=TA_CENTER, spaceAfter=3))
styles.add(ParagraphStyle(name="StageBanner", fontName=bold, fontSize=8.8, leading=11.5, textColor=colors.white, alignment=TA_LEFT))
styles.add(ParagraphStyle(name="InstructionText", fontName=font, fontSize=7.8, leading=10.5, textColor=c_dark, spaceAfter=2))
styles.add(ParagraphStyle(name="BoldText", fontName=bold, fontSize=8, leading=10.5, textColor=c_navy))
styles.add(ParagraphStyle(name="CenterText", fontName=font, fontSize=7.6, leading=9.5, textColor=c_dark, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="CenterBold", fontName=bold, fontSize=8, leading=10.2, textColor=c_navy, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="DialogueLine", fontName=font, fontSize=7.8, leading=10.8, textColor=c_dark))

def P(txt, s="InstructionText"):
    return Paragraph(txt, styles[s])

NOUNS_DIR = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public\assets\nouns"
_NOUNS_CACHE = set(os.listdir(NOUNS_DIR)) if os.path.exists(NOUNS_DIR) else set()

def get_realia_img(word, w=34, h=34):
    if not word:
        return P("[ITEM]", "CenterBold")
    clean = re.sub(r'[^a-zA-Z0-9_]', '', word.lower().replace(' ', '_'))
    candidates = [
        f"{clean}.png",
        f"{clean}s.png",
        f"{clean[:-1]}.png" if clean.endswith('s') else "",
        f"{clean}.jpg"
    ]
    for c in candidates:
        if c and c in _NOUNS_CACHE:
            try:
                p = os.path.join(NOUNS_DIR, c)
                if os.path.getsize(p) < 1500000:  # Avoid multi-megabyte images
                    return RLImage(p, width=w, height=h)
            except Exception:
                pass
    for fb in ["book.png", "apple.png", "star.png", "pencil.png"]:
        if fb in _NOUNS_CACHE:
            try:
                return RLImage(os.path.join(NOUNS_DIR, fb), width=w, height=h)
            except Exception:
                pass
    return P(f"[{word.upper()}]", "CenterBold")

SKILLS_MAP = {
    1: {"name": "LISTENING", "icon": "🎧", "color": c_teal, "verb": "Audio Perception & Comprehension"},
    2: {"name": "READING", "icon": "📖", "color": c_amber, "verb": "Visual Decoding & Informational Scanning"},
    3: {"name": "SPEAKING", "icon": "🗣️", "color": c_green, "verb": "Oral Interaction & Fluency"},
    4: {"name": "WRITING", "icon": "✍️", "color": c_purple_border, "verb": "Orthographic & Transactional Drafting"},
    5: {"name": "MEDIATION", "icon": "🤝", "color": c_navy, "verb": "21st Century Skills Collaboration & Project Integration"}
}

def extract_scenario_nouns(sc):
    vocab_source = (
        sc.get("communicativeCompetences", {}).get("linguistic", {}).get("vocabulary") or
        sc.get("communicative_competences", {}).get("vocabulary", {}).get("linguistic_competences") or
        sc.get("recommended_vocabulary") or
        sc.get("vocabulary") or {}
    )
    nouns = []
    if isinstance(vocab_source, dict):
        nouns = vocab_source.get("nouns") or vocab_source.get("noun") or []
    elif isinstance(vocab_source, list):
        nouns = vocab_source
    if isinstance(nouns, str):
        nouns = [n.strip() for n in nouns.split(",")]
    
    clean_nouns = []
    for n in nouns:
        word = n if isinstance(n, str) else n.get("word", "")
        word = re.sub(r'[^a-zA-Z\s]', '', word).strip().lower()
        if word and len(word) > 2 and word not in clean_nouns:
            clean_nouns.append(word)
    
    # Defaults if empty
    fallbacks = ["book", "pencil", "student", "teacher", "tree", "river", "house", "sun"]
    for fb in fallbacks:
        if len(clean_nouns) < 6 and fb not in clean_nouns:
            clean_nouns.append(fb)
    return clean_nouns[:8]

def build_single_aoa_pdf(out_pdf, grade_name, cefr, sc_num, sc_name, theme_num, theme_name, lesson_num, sc_data):
    skill_info = SKILLS_MAP.get(lesson_num, SKILLS_MAP[1])
    skill_name = skill_info["name"]
    skill_color = skill_info["color"]
    theme_type = "Receptive Focus · Weeks 1-2" if theme_num == 1 else "Productive Focus · Weeks 3-4"
    
    nouns = extract_scenario_nouns(sc_data)
    w0, w1, w2, w3 = nouns[0], nouns[1], nouns[2], nouns[3]

    doc = SimpleDocTemplate(
        out_pdf,
        pagesize=letter,
        leftMargin=24,
        rightMargin=24,
        topMargin=20,
        bottomMargin=20
    )
    story = []

    # =========================================================================
    # PAGE 1: HEADER, STAGE 1 (WARM-UP/MODELING) & STAGE 2 (PRESENTATION)
    # =========================================================================
    header_data = [
        [
            P("<b>REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)</b><br/>"
              f"<b>AOA Action Learning Lab: \"{sc_name}\"</b>", "DocHeaderTitle"),
            P(f"<b>Lesson #{lesson_num} · 45-60 min</b><br/>"
              f"Skill: <b>{skill_name}</b><br/>"
              f"Grade: <b>{grade_name} ({cefr})</b>", "CenterBold")
        ]
    ]
    t_head = Table(header_data, colWidths=[424, 140])
    t_head.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('TOPPADDING', (0,0), (-1,-1), 0),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(t_head)
    story.append(P(f"Theme {theme_num}: <i>\"{theme_name}\"</i> · {theme_type} &bull; {skill_info['verb']}", "DocHeaderSub"))

    # Student info strip
    info_data = [
        [P("<b>Student Name:</b> ___________________________", "BoldText"),
         P("<b>Date:</b> _____________", "BoldText"),
         P(f"<b>{skill_name.title()} Performance:</b> [  ] High  [  ] Good  [  ] Emerging", "BoldText")]
    ]
    t_info = Table(info_data, colWidths=[270, 110, 184])
    t_info.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 0.75, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_info)
    story.append(Spacer(1, 4))

    # STAGE 1: WARM-UP & MODELING
    s1_banner = Table([[P(f"<b>STAGE 1: WARM-UP & TEACHER MODELING ({skill_name} Engagement & Clarification)</b>", "StageBanner")]], colWidths=[564])
    s1_banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_navy),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(s1_banner)
    story.append(Spacer(1, 3))

    story.append(P(f"<b>Teacher Think-Aloud & Communicative Model:</b> The teacher models target structures for <i>\"{theme_name}\"</i>. Focus on clarity, authentic pronunciation, and active participation.", "InstructionText"))

    # Visual Realia Strip
    realia_cells = [
        [get_realia_img(w0, 36, 36), get_realia_img(w1, 36, 36), get_realia_img(w2, 36, 36), get_realia_img(w3, 36, 36)],
        [P(f"<b>{w0.upper()}</b>", "CenterText"), P(f"<b>{w1.upper()}</b>", "CenterText"), P(f"<b>{w2.upper()}</b>", "CenterText"), P(f"<b>{w3.upper()}</b>", "CenterText")]
    ]
    t_realia = Table(realia_cells, colWidths=[141]*4)
    t_realia.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.white),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_realia)
    story.append(Spacer(1, 3))

    # Concept-Checking Questions (CCQs)
    ccq_data = [
        [
            P(f"<b>Concept-Checking Questions (CCQs) · Circle your answer:</b><br/>"
              f"1. Is the target topic about <i>\"{theme_name}\"</i>? &nbsp;&nbsp; <b>[ Yes, authentic ]</b> &nbsp;|&nbsp; <b>[ No ]</b><br/>"
              f"2. How do we start our English interaction? &nbsp;&nbsp; <b>[ Clear greeting & focus ]</b> &nbsp;|&nbsp; <b>[ Silence ]</b><br/>"
              f"3. For target items, do we pronounce plurals clearly? &nbsp;&nbsp; <b>[ Yes (-s / -es) ]</b> &nbsp;|&nbsp; <b>[ No ]</b>", "InstructionText"),
            P("<b>Warm-Up Quick-Check:</b><br/>"
              f"Look at the picture cards and note 2 keywords:<br/>"
              f"1. ____________________________<br/>"
              f"2. ____________________________", "InstructionText")
        ]
    ]
    t_ccq = Table(ccq_data, colWidths=[360, 204])
    t_ccq.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_ccq)
    story.append(Spacer(1, 4))

    # STAGE 2: PRESENTATION
    s2_banner = Table([[P(f"<b>STAGE 2: PRESENTATION (Authentic Input & {skill_name} Model)</b>", "StageBanner")]], colWidths=[564])
    s2_banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), skill_color),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(s2_banner)
    story.append(Spacer(1, 3))

    pres_data = [
        [
            P(f"<b>CURRICULAR CORE</b><br/>"
              f"<b>Scenario {sc_num}:</b> {sc_name}<br/>"
              f"<b>Theme:</b> {theme_name}<br/>"
              f"<b>Target Words:</b><br/>"
              f"&bull; {w0.title()}<br/>"
              f"&bull; {w1.title()}<br/>"
              f"&bull; {w2.title()}<br/>"
              f"&bull; {w3.title()}", "CenterText"),
            P(f"<b>AUTHENTIC COMMUNICATIVE TEXT & DIALOGUE</b><br/>"
              f"<b>Speaker A:</b> Hello! Welcome to our lesson on <i>{sc_name}</i>.<br/>"
              f"<b>Speaker B:</b> Good morning! I am ready to explore <i>{theme_name}</i>.<br/>"
              f"<b>Speaker A:</b> Look at the first item: it is a <b>{w0}</b> and here is the <b>{w1}</b>.<br/>"
              f"<b>Speaker B:</b> Excellent. We also need to identify the <b>{w2}</b> and <b>{w3}</b>.<br/>"
              f"<b>Speaker A:</b> Great collaboration! Let's complete our action learning task together.", "DialogueLine")
        ]
    ]
    t_pres = Table(pres_data, colWidths=[184, 380])
    t_pres.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), c_gold_bg),
        ('BACKGROUND', (1,0), (1,0), colors.white),
        ('BOX', (0,0), (0,0), 0.75, c_gold_border),
        ('BOX', (1,0), (1,0), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_pres)
    story.append(Spacer(1, 3))

    # Comprehension check
    comp_data = [
        [P(f"<b>Comprehension Check:</b> 1. What is the central topic? ____________________________________________________________________<br/>"
           f"2. Name two target items mentioned in the text: __________________________________________________________________", "InstructionText")]
    ]
    t_comp = Table(comp_data, colWidths=[564])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_comp)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 2: STAGE 3 (PREPARATION & GUIDED PRACTICE)
    # =========================================================================
    p2_head = Table([[
        P(f"<b>PAGE 2 · STAGE 3: PREPARATION & GUIDED PRACTICE ({skill_name.upper()} MASTERY)</b>", "StageBanner"),
        P(f"<b>{grade_name} · Lesson #{lesson_num}</b>", "CenterBold")
    ]], colWidths=[444, 120])
    p2_head.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), c_navy),
        ('BACKGROUND', (1,0), (1,0), c_gold_bg),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(p2_head)
    story.append(Spacer(1, 4))

    # Activity 3.1: Vocabulary Decoding
    story.append(P("<b>ACTIVITY 3.1 · Vocabulary & Spelling Verification:</b> Identify each item with its visual cue and write the complete word neatly on the line:", "InstructionText"))

    act31_cells = [
        [
            get_realia_img(w0, 30, 30),
            P(f"<b>1. {w0.upper()[:2]}_ _ _</b><br/>Word: ___________________", "InstructionText"),
            get_realia_img(w1, 30, 30),
            P(f"<b>2. {w1.upper()[:2]}_ _ _</b><br/>Word: ___________________", "InstructionText")
        ],
        [
            get_realia_img(w2, 30, 30),
            P(f"<b>3. {w2.upper()[:2]}_ _ _</b><br/>Word: ___________________", "InstructionText"),
            get_realia_img(w3, 30, 30),
            P(f"<b>4. {w3.upper()[:2]}_ _ _</b><br/>Word: ___________________", "InstructionText")
        ]
    ]
    t_act31 = Table(act31_cells, colWidths=[42, 240, 42, 240])
    t_act31.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.white),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_act31)
    story.append(Spacer(1, 4))

    # Activity 3.2: Sentence Scramble / Syntax Building
    story.append(P("<b>ACTIVITY 3.2 · Sentence Syntax Challenge:</b> Unscramble the words to build grammatically correct sentences with capital letters and punctuation:", "InstructionText"))

    scramble_data = [
        [P(f"<b>Sentence 1:</b> [ {w0} / is / The / here . ]<br/><b>Write:</b> ______________________________________________________________________________", "InstructionText")],
        [P(f"<b>Sentence 2:</b> [ need / We / {w1} / two . ]<br/><b>Write:</b> ______________________________________________________________________________", "InstructionText")],
        [P(f"<b>Sentence 3:</b> [ {w2} / like / I / the . ]<br/><b>Write:</b> ______________________________________________________________________________", "InstructionText")],
        [P(f"<b>Sentence 4:</b> [ best / is / It / the . ]<br/><b>Write:</b> ______________________________________________________________________________", "InstructionText")]
    ]
    t_scram = Table(scramble_data, colWidths=[564])
    t_scram.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_scram)
    story.append(Spacer(1, 4))

    # Activity 3.3: Guided Table / Chart
    story.append(P("<b>ACTIVITY 3.3 · Guided Structured Matrix:</b> Complete the official inventory matrix with accurate details and calculations:", "InstructionText"))

    matrix_cells = [
        [P("<b>#</b>", "CenterBold"), P("<b>ITEM</b>", "CenterBold"), P("<b>KEYWORD</b>", "CenterBold"), P("<b>CATEGORY</b>", "CenterBold"), P("<b>VERIFICATION</b>", "CenterBold")],
        [P("1", "CenterText"), get_realia_img(w0, 24, 24), P(w0.title(), "InstructionText"), P("Target Realia", "CenterText"), P("[  ] Verified", "CenterBold")],
        [P("2", "CenterText"), get_realia_img(w1, 24, 24), P(w1.title(), "InstructionText"), P("Target Realia", "CenterText"), P("[  ] Verified", "CenterBold")],
        [P("3", "CenterText"), get_realia_img(w2, 24, 24), P(w2.title(), "InstructionText"), P("Target Realia", "CenterText"), P("[  ] Verified", "CenterBold")],
        [P("4", "CenterText"), get_realia_img(w3, 24, 24), P(w3.title(), "InstructionText"), P("Target Realia", "CenterText"), P("[  ] Verified", "CenterBold")],
        [P("<b>STATUS:</b>", "CenterBold"), P("", "CenterText"), P("<b>All 4 Items Completed Accurately</b>", "InstructionText"), P("", "CenterText"), P("<b>[  ] PASSED</b>", "CenterBold")]
    ]
    t_mat = Table(matrix_cells, colWidths=[35, 75, 174, 140, 140])
    t_mat.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), skill_color),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('BACKGROUND', (0,-1), (-1,-1), c_gold_bg),
        ('SPAN', (0, -1), (1, -1)),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 0.75, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ]))
    story.append(t_mat)

    story.append(PageBreak())

    # =========================================================================
    # PAGE 3: STAGE 4 (PRODUCTION), STAGE 5 (ASSESSMENT) & STAGE 6 (REFLECTION)
    # =========================================================================
    p3_head = Table([[
        P(f"<b>PAGE 3 · STAGE 4: ACTION TASK PERFORMANCE ({skill_name.upper()} MISSION)</b>", "StageBanner"),
        P("<b>AOA Assessment</b>", "CenterBold")
    ]], colWidths=[444, 120])
    p3_head.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), c_navy),
        ('BACKGROUND', (1,0), (1,0), c_green_bg),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(p3_head)
    story.append(Spacer(1, 3))

    story.append(P(f"<b>Action-Oriented Mission:</b> Complete your personal or group performance deliverable for <i>\"{theme_name}\"</i>:", "InstructionText"))

    mission_data = [
        [P(f"<b>OFFICIAL ACTION DELIVERABLE · {skill_name.upper()} MISSION PAD</b><br/>"
           f"<b>Mission Focus:</b> Applying {skill_name.lower()} skills in an authentic scenario context.<br/><br/>"
           f"1. Today we worked on ______________________________________________________________________________.<br/><br/>"
           f"2. Our first key finding was that the {w0} ___________________________________________________________.<br/><br/>"
           f"3. We also observed that the {w1} __________________________________________________________________.<br/><br/>"
           f"4. Our final conclusion: _________________________________________________________________________!", "InstructionText")]
    ]
    t_mis = Table(mission_data, colWidths=[564])
    t_mis.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_purple_bg),
        ('BOX', (0,0), (-1,-1), 0.75, c_purple_border),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(t_mis)
    story.append(Spacer(1, 3))

    # STAGE 5: PEER REVIEW & FORMATIVE RUBRIC
    s5_banner = Table([[P("<b>STAGE 5: PEER REVIEW CHECK & OFFICIAL MEDUCA FORMATIVE RUBRIC</b>", "StageBanner")]], colWidths=[564])
    s5_banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_amber),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(s5_banner)
    story.append(Spacer(1, 2))

    peer_data = [
        [P("<b>Peer Review Check:</b> Reviewer Name: ________________________________ &bull; [  ] Key vocabulary present &nbsp;|&nbsp; [  ] Clear communicative message &nbsp;|&nbsp; [  ] Legible & neat", "InstructionText")]
    ]
    t_peer = Table(peer_data, colWidths=[564])
    t_peer.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_gold_bg),
        ('BOX', (0,0), (-1,-1), 0.5, c_gold_border),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t_peer)
    story.append(Spacer(1, 2))

    # Formative rubric
    rubric_cells = [
        [P("<b>CRITERIA</b>", "CenterBold"), P("<b>3 · EXEMPLARY (A)</b>", "CenterBold"), P("<b>2 · SATISFACTORY (B)</b>", "CenterBold"), P("<b>1 · IN PROGRESS (C)</b>", "CenterBold")],
        [P(f"<b>1. {skill_name} Competence</b>", "BoldText"), P(f"Demonstrates fluent {skill_name.lower()} ability with high accuracy.", "InstructionText"), P(f"Participates well with minor hesitation or phonological slips.", "InstructionText"), P(f"Requires constant teacher scaffolding to complete {skill_name.lower()} tasks.", "InstructionText")],
        [P("<b>2. Target Vocabulary</b>", "BoldText"), P("Accurately applies all target keywords from the scenario.", "InstructionText"), P("Applies 2-3 keywords correctly with minor slips.", "InstructionText"), P("Struggles to recall or recognize core keywords.", "InstructionText")],
        [P("<b>3. Task Completion</b>", "BoldText"), P("Completes all 3 pages thoroughly with neatness and attention to detail.", "InstructionText"), P("Completes core sections with acceptable quality.", "InstructionText"), P("Leaves significant sections incomplete or unclear.", "InstructionText")]
    ]
    t_rub = Table(rubric_cells, colWidths=[114, 150, 150, 150])
    t_rub.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_navy),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(t_rub)
    story.append(Spacer(1, 3))

    # STAGE 6: REFLECTION
    s6_banner = Table([[P("<b>STAGE 6: STUDENT REFLECTION & INTEGRATION PREVIEW</b>", "StageBanner")]], colWidths=[564])
    s6_banner.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_teal),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(s6_banner)
    story.append(Spacer(1, 2))

    next_preview = (
        f"In Lesson #{lesson_num + 1} ({SKILLS_MAP.get(lesson_num + 1, {}).get('name', 'Mediation')}), you will expand on this learning through communicative practice!"
        if lesson_num < 5 else
        "In Lesson #5 Mediation, you integrate all skills to showcase your 21st-Century Collaborative Project to the class!"
    )

    refl_cells = [
        [
            P("<b>Student Self-Reflection:</b><br/>"
              f"1. What did you enjoy most about today's {skill_name.lower()} activities? ________________________________<br/>"
              f"2. Which keyword was easiest to master? ___________________________________________________________<br/>"
              f"3. How will you use what you learned in real life? _________________________________________________", "InstructionText"),
            P("<b>NEXT STEP PREVIEW:</b><br/>" + next_preview, "CenterText")
        ]
    ]
    t_refl = Table(refl_cells, colWidths=[384, 180])
    t_refl.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.white),
        ('BACKGROUND', (1,0), (1,0), c_green_bg),
        ('BOX', (0,0), (-1,-1), 0.5, c_border),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 5),
        ('RIGHTPADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(t_refl)

    doc.build(story)
    return True
