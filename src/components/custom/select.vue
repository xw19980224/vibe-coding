<script setup lang="ts">
import { useEventListener } from '@vueuse/core';

defineOptions({ name: 'Select' });

interface Option {
  value: string | number;
  label: string;
}

interface Props {
  options: Option[];
  placeholder?: string;
  multiple?: boolean;
  clearable?: boolean;
}

interface DropdownPosition {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
  placement: 'top' | 'bottom';
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  multiple: false,
  clearable: false,
});

const modelValue = defineModel<string | number | (string | number)[]>();

const PREFERRED_MAX_HEIGHT = 240;
const VIEWPORT_PADDING = 8;
const TRIGGER_GAP = 4;
const MIN_PANEL_HEIGHT = 80;

const open = ref(false);
const selectRef = ref<HTMLElement>();
const triggerRef = ref<HTMLButtonElement>();
const dropdownRef = ref<HTMLElement>();
const dropdownPos = ref<DropdownPosition | null>(null);

const hasValue = computed(() => {
  if (props.multiple) {
    return ((modelValue.value as (string | number)[]) || []).length > 0;
  }
  return modelValue.value !== undefined && modelValue.value !== '';
});

const selectedLabel = computed(() => {
  if (props.multiple) {
    const arr = (modelValue.value as (string | number)[]) || [];
    if (!arr.length) return '';
    return `已选 ${arr.length} 项`;
  }
  return props.options.find((o) => o.value === modelValue.value)?.label;
});

function isSelected(val: string | number) {
  if (props.multiple) {
    return ((modelValue.value as (string | number)[]) || []).includes(val);
  }
  return modelValue.value === val;
}

function updateDropdownPosition() {
  const trigger = triggerRef.value;
  if (!trigger || !open.value) return;

  const rect = trigger.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
  const spaceAbove = rect.top - VIEWPORT_PADDING;
  const openUp = spaceBelow < PREFERRED_MAX_HEIGHT && spaceAbove > spaceBelow;
  const availableSpace = (openUp ? spaceAbove : spaceBelow) - TRIGGER_GAP;
  const maxHeight = Math.min(PREFERRED_MAX_HEIGHT, Math.max(availableSpace, MIN_PANEL_HEIGHT));

  dropdownPos.value = {
    left: rect.left,
    width: rect.width,
    maxHeight,
    placement: openUp ? 'top' : 'bottom',
    ...(openUp
      ? { bottom: window.innerHeight - rect.top + TRIGGER_GAP }
      : { top: rect.bottom + TRIGGER_GAP }),
  };
}

function toggle() {
  open.value = !open.value;
  if (open.value) {
    nextTick(updateDropdownPosition);
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    nextTick(updateDropdownPosition);
  } else {
    dropdownPos.value = null;
  }
});

function select(option: Option) {
  if (props.multiple) {
    const arr = [...((modelValue.value as (string | number)[]) || [])];
    const idx = arr.indexOf(option.value);
    if (idx > -1) {
      arr.splice(idx, 1);
    } else {
      arr.push(option.value);
    }
    modelValue.value = arr;
  } else {
    modelValue.value = option.value;
    open.value = false;
  }
}

function clear(e: MouseEvent) {
  e.stopPropagation();
  if (props.multiple) {
    modelValue.value = [];
  } else {
    modelValue.value = undefined;
  }
  open.value = true;
}

function onClickOutside(e: MouseEvent) {
  const target = e.target as Node;
  if (selectRef.value?.contains(target) || dropdownRef.value?.contains(target)) return;
  open.value = false;
}

onMounted(() => document.addEventListener('click', onClickOutside));
onUnmounted(() => document.removeEventListener('click', onClickOutside));

useEventListener(window, 'scroll', updateDropdownPosition, { capture: true });
useEventListener(window, 'resize', updateDropdownPosition);
</script>

<template>
  <div ref="selectRef" class="relative">
    <button
      ref="triggerRef"
      class="w-full h-10 px-4 rounded-lg text-sm flex items-center justify-between gap-2 cursor-pointer transition-all duration-200 text-slate-400 font-mono bg-slate-800/50 border border-orange-500/10"
      @click="toggle"
    >
      <span :style="{ color: selectedLabel ? '#f1f5f9' : '#64748b' }">
        {{ selectedLabel || placeholder }}
      </span>
      <div class="flex items-center gap-1.5">
        <button
          v-if="clearable && hasValue"
          class="flex items-center justify-center w-4 h-4 rounded-full cursor-pointer transition-opacity duration-150 hover:opacity-80 text-slate-400 bg-slate-400/25"
          @click="clear"
        >
          <SvgIcon icon="lucide:x" style="font-size: 10px" />
        </button>
        <SvgIcon
          icon="lucide:chevron-down"
          style="font-size: 14px"
          class="transition-transform duration-200"
          :class="{ 'rotate-180': open }"
        />
      </div>
    </button>

    <Teleport to="body">
      <Transition :name="dropdownPos?.placement === 'top' ? 'select-drop-up' : 'select-drop'">
        <div
          v-if="open && dropdownPos"
          ref="dropdownRef"
          class="fixed rounded-xl overflow-hidden"
          :style="{
            left: `${dropdownPos.left}px`,
            width: `${dropdownPos.width}px`,
            top: dropdownPos.top != null ? `${dropdownPos.top}px` : undefined,
            bottom: dropdownPos.bottom != null ? `${dropdownPos.bottom}px` : undefined,
            zIndex: 9999,
            background: 'rgba(30, 41, 59, 0.98)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
          }"
        >
          <div
            class="overflow-y-auto py-1 scrollbar-hide"
            :style="{ maxHeight: `${dropdownPos.maxHeight}px` }"
          >
            <button
              v-for="option in options"
              :key="option.value"
              class="w-full h-9 px-4 text-left text-sm cursor-pointer transition-all duration-150 flex items-center gap-2 text-slate-300 font-mono"
              :style="{
                background: isSelected(option.value) ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
              }"
              @click="select(option)"
              @mouseenter="
                (e: MouseEvent) => {
                  if (!isSelected(option.value)) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(148,163,184,0.08)';
                  }
                }
              "
              @mouseleave="
                (e: MouseEvent) => {
                  if (!isSelected(option.value)) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }
                }
              "
            >
              <SvgIcon
                v-if="multiple && isSelected(option.value)"
                icon="lucide:check"
                style="font-size: 13px; color: #f97316"
              />
              {{ option.label }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.select-drop-enter-active,
.select-drop-leave-active {
  transition: all 0.15s ease;
}
.select-drop-enter-from,
.select-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.select-drop-up-enter-active,
.select-drop-up-leave-active {
  transition: all 0.15s ease;
}
.select-drop-up-enter-from,
.select-drop-up-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
