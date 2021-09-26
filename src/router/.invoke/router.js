import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
export const routes = [{
    component: () => import('@/views/hello/index.vue'),
    name: 'hello',
    path: '/hello',
  },
  {
    component: () => import('@/views/home/index.vue'),
    name: 'home',
    path: '/home',
  },
  {
    component: () => import('@/views/svgIcons/index.vue'),
    name: 'svgIcons',
    path: '/svgIcons',
  },
  {
    path: '/',
    redirect: '/home'
  },
];
const router = new Router({
  mode: 'hash',
  routes,
});
export default router;
