import { getAuth } from 'firebase/auth';
import { databaseService } from '../services/firebase';
import { illustratedSheets } from '../resources/illustratedPoster';
import { useEffect, useRef, useState } from 'react';

export default function ScenarioPoster({grade,scenario,index,ready,user,credits,isPremium}) {
  const [error,setError]=useState('');
  const [images,setImages]=useState([]),[busy,setBusy]=useState(false),[progress,setProgress]=useState('');
  const urls=useRef([]),controller=useRef(null);
  useEffect(()=>()=>{controller.current?.abort();urls.current.forEach(URL.revokeObjectURL);},[]);
  const illustrate=async()=>{
    if(busy)return;
    setBusy(true);setError('');
    try {
      illustratedSheets(scenario);
      if(!isPremium && credits<1)throw new Error('Necesitas un token para crear el póster.');
      const current=getAuth().currentUser;
      if(!current)throw new Error('Inicia sesión para crear las ilustraciones.');
      const token=await current.getIdToken();
      setImages([]);urls.current.forEach(URL.revokeObjectURL);urls.current=[];
      controller.current=new AbortController();
      {
        setProgress('Creando tu póster de una página…');
        const response=await fetch('/api/scenario-poster',{method:'POST',signal:controller.current.signal,headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({grade,index,sheetIndex:0})});
        if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||'No se pudo generar la imagen.');}
        const blob=await response.blob();
        if(!blob.type.startsWith('image/'))throw new Error('No se recibió una imagen válida.');
        const url=URL.createObjectURL(blob);urls.current.push(url);
        setImages(previous=>[...previous,{url,blob,grade,index,number:1}]);
        await databaseService.decrementCredits(user.uid);
      }
    }catch(e){if(e.name!=='AbortError')setError(e.message);}finally{setBusy(false);setProgress('');}
  };
  const savePdf=async()=>{
    try{
      const {jsPDF}=await import('jspdf');const doc=new jsPDF({format:'a4'});
      const img=images[0];
      if(!img)throw new Error('No hay póster para descargar.');
      {
        const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(img.blob);});
        const info=doc.getImageProperties(data),scale=Math.min(200/info.width,287/info.height);
        doc.addImage(data,info.fileType,(210-info.width*scale)/2,(297-info.height*scale)/2,info.width*scale,info.height*scale);
      }
      doc.save('Scenario-'+(images[0].index+1)+'-illustrated.pdf');
    }catch{setError('No se pudo crear el PDF. Puedes descargar la imagen del póster.');}
  };
  return <section className="mt-5 p-5 rounded-2xl border border-teal-400/30 bg-gradient-to-br from-teal-500/10 to-indigo-500/10">
    <h2 className="font-bold text-lg text-teal-700 dark:text-teal-300">Crear póster Scenario</h2>
    <p className="text-xs text-slate-500 dark:text-slate-400 my-2">Un solo póster A4 únicamente con Recommended Vocabulary del grado y escenario elegidos. Todas las palabras del JSON, cada una con su ilustración, organizadas por categoría.</p>
    <p className="text-sm font-semibold my-3">{grade} · {ready?`Escenario ${index+1}: ${scenario.scenarioName||scenario.scenario_title||scenario.title}`:'Cargando currículo…'}</p>
    <button disabled={!ready||busy} onClick={illustrate} className="w-full bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-xl font-bold text-xs disabled:opacity-40">{busy?progress:'CREAR PÓSTER ILUSTRADO'}</button>
    <p className="text-xs text-slate-500 mt-2">PDF A4 de una sola página · 1 token por póster generado.</p>
    {images.length>0&&<div className="mt-4 space-y-3"><p className="text-sm">Revisa que cada palabra y dibujo coincidan antes de imprimir.</p><button disabled={busy} onClick={savePdf} className="rounded-xl bg-indigo-600 text-white px-4 py-2">Descargar póster PDF · 1 página</button>{images.map(img=><figure key={img.url}><img src={img.url} alt={img.grade+' · Escenario '+(img.index+1)+' · Lámina '+img.number} className="w-full rounded-xl"/><figcaption className="text-sm mt-2"><a href={img.url} download={'Scenario-'+(img.index+1)+'-'+img.number+(img.blob.type==='image/jpeg'?'.jpg':img.blob.type==='image/webp'?'.webp':'.png')}>Descargar imagen {img.number}</a></figcaption></figure>)}</div>}
    {error&&<p role="alert" className="text-red-500 text-sm mt-3">{error}</p>}
  </section>;
}
