import { posterTiles, numberRange } from './illustratedPoster.js';

export const paperSize = paper => paper === 'a4' ? {width:210,height:297} : {width:215.9,height:279.4};
const palette=['#edb900','#ff344e','#168acb','#f58a22','#20ac63','#9454d3'];
export async function composePoster(raw,blob,grade,index,paper='letter') {
  const source=posterTiles(raw),size=paperSize(paper);
  const bitmap=await createImageBitmap(blob);
  try {
    const canvas=document.createElement('canvas');canvas.width=1700;canvas.height=Math.round(1700*size.height/size.width);
    const ctx=canvas.getContext('2d');ctx.fillStyle='white';ctx.fillRect(0,0,canvas.width,canvas.height);
    const text=(value,x,y,maxWidth,font=30,color='#101e54')=>{
      ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';
      let actual=font;ctx.font=`bold ${actual}px Arial`;
      while(ctx.measureText(value).width>maxWidth && actual>14){actual--;ctx.font=`bold ${actual}px Arial`;}
      ctx.fillText(value,x,y,maxWidth);
    };
    const heading=source.title || 'Recommended Vocabulary';
    text(heading,850,65,1600,68,'#162658');
    text(`${grade} · Scenario ${index+1} · Recommended Vocabulary`,850,122,1600,26);
    const groups=Object.entries(Object.groupBy(source.entries,e=>e.category)).map(([category,entries])=>{
      const numeric=entries.length===1?numberRange(entries[0]):null;
      const cols=numeric?10:Math.min(6,entries.length);
      const rows=Math.ceil((numeric?.length||entries.length)/cols);
      return {category,entries,numeric,cols,rows,weight:numeric?Math.max(1.4,rows*.22):rows+.35};
    });
    const gap=20,available=canvas.height-190-gap*(groups.length-1),unit=available/groups.reduce((sum,g)=>sum+g.weight,0);
    let y=158;
    groups.forEach((group,g)=>{
      const h=unit*group.weight,color=palette[g%palette.length],x=24,w=1652;
      ctx.strokeStyle=color;ctx.lineWidth=7;ctx.beginPath();ctx.roundRect(x,y,w,h,24);ctx.stroke();
      const name=group.category.replace(/\b\w/g,c=>c.toUpperCase())+(group.numeric?' '+group.entries[0].word:'');
      const headingWidth=Math.min(900,Math.max(300,name.length*25));
      ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(850-headingWidth/2,y-6,headingWidth,48,20);ctx.fill();
      text(name,850,y+18,headingWidth-24,34,'white');
      const top=y+53,contentHeight=h-65,cw=(w-24)/group.cols,rh=contentHeight/group.rows;
      if(group.numeric){
        group.numeric.forEach((number,i)=>{
          const cx=x+12+(i%group.cols)*cw,cy=top+Math.floor(i/group.cols)*rh;
          ctx.fillStyle=['#ffe1ea','#fff2b2','#d8f6cf','#d2f3ff','#e5d8fc'][Math.floor(i/group.cols)%5];
          ctx.fillRect(cx+2,cy+2,cw-4,rh-4);text(String(number),cx+cw/2,cy+rh/2,cw-10,Math.min(32,rh*.72));
        });
      }else group.entries.forEach((entry,i)=>{
        const tile=source.tiles.findIndex(e=>e.category===entry.category&&e.word===entry.word);
        const cx=x+12+(i%group.cols)*cw,cy=top+Math.floor(i/group.cols)*rh;
        const sw=bitmap.width/source.columns,sh=bitmap.height/source.rows;
        const scale=Math.min((cw-14)/sw,(rh-42)/sh),dw=sw*scale,dh=sh*scale;
        ctx.drawImage(bitmap,(tile%source.columns)*sw,Math.floor(tile/source.columns)*sh,sw,sh,cx+(cw-dw)/2,cy+(rh-42-dh)/2,dw,dh);
        text(entry.word,cx+cw/2,cy+rh-20,cw-12,30);
      });
      y+=h+gap;
    });
    return await new Promise((resolve,reject)=>canvas.toBlob(result=>result?resolve(result):reject(new Error('No se pudo componer el póster.')),'image/png'));
  } finally {bitmap.close();}
}
