import json
import os

curr_path = os.path.join("dist", "curriculums", "English_Curriculum_Grade_2.json")
with open(curr_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total scenarios in Grade 2: {len(data.get('scenarios', []))}\n")

for sc in data.get("scenarios", []):
    sc_num = sc.get("scenario_number")
    title = sc.get("title")
    raw_themes = sc.get("themes", [])
    themes = []
    for t in raw_themes:
        if isinstance(t, str):
            themes.append(t)
        elif isinstance(t, dict):
            themes.append(t.get("theme_title") or t.get("title"))
            
    proj_box = sc.get("century_21_project_ideas", {})
    projects = proj_box.get("projects", []) if isinstance(proj_box, dict) else []
    proj_titles = [p.get("title") for p in projects]
    
    stds = sc.get("standards_and_learning_outcomes", [])
    skills = [s.get("skill") for s in stds]
    
    print(f"Scenario {sc_num}: {title}")
    print(f"  Themes ({len(themes)}): {themes}")
    print(f"  Skills: {skills}")
    print(f"  Projects ({len(proj_titles)}): {proj_titles}")
    print("-" * 60)
