import pypdfium2 as pdfium
import os
import shutil

p1_path = 'canva_g4_s5_p1.pdf'
p2_path = 'canva_g4_s5_p2.pdf'
out_path = 'public/workbooks_listening_7pages/Grade_4/MEDUCA_4th_Grade_Scenario_5_Listening_AOA_Workbook.pdf'
os.makedirs(os.path.dirname(out_path), exist_ok=True)

pdf1 = pdfium.PdfDocument(p1_path)
pdf2 = pdfium.PdfDocument(p2_path)

merged = pdfium.PdfDocument.new()

# Extract 3 pages from Part 1
for i in range(min(3, len(pdf1))):
    merged.import_pages(pdf1, [i])

# Extract 4 pages from Part 2
for i in range(min(4, len(pdf2))):
    merged.import_pages(pdf2, [i])

# Pad to 7 pages if needed
while len(merged) < 7 and len(pdf2) > 0:
    merged.import_pages(pdf2, [len(pdf2) - 1])

merged.save(out_path)
print(f"Generated 7-page PDF: {out_path} with {len(merged)} pages")

# Render page images for conversation artifacts
artifact_dir = r"C:\Users\esteb\.gemini\antigravity\brain\b7db3350-c728-4a0f-9838-dd291f2cba40"
final_doc = pdfium.PdfDocument(out_path)
for i, page in enumerate(final_doc):
    img = page.render(scale=2.0).to_pil()
    img_name = f"canva_official_g4_s5_p{i+1}.png"
    img.save(os.path.join(artifact_dir, img_name))

# Mirror to Google Drive
drive_dir = r"H:\Mi unidad\workbooks_listening_7pages\Grade_4"
if os.path.exists(r"H:\Mi unidad"):
    os.makedirs(drive_dir, exist_ok=True)
    drive_out = os.path.join(drive_dir, os.path.basename(out_path))
    shutil.copy2(out_path, drive_out)
    print(f"Mirrored to Google Drive: {drive_out}")

