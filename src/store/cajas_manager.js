import axios from 'axios'

export default {
    namespaced: true,
    state: {
        caja: null,
        caja_edit: null,

        valors_recuento: [],
    },
    getters: {
        caja (state) {
            return state.caja
        },
        caja_edit (state) {
            return state.caja_edit
        },

        valors_recuento ( state ) {
            return state.valors_recuento
        }
    },
    mutations: {
        SET_CAJA (state, data) {
            state.caja = data
        },
        SET_CAJA_EDIT (state, payload) {
            state.caja_edit = payload
        },
        SET_VALORS_RECUENTO (state, payload) {
            state.valors_recuento = payload
        }
    },
    actions: {
        buscar_caja({ rootState }) {
            return axios.get(`/cajas/find/${rootState.sucursals_manager.sucursal.id}`)
        },

        set_caja({ commit }, data) {
            commit('SET_CAJA', data)
        },

        set_caja_edit({ commit }, payload) {
            commit('SET_CAJA_EDIT', payload)
        },

        set_valors_recuento({ commit }, payload) {
            commit('SET_VALORS_RECUENTO', payload)
        },

        cerrar_caja ({ getters }) {
            let dinero_final = 0
            for ( let valor of getters.valors_recuento ) {
                dinero_final = dinero_final + valor.valor.attributes.valor * valor.cantidad
            }
            return axios.put(`cajas/${getters.caja.id}/cerrar`, {
                data: {
                    dinero_final: dinero_final
                }
            })
        },

        abrir_caja ({ getters, rootState }) {
            let dinero_inicial = 0
            for ( let valor of getters.valors_recuento ) {
                dinero_inicial = dinero_inicial + valor.valor.attributes.valor * valor.cantidad
            }
            return axios.post(`cajas`, {
                data: {
                    dinero_inicial: dinero_inicial,
                    sucursal_id: rootState.sucursals_manager.sucursal.id
                }
            })
        }
    }
}