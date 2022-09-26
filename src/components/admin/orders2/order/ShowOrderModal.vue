<template>
  

    <v-dialog
      v-model="intDialogVisible"
      max-width="900"
    >
      <v-card v-if="order">
        <v-card-title class="text-h5">

          
        </v-card-title>
        <v-card-text>
            
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="2">
                    <span> </span>
                </v-col>
                <v-col cols="3" class="text-right">
                    <span class="text-h6">Pedido: #{{ globalHelperFixNumeroDocuento(order.id) }}</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6">
                    <v-row>
                        <v-col cols="3" class="pt-1 pb-1">
                            <span class="mt-0">Cliente:</span>
                        </v-col>
                        <v-col cols="8" class="pt-1 pb-1">
                            <span v-if="order.relationships.client.attributes.tipo_persona == 'FISICA'">{{ order.relationships.client.attributes.name + ' ' + order.relationships.client.attributes.surname }}</span>
                            <span v-else>{{ order.relationships.client.attributes.name }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="3" class="pt-1 pb-1">
                            <span>Dirección:</span>
                        </v-col>
                        <v-col cols="8" class="pt-1 pb-1">
                            <span>{{ order.relationships.client.attributes.direccion }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="3" class="pt-1 pb-1">
                            <span>Teléfono:</span>
                        </v-col>
                        <v-col cols="8" class="pt-1 pb-1">
                            <span>{{ order.relationships.client.attributes.telefono }}</span>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="6" class="pt-0">
                    <v-card outlined >
                        <v-card-text>
                            <v-row>
                                <v-col cols="3" class="pt-1 pb-1">
                                    <span>Estado: </span>
                                </v-col>
                                <v-col cols="8" class="pt-1 pb-1 d-flex justify-space-between align-center">
                                    <span>{{ order.attributes.state }}</span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="3" class="pt-1 pb-1">
                                    <span>Entrega: </span>
                                </v-col>
                                <v-col cols="8" class="pt-1 pb-1">
                                    <span v-if="order.attributes.is_delivery" >Delivery</span>
                                    <span v-else >Retiro</span>
                                </v-col>
                            </v-row>

                        </v-card-text>
                        <v-card-actions>
                            <v-row>
                                <template v-if="order.attributes.state == 'FACTURADO' && order.attributes.is_delivery">
                                    <v-col>
                                        <v-btn :loading="is_event_enviar" small block @click="set_state_item('ENVIAR')">Enviar</v-btn>
                                    </v-col>
                                </template>
                                <template v-if="order.attributes.state == 'FACTURADO' && !order.attributes.is_delivery">
                                    <v-col>
                                        <v-btn :loading="is_event_set_entregado" small block @click="set_state_item('SET ENTREGADO')">Entregado</v-btn>
                                    </v-col>
                                </template>
                                <template v-if="order.attributes.state == 'PREPARADO'">
                                    <v-col>
                                        <v-btn :loading="is_event_facturar" small block @click="set_state_item('FACTURAR')">Facturar</v-btn>
                                    </v-col>
                                </template>
                                <template v-if="order.attributes.state == 'EN DISTRIBUCION'">
                                    <v-col>
                                        <v-btn :loading="is_event_cancelar_envio" :disabled="is_event_set_entregado" small block @click="set_state_item('CANCELAR ENVIO')">Cancelar Envío</v-btn>
                                    </v-col>
                                    <v-col>
                                        <v-btn :loading="is_event_set_entregado" :disabled="is_event_cancelar_envio" small block @click="set_state_item('SET ENTREGADO')">Entregado</v-btn>
                                    </v-col>
                                </template>
                                <template v-if="order.attributes.state == 'ENTREGADO'">
                                    <v-col>
                                        <v-btn :loading="is_event_cancelar_entregado" small block @click="set_state_item('CANCELAR ENTREGADO')">Cancelar Entrega</v-btn>
                                    </v-col>
                                </template>
                            </v-row>
                            
                            
                        </v-card-actions>
                    </v-card>
                    
                    
                    
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <OrderPDF
                        v-if="order.attributes.state == 'FINALIZADO' || order.attributes.state == 'CONFIRMADO' || order.attributes.state == 'EN PREPARACION' || order.attributes.state == 'PREPARADO' || order.attributes.state == 'FACTURADO' || order.attributes.state == 'EN DISTRIBUCION' || order.attributes.state == 'ENTREGADO'"
                        :order="order"
                    />
                </v-col>
            </v-row>
            
            

            <v-row class="">
                <v-col cols="12"  class="">
                    <ItemsOrderActive
                        :order="order"
                        :is_OrderStockUnitarioVariable="is_OrderStockUnitarioVariable"
                    />
                </v-col>
            </v-row>
        </v-card-text>


      </v-card>
    </v-dialog>
  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ItemsOrderActive from '@/components/admin/orders2/order_modal/ItemsOrderActive.vue'
import OrderPDF from '@/components/admin/orders2/list/pdf/OrderPDF.vue'
  export default {
    mounted () {
        
    },
    data () {
        return {
            is_event_facturar: false,
            is_event_enviar: false,
            is_event_cancelar_envio: false,
            is_event_set_entregado: false,
            is_event_cancelar_entregado: false,
        }
    },
    components: {
        ItemsOrderActive,
        OrderPDF,
    },
    props: {
        dialogVisible: Boolean,
        order: Object,
    
    },
    computed: {
        ...mapGetters({
            url_asset: 'url_asset',
        }),        
        intDialogVisible: {
            get: function () {
                if (this.dialogVisible) {
                    
                // Some dialog initialization code could be placed here
                // because it is called only when this.dialogVisible changes
                }

                return this.dialogVisible
            },
            set: function (value) {
                    if (!value) {
                    this.$emit('close')
                    }
            }
        },

        is_OrderStockUnitarioVariable: function () {
            for ( let orderitem of this.order.relationships.orderitems) {
                if( orderitem.relationships.saleproduct.relationships.stockproduct.attributes.is_stock_unitario_variable ) {
                    return true
                }
            }
            return false
        },
    },
    methods: {
        ...mapActions({
            save_item: 'orders_manager/save_item',
            update_state_item: 'orders_manager/update_state_item',
        }),
        
        async set_state_item ( evento ) {

            if ( evento == 'ENVIAR' ) {
                if ( this.order.attributes.fecha_entrega_acordada == null || this.order.attributes.cant_bultos == null || this.order.relationships.deliveryshift == null  ) {
                    this.$toast.error('Se deben completar los siguientes datos: Fecha de entrega, Turno, Cantidad de bultos', { timeout: 3000 });
                    return false
                }
                this.is_event_facturar = false
                this.is_event_enviar = true
                this.is_event_cancelar_envio = false
                this.is_event_set_entregado = false
                this.is_event_cancelar_entregado = false
                
            }
            if ( evento == 'CANCELAR ENVIO' ) {
                this.is_event_facturar = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = true
                this.is_event_set_entregado = false
                this.is_event_cancelar_entregado = false
            }
            if ( evento == 'SET ENTREGADO' ) {
                this.is_event_facturar = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_set_entregado = true
                this.is_event_cancelar_entregado = false
            }
            if ( evento == 'FACTURAR' ) {
                this.is_event_facturar = true
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_set_entregado = false
                this.is_event_cancelar_entregado = false
            }
            if ( evento == 'CANCELAR ENTREGADO' ) {
                this.is_event_facturar = false
                this.is_event_enviar = false
                this.is_event_cancelar_envio = false
                this.is_event_set_entregado = false
                this.is_event_cancelar_entregado = true
            }

            let ivacondition_id = null
            if ( this.order.relationships.ivacondition ) {
                ivacondition_id = this.order.relationships.ivacondition.id
            }
            let sucursal_id = null
            if ( this.order.relationships.sucursal ) {
                sucursal_id = this.order.relationships.sucursal.id
            }
            let deliveryshift_id = null
            if ( this.order.relationships.deliveryshift ) {
                deliveryshift_id = this.order.relationships.deliveryshift.id
            }

            let fecha_entrega_acordada = null
            if ( this.order.attributes.fecha_entrega_acordada ) {
                fecha_entrega_acordada = this.order.attributes.fecha_entrega_acordada.substring(8, 10) + '-' + this.order.attributes.fecha_entrega_acordada.substring(5, 7) + '-' + this.order.attributes.fecha_entrega_acordada.substring(0, 4)
            }

            await this.save_item({
                id: this.order.id, 
                evento: evento,
                ivacondition_id: ivacondition_id,
                sucursal_id: sucursal_id,
                deliveryshift_id: deliveryshift_id,
                fecha_entrega_acordada: fecha_entrega_acordada,
                is_delivery: this.order.attributes.is_delivery
                })
                .then((resp) => {
                    if ( evento == 'ENVIAR' ) {
                        this.update_state_item({id: this.order.id, state: resp.data.data.attributes.state})
                    }
                    if ( evento == 'CANCELAR ENVIO' ) {
                        this.update_state_item({id: this.order.id, state: resp.data.data.attributes.state})
                    }
                    if ( evento == 'SET ENTREGADO' ) {
                        this.update_state_item({id: this.order.id, state: resp.data.data.attributes.state})
                    }
                    if ( evento == 'FACTURAR' ) {
                        this.update_state_item({id: this.order.id, state: resp.data.data.attributes.state})
                    }
                    if ( evento == 'CANCELAR ENTREGADO' ) {
                        this.update_state_item({id: this.order.id, state: resp.data.data.attributes.state})
                    }
                })
                .catch((error) => {
                    console.log(error)
                }) 
            this.is_event_facturar = false
            this.is_event_enviar = false
            this.is_event_cancelar_envio = false
            this.is_event_set_entregado = false
            this.is_event_cancelar_entregado = false
            
        }
    }
  }
</script>