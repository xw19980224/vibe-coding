<script setup lang="ts">
import { useIntersectionObserver } from '@a02/hooks';
import defaultCover from '@/assets/images/default-image.png';
import { useImagePreview } from '@/hooks/common/use-image-preview';

defineOptions({ name: 'LazyImage' });

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    disablePreview?: boolean; // 禁用内置预览，改为触发 click 事件
  }>(),
  { alt: '', disablePreview: false },
);

interface Emits {
  (e: 'click', src: string, alt: string): void;
}
const emits = defineEmits<Emits>();

const imgRef = ref<HTMLImageElement>();
const imgLoaded = ref(false);

const { openPreview } = !props.disablePreview ? useImagePreview() : { openPreview: null };

const { unobserve } = useIntersectionObserver(
  imgRef,
  (isIntersecting) => {
    if (isIntersecting && imgRef.value) {
      const realSrc = imgRef.value.dataset.src;
      if (realSrc) {
        imgRef.value.src = realSrc;
      }
      unobserve();
    }
  },
  { rootMargin: '200px' },
);

function onLoad() {
  imgLoaded.value = true;
}

function handleClick() {
  if (props.disablePreview) {
    emits('click', props.src, props.alt);
  } else {
    openPreview?.(props.src, props.alt);
  }
}
</script>

<template>
  <img
    ref="imgRef"
    :src="defaultCover"
    :data-src="props.src"
    :alt="props.alt"
    class="transition-opacity duration-500"
    :style="{ opacity: imgLoaded ? 1 : 0.6 }"
    @load="onLoad"
    @click="handleClick"
  />
</template>
