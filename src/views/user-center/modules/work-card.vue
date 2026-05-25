<script setup lang="ts">
import { useRouter } from 'vue-router';
import { formatCompact } from '@/utils/common.ts';

defineOptions({ name: 'WorkCard' });

interface Props {
  work: Api.VibeCoding.VibeProject;
  isSelf: boolean;
}

const props = defineProps<Props>();

interface DropDownItem {
  command: string;
  label: string;
  icon: string;
}

const router = useRouter();

const dropdownOptions: DropDownItem[] = [
  {
    command: 'pin',
    label: '置顶',
    icon: 'lucide:pin',
  },
  {
    command: 'pencil',
    label: '编辑',
    icon: 'lucide:pencil',
  },
  {
    command: 'trash',
    label: '删除',
    icon: 'lucide:trash-2',
  },
];

function goToWork(id: number) {
  router.push(`/vibecoding/${id}`);
}
</script>

<template>
  <div
    class="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 bg-slate-800/30 border border-slate-400/4 hover:(border-orange/50 -translate-y-1 shadow-[0_0_30px_orange/8])"
    @click="goToWork(work.id)"
  >
    <!-- Cover -->
    <div class="relative aspect-16/9 overflow-hidden bg-slate-900/60">
      <ElImage :src="work.coverUrl" :alt="work.title" class="size-full" />

      <ElDropdown
        v-if="props.isSelf"
        class="absolute top-2 right-2"
        trigger="click"
        placement="bottom-end"
      >
        <ElButton link class="text-slate-400! backdrop-blur-sm bg-slate-900/70!" @click.stop>
          <template #icon>
            <SvgIcon icon="lucide:ellipsis" class="text-slate-400" />
          </template>
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem
              v-for="(item, index) in dropdownOptions"
              :key="index"
              :command="item.command"
            >
              <div class="flex-center gap-1" :class="item.command === 'trash' ? 'text-red' : ''">
                <SvgIcon :icon="item.icon" />
                <span> {{ item.label }}</span>
              </div>
            </ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>

      <!-- Bottom stats -->
      <div
        class="absolute bottom-0 inset-x-0 h-10 px-3 text-xs flex-y-center justify-between font-mono text-slate-200 bg-gradient-to-b from-transparent to-slate-900/85"
      >
        <span class="flex-center gap-1">
          <SvgIcon icon="lucide:heart" />
          {{ formatCompact(work.likes) }}
        </span>
        <span class="flex-center gap-1">
          <SvgIcon icon="lucide:eye" />
          {{ formatCompact(work.views) }}
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="p-4">
      <h3 class="text-base font-600 mb-1 truncate text-slate-300">
        {{ work.title }}
      </h3>
      <p class="text-xs line-clamp-2 mb-3 leading-relaxed text-slate-500 font-mono">
        {{ work.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in work.tags?.slice(0, 3)"
          :key="tag"
          class="h-5 px-2 rd text-xs flex-y-center font-mono bg-orange/20 text-orange"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
