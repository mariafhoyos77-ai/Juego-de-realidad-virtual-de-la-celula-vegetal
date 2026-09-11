import React from 'react';
import { Check, X, Shield, Sun, Droplets, Info } from 'lucide-react';
import { sound } from '../utils/audio';

interface CellComparisonModalProps {
  onClose: () => void;
}

export const CellComparisonModal: React.FC<CellComparisonModalProps> = ({ onClose }) => {
  const comparisonItems = [
    {
      feature: 'Pared Celular (Celulosa)',
      plant: true,
      animal: false,
      detail: 'Otorga rigidez y forma poliédrica a la célula vegetal, resistiendo la turgencia.'
    },
    {
      feature: 'Cloroplastos y Fotosíntesis',
      plant: true,
      animal: false,
      detail: 'Permite a las plantas ser autótrofas (producir su propio alimento con luz solar).'
    },
    {
      feature: 'Gran Vacuola Central Única',
      plant: true,
      animal: false,
      detail: 'En plantas ocupa hasta el 90% del volumen. En animales son pequeñas y múltiples.'
    },
    {
      feature: 'Plasmodesmos',
      plant: true,
      animal: false,
      detail: 'Canales microscópicos que atraviesan la pared conectando el citoplasma de células vecinas.'
    },
    {
      feature: 'Membrana Plasmática',
      plant: true,
      animal: true,
      detail: 'Presente en ambas células como barrera semipermeable de fosfolípidos.'
    },
    {
      feature: 'Núcleo, RER, REL y Golgi',
      plant: true,
      animal: true,
      detail: 'Ambas son células eucariotas con sistema endomembranoso completo.'
    },
    {
      feature: 'Centriolos / Centrosoma con centriolos',
      plant: false,
      animal: true,
      detail: 'En la gran mayoría de plantas superiores están ausentes durante la división celular.'
    },
    {
      feature: 'Forma Celular Típica',
      plantText: 'Poliédrica / Rígida y geométrica',
      animalText: 'Redondeada o irregular y flexible',
      detail: 'Determinada por la presencia o ausencia de pared celular de celulosa.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Cuadro Comparativo: Célula Vegetal vs. Célula Animal
              </h2>
              <p className="text-xs text-slate-400">
                Puntos clave indispensables para exámenes escolares de biología
              </p>
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

        {/* Content Table */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs sm:text-sm">
          {/* Key Plant Distinctives Pills */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-xs">
              <Shield className="w-4 h-4 shrink-0" />
              <span>1. Pared Celular</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-xs">
              <Sun className="w-4 h-4 shrink-0 text-amber-400" />
              <span>2. Cloroplastos</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-xs">
              <Droplets className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>3. Vacuola Central</span>
            </div>
          </div>

          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/90 text-slate-400 border-b border-slate-800">
                  <th className="p-3">Característica / Estructura</th>
                  <th className="p-3 text-center text-emerald-400 font-bold">🌿 Célula Vegetal</th>
                  <th className="p-3 text-center text-sky-400 font-bold">🐾 Célula Animal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {comparisonItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-medium text-slate-200">
                      <div>{item.feature}</div>
                      <div className="text-[11px] text-slate-400 font-normal mt-0.5">{item.detail}</div>
                    </td>
                    <td className="p-3 text-center font-bold">
                      {typeof item.plant === 'boolean' ? (
                        item.plant ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-500">
                            <X className="w-4 h-4" />
                          </span>
                        )
                      ) : (
                        <span className="text-emerald-300">{item.plantText}</span>
                      )}
                    </td>
                    <td className="p-3 text-center font-bold">
                      {typeof item.animal === 'boolean' ? (
                        item.animal ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/20 text-sky-400">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-500">
                            <X className="w-4 h-4" />
                          </span>
                        )
                      ) : (
                        <span className="text-sky-300">{item.animalText}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition"
          >
            Entendido, volver a la Célula 3D
          </button>
        </div>
      </div>
    </div>
  );
};
