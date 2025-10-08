import type { RouteRecordRaw } from 'vue-router';
import LoginPage from 'pages/LoginPage.vue';
import RegistrationPage from 'pages/RegistrationPage.vue';
import ChatPage from 'pages/ChatPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
      children: [
      { path: '', redirect: '/login' },
      { path: 'login', component: LoginPage },
      { path: 'register', component: RegistrationPage },
      { path: 'chat', component: ChatPage },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/LoginPage.vue'),
  },
];

export default routes;
