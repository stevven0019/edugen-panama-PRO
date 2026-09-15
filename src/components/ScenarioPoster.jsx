import { useRef, useState } from 'react';
import { scenarioPoster } from '../resources/scenarioPoster';

export default function ScenarioPoster({grade,scenario,index,ready}) {
  const [preview,setPreview]=useState(null),[error,setError]=useState('');
  const frame=useRef(null);
  const create=()=>{try{setPreview({html:scenarioPoster(scenario,grade,index),grade,index});setError('');}catch(e){setError(e.message);setPreview(null);}};
  const print=()=>{
    const win=frame.current?.contentWindow;
    if(!win)return;
    // Fit every curriculum field on a single A3 sheet, including long scenarios.
    const page=win.document.querySelector('.poster');
    page.style.zoom='1';
    const scale=Math.min(1,1580/page.offsetHeight);
    page.style.zoom=String(scale);
    win.focus();win.print();
  };
  return <section className="mt-5 p-5 rounded-2xl border border-teal-400/30 bg-gradient-to-br from-teal-500/10 to-indigo-500/10">
    <h2 className="font-bold text-lg text-teal-700 dark:text-teal-300">Crear póster Scenario</h2>
    <p className="text-xs text-slate-500 dark:text-slate-400 my-2">Usa el grado y escenario de los desplegables de arriba. Incluye gramática, vocabulario y pronunciación del currículo.</p>
    <p className="text-sm font-semibold my-3">{grade} · {ready?`Escenario ${index+1}: ${scenario.scenarioName||scenario.scenario_title||scenario.title}`:'Cargando currículo…'}</p>
    <button disabled={!ready} onClick={create} className="w-full bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-xl font-bold text-xs disabled:opacity-40">CREAR PÓSTER SCENARIO</button>
    {error&&<p role="alert" className="text-red-500 text-sm mt-3">{error}</p>}
    {preview&&<div role="dialog" aria-modal="true" aria-label="Póster del escenario" className="fixed inset-0 z-[100] bg-slate-950/90 p-4 overflow-auto"><div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-5"><div className="flex flex-wrap justify-between items-center gap-3 mb-3"><h2 className="font-bold">{preview.grade} · Escenario {preview.index+1}</h2><div className="flex gap-3"><button onClick={print} className="rounded-lg bg-teal-600 text-white px-4 py-2">Imprimir / Guardar PDF</button><button onClick={()=>setPreview(null)} className="px-3 py-2">Cerrar</button></div></div><p className="text-sm text-slate-500 mb-3">Formato A3 a color. Elige «Guardar como PDF» en la ventana de impresión. Para textos largos, utiliza papel A3 para conservar la legibilidad.</p><iframe ref={frame} title="Póster colorido del escenario" srcDoc={preview.html} sandbox="allow-same-origin allow-modals" className="w-full h-[75vh] bg-white border-0"/></div></div>}
  </section>;
}
