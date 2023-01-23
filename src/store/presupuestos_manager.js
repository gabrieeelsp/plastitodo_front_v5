export default {
    namespaced: true,
    state: {
        presupuestos: [],
        presupuestoActive: null,
    },
    getters: {
        presupuestos (state) {
            return state.presupuestos
        },
        presupuestoActive (state) {
            return state.presupuestoActive
        },
        cantItemsPresupuestoActive (state) {
            return state.presupuestoActive.items.length + state.presupuestoActive.comboitems.length
        },

        totalPresupuestoActive (state) {
            let total = 0
            for ( let item of state.presupuestoActive.items) {
                if( item.is_stock_unitario_variable ) {
                    total = total + (item.precio * item.cantidad )
                    //total = total + (item.precio * item.cantidad * Number(item.stock_aproximado_unidad))
                }else {
                    total = total + (item.precio * item.cantidad)
                }                
            }

            for ( let comboitem of state.presupuestoActive.comboitems ) {
                total = total + (comboitem.precio * comboitem.cantidad)
            }
            
            return total.toFixed(10)
        },

        is_presupuestoActive_complete_total ( state ) {
            for ( let item of state.presupuestoActive.items ) {
                if ( item.is_stock_unitario_variable ) {
                    return false
                }
            }
            return true
        },

    },
    mutations: {
        ADD_PRESUPUESTO(state, presupuesto) {
            state.presupuestos.push(presupuesto)
        },
        REMOVE_PRESUPUESTO(state, presupuesto_id) {
            state.presupuestos = state.presupuestos.filter(item => item.id !== presupuesto_id)
        },
        SET_PRESUPUESTO_ACTIVE( state, presupuesto ) {
            state.presupuestoActive = presupuesto
        },

        SET_CLIENT_PRESUPUESTO_ACTIVE(state, client) {
            state.presupuestoActive.client = client
        },

        ADD_ITEM(state, item) {
            state.presupuestoActive.items.push(item)
        },

        REMOVE_ITEM(state, id) {
            state.presupuestoActive.items = state.presupuestoActive.items.filter((e) => {
                return e.saleProductId !== id
            })
        },

        ADD_COMBO_ITEM(state, item) {
            state.presupuestoActive.comboitems.push(item)
        },

        REMOVE_COMBO_ITEM(state, id) {
            state.presupuestoActive.comboitems = state.presupuestoActive.comboitems.filter((e) => {
                return e.comboId !== id
            })
        },


        SET_PRESUPUESTOS(state, payload) {
            state.presupuestos = payload
        },
    },
    actions: {
        set_presupuestos ( {commit }, payload ) {
            commit('SET_PRESUPUESTOS', payload)
            commit('SET_PREUPUESTO_ACTIVE', null)
        },

        set_presupuesto_active( { commit, state }, presupuesto_id) {
            for (const x of state.presupuestos) {
                if ( x.id == presupuesto_id ) {
                    commit('SET_PRESUPUESTO_ACTIVE', x)
                }
            }
        },
        new_presupuesto( { commit }) {
            let presupuesto = {
                id: Math.floor(Math.random() * 100000) +1,
                items: [],
                comboitems: [],
                client: null,
            }
            commit('ADD_PRESUPUESTO', presupuesto)
            commit('SET_PRESUPUESTO_ACTIVE', presupuesto)
            return presupuesto
        },
        remove_presupuesto( { commit }, presupuesto_id ) {
            commit('REMOVE_PRESUPUESTO', presupuesto_id)
        },

        set_client_presupuesto_active( { commit }, client) {
            commit('SET_CLIENT_PRESUPUESTO_ACTIVE', client)
        },


        add_item( { commit }, item) {
            commit('ADD_ITEM', item)
        },

        remove_item( { commit }, id) {
            commit('REMOVE_ITEM', id)
        },

        add_combo_item( { commit }, item) {
            commit('ADD_COMBO_ITEM', item)
        },
        remove_combo_item( { commit }, id) {
            commit('REMOVE_COMBO_ITEM', id)
        },
        
    }
}
