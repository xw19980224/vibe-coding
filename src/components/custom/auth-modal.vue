<script setup lang="ts">
import { AuthAPI } from '@/service/api/auth';
import { useCaptcha } from '@a02/alova/client';
import { useAuthStore } from '@/stores/modules/auth';

defineOptions({ name: 'AuthModal' });

const authStore = useAuthStore();

const visible = defineModel<boolean>('visible', { required: true });

const emit = defineEmits<{
  login: [];
}>();

const email = ref('');
const code = ref('');
const error = ref('');
const errorShakeKey = ref(0);
const qrImages = ref('');

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
} = useCaptcha(() => AuthAPI.getWechatQR(), { initialCountdown: 60, force: true });

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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    await authStore.login({ email: email.value, code: code.value }, false);
    emit('login');
    visible.value = false;
  } catch {
    error.value = '登录失败，请重试';
    errorShakeKey.value++;
  }
}

function handleBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) visible.value = false;
}

watch(
  () => visible.value,
  async (v) => {
    if (v) {
      qrImages.value = await fetchQR();
    } else {
      qrImages.value = '';
      email.value = '';
      code.value = '';
      error.value = '';
      emailCountdown.value = 0;
      qrCountdown.value = 0;
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-200 flex items-center justify-center p-4"
        @click="handleBackdrop"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0"
          style="background: rgba(15, 23, 42, 0.92); backdrop-filter: blur(6px)"
        />

        <!-- Card -->
        <div
          class="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden"
          style="
            background: rgba(30, 41, 59, 0.92);
            border: 1px solid rgba(148, 163, 184, 0.08);
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
          "
        >
          <!-- Close -->
          <button
            class="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 z-10"
            style="color: #64748b"
            @click="visible = false"
            @mouseenter="
              (e: MouseEvent) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = '#94a3b8';
                el.style.background = 'rgba(148, 163, 184, 0.08)';
              }
            "
            @mouseleave="
              (e: MouseEvent) => {
                const el = e.currentTarget as HTMLElement;
                el.style.color = '#64748b';
                el.style.background = 'transparent';
              }
            "
          >
            <SvgIcon icon="lucide:x" style="font-size: 18px" />
          </button>

          <!-- ====== Header ====== -->
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

          <!-- ====== Content ====== -->
          <div class="flex flex-col md:flex-row px-10 py-8 gap-0">
            <!-- Left: Email login -->
            <div class="flex-1 md:pr-5">
              <h3
                class="text-lg font-600 mb-5"
                style="color: #cbd5e1; font-family: 'Noto Sans SC', sans-serif"
              >
                邮箱登录
              </h3>

              <!-- Error -->
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
              >
                — 其他方式 —
              </span>
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
                style="
                  background: rgba(15, 23, 42, 0.4);
                  border: 2px solid rgba(148, 163, 184, 0.2);
                "
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
                  >
                    加载中
                  </span>
                </div>
                <!-- Refresh overlay when expired -->
                <div
                  v-if="qrExpired && qrImages"
                  class="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer"
                  style="background: rgba(15, 23, 42, 0.85)"
                  @click="fetchQR()"
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

          <!-- ====== Footer ====== -->
          <div
            class="px-10 pb-10 pt-5 flex items-center justify-center gap-2 text-sm flex-wrap"
            style="border-top: 1px solid rgba(148, 163, 184, 0.06); color: #64748b"
          >
            <span>登录即代表同意</span>
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
            <span style="color: #475569">· 未注册邮箱将自动注册</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child {
  opacity: 0;
  transform: scale(0.92) translateY(16px);
}

.modal-leave-to > div:last-child {
  opacity: 0;
  transform: scale(0.96) translateY(8px);
}

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
