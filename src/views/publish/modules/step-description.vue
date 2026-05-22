<script setup lang="ts">
defineOptions({ name: 'StepDescription' });

const form = defineModel<Api.VibeCoding.VibeProject>('form', { required: true });
const emit = defineEmits<{ (e: 'next'): void; (e: 'prev'): void }>();
</script>

<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-500 mb-2" style="color: #94a3b8">作品描述 *</label>
      <textarea
        v-model="form.description"
        rows="5"
        placeholder="描述你的作品、用了什么技术、有什么亮点..."
        class="w-full p-4 rounded-xl text-sm outline-none resize-none transition-all duration-200"
        style="
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(249, 115, 22, 0.1);
          color: #f1f5f9;
          font-family: 'JetBrains Mono', monospace;
        "
      />
    </div>
    <div>
      <label class="block text-sm font-500 mb-2" style="color: #94a3b8">Vibe Prompt (可选)</label>
      <textarea
        v-model="form.vibePrompt"
        rows="3"
        placeholder="写出创作时使用的 prompt，让大家感受你的灵感..."
        class="w-full p-4 rounded-xl text-sm outline-none resize-none transition-all duration-200"
        style="
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(249, 115, 22, 0.1);
          color: #f1f5f9;
          font-family: 'JetBrains Mono', monospace;
        "
      />
    </div>
    <div class="flex gap-3">
      <button
        class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200"
        style="background: transparent; color: #94a3b8; border: 1px solid rgba(249, 115, 22, 0.15)"
        @click="emit('prev')"
      >
        上一步
      </button>
      <button
        class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200"
        style="background: linear-gradient(135deg, #f97316, #fb923c); color: #fff"
        @click="emit('next')"
      >
        下一步
      </button>
    </div>
  </div>
</template>
