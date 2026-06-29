/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SECRET_CODES } from '../data';
import { Phone, Copy, Check, ShieldAlert, Radio, Volume2, Battery, AlertTriangle } from 'lucide-react';

export default function EngineerMode() {
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeGuide, setActiveGuide] = useState<'bands' | 'audio' | 'battery'>('bands');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredCodes = selectedBrand === 'all'
    ? SECRET_CODES
    : SECRET_CODES.filter(c => c.brand === selectedBrand);

  const getBrandBadgeColor = (brand: string) => {
    switch (brand) {
      case 'samsung': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'xiaomi': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'mediatek': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'qualcomm': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'motorola': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      default: return 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="engineer-mode-container">
      {/* Secret Codes Directory */}
      <div className="xl:col-span-7 flex flex-col gap-4">
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-white text-base">Códigos de Diagnóstico y Modo Ingeniero</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Escribe estos códigos directamente en la aplicación de llamadas (Teléfono) de tu celular.</p>
            </div>
            <select
              id="eng-brand-filter"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-black border border-zinc-850 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-[#ff3e3e] transition cursor-pointer font-bold"
            >
              <option value="all">Filtro de Fabricantes</option>
              <option value="universal">Universal / Android</option>
              <option value="mediatek">MediaTek (MTK)</option>
              <option value="qualcomm">Snapdragon (Qualcomm)</option>
              <option value="samsung">Samsung</option>
              <option value="xiaomi">Xiaomi</option>
              <option value="motorola">Motorola</option>
            </select>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            {filteredCodes.map(item => (
              <div key={item.id} className="bg-black border border-zinc-855 hover:border-zinc-800 rounded-2xl p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${getBrandBadgeColor(item.brand)}`}>
                      {item.brand === 'universal' ? 'Universal' : item.brand}
                    </span>
                    <span className="text-xs font-bold text-zinc-200 truncate">{item.functionName}</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="shrink-0 flex items-center bg-[#111] border border-zinc-800 rounded-xl p-2 justify-between gap-3">
                  <span className="font-mono font-black text-sm text-[#ff3e3e] px-2 select-all">{item.code}</span>
                  <button
                    id={`copy-code-${item.id}`}
                    onClick={() => copyToClipboard(item.code, item.id)}
                    className="p-1.5 bg-black hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-[#ff3e3e] rounded-lg transition"
                    title="Copiar código"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action / Step-by-Step Calibration Guides */}
      <div className="xl:col-span-5 flex flex-col gap-4">
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-6 flex flex-col h-full gap-5">
          <div className="border-b border-zinc-800 pb-4">
            <h3 className="font-bold text-white text-base">Manuales de Configuración Avanzada</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Sigue estas guías paso a paso para optimizar hardware desde el Modo Ingeniero.</p>
          </div>

          {/* Guide Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-black border border-zinc-850 p-1.5 rounded-xl">
            <button
              id="guide-bands-btn"
              onClick={() => setActiveGuide('bands')}
              className={`py-2 text-[10px] sm:text-xs rounded-lg font-black transition flex flex-col items-center gap-1.5 ${
                activeGuide === 'bands' ? 'bg-[#ff3e3e]/15 text-[#ff3e3e] border border-[#ff3e3e]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              Bloquear Red
            </button>
            <button
              id="guide-audio-btn"
              onClick={() => setActiveGuide('audio')}
              className={`py-2 text-[10px] sm:text-xs rounded-lg font-black transition flex flex-col items-center gap-1.5 ${
                activeGuide === 'audio' ? 'bg-[#ff3e3e]/15 text-[#ff3e3e] border border-[#ff3e3e]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              Subir Volumen
            </button>
            <button
              id="guide-battery-btn"
              onClick={() => setActiveGuide('battery')}
              className={`py-2 text-[10px] sm:text-xs rounded-lg font-black transition flex flex-col items-center gap-1.5 ${
                activeGuide === 'battery' ? 'bg-[#ff3e3e]/15 text-[#ff3e3e] border border-[#ff3e3e]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Battery className="w-3.5 h-3.5" />
              Calibrar Batería
            </button>
          </div>

          {/* Guide Content Display */}
          <div className="flex-1 overflow-y-auto max-h-[350px] custom-scrollbar space-y-4">
            {activeGuide === 'bands' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-2 text-[#ff3e3e] font-black text-sm">
                  <Radio className="w-4 h-4" />
                  <h4>Fijar LTE Only / Forzar Banda de Red</h4>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Evita que tu teléfono caiga a 3G o 2G en zonas de baja cobertura, manteniendo la conexión de datos activa siempre en 4G.
                </p>
                <div className="bg-black p-4 rounded-xl border border-zinc-850 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <p className="text-zinc-300 leading-normal">
                      Digita el código <span className="font-mono text-[#ff3e3e] font-bold">*#*#4636#*#*</span> en tu marcador de teléfono para entrar a <b>Testing (Pruebas)</b>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <p className="text-zinc-300 leading-normal">
                      Entra a la opción <b>Información sobre el teléfono (Phone Information)</b>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <p className="text-zinc-300 leading-normal">
                      Ubica el menú desplegable llamado <b>Establecer tipo de red preferido (Set Preferred Network Type)</b>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">4</span>
                    <p className="text-zinc-300 leading-normal">
                      Selecciona <span className="text-[#ff3e3e] font-black">LTE Only</span>. Si tu teléfono soporta VoLTE, seguirás recibiendo llamadas sin perder conexión 4G.
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 flex gap-2 text-amber-400 leading-relaxed">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-[10px]">
                    <b>Alerta:</b> Si tu operador no soporta VoLTE (Llamadas sobre 4G), al forzar LTE Only podrías no recibir llamadas convencionales de voz. Si ocurre, vuelve a configurar en <i>LTE/UMTS Auto (PRL)</i>.
                  </p>
                </div>
              </div>
            )}

            {activeGuide === 'audio' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-2 text-[#ff3e3e] font-black text-sm">
                  <Volume2 className="w-4 h-4" />
                  <h4>Modificar Volumen Máximo de Auricular (MTK)</h4>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Aumenta los límites preestablecidos de potencia en chipsets MediaTek para que el altavoz u audífonos suenen significativamente más fuerte.
                </p>
                <div className="bg-black p-4 rounded-xl border border-zinc-850 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <p className="text-zinc-300 leading-normal">
                      Entra al menú con el código <span className="font-mono text-[#ff3e3e] font-bold">*#*#3646633#*#*</span>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <p className="text-zinc-300 leading-normal">
                      Desliza horizontalmente hasta la pestaña de <b>Hardware Testing</b> y selecciona <b>Audio</b>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <p className="text-zinc-300 leading-normal">
                      Entra en <b>Volume</b> y luego en <b>Audio Playback</b>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">4</span>
                    <p className="text-zinc-300 leading-normal">
                      Cambia el valor de <b>Max Vol (0-160)</b> de 128 o 140 por defecto a un valor de <span className="text-[#ff3e3e] font-black">155</span>. Luego pulsa "Set".
                    </p>
                  </div>
                </div>
                <div className="p-3 bg-[#ff3e3e]/10 rounded-xl border border-[#ff3e3e]/20 flex gap-2 text-[#ff3e3e] leading-relaxed">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="text-[10px]">
                    <b>Atención:</b> No pongas un valor superior a 155 o saturarás la bocina de tu teléfono, lo que podría provocar distorsión o daño físico al altavoz a largo plazo.
                  </p>
                </div>
              </div>
            )}

            {activeGuide === 'battery' && (
              <div className="space-y-3.5 text-xs">
                <div className="flex items-center gap-2 text-[#ff3e3e] font-black text-sm">
                  <Battery className="w-4 h-4" />
                  <h4>Calibración Física de Batería (Quick Start)</h4>
                </div>
                <p className="text-zinc-400 leading-relaxed">
                  Borra el archivo histórico de estadísticas de batería corrupto que causa caídas repentinas de porcentaje (ej. de 20% a 5% en un minuto).
                </p>
                <div className="bg-black p-4 rounded-xl border border-zinc-850 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">1</span>
                    <p className="text-zinc-300 leading-normal">
                      Carga tu teléfono hasta que llegue exactamente al <span className="text-[#ff3e3e] font-black">100%</span> de su carga.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">2</span>
                    <p className="text-zinc-300 leading-normal">
                      Digita el código <span className="font-mono text-[#ff3e3e] font-bold">*#0228#</span> en tu Samsung o busca <i>Battery Log</i> en otras marcas.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">3</span>
                    <p className="text-zinc-300 leading-normal">
                      Verás un reporte de voltajes. Haz clic en el botón inferior rojo que dice <b>Quick Start</b>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 bg-[#ff3e3e]/15 text-[#ff3e3e] rounded-full font-black flex items-center justify-center shrink-0 text-[10px]">4</span>
                    <p className="text-zinc-300 leading-normal">
                      La pantalla se apagará por un par de segundos. El porcentaje real podría reajustarse (ej. bajar a 94%). Pon a cargar el teléfono nuevamente a 100% sin desconectar para concluir el ciclo de recalibrado.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
