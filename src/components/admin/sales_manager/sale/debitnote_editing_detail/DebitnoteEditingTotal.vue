<template>

	<v-card class="">
		<v-card-text >
			
			<v-row class="">
				<v-col cols="12" sm="3"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Total: </span>
				</v-col>
				<v-col cols="12" sm="9"  class="d-flex justify-center align-center">
					<span class="display-1 blue--text darken-4">{{ globalHelperFixeDecimalMoney(totalDebitnoteEditing) | money_string }}</span>
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
			debitnote_editing: 'sales_manager/debitnote_editing',
			totalDebitnoteEditing: 'sales_manager/totalDebitnoteEditing',
		})
    },
	methods: {
		
	}
	
}
</script>

<style>

</style>