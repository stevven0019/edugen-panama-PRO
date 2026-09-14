import { jsPDF } from 'jspdf';
import { validatePack } from './activityPack.js';

export function buildWorkbook(pack) {
  validatePack(pack);
  const doc = new jsPDF();
  const write = (value, x, y, width = 174, size = 12) => {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(value), width);
    doc.text(lines, x, y);
    return y + lines.length * size * 0.43;
  };
  const page = (title, subtitle, first = false) => {
    if (!first) doc.addPage();
    doc.setFillColor(17, 94, 105); doc.rect(0, 0, 210, 12, 'F');
    doc.setTextColor(17, 94, 105); write('EDUGEN PRO  /  '+pack.grade, 18, 23,174,10);
    doc.setTextColor(25, 40, 60); doc.setFont('helvetica','bold');
    const y = write(title,18,35,174,16);
    doc.setFont('helvetica','normal'); write(subtitle,18,y+7,174,11);
    doc.setDrawColor(180); doc.setLineWidth(0.3);
    doc.setTextColor(90); write('EduGen Pro  |  '+doc.getNumberOfPages(),18,286,174,9);
    doc.setTextColor(25,40,60);
  };
  // Simple vector illustrations stay sharp and print without external image services.
  const icon = (name,x,y,s=24) => {
    doc.setDrawColor(25,65,85); doc.setLineWidth(0.8); doc.setFillColor(233,246,249);
    if (name==='book') { doc.rect(x,y,s,s*.72,'FD'); doc.line(x+s/2,y,x+s/2,y+s*.72); }
    else if(name==='bag') { doc.roundedRect(x,y,s,s*.85,3,3,'FD');doc.roundedRect(x+s*.3,y-s*.2,s*.4,s*.3,2,2);doc.rect(x+s*.2,y+s*.35,s*.6,s*.3); }
    else if(name==='desk'||name==='chair') { doc.rect(x,y+s*.4,s,s*.12,'FD');doc.line(x+2,y+s*.52,x+2,y+s);doc.line(x+s-2,y+s*.52,x+s-2,y+s);if(name==='chair')doc.rect(x+2,y,s-4,s*.4,'FD'); }
    else if(name==='pencil'||name==='crayon') {doc.rect(x+s*.3,y,s*.25,s*.7,'FD');doc.triangle(x+s*.3,y+s*.7,x+s*.55,y+s*.7,x+s*.425,y+s,'FD');if(name==='pencil')doc.line(x+s*.3,y+4,x+s*.55,y+4);else doc.rect(x+s*.25,y+s*.2,s*.35,s*.3);}
    else if(name==='house') {doc.rect(x,y+s*.4,s,s*.6,'FD');doc.triangle(x-2,y+s*.4,x+s/2,y,x+s+2,y+s*.4);doc.rect(x+s*.4,y+s*.65,s*.2,s*.35);}
    else if(name==='fish') {doc.ellipse(x+s*.4,y+s*.5,s*.4,s*.25,'FD');doc.triangle(x+s*.75,y+s*.5,x+s,y+s*.2,x+s,y+s*.8,'FD');doc.circle(x+s*.2,y+s*.45,1,'F');}
    else if(name==='tree'||name==='flower') {doc.line(x+s/2,y+s*.4,x+s/2,y+s);doc.circle(x+s/2,y+s*.3,s*.3,'FD');if(name==='flower')for(let i=0;i<6;i++){const a=i*Math.PI/3;doc.circle(x+s/2+Math.cos(a)*s*.22,y+s*.3+Math.sin(a)*s*.22,s*.1);}}
    else {doc.circle(x+s/2,y+s/2,s*.4,'FD');if(name==='ball'){doc.line(x+s*.1,y+s*.5,x+s*.9,y+s*.5);doc.ellipse(x+s*.5,y+s*.5,s*.15,s*.4);}if(name==='apple')doc.line(x+s*.5,y+s*.1,x+s*.65,y-s*.1);if(name==='sun')for(let i=0;i<8;i++){const a=i*Math.PI/4;doc.line(x+s/2+Math.cos(a)*s*.46,y+s/2+Math.sin(a)*s*.46,x+s/2+Math.cos(a)*s*.6,y+s/2+Math.sin(a)*s*.6);}}
  };
  const picture = (o,x,y,w) => {
    if(!o.position||o.position==='none') return icon(o.icon,x+w/2-13,y+12,26);
    const ax=x+w/2-17;
    icon(o.anchor,ax,y+17,34);
    if(o.position==='on')icon(o.icon,ax+10,y+(o.anchor==='desk'?21.24:7.64),13);
    if(o.position==='under')icon(o.icon,ax+10,y+38,12);
    if(o.position==='next_to')icon(o.icon,ax+37,y+22,12);
    if(o.position==='in')icon(o.icon,ax+10,y+19,13);
  };
  page(pack.title,pack.lessonTitle,true);
  write('Name: __________________________________',18,85);
  write('Date: __________________',18,100);
  write('Focus: '+pack.skill,18,122);
  write('My activity workbook',18,155,174,24);
  write('Listen, explore and show what you can do.',18,174);
  write('Student pages first. Teacher guide and assessment at the end.',18,244,170,10);
  for(const [n,a] of pack.activities.entries()) {
    page(`${n+1}. ${a.title}`,a.instruction);
    if(a.type==='picture_choice')a.items.forEach((item,i)=>{
      const y=79+i*61,w=174/item.options.length;
      write(String(i+1),13,y+6,5,9);
      item.options.forEach((o,j)=>{doc.setDrawColor(185);doc.setLineWidth(0.3);doc.roundedRect(18+j*w,y,w-4,55,3,3);picture(o,18+j*w,y,w-4);write(String.fromCharCode(65+j),21+j*w,y+6,15,9);});
    });
    if(a.type==='match')a.items.forEach((item,i)=>{
      const y=80+i*43;icon(item.icon,28,y,25);doc.circle(70,y+12,1);
      const word=a.items[(i+1)%a.items.length].word;doc.circle(119,y+12,1);write(word,128,y+15,60,13);
    });
    if(a.type==='read_answer') {
      let y=write(a.passage,18,78,174,12)+12;
      a.questions.forEach((q,i)=>{y=write(`${i+1}. ${q.question}`,18,y,174,12)+6;doc.setDrawColor(170);doc.line(18,y,192,y);doc.line(18,y+9,192,y+9);y+=24;});
    }
    if(a.type==='draw_write'){write(a.prompt,18,78,174,13);doc.setDrawColor(170);doc.roundedRect(18,107,174,100,3,3);for(let y=224;y<=260;y+=12)doc.line(18,y,192,y);}
  }
  pack.activities.forEach((a,n)=>{
    page('Teacher guide',`Activity ${n+1}: ${a.title}`);
    let y=80;
    const entry=t=>{doc.setFontSize(12);if(y+doc.splitTextToSize(t,174).length*5.2>265){page('Teacher guide','Continued');y=80;}y=write(t,18,y,174,12)+12;};
    if(a.type==='picture_choice')a.items.forEach((i,k)=>{entry(`${k+1}. Say: ${i.teacherPrompt}`);entry(`Answer: ${String.fromCharCode(65+i.answerIndex)} - ${i.options[i.answerIndex].label}`);});
    if(a.type==='match')a.items.forEach((i,k)=>entry(`${k+1}. ${i.icon}: ${i.word} (word position ${((k-1+a.items.length)%a.items.length)+1})`));
    if(a.type==='read_answer')a.questions.forEach((q,k)=>entry(`${k+1}. ${q.answer}`));
    if(a.type==='draw_write')entry(a.teacherGuide);
  });
  page('Observation rubric','Assess the lesson objectives using the evidence from these activities.');
  let y=76;
  pack.rubric.forEach(row=>{
    doc.setFontSize(10);const needed=Object.values(row).reduce((n,t)=>n+doc.splitTextToSize(t,155).length*5,0)+25;if(y+needed>270){page('Observation rubric','Continued');y=76;}
    doc.setFont('helvetica','bold');y=write(row.criterion,18,y,174,12)+3;doc.setFont('helvetica','normal');
    for(const [label,key] of [['Independent','independent'],['With support','withSupport'],['Emerging','emerging']])y=write(`${label}: ${row[key]}`,18,y,174,10)+2;
    y+=7;
    if(y>245 && row!==pack.rubric.at(-1)){page('Observation rubric','Continued');y=76;}
  });
  return doc;
}
export function downloadWorkbook(pack) { buildWorkbook(pack).save(pack.title.replace(/[^a-z0-9_-]/gi,'_')+'.pdf'); }
