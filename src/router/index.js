import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useUserStore } from '@/stores'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/transparency',
    name: 'Transparency',
    component: () => import('@/views/TransparencyView.vue'),
  },
  {
    path: '/signature-generator',
    name: 'Signature',
    component: () => import('@/views/SignatureView.vue'),
  },
  {
    path: '/goals',
    name: 'Goals',
    component: () => import('@/views/GoalsView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      hideTopNav: true,
    },
  },
  {
    path: '/logout',
    name: 'Logout',
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const authStore = useAuthStore()
  const publicRoutes = ['Login', 'Logout']
  const isProtectedRoute = !publicRoutes.includes(to.name)
  const isAuthenticated = await authStore.authenticate()
  if (isProtectedRoute && !isAuthenticated) {
    authStore.returnUrl = to.fullPath
    next({ name: 'Login' })
  } else if (to.name === 'Logout') {
    if (isAuthenticated) await userStore.logout()
    next({ name: 'Login' })
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
