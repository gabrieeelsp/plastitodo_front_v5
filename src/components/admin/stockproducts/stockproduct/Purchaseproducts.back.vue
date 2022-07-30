<template>
    <div v-if="item">
        <v-row>
            <v-col class="d-flex justify-space-between align-center pt-1 pb-1">
                <span class="text-h6 text--black font-weight-medium">{{ item.attributes.name }}</span>

                <PurchaseproductNew
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
                                Rel./Compra
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
                            v-for="purchaseproduct in item.relationships.purchaseproducts"
                            :key="purchaseproduct.id"
                        >
                        <td>{{ purchaseproduct.id }}</td>
                        <td >{{ purchaseproduct.attributes.name }}</td>

                        <td class="text-right">{{ purchaseproduct.attributes.relacion_compra_stock }}</td>
                        <td class="text-right" v-if="purchaseproduct.attributes.is_enable"><v-chip x-small class="ma-2" color="success" >Enable</v-chip></td>
                        <td class="text-right" v-else><v-chip x-small class="ma-2" color="warning" >Disable</v-chip></td>
                        <td>
                            <PurchaseproductEdit
                                :purchaseproduct="purchaseproduct"
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
import PurchaseproductEdit from '@/components/admin/stockproducts/stockproduct/PurchaseproductEdit'
import PurchaseproductNew from '@/components/admin/stockproducts/stockproduct/PurchaseproductNew'
export default {
    created() {

    },
    computed: {
        ...mapGetters({
            item: 'stockproducts_manager/item',
        })
    },
    components: {
        PurchaseproductEdit,
        PurchaseproductNew
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
        },

    }
}
</script>

<style>
    
</style>