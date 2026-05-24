<script setup lang="ts">
import { UserAPI } from '@/service/api/user';
import ProfileHeader from './modules/profile-header.vue';
import UserTabs from './modules/user-tabs.vue';
import UserOperationDialog from './modules/user-operation-dialog.vue';
import WorksSection from './modules/works-section.vue';
import { useAuthStore } from '@/stores/modules/auth';
import { useRequest } from '@a02/alova/client';
import { useRoute } from 'vue-router';
import { useBoolean } from '@a02/hooks';

defineOptions({ name: 'UserCenterPage' });

const authStore = useAuthStore();
const route = useRoute();

const effectiveNickname = computed(
  () => (route.params.nickname as string) || authStore.userInfo?.nickname,
);

const { bool: editDialogVisible, setTrue: openEditDialog } = useBoolean(false);
const activeTab = ref('works');

const { data: userDetail, send: fetchUserDetail } = useRequest(
  () => UserAPI.getUserDetail(effectiveNickname.value),
  { immediate: true },
);

watch(effectiveNickname, () => {
  fetchUserDetail();
});

const isSelf = computed(() => authStore.userInfo?.nickname === effectiveNickname.value);

const tabs = computed(() => {
  const list = [{ id: 'works', label: '作品', count: userDetail.value?.works ?? 0 }];
  if (isSelf.value) {
    list.push({ key: 'likes', label: '收藏', count: userDetail.value?.collections ?? 0 });
  }
  return list;
});
</script>

<template>
  <div class="pt-24">
    <ProfileHeader
      :user-detail="userDetail"
      :is-self="isSelf"
      @edit-user-profile="openEditDialog"
    />

    <UserTabs v-model:active-tab="activeTab" :tabs="tabs" />

    <template v-if="activeTab === 'works'">
      <WorksSection :nickname="effectiveNickname" :is-self="isSelf" />
    </template>

    <template v-if="activeTab === 'likes'">
      <div class="flex flex-col items-center py-16">
        <div class="text-4xl mb-3" style="opacity: 0.1">☆</div>
        <p class="text-sm text-slate-500" style="font-family: 'JetBrains Mono', monospace">
          暂无收藏的作品
        </p>
      </div>
    </template>

    <UserOperationDialog v-model:visible="editDialogVisible" :user-info="authStore.userInfo" />
  </div>
</template>
