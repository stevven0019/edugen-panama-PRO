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
  Volume2
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

  // TTS State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [synthVoices, setSynthVoices] = useState([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        setSynthVoices(window.speechSynthesis.getVoices());
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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
      <td style="border: 1px solid #ccc; padding: 8px;">${parsed.setting || 'In the Library'}</td>
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
      return `<div>Error: ${jsonStr}</div>`;
    }
  };

  const getVoiceForSpeaker = (speakerName, gender, voices) => {
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    if (enVoices.length === 0) return null;
    
    const lowerGender = (gender || 'female').toLowerCase();
    const isMale = lowerGender === 'male' || speakerName.toLowerCase().includes('mr') || speakerName.toLowerCase().includes('carlos') || speakerName.toLowerCase().includes('lucas');
    
    if (isMale) {
      const maleVoice = enVoices.find(v => 
        v.name.toLowerCase().includes('david') || 
        v.name.toLowerCase().includes('male') || 
        v.name.toLowerCase().includes('daniel') || 
        v.name.toLowerCase().includes('google uk english male')
      );
      if (maleVoice) return maleVoice;
    } else {
      const femaleVoice = enVoices.find(v => 
        v.name.toLowerCase().includes('zira') || 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('samantha') || 
        v.name.toLowerCase().includes('hazel') || 
        v.name.toLowerCase().includes('google us english')
      );
      if (femaleVoice) return femaleVoice;
    }
    
    const hash = speakerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return enVoices[hash % enVoices.length];
  };

  const currentTurnIndexRef = React.useRef(-1);
  
  const stopDialogue = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setActiveLineIndex(-1);
    currentTurnIndexRef.current = -1;
  };

  const pauseDialogue = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeDialogue = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const playLine = (script, index, characters) => {
    if (index >= script.length) {
      stopDialogue();
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const turn = script[index];
    const character = (characters || []).find(c => c.name.toLowerCase() === turn.speaker.toLowerCase()) || {};
    
    const utterance = new SpeechSynthesisUtterance(turn.text);
    utterance.lang = 'en-US';
    utterance.rate = playbackSpeed;
    
    const selectedVoice = getVoiceForSpeaker(turn.speaker, character.gender, synthVoices);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    currentTurnIndexRef.current = index;
    setActiveLineIndex(index);
    setIsPlaying(true);
    setIsPaused(false);

    utterance.onend = () => {
      if (currentTurnIndexRef.current === index) {
        playLine(script, index + 1, characters);
      }
    };

    utterance.onerror = (e) => {
      console.error("TTS error:", e);
      stopDialogue();
    };

    window.speechSynthesis.speak(utterance);
  };

  const playSingleLine = (script, index, characters) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    setIsPlaying(false);
    setIsPaused(false);
    currentTurnIndexRef.current = -1;
    setActiveLineIndex(index);
    
    const turn = script[index];
    const character = (characters || []).find(c => c.name.toLowerCase() === turn.speaker.toLowerCase()) || {};
    const utterance = new SpeechSynthesisUtterance(turn.text);
    utterance.lang = 'en-US';
    utterance.rate = playbackSpeed;
    
    const selectedVoice = getVoiceForSpeaker(turn.speaker, character.gender, synthVoices);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.onend = () => {
      setActiveLineIndex(-1);
    };
    utterance.onerror = () => {
      setActiveLineIndex(-1);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const renderListeningScriptPlayer = (jsonStr) => {
    let data;
    try {
      data = JSON.parse(jsonStr);
    } catch (e) {
      return <div className="text-red-500 p-4">Error al parsear el JSON del Script.</div>;
    }

    const firstSpeaker = data.characters?.[0]?.name || '';

    return (
      <div className="space-y-6 font-sans">
        {/* Header and Setting */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="text-base font-extrabold text-blue-600 dark:text-blue-400">
              🎧 {data.title}
            </h4>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              Script de Listening Activo
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <strong>Escenario:</strong> {data.setting}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {data.characters.map((c, i) => (
              <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 text-slate-650 dark:text-slate-350">
                {c.gender === 'male' ? '👨‍💼' : '👩‍💼'} {c.name} ({c.role})
              </span>
            ))}
          </div>
        </div>

        {/* TTS Player Control Panel */}
        <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-500/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                onClick={() => playLine(data.script, 0, data.characters)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-xs active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Reproducir Todo</span>
              </button>
            ) : isPaused ? (
              <button
                onClick={resumeDialogue}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-xs active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Reanudar</span>
              </button>
            ) : (
              <button
                onClick={pauseDialogue}
                className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-xs active:scale-95 cursor-pointer"
              >
                <Pause className="w-4 h-4 fill-white" />
                <span>Pausar</span>
              </button>
            )}

            <button
              onClick={stopDialogue}
              disabled={!isPlaying}
              className={`p-3 rounded-xl font-bold transition flex items-center justify-center gap-1.5 text-xs active:scale-95 cursor-pointer ${
                isPlaying 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-650 cursor-not-allowed'
              }`}
            >
              <Square className="w-4 h-4 fill-current" />
              <span>Detener</span>
            </button>
          </div>

          <div className="text-xs font-bold text-slate-600 dark:text-slate-350 flex items-center gap-1.5">
            {activeLineIndex >= 0 && isPlaying && !isPaused ? (
              <span className="flex items-center gap-1 text-blue-500 animate-pulse">
                <Volume2 className="w-4.5 h-4.5" />
                Leyendo a {data.script[activeLineIndex].speaker}...
              </span>
            ) : isPaused ? (
              <span className="text-amber-500">Lectura en Pausa</span>
            ) : (
              <span className="text-slate-400">Audio Listo</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">Velocidad</span>
            <input
              type="range"
              min="0.8"
              max="1.3"
              step="0.1"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="w-24 accent-blue-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 w-8">{playbackSpeed}x</span>
          </div>
        </div>

        {/* Script dialogue area */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {data.script.map((turn, index) => {
            const isSofia = turn.speaker === firstSpeaker;
            const isActive = activeLineIndex === index;
            return (
              <div
                key={index}
                className={`flex w-full ${isSofia ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 border transition-all duration-200 shadow-sm relative group flex items-start gap-3 ${
                    isActive
                      ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-950/20 scale-[1.01]'
                      : isSofia
                      ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/20'
                  }`}
                >
                  <button
                    onClick={() => playSingleLine(data.script, index, data.characters)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition hover:scale-105 active:scale-95 self-center cursor-pointer"
                    title="Escuchar esta línea"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="space-y-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isSofia ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`}>
                      {turn.speaker}
                    </span>
                    <p className="text-xs text-slate-800 dark:text-slate-200 italic leading-relaxed">
                      "{turn.text}"
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comprehension Questions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-widest border-b border-slate-100 dark:border-slate-850 pb-2">
            📋 Preguntas de Comprensión (Para Clase)
          </h5>
          <ol className="list-decimal list-inside space-y-3.5 text-xs">
            {data.comprehensionQuestions.map((q, i) => (
              <li key={i} className="text-slate-700 dark:text-slate-350 leading-relaxed font-medium">
                <span className="font-bold">{q}</span>
                <div className="mt-1 h-7 border-b border-dashed border-slate-300 dark:border-slate-800 w-full"></div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
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
      stopDialogue(); // Stop any active reading
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
          resources: `Recursos Impresibles - ${theme} (L${lessonNum})`,
          listeningscript: `Script de Listening - ${theme} (L${lessonNum})`
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
    let contentToCopy = generatedHtml;
    if (activeGenType === 'listeningscript' && isJsonString(generatedHtml)) {
      contentToCopy = convertScriptJsonToHtml(generatedHtml);
    }
    navigator.clipboard.writeText(contentToCopy.replace(/<[^>]*>/g, ''));
    onTriggerAlert("¡Contenido copiado al portapapeles en formato de texto plano!", "success");
  };

  const handleDownload = () => {
    let contentToDownload = generatedHtml;
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

          <button 
            onClick={() => handleGenerate('listeningscript')} 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold hover:scale-[1.01] active:scale-[0.99] transition shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2 text-xs"
          >
            <Volume2 className="w-4 h-4" /> 🎧 SCRIPT A AUDIO
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
            <div className="overflow-x-auto flex-1 mb-6 font-sans">
              {activeGenType === 'listeningscript' && isJsonString(generatedHtml) ? (
                renderListeningScriptPlayer(generatedHtml)
              ) : (
                <div 
                  className="meduca-table-container leading-relaxed text-sm font-sans"
                  dangerouslySetInnerHTML={{ __html: generatedHtml }}
                />
              )}
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
