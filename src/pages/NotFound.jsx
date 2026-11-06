import React from 'react';
import { School, Home, ArrowLeft, Search, HelpCircle, FileQuestion } from 'lucide-react';

export default function NotFound({ onGoHome }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-50 to-slate-100 dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shadow-xl">
            <FileQuestion className="w-12 h-12 stroke-[1.8] animate-bounce" />
          </div>
          <span className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs rounded-full shadow-lg">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Página No Encontrada
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Parece que la planificación, recurso curricular o ruta que intentas consultar no existe o ha sido movida.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-left space-y-2 text-xs text-slate-600 dark:text-slate-300 shadow-sm">
          <p className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-blue-500" /> ¿Qué puedes hacer?
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-slate-500 dark:text-slate-400">
            <li>Revisar tus Lesson Planners en el Dashboard principal.</li>
            <li>Explorar los 112 Anchor Posters MEDUCA en la Biblioteca Académica.</li>
            <li>Verificar que el enlace copiado esté completo.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" /> Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
}

