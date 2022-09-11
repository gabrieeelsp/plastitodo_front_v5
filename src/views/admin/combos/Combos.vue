<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="" :loading="loading">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light">Gestión de Combos</span>
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
import List from '@/components/admin/combos/List'
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
            items: 'combos_manager/items',
            list_meta: 'combos_manager/list_meta',
            reload_items: 'suppliers_manager/reload_items',
        })
    },
    methods: {
        ...mapActions({
            buscar_items: 'combos_manager/buscar_items',
            set_items: 'combos_manager/set_items',
            set_item: 'combos_manager/set_item',
            set_reload_items: 'suppliers_manager/set_reload_items',
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

        nuevo_item () {
            this.$router.push({
                name: 'combo_create',
            })
        }
    }
}
</script>

<style>

</style>