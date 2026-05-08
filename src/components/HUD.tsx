import { useGameStore } from '../store/gameStore';

export default function HUD() {
  const player = useGameStore(s => s.player);
  const turn = useGameStore(s => s.turn);

  const hpPercent = (player.hp / player.maxHp) * 100;
  const expPercent = (player.exp / player.expToNext) * 100;

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <div className="bg-[#1a1a2e]/90 border border-[#2a2a4a] rounded-lg p-3">
        <div className="text-[#4fc3f7] text-xs font-mono mb-1">
          Lv.{player.level} 冒险者
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-xs font-mono mb-0.5">
            <span className="text-[#e94560]">HP</span>
            <span className="text-[#e94560]">{player.hp}/{player.maxHp}</span>
          </div>
          <div className="h-3 bg-[#0d0d1a] rounded-full overflow-hidden border border-[#2a2a4a]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${hpPercent}%`,
                backgroundColor: hpPercent > 50 ? '#2d6a4f' : hpPercent > 25 ? '#c9a227' : '#e94560',
              }}
            />
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-xs font-mono mb-0.5">
            <span className="text-[#4fc3f7]">EXP</span>
            <span className="text-[#4fc3f7]">{player.exp}/{player.expToNext}</span>
          </div>
          <div className="h-2 bg-[#0d0d1a] rounded-full overflow-hidden border border-[#2a2a4a]">
            <div
              className="h-full bg-[#4fc3f7] rounded-full transition-all duration-300"
              style={{ width: `${expPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 text-xs font-mono">
          <div className="text-[#c9a227]">ATK: {player.attack}{player.weapon ? `+${player.weapon.attack}` : ''}</div>
          <div className="text-[#4fc3f7]">DEF: {player.defense}{player.armor ? `+${player.armor.defense}` : ''}</div>
          <div className="text-[#9370DB]">F{player.floor}</div>
          <div className="text-[#c9a227]">Score: {player.score}</div>
        </div>

        {player.weapon && (
          <div className="mt-2 text-xs font-mono text-[#C0C0C0]">
            / {player.weapon.name}
          </div>
        )}
        {player.armor && (
          <div className="text-xs font-mono text-[#8B4513]">
            [ {player.armor.name}
          </div>
        )}
      </div>

      <div className="bg-[#1a1a2e]/90 border border-[#2a2a4a] rounded-lg p-3">
        <div className="text-xs font-mono text-[#6a6a8c] mb-1">物品栏</div>
        <div className="grid grid-cols-4 gap-1">
          {player.inventory.map((item, i) => (
            <button
              key={item.id}
              onClick={() => useGameStore.getState().useInventoryItem(i)}
              className="w-8 h-8 bg-[#0d0d1a] border border-[#2a2a4a] rounded flex items-center justify-center text-xs font-mono hover:border-[#4fc3f7] hover:bg-[#1a1a3e] transition-colors"
              title={`${item.name} (按 ${i + 1} 使用)`}
            >
              <span style={{ color: item.color }}>{item.symbol}</span>
            </button>
          ))}
          {Array.from({ length: 8 - player.inventory.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-8 h-8 bg-[#0d0d1a] border border-[#1a1a2e] rounded"
            />
          ))}
        </div>
        <div className="text-[10px] font-mono text-[#4a4a6c] mt-1">按 1-8 使用物品</div>
      </div>

      <div className="text-[10px] font-mono text-[#4a4a6c] text-center">
        回合: {turn}
      </div>
    </div>
  );
}
