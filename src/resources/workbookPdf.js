import { jsPDF } from 'jspdf';
import { validatePack } from './activityPack.js';

export function buildWorkbook(pack) {
  validatePack(pack);
  const doc = new jsPDF();
  const isKinder = /kinder|pre-?k|early/i.test(pack.grade || '');

  const write = (value, x, y, width = 174, size = 11, lineSpacing = 0.44) => {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(value || ''), width);
    doc.text(lines, x, y);
    return y + lines.length * size * lineSpacing;
  };

  // ─────────────────────────────────────────────────────────────
  // MODERN 3-PAGE WORKBOOK BLUEPRINT RENDERER
  // ─────────────────────────────────────────────────────────────
  if (pack.page1 && pack.page2 && pack.page3) {
    const p1 = pack.page1;
    const p2 = pack.page2;
    const p3 = pack.page3;

    // ═══ PAGE 1: DISCOVERY & LINGUISTIC INPUT ═══
    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('REPÚBLICA DE PANAMÁ · MEDUCA · ENFOQUE ACCIONAL (AOA)', 18, 12);
    doc.text(`${(pack.grade || '4TH GRADE').toUpperCase()} · ${(pack.skill || 'ENGLISH').toUpperCase()}`, 192, 12, { align: 'right' });

    // Student Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(18, 15, 174, 13, 2, 2, 'FD');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text('STUDENT: ___________________________', 22, 23);
    doc.text('DATE: ____________', 98, 23);
    doc.text('SCORE: [     / 20 ]', 154, 23);

    // Title & Scenario
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    write(pack.title, 18, 36, 174, 14, 0.45);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Scenario: ${pack.scenario || pack.title}   |   Objective: ${pack.objective || 'Linguistic input and vocabulary comprehension.'}`, 18, 44);

    // Section 1: Vocabulary Word Bank
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('1. KEY VOCABULARY WORD BANK (Stage 1 Warm-up & Modeling)', 18, 52);

    const words = p1.wordBank || [];
    words.slice(0, 6).forEach((w, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const bx = 18 + col * 59;
      const by = 56 + row * 26;

      doc.setDrawColor(30, 41, 59);
      doc.setLineWidth(0.3);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(bx, by, 56, 23, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(w.word || 'Item', bx + 4, by + 7);

      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`(${w.pos || 'noun'})`, bx + 36, by + 7);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      write(`"${w.example || ''}"`, bx + 4, by + 12, 48, 7.5, 0.42);
    });

    // Section 2: Communicative Language Frame
    doc.setDrawColor(99, 102, 241);
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(18, 112, 174, 25, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(67, 56, 202);
    doc.text('COMMUNICATIVE LANGUAGE FRAME (Target Structure)', 22, 118);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Q: "${p1.languageFrame?.question || 'How much is the pineapple?'}"`, 22, 125);
    doc.text(`A: "${p1.languageFrame?.answer || "It's three dollars."}"`, 22, 132);

    // Section 3: Activity 1 (Listen & Circle)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('2. ACTIVITY 1: LISTEN & CIRCLE (Word Recognition)', 18, 146);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(p1.activity1?.instruction || 'Listen carefully to the teacher and circle each word you hear:', 18, 152);

    doc.setDrawColor(30, 41, 59);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(18, 156, 174, 22, 2, 2, 'FD');

    const act1Words = p1.activity1?.words || words.map(w => w.word);
    act1Words.slice(0, 6).forEach((word, wi) => {
      const wx = 22 + wi * 28;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(word, wx, 169);
      doc.circle(wx + 10, 166, 7);
    });

    // Page 1 Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('EduGen Panama · Action-Oriented Approach Curriculum · MEDUCA', 18, 286);
    doc.text('Page 1 of 3', 192, 286, { align: 'right' });

    // ═══ PAGE 2: GUIDED PRACTICE & PERFORMANCE TASK ═══
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('PAGE 2 · GUIDED PRACTICE & PERFORMANCE TASK (STAGES 3 & 4)', 18, 12);
    doc.text(`${(pack.title || '').toUpperCase()}`, 192, 12, { align: 'right' });
    doc.line(18, 14, 192, 14);

    // Activity 2: Listen & Match
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('3. ACTIVITY 2: LISTEN & MATCH (Items & Prices)', 18, 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(p2.activity2?.instruction || 'Listen and draw lines to match items with their prices:', 18, 28);

    const pairs = p2.activity2?.pairs || [];
    pairs.slice(0, 4).forEach((p, pi) => {
      const py = 33 + pi * 13;
      doc.setDrawColor(203, 213, 225);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(18, py, 70, 10, 1.5, 1.5, 'FD');
      doc.roundedRect(122, py, 70, 10, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(p.item || p.left || 'Fruit', 24, py + 7);
      doc.circle(84, py + 5, 1.5, 'F');

      doc.circle(126, py + 5, 1.5, 'F');
      doc.text(p.detail || p.right || '$1.00', 140, py + 7);
    });

    // Activity 3: Dialogue Cloze
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('4. ACTIVITY 3: AUTHENTIC DIALOGUE CLOZE', 18, 93);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('Complete the dialogue with the correct words: [ pineapple, three, dollar, banana, please ]', 18, 99);

    doc.setDrawColor(30, 41, 59);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(18, 103, 174, 52, 2, 2, 'FD');

    const dialogue = p2.activity3?.dialogue || [];
    dialogue.slice(0, 6).forEach((line, di) => {
      const dy = 111 + di * 7.5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(line.speaker === 'Seller' ? 67 : 16, line.speaker === 'Seller' ? 56 : 185, line.speaker === 'Seller' ? 202 : 129);
      doc.text(`${line.speaker}:`, 24, dy);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(line.text || '', 44, dy);
    });

    // Activity 4: Performance Task
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('5. ACTIVITY 4: PERFORMANCE TASK (Market Stall Mission)', 18, 166);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text('Listen to the shopping list dictation. Draw items on stall and record prices:', 18, 172);

    doc.setDrawColor(30, 41, 59);
    doc.roundedRect(18, 176, 75, 48, 2, 2, 'D');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('[ Draw Market Stall & Items ]', 32, 202);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text('Shopping List Items & Prices:', 102, 184);
    doc.setFont('helvetica', 'normal');
    doc.text('1. _________________________________  Price: $________', 102, 196);
    doc.text('2. _________________________________  Price: $________', 102, 208);
    doc.text('3. _________________________________  Price: $________', 102, 220);

    // Page 2 Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('EduGen Panama · Action-Oriented Approach Curriculum · MEDUCA', 18, 286);
    doc.text('Page 2 of 3', 192, 286, { align: 'right' });

    // ═══ PAGE 3: ASSESSMENT & TEACHER RESOURCE GUIDE ═══
    doc.addPage();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text('PAGE 3 · FORMATIVE ASSESSMENT & TEACHER GUIDE (STAGES 5 & 6)', 18, 12);
    doc.text('MEDUCA EVALUATION & ANSWER KEY', 192, 12, { align: 'right' });
    doc.line(18, 14, 192, 14);

    // Student Exit Ticket Quiz
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    doc.text('6. STUDENT EXIT TICKET (Formative Quiz & Self-Reflection)', 18, 22);

    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(18, 26, 174, 38, 2, 2, 'FD');

    const quiz = p3.exitTicket?.questions || [];
    quiz.slice(0, 3).forEach((q, qi) => {
      const qy = 33 + qi * 8;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(q.prompt || '', 22, qy);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(`[ ] ${q.options?.[0] || 'A'}    [ ] ${q.options?.[1] || 'B'}`, 128, qy);
    });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Self-Rating:  ★ ★ ★  I can name fruits   ·   ★ ★ ★  I understand prices   ·   ★ ★ ★  I can ask How Much', 22, 59);

    // Teacher Audio Scripts
    doc.setDrawColor(30, 41, 59);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(18, 70, 174, 52, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('TEACHER READ-ALOUD AUDIO SCRIPTS (Guión Textual para el Docente)', 22, 78);

    const scripts = p3.teacherGuide?.scripts || [];
    let sy = 86;
    scripts.slice(0, 3).forEach(sc => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(67, 56, 202);
      doc.text(`${sc.stage}:`, 22, sy);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(30, 41, 59);
      sy = write(`"${sc.text}"`, 22, sy + 4, 166, 7, 0.42) + 4;
    });

    // Official Answer Key
    doc.setDrawColor(16, 185, 129);
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(18, 128, 174, 26, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(6, 95, 70);
    doc.text('OFFICIAL TEACHER ANSWER KEY (Solucionario Oficial)', 22, 135);

    const answers = p3.teacherGuide?.answerKey || [];
    answers.slice(0, 4).forEach((ak, ai) => {
      const ax = ai % 2 === 0 ? 22 : 108;
      const ay = 142 + Math.floor(ai / 2) * 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${ak.item}:`, ax, ay);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(String(ak.answer || '').slice(0, 40), ax + 24, ay);
    });

    // MEDUCA 3-Level Rubric Table
    doc.setDrawColor(30, 41, 59);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(18, 160, 174, 76, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('OFFICIAL MEDUCA 3-LEVEL ASSESSMENT RUBRIC', 22, 168);

    doc.line(18, 172, 192, 172);
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('CRITERION', 22, 177);
    doc.text('INDEPENDENT (3 pts)', 80, 177);
    doc.text('WITH SUPPORT (2 pts)', 122, 177);
    doc.text('EMERGING (1 pt)', 164, 177);
    doc.line(18, 180, 192, 180);

    const rubric = p3.teacherGuide?.rubric || pack.rubric || [];
    rubric.slice(0, 3).forEach((r, ri) => {
      const ry = 186 + ri * 16;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);
      write(r.criterion || 'Objective', 22, ry, 54, 7, 0.4);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      write(r.independent || '', 80, ry, 40, 6.5, 0.4);
      write(r.withSupport || '', 122, ry, 40, 6.5, 0.4);
      write(r.emerging || '', 164, ry, 26, 6.5, 0.4);
    });

    // Page 3 Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('EduGen Panama · Action-Oriented Approach Curriculum · MEDUCA', 18, 286);
    doc.text('Page 3 of 3 (Teacher Guide & Solucionario)', 192, 286, { align: 'right' });

    return doc;
  }

  const headerFooter = (sectionLabel, title, subtitle, first = false) => {
    if (!first) doc.addPage();

    // Running Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text((pack.title || 'ENGLISH ACTIVITY PACK').toUpperCase(), 18, 16);
    doc.text(`${(pack.grade || '').toUpperCase()} · ${(pack.skill || '').toUpperCase()}`, 192, 16, { align: 'right' });

    // Divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(18, 19, 192, 19);

    let curY = 27;
    if (sectionLabel) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(99, 102, 241); // Indigo accent
      doc.text(sectionLabel.toUpperCase(), 18, curY);
      curY += 7;
    }

    if (title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      curY = write(title, 18, curY, 174, 16, 0.45) + 2;
    }

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(51, 65, 85);
      curY = write(subtitle, 18, curY, 174, 10.5, 0.45) + 6;
    }

    // Running Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    const footerText = isKinder ? 'Listen · Point · Move · Play' : 'MEDUCA English Curriculum · Action-Oriented Approach (AOA)';
    doc.text(footerText, 18, 286);
    doc.text(String(doc.getNumberOfPages()), 192, 286, { align: 'right' });

    return curY;
  };

  // Vector icons (only for Kinder or small visual badges)
  const icon = (name, x, y, s = 24) => {
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.7);
    doc.setFillColor(241, 245, 249);

    if (name === 'book') {
      doc.rect(x, y, s, s * 0.74, 'FD');
      doc.line(x + s / 2, y, x + s / 2, y + s * 0.74);
      doc.rect(x + s * 0.15, y + s * 0.15, s * 0.25, s * 0.44);
    } else if (name === 'bag') {
      doc.roundedRect(x, y, s, s * 0.85, 3, 3, 'FD');
      doc.roundedRect(x + s * 0.28, y - s * 0.2, s * 0.44, s * 0.28, 2, 2);
      doc.rect(x + s * 0.2, y + s * 0.35, s * 0.6, s * 0.32);
    } else if (name === 'desk' || name === 'chair') {
      doc.rect(x, y + s * 0.4, s, s * 0.12, 'FD');
      doc.line(x + 2, y + s * 0.52, x + 2, y + s);
      doc.line(x + s - 2, y + s * 0.52, x + s - 2, y + s);
      if (name === 'chair') doc.rect(x + 2, y, s - 4, s * 0.4, 'FD');
    } else if (name === 'pencil' || name === 'crayon') {
      doc.rect(x + s * 0.32, y, s * 0.24, s * 0.7, 'FD');
      doc.triangle(x + s * 0.32, y + s * 0.7, x + s * 0.56, y + s * 0.7, x + s * 0.44, y + s, 'FD');
      if (name === 'pencil') doc.line(x + s * 0.44, y, x + s * 0.44, y + s * 0.7);
    } else {
      doc.circle(x + s / 2, y + s / 2, s * 0.4, 'FD');
    }
  };

  const picture = (o, x, y, w) => {
    const pos = (o.position || 'none').toLowerCase();
    const anc = (o.anchor || 'desk').toLowerCase();
    if (!pos || pos === 'none') {
      return icon(o.icon || 'book', x + w / 2 - 13, y + 10, 26);
    }
    const ax = x + w / 2 - 17;
    icon(anc, ax, y + 15, 34);
    if (pos === 'on') icon(o.icon || 'book', ax + 10, y + (anc === 'desk' ? 19.5 : 8), 13);
    else if (pos === 'under') icon(o.icon || 'book', ax + 10, y + 36, 12);
    else if (pos === 'next_to') icon(o.icon || 'book', ax + 37, y + 20, 12);
    else if (pos === 'in') icon(o.icon || 'book', ax + 10, y + 17, 13);
  };

  // ═══════════════════════════════════════
  // 1. COVER PAGE
  // ═══════════════════════════════════════
  headerFooter('MY ENGLISH ACTIVITY WORKBOOK', pack.title, pack.grade, true);

  // Hero Card
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(18, 62, 174, 98, 4, 4, 'FD');

  // Pill badge inside hero
  doc.setFillColor(79, 70, 229); // Indigo
  doc.roundedRect(26, 72, 65, 8, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`SKILL: ${(pack.skill || 'ENGLISH').toUpperCase()}`, 29, 77.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  write(pack.title, 26, 92, 158, 16, 0.46);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  write(`Lesson Focus: ${pack.lessonTitle || pack.title}`, 26, 114, 158, 11);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Grounded in Panama MEDUCA Curricular Standards (AOA)', 26, 142);

  // Student info form
  let formY = 176;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);

  doc.text('Student Name:', 18, formY);
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(52, formY + 1, 192, formY + 1);

  formY += 16;
  doc.text('Date:', 18, formY);
  doc.line(32, formY + 1, 105, formY + 1);
  doc.text('Grade & Group:', 112, formY);
  doc.line(148, formY + 1, 192, formY + 1);

  formY += 16;
  doc.text('Teacher:', 18, formY);
  doc.line(40, formY + 1, 192, formY + 1);

  // Cover footer note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Student activities start on page 2. Teacher scripts and assessment rubric are at the end.', 18, 258);

  // ═══════════════════════════════════════
  // 2. ACTIVITIES
  // ═══════════════════════════════════════
  pack.activities.forEach((act, actIdx) => {
    const actNumber = actIdx + 1;
    const actHeader = isListening ? `LISTENING ACTIVITY ${actNumber}` : `${pack.skill.toUpperCase()} ACTIVITY ${actNumber}`;
    let curY = headerFooter(actHeader, act.title, act.instruction);

    // ── A. CARD CHOICES / LISTENING SELECTION ──
    if (act.type === 'card_choices') {
      const items = act.items || [];
      const isShort = items.length <= 2;
      const cardHeight = isShort ? 88 : items.length === 3 ? 68 : 52;

      items.forEach((item, i) => {
        const y = curY + i * (cardHeight + 8);
        const options = item.options || [];
        const optCount = options.length;
        const gap = 8;
        const cardWidth = (174 - (optCount - 1) * gap) / optCount;

        // Item indicator
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text(String(i + 1), 18, y + 14);

        options.forEach((opt, j) => {
          const cardX = 26 + j * (cardWidth + gap);

          // Card container
          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.6);
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(cardX, y, cardWidth, cardHeight, 3, 3, 'FD');

          // Letter pill
          doc.setFillColor(241, 245, 249);
          doc.roundedRect(cardX + 4, y + 4, 10, 8, 1.5, 1.5, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(71, 85, 105);
          doc.text(opt.letter || String.fromCharCode(65 + j), cardX + 7, y + 9.5);

          // Checkbox circle in upper right of card
          doc.setDrawColor(148, 163, 184);
          doc.circle(cardX + cardWidth - 8, y + 8, 3.5);

          // If visual icon (for Kinder)
          if (opt.icon && isKinder) {
            picture(opt, cardX, y + 2, cardWidth);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(15, 23, 42);
            doc.text(opt.label || '', cardX + cardWidth / 2, y + cardHeight - 8, { align: 'center' });
          } else {
            // Real pedagogical card layout (Text / Price / Phrase)
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(13);
            doc.setTextColor(15, 23, 42);
            const labelY = y + (cardHeight / 2) - 4;
            write(opt.label || '', cardX + 8, labelY, cardWidth - 16, 12);

            if (opt.subtext) {
              doc.setFont('helvetica', 'normal');
              doc.setFontSize(9.5);
              doc.setTextColor(99, 102, 241); // Accent
              write(opt.subtext, cardX + 8, labelY + 12, cardWidth - 16, 9.5);
            }
          }
        });
      });

      if (isListening) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(148, 163, 184);
        doc.text('Teacher reads script. Students listen and check [ ] or circle the correct card.', 18, 275);
      }
    }

    // ── B. TABLE CHECKLIST / INFORMATION GRID ──
    else if (act.type === 'table_checklist') {
      const headers = act.headers || ['Item / Information', 'Heard in Audio?', 'Notes / Details'];
      const rows = act.rows || [];
      const colW = [70, 52, 52];
      let tableY = curY + 4;

      // Table Header Row
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.5);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(18, tableY, 174, 12, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      let hX = 22;
      headers.forEach((h, hIdx) => {
        doc.text(h, hX, tableY + 8);
        hX += colW[hIdx];
      });

      tableY += 12;

      // Rows
      rows.forEach((r, rIdx) => {
        const rowH = 18;
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(rIdx % 2 === 0 ? 255 : 250);
        doc.rect(18, tableY, 174, rowH, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);
        doc.text(r.col1 || '', 22, tableY + 11);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(71, 85, 105);
        doc.text(r.col2 || '[ ] Yes   [ ] No', 92, tableY + 11);
        doc.text(r.col3 || '________________', 144, tableY + 11);

        tableY += rowH;
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Complete the information grid according to what you hear.', 18, 275);
    }

    // ── C. MATCHING ──
    else if (act.type === 'matching') {
      const pairs = act.pairs || [];
      let matchY = curY + 4;

      pairs.forEach((pair, pIdx) => {
        const itemH = 28;
        // Left Column Card
        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.5);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(18, matchY, 74, itemH, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        write(pair.left || '', 24, matchY + 11, 62, 10);

        // Dot on right of left box
        doc.setFillColor(79, 70, 229);
        doc.circle(96, matchY + itemH / 2, 1.8, 'F');

        // Dot on left of right box
        doc.circle(114, matchY + itemH / 2, 1.8, 'F');

        // Right Column Card
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(118, matchY, 74, itemH, 2, 2, 'FD');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);
        write(pair.right || '', 124, matchY + 11, 62, 10);

        matchY += itemH + 8;
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Draw a clear line matching each item on the left with the correct answer on the right.', 18, 275);
    }

    // ── D. DIALOGUE CLOZE / WORD BANK ──
    else if (act.type === 'dialogue_cloze') {
      // Word Bank Box
      doc.setDrawColor(199, 210, 254); // Light indigo
      doc.setFillColor(245, 247, 255);
      doc.roundedRect(18, curY, 174, 22, 2, 2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(67, 56, 202);
      doc.text('WORD BANK:', 24, curY + 7);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      const words = (act.wordBank || []).join('   ·   ');
      doc.text(words, 24, curY + 16);

      let lineY = curY + 34;
      (act.lines || []).forEach((line, lIdx) => {
        // Speaker Badge
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(18, lineY - 4, 30, 9, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(line.speaker || 'Person', 20, lineY + 2);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        lineY = write(line.text || '', 54, lineY + 2, 138, 11) + 10;
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Listen carefully and use the words from the Word Bank to complete the dialogue.', 18, 275);
    }

    // ── E. READ & ANSWER ──
    else if (act.type === 'read_answer') {
      // Passage Card
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(18, curY, 174, 56, 3, 3, 'FD');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      write(act.passage, 24, curY + 10, 162, 10.5, 0.48);

      let qY = curY + 68;
      (act.questions || []).forEach((q, qIdx) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        qY = write(`${qIdx + 1}. ${q.question}`, 18, qY, 174, 11) + 4;

        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.4);
        doc.line(18, qY + 6, 192, qY + 6);
        doc.line(18, qY + 15, 192, qY + 15);
        qY += 24;
      });
    }

    // ── F. DRAW & WRITE / TASK PRODUCTION ──
    else if (act.type === 'draw_write') {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      const textEndY = write(act.prompt, 18, curY, 174, 11) + 4;

      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.6);
      doc.roundedRect(18, textEndY + 4, 174, 95, 3, 3);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('[ Drawing & Design Space ]', 105, textEndY + 50, { align: 'center' });

      let lineY = textEndY + 112;
      doc.setDrawColor(203, 213, 225);
      for (let l = 0; l < 3; l++) {
        doc.line(18, lineY, 192, lineY);
        lineY += 12;
      }
    }
  });

  // ═══════════════════════════════════════
  // 3. KINDER REFLECTION (if Pre-K/Kinder)
  // ═══════════════════════════════════════
  if (isKinder) {
    headerFooter('SELF-REFLECTION', 'How did I feel today?', 'Point to a face. Tell or show your teacher.');

    // Face 1: Happy
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.8);
    doc.circle(60, 95, 22);
    doc.circle(52, 90, 2, 'F');
    doc.circle(68, 90, 2, 'F');
    for (let deg = 30; deg <= 150; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      doc.circle(60 + Math.cos(rad) * 11, 97 + Math.sin(rad) * 7, 0.4, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('I enjoyed it!', 60, 127, { align: 'center' });

    // Face 2: Need help
    doc.circle(150, 95, 22);
    doc.circle(142, 90, 2, 'F');
    doc.circle(158, 90, 2, 'F');
    doc.line(142, 104, 158, 104);
    doc.text('I want help.', 150, 127, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Draw your favourite thing from today:', 18, 150);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(18, 158, 174, 90, 3, 3);
  }

  // ═══════════════════════════════════════
  // 4. TEACHER SECTION: LESSON GUIDE & TIMING
  // ═══════════════════════════════════════
  headerFooter('TEACHER SECTION', 'Teacher Guide & Lesson Timing', 'Panama AOA pedagogical stages and time management.');

  const timing = pack.timing || {};
  let gY = 60;

  const stages = [
    { name: 'Warm-up & Contextualization', desc: timing.warmUp || '10 min · Activate background knowledge' },
    { name: 'Language Presentation & Modeling', desc: timing.presentation || '8 min · Target language input' },
    { name: 'Guided Practice & Scaffolding', desc: timing.guidedPractice || '12 min · Student workbook activities' },
    { name: 'Communicative Performance', desc: timing.performance || '10 min · Production task' },
    { name: 'Reflection & Formative Check', desc: timing.reflection || '5 min · Wrap-up & self-assessment' }
  ];

  stages.forEach(st => {
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(18, gY, 174, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(79, 70, 229);
    doc.text(st.name, 24, gY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(st.desc, 24, gY + 15);

    gY += 26;
  });

  // ═══════════════════════════════════════
  // 5. TEACHER SCRIPTS (READ ALOUD) & ANSWERS
  // ═══════════════════════════════════════
  const scriptTitle = isListening ? 'Teacher Scripts · Read Aloud' : 'Teacher Guide & Scripts';
  let tY = headerFooter('TEACHER SECTION', scriptTitle, 'Read one sentence or dialogue at a time clearly. Give students time to respond.');

  pack.activities.forEach((act, n) => {
    if (tY > 230) {
      tY = headerFooter('TEACHER SECTION', 'Teacher Scripts (Continued)', 'Script prompts and answer keys.');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(15, 23, 42);
    tY = write(`Activity ${n + 1}: ${act.title}`, 18, tY, 174, 11.5) + 3;

    if (act.type === 'card_choices') {
      (act.items || []).forEach((item, k) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        tY = write(`Item ${k + 1} - Say: "${item.teacherPrompt || ''}"`, 22, tY, 170, 10) + 1;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(79, 70, 229);
        const correctOpt = (item.options || [])[item.answerIndex] || (item.options || [])[0] || {};
        tY = write(`Expected Answer: [ ${String.fromCharCode(65 + item.answerIndex)} ] ${correctOpt.label || ''} ${correctOpt.subtext ? '· ' + correctOpt.subtext : ''}`, 26, tY, 166, 9.5) + 3;
      });
    } else if (act.type === 'table_checklist') {
      if (act.teacherScript) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        tY = write(`Teacher Read-Aloud Script: "${act.teacherScript}"`, 22, tY, 170, 9.5) + 2;
      }
      (act.rows || []).forEach(r => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);
        tY = write(`• Answer: ${r.col1} -> ${r.col2} (${r.col3})`, 26, tY, 166, 9) + 1;
      });
    } else if (act.type === 'matching') {
      (act.pairs || []).forEach((p, k) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        tY = write(`• ${p.left}  --->  ${p.right}`, 22, tY, 170, 9.5) + 1.5;
      });
    } else if (act.type === 'dialogue_cloze') {
      if (act.teacherScript) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        tY = write(`Teacher Script: "${act.teacherScript}"`, 22, tY, 170, 9.5) + 2;
      }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(79, 70, 229);
      tY = write(`Word bank solutions: ${(act.wordBank || []).join(', ')}`, 22, tY, 170, 9) + 2;
    } else if (act.type === 'read_answer') {
      (act.questions || []).forEach((q, k) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        tY = write(`Q${k + 1} Expected Answer: ${q.answer}`, 22, tY, 170, 9.5) + 2;
      });
    } else if (act.type === 'draw_write') {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      tY = write(`Evaluation notes: ${act.teacherGuide}`, 22, tY, 170, 9.5) + 2;
    }

    tY += 4;
  });

  // ═══════════════════════════════════════
  // 6. FORMATIVE ASSESSMENT RUBRIC & CHECKLIST
  // ═══════════════════════════════════════
  headerFooter('FORMATIVE ASSESSMENT', 'Observation Rubric & Checklist', `Curricular criteria for ${(pack.skill || 'English').toUpperCase()} under Panama AOA.`);

  let rY = 56;
  pack.rubric.forEach((row, rIdx) => {
    if (rY > 220) {
      headerFooter('FORMATIVE ASSESSMENT', 'Observation Rubric (Continued)', 'Evaluation criteria.');
      rY = 56;
    }

    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.5);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(18, rY, 174, 48, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`Criterion ${rIdx + 1}: ${row.criterion}`, 22, rY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);

    doc.rect(22, rY + 14, 3.5, 3.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Independent:', 28, rY + 17);
    doc.setFont('helvetica', 'normal');
    write(row.independent, 52, rY + 17, 136, 8.5);

    doc.rect(22, rY + 25, 3.5, 3.5);
    doc.setFont('helvetica', 'bold');
    doc.text('With Support:', 28, rY + 28);
    doc.setFont('helvetica', 'normal');
    write(row.withSupport, 52, rY + 28, 136, 8.5);

    doc.rect(22, rY + 36, 3.5, 3.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Emerging:', 28, rY + 39);
    doc.setFont('helvetica', 'normal');
    write(row.emerging, 52, rY + 39, 136, 8.5);

    rY += 54;
  });

  if (rY <= 245) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Teacher Observations / Notes on Student Support:', 18, rY + 4);
    doc.setDrawColor(203, 213, 225);
    doc.line(18, rY + 14, 192, rY + 14);
    doc.line(18, rY + 24, 192, rY + 24);
  }

  return doc;
}

export function downloadWorkbook(pack) {
  const filename = (pack.title || 'Activity_Workbook').replace(/[^a-z0-9_-]/gi, '_') + '.pdf';
  buildWorkbook(pack).save(filename);
}
