// 导出员工的路由规则
import Layout from '@/layout'

export default {
  // 路由规则
  path: '/article', // 路由地址   /employees
  name: 'article', // 给模块的一级路由加一个name属性  这个属性 我们后面会在做权限的时候用到
  component: Layout,
  children: [{
    // 二级路由的path什么都不用写的时候 此时它表示二级路由的默认路由
    path: '', // 这里不用写  什么都不用写表示 /employees 不但有布局 layout  =>  员工主页
    component: () => import('@/views/article'),
    name: 'article',
    // 路由元信息 其实就是一个存储数据的地方 可以放任何内容
    meta: {
      title: '文章', // 这里为什么要用title 因为左侧导航读取了这里的title属性
      icon: 'tree'
    }
  }, {
    path: 'articleList', //  ?的含义是表示该参数可传可不传  动态路由参数  /employees/detail/123  /employees/detail
    component: () => import('@/views/article/ArticleList.vue'),
    hidden: true, // 表示该内容不在左侧菜单显示
    meta: {
      title: '文章列表'
    }
  }, {
    path: 'addArticle',
    component: () => import('@/views/article/components/AddArticle.vue'),
    hidden: true,
    meta: {
      title: '撰写文章'
    }
  }, {
    path: 'editArticle/:id',
    component: () => import('@/views/article/components/AddArticle.vue'),
    hidden: true,
    meta: {
      title: '编辑文章'
    }
  }]
}
