<template>

	<v-card class="">
		<v-card-text >
			
            <v-row class="green lighten-5 mb-1">
				
				<v-col cols="12"  class="d-flex justify-center align-center">
					<span class="title">Pagos</span>
					<v-btn
						icon
						color="green"
						class="ml-2"
						@click="newPaymentModalVisible = true"
						>
						<v-icon>mdi-plus</v-icon>
						
					</v-btn>

					<NewPaymentModal
					:saldoSaleActive="saldoSaleActive"
						:dialogVisible="newPaymentModalVisible"
						@close="newPaymentModalVisible = false"
						@addPayment="addPayment"
						/>
				</v-col>
			</v-row>

		
        <v-row v-for="(payment, index) in saleActive.payments" :key="index"
            
        >
            <v-col cols="12" sm="5"  class="d-flex justify-start pt-1 pb-1">
                <span class="">{{ payment.name }}</span>
            </v-col>
            <v-col cols="10" sm="5"  class="d-flex justify-end pt-1 pb-1">
				<span
					v-if="payment.is_editing_valor"	
				>
					<InputEditValue 
						:item="{
							saleProductId: payment.id,
							name: payment.name,
							cantidad: payment.valor
						}"

						@close="payment.is_editing_valor = false"
						@accept="set_valor"
					/>
				</span>
				<span
					v-else
					@dblclick="payment.is_editing_valor = true"
				>{{ globalHelperFixeDecimalMoney(payment.valor) }}</span>
            </v-col>
            <v-col cols="2" sm="2" class="pt-1 pb-1">
                <v-btn
					icon
					@click="remove_payment(payment.id)"
					x-small
					>
					<v-icon>mdi-delete</v-icon>
				</v-btn>
            </v-col>

        </v-row>
		<v-divider class="mt-2"></v-divider>
        <v-row class="">
			
				<v-col cols="12" sm="5"  class=" d-flex justify-start">
					<span class="title darken-4">SALDO </span>
				</v-col>
				
				<v-col cols="10" sm="5"  class="d-flex justify-end" >
					
					<span class="title darken-4">{{ globalHelperFixeDecimalMoney(saldoSaleActive) | money_string  }}</span>
				</v-col>
				<v-col cols="2" sm="2">
				</v-col>
			</v-row>
			
					
		</v-card-text>
	</v-card>

</template>

<script>

import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import InputEditValue from '@/components/admin/utils/InputEditValue.vue'
import NewPaymentModal from './NewPaymentModal.vue'
export default {
	data () {
		return {
			newPaymentModalVisible: false
		}
    },


	components: {
		InputEditValue,
		NewPaymentModal
	},
	computed: {
		...mapGetters({
			saleActive: 'sale_manager/saleActive',
			saldoSaleActive: 'sale_manager/saldoSaleActive',
			
		})
    },
	methods: {
		...mapActions({
            remove_payment: 'sale_manager/remove_payment',
			add_payment: 'sale_manager/add_payment'

        }),

		set_valor(itemEdited){            
            for ( let item of this.saleActive.payments) {
                if ( item.id == itemEdited.id) {
                    item.valor = Number(itemEdited.cantidad)
                    item.is_editing_valor = false
                    break
                }
            }
        },

		addPayment(payment) {
			this.newPaymentModalVisible = false,
			this.add_payment(payment)
			
		}
	}
	
}
</script>

<style>

</style>