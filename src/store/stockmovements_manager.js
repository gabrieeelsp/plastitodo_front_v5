import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        item: null,

        filters: {
            sucursal_id: null,
        },
        list_meta: {
            select_limit_items: [5, 10, 15, 20],
            page: 1,
            limit: 5,
            last_page: 1,
        },
    },
    getters: {
        list_meta ( state ) {
            return state.list_meta
        },
        items (state) {
            return state.items
        },
        item (state) {
            return state.item
        },
        filters (state) {
            return state.filters
        },
        item_ids_select (state) {
            return state.item_ids_select
        },
    },
    mutations: {
        SET_ITEMS (state, payload) {
            state.items = payload
        },
        SET_ITEM (state, payload ) {
            state.item = payload
        },
        ADD_ITEM ( state, payload ) {
            state.items.unshift(payload)
        },
        UNSET_ITEM ( state ) {
            if ( state.items ) {
                state.items = state.items.filter((i) => {
                    if ( i.id != state.item.id ) {
                        return true
                    }
                    return false
                })
                state.item = null
            }
            
        },

        ADD_SUBITEM(state, item) {
            state.item.relationships.stockmovementitems.push(item)
        },
        REMOVE_SUBITEM(state, id) {
            state.item.relationships.stockmovementitems = state.item.relationships.stockmovementitems.filter((i) => {
                return i.id != id
            })
        }
    },
    actions: {
        item_new ({rootState}, payload) {
            return axios.post('/stockmovements/new', {
                sucursal_id: rootState.sucursals_manager.sucursal.id,
                tipo: payload.tipo
            })
        },
        buscar_items({state}) {
            return axios.get('/stockmovements', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    sucursal_id: state.filters.sucursal_id,
                }
            })
        },
        save_item( {getters}, is_confirmar ) {
            let json_items = []

            for ( var item of getters.item.relationships.stockmovementitems ) {
                if ( item.attributes.cantidad != 0 ) {
                    json_items.push({
                        id: item.id,
                        stockproduct_id: item.relationships.stockproduct.id,
                        cantidad: item.attributes.cantidad,                                 
                    })
                }
                
            }
            
            return axios.put(`stockmovements/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'stockmovements',
                    attributes: null,
                    relationships: {
                        stockmovementitems: json_items,
                    },
                    meta: {
                        is_confirmar: is_confirmar
                    }
                }
            })

        },

        detele_item( {getters}) {
            return axios.delete(`stockmovements/${getters.item.id}`)
        },

        unset_item ( {commit} ) {
            commit('UNSET_ITEM')
        },

        buscar_item(_, id) {
            return axios.get(`/stockmovements/${id}`)
        },

        set_items({ commit, getters }, payload) {
            commit('SET_ITEMS', payload)
            if ( getters.item ) {
                getters.items.filter((i) => {
                    if ( i.id == getters.item.id ) {
                        return true
                    }
                    return false
                })[0].relationships.stockmovementitems = getters.item.relationships.stockmovementitems
            }
        },
        set_item({ commit }, payload) {
            commit('SET_ITEM', payload)   

        },

        add_item( { commit }, payload ) {
            commit('ADD_ITEM', payload)
        },

        add_subitem( { commit }, item) {
            commit('ADD_SUBITEM', item)
        },

        remove_subitem( { commit }, id ) {
            commit('REMOVE_SUBITEM', id)
        }

    
    }
}