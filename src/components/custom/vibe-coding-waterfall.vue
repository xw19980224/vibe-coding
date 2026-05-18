<script setup lang="ts">
import { debounce, rafThrottle } from '@/utils/tool';

defineOptions({ name: 'VibeCodingWaterfall' });

interface Props {
  gap: number;
  column: number;
  items: Api.VibeCoding.VibeProject[];
  loading: boolean;
  hasMore: boolean;
}

const props = defineProps<Props>();

defineSlots<{
  default: (props: { item: Api.VibeCoding.VibeProject; index: number }) => any;
}>();

const emit = defineEmits<{
  loadMore: [];
}>();

const containerRef = ref<HTMLDivElement>();

const columnHeight = ref<number[]>([]);

const imagePos = ref<{ x: number; y: number }[]>([]);

const imageWidth = ref(0);

const containerHeight = ref(0);
const triggerOffset = ref(600);

const layout = () => {
  if (!containerRef.value) return;

  const cards = containerRef.value.querySelectorAll<HTMLElement>('[data-waterfall-item]');
  if (!cards.length) return;

  imagePos.value = new Array(cards.length);
  columnHeight.value = new Array(props.column).fill(0);

  cards.forEach((card, i) => {
    const actualHeight = card.getBoundingClientRect().height + props.gap;

    if (i < props.column) {
      imagePos.value[i] = {
        x: i === 0 ? 0 : i * imageWidth.value + props.gap * i,
        y: 0,
      };
      columnHeight.value[i] = actualHeight;
    } else {
      let minIdx = 0;
      for (let j = 1; j < columnHeight.value.length; j++) {
        if (columnHeight.value[j] < columnHeight.value[minIdx]) minIdx = j;
      }
      imagePos.value[i] = {
        x: minIdx === 0 ? 0 : minIdx * imageWidth.value + props.gap * minIdx,
        y: columnHeight.value[minIdx],
      };
      columnHeight.value[minIdx] += actualHeight;
    }
  });

  containerHeight.value = Math.max(...columnHeight.value, 0);

  const avgPerColumn = imagePos.value.length / props.column;
  const avgCardHeight = containerHeight.value / avgPerColumn;
  triggerOffset.value = Math.max(avgCardHeight * 1.5, 300);
};

const handleScroll = rafThrottle(() => {
  if (!props.hasMore || props.loading) return;
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  const bottom = scrollHeight - clientHeight - scrollTop;
  if (bottom <= triggerOffset.value) {
    emit('loadMore');
  }
});

const handleResize = debounce(async () => {
  if (containerRef.value) {
    imageWidth.value =
      (containerRef.value.clientWidth - (props.column - 1) * props.gap) / props.column;
    await nextTick();
    layout();
  }
}, 300);

const init = () => {
  if (containerRef.value) {
    imageWidth.value =
      (containerRef.value.clientWidth - (props.column - 1) * props.gap) / props.column;
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
  }
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});

watch(
  () => props.items,
  async () => {
    await nextTick();
    layout();
  },
  { flush: 'post', deep: true },
);
</script>

<template>
  <div ref="containerRef" class="w-full relative" :style="{ height: containerHeight + 'px' }">
    <div
      data-waterfall-item
      class="absolute top-0 left-0 box-border"
      v-for="(item, index) in items"
      :key="item.id"
      :style="{
        width: `${imageWidth}px`,
        transform: `translate3d(${imagePos[index]?.x || 0}px,${imagePos[index]?.y || 0}px,0)`,
      }"
    >
      <slot :item="item" :index="index" />
    </div>
  </div>
</template>
