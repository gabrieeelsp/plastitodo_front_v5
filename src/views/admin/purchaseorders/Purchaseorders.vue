<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light">Gestión de Ordenes de Compra</span>
                        <PurchaseorderNew

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

    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import List from '@/components/admin/purchaseorders/List'
import PurchaseorderNew from '@/components/admin/purchaseorders/list/PurchaseorderNew'
export default {
    created () {
        if ( this.items == null ) {
            this.getItems()
        }        
    },
    components: {
        List,
        PurchaseorderNew
    },
    data () {
        return {

        }
    },
    computed: {
        ...mapGetters({
            items: 'purchaseorders_manager/items',
            list_meta: 'purchaseorders_manager/list_meta',
        })
    },
    methods: {
        ...mapActions({
            buscar_items: 'purchaseorders_manager/buscar_items',
            set_items: 'purchaseorders_manager/set_items',
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