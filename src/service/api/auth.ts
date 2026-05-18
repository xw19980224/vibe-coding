import { alova } from '@/service/request';

export const AuthAPI = {
  login: (data: Api.Auth.LoginParams) => alova.Post<Api.Auth.LoginToken>('/auth/login', data),

  sendCode: (email: string) => alova.Post('/auth/send-code', { email }),

  getWechatQR: () => alova.Get<string>('/auth/wechat-qr'),

  getUserInfo: () => alova.Get<Api.Auth.User>('/auth/user-info'),
};
