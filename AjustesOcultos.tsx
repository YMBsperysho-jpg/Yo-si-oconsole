/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { HIDDEN_SETTINGS } from '../data';
import { HiddenSetting } from '../types';
import { Copy, Check, Settings, ShieldAlert, Cpu, Network, Sparkles } from 'lucide-react';

export default function AjustesOcultos() {
  const [selectedSetting, setSelectedSetting] = useState<HiddenSetting | null>(HIDDEN_SETTINGS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSettings = activeCategory === 'all'
    ? HIDDEN_SETTINGS
    : HIDDEN_SETTINGS.filter(s => s.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return <Settings className="w-4 h-4 text-[#ff3e3e]" />;
      case 'developer': return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'network': return <Network className="w-4 h-4 text-cyan-400" />;
      default: return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'system': return 'Sistema';
      case 'developer': return 'Desarrollo';
      case 'network': return 'Red/Modem';
      case 'testing': return 'Pruebas';
      default: return category;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ajustes-ocultos-container">
      {/* List / Selection Column */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-5 flex flex-col">
          <h3 className="text-xs font-bold text-zinc-400 mb-3 uppercase tracking-widest">Filtrar por Categoría</h3>
          <div className="flex flex-wrap gap-2">
            {['all', 'system', 'developer', 'network', 'testing'].map(category => (
              <button
                key={category}
                id={`filter-${category}`}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-[#ff3e3e]/15 text-[#ff3e3e] border border-[#ff3e3e]'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
                }`}
              >
                {category === 'all' ? 'Ver Todos' : getCategoryLabel(category)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden max-h-[500px] overflow-y-auto custom-scrollbar">
          <div className="divide-y divide-zinc-900">
            {filteredSettings.map(setting => (
              <button
                key={setting.id}
                id={`setting-btn-${setting.id}`}
                onClick={() => setSelectedSetting(setting)}
                className={`w-full text-left p-4 transition-all flex items-start gap-3 hover:bg-zinc-900/40 ${
                  selectedSetting?.id === setting.id
                    ? 'bg-zinc-900 border-l-4 border-[#ff3e3e]'
                    : 'border-l-4 border-transparent'
                }`}
              >
                <div className="p-2 rounded-lg bg-black border border-zinc-800 shrink-0 mt-0.5">
                  {getCategoryIcon(setting.category)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white truncate">{setting.name}</span>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-black rounded text-zinc-500 border border-zinc-800">
                      {getCategoryLabel(setting.category)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{setting.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details Area */}
      <div className="lg:col-span-7">
        {selectedSetting ? (
          <div className="bg-[#111] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6 h-full">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#ff3e3e]">AJUSTE OCULTO</span>
                  <span className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 font-bold">
                    AOSP Native
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">{selectedSetting.name}</h2>
              </div>
              <div className="p-3 bg-black border border-zinc-800 rounded-xl">
                {getCategoryIcon(selectedSetting.category)}
              </div>
            </div>

            {/* General Info */}
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Descripción de Funcionalidad</h4>
                <p className="text-sm text-zinc-300 leading-relaxed">{selectedSetting.description}</p>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">Instrucciones y Guía de Uso</h4>
                <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-xl p-4 flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="text-xs text-zinc-400 leading-relaxed space-y-1">
                    <p className="font-semibold text-zinc-200">Recomendaciones de Seguridad:</p>
                    <p>{selectedSetting.instructions}</p>
                  </div>
                </div>
              </div>

              {/* Commands Box */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Comando de Lanzamiento ADB</h4>
                    <span className="text-[10px] font-mono text-zinc-500">Ejecutar desde PC o terminal</span>
                  </div>
                  <div className="bg-black border border-zinc-850 rounded-xl p-3 flex items-center justify-between gap-4 font-mono text-xs text-[#ff3e3e] overflow-x-auto select-all">
                    <span className="whitespace-nowrap">{selectedSetting.adbCommand}</span>
                    <button
                      id={`copy-adb-${selectedSetting.id}`}
                      onClick={() => copyToClipboard(selectedSetting.adbCommand, 'adb')}
                      className="p-1.5 rounded-lg bg-[#111] hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition shrink-0"
                      title="Copiar comando"
                    >
                      {copiedId === 'adb' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Intent URL (Lanzamiento Directo desde Navegador)</h4>
                    <span className="text-[10px] font-mono text-zinc-500">Solo funciona dentro de Android</span>
                  </div>
                  <div className="bg-black border border-zinc-850 rounded-xl p-3 flex items-center justify-between gap-4 font-mono text-xs text-cyan-400 overflow-x-auto select-all">
                    <span className="whitespace-nowrap truncate">{selectedSetting.intentUrl}</span>
                    <button
                      id={`copy-intent-${selectedSetting.id}`}
                      onClick={() => copyToClipboard(selectedSetting.intentUrl, 'intent')}
                      className="p-1.5 rounded-lg bg-[#111] hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 transition shrink-0"
                      title="Copiar enlace Intent"
                    >
                      {copiedId === 'intent' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="mt-auto pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-3">
              <a
                href={selectedSetting.intentUrl}
                className="flex-1 inline-flex justify-center items-center gap-2 bg-[#ff3e3e] hover:bg-[#e03737] text-black font-black py-3 px-4 rounded-xl text-xs transition uppercase tracking-wider shadow-lg shadow-[#ff3e3e]/10 hover:shadow-[#ff3e3e]/20"
              >
                Abrir en Teléfono (Intent)
              </a>
              <button
                onClick={() => copyToClipboard(selectedSetting.adbCommand, 'direct')}
                className="sm:flex-1 inline-flex justify-center items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition border border-zinc-800 uppercase tracking-wider"
              >
                {copiedId === 'direct' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                Copiar Todo el Método
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#111] border border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center h-full text-zinc-500">
            <Settings className="w-12 h-12 mb-4 animate-pulse text-zinc-700" />
            <p className="text-sm">Selecciona un ajuste oculto del listado para inspeccionar su código y método de ejecución.</p>
          </div>
        )}
      </div>
    </div>
  );
}
