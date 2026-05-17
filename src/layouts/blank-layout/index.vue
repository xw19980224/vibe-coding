<script setup lang="ts">
defineOptions({ name: 'BlankLayout' });
</script>

<template>
  <div class="min-h-screen relative" style="background: #0F172A">
    <div
      class="absolute inset-0"
      style="
        background: radial-gradient(ellipse at 50% 0%, rgba(249, 115, 22, 0.06) 0%, transparent 50%);
      "
    />
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>
