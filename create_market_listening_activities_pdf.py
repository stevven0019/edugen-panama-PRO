from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Image as RLImage
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os

OUT_PDF = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\Student_Listening_Lab_4thGrade_Shopping_Market.pdf"

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
styles.add(ParagraphStyle(name="WhiteCenter", fontName=bold, fontSize=8.5, leading=11, textColor=colors.white, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="WhiteHeader", fontName=bold, fontSize=8.5, leading=11, textColor=colors.white, alignment=TA_CENTER))

styles.add(ParagraphStyle(name="DialogueLine", fontName=font, fontSize=8.2, leading=11.5, textColor=c_dark))
styles.add(ParagraphStyle(name="SpeakerLabel", fontName=bold, fontSize=8.2, leading=11.5, textColor=c_navy))

styles.add(ParagraphStyle(name="GameTag", fontName=bold, fontSize=9, leading=12, textColor=colors.HexColor("#B45309")))
styles.add(ParagraphStyle(name="GameRule", fontName=font, fontSize=8, leading=11, textColor=colors.HexColor("#78350F")))

def P(txt, s="InstructionText"):
    return Paragraph(txt, styles[s])

def img_or_txt(name, w=48, h=48):
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
# PAGE 1: STAGE 1 (WARM-UP / FLASHCARDS) & STAGE 2 (AUDIO DIALOGUE PRESENTATION)
# =========================================================================

# Top Institutional Header
header_data = [
    [
        P("<b>REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)</b><br/>"
          "<b>AOA Action Learning Lab: \"Shopping at the Market\"</b>", "DocHeaderTitle"),
        P("<b>Lesson #1 · 45-60 min</b><br/>"
          "Skill: <b>LISTENING</b><br/>"
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

story.append(P("Theme 1: <i>\"How Much Is the Pineapple?\"</i> · Receptive Auditory Input, Sound Modeling & Gist/Detail Tasks", "DocHeaderSub"))

# Student info strip
info_data = [
    [P("<b>Student Name:</b> ___________________________", "BoldText"),
     P("<b>Date:</b> _____________", "BoldText"),
     P("<b>Listening Score:</b> [  ] Excellent  [  ] Good  [  ] Practice", "BoldText")]
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
stage1_banner = Table([[P("<b>STAGE 1: WARM-UP & MODELING (Engagement & Clarification)</b>", "StageBanner")]], colWidths=[560])
stage1_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_navy),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage1_banner)
story.append(Spacer(1, 3))

story.append(P("<b>Teacher Audio Script & Modeling:</b> The teacher shows the market items and pronounces target vocabulary clearly: <i>pineapple, apple, banana, mango, watermelon, market, how much, dollar, please, thank you</i>.", "InstructionText"))

# 5 Target Fruits Flashcards Grid
fruit_cells = [
    [
        img_or_txt("pineapple", 44, 44),
        img_or_txt("apple", 44, 44),
        img_or_txt("banana", 44, 44),
        img_or_txt("mango", 44, 44),
        img_or_txt("watermelon", 44, 44)
    ],
    [
        P("<b>1. PINEAPPLE</b><br/><font color='#059669'>\"Pineapple\"</font>", "CenterText"),
        P("<b>2. APPLE</b><br/><font color='#059669'>\"Apples\"</font>", "CenterText"),
        P("<b>3. BANANA</b><br/><font color='#059669'>\"Banana\"</font>", "CenterText"),
        P("<b>4. MANGO</b><br/><font color='#059669'>\"Mango\"</font>", "CenterText"),
        P("<b>5. WATERMELON</b><br/><font color='#059669'>\"Watermelon\"</font>", "CenterText")
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

# CCQs (Concept Checking Questions) from lesson plan
ccq_data = [
    [
        P("<b>Auditory Concept Checking (CCQs):</b><br/>"
          "1. <i>Teacher points to apple:</i> \"Is this an apple or a banana?\" ──> <b>Student responds:</b> \"An apple!\"<br/>"
          "2. <i>Teacher mimes money:</i> \"Do we ask 'how much' for color or for price?\" ──> <b>Student responds:</b> \"For price!\"", "InstructionText")
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

# --- STAGE 2: PRESENTATION & COMPREHENSION ---
stage2_banner = Table([[P("<b>STAGE 2: PRESENTATION (Input: Authentic Audio Dialogue \"At the Market\")</b>", "StageBanner")]], colWidths=[560])
stage2_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_teal),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage2_banner)
story.append(Spacer(1, 3))

story.append(P("<b>Teacher Script:</b> Read aloud twice clearly and with voice acting (or play the recorded audio clip):", "InstructionText"))

dialogue_data = [
    [img_or_txt("cashier", 26, 26), P("<b>Seller:</b> Hello! Welcome to the <b>market</b>!", "DialogueLine")],
    [img_or_txt("market", 26, 26), P("<b>Buyer:</b> Hello! <b>How much</b> is the <b>pineapple</b>?", "DialogueLine")],
    [img_or_txt("cashier", 26, 26), P("<b>Seller:</b> It's three <b>dollars</b> ($3.00).", "DialogueLine")],
    [img_or_txt("market", 26, 26), P("<b>Buyer:</b> Okay. And the <b>apples</b>?", "DialogueLine")],
    [img_or_txt("cashier", 26, 26), P("<b>Seller:</b> They are one <b>dollar</b> each ($1.00).", "DialogueLine")],
    [img_or_txt("market", 26, 26), P("<b>Buyer:</b> Hmm. Can I have a <b>banana</b>, <b>please</b>?", "DialogueLine")],
    [img_or_txt("cashier", 26, 26), P("<b>Seller:</b> Yes, here you go.", "DialogueLine")],
    [img_or_txt("market", 26, 26), P("<b>Buyer:</b> <b>Thank you!</b>", "DialogueLine")]
]
t_diag = Table(dialogue_data, colWidths=[35, 525])
t_diag.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E2E8F0")),
    ('BOX', (0,0), (-1,-1), 0.75, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 1.5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 1.5),
    ('LEFTPADDING', (0,0), (-1,-1), 5),
]))
story.append(t_diag)
story.append(Spacer(1, 4))

# Comprehension Tasks (Gist & Specific Detail)
comp_data = [
    [
        P("<b>Task 2.1 · Gist Listening:</b> What is the general topic of the dialogue?<br/>"
          "[  ] A. Playing at the park &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [  ] B. Buying fruits at the market (Correct!) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [  ] C. School homework", "InstructionText")
    ],
    [
        P("<b>Task 2.2 · Specific Detail Check:</b> Did the buyer ask for an apple or a pineapple first? ──> <b>Answer:</b> [ ______________ ]<br/>"
          "Who said 'Thank you!' at the end? ──> ( Circle: <b>Buyer</b> / <b>Seller</b> )", "InstructionText")
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
story.append(P("EduGen Panama · MEDUCA Curriculum · Grade 4 (CEFR A1.2) · Lesson #1 (Listening) · Page 1 of 3", "CenterText"))
story.append(PageBreak())

# =========================================================================
# PAGE 2: STAGE 3 (PREPARATION / PRACTICE - 3 CONCRETE AUDITORY ACTIVITIES)
# =========================================================================

p2_header = [
    [
        P("<b>PAGE 2 · STAGE 3: PREPARATION & PRACTICE (Focus on Auditory Accuracy)</b>", "BoldText"),
        P("<b>4th Grade · Lesson 1 (Listening)</b>", "RightText" if "RightText" in styles else "BoldText")
    ]
]
t_p2_h = Table(p2_header, colWidths=[400, 160])
t_p2_h.setStyle(TableStyle([
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ('LINEBELOW', (0,0), (-1,-1), 1, c_navy),
]))
story.append(t_p2_h)
story.append(Spacer(1, 4))

# Activity 3.1: Listen and Circle
story.append(P("<b>Activity 3.1 · Listen & Circle:</b> Listen to the audio dialogue again. Circle ONLY the <b>6 words</b> you actually hear in the conversation:", "InstructionText"))

words_circle = [
    [
        P("[  ] 1. PINEAPPLE", "CenterBold"),
        P("[  ] 2. POTATOES", "CenterBold"),
        P("[  ] 3. BANANA", "CenterBold"),
        P("[  ] 4. BREAD", "CenterBold")
    ],
    [
        P("[  ] 5. HOW MUCH", "CenterBold"),
        P("[  ] 6. WATERMELON", "CenterBold"),
        P("[  ] 7. APPLES", "CenterBold"),
        P("[  ] 8. CARROT", "CenterBold")
    ],
    [
        P("[  ] 9. DOLLAR", "CenterBold"),
        P("[  ] 10. PLEASE", "CenterBold"),
        P("[  ] 11. CASSAVA", "CenterBold"),
        P("[  ] 12. MARKET", "CenterBold")
    ]
]
t_circle = Table(words_circle, colWidths=[140]*4)
t_circle.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
    ('BOX', (0,0), (-1,-1), 0.75, c_border),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))
story.append(t_circle)
story.append(Spacer(1, 5))

# Activity 3.2: Listen and Match (Fruit to Price Line Matching)
story.append(P("<b>Activity 3.2 · Listen & Match (Price Discrimination):</b> Your teacher will read each price statement. Draw a line from each fruit to its correct price card:", "InstructionText"))

match_rows = [
    [
        img_or_txt("pineapple", 36, 36),
        P("<b>1. Pineapple</b><br/><i>\"The pineapple is $3.\"</i>", "DialogueLine"),
        P("<b>───►</b>", "CenterBold"),
        P("<b>[ $1.00 ]</b><br/>One dollar", "CenterBold")
    ],
    [
        img_or_txt("apple", 36, 36),
        P("<b>2. Apples</b><br/><i>\"The apples are $1 each.\"</i>", "DialogueLine"),
        P("<b>───►</b>", "CenterBold"),
        P("<b>[ $2.00 ]</b><br/>Two dollars", "CenterBold")
    ],
    [
        img_or_txt("mango", 36, 36),
        P("<b>3. Mango</b><br/><i>\"The mango is $2.\"</i>", "DialogueLine"),
        P("<b>───►</b>", "CenterBold"),
        P("<b>[ $3.00 ]</b><br/>Three dollars", "CenterBold")
    ],
    [
        img_or_txt("watermelon", 36, 36),
        P("<b>4. Watermelon</b><br/><i>\"The watermelon is $5.\"</i>", "DialogueLine"),
        P("<b>───►</b>", "CenterBold"),
        P("<b>[ $4.00 ]</b><br/>Four dollars", "CenterBold")
    ],
    [
        img_or_txt("banana", 36, 36),
        P("<b>5. Banana</b><br/><i>\"The banana is $1.\"</i>", "DialogueLine"),
        P("<b>───►</b>", "CenterBold"),
        P("<b>[ $5.00 ]</b><br/>Five dollars", "CenterBold")
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

# Activity 3.3: Listen and Point & Say
story.append(P("<b>Activity 3.3 · Listen & Point (Auditory Speed Challenge):</b>", "InstructionText"))

speed_box = [
    [
        P("<b>Game Rules:</b> Teacher calls out words or phrases randomly (<i>\"watermelon!\" / \"three dollars!\" / \"how much!\"</i>).<br/>"
          "Students race to point to the correct picture card on their desks. Score 1 star for every correct instant point!", "GameRule")
    ]
]
t_speed = Table(speed_box, colWidths=[560])
t_speed.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_gold_bg),
    ('BOX', (0,0), (-1,-1), 1, c_gold_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(t_speed)

# Differentiation box from lesson plan
diff_box = [
    [
        P("<b>Differentiation Strategies (In-Class Support):</b><br/>"
          "&bull; <b>Struggling Learners:</b> Pre-match one example ($1 for apples) and play the audio segmented with pauses.<br/>"
          "&bull; <b>Advanced Learners:</b> Write the numerical price from memory without looking at options.", "InstructionText")
    ]
]
t_diff = Table(diff_box, colWidths=[560])
t_diff.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
    ('BOX', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
]))
story.append(Spacer(1, 4))
story.append(t_diff)

# Page 2 Footer
story.append(Spacer(1, 6))
story.append(P("EduGen Panama · MEDUCA Curriculum · Grade 4 (CEFR A1.2) · Lesson #1 (Listening) · Page 2 of 3", "CenterText"))
story.append(PageBreak())

# =========================================================================
# PAGE 3: STAGE 4 (ACTION TASK), STAGE 5 (ASSESSMENT), & STAGE 6 (REFLECTION)
# =========================================================================

p3_header = [
    [
        P("<b>PAGE 3 · PERFORMANCE TASK, QUIZ ASSESSMENT & SELF-REFLECTION</b>", "BoldText"),
        P("<b>Stage 4, 5 & 6</b>", "RightText" if "RightText" in styles else "BoldText")
    ]
]
t_p3_h = Table(p3_header, colWidths=[420, 140])
t_p3_h.setStyle(TableStyle([
    ('BOTTOMPADDING', (0,0), (-1,-1), 2),
    ('LINEBELOW', (0,0), (-1,-1), 1, c_navy),
]))
story.append(t_p3_h)
story.append(Spacer(1, 4))

# --- STAGE 4: ACTION TASK: "SHOPPING LIST DRAWING" ---
stage4_banner = Table([[P("<b>STAGE 4: PERFORMANCE · \"SHOPPING LIST DRAWING\" (Action Task)</b>", "StageBanner")]], colWidths=[560])
stage4_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_amber),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage4_banner)
story.append(Spacer(1, 3))

story.append(P("<b>Auditory Action Mission:</b> Pretend you are listening to a friend dictating a market shopping list. Listen carefully and draw the items inside your market stall template, writing the price you hear next to each:", "InstructionText"))

# Teacher dictation script displayed for reference + Drawing Box
stall_template = [
    [
        P("<b>Dictation Script Spoken by Teacher:</b><br/>"
          "1. <i>\"At the market, please buy <b>one pineapple</b>. It costs <b>three dollars</b>.\"</i><br/>"
          "2. <i>\"Also, buy <b>two apples</b>. They are <b>one dollar</b> each.\"</i><br/>"
          "3. <i>\"And <b>one mango</b>. It's <b>two dollars</b>.\"</i><br/>"
          "4. <i>\"Finally, <b>a banana</b>. Thank you!\"</i>", "InstructionText"),
        P("<b>MY MARKET STALL DRAWING TEMPLATE</b><br/><br/>"
          "[ Draw Fruit 1 + Price: $ ____ ]<br/><br/>"
          "[ Draw Fruit 2 + Price: $ ____ ]<br/><br/>"
          "[ Draw Fruit 3 + Price: $ ____ ]<br/><br/>"
          "[ Draw Fruit 4 + Price: $ ____ ]", "CenterBold")
    ]
]
t_stall = Table(stall_template, colWidths=[280, 280])
t_stall.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (0,0), c_card_bg),
    ('BACKGROUND', (1,0), (1,0), colors.white),
    ('BOX', (0,0), (-1,-1), 1, c_border),
    ('INNERGRID', (0,0), (-1,-1), 1, colors.HexColor("#CBD5E1")),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_stall)
story.append(Spacer(1, 5))

# --- STAGE 5: ASSESSMENT QUIZ ---
stage5_banner = Table([[P("<b>STAGE 5: FORMATIVE ASSESSMENT · \"MARKET QUIZ: LISTEN & CHECK\"</b>", "StageBanner")]], colWidths=[560])
stage5_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_green),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage5_banner)
story.append(Spacer(1, 3))

story.append(P("Teacher reads a new short audio clip. Answer the questions based strictly on what you hear:", "InstructionText"))

quiz_table = [
    [
        P("<b>Question A:</b> Did the buyer ask for an apple or a mango?<br/>"
          "[  ] Apple &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [  ] Mango", "DialogueLine"),
        P("<b>Evaluation Criteria:</b><br/>"
          "[  ] Identifies target fruits accurately<br/>"
          "[  ] Comprehends stated dollar amounts", "InstructionText")
    ],
    [
        P("<b>Question B:</b> \"The watermelon is five dollars.\"<br/>"
          "[  ] TRUE (YES) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [  ] FALSE (NO)", "DialogueLine"),
        P("<b>Score:</b> ___ / 3 points<br/>"
          "Competence: <b>Demonstrated</b> [  ]", "BoldText")
    ],
    [
        P("<b>Question C:</b> How much is the banana in the new audio?<br/>"
          "[  ] $1.00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [  ] $2.00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [  ] $3.00", "DialogueLine"),
        P("<b>Teacher Feedback:</b><br/>"
          "___________________________________", "InstructionText")
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
          "1. What new words about the market did you learn to listen to today?<br/>"
          "&nbsp;&nbsp;&nbsp;&nbsp;__________________________________________________________________________________<br/>"
          "2. What was easy to listen to? [  ] Fruit names &nbsp;&nbsp;&nbsp;&nbsp; [  ] Prices/Dollars &nbsp;&nbsp;&nbsp;&nbsp; [  ] Polite words<br/>"
          "3. What was a little difficult for your ears today? ___________________________________________", "InstructionText"),
        P("<b>Homework Assignment:</b><br/>"
          "1. Draw your favorite fruit from today's lesson at home and write its name.<br/>"
          "2. Listen to a simple English song about fruits and spot 2 words!<br/>"
          "<b>Next Lesson Preview:</b><br/>"
          "<i>\"Next time, we will READ about the market and fruits!\"</i>", "InstructionText")
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
story.append(P("EduGen Panama · MEDUCA Curriculum · Grade 4 (CEFR A1.2) · Lesson #1 (Listening) · Page 3 of 3", "CenterText"))

doc.build(story)
print(f"Listening Student Lab PDF created successfully at: {OUT_PDF}")
