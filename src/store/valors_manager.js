import axios from 'axios'

export default {
    namespaced: true,
    state: {
        valors: []
    },
    getters: {
        valors (state) {
            return state.valors
        },
    },
    mutations: {
        SET_VALORS (state, data) {
            state.valors = data
        }
    },
    actions: {
        buscar_valors () {
            return axios.get('valors')
        },

        set_valors({ commit }, data) {
            commit('SET_VALORS', data)
        },
    }
}