import { alova } from '@/service/request';

export const AuthAPI = {
  login(data: Api.Auth.LoginParams) {
    return alova.Post<Api.Auth.LoginToken>('/auth/login', data)
  },

  sendCode(email: string) {
    return alova.Post('/auth/send-code', { email })
  },

  getWechatQR() {
    return alova.Get<string>('/auth/wechat-qr')
  },
};
