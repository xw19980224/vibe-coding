<script setup lang="ts">
import { useRouter } from 'vue-router';
import { mockWorks } from '@/mock/vibe-works';

defineOptions({ name: 'UserCenterPage' });

const router = useRouter();
const activeTab = ref('works');

const mockUser = {
  name: 'PixelWizard',
  bio: '热爱 AI 与代码的 Vibe Coder，相信每一行代码都有自己的灵魂。',
  joinedAt: '2026-03',
  worksCount: 12,
  likesReceived: 5678,
  following: 128,
  followers: 356,
};

const myWorks = mockWorks.filter((w) => w.author.id === 'u1');

const tabs = [
  { id: 'works', label: '作品', count: myWorks.length },
  { id: 'likes', label: '收藏', count: 0 },
];

const stats = [
  { label: '作品', value: mockUser.worksCount },
  { label: '获赞', value: mockUser.likesReceived },
  { label: '关注', value: mockUser.following },
  { label: '粉丝', value: mockUser.followers },
];

function goToWork(id: string) {
  router.push(`/work/${id}`);
}
</script>

<template>
  <div class="pt-24 pb-12">
    <!-- Profile Header -->
    <div class="flex flex-col md:flex-row items-start gap-8 mb-10">
      <!-- Avatar -->
      <div
        class="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-700 shrink-0"
        style="background: linear-gradient(135deg, #f97316, #fb923c); color: #0f172a"
      >
        {{ mockUser.name[0] }}
      </div>

      <!-- Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h1
              class="text-2xl font-700 mb-1"
              style="font-family: Orbitron, sans-serif; color: #f1f5f9"
            >
              {{ mockUser.name }}
            </h1>
            <p
              class="text-sm mb-4"
              style="color: #64748b; font-family: 'JetBrains Mono', monospace"
            >
              {{ mockUser.bio }}
            </p>
          </div>
          <button
            class="h-9 px-5 rounded-lg text-sm font-600 cursor-pointer transition-all duration-200 shrink-0"
            style="background: transparent; color: #f97316; border: 1px solid rgba(249, 115, 22, 0.3)"
          >
            编辑资料
          </button>
        </div>

        <!-- Stats -->
        <div class="flex items-center gap-8">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="text-center"
          >
            <div class="text-xl font-700" style="font-family: Orbitron, sans-serif; color: #f1f5f9">
              {{ stat.value >= 1000 ? (stat.value / 1000).toFixed(1) + 'k' : stat.value }}
            </div>
            <div
              class="text-xs mt-1"
              style="color: #64748b; font-family: 'JetBrains Mono', monospace"
            >
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-0 mb-8" style="border-bottom: 1px solid rgba(148, 163, 184, 0.08)">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="relative h-11 px-6 text-sm font-500 cursor-pointer transition-all duration-200 flex items-center gap-2"
        :style="{
          color: activeTab === tab.id ? '#f1f5f9' : '#64748B',
          fontFamily: 'JetBrains Mono, monospace',
        }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
        <span
          v-if="tab.count !== undefined"
          class="text-xs"
          :style="{ color: activeTab === tab.id ? '#F97316' : '#475569' }"
        >
          {{ tab.count }}
        </span>
        <div
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 rounded-full"
          style="height: 2px; background: #F97316"
        />
      </button>
    </div>

    <!-- Works Tab -->
    <div v-if="activeTab === 'works'">
      <div v-if="!myWorks.length" class="flex flex-col items-center py-16">
        <div class="text-5xl mb-4" style="opacity: 0.15">(´･_･`)</div>
        <p class="text-sm mb-4" style="color: #94a3b8; font-family: 'JetBrains Mono', monospace">
          还没有发布作品
        </p>
        <button
          class="h-10 px-6 rounded-xl text-sm font-600 cursor-pointer transition-all duration-200"
          style="background: linear-gradient(135deg, #f97316, #fb923c); color: #fff"
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
          style="background: rgba(30, 41, 59, 0.3); border: 1px solid rgba(148, 163, 184, 0.04)"
          @click="goToWork(String(work.id))"
          @mouseenter="
            (e: MouseEvent) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249, 115, 22, 0.2)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(30, 41, 59, 0.5)';
            }
          "
          @mouseleave="
            (e: MouseEvent) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(148, 163, 184, 0.04)';
              (e.currentTarget as HTMLElement).style.background = 'rgba(30, 41, 59, 0.3)';
            }
          "
        >
          <div
            class="w-12 h-12 rounded-lg overflow-hidden shrink-0"
            style="background: rgba(15, 23, 42, 0.6)"
          >
            <img
              v-if="work.coverUrl"
              :src="work.coverUrl"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-600 mb-0.5 truncate" style="color: #cbd5e1">
              {{ work.title }}
            </h3>
            <p class="text-xs truncate" style="color: #64748b">{{ work.description }}</p>
          </div>
          <div class="flex items-center gap-4 text-xs shrink-0" style="color: #475569">
            <span class="flex items-center gap-1">
              <SvgIcon icon="lucide:heart" style="font-size: 12px" />{{ work.likes }}
            </span>
            <span class="flex items-center gap-1">
              <SvgIcon icon="lucide:eye" style="font-size: 12px" />{{ work.views }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Likes Tab -->
    <div
      v-if="activeTab === 'likes'"
      class="flex flex-col items-center py-16"
    >
      <div class="text-4xl mb-3" style="opacity: 0.1">☆</div>
      <p class="text-sm" style="color: #64748b; font-family: 'JetBrains Mono', monospace">
        暂无收藏的作品
      </p>
    </div>

  </div>
</template>
