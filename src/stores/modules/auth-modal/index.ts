import { defineStore } from 'pinia';

export const useAuthModalStore = defineStore('auth-modal-store', () => {
  const visible = ref(false);

  function open() {
    visible.value = true;
  }

  function close() {
    visible.value = false;
  }

  return { visible, open, close };
});
