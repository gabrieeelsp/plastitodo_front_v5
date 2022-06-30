<template>
  <v-menu left bottom offset-y >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn text  v-bind="attrs" v-on="on" v-if="sucursal" >
                           Sucursal - {{ sucursal.name }}
                        
                    </v-btn>
                    </template>

                    <v-list dense>
                        <v-list-item                           
                            
                        >
                            <v-list-item-icon class="mr-1">
                                <v-icon small >mdi-crop</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content >
                                <v-list-item-title >Info</v-list-item-title>
                            </v-list-item-content>
                            
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item

                            @click="remove_sucursal_button"
                            class=""
                        >
                            
                            <v-list-item-icon class="mr-1">
                                <v-icon small >mdi-logout</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content >
                                <v-list-item-title >Cambiar de Sucursal</v-list-item-title>
                            </v-list-item-content>
                            
                        </v-list-item>
                        
                        
                        
                    </v-list>
                </v-menu>
</template>

<script>
import {  mapActions } from 'vuex'
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters({
            sucursal: 'sucursals_manager/sucursal'
        })
    },
    methods: {
        ...mapActions({
            set_sucursal: 'sucursals_manager/set_sucursal'
        }),

        remove_sucursal_button () {  
            this.set_sucursal(null)          
            this.$router.replace({
                name: 'sucursal_selector'
            })          
        }
    }
}
</script>

<style>

</style>