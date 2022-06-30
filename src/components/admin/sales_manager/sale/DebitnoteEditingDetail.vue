<template>
  <div>
      <v-row>
            <v-col cols="12" sm="9">
                <v-row>
                    <v-col cols="12">
                        <DebitnoteEditingItems
                            :is_saving="is_saving"
                            @guardar_debitnote="guardar_debitnote"
                            @cancelar_debitnote="cancelar_debitnote"
                        /> 
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
                        <DebitnoteEditingTotal />
                    </v-col>
                </v-row>
                
            </v-col>
        </v-row>
  </div>
</template>

<script>
import { mapActions } from'vuex'

import SaleClient from '@/components/admin/sales_manager/sale/sale_detail/SaleClient'
import DebitnoteEditingTotal from '@/components/admin/sales_manager/sale/debitnote_editing_detail/DebitnoteEditingTotal'
import DebitnoteEditingItems from '@/components/admin/sales_manager/sale/debitnote_editing_detail/DebitnoteEditingItems'


export default {
    components: {
        SaleClient,
        DebitnoteEditingTotal,
        DebitnoteEditingItems,
    },

    data() {
        return {
            is_saving: false
        }
    },

    methods: {
        ...mapActions({
            save_debitnote: 'sales_manager/save_debitnote'
        }),

        async guardar_debitnote ( ) {
            this.is_saving = true
            await this.save_debitnote()
                .then((resp) => {
                    this.$emit('finalizar_debitnote', resp.data.data)
                    this.$toast.success('La nota de débito se ha generado correctamente', { timeout: 3000 });
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.message, { timeout: 3000 });
                })
            this.is_saving = false

        },

        cancelar_debitnote ( ) {
            this.$emit('cancelar_debitnote')
        }
    }
    
}
</script>

<style>

</style>