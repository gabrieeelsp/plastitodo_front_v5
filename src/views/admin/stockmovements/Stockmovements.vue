<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light mr-auto">Gestión de Movimientos de Stock</span>
                        <v-btn small color="warning" @click="nuevo_item('EGRESO')" >Nuevo EGRESO</v-btn>
                        <v-btn small color="success" class="ml-1" @click="nuevo_item('INGRESO')" >Nuevo INGRESO</v-btn>
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
import List from '@/components/admin/stockmovements/List'
export default {
    created () {
        this.filters.sucursal_id = this.sucursal.id
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
            items: 'stockmovements_manager/items',
            list_meta: 'stockmovements_manager/list_meta',

            sucursal: 'sucursals_manager/sucursal',
            filters: 'stockmovements_manager/filters',
        })
    },
    methods: {
        ...mapActions({
            buscar_items: 'stockmovements_manager/buscar_items',
            set_items: 'stockmovements_manager/set_items',
            item_new: 'stockmovements_manager/item_new',
            add_item: 'stockmovements_manager/add_item',
            set_item: 'stockmovements_manager/set_item',
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

        nuevo_item (tipo) {
            this.item_new({tipo: tipo})
                .then((resp) => {
                    
                    this.add_item(resp.data.data)
                    this.set_item(resp.data.data)
                    this.$router.replace({
                        name: 'stockmovement',
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