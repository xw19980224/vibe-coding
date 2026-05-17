<script setup lang="ts">
import GlobalHeader from '@/layouts/modules/global-header/index.vue';
import GlobalFooter from '@/layouts/modules/global-footer/index.vue';
import ParticleBg from '@/components/custom/particle-bg.vue';

defineOptions({ name: 'BaseLayout' });

const props = withDefaults(
  defineProps<{
    showFooter?: boolean;
    showParticles?: boolean;
    particleCount?: number;
    particleSpeed?: number;
  }>(),
  {
    showFooter: true,
    showParticles: true,
    particleCount: 50,
    particleSpeed: 0.6,
  },
);

 </script>

<template>
  <div class="min-h-screen flex flex-col relative" style="background: #0F172A">
    <ParticleBg
      v-if="showParticles"
      :particle-count="particleCount"
      :speed="particleSpeed"
    />
    <GlobalHeader />

    <div class="relative z-10 flex-1">
      <slot />
    </div>

    <GlobalFooter v-if="showFooter" />
  </div>
</template>
