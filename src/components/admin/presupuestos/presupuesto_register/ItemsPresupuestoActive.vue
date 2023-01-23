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

            <th 
                style="width: 100px;"
                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                SubTotal
            </th>
            <th 
                style="width: 40px;"
                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                
            </th>
            
            </tr>
        </thead>
        <tbody>
            <tr
            v-for="item in presupuestoActive.items"
            :key="item.id"
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
            <td 
                style="" 
                v-if="item.is_editing_cantidad"
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
            <td v-if="item.is_stock_unitario_variable" class="text-right"><v-badge content="Aprox" :value="item.is_stock_unitario_variable" color="red" dot><span>{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotalStockUnitario(item.precio, item.cantidad, item.stock_aproximado_unidad, item.relacion_venta_stock, null)) }}</span></v-badge></td>
            <td v-else class="text-right">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(item.precio, item.cantidad)) }}</td>
            <td class="pl-1 pr-1">
                <v-btn
                    small
                    icon
                    color="red"
                    @click="remove_item(item.saleProductId)"
                >
                    <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
            </td>

            </tr>
        </tbody>
        </template>
    </v-simple-table>

    <div v-for="comboitem in presupuestoActive.comboitems" :key="comboitem.id" style="border: 1px solid #cfcdcc" class="mt-1">
        <v-simple-table >
        <template v-slot:default>
        <tbody>
            <tr class="blue lighten-4"  >
                <td v-if="show_images" 
                            style="width: 110px;" 
                        ></td>
                <td><span class="font-weight-medium" >[Combo] {{ comboitem.name }}</span></td>
                <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(comboitem.precio) }}</td>
                <td v-if="comboitem.is_editing_cantidad " style="width: 100px;">
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
                
                <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(comboitem.precio, comboitem.cantidad)) }}</td>
                <td style="width: 40px;" class="pl-1 pr-1 " >
                    <v-btn small icon color="red"
                        @click="remove_combo_item(comboitem.comboId)"
                    >
                        <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                    
                </td>
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
                        <td><span class="ml-14" > {{ item.name }} </span></td>
                        <td style="width: 100px;"></td>
                        
                        <td style="width: 100px;"
                            class="text-right"
                            ></td>
                        <td style="width: 100px;"></td>
                        <td style="width: 40px;" class=" pl-1 pr-1 ">
                            <v-btn small icon color="green" :disabled="presupuestoActive.is_saved"
                                @click="item.is_editing_cantidades = !item.is_editing_cantidades"
                            >
                                <v-icon>mdi-swap-vertical</v-icon>
                            </v-btn>
                        </td>
                        
                    </tr>
                </tbody>
                </template>
            </v-simple-table>

                    

            
            
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

    },
    computed: {
        ...mapGetters({
            url_asset: 'url_asset',
            presupuestoActive: 'presupuestos_manager/presupuestoActive',
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
            remove_item: 'presupuestos_manager/remove_item',
            remove_combo_item: 'presupuestos_manager/remove_combo_item'
        }),
        set_cantidad(itemEdited){            
            for ( let item of this.presupuestoActive.items) {
                if ( item.saleProductId == itemEdited.id) {
                    item.cantidad = this.globalHelperFixeDecimalCantidad(itemEdited.value)

                    item.is_editing_cantidad = false
                    break
                }
            }
        },
        set_cantidad_combo(itemEdited){            
            for ( let comboitem of this.presupuestoActive.comboitems) {
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