<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form.ts';
import { useTagDict } from '@/hooks/common/tag-dict.ts';
import { TagDictTypes } from '@/enum/tag-dict.ts';

defineOptions({ name: 'StepBasic' });

const { formRef, validate } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const form = defineModel<Api.VibeCoding.publishVibeCodingForm>('form', { required: true });

type Model = Pick<
  Api.VibeCoding.publishVibeCodingForm,
  'title' | 'subtitle' | 'platform' | 'languages'
>;
type RuleKey = Extract<keyof Model, 'title' | 'subtitle' | 'platform'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  title: [defaultRequiredRule],
  subtitle: [defaultRequiredRule],
  platform: [defaultRequiredRule],
};

const {
  LANGUAGE: languageOptions,
  TECH_STACK: techStackOptions,
  PLATFORM: platformOptions,
} = useTagDict(TagDictTypes.LANGUAGE, TagDictTypes.TECH_STACK, TagDictTypes.PLATFORM);

defineExpose({ validate });
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-6">
    <!-- 作品名称 -->
    <ElFormItem label="作品名称" prop="title">
      <ElInput
        v-model="form.title"
        placeholder="给你的作品取个名字..."
        :maxlength="15"
        show-word-limit
      />
    </ElFormItem>

    <!-- 作品副标题 -->
    <ElFormItem label="作品副标题" prop="subtitle">
      <ElInput
        v-model="form.subtitle"
        type="textarea"
        placeholder="一句话描述你的作品..."
        :maxlength="50"
        show-word-limit
      />
    </ElFormItem>

    <!-- 开发语言 -->
    <ElFormItem label="开发语言" prop="languages">
      <ElSelect
        v-model="form.languages"
        placeholder="输入或选择开发语言..."
        multiple
        filterable
        allow-create
        default-first-option
      >
        <ElOption v-for="opt in languageOptions" :key="opt" :label="opt" :value="opt" />
      </ElSelect>
    </ElFormItem>

    <!-- 技术栈 -->
    <ElFormItem label="技术栈">
      <ElSelect
        v-model="form.techStack"
        placeholder="输入或选择技术栈..."
        multiple
        allow-create
        filterable
        default-first-option
      >
        <ElOption v-for="opt in techStackOptions" :key="opt" :label="opt" :value="opt" />
      </ElSelect>
    </ElFormItem>

    <!-- 运行平台 -->
    <ElFormItem label="运行平台" prop="platform">
      <ElSelect
        v-model="form.platform"
        placeholder="输入或选择运行平台..."
        filterable
        allow-create
        default-first-option
      >
        <ElOption v-for="opt in platformOptions" :key="opt" :label="opt" :value="opt" />
      </ElSelect>
    </ElFormItem>
  </ElForm>
</template>
