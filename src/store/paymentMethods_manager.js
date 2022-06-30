import axios from 'axios'

export default {
    namespaced: true,
    state: {
        paymentMethods: []
    },
    getters: {
        paymentMethods (state) {
            return state.paymentMethods
        }
    },
    mutations: {
        SET_PAYMENTMETHODS (state, data) {
            state.paymentMethods = data
        }
    },
    actions: {
        buscar_paymentMethods () {
            return axios.get('paymentmethods')
        },

        set_paymentMethods({ commit }, data) {
            commit('SET_PAYMENTMETHODS', data)
        },
    }
}