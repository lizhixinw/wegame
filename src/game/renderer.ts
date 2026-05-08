import { GameState, Platform, Particle } from './types';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';
import { drawPlayer, drawEnemy, drawBullet, drawPickup, drawParticle } from './sprites';

function drawBackground(ctx: CanvasRenderingContext2D, cameraX: number, bgColor1: string, bgColor2: string, levelWidth: number) {
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  gradient.addColorStop(0, bgColor1);
  gradient.addColorStop(1, bgColor2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.fillStyle = bgColor1 + '44';
  for (let i = 0; i < 8; i++) {
    const starX = ((i * 137 + 50) % levelWidth - cameraX * 0.1);
    const starY = (i * 47 + 20) % 150;
    const sx = ((starX % CANVAS_WIDTH) + CANVAS_WIDTH) % CANVAS_WIDTH;
    ctx.fillRect(sx, starY, 2, 2);
  }

  ctx.fillStyle = bgColor2 + '66';
  for (let i = 0; i < 5; i++) {
    const mx = ((i * 200 + 100) - cameraX * 0.2) % (CANVAS_WIDTH + 200);
    const my = CANVAS_HEIGHT - 120 + i * 15;
    ctx.fillRect(mx, my, 80 + i * 20, 40);
  }

  ctx.fillStyle = bgColor1 + '88';
  for (let i = 0; i < 4; i++) {
    const tx = ((i * 300 + 50) - cameraX * 0.4) % (CANVAS_WIDTH + 300);
    const ty = CANVAS_HEIGHT - 80 + i * 10;
    ctx.fillRect(tx, ty, 60 + i * 30, 60);
  }
}

function drawPlatform(ctx: CanvasRenderingContext2D, plat: Platform, groundColor: string) {
  if (plat.type === 'ground') {
    ctx.fillStyle = groundColor;
    ctx.fillRect(Math.floor(plat.x), Math.floor(plat.y), plat.width, plat.height);
    ctx.fillStyle = groundColor + 'aa';
    ctx.fillRect(Math.floor(plat.x), Math.floor(plat.y), plat.width, 4);
    for (let i = 0; i < plat.width; i += 16) {
      ctx.fillStyle = groundColor + 'cc';
      ctx.fillRect(Math.floor(plat.x + i), Math.floor(plat.y + 4), 1, plat.height - 4);
    }
  } else {
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(Math.floor(plat.x), Math.floor(plat.y), plat.width, plat.height);
    ctx.fillStyle = '#A0826D';
    ctx.fillRect(Math.floor(plat.x), Math.floor(plat.y), plat.width, 2);
    ctx.fillStyle = '#6B5B45';
    ctx.fillRect(Math.floor(plat.x), Math.floor(plat.y + plat.height - 2), plat.width, 2);
    for (let i = 0; i < plat.width; i += 12) {
      ctx.fillStyle = '#7B6B55';
      ctx.fillRect(Math.floor(plat.x + i), Math.floor(plat.y + 2), 1, plat.height - 4);
    }
  }
}

export function render(ctx: CanvasRenderingContext2D, state: GameState, time: number) {
  const camX = state.camera.x + state.camera.shakeX;
  const camY = state.camera.y + state.camera.shakeY;

  drawBackground(ctx, camX, state.level.bgColor1, state.level.bgColor2, state.level.width);

  ctx.save();
  ctx.translate(-Math.floor(camX), -Math.floor(camY));

  for (const plat of state.level.platforms) {
    drawPlatform(ctx, plat, state.level.groundColor);
  }

  for (const pickup of state.pickups) {
    drawPickup(ctx, pickup, time);
  }

  for (const bullet of state.bullets) {
    drawBullet(ctx, bullet);
  }

  for (const enemy of state.enemies) {
    if (enemy.hp > 0 && enemy.active) {
      drawEnemy(ctx, enemy);
    }
  }

  if (state.player.hp > 0 || state.phase === 'dying') {
    drawPlayer(ctx, state.player, state.player.animFrame);
  }

  for (const particle of state.particles) {
    drawParticle(ctx, particle);
  }

  ctx.restore();

  if (state.screenFlash > 0) {
    ctx.fillStyle = `rgba(255,255,255,${state.screenFlash / 10})`;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  if (state.phase === 'levelComplete') {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#ffd700';
    ctx.font = '24px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('关卡通过!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    ctx.fillStyle = '#fff';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText('准备进入下一关...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
  }
}
