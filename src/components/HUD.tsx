import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Layers,
  HelpCircle,
  Award,
  BookOpen,
  Eye,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Tag
} from 'lucide-react';
import { OrganelleInfo, ViewMode } from '../types/cell';
import { sound } from '../utils/audio';

interface HUDProps {
  score: number;
  completedCheckpoints: string[];
  totalCheckpoints: number;
  currentCheckpoint: OrganelleInfo;
  viewMode: ViewMode;
  onSetViewMode: (mode: ViewMode) => void;
  explodedOffset: number;
  onSetExplodedOffset: (val: number) => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  onOpenCheckpointModal: () => void;
  onPrevCheckpoint: () => void;
  onNextCheckpoint: () => void;
  onOpenComparison: () => void;
  onOpenCertificate: () => void;
  onOpenHelp: () => void;
  organellesList: OrganelleInfo[];
  onSelectOrganelle: (org: OrganelleInfo) => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  completedCheckpoints,
  totalCheckpoints,
  currentCheckpoint,
  viewMode,
  onSetViewMode,
  explodedOffset,
  onSetExplodedOffset,
  showLabels,
  onToggleLabels,
  onOpenCheckpointModal,
  onPrevCheckpoint,
  onNextCheckpoint,
  onOpenComparison,
  onOpenCertificate,
  onOpenHelp,
  organellesList,
  onSelectOrganelle
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  const progressPercent = Math.round((completedCheckpoints.length / totalCheckpoints) * 100);

  return (
    <>
      {/* ==================================================== */}
      {/* TOP HEADER BAR */}
      {/* ==================================================== */}
      <header className="absolute top-0 inset-x-0 z-30 p-2 sm:p-4 pointer-events-none flex items-start justify-between">
        {/* Left: Branding & Mission Info */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-slate-900/85 backdrop-blur-md border border-emerald-500/30 p-2 sm:px-3 sm:py-2 rounded-2xl shadow-xl">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <span className="text-xl">🔬</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm font-extrabold text-white tracking-wider font-mono">
                CÉLULA VEGETAL VR
              </h1>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded hidden sm:inline-block">
                3D EXPEDITION
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <span className="text-emerald-400 font-semibold">
                Progreso: {completedCheckpoints.length}/{totalCheckpoints}
              </span>
              <div className="w-16 sm:w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden inline-block">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Score, Controls & Extra Modals */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Score Badge */}
          <div className="bg-slate-900/85 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{score} XP</span>
          </div>

          {/* Plant vs Animal Comparison */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenComparison();
            }}
            className="p-2 sm:px-3 sm:py-1.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 shadow-xl transition flex items-center gap-1.5 text-xs font-medium"
            title="Comparativa Célula Vegetal vs Animal"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Vegetal vs Animal</span>
          </button>

          {/* Certificate button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCertificate();
            }}
            className={`p-2 sm:px-3 sm:py-1.5 rounded-2xl backdrop-blur-md border shadow-xl transition flex items-center gap-1.5 text-xs font-semibold ${
              completedCheckpoints.length >= totalCheckpoints
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-amber-500/30 animate-pulse'
                : 'bg-slate-900/85 text-slate-200 border-slate-700 hover:border-amber-400/50 hover:text-amber-300'
            }`}
            title="Certificado de Aprendizaje"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline">Certificado</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-white transition shadow-xl"
            title={soundEnabled ? 'Silenciar efectos' : 'Activar efectos'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Navigation Guide / Help */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenHelp();
            }}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700 text-slate-300 hover:text-emerald-300 transition shadow-xl"
            title="Ayuda y Controles VR"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ==================================================== */}
      {/* FLOATING ACTIVE CHECKPOINT BANNER */}
      {/* ==================================================== */}
      <div className="absolute top-16 sm:top-20 inset-x-0 z-20 pointer-events-none flex justify-center px-4">
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3 sm:px-4 sm:py-2.5 shadow-2xl max-w-lg w-full flex items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-300">
          <button
            onClick={() => {
              sound.playClick();
              onPrevCheckpoint();
            }}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition shrink-0"
            title="Orgánulo anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            onClick={onOpenCheckpointModal}
            className="cursor-pointer flex-1 text-center group"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                Checkpoint Activo:
              </span>
              <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                {currentCheckpoint.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md mx-auto mt-0.5">
              Etiqueta de referencia: {currentCheckpoint.imageLabel} — Clic para abrir ficha y preguntas
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onOpenCheckpointModal}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition hidden sm:inline-block"
            >
              Responder Desafío
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onNextCheckpoint();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Orgánulo siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* BOTTOM TOOLBAR & VIEW MODES */}
      {/* ==================================================== */}
      <footer className="absolute bottom-3 inset-x-3 sm:inset-x-6 z-30 pointer-events-none flex flex-col gap-2">
        {/* Drawer for Organs Quick Selector */}
        {showDrawer && (
          <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-3 shadow-2xl max-w-3xl mx-auto w-full max-h-48 overflow-y-auto animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Selector Rápido de Orgánulos ({organellesList.length})</span>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-slate-500 hover:text-white"
              >
                ✕ Cerrar
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
              {organellesList.map((org) => {
                const isCurrent = org.id === currentCheckpoint.id;
                const isDone = completedCheckpoints.includes(org.id);
                return (
                  <button
                    key={org.id}
                    onClick={() => {
                      sound.playClick();
                      onSelectOrganelle(org);
                      setShowDrawer(false);
                    }}
                    className={`p-2 rounded-xl text-left border text-xs transition flex flex-col justify-between ${
                      isCurrent
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                        : isDone
                        ? 'bg-slate-800/80 border-emerald-600/40 text-slate-200'
                        : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-medium truncate">{org.name}</div>
                    <div className="text-[10px] text-slate-400 truncate mt-0.5">
                      {isDone ? '✓ Superado' : org.imageLabel}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom controls row */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2.5 sm:px-4 sm:py-3 shadow-2xl max-w-4xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
          {/* Left: View Mode Pills */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                sound.playClick();
                onSetViewMode('orbit');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                viewMode === 'orbit'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Órbita 3D</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSetViewMode('nanobot');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                viewMode === 'nanobot'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Navegación primera persona dentro de la célula"
            >
              <span>🚀 Nanobot VR</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onSetViewMode('vr-stereo');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                viewMode === 'vr-stereo'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Pantalla dividida para lentes Cardboard o visor VR"
            >
              <span>🕶️ Lentes VR</span>
            </button>
          </div>

          {/* Middle: Exploded View (Despiece) Slider */}
          <div className="flex items-center gap-2 text-xs bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium hidden sm:inline">Despiece Superior:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={explodedOffset}
              onChange={(e) => onSetExplodedOffset(parseFloat(e.target.value))}
              className="w-20 sm:w-28 accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
              title="Separar tapa transparente como en la imagen"
            />
            <span className="font-mono text-emerald-400 text-[11px] w-8">
              {Math.round(explodedOffset * 100)}%
            </span>
          </div>

          {/* Right: Labels toggle & Organs drawer */}
          <div className="flex items-center gap-1.5">
            {/* Show labels button */}
            <button
              onClick={() => {
                sound.playClick();
                onToggleLabels();
              }}
              className={`p-2 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                showLabels
                  ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Mostrar u ocultar los nombres como en el diagrama"
            >
              <Tag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Etiquetas</span>
            </button>

            {/* Organelles list drawer toggle */}
            <button
              onClick={() => {
                sound.playClick();
                setShowDrawer(!showDrawer);
              }}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 hover:text-emerald-300 text-xs font-medium transition flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Ver Orgánulos</span>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};
