import { createPinia } from 'pinia';
import type { App } from 'vue';
import { resetSetupStore } from '@/stores/plugins';

export function setupStore(app: App) {
  const store = createPinia();

  store.use(resetSetupStore);

  app.use(store);
}
