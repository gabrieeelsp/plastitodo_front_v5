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
                    v-if="creditnote.relationships.comprobante"
                >
                    <span>NC {{ creditnote.relationships.comprobante.attributes.tipo }} {{ creditnote.relationships.comprobante.attributes.punto_venta | punto_venta_string }} - {{ creditnote.relationships.comprobante.attributes.numero | numero_factura_string }}</span>
                </v-col>
                <v-col cols="12" sm="7"  class="d-flex align-center justify-start pt-1 pb-1">
                    <div v-if="!creditnote.relationships.comprobante">

                        <v-select
                            v-if="sale.relationships.comprobante"
                            dense
                            :items="[
                                {
                                    name: '',
                                    id: 0
                                },
                                {
                                    name: sale.relationships.comprobante.relationships.modelofact.name,
                                    id: sale.relationships.comprobante.relationships.modelofact.id
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
            <div v-if="sale.relationships.comprobante">
                <v-btn 
                    v-if="!creditnote.relationships.comprobante"
                    block 
                    small 
                    :loading="is_saving"   
                    @click="generarComprobante"        
                >
                    Enviar
                </v-btn>
                <Comprobante 
                    v-else
                    :comprobante = "creditnote.relationships.comprobante"
                    :items = "creditnote.relationships.creditnoteitems"
                    :total = "Number(creditnote.attributes.total)"
                    tipo = "creditnote"
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
        creditnote: Object
    },
    computed: {
        ...mapGetters({
            modelofacts_select: 'modelofacts_manager/modelofacts_select',
            sale: 'sales_manager/sale',
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
            generate_comprobante_nc: 'sales_manager/generate_comprobante_nc',
            set_comprobante_nc: 'sales_manager/set_comprobante_nc',
        }),
        
        async generarComprobante ( ) {
            this.is_saving = true
            await this.generate_comprobante_nc ( this.creditnote.id)
                .then((resp) => {
                    //console.log(resp.data.data)
                    this.set_comprobante_nc({
                        id: this.creditnote.id,
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