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
                Cant disp
            </th>
            <th
                style="width: 100px;"
             class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                Cantidad
            </th>
            <template v-if="is_saleStockUnitario">
            <th
                style="width: 100px;"
             class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                Peso disp
            </th>
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
            <tr
            v-for="item in devolution.devitems"
            :key="item.id"

            :class="[(item.is_devolution_item ) ? 'blue lighten-5': '', (item.cant_disponible_devolucion == 0) ? 'text--disabled' : '']"
            >
                <td class="d-flex align-center text-left pl-1 ">
                        <v-checkbox class="pt-0 mt-0 pl-0"
                            v-model="item.is_devolution_item"
                            hide-details=""
                            :disabled="item.cant_disponible_devolucion == 0"
                        >
                        </v-checkbox>
                        <span class="ml-1">{{ item.name }}</span>
                    </td>
            
            
            
            
            <td 
                class="text-right"
                >{{ globalHelperFixeDecimalMoney(item.precio) }}</td>

            <td 
                class="text-right"
                >{{ globalHelperFixeDecimalCantidad(item.cant_disponible_devolucion) }}</td>


            <td 
                style="" 
                v-if="item.is_editing_cantidad && item.cant_disponible_devolucion != 0"
                class=""
                >
                
                <InputEditValue
                    :item="{
                        id: item.saleitem_id,
                        value: item.cantidad,
                        max_value: item.cant_disponible_devolucion
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




            <template v-if="is_saleStockUnitario">
                <td 
                    v-if="item.is_stock_unitario_variable"
                    class="text-right"
                >{{ globalHelperFixeDecimalCantidad(item.cant_total_disponible_devolucion) }}</td>
                <td
                    v-else
                    class="text-right"
                    >
                    ----------------
                </td>


                <td 
                    v-if="(item.is_stock_unitario_variable && !item.is_editing_cantidad_total) || item.cant_disponible_devolucion == 0"
                    class="text-right"
                    @dblclick="item.is_editing_cantidad_total = true"
                    >
                    {{ globalHelperFixeDecimalCantidad(item.cantidad_total) }}
                </td>
                <td 
                
                    v-else-if="item.is_stock_unitario_variable && item.is_editing_cantidad_total"
                    class="text-right"
                    >
                    
                    <InputEditValue
                        :item="{
                            id: item.saleitem_id,
                            value: item.cantidad_total,
                            max_value: item.cant_total_disponible_devolucion
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

            
            <template v-if="item.cant_disponible_devolucion != 0">
                <td v-if="item.is_stock_unitario_variable" class="text-right">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotalStockUnitario(item.precio, item.cantidad, item.stock_aproximado_unidad, item.cantidad_total)) }}</td>

                <td v-else class="text-right">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(item.precio, item.cantidad)) }}</td>
            </template>
            <template v-else>
                <td
                    class="text-right"
                >------</td>
            </template>
            </tr>
        </tbody>
        
        </template>
        
    </v-simple-table>


    <v-simple-table class="" style="border-top: 1px solid #e8e6e6;"
            v-for="comboitem in devolution.devcomboitems"
                :key="comboitem.id"
        >
        <template v-slot:default>
            
            <tbody>
                <tr
                    :class="[(comboitem.is_devolution_item ) ? 'blue lighten-5': '', (comboitem.cant_disponible_devolucion == 0) ? 'text--disabled' : '']"
                >
                    <td class="d-flex align-center text-left pl-1 ">
                        <v-checkbox class="pt-0 mt-0 pl-0"
                            v-model="comboitem.is_devolution_item"
                            hide-details=""
                            :disabled="comboitem.cant_disponible_devolucion == 0"
                        >
                        </v-checkbox>
                        <span class="ml-1">[Combo] {{ comboitem.name }}</span>
                    </td>
                    <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(comboitem.precio) }}</td>
                    <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalCantidad(comboitem.cant_disponible_devolucion) }}</td>
                    <td 
                        style="" 
                        v-if="comboitem.is_editing_cantidad && comboitem.cant_disponible_devolucion != 0"
                        class=""
                        >                        
                        <InputEditValue
                            :item="{
                                id: comboitem.salecomboitem_id,
                                value: comboitem.cantidad,
                                max_value: comboitem.cant_disponible_devolucion
                            }"                  

                            @close="comboitem.is_editing_cantidad = false"
                            @accept="set_cantidad_combo"
                        />
                    </td>
                    <td v-else
                        @dblclick="comboitem.is_editing_cantidad = true"
                        class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalCantidad(comboitem.cantidad) }}</td>
                    <template v-if="is_saleStockUnitario">
                        <td class="text-right" style="width: 100px;">-------</td>
                        <td class="text-right" style="width: 100px;">-------</td>
                    </template> 
                    <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(comboitem.precio, comboitem.cantidad)) }}</td>
                </tr>
                <tr 
                    v-for="devcombosaleproduct in comboitem.devcombosaleproducts" :key="devcombosaleproduct.id"
                    :class="[(devcombosaleproduct.is_devolution_item ) ? 'blue lighten-5': '', (devcombosaleproduct.cant_disponible_devolucion == 0) ? 'text--disabled' : '']"
                    class="text-subtitle-1 grey--text text--darken-2 pt-0"
                >   
                    <td   class="d-flex align-center text-left pl-1 ">
                        <v-checkbox class="pt-0 mt-0 pl-0"
                            v-model="devcombosaleproduct.is_devolution_item"
                            hide-details=""
                            :disabled="devcombosaleproduct.cant_disponible_devolucion == 0"
                        >
                        </v-checkbox>
                        <span class="ml-6">* {{ devcombosaleproduct.name }}</span>
                    </td>
                    <td ></td>
                    <td 
                        style="width: 100px;"
                        class="text-right"
                        >{{ globalHelperFixeDecimalMoney(devcombosaleproduct.cant_disponible_devolucion) }}</td>

                    <td 
                        style="" 
                        v-if="devcombosaleproduct.is_editing_cantidad && devcombosaleproduct.cant_disponible_devolucion != 0"
                        class=""
                        >                        
                        <InputEditValue
                            :item="{
                                id: devcombosaleproduct.salecombosaleproduct_id,
                                value: devcombosaleproduct.cantidad,
                                max_value: devcombosaleproduct.cant_disponible_devolucion
                            }"                  

                            @close="devcombosaleproduct.is_editing_cantidad = false"
                            @accept="set_cantidad_combosaleproduct"
                        />
                    </td>
                        
                    <td v-else
                        @dblclick="devcombosaleproduct.is_editing_cantidad = true"
                        style="width: 100px;"
                        class="text-right"
                        >{{ globalHelperFixeDecimalMoney(devcombosaleproduct.cantidad) }}</td>
                    <td colspan="3"></td>
                </tr>
            </tbody>

        </template>
    </v-simple-table>

    
</div>
    
    
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import InputEditValue from '@/components/admin/utils/InputEditValue'
export default {


    computed: {
        ...mapGetters({
            devolution: 'sales_manager/devolution_editing',
            is_saleStockUnitario: 'sales_manager/is_saleStockUnitario'
        })
    },
    components: {  
        InputEditValue
    },

    data: () => ({
        item_editing: null,
    }),
    methods: {
        ...mapActions({

        }),
        set_cantidad(itemEdited){ 
            for ( let item of this.devolution.devitems) {
                if ( item.saleitem_id == itemEdited.id) {
                    item.cantidad = itemEdited.value

                    item.is_editing_cantidad = false
                    break
                }
            }
        },
        set_cantidad_combo(comboitemEdited){ 
            for ( let comboitem of this.devolution.devcomboitems) {
                if ( comboitem.salecomboitem_id == comboitemEdited.id) {
                    comboitem.cantidad = comboitemEdited.value

                    comboitem.is_editing_cantidad = false
                    break
                }
            }
        },

        set_cantidad_combosaleproduct(combosaleproductEdited) {
            for ( let comboitem of this.devolution.devcomboitems) {
                for ( let combosaleproduct of comboitem.devcombosaleproducts ) {
                    if ( combosaleproduct.salecombosaleproduct_id == combosaleproductEdited.id) {
                        combosaleproduct.cantidad = combosaleproductEdited.value
                        combosaleproduct.is_editing_cantidad = false
                    }
                }
            }
        },
        
        set_cantidad_total(itemEdited){              
            for ( let item of this.devolution.devitems) {
                if ( item.saleitem_id == itemEdited.id) {
                    item.cantidad_total = itemEdited.value

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