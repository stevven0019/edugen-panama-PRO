import { useEffect, useRef, useState } from 'react';
import { databaseService } from '../services/firebase';
import { generateActivityPack, latestAoa } from '../resources/activityPack';
import { buildWorkbook, downloadWorkbook } from '../resources/workbookPdf';

const plain = html => new DOMParser().parseFromString(html || '', 'text/html').body.textContent || '';
async function readLesson(file) {
  if (!file || file.size > 2 * 1024 * 1024) throw new Error('Selecciona una lección de hasta 2 MB.');
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'pdf') {
    const data = await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.onerror=reject;r.readAsDataURL(file);});
    return {text:'Extract the AOA lesson from this PDF.',media:{mimeType:'application/pdf',data}};
  }
  let text;
  if(ext==='docx'){const mammoth=await import('mammoth/mammoth.browser');text=(await mammoth.extractRawText({arrayBuffer:await file.arrayBuffer()})).value;}
  else if(ext==='txt'||ext==='doc'){text=await file.text();if(ext==='doc'){if(!/<(?:html|table|body)/i.test(text))throw new Error('Convierte este archivo Word antiguo a DOCX o PDF.');text=plain(text);}}
  else throw new Error('Usa PDF, DOCX, TXT o el DOC exportado por EduGen.');
  if(text.trim().length<40||text.length>70000)throw new Error('La lección debe contener texto legible (máximo 70.000 caracteres).');
  return {text};
}

export default function ResourceWorkbook({user,credits,isPremium,downloadsLeft,onTriggerAlert,onClose,initialPack=null}) {
  const [lesson,setLesson]=useState(null),[source,setSource]=useState('latest'),[file,setFile]=useState(null);
  const [pack,setPack]=useState(initialPack),[url,setUrl]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[loading,setLoading]=useState(true);
  const controller=useRef(null);
  useEffect(()=>{let active=true;databaseService.getSavedPlans(user.uid).then(plans=>{if(active)setLesson(latestAoa(plans));}).catch(()=>{if(active)setError('No se pudo cargar la última lección.');}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;controller.current?.abort();};},[user.uid]);
  useEffect(()=>{if(!pack)return;let active=true,next;import('../resources/workbookPdf').then(({buildWorkbook})=>{if(!active)return;next=URL.createObjectURL(buildWorkbook(pack).output('blob'));setUrl(next);}).catch(e=>{if(active)setError(e.message);});return()=>{active=false;if(next)URL.revokeObjectURL(next);};},[pack]);
  const generate=async()=>{
    if(!isPremium&&credits<=0){setError('Necesitas tokens para generar recursos.');return;}
    setBusy(true);setError('');controller.current=new AbortController();
    try{
      const input=source==='file'?await readLesson(file):{text:JSON.stringify({grade:lesson.grade,title:lesson.title,context:lesson.lessonContext||{},lesson:plain(lesson.content)})};
      const result=await generateActivityPack(input,controller.current.signal);
      if (source === 'latest') result.grade = lesson.grade;
      buildWorkbook(result); // Validate the complete PDF before charging or saving.
      const now=new Date().toISOString();
      await databaseService.savePlanToLibrary(user.uid,{id:'resources_'+Date.now(),type:'resources',title:result.title,grade:result.grade,content:'Printable activity workbook (PDF)',activityPack:result,sourceLesson:source==='file'?file.name:lesson.id,createdAt:now,updatedAt:now});
      await databaseService.decrementCredits(user.uid);
      setPack(result);onTriggerAlert('Cuaderno PDF guardado en Mi Biblioteca.','success');
    }catch(e){if(e.name!=='AbortError')setError(e.message||'No se pudieron generar los recursos.');}finally{setBusy(false);}
  };
  const download=async()=>{if(!isPremium&&downloadsLeft<=0){setError('Has agotado tus descargas disponibles.');return;}try{downloadWorkbook(pack);if(!isPremium)await databaseService.decrementDownloads(user.uid);}catch(e){setError(e.message);}};
  return <div className="fixed inset-0 z-[100] bg-black/70 overflow-y-auto p-4" role="dialog" aria-modal="true" aria-label="Recursos y rúbrica">
    <div className="max-w-5xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-6 text-slate-900 dark:text-slate-100">
      <div className="flex justify-between gap-4"><h2 className="text-xl font-bold">Recursos & rúbrica · PDF</h2><button disabled={busy} onClick={onClose} aria-label="Cerrar">Cerrar ✕</button></div>
      {!initialPack&&<><p className="text-sm my-4">Crea actividades imprimibles con guía docente, respuestas y rúbrica a partir de tu lección.</p>
        <label className="block">Origen de la lección<select disabled={busy} className="block w-full p-3 my-2 rounded bg-slate-100 dark:bg-slate-800" value={source} onChange={e=>{setSource(e.target.value);setPack(null);setUrl('');setError('');}}><option value="latest">Última lección AOA guardada</option><option value="file">Subir una lección</option></select></label>
        {source==='latest'?<p className="text-sm my-4">{loading?'Buscando lección…':lesson?`${lesson.title} · ${lesson.grade}`:'Primero genera una lección AOA o sube un archivo.'}</p>:<label className="block my-4">Archivo de lección (máximo 2 MB)<input disabled={busy} className="block my-2" type="file" accept=".pdf,.docx,.doc,.txt" onChange={e=>{setFile(e.target.files[0]);setPack(null);setUrl('');}}/></label>}
        <button disabled={busy||(source==='latest'?loading||!lesson:!file)} onClick={generate} className="bg-violet-600 text-white rounded-xl px-6 py-3 disabled:opacity-40">{busy?'Preparando actividades y PDF…':'Generar cuaderno PDF'}</button>
      </>}
      {error&&<p role="alert" className="text-red-500 my-3">{error}</p>}
      {pack&&url&&<><button onClick={download} className="bg-emerald-600 text-white rounded-xl px-6 py-3 my-4">Descargar PDF</button><p className="text-sm mb-3">Revisa las actividades y respuestas antes de imprimir.</p><iframe title="Vista previa del cuaderno PDF" src={url} className="w-full h-[70vh] bg-white rounded"/></>}
    </div>
  </div>;
}
