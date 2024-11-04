import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/create',
    name: 'Create',
    component: () => import('../views/CreateSurvey.vue')
  },
  {
    path: '/judge',
    name: 'Judge',
    component: () => import('../views/JudgeSurveys.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutPage.vue')
  },
  {
    path: '/why-ethics',
    name: 'WhyEthics',
    component: () => import('../views/WhyEthicsPage.vue')
  },
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: () => import('@/views/UserProfile.vue')
  }  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;