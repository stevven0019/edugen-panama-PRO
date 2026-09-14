import React from 'react';
import { Send, ArrowUpRight, MessageCircle, Lightbulb } from 'lucide-react';

export default function TelegramCommunityCard() {
  return (
    <section aria-labelledby="telegram-community-title" className="relative overflow-hidden rounded-2xl border border-sky-200 dark:border-sky-800/70 bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-sky-950/60 dark:via-slate-900 dark:to-blue-950/50 p-5 shadow-sm">
      <div aria-hidden="true" className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-sky-400/10" />
      <div className="relative flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/20"><Send className="h-5 w-5" aria-hidden="true" /></div>
        <div className="min-w-0">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">Conecta con nuestra comunidad</p>
          <h3 id="telegram-community-title" className="mt-1 text-base font-extrabold text-slate-900 dark:text-white">Edugen_pro Plannings</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">Un espacio para acompañarte al planificar. Únete en Telegram y comparte tus preguntas, sugerencias y comentarios.</p>
        </div>
      </div>
      <div className="relative mt-4 flex flex-wrap gap-2 text-[10px] font-semibold text-sky-800 dark:text-sky-200">
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-100/80 dark:bg-sky-900/50 px-2.5 py-1"><MessageCircle className="h-3 w-3" aria-hidden="true" />Preguntas y comentarios</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-100/80 dark:bg-sky-900/50 px-2.5 py-1"><Lightbulb className="h-3 w-3" aria-hidden="true" />Ideas y sugerencias</span>
      </div>
      <a href="https://t.me/EDUGEN_PRO" target="_blank" rel="noopener noreferrer" className="relative mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-sky-500/15 transition hover:from-sky-600 hover:to-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500">
        <Send className="h-4 w-4" aria-hidden="true" /> Unirme en Telegram <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">(abre en una nueva pestaña)</span>
      </a>
      <p className="mt-2 text-center text-[10px] text-slate-500 dark:text-slate-400">@EDUGEN_PRO · Comunidad gratuita</p>
    </section>
  );
}
