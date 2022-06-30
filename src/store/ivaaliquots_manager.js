import axios from 'axios'

export default {
    namespaced: true,
    state: {
        ivaaliquots: []
    },
    getters: {
        ivaaliquots (state) {
            return state.ivaaliquots
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