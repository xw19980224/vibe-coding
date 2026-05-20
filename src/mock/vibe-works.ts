import type { MockMethod } from 'vite-plugin-mock';

const SUCCESS_CODE = 200;

export const mockCategories: Api.VibeCoding.Category[] = [
  { id: 'web', name: 'Web 应用', nameEn: 'Web App' },
  { id: 'mobile', name: '移动端', nameEn: 'Mobile' },
  { id: 'ai', name: 'AI 创作', nameEn: 'AI' },
  { id: 'game', name: '游戏', nameEn: 'Game' },
  { id: 'tool', name: '开发工具', nameEn: 'Tools' },
  { id: 'art', name: '视觉艺术', nameEn: 'Art' },
];

const authors: Api.VibeCoding.Author[] = [
  {
    id: 'u1',
    name: 'VibeCoder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u1',
    bio: '全栈开发者，热爱用 AI 写代码',
  },
  {
    id: 'u2',
    name: 'NeoDev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u2',
    bio: '前端工程师 · 设计系统爱好者',
  },
  {
    id: 'u3',
    name: 'PixelMage',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u3',
    bio: '独立游戏开发者',
  },
  {
    id: 'u4',
    name: 'PromptSmith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u4',
    bio: 'AI 工作流搭建师',
  },
  {
    id: 'u5',
    name: 'ShaderCat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u5',
    bio: '创意编程 & 视觉艺术',
  },
];

/** 瀑布流 mock 封面尺寸（与 picsum URL 路径一致） */
const COVER_SIZE_PRESETS = [
  { width: 640, height: 400 },
  { width: 640, height: 520 },
  { width: 640, height: 360 },
  { width: 640, height: 560 },
  { width: 480, height: 640 },
  { width: 640, height: 450 },
] as const;

type MockWorkBase = Omit<Api.VibeCoding.VibeProject, 'width' | 'height'>;

const mockWorksBase: MockWorkBase[] = [
  {
    id: 1,
    title: 'VibeCoding 作品广场',
    description: '赛博暖色风格的作品展示平台，支持分类筛选与无限滚动加载。',
    coverUrl: 'https://picsum.photos/seed/vibe-1/640/400',
    author: authors[0],
    tags: ['Vue3', 'Vite', 'UnoCSS'],
    category: 'web',
    likes: 1280,
    views: 15600,
    createdAt: '2026-05-15T10:00:00Z',
    vibePrompt: '用 Vue3 + Naive UI 做一个暗色作品展示站，主色橙色，带粒子背景',
    codeSnippet: 'pnpm create vite vibe-coding --template vue-ts',
    link: 'https://github.com',
    featured: true,
    status: 7,
  },
  {
    id: 2,
    title: 'AI 提示词工作台',
    description: '可视化编排 Prompt 节点，一键导出多模型对话模板。',
    coverUrl: 'https://picsum.photos/seed/vibe-2/640/400',
    author: authors[3],
    tags: ['AI', 'Prompt', 'Workflow'],
    category: 'ai',
    likes: 986,
    views: 11200,
    createdAt: '2026-05-14T08:30:00Z',
    vibePrompt: '做一个节点编辑器风格的 Prompt 编排工具，支持拖拽连线',
    featured: true,
    status: 7,
  },
  {
    id: 3,
    title: '霓虹跑酷 · Neon Runner',
    description: '2D 横版跑酷小游戏，合成器波普视觉与节奏音效。',
    coverUrl: 'https://picsum.photos/seed/vibe-3/640/400',
    author: authors[2],
    tags: ['Game', 'Canvas', 'WebAudio'],
    category: 'game',
    likes: 742,
    views: 9800,
    createdAt: '2026-05-13T16:20:00Z',
    featured: false,
  },
  {
    id: 4,
    title: '移动端习惯打卡',
    description: '极简习惯追踪 App 原型，周视图热力图与连续打卡激励。',
    coverUrl: 'https://picsum.photos/seed/vibe-4/640/400',
    author: authors[1],
    tags: ['React Native', 'UI'],
    category: 'mobile',
    likes: 531,
    views: 6700,
    createdAt: '2026-05-12T12:00:00Z',
    featured: false,
  },
  {
    id: 5,
    title: 'Git Diff 可视化',
    description: '将 diff 解析为可交互的时间线，支持按文件折叠与语义高亮。',
    coverUrl: 'https://picsum.photos/seed/vibe-5/640/400',
    author: authors[0],
    tags: ['DevTools', 'TypeScript'],
    category: 'tool',
    likes: 1102,
    views: 8900,
    createdAt: '2026-05-11T09:45:00Z',
    vibePrompt: '用 AST 解析 git diff，生成侧边栏文件树 + 行级高亮',
    codeSnippet: 'git diff HEAD~1 | vibe-diff --format json',
    featured: true,
    status: 7,
  },
  {
    id: 6,
    title: '流体渐变海报生成器',
    description: '基于 WebGL 的实时流体模拟，导出 4K 海报与动态壁纸。',
    coverUrl: 'https://picsum.photos/seed/vibe-6/640/400',
    author: authors[4],
    tags: ['WebGL', 'Generative Art'],
    category: 'art',
    likes: 889,
    views: 10200,
    createdAt: '2026-05-10T20:10:00Z',
    featured: false,
  },
  {
    id: 7,
    title: '团队站会计时器',
    description: 'Standup 专用倒计时，自动轮换发言人与议题记录。',
    coverUrl: 'https://picsum.photos/seed/vibe-7/640/400',
    author: authors[1],
    tags: ['SaaS', 'Productivity'],
    category: 'web',
    likes: 312,
    views: 4200,
    createdAt: '2026-05-09T14:00:00Z',
    featured: false,
  },
  {
    id: 8,
    title: '本地 RAG 知识库',
    description: '离线文档嵌入检索，支持 PDF/Markdown 混合索引。',
    coverUrl: 'https://picsum.photos/seed/vibe-8/640/400',
    author: authors[3],
    tags: ['RAG', 'LLM', 'Electron'],
    category: 'ai',
    likes: 1567,
    views: 18900,
    createdAt: '2026-05-08T11:30:00Z',
    vibePrompt: '用 Electron + 本地向量库做一个离线知识库问答工具',
    featured: true,
    status: 7,
  },
  {
    id: 9,
    title: '像素农场物语',
    description: '放置类像素农场，日夜循环与季节作物系统。',
    coverUrl: 'https://picsum.photos/seed/vibe-9/640/400',
    author: authors[2],
    tags: ['Pixel Art', 'Idle'],
    category: 'game',
    likes: 445,
    views: 5600,
    createdAt: '2026-05-07T18:00:00Z',
    featured: false,
  },
  {
    id: 10,
    title: 'API Mock 脚手架',
    description: '根据 OpenAPI 自动生成 vite-plugin-mock 路由与类型定义。',
    coverUrl: 'https://picsum.photos/seed/vibe-10/640/400',
    author: authors[0],
    tags: ['OpenAPI', 'Mock'],
    category: 'tool',
    likes: 678,
    views: 7100,
    createdAt: '2026-05-06T10:20:00Z',
    featured: false,
  },
  {
    id: 11,
    title: '旅行足迹地图',
    description: '在地图上点亮去过的城市，生成年度旅程长图分享。',
    coverUrl: 'https://picsum.photos/seed/vibe-11/640/400',
    author: authors[1],
    tags: ['Mapbox', 'Mobile'],
    category: 'mobile',
    likes: 923,
    views: 8400,
    createdAt: '2026-05-05T15:40:00Z',
    featured: false,
  },
  {
    id: 12,
    title: 'Shader 画廊',
    description: '收录 50+ 片元着色器 demo，支持全屏沉浸浏览。',
    coverUrl: 'https://picsum.photos/seed/vibe-12/640/400',
    author: authors[4],
    tags: ['GLSL', 'Creative Coding'],
    category: 'art',
    likes: 1204,
    views: 13400,
    createdAt: '2026-05-04T22:00:00Z',
    featured: true,
    status: 7,
  },
  {
    id: 13,
    title: '组件文档自动生成',
    description: '扫描 Vue SFC 提取 props/emits，输出交互式文档站点。',
    coverUrl: 'https://picsum.photos/seed/vibe-13/640/400',
    author: authors[0],
    tags: ['Vue', 'Documentation'],
    category: 'tool',
    likes: 389,
    views: 3900,
    createdAt: '2026-05-03T09:00:00Z',
    featured: false,
  },
  {
    id: 14,
    title: '语音笔记转写',
    description: '会议录音实时转文字，自动提取待办与关键决策点。',
    coverUrl: 'https://picsum.photos/seed/vibe-14/640/400',
    author: authors[3],
    tags: ['Whisper', 'AI'],
    category: 'ai',
    likes: 812,
    views: 9500,
    createdAt: '2026-05-02T13:15:00Z',
    featured: false,
  },
  {
    id: 15,
    title: '卡牌构筑 Roguelike',
    description: '程序生成关卡与卡牌池，每局 15 分钟快节奏对战。',
    coverUrl: 'https://picsum.photos/seed/vibe-15/640/400',
    author: authors[2],
    tags: ['Roguelike', 'Unity'],
    category: 'game',
    likes: 567,
    views: 6200,
    createdAt: '2026-05-01T19:30:00Z',
    featured: false,
  },
  {
    id: 16,
    title: '设计 Token 同步器',
    description: 'Figma Variables 双向同步到 CSS 变量与 Tailwind 配置。',
    coverUrl: 'https://picsum.photos/seed/vibe-16/640/400',
    author: authors[1],
    tags: ['Figma', 'Design System'],
    category: 'web',
    likes: 701,
    views: 5800,
    createdAt: '2026-04-30T11:00:00Z',
    featured: false,
  },
  {
    id: 17,
    title: '健康数据看板',
    description: '聚合手环睡眠/运动数据，生成周报告与趋势预测。',
    coverUrl: 'https://picsum.photos/seed/vibe-17/640/400',
    author: authors[1],
    tags: ['Health', 'Charts'],
    category: 'mobile',
    likes: 298,
    views: 3100,
    createdAt: '2026-04-29T07:45:00Z',
    featured: false,
  },
  {
    id: 18,
    title: 'ASCII 艺术相机',
    description: '摄像头实时帧转 ASCII 字符画，支持自定义字符集与配色。',
    coverUrl: 'https://picsum.photos/seed/vibe-18/640/400',
    author: authors[4],
    tags: ['ASCII', 'Camera'],
    category: 'art',
    likes: 634,
    views: 7200,
    createdAt: '2026-04-28T21:20:00Z',
    featured: false,
  },
  {
    id: 19,
    title: 'Monorepo 依赖图谱',
    description: '可视化 pnpm workspace 包依赖，检测循环引用与冗余依赖。',
    coverUrl: 'https://picsum.photos/seed/vibe-19/640/400',
    author: authors[0],
    tags: ['Monorepo', 'Graph'],
    category: 'tool',
    likes: 456,
    views: 4800,
    createdAt: '2026-04-27T16:00:00Z',
    featured: false,
  },
  {
    id: 20,
    title: '多语言字幕对齐',
    description: 'AI 翻译后自动对齐时间轴，导出 SRT/VTT 双语字幕。',
    coverUrl: 'https://picsum.photos/seed/vibe-20/640/400',
    author: authors[3],
    tags: ['NLP', 'Video'],
    category: 'ai',
    likes: 377,
    views: 4100,
    createdAt: '2026-04-26T12:30:00Z',
    featured: false,
  },
  {
    id: 21,
    title: '塔防迷你版',
    description: '三路出兵塔防，10 种防御塔升级树与 Boss 波次。',
    coverUrl: 'https://picsum.photos/seed/vibe-21/640/400',
    author: authors[2],
    tags: ['TD', 'Phaser'],
    category: 'game',
    likes: 521,
    views: 5900,
    createdAt: '2026-04-25T14:50:00Z',
    featured: false,
  },
  {
    id: 22,
    title: '播客剪辑助手',
    description: '静音段自动剪切，片头片尾模板与响度归一化一键导出。',
    coverUrl: 'https://picsum.photos/seed/vibe-22/640/400',
    author: authors[1],
    tags: ['Audio', 'Podcast'],
    category: 'web',
    likes: 189,
    views: 2200,
    createdAt: '2026-04-24T10:10:00Z',
    featured: false,
  },
  {
    id: 23,
    title: '扫码点餐小程序',
    description: '桌台二维码下单，后厨分单屏与备餐状态实时同步。',
    coverUrl: 'https://picsum.photos/seed/vibe-23/640/400',
    author: authors[1],
    tags: ['Mini Program', 'Restaurant'],
    category: 'mobile',
    likes: 834,
    views: 9100,
    createdAt: '2026-04-23T18:40:00Z',
    featured: false,
  },
  {
    id: 24,
    title: '生成式纹样实验室',
    description: '参数化伊斯兰几何纹样，导出 SVG 用于印刷与刺绣。',
    coverUrl: 'https://picsum.photos/seed/vibe-24/640/400',
    author: authors[4],
    tags: ['Generative', 'Pattern'],
    category: 'art',
    likes: 945,
    views: 8700,
    createdAt: '2026-04-22T20:00:00Z',
    featured: false,
  },
];

export const mockWorks: Api.VibeCoding.VibeProject[] = mockWorksBase.map((work, index) => {
  const { width, height } = COVER_SIZE_PRESETS[index % COVER_SIZE_PRESETS.length];
  return {
    ...work,
    width,
    height,
    coverUrl: `https://picsum.photos/seed/vibe-${work.id}/${width}/${height}`,
  };
});

function wrapData<T>(data: T) {
  return {
    code: SUCCESS_CODE,
    message: 'success',
    data,
  };
}

function filterWorks(query: Record<string, string | string[] | undefined>) {
  const category = query.category as string | undefined;
  const title = (query.title as string | undefined)?.trim().toLowerCase();
  const sort = (query.sort as Api.VibeCoding.SortMode | undefined) || 'latest';

  let list = [...mockWorks];

  if (category && category !== 'all') {
    list = list.filter((w) => w.category === category);
  }

  if (title) {
    list = list.filter(
      (w) =>
        w.title.toLowerCase().includes(title) ||
        w.description.toLowerCase().includes(title) ||
        w.tags.some((t) => t.toLowerCase().includes(title)),
    );
  }

  switch (sort) {
    case 'popular':
      list.sort((a, b) => b.likes - a.likes);
      break;
    case 'recommended':
      list.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.likes - a.likes;
      });
      break;
    case 'latest':
    default:
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  return list;
}

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

export default [
  {
    url: '/vibe-works/categories',
    method: 'get',
    response: () => wrapData(mockCategories),
  },
  {
    url: '/vibe-works/:id',
    method: 'get',
    response: ({ query }: { query: Record<string, string> }) => {
      const id = Number(query.id);
      const work = mockWorks.find((w) => w.id === id);
      if (!work) {
        return {
          code: 404,
          message: '作品不存在',
          data: null,
        };
      }
      return wrapData(work);
    },
  },
  {
    url: '/vibe-works',
    method: 'get',
    response: ({ query }: { query: Record<string, string | string[] | undefined> }) => {
      const list = filterWorks(query);
      return wrapData(paginate(list, query));
    },
  },
  {
    url: '/user/stats',
    method: 'get',
    response: () =>
      wrapData({
        works: mockWorks.length,
        likes: mockWorks.reduce((sum, w) => sum + w.likes, 0),
        following: 128,
        followers: 356,
      }),
  },
  {
    url: '/user/works',
    method: 'get',
    response: ({ query }: { query: Record<string, string | string[] | undefined> }) => {
      let list = [...mockWorks];
      const status = query.status ? Number(query.status) : undefined;
      if (status) {
        list = list.filter((w) => w.status === status);
      }
      return wrapData(paginate(list, query));
    },
  },
] as MockMethod[];
