<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form.ts';

defineOptions({ name: 'StepAi' });

const { formRef, validate } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const form = defineModel<Api.VibeCoding.publishVibeProjectForm>('form', { required: true });

type Model = Pick<Api.VibeCoding.publishVibeProjectForm, 'tools' | 'mcps' | 'skills'>;
type RuleKey = Extract<keyof Model, 'tools'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  tools: [{ ...defaultRequiredRule, type: 'array', message: '请选择 Agent 工具' }],
};

const agentToolOptions = [
  { value: 'Claude Code', label: 'Claude Code' },
  { value: 'Cursor', label: 'Cursor' },
  { value: 'Windsurf', label: 'Windsurf' },
  { value: 'GitHub Copilot', label: 'GitHub Copilot' },
  { value: 'Cline', label: 'Cline' },
  { value: 'Aider', label: 'Aider' },
  { value: 'Continue', label: 'Continue' },
  { value: 'Amazon Q', label: 'Amazon Q' },
  { value: 'Codeium', label: 'Codeium' },
  { value: 'Tabnine', label: 'Tabnine' },
  { value: 'Replit Ghostwriter', label: 'Replit Ghostwriter' },
  { value: 'V0', label: 'V0' },
  { value: 'Bolt', label: 'Bolt' },
  { value: 'Lovable', label: 'Lovable' },
  { value: 'Replit Agent', label: 'Replit Agent' },
];

const mcpOptions = [
  { value: 'filesystem', label: 'Filesystem' },
  { value: 'github', label: 'GitHub' },
  { value: 'postgres', label: 'PostgreSQL' },
  { value: 'slack', label: 'Slack' },
  { value: 'notion', label: 'Notion' },
  { value: 'figma', label: 'Figma' },
  { value: 'supabase', label: 'Supabase' },
  { value: 'vercel', label: 'Vercel' },
  { value: 'cloudflare', label: 'Cloudflare' },
  { value: 'docker', label: 'Docker' },
  { value: 'redis', label: 'Redis' },
  { value: 'playwright', label: 'Playwright' },
  { value: 'puppeteer', label: 'Puppeteer' },
  { value: 'brave-search', label: 'Brave Search' },
  { value: 'tavily', label: 'Tavily' },
];

const skillOptions = [
  { value: 'frontend-design', label: '前端设计' },
  { value: 'backend-api', label: '后端 API' },
  { value: 'database-design', label: '数据库设计' },
  { value: 'devops', label: 'DevOps 部署' },
  { value: 'testing', label: '自动化测试' },
  { value: 'code-review', label: '代码审查' },
  { value: 'documentation', label: '文档生成' },
  { value: 'refactoring', label: '代码重构' },
  { value: 'performance', label: '性能优化' },
  { value: 'security-audit', label: '安全审计' },
  { value: 'ui-component', label: 'UI 组件开发' },
  { value: 'state-management', label: '状态管理' },
  { value: 'i18n', label: '国际化' },
  { value: 'accessibility', label: '无障碍' },
  { value: 'data-visualization', label: '数据可视化' },
];

defineExpose({ validate });
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-6">
    <!-- Agent 工具 -->
    <ElFormItem label="Agent 工具" prop="tools">
      <ElSelect v-model="form.tools" placeholder="选择使用的 Agent 工具" multiple>
        <ElOption v-for="opt in agentToolOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </ElSelect>
    </ElFormItem>

    <!-- MCP 服务 -->
    <ElFormItem label="MCP 服务" prop="mcps">
      <ElSelect v-model="form.mcps" placeholder="选择使用的 MCP 服务" multiple>
        <ElOption v-for="opt in mcpOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </ElSelect>
    </ElFormItem>

    <!-- Skills -->
    <ElFormItem label="Skills" prop="skills">
      <ElSelect v-model="form.skills" placeholder="选择使用的 Skills" multiple>
        <ElOption v-for="opt in skillOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
      </ElSelect>
    </ElFormItem>
  </ElForm>
</template>
