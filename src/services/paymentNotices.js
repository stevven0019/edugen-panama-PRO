export function newPendingPayments(payments, seen) {
  return payments.filter(payment => payment.status === 'pending' && !seen.has(payment.id));
}
export function paymentNoticeText(payments) {
  if (payments.length !== 1) return payments.length + ' comprobantes pendientes de revisión.';
  const payment = payments[0];
  const amount = Number(payment.amount);
  return (payment.email || 'Un usuario') + (Number.isFinite(amount) ? ' · $' + amount.toFixed(2) : '') + ' · Pendiente de revisión';
}
