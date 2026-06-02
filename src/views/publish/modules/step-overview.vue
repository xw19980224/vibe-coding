<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form.ts';

defineOptions({ name: 'StepOverview' });

const form = defineModel<Api.VibeCoding.publishVibeCodingForm>('form', { required: true });
const emit = defineEmits<{ (e: 'jump', step: number): void }>();

const { formRef, validate } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const showDescPreview = ref(false);

type Model = Pick<
  Api.VibeCoding.publishVibeCodingForm,
  'title' | 'subtitle' | 'platform' | 'tools' | 'instructions' | 'coverUrl'
>;
type RuleKey = Extract<
  keyof Model,
  'title' | 'subtitle' | 'platform' | 'tools' | 'instructions' | 'coverUrl'
>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  title: [defaultRequiredRule],
  subtitle: [defaultRequiredRule],
  platform: [defaultRequiredRule],
  tools: [{ ...defaultRequiredRule, type: 'array', message: '请选择 Agent 工具' }],
  instructions: [defaultRequiredRule],
  coverUrl: [{ ...defaultRequiredRule, message: '请上传封面图' }],
};

defineExpose({ validate });
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-6">
    <!-- 基本信息 -->
    <div class="p-5 rounded-xl bg-slate-800/40 border border-orange-500/6">
      <h3
        class="text-base font-700 mb-4 text-slate-200 font-display cursor-pointer hover:text-orange transition-colors duration-200"
        @click="emit('jump', 1)"
      >
        基本信息
      </h3>
      <ElFormItem label="作品名称" prop="title">
        <ElInput disabled v-model="form.title" />
      </ElFormItem>
      <ElFormItem label="作品副标题" prop="subtitle">
        <ElInput disabled v-model="form.subtitle" />
      </ElFormItem>
      <ElFormItem label="开发语言">
        <ElSelect disabled v-model="form.languages" multiple />
      </ElFormItem>
      <ElFormItem label="技术栈">
        <ElSelect disabled v-model="form.techStack" multiple />
      </ElFormItem>
      <ElFormItem label="运行平台" prop="platform">
        <ElSelect disabled v-model="form.platform" />
      </ElFormItem>
    </div>

    <!-- 拓展信息 -->
    <div class="p-5 rounded-xl bg-slate-800/40 border border-orange-500/6">
      <h3
        class="text-base font-700 mb-4 text-slate-200 font-display cursor-pointer hover:text-orange transition-colors duration-200"
        @click="emit('jump', 2)"
      >
        拓展信息
      </h3>
      <ElFormItem label="标签">
        <ElSelect disabled v-model="form.tags" multiple />
      </ElFormItem>
      <ElFormItem label="开发周期">
        <ElSelect disabled v-model="form.duration" />
      </ElFormItem>
      <ElFormItem label="仓库地址">
        <ElInput disabled v-model="form.repoUrl" />
      </ElFormItem>
      <ElFormItem label="演示地址">
        <ElInput disabled v-model="form.demoUrl" />
      </ElFormItem>
      <ElFormItem label="是否上线">
        <ElSwitch disabled v-model="form.isOnline" />
      </ElFormItem>
      <ElFormItem v-if="form.isOnline" label="上线日期">
        <ElDatePicker disabled v-model="form.onlineDate" type="date" />
      </ElFormItem>
      <ElFormItem label="许可证">
        <ElSelect disabled v-model="form.license" />
      </ElFormItem>
    </div>

    <!-- AI 工具 -->
    <div class="p-5 rounded-xl bg-slate-800/40 border border-orange-500/6">
      <h3
        class="text-base font-700 mb-4 text-slate-200 font-display cursor-pointer hover:text-orange transition-colors duration-200"
        @click="emit('jump', 3)"
      >
        AI 工具
      </h3>
      <ElFormItem label="Agent 工具" prop="tools">
        <ElSelect disabled v-model="form.tools" multiple />
      </ElFormItem>
      <ElFormItem label="MCP 服务">
        <ElSelect disabled v-model="form.mcps" multiple />
      </ElFormItem>
      <ElFormItem label="Skills">
        <ElSelect disabled v-model="form.skills" multiple />
      </ElFormItem>
    </div>

    <!-- 项目描述 -->
    <div class="p-5 rounded-xl bg-slate-800/40 border border-orange-500/6">
      <h3
        class="text-base font-700 mb-4 text-slate-200 font-display cursor-pointer hover:text-orange transition-colors duration-200"
        @click="emit('jump', 4)"
      >
        项目说明书
      </h3>
      <div class="flex items-center gap-2 mb-4">
        <span class="text-xs text-slate-500 font-mono">预览</span>
        <ElSwitch v-model="showDescPreview" size="small" />
      </div>
      <ElFormItem label="作品说明书" prop="instructions">
        <ElInput
          disabled
          v-if="!showDescPreview"
          v-model="form.instructions"
          type="textarea"
          :rows="5"
        />
        <Markdown v-else :source="form.instructions" class="text-slate-400 text-sm" />
      </ElFormItem>
    </div>

    <!-- 封面与截图 -->
    <div class="p-5 rounded-xl bg-slate-800/40 border border-orange-500/6">
      <h3
        class="text-base font-700 mb-4 text-slate-200 font-display cursor-pointer hover:text-orange transition-colors duration-200"
        @click="emit('jump', 4)"
      >
        封面与截图
      </h3>
      <ElFormItem label="封面图" prop="coverUrl">
        <ElUpload
          :file-list="form.coverUrl ? [{ name: 'cover.png', url: form.coverUrl }] : []"
          :limit="1"
          list-type="picture-card"
          disabled
          :on-preview="() => {}"
        >
          <template #file="{ file }">
            <ElImage
              :src="file.url"
              :preview-src-list="[file.url]"
              fit="cover"
              class="size-full"
              preview-teleported
            />
          </template>
        </ElUpload>
      </ElFormItem>
      <ElFormItem label="项目截图">
        <ElUpload
          :file-list="
            form.screenshots.map((url, i) => ({ name: `shot-${i + 1}.png`, url, uid: i }))
          "
          :limit="9"
          list-type="picture-card"
          disabled
          :on-preview="() => {}"
        >
          <template #file="{ file }">
            <ElImage
              :src="file.url"
              :preview-src-list="form.screenshots"
              :initial-index="Number(file.uid)"
              fit="cover"
              class="size-full"
              preview-teleported
            />
          </template>
        </ElUpload>
      </ElFormItem>
    </div>
  </ElForm>
</template>
