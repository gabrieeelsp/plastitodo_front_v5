import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import sucursals_manager from './sucursals_manager'
import paymentMethods_manager from './paymentMethods_manager'
import sales_manager from './sales_manager'
import cajas_manager from './cajas_manager'
import ivaaliquots_manager from './ivaaliquots_manager'
import modelofacts_manager from './modelofacts_manager'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    sucursals_manager,
    paymentMethods_manager,
    sales_manager,
    cajas_manager,
    ivaaliquots_manager,
    modelofacts_manager
  }
})
