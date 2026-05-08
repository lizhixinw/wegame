import { TileType } from './types';
import { MAP_WIDTH, MAP_HEIGHT } from './constants';

export function computeFOV(
  map: TileType[][],
  playerX: number,
  playerY: number,
  visionRange: number
): boolean[][] {
  const visible: boolean[][] = [];
  for (let y = 0; y < MAP_HEIGHT; y++) {
    visible[y] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      visible[y][x] = false;
    }
  }

  visible[playerY][playerX] = true;

  const numRays = 360;
  for (let i = 0; i < numRays; i++) {
    const angle = (i / numRays) * Math.PI * 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);

    let x = playerX + 0.5;
    let y = playerY + 0.5;

    for (let step = 0; step < visionRange; step++) {
      x += dx * 0.5;
      y += dy * 0.5;

      const ix = Math.floor(x);
      const iy = Math.floor(y);

      if (ix < 0 || ix >= MAP_WIDTH || iy < 0 || iy >= MAP_HEIGHT) break;

      visible[iy][ix] = true;

      if (map[iy][ix] === TileType.Wall) break;
    }
  }

  return visible;
}

export function updateExplored(
  explored: boolean[][],
  visible: boolean[][]
): boolean[][] {
  const newExplored = explored.map(row => [...row]);
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (visible[y][x]) {
        newExplored[y][x] = true;
      }
    }
  }
  return newExplored;
}
