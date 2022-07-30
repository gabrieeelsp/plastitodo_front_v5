import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        item: null,
        item_cache: null,
        ids_select: {

        },
        filters: {
            tipo: null,
            ivacondition_id: null,
            q: ''
        },
        list_meta: {
            select_limit_items: [5, 10, 15, 20],
            page: 1,
            limit: 5,
            last_page: 1,
        },
    },
    getters: {
        items (state) {
            return state.items
        },
        item (state) {
            return state.item
        },
        item_cache (state) {
            return state.item_cache
        },
        ids_select (state) {
            return state.ids_select
        },
        filters (state) {
            return state.filters
        },
        list_meta ( state ) {
            return state.list_meta
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
        set_list_meta( { commit }, payload) {
            commit('SET_LIST_META', payload)
        },
        buscar_items({state}) {
            let params = []
            if ( state.filters.q != '' ) {
                params.push({ q: state.filters.q })
            }
            if ( state.filters.ivacondition_id != null ) {
                params.push({ ivacondition_id: state.filters.ivacondition_id })
            }
            if ( state.filters.tipo != null ) {
                params.push({ tipo: state.filters.tipo })
            }
            return axios.get('/clients', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    q: state.filters.q,
                    tipo: state.filters.tipo,
                    ivacondition_id: state.filters.ivacondition_id,
                }
            })
        },

        buscar_item(_, id) {
            return axios.get(`/clients/${id}`)
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
                telefono: getters.item_cache.attributes.telefono,
                direccion: getters.item_cache.attributes.direccion,
                tipo: getters.item_cache.attributes.tipo,
            }

            if ( getters.item_cache.attributes.tipo_persona == 'FISICA' ) {
                attributes['surname'] = getters.item_cache.attributes.surname
            }
            


            return axios.put(`clients/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'clients',
                    attributes: attributes
                }
            })
        },
        update_item_facturacion( { getters }) {
            let attributes = {
                direccion_fact: getters.item_cache.attributes.direccion_fact,
                docnumber: getters.item_cache.attributes.docnumber,
                is_fact_default: getters.item_cache.attributes.is_fact_default,
            }
            if ( getters.item.attributes.tipo_persona == 'JURIDICA' ) {
                attributes['nombre_fact'] = getters.item_cache.attributes.nombre_fact
            }
            return axios.put(`clients/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'clients',
                    attributes: attributes,
                    relationships: {
                        ivacondition: {
                            id: getters.item_cache.relationships.ivacondition.id,
                        },
                        doctype: {
                            id: getters.item_cache.relationships.doctype.id,
                        }
                    }
                }
            })
        }
    }
}