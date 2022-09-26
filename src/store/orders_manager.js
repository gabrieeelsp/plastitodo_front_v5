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
            sucursal_id: null
        },
        filters: {
            state: null,
            client_id: null ,
            sucursal_id: null,
            is_delivery: null,
        },
        list_meta: {
            select_limit_items: [5, 10, 15, 20],
            page: 1,
            limit: 5,
            last_page: 1,
        },
        colors_state: [
            {state: 'EDITANDO', color: 'cyan'},
            {state: 'FINALIZADO', color: 'blue'},
            {state: 'CONFIRMADO', color: 'brown'},
            {state: 'EN PREPARACION', color: 'orange'},
            {state: 'PREPARADO', color: 'indigo'},
            {state: 'FACTURADO', color: 'teal'},
            {state: 'EN DISTRIBUCION', color: 'red'},
            {state: 'ENTREGADO', color: 'green'},
        ],
    },
    getters: {
        color_state: (state) => (estado) => {
            return state.colors_state.find(item => item.state === estado).color
        },
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

        is_order_complete_total ( state ) {
            for ( let item of state.item.relationships.orderitems ) {
                if ( item.relationships.saleproduct.relationships.stockproduct.attributes.is_stock_unitario_variable && ( Number(item.attributes.cantidad_total) == 0 ) ) {
                    return false
                }
            }
            return true
        },

        cantItemsOrder (state) {
            return state.item.relationships.orderitems.length + state.item.relationships.ordercomboitems.length
        },

        totalOrder: () => (order) => {
            let total = 0
            for ( let item of order.relationships.orderitems) {
                if( item.relationships.saleproduct.relationships.stockproduct.attributes.is_stock_unitario_variable ) {
                    if ( Number(item.attributes.cantidad_total) != 0 ) {
                        total = total + (item.attributes.precio * item.attributes.cantidad_total)
                    }else {
                        //console.log(item.stock_aproximado_unidad)
                        total = total + (item.attributes.precio * item.attributes.cantidad * Number(item.relationships.saleproduct.relationships.stockproduct.attributes.stock_aproximado_unidad))
                    }
                    
                }else {
                    total = total + (item.attributes.precio * item.attributes.cantidad)
                }                
            }
            
            for ( let comboitem of order.relationships.ordercomboitems ) {
                total = total + (comboitem.attributes.precio * comboitem.attributes.cantidad)
            }
            
            return total.toFixed(10)
        },

        is_order_active_complete_total: ( ) => (order) => {
            for ( let item of order.relationships.orderitems ) {
                if ( item.relationships.saleproduct.relationships.stockproduct.attributes.is_stock_unitario_variable && ( Number(item.attributes.cantidad_total) == 0 ) ) {
                    return false
                }
            }
            return true
        },

        
    },
    mutations: {
        SET_ITEMS (state, payload) {
            state.items = payload
        },
        SET_ITEM (state, payload) {
            state.item = payload
            if ( payload && payload.relationships.sucursal ) {
                state.ids_select.sucursal_id = payload.relationships.sucursal.id
            }
            
        },
        SET_ITEM_CACHE (state, payload) {
            state.item_cache = payload
        },
        SET_ITEM_CACHE_NEW (state, payload) {
            state.item_cache_new = payload
        },
        SET_RELOAD_ITEMS (state, payload) {
            state.reload_items = payload
        },
        ADD_ITEM ( state, payload ) {
            state.items.unshift(payload)
        },

        UPDATE_STATE_ITEM ( state, payload ) {
            for ( let order of state.items ) {
                if ( order.id == payload.id ) {
                    order.attributes.state = payload.state
                }
            }            
        } 
    },
    actions: {
        item_new (_, payload) {
            return axios.post('/orders', payload)
        },
        set_reload_items({commit}, payload) {
            commit('SET_RELOAD_ITEMS', payload)
        },

        store_item_new( { state } ) {
            let data = {
                type: 'orders',
                attributes: {
                    name: state.item_cache_new.name,
                    direccion: state.item_cache_new.direccion,
                    telefono: state.item_cache_new.telefono,
                    telefono_movil: state.item_cache_new.telefono_movil,
                    email: state.item_cache_new.email,
                },
            }

            return axios.post('orders', {                
                data: data 
            })
        },
        buscar_items({state}) {
            return axios.get('/orders', {
                params: {
                    limit: state.list_meta.limit,
                    page: state.list_meta.page,
                    state: state.filters.state,
                    client_id: state.filters.client_id,
                    sucursal_id: state.filters.sucursal_id,
                    is_delivery: state.filters.is_delivery,
                }
            })
        },        

        buscar_item_distribucion(_, payload) {
            return axios.get('/orders/get_orders_distribucion', {
                params: {
                    sucursal_id: payload.sucursal_id,
                    deliveryshift_id: payload.deliveryshift_id,
                }
            })
        },

        buscar_item(_, id) {
            return axios.get(`/orders/${id}`)
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

        add_item( { commit }, payload ) {
            commit('ADD_ITEM', payload)
        },


        update_state_item ( { commit }, payload ) {
            commit('UPDATE_STATE_ITEM', payload)
        },

        async save_item( { getters }, payload) {
            

            let json_order = {
                evento: payload.evento,
                
            }
            json_order['ivacondition_id'] = payload.ivacondition_id
            json_order['sucursal_id'] = payload.sucursal_id
            json_order['deliveryshift_id'] = payload.deliveryshift_id
            json_order['fecha_entrega_acordada'] = payload.fecha_entrega_acordada
            json_order['is_delivery'] = payload.is_delivery

            if ( payload.evento == 'FACTURAR' ) {
                for ( let order of getters.items ) {
                    if ( order.id == payload.id ) {
                        json_order['total'] = getters.totalOrder(order)
                        break
                    }
                }
                
            }
            
            return axios.put(`/orders/${payload.id}`, json_order);

            //remover saleActive
        },
        
    }
}