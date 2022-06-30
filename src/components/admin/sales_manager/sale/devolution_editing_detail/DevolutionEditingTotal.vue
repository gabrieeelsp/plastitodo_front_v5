<template>

	<v-card class="">
		<v-card-text >
			<v-row class="blue lighten-5">
				<v-col cols="12" sm="3"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Items: </span>
				</v-col>
				<v-col cols="12" sm="9"  class="d-flex justify-center align-center">
					<span class="title">{{ cantItemsDevolution }}</span>
				</v-col>
			</v-row>
			<v-row class="">
				<v-col cols="12" sm="3"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Total: </span>
				</v-col>
				<v-col cols="12" sm="9"  class="d-flex justify-center align-center">
					<span class="display-1 blue--text darken-4">{{ globalHelperFixeDecimalMoney(totalDevolution) | money_string }}</span>
				</v-col>
			</v-row>
			<v-row class="">
				<v-col cols="12" sm="3"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Max: </span>
				</v-col>
				<v-col cols="12" sm="9"  class="d-flex justify-end align-center">
					<span class="font-weight-bold">{{ globalHelperFixeDecimalMoney(totalDisponibleCredito) | money_string }}</span>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>

</template>

<script>
import { mapGetters } from 'vuex'

export default {

	components: {
		
	},
	computed: {
		...mapGetters({
			cantItemsDevolution: 'sales_manager/cantItemsDevolution',
			totalDevolution: 'sales_manager/totalDevolution',
			totalDisponibleCredito: 'sales_manager/totalDisponibleCredito'
		})
    },
	methods: {
		
	}
	
}
</script>

<style>

</style>