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
        component: () => import(/* webpackChunkName: "sale_manager" */ '../views/admin/sales/Sales_manager.vue'),
      },
      {
        path: 'sales/sale_register',
        name: 'sale_register',
        component: () => import(/* webpackChunkName: "sale_register" */ '../views/admin/sales/Sale_register.vue')
      },
      {
        path: 'clients',
        name: 'clients',
        component: () => import(/* webpackChunkName: "clients" */ '../views/admin/clients/Clients.vue')
      },
      {
        path: 'clients/:id',
        name: 'client',
        component: () => import(/* webpackChunkName: "client" */ '../views/admin/clients/Client.vue')
      },
      {
        path: 'suppliers',
        name: 'suppliers',
        component: () => import(/* webpackChunkName: "suppliers" */ '../views/admin/suppliers/Suppliers.vue')
      },
      {
        path: 'suppliers/:id',
        name: 'supplier',
        component: () => import(/* webpackChunkName: "supplier" */ '../views/admin/suppliers/Supplier.vue')
      },
      {
        path: 'stocksucursals',
        name: 'stocksucursals',
        component: () => import(/* webpackChunkName: "stocksucursals" */ '../views/admin/stocksucursals/Stocksucursals.vue')
      },
      {
        path: 'purchaseorders',
        name: 'purchaseorders',
        component: () => import(/* webpackChunkName: "purchaseorders" */ '../views/admin/purchaseorders/Purchaseorders.vue')
      },
      {
        path: 'purchaseorders/:id',
        name: 'purchaseorder',
        component: () => import(/* webpackChunkName: "purchaseorder" */ '../views/admin/purchaseorders/Purchaseorder.vue')
      },
      {
        path: 'stockproducts',
        name: 'stockproducts',
        component: () => import(/* webpackChunkName: "stockproducts" */ '../views/admin/stockproducts/Stockproducts.vue')
      },
      {
        path: 'stockproducts/create',
        name: 'stockproduct_create',
        component: () => import(/* webpackChunkName: "stockproduct_create" */ '../views/admin/stockproducts/StockproductNew.vue')
      },
      {
        path: 'stockproducts/:id(\\d+)',
        name: 'stockproduct',
        component: () => import(/* webpackChunkName: "stockproduct" */ '../views/admin/stockproducts/Stockproduct.vue')
      },
      {
        path: 'saleproducts',
        name: 'saleproducts',
        component: () => import(/* webpackChunkName: "saleproducts" */ '../views/admin/saleproducts/Saleproducts.vue')
      },
      {
        path: 'saleproducts/:id(\\d+)',
        name: 'saleproduct',
        component: () => import(/* webpackChunkName: "saleproduct" */ '../views/admin/saleproducts/Saleproduct.vue')
      },
      {
        path: 'combos',
        name: 'combos',
        component: () => import(/* webpackChunkName: "combos" */ '../views/admin/combos/Combos.vue')
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
