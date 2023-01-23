import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        reload_items: false,
        item: null,
        item_cache: null,
        item_cache_new: null,
        subitem: null,
        subitem_cache: null,
        subitem_cache_new: null,
        item_ids_select: {
            stockproductgroup_id: null
        },
        subitem_ids_select: {
            saleproductgroup_id: null
        },
        orders: {
            time_set_costo: false
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
        reload_items ( state ) {
            return state.reload_items
        },
        item_cache (state) {
            return state.item_cache
        },
        item_cache_new (state) {
            return state.item_cache_new
        },
        item_ids_select (state) {
            return state.item_ids_select
        },
        subitem_ids_select (state) {
            return state.subitem_ids_select
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
        orders (state) {
            return state.orders
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
        SET_RELOAD_ITEMS (state, payload) {
            state.reload_items = payload
        }
    },
    actions: {
        set_subitem({ commit }, payload) {
            commit('SET_SUBITEM', payload)
            commit('SET_SUBITEM_CACHE', JSON.parse(JSON.stringify(payload)))            
        },

        update_subitem( { getters }, tipo ) {

            let is_enable_web = getters.subitem_cache.attributes.is_enable_web
            if ( !getters.subitem_cache.attributes.is_enable ) {
                is_enable_web = false
            }

            if ( tipo == 'saleproduct' ){
                let attributes = {
                    name: getters.subitem_cache.attributes.name,
                    relacion_venta_stock: getters.subitem_cache.attributes.relacion_venta_stock,
                    is_enable: getters.subitem_cache.attributes.is_enable,
                    is_enable_web: is_enable_web,
    
                    porc_min: getters.subitem_cache.attributes.porc_min,
                    porc_may: getters.subitem_cache.attributes.porc_may,

                    comments: getters.subitem_cache.attributes.comments,
                }
                console.log(getters.subitem_ids_select.saleproductgroup_id)
                return axios.put(`saleproducts/${getters.subitem.id}`, {
                    data: {
                        id: getters.subitem.id,
                        type: 'saleproducts',
                        attributes: attributes,
                        relationships: {
                            saleproductgroup: {
                                id: getters.subitem_ids_select.saleproductgroup_id,
                            }
                        }
                    }
                })
            }else if ( tipo == 'purchaseproduct' ) {
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
                        supplier: {
                            data: {
                                id: state.subitem_cache_new.supplier_id
                            }
                        },
                        stockproduct: {
                            data: {
                                id: state.item.id
                            }
                        },

                    } 
                }
    
                return axios.post('purchaseproducts', {                
                    data: data 
                })
            }else if ( tipo == 'saleproduct' ) {
                let data = {
                    type: 'saleproducts',
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
                        },

                    } 
                }
    
                return axios.post('saleproducts', {                
                    data: data 
                })
            }
            
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
            return axios.get('/stockproducts', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                    ivaaliquot_id: state.filters.ivaaliquot_id,
                    order_time_set_costo: state.orders.time_set_costo,
                }
            })
        },

        set_reload_items({commit}, payload) {
            commit('SET_RELOAD_ITEMS', payload)
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
                        stockproductgroup: {
                            id: getters.item_ids_select.stockproductgroup_id,
                        }
                    }
                }
            })
        },

        update_item_values( { getters }, is_updategroup) {

            let attributes = {
                costo: getters.item_cache.attributes.costo,
            }

            return axios.put(`stockproducts/${getters.item.id}/update_values`, {
                data: {
                    id: getters.item.id,
                    update_group: is_updategroup,
                    type: 'stockproducts',
                    attributes: attributes,
                }
            })
        },

        update_costo_items_group( { state }, payload ) {
            for ( let item_stockproduct of state.items.filter((i) => {
                return i.relationships.stockproductgroup
            }) ) {
                if ( item_stockproduct.relationships.stockproductgroup.id == payload.id ) {
                    item_stockproduct.attributes.costo = payload.costo
                    item_stockproduct.attributes.time_set_costo = payload.time_set_costo
                }
            }
        },

        update_values_subitems_group( { state }, payload ) {

            for ( let item_stockproduct of state.items ) {
                for ( let item_saleproduct of item_stockproduct ) {
                    if ( item_saleproduct.relationships.saleproductgroup && item_saleproduct.relationships.saleproductgroup.id == payload.id ) {
                        item_saleproduct.attributes.relacion_venta_stock = payload.relacion_venta_stock
                        item_saleproduct.attributes.porc_min = payload.porc_min
                        item_saleproduct.attributes.porc_may = payload.porc_may
                    }
                }
            }
        }
    }
}