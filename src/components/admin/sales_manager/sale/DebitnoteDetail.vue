<template>
  <div>
      <v-row>
            <v-col cols="12" sm="9">
                <v-row>
                    <v-col cols="12">
                        <DebitnoteItems
                            :debitnote="debitnote"
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
                        <DebitnoteComprobante
                            :debitnote="debitnote"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <DebitnoteUser
                            :debitnote="debitnote"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <DebitnoteTotal 
                            :debitnote="debitnote"
                        />
                    </v-col>
                </v-row>
                
            </v-col>
        </v-row>
  </div>
</template>

<script>

import SaleClient from '@/components/admin/sales_manager/sale/sale_detail/SaleClient'
import DebitnoteUser from '@/components/admin/sales_manager/sale/debitnote_detail/DebitnoteUser'

import DebitnoteTotal from '@/components/admin/sales_manager/sale/debitnote_detail/DebitnoteTotal'
import DebitnoteItems from '@/components/admin/sales_manager/sale/debitnote_detail/DebitnoteItems'
import DebitnoteComprobante from '@/components/admin/sales_manager/sale/debitnote_detail/DebitnoteComprobante'

export default {
    props: {
        debitnote: Object,
    },
    components: {
        SaleClient,
        DebitnoteUser,
        
        DebitnoteTotal,
        DebitnoteItems,
        DebitnoteComprobante
    }

}
</script>

<style>

</style>