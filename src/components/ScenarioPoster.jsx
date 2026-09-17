import { useEffect, useRef, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { databaseService } from '../services/firebase';
import { posterTiles } from '../resources/illustratedPoster';
import { composePoster, paperSize } from '../resources/posterLayout';
import { classroomPosterHtml } from '../resources/classroomPoster';
import { scenarioPoster } from '../resources/scenarioPoster';
import { linguisticPosterStudioHtml } from '../resources/linguisticPosterStudioHtml';

export default function ScenarioPoster({ grade, scenario, index, ready, user, credits, isPremium, cefr = '', allScenarios = [] }) {
  const [poster, setPoster] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  
  // Modal viewer state for instant classroom poster (0 tokens)
  const [viewerOpen, setViewerOpen] = useState(false);
  const [posterType, setPosterType] = useState('linguistic'); // 'linguistic' | 'classroom'
  const iframeRef = useRef(null);

  const cache = useRef({ key: '', blobs: [] });
  const controller = useRef(null);
  const active = useRef(true);
  const running = useRef(false);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      controller.current?.abort();
    };
  }, []);

  useEffect(() => () => {
    if (poster) URL.revokeObjectURL(poster.url);
  }, [poster]);

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  const generate = async () => {
    if (running.current) return;
    running.current = true;
    setBusy(true);
    setError('');

    try {
      const source = posterTiles(scenario);
      const count = Math.ceil(source.tiles.length / 9);
      if (!isPremium && credits < 1) throw new Error('Necesitas un token para generar el póster.');
      const account = getAuth().currentUser;
      if (!account) throw new Error('Inicia sesión para generar las ilustraciones.');
      const token = await account.getIdToken();
      const key = JSON.stringify({ grade, index, scenario });
      if (poster?.key === key) return;
      if (cache.current.key !== key) cache.current = { key, blobs: [] };
      controller.current = new AbortController();

      for (let batchIndex = cache.current.blobs.length; batchIndex < count; batchIndex++) {
        if (!active.current) return;
        setProgress('Ilustrando y revisando ' + Math.min((batchIndex + 1) * 9, source.tiles.length) + ' de ' + source.tiles.length + ' palabras…');
        const response = await fetch('/api/scenario-poster', {
          method: 'POST',
          signal: controller.current.signal,
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ grade, index, sheetIndex: 0, batchIndex, posterVersion: 3 })
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'No se pudo generar este grupo de ilustraciones.');
        }
        const blob = await response.blob();
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(blob.type)) throw new Error('El servicio no devolvió una imagen válida.');
        cache.current.blobs.push(blob);
      }

      if (!active.current) return;
      setProgress('Preparando tu póster…');
      const blob = await composePoster(scenario, cache.current.blobs, grade, index, 'letter');
      if (!active.current) return;
      await databaseService.decrementCredits(user.uid);
      if (active.current) setPoster({ blob, url: URL.createObjectURL(blob), grade, index, title: source.title, key });
    } catch (e) {
      if (active.current && e.name !== 'AbortError') setError(e.message);
    } finally {
      running.current = false;
      if (active.current) {
        setBusy(false);
        setProgress('');
      }
    }
  };

  const download = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(poster.blob);
      });
      const size = paperSize('letter');
      const doc = new jsPDF({ format: 'letter' });
      doc.addImage(data, 'PNG', 10, 10, size.width - 20, size.height - 20);
      doc.save(poster.grade.replaceAll(' ', '_') + '-Scenario-' + (poster.index + 1) + '-poster.pdf');
    } catch {
      setError('No se pudo descargar el PDF. Intenta nuevamente.');
    }
  };

  const scenarioName = scenario?.scenarioName || scenario?.scenario_title || scenario?.title || `Escenario ${index + 1}`;

  const handleOpenStudio = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  // Pre-generate HTML for instant preview
  let previewHtml = '';
  if (ready && scenario) {
    try {
      previewHtml = posterType === 'classroom'
        ? classroomPosterHtml(scenario, grade, index, cefr)
        : linguisticPosterStudioHtml(scenario, grade, index, cefr, allScenarios);
    } catch (err) {
      previewHtml = `<div style="padding: 20px; font-family: sans-serif; color: #b91c1c;">${err.message}</div>`;
    }
  }

  return (
    <section className="mt-5 p-5 rounded-2xl border border-teal-400/30 bg-gradient-to-br from-teal-500/10 to-indigo-500/10">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-lg text-teal-700 dark:text-teal-300">Póster del Escenario</h2>
        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
          AOA Classroom
        </span>
      </div>

      <p className="text-sm my-2 text-slate-600 dark:text-slate-300">
        Láminas didácticas con vocabulario visual, fórmulas de diálogo en parejas y gramática según el escenario seleccionado.
      </p>

      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mb-3">
        {grade} · Escenario {index + 1}{ready ? ` · ${scenarioName}` : ''}
      </p>

      <div className="flex flex-col gap-2">
        {/* Instant Classroom Poster Button (0 Tokens) */}
        <button
          disabled={!ready}
          onClick={() => setViewerOpen(true)}
          className="w-full bg-teal-600 hover:bg-teal-700 active:scale-95 text-white p-3 rounded-xl font-bold text-xs transition shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
        >
          <span>🖼️</span> VER PÓSTER DE AULA (0 TOKENS)
        </button>

        {/* AI Illustrated Poster Generation Button */}
        <button
          disabled={!ready || busy}
          onClick={generate}
          className="w-full bg-indigo-600/90 hover:bg-indigo-700 active:scale-95 text-white p-2.5 rounded-xl font-bold text-xs transition disabled:opacity-40 flex items-center justify-center gap-1.5"
        >
          {busy ? progress : '✨ Generar Atlas Ilustrado con IA (1 Token)'}
        </button>
      </div>

      {busy && (
        <button className="mt-2 text-xs text-slate-500 underline hover:text-slate-700 block mx-auto" onClick={() => controller.current?.abort()}>
          Cancelar generación
        </button>
      )}

      {error && <p role="alert" className="text-red-500 text-xs my-2 font-medium">⚠️ {error}</p>}

      {poster && (
        <figure className="mt-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <figcaption className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {poster.grade} · {poster.title}
          </figcaption>
          <img src={poster.url} alt={'Póster ilustrado: ' + poster.title} className="w-full h-auto rounded-lg shadow-sm mb-3" />
          <button onClick={download} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-2.5 w-full text-xs font-bold transition flex items-center justify-center gap-1.5">
            ⬇️ Descargar Póster PDF · 1 página
          </button>
        </figure>
      )}

      {/* ── MODAL VIEWER FOR INSTANT CLASSROOM POSTER ── */}
      {viewerOpen && (
        <div className="fixed inset-0 z-[110] bg-black/75 overflow-y-auto p-2 sm:p-4 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true">
          <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl p-5 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto flex flex-col">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider block">
                  Material Didáctico para el Aula
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Póster del Escenario · {grade}
                </h3>
              </div>
              <button onClick={() => setViewerOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-lg p-2" aria-label="Cerrar">
                ✕
              </button>
            </div>

            {/* Poster Type Switcher & Action Controls */}
            <div className="flex flex-wrap justify-between items-center gap-2 my-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
              <div className="flex gap-2">
                <button
                  onClick={() => setPosterType('linguistic')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${posterType === 'linguistic' ? 'bg-teal-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                >
                  📖 Lámina Lingüística AOA (Studio)
                </button>
                <button
                  onClick={() => setPosterType('classroom')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${posterType === 'classroom' ? 'bg-teal-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                >
                  🏫 Póster de Aula (Accional & Diálogo)
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenStudio}
                  title="Abrir estudio completo en pestaña independiente"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span>🚀</span> Pestaña Completa
                </button>
                <button
                  onClick={handlePrint}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  🖨️ Imprimir / Guardar PDF
                </button>
              </div>
            </div>

            {/* Iframe Preview Container */}
            <div className="border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden bg-white">
              <iframe
                ref={iframeRef}
                title="Vista previa del póster del escenario"
                srcDoc={previewHtml}
                className="w-full h-[70vh] bg-white border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
