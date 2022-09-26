<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light">Transferencias de Stock</span>
                        <StocktransferNew

                        />
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
        {{ items }}
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import List from '@/components/admin/stocktransfers/List'
import StocktransferNew from '@/components/admin/stocktransfers/list/StocktransferNew.vue'
export default {
    created () {
        this.filters.sucursal_origen_id = this.sucursal.id
        if ( this.items == null ) {
            this.getItems()
        }        
    },
    components: {
        List,
        StocktransferNew
    },
    data () {
        return {

        }
    },
    computed: {
        ...mapGetters({
            items: 'stocktransfers_manager/items',
            list_meta: 'stocktransfers_manager/list_meta',

            sucursal: 'sucursals_manager/sucursal',
            filters: 'stocktransfers_manager/filters',
        })
    },
    methods: {
        ...mapActions({
            buscar_items: 'stocktransfers_manager/buscar_items',
            set_items: 'stocktransfers_manager/set_items',
        }),
        getItems ( ) {
            this.buscar_items()
                .then((resp) => {                    
                    this.set_items(resp.data.data)
                    this.list_meta.last_page = resp.data.meta.last_page
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