import axios from 'axios'

export default {
    namespaced: true,
    state: {
        paymentMethods: []
    },
    getters: {
        paymentMethods (state) {
            return state.paymentMethods
        },
        payment_methods_select ( state ) {
            let items = []
            for (let item of state.paymentMethods ) {
                items.push({
                    name: item.attributes.name,
                    id: item.id
                    })
            }
            return items
        },
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