import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Bot, 
  User, 
  Copy, 
  Check, 
  ChevronDown, 
  HelpCircle,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { askPedagogicalAssistant, QUICK_QUESTIONS, KNOWLEDGE_BASE } from '../services/pedagogicalAssistant';

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `¡Hola, colega docente! 👋 

Soy **AI English Panama**, tu asesor pedagógico inteligente y consultor curricular de **EduGen Panama**.

Estoy aquí para ayudarte a planificar tus clases de inglés, entender la metodología **AOA de MEDUCA**, estructurar tus lecciones y sacar el máximo provecho a la plataforma.

👇 *Puedes seleccionar una de las preguntas frecuentes o escribirme cualquier duda pedagógica:*`,
      timestamp: new Date()
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized, messages]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || loading) return;

    const userMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setLoading(true);

    try {
      // Pass conversation history
      const history = messages.filter(m => m.id !== 'welcome');
      const aiReply = await askPedagogicalAssistant(text, history);

      const botMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: aiReply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err) {
      console.error('Error asking pedagogical assistant:', err);
      setMessages(prev => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          sender: 'assistant',
          text: 'Lo siento, ocurrió una pequeña interrupción al consultar al asesor virtual. Puedes volver a intentarlo o consultar las guías predeterminadas.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: `¡Chat reiniciado! 👋\n\n¿En qué puedo orientarte hoy? Puedes preguntarme sobre **Lesson Plans**, **Theme Planners**, **Actividades con Realia**, **Proyectos Interdisciplinarios** o cualquier duda pedagógica sobre el currículo de MEDUCA.`,
        timestamp: new Date()
      }
    ]);
  };

  // Safe and clean Markdown rendering for assistant messages
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    return (
      <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-100">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Heading 3 or 4
          if (trimmed.startsWith('####')) {
            return (
              <h5 key={idx} className="font-bold text-xs uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mt-2">
                {trimmed.replace(/^####\s*/, '')}
              </h5>
            );
          }
          if (trimmed.startsWith('###')) {
            return (
              <h4 key={idx} className="font-extrabold text-sm text-blue-900 dark:text-blue-300 mt-2.5 pb-1 border-b border-slate-200/60 dark:border-slate-800 flex items-center gap-1.5">
                {trimmed.replace(/^###\s*/, '')}
              </h4>
            );
          }

          // Bullet points
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const content = trimmed.replace(/^[\*\-]\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1.5 my-1">
                <span className="text-blue-500 font-black text-xs leading-5 select-none">•</span>
                <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
              </div>
            );
          }

          // Numbered lists (1. 2. 3.)
          if (/^\d+\.\s+/.test(trimmed)) {
            const num = trimmed.match(/^(\d+\.)\s+/)[1];
            const content = trimmed.replace(/^\d+\.\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1.5 my-1">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs leading-5 select-none">{num}</span>
                <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
              </div>
            );
          }

          // Empty line
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Normal paragraph with inline formatting
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
          );
        })}
      </div>
    );
  };

  // Helper for inline markdown (**bold**, *italic*, `code`)
  const formatInline = (str) => {
    if (!str) return '';
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-200/60 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px] font-mono text-indigo-600 dark:text-indigo-300">$1</code>');
  };

  return (
    <>
      {/* ── Floating Launch Trigger Button (Visible across all tabs/pages) ── */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
        {/* Pulsating Callout Tooltip when closed */}
        {!isOpen && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden md:flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-blue-200/80 dark:border-blue-900/40 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer hover:border-blue-400 transition transform hover:-translate-x-1 select-none animate-fade-in"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <span>¿Dudas curriculares? <strong className="text-blue-600 dark:text-blue-400 font-extrabold">AI English</strong></span>
          </div>
        )}

        {/* Circular Avatar Button with Cyber Owl */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          aria-label="Abrir Chat Asistente IA"
          className="relative group p-1 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400/40"
        >
          {/* Inner container */}
          <div className="w-14 h-14 rounded-full bg-slate-950 p-0.5 flex items-center justify-center overflow-hidden relative">
            <img 
              src="/ai-english-owl.png" 
              alt="AI English Panama Owl" 
              className="w-full h-full object-contain rounded-full bg-white transition group-hover:scale-110"
            />
            {/* Status indicator dot */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 shadow-sm" />
          </div>

          {/* Unread badge */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border border-white text-[9px] font-bold text-white items-center justify-center">1</span>
            </span>
          )}
        </button>
      </div>

      {/* ── Main Chat Modal / Window ── */}
      {isOpen && (
        <div 
          className={`fixed right-4 sm:right-6 bottom-24 z-50 w-[calc(100vw-2rem)] sm:w-[440px] transition-all duration-300 ${
            isMinimized 
              ? 'h-14 overflow-hidden shadow-lg' 
              : 'h-[80vh] max-h-[660px] shadow-2xl flex flex-col'
          } rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 backdrop-blur-xl overflow-hidden animate-fade-in-up`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white p-3.5 px-4 flex items-center justify-between border-b border-blue-900/40 select-none flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-md flex-shrink-0 border border-blue-300/40">
                <img 
                  src="/ai-english-owl.png" 
                  alt="AI English Panama" 
                  className="w-full h-full object-contain"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-xs sm:text-sm tracking-tight text-white flex items-center gap-1">
                    AI English Panama
                  </h3>
                  <span className="bg-amber-400/20 text-amber-300 text-[9px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider border border-amber-400/30">
                    AOA IA
                  </span>
                </div>
                <p className="text-[10px] text-blue-200/80 font-medium leading-none mt-0.5">
                  Asesor Curricular MEDUCA & EduGen
                </p>
              </div>
            </div>

            {/* Header action buttons */}
            <div className="flex items-center gap-1 text-slate-300">
              <button 
                onClick={handleResetChat}
                title="Reiniciar conversación"
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Maximizar" : "Minimizar"}
                className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition active:scale-95"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                title="Cerrar chat"
                className="p-1.5 rounded-lg hover:bg-rose-500/20 hover:text-rose-300 transition active:scale-95 ml-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Content Body (when not minimized) */}
          {!isMinimized && (
            <>
              {/* Quick FAQs Chips Banner */}
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800/80 overflow-x-auto flex-shrink-0">
                <div className="flex items-center gap-1.5 pb-0.5">
                  <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 flex items-center gap-1 flex-shrink-0 mr-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Claves:
                  </span>
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {QUICK_QUESTIONS.map(q => (
                      <button
                        key={q.id}
                        onClick={() => handleSendMessage(q.query)}
                        disabled={loading}
                        className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
                      >
                        <span>{q.icon}</span>
                        <span>{q.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Messages Scroll Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/80">
                {messages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-7 h-7 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0 border border-slate-200 dark:border-slate-700 p-0.5 mt-1">
                        <img src="/ai-english-owl.png" alt="Owl" className="w-full h-full object-contain" />
                      </div>
                    )}

                    <div className={`relative max-w-[85%] rounded-2xl p-3.5 shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm'
                        : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-sm'
                    }`}>
                      {msg.sender === 'user' ? (
                        <p className="text-xs sm:text-sm font-medium whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        renderFormattedText(msg.text)
                      )}

                      {/* Message Footer */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/30 dark:border-slate-700/40 text-[10px] opacity-70">
                        <span>
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>

                        {msg.sender === 'assistant' && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            title="Copiar respuesta"
                            className="hover:opacity-100 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span className="text-[9px] text-emerald-600 font-bold">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span className="text-[9px]">Copiar</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex items-start gap-2.5 justify-start">
                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-white shadow-sm flex-shrink-0 border border-slate-200 dark:border-slate-700 p-0.5">
                      <img src="/ai-english-owl.png" alt="Owl" className="w-full h-full object-contain animate-pulse" />
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm p-3.5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">AI English pensando</span>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Escribe tu consulta pedagógica o de la página..."
                    disabled={loading}
                    className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputQuery.trim()}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-2xl shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer flex-shrink-0"
                    title="Enviar mensaje"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 px-1">
                  <span>Alineado a las normativas de MEDUCA Panamá</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">EduGen PRO AI</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
