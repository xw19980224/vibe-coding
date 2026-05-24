<script setup lang="ts">
defineOptions({ name: 'ModalDialog' });

interface Props {
  title?: string;
  closable?: boolean;
  showMask?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  closable: true,
  showMask: true,
  closeOnClickModal: false,
  closeOnPressEscape: false,
});

const visible = defineModel<boolean>({ required: true, default: false });

function close() {
  visible.value = false;
}

function onBackdropClick() {
  if (props.closeOnClickModal) close();
}

function handleKeydown(e: KeyboardEvent) {
  if (props.closeOnPressEscape && e.key === 'Escape') {
    close();
  }
}

watch(
  () => visible.value,
  (v) => {
    if (v) {
      document.addEventListener('keydown', handleKeydown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeydown);
      document.body.style.overflow = '';
    }
  },
);

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="visible" class="fixed inset-0 z-200 flex-center p-4">
        <!-- Backdrop -->
        <div
          v-if="showMask"
          class="absolute inset-0"
          style="background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(6px)"
          @click="onBackdropClick"
        />

        <!-- Card -->
        <div
          class="relative z-10 w-full max-w-lg max-h-80vh rounded-2xl overflow-hidden flex flex-col"
          style="
            background: rgba(30, 41, 59, 0.95);
            border: 1px solid rgba(148, 163, 184, 0.08);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
          "
        >
          <!-- Header -->
          <div
            v-if="title || closable"
            class="flex-y-center justify-between px-6 pt-5 pb-4"
            style="border-bottom: 1px solid rgba(148, 163, 184, 0.06)"
          >
            <h2
              class="text-lg font-600 text-slate-300 font-sans"
            >
              {{ title }}
            </h2>
            <button
              v-if="closable"
              class="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0 ml-4 text-slate-500"

              @click="close"
              @mouseenter="
                (e: MouseEvent) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = '#94a3b8';
                  el.style.background = 'rgba(148, 163, 184, 0.08)';
                }
              "
              @mouseleave="
                (e: MouseEvent) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.color = '#64748b';
                  el.style.background = 'transparent';
                }
              "
            >
              <SvgIcon icon="lucide:x" style="font-size: 18px" />
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-5 flex-1 overflow-y-auto scrollbar-hide">
            <slot />
          </div>

          <!-- Footer -->
          <div
            v-if="$slots.footer"
            class="px-6 pb-5 pt-4 flex items-center justify-end gap-3"
            style="border-top: 1px solid rgba(148, 163, 184, 0.06)"
          >
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.25s ease;
}

.dialog-enter-active > div:last-child,
.dialog-leave-active > div:last-child {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}

.dialog-enter-from > div:last-child {
  opacity: 0;
  transform: scale(0.92) translateY(16px);
}

.dialog-leave-to > div:last-child {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}
</style>
