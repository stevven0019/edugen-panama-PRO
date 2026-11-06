# -*- coding: utf-8 -*-
"""
EduGen Panama - Scenario 1 Theme 1 - Lesson 1: Listening
Grade 4 • CEFR Level: Beginner A1.2
"""

import os
from prototype_shared import (
    PUBLIC_DIR, get_asset, build_awning, build_top_nav, 
    build_tg_nav, build_footer, wrap_html
)

def generate_lesson1_listening():
    skill = "Listening"
    num = 1
    pages = []

    # Page 1: Stage 1 Warm-up (Audio Soundscape Detective)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🎧 STAGE 1: WARM-UP & ACTIVATION &bull; SOUND DETECTIVE</div>
        <div class="stage-time">5-7 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Instructions:</strong> Listen carefully as your teacher plays or imitates 3 neighborhood sound clues. Check the sound you hear and guess the favorite neighborhood place!
        </div>
        <div class="grid-3">
          <div class="card" style="text-align: center;">
            <div style="font-size: 24pt;">🔊 🧒</div>
            <div class="card-header" style="justify-content: center;">Audio Clue #1</div>
            <p style="font-size: 8.5pt; color: #475569; margin-bottom: 6px;">[ ] Children laughing and swinging</p>
            <div style="background: #F1F5F9; border-radius: 6px; padding: 4px; font-weight: 700; font-size: 8.5pt;">
              Place: ( Playground / School )
            </div>
          </div>
          <div class="card" style="text-align: center;">
            <div style="font-size: 24pt;">🔊 🐦</div>
            <div class="card-header" style="justify-content: center;">Audio Clue #2</div>
            <p style="font-size: 8.5pt; color: #475569; margin-bottom: 6px;">[ ] Birds singing in green trees</p>
            <div style="background: #F1F5F9; border-radius: 6px; padding: 4px; font-weight: 700; font-size: 8.5pt;">
              Place: ( Park / Building )
            </div>
          </div>
          <div class="card" style="text-align: center;">
            <div style="font-size: 24pt;">🔊 🚗</div>
            <div class="card-header" style="justify-content: center;">Audio Clue #3</div>
            <p style="font-size: 8.5pt; color: #475569; margin-bottom: 6px;">[ ] Car horns and bicycle bells</p>
            <div style="background: #F1F5F9; border-radius: 6px; padding: 4px; font-weight: 700; font-size: 8.5pt;">
              Place: ( Street / Store )
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">⚡ Neighborhood Prediction Challenge</div>
          <p style="font-size: 8.8pt; color: #334155;">Which place in our neighborhood do you think is the <strong>quietest</strong>? Circle one:</p>
          <div style="display: flex; gap: 12px; margin-top: 6px; justify-content: center;">
            <span style="border: 1.5px solid #2A9D8F; padding: 4px 12px; border-radius: 20px; font-weight: 800; color: #2A9D8F; background: #F0FDFA;">[ The Park ]</span>
            <span style="border: 1.5px solid #457B9D; padding: 4px 12px; border-radius: 20px; font-weight: 800; color: #457B9D; background: #F0F9FF;">[ The Street ]</span>
            <span style="border: 1.5px solid #E76F51; padding: 4px 12px; border-radius: 20px; font-weight: 800; color: #E76F51; background: #FFF5F3;">[ The Playground ]</span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">💡</span>
        <span><strong>Super Listener Tip:</strong> Close your eyes and focus on background sound patterns to identify community places!</span>
      </div>
      {build_footer(1, skill)}
    </div>
    """)

    # Page 2: Stage 2 Input (Audio Dialogue)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🗣️ STAGE 2: PRESENTATION & INPUT &bull; AUDIO DIALOGUE</div>
        <div class="stage-time">8-10 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Instructions:</strong> Listen to the dialogue between Lucas and Mia as they talk about their favorite neighborhood spots. Follow along with the text.
        </div>
        <div class="card">
          <div class="card-header">🎧 Audio Story: Lucas & Mia's Morning Walk</div>
          <div class="dialogue-container">
            <div class="bubble-row">
              <div class="bubble-avatar" style="background: #E0F2FE; color: #0369A1;">L</div>
              <div class="bubble user-a">
                <strong>Lucas:</strong> "Hi Mia! Look at our neighborhood today. What is your <strong>favorite</strong> place to visit?"
              </div>
            </div>
            <div class="bubble-row">
              <div class="bubble-avatar" style="background: #FEF3C7; color: #B45309;">M</div>
              <div class="bubble user-b">
                <strong>Mia:</strong> "My favorite place is <strong>Sunshine Park</strong>! It has green trees and colorful flowers. What about you?"
              </div>
            </div>
            <div class="bubble-row">
              <div class="bubble-avatar" style="background: #E0F2FE; color: #0369A1;">L</div>
              <div class="bubble user-a">
                <strong>Lucas:</strong> "I like <strong>Joy Playground</strong> the best <strong>because</strong> it has big swings and slides!"
              </div>
            </div>
            <div class="bubble-row">
              <div class="bubble-avatar" style="background: #FEF3C7; color: #B45309;">M</div>
              <div class="bubble user-b">
                <strong>Mia:</strong> "Look across the street! That tall <strong>building</strong> over there is the new public library."
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">👂 Quick Gist & Detail Check (Listen & Circle)</div>
          <div style="font-size: 8.5pt; color: #334155; display: flex; flex-direction: column; gap: 6px;">
            <div><strong>1. Gist:</strong> Who prefers the playground? Circle: <strong>[ Lucas / Mia ]</strong></div>
            <div><strong>2. Detail:</strong> Why does Lucas like the playground? Circle: <strong>[ (A) Because it has swings / (B) Because it is quiet ]</strong></div>
            <div><strong>3. Detail:</strong> What does Mia like to see in Sunshine Park? Circle: <strong>[ (A) Tall cars / (B) Colorful flowers ]</strong></div>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🔑</span>
        <span><strong>Discourse Marker:</strong> We use the connector <strong>'because'</strong> to explain reasons why we like a place!</span>
      </div>
      {build_footer(2, skill)}
    </div>
    """)

    # Page 3: Stage 3 Controlled Practice (Listen & Number + Phonics)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🎯 STAGE 3: CONTROLLED PRACTICE &bull; LISTEN & NUMBER</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Task A:</strong> Listen to your teacher read 4 short neighborhood descriptions. Number the pictures from <strong>1 to 4</strong> in the order you hear them! (The pictures are scrambled!).
        </div>
        <div class="grid-4">
          <div class="item-box">
            <img src="{get_asset('building.png')}" class="item-img" alt="Building">
            <div style="font-weight: 800; font-size: 8.5pt; color: #1E293B;">Tall Building</div>
            <div class="number-circle">[ &nbsp; ]</div>
          </div>
          <div class="item-box">
            <img src="{get_asset('park.png')}" class="item-img" alt="Park">
            <div style="font-weight: 800; font-size: 8.5pt; color: #1E293B;">Sunshine Park</div>
            <div class="number-circle">[ &nbsp; ]</div>
          </div>
          <div class="item-box">
            <img src="{get_asset('playground.png')}" class="item-img" alt="Playground">
            <div style="font-weight: 800; font-size: 8.5pt; color: #1E293B;">Joy Playground</div>
            <div class="number-circle">[ &nbsp; ]</div>
          </div>
          <div class="item-box">
            <img src="{get_asset('street.png')}" class="item-img" alt="Street">
            <div style="font-weight: 800; font-size: 8.5pt; color: #1E293B;">Oak Street</div>
            <div class="number-circle">[ &nbsp; ]</div>
          </div>
        </div>

        <div class="card" style="margin-top: 6px;">
          <div class="card-header">🎵 Task B: Phonemic Sound Catcher (/b/ in 'best' vs /f/ in 'favorite')</div>
          <div class="instruction-box" style="margin-bottom: 5px;">
            Listen to each spoken word. Circle words that begin with <strong>/b/</strong> using a <strong>Blue pencil</strong>, and words that begin with <strong>/f/</strong> using an <strong>Orange pencil</strong>!
          </div>
          <div class="grid-3" style="text-align: center; font-weight: 800; font-size: 10pt;">
            <div style="border: 1.5px dashed #457B9D; padding: 6px; border-radius: 8px; background: #F8FAFC;">1. Best</div>
            <div style="border: 1.5px dashed #E76F51; padding: 6px; border-radius: 8px; background: #F8FAFC;">2. Favorite</div>
            <div style="border: 1.5px dashed #457B9D; padding: 6px; border-radius: 8px; background: #F8FAFC;">3. Big</div>
            <div style="border: 1.5px dashed #E76F51; padding: 6px; border-radius: 8px; background: #F8FAFC;">4. Flower</div>
            <div style="border: 1.5px dashed #457B9D; padding: 6px; border-radius: 8px; background: #F8FAFC;">5. Building</div>
            <div style="border: 1.5px dashed #E76F51; padding: 6px; border-radius: 8px; background: #F8FAFC;">6. Fun</div>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🔍</span>
        <span><strong>Phonics Note:</strong> /b/ is a voiced bilabial stop (lips together). /f/ is a voiceless labiodental fricative (teeth on lip)!</span>
      </div>
      {build_footer(3, skill)}
    </div>
    """)

    # Page 4: Stage 4 Guided Practice (Map Detective)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🗺️ STAGE 4: GUIDED PRACTICE &bull; AUDITORY MAP DETECTIVE</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Instructions:</strong> Look at the neighborhood grid map below. Listen to your teacher give 4 audio navigation instructions. Follow each instruction and draw the symbol in the correct location!
        </div>
        <div class="card" style="position: relative; height: 260px; background: #F0FDF4; border: 2px solid #86EFAC; border-radius: 12px; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 8px; padding: 8px;">
          <div style="border: 1.5px dashed #22C55E; border-radius: 8px; background: #FFF; padding: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <img src="{get_asset('park.png')}" style="width: 48px; height: 48px; object-fit: contain;">
            <span style="font-weight: 800; font-size: 8pt; color: #166534;">ZONE A: Sunshine Park</span>
            <span style="font-size: 7pt; color: #64748B;">[ Draw ☀️ Sun Here ]</span>
          </div>
          <div style="border: 1.5px dashed #0EA5E9; border-radius: 8px; background: #FFF; padding: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <img src="{get_asset('building.png')}" style="width: 48px; height: 48px; object-fit: contain;">
            <span style="font-weight: 800; font-size: 8pt; color: #075985;">ZONE B: Tall Library</span>
            <span style="font-size: 7pt; color: #64748B;">[ Draw 🌸 Flower Here ]</span>
          </div>
          <div style="border: 1.5px dashed #F59E0B; border-radius: 8px; background: #FFF; padding: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <img src="{get_asset('playground.png')}" style="width: 48px; height: 48px; object-fit: contain;">
            <span style="font-weight: 800; font-size: 8pt; color: #9A3412;">ZONE C: Joy Playground</span>
            <span style="font-size: 7pt; color: #64748B;">[ Circle Swings with ⭐ ]</span>
          </div>
          <div style="border: 1.5px dashed #64748B; border-radius: 8px; background: #FFF; padding: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <img src="{get_asset('street.png')}" style="width: 48px; height: 48px; object-fit: contain;">
            <span style="font-weight: 800; font-size: 8pt; color: #334155;">ZONE D: Oak Street</span>
            <span style="font-size: 7pt; color: #64748B;">[ Put 'X' ❌ on Road ]</span>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">📋 Auditory Navigation Checklist</div>
          <div style="font-size: 8pt; color: #334155; line-height: 1.35;">
            <div>&bull; <strong>Cue 1:</strong> Did you hear the weather clue for Sunshine Park? [ Yes / No ]</div>
            <div>&bull; <strong>Cue 2:</strong> Did you find where cars drive on Oak Street? [ Yes / No ]</div>
            <div>&bull; <strong>Cue 3:</strong> Did you locate the swings inside Joy Playground? [ Yes / No ]</div>
            <div>&bull; <strong>Cue 4:</strong> Did you place a flower next to the tall library building? [ Yes / No ]</div>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🗺️</span>
        <span><strong>Spatial Listening:</strong> Connecting spoken directions to map zones helps build mental spatial orientation in English!</span>
      </div>
      {build_footer(4, skill)}
    </div>
    """)

    # Page 5: Stage 5 Free Production (Secret Place Mystery)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🎲 STAGE 5: FREE PRODUCTION &bull; SECRET PLACE MYSTERY</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Partner Info-Gap:</strong> Work in pairs. Student A chooses a secret favorite place from the cards and reads 2 spoken clues. Student B listens, checks the clues heard, and circles the secret destination! Then swap roles.
        </div>
        
        <div class="grid-2">
          <div class="card">
            <div class="card-header" style="color: #2A9D8F;">🗣️ Speaker Card (Student A)</div>
            <p style="font-size: 8pt; color: #64748B; margin-bottom: 4px;">Choose ONE secret place and read the 2 clues to your partner:</p>
            <div style="font-size: 8pt; background: #F0FDFA; padding: 6px; border-radius: 6px; margin-bottom: 4px;">
              <strong>Secret Option 1 (Park):</strong><br>
              "Clue 1: It is very quiet and green.<br>
              Clue 2: It has beautiful colorful flowers."
            </div>
            <div style="font-size: 8pt; background: #FFFBEB; padding: 6px; border-radius: 6px;">
              <strong>Secret Option 2 (Playground):</strong><br>
              "Clue 1: It is very fun and exciting.<br>
              Clue 2: It has big swings and slides."
            </div>
          </div>

          <div class="card">
            <div class="card-header" style="color: #E76F51;">👂 Listener Card (Student B)</div>
            <p style="font-size: 8pt; color: #64748B; margin-bottom: 4px;">Listen without looking at your partner's card. Check clues heard:</p>
            <div style="font-size: 8pt; line-height: 1.4; margin-bottom: 6px;">
              <div>[ ] "quiet and green"</div>
              <div>[ ] "colorful flowers"</div>
              <div>[ ] "fun and exciting"</div>
              <div>[ ] "big swings and slides"</div>
            </div>
            <div style="background: #F8FAFC; border: 1.5px solid #CBD5E1; border-radius: 6px; padding: 5px; text-align: center;">
              <strong>My Partner's Secret Place Is:</strong><br>
              <span style="font-weight: 800; font-size: 9pt; color: #2A9D8F;">[ Sunshine Park / Joy Playground ]</span>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">🤝 Active Listening Rating</div>
          <div style="display: flex; justify-content: space-around; font-size: 8.5pt; font-weight: 700; color: #334155;">
            <span>[ ] My partner spoke clearly</span>
            <span>[ ] I listened without interrupting</span>
            <span>[ ] I guessed correctly!</span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">⭐</span>
        <span><strong>Cooperative Goal:</strong> Good listeners pay attention to keywords like 'green', 'swings', and 'quiet' to solve auditory mysteries!</span>
      </div>
      {build_footer(5, skill)}
    </div>
    """)

    # Page 6: Stage 6 Wrap-up (Exit Ticket)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🚀 STAGE 6: WRAP-UP & EXIT TICKET &bull; SELF-ASSESSMENT</div>
        <div class="stage-time">5 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Final Check:</strong> Complete the 3 quick listening checks below to earn your Neighborhood Listening Detective Badge!
        </div>
        <div class="card">
          <div class="card-header">📝 3-Minute Listening Exit Ticket</div>
          <div style="font-size: 8.5pt; line-height: 1.45; color: #1E293B;">
            <p><strong>1. Topic Check:</strong> What was the main topic of today's listening lesson?</p>
            <div style="margin-left: 10px; margin-bottom: 6px;">
              [ ] (A) Wild animals in the jungle<br>
              [ ] (B) Favorite places in our neighborhood<br>
              [ ] (C) Cooking breakfast at home
            </div>

            <p><strong>2. Connector Check:</strong> Complete the sentence: "I like the park ______ it is quiet."</p>
            <div style="margin-left: 10px; margin-bottom: 6px;">
              [ ] (A) because &nbsp;&nbsp;&nbsp;&nbsp; [ ] (B) but &nbsp;&nbsp;&nbsp;&nbsp; [ ] (C) or
            </div>

            <p><strong>3. Phonics Sound Check:</strong> Which word begins with the <strong>/f/</strong> sound like 'favorite'?</p>
            <div style="margin-left: 10px;">
              [ ] (A) Building &nbsp;&nbsp;&nbsp;&nbsp; [ ] (B) Best &nbsp;&nbsp;&nbsp;&nbsp; [ ] (C) Flower
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">🌟 My Listening Superpowers (Self-Assessment)</div>
          <div style="font-size: 8.2pt; line-height: 1.4; color: #475569;">
            <div>⭐⭐⭐ &nbsp; <strong>I can identify main points</strong> when listening to people talk about favorite places.</div>
            <div>⭐⭐⭐ &nbsp; <strong>I can hear the difference</strong> between /b/ (best) and /f/ (favorite) sounds.</div>
            <div>⭐⭐⭐ &nbsp; <strong>I can follow spoken directions</strong> to find locations on a neighborhood map.</div>
          </div>
          <div style="margin-top: 8px; text-align: center;">
            <span style="background: #FEF3C7; border: 1.5px solid #F59E0B; padding: 4px 14px; border-radius: 20px; font-weight: 800; font-size: 9pt; color: #B45309;">
              🏆 Awarded: Certified Neighborhood Sound Detective!
            </span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🎉</span>
        <span><strong>Congratulations!</strong> You completed Lesson 1: Listening with high auditory focus and precision!</span>
      </div>
      {build_footer(6, skill)}
    </div>
    """)

    # Page 7: Teacher Guide Part 1
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_tg_nav(num, skill, 1, "LESSON OVERVIEW & VERBATIM SCRIPTS")}
      <div class="content-area">
        <div class="tg-box">
          <div class="tg-title">🎯 Curricular Standards & Learning Outcomes (MEDUCA Grade 4)</div>
          <div style="font-size: 8pt; color: #334155; line-height: 1.3;">
            <strong>General Standard:</strong> Can get the gist and main points of simple conversations when spoken slowly and clearly.<br>
            <strong>Specific Outcome:</strong> Can listen and identify main points in talks about favorite places in the neighborhood (e.g., 'The park has swings.').<br>
            <strong>CEFR Band:</strong> A1.2 (Beginner) &bull; <strong>Time Allocation:</strong> 45-60 min &bull; <strong>Target Sounds:</strong> /b/ and /f/.
          </div>
        </div>

        <div class="tg-box">
          <div class="tg-title">🗣️ Teacher Verbatim Spoken Scripts (Deliver slowly with expressive pauses)</div>
          
          <div style="font-weight: 800; font-size: 8pt; color: #0F766E;">Stage 1: Warm-up Sound Clues</div>
          <div class="tg-script">
            "Class, listen carefully! Sound 1: (Make sound of laughing children: 'Wee! Push me on the swing!') Which place is that? Sound 2: (Make birds chirping: 'Chirp chirp, look at the green leaves!'). Sound 3: (Make car horn: 'Beep beep! Watch out for the bicycle!'). Now check your boxes!"
          </div>

          <div style="font-weight: 800; font-size: 8pt; color: #0F766E; margin-top: 4px;">Stage 2: Dialogue Reading Script</div>
          <div class="tg-script">
            "Read Lucas with a lively, energetic voice, and Mia with a calm, friendly tone. Emphasize the word 'BECAUSE' and the superlatives 'BEST' and 'FAVORITE'."
          </div>

          <div style="font-weight: 800; font-size: 8pt; color: #0F766E; margin-top: 4px;">Stage 3: Controlled Practice Spoken Prompts (Scrambled Order)</div>
          <div class="tg-script">
            <strong>Prompt #1:</strong> "This place is very fun and exciting. It has swings and slides for children! (Joy Playground)"<br>
            <strong>Prompt #2:</strong> "This place is very tall. It has glass windows and ten floors! (Tall Building)"<br>
            <strong>Prompt #3:</strong> "This is where cars and buses drive carefully. It has crosswalks! (Oak Street)"<br>
            <strong>Prompt #4:</strong> "This place is quiet and green. People walk and look at flowers! (Sunshine Park)"
          </div>

          <div style="font-weight: 800; font-size: 8pt; color: #0F766E; margin-top: 4px;">Stage 4: Guided Map Navigation Prompts</div>
          <div class="tg-script">
            "Audio Cue 1: Draw a smiling sun over Sunshine Park because it is bright and green.<br>
            Audio Cue 2: Put an 'X' on Oak Street where the cars drive.<br>
            Audio Cue 3: Color the swings inside Joy Playground yellow.<br>
            Audio Cue 4: Draw a colorful flower next to the tall library building."
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">📖</span>
        <span><strong>Teacher Note:</strong> Repeat each prompt twice at natural A1.2 conversational speed, then pause for student processing.</span>
      </div>
      {build_footer(7, skill)}
    </div>
    """)

    # Page 8: Teacher Guide Part 2
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_tg_nav(num, skill, 2, "ANSWER KEY & MEDUCA RUBRIC")}
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
              <td>Clue 1: Playground; Clue 2: Park; Clue 3: Street. Quietest: The Park.</td>
              <td>If student confuses park and playground, replay bird sounds vs child laughter.</td>
            </tr>
            <tr>
              <td><strong>Stage 2</strong></td>
              <td>1. Lucas; 2. (A) Because it has swings; 3. (B) Colorful flowers.</td>
              <td>Clarify that Lucas expresses excitement for swings; Mia likes flowers.</td>
            </tr>
            <tr>
              <td><strong>Stage 3</strong></td>
              <td>Task A: Tall Building = 2; Sunshine Park = 4; Joy Playground = 1; Oak Street = 3.<br>
                  Task B: /b/ = Best, Big, Building; /f/ = Favorite, Flower, Fun.</td>
              <td>Model lip placement: /b/ brings lips together, /f/ places upper teeth on lower lip.</td>
            </tr>
            <tr>
              <td><strong>Stage 4</strong></td>
              <td>Zone A: Sun ☀️; Zone B: Flower 🌸; Zone C: Yellow Swings ⭐; Zone D: 'X' ❌.</td>
              <td>Check student orientation on map grid; assist with quadrant identification.</td>
            </tr>
            <tr>
              <td><strong>Stage 6</strong></td>
              <td>1. (B) Favorite places in neighborhood; 2. (A) because; 3. (C) Flower.</td>
              <td>If Exit Ticket score is < 2/3, conduct a 2-minute choral review of key vocabulary.</td>
            </tr>
          </table>
        </div>

        <div class="tg-box">
          <div class="tg-title">📊 MEDUCA 4-Level Evaluation Rubric (Listening Comprehension)</div>
          <table class="rubric-table">
            <tr>
              <th style="width: 22%;">Criteria</th>
              <th style="width: 19%;">1 - Novice</th>
              <th style="width: 19%;">2 - Developing</th>
              <th style="width: 20%;">3 - Competent</th>
              <th style="width: 20%;">4 - Exemplary</th>
            </tr>
            <tr>
              <td><strong>Auditory Gist & Detail</strong></td>
              <td>Requires multiple repetitions; misses main points.</td>
              <td>Identifies general topic but confuses specific details.</td>
              <td>Accurately identifies main places and reasons with 'because'.</td>
              <td>Effortlessly extracts gist and subtle details on first listen.</td>
            </tr>
            <tr>
              <td><strong>Phonemic Discrimination</strong></td>
              <td>Confuses /b/ and /f/ sounds consistently.</td>
              <td>Identifies sounds in isolated words with visual prompts.</td>
              <td>Distinguishes /b/ and /f/ reliably in spoken tasks.</td>
              <td>Perfect sound discrimination and spontaneous self-correction.</td>
            </tr>
            <tr>
              <td><strong>Spatial Audio Navigation</strong></td>
              <td>Unable to transfer spoken cues to map symbols.</td>
              <td>Places 1-2 symbols with substantial teacher scaffolding.</td>
              <td>Correctly places 3-4 symbols following spoken directions.</td>
              <td>Rapid, autonomous execution of all spatial navigation cues.</td>
            </tr>
            <tr>
              <td><strong>Task Completion & Cooperation</strong></td>
              <td>Minimal engagement in partner info-gap activity.</td>
              <td>Participates with hesitation; requires peer prompting.</td>
              <td>Completes listening tasks and cooperates actively with partner.</td>
              <td>Exemplary active listening, supportive partner interaction.</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">📝</span>
        <span><strong>MEDUCA Note:</strong> Record formative scores based on Stage 3, Stage 4, and Stage 6 Exit Ticket performance.</span>
      </div>
      {build_footer(8, skill)}
    </div>
    """)

    html_content = wrap_html(f"Grade 4 - Scenario 1 Theme 1 - Lesson {num}: {skill}", "\n".join(pages))
    file_path = os.path.join(PUBLIC_DIR, f"Grade_4_Scenario_1_Theme_1_Lesson_{num}_{skill}_Packet.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    return file_path
