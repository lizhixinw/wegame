import { useGameStore, loadScore } from '@/store/gameStore';
import { LEVEL_NAMES } from '@/game/constants';

export default function Home() {
  const startGame = useGameStore(s => s.startGame);
  const scores = loadScore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
      <div className="text-center">
        <h1
          className="text-5xl md:text-7xl font-bold tracking-wider mb-2"
          style={{
            color: '#ff4422',
            textShadow: '0 0 20px #ff4422, 0 0 40px #ff442266, 0 4px 0 #8B0000',
            fontFamily: 'monospace',
          }}
        >
          暗影突击
        </h1>
        <p className="text-[#6a6a8c] font-mono text-sm tracking-widest">SHADOW STRIKE</p>
      </div>

      <button
        onClick={startGame}
        className="px-10 py-4 bg-[#2d5016] border-2 border-[#4a8a22] rounded-lg text-white font-mono text-xl tracking-wider hover:bg-[#4a8a22] hover:shadow-[0_0_20px_#4a8a2266] active:scale-95 transition-all"
      >
        开始游戏
      </button>

      <div className="bg-[#0d0d1a]/90 border border-[#2a2a4a] rounded-lg p-6 max-w-md w-full">
        <h2 className="text-[#4fc3f7] font-mono text-sm mb-4 tracking-wider">操作说明</h2>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <span className="text-[#6a6a8c]">移动</span>
          <span className="text-[#aaa]">方向键 / WASD</span>
          <span className="text-[#6a6a8c]">跳跃</span>
          <span className="text-[#aaa]">空格键</span>
          <span className="text-[#6a6a8c]">射击</span>
          <span className="text-[#aaa]">Z 键</span>
          <span className="text-[#6a6a8c]">下蹲</span>
          <span className="text-[#aaa]">↓ / S</span>
        </div>
      </div>

      {scores.highestScore > 0 && (
        <div className="bg-[#0d0d1a]/90 border border-[#2a2a4a] rounded-lg p-4 max-w-md w-full">
          <h2 className="text-[#ffd700] font-mono text-sm mb-2 tracking-wider">最高纪录</h2>
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[#6a6a8c]">最高分</span>
            <span className="text-[#ffd700]">{scores.highestScore.toString().padStart(8, '0')}</span>
          </div>
          <div className="flex justify-between text-xs font-mono mt-1">
            <span className="text-[#6a6a8c]">最远关卡</span>
            <span className="text-[#4fc3f7]">{LEVEL_NAMES[Math.min(scores.highestLevel - 1, LEVEL_NAMES.length - 1)] || '-'}</span>
          </div>
          <div className="flex justify-between text-xs font-mono mt-1">
            <span className="text-[#6a6a8c]">游戏次数</span>
            <span className="text-[#aaa]">{scores.totalGames}</span>
          </div>
        </div>
      )}
    </div>
  );
}
