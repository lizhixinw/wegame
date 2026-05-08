export type WeaponType = 'rifle' | 'spread' | 'laser' | 'machinegun' | 'flame';

export type EnemyType = 'soldier' | 'turret' | 'flyer' | 'tank' | 'boss';

export type PickupType = 'weapon_spread' | 'weapon_laser' | 'weapon_machinegun' | 'weapon_flame' | 'health' | 'shield' | 'bomb';

export type GamePhase = 'menu' | 'playing' | 'gameover';

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  lives: number;
  score: number;
  weapon: WeaponType;
  onGround: boolean;
  facingRight: boolean;
  isCrouching: boolean;
  invincibleTimer: number;
  shootCooldown: number;
  animFrame: number;
  animTimer: number;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  damage: number;
  type: WeaponType;
  fromPlayer: boolean;
  life: number;
  piercing: boolean;
}

export interface Enemy {
  id: number;
  type: EnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  shootTimer: number;
  shootInterval: number;
  facingRight: boolean;
  isBoss: boolean;
  active: boolean;
  animFrame: number;
  animTimer: number;
  patrolDir: number;
  patrolTimer: number;
  onGround: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'bridge' | 'moving';
  isMoving: boolean;
  moveRange: number;
  moveSpeed: number;
  moveDir: number;
  originX: number;
}

export interface Pickup {
  id: number;
  type: PickupType;
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  bobTimer: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface Camera {
  x: number;
  y: number;
  shake: number;
  shakeX: number;
  shakeY: number;
}

export interface LevelData {
  width: number;
  height: number;
  name: string;
  bgColor1: string;
  bgColor2: string;
  groundColor: string;
  platforms: Platform[];
  enemySpawns: { type: EnemyType; x: number; y: number; isBoss: boolean }[];
  pickupSpawns: { type: PickupType; x: number; y: number }[];
  bossTriggerX: number;
}

export interface GameState {
  player: Player;
  bullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  pickups: Pickup[];
  camera: Camera;
  level: LevelData;
  levelIndex: number;
  score: number;
  kills: number;
  phase: 'playing' | 'dying' | 'levelComplete' | 'gameover';
  screenFlash: number;
  bulletIdCounter: number;
  enemyIdCounter: number;
  pickupIdCounter: number;
  deathTimer: number;
  levelCompleteTimer: number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  shoot: boolean;
}

export interface ScoreRecord {
  highestScore: number;
  highestLevel: number;
  totalGames: number;
}
