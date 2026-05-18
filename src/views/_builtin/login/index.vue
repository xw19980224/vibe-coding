<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCaptcha } from '@a02/alova/client';
import { AuthAPI } from '@/service/api/auth';
import { useAuthStore } from '@/stores/modules/auth';

defineOptions({ name: 'LoginPage' });

const router = useRouter();
const authStore = useAuthStore();
const email = ref('');
const code = ref('');
const error = ref('');
const errorShakeKey = ref(0);
const qrImages = ref('');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputStyle = {
  background: 'rgba(15, 23, 42, 0.5)',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  color: '#cbd5e1',
  fontFamily: "'JetBrains Mono', monospace",
};

const {
  send: sendEmailCode,
  countdown: emailCountdown,
  loading: emailCodeLoading,
} = useCaptcha(() => AuthAPI.sendCode(email.value), { initialCountdown: 60 });

const {
  send: fetchQR,
  countdown: qrCountdown,
  loading: qrLoading,
} = useCaptcha(() => AuthAPI.getWechatQR(), { initialCountdown: 60 });

const qrExpired = computed(() => qrCountdown.value <= 0);

function onFocus(e: FocusEvent) {
  const el = e.target as HTMLElement;
  el.style.borderColor = 'rgba(148, 163, 184, 0.35)';
  el.style.boxShadow = '0 0 0 2px rgba(148, 163, 184, 0.08)';
}

function onBlur(e: FocusEvent) {
  const el = e.target as HTMLElement;
  el.style.borderColor = 'rgba(148, 163, 184, 0.12)';
  el.style.boxShadow = 'none';
}

function handleSendCode() {
  if (!email.value) {
    error.value = '请输入邮箱地址';
    errorShakeKey.value++;
    return;
  }
  if (!emailRegex.test(email.value)) {
    error.value = '邮箱格式不正确';
    errorShakeKey.value++;
    return;
  }
  error.value = '';
  emailCountdown.value = 0;
  sendEmailCode();
}

async function handleLogin() {
  if (!email.value) {
    error.value = '请输入邮箱地址';
    errorShakeKey.value++;
    return;
  }
  if (!emailRegex.test(email.value)) {
    error.value = '邮箱格式不正确';
    errorShakeKey.value++;
    return;
  }
  if (!code.value) {
    error.value = '请输入验证码';
    errorShakeKey.value++;
    return;
  }
  error.value = '';
  try {
    await authStore.login({ email: email.value, code: code.value });
  } catch {
    error.value = '登录失败，请重试';
    errorShakeKey.value++;
  }
}

onMounted(async () => {
  qrImages.value = await fetchQR();
});
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 relative"
    style="background: #0f172a"
  >
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
      <button
        class="flex items-center gap-2 mb-6 text-sm cursor-pointer transition-colors duration-200"
        style="color: #64748b; font-family: 'JetBrains Mono', monospace"
        @click="router.push('/')"
        @mouseenter="(e: MouseEvent) => ((e.currentTarget as HTMLElement).style.color = '#94a3b8')"
        @mouseleave="(e: MouseEvent) => ((e.currentTarget as HTMLElement).style.color = '#64748b')"
      >
        <SvgIcon icon="lucide:arrow-left" style="font-size: 16px" />
        返回首页
      </button>

      <!-- Card -->
      <div
        class="rounded-2xl overflow-hidden"
        style="
          background: rgba(30, 41, 59, 0.92);
          border: 1px solid rgba(148, 163, 184, 0.08);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
        "
      >
        <!-- Header -->
        <div class="px-10 pt-10 pb-5">
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center font-bold"
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
        </div>

        <!-- Content -->
        <div class="flex flex-col md:flex-row px-10 py-8 gap-0">
          <!-- Left: Email login -->
          <div class="flex-1 md:pr-5">
            <h3
              class="text-lg font-600 mb-5"
              style="color: #cbd5e1; font-family: 'Noto Sans SC', sans-serif"
            >
              邮箱登录
            </h3>

            <div
              v-if="error"
              :key="errorShakeKey"
              class="mb-4 p-3 rounded-lg text-sm animate-shake"
              style="
                background: rgba(239, 68, 68, 0.1);
                border: 1px solid rgba(239, 68, 68, 0.2);
                color: #fca5a5;
              "
            >
              {{ error }}
            </div>

            <input
              v-model="email"
              type="email"
              placeholder="请输入邮箱地址"
              class="w-full h-12 px-4 rounded-lg text-sm outline-none transition-all duration-200 mb-4"
              :style="inputStyle"
              @focus="onFocus"
              @blur="onBlur"
            />

            <div class="grid grid-cols-[1fr_auto] gap-4 mb-6">
              <input
                v-model="code"
                type="text"
                placeholder="请输入验证码"
                maxlength="6"
                class="h-12 px-4 rounded-lg text-sm outline-none transition-all duration-200"
                :style="inputStyle"
                @focus="onFocus"
                @blur="onBlur"
              />
              <button
                class="h-12 px-5 rounded-lg text-sm font-500 cursor-pointer transition-all duration-200 shrink-0"
                style="
                  background: rgba(148, 163, 184, 0.06);
                  border: 1px solid rgba(148, 163, 184, 0.15);
                  color: #94a3b8;
                  font-family: 'JetBrains Mono', monospace;
                "
                :disabled="emailCountdown > 0 || emailCodeLoading"
                @click="handleSendCode"
              >
                {{
                  emailCountdown > 0
                    ? `重新发送 ${emailCountdown}s`
                    : emailCodeLoading
                      ? '发送中'
                      : '获取验证码'
                }}
              </button>
            </div>

            <button
              class="w-full h-12 rounded-lg text-base font-600 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
              :style="{
                background: authStore.loginLoading ? '#334155' : 'linear-gradient(135deg, #F97316, #FB923C)',
                color: authStore.loginLoading ? '#94A3B8' : '#fff',
                boxShadow: authStore.loginLoading ? 'none' : '0 2px 8px rgba(249, 115, 22, 0.15)',
              }"
              :disabled="authStore.loginLoading"
              @click="handleLogin"
            >
              <div
                v-if="authStore.loginLoading"
                class="w-4 h-4 rounded-full border-2 border-transparent animate-spin"
                style="border-top-color: #94a3b8"
              />
              {{ authStore.loginLoading ? '登录中...' : '登录 / 注册' }}
            </button>
          </div>

          <!-- Divider -->
          <div class="flex items-center justify-center py-5 md:py-0 md:px-8">
            <div
              class="hidden md:block"
              style="width: 1px; height: 220px; background: rgba(148, 163, 184, 0.1)"
            />
            <span
              class="text-sm md:hidden"
              style="color: #475569; font-family: 'JetBrains Mono', monospace"
              >— 其他方式 —</span
            >
          </div>

          <!-- Right: WeChat QR -->
          <div class="flex flex-col items-center justify-center md:w-64 md:pl-5">
            <h3
              class="text-lg font-600 mb-5"
              style="color: #cbd5e1; font-family: 'Noto Sans SC', sans-serif"
            >
              微信扫码登录
            </h3>
            <div
              class="relative w-48 h-48 rounded-xl flex items-center justify-center mb-4 overflow-hidden p-2"
              style="background: rgba(15, 23, 42, 0.4); border: 2px solid rgba(148, 163, 184, 0.2)"
            >
              <img
                v-if="qrImages"
                :src="qrImages"
                alt="微信扫码登录"
                class="w-full h-full transition-all duration-300"
                :class="{ 'blur-[2px] opacity-30': qrExpired }"
              />
              <div v-if="qrLoading && !qrImages" class="flex flex-col items-center gap-2">
                <div
                  class="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
                  style="border-top-color: #94a3b8"
                />
                <span
                  class="text-xs"
                  style="color: #94a3b8; font-family: 'JetBrains Mono', monospace"
                  >加载中</span
                >
              </div>
              <div
                v-if="qrExpired && qrImages"
                class="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer"
                style="background: rgba(15, 23, 42, 0.85)"
                @click="
                  qrCountdown = 0;
                  qrImages = fetchQR();
                "
              >
                <SvgIcon icon="lucide:rotate-cw" style="font-size: 24px; color: #94a3b8" />
                <span
                  class="text-xs"
                  style="color: #94a3b8; font-family: 'JetBrains Mono', monospace"
                  >点击刷新</span
                >
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

        <!-- Footer -->
        <div
          class="px-10 pb-10 pt-5 flex items-center justify-center gap-2 text-sm flex-wrap"
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
          <span style="color: #475569">· 未注册手机号将自动注册</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  50%,
  90% {
    transform: translateX(-4px);
  }
  30%,
  70% {
    transform: translateX(4px);
  }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
