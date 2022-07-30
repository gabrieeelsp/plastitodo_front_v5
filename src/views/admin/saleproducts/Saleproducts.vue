<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="" :loading="loading">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light">Gestión de Productos Venta</span>
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
import List from '@/components/admin/saleproducts/List'
export default {
    created () {
        if ( this.items == null ) {
            this.getItems()
        }
        
    },
    components: {
        List
    },
    data () {
        return {
            loading: false
        }
    },
    computed: {
        ...mapGetters({
            items: 'saleproducts_manager/items',
            list_meta: 'saleproducts_manager/list_meta',
        })
    },
    methods: {
        ...mapActions({
            buscar_items: 'saleproducts_manager/buscar_items',
            set_items: 'saleproducts_manager/set_items',
        }),
        getItems ( ) {
            this.buscar_items()
                .then((resp) => {                    
                    this.set_items(resp.data.data)
                    this.list_meta.last_page = resp.data.meta.last_page
                    //console.log(resp.data.data)
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