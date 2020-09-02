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
      icon: 'el-icon-s-platform'
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
      path: 'project-my',
      name: 'project-my',
      component: () => import('@/views/project/my'),
      meta: {
        title: '我的项目',
        icon: 'el-icon-s-custom'
      }
    }, {
      path: 'project-add',
      name: 'project-add',
      component: () => import('@/views/project/add'),
      meta: {
        title: '新增项目',
        icon: 'el-icon-circle-plus'
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
  }, {
    path: '/team',
    component: Layout,
    redirect: '/team/team-index',
    name: 'team',
    meta: {
      title: '组内把控',
      icon: 'el-icon-s-operation'
    },
    children: [{
      path: 'team-index',
      name: 'team-index',
      component: () => import('@/views/team/index'),
      meta: {
        title: '小组统计',
        icon: 'el-icon-s-marketing'
      }
    }, ]
  }, {
    path: '/archive',
    component: Layout,
    redirect: '/archive/archive-index',
    name: 'archive',
    meta: {
      title: '归档',
      icon: 'el-icon-s-operation'
    },
    children: [{
      path: 'archive-index',
      name: 'archive-index',
      component: () => import('@/views/archive/index'),
      meta: {
        title: '归档统计',
        icon: 'el-icon-s-marketing'
      }
    }, {
      path: 'archive-detail',
      name: 'archive-detail',
      hidden: true,
      component: () => import('@/views/archive/detail'),
      meta: {
        title: '归档项目详情',
        icon: 'el-icon-s-marketing'
      }
    }, ]
  }, {
    path: '/descr',
    component: Layout,
    redirect: '/descr/descr-update',
    name: 'descr',
    meta: {
      title: '文档',
      icon: 'el-icon-s-opportunity'
    },
    children: [{
      path: 'descr-update',
      name: 'descr-update',
      component: () => import('@/views/descr/index'),
      meta: {
        title: '更新说明',
        icon: 'el-icon-s-flag'
      }
    }, ]
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
