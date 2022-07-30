import axios from 'axios'
export default {
    namespaced: true,
    state: {
        sucursal: null,
        ivaaliquots: []
    },
    getters: {
        sucursal ( state ) {
            return state.sucursal
        },

        is_sucursal_selected ( state ) {
            return state.sucursal != null
        },


        sucursals (state) {
            return state.sucursals
        },
        sucursals_select ( state ) {
            let items = []
            for (let item of state.sucursals ) {
                items.push({
                    name: item.attributes.name,
                    id: item.id
                    })
            }
            return items
        }

    },
    mutations: {
        SET_SUCURSAL ( state,  data) {
            state.sucursal = data
        },
        SET_SUCURSALS (state, data) {
            state.sucursals = data
        }
    },
    actions: {
        
        set_sucursal ( { commit }, data) {
            commit('SET_SUCURSAL', data)
        },

        buscar_sucursals () {
            return axios.get('sucursals')
        },

        set_sucursals({ commit }, data) {
            commit('SET_SUCURSALS', data)
        },
        
    }
}