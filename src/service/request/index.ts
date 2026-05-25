import adapterFetch from '@a02/alova/fetch';
import type { RequestInstanceState } from './type';
import { createAlovaRequest } from '@a02/alova';
import { getAuthorization, showErrorMsg } from './share';
import { useAuthStore } from '@/stores/modules/auth';
import { getServiceBaseURL } from '@/utils/service';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);
const useMockInDev = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'Y';
const requestBaseURL = useMockInDev ? '' : baseURL;

const state: RequestInstanceState = {
  errMsgStack: [],
};

export const alova = createAlovaRequest(
  {
    baseURL: requestBaseURL,
    requestAdapter: adapterFetch(),
  },
  {
    onRequest({ config }) {
      const authorization = getAuthorization();
      if (authorization) {
        config.headers.Authorization = authorization;
      }
    },
    async isBackendSuccess(response) {
      const resp = response.clone();
      const data = await resp.json();
      const successCode = Number(import.meta.env.VITE_SERVICE_SUCCESS_CODE);
      return Number(data.code) === successCode;
    },

    async transformBackendResponse(response) {
      const data: App.Service.Response = await response.clone().json();
      return data.data;
    },

    async onError(error, response) {
      const authStore = useAuthStore();

      let responseCode = undefined;
      let message = error.message;
      if (response) {
        const data: Partial<App.Service.Response> = await response?.clone().json();
        responseCode = data.code;
        message = data.message;
      }

      function handleLogout() {
        showErrorMsg(state, message);
        authStore.resetStore();
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
        throw error;
      }
      showErrorMsg(state, message);
      throw error;
    },
  },
);
