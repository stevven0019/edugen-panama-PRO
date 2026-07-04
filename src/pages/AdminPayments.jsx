import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Eye, 
  Calendar, 
  Mail, 
  FileText, 
  User, 
  RefreshCw, 
  AlertCircle,
  Coins,
  Sparkles,
  Search,
  Plus,
  Minus,
  Users
} from 'lucide-react';
import { databaseService } from '../services/firebase';

export default function AdminPayments({ user, onTriggerAlert }) {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [globalStats, setGlobalStats] = useState({ visits: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('pending'); // 'pending' | 'all' | 'stats'
  const [selectedScreenshot, setSelectedScreenshot] = useState(null); // Lightbox state
  const [searchEmail, setSearchEmail] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all'); // 'all' | 'pro' | 'free' | 'trial-empty'

  const fetchData = async () => {
    setLoading(true);
    try {
      const paymentsData = await databaseService.getPendingPayments();
      setPayments(paymentsData);
      
      const statsData = await databaseService.getGlobalStats();
      setGlobalStats(statsData);
      
      const usersData = await databaseService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      onTriggerAlert("Error al cargar los datos de administración.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAction = async (paymentId, status, targetUid, productType, tokenQuantity, amount) => {
    setActionLoadingId(paymentId + '_' + status);
    try {
      await databaseService.updatePaymentStatus(paymentId, status, targetUid, productType, tokenQuantity, amount);
      onTriggerAlert(
        status === 'approved' 
          ? "Pago aprobado. El usuario ha recibido sus beneficios." 
          : "Pago rechazado correctamente.",
        status === 'approved' ? "success" : "info"
      );
      // Reload list
      await fetchData();
    } catch (err) {
      console.error(err);
      onTriggerAlert("Error al procesar la acción de pago.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleModifyCredits = async (targetUid, currentCredits, amount) => {
    const newValue = Math.max(0, currentCredits + amount);
    setActionLoadingId(targetUid + '_credits');
    try {
      await databaseService.setCredits(targetUid, newValue);
      onTriggerAlert("Tokens actualizados correctamente.", "success");
      setUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, credits: newValue } : u));
    } catch (err) {
      console.error(err);
      onTriggerAlert("Error al actualizar tokens.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleUserPremium = async (targetUid, currentIsPremium) => {
    setActionLoadingId(targetUid + '_premium');
    try {
      await databaseService.togglePremium(targetUid, !currentIsPremium);
      onTriggerAlert(
        !currentIsPremium ? "Usuario promovido a PRO con éxito." : "Suscripción PRO del usuario revocada.",
        "success"
      );
      setUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, isPremium: !currentIsPremium } : u));
    } catch (err) {
      console.error(err);
      onTriggerAlert("Error al alternar estatus Premium.", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredPayments = payments.filter(p => {
    if (activeFilter === 'pending') {
      return p.status === 'pending';
    }
    return true; // show all
  });

  const filteredUsers = users.filter(u => {
    // Email Search Filter
    const matchesEmail = u.email.toLowerCase().includes(searchEmail.toLowerCase());
    
    // Role Filter
    if (userRoleFilter === 'pro') {
      return matchesEmail && u.isPremium;
    }
    if (userRoleFilter === 'free') {
      return matchesEmail && !u.isPremium && u.credits > 0;
    }
    if (userRoleFilter === 'trial-empty') {
      return matchesEmail && !u.isPremium && u.credits === 0;
    }
    return matchesEmail;
  });

  // Stats derivation
  const proCount = users.filter(u => u.isPremium).length;
  const activeTrialCount = users.filter(u => !u.isPremium && u.credits > 0 && u.credits <= 3).length;
  const completedTrialCount = users.filter(u => !u.isPremium && u.credits === 0).length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Check className="w-3.5 h-3.5" /> Aprobado
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <X className="w-3.5 h-3.5" /> Rechazado
          </span>
        );
      default:
        return (
          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 w-fit animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> Pendiente
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/5 dark:bg-slate-900/40 p-6 rounded-3xl border border-slate-200/40 dark:border-slate-800/40">
        <div>
          <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400">
            <ShieldCheck className="w-6 h-6" />
            <h2 className="text-xl font-extrabold tracking-tight">Consola de Administración</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Monitorea el tráfico de visitas, usuarios registrados, comprueba pagos por transferencias (Yappy/ACH) y gestiona los créditos de los clientes.
          </p>
        </div>

        <button 
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-650 dark:text-slate-355 shadow-sm active:scale-95 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Datos</span>
        </button>
      </div>

      {/* Tabs Filter */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
        <button
          onClick={() => setActiveFilter('pending')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeFilter === 'pending'
              ? 'text-rose-500 dark:text-rose-400 font-extrabold'
              : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          Pendientes por Revisar
          {activeFilter === 'pending' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 dark:bg-rose-400 rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveFilter('all')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeFilter === 'all'
              ? 'text-rose-500 dark:text-rose-400 font-extrabold'
              : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          Historial de Pagos
          {activeFilter === 'all' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 dark:bg-rose-400 rounded-full"></span>
          )}
        </button>
        <button
          onClick={() => setActiveFilter('stats')}
          className={`pb-3 text-xs font-bold transition-all relative ${
            activeFilter === 'stats'
              ? 'text-rose-500 dark:text-rose-400 font-extrabold'
              : 'text-slate-450 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          Estadísticas y Usuarios
          {activeFilter === 'stats' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 dark:bg-rose-400 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin mb-3"></div>
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 animate-pulse">Cargando consola...</p>
        </div>
      ) : activeFilter === 'stats' ? (
        /* ── STATISTICS AND USERS DASHBOARD VIEW ── */
        <div className="space-y-8 animate-fade-in">
          
          {/* KPI Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            
            {/* Card 1: Visitas */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider">Visitas de Sesión</span>
                <div className="bg-blue-500/10 p-2 rounded-xl text-blue-500"><Eye className="w-4.5 h-4.5" /></div>
              </div>
              <div className="text-2xl font-black font-display text-slate-850 dark:text-slate-100">{globalStats.visits}</div>
            </div>

            {/* Card 2: Registrados */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider">Docentes Registrados</span>
                <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-500"><Users className="w-4.5 h-4.5" /></div>
              </div>
              <div className="text-2xl font-black font-display text-slate-850 dark:text-slate-100">{users.length}</div>
            </div>

            {/* Card 3: Prueba Activa */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider">Prueba Activa</span>
                <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-500"><Coins className="w-4.5 h-4.5" /></div>
              </div>
              <div className="text-2xl font-black font-display text-slate-850 dark:text-slate-100">{activeTrialCount}</div>
            </div>

            {/* Card 4: Prueba Completada */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider">Pruebas Agotadas</span>
                <div className="bg-rose-500/10 p-2 rounded-xl text-rose-500"><AlertCircle className="w-4.5 h-4.5" /></div>
              </div>
              <div className="text-2xl font-black font-display text-slate-850 dark:text-slate-100">{completedTrialCount}</div>
            </div>

            {/* Card 5: Premium */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider">Usuarios PRO</span>
                <div className="bg-amber-500/10 p-2 rounded-xl text-amber-500"><Sparkles className="w-4.5 h-4.5" /></div>
              </div>
              <div className="text-2xl font-black font-display text-slate-850 dark:text-slate-100">{proCount}</div>
            </div>

          </div>

          {/* User list management section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            
            {/* Table Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">Lista de Docentes Registrados</h3>
                <p className="text-xs text-slate-450 dark:text-slate-500">Administra los accesos, saldo de tokens de prueba y membresías PRO.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-455" />
                  <input
                    type="text"
                    placeholder="Buscar por correo..."
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="w-full pl-9.5 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl text-xs outline-none text-slate-700 dark:text-slate-350"
                  />
                </div>
                
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl text-xs outline-none text-slate-650 dark:text-slate-350 focus:border-indigo-500"
                >
                  <option value="all">Todos los Roles</option>
                  <option value="pro">Miembros PRO</option>
                  <option value="free">Prueba Gratuita</option>
                  <option value="trial-empty">Prueba Agotada (0 tokens)</option>
                </select>
              </div>
            </div>

            {/* Table Grid list */}
            <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 text-slate-450 dark:text-slate-550 border-b border-slate-100 dark:border-slate-800/80 font-black uppercase text-[10px] tracking-wider">
                    <th className="p-4">Usuario (Correo)</th>
                    <th className="p-4">Registro</th>
                    <th className="p-4">Estatus</th>
                    <th className="p-4">Tokens Disponibles</th>
                    <th className="p-4">Descargas</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {filteredUsers.map(u => (
                    <tr key={u.uid} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="p-4 font-bold text-slate-750 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center text-[10px] font-black text-indigo-500">
                            {u.email.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="truncate max-w-[200px] sm:max-w-xs" title={u.email}>{u.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 font-medium">
                        {u.createdAt && u.createdAt !== 'N/A' ? new Date(u.createdAt).toLocaleDateString() : 'Simulado'}
                      </td>
                      <td className="p-4">
                        {u.isPremium ? (
                          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                            <Sparkles className="w-3 h-3" /> PRO Trimestral
                          </span>
                        ) : u.credits === 0 ? (
                          <span className="bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                            Prueba Agotada
                          </span>
                        ) : (
                          <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit">
                            En Prueba ({u.credits} free)
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-extrabold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Coins className="w-3.5 h-3.5 text-blue-500" />
                          <span>{u.credits}</span>
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-500 dark:text-slate-400">
                        <span>{u.downloadsLeft}</span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Decrement / Increment Credits */}
                          <button
                            onClick={() => handleModifyCredits(u.uid, u.credits, -1)}
                            disabled={actionLoadingId !== null}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-350 rounded-lg active:scale-90 transition disabled:opacity-50 cursor-pointer"
                            title="Quitar 1 Token"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleModifyCredits(u.uid, u.credits, 1)}
                            disabled={actionLoadingId !== null}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-650 dark:text-slate-355 rounded-lg active:scale-90 transition disabled:opacity-50 cursor-pointer"
                            title="Añadir 1 Token"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Promote/revoke PRO status */}
                          <button
                            onClick={() => handleToggleUserPremium(u.uid, u.isPremium)}
                            disabled={actionLoadingId !== null}
                            className={`ml-2 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase transition cursor-pointer active:scale-95 disabled:opacity-50 ${
                              u.isPremium 
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20' 
                                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm'
                            }`}
                          >
                            {u.isPremium ? 'Quitar PRO' : 'Hacer PRO'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-slate-400 italic">
                        No se encontraron docentes con los criterios de búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      ) : filteredPayments.length === 0 ? (
        /* Empty State */
        <div className="py-20 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
          <div className="bg-slate-100 dark:bg-slate-900 text-slate-400 p-4 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200">Todo al día</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {activeFilter === 'pending' 
                ? "No hay transferencias de Yappy/ACH pendientes de aprobación por el momento."
                : "No hay registros de transacciones para mostrar."
              }
            </p>
          </div>
        </div>
      ) : (
        /* Payments Grid List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPayments.map((payment) => (
            <div 
              key={payment.id} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between min-h-[300px]"
            >
              <div>
                {/* Header item */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Solicitud de Pago</span>
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200">
                      <Mail className="w-3.5 h-3.5 text-rose-500" />
                      <span className="truncate max-w-[200px]" title={payment.email}>{payment.email}</span>
                    </div>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>

                {/* Details grid list */}
                <div className="grid grid-cols-2 gap-4 mt-6 py-4 border-y border-slate-100 dark:border-slate-800/80 text-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Producto</span>
                    <div className="font-bold flex items-center gap-1 text-slate-700 dark:text-slate-355">
                      {payment.productType === 'subscription' ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Plan Trimestral Pro</span>
                        </>
                      ) : (
                        <>
                          <Coins className="w-3.5 h-3.5 text-blue-500" />
                          <span>{payment.tokenQuantity} Tokens</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Monto</span>
                    <div className="font-extrabold text-emerald-500 dark:text-emerald-400">${payment.amount.toFixed(2)} USD</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Referencia / ID</span>
                    <div className="font-mono font-bold text-slate-700 dark:text-slate-355">{payment.refId}</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Fecha Envío</span>
                    <div className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-450" />
                      <span>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action and preview triggers */}
              <div className="mt-6 flex items-center justify-between gap-3">
                {payment.screenshot ? (
                  <button 
                    onClick={() => setSelectedScreenshot(payment.screenshot)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Ver Comprobante</span>
                  </button>
                ) : (
                  <span className="text-[10px] text-slate-400 dark:text-slate-600 italic">Sin comprobante</span>
                )}

                {payment.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(payment.id, 'rejected', payment.uid, payment.productType, payment.tokenQuantity, payment.amount)}
                      disabled={actionLoadingId !== null}
                      className="px-3.5 py-2 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-95 transition text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {actionLoadingId === payment.id + '_rejected' ? (
                        <div className="w-3.5 h-3.5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <X className="w-3.5 h-3.5" />
                      )}
                      <span>Rechazar</span>
                    </button>
                    <button
                      onClick={() => handleAction(payment.id, 'approved', payment.uid, payment.productType, payment.tokenQuantity, payment.amount)}
                      disabled={actionLoadingId !== null}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-sm shadow-emerald-500/10 active:scale-95 transition text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      {actionLoadingId === payment.id + '_approved' ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      <span>Aprobar</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Screenshot Modal */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-auto rounded-3xl bg-slate-900 border border-slate-800 p-2 shadow-2xl flex items-center justify-center">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedScreenshot(null)}
              className="absolute top-4 right-4 bg-slate-950/80 text-white p-2.5 rounded-full border border-slate-850 hover:bg-slate-900 transition active:scale-95 z-20 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img 
              src={selectedScreenshot} 
              alt="Captura del Comprobante" 
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
