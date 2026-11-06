import json
import os

curr_path = os.path.join("dist", "curriculums", "English_Curriculum_Kinder.json")
with open(curr_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Grade: {data.get('grade')}, Level: {data.get('proficiency_level')}")
scenarios = data.get("scenarios", [])
print(f"Total scenarios: {len(scenarios)}\n")

for sc in scenarios:
    sc_num = sc.get("scenario_number") or sc.get("id")
    title = sc.get("scenario_title") or sc.get("title")
    raw_themes = sc.get("themes", [])
    theme_names = []
    for t in raw_themes:
        if isinstance(t, str):
            theme_names.append(t)
        elif isinstance(t, dict):
            theme_names.append(t.get("theme_title") or t.get("title"))
    
    stds = sc.get("standards_and_learning_outcomes", {})
    skills_present = list(stds.keys())
    cc = sc.get("communicative_competences", {})
    ling = cc.get("linguistic_competences", {})
    vocab = ling.get("recommended_vocabulary", {})
    nouns = vocab.get("nouns", "") if isinstance(vocab, dict) else ""
    projects = cc.get("assessment_ideas", {}).get("twenty_first_century_projects", [])
    
    print(f"Scenario {sc_num}: {title}")
    print(f"  Themes ({len(theme_names)}): {theme_names}")
    print(f"  Skills: {skills_present}")
    print(f"  Nouns: {nouns[:60]}...")
    print(f"  Projects ({len(projects)}): {[p.get('title') for p in projects]}")
    print("-" * 60)
