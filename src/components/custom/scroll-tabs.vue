<script setup lang="ts">
defineOptions({ name: 'ScrollTabs' });

interface Props {
  height?: string;
}

withDefaults(defineProps<Props>(), { height: 'h-10' });

const scrollEl = ref<HTMLElement>();
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

function updateArrows() {
  const el = scrollEl.value;
  if (!el) return;
  canScrollLeft.value = el.scrollLeft > 1;
  canScrollRight.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
}

function handleScrollLeft() {
  scrollEl.value?.scrollBy({ left: -200, behavior: 'smooth' });
}

function handleScrollRight() {
  scrollEl.value?.scrollBy({ left: 200, behavior: 'smooth' });
}

onMounted(() => {
  updateArrows();
  scrollEl.value?.addEventListener('scroll', updateArrows, { passive: true });
  window.addEventListener('resize', updateArrows);
});

onBeforeUnmount(() => {
  scrollEl.value?.removeEventListener('scroll', updateArrows);
  window.removeEventListener('resize', updateArrows);
});
</script>

<template>
  <div class="flex-y-center gap-1">
    <button
      v-if="canScrollLeft"
      :class="[
        height,
        'w-8 rounded-lg cursor-pointer transition-all duration-200 flex-center shrink-0 bg-slate-800/60 border border-orange-500/10',
      ]"
      style="color: #f97316"
      @click="handleScrollLeft"
    >
      <SvgIcon icon="lucide:chevron-left" style="font-size: 16px" />
    </button>
    <div ref="scrollEl" class="flex-y-center gap-2 overflow-hidden" @scroll="updateArrows">
      <slot />
    </div>
    <button
      v-if="canScrollRight"
      :class="[
        height,
        'w-8 rounded-lg cursor-pointer transition-all duration-200 flex-center shrink-0 bg-slate-800/60  border border-orange-500/10',
      ]"
      style="color: #f97316"
      @click="handleScrollRight"
    >
      <SvgIcon icon="lucide:chevron-right" style="font-size: 16px" />
    </button>
  </div>
</template>
