# -*- coding: utf-8 -*-
"""
EduGen Panama - Scenario 1 Theme 1 Master Compiler (5 Skills Prototype)
Grade 4 • CEFR Level: Beginner A1.2
Curriculum: Scenario 1 "A Walk in the Neighborhood" • Theme 1: "This Is My Favorite."
"""

import os
import sys
from prototype_shared import PUBLIC_DIR, compile_pdf
from lesson1_listening import generate_lesson1_listening
from lesson2_reading import generate_lesson2_reading
from lesson3_speaking import generate_lesson3_speaking
from lesson4_writing import generate_lesson4_writing
from lesson5_mediation import generate_lesson5_mediation

def main():
    print("=" * 70)
    print("EDUGEN PANAMA • GRADE 4 PROTOTYPE GENERATOR (SCENARIO 1 THEME 1)")
    print("Curriculum: Scenario 1 'A Walk in the Neighborhood' • Theme 1 'This Is My Favorite'")
    print("Target CEFR Level: Beginner A1.2 (Strictly Curated & Non-Repetitive)")
    print("=" * 70)

    lessons = [
        ("Lesson 1: Listening", generate_lesson1_listening, "Grade_4_Scenario_1_Theme_1_Lesson_1_Listening_Packet.pdf"),
        ("Lesson 2: Reading", generate_lesson2_reading, "Grade_4_Scenario_1_Theme_1_Lesson_2_Reading_Packet.pdf"),
        ("Lesson 3: Speaking", generate_lesson3_speaking, "Grade_4_Scenario_1_Theme_1_Lesson_3_Speaking_Packet.pdf"),
        ("Lesson 4: Writing", generate_lesson4_writing, "Grade_4_Scenario_1_Theme_1_Lesson_4_Writing_Packet.pdf"),
        ("Lesson 5: Mediation", generate_lesson5_mediation, "Grade_4_Scenario_1_Theme_1_Lesson_5_Mediation_Packet.pdf")
    ]

    results = []
    for title, gen_func, pdf_name in lessons:
        print(f"\n[1/2] Generating HTML for {title}...")
        html_file = gen_func()
        pdf_file = os.path.join(PUBLIC_DIR, pdf_name)
        print(f"[2/2] Compiling PDF for {title} via Headless Edge...")
        ok = compile_pdf(html_file, pdf_file)
        results.append((title, html_file, pdf_file, ok))

    print("\n" + "=" * 70)
    print("COMPILATION SUMMARY")
    print("=" * 70)
    all_ok = True
    for title, html_f, pdf_f, ok in results:
        status = "[OK]" if ok else "[FAIL]"
        size_kb = os.path.getsize(pdf_f) // 1024 if ok else 0
        print(f"{status} | {title:22} | {os.path.basename(pdf_f):60} ({size_kb} KB)")
        if not ok:
            all_ok = False

    if all_ok:
        print("\nALL 5 SKILL PROTOTYPES COMPILED SUCCESSFULLY INTO 8-PAGE PACKETS!")
    else:
        print("\nSOME PACKETS FAILED TO COMPILE.")

if __name__ == "__main__":
    main()
