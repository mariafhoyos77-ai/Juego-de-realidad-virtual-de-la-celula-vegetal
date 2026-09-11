import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Download, Printer, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface CertificateModalProps {
  score: number;
  totalCheckpoints: number;
  completedCount: number;
  onClose: () => void;
  onRestart: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  score,
  totalCheckpoints,
  completedCount,
  onClose,
  onRestart
}) => {
  const [studentName, setStudentName] = useState('Estudiante Explorador');
  const [schoolName, setSchoolName] = useState('Colegio de Ciencias');
  const [todayDate] = useState(() => new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }));

  useEffect(() => {
    sound.playVictory();
    // Fire festive confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const accuracy = Math.min(100, Math.round((completedCount / totalCheckpoints) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-3xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-y-auto text-slate-100">
        {/* Certificate Display Area (Printable) */}
        <div id="printable-certificate" className="p-6 sm:p-10 bg-gradient-to-br from-slate-900 via-emerald-950/40 to-slate-900 border-b border-emerald-500/30 relative overflow-hidden">
          {/* Decorative Corner Borders */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-400 pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-400 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-400 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-400 pointer-events-none" />

          <div className="text-center space-y-4 max-w-xl mx-auto">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 shadow-lg">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-emerald-400 font-mono">
                ACADEMIA DE BIOLOGÍA CELULAR & CIENCIAS NATURALES
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                CERTIFICADO DE EXCELENCIA
              </h1>
              <p className="text-xs text-slate-300 mt-0.5">
                Expedición de Realidad Virtual: Célula Vegetal 3D
              </p>
            </div>

            <p className="text-xs text-slate-400">Se certifica con honores que:</p>

            {/* Editable Name */}
            <div className="py-1">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="text-xl sm:text-2xl font-bold text-center text-emerald-300 bg-emerald-950/40 border-b-2 border-emerald-400/60 focus:border-emerald-300 outline-none w-full max-w-md px-2 py-1"
                placeholder="Nombre del Estudiante"
              />
              <div className="mt-2">
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="text-xs text-center text-slate-400 bg-transparent border-b border-slate-700 focus:border-emerald-400 outline-none w-full max-w-xs"
                  placeholder="Institución Educativa / Colegio"
                />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed px-4">
              Ha explorado, analizado y superado satisfactoriamente los checkpoints y desafíos de aprendizaje sobre la estructura y funciones de los orgánulos de la <strong>Célula Vegetal</strong>: pared celular, cloroplastos, vacuola central, núcleo, endomembranas y metabolismo.
            </p>

            {/* Stats badges */}
            <div className="grid grid-cols-3 gap-3 pt-3">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[11px] text-slate-400">Puntaje Total</div>
                <div className="text-lg font-bold text-emerald-300 font-mono">{score} XP</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[11px] text-slate-400">Checkpoints</div>
                <div className="text-lg font-bold text-cyan-300 font-mono">
                  {completedCount} / {totalCheckpoints}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[11px] text-slate-400">Dominio Biológico</div>
                <div className="text-lg font-bold text-amber-300 font-mono">{accuracy}%</div>
              </div>
            </div>

            {/* Seal and Signatures */}
            <div className="pt-6 flex justify-between items-end border-t border-slate-800 text-[11px] text-slate-400">
              <div className="text-left">
                <div className="font-semibold text-slate-300">Fecha de Expedición</div>
                <div>{todayDate}</div>
              </div>

              {/* Digital Badge Stamp */}
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-400/60 flex flex-col items-center justify-center text-emerald-400 transform -rotate-12 bg-emerald-950/30">
                <span className="text-[9px] font-bold uppercase">APROBADO</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-[8px] font-mono">VERIFICADO</span>
              </div>

              <div className="text-right">
                <div className="border-b border-slate-600 pb-1 mb-1 font-mono text-slate-300">
                  Dra. Elena Silva
                </div>
                <div className="text-[10px] text-slate-400">Docente de Biología Celular</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <RotateCcw className="w-4 h-4" /> Reiniciar Misión
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Printer className="w-4 h-4" /> Imprimir Diploma
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-lg transition"
            >
              <Download className="w-4 h-4" /> Continuar Explorando 3D
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
