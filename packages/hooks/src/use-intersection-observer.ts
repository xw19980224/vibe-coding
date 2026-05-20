import { onUnmounted, watch } from 'vue';
import type { Ref } from 'vue';

export function useIntersectionObserver(
  target: Ref<HTMLElement | null | undefined>,
  callback: (isIntersecting: boolean) => void,
  options?: IntersectionObserverInit,
) {
  let observer: IntersectionObserver | null = null;

  function observe() {
    const el = target.value;
    if (!el) return;

    observer = new IntersectionObserver(
      (entries) => {
        callback(entries[0].isIntersecting);
      },
      options,
    );

    observer.observe(el);
  }

  function unobserve() {
    observer?.disconnect();
    observer = null;
  }

  const { stop } = watch(
    () => target.value,
    (el) => {
      unobserve();
      if (el) observe();
    },
    { flush: 'post' },
  );

  onUnmounted(() => {
    stop();
    unobserve();
  });

  return { observe, unobserve };
}
