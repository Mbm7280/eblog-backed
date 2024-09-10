import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

// vuex 的注册
Vue.use(Vuex)

// 实例化 vuex
const store = new Vuex.Store({
  modules: {
    app, // 折叠展开
    settings, // logo/头部
    user // 用户信息
  },
  getters // 快捷访问 子模块
})

export default store
