from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Image as RLImage
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os

OUT_PDF = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\Student_Activities_4thGrade_Shopping_Market.pdf"

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

styles = getSampleStyleSheet()

styles.add(ParagraphStyle(name="DocHeaderTitle", fontName=bold, fontSize=17, leading=21, textColor=c_navy, alignment=TA_CENTER, spaceAfter=2))
styles.add(ParagraphStyle(name="DocHeaderSub", fontName=font, fontSize=8.5, leading=11.5, textColor=c_muted, alignment=TA_CENTER, spaceAfter=6))

styles.add(ParagraphStyle(name="StageBanner", fontName=bold, fontSize=10, leading=13, textColor=colors.white, alignment=TA_LEFT))
styles.add(ParagraphStyle(name="InstructionText", fontName=font, fontSize=8.2, leading=11, textColor=c_dark, spaceAfter=4))
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

IMG_BASE = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public\assets\nouns"

def get_img(name, w=0.75*inch, h=0.75*inch):
    p = os.path.join(IMG_BASE, name)
    if os.path.exists(p):
        return RLImage(p, width=w, height=h)
    return P(f"[{name}]", "CenterBold")

def make_header_footer(canvas, doc):
    canvas.saveState()
    w, h = letter
    canvas.setFillColor(c_navy)
    canvas.rect(0, h - 0.14 * inch, w, 0.14 * inch, fill=1, stroke=0)
    canvas.setStrokeColor(c_border)
    canvas.setLineWidth(0.5)
    canvas.line(0.45 * inch, 0.42 * inch, w - 0.45 * inch, 0.42 * inch)
    canvas.setFillColor(c_muted)
    canvas.setFont(font, 7.2)
    canvas.drawString(0.45 * inch, 0.26 * inch, "EDUGEN PANAMA • 4TH GRADE (CEFR A1.2) • SCENARIO 3: SHOPPING AT THE MARKET • THEME 1")
    canvas.drawRightString(w - 0.45 * inch, 0.26 * inch, f"Page {doc.page} of 3")
    canvas.restoreState()

doc = SimpleDocTemplate(
    OUT_PDF,
    pagesize=letter,
    leftMargin=0.45 * inch,
    rightMargin=0.45 * inch,
    topMargin=0.35 * inch,
    bottomMargin=0.50 * inch,
    title="4th Grade Student Activities - Shopping at the Market"
)

story = []

# =========================================================================
# PAGE 1: STAGE 1 (WARM-UP), STAGE 2 (PRESENTATION) & VOCABULARY
# =========================================================================

story.append(P("LEARNER ACTIVITY WORKBOOK: SHOPPING AT THE MARKET", "DocHeaderTitle"))
story.append(P("4th Grade English (CEFR A1.2) • Theme 1: How Much Is the Pineapple? • Action-Oriented Sequence", "DocHeaderSub"))

# Student Identification
id_data = [
    [P("<b>Student Name:</b> ________________________________________________", "InstructionText"), P("<b>Date:</b> ____________________", "InstructionText")],
    [P("<b>Group / Section:</b> 4th Grade ________", "InstructionText"), P("<b>Role Today:</b> [ &nbsp; ] Customer &nbsp; [ &nbsp; ] Cashier", "InstructionText")]
]
id_table = Table(id_data, colWidths=[4.9 * inch, 2.7 * inch])
id_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
    ("BOX", (0, 0), (-1, -1), 0.8, c_border),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
]))
story.append(id_table)
story.append(Spacer(1, 6))

# STAGE 1 BANNER
s1_banner = Table([[P("<b>STAGE 1: WARM-UP & SOUND DETECTIVE (Modeling & Clarification)</b>", "StageBanner")]], colWidths=[7.6 * inch])
s1_banner.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), c_navy),
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
]))
story.append(s1_banner)
story.append(Spacer(1, 4))

story.append(P("<b>Task 1: Look, Say and Match the Sound!</b> Say each word aloud. Notice the <b>/p/</b> sound in <i>pineapple</i> and <i>potatoes</i>, and the <b>/m/</b> sound in <i>market</i> and <i>money</i>.", "InstructionText"))

# 5 Market Flashcards Table
s1_items = [
    [
        [get_img("pineapple.png", 0.75*inch, 0.75*inch), P("<b>Pineapple</b>", "CenterBold"), P("Sound: <b>/p/</b>", "CenterText")],
        [get_img("apple.png", 0.75*inch, 0.75*inch), P("<b>Apples</b>", "CenterBold"), P("Countable", "CenterText")],
        [get_img("banana.png", 0.75*inch, 0.75*inch), P("<b>Bananas</b>", "CenterBold"), P("bunch", "CenterText")],
        [get_img("cassava.png", 0.75*inch, 0.75*inch), P("<b>Cassava (Yuca)</b>", "CenterBold"), P("fresh bag", "CenterText")],
        [get_img("potatoes.png", 0.75*inch, 0.75*inch), P("<b>Potatoes</b>", "CenterBold"), P("Sound: <b>/p/</b>", "CenterText")],
        [get_img("money.png", 0.75*inch, 0.75*inch), P("<b>Money / Dollars</b>", "CenterBold"), P("Sound: <b>/m/</b>", "CenterText")],
    ]
]
t_s1 = Table(s1_items, colWidths=[1.26 * inch, 1.26 * inch, 1.26 * inch, 1.26 * inch, 1.26 * inch, 1.26 * inch])
t_s1.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), c_card_bg),
    ("BOX", (0, 0), (-1, -1), 0.6, c_border),
    ("INNERGRID", (0, 0), (-1, -1), 0.4, c_border),
    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
]))
story.append(t_s1)
story.append(Spacer(1, 6))

# Quick Concept Check Box (CCQs from plan)
ccq_box = [
    [
        P("<b>Quick Clarification Check (CCQ):</b><br/>"
          "1. When you ask <i>'How much is the pineapple?'</i>, are you asking for its name or its price? &nbsp; <b>[ &nbsp; ] Name &nbsp;&nbsp; [ &nbsp; ] Price</b><br/>"
          "2. If you want 2 bananas, do you say: &nbsp; <b>[ &nbsp; ] 'I have two bananas' &nbsp;&nbsp; [ &nbsp; ] 'I need two bananas'</b>", "InstructionText")
    ]
]
t_ccq = Table(ccq_box, colWidths=[7.6 * inch])
t_ccq.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), c_gold_bg),
    ("BOX", (0, 0), (-1, -1), 0.7, c_gold_border),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(t_ccq)
story.append(Spacer(1, 8))

# STAGE 2 BANNER
s2_banner = Table([[P("<b>STAGE 2: PRESENTATION — THE OFFICIAL MARKET DIALOGUE & COMPREHENSION</b>", "StageBanner")]], colWidths=[7.6 * inch])
s2_banner.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), c_teal),
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
]))
story.append(s2_banner)
story.append(Spacer(1, 4))

story.append(P("<b>Task 2: Read along with the model dialogue from your lesson plan:</b>", "InstructionText"))

diag_data = [
    [get_img("cashier.png", 0.42*inch, 0.42*inch), P("<b>Seller:</b>", "SpeakerLabel"), P('"Hello! Can I help you?"', "DialogueLine")],
    [get_img("market.png", 0.42*inch, 0.42*inch), P("<b>Customer:</b>", "SpeakerLabel"), P('"Yes, please. <b>Excuse me, how much is the pineapple?</b>"', "DialogueLine")],
    [get_img("cashier.png", 0.42*inch, 0.42*inch), P("<b>Seller:</b>", "SpeakerLabel"), P('"It is <b>one dollar</b>."', "DialogueLine")],
    [get_img("market.png", 0.42*inch, 0.42*inch), P("<b>Customer:</b>", "SpeakerLabel"), P('"Okay. And <b>how many apples do you need?</b>"', "DialogueLine")],
    [get_img("market.png", 0.42*inch, 0.42*inch), P("<b>Customer:</b>", "SpeakerLabel"), P('"<b>I need three apples</b> and one banana, please."', "DialogueLine")],
    [get_img("cashier.png", 0.42*inch, 0.42*inch), P("<b>Seller:</b>", "SpeakerLabel"), P('"Okay, three apples and one banana. <b>That\'s four dollars.</b>"', "DialogueLine")],
    [get_img("money.png", 0.42*inch, 0.42*inch), P("<b>Customer:</b>", "SpeakerLabel"), P('"Here is the money. <b>Thank you!</b>"', "DialogueLine")],
]
t_diag = Table(diag_data, colWidths=[0.6 * inch, 1.1 * inch, 5.9 * inch])
t_diag.setStyle(TableStyle([
    ("GRID", (0, 0), (-1, -1), 0.4, c_border),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("ALIGN", (0, 0), (0, -1), "CENTER"),
    ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, c_card_bg]),
    ("TOPPADDING", (0, 0), (-1, -1), 2),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
]))
story.append(t_diag)
story.append(Spacer(1, 6))

# Comprehension Questions from plan
q_comp = [
    [
        P("<b>Comprehension Questions (Answer in pairs):</b><br/>"
          "• Who is talking in the dialogue? ___________________________________________<br/>"
          "• How much is the pineapple? __________________ &nbsp;&nbsp;|&nbsp;&nbsp; How many apples does the customer need? __________________", "InstructionText")
    ]
]
t_qcomp = Table(q_comp, colWidths=[7.6 * inch])
t_qcomp.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F0FDF4")),
    ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#86EFAC")),
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(t_qcomp)

story.append(PageBreak())

# =========================================================================
# PAGE 2: STAGE 3 (PREPARATION) + EL JUEGO LÚDICO EN PREPARATION
# =========================================================================

story.append(P("STAGE 3: PREPARATION & ACCURACY DRILLS + THE MARKET GAME", "DocHeaderTitle"))
story.append(P("Controlled Practice, Substitution Drill & Gamified Preparation", "DocHeaderSub"))

s3_banner = Table([[P("<b>STAGE 3: CONTROLLED PRACTICE & SUBSTITUTION DRILLS (Oral & Written)</b>", "StageBanner")]], colWidths=[7.6 * inch])
s3_banner.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#D97706")), # Amber
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
]))
story.append(s3_banner)
story.append(Spacer(1, 4))

story.append(P("<b>Step 1: Controlled Sentence Completion.</b> Complete the sentence frames orally with your partner:", "InstructionText"))

frames_data = [
    [P("1. I ____________ two bananas. &nbsp; <i>(need / has)</i>", "BoldText"), P("Answer: <b>I need two bananas.</b>", "InstructionText")],
    [P("2. How ____________ is the pineapple? &nbsp; <i>(many / much)</i>", "BoldText"), P("Answer: <b>How much is the pineapple?</b>", "InstructionText")],
    [P("3. I need three ____________ . &nbsp; <i>(apples / money)</i>", "BoldText"), P("Answer: <b>I need three apples.</b>", "InstructionText")],
    [P("4. It is ____________ dollars. &nbsp; <i>(four / pineapple)</i>", "BoldText"), P("Answer: <b>It is four dollars.</b>", "InstructionText")],
]
t_frames = Table(frames_data, colWidths=[4.2 * inch, 3.4 * inch])
t_frames.setStyle(TableStyle([
    ("GRID", (0, 0), (-1, -1), 0.4, c_border),
    ("BACKGROUND", (0, 0), (-1, -1), colors.white),
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
]))
story.append(t_frames)
story.append(Spacer(1, 8))

# EL JUEGO EN PREPARATION (SOLICITADO POR EL USUARIO)
game_banner = Table([[P("<b>🎲 THE SUPERMARKET DASH & PRICE MATCH GAME (Juego Lúdico en Preparation)</b>", "StageBanner")]], colWidths=[7.6 * inch])
game_banner.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#7C3AED")), # Purple
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
]))
story.append(game_banner)
story.append(Spacer(1, 4))

game_desc = """<b>How to Play 'The Supermarket Dash':</b><br/>
1. <b>Teams of 2 to 3 players:</b> Player A is the Customer, Player B is the Vendor, Player C is the Bank/Scorekeeper.<br/>
2. <b>Roll the dice or pick a number (1 to 6):</b> The number on the dice determines the quantity needed.<br/>
3. <b>Draw a Fruit/Vegetable card:</b> Customer must say the complete sentence: <i>"Excuse me, I need [dice number] [item]s. How much is it?"</i><br/>
4. <b>Vendor calculates the cost</b> using the Official Price Board: <i>"It is [Total] dollars."</i> If spoken correctly without mistakes, Player wins 1 Dollar Token in their basket! First to collect $10 wins!"""

t_game_desc = Table([[P(game_desc, "GameRule")]], colWidths=[7.6 * inch])
t_game_desc.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F5F3FF")),
    ("BOX", (0, 0), (-1, -1), 0.8, colors.HexColor("#C4B5FD")),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(t_game_desc)
story.append(Spacer(1, 6))

story.append(P("<b>Game Play Board & Dice Card Matrix:</b>", "InstructionText"))

board_data = [
    [
        P("<b>Dice #</b>", "WhiteHeader"),
        P("<b>Item Card & Picture</b>", "WhiteHeader"),
        P("<b>Unit Price</b>", "WhiteHeader"),
        P("<b>Oral Sentence to Say (Customer)</b>", "WhiteHeader"),
        P("<b>Vendor Total Response</b>", "WhiteHeader")
    ],
    [
        P("🎲 1", "CenterBold"),
        get_img("pineapple.png", 0.45*inch, 0.45*inch),
        P("$1.00 each", "CenterText"),
        P('"I need 1 pineapple. How much is it?"', "InstructionText"),
        P('"It is $1.00."', "InstructionText")
    ],
    [
        P("🎲 2", "CenterBold"),
        get_img("apple.png", 0.45*inch, 0.45*inch),
        P("$1.00 each", "CenterText"),
        P('"I need 2 apples. How much is it?"', "InstructionText"),
        P('"That is $2.00."', "InstructionText")
    ],
    [
        P("🎲 3", "CenterBold"),
        get_img("banana.png", 0.45*inch, 0.45*inch),
        P("$2.00 bunch", "CenterText"),
        P('"I need 3 bunches of bananas. How much?"', "InstructionText"),
        P('"That is $6.00."', "InstructionText")
    ],
    [
        P("🎲 4", "CenterBold"),
        get_img("potatoes.png", 0.45*inch, 0.45*inch),
        P("$2.00 bag", "CenterText"),
        P('"I need 4 bags of potatoes. How much?"', "InstructionText"),
        P('"That is $8.00."', "InstructionText")
    ],
    [
        P("🎲 5", "CenterBold"),
        get_img("cassava.png", 0.45*inch, 0.45*inch),
        P("$3.00 bag", "CenterText"),
        P('"I need 5 cassavas. How much?"', "InstructionText"),
        P('"That is $15.00."', "InstructionText")
    ],
]

t_board = Table(board_data, colWidths=[0.7 * inch, 1.4 * inch, 1.0 * inch, 2.7 * inch, 1.8 * inch])
t_board.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#7C3AED")),
    ("GRID", (0, 0), (-1, -1), 0.5, c_border),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("ALIGN", (0, 0), (2, -1), "CENTER"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_card_bg]),
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
]))
story.append(t_board)

story.append(PageBreak())

# =========================================================================
# PAGE 3: STAGE 4 (PERFORMANCE ROLE-PLAY), STAGE 5 (EVALUATION) & STAGE 6 (REFLECTION)
# =========================================================================

story.append(P("STAGE 4, 5 & 6: REAL PERFORMANCE ROLE-PLAY & REFLECTION", "DocHeaderTitle"))
story.append(P("Communicative Mission, Observation Rubric & Exit Ticket", "DocHeaderSub"))

s4_banner = Table([[P("<b>STAGE 4: PERFORMANCE ROLE-PLAY — 'SHOPPING AT THE MARKET'</b>", "StageBanner")]], colWidths=[7.6 * inch])
s4_banner.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), c_navy),
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
]))
story.append(s4_banner)
story.append(Spacer(1, 4))

story.append(P("<b>Task 3: Real Market Role-Play Mission.</b> Cut or pick one Shopping List. Customer asks and buys; Cashier calculates and charges.", "InstructionText"))

# 4 Shopping Lists Cards
list_cards = [
    [
        P("<b>SHOPPING LIST A</b><br/>• 2 pineapples<br/>• 5 apples<br/>• 3 potatoes<br/>• 1 cassava<br/><b>Expected Total:</b> $16.00", "InstructionText"),
        P("<b>SHOPPING LIST B</b><br/>• 1 pineapple<br/>• 3 apples<br/>• 1 banana bunch<br/>• 2 potatoes<br/><b>Expected Total:</b> $10.00", "InstructionText"),
        P("<b>SHOPPING LIST C</b><br/>• 3 pineapples<br/>• 2 cassavas<br/>• 4 apples<br/>• 2 banana bunches<br/><b>Expected Total:</b> $17.00", "InstructionText"),
        P("<b>SELLER PRICE STAND</b><br/>• Pineapple: $1.00<br/>• Apple: $1.00<br/>• Banana: $2.00<br/>• Potato: $2.00<br/>• Cassava: $3.00", "InstructionText"),
    ]
]
t_lists = Table(list_cards, colWidths=[1.9 * inch, 1.9 * inch, 1.9 * inch, 1.9 * inch])
t_lists.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (2, -1), c_card_bg),
    ("BACKGROUND", (3, 0), (3, -1), c_gold_bg),
    ("BOX", (0, 0), (-1, -1), 0.6, c_border),
    ("INNERGRID", (0, 0), (-1, -1), 0.5, c_border),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
]))
story.append(t_lists)
story.append(Spacer(1, 8))

# STAGE 5: ASSESSMENT & RUBRIC
s5_banner = Table([[P("<b>STAGE 5: FORMATIVE ASSESSMENT — TEACHER CHECKLIST & PEER EVALUATION</b>", "StageBanner")]], colWidths=[7.6 * inch])
s5_banner.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), c_teal),
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
]))
story.append(s5_banner)
story.append(Spacer(1, 4))

rubric_data = [
    [P("<b>Evaluation Criteria (from Lesson Plan)</b>", "WhiteHeader"), P("<b>Observable Evidence in Role-Play</b>", "WhiteHeader"), P("<b>Status</b>", "WhiteHeader")],
    [P("1. Intelligible Pronunciation", "BoldText"), P("Clear /p/ in <i>pineapple/potatoes</i>, /m/ in <i>money/much</i>, numbers 1-20.", "InstructionText"), P("[ &nbsp; ] Yes &nbsp; [ &nbsp; ] Almost", "CenterText")],
    [P("2. Target Vocabulary", "BoldText"), P("Uses <i>market, price, need, pineapple, apple, banana, cassava, potatoes</i>.", "InstructionText"), P("[ &nbsp; ] Yes &nbsp; [ &nbsp; ] Almost", "CenterText")],
    [P("3. Target Grammar", "BoldText"), P("Asks <i>'How much is...?'</i>, <i>'How many...?'</i> and states <i>'I need five...'</i>.", "InstructionText"), P("[ &nbsp; ] Yes &nbsp; [ &nbsp; ] Almost", "CenterText")],
    [P("4. Sociolinguistic Appropriateness", "BoldText"), P("Uses polite words: <i>'Excuse me'</i>, <i>'Please'</i>, <i>'Thank you'</i>, <i>'You're welcome'</i>.", "InstructionText"), P("[ &nbsp; ] Yes &nbsp; [ &nbsp; ] Almost", "CenterText")],
]
t_rubric = Table(rubric_data, colWidths=[2.2 * inch, 4.0 * inch, 1.4 * inch])
t_rubric.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), c_teal),
    ("GRID", (0, 0), (-1, -1), 0.4, c_border),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, c_card_bg]),
    ("TOPPADDING", (0, 0), (-1, -1), 3),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
]))
story.append(t_rubric)
story.append(Spacer(1, 8))

# STAGE 5 EXIT TICKET & STAGE 6 REFLECTION (EXACT FROM USER'S FILE)
exit_data = [
    [
        P("<b>STUDENT EXIT TICKET (Lesson Plan Stage 5):</b><br/>"
          "1. Can I ask <i>'How much is it?'</i> for different market items?<br/>"
          "&nbsp;&nbsp;&nbsp;&nbsp;<b>[ &nbsp; ] YES &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] NO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] A LITTLE</b><br/><br/>"
          "2. Can I tell my partner how many items I need using numbers?<br/>"
          "&nbsp;&nbsp;&nbsp;&nbsp;<b>[ &nbsp; ] YES &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] NO &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] A LITTLE</b>", "InstructionText"),
        P("<b>STUDENT SELF-REFLECTION (Stage 6):</b><br/>"
          "• <b>What was easy for me today?</b><br/>"
          "____________________________________________________<br/><br/>"
          "• <b>What was difficult, and how can I improve?</b><br/>"
          "____________________________________________________", "InstructionText")
    ]
]
t_exit = Table(exit_data, colWidths=[3.8 * inch, 3.8 * inch])
t_exit.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), c_green_bg),
    ("BOX", (0, 0), (-1, -1), 0.8, c_green),
    ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#A7F3D0")),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(t_exit)

doc.build(story, onFirstPage=make_header_footer, onLaterPages=make_header_footer)
print(f"STUDENT ACTIVITIES PDF CREATED: {OUT_PDF}")
