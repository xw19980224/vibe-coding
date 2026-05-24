import { useAuthStore } from "@/stores/modules/auth";
import { localStg } from "@/utils/storage";
import type { RouteLocationNormalized, Router } from "vue-router";

export function createRouteGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const authStore = useAuthStore();

    const isLogin = Boolean(localStg.get('token'));

    if (isLogin && !authStore.userInfo?.key) {
      await authStore.initUserInfo();
    }

    if (to.path === '/login' && authStore.isLogin) {
      return '/';
    }

    const needLogin = !to.meta.constants;
    if (!needLogin) {
      return handleRouteSwitch(to, from);
    }

    if (!isLogin) {
      return { path: '/login', query: { redirect: to.fullPath } };
    }

    return handleRouteSwitch(to, from);
  });
}

function handleRouteSwitch(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  // route with href
  if (to.meta.href) {
    window.open(to.meta.href, '_blank');

    return { path: from.fullPath, replace: true, query: from.query, hash: to.hash };
  }
  return undefined;
}
