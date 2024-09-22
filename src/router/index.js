import Vue from 'vue'
import Router from 'vue-router'
import articleRouter from './modules/article'
import categoryRouter from './modules/category'
import commentRouter from './modules/comment'
import friendLinkRouter from './modules/friendLink'
import resourceRouter from './modules/resource'
import roleRouter from './modules/role'


Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  articleRouter,
  categoryRouter,
  commentRouter,
  resourceRouter,
  roleRouter,
  friendLinkRouter
]


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: [...constantRoutes, ...asyncRoutes] // 临时合并所有的路由
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
