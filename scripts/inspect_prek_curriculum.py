import json
import os

curr_path = os.path.join("dist", "curriculums", "English_Curriculum_Prekinder.json")
with open(curr_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Grade: {data.get('grade')}, Proficiency: {data.get('proficiency_level')}")
print(f"Total scenarios: {len(data.get('scenarios', []))}\n")

for sc in data.get("scenarios", []):
    sc_id = sc.get("id")
    title = sc.get("title")
    themes = sc.get("themes", [])
    skills_present = [k for k in ["listening", "reading", "speaking", "writing", "mediation"] if k in sc]
    vocab = sc.get("recommended_vocabulary", {})
    nouns = vocab.get("nouns", "") if isinstance(vocab, dict) else ""
    projects = sc.get("projects", [])
    print(f"Scenario {sc_id}: {title}")
    print(f"  Themes ({len(themes)}): {themes}")
    print(f"  Skills: {skills_present}")
    print(f"  Nouns: {nouns[:60]}...")
    print(f"  Projects ({len(projects)}): {[p.get('title') for p in projects]}")
    print("-" * 60)
