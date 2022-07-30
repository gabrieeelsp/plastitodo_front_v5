import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        item: null,

        ids_select: {

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
        filters (state) {
            return state.filters
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
            state.items = state.items.filter((i) => {
                if ( i.id != state.item.id ) {
                    return true
                }
                return false
            })
            state.item = null
        },
    },
    actions: {
        item_new (_, payload) {
            return axios.post('/suppliers/make_order', payload)
        },
        buscar_items({state}) {
            return axios.get('/purchaseorders', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                }
            })
        },

        save_item( {getters} ) {
            let json_items = []

            for ( var item of getters.item.relationships.purchaseorderitems ) {
                if ( item.attributes.cantidad != 0 ) {
                    json_items.push({
                        id: item.id,
                        cantidad: item.attributes.cantidad,                                     
                    })
                }
                
            }

            return axios.put(`purchaseorders/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'purchaseorders',
                    attributes: null,
                    relationships: {
                        purchaseorderitems: json_items,
                    }
                }
            })

        },

        detele_item( {getters}) {
            return axios.delete(`purchaseorders/${getters.item.id}`)
        },

        unset_item ( {commit} ) {
            commit('UNSET_ITEM')
        },

        buscar_item(_, id) {
            return axios.get(`/purchaseorders/${id}`)
        },

        set_items({ commit }, payload) {

            commit('SET_ITEMS', payload)
        },
        set_item({ commit }, payload) {
            commit('SET_ITEM', payload)     
        },

        add_item( { commit }, payload ) {
            commit('ADD_ITEM', payload)
        }
    }
}