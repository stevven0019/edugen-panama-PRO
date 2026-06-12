import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Gift, 
  HelpCircle, 
  Tv, 
  TrendingUp, 
  GraduationCap 
} from 'lucide-react';

/* ── MOCK ADS LIST ── */
const MOCK_ADS = [
  {
    sponsor: "Oxford University Press",
    title: "Enfoque Orientado a la Acción (AOA)",
    tagline: "Libros oficiales y recursos alineados 100% con la currícula MEDUCA 2026.",
    cta: "Descargar Muestras PDF",
    bg: "from-blue-900 to-indigo-950",
    accent: "text-blue-400 border-blue-500/20 bg-blue-500/10",
    site: "https://www.oup.com"
  },
  {
    sponsor: "Universidad de Panamá",
    title: "Postgrados en Innovación Didáctica",
    tagline: "Diplomados virtuales para docentes. Válidos para puntos de ascenso MEDUCA.",
    cta: "Solicitar Plan de Estudios",
    bg: "from-teal-900 to-emerald-950",
    accent: "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
    site: "https://up.ac.pa"
  },
  {
    sponsor: "Librería El Hombre de la Mancha",
    title: "Materiales Didácticos & Flashcards",
    tagline: "Aprovecha 15% de descuento exclusivo para docentes de Panamá presentando tu carnet.",
    cta: "Ver Catálogo Escolar",
    bg: "from-rose-900 to-pink-950",
    accent: "text-pink-400 border-pink-500/20 bg-pink-500/10",
    site: "https://www.elhombredelamancha.com"
  }
];

/* ── INTERSTITIAL AD COMPONENT (5 Seconds) ── */
export function InterstitialAd({ isOpen, onClose, onAdFinished }) {
  if (!isOpen) return null;

  const [timeLeft, setTimeLeft] = useState(5);
  const [ad, setAd] = useState(MOCK_ADS[0]);

  // Pick a random ad when opening
  useEffect(() => {
    const randomAd = MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)];
    setAd(randomAd);
    setTimeLeft(5);
  }, [isOpen]);

  useEffect(() => {
    if (timeLeft <= 0) {
      // Auto finish or enable close
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleFinish = () => {
    // Increment local stats of ads watched
    const totalWatched = parseInt(localStorage.getItem('edugen_ads_watched_count') || '0', 10);
    localStorage.setItem('edugen_ads_watched_count', (totalWatched + 1).toString());
    window.dispatchEvent(new Event('storage')); // trigger updates in state
    
    onAdFinished();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 relative flex flex-col justify-between min-h-[450px]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <span className="bg-white/10 text-white/50 border border-white/10 text-[8px] tracking-widest font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Tv className="w-3 h-3" /> Anuncio Patrocinado
          </span>
          
          {timeLeft > 0 ? (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>Puedes continuar en:</span>
              <div className="bg-blue-600 text-white font-extrabold w-6 h-6 rounded-full flex items-center justify-center text-xs animate-pulse">
                {timeLeft}
              </div>
            </div>
          ) : (
            <button 
              onClick={handleFinish}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black tracking-wide px-4.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <span>Continuar y Generar</span>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Ad Body (Visual Sandbox Box) */}
        <div className={`my-6 flex-grow rounded-2xl bg-gradient-to-br ${ad.bg} border border-white/5 p-6 flex flex-col justify-between relative overflow-hidden group shadow-inner min-h-[200px]`}>
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
          
          <div className="space-y-3 relative z-10">
            <span className={`text-[8px] font-black tracking-wider border px-2 py-0.5 rounded-full uppercase ${ad.accent}`}>
              {ad.sponsor}
            </span>
            <h3 className="text-lg md:text-xl font-extrabold text-white leading-tight tracking-tight mt-2">
              {ad.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-medium">
              {ad.tagline}
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 pt-4">
            <a 
              href={ad.site}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition"
            >
              <span>{ad.cta}</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Ad Irritation / Conversion Banner */}
        <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-semibold text-[11px]">¿No quieres ver anuncios y generar al instante?</span>
          </div>
          <button
            onClick={() => {
              // Trigger a state change to show billing
              window.dispatchEvent(new CustomEvent('show-billing-modal'));
              onClose();
            }}
            className="text-amber-500 hover:text-amber-400 font-black tracking-wide cursor-pointer transition uppercase text-[10px]"
          >
            Pásate a PRO por $19.99 →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── REWARDED VIDEO AD COMPONENT (10 Seconds) ── */
export function RewardedAd({ isOpen, onClose, onRewardReceived }) {
  if (!isOpen) return null;

  const [timeLeft, setTimeLeft] = useState(10);
  const [ad, setAd] = useState(MOCK_ADS[1]);
  const [muted, setMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    const randomAd = MOCK_ADS[Math.floor(Math.random() * MOCK_ADS.length)];
    setAd(randomAd);
    setTimeLeft(10);
    setVideoProgress(0);
  }, [isOpen]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setVideoProgress(100);
      return;
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
      setVideoProgress(((10 - timeLeft + 1) / 10) * 100);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleClaimReward = () => {
    // Update total ads watched
    const totalWatched = parseInt(localStorage.getItem('edugen_ads_watched_count') || '0', 10);
    localStorage.setItem('edugen_ads_watched_count', (totalWatched + 1).toString());
    window.dispatchEvent(new Event('storage'));

    onRewardReceived();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 relative flex flex-col justify-between min-h-[460px]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] tracking-widest font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
            <Gift className="w-3.5 h-3.5" /> Anuncio Recompensado
          </span>
          
          <button 
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Video Box Simulator */}
        <div className="my-5 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden h-52 flex flex-col justify-between p-4 group">
          {/* Mock Video Playing Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-indigo-900/15 flex items-center justify-center">
            {/* Spinning educational shapes */}
            <GraduationCap className="w-24 h-24 text-slate-850/50 absolute scale-110 rotate-12 animate-pulse" />
            <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center text-slate-600 animate-spin">
              <Play className="w-5 h-5 fill-current" />
            </div>
          </div>

          {/* Ad Sponsor overlay */}
          <div className="relative z-10 flex justify-between items-start">
            <div className="bg-slate-900/85 backdrop-blur-sm border border-slate-800 rounded-xl p-2.5 max-w-[75%]">
              <span className="text-[7px] text-blue-400 font-extrabold uppercase tracking-wide block">{ad.sponsor}</span>
              <p className="text-[10px] text-white font-bold leading-tight mt-0.5">{ad.title}</p>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm text-[10px] text-slate-300 font-bold px-3 py-1.5 rounded-xl border border-slate-800">
              {timeLeft > 0 ? `Ganarás +1 token en ${timeLeft}s` : '¡Token Listo!'}
            </div>
          </div>

          {/* Video Controls overlay */}
          <div className="relative z-10 w-full space-y-2">
            {/* Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${videoProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Claim Reward Button Trigger */}
        <div className="space-y-4">
          {timeLeft > 0 ? (
            <button 
              disabled
              className="w-full bg-slate-800 text-slate-500 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs border border-slate-750"
            >
              <LoaderCircle className="w-4 h-4 animate-spin text-slate-500" />
              <span>Mira el video para recibir la recompensa...</span>
            </button>
          ) : (
            <button 
              onClick={handleClaimReward}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black py-4 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              <span>¡RECLAMAR 1 TOKEN GRATUITO!</span>
            </button>
          )}

          <div className="text-center">
            <button 
              onClick={onClose}
              className="text-slate-500 hover:text-slate-400 text-[10px] font-bold underline transition"
            >
              Cancelar y volver
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Icon loader helper
function LoaderCircle(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
