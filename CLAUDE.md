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

VibeCoding 作品展示网站 — 赛博暖色调暗色主题的创作者社区平台，基于 Vue 3 + Vite 7 + TypeScript + UnoCSS，pnpm monorepo 架构。

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
4. 创建 Vue app → Pinia → Vue Router → i18n → VueRootValidator → mount `#app`

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

嵌套路由结构，BaseLayout 作为父路由包裹子页面：

| 路径               | 组件                                 | 说明                      |
| ------------------ | ------------------------------------ | ------------------------- |
| `/`                | `views/home/index.vue`               | 首页（父路由 BaseLayout） |
| `/work/:id`        | `views/detail/index.vue`             | 作品详情                  |
| `/publish`         | `views/publish/index.vue`            | 发布作品                  |
| `/user-center`     | `views/user-center/index.vue`        | 个人中心                  |
| `/login`           | `views/_builtin/login/index.vue`     | 登录页（独立路由）        |
| `/:pathMatch(.*)*` | `views/_builtin/not-found/index.vue` | 404 页                    |

Route guards: `createProgressGuard` (NProgress) / `createDocumentTitleGuard` (标题)。

### State Management (`src/stores/`)

| Store               | ID                 | 职责                                                                                       |
| ------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `useAppStore`       | `app-store`        | 语言切换、breakpoints (`breakpointsTailwind`)、`isMobile`                                  |
| `useAuthStore`      | `auth-store`       | token/jwt 管理、`login()` / `loginByToken()` / `getUserInfo()`、`isLogin` / `loginLoading` |
| `useThemeStore`     | `theme-store`      | 主题方案、色调、CSS 变量注入                                                               |

Pinia 插件 `resetSetupStore` 为 setup-syntax store 提供 `$reset()`。

### Styling

- **UnoCSS** + `presetWind4` (Tailwind 兼容) + `presetIcons` (Iconify) + `presetA02` (自定义 shortcuts)
- 图标: `lucide` 系列在线图标，通过 `<SvgIcon icon="lucide:xxx" />` 使用
- 字体: Orbitron (标题/品牌), JetBrains Mono (代码/标签), Noto Sans SC (正文)
- 主色: `#F97316` (橙色)，辅助色: `#FB923C`

### Type System (`src/types/`)

- `Api.VibeCoding` — VibeProject (继承 CommonWaterfallItem)、VibeProjectPage、VibeProjectSearchParams、Category、SortMode
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

### Key Components

- `MasonryLayout` — 图片瀑布流组件（带注释版本）
- `AuthModal` — 登录弹窗，邮箱验证码 + 微信扫码，`useCaptcha` 管理倒计时
- `ModalDialog` — 通用弹窗组件，Header/Content/Footer 三段式，支持 ESC/遮罩关闭
- `WorkCard` — 作品卡片，封面图 + 标签 + 作者 + 点赞/浏览数据
- `ScrollTabs` — 横向滚动标签栏，左右箭头导航
- `ParticleBg` — 粒子背景动画 (Canvas)
- `GlobalContent` — 路由过渡动画 `<RouterView>` 包裹器
- `GlobalHeader` / `GlobalFooter` — 全局头尾

### Coding Conventions

See **`CODING_STANDARDS.md`** for full conventions. Quick reference for this repo:

- Vue 3 Composition API + `<script setup lang="ts">`
- Page subcomponents: `views/<page>/modules/<component>.vue`
- Node: `^20.19.0 || >=22.12.0`
