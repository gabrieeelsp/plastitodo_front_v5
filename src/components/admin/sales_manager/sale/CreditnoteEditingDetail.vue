<template>
  <div>
      <v-row>
            <v-col cols="12" sm="9">
                <v-row>
                    <v-col cols="12">
                        <CreditnoteEditingItems
                            :is_saving="is_saving"
                            @guardar_creditnote="guardar_creditnote"
                            @cancelar_creditnote="cancelar_creditnote"
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
                        <CreditnoteEditingTotal />
                    </v-col>
                </v-row>
                
            </v-col>
        </v-row>
  </div>
</template>

<script>
import { mapActions } from'vuex'

import SaleClient from '@/components/admin/sales_manager/sale/sale_detail/SaleClient'
import CreditnoteEditingTotal from '@/components/admin/sales_manager/sale/creditnote_editing_detail/CreditnoteEditingTotal'
import CreditnoteEditingItems from '@/components/admin/sales_manager/sale/creditnote_editing_detail/CreditnoteEditingItems'


export default {
    components: {
        SaleClient,
        CreditnoteEditingTotal,
        CreditnoteEditingItems,
    },

    data() {
        return {
            is_saving: false
        }
    },

    methods: {
        ...mapActions({
            save_creditnote: 'sales_manager/save_creditnote'
        }),

        async guardar_creditnote ( ) {
            this.is_saving = true
            await this.save_creditnote()
                .then((resp) => {
                    this.$emit('finalizar_creditnote', resp.data.data)
                    this.$toast.success('La nota de Crédito se ha generado correctamente', { timeout: 3000 });
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.message, { timeout: 3000 });
                })
            this.is_saving = false

        },

        cancelar_creditnote ( ) {
            this.$emit('cancelar_creditnote')
        }
    }
    
}
</script>

<style>

</style>