import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostsView from '../views/PostsView.vue'
import PostView from '../views/PostView.vue'
import LoginView from '../views/LoginView.vue'
import LogoutView from '../views/LogoutView.vue'
import RegistrationView from '../views/RegistrationView.vue'
import DashboardView from '../views/DashboardView.vue'
import { storeToRefs } from 'pinia'
import { useStoreAuth } from '@/stores/auth_store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/posts/:username',
      name: 'posts',
      component: PostsView
    },
    {
      path: '/post/:lnk',
      name: 'post',
      component: PostView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView
    },
    {
      path: '/create_account',
      name: 'create_account',
      component: RegistrationView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some((page) => page.meta.requiresAuth)) {
    //to.name !== 'login' && !this.isloggedin
    const auth_store = useStoreAuth()
    const { isLoggedin } = storeToRefs(auth_store)
    if (!isLoggedin.value) {
      //Is not logged in, go to Login Page
      next({
        name: 'login'
        //path: 'login',
        //replace: true
      })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})
export default router
