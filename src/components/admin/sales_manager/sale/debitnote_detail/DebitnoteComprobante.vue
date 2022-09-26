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
                    v-if="debitnote.relationships.comprobante"
                >
                    <span>ND {{ debitnote.relationships.comprobante.attributes.tipo }} {{ debitnote.relationships.comprobante.attributes.punto_venta | punto_venta_string }} - {{ debitnote.relationships.comprobante.attributes.numero | numero_factura_string }}</span>
                </v-col>
                <v-col cols="12" sm="7"  class="d-flex align-center justify-start pt-1 pb-1">
                    <div v-if="!debitnote.relationships.comprobante">

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
                    v-if="!debitnote.relationships.comprobante"
                    block 
                    small 
                    :loading="is_saving"   
                    @click="generarComprobante"    
                    :disabled="ivacondition_id == 0"    
                >
                    Enviar
                </v-btn>
                <v-btn 
                    v-else-if="!debitnote.relationships.comprobante.attributes.cae"
                    block 
                    small 
                    :loading="is_saving"   
                    @click="generarComprobante"     
                >
                    Enviar
                </v-btn>
                <Comprobante 
                    v-else
                    :comprobante = "debitnote.relationships.comprobante"
                    :items = "debitnote.relationships.debitnoteitems"
                    :total = "Number(debitnote.attributes.total)"
                    tipo = "debitnote"
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
        debitnote: Object
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
            generate_comprobante_nd: 'sales_manager/generate_comprobante_nd',
            set_comprobante_nd: 'sales_manager/set_comprobante_nd',
        }),
        
        async generarComprobante ( ) {
            this.is_saving = true
            await this.generate_comprobante_nd ( this.debitnote.id)
                .then((resp) => {
                    //console.log(resp.data.data)
                    this.set_comprobante_nd({
                        id: this.debitnote.id,
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