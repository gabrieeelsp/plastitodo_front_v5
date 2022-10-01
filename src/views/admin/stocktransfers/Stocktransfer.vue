<template>
    <div class="pa-sm-3" v-if="item">
        <v-row>
            <v-col cols="12" md="9">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <div class="">
                            <span class="text-h4 font-weight-light">Transferencia de Stock</span>

                            
                        </div>
                        
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        
                        <v-row>
                            <v-col cols="12">
                                <SelectProduct
                                            v-if="item.attributes.estado != 'CONFIRMADO'" 
                                         />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" class="">
                                <ItemsStocktransfer
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="d-flex justify-end">
                                <v-btn
                                    :disabled="item.attributes.estado != 'EDITANDO' || item.relationships.sucursal_origen == sucursal.id" 
                                    @click="delete_stocktransfer"
                                    color="warning"
                                    text
                                >
                                    Eliminar
                                </v-btn>
                                <template v-if="item.attributes.estado == 'EDITANDO' || item.attributes.estado == 'EN PREPARACION' || item.attributes.estado == 'INGRESANDO'">
                                    <v-btn                                        
                                        @click="saveItem('GUARDAR')"
                                        color="success"
                                        class="ml-1"
                                        :loading="is_event_guardar"
                                        :disabled="!is_item_ok_to_save || is_event_finalizar || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_cancelar_ingreso || is_event_finalizar_ingreso"
                                    >
                                        
                                        Guardar
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <template v-if="item.attributes.estado == 'EDITANDO'">
                                    
                                    <v-btn                                    
                                        @click="saveItem('FINALIZAR')"
                                        color="success"
                                        :loading="is_event_finalizar"
                                        class="ml-1"
                                        :disabled="!is_item_ok_to_save || is_event_guardar"
                                    >
                                        
                                        Guardar y Finalizar
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <template v-if="item.attributes.estado == 'FINALIZADO'">
                                    <v-btn                                        
                                        @click="saveItem('EDITAR')"
                                        color="warning"
                                        class="ml-1"
                                        :loading="is_event_editar"
                                        :disabled="is_event_iniciar_preparacion"
                                    >
                                        
                                        EDITAR
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                    <v-btn                                        
                                        @click="saveItem('INICIAR PREPARACION')"
                                        color="success"
                                        class="ml-1"
                                        :loading="is_event_iniciar_preparacion"
                                        :disabled="is_event_editar"
                                    >
                                        
                                        Iniciar Preparación
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <template v-if="item.attributes.estado == 'EN PREPARACION'">
                                    <v-btn                                        
                                        @click="saveItem('CANCELAR PREPARACION')"
                                        color="warning"
                                        class="ml-1"
                                        :loading="is_event_cancelar_preparacion"
                                        :disabled="is_event_guardar || is_event_finalizar_preparacion"
                                    >
                                        
                                        Cancelar preparación
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                    <v-btn                                        
                                        @click="saveItem('FINALIZAR PREPARACION')"
                                        color="success"
                                        class="ml-1"
                                        :loading="is_event_finalizar_preparacion"
                                        :disabled="!is_item_ok_to_set_preparado || is_event_guardar || is_event_cancelar_preparacion"
                                    >
                                        
                                        finalizar preparación
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <template v-if="item.attributes.estado == 'PREPARADO'">
                                    <v-btn                                        
                                        @click="saveItem('EDITAR')"
                                        color="warning"
                                        class="ml-1"
                                        :loading="is_event_editar"
                                        :disabled="is_event_enviar"
                                    >
                                        
                                        EDITAR
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                    <v-btn                                        
                                        @click="saveItem('ENVIAR')"
                                        color="success"
                                        class="ml-1"
                                        :loading="is_event_enviar"
                                        :disabled="is_event_editar"
                                    >
                                        
                                        ENVIAR
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                    
                                </template>
                                <template v-if="item.attributes.estado == 'EN DISTRIBUCION'">
                                    <v-btn                                        
                                        @click="saveItem('CANCELAR ENVIO')"
                                        color="warning"
                                        class="ml-1"
                                        :loading="is_event_cancelar_envio"
                                        :disabled="is_event_recibir"
                                    >
                                        
                                        CANCELAR ENVÍO
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>

                                    <v-btn                                        
                                        @click="saveItem('INICIAR INGRESO')"
                                        color="success"
                                        class="ml-1"
                                        :loading="is_event_recibir"
                                        :disabled="is_event_cancelar_envio"
                                    >
                                        
                                        RECIBIR
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                    
                                </template>
                                <template v-if="item.attributes.estado == 'INGRESANDO'">
                                    <v-btn      
                                        v-if="!item.attributes.is_recibido"                                  
                                        @click="saveItem('CANCELAR INGRESO')"
                                        color="warning"
                                        class="ml-1"
                                        :loading="is_event_cancelar_ingreso"
                                        :disabled="is_event_guardar || is_event_finalizar_ingreso"
                                    >
                                        
                                        CANCELAR INGRESO
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>

                                    <v-btn                                        
                                        @click="saveItem('FINALIZAR INGRESO')"
                                        color="success"
                                        class="ml-1"
                                        :loading="is_event_finalizar_ingreso"
                                        :disabled="is_event_guardar || is_event_cancelar_ingreso"
                                    >
                                        
                                        CONFIRMAR INGRESO
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                    
                                </template>
                                <template v-if="item.attributes.estado == 'RECIBIDO'">
                                    <v-btn                                        
                                        @click="saveItem('EDITAR INGRESO')"
                                        color="warning"
                                        class="ml-1"
                                        :loading="is_event_editar_ingreso"
                                    >
                                        
                                        EDITAR INGRESO
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                    
                                </template>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-row>
                    <v-col>
                        <StocktransferEstado
                            :stocktransfer="item"
                        />
                    </v-col>
                </v-row>
                

                <v-row>
                    <v-col>
                        <StocktransferORIGEN
                            :stocktransfer="item"
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <StocktransferDESTINO
                            :stocktransfer="item"
                        />
                    </v-col>
                </v-row>
                
            </v-col>

        </v-row>

    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

import StocktransferEstado from '@/components/admin/stocktransfers/stocktransfer/StocktransferEstado.vue'
import StocktransferORIGEN from '@/components/admin/stocktransfers/stocktransfer/StocktransferORIGEN.vue'
import StocktransferDESTINO from '@/components/admin/stocktransfers/stocktransfer/StocktransferDESTINO.vue'
import ItemsStocktransfer from '@/components/admin/stocktransfers/stocktransfer/ItemsStocktransfer.vue'
import SelectProduct from '@/components/admin/stocktransfers/stocktransfer/SelectProduct'

export default {
    created() {
        if ( !this.item || !this.item.relationships.stocktransferitems ) {
            this.buscar()
        }
    },
    data() {
        return {
            is_registrandoOrder: false,

            is_event_guardar: false,
            is_event_finalizar: false,
            is_event_editar: false,
            is_event_iniciar_preparacion: false,
            is_event_cancelar_preparacion: false,
            is_event_finalizar_preparacion: false,
            is_event_enviar: false,
            is_event_cancelar_envio: false,
            is_event_recibir: false,
            is_event_cancelar_ingreso: false,
            is_event_finalizar_ingreso: false,
            is_event_editar_ingreso: false,
            
        }
    },
    components: {
        StocktransferEstado,
        ItemsStocktransfer,
        SelectProduct,
        StocktransferORIGEN,
        StocktransferDESTINO,
    },
    computed: {
        ...mapGetters({
            sucursal: 'sucursals_manager/sucursal',
            item: 'stocktransfers_manager/item',
            is_item_ok_to_set_preparado: 'stocktransfers_manager/is_item_ok_to_set_preparado',
            is_item_ok_to_set_recibido: 'stocktransfers_manager/is_item_ok_to_set_recibido',
            is_item_ok_to_save: 'stocktransfers_manager/is_item_ok_to_save',
        })
    },
    methods: {
        ...mapActions({
            buscar_item: 'stocktransfers_manager/buscar_item',
            set_item: 'stocktransfers_manager/set_item',
            save_item: 'stocktransfers_manager/save_item',
            detele_item: 'stocktransfers_manager/detele_item',
            unset_item: 'stocktransfers_manager/unset_item',

        }),

        volver ( ) {
            this.$router.replace({
                name: 'stocktransfers'
            })
        },
        buscar () {
            this.buscar_item(this.$route.params.id)
                .then((resp) => {
                   // console.log(resp.data.data)
                    if ( !this.item ) {
                        this.set_item(resp.data.data)
                        //console.log('no estaba')
                    }else {
                        //console.log('estaba')
                        this.$set(this.item.relationships, 'stocktransferitems', resp.data.data.relationships.stocktransferitems)
                    }

                    for ( let item of this.item.relationships.stocktransferitems ) {
                        this.$set(item, 'is_editing_cantidad', false)
                    }
                    
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        async saveItem(evento) {
            if ( evento == 'GUARDAR' ) {
                this.is_event_guardar = true
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_recibir = false
                this.is_event_cancelar_ingreso = false
                this.is_event_finalizar_ingreso = false
                this.is_event_editar_ingreso = false
            }
            if ( evento == 'FINALIZAR' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = true
                this.is_event_editar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_recibir = false
                this.is_event_cancelar_ingreso = false
                this.is_event_finalizar_ingreso = false
                this.is_event_editar_ingreso = false
            }
            if ( evento == 'EDITAR' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = true
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_recibir = false
                this.is_event_cancelar_ingreso = false
                this.is_event_finalizar_ingreso = false
                this.is_event_editar_ingreso = false
            }
            if ( evento == 'INICIAR PREPARACION' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_iniciar_preparacion = true
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_recibir = false
                this.is_event_cancelar_ingreso = false
                this.is_event_finalizar_ingreso = false
                this.is_event_editar_ingreso = false
            }
            if ( evento == 'CANCELAR PREPARACION' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = true
                this.is_event_finalizar_preparacion = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_recibir = false
                this.is_event_cancelar_ingreso = false
                this.is_event_finalizar_ingreso = false
                this.is_event_editar_ingreso = false
            }
            if ( evento == 'FINALIZAR PREPARACION' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = true
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_recibir = false
                this.is_event_cancelar_ingreso = false
                this.is_event_finalizar_ingreso = false
                this.is_event_editar_ingreso = false
            }
            if ( evento == 'ENVIAR' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_enviar = true
                this.is_event_cancelar_envio = false
                this.is_event_recibir = false
                this.is_event_cancelar_ingreso = false
                this.is_event_finalizar_ingreso = false
                this.is_event_editar_ingreso = false
            }
            if ( evento == 'CANCELAR ENVIO' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = true
                this.is_event_recibir = false
                this.is_event_cancelar_ingreso = false
                this.is_event_finalizar_ingreso = false
                this.is_event_editar_ingreso = false
            }
            if ( evento == 'INICIAR INGRESO' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_recibir = true
                this.is_event_cancelar_ingreso = false
                this.is_event_finalizar_ingreso = false
                this.is_event_editar_ingreso = false
            }
            if ( evento == 'CANCELAR INGRESO' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_recibir = false
                this.is_event_cancelar_ingreso = true
                this.is_event_finalizar_ingreso = false
                this.is_event_editar_ingreso = false
            }
            if ( evento == 'FINALIZAR INGRESO' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_recibir = false
                this.is_event_cancelar_ingreso = false
                this.is_event_finalizar_ingreso = true
                this.is_event_editar_ingreso = false
            }
            if ( evento == 'EDITAR INGRESO' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_recibir = false
                this.is_event_cancelar_ingreso = false
                this.is_event_finalizar_ingreso = false
                this.is_event_editar_ingreso = true
            }

            await this.save_item(evento)
                .then((resp) => {
                    //console.log(resp.data.data)

                    if ( evento == 'CANCELAR PREPARACION' || ( evento == 'EDITAR' && this.item.attributes.estado == 'PREPARADO' ) ) {
                        for ( let item of this.item.relationships.stocktransferitems ) {
                            item.attributes.is_prepared = false;
                        }
                    }

                    if ( evento == 'CANCELAR INGRESO' ) {
                        for ( let item of this.item.relationships.stocktransferitems ) {
                            item.attributes.is_recibido = false;
                        }
                    }
                    
                    this.item.attributes.estado = resp.data.data.attributes.estado  
                    this.item.attributes.is_recibido = resp.data.data.attributes.is_recibido                     
                    this.item.relationships.user_destino = resp.data.data.relationships.user_destino
                    this.item.attributes.recibido_at = resp.data.data.attributes.recibido_at

                    this.$toast.success('Los cambios se han registrado correctamente.', { timeout: 3000 });
                })  
                .catch((error) => {
                    console.log(error)
                    if ( error.response ) {
                        this.$toast.error(error.response.data.message, { timeout: 3000 });
                    }else {
                        this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                    }
                    
                }).finally(() =>{
                    this.is_registrandoVenta = false
                })  

            this.is_event_guardar = false
            this.is_event_finalizar = false
            this.is_event_editar = false
            this.is_event_iniciar_preparacion = false
            this.is_event_cancelar_preparacion = false
            this.is_event_finalizar_preparacion = false
            this.is_event_enviar = false
            this.is_event_cancelar_envio = false
            this.is_event_recibir = false
            this.is_event_cancelar_ingreso = false
            this.is_event_finalizar_ingreso = false
            this.is_event_editar_ingreso = false
            

        },
        delete_stocktransfer () {
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
        }
    }
}
</script>

<style>

</style>