<template>

	<v-card class="">
		<v-card-text >
			<v-row class="blue lighten-5 ">
				<v-col cols="12" sm="4"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Sucursal: </span>
				</v-col>
				<v-col cols="12" sm="8"  class="d-flex justify-start align-center">
					<v-select
						:disabled="disabled"
						dense
						clearable
						:items="sucursals_select"
						item-text="name"
						item-value="id"
						v-model="orderActive.sucursal_id"
						hide-details=""
						:menu-props="{ offsetY: true }"
					>

					</v-select>

				</v-col>
			</v-row>
			<v-row class="blue lighten-5 mt-0 ">
				<v-col cols="12" sm="4"  class=" d-flex justify-sm-end align-center">
					
				</v-col>
				<v-col cols="12" sm="8"  class="d-flex justify-start align-center">
					<v-checkbox
						class="mt-0 pr-0"
						v-model="orderActive.is_delivery"
						label="Delivery"
						hide-details=""
					></v-checkbox>

				</v-col>
			</v-row>
			
		</v-card-text>
	</v-card>

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
	mounted() {
	},
	data: () => ({

    }),

	props: {
		disabled: Boolean
	},

	components: {
		
	},
	computed: {
		...mapGetters({
			sucursals_select: 'sucursals_manager/sucursals_select',
			orderActive: 'order_manager/orderActive',
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