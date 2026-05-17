import {
  defineConfig,
  presetIcons,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import type { Theme } from '@unocss/preset-wind4';
import { presetA02 } from '@a02/uno-preset';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import path from 'node:path';
import process from 'node:process';
import { loadEnv } from 'vite';
import { themeVars } from './src/theme/vars.ts';

const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, process.cwd(), '') as unknown as Env.ImportMeta;
const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = env;
const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon');
const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '');
export default defineConfig<Theme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
  theme: {
    ...themeVars,
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm',
  },
  transformers: [transformerVariantGroup(), transformerDirectives()],
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetIcons({
      prefix: `${VITE_ICON_PREFIX}-`, // 'i-'
      // 作用：设置图标类名的前缀
      // 说明：所有图标类名都会以 'i-' 开头
      // 使用：class="i-carbon-user" 或 class="i-local-user"

      scale: 1,
      // 作用：图标的默认缩放比例
      // 说明：1 表示 1em 大小，会跟随父元素的 font-size
      // 效果：图标大小 = 1em = 当前字体大小

      extraProperties: {
        display: 'inline-block',
      },
      // 作用：为图标添加额外的 CSS 属性
      // 说明：所有图标都会自动应用 display: inline-block
      // 效果：图标可以与文本在同一行对齐，且可以设置宽高

      collections: {
        [collectionName]: FileSystemIconLoader(localIconPath, (svg) =>
          svg.replace(/^<svg\s/, '<svg fill="currentColor" '),
        ),
      },
      // 作用：配置自定义图标集合
      // collectionName: 'local' (从环境变量计算得出)
      // localIconPath: 'src/assets/svg-icon' 目录
      // 说明：从本地文件系统加载 SVG 文件作为图标
      // 转换：自动为 SVG 添加 width="1em" height="1em" 属性

      warn: true,
      // 作用：启用警告提示
      // 说明：当使用的图标不存在时，会在控制台显示警告信息
      // 帮助：方便开发时发现图标名称错误
    }),
    presetA02(),
  ],
});
