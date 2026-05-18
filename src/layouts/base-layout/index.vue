<script setup lang="ts">
import GlobalHeader from '@/layouts/modules/global-header/index.vue';
import GlobalFooter from '@/layouts/modules/global-footer/index.vue';
import ParticleBg from '@/components/custom/particle-bg.vue';
import GlobalContent from '@/layouts/modules/global-content/index.vue';
import AuthModal from '@/components/custom/auth-modal.vue';
import { useAuthModalStore } from '@/stores/modules/auth-modal';

defineOptions({ name: 'BaseLayout' });

const authModal = useAuthModalStore();
</script>

<template>
  <div class="min-h-screen flex flex-col relative" style="background: #0f172a">
    <ParticleBg />
    <GlobalHeader />

    <div
      class="relative z-10 flex-1 mx-auto w-full px-4 md:px-8"
      style="max-width: min(90%, 1920px)"
    >
      <GlobalContent />
    </div>

    <GlobalFooter />
    <AuthModal v-model:visible="authModal.visible" />
  </div>
</template>
