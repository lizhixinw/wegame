import { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { TileType } from '../game/types';
import { MAP_WIDTH, MAP_HEIGHT } from '../game/constants';

const MINI_TILE = 3;

export default function MiniMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const map = useGameStore(s => s.map);
  const player = useGameStore(s => s.player);
  const enemies = useGameStore(s => s.enemies);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = MAP_WIDTH * MINI_TILE;
    canvas.height = MAP_HEIGHT * MINI_TILE;

    ctx.fillStyle = '#0a0a14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        if (!map.explored[y][x]) continue;

        const px = x * MINI_TILE;
        const py = y * MINI_TILE;

        if (map.visible[y][x]) {
          ctx.fillStyle = map.tiles[y][x] === TileType.Wall ? '#252545' : '#3a3a5c';
        } else {
          ctx.fillStyle = map.tiles[y][x] === TileType.Wall ? '#0d0d1a' : '#1a1a2e';
        }
        ctx.fillRect(px, py, MINI_TILE, MINI_TILE);

        if (map.tiles[y][x] === TileType.StairsDown && map.explored[y][x]) {
          ctx.fillStyle = '#c9a227';
          ctx.fillRect(px, py, MINI_TILE, MINI_TILE);
        }
      }
    }

    for (const enemy of enemies) {
      if (enemy.hp > 0 && map.visible[enemy.y][enemy.x]) {
        ctx.fillStyle = '#e94560';
        ctx.fillRect(enemy.x * MINI_TILE, enemy.y * MINI_TILE, MINI_TILE, MINI_TILE);
      }
    }

    ctx.fillStyle = '#4fc3f7';
    ctx.fillRect(player.x * MINI_TILE, player.y * MINI_TILE, MINI_TILE, MINI_TILE);
  }, [map, player, enemies]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="bg-[#1a1a2e]/90 border border-[#2a2a4a] rounded-lg p-2">
      <div className="text-[10px] font-mono text-[#6a6a8c] mb-1">小地图</div>
      <canvas
        ref={canvasRef}
        style={{
          width: MAP_WIDTH * MINI_TILE,
          height: MAP_HEIGHT * MINI_TILE,
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
}
