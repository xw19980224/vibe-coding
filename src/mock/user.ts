import type { MockMethod } from 'vite-plugin-mock';
import { mockWorks } from './vibe-works';
import { wrapData } from './shared';

export const mockUsers: Api.User.UserDetail[] = [
  {
    id: 'u1',
    email: 'vibecoder@vide-coding.dev',
    nickname: 'VibeCoder',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    introduction: '热爱 AI 与代码的 Vibe Coder，相信每一行代码都有自己的灵魂。',
    phone: '138****0000',
    githubUrl: 'https://github.com/vibecoder',
    rednoteUrl: '',
    bilibiliUrl: '',
    juejinUrl: '',
    weiboUrl: '',
    portalUrl: 'https://vibecoder.dev',
    works: 20,
    collections: 23,
    likes: mockWorks.reduce((sum, w) => sum + (w.author.name === 'VibeCoder' ? w.likes : 0), 0),
    following: 128,
    followers: 356,
  },
  {
    id: 'u2',
    email: 'neodev@vide-coding.dev',
    nickname: 'NeoDev',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop',
    introduction: '前端工程师 · 设计系统爱好者，追求极致像素与交互体验。',
    phone: '139****1111',
    githubUrl: 'https://github.com/neodev',
    rednoteUrl: '',
    bilibiliUrl: '',
    juejinUrl: 'https://juejin.cn/user/neodev',
    weiboUrl: '',
    portalUrl: '',
    works: 6,
    collections: 15,
    likes: 3240,
    following: 89,
    followers: 201,
  },
  {
    id: 'u3',
    email: 'pixelmage@vide-coding.dev',
    nickname: 'PixelMage',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    introduction: '独立游戏开发者，像素即是魔法，代码即是咒语。',
    phone: '137****2222',
    githubUrl: '',
    rednoteUrl: 'https://www.xiaohongshu.com/user/pixelmage',
    bilibiliUrl: 'https://space.bilibili.com/pixelmage',
    juejinUrl: '',
    weiboUrl: '',
    portalUrl: 'https://pixelmage.io',
    works: 5,
    collections: 18,
    likes: 2510,
    following: 56,
    followers: 142,
  },
];

function paginate<T>(list: T[], query: Record<string, string | string[] | undefined>) {
  const pageNumber = Math.max(1, Number(query.pageNumber) || 1);
  const pageSize = Math.max(1, Number(query.pageSize) || 12);
  const start = (pageNumber - 1) * pageSize;
  const records = list.slice(start, start + pageSize);

  return {
    records,
    pageNumber,
    pageSize,
    total: list.length,
  };
}

function toUserInfo(user: Api.User.UserDetail): Api.User.UserInfo {
  const {
    id,
    email,
    nickname,
    introduction,
    avatar,
    phone,
    githubUrl,
    rednoteUrl,
    bilibiliUrl,
    juejinUrl,
    weiboUrl,
    portalUrl,
  } = user;
  return {
    id,
    email,
    nickname,
    introduction,
    avatar,
    phone,
    githubUrl,
    rednoteUrl,
    bilibiliUrl,
    juejinUrl,
    weiboUrl,
    portalUrl,
  };
}

export default [
  {
    url: '/user/info',
    method: 'get',
    response: () => wrapData(toUserInfo(mockUsers[0])),
  },
  {
    url: '/user/detail',
    method: 'get',
    response: ({ query }: { query: Record<string, string | string[] | undefined> }) => {
      const nickname = query.nickname as string | undefined;
      const user = nickname ? mockUsers.find((u) => u.nickname === nickname) : mockUsers[0];
      if (!user) {
        return { code: 404, message: '用户不存在', data: null };
      }
      return wrapData(user);
    },
  },
  {
    url: '/user/works',
    method: 'get',
    response: ({ query }: { query: Record<string, string | string[] | undefined> }) => {
      let list = [...mockWorks];
      const nickname = query.nickname as string | undefined;
      if (nickname) {
        list = list.filter((w) => w.author.name === nickname);
      }
      const status = query.status ? Number(query.status) : undefined;
      if (status) {
        list = list.filter((w) => w.status === status);
      }
      return wrapData(paginate(list, query));
    },
  },
] as MockMethod[];
