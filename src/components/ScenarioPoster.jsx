import {useEffect,useRef,useState} from 'react';
import {getAuth} from 'firebase/auth';
import {databaseService} from '../services/firebase';
import {posterTiles} from '../resources/illustratedPoster';
import {composePoster,paperSize} from '../resources/posterLayout';

export default function ScenarioPoster({grade,scenario,index,ready,user,credits,isPremium}) {
  const [poster,setPoster]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[progress,setProgress]=useState('');
  const cache=useRef({key:'',blobs:[]}),controller=useRef(null),active=useRef(true),running=useRef(false);
  useEffect(()=>{active.current=true;return()=>{active.current=false;controller.current?.abort();};},[]);
  useEffect(()=>()=>{if(poster)URL.revokeObjectURL(poster.url);},[poster]);
  const generate=async()=>{
    if(running.current)return;
    running.current=true;setBusy(true);setError('');
    try{
      const source=posterTiles(scenario),count=Math.ceil(source.tiles.length/9);
      if(!isPremium && credits<1)throw new Error('Necesitas un token para generar el póster.');
      const account=getAuth().currentUser;
      if(!account)throw new Error('Inicia sesión para generar las ilustraciones.');
      const token=await account.getIdToken();
      const key=JSON.stringify({grade,index,scenario});
      if(poster?.key===key)return;
      if(cache.current.key!==key)cache.current={key,blobs:[]};
      controller.current=new AbortController();
      for(let batchIndex=cache.current.blobs.length;batchIndex<count;batchIndex++){
        if(!active.current)return;
        setProgress('Ilustrando y revisando '+Math.min((batchIndex+1)*9,source.tiles.length)+' de '+source.tiles.length+' palabras…');
        const response=await fetch('/api/scenario-poster',{method:'POST',signal:controller.current.signal,headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({grade,index,sheetIndex:0,batchIndex,posterVersion:2})});
        if(!response.ok){const data=await response.json().catch(()=>({}));throw new Error(data.error||'No se pudo generar este grupo de ilustraciones.');}
        const blob=await response.blob();
        if(!['image/png','image/jpeg','image/webp'].includes(blob.type))throw new Error('El servicio no devolvió una imagen válida.');
        cache.current.blobs.push(blob);
      }
      if(!active.current)return;
      setProgress('Preparando tu póster…');
      const blob=await composePoster(scenario,cache.current.blobs,grade,index,'letter');
      if(!active.current)return;
      await databaseService.decrementCredits(user.uid);
      if(active.current)setPoster({blob,url:URL.createObjectURL(blob),grade,index,title:source.title,key});
    }catch(e){if(active.current&&e.name!=='AbortError')setError(e.message);}finally{running.current=false;if(active.current){setBusy(false);setProgress('');}}
  };
  const download=async()=>{
    try{
      const {jsPDF}=await import('jspdf');
      const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(poster.blob);});
      const size=paperSize('letter'),doc=new jsPDF({format:'letter'});
      doc.addImage(data,'PNG',10,10,size.width-20,size.height-20);
      doc.save(poster.grade.replaceAll(' ','_')+'-Scenario-'+(poster.index+1)+'-poster.pdf');
    }catch{setError('No se pudo descargar el PDF. Intenta nuevamente.');}
  };
  return <section className="mt-5 p-5 rounded-2xl border border-teal-400/30 bg-gradient-to-br from-teal-500/10 to-indigo-500/10"><h2 className="font-bold text-lg text-teal-700 dark:text-teal-300">Crear póster Scenario</h2><p className="text-sm my-3">Ilustraciones creadas con IA para el vocabulario y nivel del escenario seleccionado.</p><p className="text-sm font-semibold mb-3">{grade} · Escenario {index+1}{ready?' · '+(scenario.scenarioName||scenario.scenario_title||scenario.title):''}</p><p className="text-xs text-slate-500 mb-3">Una página Carta · margen de 1 cm · 1 token al completar el póster. La generación puede tardar varios minutos.</p><button disabled={!ready||busy} onClick={generate} className="w-full bg-teal-600 text-white p-3 rounded-xl font-bold disabled:opacity-40">{busy?progress:'CREAR PÓSTER ILUSTRADO'}</button>{busy&&<button className="mt-3 underline text-sm" onClick={()=>controller.current?.abort()}>Cancelar</button>}{error&&<p role="alert" className="text-red-500 my-3">{error}</p>}{poster&&<figure className="mt-4"><figcaption className="text-sm mb-3">{poster.grade} · {poster.title}</figcaption><img src={poster.url} alt={'Póster ilustrado: '+poster.title} className="w-full h-auto rounded-xl"/><p className="text-xs my-3">Revisa las ilustraciones antes de usarlas en clase.</p><button onClick={download} className="bg-indigo-600 text-white rounded-xl p-3 w-full">Descargar póster PDF · 1 página</button></figure>}</section>;
}
