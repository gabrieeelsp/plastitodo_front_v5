import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        item: null,
        item_cache: null,
        item_cache_new: null,

        ids_select: {
            tags: [],
            catalogos: []
        },
        filters: {
            q: '',
            ivaaliquot_id: null,
            is_promo: null,
            is_enable: true,
        },
        list_meta: {
            select_limit_items: [5, 10, 15, 20],
            page: 1,
            limit: 10,
            last_page: 1,

            show_images: false,
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
        
    },
    actions: {
        
        
        buscar_items({state}) {
            return axios.get('/saleproducts', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                    is_promo: state.filters.is_promo,
                    is_enable: state.filters.is_enable,
                }
            })
        },

        buscar_item(_, id) {
            return axios.get(`/saleproducts/${id}`)
        },

        set_items({ commit }, payload) {
            commit('SET_ITEMS', payload)
        },
        set_item({ commit, state }, payload) {
            commit('SET_ITEM', payload)
            commit('SET_ITEM_CACHE', JSON.parse(JSON.stringify(payload)))    

            state.ids_select.tags = []
            if ( state.item ){
                for ( let tag of state.item.relationships.tags ) {
                    state.ids_select.tags.push({id: tag.id, name: tag.attributes.name, color: tag.attributes.color})
                }
            }
            state.ids_select.catalogos = []
            if ( state.item ){
                for ( let catalogo of state.item.relationships.catalogos ) {
                    state.ids_select.catalogos.push({id: catalogo.id, name: catalogo.attributes.name, color: catalogo.attributes.color})
                }
            }
        },
        set_item_cache({ commit }, payload) {
            commit('SET_ITEM_CACHE', payload)
        },


        update_item_resumen( { getters, state }, payload) {

            let attributes = {
                //name: getters.item_cache.attributes.name,
                porc_min: getters.item_cache.attributes.porc_min,
                porc_may: getters.item_cache.attributes.porc_may,
                barcode: payload.barcode
            }

            let tags_json = []
            for ( let tag of state.ids_select.tags ) {
                tags_json.push({id: tag.id})
            }

            let catalogos_json = []
            for ( let catalogo of state.ids_select.catalogos ) {
                catalogos_json.push({id: catalogo.id})
            }

            return axios.put(`saleproducts/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'saleproducts',
                    attributes: attributes,
                    relationships: {
                        tags: tags_json,
                        catalogos: catalogos_json,
                    }
                }
            })
        },
        update_item_values( { getters }, is_updategroup) {

            let attributes = {
                porc_min: getters.item_cache.attributes.porc_min,
                porc_may: getters.item_cache.attributes.porc_may,
                precision_min: getters.item_cache.attributes.precision_min,
                precision_may: getters.item_cache.attributes.precision_may,
            }

            return axios.put(`saleproducts/${getters.item.id}/update_values`, {
                data: {
                    id: getters.item.id,
                    update_group: is_updategroup,
                    type: 'saleproducts',
                    attributes: attributes,
                }
            })
        },

        update_item_descuentos( { getters }, is_updategroup) {

            let attributes = {
                fecha_desc_desde: getters.item_cache.attributes.fecha_desc_desde,
                fecha_desc_hasta: getters.item_cache.attributes.fecha_desc_hasta,
                desc_min: getters.item_cache.attributes.desc_min,
                desc_may: getters.item_cache.attributes.desc_may,
            }

            return axios.put(`saleproducts/${getters.item.id}/update_desc_values`, {
                data: {
                    id: getters.item.id,
                    update_group: is_updategroup,
                    type: 'saleproducts',
                    attributes: attributes,
                }
            })
        },

        update_values_items_group( { state }, payload ) {
            for ( let item_saleproduct of state.items.filter((i) => {
                return i.relationships.saleproductgroup
            }) ) {
                if ( item_saleproduct.relationships.saleproductgroup.id == payload.id ) {
                    item_saleproduct.attributes.porc_min = payload.porc_min
                    item_saleproduct.attributes.porc_may = payload.porc_may

                    item_saleproduct.attributes.precio_min = payload.precio_min
                    item_saleproduct.attributes.precio_may = payload.precio_may

                    item_saleproduct.attributes.precision_min = payload.precision_min
                    item_saleproduct.attributes.precision_may = payload.precision_may
                }
            }
        }
    }
}