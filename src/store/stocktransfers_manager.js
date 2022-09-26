import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        item: null,

        item_ids_select: {
            sucursal_origen_id: null,
        },
        filters: {
            q: '',
            supplier_id: null,
        },
        list_meta: {
            select_limit_items: [5, 10, 15, 20],
            page: 1,
            limit: 5,
            last_page: 1,
        },
        colors_state: [
            {state: 'EDITANDO', color: 'cyan'},
            {state: 'FINALIZADO', color: 'blue'},
            //{state: 'CONFIRMADO', color: 'brown'},
            {state: 'EN PREPARACION', color: 'orange'},
            {state: 'PREPARADO', color: 'indigo'},
            {state: 'INGRESANDO', color: 'teal'},
            {state: 'EN DISTRIBUCION', color: 'red'},
            {state: 'RECIBIDO', color: 'green'},
        ],
    },
    getters: {
        color_state: (state) => (estado) => {
            return state.colors_state.find(item => item.state === estado).color
        },
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

        is_item_ok_to_save (state) {
            if ( state.item.relationships.stocktransferitems.length  == 0 ) {
                return false
            }
            return true
        },
        is_item_ok_to_set_preparado (state) {

            for ( let stocktransferitem of state.item.relationships.stocktransferitems ) {
                if ( !stocktransferitem.attributes.is_prepared ) {
                    return false
                }
            }
            return true
        },
        is_item_ok_to_set_recibido (state) {

            for ( let stocktransferitem of state.item.relationships.stocktransferitems ) {
                if ( !stocktransferitem.attributes.is_recibido ) {
                    return false
                }
            }
            return true
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
                
            }
            state.item = null
            
        },

        ADD_SUBITEM(state, item) {
            state.item.relationships.stocktransferitems.push(item)
        },
        REMOVE_SUBITEM(state, id) {
            state.item.relationships.stocktransferitems = state.item.relationships.stocktransferitems.filter((i) => {
                return i.id != id
            })
        }
    },
    actions: {
        item_new ({rootState}, payload) {
            return axios.post('/stocktransfers', {
                data: {
                    relationships: {
                        sucursal_origen_id: rootState.sucursals_manager.sucursal.id,
                        sucursal_destino_id: payload.sucursal_destino_id
                    }
                }
                
            })
        },
        buscar_items({state}) {
            return axios.get('/stocktransfers', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                    sucursal_origen_id: state.filters.sucursal_origen_id,
                }
            })
        },

        save_item( {getters}, evento ) {
            let json_items = []

            for ( var item of getters.item.relationships.stocktransferitems ) {
                if ( item.attributes.cantidad != 0 ) {
                    json_items.push({
                        stockproduct_id: item.relationships.stockproduct.id,
                        cantidad: item.attributes.cantidad,     
                        is_prepared: item.attributes.is_prepared,  
                        is_recibido: item.attributes.is_recibido,                                
                    })
                }
                
            }

            let json_stocktransfer = {
                items: json_items,
                evento: evento,
            }
            
            return axios.put(`stocktransfers/${getters.item.id}`, json_stocktransfer)

        },

        detele_item( {getters}) {
            return axios.delete(`stocktransfers/${getters.item.id}`)
        },

        unset_item ( {commit} ) {
            commit('UNSET_ITEM')
        },

        buscar_item(_, id) {
            return axios.get(`/stocktransfers/${id}`)
        },

        set_items({ commit, getters }, payload) {
            commit('SET_ITEMS', payload)
            if ( getters.item ) {
                getters.items.filter((i) => {
                    if ( i.id == getters.item.id ) {
                        return true
                    }
                    return false
                })[0].relationships.purchaseorderitems = getters.item.relationships.purchaseorderitems
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