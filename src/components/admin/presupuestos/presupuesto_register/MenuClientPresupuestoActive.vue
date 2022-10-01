<template>

	<v-card class="">
		<v-card-text >
			<v-row class="">
				<v-col cols="12" sm="3"  class="pt-2 pb-0 d-flex justify-sm-end">
					<span class="font-weight-bold black--text">Cliente</span>
				</v-col>
				<v-col cols="12" sm="9"  class="pb-0 d-flex align-center" :class="!presupuestoActive.client ? 'pt-0' :'pt-2'">
					<template v-if="presupuestoActive.client">
						<template v-if="presupuestoActive.client.tipo_persona == 'FISICA'">
							<span >{{ presupuestoActive.client.name }} {{ presupuestoActive.client.surname }}</span>
						</template>
						<template v-else>
							<span class="mt-2 mb-2" >{{ presupuestoActive.client.name }}</span>
						</template>

					</template>
					
					<SelectClient  
						v-else
						:disabled="cantItemsPresupuestoActive != 0"
						@setClient="setClient" 
					/>
				</v-col>
			</v-row>
			<v-row class="mt-5">
				<v-col cols="12" sm="3"  class="pt-2 pb-0 d-flex justify-sm-end">
					<span class="font-weight-bold black--text">Tipo</span>
				</v-col>
				<v-col cols="12" sm="9"  class=" pt-0 pb-0 d-flex align-center">
					<span v-if="presupuestoActive.client" class="mt-2 mb-2" >{{ presupuestoActive.client.tipo}}</span>
					<span v-else class="mt-2 mb-2" >----</span>
					
					<span ></span>
				</v-col>

			</v-row>
		</v-card-text>
	</v-card>

</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import SelectClient from '../../../../components/admin/clients/SelectClient.vue'
export default {

	components: {
		SelectClient
	},
	computed: {
		...mapGetters({
			cantItemsPresupuestoActive: 'presupuestos_manager/cantItemsPresupuestoActive',
			presupuestoActive: 'presupuestos_manager/presupuestoActive'
		})
    },
	methods: {
		...mapActions({
            set_client_presupuesto_active: 'presupuestos_manager/set_client_presupuesto_active',

        }),
		
		async setClient(client) {
			//console.log(client)
            await axios.get(`clients/${client.id}`)
                .then((result) => {
					let client = {
                        'id': result.data.data.id,
                        'name': result.data.data.attributes.name,
						'surname': result.data.data.attributes.surname,
                        'tipo': result.data.data.attributes.tipo,
						'fact_default': result.data.data.attributes.fact_default,
						'tipo_persona': result.data.data.attributes.tipo_persona,
						'is_fact_default': result.data.data.attributes.is_fact_default,
						
                    }

										
                    
                    this.set_client_presupuesto_active( client)

                }).catch((error) => {
					console.log(error)
                    console.log("error al seleccionar un cliente")
                })
        }
	}
	
}
</script>

<style>

</style>