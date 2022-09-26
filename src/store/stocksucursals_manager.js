import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        item: null,
        item_cache: null,

        filters: {
            q: '',
            sucursal_id: null,
        },
        orders: {
            stock: false
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


        filters (state) {
            return state.filters
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

    },
    actions: {
        
        buscar_items({state}) {
            return axios.get('/stockproducts/stock', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                    sucursal_id: state.filters.sucursal_id,

                    order_stock: state.orders.stock,
                }
            })
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


        
    }
}