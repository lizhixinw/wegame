import { Player, Enemy, Bullet, Pickup, Particle, WeaponType, EnemyType } from './types';

function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
}

export function drawPlayer(ctx: CanvasRenderingContext2D, player: Player, frame: number) {
  const x = Math.floor(player.x);
  const y = Math.floor(player.y);
  const dir = player.facingRight ? 1 : -1;
  const s = 2;

  if (player.invincibleTimer > 0 && Math.floor(player.invincibleTimer / 3) % 2 === 0) return;

  ctx.save();
  if (!player.facingRight) {
    ctx.translate(x + player.width, y);
    ctx.scale(-1, 1);
    ctx.translate(0, 0);
  } else {
    ctx.translate(x, y);
  }

  const headY = player.isCrouching ? 4 : 0;

  px(ctx, 4, headY + 0, 12, 4, '#4a3728');
  px(ctx, 6, headY + 4, 8, 4, '#f5d0a9');
  px(ctx, 8, headY + 5, 2, 2, '#2c3e50');
  px(ctx, 6, headY + 7, 8, 2, '#f5d0a9');

  px(ctx, 4, headY + 8, 12, 6, '#2d5016');
  px(ctx, 2, headY + 10, 2, 4, '#2d5016');
  px(ctx, 16, headY + 10, 4, 4, '#2d5016');

  px(ctx, 16, headY + 8, 6, 2, '#8B4513');
  px(ctx, 20, headY + 6, 2, 4, '#666');

  if (player.isCrouching) {
    px(ctx, 4, 14, 12, 6, '#3a5a20');
  } else {
    px(ctx, 4, 14, 12, 8, '#3a5a20');
    const legOffset = player.onGround ? (frame % 2 === 0 ? 0 : 2) : 0;
    px(ctx, 4, 22, 4, 10 + legOffset, '#2c3e50');
    px(ctx, 12, 22, 4, 10 - legOffset, '#2c3e50');
    px(ctx, 4, 30 + legOffset, 5, 2, '#1a1a1a');
    px(ctx, 12, 30 - legOffset, 5, 2, '#1a1a1a');
  }

  ctx.restore();
}

export function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy) {
  const x = Math.floor(enemy.x);
  const y = Math.floor(enemy.y);

  ctx.save();
  if (!enemy.facingRight) {
    ctx.translate(x + enemy.width, y);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(x, y);
  }

  switch (enemy.type) {
    case 'soldier':
      px(ctx, 3, 0, 12, 4, '#8B0000');
      px(ctx, 5, 4, 8, 4, '#daa520');
      px(ctx, 7, 5, 2, 2, '#000');
      px(ctx, 3, 8, 12, 8, '#8B0000');
      px(ctx, 14, 10, 6, 2, '#8B4513');
      px(ctx, 18, 8, 2, 4, '#666');
      px(ctx, 4, 16, 4, 10, '#5a0000');
      px(ctx, 10, 16, 4, 10, '#5a0000');
      break;
    case 'turret':
      px(ctx, 2, 8, 20, 16, '#555');
      px(ctx, 4, 10, 16, 12, '#777');
      px(ctx, 18, 14, 8, 4, '#444');
      px(ctx, 24, 12, 4, 8, '#333');
      px(ctx, 6, 4, 4, 6, '#ff4422');
      px(ctx, 14, 4, 4, 6, '#ff4422');
      break;
    case 'flyer':
      px(ctx, 4, 4, 14, 8, '#4a4a8a');
      px(ctx, 0, 2, 6, 4, '#6a6aaa');
      px(ctx, 16, 2, 6, 4, '#6a6aaa');
      px(ctx, 8, 6, 2, 2, '#ff0');
      px(ctx, 12, 6, 2, 2, '#ff0');
      px(ctx, 6, 12, 10, 4, '#3a3a6a');
      break;
    case 'tank':
      px(ctx, 0, 12, 40, 16, '#556B2F');
      px(ctx, 4, 8, 32, 8, '#6B8E23');
      px(ctx, 30, 10, 14, 4, '#556B2F');
      px(ctx, 40, 8, 4, 8, '#444');
      px(ctx, 8, 14, 6, 4, '#ff4422');
      px(ctx, 16, 14, 6, 4, '#ff4422');
      px(ctx, 4, 28, 8, 4, '#333');
      px(ctx, 28, 28, 8, 4, '#333');
      break;
    case 'boss':
      px(ctx, 8, 0, 48, 8, '#8B0000');
      px(ctx, 12, 4, 8, 4, '#ffd700');
      px(ctx, 44, 4, 8, 4, '#ffd700');
      px(ctx, 4, 8, 56, 24, '#5a0000');
      px(ctx, 8, 12, 48, 16, '#8B0000');
      px(ctx, 16, 16, 8, 4, '#ff0');
      px(ctx, 40, 16, 8, 4, '#ff0');
      px(ctx, 24, 24, 16, 8, '#daa520');
      px(ctx, 0, 32, 20, 16, '#5a0000');
      px(ctx, 44, 32, 20, 16, '#5a0000');
      px(ctx, 52, 20, 16, 4, '#8B4513');
      px(ctx, 64, 16, 4, 12, '#666');
      px(ctx, 8, 48, 12, 12, '#3a0000');
      px(ctx, 44, 48, 12, 12, '#3a0000');
      break;
  }

  ctx.restore();

  if (enemy.hp < enemy.maxHp && enemy.hp > 0) {
    const barW = enemy.width;
    const barH = 3;
    const barX = Math.floor(enemy.x);
    const barY = Math.floor(enemy.y) - 6;
    ctx.fillStyle = '#440000';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#ff2222';
    ctx.fillRect(barX, barY, barW * (enemy.hp / enemy.maxHp), barH);
  }
}

export function drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet) {
  const x = Math.floor(bullet.x);
  const y = Math.floor(bullet.y);

  switch (bullet.type) {
    case 'rifle':
      ctx.fillStyle = bullet.fromPlayer ? '#ffdd44' : '#ff4444';
      ctx.fillRect(x, y, bullet.width, bullet.height);
      break;
    case 'spread':
      ctx.fillStyle = '#ff6644';
      ctx.beginPath();
      ctx.arc(x + 2, y + 2, 3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'laser':
      ctx.fillStyle = '#00bfff';
      ctx.shadowColor = '#00bfff';
      ctx.shadowBlur = 6;
      ctx.fillRect(x, y, bullet.width + 4, bullet.height);
      ctx.shadowBlur = 0;
      break;
    case 'machinegun':
      ctx.fillStyle = '#ffaa00';
      ctx.fillRect(x, y, bullet.width, bullet.height);
      break;
    case 'flame':
      ctx.fillStyle = '#ff4400';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(x + 4, y + 4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffaa00';
      ctx.beginPath();
      ctx.arc(x + 4, y + 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
  }
}

export function drawPickup(ctx: CanvasRenderingContext2D, pickup: Pickup, time: number) {
  if (pickup.collected) return;
  const x = Math.floor(pickup.x);
  const bobY = Math.floor(pickup.y + Math.sin(time * 0.05) * 4);

  ctx.save();

  ctx.fillStyle = '#000';
  ctx.globalAlpha = 0.3;
  ctx.fillRect(x + 2, bobY + pickup.height + 2, pickup.width - 4, 4);
  ctx.globalAlpha = 1;

  switch (pickup.type) {
    case 'weapon_spread':
      px(ctx, x + 4, bobY + 2, 12, 16, '#ff6644');
      px(ctx, x + 6, bobY + 4, 8, 12, '#ff8866');
      px(ctx, x + 8, bobY + 6, 4, 4, '#fff');
      break;
    case 'weapon_laser':
      px(ctx, x + 4, bobY + 2, 12, 16, '#00bfff');
      px(ctx, x + 6, bobY + 4, 8, 12, '#44ddff');
      px(ctx, x + 8, bobY + 6, 4, 4, '#fff');
      break;
    case 'weapon_machinegun':
      px(ctx, x + 4, bobY + 2, 12, 16, '#ffaa00');
      px(ctx, x + 6, bobY + 4, 8, 12, '#ffcc44');
      px(ctx, x + 8, bobY + 6, 4, 4, '#fff');
      break;
    case 'weapon_flame':
      px(ctx, x + 4, bobY + 2, 12, 16, '#ff4400');
      px(ctx, x + 6, bobY + 4, 8, 12, '#ff6622');
      px(ctx, x + 8, bobY + 6, 4, 4, '#fff');
      break;
    case 'health':
      px(ctx, x + 2, bobY + 4, 16, 12, '#2d6a4f');
      px(ctx, x + 4, bobY + 6, 12, 8, '#44aa66');
      px(ctx, x + 8, bobY + 4, 4, 12, '#fff');
      px(ctx, x + 4, bobY + 8, 12, 4, '#fff');
      break;
    case 'shield':
      px(ctx, x + 4, bobY + 2, 12, 16, '#4fc3f7');
      px(ctx, x + 6, bobY + 4, 8, 12, '#80deea');
      px(ctx, x + 8, bobY + 8, 4, 4, '#fff');
      break;
    case 'bomb':
      px(ctx, x + 4, bobY + 2, 12, 16, '#ffd700');
      px(ctx, x + 6, bobY + 4, 8, 12, '#ffed4a');
      px(ctx, x + 8, bobY + 6, 4, 4, '#ff4422');
      break;
  }

  ctx.restore();
}

export function drawParticle(ctx: CanvasRenderingContext2D, particle: Particle) {
  ctx.globalAlpha = particle.life / particle.maxLife;
  ctx.fillStyle = particle.color;
  ctx.fillRect(Math.floor(particle.x), Math.floor(particle.y), particle.size, particle.size);
  ctx.globalAlpha = 1;
}
