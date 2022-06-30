export default {
    namespaced: true,
    state: {
        sucursal: null
    },
    getters: {
        sucursal ( state ) {
            return state.sucursal
        },

        is_sucursal_selected ( state ) {
            return state.sucursal != null
        }

    },
    mutations: {
        SET_SUCURSAL ( state,  data) {
            state.sucursal = data
        }
    },
    actions: {
        
        set_sucursal ( { commit }, data) {
            commit('SET_SUCURSAL', data)
        }
        
    }
}