<template>
    <v-card>
        <v-card-title class="d-flex justify-space-between pb-2 pt-2">
            <span>Pagos</span>
            <v-btn 
                v-if="caja"
                x-small 
                @click="newPaymentModalVisible = true"
                :disabled="saldoTotalSale <= 0 && false"
            ><v-icon>mdi-plus</v-icon> </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            <v-row v-for="(payment, index) in sale.relationships.payments" :key="index" >  
                <v-col cols="12" sm="5"  class="d-flex justify-start pt-1 pb-1">
                    <span class="">{{ payment.attributes.name }}</span>
                </v-col>
                <v-col cols="10" sm="4"  class="d-flex justify-end pt-1 pb-1 align-center">
                    <v-badge  color="error" dot :value="Object.prototype.hasOwnProperty.call(payment.attributes, 'is_confirmed') && !payment.attributes.is_confirmed"  >
                    <span>{{ globalHelperFixeDecimalMoney(payment.attributes.valor) }}</span>
                    </v-badge>
                </v-col>
                <v-col cols="2" sm="3" class="pt-1 pb-1 d-flex justify-start align-center">
                    <v-btn
                        v-if="Object.prototype.hasOwnProperty.call(payment.attributes, 'is_saved') && !payment.attributes.is_saved"
                        icon
                        @click="showEditPaymentModal ( payment )"
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
                        v-if="Object.prototype.hasOwnProperty.call(payment.attributes, 'is_saved') && !payment.attributes.is_saved"
                        icon
                        @click="removePayment ( payment )"
                        x-small
                        >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                    <v-btn
                        :loading="is_saving && payment_saving.id == payment.id"
                        v-if="Object.prototype.hasOwnProperty.call(payment.attributes, 'is_saved') && !payment.attributes.is_saved"
                        icon
                        @click="savePayment ( payment )"
                        x-small
                        >
                        <v-icon>mdi-floppy</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            
        </v-card-text>
        <NewPaymentModal
            :saldoSale="saldoTotalSale"
            :dialogVisible="newPaymentModalVisible"
            @close="newPaymentModalVisible = false"
            @addPayment="addPayment"
            />
        <EditPaymentModal
            :saldoSale="Number(saldoTotalSale)"
            :payment="paymentShowed"
            :dialogVisible="editPaymentModalVisible"
            @close="editPaymentModalVisible = false"
            @updatePayment="updatePayment"
            />
        
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

import NewPaymentModal from '@/components/admin/sales_manager/sale/sale_detail/NewPaymentModal'
import EditPaymentModal from '@/components/admin/sales_manager/sale/sale_detail/EditPaymentModal'
export default {

    data () {
		return {
            is_saving: false,
            payment_saving: null,
			newPaymentModalVisible: false,
            editPaymentModalVisible: false,

            paymentShowed: null
		}
    },

    components: {
        NewPaymentModal,
        EditPaymentModal
    },

    computed: {
        ...mapGetters({
            sale: 'sales_manager/sale',
            saldoTotalSale: 'sales_manager/saldoTotalSale',
            caja: 'cajas_manager/caja',
        })
    },

    methods: {
        ...mapActions({
            save_payment: 'sales_manager/save_payment',
            add_payment: 'sales_manager/add_payment',
            update_payment: 'sales_manager/update_payment',
            remove_payment: 'sales_manager/remove_payment',
            set_save_payment: 'sales_manager/set_save_payment',
        }),

        addPayment(payment) {
            this.add_payment(payment)
            this.newPaymentModalVisible = false
			
		},
        updatePayment( payment ) {
            this.update_payment(payment)
            this.editPaymentModalVisible = false
        },

        showEditPaymentModal ( payment ) {
            this.paymentShowed = payment
            this.editPaymentModalVisible = true
        },

        removePayment ( payment ) {
            this.remove_payment ( payment )
        },
        async savePayment ( payment ) {
            this.payment_saving = payment
            this.is_saving = true
            await this.save_payment ( payment )
                .then((resp) => {
                    this.set_save_payment({payment: payment, id: resp.data.data.id})
                    payment.id = resp.data.data.id
                    payment.attributes.is_saved = true

                    this.$set(payment.attributes, 'is_confirmed', resp.data.data.attributes.is_confirmed)
                    this.$toast.success('El pago se ha guardado correctamente', { timeout: 3000 });
                })
                .catch((e) => {
                    console.log(e)
                    this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                })
            this.payment_saving = false
            this.is_saving = false
        }
    }

    
}
</script>

<style>

</style>