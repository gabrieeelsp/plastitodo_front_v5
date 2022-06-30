<template>
    <div>
        <div v-if="!show_init_loading">

        
        <v-navigation-drawer v-model="drawer" app>
            <span>menu</span>          
        </v-navigation-drawer>

        <v-app-bar app>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
                <v-spacer></v-spacer>
                <MenuSucursal />
                <MenuUser />
                
            <!-- <v-toolbar-title>Application</v-toolbar-title> -->
        </v-app-bar>

        <v-main>
            <v-container fluid class="grey lighten-4 pa-1">
                
                <transition name="fade" mode="out-in">
                    <router-view />
                </transition>
                
            </v-container>
        <v-footer app inset>
            dd
        </v-footer>
        </v-main>
    </div>
        
        
        <div class="text-center">
    
    <v-dialog
      v-model="show_init_loading"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Cargando configuración
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
        
        <!--  -->        
        
        
    </div>
</template>

<script>
import MenuUser from '@/components/admin/utils/MenuUser'
import MenuSucursal from '@/components/admin/utils/MenuSucursal'

import { mapActions } from 'vuex'
export default {
    mounted() {
        this.init()
    },
    data: () => ({
        drawer: null,
        show_admin: false,
        show_init_loading: false,
    }),
    components: {
        MenuUser,
        MenuSucursal
    },

    methods: {
        ...mapActions({
            buscar_paymentMethods: 'paymentMethods_manager/buscar_paymentMethods',
            set_paymentMethods: 'paymentMethods_manager/set_paymentMethods',

            buscar_ivaaliquots: 'ivaaliquots_manager/buscar_ivaaliquots',
            set_ivaaliquots: 'ivaaliquots_manager/set_ivaaliquots',

            buscar_modelofacts: 'modelofacts_manager/buscar_modelofacts',
            set_modelofacts: 'modelofacts_manager/set_modelofacts',

            buscar_caja: 'cajas_manager/buscar_caja',
            set_caja: 'cajas_manager/set_caja',
        }),
        async init () {
            this.show_init_loading = true

            await this.buscar_paymentMethods()
                .then((resp) => {
                    this.set_paymentMethods(resp.data.data)
                    
                }).catch((error) => {
                    console.log(error)
                })
            
            await this.buscar_ivaaliquots()
                .then((resp) => {
                    this.set_ivaaliquots(resp.data.data)
                    
                }).catch((error) => {
                    console.log(error)
                })
            
            await this.buscar_modelofacts()
                .then((resp) => {
                    this.set_modelofacts(resp.data.data)

                }).catch((error) => {
                    console.log(error)
                })

            await this.buscar_caja()
                .then((resp) => {
                    this.set_caja(resp.data.data)
                }).catch((error) => {
                    console.log(error)
                })

            this.show_init_loading = false
            
            
        }
    }
}
</script>

<style>

</style>