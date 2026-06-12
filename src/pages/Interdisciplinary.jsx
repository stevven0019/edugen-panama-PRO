import React, { useState } from 'react';
import { 
  Sparkles, 
  Settings, 
  MapPin, 
  GraduationCap, 
  FileText, 
  Copy, 
  Download, 
  FileEdit,
  Lightbulb,
  FileCheck
} from 'lucide-react';
import { generateCurriculumContent } from '../services/ai';
import { databaseService } from '../services/firebase';
import SkeletonLoader from '../components/SkeletonLoader';
import EditorModal from '../components/EditorModal';
import AdBanner from '../components/AdBanner';

export default function Interdisciplinary({ user, credits, onTriggerAlert, isPremium = false, triggerInterstitialAd, triggerRewardedAd }) {
  const [descripcion, setDescripcion] = useState('');
  const [grade, setGrade] = useState('5to Grado');
  const [trimestre, setTrimestre] = useState('I Trimestre');
  const [selectedMaterias, setSelectedMaterias] = useState([]);
  
  // Institutional headers
  const [region, setRegion] = useState('');
  const [escuela, setEscuela] = useState('');
  const [docente, setDocente] = useState('');
  const [anio, setAnio] = useState('2025');

  // Multi-step logic states
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(''); // 'tema' | 'formato'
  const [suggestedThemeObject, setSuggestedThemeObject] = useState(null); // { tema, pregunta_esencial, justificacion }
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentPlanObject, setCurrentPlanObject] = useState(null);

  const materias = [
    { id: 'Español', label: 'ESPAÑOL' },
    { id: 'Matemática', label: 'MATEMÁTICA' },
    { id: 'Ciencias Naturales', label: 'C. NATURALES' },
    { id: 'Ciencias Sociales', label: 'C. SOCIALES' },
    { id: 'Inglés', label: 'INGLÉS' },
    { id: 'Arte', label: 'ARTE' },
    { id: 'Educación Física', label: 'ED. FÍSICA' },
    { id: 'Tecnología', label: 'TECNOLOGÍA' },
  ];

  const toggleMateria = (matId) => {
    if (selectedMaterias.includes(matId)) {
      setSelectedMaterias(selectedMaterias.filter(m => m !== matId));
    } else {
      setSelectedMaterias([...selectedMaterias, matId]);
    }
  };

  const handleStep1Tema = async () => {
    if (!descripcion) {
      onTriggerAlert("Por favor describe el proyecto o área de interés general.", "info");
      return;
    }
    if (selectedMaterias.length < 2) {
      onTriggerAlert("Selecciona al menos 2 asignaturas para la red interdisciplinaria.", "info");
      return;
    }
    
    if (credits <= 0 && !isPremium) {
      const watchAd = window.confirm("No tienes tokens de generación. ¿Deseas ver un anuncio patrocinado de 10 segundos para ganar 1 token gratis?");
      if (watchAd) {
        triggerRewardedAd(async () => {
          await databaseService.incrementCredits(user.uid, 1);
          onTriggerAlert("¡Has ganado 1 token de regalo! Ahora puedes iniciar la generación del tema.", "success");
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

    const proceedWithStep1 = async () => {
      setLoading(true);
      setActiveStep('tema');
      setSuggestedThemeObject(null);
      setGeneratedHtml('');

      const vars = {
        descripcion,
        grade,
        trimestre,
        materias: selectedMaterias
      };

      try {
        const output = await generateCurriculumContent('inter_tema', vars);
        let parsed = null;
        try {
          parsed = JSON.parse(output);
        } catch (err) {
          // Fallback if AI outputted plain text
          parsed = {
            tema: output.substring(0, 150),
            pregunta_esencial: '¿Cómo podemos integrar los aprendizajes en este tema?',
            justificacion: 'Relevancia interdisciplinaria sugerida.'
          };
        }
        
        setSuggestedThemeObject(parsed);
        
        // Save credits
        await databaseService.decrementCredits(user.uid);
        onTriggerAlert("¡Tema generador creado! Revisa la propuesta y presiona el PASO 2 para llenar el formato completo.", "success");

      } catch (e) {
        onTriggerAlert("Error al proponer el tema interdisciplinario.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (!isPremium) {
      triggerInterstitialAd(proceedWithStep1);
    } else {
      proceedWithStep1();
    }
  };

  const handleStep2Formato = async () => {
    if (!suggestedThemeObject) {
      onTriggerAlert("Primero genera el tema (Paso 1).", "info");
      return;
    }
    
    if (credits <= 0 && !isPremium) {
      const watchAd = window.confirm("No tienes tokens de generación. ¿Deseas ver un anuncio patrocinado de 10 segundos para ganar 1 token gratis?");
      if (watchAd) {
        triggerRewardedAd(async () => {
          await databaseService.incrementCredits(user.uid, 1);
          onTriggerAlert("¡Has ganado 1 token de regalo! Ahora puedes iniciar la generación del formato.", "success");
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

    const proceedWithStep2 = async () => {
      setLoading(true);
      setActiveStep('formato');
      setGeneratedHtml('');

      const vars = {
        temaGenerado: suggestedThemeObject.tema,
        grade,
        trimestre,
        materias: selectedMaterias,
        region: region || '_______________',
        escuela: escuela || '_______________',
        docente: docente || '_______________',
        anio: anio || '2025'
      };

      try {
        const output = await generateCurriculumContent('inter_formato', vars);
        setGeneratedHtml(output);

        // Decrement credits
        await databaseService.decrementCredits(user.uid);

        const newPlan = {
          id: `inter_${Date.now()}`,
          title: `Proyecto Interdisciplinario - ${suggestedThemeObject.tema.substring(0, 30)}...`,
          type: 'interdisciplinary',
          grade: grade,
          content: output,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        setCurrentPlanObject(newPlan);
        await databaseService.savePlanToLibrary(user.uid, newPlan);
        onTriggerAlert("¡Formato oficial MEDUCA completado con éxito y guardado en tu biblioteca!", "success");

      } catch (e) {
        onTriggerAlert("Error al compilar el formato oficial interdisciplinario.", "error");
      } finally {
        setLoading(false);
      }
    };

    if (!isPremium) {
      triggerInterstitialAd(proceedWithStep2);
    } else {
      proceedWithStep2();
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
    a.download = `${currentPlanObject?.title || 'Proyecto_Interdisciplinario'}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
      
      {/* Sidebar form aside */}
      <aside className="lg:col-span-4 space-y-4">
        <div className="glass-panel p-5 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 border-t-4 border-t-violet-500 space-y-5">
          
          <div className="flex items-center gap-2 mb-1 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="bg-violet-500/10 p-2 rounded-xl text-violet-500"><Sparkles className="w-5 h-5" /></div>
            <div>
              <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 leading-none">Proyecto Integrado</p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Formato Interdisciplinar</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block">
              Área de Interés / Descripción *
            </label>
            <textarea 
              rows="3" 
              placeholder="Describe la temática (Ej: El cuidado de los océanos, el canal de Panamá, alimentos y huerto escolar...)" 
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Grade & Trimester */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Grado</label>
              <select 
                value={grade} 
                onChange={(e) => setGrade(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                {['Pre-Kinder', 'Kinder', '1er Grado', '2do Grado', '3er Grado', '4to Grado', '5to Grado', '6to Grado', '7mo Grado', '8vo Grado', '9no Grado', '10mo Grado', '11vo Grado', '12vo Grado'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Trimestre</label>
              <select 
                value={trimestre} 
                onChange={(e) => setTrimestre(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                {['I Trimestre', 'II Trimestre', 'III Trimestre'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Materias integrado */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block">
              Red de Asignaturas * (Mínimo 2)
            </label>
            <div className="grid grid-cols-2 gap-1.5" id="materiaSelector">
              {materias.map(m => (
                <button
                  key={m.id}
                  onClick={() => toggleMateria(m.id)}
                  className={`
                    skill-badge py-2 px-2.5 rounded-xl text-[9px] font-bold border transition-all text-center
                    ${selectedMaterias.includes(m.id) 
                      ? 'active-inter' 
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/20 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }
                  `}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Institutional Headers */}
          <div className="space-y-2.5 pt-2 border-t border-slate-150 dark:border-slate-800/60">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase block">Datos de Centro Escolar</label>
            <input 
              type="text" 
              placeholder="Región Escolar (Ej: Coclé)" 
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-violet-500/20"
            />
            <input 
              type="text" 
              placeholder="Nombre del Centro Educativo" 
              value={escuela}
              onChange={(e) => setEscuela(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-violet-500/20"
            />
            <input 
              type="text" 
              placeholder="Nombre del Docente Responsable" 
              value={docente}
              onChange={(e) => setDocente(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-violet-500/20"
            />
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Año escolar (Ej: 2026)" 
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs outline-none bg-slate-50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>
        </div>

        {/* 2-Step Actions Panel */}
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleStep1Tema} 
            disabled={loading}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3.5 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-violet-500/10 flex items-center justify-center gap-2 text-xs"
          >
            <Lightbulb className="w-4 h-4 animate-pulse" /> PASO 1: GENERAR TEMA
          </button>
          
          <button 
            onClick={handleStep2Formato} 
            disabled={loading || !suggestedThemeObject}
            className={`
              w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-xs transition
              ${suggestedThemeObject 
                ? 'bg-pink-600 hover:bg-pink-700 text-white shadow-lg hover:scale-[1.01] active:scale-[0.99]' 
                : 'bg-slate-250 text-slate-400 dark:bg-slate-800/40 dark:text-slate-600 cursor-not-allowed border border-dashed border-slate-200 dark:border-slate-800'
              }
            `}
          >
            <FileText className="w-4 h-4" /> PASO 2: LLENAR FORMATO COMPLETO
          </button>
        </div>

        {/* Sidebar Ad Banner */}
        <AdBanner type="sidebar" isPremium={isPremium} />
      </aside>

      {/* Main Results Display Workspace */}
      <main className="lg:col-span-8 space-y-4">
        {loading ? (
          <div className="glass-panel p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border-t-8 border-t-violet-500 shadow-xl flex flex-col justify-center min-h-[600px]">
            <div className="flex flex-col items-center justify-center py-8">
              <SkeletonLoader type="table" />
              <p className="text-violet-500 dark:text-violet-400 font-extrabold text-xs animate-pulse tracking-widest mt-6">
                {activeStep === 'tema' ? 'PROPONIENDO TEMA GENERADOR INTERDISCIPLINAR...' : 'CONSTRUYENDO GUÍA CURRICULAR OFICIAL MEDUCA...'}
              </p>
            </div>
          </div>
        ) : generatedHtml ? (
          /* Step 2 Complete Format View */
          <div className="glass-panel p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border-t-8 border-t-violet-600 shadow-xl min-h-[600px] flex flex-col justify-between">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800/40">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-violet-500" />
                <h3 className="font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-tighter text-sm">
                  Documento Interdisciplinar
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
                  className="bg-violet-50 hover:bg-violet-100 dark:bg-violet-950/20 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-violet-500/20"
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
        ) : suggestedThemeObject ? (
          /* Step 1 Tema Sugerido View */
          <div className="space-y-4">
            <div className="glass-panel p-6 rounded-3xl bg-white dark:bg-slate-900 border-t-8 border-t-violet-600 shadow-xl space-y-5">
              <div className="text-center bg-gradient-to-br from-violet-600/10 via-pink-600/5 to-transparent border border-violet-500/10 p-6 rounded-2xl relative overflow-hidden">
                <span className="text-[9px] font-black text-violet-500 dark:text-violet-400 uppercase tracking-widest mb-1.5 block">
                  Propuesta de Tema Generador
                </span>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight max-w-2xl mx-auto font-display">
                  "{suggestedThemeObject.tema}"
                </h2>
                
                <div className="bg-white/80 dark:bg-slate-900/80 border border-violet-200/40 dark:border-slate-800 rounded-xl p-4 mt-5 text-left max-w-xl mx-auto">
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Pregunta Esencial Guía</p>
                  <p className="text-sm font-semibold italic text-slate-700 dark:text-slate-300">❓ {suggestedThemeObject.pregunta_esencial}</p>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-950/20 border-l-4 border-l-violet-500 p-4 rounded-r-xl">
                <p className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase mb-1">Justificación del Proyecto</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">{suggestedThemeObject.justificacion}</p>
              </div>

              <div className="border-2 border-dashed border-violet-200 dark:border-slate-800/80 rounded-2xl p-6 text-center bg-violet-50/20 dark:bg-slate-950/5">
                <p className="text-xs font-bold text-violet-600 dark:text-violet-400">✅ Paso 1 Finalizado con Éxito</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                  Ahora presiona el botón rosa <strong>PASO 2: LLENAR FORMATO COMPLETO</strong> en el menú lateral para compilar los elementos curriculares oficiales del MEDUCA.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-24 rounded-3xl text-center border-4 border-dashed border-slate-200 dark:border-slate-800 min-h-[600px] flex flex-col justify-center items-center">
            <div className="bg-slate-100 dark:bg-slate-900/60 w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-800">
              <Sparkles className="text-slate-400 dark:text-slate-600 w-10 h-10" />
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-bold font-display text-base">
              Diseña un Proyecto Interdisciplinario
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mt-1.5 leading-relaxed">
              Describe una temática, selecciona los grados y materias del tronco común. Generaremos un proyecto completo adaptado a los lineamientos oficiales.
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
