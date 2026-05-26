<script setup lang="ts">
import { onMounted } from 'vue';

defineOptions({ name: 'VibeHero' });

const displayText = ref('');
const isTypingDone = ref(false);
const showSubtitle = ref(false);
const showCTA = ref(false);

const fullText = '分享你的 Vibe，让代码发光';

onMounted(() => {
  let index = 0;

  function type() {
    if (index < fullText.length) {
      displayText.value += fullText[index];
      index++;
      setTimeout(type, 60 + Math.random() * 40);
    } else {
      isTypingDone.value = true;
      setTimeout(() => {
        showSubtitle.value = true;
        setTimeout(() => {
          showCTA.value = true;
        }, 300);
      }, 400);
    }
  }

  setTimeout(type, 300);
});
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background gradient -->
    <div
      class="absolute inset-0"
      style="
        background:
          radial-gradient(ellipse at 50% 0%, rgba(249, 115, 22, 0.08) 0%, transparent 60%),
          radial-gradient(ellipse at 85% 80%, rgba(249, 115, 22, 0.04) 0%, transparent 50%);
      "
    />

    <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
      <!-- Main Title -->
      <h1
        class="text-5xl md:text-7xl lg:text-8xl font-900 tracking-wide leading-tight text-slate-100 font-display"
      >
        <span>{{ displayText }}</span>
        <span
          class="inline-block w-0.5 h-[0.8em] bg-orange align-middle ml-1"
          :style="{ animation: isTypingDone ? 'blink 1s step-end infinite' : 'none' }"
        />
      </h1>

      <!-- Subtitle -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
      >
        <p
          v-if="showSubtitle"
          class="mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-slate-400 font-mono"
        >
          在这里，每一行代码都是一次灵感的碰撞。<br />
          用 AI 创造，用 Vibe 连接——<span class="text-orange">属于创作者的代码星图</span>。
        </p>
      </Transition>

      <!-- CTA Buttons -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div
          v-if="showCTA"
          class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            class="h-12 px-8 rounded-xl text-base font-600 cursor-pointer transition-all duration-300 flex items-center gap-2 text-orange-400 border border-orange/25 bg-orange/10 backdrop-blur-sm hover:(bg-orange/20 border-orange/45 -translate-y-0.5)"
          >
            <SvgIcon icon="lucide:code" class="text-2xl" />
            开始创作
          </button>
          <button
            class="h-12 px-8 rounded-xl text-base font-600 cursor-pointer transition-all duration-300 text-slate-100 font-mono border border-orange-500/30 bg-transparent hover:(border-orange bg-orange/10)"
          >
            发布作品
          </button>
        </div>
      </Transition>
    </div>

    <!-- Scroll indicator -->
    <div
      class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      style="animation: float 2s ease-in-out infinite"
    >
      <div class="text-xs text-slate-600 font-mono">向下探索</div>
      <div
        class="w-5 h-8 rounded-full border flex items-start justify-center p-1 border-orange-500/30"
      >
        <div
          class="w-1 h-2 rounded-full bg-orange"
          style="animation: scrollPulse 1.5s ease-in-out infinite"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -8px);
  }
}

@keyframes scrollPulse {
  0%,
  100% {
    opacity: 1;
    transform: translateY(0);
  }
  50% {
    opacity: 0.3;
    transform: translateY(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
