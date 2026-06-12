import React, { useState } from 'react';
import {
  Layers,
  MapPin,
  FileText,
  Copy,
  Download,
  FileEdit,
  GraduationCap,
  FileCheck,
  Sparkles,
  Upload,
  Loader2
} from 'lucide-react';
import { generateCurriculumContent, extractCurriculumFromMedia } from '../services/ai';
import { databaseService } from '../services/firebase';
import SkeletonLoader from '../components/SkeletonLoader';
import EditorModal from '../components/EditorModal';
import AdBanner from '../components/AdBanner';

export default function ThemePlanner({ user, credits, onTriggerAlert, isPremium = false, triggerInterstitialAd, triggerRewardedAd }) {
  const [region, setRegion] = useState('');
  const [school, setSchool] = useState('');
  const [teacher, setTeacher] = useState('');
  const [grade, setGrade] = useState('5th Grade');
  const [trimester, setTrimester] = useState('1st');
  const [cefr, setCefr] = useState('A1.3');
  const [plannerNum, setPlannerNum] = useState(1);
  const [weeklyHours, setWeeklyHours] = useState(5);
  const [weeks, setWeeks] = useState(2);
  const [scenario, setScenario] = useState('');
  const [theme, setTheme] = useState('');
  const [scenarioNum, setScenarioNum] = useState('1');
  const [selectedTpSkills, setSelectedTpSkills] = useState([]);

  // Extraction loading states
  const [extracting, setExtracting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null); // { base64Data, mimeType, name }
  const [sourceType, setSourceType] = useState('preloaded'); // 'preloaded' | 'manual'
  const [pdfFilename, setPdfFilename] = useState('English_Curriculum_Grade_5.json');
  const [themeType, setThemeType] = useState('receptive'); // 'receptive' | 'interactive'

  const handleGradeChange = (val) => {
    setGrade(val);

    // Map grade string to number for filename
    let fileSuffix = '4';
    if (val === 'Pre-K') fileSuffix = 'PreK';
    else if (val === 'Kinder') fileSuffix = 'Kinder';
    else {
      const match = val.match(/\d+/);
      if (match) fileSuffix = match[0];
    }

    setPdfFilename(`English_Curriculum_Grade_${fileSuffix}.json`);

    // Auto-align CEFR levels based on MEDUCA Proficiency Bands image
    if (val === 'Pre-K') setCefr('Pre-A1.1');
    else if (val === 'Kinder') setCefr('Pre-A1.2');
    else if (val === '1st Grade') setCefr('Pre-A1.3');
    else if (val === '2nd Grade') setCefr('Pre-A1.4');
    else if (val === '3rd Grade') setCefr('A1.1');
    else if (val === '4th Grade') setCefr('A1.2');
    else if (val === '5th Grade') setCefr('A1.3');
    else if (val === '6th Grade') setCefr('A2.1');
    else if (val === '7th Grade') setCefr('A2.2');
    else if (val === '8th Grade') setCefr('A2.3');
    else if (val === '9th Grade') setCefr('A2.4');
    else if (val === '10th Grade') setCefr('B1.1');
    else if (val === '11th Grade') setCefr('B1.2');
    else if (val === '12th Grade') setCefr('B1.3');
  };

  // Generation Output states
  const [loading, setLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPlanObject, setCurrentPlanObject] = useState(null);

  const skills = [
    { id: 'Listening', label: 'LISTENING' },
    { id: 'Reading', label: 'READING' },
    { id: 'Speaking', label: 'SPEAKING' },
    { id: 'Writing', label: 'WRITING' },
    { id: 'Mediation', label: 'MEDIATION' },
  ];

  const toggleTpSkill = (skillId) => {
    if (selectedTpSkills.includes(skillId)) {
      setSelectedTpSkills(selectedTpSkills.filter(s => s !== skillId));
    } else {
      setSelectedTpSkills([...selectedTpSkills, skillId]);
    }
  };

  // Handler for uploading files / screenshots to extract curriculum inputs
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      setExtracting(true);

      // Extract raw base64 data by removing mime prefix
      const base64Content = reader.result.split(',')[1];

      try {
        const extracted = await extractCurriculumFromMedia(base64Content, file.type);

        // Store uploaded file to pass during document generation
        setUploadedFile({
          base64Data: base64Content,
          mimeType: file.type,
          name: file.name
        });

        // Auto-fill variables in the React forms
        if (extracted.theme) setTheme(extracted.theme);
        if (extracted.scenario) {
          setScenario(extracted.scenario);
          const matchNum = extracted.scenario.match(/scenario\s*(\d+)/i) || extracted.scenario.match(/escenario\s*(\d+)/i) || extracted.scenario.match(/\b(\d+)\b/);
          if (matchNum) {
            setScenarioNum(matchNum[1]);
          }
        }
        if (extracted.grade) {
          // Verify grade matches standard list values
          const standardGrades = ['Pre-K', 'Kinder', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];
          const matched = standardGrades.find(g => g.toLowerCase().includes(extracted.grade.toLowerCase()));
          if (matched) {
            setGrade(matched);
          } else {
            setGrade(extracted.grade);
          }
        }
        if (extracted.weeks) setWeeks(extracted.weeks);
        if (extracted.weeklyHours) setWeeklyHours(extracted.weeklyHours);

        onTriggerAlert("¡Datos extraídos con éxito! Se han auto-completado los campos del formulario.", "success");
      } catch (err) {
        console.error("Multimodal extractor failed:", err);
        // Even if extraction fails, save the file so the user can still use it for document generation
        setUploadedFile({
          base64Data: base64Content,
          mimeType: file.type,
          name: file.name
        });
        onTriggerAlert("Archivo cargado. No se pudieron extraer algunos campos automáticamente, completa manualmente.", "info");
      } finally {
        setExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (sourceType === 'manual' && (!theme || !scenario)) {
      onTriggerAlert("Por favor ingresa los campos obligatorios de Escenario y Tema.", "info");
      return;
    }
    if (selectedTpSkills.length === 0) {
      onTriggerAlert("Selecciona al menos una habilidad enfoque para el plan.", "info");
      return;
    }
    
    if (credits <= 0 && !isPremium) {
      const watchAd = window.confirm("No tienes tokens de generación. ¿Deseas ver un anuncio patrocinado de 10 segundos para ganar 1 token gratis?");
      if (watchAd) {
        triggerRewardedAd(async () => {
          await databaseService.incrementCredits(user.uid, 1);
          onTriggerAlert("¡Has ganado 1 token de regalo! Ahora puedes iniciar la generación.", "success");
        });
      } else {
        window.dispatchEvent(new CustomEvent('show-billing-modal'));
      }
      return;
    }

    if (credits <= 0) {
      onTriggerAlert("Saldo de Tokens insuficiente.", "error");
      return;
    }

    const proceedWithGeneration = async () => {
      setLoading(true);
      setGeneratedHtml('');

      let finalFile = uploadedFile;
      let scenarioData = null;
      let finalScenario = scenario;
      let finalTheme = theme;

      if (sourceType === 'preloaded') {
        setLoading(true);
        try {
          let response = await fetch(`/curriculums/${pdfFilename}`);
          if (!response.ok) {
            console.warn(`File ${pdfFilename} not found, trying fallback to English_Curriculum_Grade_4.json`);
            response = await fetch(`/curriculums/English_Curriculum_Grade_4.json`);
            if (!response.ok) {
              throw new Error(`No se pudo encontrar el archivo "${pdfFilename}" ni el archivo de respaldo "English_Curriculum_Grade_4.json" en public/curriculums/`);
            }
          }
          
          const curriculumJson = await response.json();
          scenarioData = curriculumJson.scenarios?.find(s => s.scenarioNum === parseInt(scenarioNum, 10));
          
          if (!scenarioData) {
            throw new Error(`No se encontró el escenario ${scenarioNum} en el currículo de grado.`);
          }

          if (!finalScenario) {
            finalScenario = scenarioData.scenarioName;
            setScenario(scenarioData.scenarioName);
          }
          if (!finalTheme) {
            finalTheme = themeType === 'receptive' ? scenarioData.theme1 : scenarioData.theme2;
            setTheme(finalTheme);
          }

          finalFile = {
            base64Data: '',
            mimeType: 'application/json',
            name: pdfFilename
          };
        } catch (err) {
          setLoading(false);
          onTriggerAlert(`Error: No se pudo cargar o procesar el archivo de currículo. Detalle: ${err.message}`, "error");
          return;
        }
      }

      const vars = {
        region: region || '_______________',
        school: school || '_______________',
        teacher: teacher || '_______________',
        grade,
        trimester,
        cefr,
        plannerNum,
        weeklyHrs: weeklyHours,
        weeks,
        scenarioNum,
        scenario: finalScenario || `Scenario ${scenarioNum}`,
        theme: finalTheme || `Theme from Scenario ${scenarioNum}`,
        themeType,
        skills: selectedTpSkills,
        scenarioData
      };

      try {
        const output = await generateCurriculumContent('theme_planner', vars, finalFile);
        setGeneratedHtml(output);

        // Decrement credits
        await databaseService.decrementCredits(user.uid);

        const newPlan = {
          id: `tp_${Date.now()}`,
          title: `Theme Planner #${plannerNum} - ${theme}`,
          type: 'theme_planner',
          grade: grade,
          content: output,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setCurrentPlanObject(newPlan);
        await databaseService.savePlanToLibrary(user.uid, newPlan);
        onTriggerAlert("¡Theme Planner oficial generado con éxito y guardado en tu biblioteca!", "success");

      } catch (e) {
        onTriggerAlert("Error al generar el Theme Planner. Intenta nuevamente.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (!isPremium) {
      triggerInterstitialAd(proceedWithGeneration);
    } else {
      proceedWithGeneration();
    }
  };

  const handleSaveEditedPlan = async (updatedPlan) => {
    try {
      await databaseService.savePlanToLibrary(user.uid, updatedPlan);
      setCurrentPlanObject(updatedPlan);
      setGeneratedHtml(updatedPlan.content);
      setIsEditorOpen(false);
      onTriggerAlert("¡Cambios guardados con éxito!", "success");
    } catch (e) {
      onTriggerAlert("Error al guardar los cambios.", "error");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHtml.replace(/<[^>]*>/g, ''));
    onTriggerAlert("¡Copiado!", "success");
  };

  const handleDownload = () => {
    const blob = new Blob(['\ufeff', generatedHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPlanObject?.title || 'Theme_Planner_MEDUCA'}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">

      {/* Form Aside Panel */}
      <aside className="lg:col-span-4 space-y-4">
        <div className="glass-panel p-5 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 border-t-4 border-t-emerald-500 space-y-5">

          <div className="flex items-center gap-2 mb-1 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-500"><Layers className="w-5 h-5" /></div>
            <div>
              <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 leading-none">Theme Planner</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">MEDUCA Panama Standards</p>
            </div>
          </div>

          {/* Origen del Currículo (Tabs) */}
          <div className="space-y-2 pb-3 border-b border-slate-150 dark:border-slate-800/60">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block">
              📂 Origen del Currículo
            </label>
            <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-950/40 p-1 rounded-xl">
              <button
                onClick={() => setSourceType('preloaded')}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all text-center ${sourceType === 'preloaded' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-650'}`}
              >
                Pre-cargado
              </button>
              <button
                onClick={() => setSourceType('manual')}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all text-center ${sourceType === 'manual' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-650'}`}
              >
                Subir Archivo
              </button>
            </div>

            {sourceType === 'preloaded' ? (
              <div className="space-y-2 mt-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Archivo de Currículo (.json)</label>
                  <input
                    type="text"
                    placeholder="English_Curriculum_Grade_5.json"
                    value={pdfFilename}
                    onChange={(e) => setPdfFilename(e.target.value)}
                    className="w-full border border-slate-200 dark:border-slate-850 rounded-xl px-3 py-2 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <p className="text-[8px] text-slate-400 dark:text-slate-500">Se buscará automáticamente en public/curriculums/</p>
                </div>
              </div>
            ) : (
              <div className="relative mt-2">
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  disabled={extracting}
                  className="hidden"
                  id="screenshot-uploader"
                />
                <label
                  htmlFor="screenshot-uploader"
                  className={`
                    w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-805 hover:border-emerald-500 dark:hover:border-emerald-400 bg-slate-50 dark:bg-slate-950/20 hover:bg-emerald-50/10 dark:hover:bg-emerald-500/5 cursor-pointer flex flex-col items-center justify-center text-center gap-1.5 transition duration-200
                    ${extracting ? 'opacity-50 pointer-events-none' : ''}
                  `}
                >
                  {extracting ? (
                    <>
                      <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                      <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-widest animate-pulse">
                        Extrayendo datos...
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-slate-400 dark:text-slate-500 hover:text-emerald-500 transition-colors" />
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                        Cargar Captura o PDF
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 leading-none block">
                        PNG, JPG, WEBP o PDF (Extracción IA)
                      </span>
                    </>
                  )}
                </label>
                {uploadedFile && (
                  <div className="mt-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="font-semibold truncate max-w-[180px]">{uploadedFile.name}</span>
                    </div>
                    <button
                      onClick={() => setUploadedFile(null)}
                      className="text-slate-400 hover:text-red-500 text-[10px] font-bold transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Info */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block">
              1. Institutional Header Info
            </label>
            <input
              type="text"
              placeholder="Regional Education Directorate of..."
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500/20"
            />
            <input
              type="text"
              placeholder="School Name"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500/20"
            />
            <input
              type="text"
              placeholder="Teacher(s) Name(s)"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Core Settings Grid */}
          <div className="space-y-2.5 pt-2 border-t border-slate-150 dark:border-slate-800/60">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block">
              2. General Planner Information
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Grade</label>
                <select
                  value={grade}
                  onChange={(e) => handleGradeChange(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {['Pre-K', 'Kinder', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Trimester</label>
                <select
                  value={trimester}
                  onChange={(e) => setTrimester(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {['1st', '2nd', '3rd'].map(t => (
                    <option key={t} value={t}>{t} Trimester</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">CEFR Level</label>
                <select
                  value={cefr}
                  onChange={(e) => setCefr(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  {[
                    'Pre-A1', 'Pre-A1.1', 'Pre-A1.2', 'Pre-A1.3', 'Pre-A1.4',
                    'A1', 'A1.1', 'A1.2', 'A1.3',
                    'A2', 'A2.1', 'A2.2', 'A2.3', 'A2.4',
                    'B1', 'B1.1', 'B1.2', 'B1.3',
                    'B2', 'C1'
                  ].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Planner #</label>
                <input
                  type="number"
                  value={plannerNum}
                  min="1"
                  max="20"
                  onChange={(e) => setPlannerNum(parseInt(e.target.value) || 1)}
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Weekly Hours</label>
                <input
                  type="number"
                  value={weeklyHours}
                  min="1"
                  max="20"
                  onChange={(e) => setWeeklyHours(parseInt(e.target.value) || 5)}
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Weeks</label>
                <input
                  type="number"
                  value={weeks}
                  min="1"
                  max="8"
                  onChange={(e) => setWeeks(parseInt(e.target.value) || 2)}
                  className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Scenario & Theme */}
          <div className="space-y-2.5 pt-2 border-t border-slate-150 dark:border-slate-800/60">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block">
              3. Topic & Content Focus
            </label>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Número de Escenario / Unidad</label>
              <select
                value={scenarioNum}
                onChange={(e) => setScenarioNum(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                  <option key={num} value={num.toString()}>Scenario {num}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Nombre del Escenario</label>
              <input
                type="text"
                placeholder={sourceType === 'preloaded' ? "Opcional (Ej: At the market - extraído de PDF)" : "Scenario Name (Ej: At the market)"}
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Tema / Unidad</label>
              <input
                type="text"
                placeholder={sourceType === 'preloaded' ? "Opcional (Ej: Healthy Eating - extraído de PDF)" : "Theme / Topic (Ej: Healthy Eating Habits)"}
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            {sourceType === 'preloaded' && (
              <p className="text-[9px] text-emerald-600 dark:text-emerald-400 italic leading-snug mt-1">
                💡 Al usar PDF pre-cargado, si dejas vacío el Nombre y Tema, la IA los extraerá automáticamente buscando el escenario en el documento.
              </p>
            )}
          </div>

          {/* Enfoque del Theme Planner (Receptivo vs Interactivo) */}
          <div className="space-y-2 pt-2 border-t border-slate-150 dark:border-slate-800/60">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block">
              🔄 Enfoque del Planificador
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setThemeType('receptive')}
                className={`
                  py-2 px-2 rounded-xl text-[10px] font-bold border transition-all text-center
                  ${themeType === 'receptive'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }
                `}
              >
                1. Receptivo
              </button>
              <button
                onClick={() => setThemeType('interactive')}
                className={`
                  py-2 px-2 rounded-xl text-[10px] font-bold border transition-all text-center
                  ${themeType === 'interactive'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }
                `}
              >
                2. Interactivo
              </button>
            </div>
            <p className="text-[8px] text-slate-400 dark:text-slate-500 mt-1 leading-normal">
              {themeType === 'receptive'
                ? 'Enfoque en destrezas de lectura y escucha (Listening, Reading, Mediation).'
                : 'Enfoque en destrezas productivas y activas (Speaking, Writing, Interaction).'
              }
            </p>
          </div>

          {/* TP Target Skills */}
          <div className="space-y-2 pt-2 border-t border-slate-150 dark:border-slate-800/60">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block">
              5. Target Focus Skills *
            </label>
            <div className="grid grid-cols-2 gap-1.5" id="tpSkillSelector">
              {skills.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleTpSkill(s.id)}
                  className={`
                    skill-badge py-2 px-2.5 rounded-xl text-[9px] font-bold border transition-all text-center
                    ${selectedTpSkills.includes(s.id)
                      ? 'active-theme'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }
                  `}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 text-xs"
        >
          <Sparkles className="w-4 h-4" /> GENERAR THEME PLANNER COMPLETO
        </button>

        {/* Sidebar Ad Banner */}
        <AdBanner type="sidebar" isPremium={isPremium} />
      </aside>

      {/* Main Results Display Workspace */}
      <main className="lg:col-span-8 space-y-4">
        {loading ? (
          <div className="glass-panel p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border-t-8 border-t-emerald-500 shadow-xl flex flex-col justify-center min-h-[600px]">
            <div className="flex flex-col items-center justify-center py-8">
              <SkeletonLoader type="table" />
              <p className="text-emerald-500 dark:text-emerald-400 font-extrabold text-xs animate-pulse tracking-widest mt-6">
                COMPILANDO THEME PLANNER — NORMAS MCER & MEDUCA...
              </p>
            </div>
          </div>
        ) : generatedHtml ? (
          <div className="glass-panel p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border-t-8 border-t-emerald-600 shadow-xl min-h-[600px] flex flex-col justify-between">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/40">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-tighter text-sm">
                  Documento Theme Planner
                </h3>
              </div>
              <div className="flex items-center gap-1.5 w-full md:w-auto">
                <button
                  onClick={handleCopy}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  title="Copiar Texto"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditorOpen(true)}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  title="Editar en hoja A4"
                >
                  <FileEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDownload}
                  className="bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-emerald-500/20"
                >
                  <Download className="w-4 h-4" /> EXPORTAR .DOC
                </button>
              </div>
            </div>

            <div className="overflow-x-auto flex-1 mb-6">
              <div
                className="meduca-table-container leading-relaxed text-sm font-sans"
                dangerouslySetInnerHTML={{ __html: generatedHtml }}
              />
            </div>
          </div>
        ) : (
          <div className="glass-panel p-24 rounded-3xl text-center border-4 border-dashed border-slate-200 dark:border-slate-800 min-h-[600px] flex flex-col justify-center items-center">
            <div className="bg-slate-100 dark:bg-slate-900/60 w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-800">
              <Layers className="text-slate-400 dark:text-slate-600 w-10 h-10" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-bold font-display text-base">
              Genera un Theme Planner Oficial
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1.5 leading-relaxed">
              Esquematiza la planificación general de unidades de inglés de 2 a 4 semanas. Se generarán los estándares de habilidades enfocados en los objetivos del MCER.
            </p>
          </div>
        )}
      </main>

      {/* Editor Modal */}
      <EditorModal
        isOpen={isEditorOpen}
        plan={currentPlanObject}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveEditedPlan}
      />

    </div>
  );
}
