/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, FormEvent } from 'react';
import { TerminalLine } from '../types';
import { Terminal, Send, RefreshCw, Sparkles } from 'lucide-react';

interface DeviceState {
  model: string;
  connected: boolean;
  unauthorized: boolean;
  battery: number;
}

export default function AdbConsole() {
  const [device, setDevice] = useState<DeviceState>({
    model: 'POCO X5 Pro 5G',
    connected: true,
    unauthorized: false,
    battery: 88,
  });

  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: 'XTRA CONSOLE [Version 4.10.8-Premium]',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'init-2',
      type: 'system',
      text: '(c) 2026 XTRA METOD YO SI OCONSOLE Corporation. Todos los derechos reservados.',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'init-3',
      type: 'success',
      text: 'Consola cargada. Escribe "help" para ver la lista de comandos soportados en el simulador.',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'init-4',
      type: 'system',
      text: 'Escribe "ai <tu consulta>" para que Gemini AI configure comandos y scripts complejos por ti.',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'init-5',
      type: 'success',
      text: `Dispositivo detectado vía USB: ${device.model} [CONECTADO]`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLine = (type: TerminalLine['type'], text: string) => {
    setLines(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        type,
        text,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const handleDeviceReboot = () => {
    addLine('system', 'Enviando comando: adb reboot...');
    setDevice(prev => ({ ...prev, connected: false }));
    addLine('output', 'Reiniciando dispositivo... Conexión cerrada temporalmente.');
    
    setTimeout(() => {
      setDevice(prev => ({ ...prev, connected: true }));
      addLine('success', `Dispositivo ${device.model} reiniciado con éxito y re-conectado vía ADB.`);
    }, 5000);
  };

  const handleAskGemini = async (questionText: string) => {
    if (!questionText.trim()) return;
    setIsAiLoading(true);
    addLine('input', `ai ${questionText}`);
    addLine('system', 'Contactando con Gemini AI Engine para generar comandos seguros...');

    try {
      const response = await fetch('/api/gemini-adb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: questionText })
      });

      const data = await response.json();
      if (response.ok) {
        addLine('ai', data.response);
      } else {
        addLine('error', `Error de Gemini API: ${data.error || 'No se pudo generar respuesta.'}`);
      }
    } catch (error) {
      addLine('error', 'Error de red al conectar con el servidor.');
    } finally {
      setIsAiLoading(false);
      setAiQuestion('');
    }
  };

  const handleCommandSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const command = inputValue.trim();
    if (!command) return;

    // Save user input line
    addLine('input', `$ ${command}`);
    setInputValue('');

    // Pre-process local/simulation commands
    const lowercaseCmd = command.toLowerCase();

    if (lowercaseCmd === 'clear') {
      setLines([]);
      return;
    }

    if (lowercaseCmd === 'help') {
      addLine('output', '--- LISTADO DE COMANDOS ADB EN EL SIMULADOR ---');
      addLine('output', '• adb devices                      - Enlista dispositivos conectados.');
      addLine('output', '• adb reboot                       - Simula reinicio físico del teléfono.');
      addLine('output', '• adb shell getprop ro.product.model - Obtiene modelo de dispositivo.');
      addLine('output', '• adb shell pm list packages       - Enlista todos los packages instalados.');
      addLine('output', '• adb shell screencap              - Simula captura de pantalla del móvil.');
      addLine('output', '• adb shell wm density             - Obtiene la densidad de pantalla (DPI).');
      addLine('output', '• ai <pregunta>                    - Consulta con Inteligencia Artificial.');
      addLine('output', '• clear                            - Limpia la pantalla de la consola.');
      return;
    }

    if (lowercaseCmd.startsWith('ai ')) {
      const q = command.substring(3).trim();
      await handleAskGemini(q);
      return;
    }

    if (!device.connected && lowercaseCmd.startsWith('adb')) {
      addLine('error', 'Error: No hay ningún dispositivo conectado. Espera a que termine de encender.');
      return;
    }

    // Process other simulated command responses
    switch (lowercaseCmd) {
      case 'adb devices':
        addLine('output', 'List of devices attached');
        addLine('output', `${device.model.replace(/\s+/g, '_')}_ADB\tdevice`);
        break;
      
      case 'adb reboot':
        handleDeviceReboot();
        break;
      
      case 'adb shell getprop ro.product.model':
        addLine('output', device.model);
        break;
      
      case 'adb shell wm density':
        addLine('output', 'Physical density: 440');
        addLine('output', 'Override density: 420');
        break;

      case 'adb shell pm list packages':
        addLine('output', 'package:com.android.settings');
        addLine('output', 'package:com.google.android.youtube');
        addLine('output', 'package:com.miui.msa.global (Bloatware detectable)');
        addLine('output', 'package:com.facebook.appmanager');
        addLine('output', 'package:com.samsung.android.bixby.agent');
        addLine('output', 'package:com.whatsapp');
        addLine('output', 'package:com.android.systemui');
        addLine('output', '--- Total: 142 paquetes de sistema y usuario ---');
        break;

      case 'adb shell screencap':
        addLine('system', 'Tomando captura de pantalla...');
        addLine('success', 'Captura tomada exitosamente y guardada en: /sdcard/screencap_xtra.png');
        addLine('output', '[SIMULATION OUTPUT]: 1080x2400 PNG generado.');
        break;

      default:
        // If not a predefined command, forward to server-side Gemini to "generate/explain" what this adb command would do!
        addLine('system', `Analizando comando desconocido: "${command}" con Gemini AI...`);
        setIsAiLoading(true);
        try {
          const response = await fetch('/api/gemini-adb', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              prompt: `El usuario ingresó este comando en la consola de ADB: "${command}". Explica qué hace exactamente en un teléfono Android, o si tiene errores de sintaxis, corrígelo e indica la sintaxis real. Sé breve y estructurado.`
            })
          });
          const data = await response.json();
          if (response.ok) {
            addLine('ai', data.response);
          } else {
            addLine('error', 'Comando no reconocido. Escribe "help" para ver las opciones.');
          }
        } catch {
          addLine('error', 'Comando no reconocido. Intenta con "ai <tu pregunta>".');
        } finally {
          setIsAiLoading(false);
        }
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6" id="adb-console-container">
      {/* Device Status Sidebar */}
      <div className="xl:col-span-4 flex flex-col gap-4">
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">Estado de Conexión</h3>
            <span className={`flex h-2.5 w-2.5 rounded-full ${device.connected ? 'bg-[#ff3e3e] animate-pulse' : 'bg-zinc-600 animate-ping'}`} />
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Modelo Detectado:</span>
              <span className="font-bold text-white">{device.model}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Puerto de Enlace:</span>
              <span className="font-mono text-zinc-300">USB-IF @ 500mA</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">ADB Autorizado:</span>
              <span className={`font-black ${device.unauthorized ? 'text-amber-400' : 'text-green-400'}`}>
                {device.unauthorized ? 'No (Pendiente)' : 'Sí (Llave RSA ok)'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Batería Móvil:</span>
              <span className="font-bold text-white">{device.battery}%</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              id="reboot-device-btn"
              onClick={handleDeviceReboot}
              disabled={!device.connected}
              className="w-full py-2.5 px-4 bg-black hover:bg-zinc-900 disabled:bg-zinc-950 disabled:text-zinc-600 text-white font-black rounded-xl text-xs transition border border-zinc-800 hover:border-[#ff3e3e] flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Forzar Reinicio del Dispositivo
            </button>
          </div>
        </div>

        {/* AI Command Generator panel */}
        <div className="bg-[#111] border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#ff3e3e] font-black text-sm">
            <Sparkles className="w-4 h-4 text-[#ff3e3e]" />
            <h4>Asistente AI ADB (Gemini)</h4>
          </div>
          <p className="text-xs text-zinc-400 leading-normal">
            ¿No sabes qué comando necesitas? Pregúntale a Gemini y te dará el comando exacto de inmediato.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleAskGemini(aiQuestion); }} className="space-y-2">
            <textarea
              id="ai-adb-query"
              rows={3}
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ej: ¿Cómo desinstalo bloatware de mi Samsung usando adb?"
              className="w-full bg-black border border-zinc-850 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff3e3e] transition-colors"
            />
            <button
              type="submit"
              disabled={isAiLoading || !aiQuestion.trim()}
              className="w-full py-2.5 bg-[#ff3e3e] hover:bg-[#e03535] disabled:bg-zinc-950 disabled:text-zinc-600 text-white font-black rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAiLoading ? 'Generando...' : 'Consultar a Gemini'}
            </button>
          </form>
        </div>
      </div>

      {/* Cyberpunk Terminal Emulator */}
      <div className="xl:col-span-8 flex flex-col">
        <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
          {/* Terminal Window Header */}
          <div className="bg-[#111] border-b border-zinc-850 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#ff3e3e]" />
              <span className="text-xs font-mono font-bold text-zinc-300">adb_terminal_session@xtra_console</span>
            </div>
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-800" />
              <span className="w-2 h-2 rounded-full bg-zinc-800" />
              <span className="w-2 h-2 rounded-full bg-zinc-800" />
            </div>
          </div>

          {/* Terminal Content Body */}
          <div className="flex-1 p-5 overflow-y-auto font-mono text-xs leading-relaxed space-y-2.5 custom-scrollbar bg-black text-zinc-200">
            {lines.map((line) => {
              let styleClass = 'text-zinc-300';
              if (line.type === 'input') styleClass = 'text-white font-semibold';
              else if (line.type === 'error') styleClass = 'text-[#ff3e3e] font-medium';
              else if (line.type === 'success') styleClass = 'text-green-400 font-medium';
              else if (line.type === 'system') styleClass = 'text-zinc-600';
              else if (line.type === 'ai') styleClass = 'text-[#ff3e3e] bg-[#ff3e3e]/5 p-4 rounded-xl border border-[#ff3e3e]/15 block whitespace-pre-wrap leading-normal font-medium';

              return (
                <div key={line.id} className="flex flex-col gap-0.5">
                  <div className={`break-words ${styleClass}`}>{line.text}</div>
                  <span className="text-[9px] text-zinc-600 text-right self-end select-none">{line.timestamp}</span>
                </div>
              );
            })}
            
            {isAiLoading && (
              <div className="flex items-center gap-2 text-[#ff3e3e] animate-pulse text-[11px] font-semibold py-1">
                <Sparkles className="w-3.5 h-3.5 text-[#ff3e3e] animate-spin" />
                <span>[XTRA ENGINE AI] Procesando solución óptima para tu teléfono...</span>
              </div>
            )}
            
            <div ref={terminalEndRef} />
          </div>

          {/* Terminal Input Box */}
          <form onSubmit={handleCommandSubmit} className="bg-[#111] border-t border-zinc-850 px-4 py-3 flex items-center gap-3">
            <span className="text-[#ff3e3e] font-bold font-mono text-xs">$</span>
            <input
              type="text"
              id="terminal-cmd-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder='Escribe un comando ADB (ej: "adb devices") o "ai <pregunta>"'
              className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white placeholder-zinc-600 focus:ring-0 p-0"
              autoComplete="off"
              disabled={isAiLoading}
            />
            <button
              type="submit"
              disabled={isAiLoading || !inputValue.trim()}
              className="p-1.5 bg-black hover:bg-zinc-900 disabled:bg-zinc-950 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
