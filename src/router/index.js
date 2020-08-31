import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [{
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
      meta: {
        title: '项目汇总',
        icon: 'dashboard'
      }
    }]
  },

  {
    path: '/project',
    component: Layout,
    redirect: '/project/project-index',
    name: 'project',
    meta: {
      title: '项目把控',
      icon: 'el-icon-s-unfold'
    },
    children: [{
      path: 'project-index',
      name: 'project-index',
      component: () => import('@/views/project/index'),
      meta: {
        title: '项目列表',
        icon: 'table'
      }
    }, {
      path: 'project-add',
      name: 'project-add',
      component: () => import('@/views/project/add'),
      meta: {
        title: '新增项目',
        icon: 'table'
      }
    }, {
      path: 'project-detail',
      name: 'project-detail',
      hidden: true,
      component: () => import('@/views/project/detail'),
      meta: {
        title: '项目详情',
        icon: 'table'
      }
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router;
