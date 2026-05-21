# 编码规范

## 技术栈

| 类别     | 技术                                              |
| -------- | ------------------------------------------------- |
| 框架     | Vue 3 (Composition API)                           |
| 语言     | TypeScript (strict mode)                          |
| 构建     | Vite 7 + pnpm (monorepo)                          |
| 状态管理 | Pinia (setup-syntax)                              |
| 路由     | vue-router (createWebHistory)                     |
| CSS      | UnoCSS (presetWind4) + presetIcons + presetA02    |
| 请求     | alova (usePagination / useCaptcha)                |
| Mock     | vite-plugin-mock (src/mock/)                      |
| 工具     | @vueuse/core (useBreakpoints / useMediaQuery)     |
| 图标     | lucide 在线图标 (`<SvgIcon icon="lucide:xxx" />`) |
| 格式化   | Prettier + ESLint + Oxlint                        |
| 包管理   | pnpm (workspaces)                                 |

---

## 1. 文件命名

### 1.1 视图文件

```
src/views/
├── model/                          # 业务模块（如 home、user-center）
│   ├── index.vue
│   └── modules/                    # 模块专属组件
│       ├── xxx-search.vue
│       └── xxx-operation-dialog.vue
└── _builtin/                       # 内置页面（登录、404 等）
    └── model/
        └── index.vue
```

- 每个页面独立文件夹，入口文件为 `index.vue`
- 页面专属子组件放在 `modules/` 子目录，使用相对路径导入
- 跨页面共享组件放在 `src/components/custom/`
- 路由 path 使用 kebab-case，路由 name 使用 PascalCase
- 组件文件统一使用 **kebab-case** 命名

```
src/
├── layouts/base-layout/index.vue   # layout 组件
├── layouts/modules/                # layout 子模块
├── stores/modules/                 # store 模块
│   └── xxx/                        # 按职责拆分（app / auth / vibe 等）
├── mock/                           # vite-plugin-mock（按业务模块：auth / user / vibe-works）
├── service/api/                    # API 定义（按业务模块：auth / user / vibe-works）
├── types/api/                      # 类型声明（按模块拆分）
└── components/custom/              # 跨页面共享组件
```

---

## 2. Vue 组件规范

### 2.1 基本结构

```vue
<script setup lang="ts">
defineOptions({ name: 'ComponentName' });

// 1. imports
// 2. props / emits / defineModel
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
// ✅ interface + withDefaults
interface Props {
  showFooter?: boolean;
  particleCount?: number;
}
const props = withDefaults(defineProps<Props>(), {
  showFooter: true,
  particleCount: 50,
});

// ✅ 内联泛型
const props = defineProps<{
  works: any[];
  loading?: boolean;
}>();
```

### 2.3 Emits 定义

```ts
const emit = defineEmits<{
  search: [query: string];
  click: [work: Api.VibeCoding.VibeProject];
}>();
```

### 2.4 defineModel（v-model 双向绑定）

```ts
// ✅ 替代 props + emit('update:xxx') 的简化写法
const visible = defineModel<boolean>('visible', { required: true });
const activeStatus = defineModel<number | 'all'>('activeStatus', { required: true });

// 子组件直接赋值：visible.value = false  → 父组件 v-model:visible 自动同步
```

### 2.5 泛型组件

```vue
<script setup lang="ts" generic="T">
interface Props {
  items: T[];
  itemKey: (item: T) => string | number;
}
</script>
```

---

## 3. TypeScript 规范

### 3.1 类型声明

- 全局命名空间类型放在 `src/types/` 目录的 `.d.ts` 文件中
- 使用 `declare namespace Api { namespace Xxx }` 组织
- `.d.ts` 文件不要包含 `export`

```ts
// ✅ src/types/api/vibe.d.ts
declare namespace Api {
  namespace VibeCoding {
    type VibeProject = Common.CommonWaterfallItem & { ... };
    type VibeProjectPage = Common.PaginatingQueryRecord<VibeProject>;
    type WorkStatus = 1 | 2 | 3 | ... | 10;
    // ...
  }
}
```

### 3.2 主要类型命名空间

| 命名空间         | 文件                    | 用途           |
| ---------------- | ----------------------- | -------------- |
| `Api.VibeCoding` | `types/api/vibe.d.ts`   | 作品相关       |
| `Api.Auth`       | `types/api/auth.d.ts`   | 授权相关       |
| `Api.User`       | `types/api/user.d.ts`   | 用户相关       |
| `Api.Common`     | `types/api/common.d.ts` | 分页、通用字段 |
| `App`            | `types/app.d.ts`        | 主题、i18n     |
| `Env.ImportMeta` | `types/vite-env.d.ts`   | Vite 环境变量  |

### 3.3 避免 any

- ESRint 规则 `@typescript-eslint/no-explicit-any` 设为 warn
- 事件处理中使用具体类型：
  ```ts
  (e: MouseEvent) => ((e.currentTarget as HTMLElement).style.color = '#F97316');
  ```

### 3.4 路径别名

- `@/` 映射到 `src/`，始终使用别名导入
  ```ts
  import { useAuthStore } from '@/stores/modules/auth';
  import ModalDialog from '@/components/custom/modal-dialog.vue';
  ```

---

## 4. 导入规范

### 4.1 自动导入

以下 API 由 `unplugin-auto-import` 自动注入，**无需手动 import**：

- Vue Composition API：`ref`、`computed`、`watch`、`reactive`、`onMounted`、`onBeforeUnmount`、`nextTick` 等

以下需要手动 import：

- `vue-router`：`useRouter`、`useRoute`
- Pinia stores
- 自定义组件和工具函数

### 4.2 导入顺序

```
1. Vue 相关（vue、vue-router）
2. 第三方库（@vueuse/core、alova 等）
3. 项目内部（@/ 开头）
4. 相对路径
```

```ts
// ✅ 示例
import { useRouter } from 'vue-router';
import { useBreakpoints } from '@vueuse/core';
import { usePagination } from '@a02/alova/client';
import { useAuthStore } from '@/stores/modules/auth';
import WorkCard from './modules/work-card.vue';
```

---

## 5. 样式规范

### 5.1 优先使用 Inline Style

VibeCoding 页面使用内联 `style` 绑定，便于维护独立的赛博暖色调体系：

```vue
<button
  class="h-9 px-4 rounded-lg text-sm font-600 cursor-pointer"
  style="
    background: linear-gradient(135deg, #F97316, #FB923C);
    color: #fff;
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
  "
>xxx</button>
```

### 5.2 布局使用 UnoCSS + presetA02 快捷方式

```html
<!-- presetA02 快捷方式 -->
<div class="flex-center">
  <!-- flex justify-center items-center -->
  <div class="flex-y-center">
    <!-- flex items-center -->
    <div class="flex-col-center">
      <!-- flex flex-col justify-center items-center -->
      <div class="absolute-center">
        <!-- absolute inset-0 flex-center -->
        <div class="ellipsis-text"><!-- overflow-hidden whitespace-nowrap text-ellipsis --></div>
      </div>
    </div>
  </div>
</div>
```

### 5.3 设计 Token

| Token    | 值                            | 用途               |
| -------- | ----------------------------- | ------------------ |
| 主色     | `#F97316`                     | 按钮、高亮、强调   |
| 主色浅   | `#FB923C`                     | 渐变、hover        |
| 背景深   | `#0F172A`                     | 页面背景           |
| 卡片背景 | `rgba(30, 41, 59, 0.6)`       | 卡片、弹窗         |
| 边框     | `rgba(148, 163, 184, 0.08)`   | 默认边框（灰色系） |
| 边框高亮 | `rgba(249, 115, 22, 0.25)`    | hover 边框         |
| 文字主   | `#cbd5e1`                     | 标题               |
| 文字次   | `#94A3B8`                     | 正文               |
| 文字辅   | `#64748B`                     | 辅助信息           |
| 字体     | `Orbitron` / `JetBrains Mono` | 标题/代码          |

---

## 6. Store 规范

### 6.1 定义 Store

```ts
import { SetupStoreId } from '@/enum';
import { defineStore } from 'pinia';

export const useXxxStore = defineStore(SetupStoreId.Xxx, () => {
  // reactive state
  // computed
  // methods

  return { ... };
});
```

- 使用 setup-syntax，store ID 从 `SetupStoreId` 枚举取
- `SetupStoreId` 新增项统一在 `src/enum/store.ts` 中添加

### 6.2 现有 Store

| Store               | ID                 | 职责                                            |
| ------------------- | ------------------ | ----------------------------------------------- |
| `useAppStore`       | `app-store`        | 语言切换、breakpoints、isMobile                 |
| `useAuthStore`      | `auth-store`       | token/jwt、login/logout、userInfo、loginLoading |
| `useAuthModalStore` | `auth-modal-store` | AuthModal 弹窗显隐                              |
| `useThemeStore`     | `theme-store`      | 主题、CSS 变量                                  |
| `useVibeStore`      | `vibe-store`       | 筛选条件、分类列表                              |

### 6.3 使用 Store

```ts
const auth = useAuthStore();
auth.isLogin;
auth.login({ email, code });
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
- 嵌套路由：BaseLayout 作为父路由包裹子页面

---

## 8. 格式化规范

| 规则   | 值                 |
| ------ | ------------------ |
| 缩进   | 2 空格（禁止 Tab） |
| 换行符 | LF                 |
| 引号   | 单引号             |
| 分号   | 必须               |
| 行宽   | 100 字符           |
| 尾逗号 | 按 Prettier 默认   |

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
- API / Mock 按业务模块拆分：认证→`auth`、用户→`user`、作品→`vibe-works`；禁止把用户或认证接口写在 `vibe-works.ts` 中
