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
  Sparkles
} from 'lucide-react';
import { databaseService } from '../services/firebase';

export default function AdminPayments({ user, onTriggerAlert }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('pending'); // 'pending' | 'all'
  const [selectedScreenshot, setSelectedScreenshot] = useState(null); // Lightbox state

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await databaseService.getPendingPayments();
      setPayments(data);
    } catch (err) {
      console.error(err);
      onTriggerAlert("Error al cargar las solicitudes de pago.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
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
      await fetchPayments();
    } catch (err) {
      console.error(err);
      onTriggerAlert("Error al procesar la acción de pago.", "error");
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
            <h2 className="text-xl font-extrabold tracking-tight">Consola de Aprobación de Pagos</h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Revisa y gestiona las solicitudes de pago por transferencia (Yappy/ACH). Los montos aprobados acreditarán automáticamente tokens o el estatus PRO a los clientes.
          </p>
        </div>

        <button 
          onClick={fetchPayments}
          disabled={loading}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-650 dark:text-slate-350 shadow-sm active:scale-95 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Lista</span>
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
          Historial de Solicitudes
          {activeFilter === 'all' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 dark:bg-rose-400 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin mb-3"></div>
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 animate-pulse">Cargando pagos...</p>
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
                    <div className="font-bold flex items-center gap-1 text-slate-700 dark:text-slate-350">
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
                    <div className="font-mono font-bold text-slate-700 dark:text-slate-350">{payment.refId}</div>
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
