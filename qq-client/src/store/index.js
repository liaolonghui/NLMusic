import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {
    async setUser ({ commit }) {
      const res = await Vue.prototype.$http.get('users/getUser')
      console.log(res)
      if (res.status === 200 && res.data && res.data.code === 1) {
        commit('setUser', res.data)
      }
    }
  }
})
