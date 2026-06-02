<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';
import { useAppStore } from '@/stores/modules/app';
import { clearAuthStorage } from '@/stores/modules/auth/shared';
import LoginDialog from '@/layouts/modules/global-header/components/login-dialog.vue';
import { useBoolean } from '@a02/hooks';

defineOptions({ name: 'GlobalHeader' });

const router = useRouter();
const auth = useAuthStore();
const { isMobile } = useAppStore();
const { bool: visible, setTrue: openDialog } = useBoolean();
const searchQuery = ref('');

function goHome() {
  router.push('/');
}

function goToPublish() {
  router.push('/publish');
}

function goToUser() {
  router.push('/user-center');
}

function handleLogout() {
  clearAuthStorage();
  auth.resetStore();
  router.push('/');
}

let debounceTimer: ReturnType<typeof setTimeout>;

function onSearchInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {}, 300);
}
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-100 h-16 bg-slate-900/80 backdrop-blur-sm border-b border-orange-500/10"
  >
    <div class="mx-auto h-full w-full sm:w-4/5 flex-y-center justify-between px-4 md:px-8">
      <!-- Left: Logo + Search -->
      <div class="flex-y-center gap-4 md:gap-6 flex-1 min-w-0">
        <div class="flex-y-center gap-2 cursor-pointer select-none shrink-0" @click="goHome">
          <div
            class="w-8 h-8 rounded-lg flex-center text-sm font-bold text-slate-900 bg-linear-135-#f97316-#fb923c"
          >
            V
          </div>
          <span
            class="text-lg font-700 tracking-wider hidden sm:inline text-slate-100 font-display"
          >
            VIBE<span class="text-orange">CODING</span>
          </span>
        </div>

        <div class="flex-1 max-w-md relative flex-y-center">
          <span class="absolute left-3 text-slate-500">
            <SvgIcon icon="lucide:search" class="text-lg" />
          </span>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="'搜索作品、标签或作者...'"
            class="w-full h-9 pl-10 pr-4 rounded-lg text-sm outline-none transition-all duration-200 text-slate-100 font-mono bg-slate-800/60 border border-orange-500/12"
            @input="onSearchInput"
          />
        </div>
      </div>

      <!-- Right: Actions -->
      <div class="flex-y-center gap-3 shrink-0 ml-4">
        <template v-if="auth.isLogin">
          <button
            class="h-9 px-4 rounded-lg text-sm font-600 cursor-pointer transition-all duration-300 flex-y-center gap-1.5 text-orange-400 border border-orange/25 bg-orange/10 backdrop-blur-sm hover:(bg-orange/20 border-orange/45)"
            @click="goToPublish"
          >
            <SvgIcon icon="lucide:plus" class="text-lg" />
            <span class="hidden sm:inline">发布作品</span>
          </button>

          <!-- Mobile: dropdown menu -->
          <template v-if="isMobile">
            <ElDropdown trigger="click">
              <button
                class="h-9 w-9 rounded-lg cursor-pointer transition-all duration-200 flex-center text-slate-400 bg-slate-800/60 border border-orange-500/12"
              >
                <SvgIcon icon="lucide:ellipsis-vertical" class="text-xl" />
              </button>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem @click="goToUser">
                    <SvgIcon icon="lucide:user" class="text-lg mr-2" />
                    个人中心
                  </ElDropdownItem>
                  <ElDropdownItem @click="handleLogout">
                    <SvgIcon icon="lucide:log-out" class="text-lg mr-2" />
                    注销登录
                  </ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown>
          </template>

          <!-- Desktop: separate icon buttons -->
          <template v-else>
            <button
              class="h-9 w-9 rounded-lg cursor-pointer transition-all duration-200 flex-center text-slate-400 bg-slate-800/60 border border-orange-500/12"
              title="个人中心"
              @click="goToUser"
            >
              <SvgIcon icon="lucide:user" class="text-xl" />
            </button>
            <button
              class="h-9 w-9 rounded-lg cursor-pointer transition-all duration-200 flex-center text-slate-400 bg-slate-800/60 border border-orange-500/12"
              title="注销登录"
              @click="handleLogout"
            >
              <SvgIcon icon="lucide:log-out" class="text-xl" />
            </button>
          </template>
        </template>
        <button
          v-else
          class="h-9 px-5 rounded-lg text-sm font-600 cursor-pointer transition-all duration-200 btn-ghost"
          @click="openDialog"
        >
          登录
        </button>
      </div>
    </div>
  </nav>
  <LoginDialog v-model:visible="visible" />
</template>
