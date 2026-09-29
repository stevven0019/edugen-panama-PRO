import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Headphones, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Mic, 
  FileText, 
  Check, 
  AlertCircle, 
  Copy, 
  Info, 
  ArrowLeft,
  Wand2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

// Pre-built Gemini TTS Voices with descriptions
export const AVAILABLE_VOICES = [
  { id: "Kore", name: "Kore", gender: "Femenina", trait: "Firme, clara y profesional" },
  { id: "Puck", name: "Puck", gender: "Masculina", trait: "Alegre, juvenil y dinámica" },
  { id: "Zephyr", name: "Zephyr", gender: "Femenina", trait: "Brillante, cálida y natural" },
  { id: "Charon", name: "Charon", gender: "Masculina", trait: "Informativa, profunda y serena" },
  { id: "Fenrir", name: "Fenrir", gender: "Masculina", trait: "Entusiasta y enérgica" },
  { id: "Aoede", name: "Aoede", gender: "Femenina", trait: "Suave, fresca y pausada" },
  { id: "Enceladus", name: "Enceladus", gender: "Masculina", trait: "Respirada y tranquila" },
  { id: "Callirrhoe", name: "Callirrhoe", gender: "Femenina", trait: "Despreocupada y casual" },
  { id: "Achird", name: "Achird", gender: "Masculina", trait: "Amistosa y conversacional" },
  { id: "Despina", name: "Despina", gender: "Femenina", trait: "Suave y melodiosa" }
];

// Example Templates from original HTML
export const TEMPLATES = {
  market: `Seller: "Hello! Can I help you?"
Customer: "Yes, please. Excuse me, how much is the pineapple?"
Seller: "It is one dollar."
Customer: "Okay. And how many apples do you have?"
Seller: "We have fresh red and green apples."
Customer: "I need three apples and one banana, please."
Seller: "Okay, three apples and one banana. That's four dollars."
Customer: "Here is the money."
Seller: "Thank you! Have a great day!"`,

  restaurant: `Waitress: "Good afternoon! Table for one?"
Customer: "Yes, please. Could I sit by the window?"
Waitress: "Certainly! Here is the lunch menu. Can I get you something to drink?"
Customer: "Just an iced tea with lemon, please."
Waitress: "Right away. Take your time looking at the specials."`,

  airport: `Agent: "Good morning. Where are you flying today?"
Passenger: "Hello! I am traveling to London on flight 204."
Agent: "May I see your passport and ticket, please?"
Passenger: "Sure, here you go."
Agent: "Thank you. Are you checking any luggage today?"
Passenger: "Just one suitcase, and this small backpack is my carry-on."
Agent: "Perfect. Here is your boarding pass. Gate B12."`
};

// Helper: detect dialogue lines from generated HTML / Lesson Planner / JSON
export function detectDialogueFromLesson(lessonContent) {
  if (!lessonContent) return null;

  // 1. JSON check
  if (typeof lessonContent === 'string' && lessonContent.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(lessonContent);
      if (Array.isArray(parsed.script) && parsed.script.length > 0) {
        return parsed.script
          .map(t => `${t.speaker || 'Speaker'}: "${(t.text || '').replace(/^["“]|["”]$/g, '').trim()}"`)
          .join('\n');
      }
    } catch (e) {
      // not JSON
    }
  }

  // 2. Parse HTML / text lines
  const text = lessonContent
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const IGNORE_KEYS = new Set([
    'lesson #', 'lesson', 'skills focus', 'grade', 'scenario', 'theme', 'date', 'dates',
    'learning sequence time', 'specific objective', 'learning outcome', 'stage 1', 'stage 2',
    'stage 3', 'stage 4', 'stage 5', 'stage 6', 'stage', 'warm-up', 'material',
    'communicative competence', 'communicative skill', 'procedure', 'differentiation',
    'communicative task', 'assessment task', 'evaluation criteria', 'student self-reflection',
    'teacher reflection', 'connection to next lesson', 'preparación', 'instrucciones',
    'descripción de la actividad', 'mediación pedagógica', 'si hay dificultades', 'extensión',
    'tarea del estudiante', 'modo de interacción', 'producción esperada', 'indicador de logro',
    'ejemplo de respuesta', 'rol del maestro', 'rol del estudiante', 'tiempo estimado',
    'etapa 1', 'etapa 2', 'etapa 3', 'etapa 4', 'etapa 5', 'etapa 6', 'objetivo', 'recursos'
  ]);

  const candidateTurns = [];
  let currentBlock = [];

  for (let rawLine of lines) {
    const cleanLine = rawLine.replace(/^\*+|\*+$/g, '').trim();
    // Matches "Speaker: Speech"
    const match = cleanLine.match(/^([A-Za-z\s\u00C0-\u017F]{2,25}):\s*["“_]?([^"”_].+)$/);

    if (match) {
      const speaker = match[1].trim();
      const speech = match[2].trim().replace(/^["“]|["”]$/g, '').trim();
      const speakerLower = speaker.toLowerCase();

      let isHeader = false;
      for (const ign of IGNORE_KEYS) {
        if (speakerLower === ign || speakerLower.startsWith(ign)) {
          isHeader = true;
          break;
        }
      }

      if (!isHeader && speech.length >= 2) {
        currentBlock.push(`${speaker}: "${speech}"`);
        continue;
      }
    }

    if (currentBlock.length >= 2) {
      candidateTurns.push(...currentBlock);
      currentBlock = [];
    } else {
      currentBlock = [];
    }
  }

  if (currentBlock.length >= 2) {
    candidateTurns.push(...currentBlock);
  }

  if (candidateTurns.length >= 2) {
    return candidateTurns.join('\n');
  }

  return null;
}

// Convert raw signed PCM 16-bit to standard playable WAV Blob
function writeWavHeaderString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function pcmToWav(pcm16Data, sampleRate) {
  const numChannels = 1;
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const buffer = new ArrayBuffer(44 + pcm16Data.byteLength);
  const view = new DataView(buffer);

  // "RIFF" chunk
  writeWavHeaderString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcm16Data.byteLength, true);
  writeWavHeaderString(view, 8, 'WAVE');

  // "fmt " subchunk
  writeWavHeaderString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // SubChunk1Size (16 for PCM)
  view.setUint16(20, 1, true);  // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample = 16

  // "data" subchunk
  writeWavHeaderString(view, 36, 'data');
  view.setUint32(40, pcm16Data.byteLength, true);

  // Copy PCM samples
  const pcmBytes = new Uint8Array(pcm16Data.buffer, pcm16Data.byteOffset, pcm16Data.byteLength);
  const target = new Uint8Array(buffer, 44);
  target.set(pcmBytes);

  return new Blob([buffer], { type: 'audio/wav' });
}

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export default function ConversationalAudioStudio({
  currentLessonHtml = '',
  lessonTitle = '',
  grade = '',
  scenario = '',
  theme = '',
  onBackToPlanner = null,
  onGenerateAiScript = null,
  loadingAiScript = false
}) {
  // State
  const [scriptText, setScriptText] = useState(TEMPLATES.market);
  const [stylePromptText, setStylePromptText] = useState('Clear, articulate, natural conversational English for language learners. Friendly and expressive.');
  const [speakerVoices, setSpeakerVoices] = useState({});
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isGeneratingTts, setIsGeneratingTts] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState('');
  
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [playerStatus, setPlayerStatus] = useState('En espera'); // 'En espera' | 'Listo para reproducir' | 'Reproduciendo...' | 'En pausa' | 'Finalizado' | 'Voz Offline'
  const [activeOfflineLineIndex, setActiveOfflineLineIndex] = useState(-1);
  const [isOfflinePlaying, setIsOfflinePlaying] = useState(false);

  // Modal / Toast
  const [toast, setToast] = useState(null);
  const [modalInfo, setModalInfo] = useState(null);

  // Refs
  const audioElementRef = useRef(null);
  const visualizerIntervalRef = useRef(null);
  const offlineSpeechCancelRef = useRef(false);
  const [visualizerHeights, setVisualizerHeights] = useState([12, 20, 8, 24, 16, 32, 16, 24, 12]);

  // Detected dialogue from lesson planner
  const detectedLessonDialogue = useMemo(() => {
    return detectDialogueFromLesson(currentLessonHtml);
  }, [currentLessonHtml]);

  // Toast auto-hide
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Parse script lines and speakers
  const { parsedLines, speakersList } = useMemo(() => {
    const lines = scriptText.split('\n');
    const parsed = [];
    const speakerSet = new Set();

    lines.forEach((rawLine, index) => {
      const trimmed = rawLine.trim();
      if (!trimmed) return;

      const match = trimmed.match(/^([^:]+):\s*["“]?([^"”]+)["”]?$/i) || trimmed.match(/^([^:]+):\s*(.+)$/i);
      if (match) {
        const speaker = match[1].trim();
        const lineText = match[2].trim().replace(/^["“]|["”]$/g, '');
        parsed.push({ speaker, text: lineText, raw: trimmed, lineNum: index + 1 });
        speakerSet.add(speaker);
      } else {
        parsed.push({ speaker: "Narrator", text: trimmed, raw: trimmed, lineNum: index + 1 });
        speakerSet.add("Narrator");
      }
    });

    return { parsedLines: parsed, speakersList: Array.from(speakerSet) };
  }, [scriptText]);

  // Auto-assign default voices to new speakers
  useEffect(() => {
    const defaultAssignments = ["Kore", "Puck", "Zephyr", "Charon", "Aoede", "Fenrir"];
    setSpeakerVoices(prev => {
      const updated = { ...prev };
      let changed = false;
      speakersList.forEach((spk, idx) => {
        if (!updated[spk]) {
          updated[spk] = defaultAssignments[idx % defaultAssignments.length];
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [speakersList]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (visualizerIntervalRef.current) clearInterval(visualizerIntervalRef.current);
    };
  }, [audioUrl]);

  // Visualizer Animation
  const startVisualizer = () => {
    if (visualizerIntervalRef.current) clearInterval(visualizerIntervalRef.current);
    visualizerIntervalRef.current = setInterval(() => {
      setVisualizerHeights([
        Math.floor(Math.random() * 24) + 6,
        Math.floor(Math.random() * 28) + 6,
        Math.floor(Math.random() * 18) + 4,
        Math.floor(Math.random() * 32) + 8,
        Math.floor(Math.random() * 20) + 6,
        Math.floor(Math.random() * 36) + 8,
        Math.floor(Math.random() * 22) + 6,
        Math.floor(Math.random() * 26) + 6,
        Math.floor(Math.random() * 16) + 4,
      ]);
    }, 120);
  };

  const stopVisualizer = () => {
    if (visualizerIntervalRef.current) clearInterval(visualizerIntervalRef.current);
    setVisualizerHeights([6, 6, 6, 6, 6, 6, 6, 6, 6]);
  };

  // Format mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return "00:00";
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Native Audio Element Handlers
  const handleLoadedMetadata = () => {
    if (audioElementRef.current) {
      setDuration(audioElementRef.current.duration || 0);
    }
  };

  const handleTimeUpdate = () => {
    if (audioElementRef.current) {
      setCurrentTime(audioElementRef.current.currentTime || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    stopVisualizer();
    setPlayerStatus('Finalizado');
  };

  // Play / Pause toggle
  const togglePlayPause = () => {
    if (!audioElementRef.current) return;
    
    // Stop offline speech if active
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsOfflinePlaying(false);
      setActiveOfflineLineIndex(-1);
    }

    if (audioElementRef.current.paused) {
      audioElementRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setPlayerStatus('Reproduciendo...');
          startVisualizer();
        })
        .catch(err => {
          console.error("Playback error:", err);
          showToast("Error al reproducir audio", "error");
        });
    } else {
      audioElementRef.current.pause();
      setIsPlaying(false);
      setPlayerStatus('En pausa');
      stopVisualizer();
    }
  };

  const handleRestart = () => {
    if (!audioElementRef.current) return;
    audioElementRef.current.currentTime = 0;
    audioElementRef.current.play()
      .then(() => {
        setIsPlaying(true);
        setPlayerStatus('Reproduciendo...');
        startVisualizer();
      })
      .catch(console.error);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    if (audioElementRef.current && duration > 0) {
      const newTime = (val / 100) * duration;
      audioElementRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = speed;
    }
    showToast(`Velocidad: ${speed}x`, "info");
  };

  const handleDownloadWav = () => {
    if (!audioBlob || !audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `english-dialogue-${theme ? theme.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'aoa'}-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Descargando archivo WAV...", "success");
  };

  // Web Speech API single line check
  const speakSingleLine = (text) => {
    if (!('speechSynthesis' in window)) {
      setModalInfo({
        title: "Navegador no compatible",
        message: "Tu navegador no tiene activado el soporte de voz Web Speech.",
        isError: true
      });
      return;
    }
    // Pause any native audio
    if (audioElementRef.current && !audioElementRef.current.paused) {
      audioElementRef.current.pause();
      setIsPlaying(false);
      stopVisualizer();
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = playbackSpeed || 1.0;
    window.speechSynthesis.speak(u);
  };

  // Offline Browser Voice - Entire dialogue with alternating pitches
  const playEntireDialogueOffline = async () => {
    if (!('speechSynthesis' in window)) {
      setModalInfo({
        title: "No soportado",
        message: "Tu navegador no cuenta con síntesis de voz offline.",
        isError: true
      });
      return;
    }

    if (parsedLines.length === 0) {
      setModalInfo({
        title: "Guion Vacío",
        message: "Por favor ingresa o carga un diálogo primero.",
        isError: true
      });
      return;
    }

    // Stop native audio if playing
    if (audioElementRef.current && !audioElementRef.current.paused) {
      audioElementRef.current.pause();
      setIsPlaying(false);
      stopVisualizer();
    }

    window.speechSynthesis.cancel();
    offlineSpeechCancelRef.current = false;
    setIsOfflinePlaying(true);
    setPlayerStatus('Voz Offline');
    startVisualizer();
    showToast("Reproduciendo diálogo con sintetizador local...", "info");

    let isFirstSpeaker = true;
    let lastSpeaker = null;

    for (let i = 0; i < parsedLines.length; i++) {
      if (offlineSpeechCancelRef.current) break;

      const item = parsedLines[i];
      if (lastSpeaker !== null && lastSpeaker !== item.speaker) {
        isFirstSpeaker = !isFirstSpeaker;
      }
      lastSpeaker = item.speaker;
      setActiveOfflineLineIndex(i);

      await new Promise(resolve => {
        const u = new SpeechSynthesisUtterance(item.text);
        u.lang = 'en-US';
        u.rate = playbackSpeed || 0.95;
        u.pitch = isFirstSpeaker ? 1.15 : 0.85;

        u.onend = () => {
          setTimeout(resolve, 400); // Natural conversation pause
        };
        u.onerror = () => resolve();
        window.speechSynthesis.speak(u);
      });
    }

    setIsOfflinePlaying(false);
    setActiveOfflineLineIndex(-1);
    stopVisualizer();
    setPlayerStatus('Finalizado');
  };

  const stopOfflineDialogue = () => {
    offlineSpeechCancelRef.current = true;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsOfflinePlaying(false);
    setActiveOfflineLineIndex(-1);
    stopVisualizer();
    setPlayerStatus('En espera');
  };

  // Multi-Speaker Gemini TTS API Call
  const generateMultiSpeakerAudio = async () => {
    if (parsedLines.length === 0) {
      setModalInfo({
        title: "Guion Vacío",
        message: "Por favor ingresa o pega un diálogo antes de generar el audio.",
        isError: true
      });
      return;
    }

    // Check for API key
    const envKey = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_GEMINI_API_KEY) || 
                   (typeof process !== 'undefined' && process.env?.VITE_GEMINI_API_KEY) || '';

    setIsGeneratingTts(true);
    setGeneratingProgress("Conectando con Gemini 2.5 Flash TTS...");

    try {
      let formattedScript = "";
      parsedLines.forEach(line => {
        formattedScript += `${line.speaker}: "${line.text}"\n`;
      });

      const promptText = `TTS the following conversational English dialogue between characters with natural, distinct voices for language learners. ${stylePromptText}\n\n${formattedScript}`;

      const speakerVoiceConfigs = [];
      speakersList.forEach(speaker => {
        const voiceId = speakerVoices[speaker] || "Kore";
        speakerVoiceConfigs.push({
          speaker: speaker,
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceId }
          }
        });
      });

      let speechConfigObj = {};
      if (speakerVoiceConfigs.length <= 1) {
        const singleVoice = speakerVoiceConfigs[0]?.voiceConfig?.prebuiltVoiceConfig?.voiceName || "Kore";
        speechConfigObj = {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: singleVoice }
          }
        };
      } else {
        speechConfigObj = {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: speakerVoiceConfigs
          }
        };
      }

      const payload = {
        contents: [{
          parts: [{ text: promptText }]
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: speechConfigObj
        },
        model: "gemini-2.5-flash-preview-tts"
      };

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${envKey}`;

      let response = null;
      let delay = 1000;
      const maxRetries = 2;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (response.ok) break;
        } catch (err) {
          if (attempt === maxRetries - 1) throw err;
        }
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
      }

      if (!response || !response.ok) {
        const errDetail = response ? await response.text() : "Network error";
        throw new Error(`Servicio TTS no disponible (${response?.status || '500'}).`);
      }

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType || "audio/L16;rate=24000";

      if (audioData) {
        let sampleRate = 24000;
        const rateMatch = mimeType.match(/rate=(\d+)/);
        if (rateMatch && rateMatch[1]) {
          sampleRate = parseInt(rateMatch[1], 10);
        }

        const rawArrayBuffer = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(rawArrayBuffer);
        const wavBlob = pcmToWav(pcm16, sampleRate);

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }

        const newUrl = URL.createObjectURL(wavBlob);
        setAudioBlob(wavBlob);
        setAudioUrl(newUrl);
        setPlayerStatus("Listo para reproducir");
        showToast("¡Audio generado con éxito con voces Gemini!", "success");

        if (audioElementRef.current) {
          audioElementRef.current.src = newUrl;
        }
      } else {
        throw new Error("No se recibieron datos de audio en la respuesta del modelo.");
      }

    } catch (err) {
      console.warn("TTS Gemini fallback to offline:", err);
      setModalInfo({
        title: "Aviso sobre la Síntesis de Audio Gemini",
        message: `La síntesis en la nube de Gemini no respondió (${err.message}). Pero no te preocupes: puedes pulsar el botón 'Voz del Navegador (Offline)' para escuchar la conversación de inmediato con entonación de personajes.`,
        isError: false
      });
    } finally {
      setIsGeneratingTts(false);
    }
  };

  // Load template
  const handleLoadTemplate = (key) => {
    if (TEMPLATES[key]) {
      setScriptText(TEMPLATES[key]);
      showToast(`Plantilla cargada: ${key.toUpperCase()}`, "info");
    }
  };

  // Load detected dialogue from current planner
  const handleLoadDetectedDialogue = () => {
    if (detectedLessonDialogue) {
      setScriptText(detectedLessonDialogue);
      showToast("¡Conversación de tu clase AOA cargada con éxito!", "success");
    }
  };

  // Paste from clipboard
  const handlePasteClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setScriptText(text);
          showToast("¡Texto pegado desde el portapapeles!", "success");
          return;
        }
      }
      showToast("Usa Ctrl+V directamente en el cuadro de texto para pegar tu guion.", "info");
    } catch (e) {
      showToast("Pega tu diálogo directamente en el cuadro de texto con Ctrl+V.", "info");
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden font-sans">
      
      {/* Header Studio Bar */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBackToPlanner && (
              <button 
                onClick={onBackToPlanner}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                title="Volver a la vista del planificador"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-300 dark:shadow-indigo-900/40">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                Conversational Audio Studio
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                  Multi-Speaker TTS
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {theme ? `${theme} · ` : ''}{grade || 'EFL Panamá'} — Voces interactivas para práctica auditiva y pronunciación
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {detectedLessonDialogue && (
              <button 
                onClick={handleLoadDetectedDialogue}
                className="text-xs font-bold text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all flex items-center gap-1.5 shadow-sm animate-pulse"
                title="Detectar y cargar el diálogo del Lesson Planner generado"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Cargar Diálogo del Planner</span>
              </button>
            )}

            <button 
              onClick={() => handleLoadTemplate('market')}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 bg-white dark:bg-slate-850 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
              <span>Ejemplo Frutería</span>
            </button>

            <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Gemini + Offline TTS
            </span>
          </div>
        </div>
      </header>

      {/* Detection Banner if current lesson has dialogue and isn't loaded */}
      {detectedLessonDialogue && scriptText !== detectedLessonDialogue && (
        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 border-b border-indigo-200 dark:border-indigo-900/50 px-5 py-2.5 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-medium">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              💡 <b>Conversación detectada:</b> Encontramos un diálogo de compras/escucha en tu lección actual <i>"{theme || 'AOA'}"</i>.
            </span>
          </div>
          <button 
            onClick={handleLoadDetectedDialogue}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] shadow-sm transition whitespace-nowrap"
          >
            Usar Diálogo del Planner
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 pointer-events-none transition-all duration-300 animate-fade-in">
          <div className={`px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border ${
            toast.type === 'success' ? 'bg-emerald-600 text-white border-emerald-500' :
            toast.type === 'error' ? 'bg-rose-600 text-white border-rose-500' :
            'bg-slate-900 text-white border-slate-700'
          }`}>
            <Check className="w-4 h-4" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Modal Dialog */}
      {modalInfo && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                modalInfo.isError ? 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
              }`}>
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{modalInfo.title}</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
              {modalInfo.message}
            </p>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setModalInfo(null)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-sm"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isGeneratingTts && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 text-white">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-400/30 border-t-indigo-400 animate-spin mb-4"></div>
          <h3 className="text-base font-bold text-white mb-1">Sintetizando Voces con Gemini...</h3>
          <p className="text-xs text-indigo-200 max-w-xs text-center">{generatingProgress}</p>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Script Editor & Speaker Assignment (7 cols) */}
        <section className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Script Editor Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs">
                  1
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Guion de la Conversación
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                {scriptText.length} caracteres
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Escribe o pega cada diálogo con el formato <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono font-bold">Personaje: "Texto a decir"</code>. Se detectan automáticamente los hablantes.
            </p>

            {/* Script Textarea */}
            <div className="relative">
              <textarea 
                rows="10"
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                placeholder={'Seller: "Hello! Can I help you?"\nCustomer: "Yes, please. How much is the pineapple?"\nSeller: "It is one dollar."\nCustomer: "I need three apples and one banana, please."'}
                className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y text-slate-800 dark:text-slate-200 leading-relaxed placeholder:text-slate-400"
              />
            </div>

            {/* Quick Template & Action Buttons */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1">Plantillas rápidas:</span>
              <button 
                onClick={() => handleLoadTemplate('market')}
                className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1 rounded-lg transition-all"
              >
                🍎 Frutería / Mercado
              </button>
              <button 
                onClick={() => handleLoadTemplate('restaurant')}
                className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1 rounded-lg transition-all"
              >
                ☕ Cafetería
              </button>
              <button 
                onClick={() => handleLoadTemplate('airport')}
                className="text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold px-2.5 py-1 rounded-lg transition-all"
              >
                ✈️ Aeropuerto
              </button>
              <button 
                onClick={handlePasteClipboard}
                className="text-[11px] bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-semibold px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-all flex items-center gap-1"
                title="Pegar texto copiado del portapapeles"
              >
                <Copy className="w-3 h-3" /> Pegar Portapapeles
              </button>
              {onGenerateAiScript && (
                <button 
                  onClick={onGenerateAiScript}
                  disabled={loadingAiScript}
                  className="text-[11px] bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold px-3 py-1 rounded-lg shadow-sm hover:opacity-90 transition-all flex items-center gap-1 ml-auto"
                  title="Generar nuevo guion con IA para el tema actual"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>{loadingAiScript ? 'Generando...' : 'Generar Guion con IA'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Speakers Mapping Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs">
                  2
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Voces de los Personajes
                </h3>
              </div>
              <span className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-2.5 py-0.5 rounded-full">
                {speakersList.length} personaje{speakersList.length !== 1 ? 's' : ''}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Asigna a cada personaje del diálogo una voz humana de Gemini con tono característico para facilitar la distinción auditiva.
            </p>

            {/* Dynamic Speakers List */}
            <div className="flex flex-col gap-2.5">
              {speakersList.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 text-xs">
                  Ingresa o pega un diálogo arriba para detectar automáticamente los hablantes.
                </div>
              ) : (
                speakersList.map((speaker) => {
                  const currentVoice = speakerVoices[speaker] || 'Kore';
                  return (
                    <div 
                      key={speaker}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 hover:bg-slate-50 dark:hover:bg-slate-950/70 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                          {speaker.slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{speaker}</h4>
                          <p className="text-[10px] text-slate-400">Personaje del diálogo</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select 
                          value={currentVoice}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSpeakerVoices(prev => ({ ...prev, [speaker]: val }));
                          }}
                          className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                        >
                          {AVAILABLE_VOICES.map(v => (
                            <option key={v.id} value={v.id}>
                              {v.name} ({v.gender} - {v.trait})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Voice Style Instruction */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Instrucción pedagógica de entonación y estilo:
              </label>
              <input 
                type="text"
                value={stylePromptText}
                onChange={(e) => setStylePromptText(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Guía la pronunciación para que sea óptima para estudiantes de inglés.</p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={generateMultiSpeakerAudio}
              disabled={isGeneratingTts || parsedLines.length === 0}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99] cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>Generar Audio de la Conversación (Gemini)</span>
            </button>

            {isOfflinePlaying ? (
              <button 
                onClick={stopOfflineDialogue}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <VolumeX className="w-4 h-4" />
                <span>Detener Voz Offline</span>
              </button>
            ) : (
              <button 
                onClick={playEntireDialogueOffline}
                title="Reproduce de inmediato usando el sintetizador de tu navegador"
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-indigo-500" />
                <span>Voz del Navegador (Offline)</span>
              </button>
            )}
          </div>

        </section>

        {/* Right Column: Audio Player & Shadowing Timeline (5 cols) */}
        <section className="lg:col-span-5 flex flex-col gap-5">
          
          {/* Audio Player Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black text-xs">
                  3
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  Reproductor & Descarga
                </h3>
              </div>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                playerStatus === 'Reproduciendo...' || playerStatus === 'Voz Offline' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 animate-pulse' :
                playerStatus === 'Listo para reproducir' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}>
                {playerStatus}
              </span>
            </div>

            {/* Audio Wave Visualizer Display */}
            <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-2xl p-4 flex flex-col justify-between h-36 relative overflow-hidden shadow-inner border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 z-10">
                <span className="flex items-center gap-1.5 text-indigo-300 font-mono text-[11px]">
                  <Volume2 className="w-3.5 h-3.5" /> {audioBlob ? 'Multi-Voice WAV' : 'Sintetizador Audio'}
                </span>
                <span className="font-mono text-slate-300 text-xs">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Animated Audio Bars */}
              <div className="flex items-end justify-center gap-1.5 h-14 z-10">
                {visualizerHeights.map((h, i) => (
                  <div 
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1.5 rounded-full transition-all duration-150 bg-gradient-to-t from-indigo-500 to-violet-400"
                  />
                ))}
              </div>

              {/* Progress Slider */}
              <div className="z-10 flex flex-col gap-1">
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={progressPercent}
                  onChange={handleSeek}
                  disabled={!audioBlob}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400 focus:outline-none"
                />
              </div>

              {/* Subtle background glow */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none"></div>
            </div>

            {/* Player Controls */}
            <div className="mt-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button 
                  onClick={togglePlayPause}
                  disabled={!audioBlob}
                  className="w-11 h-11 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                  title={isPlaying ? "Pausar" : "Reproducir"}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button 
                  onClick={handleRestart}
                  disabled={!audioBlob}
                  className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                  title="Reiniciar desde el inicio"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speed Controls */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-xs">
                {[0.75, 1.0, 1.25].map(spd => (
                  <button 
                    key={spd}
                    onClick={() => handleSpeedChange(spd)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] ${
                      playbackSpeed === spd 
                        ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-xs' 
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* Download WAV */}
              <button 
                onClick={handleDownloadWav}
                disabled={!audioBlob}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:text-indigo-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Descargar</span> WAV
              </button>
            </div>

            {/* Hidden native audio tag */}
            <audio 
              ref={audioElementRef}
              src={audioUrl || ''}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleAudioEnded}
              className="hidden"
            />
          </div>

          {/* Line-by-Line Practice & Shadowing Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 sm:p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-tight">
                  Línea por Línea (Shadowing & Escucha)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">Toca para escuchar frase</span>
            </div>

            <div className="flex-1 max-h-[380px] overflow-y-auto space-y-2 pr-1">
              {parsedLines.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Las frases de la conversación aparecerán aquí organizadas para practicar tu pronunciación y comprensión.
                </div>
              ) : (
                parsedLines.map((item, idx) => {
                  const isCurrentOffline = activeOfflineLineIndex === idx;
                  return (
                    <div 
                      key={idx}
                      onClick={() => speakSingleLine(item.text)}
                      className={`group p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isCurrentOffline 
                          ? 'border-indigo-500 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-sm ring-1 ring-indigo-400' 
                          : 'border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-800 bg-slate-50/70 dark:bg-slate-950/30 hover:bg-indigo-50/30'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0 transition-colors ${
                        isCurrentOffline 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-indigo-100 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{item.speaker}</span>
                          <button 
                            type="button"
                            title="Escuchar esta frase con voz del navegador"
                            className="text-[11px] text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </section>

      </div>

    </div>
  );
}
