<script setup lang="ts">
import { mockCategories } from '@/mock/vibe-works';
import Select from '@/components/custom/select.vue';

defineOptions({ name: 'StepBasic' });

const form = defineModel<Api.VibeCoding.VibeProject>('form', { required: true });
const emit = defineEmits<{ (e: 'next'): void }>();

function removeTag(tag: string) {
  form.value.tags = form.value.tags.filter((t) => t !== tag);
}

const tagOptions = [
  { value: 'Vue3', label: 'Vue3' },
  { value: 'React', label: 'React' },
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'Vite', label: 'Vite' },
  { value: 'UnoCSS', label: 'UnoCSS' },
  { value: 'AI', label: 'AI' },
  { value: 'Game', label: 'Game' },
  { value: 'WebGL', label: 'WebGL' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'SaaS', label: 'SaaS' },
  { value: 'DevTools', label: 'DevTools' },
  { value: 'Open Source', label: 'Open Source' },
];

const languageOptions = [
  { value: 'TypeScript', label: 'TypeScript' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'Vue 3', label: 'Vue 3' },
  { value: 'React', label: 'React' },
  { value: 'Python', label: 'Python' },
  { value: 'Go', label: 'Go' },
  { value: 'Rust', label: 'Rust' },
  { value: 'Java', label: 'Java' },
  { value: 'Kotlin', label: 'Kotlin' },
  { value: 'Swift', label: 'Swift' },
  { value: 'CSS', label: 'CSS' },
];

const selectedLanguage = ref('');
watch(selectedLanguage, (val) => {
  form.value.languages = val ? [val] : [];
});

const platformOptions = [
  { value: 'web', label: 'Web' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'desktop', label: '桌面端' },
  { value: 'mini-program', label: '小程序' },
  { value: 'cross', label: '跨平台' },
];
</script>

<template>
  <div class="space-y-6">
    <!-- 作品名称 -->
    <div>
      <label class="block text-base font-500 mb-2 text-slate-400" >作品名称 *</label>
      <input
        v-model="form.title"
        type="text"
        placeholder="给你的作品取个名字..."
        class="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
      />
    </div>

    <!-- 作品副标题 -->
    <div>
      <label class="block text-base font-500 mb-2 text-slate-400" >作品副标题</label>
      <input
        v-model="form.subtitle"
        type="text"
        placeholder="一句话描述你的作品..."
        class="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/50 border border-orange-500/10"
      />
    </div>

    <!-- 分类 -->
    <div>
      <label class="block text-base font-500 mb-2 text-slate-400" >分类</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in mockCategories.filter((c) => c.id !== 'all')"
          :key="cat.id"
          class="h-9 px-4 rounded-lg text-sm cursor-pointer transition-all duration-200"
          :style="{
            color: form.category === cat.id ? '#F97316' : '#94A3B8',
            background:
              form.category === cat.id ? 'rgba(249, 115, 22, 0.12)' : 'rgba(30, 41, 59, 0.5)',
            border: `1px solid ${form.category === cat.id ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.06)'}`,
            fontFamily: '\'JetBrains Mono\', monospace',
          }"
          @click="form.category = cat.id"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- 标签 -->
    <div>
      <label class="block text-base font-500 mb-2 text-slate-400" >标签</label>
      <Select v-model="form.tags" :options="tagOptions" placeholder="选择标签" multiple />
      <div v-if="form.tags.length" class="flex flex-wrap gap-2 mt-3">
        <span
          v-for="tag in form.tags"
          :key="tag"
          class="h-7 px-3 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all duration-200 font-mono bg-orange-500/10"
          style="color: #fb923c"
          @click.stop="removeTag(tag)"
        >
          {{ tag }}
          <span class="text-xs" style="color: #f97316">x</span>
        </span>
      </div>
    </div>

    <!-- 开发语言 -->
    <div>
      <label class="block text-base font-500 mb-2 text-slate-400" >开发语言</label>
      <Select
        v-model="selectedLanguage"
        :options="languageOptions"
        placeholder="选择开发语言"
        clearable
      />
    </div>

    <!-- 运行平台 -->
    <div>
      <label class="block text-base font-500 mb-2 text-slate-400" >运行平台</label>
      <Select v-model="form.platform" :options="platformOptions" placeholder="选择运行平台" />
      <div v-if="form.platform" class="flex flex-wrap gap-2 mt-3">
        <span
          class="h-7 px-3 rounded-lg text-xs flex items-center font-mono bg-blue-500/10"
          style="color: #60a5fa"
        >
          {{ platformOptions.find((p) => p.value === form.platform)?.label }}
        </span>
      </div>
    </div>

    <button
      class="w-full h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200"
      style="background: linear-gradient(135deg, #f97316, #fb923c); color: #fff"
      :style="{
        opacity: form.title.trim() ? 1 : 0.5,
        cursor: form.title.trim() ? 'pointer' : 'not-allowed',
      }"
      @click="emit('next')"
    >
      下一步
    </button>
  </div>
</template>
