<template>

	<v-card class="">
		<v-card-text >
			<v-row class="">
				<v-col cols="12" sm="4"  class=" d-flex justify-sm-end align-center pb-0">
					<span class="font-weight-bold black--text">Dia de Entrega: </span>
				</v-col>
				<v-col cols="12" sm="8"  class="d-flex justify-start align-center pb-0">
					<DatePicker
						v-model="orderActive.fecha_entrega_acordada"
						valueType="DD-MM-YYYY"
						
					/>

				</v-col>
			</v-row>
			<v-row class="">
				<v-col cols="12" sm="4"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Turno: </span>
				</v-col>
				<v-col cols="12" sm="8"  class="d-flex justify-start align-center">
					<v-select
						:disabled="disabled"
						dense
						clearable
						:items="deliveryshifts_select"
						item-text="name"
						item-value="id"
						v-model="orderActive.deliveryshift_id"
						hide-details=""
						:menu-props="{ offsetY: true }"
					>

					</v-select>

				</v-col>
			</v-row>
			
		</v-card-text>
	</v-card>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
export default {
	mounted() {
	},
	data: () => ({

    }),

	props: {
		disabled: Boolean
	},

	components: {
		DatePicker
	},
	computed: {
		...mapGetters({
			orderActive: 'order_manager/orderActive',
			deliveryshifts_select: 'deliveryshifts_manager/deliveryshifts_select',
		})
    },
	methods: {
		...mapActions({

		})
	}
	
}
</script>

<style>

</style>