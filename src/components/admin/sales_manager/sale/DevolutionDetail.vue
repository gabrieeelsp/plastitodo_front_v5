<template>
  <div>
      <v-row>
            <v-col cols="12" sm="9">
                <DevolutionItems
                    :devolution="devolution"
                />
            </v-col>
            <v-col cols="12" sm="3">
                <v-row>
                    <v-col>
                        <SaleClient />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <DevolutionComprobante
                            :devolution="devolution"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <DevolutionUser
                            :devolution="devolution"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <DevolutionTotal 
                            :devolution="devolution"
                        />
                    </v-col>
                </v-row>
                
            </v-col>
        </v-row>

  </div>
</template>

<script>

import DevolutionItems from '@/components/admin/sales_manager/sale/devolution_detail/DevolutionItems'
import DevolutionUser from '@/components/admin/sales_manager/sale/devolution_detail/DevolutionUser'
import SaleClient from '@/components/admin/sales_manager/sale/sale_detail/SaleClient'
import DevolutionTotal from '@/components/admin/sales_manager/sale/devolution_detail/DevolutionTotal'
import DevolutionComprobante from '@/components/admin/sales_manager/sale/devolution_detail/DevolutionComprobante'

export default {
    props: {
        devolution: Object,
        is_saleStockUnitario: Boolean
    },
    components: {
        DevolutionItems,
        DevolutionUser,
        SaleClient,
        DevolutionTotal,
        DevolutionComprobante
    }

}
</script>

<style>

</style>