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
            role: null,
        },
        filters: {
            q: '',
            is_empleados: true,
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

        

        new_item ({commit}) {
            commit('SET_ITEM_CACHE_NEW', {
                id: null,
                nombre:  '',
                surname: '',
                email: '',
                password: '',
                password_confirmation: ''

            })
        },
        store_item_new( { state } ) {
            let data = {
                type: 'users',
                attributes: {
                    name: state.item_cache_new.name,
                    surname: state.item_cache_new.surname,
                    email: state.item_cache_new.email,
                    password: state.item_cache_new.password,
                    password_confirmation: state.item_cache_new.password_confirmation,
                },
            }

            return axios.post('users', {                
                data: data 
            })
        },
        buscar_items({state}) {
            return axios.get('/users', {
                params: {
                    paginate: true,
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                    is_empleados: state.filters.is_empleados,
                }
            })
        },

        buscar_item(_, id) {
            return axios.get(`/users/${id}`)
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
                surname: getters.item_cache.attributes.surname,
                email: getters.item_cache.attributes.email,
                role: getters.item_cache.attributes.role,
            }


            return axios.put(`users/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'users',
                    attributes: attributes,
                }
            })
        },

        update_item_password( { getters }, payload) {
            
            let attributes = {
                password: payload.password,
                password_confirmation: payload.password_confirmation,
            }


            return axios.put(`users/${getters.item.id}/update_password`, {
                data: {
                    id: getters.item.id,
                    type: 'users',
                    attributes: attributes,
                }
            })
        },
    }
}