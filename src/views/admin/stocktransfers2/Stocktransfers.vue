<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light mr-auto">Transferencia de  Stock</span>
                        <v-btn small color="warning"  >Nuevo</v-btn>
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
import List from '@/components/admin/stocktransfers/List'
export default {
    created () {
        this.filters.sucursal_origen_id = this.sucursal.id
        if ( this.items == null ) {
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
            item_new: 'stocktransfers_manager/item_new',
            add_item: 'stocktransfers_manager/add_item',
            set_item: 'stocktransfers_manager/set_item',
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
        },

        nuevo_item () {
            this.item_new()
                .then((resp) => {
                    
                    this.add_item(resp.data.data)
                    this.set_item(resp.data.data)
                    this.$router.replace({
                        name: 'stocktransfer',
                        params: {
                            id: resp.data.data.id
                        }
                    })
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