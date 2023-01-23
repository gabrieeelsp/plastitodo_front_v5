<template>
    <div>
        <div v-if="!show_init_admin">

        <v-navigation-drawer v-model="drawer" app>
            <Menu />  
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
      v-model="show_init_admin"
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
import Menu from '@/components/admin/utils/Menu.vue'
import MenuUser from '@/components/admin/utils/MenuUser'
import MenuSucursal from '@/components/admin/utils/MenuSucursal'

import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'

export default {
    computed: {
        ...mapGetters({
            show_init_admin: 'show_init_admin'
        })
    },
    created() {
        this.init()

    },
    data: () => ({
        drawer: true,
    }),
    components: {
        MenuUser,
        MenuSucursal,
        Menu
    },

    methods: {
        ...mapActions({
            //buscar_paymentMethods: 'paymentMethods_manager/buscar_paymentMethods',
            set_paymentMethods: 'paymentMethods_manager/set_paymentMethods',

            //buscar_ivaaliquots: 'ivaaliquots_manager/buscar_ivaaliquots',
            set_ivaaliquots: 'ivaaliquots_manager/set_ivaaliquots',

            //buscar_modelofacts: 'modelofacts_manager/buscar_modelofacts',
            set_modelofacts: 'modelofacts_manager/set_modelofacts',

            buscar_caja: 'cajas_manager/buscar_caja',
            set_caja: 'cajas_manager/set_caja',

            //buscar_ivaconditions: 'ivaconditions_manager/buscar_ivaconditions',
            set_ivaconditions: 'ivaconditions_manager/set_ivaconditions',

            //buscar_doctypes: 'doctypes_manager/buscar_doctypes',
            set_doctypes: 'doctypes_manager/set_doctypes',

            //buscar_sucursals: 'sucursals_manager/buscar_sucursals',
            set_sucursals: 'sucursals_manager/set_sucursals',

            //buscar_valors: 'valors_manager/buscar_valors',
            set_valors: 'valors_manager/set_valors',

            //buscar_deliveryshifts: 'deliveryshifts_manager/buscar_deliveryshifts',
            set_deliveryshifts: 'deliveryshifts_manager/set_deliveryshifts', 

            //buscar_empresa: 'buscar_empresa',
            set_empresa: 'set_empresa',

            set_show_init_admin: 'set_show_init_admin',
        }),
        async init () {
            this.set_show_init_admin (true)

            this.get_inicio_data()




            /* await this.buscar_paymentMethods()
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

            await this.buscar_ivaconditions()
                .then((resp) => {
                    this.set_ivaconditions(resp.data.data)

                }).catch((error) => {
                    console.log(error)
                })
                
            await this.buscar_doctypes()
                .then((resp) => {
                    this.set_doctypes(resp.data.data)

                }).catch((error) => {
                    console.log(error)
                })

            await this.buscar_sucursals()
                .then((resp) => {
                    this.set_sucursals(resp.data.data)

                }).catch((error) => {
                    console.log(error)
                })

            await this.buscar_valors()
                .then((resp) => {
                    this.set_valors(resp.data.data)

                }).catch((error) => {
                    console.log(error)
                })
            
            await this.buscar_deliveryshifts()
                .then((resp) => {
                    this.set_deliveryshifts(resp.data.data)

                }).catch((error) => {
                    console.log(error)
                }) */

            await this.buscar_caja()
                .then((resp) => {
                    this.set_caja(resp.data.data)
                }).catch(() => {
                    //console.log(error)
                })

            /* await this.buscar_empresa()
                .then((resp) => {
                    this.set_empresa(resp.data.data)
                }).catch((error) => {
                    console.log(error)
                }) */

            this.set_show_init_admin (false)
            
            
        },

        async get_inicio_data ( ) {
            await axios.get('inicio_data')
                .then((resp) => {
                    this.set_paymentMethods(resp.data.data.paymentMethods)
                    this.set_ivaaliquots(resp.data.data.ivaaliquots)
                    this.set_modelofacts(resp.data.data.modelofacts)
                    this.set_ivaconditions(resp.data.data.ivaconditions)
                    this.set_doctypes(resp.data.data.doctypes)
                    this.set_sucursals(resp.data.data.sucursals)
                    this.set_valors(resp.data.data.valors)
                    this.set_deliveryshifts(resp.data.data.deliveryshifts)
                    this.set_empresa(resp.data.data.empresa)
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }
}
</script>

<style>

</style>