import axios from 'axios'

export default {
    namespaced: true,
    state: {
        sales: [],
        saleActive: null
    },
    getters: {
        sales (state) {
            return state.sales
        },
        saleActive (state) {
            return state.saleActive
        },
        cantItemsSaleActive (state) {
            return state.saleActive.items.length + state.saleActive.comboitems.length
        },
        is_saleActive_ok_to_save (state) {
            for ( let comboitem of state.saleActive.comboitems ) {
                if ( !comboitem.is_complete() ) {
                    return false
                }
            }
            if ( state.saleActive.items.length + state.saleActive.comboitems.length == 0 ) {
                return false
            }
            return true
        },
        totalSaleActive (state) {
            let total = 0
            for ( let item of state.saleActive.items) {
                if( item.is_stock_unitario_kilo ) {
                    total = total + (item.precio * item.cantidad_total)
                }else {
                    total = total + (item.precio * item.cantidad)
                }                
            }

            for ( let comboitem of state.saleActive.comboitems ) {
                total = total + (comboitem.precio * comboitem.cantidad)
            }
            
            return total.toFixed(10)
        },
        saldoSaleActive (state, getters) {
            let total = 0
            for ( let item of state.saleActive.payments) {
                total = total + item.valor
            }
            
            return getters.totalSaleActive - total.toFixed(10)
        },


        is_saleActiveStockUnitarioVariable(state) {

            for ( let item of state.saleActive.items) {
                if( item.is_stock_unitario_variable ) {
                    return true
                }
            }
            return false
        }

    },
    mutations: {
        ADD_SALE(state, sale) {
            state.sales.push(sale)
        },
        REMOVE_SALE(state, sale_id) {
            state.sales = state.sales.filter(item => item.id !== sale_id)
        },
        SET_SALE_ACTIVE( state, sale ) {
            state.saleActive = sale
        },
        SET_MODELOFACT( state, payload ) {
            state.saleActive.modelofact_id = payload
        },
        SET_CLIENT_SALE_ACTIVE(state, client) {
            state.saleActive.client = client
        },

        ADD_ITEM(state, item) {
            state.saleActive.items.push(item)
        },

        REMOVE_ITEM(state, id) {
            state.saleActive.items = state.saleActive.items.filter((e) => {
                return e.saleProductId !== id
            })
        },

        ADD_COMBO_ITEM(state, item) {
            state.saleActive.comboitems.push(item)
        },

        REMOVE_COMBO_ITEM(state, id) {
            state.saleActive.comboitems = state.saleActive.comboitems.filter((e) => {
                return e.comboId !== id
            })
        },

        ADD_PAYMENT(state, payment) {
            state.saleActive.payments.push({
                id: Math.floor(Math.random() * 100000) +1,
                paymentmethod_id: payment.paymentmethod_id,
                name: payment.name,
                valor: payment.valor,
                is_editing_valor: false
            })
        },

        REMOVE_PAYMENT(state, id) {
            state.saleActive.payments = state.saleActive.payments.filter((e) => {
                return e.id !== id
            })
        },
    },
    actions: {
        set_sale_active( { commit, state }, sale_id) {
            for (const x of state.sales) {
                if ( x.id == sale_id ) {
                    commit('SET_SALE_ACTIVE', x)
                }
            }
        },
        new_sale( { commit }) {
            let sale = {
                id: Math.floor(Math.random() * 100000) +1,
                items: [],
                comboitems: [],
                payments: [],
                client: null,
                modelofact_id: 0
            }
            commit('ADD_SALE', sale)
            commit('SET_SALE_ACTIVE', sale)
            return sale
        },
        remove_sale( { commit }, sale_id ) {
            commit('REMOVE_SALE', sale_id)
        },

        set_client_sale_active( { commit }, client) {
            commit('SET_CLIENT_SALE_ACTIVE', client)
            if ( client.modelofact ) {
                if ( client.fact_default ) {
                    commit ( 'SET_MODELOFACT', client.modelofact.id )
                }else{
                    commit ( 'SET_MODELOFACT', 0 )
                }
                
            } else {
                commit ( 'SET_MODELOFACT', 0 )
            }
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

        add_payment( { commit }, payment) {
            commit('ADD_PAYMENT', payment)
        },

        remove_payment( { commit }, id) {
            commit('REMOVE_PAYMENT', id)
        },

        async save_saleActive({ state, rootState, getters }) {

            let json_items = []

            for (var item of state.saleActive.items) {

                json_items.push({
                    saleproduct_id: item.saleProductId,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    cantidad_total: item.cantidad_total                                        
                })
            }

            
            let json_comboitems = []
            for ( let comboitem of state.saleActive.comboitems ) {
                let json_itemcombos = []

                for ( let itemcombo of comboitem.comboItems ) {
                    let json_saleproducts = []
                    for ( let saleproduct of itemcombo.saleproducts ) {
                        if ( saleproduct.cantidad > 0 ) {
                            json_saleproducts.push({
                                saleproduct_id: saleproduct.saleproductId,
                                cantidad: saleproduct.cantidad
                            })
                        }
                        
                    }
                    json_itemcombos.push({
                        comboitem_id: itemcombo.comboitemId,
                        saleproducts: json_saleproducts
                    })
                }
                json_comboitems.push({
                    combo_id: comboitem.comboId,
                    precio: comboitem.precio,
                    cantidad: comboitem.cantidad,
                    comboitems: json_itemcombos
                })
            }


            
            let json_payments = []

            for (var payment of state.saleActive.payments) {
                json_payments.push({
                    paymentmethod_id: payment.paymentmethod_id,
                    valor: payment.valor,
                })
            }

            let json_sale = {
                items: json_items,
                total: getters.totalSaleActive,
                sucursal_id: rootState.sucursals_manager.sucursal.id,
                comboitems: json_comboitems
            }
            
            if ( state.saleActive.payments.length != 0 ) { 
                json_sale['caja_id'] = rootState.cajas_manager.caja.id,
                json_sale['payments'] = json_payments
                /* json_sale.push({
                    caja_id: rootState.cajas_manager.caja.id,
                    payments: json_payments,
                }) */
            }

            if( state.saleActive.client != null ) {
                json_sale['client_id'] = state.saleActive.client.id
            }

            
            return axios.post('/sales', json_sale);

            //remover saleActive
        }
        
    }
}
