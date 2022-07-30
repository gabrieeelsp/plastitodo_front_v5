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

        update_item_values( { getters } ) {

            let attributes = {
                desc_min: getters.item_cache.attributes.desc_min,
                desc_may: getters.item_cache.attributes.desc_may,
            }

            return axios.put(`combos/${getters.item.id}/update_values`, {
                data: {
                    id: getters.item.id,
                    type: 'combos',
                    attributes: attributes,
                }
            })
        },


        update_subitem( { getters }) {

            let attributes = {
                name: getters.subitem_cache.attributes.name,
                relacion_venta_stock: getters.subitem_cache.attributes.relacion_venta_stock,
                is_enable: getters.subitem_cache.attributes.is_enable,

                porc_min: getters.subitem_cache.attributes.porc_min,
                porc_may: getters.subitem_cache.attributes.porc_may,
            }

            return axios.put(`combos/${getters.subitem.id}`, {
                data: {
                    id: getters.subitem.id,
                    type: 'combos',
                    attributes: attributes,
                }
            })
        },
        store_subitem_new( { state } ) {
            let data = {
                type: 'combos',
                attributes: {
                    name: state.subitem_cache_new.name,
                    relacion_venta_stock: state.subitem_cache_new.relacion_venta_stock,
                    is_enable: state.subitem_cache_new.is_enable,
                },
                relationships: {
                    stockproduct: {
                        data: {
                            id: state.item.id
                        }
                    }
                } 
            }

            return axios.post('combos', {                
                data: data 
            })
        },

        new_subitem ({commit}) {
            commit('SET_SUBITEM_CACHE_NEW', {
                id: null,
                nombre:  '',
                relacion_venta_stock: '',
                is_enable: false
            })
        },

        new_item ({commit}) {
            commit('SET_ITEM_CACHE_NEW', {
                id: null,
                nombre:  '',
                costo: '',
                ivaaliquot_id: 0,
                is_stock_unitario_variable: false,
                stock_aproximado_unidad: ''
            })
        },
        store_item_new( { state } ) {
            let data = {
                type: 'stockproducts',
                attributes: {
                    name: state.item_cache_new.name,
                    costo: state.item_cache_new.costo,
                    is_stock_unitario_variable: state.item_cache_new.is_stock_unitario_variable,
                },
                relationships: {
                    ivaaliquot: {
                        data: {
                            id: state.item_cache_new.ivaaliquot_id
                        }
                    }
                } 
            }

            if ( state.item_cache_new.is_stock_unitario_variable ) {
                data['attributes']['stock_aproximado_unidad'] = state.item_cache_new.stock_aproximado_unidad
            }

            return axios.post('stockproducts', {                
                data: data 
            })
        },
        buscar_items({state}) {
            return axios.get('/combos', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                }
            })
        },

        buscar_item(_, id) {
            return axios.get(`/stockproducts/${id}`)
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
                costo: getters.item_cache.attributes.costo,
                is_stock_unitario_variable: getters.item_cache.attributes.is_stock_unitario_variable,
            }

            if ( getters.item_cache.attributes.is_stock_unitario_variable ) {
                attributes['stock_aproximado_unidad'] = getters.item_cache.attributes.stock_aproximado_unidad
            }

            return axios.put(`stockproducts/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'stockproducts',
                    attributes: attributes,
                    relationships: {
                        ivaaliquot: {
                            id: getters.item_cache.relationships.ivaaliquot.id,
                        },
                    }
                }
            })
        },

        

        

        
    }
}