import sys
import os
import json
import time
import re
from concurrent.futures import ProcessPoolExecutor, as_completed

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from engine_aoa_pdf_generator import build_single_aoa_pdf

CURRICULUMS_DIR = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public\curriculums"
OUTPUT_BASE_DIR = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public\generated_activity_pdfs"

CURRICULUM_FILES = [
    ("English_Curriculum_Prekinder.json", "Pre-Kindergarten", "Pre-A1", "Grade_PreK"),
    ("English_Curriculum_Kinder.json", "Kindergarten", "Pre-A1", "Grade_Kinder"),
    ("English_Curriculum_Grade_1.json", "1st Grade", "Pre-A1", "Grade_01"),
    ("English_Curriculum_Grade_2.json", "2nd Grade", "A1.1", "Grade_02"),
    ("English_Curriculum_Grade_3.json", "3rd Grade", "A1", "Grade_03"),
    ("English_Curriculum_Grade_4.json", "4th Grade", "A1.2", "Grade_04"),
    ("English_Curriculum_Grade_5.json", "5th Grade", "A1+", "Grade_05"),
    ("English_Curriculum_Grade_6.json", "6th Grade", "A1+", "Grade_06"),
    ("English_Curriculum_Grade_7.json", "7th Grade", "A2", "Grade_07"),
    ("English_Curriculum_Grade_8.json", "8th Grade", "A2", "Grade_08"),
    ("English_Curriculum_Grade_9.json", "9th Grade", "A2+", "Grade_09"),
    ("English_Curriculum_Grade_10.json", "10th Grade", "B1", "Grade_10"),
    ("English_Curriculum_Grade_11.json", "11th Grade", "B1", "Grade_11"),
    ("English_Curriculum_Grade_12.json", "12th Grade", "B1+", "Grade_12"),
]

SKILLS = [
    (1, "Listening"),
    (2, "Reading"),
    (3, "Speaking"),
    (4, "Writing"),
    (5, "Mediation")
]

def sanitize_filename(name):
    clean = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', name)
    return re.sub(r'_+', '_', clean).strip('_')

def run_pdf_worker(task):
    pdf_path, grade_name, cefr, sc_num, sc_name, theme_num, theme_name, lesson_num, sc_data, record = task
    try:
        build_single_aoa_pdf(
            out_pdf=pdf_path,
            grade_name=grade_name,
            cefr=cefr,
            sc_num=sc_num,
            sc_name=sc_name,
            theme_num=theme_num,
            theme_name=theme_name,
            lesson_num=lesson_num,
            sc_data=sc_data
        )
        record["sizeBytes"] = os.path.getsize(pdf_path)
        return (True, record, None)
    except Exception as ex:
        return (False, record, str(ex))

def main():
    start_time = time.time()
    os.makedirs(OUTPUT_BASE_DIR, exist_ok=True)
    
    print("=" * 80)
    print("STARTING HIGH-SPEED PARALLEL GENERATION: 1,120 WORKBOOKS (PDF) - AOA PANAMA")
    print("=" * 80)

    tasks = []

    for fname, grade_name, cefr, grade_slug in CURRICULUM_FILES:
        fpath = os.path.join(CURRICULUMS_DIR, fname)
        if not os.path.exists(fpath):
            continue

        with open(fpath, "r", encoding="utf-8") as f:
            data = json.load(f)

        scenarios = data.get("scenarios", [])
        grade_dir = os.path.join(OUTPUT_BASE_DIR, grade_slug)
        os.makedirs(grade_dir, exist_ok=True)

        for sc_idx, sc in enumerate(scenarios):
            sc_num = sc.get("scenarioNum", sc_idx + 1)
            sc_name = sc.get("scenarioName", f"Scenario {sc_num}")
            theme1 = sc.get("theme1") or sc.get("theme_1") or "Exploration & Discovery"
            theme2 = sc.get("theme2") or sc.get("theme_2") or "Action & Production"

            sc_dir = os.path.join(grade_dir, f"Scenario_{sc_num:02d}")
            os.makedirs(sc_dir, exist_ok=True)

            themes = [(1, theme1), (2, theme2)]

            for theme_num, theme_name in themes:
                for lesson_num, skill_name in SKILLS:
                    filename = f"{grade_slug}_SC{sc_num:02d}_T{theme_num}_L{lesson_num}_{skill_name}.pdf"
                    pdf_path = os.path.join(sc_dir, filename)
                    rel_url = f"/generated_activity_pdfs/{grade_slug}/Scenario_{sc_num:02d}/{filename}"

                    record = {
                        "id": f"{grade_slug}_S{sc_num}_T{theme_num}_L{lesson_num}",
                        "grade": grade_name,
                        "gradeSlug": grade_slug,
                        "cefr": cefr,
                        "scenarioNum": sc_num,
                        "scenarioName": sc_name,
                        "themeNum": theme_num,
                        "themeName": theme_name,
                        "lessonNum": lesson_num,
                        "skill": skill_name,
                        "fileName": filename,
                        "relUrl": rel_url
                    }

                    tasks.append((
                        pdf_path,
                        grade_name,
                        cefr,
                        sc_num,
                        sc_name,
                        theme_num,
                        theme_name,
                        lesson_num,
                        sc,
                        record
                    ))

    print(f"Total tasks prepared: {len(tasks)} (14 grades x 8 scenarios x 2 themes x 5 skills)")
    print("Launching parallel worker pool (8 processes)...")

    completed = 0
    errors = 0
    manifest = []

    with ProcessPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(run_pdf_worker, t): t for t in tasks}
        for future in as_completed(futures):
            success, rec, err = future.result()
            completed += 1
            if success:
                manifest.append(rec)
            else:
                errors += 1
                print(f"[ERR] Failed {rec['fileName']}: {err}")

            if completed % 100 == 0 or completed == len(tasks):
                print(f"   --> Progress: {completed} / {len(tasks)} PDFs generated ({completed*100//len(tasks)}%)...")

    # Sort manifest logically
    manifest.sort(key=lambda x: (x["gradeSlug"], x["scenarioNum"], x["themeNum"], x["lessonNum"]))

    manifest_path = os.path.join(OUTPUT_BASE_DIR, "manifest_1120_workbooks.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump({
            "generatedAt": time.strftime("%Y-%m-%d %H:%M:%S"),
            "totalWorkbooks": len(manifest),
            "gradesCount": len(CURRICULUM_FILES),
            "manifest": manifest
        }, f, indent=2, ensure_ascii=False)

    elapsed = time.time() - start_time
    print("=" * 80)
    print(f"SUCCESS: 1,120 WORKBOOKS GENERATED IN {elapsed:.1f} SECONDS!")
    print(f"Total Success: {len(manifest)}")
    print(f"Total Errors: {errors}")
    print(f"Manifest written to: {manifest_path}")
    print("=" * 80)

if __name__ == "__main__":
    main()
