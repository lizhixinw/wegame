import { useGameStore, loadScore } from '../store/gameStore';
import { useEffect, useState } from 'react';

export default function Home() {
  const startGame = useGameStore(s => s.startGame);
  const [scores, setScores] = useState({ highestFloor: 0, highestScore: 0, totalGames: 0 });
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setScores(loadScore());
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#0a0a14] to-[#16213e]" />
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#e94560] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-center">
          <h1
            className="text-5xl md:text-7xl font-bold tracking-wider mb-2"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: '#e94560',
              textShadow: '0 0 20px rgba(233,69,96,0.5), 0 0 40px rgba(233,69,96,0.3), 0 0 80px rgba(233,69,96,0.1)',
            }}
          >
            暗影地牢
          </h1>
          <p className="text-[#6a6a8c] text-sm font-mono tracking-widest mt-4">
            SHADOW DUNGEON
          </p>
        </div>

        <div className="flex flex-col gap-3 w-64">
          <button
            onClick={startGame}
            className="px-8 py-3 bg-[#e94560] text-white font-mono text-sm rounded-lg
              hover:bg-[#ff5a7a] hover:shadow-lg hover:shadow-[#e94560]/30
              active:scale-95 transition-all duration-200
              border-2 border-[#e94560]/50"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}
          >
            开始冒险
          </button>

          <button
            onClick={() => setShowHelp(!showHelp)}
            className="px-8 py-3 bg-[#1a1a2e] text-[#6a6a8c] font-mono text-sm rounded-lg
              hover:text-[#4fc3f7] hover:border-[#4fc3f7]/50
              active:scale-95 transition-all duration-200
              border-2 border-[#2a2a4a]"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
          >
            操作说明
          </button>
        </div>

        {scores.totalGames > 0 && (
          <div className="bg-[#1a1a2e]/80 border border-[#2a2a4a] rounded-lg p-4 w-72">
            <div className="text-[#c9a227] text-xs font-mono mb-2 text-center">历史记录</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[#4fc3f7] text-lg font-mono font-bold">{scores.highestFloor}</div>
                <div className="text-[#6a6a8c] text-[10px] font-mono">最高层数</div>
              </div>
              <div>
                <div className="text-[#c9a227] text-lg font-mono font-bold">{scores.highestScore}</div>
                <div className="text-[#6a6a8c] text-[10px] font-mono">最高分数</div>
              </div>
              <div>
                <div className="text-[#9370DB] text-lg font-mono font-bold">{scores.totalGames}</div>
                <div className="text-[#6a6a8c] text-[10px] font-mono">总游戏数</div>
              </div>
            </div>
          </div>
        )}

        {showHelp && (
          <div className="bg-[#1a1a2e]/90 border border-[#2a2a4a] rounded-lg p-4 w-80 max-h-64 overflow-y-auto">
            <div className="text-[#4fc3f7] text-xs font-mono mb-3 text-center">操作说明</div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-[#6a6a8c]">移动 / 攻击</span>
                <span className="text-[#e94560]">WASD / 方向键</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6a6a8c]">等待一回合</span>
                <span className="text-[#e94560]">空格 / .</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6a6a8c]">使用物品</span>
                <span className="text-[#e94560]">1-8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6a6a8c]">下楼</span>
                <span className="text-[#e94560]">&gt; / Shift+.</span>
              </div>
              <hr className="border-[#2a2a4a]" />
              <div className="text-[#6a6a8c]">
                <p>撞向敌人即为攻击</p>
                <p>踩到物品自动拾取</p>
                <p>找到楼梯可深入下一层</p>
                <p>每5层出现Boss</p>
                <p>死亡即永久结束</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
