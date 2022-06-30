import axios from 'axios'

export default {
    namespaced: true,
    state: {
        caja: null
    },
    getters: {
        caja (state) {
            return state.caja
        }
    },
    mutations: {
        SET_CAJA (state, data) {
            state.caja = data
        }
    },
    actions: {
        buscar_caja({ rootState }) {
            return axios.get(`/cajas/find/${rootState.sucursals_manager.sucursal.id}`)
        },

        set_caja({ commit }, data) {
            commit('SET_CAJA', data)
        },
    }
}