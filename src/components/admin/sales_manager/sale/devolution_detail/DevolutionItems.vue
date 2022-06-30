<template>
<div>
    <v-simple-table class="">
        <template v-slot:default>
        <thead class="lighten-5">
            <tr>
            <th class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-2">
                Producto 
            </th>
            <th 
                style="width: 100px;"
                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-2">
                Precio
            </th>
            <th
                style="width: 100px;"
             class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-2">
                Cantidad
            </th>
            <template v-if="is_saleStockUnitario">
            <th
                style="width: 100px;"
             class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-2">
                Peso
            </th>
            </template>
            <th 
                style="width: 100px;"
                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-2">
                SubTotal
            </th>            
            </tr>
        </thead>
        <tbody>
            <tr
            v-for="item in devolution.relationships.devolutionitems"
            :key="item.id"
            >
            <td>{{ item.attributes.name }}</td>

            
            <td 
                class="text-right"
                >{{ globalHelperFixeDecimalMoney(item.attributes.precio) }}</td>
            
            <td 
                class="text-right"
                >{{ globalHelperFixeDecimalCantidad(item.attributes.cantidad) }}</td>

            <template v-if="is_saleStockUnitario">
                <td 
                    v-if="item.attributes.is_stock_unitario_variable"
                    class="text-right"
                >
                    {{ globalHelperFixeDecimalCantidad(item.attributes.cantidad_total) }}
                </td>
    
                <td v-else class="text-right" >-------</td>

            </template>            
            <td v-if="item.attributes.is_stock_unitario_variable" class="text-right">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotalStockUnitario(item.attributes.precio, item.attributes.cantidad, item.attributes.stock_aproximado_unidad, item.attributes.cantidad_total)) }}</td>
            <td v-else class="text-right">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(item.attributes.precio, item.attributes.cantidad)) }}</td>
            
            </tr>
        </tbody>
        
        </template>
        
    </v-simple-table>
    <v-simple-table class="" style="border-top: 1px solid #e8e6e6;"
            v-for="comboitem in devolution.relationships.devolutioncomboitems"
                :key="comboitem.id"
        >
        <template v-slot:default>
            
            <tbody>
                <tr>
                    <td >[Combo] {{ comboitem.attributes.name }}</td>
                    <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(comboitem.attributes.precio) }}</td>
                    <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(comboitem.attributes.cantidad) }}</td>
                    
                    <template v-if="is_saleStockUnitario">
                        <td class="text-right" style="width: 100px;">-------</td>
                    </template> 
                    <td class="text-right" style="width: 100px;">{{ globalHelperFixeDecimalMoney(globalHelperCalculaSubTotal(comboitem.attributes.precio, comboitem.attributes.cantidad)) }}</td>
                </tr>
                <tr 
                    v-for="devcombosaleproduct in comboitem.relationships.devolutioncombosaleproducts" :key="devcombosaleproduct.id"
                    class="text-subtitle-1 grey--text text--darken-2 pt-0"
                >   
                    <td class="pl-6">* {{ devcombosaleproduct.attributes.name }}</td>
                    <td ></td>
                    <td style="width: 100px;" class="text-right">{{ globalHelperFixeDecimalMoney(devcombosaleproduct.attributes.cantidad) }}</td>
                        
                    <td colspan="3"></td>
                </tr>
            </tbody>

        </template>
    </v-simple-table>
    
</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    props: {
        devolution: Object
    },
    computed: {
        ...mapGetters({
            sale: 'sales_manager/sale',
            is_saleStockUnitario: 'sales_manager/is_saleStockUnitario'
        })
    },    
    components: {
        
        
    },

    data: () => ({
        
    }),
    methods: {

    },
}
</script>

<style>

</style>