<template>
    <div class="pa-sm-3" v-if="saleActive">
        <v-row>
            <v-col cols="12" md="9">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <div class="">
                            <span class="text-h4 font-weight-light">Sales Register</span>

                            
                        </div>
                        <div>
                                <v-btn
                                    v-for="sale in sales"
                                    :key="sale.id"
                                    @click="set_sale_active( sale.id )"
                                    :depressed="saleActive.id == sale.id"
                                    
                                    class="mr-1">
                                    Venta {{ sale.id }}
                                </v-btn>

                                <v-btn
                                    @click="create_sale()"
                                    class="mr-1">New
                                </v-btn>
                            </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <v-row class="">
                            <v-col cols="12" class="">
                                <v-row>
                                    <v-col cols="8"> 
                                        <SelectProduct />

                                    </v-col>
                                </v-row>
                                
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <ItemsSaleActive /> 
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="d-flex justify-end">
                                <v-btn
                                    @click="delete_sale(saleActive.id)"
                                    color="warning"
                                    text
                                >
                                    Cancelar
                                </v-btn>
                                <v-btn
                                    :disabled="!is_saleActive_ok_to_save"
                                    
                                    @click="save_sale"
                                    color="success"
                                    text
                                >
                                    Guardar
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-row class="">
                    <v-col cols="12">
                        <MenuClientSaleActive  />
                    </v-col>
                    <v-col cols="12">
                        Modelo fact
                    </v-col>
                    <v-col cols="12">
                        <TotalSale />
                    </v-col>
                    <v-col cols="12"
                        v-if="caja"
                    >
                        <MenuPaymentSaleActive 
                            v-if="caja"
                        />
                    </v-col>
                </v-row>
                
            </v-col>
            
        </v-row>
        <ShowTareasModal
            :dialogVisible="cargandoModalVisible"
            :is_registrandoVenta="is_registrandoVenta"

            @close="cerrarShowTareasModal"
            />
        
    </div>

</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

import ItemsSaleActive from '@/components/admin/sales/sale_register/ItemsSaleActive.vue'
import MenuClientSaleActive from '../../../components/admin/sales/sale_register/MenuClientSaleActive.vue'
import SelectProduct from '@/components/admin/sales/sale_register/SelectProduct'

import TotalSale from '@/components/admin/sales/sale_register/TotalSale'
import MenuPaymentSaleActive from '../../../components/admin/sales/sale_register/MenuPaymentSaleActive.vue'
import ShowTareasModal from '../../../components/admin/sales/sale_register/ShowTareasModal'




export default {

    mounted() {
        
        if ( this.sales.length == 0 ) {
            this.new_sale().then((sale) => {
                this.sale = sale
            })
        }
        
    },
    components: {
        ItemsSaleActive,
        MenuClientSaleActive,
        SelectProduct,
        TotalSale,
        MenuPaymentSaleActive,
        ShowTareasModal,
        
    },
    data: () => ({
        cargandoModalVisible: false,
        is_registrandoVenta: false
    }),
    computed: {
        ...mapGetters({
            sales: 'sale_manager/sales',
            saleActive: 'sale_manager/saleActive',
            caja: 'cajas_manager/caja',
            cantItemsSaleActive: 'sale_manager/cantItemsSaleActive',
            is_saleActive_ok_to_save: 'sale_manager/is_saleActive_ok_to_save'
            
        })
    },
    methods: {
        ...mapActions({
            new_sale: 'sale_manager/new_sale',
            set_sale_active: 'sale_manager/set_sale_active',
            remove_sale: 'sale_manager/remove_sale',
            save_saleActive: 'sale_manager/save_saleActive'
        }),

        create_sale () {
            this.new_sale().then((sale) => {
                this.sale = sale
            })
        },

        delete_sale(sale_id) {
            this.remove_sale(sale_id)
            if( this.sales.length == 0){
                this.new_sale()
            }else {
                const id = this.sales[0].id
                this.set_sale_active(id)
            }
        },

        async save_sale() {
            this.cargandoModalVisible = true
            this.is_registrandoVenta = true
            await this.save_saleActive()
                .then(() => {
                    this.is_registrandoVenta = false
                    if ( !this.cargandoModalVisible ) {
                        this.$toast.success('La Venta se ha generado correctamente', { timeout: 3000 });
                        if ( this.cantItemsSaleActive != 0 ) {
                            this.delete_sale(this.saleActive.id)
                        }
                    }
                })
                .catch(() => {
                    if ( !this.cargandoModalVisible ) {
                        this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                    }
                })
        },
        cerrarShowTareasModal() {
            this.cargandoModalVisible = false
            if ( this.cantItemsSaleActive != 0 ) {
                this.delete_sale(this.saleActive.id)
            }
            
        }
        
        
    }
}
</script>

<style>

</style>