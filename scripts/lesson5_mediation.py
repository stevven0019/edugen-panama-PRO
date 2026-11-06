# -*- coding: utf-8 -*-
"""
EduGen Panama - Scenario 1 Theme 1 - Lesson 5: Mediation
Grade 4 • CEFR Level: Beginner A1.2
"""

import os
from prototype_shared import (
    PUBLIC_DIR, get_asset, build_awning, build_top_nav, 
    build_tg_nav, build_footer, wrap_html
)

def generate_lesson5_mediation():
    skill = "Mediation"
    num = 5
    pages = []

    # Page 1: Stage 1 Warm-up (Sign Detective)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🤝 STAGE 1: WARM-UP & ACTIVATION &bull; SIGN MEDIATION</div>
        <div class="stage-time">5-7 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Help a New Classmate!</strong> Carlos is a new student who does not know the neighborhood yet. Look at the 3 community signs. Match each sign to the simplified English explanation you would tell Carlos! (Scrambled!).
        </div>

        <div class="grid-3">
          <div class="card" style="text-align: center; border: 2px solid #2A9D8F;">
            <div style="font-size: 26pt;">🚮 🌸</div>
            <div style="font-weight: 800; font-size: 9pt; color: #2A9D8F;">SIGN 1: Clean Park</div>
            <div style="font-size: 7.8pt; color: #64748B;">Trash Can Symbol</div>
          </div>
          <div class="card" style="text-align: center; border: 2px solid #F59E0B;">
            <div style="font-size: 26pt;">⏰ 🛝</div>
            <div style="font-weight: 800; font-size: 9pt; color: #F59E0B;">SIGN 2: Hours</div>
            <div style="font-size: 7.8pt; color: #64748B;">Clock Symbol</div>
          </div>
          <div class="card" style="text-align: center; border: 2px solid #457B9D;">
            <div style="font-size: 26pt;">🚶 🛑</div>
            <div style="font-weight: 800; font-size: 9pt; color: #457B9D;">SIGN 3: Crosswalk</div>
            <div style="font-size: 7.8pt; color: #64748B;">Walking Figure</div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">🗣️ How to Mediate (Explain Simply)</div>
          <div style="font-size: 8.5pt; line-height: 1.5; color: #1E293B;">
            <div>&bull; <strong>Explanation A:</strong> "Carlos, this sign means we must look both ways and walk safely across Oak Street!" -> <strong>[ Sign _____ ]</strong></div>
            <div>&bull; <strong>Explanation B:</strong> "Carlos, this sign means Sunshine Park is open until 6:00 PM for playing!" -> <strong>[ Sign _____ ]</strong></div>
            <div>&bull; <strong>Explanation C:</strong> "Carlos, this sign means we must put our trash in the bin to keep our park clean!" -> <strong>[ Sign _____ ]</strong></div>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🤝</span>
        <span><strong>Mediation Power:</strong> Mediation means using simple words, signs, and gestures to help others understand!</span>
      </div>
      {build_footer(1, skill)}
    </div>
    """)

    # Page 2: Stage 2 Input (School Notice Breakdown)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">📢 STAGE 2: PRESENTATION & INPUT &bull; NOTICE MEDIATION</div>
        <div class="stage-time">8-10 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Official School Bulletin:</strong> Read the formal notice from the Principal below. Then study the mediation table to see how we translate complicated text into simple English for a peer!
        </div>

        <div class="card" style="background: #F8FAFC; border: 2px solid #64748B;">
          <div style="text-align: center; font-family: 'Fredoka One', cursive; font-size: 11pt; color: #1E293B; margin-bottom: 4px;">
            🏫 OFFICIAL SCHOOL ANNOUNCEMENT: GRADE 4 FIELD TRIP
          </div>
          <p style="font-size: 8.2pt; line-height: 1.35; color: #334155; font-style: italic;">
            "Attention Students: On Friday morning, Grade 4 classes will embark on an educational walking tour of the local municipal surroundings. Students will cast ballots between Sunshine Park and Joy Playground. Please confer with peers."
          </p>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">🔄 Text-to-Peer Mediation Bridge</div>
          <table class="styled-table" style="font-size: 7.8pt;">
            <tr>
              <th style="width: 50%;">What the Bulletin Says (Difficult)</th>
              <th style="width: 50%;">How to Tell Your Partner (Simple English)</th>
            </tr>
            <tr>
              <td>"embark on an educational walking tour..."</td>
              <td><strong>"We have a fun field trip on Friday!"</strong></td>
            </tr>
            <tr>
              <td>"cast ballots between Sunshine Park and Joy Playground..."</td>
              <td><strong>"We can choose the park or playground!"</strong></td>
            </tr>
            <tr>
              <td>"confer with peers..."</td>
              <td><strong>"Let's talk and vote for our favorite place!"</strong></td>
            </tr>
          </table>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">💡</span>
        <span><strong>Communication Bridge:</strong> A great mediator turns difficult official language into friendly, easy-to-understand English!</span>
      </div>
      {build_footer(2, skill)}
    </div>
    """)

    # Page 3: Stage 3 Controlled Practice (Turn-Taking Phrases)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🤝 STAGE 3: CONTROLLED PRACTICE &bull; TURN-TAKING TOOLBOX</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Turn-Taking Mediation Toolbox:</strong> Choose the best helping phrase for each classroom situation to facilitate communication between classmates!
        </div>

        <div class="card">
          <div style="display: flex; flex-direction: column; gap: 7px; font-size: 8.5pt; color: #1E293B;">
            <div style="border-bottom: 1px dashed #CBD5E1; padding-bottom: 4px;">
              <strong>Situation 1: Your classmate is shy and has not spoken yet. What do you say?</strong><br>
              [ ] (A) "It is your turn! What is your favorite place?"<br>
              [ ] (B) "I will speak the whole time."
            </div>

            <div style="border-bottom: 1px dashed #CBD5E1; padding-bottom: 4px;">
              <strong>Situation 2: Your classmate does not know what 'swings' are. What do you do?</strong><br>
              [ ] (A) Point to the playground picture and say: "Look, you sit here and swing high!"<br>
              [ ] (B) Laugh and walk away.
            </div>

            <div>
              <strong>Situation 3: You agree with your classmate's favorite place. What do you say?</strong><br>
              [ ] (A) "That is a great choice because Sunshine Park has beautiful flowers!"<br>
              [ ] (B) "No, that is boring."
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">🔑 Mediation Phrases to Remember</div>
          <div style="display: flex; justify-content: space-around; font-size: 8.2pt; font-weight: 700; color: #0F766E;">
            <span>&bull; "What do you think?"</span>
            <span>&bull; "Look at this picture!"</span>
            <span>&bull; "I agree because..."</span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🌟</span>
        <span><strong>Peer Scaffolding:</strong> Showing pictures and asking gentle questions makes everyone feel included in the team!</span>
      </div>
      {build_footer(3, skill)}
    </div>
    """)

    # Page 4: Stage 4 Guided Practice (Collaborative Map Guide)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🗺️ STAGE 4: GUIDED PRACTICE &bull; COLLABORATIVE MAP GUIDE</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Collaborative Guide:</strong> Work with a partner to complete a bilingual / visual neighborhood guide for visiting families. Write a helpful note for each location!
        </div>

        <div class="card">
          <div style="display: flex; flex-direction: column; gap: 7px;">
            <div style="display: flex; align-items: center; gap: 8px; background: #F0FDFA; padding: 6px; border-radius: 8px;">
              <img src="{get_asset('park.png')}" style="width: 44px; height: 44px; object-fit: contain;">
              <div style="flex: 1; font-size: 8.2pt;">
                <strong>1. Sunshine Park (Rest & Nature Zone)</strong><br>
                Helpful Note for Visitors: "Visit here <em>because</em> it is the best place to relax under green trees."
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px; background: #FFFBEB; padding: 6px; border-radius: 8px;">
              <img src="{get_asset('playground.png')}" style="width: 44px; height: 44px; object-fit: contain;">
              <div style="flex: 1; font-size: 8.2pt;">
                <strong>2. Joy Playground (Active Fun Zone)</strong><br>
                Helpful Note for Visitors: "Visit here <em>because</em> it has exciting swings and the newest slide."
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px; background: #F8FAFC; padding: 6px; border-radius: 8px;">
              <img src="{get_asset('street.png')}" style="width: 44px; height: 44px; object-fit: contain;">
              <div style="flex: 1; font-size: 8.2pt;">
                <strong>3. Oak Street (Safe Walking Route)</strong><br>
                Helpful Note for Visitors: "Walk here safely <em>because</em> it has clean sidewalks and crosswalks."
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">🤝 Team Collaboration Check</div>
          <div style="display: flex; justify-content: space-around; font-size: 8.2pt; font-weight: 700; color: #475569;">
            <span>[ ] Partner A shared ideas</span>
            <span>[ ] Partner B wrote the notes</span>
            <span>[ ] We both agreed!</span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🗺️</span>
        <span><strong>Community Service:</strong> Creating clear guides for visitors builds community pride and English civic competence!</span>
      </div>
      {build_footer(4, skill)}
    </div>
    """)

    # Page 5: Stage 5 Free Production (21st Century Project 1: Poster & Tour)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🎨 STAGE 5: FREE PRODUCTION &bull; 21st CENTURY PROJECT 1</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>21st Century Skills Project 1:</strong> Design a promotional campaign poster to persuade classmates to visit your favorite place! Complete the poster banner, draw the place, and present your tour guide points!
        </div>

        <div class="card" style="border: 2.5px solid #2A9D8F; background: #FFFDF9; padding: 8px;">
          <div style="text-align: center; font-family: 'Fredoka One', cursive; font-size: 13pt; color: #2A9D8F; margin-bottom: 4px;">
            🌟 VOTE FOR OUR FIELD TRIP: WELCOME TO [ PLACE ]! 🌟
          </div>

          <div style="height: 100px; border: 2px dashed #94A3B8; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #FFF; margin-bottom: 6px;">
            <span style="font-size: 8.5pt; font-weight: 700; color: #94A3B8;">[ Draw Your Favorite Place Poster Illustration ]</span>
          </div>

          <div style="font-size: 8.2pt; line-height: 1.4; color: #1E293B;">
            <strong>Tour Guide Presentation Points:</strong><br>
            1. "Classmates, this is <strong>the best</strong> place in our neighborhood!"<br>
            2. "You should vote for it <strong>because</strong> it has ____________________________________."<br>
            3. "When our class visits, we can ____________________________________ together!"
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🏆</span>
        <span><strong>21st Century Skills:</strong> Creativity + Critical Thinking + Communication + Collaboration in action!</span>
      </div>
      {build_footer(5, skill)}
    </div>
    """)

    # Page 6: Stage 6 Wrap-up (Mediation Badge)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🏅 STAGE 6: WRAP-UP & EXIT TICKET &bull; MEDIATION BADGE</div>
        <div class="stage-time">5 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Mediation Reflection:</strong> Check your cooperative learning habits from today's lesson to earn your Peer Mediator Badge!
        </div>

        <div class="card">
          <div style="font-size: 8.5pt; line-height: 1.5; color: #1E293B;">
            [ ] <strong>1. Listening Respectfully:</strong> I listened when my partner explained their ideas without interrupting.<br>
            [ ] <strong>2. Using Visual Aids:</strong> I pointed to pictures and signs to help my partner understand.<br>
            [ ] <strong>3. Explaining Reasons:</strong> I used the connector <em>because</em> to explain why a place is great.<br>
            [ ] <strong>4. Encouraging Peers:</strong> I invited my partner to take turns: <em>"What do you think?"</em>
          </div>
        </div>

        <div class="card" style="margin-top: 4px; text-align: center; background: #F0FDFA; border: 2px solid #2A9D8F;">
          <div class="card-header" style="justify-content: center; color: #0F766E;">🎖️ Certified Peer Mediator Badge</div>
          <p style="font-size: 8.5pt; color: #334155; margin: 4px 0;">
            "I can bridge communication, help peers understand English notices, and collaborate respectfully!"
          </p>
          <div style="margin-top: 6px;">
            Partner Endorsement Signature: <span class="line" style="width: 150px;"></span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🎉</span>
        <span><strong>Congratulations!</strong> You completed Lesson 5: Mediation with empathy, collaboration, and civic leadership!</span>
      </div>
      {build_footer(6, skill)}
    </div>
    """)

    # Page 7: Teacher Guide Part 1
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_tg_nav(num, skill, 1, "MEDIATION STANDARDS & PROJECT 1")}
      <div class="content-area">
        <div class="tg-box">
          <div class="tg-title">🎯 Curricular Standards & Learning Outcomes (MEDUCA Grade 4)</div>
          <div style="font-size: 8pt; color: #334155; line-height: 1.3;">
            <strong>General Standard:</strong> Can facilitate the communication process for peers, such as turn-taking.<br>
            <strong>Specific Outcome:</strong> Can interpret simple school notices using gestures to indicate main ideas and help facilitate a discussion on favorite places in the neighborhood by asking simple questions and using visual aids.<br>
            <strong>CEFR Band:</strong> A1.2 &bull; <strong>21st Century Project 1:</strong> Favorite Place Poster & Tour.
          </div>
        </div>

        <div class="tg-box">
          <div class="tg-title">🤝 Mediation Pedagogy (CEFR Companion Volume Aligned)</div>
          <div style="font-size: 8pt; color: #334155; line-height: 1.35;">
            <strong>Mediating a Text:</strong> Students break down dense, formal notices into bite-sized, actionable English messages for their peers.<br>
            <strong>Mediating Concepts & Communication:</strong> Students practice peer scaffolding techniques (pointing to visual realia, asking clarifying questions, facilitating turn-taking for quieter classmates).<br>
            <strong>Project 1 Integration:</strong> The Favorite Place Campaign Poster channels civic engagement and cooperative decision-making.
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">📘</span>
        <span><strong>Teacher Strategy:</strong> Rotate through the classroom during Stage 4 & 5 to coach turn-taking phrases.</span>
      </div>
      {build_footer(7, skill)}
    </div>
    """)

    # Page 8: Teacher Guide Part 2
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_tg_nav(num, skill, 2, "ANSWER KEY & MEDIATION RUBRIC")}
      <div class="content-area">
        <div class="tg-box">
          <div class="tg-title">✅ Complete Answer Key & Diagnostic Matrix</div>
          <table class="styled-table" style="font-size: 7.5pt;">
            <tr>
              <th style="width: 15%;">Stage</th>
              <th style="width: 45%;">Expected Answers</th>
              <th style="width: 40%;">Diagnostic Remediations</th>
            </tr>
            <tr>
              <td><strong>Stage 1</strong></td>
              <td>Explanation A: Sign 3 (Crosswalk); Explanation B: Sign 2 (Hours); Explanation C: Sign 1 (Clean Park).</td>
              <td>Emphasize visual sign symbols and real-life safety context.</td>
            </tr>
            <tr>
              <td><strong>Stage 3</strong></td>
              <td>Situation 1: (A) "It is your turn!"; Situation 2: (A) Point to picture; Situation 3: (A) "Great choice because..."</td>
              <td>Model positive peer reinforcement and collaborative language.</td>
            </tr>
            <tr>
              <td><strong>Stage 4</strong></td>
              <td>Collaborative notes highlighting reasons with 'because' for Park, Playground, and Street.</td>
              <td>Ensure both partners contribute equally to writing and reviewing.</td>
            </tr>
            <tr>
              <td><strong>Stage 5</strong></td>
              <td>Poster completed with title, illustration, and 3 oral tour guide presentation points.</td>
              <td>Encourage students to use gestures and point to poster during tour.</td>
            </tr>
          </table>
        </div>

        <div class="tg-box">
          <div class="tg-title">📊 MEDUCA 4-Level Evaluation Rubric (Mediation & 21st Century Skills)</div>
          <table class="rubric-table">
            <tr>
              <th style="width: 22%;">Criteria</th>
              <th style="width: 19%;">1 - Novice</th>
              <th style="width: 19%;">2 - Developing</th>
              <th style="width: 20%;">3 - Competent</th>
              <th style="width: 20%;">4 - Exemplary</th>
            </tr>
            <tr>
              <td><strong>Mediating Notices & Texts</strong></td>
              <td>Cannot simplify formal notice; repeats text verbatim.</td>
              <td>Simplifies message partially; requires teacher guidance.</td>
              <td>Accurately translates key notice points into simple English.</td>
              <td>Seamlessly explains nuances using verbal and non-verbal cues.</td>
            </tr>
            <tr>
              <td><strong>Peer Scaffolding & Turn-Taking</strong></td>
              <td>Dominates or disengages; ignores partner's needs.</td>
              <td>Allows partner to speak only when prompted by teacher.</td>
              <td>Actively uses turn-taking phrases and points to visuals.</td>
              <td>Empathetic leader; encourages hesitant peers naturally.</td>
            </tr>
            <tr>
              <td><strong>Project 1 Poster Design</strong></td>
              <td>Poster incomplete or missing persuasive reasons.</td>
              <td>Basic drawing with isolated words; no 'because'.</td>
              <td>Attractive poster with clear illustration and 'because' reasons.</td>
              <td>Inspiring, highly creative campaign poster with clear advocacy.</td>
            </tr>
            <tr>
              <td><strong>Oral Tour Presentation</strong></td>
              <td>Reads silently; unable to deliver tour guide points.</td>
              <td>Reads presentation points with halting pronunciation.</td>
              <td>Delivers 3 presentation points clearly using gestures.</td>
              <td>Charismatic, fluent presentation that persuades peers.</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">📝</span>
        <span><strong>MEDUCA Note:</strong> Grade 21st Century Project 1 collaboratively based on poster execution and oral presentation.</span>
      </div>
      {build_footer(8, skill)}
    </div>
    """)

    html_content = wrap_html(f"Grade 4 - Scenario 1 Theme 1 - Lesson {num}: {skill}", "\n".join(pages))
    file_path = os.path.join(PUBLIC_DIR, f"Grade_4_Scenario_1_Theme_1_Lesson_{num}_{skill}_Packet.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    return file_path
