<template>
    <div v-if="item">
        <v-row>
            <v-col class="d-flex justify-space-between align-center pt-1 pb-1">
                <span class="text-h6 text--black font-weight-medium">{{ item.attributes.name }}</span>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="3" class="d-flex  align-center">
                <v-text-field solo v-model="json_str"></v-text-field>
                <v-btn small class="ml-2" @click="add_lista">Upload</v-btn>
            </v-col>
        </v-row>

        <v-row class="">
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2" class="d-flex align-center">
                
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
                                style="width: 50px;"
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Código
                            </th>

                            <th 
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Nombre
                            </th>
                            <th 
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                precio_actual
                            </th>
                            <th 
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                precio_sistema
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
                            v-for="i in items_visibles"
                            :key="i.id"
                        >
                        <td>{{ i.id }}</td>
                        

                        <td class="text-right">{{ i.codigo }}</td>
                        <td >{{ i.name }}</td>
                        
                        <td>
                            {{ i.precio_actual }}
                        </td>
                        <td>
                            {{ i.precio_sistema }}
                        </td>
                        <td>
                            <StockproductEditValues
                                :stockproduct="i"
                                @update_item='update_item'
                                @update_items_group='update_items_group'
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
import StockproductEditValues from '@/components/admin/suppliers/supplier/StockproductEditValues'
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
            return this.items.filter((i) => {

                if( i.name.toUpperCase().includes(this.filters.q.toUpperCase())) {
                    return true
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
        StockproductEditValues,

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

            items: [],
            json_str: null,
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

        add_lista ( ) {

            //console.log(this.json_str)

            //console.log(JSON.parse(this.json_str))

            this.items = []

            console.log(this.item.relationships.purchaseproducts)
            
            for ( let i of this.item.relationships.purchaseproducts.filter( (i) => { return i.attributes.codigo }) ) {
                let json_data = this.get_json_data_from_codigo ( i.attributes.codigo )
                //console.log(i.relationships.stockproduct)
                
                this. items.push({
                    id: i.id,
                    codigo: i.attributes.codigo,
                    name: i.attributes.name,
                    stockproduct_id: i.relationships.stockproduct.id,
                    stockproductgroup: i.relationships.stockproduct.relationships.stockproductgroup ? {
                        id: i.relationships.stockproduct.relationships.stockproductgroup.id,
                        name: i.relationships.stockproduct.relationships.stockproductgroup.attributes.name,
                    } : null,
                    precio_actual: json_data ? json_data.precio * i.attributes.rel_precio_codigo : null,
                    precio_sistema: i.relationships.stockproduct.attributes.costo,
                })
            }
        },

        get_json_data_from_codigo ( codigo ) {
            for ( let i of JSON.parse(this.json_str) ) { 
                if ( codigo == i.codigo.trim() ) {
                    return i
                }
            }
            return null
        },
        update_item ( data ) {
            for ( let i of this.items ) {
                if ( i.stockproduct_id == data.stockproduct_id ) {
                    i.precio_sistema = data.costo
                }
            }
            
        },

        update_items_group ( data ) {
            for ( let i of this.items ) {
                    if ( i.stockproductgroup && i.stockproductgroup.id == data.stockproductgroup_id ) {
                        i.precio_sistema = data.costo
                    }
                }
            
        }

    }
}
</script>

<style>


</style>