export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}

export interface OrganelleInfo {
  id: string;
  name: string;
  scientificName: string;
  imageLabel: string; // label as seen in reference image
  category: 'membrana' | 'energetico' | 'genetico' | 'sintesis' | 'almacenamiento' | 'metabolico';
  position: [number, number, number]; // 3D coordinates in the cell
  cameraFocus: [number, number, number]; // target look-at
  cameraPosition: [number, number, number]; // optimal camera pos for inspecting
  badgeIcon: string;
  summary: string;
  detailedDescription: string;
  analogy: string; // real-world analogy (e.g. Planta de energía solar)
  curiousFact: string; // dato curioso para estudiantes
  isExclusiveToPlants: boolean; // ¿exclusivo o distintivo de células vegetales?
  keyFunctions: string[];
  questions: QuizQuestion[];
  miniGameType?: 'photosynthesis' | 'turgor' | 'protein' | 'sorter';
}

export interface PlayerStats {
  score: number;
  maxScore: number;
  completedCheckpoints: string[];
  currentCheckpointIndex: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  miniGamesWon: number;
  startTime: number;
  finishTime?: number;
}

export type ViewMode = 'orbit' | 'nanobot' | 'vr-stereo';
