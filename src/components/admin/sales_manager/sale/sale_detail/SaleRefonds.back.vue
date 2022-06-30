<template>
    <v-card>
        <v-card-title class="d-flex justify-space-between pb-2 pt-2">
            <span>Reintegros</span>
            <v-btn 
                x-small 
                @click="newRefondModalVisible = true"
                :disabled="saldoTotalSale >= 0"
            ><v-icon>mdi-plus</v-icon> </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-row v-for="(refond, index) in sale.relationships.refonds" :key="index" >  
                <v-col cols="12" sm="5"  class="d-flex justify-start pt-1 pb-1">
                    <span class="">{{ refond.attributes.name }}</span>
                </v-col>
                <v-col cols="10" sm="5"  class="d-flex justify-end pt-1 pb-1">
                    <span
                    >{{ globalHelperFixeDecimalMoney(refond.attributes.valor) }}</span>
                </v-col>
                <v-col cols="2" sm="2" class="pt-1 pb-1 d-flex align-center">
                    <v-btn
                        icon

                        x-small
                        >
                        <v-icon>mdi-eye</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
        <NewRefondModal
            :saldoSaleActive="saldoTotalSale"
            :dialogVisible="newRefondModalVisible"
            @close="newRefondModalVisible = false"
            @addRefond="addRefond"
            />
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

import NewRefondModal from '@/components/admin/sales_manager/sale/sale_detail/NewRefondModal'
export default {

    data () {
		return {
			newRefondModalVisible: false
		}
    },

    components: {
        NewRefondModal
    },

    computed: {
        ...mapGetters({
            sale: 'sales_manager/sale',
            saldoTotalSale: 'sales_manager/saldoTotalSale',
        })
    },

    methods: {
        ...mapActions({
            add_refond: 'sales_manager/add_refond'
        }),

        addRefond(refond) {
			this.newRefondModalVisible = false,
			this.add_refond(refond)			
		}
    }

    
}
</script>

<style>

</style>