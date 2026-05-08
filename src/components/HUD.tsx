import { useGameStore } from '../store/gameStore';
import { useEffect, useState } from 'react';

export default function HUD() {
  const player = useGameStore(s => s.player);
  const turn = useGameStore(s => s.turn);
  const map = useGameStore(s => s.map);
  const enemies = useGameStore(s => s.enemies);
  const [showHint, setShowHint] = useState(true);

  const hpPercent = (player.hp / player.maxHp) * 100;
  const expPercent = (player.exp / player.expToNext) * 100;

  const nearbyEnemy = enemies.find(
    e => e.hp > 0 && Math.abs(e.x - player.x) + Math.abs(e.y - player.y) === 1
  );

  const onStairs = map.tiles[player.y][player.x] === 4;

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <div className="bg-[#1a1a2e]/90 border border-[#2a2a4a] rounded-lg p-3">
        <div className="text-[#4fc3f7] text-xs font-mono mb-1">
          Lv.{player.level} 冒险者
        </div>

        <div className="mb-2">
          <div className="flex justify-between text-xs font-mono mb-0.5">
            <span className="text-[#e94560]">生命值</span>
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
            <span className="text-[#4fc3f7]">经验值</span>
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
          <div className="text-[#c9a227]">攻击: {player.attack}{player.weapon ? `+${player.weapon.attack}` : ''}</div>
          <div className="text-[#4fc3f7]">防御: {player.defense}{player.armor ? `+${player.armor.defense}` : ''}</div>
          <div className="text-[#9370DB]">第{player.floor}层</div>
          <div className="text-[#c9a227]">分数: {player.score}</div>
        </div>

        {player.weapon && (
          <div className="mt-2 text-xs font-mono text-[#C0C0C0] flex items-center gap-1">
            <span>⚔️</span> {player.weapon.name} (+{player.weapon.attack})
          </div>
        )}
        {player.armor && (
          <div className="text-xs font-mono text-[#8B4513] flex items-center gap-1">
            <span>🛡️</span> {player.armor.name} (+{player.armor.defense})
          </div>
        )}
      </div>

      {showHint && turn < 10 && (
        <div className="bg-[#4fc3f7]/10 border border-[#4fc3f7]/30 rounded-lg p-3 animate-pulse">
          <div className="text-[#4fc3f7] text-xs font-mono mb-2">💡 新手提示</div>
          <div className="text-[10px] font-mono text-[#6a6a8c] space-y-1">
            <p>• WASD或方向键移动</p>
            <p>• 撞向敌人即可攻击</p>
            <p>• 踩到物品自动拾取</p>
            <p>• 找到<span className="text-[#c9a227]">金色楼梯 ↓</span>可以下楼</p>
          </div>
        </div>
      )}

      {nearbyEnemy && (
        <div className="bg-[#e94560]/10 border border-[#e94560]/30 rounded-lg p-2">
          <div className="text-[#e94560] text-xs font-mono">
            ⚔️ 附近有敌人！
          </div>
          <div className="text-[10px] font-mono text-[#6a6a8c]">
            {nearbyEnemy.name} (HP: {nearbyEnemy.hp}/{nearbyEnemy.maxHp})
          </div>
        </div>
      )}

      {onStairs && (
        <div className="bg-[#c9a227]/10 border border-[#c9a227]/30 rounded-lg p-2">
          <div className="text-[#c9a227] text-xs font-mono">
            ⬇️ 站在楼梯上！
          </div>
          <div className="text-[10px] font-mono text-[#6a6a8c]">
            按 <span className="text-[#4fc3f7]">&gt;</span> 或 <span className="text-[#4fc3f7]">Shift+.</span> 下楼
          </div>
        </div>
      )}

      <div className="bg-[#1a1a2e]/90 border border-[#2a2a4a] rounded-lg p-3">
        <div className="text-xs font-mono text-[#6a6a8c] mb-1">物品栏 (1-8使用)</div>
        <div className="grid grid-cols-4 gap-1">
          {player.inventory.map((item, i) => (
            <button
              key={item.id}
              onClick={() => useGameStore.getState().useInventoryItem(i)}
              className="w-8 h-8 bg-[#0d0d1a] border border-[#2a2a4a] rounded flex items-center justify-center text-xs font-mono hover:border-[#4fc3f7] hover:bg-[#1a1a3e] transition-colors relative"
              title={`${item.name}`}
            >
              <span style={{ color: item.color }} className="text-sm">
                {item.effect === 'heal' ? '💊' : item.effect === 'strength' ? '💪' : item.effect === 'fireball' ? '🔥' : item.effect === 'teleport' ? '🌀' : item.effect === 'weapon' ? '⚔️' : '🛡️'}
              </span>
              <span className="absolute -top-1 -right-1 text-[8px] text-[#4fc3f7]">{i + 1}</span>
            </button>
          ))}
          {Array.from({ length: 8 - player.inventory.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-8 h-8 bg-[#0d0d1a] border border-[#1a1a2e] rounded"
            />
          ))}
        </div>
      </div>

      <div className="text-[10px] font-mono text-[#4a4a6c] text-center">
        回合: {turn} | 击杀: {useGameStore.getState().kills}
      </div>
    </div>
  );
}
