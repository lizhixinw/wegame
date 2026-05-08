import { useRef, useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameState, InputState, Player, Bullet, Enemy, Pickup, Particle, Camera, LevelData } from '../game/types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PLAYER_SPEED, PLAYER_JUMP, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_MAX_HP, PLAYER_START_LIVES, PLAYER_INVINCIBLE_TIME, WEAPON_CONFIG, ENEMY_CONFIG, SCREEN_SHAKE_DECAY, DEATH_ANIM_TIME, LEVEL_COMPLETE_TIME, PICKUP_SIZE } from '../game/constants';
import { createInputState, setupInputListeners } from '../game/input';
import { updatePlayerPhysics, updateEnemyPhysics, updateBullets, updateParticles, updatePlatforms, checkBulletEnemyCollisions, checkBulletPlayerCollisions, checkPlayerPickupCollisions, checkPlayerEnemyCollisions } from '../game/physics';
import { createPlayerBullets } from '../game/weapons';
import { createEnemy, updateEnemyAI } from '../game/enemies';
import { getLevel } from '../game/levels';
import { createExplosion, createMuzzleFlash, createHitSpark, createDeathExplosion, createPickupEffect } from '../game/particles';
import { render } from '../game/renderer';
import { saveScore } from '../store/gameStore';

function createPlayer(level: LevelData): Player {
  return {
    x: 50, y: 200, vx: 0, vy: 0,
    width: PLAYER_WIDTH, height: PLAYER_HEIGHT,
    hp: PLAYER_MAX_HP, maxHp: PLAYER_MAX_HP,
    lives: PLAYER_START_LIVES, score: 0,
    weapon: 'rifle', onGround: false,
    facingRight: true, isCrouching: false,
    invincibleTimer: 60, shootCooldown: 0,
    animFrame: 0, animTimer: 0,
  };
}

function initLevel(levelIndex: number, existingPlayer?: Player): GameState {
  const level = getLevel(levelIndex);
  const player = existingPlayer || createPlayer(level);
  player.x = 50;
  player.y = 200;
  player.vx = 0;
  player.vy = 0;

  let enemyId = 0;
  let pickupId = 0;

  const enemies: Enemy[] = level.enemySpawns.map(spawn => {
    const config = spawn.isBoss ? ENEMY_CONFIG.boss : ENEMY_CONFIG[spawn.type];
    return {
      id: enemyId++,
      type: spawn.type,
      x: spawn.x,
      y: spawn.y || (CANVAS_HEIGHT - 32 - config.height),
      vx: spawn.type === 'soldier' ? (Math.random() > 0.5 ? 1 : -1) * config.speed : 0,
      vy: 0,
      width: config.width,
      height: config.height,
      hp: config.hp,
      maxHp: config.hp,
      shootTimer: Math.floor(Math.random() * config.shootInterval),
      shootInterval: config.shootInterval,
      facingRight: false,
      isBoss: spawn.isBoss,
      active: false,
      animFrame: 0,
      animTimer: 0,
      patrolDir: 1,
      patrolTimer: 0,
      onGround: false,
    };
  });

  const pickups: Pickup[] = level.pickupSpawns.map(spawn => ({
    id: pickupId++,
    type: spawn.type,
    x: spawn.x,
    y: spawn.y,
    width: PICKUP_SIZE,
    height: PICKUP_SIZE,
    collected: false,
    bobTimer: 0,
  }));

  return {
    player,
    bullets: [],
    enemies,
    particles: [],
    pickups,
    camera: { x: 0, y: 0, shake: 0, shakeX: 0, shakeY: 0 },
    level,
    levelIndex,
    score: player.score,
    kills: 0,
    phase: 'playing',
    screenFlash: 0,
    bulletIdCounter: 1000,
    enemyIdCounter: enemyId,
    pickupIdCounter: pickupId,
    deathTimer: 0,
    levelCompleteTimer: 0,
  };
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameStateRef = useRef<GameState | null>(null);
  const inputRef = useRef<InputState>(createInputState());
  const frameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const updateHUD = useGameStore(s => s.updateHUD);
  const setPhase = useGameStore(s => s.setPhase);
  const phase = useGameStore(s => s.phase);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (phase !== 'playing') {
      frameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    if (!gameStateRef.current) {
      gameStateRef.current = initLevel(0);
    }

    const state = gameStateRef.current;
    const input = inputRef.current;
    timeRef.current++;

    if (state.phase === 'playing') {
      let player = { ...state.player };

      player.vx = 0;
      if (input.left) { player.vx = -PLAYER_SPEED; player.facingRight = false; }
      if (input.right) { player.vx = PLAYER_SPEED; player.facingRight = true; }

      player.isCrouching = input.down && player.onGround;
      if (player.isCrouching) player.vx *= 0.3;

      if (input.jump && player.onGround) {
        player.vy = PLAYER_JUMP;
        player.onGround = false;
      }

      if (player.invincibleTimer > 0) player.invincibleTimer--;
      if (player.shootCooldown > 0) player.shootCooldown--;

      player.animTimer++;
      if (player.animTimer > 8) { player.animFrame++; player.animTimer = 0; }

      const platforms = updatePlatforms(state.level.platforms);
      player = updatePlayerPhysics(player, platforms, state.level.width);

      let bullets = [...state.bullets];
      let newBulletId = state.bulletIdCounter;

      if (input.shoot && player.shootCooldown <= 0) {
        const weaponConfig = WEAPON_CONFIG[player.weapon];
        player.shootCooldown = weaponConfig.cooldown;

        let aimDx = player.facingRight ? 1 : -1;
        let aimDy = 0;
        if (input.up) { aimDy = -1; if (!input.left && !input.right) aimDx = 0; }
        if (input.down && !player.onGround) { aimDy = 1; if (!input.left && !input.right) aimDx = 0; }

        const result = createPlayerBullets(player, aimDx, aimDy, newBulletId);
        bullets.push(...result.bullets);
        newBulletId = result.newIdCounter;

        const muzzleParticles = createMuzzleFlash(
          player.facingRight ? player.x + player.width : player.x,
          player.y + (player.isCrouching ? 10 : 12),
          player.facingRight
        );
        state.particles.push(...muzzleParticles);
      }

      bullets = updateBullets(bullets, state.level.width);

      let enemies = state.enemies.map(e => ({ ...e }));
      let newEnemyId = state.enemyIdCounter;
      let enemyBullets: Bullet[] = [];

      for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].hp <= 0 || !enemies[i].active) continue;
        const aiResult = updateEnemyAI(enemies[i], player, state.camera.x, newEnemyId);
        enemies[i] = aiResult.enemy;
        enemyBullets.push(...aiResult.bullets);
        newEnemyId = aiResult.newIdCounter;
      }
      bullets.push(...enemyBullets);

      enemies = enemies.map(e => updateEnemyPhysics(e, platforms, state.level.width));

      const hitResult = checkBulletEnemyCollisions(bullets, enemies);
      bullets = hitResult.bullets;
      enemies = hitResult.enemies;

      let particles = [...state.particles];
      let kills = state.kills;
      let score = state.score;

      for (const hit of hitResult.hits) {
        particles.push(...createHitSpark(hit.x, hit.y));
      }

      for (const enemy of enemies) {
        if (enemy.hp <= 0 && state.enemies.find(e => e.id === enemy.id && e.hp > 0)) {
          const config = enemy.isBoss ? ENEMY_CONFIG.boss : ENEMY_CONFIG[enemy.type];
          particles.push(...createDeathExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, enemy.isBoss));
          kills++;
          score += config.score;
          state.camera.shake = enemy.isBoss ? 15 : 5;
        }
      }

      const playerHitResult = checkBulletPlayerCollisions(bullets, player);
      bullets = playerHitResult.bullets;

      const enemyContact = checkPlayerEnemyCollisions(player, enemies);

      if (playerHitResult.hit || enemyContact) {
        player.hp--;
        player.invincibleTimer = PLAYER_INVINCIBLE_TIME;
        state.camera.shake = 8;
        particles.push(...createExplosion(player.x + player.width / 2, player.y + player.height / 2, 8, '#ff4444'));
      }

      const pickupResult = checkPlayerPickupCollisions(player, state.pickups);
      player = pickupResult.player;
      const newPickups = pickupResult.pickups;

      for (const pk of pickupResult.collected) {
        const color = pk.type.startsWith('weapon') ? '#ffd700' : pk.type === 'health' ? '#44aa66' : pk.type === 'shield' ? '#4fc3f7' : '#ff4422';
        particles.push(...createPickupEffect(pk.x + pk.width / 2, pk.y + pk.height / 2, color));

        if (pk.type === 'bomb') {
          for (const enemy of enemies) {
            if (enemy.hp > 0 && enemy.active) {
              enemy.hp = 0;
              particles.push(...createDeathExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, false));
              kills++;
              const config = enemy.isBoss ? ENEMY_CONFIG.boss : ENEMY_CONFIG[enemy.type];
              score += config.score;
            }
          }
          state.camera.shake = 12;
          state.screenFlash = 10;
        }
      }

      particles = updateParticles(particles);

      let camera = { ...state.camera };
      const targetCamX = player.x - CANVAS_WIDTH / 3;
      camera.x += (targetCamX - camera.x) * 0.1;
      camera.x = Math.max(0, Math.min(camera.x, state.level.width - CANVAS_WIDTH));
      camera.y = 0;

      if (camera.shake > 0) {
        camera.shakeX = (Math.random() - 0.5) * camera.shake * 2;
        camera.shakeY = (Math.random() - 0.5) * camera.shake * 2;
        camera.shake *= SCREEN_SHAKE_DECAY;
        if (camera.shake < 0.5) camera.shake = 0;
      } else {
        camera.shakeX = 0;
        camera.shakeY = 0;
      }

      let screenFlash = state.screenFlash;
      if (screenFlash > 0) screenFlash--;

      let newPhase = state.phase;
      let deathTimer = state.deathTimer;
      let levelCompleteTimer = state.levelCompleteTimer;

      if (player.hp <= 0) {
        player.lives--;
        if (player.lives <= 0) {
          newPhase = 'dying';
          deathTimer = DEATH_ANIM_TIME;
        } else {
          player.hp = player.maxHp;
          player.invincibleTimer = PLAYER_INVINCIBLE_TIME;
          player.weapon = 'rifle';
        }
      }

      const bossTriggered = player.x >= state.level.bossTriggerX;
      const bossAlive = enemies.some(e => e.isBoss && e.hp > 0);
      const allEnemiesDead = !enemies.some(e => e.hp > 0 && e.active);

      if (bossTriggered && !bossAlive && allEnemiesDead && state.enemies.some(e => e.isBoss)) {
        newPhase = 'levelComplete';
        levelCompleteTimer = LEVEL_COMPLETE_TIME;
        score += 1000;
      }

      gameStateRef.current = {
        player,
        bullets,
        enemies,
        particles,
        pickups: newPickups,
        camera,
        level: { ...state.level, platforms },
        levelIndex: state.levelIndex,
        score,
        kills,
        phase: newPhase,
        screenFlash,
        bulletIdCounter: newBulletId,
        enemyIdCounter: newEnemyId,
        pickupIdCounter: state.pickupIdCounter,
        deathTimer,
        levelCompleteTimer,
      };

      updateHUD({
        hp: player.hp,
        maxHp: player.maxHp,
        lives: player.lives,
        score,
        kills,
        weapon: player.weapon,
        levelName: state.level.name,
        levelIndex: state.levelIndex,
      });
    } else if (state.phase === 'dying') {
      let deathTimer = state.deathTimer - 1;
      if (deathTimer <= 0) {
        saveScore(state.score, state.levelIndex + 1);
        setPhase('gameover');
        gameStateRef.current = null;
        frameRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      gameStateRef.current = { ...state, deathTimer };
    } else if (state.phase === 'levelComplete') {
      let levelCompleteTimer = state.levelCompleteTimer - 1;
      if (levelCompleteTimer <= 0) {
        const nextLevel = state.levelIndex + 1;
        const newState = initLevel(nextLevel, { ...state.player, score: state.score, lives: state.player.lives, hp: state.player.maxHp, weapon: state.player.weapon });
        newState.kills = state.kills;
        newState.score = state.score;
        gameStateRef.current = newState;
        frameRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      gameStateRef.current = { ...state, levelCompleteTimer };
    }

    render(ctx, gameStateRef.current!, timeRef.current);
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [phase, updateHUD, setPhase]);

  useEffect(() => {
    if (phase === 'playing' && !gameStateRef.current) {
      gameStateRef.current = initLevel(0);
    }
    const cleanup = setupInputListeners(inputRef.current);
    frameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      cleanup();
      cancelAnimationFrame(frameRef.current);
    };
  }, [phase, gameLoop]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-2 border-[#2a2a4a] rounded-lg shadow-lg shadow-[#ff4422]/10"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
