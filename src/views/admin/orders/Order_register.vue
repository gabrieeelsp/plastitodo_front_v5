<template>
    <div class="pa-sm-3" v-if="orderActive">
        <v-row>
            <v-col cols="12" md="9">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <div class="">
                            <span class="text-h4 font-weight-light">Order Register</span>

                            
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
                                    :loading="is_registrandoOrder"
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
                                />

                                <v-btn
                                    @click="delete_order(orderActive.id)"
                                    color="error"
                                    text
                                >
                                    Cerrar
                                </v-btn>
                                <v-btn
                                        :disabled="!is_orderActive_ok_to_save"
                                        
                                        @click="save_order('GUARDAR')"
                                        color="success"
                                        class="ml-1"
                                        :loading="is_registrandoOrder"
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
                                        :loading="is_registrandoOrder"
                                        class="ml-1"
                                        :disabled="!is_orderActive_ok_to_save || !orderActive.sucursal_id"
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
                                        :loading="is_registrandoOrder"
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
                                        :loading="is_registrandoOrder"
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
                                        :loading="is_registrandoOrder"
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
                                        :loading="is_registrandoOrder"
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
                                        :loading="is_registrandoOrder"
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
                                        :loading="is_registrandoOrder"
                                        :disabled="!is_orderActive_prepared || !is_order_active_complete_total"
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
                                        :loading="is_registrandoOrder"
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
                                        :loading="is_registrandoOrder"
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
                            :disabled="!orderActive.client"
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
                        <TotalOrder />
                    </v-col>
                </v-row>
                
            </v-col>

        </v-row>
        {{ orderActive }}
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
    },
    data: () => ({
        is_registrandoOrder: false,

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
            this.is_registrandoVenta = true
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
                                    item.relationships.stockproduct.relationships.stocksucursals = orderitem.relationships.stockproduct.relationships.stocksucursals
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
                    this.$toast.error(error.response.data.message, { timeout: 3000 });
                }).finally(() =>{
                    this.is_registrandoVenta = false
                })        
            
        },

        async show_OrderCheckSaleModal ( ) {
            await axios.get(`orders/${this.orderActive.id}/get_order_check_sale`)
                .then((resp) => {
                    this.orderCheckSale = resp.data.data
                    //console.log(this.orderCheckSale)
                    this.showOrderCheckSaleModal = true
                })
                .catch((error) => {
                    console.log(error)
                })
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
        }
        
        
        
    }
}
</script>

<style>

</style>