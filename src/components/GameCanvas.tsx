import { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { TileType, Player, Enemy, Item, DungeonMap } from '../game/types';
import {
  TILE_SIZE, MAP_WIDTH, MAP_HEIGHT,
  WALL_COLOR, FLOOR_COLOR, CORRIDOR_COLOR, DOOR_COLOR, STAIRS_COLOR,
  EXPLORED_DARK, FOG_COLOR, PLAYER_COLOR, PLAYER_SYMBOL,
} from '../game/constants';

const VIEWPORT_TILES_X = 25;
const VIEWPORT_TILES_Y = 17;

function drawTile(
  ctx: CanvasRenderingContext2D,
  tileType: TileType,
  x: number,
  y: number,
  visible: boolean,
  explored: boolean,
) {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;

  if (!explored) {
    ctx.fillStyle = FOG_COLOR;
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    return;
  }

  if (!visible) {
    ctx.fillStyle = EXPLORED_DARK;
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

    if (tileType === TileType.StairsDown) {
      ctx.fillStyle = '#5a4a1a';
      ctx.font = `bold ${TILE_SIZE - 4}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('>', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
    }
    return;
  }

  switch (tileType) {
    case TileType.Wall:
      ctx.fillStyle = WALL_COLOR;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#252545';
      ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);
      break;
    case TileType.Floor:
      ctx.fillStyle = FLOOR_COLOR;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      if (Math.random() < 0.03) {
        ctx.fillStyle = '#4a4a6c';
        ctx.fillRect(px + 6, py + 6, 2, 2);
      }
      break;
    case TileType.Corridor:
      ctx.fillStyle = CORRIDOR_COLOR;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      break;
    case TileType.Door:
      ctx.fillStyle = DOOR_COLOR;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      break;
    case TileType.StairsDown:
      ctx.fillStyle = FLOOR_COLOR;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = STAIRS_COLOR;
      ctx.font = `bold ${TILE_SIZE - 2}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('>', px + TILE_SIZE / 2, py + TILE_SIZE / 2);
      break;
  }
}

function drawEntity(
  ctx: CanvasRenderingContext2D,
  symbol: string,
  color: string,
  x: number,
  y: number,
) {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;
  ctx.fillStyle = color;
  ctx.font = `bold ${TILE_SIZE - 2}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, px + TILE_SIZE / 2, py + TILE_SIZE / 2);
}

function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hp: number,
  maxHp: number,
) {
  const barWidth = TILE_SIZE - 2;
  const barHeight = 3;
  const px = x * TILE_SIZE + 1;
  const py = y * TILE_SIZE - 4;
  const ratio = hp / maxHp;

  ctx.fillStyle = '#333';
  ctx.fillRect(px, py, barWidth, barHeight);
  ctx.fillStyle = ratio > 0.5 ? '#2d6a4f' : ratio > 0.25 ? '#c9a227' : '#e94560';
  ctx.fillRect(px, py, barWidth * ratio, barHeight);
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const player = useGameStore(s => s.player);
  const enemies = useGameStore(s => s.enemies);
  const items = useGameStore(s => s.items);
  const map = useGameStore(s => s.map);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = VIEWPORT_TILES_X * TILE_SIZE;
    const canvasHeight = VIEWPORT_TILES_Y * TILE_SIZE;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.fillStyle = FOG_COLOR;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const offsetX = Math.max(0, Math.min(player.x - Math.floor(VIEWPORT_TILES_X / 2), MAP_WIDTH - VIEWPORT_TILES_X));
    const offsetY = Math.max(0, Math.min(player.y - Math.floor(VIEWPORT_TILES_Y / 2), MAP_HEIGHT - VIEWPORT_TILES_Y));

    ctx.save();
    ctx.translate(-offsetX * TILE_SIZE, -offsetY * TILE_SIZE);

    for (let vy = 0; vy < VIEWPORT_TILES_Y; vy++) {
      for (let vx = 0; vx < VIEWPORT_TILES_X; vx++) {
        const mx = offsetX + vx;
        const my = offsetY + vy;
        if (mx >= MAP_WIDTH || my >= MAP_HEIGHT) continue;
        drawTile(ctx, map.tiles[my][mx], mx, my, map.visible[my][mx], map.explored[my][mx]);
      }
    }

    const visibleItems = items.filter(i => !i.picked && map.visible[i.y][i.x]);
    for (const item of visibleItems) {
      drawEntity(ctx, item.symbol, item.color, item.x, item.y);
    }

    const visibleEnemies = enemies.filter(e => e.hp > 0 && map.visible[e.y][e.x]);
    for (const enemy of visibleEnemies) {
      drawEntity(ctx, enemy.symbol, enemy.color, enemy.x, enemy.y);
      drawHealthBar(ctx, enemy.x, enemy.y, enemy.hp, enemy.maxHp);
    }

    drawEntity(ctx, PLAYER_SYMBOL, PLAYER_COLOR, player.x, player.y);

    ctx.restore();
  }, [player, enemies, items, map]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <canvas
      ref={canvasRef}
      className="border-2 border-[#2a2a4a] rounded-lg shadow-lg shadow-[#e94560]/10"
      style={{
        width: VIEWPORT_TILES_X * TILE_SIZE,
        height: VIEWPORT_TILES_Y * TILE_SIZE,
        imageRendering: 'pixelated',
      }}
    />
  );
}
