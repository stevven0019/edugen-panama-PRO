import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Download, Save, Check, FileEdit } from 'lucide-react';

export default function EditorModal({ isOpen, plan, onClose, onSave }) {
  if (!isOpen || !plan) return null;

  const [title, setTitle] = useState(plan.title || '');
  const [content, setContent] = useState(plan.content || '');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const editableRef = useRef(null);

  useEffect(() => {
    setTitle(plan.title || '');
    setContent(plan.content || '');
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
