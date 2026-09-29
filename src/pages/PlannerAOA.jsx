import ScenarioPoster from '../components/ScenarioPoster';
import ResourceWorkbook from '../components/ResourceWorkbook';
import ConversationalAudioStudio from '../components/ConversationalAudioStudio';
import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Copy, 
  Download, 
  FileEdit, 
  AlertCircle, 
  FileCheck,
  Play,
  Pause,
  Square,
  Volume2,
  Lock
} from 'lucide-react';
import { generateCurriculumContent } from '../services/ai';
import { databaseService } from '../services/firebase';
import SkeletonLoader from '../components/SkeletonLoader';
import EditorModal from '../components/EditorModal';
import AdBanner from '../components/AdBanner';
import { buildAoaFields, curriculumFilename, lessonSkills } from '../services/aoaCurriculum';
import { finishAoaPlanner } from '../services/aoaOutput';

export default function PlannerAOA({ user, credits, onTriggerAlert, isPremium = false, downloadsLeft = 3, triggerInterstitialAd, triggerRewardedAd }) {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(['Listening']);
  const [grade, setGrade] = useState('5th Grade');
  const [lessonNum, setLessonNum] = useState(1);
  const [scenario, setScenario] = useState('');
  const [theme, setTheme] = useState('');
  const [communicativeComp, setCommunicativeComp] = useState('');
  const [specificObjective, setSpecificObjective] = useState('');
  const [learningOutcome, setLearningOutcome] = useState('');
  const [project21st, setProject21st] = useState('');

  const [curriculumState, setCurriculumState] = useState({ grade: '', scenarios: [], error: '' });
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [themeType, setThemeType] = useState('receptive');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const curriculumReady = curriculumState.grade === grade && curriculumState.scenarios.length > 0;
  const selectedScenario = curriculumReady ? curriculumState.scenarios[scenarioIndex] : null;

  React.useEffect(() => {
    const controller = new AbortController();
    fetch('/curriculums/' + curriculumFilename(grade), { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('No se pudo cargar el currículo de este grado. Recarga la página para reintentar.');
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data.scenarios) || !data.scenarios.length) throw new Error('Este currículo no contiene escenarios.');
        const rawCefr = data.proficiency_level || data.cefrLevel || data.cefr_level || data.level || data.scenarios?.[0]?.level || data.scenarios?.[0]?.proficiency_level || '';
        if (!controller.signal.aborted) setCurriculumState({ grade, scenarios: data.scenarios, cefr: rawCefr, error: '' });
      })
      .catch(error => {
        if (!controller.signal.aborted) setCurriculumState({ grade, scenarios: [], error: error.message });
      });
    return () => controller.abort();
  }, [grade]);

  React.useEffect(() => {
    const fields = selectedScenario ? buildAoaFields(selectedScenario, themeType, selectedSkills) : {};
    setScenario(fields.scenario || '');
    setTheme(fields.theme || '');
    setCommunicativeComp(fields.communicativeComp || '');
    setSpecificObjective(fields.specificObjective || '');
    setLearningOutcome(fields.learningOutcome || '');
    setProject21st(fields.project21st || '');
  }, [selectedScenario, themeType, selectedSkills]);

  // Generation Output states
  const [loading, setLoading] = useState(false);
  const [activeGenType, setActiveGenType] = useState(''); // 'planner' | 'delivery' | 'resources'
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPlanObject, setCurrentPlanObject] = useState(null);

  const isJsonString = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const convertScriptJsonToHtml = (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px; background: #fff;">
  <div style="text-align: center; margin-bottom: 20px; border-bottom: 3px double #1a3a5c; padding-bottom: 10px;">
    <h2 style="font-size: 14px; font-weight: bold; margin: 2px 0; color: #1a3a5c;">MINISTRY OF EDUCATION</h2>
    <h3 style="font-size: 12px; font-weight: bold; margin: 2px 0; color: #1a3a5c;">EFL CLASSROOM LISTENING RESOURCE</h3>
    <h3 style="font-size: 12px; font-weight: bold; margin: 2px 0;">🎧 LISTENING SCRIPT: ${parsed.title || 'Finding My Next Adventure!'}</h3>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; border: 1px dashed #1a5276;">
    <tr style="background: #d6eaf8;">
      <td style="font-weight: bold; border: 1px solid #ccc; padding: 8px; width: 120px;">Setting:</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${parsed.setting || 'In the Classroom'}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; border: 1px solid #ccc; padding: 8px;">Characters:</td>
      <td style="border: 1px solid #ccc; padding: 8px;">
        ${(parsed.characters || []).map(c => `<b>${c.name}</b> (${c.role})`).join(', ')}
      </td>
    </tr>
  </table>

  <div style="border: 2px dashed #1a5276; padding: 20px; border-radius: 8px; font-family: 'Courier New', monospace; background: #fdfefe; font-size: 12px; margin-bottom: 25px;">
    ${(parsed.script || []).map(turn => `
      <p style="margin: 8px 0;"><b>${turn.speaker.toUpperCase()}:</b> "${turn.text}"</p>
    `).join('')}
  </div>

  <div style="background-color:#1a3a5c; color:white; font-weight:bold; font-size:12px; padding:6px 10px; margin-bottom: 10px;">
    COMPREHENSION QUESTIONS
  </div>
  <ol style="font-size: 12px; padding-left: 20px; margin-bottom: 20px;">
    ${(parsed.comprehensionQuestions || []).map(q => `
      <li style="margin-bottom: 8px;"><b>${q}</b><br/><span style="color:#666;">Answer: ____________________________________________________</span></li>
    `).join('')}
  </ol>
</div>
      `;
    } catch (e) {
      return `<div>${jsonStr}</div>`;
    }
  };

  const skills = [
    { id: 'Listening', label: 'LISTENING' },
    { id: 'Reading', label: 'READING' },
    { id: 'Speaking', label: 'SPEAKING' },
    { id: 'Writing', label: 'WRITING' },
    { id: 'Mediation', label: 'MEDIATION' },
  ];

  const toggleSkill = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleGenerate = async (type) => {
    if (!curriculumReady || !selectedScenario) {
      onTriggerAlert('Espera a que cargue el currículo y selecciona un escenario.', 'info');
      return;
    }
    if (!theme || !specificObjective || selectedSkills.length === 0) {
      setDetailsOpen(true);
      onTriggerAlert("Selecciona una habilidad y completa el objetivo en los detalles si falta en el currículo.", "info");
      return;
    }

    // Check 5-plan limit for free users
    if (!isPremium && credits <= 0) {
      // First check if they have plans in library
      const existingPlans = await databaseService.getSavedPlans(user.uid);
      if (existingPlans.length >= 5) {
        window.dispatchEvent(new CustomEvent('show-billing-modal'));
        onTriggerAlert("🎉 ¡Alcanzaste el límite de 5 planeaciones gratuitas! Consigue más tokens o activa PRO para seguir generando sin límites.", "info");
        return;
      }

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

    if (credits <= 0 && !isPremium) {
      onTriggerAlert("Saldo de Tokens insuficiente. Por favor haz clic en 'Recargar' para obtener más tokens.", "error");
      return;
    }

    const proceedWithGeneration = async () => {
      setLoading(true);
      setActiveGenType(type);
      setGeneratedHtml('');
      
      const vars = {
        skills: selectedSkills,
        grade,
        cefr: curriculumState.cefr || '',
        lessonNum,
        scenario,
        theme,
        objective: specificObjective,
        outcome: learningOutcome,
        communicativeComp,
        project21st: lessonNum === 5 ? project21st : ''
      };

      try {
        const response = await generateCurriculumContent(type, vars);
        const output = type === 'planner' ? finishAoaPlanner(response) : response;
        setGeneratedHtml(output);

        // Decrement credits securely
        await databaseService.decrementCredits(user.uid);

        // Structure document title
        const docTitles = {
          planner: `Planner AOA - ${theme} (L${lessonNum})`,
          delivery: `Lesson Delivery - ${theme} (L${lessonNum})`,
          resources: `Recursos Impresibles - ${theme} (L${lessonNum})`,
          listeningscript: `Script de Listening - ${theme} (L${lessonNum})`
        };
        
        const newPlan = {
          id: `${type}_${Date.now()}`,
          title: docTitles[type] || `EduGen Plan_${Date.now()}`,
          type: type,
          grade: grade,
          content: output,
          ...(type === 'planner' ? { lessonContext: vars } : {}),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setCurrentPlanObject(newPlan);
        
        // Auto-save plan to teacher library in Firestore/LocalStorage
        await databaseService.savePlanToLibrary(user.uid, newPlan);
        onTriggerAlert(`¡Planeación generada con éxito! Tu documento ha sido guardado automáticamente en 'Mi Biblioteca'.`, "success");

      } catch (error) {
        console.error(error);
        onTriggerAlert("Error de conexión al generar el plan. Intenta nuevamente.", "error");
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
      onTriggerAlert("Error al guardar los cambios del plan.", "error");
    }
  };

  const handleCopy = () => {
    let contentToCopy = generatedHtml;
    if (activeGenType === 'listeningscript' && isJsonString(generatedHtml)) {
      contentToCopy = convertScriptJsonToHtml(generatedHtml);
    }
    navigator.clipboard.writeText(contentToCopy.replace(/<[^>]*>/g, ''));
    onTriggerAlert("¡Contenido copiado al portapapeles en formato de texto plano!", "success");
  };

  const handleDownload = () => {
    if (!isPremium) {
      if (downloadsLeft <= 0) {
        window.dispatchEvent(new CustomEvent('show-billing-modal'));
        onTriggerAlert("Has agotado tus descargas gratuitas. La descarga ilimitada en Word está disponible solo para usuarios PRO. ¡Actualiza tu plan!", "info");
        return;
      }
      databaseService.decrementDownloads(user.uid);
      onTriggerAlert(`Descarga iniciada. Te quedan ${downloadsLeft - 1} descargas gratuitas de tus generaciones.`, "success");
    }
    let contentToDownload = activeGenType === 'planner' ? finishAoaPlanner(generatedHtml) : generatedHtml;
    if (activeGenType === 'listeningscript' && isJsonString(generatedHtml)) {
      contentToDownload = convertScriptJsonToHtml(generatedHtml);
    }
    const blob = new Blob(['\ufeff', contentToDownload], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPlanObject?.title || 'Planner_EduGen'}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      
      {/* Form Aside Panel */}
      <aside className="lg:col-span-4 space-y-4">
        <div className="glass-panel p-5 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 space-y-5">
          <div className="space-y-3">
            <label className="block text-xs">Grado
              <select value={grade} disabled={loading} onChange={e => { setGrade(e.target.value); setScenarioIndex(0); setThemeType('receptive'); }} className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300">
                {['Pre-K', 'Kinder', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </label>
            <label className="block text-xs">Escenario
              <select value={scenarioIndex} disabled={!curriculumReady || loading} onChange={e => { setScenarioIndex(Number(e.target.value)); setThemeType('receptive'); }} className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300">
                {!curriculumReady && <option value={0}>{curriculumState.grade !== grade ? 'Cargando currículo…' : 'Currículo no disponible'}</option>}
                {curriculumReady && curriculumState.scenarios.map((item, index) => <option key={index} value={index}>{index + 1}. {item.scenarioName || item.scenario_title || item.title}</option>)}
              </select>
            </label>
            <label className="block text-xs">Tema
              <select value={themeType} disabled={!selectedScenario || loading} onChange={e => setThemeType(e.target.value)} className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300">
                {['receptive', 'interactive'].map((type, index) => <option key={type} value={type} disabled={!!selectedScenario && !buildAoaFields(selectedScenario, type, []).theme}>Theme {index + 1}{selectedScenario ? ' — ' + buildAoaFields(selectedScenario, type, []).theme : ''}</option>)}
              </select>
            </label>
            <label className="block text-xs">Lección
              <select value={lessonNum} disabled={loading} onChange={e => { const number = Number(e.target.value); setLessonNum(number); setSelectedSkills([lessonSkills[number - 1]]); }} className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300">
                {lessonSkills.map((skill, index) => <option key={skill} value={index + 1}>{index + 1} — {skill}</option>)}
              </select>
            </label>
            <p className="text-xs text-slate-500">Los datos se completan con el currículo seleccionado. Puedes ajustar la habilidad y los detalles antes de generar.</p>
            {curriculumState.grade === grade && curriculumState.error && <p role="alert" className="text-xs text-red-500">{curriculumState.error}</p>}
            {selectedScenario && (!theme || !specificObjective || !learningOutcome || !communicativeComp) && <p role="status" className="text-xs text-amber-600">Este currículo tiene datos incompletos para la selección. Revisa «Ver o ajustar detalles».</p>}
          </div>
          <details open={detailsOpen} onToggle={e => setDetailsOpen(e.currentTarget.open)} className="space-y-4">
            <summary className="cursor-pointer text-sm font-bold">Ver o ajustar detalles</summary>
            <label className="block text-xs">Escenario
              <input value={scenario} onChange={e => setScenario(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-3 py-2.5 text-xs" />
            </label>
            <label className="block text-xs">Tema / Contenido
              <input value={theme} onChange={e => setTheme(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 px-3 py-2.5 text-xs" />
            </label>
          {/* Target Skills Focus */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
              Habilidades Enfoque AOA *
            </label>
            <div className="grid grid-cols-2 gap-1.5" id="skillSelector">
              {skills.map(s => (
                <button
                  key={s.id}
                  onClick={() => toggleSkill(s.id)}
                  className={`
                    skill-badge py-2.5 px-2 rounded-xl text-[10px] font-bold border transition-all text-center
                    ${selectedSkills.includes(s.id) 
                      ? 'active-aoa' 
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }
                  `}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            <textarea 
              rows="2" 
              placeholder="Competencias comunicativas (Linguistic, Pragmatic...)" 
              value={communicativeComp}
              onChange={(e) => setCommunicativeComp(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 italic"
            />
            {lessonNum === 5 && (
              <div className="space-y-1.5 pt-1 animate-fade-in">
                <label className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Proyecto 21st Century Skills *
                </label>
                <textarea 
                  rows="2.5" 
                  placeholder="Inserta el proyecto del escenario (Ej: Crear un póster de reciclaje, una presentación sobre hábitos saludables, etc.)" 
                  value={project21st}
                  onChange={(e) => setProject21st(e.target.value)}
                  className="w-full border border-blue-200 dark:border-blue-800 rounded-xl px-3 py-2.5 text-xs bg-blue-50/10 dark:bg-blue-950/10 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 italic"
                />
                <span className="text-[9px] text-slate-450 dark:text-slate-500 block leading-normal">
                  Proporciona contexto al sistema para que estructure la lección de mediación en torno a este proyecto.
                </span>
              </div>
            )}
          </div>

          {/* Objectives */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Estándares MEDUCA</label>
            <textarea 
              rows="2" 
              placeholder="Objetivo Específico * (E.g., Students will be able to...)" 
              value={specificObjective}
              onChange={(e) => setSpecificObjective(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <textarea 
              rows="2" 
              placeholder="Resultado de Aprendizaje (E.g., Produce a short dialogue...)" 
              value={learningOutcome}
              onChange={(e) => setLearningOutcome(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          </details>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => handleGenerate('planner')} 
            disabled={loading || !curriculumReady}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 text-xs"
          >
            <BookOpen className="w-4 h-4" /> GENERAR PLANNER (ENG)
          </button>
          
          <button 
            onClick={() => handleGenerate('delivery')} 
            disabled={loading || !curriculumReady}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 text-xs"
          >
            <Sparkles className="w-4 h-4" /> LESSON DELIVERY (ESP)
          </button>
          
          <button 
            onClick={() => setResourcesOpen(true)}
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-3 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-violet-500/15 flex items-center justify-center gap-2 text-xs"
          >
            <Sparkles className="w-4 h-4" /> 📚 CUADERNO DE ACTIVIDADES (PDF)
          </button>

          <button 
            onClick={() => setActiveGenType('listeningscript')} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 text-xs cursor-pointer"
          >
            <Volume2 className="w-4 h-4" /> 🎧 SCRIPT A AUDIO
          </button>
        </div>

        {/* Sidebar Ad Banner */}
        <ScenarioPoster user={user} credits={credits} isPremium={isPremium} cefr={curriculumState.cefr || ''} grade={grade} scenario={selectedScenario} index={scenarioIndex} allScenarios={curriculumState.scenarios} ready={curriculumReady && !!selectedScenario} />
        <AdBanner type="sidebar" isPremium={isPremium} />
      </aside>

      {/* Main Results Display Workspace */}
      <main className="lg:col-span-8 space-y-4">
        {activeGenType === 'listeningscript' ? (
          <ConversationalAudioStudio 
            user={user}
            credits={credits}
            isPremium={isPremium}
            onTriggerAlert={onTriggerAlert}
            currentLessonHtml={generatedHtml}
            lessonTitle={theme || (selectedScenario ? (selectedScenario.scenarioName || selectedScenario.title) : 'Conversación')}
            grade={grade}
            scenario={scenario}
            theme={theme}
            onBackToPlanner={() => setActiveGenType(generatedHtml ? 'planner' : '')}
            onGenerateAiScript={() => handleGenerate('listeningscript')}
            loadingAiScript={loading}
          />
        ) : loading ? (
          <div className="glass-panel p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border-t-8 border-t-blue-500 shadow-xl flex flex-col justify-center min-h-[600px]">
            <div className="flex flex-col items-center justify-center py-8">
              <SkeletonLoader type="table" />
              <p className="text-blue-500 dark:text-blue-400 font-extrabold text-xs animate-pulse tracking-widest mt-6">
                PLANIFICANDO BAJO EL ENFOQUE AOA DE PANAMÁ...
              </p>
            </div>
          </div>
        ) : generatedHtml ? (
          <div className="glass-panel p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border-t-8 border-t-blue-600 shadow-xl min-h-[600px] flex flex-col justify-between">
            {/* Header controls inside result panel */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/40">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-blue-500" />
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-tighter text-sm">
                  Vista Previa Curricular
                </h3>
              </div>
              <div className="flex items-center gap-1.5 w-full md:w-auto">
                <button 
                  onClick={() => setActiveGenType('listeningscript')} 
                  className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 transition cursor-pointer"
                  title="Abrir estudio de audio y generar diálogo hablado"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>AUDIO (TTS)</span>
                </button>
                <button 
                  onClick={() => setResourcesOpen(true)} 
                  className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/30 dark:hover:bg-violet-900/40 text-violet-700 dark:text-violet-300 border border-violet-500/20 transition cursor-pointer"
                  title="Abrir cuaderno de actividades imprimible para esta clase"
                >
                  <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  <span>ACTIVIDADES (PDF)</span>
                </button>
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
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border ${
                    !isPremium && downloadsLeft <= 0
                      ? 'border-amber-250 dark:border-amber-900/40 text-amber-500 hover:text-amber-600 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
                      : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-500/20'
                  }`}
                >
                  {!isPremium && downloadsLeft <= 0 ? (
                    <>
                      <Lock className="w-4 h-4 text-amber-500" /> SOLO PRO: EXPORTAR .DOC
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> 
                      {isPremium 
                        ? 'EXPORTAR .DOC' 
                        : `EXPORTAR .DOC (${downloadsLeft} gratis)`}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Generated HTML Output Render */}
            <div className="overflow-x-auto flex-1 mb-6 font-sans">
              <div 
                className="meduca-table-container leading-relaxed text-sm font-sans"
                dangerouslySetInnerHTML={{ __html: generatedHtml }}
              />
            </div>
          </div>
        ) : (
          <div className="glass-panel p-24 rounded-3xl text-center border-4 border-dashed border-slate-200 dark:border-slate-800 min-h-[600px] flex flex-col justify-center items-center">
            <div className="bg-slate-100 dark:bg-slate-900/60 w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-800">
              <BookOpen className="text-slate-400 dark:text-slate-600 w-10 h-10" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-bold font-display text-base">
              Configura los campos de tu clase
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1.5 leading-relaxed">
              Selecciona las habilidades y define tu tema. Al hacer clic en generar, la IA procesará la secuencia didáctica AOA oficial.
            </p>
          </div>
        )}
      </main>

      {resourcesOpen && (
        <ResourceWorkbook
          user={user}
          credits={credits}
          isPremium={isPremium}
          downloadsLeft={downloadsLeft}
          onTriggerAlert={onTriggerAlert}
          onClose={() => setResourcesOpen(false)}
          defaultGrade={grade}
          defaultScenario={selectedScenario}
          defaultScenarioIndex={scenarioIndex}
          defaultSkill={selectedSkills?.[0] || 'Listening'}
          defaultLessonNum={lessonNum}
          defaultThemeType={themeType}
          defaultProject21st={project21st}
          currentLessonHtml={generatedHtml}
          currentLessonTitle={theme || (selectedScenario ? (selectedScenario.scenarioName || selectedScenario.scenario_title || selectedScenario.title) : 'Secuencia AOA')}
        />
      )}
      {/* Editor Modal Sheet */}
      <EditorModal 
        isOpen={isEditorOpen}
        plan={currentPlanObject}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveEditedPlan}
        isPremium={isPremium}
        isLibrary={false}
        downloadsLeft={downloadsLeft}
        onDecrementDownloads={() => databaseService.decrementDownloads(user.uid)}
        onTriggerAlert={onTriggerAlert}
      />
      
    </div>
  );
}
