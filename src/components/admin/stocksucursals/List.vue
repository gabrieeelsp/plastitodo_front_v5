<template>
    <div>
        <v-row class="">
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-checkbox
                    label="Ordenar por STOCK"
                    v-model="orders.stock"
                    hide-details=""
                >
                </v-checkbox>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="sucursals_select"
                    item-text="name"
                    item-value="id"
                    v-model="filters.sucursal_id"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Sucursal"
                    clearable
                >
                </v-select>
            </v-col>
            
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-text-field
                dense
                    v-model="filters.q"
                    label="Nombre"    
                    @keyup.enter="$emit('getItems')"    
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
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Stock
                            </th>
                            <th 

                                style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Pedido
                            </th>
                            <th 

                                style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Stock Min
                            </th>
                            <th 

                                style="width: 60px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                REL
                            </th>

                            <th   
                                style="width: 100px;"
                                v-for="sucursal in sucursals" :key="sucursal.id" 
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                {{ getAb_sucursal(sucursal) }}
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
                        <td class="text-right" >{{ globalHelperFixeDecimalCantidad(item.attributes.stock) }}</td>
                        <td class="text-right" >{{ globalHelperFixeDecimalCantidad(item.attributes.stock_pedidos) }}</td>
                        <td class="text-right" >{{ globalHelperFixeDecimalCantidad(item.attributes.stock_minimo) }}</td>
                        <td class="" ><v-chip :color="get_stock_relativo(item.attributes.stock_relativo).color" style="width: 60px;" x-small class="d-flex justify-center"><span>{{ get_stock_relativo(item.attributes.stock_relativo).num }}</span></v-chip></td>
                        <td class="text-right" v-for="sucursal in sucursals" :key="sucursal.id" >
                            <template v-if="getStockSucursal(item, sucursal.id) != null" >
                                <span :class="is_stock_low(item, sucursal.id) ? 'red--text': ''">{{ globalHelperFixeDecimalCantidad(getStockSucursal(item, sucursal.id).attributes.stock) }}</span>
                            </template>
                            <template v-else>
                                <span class="red--text">{{ globalHelperFixeDecimalCantidad(0) }}</span>
                                
                            </template>
                        </td>
                        <td>
                            <StocksucursalEdit
                                :stockproduct="item"
                                @reload_items="reload_items"
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
import StocksucursalEdit from '@/components/admin/stocksucursals/list/StocksucursalEdit.vue'
export default {

    computed: {
        ...mapGetters({
            items: 'stocksucursals_manager/items',
            filters: 'stocksucursals_manager/filters',
            orders: 'stocksucursals_manager/orders',

            list_meta: 'stocksucursals_manager/list_meta',

            sucursals: 'sucursals_manager/sucursals',
            sucursals_select: 'sucursals_manager/sucursals_select',
        })
    },
    components: {
        StocksucursalEdit
    },
    methods: {
        ...mapActions({
            set_item: 'stocksucursals_manager/set_item'
        }),

        setLimit() {
            this.list_meta.page = 1
            //this.set_list_meta_limt(this.limitSelected)
            this.$emit('getItems')
        },
        setPage() {
            
            //this.set_list_meta_page(this.page)
            this.$emit('getItems')
        },
        getStockSucursal (item, sucursal_id) {
            for ( let stocksucursal of item.relationships.stocksucursals ) {
                if ( stocksucursal.attributes.sucursal_id == sucursal_id ) {
                    return stocksucursal
                }
            }
            return null
        },
        is_stock_low (item, sucursal_id) {
            for ( let stocksucursal of item.relationships.stocksucursals ) {
                if ( stocksucursal.attributes.sucursal_id == sucursal_id ) {
                    if ( stocksucursal.attributes.stock < stocksucursal.attributes.stock_minimo ) {
                        return true
                    }
                }
            }
            return false
        },

        getStock (item) {
            let stock = 0
            for ( let stocksucursal of item.relationships.stocksucursals ) {
                    stock = stock + Number(stocksucursal.attributes.stock)
            }
            return stock
        },

        getAb_sucursal ( sucursal ) {
            let ab = ''
            for ( let palabra of sucursal.attributes.name.split(' ') ) {
                ab = ab.concat(palabra.substring(0, 4) + ' ')
            }
            return ab
        },

        reload_items ( ) {
            this.$emit('getItems');
        }
    }
}
</script>

<style>

</style>