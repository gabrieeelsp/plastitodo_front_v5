<template>
  <div>
      <v-row>
            <v-col cols="12" sm="9">
                <v-row>
                    <v-col cols="12">
                        <CreditnoteItems
                            :creditnote="creditnote"
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
                        <CreditnoteComprobante 
                            :creditnote="creditnote"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <CreditnoteUser
                            :creditnote="creditnote"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <CreditnoteTotal 
                            :creditnote="creditnote"
                        />
                    </v-col>
                </v-row>
                
            </v-col>
        </v-row>
  </div>
</template>

<script>

import SaleClient from '@/components/admin/sales_manager/sale/sale_detail/SaleClient'
import CreditnoteUser from '@/components/admin/sales_manager/sale/creditnote_detail/CreditnoteUser'
import CreditnoteItems from '@/components/admin/sales_manager/sale/creditnote_detail/CreditnoteItems'
import CreditnoteTotal from '@/components/admin/sales_manager/sale/creditnote_detail/CreditnoteTotal'
import CreditnoteComprobante from '@/components/admin/sales_manager/sale/creditnote_detail/CreditnoteComprobante'

export default {
    props: {
        creditnote: Object,
    },
    components: {
        SaleClient,
        CreditnoteUser,
        CreditnoteItems,
        CreditnoteTotal,
        CreditnoteComprobante
    }

}
</script>

<style>

</style>