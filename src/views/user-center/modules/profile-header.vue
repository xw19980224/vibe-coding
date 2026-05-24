<script setup lang="ts">
import { formatCompact } from '@/utils/common.ts';

defineOptions({ name: 'ProfileHeader' });

interface Props {
  userDetail: Api.User.UserDetail;
  isSelf: boolean;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'editUserProfile'): void;
}

const emit = defineEmits<Emits>();

const socialPlatforms = computed(() => {
  const platforms = [
    { key: 'githubUrl' as const, label: 'GitHub', icon: 'github' },
    { key: 'rednoteUrl' as const, label: '小红书', icon: 'rednote' },
    { key: 'bilibiliUrl' as const, label: 'Bilibili', icon: 'bilibili' },
    { key: 'juejinUrl' as const, label: '掘金', icon: 'juejin' },
    { key: 'weiboUrl' as const, label: '微博', icon: 'weibo' },
    { key: 'portalUrl' as const, label: '个人网站', icon: 'portal' },
  ];
  return platforms.filter((p) => props.userDetail?.[p.key]);
});

function openLink(url: string) {
  window.open(url, '_blank', 'noopener');
}
</script>

<template>
  <div class="flex flex-col md:flex-row items-start gap-8 mb-5">
    <!-- Avatar -->
    <ElAvatar :src="props.userDetail?.avatar" class="size-24 shrink-0" />

    <!-- Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1
            class="text-2xl font-700 mb-1 text-slate-100"
            style="font-family: Orbitron, sans-serif"
          >
            {{ props.userDetail?.nickname }}
          </h1>
          <p class="text-sm mb-1 text-slate-500" style="font-family: 'JetBrains Mono', monospace">
            {{ props.userDetail?.introduction }}
          </p>
          <div v-if="socialPlatforms.length" class="flex-y-center gap-2 mb-2">
            <button
              v-for="platform in socialPlatforms"
              :key="platform.key"
              :title="platform.label"
              class="w-8 h-8 rounded-lg flex-center cursor-pointer transition-all duration-200 text-slate-400"
              @click="openLink(props.userDetail?.[platform.key]!)"
            >
              <SvgIcon :local-icon="platform.icon" class="size-5" />
            </button>
          </div>
        </div>
        <button
          v-if="props.isSelf"
          class="h-9 px-5 rounded-lg text-sm font-600 cursor-pointer transition-all duration-200 shrink-0"
          style="background: transparent; color: #f97316; border: 1px solid rgba(249, 115, 22, 0.3)"
          @click="emit('editUserProfile')"
        >
          编辑资料
        </button>
      </div>

      <!-- Social Links -->

      <!-- Stats -->
      <div class="flex-y-center gap-8">
        <div class="text-center">
          <div class="text-xl font-700 text-slate-100" style="font-family: Orbitron, sans-serif">
            {{ formatCompact(props.userDetail?.works ?? 0) }}
          </div>
          <div class="text-xs mt-1 text-slate-500" style="font-family: 'JetBrains Mono', monospace">
            作品
          </div>
        </div>
        <div class="text-center">
          <div class="text-xl font-700 text-slate-100" style="font-family: Orbitron, sans-serif">
            {{ formatCompact(props.userDetail?.likes ?? 0) }}
          </div>
          <div class="text-xs mt-1 text-slate-500" style="font-family: 'JetBrains Mono', monospace">
            获赞
          </div>
        </div>
        <div class="text-center">
          <div class="text-xl font-700 text-slate-100" style="font-family: Orbitron, sans-serif">
            {{ formatCompact(props.userDetail?.following ?? 0) }}
          </div>
          <div class="text-xs mt-1 text-slate-500" style="font-family: 'JetBrains Mono', monospace">
            关注
          </div>
        </div>
        <div class="text-center">
          <div class="text-xl font-700 text-slate-100" style="font-family: Orbitron, sans-serif">
            {{ formatCompact(props.userDetail?.followers ?? 0) }}
          </div>
          <div class="text-xs mt-1 text-slate-500" style="font-family: 'JetBrains Mono', monospace">
            粉丝
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
