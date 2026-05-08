import { Particle } from './types';

export function createExplosion(x: number, y: number, count: number = 12, color: string = '#ff6622'): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const speed = 1 + Math.random() * 3;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 20 + Math.floor(Math.random() * 15),
      maxLife: 35,
      color,
      size: 2 + Math.random() * 3,
    });
  }
  return particles;
}

export function createMuzzleFlash(x: number, y: number, facingRight: boolean): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 4; i++) {
    particles.push({
      x: x + (facingRight ? 5 : -5),
      y: y + (Math.random() - 0.5) * 4,
      vx: (facingRight ? 1 : -1) * (2 + Math.random() * 2),
      vy: (Math.random() - 0.5) * 2,
      life: 5 + Math.floor(Math.random() * 5),
      maxLife: 10,
      color: '#ffee44',
      size: 2 + Math.random() * 2,
    });
  }
  return particles;
}

export function createHitSpark(x: number, y: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 2;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 8 + Math.floor(Math.random() * 8),
      maxLife: 16,
      color: '#ffffff',
      size: 1 + Math.random() * 2,
    });
  }
  return particles;
}

export function createDeathExplosion(x: number, y: number, isBoss: boolean = false): Particle[] {
  const count = isBoss ? 40 : 16;
  const particles: Particle[] = [];
  const colors = ['#ff4422', '#ff8844', '#ffcc22', '#ffffff'];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * (isBoss ? 5 : 3);
    particles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 25 + Math.floor(Math.random() * 20),
      maxLife: 45,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2 + Math.random() * (isBoss ? 5 : 3),
    });
  }
  return particles;
}

export function createPickupEffect(x: number, y: number, color: string): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 2,
      life: 15,
      maxLife: 15,
      color,
      size: 3,
    });
  }
  return particles;
}
