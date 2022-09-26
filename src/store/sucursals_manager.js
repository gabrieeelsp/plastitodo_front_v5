import axios from 'axios'
export default {
    namespaced: true,
    state: {
        sucursal: null,
        sucursals: [],
        item: null,
        item_cache: null,
        item_cache_new: null,
    },
    getters: {
        sucursal ( state ) {
            return state.sucursal
        },

        is_sucursal_selected ( state ) {
            return state.sucursal != null
        },

        sucursal_by_id: (state) => (id) => {
            for ( let sucursal of state.sucursals ) {
                if ( sucursal.id == id ) {
                    return sucursal
                }
            }
            return null
        },

        sucursals (state) {
            return state.sucursals
        },
        sucursals_select ( state ) {
            let items = []
            for (let item of state.sucursals ) {
                items.push({
                    name: item.attributes.name,
                    id: item.id
                    })
            }
            return items
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

    },
    mutations: {
        SET_SUCURSAL ( state,  data) {
            state.sucursal = data
        },
        SET_SUCURSALS (state, data) {
            state.sucursals = data
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
        ADD_ITEM ( state, payload ) {
            state.sucursals.unshift(payload)
        }
    },
    actions: {
        store_item_new( { state, rootState } ) {
            
            return axios.post('sucursals/', {
                data: {
                    type: 'sucursals',
                    attributes: {
                        name: state.item_cache_new.name,
                        telefono: state.item_cache_new.telefono,
                        telefono_movil: state.item_cache_new.telefono_movil,
                        direccion: state.item_cache_new.direccion,
                        punto_venta_fe: state.item_cache_new.punto_venta_fe,
                    },
                    relationships: {
                        empresa: {
                            data: {
                                id: rootState.empresa.id,
                            } 
                        }
                    }
                }
            })

        },
        new_item ({commit}) {
            commit('SET_ITEM_CACHE_NEW', {
                id: null,
                name:  '',
                telefono: '',
                telefono_movil: '',
                direccion: '',
                punto_venta_fe: '',
            })
        },

        add_item ( { commit }, payload ) {
            commit('ADD_ITEM', payload)
        },
        
        set_sucursal ( { commit }, data) {
            commit('SET_SUCURSAL', data)
        },

        buscar_sucursals () {
            return axios.get('sucursals')
        },

        set_sucursals({ commit }, data) {
            commit('SET_SUCURSALS', data)
        },
        

        set_item({ commit }, payload) {
            commit('SET_ITEM', payload)
            commit('SET_ITEM_CACHE', JSON.parse(JSON.stringify(payload)))
            
        },

        buscar_item( { getters }, id) {
            return getters.sucursals.filter((i) => {
                if (i.id == id ) {
                    return true
                }
                return false
            })[0]
        },

        update_item_resumen( { getters }) {

            let attributes = {
                name: getters.item_cache.attributes.name,
                direccion: getters.item_cache.attributes.direccion,
                telefono: getters.item_cache.attributes.telefono,
                telefono_movil: getters.item_cache.attributes.telefono_movil,
                punto_venta_fe: getters.item_cache.attributes.punto_venta_fe,
                horario: getters.item_cache.attributes.horario,
            }

            return axios.put(`sucursals/${getters.item.id}`, {
                data: {
                    id: getters.item.id,
                    type: 'sucursals',
                    attributes: attributes
                }
            })
        },
    }
}