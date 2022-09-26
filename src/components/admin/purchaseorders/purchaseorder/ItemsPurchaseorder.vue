<template>
	<div>
        <v-row class="">
            <v-col>
                <v-checkbox
                    v-model="show_images"
                    label="Fotos"
                ></v-checkbox> 
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2" class="d-flex align-center" v-if="item.attributes.estado == 'EDITANDO'" >
                <v-select
                    dense
                    :items="[{name: 'Si', value: true}, {name: 'No', value: false}]"
                    item-text="name"
                    item-value="value"
                    v-model="filters.is_stock_low"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Stock Bajo"
                    clearable
                    @input="list_meta.page = 1"  
                >
                </v-select>
            </v-col>
            <v-col cols="12" sm="2" class="d-flex align-center" v-if="item.attributes.estado == 'EDITANDO'" >
                <v-select
                    dense
                    :items="[{name: 'Si', value: true}, {name: 'No', value: false}]"
                    item-text="name"
                    item-value="value"
                    v-model="filters.is_ordered"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Solo Ordenados"
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
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>

                                <th v-if="show_images" style="width: 110px;" class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    Foto
                                </th>
                                <th class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    Producto 
                                </th>
                                <th v-if="item.attributes.estado != 'RECIBIDO'" 
                                    style="width: 100px;"
                                    class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    Precio
                                </th>
                                <th v-if="item.attributes.estado != 'RECIBIDO'"
                                    style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    Stock Min
                                </th>
                                <th v-if="item.attributes.estado != 'RECIBIDO'"
                                    style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    Stock
                                </th>
                                <th v-if="item.attributes.estado != 'RECIBIDO'"
                                    style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    Pedido
                                </th>
                                <th
                                    style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    Cantidad
                                </th>
                                <th v-if="item.attributes.estado != 'RECIBIDO'"
                                    style="width: 100px;"
                                    class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    SubTotal
                                </th>
                                <th 
                                    style="width: 28px;"
                                    class="text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    
                                </th>
                                <th 
                                    style="width: 28px;"
                                    class="text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="purchaseproduct in items_visibles" :key="purchaseproduct.id" 
                                :class="purchaseproduct.is_confirmado ? 'light-green lighten-4' : ''"
                            >
                                <td v-if="show_images" >
                                    <v-row class="">
                                        <v-col class="pl-0" >
                                            
                                            <Photoswipe
                                                v-if="purchaseproduct.relationships.purchaseproduct.relationships.stockproduct.attributes.image"  
                                                :options="{bgOpacity: 0.5}">
                                                <v-card
                                                    v-pswp="{
                                                        src: purchaseproduct.relationships.purchaseproduct.relationships.stockproduct.attributes.image,
                                                        msrc: purchaseproduct.relationships.purchaseproduct.relationships.stockproduct.attributes.image
                                                    }"
                                                    :style="getImageItemStyle(purchaseproduct.relationships.purchaseproduct.relationships.stockproduct.attributes.image)"
                                                    style="display: inline-block"
                                                >
                                                </v-card>
                                            </Photoswipe>

                                            <v-card v-else class="">
                                                <v-img                               
                                                    class="white--text align-end mt-1 mb-1"
                                                    height="100px"
                                                    width="100px"
                                                    :src="url_asset + 'images/image_default.jpg'"
                                                    
                                                >
                                                </v-img>
                                                
                                                </v-card>
                                        </v-col>
                                    </v-row>
                                </td>
                                
                                <td>{{ purchaseproduct.relationships.purchaseproduct.attributes.name }}

                                    <span v-if="purchaseproduct.relationships.purchaseproduct.relationships.stockproduct.attributes.is_stock_unitario_variable"> [ {{ globalHelperFixeDecimalCantidad(purchaseproduct.relationships.purchaseproduct.relationships.stockproduct.attributes.stock_aproximado_unidad) }} ]</span>
                                </td>
                                <td 
                                    v-if="item.attributes.estado != 'RECIBIDO'"
                                    class="text-right"
                                    >{{ globalHelperFixeDecimalMoney(getPrecio(purchaseproduct)) }}</td>
                                <td 
                                    v-if="item.attributes.estado != 'RECIBIDO'"
                                    class="text-right"
                                    >{{ globalHelperFixeDecimalCantidad(getStock_minimo(purchaseproduct)) }}</td>
                                <td 
                                    v-if="item.attributes.estado != 'RECIBIDO'"
                                    class="text-right"
                                    >{{ globalHelperFixeDecimalCantidad(getStock(purchaseproduct)) }}</td>
                                <td v-if="item.attributes.estado != 'RECIBIDO'" 
                                    class="text-right"
                                    >{{ globalHelperFixeDecimalCantidad(getStock_pedido(purchaseproduct)) }}</td>
                                <td 
                                    class="text-right"
                                    >{{ globalHelperFixeDecimalCantidad(purchaseproduct.attributes.cantidad) }}</td>
                                <td 
                                    v-if="item.attributes.estado != 'RECIBIDO'"
                                    class="text-right"
                                    >{{ globalHelperFixeDecimalMoney(getSubtotal(purchaseproduct)) }}</td>
                                
                                <td class=" pl-0 pr-0">
                                    <PurchaseorderitemEdit
                                        :purchaseorderitem="purchaseproduct"
                                        @setCantidad="setCantidad"
                                        :disabled="item.attributes.estado == 'RECIBIDO'"
                                    />

                                </td>
                                <td class="pl-0 pr-0">
                                    <v-checkbox
                                        class="mt-0 pr-0"
                                        hide-details=""
                                        
                                        v-model="purchaseproduct.is_confirmado"
                                    ></v-checkbox>
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
                        @input="list_meta.page = 1"
                        
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
import { mapGetters } from 'vuex'
import PurchaseorderitemEdit from '@/components/admin/purchaseorders/purchaseorder/PurchaseorderitemEdit'

export default {
    mounted () {
        this.orderItems();
        for ( let purchaseorderitem of this.item.relationships.purchaseorderitems ) {
            this.$set(purchaseorderitem, 'is_confirmado', false)
        }
    },

	computed: {
        ...mapGetters({
            item: 'purchaseorders_manager/item',
            url_asset: 'url_asset'
        }),
        cant_pages: function (){
            return Math.ceil(this.items_search.length / this.list_meta.limit)
        },
        items_search: function () {
            return this.item.relationships.purchaseorderitems.filter((i) => {

                if( i.relationships.purchaseproduct.attributes.name.toUpperCase().includes(this.filters.q.toUpperCase())) {
                    return true
                }
                return false
            })
        } ,
        

        items_ordered: function () {
            return this.items_search.filter((i) => {
                if ( this.filters.is_ordered == null ) {
                    return true
                }
                if ( this.filters.is_ordered ){
                    if ( i.attributes.cantidad > 0 ) { return true } else { return false }
                }
                if ( !this.filters.is_ordered ){
                    if ( i.attributes.cantidad == 0 ) { return true } else { return false }
                }               
                
                return false                
            })
        } ,
        items_stock_low: function () {
            return this.items_ordered.filter((i) => {
                if ( this.filters.is_stock_low == null ) {
                    return true
                }
                if ( this.filters.is_stock_low ){
                    if ( this.getStock(i) - this.getStock_pedido(i) < this.getStock_minimo(i) ) { return true } else { return false }
                }
                if ( !this.filters.is_stock_low ){
                    if ( this.getStock(i) - this.getStock_pedido(i) >= this.getStock_minimo(i) ) { return true } else { return false }
                }               
                
                return false                
            })
        } ,

        items_visibles: function () {
            let ini = (this.list_meta.page * this.list_meta.limit) - this.list_meta.limit
            let fin = (this.list_meta.page * this.list_meta.limit)
            

            return this.items_stock_low.slice(ini, fin)
        }
    },
    components: {
        PurchaseorderitemEdit,
    },
    data () {
        return {
            show_images: false,
            filters: {
                q: '',
                is_ordered: null,
                is_stock_low: null
            },
            list_meta: {
                select_limit_items: [5, 10, 15, 20],
                page: 1,
                limit: 10,
            },
        }
    },

    methods: {
        getPrecio (item) {
            return (item.relationships.purchaseproduct.attributes.relacion_compra_stock * item.relationships.purchaseproduct.relationships.stockproduct.attributes.costo).toFixed(10)
        },

        getSubtotal (item) {
            if ( item.relationships.purchaseproduct.relationships.stockproduct.attributes.is_stock_unitario_variable ) {
                return (item.attributes.cantidad * item.relationships.purchaseproduct.relationships.stockproduct.attributes.stock_aproximado_unidad * this.getPrecio(item)).toFixed(10)
            }
            return (item.attributes.cantidad * this.getPrecio(item)).toFixed(10)
        },

        setCantidad ( payload ) {

            for ( let purchaseorderitem of this.item.relationships.purchaseorderitems ) {
                if ( purchaseorderitem.id == payload.id ) {
                    purchaseorderitem.attributes.cantidad = payload.cantidad
                    break
                }
            }
        },
        getStock ( item ) {
            let cant = 0
            for ( let stockSucursal of item.relationships.purchaseproduct.relationships.stockproduct.relationships.stocksucursals ) {
                cant = cant + Number(stockSucursal.attributes.stock)

            }
            return cant / item.relationships.purchaseproduct.attributes.relacion_compra_stock
        },
        getStock_pedido ( item ) {
            let cant = 0
            for ( let stockSucursal of item.relationships.purchaseproduct.relationships.stockproduct.relationships.stocksucursals ) {
                cant = cant + Number(stockSucursal.attributes.stock_pedido)

            }
            return cant / item.relationships.purchaseproduct.attributes.relacion_compra_stock
        },
        getStock_minimo ( item ) {
            let cant = 0
            for ( let stockSucursal of item.relationships.purchaseproduct.relationships.stockproduct.relationships.stocksucursals ) {
                cant = cant + Number(stockSucursal.attributes.stock_minimo)

            }
            return cant / item.relationships.purchaseproduct.attributes.relacion_compra_stock
        },

        orderItems () {
            this.item.relationships.purchaseorderitems.sort((a, b) => {
                let fa = a.relationships.purchaseproduct.attributes.name.toLowerCase(),
                    fb = b.relationships.purchaseproduct.attributes.name.toLowerCase()

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
        },

        getImageItemStyle(src) {
            return {
                width: "100px",
                height: "100px",
                backgroundImage: `url(${src})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                
            };
        },
    },
}
</script>

<style>


</style>