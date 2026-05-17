import type { Router } from 'vue-router';
import { createDocumentTitleGuard } from './title';
import { createProgressGuard } from '@/router/guard/progress.ts';

export function createRouterGuard(router: Router) {
  createProgressGuard(router);
  createDocumentTitleGuard(router);
}
