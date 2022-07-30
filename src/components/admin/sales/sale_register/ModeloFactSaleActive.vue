<template>

	<v-card class="">
		<v-card-text >
			<v-row class="blue lighten-5 ">
				<v-col cols="12" sm="4"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Facturación: </span>
				</v-col>
				<v-col cols="12" sm="8"  class="d-flex justify-start align-center">
					<v-select

						dense
						:items="ivaconditions_select"
						item-text="name"
						item-value="id"
						v-model="saleActive.ivacondition_id"
						hide-details=""
						:menu-props="{ offsetY: true }"
						@change="auto_set_is_incluir_datos_sale_active"
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

	components: {
		
	},
	computed: {
		...mapGetters({
			ivaconditions_select: 'sale_manager/ivaconditions_select',
			saleActive: 'sale_manager/saleActive',
		})
    },
	methods: {
		...mapActions({
			auto_set_is_incluir_datos_sale_active: 'sale_manager/auto_set_is_incluir_datos_sale_active',
		})
	}
	
}
</script>

<style>

</style>