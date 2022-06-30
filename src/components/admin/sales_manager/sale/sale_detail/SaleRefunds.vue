<template>
    <v-card>
        <v-card-title class="d-flex justify-space-between pb-2 pt-2">
            <span>Reintegros</span>
            <v-btn 
                x-small 
                @click="newRefundModalVisible = true"
                :disabled="saldoTotalSale >= 0"
            ><v-icon>mdi-plus</v-icon> </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-row v-for="(refund, index) in sale.relationships.refunds" :key="index" >  
                <v-col cols="12" sm="5"  class="d-flex justify-start pt-1 pb-1">
                    <span class="">{{ refund.attributes.name }}</span>
                </v-col>
                <v-col cols="10" sm="4"  class="d-flex justify-end pt-1 pb-1">
                    <span
                    >{{ globalHelperFixeDecimalMoney(refund.attributes.valor) }}</span>
                </v-col>
                <v-col cols="2" sm="3" class="pt-1 pb-1 d-flex justify-start align-center">
                    <v-btn
                        v-if="Object.prototype.hasOwnProperty.call(refund.attributes, 'is_confirmed') && !refund.attributes.is_confirmed"
                        icon
                        @click="showEditRefundModal ( refund )"
                        x-small
                        >
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn
                        v-else
                        icon
                        
                        x-small
                        >
                        <v-icon>mdi-eye</v-icon>
                    </v-btn>

                    <v-btn
                        v-if="Object.prototype.hasOwnProperty.call(refund.attributes, 'is_confirmed') && !refund.attributes.is_confirmed"
                        icon
                        @click="removeRefund ( refund )"
                        x-small
                        >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn
                        :loading="is_saving && refund_saving.id == refund.id"
                        v-if="Object.prototype.hasOwnProperty.call(refund.attributes, 'is_confirmed') && !refund.attributes.is_confirmed"
                        icon
                        @click="saveRefund ( refund )"
                        x-small
                        >
                        <v-icon>mdi-floppy</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-text>
        <NewRefundModal
            :saldoSale="saldoTotalSale"
            :dialogVisible="newRefundModalVisible"
            @close="newRefundModalVisible = false"
            @addRefund="addRefund"
            />
        <EditRefundModal
            :saldoSale="Number(saldoTotalSale)"
            :refund="refundShowed"
            :dialogVisible="editRefundModalVisible"
            @close="editRefundModalVisible = false"
            @updateRefund="updateRefund"
            />
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

import NewRefundModal from '@/components/admin/sales_manager/sale/sale_detail/NewRefundModal'
import EditRefundModal from '@/components/admin/sales_manager/sale/sale_detail/EditRefundModal'
export default {

    data () {
		return {
            is_saving: false,
            payment_saving: null,
			newRefundModalVisible: false,
            editRefundModalVisible: false,

            refundShowed: null
		}
    },

    components: {
        NewRefundModal,
        EditRefundModal
    },

    computed: {
        ...mapGetters({
            sale: 'sales_manager/sale',
            saldoTotalSale: 'sales_manager/saldoTotalSale',
        })
    },

    methods: {
        ...mapActions({
            save_refund: 'sales_manager/save_refund',
            add_refund: 'sales_manager/add_refund',
            update_refund: 'sales_manager/update_refund',
            remove_refund: 'sales_manager/remove_refund'
        }),

        addRefund(refund) {
            this.add_refund(refund)
            this.newRefundModalVisible = false
			
		},
        updateRefund( refund ) {
            this.update_refund(refund)
            this.editRefundModalVisible = false
        },

        showEditRefundModal ( refund ) {
            this.refundShowed = refund
            this.editRefundModalVisible = true
        },

        removeRefund ( refund ) {
            this.remove_refund ( refund )
        },
        async saveRefund ( refund ) {
            this.refund_saving = refund
            this.is_saving = true
            await this.save_refund ( refund )
                .then((resp) => {
                    refund.id = resp.data.data.id
                    refund.attributes.is_confirmed = true
                    this.$toast.success('El reintegro se ha guardado correctamente', { timeout: 3000 });
                })
                .catch(() => {
                    this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                })
            this.prefund_saving = false
            this.is_saving = false
        }
    }

    
}
</script>

<style>

</style>