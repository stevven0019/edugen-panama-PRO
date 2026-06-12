import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Lock, 
  Check, 
  Sparkles, 
  Coins,
  Loader2,
  DollarSign,
  Smartphone,
  Upload,
  Send
} from 'lucide-react';
import { databaseService } from '../services/firebase';

export default function BillingModal({ isOpen, onClose, user, onTriggerAlert }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('subscription'); // 'subscription' | 'tokens'
  const [tokenQuantity, setTokenQuantity] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' | 'paypal' | 'yappy'
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Card Form States (Stripe)
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Yappy / ACH States
  const [yappyRef, setYappyRef] = useState('');
  const [yappyImage, setYappyImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      onTriggerAlert("La imagen es muy pesada. Por favor sube una captura menor a 800KB.", "error");
      return;
    }

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setYappyImage(reader.result);
      setUploadingImage(false);
    };
    reader.onerror = () => {
      onTriggerAlert("Error al leer la imagen. Intenta con otra captura.", "error");
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'stripe') {
      if (!cardName || cardNumber.length < 19 || cardExpiry.length < 5 || cardCvc.length < 3) {
        onTriggerAlert("Por favor, ingresa los datos de la tarjeta correctamente.", "error");
        return;
      }
    }

    if (paymentMethod === 'yappy') {
      if (!yappyRef || !yappyImage) {
        onTriggerAlert("Por favor, ingresa el número de referencia y sube la captura de pantalla del comprobante.", "error");
        return;
      }
    }

    setLoading(true);
    
    // Simulate payment gateway delay (Stripe/PayPal authentication)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      if (paymentMethod === 'yappy') {
        const amount = calculatePrice();
        await databaseService.submitPendingPayment(
          user.uid,
          user.email,
          activeTab,
          activeTab === 'subscription' ? 30 : tokenQuantity,
          parseFloat(amount),
          yappyRef,
          yappyImage
        );
        onTriggerAlert("¡Comprobante enviado con éxito! Un administrador validará tu pago pronto.", "success");
      } else {
        if (activeTab === 'subscription') {
          // Trimestral Pro Subscription
          await databaseService.togglePremium(user.uid, true);
          await databaseService.incrementCredits(user.uid, 30); // Add 30 standard credits
          onTriggerAlert("¡Pago procesado con éxito! Has sido actualizado a PRO PREMIUM.", "success");
        } else {
          // Buy individual tokens
          await databaseService.incrementCredits(user.uid, tokenQuantity);
          onTriggerAlert(`¡Pago procesado con éxito! Se añadieron ${tokenQuantity} tokens a tu saldo.`, "success");
        }
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
      onTriggerAlert("Hubo un error al procesar el pago. Intenta de nuevo.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccess(false);
    onClose();
  };

  const calculatePrice = () => {
    if (activeTab === 'subscription') {
      return "19.99"; // Promo price (Regular 24.99)
    }
    return (tokenQuantity * 0.99).toFixed(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2 rounded-full transition active:scale-95 z-20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {success ? (
          /* Payment Success State */
          <div className="p-8 text-center space-y-6 flex flex-col items-center">
            <div className="bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10 animate-bounce">
              <Check className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-850 dark:text-slate-100">
                {paymentMethod === 'yappy' ? '¡Comprobante Recibido!' : '¡Pago Aprobado!'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                {paymentMethod === 'yappy'
                  ? "Hemos recibido tu comprobante de Yappy/Transferencia. Un administrador validará la transacción y activará tus tokens/suscripción en los próximos minutos."
                  : (activeTab === 'subscription' 
                    ? "Tu cuenta ahora es PRO PREMIUM. Hemos eliminado los anuncios y acreditado 30 tokens en tu cuenta."
                    : `Se han acreditado ${tokenQuantity} tokens a tu balance para realizar planeaciones sin interrupciones.`
                  )
                }
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl w-full max-w-xs text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-slate-600 dark:text-slate-400">
                <span>Producto:</span>
                <span className="text-slate-800 dark:text-slate-200">
                  {activeTab === 'subscription' ? 'Plan Trimestral Pro' : `${tokenQuantity} Tokens`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-600 dark:text-slate-400">
                <span>Monto a pagar:</span>
                <span className="text-emerald-500 dark:text-emerald-400">${calculatePrice()} USD</span>
              </div>
              <div className="flex justify-between font-bold text-slate-600 dark:text-slate-400">
                <span>Método:</span>
                <span className="text-slate-800 dark:text-slate-200 capitalize">{paymentMethod === 'yappy' ? 'Yappy / ACH' : paymentMethod}</span>
              </div>
            </div>

            <button 
              onClick={handleSuccessClose}
              className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/15 active:scale-98 transition text-xs cursor-pointer"
            >
              Listo, Empezar a Planificar
            </button>
          </div>
        ) : (
          /* Checkout/Selection State */
          <div>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                <h2 className="text-xl font-extrabold tracking-tight">Mejora tu Cuenta a EduGen PRO</h2>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Elimina anuncios, prioriza la generación en servidores y obtén planeaciones didácticas en segundos.
              </p>
            </div>

            {/* Selector Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/25">
              <button 
                onClick={() => setActiveTab('subscription')}
                className={`flex-1 py-4 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'subscription' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-extrabold' 
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Plan Trimestral Pro
              </button>
              <button 
                onClick={() => setActiveTab('tokens')}
                className={`flex-1 py-4 text-xs font-bold transition flex items-center justify-center gap-2 border-b-2 ${
                  activeTab === 'tokens' 
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-extrabold' 
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                }`}
              >
                <Coins className="w-4 h-4 text-blue-500" />
                Compra de Tokens
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Active Tab Panel details */}
              {activeTab === 'subscription' ? (
                /* Plan Details Card */
                <div className="bg-gradient-to-br from-amber-500/5 to-yellow-500/5 border border-amber-500/20 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                  <span className="absolute top-3 right-3 bg-amber-500 text-white font-black text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-md animate-pulse">
                    Oferta 20% Off
                  </span>
                  
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-200">
                        Suscripción PRO Trimestral
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Renovación trimestral automática, cancela cuando quieras.</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 dark:text-slate-500 line-through font-semibold">$24.99</span>
                      <div className="text-xl font-black text-amber-500 dark:text-amber-400 flex items-center gap-0.5">
                        <span>$19.99</span>
                        <span className="text-[10px] text-slate-400 font-medium">/trim.</span>
                      </div>
                    </div>
                  </div>

                  <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 border-t border-slate-200 dark:border-slate-800 pt-3">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span><strong>Cero anuncios</strong> en toda la interfaz de usuario.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span><strong>30 Tokens PRO</strong> incluidos para planificaciones.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>Prioridad máxima en servidores de IA.</span>
                    </li>
                  </ul>
                </div>
              ) : (
                /* Buy Tokens Option */
                <div className="bg-blue-500/5 border border-blue-500/15 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-200">
                        Compra Flexible de Tokens
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Cada planeación consume exactamente 1 token.</p>
                    </div>
                    <div className="text-xl font-black text-blue-500 dark:text-blue-400">
                      $0.99 <span className="text-[10px] text-slate-400 font-medium">/token</span>
                    </div>
                  </div>

                  {/* Quantity selector input */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span>Cantidad de tokens:</span>
                      <span className="text-blue-500">{tokenQuantity} Tokens</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="50" 
                      step="5"
                      value={tokenQuantity}
                      onChange={(e) => setTokenQuantity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                      <span>Min: 5</span>
                      <span>Max: 50</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Gateways */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  Método de Pago Seguro
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-3.5 border rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition ${
                      paymentMethod === 'stripe'
                        ? 'border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Tarjeta / Stripe
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3.5 border rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition ${
                      paymentMethod === 'paypal'
                        ? 'border-amber-500 bg-amber-500/5 text-amber-600 dark:text-amber-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    PayPal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('yappy')}
                    className={`p-3.5 border rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition ${
                      paymentMethod === 'yappy'
                        ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    Yappy / ACH
                  </button>
                </div>
              </div>

              {/* Form inputs depending on method */}
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                {paymentMethod === 'stripe' && (
                  /* Stripe Inputs Form */
                  <div className="space-y-3 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Nombre en la Tarjeta</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. Juan Pérez"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none text-slate-700 dark:text-slate-350 focus:ring-1 focus:ring-blue-500/40"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Número de Tarjeta</label>
                      <input 
                        type="text" 
                        required
                        placeholder="1234 5678 1234 5678"
                        maxLength="19"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none text-slate-700 dark:text-slate-350 focus:ring-1 focus:ring-blue-500/40"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Fecha Exp.</label>
                        <input 
                          type="text" 
                          required
                          placeholder="MM/AA"
                          maxLength="5"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none text-slate-700 dark:text-slate-350 focus:ring-1 focus:ring-blue-500/40"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">CVC</label>
                        <input 
                          type="password" 
                          required
                          placeholder="123"
                          maxLength="3"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, ''))}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none text-slate-700 dark:text-slate-350 focus:ring-1 focus:ring-blue-500/40"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'paypal' && (
                  /* PayPal Fast Button */
                  <div className="p-4 border border-dashed border-amber-300 dark:border-amber-800 rounded-2xl bg-amber-500/5 text-center space-y-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                      Paga de forma rápida y segura vinculando tu saldo de PayPal o cuentas bancarias asociadas.
                    </p>
                  </div>
                )}

                {paymentMethod === 'yappy' && (
                  /* Yappy / ACH bank details & file upload */
                  <div className="space-y-4 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20">
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-xl space-y-3">
                      <h5 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Datos de Transferencia
                      </h5>
                      <div className="text-[11px] text-slate-650 dark:text-slate-350 space-y-1">
                        <p><strong>Banco:</strong> Banco General (Ahorros)</p>
                        <p><strong>Número de Cuenta:</strong> 03-72-01-123456-7</p>
                        <p><strong>Nombre del Beneficiario:</strong> EduGen Panamá</p>
                        <p><strong>Yappy:</strong> (+507) 6000-0000 (A nombre de EduGen)</p>
                        <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
                          *Puedes editar estos datos directamente en BillingModal.jsx
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                        Número de Referencia de Transacción
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. 12345678"
                        value={yappyRef}
                        onChange={(e) => setYappyRef(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs outline-none text-slate-700 dark:text-slate-350 focus:ring-1 focus:ring-blue-500/40"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase block">
                        Cargar Captura del Comprobante (Máx. 800KB)
                      </label>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-850 transition cursor-pointer text-xs font-bold text-slate-600 dark:text-slate-300 select-none">
                          <Upload className="w-4 h-4" />
                          {yappyImage ? 'Cambiar captura' : 'Subir archivo'}
                          <input 
                            type="file" 
                            required
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                        {uploadingImage && (
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        )}
                        {yappyImage && (
                          <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> ¡Cargado!
                          </span>
                        )}
                      </div>
                      {yappyImage && (
                        <div className="mt-2 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden max-h-24 max-w-full flex items-center justify-center bg-slate-100 dark:bg-slate-950">
                          <img src={yappyImage} alt="Comprobante cargado" className="max-h-full max-w-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit button details */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className={`w-full text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-xs cursor-pointer ${
                      paymentMethod === 'stripe'
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/10'
                        : paymentMethod === 'yappy'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/10'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black shadow-yellow-500/10 border border-yellow-600/10'
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Procesando solicitud...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {paymentMethod === 'stripe' ? 'Pagar Seguro con Stripe' : paymentMethod === 'yappy' ? 'Enviar Comprobante de Pago' : 'Pagar Rápido con PayPal'} 
                          &nbsp;(${calculatePrice()} USD)
                        </span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                    <Lock className="w-3 h-3 text-slate-450" />
                    <span>Conexión cifrada SSL de 256 bits</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
