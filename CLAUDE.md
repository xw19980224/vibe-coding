# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 admin dashboard, built as a pnpm monorepo with Vite 7, TypeScript, Naive UI, and UnoCSS. The backend is a Spring Boot API server (youlai.tech).

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

The root project (`vide-coding`) depends on 5 internal packages under `packages/`:

| Package | Purpose |
|---------|---------|
| `@a02/alova` | Request client wrapping [alova](https://alova.js.org). Provides `createAlovaRequest`, a fetch adapter (`adapterFetch`), and a mock adapter (`createAlovaMockAdapter`). Exports subpaths: `.`, `./fetch`, `./client`, `./mock` |
| `@a02/color` | Color palette generation using `@ant-design/colors` (generates 10-step scales from a base color) and `colord` for RGB conversion |
| `@a02/hooks` | shared Vue composables: `useBoolean`, `useCountDown`, `useLoading`, `useSvgIconRender`, `useTable` |
| `@a02/uno-preset` | Custom UnoCSS shortcuts (`flex-center`, `absolute-center`, `ellipsis-text`, etc.) and positioning helpers |
| `@a02/utils` | Re-exports `nanoid`, `klona` (deep clone), and typed storage helpers (`createStorage`, `createLocalforage`) |

### Application Bootstrap (`src/main.ts`)

1. `setupNProgress()` — configures and mounts NProgress to `window.NProgress`
2. `setupIconifyOffline()` — optionally sets an offline Iconify API provider
3. `setupDayjs()` — registers dayjs locale plugins
4. Creates the Vue app, then installs: Pinia stores → Vue Router → i18n → VueRootValidator
5. Mounts to `#app`

### Request Layer (`src/service/request/`)

The request client (`alova`) is created in `src/service/request/index.ts`:
- **Dev mode**: uses `mockAdapter` (Alova mock) with `featureUsers` mock data
- **Prod mode**: uses `adapterFetch()` directly
- `onRequest`: attaches Authorization header via `getAuthorization()`
- `isBackendSuccess`: checks `response.code === VITE_SERVICE_SUCCESS_CODE`
- `transformBackendResponse`: extracts `response.data`
- Error handling: certain error codes trigger logout or modal logout with `window.$dialog`

API service modules should be placed in `src/service/api/`.

### Routing (`src/router/`)

Single route defined so far (`/` → Home page). Routes use `createWebHistory`. Route guards:
- `createProgressGuard` — NProgress bar on navigation
- `createDocumentTitleGuard` — sets `document.title` from route meta (`title` or `i18nKey`)

Route meta fields: `title`, `i18nKey`, `roles`.

### State Management (`src/stores/`)

Three Pinia stores using setup-syntax (`defineStore`):

- **app-store** — locale state (`zh-CN` / `en-US`), persisted in localStorage. On locale change: updates document title, dayjs locale
- **auth-store** — placeholder for auth state (login/logout logic not yet implemented)
- **theme-store** — theme scheme (`light`/`dark`/`auto`), theme color palette generation, CSS variable injection. Watches dark mode and color changes to update DOM

The `resetSetupStore` Pinia plugin snapshots initial state and provides `$reset()` for setup-syntax stores.

### Theming System

Theme tokens are defined as CSS custom properties injected via `<style id="theme-vars">`. Flow:
1. `themeSettings` (default config in `src/theme/setting.ts`) defines primary color, semantic colors, radius, tokens
2. `createThemeToken()` generates color palettes and merges token overrides
3. `addThemeVarsToGlobal()` writes `:root` and `html.dark` CSS variables to the DOM
4. Dark mode toggles `html` element class `dark`

Colors are stored as `rgb(r g b)` triplets in CSS vars (e.g., `--primary-color: 31 31 31`).

### Styling

- **UnoCSS** with `presetWind4` (Tailwind-compatible), `presetIcons` (Iconify), and `presetA02` (custom shortcuts)
- Icon prefixes: `i-` for Iconify icons, `i-local-` for local SVG files in `src/assets/svg-icon/`
- Prettier config: semicolons, single quotes, 100 char width

### i18n (`src/locales/`)

vue-i18n with composition API (`legacy: false`). Supported locales: `zh-CN`, `en-US`. Keys are typed via `App.I18n.Schema`. Exported helpers: `$t` (typed translate), `setLocale`, `getLocale`.

### Type System (`src/types/`)

- `App` namespace — theme settings, i18n schemas (`app.d.ts`)
- `Env.ImportMeta` — typed Vite env vars (`vite-env.d.ts`)
- `StorageType` namespace — typed localStorage/sessionStorage schemas (`storage.d.ts`)
- `Api.Common` namespace — pagination params, common record types (`api/common.d.ts`)
- `UnionKey` namespace — union types for theme scheme (`union-key.d.ts`)
- Route meta types augmented via `vue-router` module declaration (`router.d.ts`)

### Auto-imports

Configured via `unplugin-auto-import`: Vue APIs (`ref`, `computed`, `watch`, etc.) and Naive UI composables (`useDialog`, `useMessage`, `useNotification`, `useLoadingBar`) are globally available. Type declarations generated at `src/types/auto-imports.d.ts`, ESLint globals at `.eslintrc-auto-import.json`.

### Auto-components

Configured via `unplugin-vue-components`: Naive UI components and local icon components are auto-imported. Type declarations at `src/types/components.d.ts`.

### Env Variables

All Vite env vars must be prefixed with `VITE_`. Key vars:
- `VITE_APP_BASE_API` — API path prefix for proxy (`/dev-api` dev, `/prod-api` prod)
- `VITE_SERVICE_BASE_URL` — backend server URL
- `VITE_SERVICE_SUCCESS_CODE` — expected success response code
- `VITE_ICON_PREFIX` / `VITE_ICON_LOCAL_PREFIX` — icon class prefixes

### Coding Conventions

- 2-space indentation, LF line endings, UTF-8 charset (`.editorconfig`)
- Vue components use `<script setup lang="ts">` with `<template>` and optional `<style scoped>`
- Component names in templates use PascalCase (`eslint` enforces this)
- Node version: `^20.19.0 || >=22.12.0`
