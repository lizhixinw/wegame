import { Item, InventoryItem, Player, Enemy, Position, Message, TileType } from './types';
import { ITEM_TEMPLATES, ENEMY_TEMPLATES, BOSS_TEMPLATES, MAX_INVENTORY } from './constants';
import { DungeonMap } from './types';
import { getRandomFloorPosition } from './dungeon';

let itemIdCounter = 0;
let enemyIdCounter = 0;

export function resetCounters(): void {
  itemIdCounter = 0;
  enemyIdCounter = 0;
}

export function generateItems(map: DungeonMap, floor: number): Item[] {
  const items: Item[] = [];
  const availableTemplates = ITEM_TEMPLATES.filter(t => t.minFloor <= floor);
  const numItems = Math.min(3 + Math.floor(floor / 2), map.rooms.length);

  const weightedTemplates: typeof ITEM_TEMPLATES = [];
  for (const t of availableTemplates) {
    for (let i = 0; i < t.weight; i++) {
      weightedTemplates.push(t);
    }
  }

  for (let i = 0; i < numItems; i++) {
    const roomIndex = Math.floor(Math.random() * (map.rooms.length - 1)) + 1;
    const room = map.rooms[roomIndex];
    const pos = getRandomFloorPosition(map, room);
    const template = weightedTemplates[Math.floor(Math.random() * weightedTemplates.length)];

    items.push({
      id: `item_${itemIdCounter++}`,
      type: template.type,
      name: template.name,
      effect: template.effect,
      value: template.value,
      x: pos.x,
      y: pos.y,
      picked: false,
      symbol: template.symbol,
      color: template.color,
    });
  }

  return items;
}

export function generateEnemies(map: DungeonMap, floor: number, playerPos: Position): Enemy[] {
  const enemies: Enemy[] = [];
  const availableTemplates = Object.entries(ENEMY_TEMPLATES).filter(
    ([, t]) => t.minFloor <= floor
  );
  const numEnemies = Math.min(3 + Math.floor(floor * 1.2), map.rooms.length * 2);

  for (let i = 0; i < numEnemies; i++) {
    const roomIndex = Math.floor(Math.random() * map.rooms.length);
    const room = map.rooms[roomIndex];
    const pos = getRandomFloorPosition(map, room);

    if (Math.abs(pos.x - playerPos.x) + Math.abs(pos.y - playerPos.y) < 5) continue;

    const [key, template] = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    const floorScale = 1 + (floor - template.minFloor) * 0.1;

    enemies.push({
      id: `enemy_${enemyIdCounter++}`,
      type: key,
      name: template.name,
      hp: Math.floor(template.hp * floorScale),
      maxHp: Math.floor(template.hp * floorScale),
      attack: Math.floor(template.attack * floorScale),
      defense: Math.floor(template.defense * floorScale),
      expReward: Math.floor(template.expReward * floorScale),
      aiType: template.aiType,
      x: pos.x,
      y: pos.y,
      isBoss: false,
      color: template.color,
      symbol: template.symbol,
      patrolDir: Math.floor(Math.random() * 4),
      patrolCounter: Math.floor(Math.random() * 3),
    });
  }

  if (BOSS_TEMPLATES[floor]) {
    const bossTemplate = BOSS_TEMPLATES[floor];
    const bossRoom = map.rooms[map.rooms.length - 1];
    const bossPos = getRandomFloorPosition(map, bossRoom);

    enemies.push({
      id: `enemy_boss_${enemyIdCounter++}`,
      type: 'boss',
      name: bossTemplate.name,
      hp: bossTemplate.hp,
      maxHp: bossTemplate.hp,
      attack: bossTemplate.attack,
      defense: bossTemplate.defense,
      expReward: bossTemplate.expReward,
      aiType: 'chase',
      x: bossPos.x,
      y: bossPos.y,
      isBoss: true,
      color: bossTemplate.color,
      symbol: bossTemplate.symbol,
      patrolDir: 0,
      patrolCounter: 0,
    });
  }

  return enemies;
}

export function useItem(
  player: Player,
  itemIndex: number,
  enemies: Enemy[],
  map: DungeonMap,
  messageIdCounter: number
): {
  player: Player;
  enemies: Enemy[];
  messages: Message[];
  newIdCounter: number;
  used: boolean;
} {
  if (itemIndex < 0 || itemIndex >= player.inventory.length) {
    return { player, enemies, messages: [], newIdCounter: messageIdCounter, used: false };
  }

  const item = player.inventory[itemIndex];
  let newPlayer = { ...player };
  let newEnemies = [...enemies];
  const messages: Message[] = [];
  let used = true;

  switch (item.effect) {
    case 'heal': {
      const healed = Math.min(item.value, newPlayer.maxHp - newPlayer.hp);
      newPlayer = { ...newPlayer, hp: newPlayer.hp + healed };
      messages.push({
        id: messageIdCounter++,
        text: `使用了${item.name}，恢复了 ${healed} 点生命！`,
        color: '#2d6a4f',
        turn: 0,
      });
      break;
    }
    case 'strength': {
      newPlayer = { ...newPlayer, attack: newPlayer.attack + item.value };
      messages.push({
        id: messageIdCounter++,
        text: `使用了${item.name}，攻击力永久提升 ${item.value}！`,
        color: '#e94560',
        turn: 0,
      });
      break;
    }
    case 'fireball': {
      const affected = newEnemies.filter(
        e => Math.abs(e.x - newPlayer.x) <= 3 && Math.abs(e.y - newPlayer.y) <= 3 && e.hp > 0
      );
      affected.forEach(e => {
        const idx = newEnemies.findIndex(ne => ne.id === e.id);
        if (idx !== -1) {
          newEnemies[idx] = { ...newEnemies[idx], hp: newEnemies[idx].hp - item.value };
          messages.push({
            id: messageIdCounter++,
            text: `火球击中了${e.name}，造成 ${item.value} 点伤害！`,
            color: '#FF6347',
            turn: 0,
          });
        }
      });
      if (affected.length === 0) {
        messages.push({
          id: messageIdCounter++,
          text: '火球卷轴发动，但附近没有敌人。',
          color: '#FF6347',
          turn: 0,
        });
      }
      break;
    }
    case 'teleport': {
      const room = map.rooms[Math.floor(Math.random() * map.rooms.length)];
      const pos = getRandomFloorPosition(map, room);
      newPlayer = { ...newPlayer, x: pos.x, y: pos.y };
      messages.push({
        id: messageIdCounter++,
        text: `使用了${item.name}，传送到了新位置！`,
        color: '#9370DB',
        turn: 0,
      });
      break;
    }
    case 'weapon': {
      newPlayer = {
        ...newPlayer,
        weapon: { name: item.name, attack: item.value, symbol: item.symbol, color: item.color },
      };
      messages.push({
        id: messageIdCounter++,
        text: `装备了${item.name}！攻击力 +${item.value}`,
        color: '#4fc3f7',
        turn: 0,
      });
      break;
    }
    case 'armor': {
      newPlayer = {
        ...newPlayer,
        armor: { name: item.name, defense: item.value, symbol: item.symbol, color: item.color },
      };
      messages.push({
        id: messageIdCounter++,
        text: `装备了${item.name}！防御力 +${item.value}`,
        color: '#4fc3f7',
        turn: 0,
      });
      break;
    }
    default:
      used = false;
  }

  if (used) {
    const newInventory = [...newPlayer.inventory];
    newInventory.splice(itemIndex, 1);
    newPlayer = { ...newPlayer, inventory: newInventory };
  }

  return { player: newPlayer, enemies: newEnemies, messages, newIdCounter: messageIdCounter, used };
}

export function pickupItem(
  player: Player,
  items: Item[],
  messageIdCounter: number
): {
  player: Player;
  items: Item[];
  messages: Message[];
  newIdCounter: number;
} {
  const messages: Message[] = [];
  let newPlayer = { ...player };
  let newItems = [...items];

  const itemIndex = newItems.findIndex(
    i => !i.picked && i.x === newPlayer.x && i.y === newPlayer.y
  );

  if (itemIndex === -1) {
    return { player: newPlayer, items: newItems, messages, newIdCounter: messageIdCounter };
  }

  const item = newItems[itemIndex];

  if (newPlayer.inventory.length >= MAX_INVENTORY) {
    messages.push({
      id: messageIdCounter++,
      text: '物品栏已满，无法拾取！',
      color: '#FF6347',
      turn: 0,
    });
    return { player: newPlayer, items: newItems, messages, newIdCounter: messageIdCounter };
  }

  if (item.effect === 'weapon' || item.effect === 'armor') {
    const invItem: InventoryItem = {
      id: item.id,
      type: item.type,
      name: item.name,
      effect: item.effect,
      value: item.value,
      symbol: item.symbol,
      color: item.color,
    };
    newPlayer = {
      ...newPlayer,
      inventory: [...newPlayer.inventory, invItem],
    };
  } else {
    const invItem: InventoryItem = {
      id: item.id,
      type: item.type,
      name: item.name,
      effect: item.effect,
      value: item.value,
      symbol: item.symbol,
      color: item.color,
    };
    newPlayer = {
      ...newPlayer,
      inventory: [...newPlayer.inventory, invItem],
    };
  }

  newItems[itemIndex] = { ...newItems[itemIndex], picked: true };
  messages.push({
    id: messageIdCounter++,
    text: `拾取了${item.name}`,
    color: '#c9a227',
    turn: 0,
  });

  return { player: newPlayer, items: newItems, messages, newIdCounter: messageIdCounter };
}
