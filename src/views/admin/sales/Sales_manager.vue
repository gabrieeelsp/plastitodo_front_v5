<template>
    <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="" :loading="loading">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <span class="text-h4 font-weight-light">Gestión de VENTAS</span>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <List 
                            v-if="show_view == 'list'"     
                            @show_sale="show_sale"  
                            @getItems="getItems"              
                        />
                        <Sale 
                            v-if="show_view == 'sale'"  
                            @cancel_show_sale="cancel_show_sale"                  
                        />
                    </v-card-text>
                </v-card>
            </v-col>
            
        </v-row>
        
    </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

import List from '@/components/admin/sales_manager/List'
import Sale from '@/components/admin/sales_manager/Sale'
export default {
    mounted() {
        this.filters.sucursal_id = this.sucursal.id
        this.getItems()
    },
    components: {
        List,
        Sale
    },
    computed: {
        ...mapGetters({
            loading: 'sales_manager/loading',
            list_meta: 'sales_manager/list_meta',
            sucursal: 'sucursals_manager/sucursal',
            filters: 'sales_manager/filters',
        })
    },
    data() {
        return {
           show_view: 'list' 

        }
    },
    methods: {
        ...mapActions({
            search_sales: 'sales_manager/search_sales',
            set_sales: 'sales_manager/set_sales',

            search_sale: 'sales_manager/search_sale',
            set_sale: 'sales_manager/set_sale',

            set_loading: 'sales_manager/set_loading',
        }),

        async getItems() {
            await this.search_sales()
                .then((resp) => {                    
                    this.set_sales(resp.data.data)
                    this.list_meta.last_page = resp.data.meta.last_page
                    
                })
        },

        async show_sale (sale_id){
            this.set_loading(true)
            await this.search_sale(sale_id)
                .then((resp) => {
                    
                    this.set_sale(resp.data.data)
                    this.show_view = 'sale'
                    
                }) 
            this.set_loading(false)
            
        },
        cancel_show_sale () {
            this.show_view = 'list'
        }

    }

}
</script>

<style>

</style>