<script setup lang="ts">
defineOptions({ name: 'StepDescription' });

const form = defineModel<Api.VibeCoding.VibeProject>('form', { required: true });
const emit = defineEmits<{ (e: 'next'): void; (e: 'prev'): void }>();
</script>

<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-500 mb-2 text-slate-400">作品描述 *</label>
      <textarea
        v-model="form.description"
        rows="5"
        placeholder="描述你的作品、用了什么技术、有什么亮点..."
        class="w-full p-4 rounded-xl text-sm outline-none resize-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
      />
    </div>
    <div class="flex gap-3">
      <button
        class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200 text-slate-400 border border-orange-500/15 bg-transparent"
        @click="emit('prev')"
      >
        上一步
      </button>
      <button
        class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200 btn-primary-gradient"
        @click="emit('next')"
      >
        下一步
      </button>
    </div>
  </div>
</template>
