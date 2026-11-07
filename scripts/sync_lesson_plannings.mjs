import fs from 'fs';
import path from 'path';

const srcRoot = path.resolve('lesson plannings');
const dstRoot = path.resolve('public/lesson_plannings');

function sanitize(name) {
  return name.replace(/[\\/:*?"<>|]/g, '').trim().replace(/\.+$/, '');
}

let count = 0;
const manifest = {};

function copyDir(src, dst, relParts = []) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
  const entries = fs.readdirSync('\\\\?\\' + src, { withFileTypes: true });
  for (const ent of entries) {
    const sName = ent.name;
    const cleanName = sanitize(sName);
    const sPath = path.join(src, sName);
    const dPath = path.join(dst, cleanName);
    if (ent.isDirectory()) {
      copyDir(sPath, dPath, [...relParts, cleanName]);
    } else if (ent.isFile() && sName.endsWith('.doc')) {
      fs.copyFileSync('\\\\?\\' + sPath, dPath);
      count++;
      const key = relParts.join('/');
      if (!manifest[key]) manifest[key] = [];
      manifest[key].push({
        filename: cleanName,
        url: `/lesson_plannings/${relParts.map(encodeURIComponent).join('/')}/${encodeURIComponent(cleanName)}`
      });
    }
  }
}

try {
  copyDir(srcRoot, dstRoot);
  fs.writeFileSync('public/lesson_plannings_manifest.json', JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✅ Sincronizados y saneados ${count} Lesson Planners en public/lesson_plannings`);
  console.log(`✅ Manifiesto generado en public/lesson_plannings_manifest.json`);
} catch (e) {
  console.error('Error durante copia:', e);
}

