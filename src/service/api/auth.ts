import { alova } from '@/service/request';

const AUTH_BASE_URL = '/auth';

export const AuthAPI = {
  login(data: Api.Auth.LoginParams) {
    return alova.Post<Api.Auth.LoginToken>(`${AUTH_BASE_URL}/login`, data);
  },

  sendCode(email: string) {
    return alova.Post(`${AUTH_BASE_URL}/send-code`, { email });
  },

  getWechatQR() {
    return alova.Get<string>(`${AUTH_BASE_URL}/wechat-qr`);
  },
};
