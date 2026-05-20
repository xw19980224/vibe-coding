import type { Router } from 'vue-router';
import { createDocumentTitleGuard } from './title';
import { createProgressGuard } from '@/router/guard/progress.ts';
import { createRouteGuard } from './route';

export function createRouterGuard(router: Router) {
  createProgressGuard(router);
  createRouteGuard(router);
  createDocumentTitleGuard(router);
}
