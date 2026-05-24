<script setup lang="ts">
defineOptions({ name: 'StepTags' });

const form = defineModel<Api.VibeCoding.VibeProject>('form', { required: true });
const tagInput = defineModel<string>('tagInput', { default: '' });
const publishing = defineModel<boolean>('publishing', { default: false });

const emit = defineEmits<{
  (e: 'addTag'): void;
  (e: 'removeTag', tag: string): void;
  (e: 'prev'): void;
  (e: 'submit'): void;
}>();
</script>

<template>
  <div class="space-y-6">
    <div>
      <label class="block text-sm font-500 mb-2 text-slate-400" >标签</label>
      <div class="flex items-center gap-2 mb-3">
        <input
          v-model="tagInput"
          type="text"
          placeholder="输入标签后按回车..."
          class="flex-1 h-10 px-4 rounded-lg text-sm outline-none transition-all duration-200 text-slate-100"
          style="background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(249, 115, 22, 0.1);
            font-family: 'JetBrains Mono', monospace"
          @keyup.enter="emit('addTag')"
        />
        <button
          class="h-10 px-4 rounded-lg text-sm cursor-pointer"
          style="background: rgba(249, 115, 22, 0.12); color: #f97316"
          @click="emit('addTag')"
        >
          添加
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in form.tags"
          :key="tag"
          class="h-7 px-3 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all duration-200"
          style="
            background: rgba(249, 115, 22, 0.1);
            color: #fb923c;
            font-family: 'JetBrains Mono', monospace;
          "
          @click="emit('removeTag', tag)"
        >
          {{ tag }}
          <span class="text-xs" style="color: #f97316">x</span>
        </span>
      </div>
    </div>
    <div>
      <label class="block text-sm font-500 mb-2 text-slate-400" >代码片段 (可选)</label>
      <textarea
        v-model="form.codeSnippet"
        rows="6"
        placeholder="粘贴一段核心代码，展示你的作品灵魂..."
        class="w-full p-4 rounded-xl text-sm outline-none resize-none transition-all duration-200 text-slate-400"
        style="background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(249, 115, 22, 0.08);
          font-family: 'JetBrains Mono', monospace"
      />
    </div>
    <div>
      <label class="block text-sm font-500 mb-2 text-slate-400" >项目链接 (可选)</label>
      <input
        v-model="form.link"
        type="url"
        placeholder="https://github.com/..."
        class="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200 text-slate-100"
        style="background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(249, 115, 22, 0.1);
          font-family: 'JetBrains Mono', monospace"
      />
    </div>
    <div class="flex gap-3">
      <button
        class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200 text-slate-400"
        style="background: transparent; border: 1px solid rgba(249, 115, 22, 0.15)"
        @click="emit('prev')"
      >
        上一步
      </button>
      <button
        class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
        :style="{
          background: publishing ? '#334155' : 'linear-gradient(135deg, #F97316, #FB923C)',
          color: publishing ? '#94A3B8' : '#fff',
        }"
        :disabled="publishing"
        @click="emit('submit')"
      >
        <div
          v-if="publishing"
          class="w-4 h-4 rounded-full border-2 border-transparent animate-spin"
          style="border-top-color: #94a3b8"
        />
        {{ publishing ? '发布中...' : '发布作品' }}
      </button>
    </div>
  </div>
</template>
