<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light">Gestión de Usuarios</span>
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
import List from '@/components/admin/users/List'
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

        }
    },
    computed: {
        ...mapGetters({
            items: 'users_manager/items',
            list_meta: 'users_manager/list_meta',
            reload_items: 'users_manager/reload_items',
        })
    },
    methods: {
        ...mapActions({
            buscar_items: 'users_manager/buscar_items',
            set_items: 'users_manager/set_items',

            set_item: 'users_manager/set_item',
            set_reload_items: 'users_manager/set_reload_items',
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
                name: 'user_create',
            })
        }
    }
}
</script>

<style>

</style>