import { useGameStore, loadScore } from '@/store/gameStore';
import { LEVEL_NAMES } from '@/game/constants';

export default function GameOver() {
  const hud = useGameStore(s => s.hud);
  const startGame = useGameStore(s => s.startGame);
  const setPhase = useGameStore(s => s.setPhase);
  const scores = loadScore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
      <h1
        className="text-4xl md:text-6xl font-bold tracking-wider"
        style={{
          color: '#ff4422',
          textShadow: '0 0 20px #ff4422, 0 4px 0 #8B0000',
          fontFamily: 'monospace',
        }}
      >
        游戏结束
      </h1>

      <div className="bg-[#0d0d1a]/90 border border-[#2a2a4a] rounded-lg p-6 max-w-sm w-full">
        <div className="space-y-3 text-sm font-mono">
          <div className="flex justify-between">
            <span className="text-[#6a6a8c]">最终分数</span>
            <span className="text-[#ffd700]">{hud.score.toString().padStart(8, '0')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6a6a8c]">击杀数</span>
            <span className="text-[#ff4422]">{hud.kills}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6a6a8c]">到达关卡</span>
            <span className="text-[#4fc3f7]">{LEVEL_NAMES[Math.min(hud.levelIndex, LEVEL_NAMES.length - 1)]}</span>
          </div>
          <div className="border-t border-[#2a2a4a] pt-3 mt-3">
            <div className="flex justify-between">
              <span className="text-[#6a6a8c]">历史最高分</span>
              <span className="text-[#ffd700]">{scores.highestScore.toString().padStart(8, '0')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={startGame}
          className="px-8 py-3 bg-[#2d5016] border-2 border-[#4a8a22] rounded-lg text-white font-mono tracking-wider hover:bg-[#4a8a22] hover:shadow-[0_0_20px_#4a8a2266] active:scale-95 transition-all"
        >
          再来一局
        </button>
        <button
          onClick={() => setPhase('menu')}
          className="px-8 py-3 bg-[#1a1a2e] border-2 border-[#2a2a4a] rounded-lg text-[#6a6a8c] font-mono tracking-wider hover:bg-[#2a2a4a] hover:text-white active:scale-95 transition-all"
        >
          返回主菜单
        </button>
      </div>
    </div>
  );
}
