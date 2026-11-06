"""
EDUGEN PANAMA · GENERADOR AUTOMATIZADO DE PAQUETES AOA (GRADE 4)
Genera paquetes editoriales completos (6 páginas para estudiantes + 2 páginas de Scripts e Instrucciones para el Docente = 8 páginas por paquete)
cumpliendo con la directiva AOA_CURRICULUM_MASTER_MEMORY.md y el CATALOGO_ACTIVIDADES_LUDICAS_CEFR_AOA.md.
"""

import os
import json
import random
import subprocess
import re

CURRICULUM_PATH = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public\curriculums\English_Curriculum_Grade_4.json"
ASSETS_DIR = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public\assets\nouns"
PUBLIC_DIR = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public"
EDGE_EXE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

# Available asset mapping helper
NOUN_FILES = set(os.listdir(ASSETS_DIR))

def find_asset(name, fallback="book.png"):
    cleaned = re.sub(r'[^a-zA-Z0-9_]', '', name.lower().replace(" ", "_"))
    for ext in [f"{cleaned}.png", f"{cleaned}s.png", f"{name.lower()}.png"]:
        if ext in NOUN_FILES:
            return ext
    # Substring search
    for f in NOUN_FILES:
        if cleaned in f or f in cleaned:
            return f
    return fallback

# Dictionary of curated vocabulary and sentences per scenario for Grade 4
SCENARIO_DATA = {
    1: {
        "items": [
            {"word": "park", "asset": "park.png", "missing": "P _ R K"},
            {"word": "street", "asset": "street.png", "missing": "S T R _ _ T"},
            {"word": "building", "asset": "building.png", "missing": "B _ I L D I N G"},
            {"word": "playground", "asset": "playground.png", "missing": "P L _ Y G R O U N D"},
            {"word": "flower", "asset": "flower.png", "missing": "F L _ W _ R"},
            {"word": "neighborhood", "asset": "neighborhood.png", "missing": "N _ I G H B O R H O O D"}
        ],
        "dialogue": [
            {"speaker": "Carlos", "avatar": "👦", "text": "What is your favorite place in the neighborhood?"},
            {"speaker": "Sofía", "avatar": "👧", "text": "This is my favorite: the park is the best!"},
            {"speaker": "Carlos", "avatar": "👦", "text": "Why do you like the park?"},
            {"speaker": "Sofía", "avatar": "👧", "text": "I like the park because it is fun and beautiful."},
            {"speaker": "Carlos", "avatar": "👦", "text": "Great! Let's play soccer near the big trees."}
        ],
        "model_sentence": "The park is my favorite place.",
        "word_bank": ["park", "playground", "street", "fun", "beautiful", "best"],
        "guided_prompt": "What is your favorite place? / My favorite is the ______ / because it is ______!",
        "prod_items": [
            "This is my favorite: the _____________.",
            "The _____________ is the best place.",
            "I like the park because it is _____________."
        ],
        "challenge": "Ask your partner: \"What is your favorite place?\" and explain why using \"because\"!",
        "self_check": ["Can I write \"park\" and \"street\"?", "Can I write \"This is my favorite\"?", "Can I give a reason using \"because\"?"],
        "homework": "Write three sentences about your favorite place near home using \"I like... because...\"."
    },
    2: {
        "items": [
            {"word": "garden", "asset": "garden.png", "missing": "G _ R D E N"},
            {"word": "tomato", "asset": "tomato.png", "missing": "T _ M _ T O"},
            {"word": "plant", "asset": "plant.png", "missing": "P L _ N T"},
            {"word": "seed", "asset": "seed.png", "missing": "S _ _ D"},
            {"word": "soil", "asset": "soil.png", "missing": "S _ I L"},
            {"word": "watering can", "asset": "watering_can.png", "missing": "W _ T E R I N G  C _ N"}
        ],
        "dialogue": [
            {"speaker": "Mateo", "avatar": "👦", "text": "Look at our school garden! The plants are growing."},
            {"speaker": "Elena", "avatar": "👧", "text": "These tomatoes grow quickly in the sun."},
            {"speaker": "Mateo", "avatar": "👦", "text": "How often do you water the tomatoes?"},
            {"speaker": "Elena", "avatar": "👧", "text": "I water the plants every day with the watering can."},
            {"speaker": "Mateo", "avatar": "👦", "text": "Excellent! They look green and healthy."}
        ],
        "model_sentence": "The tomatoes grow quickly every day.",
        "word_bank": ["tomatoes", "garden", "plants", "water", "grow", "soil"],
        "guided_prompt": "How often do you ______ the plants? / I ______ the tomatoes every ______!",
        "prod_items": [
            "First, we plant the _____________ in the soil.",
            "I water the _____________ every morning.",
            "The tomatoes grow quickly because they have _____________."
        ],
        "challenge": "Demonstrate with actions how to dig, plant seeds, and water tomatoes!",
        "self_check": ["Can I spell \"tomato\" and \"plant\"?", "Can I use present simple with \"waters\"?", "Can I describe gardening steps?"],
        "homework": "Draw a plant growth chart with 3 steps: 1. seed, 2. plant, 3. fruit."
    },
    3: {
        "items": [
            {"word": "pineapple", "asset": "pineapple.png", "missing": "P _ N E _ P P L E"},
            {"word": "apple", "asset": "apple.png", "missing": "A P _ L E"},
            {"word": "banana", "asset": "banana.png", "missing": "B A N _ N A"},
            {"word": "orange", "asset": "orange.png", "missing": "O R _ N G E"},
            {"word": "mango", "asset": "mango.png", "missing": "M _ N G O"},
            {"word": "market", "asset": "market.png", "missing": "M _ R K E T"}
        ],
        "dialogue": [
            {"speaker": "Customer", "avatar": "👦", "text": "Hello! I need one pineapple and two apples."},
            {"speaker": "Vendor", "avatar": "🧑‍🌾", "text": "Here you are! Fresh fruits from Chiriquí and La Chorrera."},
            {"speaker": "Customer", "avatar": "👦", "text": "How much is the pineapple?"},
            {"speaker": "Vendor", "avatar": "🧑‍🌾", "text": "The pineapple costs two dollars ($2.00)."},
            {"speaker": "Customer", "avatar": "👦", "text": "Thank you! Here is the money."}
        ],
        "model_sentence": "The pineapple is two dollars.",
        "word_bank": ["pineapple", "apple", "banana", "one", "two", "dollar"],
        "guided_prompt": "How much is the ______? / It is ______ dollar(s)!",
        "prod_items": [
            "I want a/an _____________ from the stand.",
            "The _____________ costs three dollars.",
            "My total shopping cart costs _____________ dollars."
        ],
        "challenge": "Role-play buying 3 fruits with a partner using simulated dollar prices!",
        "self_check": ["Can I write \"pineapple\" and \"banana\"?", "Can I ask \"How much is it?\"?", "Can I calculate prices in USD?"],
        "homework": "Write a 3-item market shopping list with prices in US dollars."
    },
    4: {
        "items": [
            {"word": "canal", "asset": "canal.png", "missing": "C _ N _ L"},
            {"word": "vessel", "asset": "vessel.png", "missing": "V _ S S _ L"},
            {"word": "boat", "asset": "boat.png", "missing": "B _ _ T"},
            {"word": "ocean", "asset": "ocean.png", "missing": "O C _ _ N"},
            {"word": "bridge", "asset": "bridge.png", "missing": "B R _ D G E"},
            {"word": "ship", "asset": "vessel.png", "missing": "S H _ P"}
        ],
        "dialogue": [
            {"speaker": "Guide", "avatar": "🧑‍✈️", "text": "Welcome to Miraflores Locks at the Panama Canal!"},
            {"speaker": "Visitor", "avatar": "👦", "text": "Look! A huge vessel is crossing right now."},
            {"speaker": "Guide", "avatar": "🧑‍✈️", "text": "The Panama Canal connects the Atlantic and Pacific Oceans."},
            {"speaker": "Visitor", "avatar": "👦", "text": "That ship is bigger than the tugboat!"},
            {"speaker": "Guide", "avatar": "🧑‍✈️", "text": "Yes, it transports goods from all over the world."}
        ],
        "model_sentence": "A vessel is crossing the Panama Canal.",
        "word_bank": ["vessel", "canal", "ocean", "crossing", "bigger", "bridge"],
        "guided_prompt": "What connects the oceans? / The ______ connects two ______!",
        "prod_items": [
            "The Panama Canal connects two _____________.",
            "A big _____________ is crossing the locks today.",
            "That vessel is _____________ than the small boat."
        ],
        "challenge": "Trace the route of a ship crossing from the Atlantic to the Pacific with your finger!",
        "self_check": ["Can I write \"vessel\" and \"canal\"?", "Can I use comparatives like \"bigger\"?", "Can I describe what is crossing now?"],
        "homework": "Draw a ship passing through the locks and write: \"The ship is crossing the Canal.\""
    },
    5: {
        "items": [
            {"word": "beach", "asset": "beach.png", "missing": "B _ _ C H"},
            {"word": "towel", "asset": "towel.png", "missing": "T _ W _ L"},
            {"word": "sunscreen", "asset": "sunscreen.png", "missing": "S _ N S C R _ _ N"},
            {"word": "umbrella", "asset": "umbrella.png", "missing": "U M B R _ L L _"},
            {"word": "sand", "asset": "beach.png", "missing": "S _ N D"},
            {"word": "wave", "asset": "ocean.png", "missing": "W _ V E"}
        ],
        "dialogue": [
            {"speaker": "Lucas", "avatar": "👦", "text": "Let's pack our backpack for the beach trip this Saturday!"},
            {"speaker": "Valeria", "avatar": "👧", "text": "Please pack a towel, sunscreen, and your sun hat."},
            {"speaker": "Lucas", "avatar": "👦", "text": "I always pack lunch and plenty of cold water."},
            {"speaker": "Valeria", "avatar": "👧", "text": "We are going to swim and build sandcastles!"},
            {"speaker": "Lucas", "avatar": "👦", "text": "The Pacific beach is sunny and warm."}
        ],
        "model_sentence": "Please pack a towel and sunscreen.",
        "word_bank": ["beach", "towel", "sunscreen", "pack", "always", "swim"],
        "guided_prompt": "What do we bring? / Please pack a ______ and ______!",
        "prod_items": [
            "For the trip, I always pack _____________.",
            "We are going to the _____________ this weekend.",
            "Do not forget to wear _____________ in the sun."
        ],
        "challenge": "Role-play checking a packing list: \"Did you bring the towel? Yes, I did!\"",
        "self_check": ["Can I write beach items correctly?", "Can I give polite instructions with \"Please\"?", "Can I describe routines with \"always\"?"],
        "homework": "Create a checklist of 4 things you pack for an outdoor family trip."
    },
    6: {
        "items": [
            {"word": "puddle", "asset": "puddle.png", "missing": "P _ D D L E"},
            {"word": "umbrella", "asset": "umbrella.png", "missing": "U M B R _ L L _"},
            {"word": "raincoat", "asset": "raincoat.png", "missing": "R _ I N C _ _ T"},
            {"word": "boots", "asset": "boots.png", "missing": "B _ _ T S"},
            {"word": "storm", "asset": "puddle.png", "missing": "S T _ R M"},
            {"word": "rain", "asset": "raincoat.png", "missing": "R _ I N"}
        ],
        "dialogue": [
            {"speaker": "Andrés", "avatar": "👦", "text": "It is raining heavily in Panama City today!"},
            {"speaker": "Camila", "avatar": "👧", "text": "Where is your umbrella? You need it right now."},
            {"speaker": "Andrés", "avatar": "👦", "text": "I have my yellow raincoat and my rubber boots."},
            {"speaker": "Camila", "avatar": "👧", "text": "Look at that big puddle in front of the school!"},
            {"speaker": "Andrés", "avatar": "👦", "text": "Let's walk carefully so we don't get wet."}
        ],
        "model_sentence": "I need an umbrella when it rains.",
        "word_bank": ["umbrella", "puddle", "boots", "raincoat", "need", "wet"],
        "guided_prompt": "What do you wear in the rain? / I wear my ______ and ______!",
        "prod_items": [
            "It is raining today, so I need an _____________.",
            "I wear my _____________ to jump in the puddle.",
            "My yellow _____________ keeps me dry and warm."
        ],
        "challenge": "Give a 30-second live TV weather forecast: \"Good morning Panama! Today it is rainy...\"",
        "self_check": ["Can I write \"umbrella\" and \"puddle\"?", "Can I use \"need\" to express necessity?", "Can I describe rainy weather with present continuous?"],
        "homework": "Write two sentences describing what you do inside when it rains heavily."
    },
    7: {
        "items": [
            {"word": "mola", "asset": "mola.png", "missing": "M _ L _"},
            {"word": "turtle", "asset": "turtle.png", "missing": "T _ R T L _"},
            {"word": "culture", "asset": "mola.png", "missing": "C _ L T _ R E"},
            {"word": "color", "asset": "flower.png", "missing": "C _ L _ R"},
            {"word": "design", "asset": "mola.png", "missing": "D _ S _ G N"},
            {"word": "fabric", "asset": "mola.png", "missing": "F _ B R _ C"}
        ],
        "dialogue": [
            {"speaker": "Kuna Artist", "avatar": "👩‍🎨", "text": "Welcome! A mola has many vibrant colors and layers."},
            {"speaker": "Student", "avatar": "👦", "text": "This mola is beautiful. I see red, yellow, and blue."},
            {"speaker": "Kuna Artist", "avatar": "👩‍🎨", "text": "First, we choose the fabric. Next, we cut and sew the patterns."},
            {"speaker": "Student", "avatar": "👦", "text": "I like this design because it shows a sea turtle."},
            {"speaker": "Kuna Artist", "avatar": "👩‍🎨", "text": "Molas represent our Guna culture and nature."}
        ],
        "model_sentence": "A mola has many bright colors.",
        "word_bank": ["mola", "colors", "turtle", "fabric", "sew", "beautiful"],
        "guided_prompt": "Why do you like the mola? / I like it because it is ______ and ______!",
        "prod_items": [
            "A mola has many beautiful _____________.",
            "First, I cut the _____________ carefully.",
            "I like this mola because it shows a sea _____________."
        ],
        "challenge": "Explain to a peer the 3 steps to make a paper mola: First, Next, Finally!",
        "self_check": ["Can I spell \"mola\" and \"turtle\"?", "Can I describe colors and shapes?", "Can I use \"First\" and \"Next\" to describe steps?"],
        "homework": "Draw your own mola animal pattern using at least 4 geometric colors."
    },
    8: {
        "items": [
            {"word": "pollera", "asset": "pollera.png", "missing": "P _ L L _ R A"},
            {"word": "celebration", "asset": "celebration.png", "missing": "C _ L _ B R _ T I O N"},
            {"word": "dress", "asset": "pollera.png", "missing": "D R _ S S"},
            {"word": "jewelry", "asset": "flower.png", "missing": "J _ W _ L R Y"},
            {"word": "attire", "asset": "pollera.png", "missing": "A T T _ R E"},
            {"word": "dance", "asset": "celebration.png", "missing": "D _ N C E"}
        ],
        "dialogue": [
            {"speaker": "Raquel", "avatar": "👧", "text": "Look at my grandmother! She is wearing a gorgeous pollera."},
            {"speaker": "Diego", "avatar": "👦", "text": "The pollera is Panama's national traditional dress."},
            {"speaker": "Raquel", "avatar": "👧", "text": "Women wear polleras at festivals, celebrations, and dances."},
            {"speaker": "Diego", "avatar": "👦", "text": "She has golden tembleques and shiny jewelry in her hair."},
            {"speaker": "Raquel", "avatar": "👧", "text": "Let's dress up and celebrate our Panamanian culture!"}
        ],
        "model_sentence": "She is wearing a beautiful pollera.",
        "word_bank": ["pollera", "wearing", "dress", "celebration", "dance", "culture"],
        "guided_prompt": "What is she wearing? / She is wearing a ______ for the ______!",
        "prod_items": [
            "She is wearing a traditional _____________.",
            "People wear cultural dress at the _____________.",
            "The pollera has delicate flowers and golden _____________."
        ],
        "challenge": "Describe what traditional costume people wear during November national holidays in Panama!",
        "self_check": ["Can I write \"pollera\" and \"dress\"?", "Can I use present continuous (\"is wearing\")?", "Can I describe cultural clothing?"],
        "homework": "Write three sentences about traditional Panamanian clothing using \"She is wearing...\""
    }
}

# Skill specific variations across the 5 lessons
SKILL_CONFIG = {
    1: {"name": "Listening", "action_verb": "Listen and Discriminate", "icon": "🎧", "focus": "Auditory Discrimination & Total Physical Response (TPR)"},
    2: {"name": "Reading", "action_verb": "Read and Discover", "icon": "📖", "focus": "Graphic Organizers & Authentic Texts Comprehension"},
    3: {"name": "Speaking", "action_verb": "Speak and Interact", "icon": "🗣️", "focus": "Spoken Interaction, Partner Role-Play & Fluency"},
    4: {"name": "Writing", "action_verb": "Write and Create", "icon": "✍️", "focus": "Penmanship, Guided Framing & Authentic Deliverable"},
    5: {"name": "Mediation", "action_verb": "Mediate and Bridge", "icon": "🤝", "focus": "21st Century Skills, Peer Assistance & Community Projects"}
}

def render_html_packet(scenario_num, theme_num, lesson_num, scenario_info):
    s_data = SCENARIO_DATA[scenario_num]
    skill_info = SKILL_CONFIG[lesson_num]
    
    theme_title = scenario_info.get(f"theme{theme_num}", f"Theme {theme_num}")
    theme_type = "Receptive Focus" if theme_num == 1 else "Interactive Focus"
    s_name = scenario_info["scenarioName"]
    
    # 4 match items randomly shuffled
    match_base = s_data["items"][:4]
    shuffled_words = [it["word"] for it in match_base]
    rng = random.Random(scenario_num * 100 + theme_num * 10 + lesson_num)
    # Ensure no word matches its row
    while any(shuffled_words[i] == match_base[i]["word"] for i in range(len(match_base))):
        rng.shuffle(shuffled_words)

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grade 4 • Scenario {scenario_num} • Theme {theme_num} • Lesson {lesson_num} ({skill_info['name']})</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800;900&family=Caveat:wght@600;700&display=swap" rel="stylesheet">
  <style>
    @page {{
      size: letter portrait;
      margin: 0;
    }}
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      font-family: 'Nunito', sans-serif;
      background: #E5E7EB;
      color: #1E293B;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}
    .page {{
      width: 8.5in;
      height: 11in;
      margin: 0 auto 30px auto;
      background: #FFFDF9;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      padding: 0.65in 0.55in 0.45in 0.55in;
      box-shadow: 0 10px 30px rgba(0,0,0,0.12);
    }}
    @media print {{
      body {{ background: #FFF; }}
      .page {{ margin: 0; box-shadow: none; }}
    }}
    /* Awning Canopy */
    .market-awning {{
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 48px;
      display: flex;
      z-index: 10;
    }}
    .awning-stripe {{
      flex: 1; height: 100%;
      border-bottom-left-radius: 14px;
      border-bottom-right-radius: 14px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.08);
    }}
    .awning-stripe:nth-child(5n+1) {{ background: #2A9D8F; }}
    .awning-stripe:nth-child(5n+2) {{ background: #457B9D; }}
    .awning-stripe:nth-child(5n+3) {{ background: #E9C46A; }}
    .awning-stripe:nth-child(5n+4) {{ background: #F4A261; }}
    .awning-stripe:nth-child(5n+5) {{ background: #E76F51; }}

    /* Header Nav Pills */
    .header-pills {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }}
    .pill-badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 16px;
      border-radius: 50px;
      font-size: 0.78rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: white;
    }}
    .pill-green {{ background: #2A9D8F; }}
    .pill-blue {{ background: #457B9D; }}
    .pill-orange {{ background: #E76F51; }}
    .pill-purple {{ background: #6D28D9; }}

    .page-title {{
      font-family: 'Fredoka', cursive, sans-serif;
      font-size: 2.05rem;
      font-weight: 700;
      color: #1D3557;
      text-align: center;
      line-height: 1.15;
      margin-bottom: 12px;
    }}
    .section-banner {{
      background: #2A9D8F;
      color: white;
      font-family: 'Fredoka', cursive, sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: 0.8px;
      padding: 6px 14px;
      border-radius: 8px;
      display: inline-block;
      margin-bottom: 10px;
      text-transform: uppercase;
    }}
    .section-banner-blue {{ background: #457B9D; }}
    .section-banner-orange {{ background: #E76F51; }}
    .section-banner-purple {{ background: #6D28D9; }}

    /* Penmanship */
    .penmanship-block {{
      position: relative;
      height: 46px;
      margin: 8px 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }}
    .penmanship-line {{ width: 100%; height: 1px; }}
    .penmanship-top {{ border-top: 1.5px solid #CBD5E1; }}
    .penmanship-mid {{ border-top: 1.5px dashed #94A3B8; }}
    .penmanship-base {{ border-top: 2px solid #3B82F6; }}
    .penmanship-text {{
      position: absolute;
      left: 12px; top: -2px;
      font-family: 'Fredoka', cursive, sans-serif;
      font-size: 1.85rem;
      color: #1E293B;
      line-height: 1;
      letter-spacing: 2px;
    }}
    .penmanship-ghost {{ color: #CBD5E1; }}

    /* Cards */
    .vocab-card {{
      border: 1.5px solid #E2E8F0;
      border-radius: 14px;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px 8px;
      text-align: center;
    }}
    .vocab-card img {{
      width: 58px; height: 58px;
      object-fit: contain;
      margin-bottom: 6px;
    }}
    .vocab-card .word-label {{
      font-family: 'Fredoka', cursive, sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1E293B;
    }}
    .dialogue-row {{
      display: flex; align-items: center;
      gap: 12px; margin-bottom: 8px;
    }}
    .dialogue-avatar {{
      width: 36px; height: 36px;
      border-radius: 50%;
      background: #E2E8F0;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.25rem; flex-shrink: 0;
    }}
    .dialogue-content {{
      flex: 1; background: white;
      padding: 8px 14px; border-radius: 14px;
      border: 1px solid #E2E8F0; font-size: 0.98rem; line-height: 1.4;
    }}
    .speaker-name {{
      font-weight: 800; font-size: 0.82rem;
      color: #457B9D; text-transform: uppercase;
      margin-bottom: 2px; display: block;
    }}
    .match-table {{
      width: 100%; border-collapse: separate; border-spacing: 0 10px;
    }}
    .match-row td {{ vertical-align: middle; padding: 4px; }}
    .match-num {{
      width: 30px; height: 30px;
      border-radius: 50%; background: #2A9D8F;
      color: white; font-family: 'Fredoka', cursive;
      font-size: 1rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }}
    .match-img {{ width: 48px; height: 48px; object-fit: contain; }}
    .match-dot {{
      width: 12px; height: 12px;
      border-radius: 50%; background: #2A9D8F;
      display: inline-block;
    }}
    .match-word {{
      font-family: 'Fredoka', cursive;
      font-size: 1.3rem; font-weight: 600; color: #1D3557;
    }}
    .missing-row {{
      display: flex; align-items: center; gap: 14px;
      margin-bottom: 12px; font-family: 'Fredoka', cursive;
      font-size: 1.25rem; letter-spacing: 3px; color: #1D3557;
    }}
    .missing-num {{
      width: 28px; height: 28px;
      border-radius: 50%; background: #457B9D;
      color: white; font-size: 0.95rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      letter-spacing: normal;
    }}
    .word-bank-box {{
      background: #F0FDF4; border: 2px dashed #86EFAC;
      border-radius: 16px; padding: 10px 16px; margin: 8px 0;
    }}
    .word-bank-title {{
      font-family: 'Fredoka', cursive, sans-serif;
      font-size: 0.95rem; font-weight: 700; color: #15803D;
      text-transform: uppercase; margin-bottom: 6px; text-align: center;
    }}
    .word-bank-pills {{
      display: flex; justify-content: center; flex-wrap: wrap; gap: 8px;
    }}
    .bank-pill {{
      background: white; border: 1.5px solid #86EFAC;
      padding: 5px 16px; border-radius: 20px;
      font-family: 'Fredoka', cursive, sans-serif;
      font-size: 1.05rem; font-weight: 600; color: #1D3557;
    }}
    .production-card {{
      display: flex; gap: 14px;
      border: 1.5px solid #E2E8F0; border-radius: 16px;
      background: white; padding: 12px 14px; margin-bottom: 10px;
      align-items: center;
    }}
    .item-num-badge {{
      width: 32px; height: 32px;
      border-radius: 50%; background: #E76F51;
      color: white; font-family: 'Fredoka', cursive;
      font-size: 1.1rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }}
    .item-draw-box {{
      width: 130px; height: 80px;
      border: 2px dashed #CBD5E1; border-radius: 12px;
      background: #F8FAFC; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      color: #94A3B8; font-size: 0.75rem; font-weight: 700;
      text-transform: uppercase; flex-shrink: 0;
    }}
    .check-table {{
      width: 100%; border-collapse: collapse; margin: 8px 0 14px 0;
    }}
    .check-table th {{
      padding: 8px; font-family: 'Fredoka', cursive; font-size: 0.9rem;
      color: #475569; text-align: center; border-bottom: 2px solid #E2E8F0;
    }}
    .check-table th:first-child {{ text-align: left; }}
    .check-table td {{
      padding: 8px; font-size: 1rem; font-weight: 600;
      color: #1E293B; border-bottom: 1px solid #F1F5F9;
      vertical-align: middle;
    }}
    .checkbox-box {{
      width: 22px; height: 22px;
      border: 2px solid #CBD5E1; border-radius: 7px;
      margin: 0 auto; background: white;
    }}
    .reflection-card {{
      border: 2px solid #BFDBFE; border-radius: 18px;
      background: #EFF6FF; padding: 12px 16px; margin-bottom: 12px;
    }}
    .reflection-q {{
      font-size: 0.98rem; font-weight: 700; color: #1E40AF; margin-bottom: 6px;
    }}
    .simple-line {{
      width: 100%; border-bottom: 1.5px solid #93C5FD; height: 22px;
    }}
    .homework-box {{
      background: #FEF3C7; border: 2px solid #F59E0B;
      border-radius: 16px; padding: 10px 14px;
      display: flex; align-items: center; gap: 12px;
    }}
    .mission-footer {{
      margin-top: auto;
      background: linear-gradient(90deg, #FDE68A 0%, #FCD34D 100%);
      border-radius: 30px; padding: 8px 18px;
      display: flex; align-items: center; justify-content: space-between;
      color: #78350F; font-family: 'Fredoka', cursive; font-size: 1.05rem;
      font-weight: 700;
    }}
    .fresh-basket-tag {{
      display: inline-flex; align-items: center; gap: 6px;
      background: #FFF; border: 1.5px solid #E2E8F0;
      padding: 4px 12px; border-radius: 20px;
      font-size: 0.85rem; font-weight: 700; color: #047857;
    }}
    /* Teacher Script Page Styles */
    .teacher-section-title {{
      font-family: 'Fredoka', cursive; font-size: 1.15rem; font-weight: 700;
      color: #1E3A8A; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;
    }}
    .teacher-table {{
      width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 0.84rem;
    }}
    .teacher-table th {{
      background: #1E293B; color: white; padding: 7px 10px; text-align: left;
    }}
    .teacher-table td {{
      padding: 7px 10px; border-bottom: 1px solid #E2E8F0; vertical-align: top;
    }}
    .script-box {{
      background: #F8FAFC; border-left: 4px solid #3B82F6;
      border-radius: 8px; padding: 8px 12px; margin-bottom: 8px; font-size: 0.84rem;
    }}
    .script-stage {{
      font-weight: 800; color: #1E40AF; text-transform: uppercase; font-size: 0.78rem;
    }}
  </style>
</head>
<body>

  <!-- ========================================================================= -->
  <!-- PAGE 1: STAGE 1 - WARM-UP & MODELING                                      -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="market-awning">
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div>
    </div>

    <div class="header-pills">
      <div class="pill-badge pill-green">Lesson {lesson_num} • {skill_info['name']} ({skill_info['icon']})</div>
      <div class="pill-badge pill-blue">Scenario {scenario_num} • {theme_type}</div>
      <div class="pill-badge pill-orange">Grade 4 • A1.2</div>
    </div>

    <div class="page-title">Today I Can {skill_info['action_verb']}!<br/><span style="font-size:1.35rem; color:#457B9D;">Theme {theme_num}: "{theme_title}"</span></div>

    <!-- Vocab 6-Grid -->
    <div style="display: flex; gap: 14px; margin-bottom: 14px;">
      <div style="flex: 2; border: 2px solid #E2E8F0; border-radius: 18px; padding: 12px; background: white;">
        <div class="section-banner">Warm-Up: Target Vocabulary</div>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
"""

    for it in s_data["items"][:6]:
        html += f"""          <div class="vocab-card">
            <img src="assets/nouns/{it['asset']}" alt="{it['word']}">
            <span class="word-label">{it['word']}</span>
          </div>\n"""

    html += f"""        </div>
      </div>

      <!-- Action Engagement Hook -->
      <div style="flex: 1.1; border: 2px solid #E2E8F0; border-radius: 18px; padding: 12px; background: white; display: flex; flex-direction: column;">
        <div style="font-family: 'Fredoka', cursive; font-size: 1rem; font-weight: 700; color: #1D3557; text-align: center; margin-bottom: 8px;">
          Creative Action Hook
        </div>
        <div style="flex: 1; border: 2px dashed #CBD5E1; border-radius: 14px; background: #F8FAFC; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 10px;">
          <img src="assets/nouns/{s_data['items'][0]['asset']}" style="width: 75px; height: 75px; object-fit: contain; margin-bottom: 6px;" alt="{s_data['items'][0]['word']}">
          <span style="font-family: 'Fredoka', cursive; color: #64748B; font-size: 0.82rem; text-align: center;">Draw or paste your target scenario item here!</span>
        </div>
      </div>
    </div>

    <!-- Penmanship Practice -->
    <div style="border: 2px solid #E2E8F0; border-radius: 18px; padding: 14px 18px; background: white; flex: 1;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <div class="section-banner section-banner-blue">Penmanship & Mechanics</div>
        <div style="font-size: 0.92rem; font-weight: 700; color: #64748B;">Copy with capital start & period.</div>
      </div>

      <div style="margin-bottom: 16px;">
        <div class="penmanship-block">
          <div class="penmanship-line penmanship-top"></div>
          <div class="penmanship-line penmanship-mid"></div>
          <div class="penmanship-line penmanship-base"></div>
          <div class="penmanship-text">{s_data['items'][0]['word']}</div>
        </div>
        <div class="penmanship-block">
          <div class="penmanship-line penmanship-top"></div>
          <div class="penmanship-line penmanship-mid"></div>
          <div class="penmanship-line penmanship-base"></div>
        </div>
      </div>

      <div>
        <div class="penmanship-block">
          <div class="penmanship-line penmanship-top"></div>
          <div class="penmanship-line penmanship-mid"></div>
          <div class="penmanship-line penmanship-base"></div>
          <div class="penmanship-text">{s_data['items'][1]['word']}</div>
        </div>
        <div class="penmanship-block">
          <div class="penmanship-line penmanship-top"></div>
          <div class="penmanship-line penmanship-mid"></div>
          <div class="penmanship-line penmanship-base"></div>
        </div>
      </div>
    </div>

    <!-- Motivational Footer -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
      <div class="fresh-basket-tag">🌟 Scenario {scenario_num}: {s_name}</div>
      <div style="font-family: 'Fredoka', cursive; font-size: 0.85rem; color: #64748B;">Page 1 • AOA Stage 1: Warm-up & Modeling</div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PAGE 2: STAGE 2 - PRESENTATION & MEANING                                  -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="market-awning">
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div>
    </div>

    <div class="header-pills">
      <div class="pill-badge pill-green">Stage 2 • Presentation</div>
      <div class="pill-badge pill-blue">Grade 4 • A1.2</div>
      <div class="pill-badge pill-orange">{skill_info['name']} Focus</div>
    </div>

    <div class="page-title">Read, Observe & Learn</div>

    <div style="display: flex; gap: 16px; margin-bottom: 16px;">
      <!-- Scene Image Card -->
      <div style="flex: 1.1; border: 2px solid #E2E8F0; border-radius: 18px; background: white; padding: 14px; text-align: center;">
        <img src="assets/nouns/{s_data['items'][0]['asset']}" style="width: 130px; height: 130px; object-fit: contain; margin-bottom: 8px;" alt="{s_data['items'][0]['word']}">
        <div style="font-family: 'Fredoka', cursive; font-size: 1.05rem; color: #1D3557; font-weight: 700;">Panamanian Setting</div>
        <div style="font-size: 0.82rem; color: #64748B;">Context: {s_name}</div>
      </div>

      <!-- Dialogue Model Card -->
      <div style="flex: 1.9; border: 2px solid #E2E8F0; border-radius: 18px; background: white; padding: 14px;">
        <div class="section-banner section-banner-blue" style="margin-bottom: 10px;">Authentic Interaction Dialogue</div>
"""

    for d in s_data["dialogue"][:5]:
        html += f"""        <div class="dialogue-row">
          <div class="dialogue-avatar">{d['avatar']}</div>
          <div class="dialogue-content">
            <span class="speaker-name">{d['speaker']}</span>
            {d['text']}
          </div>
        </div>\n"""

    html += f"""      </div>
    </div>

    <!-- Write / Trace Model Sentence -->
    <div style="border: 2px solid #E2E8F0; border-radius: 18px; background: white; padding: 16px; flex: 1;">
      <div class="section-banner section-banner-orange" style="margin-bottom: 10px;">Target Sentence Structure</div>

      <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 14px;">
        <div style="position: relative; text-align: center;">
          <img src="assets/nouns/{s_data['items'][1]['asset']}" style="width: 95px; height: 95px; object-fit: contain;" alt="{s_data['items'][1]['word']}">
          <span style="position: absolute; right: -5px; bottom: 5px; background: #E9C46A; color: #1E293B; font-family: 'Fredoka', cursive; font-size: 1.05rem; font-weight: 700; padding: 3px 8px; border-radius: 8px; border: 1.5px solid #D97706;">A1.2</span>
        </div>

        <div style="flex: 1; border: 2px solid #CBD5E1; border-radius: 14px; background: #F8FAFC; padding: 12px 16px;">
          <div style="font-family: 'Fredoka', cursive; font-size: 1.45rem; color: #1D3557; font-weight: 700; margin-bottom: 2px;">
            {s_data['model_sentence']}
          </div>
          <div style="font-size: 0.9rem; color: #64748B;">Trace the sentence with neat handwriting:</div>
        </div>
      </div>

      <div class="penmanship-block" style="margin-bottom: 10px;">
        <div class="penmanship-line penmanship-top"></div>
        <div class="penmanship-line penmanship-mid"></div>
        <div class="penmanship-line penmanship-base"></div>
        <div class="penmanship-text penmanship-ghost">{s_data['model_sentence']}</div>
      </div>
      <div class="penmanship-block">
        <div class="penmanship-line penmanship-top"></div>
        <div class="penmanship-line penmanship-mid"></div>
        <div class="penmanship-line penmanship-base"></div>
      </div>
    </div>

    <!-- Motivational Footer -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
      <div class="fresh-basket-tag">💬 Meaning in Authentic Action</div>
      <div style="font-family: 'Fredoka', cursive; font-size: 0.85rem; color: #64748B;">Page 2 • AOA Stage 2: Presentation & Meaning</div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PAGE 3: STAGE 3 - PRACTICE PART 1 (RANDOMIZED MATCH & SPELLING)           -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="market-awning">
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div>
    </div>

    <div class="header-pills">
      <div class="pill-badge pill-green">Stage 3 • Practice 1</div>
      <div class="pill-badge pill-blue">Grade 4 • A1.2</div>
      <div class="pill-badge pill-orange">Random Matching Check</div>
    </div>

    <div class="page-title">Practice 1: Match & Complete</div>

    <!-- Part A: Randomized Matching -->
    <div style="border: 2px solid #E2E8F0; border-radius: 18px; background: white; padding: 14px 18px; margin-bottom: 16px;">
      <div style="font-family: 'Fredoka', cursive; font-size: 1.15rem; font-weight: 700; color: #1D3557; margin-bottom: 10px;">
        Match each picture to the correct word. (Words are in random order — draw lines to connect!)
      </div>

      <table class="match-table">
"""

    for idx, it in enumerate(match_base):
        html += f"""        <tr class="match-row">
          <td style="width: 40px;"><div class="match-num">{idx+1}</div></td>
          <td style="width: 70px;"><img src="assets/nouns/{it['asset']}" class="match-img" alt="{it['word']}"></td>
          <td style="text-align: center; width: 60px;"><div class="match-dot"></div></td>
          <td style="text-align: center; width: 60px;"><div class="match-dot"></div></td>
          <td class="match-word">{shuffled_words[idx]}</td>
        </tr>\n"""

    html += f"""      </table>
    </div>

    <!-- Part B: Missing Letters -->
    <div style="border: 2px solid #E2E8F0; border-radius: 18px; background: white; padding: 14px 18px; flex: 1;">
      <div style="font-family: 'Fredoka', cursive; font-size: 1.15rem; font-weight: 700; color: #1D3557; margin-bottom: 12px;">
        Complete the words. Write the missing letters.
      </div>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
"""

    for idx, it in enumerate(s_data["items"][:4]):
        html += f"""        <div class="missing-row">
          <div class="missing-num">{idx+1}</div>
          <span>{it['missing']}</span>
        </div>\n"""

    html += f"""      </div>

      <div style="margin-top: 14px; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 12px;">
        <img src="assets/nouns/{s_data['items'][0]['asset']}" style="height: 70px; object-fit: contain;" alt="Scenario object">
      </div>
    </div>

    <!-- Motivational Footer -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
      <div class="fresh-basket-tag">✏️ Spelling & Vocabulary Mastery</div>
      <div style="font-family: 'Fredoka', cursive; font-size: 0.85rem; color: #64748B;">Page 3 • AOA Stage 3: Controlled Practice</div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PAGE 4: STAGE 3 - PRACTICE PART 2 (GUIDED DIALOGUE & SCAFFOLDING)         -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="market-awning">
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div>
    </div>

    <div class="header-pills">
      <div class="pill-badge pill-green">Stage 3 • Practice 2</div>
      <div class="pill-badge pill-blue">Grade 4 • A1.2</div>
      <div class="pill-badge pill-purple">Supported Options</div>
    </div>

    <div class="page-title">Practice 2: Complete the Dialogue</div>

    <div style="text-align: center; font-size: 1.05rem; font-weight: 700; color: #475569; margin-bottom: 12px;">
      Use words from the Word Bank to complete the conversation.
    </div>

    <!-- Dialogue Fill-in Card -->
    <div style="border: 2px solid #E2E8F0; border-radius: 18px; background: white; padding: 18px; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
        <div class="dialogue-avatar" style="width: 44px; height: 44px;">👦</div>
        <div style="flex: 1;">
          <span class="speaker-name" style="font-size: 0.92rem;">Student A:</span>
          <div style="font-family: 'Fredoka', cursive; font-size: 1.3rem; color: #1D3557;">
            {s_data['dialogue'][0]['text']}
          </div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 16px;">
        <div class="dialogue-avatar" style="width: 44px; height: 44px;">👧</div>
        <div style="flex: 1;">
          <span class="speaker-name" style="font-size: 0.92rem;">Student B:</span>
          <div style="font-family: 'Fredoka', cursive; font-size: 1.3rem; color: #1D3557;">
            It is the _____________ because it is _____________!
          </div>
        </div>
      </div>

      <div style="display: flex; align-items: center; gap: 14px;">
        <div class="dialogue-avatar" style="width: 44px; height: 44px;">👦</div>
        <div style="flex: 1;">
          <span class="speaker-name" style="font-size: 0.92rem;">Student A:</span>
          <div style="font-family: 'Fredoka', cursive; font-size: 1.3rem; color: #1D3557;">
            Awesome! The _____________ is the best.
          </div>
        </div>
      </div>
    </div>

    <!-- Word Bank -->
    <div class="word-bank-box">
      <div class="word-bank-title">Word Bank</div>
      <div class="word-bank-pills">
"""

    for wb in s_data["word_bank"]:
        html += f"""        <span class="bank-pill">{wb}</span>\n"""

    html += f"""      </div>
    </div>

    <!-- Supported Option -->
    <div style="border: 2px solid #BAE6FD; border-radius: 18px; background: #F0F9FF; padding: 14px; flex: 1;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
        <span style="font-size: 1.2rem;">✏️</span>
        <span style="font-weight: 800; font-size: 0.88rem; color: #0369A1; text-transform: uppercase;">Supported Option: Trace or copy two words from the Word Bank.</span>
      </div>

      <div class="penmanship-block">
        <div class="penmanship-line penmanship-top"></div>
        <div class="penmanship-line penmanship-mid"></div>
        <div class="penmanship-line penmanship-base"></div>
      </div>
      <div class="penmanship-block">
        <div class="penmanship-line penmanship-top"></div>
        <div class="penmanship-line penmanship-mid"></div>
        <div class="penmanship-line penmanship-base"></div>
      </div>
    </div>

    <!-- Motivational Footer -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
      <div class="fresh-basket-tag">💬 Communicative Scaffolding</div>
      <div style="font-family: 'Fredoka', cursive; font-size: 0.85rem; color: #64748B;">Page 4 • AOA Stage 3: Guided Dialogue</div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PAGE 5: STAGE 4 - ACTION PRODUCTION TASK                                  -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="market-awning">
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div>
    </div>

    <div class="header-pills">
      <div class="pill-badge pill-orange">Stage 4 • Production</div>
      <div class="pill-badge pill-blue">Grade 4 • A1.2</div>
      <div class="pill-badge pill-green">Action Deliverable</div>
    </div>

    <div class="page-title" style="margin-bottom: 4px;">My Action Project Report</div>
    <div style="text-align: center; font-size: 1.05rem; font-weight: 700; color: #475569; margin-bottom: 12px;">
      Complete the three statements and draw each scene in the box!
    </div>
"""

    colors_badge = ["#E76F51", "#2A9D8F", "#457B9D"]
    for idx, p_prompt in enumerate(s_data["prod_items"][:3]):
        html += f"""    <div class="production-card">
      <div class="item-num-badge" style="background: {colors_badge[idx]};">{idx+1}</div>
      <div style="flex: 1;">
        <div style="font-family: 'Fredoka', cursive; font-size: 1.25rem; font-weight: 600; color: #1D3557; margin-bottom: 4px;">
          {p_prompt}
        </div>
        <div class="penmanship-block" style="height: 38px;">
          <div class="penmanship-line penmanship-top"></div>
          <div class="penmanship-line penmanship-mid"></div>
          <div class="penmanship-line penmanship-base"></div>
        </div>
      </div>
      <div class="item-draw-box">
        <span style="font-size: 1.4rem;">🎨</span>
        <span>Draw it!</span>
      </div>
    </div>\n"""

    html += f"""    <!-- Challenge Box -->
    <div style="background: #FEF3C7; border: 2px solid #F59E0B; border-radius: 16px; padding: 12px 16px; margin-top: 6px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 1.3rem;">⭐</span>
        <span style="font-family: 'Fredoka', cursive; font-size: 1rem; font-weight: 700; color: #92400E;">
          Challenge: {s_data['challenge']}
        </span>
      </div>
    </div>

    <!-- Motivational Footer -->
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
      <div class="fresh-basket-tag">🚀 Functional Deliverable</div>
      <div style="font-family: 'Fredoka', cursive; font-size: 0.85rem; color: #64748B;">Page 5 • AOA Stage 4: Action Production Task</div>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PAGE 6: STAGE 5 & 6 - ASSESSMENT, REFLECTION & HOMEWORK                    -->
  <!-- ========================================================================= -->
  <div class="page">
    <div class="market-awning">
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div><div class="awning-stripe"></div><div class="awning-stripe"></div>
      <div class="awning-stripe"></div>
    </div>

    <div class="header-pills">
      <div class="pill-badge pill-green">Stage 5 & 6 • Reflection</div>
      <div class="pill-badge pill-blue">Grade 4 • A1.2</div>
      <div class="pill-badge pill-orange">Can-Do Check</div>
    </div>

    <div class="page-title">Check, Reflect & Homework</div>

    <!-- Self-Check Table -->
    <div style="border: 2px solid #E2E8F0; border-radius: 18px; background: white; padding: 14px 18px; margin-bottom: 12px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
        <span class="section-banner" style="margin-bottom: 0;">✓ Self-Check</span>
      </div>

      <table class="check-table">
        <thead>
          <tr>
            <th style="width: 60%;">I can...</th>
            <th style="width: 13%;">Yes</th>
            <th style="width: 13%;">A little</th>
            <th style="width: 14%;">Not yet</th>
          </tr>
        </thead>
        <tbody>
"""

    for sc_q in s_data["self_check"]:
        html += f"""          <tr>
            <td>{sc_q}</td>
            <td><div class="checkbox-box"></div></td>
            <td><div class="checkbox-box"></div></td>
            <td><div class="checkbox-box"></div></td>
          </tr>\n"""

    html += f"""        </tbody>
      </table>
    </div>

    <!-- Student Metacognition Reflection -->
    <div class="reflection-card">
      <div style="font-family: 'Fredoka', cursive; font-size: 1.1rem; font-weight: 700; color: #1E3A8A; margin-bottom: 8px;">
        ☁️ Reflection (Metacognition)
      </div>

      <div class="reflection-q">What was easy to do in English today?</div>
      <div class="simple-line"></div>
      <div class="simple-line"></div>

      <div class="reflection-q" style="margin-top: 8px;">What word or sentence was challenging?</div>
      <div class="simple-line"></div>
      <div class="simple-line"></div>
    </div>

    <!-- Homework -->
    <div class="homework-box">
      <span style="font-size: 1.6rem;">📋</span>
      <div>
        <div style="font-family: 'Fredoka', cursive; font-size: 1rem; font-weight: 700; color: #92400E;">
          Homework: {s_data['homework']}
        </div>
      </div>
    </div>

    <!-- Final Mission Footer Banner -->
    <div class="mission-footer" style="margin-top: 14px;">
      <span>🚀 Mission accomplished! Next: Lesson {min(5, lesson_num+1)}</span>
      <span style="background: white; color: #1D3557; padding: 4px 14px; border-radius: 20px; font-size: 0.95rem;">GOOD JOB! 🎉</span>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PAGE 7: TEACHER GUIDE - SCRIPTS & PACING (PÁGINA 1 DEL DOCENTE)            -->
  <!-- ========================================================================= -->
  <div class="page" style="background: #FFFFFF;">
    <div style="border-bottom: 3px solid #1E293B; padding-bottom: 8px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: baseline;">
      <div>
        <div style="font-size: 0.78rem; font-weight: 800; color: #4338CA; text-transform: uppercase; letter-spacing: 0.5px;">TEACHER FACILITATOR GUIDE · PAGE 1</div>
        <div style="font-family: 'Fredoka', cursive; font-size: 1.35rem; color: #1E293B; font-weight: 700;">
          Scenario {scenario_num}: {s_name} · Lesson #{lesson_num} ({skill_info['name']})
        </div>
      </div>
      <div style="text-align: right;">
        <span style="background: #ECFDF5; color: #047857; font-weight: 800; font-size: 0.75rem; padding: 4px 10px; border-radius: 20px; border: 1px solid #A7F3D0;">MEDUCA Official AOA</span>
      </div>
    </div>

    <!-- Pacing Table -->
    <div class="teacher-section-title">⏱️ Lesson Pacing & Time Allocation (45-50 minutes)</div>
    <table class="teacher-table">
      <thead>
        <tr>
          <th>Stage</th>
          <th>Activity Name</th>
          <th>Time</th>
          <th>Pedagogical Goal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Stage 1: Warm-up</b></td>
          <td>Realia & Vocab Hook</td>
          <td><b>7 min</b></td>
          <td>Activate prior knowledge with visual vocabulary and penmanship modeling.</td>
        </tr>
        <tr>
          <td><b>Stage 2: Presentation</b></td>
          <td>Authentic Dialogue Model</td>
          <td><b>10 min</b></td>
          <td>Provide comprehensible input in authentic Panamanian context ({s_name}).</td>
        </tr>
        <tr>
          <td><b>Stage 3: Practice</b></td>
          <td>Randomized Match & Dialogue</td>
          <td><b>15 min</b></td>
          <td>Controlled spelling practice and guided scaffolding with differentiated options.</td>
        </tr>
        <tr>
          <td><b>Stage 4: Production</b></td>
          <td>Action Project Deliverable</td>
          <td><b>12 min</b></td>
          <td>Independent student action: write 3 sentences and draw concrete outcomes.</td>
        </tr>
        <tr>
          <td><b>Stage 5 & 6: Reflection</b></td>
          <td>Self-Check & Metacognition</td>
          <td><b>6 min</b></td>
          <td>Formative Can-Do self-assessment, reflection prompt, and homework assignment.</td>
        </tr>
      </tbody>
    </table>

    <!-- Verbatim Teacher Scripts -->
    <div class="teacher-section-title" style="margin-top: 10px;">🎙️ Verbatim Teacher Read-Aloud Scripts & Prompts</div>
    
    <div class="script-box">
      <div class="script-stage">Stage 1 · Warm-Up Script (Say to class):</div>
      <p style="margin-top: 2px;">"Good morning class! Look at these six cards on page 1. Point to the <b>{s_data['items'][0]['word']}</b>. Now point to the <b>{s_data['items'][1]['word']}</b>. Repeat after me with enthusiastic voice: '{s_data['items'][0]['word']}'! Great! Now open your pencils and copy the word neatly inside the handwriting guidelines."</p>
      <p style="color: #059669; font-weight: 700; margin-top: 3px;">Expected Student Action: Students point to target illustrations and trace letters between solid and dashed lines.</p>
    </div>

    <div class="script-box">
      <div class="script-stage">Stage 2 · Presentation Script (Comprehensible Input):</div>
      <p style="margin-top: 2px;">"Listen carefully to Carlos and Sofía on page 2. Carlos asks: '{s_data['dialogue'][0]['text']}'. Sofía responds with emotion: '{s_data['dialogue'][1]['text']}'. Who can tell me: what is her favorite place? Yes, the {s_data['items'][0]['word']}! Let's read the target sentence together: <i>'{s_data['model_sentence']}'</i>."</p>
      <p style="color: #059669; font-weight: 700; margin-top: 3px;">Expected Student Action: Choral reading and finger-tracing along the ghost text sentence.</p>
    </div>

    <div class="script-box">
      <div class="script-stage">Stage 3 · Controlled Practice (Random Matching Cue):</div>
      <p style="margin-top: 2px;">"Turn to page 3! Attention: The words on the right side are in a random order! Look at image number 1. Find the exact matching word on the right column and draw a straight line to connect them. Do not guess; check every letter!"</p>
      <p style="color: #059669; font-weight: 700; margin-top: 3px;">Expected Student Action: Individual matching of pictures to words and filling in missing vowels.</p>
    </div>

    <!-- Footer -->
    <div style="margin-top: auto; border-top: 1px solid #CBD5E1; padding-top: 8px; display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748B;">
      <span>EduGen Panama PRO · Action-Oriented Approach Curriculum System</span>
      <span>Page 7 · Teacher Guide 1</span>
    </div>
  </div>


  <!-- ========================================================================= -->
  <!-- PAGE 8: TEACHER GUIDE - ANSWER KEY & RUBRICS (PÁGINA 2 DEL DOCENTE)        -->
  <!-- ========================================================================= -->
  <div class="page" style="background: #FFFFFF;">
    <div style="border-bottom: 3px solid #1E293B; padding-bottom: 8px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: baseline;">
      <div>
        <div style="font-size: 0.78rem; font-weight: 800; color: #4338CA; text-transform: uppercase; letter-spacing: 0.5px;">TEACHER FACILITATOR GUIDE · PAGE 2</div>
        <div style="font-family: 'Fredoka', cursive; font-size: 1.35rem; color: #1E293B; font-weight: 700;">
          Answer Key & Formative Rubrics · Scenario {scenario_num}
        </div>
      </div>
      <div style="text-align: right;">
        <span style="background: #EFF6FF; color: #1D4ED8; font-weight: 800; font-size: 0.75rem; padding: 4px 10px; border-radius: 20px; border: 1px solid #BFDBFE;">Assessment Instrument</span>
      </div>
    </div>

    <!-- Specific Answer Key -->
    <div class="teacher-section-title">🔑 Specific Answer Key (Solutions)</div>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 14px;">
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px;">
        <div style="font-weight: 800; color: #0F172A; font-size: 0.85rem; margin-bottom: 4px;">Page 3 · Randomized Matching:</div>
        <ul style="padding-left: 18px; font-size: 0.82rem; color: #334155; line-height: 1.5;">
          <li><b>Image 1 ({match_base[0]['word']}):</b> Connects to word "<b>{match_base[0]['word']}</b>"</li>
          <li><b>Image 2 ({match_base[1]['word']}):</b> Connects to word "<b>{match_base[1]['word']}</b>"</li>
          <li><b>Image 3 ({match_base[2]['word']}):</b> Connects to word "<b>{match_base[2]['word']}</b>"</li>
          <li><b>Image 4 ({match_base[3]['word']}):</b> Connects to word "<b>{match_base[3]['word']}</b>"</li>
        </ul>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px;">
        <div style="font-weight: 800; color: #0F172A; font-size: 0.85rem; margin-bottom: 4px;">Page 3 · Missing Letters:</div>
        <ul style="padding-left: 18px; font-size: 0.82rem; color: #334155; line-height: 1.5;">
          <li>1. Complete: <b>{s_data['items'][0]['word'].upper()}</b></li>
          <li>2. Complete: <b>{s_data['items'][1]['word'].upper()}</b></li>
          <li>3. Complete: <b>{s_data['items'][2]['word'].upper()}</b></li>
          <li>4. Complete: <b>{s_data['items'][3]['word'].upper()}</b></li>
        </ul>
      </div>
    </div>

    <!-- Official MEDUCA 4-Criteria Rubric -->
    <div class="teacher-section-title">📊 Official MEDUCA Formative Rubric (Grade 4 · A1.2)</div>
    <table class="teacher-table" style="font-size: 0.8rem;">
      <thead>
        <tr>
          <th style="width: 25%;">Criteria</th>
          <th style="width: 25%;">3 · Exemplary (A)</th>
          <th style="width: 25%;">2 · Satisfactory (B)</th>
          <th style="width: 25%;">1 · In Progress (C)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>1. Target Vocabulary</b></td>
          <td>Accurate spelling of 4+ scenario items without visual aids.</td>
          <td>Spells 2-3 items correctly with minor phonological slips.</td>
          <td>Requires constant word bank assistance to identify items.</td>
        </tr>
        <tr>
          <td><b>2. Sentence Structure</b></td>
          <td>Uses full subject-verb-predicate structures and connectives (e.g., <i>because</i>).</td>
          <td>Uses simple sentences with occasional missing period or capital start.</td>
          <td>Writes isolated words or fragments without predicate.</td>
        </tr>
        <tr>
          <td><b>3. Action Task Completion</b></td>
          <td>Completes all 3 report statements and detailed drawings.</td>
          <td>Completes 2 statements and basic drawings.</td>
          <td>Completes 1 statement with teacher scaffolding.</td>
        </tr>
        <tr>
          <td><b>4. Communicative Interaction</b></td>
          <td>Participates actively in partner challenge with clear pronunciation.</td>
          <td>Answers peer questions with short responses.</td>
          <td>Relies on gestures or Spanish translation to interact.</td>
        </tr>
      </tbody>
    </table>

    <!-- 21st Century Skills Integration Note -->
    <div style="background: #FEF3C7; border: 1.5px solid #F59E0B; border-radius: 12px; padding: 10px 14px; margin-top: 10px;">
      <div style="font-weight: 800; color: #92400E; font-size: 0.85rem; margin-bottom: 2px;">🤝 21st Century Skill Integration:</div>
      <p style="font-size: 0.8rem; color: #78350F; line-height: 1.4;">
        For Lesson 5 (Mediation), connect the student deliverables to the scenario project: <b>{scenario_info.get('communicativeCompetences', {}).get('linguistic', {}).get('project21stCentury', 'Collaborative Classroom Exhibition')}</b>. Students share their drawings in trios, mediating meaning and explaining their preferences respectfully.
      </p>
    </div>

    <!-- Footer -->
    <div style="margin-top: auto; border-top: 1px solid #CBD5E1; padding-top: 8px; display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748B;">
      <span>EduGen Panama PRO · Action-Oriented Approach Curriculum System</span>
      <span>Page 8 · Teacher Guide 2</span>
    </div>
  </div>

</body>
</html>
"""
    return html

def compile_pdf_from_html(html_path, pdf_path):
    html_url = f"file:///{html_path.replace(os.sep, '/')}"
    cmd = [
        EDGE_EXE,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        html_url
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_path) and os.path.getsize(pdf_path) > 10000:
        return True, os.path.getsize(pdf_path)
    return False, res.stderr

def run_batch_grade4(scenarios_list=range(1, 9), themes_list=[1, 2], lessons_list=[1, 2, 3, 4, 5]):
    with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
        curr = json.load(f)
    
    scenarios_dict = {s["scenarioNum"]: s for s in curr["scenarios"]}
    results = []

    for s_num in scenarios_list:
        s_info = scenarios_dict.get(s_num)
        if not s_info:
            continue
        for t_num in themes_list:
            for l_num in lessons_list:
                prefix = f"Grade_4_Scenario_{s_num}_Theme_{t_num}_Lesson_{l_num}_{SKILL_CONFIG[l_num]['name']}"
                html_path = os.path.join(PUBLIC_DIR, f"{prefix}_Packet.html")
                pdf_path = os.path.join(PUBLIC_DIR, f"{prefix}_Packet.pdf")
                
                print(f"Generating HTML: Scenario {s_num}, Theme {t_num}, Lesson {l_num} ({SKILL_CONFIG[l_num]['name']})...")
                html_content = render_html_packet(s_num, t_num, l_num, s_info)
                with open(html_path, "w", encoding="utf-8") as f:
                    f.write(html_content)
                
                print(f"Compiling PDF: {pdf_path}...")
                ok, detail = compile_pdf_from_html(html_path, pdf_path)
                if ok:
                    print(f"[OK] SUCCESS: {pdf_path} ({detail} bytes)")
                    results.append({"status": "ok", "pdf": pdf_path, "size": detail})
                else:
                    print(f"[ERR] ERROR: {detail}")
                    results.append({"status": "err", "pdf": pdf_path, "detail": detail})
    
    return results

if __name__ == "__main__":
    import sys
    # If arguments provided, run specific scenario/theme/lesson
    if len(sys.argv) > 1:
        s = int(sys.argv[1])
        t = int(sys.argv[2]) if len(sys.argv) > 2 else 1
        l = int(sys.argv[3]) if len(sys.argv) > 3 else 4
        run_batch_grade4([s], [t], [l])
    else:
        # Default test run: Scenario 1, Theme 1, Lesson 4
        run_batch_grade4([1], [1], [4])
