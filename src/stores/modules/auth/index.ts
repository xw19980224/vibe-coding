import { SetupStoreId } from '@/enum';
import { defineStore } from 'pinia';
import { getToken } from './shared';
import { useLoading } from '@a02/hooks';
import { AuthAPI } from '@/service/api/auth';
import { UserAPI } from '@/service/api/user';
import { localStg } from '@/utils/storage';
import { useRouterPush } from '@/hooks/common/router.ts';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const authStore = useAuthStore();
  const token = ref(getToken());
  const { redirectFromLogin } = useRouterPush();
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const userInfo: Api.Auth.UserInfo = reactive<Api.Auth.UserInfo>({
    id: undefined,
    nickname: '',
    avatar: '',
  });

  const isLogin = computed(() => Boolean(token.value));

  async function login(
    data: Api.Auth.LoginParams,
    redirect: boolean = true,
    isDialog: boolean = false,
  ) {
    startLoading();
    try {
      const loginToken = await AuthAPI.login(data);
      const pass = await loginByToken(loginToken);

      if (!pass) {
        resetStore();
        return false;
      }

      if (!isDialog) {
        await redirectFromLogin(redirect);

        window.$notification?.success({
          title: '登录成功',
          message: `欢迎回来，${userInfo.nickname}`,
          duration: 4500,
        });
      }
      console.log('login');
      return true;
    } catch (error) {
      console.log(error);
      resetStore();
      return false;
    } finally {
      endLoading();
    }
  }

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    localStg.set('token', loginToken.token);

    const pass = await getUserInfo();

    if (pass) {
      token.value = loginToken.token;
      return true;
    }

    return false;
  }

  async function getUserInfo() {
    try {
      const info = await UserAPI.getUserInfo();
      Object.assign(userInfo, info);
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
    initUserInfo,
  };
});
