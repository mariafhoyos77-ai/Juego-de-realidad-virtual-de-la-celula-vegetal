import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Gamepad2,
  ChevronRight,
  ChevronLeft,
  BookOpen
} from 'lucide-react';
import { OrganelleInfo } from '../types/cell';
import { sound } from '../utils/audio';
import { speechGuide } from '../utils/tts';

interface CheckpointModalProps {
  organelle: OrganelleInfo;
  checkpointNumber: number;
  totalCheckpoints: number;
  isCompleted: boolean;
  onAnswerQuestion: (isCorrect: boolean, points: number) => void;
  onOpenMiniGame?: () => void;
  onNextCheckpoint: () => void;
  onPrevCheckpoint: () => void;
  onClose: () => void;
}

export const CheckpointModal: React.FC<CheckpointModalProps> = ({
  organelle,
  checkpointNumber,
  totalCheckpoints,
  isCompleted,
  onAnswerQuestion,
  onOpenMiniGame,
  onNextCheckpoint,
  onPrevCheckpoint,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'quiz'>('info');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  const currentQuestion = organelle.questions[0];

  const handleSpeak = () => {
    if (isSpeaking) {
      speechGuide.stop();
      setIsSpeaking(false);
    } else {
      const speechText = `${organelle.name}. ${organelle.summary}. Analogía: ${organelle.analogy}. ${organelle.curiousFact}`;
      speechGuide.speak(speechText, () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    const correct = idx === currentQuestion.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      sound.playSuccess();
      onAnswerQuestion(true, 100);
    } else {
      sound.playError();
      onAnswerQuestion(false, 20);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900/95 border border-emerald-500/30 rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Top Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-950/90 via-slate-900 to-slate-900 border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 font-bold font-mono">
              #{checkpointNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  {organelle.name}
                </h2>
                {isCompleted && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Completado
                  </span>
                )}
                {organelle.isExclusiveToPlants && (
                  <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300 bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 rounded-full hidden sm:inline-block">
                    🌿 Exclusivo Vegetal
                  </span>
                )}
              </div>
              <p className="text-xs text-emerald-300/80 font-mono">
                En el diagrama: <span className="text-emerald-300 font-semibold">{organelle.imageLabel}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Guide Narration Button */}
            <button
              onClick={handleSpeak}
              className={`p-2 rounded-xl border transition-all ${
                isSpeaking
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-emerald-300 hover:border-emerald-500/50'
              }`}
              title={isSpeaking ? 'Detener voz' : 'Escuchar explicación'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                speechGuide.stop();
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 px-5 bg-slate-950/40">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('info');
            }}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'info'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Ficha Científica & Analogía
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('quiz');
            }}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'quiz'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Desafío de Aprendizaje (+100 XP)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-sm">
          {activeTab === 'info' && (
            <>
              {/* Summary */}
              <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-slate-200 leading-relaxed">
                {organelle.detailedDescription}
              </div>

              {/* Analogy & Fun Fact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Analogy */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" /> Analogía de la vida real:
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{organelle.analogy}</p>
                </div>

                {/* Fun fact */}
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                    <Lightbulb className="w-3.5 h-3.5" /> ¿Sabías que...?
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{organelle.curiousFact}</p>
                </div>
              </div>

              {/* Key Functions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Funciones Biológicas Clave:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {organelle.keyFunctions.map((fn, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{fn}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini-Game Launcher if available */}
              {organelle.miniGameType && onOpenMiniGame && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-emerald-300 text-xs sm:text-sm flex items-center gap-1.5">
                      <Gamepad2 className="w-4 h-4 text-emerald-400" />
                      Mini-Laboratorio Interactivo Disponible
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      Pon a prueba el funcionamiento biológico en tiempo real y gana +150 XP.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      sound.playClick();
                      onOpenMiniGame();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition"
                  >
                    Jugar Mini-Reto
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'quiz' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                <div className="text-xs font-semibold text-emerald-400 mb-1">
                  Pregunta de Evaluación Escolar
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Hint button */}
              {currentQuestion.hint && !hasAnswered && (
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-amber-300/80 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20"
                  >
                    <Lightbulb className="w-3 h-3" /> {showHint ? 'Ocultar pista' : 'Ver pista didáctica'}
                  </button>
                </div>
              )}

              {showHint && !hasAnswered && (
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs">
                  💡 <strong>Pista:</strong> {currentQuestion.hint}
                </div>
              )}

              {/* Options */}
              <div className="space-y-2">
                {currentQuestion.options.map((opt, idx) => {
                  let btnStyle =
                    'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-slate-600';
                  if (hasAnswered) {
                    if (idx === currentQuestion.correctIndex) {
                      btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-semibold ring-2 ring-emerald-500/50';
                    } else if (idx === selectedOption) {
                      btnStyle = 'bg-red-950/80 border-red-400 text-red-200';
                    } else {
                      btnStyle = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {hasAnswered && idx === currentQuestion.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {hasAnswered && idx === selectedOption && idx !== currentQuestion.correctIndex && (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback box */}
              {hasAnswered && (
                <div
                  className={`p-4 rounded-xl border animate-in fade-in duration-200 ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5 mb-1">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" /> ¡Respuesta Correcta! (+100 XP)
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-amber-400" /> No exactamente. ¡Repasa la explicación! (+20 XP)
                      </>
                    )}
                  </div>
                  <p className="text-xs leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              speechGuide.stop();
              sound.playClick();
              onPrevCheckpoint();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          <span className="text-slate-500 font-mono">
            {checkpointNumber} / {totalCheckpoints} Checkpoints
          </span>

          <button
            onClick={() => {
              speechGuide.stop();
              sound.playClick();
              onNextCheckpoint();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md transition"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
