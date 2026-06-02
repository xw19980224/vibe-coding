<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form.ts';
import { useDict } from '@/hooks/common/dict.ts';
import { DictTypes } from '@/enum/dict.ts';

defineOptions({ name: 'StepAi' });

const { formRef, validate } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const form = defineModel<Api.VibeCoding.publishVibeCodingForm>('form', { required: true });

type Model = Pick<Api.VibeCoding.publishVibeCodingForm, 'tools' | 'mcps' | 'skills'>;
type RuleKey = Extract<keyof Model, 'tools'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  tools: [{ ...defaultRequiredRule, type: 'array', message: '请选择 Agent 工具' }],
};

const dict = useDict(DictTypes.TOOL, DictTypes.MCP, DictTypes.SKILL);

const toolOptions = computed(() => dict[DictTypes.TOOL]?.value ?? []);
const mcpOptions = computed(() => dict[DictTypes.MCP]?.value ?? []);
const skillOptions = computed(() => dict[DictTypes.SKILL]?.value ?? []);

defineExpose({ validate });
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-6">
    <!-- Agent 工具 -->
    <ElFormItem label="Agent 工具" prop="tools">
      <ElSelect v-model="form.tools" placeholder="选择使用的 Agent 工具" multiple>
        <ElOption
          v-for="opt in toolOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </ElSelect>
    </ElFormItem>

    <!-- MCP 服务 -->
    <ElFormItem label="MCP 服务" prop="mcps">
      <ElSelect v-model="form.mcps" placeholder="选择使用的 MCP 服务" multiple>
        <ElOption
          v-for="opt in mcpOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </ElSelect>
    </ElFormItem>

    <!-- Skills -->
    <ElFormItem label="Skills" prop="skills">
      <ElSelect v-model="form.skills" placeholder="选择使用的 Skills" multiple>
        <ElOption
          v-for="opt in skillOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </ElSelect>
    </ElFormItem>
  </ElForm>
</template>
