import axios from 'axios'

export default {
    namespaced: true,
    state: {
        orders: [],
        orderActive: null,
    },
    getters: {
        orders (state) {
            return state.orders
        },
        orderActive (state) {
            return state.orderActive
        },
        cantItemsOrderActive (state) {
            return state.orderActive.items.length + state.orderActive.comboitems.length
        },
        is_orderActive_ok_to_save (state) {
            for ( let comboitem of state.orderActive.comboitems ) {
                if ( !comboitem.is_complete() ) {
                    return false
                }
            }
            if ( state.orderActive.items.length + state.orderActive.comboitems.length == 0 ) {
                return false
            }
            if ( !state.orderActive.client ) {
                return false
            }
            return true
        },

        is_order_active_complete_total ( state ) {
            for ( let item of state.orderActive.items ) {
                if ( item.is_stock_unitario_variable && ( Number(item.cantidad_total) == 0 ) ) {
                    return false
                }
            }
            return true
        },


        totalOrderActive (state) {
            let total = 0
            for ( let item of state.orderActive.items) {
                if( item.is_stock_unitario_variable ) {
                    if ( Number(item.cantidad_total) != 0 ) {
                        total = total + (item.precio * item.cantidad_total)
                    }else {
                        //console.log(item.stock_aproximado_unidad)
                        total = total + (item.precio * item.cantidad * Number(item.stock_aproximado_unidad))
                    }
                    
                }else {
                    total = total + (item.precio * item.cantidad)
                }                
            }

            for ( let comboitem of state.orderActive.comboitems ) {
                total = total + (comboitem.precio * comboitem.cantidad)
            }
            
            return total.toFixed(10)
        },

        is_orderActiveStockUnitarioVariable(state) {

            for ( let item of state.orderActive.items) {
                if( item.is_stock_unitario_variable ) {
                    return true
                }
            }
            return false
        },
        ivaconditions_select ( state, _, rootState ) {
            let ivaconditions = [{
                id: 0,
                name: ''
            }]

            for ( let ivacondition_item of rootState.ivaconditions_manager.ivaconditions ) {
                if ( ivacondition_item.id == 3 ) {
                    ivaconditions.push({
                        id: ivacondition_item.id,
                        name: ivacondition_item.attributes.name
                    })
                    break
                }
            }
            if ( state.orderActive.client && state.orderActive.client.ivacondition.id != 3 ) {
                for ( let ivacondition_item of rootState.ivaconditions_manager.ivaconditions ) {
                    if ( ivacondition_item.id == state.orderActive.client.ivacondition.id ) {
                        ivaconditions.push({
                            id: ivacondition_item.id,
                            name: ivacondition_item.attributes.name
                        })
                        break
                    }
                }
            }

            return ivaconditions
        },

    },
    mutations: {
        ADD_ORDER(state, order) {
            state.orders.push(order)
        },
        REMOVE_ORDER(state, order_id) {
            state.orders = state.orders.filter(item => item.id !== order_id)
        },
        SET_ORDER_ACTIVE( state, order ) {
            state.orderActive = order
        },

        SET_CLIENT_ORDER_ACTIVE(state, client) {
            state.orderActive.client = client
            if ( client.is_fact_default ) {
                state.orderActive.ivacondition_id = client.ivacondition.id
            }
        },

        SET_MODELOFACT( state, payload ) {
            state.orderActive.modelofact_id = payload
        },

        ADD_ITEM(state, item) {
            state.orderActive.items.push(item)
        },

        REMOVE_ITEM(state, id) {
            state.orderActive.items = state.orderActive.items.filter((e) => {
                return e.saleProductId !== id
            })
        },

        ADD_COMBO_ITEM(state, item) {
            state.orderActive.comboitems.push(item)
        },

        REMOVE_COMBO_ITEM(state, id) {
            state.orderActive.comboitems = state.orderActive.comboitems.filter((e) => {
                return e.comboId !== id
            })
        },

        SET_ORDERS(state, payload) {
            state.orders = payload
        },
    },
    actions: {
        set_orders ( {commit }, payload ) {
            commit('SET_ORDERS', payload)
            commit('SET_ORDER_ACTIVE', null)
        },

        set_order_active( { commit, state }, order_id) {
            for (const x of state.orders) {
                if ( x.id == order_id ) {
                    commit('SET_ORDER_ACTIVE', x)
                }
            }
        },
        new_order( { commit }) {
            let order = {
                id: Math.floor(Math.random() * 100000) +1,
                is_new: true,
                items: [],
                comboitems: [],
                client: null,
                ivacondition_id: 0,
                sucursal_id: null,
                deliveryshift_id: null,
                is_delivery: false,
                fecha_entrega_acordada: null,
                state: 'EDITANDO',
                user: null,
                sale: null
            }
            commit('ADD_ORDER', order)
            commit('SET_ORDER_ACTIVE', order)
            return order
        },
        remove_order( { commit }, order_id ) {
            commit('REMOVE_ORDER', order_id)
        },

        set_client_order_active( { commit }, client) {
            commit('SET_CLIENT_ORDER_ACTIVE', client)
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
        auto_set_is_incluir_datos_order_active ( {getters}) {
			if ( getters.orderActive.ivacondition_id != 3 && getters.orderActive.ivacondition_id != 0 ) {
				getters.orderActive.is_incluir_datos = true		
			}else {
                getters.orderActive.is_incluir_datos = false		
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


        async save_orderActive({ state, getters }, evento) {

            let json_items = []

            for (var item of state.orderActive.items) {

                json_items.push({
                    saleproduct_id: item.saleProductId,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    cantidad_total: item.cantidad_total, 
                    is_prepared: item.is_prepared                                        
                })
            }

            
            let json_comboitems = []
            for ( let comboitem of state.orderActive.comboitems ) {
                let json_itemcombos = []

                for ( let itemcombo of comboitem.comboItems ) {
                    let json_saleproducts = []
                    for ( let saleproduct of itemcombo.saleproducts ) {
                        if ( saleproduct.cantidad > 0 ) {
                            json_saleproducts.push({
                                saleproduct_id: saleproduct.saleproductId,
                                cantidad: saleproduct.cantidad,
                                is_prepared: saleproduct.is_prepared 
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

            let json_order = {
                items: json_items,
                comboitems: json_comboitems,
                is_delivery: getters.orderActive.is_delivery,
                evento: evento,
            }
            

            if( state.orderActive.client != null ) {
                json_order['client_id'] = state.orderActive.client.id
            }

            if( state.orderActive.fecha_entrega_acordada != null ) {
                json_order['fecha_entrega_acordada'] = state.orderActive.fecha_entrega_acordada
            }

            if( state.orderActive.deliveryshift_id != null ) {
                json_order['deliveryshift_id'] = state.orderActive.deliveryshift_id
            }

            if( state.orderActive.sucursal_id != null ) {
                json_order['sucursal_id'] = state.orderActive.sucursal_id
            }

            if( state.orderActive.ivacondition_id != 0 ) {
                json_order['ivacondition_id'] = state.orderActive.ivacondition_id
            }            

            json_order['total'] = getters.totalOrderActive

            if ( getters.orderActive.is_new ) {
                return axios.post('/orders', json_order);
            }
            
            return axios.put(`/orders/${getters.orderActive.id}`, json_order);

            //remover saleActive
        },

        async update_precios ( {getters}, payload ) {
            return await axios.put(`orders/${getters.orderActive.id}/update_precios`,{
                data: {
                    items: payload.filter((i) => {
                        return i.actualizar_precio
                    })
                }
            })
        },

        addOrder({commit}, payload ) {

            let items = []
            for ( let orderitem of payload.relationships.orderitems ) {
                let stocksucursals = []
                for ( let stocksucursal of orderitem.relationships.stockproduct.relationships.stocksucursals ) {
                    stocksucursals.push(stocksucursal)
                }

                items.push({
                    saleProductId: orderitem.attributes.saleproduct_id,
                    name: orderitem.attributes.name,
                    precio: orderitem.attributes.precio,
                    stock: 0,
                    cantidad: orderitem.attributes.cantidad,
                    image1: orderitem.attributes.image1,
                    image2: orderitem.attributes.image2,
                    image3: orderitem.attributes.image3,
                    is_editing_cantidad: false,
                    is_editing_precio: false,
                    is_stock_unitario_variable: orderitem.attributes.is_stock_unitario_variable,
                    stock_aproximado_unidad: orderitem.attributes.stock_aproximado_unidad,
                    cantidad_total: orderitem.attributes.cantidad_total,
                    is_editing_cantidad_total: orderitem.attributes.is_editing_cantidad_total,
                    is_prepared: orderitem.attributes.is_prepared,

                    relacion_venta_stock: orderitem.attributes.relacion_venta_stock,
                    relationships: {
                        stockproduct: {
                            relationships: {
                                stocksucursals: stocksucursals
                            }
                        }
                    }
                })
            }

            let json_comboitems = []

            //console.log(payload.relationships.ordercomboitems)
            for ( let ordercomboitem of payload.relationships.ordercomboitems ) {
                let combo = ordercomboitem.relationships.combo
                let comboItems = []
                for ( let itemCombo of combo.relationships.comboitems ) {
                    let saleproducts = []


                    for ( let saleproduct of itemCombo.relationships.saleproducts ) {
                        if ( saleproduct.attributes.is_enable ) {
                            let cantidad = 0
                            let is_prepared = false

                            //asigno la cantidad que ya estaba pedida
                            for ( let saleproduct_pedido of ordercomboitem.relationships.ordercombosaleproducts ) {
                                if ( saleproduct_pedido.relationships.saleproduct.id == saleproduct.id ) {
                                    cantidad = saleproduct_pedido.attributes.cantidad
                                    is_prepared = saleproduct_pedido.attributes.is_prepared
                                }
                            }

                            let stocksucursals = []
                            for ( let stocksucursal of saleproduct.relationships.stockproduct.relationships.stocksucursals ) {
                                stocksucursals.push(stocksucursal)
                            }

                            
                            let var_sale = {
                                saleproductId: saleproduct.id,
                                name: saleproduct.attributes.name,
                                cantidad: Number(cantidad),
                                image1: saleproduct.attributes.image1,
                                image2: saleproduct.attributes.image2,
                                image3: saleproduct.attributes.image3,
                                is_editing_cantidad: false,
                                relacion_venta_stock: saleproduct.attributes.relacion_venta_stock,
                                is_prepared: is_prepared,
                                relationships: {
                                    stockproduct: {
                                        relationships: {
                                            stocksucursals: stocksucursals
                                        }
                                    }
                                }
                            }
                            saleproducts.push(var_sale)
                            
                        }                                    
                    }
                    comboItems.push({
                        comboitemId: itemCombo.id,
                        name: itemCombo.attributes.name,
                        cantidad: Number(itemCombo.attributes.cantidad),
                        saleproducts: saleproducts,
                        cantidad_combos: ordercomboitem.attributes.cantidad,
                        is_editing_cantidades: false,
                        is_complete () {
                            let cant = 0
                            for ( let saleproduct of this.saleproducts ) {
                                cant = cant + Number(saleproduct.cantidad)
                            }
                            if ( cant  == Math.ceil(this.cantidad * this.cantidad_combos, 2) ) {
                                return true
                            }
                            return false
                        }
                    })

                    
                }

                json_comboitems.push({
                    comboId: combo.id,
                    name: combo.attributes.name,
                    precio: ordercomboitem.attributes.precio,
                    stock: 0, //this.stock,
                    cantidad: ordercomboitem.attributes.cantidad,
                    image1: combo.attributes.image1,
                    is_editing_cantidad: false,
                    comboItems: comboItems,
                    is_complete () {
                            for ( let item of this.comboItems ) {
                                if ( !item.is_complete() ) {
                                    return false
                                }
                            }
                            return true
                        }
                })


            }


            let ivacondition_id = null
            if ( payload.relationships.ivacondition ) {
                ivacondition_id = payload.relationships.ivacondition.id
            }

            let sucursal_id = null
            if ( payload.relationships.sucursal ) {
                sucursal_id = payload.relationships.sucursal.id
            }

            let deliveryshift_id = null
            if ( payload.relationships.deliveryshift ) {
                deliveryshift_id = payload.relationships.deliveryshift.id
            }

            let client = null
            if ( payload.relationships.client ) {

                let ivacondition = null
                if ( payload.relationships.client.relationships.ivacondition ) {
                    ivacondition = {
                        id: payload.relationships.client.relationships.ivacondition.id,
                        name: payload.relationships.client.relationships.ivacondition.attributes.name,
                    }
                }
                client = {
                    id: payload.relationships.client.id,
                    name: payload.relationships.client.attributes.name,
                    surname: payload.relationships.client.attributes.surname,
                    tipo: payload.relationships.client.attributes.tipo,
                    tipo_persona: payload.relationships.client.attributes.tipo_persona,
                    is_fact_default: payload.relationships.client.attributes.is_fact_default,
                    ivacondition: ivacondition
                }
            }

            let user = null
            if ( payload.relationships.user ) {

                user = {
                    id: payload.relationships.user.id,
                    name: payload.relationships.user.attributes.name,
                    surname: payload.relationships.user.attributes.surname,
                }
            }

            let fecha_entrega_acordada = null
            if ( payload.attributes.fecha_entrega_acordada ) {
                fecha_entrega_acordada = payload.attributes.fecha_entrega_acordada.substring(8, 10) + '-' + payload.attributes.fecha_entrega_acordada.substring(5, 7) + '-' + payload.attributes.fecha_entrega_acordada.substring(0, 4)
            }
            
            let order = {
                id: payload.id,
                is_new: false,
                items: items,
                comboitems: json_comboitems,
                client: client,
                ivacondition_id: ivacondition_id,
                sucursal_id: sucursal_id,
                deliveryshift_id: deliveryshift_id,
                is_delivery: payload.attributes.is_delivery,
                fecha_entrega_acordada: fecha_entrega_acordada,
                state: payload.attributes.state,
                created_at: payload.attributes.created_at,
                user: user,
                deliveryshift: payload.relationships.deliveryshift,
                sale: payload.relationships.sale,
            }

            commit('ADD_ORDER', order)
            commit('SET_ORDER_ACTIVE', order)
        },

        async set_state ( { getters }, state ) {
            return await axios.put(`orders/${getters.orderActive.id}/set_state`,{
                data: {
                    state: state
                }
            })
        }


        
    }


}
