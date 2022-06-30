<template>
  <div>
      <v-row>
            <v-col cols="12" sm="9">
                <v-row>
                    <v-col cols="12">
                        <DevolutionEditingItems
                            :devolution="devolution"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12">
                        <v-btn
                            @click="cancelar"
                        >Cancelar</v-btn>
                        <v-btn
                            :loading="is_saving" 
                            @click="guardar"
                        >Guardar</v-btn>
                    </v-col>
                </v-row>
                
            </v-col>
            <v-col cols="12" sm="3">
                <v-row>
                    <v-col>
                        <SaleClient />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <DevolutionEditingTotal />
                    </v-col>
                </v-row>
                
            </v-col>
        </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

import DevolutionEditingItems from '@/components/admin/sales_manager/sale/devolution_editing_detail/DevolutionEditingItems'
import SaleClient from '@/components/admin/sales_manager/sale/sale_detail/SaleClient'
import DevolutionEditingTotal from '@/components/admin/sales_manager/sale/devolution_editing_detail/DevolutionEditingTotal'


export default {
    props: {
        devolution: Object,
        is_saleStockUnitario: Boolean
    },
    components: {
        DevolutionEditingItems,
        SaleClient,
        DevolutionEditingTotal
    },

    data() {
        return {
            is_saving: false
        }
    },
    computed: {
        ...mapGetters({
            totalDevolution: 'sales_manager/totalDevolution',
            totalDisponibleCredito: 'sales_manager/totalDisponibleCredito'
        })
    },

    methods: {
        ...mapActions({
            save_devolution: 'sales_manager/save_devolution'
        }),

        async guardar ( ) {
            
            this.is_saving = true
            
            await this.save_devolution()
                .then((resp) => {                        
                    this.$emit('finalizar_devolution', resp.data.data)
                    this.$toast.success('La devolución se ha generado correctamente', { timeout: 3000 });
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.message, { timeout: 3000 });
                })
            this.is_saving = false
            
            
        },

        cancelar ( ) {
            this.$emit('cancelar_devolution')
        }
    }
    
}
</script>

<style>

</style>