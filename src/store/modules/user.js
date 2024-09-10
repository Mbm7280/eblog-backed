import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
export default {
  namespaced: true,
  state: {
    token: getToken()
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
    }
  },
  actions: {
    // 定义login action  也需要参数 调用action时 传递过来的参数
    async login(context, data) {
      const result = await login(data) // 实际上就是一个promise  result就是执行的结果
      context.commit('setToken', result)
    }
  }
}

// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'
//
// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }
//
// const state = getDefaultState()
//
// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }
//
// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//
//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response
//
//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }
//
//         const { name, avatar } = data
//
//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//
//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },
//
//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }
//
// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
//
