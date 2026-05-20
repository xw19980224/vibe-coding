import { SetupStoreId } from '@/enum';
import { defineStore } from 'pinia';
import { getToken } from './shared';
import { useLoading } from '@a02/hooks';
import { AuthAPI } from '@/service/api/auth';
import { localStg } from '@/utils/storage';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const token = ref(getToken());
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const userInfo = ref<Api.Auth.User | null>(null);

  const isLogin = computed(() => Boolean(token.value));


  async function login(data: Api.Auth.LoginParams, redirect: boolean = true) {
    startLoading();

    try {
      const loginToken = await AuthAPI.login(data);
      const pass = await loginByToken(loginToken);

      if (!pass) {
        await resetStore();
        return;
      }

      redirect && router.push('/');
    } catch (error) {
      await resetStore();
    } finally {
      endLoading();
    }
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    localStg.set('token', loginToken.token);

    const pass = await getUserInfo();

    console.log("userInfo", userInfo.value);

    if (pass) {
      token.value = loginToken.token;
      return true;
    }

    return false;
  }

  async function getUserInfo() {
    try {
      userInfo.value = await AuthAPI.getUserInfo();
      return true;
    } catch {
      return false;
    }
  }

  async function initUserInfo() {
    const hasToken = getToken();

    if (hasToken) {
      const pass = await getUserInfo();

      if (!pass) {
        resetStore();
      }
    }
  }

  function resetStore() {
    authStore.$reset();
  }

  return {
    token,
    userInfo,
    isLogin,
    loginLoading,
    login,
    resetStore,
    initUserInfo
  };
});
