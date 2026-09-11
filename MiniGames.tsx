import React, { useState, useEffect } from 'react';
import { Sun, Droplets, Cpu, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface MiniGameProps {
  type: 'photosynthesis' | 'turgor' | 'protein' | 'sorter';
  onComplete: (score: number) => void;
  onClose: () => void;
}

export const MiniGames: React.FC<MiniGameProps> = ({ type, onComplete, onClose }) => {
  // --- 1. PHOTOSYNTHESIS GAME ---
  const [photonsCollected, setPhotonsCollected] = useState(0);
  const [co2Collected, setCo2Collected] = useState(0);
  const [glucoseProduced, setGlucoseProduced] = useState(0);

  // --- 2. TURGOR PRESSURE GAME ---
  const [waterLevel, setWaterLevel] = useState(50);
  const [turgorStatus, setTurgorStatus] = useState<'plasmolyzed' | 'optimal' | 'burst'>('optimal');
  const [holdTimer, setHoldTimer] = useState(0);

  // --- 3. RIBOSOME TRANSLATION GAME ---
  const codonSequence = ['AUG', 'GCU', 'UAC', 'UAA'];
  const aminoMap: { [key: string]: string } = {
    AUG: 'Metionina (Inicio)',
    GCU: 'Alanina',
    UAC: 'Tirosina',
    UAA: 'Codón de Parada'
  };
  const [currentCodonIdx, setCurrentCodonIdx] = useState(0);
  const [peptideChain, setPeptideChain] = useState<string[]>([]);

  // Photosynthesis logic
  const handleCollectPhoton = () => {
    sound.playPhoton();
    if (photonsCollected + 1 >= 3 && co2Collected >= 3) {
      setPhotonsCollected(0);
      setCo2Collected(0);
      const newGlucose = glucoseProduced + 1;
      setGlucoseProduced(newGlucose);
      sound.playSuccess();
      if (newGlucose >= 3) {
        setTimeout(() => onComplete(150), 600);
      }
    } else {
      setPhotonsCollected((prev) => prev + 1);
    }
  };

  const handleCollectCO2 = () => {
    sound.playClick();
    if (photonsCollected >= 3 && co2Collected + 1 >= 3) {
      setPhotonsCollected(0);
      setCo2Collected(0);
      const newGlucose = glucoseProduced + 1;
      setGlucoseProduced(newGlucose);
      sound.playSuccess();
      if (newGlucose >= 3) {
        setTimeout(() => onComplete(150), 600);
      }
    } else {
      setCo2Collected((prev) => prev + 1);
    }
  };

  // Turgor logic
  useEffect(() => {
    if (type !== 'turgor') return;
    if (waterLevel < 35) {
      setTurgorStatus('plasmolyzed'); // Marchita
    } else if (waterLevel > 80) {
      setTurgorStatus('burst'); // Exceso
    } else {
      setTurgorStatus('optimal'); // Turgente erguida
    }
  }, [waterLevel, type]);

  useEffect(() => {
    if (type !== 'turgor') return;
    const interval = setInterval(() => {
      setWaterLevel((prev) => Math.max(10, prev - 2.5)); // Natural transpiration
      if (turgorStatus === 'optimal') {
        setHoldTimer((prev) => {
          if (prev >= 6) {
            clearInterval(interval);
            sound.playSuccess();
            setTimeout(() => onComplete(150), 500);
            return 6;
          }
          return prev + 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [type, turgorStatus, onComplete]);

  // Ribosome logic
  const handleSelectAmino = (codon: string) => {
    if (codon === codonSequence[currentCodonIdx]) {
      sound.playSuccess();
      const amino = aminoMap[codon];
      const newChain = [...peptideChain, amino];
      setPeptideChain(newChain);
      if (currentCodonIdx + 1 >= codonSequence.length) {
        setTimeout(() => onComplete(150), 600);
      } else {
        setCurrentCodonIdx((prev) => prev + 1);
      }
    } else {
      sound.playError();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {type === 'photosynthesis' && <Sun className="w-6 h-6 text-yellow-400 animate-spin" />}
            {type === 'turgor' && <Droplets className="w-6 h-6 text-cyan-400 animate-bounce" />}
            {type === 'protein' && <Cpu className="w-6 h-6 text-purple-400" />}
            {type === 'sorter' && <Sparkles className="w-6 h-6 text-emerald-400" />}
            <div>
              <h3 className="font-bold text-lg text-emerald-300">
                {type === 'photosynthesis' && 'Desafío del Cloroplasto: Fotosíntesis'}
                {type === 'turgor' && 'Desafío de la Vacuola: Presión de Turgencia'}
                {type === 'protein' && 'Desafío del Ribosoma: Síntesis de Proteínas'}
                {type === 'sorter' && 'Desafío de la Pared Celular: Resistencia'}
              </h3>
              <p className="text-xs text-slate-400">Mini-experimento interactivo de laboratorio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-sm bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg"
          >
            ✕ Salir
          </button>
        </div>

        {/* Content per mini-game */}
        <div className="py-6">
          {type === 'photosynthesis' && (
            <div className="space-y-5 text-center">
              <p className="text-sm text-slate-300">
                ¡Atrapa fotones de luz solar y moléculas de CO2 para sintetizar <strong>3 moléculas de Glucosa</strong> en el tilacoide!
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleCollectPhoton}
                  className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 active:scale-95 transition flex flex-col items-center gap-2"
                >
                  <Sun className="w-8 h-8 text-amber-400 animate-pulse" />
                  <span className="font-bold text-amber-300 text-sm">Capturar Fotón Solar</span>
                  <span className="text-xs text-amber-200/70 font-mono">Luz ({photonsCollected}/3)</span>
                </button>

                <button
                  onClick={handleCollectCO2}
                  className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 active:scale-95 transition flex flex-col items-center gap-2"
                >
                  <div className="w-8 h-8 rounded-full border border-cyan-400 flex items-center justify-center font-bold text-cyan-300 text-xs">
                    CO₂
                  </div>
                  <span className="font-bold text-cyan-300 text-sm">Absorber CO₂</span>
                  <span className="text-xs text-cyan-200/70 font-mono">Dióxido ({co2Collected}/3)</span>
                </button>
              </div>

              {/* Progress of Glucose */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Glucosa Sintetizada:
                  </span>
                  <span className="font-mono text-emerald-300 font-bold">{glucoseProduced} / 3 C₆H₁₂O₆</span>
                </div>
                <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                    style={{ width: `${(glucoseProduced / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {type === 'turgor' && (
            <div className="space-y-5 text-center">
              <p className="text-sm text-slate-300">
                Mantén la presión de turgencia en la <strong>zona óptima verde</strong> durante 6 segundos suministrando agua contra la transpiración.
              </p>

              {/* Plant Visual State Indicator */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-center gap-3 transition-colors ${
                  turgorStatus === 'optimal'
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                    : turgorStatus === 'plasmolyzed'
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-300'
                    : 'bg-red-950/40 border-red-500/60 text-red-300'
                }`}
              >
                <div className="text-2xl">
                  {turgorStatus === 'optimal' && '🌿'}
                  {turgorStatus === 'plasmolyzed' && '🥀'}
                  {turgorStatus === 'burst' && '⚠️'}
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm">
                    {turgorStatus === 'optimal' && 'Estado: ¡Turgente y Firme!'}
                    {turgorStatus === 'plasmolyzed' && 'Estado: ¡Marchita por falta de agua!'}
                    {turgorStatus === 'burst' && 'Estado: ¡Peligro de sobrepresión!'}
                  </div>
                  <div className="text-xs opacity-80">
                    Tiempo en equilibrio: {holdTimer} / 6 segundos
                  </div>
                </div>
              </div>

              {/* Water Level Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Marchitez</span>
                  <span className="text-emerald-400 font-bold">Zona Óptima (40%-75%)</span>
                  <span>Exceso</span>
                </div>
                <div className="relative h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div className="absolute inset-y-0 left-[35%] right-[25%] bg-emerald-500/20 border-x border-emerald-500/40" />
                  <div
                    className="h-full bg-cyan-400 transition-all duration-150 rounded-full"
                    style={{ width: `${waterLevel}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setWaterLevel((prev) => Math.min(100, prev + 12));
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-98 font-bold text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Droplets className="w-5 h-5 animate-pulse" />
                Bombear Agua a la Vacuola (+12%)
              </button>
            </div>
          )}

          {type === 'protein' && (
            <div className="space-y-5">
              <p className="text-sm text-slate-300 text-center">
                Traduce el mensaje genético leyendo el codón activo del ARNm y seleccionando el aminoácido correcto para la cadena:
              </p>

              {/* mRNA Strand */}
              <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 flex justify-center gap-3">
                {codonSequence.map((c, i) => (
                  <div
                    key={i}
                    className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold border transition-all ${
                      i === currentCodonIdx
                        ? 'bg-purple-600 text-white border-purple-400 scale-110 shadow-lg ring-2 ring-purple-400/50'
                        : i < currentCodonIdx
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600/50'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    {c}
                  </div>
                ))}
              </div>

              {/* Peptide Chain */}
              <div className="text-xs text-slate-400 flex items-center gap-2 flex-wrap min-h-[32px]">
                <span className="font-semibold text-slate-300">Proteína naciente:</span>
                {peptideChain.map((p, i) => (
                  <span
                    key={i}
                    className="bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {p}
                  </span>
                ))}
              </div>

              {/* Choices */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {Object.entries(aminoMap).map(([codon, amino]) => (
                  <button
                    key={codon}
                    onClick={() => handleSelectAmino(codon)}
                    className="p-3 rounded-xl bg-slate-800 border border-slate-700 hover:border-purple-400 hover:bg-slate-750 active:scale-95 transition text-left"
                  >
                    <div className="font-mono text-purple-300 text-xs font-bold">{codon}</div>
                    <div className="text-sm font-medium text-white">{amino}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {type === 'sorter' && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-slate-300">
                La pared celular vegetal está compuesta por fibras de celulosa cruzadas. Refuerza los enlaces de celulosa para proteger la célula contra la presión:
              </p>
              <div className="grid grid-cols-3 gap-2 py-2">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playSuccess();
                      if (idx === 6) setTimeout(() => onComplete(150), 400);
                    }}
                    className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-600/30 text-emerald-300 font-bold active:scale-95 transition"
                  >
                    🌾 Enlace {idx}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Volver a la Expedición
          </button>
        </div>
      </div>
    </div>
  );
};
