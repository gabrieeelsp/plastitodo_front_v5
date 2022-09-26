import axios from 'axios'

export default {
    namespaced: true,
    state: {
        items: null,
        item: null,
        reload_items: false,
        item_cache: null,
        item_cache_new: null,
        ids_select: {
            tags: []
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
        item_cache_new (state) {
            return state.item_cache_new
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
                name:  '',
                surname: '',
                telefono: '',
                direccion: '',
                tipo_persona: 'FISICA',
                tipo: 'MINORISTA'
            })
        },
        store_item_new( { state } ) {
            let data = {
                type: 'clients',
                attributes: {
                    name: state.item_cache_new.name,
                    surname: state.item_cache_new.surname,
                    telefono: state.item_cache_new.telefono,
                    direccion: state.item_cache_new.direccion,
                    tipo: state.item_cache_new.tipo,
                    tipo_persona: state.item_cache_new.tipo_persona,
                },
            }

            return axios.post('clients', {                
                data: data 
            })
        },
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
        set_item({ commit, state }, payload) {
            commit('SET_ITEM', payload)
            commit('SET_ITEM_CACHE', JSON.parse(JSON.stringify(payload)))

            state.ids_select.tags = []
            if ( state.item ){
                for ( let tag of state.item.relationships.tags ) {
                    state.ids_select.tags.push({id: tag.id, name: tag.attributes.name, color: tag.attributes.color})
                }
            }
            
            
        },
        set_item_cache({ commit }, payload) {
            commit('SET_ITEM_CACHE', payload)
        },


        update_item_resumen( { getters, state }) {

            let attributes = {
                name: getters.item_cache.attributes.name,
                telefono: getters.item_cache.attributes.telefono,
                direccion: getters.item_cache.attributes.direccion,
                tipo: getters.item_cache.attributes.tipo,
                coments_client: getters.item_cache.attributes.coments_client,
                coments_direccion_client: getters.item_cache.attributes.coments_direccion_client,
                credito_disponible: getters.item_cache.attributes.credito_disponible,
            }

            if ( getters.item_cache.attributes.tipo_persona == 'FISICA' ) {
                attributes['surname'] = getters.item_cache.attributes.surname
            }
            
            let tags_json = []
            for ( let tag of state.ids_select.tags ) {
                tags_json.push({id: tag.id})
            }

            return axios.put(`clients/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'clients',
                    attributes: attributes,
                    relationships: {
                        tags: tags_json
                    }
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