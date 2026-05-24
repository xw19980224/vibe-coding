import { type RouteLocationRaw, useRouter } from 'vue-router';
import { router as globalRouter } from '@/router';

export function useRouterPush() {
  const router = useRouter();
  const route = globalRouter.currentRoute;

  const routerPush = router.push;

  const routerBack = router.back;

  interface RouterPushOptions {
    query?: Record<string, string>;
    params?: Record<string, string>;
  }

  async function routerPushByKey(key: string, options?: RouterPushOptions) {
    const { query, params } = options || {};

    const routeLocation: RouteLocationRaw = {
      name: key,
    };

    if (Object.keys(query || {}).length) {
      routeLocation.query = query;
    }

    if (Object.keys(params || {}).length) {
      routeLocation.params = params;
    }

    return routerPush(routeLocation);
  }

  async function toHome() {
    return routerPushByKey('Home');
  }

  async function toLogin(redirectUrl?: string) {
    const options: RouterPushOptions = {};

    const redirect = redirectUrl || route.value.fullPath;

    options.query = {
      redirect,
    };

    return routerPushByKey('Login', options);
  }

  async function redirectFromLogin(needRedirect = true) {
    const redirect = route.value.query?.redirect as string;
    if (needRedirect && redirect) {
      await routerPush(redirect);
    } else {
      await toHome();
    }
  }

  return {
    routerPush,
    routerBack,
    toLogin,
    routerPushByKey,
    redirectFromLogin,
  };
}
