<script setup lang="ts">
import { computed } from 'vue';
import { UILocales } from './locales/ui';
import { useAppStore } from '@/stores/modules/app';
import { useThemeStore } from '@/stores/modules/theme';

defineOptions({ name: 'App' });

const appStore = useAppStore();
useThemeStore();
const locale = computed(() => {
  return UILocales[appStore.locale];
});
</script>

<template>
  <ElConfigProvider :locale="locale">
    <AppProvider>
      <RouterView class="bg-layout" />
    </AppProvider>
  </ElConfigProvider>
</template>

<style scoped></style>
