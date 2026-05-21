<script setup lang="ts">
import { useRouter } from 'vue-router';
import { formatCompact } from '@/utils/common';

defineOptions({ name: 'WorkCardItem' });

interface Props {
  work: Api.VibeCoding.VibeProject;
  nickname: string;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'pin', workId: number): void;
  (e: 'edit', workId: number): void;
  (e: 'delete', workId: number): void;
}

const emit = defineEmits<Emits>();

const router = useRouter();
const menuVisible = ref(false);

function goToWork(id: number) {
  router.push(`/vibecoding/${id}`);
}

function toggleMenu() {
  menuVisible.value = !menuVisible.value;
}

function handleAction(action: 'pin' | 'edit' | 'delete') {
  menuVisible.value = false;
  switch (action) {
    case 'pin':
      emit('pin', props.work.id);
      break;
    case 'edit':
      emit('edit', props.work.id);
      break;
    case 'delete':
      emit('delete', props.work.id);
  }
}
</script>

<template>
  <div
    class="rounded-xl overflow-hidden cursor-pointer transition-all duration-300"
    style="background: rgba(30, 41, 59, 0.3); border: 1px solid rgba(148, 163, 184, 0.04)"
    @click="goToWork(work.id)"
    @mouseenter="
      (e: MouseEvent) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249, 115, 22, 0.2)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(30, 41, 59, 0.5)';
      }
    "
    @mouseleave="
      (e: MouseEvent) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148, 163, 184, 0.04)';
        (e.currentTarget as HTMLElement).style.background = 'rgba(30, 41, 59, 0.3)';
      }
    "
  >
    <!-- Cover -->
    <div class="relative aspect-16/9 overflow-hidden" style="background: rgba(15, 23, 42, 0.6)">
      <img
        v-if="work.coverUrl"
        :src="work.coverUrl"
        :alt="work.title"
        class="w-full h-full object-cover"
        loading="lazy"
      />

      <!-- Top-right: More icon -->
      <button
        v-is-self="props.nickname"
        class="absolute top-2 right-2 w-7 h-7 rounded-lg flex-center cursor-pointer transition-all duration-200 z-10"
        style="background: rgba(15, 23, 42, 0.7); color: #94a3b8; backdrop-filter: blur(4px)"
        @click.stop="toggleMenu"
        @mouseenter="
          (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.color = '#f1f5f9';
            (e.currentTarget as HTMLElement).style.background = 'rgba(15, 23, 42, 0.9)';
          }
        "
        @mouseleave="
          (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.color = '#94a3b8';
            (e.currentTarget as HTMLElement).style.background = 'rgba(15, 23, 42, 0.7)';
          }
        "
      >
        <SvgIcon icon="lucide:ellipsis" style="font-size: 15px" />
      </button>

      <!-- Dropdown menu -->
      <Transition name="menu">
        <div
          v-if="menuVisible"
          class="absolute top-10 right-2 w-28 rounded-xl overflow-hidden z-20"
          style="
            background: rgba(30, 41, 59, 0.98);
            border: 1px solid rgba(148, 163, 184, 0.12);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
          "
          @click.stop
        >
          <button
            class="w-full h-9 px-3 flex items-center gap-2 text-xs cursor-pointer transition-all duration-150"
            style="color: #cbd5e1"
            @click="handleAction('pin')"
            @mouseenter="
              (e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(148,163,184,0.08)';
              }
            "
            @mouseleave="
              (e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }
            "
          >
            <SvgIcon icon="lucide:pin" style="font-size: 13px" />
            置顶
          </button>
          <button
            class="w-full h-9 px-3 flex items-center gap-2 text-xs cursor-pointer transition-all duration-150"
            style="color: #cbd5e1"
            @click="handleAction('edit')"
            @mouseenter="
              (e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(148,163,184,0.08)';
              }
            "
            @mouseleave="
              (e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }
            "
          >
            <SvgIcon icon="lucide:pencil" style="font-size: 13px" />
            编辑
          </button>
          <button
            class="w-full h-9 px-3 flex items-center gap-2 text-xs cursor-pointer transition-all duration-150"
            style="color: #ef4444"
            @click="handleAction('delete')"
            @mouseenter="
              (e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)';
              }
            "
            @mouseleave="
              (e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
              }
            "
          >
            <SvgIcon icon="lucide:trash-2" style="font-size: 13px" />
            删除
          </button>
        </div>
      </Transition>

      <!-- Bottom stats -->
      <div
        class="absolute bottom-0 inset-x-0 h-10 px-3 flex items-center justify-between"
        style="background: linear-gradient(transparent, rgba(15, 23, 42, 0.85))"
      >
        <span
          class="flex items-center gap-1 text-xs"
          style="color: #e2e8f0; font-family: 'JetBrains Mono', monospace"
        >
          <SvgIcon icon="lucide:heart" style="font-size: 12px" />
          {{ formatCompact(work.likes) }}
        </span>
        <span
          class="flex items-center gap-1 text-xs"
          style="color: #e2e8f0; font-family: 'JetBrains Mono', monospace"
        >
          <SvgIcon icon="lucide:eye" style="font-size: 12px" />
          {{ formatCompact(work.views) }}
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="p-4">
      <h3 class="text-base font-600 mb-1 truncate" style="color: #cbd5e1">
        {{ work.title }}
      </h3>
      <p
        class="text-sm line-clamp-2 mb-3 leading-relaxed"
        style="color: #64748b; font-family: 'JetBrains Mono', monospace"
      >
        {{ work.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in work.tags?.slice(0, 3)"
          :key="tag"
          class="h-5 px-2 rounded text-xs flex items-center"
          style="
            background: rgba(249, 115, 22, 0.08);
            color: #fb923c;
            font-family: 'JetBrains Mono', monospace;
          "
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: all 0.15s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
