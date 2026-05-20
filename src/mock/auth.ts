import type { MockMethod } from 'vite-plugin-mock';

const SUCCESS_CODE = 200;

function wrapData<T>(data: T) {
  return {
    code: SUCCESS_CODE,
    message: 'success',
    data,
  };
}

export default [
  {
    url: '/auth/send-code',
    method: 'post',
    response: () => wrapData(null),
  },
  {
    url: '/auth/wechat-qr',
    method: 'get',
    response: () =>
      wrapData(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://vide-coding.dev&t=${Date.now()}`),
  },
  {
    url: '/auth/login',
    method: 'post',
    response: () => wrapData({ token: 'mock-token-' + Date.now() }),
  },
  {
    url: '/auth/user-info',
    method: 'get',
    response: () =>
      wrapData({
        id: 'u1',
        email: 'user@vide-coding.dev',
        nickname: 'VibeCoder',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        introduction: '热爱 AI 与代码的 Vibe Coder，相信每一行代码都有自己的灵魂。',
        phone: '138****0000',
      }),
  },
] as MockMethod[];
