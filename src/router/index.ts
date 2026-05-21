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
          meta: { title: '首页', constants: true },
        },
        {
          path: '/vibecoding/:id',
          name: 'VibeCodingDetail',
          component: () => import('@/views/vibecoding-detail/index.vue'),
          meta: {
            title: '作品详情'
          },
        },
        {
          path: '/publish',
          name: 'Publish',
          component: () => import('@/views/publish/index.vue'),
          meta: { title: '发布作品' },
        },
        {
          path: '/user-center/:nickname?',
          name: 'UserCenter',
          component: () => import('@/views/user-center/index.vue'),
          meta: { title: '个人中心' },
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/_builtin/login/index.vue'),
      meta: { title: '登录', constants: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/_builtin/not-found/index.vue'),
      meta: { title: '404', constants: true },
    },
  ],
});

export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}
