import { useEffect, useRef, useState } from 'react';
import { databaseService } from '../services/firebase';
import { generateActivityPack, latestAoa } from '../resources/activityPack';
import { buildWorkbook, downloadWorkbook } from '../resources/workbookPdf';
import { renderWorkbookHtml } from '../resources/renderWorkbookHtml';

const plain = html => new DOMParser().parseFromString(html || '', 'text/html').body.textContent || '';

async function readLesson(file) {
  if (!file || file.size > 2 * 1024 * 1024) throw new Error('Selecciona una lección de hasta 2 MB.');
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') {
    const data = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result.split(',')[1]);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    return { text: 'Extract the AOA lesson from this PDF.', media: { mimeType: 'application/pdf', data } };
  }
  let text;
  if (ext === 'docx') {
    const mammoth = await import('mammoth/mammoth.browser');
    text = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
  } else if (ext === 'txt' || ext === 'doc') {
    text = await file.text();
    if (ext === 'doc') {
      if (!/<(?:html|table|body)/i.test(text)) throw new Error('Convierte este archivo Word antiguo a DOCX o PDF.');
      text = plain(text);
    }
  } else {
    throw new Error('Usa PDF, DOCX, TXT o el DOC exportado por EduGen.');
  }
  if (text.trim().length < 40 || text.length > 70000) throw new Error('La lección debe contener texto legible (máximo 70.000 caracteres).');
  return { text };
}

export default function ResourceWorkbook({ user, credits, isPremium, downloadsLeft, onTriggerAlert, onClose, initialPack = null }) {
  const [lesson, setLesson] = useState(null);
  const [source, setSource] = useState('latest');
  const [file, setFile] = useState(null);
  const [pack, setPack] = useState(initialPack);
  const [htmlUrl, setHtmlUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [viewMode, setViewMode] = useState('editorial'); // 'editorial' | 'pdf'
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const controller = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    let active = true;
    databaseService.getSavedPlans(user.uid)
      .then(plans => { if (active) setLesson(latestAoa(plans)); })
      .catch(() => { if (active) setError('No se pudo cargar la última lección.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => {
      active = false;
      controller.current?.abort();
    };
  }, [user.uid]);

  useEffect(() => {
    if (!pack) return;
    let active = true;
    let nextHtmlUrl = '';
    let nextPdfUrl = '';

    try {
      const htmlContent = renderWorkbookHtml(pack);
      nextHtmlUrl = URL.createObjectURL(new Blob([htmlContent], { type: 'text/html' }));
      if (active) setHtmlUrl(nextHtmlUrl);

      const pdfDoc = buildWorkbook(pack);
      nextPdfUrl = URL.createObjectURL(pdfDoc.output('blob'));
      if (active) setPdfUrl(nextPdfUrl);
    } catch (e) {
      if (active) setError(e.message);
    }

    return () => {
      active = false;
      if (nextHtmlUrl) URL.revokeObjectURL(nextHtmlUrl);
      if (nextPdfUrl) URL.revokeObjectURL(nextPdfUrl);
    };
  }, [pack]);

  const generate = async () => {
    if (!isPremium && credits <= 0) {
      setError('Necesitas tokens para generar recursos.');
      return;
    }
    setBusy(true);
    setError('');
    controller.current = new AbortController();

    try {
      const input = source === 'file'
        ? await readLesson(file)
        : { text: JSON.stringify({ grade: lesson.grade, title: lesson.title, context: lesson.lessonContext || {}, lesson: plain(lesson.content) }) };

      const result = await generateActivityPack(input, controller.current.signal);
      if (source === 'latest') result.grade = lesson.grade;

      buildWorkbook(result); // Validate PDF build
      const now = new Date().toISOString();
      await databaseService.savePlanToLibrary(user.uid, {
        id: 'resources_' + Date.now(),
        type: 'resources',
        title: result.title,
        grade: result.grade,
        content: 'Printable activity workbook (PDF)',
        activityPack: result,
        sourceLesson: source === 'file' ? file.name : lesson.id,
        createdAt: now,
        updatedAt: now
      });
      await databaseService.decrementCredits(user.uid);
      setPack(result);
      onTriggerAlert('Cuaderno pedagógico guardado en Mi Biblioteca.', 'success');
    } catch (e) {
      if (e.name !== 'AbortError') setError(e.message || 'No se pudieron generar los recursos.');
    } finally {
      setBusy(false);
    }
  };

  const handlePrint = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  const download = async () => {
    if (!isPremium && downloadsLeft <= 0) {
      setError('Has agotado tus descargas disponibles.');
      return;
    }
    try {
      downloadWorkbook(pack);
      if (!isPremium) await databaseService.decrementDownloads(user.uid);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/75 overflow-y-auto p-2 sm:p-4 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Recursos y rúbrica">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 text-slate-900 dark:text-slate-100 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
        <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[11px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase block">Material Didáctico Imprimible</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Recursos & Rúbrica · Libro de Actividades</h2>
          </div>
          <button disabled={busy} onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold p-2 transition" aria-label="Cerrar">
            ✕
          </button>
        </div>

        {!initialPack && !pack && (
          <div className="space-y-4 my-5">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Genera un cuaderno de actividades auténtico con ilustraciones nítidas, diálogos, tablas, guías para el docente (scripts de audio) y rúbricas formativas según el enfoque AOA de Panamá.
            </p>

            <label className="block">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Origen de la lección</span>
              <select
                disabled={busy}
                className="block w-full p-3.5 mt-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={source}
                onChange={e => { setSource(e.target.value); setPack(null); setError(''); }}
              >
                <option value="latest">Última lección AOA guardada en la plataforma</option>
                <option value="file">Subir un archivo de lección (PDF, Word DOCX/DOC, TXT)</option>
              </select>
            </label>

            {source === 'latest' ? (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-sm">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">Lección Seleccionada</span>
                {loading ? 'Buscando última lección...' : lesson ? (
                  <div className="font-extrabold text-slate-800 dark:text-slate-100">
                    {lesson.title} <span className="text-indigo-600 dark:text-indigo-400 font-normal">· {lesson.grade}</span>
                  </div>
                ) : 'Primero genera una lección AOA o sube un archivo.'}
              </div>
            ) : (
              <label className="block p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Archivo de lección (máximo 2 MB)</span>
                <input
                  disabled={busy}
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={e => { setFile(e.target.files[0]); setPack(null); }}
                />
              </label>
            )}

            <button
              disabled={busy || (source === 'latest' ? loading || !lesson : !file)}
              onClick={generate}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-2xl px-8 py-3.5 disabled:opacity-40 transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {busy ? (
                <>
                  <span className="animate-spin text-lg">⏳</span> Creando actividades pedagógicas e ilustraciones...
                </>
              ) : (
                '✨ Generar Libro de Actividades & Rúbrica'
              )}
            </button>
          </div>
        )}

        {error && (
          <div role="alert" className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm font-medium my-4">
            ⚠️ {error}
          </div>
        )}

        {pack && (
          <div className="space-y-4 my-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('editorial')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${viewMode === 'editorial' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                >
                  📖 Vista Libro Editorial (Ilustrado)
                </button>
                <button
                  onClick={() => setViewMode('pdf')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${viewMode === 'pdf' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200'}`}
                >
                  📄 Visor PDF Clásico
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  🖨️ Imprimir / Guardar como PDF
                </button>
                <button
                  onClick={download}
                  className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5"
                >
                  ⬇️ Descargar .pdf
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              💡 <strong>Consejo para imprimir:</strong> En la ventana de impresión, selecciona destino <em>"Guardar como PDF"</em> para obtener máxima resolución de vectores y fuentes.
            </p>

            <div className="border border-slate-300 dark:border-slate-700 rounded-2xl overflow-hidden shadow-inner bg-slate-950">
              <iframe
                ref={iframeRef}
                title="Vista previa del cuaderno educativo"
                src={viewMode === 'editorial' ? htmlUrl : pdfUrl}
                className="w-full h-[72vh] rounded-2xl bg-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
