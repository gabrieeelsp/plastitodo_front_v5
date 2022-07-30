<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light">Gestión de Proveedores</span>
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
import List from '@/components/admin/suppliers/List'
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

        }
    },
    computed: {
        ...mapGetters({
            items: 'suppliers_manager/items',
            list_meta: 'suppliers_manager/list_meta',
        })
    },
    methods: {
        ...mapActions({
            buscar_items: 'suppliers_manager/buscar_items',
            set_items: 'suppliers_manager/set_items',
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