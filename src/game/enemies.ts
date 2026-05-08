import { Enemy, Player, EnemyType, Bullet } from './types';
import { ENEMY_CONFIG } from './constants';
import { createEnemyBullet } from './weapons';

export function createEnemy(type: EnemyType, x: number, y: number, idCounter: number, isBoss: boolean = false): { enemy: Enemy; newIdCounter: number } {
  const config = isBoss ? ENEMY_CONFIG.boss : ENEMY_CONFIG[type];
  const id = idCounter++;

  return {
    enemy: {
      id,
      type,
      x,
      y,
      vx: type === 'soldier' ? (Math.random() > 0.5 ? 1 : -1) * config.speed : 0,
      vy: 0,
      width: config.width,
      height: config.height,
      hp: config.hp,
      maxHp: config.hp,
      shootTimer: Math.floor(Math.random() * config.shootInterval),
      shootInterval: config.shootInterval,
      facingRight: Math.random() > 0.5,
      isBoss,
      active: false,
      animFrame: 0,
      animTimer: 0,
      patrolDir: 1,
      patrolTimer: 0,
      onGround: false,
    },
    newIdCounter: id,
  };
}

export function updateEnemyAI(enemy: Enemy, player: Player, cameraX: number, idCounter: number): { enemy: Enemy; bullets: Bullet[]; newIdCounter: number } {
  let e = { ...enemy };
  const bullets: Bullet[] = [];
  let id = idCounter;

  if (!e.active) {
    if (e.x < cameraX + 900 && e.x > cameraX - 100) {
      e.active = true;
    }
    return { enemy: e, bullets, newIdCounter: id };
  }

  if (e.hp <= 0) return { enemy: e, bullets, newIdCounter: id };

  e.animTimer++;
  if (e.animTimer > 10) { e.animFrame = (e.animFrame + 1) % 4; e.animTimer = 0; }

  e.facingRight = player.x > e.x;

  e.shootTimer++;

  switch (e.type) {
    case 'soldier': {
      if (e.shootTimer >= e.shootInterval) {
        e.shootTimer = 0;
        const result = createEnemyBullet(e, player.x + player.width / 2, player.y + player.height / 2, id, 'soldier');
        bullets.push(result.bullet);
        id = result.newIdCounter;
      }
      break;
    }
    case 'turret': {
      if (e.shootTimer >= e.shootInterval) {
        e.shootTimer = 0;
        const result = createEnemyBullet(e, player.x + player.width / 2, player.y + player.height / 2, id, 'turret');
        bullets.push(result.bullet);
        id = result.newIdCounter;
      }
      break;
    }
    case 'flyer': {
      e.vx = e.facingRight ? ENEMY_CONFIG.flyer.speed : -ENEMY_CONFIG.flyer.speed;
      if (e.shootTimer >= e.shootInterval) {
        e.shootTimer = 0;
        const result = createEnemyBullet(e, player.x + player.width / 2, player.y + player.height / 2, id, 'flyer');
        bullets.push(result.bullet);
        id = result.newIdCounter;
      }
      break;
    }
    case 'tank': {
      if (e.shootTimer >= e.shootInterval) {
        e.shootTimer = 0;
        const result = createEnemyBullet(e, player.x + player.width / 2, player.y + player.height / 2, id, 'tank');
        bullets.push(result.bullet);
        id = result.newIdCounter;
      }
      break;
    }
    case 'boss': {
      e.vx = e.facingRight ? ENEMY_CONFIG.boss.speed : -ENEMY_CONFIG.boss.speed;
      if (e.shootTimer >= e.shootInterval) {
        e.shootTimer = 0;
        for (let i = -1; i <= 1; i++) {
          const angle = Math.atan2(player.y - e.y, player.x - e.x) + i * 0.3;
          bullets.push({
            id: id++,
            x: e.x + e.width / 2,
            y: e.y + e.height / 2,
            vx: Math.cos(angle) * 3,
            vy: Math.sin(angle) * 3,
            width: 6,
            height: 6,
            damage: 1,
            type: 'rifle',
            fromPlayer: false,
            life: 200,
            piercing: false,
          });
        }
      }
      break;
    }
  }

  return { enemy: e, bullets, newIdCounter: id };
}
