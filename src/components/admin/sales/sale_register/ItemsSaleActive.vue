<template>
<div>
    <v-simple-table>
        <template v-slot:default>
        <thead>
            <tr>
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
            <template v-if="is_saleActiveStockUnitarioVariable">
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
                style="width: 28px;"
                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                
            </th>
            
            </tr>
        </thead>
        <tbody>
            <tr
            v-for="item in saleActive.items"
            :key="item.id"
            :class="item.is_confirmado ? 'light-green lighten-4' : ''"
            >

            <td>{{ item.name }}</td>

            
            <td 
                class="text-right"
                >{{ globalHelperFixeDecimalMoney(item.precio) }}</td>
            <td 
                style="" 
                v-if="item.is_editing_cantidad && !saleActive.is_saved"
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

            <template v-if="is_saleActiveStockUnitarioVariable">
                <td 
                v-if="item.is_stock_unitario_variable && !item.is_editing_cantidad_total"
                class="text-right"
                @dblclick="item.is_editing_cantidad_total = true"
                >
                {{ globalHelperFixeDecimalCantidad(item.cantidad_total) }}
            </td>
            <td 
            
                v-else-if="item.is_stock_unitario_variable && item.is_editing_cantidad_total && !saleActive.is_saved"
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

            

            <td v-if="item.is_stock_unitario_variable" class="text-right">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotalStockUnitario(item.precio, item.cantidad, item.stock_aproximado_unidad, item.cantidad_total)) }}</td>

            <td v-else class="text-right">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(item.precio, item.cantidad)) }}</td>
            <td class="pl-1 pr-1">
                <v-btn
                :disabled="saleActive.is_saved"
                    small
                    icon
                    color="red"
                    @click="remove_item(item.saleProductId)"
                >
                    <v-icon>mdi-delete-outline</v-icon>
                </v-btn>
            </td>
            <td class="pl-1 pr-1">
                <v-checkbox
                    class="mt-0 pr-0"
                    hide-details=""
                    
                    v-model="item.is_confirmado"
                ></v-checkbox>
            </td>
            </tr>
        </tbody>
        </template>
    </v-simple-table>

    <div v-for="comboitem in saleActive.comboitems" :key="comboitem.id" style="border: 1px solid #cfcdcc" class="mt-1">
        <v-simple-table >
        <template v-slot:default>
        <tbody>
            <tr class="blue lighten-4"  >
                <td><span class="font-weight-medium" :class="comboitem.is_complete() ? '' : 'red--text'">[Combo] {{ comboitem.name }}</span></td>
                <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(comboitem.precio) }}</td>
                <td v-if="comboitem.is_editing_cantidad && !saleActive.is_saved" style="width: 100px;">
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
                <td v-if="is_saleActiveStockUnitarioVariable" style="width: 100px;" class="text-right" >----------------</td>
                <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(comboitem.precio, comboitem.cantidad)) }}</td>
                <td style="width: 80px;" class="pl-1" >
                    <v-btn small icon color="red" :disabled="saleActive.is_saved"
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
                        <td><span class="ml-3" :class="item.is_complete() ? '' : 'red--text'"> {{ item.name }} [ {{ globalHelperFixeDecimalCantidad(item.cantidad * item.cantidad_combos) }} ]</span></td>
                        <td style="width: 100px;"></td>
                        
                        <td style="width: 100px;"
                            class="text-right"
                            ></td>
                        <td style="width: 100px;"></td>
                        <td style="width: 90px;">
                            <v-btn small icon color="green" :disabled="saleActive.is_saved"
                                @click="item.is_editing_cantidades = !item.is_editing_cantidades"
                            >
                                <v-icon>mdi-swap-vertical</v-icon>
                            </v-btn>
                        </td>
                        
                    </tr>
                </tbody>
                </template>
            </v-simple-table>

                    

            <v-simple-table dense v-for="saleproduct in item.saleproducts" :key="saleproduct.id">
                <template v-slot:default>
                <tbody>

                    <tr v-if="saleproduct.cantidad != 0" >
                        <td><span class="ml-6">* {{ saleproduct.name }}</span></td>
                        <td style="width: 100px;"></td>
                        <td v-if="saleproduct.is_editing_cantidad  && !saleActive.is_saved" style="width: 100px;">
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
                        <td style="width: 100px;"></td>
                        <td style="width: 90px;"></td>
                    </tr>
                </tbody>
                </template>
            </v-simple-table>
            <v-expand-transition>
            <div v-if="item.is_editing_cantidades  && !saleActive.is_saved">
                <v-simple-table dense v-for="saleproduct in item.saleproducts" :key="saleproduct.id">
                    <template v-slot:default>
                    <tbody>

                        <tr v-if="saleproduct.cantidad == 0" >
                            <td><span class="ml-6">* {{ saleproduct.name }}</span></td>
                            <td style="width: 100px;"></td>
                            <td v-if="saleproduct.is_editing_cantidad" style="width: 100px;">
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
                            <td style="width: 100px;"></td>
                            <td style="width: 90px;"></td>
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
        for ( let item of this.saleActive.items ) {
            this.$set(item, 'is_confirmado', false)
        }
    },
    computed: {
        ...mapGetters({
            saleActive: 'sale_manager/saleActive',
            is_saleActiveStockUnitarioVariable: 'sale_manager/is_saleActiveStockUnitarioVariable',
        })
    },
    components: {
        
        InputEditValue
    },

    data: () => ({
        show_images: true,
        item_editing: null,
    }),
    methods: {
        ...mapActions({
            remove_item: 'sale_manager/remove_item',
            remove_combo_item: 'sale_manager/remove_combo_item'
        }),
        set_cantidad(itemEdited){            
            for ( let item of this.saleActive.items) {
                if ( item.saleProductId == itemEdited.id) {
                    item.cantidad = this.globalHelperFixeDecimalCantidad(itemEdited.value)

                    item.is_editing_cantidad = false
                    break
                }
            }
        },
        set_cantidad_combo(itemEdited){            
            for ( let comboitem of this.saleActive.comboitems) {
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
            for ( let comboitem of this.saleActive.comboitems) {
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
            for ( let item of this.saleActive.items) {
                if ( item.saleProductId == itemEdited.id) {
                    item.precio = this.globalHelperFixeDecimalMoney(itemEdited.cantidad)

                    item.is_editing_precio = false
                    break
                }
            }
        },

        set_cantidad_total(itemEdited){  
            
            for ( let item of this.saleActive.items) {
                if ( item.saleProductId == itemEdited.id) {
                    item.cantidad_total = this.globalHelperFixeDecimalCantidad(itemEdited.value)

                    item.is_editing_cantidad_total = false
                    break
                }
            }
        },


    },
}
</script>

<style>

</style>