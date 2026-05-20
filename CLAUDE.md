# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

API 模块放在 `src/service/api/`。

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
| `useAuthModalStore` | `auth-modal-store` | AuthModal 弹窗显隐 `visible` / `open()` / `close()`                                        |
| `useThemeStore`     | `theme-store`      | 主题方案、色调、CSS 变量注入                                                               |
| `useVibeStore`      | `vibe-store`       | 筛选条件 `filters`、分类列表、`fetchCategories()` / `fetchWorkById()`                      |

Pinia 插件 `resetSetupStore` 为 setup-syntax store 提供 `$reset()`。

### Styling

- **UnoCSS** + `presetWind4` (Tailwind 兼容) + `presetIcons` (Iconify) + `presetA02` (自定义 shortcuts)
- 图标: `lucide` 系列在线图标，通过 `<SvgIcon icon="lucide:xxx" />` 使用
- 字体: Orbitron (标题/品牌), JetBrains Mono (代码/标签), Noto Sans SC (正文)
- 主色: `#F97316` (橙色)，辅助色: `#FB923C`

### Type System (`src/types/`)

- `Api.VibeCoding` — VibeProject (继承 CommonWaterfallItem)、VibeProjectPage、VibeProjectSearchParams、Category、SortMode
- `Api.Auth` — LoginParams、LoginToken、User
- `Api.Common` — PaginatingCommonParams、PaginatingQueryRecord、CommonWaterfallItem、CommonSearchParams
- `App` — 主题设置、i18n schema
- `Env.ImportMeta` — Vite 环境变量类型
- `vue-router` module augmentation — RouteMeta (title / i18nKey / roles)

### Mock Layer (`src/mock/`)

使用 `vite-plugin-mock`，mock 文件放在 `src/mock/`。当前 `vibe-works.ts` 包含：

- `/vibe-works` (GET) — 分页作品列表，支持 category/sort/title 筛选
- `/vibe-works/categories` (GET) — 分类列表
- `/vibe-works/:id` (GET) — 作品详情
- `/auth/send-code` (POST) — 发送验证码
- `/auth/wechat-qr` (GET) — 获取微信二维码
- `/auth/login` (POST) — 登录返回 token
- `/auth/user-info` (GET) — 用户信息

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

- 2-space 缩进，LF 换行，UTF-8 编码
- Vue 组件: `<script setup lang="ts">` + `<template>` + `<style scoped>`
- 组件名 PascalCase，文件名 kebab-case
- 页面按模块开发 (`views/<page>/modules/<component>.vue`)
- Node version: `^20.19.0 || >=22.12.0`
