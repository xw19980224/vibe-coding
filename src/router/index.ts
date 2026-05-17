import { createRouter, createWebHistory } from 'vue-router';
import type { App } from 'vue';
import HomePage from '@/views/home/index.vue';
import { createRouterGuard } from '@/router/guard';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage,
      meta: {
        title: '首页',
        layout: 'base',
        layoutProps: { particleCount: 60, particleSpeed: 0.8 },
      },
    },
    {
      path: '/work/:id',
      name: 'WorkDetail',
      component: () => import('@/views/detail/index.vue'),
      meta: {
        title: '作品详情',
        layout: 'base',
        layoutProps: { particleCount: 30, particleSpeed: 0.5 },
      },
    },
    {
      path: '/publish',
      name: 'Publish',
      component: () => import('@/views/publish/index.vue'),
      meta: {
        title: '发布作品',
        layout: 'base',
        layoutProps: { showFooter: false },
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/login/index.vue'),
      meta: {
        title: '登录',
        layout: 'blank',
      },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/register/index.vue'),
      meta: {
        title: '注册',
        layout: 'blank',
      },
    },
    {
      path: '/user/:tab?',
      name: 'UserCenter',
      component: () => import('@/views/user/index.vue'),
      meta: {
        title: '个人中心',
        layout: 'base',
        layoutProps: { particleCount: 20, particleSpeed: 0.4 },
      },
    },
  ],
});

export async function setupRouter(app: App) {
  app.use(router);
  createRouterGuard(router);
  await router.isReady();
}
