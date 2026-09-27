from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image as RLImage
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os

OUT_PDF = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\Student_Reading_Lab_4thGrade_Shopping_Market.pdf"

# Fonts
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

styles = getSampleStyleSheet()

styles.add(ParagraphStyle(name="DocHeaderTitle", fontName=bold, fontSize=16, leading=20, textColor=c_navy, alignment=TA_CENTER, spaceAfter=2))
styles.add(ParagraphStyle(name="DocHeaderSub", fontName=font, fontSize=8.5, leading=11.5, textColor=c_muted, alignment=TA_CENTER, spaceAfter=4))

styles.add(ParagraphStyle(name="StageBanner", fontName=bold, fontSize=9.5, leading=12.5, textColor=colors.white, alignment=TA_LEFT))
styles.add(ParagraphStyle(name="InstructionText", fontName=font, fontSize=8.2, leading=11, textColor=c_dark, spaceAfter=3))
styles.add(ParagraphStyle(name="BoldText", fontName=bold, fontSize=8.5, leading=11, textColor=c_navy))
styles.add(ParagraphStyle(name="CenterText", fontName=font, fontSize=8, leading=10, textColor=c_dark, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="CenterBold", fontName=bold, fontSize=8.5, leading=11, textColor=c_navy, alignment=TA_CENTER))

styles.add(ParagraphStyle(name="DialogueLine", fontName=font, fontSize=8.2, leading=11.5, textColor=c_dark))
styles.add(ParagraphStyle(name="PriceTag", fontName=bold, fontSize=10, leading=13, textColor=c_green, alignment=TA_CENTER))

def P(txt, s="InstructionText"):
    return Paragraph(txt, styles[s])

def img_or_txt(name, w=46, h=46):
    paths = [
        os.path.join(r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public\assets\nouns", f"{name}.png"),
        os.path.join(r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public\assets\nouns", f"{name}s.png"),
        os.path.join(r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public\assets\nouns", f"{name}.jpg")
    ]
    for p in paths:
        if os.path.exists(p):
            return RLImage(p, width=w, height=h)
    return P(f"[{name.upper()}]", "CenterBold")

doc = SimpleDocTemplate(
    OUT_PDF,
    pagesize=letter,
    leftMargin=26,
    rightMargin=26,
    topMargin=22,
    bottomMargin=22
)

story = []

# =========================================================================
# PAGE 1: STAGE 1 (WARM-UP & DECODING) & STAGE 2 (MARKET PRICE LIST PRESENTATION)
# =========================================================================

# Top Institutional Header
header_data = [
    [
        P("<b>REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)</b><br/>"
          "<b>AOA Action Learning Lab: \"Shopping at the Market\"</b>", "DocHeaderTitle"),
        P("<b>Lesson #2 · 45-60 min</b><br/>"
          "Skill: <b>READING</b><br/>"
          "Grade: <b>4th Grade (CEFR A1.2)</b>", "CenterBold")
    ]
]
t_head = Table(header_data, colWidths=[420, 140])
t_head.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ('TOPPADDING', (0,0), (-1,-1), 0),
    ('LEFTPADDING', (0,0), (-1,-1), 0),
    ('RIGHTPADDING', (0,0), (-1,-1), 0),
]))
story.append(t_head)

story.append(P("Theme 1: <i>\"How Much Is the Pineapple?\"</i> · Authentic Price List Reading, Sentence Cloze & Clerk Role-Play", "DocHeaderSub"))

# Student info strip
info_data = [
    [P("<b>Student Name:</b> ___________________________", "BoldText"),
     P("<b>Date:</b> _____________", "BoldText"),
     P("<b>Reading Score:</b> [  ] Independent  [  ] Guided  [  ] Emerging", "BoldText")]
]
t_info = Table(info_data, colWidths=[270, 110, 180])
t_info.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
    ('BOX', (0,0), (-1,-1), 0.75, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_info)
story.append(Spacer(1, 5))

# --- STAGE 1: WARM-UP & MODELING ---
stage1_banner = Table([[P("<b>STAGE 1: WARM-UP & DECODING MODEL (Engagement & Price Tags)</b>", "StageBanner")]], colWidths=[560])
stage1_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_navy),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage1_banner)
story.append(Spacer(1, 3))

story.append(P("<b>Visual Decoding Review:</b> Look at the fruit flashcards and read the printed names aloud with your teacher: <i>pineapple, apples, bananas, oranges, mangoes</i>.", "InstructionText"))

# 5 Target Fruits Flashcards Grid
fruit_cells = [
    [
        img_or_txt("pineapple", 44, 44),
        img_or_txt("apple", 44, 44),
        img_or_txt("banana", 44, 44),
        img_or_txt("orange", 44, 44),
        img_or_txt("mango", 44, 44)
    ],
    [
        P("<b>PINEAPPLE</b><br/><font color='#059669'>Read: /paɪnæp.əl/</font>", "CenterText"),
        P("<b>APPLES</b><br/><font color='#059669'>Read: /ˈæp.əlz/</font>", "CenterText"),
        P("<b>BANANAS</b><br/><font color='#059669'>Read: /bəˈnæn.əz/</font>", "CenterText"),
        P("<b>ORANGES</b><br/><font color='#059669'>Read: /ˈɒr.ɪndʒ.ɪz/</font>", "CenterText"),
        P("<b>MANGOES</b><br/><font color='#059669'>Read: /ˈmæŋ.ɡoʊz/</font>", "CenterText")
    ]
]
t_fruits = Table(fruit_cells, colWidths=[112]*5)
t_fruits.setStyle(TableStyle([
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BACKGROUND', (0,0), (-1,-1), colors.white),
    ('BOX', (0,0), (-1,-1), 0.5, c_border),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 2),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_fruits)
story.append(Spacer(1, 4))

# CCQs for Reading
ccq_data = [
    [
        P("<b>Reading Verification Questions (CCQs):</b><br/>"
          "1. <i>Teacher points to pineapple card:</i> \"Is this a pineapple?\" ──> <b>Student reads & verifies:</b> \"Yes, it is a pineapple!\"<br/>"
          "2. <i>Teacher points to price tag on sign:</i> \"What is the price of apples on the sign?\" ──> <b>Student reads:</b> \"One dollar ($1.00).\"", "InstructionText")
    ]
]
t_ccq = Table(ccq_data, colWidths=[560])
t_ccq.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_blue_bg),
    ('BOX', (0,0), (-1,-1), 1, c_blue_border),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(t_ccq)
story.append(Spacer(1, 6))

# --- STAGE 2: PRESENTATION (AUTHENTIC MARKET PRICE LIST TEXT) ---
stage2_banner = Table([[P("<b>STAGE 2: PRESENTATION (Authentic Reading Text · \"Market Price List\")</b>", "StageBanner")]], colWidths=[560])
stage2_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_teal),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage2_banner)
story.append(Spacer(1, 3))

story.append(P("<b>Read the Authentic Market Price List Text Carefully:</b>", "InstructionText"))

# Market Price List Poster Box
poster_rows = [
    [
        P("<b>PANAMA FRESH MARKET · OFFICIAL PRICE LIST</b><br/><i>Factual Informational Text · Grade 4 Reading Hub</i>", "CenterBold"),
        P("<b>ITEM IMAGE</b>", "CenterBold")
    ],
    [
        P("&bull; <b>Pineapple:</b> $2.00 each<br/>"
          "&bull; <b>Apples:</b> $1.00 per pound<br/>"
          "&bull; <b>Bananas:</b> $0.50 each (Fifty cents)<br/>"
          "&bull; <b>Oranges:</b> $0.75 each (Seventy-five cents)<br/>"
          "&bull; <b>Mangoes:</b> $1.50 each", "DialogueLine"),
        img_or_txt("market", 60, 60)
    ]
]
t_poster = Table(poster_rows, colWidths=[420, 140])
t_poster.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_gold_bg),
    ('BOX', (0,0), (-1,-1), 1.5, c_gold_border),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_gold_border),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
]))
story.append(t_poster)
story.append(Spacer(1, 4))

# Reading Comprehension Gist Check
comp_data = [
    [
        P("<b>Comprehension Check 2.1 (Gist):</b> What is this text about?<br/>"
          "[  ] A. Animals in the forest &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [  ] B. Prices and food at the market (Correct!) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [  ] C. Weather forecast", "InstructionText")
    ],
    [
        P("<b>Comprehension Check 2.2 (Specific Detail):</b> How much is one pineapple? ──> <b>Answer:</b> $ [ ______ ]<br/>"
          "Which item is the cheapest on the list? ──> ( Circle: <b>Bananas ($0.50)</b> / <b>Mangoes ($1.50)</b> )", "InstructionText")
    ]
]
t_comp = Table(comp_data, colWidths=[560])
t_comp.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.white),
    ('BOX', (0,0), (-1,-1), 0.5, c_border),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_comp)

# Page 1 Footer
story.append(Spacer(1, 6))
story.append(P("EduGen Panama · MEDUCA Curriculum · Grade 4 (CEFR A1.2) · Lesson #2 (Reading) · Page 1 of 3", "CenterText"))
story.append(PageBreak())

# =========================================================================
# PAGE 2: STAGE 3 (PREPARATION / PRACTICE - 3 READING ACTIVITIES)
# =========================================================================

p2_header = [
    [
        P("<b>PAGE 2 · STAGE 3: PREPARATION & PRACTICE (Focus on Reading Accuracy)</b>", "BoldText"),
        P("<b>4th Grade · Lesson 2 (Reading)</b>", "RightText" if "RightText" in styles else "BoldText")
    ]
]
t_p2_h = Table(p2_header, colWidths=[400, 160])
t_p2_h.setStyle(TableStyle([
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ('LINEBELOW', (0,0), (-1,-1), 1, c_navy),
]))
story.append(t_p2_h)
story.append(Spacer(1, 4))

# Activity 3.1: Read and Match
story.append(P("<b>Activity 3.1 · Read and Match:</b> Read the Market Price List from Page 1. Draw a line from each fruit photo to its correct printed price tag:", "InstructionText"))

match_rows = [
    [
        img_or_txt("pineapple", 36, 36),
        P("<b>1. Pineapple</b><br/>Read: <i>\"Pineapple: $2.00 each\"</i>", "DialogueLine"),
        P("<b>───►</b>", "CenterBold"),
        P("<b>[ $0.50 each ]</b><br/>Fifty cents", "CenterBold")
    ],
    [
        img_or_txt("apple", 36, 36),
        P("<b>2. Apples</b><br/>Read: <i>\"Apples: $1.00 per pound\"</i>", "DialogueLine"),
        P("<b>───►</b>", "CenterBold"),
        P("<b>[ $0.75 each ]</b><br/>Seventy-five cents", "CenterBold")
    ],
    [
        img_or_txt("banana", 36, 36),
        P("<b>3. Bananas</b><br/>Read: <i>\"Bananas: $0.50 each\"</i>", "DialogueLine"),
        P("<b>───►</b>", "CenterBold"),
        P("<b>[ $1.00 / lb ]</b><br/>One dollar", "CenterBold")
    ],
    [
        img_or_txt("orange", 36, 36),
        P("<b>4. Oranges</b><br/>Read: <i>\"Oranges: $0.75 each\"</i>", "DialogueLine"),
        P("<b>───►</b>", "CenterBold"),
        P("<b>[ $1.50 each ]</b><br/>One dollar fifty", "CenterBold")
    ],
    [
        img_or_txt("mango", 36, 36),
        P("<b>5. Mangoes</b><br/>Read: <i>\"Mangoes: $1.50 each\"</i>", "DialogueLine"),
        P("<b>───►</b>", "CenterBold"),
        P("<b>[ $2.00 each ]</b><br/>Two dollars", "CenterBold")
    ]
]
t_match = Table(match_rows, colWidths=[45, 235, 50, 230])
t_match.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BACKGROUND', (0,0), (-1,-1), colors.white),
    ('BOX', (0,0), (-1,-1), 0.75, c_teal),
    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
    ('TOPPADDING', (0,0), (-1,-1), 2),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
]))
story.append(t_match)
story.append(Spacer(1, 5))

# Activity 3.2: Sentence Completion with Word Bank
story.append(P("<b>Activity 3.2 · Sentence Completion (Cloze Reading):</b> Read the sentences below. Fill in the blanks with the correct word from the Word Bank:", "InstructionText"))

cloze_wb = [
    [P("<b>WORD BANK:</b> &nbsp;&nbsp;&nbsp;&nbsp; [  <b>pineapple</b>  ] &nbsp;&nbsp;&bull;&nbsp;&nbsp; [  <b>dollar</b>  ] &nbsp;&nbsp;&bull;&nbsp;&nbsp; [  <b>cents</b>  ] &nbsp;&nbsp;&bull;&nbsp;&nbsp; [  <b>bananas</b>  ] &nbsp;&nbsp;&bull;&nbsp;&nbsp; [  <b>apples</b>  ]", "CenterBold")]
]
t_cloze_wb = Table(cloze_wb, colWidths=[560])
t_cloze_wb.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
    ('BOX', (0,0), (-1,-1), 0.75, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
]))
story.append(t_cloze_wb)
story.append(Spacer(1, 3))

cloze_sentences = [
    [P("1. The ______________________ costs two dollars each ($2.00).", "InstructionText")],
    [P("2. Apples cost one ______________________ per pound ($1.00).", "InstructionText")],
    [P("3. The price of one banana is fifty ______________________ ($0.50).", "InstructionText")],
    [P("4. Four ______________________ cost two dollars in total.", "InstructionText")]
]
t_cloze = Table(cloze_sentences, colWidths=[560])
t_cloze.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.white),
    ('BOX', (0,0), (-1,-1), 0.5, c_border),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_cloze)
story.append(Spacer(1, 5))

# Activity 3.3: Guided Question Answering (Short Written Responses)
story.append(P("<b>Activity 3.3 · Guided Reading Questions (Write Short Answers):</b>", "InstructionText"))

q_answering = [
    [
        P("1. <b>How much is one banana?</b><br/>"
          "Write short response: <i>One banana is</i> ________________________________________.", "DialogueLine")
    ],
    [
        P("2. <b>What is the price of oranges per item?</b><br/>"
          "Write short response: <i>Oranges are</i> __________________________________________.", "DialogueLine")
    ],
    [
        P("3. <b>How much do two pounds of apples cost?</b> ($1.00 + $1.00 = ?)<br/>"
          "Write short response: <i>Two pounds of apples cost</i> _____________________________.", "DialogueLine")
    ]
]
t_qa = Table(q_answering, colWidths=[560])
t_qa.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
    ('BOX', (0,0), (-1,-1), 0.75, c_teal),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_qa)

# Page 2 Footer
story.append(Spacer(1, 6))
story.append(P("EduGen Panama · MEDUCA Curriculum · Grade 4 (CEFR A1.2) · Lesson #2 (Reading) · Page 2 of 3", "CenterText"))
story.append(PageBreak())

# =========================================================================
# PAGE 3: STAGE 4 (ACTION TASK), STAGE 5 (ASSESSMENT), & STAGE 6 (REFLECTION)
# =========================================================================

p3_header = [
    [
        P("<b>PAGE 3 · PERFORMANCE TASK, EXIT TICKET & REFLECTION</b>", "BoldText"),
        P("<b>Stage 4, 5 & 6 (Reading)</b>", "RightText" if "RightText" in styles else "BoldText")
    ]
]
t_p3_h = Table(p3_header, colWidths=[420, 140])
t_p3_h.setStyle(TableStyle([
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ('LINEBELOW', (0,0), (-1,-1), 1, c_navy),
]))
story.append(t_p3_h)
story.append(Spacer(1, 4))

# --- STAGE 4: ACTION TASK: "MY SHOPPING LIST READING" ---
stage4_banner = Table([[P("<b>STAGE 4: PERFORMANCE · \"MY SHOPPING LIST READING\" (Action Task in Pairs)</b>", "StageBanner")]], colWidths=[560])
stage4_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_amber),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage4_banner)
story.append(Spacer(1, 3))

story.append(P("<b>Pair Action Reading Challenge:</b> Work in pairs. Student A is the <b>Customer</b> with a shopping list; Student B is the <b>Clerk</b> who reads the official price list aloud:", "InstructionText"))

# Role Cards Table
stall_template = [
    [
        P("<b>CUSTOMER CARD (Student A)</b><br/>"
          "<i>Read your list item by item:</i><br/>"
          "1. \"I need <b>one pineapple</b>, please.\"<br/>"
          "2. \"I need <b>two apples</b>.\"<br/>"
          "3. \"I need <b>three bananas</b>.\"<br/>"
          "4. \"Thank you! What is the total?\"", "InstructionText"),
        P("<b>CLERK CARD (Student B)</b><br/>"
          "<i>Read the official price list & answer:</i><br/>"
          "1. \"A pineapple is <b>$2.00</b>.\"<br/>"
          "2. \"Apples are <b>$1.00</b> per pound.\"<br/>"
          "3. \"Bananas are <b>$0.50</b> each ($1.50 for 3).\"<br/>"
          "4. \"The total is <b>$4.50</b>. Thank you!\"", "InstructionText")
    ]
]
t_stall = Table(stall_template, colWidths=[280, 280])
t_stall.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (0,0), c_card_bg),
    ('BACKGROUND', (1,0), (1,0), c_gold_bg),
    ('BOX', (0,0), (-1,-1), 1, c_border),
    ('INNERGRID', (0,0), (-1,-1), 1, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_stall)
story.append(Spacer(1, 5))

# --- STAGE 5: ASSESSMENT EXIT TICKET: "TODAY'S SPECIAL" ---
stage5_banner = Table([[P("<b>STAGE 5: FORMATIVE ASSESSMENT · \"MARKET STAND SIGN: TODAY'S SPECIAL\" (Exit Ticket)</b>", "StageBanner")]], colWidths=[560])
stage5_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_green),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage5_banner)
story.append(Spacer(1, 3))

# New Sign for assessment
sign_data = [
    [
        P("<b>TODAY'S SPECIAL MARKET STAND SIGN:</b><br/>"
          "&bull; <b>Mangoes:</b> $1.50 each &nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;&nbsp; "
          "&bull; <b>Oranges:</b> $0.75 each &nbsp;&nbsp;&nbsp;&nbsp;&bull;&nbsp;&nbsp;&nbsp;&nbsp; "
          "&bull; <b>Fresh Pineapple:</b> $2.00 each", "CenterBold")
    ]
]
t_sign = Table(sign_data, colWidths=[560])
t_sign.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_green_bg),
    ('BOX', (0,0), (-1,-1), 1, c_green),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
]))
story.append(t_sign)
story.append(Spacer(1, 3))

quiz_table = [
    [
        P("<b>Question 1:</b> How much is one mango according to Today's Special?<br/>"
          "Write short response: <i>One mango is</i> ________________________________________.", "DialogueLine"),
        P("<b>Evaluation Criteria:</b><br/>"
          "[  ] Accurate price location<br/>"
          "[  ] Clear written response", "InstructionText")
    ],
    [
        P("<b>Question 2:</b> What is the price of an orange on Today's Special?<br/>"
          "Write short response: <i>An orange is</i> ________________________________________.", "DialogueLine"),
        P("<b>Score:</b> ___ / 3 points<br/>"
          "Status: <b>Pass</b> [  ]", "BoldText")
    ],
    [
        P("<b>Question 3:</b> \"The fresh pineapple is three dollars ($3.00).\"<br/>"
          "Evaluate from the sign: [  ] TRUE (YES) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [  ] FALSE (NO - It is $2.00)", "DialogueLine"),
        P("<b>Teacher Feedback:</b><br/>"
          "_______________________________", "InstructionText")
    ]
]
t_quiz = Table(quiz_table, colWidths=[360, 200])
t_quiz.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.white),
    ('BOX', (0,0), (-1,-1), 0.75, c_green),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_quiz)
story.append(Spacer(1, 5))

# --- STAGE 6: SELF-REFLECTION & HOMEWORK ---
stage6_banner = Table([[P("<b>STAGE 6: STUDENT REFLECTION & HOMEWORK (Metacognition)</b>", "StageBanner")]], colWidths=[560])
stage6_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_navy),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage6_banner)
story.append(Spacer(1, 3))

refl_data = [
    [
        P("<b>Student Self-Reflection:</b><br/>"
          "1. What new words about the market did you read today?<br/>"
          "&nbsp;&nbsp;&nbsp;&nbsp;__________________________________________________________________________________<br/>"
          "2. Was it easy or difficult to find the prices in the text? Why?<br/>"
          "&nbsp;&nbsp;&nbsp;&nbsp;__________________________________________________________________________________<br/>"
          "3. What do you want to learn next about shopping at the market?", "InstructionText"),
        P("<b>Homework Assignment:</b><br/>"
          "1. Read a simple price list at home and write prices under 3 fruit pictures.<br/>"
          "2. Draw one more market item and write its price from memory!<br/>"
          "<b>Next Lesson Preview:</b><br/>"
          "<i>\"Next time, we will TALK and ask 'How much is the pineapple?' (Speaking)!\"</i>", "InstructionText")
    ]
]
t_refl = Table(refl_data, colWidths=[330, 230])
t_refl.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
    ('BOX', (0,0), (-1,-1), 0.75, c_border),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_refl)

# Final Footer
story.append(Spacer(1, 5))
story.append(P("EduGen Panama · MEDUCA Curriculum · Grade 4 (CEFR A1.2) · Lesson #2 (Reading) · Page 3 of 3", "CenterText"))

doc.build(story)
print(f"Reading Student Lab PDF created successfully at: {OUT_PDF}")
