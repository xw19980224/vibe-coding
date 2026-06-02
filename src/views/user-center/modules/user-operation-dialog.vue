<script setup lang="ts">
import { useFormRules, useNaiveForm } from '@/hooks/common/form.ts';
import { UserAPI } from '@/service/api/user';
import { useRequest } from '@a02/alova/client';
import type { UploadFile } from 'element-plus';

defineOptions({ name: 'UserOperationDialog' });

interface Props {
  userInfo: Omit<Api.User.UserInfo, 'id'>;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

type Model = Omit<Api.User.UserInfo, 'id'>;

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { required: true });

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const model = ref<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    avatar: '',
    nickname: '',
    introduction: '',
    githubUrl: '',
    rednoteUrl: '',
    bilibiliUrl: '',
    juejinUrl: '',
    weiboUrl: '',
    portalUrl: '',
  };
}

const rules = {
  nickname: [defaultRequiredRule],
  avatar: [
    {
      validator: () => avatarFileList.value.length > 0,
      message: '请上传头像',
      trigger: 'change',
    },
  ],
};

const avatarFileList = ref<UploadFile[]>([]);
const avatarPreview = ref('');

function fileToDataURL(file: UploadFile) {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target as FileReader).result as string);
    if (file.raw) reader.readAsDataURL(file.raw);
  });
}

async function handleAvatarChange(file: UploadFile) {
  avatarFileList.value = [file];
  avatarPreview.value = await fileToDataURL(file);
}

function handleAvatarRemove() {
  avatarFileList.value = [];
  avatarPreview.value = '';
}

const socialFields = [
  { key: 'githubUrl' as const, label: 'GitHub', placeholder: '输入 GitHub 链接...' },
  { key: 'rednoteUrl' as const, label: '小红书', placeholder: '输入小红书链接...' },
  { key: 'bilibiliUrl' as const, label: 'Bilibili', placeholder: '输入 Bilibili 链接...' },
  { key: 'juejinUrl' as const, label: '掘金', placeholder: '输入掘金链接...' },
  { key: 'weiboUrl' as const, label: '微博', placeholder: '输入微博链接...' },
  { key: 'portalUrl' as const, label: '个人网站', placeholder: '输入个人网站链接...' },
];

const { send: editUserInfo } = useRequest((data: Model) => UserAPI.editUserInfo(data), {
  immediate: false,
});

function handleInitModel() {
  model.value = createDefaultModel();
  Object.assign(model.value, props.userInfo);
}

function closeDialog() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  await editUserInfo(model.value);
  window.$message?.success('修改成功');
  closeDialog();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <ElDialog
    v-model="visible"
    title="编辑资料"
    :close-on-click-modal="false"
    destroy-on-close
    class="w-90vw sm:w-60vw lg:w-40vw"
  >
    <div class="max-h-60vh overflow-y-auto pr-2">
      <ElForm ref="formRef" :model="model" :rules="rules" label-position="top" class="space-y-6">
        <!-- 头像 -->
        <ElFormItem label="头像">
          <div class="flex-center w-full">
            <ElUpload
              :class="avatarFileList.length >= 1 ? 'hide' : ''"
              list-type="picture-card"
              :limit="1"
              :file-list="avatarFileList"
              :auto-upload="false"
              accept="image/*"
              @change="handleAvatarChange"
              @remove="handleAvatarRemove"
            >
              <span class="text-xs text-slate-400">修改头像</span>
            </ElUpload>
          </div>
        </ElFormItem>

        <!-- 用户名 -->
        <ElFormItem label="用户名" prop="nickname">
          <ElInput
            v-model="model.nickname"
            maxlength="15"
            show-word-limit
            placeholder="给自己取个名字..."
          />
        </ElFormItem>

        <!-- 简介 -->
        <ElFormItem label="简介">
          <ElInput
            v-model="model.introduction"
            type="textarea"
            :rows="3"
            maxlength="50"
            show-word-limit
            placeholder="介绍一下自己，让更多人认识你..."
          />
        </ElFormItem>

        <!-- 社交链接 -->
        <ElFormItem v-for="field in socialFields" :key="field.key" :label="field.label">
          <ElInput v-model="model[field.key]" :placeholder="field.placeholder" />
        </ElFormItem>
      </ElForm>
    </div>

    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <ElButton class="btn-ghost" @click="closeDialog">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">保存</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<style scoped>
:deep(.hide .el-upload--picture-card) {
  display: none;
}
</style>
