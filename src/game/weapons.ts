import { Player, Bullet, WeaponType } from './types';
import { WEAPON_CONFIG, BULLET_SPEED, ENEMY_BULLET_SPEED } from './constants';

export function createPlayerBullets(player: Player, aimDx: number, aimDy: number, idCounter: number): { bullets: Bullet[]; newIdCounter: number } {
  const config = WEAPON_CONFIG[player.weapon];
  const bullets: Bullet[] = [];
  let id = idCounter;

  const dirX = player.facingRight ? 1 : -1;
  const baseAngle = Math.atan2(aimDy, aimDx === 0 && aimDy === 0 ? dirX : aimDx);

  const spawnX = player.facingRight ? player.x + player.width : player.x;
  const spawnY = player.y + (player.isCrouching ? 10 : 12);

  for (let i = 0; i < config.count; i++) {
    const spreadAngle = config.count > 1
      ? baseAngle + (i - (config.count - 1) / 2) * config.spread
      : baseAngle + (Math.random() - 0.5) * config.spread;

    const speed = config.speed;
    const vx = Math.cos(spreadAngle) * speed;
    const vy = Math.sin(spreadAngle) * speed;

    bullets.push({
      id: id++,
      x: spawnX,
      y: spawnY,
      vx,
      vy,
      width: config.bulletSize,
      height: config.bulletSize,
      damage: config.damage,
      type: player.weapon,
      fromPlayer: true,
      life: 120,
      piercing: config.piercing,
    });
  }

  return { bullets, newIdCounter: id };
}

export function createEnemyBullet(enemy: { x: number; y: number; width: number; height: number; facingRight: boolean }, targetX: number, targetY: number, idCounter: number, type: string = 'soldier'): { bullet: Bullet; newIdCounter: number } {
  const spawnX = enemy.facingRight ? enemy.x + enemy.width : enemy.x;
  const spawnY = enemy.y + enemy.height / 2;

  const angle = Math.atan2(targetY - spawnY, targetX - spawnX);
  const speed = type === 'tank' ? ENEMY_BULLET_SPEED * 1.2 : ENEMY_BULLET_SPEED;

  return {
    bullet: {
      id: idCounter++,
      x: spawnX,
      y: spawnY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      width: type === 'tank' ? 8 : 4,
      height: type === 'tank' ? 8 : 4,
      damage: 1,
      type: 'rifle',
      fromPlayer: false,
      life: 180,
      piercing: false,
    },
    newIdCounter: idCounter,
  };
}
