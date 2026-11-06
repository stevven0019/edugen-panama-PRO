# -*- coding: utf-8 -*-
"""
EduGen Panama - Scenario 1 Theme 1 - Lesson 3: Speaking
Grade 4 • CEFR Level: Beginner A1.2
"""

import os
from prototype_shared import (
    PUBLIC_DIR, get_asset, build_awning, build_top_nav, 
    build_tg_nav, build_footer, wrap_html
)

def generate_lesson3_speaking():
    skill = "Speaking"
    num = 3
    pages = []

    # Page 1: Stage 1 Warm-up (Phonemic Chant)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🗣️ STAGE 1: WARM-UP & ACTIVATION &bull; PHONEMIC CHANT</div>
        <div class="stage-time">5-7 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Rhythm Chant:</strong> Clap your hands to the beat and chant with your teacher! Practice the <strong>/b/</strong> in <em>best</em> and the <strong>/f/</strong> in <em>favorite</em>!
        </div>

        <div class="card" style="text-align: center; background: #FFFBEB; border: 2px solid #F59E0B;">
          <div style="font-family: 'Fredoka One', cursive; font-size: 13pt; color: #B45309; margin-bottom: 6px;">
            👏 The /b/ and /f/ Neighborhood Beat 👏
          </div>
          <div style="font-size: 9pt; line-height: 1.5; color: #1E293B;">
            <strong>B - B - Best!</strong> Sunshine Park is <strong>the best!</strong> (Clap! Clap!)<br>
            <strong>F - F - Favorite!</strong> It's my <strong>favorite</strong> place! (Clap! Clap!)<br>
            <strong>Big</strong> green trees, <strong>Fun</strong> in the breeze!<br>
            What is your favorite place? Show me your happy face! (Cheer!)
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">👥 Pair Sound Challenge</div>
          <p style="font-size: 8.5pt; color: #334155; margin-bottom: 5px;">
            Partner A says a /b/ word (<em>best, building, big</em>). Partner B responds with an /f/ word (<em>favorite, flower, fun</em>).
          </p>
          <div style="display: flex; justify-content: space-around; font-weight: 800; font-size: 9pt;">
            <span style="color: #2A9D8F;">Partner A: "Big building!"</span>
            <span style="color: #E76F51;">Partner B: "Favorite flower!"</span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🎵</span>
        <span><strong>Pronunciation Key:</strong> Feel the pop of air on your lips for /b/, and the soft stream of air for /f/!</span>
      </div>
      {build_footer(1, skill)}
    </div>
    """)

    # Page 2: Stage 2 Input (Conversation Bridge)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">💬 STAGE 2: PRESENTATION & INPUT &bull; CONVERSATION MODEL</div>
        <div class="stage-time">8-10 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Speech Model:</strong> Read the conversation between Diego and Sofia aloud with your partner. Notice how they state opinions and give reasons using <em>because</em>.
        </div>

        <div class="card">
          <div class="dialogue-container">
            <div class="bubble-row">
              <div class="bubble-avatar" style="background: #E0F2FE; color: #0369A1;">D</div>
              <div class="bubble user-a">
                <strong>Diego:</strong> "Hello Sofia! What is your <strong>favorite</strong> place in our neighborhood?"
              </div>
            </div>
            <div class="bubble-row">
              <div class="bubble-avatar" style="background: #FEF3C7; color: #B45309;">S</div>
              <div class="bubble user-b">
                <strong>Sofia:</strong> "My favorite place is <strong>Sunshine Park</strong> because it is <strong>beautiful</strong>! What about you?"
              </div>
            </div>
            <div class="bubble-row">
              <div class="bubble-avatar" style="background: #E0F2FE; color: #0369A1;">D</div>
              <div class="bubble user-a">
                <strong>Diego:</strong> "I like <strong>Joy Playground</strong>! It is <strong>the best</strong> place because it is <strong>exciting</strong>."
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px; background: #F0FDFA; border: 2px solid #2A9D8F;">
          <div class="card-header" style="color: #0F766E;">🎯 Sentence Anchor Frame</div>
          <div style="font-family: 'Fredoka One', cursive; font-size: 11pt; color: #115E59; text-align: center; padding: 4px 0;">
            "My favorite place is [ PLACE ] because it is [ ADJECTIVE ]."
          </div>
          <div style="font-size: 8pt; color: #475569; text-align: center;">
            Places: <em>park, playground, street, library</em> &bull; Adjectives: <em>fun, big, quiet, safe, exciting</em>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🔑</span>
        <span><strong>Fluency Tip:</strong> Maintain eye contact and use a cheerful, expressive voice when sharing opinions!</span>
      </div>
      {build_footer(2, skill)}
    </div>
    """)

    # Page 3: Stage 3 Controlled Practice (Substitution Wheel)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🔄 STAGE 3: CONTROLLED PRACTICE &bull; SUBSTITUTION WHEEL</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Instructions:</strong> Pick 1 word from each column to build a sentence. Speak the complete sentence aloud to your partner. Have your partner sign their initial in the box!
        </div>

        <div class="grid-3">
          <div class="card" style="text-align: center;">
            <div class="card-header" style="justify-content: center; color: #2A9D8F;">1. Place</div>
            <div style="font-size: 8.5pt; line-height: 1.6; font-weight: 700;">
              <div>&bull; The park</div>
              <div>&bull; The playground</div>
              <div>&bull; Oak Street</div>
              <div>&bull; The library</div>
            </div>
          </div>

          <div class="card" style="text-align: center;">
            <div class="card-header" style="justify-content: center; color: #457B9D;">2. Opinion</div>
            <div style="font-size: 8.5pt; line-height: 1.6; font-weight: 700;">
              <div>&bull; is my favorite</div>
              <div>&bull; is the best</div>
              <div>&bull; is wonderful</div>
              <div>&bull; is fantastic</div>
            </div>
          </div>

          <div class="card" style="text-align: center;">
            <div class="card-header" style="justify-content: center; color: #E76F51;">3. Reason</div>
            <div style="font-size: 8.5pt; line-height: 1.6; font-weight: 700;">
              <div>&bull; because it is fun.</div>
              <div>&bull; because it has swings.</div>
              <div>&bull; because it is quiet.</div>
              <div>&bull; because it has trees.</div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">✍️ Partner Fluency Check</div>
          <div style="display: flex; justify-content: space-between; font-size: 8.5pt; font-weight: 700;">
            <span>Sentence 1 Spoken: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</span>
            <span>Sentence 2 Spoken: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</span>
            <span>Partner Initial: [ &nbsp;&nbsp;&nbsp;&nbsp; ]</span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">👏</span>
        <span><strong>Oral Accuracy:</strong> Ensure the verb <em>is</em> links the subject to your opinion before using <em>because</em>!</span>
      </div>
      {build_footer(3, skill)}
    </div>
    """)

    # Page 4: Stage 4 Guided Practice (Board Game)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🎲 STAGE 4: GUIDED PRACTICE &bull; NEIGHBORHOOD BOARD GAME</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Board Game Rules:</strong> Use an eraser as your token. Flip a coin: <strong>Heads = Move 1 space</strong>, <strong>Tails = Move 2 spaces</strong>. Land on a square and speak the challenge to your partner!
        </div>

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; flex: 1;">
          <div class="item-box" style="background: #FEF3C7; border: 2px solid #F59E0B;">
            <span style="font-weight: 900; font-size: 10pt; color: #B45309;">1. START 🚀</span>
            <span style="font-size: 7.2pt;">Say: "Hello neighborhood!"</span>
          </div>
          <div class="item-box">
            <span style="font-weight: 800; font-size: 8pt; color: #2A9D8F;">2. Park 🌳</span>
            <span style="font-size: 7pt;">Say 1 thing in a park!</span>
          </div>
          <div class="item-box">
            <span style="font-weight: 800; font-size: 8pt; color: #457B9D;">3. /b/ Sound 🐝</span>
            <span style="font-size: 7pt;">Say: <em>best, big, building!</em></span>
          </div>
          <div class="item-box">
            <span style="font-weight: 800; font-size: 8pt; color: #E76F51;">4. Question ❓</span>
            <span style="font-size: 7pt;">Ask: "What is your favorite?"</span>
          </div>
          <div class="item-box">
            <span style="font-weight: 800; font-size: 8pt; color: #E76F51;">8. Street 🚗</span>
            <span style="font-size: 7pt;">Describe Oak Street!</span>
          </div>
          <div class="item-box" style="grid-column: span 2; background: #F0FDF4; border: 1.5px dashed #22C55E;">
            <span style="font-weight: 900; font-size: 9pt; color: #166534;">🌟 CHANCE SQUARES 🌟</span>
            <span style="font-size: 7.2pt;">High five your partner and say: "You speak great English!"</span>
          </div>
          <div class="item-box">
            <span style="font-weight: 800; font-size: 8pt; color: #2A9D8F;">5. Playground 🛝</span>
            <span style="font-size: 7pt;">Say: "The playground is fun because..."</span>
          </div>
          <div class="item-box">
            <span style="font-weight: 800; font-size: 8pt; color: #457B9D;">7. /f/ Sound 🌸</span>
            <span style="font-size: 7pt;">Say: <em>favorite, flower, fun!</em></span>
          </div>
          <div class="item-box">
            <span style="font-weight: 800; font-size: 8pt; color: #2A9D8F;">6. Superlative 🏆</span>
            <span style="font-size: 7pt;">Say: "This is the best!"</span>
          </div>
          <div class="item-box">
            <span style="font-weight: 800; font-size: 8pt; color: #E76F51;">10. Opinion 💡</span>
            <span style="font-size: 7pt;">Use 'because' in a sentence!</span>
          </div>
          <div class="item-box" style="background: #DCFCE7; border: 2px solid #16A34A;">
            <span style="font-weight: 900; font-size: 10pt; color: #15803D;">11. FINISH 🏁</span>
            <span style="font-size: 7.2pt;">Winner! You are a fluent speaker!</span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🎲</span>
        <span><strong>Interactive Rule:</strong> If you cannot answer in 5 seconds, ask your partner for a clue!</span>
      </div>
      {build_footer(4, skill)}
    </div>
    """)

    # Page 5: Stage 5 Free Production (Classroom Survey)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🎤 STAGE 5: FREE PRODUCTION &bull; NEIGHBORHOOD REPORTER</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Classroom Reporter:</strong> Stand up with your clipboard or worksheet. Interview <strong>3 classmates</strong>. Ask: <em>"What is your favorite place in the neighborhood and why?"</em> Record their answers below!
        </div>

        <div class="card">
          <table class="styled-table">
            <tr>
              <th style="width: 25%;">Classmate Name</th>
              <th style="width: 35%;">Favorite Place</th>
              <th style="width: 40%;">Reason (using 'because')</th>
            </tr>
            <tr>
              <td>1. <span class="line" style="width: 80px;"></span></td>
              <td>[ ] Park &nbsp; [ ] Playground &nbsp; [ ] Other</td>
              <td>"because ________________________"</td>
            </tr>
            <tr>
              <td>2. <span class="line" style="width: 80px;"></span></td>
              <td>[ ] Park &nbsp; [ ] Playground &nbsp; [ ] Other</td>
              <td>"because ________________________"</td>
            </tr>
            <tr>
              <td>3. <span class="line" style="width: 80px;"></span></td>
              <td>[ ] Park &nbsp; [ ] Playground &nbsp; [ ] Other</td>
              <td>"because ________________________"</td>
            </tr>
          </table>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">📊 Reporter Summary</div>
          <p style="font-size: 8.5pt; color: #334155;">
            Based on my interviews, the <strong>most popular place</strong> in our class is: ________________________.
          </p>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🎤</span>
        <span><strong>Communication Skill:</strong> Listen attentively, write down the notes, and thank your classmate after each interview!</span>
      </div>
      {build_footer(5, skill)}
    </div>
    """)

    # Page 6: Stage 6 Wrap-up (Two Stars & a Wish)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">⭐ STAGE 6: WRAP-UP & EXIT TICKET &bull; TWO STARS & A WISH</div>
        <div class="stage-time">5 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Oral Reflection:</strong> Review your speaking performance with your partner today. Complete your Two Stars and a Wish badge!
        </div>

        <div class="card" style="background: #FFFDF5; border: 2px solid #F59E0B;">
          <div class="card-header" style="color: #B45309;">🌟 Two Stars (Two Things I Did Well Today)</div>
          <div style="font-size: 8.5pt; line-height: 1.5; color: #1E293B;">
            [ ] ⭐ Star 1: I pronounced the /b/ and /f/ sounds clearly.<br>
            [ ] ⭐ Star 2: I used the word <em>because</em> to explain my reason.<br>
            [ ] ⭐ Star 3: I asked my classmates: <em>"What is your favorite place?"</em>
          </div>

          <div class="card-header" style="color: #457B9D; margin-top: 8px;">💫 A Wish (One Thing I Want to Practice More)</div>
          <div style="font-size: 8.5pt; color: #1E293B;">
            [ ] I wish to speak with more confidence and louder volume.<br>
            [ ] I wish to learn more adjectives to describe my neighborhood.
          </div>
        </div>

        <div class="card" style="margin-top: 4px; text-align: center;">
          <div style="font-weight: 800; font-size: 9pt; color: #0F766E;">Partner Signature & Feedback</div>
          <p style="font-size: 8pt; color: #475569; margin: 3px 0;">"My partner spoke clearly and was a great teammate!"</p>
          <div style="margin-top: 4px;">
            Partner Signature: <span class="line" style="width: 140px;"></span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🎉</span>
        <span><strong>Congratulations!</strong> You completed Lesson 3: Speaking with fantastic fluency and interaction!</span>
      </div>
      {build_footer(6, skill)}
    </div>
    """)

    # Page 7: Teacher Guide Part 1
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_tg_nav(num, skill, 1, "ORAL STANDARDS & COACHING GUIDE")}
      <div class="content-area">
        <div class="tg-box">
          <div class="tg-title">🎯 Curricular Standards & Learning Outcomes (MEDUCA Grade 4)</div>
          <div style="font-size: 8pt; color: #334155; line-height: 1.3;">
            <strong>General Standard:</strong> Can describe basic events, personal experiences, feelings and opinions.<br>
            <strong>Specific Outcome:</strong> Can engage in simple exchanges about personal interests and listen to peers' preferences (e.g., 'I like the park because it is fun. What do you like?').<br>
            <strong>CEFR Band:</strong> A1.2 &bull; <strong>Phonology:</strong> /b/ (voiced stop) vs /f/ (voiceless fricative) &bull; <strong>Discourse:</strong> 'because'.
          </div>
        </div>

        <div class="tg-box">
          <div class="tg-title">🗣️ Pronunciation Coaching & Error Correction Routines</div>
          <div style="font-size: 8pt; color: #334155; line-height: 1.35;">
            <strong>Choral Chant Warm-Up:</strong> Establish a steady 4-count rhythm (Clap-Clap-Snap-Pause). Emphasize mouth shape for /b/ (lips together, vocal cords vibrate) and /f/ (upper teeth touching lower lip).<br>
            <strong>Delayed Error Correction:</strong> During Stage 4 (Board Game) and Stage 5 (Survey), do not interrupt student communication. Note common syntax omissions (e.g., omitting 'is' or 'because') on the board for a 2-minute wrap-up plenary review.
          </div>
        </div>

        <div class="tg-box">
          <div class="tg-title">📋 Teacher Classroom Management & Prompting Script</div>
          <div class="tg-script">
            "To launch Stage 5: 'Class, grab your papers! You are now official Oakwood TV News Reporters. When I say GO, stand up and interview 3 classmates. Remember the magic question: What is your favorite place and why? Ready, set, report!'"
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">💡</span>
        <span><strong>Pedagogical Goal:</strong> Maximize Student Talking Time (STT) to exceed 70% of the lesson period.</span>
      </div>
      {build_footer(7, skill)}
    </div>
    """)

    # Page 8: Teacher Guide Part 2
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_tg_nav(num, skill, 2, "ANSWER KEY & ORAL RUBRIC")}
      <div class="content-area">
        <div class="tg-box">
          <div class="tg-title">✅ Complete Answer Key & Diagnostic Matrix</div>
          <table class="styled-table" style="font-size: 7.5pt;">
            <tr>
              <th style="width: 15%;">Stage</th>
              <th style="width: 45%;">Expected Oral Output</th>
              <th style="width: 40%;">Diagnostic Remediations</th>
            </tr>
            <tr>
              <td><strong>Stage 1</strong></td>
              <td>Choral /b/ words: best, big, building. /f/ words: favorite, flower, fun.</td>
              <td>Use tactile feedback (hand on throat to feel voice vibration for /b/).</td>
            </tr>
            <tr>
              <td><strong>Stage 2</strong></td>
              <td>Accurate dialogue reading with expressive intonation.</td>
              <td>Demonstrate rising intonation for questions: "What is your favorite place?"</td>
            </tr>
            <tr>
              <td><strong>Stage 3</strong></td>
              <td>Full sentences: "The park is my favorite because it has trees."</td>
              <td>If student says "Park favorite", model: "The park IS my favorite."</td>
            </tr>
            <tr>
              <td><strong>Stage 4</strong></td>
              <td>Spontaneous spoken responses on game squares within 5 seconds.</td>
              <td>Pair hesitant students with supportive, confident speaking buddies.</td>
            </tr>
            <tr>
              <td><strong>Stage 5</strong></td>
              <td>3 completed classmate interviews using question & 'because' reason.</td>
              <td>Ensure students write down notes in English rather than Spanish.</td>
            </tr>
          </table>
        </div>

        <div class="tg-box">
          <div class="tg-title">📊 MEDUCA 4-Level Evaluation Rubric (Spoken Interaction & Fluency)</div>
          <table class="rubric-table">
            <tr>
              <th style="width: 22%;">Criteria</th>
              <th style="width: 19%;">1 - Novice</th>
              <th style="width: 19%;">2 - Developing</th>
              <th style="width: 20%;">3 - Competent</th>
              <th style="width: 20%;">4 - Exemplary</th>
            </tr>
            <tr>
              <td><strong>Pronunciation & Phonology</strong></td>
              <td>L1 interference makes /b/ and /f/ unintelligible.</td>
              <td>Frequent pronunciation errors; needs teacher correction.</td>
              <td>Clear pronunciation of /b/ and /f/ in target vocabulary.</td>
              <td>Flawless phonemic distinction, natural rhythm and melody.</td>
            </tr>
            <tr>
              <td><strong>Grammatical Range</strong></td>
              <td>Uses isolated nouns only ("park", "fun").</td>
              <td>Forms simple sentences with omissions ("Park fun").</td>
              <td>Produces complete target frame: [Place] is [best] because...</td>
              <td>Incorporates multiple adjectives and fluid connectors.</td>
            </tr>
            <tr>
              <td><strong>Fluency & Turn-Taking</strong></td>
              <td>Long pauses (>5s); struggles to initiate or respond.</td>
              <td>Speaks with hesitation; relies on reading worksheet.</td>
              <td>Speaks at natural A1.2 pace; takes turns cooperatively.</td>
              <td>Spontaneous, confident interaction without reliance on script.</td>
            </tr>
            <tr>
              <td><strong>Task Engagement</strong></td>
              <td>Does not complete interview survey.</td>
              <td>Completes 1 interview with constant teacher prompting.</td>
              <td>Successfully interviews 3 peers and records valid reasons.</td>
              <td>Takes initiative, helps peers, and summarizes survey trends.</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">📝</span>
        <span><strong>MEDUCA Note:</strong> Assess speaking formatively during Stage 4 (Board Game) and Stage 5 (Survey).</span>
      </div>
      {build_footer(8, skill)}
    </div>
    """)

    html_content = wrap_html(f"Grade 4 - Scenario 1 Theme 1 - Lesson {num}: {skill}", "\n".join(pages))
    file_path = os.path.join(PUBLIC_DIR, f"Grade_4_Scenario_1_Theme_1_Lesson_{num}_{skill}_Packet.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    return file_path
