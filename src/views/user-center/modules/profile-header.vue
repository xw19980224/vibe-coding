<script setup lang="ts">
defineOptions({ name: 'ProfileHeader' });

interface Props {
  userInfo: Api.Auth.User | null;
  stats: { label: string; value: number }[];
}

const props = withDefaults(defineProps<Props>(), {
  userInfo: () => null,
  stats: () => [],
});

interface Emits {
  (e: 'editUserProfile'): void;
}

const emit = defineEmits<Emits>();
</script>

<template>
  <div class="flex flex-col md:flex-row items-start gap-8 mb-10">
    <!-- Avatar -->
    <div class="size-24 flex-center shrink-0">
      <img :src="props.userInfo?.avatar" class="size-full object-cover rd-full" />
    </div>

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1
            class="text-2xl font-700 mb-1"
            style="font-family: Orbitron, sans-serif; color: #f1f5f9"
          >
            {{ props.userInfo?.nickname }}
          </h1>
          <p class="text-sm mb-4" style="color: #64748b; font-family: 'JetBrains Mono', monospace">
            {{ props.userInfo?.introduction }}
          </p>
        </div>
        <button
          class="h-9 px-5 rounded-lg text-sm font-600 cursor-pointer transition-all duration-200 shrink-0"
          style="background: transparent; color: #f97316; border: 1px solid rgba(249, 115, 22, 0.3)"
          @click="emit('editUserProfile')"
        >
          编辑资料
        </button>
      </div>

      <!-- Stats -->
      <div class="flex items-center gap-8">
        <div v-for="stat in props.stats" :key="stat.label" class="text-center">
          <div class="text-xl font-700" style="font-family: Orbitron, sans-serif; color: #f1f5f9">
            {{ stat.value >= 1000 ? (stat.value / 1000).toFixed(1) + 'k' : stat.value }}
          </div>
          <div
            class="text-xs mt-1"
            style="color: #64748b; font-family: 'JetBrains Mono', monospace"
          >
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
