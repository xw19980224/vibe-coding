# 编码规范

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 (Composition API) |
| 语言 | TypeScript (strict mode) |
| 构建 | Vite 7 + pnpm (monorepo) |
| 状态管理 | Pinia (setup-syntax) |
| 路由 | vue-router (createWebHistory) |
| CSS | UnoCSS (presetWind4) + presetIcons |
| 组件库 | Naive UI (auto-import) |
| 请求 | Alova |
| 图标 | @iconify/vue (在线图标) |
| 格式化 | Prettier + ESLint + Oxlint |
| 包管理 | pnpm (workspaces) |

---

## 1. 文件命名

### 1.1 视图文件

```
src/views/
  home/index.vue                    # 首页
  home/modules/                     # 首页专属组件
    vibe-hero.vue
    category-bar.vue
    masonry-grid.vue
    work-card.vue
  detail/index.vue                  # 详情页
  publish/index.vue                  # 发布页
  user/index.vue                    # 用户中心
  auth/login/index.vue              # 登录页
  auth/register/index.vue           # 注册页
```

- 每个页面独立文件夹，入口文件为 `index.vue`
- 页面专属子组件放在 `modules/` 子目录，使用相对路径导入
- 跨页面共享组件放在 `src/components/custom/`
- 路由 path 使用 kebab-case：`/user/:tab?`、`/work/:id`
- 路由 name 使用 PascalCase：`'WorkDetail'`、`'UserCenter'`
- 组件文件统一使用 **kebab-case** 命名，如 `work-card.vue`、`vibe-hero.vue`

```
src/
  layouts/base-layout/index.vue      # layout 组件：kebab-case + index.vue
  layouts/modules/global-header/      # layout 子模块：kebab-case
  stores/modules/auth/index.ts        # store 模块
  service/mocks/vibe-works.ts         # mock 数据
  types/vibe-coding.d.ts              # 类型声明
```

---

## 2. Vue 组件规范

### 2.1 基本结构

```vue
<script setup lang="ts">
defineOptions({ name: 'ComponentName' });

// 1. imports
// 2. props / emits
// 3. composables / stores
// 4. reactive state
// 5. computed
// 6. methods
// 7. lifecycle
</script>

<template>
  <!-- 模板内容 -->
</template>

<style scoped>
/* 组件样式 */
</style>
```

- 使用 `<script setup lang="ts">`，禁止使用 Options API
- `defineOptions({ name })` 必须在 script 第一行
- 模板中组件名使用 **PascalCase**（ESLint 强制）
- 无样式时可省略 `<style scoped>` 块

### 2.2 Props 定义

```ts
// ✅ 推荐：interface + defineProps
interface Props {
  showFooter?: boolean;
  particleCount?: number;
}
const props = withDefaults(defineProps<Props>(), {
  showFooter: true,
  particleCount: 50,
});

// ✅ 也可以：内联泛型
const props = defineProps<{
  work: VibeCoding.VibeWork;
  index: number;
}>();
```

### 2.3 Emits 定义

```ts
// ✅ 推荐：类型字面量
const emit = defineEmits<{
  search: [query: string];
  click: [work: VibeCoding.VibeWork];
  like: [workId: string];
}>();
```

### 2.4 事件处理

- 使用 `@click`、`@input` 等 Vue 指令
- 复杂 hover 效果可用内联 `@mouseenter`/`@mouseleave`，但优先使用 CSS `:hover`

---

## 3. TypeScript 规范

### 3.1 类型声明

- 全局命名空间类型放在 `src/types/` 目录的 `.d.ts` 文件中
- 使用 `declare namespace` 组织（如 `VibeCoding.Work`、`Api.Common`）
- `.d.ts` 文件不要包含 `export`，否则会变成模块而非全局声明

```ts
// ✅ src/types/vibe-coding.d.ts
declare namespace VibeCoding {
  interface Author {
    id: string;
    name: string;
  }
  interface VibeWork {
    id: string;
    title: string;
    // ...
  }
}
```

### 3.2 避免 any

- ESLint 规则 `@typescript-eslint/no-explicit-any` 设为 warn
- 事件处理中使用具体类型：
  ```ts
  (e: MouseEvent) => (e.currentTarget as HTMLElement).style.color = '#F97316'
  ```

### 3.3 路径别名

- `@/` 映射到 `src/`，始终使用别名导入
  ```ts
  import { useAuthStore } from '@/stores/modules/auth';
  import BaseLayout from '@/layouts/base-layout/index.vue';
  ```

---

## 4. 导入规范

### 4.1 自动导入

以下 API 由 `unplugin-auto-import` 自动注入，**无需手动 import**：

```ts
// 直接使用，无需 import
const count = ref(0);
const doubled = computed(() => count.value * 2);
watch(count, (val) => { ... });
```

自动导入范围：
- Vue Composition API：`ref`、`computed`、`watch`、`reactive`、`onMounted` 等
- Naive UI：`useDialog`、`useMessage`、`useNotification`、`useLoadingBar`

以下需要手动 import：
- `vue-router`：`useRouter`、`useRoute`
- Pinia stores
- 自定义组件和工具函数

### 4.2 导入顺序

```
1. Vue 相关（vue、vue-router）
2. 第三方库
3. 项目内部（@/ 开头）
4. 相对路径
```

```ts
// ✅ 示例
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';
import VibeIcon from '@/components/vibe-coding/VibeIcon.vue';
import { mockWorks } from '@/service/mocks/vibe-works';
```

---

## 5. 样式规范

### 5.1 优先使用 Inline Style（vibe-coding 页面）

Vibe-coding 相关页面使用内联 `style` 绑定，便于维护独立的赛博暖色调体系：

```vue
<button
  class="h-9 px-4 rounded-lg text-sm font-600 cursor-pointer"
  style="
    background: linear-gradient(135deg, #F97316, #FB923C);
    color: #fff;
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
  "
>
```

### 5.2 布局使用 UnoCSS

```html
<!-- 使用 Tailwind 兼容的 utility classes -->
<div class="flex items-center justify-between">
<div class="max-w-7xl mx-auto w-full">
<h1 class="text-3xl md:text-4xl font-700 mb-4">
```

### 5.3 CSS 变量（Admin Panel）

Admin 面板基础设施使用项目主题 CSS 变量：

```css
:root {
  --primary-color: 249 115 22;
}
html.dark {
  --primary-color: 249 115 22;
}
```

### 5.4 设计 Token（Vibe-Coding）

统一的设计变量，不可随意修改：

| Token | 值 | 用途 |
|-------|------|------|
| 主色 | `#F97316` | 按钮、高亮、强调 |
| 主色浅 | `#FB923C` | 渐变、hover |
| 背景深 | `#0F172A` | 页面背景 |
| 卡片背景 | `rgba(30, 41, 59, 0.6)` | 卡片、弹窗 |
| 边框 | `rgba(249, 115, 22, 0.08)` | 默认边框 |
| 边框高亮 | `rgba(249, 115, 22, 0.2)` | hover 边框 |
| 文字主 | `#F1F5F9` | 标题 |
| 文字次 | `#94A3B8` | 正文 |
| 文字辅 | `#64748B` | 辅助信息 |
| 字体 | `Orbitron` / `JetBrains Mono` | 标题/代码 |

---

## 6. Store 规范

### 6.1 定义 Store

```ts
// ✅ setup-syntax
import { SetupStoreId } from '@/enum';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const token = ref(localStorage.getItem('vibe_token') || '');
  const isLoggedIn = computed(() => !!token.value);

  function login(userToken: string) { ... }
  function logout() { ... }

  return { token, isLoggedIn, login, logout };
});
```

- 使用 setup-syntax，store ID 从 `SetupStoreId` 枚举取
- `SetupStoreId` 新增项统一在 `src/enum/store.ts` 中添加

### 6.2 使用 Store

```ts
const auth = useAuthStore();
// 直接访问
auth.isLoggedIn
auth.login(token)
```

---

## 7. Router 规范

### 7.1 路由定义

```ts
{
  path: '/work/:id',
  name: 'WorkDetail',
  component: () => import('@/views/detail/index.vue'),
  meta: {
    title: '作品详情',
  },
}
```

- `name` 使用 PascalCase
- `meta.title` 用于设置页面标题
- 懒加载使用动态 import

---

## 8. 格式化规范

| 规则 | 值 |
|------|------|
| 缩进 | 2 空格（禁止 Tab） |
| 换行符 | LF |
| 引号 | 单引号 |
| 分号 | 必须 |
| 行宽 | 100 字符 |
| 尾逗号 | 按 Prettier 默认 |

提交前运行：
```sh
pnpm format      # Prettier 格式化
pnpm lint        # Oxlint + ESLint 检查
pnpm type-check  # TypeScript 类型检查
```

---

## 9. Git 规范

### 9.1 分支命名

```
feature/<功能简述>    # 新功能
fix/<问题简述>        # Bug 修复
refactor/<简述>       # 重构
```

### 9.2 Commit Message

```
<type>: <简短描述>

<详细说明（可选）>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

type 类型：`feat`、`fix`、`refactor`、`style`、`docs`、`chore`

---

## 10. 禁止事项

- 不要使用 Options API
- 不要在 `.d.ts` 文件中写 `export`
- 不要修改 `.editorconfig`、`.prettierrc.json`
- 不要提交 `console.log` 调试代码
- 不要引入项目未使用的依赖
- 不要跳过 git hooks（`--no-verify`）
- 不要将 mock 数据与真实 API 混用
