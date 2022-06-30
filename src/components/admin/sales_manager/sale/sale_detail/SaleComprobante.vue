<template>
<div>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="5"  class="d-flex align-center justify-start pt-1 pb-1">
                    <span>Comprobante:</span>
                </v-col>
                <v-col cols="12" sm="7"
                    class="d-flex align-center justify-end pt-1 pb-1"
                    v-if="sale.relationships.comprobante"
                >
                    <span>{{ sale.relationships.comprobante.attributes.tipo }} {{ sale.relationships.comprobante.attributes.punto_venta | punto_venta_string }} - {{ sale.relationships.comprobante.attributes.numero | numero_factura_string }}</span>
                </v-col>
                <v-col cols="12" sm="7"  class="d-flex align-center justify-start pt-1 pb-1">
                    <div v-if="!sale.relationships.comprobante">
                        <v-select
                            v-if="!(sale.relationships.client && sale.relationships.client.relationships.modelofact)"
                            dense
                            :items="modelofacts_select"
                            item-text="name"
                            item-value="id"
                            v-model="modelofact_id"
                        >

                        </v-select>

                        <v-select
                            v-else
                            dense
                            :items="[
                                {
                                    name: '',
                                    id: 0
                                },
                                {
                                    name: sale.relationships.client.relationships.modelofact.attributes.name,
                                    id: sale.relationships.client.relationships.modelofact.id
                                }
                            ]"
                            item-text="name"
                            item-value="id"
                            v-model="modelofact_id"
                        >

                        </v-select>
                    </div>
                </v-col>
            </v-row>
            <v-btn 
                v-if="!sale.relationships.comprobante"
                block 
                small 
                :loading="is_saving"   
                @click="generarComprobante"        
            >
                Enviar
            </v-btn>
            <v-btn 
                v-else
                block 
                small 
                :loading="is_saving"   
                @click="generateReport"
            >
                Ver
            </v-btn>
        </v-card-text>
    </v-card> 
    

</div>  
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

export default {
    mounted ( ) {
        
            
    },
    components: {

    },
    computed: {
        ...mapGetters({
            modelofacts_select: 'modelofacts_manager/modelofacts_select',
            sale: 'sales_manager/sale'
        })
    },
    data () {
        return {
            is_saving: false,
            modelofact_id: null
        }        
    },
    methods: {
        ...mapActions({
            generate_comprobante: 'sales_manager/generate_comprobante',
            set_comprobante: 'sales_manager/set_comprobante',
        }),
        
        async generarComprobante ( ) {
            this.is_saving = true
            await this.generate_comprobante ( this.modelofact_id )
                .then((resp) => {
                    //console.log(resp.data.data)
                    this.set_comprobante(resp.data.data)
                    this.$toast.success('El comprobante se ha generado correctamente', { timeout: 3000 });
                })
                .catch((error) => {
                    this.$toast.error(error.response.data.message, { timeout: 3000 });
                })
            this.is_saving = false
        },

        generateReport () { 
            console.log('generando reporte')
        } 

        
    }

}
</script>

<style>

</style>