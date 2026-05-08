export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 450;
export const GRAVITY = 0.6;
export const PLAYER_SPEED = 3.5;
export const PLAYER_JUMP = -11;
export const PLAYER_WIDTH = 20;
export const PLAYER_HEIGHT = 32;
export const PLAYER_CROUCH_HEIGHT = 20;
export const PLAYER_MAX_HP = 3;
export const PLAYER_START_LIVES = 3;
export const PLAYER_INVINCIBLE_TIME = 90;
export const BULLET_SPEED = 8;
export const ENEMY_BULLET_SPEED = 4;

export const WEAPON_CONFIG = {
  rifle: { damage: 1, cooldown: 12, speed: 8, bulletSize: 4, spread: 0, count: 1, piercing: false, color: '#ffdd44' },
  spread: { damage: 1, cooldown: 15, speed: 7, bulletSize: 3, spread: 0.3, count: 5, piercing: false, color: '#ff6644' },
  laser: { damage: 2, cooldown: 20, speed: 12, bulletSize: 3, spread: 0, count: 1, piercing: true, color: '#00bfff' },
  machinegun: { damage: 1, cooldown: 5, speed: 9, bulletSize: 3, spread: 0.08, count: 1, piercing: false, color: '#ffaa00' },
  flame: { damage: 3, cooldown: 8, speed: 5, bulletSize: 8, spread: 0.15, count: 3, piercing: false, color: '#ff4400' },
} as const;

export const ENEMY_CONFIG = {
  soldier: { hp: 2, width: 18, height: 28, speed: 1.2, shootInterval: 80, score: 100 },
  turret: { hp: 4, width: 24, height: 24, speed: 0, shootInterval: 50, score: 200 },
  flyer: { hp: 1, width: 22, height: 16, speed: 2, shootInterval: 60, score: 150 },
  tank: { hp: 10, width: 40, height: 28, speed: 0.5, shootInterval: 70, score: 500 },
  boss: { hp: 50, width: 64, height: 64, speed: 0.8, shootInterval: 30, score: 2000 },
} as const;

export const PICKUP_SIZE = 20;
export const PICKUP_BOB_SPEED = 0.05;
export const PICKUP_BOB_RANGE = 4;

export const SCREEN_SHAKE_DECAY = 0.9;
export const DEATH_ANIM_TIME = 60;
export const LEVEL_COMPLETE_TIME = 120;

export const LEVEL_NAMES = ['丛林基地', '冰雪要塞', '熔岩工厂'] as const;
