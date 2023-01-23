<template>
  <div>
      <v-row>
            <v-col cols="12" sm="9">
                <v-row class="">
                    <v-col cols="12"><SaleItems /></v-col>
                </v-row>
                <v-row class="">
                    <v-col cols="12" class="pt-1">
                        <SaleResumen 
                            @showDevolutionEditingDetailMethod="$emit('showDevolutionEditingDetailMethod')"
                            @showCreditnoteEditingDetailMethod="$emit('showCreditnoteEditingDetailMethod')"
                            @showDebitnoteEditingDetailMethod="$emit('showDebitnoteEditingDetailMethod')"
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
                        <SaleComprobante 
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <SaleUser />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <SalePayments />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <SaleRefunds />
                    </v-col>
                </v-row>
                
            </v-col>
        </v-row>
        
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import SaleItems from '@/components/admin/sales_manager/sale/sale_detail/SaleItems'
import SalePayments from '@/components/admin/sales_manager/sale/sale_detail/SalePayments'
import SaleRefunds from '@/components/admin/sales_manager/sale/sale_detail/SaleRefunds'
import SaleResumen from '@/components/admin/sales_manager/sale/sale_detail/SaleResumen'
import SaleUser from '@/components/admin/sales_manager/sale/sale_detail/SaleUser'
import SaleClient from '@/components/admin/sales_manager/sale/sale_detail/SaleClient'
import SaleComprobante from '@/components/admin/sales_manager/sale/sale_detail/SaleComprobante'

export default {

    components: {
        SaleItems,
        SalePayments,
        SaleRefunds,
        SaleResumen,
        SaleUser,
        SaleClient,
        SaleComprobante,
        
    },

    computed: {
        ...mapGetters({
            caja: 'cajas_manager/caja'
        })
    }

}
</script>

<style>

</style>