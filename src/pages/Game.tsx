import { useEffect, useCallback, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import GameCanvas from '../components/GameCanvas';
import HUD from '../components/HUD';
import MessageLog from '../components/MessageLog';
import MiniMap from '../components/MiniMap';
import TouchControls from '../components/TouchControls';
import Bestiary from '../components/Bestiary';

export default function Game() {
  const phase = useGameStore(s => s.phase);
  const player = useGameStore(s => s.player);
  const enemies = useGameStore(s => s.enemies);
  const movePlayer = useGameStore(s => s.movePlayer);
  const waitTurn = useGameStore(s => s.waitTurn);
  const useInventoryItem = useGameStore(s => s.useInventoryItem);
  const descendStairs = useGameStore(s => s.descendStairs);

  const [attackDir, setAttackDir] = useState<{dx: number; dy: number} | null>(null);

  const canAttack = (dx: number, dy: number) => {
    const nx = player.x + dx;
    const ny = player.y + dy;
    return enemies.some(e => e.hp > 0 && e.x === nx && e.y === ny);
  };

  const nearbyEnemy = enemies.find(
    e => e.hp > 0 && Math.abs(e.x - player.x) + Math.abs(e.y - player.y) === 1
  );

  const handleAttack = (dx: number, dy: number) => {
    setAttackDir({ dx, dy });
    setTimeout(() => setAttackDir(null), 100);
    movePlayer(dx, dy);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (phase !== 'playing') return;
    e.preventDefault();

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        movePlayer(0, -1);
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        movePlayer(0, 1);
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        movePlayer(-1, 0);
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        movePlayer(1, 0);
        break;
      case ' ':
      case '.':
        waitTurn();
        break;
      case '>':
      case 'Shift':
        if (e.key === '>') descendStairs();
        break;
      case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8':
        useInventoryItem(parseInt(e.key) - 1);
        break;
    }
  }, [phase, movePlayer, waitTurn, useInventoryItem, descendStairs]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (phase === 'menu') return null;
  if (phase === 'gameover') return null;

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center p-2 md:p-4">
      <div className="mb-2 bg-[#1a1a2e]/90 border border-[#2a2a4a] rounded-lg px-4 py-2">
        <div className="text-center">
          <span className="text-[#4fc3f7] text-xs font-mono">第 {player.floor} 层</span>
          <span className="text-[#6a6a8c] text-xs font-mono mx-2">|</span>
          <span className="text-[#e94560] text-xs font-mono">
            {nearbyEnemy ? `⚔️ ${nearbyEnemy.name}就在你旁边！撞过去攻击！` : '探索地牢寻找敌人和宝藏'}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start">
        <div className="flex flex-col items-center">
          <GameCanvas />
          
          {nearbyEnemy && (
            <div className="mt-2 flex flex-col gap-1">
              <div className="text-center text-[#e94560] text-xs font-mono animate-pulse">
                🔥 撞向{nearbyEnemy.name}发起攻击！
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => handleAttack(0, -1)}
                  className="w-12 h-10 bg-[#e94560] hover:bg-[#ff5a7a] text-white font-mono text-sm rounded
                    transition-colors active:scale-95 border-2 border-[#e94560]/50 shadow-lg shadow-[#e94560]/20"
                >
                  ↑ 攻击
                </button>
                <button
                  onClick={() => handleAttack(-1, 0)}
                  className="w-10 h-12 bg-[#e94560] hover:bg-[#ff5a7a] text-white font-mono text-xs rounded
                    transition-colors active:scale-95 border-2 border-[#e94560]/50 shadow-lg shadow-[#e94560]/20"
                >
                  ←
                </button>
                <button
                  onClick={() => waitTurn()}
                  className="w-10 h-12 bg-[#2a2a4a] hover:bg-[#3a3a5a] text-[#6a6a8c] font-mono text-xs rounded
                    transition-colors active:scale-95 border-2 border-[#2a2a4a]"
                >
                  等待
                </button>
                <button
                  onClick={() => handleAttack(1, 0)}
                  className="w-10 h-12 bg-[#e94560] hover:bg-[#ff5a7a] text-white font-mono text-xs rounded
                    transition-colors active:scale-95 border-2 border-[#e94560]/50 shadow-lg shadow-[#e94560]/20"
                >
                  →
                </button>
                <button
                  onClick={() => handleAttack(0, 1)}
                  className="w-12 h-10 bg-[#e94560] hover:bg-[#ff5a7a] text-white font-mono text-sm rounded
                    transition-colors active:scale-95 border-2 border-[#e94560]/50 shadow-lg shadow-[#e94560]/20"
                >
                  ↓ 攻击
                </button>
              </div>
            </div>
          )}

          <TouchControls />
        </div>
        <div className="flex flex-col gap-2">
          <HUD />
          <MiniMap />
        </div>
      </div>
      <div className="w-full max-w-[500px] md:max-w-[700px] mt-2">
        <MessageLog />
      </div>

      <div className="fixed bottom-16 left-4 bg-[#1a1a2e]/90 border border-[#2a2a4a] rounded-lg px-3 py-2">
        <div className="text-[10px] font-mono text-[#6a6a8c] space-y-1">
          <div><span className="text-[#4fc3f7]">WASD</span> 移动</div>
          <div><span className="text-[#4fc3f7]">空格</span> 等待</div>
          <div><span className="text-[#4fc3f7]">1-8</span> 使用物品</div>
          <div><span className="text-[#c9a227]">&gt;</span> 下楼</div>
        </div>
      </div>

      <Bestiary />
    </div>
  );
}
