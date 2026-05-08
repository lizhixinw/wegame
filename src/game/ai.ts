import { Enemy, Player, TileType, Message, Position } from './types';
import { MAP_WIDTH, MAP_HEIGHT } from './constants';

const DIRS: Position[] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

function isWalkable(tiles: TileType[][], x: number, y: number): boolean {
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
  return tiles[y][x] !== TileType.Wall;
}

function hasEnemyAt(enemies: Enemy[], x: number, y: number, excludeId?: string): boolean {
  return enemies.some(e => e.hp > 0 && e.x === x && e.y === y && e.id !== excludeId);
}

function distance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function movePatrol(enemy: Enemy, tiles: TileType[][], enemies: Enemy[]): Position {
  const dir = DIRS[enemy.patrolDir];
  const nx = enemy.x + dir.x;
  const ny = enemy.y + dir.y;

  enemy.patrolCounter++;
  if (enemy.patrolCounter >= 3) {
    enemy.patrolCounter = 0;
    enemy.patrolDir = Math.floor(Math.random() * 4);
  }

  if (isWalkable(tiles, nx, ny) && !hasEnemyAt(enemies, nx, ny, enemy.id)) {
    return { x: nx, y: ny };
  }

  enemy.patrolDir = Math.floor(Math.random() * 4);
  return { x: enemy.x, y: enemy.y };
}

function moveChase(enemy: Enemy, player: Player, tiles: TileType[][], enemies: Enemy[]): Position {
  const dist = distance(enemy.x, enemy.y, player.x, player.y);

  if (dist <= 1) {
    return { x: enemy.x, y: enemy.y };
  }

  let bestPos: Position = { x: enemy.x, y: enemy.y };
  let bestDist = dist;

  for (const dir of DIRS) {
    const nx = enemy.x + dir.x;
    const ny = enemy.y + dir.y;
    if (isWalkable(tiles, nx, ny) && !hasEnemyAt(enemies, nx, ny, enemy.id)) {
      const d = distance(nx, ny, player.x, player.y);
      if (d < bestDist) {
        bestDist = d;
        bestPos = { x: nx, y: ny };
      }
    }
  }

  return bestPos;
}

function moveRanged(enemy: Enemy, player: Player, tiles: TileType[][], enemies: Enemy[]): Position {
  const dist = distance(enemy.x, enemy.y, player.x, player.y);

  if (dist <= 2) {
    let bestPos: Position = { x: enemy.x, y: enemy.y };
    let bestDist = dist;
    for (const dir of DIRS) {
      const nx = enemy.x + dir.x;
      const ny = enemy.y + dir.y;
      if (isWalkable(tiles, nx, ny) && !hasEnemyAt(enemies, nx, ny, enemy.id)) {
        const d = distance(nx, ny, player.x, player.y);
        if (d > bestDist) {
          bestDist = d;
          bestPos = { x: nx, y: ny };
        }
      }
    }
    return bestPos;
  }

  if (dist > 5) {
    return moveChase(enemy, player, tiles, enemies);
  }

  return { x: enemy.x, y: enemy.y };
}

export function processEnemyTurn(
  enemy: Enemy,
  player: Player,
  tiles: TileType[][],
  enemies: Enemy[],
  messageIdCounter: number
): {
  enemy: Enemy;
  attacked: boolean;
  messages: Message[];
  newIdCounter: number;
} {
  if (enemy.hp <= 0) {
    return { enemy, attacked: false, messages: [], newIdCounter: messageIdCounter };
  }

  const dist = distance(enemy.x, enemy.y, player.x, player.y);
  const messages: Message[] = [];

  if (dist <= 1 && enemy.aiType !== 'ranged') {
    return { enemy, attacked: true, messages, newIdCounter: messageIdCounter };
  }

  if (enemy.aiType === 'ranged' && dist <= 5 && dist > 1) {
    return { enemy, attacked: true, messages, newIdCounter: messageIdCounter };
  }

  let newPos: Position;
  const chaseRange = enemy.aiType === 'chase' ? 10 : 6;

  if (dist <= chaseRange) {
    switch (enemy.aiType) {
      case 'chase':
        newPos = moveChase(enemy, player, tiles, enemies);
        break;
      case 'ranged':
        newPos = moveRanged(enemy, player, tiles, enemies);
        break;
      default:
        newPos = movePatrol(enemy, tiles, enemies);
    }
  } else {
    newPos = movePatrol(enemy, tiles, enemies);
  }

  const newEnemy = { ...enemy, x: newPos.x, y: newPos.y };

  const newDist = distance(newEnemy.x, newEnemy.y, player.x, player.y);
  if (newDist <= 1 && enemy.aiType !== 'ranged') {
    return { enemy: newEnemy, attacked: true, messages, newIdCounter: messageIdCounter };
  }

  return { enemy: newEnemy, attacked: false, messages, newIdCounter: messageIdCounter };
}
