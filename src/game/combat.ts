import { Player, Enemy, Message } from './types';

export function calculateDamage(attack: number, defense: number): number {
  const baseDamage = Math.max(1, attack - defense);
  const variance = Math.floor(Math.random() * 3) - 1;
  return Math.max(1, baseDamage + variance);
}

export function playerAttackEnemy(
  player: Player,
  enemy: Enemy,
  messageIdCounter: number
): { player: Player; enemy: Enemy; messages: Message[]; newIdCounter: number } {
  const totalAttack = player.attack + (player.weapon?.attack || 0);
  const damage = calculateDamage(totalAttack, enemy.defense);
  const newEnemy = { ...enemy, hp: enemy.hp - damage };
  const messages: Message[] = [];

  messages.push({
    id: messageIdCounter++,
    text: `你攻击了${enemy.name}，造成 ${damage} 点伤害！`,
    color: '#e94560',
    turn: 0,
  });

  if (newEnemy.hp <= 0) {
    messages.push({
      id: messageIdCounter++,
      text: `${enemy.name}被击败了！获得 ${enemy.expReward} 经验值`,
      color: '#c9a227',
      turn: 0,
    });
  }

  return { player, enemy: newEnemy, messages, newIdCounter: messageIdCounter };
}

export function enemyAttackPlayer(
  enemy: Enemy,
  player: Player,
  messageIdCounter: number
): { player: Player; messages: Message[]; newIdCounter: number } {
  const totalDefense = player.defense + (player.armor?.defense || 0);
  const damage = calculateDamage(enemy.attack, totalDefense);
  const newPlayer = { ...player, hp: player.hp - damage };
  const messages: Message[] = [];

  messages.push({
    id: messageIdCounter++,
    text: `${enemy.name}攻击了你，造成 ${damage} 点伤害！`,
    color: '#FF6347',
    turn: 0,
  });

  return { player: newPlayer, messages, newIdCounter: messageIdCounter };
}

export function checkLevelUp(player: Player, messageIdCounter: number): {
  player: Player;
  messages: Message[];
  newIdCounter: number;
} {
  let newPlayer = { ...player };
  const messages: Message[] = [];

  while (newPlayer.exp >= newPlayer.expToNext) {
    newPlayer = {
      ...newPlayer,
      level: newPlayer.level + 1,
      exp: newPlayer.exp - newPlayer.expToNext,
      expToNext: Math.floor(newPlayer.expToNext * 1.5),
      maxHp: newPlayer.maxHp + 5,
      hp: Math.min(newPlayer.hp + 5, newPlayer.maxHp + 5),
      attack: newPlayer.attack + 2,
      defense: newPlayer.defense + 1,
    };

    messages.push({
      id: messageIdCounter++,
      text: `升级了！你现在是 ${newPlayer.level} 级！`,
      color: '#4fc3f7',
      turn: 0,
    });
  }

  return { player: newPlayer, messages, newIdCounter: messageIdCounter };
}
