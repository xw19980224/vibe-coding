<script setup lang="ts">
import Select from '@/components/custom/select.vue';

defineOptions({ name: 'StepExtended' });

const form = defineModel<Api.VibeCoding.VibeProject>('form', { required: true });
const emit = defineEmits<{ (e: 'next'): void; (e: 'prev'): void }>();

const durationOptions = [
  { value: '1天', label: '1天' },
  { value: '3天', label: '3天' },
  { value: '7天', label: '7天' },
  { value: '15天', label: '15天' },
  { value: '3个月', label: '3个月' },
  { value: '6个月', label: '6个月' },
  { value: '__custom__', label: '自定义' },
];

const repoPlatformOptions = [
  { value: 'github', label: 'GitHub' },
  { value: 'gitee', label: 'Gitee' },
];

const repoPlatform = ref<'github' | 'gitee'>('github');
const repoUrl = computed({
  get: () => form.value.repoUrl || '',
  set: (val: string) => { form.value.repoUrl = val; },
});

const isCustomDuration = computed(() => form.value.duration === '__custom__');

const licenseOptions = [
  { value: 'MIT', label: 'MIT' },
  { value: 'Apache-2.0', label: 'Apache-2.0' },
  { value: 'GPL-3.0', label: 'GPL-3.0' },
  { value: 'BSD-3-Clause', label: 'BSD-3-Clause' },
  { value: 'AGPL-3.0', label: 'AGPL-3.0' },
  { value: 'MPL-2.0', label: 'MPL-2.0' },
  { value: 'Unlicense', label: 'Unlicense' },
];
</script>

<template>
  <div class="space-y-6">
    <!-- 开发周期 -->
    <div>
      <label class="block text-base font-500 mb-2 text-slate-400" >开发周期</label>
      <Select v-model="form.duration" :options="durationOptions" placeholder="选择开发周期" />
      <input
        v-if="isCustomDuration"
        v-model="form.duration"
        type="text"
        placeholder="输入自定义周期，如：2个月、30天..."
        class="w-full h-10 px-4 rounded-lg text-sm outline-none transition-all duration-200 mt-3 text-slate-100"
        style="background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(249, 115, 22, 0.1);
          font-family: 'JetBrains Mono', monospace"
      />
    </div>

    <!-- 许可证 -->
    <div>
      <label class="block text-base font-500 mb-2 text-slate-400" >许可证</label>
      <Select v-model="form.license" :options="licenseOptions" placeholder="选择许可证" />
    </div>

    <!-- 是否上线 -->
    <div class="flex items-center justify-between">
      <label class="text-base font-500 text-slate-400" >是否上线</label>
      <button
        class="relative w-11 h-6 rounded-full cursor-pointer transition-all duration-200"
        :style="{ background: form.isOnline ? '#f97316' : 'rgba(148, 163, 184, 0.2)' }"
        @click="form.isOnline = !form.isOnline"
      >
        <div
          class="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200"
          :class="form.isOnline ? 'right-1' : 'left-1'"
        />
      </button>
    </div>

    <!-- 上线时间 -->
    <div v-if="form.isOnline">
      <label class="block text-base font-500 mb-2 text-slate-400" >上线时间</label>
      <input
        v-model="form.onlineDate"
        type="month"
        class="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200 text-slate-100"
        style="background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(249, 115, 22, 0.1);
          font-family: 'JetBrains Mono', monospace"
      />
    </div>

    <!-- 源码仓库 -->
    <div>
      <label class="block text-base font-500 mb-2 text-slate-400" >源码仓库</label>
      <div class="flex gap-2 mb-3">
        <button
          v-for="opt in repoPlatformOptions"
          :key="opt.value"
          class="h-9 px-4 rounded-lg text-sm cursor-pointer transition-all duration-200"
          :style="{
            color: repoPlatform === opt.value ? '#F97316' : '#94A3B8',
            background: repoPlatform === opt.value ? 'rgba(249, 115, 22, 0.12)' : 'rgba(30, 41, 59, 0.5)',
            border: `1px solid ${repoPlatform === opt.value ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.06)'}`,
            fontFamily: '\'JetBrains Mono\', monospace',
          }"
          @click="repoPlatform = opt.value as 'github' | 'gitee'"
        >
          {{ opt.label }}
        </button>
      </div>
      <input
        v-model="repoUrl"
        type="url"
        :placeholder="repoPlatform === 'github' ? 'https://github.com/...' : 'https://gitee.com/...'"
        class="w-full h-12 px-4 rounded-xl text-sm outline-none transition-all duration-200 text-slate-100"
        style="background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(249, 115, 22, 0.1);
          font-family: 'JetBrains Mono', monospace"
      />
    </div>

    <!-- 在线演示地址 -->
    <div>
      <label class="block text-base font-500 mb-2 text-slate-400" >在线演示地址</label>
      <input
        v-model="form.demoUrl"
        type="url"
        placeholder="https://..."
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
        class="flex-1 h-12 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200"
        style="background: linear-gradient(135deg, #f97316, #fb923c); color: #fff"
        @click="emit('next')"
      >
        下一步
      </button>
    </div>
  </div>
</template>
