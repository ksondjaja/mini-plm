import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import { auth } from "../firebase";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta:{
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta:{
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next)=>{
  if(to.path === '/login' && auth.currentUser){
    next('/');
    return;
  }

  if(to.matched.some(record => record.meta.requiresAuth) && !auth.currentUser){
    next('login');
    return;
  }

  next();
})

export default router