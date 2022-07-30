<template>

	<v-card class="">
		<v-card-text >
			<v-row class="blue lighten-5">
				<v-col cols="12" sm="3"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Items: </span>
				</v-col>
				<v-col cols="12" sm="9"  class="d-flex justify-center align-center">
					<span class="title">{{ cantItems }}</span>
				</v-col>
			</v-row>
			<v-row class="">
				<v-col cols="12" sm="3"  class=" d-flex justify-sm-end align-center">
					<span class="font-weight-bold black--text">Total: </span>
				</v-col>
				<v-col cols="12" sm="9"  class="d-flex justify-center align-center">
					<span class="display-1 blue--text darken-4">{{ globalHelperFixeDecimalMoney(total) | money_string }}</span>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>

</template>

<script>

export default {
	props: {
		purchaseorder: Object
	},

	components: {
		
	},
	computed: {
		total: function () {
			let total = 0
			for ( let item of this.purchaseorder.relationships.purchaseorderitems ) {
				total = total + Number(this.getSubtotal(item))
			}
			return total
		},
		cantItems: function () {
			return this.purchaseorder.relationships.purchaseorderitems.filter((i) => {
				return i.attributes.cantidad > 0
			}).length
		}
    },
	methods: {
		getPrecio (item) {
            return (item.relationships.purchaseproduct.attributes.relacion_compra_stock * item.relationships.purchaseproduct.relationships.stockproduct.attributes.costo).toFixed(10)
        },

        getSubtotal (item) {
            if ( item.relationships.purchaseproduct.relationships.stockproduct.attributes.is_stock_unitario_variable ) {
                return (item.attributes.cantidad * item.relationships.purchaseproduct.relationships.stockproduct.attributes.stock_aproximado_unidad * this.getPrecio(item)).toFixed(10)
            }
            return (item.attributes.cantidad * this.getPrecio(item)).toFixed(10)
        },
	}
	
}
</script>

<style>

</style>