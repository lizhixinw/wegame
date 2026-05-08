import { useGameStore, loadScore } from '../store/gameStore';
import { useEffect, useState } from 'react';

export default function GameOver() {
  const player = useGameStore(s => s.player);
  const kills = useGameStore(s => s.kills);
  const turn = useGameStore(s => s.turn);
  const startGame = useGameStore(s => s.startGame);
  const goToMenu = useGameStore(s => s.goToMenu);
  const phase = useGameStore(s => s.phase);
  const [scores, setScores] = useState({ highestFloor: 0, highestScore: 0, totalGames: 0 });

  useEffect(() => {
    if (phase === 'gameover') {
      setScores(loadScore());
    }
  }, [phase]);

  if (phase !== 'gameover') return null;

  return (
    <div className="min-h-screen bg-[#0a0a14] flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a0a] via-[#0a0a14] to-[#0a0a14]" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <h1
          className="text-4xl md:text-6xl font-bold tracking-wider"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            color: '#e94560',
            textShadow: '0 0 20px rgba(233,69,96,0.5), 0 0 40px rgba(233,69,96,0.3)',
          }}
        >
          你倒下了
        </h1>

        <div className="bg-[#1a1a2e]/90 border-2 border-[#e94560]/30 rounded-lg p-6 w-80">
          <div className="text-[#c9a227] text-xs font-mono mb-4 text-center">冒险记录</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#6a6a8c] text-sm font-mono">到达层数</span>
              <span className="text-[#4fc3f7] text-lg font-mono font-bold">{player.floor}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6a6a8c] text-sm font-mono">角色等级</span>
              <span className="text-[#9370DB] text-lg font-mono font-bold">Lv.{player.level}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6a6a8c] text-sm font-mono">击杀数</span>
              <span className="text-[#e94560] text-lg font-mono font-bold">{kills}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#6a6a8c] text-sm font-mono">回合数</span>
              <span className="text-[#6a6a8c] text-lg font-mono">{turn}</span>
            </div>
            <hr className="border-[#2a2a4a]" />
            <div className="flex justify-between items-center">
              <span className="text-[#c9a227] text-sm font-mono">最终分数</span>
              <span className="text-[#c9a227] text-2xl font-mono font-bold">{player.score}</span>
            </div>
          </div>

          {player.score >= scores.highestScore && (
            <div className="mt-3 text-center text-[#c9a227] text-xs font-mono animate-pulse">
              ★ 新纪录！★
            </div>
          )}
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
            再来一局
          </button>

          <button
            onClick={goToMenu}
            className="px-8 py-3 bg-[#1a1a2e] text-[#6a6a8c] font-mono text-sm rounded-lg
              hover:text-[#4fc3f7] hover:border-[#4fc3f7]/50
              active:scale-95 transition-all duration-200
              border-2 border-[#2a2a4a]"
            style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '10px' }}
          >
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  );
}
