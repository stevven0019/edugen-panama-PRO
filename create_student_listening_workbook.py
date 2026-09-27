from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Image as RLImage
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os

OUT_PDF = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\Student_Listening_Workbook_Grade4_Scenario3.pdf"

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
c_pale = colors.HexColor("#F0F9FF")
c_card_bg = colors.HexColor("#F8FAFC")
c_dark = colors.HexColor("#1E293B")
c_muted = colors.HexColor("#64748B")
c_border = colors.HexColor("#CBD5E1")
c_green = colors.HexColor("#059669")
c_light_green = colors.HexColor("#ECFDF5")

styles = getSampleStyleSheet()

styles.add(ParagraphStyle(name="DocHeaderTitle", fontName=bold, fontSize=18, leading=22, textColor=c_navy, alignment=TA_CENTER, spaceAfter=2))
styles.add(ParagraphStyle(name="DocHeaderSub", fontName=font, fontSize=9, leading=12, textColor=c_muted, alignment=TA_CENTER, spaceAfter=8))

styles.add(ParagraphStyle(name="SectionTitle", fontName=bold, fontSize=11, leading=14, textColor=c_navy, spaceBefore=4, spaceAfter=4))
styles.add(ParagraphStyle(name="InstructionText", fontName=font, fontSize=8.5, leading=11.5, textColor=c_dark, spaceAfter=6))
styles.add(ParagraphStyle(name="ItemLabel", fontName=bold, fontSize=8.5, leading=11, textColor=c_navy, alignment=TA_CENTER))
styles.add(ParagraphStyle(name="ItemPrice", fontName=font, fontSize=8, leading=10, textColor=c_teal, alignment=TA_CENTER))

styles.add(ParagraphStyle(name="DialogueSpeaker", fontName=bold, fontSize=8.5, leading=12, textColor=c_navy))
styles.add(ParagraphStyle(name="DialogueLine", fontName=font, fontSize=8.5, leading=12, textColor=c_dark))
styles.add(ParagraphStyle(name="WhiteHeader", fontName=bold, fontSize=8.5, leading=11, textColor=colors.white, alignment=TA_CENTER))

styles.add(ParagraphStyle(name="ScriptHead", fontName=bold, fontSize=11, leading=14, textColor=c_teal, spaceBefore=4, spaceAfter=4))
styles.add(ParagraphStyle(name="ScriptText", fontName=font, fontSize=8.5, leading=12, textColor=c_dark, spaceAfter=4))

styles.add(ParagraphStyle(name="SmallFoot", fontName=font, fontSize=7, leading=9, textColor=c_muted))

def P(txt, s="InstructionText"):
    return Paragraph(txt, styles[s])

def make_header_footer(canvas, doc):
    canvas.saveState()
    w, h = letter
    # Top primary bar
    canvas.setFillColor(c_navy)
    canvas.rect(0, h - 0.15 * inch, w, 0.15 * inch, fill=1, stroke=0)
    # Bottom rule
    canvas.setStrokeColor(c_border)
    canvas.setLineWidth(0.6)
    canvas.line(0.5 * inch, 0.45 * inch, w - 0.5 * inch, 0.45 * inch)
    # Bottom text
    canvas.setFillColor(c_muted)
    canvas.setFont(font, 7.5)
    canvas.drawString(0.5 * inch, 0.28 * inch, "EDUGEN PANAMA • 4TH GRADE (CEFR A1.2) • SCENARIO 3: SHOPPING AT THE MARKET • LISTENING")
    canvas.drawRightString(w - 0.5 * inch, 0.28 * inch, f"Page {doc.page} of 3")
    canvas.restoreState()

doc = SimpleDocTemplate(
    OUT_PDF,
    pagesize=letter,
    leftMargin=0.5 * inch,
    rightMargin=0.5 * inch,
    topMargin=0.4 * inch,
    bottomMargin=0.55 * inch,
    title="4th Grade Listening Student Worksheet - Shopping at the Market"
)

IMG_BASE = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public\assets\nouns"

def get_img(name, w=0.85*inch, h=0.85*inch):
    p = os.path.join(IMG_BASE, name)
    if os.path.exists(p):
        return RLImage(p, width=w, height=h)
    return P(f"[{name}]", "ItemLabel")

story = []

# =========================================================================
# PAGE 1: STUDENT WORKSHEET - PART 1 & PART 2
# =========================================================================

# Title banner
story.append(P("MARKET ADVENTURE: LISTEN & SHOP!", "DocHeaderTitle"))
story.append(P("<b>4th Grade English</b> • Scenario 3: Shopping at the Market • Theme 1: How Much Is the Pineapple?", "DocHeaderSub"))

# Student Identification Table
id_data = [
    [P("<b>Student Name:</b> ________________________________________________", "InstructionText"), P("<b>Date:</b> ____________________", "InstructionText")],
    [P("<b>Grade & Section:</b> 4th Grade ________", "InstructionText"), P("<b>Score:</b> _______ / 20 pts", "InstructionText")]
]
id_table = Table(id_data, colWidths=[4.8 * inch, 2.7 * inch])
id_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
    ("BOX", (0, 0), (-1, -1), 0.8, c_border),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))
story.append(id_table)
story.append(Spacer(1, 8))

# PART 1: PRICE DETECTIVE
story.append(P("<b>PART 1: Price Detective — Listen & Circle the Correct Price Tag (5 pts)</b>", "SectionTitle"))
story.append(P("<b>Instructions:</b> Listen to the fruit vendor announcing the prices at the market. Look at each picture and <b>circle</b> the price you hear for each item.", "InstructionText"))

# 5 Items: Pineapple, Apples, Bananas, Cassava, Potatoes
p1_cells = [
    [
        # Item 1: Pineapple
        [
            get_img("pineapple.png", 0.9*inch, 0.9*inch),
            Spacer(1, 2),
            P("<b>1. Pineapple</b>", "ItemLabel"),
            P("A) $1.00<br/>B) $2.00<br/>C) $5.00", "ItemPrice")
        ],
        # Item 2: Apples
        [
            get_img("apple.png", 0.9*inch, 0.9*inch),
            Spacer(1, 2),
            P("<b>2. Apples</b> (each)", "ItemLabel"),
            P("A) $0.50<br/>B) $1.00<br/>C) $3.00", "ItemPrice")
        ],
        # Item 3: Bananas
        [
            get_img("banana.png", 0.9*inch, 0.9*inch),
            Spacer(1, 2),
            P("<b>3. Bananas</b> (bunch)", "ItemLabel"),
            P("A) $1.00<br/>B) $2.00<br/>C) $4.00", "ItemPrice")
        ],
        # Item 4: Cassava / Yuca
        [
            get_img("cassava.png", 0.9*inch, 0.9*inch),
            Spacer(1, 2),
            P("<b>4. Cassava</b> (bag)", "ItemLabel"),
            P("A) $2.00<br/>B) $3.00<br/>C) $6.00", "ItemPrice")
        ],
        # Item 5: Potatoes
        [
            get_img("potatoes.png", 0.9*inch, 0.9*inch),
            Spacer(1, 2),
            P("<b>5. Potatoes</b> (bag)", "ItemLabel"),
            P("A) $1.00<br/>B) $3.00<br/>C) $4.00", "ItemPrice")
        ],
    ]
]

t_p1 = Table(p1_cells, colWidths=[1.5 * inch, 1.5 * inch, 1.5 * inch, 1.5 * inch, 1.5 * inch])
t_p1.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), c_card_bg),
    ("BOX", (0, 0), (-1, -1), 0.8, c_border),
    ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 4),
    ("RIGHTPADDING", (0, 0), (-1, -1), 4),
]))
story.append(t_p1)
story.append(Spacer(1, 10))

# PART 2: THE SHOPPING CART COUNT
story.append(P("<b>PART 2: Shopping Cart Count — Listen for Quantities (5 pts)</b>", "SectionTitle"))
story.append(P("<b>Instructions:</b> Listen to Mrs. Gonzalez reading her market shopping list. Write the <b>number</b> of items she needs and check the box [ v ].", "InstructionText"))

p2_rows = [
    [
        P("<b>Market Item & Picture</b>", "WhiteHeader"),
        P("<b>Target English Noun</b>", "WhiteHeader"),
        P("<b>Quantity Heard (Number)</b>", "WhiteHeader"),
        P("<b>In the Cart?</b>", "WhiteHeader")
    ],
    [
        get_img("pineapple.png", 0.55*inch, 0.55*inch),
        P("<b>Pineapple</b> (/p/ sound)", "InstructionText"),
        P("She needs: <b>[ _____ ]</b> pineapple(s)", "InstructionText"),
        P("[ &nbsp; ] Ready in cart", "InstructionText")
    ],
    [
        get_img("apple.png", 0.55*inch, 0.55*inch),
        P("<b>Apples</b>", "InstructionText"),
        P("She needs: <b>[ _____ ]</b> apple(s)", "InstructionText"),
        P("[ &nbsp; ] Ready in cart", "InstructionText")
    ],
    [
        get_img("banana.png", 0.55*inch, 0.55*inch),
        P("<b>Bananas</b>", "InstructionText"),
        P("She needs: <b>[ _____ ]</b> banana(s)", "InstructionText"),
        P("[ &nbsp; ] Ready in cart", "InstructionText")
    ],
    [
        get_img("potatoes.png", 0.55*inch, 0.55*inch),
        P("<b>Potatoes</b> (/p/ sound)", "InstructionText"),
        P("She needs: <b>[ _____ ]</b> potato(es)", "InstructionText"),
        P("[ &nbsp; ] Ready in cart", "InstructionText")
    ],
    [
        get_img("cassava.png", 0.55*inch, 0.55*inch),
        P("<b>Cassava (Yuca)</b>", "InstructionText"),
        P("She needs: <b>[ _____ ]</b> cassava(s)", "InstructionText"),
        P("[ &nbsp; ] Ready in cart", "InstructionText")
    ],
]

t_p2 = Table(p2_rows, colWidths=[1.3 * inch, 2.2 * inch, 2.6 * inch, 1.4 * inch])
t_p2.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), c_teal),
    ("GRID", (0, 0), (-1, -1), 0.5, c_border),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("ALIGN", (0, 1), (0, -1), "CENTER"),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_card_bg]),
]))
story.append(t_p2)

story.append(PageBreak())

# =========================================================================
# PAGE 2: STUDENT WORKSHEET - PART 3 & PART 4 + EXIT TICKET
# =========================================================================

story.append(P("MARKET ADVENTURE: LISTEN & SHOP! (PAGE 2)", "DocHeaderTitle"))
story.append(P("<b>4th Grade English</b> • Real Student Learning Task • Scenario 3, Theme 1", "DocHeaderSub"))

# PART 3: MARKET DIALOGUE GAP-FILL
story.append(P("<b>PART 3: At the Cashier — Listen & Complete the Conversation (6 pts)</b>", "SectionTitle"))
story.append(P("<b>Instructions:</b> Listen to the real conversation between the Customer and the Cashier. Fill in the missing words and prices from the word bank.", "InstructionText"))

# Word bank banner
wb_text = "<b>WORD BANK:</b> &nbsp;&nbsp; • <b>pineapple</b> &nbsp;&nbsp; • <b>one dollar</b> &nbsp;&nbsp; • <b>three</b> &nbsp;&nbsp; • <b>apples</b> &nbsp;&nbsp; • <b>four dollars</b> &nbsp;&nbsp; • <b>thank you</b>"
wb_table = Table([[P(wb_text, "InstructionText")]], colWidths=[7.5 * inch])
wb_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#FEF3C7")),
    ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#F59E0B")),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(wb_table)
story.append(Spacer(1, 6))

dialogue_rows = [
    [
        get_img("cashier.png", 0.42*inch, 0.42*inch),
        P("<b>Cashier:</b>", "DialogueSpeaker"),
        P('"Hello! Good morning. Can I help you?"', "DialogueLine")
    ],
    [
        get_img("market.png", 0.42*inch, 0.42*inch),
        P("<b>Customer:</b>", "DialogueSpeaker"),
        P('"Yes, please! Excuse me, how much is the <b>(1)</b> ____________________ ?"', "DialogueLine")
    ],
    [
        get_img("cashier.png", 0.42*inch, 0.42*inch),
        P("<b>Cashier:</b>", "DialogueSpeaker"),
        P('"It is <b>(2)</b> ____________________ ."', "DialogueLine")
    ],
    [
        get_img("market.png", 0.42*inch, 0.42*inch),
        P("<b>Customer:</b>", "DialogueSpeaker"),
        P('"Great! And how many <b>(3)</b> ____________________ do you have?"', "DialogueLine")
    ],
    [
        get_img("cashier.png", 0.42*inch, 0.42*inch),
        P("<b>Cashier:</b>", "DialogueSpeaker"),
        P('"We have fresh red apples. How many do you need?"', "DialogueLine")
    ],
    [
        get_img("market.png", 0.42*inch, 0.42*inch),
        P("<b>Customer:</b>", "DialogueSpeaker"),
        P('"I need <b>(4)</b> ____________________ apples and one banana, please."', "DialogueLine")
    ],
    [
        get_img("money.png", 0.42*inch, 0.42*inch),
        P("<b>Cashier:</b>", "DialogueSpeaker"),
        P('"Okay, one pineapple, three apples, and one banana. That is <b>(5)</b> ____________________ in total."', "DialogueLine")
    ],
    [
        get_img("market.png", 0.42*inch, 0.42*inch),
        P("<b>Customer:</b>", "DialogueSpeaker"),
        P('"Here is the money. <b>(6)</b> ____________________ !" &nbsp; — Cashier: "You are welcome! Have a nice day!"', "DialogueLine")
    ],
]

t_diag = Table(dialogue_rows, colWidths=[0.65 * inch, 1.25 * inch, 5.6 * inch])
t_diag.setStyle(TableStyle([
    ("GRID", (0, 0), (-1, -1), 0.4, c_border),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("ALIGN", (0, 0), (0, -1), "CENTER"),
    ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, c_card_bg]),
    ("TOPPADDING", (0, 0), (-1, -1), 2),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
]))
story.append(t_diag)
story.append(Spacer(1, 8))

# PART 4: FACT OR FALSE
story.append(P("<b>PART 4: Critical Listening — Fact or False? (4 pts)</b>", "SectionTitle"))
story.append(P("<b>Instructions:</b> Based on the dialogue you heard, check [ v ] whether each statement is <b>TRUE</b> or <b>FALSE</b>.", "InstructionText"))

p4_data = [
    [P("<b>Statement from the Market Audio</b>", "WhiteHeader"), P("<b>TRUE</b>", "WhiteHeader"), P("<b>FALSE</b>", "WhiteHeader")],
    [P("1. The pineapple costs ten dollars.", "InstructionText"), P("[ &nbsp; ]", "ItemLabel"), P("[ &nbsp; ]", "ItemLabel")],
    [P("2. The customer buys three apples.", "InstructionText"), P("[ &nbsp; ]", "ItemLabel"), P("[ &nbsp; ]", "ItemLabel")],
    [P("3. The customer uses polite words like <i>'Excuse me'</i> and <i>'Please'</i>.", "InstructionText"), P("[ &nbsp; ]", "ItemLabel"), P("[ &nbsp; ]", "ItemLabel")],
    [P("4. The total cost of the shopping trip is four dollars.", "InstructionText"), P("[ &nbsp; ]", "ItemLabel"), P("[ &nbsp; ]", "ItemLabel")],
]

t_p4 = Table(p4_data, colWidths=[5.5 * inch, 1.0 * inch, 1.0 * inch])
t_p4.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), c_navy),
    ("GRID", (0, 0), (-1, -1), 0.5, c_border),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("ALIGN", (1, 0), (-1, -1), "CENTER"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_card_bg]),
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
]))
story.append(t_p4)
story.append(Spacer(1, 8))

# SELF-ASSESSMENT & EXIT TICKET
story.append(P("<b>My Learning Reflection (Self-Assessment & Exit Ticket)</b>", "SectionTitle"))
exit_box = [
    [
        P("<b>How did I do today?</b><br/>"
          "[ &nbsp; ] <b>Super!</b> I understood all prices and quantities.<br/>"
          "[ &nbsp; ] <b>Good!</b> I understood most items, but numbers over 5 are a bit tricky.<br/>"
          "[ &nbsp; ] <b>Need practice:</b> I want to listen to the dialogue one more time.", "InstructionText"),
        P("<b>My Favorite Word Today:</b><br/>"
          "Word: _______________________________<br/>"
          "Target Sound: [ /p/ in pineapple &nbsp; | &nbsp; /m/ in money ]", "InstructionText")
    ]
]
t_exit = Table(exit_box, colWidths=[4.2 * inch, 3.3 * inch])
t_exit.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), c_light_green),
    ("BOX", (0, 0), (-1, -1), 0.8, c_green),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(t_exit)

story.append(PageBreak())

# =========================================================================
# PAGE 3: TEACHER AUDIOSCRIPT & ANSWER KEY (PEDAGOGICAL COMPANION)
# =========================================================================

story.append(P("TEACHER'S SCRIPT & ANSWER KEY (LISTENING LAB)", "DocHeaderTitle"))
story.append(P("<b>Pedagogical Implementation Guide</b> • Audio Transcripts, Oral Modeling & Scoring Rubric", "DocHeaderSub"))

# Box with Teacher Instructions
t_guide = """<b>HOW TO CONDUCT THIS LISTENING LESSON IN THE CLASSROOM:</b><br/>
1. <b>Pre-Listening (5 min):</b> Point to the real images on the student worksheet (pineapple, apples, bananas, cassava, potatoes). Elicit their names. Model the initial phonemes <b>/p/</b> (<i>pineapple, potatoes</i>) and <b>/m/</b> (<i>market, money</i>).<br/>
2. <b>First Listening (Gist):</b> Read the audio script below at a natural, clear pace (or play the recorded audio). Students point to the pictures.<br/>
3. <b>Second Listening (Detailed Tasks):</b> Read each section pausing 5 seconds between items so students can circle, write numbers, and fill in dialogue blanks.<br/>
4. <b>Post-Listening (Formative Check):</b> Have student pairs compare their answers before revealing the answer key."""

t_guide_table = Table([[P(t_guide, "InstructionText")]], colWidths=[7.5 * inch])
t_guide_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#EFF6FF")),
    ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#3B82F6")),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(t_guide_table)
story.append(Spacer(1, 8))

# SCRIPTS
story.append(P("AUDIO TRANSCRIPT 1: Market Vendor Announcements (Part 1)", "ScriptHead"))
story.append(P('<i>"Good morning, shoppers! Welcome to the Central Market. Here are today\'s fresh specials!<br/>'
               '<b>Item 1:</b> Sweet fresh pineapples are only <b>one dollar</b> each! Yes, one dollar for a big pineapple.<br/>'
               '<b>Item 2:</b> Crunchy red apples are <b>one dollar</b> each.<br/>'
               '<b>Item 3:</b> Delicious ripe bananas are <b>two dollars</b> for a whole bunch.<br/>'
               '<b>Item 4:</b> Fresh local cassava (yuca) is <b>three dollars</b> for a bag.<br/>'
               '<b>Item 5:</b> Big baking potatoes are <b>four dollars</b> for a five-pound sack!"</i>', "ScriptText"))

story.append(Spacer(1, 4))
story.append(P("AUDIO TRANSCRIPT 2: Mrs. Gonzalez's Shopping List (Part 2)", "ScriptHead"))
story.append(P('<i>"Let me check my shopping list before I go to the stall. Today for our family soup, I need <b>one pineapple</b> for juice. I need <b>five apples</b> for the children\'s snack. I need <b>three bananas</b>. I need <b>four potatoes</b>, and I need <b>two bags of cassava (yuca)</b>. That\'s everything on my list!"</i>', "ScriptText"))

story.append(Spacer(1, 4))
story.append(P("AUDIO TRANSCRIPT 3: At the Cashier Counter (Part 3 & 4)", "ScriptHead"))
story.append(P('<i><b>Cashier:</b> "Hello! Good morning. Can I help you?"<br/>'
               '<b>Customer:</b> "Yes, please! Excuse me, how much is the <b>pineapple</b>?"<br/>'
               '<b>Cashier:</b> "It is <b>one dollar</b>."<br/>'
               '<b>Customer:</b> "Great! And how many <b>apples</b> do you have?"<br/>'
               '<b>Cashier:</b> "We have fresh red apples. How many do you need?"<br/>'
               '<b>Customer:</b> "I need <b>three</b> apples and one banana, please."<br/>'
               '<b>Cashier:</b> "Okay, one pineapple, three apples, and one banana. That is <b>four dollars</b> in total."<br/>'
               '<b>Customer:</b> "Here is the money. <b>Thank you</b>!"<br/>'
               '<b>Cashier:</b> "You are welcome! Have a nice day!"</i>', "ScriptText"))

story.append(Spacer(1, 6))

# ANSWER KEY TABLE
story.append(P("COMPLETE ANSWER KEY & SCORING", "ScriptHead"))

ans_data = [
    [P("<b>Part 1: Prices</b>", "WhiteHeader"), P("<b>Part 2: Quantities</b>", "WhiteHeader"), P("<b>Part 3: Dialogue</b>", "WhiteHeader"), P("<b>Part 4: Fact/False</b>", "WhiteHeader")],
    [
        P("1. Pineapple: <b>A ($1.00)</b><br/>"
          "2. Apples: <b>B ($1.00)</b><br/>"
          "3. Bananas: <b>B ($2.00)</b><br/>"
          "4. Cassava: <b>B ($3.00)</b><br/>"
          "5. Potatoes: <b>C ($4.00)</b>", "InstructionText"),
        P("• Pineapple: <b>1</b><br/>"
          "• Apples: <b>5</b><br/>"
          "• Bananas: <b>3</b><br/>"
          "• Potatoes: <b>4</b><br/>"
          "• Cassava: <b>2</b>", "InstructionText"),
        P("1. <b>pineapple</b><br/>"
          "2. <b>one dollar</b><br/>"
          "3. <b>apples</b><br/>"
          "4. <b>three</b><br/>"
          "5. <b>four dollars</b><br/>"
          "6. <b>Thank you</b>", "InstructionText"),
        P("1. <b>FALSE</b> ($1 not $10)<br/>"
          "2. <b>TRUE</b> (buys 3)<br/>"
          "3. <b>TRUE</b> (polite)<br/>"
          "4. <b>TRUE</b> (Total is $4)", "InstructionText")
    ]
]

t_ans = Table(ans_data, colWidths=[1.8 * inch, 1.8 * inch, 2.1 * inch, 1.8 * inch])
t_ans.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), c_teal),
    ("GRID", (0, 0), (-1, -1), 0.5, c_border),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("BACKGROUND", (0, 1), (-1, -1), c_card_bg),
]))
story.append(t_ans)

doc.build(story, onFirstPage=make_header_footer, onLaterPages=make_header_footer)
print(f"WORKBOOK PDF CREATED: {OUT_PDF}")
