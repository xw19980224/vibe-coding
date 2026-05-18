<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';

defineOptions({ name: 'ParticleBg' });

const props = withDefaults(
  defineProps<{
    particleCount?: number;
    speed?: number;
  }>(),
  {
    particleCount: 60,
    speed: 0.6,
  },
);

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let animationId = 0;
let particles: Particle[] = [];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  char: string;
  updateTimer: number;
  updateInterval: number;
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function createParticle(w: number, h: number): Particle {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: 0,
    vy: (0.5 + Math.random() * 1.5) * props.speed,
    size: 10 + Math.random() * 8,
    opacity: 0.08 + Math.random() * 0.18,
    char: chars[Math.floor(Math.random() * chars.length)],
    updateTimer: 0,
    updateInterval: 30 + Math.random() * 100,
  };
}

function animate() {
  if (!canvas || !ctx) return;
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  for (const p of particles) {
    p.updateTimer++;
    if (p.updateTimer >= p.updateInterval) {
      p.char = chars[Math.floor(Math.random() * chars.length)];
      p.updateTimer = 0;
    }

    ctx.fillStyle = `rgba(249, 115, 22, ${p.opacity})`;
    ctx.font = `${p.size}px "JetBrains Mono", monospace`;
    ctx.fillText(p.char, p.x, p.y);

    p.y += p.vy;

    if (p.y > h + 20) {
      p.y = -20;
      p.x = Math.random() * w;
    }
  }

  animationId = requestAnimationFrame(animate);
}

function resize() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = Array.from({ length: props.particleCount }, () =>
    createParticle(canvas!.width, canvas!.height),
  );
}

onMounted(() => {
  canvas = document.querySelector('#particle-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  ctx = canvas.getContext('2d')!;
  resize();
  animate();
  window.addEventListener('resize', resize);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', resize);
});
</script>

<template>
  <canvas id="particle-canvas" class="fixed inset-0 pointer-events-none" style="z-index: 0" />
</template>
