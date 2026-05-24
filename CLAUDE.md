# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Coding Standards

**`CODING_STANDARDS.md` is the canonical coding standards file for this project.** Follow it when writing, reviewing, or refactoring code.

| File | Role |
| ---- | ---- |
| `CLAUDE.md` | Project architecture, directory layout, tech stack, and business context (this file) |
| `CODING_STANDARDS.md` | Coding standards: naming, component structure, styling, stores, API/Mock module split, commit conventions, prohibitions, etc. |

Rules:

- For code style, naming, directory layout, API/Mock module boundaries, and similar details, **`CODING_STANDARDS.md` takes precedence**. This file is architecture-level guidance only; on conflict, follow the standards file.
- When unsure about a convention before adding or changing code, read the relevant section in `CODING_STANDARDS.md` first.
- Do not duplicate in `CLAUDE.md` rules already defined in `CODING_STANDARDS.md`.

## Project Overview

VibeCoding 作品展示网站 — 赛博暖色调暗色主题的创作者社区平台，基于 Vue 3 + Vite 7 + TypeScript + Element Plus + UnoCSS，pnpm monorepo 架构。

## Development Commands

```sh
pnpm install          # Install dependencies
pnpm dev              # Start dev server (reads VITE_APP_PORT from .env.development)
pnpm build            # Type-check + production build
pnpm build-only       # Vite build only (no type-check)
pnpm type-check       # Run vue-tsc --build
pnpm lint             # Run oxlint + eslint (both with --fix)
pnpm format           # Prettier format src/
```

## Architecture

### Monorepo Structure (pnpm workspaces)

| Package           | Purpose                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `@a02/alova`      | alova 请求客户端封装，导出 `.` / `./fetch` / `./client` / `./mock` 子路径                    |
| `@a02/color`      | 色彩调色板生成 (@ant-design/colors + colord)                                                 |
| `@a02/hooks`      | 共享 composables: `useBoolean`, `useCountDown`, `useLoading`, `useSvgIconRender`, `useTable` |
| `@a02/uno-preset` | UnoCSS 快捷方式 (`flex-center`, `absolute-center`, `ellipsis-text` 等)                       |
| `@a02/utils`      | `nanoid`, `klona`, 类型化 storage helpers (`createStorage`, `createLocalforage`)             |

### Application Bootstrap (`src/main.ts`)

1. `setupNProgress()` — NProgress 进度条
2. `setupIconifyOffline()` — 离线 Iconify API (可选)
3. `setupDayjs()` — dayjs 语言插件
4. 创建 Vue app → 导入 `@/plugins/assets` (global.css + Element Plus CSS + UnoCSS) → `@/styles/scss/style.scss` → Pinia → Vue Router → i18n → VueRootValidator → mount `#app`

`src/plugins/assets.ts` imports order: `global.css` → `element-plus/dist/index.css` → `virtual:uno.css` → `virtual:svg-icons-register`

### Request Layer (`src/service/request/`)

dev 模式支持两种 mock 方式：

- `VITE_USE_MOCK=Y` → baseURL 置空，由 `vite-plugin-mock` 拦截（`src/mock/` 目录）
- `VITE_HTTP_PROXY=Y` → baseURL 使用 `/proxy-default` 代理前缀

`onRequest`: 有 token 时附加 Authorization header。
`isBackendSuccess`: `Number(response.code) === Number(VITE_SERVICE_SUCCESS_CODE)`
`transformBackendResponse`: 返回 `response.data.data`

API 模块放在 `src/service/api/`，**按业务模块拆分**（文件名与职责一一对应）：

| 文件 | 职责 |
| ---- | ---- |
| `auth.ts` | 登录、验证码、微信扫码等认证接口 |
| `user.ts` | 当前用户信息、用户详情、用户作品列表 |
| `vibe-works.ts` | 作品广场列表、分类、作品详情 |

### Routing (`src/router/`)

嵌套路由结构，BaseLayout 作为父路由包裹子页面:

| 路径                       | 组件                                      | 说明                      |
| -------------------------- | ----------------------------------------- | ------------------------- |
| `/home`                    | `views/home/index.vue`                    | 首页（父路由 BaseLayout） |
| `/vibecoding/:id`          | `views/vibecoding-detail/index.vue`       | 作品详情                  |
| `/publish`                 | `views/publish/index.vue`                 | 发布作品                  |
| `/user-center/:nickname?`  | `views/user-center/index.vue`             | 个人中心                  |
| `/login`                   | `views/_builtin/login/index.vue`          | 登录页（独立路由）        |
| `/:pathMatch(.*)*`         | `views/_builtin/not-found/index.vue`      | 404 页                    |

Route guards: `createProgressGuard` (NProgress) / `createDocumentTitleGuard` (标题)。

### State Management (`src/stores/`)

| Store               | ID                 | 职责                                                                                       |
| ------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `useAppStore`       | `app-store`        | 语言切换、breakpoints (`breakpointsTailwind`)、`isMobile`                                  |
| `useAuthStore`      | `auth-store`       | token/jwt 管理、`login()` / `loginByToken()` / `getUserInfo()`、`isLogin` / `loginLoading` |
| `useThemeStore`     | `theme-store`      | 主题方案、色调、CSS 变量注入                                                               |

Pinia 插件 `resetSetupStore` 为 setup-syntax store 提供 `$reset()`。

### Styling

- **UnoCSS** + `presetWind4` (Tailwind 兼容) + `presetIcons` (Iconify) + `presetA02` (自定义 shortcuts) + `transformerDirectives` (支持 `@apply`)
- 图标: `lucide` 系列在线图标，通过 `<SvgIcon icon="lucide:xxx" />` 使用
- 全局样式: `src/styles/css/global.css` 设置基础样式 + `src/styles/scss/element-plus.scss` 覆盖 Element Plus 主题
- 主色: `#F97316` (橙色)，辅助色: `#FB923C`

#### Font System

全局默认字体在 `src/styles/css/global.css` 的 `html` 上设置 (`Noto Sans SC`)，通过 UnoCSS `theme.fontFamily` 定义三个别名:

| Class              | Font                    | 用途                       |
| ------------------ | ----------------------- | -------------------------- |
| `font-display`     | Orbitron, sans-serif    | 品牌标题、logo、统计数据   |
| `font-mono`        | JetBrains Mono, monospace | 代码、标签、辅助信息     |
| `font-sans`        | Noto Sans SC, sans-serif | 正文（全局默认）           |

优先使用 `font-display` / `font-mono` / `font-sans` 原子类替代内联 `style="font-family: ..."`。

#### Color Palette

项目中不再使用内联 `color: #xxx`，统一通过 UnoCSS 文本颜色类:

| Color     | Class             | 用途              |
| --------- | ----------------- | ----------------- |
| `#f1f5f9` | `text-slate-100`  | 主要文字、高亮     |
| `#cbd5e1` | `text-slate-300`  | 标题文字          |
| `#94a3b8` | `text-slate-400`  | 正文、标签文字     |
| `#64748b` | `text-slate-500`  | 辅助信息、说明文字 |
| `#475569` | `text-slate-600`  | 次要辅助文字       |

Element Plus 组件样式覆盖写在 `src/styles/scss/element-plus.scss` 中，使用 `@apply text-slate-* font-mono` 等 UnoCSS 指令。

### Layouts (`src/layouts/`)

| 组件                          | 职责               |
| ----------------------------- | ------------------ |
| `base-layout/index.vue`       | 父路由骨架         |
| `modules/global-header/`      | 顶部导航 + 登录弹窗 |
| `modules/global-footer/`      | 底部信息           |
| `modules/global-content/`     | `<RouterView>` 动画过渡包裹器 |

### Type System (`src/types/`)

- `Api.VibeCoding` — VibeProject、VibeProjectPage、VibeProjectSearchParams、Category、SortMode
- `Api.Auth` — LoginParams、LoginToken
- `Api.User` — UserInfo、UserDetail、UserWorksSearchParams
- `Api.Common` — PaginatingCommonParams、PaginatingQueryRecord、CommonWaterfallItem、CommonSearchParams
- `App` — 主题设置、i18n schema
- `Env.ImportMeta` — Vite 环境变量类型
- `vue-router` module augmentation — RouteMeta (title / i18nKey / roles)

### Mock Layer (`src/mock/`)

使用 `vite-plugin-mock`，**按业务模块拆分**（与 `src/service/api/` 对应）：

| 文件 | 接口 |
| ---- | ---- |
| `auth.ts` | `/auth/send-code` (POST)、`/auth/wechat-qr` (GET)、`/auth/login` (POST) |
| `user.ts` | `/user/info` (GET)、`/user/detail` (GET)、`/user/works` (GET) |
| `vibe-works.ts` | `/vibe-works` (GET)、`/vibe-works/categories` (GET)、`/vibe-works/:id` (GET) |
| `shared.ts` | 公共 `wrapData` 响应包装（非路由文件） |

新增接口时，放入对应业务模块文件，不要混写在其他模块的 mock 中。

### Page Modules

#### Home (`src/views/home/`)

| Submodule           | Description              |
| ------------------- | ------------------------ |
| `vibe-hero.vue`     | 顶部 Hero 区域           |
| `work-card.vue`     | 作品卡片（瀑布流用）     |

#### Publish (`src/views/publish/`)

4 步骤模块化表单:

| Submodule                | Description              |
| ------------------------ | ------------------------ |
| `step-basic.vue`         | 基础信息（标题、分类）   |
| `step-description.vue`   | 描述信息                 |
| `step-extended.vue`      | 扩展信息（链接、图库）   |
| `step-tags.vue`          | 标签选择                 |

#### User Center (`src/views/user-center/`)

| Submodule                      | Description              |
| ------------------------------ | ------------------------ |
| `profile-header.vue`           | 用户头像、昵称、统计数据 |
| `works-section.vue`            | 作品列表（含筛选）       |
| `work-card-item.vue`           | 作品卡片项               |
| `user-operation-dialog.vue`    | 编辑资料弹窗             |

#### VibeCoding Detail (`src/views/vibecoding-detail/`)

| Submodule                        | Description              |
| -------------------------------- | ------------------------ |
| `vibecoding-info.vue`            | 作品信息、作者、统计数据 |
| `comment-section.vue`            | 评论区                   |

### Key Shared Components (`src/components/custom/`)

| Component              | Description                              |
| ---------------------- | ---------------------------------------- |
| `modal-dialog.vue`     | 通用弹窗（Header/Content/Footer 三段式）  |
| `svg-icon.vue`         | SvgIcon 图标组件（支持 lucide + 本地图标） |
| `masonry-layout.vue`   | 图片瀑布流组件                           |
| `scroll-tabs.vue`      | 横向滚动标签栏                           |
| `particle-bg.vue`      | 粒子背景动画 (Canvas)                    |
| `select.vue`           | 自定义下拉选择组件                       |
| `steps.vue`            | 步骤条组件                               |
| `carousel.vue`         | 轮播组件                                 |
| `image-preview.vue`    | 图片预览组件                             |
| `lazy-image.vue`       | 图片懒加载组件                           |
| `vibecoding-carousel.vue` | 作品详情轮播组件                      |
| `app-provider.vue`     | Element Plus ConfigProvider 封装          |

### Common Components (`src/components/common/`)

| Component              | Description                              |
| ---------------------- | ---------------------------------------- |
| `dark-mode-container.vue` | 暗色模式容器                          |
| `system-logo.vue`      | 系统图标                                 |

### Coding Conventions

See **`CODING_STANDARDS.md`** for full conventions. Quick reference for this repo:

- Vue 3 Composition API + `<script setup lang="ts">`
- Page subcomponents: `views/<page>/modules/<component>.vue`
- Element Plus 组件使用，全局类型声明在 `types/components.d.ts`
- Node: `^20.19.0 || >=22.12.0`
