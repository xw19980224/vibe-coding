import type { MockMethod } from 'vite-plugin-mock';
import { wrapData } from './shared';

export const mockCategories: Api.VibeCoding.Category[] = [
  { id: 1, code: 'web', name: 'Web 应用', nameEn: 'Web App' },
  { id: 2, code: 'mobile', name: '移动端', nameEn: 'Mobile' },
  { id: 3, code: 'ai', name: 'AI 创作', nameEn: 'AI' },
  { id: 4, code: 'game', name: '游戏', nameEn: 'Game' },
  { id: 5, code: 'tool', name: '开发工具', nameEn: 'Tools' },
  { id: 6, code: 'art', name: '视觉艺术', nameEn: 'Art' },
];

const authors: Api.VibeCoding.Author[] = [
  {
    id: 'u1',
    name: 'VibeCoder',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u1',
    bio: '全栈开发者，热爱用 AI 写代码',
    githubUrl: 'https://github.com/vibecoder',
    rednoteUrl: '',
    bilibiliUrl: '',
    juejinUrl: '',
    weiboUrl: '',
    portalUrl: 'https://vibecoder.dev',
    works: 20,
    likes: 1280,
    following: 128,
    followers: 356,
  },
  {
    id: 'u2',
    name: 'NeoDev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u2',
    bio: '前端工程师 · 设计系统爱好者',
    githubUrl: 'https://github.com/neodev',
    juejinUrl: 'https://juejin.cn/user/neodev',
    works: 6,
    likes: 3240,
    following: 89,
    followers: 201,
  },
  {
    id: 'u3',
    name: 'PixelMage',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u3',
    bio: '独立游戏开发者',
    rednoteUrl: 'https://www.xiaohongshu.com/user/pixelmage',
    bilibiliUrl: 'https://space.bilibili.com/pixelmage',
    portalUrl: 'https://pixelmage.io',
    works: 5,
    likes: 2510,
    following: 56,
    followers: 142,
  },
  {
    id: 'u4',
    name: 'PromptSmith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u4',
    bio: 'AI 工作流搭建师',
    githubUrl: 'https://github.com/promptsmith',
    works: 4,
    likes: 986,
    following: 35,
    followers: 78,
  },
  {
    id: 'u5',
    name: 'ShaderCat',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=u5',
    bio: '创意编程 & 视觉艺术',
    bilibiliUrl: 'https://space.bilibili.com/shaderCat',
    works: 4,
    likes: 1204,
    following: 42,
    followers: 96,
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

/** 详情轮播截图尺寸（3:4，与 Carousel aspect-3/4 一致） */
const SCREENSHOT_SIZE_PRESETS = [
  { width: 600, height: 800 },
  { width: 640, height: 853 },
  { width: 540, height: 720 },
  { width: 600, height: 800 },
] as const;

/** 作品截图 mock URL（每件 4 张，seed 与作品 id 绑定保证稳定） */
function screenshotsFor(workId: number): string[] {
  return SCREENSHOT_SIZE_PRESETS.map(
    ({ width, height }, i) =>
      `https://picsum.photos/seed/vibe-${workId}-ss-${i + 1}/${width}/${height}`,
  );
}

/** 按分类与 id 生成运行平台 mock */
function platformFor(category: string, workId: number): Api.VibeCoding.RuntimePlatform {
  switch (category) {
    case 'mobile':
      return workId % 2 === 0 ? 'ios' : 'android';
    case 'game':
      return (['cross', 'web', 'desktop'] as const)[workId % 3];
    case 'tool':
      return workId % 2 === 0 ? 'desktop' : 'web';
    case 'ai':
      return workId % 3 === 0 ? 'cross' : 'web';
    case 'art':
      return workId % 4 === 0 ? 'desktop' : 'web';
    case 'web':
    default:
      return workId % 5 === 0 ? 'mini-program' : 'web';
  }
}

const mockWorksBaseEntries = [
  {
    id: 1,
    title: 'VibeCoding 作品广场',
    description: `赛博暖色风格的创作者作品展示与发现平台。

## 核心特性

- **作品广场** — 分类筛选 + 推荐/最新/热门排序 + 无限滚动加载
- **作品详情** — Markdown 项目介绍 + 轮播截图 + 在线演示/源码仓库
- **个人中心** — 编辑资料/社交链接/作品管理/状态筛选/收藏管理
- **一键发布** — 标题/描述/标签/Vibe Prompt/代码片段/外部链接

## 技术亮点

- 基于 **Vue 3 + Vite 7 + TypeScript** 构建，pnpm monorepo 架构
- 赛博暖色暗色主题，主色 \`#F97316\`，Orbitron + JetBrains Mono 字体
- UnoCSS + presetWind4 + presetIcons + 自定义 presetA02 快捷方式
- alova 请求层，支持 usePagination 分页 + useRequest 缓存
- BetterScroll + Slide 插件驱动轮播组件
- IntersectionObserver 图片懒加载 + MasonryLayout 瀑布流
- vite-plugin-mock 全接口 Mock，按业务模块拆分
- ImagePreview 全屏预览，支持多图切换与键盘导航

## 代码示例

\`\`\`vue
<!-- 图片懒加载：默认占位图，进入视口自动加载 -->
<LazyImage
  :src="work.coverUrl"
  :alt="work.title"
  class="w-full h-full object-cover"
/>
\`\`\`

\`\`\`vue
<!-- 轮播组件：single 切换 1图(4/3) / 2图(3/4) 模式 -->
<VibecodingCarousel
  :single="isMobile"
  :images="coverImages"
  :loop="false"
/>
\`\`\`

\`\`\`vue
// 个人中心数据权限：isSelf computed 控制操作按钮显隐
const isSelf = computed(
  () => authStore.userInfo?.nickname === effectiveNickname.value
);
\`\`\`

\`\`\`html
// alova usePagination 无限滚动分页
const { data, page, isLastPage, loading, reload } = usePagination(
  (p, ps) => UserAPI.getUserWorks({ pageNumber: p, pageSize: ps, ...filters }),
  { append: true, data: ({ records }) => records }
);
\`\`\``,
    coverUrl: 'https://picsum.photos/seed/vibe-1/640/400',
    author: authors[0],
    tags: ['Vue3', 'Vite', 'UnoCSS'],
    category: 'web',
    likes: 1280,
    views: 15600,
    createdAt: '2026-05-15T10:00:00Z',
    vibePrompt: '用 Vue3 + Naive UI 做一个暗色作品展示站，主色橙色，带粒子背景',
    demoUrl: 'https://vibecoding.dev',
    repoUrl: 'https://github.com/vibecoder/vibecoding',
    instructions:
      '```bash\npnpm install\npnpm dev\n```\n\n1. 克隆仓库\n2. 安装依赖 `pnpm install`\n3. 启动开发服务器 `pnpm dev`',
    license: 'MIT',
    languages: ['TypeScript', 'Vue 3', 'CSS'],
    model: 'Claude Opus 4.7',
    duration: '2025-12 ~ 2026-05',
    isOnline: true,
    onlineDate: '2026-03',
    tools: ['VS Code', 'Vite 7', 'pnpm', 'UnoCSS', 'Alova', 'BetterScroll'],
    mcps: ['fetch', 'filesystem', 'sqlite'],
    skills: [
      'ui-ux-pro-max',
      'creative-frontend-master',
      'frontend-design',
      'git-functional-commits',
    ],
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
    status: 1,
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
    status: 1,
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
    demoUrl: 'https://demo.vibecoding.dev/git-diff-viz',
    instructions:
      '```bash\ngit diff HEAD~1 | pnpm vibe-diff --serve\n```\n\n或直接粘贴 diff 内容到 Web 界面进行可视化分析。',
    license: 'Apache-2.0',
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
    status: 1,
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
    status: 3,
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
    status: 3,
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
    status: 1,
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
    status: 5,
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
    status: 5,
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
    status: 2,
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
    status: 2,
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
    status: 2,
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
    status: 4,
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
    status: 4,
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
    status: 4,
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
    status: 8,
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
    status: 8,
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
    status: 10,
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
    status: 7,
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
    status: 10,
  },
  // --- VibeCoder 额外作品 (ids 25-39，合计 20 个) ---
  {
    id: 25,
    title: '实时协作白板',
    description: '基于 WebSocket 的多人实时绘图白板，支持画笔、形状、文字与图层管理。',
    coverUrl: 'https://picsum.photos/seed/vibe-25/640/400',
    author: authors[0],
    tags: ['WebSocket', 'Canvas', 'Collaboration'],
    category: 'tool',
    likes: 1560,
    views: 19800,
    createdAt: '2026-04-21T09:30:00Z',
    vibePrompt: '做一个多人实时协作白板，像 Figma 一样流畅',
    demoUrl: 'https://demo.vibecoding.dev/whiteboard',
    repoUrl: 'https://github.com/vibecoder/collab-whiteboard',
    instructions:
      '```bash\ngit clone ...\npnpm install\npnpm dev\n```\n\n启动后打开浏览器访问 `http://localhost:5173`，创建房间并分享链接给协作者。',
    license: 'MIT',
    featured: true,
    status: 7,
  },
  {
    id: 26,
    title: '代码片段管理器',
    description: '收藏、标签分类、语法高亮预览，支持 VS Code 扩展同步。',
    coverUrl: 'https://picsum.photos/seed/vibe-26/640/400',
    author: authors[0],
    tags: ['Snippet', 'VS Code', 'Productivity'],
    category: 'tool',
    likes: 834,
    views: 10200,
    createdAt: '2026-04-20T14:00:00Z',
    featured: false,
    status: 7,
  },
  {
    id: 27,
    title: 'AI Logo 生成器',
    description: '输入品牌名和行业关键词，一键生成 SVG Logo 方案并支持微调。',
    coverUrl: 'https://picsum.photos/seed/vibe-27/640/400',
    author: authors[0],
    tags: ['AI', 'SVG', 'Branding'],
    category: 'ai',
    likes: 2103,
    views: 25600,
    createdAt: '2026-04-19T11:20:00Z',
    vibePrompt: '用 AI 做一个 Logo 生成器，输入名字就能出图',
    featured: true,
    status: 7,
  },
  {
    id: 28,
    title: 'Markdown 简历生成器',
    description: 'Markdown 撰写简历，一键导出多套模板的 PDF/HTML。',
    coverUrl: 'https://picsum.photos/seed/vibe-28/640/400',
    author: authors[0],
    tags: ['Markdown', 'PDF', 'Resume'],
    category: 'web',
    likes: 567,
    views: 7800,
    createdAt: '2026-04-18T08:45:00Z',
    featured: false,
    status: 4,
  },
  {
    id: 29,
    title: '终端色彩主题工坊',
    description: '可视化配置终端配色方案，实时预览并导出 iTerm2/Kitty/Warp 配置。',
    coverUrl: 'https://picsum.photos/seed/vibe-29/640/400',
    author: authors[0],
    tags: ['Terminal', 'Color', 'Theme'],
    category: 'tool',
    likes: 423,
    views: 5600,
    createdAt: '2026-04-17T16:30:00Z',
    featured: false,
    status: 3,
  },
  {
    id: 30,
    title: 'NPM 包体积分析',
    description: '上传 package.json 可视化依赖树与各包体积占比，标记可优化项。',
    coverUrl: 'https://picsum.photos/seed/vibe-30/640/400',
    author: authors[0],
    tags: ['NPM', 'Bundle', 'Analysis'],
    category: 'web',
    likes: 678,
    views: 8900,
    createdAt: '2026-04-16T10:10:00Z',
    featured: false,
    status: 1,
  },
  {
    id: 31,
    title: 'CSS 动画灵感库',
    description: '收录 200+ 纯 CSS 动画效果，一键复制代码，支持参数调节预览。',
    coverUrl: 'https://picsum.photos/seed/vibe-31/640/400',
    author: authors[0],
    tags: ['CSS', 'Animation', 'UI'],
    category: 'web',
    likes: 1890,
    views: 32100,
    createdAt: '2026-04-15T13:00:00Z',
    vibePrompt: '做一个 CSS 动画展示站，各种炫酷效果都能预览和复制',
    featured: true,
    status: 7,
  },
  {
    id: 32,
    title: '环境变量校验器',
    description: '定义 .env schema，启动时自动校验缺失变量并生成类型声明。',
    coverUrl: 'https://picsum.photos/seed/vibe-32/640/400',
    author: authors[0],
    tags: ['DevOps', 'Config', 'TypeScript'],
    category: 'tool',
    likes: 345,
    views: 4300,
    createdAt: '2026-04-14T09:15:00Z',
    featured: false,
    status: 2,
  },
  {
    id: 33,
    title: '微信机器人助手',
    description: '基于 Wechaty 的群管理机器人，自动回复、入群欢迎、定时消息。',
    coverUrl: 'https://picsum.photos/seed/vibe-33/640/400',
    author: authors[0],
    tags: ['WeChat', 'Bot', 'Node.js'],
    category: 'tool',
    likes: 512,
    views: 6700,
    createdAt: '2026-04-13T18:20:00Z',
    featured: false,
    status: 5,
  },
  {
    id: 34,
    title: '个人博客系统',
    description: 'Markdown/MDX 驱动的静态博客，支持 RSS、搜索、暗色模式与评论。',
    coverUrl: 'https://picsum.photos/seed/vibe-34/640/400',
    author: authors[0],
    tags: ['Blog', 'SSG', 'MDX'],
    category: 'web',
    likes: 987,
    views: 14500,
    createdAt: '2026-04-12T07:40:00Z',
    featured: false,
    status: 7,
  },
  {
    id: 35,
    title: 'JSON 可视化编辑器',
    description: '树形/表格双视图编辑 JSON，支持 JSON Schema 校验与一键格式化。',
    coverUrl: 'https://picsum.photos/seed/vibe-35/640/400',
    author: authors[0],
    tags: ['JSON', 'Editor', 'DevTools'],
    category: 'tool',
    likes: 756,
    views: 9800,
    createdAt: '2026-04-11T15:00:00Z',
    featured: false,
    status: 8,
  },
  {
    id: 36,
    title: 'AI 代码审查助手',
    description: '接入 GPT 自动审查 PR diff，按文件生成评论建议与安全风险标记。',
    coverUrl: 'https://picsum.photos/seed/vibe-36/640/400',
    author: authors[0],
    tags: ['AI', 'Code Review', 'GitHub'],
    category: 'ai',
    likes: 2340,
    views: 28900,
    createdAt: '2026-04-10T12:30:00Z',
    vibePrompt: '做一个自动 Code Review 的 GitHub Bot，用 AI 检查代码质量',
    featured: true,
    status: 7,
  },
  {
    id: 37,
    title: '浏览器起始页',
    description: '自定义快捷链接、天气、待办与壁纸的新标签页，支持云同步。',
    coverUrl: 'https://picsum.photos/seed/vibe-37/640/400',
    author: authors[0],
    tags: ['Chrome', 'Extension', 'Productivity'],
    category: 'web',
    likes: 634,
    views: 11200,
    createdAt: '2026-04-09T08:00:00Z',
    featured: false,
    status: 10,
  },
  {
    id: 38,
    title: 'SVG 图标管理平台',
    description: '上传 SVG 自动优化、上色、生成图标字体与组件库代码。',
    coverUrl: 'https://picsum.photos/seed/vibe-38/640/400',
    author: authors[0],
    tags: ['SVG', 'Icon', 'Design'],
    category: 'tool',
    likes: 1102,
    views: 13400,
    createdAt: '2026-04-08T17:15:00Z',
    vibePrompt: '做一个图标管理后台，SVG 上传自动生成组件',
    featured: true,
    status: 7,
  },
  {
    id: 39,
    title: '懒加载图片组件库',
    description: '支持占位图、模糊预览、渐进式加载的 Vue/React 图片组件，<5kB。',
    coverUrl: 'https://picsum.photos/seed/vibe-39/640/400',
    author: authors[0],
    tags: ['Image', 'LazyLoad', 'Component'],
    category: 'web',
    likes: 891,
    views: 10200,
    createdAt: '2026-04-07T10:45:00Z',
    featured: false,
    status: 7,
  },
];

const mockWorksBase = mockWorksBaseEntries.map((work) => ({
  ...work,
  platform: platformFor(work.category, work.id),
  screenshots: screenshotsFor(work.id),
  status: work.status as Api.VibeCoding.WorkStatus,
})) satisfies Api.VibeCoding.VibeProject[];

export const mockWorks: Api.VibeCoding.VibeProject[] = mockWorksBase.map((work, index) => {
  const { width, height } = COVER_SIZE_PRESETS[index % COVER_SIZE_PRESETS.length];
  return {
    ...work,
    coverUrl: `https://picsum.photos/seed/vibe-${work.id}/${width}/${height}`,
    screenshots: screenshotsFor(work.id),
  };
});

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
] as MockMethod[];
