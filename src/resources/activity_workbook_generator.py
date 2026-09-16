"""
Activity Workbook Generator for EduGen Panama SaaS.
Uses ReportLab for high-fidelity PDF generation and python-docx for editable Word document export.
Aligned with the MEDUCA Enfoque Accional (AOA) 3-Page Pedagogical Blueprint.
"""

import os
import sys
import json
import argparse
from typing import Dict, Any

# ReportLab imports
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# python-docx imports
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn


# ─────────────────────────────────────────────────────────────
# NUMBERED CANVAS FOR REPORTLAB (Header & Footer)
# ─────────────────────────────────────────────────────────────
class MeducaNumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.saveState()
        self.setFont("Helvetica-Bold", 7.5)
        self.setFillColor(colors.HexColor("#475569"))

        # Running Header
        self.drawString(18 * mm, 282 * mm, "REPÚBLICA DE PANAMÁ · MEDUCA · ENFOQUE ACCIONAL (AOA)")
        self.drawRightString(198 * mm, 282 * mm, getattr(self, "meta_grade_skill", "ENGLISH · AOA CURRICULUM"))

        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(18 * mm, 280 * mm, 198 * mm, 280 * mm)

        # Running Footer
        self.setFont("Helvetica", 7.5)
        self.setFillColor(colors.HexColor("#94A3B8"))
        self.drawString(18 * mm, 10 * mm, "EduGen Panama PRO · Action-Oriented Approach Curriculum · Material Didáctico Imprimible")
        page_str = f"Página {self._pageNumber} de {total_pages}"
        self.drawRightString(198 * mm, 10 * mm, page_str)
        self.line(18 * mm, 13 * mm, 198 * mm, 13 * mm)

        self.restoreState()


# ─────────────────────────────────────────────────────────────
# DEFAULT DATA FALLBACK (AOA English 4th Grade Lesson Sample)
# ─────────────────────────────────────────────────────────────
def get_sample_pack() -> Dict[str, Any]:
    return {
        "title": "At the Local Market: Fruit & Grocery Shopping",
        "grade": "4th Grade",
        "skill": "Listening & Speaking (AOA)",
        "scenario": "Shopping for fresh tropical produce in a local Panamanian market.",
        "objective": "Identify target fruit vocabulary and produce prices using authentic spoken exchanges.",
        "page1": {
            "wordBank": [
                {"word": "Pineapple", "pos": "fruit / noun", "example": "How much is the pineapple?", "icon": "pineapple"},
                {"word": "Apple", "pos": "fruit / noun", "example": "The apples are one dollar each.", "icon": "apple"},
                {"word": "Banana", "pos": "fruit / noun", "example": "Can I have a banana, please?", "icon": "banana"},
                {"word": "Mango", "pos": "fruit / noun", "example": "The sweet mango is two dollars.", "icon": "mango"},
                {"word": "Market", "pos": "location / noun", "example": "Welcome to our local market!", "icon": "market"},
                {"word": "Dollar", "pos": "currency / noun", "example": "It costs three dollars.", "icon": "dollar"}
            ],
            "languageFrame": {
                "question": "How much is the pineapple / are the apples?",
                "answer": "It is three dollars. / They are one dollar each.",
                "exchange": "Can I have two bananas, please? ──> Yes, here you go!"
            },
            "activity1": {
                "title": "Activity 1: Listen & Circle (Phonological & Word Recognition)",
                "instruction": "Listen carefully as your teacher reads the market items. Circle each word you hear:",
                "words": ["Pineapple", "Apple", "Banana", "Mango", "Market", "Dollar"]
            }
        },
        "page2": {
            "activity2": {
                "title": "Activity 2: Listen & Match (Items & Prices)",
                "instruction": "Listen to the audio statements. Draw a line to match each market item with its stated price:",
                "pairs": [
                    {"item": "Pineapple", "detail": "$3.00"},
                    {"item": "Apples (x3)", "detail": "$1.00"},
                    {"item": "Mango", "detail": "$2.00"},
                    {"item": "Bananas (cluster)", "detail": "$0.50"}
                ]
            },
            "activity3": {
                "title": "Activity 3: Authentic Dialogue Cloze (Guided Roleplay)",
                "instruction": "Complete the market dialogue using the correct words from the Word Bank:",
                "dialogue": [
                    {"speaker": "Seller", "text": "Hello! Welcome to the market!"},
                    {"speaker": "Buyer", "text": "Good morning! How much is the [ ________ ]?"},
                    {"speaker": "Seller", "text": "It is three [ ________ ]."},
                    {"speaker": "Buyer", "text": "Great. And how much are the [ ________ ]?"},
                    {"speaker": "Seller", "text": "They are one dollar each."},
                    {"speaker": "Buyer", "text": "Can I have a sweet [ ________ ], please?"},
                    {"speaker": "Seller", "text": "Yes, of course! Here you go."},
                    {"speaker": "Buyer", "text": "Thank you very much!"}
                ]
            },
            "activity4": {
                "title": "Activity 4: Performance Production (Market Stall Task)",
                "instruction": "Draw 3 fruits on your market stall shelf and write their price tags in English ($USD):"
            }
        },
        "page3": {
            "teacherGuide": {
                "title": "Teacher's Facilitation Guide & Spoken Audio Script",
                "script": [
                    {"stage": "Stage 1 (Warm-up & Word Bank)", "script": "Teacher points to flashcards: 'Repeat after me: Pineapple... Apple... Banana... Mango... Market... Dollar.'"},
                    {"stage": "Stage 2 (Language Frame Modeling)", "script": "Teacher models: 'Listen: How much is the pineapple? It is three dollars.' Have pairs repeat."},
                    {"stage": "Stage 3 (Activity 1 Dictation)", "script": "Read clearly: 1. Pineapple, 2. Banana, 3. Market, 4. Dollar. Check circles."},
                    {"stage": "Stage 4 (Activity 2 Match Dictation)", "script": "Sentence 1: 'The pineapple is three dollars.' Sentence 2: 'The mango is two dollars.' Sentence 3: 'The apples are one dollar.'"}
                ],
                "rubric": [
                    {
                        "criterion": "Vocabulary Recognition & Pronunciation",
                        "independent": "Correctly identifies, circles and pronounces all 6 target fruits and currency terms without prompting.",
                        "withSupport": "Identifies 4-5 items with occasional teacher modeling or phonetic prompts.",
                        "emerging": "Identifies fewer than 3 items; requires direct repetition and one-on-one visual cues."
                    },
                    {
                        "criterion": "Interactive Dialogue & Language Frame",
                        "independent": "Asks and answers price questions fluently using the target pattern ('How much is... / It is...').",
                        "withSupport": "Participates in the dialogue with pauses or minor grammatical adjustments.",
                        "emerging": "Requires continuous translation or sentence starters to formulate basic exchanges."
                    },
                    {
                        "criterion": "Task Performance (Market Simulation)",
                        "independent": "Successfully completes the stall drawing and associates correct English labels and numeric prices.",
                        "withSupport": "Completes the drawing and labeling with peer or teacher guidance.",
                        "emerging": "Incomplete stall task; struggles to link price tags with target vocabulary."
                    }
                ]
            }
        }
    }


# ─────────────────────────────────────────────────────────────
# 1. REPORTLAB PDF GENERATION
# ─────────────────────────────────────────────────────────────
def generate_pdf(pack: Dict[str, Any], output_path: str):
    """
    Generates a 3-page pedagogical activity PDF with ReportLab.
    """
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=22 * mm,
        bottomMargin=18 * mm
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    style_title = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=18,
        textColor=colors.HexColor('#0F172A'),
        spaceAfter=4
    )
    style_meta = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#475569'),
        spaceAfter=8
    )
    style_h2 = ParagraphStyle(
        'DocH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#1E293B'),
        spaceBefore=8,
        spaceAfter=4
    )
    style_instruction = ParagraphStyle(
        'DocInstruction',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#475569'),
        spaceAfter=6
    )
    style_body = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#1E293B')
    )
    style_body_bold = ParagraphStyle(
        'DocBodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor('#0F172A')
    )

    story = []

    p1 = pack.get("page1", {})
    p2 = pack.get("page2", {})
    p3 = pack.get("page3", {})

    # ═════════════════════════════════════════════════════════
    # PAGE 1: DISCOVERY & LINGUISTIC INPUT
    # ═════════════════════════════════════════════════════════

    # Student metadata box
    student_data = [
        [
            Paragraph("<b>STUDENT:</b> ___________________________________", style_body),
            Paragraph("<b>DATE:</b> _____________", style_body),
            Paragraph("<b>SCORE:</b> [ &nbsp; &nbsp; / 20 ]", style_body_bold)
        ]
    ]
    student_table = Table(student_data, colWidths=[85 * mm, 45 * mm, 45 * mm])
    student_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 0.8, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(student_table)
    story.append(Spacer(1, 4 * mm))

    # Unit Title and Context
    story.append(Paragraph(pack.get("title", "English Activity Workbook"), style_title))
    scenario_text = f"<b>Scenario:</b> {pack.get('scenario', 'Authentic task context')} &nbsp;|&nbsp; <b>Objective:</b> {pack.get('objective', 'Practice target vocabulary.')}"
    story.append(Paragraph(scenario_text, style_meta))

    # 1. Key Vocabulary Word Bank
    story.append(Paragraph("1. KEY VOCABULARY WORD BANK (Stage 1: Warm-up & Modeling)", style_h2))

    words = p1.get("wordBank", [])
    # 2 rows of 3 columns
    wb_cells = []
    current_row = []
    for i, w in enumerate(words[:6]):
        cell_content = [
            Paragraph(f"<b>{w.get('word', 'Item')}</b> <font color='#64748B' size='6.5'><i>({w.get('pos', 'noun')})</i></font>", style_body),
            Paragraph(f"<font color='#334155' size='7.5'>\"{w.get('example', '')}\"</font>", style_body)
        ]
        current_row.append(cell_content)
        if len(current_row) == 3:
            wb_cells.append(current_row)
            current_row = []
    if current_row:
        while len(current_row) < 3:
            current_row.append("")
        wb_cells.append(current_row)

    if wb_cells:
        wb_table = Table(wb_cells, colWidths=[58 * mm, 58 * mm, 58 * mm])
        wb_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.white),
            ('BOX', (0, 0), (-1, -1), 0.8, colors.HexColor('#0F172A')),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(wb_table)

    story.append(Spacer(1, 4 * mm))

    # 2. Communicative Language Frame
    story.append(Paragraph("COMMUNICATIVE LANGUAGE FRAME (Target Structure)", style_h2))
    lf = p1.get("languageFrame", {})
    lf_content = [
        [Paragraph(f"<b>Q:</b> \"{lf.get('question', 'How much is the pineapple?')}\"", style_body)],
        [Paragraph(f"<b>A:</b> \"{lf.get('answer', 'It is three dollars.')}\"", style_body)],
        [Paragraph(f"<b>Roleplay Exchange:</b> <i>{lf.get('exchange', 'Can I have one? Yes, here you go!')}</i>", style_meta)]
    ]
    lf_table = Table(lf_content, colWidths=[175 * mm])
    lf_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#EEF2FF')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#6366F1')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(lf_table)

    story.append(Spacer(1, 4 * mm))

    # 3. Activity 1: Listen & Circle
    act1 = p1.get("activity1", {})
    story.append(Paragraph("2. " + act1.get("title", "ACTIVITY 1: LISTEN & CIRCLE"), style_h2))
    story.append(Paragraph(act1.get("instruction", "Listen carefully to the teacher and circle each word you hear:"), style_instruction))

    act1_words = act1.get("words", [w.get("word") for w in words])
    circle_cells = []
    circle_row = []
    for word in act1_words[:6]:
        circle_row.append(Paragraph(f"○ &nbsp; <b>{word}</b>", style_body_bold))
    circle_cells.append(circle_row)
    circle_table = Table(circle_cells, colWidths=[175 * mm / max(1, len(circle_row)) for _ in circle_row])
    circle_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 0.8, colors.HexColor('#CBD5E1')),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('TOPPADDING', (0, 0), (-1, -1), 7),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 7),
    ]))
    story.append(circle_table)

    # ═════════════════════════════════════════════════════════
    # PAGE 2: GUIDED PRACTICE & PERFORMANCE TASK
    # ═════════════════════════════════════════════════════════
    story.append(PageBreak())

    # Activity 2: Listen & Match
    act2 = p2.get("activity2", {})
    story.append(Paragraph("3. " + act2.get("title", "ACTIVITY 2: LISTEN & MATCH (Items & Prices)"), style_h2))
    story.append(Paragraph(act2.get("instruction", "Listen to the audio statements. Draw a line to match each market item with its stated price:"), style_instruction))

    pairs = act2.get("pairs", [])
    match_data = []
    for p in pairs[:4]:
        match_data.append([
            Paragraph(f"<b>[ • ] &nbsp; {p.get('item', '')}</b>", style_body),
            Paragraph("─────────────────────────", ParagraphStyle('Line', parent=styles['Normal'], textColor=colors.HexColor('#CBD5E1'), alignment=1)),
            Paragraph(f"<b>{p.get('detail', '')} &nbsp; [ • ]</b>", style_body_bold)
        ])
    if match_data:
        match_table = Table(match_data, colWidths=[55 * mm, 65 * mm, 55 * mm])
        match_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F8FAFC')),
            ('BACKGROUND', (2, 0), (2, -1), colors.HexColor('#F1F5F9')),
            ('BOX', (0, 0), (-1, -1), 0.8, colors.HexColor('#CBD5E1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#E2E8F0')),
            ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
            ('TOPPADDING', (0, 0), (-1, -1), 4.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(match_table)

    story.append(Spacer(1, 4 * mm))

    # Activity 3: Authentic Dialogue Cloze
    act3 = p2.get("activity3", {})
    story.append(Paragraph("4. " + act3.get("title", "ACTIVITY 3: AUTHENTIC DIALOGUE CLOZE"), style_h2))
    story.append(Paragraph(act3.get("instruction", "Complete the market dialogue using the words from the Word Bank:"), style_instruction))

    dialogue = act3.get("dialogue", [])
    dlg_data = []
    for d in dialogue[:8]:
        spk = d.get("speaker", "Person")
        color = "#4338CA" if spk.lower() == "seller" else "#0F172A"
        dlg_data.append([
            Paragraph(f"<font color='{color}'><b>{spk}:</b></font>", style_body_bold),
            Paragraph(d.get("text", ""), style_body)
        ])
    if dlg_data:
        dlg_table = Table(dlg_data, colWidths=[28 * mm, 147 * mm])
        dlg_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FCFDFE')),
            ('BOX', (0, 0), (-1, -1), 0.6, colors.HexColor('#CBD5E1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.3, colors.HexColor('#F1F5F9')),
            ('TOPPADDING', (0, 0), (-1, -1), 3),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(dlg_table)

    story.append(Spacer(1, 4 * mm))

    # Activity 4: Performance Task / Market Stall
    act4 = p2.get("activity4", {})
    story.append(Paragraph("5. " + act4.get("title", "ACTIVITY 4: PERFORMANCE TASK (Market Stall Task)"), style_h2))
    story.append(Paragraph(act4.get("instruction", "Draw 3 items on your market shelf and write their price tags in English:"), style_instruction))

    drawing_box = Table([
        [Paragraph("<font color='#94A3B8'>[ DRAWING &amp; WRITING PERFORMANCE AREA: Draw fruits on shelves and write price tags ]</font>", ParagraphStyle('CenterM', parent=styles['Normal'], alignment=1, fontSize=8))]
    ], colWidths=[175 * mm], rowHeights=[26 * mm])
    drawing_box.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#94A3B8')),
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FAFAFA')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(drawing_box)

    # ═════════════════════════════════════════════════════════
    # PAGE 3: TEACHER'S ASSESSMENT & EVALUATION GUIDE
    # ═════════════════════════════════════════════════════════
    story.append(PageBreak())

    tg = p3.get("teacherGuide", {})
    story.append(Paragraph(tg.get("title", "TEACHER'S FACILITATION GUIDE & SPOKEN SCRIPT"), style_h2))
    story.append(Paragraph("Essential script for listening activities and action-oriented classroom management:", style_instruction))

    scripts = tg.get("script", [])
    script_data = []
    for s in scripts:
        script_data.append([
            Paragraph(f"<b>{s.get('stage', 'Stage')}</b>", style_body_bold),
            Paragraph(s.get("script", ""), style_body)
        ])
    if script_data:
        script_table = Table(script_data, colWidths=[45 * mm, 130 * mm])
        script_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#F8FAFC')),
            ('BOX', (0, 0), (-1, -1), 0.6, colors.HexColor('#CBD5E1')),
            ('INNERGRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#E2E8F0')),
            ('TOPPADDING', (0, 0), (-1, -1), 3.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
            ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(script_table)

    story.append(Spacer(1, 4 * mm))

    # Formative Assessment Rubric (AOA MEDUCA)
    story.append(Paragraph("FORMATIVE EVALUATION RUBRIC (MEDUCA AOA Standards)", style_h2))
    rubric = tg.get("rubric", [])
    rubric_data = [
        [
            Paragraph("<b>Pedagogical Criterion</b>", style_body_bold),
            Paragraph("<b>Independent (3 pts)</b>", style_body_bold),
            Paragraph("<b>With Support (2 pts)</b>", style_body_bold),
            Paragraph("<b>Emerging (1 pt)</b>", style_body_bold)
        ]
    ]
    for r in rubric:
        rubric_data.append([
            Paragraph(f"<b>{r.get('criterion', '')}</b>", style_body),
            Paragraph(r.get('independent', ''), style_body),
            Paragraph(r.get('withSupport', ''), style_body),
            Paragraph(r.get('emerging', ''), style_body)
        ])
    if rubric_data:
        rubric_table = Table(rubric_data, colWidths=[45 * mm, 44 * mm, 44 * mm, 42 * mm])
        rubric_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E2E8F0')),
            ('BOX', (0, 0), (-1, -1), 0.8, colors.HexColor('#94A3B8')),
            ('INNERGRID', (0, 0), (-1, -1), 0.4, colors.HexColor('#CBD5E1')),
            ('TOPPADDING', (0, 0), (-1, -1), 3.5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ]))
        story.append(rubric_table)

    story.append(Spacer(1, 4 * mm))

    # Teacher Observation Notes
    story.append(Paragraph("<b>Teacher Observations &amp; Differentiated Support Notes:</b>", style_body_bold))
    obs_box = Table([
        [Paragraph("<font color='#CBD5E1'>____________________________________________________________________________________________________<br/><br/>____________________________________________________________________________________________________</font>", style_body)]
    ], colWidths=[175 * mm])
    obs_box.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(obs_box)

    # Build PDF with metadata on canvas
    canvas_maker = MeducaNumberedCanvas
    canvas_maker.meta_grade_skill = f"{(pack.get('grade', '4TH GRADE')).upper()} · {(pack.get('skill', 'ENGLISH')).upper()}"

    doc.build(story, canvasmaker=canvas_maker)
    print(f"[ReportLab] PDF generado con éxito en: {output_path}")


# ─────────────────────────────────────────────────────────────
# 2. PYTHON-DOCX WORD GENERATION
# ─────────────────────────────────────────────────────────────
def set_cell_background(cell, fill_hex: str):
    """Sets background color of a Word table cell."""
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex.replace("#", "")}"/>')
    tcPr.append(shd)


def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    """Sets inner padding for Word table cells."""
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)


def generate_docx(pack: Dict[str, Any], output_path: str):
    """
    Generates a 3-page editable Word document (.docx) using python-docx.
    """
    doc = Document()

    # Configure Margins (0.6 inch / ~15mm)
    sections = doc.sections
    for s in sections:
        s.top_margin = Inches(0.6)
        s.bottom_margin = Inches(0.6)
        s.left_margin = Inches(0.6)
        s.right_margin = Inches(0.6)

    # Document Header
    header = doc.sections[0].header
    hp = header.paragraphs[0]
    hp.text = f"REPÚBLICA DE PANAMÁ · MEDUCA · ENFOQUE ACCIONAL (AOA) | {(pack.get('grade', '4th Grade')).upper()} - {(pack.get('skill', 'English')).upper()}"
    hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    hp.runs[0].font.size = Pt(7.5)
    hp.runs[0].font.color.rgb = RGBColor(100, 116, 139)

    p1 = pack.get("page1", {})
    p2 = pack.get("page2", {})
    p3 = pack.get("page3", {})

    # ═════════════════════════════════════════════════════════
    # PAGE 1: DISCOVERY & LINGUISTIC INPUT
    # ═════════════════════════════════════════════════════════

    # Student metadata table
    meta_table = doc.add_table(rows=1, cols=3)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False

    row_cells = meta_table.rows[0].cells
    row_cells[0].width = Inches(3.8)
    row_cells[1].width = Inches(1.8)
    row_cells[2].width = Inches(1.6)

    p_st = row_cells[0].paragraphs[0]
    r1 = p_st.add_run("STUDENT: ")
    r1.bold = True
    p_st.add_run("___________________________________")

    p_dt = row_cells[1].paragraphs[0]
    r2 = p_dt.add_run("DATE: ")
    r2.bold = True
    p_dt.add_run("___________")

    p_sc = row_cells[2].paragraphs[0]
    r3 = p_sc.add_run("SCORE: ")
    r3.bold = True
    p_sc.add_run("[    / 20 ]")

    for c in row_cells:
        set_cell_background(c, "F8FAFC")
        set_cell_margins(c, top=80, bottom=80, left=100, right=100)

    doc.add_paragraph()  # spacing

    # Title & Context
    h_title = doc.add_heading(pack.get("title", "English Activity Workbook"), level=1)
    h_title.runs[0].font.color.rgb = RGBColor(15, 23, 42)
    h_title.runs[0].font.size = Pt(16)

    p_desc = doc.add_paragraph()
    r_sc = p_desc.add_run("Scenario: ")
    r_sc.bold = True
    p_desc.add_run(f"{pack.get('scenario', 'Shopping in local market')}   |   ")
    r_ob = p_desc.add_run("Objective: ")
    r_ob.bold = True
    p_desc.add_run(pack.get('objective', 'Vocabulary comprehension in context.'))
    p_desc.runs[0].font.size = Pt(8.5)

    # 1. Key Vocabulary Word Bank
    h_wb = doc.add_heading("1. KEY VOCABULARY WORD BANK (Stage 1: Warm-up & Modeling)", level=2)
    h_wb.runs[0].font.color.rgb = RGBColor(30, 41, 59)
    h_wb.runs[0].font.size = Pt(11)

    words = p1.get("wordBank", [])
    wb_table = doc.add_table(rows=2, cols=3)
    wb_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    for idx, w in enumerate(words[:6]):
        r_idx = idx // 3
        c_idx = idx % 3
        cell = wb_table.rows[r_idx].cells[c_idx]
        cell.width = Inches(2.4)
        p = cell.paragraphs[0]
        r_w = p.add_run(w.get("word", "") + " ")
        r_w.bold = True
        r_w.font.size = Pt(9.5)
        r_p = p.add_run(f"({w.get('pos', 'noun')})\n")
        r_p.italic = True
        r_p.font.size = Pt(7.5)
        r_p.font.color.rgb = RGBColor(100, 116, 139)
        r_ex = p.add_run(f"\"{w.get('example', '')}\"")
        r_ex.font.size = Pt(8)
        r_ex.font.color.rgb = RGBColor(51, 65, 85)
        set_cell_background(cell, "FFFFFF")
        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)

    doc.add_paragraph()

    # 2. Communicative Language Frame
    h_lf = doc.add_heading("COMMUNICATIVE LANGUAGE FRAME (Target Structure)", level=2)
    h_lf.runs[0].font.color.rgb = RGBColor(67, 56, 202)
    h_lf.runs[0].font.size = Pt(10)

    lf = p1.get("languageFrame", {})
    lf_table = doc.add_table(rows=1, cols=1)
    lf_cell = lf_table.rows[0].cells[0]
    set_cell_background(lf_cell, "EEF2FF")
    set_cell_margins(lf_cell, top=100, bottom=100, left=150, right=150)
    p_lf = lf_cell.paragraphs[0]
    r_q = p_lf.add_run("Target Question: ")
    r_q.bold = True
    p_lf.add_run(f"\"{lf.get('question', 'How much is the pineapple?')}\"\n")
    r_a = p_lf.add_run("Target Response: ")
    r_a.bold = True
    p_lf.add_run(f"\"{lf.get('answer', 'It is three dollars.')}\"\n")
    r_e = p_lf.add_run("Roleplay Exchange: ")
    r_e.bold = True
    r_e.italic = True
    p_lf.add_run(f"\"{lf.get('exchange', 'Can I have one? Yes, here you go!')}\"")

    doc.add_paragraph()

    # 3. Activity 1: Listen & Circle
    act1 = p1.get("activity1", {})
    h_act1 = doc.add_heading("2. " + act1.get("title", "ACTIVITY 1: LISTEN & CIRCLE"), level=2)
    h_act1.runs[0].font.size = Pt(11)
    doc.add_paragraph(act1.get("instruction", "Listen carefully to the teacher and circle each word you hear:"))

    act1_words = act1.get("words", [w.get("word") for w in words])
    c_table = doc.add_table(rows=1, cols=len(act1_words[:6]))
    for wi, word in enumerate(act1_words[:6]):
        c_cell = c_table.rows[0].cells[wi]
        p_c = c_cell.paragraphs[0]
        p_c.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r_circ = p_c.add_run(f"[  ]  {word}")
        r_circ.bold = True
        set_cell_background(c_cell, "F8FAFC")
        set_cell_margins(c_cell, top=100, bottom=100, left=50, right=50)

    # ═════════════════════════════════════════════════════════
    # PAGE 2: GUIDED PRACTICE & PERFORMANCE TASK
    # ═════════════════════════════════════════════════════════
    doc.add_page_break()

    # Activity 2: Listen & Match
    act2 = p2.get("activity2", {})
    h_act2 = doc.add_heading("3. " + act2.get("title", "ACTIVITY 2: LISTEN & MATCH"), level=2)
    h_act2.runs[0].font.size = Pt(11)
    doc.add_paragraph(act2.get("instruction", "Listen and draw lines to match items with their prices:"))

    pairs = act2.get("pairs", [])
    m_table = doc.add_table(rows=len(pairs[:4]), cols=3)
    for pi, pair in enumerate(pairs[:4]):
        row = m_table.rows[pi]
        row.cells[0].paragraphs[0].add_run(f"[ • ]  {pair.get('item', '')}").bold = True
        row.cells[1].paragraphs[0].add_run("· · · · · · · · · · · · · · · · · · · ·")
        row.cells[1].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
        row.cells[2].paragraphs[0].add_run(f"{pair.get('detail', '')}  [ • ]").bold = True
        row.cells[2].paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.RIGHT
        for c in row.cells:
            set_cell_margins(c, top=60, bottom=60, left=100, right=100)

    doc.add_paragraph()

    # Activity 3: Authentic Dialogue Cloze
    act3 = p2.get("activity3", {})
    h_act3 = doc.add_heading("4. " + act3.get("title", "ACTIVITY 3: AUTHENTIC DIALOGUE CLOZE"), level=2)
    h_act3.runs[0].font.size = Pt(11)
    doc.add_paragraph(act3.get("instruction", "Complete the dialogue with the correct words from the Word Bank:"))

    dialogue = act3.get("dialogue", [])
    d_table = doc.add_table(rows=len(dialogue[:8]), cols=2)
    for di, d in enumerate(dialogue[:8]):
        row = d_table.rows[di]
        row.cells[0].width = Inches(1.3)
        row.cells[1].width = Inches(5.9)
        r_spk = row.cells[0].paragraphs[0].add_run(d.get("speaker", "") + ":")
        r_spk.bold = True
        if d.get("speaker", "").lower() == "seller":
            r_spk.font.color.rgb = RGBColor(67, 56, 202)
        row.cells[1].paragraphs[0].add_run(d.get("text", ""))
        for c in row.cells:
            set_cell_margins(c, top=40, bottom=40, left=60, right=60)

    doc.add_paragraph()

    # Activity 4: Performance Task
    act4 = p2.get("activity4", {})
    h_act4 = doc.add_heading("5. " + act4.get("title", "ACTIVITY 4: PERFORMANCE TASK"), level=2)
    h_act4.runs[0].font.size = Pt(11)
    doc.add_paragraph(act4.get("instruction", "Draw 3 items on your market shelf and write their price tags in English ($USD):"))

    draw_table = doc.add_table(rows=1, cols=1)
    d_cell = draw_table.rows[0].cells[0]
    set_cell_background(d_cell, "FAFAFA")
    set_cell_margins(d_cell, top=800, bottom=800, left=200, right=200)
    p_draw = d_cell.paragraphs[0]
    p_draw.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_dr = p_draw.add_run("[ PERFORMANCE DRAWING & WRITING CANVAS ]\n(Draw market produce and tag each with authentic price)")
    r_dr.font.color.rgb = RGBColor(148, 163, 184)
    r_dr.italic = True

    # ═════════════════════════════════════════════════════════
    # PAGE 3: TEACHER'S ASSESSMENT GUIDE & RUBRIC
    # ═════════════════════════════════════════════════════════
    doc.add_page_break()

    tg = p3.get("teacherGuide", {})
    h_tg = doc.add_heading(tg.get("title", "TEACHER'S FACILITATION GUIDE & AUDIO SCRIPT"), level=2)
    h_tg.runs[0].font.size = Pt(12)
    doc.add_paragraph("Stage-by-stage auditory script for classroom execution:")

    scripts = tg.get("script", [])
    sc_table = doc.add_table(rows=len(scripts), cols=2)
    for si, s in enumerate(scripts):
        row = sc_table.rows[si]
        row.cells[0].width = Inches(2.0)
        row.cells[1].width = Inches(5.2)
        row.cells[0].paragraphs[0].add_run(s.get("stage", "")).bold = True
        row.cells[1].paragraphs[0].add_run(s.get("script", ""))
        set_cell_background(row.cells[0], "F8FAFC")
        for c in row.cells:
            set_cell_margins(c, top=50, bottom=50, left=80, right=80)

    doc.add_paragraph()

    # Rubric Table
    h_rub = doc.add_heading("FORMATIVE EVALUATION RUBRIC (MEDUCA AOA Standards)", level=2)
    h_rub.runs[0].font.size = Pt(11)

    rubric = tg.get("rubric", [])
    rub_table = doc.add_table(rows=len(rubric) + 1, cols=4)
    rub_headers = ["Criterion", "Independent (3 pts)", "With Support (2 pts)", "Emerging (1 pt)"]
    for hi, h_text in enumerate(rub_headers):
        cell = rub_table.rows[0].cells[hi]
        cell.paragraphs[0].add_run(h_text).bold = True
        set_cell_background(cell, "E2E8F0")
        set_cell_margins(cell, top=60, bottom=60, left=80, right=80)

    for ri, r in enumerate(rubric):
        row = rub_table.rows[ri + 1]
        row.cells[0].paragraphs[0].add_run(r.get("criterion", "")).bold = True
        row.cells[1].paragraphs[0].add_run(r.get("independent", ""))
        row.cells[2].paragraphs[0].add_run(r.get("withSupport", ""))
        row.cells[3].paragraphs[0].add_run(r.get("emerging", ""))
        for c in row.cells:
            set_cell_margins(c, top=50, bottom=50, left=70, right=70)

    doc.add_paragraph()

    # Teacher Observation Line
    doc.add_heading("Teacher Observation & Student Support Notes:", level=3)
    p_notes = doc.add_paragraph()
    p_notes.add_run("_________________________________________________________________________________\n\n_________________________________________________________________________________")
    p_notes.runs[0].font.color.rgb = RGBColor(148, 163, 184)

    doc.save(output_path)
    print(f"[python-docx] Documento Word generado con éxito en: {output_path}")


# ─────────────────────────────────────────────────────────────
# CLI ENTRY POINT
# ─────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Generador de Cuadernos Pedagógicos en PDF (ReportLab) y Word (python-docx) para EduGen Panama.")
    parser.add_argument("--input", "-i", help="Ruta al archivo JSON con el activity pack estructurado.")
    parser.add_argument("--pdf", "-p", help="Ruta de salida para el archivo PDF (ReportLab).")
    parser.add_argument("--docx", "-d", help="Ruta de salida para el archivo DOCX (python-docx).")
    args = parser.parse_args()

    pack = get_sample_pack()
    if args.input:
        with open(args.input, "r", encoding="utf-8") as f:
            pack = json.load(f)

    pdf_out = args.pdf or os.path.join(os.getcwd(), "public", "actividades_reportlab.pdf")
    docx_out = args.docx or os.path.join(os.getcwd(), "public", "actividades_word.docx")

    os.makedirs(os.path.dirname(os.path.abspath(pdf_out)), exist_ok=True)
    os.makedirs(os.path.dirname(os.path.abspath(docx_out)), exist_ok=True)

    print("[EduGen Panama] Generando Cuaderno Pedagógico...")
    generate_pdf(pack, pdf_out)
    generate_docx(pack, docx_out)
    print("¡Proceso completado exitosamente!")


if __name__ == "__main__":
    main()
