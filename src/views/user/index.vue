<script setup lang="ts">
import { useRouter } from 'vue-router';
import { mockWorks } from '@/service/mocks/vibe-works';

defineOptions({ name: 'UserCenterPage' });

const router = useRouter();
const activeTab = ref('works');

const mockUser = {
  name: 'PixelWizard',
  bio: '热爱 AI 与代码的 Vibe Coder，相信每一行代码都有自己的灵魂。',
  joinedAt: '2026-03',
  worksCount: 12,
  likesReceived: 5678,
};

const myWorks = mockWorks.filter((w) => w.author.id === 'u1');

const tabs = [
  { id: 'works', label: '我的作品', icon: 'code' },
  { id: 'likes', label: '我的收藏', icon: 'heart' },
  { id: 'settings', label: '账号设置', icon: 'settings' },
];

function goToWork(id: string) {
  router.push(`/work/${id}`);
}
</script>

<template>
  <div class="pt-20 pb-12">
      <div class="max-w-5xl mx-auto px-4">
        <!-- Profile Header -->
        <div class="flex flex-col md:flex-row items-start gap-6 mb-10">
          <div
            class="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-700 shrink-0"
            style="
              background: linear-gradient(135deg, #F97316, #FB923C);
              color: #0F172A;
            "
          >
            {{ mockUser.name[0] }}
          </div>
          <div class="flex-1">
            <h1
              class="text-2xl font-700 mb-1"
              style="font-family: Orbitron, sans-serif; color: #F1F5F9"
            >
              {{ mockUser.name }}
            </h1>
            <p class="text-sm mb-3" style="color: #64748B; font-family: 'JetBrains Mono', monospace">
              {{ mockUser.bio }}
            </p>
            <div class="flex items-center gap-4 text-xs" style="color: #475569; font-family: 'JetBrains Mono', monospace">
              <span>{{ mockUser.worksCount }} 作品</span>
              <span>{{ mockUser.likesReceived }} 获赞</span>
              <span>{{ mockUser.joinedAt }} 加入</span>
            </div>
          </div>
          <button
            class="h-9 px-5 rounded-lg text-sm font-600 cursor-pointer transition-all duration-200 shrink-0"
            style="
              background: transparent;
              color: #F97316;
              border: 1px solid rgba(249, 115, 22, 0.3);
            "
          >
            编辑资料
          </button>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 mb-8 p-1 rounded-xl" style="background: rgba(30, 41, 59, 0.4)">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="flex-1 h-10 rounded-lg text-sm font-500 cursor-pointer transition-all duration-200 flex items-center justify-center gap-2"
            :style="{
              color: activeTab === tab.id ? '#F97316' : '#64748B',
              background: activeTab === tab.id ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
              fontFamily: '\'JetBrains Mono\', monospace',
            }"
            @click="activeTab = tab.id"
          >
            <SvgIcon :icon="'lucide:' + tab.icon" style="font-size: 16px" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Works Tab -->
        <div v-if="activeTab === 'works'">
          <div v-if="!myWorks.length" class="flex flex-col items-center py-16">
            <p class="text-base mb-4" style="color: #94A3B8">还没有发布作品</p>
            <button
              class="h-10 px-6 rounded-xl text-sm font-600 cursor-pointer"
              style="background: linear-gradient(135deg, #F97316, #FB923C); color: #fff"
              @click="router.push('/publish')"
            >
              发布你的第一个作品
            </button>
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="work in myWorks"
              :key="work.id"
              class="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200"
              style="
                background: rgba(30, 41, 59, 0.4);
                border: 1px solid rgba(249, 115, 22, 0.04);
              "
              @click="goToWork(work.id)"
              @mouseenter="(e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249, 115, 22, 0.2)';
              }"
              @mouseleave="(e: MouseEvent) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249, 115, 22, 0.04)';
              }"
            >
              <div
                class="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                style="background: rgba(15, 23, 42, 0.6)"
              >
                <SvgIcon icon="lucide:code" style="font-size: 20px; color: #F97316; opacity: 0.4" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-600 mb-0.5 truncate" style="color: #F1F5F9">{{ work.title }}</h3>
                <p class="text-xs truncate" style="color: #64748B">{{ work.description }}</p>
              </div>
              <div class="flex items-center gap-3 text-xs shrink-0" style="color: #475569">
                <span class="flex items-center gap-1"><SvgIcon icon="lucide:heart" style="font-size: 12px" />{{ work.likes }}</span>
                <span class="flex items-center gap-1"><SvgIcon icon="lucide:eye" style="font-size: 12px" />{{ work.views }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Likes Tab -->
        <div v-if="activeTab === 'likes'" class="flex flex-col items-center py-16">
          <p class="text-sm" style="color: #64748B">暂无收藏的作品</p>
        </div>

        <!-- Settings Tab -->
        <div v-if="activeTab === 'settings'" class="max-w-md mx-auto">
          <div class="rounded-2xl p-6 space-y-4" style="background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(249, 115, 22, 0.06)">
            <div>
              <label class="block text-xs font-500 mb-1.5" style="color: #94A3B8">用户名</label>
              <input
                type="text"
                :value="mockUser.name"
                class="w-full h-10 px-4 rounded-lg text-sm outline-none"
                style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(249, 115, 22, 0.1); color: #F1F5F9"
              >
            </div>
            <div>
              <label class="block text-xs font-500 mb-1.5" style="color: #94A3B8">简介</label>
              <textarea
                rows="3"
                :value="mockUser.bio"
                class="w-full p-3 rounded-lg text-sm outline-none resize-none"
                style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(249, 115, 22, 0.1); color: #F1F5F9"
              />
            </div>
            <button
              class="w-full h-10 rounded-xl text-sm font-600 cursor-pointer"
              style="background: linear-gradient(135deg, #F97316, #FB923C); color: #fff"
            >
              保存修改
            </button>
          </div>
          <button
            class="flex items-center gap-2 mt-4 mx-auto text-sm cursor-pointer transition-colors duration-200"
            style="color: #EF4444"
          >
            <SvgIcon icon="lucide:log-out" style="font-size: 16px" />
            退出登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
