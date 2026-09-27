from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os

OUT_PDF = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\CEFR_Linguistic_Competence_Activities_Chart.pdf"

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

# Palette inspired by reference table & CEFR bands
c_navy = colors.HexColor("#0D3B66")
c_teal = colors.HexColor("#0081A7")
c_amber = colors.HexColor("#E07A5F")
c_emerald = colors.HexColor("#2A9D8F")
c_gold = colors.HexColor("#F4A261")
c_purple = colors.HexColor("#6B2D5C")
c_dark = colors.HexColor("#1A252C")
c_muted = colors.HexColor("#4A5568")
c_border = colors.HexColor("#CBD5E1")
c_bg_light = colors.HexColor("#F8FAFC")
c_bg_head = colors.HexColor("#0081A7")

styles = getSampleStyleSheet()

styles.add(ParagraphStyle(name="MainTitle", fontName=bold, fontSize=16, leading=19, textColor=c_navy, alignment=TA_CENTER, spaceAfter=2))
styles.add(ParagraphStyle(name="MainSubtitle", fontName=font, fontSize=8.5, leading=11, textColor=c_muted, alignment=TA_CENTER, spaceAfter=6))
styles.add(ParagraphStyle(name="SectionBanner", fontName=bold, fontSize=9.5, leading=12, textColor=colors.white, alignment=TA_LEFT))
styles.add(ParagraphStyle(name="ColHeader", fontName=bold, fontSize=7.5, leading=9.5, textColor=colors.white, alignment=TA_CENTER))

styles.add(ParagraphStyle(name="RefCell", fontName=font, fontSize=7.0, leading=8.8, textColor=c_dark))
styles.add(ParagraphStyle(name="RefCellBold", fontName=bold, fontSize=7.5, leading=9.2, textColor=c_navy))

styles.add(ParagraphStyle(name="ActCell", fontName=font, fontSize=6.8, leading=8.6, textColor=c_dark))
styles.add(ParagraphStyle(name="ActTitle", fontName=bold, fontSize=7.2, leading=9.0, textColor=c_navy))
styles.add(ParagraphStyle(name="ActTag", fontName=bold, fontSize=6.2, leading=7.5, textColor=c_teal))

styles.add(ParagraphStyle(name="FooterText", fontName=font, fontSize=6.5, leading=8.5, textColor=c_muted))

def P(txt, s_name="ActCell"):
    return Paragraph(txt, styles[s_name])

def make_header_footer(canvas, doc):
    canvas.saveState()
    w, h = landscape(letter)
    # Top banner stripe
    canvas.setFillColor(c_navy)
    canvas.rect(0, h - 0.12 * inch, w, 0.12 * inch, fill=1, stroke=0)
    # Bottom dividing line
    canvas.setStrokeColor(c_border)
    canvas.setLineWidth(0.6)
    canvas.line(0.4 * inch, 0.38 * inch, w - 0.4 * inch, 0.38 * inch)
    # Bottom text
    canvas.setFillColor(c_muted)
    canvas.setFont(font, 6.5)
    canvas.drawString(0.4 * inch, 0.22 * inch, "EDUGEN PANAMA • CEFR LINGUISTIC COMPETENCE ACTIVITY MATRIX • ACTION-ORIENTED APPROACH (AOA)")
    canvas.drawRightString(w - 0.4 * inch, 0.22 * inch, f"Page {doc.page} of 4")
    canvas.restoreState()

doc = SimpleDocTemplate(
    OUT_PDF,
    pagesize=landscape(letter),
    leftMargin=0.4 * inch,
    rightMargin=0.4 * inch,
    topMargin=0.35 * inch,
    bottomMargin=0.45 * inch,
    title="CEFR Linguistic Competence Across 4 Groups & Skills"
)

# Total usable width = 11.0 - 0.8 = 10.2 inches = 734.4 points
# Columns:
# 1. CEFR Level & Grades + Focus / Linguistic Components: 1.6 in
# 2. Listening: 1.7 in
# 3. Reading: 1.7 in
# 4. Speaking: 1.7 in
# 5. Writing: 1.7 in
# 6. Mediation (21st Century Projects: Theme 1 & Theme 2): 1.8 in
# Sum = 1.6 + 1.7 + 1.7 + 1.7 + 1.7 + 1.8 = 10.2 inches

COL_WIDTHS = [1.60 * inch, 1.72 * inch, 1.72 * inch, 1.72 * inch, 1.72 * inch, 1.72 * inch]

headers_row = [
    P("<b>PROFICIENCY LEVEL &<br/>CEFR REFERENCE</b>", "ColHeader"),
    P("<b>LISTENING<br/>(LÚDICA & CONCRETA)</b>", "ColHeader"),
    P("<b>READING<br/>(LÚDICA & CONCRETA)</b>", "ColHeader"),
    P("<b>SPEAKING<br/>(LÚDICA & CONCRETA)</b>", "ColHeader"),
    P("<b>WRITING<br/>(LÚDICA & CONCRETA)</b>", "ColHeader"),
    P("<b>MEDIATION (21ST CENTURY)<br/>THEME 1 & THEME 2 PROJECTS</b>", "ColHeader"),
]

story = []

# PAGE 1: GROUP 1 - FOUNDATIONAL LEARNER (Pre A1)
story.append(P("TABLE 1. LINGUISTIC COMPETENCE ACROSS CEFR LEVELS", "MainTitle"))
story.append(P("Pedagogical Activity Matrix • Playful & Concrete Activities Aligned to 4 Macro-Skills and 21st Century Mediation Projects", "MainSubtitle"))

banner_g1 = Table([[P("<b>GROUP 1: FOUNDATIONAL LEARNER (CEFR Pre A1)</b> • Play-Based Sensory Learning, Sound Awareness & Emergent Literacy", "SectionBanner")]], colWidths=[10.2 * inch])
banner_g1.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#D97706")), # Amber/Gold
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(banner_g1)
story.append(Spacer(1, 3))

g1_rows = [headers_row]

# Row 1: Pre-K (Pre A1.1) & Kinder (Pre A1.2)
r1_ref = """<b>Pre-K (Pre A1.1)<br/>Kinder (Pre A1.2)</b><br/>
<font color="#B45309"><b>Pre A1</b></font><br/><br/>
<b>Focus:</b> Building a foundation in English sounds, letters, and basic vocabulary.<br/><br/>
<b>Key Considerations:</b> Play-based learning, sensory activities, visual aids, total physical response (TPR), labeling, and modeling.<br/><br/>
<b>Linguistic Components:</b> Primarily phonology (sound awareness), with beginnings of letter recognition (orthography) and basic vocabulary (semantics)."""

r1_lis = """<b>1. Sound Detective & Musical Statues (TPR)</b><br/>
<i>Materials:</i> Realia objects (book, ball, desk, crayon) & drum.<br/>
<i>How it works:</i> Teacher beats rhythm and makes target sounds (/s/ snake, /b/ bounce). When rhythm stops, teacher calls "Touch the yellow pencil!" Children run safely to touch real objects.<br/>
<i>Evidence:</i> Responds non-verbally with accurate physical touch."""

r1_rea = """<b>2. Sensory Sandpaper & Object Match</b><br/>
<i>Materials:</i> Textured alphabet cards (A, B, S, M) & mini toy basket.<br/>
<i>How it works:</i> Children trace sandpaper letters with index finger while vocalizing the phoneme (/b/), then place miniature realia (ball, book) inside the letter tray.<br/>
<i>Evidence:</i> Correctly associates initial letter shape with target sound and concrete object."""

r1_spe = """<b>3. Magic Box Puppet Echo & Turns</b><br/>
<i>Materials:</i> "Sammy the Sloth" puppet & mystery treasure box.<br/>
<i>How it works:</i> Puppet pulls out a classroom item, pretends to be surprised and asks: "What is this?" Children echo: "A book!" and practice polite turns: "Hello Sammy! Thank you!".<br/>
<i>Evidence:</i> Produces single high-frequency words and basic polite greeting with puppet."""

r1_wri = """<b>4. Playdough Letter Sculpt & Air Trace</b><br/>
<i>Materials:</i> Colorful playdough, laminated letter mats, water brushes.<br/>
<i>How it works:</i> Children roll playdough "snakes" to shape letter lines (I, T, O), then use wet paintbrushes on small chalkboards to trace basic strokes matching classroom realia.<br/>
<i>Evidence:</i> Demonstrates fine motor grip and emergent letter stroke formation."""

r1_med = """<font color="#D97706"><b>THEME 1: Project 1 (Social Mediation)</b></font><br/>
<b>• Classroom Kindness & Routine Wall:</b> In pairs, learners match visual icon cards ("Share toys", "Sit nicely", "Big ears listen") and stick them onto a classroom mural, guiding peers with gestures.<br/><br/>
<font color="#2563EB"><b>THEME 2: 21st Cent. Skill Project 2</b></font><br/>
<b>• Sensory Color Sorting Challenge:</b> Small teams solve a concrete sensory puzzle ("Help the teddy bear find 5 soft green items") and show a smiley badge."""

g1_rows.append([P(r1_ref, "RefCell"), P(r1_lis, "ActCell"), P(r1_rea, "ActCell"), P(r1_spe, "ActCell"), P(r1_wri, "ActCell"), P(r1_med, "ActCell")])

# Row 2: Grade 1 (Pre A1.3) & Grade 2 (Pre A1.4)
r2_ref = """<b>Grade 1 (Pre A1.3)<br/>Grade 2 (Pre A1.4)</b><br/>
<font color="#B45309"><b>Pre A1</b></font><br/><br/>
<b>Focus:</b> Expanding vocabulary, basic grammar, and simple communication.<br/><br/>
<b>Key Considerations:</b> Visual aids, sentence frames, repetition and practice, corrective feedback, collaborative activities.<br/><br/>
<b>Linguistic Components:</b> Phonology (sound awareness), morphology (basic word formation: plurals -s), syntax (simple sentence structures: SVO), semantics (basic vocabulary)."""

r2_lis = """<b>1. Action Relay & Color-Shape Bingo</b><br/>
<i>Materials:</i> 3x3 illustrated bingo grid & foam stamps.<br/>
<i>How it works:</i> Teacher calls syntax cues: "The boy touches a red chair" or "Find two pencils". Students identify syntax cues (color + noun, number + plural) and stamp grid.<br/>
<i>Evidence:</i> Discriminates plural endings (-s) and color modifiers from oral instructions."""

r2_rea = """<b>2. Phonics Hopscotch & Pocket Chart</b><br/>
<i>Materials:</i> Floor hopscotch mat (CVC words: cat, desk, pen, bag).<br/>
<i>How it works:</i> Child hops onto word tile, sounds it out, picks the corresponding card, and inserts into pocket chart frame: "[The pen] is [blue]."<br/>
<i>Evidence:</i> Blends phonemes into simple CVC words and reads basic sentence frame."""

r2_spe = """<b>3. Market Basket Realia Role-Play</b><br/>
<i>Materials:</i> Toy market stall, play fruit/supplies, sentence strips.<br/>
<i>How it works:</i> In pairs, Student A is shopkeeper, Student B is shopper using stand frame: "Can I have the [red apple], please?" / "Here you are!" / "Thank you!".<br/>
<i>Evidence:</i> Delivers 2-turn polite exchange using simple formulaic frames."""

r2_wri = """<b>4. Color-Coded Sentence Train Builder</b><br/>
<i>Materials:</i> Magnetic colored word blocks (Yellow=Subject, Green=Verb, Blue=Object).<br/>
<i>How it works:</i> Children snap blocks together ("I" + "see" + "three books"), copy sentence into primary lined notebooks, and sketch the scene.<br/>
<i>Evidence:</i> Constructs simple SVO sentence with correct word order and spacing."""

r2_med = """<font color="#D97706"><b>THEME 1: Project 1 (Peer Mediation)</b></font><br/>
<b>• Classroom Helper Buddy Passport:</b> Students pair up; one guides a peer to find missing classroom realia using visual-gesture directions, stamping their partner's "Helper Passport".<br/><br/>
<font color="#2563EB"><b>THEME 2: 21st Cent. Skill Project 2</b></font><br/>
<b>• 3-Step Daily Storyboard & Audio:</b> Teams sequence 3 illustrated steps ("First I wash hands", "Next I eat"), record a tablet voice snippet, and present to class."""

g1_rows.append([P(r2_ref, "RefCell"), P(r2_lis, "ActCell"), P(r2_rea, "ActCell"), P(r2_spe, "ActCell"), P(r2_wri, "ActCell"), P(r2_med, "ActCell")])

t_g1 = Table(g1_rows, colWidths=COL_WIDTHS, repeatRows=1)
t_g1.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), c_navy),
    ("GRID", (0, 0), (-1, -1), 0.5, c_border),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 5),
    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("BACKGROUND", (0, 1), (0, -1), colors.HexColor("#FEF3C7")), # Light yellow for Pre A1
    ("BACKGROUND", (1, 1), (-1, 1), colors.white),
    ("BACKGROUND", (1, 2), (-1, 2), c_bg_light),
]))

story.append(t_g1)
story.append(PageBreak())

# PAGE 2: GROUP 2 - BEGINNER (A1)
story.append(P("TABLE 1. LINGUISTIC COMPETENCE ACROSS CEFR LEVELS", "MainTitle"))
story.append(P("Pedagogical Activity Matrix • Playful & Concrete Activities Aligned to 4 Macro-Skills and 21st Century Mediation Projects", "MainSubtitle"))

banner_g2 = Table([[P("<b>GROUP 2: BEGINNER (CEFR A1)</b> • Expanding Expression, Graphic Organizers, Compound Syntax & Peer Collaboration", "SectionBanner")]], colWidths=[10.2 * inch])
banner_g2.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#0284C7")), # Sky Blue / Cyan
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(banner_g2)
story.append(Spacer(1, 3))

g2_rows = [headers_row]

# Row 1: Grade 3 (A1.1)
r3_ref = """<b>Grade 3 (A1.1)</b><br/>
<font color="#0284C7"><b>A1 Beginner</b></font><br/><br/>
<b>Focus:</b> Expanding expression and comprehension through vocabulary, grammar, and communication.<br/><br/>
<b>Key Considerations:</b> Visual aids, graphic organizers, sentence frames, model texts, peer feedback.<br/><br/>
<b>Linguistic Components:</b> All 4 components; syntax moving into basic compound structures (and, but); semantics with category vocabulary (places, community, family)."""

r3_lis = """<b>1. Information-Gap Drawing Relay</b><br/>
<i>Materials:</i> Barrier divider, clue audio/cards, sketch pads.<br/>
<i>How it works:</i> Student A hears: "The library is next to the bakery, and a girl has two balloons." Student A describes to Student B across divider. Partners compare drawings.<br/>
<i>Evidence:</i> Extracts key location prepositions and compound clauses to draw details."""

r3_rea = """<b>2. Dialogue Strip Scramble & Highlight</b><br/>
<i>Materials:</i> Comic dialogue strips on cardstock, colored highlighters.<br/>
<i>How it works:</i> Trios read scrambled strips of a polite dialogue ("Can I borrow a pencil?", "I need it because..."), sequence conversation in order, and highlight connectors ("and", "because").<br/>
<i>Evidence:</i> Reconstructs conversational flow and identifies coordinating conjunctions."""

r3_spe = """<b>3. "Where Am I?" Location Board Game</b><br/>
<i>Materials:</i> Illustrated town board, character counters, question cards.<br/>
<i>How it works:</i> Students land on places (hospital, park, market) and draw prompt cards: "I am at the park and I am playing soccer with my friend." Peer verifies grammar with token.<br/>
<i>Evidence:</i> Speaks 2 connected sentences combining place and activity."""

r3_wri = """<b>4. Comic Strip Speech Bubble Workshop</b><br/>
<i>Materials:</i> 3-panel illustrated comic template, word bank.<br/>
<i>How it works:</i> Students write dialogues for characters sharing classroom items or asking directions: "Excuse me, where is the library?" / "It is near the school, but it is closed."<br/>
<i>Evidence:</i> Writes short dialogue with accurate capitalization, question mark, and connector."""

r3_med = """<font color="#0284C7"><b>THEME 1: Project 1 (Community Mediation)</b></font><br/>
<b>• "Where Am I?" Interactive Community Map:</b> Teams draw a town map, labeling places with "I'm at the..." and act as friendly guides helping foreign visitors navigate.<br/><br/>
<font color="#2563EB"><b>THEME 2: 21st Cent. Skill Project 2</b></font><br/>
<b>• Digital Classroom Politeness Campaign:</b> Students design illustrated kindness stickers with rules ("Please share crayons and say thank you") to display in class."""

g2_rows.append([P(r3_ref, "RefCell"), P(r3_lis, "ActCell"), P(r3_rea, "ActCell"), P(r3_spe, "ActCell"), P(r3_wri, "ActCell"), P(r3_med, "ActCell")])

# Row 2: Grade 4 (A1.2) & Grade 5 (A1.3)
r45_ref = """<b>Grade 4 (A1.2)<br/>Grade 5 (A1.3)</b><br/>
<font color="#0284C7"><b>A1 Beginner</b></font><br/><br/>
<b>Focus:</b> Expanding expression and comprehension through nuanced vocabulary and compound sentences.<br/><br/>
<b>Key Considerations:</b> Visual aids, graphic organizers, model texts, sentence frames, peer feedback.<br/><br/>
<b>Linguistic Components:</b> Syntax (compound sentences with and/but/or/because, past simple beginnings), semantics (adjectives of degree, feelings, community roles)."""

r45_lis = """<b>1. Setting & Emotion Detective (Audio Sort)</b><br/>
<i>Materials:</i> Audio clips (home vs. school vs. store dialogues), tally sheets.<br/>
<i>How it works:</i> Students listen to 3 short scenarios, identify the setting, speaker relation, and mood ("Are they happy or worried? Why?"), sorting picture tokens into Venn organizers.<br/>
<i>Evidence:</i> Identifies setting and infers reason from spoken compound sentences."""

r45_rea = """<b>2. Jigsaw Culture & Nature Fact-Finder</b><br/>
<i>Materials:</i> Short illustrated texts about Panamanian traditions (Pollera, Harpy Eagle).<br/>
<i>How it works:</i> "Expert groups" read about one topic, complete a graphic organizer (Habitat, Food, Why it's special), then teach home group using sentence frames.<br/>
<i>Evidence:</i> Extracts factual details and contrasts similarities/differences using T-charts."""

r45_spe = """<b>3. Speed-Interview & "Two Stars" Feedback</b><br/>
<i>Materials:</i> Question cue cards ("What do you like to do on weekends and why?").<br/>
<i>How it works:</i> Students rotate every 2 minutes. Partner answers using compound frames ("I like soccer because it is energetic, but my sister likes art"). Partner gives 2 stars + 1 wish.<br/>
<i>Evidence:</i> Sustains 3-4 sentence oral response with connectors and peer feedback."""

r45_wri = """<b>4. Illustrated Postcard & Mini-Brochure</b><br/>
<i>Materials:</i> Foldable brochure template, model texts.<br/>
<i>How it works:</i> Students draft a 4-5 sentence postcard describing a trip in Panama: "Dear Maria, I am visiting Boquete. The mountains are high and cool, but it is raining today."<br/>
<i>Evidence:</i> Organizes greeting, descriptive compound sentences, and closing."""

r45_med = """<font color="#0284C7"><b>THEME 1: Project 1 (Cultural Mediation)</b></font><br/>
<b>• Panamanian Traditions Cultural Showcase:</b> Teams create a mini-booth (Realia + Poster) explaining a local custom (Carnavales, Diablicos) using simplified English for peer visitors.<br/><br/>
<font color="#2563EB"><b>THEME 2: 21st Cent. Skill Project 2</b></font><br/>
<b>• Eco-Friendly School Waste Reduction Plan:</b> Students audit classroom trash, build a visual bar chart, and design bilingual posters proposing recycling solutions."""

g2_rows.append([P(r45_ref, "RefCell"), P(r45_lis, "ActCell"), P(r45_rea, "ActCell"), P(r45_spe, "ActCell"), P(r45_wri, "ActCell"), P(r45_med, "ActCell")])

t_g2 = Table(g2_rows, colWidths=COL_WIDTHS, repeatRows=1)
t_g2.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), c_navy),
    ("GRID", (0, 0), (-1, -1), 0.5, c_border),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 5),
    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("BACKGROUND", (0, 1), (0, -1), colors.HexColor("#E0F2FE")), # Light blue for A1
    ("BACKGROUND", (1, 1), (-1, 1), colors.white),
    ("BACKGROUND", (1, 2), (-1, 2), c_bg_light),
]))

story.append(t_g2)
story.append(PageBreak())

# PAGE 3: GROUP 3 - HIGH BEGINNER (A2)
story.append(P("TABLE 1. LINGUISTIC COMPETENCE ACROSS CEFR LEVELS", "MainTitle"))
story.append(P("Pedagogical Activity Matrix • Playful & Concrete Activities Aligned to 4 Macro-Skills and 21st Century Mediation Projects", "MainSubtitle"))

banner_g3 = Table([[P("<b>GROUP 3: HIGH BEGINNER (CEFR A2)</b> • Communicative Competence in Diverse Contexts, Authentic Texts & Pragmatics", "SectionBanner")]], colWidths=[10.2 * inch])
banner_g3.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#0D9488")), # Teal
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(banner_g3)
story.append(Spacer(1, 3))

g3_rows = [headers_row]

# Row 1: Grade 6 (A2.1) & Grade 7 (A2.2)
r67_ref = """<b>Grade 6 (A2.1)<br/>Grade 7 (A2.2)</b><br/>
<font color="#0D9488"><b>A2 High Beginner</b></font><br/><br/>
<b>Focus:</b> Developing communicative competence in various contexts.<br/><br/>
<b>Key Considerations:</b> Authentic materials, diverse texts, discussions, presentations, writing tasks, comprehension strategies.<br/><br/>
<b>Linguistic Components:</b> All 4 components refined; strong emphasis on pragmatics (appropriate register in social vs. classroom contexts, comparatives/superlatives, past simple)."""

r67_lis = """<b>1. Podcast Mystery & Tone Analysis</b><br/>
<i>Materials:</i> 90-second audio clips (radio interview, airport announcement, peer conversation).<br/>
<i>How it works:</i> Students listen with guided organizer: Identify speaker intent, formal vs. informal cues, and note 3 specific facts (numbers, dates, places) to solve a mystery scenario.<br/>
<i>Evidence:</i> Extracts key factual details and differentiates friendly vs. official tone."""

r67_rea = """<b>2. Authentic Menu & Eco-Park Brochure Scavenger</b><br/>
<i>Materials:</i> Real Panamanian restaurant menus and National Park trail guides.<br/>
<i>How it works:</i> In pairs, students are given a budget ($15) or mission ("Plan a 3-hour hike avoiding dangerous trails"). They skim and scan for prices, warnings, and schedules.<br/>
<i>Evidence:</i> Locates specific functional information in authentic printed material."""

r67_spe = """<b>3. Town Hall Role-Play: "Upgrade Our School"</b><br/>
<i>Materials:</i> Role badges (Eco Club, Athlete, Principal, PTA).<br/>
<i>How it works:</i> Teams debate spending a school improvement grant. Students state opinions using comparatives ("A garden is better than a vending machine because..."), negotiate compromises.<br/>
<i>Evidence:</i> Participates actively in guided discussion, justifying choices respectfully."""

r67_wri = """<b>4. Personal Diary Entry & Email Register Switch</b><br/>
<i>Materials:</i> Double-column template (Casual note vs. Formal email).<br/>
<i>How it works:</i> Students write a diary entry about changing schools, then rewrite the core message as a formal email to a teacher requesting project guidance.<br/>
<i>Evidence:</i> Demonstrates correct past tense verbs, time sequencers, and register shift."""

r67_med = """<font color="#0D9488"><b>THEME 1: Project 1 (Peer & School Mediation)</b></font><br/>
<b>• "Our New Classmates" Video Interview:</b> Teams interview incoming students, editing a 2-minute welcoming video that summarizes school rules and highlights student advice.<br/><br/>
<font color="#2563EB"><b>THEME 2: 21st Cent. Skill Project 2</b></font><br/>
<b>• Panama Wildlife Conservation Infographic:</b> Students research endangered local species (Sloth, Jaguar), synthesize facts, and create a digital Canva/paper infographic."""

g3_rows.append([P(r67_ref, "RefCell"), P(r67_lis, "ActCell"), P(r67_rea, "ActCell"), P(r67_spe, "ActCell"), P(r67_wri, "ActCell"), P(r67_med, "ActCell")])

# Row 2: Grade 8 (A2.3) & Grade 9 (A2.4)
r89_ref = """<b>Grade 8 (A2.3)<br/>Grade 9 (A2.4)</b><br/>
<font color="#0D9488"><b>A2 High Beginner</b></font><br/><br/>
<b>Focus:</b> Consolidating communicative competence across academic and social contexts.<br/><br/>
<b>Key Considerations:</b> Diverse texts, presentations, collaborative discussions, writing workshops, reading comprehension strategies.<br/><br/>
<b>Linguistic Components:</b> Pragmatics (politeness markers, indirect requests), syntax (present perfect, conditionals type 1, complex sentences), nuanced vocabulary."""

r89_lis = """<b>1. News Bulletin & Fact vs. Opinion Sort</b><br/>
<i>Materials:</i> Recorded school news broadcast with 2 differing opinions.<br/>
<i>How it works:</i> Students map speakers' claims into a two-column chart (Fact vs. Opinion), noting transition words that signal contrast (however, on the other hand).<br/>
<i>Evidence:</i> Distinguishes objective facts from subjective viewpoints in oral discourse."""

r89_rea = """<b>2. Dual-Perspective Historical / News Article</b><br/>
<i>Materials:</i> Two short articles about the Panama Canal expansion from local workers & international shippers.<br/>
<i>How it works:</i> Students annotate arguments using color-coding: yellow for economic benefits, green for environmental concerns, answering critical questions.<br/>
<i>Evidence:</i> Identifies differing perspectives and cites textual evidence for each."""

r89_spe = """<b>3. "Shark Tank" Sustainable Invention Pitch</b><br/>
<i>Materials:</i> Pitch cue cards, visual prototype slides, timer.<br/>
<i>How it works:</i> Trios pitch a sustainable invention for their community (solar-powered phone charger, rainwater collector). Each student speaks 1 minute, handling audience Q&A.<br/>
<i>Evidence:</i> Delivers structured spoken presentation with visual aid and answers queries."""

r89_wri = """<b>4. Problem-Solution Letter to Community Leader</b><br/>
<i>Materials:</i> Formal letter outline with transitional phrases.<br/>
<i>How it works:</i> Students write a 3-paragraph letter to their Corregidor or School Director addressing a local issue (plastic pollution, library books), proposing 2 viable solutions.<br/>
<i>Evidence:</i> Uses formal salutation, cohesive devices, and clear paragraph transitions."""

r89_med = """<font color="#0D9488"><b>THEME 1: Project 1 (Intercultural Mediation)</b></font><br/>
<b>• Cultural Bridge & Tradition Exchange:</b> Students interview community elders about local folklore/festivals and create an English guide explaining cultural significance to tourists.<br/><br/>
<font color="#2563EB"><b>THEME 2: 21st Cent. Skill Project 2</b></font><br/>
<b>• Digital Youth Action Podcast / Audio Report:</b> Teams write, record, and edit a 3-minute audio episode analyzing community traffic or recycling challenges with proposed fixes."""

g3_rows.append([P(r89_ref, "RefCell"), P(r89_lis, "ActCell"), P(r89_rea, "ActCell"), P(r89_spe, "ActCell"), P(r89_wri, "ActCell"), P(r89_med, "ActCell")])

t_g3 = Table(g3_rows, colWidths=COL_WIDTHS, repeatRows=1)
t_g3.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), c_navy),
    ("GRID", (0, 0), (-1, -1), 0.5, c_border),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 5),
    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("BACKGROUND", (0, 1), (0, -1), colors.HexColor("#CCFBF1")), # Light teal for A2
    ("BACKGROUND", (1, 1), (-1, 1), colors.white),
    ("BACKGROUND", (1, 2), (-1, 2), c_bg_light),
]))

story.append(t_g3)
story.append(PageBreak())

# PAGE 4: GROUP 4 - PRE-INTERMEDIATE (B1)
story.append(P("TABLE 1. LINGUISTIC COMPETENCE ACROSS CEFR LEVELS", "MainTitle"))
story.append(P("Pedagogical Activity Matrix • Playful & Concrete Activities Aligned to 4 Macro-Skills and 21st Century Mediation Projects", "MainSubtitle"))

banner_g4 = Table([[P("<b>GROUP 4: PRE-INTERMEDIATE (CEFR B1)</b> • Independent Language Use, Academic Registers, Research & Critical Workshops", "SectionBanner")]], colWidths=[10.2 * inch])
banner_g4.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#4338CA")), # Indigo/Purple
    ("TOPPADDING", (0, 0), (-1, -1), 4),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
]))
story.append(banner_g4)
story.append(Spacer(1, 3))

g4_rows = [headers_row]

# Row 1: Grade 10 (B1.1)
r10_ref = """<b>Grade 10 (B1.1)</b><br/>
<font color="#4338CA"><b>B1 Pre-Intermediate</b></font><br/><br/>
<b>Focus:</b> Solidifying independent language use and preparing for further studies.<br/><br/>
<b>Key Considerations:</b> Academic and technical vocabulary, formal/informal registers, complex grammar, critical thinking, research, writing workshops.<br/><br/>
<b>Linguistic Components:</b> All 4 components refined and integrated; passive voice, modals of deduction, academic collocations, cohesion in multi-paragraph texts."""

r10_lis = """<b>1. TED-Style Talk & Cornell Note Matrix</b><br/>
<i>Materials:</i> 3-minute authentic talk on tech/youth clubs + Cornell template.<br/>
<i>How it works:</i> Students listen once for main ideas, second time for evidence/counter-claims. In pairs, they synthesize notes and formulate 2 critical inquiry questions.<br/>
<i>Evidence:</i> Accurately records key data points and summarizes central thesis."""

r10_rea = """<b>2. Multi-Source Fact-Check & Bias Detector</b><br/>
<i>Materials:</i> 2 articles with contrasting biases on social media impact.<br/>
<i>How it works:</i> Students evaluate source credibility, author purpose, and rhetorical language (emotive words vs. empirical data), synthesizing into a comparative matrix.<br/>
<i>Evidence:</i> Detects slant, distinguishes claim from proof, and explains bias."""

r10_spe = """<b>3. Parliamentary Mini-Debate (Oxford Style)</b><br/>
<i>Materials:</i> Resolution card: "Schools should replace all textbooks with tablets."<br/>
<i>How it works:</i> 4-person teams (Government vs. Opposition) deliver 2-minute timed arguments, points of information (POI), and rebuttals using formal academic stems.<br/>
<i>Evidence:</i> Constructs cohesive spoken argument and responds spontaneously to challenges."""

r10_wri = """<b>4. Academic Club Proposal & Member Notice</b><br/>
<i>Materials:</i> Formal proposal template (Objectives, Budget, Timeline, Impact).<br/>
<i>How it works:</i> Students draft a 250-word proposal to establish a new school club (Robotics, Model UN, Debate) plus a persuasive recruitment notice for school bulletin.<br/>
<i>Evidence:</i> Employs academic register, passive constructions, and logical paragraphing."""

r10_med = """<font color="#4338CA"><b>THEME 1: Project 1 (Negotiation & Facilitation)</b></font><br/>
<b>• Club Governance & Conflict Mediation Workshop:</b> Students simulate club executive board meeting, mediating conflicting member proposals to create a consensus charter.<br/><br/>
<font color="#2563EB"><b>THEME 2: 21st Cent. Skill Project 2</b></font><br/>
<b>• Interactive Campus Club Fair & Digital Hub:</b> Teams build a live interactive kiosk and digital landing page promoting a sustainable school initiative to parents and peers."""

g4_rows.append([P(r10_ref, "RefCell"), P(r10_lis, "ActCell"), P(r10_rea, "ActCell"), P(r10_spe, "ActCell"), P(r10_wri, "ActCell"), P(r10_med, "ActCell")])

# Row 2: Grade 11 (B1.2) & Grade 12 (B1.3)
r1112_ref = """<b>Grade 11 (B1.2)<br/>Grade 12 (B1.3)</b><br/>
<font color="#4338CA"><b>B1 Pre-Intermediate</b></font><br/><br/>
<b>Focus:</b> Advanced independent language application in pre-university and professional contexts.<br/><br/>
<b>Key Considerations:</b> Technical vocabulary, academic registers, critical research synthesis, authentic materials, debate, project portfolios.<br/><br/>
<b>Linguistic Components:</b> Full competence integration across academic discourse; complex sentence structures (relative clauses, conditionals, discourse markers), professional pragmatics."""

r1112_lis = """<b>1. Panel Discussion Synthesis & Press Conference</b><br/>
<i>Materials:</i> 4-minute simulated panel on renewable energy / canal logistics.<br/>
<i>How it works:</i> Students act as journalists taking notes on 3 panelists' conflicting solutions, then write and ask targeted questions in a mock press conference.<br/>
<i>Evidence:</i> Synthesizes distinct spoken viewpoints and probes underlying rationale."""

r1112_rea = """<b>2. Academic Paper Abstract & Case Study Analysis</b><br/>
<i>Materials:</i> Simplified scholarly journal extract on climate resilience in Latin America.<br/>
<i>How it works:</i> Students identify the methodology, findings, and study limitations; they formulate an executive summary table and critique the evidence.<br/>
<i>Evidence:</i> Demonstrates advanced reading comprehension of technical academic text."""

r1112_spe = """<b>3. Professional Capstone Defense / Pitch</b><br/>
<i>Materials:</i> Slide deck, presentation clicker, peer evaluation rubric.<br/>
<i>How it works:</i> Students deliver a 4-minute formal presentation defending a community project or career research topic, fielding challenging questions from panel.<br/>
<i>Evidence:</i> Sustains professional register, clear vocal delivery, and authoritative answers."""

r1112_wri = """<b>4. Writing Workshop: Persuasive Policy Brief</b><br/>
<i>Materials:</i> Formal policy brief guidelines and peer revision checklist.<br/>
<i>How it works:</i> Multi-draft writing of a 400-word policy brief addressed to the Ministry of Education or Environment, featuring data citations, counter-arguments, and action plan.<br/>
<i>Evidence:</i> Clear thesis, sophisticated transitional devices, and error-free formal tone."""

r1112_med = """<font color="#4338CA"><b>THEME 1: Project 1 (Intercultural Mediation)</b></font><br/>
<b>• Model United Nations / Youth Climate Summit:</b> Students act as national delegates negotiating an international treaty, translating complex policy into plain-language agreements.<br/><br/>
<font color="#2563EB"><b>THEME 2: 21st Cent. Skill Project 2</b></font><br/>
<b>• Social Entrepreneurship Business Plan & Pitch:</b> Teams author a full business proposal addressing a UN SDG in Panama, creating a video pitch and executive pitch deck."""

g4_rows.append([P(r1112_ref, "RefCell"), P(r1112_lis, "ActCell"), P(r1112_rea, "ActCell"), P(r1112_spe, "ActCell"), P(r1112_wri, "ActCell"), P(r1112_med, "ActCell")])

t_g4 = Table(g4_rows, colWidths=COL_WIDTHS, repeatRows=1)
t_g4.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), c_navy),
    ("GRID", (0, 0), (-1, -1), 0.5, c_border),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 5),
    ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ("TOPPADDING", (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("BACKGROUND", (0, 1), (0, -1), colors.HexColor("#EDE9FE")), # Light purple/indigo for B1
    ("BACKGROUND", (1, 1), (-1, 1), colors.white),
    ("BACKGROUND", (1, 2), (-1, 2), c_bg_light),
]))

story.append(t_g4)

doc.build(story, onFirstPage=make_header_footer, onLaterPages=make_header_footer)
print(f"PDF SUCCESS: {OUT_PDF}")
