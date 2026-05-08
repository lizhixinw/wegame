import { create } from 'zustand';
import { GamePhase, ScoreRecord, WeaponType } from '../game/types';

interface HUDData {
  hp: number;
  maxHp: number;
  lives: number;
  score: number;
  kills: number;
  weapon: WeaponType;
  levelName: string;
  levelIndex: number;
}

interface GameStore {
  phase: GamePhase;
  hud: HUDData;
  startGame: () => void;
  setPhase: (phase: GamePhase) => void;
  updateHUD: (data: Partial<HUDData>) => void;
}

const defaultHUD: HUDData = {
  hp: 3,
  maxHp: 3,
  lives: 3,
  score: 0,
  kills: 0,
  weapon: 'rifle',
  levelName: '丛林基地',
  levelIndex: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  phase: 'menu',
  hud: { ...defaultHUD },
  startGame: () => set({ phase: 'playing', hud: { ...defaultHUD } }),
  setPhase: (phase) => set({ phase }),
  updateHUD: (data) => set((state) => ({ hud: { ...state.hud, ...data } })),
}));

export function saveScore(score: number, level: number): void {
  try {
    const stored = localStorage.getItem('shadowStrikeScores');
    const record: ScoreRecord = stored ? JSON.parse(stored) : { highestScore: 0, highestLevel: 0, totalGames: 0 };
    record.highestScore = Math.max(record.highestScore, score);
    record.highestLevel = Math.max(record.highestLevel, level);
    record.totalGames++;
    localStorage.setItem('shadowStrikeScores', JSON.stringify(record));
  } catch { /* ignore */ }
}

export function loadScore(): ScoreRecord {
  try {
    const stored = localStorage.getItem('shadowStrikeScores');
    return stored ? JSON.parse(stored) : { highestScore: 0, highestLevel: 0, totalGames: 0 };
  } catch {
    return { highestScore: 0, highestLevel: 0, totalGames: 0 };
  }
}
