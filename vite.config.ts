import process from 'node:process';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';

import { setupVitePlugins } from './build/plugins';
import { getBuildTime } from './build/config';

export default defineConfig((configEnv) => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;

  const buildTime = getBuildTime();

  return {
    base: viteEnv.VITE_BASE_URL,
    plugins: setupVitePlugins(viteEnv, buildTime),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host: '0.0.0.0',
      port: +viteEnv.VITE_APP_PORT,
      open: true,
      proxy: {
        [viteEnv.VITE_APP_BASE_API]: {
          target: viteEnv.VITE_SERVICE_BASE_URL, // 目标服务器
          changeOrigin: true, // 支持跨域
          rewrite: (path) => path.replace(new RegExp('^' + viteEnv.VITE_APP_BASE_API), ''), // 去掉前缀
        },
      },
    },
    preview: {
      port: 9527,
    },
    build: {
      reportCompressedSize: false,
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
    },
  };
});
