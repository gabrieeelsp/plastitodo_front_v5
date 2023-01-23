<template>
    <div class="pa-sm-3" v-if="orderActive">
        <v-row>
            <v-col cols="12" md="9">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <div class="">
                            <span class="text-h4 font-weight-light">Editor de PEDIDOS</span>

                            
                        </div>
                        <div>
                                <v-btn
                                    v-for="order in orders"
                                    :key="order.id"
                                    @click="set_order_active( order.id )"
                                    :depressed="orderActive.id == order.id"
                                    
                                    class="mr-1">
                                    Pedido {{ order.id }}
                                </v-btn>

                                <v-btn
                                    @click="create_order()"
                                    class="mr-1">New
                                </v-btn>
                            </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <v-row class="">
                            <v-col cols="12" class="">
                                <v-row>
                                    <v-col cols="8"> 
                                        <SelectProduct
                                            :disabled="!orderActive.client || orderActive.state != 'EDITANDO'"
                                         />

                                    </v-col>
                                    <v-spacer></v-spacer>
                                    <v-col cols="2" class="d-flex justify-end"> 
                                        <SearchOrderModal

                                            @set="agregarPedidoGuardado"
                                         />

                                    </v-col>
                                </v-row>
                                
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <ItemsOrderActive /> 
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="d-flex justify-end">
                                <v-btn                                        
                                    @click="show_OrderCheckSaleModal"
                                    color="primary"
                                    class="ml-1"
                                    outlined
                                    :loading="is_event_check"
                                    :disabled="orderActive.state == 'FACTURADO' || is_event_guardar || is_event_finalizar || is_event_editar || is_event_confirmar || is_event_iniciar_preparacion || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_facturar"
                                >
                                    
                                    Actualizar Precios
                                    <v-icon right>
                                        mdi-content-save-outline
                                    </v-icon>
                                </v-btn>
                                <v-spacer></v-spacer>
                                <OrderPDF
                                    v-if="orderActive.state != 'EDITANDO'"
                                    :order="orderActive"
                                    class="mr-auto"
                                    :disabled="is_event_guardar || is_event_finalizar || is_event_editar || is_event_confirmar || is_event_iniciar_preparacion || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_facturar || is_event_check"
                                />

                                <v-btn
                                    v-if="!orderActive.is_new"
                                    @click="destroy_order(orderActive.id)"
                                    color="error"
                                    text
                                    :disabled="orderActive.state != 'EDITANDO'"
                                >
                                    ELIMINAR
                                </v-btn>

                                <v-btn
                                    @click="delete_order(orderActive.id)"
                                    color="error"
                                    text
                                    :disabled="is_event_guardar || is_event_finalizar || is_event_editar || is_event_confirmar || is_event_iniciar_preparacion || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_facturar || is_event_check"
                                >
                                    Cerrar
                                </v-btn>
                                <v-btn                                        
                                    @click="save_order('GUARDAR')"
                                    color="success"
                                    class="ml-1"
                                    :loading="is_event_guardar"
                                    :disabled="!is_orderActive_ok_to_save || is_event_guardar || is_event_finalizar || is_event_editar || is_event_confirmar || is_event_iniciar_preparacion || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_facturar || is_event_check"
                                >
                                    
                                    Guardar
                                    <v-icon right>
                                        mdi-content-save-outline
                                    </v-icon>
                                </v-btn>
                                <template v-if="orderActive.state == 'EDITANDO'">
                                    
                                    <v-btn                                    
                                        @click="save_order('FINALIZAR')"
                                        color="success"
                                        :loading="is_event_finalizar"
                                        class="ml-1"
                                        :disabled="!orderActive.sucursal_id || is_event_guardar || is_event_finalizar || is_event_editar || is_event_confirmar || is_event_iniciar_preparacion || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_facturar || is_event_check"
                                    >
                                        
                                        Guardar y Finalizar
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <template v-if="orderActive.state == 'FINALIZADO'">
                                    <v-btn                                        
                                        @click="save_order('EDITAR')"
                                        color="warning"
                                        class="ml-1"
                                        :loading="is_event_editar"
                                        :disabled="is_event_guardar || is_event_finalizar || is_event_confirmar || is_event_iniciar_preparacion || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_facturar || is_event_check"
                                    >
                                        
                                        EDITAR
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                    <v-btn                                        
                                        @click="save_order('CONFIRMAR')"
                                        color="success"
                                        class="ml-1"
                                        :loading="is_event_confirmar"
                                        :disabled="is_event_guardar || is_event_finalizar || is_event_editar || is_event_iniciar_preparacion || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_facturar || is_event_check"
                                    >
                                        
                                        confirmar
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <template v-if="orderActive.state == 'CONFIRMADO'">
                                    <v-btn                                        
                                        @click="save_order('EDITAR')"
                                        color="warning"
                                        class="ml-1"
                                        :loading="is_event_editar"
                                        :disabled="is_event_guardar || is_event_finalizar || is_event_confirmar || is_event_iniciar_preparacion || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_facturar || is_event_check"
                                    >
                                        
                                        EDITAR
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                    <v-btn                                        
                                        @click="save_order('INICIAR PREPARACION')"
                                        color="success"
                                        class="ml-1"
                                        :loading="is_event_iniciar_preparacion"
                                        :disabled="is_event_guardar || is_event_finalizar || is_event_editar || is_event_confirmar || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_facturar || is_event_check"
                                    >
                                        
                                        Iniciar Preparación
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <template v-if="orderActive.state == 'EN PREPARACION'">
                                    <v-btn                                        
                                        @click="save_order('CANCELAR PREPARACION')"
                                        color="warning"
                                        class="ml-1"
                                        :loading="is_event_cancelar_preparacion"
                                        :disabled="is_event_guardar || is_event_finalizar || is_event_editar || is_event_confirmar || is_event_iniciar_preparacion || is_event_finalizar_preparacion || is_event_facturar || is_event_check"
                                    >
                                        
                                        Cancelar preparación
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                    <v-btn                                        
                                        @click="save_order('FINALIZAR PREPARACION')"
                                        color="success"
                                        class="ml-1"
                                        :loading="is_event_finalizar_preparacion"
                                        :disabled="!is_orderActive_prepared || !is_order_active_complete_total || !(Number(orderActive.cant_bultos) > 0) || is_event_guardar || is_event_finalizar || is_event_editar || is_event_confirmar || is_event_iniciar_preparacion || is_event_cancelar_preparacion || is_event_facturar || is_event_check"
                                    >
                                        
                                        finalizar preparación
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                </template>
                                <template v-if="orderActive.state == 'PREPARADO'">
                                    <v-btn                                        
                                        @click="save_order('EDITAR')"
                                        color="warning"
                                        class="ml-1"
                                        :loading="is_event_editar"
                                        :disabled="is_event_guardar || is_event_finalizar || is_event_confirmar || is_event_iniciar_preparacion || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_facturar || is_event_check"
                                    >
                                        
                                        EDITAR
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                    <v-btn                                        
                                        @click="save_order('FACTURAR')"
                                        color="primary"
                                        class="ml-1"
                                        outlined
                                        :loading="is_event_facturar"
                                        :disabled="is_event_guardar || is_event_finalizar || is_event_editar || is_event_confirmar || is_event_iniciar_preparacion || is_event_cancelar_preparacion || is_event_finalizar_preparacion || is_event_check"
                                    >
                                        
                                        Facturar
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
                <v-row class="">
                    <v-col cols="12">
                        <MenuClientOrderActive  />
                    </v-col>
                    <v-col cols="12">
                        <OrderUser  />
                    </v-col>
                    <v-col cols="12">
                        <ModeloFactOrderActive
                            :disabled="!orderActive.client || orderActive.state == 'FACTURADO'"
                        />
                    </v-col>
                    <v-col cols="12">
                        <SucursalOrderActive
                            :disabled="orderActive.state != 'EDITANDO'"
                        />
                    </v-col>
                    <v-col cols="12">
                        <DiahoraOrderActive
                            
                        />
                    </v-col>
                    <v-col cols="12">
                        <MetadataOrder
                            
                        />
                    </v-col>
                    <v-col cols="12">
                        <TotalOrder />
                    </v-col>
                </v-row>
                
            </v-col>

        </v-row>
        
        <OrderCheckSaleModal
            v-if="showOrderCheckSaleModal"    
            :dialogVisible="showOrderCheckSaleModal"
            :order="orderCheckSale"
            @close="showOrderCheckSaleModal = false"
            @actualizar_precios="actualizar_precios"
        />
    </div>

</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

import ItemsOrderActive from '@/components/admin/orders/order_register/ItemsOrderActive.vue'
import MenuClientOrderActive from '../../../components/admin/orders/order_register/MenuClientOrderActive.vue'
import SelectProduct from '@/components/admin/orders/order_register/SelectProduct'
import ModeloFactOrderActive from '@/components/admin/orders/order_register/ModeloFactOrderActive'
import SucursalOrderActive from '@/components/admin/orders/order_register/SucursalOrderActive'
import DiahoraOrderActive from '@/components/admin/orders/order_register/DiahoraOrderActive'
import MetadataOrder from '@/components/admin/orders/order_register/MetadataOrder.vue'

import TotalOrder from '@/components/admin/orders/order_register/TotalOrder'
import SearchOrderModal from '@/components/admin/orders/list/SearchOrderModal'

import OrderUser from '@/components/admin/orders/order_register/OrderUser'

import OrderPDF from '@/components/admin/orders/pdf/OrderPDF'

import OrderCheckSaleModal from '@/components/admin/orders/order_register/OrderCheckSaleModal'

export default {

    mounted() {
        
        if ( this.orders.length == 0 ) {
            this.new_order().then((order) => {
                this.order = order
            })
        }
        
    },
    components: {
        ItemsOrderActive,
        MenuClientOrderActive,
        SelectProduct,
        TotalOrder,
        ModeloFactOrderActive,
        SucursalOrderActive,
        DiahoraOrderActive,
        SearchOrderModal,
        OrderUser,
        OrderPDF,
        OrderCheckSaleModal,
        MetadataOrder,
    },
    data: () => ({
        is_registrandoOrder: false,
        is_event_guardar: false,
        is_event_finalizar: false,
        is_event_editar: false,
        is_event_confirmar: false,
        is_event_iniciar_preparacion: false,
        is_event_cancelar_preparacion: false,
        is_event_finalizar_preparacion: false,
        is_event_facturar: false,
        is_event_check: false,


        showOrderCheckSaleModal: false,
        orderCheckSale: null,
        
    }),
    computed: {
        ...mapGetters({
            orders: 'order_manager/orders',
            orderActive: 'order_manager/orderActive',
            cantItemsOrderActive: 'order_manager/cantItemsOrderActive',
            is_orderActive_ok_to_save: 'order_manager/is_orderActive_ok_to_save',
            is_order_active_complete_total: 'order_manager/is_order_active_complete_total',
            
        }),
        is_orderActive_prepared ( ) {
            for ( let item of this.orderActive.items ) {
                if ( !item.is_prepared ) {
                    return false
                }
            }
            for ( let comboitem of this.orderActive.comboitems ) {
                for ( let itemcombo of comboitem.comboItems ) {
                    for ( let saleproduct of itemcombo.saleproducts ) {
                        if ( saleproduct.cantidad != 0 && !saleproduct.is_prepared ) {
                            return false
                        }
                    }
                }
                
            }
            return true
        },
    },
    methods: {
        ...mapActions({
            new_order: 'order_manager/new_order',
            addOrder: 'order_manager/addOrder',
            set_order_active: 'order_manager/set_order_active',
            remove_order: 'order_manager/remove_order',
            save_orderActive: 'order_manager/save_orderActive',
            set_state: 'order_manager/set_state',

            update_precios: 'order_manager/update_precios',

            destroy_item: 'order_manager/destroy_item',

        }),

        create_order () {
            this.new_order().then((order) => {
                this.order = order
            })
        },

        delete_order(order_id) {
            this.remove_order(order_id)
            if( this.orders.length == 0){
                this.new_order()
            }else {
                const id = this.orders[0].id
                this.set_order_active(id)
            }
        },

        async agregarPedidoGuardado (item) {
            await axios.get(`orders/${item.id}`)
                .then((resp) => {
                    //console.log(resp.data.data)

                    for ( let order of this.orders ) {
                        if (order.id == resp.data.data.id ) {
                            this.$toast.info('El pedido ya se encuentra cargado', { timeout: 3000 });
                            this.set_order_active(resp.data.data.id)
                            return null
                        }
                    }
                    this.addOrder(resp.data.data)
                    //console.log(this.orderActive)
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        async save_order(evento) {
            if ( evento == 'GUARDAR' ) {
                this.is_event_guardar = true
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_confirmar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_facturar = false
                this.is_event_check = false
            }
            if ( evento == 'FINALIZAR') {
                this.is_event_guardar = false
                this.is_event_finalizar = true
                this.is_event_editar = false
                this.is_event_confirmar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_facturar = false
                this.is_event_check = false
            }
            if ( evento == 'EDITAR' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = true
                this.is_event_confirmar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_facturar = false
                this.is_event_check = false
            }
            if ( evento == 'CONFIRMAR' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_confirmar = true
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_facturar = false
                this.is_event_check = false
            }
            if ( evento == 'INICIAR PREPARACION' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_confirmar = false
                this.is_event_iniciar_preparacion = true
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_facturar = false
                this.is_event_check = false
            }
            if ( evento == 'CANCELAR PREPARACION' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_confirmar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = true
                this.is_event_finalizar_preparacion = false
                this.is_event_facturar = false
                this.is_event_check = false
            }
            if ( evento == 'FINALIZAR PREPARACION' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_confirmar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = true
                this.is_event_facturar = false
                this.is_event_check = false
            }
            if ( evento == 'FACTURAR' ) {
                this.is_event_guardar = false
                this.is_event_finalizar = false
                this.is_event_editar = false
                this.is_event_confirmar = false
                this.is_event_iniciar_preparacion = false
                this.is_event_cancelar_preparacion = false
                this.is_event_finalizar_preparacion = false
                this.is_event_facturar = true
                this.is_event_check = false
            }

            await this.save_orderActive(evento)
                .then((resp) => {
                    //console.log(resp.data.data)
                    if ( this.orderActive.is_new ) {
                        this.orderActive.id = resp.data.data.id  
                        this.orderActive.is_new = false 
                        this.orderActive.user = {
                            id: resp.data.data.relationships.user.id,
                            name: resp.data.data.relationships.user.attributes.name,
                            surname: resp.data.data.relationships.user.attributes.surname,
                        } 
                        this.orderActive.created_at = resp.data.data.attributes.created_at
                                     
                    }


                    if ( evento == 'CANCELAR PREPARACION' || ( evento == 'EDITAR' && this.orderActive.state == 'PREPARADO' ) ) {
                        for ( let item of this.orderActive.items ) {
                            item.is_prepared = false;
                        }

                        for ( let comboitem of this.orderActive.comboitems ) {
                            for ( let comboItem of comboitem.comboItems ) {
                                for ( let saleproduct of comboItem.saleproducts ) {
                                    saleproduct.is_prepared = false;
                                }
                            }
                        }
                    }

                    if ( 
                        ( evento == 'GUARDAR' && this.orderActive.state == 'EN PREPARACION' )
                        || 
                        ( evento == 'CANCELAR PREPARACION' && this.orderActive.state == 'EN PREPARACION' )  
                        ||
                        ( evento == 'FINALIZAR PREPARACION' && this.orderActive.state == 'EN PREPARACION' ) 
                        ||
                        ( evento == 'EDITAR' && this.orderActive.state == 'PREPARADO' )     
                    ) {
                        
                        for ( let item of this.orderActive.items ) {
                            for ( let orderitem of resp.data.data.relationships.orderitems ) {
                                if ( item.saleproduct_id == orderitem.saleproduct_id ) {
                                    item.relationships.stockproduct.relationships.stocksucursals = orderitem.relationships.saleproduct.relationships.stockproduct.relationships.stocksucursals
                                }
                            }
                        }
                        
                        for ( let comboitem of this.orderActive.comboitems ) {
                            for ( let ordercomboitem of resp.data.data.relationships.ordercomboitems ) {
                                
                                if ( comboitem.comboId == ordercomboitem.relationships.combo.id ) {
                                    for ( let comboItem of comboitem.comboItems ) {
                                        for ( let ordercomboItem of ordercomboitem.relationships.combo.relationships.comboitems ) {
                                            if ( comboItem.comboitemId == ordercomboItem.id ) {
                                                for ( let saleproduct of comboItem.saleproducts ) {
                                                    for ( let ordersaleproduct of ordercomboItem.relationships.saleproducts ) {
                                                        if ( saleproduct.saleproductId == ordersaleproduct.id ) {
                                                            
                                                            saleproduct.relationships.stockproduct = ordersaleproduct.relationships.stockproduct
                                                        }
                                                    }
                                                }
                                            }
                                            
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if ( evento == 'FACTURAR' ) {
                        this.orderActive.sale = resp.data.data.relationships.sale
                    }

                    
                    this.orderActive.state = resp.data.data.attributes.state                     

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
            this.is_event_confirmar = false
            this.is_event_iniciar_preparacion = false
            this.is_event_cancelar_preparacion = false
            this.is_event_finalizar_preparacion = false
            this.is_event_facturar = false      
            this.is_event_check = false
        },

        async show_OrderCheckSaleModal ( ) {
            this.is_event_guardar = false
            this.is_event_finalizar = false
            this.is_event_editar = false
            this.is_event_confirmar = false
            this.is_event_iniciar_preparacion = false
            this.is_event_cancelar_preparacion = false
            this.is_event_finalizar_preparacion = false
            this.is_event_facturar = false
            this.is_event_check = true
            await axios.get(`orders/${this.orderActive.id}/get_order_check_sale`)
                .then((resp) => {
                    this.orderCheckSale = resp.data.data
                    //console.log(this.orderCheckSale)
                    this.showOrderCheckSaleModal = true
                })
                .catch((error) => {
                    console.log(error)
                })
            this.is_event_check = false
        },

        actualizar_precios ( items ) {
            this.update_precios(items)
                .then((resp) => {
                    //console.log(resp.data.data)
                    for ( let item_updated of resp.data.data.relationships.orderitems ) {
                        for ( let item of this.orderActive.items ) {
                            if ( item.saleProductId == item_updated.attributes.saleproduct_id ) {
                                item.precio = item_updated.attributes.precio
                            }
                        }
                    }
                    for ( let comboitem_updated of resp.data.data.relationships.ordercomboitems ) {
                        for ( let comboitem of this.orderActive.comboitems ) { 
                            if ( comboitem.comboId == comboitem_updated.relationships.combo.id ) {
                                comboitem.precio = comboitem_updated.attributes.precio
                            }
                        }
                    }
                })
        },

        destroy_order (id) {
            this.destroy_item(id)
                .then(() => {
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 })
                    this.delete_order(id)
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