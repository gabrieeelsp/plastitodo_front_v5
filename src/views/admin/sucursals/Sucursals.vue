<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light">Gestión de Sucursales</span>
                        <v-btn small color="success" @click="nuevo_item" >Nuevo</v-btn>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <List 
                                      
                        />
                        
                    </v-card-text>
                </v-card>
            </v-col>
            
        </v-row>
        
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import List from '@/components/admin/sucursals/List'
export default {

    components: {
        List
    },
    data () {
        return {

        }
    },
    computed: {
        ...mapGetters({
            items: 'sucursals_manager/items',
            list_meta: 'sucursals_manager/list_meta',
            reload_items: 'sucursals_manager/reload_items',
        })
    },
    methods: {
        ...mapActions({
            buscar_items: 'sucursals_manager/buscar_items',
            set_items: 'sucursals_manager/set_items',

            set_item: 'sucursals_manager/set_item',
            set_reload_items: 'sucursals_manager/set_reload_items',
        }),
        nuevo_item () {
            this.$router.push({
                name: 'sucursal_create',
            })
        }
    }
}
</script>

<style>

</style>