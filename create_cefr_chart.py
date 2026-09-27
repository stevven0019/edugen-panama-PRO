from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import landscape, letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os

OUT = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\CEFR_Grade_Skill_Activities_Chart.pdf"
font = "Helvetica"; bold = "Helvetica-Bold"
for path,name in [(r"C:\Windows\Fonts\arial.ttf","DocFont"),(r"C:\Windows\Fonts\calibri.ttf","DocFont")]:
    if os.path.exists(path):
        pdfmetrics.registerFont(TTFont(name,path)); font=name; break
for path,name in [(r"C:\Windows\Fonts\arialbd.ttf","DocFontBold"),(r"C:\Windows\Fonts\calibrib.ttf","DocFontBold")]:
    if os.path.exists(path):
        pdfmetrics.registerFont(TTFont(name,path)); bold=name; break

navy=colors.HexColor("#173B57"); purple=colors.HexColor("#92278F"); teal=colors.HexColor("#148A83")
blue=colors.HexColor("#2676A8"); pale=colors.HexColor("#F1F6F8"); ink=colors.HexColor("#253746")
muted=colors.HexColor("#5B6B73"); line=colors.HexColor("#C6D5DB"); gold=colors.HexColor("#F3B837")
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name="TitleA",fontName=bold,fontSize=21,leading=25,textColor=navy,alignment=TA_CENTER,spaceAfter=4))
styles.add(ParagraphStyle(name="SubA",fontName=font,fontSize=9.5,leading=13,textColor=muted,alignment=TA_CENTER,spaceAfter=9))
styles.add(ParagraphStyle(name="HeadA",fontName=bold,fontSize=13,leading=16,textColor=navy,spaceBefore=2,spaceAfter=5))
styles.add(ParagraphStyle(name="BodyA",fontName=font,fontSize=9,leading=12,textColor=ink,spaceAfter=3))
styles.add(ParagraphStyle(name="TinyA",fontName=font,fontSize=7.5,leading=9.3,textColor=muted))
styles.add(ParagraphStyle(name="CellA",fontName=font,fontSize=8.4,leading=10.6,textColor=ink))
styles.add(ParagraphStyle(name="CellBoldA",fontName=bold,fontSize=8.7,leading=10.8,textColor=navy))
styles.add(ParagraphStyle(name="CardHeadA",fontName=bold,fontSize=9,leading=11,textColor=navy,spaceAfter=3))
def P(t,s="BodyA"): return Paragraph(t,styles[s])
def header_footer(c,doc):
    c.saveState(); w,h=landscape(letter); c.setFillColor(navy); c.rect(0,h-.14*inch,w,.14*inch,fill=1,stroke=0)
    c.setStrokeColor(line); c.line(.55*inch,.42*inch,w-.55*inch,.42*inch)
    c.setFillColor(muted); c.setFont(font,7.5); c.drawString(.55*inch,.25*inch,"CEFR SOCIOLINGUISTIC COMPETENCE • GRADE-BY-GRADE SKILL ACTIVITIES")
    c.drawRightString(w-.55*inch,.25*inch,f"Page {doc.page}"); c.restoreState()
doc=SimpleDocTemplate(OUT,pagesize=landscape(letter),leftMargin=.55*inch,rightMargin=.55*inch,topMargin=.37*inch,bottomMargin=.55*inch,title="CEFR Grade and Skill Activities Chart")
story=[Spacer(1,.06*inch),P("CEFR GRADE-BY-GRADE ACTIVITY CHART","TitleA"),
 P("Practical learning activities for sociolinguistic competence • Listening, Reading, Speaking & Writing","SubA"),
 P("<b>How to use:</b> Select activities for the student's grade and current CEFR band. Each task has a real communication purpose, observable evidence, and a built-in support or extension. For Pre-A1 learners, accept pointing, movement, pictures, drawing, and emergent writing as valid evidence; spoken or written English is not required when assessing listening.","BodyA"),
 P("FOUNDATION & BEGINNER • Social language in familiar settings","HeadA")]

headers=[P("GRADE / CEFR","CellBoldA"),P("LISTENING","CellBoldA"),P("READING","CellBoldA"),P("SPEAKING","CellBoldA"),P("WRITING","CellBoldA"),P("EVIDENCE OF LEARNING","CellBoldA")]
rows=[headers]
data=[
("Pre-K<br/>Kinder<br/><b>Pre-A1.1–Pre-A1.2</b>",
"<b>Greeting cue hunt:</b> Hear “hello,” “good morning,” “please,” or “thank you” in a puppet/classroom routine; choose or point to the matching picture/action.<br/><i>Support:</i> repeat, gesture, 2 picture choices.",
"<b>Picture routine cards:</b> Match a highly familiar printed word or icon (hello, please, stop) to its picture; teacher reads aloud and child tracks/points.<br/><i>Focus:</i> recognize meaning, not decode independently.",
"<b>Puppet greeting turn:</b> Greet a puppet or partner; respond to “Hello!” with a greeting, wave, or supported phrase. Practice please/thank you during pretend snack or toy sharing.",
"<b>My greeting card:</b> Draw self greeting someone; dictate or copy one model word (Hi!/Hello!). Adult may scribe the child's chosen message.",
"<b>Observe:</b> responds to a greeting, takes a turn, connects familiar print/pictures to meaning, communicates a greeting in any supported mode."),
("Grade 1<br/><b>Pre-A1.3</b>",
"<b>Classroom helper mission:</b> Listen to one-step routine requests (“Please bring the book,” “Put the crayons in the box”) and complete them with real objects.",
"<b>Read-and-match routine:</b> Match short labels or picture-supported classroom rules (sit, line up, share) to a photo or action; teacher reads the text.",
"<b>Polite request role-play:</b> Ask for a classroom item with a frame: “Pencil, please.” / “May I have…?” Respond “Here you are” / “Thank you,” with a visual choice card.",
"<b>Class rule mini-poster:</b> Draw one helpful classroom rule; complete a word/frame: “Please ____.” Child may trace, copy, dictate, or use symbols.",
"<b>Observe:</b> follows one-step requests, identifies routine meaning, makes a polite request, and represents one familiar rule."),
("Grade 2<br/><b>Pre-A1.4</b>",
"<b>Two-step classroom route:</b> Hear and carry out two linked familiar directions (“Get your book and sit at your desk”); use a visual schedule if needed.",
"<b>Short picture story:</b> Read a 3–4 panel routine with repeated words (first/then, please, thank you); put panels in order and point to evidence.",
"<b>Partner routine interview:</b> Use model questions (“Do you need a pencil?” “Can I help?”); take turns asking and answering, using polite words.",
"<b>Two-panel routine comic:</b> Draw a classroom interaction and complete a frame such as “Can I ___?” / “Thank you.” Copy or dictate as needed.",
"<b>Observe:</b> follows a familiar two-step routine, sequences story events, participates in a short exchange, and conveys a simple message.")
]
for row in data:
    rows.append([P(x,"CellA") for x in row])
t=Table(rows,colWidths=[1.12*inch,2.05*inch,2.05*inch,2.05*inch,2.05*inch,2.0*inch],repeatRows=1)
t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#E9F0F3")),("GRID",(0,0),(-1,-1),.55,line),("VALIGN",(0,0),(-1,-1),"TOP"),
("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),
("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,pale]),("BACKGROUND",(0,1),(0,-1),colors.HexColor("#F8EDF8"))]))
story += [t,Spacer(1,5),P("<b>Teaching note:</b> Build from modeling and repetition toward child-initiated choices and turns. Assess the named skill: for example, assess listening from the learner's response to spoken input, not from their ability to read the prompt.","TinyA"),PageBreak()]

story += [Spacer(1,.06*inch),P("CEFR GRADE-BY-GRADE ACTIVITY CHART","TitleA"),
 P("FOUNDATION → BEGINNER • From familiar classroom exchanges to cultural awareness","SubA")]
rows=[headers]
data2=[
("Grade 3<br/><b>A1.1</b>",
"<b>Listen for the kind response:</b> Hear short peer exchanges (greeting, asking to join, thanking); choose which picture shows the speaker's meaning or polite response.",
"<b>Dialogue strip sort:</b> Read a short illustrated exchange; match “please,” “thank you,” or “Can I play?” to the speaker's turn and order the dialogue.",
"<b>Join-the-game role-play:</b> Practice asking to join, welcoming a classmate, and responding kindly; swap roles using cue cards.",
"<b>Speech-bubble comic:</b> Write or complete 2–3 speech bubbles for joining a game; use a word bank and punctuation models.",
"<b>Observe:</b> catches a key phrase, tracks who says what, uses a suitable phrase, and records a coherent short exchange."),
("Grade 4<br/><b>A1.2</b>",
"<b>Listen to two settings:</b> Hear the same request at home and at school; sort picture cards by setting and notice a change in polite wording/tone.",
"<b>Read mini-dialogues:</b> Compare a home and classroom dialogue; highlight greetings, requests, and thanks; answer who/where/what with text-picture evidence.",
"<b>Same message, different setting:</b> Perform one request in two contexts (friend/teacher); choose an appropriate greeting and polite phrase.",
"<b>Message to a classmate:</b> Write 3–4 supported sentences inviting a peer to an activity; include greeting, request/invitation, and closing.",
"<b>Observe:</b> identifies setting and key details, uses a context-fitting polite phrase, and organizes a short note."),
("Grade 5<br/><b>A1.3</b>",
"<b>Listen to viewpoints:</b> Hear two children describe a simple custom or preference; use a picture/tally chart to record each person's idea and one similarity.",
"<b>Read culture snapshots:</b> Read short, age-appropriate texts about greetings or classroom routines in two communities; mark one similarity and difference.",
"<b>Culture show-and-tell:</b> Share a familiar greeting or routine; classmates ask a prepared question and offer one respectful comment.",
"<b>Compare-and-share card:</b> Write 3–4 sentences using frames: “In ___, people…”, “In my…”, “Both…”.",
"<b>Observe:</b> recalls a speaker's idea, finds stated similarities/differences, shares respectfully, and writes a simple comparison."),
("Grade 6<br/><b>A2.1</b>",
"<b>Listen for opinion + reason:</b> Hear a short discussion about a school/community custom; fill a simple organizer: speaker, opinion, reason, respectful response.",
"<b>Read for perspective:</b> Read two short accounts of the same social situation; underline viewpoint clues and cite one detail from each.",
"<b>Small-group solution circle:</b> Discuss a realistic inclusion scenario (new student, turn-taking); give an opinion, one reason, and respond to a peer's idea.",
"<b>Advice note:</b> Write a short message offering kind, practical advice; include a greeting, suggestion, reason, and respectful closing.",
"<b>Observe:</b> distinguishes opinion from reason, locates supporting details, responds to another viewpoint, and writes a connected note."),
]
for row in data2: rows.append([P(x,"CellA") for x in row])
t=Table(rows,colWidths=[1.12*inch,2.05*inch,2.05*inch,2.05*inch,2.05*inch,2.0*inch],repeatRows=1)
t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#E9F0F3")),("GRID",(0,0),(-1,-1),.55,line),("VALIGN",(0,0),(-1,-1),"TOP"),
("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),
("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,pale]),("BACKGROUND",(0,1),(0,-1),colors.HexColor("#FFF6E2"))]))
story += [t,Spacer(1,5),P("<b>Teaching note:</b> Use child-safe, familiar topics. Teach that people may communicate differently without labeling one way as better. Ask learners to describe what they notice, listen with curiosity, and avoid stereotypes.","TinyA"),PageBreak()]

story += [Spacer(1,.06*inch),P("CEFR GRADE-BY-GRADE ACTIVITY CHART","TitleA"),
 P("HIGH BEGINNER & PRE-INTERMEDIATE • Adapt language and task length to the learner","SubA")]
rows=[headers]
data3=[
("Grade 7<br/><b>A2.2</b>",
"<b>Listen for implied meaning:</b> Hear a brief peer conversation about sharing space or a game; identify what each child wants and which phrase signals agreement/disagreement.",
"<b>Read between the lines:</b> Read a short dialogue with clear context; infer a speaker's feeling or intention and underline the words that support the inference.",
"<b>Role-play a misunderstanding:</b> In pairs, repair a low-stakes classroom misunderstanding using clarification (“Do you mean…?”), apology, or compromise.",
"<b>Reflective response:</b> Write a short paragraph about a respectful way to solve the scenario; include a phrase from the dialogue and a reason.",
"<b>Observe:</b> infers a supported intent, points to textual clues, uses repair language, and justifies a response."),
("Grade 8<br/><b>A2.3</b>",
"<b>Listen and compare tone:</b> Hear the same request spoken neutrally and impatiently; identify tone using a word bank and explain what changed.",
"<b>Notice audience and purpose:</b> Compare a school announcement with a friendly message; mark clues showing audience, purpose, and level of formality.",
"<b>Audience-switch challenge:</b> Make the same request to a friend and to a school adult; adapt greeting, wording, and tone, then explain the choice.",
"<b>Rewrite for audience:</b> Rewrite an overly casual note as a polite school message; keep its meaning and add an appropriate opening/closing.",
"<b>Observe:</b> recognizes tone cues, uses evidence for audience/purpose, adapts language, and preserves meaning when rewriting."),
("Grade 9<br/><b>A2.4</b>",
"<b>Listen to a short interview:</b> Record a speaker's view and one supporting detail about a community tradition; note one question that would show respectful curiosity.",
"<b>Read two perspectives:</b> Read brief first-person accounts of a shared school/community event; compare stated experiences and identify evidence, not assumptions.",
"<b>Respectful interview pairs:</b> Ask prepared open questions about a routine or celebration the partner chooses to share; paraphrase before asking a follow-up.",
"<b>Comparison paragraph:</b> Write a short evidence-based comparison of the two accounts; include a similarity, a difference, and a respectful concluding sentence.",
"<b>Observe:</b> captures main idea and detail, compares perspectives fairly, asks relevant questions, and supports a comparison with evidence."),
("Grade 10<br/><b>B1.1</b>",
"<b>Listen to a panel:</b> Hear a short, teacher-curated discussion of a school inclusion issue; map each viewpoint and supporting reason.",
"<b>Read for claims and evidence:</b> Read two age-appropriate source texts; annotate claims, examples, and whose perspective may be missing.",
"<b>Structured academic discussion:</b> Present a position, build on or respectfully challenge a peer's idea, and invite another voice using discussion stems.",
"<b>Evidence-based response:</b> Write a structured paragraph or brief email to a school audience with a clear claim, evidence, and a respectful recommendation.",
"<b>Observe:</b> accurately represents views, distinguishes claims from support, contributes constructively, and writes for a clear audience.")
]
for row in data3: rows.append([P(x,"CellA") for x in row])
t=Table(rows,colWidths=[1.12*inch,2.05*inch,2.05*inch,2.05*inch,2.05*inch,2.0*inch],repeatRows=1)
t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#E9F0F3")),("GRID",(0,0),(-1,-1),.55,line),("VALIGN",(0,0),(-1,-1),"TOP"),
("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6),
("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,pale]),("BACKGROUND",(0,1),(0,-1),colors.HexColor("#EAF4FA"))]))
story += [t,Spacer(1,4),P("<b>Teaching note:</b> Provide sentence stems, vocabulary previews, and rehearsal time. Keep assessment focused on the stated language objective rather than personal disclosure or agreement with a particular viewpoint.","TinyA"),PageBreak()]

story += [Spacer(1,.06*inch),P("CEFR GRADE-BY-GRADE ACTIVITY CHART","TitleA"),
 P("PRE-INTERMEDIATE • Academic and professional contexts for older learners","SubA")]
rows=[headers]
data4=[
("Grade 11<br/><b>B1.2</b>",
"<b>Listen to a moderated discussion:</b> Track speakers' positions, examples, and moments of agreement or disagreement; complete a claim/evidence table.",
"<b>Source comparison:</b> Read two reliable, age-appropriate texts about communication across communities; compare purpose, evidence, and perspective.",
"<b>Mini-seminar:</b> Discuss a prepared question, refer to evidence, paraphrase another speaker fairly, and disagree with an idea respectfully.",
"<b>Formal email:</b> Write to a school/community audience proposing an inclusive practice; state context, support the recommendation, and use appropriate register.",
"<b>Observe:</b> follows an extended exchange, evaluates source support, builds on peers' ideas, and sustains an organized formal message."),
("Grade 12<br/><b>B1.3</b>",
"<b>Listen, synthesize, respond:</b> Hear a short talk plus interview excerpts; synthesize two perspectives and note the speaker's purpose and one limitation.",
"<b>Research reading set:</b> Read a small curated set of sources; synthesize what they agree/disagree on and cite details while noting perspective and context.",
"<b>Panel presentation + Q&A:</b> Present a supported position on an intercultural or community communication issue; answer questions and adapt explanation to listeners.",
"<b>Audience-specific proposal:</b> Produce a brief report, proposal, or formal letter with evidence, a considered counterpoint, and a clear recommendation.",
"<b>Observe:</b> synthesizes across spoken/written sources, cites fairly, adjusts register and explanation, and produces a coherent evidence-based text.")
]
for row in data4: rows.append([P(x,"CellA") for x in row])
t=Table(rows,colWidths=[1.12*inch,2.05*inch,2.05*inch,2.05*inch,2.05*inch,2.0*inch])
t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#E9F0F3")),("GRID",(0,0),(-1,-1),.55,line),("VALIGN",(0,0),(-1,-1),"TOP"),
("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7),
("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,pale]),("BACKGROUND",(0,1),(0,-1),colors.HexColor("#E9F7F3"))]))
story += [t,Spacer(1,10),P("SIMPLE ASSESSMENT CHECKLIST","HeadA")]
check_data=[
[P("Skill","CellBoldA"),P("What to observe","CellBoldA"),P("Evidence to collect","CellBoldA")],
[P("Listening","CellBoldA"),P("Understands spoken message, key detail, sequence, tone, or viewpoint at the taught level.","CellA"),P("Action, choice, notes, organizer, or concise response to the input.","CellA")],
[P("Reading","CellBoldA"),P("Finds stated information or makes a supported inference from an age-appropriate text.","CellA"),P("Text-pointing, matching, annotation, answer with text evidence.","CellA")],
[P("Speaking","CellBoldA"),P("Communicates for a purpose, takes turns, and adjusts language to context as expected at the level.","CellA"),P("Teacher checklist, brief audio note (if permitted), or discussion rubric.","CellA")],
[P("Writing","CellBoldA"),P("Conveys an understandable message with expected support, organization, and audience awareness.","CellA"),P("Drawing/dictation/emergent writing through a developed text, depending on level.","CellA")]
]
check=Table(check_data,colWidths=[1.15*inch,4.9*inch,5.3*inch])
check.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#E9F0F3")),("GRID",(0,0),(-1,-1),.5,line),("VALIGN",(0,0),(-1,-1),"TOP"),
("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),5),("BOTTOMPADDING",(0,0),(-1,-1),5),("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,pale])]))
story += [check,Spacer(1,8),P("<b>CEFR alignment note:</b> The chart follows the grade-to-band mapping shown in the supplied table (Pre-K/Kinder through Grades 12, Pre-A1.1 through B1.3). CEFR bands describe language proficiency, not a fixed age or intelligence level; use the learner's demonstrated proficiency, curriculum, and individual needs to adjust support, text complexity, and expected independence.","BodyA"),
 P("<b>Source basis:</b> User-provided “Table 3. Sociolinguistic Competence Across CEFR Levels.” Activities are original classroom suggestions aligned to its grade bands, focus, considerations, and skill descriptions.","TinyA")]

doc.build(story,onFirstPage=header_footer,onLaterPages=header_footer)
print(OUT)

