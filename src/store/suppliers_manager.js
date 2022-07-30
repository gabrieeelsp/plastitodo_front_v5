import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        item: null,
        item_cache: null,
        item_cache_new: null,
        subitem: null,
        subitem_cache: null,
        subitem_cache_new: null,
        ids_select: {

        },
        filters: {
            q: '',
            ivaaliquot_id: null,
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
        item_cache (state) {
            return state.item_cache
        },
        item_cache_new (state) {
            return state.item_cache_new
        },
        ids_select (state) {
            return state.ids_select
        },
        filters (state) {
            return state.filters
        },
        subitem (state) {
            return state.subitem
        },
        subitem_cache (state) {
            return state.subitem_cache
        },
        subitem_cache_new (state) {
            return state.subitem_cache_new
        },
    },
    mutations: {
        SET_ITEMS (state, payload) {
            state.items = payload
        },
        SET_ITEM (state, payload) {
            state.item = payload
        },
        SET_ITEM_CACHE (state, payload) {
            state.item_cache = payload
        },
        SET_ITEM_CACHE_NEW (state, payload) {
            state.item_cache_new = payload
        },
        SET_SUBITEM (state, payload) {
            state.subitem = payload
        },
        SET_SUBITEM_CACHE (state, payload) {
            state.subitem_cache = payload
        },
        SET_SUBITEM_CACHE_NEW (state, payload) {
            state.subitem_cache_new = payload
        },
    },
    actions: {
        set_subitem({ commit }, payload) {
            commit('SET_SUBITEM', payload)
            commit('SET_SUBITEM_CACHE', JSON.parse(JSON.stringify(payload)))          
        },

        update_subitem( { getters }, tipo ) {

            if ( tipo == 'purchaseproduct' ) {
                let attributes = {
                    name: getters.subitem_cache.attributes.name,
                    relacion_compra_stock: getters.subitem_cache.attributes.relacion_compra_stock,
                    is_enable: getters.subitem_cache.attributes.is_enable,
                }
    
                return axios.put(`purchaseproducts/${getters.subitem.id}`, {
                    data: {
                        id: getters.subitem.id,
                        type: 'purchaseproducts',
                        attributes: attributes,
                    }
                })
            }            
        },
        store_subitem_new( { state }, tipo ) {
            if ( tipo == 'purchaseproduct' ) {
                let data = {
                    type: 'purchaseproducts',
                    attributes: {
                        name: state.subitem_cache_new.name,
                        relacion_compra_stock: state.subitem_cache_new.relacion_compra_stock,
                        is_enable: state.subitem_cache_new.is_enable,
                    },
                    relationships: {
                        stockproduct: {
                            data: {
                                id: state.subitem_cache_new.stockproduct_id
                            }
                        },
                        supplier: {
                            data: {
                                id: state.item.id
                            }
                        },

                    } 
                }
    
                return axios.post('purchaseproducts', {                
                    data: data 
                })
            }
            
        },

        new_subitem ({commit}) {
            commit('SET_SUBITEM_CACHE_NEW', {
                id: null,
                nombre:  '',
                relacion_compra_stock: '',
                is_enable: false,
                stockproduct_id: 0
            })
        },

        new_item ({commit}) {
            commit('SET_ITEM_CACHE_NEW', {
                id: null,
                nombre:  '',
            })
        },
        store_item_new( { state } ) {
            let data = {
                type: 'suppliers',
                attributes: {
                    name: state.item_cache_new.name,
                },
            }

            return axios.post('suppliers', {                
                data: data 
            })
        },
        buscar_items({state}) {
            return axios.get('/suppliers', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                }
            })
        },

        buscar_item(_, id) {
            return axios.get(`/suppliers/${id}`)
        },

        set_items({ commit }, payload) {
            commit('SET_ITEMS', payload)
        },
        set_item({ commit }, payload) {
            commit('SET_ITEM', payload)
            commit('SET_ITEM_CACHE', JSON.parse(JSON.stringify(payload)))            
        },
        set_item_cache({ commit }, payload) {
            commit('SET_ITEM_CACHE', payload)
        },


        update_item_resumen( { getters }) {

            let attributes = {
                name: getters.item_cache.attributes.name,
            }

            return axios.put(`suppliers/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'suppliers',
                    attributes: attributes,
                }
            })
        },
    }
}