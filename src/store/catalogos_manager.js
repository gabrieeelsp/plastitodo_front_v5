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
        set_subitem({ commit }, payload) {
            commit('SET_SUBITEM', payload)
            commit('SET_SUBITEM_CACHE', JSON.parse(JSON.stringify(payload)))          
        },


        


        new_item ({commit}) {
            commit('SET_ITEM_CACHE_NEW', {
                id: null,
                nombre:  '',
                color: ''
            })
        },
        store_item_new( { state } ) {
            let data = {
                type: 'catalogos',
                attributes: {
                    name: state.item_cache_new.name,
                    color: state.item_cache_new.color,
                },
            }

            return axios.post('catalogos', {                
                data: data 
            })
        },
        buscar_items({state}) {
            return axios.get('/catalogos', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                }
            })
        },

        buscar_item(_, id) {
            return axios.get(`/catalogos/${id}`)
        },
        buscar_item_by_key(_, key) {
            return axios.get(`/get_catalogo_by_key/${key}`)
        },

        set_items({ commit }, payload) {
            commit('SET_ITEMS', payload)
        },
        set_item({ commit }, payload) {
            if ( payload != null ) {
                commit('SET_ITEM', payload)
                commit('SET_ITEM_CACHE', JSON.parse(JSON.stringify(payload)))
            }
        },
        set_item_cache({ commit }, payload) {
            commit('SET_ITEM_CACHE', payload)
        },


        update_item_resumen( { getters }) {
            
            let attributes = {
                name: getters.item_cache.attributes.name,
                color: getters.item_cache.attributes.color,

                comments: getters.item_cache.attributes.comments,
                
            }

            return axios.put(`catalogos/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'catalogos',
                    attributes: attributes,
                }
            })
        },
    }
}