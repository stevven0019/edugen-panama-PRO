import { useEffect, useRef, useState } from 'react';
import { databaseService } from '../services/firebase';
import { generateActivityPack, latestAoa } from '../resources/activityPack';
import { buildWorkbook, downloadWorkbook, downloadWorkbookDoc, downloadEditorialPdf, downloadEditorialHtml } from '../resources/workbookPdf';
import { renderWorkbookHtml } from '../resources/renderWorkbookHtml';
import { downloadAoaSheetsCsv, getCefrByGrade } from '../resources/sheetExporter';
import { sanitizeThemeTitle } from '../resources/lessonParser';

export const GRADES_CEFR_MAP = [
  { id: 'prek', name: 'Pre-K', label: 'Pre-K (Pre-A1 Receptivo / TPR)', cefr: 'Pre-A1', file: 'English_Curriculum_Prekinder.json' },
  { id: 'kinder', name: 'Kinder', label: 'Kindergarten (Pre-A1 Receptivo / TPR)', cefr: 'Pre-A1', file: 'English_Curriculum_Kinder.json' },
  { id: '1st', name: '1st Grade', label: '1° Grado (Pre-A1 / A1.1)', cefr: 'Pre-A1', file: 'English_Curriculum_Grade_1.json' },
  { id: '2nd', name: '2nd Grade', label: '2° Grado (Pre-A1 / A1.1)', cefr: 'A1.1', file: 'English_Curriculum_Grade_2.json' },
  { id: '3rd', name: '3rd Grade', label: '3° Grado (A1)', cefr: 'A1', file: 'English_Curriculum_Grade_3.json' },
  { id: '4th', name: '4th Grade', label: '4° Grado (A1)', cefr: 'A1', file: 'English_Curriculum_Grade_4.json' },
  { id: '5th', name: '5th Grade', label: '5° Grado (A1+)', cefr: 'A1+', file: 'English_Curriculum_Grade_5.json' },
  { id: '6th', name: '6th Grade', label: '6° Grado (A1+)', cefr: 'A1+', file: 'English_Curriculum_Grade_6.json' },
  { id: '7th', name: '7th Grade', label: '7° Grado (A2)', cefr: 'A2', file: 'English_Curriculum_Grade_7.json' },
  { id: '8th', name: '8th Grade', label: '8° Grado (A2)', cefr: 'A2', file: 'English_Curriculum_Grade_8.json' },
  { id: '9th', name: '9th Grade', label: '9° Grado (A2+)', cefr: 'A2+', file: 'English_Curriculum_Grade_9.json' },
  { id: '10th', name: '10th Grade', label: '10° Grado (B1)', cefr: 'B1', file: 'English_Curriculum_Grade_10.json' },
  { id: '11th', name: '11th Grade', label: '11° Grado (B1)', cefr: 'B1', file: 'English_Curriculum_Grade_11.json' },
  { id: '12th', name: '12th Grade', label: '12° Grado (B1+)', cefr: 'B1+', file: 'English_Curriculum_Grade_12.json' }
];

export const SKILLS_AOA = [
  { id: 'Listening', label: '1. Listening · Entrada Comprensiva & TPR', number: 1, desc: 'Listen & Do, discriminación auditiva y gestos' },
  { id: 'Reading', label: '2. Reading · Alfabetización Visual & Decodificación', number: 2, desc: 'Avisos reales, menús, skimming & scanning' },
  { id: 'Speaking', label: '3. Speaking · Acción Social & Interacción Oral', number: 3, desc: 'Role-play cards en parejas, brecha de información' },
  { id: 'Writing', label: '4. Writing · Producción Escrita Social', number: 4, desc: 'Desde rotulado hasta comandas y formularios' },
  { id: 'Mediation', label: '5. Mediation · Mediación Interpersonal (CEFR 2020)', number: 5, desc: '21st Century Skills Project (Theme 1: Proj 1, Theme 2: Proj 2)' }
];

const plain = html => new DOMParser().parseFromString(html || '', 'text/html').body.textContent || '';

export function detectLessonMetadata(text = '', baseName = '') {
  let detectedGrade = null;
  const combined = (baseName + ' ' + (text || '')).slice(0, 5000);
  if (/(?:^|[^a-z])(?:pre-?k|kindergarten|kinder\b|educaci[oó]n\s+inicial)/i.test(combined)) detectedGrade = 'Kindergarten';
  else if (/1st|1°|primer/i.test(combined)) detectedGrade = '1st Grade';
  else if (/2nd|2°|segundo/i.test(combined)) detectedGrade = '2nd Grade';
  else if (/3rd|3°|tercer/i.test(combined)) detectedGrade = '3rd Grade';
  else if (/4th|4°|cuarto/i.test(combined)) detectedGrade = '4th Grade';
  else if (/5th|5°|quinto/i.test(combined)) detectedGrade = '5th Grade';
  else if (/6th|6°|sexto/i.test(combined)) detectedGrade = '6th Grade';
  else if (/7th|7°|séptimo/i.test(combined)) detectedGrade = '7th Grade';
  else if (/8th|8°|octavo/i.test(combined)) detectedGrade = '8th Grade';
  else if (/9th|9°|noveno/i.test(combined)) detectedGrade = '9th Grade';
  else if (/10th|10°|décimo/i.test(combined)) detectedGrade = '10th Grade';
  else if (/11th|11°/i.test(combined)) detectedGrade = '11th Grade';
  else if (/12th|12°/i.test(combined)) detectedGrade = '12th Grade';

  // Detect title hint
  let detectedTitle = baseName;
  const titleMatch = (text || '').match(/(?:Theme|Tema)\s*#?\s*[:#-]?\s*([^\n\t.<]+?)(?:Date|\bSpecific|\bLesson|$)/i) ||
                     (text || '').match(/Theme\s*#\s*([^–—:\n\t<]+?)(?:–|—|-|Lesson|$)/i) ||
                     (text || '').match(/(?:Theme|Title|Topic|Lección|Lesson)\s*[:#-]?\s*([^\n\t.<]+)/i);
  if (titleMatch && titleMatch[1].trim().length > 2 && !titleMatch[1].toLowerCase().includes('planner')) {
    detectedTitle = sanitizeThemeTitle(titleMatch[1].trim());
  }

  // Detect scenario hint
  let detectedScenario = null;
  const scMatch = (text || '').match(/(?:Scenario|Escenario)\s*[:#-]?\s*([^\n\t.<]+)/i);
  if (scMatch && scMatch[1].trim().length > 3 && !scMatch[1].toLowerCase().includes('planner')) {
    detectedScenario = scMatch[1].trim();
  }

  // Detect skill hint (generador de actividades.txt: lesson.skill is authoritative)
  let detectedSkill = null;
  const skillMatch = (combined || '').match(/(?:Skills?\s*(?:Focus)?|Target\s+Skill|Habilidad|Macro-?habilidad)\s*[:#-]?\s*([a-zA-Z\s]+)/i);
  if (skillMatch) {
    const s = skillMatch[1].toLowerCase();
    if (s.includes('listen') || s.includes('escuch')) detectedSkill = 'Listening';
    else if (s.includes('read') || s.includes('lect')) detectedSkill = 'Reading';
    else if (s.includes('speak') || s.includes('oral') || s.includes('habl')) detectedSkill = 'Speaking';
    else if (s.includes('writ') || s.includes('escr')) detectedSkill = 'Writing';
    else if (s.includes('mediat') || s.includes('mediac')) detectedSkill = 'Mediation';
  }
  if (!detectedSkill) {
    if (/(?:^|[^a-z])speaking\b/i.test(combined)) detectedSkill = 'Speaking';
    else if (/(?:^|[^a-z])reading\b/i.test(combined)) detectedSkill = 'Reading';
    else if (/(?:^|[^a-z])writing\b/i.test(combined)) detectedSkill = 'Writing';
    else if (/(?:^|[^a-z])mediation\b/i.test(combined)) detectedSkill = 'Mediation';
    else if (/(?:^|[^a-z])listening\b/i.test(combined)) detectedSkill = 'Listening';
  }

  // Detect lesson number
  let detectedLessonNum = null;
  const lNumMatch = (combined || '').match(/(?:Lesson|Lecci[oó]n)\s*(?:#|No\.?|Number)?\s*[:#-]?\s*(\d)/i);
  if (lNumMatch) {
    detectedLessonNum = parseInt(lNumMatch[1], 10);
  }

  return {
    grade: detectedGrade,
    scenario: detectedScenario,
    title: detectedTitle,
    skill: detectedSkill,
    lessonNum: detectedLessonNum
  };
}

export function getScenarioTitle(sc, index = 0) {
  if (!sc) return `Escenario ${index + 1}`;
  return sc.scenarioName || sc.scenario_title || sc.title || sc.name || `Escenario ${index + 1}`;
}

export function getScenarioThemes(sc) {
  if (!sc) return { theme1: 'Theme 1', theme2: 'Theme 2' };
  let t1 = '';
  let t2 = '';

  if (typeof sc.theme1 === 'string') t1 = sc.theme1;
  else if (sc.theme1?.theme_title) t1 = sc.theme1.theme_title;

  if (typeof sc.theme2 === 'string') t2 = sc.theme2;
  else if (sc.theme2?.theme_title) t2 = sc.theme2.theme_title;

  if ((!t1 || !t2) && Array.isArray(sc.themes)) {
    if (!t1 && sc.themes[0]) {
      t1 = typeof sc.themes[0] === 'string' ? sc.themes[0] : (sc.themes[0].theme_title || sc.themes[0].title || '');
    }
    if (!t2 && sc.themes[1]) {
      t2 = typeof sc.themes[1] === 'string' ? sc.themes[1] : (sc.themes[1].theme_title || sc.themes[1].title || '');
    }
  }

  if (!t1) t1 = sc.scenarioName || sc.scenario_title || 'Theme 1';
  if (!t2) t2 = t1 ? `${t1} (Part 2)` : 'Theme 2';
  return { theme1: t1, theme2: t2 };
}

async function readLesson(file) {
  if (!file || file.size > 10 * 1024 * 1024) throw new Error('Selecciona un archivo de lección de hasta 10 MB.');
  const ext = file.name.split('.').pop().toLowerCase();
  const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').trim();
  let media = null;
  let text = '';

  if (ext === 'pdf') {
    const data = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result.split(',')[1]);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    media = { mimeType: 'application/pdf', data };
    text = `Extract and structure the AOA English lesson from this uploaded file: "${file.name}". Theme / Title: ${baseName}.`;
  } else if (ext === 'docx') {
    const mammoth = await import('mammoth/mammoth.browser');
    text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value || '';
  } else if (ext === 'txt' || ext === 'doc' || ext === 'html' || ext === 'htm') {
    text = await file.text();
    if (ext === 'doc' || ext === 'html' || ext === 'htm') {
      if (/<(?:html|table|body|div)/i.test(text)) {
        text = plain(text);
      }
    }
  } else {
    throw new Error('Usa PDF, DOCX, DOC o TXT.');
  }

  if (text.trim().length < 15) {
    throw new Error('El archivo seleccionado no contiene suficiente texto legible.');
  }

  if (text.length > 50000) {
    text = text.slice(0, 50000);
  }

  const meta = detectLessonMetadata(text, baseName);

  return {
    text,
    media,
    title: meta.title || baseName,
    grade: meta.grade,
    scenario: meta.scenario,
    skill: meta.skill,
    lessonNum: meta.lessonNum,
    fileName: file.name
  };
}

export default function ResourceWorkbook({
  user,
  credits,
  isPremium,
  downloadsLeft,
  onTriggerAlert,
  onClose,
  initialPack = null,
  defaultGrade = '4th Grade',
  defaultScenario = null,
  defaultScenarioIndex = 0,
  defaultSkill = 'Listening',
  defaultLessonNum = 1,
  defaultThemeType = 'receptive',
  defaultProject21st = '',
  currentLessonHtml = null,
  currentLessonTitle = ''
}) {
  const [lesson, setLesson] = useState(null);
  const [source, setSource] = useState(currentLessonHtml ? 'current' : 'matrix'); // 'current' | 'matrix' | 'latest' | 'file'
  const [file, setFile] = useState(null);
  const [pack, setPack] = useState(initialPack);
  const [htmlUrl, setHtmlUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [viewMode, setViewMode] = useState('editorial'); // 'editorial' | 'pdf'
  const [busy, setBusy] = useState(false);
  const [exportingEditorial, setExportingEditorial] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [compilationMode, setCompilationMode] = useState('auto'); // 'auto' | 'ai'

  // Cascade Dropdown States (14 Grados x 8 Escenarios x 5 Habilidades)
  const [matrixGrade, setMatrixGrade] = useState(() => {
    const match = GRADES_CEFR_MAP.find(g => g.name === defaultGrade || defaultGrade?.includes(g.name));
    return match?.id || '4th';
  });
  const [matrixScenarios, setMatrixScenarios] = useState([]);
  const [matrixScenarioIndex, setMatrixScenarioIndex] = useState(defaultScenarioIndex || 0);
  const [matrixThemeNum, setMatrixThemeNum] = useState(() => (defaultThemeType === 'productive' ? 2 : 1));
  const [matrixSkill, setMatrixSkill] = useState(() => {
    if (defaultLessonNum && defaultLessonNum >= 1 && defaultLessonNum <= 5) {
      return SKILLS_AOA[defaultLessonNum - 1].id;
    }
    return defaultSkill || 'Listening';
  });
  const [matrixLoading, setMatrixLoading] = useState(false);

  const controller = useRef(null);
  const iframeRef = useRef(null);
  const editorialIframeRef = useRef(null);

  // Load scenarios dynamically when matrix grade changes
  useEffect(() => {
    const gradeItem = GRADES_CEFR_MAP.find(g => g.id === matrixGrade) || GRADES_CEFR_MAP[5];
    setMatrixLoading(true);
    fetch(`/curriculums/${gradeItem.file}`)
      .then(r => {
        if (!r.ok) throw new Error('No se pudo cargar el currículo del grado.');
        return r.json();
      })
      .then(data => {
        const list = Array.isArray(data.scenarios) ? data.scenarios : [];
        setMatrixScenarios(list);
        if (matrixScenarioIndex >= list.length) setMatrixScenarioIndex(0);
      })
      .catch(err => {
        console.warn('Error cargando escenarios curriculares:', err);
        setMatrixScenarios([]);
      })
      .finally(() => setMatrixLoading(false));
  }, [matrixGrade]);

  useEffect(() => {
    let active = true;
    databaseService.getSavedPlans(user.uid)
      .then(plans => { if (active) setLesson(latestAoa(plans)); })
      .catch(() => { if (active) setError('No se pudo cargar la última lección.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => {
      active = false;
      controller.current?.abort();
    };
  }, [user.uid]);

  useEffect(() => {
    if (!pack) return;
    let active = true;
    let nextHtmlUrl = '';
    let nextPdfUrl = '';

    try {
      const htmlContent = renderWorkbookHtml(pack);
      nextHtmlUrl = URL.createObjectURL(new Blob([htmlContent], { type: 'text/html' }));
      if (active) setHtmlUrl(nextHtmlUrl);

      const pdfDoc = buildWorkbook(pack);
      nextPdfUrl = URL.createObjectURL(pdfDoc.output('blob'));
      if (active) setPdfUrl(nextPdfUrl);
    } catch (e) {
      if (active) setError(e.message);
    }

    return () => {
      active = false;
      if (nextHtmlUrl) URL.revokeObjectURL(nextHtmlUrl);
      if (nextPdfUrl) URL.revokeObjectURL(nextPdfUrl);
    };
  }, [pack]);

  const generate = async (useAiParam) => {
    const shouldUseAi = typeof useAiParam === 'boolean' ? useAiParam : (compilationMode === 'ai');
    if (!isPremium && credits <= 0) {
      setError('Necesitas tokens para generar recursos.');
      return;
    }
    setBusy(true);
    setError('');
    controller.current = new AbortController();

    try {
      let input;
      if (source === 'current') {
        const detected = detectLessonMetadata(currentLessonHtml, currentLessonTitle);
        const scenarioName = detected.scenario || defaultScenario?.scenarioName || defaultScenario?.scenario_title || defaultScenario?.title || currentLessonTitle || 'AOA Lesson';
        const effectiveLessonNum = detected.lessonNum || defaultLessonNum || 1;
        const effectiveSkill = detected.skill || (SKILLS_AOA[effectiveLessonNum - 1] || SKILLS_AOA[0]).id;
        const cleanTitle = sanitizeThemeTitle(detected.title || currentLessonTitle || scenarioName);
        const effectiveGrade = detected.grade || defaultGrade;

        // Lesson 5 Mediation & 21st Century Project
        let project21st = defaultProject21st || '';
        if (!project21st && effectiveLessonNum === 5) {
          const projs = defaultScenario?.communicativeCompetences?.assessmentIdeas?.projects || defaultScenario?.assessmentIdeas?.projects || [];
          project21st = defaultThemeType === 'productive' ? (projs[1] || projs[0] || '') : (projs[0] || '');
        }

        input = {
          text: currentLessonHtml,
          grade: effectiveGrade,
          title: cleanTitle,
          scenario: scenarioName,
          skill: effectiveSkill,
          lessonNum: effectiveLessonNum,
          themeType: defaultThemeType,
          project21st,
          scenarioData: defaultScenario,
          isCurrent: true,
          forceAi: shouldUseAi
        };
      } else if (source === 'matrix') {
        const gradeItem = GRADES_CEFR_MAP.find(g => g.id === matrixGrade) || GRADES_CEFR_MAP[5];
        const currentScenario = matrixScenarios[matrixScenarioIndex] || {};
        const scenarioName = getScenarioTitle(currentScenario, matrixScenarioIndex);
        const { theme1, theme2 } = getScenarioThemes(currentScenario);
        const themeTitle = matrixThemeNum === 2 ? theme2 : theme1;
        const themeType = matrixThemeNum === 2 ? 'productive' : 'receptive';
        const skillObj = SKILLS_AOA.find(s => s.id === matrixSkill) || SKILLS_AOA[0];
        const isMediation = skillObj.number === 5;
        const projs = currentScenario.communicativeCompetences?.assessmentIdeas?.projects 
          || currentScenario.communicative_competences?.assessment_ideas?.projects 
          || currentScenario.assessmentIdeas?.projects 
          || currentScenario.twenty_first_century_projects
          || [];
        const project21st = matrixThemeNum === 2 ? (projs[1] || projs[0] || '') : (projs[0] || '');

        input = {
          isMatrix: true,
          forceAi: shouldUseAi,
          grade: gradeItem.name,
          cefr: gradeItem.cefr,
          scenario: scenarioName,
          scenarioIndex: matrixScenarioIndex,
          theme: themeTitle,
          title: themeTitle,
          themeNum: matrixThemeNum,
          themeType: themeType,
          skill: matrixSkill,
          lessonNum: skillObj.number,
          scenarioData: currentScenario,
          project21st: isMediation ? project21st : '',
          text: `EDUGEN PRO AOA MODULAR CURRICULUM LESSON
Grade: ${gradeItem.name} (CEFR: ${gradeItem.cefr})
Scenario ${matrixScenarioIndex + 1}: ${scenarioName}
Theme ${matrixThemeNum}: ${themeTitle} (${themeType === 'receptive' ? 'Receptive Focus · Weeks 1-2' : 'Productive Focus · Weeks 3-4'})
Skill Focus: ${matrixSkill} (Lesson ${skillObj.number}: ${skillObj.label})
Curriculum Details: ${JSON.stringify(currentScenario).slice(0, 2500)}`
        };
      } else if (source === 'file') {
        input = { ...(await readLesson(file)), isFile: true, forceAi: shouldUseAi };
      } else {
        if (!lesson) throw new Error('No hay una lección guardada disponible en el historial.');
        input = {
          text: lesson.content || '',
          grade: lesson.grade,
          title: lesson.title,
          scenario: lesson.lessonContext?.scenario || lesson.title,
          scenarioData: lesson.lessonContext?.scenarioData || null,
          forceAi: shouldUseAi
        };
      }

      const result = await generateActivityPack(input, controller.current.signal);
      result.title = sanitizeThemeTitle(result.title);

      if (source === 'current') {
        result.grade = defaultGrade;
        result.skill = input.skill;
        result.lessonNum = input.lessonNum;
        if (currentLessonTitle) result.title = sanitizeThemeTitle(currentLessonTitle);
      }
      if (source === 'file') {
        if (input.grade) result.grade = input.grade;
        if (input.title) result.title = sanitizeThemeTitle(input.title);
        if (input.scenario) result.scenario = input.scenario;
        if (input.skill) result.skill = input.skill;
        if (input.lessonNum) result.lessonNum = input.lessonNum;
      }
      if (source === 'latest' && lesson?.grade) result.grade = lesson.grade;
      if (source === 'matrix') {
        result.scenarioIndex = matrixScenarioIndex;
        result.lessonNum = SKILLS_AOA.find(s => s.id === matrixSkill)?.number || 1;
        result.skill = matrixSkill;
        result.title = sanitizeThemeTitle(input.title);
      }

      buildWorkbook(result); // Validate PDF build
      const now = new Date().toISOString();
      await databaseService.savePlanToLibrary(user.uid, {
        id: 'resources_' + Date.now(),
        type: 'resources',
        title: result.title,
        grade: result.grade,
        content: 'Printable activity workbook (PDF)',
        activityPack: result,
        sourceLesson: source === 'file' ? (file?.name || 'uploaded_lesson') : (source === 'matrix' ? `AOA_${result.grade}_SC${matrixScenarioIndex + 1}` : (lesson?.id || 'current_screen_lesson')),
        createdAt: now,
        updatedAt: now
      });
      // If AI was actually called, decrement credits
      if (result._usedAi) {
        await databaseService.decrementCredits(user.uid);
      }
      setPack(result);
      onTriggerAlert('¡Cuaderno pedagógico de 3 páginas estructurado con éxito según las etapas de la lección!', 'success');
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message || 'No se pudieron generar los recursos.');
    } finally {
      setBusy(false);
    }
  };

  const downloadSheets = () => {
    try {
      downloadAoaSheetsCsv(pack);
      onTriggerAlert('¡Hoja curricular AOA exportada para Google Sheets y Excel!', 'success');
    } catch (e) {
      setError(e.message || 'No se pudo exportar la hoja curricular.');
    }
  };

  const handlePrint = () => {
    const targetWin = (viewMode === 'editorial' && iframeRef.current?.contentWindow)
      ? iframeRef.current.contentWindow
      : (editorialIframeRef.current?.contentWindow || iframeRef.current?.contentWindow);

    if (targetWin) {
      targetWin.focus();
      targetWin.print();
    }
  };

  const downloadEditorial = async () => {
    if (!isPremium && downloadsLeft <= 0) {
      setError('Has agotado tus descargas disponibles.');
      return;
    }
    setExportingEditorial(true);
    setExportStatus('Iniciando exportación editorial...');
    try {
      const docTarget = (viewMode === 'editorial' && iframeRef.current?.contentDocument)
        ? iframeRef.current.contentDocument
        : editorialIframeRef.current?.contentDocument;

      await downloadEditorialPdf(pack, docTarget, msg => setExportStatus(msg));
      if (!isPremium) await databaseService.decrementDownloads(user.uid);
      onTriggerAlert('¡Libro editorial descargado con éxito en PDF!', 'success');
    } catch (e) {
      setError(e.message || 'No se pudo descargar el libro editorial en PDF.');
    } finally {
      setExportingEditorial(false);
      setExportStatus('');
    }
  };

  const downloadHtml = () => {
    try {
      downloadEditorialHtml(pack);
      onTriggerAlert('¡Archivo HTML del libro editorial descargado!', 'success');
    } catch (e) {
      setError(e.message);
    }
  };

  const download = async () => {
    if (!isPremium && downloadsLeft <= 0) {
      setError('Has agotado tus descargas disponibles.');
      return;
    }
    try {
      downloadWorkbook(pack);
      if (!isPremium) await databaseService.decrementDownloads(user.uid);
    } catch (e) {
      setError(e.message);
    }
  };

  const downloadDoc = async () => {
    if (!isPremium && downloadsLeft <= 0) {
      setError('Has agotado tus descargas disponibles.');
      return;
    }
    try {
      downloadWorkbookDoc(pack);
      if (!isPremium) await databaseService.decrementDownloads(user.uid);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 overflow-y-auto p-2 sm:p-4 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Recursos y rúbrica">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase block">Material Didáctico Imprimible</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Recursos & Rúbrica · Libro de Actividades</h2>
          </div>
          <button disabled={busy} onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-2 transition" aria-label="Cerrar">
            ✕
          </button>
        </div>

        {!initialPack && !pack && (
          <div className="space-y-4 my-5">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Genera un cuaderno de actividades auténtico con ilustraciones nítidas, diálogos, tablas, guías para el docente (scripts de audio) y rúbricas formativas según el enfoque AOA de Panamá.
            </p>

            <label className="block">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Modo de Origen Curricular</span>
              <select
                disabled={busy}
                className="block w-full p-3.5 mt-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={source}
                onChange={e => { setSource(e.target.value); setPack(null); setError(''); }}
              >
                {currentLessonHtml && (
                  <option value="current">📝 Lección actual en pantalla ({currentLessonTitle || 'Planificación abierta'})</option>
                )}
                <option value="matrix">⚡ Matriz Modular AOA (14 Grados × 8 Escenarios × 2 Temas × 5 Habilidades · 1,120 Lecciones)</option>
                <option value="latest">📁 Última lección AOA guardada en la plataforma</option>
                <option value="file">📄 Subir un archivo de lección (PDF, Word DOCX/DOC, TXT)</option>
              </select>
            </label>

            {source === 'current' && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-sm space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                    ✨ Planificación de Lección Vinculada Directamente
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    Foco: {defaultSkill} ({SKILLS_AOA.find(s => s.id === defaultSkill)?.label || defaultSkill})
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 dark:text-white text-base">
                  {currentLessonTitle || defaultScenario?.scenarioName || defaultScenario?.title || 'Lección AOA'}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Las actividades, preguntas de verificación, vocabulario y fotos reales se generarán extrayendo exactamente los contenidos, diálogos y tareas de acción de la lección que acabas de diseñar en el planificador.
                </p>
              </div>
            )}

            {source === 'matrix' && (
              <div className="space-y-3.5 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span>⚡</span> Matriz Curricular MEDUCA (14 Grados × 8 Escenarios × 2 Temas × 5 Habilidades)
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/80 text-indigo-800 dark:text-indigo-200">
                    1,120 Lecciones Maestras
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Paso A: Grado Escolar */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Paso A · Grado Escolar (CEFR)
                    </label>
                    <select
                      disabled={busy}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={matrixGrade}
                      onChange={e => setMatrixGrade(e.target.value)}
                    >
                      {GRADES_CEFR_MAP.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Paso B: Escenario Curricular */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Paso B · Escenario Curricular (1 al 8)
                    </label>
                    <select
                      disabled={busy || matrixLoading || !matrixScenarios.length}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={matrixScenarioIndex}
                      onChange={e => setMatrixScenarioIndex(Number(e.target.value))}
                    >
                      {matrixLoading ? (
                        <option value={0}>Cargando escenarios...</option>
                      ) : matrixScenarios.length ? (
                        matrixScenarios.map((sc, i) => (
                          <option key={i} value={i}>
                            {i + 1}. {getScenarioTitle(sc, i)}
                          </option>
                        ))
                      ) : (
                        <option value={0}>Escenario 1</option>
                      )}
                    </select>
                  </div>

                  {/* Paso C: Tema Curricular (Theme 1 o 2) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Paso C · Tema Curricular (1 o 2)
                    </label>
                    {(() => {
                      const sc = matrixScenarios[matrixScenarioIndex];
                      const { theme1, theme2 } = getScenarioThemes(sc);
                      return (
                        <select
                          disabled={busy || matrixLoading || !matrixScenarios.length}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none truncate"
                          value={matrixThemeNum}
                          onChange={e => setMatrixThemeNum(Number(e.target.value))}
                        >
                          <option value={1} title={`1. ${theme1} (Receptivo / Semanas 1-2)`}>
                            1. {theme1} (Receptivo)
                          </option>
                          <option value={2} title={`2. ${theme2} (Productivo / Semanas 3-4)`}>
                            2. {theme2} (Productivo)
                          </option>
                        </select>
                      );
                    })()}
                  </div>

                  {/* Paso D: Habilidad AOA */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Paso D · Habilidad AOA (1 a 5)
                    </label>
                    <select
                      disabled={busy}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={matrixSkill}
                      onChange={e => setMatrixSkill(e.target.value)}
                    >
                      {SKILLS_AOA.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pedagogical Guidance Summary Box */}
                {(() => {
                  const gItem = GRADES_CEFR_MAP.find(g => g.id === matrixGrade);
                  const sItem = SKILLS_AOA.find(s => s.id === matrixSkill);
                  const scItem = matrixScenarios[matrixScenarioIndex];
                  const scTitle = getScenarioTitle(scItem, matrixScenarioIndex);
                  const { theme1, theme2 } = getScenarioThemes(scItem);
                  const activeThemeTitle = matrixThemeNum === 2 ? theme2 : theme1;
                  const isPreK = matrixGrade === 'prek' || matrixGrade === 'kinder';
                  return (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-indigo-900 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="font-extrabold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                          <span>🎯 {scTitle}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-black border border-indigo-200">
                            {gItem?.cefr}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black border border-emerald-200">
                            Tema {matrixThemeNum}: {activeThemeTitle}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          <strong>{sItem?.label}</strong> · {sItem?.desc}
                        </p>
                      </div>
                      {isPreK && (
                        <span className="text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-lg shrink-0">
                          🌟 Preescolar: TPR Receptivo (Cero lectoescritura forzada)
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {source === 'latest' && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-sm">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">Lección Seleccionada</span>
                {loading ? 'Buscando última lección...' : lesson ? (
                  <div className="font-extrabold text-slate-800 dark:text-slate-100">
                    {lesson.title} <span className="text-indigo-600 dark:text-indigo-400 font-normal">· {lesson.grade}</span>
                  </div>
                ) : 'Primero genera una lección AOA o sube un archivo.'}
              </div>
            )}

            {source === 'file' && (
              <label className="block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Archivo de lección (máximo 2 MB)</span>
                <input
                  disabled={busy}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={e => { setFile(e.target.files[0]); setPack(null); }}
                />
              </label>
            )}

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 pt-2">
              {/* Selector de Modo de Compilación: Automatizado vs IA */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setCompilationMode('auto')}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    compilationMode === 'auto'
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title="Generación instantánea (0 Tokens) con alineación estricta a la matriz curricular y póster MEDUCA"
                >
                  <span className="text-amber-500 text-sm">⚡</span> Formato Automatizado (0 Tokens)
                </button>
                <button
                  type="button"
                  onClick={() => setCompilationMode('ai')}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    compilationMode === 'ai'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                  title="Compilación inteligente con IA (Gemini 2.5 Flash) para variaciones pedagógicas creativas"
                >
                  <span className="text-sm">🤖</span> Compilar con IA (Gemini)
                </button>
              </div>

              {/* Botón Principal de Generación */}
              <button
                disabled={busy || (source === 'current' ? !currentLessonHtml : source === 'latest' ? loading || !lesson : source === 'file' ? !file : matrixLoading)}
                onClick={() => generate(compilationMode === 'ai')}
                className={`w-full sm:w-auto text-white font-bold rounded-2xl px-8 py-3.5 disabled:opacity-40 transition shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
                  compilationMode === 'ai'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-purple-500/25'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                }`}
              >
                {busy ? (
                  <>
                    <span className="animate-spin text-lg">⏳</span> {compilationMode === 'ai' ? 'Compilando actividades con IA (Gemini)...' : 'Generando actividades pedagógicas e ilustraciones...'}
                  </>
                ) : compilationMode === 'ai' ? (
                  <>
                    <span>🤖</span> Compilar con IA (Gemini)
                  </>
                ) : (
                  <>
                    <span>⚡</span> Generar Formato Automatizado
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div role="alert" className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm font-medium my-4">
            ⚠️ {error}
          </div>
        )}

        {pack && (
          <div className="space-y-4 my-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setViewMode('editorial')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${viewMode === 'editorial' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                >
                  📖 Vista Libro Editorial (Ilustrado)
                </button>
                <button
                  onClick={() => setViewMode('pdf')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${viewMode === 'pdf' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                >
                  📄 Visor PDF Clásico
                </button>

                {/* Badge y Recompilación Rápida */}
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black tracking-wide border flex items-center gap-1.5 ml-1 ${
                  pack._usedAi
                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                }`}>
                  {pack._usedAi ? '🤖 Compilado con IA' : '⚡ Formato Automatizado'}
                </span>
                <button
                  disabled={busy}
                  onClick={() => generate(!pack._usedAi)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition flex items-center gap-1 active:scale-95 disabled:opacity-50"
                  title={pack._usedAi ? 'Recompilar en Formato Automatizado (Instantáneo / 0 Tokens)' : 'Recompilar enriqueciendo con IA (Gemini)'}
                >
                  {busy ? '⏳ Procesando...' : pack._usedAi ? '⚡ Cambiar a Automatizado' : '🤖 Recompilar con IA'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  disabled={exportingEditorial}
                  onClick={downloadEditorial}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-black px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 active:scale-95 disabled:opacity-60"
                  title="Descargar libro editorial con ilustraciones y diseño a color en formato PDF"
                >
                  {exportingEditorial ? (
                    <>
                      <span className="animate-spin text-sm">⏳</span> {exportStatus || 'Exportando PDF...'}
                    </>
                  ) : (
                    <>
                      <span>📖</span> Descargar PDF Editorial
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-3.5 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                  title="Imprimir o guardar como PDF en máxima resolución vectorial"
                >
                  🖨️ Imprimir
                </button>

                <button
                  onClick={download}
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center gap-1.5"
                  title="Descargar versión PDF clásica estándar (monocromática / bajo consumo de tinta)"
                >
                  📄 PDF Clásico
                </button>

                <button
                  onClick={downloadDoc}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                  title="Descargar versión editable para Microsoft Word"
                >
                  📝 Word (.doc)
                </button>

                <button
                  onClick={downloadSheets}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-teal-600/20"
                  title="Exportar hoja curricular AOA sincronizada para Google Sheets y Excel (Sección 4 AOA)"
                >
                  📊 Google Sheets
                </button>

                <button
                  onClick={downloadHtml}
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-600/20"
                  title="Descargar página web autónoma (.html) para proyectar o visualizar sin conexión"
                >
                  🌐 HTML
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              💡 <strong>Consejo para imprimir:</strong> En la ventana de impresión, selecciona destino <em>"Guardar como PDF"</em> para obtener máxima resolución de vectores y fuentes.
            </p>

            <div className="border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-inner bg-slate-950">
              <iframe
                ref={iframeRef}
                title="Vista previa del cuaderno educativo"
                src={viewMode === 'editorial' ? htmlUrl : pdfUrl}
                className="w-full h-[72vh] rounded-2xl bg-white"
              />
            </div>

            {/* Hidden offscreen iframe ensuring editorial document is always fully rendered for PDF export and printing */}
            {pack && htmlUrl && (
              <iframe
                ref={editorialIframeRef}
                title="Marco de renderizado editorial"
                src={htmlUrl}
                style={{ position: 'fixed', top: 0, left: '-9999px', width: '210mm', height: '3500px', visibility: 'hidden' }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
