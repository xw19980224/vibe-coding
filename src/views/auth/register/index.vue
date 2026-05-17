<script setup lang="ts">
import { useRouter } from 'vue-router';

defineOptions({ name: 'RegisterPage' });

const router = useRouter();

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const loading = ref(false);
const error = ref('');

async function handleRegister() {
  error.value = '';
  if (!form.username || !form.email || !form.password) {
    error.value = '请填写所有必填字段';
    return;
  }
  if (form.password !== form.confirmPassword) {
    error.value = '两次输入的密码不一致';
    return;
  }
  if (form.password.length < 6) {
    error.value = '密码长度不能少于 6 位';
    return;
  }
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  loading.value = false;
  router.push('/login');
}

function goToLogin() {
  router.push('/login');
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-md">
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
            注册
          </h1>
          <p
            class="text-sm mb-8 text-center"
            style="color: #64748B; font-family: 'JetBrains Mono', monospace"
          >
            加入 VibeCoding 创作社区
          </p>

          <div v-if="error" class="mb-4 p-3 rounded-lg text-sm" style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); color: #FCA5A5;">
            {{ error }}
          </div>

          <div class="space-y-4 mb-6">
            <div>
              <label class="block text-xs font-500 mb-1.5" style="color: #94A3B8">用户名 *</label>
              <input
                v-model="form.username"
                type="text"
                placeholder="选择一个用户名"
                class="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-200"
                style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(249, 115, 22, 0.1); color: #F1F5F9; font-family: 'JetBrains Mono', monospace"
              >
            </div>
            <div>
              <label class="block text-xs font-500 mb-1.5" style="color: #94A3B8">邮箱 *</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                class="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-200"
                style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(249, 115, 22, 0.1); color: #F1F5F9; font-family: 'JetBrains Mono', monospace"
              >
            </div>
            <div>
              <label class="block text-xs font-500 mb-1.5" style="color: #94A3B8">密码 *</label>
              <input
                v-model="form.password"
                type="password"
                placeholder="至少 6 位密码"
                class="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-200"
                style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(249, 115, 22, 0.1); color: #F1F5F9; font-family: 'JetBrains Mono', monospace"
              >
            </div>
            <div>
              <label class="block text-xs font-500 mb-1.5" style="color: #94A3B8">确认密码 *</label>
              <input
                v-model="form.confirmPassword"
                type="password"
                placeholder="再次输入密码"
                class="w-full h-11 px-4 rounded-lg text-sm outline-none transition-all duration-200"
                style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(249, 115, 22, 0.1); color: #F1F5F9; font-family: 'JetBrains Mono', monospace"
                @keyup.enter="handleRegister"
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
            @click="handleRegister"
          >
            <div v-if="loading" class="w-4 h-4 rounded-full border-2 border-transparent animate-spin" style="border-top-color: #94A3B8" />
            {{ loading ? '注册中...' : '创建账号' }}
          </button>

          <p class="mt-6 text-center text-sm" style="color: #64748B">
            已有账号？
            <span class="cursor-pointer transition-colors duration-200" style="color: #F97316" @click="goToLogin">立即登录</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
