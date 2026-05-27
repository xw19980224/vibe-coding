<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form.ts';

defineOptions({ name: 'StepBasic' });

const { formRef, validate } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const form = defineModel<Api.VibeCoding.publishVibeProjectForm>('form', { required: true });

type Model = Pick<Api.VibeCoding.publishVibeProjectForm, 'title' | 'subtitle' | 'platform' | 'languages'>;
type RuleKey = Extract<keyof Model, 'title' | 'subtitle' | 'platform'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  title: [defaultRequiredRule],
  subtitle: [defaultRequiredRule],
  platform: [defaultRequiredRule],
};

const languageGroups = [
  {
    label: '前端语言',
    options: [
      { value: 'TypeScript', label: 'TypeScript' },
      { value: 'JavaScript', label: 'JavaScript' },
      { value: 'Vue 3', label: 'Vue 3' },
      { value: 'React', label: 'React' },
    ],
  },
  {
    label: '后端语言',
    options: [
      { value: 'Python', label: 'Python' },
      { value: 'Go', label: 'Go' },
      { value: 'Rust', label: 'Rust' },
      { value: 'Java', label: 'Java' },
      { value: 'Kotlin', label: 'Kotlin' },
      { value: 'Swift', label: 'Swift' },
    ],
  },
  {
    label: '样式',
    options: [
      { value: 'CSS', label: 'CSS' },
      { value: 'SCSS', label: 'SCSS' },
      { value: 'UnoCSS', label: 'UnoCSS' },
      { value: 'Tailwind CSS', label: 'Tailwind CSS' },
    ],
  },
];

const techStack = ref<string[]>([]);

const platformOptions = [
  { value: 'web', label: 'Web' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'desktop', label: '桌面端' },
  { value: 'mini-program', label: '小程序' },
  { value: 'cross', label: '跨平台' },
];

defineExpose({ validate });
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-6">
    <!-- 作品名称 -->
    <ElFormItem label="作品名称" prop="title">
      <ElInput v-model="form.title" placeholder="给你的作品取个名字..." :maxlength="15" show-word-limit />
    </ElFormItem>

    <!-- 作品副标题 -->
    <ElFormItem label="作品副标题" prop="subtitle">
      <ElInput v-model="form.subtitle" type="textarea" placeholder="一句话描述你的作品..." :maxlength="50" show-word-limit />
    </ElFormItem>

    <!-- 开发语言 -->
    <ElFormItem label="开发语言" prop="languages">
      <ElSelect v-model="form.languages" placeholder="选择开发语言" multiple>
        <ElOptionGroup v-for="group in languageGroups" :key="group.label" :label="group.label">
          <ElOption v-for="opt in group.options" :key="opt.value" :label="opt.label" :value="opt.value" />
        </ElOptionGroup>
      </ElSelect>
    </ElFormItem>

    <!-- 技术栈 -->
    <ElFormItem label="技术栈">
      <ElSelect v-model="techStack" placeholder="输入技术栈名称..." multiple allow-create filterable />
    </ElFormItem>

    <!-- 运行平台 -->
    <ElFormItem label="运行平台" prop="platform">
      <ElSelect v-model="form.platform" placeholder="选择运行平台">
        <ElOption v-for="opt in platformOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </ElSelect>
    </ElFormItem>
  </ElForm>
</template>
