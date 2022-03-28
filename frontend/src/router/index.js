import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/views/Home.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';

const routes = [
  { path: '/home',
    name: 'Home',
    component: Home
  },
  { path: '/',
    name: 'Login',
    component: Login
  },
  { path: '/user/:id',
    name: 'Profile',
    component: Profile
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router