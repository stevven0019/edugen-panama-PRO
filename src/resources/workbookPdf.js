import { jsPDF } from 'jspdf';
import { validatePack } from './activityPack.js';

export function buildWorkbook(pack) {
  validatePack(pack);
  const doc = new jsPDF();
  const isKinder = /kinder|pre-?k|early/i.test(pack.grade || '');
  const isListening = /listen/i.test(pack.skill || '');

  const write = (value, x, y, width = 174, size = 11, lineSpacing = 0.44) => {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(value || ''), width);
    doc.text(lines, x, y);
    return y + lines.length * size * lineSpacing;
  };

  const headerFooter = (sectionLabel, title, subtitle, first = false) => {
    if (!first) doc.addPage();
    
    // Top running header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(90, 110, 130);
    doc.text((pack.title || 'WORKBOOK').toUpperCase(), 18, 16);
    doc.text(`${(pack.grade || '').toUpperCase()}  /  ${(pack.skill || '').toUpperCase()}`, 192, 16, { align: 'right' });
    
    // Thin divider line under running header
    doc.setDrawColor(220, 228, 235);
    doc.setLineWidth(0.3);
    doc.line(18, 19, 192, 19);

    let curY = 27;
    if (sectionLabel) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(sectionLabel.toUpperCase(), 18, curY);
      curY += 7;
    }

    if (title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      curY = write(title, 18, curY, 174, 18, 0.46) + 2;
    }

    if (subtitle) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(51, 65, 85);
      curY = write(subtitle, 18, curY, 174, 11) + 6;
    }

    // Running footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120, 140, 160);
    const footerText = isKinder ? 'Listen · Point · Move · Play' : 'Action-Oriented Approach · Panama MEDUCA';
    doc.text(footerText, 18, 286);
    doc.text(String(doc.getNumberOfPages()), 192, 286, { align: 'right' });

    return curY;
  };

  // Vector graphics engine (sharp print quality without raster artifacts)
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
      else doc.rect(x + s * 0.28, y + s * 0.2, s * 0.32, s * 0.3);
    } else if (name === 'house') {
      doc.rect(x, y + s * 0.4, s, s * 0.6, 'FD');
      doc.triangle(x - 2, y + s * 0.4, x + s / 2, y, x + s + 2, y + s * 0.4);
      doc.rect(x + s * 0.4, y + s * 0.65, s * 0.2, s * 0.35);
    } else if (name === 'fish') {
      doc.ellipse(x + s * 0.4, y + s * 0.5, s * 0.4, s * 0.25, 'FD');
      doc.triangle(x + s * 0.75, y + s * 0.5, x + s, y + s * 0.2, x + s, y + s * 0.8, 'FD');
      doc.circle(x + s * 0.2, y + s * 0.45, 1, 'F');
    } else if (name === 'tree' || name === 'flower') {
      doc.line(x + s / 2, y + s * 0.4, x + s / 2, y + s);
      doc.circle(x + s / 2, y + s * 0.3, s * 0.3, 'FD');
      if (name === 'flower') {
        for (let i = 0; i < 6; i++) {
          const a = (i * Math.PI) / 3;
          doc.circle(x + s / 2 + Math.cos(a) * s * 0.22, y + s * 0.3 + Math.sin(a) * s * 0.22, s * 0.1);
        }
      }
    } else {
      doc.circle(x + s / 2, y + s / 2, s * 0.4, 'FD');
      if (name === 'ball') {
        doc.line(x + s * 0.1, y + s * 0.5, x + s * 0.9, y + s * 0.5);
        doc.ellipse(x + s * 0.5, y + s * 0.5, s * 0.15, s * 0.4);
      }
      if (name === 'apple') doc.line(x + s * 0.5, y + s * 0.1, x + s * 0.65, y - s * 0.1);
      if (name === 'sun') {
        for (let i = 0; i < 8; i++) {
          const a = (i * Math.PI) / 4;
          doc.line(x + s / 2 + Math.cos(a) * s * 0.46, y + s / 2 + Math.sin(a) * s * 0.46, x + s / 2 + Math.cos(a) * s * 0.6, y + s / 2 + Math.sin(a) * s * 0.6);
        }
      }
    }
  };

  const picture = (o, x, y, w) => {
    const pos = (o.position || 'none').toLowerCase();
    const anc = (o.anchor || 'desk').toLowerCase();
    if (!pos || pos === 'none') {
      return icon(o.icon, x + w / 2 - 13, y + 14, 26);
    }
    const ax = x + w / 2 - 17;
    icon(anc, ax, y + 17, 34);
    if (pos === 'on') icon(o.icon, ax + 10, y + (anc === 'desk' ? 21.2 : 8.5), 13);
    else if (pos === 'under') icon(o.icon, ax + 10, y + 38, 12);
    else if (pos === 'next_to') icon(o.icon, ax + 37, y + 22, 12);
    else if (pos === 'in') icon(o.icon, ax + 10, y + 19, 13);
  };

  // ── COVER PAGE ──
  headerFooter('MY ENGLISH ACTIVITY BOOK', pack.title, pack.grade, true);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(51, 65, 85);
  doc.text(isKinder ? 'Listen, point and play!' : `Skill Focus: ${pack.skill}`, 18, 65);

  // Center Hero Illustration
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.roundedRect(55, 90, 100, 75, 4, 4);
  icon('book', 90, 105, 30);
  icon('pencil', 70, 118, 18);
  icon('bag', 125, 116, 20);

  // Belongs to
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text('This book belongs to:', 18, 200);
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.5);
  doc.line(18, 215, 192, 215);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Theme / Lesson: ${pack.lessonTitle || pack.title}`, 18, 240);
  doc.text('Action-Oriented Approach (AOA) · Panama MEDUCA Curriculum', 18, 246);
  if (isKinder) {
    doc.text('Adult support: Read prompts aloud. No independent student reading required.', 18, 252);
  }

  // ── ACTIVITIES ──
  pack.activities.forEach((act, actIdx) => {
    const actNumber = actIdx + 1;
    const actTypeLabel = isListening ? 'LISTENING ACTIVITY' : `${pack.skill.toUpperCase()} ACTIVITY`;
    let curY = headerFooter(`${actTypeLabel} ${actNumber}`, act.title, act.instruction);

    if (act.type === 'picture_choice') {
      const itemsCount = act.items.length;
      const rowHeight = itemsCount === 1 ? 95 : itemsCount === 2 ? 78 : 60;
      
      act.items.forEach((item, i) => {
        const y = curY + i * (rowHeight + 6);
        const optCount = item.options.length;
        const cardWidth = (174 - (optCount - 1) * 8) / optCount;

        // Row number
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(30, 41, 59);
        doc.text(String(i + 1), 18, y + 16);

        item.options.forEach((opt, j) => {
          const cardX = 26 + j * (cardWidth + 8);
          doc.setDrawColor(203, 213, 225);
          doc.setLineWidth(0.6);
          doc.setFillColor(255, 255, 255);
          doc.roundedRect(cardX, y, cardWidth, rowHeight, 3, 3, 'FD');
          picture(opt, cardX, y, cardWidth);

          // Option letter pill
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(71, 85, 105);
          doc.text(String.fromCharCode(65 + j), cardX + 5, y + 8);
        });
      });

      if (isKinder) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text('Adult: Read teacher prompt on script page. Children point to or circle the correct picture.', 18, 275);
      }
    } else if (act.type === 'match') {
      const startY = curY + 6;
      act.items.forEach((item, i) => {
        const y = startY + i * 44;
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.roundedRect(18, y, 75, 36, 3, 3);
        icon(item.icon, 40, y + 4, 26);

        doc.setFillColor(51, 65, 85);
        doc.circle(98, y + 18, 1.2, 'F');

        const pairedWord = act.items[(i + 1) % act.items.length].word;
        doc.circle(115, y + 18, 1.2, 'F');
        doc.roundedRect(120, y, 72, 36, 3, 3);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42);
        doc.text(pairedWord, 156, y + 21, { align: 'center' });
      });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Draw a line connecting each picture to its corresponding word.', 18, 275);
    } else if (act.type === 'read_answer') {
      // Reading passage box
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(18, curY, 174, 52, 3, 3, 'FD');
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      write(act.passage, 24, curY + 9, 162, 10.5, 0.48);

      let qY = curY + 62;
      act.questions.forEach((q, qIdx) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        qY = write(`${qIdx + 1}. ${q.question}`, 18, qY, 174, 11) + 4;

        doc.setDrawColor(203, 213, 225);
        doc.setLineWidth(0.4);
        doc.line(18, qY + 6, 192, qY + 6);
        doc.line(18, qY + 16, 192, qY + 16);
        qY += 25;
      });
    } else if (act.type === 'draw_write') {
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
      doc.text('[ Workspace / Drawing Area ]', 105, textEndY + 50, { align: 'center' });

      // Lined section below drawing box
      let lineY = textEndY + 112;
      doc.setDrawColor(203, 213, 225);
      for (let l = 0; l < 3; l++) {
        doc.line(18, lineY, 192, lineY);
        lineY += 12;
      }
    }
  });

  // ── KINDER EMOTION REFLECTION PAGE (if Kinder) ──
  if (isKinder) {
    headerFooter('SELF-REFLECTION', 'How did I feel?', 'Point to a face. Tell or show your teacher.');
    
    // Face 1: Happy
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.8);
    doc.circle(60, 95, 22);
    doc.circle(52, 90, 2, 'F');
    doc.circle(68, 90, 2, 'F');
    // Smile arc
    for (let deg = 30; deg <= 150; deg += 5) {
      const rad = (deg * Math.PI) / 180;
      doc.circle(60 + Math.cos(rad) * 11, 97 + Math.sin(rad) * 7, 0.4, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text('I enjoyed it!', 60, 127, { align: 'center' });

    // Face 2: Neutral/Need Help
    doc.circle(150, 95, 22);
    doc.circle(142, 90, 2, 'F');
    doc.circle(158, 90, 2, 'F');
    doc.line(142, 104, 158, 104);
    doc.text('I want help.', 150, 127, { align: 'center' });

    // Favorite drawing box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Draw your favourite thing from today:', 18, 150);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(18, 158, 174, 90, 3, 3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Read the options aloud. Neither choice is a grade. The child may indicate a feeling by pointing.', 18, 275);
  }

  // ── TEACHER SCRIPTS & ANSWER GUIDE ──
  const teacherHeader = isListening ? 'TEACHER SCRIPTS · READ ALOUD' : 'TEACHER GUIDE & SCRIPTS';
  let tY = headerFooter('TEACHER SECTION', teacherHeader, 'Say one sentence at a time clearly. Give students time to respond.');

  pack.activities.forEach((act, n) => {
    if (tY > 240) {
      tY = headerFooter('TEACHER SECTION', 'Teacher Guide (Continued)', 'Instructions and script prompts.');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    tY = write(`Activity ${n + 1}: ${act.title}`, 18, tY, 174, 12) + 2;

    if (act.type === 'picture_choice') {
      act.items.forEach((item, k) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        tY = write(`Item ${k + 1} - Say: "${item.teacherPrompt}"`, 22, tY, 170, 10) + 1;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(71, 85, 105);
        const correctOpt = item.options[item.answerIndex] || item.options[0];
        tY = write(`Expected Answer: [ ${String.fromCharCode(65 + item.answerIndex)} ] ${correctOpt.label || correctOpt.icon}`, 26, tY, 166, 9.5) + 3;
      });
    } else if (act.type === 'match') {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      act.items.forEach((item, k) => {
        tY = write(`• Match: ${item.icon} -> ${item.word}`, 22, tY, 170, 9.5) + 1;
      });
      tY += 2;
    } else if (act.type === 'read_answer') {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      act.questions.forEach((q, k) => {
        tY = write(`Q${k + 1} Answer: ${q.answer}`, 22, tY, 170, 9.5) + 2;
      });
    } else if (act.type === 'draw_write') {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      tY = write(`Observation guide: ${act.teacherGuide}`, 22, tY, 170, 9.5) + 3;
    }
    tY += 4;
  });

  // ── FORMATIVE OBSERVATION RUBRIC ──
  headerFooter('FORMATIVE ASSESSMENT', 'Observation Rubric & Checklist', `Evaluation criteria aligned with ${pack.skill} under AOA.`);
  let rY = 56;

  pack.rubric.forEach((row, rIdx) => {
    if (rY > 230) {
      headerFooter('FORMATIVE ASSESSMENT', 'Observation Rubric (Continued)', 'Formative criteria.');
      rY = 56;
    }

    // Criterion Card
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

    // Levels with checkboxes
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

  // Notes section at bottom of rubric
  if (rY <= 245) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Teacher Observations / Support Notes:', 18, rY + 4);
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
