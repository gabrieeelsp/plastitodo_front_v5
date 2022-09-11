<template>
    <div>
        <v-row class="">
            <v-col class="">
                <v-checkbox
                class="mt-0 mb-1"
                    v-model="show_images"
                    label="Fotos"
                    hide-details=""
                ></v-checkbox> 
            </v-col>
            <v-spacer></v-spacer>
            
            
            
        </v-row>
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
                    <th 
                        style="width: 100px;"
                        class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                        Precio
                    </th>
                    <th
                        style="width: 100px;"
                    class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                        Cantidad
                    </th>
                    <template v-if="is_OrderStockUnitarioVariable">
                    <th
                        style="width: 100px;"
                    class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                        Peso
                    </th>
                    </template>
                    <th 
                        style="width: 100px;"
                        class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                        SubTotal
                    </th>

                    
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in order.relationships.orderitems" :key="item.id" >
                        <td v-if="show_images" >
                            <v-row class="">
                                <v-col class="pl-0" >
                                    
                                    <Photoswipe
                                        v-if="item.relationships.saleproduct.attributes.image1"  
                                        :options="{bgOpacity: 0.5}">
                                        <v-card
                                            v-pswp="{
                                                src: item.relationships.saleproduct.attributes.image1,
                                                msrc: item.relationships.saleproduct.attributes.image1
                                            }"
                                            :style="getImageItemStyle(item.relationships.saleproduct.attributes.image1)"
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

                        <td>{{ item.relationships.saleproduct.attributes.name }}</td>

                        
                        <td class="text-right" >{{ globalHelperFixeDecimalMoney(item.attributes.precio) }}</td>
                    
                        <td class="text-right" >{{ globalHelperFixeDecimalCantidad(item.attributes.cantidad) }}</td>

                        <template v-if="is_OrderStockUnitarioVariable">
                            <td 
                                v-if="item.relationships.saleproduct.relationships.stockproduct.attributes.is_stock_unitario_variable"
                                class="text-right"
                                >
                                {{ globalHelperFixeDecimalCantidad(item.attributes.cantidad_total) }}
                            </td>
                            <td v-else class="text-right" >----------------</td>

                        </template>

                        

                        <td v-if="item.relationships.saleproduct.relationships.stockproduct.attributes.is_stock_unitario_variable" class="text-right"><v-badge content="Aprox" :value="Number(item.attributes.cantidad_total) == 0" color="red" dot> <span>{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotalStockUnitario(item.attributes.precio, item.attributes.cantidad, item.relationships.saleproduct.relationships.stockproduct.attributes.stock_aproximado_unidad, item.attributes.cantidad_total)) }}</span></v-badge></td>

                        <td v-else class="text-right">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(item.attributes.precio, item.attributes.cantidad)) }}</td>
                    </tr>
                </tbody>
            </template>
        </v-simple-table>

        <div v-for="comboitem in order.relationships.ordercomboitems" :key="comboitem.id" style="border: 1px solid #cfcdcc" class="mt-1">
            <v-simple-table >
                <template v-slot:default>
                    <tbody>
                        <tr class="blue lighten-4"  >
                            <td v-if="show_images" style="width: 110px;" ></td>
                            <td><span class="font-weight-medium" >[Combo] {{ comboitem.relationships.combo.attributes.name }}</span></td>
                            <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(comboitem.attributes.precio) }}</td>

                            
                            <td style="width: 100px;" class="text-right" >{{ globalHelperFixeDecimalCantidad(comboitem.attributes.cantidad) }}</td>
                            <td v-if="is_OrderStockUnitarioVariable" style="width: 100px;" class="text-right" >----------------</td>
                            <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(comboitem.attributes.precio, comboitem.attributes.cantidad)) }}</td>

                        </tr>
                    </tbody>
                </template>
            </v-simple-table>

            

                    

            <v-simple-table dense v-for="saleproduct in comboitem.relationships.ordercombosaleproducts" :key="saleproduct.id">
                <template v-slot:default>
                <tbody>

                    <tr >
                        <td v-if="show_images" style="width: 110px;" >
                            <v-row class="">
                                <v-col class="pl-0" >
                                    
                                    <Photoswipe
                                        v-if="saleproduct.relationships.saleproduct.attributes.image1"  
                                        :options="{bgOpacity: 0.5}">
                                        <v-card
                                            v-pswp="{
                                                src: saleproduct.relationships.saleproduct.attributes.image1,
                                                msrc: saleproduct.relationships.saleproduct.attributes.image1
                                            }"
                                            :style="getImageItemStyle(saleproduct.relationships.saleproduct.attributes.image1)"
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
                        <td><span class="ml-6">* {{ saleproduct.relationships.saleproduct.attributes.name }}</span></td>

                        <td  style="width: 100px;"></td>
                        


                        <td style="width: 100px;" class="text-right" >{{ globalHelperFixeDecimalCantidad(saleproduct.attributes.cantidad) }}</td>
                        <td v-if="is_OrderStockUnitarioVariable" style="width: 100px;" class="text-right" >----------------</td>
                        <td style="width: 100px;" ></td>

                    </tr>
                </tbody>
                </template>
            </v-simple-table>
            
        </div>



    
    </div>
    
    
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

export default {

    mounted () {

    },
    computed: {
        ...mapGetters({
            url_asset: 'url_asset',
        })
    },
    props: {
        order: Object,
        is_OrderStockUnitarioVariable: Boolean,
    },
    components: {
        
        
    },

    data: () => ({
        show_images: false,
        item_editing: null,
    }),
    methods: {
        ...mapActions({

        }),
        set_cantidad(itemEdited){            
            for ( let item of this.orderActive.items) {
                if ( item.saleProductId == itemEdited.id) {
                    item.cantidad = this.globalHelperFixeDecimalCantidad(itemEdited.value)

                    item.is_editing_cantidad = false

                    if ( item.is_stock_unitario_variable ) {
                        item.cantidad_total = 0
                    }
                    break
                }
            }
        },
        set_cantidad_combo(itemEdited){            
            for ( let comboitem of this.orderActive.comboitems) {
                if ( comboitem.comboId == itemEdited.id) {
                    comboitem.cantidad = this.globalHelperFixeDecimalCantidad(itemEdited.value)

                    for ( let item of comboitem.comboItems ) {
                        item.cantidad_combos = itemEdited.value
                    }

                    comboitem.is_editing_cantidad = false
                    break
                }
            }
        },
        set_cantidad_combo_saleproduct(itemEdited){  
            let id_array = itemEdited.id.split('-')         
            for ( let comboitem of this.orderActive.comboitems) {
                if ( comboitem.comboId == id_array[0]) {
                    for ( let item of comboitem.comboItems ) { 
                        if ( item.comboitemId == id_array[1]) {
                            for ( let saleproduct of item.saleproducts ) {
                                if ( saleproduct.saleproductId == id_array[2] ) {
                                    saleproduct.cantidad = this.globalHelperFixeDecimalCantidad(itemEdited.value)
                                    saleproduct.is_editing_cantidad = false
                                    break
                                }
                            }

                            
                        }                        
                    }                    
                }
            }
        },
        set_precio(itemEdited){            
            for ( let item of this.orderActive.items) {
                if ( item.saleProductId == itemEdited.id) {
                    item.precio = this.globalHelperFixeDecimalMoney(itemEdited.cantidad)

                    item.is_editing_precio = false
                    break
                }
            }
        },

        set_cantidad_total(itemEdited){  
            
            for ( let item of this.orderActive.items) {
                if ( item.saleProductId == itemEdited.id) {
                    item.cantidad_total = this.globalHelperFixeDecimalCantidad(itemEdited.value)

                    item.is_editing_cantidad_total = false
                    break
                }
            }
        },


        getStock (item) {
            let stock = 0
            for ( let stocksucursal of item.relationships.stockproduct.relationships.stocksucursals ) {
                    stock = stock + Number(stocksucursal.attributes.stock)
            }
            return stock / Number(item.relacion_venta_stock)
        },

        getStockSucursal (item, sucursal_id) {
            for ( let stocksucursal of item.relationships.stockproduct.relationships.stocksucursals ) {
                if ( stocksucursal.attributes.sucursal_id == sucursal_id ) {
                    return stocksucursal
                }
            }
            return null
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