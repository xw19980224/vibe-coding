export const mockCategories = [
  { id: 'all', name: '全部作品', nameEn: 'All Works' },
  { id: 'web', name: 'Web 应用', nameEn: 'Web Apps' },
  { id: 'ai', name: 'AI 工具', nameEn: 'AI Tools' },
  { id: 'game', name: '游戏', nameEn: 'Games' },
  { id: 'mobile', name: '移动端', nameEn: 'Mobile' },
  { id: 'cli', name: '命令行', nameEn: 'CLI Tools' },
  { id: 'creative', name: '创意编程', nameEn: 'Creative Coding' },
];

export const mockWorks: VibeCoding.VibeWork[] = [
  {
    id: '1',
    title: 'AI Chat Assistant - 智能对话助手',
    description:
      '只用 3 个 prompt 完成的 AI 聊天应用，支持多轮对话、上下文记忆和 Markdown 渲染。基于 OpenAI API，界面使用 Vue3 + Naive UI 构建。',
    coverUrl: '',
    author: {
      id: 'u1',
      name: 'PixelWizard',
      avatar: '',
    },
    tags: ['Vue3', 'OpenAI', 'AI工具'],
    category: 'ai',
    likes: 2347,
    views: 12890,
    createdAt: '2026-05-15',
    vibePrompt: '创建一个支持多轮对话的 AI 聊天助手，界面要简洁现代...',
    codeSnippet: `// 核心对话管理
const useChat = () => {
  const messages = ref<Message[]>([])

  const send = async (content: string) => {
    messages.value.push({ role: 'user', content })
    const reply = await aiClient.chat(messages.value)
    messages.value.push({ role: 'assistant', content: reply })
  }

  return { messages, send }
}`,
    link: 'https://github.com/example/ai-chat',
    featured: true,
  },
  {
    id: '2',
    title: 'CyberDashboard - 赛博朋克仪表盘',
    description:
      '暗色主题的数据可视化仪表盘，包含实时图表、地图轨迹和告警系统。整个项目通过自然语言描述生成。',
    coverUrl: '',
    author: {
      id: 'u2',
      name: 'CodeNinja',
      avatar: '',
    },
    tags: ['React', 'ECharts', '暗色主题'],
    category: 'web',
    likes: 1892,
    views: 9670,
    createdAt: '2026-05-14',
    vibePrompt: '设计一个赛博朋克风格的实时数据监控仪表盘...',
    codeSnippet: `// 实时数据流处理
const useRealtimeData = (source: DataSource) => {
  const data = ref<Metric[]>([])

  const stream = createWebSocket(source.url)
  stream.on('message', (msg) => {
    data.value = [...data.value.slice(-50), parseMetric(msg)]
  })

  return { data, stream }
}`,
    link: 'https://github.com/example/cyber-dash',
    featured: true,
  },
  {
    id: '3',
    title: 'PixelArt Generator - 像素画生成器',
    description:
      '用 AI prompt 生成像素艺术作品的在线工具。支持多种风格、调色板和导出格式。',
    coverUrl: '',
    author: {
      id: 'u3',
      name: 'RetroCoder',
      avatar: '',
    },
    tags: ['Canvas', 'AI生成', '创意编程'],
    category: 'creative',
    likes: 3456,
    views: 20100,
    createdAt: '2026-05-13',
    vibePrompt: '创建一个像素画生成器，用户输入文字描述就能生成像素风艺术作品...',
    featured: false,
  },
  {
    id: '4',
    title: 'Terminal Portfolio - 终端风格个人主页',
    description:
      '模拟命令行终端的个人作品集网站，访问者可以通过输入命令来浏览内容。',
    coverUrl: '',
    author: {
      id: 'u4',
      name: 'ShellMaster',
      avatar: '',
    },
    tags: ['创意编程', 'CLI', '动画'],
    category: 'cli',
    likes: 1567,
    views: 8540,
    createdAt: '2026-05-12',
    vibePrompt: '我的个人网站想做成终端风格，访问者可以输入命令来探索...',
    link: 'https://terminal-folio.dev',
    featured: true,
  },
  {
    id: '5',
    title: 'Pocket RPG - 口袋 RPG 小游戏',
    description:
      '一个用 Phaser.js 构建的小型角色扮演游戏，包含战斗系统、装备和剧情对话。',
    coverUrl: '',
    author: {
      id: 'u5',
      name: 'GameCraft',
      avatar: '',
    },
    tags: ['Phaser.js', 'GameDev', '像素风'],
    category: 'game',
    likes: 4210,
    views: 25300,
    createdAt: '2026-05-11',
    vibePrompt: '做一个回合制 RPG 小游戏，有简单的战斗和装备系统...',
    featured: true,
  },
  {
    id: '6',
    title: 'Markdown 2 Notion - 文档同步工具',
    description:
      '一键将 Markdown 文件同步到 Notion 数据库的命令行工具，支持实时监听文件变化。',
    coverUrl: '',
    author: {
      id: 'u1',
      name: 'PixelWizard',
      avatar: '',
    },
    tags: ['Node.js', 'CLI', '效率工具'],
    category: 'cli',
    likes: 892,
    views: 4560,
    createdAt: '2026-05-10',
    vibePrompt: '需要一个 CLI 工具来同步 Markdown 文件到 Notion...',
    featured: false,
  },
  {
    id: '7',
    title: 'MindMap Flow - 思维导图协作工具',
    description:
      '实时协作的在线思维导图应用，支持多人同时编辑、节点样式自定义和导出。',
    coverUrl: '',
    author: {
      id: 'u2',
      name: 'CodeNinja',
      avatar: '',
    },
    tags: ['Vue3', 'WebSocket', '协作'],
    category: 'web',
    likes: 2100,
    views: 11200,
    createdAt: '2026-05-09',
    vibePrompt: '做一个像 Miro 那样的思维导图工具，但要更轻量...',
    featured: false,
  },
  {
    id: '8',
    title: 'Emoji Mood Tracker - 心情日记 App',
    description:
      '移动端心情追踪应用，用 emoji 记录每日心情，生成周报和月报情绪曲线。',
    coverUrl: '',
    author: {
      id: 'u3',
      name: 'RetroCoder',
      avatar: '',
    },
    tags: ['React Native', '移动端', '健康'],
    category: 'mobile',
    likes: 1634,
    views: 7890,
    createdAt: '2026-05-08',
    vibePrompt: '做一个简单的移动端心情记录 app，用 emoji 来表示心情...',
    featured: false,
  },
  {
    id: '9',
    title: 'CSS Doodle Lab - 创意 CSS 实验场',
    description:
      '在线编写和预览 CSS 动画创意作品，社区可以分享和 fork 作品。',
    coverUrl: '',
    author: {
      id: 'u4',
      name: 'ShellMaster',
      avatar: '',
    },
    tags: ['CSS', '动画', '创意编程'],
    category: 'creative',
    likes: 2890,
    views: 16700,
    createdAt: '2026-05-07',
    vibePrompt: '创建一个可以分享和探索 CSS 动画的社区平台...',
    featured: false,
  },
];

export function getMockWorks(filters?: {
  category?: string;
  sort?: 'latest' | 'popular';
  search?: string;
}): VibeCoding.VibeWork[] {
  let works = [...mockWorks];

  if (filters?.category && filters.category !== 'all') {
    works = works.filter((w) => w.category === filters.category);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    works = works.filter(
      (w) =>
        w.title.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  if (filters?.sort === 'popular') {
    works.sort((a, b) => b.likes - a.likes);
  } else {
    works.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return works;
}

export function getMockWorkById(id: string): VibeCoding.VibeWork | undefined {
  return mockWorks.find((w) => w.id === id);
}
