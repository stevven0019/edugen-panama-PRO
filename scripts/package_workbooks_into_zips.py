import os
import sys
import zipfile
import time

def main():
    base_dir = os.path.join(os.getcwd(), 'public', 'generated_activity_pdfs')
    out_dir = os.path.join(os.getcwd(), 'release_zips')
    os.makedirs(out_dir, exist_ok=True)

    grades = [
        'Grade_PreK',
        'Grade_Kinder',
        'Grade_01',
        'Grade_02',
        'Grade_03',
        'Grade_04',
        'Grade_05',
        'Grade_06',
        'Grade_07',
        'Grade_08',
        'Grade_09',
        'Grade_10',
        'Grade_11',
        'Grade_12',
    ]

    print(f"Iniciando empaquetado de {len(grades)} grados en: {out_dir}")
    start_total = time.time()

    summary = []

    for idx, grade in enumerate(grades, 1):
        grade_path = os.path.join(base_dir, grade)
        if not os.path.exists(grade_path):
            print(f"[{idx}/{len(grades)}] ADVERTENCIA: {grade_path} no existe.")
            continue

        zip_name = f"{grade}_Workbooks_AOA.zip"
        zip_path = os.path.join(out_dir, zip_name)

        t0 = time.time()
        file_count = 0

        with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
            for root, dirs, files in os.walk(grade_path):
                for f in files:
                    if f.endswith('.pdf'):
                        full_f = os.path.join(root, f)
                        # Relative path inside the zip file
                        rel_in_zip = os.path.relpath(full_f, base_dir)
                        zf.write(full_f, rel_in_zip)
                        file_count += 1

        size_mb = os.path.getsize(zip_path) / (1024 * 1024)
        elapsed = time.time() - t0
        print(f"[{idx:02d}/{len(grades)}] {zip_name}: {file_count} PDFs -> {size_mb:.1f} MB ({elapsed:.1f}s)")
        summary.append({
            'grade': grade,
            'zipName': zip_name,
            'zipPath': zip_path,
            'files': file_count,
            'sizeMB': round(size_mb, 1)
        })

    total_time = time.time() - start_total
    total_mb = sum(s['sizeMB'] for s in summary)
    print("\n--- RESUMEN FINAL ---")
    print(f"Total archivos ZIP creados: {len(summary)}")
    print(f"Tamaño total comprimido: {total_mb:.1f} MB (vs ~3900 MB original)")
    print(f"Tiempo total: {total_time:.1f}s")

if __name__ == '__main__':
    main()
