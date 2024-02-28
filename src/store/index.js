import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import sucursals_manager from './sucursals_manager'
import paymentMethods_manager from './paymentMethods_manager'
import sales_manager from './sales_manager'
import cajas_manager from './cajas_manager'
import ivaaliquots_manager from './ivaaliquots_manager'
import modelofacts_manager from './modelofacts_manager'
import sale_manager from './sale_manager'
import clients_manager from './clients_manager'
import ivaconditions_manager from './ivaconditions_manager'
import doctypes_manager from './doctypes_manager'
import stockproducts_manager from './stockproducts_manager'
import saleproducts_manager from './saleproducts_manager'
import combos_manager from './combos_manager'
import suppliers_manager from './suppliers_manager'
import purchaseorders_manager from './purchaseorders_manager'
import stocksucursals_manager from './stocksucursals_manager'
import stockproductgroups_manager from './stockproductgroups_manager'
import saleproductgroups_manager from './saleproductgroups_manager'
import stockmovements_manager from './stockmovements_manager'
import tags_manager from './tags_manager'
import users_manager from './users_manager'
import valors_manager from './valors_manager'
import familias_manager from './familias_manager'
import deliveryshifts_manager from './deliveryshifts_manager'
import order_manager from './order_manager'
import orders_manager from './orders_manager'
import payments_manager from './payments_manager'
import refunds_manager from './refunds_manager'
import stocktransfers_manager from './stocktransfers_manager'
import catalogos_manager from './catalogos_manager'
import presupuestos_manager from './presupuestos_manager'

Vue.use(Vuex)

import axios from 'axios'

export default new Vuex.Store({
    state: {
        init_error: null,
        show_init_admin: null,
        // url_asset: "http://localhost:8000/",
        // url_asset: "https://plastitodo.online:8443/",
        url_asset: "https://plastitodo-prod.backhub.net.ar/",
        empresa: null,
    },
    getters: {
        init_error ( state ) {
            return state.init_error
        },
        show_init_admin ( state ) {
            return state.show_init_admin
        },
        url_asset ( state ) {
            return state.url_asset
        },

        empresa ( state ) {
            return state.empresa
        },
        
    },
    mutations: {
        SET_INIT_ERROR ( state, payload ) {
            state.init_error = payload
        },
        SET_SHOW_INIT_ADMIN ( state, payload ) {
            state.show_init_admin = payload
        },
        SET_EMPRESA ( state, payload ) {
            state.empresa = payload
        }
    },
    actions: {
        set_init_error ( { commit }, payload ) {
            commit('SET_INIT_ERROR', payload)
        },
        set_show_init_admin( { commit }, payload ) {
            commit('SET_SHOW_INIT_ADMIN', payload)
        },

        buscar_empresa () {
            return axios.get('/empresas/1')
        },
        set_empresa( { commit }, payload ) {
            commit('SET_EMPRESA', payload)
        },
    },
    modules: {
        auth,
        sucursals_manager,
        paymentMethods_manager,
        sales_manager,
        cajas_manager,
        ivaaliquots_manager,
        modelofacts_manager,
        sale_manager,
        clients_manager,
        ivaconditions_manager,
        doctypes_manager,
        stockproducts_manager,
        saleproducts_manager,
        combos_manager,
        suppliers_manager,
        purchaseorders_manager,
        stocksucursals_manager,
        stockproductgroups_manager,
        saleproductgroups_manager,
        stockmovements_manager,
        tags_manager,
        users_manager,
        valors_manager,
        familias_manager,
        deliveryshifts_manager,
        order_manager,
        orders_manager,
        payments_manager,
        refunds_manager,
        stocktransfers_manager,
        catalogos_manager,
        presupuestos_manager,
    }
})
