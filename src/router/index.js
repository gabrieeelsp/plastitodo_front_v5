import store from '@/store'
import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Admin from '../views/admin/Admin.vue'
import Dashboard from '../views/admin/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('../views/auth/Login.vue'),
    beforeEnter: (to, from, next) => {
      if(store.getters['auth/authenticated']){
        return next({
          name: 'sucursal_selector'
        })
      }
      next()
    }
  },
  {
    path: '/sucursal_selector',
    name: 'sucursal_selector',
    component: () => import('../views/admin/SelectSucursal.vue'),
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated']){
        return next({
          name: 'login'
        })
      }
      if (store.getters['sucursals_manager/is_sucursal_selected']){
        
        return next({
          name: 'dashboard'
        })
      }
      
      next()
    }
  },
  {
    path: '/admin',
    component: Admin,
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard
      },
      {
        path: 'sales/manager',
        name: 'sale_manager',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/sales/Sales_manager.vue'),
      },
      {
        path: 'sales/sale_pdf',
        name: 'sale_pdf',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/sales/Sales_pdf.vue'),
      },
    ],
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated']){
        return next({
          name: 'login'
        })
      }
      if (!store.getters['sucursals_manager/is_sucursal_selected']){
        return next({
          name: 'sucursal_selector'
        })
      }
      next()
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
