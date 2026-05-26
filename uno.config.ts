import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import { presetA02 } from '@a02/uno-preset';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import path from 'node:path';
import process from 'node:process';
import { loadEnv } from 'vite';
import { themeVars } from './src/theme/vars.ts';
import type { Theme } from '@unocss/preset-wind4';
import { presetScrollbarHide } from 'unocss-preset-scrollbar-hide';

const mode = process.env.NODE_ENV || 'development';
const env = loadEnv(mode, process.cwd(), '') as unknown as Env.ImportMeta;
const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = env;
const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon');
const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '');

console.log(themeVars);
export default defineConfig<Theme>({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist'],
    },
  },
  theme: {
    ...themeVars,
    font: {
      display: "'Orbitron', sans-serif",
      mono: "'JetBrains Mono', monospace",
      sans: "'Noto Sans SC', sans-serif",
    },
  },
  shortcuts: {
    'card-wrapper': 'rd-8px shadow-sm',
    'btn-ghost': 'border border-orange/25 text-orange bg-transparent',
    'btn-primary-gradient': 'bg-linear-135-#f97316-#fb923c text-white',
  },
  rules: [
    [
      /^bg-linear-(\d+)-#([\da-fA-F]{6})-#([\da-fA-F]{6})$/,
      ([, angle, start, end]) => ({
        background: `linear-gradient(${angle}deg, #${start}, #${end})`,
      }),
    ],
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetIcons({
      prefix: `${VITE_ICON_PREFIX}-`,
      scale: 1,
      extraProperties: {
        display: 'inline-block',
      },
      collections: {
        [collectionName]: FileSystemIconLoader(localIconPath, (svg) =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" '),
        ),
      },
      warn: true,
      autoInstall: true,
    }),
    presetTypography(),
    presetScrollbarHide(),
    presetA02(),
  ],
});
