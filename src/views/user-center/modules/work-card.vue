<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({ name: 'WorkCard' });

interface Props {
  work: Api.VibeCoding.VibeProject;
}

defineProps<Props>();

const router = useRouter();
const showActions = ref(false);

function goToWork(id: string) {
  router.push(`/work/${id}`);
}

function toggleActions() {
  showActions.value = !showActions.value;
}
</script>

<template>
  <div
    class="flex-y-center gap-5 p-5 rounded-xl cursor-pointer transition-all duration-200"
    style="background: rgba(30, 41, 59, 0.3); border: 1px solid rgba(148, 163, 184, 0.04)"
    @click="goToWork(String(work.id))"
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
    <!-- Thumbnail -->
    <div
      class="w-20 h-20 rounded-lg overflow-hidden shrink-0"
      style="background: rgba(15, 23, 42, 0.6)"
      @click.stop="goToWork(String(work.id))"
    >
      <img v-if="work.coverUrl" :src="work.coverUrl" class="w-full h-full object-cover" />
    </div>

    <!-- Title / Description / Stats -->
    <div class="flex-1 min-w-0" @click.stop="goToWork(String(work.id))">
      <h3 class="text-base font-600 mb-1 truncate" style="color: #cbd5e1">
        {{ work.title }}
      </h3>
      <p class="text-sm line-clamp-1 mb-2" style="color: #64748b">
        {{ work.description }}
      </p>
      <div class="flex-y-center gap-5 text-sm" style="color: #94a3b8">
        <span class="flex-y-center gap-1">
          <SvgIcon icon="lucide:heart" style="font-size: 15px" />{{ work.likes }}
        </span>
        <span class="flex-y-center gap-1">
          <SvgIcon icon="lucide:eye" style="font-size: 15px" />{{ work.views }}
        </span>
      </div>
    </div>

    <!-- Desktop action buttons -->
    <div class="hidden md:flex items-center gap-2 shrink-0" @click.stop>
      <button
        class="h-9 w-9 rounded-lg flex-center cursor-pointer transition-all duration-200"
        style="color: #94a3b8"
        title="置顶"
        @mouseenter="
          (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.color = '#f1f5f9';
            (e.currentTarget as HTMLElement).style.background = 'rgba(148,163,184,0.1)';
          }
        "
        @mouseleave="
          (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.color = '#94a3b8';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }
        "
      >
        <SvgIcon icon="lucide:pin" style="font-size: 14px" />
      </button>
      <button
        class="h-9 w-9 rounded-lg flex-center cursor-pointer transition-all duration-200"
        style="color: #94a3b8"
        title="编辑"
        @mouseenter="
          (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.color = '#f1f5f9';
            (e.currentTarget as HTMLElement).style.background = 'rgba(148,163,184,0.1)';
          }
        "
        @mouseleave="
          (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.color = '#94a3b8';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }
        "
      >
        <SvgIcon icon="lucide:pencil" style="font-size: 14px" />
      </button>
      <button
        class="h-9 w-9 rounded-lg flex-center cursor-pointer transition-all duration-200"
        style="color: #ef4444"
        title="删除"
        @mouseenter="
          (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
          }
        "
        @mouseleave="
          (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }
        "
      >
        <SvgIcon icon="lucide:trash-2" style="font-size: 14px" />
      </button>
    </div>

    <!-- Mobile dropdown trigger -->
    <div class="md:hidden relative shrink-0" @click.stop>
      <button
        class="h-9 w-9 rounded-lg flex-center cursor-pointer transition-all duration-200"
        style="color: #94a3b8"
        @click="toggleActions"
        @mouseenter="
          (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.color = '#f1f5f9';
            (e.currentTarget as HTMLElement).style.background = 'rgba(148,163,184,0.1)';
          }
        "
        @mouseleave="
          (e: MouseEvent) => {
            (e.currentTarget as HTMLElement).style.color = '#94a3b8';
            (e.currentTarget as HTMLElement).style.background = 'transparent';
          }
        "
      >
        <SvgIcon icon="lucide:ellipsis-vertical" style="font-size: 16px" />
      </button>

      <Transition name="menu">
        <div
          v-if="showActions"
          class="absolute right-0 top-full mt-1 w-32 rounded-xl overflow-hidden z-10"
          style="
            background: rgba(30, 41, 59, 0.98);
            border: 1px solid rgba(148, 163, 184, 0.12);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
          "
        >
          <button
            class="w-full h-10 px-4 flex items-center gap-2 text-xs cursor-pointer transition-all duration-150"
            style="color: #cbd5e1"
            @click="showActions = false"
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
            <SvgIcon icon="lucide:pin" style="font-size: 14px" />
            置顶
          </button>
          <button
            class="w-full h-10 px-4 flex items-center gap-2 text-xs cursor-pointer transition-all duration-150"
            style="color: #cbd5e1"
            @click="showActions = false"
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
            <SvgIcon icon="lucide:pencil" style="font-size: 14px" />
            编辑
          </button>
          <button
            class="w-full h-10 px-4 flex items-center gap-2 text-xs cursor-pointer transition-all duration-150"
            style="color: #ef4444"
            @click="showActions = false"
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
            <SvgIcon icon="lucide:trash-2" style="font-size: 14px" />
            删除
          </button>
        </div>
      </Transition>
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
