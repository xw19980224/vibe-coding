<script setup lang="ts">
import { UserAPI } from '@/service/api/user';
import ProfileHeader from './modules/profile-header.vue';
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
  const list = [{ name: 'works', label: '作品', count: userDetail.value?.works ?? 0 }];
  if (isSelf.value) {
    list.push({ name: 'likes', label: '收藏', count: userDetail.value?.collections ?? 0 });
  }
  return list;
});

function handleTabsChange() {}
</script>

<template>
  <div class="pt-24">
    <ProfileHeader
      :user-detail="userDetail"
      :is-self="isSelf"
      @edit-user-profile="openEditDialog"
    />

    <ElTabs v-model="activeTab" @tab-change="handleTabsChange">
      <ElTabPane v-for="(tab, index) in tabs" :key="index" :name="tab.name">
        <template #label>
          <div class="flex-center gap-1">
            <span class="text-base">{{ tab.label }}</span>
            <span class="text-xs">{{ tab.count }}</span>
          </div>
        </template>
      </ElTabPane>
    </ElTabs>

    <WorksSection :nickname="effectiveNickname" :is-self="isSelf" v-if="activeTab === 'works'" />

    <div class="flex flex-col items-center py-16" v-if="activeTab === 'likes'">
      <div class="text-4xl mb-3" style="opacity: 0.1">☆</div>
      <p class="text-sm text-slate-500 font-mono">暂无收藏的作品</p>
    </div>

    <UserOperationDialog
      v-model:visible="editDialogVisible"
      :user-info="userDetail"
      @submitted="fetchUserDetail()"
    />
  </div>
</template>
