<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form.ts';

defineOptions({ name: 'StepExtended' });

const { formRef, validate } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const form = defineModel<Api.VibeCoding.publishVibeProjectForm>('form', { required: true });

const rules: Record<string, App.Global.FormRule[]> = {};

const tagGroups = [
  {
    label: '前端框架',
    options: [
      { value: 'Vue3', label: 'Vue3' },
      { value: 'React', label: 'React' },
      { value: 'Svelte', label: 'Svelte' },
      { value: 'Angular', label: 'Angular' },
    ],
  },
  {
    label: '开发语言',
    options: [
      { value: 'TypeScript', label: 'TypeScript' },
      { value: 'JavaScript', label: 'JavaScript' },
      { value: 'Python', label: 'Python' },
      { value: 'Go', label: 'Go' },
      { value: 'Rust', label: 'Rust' },
      { value: 'Java', label: 'Java' },
      { value: 'Kotlin', label: 'Kotlin' },
      { value: 'Swift', label: 'Swift' },
    ],
  },
  {
    label: '工具与框架',
    options: [
      { value: 'Vite', label: 'Vite' },
      { value: 'UnoCSS', label: 'UnoCSS' },
      { value: 'Tailwind CSS', label: 'Tailwind CSS' },
      { value: 'Webpack', label: 'Webpack' },
    ],
  },
  {
    label: '应用领域',
    options: [
      { value: 'AI', label: 'AI' },
      { value: 'Game', label: 'Game' },
      { value: 'WebGL', label: 'WebGL' },
      { value: 'Mobile', label: 'Mobile' },
      { value: 'SaaS', label: 'SaaS' },
      { value: 'DevTools', label: 'DevTools' },
      { value: 'Open Source', label: 'Open Source' },
    ],
  },
];

const durationOptions = [
  { value: '1周', label: '1 周' },
  { value: '2周', label: '2 周' },
  { value: '1个月', label: '1 个月' },
  { value: '3个月', label: '3 个月' },
  { value: '6个月', label: '6 个月' },
  { value: '1年', label: '1 年' },
];

const licenseOptions = [
  { value: 'MIT', label: 'MIT' },
  { value: 'Apache-2.0', label: 'Apache 2.0' },
  { value: 'GPL-3.0', label: 'GPL 3.0' },
  { value: 'BSD-3-Clause', label: 'BSD 3-Clause' },
  { value: 'AGPL-3.0', label: 'AGPL 3.0' },
  { value: 'MPL-2.0', label: 'MPL 2.0' },
  { value: 'Unlicense', label: 'Unlicense' },
];

defineExpose({ validate });
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-6">
    <!-- 标签 -->
    <ElFormItem label="标签">
      <ElSelect v-model="form.tags" placeholder="选择标签" multiple>
        <ElOptionGroup v-for="group in tagGroups" :key="group.label" :label="group.label">
          <ElOption v-for="opt in group.options" :key="opt.value" :label="opt.label" :value="opt.value" />
        </ElOptionGroup>
      </ElSelect>
    </ElFormItem>

    <!-- 开发周期 -->
    <ElFormItem label="开发周期">
      <ElSelect v-model="form.duration" placeholder="选择开发周期" clearable>
        <ElOption v-for="opt in durationOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </ElSelect>
    </ElFormItem>

    <!-- 仓库地址 -->
    <ElFormItem label="仓库地址">
      <ElInput v-model="form.repoUrl" placeholder="GitHub / Gitee 仓库地址..." />
    </ElFormItem>

    <!-- 演示地址 -->
    <ElFormItem label="演示地址">
      <ElInput v-model="form.demoUrl" placeholder="在线演示地址..." />
    </ElFormItem>

    <!-- 是否上线 -->
    <ElFormItem label="是否上线">
      <ElSwitch v-model="form.isOnline" />
    </ElFormItem>

    <!-- 上线日期 -->
    <ElFormItem v-if="form.isOnline" label="上线日期">
      <ElDatePicker v-model="form.onlineDate" type="date" placeholder="选择上线日期" />
    </ElFormItem>

    <!-- 许可证 -->
    <ElFormItem label="许可证">
      <ElSelect v-model="form.license" placeholder="选择许可证" clearable>
        <ElOption v-for="opt in licenseOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </ElSelect>
    </ElFormItem>
  </ElForm>
</template>
