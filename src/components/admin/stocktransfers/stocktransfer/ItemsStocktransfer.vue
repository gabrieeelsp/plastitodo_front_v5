<template>
    <div v-if="item.relationships.stocktransferitems">
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
                            <th
                                style="width: 150px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Cantidad
                            </th>
                            <th 
                                style="width: 90px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                
                            </th>
                            <th 
                                v-show="item.attributes.estado == 'EN PREPARACION'"
                                    style="width: 28px;"
                                    class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    
                                </th>
                            <th 
                                v-show="item.attributes.estado == 'INGRESANDO'"
                                    style="width: 28px;"
                                    class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    
                                </th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="stocktransferitem in item.relationships.stocktransferitems"
                            :key="stocktransferitem.id"
                        >
                            <td v-if="show_images" >
                                <v-row class="">
                                    <v-col class="pl-0" >
                                        
                                        <Photoswipe
                                            v-if="stocktransferitem.relationships.stockproduct.attributes.image"  
                                            :options="{bgOpacity: 0.5}">
                                            <v-card
                                                v-pswp="{
                                                    src: stocktransferitem.relationships.stockproduct.attributes.image,
                                                    msrc: stocktransferitem.relationships.stockproduct.attributes.image
                                                }"
                                                :style="getImageItemStyle(stocktransferitem.relationships.stockproduct.attributes.image)"
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
                            

                            <td>{{ stocktransferitem.relationships.stockproduct.attributes.name }}</td>

                            <td 
                                style="" 
                                v-if="stocktransferitem.is_editing_cantidad && item.attributes.estado == 'EDITANDO'"
                                class=""
                                >
                                <InputEditValue 
                                    :item="{
                                        id: stocktransferitem.relationships.stockproduct.id,
                                        value: stocktransferitem.attributes.cantidad
                                    }"

                                    @close="stocktransferitem.is_editing_cantidad = false"
                                    @accept="set_cantidad"
                                />
                            </td>
                            <td 
                                v-else 
                                class="text-right"
                                @dblclick="stocktransferitem.is_editing_cantidad = true"
                                >{{ globalHelperFixeDecimalCantidad(stocktransferitem.attributes.cantidad) }}
                            </td>
                            <td>
                                <v-btn
                                        small
                                        icon
                                        color="red"
                                        @click="remove_subitem(stocktransferitem.id)"
                                        :disabled="item.attributes.estado != 'EDITANDO'"
                                    >
                                        <v-icon>mdi-delete-outline</v-icon>
                                </v-btn>
                            </td>
                            <td class="pl-1 pr-1" v-show="item.attributes.estado == 'EN PREPARACION'" >
                                <v-checkbox
                                    v-show="item.attributes.estado == 'EN PREPARACION'"
                                    class="mt-0 pr-0"
                                    hide-details=""
                                    
                                    v-model="stocktransferitem.attributes.is_prepared"
                                ></v-checkbox>
                            </td>
                            <td class="pl-1 pr-1" v-show="item.attributes.estado == 'INGRESANDO'" >
                                <v-checkbox
                                    v-show="item.attributes.estado == 'INGRESANDO'"
                                    class="mt-0 pr-0"
                                    hide-details=""
                                    
                                    v-model="stocktransferitem.attributes.is_recibido"
                                ></v-checkbox>
                            </td>
                        
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
            
    
</div>
    
    
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import InputEditValue from '@/components/admin/utils/InputEditValue'
export default {

    mounted () {

        
    },
    computed: {
        ...mapGetters({
            url_asset: 'url_asset',
            item: 'stocktransfers_manager/item',
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
            remove_subitem: 'stocktransfers_manager/remove_subitem',
        }),
        set_cantidad(itemEdited){            
            for ( let item of this.item.relationships.stocktransferitems) {
                if ( item.relationships.stockproduct.id == itemEdited.id) {
                    item.attributes.cantidad = this.globalHelperFixeDecimalCantidad(itemEdited.value)

                    item.is_editing_cantidad = false
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