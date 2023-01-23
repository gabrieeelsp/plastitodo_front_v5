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
                Stock
            </th>
            <th 
                v-if="orderActive.sucursal_id"
                style="width: 100px;"
                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                Sucursal
            </th>
            <th
                style="width: 100px;"
             class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                Cantidad
            </th>
            <template v-if="is_orderActiveStockUnitarioVariable && ( orderActive.state == 'EN PREPARACION' || orderActive.state == 'PREPARADO' ) ">
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
            <th 
                style="width: 40px;"
                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                
            </th>
            <th 
            v-show="orderActive.state == 'EN PREPARACION'"
                style="width: 28px;"
                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                
            </th>
            
            </tr>
        </thead>
        <tbody>
            <tr
            v-for="item in orderActive.items"
            :key="item.id"
            :class="item.is_prepared && orderActive.state == 'EN PREPARACION' ? 'light-green lighten-4' : ''"
            >
            <td v-if="show_images" >
                <v-row class="">
                    <v-col class="pl-0" >
                        
                        <Photoswipe
                            v-if="item.image1"  
                            :options="{bgOpacity: 0.5}">
                            <v-card
                                v-pswp="{
                                    src: item.image1,
                                    msrc: item.image1
                                }"
                                :style="getImageItemStyle(item.image1)"
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

            <td>{{ item.name }}</td>

            
            <td 
                class="text-right"
                >{{ globalHelperFixeDecimalMoney(item.precio) }}</td>
            <td class="text-right" :class="getStock(item) / item.relacion_venta_stock < item.cantidad ? 'red--text': ''" >{{ globalHelperFixeDecimalCantidad(getStock(item)) }}</td>
            <td v-if="orderActive.sucursal_id" class="text-right" >

                <span v-if="getStockSucursal(item, orderActive.sucursal_id)" :class="getStockSucursal(item, orderActive.sucursal_id).attributes.stock / item.relacion_venta_stock < item.cantidad ? 'red--text': ''">{{ globalHelperFixeDecimalCantidad(getStockSucursal(item, orderActive.sucursal_id).attributes.stock / item.relacion_venta_stock) }}</span>
                <span v-else class="red--text"> {{ globalHelperFixeDecimalCantidad(0) }} </span>
            </td>
            <td 
                style="" 
                v-if="item.is_editing_cantidad && orderActive.state == 'EDITANDO'"
                class=""
                >
                <InputEditValue 
                    :item="{
                        id: item.saleProductId,
                        value: item.cantidad
                    }"

                    @close="item.is_editing_cantidad = false"
                    @accept="set_cantidad"
                />
            </td>
            <td 
                v-else 
                class="text-right"
                @dblclick="item.is_editing_cantidad = true"
                >{{ globalHelperFixeDecimalCantidad(item.cantidad) }}</td>

            <template v-if="is_orderActiveStockUnitarioVariable && ( orderActive.state == 'EN PREPARACION' || orderActive.state == 'PREPARADO' )">
                <td 
                v-if="item.is_stock_unitario_variable && !item.is_editing_cantidad_total"
                class="text-right"
                @dblclick="orderActive.state == 'EN PREPARACION' ? item.is_editing_cantidad_total = true : item.is_editing_cantidad_total = false"
                >
                {{ globalHelperFixeDecimalCantidad(item.cantidad_total) }}
            </td>
            <td 
            
                v-else-if="item.is_stock_unitario_variable && item.is_editing_cantidad_total"
                class="text-right"
                >
                <InputEditValue 
                    :item="{
                        id: item.saleProductId,
                        value: item.cantidad_total
                    }"

                    @close="item.is_editing_cantidad_total = false"
                    @accept="set_cantidad_total"
                />
            </td>
            <td
                v-else
                class="text-right"
                >
                ----------------
            </td>

            </template>

            

            <td v-if="item.is_stock_unitario_variable" class="text-right"><v-badge content="Aprox" :value="Number(item.cantidad_total) == 0" color="red" dot> <span>{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotalStockUnitario(item.precio, item.cantidad, item.stock_aproximado_unidad, item.relacion_venta_stock, item.cantidad_total)) }}</span></v-badge></td>

            <td v-else class="text-right">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(item.precio, item.cantidad)) }}</td>
            <td class="pl-1 pr-1">
                <v-btn
                :disabled="orderActive.state != 'EDITANDO'"
                    small
                    icon
                    color="red"
                    @click="remove_item(item.saleProductId)"
                >
                    <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
            </td>
            <td class="pl-1 pr-1" v-show="orderActive.state == 'EN PREPARACION'" >
                <v-checkbox
                    v-show="orderActive.state == 'EN PREPARACION'"
                    class="mt-0 pr-0"
                    hide-details=""
                    
                    v-model="item.is_prepared"
                ></v-checkbox>
            </td>
            </tr>
        </tbody>
        </template>
    </v-simple-table>

    <div v-for="comboitem in orderActive.comboitems" :key="comboitem.id" style="border: 1px solid #cfcdcc" class="mt-1">
        <v-simple-table >
        <template v-slot:default>
        <tbody>
            <tr class="blue lighten-4"  >
                <td v-if="show_images" 
                            style="width: 110px;" 
                        ></td>
                <td><span class="font-weight-medium" :class="comboitem.is_complete() ? '' : 'red--text'">[Combo] {{ comboitem.name }}</span></td>
                <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(comboitem.precio) }}</td>
                <td style="width: 100px;"></td>
                <td style="width: 100px;" v-if="orderActive.sucursal_id"></td>
                
                <td 
                    v-if="comboitem.is_editing_cantidad && orderActive.state == 'EDITANDO'" 
                    style="width: 100px;">
                    <InputEditValue 
                        :item="{
                            id: comboitem.comboId,
                            value: comboitem.cantidad
                        }"

                        @close="comboitem.is_editing_cantidad = false"
                        @accept="set_cantidad_combo"
                    />
                </td>
                <td v-else style="width: 100px;"
                    class="text-right"
                    @dblclick="comboitem.is_editing_cantidad = true"
                    >{{ globalHelperFixeDecimalCantidad(comboitem.cantidad) }}</td>
                <td v-if="is_orderActiveStockUnitarioVariable && orderActive.state == 'EN PREPARACION'" style="width: 100px;" class="text-right" >----------------</td>
                <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(comboitem.precio, comboitem.cantidad)) }}</td>
                <td style="width: 40px;" class="pl-1 pr-1" >
                    <v-btn small icon color="red" 
                        :disabled="orderActive.state != 'EDITANDO'"
                        @click="remove_combo_item(comboitem.comboId)"
                    >
                        <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                    
                </td>
                <td style="width: 39px;"  class="pl-1 pr-1" v-show="orderActive.state == 'EN PREPARACION'" ></td>

            </tr>
        </tbody>
        </template>
    </v-simple-table>
    
    
        <div v-for="item in comboitem.comboItems" :key="item.id" >
            <v-simple-table v-if="item.saleproducts.length > 0" style="border-top: 1px solid #cfcdcc" >
                <template v-slot:default>
                <tbody>
                    <tr class="font-weight-medium" >
                        <td v-if="show_images" 
                            style="width: 110px;" 
                        ></td>
                        <td><span class="ml-3" :class="item.is_complete() ? '' : 'red--text'"> {{ item.name }} [ {{ globalHelperFixeDecimalCantidad(item.cantidad * item.cantidad_combos) }} ]</span></td>
                        <td style="width: 100px;"></td>
                        
                        <td style="width: 100px;"
                            class="text-right"
                            ></td>
                        <td style="width: 100px;"></td>
                        <td style="width: 40px;" class="pl-1 pr-1" >
                            <v-btn small icon color="green" :disabled="orderActive.is_saved"
                                @click="item.is_editing_cantidades = !item.is_editing_cantidades"
                            >
                                <v-icon>mdi-swap-vertical</v-icon>
                            </v-btn>
                        </td>
                        <td style="width: 39px;"  class="pl-1 pr-1" v-show="orderActive.state == 'EN PREPARACION'" ></td>
                        
                    </tr>
                </tbody>
                </template>
            </v-simple-table>

                    

            <v-simple-table dense v-for="saleproduct in item.saleproducts" :key="saleproduct.id">
                <template v-slot:default>
                <tbody>

                    <tr v-if="saleproduct.cantidad != 0"
                        :class="saleproduct.is_prepared && orderActive.state == 'EN PREPARACION' ? 'light-green lighten-4' : ''"
                     >
                        <td v-if="show_images" 
                            style="width: 110px;" 
                        >
                            <v-row class="">
                                <v-col class="pl-0" >
                                    
                                    <Photoswipe
                                        v-if="saleproduct.image1"  
                                        :options="{bgOpacity: 0.5}">
                                        <v-card
                                            v-pswp="{
                                                src: saleproduct.image1,
                                                msrc: saleproduct.image1
                                            }"
                                            :style="getImageItemStyle(saleproduct.image1)"
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
                        <td><span class="ml-6">* {{ saleproduct.name }}</span></td>

                        <td  style="width: 100px;"></td>
                        <td style="width: 100px;" class="text-right" :class="getStock(saleproduct) / saleproduct.relacion_venta_stock < saleproduct.cantidad ? 'red--text': ''" >{{ globalHelperFixeDecimalCantidad(getStock(saleproduct)) }}</td>
                        
                        <td style="width: 100px;" v-if="orderActive.sucursal_id" class="text-right" >
                            <span v-if="getStockSucursal(saleproduct, orderActive.sucursal_id)" :class="getStockSucursal(saleproduct, orderActive.sucursal_id).attributes.stock / saleproduct.relacion_venta_stock < saleproduct.cantidad ? 'red--text': ''">{{ globalHelperFixeDecimalCantidad(getStockSucursal(saleproduct, orderActive.sucursal_id).attributes.stock / saleproduct.relacion_venta_stock) }}</span>
                            <span v-else class="red--text"> {{ globalHelperFixeDecimalCantidad(0) }} </span>
                        </td>

                        <td v-if="saleproduct.is_editing_cantidad  && orderActive.state == 'EDITANDO'" style="width: 100px;">
                            <InputEditValue 
                                :item="{
                                    id: comboitem.comboId + '-' + item.comboitemId + '-' + saleproduct.saleproductId,
                                    value: saleproduct.cantidad
                                }"

                                @close="saleproduct.is_editing_cantidad = false"
                                @accept="set_cantidad_combo_saleproduct"
                            />
                        </td>
                        <td v-else style="width: 100px;"
                            class="text-right"
                            @dblclick="saleproduct.is_editing_cantidad = true"
                            >{{ globalHelperFixeDecimalCantidad(saleproduct.cantidad) }}</td>
                            <td v-if="is_orderActiveStockUnitarioVariable && orderActive.state == 'EN PREPARACION'" style="width: 100px;" class="text-right" >----------------</td>
                        <td style="width: 100px;" ></td>
                        <td style="width: 40px;" class="" ></td>
                        <td style="width: 28px;" class="pl-1 pr-1" v-if="orderActive.state == 'EN PREPARACION'" >
                            <v-checkbox
                                v-show="orderActive.state == 'EN PREPARACION'"
                                class="mt-0 pr-0"
                                hide-details=""
                                
                                v-model="saleproduct.is_prepared"
                            ></v-checkbox>
                        </td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
            <v-expand-transition>
            <div v-if="item.is_editing_cantidades  && !orderActive.is_saved">
                <v-simple-table dense v-for="saleproduct in item.saleproducts" :key="saleproduct.id">
                    <template v-slot:default>
                    <tbody>

                        <tr v-if="saleproduct.cantidad == 0" >
                             <td v-if="show_images" 
                                    style="width: 110px;" 
                                >
                                    <v-row class="">
                                        <v-col class="pl-0" >
                                            
                                            <Photoswipe
                                                v-if="saleproduct.image1"  
                                                :options="{bgOpacity: 0.5}">
                                                <v-card
                                                    v-pswp="{
                                                        src: saleproduct.image1,
                                                        msrc: saleproduct.image1
                                                    }"
                                                    :style="getImageItemStyle(saleproduct.image1)"
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
                            <td><span class="ml-6">* {{ saleproduct.name }}</span></td>
                            <td style="width: 100px;"></td>
                            <td style="width: 100px;" class="text-right" :class="getStock(saleproduct) / saleproduct.relacion_venta_stock < saleproduct.cantidad ? 'red--text': ''" >{{ globalHelperFixeDecimalCantidad(getStock(saleproduct)) }}</td>
                        
                            <td style="width: 100px;" v-if="orderActive.sucursal_id" class="text-right" >
                                <span v-if="getStockSucursal(saleproduct, orderActive.sucursal_id)" :class="getStockSucursal(saleproduct, orderActive.sucursal_id).attributes.stock / saleproduct.relacion_venta_stock < saleproduct.cantidad ? 'red--text': ''">{{ globalHelperFixeDecimalCantidad(getStockSucursal(saleproduct, orderActive.sucursal_id).attributes.stock / saleproduct.relacion_venta_stock) }}</span>
                                <span v-else class="red--text"> {{ globalHelperFixeDecimalCantidad(0) }} </span>
                            </td>
                            <td v-if="saleproduct.is_editing_cantidad && orderActive.state == 'EDITANDO'" style="width: 100px;">
                                <InputEditValue 
                                    :item="{
                                        id: comboitem.comboId + '-' + item.comboitemId + '-' + saleproduct.saleproductId,
                                        value: saleproduct.cantidad
                                    }"

                                    @close="saleproduct.is_editing_cantidad = false"
                                    @accept="set_cantidad_combo_saleproduct"
                                />
                            </td>
                            <td v-else style="width: 100px;"
                                class="text-right"
                                @dblclick="saleproduct.is_editing_cantidad = true"
                                >{{ globalHelperFixeDecimalCantidad(saleproduct.cantidad) }}</td>
                                <td v-if="is_orderActiveStockUnitarioVariable && orderActive.state == 'EN PREPARACION'" style="width: 100px;" class="text-right" >----------------</td>
                            <td style="width: 100px;"></td>
                            <td style="width: 40px;"></td>
                            <td style="width: 39px;"  class="pl-1 pr-1" v-show="orderActive.state == 'EN PREPARACION'" ></td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </div>
            </v-expand-transition>
            
        </div>
    </div>
    
</div>
    
    
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import InputEditValue from '@/components/admin/utils/InputEditValue'
export default {

    mounted () {
        for ( let item of this.orderActive.items ) {
            this.$set(item, 'is_confirmado', false)
        }
    },
    computed: {
        ...mapGetters({
            url_asset: 'url_asset',
            orderActive: 'order_manager/orderActive',
            is_orderActiveStockUnitarioVariable: 'order_manager/is_orderActiveStockUnitarioVariable',
        })
    },
    components: {
        
        InputEditValue
    },

    data: () => ({
        show_images: false,
        item_editing: null,
    }),
    methods: {
        ...mapActions({
            remove_item: 'order_manager/remove_item',
            remove_combo_item: 'order_manager/remove_combo_item'
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