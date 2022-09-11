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
                    <span class="mt-2 mb-2">F {{ sale.sale_saved.relationships.comprobante.attributes.tipo }} {{ sale.sale_saved.relationships.comprobante.attributes.punto_venta | punto_venta_string }} - {{ sale.sale_saved.relationships.comprobante.attributes.numero | numero_factura_string }}</span>
                </v-col>
                <v-col cols="12" sm="7"  class="d-flex align-center justify-start pt-1 pb-1">
                    <div v-if="!sale.sale_saved.relationships.comprobante">
                        <v-select
                            v-if="!(sale.sale_saved.relationships.client && sale.sale_saved.relationships.client.relationships.modelofact)"
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
                                    name: sale.sale_saved.relationships.client.relationships.modelofact.attributes.name,
                                    id: sale.sale_saved.relationships.client.relationships.modelofact.id
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
                v-if="!sale.sale_saved.relationships.comprobante"
                block 
                small 
                :loading="is_saving"   
                @click="generarComprobante"    
                :disabled="!modelofact_id"    
            >
                Enviar
            </v-btn>
            <Comprobante 
                v-else
                :comprobante = "sale.sale_saved.relationships.comprobante"
                :items = "sale.sale_saved.relationships.saleitems"
                :comboitems = "sale.sale_saved.relationships.salecomboitems"
                :total = "Number(sale.sale_saved.attributes.total)"
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
export default {
    mounted ( ) {
        
            
    },
    components: {
        Comprobante
    },
    computed: {
        ...mapGetters({
            modelofacts_select: 'modelofacts_manager/modelofacts_select',
            sale: 'sale_manager/saleActive'
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
            generate_comprobante: 'sale_manager/generate_comprobante',
            set_comprobante: 'sales_manager/set_comprobante',
        }),
        
        async generarComprobante ( ) {
            this.is_saving = true
            await this.generate_comprobante ( this.modelofact_id )
                .then((resp) => {
                    //console.log(resp.data.data)
                    this.sale.sale_saved.relationships.comprobante = resp.data.data
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