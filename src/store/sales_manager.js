import axios from 'axios'

export default {
    namespaced: true,
    state: {
        loading: false,
        sales: null,
        list_meta: {
            select_limit_items: [5, 10, 15, 20],
            page: 1,
            limit: 10,
            last_page: 1,
        },
        client: null,
        user: null,

        date_from: null,
        date_to: null,

        sale: null,
        devolution_editing: null,
        creditnote_editing: null,
        debitnote_editing: null
    },
    getters: {
        loading ( state ) {
            return state.loading
        },

        list_meta ( state ) {
            return state.list_meta
        },

        sales ( state ) {
            return state.sales
        },

        client ( state ) {
            return state.client
        },
        client_id ( state ) {
            if (state.client) {
                return state.client.id
            }else {
                return null
            }
        },
        user ( state ) {
            return state.user
        },
        user_id ( state ) {
            if (state.user) {
                return state.user.id
            }else {
                return null
            }
        },
        date_from (state) {
            return state.date_from
        },
        date_to (state) {
            return state.date_to
        },
        sale ( state ) {
            return state.sale
        },
        devolution_editing ( state ) {
            return state.devolution_editing
        },

        is_saleStockUnitario( state ) {
            for ( let item of state.sale.relationships.saleitems) {
                if( item.attributes.is_stock_unitario_variable ) {
                    return true
                }
            }
            return false
        },

        totalPagosSale ( state ) {
            let total = 0
            for ( let item of state.sale.relationships.payments) {
                total = total + Number(item.attributes.valor)
            }
            
            return total.toFixed(10)
        },
        totalRefundsSale ( state ) {
            let total = 0
            for ( let item of state.sale.relationships.refunds) {
                total = total + Number(item.attributes.valor)
            }
            
            return total.toFixed(10)
        },
        
        
        saldoTotalSale ( state ) {
            let total = state.sale.attributes.total
            for ( let devolution of state.sale.relationships.devolutions ) {
                    total = total - Number(devolution.attributes.total)
            }

            for ( let creditnote of state.sale.relationships.creditnotes ) {
                total = total - Number(creditnote.attributes.total)
            }

            for ( let debitnote of state.sale.relationships.debitnotes ) {
                total = Number(total) + Number(debitnote.attributes.total)
            }

            for ( let refund of state.sale.relationships.refunds ) {
                total = total + Number(refund.attributes.valor)
            }

            for ( let payment of state.sale.relationships.payments ) {
                total = total - Number(payment.attributes.valor)
            }
            
            return Number(Number(total).toFixed(10))
        },


        //desactualizado, no se utiliza por el momento
        totalDisponibleCredito ( state ) {
            let total = state.sale.attributes.total
            for ( let devolution of state.sale.relationships.devolutions ) {
                    total = total - Number(devolution.attributes.total)
            }

            for ( let creditnote of state.sale.relationships.creditnotes ) {
                total = total - Number(creditnote.attributes.valor)
            }

            for ( let debitnote of state.sale.relationships.debitnotes ) {
                total = Number(total) + Number(debitnote.attributes.valor)
            }
            
            return Number(Number(total).toFixed(10))
        },

        cantItemsDevolution (state) {
            return state.devolution_editing.devitems.filter((e) => e.is_devolution_item).length + state.devolution_editing.devcomboitems.filter((e) => e.is_devolution_item).length
        },

        totalDevolution (state) {
            let total = 0
            for ( let item of state.devolution_editing.devitems) {
                if ( item.is_devolution_item ){
                    if( item.is_stock_unitario_variable ) {
                        total = total + (item.precio * item.cantidad_total)
                    }else {
                        total = total + (item.precio * item.cantidad)
                    }
                }         
            }
            for ( let comboitem of state.devolution_editing.devcomboitems ) {
                if ( comboitem.is_devolution_item ) {
                    total = total + (comboitem.precio * comboitem.cantidad)
                }
            }
            return total.toFixed(10)
        },

        totalCreditnoteEditing ( state ) {
            let total = 0
            for ( let item of state.creditnote_editing.creditnoteItems ) {
                total = total + item.valor
            }
            return total
        },

        totalDebitnoteEditing ( state ) {
            let total = 0
            for ( let item of state.debitnote_editing.debitnoteItems ) {
                total = total + item.valor
            }
            return total
        },

        creditnote_editing ( state ) {
            return state.creditnote_editing
        },

        debitnote_editing ( state ) {
            return state.debitnote_editing
        },

    },
    mutations: {
        SET_SALES( state, payload) {
            state.sales = payload
        },
        SET_LIST_META( state, payload) {
            state.list_meta = payload
        },

        SET_LIST_META_LIMIT( state, payload) {
            state.list_meta.limit = payload
        },
        SET_CLIENT( state, payload) {
            state.client = payload
        },
        SET_USER( state, payload) {
            state.user = payload
        },
        SET_DATE_FROM( state, payload) {
            state.date_from = payload
            
        },
        SET_DATE_TO( state, payload) {
            state.date_to = payload
        },
        SET_SALE( state, payload) {
            state.sale = payload
        },
        SET_LOADING( state, payload) {
            state.loading = payload
        },
        ADD_PAYMENT ( state, payload ) {
            state.sale.relationships.payments.push(payload)
        },
        UPDATE_PAYMENT ( state, payload ) {
            for ( let payment of state.sale.relationships.payments ) {
                if( payment.id == payload.id ) {
                    payment.attributes.valor = payload.valor
                }
            }  
        },
        REMOVE_PAYMENT ( state, payload ) {
            state.sale.relationships.payments = state.sale.relationships.payments.filter((item) => item.id != payload.id)
        },

        ADD_REFUND ( state, payload ) {
            state.sale.relationships.refunds.push(payload)
        },

        UPDATE_REFUND ( state, payload ) {
            for ( let refund of state.sale.relationships.refunds ) {
                if( refund.id == payload.id ) {
                    refund.attributes.valor = payload.valor
                }
            }  
        },
        REMOVE_REFUND ( state, payload ) {
            state.sale.relationships.refunds = state.sale.relationships.refunds.filter((item) => item.id != payload.id)
        },
        ADD_DEVOLUTION ( state, payload ) {
            state.sale.relationships.devolutions.push(payload)
        },


        SET_DEVOLUTION_EDITING( state , devolution){
            state.devolution_editing = devolution
        },

        SET_CREDITNOTE_EDITING ( state, creditnote ) {
            state.creditnote_editing = creditnote
        },

        ADD_CREDITNOTE ( state, payload ) {
            state.sale.relationships.creditnotes.push(payload)
        },

        SET_DEBITNOTE_EDITING ( state, debitnote ) {
            state.debitnote_editing = debitnote
        },

        ADD_DEBITNOTE ( state, payload ) {
            state.sale.relationships.debitnotes.push(payload)
        },

        SET_COMPROBANTE ( state, payload ) {
            state.sale.relationships.comprobante = payload
            for ( let sale_actual of state.sales ) {
                if ( sale_actual.id == state.sale.id ) {
                    sale_actual.relationships.comprobante = payload
                }
            }
        },
        SET_COMPROBANTE_NC ( state, payload ) {
            for ( let creditnote of state.sale.relationships.creditnotes ) {
                if ( creditnote.id == payload.id ) {
                    creditnote.relationships.comprobante = payload.comprobante
                }
            }
        },
        SET_COMPROBANTE_ND ( state, payload ) {
            for ( let debitnote of state.sale.relationships.debitnotes ) {
                if ( debitnote.id == payload.id ) {
                    debitnote.relationships.comprobante = payload.comprobante
                }
            }
        },
        SET_COMPROBANTE_NC_FROM_DEV ( state, payload ) {
            for ( let devolution of state.sale.relationships.devolutions ) {
                if ( devolution.id == payload.id ) {
                    devolution.relationships.comprobante = payload.comprobante
                }
            }
        },


    },
    actions: {
        set_sales( { commit }, payload) {
            commit('SET_SALES', payload)
        },
        set_list_meta( { commit }, payload) {
            commit('SET_LIST_META', payload)
        },

        async search_sales( state ) {
            return await axios.get('/sales', {
                params: {
                    limit: state.getters.list_meta.limit,
                    page: state.getters.list_meta.page,
                    client_id: state.getters.client_id,
                    user_id: state.getters.user_id,
                    date_from: state.getters.date_from,
                    date_to: state.getters.date_to
                }
            });
        },

        set_list_meta_limt ( { commit }, payload) {
            commit('SET_LIST_META_LIMIT', payload)
        },
        set_client ( { commit }, payload) {
            commit('SET_CLIENT', payload)
        },
        set_user ( { commit }, payload) {
            commit('SET_USER', payload)
        },
        set_date_from ( { commit }, payload) {
            commit('SET_DATE_FROM', payload)
        },
        set_date_to ( { commit }, payload) {
            commit('SET_DATE_TO', payload)
        },
        set_sale ( { commit }, payload) {
            commit('SET_DEVOLUTION_EDITING', null)
            commit('SET_CREDITNOTE_EDITING', null)
            commit('SET_DEBITNOTE_EDITING', null)
            commit('SET_SALE', payload)
        },

        async search_sale( state, id ) {
            return await axios.get(`/sales/${id}`);
        },

        set_loading ( { commit }, payload) {
            commit('SET_LOADING', payload)
        },

        async save_payment ( {  getters, rootState }, payload ) {
            return axios.post('/payments', {
                'data': {
                    'type': 'payments',
                    'attributes': {
                        'valor': payload.attributes.valor,
                        
                    },
                    'relationships': {
                        'paymentmethod': {
                            'data': {
                                'id': payload.relationships.paymentmethod.id
                            }
                        },
                        'caja': {
                            'data': {
                                'id': rootState.cajas_manager.caja.id
                            }
                        },
                        'sale': {
                            'data': {
                                'id': getters.sale.id
                            }
                        },
                    }
                }
            })
        },

        add_payment ( { commit }, payload) {
            commit('ADD_PAYMENT', {
                id: Math.floor(Math.random() * 100000) +1,
                type: 'payments',
                attributes: {
                    valor: payload.valor,
                    name: payload.name,
                    is_confirmed: payload.is_confirmed
                },
                relationships: {
                    paymentmethod: {
                        id: payload.paymentmethod_id
                    }
                }
            })
        },
        update_payment ( {  commit }, payload ) {
            commit ( 'UPDATE_PAYMENT', payload )
        },
        remove_payment ( { commit }, payload ) {
            commit ( 'REMOVE_PAYMENT', payload )
        },
        add_refund ( { commit }, payload) {
            commit('ADD_REFUND', {
                id: Math.floor(Math.random() * 100000) +1,
                type: 'refunds',
                attributes: {
                    valor: payload.valor,
                    name: payload.name,
                    is_confirmed: payload.is_confirmed
                },
                relationships: {
                    paymentmethod: {
                        id: payload.paymentmethod_id
                    }
                }
            })
        },
        async save_refund ( {  getters, rootState }, payload ) {
            return axios.post('/refunds', {
                'data': {
                    'type': 'refunds',
                    'attributes': {
                        'valor': payload.attributes.valor,
                        
                    },
                    'relationships': {
                        'paymentmethod': {
                            'data': {
                                'id': payload.relationships.paymentmethod.id
                            }
                        },
                        'caja': {
                            'data': {
                                'id': rootState.cajas_manager.caja.id
                            }
                        },
                        'sale': {
                            'data': {
                                'id': getters.sale.id
                            }
                        },
                    }
                }
            })
        },
        update_refund ( {  commit }, payload ) {
            commit ( 'UPDATE_REFUND', payload )
        },
        remove_refund ( { commit }, payload ) {
            commit ( 'REMOVE_REFUND', payload )
        },

        async new_devolution( { commit, state } ) {
            await axios.get(`/sales/${state.sale.id}/make_devolution`)
                .then((resp) => {
                    let devitems = []
                    for ( var item of resp.data.devitems ) {
                        let devitem = {
                            saleitem_id: item.saleitem_id,
                            name: item.name,
                            precio: item.precio,
                            is_devolution_item: false,
                            cantidad: item.cant_disponible_devolucion,
                            cant_disponible_devolucion: item.cant_disponible_devolucion,
                            is_stock_unitario_variable: item.is_stock_unitario_variable,
                            is_editing_cantidad: false,
                            cantidad_total: item.cant_total_disponible_devolucion,
                            cant_total_disponible_devolucion: item.cant_total_disponible_devolucion,
                            is_editing_cantidad_total: false,
                        }
                        devitems.push(devitem)
                    }
                    let devcomboitems = []
                    for ( let comboitem of resp.data.devcomboitems ) {
                        let devcombosaleproducts = []
                        for ( let combosaleproduct of comboitem.devcombosaleproducts ){
                            let devcombosaleproduct = {
                                salecombosaleproduct_id: combosaleproduct.salecombosaleproduct_id,
                                name: combosaleproduct.name,
                                cant_disponible_devolucion: combosaleproduct.cant_disponible_devolucion,
                                cantidad: combosaleproduct.cant_disponible_devolucion,
                                is_devolution_item: false,
                                is_editing_cantidad: false,
                            }
                            devcombosaleproducts.push(devcombosaleproduct)
                        }
                        let devcomboitem = {
                            salecomboitem_id: comboitem.salecomboitem_id,
                            name: comboitem.name,
                            precio: comboitem.precio,
                            cantidad: comboitem.cant_disponible_devolucion,
                            cant_disponible_devolucion: comboitem.cant_disponible_devolucion,
                            devcombosaleproducts: devcombosaleproducts,
                            is_devolution_item: false,
                            is_editing_cantidad: false,

                        }
                        devcomboitems.push(devcomboitem)
                    }

                    let devolution = {
                        devitems: devitems,
                        devcomboitems: devcomboitems,
                        is_saved: false
                    }
                    
                    commit('SET_DEVOLUTION_EDITING', devolution)
                    
                })
        },

        async save_devolution({ state, getters, rootState }) {
            let json_items = []
            
            for (var item of state.devolution_editing.devitems) {
                if( item.is_devolution_item ) {
                    json_items.push({
                        saleitem_id: item.saleitem_id,
                        cantidad: item.cantidad,
                        cantidad_total: item.cantidad_total
                                            
                    })
                }
                
            }
            
            let json_comboitems = []

            for ( let comboitem of state.devolution_editing.devcomboitems ) {
                if ( comboitem.is_devolution_item ) {
                    let json_devcombosaleproducts = []
                    for ( let combosaleproduct of comboitem.devcombosaleproducts ) {
                        if ( combosaleproduct.is_devolution_item ) {
                            json_devcombosaleproducts.push({
                                salecombosaleproduct_id: combosaleproduct.salecombosaleproduct_id,
                                cantidad: combosaleproduct.cantidad
                            })
                        }
                    }
                    json_comboitems.push({
                        salecomboitem_id: comboitem.salecomboitem_id,
                        cantidad: comboitem.cantidad,
                        salecombosaleproducts: json_devcombosaleproducts
                    })
                }
            }
            
            let json_devolution = {
                sale_id: getters.sale.id,
                items: json_items,
                total: getters.totalDevolution,
                sucursal_id: rootState.sucursals_manager.sucursal.id,
                comboitems: json_comboitems
            }


            return axios.post('devolutions', json_devolution);
            
            //remover saleActive
        },

        add_devolution ( { commit }, payload ) {            
            commit('ADD_DEVOLUTION', payload)
        },

        set_devolution_editing ( { commit }, payload) {
            commit('SET_DEVOLUTION_EDITING', payload)
        },

        new_creditnote ( {commit, state, rootState} ) {
            let creditnoteItems = []
            for ( let ivaaliquot of rootState.ivaaliquots_manager.ivaaliquots ){
                let add = false
                for ( let saleItem of state.sale.relationships.saleitems ) {
                    if ( saleItem.relationships.ivaaliquot.id == ivaaliquot.id ) {
                        add = true
                        break
                    }
                }
                for ( let salecomboitem of state.sale.relationships.salecomboitems ) {
                    if ( salecomboitem.relationships.ivaaliquot.id == ivaaliquot.id ) {
                        add = true
                        break
                    }
                }
                if ( add ) {
                    creditnoteItems.push({
                        id: Math.floor(Math.random() * 100000) +1,
                        valor: 0,
                        ivaaliquot: ivaaliquot,
                        is_editing: false,
                        is_creditnote_item: false,
                    })
                }
            }
            let creditnote = {
                id: Math.floor(Math.random() * 100000) +1,
                name: '',
                total: 0,
                creditnoteItems: creditnoteItems
            }

            commit('SET_CREDITNOTE_EDITING', creditnote)
        },

        set_creditnote_editing ( { commit }, payload) {
            commit('SET_CREDITNOTE_EDITING', payload)
        },

        async save_creditnote ({ getters, rootState }) {
            
            let items = []
            for ( let item of getters.creditnote_editing.creditnoteItems ) {
                if ( item.is_creditnote_item ) {
                    items.push({
                        valor: item.valor,
                        ivaaliquot_id: item.ivaaliquot.id
                    })
                }
            }
            
            return  await axios.post('/creditnotes', {
                'data': {
                    'type': 'creditnotes',
                    'attributes': {
                        'total': getters.totalCreditnoteEditing,
                        //'description': getters.creditnote_editing.description,
                        
                    },
                    'relationships': {
                        'sucursal': {
                            'data': {
                                'id': rootState.sucursals_manager.sucursal.id
                            }
                        },
                        'sale': {
                            'data': {
                                'id': getters.sale.id
                            }
                        },
                        'creditnoteitems' : items,
                    }
                }
            });

            //remover saleActive
        },

        add_creditnote ( { commit }, payload ) {            
            commit('ADD_CREDITNOTE', payload)
        },


        new_debitnote ( {commit, state, rootState} ) {
            let debitnoteItems = []
            for ( let ivaaliquot of rootState.ivaaliquots_manager.ivaaliquots ){
                let add = false
                for ( let saleItem of state.sale.relationships.saleitems ) {
                    if ( saleItem.relationships.ivaaliquot.id == ivaaliquot.id ) {
                        add = true
                        break
                    }
                }
                for ( let salecomboitem of state.sale.relationships.salecomboitems ) {
                    if ( salecomboitem.relationships.ivaaliquot.id == ivaaliquot.id ) {
                        add = true
                        break
                    }
                }
                if ( add ) {
                    debitnoteItems.push({
                        id: Math.floor(Math.random() * 100000) +1,
                        valor: 0,
                        ivaaliquot: ivaaliquot,
                        is_editing: false,
                        is_debitnote_item: false,
                    })
                }
            }
            let debitnote = {
                id: Math.floor(Math.random() * 100000) +1,
                name: '',
                total: 0,
                debitnoteItems: debitnoteItems
            }

            commit('SET_DEBITNOTE_EDITING', debitnote)
        },

        set_debitnote_editing ( { commit }, payload) {
            commit('SET_DEBITNOTE_EDITING', payload)
        },

        async save_debitnote ({ getters, rootState }) {

            let items = []
            for ( let item of getters.debitnote_editing.debitnoteItems ) {
                if ( item.is_debitnote_item ) {
                    items.push({
                        valor: item.valor,
                        ivaaliquot_id: item.ivaaliquot.id
                    })
                }
            }

            return  await axios.post('/debitnotes', {
                'data': {
                    'type': 'debitnotes',
                    'attributes': {
                        'total': getters.totalDebitnoteEditing,
                        //'description': getters.debitnote_editing.description,
                        
                    },
                    'relationships': {
                        'sucursal': {
                            'data': {
                                'id': rootState.sucursals_manager.sucursal.id
                            }
                        },
                        'sale': {
                            'data': {
                                'id': getters.sale.id
                            }
                        },
                        'debinoteitems' : items,
                    }
                }
            });

            //remover saleActive
        },

        add_debitnote ( { commit }, payload ) {            
            commit('ADD_DEBITNOTE', payload)
        },

        async generate_comprobante ( { getters }, ivacondition_id ) {

            return axios.post('comprobantes/facts', {
                'sale_id': getters.sale.id,
                'ivacondition_id': ivacondition_id
            })
        },
        async generate_comprobante_nc (_, creditnote_id ) {
            return axios.post('comprobantes/nc', {
                'creditnote_id': creditnote_id
            })
        },
        async generate_comprobante_nd (_, debitnote_id ) {
            return axios.post('comprobantes/nd', {
                'debitnote_id': debitnote_id
            })
        },

        async generate_comprobante_nc_from_dev (_, devolution_id ) {
            return axios.post('comprobantes/nc_from_devolution', {
                'devolution_id': devolution_id
            })
        },

        set_comprobante ( { commit }, payload ) {
            commit('SET_COMPROBANTE', payload)
        },
        set_comprobante_nc ( { commit }, payload ) {
            commit('SET_COMPROBANTE_NC', payload)
        },
        set_comprobante_nd ( { commit }, payload ) {
            commit('SET_COMPROBANTE_ND', payload)
        },
        set_comprobante_nc_from_dev ( { commit }, payload ) {
            commit('SET_COMPROBANTE_NC_FROM_DEV', payload)
        }

        
    }
}
