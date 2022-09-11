<template>

	<v-card class="">
		<v-card-text >
			<v-row class="blue lighten-5">
				<v-col cols="12" sm="3"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Items: </span>
				</v-col>
				<v-col cols="12" sm="9"  class="d-flex justify-center align-center">
					<span class="title">{{ cantItemsOrderActive }}</span>
				</v-col>
			</v-row>
			<v-row class="">
				<v-col cols="12" sm="3"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Total: </span>
				</v-col>
				<v-col cols="12" sm="9"  class="d-flex justify-center align-center">
					<v-badge
						v-if="!is_order_active_complete_total"
						bordered
						color="error"
						content="Aprox"
						overlap
					>
						<span class="display-1 blue--text darken-4">{{ globalHelperFixeDecimalMoney(totalOrderActive) | money_string }}</span>
					</v-badge>
					<span v-else class="display-1 blue--text darken-4">{{ globalHelperFixeDecimalMoney(totalOrderActive) | money_string }}</span>
					
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
        cantItemsOrderActive: 'order_manager/cantItemsOrderActive',
		totalOrderActive: 'order_manager/totalOrderActive',
		is_order_active_complete_total: 'order_manager/is_order_active_complete_total',
      })
    },
	methods: {
		
	}
	
}
</script>

<style>

</style>