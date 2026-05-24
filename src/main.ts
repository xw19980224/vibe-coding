import { createApp } from 'vue';
import App from './App.vue';
import './plugins/assets';
import '@/styles/scss/style.scss';

import { setupRouter } from './router';
import { setupStore } from '@/stores';
import { getLocale, setupI18n } from './locales';
import { setupDayjs, setupIconifyOffline, setupNProgress } from './plugins';
import { setupVueRootValidator } from 'vite-plugin-vue-transition-root-validator/client';

async function setupApp() {
  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  const app = createApp(App);

  setupStore(app);

  await setupRouter(app);

  setupI18n(app);

  setupVueRootValidator(app, {
    lang: getLocale() === 'zh-CN' ? 'zh' : 'en',
  });

  app.mount('#app');
}

setupApp();
