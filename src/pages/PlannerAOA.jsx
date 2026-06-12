import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Copy, 
  Download, 
  FileEdit, 
  AlertCircle, 
  FileCheck 
} from 'lucide-react';
import { generateCurriculumContent } from '../services/ai';
import { databaseService } from '../services/firebase';
import SkeletonLoader from '../components/SkeletonLoader';
import EditorModal from '../components/EditorModal';
import AdBanner from '../components/AdBanner';

export default function PlannerAOA({ user, credits, onTriggerAlert, isPremium = false, triggerInterstitialAd, triggerRewardedAd }) {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [grade, setGrade] = useState('5th Grade');
  const [lessonNum, setLessonNum] = useState(1);
  const [scenario, setScenario] = useState('');
  const [theme, setTheme] = useState('');
  const [communicativeComp, setCommunicativeComp] = useState('');
  const [specificObjective, setSpecificObjective] = useState('');
  const [learningOutcome, setLearningOutcome] = useState('');

  // Generation Output states
  const [loading, setLoading] = useState(false);
  const [activeGenType, setActiveGenType] = useState(''); // 'planner' | 'delivery' | 'resources'
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

  const toggleSkill = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleGenerate = async (type) => {
    if (!theme || !specificObjective || selectedSkills.length === 0) {
      onTriggerAlert("Por favor completa los campos obligatorios: Habilidades, Tema/Contenido y Objetivo Específico.", "info");
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
        lessonNum,
        scenario,
        theme,
        objective: specificObjective,
        outcome: learningOutcome,
        communicativeComp
      };

      try {
        const output = await generateCurriculumContent(type, vars);
        setGeneratedHtml(output);

        // Decrement credits securely
        await databaseService.decrementCredits(user.uid);

        // Structure document title
        const docTitles = {
          planner: `Planner AOA - ${theme} (L${lessonNum})`,
          delivery: `Lesson Delivery - ${theme} (L${lessonNum})`,
          resources: `Recursos Impresibles - ${theme} (L${lessonNum})`
        };
        
        const newPlan = {
          id: `${type}_${Date.now()}`,
          title: docTitles[type] || `EduGen Plan_${Date.now()}`,
          type: type,
          grade: grade,
          content: output,
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
    navigator.clipboard.writeText(generatedHtml.replace(/<[^>]*>/g, ''));
    onTriggerAlert("¡Contenido copiado al portapapeles en formato de texto plano!", "success");
  };

  const handleDownload = () => {
    const blob = new Blob(['\ufeff', generatedHtml], { type: 'application/msword' });
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

          {/* Grade & Lesson */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Grado</label>
              <select 
                value={grade} 
                onChange={(e) => setGrade(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {['Pre-K', 'Kinder', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Lección #</label>
              <input 
                type="number" 
                value={lessonNum} 
                min="1" 
                max="5"
                onChange={(e) => setLessonNum(parseInt(e.target.value) || 1)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Scenario & Theme */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase block">Contexto & Contenido</label>
            <input 
              type="text" 
              placeholder="Escenario (Ej: Planning a party)" 
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20"
            />
            <input 
              type="text" 
              placeholder="Tema / Contenido * (Ej: Food and Drinks)" 
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500/20"
            />
            <textarea 
              rows="2" 
              placeholder="Competencias comunicativas (Linguistic, Pragmatic...)" 
              value={communicativeComp}
              onChange={(e) => setCommunicativeComp(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 italic"
            />
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
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => handleGenerate('planner')} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 text-xs"
          >
            <BookOpen className="w-4 h-4" /> GENERAR PLANNER (ENG)
          </button>
          
          <button 
            onClick={() => handleGenerate('delivery')} 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 text-xs"
          >
            <Sparkles className="w-4 h-4" /> LESSON DELIVERY (ESP)
          </button>
          
          <button 
            onClick={() => handleGenerate('resources')} 
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-violet-500/10 flex items-center justify-center gap-2 text-xs"
          >
            <Sparkles className="w-4 h-4" /> RECURSOS & RÚBRICA
          </button>
        </div>

        {/* Sidebar Ad Banner */}
        <AdBanner type="sidebar" isPremium={isPremium} />
      </aside>

      {/* Main Results Display Workspace */}
      <main className="lg:col-span-8 space-y-4">
        {loading ? (
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
                  className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-blue-500/20"
                >
                  <Download className="w-4 h-4" /> EXPORTAR .DOC
                </button>
              </div>
            </div>

            {/* Generated HTML Output Render */}
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

      {/* Editor Modal Sheet */}
      <EditorModal 
        isOpen={isEditorOpen}
        plan={currentPlanObject}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveEditedPlan}
      />
      
    </div>
  );
}
