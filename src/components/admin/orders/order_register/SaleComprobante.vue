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
                    v-if="sale.sale_saved.relationships.comprobante"
                >
                    <span>F {{ sale.sale_saved.relationships.comprobante.attributes.tipo }} {{ sale.sale_saved.relationships.comprobante.attributes.punto_venta | punto_venta_string }} - {{ sale.sale_saved.relationships.comprobante.attributes.numero | numero_factura_string }}</span>
                </v-col>
                <v-col cols="12" sm="7"  class="d-flex align-center justify-start pt-1 pb-1">
                    <div v-if="!sale.sale_saved.relationships.comprobante">
                        

                        <v-select
                            
                            dense
                            :items="ivaconditions_select"
                            item-text="name"
                            item-value="id"
                            v-model="ivacondition_id"
                            :disabled="is_facturando"
                        >

                        </v-select>
                    </div>
                </v-col>
            </v-row>
            <v-btn 
                v-if="!sale.sale_saved.relationships.comprobante"
                block 
                small 
                :loading="is_saving || is_facturando"   
                @click="generarComprobante"     
                :disabled="ivacondition_id == 0"   
            >
                Enviar
            </v-btn>
            <template v-else>
                <Comprobante 
                    
                    :comprobante = "sale.sale_saved.relationships.comprobante"
                    :items = "sale.sale_saved.relationships.saleitems"
                    :comboitems = "sale.sale_saved.relationships.salecomboitems"
                    :total = "Number(sale.sale_saved.attributes.total)"
                    tipo = "sale"
                />
                <Comprobante_80 
                class="mt-2"
                    :comprobante = "sale.sale_saved.relationships.comprobante"
                    :items = "sale.sale_saved.relationships.saleitems"
                    :comboitems = "sale.sale_saved.relationships.salecomboitems"
                    :total = "Number(sale.sale_saved.attributes.total)"
                    tipo = "sale"
                />
            </template>
            
        </v-card-text>
    </v-card> 
    

</div>  
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

import Comprobante from '@/components/admin/sales_manager/sale/comprobantes/Comprobante'
import Comprobante_80 from '@/components/admin/sales_manager/sale/comprobantes/Comprobante_80'
export default {
    mounted ( ) {
        this.ivacondition_id = this.ivacondition_id_prop
            
    },
    props: {
        is_facturando: Boolean,
        ivacondition_id_prop: Number
    },
    components: {
        Comprobante,
        Comprobante_80
    },
    computed: {
        ...mapGetters({

            ivaconditions: 'ivaconditions_manager/ivaconditions',
            sale: 'sale_manager/saleActive'
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
            if ( this.sale.sale_saved.relationships.client && this.sale.sale_saved.relationships.client.relationships.ivacondition.id != 3 ) {
                for ( let ivacondition_item of this.ivaconditions ) {
                    if ( ivacondition_item.id == this.sale.sale_saved.relationships.client.relationships.ivacondition.id ) {
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
            generate_comprobante: 'sale_manager/generate_comprobante',
            set_comprobante: 'sale_manager/set_comprobante',
        }),
        
        async generarComprobante ( ) {
            this.is_saving = true
            await this.generate_comprobante ( this.ivacondition_id )
                .then((resp) => {
                    //console.log(resp.data.data)
                    //console.log(this.saleActive)
                    //this.set_comprobante(resp.data.data)
                    this.$toast.success('El comprobante se ha generado correctamente', { timeout: 3000 });
                    this.sale.sale_saved.relationships.comprobante = resp.data.data
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