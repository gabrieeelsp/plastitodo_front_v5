<template>
    <div v-if="user">
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

            <v-list-item :disabled="!disabled" :to="link" v-for="([title, link, exact, disabled], i) of almacen" :key="i" :exact="exact" >
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

            <v-list-item :disabled="!disabled" :to="link" v-for="([title, link, exact, disabled], i) of ventas" :key="i" :exact="exact" >
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

            <v-list-item :disabled="!disabled" :to="link" v-for="([title, link, exact, disabled], i) of compras" :key="i" :exact="exact" >
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

            <v-list-item :disabled="!disabled" :to="link" v-for="([title, link, exact, disabled], i) of sucursales" :key="i" :exact="exact" >
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

            <v-list-item :disabled="!disabled" :to="link" v-for="([title, link, exact, disabled], i) of empresa" :key="i" :exact="exact" >
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
        

        

        logo_nophoto: require('@/assets/nophoto.jpg'),
    }),

    computed: {
        ...mapGetters({
            authenticated: 'auth/authenticated',
            user: 'auth/user',
            caja: 'caja/caja'
        }),

        almacen () { 
            return [
                ['Familias', '/admin/familias', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Productos Stock', '/admin/stockproducts', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Grupos Productos Stock', '/admin/stockproductgroups', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Stock Sucursales', '/admin/stocksucursals', false, true],
            ]
        },

        ventas (){
            return [
                ['Editor de Ventas', '/admin/sales/sale_register', false, true],
                ['Gestión de Ventas', '/admin/sales/manager', false, true],
                ['Editor de Pedidos', '/admin/orders/order_register', false, true],
                ['Gestión de Pedidos', '/admin/orders', true, true],
                ['Editor de Presupuestos', '/admin/presupuestos/presupuesto_register', false, true],
                ['Abrir/Cerrar Caja', '/admin/cajas/caja', false, true],
                ['Pagos Recibidos', '/admin/payments', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Reintegros Emitidos', '/admin/refunds', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Productos Venta', '/admin/saleproducts', false, true],
                ['Grupos Productos Venta', '/admin/saleproductgroups', false, this.user.role == 'VENDEDOR' || this.user.role == 'RESPONSABLE SUCURSAL' ? false : true],
                ['Productos Combo', '/admin/combos', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Gestión de Clientes', '/admin/clients', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Catálogos', '/admin/sales_catalogos', false, this.user.role == 'VENDEDOR' ? false : true],

            ]
        },
        compras () {
            return [
                ['Proveedores', '/admin/suppliers', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Ordenes de Compra', '/admin/purchaseorders', false, this.user.role == 'VENDEDOR' ? false : true],
            ]
        },
        sucursales () {
            return [
                ['Sucursales', '/admin/sucursals', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Movimientos de Stock', '/admin/stockmovements', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Transferencias de Stock', '/admin/stocktransfers', false, this.user.role == 'VENDEDOR' ? false : true],
            ]
        },

        empresa () { 
            return [
                ['Usuarios', '/admin/users', false, this.user.role == 'VENDEDOR' || this.user.role == 'RESPONSABLE SUCURSAL' ? false : true],
                ['Etiquetas', '/admin/tags', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Catálogos', '/admin/catalogos', false, this.user.role == 'VENDEDOR' ? false : true],
                ['Cajas', '/admin/cajas', true, true],
            ]
        },

        almacen_open () {
            for ( let url of this.almacen ) {
                if (this.$route.path.startsWith(url[1])) {
                    return true
                }
            }
            return false
        },
        ventas_open () {
            for ( let url of this.ventas ) {
                if (this.$route.path.startsWith(url[1])) {
                    return true
                }
            }
            return false
        },
        compras_open () {
            for ( let url of this.compras ) {
                if (this.$route.path.startsWith(url[1])) {
                    return true
                }
            }
            return false
        },
        sucursales_open () {
            for ( let url of this.sucursales ) {
                if (this.$route.path.startsWith(url[1])) {
                    return true
                }
            }
            return false
        },
        empresa_open () {
            for ( let url of this.empresa ) {
                if (this.$route.path.startsWith(url[1])) {
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