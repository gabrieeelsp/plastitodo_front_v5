<template>
    <div v-if="item">
        <v-row>
            <v-col class="d-flex justify-space-between align-center pt-1 pb-1">
                <span class="text-h6 text--black font-weight-medium">{{ item.attributes.name }}</span>

                <PurchaseproductNew 
                    :supplier="item"
                    @reload_item="reload_item"
                />
            </v-col>
        </v-row>

        <v-row class="">
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="[{name: 'Si', value: true}, {name: 'No', value: false}]"
                    item-text="name"
                    item-value="value"
                    v-model="filters.is_enable"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Habilitado"
                    clearable
                    @input="list_meta.page = 1"  
                >
                </v-select>
            </v-col>
            <v-col cols="12" sm="4" class="d-flex align-center">
                <v-text-field
                    dense
                    v-model="filters.q"
                    label="Nombre"       
                    hide-details=""
                    @input="list_meta.page = 1"                           
                ></v-text-field>
            </v-col>
            
            
        </v-row>
        
        <v-row>
            <v-col>
                <v-simple-table
                    dense
                >
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th 
                                style="width: 50px;"
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Id
                            </th>

                            <th 
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Nombre
                            </th>
                            
                            <th   
                            style="width: 100px;"                              
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Rel./Compra
                            </th>
                            <th   
                            style="width: 100px;"                              
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Habilitado
                            </th>
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Actions
                            </th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="purchaseproduct in items_visibles"
                            :key="purchaseproduct.id"
                        >
                        <td>{{ purchaseproduct.id }}</td>
                        <td >{{ purchaseproduct.attributes.name }}</td>

                        <td class="text-right">{{ purchaseproduct.attributes.relacion_compra_stock }}</td>
                        <td class="text-right" v-if="purchaseproduct.attributes.is_enable"><v-chip x-small class="ma-2" color="success" >Enable</v-chip></td>
                        <td class="text-right" v-else><v-chip x-small class="ma-2" color="warning" >Disable</v-chip></td>
                        <td>
                            <PurchaseproductEdit
                                :purchaseproduct="purchaseproduct"
                                :supplier="item"
                            />
                        </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <v-row>
            <v-spacer></v-spacer>
            <v-col cols="12" md="4" class="d-flex align-center justify-center justify-md-end   pt-1 pb-1">
                <span class=" font-weight-bold text-caption grey--text font-weight-light">Items per page:</span>
                <div style="width: 75px; ">                                
                    <v-select
                        :items="list_meta.select_limit_items"
                        v-model="list_meta.limit"
                        label="Standard"
                        hide-details=""
                        single-line
                        class="rounded-sm ml-1 text-caption font-weight-light"
                        solo
                        dense
                        
                    ></v-select>
                </div>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center justify-md-end  pt-1 pb-1">
                <v-pagination
                    v-model="list_meta.page"
                    :length="cant_pages"
                    :total-visible="5"
                    
                    :disabled="cant_pages <2"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                ></v-pagination>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PurchaseproductEdit from '@/components/admin/suppliers/supplier/PurchaseproductEdit'
import PurchaseproductNew from '@/components/admin/suppliers/supplier/PurchaseproductNew3'

export default {
    created() {
        
    },
    computed: {
        ...mapGetters({
            item: 'suppliers_manager/item',
        }),
        cant_pages: function (){
            return Math.ceil(this.items_search.length / this.list_meta.limit)
        },
        items_search: function () {
            return this.item.relationships.purchaseproducts.filter((i) => {

                if ( this.filters.is_enable == null ) {
                    if( i.attributes.name.toUpperCase().includes(this.filters.q.toUpperCase())) {
                        return true
                    }
                }else {
                    if( i.attributes.is_enable == this.filters.is_enable && i.attributes.name.toUpperCase().includes(this.filters.q.toUpperCase())) {
                        return true
                    }
                }

                
                return false
            })
        } ,
        items_visibles: function () {
            let ini = (this.list_meta.page * this.list_meta.limit) - this.list_meta.limit
            let fin = (this.list_meta.page * this.list_meta.limit)
            

            return this.items_search.slice(ini, fin)
        }
    },
    components: {
        PurchaseproductEdit,
        PurchaseproductNew,

    },
    data () {
        return {
            filters: {
                q: '',
                is_enable: null,
            },
            list_meta: {
                select_limit_items: [5, 10, 15, 20],
                page: 1,
                limit: 10,
            },

        }
    },
    methods: {
        ...mapActions({
            
        }),
        
        nuevo_subitem () {

        },

        volver() {
            this.$emit('volver')
        },

        reload_item () {
            this.$emit('reload_item')
        },

    }
}
</script>

<style>


</style>