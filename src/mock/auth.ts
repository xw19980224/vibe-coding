import type { MockMethod } from 'vite-plugin-mock';
import { wrapData } from './shared';

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
] as MockMethod[];
