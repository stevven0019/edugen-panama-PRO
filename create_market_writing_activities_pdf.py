from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image as RLImage
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os

OUT_PDF = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\Student_Writing_Lab_4thGrade_Shopping_Market.pdf"

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
c_purple_bg = colors.HexColor("#FAF5FF")
c_purple_border = colors.HexColor("#A855F7")

styles = getSampleStyleSheet()

styles.add(ParagraphStyle(name="DocHeaderTitle", fontName=bold, fontSize=15, leading=19, textColor=c_navy, alignment=TA_CENTER, spaceAfter=2))
styles.add(ParagraphStyle(name="DocHeaderSub", fontName=font, fontSize=8.2, leading=11, textColor=c_muted, alignment=TA_CENTER, spaceAfter=3))

styles.add(ParagraphStyle(name="StageBanner", fontName=bold, fontSize=9, leading=12, textColor=colors.white, alignment=TA_LEFT))
styles.add(ParagraphStyle(name="InstructionText", fontName=font, fontSize=8, leading=10.8, textColor=c_dark, spaceAfter=2))
styles.add(ParagraphStyle(name="BoldText", fontName=bold, fontSize=8.2, leading=10.8, textColor=c_navy))
styles.add(ParagraphStyle(name="CenterText", fontName=font, fontSize=7.8, leading=9.8, textColor=c_dark, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="CenterBold", fontName=bold, fontSize=8.2, leading=10.5, textColor=c_navy, alignment=TA_CENTER))

styles.add(ParagraphStyle(name="DialogueLine", fontName=font, fontSize=8, leading=11, textColor=c_dark))
styles.add(ParagraphStyle(name="CodeModel", fontName=bold, fontSize=8.5, leading=11.5, textColor=c_teal))

def P(txt, s="InstructionText"):
    return Paragraph(txt, styles[s])

def img_or_txt(name, w=38, h=38):
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
    leftMargin=24,
    rightMargin=24,
    topMargin=20,
    bottomMargin=20
)

story = []

# =========================================================================
# PAGE 1: STAGE 1 (WARM-UP & HANDWRITING MODEL) & STAGE 2 (PRESENTATION)
# =========================================================================

# Top Institutional Header
header_data = [
    [
        P("<b>REPÚBLICA DE PANAMÁ · MINISTERIO DE EDUCACIÓN (MEDUCA)</b><br/>"
          "<b>AOA Action Learning Lab: \"Shopping at the Market\"</b>", "DocHeaderTitle"),
        P("<b>Lesson #4 · 45-60 min</b><br/>"
          "Skill: <b>WRITING</b><br/>"
          "Grade: <b>4th Grade (CEFR A1.2)</b>", "CenterBold")
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

story.append(P("Theme 1: <i>\"How Much Is the Pineapple?\"</i> · Missing Letters, Sentence Scramble & \"My Market Trip Report\"", "DocHeaderSub"))

# Student info strip
info_data = [
    [P("<b>Student Name:</b> ___________________________", "BoldText"),
     P("<b>Date:</b> _____________", "BoldText"),
     P("<b>Writing Score:</b> [  ] Exemplary  [  ] Good  [  ] In Progress", "BoldText")]
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

# --- STAGE 1: WARM-UP & MODELING ---
stage1_banner = Table([[P("<b>STAGE 1: WARM-UP & TEACHER MODELING (Engagement & Sentence Mechanics)</b>", "StageBanner")]], colWidths=[564])
stage1_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_navy),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage1_banner)
story.append(Spacer(1, 3))

story.append(P("<b>Teacher Think-Aloud & Handwriting Model:</b> Observe how clear sentences begin with a <b>Capital Letter</b>, leave finger spaces between words, spell vocabulary correctly, and end with a <b>Period (.)</b>.", "InstructionText"))

# Model sentences callout table
model_cells = [
    [
        P("<b>1. Model for Quantities & Needs:</b><br/>"
          "&nbsp;&nbsp;&nbsp;&nbsp;<b><font color='#0D3B66' size='9'>\"I need two apples.\"</font></b><br/>"
          "<font color='#0081A7'>&#8594; [Capital I] + [need] + [number word] + [plural noun with -s] + [.]</font>", "InstructionText"),
        P("<b>2. Model for Unit Prices & Costs:</b><br/>"
          "&nbsp;&nbsp;&nbsp;&nbsp;<b><font color='#0D3B66' size='9'>\"The pineapple costs three dollars.\"</font></b><br/>"
          "<font color='#0081A7'>&#8594; [Capital T] + [item] + [costs (singular)] + [price in USD] + [.]</font>", "InstructionText")
    ]
]
t_model = Table(model_cells, colWidths=[282, 282])
t_model.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_blue_bg),
    ('BOX', (0,0), (-1,-1), 0.75, c_blue_border),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_model)
story.append(Spacer(1, 3))

# Quick Write & Concept Check (CCQs)
ccq_cells = [
    [
        P("<b>Concept-Checking Questions (CCQs) · Circle the correct choice:</b><br/>"
          "1. Is the first letter of an English sentence big or small? &nbsp;&nbsp; <b>[ Big / Capital ]</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>[ Small / Lowercase ]</b><br/>"
          "2. Which spelling is correct for this fruit? &nbsp;&nbsp; <b>[ a-p-p-l-e ]</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>[ a-p-p-l ]</b><br/>"
          "3. For 3 items, do we write: &nbsp;&nbsp; <b>[ three apple ]</b> &nbsp;&nbsp;|&nbsp;&nbsp; <b>[ three apples ]</b>", "InstructionText"),
        P("<b>Warm-up Quick-Write:</b><br/>"
          "Look at the board and write 2 items and prices:<br/>"
          "<i>Item 1:</i> ________________________________<br/>"
          "<i>Item 2:</i> ________________________________", "InstructionText")
    ]
]
t_ccq = Table(ccq_cells, colWidths=[360, 204])
t_ccq.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.white),
    ('BOX', (0,0), (-1,-1), 0.5, c_border),
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_ccq)
story.append(Spacer(1, 5))

# --- STAGE 2: PRESENTATION ---
stage2_banner = Table([[P("<b>STAGE 2: PRESENTATION (Authentic Shopping List & Customer-Vendor Dialogue)</b>", "StageBanner")]], colWidths=[564])
stage2_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_teal),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage2_banner)
story.append(Spacer(1, 3))

story.append(P("<b>Writing for Information:</b> Read the authentic market shopping list and transaction dialogue. Notice how numbers, names, and dollar prices are written clearly.", "InstructionText"))

# Side-by-Side: Shopping List + Dialogue
pres_cells = [
    [
        P("<b>OFFICIAL SHOPPING LIST</b><br/>"
          "<i>Mercado Agrícola Central</i><br/><br/>"
          "&bull; <b>Item 1:</b> Apples &nbsp;&#8212;&nbsp; <b>Qty:</b> 3<br/>"
          "&bull; <b>Item 2:</b> Pineapple &nbsp;&#8212;&nbsp; <b>Qty:</b> 1<br/>"
          "&bull; <b>Item 3:</b> Carrots &nbsp;&#8212;&nbsp; <b>Qty:</b> 2<br/><br/>"
          "<b>Rule:</b> Always write quantity first, then the item!", "CenterText"),
        P("<b>TRANSACTION DIALOGUE AT THE STAND</b><br/>"
          "<b>Customer:</b> Hello! I need three apples. How much are they?<br/>"
          "<b>Vendor:</b> They are two dollars ($2.00).<br/>"
          "<b>Customer:</b> And one pineapple. How much is it?<br/>"
          "<b>Vendor:</b> It is three dollars ($3.00).<br/>"
          "<b>Customer:</b> Perfect! Thank you very much.<br/>"
          "<b>Vendor:</b> You're welcome! Have a great day.", "DialogueLine")
    ]
]
t_pres = Table(pres_cells, colWidths=[190, 374])
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

# Written Comprehension Questions (Stage 2 check)
story.append(P("<b>Written Comprehension Check:</b> Write complete answer sentences in the lines below using the text above:", "BoldText"))

comp_q_cells = [
    [
        P("<b>Q1.</b> How many apples does the customer need?<br/>"
          "<b>Write:</b> The customer needs _________________________________________________________________.", "InstructionText"),
    ],
    [
        P("<b>Q2.</b> What is the price of the pineapple?<br/>"
          "<b>Write:</b> The pineapple costs __________________________________________________________________.", "InstructionText"),
    ],
    [
        P("<b>Q3.</b> How much do the apples cost in total?<br/>"
          "<b>Write:</b> They cost __________________________________________________________________________.", "InstructionText"),
    ]
]
t_comp = Table(comp_q_cells, colWidths=[564])
t_comp.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
    ('BOX', (0,0), (-1,-1), 0.5, c_border),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_comp)

# Differentiation note footer
story.append(Spacer(1, 3))
story.append(P("<i>Teacher Differentiation Note:</i> Struggling learners use provided sentence frames. Advanced learners write full independent answers with punctuation.", "DocHeaderSub"))

story.append(PageBreak())

# =========================================================================
# PAGE 2: STAGE 3: PREPARATION / PRACTICE (CONTROLLED WRITING)
# =========================================================================

p2_head = Table([[
    P("<b>PAGE 2 · STAGE 3: PREPARATION & TRANSACTIONAL PRACTICE (AOA Guided Writing)</b>", "StageBanner"),
    P("<b>4th Grade · Writing</b>", "CenterBold")
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

# Activity 3.1: Missing Letters (Word Bank & Spelling Mastery)
story.append(P("<b>ACTIVITY 3.1 · Missing Letters Challenge:</b> Complete each market item with the missing vowels or consonants. Then write the full word neatly on the line.", "InstructionText"))

spell_cells = [
    [
        img_or_txt("pineapple", 32, 32),
        P("<b>1. P _ N _ A P P L _</b><br/>Full Word: ___________________", "InstructionText"),
        img_or_txt("banana", 32, 32),
        P("<b>2. B _ N A _ A</b><br/>Full Word: ___________________", "InstructionText")
    ],
    [
        img_or_txt("orange", 32, 32),
        P("<b>3. O _ A N _ E</b><br/>Full Word: ___________________", "InstructionText"),
        img_or_txt("carrot", 32, 32),
        P("<b>4. C _ R R _ T</b><br/>Full Word: ___________________", "InstructionText")
    ],
    [
        img_or_txt("potato", 32, 32),
        P("<b>5. P _ T A T _</b><br/>Full Word: ___________________", "InstructionText"),
        img_or_txt("apple", 32, 32),
        P("<b>6. A P P L _</b><br/>Full Word: ___________________", "InstructionText")
    ]
]
t_spell = Table(spell_cells, colWidths=[42, 240, 42, 240])
t_spell.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), colors.white),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BOX', (0,0), (-1,-1), 0.5, c_border),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 4),
    ('RIGHTPADDING', (0,0), (-1,-1), 4),
]))
story.append(t_spell)
story.append(Spacer(1, 4))

# Activity 3.2: Sentence Scramble
story.append(P("<b>ACTIVITY 3.2 · Sentence Scramble:</b> Unscramble the words to build grammatically correct shopping sentences. Remember: begin with a capital letter and finish with a period (.).", "InstructionText"))

scramble_cells = [
    [
        P("<b>Set A:</b> [ apples / I / need / three . ]<br/>"
          "<b>Correct Sentence:</b> ______________________________________________________________________________", "InstructionText")
    ],
    [
        P("<b>Set B:</b> [ pineapple / costs / The / dollars / three . ]<br/>"
          "<b>Correct Sentence:</b> ______________________________________________________________________________", "InstructionText")
    ],
    [
        P("<b>Set C:</b> [ dollars / They / are / two . ]<br/>"
          "<b>Correct Sentence:</b> ______________________________________________________________________________", "InstructionText")
    ],
    [
        P("<b>Set D:</b> [ want / I / buy / to / oranges / four . ]<br/>"
          "<b>Correct Sentence:</b> ______________________________________________________________________________", "InstructionText")
    ]
]
t_scramble = Table(scramble_cells, colWidths=[564])
t_scramble.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
    ('BOX', (0,0), (-1,-1), 0.5, c_border),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_scramble)
story.append(Spacer(1, 4))

# Activity 3.3: Guided Shopping List Template (Transactional Writing)
story.append(P("<b>ACTIVITY 3.3 · Guided Shopping List Drafting:</b> Complete the official market voucher with the item names, quantities, unit prices, and calculate the total in US Dollars ($ USD):", "InstructionText"))

voucher_cells = [
    [
        P("<b>ITEM #</b>", "CenterBold"),
        P("<b>VISUAL PRODUCT</b>", "CenterBold"),
        P("<b>ITEM NAME (English)</b>", "CenterBold"),
        P("<b>QTY</b>", "CenterBold"),
        P("<b>UNIT PRICE</b>", "CenterBold"),
        P("<b>SUBTOTAL (USD)</b>", "CenterBold")
    ],
    [
        P("1", "CenterText"),
        img_or_txt("apple", 26, 26),
        P("Apples (Red)", "InstructionText"),
        P("3", "CenterBold"),
        P("$1.00 each", "CenterText"),
        P("$ 3.00", "CenterBold")
    ],
    [
        P("2", "CenterText"),
        img_or_txt("pineapple", 26, 26),
        P("Pineapple (Chorrera)", "InstructionText"),
        P("1", "CenterBold"),
        P("$3.00 each", "CenterText"),
        P("$ 3.00", "CenterBold")
    ],
    [
        P("3", "CenterText"),
        img_or_txt("banana", 26, 26),
        P("_________________________", "InstructionText"),
        P("____", "CenterText"),
        P("$1.00 pair", "CenterText"),
        P("$ _________", "CenterText")
    ],
    [
        P("4", "CenterText"),
        img_or_txt("carrot", 26, 26),
        P("_________________________", "InstructionText"),
        P("____", "CenterText"),
        P("$2.00 bunch", "CenterText"),
        P("$ _________", "CenterText")
    ],
    [
        P("<b>TOTAL:</b>", "CenterBold"),
        P("", "CenterText"),
        P("<i>Sum of all items in market cart:</i>", "InstructionText"),
        P("", "CenterText"),
        P("<b>USD AMOUNT:</b>", "CenterBold"),
        P("<b>$ _________</b>", "CenterBold")
    ]
]
t_voucher = Table(voucher_cells, colWidths=[45, 75, 184, 50, 90, 120])
t_voucher.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), c_teal),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('BACKGROUND', (0,-1), (-1,-1), c_gold_bg),
    ('SPAN', (0, -1), (1, -1)),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('BOX', (0,0), (-1,-1), 0.75, c_border),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 2.5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
]))
story.append(t_voucher)

story.append(PageBreak())

# =========================================================================
# PAGE 3: STAGE 4 (PRODUCTION), STAGE 5 (ASSESSMENT) & STAGE 6 (REFLECTION)
# =========================================================================

p3_head = Table([[
    P("<b>PAGE 3 · STAGE 4: ACTION PRODUCTION · \"MY MARKET TRIP REPORT\"</b>", "StageBanner"),
    P("<b>Report & Evaluation</b>", "CenterBold")
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

story.append(P("<b>Group Simulation &#8594; Individual Report:</b> Work with your group of 3-4 students to choose your market items. Then, write your personal <b>\"My Market Trip Report\"</b> in the official field below.", "InstructionText"))

# Group Shopping Decision Box
group_data = [
    [
        P("<b>Team Members:</b> 1. __________________ &nbsp;&nbsp; 2. __________________ &nbsp;&nbsp; 3. __________________<br/>"
          "<b>Group Stand Chosen:</b> [  ] Fresh Fruits Stand &nbsp;&nbsp;&nbsp;&nbsp; [  ] Local Vegetables Stand<br/>"
          "<b>Items Selected:</b> 1. ____________________ &nbsp;|&nbsp; 2. ____________________ &nbsp;|&nbsp; 3. ____________________", "InstructionText")
    ]
]
t_grp = Table(group_data, colWidths=[564])
t_grp.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_card_bg),
    ('BOX', (0,0), (-1,-1), 0.5, c_border),
    ('TOPPADDING', (0,0), (-1,-1), 3),
    ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ('LEFTPADDING', (0,0), (-1,-1), 6),
    ('RIGHTPADDING', (0,0), (-1,-1), 6),
]))
story.append(t_grp)
story.append(Spacer(1, 3))

# Individual Report Writing Pad
report_pad = [
    [
        P("<b>OFFICIAL STUDENT REPORT · \"MY MARKET TRIP REPORT\"</b><br/>"
          "<font color='#64748B'><i>Follow the paragraph format modeled in class. Write clearly with capital letters and periods.</i></font>", "CenterBold")
    ],
    [
        P("<b>I went to the market today.</b><br/><br/>"
          "I bought __________________________________________. They cost __________________________________________.<br/><br/>"
          "I also bought __________________________________________. It cost __________________________________________.<br/><br/>"
          "My total was __________________________________________. It was __________________________________________!<br/><br/>"
          "<font color='#059669'><b>Advanced Writer Bonus Line:</b> My favorite item was ________________ because it was ________________.</font>", "InstructionText")
    ]
]
t_pad = Table(report_pad, colWidths=[564])
t_pad.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), c_purple_bg),
    ('BACKGROUND', (0,1), (-1,1), colors.white),
    ('BOX', (0,0), (-1,-1), 0.75, c_purple_border),
    ('INNERGRID', (0,0), (-1,-1), 0.5, c_purple_border),
    ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
    ('RIGHTPADDING', (0,0), (-1,-1), 8),
]))
story.append(t_pad)
story.append(Spacer(1, 4))

# --- STAGE 5: PEER REVIEW & FORMATIVE ASSESSMENT RUBRIC ---
stage5_banner = Table([[P("<b>STAGE 5: PEER REVIEW & OFFICIAL MEDUCA FORMATIVE RUBRIC</b>", "StageBanner")]], colWidths=[564])
stage5_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_amber),
    ('TOPPADDING', (0,0), (-1,-1), 2.5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage5_banner)
story.append(Spacer(1, 2))

# Peer Review Strip
peer_cells = [
    [
        P("<b>Peer Review Check:</b> Exchange your shopping list with a peer. Peer Reviewer Name: ____________________________<br/>"
          "[  ] Quantities match cards &nbsp;&nbsp;&nbsp;&nbsp; [  ] Prices calculated correctly in USD &nbsp;&nbsp;&nbsp;&nbsp; [  ] Clear legible handwriting", "InstructionText")
    ]
]
t_peer = Table(peer_cells, colWidths=[564])
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

# Official 4-Criteria MEDUCA Rubric
rubric_cells = [
    [
        P("<b>CRITERIA</b>", "CenterBold"),
        P("<b>3 · EXEMPLARY (A)</b>", "CenterBold"),
        P("<b>2 · SATISFACTORY (B)</b>", "CenterBold"),
        P("<b>1 · IN PROGRESS (C)</b>", "CenterBold")
    ],
    [
        P("<b>1. Target Vocabulary</b>", "BoldText"),
        P("Accurate spelling of 4+ market items, numbers, and currency terms.", "InstructionText"),
        P("Spells 2-3 market items correctly with minor phonological slips.", "InstructionText"),
        P("Requires word bank support to write basic items.", "InstructionText")
    ],
    [
        P("<b>2. Sentence Structure</b>", "BoldText"),
        P("Uses complete frames (I bought..., It cost...) with correct punctuation.", "InstructionText"),
        P("Uses simple frames with occasional missing period or capital letter.", "InstructionText"),
        P("Writes isolated words or fragmented phrases without full predicate.", "InstructionText")
    ],
    [
        P("<b>3. Numerical Accuracy</b>", "BoldText"),
        P("Quantities and USD dollar totals calculated and written flawlessly.", "InstructionText"),
        P("Minor calculation slip (off by $1) but clear quantity representation.", "InstructionText"),
        P("Prices or quantities omitted or inconsistent with cards.", "InstructionText")
    ],
    [
        P("<b>4. Legibility & Punctuation</b>", "BoldText"),
        P("Neat handwriting, clear finger spacing, capital starts, final periods.", "InstructionText"),
        P("Readable handwriting with minor spacing or capitalization errors.", "InstructionText"),
        P("Hard to decipher; words run together without punctuation.", "InstructionText")
    ]
]
t_rubric = Table(rubric_cells, colWidths=[114, 150, 150, 150])
t_rubric.setStyle(TableStyle([
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
story.append(t_rubric)
story.append(Spacer(1, 3))

# --- STAGE 6: STUDENT REFLECTION & CONNECTION TO LESSON 5 ---
stage6_banner = Table([[P("<b>STAGE 6: REFLECTION & FORWARD LOOK TO LESSON 5 (MEDIATION & INTEGRATION)</b>", "StageBanner")]], colWidths=[564])
stage6_banner.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,-1), c_teal),
    ('TOPPADDING', (0,0), (-1,-1), 2.5),
    ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
    ('LEFTPADDING', (0,0), (-1,-1), 8),
]))
story.append(stage6_banner)
story.append(Spacer(1, 2))

refl_cells = [
    [
        P("<b>Student Self-Reflection:</b><br/>"
          "1. What new words did you write today? ___________________________________________________________<br/>"
          "2. What was easy to write about shopping? ________________________________________________________<br/>"
          "3. What was difficult when writing the report? ___________________________________________________<br/>"
          "4. How does writing help you when shopping? ______________________________________________________", "InstructionText"),
        P("<b>NEXT LESSON PREVIEW:</b><br/>"
          "<b>Lesson #5: Mediation & Integration</b><br/>"
          "You will use your written <i>\"My Market Trip Report\"</i> to present your findings verbally to the class, compare prices with peers, and integrate all 4 skills!", "CenterText")
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

# Build PDF
doc.build(story)
print(f"SUCCESS: Generated {OUT_PDF}")
