<script setup lang="ts" generic="T">
import { debounce, rafThrottle } from '@/utils/tool';

defineOptions({ name: 'MasonryLayout' });

interface Props {
  gap: number;
  column: number;
  items: T[];
  itemKey: (item: T) => string | number;
  loading: boolean;
  hasMore: boolean;
}

const props = defineProps<Props>();

defineSlots<{
  default: (props: { item: T; index: number }) => any;
}>();

interface Emits {
  (e: 'loadMore'): void;
}

const emit = defineEmits<Emits>();

const containerRef = ref<HTMLDivElement>();

// 每列的高度，用于计算图片位置
const columnHeight = ref<number[]>([]);

// 图片位置数组
const imagePos = ref<{ x: number; y: number }[]>([]);

// 图片宽度
const imageWidth = ref(0);

// 容器高度
const containerHeight = ref(0);

// 触发加载更多的高度
const triggerOffset = ref(600);

// 布局
const layout = () => {
  if (!containerRef.value) return;

  // 获取所有卡片元素
  const cards = containerRef.value.querySelectorAll<HTMLElement>('[data-waterfall-item]');
  if (!cards.length) {
    containerHeight.value = 0;
    return;
  }

  // 初始化图片位置和列高度
  imagePos.value = new Array(cards.length);
  columnHeight.value = new Array(props.column).fill(0);

  // 遍历所有卡片
  cards.forEach((card, i) => {
    // 获取卡片实际高度
    const actualHeight = card.getBoundingClientRect().height + props.gap;

    // 如果卡片在第一列，则直接设置图片位置和列高度
    if (i < props.column) {
      imagePos.value[i] = {
        x: i === 0 ? 0 : i * imageWidth.value + props.gap * i,
        y: 0,
      };
      columnHeight.value[i] = actualHeight;
    } else {
      // 找到高度最小的列
      let minIdx = 0;
      for (let j = 1; j < columnHeight.value.length; j++) {
        if (columnHeight.value[j] < columnHeight.value[minIdx]) minIdx = j;
      }
      // 设置图片位置和列高度
      imagePos.value[i] = {
        x: minIdx === 0 ? 0 : minIdx * imageWidth.value + props.gap * minIdx,
        y: columnHeight.value[minIdx],
      };
      // 更新列高度
      columnHeight.value[minIdx] += actualHeight;
    }
  });

  // 更新容器高度
  containerHeight.value = Math.max(...columnHeight.value, 0);

  // 计算平均每列的图片数量和平均卡片高度
  const avgPerColumn = imagePos.value.length / props.column;
  const avgCardHeight = containerHeight.value / avgPerColumn;
  // 设置触发加载更多的高度
  triggerOffset.value = Math.max(avgCardHeight * 1.5, 300);
};

// 处理滚动事件
const handleScroll = rafThrottle(() => {
  if (!props.hasMore || props.loading) return;
  // 获取滚动位置、容器高度和容器总高度
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  // 计算底部距离
  const bottom = scrollHeight - clientHeight - scrollTop;
  // 如果底部距离小于触发加载更多的高度，则触发加载更多
  if (bottom <= triggerOffset.value) {
    // 触发加载更多
    emit('loadMore');
  }
});

// 处理窗口大小变化事件
const handleResize = debounce(async () => {
  // 如果容器元素存在
  if (containerRef.value) {
    // 计算图片宽度
    imageWidth.value =
      (containerRef.value.clientWidth - (props.column - 1) * props.gap) / props.column;
    // 等待下一帧
    await nextTick();
    // 重新布局
    layout();
  }
}, 300);

const init = () => {
  if (containerRef.value) {
    imageWidth.value =
      (containerRef.value.clientWidth - (props.column - 1) * props.gap) / props.column;
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll);
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
  }
};

onMounted(() => {
  // 初始化
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
      :key="itemKey(item)"
      :style="{
        width: `${imageWidth}px`,
        transform: `translate3d(${imagePos[index]?.x || 0}px,${imagePos[index]?.y || 0}px,0)`,
      }"
    >
      <slot :item="item" :index="index" />
    </div>
  </div>
</template>
