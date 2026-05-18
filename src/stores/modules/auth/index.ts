import { SetupStoreId } from '@/enum';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const token = ref(localStorage.getItem('vibe_token') || '');

  const isLoggedIn = computed(() => !!token.value);

  function setToken(value: string) {
    token.value = value;
    if (value) {
      localStorage.setItem('vibe_token', value);
    } else {
      localStorage.removeItem('vibe_token');
    }
  }

  function login(userToken: string) {
    setToken(userToken);
  }

  function resetStore() {
  }

  return {
    token,
    isLoggedIn,
    login,
    resetStore,
  };
});
