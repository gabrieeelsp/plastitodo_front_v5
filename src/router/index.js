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
      if(!store.getters['auth/is_empleado']){
        return next({
          name: 'home'
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
        path: 'orders/order_register',
        name: 'order_register',
        component: () => import(/* webpackChunkName: "order_register" */ '../views/admin/orders/Order_register.vue')
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import(/* webpackChunkName: "orders" */ '../views/admin/orders2/Orders.vue')
      },
      {
        path: 'clients',
        name: 'clients',
        component: () => import(/* webpackChunkName: "clients" */ '../views/admin/clients/Clients.vue')
      },
      {
        path: 'clients/create',
        name: 'client_create',
        component: () => import(/* webpackChunkName: "client_create" */ '../views/admin/clients/ClientNew.vue')
      },
      {
        path: 'clients/:id',
        name: 'client',
        component: () => import(/* webpackChunkName: "client" */ '../views/admin/clients/Client.vue')
      },
      {
        path: 'users',
        name: 'users',
        component: () => import(/* webpackChunkName: "users" */ '../views/admin/users/Users.vue')
      },
      {
        path: 'users/create',
        name: 'user_create',
        component: () => import(/* webpackChunkName: "user_create" */ '../views/admin/users/UserNew.vue')
      },
      {
        path: 'users/:id',
        name: 'user',
        component: () => import(/* webpackChunkName: "user" */ '../views/admin/users/User.vue')
      },
      {
        path: 'familias',
        name: 'familias',
        component: () => import(/* webpackChunkName: "familias" */ '../views/admin/familias/Familias.vue')
      },
      {
        path: 'familias/create',
        name: 'familia_create',
        component: () => import(/* webpackChunkName: "familia_create" */ '../views/admin/familias/FamiliaNew.vue')
      },
      {
        path: 'familias/:id',
        name: 'familia',
        component: () => import(/* webpackChunkName: "familia" */ '../views/admin/familias/Familia.vue')
      },
      {
        path: 'suppliers',
        name: 'suppliers',
        component: () => import(/* webpackChunkName: "suppliers" */ '../views/admin/suppliers/Suppliers.vue')
      },
      {
        path: 'suppliers/create',
        name: 'supplier_create',
        component: () => import(/* webpackChunkName: "supplier_create" */ '../views/admin/suppliers/SupplierNew.vue')
      },
      {
        path: 'suppliers/:id',
        name: 'supplier',
        component: () => import(/* webpackChunkName: "supplier" */ '../views/admin/suppliers/Supplier.vue')
      },
      {
        path: 'tags',
        name: 'tags',
        component: () => import(/* webpackChunkName: "tags" */ '../views/admin/tags/Tags.vue')
      },
      {
        path: 'tags/create',
        name: 'tag_create',
        component: () => import(/* webpackChunkName: "tag_create" */ '../views/admin/tags/TagNew.vue')
      },
      {
        path: 'tags/:id',
        name: 'tag',
        component: () => import(/* webpackChunkName: "tag" */ '../views/admin/tags/Tag.vue')
      },
      {
        path: 'sucursals/:id(\\d+)',
        name: 'sucursal',
        component: () => import(/* webpackChunkName: "sucursal" */ '../views/admin/sucursals/Sucursal.vue')
      },
      {
        path: 'sucursals',
        name: 'sucursals',
        component: () => import(/* webpackChunkName: "sucursals" */ '../views/admin/sucursals/Sucursals.vue')
      },
      {
        path: 'sucursals/create',
        name: 'sucursal_create',
        component: () => import(/* webpackChunkName: "sucursal_create" */ '../views/admin/sucursals/SucursalNew.vue')
      },
      
      {
        path: 'stocksucursals',
        name: 'stocksucursals',
        component: () => import(/* webpackChunkName: "stocksucursals" */ '../views/admin/stocksucursals/Stocksucursals.vue')
      },
      {
        path: 'stockmovements/:id(\\d+)',
        name: 'stockmovement',
        component: () => import(/* webpackChunkName: "stockmovement" */ '../views/admin/stockmovements/Stockmovement.vue')
      },
      {
        path: 'stockmovements',
        name: 'stockmovements',
        component: () => import(/* webpackChunkName: "stockmovements" */ '../views/admin/stockmovements/Stockmovements.vue')
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
        path: 'stockproductgroups',
        name: 'stockproductgroups',
        component: () => import(/* webpackChunkName: "stockproductgroups" */ '../views/admin/stockproductgroups/Stockproductgroups.vue')
      },
      {
        path: 'stockproductgroups/create',
        name: 'stockproductgroup_create',
        component: () => import(/* webpackChunkName: "stockproductgroup_create" */ '../views/admin/stockproductgroups/StockproductgroupNew.vue')
      },
      {
        path: 'stockproductgroups/:id(\\d+)',
        name: 'stockproductgroup',
        component: () => import(/* webpackChunkName: "stockproductgroup" */ '../views/admin/stockproductgroups/Stockproductgroup.vue')
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
        path: 'saleproductgroups',
        name: 'saleproductgroups',
        component: () => import(/* webpackChunkName: "saleproductgroups" */ '../views/admin/saleproductgroups/Saleproductgroups.vue')
      },
      {
        path: 'saleproductgroups/create',
        name: 'saleproductgroup_create',
        component: () => import(/* webpackChunkName: "saleproductgroup_create" */ '../views/admin/saleproductgroups/SaleproductgroupNew.vue')
      },
      {
        path: 'saleproductgroups/:id(\\d+)',
        name: 'saleproductgroup',
        component: () => import(/* webpackChunkName: "saleproductgroup" */ '../views/admin/saleproductgroups/Saleproductgroup.vue')
      },
      {
        path: 'combos',
        name: 'combos',
        component: () => import(/* webpackChunkName: "combos" */ '../views/admin/combos/Combos.vue')
      },
      {
        path: 'combos/create',
        name: 'combo_create',
        component: () => import(/* webpackChunkName: "combo_create" */ '../views/admin/combos/ComboNew.vue')
      },
      {
        path: 'combos/:id(\\d+)',
        name: 'combo',
        component: () => import(/* webpackChunkName: "combo" */ '../views/admin/combos/Combo.vue')
      },

      {
        path: 'cajas/caja',
        name: 'caja',
        component: () => import(/* webpackChunkName: "caja" */ '../views/admin/cajas/OpenCloseCaja.vue')
      },
      
    ],
    beforeEnter: (to, from, next) => {
      if(!store.getters['auth/authenticated']){
        return next({
          name: 'login'
        })
      }
      if(!store.getters['auth/is_empleado']){
        return next({
          name: 'home'
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
