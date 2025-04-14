import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import SignUp from '../components/SignUp.vue'
import UserTransaction from '../components/UserTransaction.vue'
import Dashboard from '../components/Dashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/transactions',
    name: 'UserTransaction',
    component: UserTransaction
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;