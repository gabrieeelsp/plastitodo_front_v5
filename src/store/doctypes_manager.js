import axios from 'axios'

export default {
    namespaced: true,
    state: {
        doctypes: []
    },
    getters: {
        doctypes (state) {
            return state.doctypes
        },
        doctypes_select ( state ) {
            let items = []
            for (let item of state.doctypes ) {
                items.push({
                    name: item.attributes.name,
                    id: item.id
                })
            }
            return items
        }
    },
    mutations: {
        SET_DOCTYPES (state, data) {
            state.doctypes = data
        }
    },
    actions: {
        buscar_doctypes () {
            return axios.get('doctypes')
        },

        set_doctypes({ commit }, data) {
            commit('SET_DOCTYPES', data)
        },
    }
}