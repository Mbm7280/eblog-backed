import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'

export default {
  namespaced: true,
  state: {
    token: getToken(),
    userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
  },
  mutations: {
    // 设置token
    setToken(state, token) {
      state.token = token // 设置token  只是修改state的数据  123 =》 1234
      // vuex变化 => 缓存数据
      setToken(token) // vuex和 缓存数据的同步
    },
    // 删除缓存
    removeToken(state) {
      state.token = null // 删除vuex的token
      removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
    },
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = { ...userInfo } // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
    },
    // 删除用户信息
    removeUserInfo(state) {
      state.userInfo = {}
    }
  },
  actions: {
    // 定义login action  也需要参数 调用action时 传递过来的参数
    async login(context, data) {
      const result = await login(data) // 实际上就是一个promise  result就是执行的结果
      context.commit('setToken', result.token)
      // 写入时间戳
      setTimeStamp() // 将当前的最新时间写入缓存
    },
    // 获取用户资料action
    async getUserInfo(context) {
      const result = await getUserInfo() // 获取返回值
      context.commit('setUserInfo', result) // 将整个的个人信息设置到用户的vuex数据中
      return result // 这里为什么要返回 为后面埋下伏笔
    },
    // 登出的action
    logout(context) {
      // 删除token
      context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
      // 删除用户资料
      context.commit('removeUserInfo') // 删除用户信息
    }
  }
}
