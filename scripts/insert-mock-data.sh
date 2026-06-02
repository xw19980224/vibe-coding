#!/bin/bash
# ============================================================
# 将 src/mock/vibe-works.ts 中的全部 mock 作品数据
# 通过 POST /vibecoding/submit 逐条插入
# ============================================================
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8082}"
SUBMIT_URL="$BASE_URL/vibecoding/submit"
TOKEN="maxwell"

GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

submit() {
  # $1 = 作品标题（仅用于日志输出）
  printf ">>> %s ... " "$1"
  HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$SUBMIT_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d @-)
  if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
    printf "${GREEN}%s${NC}\n" "$HTTP_CODE"
  else
    printf "${RED}%s${NC}\n" "$HTTP_CODE"
  fi
}

echo "============================================"
echo "  Submit URL: $SUBMIT_URL"
echo "  Total: 39 works"
echo "============================================"
echo ""

# ── 1 ──
submit "VibeCoding 作品广场" <<'EOF'
{
  "title": "VibeCoding 作品广场",
  "subtitle": "赛博暖色风格的创作者作品展示与发现平台",
  "category": "web",
  "platforms": ["web"],
  "languages": ["TypeScript", "Vue 3", "CSS"],
  "techStack": ["Vue3", "Vite", "UnoCSS", "Alova", "BetterScroll", "Pinia"],
  "coverUrl": "https://picsum.photos/seed/vibe-1/640/400",
  "tags": ["Vue3", "Vite", "UnoCSS"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-1-ss-1/600/800",
    "https://picsum.photos/seed/vibe-1-ss-2/640/853",
    "https://picsum.photos/seed/vibe-1-ss-3/540/720",
    "https://picsum.photos/seed/vibe-1-ss-4/600/800"
  ],
  "demoUrl": "https://vibecoding.dev",
  "repoUrl": "https://github.com/vibecoder/vibecoding",
  "duration": 165,
  "tools": ["VS Code", "Vite 7", "pnpm", "UnoCSS", "Alova", "BetterScroll"],
  "model": ["Claude Opus 4.7"],
  "mcps": ["fetch", "filesystem", "sqlite"],
  "skills": ["ui-ux-pro-max", "creative-frontend-master", "frontend-design", "git-functional-commits"],
  "instructions": "```bash\npnpm install\npnpm dev\n```\n\n1. 克隆仓库\n2. 安装依赖 `pnpm install`\n3. 启动开发服务器 `pnpm dev`",
  "isOnline": true,
  "onlineDate": 1772323200000,
  "license": "MIT"
}
EOF

# ── 2 ──
submit "AI 提示词工作台" <<'EOF'
{
  "title": "AI 提示词工作台",
  "subtitle": "可视化编排 Prompt 节点，一键导出多模型对话模板",
  "category": "ai",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["AI", "Prompt", "Workflow"],
  "coverUrl": "https://picsum.photos/seed/vibe-2/640/400",
  "tags": ["AI", "Prompt", "Workflow"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-2-ss-1/600/800",
    "https://picsum.photos/seed/vibe-2-ss-2/640/853",
    "https://picsum.photos/seed/vibe-2-ss-3/540/720",
    "https://picsum.photos/seed/vibe-2-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 21,
  "tools": ["Cursor", "Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "可视化编排 Prompt 节点，一键导出多模型对话模板。",
  "isOnline": true,
  "onlineDate": 1778747400000,
  "license": ""
}
EOF

# ── 3 ──
submit "霓虹跑酷 · Neon Runner" <<'EOF'
{
  "title": "霓虹跑酷 · Neon Runner",
  "subtitle": "2D 横版跑酷小游戏，合成器波普视觉与节奏音效",
  "category": "game",
  "platforms": ["cross"],
  "languages": ["TypeScript"],
  "techStack": ["Game", "Canvas", "WebAudio"],
  "coverUrl": "https://picsum.photos/seed/vibe-3/640/400",
  "tags": ["Game", "Canvas", "WebAudio"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-3-ss-1/600/800",
    "https://picsum.photos/seed/vibe-3-ss-2/640/853",
    "https://picsum.photos/seed/vibe-3-ss-3/540/720",
    "https://picsum.photos/seed/vibe-3-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 45,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "2D 横版跑酷小游戏，合成器波普视觉与节奏音效。",
  "isOnline": false,
  "onlineDate": 1778689200000,
  "license": ""
}
EOF

# ── 4 ──
submit "移动端习惯打卡" <<'EOF'
{
  "title": "移动端习惯打卡",
  "subtitle": "极简习惯追踪 App 原型，周视图热力图与连续打卡激励",
  "category": "mobile",
  "platforms": ["android"],
  "languages": ["TypeScript"],
  "techStack": ["React Native", "UI"],
  "coverUrl": "https://picsum.photos/seed/vibe-4/640/400",
  "tags": ["React Native", "UI"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-4-ss-1/600/800",
    "https://picsum.photos/seed/vibe-4-ss-2/640/853",
    "https://picsum.photos/seed/vibe-4-ss-3/540/720",
    "https://picsum.photos/seed/vibe-4-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","Claude","Midjourney"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "极简习惯追踪 App 原型，周视图热力图与连续打卡激励。",
  "isOnline": false,
  "onlineDate": 1778587200000,
  "license": ""
}
EOF

# ── 5 ──
submit "Git Diff 可视化" <<'EOF'
{
  "title": "Git Diff 可视化",
  "subtitle": "将 diff 解析为可交互的时间线，支持按文件折叠与语义高亮",
  "category": "tool",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["DevTools", "TypeScript"],
  "coverUrl": "https://picsum.photos/seed/vibe-5/640/400",
  "tags": ["DevTools", "TypeScript"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-5-ss-1/600/800",
    "https://picsum.photos/seed/vibe-5-ss-2/640/853",
    "https://picsum.photos/seed/vibe-5-ss-3/540/720",
    "https://picsum.photos/seed/vibe-5-ss-4/600/800"
  ],
  "demoUrl": "https://demo.vibecoding.dev/git-diff-viz",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","VS Code"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "```bash\ngit diff HEAD~1 | pnpm vibe-diff --serve\n```\n\n或直接粘贴 diff 内容到 Web 界面进行可视化分析。",
  "isOnline": true,
  "onlineDate": 1778492700000,
  "license": "Apache-2.0"
}
EOF

# ── 6 ──
submit "流体渐变海报生成器" <<'EOF'
{
  "title": "流体渐变海报生成器",
  "subtitle": "基于 WebGL 的实时流体模拟，导出 4K 海报与动态壁纸",
  "category": "art",
  "platforms": ["web"],
  "languages": ["TypeScript", "GLSL"],
  "techStack": ["WebGL", "Generative Art"],
  "coverUrl": "https://picsum.photos/seed/vibe-6/640/400",
  "tags": ["WebGL", "Generative Art"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-6-ss-1/600/800",
    "https://picsum.photos/seed/vibe-6-ss-2/640/853",
    "https://picsum.photos/seed/vibe-6-ss-3/540/720",
    "https://picsum.photos/seed/vibe-6-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 21,
  "tools": ["Cursor","Claude","VS Code"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "基于 WebGL 的实时流体模拟，导出 4K 海报与动态壁纸。",
  "isOnline": false,
  "onlineDate": 1778443800000,
  "license": ""
}
EOF

# ── 7 ──
submit "团队站会计时器" <<'EOF'
{
  "title": "团队站会计时器",
  "subtitle": "Standup 专用倒计时，自动轮换发言人与议题记录",
  "category": "web",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["SaaS", "Productivity"],
  "coverUrl": "https://picsum.photos/seed/vibe-7/640/400",
  "tags": ["SaaS", "Productivity"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-7-ss-1/600/800",
    "https://picsum.photos/seed/vibe-7-ss-2/640/853",
    "https://picsum.photos/seed/vibe-7-ss-3/540/720",
    "https://picsum.photos/seed/vibe-7-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 7,
  "tools": ["Cursor","Claude","Midjourney"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "Standup 专用倒计时，自动轮换发言人与议题记录。",
  "isOnline": false,
  "onlineDate": 1778335200000,
  "license": ""
}
EOF

# ── 8 ──
submit "本地 RAG 知识库" <<'EOF'
{
  "title": "本地 RAG 知识库",
  "subtitle": "离线文档嵌入检索，支持 PDF/Markdown 混合索引",
  "category": "ai",
  "platforms": ["web"],
  "languages": ["TypeScript", "Python"],
  "techStack": ["RAG", "LLM", "Electron"],
  "coverUrl": "https://picsum.photos/seed/vibe-8/640/400",
  "tags": ["RAG", "LLM", "Electron"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-8-ss-1/600/800",
    "https://picsum.photos/seed/vibe-8-ss-2/640/853",
    "https://picsum.photos/seed/vibe-8-ss-3/540/720",
    "https://picsum.photos/seed/vibe-8-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 30,
  "tools": ["Cursor"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "离线文档嵌入检索，支持 PDF/Markdown 混合索引。",
  "isOnline": true,
  "onlineDate": 1778239800000,
  "license": ""
}
EOF

# ── 9 ──
submit "像素农场物语" <<'EOF'
{
  "title": "像素农场物语",
  "subtitle": "放置类像素农场，日夜循环与季节作物系统",
  "category": "game",
  "platforms": ["desktop"],
  "languages": ["C#"],
  "techStack": ["Pixel Art", "Idle"],
  "coverUrl": "https://picsum.photos/seed/vibe-9/640/400",
  "tags": ["Pixel Art", "Idle"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-9-ss-1/600/800",
    "https://picsum.photos/seed/vibe-9-ss-2/640/853",
    "https://picsum.photos/seed/vibe-9-ss-3/540/720",
    "https://picsum.photos/seed/vibe-9-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 60,
  "tools": ["Cursor","Claude","Copilot"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "放置类像素农场，日夜循环与季节作物系统。",
  "isOnline": false,
  "onlineDate": 1778176800000,
    "license": ""
}
EOF

# ── 10 ──
submit "API Mock 脚手架" <<'EOF'
{
  "title": "API Mock 脚手架",
  "subtitle": "根据 OpenAPI 自动生成 vite-plugin-mock 路由与类型定义",
  "category": "tool",
  "platforms": ["desktop"],
  "languages": ["TypeScript"],
  "techStack": ["OpenAPI", "Mock"],
  "coverUrl": "https://picsum.photos/seed/vibe-10/640/400",
  "tags": ["OpenAPI", "Mock"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-10-ss-1/600/800",
    "https://picsum.photos/seed/vibe-10-ss-2/640/853",
    "https://picsum.photos/seed/vibe-10-ss-3/540/720",
    "https://picsum.photos/seed/vibe-10-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "根据 OpenAPI 自动生成 vite-plugin-mock 路由与类型定义。",
  "isOnline": false,
  "onlineDate": 1778062800000,
  "license": ""
}
EOF

# ── 11 ──
submit "旅行足迹地图" <<'EOF'
{
  "title": "旅行足迹地图",
  "subtitle": "在地图上点亮去过的城市，生成年度旅程长图分享",
  "category": "mobile",
  "platforms": ["ios"],
  "languages": ["TypeScript"],
  "techStack": ["Mapbox", "Mobile"],
  "coverUrl": "https://picsum.photos/seed/vibe-11/640/400",
  "tags": ["Mapbox", "Mobile"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-11-ss-1/600/800",
    "https://picsum.photos/seed/vibe-11-ss-2/640/853",
    "https://picsum.photos/seed/vibe-11-ss-3/540/720",
    "https://picsum.photos/seed/vibe-11-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 21,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "在地图上点亮去过的城市，生成年度旅程长图分享。",
  "isOnline": false,
  "onlineDate": 1777995600000,
  "license": ""
}
EOF

# ── 12 ──
submit "Shader 画廊" <<'EOF'
{
  "title": "Shader 画廊",
  "subtitle": "收录 50+ 片元着色器 demo，支持全屏沉浸浏览",
  "category": "art",
  "platforms": ["desktop"],
  "languages": ["GLSL", "TypeScript"],
  "techStack": ["GLSL", "Creative Coding"],
  "coverUrl": "https://picsum.photos/seed/vibe-12/640/400",
  "tags": ["GLSL", "Creative Coding"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-12-ss-1/600/800",
    "https://picsum.photos/seed/vibe-12-ss-2/640/853",
    "https://picsum.photos/seed/vibe-12-ss-3/540/720",
    "https://picsum.photos/seed/vibe-12-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 30,
  "tools": ["Cursor","VS Code"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "收录 50+ 片元着色器 demo，支持全屏沉浸浏览。",
  "isOnline": true,
  "onlineDate": 1777932000000,
  "license": ""
}
EOF

# ── 13 ──
submit "组件文档自动生成" <<'EOF'
{
  "title": "组件文档自动生成",
  "subtitle": "扫描 Vue SFC 提取 props/emits，输出交互式文档站点",
  "category": "tool",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["Vue", "Documentation"],
  "coverUrl": "https://picsum.photos/seed/vibe-13/640/400",
  "tags": ["Vue", "Documentation"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-13-ss-1/600/800",
    "https://picsum.photos/seed/vibe-13-ss-2/640/853",
    "https://picsum.photos/seed/vibe-13-ss-3/540/720",
    "https://picsum.photos/seed/vibe-13-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 10,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "扫描 Vue SFC 提取 props/emits，输出交互式文档站点。",
  "isOnline": false,
  "onlineDate": 1777798800000,
  "license": ""
}
EOF

# ── 14 ──
submit "语音笔记转写" <<'EOF'
{
  "title": "语音笔记转写",
  "subtitle": "会议录音实时转文字，自动提取待办与关键决策点",
  "category": "ai",
  "platforms": ["cross"],
  "languages": ["Python", "TypeScript"],
  "techStack": ["Whisper", "AI"],
  "coverUrl": "https://picsum.photos/seed/vibe-14/640/400",
  "tags": ["Whisper", "AI"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-14-ss-1/600/800",
    "https://picsum.photos/seed/vibe-14-ss-2/640/853",
    "https://picsum.photos/seed/vibe-14-ss-3/540/720",
    "https://picsum.photos/seed/vibe-14-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 21,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "会议录音实时转文字，自动提取待办与关键决策点。",
  "isOnline": false,
  "onlineDate": 1777727700000,
  "license": ""
}
EOF

# ── 15 ──
submit "卡牌构筑 Roguelike" <<'EOF'
{
  "title": "卡牌构筑 Roguelike",
  "subtitle": "程序生成关卡与卡牌池，每局 15 分钟快节奏对战",
  "category": "game",
  "platforms": ["desktop"],
  "languages": ["C#"],
  "techStack": ["Roguelike", "Unity"],
  "coverUrl": "https://picsum.photos/seed/vibe-15/640/400",
  "tags": ["Roguelike", "Unity"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-15-ss-1/600/800",
    "https://picsum.photos/seed/vibe-15-ss-2/640/853",
    "https://picsum.photos/seed/vibe-15-ss-3/540/720",
    "https://picsum.photos/seed/vibe-15-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 60,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "程序生成关卡与卡牌池，每局 15 分钟快节奏对战。",
  "isOnline": false,
  "onlineDate": 1777663800000,
  "license": ""
}
EOF

# ── 16 ──
submit "设计 Token 同步器" <<'EOF'
{
  "title": "设计 Token 同步器",
  "subtitle": "Figma Variables 双向同步到 CSS 变量与 Tailwind 配置",
  "category": "web",
  "platforms": ["mini-program"],
  "languages": ["TypeScript"],
  "techStack": ["Figma", "Design System"],
  "coverUrl": "https://picsum.photos/seed/vibe-16/640/400",
  "tags": ["Figma", "Design System"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-16-ss-1/600/800",
    "https://picsum.photos/seed/vibe-16-ss-2/640/853",
    "https://picsum.photos/seed/vibe-16-ss-3/540/720",
    "https://picsum.photos/seed/vibe-16-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "Figma Variables 双向同步到 CSS 变量与 Tailwind 配置。",
  "isOnline": false,
  "onlineDate": 1777546800000,
  "license": ""
}
EOF

# ── 17 ──
submit "健康数据看板" <<'EOF'
{
  "title": "健康数据看板",
  "subtitle": "聚合手环睡眠/运动数据，生成周报告与趋势预测",
  "category": "mobile",
  "platforms": ["ios"],
  "languages": ["TypeScript"],
  "techStack": ["Health", "Charts"],
  "coverUrl": "https://picsum.photos/seed/vibe-17/640/400",
  "tags": ["Health", "Charts"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-17-ss-1/600/800",
    "https://picsum.photos/seed/vibe-17-ss-2/640/853",
    "https://picsum.photos/seed/vibe-17-ss-3/540/720",
    "https://picsum.photos/seed/vibe-17-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","Figma"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "聚合手环睡眠/运动数据，生成周报告与趋势预测。",
  "isOnline": false,
  "onlineDate": 1777448700000,
  "license": ""
}
EOF

# ── 18 ──
submit "ASCII 艺术相机" <<'EOF'
{
  "title": "ASCII 艺术相机",
  "subtitle": "摄像头实时帧转 ASCII 字符画，支持自定义字符集与配色",
  "category": "art",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["ASCII", "Camera"],
  "coverUrl": "https://picsum.photos/seed/vibe-18/640/400",
  "tags": ["ASCII", "Camera"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-18-ss-1/600/800",
    "https://picsum.photos/seed/vibe-18-ss-2/640/853",
    "https://picsum.photos/seed/vibe-18-ss-3/540/720",
    "https://picsum.photos/seed/vibe-18-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 7,
  "tools": ["Cursor"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "摄像头实时帧转 ASCII 字符画，支持自定义字符集与配色。",
  "isOnline": false,
  "onlineDate": 1777411200000,
  "license": ""
}
EOF

# ── 19 ──
submit "Monorepo 依赖图谱" <<'EOF'
{
  "title": "Monorepo 依赖图谱",
  "subtitle": "可视化 pnpm workspace 包依赖，检测循环引用与冗余依赖",
  "category": "tool",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["Monorepo", "Graph"],
  "coverUrl": "https://picsum.photos/seed/vibe-19/640/400",
  "tags": ["Monorepo", "Graph"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-19-ss-1/600/800",
    "https://picsum.photos/seed/vibe-19-ss-2/640/853",
    "https://picsum.photos/seed/vibe-19-ss-3/540/720",
    "https://picsum.photos/seed/vibe-19-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 10,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "可视化 pnpm workspace 包依赖，检测循环引用与冗余依赖。",
  "isOnline": false,
  "onlineDate": 1777305600000,
  "license": ""
}
EOF

# ── 20 ──
submit "多语言字幕对齐" <<'EOF'
{
  "title": "多语言字幕对齐",
  "subtitle": "AI 翻译后自动对齐时间轴，导出 SRT/VTT 双语字幕",
  "category": "ai",
  "platforms": ["web"],
  "languages": ["Python", "TypeScript"],
  "techStack": ["NLP", "Video"],
  "coverUrl": "https://picsum.photos/seed/vibe-20/640/400",
  "tags": ["NLP", "Video"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-20-ss-1/600/800",
    "https://picsum.photos/seed/vibe-20-ss-2/640/853",
    "https://picsum.photos/seed/vibe-20-ss-3/540/720",
    "https://picsum.photos/seed/vibe-20-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","VS Code"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "AI 翻译后自动对齐时间轴，导出 SRT/VTT 双语字幕。",
  "isOnline": false,
  "onlineDate": 1777206600000,
  "license": ""
}
EOF

# ── 21 ──
submit "塔防迷你版" <<'EOF'
{
  "title": "塔防迷你版",
  "subtitle": "三路出兵塔防，10 种防御塔升级树与 Boss 波次",
  "category": "game",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["TD", "Phaser"],
  "coverUrl": "https://picsum.photos/seed/vibe-21/640/400",
  "tags": ["TD", "Phaser"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-21-ss-1/600/800",
    "https://picsum.photos/seed/vibe-21-ss-2/640/853",
    "https://picsum.photos/seed/vibe-21-ss-3/540/720",
    "https://picsum.photos/seed/vibe-21-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 30,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "三路出兵塔防，10 种防御塔升级树与 Boss 波次。",
  "isOnline": false,
  "onlineDate": 1777128600000,
  "license": ""
}
EOF

# ── 22 ──
submit "播客剪辑助手" <<'EOF'
{
  "title": "播客剪辑助手",
  "subtitle": "静音段自动剪切，片头片尾模板与响度归一化一键导出",
  "category": "web",
  "platforms": ["web"],
  "languages": ["TypeScript", "Python"],
  "techStack": ["Audio", "Podcast"],
  "coverUrl": "https://picsum.photos/seed/vibe-22/640/400",
  "tags": ["Audio", "Podcast"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-22-ss-1/600/800",
    "https://picsum.photos/seed/vibe-22-ss-2/640/853",
    "https://picsum.photos/seed/vibe-22-ss-3/540/720",
    "https://picsum.photos/seed/vibe-22-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "静音段自动剪切，片头片尾模板与响度归一化一键导出。",
  "isOnline": false,
  "onlineDate": 1777025400000,
  "license": ""
}
EOF

# ── 23 ──
submit "扫码点餐小程序" <<'EOF'
{
  "title": "扫码点餐小程序",
  "subtitle": "桌台二维码下单，后厨分单屏与备餐状态实时同步",
  "category": "mobile",
  "platforms": ["android"],
  "languages": ["TypeScript"],
  "techStack": ["Mini Program", "Restaurant"],
  "coverUrl": "https://picsum.photos/seed/vibe-23/640/400",
  "tags": ["Mini Program", "Restaurant"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-23-ss-1/600/800",
    "https://picsum.photos/seed/vibe-23-ss-2/640/853",
    "https://picsum.photos/seed/vibe-23-ss-3/540/720",
    "https://picsum.photos/seed/vibe-23-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 21,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "桌台二维码下单，后厨分单屏与备餐状态实时同步。",
  "isOnline": true,
  "onlineDate": 1776969600000,
  "license": ""
}
EOF

# ── 24 ──
submit "生成式纹样实验室" <<'EOF'
{
  "title": "生成式纹样实验室",
  "subtitle": "参数化伊斯兰几何纹样，导出 SVG 用于印刷与刺绣",
  "category": "art",
  "platforms": ["desktop"],
  "languages": ["TypeScript"],
  "techStack": ["Generative", "Pattern"],
  "coverUrl": "https://picsum.photos/seed/vibe-24/640/400",
  "tags": ["Generative", "Pattern"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-24-ss-1/600/800",
    "https://picsum.photos/seed/vibe-24-ss-2/640/853",
    "https://picsum.photos/seed/vibe-24-ss-3/540/720",
    "https://picsum.photos/seed/vibe-24-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","VS Code"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "参数化伊斯兰几何纹样，导出 SVG 用于印刷与刺绣。",
  "isOnline": false,
  "onlineDate": 1776888000000,
  "license": ""
}
EOF

# ── 25 ──
submit "实时协作白板" <<'EOF'
{
  "title": "实时协作白板",
  "subtitle": "基于 WebSocket 的多人实时绘图白板，支持画笔、形状、文字与图层管理",
  "category": "tool",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["WebSocket", "Canvas", "Collaboration"],
  "coverUrl": "https://picsum.photos/seed/vibe-25/640/400",
  "tags": ["WebSocket", "Canvas", "Collaboration"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-25-ss-1/600/800",
    "https://picsum.photos/seed/vibe-25-ss-2/640/853",
    "https://picsum.photos/seed/vibe-25-ss-3/540/720",
    "https://picsum.photos/seed/vibe-25-ss-4/600/800"
  ],
  "demoUrl": "https://demo.vibecoding.dev/whiteboard",
  "repoUrl": "https://github.com/vibecoder/collab-whiteboard",
  "duration": 30,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "```bash\ngit clone ...\npnpm install\npnpm dev\n```\n\n启动后打开浏览器访问 `http://localhost:5173`，创建房间并分享链接给协作者。",
  "isOnline": true,
  "onlineDate": 1776763800000,
  "license": "MIT"
}
EOF

# ── 26 ──
submit "代码片段管理器" <<'EOF'
{
  "title": "代码片段管理器",
  "subtitle": "收藏、标签分类、语法高亮预览，支持 VS Code 扩展同步",
  "category": "tool",
  "platforms": ["desktop"],
  "languages": ["TypeScript"],
  "techStack": ["Snippet", "VS Code", "Productivity"],
  "coverUrl": "https://picsum.photos/seed/vibe-26/640/400",
  "tags": ["Snippet", "VS Code", "Productivity"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-26-ss-1/600/800",
    "https://picsum.photos/seed/vibe-26-ss-2/640/853",
    "https://picsum.photos/seed/vibe-26-ss-3/540/720",
    "https://picsum.photos/seed/vibe-26-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","Claude","VS Code"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "收藏、标签分类、语法高亮预览，支持 VS Code 扩展同步。",
  "isOnline": true,
  "onlineDate": 1776693600000,
    "license": ""
}
EOF

# ── 27 ──
submit "AI Logo 生成器" <<'EOF'
{
  "title": "AI Logo 生成器",
  "subtitle": "输入品牌名和行业关键词，一键生成 SVG Logo 方案并支持微调",
  "category": "ai",
  "platforms": ["web"],
  "languages": ["TypeScript", "Python"],
  "techStack": ["AI", "SVG", "Branding"],
  "coverUrl": "https://picsum.photos/seed/vibe-27/640/400",
  "tags": ["AI", "SVG", "Branding"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-27-ss-1/600/800",
    "https://picsum.photos/seed/vibe-27-ss-2/640/853",
    "https://picsum.photos/seed/vibe-27-ss-3/540/720",
    "https://picsum.photos/seed/vibe-27-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 21,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "输入品牌名和行业关键词，一键生成 SVG Logo 方案并支持微调。",
  "isOnline": true,
  "onlineDate": 1776597600000,
  "license": ""
}
EOF

# ── 28 ──
submit "Markdown 简历生成器" <<'EOF'
{
  "title": "Markdown 简历生成器",
  "subtitle": "Markdown 撰写简历，一键导出多套模板的 PDF/HTML",
  "category": "web",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["Markdown", "PDF", "Resume"],
  "coverUrl": "https://picsum.photos/seed/vibe-28/640/400",
  "tags": ["Markdown", "PDF", "Resume"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-28-ss-1/600/800",
    "https://picsum.photos/seed/vibe-28-ss-2/640/853",
    "https://picsum.photos/seed/vibe-28-ss-3/540/720",
    "https://picsum.photos/seed/vibe-28-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 10,
  "tools": ["Cursor","Claude","Midjourney"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "Markdown 撰写简历，一键导出多套模板的 PDF/HTML。",
  "isOnline": false,
  "onlineDate": 1776501900000,
  "license": ""
}
EOF

# ── 29 ──
submit "终端色彩主题工坊" <<'EOF'
{
  "title": "终端色彩主题工坊",
  "subtitle": "可视化配置终端配色方案，实时预览并导出 iTerm2/Kitty/Warp 配置",
  "category": "tool",
  "platforms": ["desktop"],
  "languages": ["TypeScript"],
  "techStack": ["Terminal", "Color", "Theme"],
  "coverUrl": "https://picsum.photos/seed/vibe-29/640/400",
  "tags": ["Terminal", "Color", "Theme"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-29-ss-1/600/800",
    "https://picsum.photos/seed/vibe-29-ss-2/640/853",
    "https://picsum.photos/seed/vibe-29-ss-3/540/720",
    "https://picsum.photos/seed/vibe-29-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 7,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "可视化配置终端配色方案，实时预览并导出 iTerm2/Kitty/Warp 配置。",
  "isOnline": false,
  "onlineDate": 1776443400000,
  "license": ""
}
EOF

# ── 30 ──
submit "NPM 包体积分析" <<'EOF'
{
  "title": "NPM 包体积分析",
  "subtitle": "上传 package.json 可视化依赖树与各包体积占比，标记可优化项",
  "category": "web",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["NPM", "Bundle", "Analysis"],
  "coverUrl": "https://picsum.photos/seed/vibe-30/640/400",
  "tags": ["NPM", "Bundle", "Analysis"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-30-ss-1/600/800",
    "https://picsum.photos/seed/vibe-30-ss-2/640/853",
    "https://picsum.photos/seed/vibe-30-ss-3/540/720",
    "https://picsum.photos/seed/vibe-30-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 10,
  "tools": ["Cursor","VS Code"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "上传 package.json 可视化依赖树与各包体积占比，标记可优化项。",
  "isOnline": false,
  "onlineDate": 1776334200000,
  "license": ""
}
EOF

# ── 31 ──
submit "CSS 动画灵感库" <<'EOF'
{
  "title": "CSS 动画灵感库",
  "subtitle": "收录 200+ 纯 CSS 动画效果，一键复制代码，支持参数调节预览",
  "category": "web",
  "platforms": ["web"],
  "languages": ["CSS", "TypeScript"],
  "techStack": ["CSS", "Animation", "UI"],
  "coverUrl": "https://picsum.photos/seed/vibe-31/640/400",
  "tags": ["CSS", "Animation", "UI"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-31-ss-1/600/800",
    "https://picsum.photos/seed/vibe-31-ss-2/640/853",
    "https://picsum.photos/seed/vibe-31-ss-3/540/720",
    "https://picsum.photos/seed/vibe-31-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 21,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "收录 200+ 纯 CSS 动画效果，一键复制代码，支持参数调节预览。",
  "isOnline": true,
  "onlineDate": 1776258000000,
    "license": ""
}
EOF

# ── 32 ──
submit "环境变量校验器" <<'EOF'
{
  "title": "环境变量校验器",
  "subtitle": "定义 .env schema，启动时自动校验缺失变量并生成类型声明",
  "category": "tool",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["DevOps", "Config", "TypeScript"],
  "coverUrl": "https://picsum.photos/seed/vibe-32/640/400",
  "tags": ["DevOps", "Config", "TypeScript"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-32-ss-1/600/800",
    "https://picsum.photos/seed/vibe-32-ss-2/640/853",
    "https://picsum.photos/seed/vibe-32-ss-3/540/720",
    "https://picsum.photos/seed/vibe-32-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 7,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "定义 .env schema，启动时自动校验缺失变量并生成类型声明。",
  "isOnline": false,
  "onlineDate": 1776158100000,
  "license": ""
}
EOF

# ── 33 ──
submit "微信机器人助手" <<'EOF'
{
  "title": "微信机器人助手",
  "subtitle": "基于 Wechaty 的群管理机器人，自动回复、入群欢迎、定时消息",
  "category": "tool",
  "platforms": ["desktop"],
  "languages": ["TypeScript", "Node.js"],
  "techStack": ["WeChat", "Bot", "Node.js"],
  "coverUrl": "https://picsum.photos/seed/vibe-33/640/400",
  "tags": ["WeChat", "Bot", "Node.js"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-33-ss-1/600/800",
    "https://picsum.photos/seed/vibe-33-ss-2/640/853",
    "https://picsum.photos/seed/vibe-33-ss-3/540/720",
    "https://picsum.photos/seed/vibe-33-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "基于 Wechaty 的群管理机器人，自动回复、入群欢迎、定时消息。",
  "isOnline": false,
  "onlineDate": 1776104400000,
  "license": ""
}
EOF

# ── 34 ──
submit "个人博客系统" <<'EOF'
{
  "title": "个人博客系统",
  "subtitle": "Markdown/MDX 驱动的静态博客，支持 RSS、搜索、暗色模式与评论",
  "category": "web",
  "platforms": ["web"],
  "languages": ["TypeScript", "MDX"],
  "techStack": ["Blog", "SSG", "MDX"],
  "coverUrl": "https://picsum.photos/seed/vibe-34/640/400",
  "tags": ["Blog", "SSG", "MDX"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-34-ss-1/600/800",
    "https://picsum.photos/seed/vibe-34-ss-2/640/853",
    "https://picsum.photos/seed/vibe-34-ss-3/540/720",
    "https://picsum.photos/seed/vibe-34-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 21,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "Markdown/MDX 驱动的静态博客，支持 RSS、搜索、暗色模式与评论。",
  "isOnline": true,
  "onlineDate": 1775979600000,
  "license": ""
}
EOF

# ── 35 ──
submit "JSON 可视化编辑器" <<'EOF'
{
  "title": "JSON 可视化编辑器",
  "subtitle": "树形/表格双视图编辑 JSON，支持 JSON Schema 校验与一键格式化",
  "category": "tool",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["JSON", "Editor", "DevTools"],
  "coverUrl": "https://picsum.photos/seed/vibe-35/640/400",
  "tags": ["JSON", "Editor", "DevTools"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-35-ss-1/600/800",
    "https://picsum.photos/seed/vibe-35-ss-2/640/853",
    "https://picsum.photos/seed/vibe-35-ss-3/540/720",
    "https://picsum.photos/seed/vibe-35-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "树形/表格双视图编辑 JSON，支持 JSON Schema 校验与一键格式化。",
  "isOnline": false,
  "onlineDate": 1775919600000,
  "license": ""
}
EOF

# ── 36 ──
submit "AI 代码审查助手" <<'EOF'
{
  "title": "AI 代码审查助手",
  "subtitle": "接入 GPT 自动审查 PR diff，按文件生成评论建议与安全风险标记",
  "category": "ai",
  "platforms": ["cross"],
  "languages": ["TypeScript", "Python"],
  "techStack": ["AI", "Code Review", "GitHub"],
  "coverUrl": "https://picsum.photos/seed/vibe-36/640/400",
  "tags": ["AI", "Code Review", "GitHub"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-36-ss-1/600/800",
    "https://picsum.photos/seed/vibe-36-ss-2/640/853",
    "https://picsum.photos/seed/vibe-36-ss-3/540/720",
    "https://picsum.photos/seed/vibe-36-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 30,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "接入 GPT 自动审查 PR diff，按文件生成评论建议与安全风险标记。",
  "isOnline": true,
  "onlineDate": 1775824200000,
    "license": ""
}
EOF

# ── 37 ──
submit "浏览器起始页" <<'EOF'
{
  "title": "浏览器起始页",
  "subtitle": "自定义快捷链接、天气、待办与壁纸的新标签页，支持云同步",
  "category": "web",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["Chrome", "Extension", "Productivity"],
  "coverUrl": "https://picsum.photos/seed/vibe-37/640/400",
  "tags": ["Chrome", "Extension", "Productivity"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-37-ss-1/600/800",
    "https://picsum.photos/seed/vibe-37-ss-2/640/853",
    "https://picsum.photos/seed/vibe-37-ss-3/540/720",
    "https://picsum.photos/seed/vibe-37-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 14,
  "tools": ["Cursor","Claude","Copilot"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "自定义快捷链接、天气、待办与壁纸的新标签页，支持云同步。",
  "isOnline": false,
  "onlineDate": 1775721600000,
  "license": ""
}
EOF

# ── 38 ──
submit "SVG 图标管理平台" <<'EOF'
{
  "title": "SVG 图标管理平台",
  "subtitle": "上传 SVG 自动优化、上色、生成图标字体与组件库代码",
  "category": "tool",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["SVG", "Icon", "Design"],
  "coverUrl": "https://picsum.photos/seed/vibe-38/640/400",
  "tags": ["SVG", "Icon", "Design"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-38-ss-1/600/800",
    "https://picsum.photos/seed/vibe-38-ss-2/640/853",
    "https://picsum.photos/seed/vibe-38-ss-3/540/720",
    "https://picsum.photos/seed/vibe-38-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 21,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "上传 SVG 自动优化、上色、生成图标字体与组件库代码。",
  "isOnline": true,
  "onlineDate": 1775668500000,
  "license": ""
}
EOF

# ── 39 ──
submit "懒加载图片组件库" <<'EOF'
{
  "title": "懒加载图片组件库",
  "subtitle": "支持占位图、模糊预览、渐进式加载的 Vue/React 图片组件，<5kB",
  "category": "web",
  "platforms": ["web"],
  "languages": ["TypeScript"],
  "techStack": ["Image", "LazyLoad", "Component"],
  "coverUrl": "https://picsum.photos/seed/vibe-39/640/400",
  "tags": ["Image", "LazyLoad", "Component"],
  "screenshots": [
    "https://picsum.photos/seed/vibe-39-ss-1/600/800",
    "https://picsum.photos/seed/vibe-39-ss-2/640/853",
    "https://picsum.photos/seed/vibe-39-ss-3/540/720",
    "https://picsum.photos/seed/vibe-39-ss-4/600/800"
  ],
  "demoUrl": "",
  "repoUrl": "",
  "duration": 7,
  "tools": ["Cursor","Claude"],
  "model": [],
  "mcps": [],
  "skills": [],
  "instructions": "支持占位图、模糊预览、渐进式加载的 Vue/React 图片组件，<5kB。",
  "isOnline": true,
  "onlineDate": 1775558700000,
  "license": ""
}
EOF

echo ""
echo "============================================"
echo "  Done — all 39 works submitted."
echo "============================================"
