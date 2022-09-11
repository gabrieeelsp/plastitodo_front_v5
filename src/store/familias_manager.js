import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        reload_items: false,
        item: null,
        item_cache: null,
        item_cache_new: null,

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
        
        SET_RELOAD_ITEMS (state, payload) {
            state.reload_items = payload
        }
    },
    actions: {

        new_item ({commit}) {
            commit('SET_ITEM_CACHE_NEW', {
                id: null,
                nombre:  '',
            })
        },
        store_item_new( { state } ) {
            let data = {
                type: 'familias',
                attributes: {
                    name: state.item_cache_new.name,
                },
            }

            return axios.post('familias', {                
                data: data 
            })
        },

        buscar_items({state}) {
            return axios.get('/familias', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                }
            })
        },

        set_reload_items({commit}, payload) {
            commit('SET_RELOAD_ITEMS', payload)
        },

        buscar_item(_, id) {
            return axios.get(`/familias/${id}`)
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
                comments: getters.item_cache.attributes.comments,
            }

            return axios.put(`familias/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'familias',
                    attributes: attributes,
                }
            })
        },
    }
}