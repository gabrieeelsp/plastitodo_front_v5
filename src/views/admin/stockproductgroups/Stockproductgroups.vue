<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="" :loading="loading">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light">Gestión de Grupos Productos Stock</span>
                        <v-btn small color="success" @click="nuevo_item" >Nuevo</v-btn>
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
import List from '@/components/admin/stockproductgroups/List'
export default {
    created () {
        if ( this.items == null || this.reload_items ) {
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
            items: 'stockproductgroups_manager/items',
            list_meta: 'stockproductgroups_manager/list_meta',

            reload_items: 'stockproductgroups_manager/reload_items',
        })
    },
    methods: {
        ...mapActions({
            buscar_items: 'stockproductgroups_manager/buscar_items',
            set_items: 'stockproductgroups_manager/set_items',

            set_item: 'stockproductgroups_manager/set_item',

        }),
        getItems ( ) {
            this.loading = true
            this.buscar_items()
                .then((resp) => {                    
                    this.set_items(resp.data.data)
                    this.set_item(null)
                    this.list_meta.last_page = resp.data.meta.last_page
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    this.loading = false
                })
        },

        nuevo_item () {
            this.$router.push({
                name: 'stockproductgroup_create',
            })
        }
    }
}
</script>

<style>

</style>