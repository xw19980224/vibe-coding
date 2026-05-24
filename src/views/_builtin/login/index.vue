<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useRequest } from '@a02/alova/client';
import { useAuthStore } from '@/stores/modules/auth';
import { useFormRules, useNaiveForm } from '@/hooks/common/form.ts';
import { useAppStore } from '@/stores/modules/app';
import { useCaptcha } from '@/hooks/business/captacha.ts';
import { useCountDown } from '@a02/hooks';
import { AuthAPI } from '@/service/api/auth.ts';

defineOptions({ name: 'LoginPage' });

const appStore = useAppStore();
const router = useRouter();
const authStore = useAuthStore();
const { formRef, validate } = useNaiveForm();
const isMobile = computed(() => appStore.isMobile);
const {
  label: emailLabel,
  isCounting: isEmailCounting,
  loading: emailLoading,
  getEmailCaptcha,
} = useCaptcha();
const { start: startCountdown, isCounting: isQrCodeCounting } = useCountDown(60);

interface FormModel {
  email: string;
  code: string;
}

const model = ref<FormModel>({ email: '1035071992xw@gmail.com', code: '123456' });

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
  await authStore.login(model.value, true);
}

onMounted(() => {
  if (!isMobile.value) {
    sendQrCode();
  }
});
</script>

<template>
  <div class="min-h-screen flex-center px-4 relative" style="background: #0f172a">
    <div
      class="absolute inset-0"
      style="
        background: radial-gradient(
          ellipse at 50% 0%,
          rgba(249, 115, 22, 0.06) 0%,
          transparent 50%
        );
      "
    />

    <div class="relative z-10 w-full max-w-4xl">
      <!-- Back -->
      <ElButton
        class="mb-6 cursor-pointer"
        style="color: #64748b; font-family: 'JetBrains Mono', monospace"
        @click="router.push('/')"
        link
      >
        <template #icon>
          <SvgIcon icon="lucide:arrow-left" style="font-size: 16px" />
        </template>
        返回首页
      </ElButton>

      <!-- Card -->
      <ElCard
        class="rd-2xl overflow-hidden w-full"
        style="
          background: rgba(30, 41, 59, 0.92);
          border: 1px solid rgba(148, 163, 184, 0.08);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
        "
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-xl flex-center font-bold"
              style="
                background: linear-gradient(135deg, #f97316, #fb923c);
                color: #0f172a;
                font-size: 24px;
              "
            >
              V
            </div>
            <span
              class="text-2xl font-700 tracking-wider"
              style="font-family: Orbitron, sans-serif; color: #cbd5e1"
            >
              VIBE<span style="color: #f97316">CODING</span>
            </span>
          </div>
        </template>
        <div class="flex flex-col md:flex-row gap-0">
          <!-- Left: Email login -->
          <div class="flex-1 md:pr-5">
            <h3
              class="text-lg font-600 mb-5"
              style="color: #cbd5e1; font-family: 'Noto Sans SC', sans-serif"
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
                    style="
                      background: rgba(148, 163, 184, 0.06);
                      border: 1px solid rgba(148, 163, 184, 0.15);
                      color: #94a3b8;
                      font-family: 'JetBrains Mono', monospace;
                    "
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
              class="text-sm md:hidden"
              style="color: #475569; font-family: 'JetBrains Mono', monospace"
            >
              — 其他方式 —
            </span>
          </div>

          <!-- Right: WeChat QR -->
          <div class="hidden md:flex flex-col items-center justify-center md:w-64 md:pl-5">
            <h3
              class="text-lg font-600 mb-5"
              style="color: #cbd5e1; font-family: 'Noto Sans SC', sans-serif"
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
                <SvgIcon icon="lucide:rotate-cw" style="font-size: 24px; color: #94a3b8" />
                <span
                  class="text-xs"
                  style="color: #94a3b8; font-family: 'JetBrains Mono', monospace"
                >
                  点击刷新
                </span>
              </div>
            </div>
            <p
              class="text-sm text-center"
              style="color: #475569; font-family: 'JetBrains Mono', monospace"
            >
              请使用微信扫描二维码
            </p>
            <p class="text-sm text-center mt-1" style="color: #64748b">关注公众号即可完成登录</p>
          </div>
        </div>
        <template #footer>
          <div
            class="flex-center gap-2 text-sm flex-wrap"
            style="border-top: 1px solid rgba(148, 163, 184, 0.06); color: #64748b"
          >
            <span>登录即代表同意</span>
            <span
              class="cursor-pointer transition-colors duration-200 hover:underline"
              style="color: #f97316"
              >《用户协议》</span
            >
            <span>和</span>
            <span
              class="cursor-pointer transition-colors duration-200 hover:underline"
              style="color: #f97316"
              >《隐私政策》</span
            >
            <span style="color: #475569">未注册手机号将自动注册</span>
          </div>
        </template>
      </ElCard>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-card__header) {
  border-bottom: 0 !important;
}

:deep(.el-card__footer) {
  border-top: 0 !important;
}

:deep(.el-input__wrapper) {
  background: rgba(15, 23, 42, 0.5) !important;
  border: 1px solid rgba(148, 163, 184, 0.12);
  box-shadow: none !important;
}

:deep(.el-input__inner) {
  color: #cbd5e1;
  font-family: 'JetBrains Mono', monospace;
}

:deep(.el-input__wrapper:hover) {
  border-color: #f97316;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #f97316;
}
</style>
