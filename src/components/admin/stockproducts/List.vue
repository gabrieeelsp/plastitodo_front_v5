<template>
    <div>
        <v-row class="">
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-checkbox
                    label="Fecha Act."
                    v-model="orders.time_set_costo"
                    hide-details=""
                >
                </v-checkbox>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <SelectSupplier 
                    label="Supplier"
                    @setSupplier="setSupplier_local"
                    :supplier="filters.supplier"
                />
            </v-col>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="ivaaliquots_select"
                    item-text="name"
                    item-value="id"
                    v-model="filters.ivaaliquot_id"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Aliquota Iva"
                    clearable
                >
                </v-select>
            </v-col>
            
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-text-field
                dense
                    v-model="filters.q"
                    label="Nombre"    
                    @keyup.enter="getItems"    
                    hide-details=""                            
                ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="1" class="d-flex align-center">
                <v-btn small
                    @click="getItems"
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
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Costo
                            </th>
                            <th     
                            style="width: 100px;"                            
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Actualización
                            </th>
                            <th   
                            style="width: 100px;"                              
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Iva
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
                        <td class="text-right">{{ globalHelperFixeDecimalMoney(item.attributes.costo) }}</td>
                        <td class="text-right">{{ item.attributes.time_set_costo | luxon('dd-MM-yyyy') }}</td>
                        <td class="text-right">{{ item.relationships.ivaaliquot.attributes.name }}</td>
                        <td>
                            <v-btn
                                icon
                                @click="setItem(item)"
                            >
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                            <StockproductEditValues
                                :stockproduct="item"
                                
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
import StockproductEditValues from '@/components/admin/stockproducts/list/StockproductEditValues'
import SelectSupplier from '@/components/admin/suppliers/SelectSupplier'
export default {

    computed: {
        ...mapGetters({
            items: 'stockproducts_manager/items',
            filters: 'stockproducts_manager/filters',
            ivaaliquots_select: 'ivaaliquots_manager/ivaaliquots_select',

            orders: 'stockproducts_manager/orders',

            list_meta: 'stockproducts_manager/list_meta',
        })
    },
    components: {
        StockproductEditValues,
        SelectSupplier
    },
    methods: {
        ...mapActions({
            set_item: 'stockproducts_manager/set_item',
            set_supplier: 'stockproducts_manager/set_supplier',
        }),
        setItem (item) {
            this.set_item(item)
            this.$router.replace({
                name: 'stockproduct',
                params: {
                    id: item.id
                }
            })
        },

        setSupplier_local(id) {
            this.set_supplier(id)
        },

        setLimit() {
            this.list_meta.page = 1
            //this.set_list_meta_limt(this.limitSelected)
            this.$emit('getItems')
        },
        setPage() {
            //this.set_list_meta_page(this.page)
            this.$emit('getItems')
        },
        getItems() {
            this.list_meta.page = 1
            this.$emit('getItems')
        },
        
    }
}
</script>

<style>

</style>