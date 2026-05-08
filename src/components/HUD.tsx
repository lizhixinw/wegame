import { useGameStore } from '../store/gameStore';
import { WEAPON_CONFIG } from '../game/constants';

const WEAPON_NAMES: Record<string, string> = {
  rifle: '步枪',
  spread: '散弹枪',
  laser: '激光枪',
  machinegun: '机关枪',
  flame: '火焰枪',
};

export default function HUD() {
  const hud = useGameStore(s => s.hud);
  const weaponColor = WEAPON_CONFIG[hud.weapon]?.color || '#ffdd44';

  return (
    <div className="flex items-center justify-between w-full max-w-[800px] bg-[#0d0d1a]/90 border border-[#2a2a4a] rounded-lg px-4 py-2">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {Array.from({ length: hud.maxHp }).map((_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-sm border ${
                i < hud.hp
                  ? 'bg-[#ff4422] border-[#ff6644] shadow-[0_0_4px_#ff4422]'
                  : 'bg-[#1a1a2e] border-[#2a2a4a]'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[#ff4422] text-xs font-mono">x{hud.lives}</span>
        </div>

        <div className="flex items-center gap-2 bg-[#1a1a2e] border border-[#2a2a4a] rounded px-2 py-1">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: weaponColor }} />
          <span className="text-xs font-mono" style={{ color: weaponColor }}>
            {WEAPON_NAMES[hud.weapon]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-[#4fc3f7] text-xs font-mono">
          {hud.levelName}
        </div>
        <div className="text-[#ffd700] text-xs font-mono">
          {hud.score.toString().padStart(8, '0')}
        </div>
      </div>
    </div>
  );
}
