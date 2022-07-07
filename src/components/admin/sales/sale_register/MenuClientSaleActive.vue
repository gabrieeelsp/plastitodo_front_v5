<template>

	<v-card class="">
		<v-card-text >
			<v-row class="">
				<v-col cols="12" sm="3"  class="pt-2 pb-0 d-flex justify-sm-end">
					<span class="font-weight-bold black--text">Cliente</span>
				</v-col>
				<v-col cols="12" sm="9"  class=" pt-0 pb-0">
					<v-text-field 
						v-if="saleActive.client"
						dense
						v-model="saleActive.client.name"
						readonly
					>						
					</v-text-field>
					<SelectClient  
						v-else
						@setClient="setClient" 
					/>
				</v-col>
				<v-col cols="12" sm="3"  class="pt-2 pb-0 d-flex justify-sm-end">
					<span class="font-weight-bold black--text">Tipo</span>
				</v-col>
				<v-col cols="12" sm="9"  class=" pt-0 pb-0">
					<v-text-field 
						v-if="saleActive.client"
						dense
						v-model="saleActive.client.tipo"
						readonly
					>						
					</v-text-field>
					<v-text-field 
						v-else
						dense
						readonly
					>						
					</v-text-field>
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
			saleActive: 'sale_manager/saleActive'
		})
    },
	methods: {
		...mapActions({
            set_client_sale_active: 'sale_manager/set_client_sale_active'
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
						
                    }

					if ( result.data.data.relationships.ivacondition ) {
						client['ivacondition'] = {
							id: result.data.data.relationships.ivacondition.id,
							name: result.data.data.relationships.ivacondition.attributes.name
						}
					}else {
						client['ivacondition'] = null
					}

					if ( result.data.data.relationships.modelofact ) {
						client['modelofact'] = {
							id: result.data.data.relationships.modelofact.id,
							name: result.data.data.relationships.modelofact.attributes.name
						}
					}else {
						client['modelofact'] = null
					}
                    
                    this.set_client_sale_active( client)
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