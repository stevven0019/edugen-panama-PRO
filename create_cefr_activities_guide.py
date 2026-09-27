from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
import os

OUT=r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\CEFR_Grade_Learning_Activities_Guide.pdf"
font="Helvetica"; bold="Helvetica-Bold"
for path,name in [(r"C:\Windows\Fonts\arial.ttf","GuideFont"),(r"C:\Windows\Fonts\calibri.ttf","GuideFont")]:
 if os.path.exists(path): pdfmetrics.registerFont(TTFont(name,path)); font=name; break
for path,name in [(r"C:\Windows\Fonts\arialbd.ttf","GuideFontBold"),(r"C:\Windows\Fonts\calibrib.ttf","GuideFontBold")]:
 if os.path.exists(path): pdfmetrics.registerFont(TTFont(name,path)); bold=name; break
navy=colors.HexColor("#173B57"); teal=colors.HexColor("#16877E"); blue=colors.HexColor("#2876A3")
gold=colors.HexColor("#EAAA2A"); pale=colors.HexColor("#EFF5F7"); ink=colors.HexColor("#263944")
muted=colors.HexColor("#5B6B73"); line=colors.HexColor("#C8D7DC")
ss=getSampleStyleSheet()
ss.add(ParagraphStyle(name="TitleG",fontName=bold,fontSize=22,leading=26,textColor=navy,alignment=TA_CENTER,spaceAfter=4))
ss.add(ParagraphStyle(name="SubG",fontName=font,fontSize=10,leading=14,textColor=muted,alignment=TA_CENTER,spaceAfter=12))
ss.add(ParagraphStyle(name="GradeG",fontName=bold,fontSize=16,leading=19,textColor=navy,spaceBefore=2,spaceAfter=5))
ss.add(ParagraphStyle(name="SkillG",fontName=bold,fontSize=10,leading=12,textColor=teal,spaceBefore=7,spaceAfter=3))
ss.add(ParagraphStyle(name="BodyG",fontName=font,fontSize=8.7,leading=11.7,textColor=ink,spaceAfter=3))
ss.add(ParagraphStyle(name="SmallG",fontName=font,fontSize=7.8,leading=10.2,textColor=muted,spaceAfter=3))
ss.add(ParagraphStyle(name="BoxG",fontName=font,fontSize=9,leading=12.5,textColor=ink))
def P(t,s="BodyG"): return Paragraph(t,ss[s])
def callout(content,bg=pale,border=line):
 t=Table([[content]],colWidths=[7.0*inch])
 t.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),bg),("BOX",(0,0),(-1,-1),.7,border),("LEFTPADDING",(0,0),(-1,-1),9),("RIGHTPADDING",(0,0),(-1,-1),9),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)]))
 return t
def activity(num,title,time,materials,steps,evidence,adapt):
 parts=[P(f"{num}. {title} <font color='#5B6B73'>({time})</font>","SkillG"),
        P(f"<b>Materials:</b> {materials}","SmallG"),
        P("<b>How to do it</b>","BodyG")]
 for i,s in enumerate(steps,1): parts.append(P(f"<b>{i}.</b> {s}","BodyG"))
 parts += [P(f"<b>Look for:</b> {evidence}","BodyG"),P(f"<b>Adjust:</b> {adapt}","SmallG"),Spacer(1,3)]
 return KeepTogether(parts)
def hf(c,doc):
 c.saveState(); w,h=letter
 c.setFillColor(navy); c.rect(0,h-.13*inch,w,.13*inch,fill=1,stroke=0)
 c.setStrokeColor(line); c.line(.75*inch,.52*inch,w-.75*inch,.52*inch)
 c.setFont(font,7.5); c.setFillColor(muted); c.drawString(.75*inch,.33*inch,"CEFR LEARNING ACTIVITIES • LISTENING / READING / SPEAKING / WRITING")
 c.drawRightString(w-.75*inch,.33*inch,f"Page {doc.page}"); c.restoreState()
doc=SimpleDocTemplate(OUT,pagesize=letter,leftMargin=.75*inch,rightMargin=.75*inch,topMargin=.42*inch,bottomMargin=.68*inch,title="CEFR Grade Learning Activities Guide")
S=[]
S += [Spacer(1,.15*inch),P("READY-TO-TEACH LEARNING ACTIVITIES","TitleG"),P("By grade and CEFR band • Sociolinguistic competence across four skills","SubG"),
callout(P("<b>How this guide works:</b> Every item below is a classroom activity with materials, teacher/student steps, observable evidence, and a simple way to adjust support. The CEFR bands and grade mapping follow the user-provided table. Choose tasks by demonstrated English proficiency as well as grade. For early learners, movement, pointing, pictures, drawing, oral rehearsal, and adult scribing are valid ways to participate.","BoxG")),
Spacer(1,9),PageBreak(),Spacer(1,.12*inch),P("PRE-K / KINDER • Pre-A1.1–Pre-A1.2","GradeG"),
P("<b>Learning focus:</b> Become aware of greetings, politeness, simple social turns, and familiar classroom language. Use real objects, puppets, gestures, pictures, songs, and short modeled exchanges. Each activity can be shortened to a 5–10 minute station.","BodyG"),
activity("LISTENING","Puppet says hello","8–10 min","A puppet or toy; greeting picture cards (hello, goodbye, please, thank you).",[
"Seat children in a small circle. Show the puppet and model a wave and “Hello!”",
"Tell children: “Listen. When the puppet says hello, wave. When it says goodbye, wave goodbye.” Model each once without scoring.",
"Have the puppet greet each child by name. Pause so the child can wave, look, point to the matching card, or say a word.",
"On a second round, the puppet says “Thank you” after receiving a pretend toy. Children choose a polite response card or make a friendly gesture."
],"Child responds to the spoken greeting or polite phrase with a relevant gesture, picture choice, or word.", "Offer only two picture choices and repeat the phrase slowly. Invite a more ready child to follow a two-part cue: wave, then point to the hello card."),
activity("READING","Match my name and hello","8–10 min","Name cards, a large HELLO card, child photos or self-portraits, picture labels.",[
"Place the HELLO card and each child's name card beside a matching photo or self-portrait.",
"Point under HELLO and read it aloud. Trace left to right while the child watches; do not require independent decoding.",
"Give each child their name card and ask them to find the matching photo. Then ask them to place HELLO beside a puppet or greeting picture.",
"Read the two cards together. Children may point, match, or echo a word."
],"Child connects familiar printed forms to a person or greeting meaning and matches their own name.", "Use photo/name pairs for support. Children ready for more can find the first letter of their name on the card."),
activity("SPEAKING","Please, may I have the crayon?","10 min","Crayons, paper, a toy or puppet, two phrase cards: PLEASE / THANK YOU.",[
"Model a short exchange with the puppet: “Crayon, please.” “Here you are.” “Thank you.”",
"Give each child a turn choosing a crayon. Keep the PLEASE and THANK YOU cards visible.",
"Prompt only as much as needed: point to PLEASE; pause; accept a gesture, single word, or full phrase.",
"Swap roles so the child hands the crayon to the puppet or a partner and responds to thanks."
],"Child initiates or completes a polite request/response turn using a gesture, word, or phrase.", "For support, model and let the child repeat or point. For extension, add “Here you are” or let the child choose which crayon to request."),
activity("WRITING","Draw a greeting card","10–15 min","Half-sheets of paper, crayons, HELLO / HI model card, pencils or stamps.",[
"Show a simple card: a drawing of the child and a friend with HELLO written by the teacher.",
"Ask the child to draw someone they greet at school. Invite them to tell who is in the picture.",
"Offer a choice to trace HELLO, copy it, place a word sticker, dictate the word, or make marks that the child says mean hello.",
"Have each child give the card to a partner or puppet and use a greeting gesture or word."
],"Child creates a purposeful message for a reader through drawing plus emerging print, dictation, or a copied greeting.", "Accept drawing and child explanation as message-making. Extend by inviting the child to copy their own name or add BYE.")
]
S += [PageBreak(),Spacer(1,.12*inch),P("GRADE 1 • Pre-A1.3","GradeG"),
P("<b>Learning focus:</b> Expand familiar social interactions and follow simple classroom routines; express basic needs and take part in short conversations.","BodyG"),
activity("LISTENING","Classroom helper: listen and deliver","10 min","Book, pencil, crayons, box, picture cue cards.",[
"Put the objects in view and name them once. Demonstrate one sample direction that is not scored: “Touch the book.”",
"Give each child one short request: “Please bring me the pencil,” “Put the crayons in the box,” or “Give the book to Maya.”",
"Wait quietly while the child completes the action. Do not point to the target object during the try.",
"Repeat a request one time if needed and note whether the response followed the first hearing or the repeat."
],"Child identifies familiar object words and follows one-step directions that have a real classroom purpose.", "Use two objects and a gesture cue for support; add a polite two-step direction (“Pick up the book and give it to me”) for extension."),
activity("READING","Read the classroom routine picture cards","10–12 min","Photos showing line up, sit, share, clean up; matching word cards.",[
"Show a photo of one familiar routine. Say the action word, then reveal its word card (e.g., CLEAN UP).",
"Read the card together while pointing to each word. Explain its meaning using the photo and a brief classroom demonstration.",
"Give each child one word card and invite them to find the matching photo.",
"Place the matched cards in the order the class usually follows during transition time."
],"Child matches a highly familiar printed routine phrase to its picture and can show or name the action.", "Keep the choices to two for support. Extend by asking the child to find the routine card needed next in the real classroom."),
activity("SPEAKING","Ask for a classroom tool","10 min","Pencils, crayons, glue sticks; picture request cards; toy shop counter or desk.",[
"Arrange classroom tools as a small supply shop. Model: “May I have a pencil, please?” The partner answers, “Here you are.”",
"Give each child a picture showing the item they need. They take a turn as customer and then as helper.",
"Encourage use of PLEASE and THANK YOU cards; gradually point to the cards less.",
"After the role-play, use the same request naturally when distributing materials for a drawing task."
],"Child communicates a need and responds to a peer using a practiced polite phrase, word, or supported choice.", "Start with “Pencil, please.” Extend with “I need a pencil, please” and a follow-up “Here you are.”"),
activity("WRITING","Make a polite classroom rule sign","12–15 min","Large paper, crayons, classroom routine photos, word bank PLEASE / SHARE / WAIT.",[
"Discuss one real class routine, such as sharing crayons. Show a picture of the routine.",
"Teacher models writing “Please share.” Read the words aloud while writing.",
"Children draw the helpful action and complete or copy one word/phrase from the word bank.",
"Place the sign where the routine happens. Invite children to point to the sign and demonstrate the rule."
],"Child creates a sign with a clear audience and purpose; drawing, copied words, or dictated text communicates a classroom reminder.", "Provide dotted words to trace. Extend by adding a second phrase such as “Thank you.”"),
PageBreak(),Spacer(1,.12*inch),P("GRADE 2 • Pre-A1.4","GradeG"),
P("<b>Learning focus:</b> Follow familiar routines, express simple wants and needs, and engage in brief, supported conversations.","BodyG"),
activity("LISTENING","Two-step classroom mission","10–12 min","Book, bag, pencil, chair, desk; two picture sequence cards.",[
"Set the objects in a clear starting place. Show first/then picture cards and model an unrelated practice direction.",
"Give a meaningful two-step direction: “Get your book and put it in your bag,” or “Pick up the pencil and place it on the desk.”",
"Let the child complete both steps without physical prompting. Ask the child to show first/then using the picture cards afterward.",
"Use one direction per turn and reset the materials before the next child."
],"Child follows two familiar steps in order and understands key object/action words.", "For support, pause between steps and show first/then cards. Extend by adding a location or polite phrase."),
activity("READING","Put the picture story in order","12 min","Three- or four-panel illustrated classroom routine story with repeated words (first, then, please, thank you).",[
"Read the short story aloud while pointing to each panel. Children listen before receiving the cards.",
"Mix up the panels and have pairs put them in story order.",
"Read the story again. Ask children to point to the part where someone asks politely or says thank you.",
"Pairs retell by pointing to panels, using gestures, or saying a key word."
],"Child orders familiar events and locates a social phrase or action in a short picture-supported text.", "Reduce to three panels and offer a first/last visual cue. Extend by asking what might happen next and why."),
activity("SPEAKING","Can I help? partner routine","10–12 min","Classroom objects, role cards showing a child needing help or offering help.",[
"Model with a student: “Do you need help?” “Yes, please.” “Here you are.” “Thank you.”",
"Pair children. One draws a role card (cannot reach book, dropped crayons, needs a pencil); the partner asks how to help.",
"Switch roles. Encourage eye contact if comfortable, turn-taking, and a friendly response; do not require a fixed cultural gesture.",
"End with one real helping action in the classroom."
],"Child offers or accepts help and takes a conversational turn using a phrase, gesture, or picture support.", "Offer response cards YES, NO, THANK YOU. Extend by asking children to make a different polite offer."),
activity("WRITING","My two-panel classroom comic","15 min","Two-panel paper, crayons, phrase frames: CAN I ___? / THANK YOU.",[
"Show a two-panel example: in panel one a child asks for a book; in panel two a friend shares it.",
"Children draw a real classroom interaction in two steps.",
"Invite children to complete a phrase frame by copying, tracing, selecting a word card, or dictating to the teacher.",
"Pair-share the comic: one child points to the pictures while the partner listens; swap roles."
],"Child represents a simple interaction with a beginning and response through sequential pictures and emerging text.", "Offer pre-drawn characters and phrase choices. Extend to three panels including PLEASE."),
PageBreak(),Spacer(1,.12*inch),P("GRADE 3 • A1.1","GradeG"),
P("<b>Learning focus:</b> Recognize simple cultural norms and different communication styles, express simple opinions, and give or receive feedback respectfully.","BodyG"),
activity("LISTENING","Who wants to join the game?","12–15 min","Two short teacher-read dialogues; picture cards for ask, welcome, thank, refuse kindly.",[
"Explain the listening job: “Listen for what each child wants and how the other child responds.”",
"Read Dialogue A: a child asks to join a ball game and is welcomed. Read Dialogue B: a child asks to join drawing and is told, “Please wait one minute; then you can have a turn.”",
"Children place a picture card showing each response beside the matching dialogue.",
"Ask: “Which words helped you know?” Reread one line so learners can point to the clue."
],"Child identifies the request and response in a short spoken exchange and notices a polite phrase.", "Use pictures and read with clear pauses. Extend by asking children to compare the two responses."),
activity("READING","Build the dialogue strip","12–15 min","A short illustrated 4-line dialogue on cut-up strips.",[
"Display the illustrated dialogue and read it aloud once while children follow.",
"Give pairs shuffled dialogue strips: greeting, request to join, response, thanks.",
"Pairs arrange the lines in a sensible order and match them to the pictures.",
"Read the completed dialogue together, then cover one line and ask which line belongs there."
],"Child sequences a short written exchange and links each line with its speaker and meaning.", "Include speaker icons for support. Extend by asking pairs to replace one line with another polite option."),
activity("SPEAKING","Ask to join, welcome, and switch","15 min","Simple game materials; cue cards: Can I play? / Yes, join us. / Your turn next.",[
"Teach and rehearse three short phrases with gestures and choral practice.",
"In groups of three, one child is playing, one asks to join, and one observes for a welcoming phrase.",
"Run the role-play for one minute, pause, and rotate roles so each child practices asking and welcoming.",
"Observers share one specific positive comment: “You said ‘join us’ kindly.”"
],"Child asks to join or welcomes a peer with an appropriate phrase, takes turns, and gives simple feedback.", "Allow cue cards and partner rehearsal. Extend by having children choose a different game and adapt the phrase."),
activity("WRITING","Make a speech-bubble comic about joining","15–20 min","Three-panel comic template, speech-bubble word bank, crayons.",[
"Model a short comic: see a game, ask to join, receive a response.",
"Children draw the three events, then add at least two speech bubbles using the word bank.",
"Offer greeting, please, and thank-you words for copying; adult may scribe a child-generated line.",
"Partners read or describe their comics to each other and point out one polite phrase."
],"Child communicates a short social exchange through ordered pictures and understandable supported writing.", "Provide sentence starters. Extend by adding a second possible response and discussing which fits the scene."),
PageBreak(),Spacer(1,.12*inch),P("GRADE 4 • A1.2","GradeG"),
P("<b>Learning focus:</b> Use polite classroom language in familiar settings and notice that context can affect how people make requests.","BodyG"),
activity("LISTENING","Same request, two places","12–15 min","Two setting mats: home and school; object and speaker cards.",[
"Show the two setting mats. Explain that children will hear the same need expressed in two places.",
"Read two brief versions: to a friend, “Can I borrow your pencil?”; to a teacher, “Excuse me, may I borrow a pencil, please?”",
"Children place each speaker card on the correct setting and choose the matching polite phrase card.",
"Ask what stayed the same (need) and what changed (greeting/wording)."
],"Child hears the main request and notices a simple context-linked change in wording.", "Use picture clues and read each version twice. Extend with a third context such as a library."),
activity("READING","Find the clues in two mini-dialogues","15 min","Two illustrated mini-dialogues: classmates sharing a game; student requesting help from teacher.",[
"Read both dialogues aloud, then give each pair a copy.",
"Children circle or highlight greeting, request, and thanks using three colors or symbols.",
"Partners complete who/where/what cards using information in the dialogues.",
"Review by pointing to the exact words that show the setting or polite request."
],"Child locates stated information and recognizes common polite language in two familiar settings.", "Use color-coded icons instead of requiring full written answers. Extend by comparing which words are more formal."),
activity("SPEAKING","Change the audience, keep the request","15 min","Role cards (friend, teacher, librarian); classroom object cards.",[
"Choose one request, such as borrowing a book. Model it first to a friend, then to a librarian.",
"Pairs draw an audience card and act out the request using a greeting and polite phrase.",
"Partner listens and identifies the audience from the wording.",
"Switch roles and discuss which phrase helped make the request clear and respectful."
],"Child adapts a familiar request to a simple audience/context and responds to a partner.", "Provide phrase frames. Extend by asking learners to explain the word choice in one sentence."),
activity("WRITING","Invite a classmate to an activity","15–20 min","Invitation template, picture choices (read, draw, play), word bank.",[
"Show a model invitation with greeting, activity, question, and closing.",
"Children choose a real classroom activity and complete the template: “Hi ___. Would you like to ___ with me? From ___.”",
"Children draw a small picture and check that the invitation says what, when or where (as appropriate), and who is invited.",
"Deliver the invitation and let the receiver answer orally or with a choice card."
],"Child writes a short purposeful message with greeting, invitation, and closing using support.", "Offer cut-and-paste phrases or dictation. Extend with a time/place detail."),
PageBreak(),Spacer(1,.12*inch),P("GRADE 5 • A1.3","GradeG"),
P("<b>Learning focus:</b> Become aware of cultural norms, exchange simple opinions, and collaborate respectfully. Avoid treating a community's customs as universal; learners may share only what they choose.","BodyG"),
activity("LISTENING","Listen for each person's idea","15 min","Teacher-read statements about preferred greetings or classroom routines; simple two-column tally chart.",[
"Tell learners to listen for each speaker's preference, not decide which is right.",
"Read two short child-friendly statements, e.g., “I like to wave when I say hello” and “I like to say good morning.”",
"Students place a token or mark under each speaker's chosen greeting.",
"Read again and ask learners to name one similarity (both greet people) and one difference (the greeting action/words)."
],"Learner records a speaker's stated preference and compares ideas without judgment.", "Use images instead of text in the chart. Extend by inviting learners to formulate one respectful follow-up question."),
activity("READING","Compare two culture snapshots","15–20 min","Two short fictional snapshots about greetings or classroom routines; comparison Venn diagram.",[
"Preview two picture-supported snapshots and clarify unfamiliar words.",
"Students read silently or with a partner, marking one detail about each routine.",
"Fill a Venn diagram with one difference and one shared purpose (for example, welcoming someone).",
"Discuss why we should ask people about their own preferences rather than assume everyone follows one custom."
],"Learner finds stated details in two short texts and makes a text-based comparison.", "Provide highlighted evidence or sentence frames. Extend by writing the source phrase beside each idea."),
activity("SPEAKING","Show and ask with respect","15–20 min","Optional picture/object chosen by student, prepared question cards.",[
"Model a 30-second share about a familiar routine and a respectful question: “Would you like to tell us more about…?”",
"Students choose a routine, greeting, or classroom custom they are comfortable sharing; passing is allowed.",
"Listeners ask one prepared question or give a respectful response: “I noticed…” / “Thank you for sharing.”",
"Rotate roles and give feedback on listening and turn-taking, not on whether customs are familiar."
],"Learner shares a simple idea, asks a relevant question, and responds respectfully to a peer.", "Allow drawing or paired sharing. Extend with a comparison to a routine from a teacher-provided story."),
activity("WRITING","Write a fair comparison card","15–20 min","Two snapshot texts; comparison writing frame.",[
"Revisit the two snapshots and underline one accurate fact in each.",
"Complete a short frame: “In story A, ___. In story B, ___. Both ___. I learned ___.”",
"Check each sentence against the text so the comparison does not rely on guesses about a whole culture.",
"Share the card with a partner, who points to the evidence in the snapshots."
],"Learner writes a short comparison with one difference, one similarity, and details supported by the texts.", "Accept a dictated or partly completed frame. Extend with “I wonder…” and a respectful question."),
PageBreak(),Spacer(1,.12*inch),P("GRADE 6 • A2.1","GradeG"),
P("<b>Learning focus:</b> Use polite language in familiar social situations, understand simple viewpoints, and begin to notice intercultural differences.","BodyG"),
activity("LISTENING","Opinion, reason, response","15–18 min","Teacher-read 1-minute discussion about welcoming a new student; organizer with speaker/opinion/reason.",[
"Explain the listening task: record what each speaker thinks and why.",
"Read a short dialogue: one student suggests a welcome buddy; another agrees and gives a reason; a third suggests a welcome map.",
"Learners fill the organizer with keywords, drawings, or phrase cards while listening.",
"Read once more and ask learners to choose a respectful response that builds on one idea."
],"Learner identifies an opinion and its stated reason and recalls a relevant idea from another speaker.", "Provide icons (idea/reason) and pause after each turn. Extend by noting whether two ideas can work together."),
activity("READING","Two viewpoints, one situation","18–20 min","Two short accounts of a new student joining a group; highlighters.",[
"Read the first account and underline what the student says they felt or needed.",
"Read a second account from a classmate's perspective; underline the detail that explains their actions.",
"Complete a compare chart: viewpoint A, viewpoint B, evidence from each.",
"Discuss which questions could clarify the situation before making a judgment."
],"Learner locates details that show perspective and supports an interpretation with evidence.", "Shorten the texts or read them aloud. Extend by identifying a detail that would be useful to ask about."),
activity("SPEAKING","Small-group inclusion solution circle","18–20 min","Scenario card: a new classmate is left without a partner; discussion stems.",[
"Read the scenario aloud and let each student think quietly for one minute.",
"Each student offers one solution using “I think we could…” and gives a reason using “because…”.",
"Before adding an idea, the next speaker paraphrases: “I heard you say…”",
"Group chooses one workable solution and practices the words they would use with the new student."
],"Learner gives an opinion with a reason, listens to another view, and contributes to a shared solution.", "Give sentence stems and a turn token. Extend by asking the group to compare two possible solutions."),
activity("WRITING","Write a helpful advice note","15–20 min","Scenario card, advice note template.",[
"Review the inclusion scenario and brainstorm kind, practical actions.",
"Write a short note with a greeting, one suggestion, a reason, and a supportive closing.",
"Use a checklist: Is it kind? Is the action clear? Did I give a reason?",
"Exchange notes and underline the suggestion and its reason."
],"Learner writes a connected note suited to a peer and gives a relevant suggestion with a reason.", "Provide a word bank and sentence frames. Extend by adding a second option or a question."),
PageBreak(),Spacer(1,.12*inch),P("GRADE 7 • A2.2","GradeG"),
P("<b>Learning focus:</b> Use polite phrases in discussion, understand clear implied meaning in simple conversations, and recognize different ways of expressing a viewpoint.","BodyG"),
activity("LISTENING","What does each person want?","15–18 min","Teacher-read short conversation about sharing a game or workspace; intent picture cards.",[
"Explain that students will listen for each person's goal, not just repeat exact words.",
"Read a conversation in which one child says, “I was using that,” and another asks, “Could I have a turn when you're done?”",
"Students choose a goal card for each speaker: keep using item, ask for a turn, agree on a plan.",
"Reread and have students point to the words that helped them infer each goal."
],"Learner infers a clear want or intention from a short, supported exchange and gives a language clue.", "Use three picture choices. Extend with a second plausible interpretation and discuss what additional context is needed."),
activity("READING","Clue detective: feelings and intentions","18 min","Short dialogue with clear context; clue/highlighter sheet.",[
"Read the dialogue once for the situation.",
"On a second reading, learners underline exact words that suggest a feeling or intention.",
"Choose from a small set of feeling/intent cards and connect the choice to an underlined clue.",
"Compare answers in pairs using “I think ___ because the text says ___.”"
],"Learner makes a supported inference from written dialogue and cites a relevant phrase.", "Offer a limited word bank. Extend by distinguishing what the text states from what the reader infers."),
activity("SPEAKING","Repair the misunderstanding","18–20 min","Low-stakes scenario cards (misheard game rule, shared supplies); repair phrase strips.",[
"Teach three phrases: “Do you mean…?”, “Sorry, I misunderstood,” and “Let's take turns.”",
"Pairs draw a scenario and act out a small misunderstanding.",
"One partner uses a clarification or apology; the other answers and helps agree on a solution.",
"Repeat the role-play, switching roles and selecting a different repair phrase."
],"Learner uses a clarification, apology, or compromise phrase to keep a conversation going.", "Keep the phrase strip visible. Extend by asking learners to explain which phrase repaired the talk most clearly."),
activity("WRITING","Write a reasoned reflection","18–20 min","Scenario dialogue; short paragraph frame.",[
"Reread the scenario and select one respectful response.",
"Write four sentences: what happened, what each person wanted, what response could help, and why.",
"Include one phrase from the dialogue as evidence.",
"Partner checks whether the reason connects to the suggested response."
],"Learner writes a short connected response with a relevant reason and detail from the scenario.", "Use sentence starters. Extend by including a second possible solution and comparing them."),
PageBreak(),Spacer(1,.12*inch),P("GRADE 8 • A2.3","GradeG"),
P("<b>Learning focus:</b> Adapt language to a different audience and context, identify tone, and build awareness of cultural variation in communication.","BodyG"),
activity("LISTENING","Hear the tone, choose a response","15–18 min","Teacher-recorded or teacher-read neutral and impatient versions of the same request; tone word cards.",[
"Tell learners the words stay almost the same, but the speaker's tone changes.",
"Read “Could you move your bag, please?” once neutrally and once impatiently, without exaggerating or mocking.",
"Students choose a tone card (calm, annoyed, friendly) and a response that would help.",
"Discuss which cues they heard: pace, volume, stress, and context. Avoid saying that one voice style always means one emotion."
],"Learner notices basic tone cues and suggests a contextually appropriate response.", "Use only two tone choices. Extend with a role-play showing how a calm clarification can help."),
activity("READING","Who is this message for?","18–20 min","School announcement and friendly message on the same topic.",[
"Read both texts and identify the shared topic.",
"Mark clues in each text: greeting, word choice, sentence length, and sign-off.",
"Complete audience/purpose cards: who should read it, and what should they do or know?",
"Discuss how the wording changes while the main message stays similar."
],"Learner identifies audience and purpose using clues from the text.", "Provide symbols for friend/group/school. Extend by finding one phrase that could be changed for the other audience."),
activity("SPEAKING","One request, two audiences","18–20 min","Audience cards (friend, teacher, librarian); request cards.",[
"Choose a request such as borrowing a book. Brainstorm how to ask a friend and a librarian.",
"Pairs draw an audience card and prepare the request for that person.",
"Perform both versions; listeners identify the audience and explain one language clue.",
"Discuss that respectful language varies by situation and community; neither version represents every speaker."
],"Learner adjusts greeting or wording for an audience and can explain one choice.", "Provide model phrases. Extend by changing only one feature at a time (greeting, modal, closing)."),
activity("WRITING","Rewrite a note for school","18–22 min","Sample overly casual note; rewrite checklist.",[
"Read a short casual note requesting an extension or borrowing an item.",
"Underline the key meaning that must stay the same.",
"Rewrite it for a teacher or librarian with greeting, clear request, please, and closing.",
"Compare the original and revised note: identify what changed and what meaning stayed."
],"Learner adapts register for a school audience while preserving the message.", "Offer a phrase bank and sentence frames. Extend with a brief reason or relevant detail."),
PageBreak(),Spacer(1,.12*inch),P("GRADE 9 • A2.4","GradeG"),
P("<b>Learning focus:</b> Understand simple social issues and perspectives, communicate with intercultural sensitivity, and ask respectful questions.","BodyG"),
activity("LISTENING","Interview notes: custom, view, detail","18–20 min","Short teacher-read interview about a community event; organizer (speaker/view/detail/question).",[
"Explain that students will listen for what the speaker personally says, not generalize to a whole group.",
"Read a short first-person interview about a chosen community event or routine.",
"Learners note one view and one supporting detail using keywords or sketches.",
"Students write or select one open question that invites the speaker to explain more."
],"Learner captures a speaker's main point and one detail and forms a respectful follow-up question.", "Provide note icons and replay a selected excerpt. Extend by distinguishing fact from personal preference."),
activity("READING","Compare two first-person accounts","20 min","Two brief accounts of the same school/community event; evidence tracker.",[
"Read Account A and note one experience the speaker describes.",
"Read Account B and note one experience or view.",
"Complete a comparison with one similarity and one difference, citing a phrase from each account.",
"Highlight any statement that is evidence and any conclusion that would be an assumption."
],"Learner compares perspectives fairly and supports the comparison with source details.", "Use shorter texts and provide sentence frames. Extend by noting what context might explain the difference."),
activity("SPEAKING","Ask, paraphrase, follow up","20 min","Prepared open-question cards; opt-in topic choices.",[
"Model an interview: ask an open question, listen without interrupting, paraphrase, then ask a follow-up.",
"Partners choose a topic they are comfortable discussing; personal cultural disclosure is optional.",
"Partner A asks two questions and paraphrases one answer before asking a follow-up; then switch.",
"Close by thanking the partner and naming one idea learned."
],"Learner asks relevant open questions, paraphrases accurately, and listens respectfully.", "Provide question stems. Extend with a follow-up that asks for an example, not private information."),
activity("WRITING","Evidence-based comparison paragraph","20–25 min","Two accounts and paragraph organizer.",[
"Select one similarity and one difference from the evidence tracker.",
"Write a paragraph with a topic sentence, two evidence details, and a respectful concluding sentence.",
"Check that each claim can be traced to the accounts and that no single example is presented as universal.",
"Partner highlights the comparison claim and circles the source details."
],"Learner produces a clear comparison supported by details from both texts.", "Use a paragraph frame or dictation. Extend by adding a cautious phrase such as “In this account…”"),
PageBreak(),Spacer(1,.12*inch),P("GRADE 10 • B1.1","GradeG"),
P("<b>Learning focus:</b> Develop academic and intercultural communication skills; represent viewpoints fairly and support contributions with evidence.","BodyG"),
activity("LISTENING","Map the panel's views and reasons","20–25 min","Teacher-curated 3–4 minute panel or teacher-read script about a school inclusion issue; claim/reason map.",[
"Preview the listening organizer: speaker, position, reason, example.",
"Play or read the panel once without pausing; learners note keywords.",
"Listen a second time and add one supporting example or point of agreement/disagreement.",
"Pairs compare maps and check one detail against the audio or script."
],"Learner accurately identifies multiple viewpoints and links at least one reason or example to each.", "Provide speaker names and a partially completed map. Extend by noting a question the panel leaves unanswered."),
activity("READING","Claims, evidence, missing perspective","22–25 min","Two age-appropriate teacher-selected texts; annotation key.",[
"Preview the question both texts address.",
"Read Text A and mark the main claim and one supporting detail.",
"Read Text B and repeat; then note whose perspective is represented in each text.",
"Compare the support and identify one question or perspective not covered by either text."
],"Learner distinguishes claim from evidence and notices limits in source perspective.", "Use shorter excerpts and preteach vocabulary. Extend by checking source/date/author using teacher-provided source notes."),
activity("SPEAKING","Structured discussion: include every voice","20–25 min","Discussion question, evidence cards, speaking stems, turn tracker.",[
"Set a clear question based on the texts. Students prepare one claim and one piece of evidence.",
"Use a round where each learner speaks once before anyone speaks a second time.",
"Students build on or respectfully challenge ideas using “I agree because…” / “I see it differently because…”",
"End with a group summary that fairly states at least two positions."
],"Learner supports a position with evidence, responds to peers constructively, and shares discussion space.", "Allow written rehearsal and stems. Extend by asking a student to summarize a view they do not hold."),
activity("WRITING","Write a recommendation to the school","22–25 min","Texts from reading task; claim/evidence/recommendation organizer.",[
"Choose a practical school action connected to the discussion.",
"Plan a paragraph or brief email with context, recommendation, evidence, and a respectful closing.",
"Include a detail from one source and acknowledge a possible concern.",
"Peer review: underline the recommendation, box the evidence, and mark the audience-appropriate language."
],"Learner creates an organized message for a real audience with a supported recommendation.", "Provide organizer and phrase bank. Extend by adding a counterpoint and response."),
PageBreak(),Spacer(1,.12*inch),P("GRADE 11 • B1.2","GradeG"),
P("<b>Learning focus:</b> Refine academic and professional communication, participate in intercultural dialogue, and adapt language to audience and purpose.","BodyG"),
activity("LISTENING","Listen to a moderated discussion","22–25 min","Teacher-selected discussion or short teacher-read script; speaker/claim/example tracker.",[
"Preview the issue and the listening tracker without preteaching answers.",
"Listen once for each speaker's main position; record keywords.",
"Listen again for supporting examples, agreement, and disagreement.",
"In pairs, compare notes and choose one claim to verify in the transcript or source text."
],"Learner tracks positions and supporting examples across a longer exchange and distinguishes agreement from disagreement.", "Provide a speaker list and replay sections. Extend by noting a change in a speaker's position, if present."),
activity("READING","Evaluate purpose and perspective","22–25 min","Two reliable, age-appropriate sources on an intercultural communication topic; source cards.",[
"Review author, date, audience, and purpose on each source card.",
"Read both sources and annotate one claim, one support detail, and one perspective clue.",
"Complete a comparison: where the sources agree, differ, and what evidence each uses.",
"Discuss what additional source or voice could make the picture more complete."
],"Learner compares sources using purpose, support, and perspective rather than personal preference alone.", "Provide excerpts and annotation symbols. Extend by assessing whether the evidence directly supports each claim."),
activity("SPEAKING","Evidence-based mini-seminar","22–25 min","Prepared question, source excerpts, seminar roles (speaker, paraphraser, connector).",[
"Students prepare a claim and two source details.",
"Conduct a seminar in which each contribution refers to a source or builds on a previous speaker.",
"Before disagreeing, paraphrase the idea being answered fairly.",
"Rotate roles so each student contributes as speaker, paraphraser, and connector."
],"Learner contributes relevant evidence, paraphrases fairly, and adapts disagreement language to an academic exchange.", "Offer preparation time and stems. Extend by inviting students to qualify a claim or identify uncertainty."),
activity("WRITING","Formal email for an inclusive practice","22–25 min","School scenario, email format model, source notes.",[
"Choose a real school audience and a practical inclusive practice to recommend.",
"Draft a subject, greeting, brief context, recommendation, evidence, and closing.",
"Revise tone for the reader; remove unsupported generalizations and check clarity.",
"Use a peer checklist to confirm purpose, evidence, register, and respectful wording."
],"Learner writes a coherent formal message with an audience-aware register and relevant support.", "Use an email frame. Extend by adding a concise counterargument and response."),
PageBreak(),Spacer(1,.12*inch),P("GRADE 12 • B1.3","GradeG"),
P("<b>Learning focus:</b> Refine academic/professional communication, synthesize perspectives, and engage in intercultural dialogue for a defined purpose.","BodyG"),
activity("LISTENING","Synthesize a talk and interview","22–25 min","Short teacher-curated talk and two interview excerpts; synthesis grid.",[
"Preview the guiding question and grid: shared idea, distinct perspective, evidence, speaker purpose.",
"Listen to the talk and note its central point and one example.",
"Listen to interview excerpts and add each speaker's perspective and one supporting detail.",
"Write a two-sentence synthesis that connects the sources and names one limitation or unanswered question."
],"Learner combines information across spoken sources while keeping perspectives distinct and noting a limitation.", "Provide timestamps or replay selected excerpts. Extend by comparing source purposes and reliability."),
activity("READING","Synthesize a small source set","25–30 min","Three short, teacher-curated sources with different viewpoints; source synthesis matrix.",[
"Read each source and record its central claim, evidence, audience, and perspective.",
"Group details by theme rather than writing one summary per source.",
"Identify where the sources agree, where they differ, and what context may explain the difference.",
"Write a brief synthesis with citations or source labels and a note on what the set does not establish."
],"Learner synthesizes across sources, attributes ideas fairly, and distinguishes supported conclusions from gaps.", "Use two sources and a guided matrix. Extend by evaluating the strength and relevance of evidence."),
activity("SPEAKING","Panel presentation with Q&A","25–30 min","Research notes, presentation outline, audience question cards.",[
"Prepare a short position on a defined community or school communication issue using two sources.",
"Present the issue, two perspectives, evidence, and a practical conclusion.",
"During Q&A, listen fully, paraphrase a challenging question, and answer or acknowledge what remains uncertain.",
"Peers use a rubric to note clarity, evidence, fairness, and audience awareness."
],"Learner presents a supported position, responds to questions, and adapts explanation to listeners.", "Allow notes and rehearsal. Extend by having students facilitate the Q&A or address a counterargument."),
activity("WRITING","Write an audience-specific proposal","25–30 min","Proposal template; research notes; audience profile.",[
"Define the audience and a practical communication need or inclusion opportunity.",
"Draft a proposal with context, evidence, recommendation, implementation step, and considered counterpoint.",
"Check each claim against source notes; attribute evidence and avoid overgeneralizing.",
"Revise for the audience and produce a concise final version with a clear requested action."
],"Learner produces an organized proposal that integrates evidence, audience, purpose, and a practical recommendation.", "Provide section headings and a checklist. Extend by adding evaluation criteria for the proposed action."),
PageBreak(),Spacer(1,.12*inch),P("QUICK TEACHER PLANNING & ASSESSMENT","GradeG"),
P("Use this page to turn the activity guide into evidence of learning for each named skill.","BodyG"),
P("A simple four-step lesson routine","SkillG")]
routine=[
[P("<b>Before</b>","BoxG"),P("Prepare real objects, pictures, short texts, phrase cards, or age-appropriate audio. Choose one skill to assess and state the success evidence in child-friendly language.","BoxG")],
[P("<b>Model</b>","BoxG"),P("Demonstrate the task once without scoring. Show the expected action or communication and make the language accessible.","BoxG")],
[P("<b>Practice</b>","BoxG"),P("Let students try with a partner or small group. Give feedback tied to the skill (e.g., “You listened for the request,” “You found the clue in the text”).","BoxG")],
[P("<b>Check</b>","BoxG"),P("Collect one observable response from each learner. Record what they can do independently and what support helped; use that to choose the next practice step.","BoxG")]
]
rt=Table(routine,colWidths=[1.0*inch,6.0*inch])
rt.setStyle(TableStyle([("GRID",(0,0),(-1,-1),.5,line),("VALIGN",(0,0),(-1,-1),"TOP"),("BACKGROUND",(0,0),(0,-1),pale),("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),7),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)]))
S += [rt,Spacer(1,10),P("Quick observation record","SkillG")]
obs=[
[P("Student","BoxG"),P("Skill / activity","BoxG"),P("Independent evidence","BoxG"),P("Support that helped / next step","BoxG")],
[P("________________","BoxG"),P("________________________","BoxG"),P("____________________________","BoxG"),P("____________________________","BoxG")],
[P("________________","BoxG"),P("________________________","BoxG"),P("____________________________","BoxG"),P("____________________________","BoxG")],
[P("________________","BoxG"),P("________________________","BoxG"),P("____________________________","BoxG"),P("____________________________","BoxG")],
[P("________________","BoxG"),P("________________________","BoxG"),P("____________________________","BoxG"),P("____________________________","BoxG")],
]
ot=Table(obs,colWidths=[1.25*inch,1.65*inch,2.0*inch,2.1*inch],rowHeights=[.4*inch]+[.58*inch]*4)
ot.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,0),colors.HexColor("#E8F0F3")),("GRID",(0,0),(-1,-1),.5,line),("VALIGN",(0,0),(-1,-1),"TOP"),("LEFTPADDING",(0,0),(-1,-1),6),("RIGHTPADDING",(0,0),(-1,-1),6),("TOPPADDING",(0,0),(-1,-1),6)]))
S += [ot,Spacer(1,12),callout(P("<b>Alignment note:</b> The activities follow the grade-to-CEFR mapping shown in the supplied “Table 3. Sociolinguistic Competence Across CEFR Levels.” CEFR bands describe language proficiency, not fixed age or ability; adjust text complexity, response mode, repetition, and independence to each learner. Early-grade reading/writing tasks assess meaningful print awareness and message-making, not advanced decoding or conventional spelling.","BoxG"),bg=colors.HexColor("#FFF7E2"),border=gold),
Spacer(1,9),P("<b>Use of reference:</b> The attached table guided the grade bands, sociolinguistic focus, and classroom considerations. The activities in this guide are newly developed classroom procedures designed to provide authentic practice in the four language skills.","SmallG")]

doc.build(S,onFirstPage=hf,onLaterPages=hf)
print(OUT)

