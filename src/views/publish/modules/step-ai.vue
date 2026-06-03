<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form.ts';
import { useTagDict } from '@/hooks/common/tag-dict.ts';
import { TagDictTypes } from '@/enum/tag-dict.ts';

defineOptions({ name: 'StepAi' });

const { formRef, validate } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const form = defineModel<Api.VibeCoding.publishVibeCodingForm>('form', { required: true });

type Model = Pick<Api.VibeCoding.publishVibeCodingForm, 'tools' | 'mcps' | 'skills' | 'agents'>;
type RuleKey = Extract<keyof Model, 'tools'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  tools: [{ ...defaultRequiredRule, type: 'array', message: '请选择 AI 开发工具' }],
};

const { DEV_TOOL: toolOptions, MCP: mcpOptions, SKILL: skillOptions, AGENT: agentOptions } = useTagDict(TagDictTypes.DEV_TOOL, TagDictTypes.MCP, TagDictTypes.SKILL, TagDictTypes.AGENT);

defineExpose({ validate });
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-6">
    <!-- AI 开发工具 -->
    <ElFormItem label="AI 开发工具" prop="tools">
      <ElSelect
        v-model="form.tools"
        placeholder="输入或选择 AI 开发工具（Claude Code、Cursor 等）"
        multiple
        filterable
        allow-create
        default-first-option
      >
        <ElOption
          v-for="opt in toolOptions"
          :key="opt"
          :label="opt"
          :value="opt"
        />
      </ElSelect>
    </ElFormItem>

    <!-- Agent（AI 模型） -->
    <ElFormItem label="AI Agent">
      <ElSelect
        v-model="form.agents"
        placeholder="输入或选择 AI 模型（Opus 4.7、Codex 5.2 等）"
        multiple
        filterable
        allow-create
        default-first-option
      >
        <ElOption
          v-for="opt in agentOptions"
          :key="opt"
          :label="opt"
          :value="opt"
        />
      </ElSelect>
    </ElFormItem>

    <!-- MCP 服务 -->
    <ElFormItem label="MCP 服务">
      <ElSelect
        v-model="form.mcps"
        placeholder="输入或选择 MCP 服务"
        multiple
        filterable
        allow-create
        default-first-option
      >
        <ElOption
          v-for="opt in mcpOptions"
          :key="opt"
          :label="opt"
          :value="opt"
        />
      </ElSelect>
    </ElFormItem>

    <!-- Skills -->
    <ElFormItem label="Skills">
      <ElSelect
        v-model="form.skills"
        placeholder="输入或选择 Skills"
        multiple
        filterable
        allow-create
        default-first-option
      >
        <ElOption
          v-for="opt in skillOptions"
          :key="opt"
          :label="opt"
          :value="opt"
        />
      </ElSelect>
    </ElFormItem>
  </ElForm>
</template>
