import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import Toast from "vue-toastification";

import './utils/filters'
import './utils/helpers'

import "vue-toastification/dist/index.css";
const options = {
  // You can set your default options here
  position: "top-right",
  timeout: 13786,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: false,
  draggablePercent: 0.75,
  showCloseButtonOnHover: true,
  hideProgressBar: true,
  closeButton: "button",
  icon: true,
  rtl: false,

  // global Options --- BEGIN ---
  transition: "Vue-Toastification__fade",
  maxToasts: 20,
  newestOnTop: true
  // global Options --- END ---
};

Vue.use(Toast, options);

require('@/store/subscriber')

axios.defaults.baseURL = 'http://localhost:8000/api/v1'

Vue.config.productionTip = false

store.dispatch('auth/attempt', localStorage.getItem('token')).then(() => {
  store.dispatch('sucursals_manager/set_sucursal', JSON.parse(localStorage.getItem('sucursal')))
  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')
})
