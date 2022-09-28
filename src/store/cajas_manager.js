import axios from 'axios'

export default {
    namespaced: true,
    state: {
        caja: null,
        caja_edit: null,

        items: null,

        list_meta: {
            select_limit_items: [5, 10, 15, 20],
            page: 1,
            limit: 10,
            last_page: 1,
        },
        filters: {
            sucursal_id: null,
            user_id: null,
        },
        reload_items: false,
        valors_recuento: [],

        colors_is_open: [
            {is_open: true, color: 'cyan'},
            {is_open: false, color: 'blue'},
        ],
    },
    getters: {
        colors_is_open: (state) => (is_open) => {
            return state.colors_is_open.find(item => item.is_open == is_open).color
        },
        caja (state) {
            return state.caja
        },
        caja_edit (state) {
            return state.caja_edit
        },
        items (state) {
            return state.items
        },
        item (state) {
            return state.item
        },

        valors_recuento ( state ) {
            return state.valors_recuento
        },
        filters (state) {
            return state.filters
        },
        list_meta ( state ) {
            return state.list_meta
        },
        reload_items ( state ) {
            return state.reload_items
        },
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
        },
        SET_ITEMS (state, payload) {
            state.items = payload
        },
        SET_ITEM (state, payload) {
            state.item = payload
            if ( payload && payload.relationships.sucursal ) {
                state.ids_select.sucursal_id = payload.relationships.sucursal.id
            }
            
        },
        SET_RELOAD_ITEMS (state, payload) {
            state.reload_items = payload
        },
    },
    actions: {
        set_reload_items({commit}, payload) {
            commit('SET_RELOAD_ITEMS', payload)
        },
        buscar_caja({ rootState }) {
            return axios.get(`/cajas/find/${rootState.sucursals_manager.sucursal.id}`)
        },
        buscar_items({state}) {
            return axios.get('/cajas', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    state: state.filters.state,
                    user_id: state.filters.user_id,
                    sucursal_id: state.filters.sucursal_id,
                }
            })
        },

        set_items({ commit }, payload) {
            commit('SET_ITEMS', payload)
        },
        set_item({ commit }, payload) {
            commit('SET_ITEM', payload)         
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