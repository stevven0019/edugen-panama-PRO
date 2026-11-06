const fs = require('fs');
const path = require('path');

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed with status ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  console.log(`Saved: ${dest} (${buf.length} bytes)`);
}

async function run() {
  const [,, pngUrl, pdfUrl, grade, baseName] = process.argv;
  const dirPostes = path.join(process.cwd(), 'postes', grade);
  const dirPosters = path.join(process.cwd(), 'posters', grade);

  const pngPostes = path.join(dirPostes, `${baseName}.png`);
  const pdfPostes = path.join(dirPostes, `${baseName}.pdf`);
  const pngPosters = path.join(dirPosters, `${baseName}.png`);
  const pdfPosters = path.join(dirPosters, `${baseName}.pdf`);

  if (pngUrl) {
    await download(pngUrl, pngPostes);
    fs.copyFileSync(pngPostes, pngPosters);
  }
  if (pdfUrl) {
    await download(pdfUrl, pdfPostes);
    fs.copyFileSync(pdfPostes, pdfPosters);
  }
  console.log('Done downloading and syncing.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
