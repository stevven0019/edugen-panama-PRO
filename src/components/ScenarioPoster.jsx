import { getAuth } from 'firebase/auth';
import { databaseService } from '../services/firebase';
import { illustratedSheets } from '../resources/illustratedPoster';
import { useEffect, useRef, useState } from 'react';
import { scenarioPoster } from '../resources/scenarioPoster';

export default function ScenarioPoster({grade,scenario,index,ready,user,credits,isPremium}) {
  const [preview,setPreview]=useState(null),[error,setError]=useState('');
  const frame=useRef(null);
  const [images,setImages]=useState([]),[busy,setBusy]=useState(false),[progress,setProgress]=useState('');
  const urls=useRef([]),controller=useRef(null);
  useEffect(()=>()=>{controller.current?.abort();urls.current.forEach(URL.revokeObjectURL);},[]);
  const illustrate=async()=>{
    if(busy)return;
    setBusy(true);setError('');
    try {
      const {sheets}=illustratedSheets(scenario);
      if(!isPremium && credits<sheets.length)throw new Error('Necesitas '+sheets.length+' tokens para este conjunto de láminas.');
      const current=getAuth().currentUser;
      if(!current)throw new Error('Inicia sesión para crear las ilustraciones.');
      const token=await current.getIdToken();
      setImages([]);urls.current.forEach(URL.revokeObjectURL);urls.current=[];
      controller.current=new AbortController();
      for(let n=0;n<sheets.length;n++){
        setProgress('Ilustrando lámina '+(n+1)+' de '+sheets.length+'…');
        const response=await fetch('/api/scenario-poster',{method:'POST',signal:controller.current.signal,headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({grade,index,sheetIndex:n})});
        if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||'No se pudo generar la imagen.');}
        const blob=await response.blob();
        if(!blob.type.startsWith('image/'))throw new Error('No se recibió una imagen válida.');
        const url=URL.createObjectURL(blob);urls.current.push(url);
        setImages(previous=>[...previous,{url,blob,grade,index,number:n+1}]);
        await databaseService.decrementCredits(user.uid);
      }
    }catch(e){if(e.name!=='AbortError')setError(e.message);}finally{setBusy(false);setProgress('');}
  };
  const savePdf=async()=>{
    try{
      const {jsPDF}=await import('jspdf');const doc=new jsPDF({format:'a3'});
      for(const [n,img] of images.entries()){
        const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(img.blob);});
        if(n)doc.addPage();const info=doc.getImageProperties(data),scale=Math.min(277/info.width,400/info.height);
        doc.addImage(data,info.fileType,(297-info.width*scale)/2,(420-info.height*scale)/2,info.width*scale,info.height*scale);
      }
      doc.save('Scenario-'+(images[0].index+1)+'-illustrated.pdf');
    }catch{setError('No se pudo crear el PDF. Puedes descargar cada imagen individualmente.');}
  };
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
    <p className="text-xs text-slate-500 dark:text-slate-400 my-2">Usa el grado y escenario de los desplegables de arriba. Ilustraciones grandes con su palabra en inglés, agrupadas por categoría. El vocabulario se extrae del JSON seleccionado.</p>
    <p className="text-sm font-semibold my-3">{grade} · {ready?`Escenario ${index+1}: ${scenario.scenarioName||scenario.scenario_title||scenario.title}`:'Cargando currículo…'}</p>
    <button disabled={!ready||busy} onClick={illustrate} className="w-full bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-xl font-bold text-xs disabled:opacity-40">{busy?progress:'CREAR PÓSTER ILUSTRADO'}</button>
    <button disabled={!ready||busy} onClick={create} className="text-sm underline mt-3">Ver información del currículo</button>
    <p className="text-xs text-slate-500 mt-2">Hasta 20 palabras por lámina · 1 token por imagen generada.</p>
    {images.length>0&&<div className="mt-4 space-y-3"><p className="text-sm">Revisa que cada palabra y dibujo coincidan antes de imprimir.</p><button disabled={busy} onClick={savePdf} className="rounded-xl bg-indigo-600 text-white px-4 py-2">Descargar láminas en PDF</button>{images.map(img=><figure key={img.url}><img src={img.url} alt={img.grade+' · Escenario '+(img.index+1)+' · Lámina '+img.number} className="w-full rounded-xl"/><figcaption className="text-sm mt-2"><a href={img.url} download={'Scenario-'+(img.index+1)+'-'+img.number+(img.blob.type==='image/jpeg'?'.jpg':img.blob.type==='image/webp'?'.webp':'.png')}>Descargar imagen {img.number}</a></figcaption></figure>)}</div>}
    {error&&<p role="alert" className="text-red-500 text-sm mt-3">{error}</p>}
    {preview&&<div role="dialog" aria-modal="true" aria-label="Póster del escenario" className="fixed inset-0 z-[100] bg-slate-950/90 p-4 overflow-auto"><div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-2xl p-5"><div className="flex flex-wrap justify-between items-center gap-3 mb-3"><h2 className="font-bold">{preview.grade} · Escenario {preview.index+1}</h2><div className="flex gap-3"><button onClick={print} className="rounded-lg bg-teal-600 text-white px-4 py-2">Imprimir / Guardar PDF</button><button onClick={()=>setPreview(null)} className="px-3 py-2">Cerrar</button></div></div><p className="text-sm text-slate-500 mb-3">Formato A3 a color. Elige «Guardar como PDF» en la ventana de impresión. Para textos largos, utiliza papel A3 para conservar la legibilidad.</p><iframe ref={frame} title="Póster colorido del escenario" srcDoc={preview.html} sandbox="allow-same-origin allow-modals" className="w-full h-[75vh] bg-white border-0"/></div></div>}
  </section>;
}
