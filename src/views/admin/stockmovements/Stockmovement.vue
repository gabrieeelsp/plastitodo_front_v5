<template>
    <div class="pa-sm-3" v-if="item && item.relationships.stockmovementitems">
        <v-row>
            <v-col cols="12" md="9">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        
                            <span class="text-h4 font-weight-light">Movimiento de Stock</span>
                            <span class="text-center" v-if="item.attributes.tipo == 'INGRESO'"><v-chip small class="ma-2" color="success" >INGRESO</v-chip></span>
                            <span class="text-center" v-if="item.attributes.tipo == 'EGRESO'"><v-chip small class="ma-2" color="warning" >EGRESO</v-chip></span>
                            
                        
                        
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <v-row class="">
                            <v-col cols="12" class="">
                                <v-row>
                                    <v-col cols="8"> 
                                        <SelectProduct
                                            v-if="item.attributes.estado != 'CONFIRMADO'" 
                                         />

                                    </v-col>
                                </v-row>
                                
                            </v-col>
                        </v-row>
                        
                        <v-row>
                            <v-col cols="12">
                                <ItemsStockmovement
                                    v-if="item.relationships.stockmovementitems"
                                /> 
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="d-flex justify-end">
                                
                                <v-btn class="ml-auto"
                                    color="primary"
                                    @click="volver"
                                >Volver</v-btn>
                                <v-spacer></v-spacer>

                                <v-btn
                                    :disabled="item.attributes.estado == 'CONFIRMADO'" 
                                    @click="delete_stockmovement"
                                    color="warning"
                                    text
                                >
                                    Eliminar
                                </v-btn>
                                <v-btn    
                                    :disabled="item.relationships.stockmovementitems.length == 0 || item.attributes.estado == 'CONFIRMADO'" 
                                    @click="save_stockmovement(false)"
                                    color="success"
                                    :loading="is_registrando"
                                >
                                    
                                    Guardar
                                    <v-icon right>
                                        mdi-content-save-outline
                                    </v-icon>
                                </v-btn>

                                <v-btn  
                                    :disabled="item.relationships.stockmovementitems.length == 0 || item.attributes.estado == 'CONFIRMADO'"                                  
                                    @click="save_stockmovement(true)"
                                    color="secondary"
                                    :loading="is_registrando"
                                    class="ml-1"
                                >
                                    
                                    Guardar Y Confirmar
                                    <v-icon right>
                                        mdi-content-save-outline
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-row>
                    <v-col>
                        <StockmovementEstado
                            :stockmovement="item"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <StockmovementSucursal
                            :stockmovement="item"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <StockmovementComments
                            :stockmovement="item"
                        />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        
                    </v-col>
                </v-row>
                
            </v-col>

        </v-row>

    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import ItemsStockmovement from '@/components/admin/stockmovements/stockmovement/ItemsStockmovement'
import SelectProduct from '@/components/admin/stockmovements/stockmovement/SelectProduct'
import StockmovementEstado from '@/components/admin/stockmovements/stockmovement/StockmovementEstado'
import StockmovementSucursal from '@/components/admin/stockmovements/stockmovement/StockmovementSucursal'
import StockmovementComments from '@/components/admin/stockmovements/stockmovement/StockmovementComments.vue'
export default {
    created() {
        if ( !this.item || !this.item.relationships.stockmovementitems ) {
            this.buscar()
        }
    },
    data() {
        return {
            is_registrando: false
        }
    },
    components: {
        ItemsStockmovement,
        SelectProduct,
        StockmovementEstado,
        StockmovementSucursal,
        StockmovementComments,
    },
    computed: {
        ...mapGetters({
            item: 'stockmovements_manager/item'
        })
    },
    methods: {
        ...mapActions({
            buscar_item: 'stockmovements_manager/buscar_item',
            set_item: 'stockmovements_manager/set_item',
            save_item: 'stockmovements_manager/save_item',
            detele_item: 'stockmovements_manager/detele_item',
            unset_item: 'stockmovements_manager/unset_item',

        }),

        volver ( ) {
            this.$router.replace({
                name: 'stockmovements'
            })
        },
        buscar () {
            this.buscar_item(this.$route.params.id)
                .then((resp) => {
                    if ( !this.item ) {
                        this.set_item(resp.data.data)
                    }else {
                        this.$set(this.item.relationships, 'stockmovementitems', resp.data.data.relationships.stockmovementitems)
                    }
                    
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        save_stockmovement (is_confirmar) {
            this.is_registrando = true
            this.save_item(is_confirmar)
                .then((resp) => {
                    this.item.attributes.estado = resp.data.data.attributes.estado
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                })
                .catch((error) => {
                    console.log(error)
                    this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                })
                .finally(() => {
                    this.is_registrando = false
                })
        },
        delete_stockmovement () {
            this.detele_item()
                .then(() => {
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 })
                    this.unset_item()
                    this.volver()
                })
                .catch((error) => {
                    console.log(error)
                    this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                })
        },
        
    }
}
</script>

<style>

</style>