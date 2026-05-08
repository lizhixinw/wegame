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
          switch (map.tiles[y][x]) {
            case TileType.Wall:
              ctx.fillStyle = '#252545';
              break;
            case TileType.Floor:
              ctx.fillStyle = '#3a3a5c';
              break;
            case TileType.Corridor:
              ctx.fillStyle = '#2a2a4a';
              break;
            case TileType.StairsDown:
              ctx.fillStyle = '#c9a227';
              break;
            default:
              ctx.fillStyle = '#1a1a2e';
          }
        } else {
          switch (map.tiles[y][x]) {
            case TileType.Wall:
              ctx.fillStyle = '#0d0d1a';
              break;
            case TileType.Floor:
              ctx.fillStyle = '#1a1a2e';
              break;
            case TileType.Corridor:
              ctx.fillStyle = '#15152a';
              break;
            case TileType.StairsDown:
              ctx.fillStyle = '#8B7500';
              break;
            default:
              ctx.fillStyle = '#0d0d1a';
          }
        }
        ctx.fillRect(px, py, MINI_TILE, MINI_TILE);
      }
    }

    for (const enemy of enemies) {
      if (enemy.hp > 0 && map.visible[enemy.y][enemy.x]) {
        ctx.fillStyle = enemy.isBoss ? '#FFD700' : '#e94560';
        ctx.fillRect(enemy.x * MINI_TILE, enemy.y * MINI_TILE, MINI_TILE, MINI_TILE);
      }
    }

    ctx.fillStyle = '#4fc3f7';
    ctx.fillRect(player.x * MINI_TILE, player.y * MINI_TILE, MINI_TILE, MINI_TILE);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(player.x * MINI_TILE + 1, player.y * MINI_TILE + 1, 1, 1);
  }, [map, player, enemies]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="bg-[#1a1a2e]/90 border border-[#2a2a4a] rounded-lg p-2">
      <div className="text-[10px] font-mono text-[#6a6a8c] mb-1 flex items-center justify-between">
        <span>小地图</span>
        <div className="flex gap-2">
          <span className="flex items-center gap-0.5">
            <span className="w-2 h-2 bg-[#4fc3f7] rounded-sm"></span>你
          </span>
          <span className="flex items-center gap-0.5">
            <span className="w-2 h-2 bg-[#e94560] rounded-sm"></span>敌
          </span>
          <span className="flex items-center gap-0.5">
            <span className="w-2 h-2 bg-[#c9a227] rounded-sm"></span>下楼
          </span>
        </div>
      </div>
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
