import { useState } from 'react';
import { ENEMY_TEMPLATES, BOSS_TEMPLATES, ITEM_TEMPLATES } from '../game/constants';

const ENEMY_LIST = [
  { key: 'rat', ...ENEMY_TEMPLATES.rat },
  { key: 'bat', ...ENEMY_TEMPLATES.bat },
  { key: 'skeleton', ...ENEMY_TEMPLATES.skeleton },
  { key: 'goblin', ...ENEMY_TEMPLATES.goblin },
  { key: 'orc', ...ENEMY_TEMPLATES.orc },
  { key: 'mage', ...ENEMY_TEMPLATES.mage },
  { key: 'demon', ...ENEMY_TEMPLATES.demon },
];

const BOSS_LIST = [
  { key: 'boss1', floor: 5, ...BOSS_TEMPLATES[5] },
  { key: 'boss2', floor: 10, ...BOSS_TEMPLATES[10] },
  { key: 'boss3', floor: 15, ...BOSS_TEMPLATES[15] },
];

const ITEM_LIST = ITEM_TEMPLATES.filter((t, i, arr) => 
  arr.findIndex(x => x.name === t.name) === i
);

export default function Bestiary() {
  const [activeTab, setActiveTab] = useState<'enemy' | 'item'>('enemy');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-[#1a1a2e] border-2 border-[#2a2a4a] rounded-full
          flex items-center justify-center text-2xl hover:border-[#4fc3f7] hover:bg-[#2a2a4a]
          transition-all duration-200 shadow-lg shadow-black/50 z-50"
        title="打开图鉴"
      >
        📖
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a2e] border-2 border-[#2a2a4a] rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
            <div className="flex border-b border-[#2a2a4a]">
              <button
                onClick={() => setActiveTab('enemy')}
                className={`flex-1 py-3 text-sm font-mono transition-colors ${
                  activeTab === 'enemy' 
                    ? 'bg-[#2a2a4a] text-[#e94560] border-b-2 border-[#e94560]' 
                    : 'text-[#6a6a8c] hover:text-white'
                }`}
              >
                🐺 敌人图鉴
              </button>
              <button
                onClick={() => setActiveTab('item')}
                className={`flex-1 py-3 text-sm font-mono transition-colors ${
                  activeTab === 'item' 
                    ? 'bg-[#2a2a4a] text-[#c9a227] border-b-2 border-[#c9a227]' 
                    : 'text-[#6a6a8c] hover:text-white'
                }`}
              >
                💎 物品图鉴
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 text-[#6a6a8c] hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {activeTab === 'enemy' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[#e94560] text-sm font-mono mb-2">⚔️ 普通敌人</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ENEMY_LIST.map(enemy => (
                        <div 
                          key={enemy.key}
                          className="bg-[#0d0d1a] border border-[#2a2a4a] rounded-lg p-3 hover:border-[#e94560]/50 transition-colors"
                        >
                          <div 
                            className="w-12 h-12 mx-auto mb-2 rounded flex items-center justify-center text-3xl"
                            style={{ backgroundColor: `${enemy.color}22` }}
                          >
                            {enemy.symbol}
                          </div>
                          <div className="text-center">
                            <div className="text-white text-sm font-mono">{enemy.name}</div>
                            <div className="text-[10px] text-[#6a6a8c] mt-1 space-y-0.5">
                              <div>HP: {enemy.hp}</div>
                              <div>攻击: {enemy.attack} | 防御: {enemy.defense}</div>
                              <div className="text-[#c9a227]">经验: +{enemy.expReward}</div>
                              <div className="capitalize text-[#9370DB]">
                                AI: {enemy.aiType === 'patrol' ? '巡逻' : enemy.aiType === 'chase' ? '追击' : '远程'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#FFD700] text-sm font-mono mb-2">👑 BOSS (每5层出现)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {BOSS_LIST.map(boss => (
                        <div 
                          key={boss.key}
                          className="bg-[#0d0d1a] border border-[#FFD700]/30 rounded-lg p-3 hover:border-[#FFD700]/60 transition-colors"
                        >
                          <div 
                            className="w-12 h-12 mx-auto mb-2 rounded flex items-center justify-center text-3xl"
                            style={{ backgroundColor: `${boss.color}22` }}
                          >
                            {boss.symbol}
                          </div>
                          <div className="text-center">
                            <div className="text-[#FFD700] text-sm font-mono">{boss.name}</div>
                            <div className="text-[10px] text-[#6a6a8c] mt-1 space-y-0.5">
                              <div>第{boss.floor}层出现</div>
                              <div>HP: {boss.hp}</div>
                              <div>攻击: {boss.attack} | 防御: {boss.defense}</div>
                              <div className="text-[#c9a227]">经验: +{boss.expReward}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'item' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[#2d6a4f] text-sm font-mono mb-2">🧪 消耗品</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {ITEM_LIST.filter(i => i.type === 'potion' || i.type === 'scroll').map((item, idx) => (
                        <div 
                          key={idx}
                          className="bg-[#0d0d1a] border border-[#2a2a4a] rounded-lg p-3 hover:border-[#2d6a4f]/50 transition-colors"
                        >
                          <div 
                            className="w-10 h-10 mx-auto mb-2 rounded flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${item.color}22` }}
                          >
                            {item.effect === 'heal' ? '💊' : 
                             item.effect === 'strength' ? '💪' : 
                             item.effect === 'fireball' ? '🔥' : '🌀'}
                          </div>
                          <div className="text-center">
                            <div className="text-white text-xs font-mono">{item.name}</div>
                            <div className="text-[10px] text-[#6a6a8c] mt-1">
                              {item.effect === 'heal' && `恢复 ${item.value} HP`}
                              {item.effect === 'strength' && `攻击 +${item.value}`}
                              {item.effect === 'fireball' && `造成 ${item.value} 伤害`}
                              {item.effect === 'teleport' && `随机传送`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[#c0c0c0] text-sm font-mono mb-2">⚔️ 装备</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {ITEM_LIST.filter(i => i.type === 'weapon' || i.type === 'armor').map((item, idx) => (
                        <div 
                          key={idx}
                          className="bg-[#0d0d1a] border border-[#2a2a4a] rounded-lg p-3 hover:border-[#c0c0c0]/50 transition-colors"
                        >
                          <div 
                            className="w-10 h-10 mx-auto mb-2 rounded flex items-center justify-center text-2xl"
                            style={{ backgroundColor: `${item.color}22` }}
                          >
                            {item.effect === 'weapon' ? '⚔️' : '🛡️'}
                          </div>
                          <div className="text-center">
                            <div className="text-white text-xs font-mono">{item.name}</div>
                            <div className="text-[10px] text-[#6a6a8c] mt-1">
                              {item.effect === 'weapon' && `攻击 +${item.value}`}
                              {item.effect === 'armor' && `防御 +${item.value}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
