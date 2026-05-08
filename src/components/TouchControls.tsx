import { useGameStore } from '../store/gameStore';

export default function TouchControls() {
  const movePlayer = useGameStore(s => s.movePlayer);
  const waitTurn = useGameStore(s => s.waitTurn);
  const descendStairs = useGameStore(s => s.descendStairs);

  const btnClass = "w-12 h-12 bg-[#1a1a2e] border border-[#2a2a4a] rounded-lg flex items-center justify-center text-[#6a6a8c] font-mono text-lg active:bg-[#2a2a4a] active:border-[#4fc3f7] select-none touch-manipulation";

  return (
    <div className="flex items-center gap-6 mt-2 md:hidden">
      <div className="grid grid-cols-3 gap-1">
        <div />
        <button className={btnClass} onPointerDown={() => movePlayer(0, -1)}>↑</button>
        <div />
        <button className={btnClass} onPointerDown={() => movePlayer(-1, 0)}>←</button>
        <button className={btnClass} onPointerDown={() => waitTurn()}>·</button>
        <button className={btnClass} onPointerDown={() => movePlayer(1, 0)}>→</button>
        <div />
        <button className={btnClass} onPointerDown={() => movePlayer(0, 1)}>↓</button>
        <div />
      </div>
      <div className="flex flex-col gap-1">
        <button
          className="px-3 py-2 bg-[#1a1a2e] border border-[#c9a227]/50 rounded-lg text-[#c9a227] text-xs font-mono active:bg-[#2a2a4a] select-none touch-manipulation"
          onPointerDown={() => descendStairs()}
        >
          下楼 &gt;
        </button>
      </div>
    </div>
  );
}
