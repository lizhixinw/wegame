import { create } from 'zustand';
import {
  Player, Enemy, Item, DungeonMap, Message, GamePhase, GameState,
} from '../game/types';
import {
  PLAYER_BASE_HP, PLAYER_BASE_ATTACK, PLAYER_BASE_DEFENSE, EXP_BASE,
} from '../game/constants';
import { generateDungeon, getRandomFloorPosition } from '../game/dungeon';
import { computeFOV, updateExplored } from '../game/fov';
import { playerAttackEnemy, enemyAttackPlayer, checkLevelUp } from '../game/combat';
import { generateItems, generateEnemies, useItem, pickupItem, resetCounters } from '../game/items';
import { processEnemyTurn } from '../game/ai';
import { TileType } from '../game/types';

interface GameStore extends GameState {
  startGame: () => void;
  movePlayer: (dx: number, dy: number) => void;
  waitTurn: () => void;
  useInventoryItem: (index: number) => void;
  goToMenu: () => void;
  descendStairs: () => void;
}

function createPlayer(floor: number, pos: { x: number; y: number }): Player {
  return {
    hp: PLAYER_BASE_HP,
    maxHp: PLAYER_BASE_HP,
    attack: PLAYER_BASE_ATTACK,
    defense: PLAYER_BASE_DEFENSE,
    level: 1,
    exp: 0,
    expToNext: EXP_BASE,
    floor,
    score: 0,
    x: pos.x,
    y: pos.y,
    visionRange: 8,
    inventory: [],
    weapon: null,
    armor: null,
  };
}

function initFloor(floor: number, existingPlayer?: Player): {
  map: DungeonMap;
  player: Player;
  enemies: Enemy[];
  items: Item[];
  messages: Message[];
} {
  const map = generateDungeon(floor);
  const startRoom = map.rooms[0];
  const startPos = getRandomFloorPosition(map, startRoom);
  const player = existingPlayer
    ? { ...existingPlayer, x: startPos.x, y: startPos.y, floor }
    : createPlayer(floor, startPos);

  const enemies = generateEnemies(map, floor, startPos);
  const items = generateItems(map, floor);

  const visible = computeFOV(map.tiles, player.x, player.y, player.visionRange);
  const explored = updateExplored(map.explored, visible);
  map.explored = explored;
  map.visible = visible;

  const messages: Message[] = existingPlayer
    ? [{ id: 0, text: `你来到了第 ${floor} 层...`, color: '#c9a227', turn: 0 }]
    : [{ id: 0, text: '你踏入了暗影地牢...', color: '#4fc3f7', turn: 0 }];

  return { map, player, enemies, items, messages };
}

export const useGameStore = create<GameStore>((set, get) => ({
  player: createPlayer(1, { x: 0, y: 0 }),
  enemies: [],
  items: [],
  map: generateDungeon(1),
  messages: [],
  phase: 'menu',
  turn: 0,
  messageIdCounter: 1,
  kills: 0,

  startGame: () => {
    resetCounters();
    const { map, player, enemies, items, messages } = initFloor(1);
    set({
      map,
      player,
      enemies,
      items,
      messages,
      phase: 'playing',
      turn: 0,
      messageIdCounter: messages.length,
      kills: 0,
    });
  },

  movePlayer: (dx: number, dy: number) => {
    const state = get();
    if (state.phase !== 'playing') return;

    const newX = state.player.x + dx;
    const newY = state.player.y + dy;

    if (newX < 0 || newX >= state.map.width || newY < 0 || newY >= state.map.height) return;
    if (state.map.tiles[newY][newX] === TileType.Wall) return;

    const enemyAtPos = state.enemies.find(e => e.hp > 0 && e.x === newX && e.y === newY);
    if (enemyAtPos) {
      let { player, enemy, messages, newIdCounter } = playerAttackEnemy(
        state.player, enemyAtPos, state.messageIdCounter
      );

      let newEnemies = state.enemies.map(e => e.id === enemy.id ? enemy : e);
      let kills = state.kills;

      if (enemy.hp <= 0) {
        newEnemies = newEnemies.map(e => e.id === enemy.id ? enemy : e);
        player = { ...player, exp: player.exp + enemy.expReward, score: player.score + enemy.expReward * 10 };
        kills++;

        const levelResult = checkLevelUp(player, newIdCounter);
        player = levelResult.player;
        messages = [...messages, ...levelResult.messages];
        newIdCounter = levelResult.newIdCounter;
      }

      const newTurn = state.turn + 1;
      messages = messages.map(m => ({ ...m, turn: newTurn }));

      let enemyResult = processAllEnemies(newEnemies, player, state.map.tiles, newIdCounter, newTurn);
      player = enemyResult.player;
      newEnemies = enemyResult.enemies;
      messages = [...messages, ...enemyResult.messages];
      newIdCounter = enemyResult.newIdCounter;

      if (player.hp <= 0) {
        messages.push({ id: newIdCounter++, text: '你倒下了...', color: '#FF0000', turn: newTurn });
        set({
          player,
          enemies: newEnemies,
          messages: [...state.messages, ...messages],
          phase: 'gameover',
          turn: newTurn,
          messageIdCounter: newIdCounter,
          kills,
        });
        saveScore(player.floor, player.score);
        return;
      }

      const visible = computeFOV(state.map.tiles, player.x, player.y, player.visionRange);
      const explored = updateExplored(state.map.explored, visible);
      const newMap = { ...state.map, explored, visible };

      set({
        player,
        enemies: newEnemies,
        map: newMap,
        messages: [...state.messages, ...messages],
        turn: newTurn,
        messageIdCounter: newIdCounter,
        kills,
      });
      return;
    }

    let newPlayer = { ...state.player, x: newX, y: newY };
    let newItems = [...state.items];
    let newMessages: Message[] = [];
    let newIdCounter = state.messageIdCounter;

    const pickupResult = pickupItem(newPlayer, newItems, newIdCounter);
    newPlayer = pickupResult.player;
    newItems = pickupResult.items;
    newMessages = [...newMessages, ...pickupResult.messages];
    newIdCounter = pickupResult.newIdCounter;

    if (state.map.tiles[newY][newX] === TileType.StairsDown) {
      newMessages.push({
        id: newIdCounter++,
        text: '你发现了通往更深层的楼梯！按 > 键下楼。',
        color: '#c9a227',
        turn: 0,
      });
    }

    const newTurn = state.turn + 1;
    newMessages = newMessages.map(m => ({ ...m, turn: newTurn }));

    let enemyResult = processAllEnemies(state.enemies, newPlayer, state.map.tiles, newIdCounter, newTurn);
    newPlayer = enemyResult.player;
    let newEnemies = enemyResult.enemies;
    newMessages = [...newMessages, ...enemyResult.messages];
    newIdCounter = enemyResult.newIdCounter;

    if (newPlayer.hp <= 0) {
      newMessages.push({ id: newIdCounter++, text: '你倒下了...', color: '#FF0000', turn: newTurn });
      set({
        player: newPlayer,
        enemies: newEnemies,
        items: newItems,
        messages: [...state.messages, ...newMessages],
        phase: 'gameover',
        turn: newTurn,
        messageIdCounter: newIdCounter,
        kills: state.kills,
      });
      saveScore(newPlayer.floor, newPlayer.score);
      return;
    }

    const visible = computeFOV(state.map.tiles, newPlayer.x, newPlayer.y, newPlayer.visionRange);
    const explored = updateExplored(state.map.explored, visible);
    const newMap = { ...state.map, explored, visible };

    set({
      player: newPlayer,
      enemies: newEnemies,
      items: newItems,
      map: newMap,
      messages: [...state.messages, ...newMessages],
      turn: newTurn,
      messageIdCounter: newIdCounter,
    });
  },

  waitTurn: () => {
    const state = get();
    if (state.phase !== 'playing') return;

    const newTurn = state.turn + 1;
    let newIdCounter = state.messageIdCounter;
    let newMessages: Message[] = [];

    let enemyResult = processAllEnemies(state.enemies, state.player, state.map.tiles, newIdCounter, newTurn);
    let newPlayer = enemyResult.player;
    let newEnemies = enemyResult.enemies;
    newMessages = [...newMessages, ...enemyResult.messages];
    newIdCounter = enemyResult.newIdCounter;

    if (newPlayer.hp <= 0) {
      newMessages.push({ id: newIdCounter++, text: '你倒下了...', color: '#FF0000', turn: newTurn });
      set({
        player: newPlayer,
        enemies: newEnemies,
        messages: [...state.messages, ...newMessages],
        phase: 'gameover',
        turn: newTurn,
        messageIdCounter: newIdCounter,
        kills: state.kills,
      });
      saveScore(newPlayer.floor, newPlayer.score);
      return;
    }

    const visible = computeFOV(state.map.tiles, newPlayer.x, newPlayer.y, newPlayer.visionRange);
    const explored = updateExplored(state.map.explored, visible);
    const newMap = { ...state.map, explored, visible };

    set({
      player: newPlayer,
      enemies: newEnemies,
      map: newMap,
      messages: [...state.messages, ...newMessages],
      turn: newTurn,
      messageIdCounter: newIdCounter,
    });
  },

  useInventoryItem: (index: number) => {
    const state = get();
    if (state.phase !== 'playing') return;

    const result = useItem(state.player, index, state.enemies, state.map, state.messageIdCounter);
    if (!result.used) return;

    let newEnemies = result.enemies;
    let newIdCounter = result.newIdCounter;
    let newMessages = result.messages;
    const newTurn = state.turn + 1;
    newMessages = newMessages.map(m => ({ ...m, turn: newTurn }));

    const deadEnemies = newEnemies.filter(e => e.hp <= 0 && state.enemies.find(se => se.id === e.id && se.hp > 0));
    let newPlayer = { ...result.player };
    let kills = state.kills;

    for (const dead of deadEnemies) {
      newPlayer = { ...newPlayer, exp: newPlayer.exp + dead.expReward, score: newPlayer.score + dead.expReward * 10 };
      kills++;
      const levelResult = checkLevelUp(newPlayer, newIdCounter);
      newPlayer = levelResult.player;
      newMessages = [...newMessages, ...levelResult.messages];
      newIdCounter = levelResult.newIdCounter;
    }

    if (newPlayer.hp <= 0) {
      newMessages.push({ id: newIdCounter++, text: '你倒下了...', color: '#FF0000', turn: newTurn });
      set({
        player: newPlayer,
        enemies: newEnemies,
        messages: [...state.messages, ...newMessages],
        phase: 'gameover',
        turn: newTurn,
        messageIdCounter: newIdCounter,
        kills,
      });
      saveScore(newPlayer.floor, newPlayer.score);
      return;
    }

    const visible = computeFOV(state.map.tiles, newPlayer.x, newPlayer.y, newPlayer.visionRange);
    const explored = updateExplored(state.map.explored, visible);
    const newMap = { ...state.map, explored, visible };

    set({
      player: newPlayer,
      enemies: newEnemies,
      map: newMap,
      messages: [...state.messages, ...newMessages],
      turn: newTurn,
      messageIdCounter: newIdCounter,
      kills,
    });
  },

  goToMenu: () => {
    set({ phase: 'menu' });
  },

  descendStairs: () => {
    const state = get();
    if (state.phase !== 'playing') return;
    if (state.map.tiles[state.player.y][state.player.x] !== TileType.StairsDown) return;

    const nextFloor = state.player.floor + 1;
    const { map, player, enemies, items, messages } = initFloor(nextFloor, state.player);

    set({
      map,
      player,
      enemies,
      items,
      messages: [...state.messages, ...messages],
      messageIdCounter: state.messageIdCounter + messages.length,
    });
  },
}));

function processAllEnemies(
  enemies: Enemy[],
  player: Player,
  tiles: TileType[][],
  messageIdCounter: number,
  turn: number
): { player: Player; enemies: Enemy[]; messages: Message[]; newIdCounter: number } {
  let newPlayer = { ...player };
  let newEnemies = enemies.map(e => ({ ...e }));
  const allMessages: Message[] = [];
  let newIdCounter = messageIdCounter;

  for (let i = 0; i < newEnemies.length; i++) {
    if (newEnemies[i].hp <= 0) continue;

    const result = processEnemyTurn(newEnemies[i], newPlayer, tiles, newEnemies, newIdCounter);
    newEnemies[i] = result.enemy;

    if (result.attacked) {
      const atkResult = enemyAttackPlayer(newEnemies[i], newPlayer, newIdCounter);
      newPlayer = atkResult.player;
      allMessages.push(...atkResult.messages);
      newIdCounter = atkResult.newIdCounter;
    }
  }

  return {
    player: newPlayer,
    enemies: newEnemies,
    messages: allMessages.map(m => ({ ...m, turn })),
    newIdCounter: newIdCounter,
  };
}

function saveScore(floor: number, score: number): void {
  try {
    const stored = localStorage.getItem('shadowDungeonScores');
    const record = stored ? JSON.parse(stored) : { highestFloor: 0, highestScore: 0, totalGames: 0 };
    record.highestFloor = Math.max(record.highestFloor, floor);
    record.highestScore = Math.max(record.highestScore, score);
    record.totalGames++;
    localStorage.setItem('shadowDungeonScores', JSON.stringify(record));
  } catch {
    // ignore
  }
}

export function loadScore(): { highestFloor: number; highestScore: number; totalGames: number } {
  try {
    const stored = localStorage.getItem('shadowDungeonScores');
    return stored ? JSON.parse(stored) : { highestFloor: 0, highestScore: 0, totalGames: 0 };
  } catch {
    return { highestFloor: 0, highestScore: 0, totalGames: 0 };
  }
}
