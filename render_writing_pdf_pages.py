import fitz # PyMuPDF
import os

pdf_path = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\Student_Writing_Lab_4thGrade_Shopping_Market.pdf"
out_dir = r"C:\Users\esteb\.gemini\antigravity\scratch\edugen-panama-saas\public"

doc = fitz.open(pdf_path)
print(f"Total pages in PDF: {len(doc)}")

for i, page in enumerate(doc):
    pix = page.get_pixmap(dpi=150)
    out_file = os.path.join(out_dir, f"market_writing_page_{i+1}.png")
    pix.save(out_file)
    print(f"Saved page {i+1} to {out_file} (size: {os.path.getsize(out_file)} bytes)")
