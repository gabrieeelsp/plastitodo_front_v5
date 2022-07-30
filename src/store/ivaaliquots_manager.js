import axios from 'axios'

export default {
    namespaced: true,
    state: {
        ivaaliquots: []
    },
    getters: {
        ivaaliquots (state) {
            return state.ivaaliquots
        },
        ivaaliquots_select ( state ) {
            let items = []
            for (let item of state.ivaaliquots ) {
                items.push({
                    name: item.attributes.name,
                    id: item.id
                    })
            }
            return items
        }
    },
    mutations: {
        SET_IVAALIQUOTS (state, data) {
            state.ivaaliquots = data
        }
    },
    actions: {
        buscar_ivaaliquots () {
            return axios.get('ivaaliquots')
        },

        set_ivaaliquots({ commit }, data) {
            commit('SET_IVAALIQUOTS', data)
        },
    }
}