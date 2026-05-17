<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({ name: 'LoginPage' });

const router = useRouter();

const form = reactive({
  username: '',
  password: '',
});

const loading = ref(false);
const error = ref('');

async function handleLogin() {
  if (!form.username || !form.password) {
    error.value = '请填写用户名和密码';
    return;
  }
  error.value = '';
  loading.value = true;
  // Simulate login
  await new Promise((r) => setTimeout(r, 1200));
  loading.value = false;
  router.push('/');
}

function goToRegister() {
  router.push('/register');
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-md">
        <!-- Back -->
        <button
          class="flex items-center gap-2 mb-8 text-sm cursor-pointer transition-colors duration-200"
          style="color: #64748B; font-family: 'JetBrains Mono', monospace"
          @click="router.push('/')"
          @mouseenter="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = '#F97316'"
          @mouseleave="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = '#64748B'"
        >
          <SvgIcon icon="lucide:arrow-left" style="font-size: 16px" />
          返回首页
        </button>

        <!-- Card -->
        <div
          class="rounded-2xl p-8"
          style="
            background: rgba(30, 41, 59, 0.6);
            border: 1px solid rgba(249, 115, 22, 0.08);
          "
        >
          <h1
            class="text-2xl font-700 mb-1 tracking-wider text-center"
            style="font-family: Orbitron, sans-serif; color: #F1F5F9"
          >
            登录
          </h1>
          <p
            class="text-sm mb-8 text-center"
            style="color: #64748B; font-family: 'JetBrains Mono', monospace"
          >
            欢迎回到 VibeCoding
          </p>

          <!-- Error -->
          <div
            v-if="error"
            class="mb-4 p-3 rounded-lg text-sm"
            style="
              background: rgba(239, 68, 68, 0.1);
              border: 1px solid rgba(239, 68, 68, 0.2);
              color: #FCA5A5;
            "
          >
            {{ error }}
          </div>

          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-xs font-500 mb-1.5" style="color: #94A3B8">用户名</label>
              <input
                v-model="form.username"
                type="text"
                placeholder="请输入用户名"
                class="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-200"
                style="
                  background: rgba(15, 23, 42, 0.6);
                  border: 1px solid rgba(249, 115, 22, 0.1);
                  color: #F1F5F9;
                  font-family: 'JetBrains Mono', monospace;
                "
                @focus="(e: FocusEvent) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(249, 115, 22, 0.4)';
                  (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
                }"
                @blur="(e: FocusEvent) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(249, 115, 22, 0.1)';
                  (e.target as HTMLElement).style.boxShadow = 'none';
                }"
              >
            </div>
            <div>
              <label class="block text-xs font-500 mb-1.5" style="color: #94A3B8">密码</label>
              <input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                class="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-200"
                style="
                  background: rgba(15, 23, 42, 0.6);
                  border: 1px solid rgba(249, 115, 22, 0.1);
                  color: #F1F5F9;
                  font-family: 'JetBrains Mono', monospace;
                "
                @keyup.enter="handleLogin"
                @focus="(e: FocusEvent) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(249, 115, 22, 0.4)';
                  (e.target as HTMLElement).style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)';
                }"
                @blur="(e: FocusEvent) => {
                  (e.target as HTMLElement).style.borderColor = 'rgba(249, 115, 22, 0.1)';
                  (e.target as HTMLElement).style.boxShadow = 'none';
                }"
              >
            </div>
          </div>

          <button
            class="w-full h-11 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
            :style="{
              background: loading ? '#334155' : 'linear-gradient(135deg, #F97316, #FB923C)',
              color: loading ? '#94A3B8' : '#fff',
            }"
            :disabled="loading"
            @click="handleLogin"
          >
            <div
              v-if="loading"
              class="w-4 h-4 rounded-full border-2 border-transparent animate-spin"
              style="border-top-color: #94A3B8"
            />
            {{ loading ? '登录中...' : '登录' }}
          </button>

          <p class="mt-6 text-center text-sm" style="color: #64748B">
            还没有账号？
            <span
              class="cursor-pointer transition-colors duration-200"
              style="color: #F97316"
              @click="goToRegister"
              @mouseenter="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = '#FB923C'"
              @mouseleave="(e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = '#F97316'"
            >
              立即注册
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
