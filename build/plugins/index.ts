import type { PluginOption } from 'vite';

import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import UnoCSS from 'unocss/vite';
import { setupDevtoolsPlugin } from './devtools';
import { setupUnplugin } from './unplugin';
import vueRootValidator from 'vite-plugin-vue-transition-root-validator';

export function setupVitePlugins(viteEnv: Env.ImportMeta, buildTime: string) {
  const plugins: PluginOption = [
    vue(),
    vueJsx(),
    setupDevtoolsPlugin(viteEnv),
    UnoCSS(),
    ...setupUnplugin(viteEnv),
    vueRootValidator(),
  ];
  return plugins;
}
