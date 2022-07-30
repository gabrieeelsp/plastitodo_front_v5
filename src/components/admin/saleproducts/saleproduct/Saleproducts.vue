<template>
    <div v-if="item">
        <v-row>
            <v-col class="d-flex justify-space-between align-center pt-1 pb-1">
                <span class="text-h6 text--black font-weight-medium">{{ item.attributes.name }}</span>

                <SaleproductNew
                    :stockproduct="item"

                    @reload_item="reload_item"
                />
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
                                Rel./Venta
                            </th>
                            <th   
                            style="width: 100px;"                              
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Venta
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
                        v-for="saleproduct in item.relationships.saleproducts"
                        :key="saleproduct.id"
                        >
                        <td>{{ saleproduct.id }}</td>
                        <td >{{ saleproduct.attributes.name }}</td>

                        <td class="text-right">{{ saleproduct.attributes.relacion_venta_stock }}</td>
                        <td class="text-right" v-if="saleproduct.attributes.is_enable"><v-chip x-small class="ma-2" color="success" >Enable</v-chip></td>
                        <td class="text-right" v-else><v-chip x-small class="ma-2" color="warning" >Disable</v-chip></td>
                        <td>
                            <SaleproductEdit
                                :saleproduct="saleproduct"
                                :stockproduct="item"
                            />
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
import { mapGetters, mapActions } from 'vuex'
import SaleproductEdit from '@/components/admin/stockproducts/stockproduct/SaleproductEdit'
import SaleproductNew from '@/components/admin/stockproducts/stockproduct/SaleproductNew'
export default {
    created() {

    },
    computed: {
        ...mapGetters({
            item: 'stockproducts_manager/item',
        })
    },
    components: {
        SaleproductEdit,
        SaleproductNew
    },
    data () {
        return {
            
        }
    },
    methods: {
        ...mapActions({
            
        }),
        
        nuevo_subitem () {

        },

        volver() {
            this.$emit('volver')
        },

        reload_item () {
            this.$emit('reload_item')
        }
    }
}
</script>

<style>
    
</style>