import React from 'react';
import { Eye, Navigation, Glasses, MousePointer, Smartphone } from 'lucide-react';
import { sound } from '../utils/audio';

interface VRControlsHelpProps {
  onClose: () => void;
}

export const VRControlsHelp: React.FC<VRControlsHelpProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Guía de Navegación & Modos de Realidad Virtual
              </h2>
              <p className="text-xs text-slate-400">Controles para Computador, Celular y Lentes VR</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Mode 1: Orbit 3D */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <MousePointer className="w-4 h-4 text-emerald-400" />
              <span>Modo 1: Órbita de Laboratorio 3D</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Permite rotar alrededor de la célula cortada, hacer zoom con la rueda del ratón y hacer clic directamente sobre cualquier orgánulo o baliza luminosa para examinarlo.
            </p>
          </div>

          {/* Mode 2: Nanobot Explorer First Person */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-cyan-300">
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Modo 2: Nanobot VR Submarino (Primera Persona)</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              ¡Viaja dentro del citoplasma celular en un dron microscópico!
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="font-mono text-emerald-400 font-bold">W / A / S / D</span> o flechas: Desplazarse adelante, atrás y a los lados.
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                <span className="font-mono text-emerald-400 font-bold">Espacio / Shift</span> o Q / E: Ascender o descender en el fluido celular.
              </div>
            </div>
          </div>

          {/* Mode 3: VR Stereo / Cardboard */}
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 font-bold text-purple-300">
              <Glasses className="w-4 h-4 text-purple-400" />
              <span>Modo 3: Lentes VR / Google Cardboard (Pantalla Dividida)</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              Divide la pantalla en dos ojos (estéreo 3D). Coloca tu teléfono móvil dentro de unas gafas de realidad virtual (Google Cardboard, VR Box) para una experiencia inmersiva completa en el salón de clases.
            </p>
          </div>

          {/* Mobile touch tip */}
          <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center gap-2.5 text-amber-200 text-xs">
            <Smartphone className="w-5 h-5 shrink-0 text-amber-400" />
            <span>
              <strong>En celular o tablet:</strong> Arrastra con un dedo para girar la cámara 360°, y usa los botones de flecha que aparecen en pantalla en modo Nanobot.
            </span>
          </div>
        </div>

        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition"
          >
            ¡Entendido, listo para explorar!
          </button>
        </div>
      </div>
    </div>
  );
};
