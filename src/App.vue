<script setup lang="ts">
import BaseLayout from '@/layouts/base-layout/index.vue';
import BlankLayout from '@/layouts/blank-layout/index.vue';
import { useRoute } from 'vue-router';

defineOptions({ name: 'App' });

const route = useRoute();

const layoutComponent = computed(() =>
  route.meta.layout === 'blank' ? BlankLayout : BaseLayout,
);
const layoutProps = computed(() => route.meta.layoutProps ?? {});
</script>

<template>
  <component :is="layoutComponent" v-bind="layoutProps">
    <RouterView />
  </component>
</template>
