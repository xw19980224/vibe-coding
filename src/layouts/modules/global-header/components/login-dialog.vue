<script setup lang="ts">
import { useRequest } from '@a02/alova/client';
import { useAuthStore } from '@/stores/modules/auth';
import { useFormRules, useNaiveForm } from '@/hooks/common/form.ts';
import { useAppStore } from '@/stores/modules/app';
import { useCountDown } from '@a02/hooks';
import { AuthAPI } from '@/service/api/auth.ts';
import { useCaptcha } from '@/hooks/business/captacha.ts';

defineOptions({ name: 'LoginDialog' });

const appStore = useAppStore();
const authStore = useAuthStore();
const { formRef, validate, restoreValidation } = useNaiveForm();
const isMobile = computed(() => appStore.isMobile);
const {
  label: emailLabel,
  isCounting: isEmailCounting,
  loading: emailLoading,
  getEmailCaptcha,
} = useCaptcha();
const { start: startCountdown, isCounting: isQrCodeCounting } = useCountDown(60);

const visible = defineModel<boolean>('visible', { required: true });

interface FormModel {
  email: string;
  code: string;
}

function initFormModelValue() {
  return {
    email: '1035071992xw@gmail.com',
    code: '123456',
  };
}

const model = ref<FormModel>(initFormModelValue());

const rules = computed<Record<keyof FormModel, App.Global.FormRule[]>>(() => {
  const { formRules } = useFormRules();

  return { email: formRules.email, code: formRules.code };
});

const {
  data: qrCodeData,
  loading: qrCodeLoading,
  send: sendQrCode,
  onSuccess: sendQrCodeSuccess,
} = useRequest(() => AuthAPI.getWechatQR(), {
  immediate: false,
  force: true,
});

sendQrCodeSuccess(() => {
  startCountdown();
});

async function handleSubmit() {
  await validate();
  const result = await authStore.login(model.value, false, true);
  if (!result) {
    window.$message?.error?.('账号或密码错误');
  } else {
    visible.value = false;
  }
}

watch(visible, (val) => {
  if (val) {
    if (!isMobile.value) {
      sendQrCode();
    }
  } else {
    restoreValidation();
  }
});
</script>

<template>
  <ElDialog
    v-model="visible"
    class="rd-2 max-w-4xl w-full"
    :close-on-click-modal="false"
    lock-scroll
  >
    <template #header>
      <div class="flex items-center gap-3 w-full">
        <div
          class="w-12 h-12 rounded-xl flex-center font-bold text-slate-900"
          style="
            background: linear-gradient(135deg, #f97316, #fb923c);
            font-size: 24px;
          "
        >
          V
        </div>
        <span
          class="text-2xl font-700 tracking-wider text-slate-300 font-display"
        >
          VIBE<span style="color: #f97316">CODING</span>
        </span>
      </div>
    </template>
    <div class="flex flex-col md:flex-row px-10 pt-8 gap-0">
      <!-- Left: Email login -->
      <div class="flex-1 md:pr-5">
        <h3
          class="text-lg font-600 mb-5 text-slate-300 font-sans"
        >
          邮箱登录
        </h3>
        <ElForm
          ref="formRef"
          :model="model"
          :rules="rules"
          size="large"
          :show-label="false"
          @keyup.enter="handleSubmit"
        >
          <ElFormItem prop="email">
            <ElInput v-model="model.email" placeholder="请输入邮箱" />
          </ElFormItem>
          <ElFormItem prop="code">
            <div class="w-full flex-y-center gap-3">
              <ElInput v-model="model.code" placeholder="请输入验证码" maxlength="6" />
              <ElButton
                :disabled="isEmailCounting"
                :loading="emailLoading"
                @click="getEmailCaptcha(model.email)"
                class="text-slate-400 font-mono" style="background: rgba(148, 163, 184, 0.06);
                  border: 1px solid rgba(148, 163, 184, 0.15)"
              >
                {{ emailLabel }}
              </ElButton>
            </div>
          </ElFormItem>
          <ElButton
            :disabled="authStore.loginLoading"
            @click="handleSubmit"
            class="w-full"
            :style="{
              background: 'linear-gradient(135deg, #F97316, #FB923C)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 2px 8px rgba(249, 115, 22, 0.15)',
            }"
          >
            {{ authStore.loginLoading ? '登录中...' : '登录 / 注册' }}
          </ElButton>
        </ElForm>
      </div>

      <!-- Divider -->
      <div class="hidden md:flex flex-center py-5 md:py-0 md:px-8">
        <div
          class="hidden md:block"
          style="width: 1px; height: 220px; background: rgba(148, 163, 184, 0.1)"
        />
        <span
          class="text-sm md:hidden text-slate-600 font-mono"
        >
          — 其他方式 —
        </span>
      </div>

      <!-- Right: WeChat QR -->
      <div class="hidden md:flex flex-col items-center justify-center md:w-64 md:pl-5">
        <h3
          class="text-lg font-600 mb-5 text-slate-300 font-sans"
        >
          微信扫码登录
        </h3>
        <div
          class="relative w-48 h-48 rounded-xl flex-center mb-4 overflow-hidden p-2"
          style="background: rgba(15, 23, 42, 0.4); border: 2px solid rgba(148, 163, 184, 0.2)"
        >
          <ElImage
            v-if="qrCodeData"
            :src="qrCodeData"
            v-loading="qrCodeLoading"
            lazy
            alt="微信扫码登录"
            :class="{ 'blur-[2px] opacity-30': !isQrCodeCounting }"
          />
          <!-- Refresh overlay when expired -->
          <div
            v-if="!isQrCodeCounting"
            class="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer"
            style="background: rgba(15, 23, 42, 0.85)"
            @click="sendQrCode()"
          >
            <SvgIcon icon="lucide:rotate-cw" class="text-slate-400" style="font-size: 24px" />
            <span class="text-xs text-slate-400 font-mono" >
              点击刷新
            </span>
          </div>
        </div>
        <p
          class="text-sm text-center text-slate-600 font-mono"
        >
          请使用微信扫描二维码
        </p>
        <p class="text-sm text-center mt-1 text-slate-500" >关注公众号即可完成登录</p>
      </div>
    </div>
    <template #footer>
      <div
        class="px-10 pb-5 pt-5 flex-center gap-2 text-sm flex-wrap text-slate-500"
        style="border-top: 1px solid rgba(148, 163, 184, 0.06)"
      >
        <span>登录即代表同意</span>
        <div class="flex-center">
          <span
            class="cursor-pointer transition-colors duration-200 hover:underline"
            style="color: #f97316"
          >
            《用户协议》
          </span>
          <span>和</span>
          <span
            class="cursor-pointer transition-colors duration-200 hover:underline"
            style="color: #f97316"
          >
            《隐私政策》
          </span>
        </div>
        <span  class="text-slate-600">未注册邮箱将自动注册</span>
      </div>
    </template>
  </ElDialog>
</template>
<style lang="scss" scoped></style>
