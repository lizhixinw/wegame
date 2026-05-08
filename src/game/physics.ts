import { Player, Enemy, Bullet, Platform, Pickup, Particle } from './types';
import { GRAVITY, CANVAS_HEIGHT } from './constants';

export function aabb(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function updatePlayerPhysics(player: Player, platforms: Platform[], levelWidth: number): Player {
  let p = { ...player };

  p.vy += GRAVITY;
  if (p.vy > 12) p.vy = 12;

  p.x += p.vx;
  p.y += p.vy;

  if (p.x < 0) p.x = 0;
  if (p.x + p.width > levelWidth) p.x = levelWidth - p.width;

  p.onGround = false;

  const currentHeight = p.isCrouching ? 20 : 32;
  if (p.height !== currentHeight) {
    p.height = currentHeight;
    if (p.isCrouching) {
      p.y += 32 - 20;
    }
  }

  for (const plat of platforms) {
    if (!aabb(p.x, p.y, p.width, p.height, plat.x, plat.y, plat.width, plat.height)) continue;

    const prevBottom = p.y + p.height - p.vy;
    const prevRight = p.x + p.width - p.vx;
    const prevLeft = p.x - p.vx;

    if (p.vy > 0 && prevBottom <= plat.y + 2) {
      p.y = plat.y - p.height;
      p.vy = 0;
      p.onGround = true;
    } else if (p.vy < 0 && p.y - p.vy >= plat.y + plat.height - 2) {
      p.y = plat.y + plat.height;
      p.vy = 0;
    } else if (p.vx > 0 && prevRight <= plat.x + 2) {
      p.x = plat.x - p.width;
    } else if (p.vx < 0 && prevLeft >= plat.x + plat.width - 2) {
      p.x = plat.x + plat.width;
    }
  }

  if (p.y > CANVAS_HEIGHT + 50) {
    p.hp = 0;
  }

  return p;
}

export function updateEnemyPhysics(enemy: Enemy, platforms: Platform[], levelWidth: number): Enemy {
  let e = { ...enemy };

  if (e.type === 'flyer') {
    e.x += e.vx;
    e.y += e.vy;
    e.patrolTimer++;
    if (e.patrolTimer > 60) {
      e.vy = -e.vy;
      e.patrolTimer = 0;
    }
    return e;
  }

  if (e.type === 'turret') return e;

  e.vy += GRAVITY;
  if (e.vy > 10) e.vy = 10;

  e.x += e.vx;
  e.y += e.vy;

  e.onGround = false;

  for (const plat of platforms) {
    if (!aabb(e.x, e.y, e.width, e.height, plat.x, plat.y, plat.width, plat.height)) continue;

    const prevBottom = e.y + e.height - e.vy;

    if (e.vy > 0 && prevBottom <= plat.y + 2) {
      e.y = plat.y - e.height;
      e.vy = 0;
      e.onGround = true;
    }
  }

  if (e.type === 'soldier' && e.onGround) {
    e.patrolTimer++;
    if (e.patrolTimer > 120) {
      e.vx = -e.vx;
      e.facingRight = e.vx > 0;
      e.patrolTimer = 0;
    }

    let onPlatformEdge = true;
    for (const plat of platforms) {
      if (e.y + e.height >= plat.y - 2 && e.y + e.height <= plat.y + 4) {
        if (e.x + e.width > plat.x && e.x < plat.x + plat.width) {
          if (e.vx > 0 && e.x + e.width < plat.x + plat.width - 5) onPlatformEdge = false;
          if (e.vx < 0 && e.x > plat.x + 5) onPlatformEdge = false;
        }
      }
    }
    if (onPlatformEdge && e.onGround) {
      e.vx = -e.vx;
      e.facingRight = e.vx > 0;
    }
  }

  if (e.x < 0) e.x = 0;
  if (e.x + e.width > levelWidth) { e.x = levelWidth - e.width; e.vx = -e.vx; e.facingRight = !e.facingRight; }

  return e;
}

export function updateBullets(bullets: Bullet[], levelWidth: number): Bullet[] {
  return bullets
    .map(b => ({ ...b, x: b.x + b.vx, y: b.y + b.vy, life: b.life - 1 }))
    .filter(b => b.life > 0 && b.x > -20 && b.x < levelWidth + 20 && b.y > -20 && b.y < CANVAS_HEIGHT + 20);
}

export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.1, life: p.life - 1 }))
    .filter(p => p.life > 0);
}

export function updatePlatforms(platforms: Platform[]): Platform[] {
  return platforms.map(p => {
    if (!p.isMoving) return p;
    let np = { ...p, x: p.x + p.moveSpeed * p.moveDir };
    if (np.x > p.originX + p.moveRange || np.x < p.originX - p.moveRange) {
      np.moveDir = -np.moveDir;
    }
    return np;
  });
}

export function checkBulletEnemyCollisions(bullets: Bullet[], enemies: Enemy[]): { bullets: Bullet[]; enemies: Enemy[]; hits: { enemyId: number; damage: number; x: number; y: number }[] } {
  const hits: { enemyId: number; damage: number; x: number; y: number }[] = [];
  const remainingBullets: Bullet[] = [];
  const newEnemies = enemies.map(e => ({ ...e }));

  for (const bullet of bullets) {
    if (!bullet.fromPlayer) continue;
    let bulletHit = false;

    for (const enemy of newEnemies) {
      if (enemy.hp <= 0 || !enemy.active) continue;
      if (aabb(bullet.x, bullet.y, bullet.width, bullet.height, enemy.x, enemy.y, enemy.width, enemy.height)) {
        hits.push({ enemyId: enemy.id, damage: bullet.damage, x: bullet.x, y: bullet.y });
        enemy.hp -= bullet.damage;
        if (!bullet.piercing) {
          bulletHit = true;
          break;
        }
      }
    }

    if (!bulletHit) remainingBullets.push(bullet);
  }

  return { bullets: remainingBullets, enemies: newEnemies, hits };
}

export function checkBulletPlayerCollisions(bullets: Bullet[], player: Player): { bullets: Bullet[]; hit: boolean } {
  if (player.invincibleTimer > 0) return { bullets: [...bullets], hit: false };

  const remaining: Bullet[] = [];
  let hit = false;

  for (const bullet of bullets) {
    if (bullet.fromPlayer) { remaining.push(bullet); continue; }
    if (aabb(bullet.x, bullet.y, bullet.width, bullet.height, player.x, player.y, player.width, player.height)) {
      hit = true;
    } else {
      remaining.push(bullet);
    }
  }

  return { bullets: remaining, hit };
}

export function checkPlayerPickupCollisions(player: Player, pickups: Pickup[]): { player: Player; pickups: Pickup[]; collected: Pickup[] } {
  let p = { ...player };
  const newPickups = pickups.map(pk => ({ ...pk }));
  const collected: Pickup[] = [];

  for (const pk of newPickups) {
    if (pk.collected) continue;
    if (aabb(p.x, p.y, p.width, p.height, pk.x, pk.y, pk.width, pk.height)) {
      pk.collected = true;
      collected.push(pk);

      switch (pk.type) {
        case 'weapon_spread': p.weapon = 'spread'; break;
        case 'weapon_laser': p.weapon = 'laser'; break;
        case 'weapon_machinegun': p.weapon = 'machinegun'; break;
        case 'weapon_flame': p.weapon = 'flame'; break;
        case 'health': p.hp = Math.min(p.hp + 1, p.maxHp); break;
        case 'shield': p.invincibleTimer = 180; break;
        case 'bomb': break;
      }
    }
  }

  return { player: p, pickups: newPickups, collected };
}

export function checkPlayerEnemyCollisions(player: Player, enemies: Enemy[]): boolean {
  if (player.invincibleTimer > 0) return false;
  for (const e of enemies) {
    if (e.hp <= 0 || !e.active) continue;
    if (aabb(player.x, player.y, player.width, player.height, e.x, e.y, e.width, e.height)) {
      return true;
    }
  }
  return false;
}
