import { useState, useCallback } from 'react';
import { Cell3DView } from './components/Cell3DView';
import { HUD } from './components/HUD';
import { CheckpointModal } from './components/CheckpointModal';
import { MiniGames } from './components/MiniGames';
import { CellComparisonModal } from './components/CellComparisonModal';
import { CertificateModal } from './components/CertificateModal';
import { VRControlsHelp } from './components/VRControlsHelp';
import { ORGANELLES } from './data/organellesData';
import { OrganelleInfo, ViewMode } from './types/cell';
import { sound } from './utils/audio';
import { Compass, Sparkles, Award } from 'lucide-react';

export function App() {
  // Game Progression State
  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState(0);
  const [completedCheckpoints, setCompletedCheckpoints] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  // 3D Visualization Controls
  const [viewMode, setViewMode] = useState<ViewMode>('orbit');
  const [explodedOffset, setExplodedOffset] = useState<number>(0.45); // default exploded elevation matching diagram
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [highlightedOrganelleId, setHighlightedOrganelleId] = useState<string | null>(null);

  // Modals
  const [isCheckpointModalOpen, setIsCheckpointModalOpen] = useState(false);
  const [isMiniGameOpen, setIsMiniGameOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const currentCheckpoint = ORGANELLES[currentCheckpointIndex];

  // Navigation handlers
  const handleSelectOrganelle = useCallback((org: OrganelleInfo) => {
    const idx = ORGANELLES.findIndex((o) => o.id === org.id);
    if (idx !== -1) {
      setCurrentCheckpointIndex(idx);
      setHighlightedOrganelleId(org.id);
      setIsCheckpointModalOpen(true);
    }
  }, []);

  const handleNextCheckpoint = useCallback(() => {
    const nextIdx = (currentCheckpointIndex + 1) % ORGANELLES.length;
    setCurrentCheckpointIndex(nextIdx);
    setHighlightedOrganelleId(ORGANELLES[nextIdx].id);
    sound.playWarp();
  }, [currentCheckpointIndex]);

  const handlePrevCheckpoint = useCallback(() => {
    const prevIdx = (currentCheckpointIndex - 1 + ORGANELLES.length) % ORGANELLES.length;
    setCurrentCheckpointIndex(prevIdx);
    setHighlightedOrganelleId(ORGANELLES[prevIdx].id);
    sound.playWarp();
  }, [currentCheckpointIndex]);

  const handleAnswerQuestion = (_isCorrect: boolean, points: number) => {
    setScore((prev) => prev + points);
    if (!completedCheckpoints.includes(currentCheckpoint.id)) {
      const updated = [...completedCheckpoints, currentCheckpoint.id];
      setCompletedCheckpoints(updated);
      if (updated.length === ORGANELLES.length) {
        setTimeout(() => setIsCertificateOpen(true), 1200);
      }
    }
  };

  const handleMiniGameComplete = (bonusPoints: number) => {
    setScore((prev) => prev + bonusPoints);
    setIsMiniGameOpen(false);
    if (!completedCheckpoints.includes(currentCheckpoint.id)) {
      const updated = [...completedCheckpoints, currentCheckpoint.id];
      setCompletedCheckpoints(updated);
      if (updated.length === ORGANELLES.length) {
        setTimeout(() => setIsCertificateOpen(true), 1200);
      }
    }
  };

  const handleRestartMission = () => {
    setScore(0);
    setCompletedCheckpoints([]);
    setCurrentCheckpointIndex(0);
    setIsCertificateOpen(false);
    sound.playWarp();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 3D WebGL Canvas */}
      <Cell3DView
        currentCheckpointId={currentCheckpoint.id}
        viewMode={viewMode}
        explodedOffset={explodedOffset}
        onSelectOrganelle={handleSelectOrganelle}
        showLabels={showLabels}
        highlightedOrganelleId={highlightedOrganelleId}
      />

      {/* Heads Up Display */}
      <HUD
        score={score}
        completedCheckpoints={completedCheckpoints}
        totalCheckpoints={ORGANELLES.length}
        currentCheckpoint={currentCheckpoint}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
        explodedOffset={explodedOffset}
        onSetExplodedOffset={setExplodedOffset}
        showLabels={showLabels}
        onToggleLabels={() => setShowLabels(!showLabels)}
        onOpenCheckpointModal={() => setIsCheckpointModalOpen(true)}
        onPrevCheckpoint={handlePrevCheckpoint}
        onNextCheckpoint={handleNextCheckpoint}
        onOpenComparison={() => setIsComparisonOpen(true)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        organellesList={ORGANELLES}
        onSelectOrganelle={handleSelectOrganelle}
      />

      {/* Checkpoint Detail & Quiz Modal */}
      {isCheckpointModalOpen && (
        <CheckpointModal
          organelle={currentCheckpoint}
          checkpointNumber={currentCheckpointIndex + 1}
          totalCheckpoints={ORGANELLES.length}
          isCompleted={completedCheckpoints.includes(currentCheckpoint.id)}
          onAnswerQuestion={handleAnswerQuestion}
          onOpenMiniGame={currentCheckpoint.miniGameType ? () => setIsMiniGameOpen(true) : undefined}
          onNextCheckpoint={handleNextCheckpoint}
          onPrevCheckpoint={handlePrevCheckpoint}
          onClose={() => setIsCheckpointModalOpen(false)}
        />
      )}

      {/* Mini-Games Interactive Laboratory */}
      {isMiniGameOpen && currentCheckpoint.miniGameType && (
        <MiniGames
          type={currentCheckpoint.miniGameType}
          onComplete={handleMiniGameComplete}
          onClose={() => setIsMiniGameOpen(false)}
        />
      )}

      {/* Comparison Modal */}
      {isComparisonOpen && (
        <CellComparisonModal onClose={() => setIsComparisonOpen(false)} />
      )}

      {/* Certificate Modal */}
      {isCertificateOpen && (
        <CertificateModal
          score={score}
          totalCheckpoints={ORGANELLES.length}
          completedCount={completedCheckpoints.length}
          onClose={() => setIsCertificateOpen(false)}
          onRestart={handleRestartMission}
        />
      )}

      {/* Controls & VR Help */}
      {isHelpOpen && <VRControlsHelp onClose={() => setIsHelpOpen(false)} />}

      {/* Welcome & Mission Briefing Modal (Shown once at start) */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 text-center shadow-2xl relative space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-500/20">
              🌿
            </div>

            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400">
                Misión Educativa de Secundaria
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                Expedición VR: La Célula Vegetal
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Navega en 3D a través de la célula vegetal inspirada en el diagrama seccionado. Descubre cada orgánulo, supera los checkpoints y obtén tu Certificado de Biólogo Celular.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs text-left">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-bold text-emerald-300 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5" /> 12 Checkpoints
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Conoce pared celular, vacuola, cloroplastos y más.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Desafíos
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Preguntas didácticas con retroalimentación instantánea.
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="font-bold text-cyan-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Diploma
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Certificado oficial imprimible al completar la misión.
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playSuccess();
                  setShowWelcome(false);
                  setIsCheckpointModalOpen(true);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/30 transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                ¡Comenzar la Expedición Celular! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
