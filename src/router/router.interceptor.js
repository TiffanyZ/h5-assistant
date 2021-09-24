import router from './.invoke/router';
import { clearPending } from 'services/pending';

router.beforeEach((to, from, next) => {
  clearPending();
  next();
});
router.afterEach((route) => {
  const title = route.meta.title || 'yiy-assistant';
  document.title = title;
});
