import { createRouter, createWebHistory } from 'vue-router';
import type { App } from 'vue';
import { createRouterGuard } from '@/router/guard';
import BaseLayout from '@/layouts/base-layout/index.vue';

export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes: [
    {
      path: '',
      component: BaseLayout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'Home',
          component: () => import('@/views/home/index.vue'),
          meta: { title: '首页' },
        },
        {
          path: '/work/:id',
          name: 'WorkDetail',
          component: () => import('@/views/detail/index.vue'),
          meta: { title: '作品详情' },
        },
        {
          path: '/publish',
          name: 'Publish',
          component: () => import('@/views/publish/index.vue'),
          meta: { title: '发布作品' },
        },
        {
          path: '/user/:tab?',
          name: 'UserCenter',
          component: () => import('@/views/user/index.vue'),
          meta: { title: '个人中心' },
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/_builtin/login/index.vue'),
      meta: { title: '登录' },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/_builtin/register/index.vue'),
      meta: { title: '注册' },
    },
  ],
});

export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}
