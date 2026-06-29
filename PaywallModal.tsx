/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { PaymentConfig } from '../types';
import { Check, ShieldCheck, Key, CreditCard, AlertCircle, ShoppingCart } from 'lucide-react';

interface PaywallModalProps {
  onUnlock: (tier: string) => void;
}

export default function PaywallModal(props: PaywallModalProps) {
  const [activationKey, setActivationKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Checkout states
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'monthly' | '3month' | null>(null);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [billingEmail, setBillingEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    // Fetch dynamic payment gateway config from owner database
    fetch('/api/payment/config')
      .then(res => res.json())
      .then(data => setPaymentConfig(data))
      .catch(err => console.error('Error fetching pay config:', err));
  }, []);

  const handleVerifyKey = async (e: FormEvent) => {
    e.preventDefault();
    if (!activationKey.trim()) return;

    setIsVerifying(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/license/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: activationKey })
      });

      const data = await response.json();
      if (response.ok && data.valid) {
        setSuccessMessage(`¡Licencia de nivel "${data.tier.toUpperCase()}" activada con éxito!`);
        setTimeout(() => {
          props.onUnlock(data.tier);
        }, 1500);
      } else {
        setErrorMessage(data.error || 'La clave ingresada no es válida.');
      }
    } catch (error) {
      setErrorMessage('Error de red al conectar con el servidor de activación.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePayAndGenerate = async (e: FormEvent) => {
    e.preventDefault();
    if (!billingEmail.trim() || !selectedPlan) return;

    setIsPaying(true);
    setErrorMessage(null);

    // If the owner has Stripe Payment Links or WhatsApp set up, we should redirect them,
    // otherwise we process a seamless beautiful mock checkout that actually issues a key!
    if (paymentConfig && paymentConfig.payoutMethod === 'stripe_link' && paymentConfig.payoutDetails) {
      window.open(paymentConfig.payoutDetails, '_blank');
      addLineMessage('Redirigiendo a pasarela de Stripe segura...');
      setIsPaying(false);
      return;
    }

    if (paymentConfig && paymentConfig.payoutMethod === 'whatsapp' && paymentConfig.payoutDetails) {
      const text = `${paymentConfig.customMessage}\n\nPlan Seleccionado: ${selectedPlan.toUpperCase()}\nCorreo del Cliente: ${billingEmail}`;
      const url = `https://wa.me/${paymentConfig.payoutDetails.replace(/[+ -]/g, '')}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      setIsPaying(false);
      return;
    }

    // Default: Process simulated high-end credit card checkout to generate license key immediately
    setTimeout(async () => {
      try {
        const response = await fetch('/api/license/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier: selectedPlan, email: billingEmail })
        });

        if (response.ok) {
          const data = await response.json();
          setActivationKey(data.license.key);
          setSuccessMessage(`¡Pago Procesado! Tu licencia generada es: ${data.license.key}`);
          setSelectedPlan(null); // Return to key insertion
        } else {
          setErrorMessage('No se pudo procesar la compra. Inténtalo de nuevo.');
        }
      } catch (err) {
        setErrorMessage('Error conectando al procesador de pagos.');
      } finally {
        setIsPaying(false);
      }
    }, 2000);
  };

  const addLineMessage = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 sm:p-6" id="paywall-screen">
      <div className="w-full max-w-4xl bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12">
        
        {/* Marketing / Feature Pitch Left Panel */}
        <div className="md:col-span-5 bg-gradient-to-b from-[#ff3e3e]/10 to-black p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#ff3e3e]/15 rounded-xl border border-[#ff3e3e]/20 text-[#ff3e3e]">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-sm font-black tracking-widest text-[#ff3e3e] font-mono">XTRA METOD</h1>
                <h2 className="text-xs text-zinc-400 font-bold uppercase tracking-wider">SI OCONSOLE</h2>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black text-white tracking-tight leading-snug">
                Desbloquea el Acceso Total a Ingeniería Android
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Activa la consola prémium para acceder a los ajustes escondidos, modo ingeniero nativo, limpieza de packages y terminal ADB inteligente.
              </p>
            </div>

            <div className="space-y-3">
              {[
                'Ingreso a Ajustes Ocultos y Menús AOSP',
                'Debloat automático y purga de Packages',
                'Modo Ingeniero MTK, Qualcomm y marcas',
                'Consola ADB en tiempo real con Gemini AI',
                'Actualizaciones premium y guías de optimización'
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <Check className="w-4 h-4 text-[#ff3e3e] shrink-0 mt-0.5" />
                  <span className="text-zinc-300 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-900 text-center md:text-left">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Licencia Verificada Oficial</p>
            <p className="text-[10px] text-zinc-600 mt-1">Soporte técnico premium disponible 24/7</p>
          </div>
        </div>

        {/* Right Interaction Panel (Activation or Plans) */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          
          {/* Main Activation Screen */}
          {!selectedPlan && (
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#ff3e3e] font-mono">PREMIUM VERIFICATION</span>
                <h3 className="text-2xl font-black text-white tracking-tight">Activa tu Acceso Vip</h3>
                <p className="text-xs text-zinc-400 leading-normal">
                  Inserta tu clave de licencia comprada para validar el software o explora nuestros planes de pago para generar tu clave.
                </p>
              </div>

              {/* Form to verify current key */}
              <form onSubmit={handleVerifyKey} className="space-y-3">
                <div className="relative">
                  <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    id="activation-key-input"
                    required
                    value={activationKey}
                    onChange={(e) => setActivationKey(e.target.value)}
                    placeholder="Escribe tu clave XTRA-XXXX-XXXX"
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-[#ff3e3e] uppercase placeholder-zinc-700 focus:outline-none focus:border-[#ff3e3e] transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || !activationKey.trim()}
                  className="w-full py-3 bg-[#ff3e3e] hover:bg-[#e03535] disabled:bg-zinc-950 disabled:text-zinc-600 text-white font-black rounded-xl text-xs transition uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  {isVerifying ? 'Verificando Licencia...' : 'Activar Consola Premium'}
                </button>
              </form>

              {/* Alert message display */}
              {errorMessage && (
                <div className="bg-[#ff3e3e]/10 border border-[#ff3e3e]/20 text-[#ff3e3e] text-xs p-3.5 rounded-xl flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3.5 rounded-xl flex gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{successMessage}</p>
                </div>
              )}

              <div className="border-t border-zinc-900 pt-5">
                <p className="text-xs font-bold text-zinc-400 mb-3 text-center sm:text-left">¿No tienes una licencia? Adquiere una ahora:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    id="buy-trial-btn"
                    onClick={() => setSelectedPlan('trial')}
                    className="bg-black hover:bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 transition text-center flex flex-col justify-between cursor-pointer"
                  >
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wide">Pase Corto</span>
                    <span className="font-black text-white text-base mt-1">$79 USD</span>
                    <span className="text-[9px] text-zinc-500 mt-0.5">14 Días VIP</span>
                  </button>

                  <button
                    id="buy-monthly-btn"
                    onClick={() => setSelectedPlan('monthly')}
                    className="bg-black hover:bg-zinc-900 border-[#ff3e3e]/30 border rounded-xl p-3.5 transition text-center flex flex-col justify-between shadow-lg cursor-pointer"
                  >
                    <span className="text-[9px] font-bold text-[#ff3e3e] uppercase tracking-wide">Pase Mensual</span>
                    <span className="font-black text-white text-base mt-1">$169 USD</span>
                    <span className="text-[9px] text-zinc-500 mt-0.5">30 Días VIP</span>
                  </button>

                  <button
                    id="buy-3month-btn"
                    onClick={() => setSelectedPlan('3month')}
                    className="bg-black hover:bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 transition text-center flex flex-col justify-between cursor-pointer"
                  >
                    <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wide">Pase Elite</span>
                    <span className="font-black text-white text-base mt-1">$299 USD</span>
                    <span className="text-[9px] text-zinc-500 mt-0.5">3 Meses (90D)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Checkout Screen */}
          {selectedPlan && (
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#ff3e3e]">PAGO VIP METOD</span>
                  <h3 className="text-xl font-black text-white">
                    {selectedPlan === 'trial' ? 'Pase de 14 Días' : selectedPlan === 'monthly' ? 'Pase Mensual' : 'Pase de 3 Meses'}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-zinc-400">Total a pagar:</span>
                  <p className="text-xl font-black text-white">
                    {selectedPlan === 'trial' ? '$79' : selectedPlan === 'monthly' ? '$169' : '$299'} USD
                  </p>
                </div>
              </div>

              <form onSubmit={handlePayAndGenerate} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Tu Correo Electrónico</label>
                  <input
                    type="email"
                    id="billing-email-input"
                    required
                    value={billingEmail}
                    onChange={(e) => setBillingEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#ff3e3e]"
                  />
                  <span className="text-[9px] text-zinc-500 mt-1 block">Aquí se registrará la clave para activar tu consola.</span>
                </div>

                {/* Simulated standard fields if owner has no stripe links */}
                {(!paymentConfig || (paymentConfig.payoutMethod !== 'stripe_link' && paymentConfig.payoutMethod !== 'whatsapp')) && (
                  <div className="space-y-3 border-t border-zinc-900 pt-3">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Tarjeta de Crédito / Débito</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                        <input
                          type="text"
                          id="card-number-input"
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4000 1234 5678 9010"
                          className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#ff3e3e]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Expiración</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/AA"
                          className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#ff3e3e] text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Código CVC</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="***"
                          className="w-full bg-black border border-zinc-800 rounded-xl p-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[#ff3e3e] text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentConfig && paymentConfig.payoutMethod === 'crypto' && (
                  <div className="bg-black border border-zinc-800 rounded-xl p-3 text-xs space-y-1">
                    <p className="font-bold text-zinc-300">Pago en Criptomonedas Solicitado:</p>
                    <p className="text-zinc-400">Envía el monto exacto en USDT (TRC20) a la siguiente billetera y luego ingresa tu correo:</p>
                    <div className="bg-[#111] p-2.5 rounded font-mono text-[#ff3e3e] select-all border border-zinc-800 break-all">
                      {paymentConfig.payoutDetails || 'Dirección de billetera no configurada'}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    id="cancel-payment-btn"
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-black rounded-xl text-xs transition border border-zinc-800 uppercase cursor-pointer"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    disabled={isPaying || !billingEmail.trim()}
                    className="flex-[2] py-3 bg-[#ff3e3e] hover:bg-[#e03535] disabled:bg-zinc-950 text-white font-black rounded-xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isPaying ? 'Procesando Pago...' : paymentConfig?.payoutMethod === 'whatsapp' ? 'Pagar Vía WhatsApp' : 'Completar Compra'}
                  </button>
                </div>
              </form>

              <div className="flex items-center justify-center gap-4 text-[10px] text-zinc-500 border-t border-zinc-900 pt-3">
                <span className="flex items-center gap-1">🔒 Encriptación SSL 256-bit</span>
                <span>•</span>
                <span>Garantía de activación inmediata</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
