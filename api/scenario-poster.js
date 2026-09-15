import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { curriculumFilename } from '../src/services/aoaCurriculum.js';
import { illustrationPrompt } from '../src/resources/illustratedPoster.js';

export const config = { maxDuration: 60 };
export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const key=process.env.GEMINI_API_KEY||process.env.VITE_GEMINI_API_KEY;
  const firebaseKey=process.env.VITE_FIREBASE_API_KEY;
  if(!key||!firebaseKey)return res.status(503).json({error:'La generación de imágenes requiere configurar Gemini y Firebase en Vercel.'});
  const token=req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if(!token)return res.status(401).json({error:'Inicia sesión para crear láminas ilustradas.'});
  try {
    const auth=await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:token}),signal:AbortSignal.timeout(8000)});
    if(!auth.ok || !(await auth.json()).users?.length)return res.status(401).json({error:'Tu sesión expiró. Inicia sesión nuevamente.'});
    let prompt;
    try {
      const {grade,index,sheetIndex}=req.body||{};
      if(!Number.isInteger(index)||index<0||index>7)throw Error('Escenario no válido.');
      if(typeof grade !== 'string' || !/^(Pre-K|Kinder|(?:[1-9]|1[0-2])(?:st|nd|rd|th) Grade)$/.test(grade))throw Error('Grado no válido.');
      const filename=curriculumFilename(grade);
      const curriculum=JSON.parse(await readFile(path.join(process.cwd(),'public','curriculums',filename),'utf8'));
      if(!curriculum.scenarios[index])throw Error('Escenario no válido.');
      prompt=illustrationPrompt(curriculum.scenarios[index],grade,index,sheetIndex);
    }catch{return res.status(400).json({error:'El grado, escenario o vocabulario seleccionado no está disponible.'});}
    const model=process.env.GEMINI_IMAGE_MODEL||'gemini-2.5-flash-image';
    const response=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,{method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{responseModalities:['TEXT','IMAGE']}}),signal:AbortSignal.timeout(48000)});
    if(!response.ok)return res.status(response.status===429?429:502).json({error:response.status===429?'Gemini alcanzó su cuota de imágenes. Intenta más tarde.':'Gemini no pudo crear la imagen. Revisa que la clave tenga acceso al modelo de imágenes y facturación habilitada.'});
    const result=await response.json();
    const data=result.candidates?.[0]?.content?.parts?.find(p=>p.inlineData?.mimeType?.startsWith('image/'))?.inlineData;
    if(!data||!['image/png','image/jpeg','image/webp'].includes(data.mimeType))return res.status(502).json({error:'Gemini no devolvió una imagen. Intenta nuevamente.'});
    const image=Buffer.from(data.data,'base64');
    if(image.length>4400000)return res.status(502).json({error:'La imagen supera el tamaño de descarga. Intenta nuevamente.'});
    res.setHeader('Content-Type',data.mimeType);return res.status(200).send(image);
  }catch(error){return res.status(502).json({error:error.name==='TimeoutError'?'La generación tardó demasiado. Intenta nuevamente.':'No se pudo conectar con el servicio de imágenes.'});}
}
