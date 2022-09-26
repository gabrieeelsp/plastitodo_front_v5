<template>

	<v-card class="">
		<v-card-text >
			<v-row class="blue lighten-5 ">
				<v-col cols="12" sm="4"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Facturación: </span>
				</v-col>
				<v-col cols="12" sm="8"  class="d-flex justify-start align-center">
					<v-select
						:disabled="disabled"
						dense
						:items="ivaconditions_select"
						item-text="name"
						item-value="id"
						v-model="orderActive.ivacondition_id"
						hide-details=""
						:menu-props="{ offsetY: true }"
						@change="auto_set_is_incluir_datos_order_active"
					>

					</v-select>

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
			ivaconditions_select: 'order_manager/ivaconditions_select',
			orderActive: 'order_manager/orderActive',
		})
    },
	methods: {
		...mapActions({
			auto_set_is_incluir_datos_order_active: 'order_manager/auto_set_is_incluir_datos_order_active',
		})
	}
	
}
</script>

<style>

</style>