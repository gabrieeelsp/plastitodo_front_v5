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
                                        <SelectProduct
                                            :disabled="saleActive.is_saved"
                                         />

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
                                    Cerrar
                                </v-btn>
                                <v-btn
                                    :disabled="!is_saleActive_ok_to_save || saleActive.is_saved || !is_saleActive_complete_total"
                                    
                                    @click="save_sale"
                                    color="success"
                                    
                                    :loading="is_registrandoVenta"
                                >
                                    
                                    Guardar
                                    <v-icon right>
                                        mdi-content-save-outline
                                    </v-icon>
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
                        <ModeloFactSaleActive
                            v-if="!saleActive.is_saved"
                        />
                        <SaleComprobante
                            v-else
                            :sale="sale_saved"
                            :is_facturando="is_facturando"
                            :ivacondition_id_prop="this.saleActive.ivacondition_id"
                        />
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
    
    </div>

</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

import ItemsSaleActive from '@/components/admin/sales/sale_register/ItemsSaleActive.vue'
import MenuClientSaleActive from '../../../components/admin/sales/sale_register/MenuClientSaleActive.vue'
import SelectProduct from '@/components/admin/sales/sale_register/SelectProduct'
import ModeloFactSaleActive from '@/components/admin/sales/sale_register/ModeloFactSaleActive'
import SaleComprobante from '@/components/admin/sales/sale_register/SaleComprobante'

import TotalSale from '@/components/admin/sales/sale_register/TotalSale'
import MenuPaymentSaleActive from '../../../components/admin/sales/sale_register/MenuPaymentSaleActive.vue'





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
        SaleComprobante,
        ModeloFactSaleActive
    },
    data: () => ({

        is_registrandoVenta: false,
        is_facturando: false,
        sale_saved: null,
    }),
    computed: {
        ...mapGetters({
            sales: 'sale_manager/sales',
            saleActive: 'sale_manager/saleActive',
            caja: 'cajas_manager/caja',
            cantItemsSaleActive: 'sale_manager/cantItemsSaleActive',
            is_saleActive_ok_to_save: 'sale_manager/is_saleActive_ok_to_save',
            is_saleActive_complete_total: 'sale_manager/is_saleActive_complete_total',
            
        })
    },
    methods: {
        ...mapActions({
            new_sale: 'sale_manager/new_sale',
            set_sale_active: 'sale_manager/set_sale_active',
            remove_sale: 'sale_manager/remove_sale',
            save_saleActive: 'sale_manager/save_saleActive',
            generate_comprobante: 'sale_manager/generate_comprobante',

            set_sale_active_saved: 'sale_manager/set_sale_active_saved',
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
            this.is_registrandoVenta = true
            await this.save_saleActive()
                .then((resp) => {
                    //console.log(resp.data.data)
                    this.saleActive.id = resp.data.data.id
                    this.saleActive.sale_saved = resp.data.data
                    this.saleActive.is_saved = true
                    

                    this.$toast.success('La Venta se ha generado correctamente', { timeout: 3000 });
                })  
                .catch((error) => {
                    this.$toast.error(error.response.data.message, { timeout: 3000 });
                }).finally(() =>{
                    this.is_registrandoVenta = false
                })

            if ( this.saleActive.is_saved && this.saleActive.ivacondition_id != 0 ) {
                this.emitir_factura()
            }

            /* this.cargandoModalVisible = true
            this.is_registrandoVenta = true
            await this.save_saleActive()
                .then(() => {
                    
                    this.is_registrandoVenta = false
                    this.error_saving_message = null
                    if ( !this.cargandoModalVisible ) {
                        this.$toast.success('La Venta se ha generado correctamente', { timeout: 3000 });
                        if ( this.cantItemsSaleActive != 0 ) {
                            this.delete_sale(this.saleActive.id)
                        }
                    }
                })
                .catch((error) => {
                    this.is_registrandoVenta = false

                    this.error_saving_message = error.response.data.message
                    if ( !this.cargandoModalVisible ) {
                        this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                    }
                }) */
            
            
        },

        async emitir_factura() {
            this.is_facturando = true
            await this.generate_comprobante (this.saleActive.ivacondition_id)
                .then((resp) => {
                    this.$toast.success('El comprobante se ha generado correctamente', { timeout: 3000 });
                    this.saleActive.sale_saved.relationships.comprobante = resp.data.data
                    //console.log(resp)
                })
                .catch((error) => {
                    //console.log(error)
                    this.$toast.error(error.response.data.message, { timeout: 3000 });
                })
                .finally(() => {
                    this.is_facturando = false
                })
        },

        
        
        
    }
}
</script>

<style>

</style>