import React, { useEffect } from 'react';
import { Coins, Sparkles, AlertCircle, ExternalLink, BookOpen, GraduationCap } from 'lucide-react';

export default function AdBanner({ type = 'footer', isPremium = false }) {
  // If user is premium, render nothing
  if (isPremium) return null;

  useEffect(() => {
    // Attempt to push to AdSense if pagead is loaded and real ads are configured
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // Quiet fail in local sandbox/dev environments
      console.log("AdSense script not active or loaded yet (normal in dev)");
    }
  }, []);

  // List of high-fidelity simulated local ads for Panama educators
  const simulatedAds = {
    sidebar: [
      {
        title: "Oxford University Press",
        subtitle: "Materiales AOA 2026",
        desc: "Libros de texto de inglés oficiales alineados al currículo MEDUCA y el Enfoque Orientado a la Acción.",
        cta: "Ver Catálogo Oxford",
        badge: "Patrocinado",
        color: "from-blue-600 to-cyan-600",
        link: "https://www.oup.com"
      },
      {
        title: "Librería El Hombre de la Mancha",
        subtitle: "Descuento Especial Docente",
        desc: "Presenta tu carnet de MEDUCA y obtén 15% de descuento en materiales de lectura y flashcards didácticas.",
        cta: "Ver Sucursales",
        badge: "Promoción Local",
        color: "from-pink-600 to-rose-600",
        link: "https://www.elhombredelamancha.com"
      }
    ],
    footer: [
      {
        title: "Capacitaciones MEDUCA & AOA 2026",
        desc: "Inscríbete en los nuevos diplomados virtuales de metodologías activas y aprendizaje del inglés. Válido para puntos de ascenso en tu perfil docente.",
        cta: "Inscribirse Gratis",
        color: "from-emerald-600/10 via-teal-600/5 to-transparent",
        borderColor: "border-emerald-500/20",
        badge: "Portal Educa Panamá",
        link: "https://educapanama.edu.pa"
      }
    ]
  };

  // Pick a random simulated ad or static one
  const sidebarAd = simulatedAds.sidebar[0]; // Oxford by default
  const footerAd = simulatedAds.footer[0];

  if (type === 'sidebar') {
    return (
      <div className="adsense-sidebar print:hidden my-4 w-full transition-all duration-300">
        {/* Real AdSense Slot */}
        <div className="hidden">
          <ins className="adsbygoogle"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-XXXXXXXXXXXXXXX"
               data-ad-slot="1111111111"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>

        {/* Polished Visual Sandbox Mockup */}
        <div className={`p-5 rounded-3xl bg-gradient-to-br ${sidebarAd.color} text-white shadow-xl shadow-blue-500/5 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 border border-white/10`}>
          {/* Decorative shapes */}
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="bg-white/20 text-white border border-white/25 text-[8px] tracking-widest font-black uppercase px-2 py-0.5 rounded-full">
                {sidebarAd.badge}
              </span>
              <BookOpen className="w-4 h-4 opacity-75" />
            </div>

            <div>
              <h4 className="font-extrabold text-sm tracking-tight leading-tight">{sidebarAd.title}</h4>
              <p className="text-[10px] text-white/80 font-semibold mt-0.5">{sidebarAd.subtitle}</p>
              <p className="text-[10px] text-white/70 mt-2 leading-relaxed">
                {sidebarAd.desc}
              </p>
            </div>

            <a 
              href={sidebarAd.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full bg-white text-blue-900 py-2 rounded-xl text-[10px] font-black tracking-wide text-center flex items-center justify-center gap-1.5 shadow-md hover:bg-slate-50 transition active:scale-98"
            >
              <span>{sidebarAd.cta}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Footer banner horizontal ad
  return (
    <div className="adsense-footer print:hidden mt-8 w-full transition-all duration-300">
      {/* Real AdSense Slot */}
      <div className="hidden">
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXX"
             data-ad-slot="2222222222"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>

      {/* Visual Sandbox Mockup */}
      <div className={`p-4 rounded-3xl bg-gradient-to-r ${footerAd.color} border ${footerAd.borderColor} flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden group`}>
        <div className="flex items-start gap-3 relative z-10">
          <div className="bg-emerald-500/10 p-2.5 rounded-2xl text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {footerAd.badge}
              </span>
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">ANUNCIO CURRICULAR</span>
            </div>
            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mt-1 leading-tight">{footerAd.title}</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {footerAd.desc}
            </p>
          </div>
        </div>

        <a
          href={footerAd.link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-[10px] font-bold tracking-wide shadow-md active:scale-95 transition flex items-center gap-1.5 flex-shrink-0 w-full md:w-auto justify-center"
        >
          <span>{footerAd.cta}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
