export enum TileType {
  Wall = 0,
  Floor = 1,
  Corridor = 2,
  Door = 3,
  StairsDown = 4,
}

export interface Tile {
  type: TileType;
  walkable: boolean;
  transparent: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Player {
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  level: number;
  exp: number;
  expToNext: number;
  floor: number;
  score: number;
  x: number;
  y: number;
  visionRange: number;
  inventory: InventoryItem[];
  weapon: Equippable | null;
  armor: Equippable | null;
}

export type AIType = 'patrol' | 'chase' | 'ranged';

export interface Enemy {
  id: string;
  type: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  expReward: number;
  aiType: AIType;
  x: number;
  y: number;
  isBoss: boolean;
  color: string;
  symbol: string;
  patrolDir: number;
  patrolCounter: number;
}

export type ItemType = 'potion' | 'scroll' | 'weapon' | 'armor';

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  effect: string;
  value: number;
  x: number;
  y: number;
  picked: boolean;
  symbol: string;
  color: string;
}

export interface InventoryItem {
  id: string;
  type: ItemType;
  name: string;
  effect: string;
  value: number;
  symbol: string;
  color: string;
}

export interface Equippable {
  name: string;
  attack?: number;
  defense?: number;
  symbol: string;
  color: string;
}

export interface DungeonMap {
  width: number;
  height: number;
  floor: number;
  tiles: TileType[][];
  explored: boolean[][];
  visible: boolean[][];
  rooms: Room[];
}

export interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface Message {
  id: number;
  text: string;
  color: string;
  turn: number;
}

export type GamePhase = 'menu' | 'playing' | 'gameover';

export interface ScoreRecord {
  highestFloor: number;
  highestScore: number;
  totalGames: number;
}

export interface GameState {
  player: Player;
  enemies: Enemy[];
  items: Item[];
  map: DungeonMap;
  messages: Message[];
  phase: GamePhase;
  turn: number;
  messageIdCounter: number;
  kills: number;
}
