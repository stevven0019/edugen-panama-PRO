const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 38291;
const BASE_DIR = path.join(__dirname, '..', 'lesson plannings');

const GRADE_MAP = {
  'Pre-K': 'Prekinder',
  'Prekinder': 'Prekinder',
  'Kinder': 'Kinder',
  '1st Grade': '1st Grade',
  '2nd Grade': '2nd Grade',
  '3rd Grade': '3rd Grade',
  '4th Grade': '4th Grade',
  '5th Grade': '5th Grade',
  '6th Grade': '6th Grade',
  '7th Grade': '7th Grade',
  '8th Grade': '8th Grade',
  '9th Grade': '9th Grade',
  '10th Grade': '10th Grade',
  '11th Grade': '11th Grade',
  '12th Grade': '12th Grade'
};

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        let payload = body;
        if (body.startsWith('data=')) {
          payload = decodeURIComponent(body.slice(5).replace(/\+/g, ' '));
        }
        const plans = JSON.parse(payload);
        const saved = [];

        for (const plan of plans) {
          const rawGrade = plan.grade || 'Prekinder';
          const targetGradeDir = GRADE_MAP[rawGrade] || rawGrade;
          const gradePath = path.join(BASE_DIR, targetGradeDir);
          fs.mkdirSync(gradePath, { recursive: true });

          let safeTitle = (plan.title || `Plan_${plan.id || Date.now()}`)
            .replace(/[<>:"/\\|?*]/g, '_')
            .trim();
          if (!safeTitle.toLowerCase().endsWith('.doc')) {
            safeTitle += '.doc';
          }

          const filePath = path.join(gradePath, safeTitle);
          const content = '\ufeff' + (plan.content || '');
          fs.writeFileSync(filePath, content, 'utf8');
          saved.push({ grade: targetGradeDir, file: safeTitle, path: filePath });
        }

        console.log(`Successfully saved ${saved.length} plans:`, saved.map(s => s.file));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, saved }));
      } catch (err) {
        console.error('Error saving plans:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Plan receiver server listening on http://127.0.0.1:${PORT}`);
});
