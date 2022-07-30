import axios from 'axios'

export default {
    namespaced: true,
    state: {
        ivaconditions: []
    },
    getters: {
        ivaconditions (state) {
            return state.ivaconditions
        },
        ivaconditions_select ( state ) {
            let items = []
            for (let item of state.ivaconditions ) {
                items.push({
                    name: item.attributes.name,
                    id: item.id
                    })
            }
            return items
        }
    },
    mutations: {
        SET_IVACONDITIONS (state, data) {
            state.ivaconditions = data
        }
    },
    actions: {
        buscar_ivaconditions () {
            return axios.get('ivaconditions')
        },

        set_ivaconditions({ commit }, data) {
            commit('SET_IVACONDITIONS', data)
        },
    }
}