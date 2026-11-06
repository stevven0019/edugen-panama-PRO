# -*- coding: utf-8 -*-
"""
EduGen Panama - Scenario 1 Theme 1 - Lesson 2: Reading
Grade 4 • CEFR Level: Beginner A1.2
"""

import os
from prototype_shared import (
    PUBLIC_DIR, get_asset, build_awning, build_top_nav, 
    build_tg_nav, build_footer, wrap_html
)

def generate_lesson2_reading():
    skill = "Reading"
    num = 2
    pages = []

    # Page 1: Stage 1 Warm-up (Sign Scanning)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">📖 STAGE 1: WARM-UP & ACTIVATION &bull; SIGN SCANNING</div>
        <div class="stage-time">5-7 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Instructions:</strong> Scan the 3 community notice signs below. Match each sign to its neighborhood purpose! (Notice the signs are scrambled!).
        </div>
        <div class="grid-3">
          <div class="card" style="text-align: center; border: 2px solid #2A9D8F;">
            <div style="font-size: 26pt;">🌳 🕒</div>
            <div style="font-weight: 800; font-size: 9pt; color: #2A9D8F; margin-top: 4px;">NOTICE A</div>
            <div style="font-size: 8.5pt; font-weight: 700; color: #1E293B;">"Sunshine Park Open 6 AM - 6 PM. Enjoy flowers!"</div>
          </div>
          <div class="card" style="text-align: center; border: 2px solid #E76F51;">
            <div style="font-size: 26pt;">🛝 👟</div>
            <div style="font-weight: 800; font-size: 9pt; color: #E76F51; margin-top: 4px;">NOTICE B</div>
            <div style="font-size: 8.5pt; font-weight: 700; color: #1E293B;">"Joy Playground: Please wait your turn on swings!"</div>
          </div>
          <div class="card" style="text-align: center; border: 2px solid #457B9D;">
            <div style="font-size: 26pt;">🚸 🛑</div>
            <div style="font-weight: 800; font-size: 9pt; color: #457B9D; margin-top: 4px;">NOTICE C</div>
            <div style="font-size: 8.5pt; font-weight: 700; color: #1E293B;">"Oak Street: Look both ways before crossing!"</div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">🔍 Quick Scan Match</div>
          <p style="font-size: 8.5pt; color: #475569; margin-bottom: 6px;">Which sign tells you about <strong>safety when walking</strong>? Circle: <strong>[ Notice A / Notice B / Notice C ]</strong></p>
          <p style="font-size: 8.5pt; color: #475569;">Which sign tells you about <strong>opening hours</strong>? Circle: <strong>[ Notice A / Notice B / Notice C ]</strong></p>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">💡</span>
        <span><strong>Reading Strategy:</strong> Skimming headlines and bold words helps you find information in seconds!</span>
      </div>
      {build_footer(1, skill)}
    </div>
    """)

    # Page 2: Stage 2 Input (Authentic Guide)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">📰 STAGE 2: PRESENTATION & INPUT &bull; AUTHENTIC GUIDE</div>
        <div class="stage-time">8-10 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Instructions:</strong> Read the neighborhood guide below. Pay special attention to the superlative words (<em>the biggest, the best, the newest</em>) and reasons with <em>because</em>.
        </div>
        
        <div class="card" style="background: #FFFDF5; border: 2px solid #F59E0B;">
          <div style="text-align: center; font-family: 'Fredoka One', cursive; font-size: 13pt; color: #B45309; margin-bottom: 6px;">
            🌟 WELCOME TO OAKWOOD NEIGHBORHOOD GUIDE! 🌟
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 7px; font-size: 8.6pt; line-height: 1.35; color: #1E293B;">
            <div style="background: #FFF; border-left: 4px solid #2A9D8F; padding: 5px 8px; border-radius: 4px;">
              <strong>SECTION 1: Sunshine Park</strong><br>
              Sunshine Park is <strong>the biggest</strong> park in our neighborhood. It is <strong>the best</strong> place to relax <strong>because</strong> it has tall green trees and colorful flowers. Children can ride bicycles safely on the quiet path.
            </div>

            <div style="background: #FFF; border-left: 4px solid #E76F51; padding: 5px 8px; border-radius: 4px;">
              <strong>SECTION 2: Joy Playground</strong><br>
              Joy Playground is my favorite spot! It is safe and exciting. The swings are always busy. It has <strong>the newest</strong> yellow slide in town. Students love to play tag here after school.
            </div>

            <div style="background: #FFF; border-left: 4px solid #457B9D; padding: 5px 8px; border-radius: 4px;">
              <strong>SECTION 3: Oak Street</strong><br>
              Oak Street connects our houses to the school. It has tall buildings and friendly neighborhood stores. It is clean and safe to walk with friends every morning.
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">📌 Gist Check (Check one box)</div>
          <div style="font-size: 8.5pt; color: #334155;">
            What is the main purpose of this text?<br>
            [ ] (A) To teach how to bake a cake<br>
            [ ] (B) To describe favorite places in Oakwood neighborhood<br>
            [ ] (C) To sell cars and bicycles
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🔍</span>
        <span><strong>Superlative Alert:</strong> Superlatives like <em>the biggest</em> and <em>the best</em> compare three or more places!</span>
      </div>
      {build_footer(2, skill)}
    </div>
    """)

    # Page 3: Stage 3 Controlled Practice (Evidence Hunt)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🕵️ STAGE 3: CONTROLLED PRACTICE &bull; EVIDENCE HUNT</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Task A: Reading Detective:</strong> Read each statement. Circle <strong>TRUE</strong> or <strong>FALSE</strong>, and write the <strong>Section Number</strong> (1, 2, or 3) where you found the evidence in the text!
        </div>

        <div class="card">
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 8.5pt; color: #1E293B;">
            <div style="border-bottom: 1px dashed #CBD5E1; padding-bottom: 4px;">
              <strong>1. Sunshine Park has colorful flowers and tall green trees.</strong><br>
              Choice: <strong>[ TRUE / FALSE ]</strong> &nbsp;&bull;&nbsp; Found in Section: <strong>[ &nbsp;&nbsp;&nbsp;&nbsp; ]</strong>
            </div>
            <div style="border-bottom: 1px dashed #CBD5E1; padding-bottom: 4px;">
              <strong>2. The yellow slide is located on Oak Street.</strong><br>
              Choice: <strong>[ TRUE / FALSE ]</strong> &nbsp;&bull;&nbsp; Found in Section: <strong>[ &nbsp;&nbsp;&nbsp;&nbsp; ]</strong>
            </div>
            <div style="border-bottom: 1px dashed #CBD5E1; padding-bottom: 4px;">
              <strong>3. Joy Playground has the newest slide in town.</strong><br>
              Choice: <strong>[ TRUE / FALSE ]</strong> &nbsp;&bull;&nbsp; Found in Section: <strong>[ &nbsp;&nbsp;&nbsp;&nbsp; ]</strong>
            </div>
            <div>
              <strong>4. Oak Street has tall buildings and friendly stores.</strong><br>
              Choice: <strong>[ TRUE / FALSE ]</strong> &nbsp;&bull;&nbsp; Found in Section: <strong>[ &nbsp;&nbsp;&nbsp;&nbsp; ]</strong>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">✨ Task B: Superlative Word Hunt</div>
          <div class="instruction-box" style="margin-bottom: 4px;">
            Find and circle the 3 superlative words used in the Oakwood Guide:
          </div>
          <div style="display: flex; justify-content: space-around; font-weight: 800; font-size: 9.5pt; color: #2A9D8F;">
            <span style="border: 1.5px solid #2A9D8F; padding: 4px 10px; border-radius: 8px;">1. the biggest</span>
            <span style="border: 1.5px solid #457B9D; padding: 4px 10px; border-radius: 8px;">2. the best</span>
            <span style="border: 1.5px solid #E76F51; padding: 4px 10px; border-radius: 8px;">3. the newest</span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">📝</span>
        <span><strong>Evidence Rule:</strong> Never guess! Always point your finger at the exact section in the text to prove your answer!</span>
      </div>
      {build_footer(3, skill)}
    </div>
    """)

    # Page 4: Stage 4 Guided Practice (Feature Matrix)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">📊 STAGE 4: GUIDED PRACTICE &bull; FEATURE MATRIX</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Instructions:</strong> Scan the Oakwood Guide again. Complete the feature matrix below by marking a checkmark (✓) for each place that has that feature!
        </div>

        <div class="card">
          <table class="styled-table">
            <tr>
              <th style="width: 40%;">Neighborhood Feature</th>
              <th style="width: 20%; text-align: center;">Sunshine Park</th>
              <th style="width: 20%; text-align: center;">Joy Playground</th>
              <th style="width: 20%; text-align: center;">Oak Street</th>
            </tr>
            <tr>
              <td>1. Has tall green trees & flowers</td>
              <td style="text-align: center; font-weight: 800; color: #2A9D8F;">[ &nbsp; ]</td>
              <td style="text-align: center;">[ &nbsp; ]</td>
              <td style="text-align: center;">[ &nbsp; ]</td>
            </tr>
            <tr>
              <td>2. Has exciting swings & a new slide</td>
              <td style="text-align: center;">[ &nbsp; ]</td>
              <td style="text-align: center; font-weight: 800; color: #E76F51;">[ &nbsp; ]</td>
              <td style="text-align: center;">[ &nbsp; ]</td>
            </tr>
            <tr>
              <td>3. Has tall buildings & neighborhood stores</td>
              <td style="text-align: center;">[ &nbsp; ]</td>
              <td style="text-align: center;">[ &nbsp; ]</td>
              <td style="text-align: center; font-weight: 800; color: #457B9D;">[ &nbsp; ]</td>
            </tr>
            <tr>
              <td>4. Quiet path for riding bicycles</td>
              <td style="text-align: center; font-weight: 800; color: #2A9D8F;">[ &nbsp; ]</td>
              <td style="text-align: center;">[ &nbsp; ]</td>
              <td style="text-align: center;">[ &nbsp; ]</td>
            </tr>
          </table>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">🧠 Reading Synthesis Question</div>
          <p style="font-size: 8.5pt; color: #334155;">According to your matrix, which place is the <strong>best place for quiet relaxation</strong>? Circle:</p>
          <div style="display: flex; justify-content: center; gap: 12px; margin-top: 5px;">
            <span style="font-weight: 800; font-size: 9pt; color: #2A9D8F;">[ Sunshine Park ]</span>
            <span style="font-weight: 800; font-size: 9pt; color: #E76F51;">[ Joy Playground ]</span>
            <span style="font-weight: 800; font-size: 9pt; color: #457B9D;">[ Oak Street ]</span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">💡</span>
        <span><strong>Graphic Organizers:</strong> Using tables to compare text details helps you organize facts clearly in your mind!</span>
      </div>
      {build_footer(4, skill)}
    </div>
    """)

    # Page 5: Stage 5 Free Production (Read & Recommend)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🎯 STAGE 5: FREE PRODUCTION &bull; READ & RECOMMEND</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Field Trip Advisor:</strong> Read the requests of two students below. Use the Oakwood Guide to recommend the best place for each student and cite the reason from the text!
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-header" style="color: #2A9D8F;">👧 Student Profile #1: Sofia</div>
            <p style="font-size: 8pt; font-style: italic; color: #334155; margin-bottom: 5px;">
              "I love nature! I want to sit under green trees and look at colorful flowers in a quiet place."
            </p>
            <div style="background: #F0FDFA; padding: 6px; border-radius: 6px; font-size: 8.2pt;">
              <strong>Your Recommendation:</strong><br>
              The best place for Sofia is: <strong>[ Sunshine Park / Joy Playground ]</strong><br><br>
              <strong>Reason from text:</strong><br>
              "She should visit because it has ________________________."
            </div>
          </div>

          <div class="card">
            <div class="card-header" style="color: #E76F51;">👦 Student Profile #2: Mateo</div>
            <p style="font-size: 8pt; font-style: italic; color: #334155; margin-bottom: 5px;">
              "I have lots of energy! I want to run, swing high in the air, and slide with my friends."
            </p>
            <div style="background: #FFFBEB; padding: 6px; border-radius: 6px; font-size: 8.2pt;">
              <strong>Your Recommendation:</strong><br>
              The best place for Mateo is: <strong>[ Sunshine Park / Joy Playground ]</strong><br><br>
              <strong>Reason from text:</strong><br>
              "He should visit because it has ________________________."
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">⭐ Critical Thinking Question</div>
          <p style="font-size: 8.5pt; color: #334155;">Which place would <strong>you</strong> choose to visit this weekend? Complete:</p>
          <p style="font-size: 8.5pt; font-weight: 700; color: #1E293B; margin-top: 3px;">
            "My favorite place is __________________ because ______________________________________."
          </p>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🌟</span>
        <span><strong>Reading for Life:</strong> Good readers use texts to make real recommendations and solve practical problems!</span>
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
          <strong>Final Check:</strong> Complete the 3 quick reading questions to earn your Master Reader Badge!
        </div>

        <div class="card">
          <div class="card-header">📝 3-Minute Reading Exit Ticket</div>
          <div style="font-size: 8.5pt; line-height: 1.45; color: #1E293B;">
            <p><strong>1. Detail Check:</strong> What is special about Joy Playground's slide?</p>
            <div style="margin-left: 10px; margin-bottom: 5px;">
              [ ] (A) It is made of ice &nbsp;&nbsp;&nbsp;&nbsp; [ ] (B) It is the newest slide in town
            </div>

            <p><strong>2. Superlative Check:</strong> Sunshine Park is the _________ park in our neighborhood.</p>
            <div style="margin-left: 10px; margin-bottom: 5px;">
              [ ] (A) biggest &nbsp;&nbsp;&nbsp;&nbsp; [ ] (B) smallest &nbsp;&nbsp;&nbsp;&nbsp; [ ] (C) busiest
            </div>

            <p><strong>3. Vocabulary in Context:</strong> What does "quiet" mean in Section 1?</p>
            <div style="margin-left: 10px;">
              [ ] (A) Very noisy with horns &nbsp;&nbsp;&nbsp;&nbsp; [ ] (B) Calm and peaceful with birds
            </div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">🌟 My Reading Superpowers (Self-Assessment)</div>
          <div style="font-size: 8.2pt; line-height: 1.4; color: #475569;">
            <div>⭐⭐⭐ &nbsp; <strong>I can scan a text</strong> to locate specific facts and evidence.</div>
            <div>⭐⭐⭐ &nbsp; <strong>I can identify superlatives</strong> like <em>the biggest</em> and <em>the best</em>.</div>
            <div>⭐⭐⭐ &nbsp; <strong>I can use information from a guide</strong> to make recommendations.</div>
          </div>
          <div style="margin-top: 8px; text-align: center;">
            <span style="background: #FEF3C7; border: 1.5px solid #F59E0B; padding: 4px 14px; border-radius: 20px; font-weight: 800; font-size: 9pt; color: #B45309;">
              🏆 Awarded: Certified Oakwood Master Reader!
            </span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🎉</span>
        <span><strong>Congratulations!</strong> You completed Lesson 2: Reading with outstanding comprehension and evidence hunting!</span>
      </div>
      {build_footer(6, skill)}
    </div>
    """)

    # Page 7: Teacher Guide Part 1
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_tg_nav(num, skill, 1, "READING TEXT & PEDAGOGICAL STRATEGIES")}
      <div class="content-area">
        <div class="tg-box">
          <div class="tg-title">🎯 Curricular Standards & Learning Outcomes (MEDUCA Grade 4)</div>
          <div style="font-size: 8pt; color: #334155; line-height: 1.3;">
            <strong>General Standard:</strong> Can extract general and specific information from short texts when supported with pictures.<br>
            <strong>Specific Outcome:</strong> Can read and outline key information about places in the neighborhood in short texts using superlatives (e.g., 'The library is the best place to read.').<br>
            <strong>CEFR Band:</strong> A1.2 &bull; <strong>Target Superlatives:</strong> the biggest, the best, the newest &bull; <strong>Connector:</strong> because.
          </div>
        </div>

        <div class="tg-box">
          <div class="tg-title">📖 Reading Pedagogy & Explicit Instruction Phases</div>
          <div style="font-size: 8pt; color: #334155; line-height: 1.35;">
            <strong>Phase 1: Pre-Reading (Skimming Signs):</strong> Guide students to look at visual cues (icons of trees, swings, and crosswalks) to activate prior knowledge about neighborhood functions.<br>
            <strong>Phase 2: During-Reading (Evidence Hunting):</strong> Explicitly model the "Finger-to-Text" strategy. Students must point directly to the line of text before answering True or False.<br>
            <strong>Phase 3: Post-Reading (Feature Matrix & Application):</strong> Students transfer linear text data into a structured graphic organizer, reinforcing higher-order cognitive categorization.
          </div>
        </div>

        <div class="tg-box">
          <div class="tg-title">🗣️ Teacher Reading Script & Comprehension Check Prompts</div>
          <div class="tg-script">
            "Before reading Section 1, ask: 'Who loves green parks?' Then read Section 1 aloud with expressive phrasing. Pause after 'the biggest' and 'the best place to relax because it has tall green trees.' Ask: 'Why is it the best place?' Have students underline 'because it has tall green trees and colorful flowers'."
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">📚</span>
        <span><strong>Teacher Tip:</strong> Encourage students to read in whisper-reading pairs before answering Stage 3 questions.</span>
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
              <td>Walking safety: Notice C. Opening hours: Notice A.</td>
              <td>Guide students to look at clock icon vs pedestrian symbol.</td>
            </tr>
            <tr>
              <td><strong>Stage 2</strong></td>
              <td>Gist: (B) Describe favorite places in Oakwood neighborhood.</td>
              <td>Reinforce that the text discusses multiple places, not a recipe or sale.</td>
            </tr>
            <tr>
              <td><strong>Stage 3</strong></td>
              <td>1. TRUE (Section 1); 2. FALSE (Section 2); 3. TRUE (Section 2); 4. TRUE (Section 3).<br>
                  Superlatives: the biggest, the best, the newest.</td>
              <td>If students miss Section numbers, model scanning for bold key nouns.</td>
            </tr>
            <tr>
              <td><strong>Stage 4</strong></td>
              <td>1. Park (✓); 2. Playground (✓); 3. Oak Street (✓); 4. Park (✓).<br>
                  Best place for relaxation: Sunshine Park.</td>
              <td>Verify that checkmarks correspond precisely to text facts.</td>
            </tr>
            <tr>
              <td><strong>Stage 5</strong></td>
              <td>Sofia: Sunshine Park (trees/flowers); Mateo: Joy Playground (swings/slide).</td>
              <td>Ensure students write the reason containing the keyword 'because'.</td>
            </tr>
            <tr>
              <td><strong>Stage 6</strong></td>
              <td>1. (B) The newest slide in town; 2. (A) biggest; 3. (B) Calm and peaceful.</td>
              <td>Review context clues for "quiet" if students select noisy.</td>
            </tr>
          </table>
        </div>

        <div class="tg-box">
          <div class="tg-title">📊 MEDUCA 4-Level Evaluation Rubric (Reading Comprehension)</div>
          <table class="rubric-table">
            <tr>
              <th style="width: 22%;">Criteria</th>
              <th style="width: 19%;">1 - Novice</th>
              <th style="width: 19%;">2 - Developing</th>
              <th style="width: 20%;">3 - Competent</th>
              <th style="width: 20%;">4 - Exemplary</th>
            </tr>
            <tr>
              <td><strong>Locating Evidence</strong></td>
              <td>Guesses answers without referencing text.</td>
              <td>Finds answers but cannot cite section numbers.</td>
              <td>Accurately cites section evidence for True/False statements.</td>
              <td>Rapidly locates explicit and implicit textual evidence.</td>
            </tr>
            <tr>
              <td><strong>Superlative Recognition</strong></td>
              <td>Cannot identify superlative forms in text.</td>
              <td>Identifies 1 superlative with teacher prompting.</td>
              <td>Correctly finds all 3 superlatives in context.</td>
              <td>Explains function of superlatives in comparing places.</td>
            </tr>
            <tr>
              <td><strong>Graphic Organization</strong></td>
              <td>Unable to transfer text facts into matrix.</td>
              <td>Completes table with 2 or more errors.</td>
              <td>Accurately completes comparison matrix with checkmarks.</td>
              <td>Synthesizes matrix data to formulate clear conclusions.</td>
            </tr>
            <tr>
              <td><strong>Text Application</strong></td>
              <td>Fails to match student profiles to locations.</td>
              <td>Matches places but omits reasons from text.</td>
              <td>Successfully matches profiles and quotes valid reasons.</td>
              <td>Expresses sophisticated recommendations with 'because'.</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">📝</span>
        <span><strong>MEDUCA Note:</strong> Evaluate reading comprehension formatively across Stage 3 (Evidence), Stage 4 (Matrix), and Stage 6 (Exit Ticket).</span>
      </div>
      {build_footer(8, skill)}
    </div>
    """)

    html_content = wrap_html(f"Grade 4 - Scenario 1 Theme 1 - Lesson {num}: {skill}", "\n".join(pages))
    file_path = os.path.join(PUBLIC_DIR, f"Grade_4_Scenario_1_Theme_1_Lesson_{num}_{skill}_Packet.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    return file_path
