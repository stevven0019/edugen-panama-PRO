import React, { useEffect, useRef, useState } from 'react';
import { databaseService } from '../services/firebase';
import { newPendingPayments, paymentNoticeText } from '../services/paymentNotices';

export default function AdminPaymentNotices({ uid, onCount, onReview }) {
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState('');
  const [permission, setPermission] = useState(() => 'Notification' in window ? Notification.permission : 'unsupported');
  const reviewRef = useRef(onReview);
  useEffect(() => { reviewRef.current = onReview; }, [onReview]);
  useEffect(() => {
    const key = 'edugen_payment_notices_' + uid;
    let seen;
    try { seen = new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch { seen = new Set(); }
    let first = true;
    let timer;
    const unsubscribe = databaseService.subscribePayments(payments => {
      setError('');
      const pending = payments.filter(payment => payment.status === 'pending');
      onCount(pending.length);
      // Merge other tabs' acknowledgements before deciding whether to alert.
      try { for (const id of JSON.parse(localStorage.getItem(key) || '[]')) seen.add(id); } catch { /* storage may be disabled */ }
      const fresh = newPendingPayments(payments, seen);
      for (const payment of payments) seen.add(payment.id);
      try { localStorage.setItem(key, JSON.stringify([...seen].slice(-2000))); } catch { /* session deduplication still works */ }
      if (fresh.length) {
        const title = first ? 'Comprobantes pendientes' : 'Nuevo comprobante recibido';
        const body = paymentNoticeText(fresh);
        setNotice({ title, body });
        clearTimeout(timer);
        timer = setTimeout(() => setNotice(null), 12000);
        if (!first && document.visibilityState === 'hidden' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            const notification = new Notification(title, { body, tag: 'edugen-payment-' + fresh[0].id });
            notification.onclick = () => { window.focus(); reviewRef.current(); notification.close(); };
          } catch { /* the in-app toast and pending counter remain available */ }
        }
      }
      first = false;
    }, () => setError('No se pudieron actualizar los avisos de pagos. Revisa Administración o recarga la página.'));
    return () => { unsubscribe(); clearTimeout(timer); onCount(0); };
  }, [uid, onCount]);
  const enable = async () => {
    try { setPermission(await Notification.requestPermission()); } catch { setError('No se pudieron activar los avisos del navegador.'); }
  };
  return <div className="fixed bottom-5 right-5 z-[80] max-w-sm space-y-2 mx-4">
    {notice && <div role="status" aria-live="polite" className="rounded-2xl border border-rose-300 bg-white dark:bg-slate-900 p-4 shadow-xl text-slate-900 dark:text-white">
      <div className="flex justify-between gap-4"><strong>{notice.title}</strong><button aria-label="Cerrar aviso" onClick={() => setNotice(null)}>✕</button></div>
      <p className="text-sm my-2">{notice.body}</p>
      <button className="rounded-lg bg-rose-600 px-4 py-2 text-white" onClick={() => { onReview(); setNotice(null); }}>Revisar</button>
    </div>}
    {error && <p role="alert" className="rounded-xl bg-amber-100 text-amber-900 p-3 text-xs">{error}</p>}
    {permission === 'default' && <button onClick={enable} className="rounded-xl bg-slate-900 text-white p-3 text-xs shadow-lg">Activar avisos del navegador (con la app abierta)</button>}
  </div>;
}
