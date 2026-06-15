import React, { useEffect, useState } from 'react';
import { 
  FolderOpen, 
  Search, 
  Trash2, 
  Download, 
  FileEdit, 
  Calendar, 
  Award,
  BookOpen,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { databaseService } from '../services/firebase';
import EditorModal from '../components/EditorModal';

export default function Library({ user, onTriggerAlert }) {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Editor states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlans = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await databaseService.getSavedPlans(user.uid);
      // Sort: newest first
      const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPlans(sorted);
      setFilteredPlans(sorted);
    } catch (e) {
      console.error("Error loading library:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [user]);

  // Apply filters and search query
  useEffect(() => {
    let result = [...plans];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.grade.toLowerCase().includes(q)
      );
    }

    if (selectedFilter !== 'all') {
      result = result.filter(p => {
        if (selectedFilter === 'planner') return p.type === 'planner';
        if (selectedFilter === 'delivery') return p.type === 'delivery';
        if (selectedFilter === 'resources') return p.type === 'resources';
        if (selectedFilter === 'interdisciplinary') return p.type === 'interdisciplinary';
        if (selectedFilter === 'theme_planner') return p.type === 'theme_planner';
        if (selectedFilter === 'listeningscript') return p.type === 'listeningscript';
        return true;
      });
    }

    setFilteredPlans(result);
  }, [searchQuery, selectedFilter, plans]);

  const handleDelete = async (planId, e) => {
    e.stopPropagation(); // Stop card click opening the plan
    
    if (window.confirm("¿Estás seguro de que deseas eliminar permanentemente este documento?")) {
      try {
        await databaseService.deletePlanFromLibrary(user.uid, planId);
        onTriggerAlert("Documento eliminado de tu biblioteca.", "success");
        fetchPlans(); // Refresh lists
      } catch (err) {
        onTriggerAlert("Error al intentar eliminar el documento.", "error");
      }
    }
  };

  const handleDownload = (plan, e) => {
    e.stopPropagation();
    const blob = new Blob(['\ufeff', plan.content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${plan.title.replace(/\s+/g, '_')}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenPlan = (plan) => {
    setSelectedPlan(plan);
    setIsEditorOpen(true);
  };

  const handleSavePlan = async (updatedPlan) => {
    try {
      await databaseService.savePlanToLibrary(user.uid, updatedPlan);
      setIsEditorOpen(false);
      onTriggerAlert("¡Cambios guardados con éxito!", "success");
      fetchPlans(); // Refresh lists
    } catch (e) {
      onTriggerAlert("Error al guardar los cambios en la biblioteca.", "error");
    }
  };

  const badges = {
    planner: { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', label: 'Planner AOA', icon: <BookOpen className="w-3.5 h-3.5" /> },
    delivery: { bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20', label: 'Lesson Delivery', icon: <Award className="w-3.5 h-3.5" /> },
    resources: { bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20', label: 'Recursos Pack', icon: <Sparkles className="w-3.5 h-3.5" /> },
    interdisciplinary: { bg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20', label: 'Integrado', icon: <Sparkles className="w-3.5 h-3.5" /> },
    theme_planner: { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', label: 'Theme Planner', icon: <Layers className="w-3.5 h-3.5" /> },
    listeningscript: { bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20', label: 'Script de Audio', icon: <Sparkles className="w-3.5 h-3.5" /> },
  };

  const getPlanBadge = (type) => badges[type] || { bg: 'bg-slate-500/10 text-slate-600 border-slate-500/20', label: 'Plan', icon: <Sparkles className="w-3.5 h-3.5" /> };

  const filterTabs = [
    { id: 'all', label: 'Todos' },
    { id: 'planner', label: 'AOA Planners' },
    { id: 'delivery', label: 'Lesson Deliveries' },
    { id: 'resources', label: 'Recursos Impresibles' },
    { id: 'interdisciplinary', label: 'Interdisciplinario' },
    { id: 'theme_planner', label: 'Theme Planners' },
    { id: 'listeningscript', label: 'Scripts de Audio' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Search and Filters bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-3xl bg-white/60 dark:bg-slate-900/60">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por título o grado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input outline-none text-xs"
          />
        </div>

        {/* Categories select for mobile */}
        <div className="md:hidden">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="w-full border border-slate-200 dark:border-slate-800 rounded-2xl px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 outline-none"
          >
            {filterTabs.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Categories tabs list for desktop */}
        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`
                px-4 py-2 rounded-xl text-xs font-bold transition active:scale-95 flex-shrink-0
                ${selectedFilter === tab.id 
                  ? 'bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-slate-200'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Library Grid Documents List */}
      {loading ? (
        <div className="glass-panel p-16 rounded-3xl text-center flex flex-col items-center justify-center min-h-[450px]">
          <div className="loader mb-4"></div>
          <p className="text-xs text-slate-400 dark:text-slate-500 animate-pulse font-bold tracking-widest">Cargando biblioteca...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="glass-panel p-20 rounded-3xl text-center min-h-[450px] flex flex-col justify-center items-center">
          <div className="bg-slate-100 dark:bg-slate-900/60 w-20 h-20 rounded-full flex items-center justify-center mb-5 border border-slate-200 dark:border-slate-800">
            <FolderOpen className="text-slate-400 w-9 h-9" />
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-bold font-display text-base">
            No se encontraron documentos
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1.5 leading-relaxed">
            {searchQuery || selectedFilter !== 'all' 
              ? 'Intenta cambiar los términos de búsqueda o filtros establecidos.' 
              : 'Las planeaciones que generes se guardarán automáticamente aquí.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => {
            const b = getPlanBadge(plan.type);
            return (
              <div 
                key={plan.id}
                onClick={() => handleOpenPlan(plan)}
                className="w-full text-left glass-panel p-5 rounded-3xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between h-[180px] hover:translate-y-[-4px] cursor-pointer group active:scale-[0.99] transition-all"
              >
                {/* Card Top: badge and delete handle */}
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${b.bg}`}>
                    {b.icon} {b.label}
                  </span>
                  
                  <button
                    onClick={(e) => handleDelete(plan.id, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/20 active:scale-90 transition"
                    title="Eliminar permanentemente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Card Body: Title and Grade */}
                <div className="space-y-1 my-3 overflow-hidden">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-500 dark:group-hover:text-blue-400 transition">
                    {plan.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    GRADO: {plan.grade || 'Sin definir'}
                  </p>
                </div>

                {/* Card Bottom: Date and Export controls */}
                <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-800/60 pt-3 flex-shrink-0">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold uppercase tracking-wide">
                      {new Date(plan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={(e) => handleDownload(plan, e)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition"
                      title="Exportar a Word"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-blue-500 group-hover:text-white dark:group-hover:bg-blue-600 transition">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor Modal Overlay */}
      <EditorModal 
        isOpen={isEditorOpen}
        plan={selectedPlan}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSavePlan}
      />

    </div>
  );
}
