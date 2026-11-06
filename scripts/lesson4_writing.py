# -*- coding: utf-8 -*-
"""
EduGen Panama - Scenario 1 Theme 1 - Lesson 4: Writing
Grade 4 • CEFR Level: Beginner A1.2
"""

import os
from prototype_shared import (
    PUBLIC_DIR, get_asset, build_awning, build_top_nav, 
    build_tg_nav, build_footer, wrap_html
)

def generate_lesson4_writing():
    skill = "Writing"
    num = 4
    pages = []

    # Page 1: Stage 1 Warm-up (Punctuation Patrol)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">✍️ STAGE 1: WARM-UP & ACTIVATION &bull; PUNCTUATION PATROL</div>
        <div class="stage-time">5-7 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Punctuation Patrol:</strong> Each sentence below is missing a <strong>capital letter</strong> at the beginning and a <strong>period (.)</strong> at the end. Fix the mistakes and rewrite correctly!
        </div>

        <div class="card">
          <div class="hw-line-group">
            <div class="hw-line-label">1. Fix: "the park has green trees"</div>
            <div class="hw-guide">The park has green trees.</div>
          </div>
          <div class="hw-line-group" style="margin-top: 6px;">
            <div class="hw-line-label">2. Fix: "my favorite place is the playground"</div>
            <div class="hw-guide">My favorite place is the playground.</div>
          </div>
          <div class="hw-line-group" style="margin-top: 6px;">
            <div class="hw-line-label">3. Fix: "this tall building is the library"</div>
            <div class="hw-guide">This tall building is the library.</div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">🔍 Punctuation Rule Box</div>
          <div style="font-size: 8.5pt; color: #334155; line-height: 1.4;">
            &bull; Every sentence begins with a <strong>CAPITAL LETTER</strong> (A, B, C...).<br>
            &bull; Every telling sentence ends with a <strong>PERIOD (.)</strong>.
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">✏️</span>
        <span><strong>Mechanics Rule:</strong> Good writers always inspect capital letters and end marks before handing in work!</span>
      </div>
      {build_footer(1, skill)}
    </div>
    """)

    # Page 2: Stage 2 Input (Mentor Text Breakdown)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">📝 STAGE 2: PRESENTATION & INPUT &bull; MENTOR TEXT ANATOMY</div>
        <div class="stage-time">8-10 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Mentor Text:</strong> Examine how an expert Grade 4 student builds an opinion paragraph. Notice how each sentence has a specific job!
        </div>

        <div class="card" style="background: #FFFDF5; border: 2px solid #F59E0B;">
          <div style="font-family: 'Fredoka One', cursive; font-size: 11pt; color: #B45309; margin-bottom: 6px;">
            🌟 Model Paragraph: "My Favorite Neighborhood Place"
          </div>
          <div style="font-size: 8.8pt; line-height: 1.45; color: #1E293B;">
            <span style="background: #E0F2FE; padding: 2px 4px; border-radius: 4px; font-weight: 700;">[Blue: Topic] Sunshine Park is my favorite place in the neighborhood.</span>
            <span style="background: #DCFCE7; padding: 2px 4px; border-radius: 4px; font-weight: 700;">[Green: Superlative] It is the best place to visit after school.</span>
            <span style="background: #FEF3C7; padding: 2px 4px; border-radius: 4px; font-weight: 700;">[Yellow: Reason with 'because'] I love it because it has tall trees and beautiful flowers.</span>
            <span style="background: #FCE7F3; padding: 2px 4px; border-radius: 4px; font-weight: 700;">[Pink: Concluding Feeling] The park makes me feel happy and peaceful.</span>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">🧩 The 4 Building Blocks of an Opinion Paragraph</div>
          <table class="styled-table" style="font-size: 8pt;">
            <tr>
              <th style="width: 25%;">Block</th>
              <th style="width: 75%;">What it does</th>
            </tr>
            <tr>
              <td style="font-weight: 800; color: #0284C7;">1. Topic Sentence</td>
              <td>Names the neighborhood place and your main opinion.</td>
            </tr>
            <tr>
              <td style="font-weight: 800; color: #16A34A;">2. Superlative</td>
              <td>Uses <em>the best</em> or <em>the biggest</em> to compare.</td>
            </tr>
            <tr>
              <td style="font-weight: 800; color: #D97706;">3. Connector (because)</td>
              <td>Gives a clear, specific reason why you like it.</td>
            </tr>
            <tr>
              <td style="font-weight: 800; color: #DB2777;">4. Concluding Feeling</td>
              <td>Tells how the place makes you feel (safe, happy, fun).</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">💡</span>
        <span><strong>Paragraph Secret:</strong> Connect your thoughts in a logical order so your reader understands your passion!</span>
      </div>
      {build_footer(2, skill)}
    </div>
    """)

    # Page 3: Stage 3 Controlled Practice (Sentence Scramble)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🧩 STAGE 3: CONTROLLED PRACTICE &bull; SENTENCE SCRAMBLE</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Sentence Scramble:</strong> Unscramble the word tiles into complete sentences. Remember capital letters, periods, and connectors!
        </div>

        <div class="card">
          <div class="hw-line-group">
            <div class="hw-line-label">Puzzle 1: [ is ] [ The park ] [ because ] [ fun ] [ it has swings ] [ . ]</div>
            <div class="hw-guide">The park is fun because it has swings.</div>
          </div>
          
          <div class="hw-line-group" style="margin-top: 6px;">
            <div class="hw-line-label">Puzzle 2: [ my favorite ] [ is ] [ The playground ] [ place ] [ . ]</div>
            <div class="hw-guide">The playground is my favorite place.</div>
          </div>

          <div class="hw-line-group" style="margin-top: 6px;">
            <div class="hw-line-label">Puzzle 3: [ because ] [ I like Oak Street ] [ it is clean ] [ . ]</div>
            <div class="hw-guide">I like Oak Street because it is clean.</div>
          </div>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="card-header">✏️ Quick Word Bank Check</div>
          <div style="display: flex; justify-content: space-around; font-size: 8.5pt; font-weight: 700; color: #475569;">
            <span>[ ] park</span>
            <span>[ ] playground</span>
            <span>[ ] best</span>
            <span>[ ] favorite</span>
            <span>[ ] because</span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🔍</span>
        <span><strong>Syntax Check:</strong> The connector <em>because</em> sits between the opinion and the reason clause!</span>
      </div>
      {build_footer(3, skill)}
    </div>
    """)

    # Page 4: Stage 4 Guided Practice (Sentence Expander Staircase)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🪜 STAGE 4: GUIDED PRACTICE &bull; SENTENCE EXPANDER</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>The Sentence Expander Staircase:</strong> See how a simple sentence grows into a rich Grade 4 sentence. Trace Level 3 and write Level 4 on the lines!
        </div>

        <div class="card">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="background: #F1F5F9; padding: 4px 8px; border-radius: 6px; font-size: 8.2pt;">
              <strong>Level 1 (Basic Idea):</strong> The playground is big.
            </div>
            <div style="background: #E0F2FE; padding: 4px 8px; border-radius: 6px; font-size: 8.2pt;">
              <strong>Level 2 (Add Superlative):</strong> The playground is <em>the best place</em>.
            </div>
            <div style="background: #FEF3C7; padding: 4px 8px; border-radius: 6px; font-size: 8.2pt;">
              <strong>Level 3 (Add Connector):</strong> The playground is the best place <em>because it is fun</em>.
            </div>
          </div>

          <div class="hw-line-group" style="margin-top: 8px;">
            <div class="hw-line-label">Trace Level 3 on the lines:</div>
            <div class="hw-guide" style="color: #94A3B8;">The playground is the best place because it is fun.</div>
          </div>

          <div class="hw-line-group" style="margin-top: 6px;">
            <div class="hw-line-label">Write Level 4 (Add detail with 'and'):</div>
            <div class="hw-guide">The playground is the best because it has swings and slides.</div>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🪜</span>
        <span><strong>Growth Mindset:</strong> Step by step, adding <em>superlatives</em> and <em>because</em> makes your writing shine!</span>
      </div>
      {build_footer(4, skill)}
    </div>
    """)

    # Page 5: Stage 5 Free Production (Illustrated Mini-Report)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">🖼️ STAGE 5: FREE PRODUCTION &bull; ILLUSTRATED MINI-REPORT</div>
        <div class="stage-time">10-12 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Writing Studio:</strong> Draw your favorite neighborhood place in the illustration frame. Then write a 4-sentence paragraph using the sentence starters below!
        </div>

        <div class="card" style="height: 110px; border: 2px dashed #CBD5E1; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #FFFDF9;">
          <span style="font-size: 9pt; font-weight: 700; color: #94A3B8;">🎨 [ Draw and Color Your Favorite Place Here ] 🎨</span>
        </div>

        <div class="card" style="margin-top: 4px;">
          <div class="hw-line-group">
            <div class="hw-line-label">Sentence 1 (Topic): My favorite place in the neighborhood is...</div>
            <div class="hw-guide">My favorite place is Sunshine Park.</div>
          </div>
          <div class="hw-line-group" style="margin-top: 5px;">
            <div class="hw-line-label">Sentence 2 (Superlative): It is the best place because...</div>
            <div class="hw-guide">It is the best place because it is quiet.</div>
          </div>
          <div class="hw-line-group" style="margin-top: 5px;">
            <div class="hw-line-label">Sentence 3 (Detail with 'and'): When I visit, I see...</div>
            <div class="hw-guide">I see tall green trees and colorful flowers.</div>
          </div>
          <div class="hw-line-group" style="margin-top: 5px;">
            <div class="hw-line-label">Sentence 4 (Feeling): This place makes me feel...</div>
            <div class="hw-guide">This place makes me feel safe and happy.</div>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🌟</span>
        <span><strong>Author's Pride:</strong> You are a published author! Your words paint a picture of our neighborhood!</span>
      </div>
      {build_footer(5, skill)}
    </div>
    """)

    # Page 6: Stage 6 Wrap-up (Writer's Checklist)
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_top_nav(num, skill)}
      <div class="stage-banner">
        <div class="stage-title">✅ STAGE 6: WRAP-UP & EXIT TICKET &bull; WRITER'S CHECKLIST</div>
        <div class="stage-time">5 min</div>
      </div>
      <div class="content-area">
        <div class="instruction-box">
          <strong>Self-Editing Checklist:</strong> Check your Stage 5 paragraph against the 4 writing standards below. Check each box you completed successfully!
        </div>

        <div class="card">
          <div style="font-size: 8.8pt; line-height: 1.6; color: #1E293B;">
            [ ] <strong>1. Capital Letters:</strong> I started every sentence with a big capital letter.<br>
            [ ] <strong>2. Connector 'Because':</strong> I used <em>because</em> to give a clear reason.<br>
            [ ] <strong>3. Superlative Form:</strong> I used <em>the best</em> or <em>the favorite</em>.<br>
            [ ] <strong>4. End Punctuation:</strong> I put a neat period (.) at the end of each sentence.
          </div>
        </div>

        <div class="card" style="margin-top: 4px; text-align: center;">
          <div class="card-header" style="justify-content: center; color: #2A9D8F;">🏆 Certified Grade 4 Author Badge</div>
          <p style="font-size: 8.5pt; color: #475569; margin: 4px 0;">
            "I wrote a clear, organized opinion paragraph about my neighborhood!"
          </p>
          <div style="margin-top: 6px;">
            Teacher / Peer Editor Signature: <span class="line" style="width: 150px;"></span>
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">🎉</span>
        <span><strong>Congratulations!</strong> You completed Lesson 4: Writing with outstanding grammatical mechanics and structure!</span>
      </div>
      {build_footer(6, skill)}
    </div>
    """)

    # Page 7: Teacher Guide Part 1
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_tg_nav(num, skill, 1, "WRITING STANDARDS & SCAFFOLDING")}
      <div class="content-area">
        <div class="tg-box">
          <div class="tg-title">🎯 Curricular Standards & Learning Outcomes (MEDUCA Grade 4)</div>
          <div style="font-size: 8pt; color: #334155; line-height: 1.3;">
            <strong>General Standard:</strong> Can write short texts on familiar topics, such as messages, instructions, or summaries, with clear organization and basic detail.<br>
            <strong>Specific Outcome:</strong> Can write simple sentences about favorite places and revise sentences to add reasons using 'because' (e.g., 'I like the park because it has swings.').<br>
            <strong>CEFR Band:</strong> A1.2 &bull; <strong>Target Mechanics:</strong> Capitalization, terminal periods, compound sentences with 'and' & 'because'.
          </div>
        </div>

        <div class="tg-box">
          <div class="tg-title">📝 Writing Pedagogy & The 6-Stage Progression</div>
          <div style="font-size: 8pt; color: #334155; line-height: 1.35;">
            <strong>Stage 1 Mechanics Warm-Up:</strong> Explicitly trains the visual habit of checking sentence boundaries (capitals and periods).<br>
            <strong>Stage 2 Mentor Text Breakdown:</strong> Demystifies paragraph construction by color-coding syntactic units (Topic, Superlative, Connector, Feeling).<br>
            <strong>Stage 3 Controlled Unscramble:</strong> Enforces syntactic word order: Subject + Copula + Predicate + 'Because' + Subordinate clause.<br>
            <strong>Stage 4 Sentence Expander:</strong> Models linguistic elaboration from simple A1.1 clauses to compound A1.2 sentences.<br>
            <strong>Stage 5 Autonomous Drafting:</strong> Students apply scaffolds to create their original illustrated mini-report.
          </div>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">✏️</span>
        <span><strong>Teacher Tip:</strong> Provide primary guideline support on the board for letter height and baseline alignment.</span>
      </div>
      {build_footer(7, skill)}
    </div>
    """)

    # Page 8: Teacher Guide Part 2
    pages.append(f"""
    <div class="page">
      {build_awning()}
      {build_tg_nav(num, skill, 2, "ANSWER KEY & WRITING RUBRIC")}
      <div class="content-area">
        <div class="tg-box">
          <div class="tg-title">✅ Complete Answer Key & Diagnostic Matrix</div>
          <table class="styled-table" style="font-size: 7.5pt;">
            <tr>
              <th style="width: 15%;">Stage</th>
              <th style="width: 45%;">Expected Written Output</th>
              <th style="width: 40%;">Diagnostic Remediations</th>
            </tr>
            <tr>
              <td><strong>Stage 1</strong></td>
              <td>1. The park has green trees.<br>
                  2. My favorite place is the playground.<br>
                  3. This tall building is the library.</td>
              <td>Have students circle initial capitals in red and terminal periods in blue.</td>
            </tr>
            <tr>
              <td><strong>Stage 3</strong></td>
              <td>1. The park is fun because it has swings.<br>
                  2. The playground is my favorite place.<br>
                  3. I like Oak Street because it is clean.</td>
              <td>Review tile sequencing: ensure 'because' introduces the reason clause.</td>
            </tr>
            <tr>
              <td><strong>Stage 4</strong></td>
              <td>Level 3: The playground is the best place because it is fun.<br>
                  Level 4: The playground is the best because it has swings and slides.</td>
              <td>Assist students with handwriting spacing between words (finger space).</td>
            </tr>
            <tr>
              <td><strong>Stage 5</strong></td>
              <td>4-sentence coherent paragraph addressing topic, superlative, reason, and feeling.</td>
              <td>Utilize the peer editing checklist in Stage 6 before assigning final grades.</td>
            </tr>
          </table>
        </div>

        <div class="tg-box">
          <div class="tg-title">📊 MEDUCA 4-Level Evaluation Rubric (Written Production)</div>
          <table class="rubric-table">
            <tr>
              <th style="width: 22%;">Criteria</th>
              <th style="width: 19%;">1 - Novice</th>
              <th style="width: 19%;">2 - Developing</th>
              <th style="width: 20%;">3 - Competent</th>
              <th style="width: 20%;">4 - Exemplary</th>
            </tr>
            <tr>
              <td><strong>Sentence Mechanics</strong></td>
              <td>No capital letters or periods; illegible letter forms.</td>
              <td>Inconsistent capitals/periods; frequent punctuation errors.</td>
              <td>Accurate capital letters and terminal periods throughout.</td>
              <td>Flawless capitalization, punctuation, and neat letter spacing.</td>
            </tr>
            <tr>
              <td><strong>Syntactic Complexity</strong></td>
              <td>Isolated words or fragmented word lists.</td>
              <td>Simple 3-word sentences without connectors.</td>
              <td>Uses 'because' and 'and' correctly to combine clauses.</td>
              <td>Rich variety of sentence structures including superlatives.</td>
            </tr>
            <tr>
              <td><strong>Vocabulary & Spelling</strong></td>
              <td>Pervasive spelling errors obscure meaning.</td>
              <td>Spells common sight words; struggles with target nouns.</td>
              <td>Accurately spells target vocabulary (park, street, because).</td>
              <td>Rich descriptive vocabulary used accurately and creatively.</td>
            </tr>
            <tr>
              <td><strong>Paragraph Cohesion</strong></td>
              <td>Disconnected sentences with no topical focus.</td>
              <td>Mentions a place but lacks supporting reasons.</td>
              <td>4 organized sentences fulfilling topic, reason, and conclusion.</td>
              <td>Engaging, highly cohesive personal narrative with illustration.</td>
            </tr>
          </table>
        </div>
      </div>
      <div class="mascot-strip">
        <span class="mascot-icon">📝</span>
        <span><strong>MEDUCA Note:</strong> Evaluate written production summatively using the Stage 5 paragraph and Stage 6 checklist.</span>
      </div>
      {build_footer(8, skill)}
    </div>
    """)

    html_content = wrap_html(f"Grade 4 - Scenario 1 Theme 1 - Lesson {num}: {skill}", "\n".join(pages))
    file_path = os.path.join(PUBLIC_DIR, f"Grade_4_Scenario_1_Theme_1_Lesson_{num}_{skill}_Packet.html")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    return file_path
