<script setup lang="ts">
defineOptions({ name: 'UserOperationDialog' });
interface Props {
  userInfo: Api.Auth.User;
}

defineProps<Props>();

const visible = defineModel<boolean>('visible', { required: true });
</script>

<template>
  <ModalDialog v-model="visible" title="编辑资料" closeOnClickModal closeOnPressEscape>
    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <button
          class="h-9 px-5 rounded-lg text-sm font-600 cursor-pointer transition-all duration-200 shrink-0"
          style="background: transparent; color: #f97316; border: 1px solid rgba(249, 115, 22, 0.3)"
          @click="visible = false"
        >
          取消
        </button>
        <button
          class="h-9 px-5 rounded-lg text-sm font-600 cursor-pointer transition-all duration-200 shrink-0"
          style="background: linear-gradient(135deg, #f97316, #fb923c); color: #fff"
          @click="console.log('save')"
        >
          保存
        </button>
      </div>
    </template>
  </ModalDialog>
</template>
