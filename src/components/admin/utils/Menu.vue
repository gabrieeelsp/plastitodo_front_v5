<template>
    <div>
        <v-toolbar dark >


            <v-toolbar-title>Plastidodo - ADMIN</v-toolbar-title>

            <v-spacer></v-spacer>
        </v-toolbar>

    
    <v-list>
      <v-list-item>
          <v-list-item-action class="mr-3">
            <v-img height="50" width="50" class="rounded-circle" :src="logo_nophoto"></v-img>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="text-subtitle-2">
              {{ user.name }} {{ user.surname }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption mt-1">{{ user.role }}</v-list-item-subtitle>
          </v-list-item-content>

          
        </v-list-item>
    </v-list>
        <v-divider></v-divider>
        
    
      <v-list
        nav
        dense
      >

        <v-list-item-group
            v-model="selectedItem"
            color="primary"
        >
            <v-list-item to="/admin" exact>
                <v-list-item-icon>
                    <v-icon >mdi-widgets</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-list-item-title>Inicio</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list-item-group>



        <v-list-group
            :value="almacen_open"
            prepend-icon="mdi-warehouse"
        >
            <template v-slot:activator>
                <v-list-item-title>Almacén</v-list-item-title>
            </template>            

            <v-list-item :to="link" v-for="([title, link, exact], i) of almacen" :key="i" :exact="exact" >
                <v-list-item-icon>
                    <v-icon color="light-green lighten-3">mdi-apps</v-icon>
                </v-list-item-icon>
                <v-list-item-title >{{ title }}</v-list-item-title>                
            </v-list-item>
        
        </v-list-group>

        <v-list-group
            :value="ventas_open"
            prepend-icon="mdi-point-of-sale"
        >
            <template v-slot:activator>
                <v-list-item-title>Ventas</v-list-item-title>
            </template>            

            <v-list-item :to="link" v-for="([title, link, exact], i) of ventas" :key="i" :exact="exact" >
                <v-list-item-icon>
                    <v-icon color="light-green lighten-3">mdi-apps</v-icon>
                </v-list-item-icon>
                <v-list-item-title >{{ title }}</v-list-item-title>                
            </v-list-item>
        
        </v-list-group>

        <v-list-group
            :value="compras_open"
            prepend-icon="mdi-segment"
        >
            <template v-slot:activator>
                <v-list-item-title>Compras</v-list-item-title>
            </template>            

            <v-list-item :to="link" v-for="([title, link, exact], i) of compras" :key="i" :exact="exact" >
                <v-list-item-icon>
                    <v-icon color="light-green lighten-3">mdi-apps</v-icon>
                </v-list-item-icon>
                <v-list-item-title >{{ title }}</v-list-item-title>                
            </v-list-item>
        
        </v-list-group>

        <v-list-group
            :value="sucursales_open"
            prepend-icon="mdi-store"
        >
            <template v-slot:activator>
                <v-list-item-title>Sucursales</v-list-item-title>
            </template>            

            <v-list-item :to="link" v-for="([title, link, exact], i) of sucursales" :key="i" :exact="exact" >
                <v-list-item-icon>
                    <v-icon color="light-green lighten-3">mdi-apps</v-icon>
                </v-list-item-icon>
                <v-list-item-title >{{ title }}</v-list-item-title>                
            </v-list-item>
        
        </v-list-group>

        <v-divider></v-divider>

        <v-list-group
            :value="empresa_open"
            prepend-icon="mdi-domain"
        >
            <template v-slot:activator>
                <v-list-item-title>Empresa</v-list-item-title>
            </template>            

            <v-list-item :to="link" v-for="([title, link, exact], i) of empresa" :key="i" :exact="exact" >
                <v-list-item-icon>
                    <v-icon color="light-green lighten-3">mdi-apps</v-icon>
                </v-list-item-icon>
                <v-list-item-title >{{ title }}</v-list-item-title>                
            </v-list-item>
        
        </v-list-group>
      
    </v-list>
 



    
</div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data: () => ({
        selectedItem: 1,
        almacen: [
            ['Familias', '/admin/familias', false],
            ['Productos Stock', '/admin/stockproducts', false],
            ['Grupos Productos Stock', '/admin/stockproductgroups', false],
            ['Stock Sucursales', '/admin/stocksucursals', false],
        ],
        ventas: [
            ['Editor de Ventas', '/admin/sales/sale_register', false],
            ['Gestión de Ventas', '/admin/sales/manager', false],
            ['Editor de Pedidos', '/admin/orders/order_register', false],
            ['Gestión de Pedidos', '/admin/orders', true],
            ['Abrir/Cerrar Caja', '/admin/cajas/caja', false],
            ['Pagos Recibidos', '/admin/payments', false],
            ['Reintegros Emitidos', '/admin/refunds', false],
            ['Productos Venta', '/admin/saleproducts', false],
            ['Grupos Productos Venta', '/admin/saleproductgroups', false],
            ['Productos Combo', '/admin/combos', false],
            ['Gestión de Clientes', '/admin/clients', false],

        ],
        compras: [
            ['Proveedores', '/admin/suppliers', false],
            ['Ordenes de Compra', '/admin/purchaseorders', false],
        ],
        sucursales: [
            ['Sucursales', '/admin/sucursals', false],
            ['Movimientos de Stock', '/admin/stockmovements', false],
            ['Transferencias de Stock', '/admin/stocktransfers', false],
        ],

        empresa: [
            ['Usuarios', '/admin/users', false],
            ['Etiquetas', '/admin/tags', false],
            ['Catálogos', '/admin/catalogos', false],
            ['Cajas', '/admin/cajas', false],
        ],

        logo_nophoto: require('@/assets/nophoto.jpg'),
    }),

    computed: {
        ...mapGetters({
            authenticated: 'auth/authenticated',
            user: 'auth/user',
            caja: 'caja/caja'
        }),
        almacen_open () {
            for ( let url of this.almacen ) {
                if (this.$route.path == url[1]) {
                    return true
                }
            }
            return false
        },
        ventas_open () {
            for ( let url of this.ventas ) {
                if (this.$route.path == url[1]) {
                    return true
                }
            }
            return false
        },
        compras_open () {
            for ( let url of this.compras ) {
                if (this.$route.path == url[1]) {
                    return true
                }
            }
            return false
        },
        sucursales_open () {
            for ( let url of this.sucursales ) {
                if (this.$route.path == url[1]) {
                    return true
                }
            }
            return false
        },
        empresa_open () {
            for ( let url of this.empresa ) {
                if (this.$route.path == url[1]) {
                    return true
                }
            }
            return false
        }
    },
  }
</script>

<style>

</style>