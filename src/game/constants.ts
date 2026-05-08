export const MAP_WIDTH = 60;
export const MAP_HEIGHT = 40;
export const TILE_SIZE = 20;
export const VISION_RANGE = 8;
export const MAX_INVENTORY = 8;
export const MIN_ROOM_SIZE = 5;
export const MAX_ROOM_SIZE = 12;
export const ROOM_PADDING = 2;

export const PLAYER_BASE_HP = 30;
export const PLAYER_BASE_ATTACK = 5;
export const PLAYER_BASE_DEFENSE = 2;
export const PLAYER_HP_PER_LEVEL = 5;
export const PLAYER_ATK_PER_LEVEL = 2;
export const PLAYER_DEF_PER_LEVEL = 1;

export const EXP_BASE = 20;
export const EXP_GROWTH = 1.5;

export const ENEMY_TEMPLATES: Record<string, {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  expReward: number;
  aiType: 'patrol' | 'chase' | 'ranged';
  color: string;
  symbol: string;
  minFloor: number;
}> = {
  rat: { name: '巨鼠', hp: 8, attack: 3, defense: 0, expReward: 5, aiType: 'patrol', color: '#8B7355', symbol: 'r', minFloor: 1 },
  bat: { name: '蝙蝠', hp: 6, attack: 4, defense: 0, expReward: 6, aiType: 'patrol', color: '#696969', symbol: 'b', minFloor: 1 },
  skeleton: { name: '骷髅', hp: 15, attack: 6, defense: 2, expReward: 12, aiType: 'chase', color: '#D3D3D3', symbol: 's', minFloor: 2 },
  goblin: { name: '哥布林', hp: 12, attack: 5, defense: 1, expReward: 10, aiType: 'chase', color: '#228B22', symbol: 'g', minFloor: 2 },
  orc: { name: '兽人', hp: 25, attack: 8, defense: 3, expReward: 20, aiType: 'chase', color: '#556B2F', symbol: 'O', minFloor: 3 },
  mage: { name: '暗影法师', hp: 14, attack: 10, defense: 1, expReward: 18, aiType: 'ranged', color: '#8A2BE2', symbol: 'm', minFloor: 4 },
  demon: { name: '恶魔', hp: 35, attack: 12, defense: 5, expReward: 30, aiType: 'chase', color: '#DC143C', symbol: 'D', minFloor: 5 },
};

export const BOSS_TEMPLATES: Record<number, {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  expReward: number;
  color: string;
  symbol: string;
}> = {
  5: { name: '骷髅王', hp: 60, attack: 10, defense: 5, expReward: 80, color: '#FFD700', symbol: 'K' },
  10: { name: '暗影领主', hp: 100, attack: 15, defense: 8, expReward: 150, color: '#FF4500', symbol: 'L' },
  15: { name: '深渊魔王', hp: 150, attack: 20, defense: 12, expReward: 250, color: '#8B0000', symbol: 'B' },
};

export const ITEM_TEMPLATES: {
  type: 'potion' | 'scroll' | 'weapon' | 'armor';
  name: string;
  effect: string;
  value: number;
  symbol: string;
  color: string;
  minFloor: number;
  weight: number;
}[] = [
  { type: 'potion', name: '治疗药水', effect: 'heal', value: 15, symbol: '!', color: '#2d6a4f', minFloor: 1, weight: 40 },
  { type: 'potion', name: '力量药水', effect: 'strength', value: 3, symbol: '!', color: '#e94560', minFloor: 3, weight: 15 },
  { type: 'scroll', name: '火球卷轴', effect: 'fireball', value: 20, symbol: '?', color: '#FF6347', minFloor: 2, weight: 20 },
  { type: 'scroll', name: '传送卷轴', effect: 'teleport', value: 0, symbol: '?', color: '#9370DB', minFloor: 2, weight: 15 },
  { type: 'weapon', name: '铁剑', effect: 'weapon', value: 3, symbol: '/', color: '#C0C0C0', minFloor: 1, weight: 20 },
  { type: 'weapon', name: '精钢长剑', effect: 'weapon', value: 6, symbol: '/', color: '#4169E1', minFloor: 3, weight: 10 },
  { type: 'weapon', name: '暗影之刃', effect: 'weapon', value: 10, symbol: '/', color: '#8A2BE2', minFloor: 5, weight: 5 },
  { type: 'armor', name: '皮甲', effect: 'armor', value: 2, symbol: '[', color: '#8B4513', minFloor: 1, weight: 20 },
  { type: 'armor', name: '锁子甲', effect: 'armor', value: 4, symbol: '[', color: '#708090', minFloor: 3, weight: 10 },
  { type: 'armor', name: '暗影铠甲', effect: 'armor', value: 7, symbol: '[', color: '#4B0082', minFloor: 5, weight: 5 },
];

export const TILE_COLORS = {
  [0]: '#1a1a2e',
  [1]: '#3a3a5c',
  [2]: '#2a2a4a',
  [3]: '#4a3a2a',
  [4]: '#c9a227',
};

export const WALL_COLOR = '#1a1a2e';
export const FLOOR_COLOR = '#3a3a5c';
export const CORRIDOR_COLOR = '#2a2a4a';
export const DOOR_COLOR = '#4a3a2a';
export const STAIRS_COLOR = '#c9a227';
export const EXPLORED_DARK = '#0d0d1a';
export const FOG_COLOR = '#0a0a14';
export const PLAYER_COLOR = '#4fc3f7';
export const PLAYER_SYMBOL = '@';
