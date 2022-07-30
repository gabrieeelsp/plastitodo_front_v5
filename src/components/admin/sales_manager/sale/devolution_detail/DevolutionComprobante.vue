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
                    v-if="devolution.relationships.comprobante"
                >
                    <span>NC {{ devolution.relationships.comprobante.attributes.tipo }} {{ devolution.relationships.comprobante.attributes.punto_venta | punto_venta_string }} - {{ devolution.relationships.comprobante.attributes.numero | numero_factura_string }}</span>
                </v-col>
                <v-col cols="12" sm="7"  class="d-flex align-center justify-start pt-1 pb-1">
                    <div v-if="!devolution.relationships.comprobante">

                        <v-select
                            v-if="sale.relationships.comprobante"
                            dense
                            :items="[
                                {
                                    name: '',
                                    id: 0
                                },
                                {
                                    name: sale.relationships.comprobante.attributes.ivacondition_name_client,
                                    id: 1
                                }
                            ]"
                            item-text="name"
                            item-value="id"
                            v-model="ivacondition_id"
                            
                        >

                        </v-select>
                    </div>
                </v-col>
            </v-row>
            <div v-if="sale.relationships.comprobante">
            <v-btn 
                v-if="!devolution.relationships.comprobante"
                block 
                small 
                :loading="is_saving"   
                @click="generarComprobante"    
                :disabled="ivacondition_id == 0"    
            >
                Enviar
            </v-btn>
            <Comprobante 
                v-else
                :comprobante = "devolution.relationships.comprobante"
                :items = "devolution.relationships.devolutionitems"
                :comboitems = "devolution.relationships.devolutioncomboitems"
                :total = "Number(devolution.attributes.total)"
                tipo = "devolution"
            />
            </div>
            
        </v-card-text>
    </v-card> 

</div>  
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

import Comprobante from '@/components/admin/sales_manager/sale/comprobantes/Comprobante'

export default {
    mounted ( ) {
        
            
    },
    components: {
        Comprobante
    },
    props: {
        devolution: Object
    },
    computed: {
        ...mapGetters({
            sale: 'sales_manager/sale',
        })
    },
    data () {
        return {
            is_saving: false,
            ivacondition_id: 0
        }        
    },
    methods: {
        ...mapActions({
            generate_comprobante_nc_from_dev: 'sales_manager/generate_comprobante_nc_from_dev',
            set_comprobante_nc_from_dev: 'sales_manager/set_comprobante_nc_from_dev',
        }),
        
        async generarComprobante ( ) {
            this.is_saving = true
            await this.generate_comprobante_nc_from_dev ( this.devolution.id)
                .then((resp) => {
                    //console.log(resp.data.data)
                    this.set_comprobante_nc_from_dev({
                        id: this.devolution.id,
                        comprobante: resp.data.data 
                    })
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