<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form.ts';
import type { UploadFile } from 'element-plus';

defineOptions({ name: 'StepMedia' });

const { formRef, validate } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const form = defineModel<Api.VibeCoding.publishVibeProjectForm>('form', { required: true });

type Model = Pick<Api.VibeCoding.publishVibeProjectForm, 'coverUrl'>;
type RuleKey = Extract<keyof Model, 'coverUrl'>;

const rules: Record<RuleKey, App.Global.FormRule[]> = {
  coverUrl: [{ ...defaultRequiredRule, message: '请上传封面图' }],
};

const coverFileList = ref<UploadFile[]>([]);
const screenshotFileList = ref<UploadFile[]>([]);

function restoreFileLists() {
  if (form.value.coverUrl) {
    coverFileList.value = [{ name: 'cover.png', url: form.value.coverUrl } as UploadFile];
  }
  screenshotFileList.value = form.value.screenshots.map((url, i) =>
    ({ name: `screenshot-${i + 1}.png`, url } as UploadFile),
  );
}

onMounted(restoreFileLists);

function fileToDataURL(file: UploadFile) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target as FileReader).result as string);
    if (file.raw) reader.readAsDataURL(file.raw);
  });
}

async function handleCoverChange(file: UploadFile) {
  coverFileList.value = [file];
  form.value.coverUrl = await fileToDataURL(file);
  formRef.value?.validateField('coverUrl');
}

function handleCoverRemove() {
  coverFileList.value = [];
  form.value.coverUrl = '';
}

async function handleScreenshotChange(file: UploadFile) {
  const url = await fileToDataURL(file);
  form.value.screenshots.push(url);
}

function handleScreenshotRemove(file: UploadFile) {
  const idx = screenshotFileList.value.indexOf(file);
  if (idx >= 0) {
    form.value.screenshots.splice(idx, 1);
  }
}

defineExpose({ validate });
</script>

<template>
  <ElForm ref="formRef" :model="form" :rules="rules" label-position="top" class="space-y-8">
    <!-- 封面图 -->
    <ElFormItem label="封面图" prop="coverUrl">
      <ElUpload :file-list="coverFileList" :limit="1" :auto-upload="false" list-type="picture-card" accept="image/*"
        @change="handleCoverChange" @remove="handleCoverRemove">
        <span class="text-2xl text-slate-500">+</span>
      </ElUpload>
    </ElFormItem>

    <!-- 项目截图 -->
    <ElFormItem label="项目截图" prop="screenshots">
      <ElUpload v-model:file-list="screenshotFileList" :limit="9" :auto-upload="false" list-type="picture-card"
        accept="image/*" multiple @change="handleScreenshotChange" @remove="handleScreenshotRemove">
        <span class="text-2xl text-slate-500">+</span>
      </ElUpload>
    </ElFormItem>
  </ElForm>
</template>
