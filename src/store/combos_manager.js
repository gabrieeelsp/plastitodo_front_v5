import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        item: null,
        item_cache: null,
        item_cache_new: null,
        reload_items: false,
        subitem: null,
        subitem_cache: null,
        subitem_cache_new: null,
        ids_select: {

        },
        filters: {
            q: '',
            is_enable: null,
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
        reload_items ( state ) {
            return state.reload_items
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
        set_reload_items({commit}, payload) {
            commit('SET_RELOAD_ITEMS', payload)
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

        new_item ({commit}) {
            commit('SET_ITEM_CACHE_NEW', {
                id: null,
                nombre:  '',
            })
        },
        store_item_new( { state } ) {
            let data = {
                type: 'combos',
                attributes: {
                    name: state.item_cache_new.name,
                },
            }


            return axios.post('combos', {                
                data: data 
            })
        },
        buscar_items({state}) {
            return axios.get('/combos', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                    is_enable: state.filters.is_enable,
                }
            })
        },

        buscar_item(_, id) {
            return axios.get(`/combos/${id}`)
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
                is_enable: getters.item_cache.attributes.is_enable,
            }

            return axios.put(`combos/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'combos',
                    attributes: attributes,
                }
            })
        },
     
        update_item_configuration( { getters }) {
            let attributes = {
                desc_min: getters.item_cache.attributes.desc_min,
                desc_may: getters.item_cache.attributes.desc_may,
                precision_min: getters.item_cache.attributes.precision_min,
                precision_may: getters.item_cache.attributes.precision_may,
            }

            let comboitems = []
            for ( let comboitem of getters.item_cache.relationships.comboitems ) {
                let saleproducts = []
                for ( let saleproduct of comboitem.relationships.saleproducts ) {
                    saleproducts.push({
                        id: saleproduct.id,
                        is_enable: saleproduct.attributes.is_enable
                    })
                }
                comboitems.push({
                    id: comboitem.id,
                    name: comboitem.attributes.name,
                    cantidad: comboitem.attributes.cantidad,
                    relationships: {
                        saleproducts: saleproducts
                    }
                })
            }
            return axios.put(`combos/${getters.item.id}/update_configuration`, {
                data: {
                    id: getters.item.id,
                    type: 'combos',
                    attributes: attributes,
                    relationships: {
                        comboitems: comboitems,
                    },
                }
            })
        },
     
        

        
    }
}