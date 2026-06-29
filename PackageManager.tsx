/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ANDROID_PACKAGES } from '../data';
import { AndroidPackage } from '../types';
import { Search, Copy, Check, Info, Trash2, Smartphone, ShieldAlert, Download } from 'lucide-react';

export default function PackageManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const togglePackageSelection = (packageName: string) => {
    setSelectedPackages(prev =>
      prev.includes(packageName)
        ? prev.filter(p => p !== packageName)
        : [...prev, packageName]
    );
  };

  const selectAllBloatware = () => {
    const bloatwareNames = ANDROID_PACKAGES
      .filter(p => p.category === 'bloatware' && p.safeToRemove)
      .map(p => p.packageName);
    setSelectedPackages(bloatwareNames);
  };

  const clearSelection = () => {
    setSelectedPackages([]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter package list
  const filteredPackages = ANDROID_PACKAGES.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBrand = selectedBrand === 'all' || p.brand === selectedBrand;
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    return matchesSearch && matchesBrand && matchesCategory;
  });

  // Generate multi-debloat script
  const generateDebloatScript = () => {
    if (selectedPackages.length === 0) return '';
    return `# Script de Debloat Personalizado - XTRA METOD\n` +
           `# Conecta tu teléfono con Depuración USB activa y ejecuta:\n\n` +
           selectedPackages.map(pkg => `echo "Eliminando ${pkg}..."\nadb shell pm uninstall -k --user 0 ${pkg}`).join('\n\n');
  };

  const downloadScript = () => {
    const scriptText = generateDebloatScript();
    if (!scriptText) return;
    const blob = new Blob([scriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'xtra_debloat_script.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="package-manager-container">
      {/* List / Search area */}
      <div className="xl:col-span-7 flex flex-col gap-4">
        {/* Filters Panel */}
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              id="package-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, app o package..."
              className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff3e3e] transition-colors"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto shrink-0 font-sans">
            <select
              id="brand-filter"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#ff3e3e] transition-colors cursor-pointer font-bold"
            >
              <option value="all">Todas las Marcas</option>
              <option value="generic">Genérico / AOSP</option>
              <option value="samsung">Samsung</option>
              <option value="xiaomi">Xiaomi</option>
              <option value="huawei">Huawei</option>
              <option value="motorola">Motorola</option>
            </select>

            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#ff3e3e] transition-colors cursor-pointer font-bold"
            >
              <option value="all">Tipos de App</option>
              <option value="bloatware">Basura (Bloatware)</option>
              <option value="system">Sistema Requerido</option>
            </select>
          </div>
        </div>

        {/* Package list table */}
        <div className="bg-[#111] border border-zinc-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="border-b border-zinc-850 bg-black text-zinc-400 font-bold">
                  <th className="p-4 w-12 text-center">Sel.</th>
                  <th className="p-4">Aplicación / ID de Paquete</th>
                  <th className="p-4">Marca</th>
                  <th className="p-4">Seguridad</th>
                  <th className="p-4 text-right">Comandos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {filteredPackages.length > 0 ? (
                  filteredPackages.map(pkg => (
                    <tr key={pkg.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          id={`check-pkg-${pkg.id}`}
                          checked={selectedPackages.includes(pkg.packageName)}
                          onChange={() => togglePackageSelection(pkg.packageName)}
                          disabled={!pkg.safeToRemove}
                          className="w-4 h-4 rounded border-zinc-800 bg-black text-[#ff3e3e] focus:ring-[#ff3e3e] focus:ring-offset-black disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white text-sm mb-0.5">{pkg.name}</div>
                        <div className="font-mono text-[10px] text-zinc-400 select-all">{pkg.packageName}</div>
                        <p className="text-zinc-500 mt-1 max-w-sm line-clamp-2 leading-relaxed">{pkg.description}</p>
                      </td>
                      <td className="p-4 capitalize text-zinc-300">
                        <span className="inline-flex items-center gap-1">
                          <Smartphone className="w-3.5 h-3.5 text-zinc-600" />
                          {pkg.brand === 'generic' ? 'Genérico' : pkg.brand}
                        </span>
                      </td>
                      <td className="p-4">
                        {pkg.safeToRemove ? (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 font-bold text-[10px]">
                            Seguro Eliminar
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20 font-bold text-[10px]">
                            Vital / Cuidado
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            id={`copy-uninstall-${pkg.id}`}
                            onClick={() => copyToClipboard(`adb shell pm uninstall -k --user 0 ${pkg.packageName}`, `un-${pkg.id}`)}
                            className="px-2 py-1 bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-[#ff3e3e] text-[10px] font-mono text-zinc-300 rounded transition flex items-center gap-1"
                            title="Copiar comando de desinstalación"
                          >
                            {copiedId === `un-${pkg.id}` ? <Check className="w-3 h-3 text-green-400" /> : <Trash2 className="w-3 h-3 text-[#ff3e3e]" />}
                            PM Uninstall
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-zinc-500 font-medium">
                      No se encontraron paquetes para los filtros actuales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Debloat Generator Column */}
      <div className="xl:col-span-5 flex flex-col gap-4">
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-6 flex flex-col h-full gap-5">
          <div className="flex items-start gap-3 border-b border-zinc-800 pb-4">
            <div className="p-2.5 bg-[#ff3e3e]/10 rounded-xl border border-[#ff3e3e]/20 text-[#ff3e3e]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Creador de Script Debloat</h3>
              <p className="text-xs text-zinc-400 leading-normal mt-0.5">
                Selecciona apps no deseadas a la izquierda para generar un script automatizado que las purgue de una sola vez.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-medium font-sans">Paquetes Seleccionados:</span>
              <span className="font-black text-[#ff3e3e] font-mono">{selectedPackages.length} de {ANDROID_PACKAGES.filter(p => p.safeToRemove).length} seguros</span>
            </div>

            <div className="flex gap-2">
              <button
                id="select-all-bloat-btn"
                onClick={selectAllBloatware}
                className="flex-1 py-2 px-3 bg-[#ff3e3e]/15 hover:bg-[#ff3e3e]/25 text-[#ff3e3e] text-xs font-black rounded-xl border border-[#ff3e3e]/30 transition text-center uppercase tracking-wider"
              >
                Seleccionar Toda la Basura
              </button>
              <button
                id="clear-selection-btn"
                onClick={clearSelection}
                className="py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl border border-zinc-800 transition uppercase"
              >
                Limpiar
              </button>
            </div>
          </div>

          {selectedPackages.length > 0 ? (
            <div className="flex flex-col flex-1 gap-3">
              <div className="flex-1 bg-black border border-zinc-850 rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">xtra_debloat_script.sh</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-[#111] border border-zinc-800 text-[#ff3e3e] rounded font-mono font-bold">BASH</span>
                </div>
                <pre className="text-[11px] font-mono text-[#ff3e3e] overflow-y-auto max-h-[220px] select-all leading-normal whitespace-pre-wrap flex-1 custom-scrollbar">
                  {generateDebloatScript()}
                </pre>
              </div>

              <div className="flex gap-3">
                <button
                  id="download-script-btn"
                  onClick={downloadScript}
                  className="flex-1 bg-[#ff3e3e] hover:bg-[#e03737] text-black font-black py-3 rounded-xl text-xs transition flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-[#ff3e3e]/10"
                >
                  <Download className="w-4 h-4" />
                  Descargar Script (.sh)
                </button>
                <button
                  id="copy-script-btn"
                  onClick={() => copyToClipboard(generateDebloatScript(), 'script')}
                  className="py-3 px-5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl text-xs transition border border-zinc-800 uppercase"
                >
                  {copiedId === 'script' ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-black/40 border border-dashed border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center text-zinc-500 gap-2 min-h-[180px]">
              <Info className="w-8 h-8 text-zinc-800 mb-1" />
              <p className="text-xs font-bold text-zinc-400">Consola de Script Vacía</p>
              <p className="text-[11px] text-zinc-600 max-w-[240px] leading-relaxed">
                Marca las casillas de las aplicaciones basura que deseas purgar de tu celular para ver el código automatizado aquí.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
