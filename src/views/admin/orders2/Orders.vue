<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light">Gestión de Pedidos</span>
                        
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <List 
                            v-if="items"  
                            @getItems="getItems"            
                        />
                        
                    </v-card-text>
                </v-card>
            </v-col>
            
        </v-row>
        
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import List from '@/components/admin/orders2/List'

export default {
    created () {
        this.filters.sucursal_id = this.sucursal.id
        if ( this.items == null || this.reload_items ) {
            this.getItems()
        }
        
    },
    components: {
        List,
        
    },
    data () {
        return {

        }
    },
    computed: {
        ...mapGetters({
            items: 'orders_manager/items',
            list_meta: 'orders_manager/list_meta',
            reload_items: 'orders_manager/reload_items',

            sucursal: 'sucursals_manager/sucursal',
            filters: 'orders_manager/filters',
        })
    },
    methods: {
        ...mapActions({
            buscar_items: 'orders_manager/buscar_items',
            set_items: 'orders_manager/set_items',

            set_item: 'orders_manager/set_item',
            set_reload_items: 'orders_manager/set_reload_items',
        }),
        getItems ( ) {
            this.buscar_items()
                .then((resp) => {                    
                    this.set_items(resp.data.data)
                    this.set_item(null)
                    this.list_meta.last_page = resp.data.meta.last_page
                    this.set_reload_items(false)

                    
                    
                })
                .catch((error) => {
                    console.log(error)
                })
        },



    }
}
</script>

<style>

</style>