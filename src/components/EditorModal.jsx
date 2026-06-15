import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Download, Save, Check, FileEdit } from 'lucide-react';

export default function EditorModal({ isOpen, plan, onClose, onSave }) {
  if (!isOpen || !plan) return null;

  const [title, setTitle] = useState(plan.title || '');
  const [content, setContent] = useState(plan.content || '');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const editableRef = useRef(null);

  const isJsonString = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  };

  const convertScriptJsonToHtml = (jsonStr) => {
    try {
      const parsed = JSON.parse(jsonStr);
      return `
<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; color: #333; line-height: 1.6; padding: 20px; background: #fff;">
  <div style="text-align: center; margin-bottom: 20px; border-bottom: 3px double #1a3a5c; padding-bottom: 10px;">
    <h2 style="font-size: 14px; font-weight: bold; margin: 2px 0; color: #1a3a5c;">MINISTRY OF EDUCATION</h2>
    <h3 style="font-size: 12px; font-weight: bold; margin: 2px 0; color: #1a3a5c;">EFL CLASSROOM LISTENING RESOURCE</h3>
    <h3 style="font-size: 12px; font-weight: bold; margin: 2px 0;">🎧 LISTENING SCRIPT: ${parsed.title || 'Finding My Next Adventure!'}</h3>
  </div>

  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px; border: 1px dashed #1a5276;">
    <tr style="background: #d6eaf8;">
      <td style="font-weight: bold; border: 1px solid #ccc; padding: 8px; width: 120px;">Setting:</td>
      <td style="border: 1px solid #ccc; padding: 8px;">${parsed.setting || 'In the Library'}</td>
    </tr>
    <tr>
      <td style="font-weight: bold; border: 1px solid #ccc; padding: 8px;">Characters:</td>
      <td style="border: 1px solid #ccc; padding: 8px;">
        ${(parsed.characters || []).map(c => `<b>${c.name}</b> (${c.role})`).join(', ')}
      </td>
    </tr>
  </table>

  <div style="border: 2px dashed #1a5276; padding: 20px; border-radius: 8px; font-family: 'Courier New', monospace; background: #fdfefe; font-size: 12px; margin-bottom: 25px;">
    ${(parsed.script || []).map(turn => `
      <p style="margin: 8px 0;"><b>${turn.speaker.toUpperCase()}:</b> "${turn.text}"</p>
    `).join('')}
  </div>

  <div style="background-color:#1a3a5c; color:white; font-weight:bold; font-size:12px; padding:6px 10px; margin-bottom: 10px;">
    COMPREHENSION QUESTIONS
  </div>
  <ol style="font-size: 12px; padding-left: 20px; margin-bottom: 20px;">
    ${(parsed.comprehensionQuestions || []).map(q => `
      <li style="margin-bottom: 8px;"><b>${q}</b><br/><span style="color:#666;">Answer: ____________________________________________________</span></li>
    `).join('')}
  </ol>
</div>
      `;
    } catch (e) {
      return `<div>Error: ${jsonStr}</div>`;
    }
  };

  useEffect(() => {
    setTitle(plan.title || '');
    let displayContent = plan.content || '';
    if (isJsonString(displayContent)) {
      displayContent = convertScriptJsonToHtml(displayContent);
    }
    setContent(displayContent);
    setSaved(false);
    setCopied(false);
  }, [plan]);

  const handleCopy = () => {
    if (editableRef.current) {
      const range = document.createRange();
      range.selectNode(editableRef.current);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const rawContent = editableRef.current ? editableRef.current.innerHTML : content;
    const blob = new Blob(['\ufeff', rawContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_') || 'Planeacion'}_${Date.now()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    const updatedHtml = editableRef.current ? editableRef.current.innerHTML : content;
    onSave({
      ...plan,
      title: title,
      content: updatedHtml,
      updatedAt: new Date().toISOString()
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-[9999] px-4 animate-fade-in py-6">
      <div className="w-full max-w-5xl h-full max-h-[90vh] glass-panel rounded-3xl border-t-4 border-indigo-500 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3 flex-1 mr-4">
            <div className="bg-indigo-500/10 p-2.5 rounded-xl text-indigo-600 dark:text-indigo-400">
              <FileEdit className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-100 font-extrabold text-base md:text-lg border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-indigo-500 focus:outline-none py-0.5 px-1 rounded transition w-full"
              placeholder="Título de la Planeación..."
            />
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scroll Workspace */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 dark:bg-slate-950/40 flex justify-center">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-6 md:p-10 text-slate-800 dark:text-slate-200 min-h-[700px] relative">
            <span className="absolute top-4 right-4 text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest pointer-events-none select-none">
              HOJA DE TRABAJO (EDITABLE)
            </span>
            <div 
              ref={editableRef}
              contentEditable 
              suppressContentEditableWarning
              className="meduca-table-container outline-none focus:ring-0 leading-relaxed text-sm font-sans"
              dangerouslySetInnerHTML={{ __html: content }}
              onBlur={() => {
                if (editableRef.current) {
                  setContent(editableRef.current.innerHTML);
                }
              }}
            />
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 md:p-5 border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 flex flex-wrap gap-3 justify-end flex-shrink-0">
          <button 
            onClick={handleCopy}
            className="flex-1 md:flex-none border border-slate-300 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500 animate-scale-up" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Todo'}</span>
          </button>
          
          <button 
            onClick={handleDownload}
            className="flex-1 md:flex-none border border-slate-300 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-indigo-500" />
            <span>Exportar a Word</span>
          </button>
          
          <button 
            onClick={handleSave}
            className="flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-95 transition"
          >
            {saved ? <Check className="w-4 h-4 text-white animate-scale-up" /> : <Save className="w-4 h-4" />}
            <span>{saved ? '¡Guardado!' : 'Guardar Cambios'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
