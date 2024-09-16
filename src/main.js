import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import * as filters from '@/filters' // 引入工具类
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
import '@/styles/index.scss' // global css
import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives'
import Components from '@/components'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 注册自定义指令
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

Vue.use(Components)
Vue.use(mavonEditor)
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App) // 初始化 App 实例
})
