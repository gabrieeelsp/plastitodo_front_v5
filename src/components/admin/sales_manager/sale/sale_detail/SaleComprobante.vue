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
                    <span>F {{ sale.relationships.comprobante.attributes.tipo }} {{ sale.relationships.comprobante.attributes.punto_venta | punto_venta_string }} - {{ sale.relationships.comprobante.attributes.numero | numero_factura_string }}</span>
                </v-col>
                <v-col cols="12" sm="7"  class="d-flex align-center justify-start pt-1 pb-1">
                    <div v-if="!sale.relationships.comprobante">
                        

                        <v-select
                            
                            dense
                            :items="ivaconditions_select"
                            item-text="name"
                            item-value="id"
                            v-model="ivacondition_id"
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
                :disabled="ivacondition_id == 0"   
            >
                Enviar
            </v-btn>
            <v-btn 
                v-else-if="!sale.relationships.comprobante.attributes.cae"
                block 
                small 
                :loading="is_saving"   
                @click="generarComprobante"     
            >
                Enviar
            </v-btn>
            <template v-else>
                <Comprobante 
                    :comprobante = "sale.relationships.comprobante"
                    :items = "sale.relationships.saleitems"
                    :comboitems = "sale.relationships.salecomboitems"
                    :total = "Number(sale.attributes.total)"
                    tipo = "sale"
                />
                <Comprobante_80 
                class="mt-2"
                    :comprobante = "sale.relationships.comprobante"
                    :items = "sale.relationships.saleitems"
                    :comboitems = "sale.relationships.salecomboitems"
                    :total = "Number(sale.attributes.total)"
                    tipo = "sale"
                />
            </template>
            <Comprobante_a5 
                class="mt-2"
                    :sale = "sale"
                    :items = "sale.relationships.saleitems"
                    :comboitems = "sale.relationships.salecomboitems"
                    :total = "Number(sale.attributes.total)"
                    tipo = "sale"
                />

            
        </v-card-text>
    </v-card> 
    

</div>  
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

import Comprobante from '@/components/admin/sales_manager/sale/comprobantes/Comprobante'
import Comprobante_80 from '@/components/admin/sales_manager/sale/comprobantes/Comprobante_80'
import Comprobante_a5 from '@/components/admin/sales_manager/sale/comprobantes/Comprobante_a5'
export default {
    mounted ( ) {
        
            
    },
    components: {
        Comprobante,
        Comprobante_80,
        Comprobante_a5,
    },
    computed: {
        ...mapGetters({
            modelofacts_select: 'modelofacts_manager/modelofacts_select',
            ivaconditions: 'ivaconditions_manager/ivaconditions',
            sale: 'sales_manager/sale'
        }),
        ivaconditions_select () {
            let ivaconditions = [{
                id: 0,
                name: ''
            }]

            for ( let ivacondition_item of this.ivaconditions ) {
                if ( ivacondition_item.id == 3 ) {
                    ivaconditions.push({
                        id: ivacondition_item.id,
                        name: ivacondition_item.attributes.name
                    })
                    break
                }
            }
            if ( this.sale.relationships.client && this.sale.relationships.client.relationships.ivacondition.id != 3 ) {
                for ( let ivacondition_item of this.ivaconditions ) {
                    if ( ivacondition_item.id == this.sale.relationships.client.relationships.ivacondition.id ) {
                        ivaconditions.push({
                            id: ivacondition_item.id,
                            name: ivacondition_item.attributes.name
                        })
                        break
                    }
                }
            }

            return ivaconditions
        }
    },
    data () {
        return {
            is_saving: false,
            ivacondition_id: 0
        }        
    },
    methods: {
        ...mapActions({
            generate_comprobante: 'sales_manager/generate_comprobante',
            set_comprobante: 'sales_manager/set_comprobante',
        }),
        
        async generarComprobante ( ) {
            this.is_saving = true
            await this.generate_comprobante ( this.ivacondition_id )
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

        

        
    }

}
</script>

<style>

</style>