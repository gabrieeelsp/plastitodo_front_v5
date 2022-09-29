<template>
    <div>
        <v-row class="">
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="[{name: 'Si', value: true}, {name: 'No', value: false}]"
                    item-text="name"
                    item-value="value"
                    v-model="filters.is_promo"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Promo"
                    clearable
                    @input="list_meta.page = 1"  
                >
                </v-select>
            </v-col>
            
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-text-field
                dense
                    v-model="filters.q"
                    label="Nombre"    
                    @keyup.enter="buscar_q"    
                    hide-details=""                            
                ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="1" class="d-flex align-center">
                <v-btn small
                    @click="$emit('getItems')"
                >Search</v-btn>
                
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
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Costo
                            </th>
                            <th 
                                style="width: 100px;"   
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Pre-min
                            </th>
                            <th 
                                style="width: 100px;"   
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Porc-min
                            </th>
                            <th 
                                style="width: 100px;"   
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Pre-may
                            </th>
                            <th 
                                style="width: 100px;"   
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Porc-may
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
                        v-for="item in items"
                        :key="item.id"
                        >
                        <td>{{ item.id }}</td>
                        <td >{{ item.attributes.name }}</td>
                        <td class="text-right">{{ globalHelperFixeDecimalMoney(globalHelperCalculaCosto(item.relationships.stockproduct.attributes.costo, item.attributes.relacion_venta_stock)) }}</td>
                        
                        
                        <td class="text-right">{{ globalHelperFixeDecimalMoney(item.attributes.precio_min) }}</td>
                        
                        <td class="text-right">{{ globalHelperFixeDecimalPorcentaje(item.attributes.porc_min) }}</td>
                        <td class="text-right">{{ globalHelperFixeDecimalMoney(item.attributes.precio_may) }}</td>
                        <td class="text-right">{{ globalHelperFixeDecimalPorcentaje(item.attributes.porc_may) }}</td>
                        <td>
                            <v-btn
                                icon
                                @click="setItem(item)"
                            >
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                            <SaleproductEditValues
                                :saleproduct="item"
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
                        @input="setLimit"
                    ></v-select>
                </div>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center justify-md-end  pt-1 pb-1">
                <v-pagination
                    v-model="list_meta.page"
                    :length="list_meta.last_page"
                    :total-visible="5"
                    @input="setPage"
                    :disabled="list_meta.last_page <2"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                ></v-pagination>
            </v-col>
        </v-row>

    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SaleproductEditValues from '@/components/admin/saleproducts/list/SaleproductEditValues'

export default {

    computed: {
        ...mapGetters({
            items: 'saleproducts_manager/items',
            filters: 'saleproducts_manager/filters',
            list_meta: 'saleproducts_manager/list_meta',
        })
    },
    components: {
        SaleproductEditValues
    },
    methods: {
        ...mapActions({
            set_item: 'saleproducts_manager/set_item'
        }),
        setItem (item) {
            this.set_item(item)
            this.$router.replace({
                name: 'saleproduct',
                params: {
                    id: item.id
                }
            })
        },
        set_precio_item (item) {
            this.set_item (item)
        },
        setLimit() {
            //this.set_list_meta_limt(this.limitSelected)
            this.list_meta.page = 1
            this.$emit('getItems')
        },
        setPage() {
            //this.set_list_meta_page(this.page)
            this.$emit('getItems')
        },
        buscar_q() {
            this.list_meta.page = 1
            this.$emit('getItems')
        }
        
    }
}
</script>

<style>

</style>