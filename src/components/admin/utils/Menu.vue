<template>
    <div>
        <v-toolbar dark >


            <v-toolbar-title>Plastidodo - ADMIN</v-toolbar-title>

            <v-spacer></v-spacer>
        </v-toolbar>

    
    <v-list>
      <v-list-item>
          <v-list-item-action class="mr-3">
            <v-img height="50" width="50" class="rounded-circle" src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
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
        <v-list-item
          to="/admin"
          exact
        >
          <v-list-item-icon>
            <v-icon >mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin/clients"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Clientes</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin/familias"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Familias</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin/stockproducts"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Productos Stock</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        

        <v-list-item
          to="/admin/stockproductgroups"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Grupos Productos Stock</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin/stocksucursals"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Stock Sucursales</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin/saleproducts"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Productos Venta</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin/saleproductgroups"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Grupos Productos Venta</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        

        <v-list-item
          to="/admin/combos"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Combos</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin/suppliers"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Proveedores</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          to="/admin/purchaseorders"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Ordenes de Compra</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin/cajas/caja"
          exact
        >
          <v-list-item-icon>
            <v-icon >mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Abrir/Cerrar Caja</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
            to="/admin/sales/manager"
            exact
          >
            <v-list-item-icon>
              <v-icon >mdi-view-dashboard</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title >Sale List</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

        <v-list-item
          to="/admin/sales/sale_register"
          exact
        >
          <v-list-item-icon>
            <v-icon >mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Sale Register</v-list-item-title>
          </v-list-item-content>
        </v-list-item>



        <v-list-item
          to="/admin/orders/order_register"
          exact
        >
          <v-list-item-icon>
            <v-icon >mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Order Register</v-list-item-title>
          </v-list-item-content>
        </v-list-item>


      <v-list-item
          to="/admin/orders"
          exact
        >
          <v-list-item-icon>
            <v-icon >mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Order List</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>



      <v-list-item
          to="/admin/sucursals"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Sucursales</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin/stockmovements"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Movimientos de Stock</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin/tags"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Etiquetas</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item
          to="/admin/users"
          
        >
          <v-list-item-icon>
            <v-icon >mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title >Usuarios</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      
    </v-list>
 



    
</div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    data: () => ({
      selectedItem: 1,
      
    }),

    computed: {
      ...mapGetters({
          authenticated: 'auth/authenticated',
          user: 'auth/user',
          caja: 'caja/caja'
      })
    },
  }
</script>

<style>

</style>