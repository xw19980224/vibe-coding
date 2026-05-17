import path from 'node:path';
import process from 'node:process';
import Icons from 'unplugin-icons/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

export function setupUnplugin(viteEnv: Env.ImportMeta) {
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;

  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon');

  /** The name of the local icon collection */
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '');

  return [
    Icons({
      compiler: 'vue3',
      // 作用：指定编译器类型为 Vue 3
      // 说明：unplugin-icons 会将图标编译成 Vue 3 组件

      customCollections: {
        [collectionName]: FileSystemIconLoader(localIconPath, (svg) =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" '),
        ),
      },
      // 作用：配置自定义图标集合
      // collectionName: 'local' (从 'i-local' 中提取)
      // localIconPath: 'src/assets/svg-icon' 目录
      // 说明：从本地文件系统加载 SVG 图标，并自动添加 width/height 属性
      // 使用方式：<i-local-icon-name /> 或 import IconName from '~icons/local/icon-name'

      scale: 1,
      // 作用：图标缩放比例
      // 说明：1 表示保持原始大小，不进行缩放

      defaultClass: 'inline-block',
      // 作用：为生成的图标组件添加默认 CSS 类
      // 说明：所有图标默认会有 'inline-block' 类，使图标可以与文本对齐
    }),
    Components({
      dts: 'src/types/components.d.ts',
      // 作用：生成 TypeScript 类型声明文件的路径
      // 说明：自动为所有自动导入的组件生成类型定义
      // 效果：提供完整的 TypeScript 智能提示和类型检查
      // 生成：components.d.ts 文件会自动更新，包含所有组件的类型

      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      // 作用：为特定库的组件添加类型支持
      // 说明：告诉插件 RouterLink 和 RouterView 来自 vue-router
      // 效果：在 components.d.ts 中正确生成这些组件的类型引用
      // 避免：防止这些组件被误认为需要自动导入的自定义组件

      resolvers: [
        NaiveUiResolver(),
        IconsResolver({
          customCollections: [collectionName], // ['local']
          componentPrefix: VITE_ICON_PREFIX, // 'i'
        }),
        // 作用：自动导入图标组件
        // customCollections: 指定自定义图标集合名称 ['local']
        // componentPrefix: 图标组件的前缀 'i'
        // 使用：<i-local-user /> 会自动导入对应的图标组件
        // 效果：无需手动 import IconUser from '~icons/local/user'
      ],
    }),
    createSvgIconsPlugin({
      iconDirs: [localIconPath],
      // 作用：指定 SVG 图标文件所在的目录数组
      // 值：['src/assets/svg-icon']
      // 说明：插件会扫描这些目录下的所有 .svg 文件
      // 支持：可以配置多个目录，如 [path1, path2, path3]

      symbolId: `${VITE_ICON_LOCAL_PREFIX}-[dir]-[name]`,
      // 作用：定义生成的 SVG symbol 的 ID 格式
      // 值：'i-local-[dir]-[name]'
      // 说明：
      //   - [dir]: 子目录名称（如果图标在子目录中）
      //   - [name]: SVG 文件名（不含扩展名）
      // 示例：
      //   - src/assets/svg-icon/user.svg → id="i-local-user"
      //   - src/assets/svg-icon/menu/home.svg → id="i-local-menu-home"

      inject: 'body-last',
      // 作用：指定 SVG sprite 注入到 HTML 的位置
      // 值：'body-last' - 注入到 <body> 标签的末尾
      // 其他选项：
      //   - 'body-first': <body> 标签开头
      //   - 'head': <head> 标签中
      // 说明：将所有 SVG 图标合并成一个 sprite 并注入到页面

      customDomId: '__SVG_ICON_LOCAL__',
      // 作用：自定义 SVG sprite 容器的 DOM ID
      // 值：'__SVG_ICON_LOCAL__'
      // 说明：生成的 SVG sprite 容器会有这个 ID
      // 生成：<svg id="__SVG_ICON_LOCAL__" style="display:none">...</svg>
    }),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar'],
        },
      ],
      // 作用：指定需要自动导入的库
      // 值：['vue'] - 自动导入 Vue 的 API
      // 效果：ref, computed, watch 等无需手动 import
      // 示例：直接使用 const count = ref(0)，无需 import { ref } from 'vue'

      dts: 'src/types/auto-imports.d.ts',
      // 作用：生成 TypeScript 类型声明文件
      // 说明：为自动导入的 API 生成类型定义
      // 效果：提供完整的 TypeScript 智能提示

      eslintrc: {
        enabled: true,
        // 作用：生成 ESLint 配置文件
        // 说明：告诉 ESLint 哪些变量是全局可用的
        // 避免：防止 ESLint 报 'ref is not defined' 等错误

        filepath: './.eslintrc-auto-import.json',
        // 作用：ESLint 配置文件的保存路径
        // 说明：需要在主 ESLint 配置中引入这个文件
      },
    }),
  ];
}
