import { TileType, Enemy, Item } from './types';

const TILE_SIZE = 20;

const SPRITE_COLORS = {
  player: {
    skin: '#f5d0a9',
    hair: '#4a3728',
    shirt: '#4fc3f7',
    pants: '#2c3e50',
    eyes: '#2c3e50',
  },
  rat: {
    body: '#8B7355',
    eyes: '#ff0000',
    nose: '#ffb6c1',
  },
  bat: {
    body: '#696969',
    wings: '#4a4a4a',
    eyes: '#ff0000',
  },
  skeleton: {
    bone: '#D3D3D3',
    eyes: '#ff0000',
  },
  goblin: {
    skin: '#228B22',
    eyes: '#ffff00',
  },
  orc: {
    skin: '#556B2F',
    tusks: '#ffffcc',
  },
  mage: {
    robe: '#8A2BE2',
    eyes: '#ffff00',
    staff: '#8B4513',
  },
  demon: {
    body: '#DC143C',
    horns: '#8B0000',
    eyes: '#ffff00',
  },
  boss1: {
    body: '#FFD700',
    crown: '#8B0000',
    eyes: '#ff0000',
  },
  boss2: {
    body: '#FF4500',
    cloak: '#4B0082',
    eyes: '#ffffff',
  },
  boss3: {
    body: '#8B0000',
    flames: '#ff4500',
    eyes: '#ffffff',
  },
  potion: {
    glass: '#2d6a4f',
    liquid: '#90EE90',
    cap: '#8B4513',
  },
  potionRed: {
    glass: '#e94560',
    liquid: '#ff6b6b',
    cap: '#8B4513',
  },
  scroll: {
    paper: '#f5deb3',
    ink: '#4a3a2a',
  },
  sword: {
    blade: '#C0C0C0',
    hilt: '#8B4513',
    gem: '#4169E1',
  },
  armor: {
    metal: '#708090',
    strap: '#8B4513',
  },
};

function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size = 2): void {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
}

function drawPlayer(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const p = SPRITE_COLORS.player;
  const s = 2;

  drawPixel(ctx, px + 6 * s, py + 0, p.hair, s);
  drawPixel(ctx, px + 8 * s, py + 0, p.hair, s);
  drawPixel(ctx, px + 6 * s, py + 2 * s, p.hair, s);
  drawPixel(ctx, px + 8 * s, py + 2 * s, p.hair, s);

  drawPixel(ctx, px + 6 * s, py + 4 * s, p.skin, s);
  drawPixel(ctx, px + 8 * s, py + 4 * s, p.skin, s);
  drawPixel(ctx, px + 6 * s, py + 6 * s, p.skin, s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, p.skin, s);

  drawPixel(ctx, px + 7 * s, py + 5 * s, p.eyes, s);

  drawPixel(ctx, px + 4 * s, py + 8 * s, p.shirt, s);
  drawPixel(ctx, px + 6 * s, py + 8 * s, p.shirt, s);
  drawPixel(ctx, px + 8 * s, py + 8 * s, p.shirt, s);
  drawPixel(ctx, px + 10 * s, py + 8 * s, p.shirt, s);
  drawPixel(ctx, px + 4 * s, py + 10 * s, p.shirt, s);
  drawPixel(ctx, px + 6 * s, py + 10 * s, p.shirt, s);
  drawPixel(ctx, px + 8 * s, py + 10 * s, p.shirt, s);
  drawPixel(ctx, px + 10 * s, py + 10 * s, p.shirt, s);

  drawPixel(ctx, px + 6 * s, py + 12 * s, p.pants, s);
  drawPixel(ctx, px + 8 * s, py + 12 * s, p.pants, s);
  drawPixel(ctx, px + 6 * s, py + 14 * s, p.pants, s);
  drawPixel(ctx, px + 8 * s, py + 14 * s, p.pants, s);

  drawPixel(ctx, px + 6 * s, py + 16 * s, '#4a3728', s);
  drawPixel(ctx, px + 8 * s, py + 16 * s, '#4a3728', s);
}

function drawRat(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const r = SPRITE_COLORS.rat;
  const s = 2;

  drawPixel(ctx, px + 8 * s, py + 4 * s, r.body, s);
  drawPixel(ctx, px + 10 * s, py + 4 * s, r.body, s);
  drawPixel(ctx, px + 6 * s, py + 6 * s, r.body, s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, r.body, s);
  drawPixel(ctx, px + 10 * s, py + 6 * s, r.body, s);
  drawPixel(ctx, px + 12 * s, py + 6 * s, r.body, s);
  drawPixel(ctx, px + 6 * s, py + 8 * s, r.body, s);
  drawPixel(ctx, px + 8 * s, py + 8 * s, r.nose, s);
  drawPixel(ctx, px + 10 * s, py + 8 * s, r.body, s);

  drawPixel(ctx, px + 7 * s, py + 5 * s, r.eyes, s);
  drawPixel(ctx, px + 11 * s, py + 5 * s, r.eyes, s);

  drawPixel(ctx, px + 14 * s, py + 6 * s, r.body, s);
  drawPixel(ctx, px + 14 * s, py + 8 * s, r.body, s);
}

function drawBat(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const b = SPRITE_COLORS.bat;
  const s = 2;

  for (let i = 0; i < 3; i++) {
    drawPixel(ctx, px + (2 + i) * s, py + 4 * s, b.wings, s);
    drawPixel(ctx, px + (10 + i) * s, py + 4 * s, b.wings, s);
  }
  for (let i = 0; i < 2; i++) {
    drawPixel(ctx, px + (0 + i) * s, py + 6 * s, b.wings, s);
    drawPixel(ctx, px + (12 + i) * s, py + 6 * s, b.wings, s);
  }

  drawPixel(ctx, px + 6 * s, py + 6 * s, b.body, s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, b.body, s);

  drawPixel(ctx, px + 6 * s, py + 4 * s, b.body, s);
  drawPixel(ctx, px + 8 * s, py + 4 * s, b.body, s);

  drawPixel(ctx, px + 7 * s, py + 7 * s, b.eyes, s);
  drawPixel(ctx, px + 9 * s, py + 7 * s, b.eyes, s);
}

function drawSkeleton(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const sk = SPRITE_COLORS.skeleton;
  const s = 2;

  drawPixel(ctx, px + 6 * s, py + 2 * s, sk.bone, s);
  drawPixel(ctx, px + 8 * s, py + 2 * s, sk.bone, s);
  drawPixel(ctx, px + 6 * s, py + 4 * s, sk.bone, s);
  drawPixel(ctx, px + 8 * s, py + 4 * s, sk.bone, s);

  drawPixel(ctx, px + 5 * s, py + 6 * s, sk.bone, s);
  drawPixel(ctx, px + 6 * s, py + 6 * s, sk.bone, s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, sk.bone, s);
  drawPixel(ctx, px + 9 * s, py + 6 * s, sk.bone, s);

  drawPixel(ctx, px + 6 * s, py + 8 * s, sk.bone, s);
  drawPixel(ctx, px + 8 * s, py + 8 * s, sk.bone, s);

  drawPixel(ctx, px + 7 * s, py + 5 * s, sk.eyes, s);
  drawPixel(ctx, px + 9 * s, py + 5 * s, sk.eyes, s);

  drawPixel(ctx, px + 7 * s, py + 10 * s, sk.bone, s);
  drawPixel(ctx, px + 7 * s, py + 12 * s, sk.bone, s);

  drawPixel(ctx, px + 5 * s, py + 10 * s, sk.bone, s);
  drawPixel(ctx, px + 9 * s, py + 10 * s, sk.bone, s);

  drawPixel(ctx, px + 6 * s, py + 14 * s, sk.bone, s);
  drawPixel(ctx, px + 8 * s, py + 14 * s, sk.bone, s);
}

function drawGoblin(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const g = SPRITE_COLORS.goblin;
  const s = 2;

  drawPixel(ctx, px + 4 * s, py + 2 * s, g.skin, s);
  drawPixel(ctx, px + 6 * s, py + 4 * s, g.skin, s);
  drawPixel(ctx, px + 8 * s, py + 4 * s, g.skin, s);
  drawPixel(ctx, px + 10 * s, py + 2 * s, g.skin, s);

  drawPixel(ctx, px + 6 * s, py + 6 * s, g.skin, s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, g.skin, s);

  drawPixel(ctx, px + 7 * s, py + 5 * s, g.eyes, s);
  drawPixel(ctx, px + 9 * s, py + 5 * s, g.eyes, s);

  drawPixel(ctx, px + 5 * s, py + 8 * s, g.skin, s);
  drawPixel(ctx, px + 9 * s, py + 8 * s, g.skin, s);
  drawPixel(ctx, px + 6 * s, py + 8 * s, '#2a2a2a', s);
  drawPixel(ctx, px + 8 * s, py + 8 * s, '#2a2a2a', s);

  drawPixel(ctx, px + 6 * s, py + 10 * s, g.skin, s);
  drawPixel(ctx, px + 8 * s, py + 10 * s, g.skin, s);

  drawPixel(ctx, px + 6 * s, py + 12 * s, '#556B2F', s);
  drawPixel(ctx, px + 8 * s, py + 12 * s, '#556B2F', s);
}

function drawOrc(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const o = SPRITE_COLORS.orc;
  const s = 2;

  drawPixel(ctx, px + 4 * s, py + 2 * s, o.skin, s);
  drawPixel(ctx, px + 6 * s, py + 2 * s, o.skin, s);
  drawPixel(ctx, px + 8 * s, py + 2 * s, o.skin, s);
  drawPixel(ctx, px + 10 * s, py + 2 * s, o.skin, s);

  drawPixel(ctx, px + 4 * s, py + 4 * s, o.skin, s);
  drawPixel(ctx, px + 6 * s, py + 4 * s, o.skin, s);
  drawPixel(ctx, px + 8 * s, py + 4 * s, o.skin, s);
  drawPixel(ctx, px + 10 * s, py + 4 * s, o.skin, s);

  drawPixel(ctx, px + 5 * s, py + 6 * s, o.skin, s);
  drawPixel(ctx, px + 6 * s, py + 6 * s, o.skin, s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, o.skin, s);
  drawPixel(ctx, px + 9 * s, py + 6 * s, o.skin, s);

  drawPixel(ctx, px + 6 * s, py + 5 * s, '#ff0000', s);
  drawPixel(ctx, px + 8 * s, py + 5 * s, '#ff0000', s);

  drawPixel(ctx, px + 6 * s, py + 8 * s, o.skin, s);
  drawPixel(ctx, px + 8 * s, py + 8 * s, o.skin, s);

  drawPixel(ctx, px + 5 * s, py + 7 * s, o.tusks, s);
  drawPixel(ctx, px + 9 * s, py + 7 * s, o.tusks, s);

  drawPixel(ctx, px + 4 * s, py + 10 * s, '#3d3d3d', s);
  drawPixel(ctx, px + 6 * s, py + 10 * s, '#3d3d3d', s);
  drawPixel(ctx, px + 8 * s, py + 10 * s, '#3d3d3d', s);
  drawPixel(ctx, px + 10 * s, py + 10 * s, '#3d3d3d', s);
}

function drawMage(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const m = SPRITE_COLORS.mage;
  const s = 2;

  drawPixel(ctx, px + 6 * s, py + 0, m.robe, s);
  drawPixel(ctx, px + 8 * s, py + 0, m.robe, s);

  drawPixel(ctx, px + 4 * s, py + 2 * s, m.robe, s);
  drawPixel(ctx, px + 6 * s, py + 2 * s, m.robe, s);
  drawPixel(ctx, px + 8 * s, py + 2 * s, m.robe, s);
  drawPixel(ctx, px + 10 * s, py + 2 * s, m.robe, s);

  drawPixel(ctx, px + 6 * s, py + 4 * s, m.robe, s);
  drawPixel(ctx, px + 8 * s, py + 4 * s, m.robe, s);

  drawPixel(ctx, px + 7 * s, py + 3 * s, m.eyes, s);
  drawPixel(ctx, px + 9 * s, py + 3 * s, m.eyes, s);

  drawPixel(ctx, px + 6 * s, py + 6 * s, m.robe, s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, m.robe, s);
  drawPixel(ctx, px + 10 * s, py + 6 * s, m.robe, s);

  drawPixel(ctx, px + 6 * s, py + 8 * s, m.robe, s);
  drawPixel(ctx, px + 8 * s, py + 8 * s, m.robe, s);
  drawPixel(ctx, px + 10 * s, py + 8 * s, m.robe, s);

  drawPixel(ctx, px + 11 * s, py + 4 * s, m.staff, s);
  drawPixel(ctx, px + 11 * s, py + 6 * s, m.staff, s);
  drawPixel(ctx, px + 11 * s, py + 8 * s, m.staff, s);
  drawPixel(ctx, px + 11 * s, py + 10 * s, m.staff, s);
  drawPixel(ctx, px + 10 * s, py + 2 * s, m.eyes, s);
}

function drawDemon(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const d = SPRITE_COLORS.demon;
  const s = 2;

  drawPixel(ctx, px + 4 * s, py + 0, d.horns, s);
  drawPixel(ctx, px + 10 * s, py + 0, d.horns, s);

  drawPixel(ctx, px + 4 * s, py + 2 * s, d.body, s);
  drawPixel(ctx, px + 6 * s, py + 2 * s, d.body, s);
  drawPixel(ctx, px + 8 * s, py + 2 * s, d.body, s);
  drawPixel(ctx, px + 10 * s, py + 2 * s, d.body, s);

  drawPixel(ctx, px + 4 * s, py + 4 * s, d.body, s);
  drawPixel(ctx, px + 6 * s, py + 4 * s, d.body, s);
  drawPixel(ctx, px + 8 * s, py + 4 * s, d.body, s);
  drawPixel(ctx, px + 10 * s, py + 4 * s, d.body, s);

  drawPixel(ctx, px + 6 * s, py + 6 * s, d.body, s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, d.body, s);

  drawPixel(ctx, px + 7 * s, py + 3 * s, d.eyes, s);
  drawPixel(ctx, px + 9 * s, py + 3 * s, d.eyes, s);

  drawPixel(ctx, px + 4 * s, py + 8 * s, d.body, s);
  drawPixel(ctx, px + 10 * s, py + 8 * s, d.body, s);
  drawPixel(ctx, px + 6 * s, py + 8 * s, d.body, s);
  drawPixel(ctx, px + 8 * s, py + 8 * s, d.body, s);

  drawPixel(ctx, px + 4 * s, py + 10 * s, d.body, s);
  drawPixel(ctx, px + 10 * s, py + 10 * s, d.body, s);
}

function drawBoss1(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const b = SPRITE_COLORS.boss1;
  const s = 2;

  drawPixel(ctx, px + 5 * s, py + 0, b.crown, s);
  drawPixel(ctx, px + 7 * s, py + 0, b.crown, s);
  drawPixel(ctx, px + 9 * s, py + 0, b.crown, s);
  drawPixel(ctx, px + 7 * s, py + 2 * s, b.crown, s);

  drawPixel(ctx, px + 4 * s, py + 2 * s, b.body, s);
  drawPixel(ctx, px + 6 * s, py + 2 * s, b.body, s);
  drawPixel(ctx, px + 8 * s, py + 2 * s, b.body, s);
  drawPixel(ctx, px + 10 * s, py + 2 * s, b.body, s);

  drawPixel(ctx, px + 4 * s, py + 4 * s, b.body, s);
  drawPixel(ctx, px + 6 * s, py + 4 * s, b.body, s);
  drawPixel(ctx, px + 8 * s, py + 4 * s, b.body, s);
  drawPixel(ctx, px + 10 * s, py + 4 * s, b.body, s);

  drawPixel(ctx, px + 6 * s, py + 6 * s, b.body, s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, b.body, s);

  drawPixel(ctx, px + 7 * s, py + 3 * s, b.eyes, s);
  drawPixel(ctx, px + 9 * s, py + 3 * s, b.eyes, s);

  for (let i = 0; i < 4; i++) {
    drawPixel(ctx, px + (4 + i * 2) * s, py + 8 * s, b.body, s);
    drawPixel(ctx, px + (4 + i * 2) * s, py + 10 * s, b.body, s);
  }

  drawPixel(ctx, px + 6 * s, py + 12 * s, b.body, s);
  drawPixel(ctx, px + 8 * s, py + 12 * s, b.body, s);
}

function drawPotion(ctx: CanvasRenderingContext2D, px: number, py: number, color: string): void {
  const s = 2;

  drawPixel(ctx, px + 7 * s, py + 0, '#8B4513', s);
  drawPixel(ctx, px + 8 * s, py + 0, '#8B4513', s);

  drawPixel(ctx, px + 7 * s, py + 2 * s, '#8B4513', s);
  drawPixel(ctx, px + 8 * s, py + 2 * s, '#8B4513', s);

  drawPixel(ctx, px + 6 * s, py + 4 * s, color, s);
  drawPixel(ctx, px + 7 * s, py + 4 * s, color, s);
  drawPixel(ctx, px + 8 * s, py + 4 * s, color, s);
  drawPixel(ctx, px + 9 * s, py + 4 * s, color, s);

  drawPixel(ctx, px + 5 * s, py + 6 * s, color, s);
  drawPixel(ctx, px + 6 * s, py + 6 * s, color, s);
  drawPixel(ctx, px + 7 * s, py + 6 * s, color, s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, color, s);
  drawPixel(ctx, px + 9 * s, py + 6 * s, color, s);
  drawPixel(ctx, px + 10 * s, py + 6 * s, color, s);

  drawPixel(ctx, px + 6 * s, py + 8 * s, color, s);
  drawPixel(ctx, px + 7 * s, py + 8 * s, color, s);
  drawPixel(ctx, px + 8 * s, py + 8 * s, color, s);
  drawPixel(ctx, px + 9 * s, py + 8 * s, color, s);

  drawPixel(ctx, px + 7 * s, py + 10 * s, color, s);
  drawPixel(ctx, px + 8 * s, py + 10 * s, color, s);
}

function drawScroll(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const s = 2;

  drawPixel(ctx, px + 4 * s, py + 2 * s, '#f5deb3', s);
  drawPixel(ctx, px + 6 * s, py + 2 * s, '#f5deb3', s);
  drawPixel(ctx, px + 8 * s, py + 2 * s, '#f5deb3', s);
  drawPixel(ctx, px + 10 * s, py + 2 * s, '#f5deb3', s);

  drawPixel(ctx, px + 4 * s, py + 4 * s, '#f5deb3', s);
  drawPixel(ctx, px + 6 * s, py + 4 * s, '#4a3a2a', s);
  drawPixel(ctx, px + 8 * s, py + 4 * s, '#4a3a2a', s);
  drawPixel(ctx, px + 10 * s, py + 4 * s, '#f5deb3', s);

  drawPixel(ctx, px + 4 * s, py + 6 * s, '#f5deb3', s);
  drawPixel(ctx, px + 6 * s, py + 6 * s, '#4a3a2a', s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, '#4a3a2a', s);
  drawPixel(ctx, px + 10 * s, py + 6 * s, '#f5deb3', s);

  drawPixel(ctx, px + 4 * s, py + 8 * s, '#f5deb3', s);
  drawPixel(ctx, px + 6 * s, py + 8 * s, '#f5deb3', s);
  drawPixel(ctx, px + 8 * s, py + 8 * s, '#f5deb3', s);
  drawPixel(ctx, px + 10 * s, py + 8 * s, '#f5deb3', s);
}

function drawSword(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const s = 2;

  drawPixel(ctx, px + 7 * s, py + 0, '#C0C0C0', s);
  drawPixel(ctx, px + 7 * s, py + 2 * s, '#C0C0C0', s);
  drawPixel(ctx, px + 7 * s, py + 4 * s, '#C0C0C0', s);
  drawPixel(ctx, px + 7 * s, py + 6 * s, '#C0C0C0', s);
  drawPixel(ctx, px + 7 * s, py + 8 * s, '#C0C0C0', s);

  drawPixel(ctx, px + 6 * s, py + 10 * s, '#8B4513', s);
  drawPixel(ctx, px + 8 * s, py + 10 * s, '#8B4513', s);

  drawPixel(ctx, px + 6 * s, py + 12 * s, '#8B4513', s);
  drawPixel(ctx, px + 7 * s, py + 12 * s, '#4169E1', s);
  drawPixel(ctx, px + 8 * s, py + 12 * s, '#8B4513', s);
}

function drawArmor(ctx: CanvasRenderingContext2D, px: number, py: number): void {
  const s = 2;

  drawPixel(ctx, px + 5 * s, py + 4 * s, '#708090', s);
  drawPixel(ctx, px + 7 * s, py + 4 * s, '#708090', s);
  drawPixel(ctx, px + 9 * s, py + 4 * s, '#708090', s);

  drawPixel(ctx, px + 4 * s, py + 6 * s, '#708090', s);
  drawPixel(ctx, px + 6 * s, py + 6 * s, '#708090', s);
  drawPixel(ctx, px + 8 * s, py + 6 * s, '#708090', s);
  drawPixel(ctx, px + 10 * s, py + 6 * s, '#708090', s);

  drawPixel(ctx, px + 4 * s, py + 8 * s, '#708090', s);
  drawPixel(ctx, px + 6 * s, py + 8 * s, '#708090', s);
  drawPixel(ctx, px + 8 * s, py + 8 * s, '#708090', s);
  drawPixel(ctx, px + 10 * s, py + 8 * s, '#708090', s);

  drawPixel(ctx, px + 5 * s, py + 10 * s, '#708090', s);
  drawPixel(ctx, px + 7 * s, py + 10 * s, '#708090', s);
  drawPixel(ctx, px + 9 * s, py + 10 * s, '#708090', s);

  drawPixel(ctx, px + 4 * s, py + 7 * s, '#8B4513', s);
  drawPixel(ctx, px + 10 * s, py + 7 * s, '#8B4513', s);
}

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  type: string,
  x: number,
  y: number,
  isBoss = false,
): void {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;

  switch (type) {
    case 'rat':
      drawRat(ctx, px, py);
      break;
    case 'bat':
      drawBat(ctx, px, py);
      break;
    case 'skeleton':
      drawSkeleton(ctx, px, py);
      break;
    case 'goblin':
      drawGoblin(ctx, px, py);
      break;
    case 'orc':
      drawOrc(ctx, px, py);
      break;
    case 'mage':
      drawMage(ctx, px, py);
      break;
    case 'demon':
      drawDemon(ctx, px, py);
      break;
    case 'boss':
      if (isBoss) {
        drawBoss1(ctx, px, py);
      } else {
        drawDemon(ctx, px, py);
      }
      break;
    default:
      drawRat(ctx, px, py);
  }
}

export function drawItem(
  ctx: CanvasRenderingContext2D,
  item: Item,
  x: number,
  y: number,
): void {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;

  switch (item.effect) {
    case 'heal':
      drawPotion(ctx, px, py, '#2d6a4f');
      break;
    case 'strength':
      drawPotion(ctx, px, py, '#e94560');
      break;
    case 'fireball':
    case 'teleport':
      drawScroll(ctx, px, py);
      break;
    case 'weapon':
      drawSword(ctx, px, py);
      break;
    case 'armor':
      drawArmor(ctx, px, py);
      break;
    default:
      drawPotion(ctx, px, py, '#2d6a4f');
  }
}

export function drawPlayerSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
): void {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;
  drawPlayer(ctx, px, py);
}
