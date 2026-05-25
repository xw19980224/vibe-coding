<script setup lang="ts">
import GlobalHeader from '@/layouts/modules/global-header/index.vue';
import GlobalFooter from '@/layouts/modules/global-footer/index.vue';
import ParticleBg from '@/components/custom/particle-bg.vue';
import GlobalContent from '@/layouts/modules/global-content/index.vue';

defineOptions({ name: 'BaseLayout' });
</script>

<template>
  <div class="min-h-screen flex flex-col relative bg-slate-900">
    <ParticleBg />
    <GlobalHeader />

    <div class="relative z-10 flex-1 mx-auto w-full px-4 md:px-8 w-full sm:w-4/5">
      <GlobalContent />
    </div>

    <GlobalFooter />
  </div>
</template>
