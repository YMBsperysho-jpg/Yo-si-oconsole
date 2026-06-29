/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { PaymentConfig, LicenseKey } from '../types';
import { DollarSign, Key, Users, Check, Plus } from 'lucide-react';

export default function AdminPanel() {
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    payoutMethod: 'whatsapp',
    payoutDetails: '',
    customMessage: ''
  });

  const [stats, setStats] = useState({
    totalLicenses: 0,
    totalSalesCount: 0,
    totalSalesAmount: 0,
    licenses: [] as LicenseKey[],
    sales: [] as any[]
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form for manual key generation
  const [manualTier, setManualTier] = useState<'trial' | 'monthly' | '3month'>('trial');
  const [manualEmail, setManualEmail] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const fetchStatsAndConfig = async () => {
    try {
      const [statsRes, configRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/payment/config')
      ]);

      if (statsRes.ok && configRes.ok) {
        const statsData = await statsRes.json();
        const configData = await configRes.json();
        setStats(statsData);
        setPaymentConfig(configData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  useEffect(() => {
    fetchStatsAndConfig();
  }, []);

  const handleSaveConfig = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/payment/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentConfig)
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error saving payment config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateKey = async (e: FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim()) return;

    try {
      const response = await fetch('/api/license/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: manualTier, email: manualEmail })
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedKey(data.license.key);
        setManualEmail('');
        fetchStatsAndConfig(); // Refresh statistics
      }
    } catch (error) {
      console.error('Error generating manual key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6" id="admin-panel-container">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff3e3e]">Total Recaudado (Simulado)</span>
            <h3 className="text-3xl font-black text-white mt-1">${stats.totalSalesAmount} USD</h3>
            <span className="text-[10px] text-zinc-400">Suscripciones pagadas por usuarios</span>
          </div>
          <div className="p-3 bg-[#ff3e3e]/15 border border-[#ff3e3e]/30 rounded-xl text-[#ff3e3e]">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Licencias Generadas</span>
            <h3 className="text-3xl font-black text-white mt-1">{stats.totalLicenses}</h3>
            <span className="text-[10px] text-zinc-500">Claves activas en el sistema</span>
          </div>
          <div className="p-3 bg-black border border-zinc-850 rounded-xl text-zinc-400">
            <Key className="w-8 h-8" />
          </div>
        </div>

        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Ventas Registradas</span>
            <h3 className="text-3xl font-black text-white mt-1">{stats.totalSalesCount}</h3>
            <span className="text-[10px] text-zinc-500">Transacciones exitosas</span>
          </div>
          <div className="p-3 bg-black border border-zinc-850 rounded-xl text-zinc-400">
            <Users className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Payment link manager */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <form onSubmit={handleSaveConfig} className="bg-[#111] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 h-full shadow-md">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">Configuración de Métodos de Pago</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Establece cómo quieres recibir el dinero real de tus clientes ($79, $169, $299).</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Vía para Recibir Dinero</label>
                <select
                  id="payout-method-select"
                  value={paymentConfig.payoutMethod}
                  onChange={(e) => setPaymentConfig(prev => ({ ...prev, payoutMethod: e.target.value as any }))}
                  className="w-full bg-black border border-zinc-850 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#ff3e3e]"
                >
                  <option value="whatsapp">Enlace Directo de WhatsApp (Recomendado para ventas personalizadas)</option>
                  <option value="stripe_link">Stripe Payment Link (Para tarjetas de crédito automáticas)</option>
                  <option value="paypal">Correo de PayPal (Solicitud manual)</option>
                  <option value="crypto">Billetera de Criptomonedas (USDT / BTC / LTC)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Detalles de Cobro / Dirección o Teléfono</label>
                <input
                  type="text"
                  id="payout-details-input"
                  value={paymentConfig.payoutDetails}
                  onChange={(e) => setPaymentConfig(prev => ({ ...prev, payoutDetails: e.target.value }))}
                  placeholder={
                    paymentConfig.payoutMethod === 'whatsapp' ? '+5215512345678 (Con código de país)' :
                    paymentConfig.payoutMethod === 'stripe_link' ? 'https://buy.stripe.com/...' :
                    paymentConfig.payoutMethod === 'paypal' ? 'tu_correo@paypal.com' : 'Dirección USDT TRC20...'
                  }
                  className="w-full bg-black border border-zinc-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#ff3e3e] placeholder-zinc-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Mensaje del Comprador (Para WhatsApp/PayPal)</label>
                <textarea
                  id="payout-custom-message"
                  rows={3}
                  value={paymentConfig.customMessage}
                  onChange={(e) => setPaymentConfig(prev => ({ ...prev, customMessage: e.target.value }))}
                  placeholder="Mensaje predeterminado que enviará el cliente..."
                  className="w-full bg-black border border-zinc-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#ff3e3e] placeholder-zinc-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="mt-auto py-3 bg-[#ff3e3e] hover:bg-[#e03535] disabled:bg-black text-white font-black rounded-xl text-xs transition uppercase tracking-wider cursor-pointer"
            >
              {isSaving ? 'Guardando...' : saveSuccess ? '¡Configuración Guardada!' : 'Actualizar Métodos de Cobro'}
            </button>
          </form>
        </div>

        {/* Manual License Generator */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-[#111] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 h-full shadow-md">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="font-bold text-white text-base">Generador Manual de Licencias</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Usa esto si tu cliente te pagó en efectivo o por fuera y quieres generarle una clave válida.</p>
            </div>

            <form onSubmit={handleGenerateKey} className="space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Duración / Licencia</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { tier: 'trial', label: '14 Días ($79)' },
                      { tier: 'monthly', label: '1 Mes ($169)' },
                      { tier: '3month', label: '3 Meses ($299)' }
                    ].map(opt => (
                      <button
                        key={opt.tier}
                        type="button"
                        id={`btn-manual-${opt.tier}`}
                        onClick={() => setManualTier(opt.tier as any)}
                        className={`py-2 px-1 text-[10px] rounded-lg font-black border transition text-center cursor-pointer ${
                          manualTier === opt.tier
                            ? 'bg-[#ff3e3e]/15 text-[#ff3e3e] border-[#ff3e3e]/30'
                            : 'bg-black text-zinc-400 border-zinc-850 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Correo del Comprador</label>
                  <input
                    type="email"
                    id="manual-key-email"
                    required
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="cliente@correo.com"
                    className="w-full bg-black border border-zinc-850 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-[#ff3e3e] placeholder-zinc-700"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-[#ff3e3e] text-white font-black rounded-xl text-xs transition uppercase tracking-wider flex items-center justify-center gap-1.5 mt-4 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#ff3e3e]" />
                Generar Clave de Activación
              </button>
            </form>

            {generatedKey && (
              <div className="bg-black border border-zinc-850 rounded-2xl p-4 mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-[#ff3e3e]">CLAVE GENERADA CON ÉXITO</span>
                  <span className="text-[10px] text-zinc-500">Copiar y enviar al cliente</span>
                </div>
                <div className="flex justify-between items-center bg-[#111] border border-zinc-800 rounded-xl p-2.5 font-mono text-xs text-[#ff3e3e] font-bold">
                  <span>{generatedKey}</span>
                  <button
                    id="copy-manual-key-btn"
                    onClick={() => copyToClipboard(generatedKey)}
                    className="p-1 px-2.5 bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-[#ff3e3e] rounded-lg transition text-zinc-400 hover:text-white text-[10px]"
                  >
                    {copiedKey === generatedKey ? <Check className="w-3.5 h-3.5 text-green-400" /> : 'Copiar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active licenses history list */}
      <div className="bg-[#111] border border-zinc-800 rounded-2xl p-5 shadow-md">
        <h3 className="font-bold text-white text-base mb-4">Registro de Claves y Transacciones</h3>
        <div className="overflow-x-auto max-h-[250px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400 font-bold bg-black">
                <th className="p-3">Clave de Licencia</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Comprador</th>
                <th className="p-3">Creado el</th>
                <th className="p-3">Expira el</th>
                <th className="p-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {stats.licenses.map((lic, idx) => (
                <tr key={idx} className="hover:bg-zinc-900/30">
                  <td className="p-3 font-mono text-[#ff3e3e] font-bold">{lic.key}</td>
                  <td className="p-3 uppercase font-bold text-[10px]">
                    <span className={`px-2 py-0.5 rounded-full border ${
                      lic.tier === 'trial' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      lic.tier === 'monthly' ? 'bg-rose-500/10 text-[#ff3e3e] border border-[#ff3e3e]/20' :
                      'bg-[#ff3e3e]/15 text-[#ff3e3e] border border-[#ff3e3e]/30'
                    }`}>
                      {lic.tier === 'trial' ? '14 Días' : lic.tier === 'monthly' ? '1 Mes' : '3 Meses'}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-300">{lic.buyerEmail}</td>
                  <td className="p-3 text-zinc-400">{new Date(lic.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 text-zinc-400">{new Date(lic.expiresAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded">Activa</span>
                  </td>
                </tr>
              ))}
              {stats.licenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-zinc-500">Ninguna licencia creada aún.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
