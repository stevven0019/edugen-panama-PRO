from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os

OUT = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\Listening_Test_Kinder_Scenario_4.pdf"

# Use a Unicode font when available (supports Spanish punctuation and accents).
font_candidates = [
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\calibri.ttf",
    r"C:\Windows\Fonts\segoeui.ttf",
]
bold_candidates = [
    r"C:\Windows\Fonts\arialbd.ttf",
    r"C:\Windows\Fonts\calibrib.ttf",
    r"C:\Windows\Fonts\segoeuib.ttf",
]
font = "Helvetica"
bold = "Helvetica-Bold"
for f in font_candidates:
    if os.path.exists(f):
        pdfmetrics.registerFont(TTFont("DocFont", f))
        font = "DocFont"
        break
for f in bold_candidates:
    if os.path.exists(f):
        pdfmetrics.registerFont(TTFont("DocFont-Bold", f))
        bold = "DocFont-Bold"
        break

navy = colors.HexColor("#183B56")
blue = colors.HexColor("#2F80A8")
teal = colors.HexColor("#2A9D8F")
pale = colors.HexColor("#EAF4F7")
gold = colors.HexColor("#F4B942")
ink = colors.HexColor("#243746")
muted = colors.HexColor("#5B6B73")
line = colors.HexColor("#B8CDD5")

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleX", fontName=bold, fontSize=23, leading=27, textColor=navy, alignment=TA_CENTER, spaceAfter=5))
styles.add(ParagraphStyle(name="SubX", fontName=font, fontSize=11, leading=15, textColor=muted, alignment=TA_CENTER, spaceAfter=12))
styles.add(ParagraphStyle(name="HeadX", fontName=bold, fontSize=15, leading=19, textColor=navy, spaceBefore=3, spaceAfter=7))
styles.add(ParagraphStyle(name="BodyX", fontName=font, fontSize=10.5, leading=15, textColor=ink, spaceAfter=5))
styles.add(ParagraphStyle(name="SmallX", fontName=font, fontSize=8.6, leading=12, textColor=muted, spaceAfter=3))
styles.add(ParagraphStyle(name="TaskX", fontName=bold, fontSize=11, leading=15, textColor=navy, spaceAfter=3))
styles.add(ParagraphStyle(name="ListenX", fontName=bold, fontSize=12, leading=17, textColor=ink, spaceAfter=4))
styles.add(ParagraphStyle(name="CellX", fontName=font, fontSize=9.2, leading=12, textColor=ink))
styles.add(ParagraphStyle(name="CellBoldX", fontName=bold, fontSize=9.2, leading=12, textColor=navy))

def P(text, style="BodyX"):
    return Paragraph(text, styles[style])

def box(content, bg=pale, pad=9, border=line):
    t = Table([[content]], colWidths=[7.0*inch])
    t.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),bg),("BOX",(0,0),(-1,-1),0.7,border),
        ("LEFTPADDING",(0,0),(-1,-1),pad),("RIGHTPADDING",(0,0),(-1,-1),pad),
        ("TOPPADDING",(0,0),(-1,-1),pad),("BOTTOMPADDING",(0,0),(-1,-1),pad),
    ]))
    return t

def header_footer(canvas, doc):
    canvas.saveState()
    w,h = letter
    canvas.setFillColor(navy)
    canvas.rect(0,h-0.17*inch,w,0.17*inch,fill=1,stroke=0)
    canvas.setStrokeColor(line)
    canvas.setLineWidth(0.5)
    canvas.line(0.75*inch,0.55*inch,w-0.75*inch,0.55*inch)
    canvas.setFont(font,8)
    canvas.setFillColor(muted)
    canvas.drawString(0.75*inch,0.36*inch,"KINDER • LISTENING • SCENARIO 4: WHERE IS IT?")
    canvas.drawRightString(w-0.75*inch,0.36*inch,f"Page {doc.page}")
    canvas.restoreState()

doc = SimpleDocTemplate(OUT, pagesize=letter, rightMargin=.75*inch, leftMargin=.75*inch, topMargin=.48*inch, bottomMargin=.72*inch, title="Kinder Listening Test - Scenario 4: Where Is It?")
story=[]

# PAGE 1 - child-facing materials
story += [Spacer(1, 0.12*inch), P("LISTEN & PLACE!", "TitleX"), P("KINDER LISTENING CHECK • SCENARIO 4: WHERE IS IT?", "SubX")]
ident = Table([
    [P("<b>Name:</b> ______________________________________________", "BodyX"), P("<b>Date:</b> __________________", "BodyX")],
    [P("<b>Class / Group:</b> _______________________________________", "BodyX"), P("<b>Teacher:</b> _______________", "BodyX")],
], colWidths=[4.55*inch,2.45*inch])
ident.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"MIDDLE"),("BOTTOMPADDING",(0,0),(-1,-1),4)]))
story += [ident, Spacer(1,7), box([P("<b>Today I will listen.</b> I can point, pick up, or move an object to show what I understand. I do not need to read or say the answer.", "BodyX")]), Spacer(1,11),
          P("Get ready!", "HeadX"),
          P("Place these real classroom objects where you can reach them: <b>book, pencil, crayon, bag, chair, desk</b>. The teacher will say each direction two times. Listen, then show the answer.", "BodyX"),
          P("PART A • LISTEN AND DO", "HeadX"),
          P("Teacher: read one direction at a time, twice, in a calm voice. Give the child a few seconds to respond. Do not point to the answer or demonstrate during the scored try.", "SmallX")]

tasks_a = [
    ("1", "Put the book on the desk.", "Move the book onto the desk."),
    ("2", "Put the pencil under the book.", "Slide the pencil beneath the book."),
    ("3", "Put the crayon in the bag.", "Place the crayon inside the bag."),
    ("4", "Put the book next to the chair.", "Place the book beside the chair."),
    ("5", "Touch the desk, then point to the bag.", "Touch desk first; point to bag second."),
]
data=[[P("ITEM","CellBoldX"),P("TEACHER SAYS","CellBoldX"),P("CHILD SHOWS","CellBoldX")]]
for n,say,shows in tasks_a:
    data.append([P(n,"CellBoldX"),P(f"<b>“{say}”</b>","CellX"),P(shows,"CellX")])
t=Table(data,colWidths=[.55*inch,3.15*inch,3.3*inch], repeatRows=1)
t.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),pale),("GRID",(0,0),(-1,-1),.55,line),
    ("VALIGN",(0,0),(-1,-1),"MIDDLE"),("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),
    ("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,colors.HexColor("#F8FBFC")]),
]))
story += [t, Spacer(1,8), P("<b>Teacher scoring:</b> mark one point for the correct independent action after the direction is read. Allow repetition of the direction once. Do not score speech, speed, or reading.", "SmallX"),
          P("PART B • LISTEN AND POINT", "HeadX"),
          P("Set out a book, pencil, crayon, and bag. Keep all four visible. Say each question twice; the child points to one object.", "SmallX")]
items_b=[
    ("6","Show me the crayon."),
    ("7","Where is the pencil? (Place it next to the book first.)"),
    ("8","Point to the book."),
]
data2=[[P("ITEM","CellBoldX"),P("TEACHER SAYS","CellBoldX"),P("POINTS TO","CellBoldX")]]
for n,s in items_b:
    ans={"6":"crayon","7":"pencil","8":"book"}[n]
    data2.append([P(n,"CellBoldX"),P(f"<b>“{s}”</b>","CellX"),P(ans,"CellX")])
t2=Table(data2,colWidths=[.55*inch,4.6*inch,1.85*inch])
t2.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),pale),("GRID",(0,0),(-1,-1),.55,line),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
                       ("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),
                       ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,colors.HexColor("#F8FBFC")])]))
story += [t2, Spacer(1,8), P("My listening score: ______ / 8     <font color='#2A9D8F'><b>I listened and showed what I know!</b></font>", "BodyX"),
          PageBreak()]

# PAGE 2 - teacher administration + scoring
story += [Spacer(1,0.15*inch), P("TEACHER GUIDE", "TitleX"), P("Administration • scoring • learning evidence", "SubX"),
          P("Purpose", "HeadX"),
          P("Check whether a Kinder learner understands familiar classroom-object words and the location words <b>on, under, in, next to</b> when heard in simple spoken directions. This is a receptive listening check: children may respond by moving, touching, or pointing. No reading or spoken English is required.", "BodyX"),
          box([P("<b>Time:</b> about 8-10 minutes per child (or a teacher-monitored small group). &nbsp;&nbsp; <b>Materials:</b> book, pencil, crayon, bag, chair, desk. &nbsp;&nbsp; <b>Set-up:</b> one set of objects per child/group; enough space to move them.", "BodyX")]),
          Spacer(1,10), P("Before the test", "HeadX"),
          P("1. Let the child explore and name/handle the objects before testing; do not rehearse the exact scored directions.<br/>2. Put the objects in a neutral starting arrangement before each item. For Item 2, place the pencil on the desk and book nearby. For Item 3, take the crayon out of the bag. For Item 4, move book away from chair. For Item 5, reset both objects.<br/>3. Read each exact prompt twice, with a short pause. Keep your hands still while speaking. Give up to 8 seconds for a response.<br/>4. If the child does not respond, repeat once. Mark whether the answer was independent or followed a prompt. A gesture, pointing, or correct action is a valid listening response.", "BodyX"),
          P("Scoring record", "HeadX")]

score_rows=[[P("Item","CellBoldX"),P("Target","CellBoldX"),P("1 point when the child...","CellBoldX"),P("Score","CellBoldX")]]
rubric=[
    ("1","on","puts book on desk"),
    ("2","under","puts pencil under book"),
    ("3","in","puts crayon inside bag"),
    ("4","next to","puts book beside chair"),
    ("5","sequence","touches desk, then points to bag"),
    ("6","crayon","points to crayon"),
    ("7","pencil","points to pencil beside book"),
    ("8","book","points to book"),
]
for n,target,criterion in rubric:
    score_rows.append([P(n,"CellX"),P(target,"CellX"),P(criterion,"CellX"),P("____","CellX")])
tb=Table(score_rows,colWidths=[.48*inch,1.0*inch,4.6*inch,.92*inch],repeatRows=1)
tb.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),pale),("GRID",(0,0),(-1,-1),.5,line),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
                        ("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),
                        ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,colors.HexColor("#F8FBFC")])]))
story += [tb, Spacer(1,6), P("<b>Score:</b> ______ / 8 &nbsp;&nbsp;&nbsp; <b>Independent correct:</b> ______ &nbsp;&nbsp;&nbsp; <b>Correct after one repeat:</b> ______", "BodyX"),
          P("How to interpret", "HeadX")]
levels=[
    [P("7-8","CellBoldX"),P("<b>Listening target met today.</b> Follows the familiar words and location directions with consistent understanding.", "CellX")],
    [P("4-6","CellBoldX"),P("<b>Developing.</b> Understands some words or locations. Revisit the missed words using real objects and gestures, then check again on another day.", "CellX")],
    [P("0-3","CellBoldX"),P("<b>Needs more practice and another observation.</b> Model one direction at a time, support with objects, and recheck after practice. Consider attention, familiarity, language exposure, and comfort before drawing conclusions.", "CellX")],
]
tl=Table(levels,colWidths=[.8*inch,6.2*inch])
tl.setStyle(TableStyle([("BACKGROUND",(0,0),(0,-1),pale),("GRID",(0,0),(-1,-1),.5,line),("VALIGN",(0,0),(-1,-1),"MIDDLE"),
                       ("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)]))
story += [PageBreak(), Spacer(1,0.15*inch), P("RECORD & NEXT STEPS", "TitleX"), P("Use this page to capture the result and plan a short follow-up", "SubX"), tl, Spacer(1,12), P("Observation notes", "HeadX"),
          P("What did the child understand easily? ___________________________________________________________<br/><br/>Which word or direction needs practice? __________________________________________________________<br/><br/>Next step: ______________________________________________________________________________________", "BodyX"),
          P("Learning evidence: individual actions and pointing responses show understanding of the lesson vocabulary in a meaningful classroom task. The score is a short formative snapshot; pair it with everyday observation.", "SmallX"),
          Spacer(1,8), box([P("<b>Teacher reminder:</b> keep the experience encouraging and playful. Praise careful listening, give wait time, and avoid comparing children. Use each child's results to choose the next small practice step.", "BodyX")], bg=colors.HexColor("#FFF7E2"), border=gold)]

doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
print(OUT)

