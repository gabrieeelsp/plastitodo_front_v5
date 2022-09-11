import axios from "axios"

export default{
    namespaced: true,
  state: {
    token: null,
    user: null
  },
  getters: {
    authenticated (state) {
      return state.token && state.user
    },
    user (state) {
      return state.user
    },
    is_empleado(state) {
      return state.user.role != null
  }
  },
  mutations: {
      SET_TOKEN (state, token) {
        state.token = token
      },
      SET_USER (state, data) {
        state.user = data
      }
  },
  actions: {
    async signIn({ dispatch }, credentials) {
        let response = await axios.post('login', credentials)

        return dispatch('attempt', response.data.access_token)
    },

    async attempt ({state, commit }, token) {
      if(token){
        commit('SET_TOKEN', token)
      }
      if(!state.token) {
        return
      }
        
        try {
            let response = await axios.get('me')
            
            commit('SET_USER', response.data)
        } catch (e) {
            commit('SET_TOKEN', null)
            commit('SET_USER', null)
        }
    },

    signOut ({ dispatch, commit }) {
      return axios.post('logout').then(() => {
        commit('SET_TOKEN', null)
        commit('SET_USER', null)
        dispatch('sucursals_manager/set_sucursal', null, {root:true})

      })
    }
  }
}