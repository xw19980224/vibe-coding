import adapterFetch from '@a02/alova/fetch';
import featureUsers from '../mocks/feature-users';
import type { RequestInstanceState } from './type';
import { createAlovaMockAdapter } from '@a02/alova/mock';
import { createAlovaRequest } from '@a02/alova';
import { getAuthorization, showErrorMsg } from './share';
import { useAuthStore } from '@/stores/modules/auth';
import { $t } from '@/locales';

const baseURL = import.meta.env.VITE_SERVICE_BASE_URL;

const state: RequestInstanceState = {
  errMsgStack: [],
};

const mockAdapter = createAlovaMockAdapter([featureUsers], {
  // using requestAdapter if not match mock request
  httpAdapter: adapterFetch(),

  // response delay time
  delay: 1000,

  // global mock toggle
  enable: true,
  matchMode: 'methodurl',
});

export const alova = createAlovaRequest(
  {
    baseURL,
    requestAdapter: import.meta.env.DEV ? mockAdapter : adapterFetch(),
  },
  {
    onRequest({ config }) {
      config.headers.Authorization = getAuthorization();
    },
    async isBackendSuccess(response) {
      const resp = response.clone();
      const data = await resp.json();
      return data.code === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },

    async transformBackendResponse(response) {
      return (await response.clone().json()).data;
    },

    async onError(error, response) {
      const authStore = useAuthStore();

      let responseCode = undefined;
      let message = error.message;
      if (response) {
        const data = await response?.clone().json();
        responseCode = data.code;
        message = data.message;
      }

      function handleLogout() {
        showErrorMsg(state, message);
        authStore.resetStore();
      }

      function logoutAndCleanup() {
        handleLogout();
        window.removeEventListener('beforeunload', handleLogout);
        state.errMsgStack = state.errMsgStack.filter((msg) => msg !== message);
      }

      // when the backend response code is in `logoutCodes`, it means the user will be logged out and redirected to login page
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (logoutCodes.includes(responseCode)) {
        handleLogout();
        throw error;
      }

      // when the backend response code is in `modalLogoutCodes`, it means the user will be logged out by displaying a modal
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(responseCode) && !state.errMsgStack?.includes(message)) {
        state.errMsgStack = [...(state.errMsgStack || []), message];

        // prevent the user from refreshing the page
        window.addEventListener('beforeunload', handleLogout);

        window.$dialog?.error({
          title: $t('common.error'),
          content: message,
          positiveText: $t('common.confirm'),
          maskClosable: false,
          closeOnEsc: false,
          onPositiveClick() {
            logoutAndCleanup();
          },
          onClose() {
            logoutAndCleanup();
          },
        });
        throw error;
      }
      showErrorMsg(state, message);
      throw error;
    },
  },
);
