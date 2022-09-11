import axios from 'axios'

export default {
    namespaced: true,
    state: {
        deliveryshifts: []
    },
    getters: {
        deliveryshifts (state) {
            return state.deliveryshifts
        },

        deliveryshift_by_id: (state) => (id) => {
            for ( let deliveryshift of state.deliveryshifts ) {
                if ( deliveryshift.id == id ) {
                    return deliveryshift
                }
            }
            return null
        },

        deliveryshifts_select ( state ) {
            let items = []
            for (let item of state.deliveryshifts ) {
                items.push({
                    name: item.attributes.name,
                    id: item.id
                    })
            }
            return items
        }
    },
    mutations: {
        SET_DELIVERYSHIFTS (state, data) {
            state.deliveryshifts = data
        }
    },
    actions: {
        buscar_deliveryshifts () {
            return axios.get('deliveryshifts')
        },

        set_deliveryshifts({ commit }, data) {
            commit('SET_DELIVERYSHIFTS', data)
        },
    }
}