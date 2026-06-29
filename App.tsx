/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import AjustesOcultos from './components/AjustesOcultos';
import PackageManager from './components/PackageManager';
import EngineerMode from './components/EngineerMode';
import AdbConsole from './components/AdbConsole';
import AdminPanel from './components/AdminPanel';
import PaywallModal from './components/PaywallModal';
import { 
  ShieldCheck, 
  Settings, 
  Cpu, 
  Terminal, 
  Layers, 
  Lock, 
  Unlock, 
  LogOut, 
  Smartphone,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [unlockedTier, setUnlockedTier] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'hidden_settings' | 'packages' | 'engineer_mode' | 'adb_console' | 'admin'>('hidden_settings');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthError, setAdminAuthError] = useState(false);

  // Check if license is saved in localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('xtra_license_key');
    const savedTier = localStorage.getItem('xtra_license_tier');
    
    if (savedKey && savedTier) {
      // Re-verify key silently on startup
      fetch('/api/license/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: savedKey })
      })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setIsUnlocked(true);
          setUnlockedTier(data.tier);
        } else {
          // If expired or invalid, wipe it
          localStorage.removeItem('xtra_license_key');
          localStorage.removeItem('xtra_license_tier');
        }
      })
      .catch(() => {
        // Offline/fail-safe fallback
        setIsUnlocked(true);
        setUnlockedTier(savedTier);
      });
    }
  }, []);

  const handleUnlockSuccess = (tier: string) => {
    setIsUnlocked(true);
    setUnlockedTier(tier);
  };

  const handleLogout = () => {
    localStorage.removeItem('xtra_license_key');
    localStorage.removeItem('xtra_license_tier');
    setIsUnlocked(false);
    setUnlockedTier('');
    setActiveTab('hidden_settings');
  };

  const handleAdminAccessSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cleanPass = adminPassword.trim().toLowerCase();
    const validPasswords = [
      'admin123',
      'xtrametod',
      'xtramétodo',
      'administrador123elxtramétodo',
      'admin123elxtramétodo',
      'admin123elxtrametodo',
      'administrador123elxtrametodo'
    ];
    if (validPasswords.includes(cleanPass)) {
      setIsUnlocked(true);
      setUnlockedTier('admin');
      setActiveTab('admin');
      setShowAdminLogin(false);
      setAdminPassword('');
      setAdminAuthError(false);
      localStorage.setItem('xtra_license_key', 'XTRA-MASTER-ADMIN-PASS');
      localStorage.setItem('xtra_license_tier', 'admin');
    } else {
      setAdminAuthError(true);
    }
  };

  // If user has not entered a valid key, they must go through the paywall first!
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col justify-between">
        <PaywallModal onUnlock={handleUnlockSuccess} />
        
        {/* Subtle bottom bypass for developers/owner */}
        <footer className="py-4 border-t border-zinc-900 bg-[#080808] text-center text-xs text-zinc-600 flex justify-center items-center gap-3">
          <span className="font-mono">XTRA METOD SYSTEM v4.10</span>
          <span>•</span>
          <button 
            id="admin-bypass-toggle"
            onClick={() => setShowAdminLogin(!showAdminLogin)} 
            className="hover:text-[#ff3e3e] font-bold transition flex items-center gap-1"
          >
            <Lock className="w-3.5 h-3.5 text-zinc-700" />
            Acceso Propietario
          </button>

          {showAdminLogin && (
            <div className="absolute bottom-16 bg-[#111] border border-zinc-800 p-4 rounded-xl shadow-2xl space-y-3 z-50 max-w-sm w-full mx-4">
              <div className="text-left">
                <h4 className="text-white font-bold text-sm">Clave de Administrador</h4>
                <p className="text-[11px] text-zinc-500 mt-0.5">Ingresa "admin123" o "xtrametod" para abrir el panel de control financiero.</p>
              </div>
              <form onSubmit={handleAdminAccessSubmit} className="flex gap-2">
                <input
                  type="password"
                  id="admin-pass-input"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Contraseña..."
                  className="bg-black border border-zinc-800 text-xs text-white p-2 rounded-lg flex-1 focus:outline-none focus:border-[#ff3e3e]"
                />
                <button type="submit" className="bg-[#ff3e3e] hover:bg-[#e03737] text-black text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                  Entrar
                </button>
              </form>
              {adminAuthError && <p className="text-xs text-rose-500 font-bold text-left">Clave incorrecta.</p>}
            </div>
          )}
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#e0e0e0] font-sans flex flex-col justify-between" id="app-viewport">
      
      {/* Top Cockpit Header */}
      <header className="bg-[#0a0a0a] border-b border-zinc-800 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-[#ff3e3e] uppercase leading-none italic underline decoration-2 underline-offset-4">
                XTRA METOD YO SI OCONSOLE
              </h1>
              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-bold mt-1.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                VIP ACTIVO ({unlockedTier === 'trial' ? '14 Días' : unlockedTier === 'monthly' ? '1 Mes' : '3 Meses'}) // Advanced Kernel Console
              </span>
            </div>

            {/* Logout on mobile */}
            <button 
              id="logout-btn-mobile"
              onClick={handleLogout}
              className="lg:hidden p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-lg transition"
              title="Cerrar Sesión / Relock"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Control Center Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-black p-1.5 rounded-xl border border-zinc-850">
            <button
              id="tab-hidden-settings"
              onClick={() => setActiveTab('hidden_settings')}
              className={`px-3 py-2 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'hidden_settings' 
                  ? 'bg-[#ff3e3e] text-black' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Ajustes Ocultos
            </button>
            <button
              id="tab-packages"
              onClick={() => setActiveTab('packages')}
              className={`px-3 py-2 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'packages' 
                  ? 'bg-[#ff3e3e] text-black' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Packages Manager
            </button>
            <button
              id="tab-engineer-mode"
              onClick={() => setActiveTab('engineer_mode')}
              className={`px-3 py-2 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'engineer_mode' 
                  ? 'bg-[#ff3e3e] text-black' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Engineer Mode
            </button>
            <button
              id="tab-adb-console"
              onClick={() => setActiveTab('adb_console')}
              className={`px-3 py-2 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'adb_console' 
                  ? 'bg-[#ff3e3e] text-black animate-pulse' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Consola ADB AI
            </button>
            {unlockedTier === 'admin' && (
              <button
                id="tab-admin"
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 text-xs font-black rounded-lg transition flex items-center gap-1.5 ${
                  activeTab === 'admin' 
                    ? 'bg-[#ff3e3e] text-black' 
                    : 'text-[#ff3e3e]/90 hover:text-white hover:bg-zinc-900 border border-dashed border-[#ff3e3e]/30'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Panel Propietario
              </button>
            )}
          </div>

          {/* Relock Button Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {activeTab === 'admin' && (
              <span className="text-[10px] bg-[#ff3e3e]/10 text-[#ff3e3e] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border border-[#ff3e3e]/20">
                🛠️ Admin Modo
              </span>
            )}
            <button
              id="logout-btn-desktop"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-400 hover:text-[#ff3e3e] bg-zinc-900 border border-zinc-800 rounded-lg transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Cerrar Sesión
            </button>
          </div>

        </div>
      </header>

      {/* Main Console View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
        {activeTab === 'hidden_settings' && <AjustesOcultos />}
        {activeTab === 'packages' && <PackageManager />}
        {activeTab === 'engineer_mode' && <EngineerMode />}
        {activeTab === 'adb_console' && <AdbConsole />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>

      {/* Tech Footer & Secret Access Port */}
      <footer className="py-5 border-t border-zinc-900 bg-[#080808] text-[10px] uppercase font-bold tracking-widest text-zinc-600 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>Firmware Version: XTRA-OS_V12.4.9 // Kernel: 5.10.107-GKI</p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-green-500 font-bold">● LOCAL_ADB: ACTIVE</span>
            <button
              id="admin-access-footer"
              onClick={() => {
                if (unlockedTier === 'admin') {
                  setActiveTab(activeTab === 'admin' ? 'hidden_settings' : 'admin');
                } else if (activeTab === 'admin') {
                  setActiveTab('hidden_settings');
                } else {
                  setShowAdminLogin(!showAdminLogin);
                }
              }}
              className="hover:text-zinc-400 font-bold transition flex items-center gap-1"
            >
              {unlockedTier === 'admin' ? (
                activeTab === 'admin' ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-purple-400" />
                    Salir de Admin
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#ff3e3e]" />
                    Ir al Panel Propietario
                  </>
                )
              ) : activeTab === 'admin' ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-purple-400" />
                  Salir de Admin
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-zinc-700 hover:text-zinc-400" />
                  Administrar Cobros
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hidden Owner Authorization Prompt in footer */}
        {showAdminLogin && activeTab !== 'admin' && (
          <div className="fixed bottom-16 right-4 sm:right-8 bg-[#111] border border-zinc-800 p-4 rounded-xl shadow-2xl space-y-3 z-50 max-w-sm w-full mx-4">
            <div className="text-left">
              <h4 className="text-white font-bold text-sm">Panel del Propietario</h4>
              <p className="text-[10px] text-zinc-500 mt-0.5 font-sans">
                Escribe la clave de administrador para configurar tus métodos de pago (WhatsApp, Stripe, PayPal) o generar licencias manuales.
              </p>
            </div>
            <form onSubmit={handleAdminAccessSubmit} className="flex gap-2 font-sans">
              <input
                type="password"
                id="admin-auth-input"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Escribe admin123 o xtrametod..."
                className="bg-black border border-zinc-800 text-xs text-white p-2.5 rounded-lg flex-1 focus:outline-none focus:border-[#ff3e3e]"
              />
              <button type="submit" className="bg-[#ff3e3e] hover:bg-[#e03737] text-black text-xs font-bold px-4 py-2 rounded-lg shrink-0 transition-colors">
                Acceder
              </button>
            </form>
            {adminAuthError && <p className="text-xs text-rose-500 font-bold text-left font-sans">Contraseña incorrecta.</p>}
          </div>
        )}
      </footer>

    </div>
  );
}
