import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        item: null,
        item_cache: null,
        item_cache_new: null,
        reload_items: false,
        ids_select: {

        },
        filters: {
            client_id: null,
            is_confirmed: null,
        },
        list_meta: {
            select_limit_items: [5, 10, 15, 20],
            page: 1,
            limit: 10,
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

        SET_RELOAD_ITEMS (state, payload) {
            state.reload_items = payload
        }
    },
    actions: {
        set_reload_items({commit}, payload) {
            commit('SET_RELOAD_ITEMS', payload)
        },
    
        
        buscar_items({state}) {
            return axios.get('/payments', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    client_id: state.filters.client_id,
                    is_confirmed: state.filters.is_confirmed,
                }
            })
        },

        buscar_item(_, id) {
            return axios.get(`/payments/${id}`)
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


        update_confirm( _, payment_id) {

            return axios.put(`payments/${payment_id}/confirm`)
        },
        update_no_confirm( _, payment_id) {

            return axios.put(`payments/${payment_id}/no_confirm`)
        },
    }
}