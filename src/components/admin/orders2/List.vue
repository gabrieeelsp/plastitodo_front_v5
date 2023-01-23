<template>
    <div>
        <v-row class="">
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <SelectClient 
                    label="Cliente"
                    @setClient="setClint"
                    :client="filters.client"
                />
            </v-col>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="sucursals_select"
                    item-text="name"
                    item-value="id"
                    v-model="filters.sucursal_id"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Sucursal"
                    clearable
                >
                </v-select>
            </v-col>

            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="[{name: 'Si', value: true}, {name: 'No', value: false}]"
                    item-text="name"
                    item-value="value"
                    v-model="filters.is_delivery"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Delivery"
                    clearable
                    @input="list_meta.page = 1"  
                >
                </v-select>
            </v-col>

            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="['EDITANDO', 'FINALIZADO', 'CONFIRMADO', 'EN PREPARACION', 'PREPARADO', 'FACTURADO', 'EN DISTRIBUCION', 'ENTREGADO', 'CANCELADO']"
                    v-model="filters.state"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Estado"
                    clearable
                >
                </v-select>
            </v-col>

            
            <v-col cols="12" sm="1" class="d-flex align-center">
                <v-btn small
                    @click="$emit('getItems')"
                >Search</v-btn>
                
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-simple-table
                    dense
                >
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th 
                                style="width: 50px;"
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Id
                            </th>

                            <th 
                                
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Cliente
                            </th>
                            <th 
                                style="width: 160px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Sucursal
                            </th>
                            <th 
                                style="width: 100px;"
                                class="text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Delivery
                            </th>
                            <th 
                                style="width: 120px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Entrega
                            </th>
                            <th 
                                style="width: 120px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Turno
                            </th>
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Estado
                            </th>
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Saldo
                            </th>
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Actions
                            </th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="item in items"
                        :key="item.id"
                        >
                        <td>{{ item.id }}</td>
                        <td v-if="item.relationships.client.attributes.tipo_persona == 'FISICA'" >{{ item.relationships.client.attributes.name + ' ' + item.relationships.client.attributes.surname }}</td>
                        <td v-else >{{ item.relationships.client.attributes.name }}</td>
                        <td class="text-center" v-if="item.relationships.sucursal" >{{ item.relationships.sucursal.attributes.name }}</td>
                        <td v-else class="text-center">--------</td>
                        <td class="">
                            <v-checkbox
                                class="mt-0 mb-0 ml-6"
                                style="width: 26px;"
                                hide-details=""
                                v-model="item.attributes.is_delivery"
                                disabled
                            ></v-checkbox>
                        </td>
                        <td class="text-center" v-if="item.attributes.fecha_entrega_acordada" >
                            <span>{{ item.attributes.fecha_entrega_acordada | luxon("dd-MM-yyyy") }}</span>
                        </td>
                        <td v-else class="text-center"></td>
                        <td class="text-center" v-if="item.relationships.deliveryshift" >{{ item.relationships.deliveryshift.attributes.name }}</td>
                        <td v-else class="text-center"></td>
                        <td class="text-center" >
                            <v-chip x-small class="ma-2 white--text" :color="color_state(item.attributes.state)" >{{ item.attributes.state }}</v-chip>
                        </td>
                        <td class="text-right" v-if="item.relationships.sale" >
                            <v-badge  color="error" dot :value="!saldo_confirmed(item.relationships.sale)"  >
                                <span>{{ globalHelperFixeDecimalMoney(saldo(item.relationships.sale)) | money_string }}</span>
                            </v-badge>
                        </td>
                        <td v-else class="text-center">--------</td>
                        
                        <td>
                            <v-btn
                                icon
                                @click="open_order_modal(item)"
                            >
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                        </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <OrderDistribucionPDF
                    :sucursal_id_default="filters.sucursal_id"
                />
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" md="4" class="d-flex align-center justify-center justify-md-end   pt-1 pb-1">
                <span class=" font-weight-bold text-caption grey--text font-weight-light">Items per page:</span>
                <div style="width: 75px; ">                                
                    <v-select
                        :items="list_meta.select_limit_items"
                        v-model="list_meta.limit"
                        label="Standard"
                        hide-details=""
                        single-line
                        class="rounded-sm ml-1 text-caption font-weight-light"
                        solo
                        dense
                        @input="setLimit"
                    ></v-select>
                </div>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center justify-md-end  pt-1 pb-1">
                <v-pagination
                    v-model="list_meta.page"
                    :length="list_meta.last_page"
                    :total-visible="5"
                    @input="setPage"
                    :disabled="list_meta.last_page <2"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                ></v-pagination>
            </v-col>
        </v-row>

        <ShowOrderModal 
            :dialogVisible="show_order_modal"
            :order="order_showed"
            v-if="order_showed && show_order_modal" 
            @close="close_order_modal"
        />

    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectClient from '@/components/admin/clients/SelectClient'
import ShowOrderModal from '@/components/admin/orders2/order/ShowOrderModal.vue'
import OrderDistribucionPDF from '@/components/admin/orders2/list/pdf/OrderDistribucionPDF'

import axios from 'axios'
export default {
    
    components: {
        SelectClient,
        ShowOrderModal,
        OrderDistribucionPDF,
    },
    data () {
        return {
            order_showed: null,
            show_order_modal: false,
        }
    },

    computed: {
        ...mapGetters({
            items: 'orders_manager/items',
            filters: 'orders_manager/filters',

            list_meta: 'orders_manager/list_meta',
            sucursals_select: 'sucursals_manager/sucursals_select',
            color_state: 'orders_manager/color_state',
        })
    },
    methods: {
        ...mapActions({
            set_item: 'orders_manager/set_item'
        }),
        open_order_modal (item) {
            axios.get(`orders/${item.id}`)
                .then(() => {
                    //console.log(resp.data.data)
                    //this.order_showed = resp.data.data
                    this.order_showed = item
                    this.show_order_modal = true
                })
            
        },
        close_order_modal () {
            this.show_order_modal = false
        },

        setLimit() {
            //this.set_list_meta_limt(this.limitSelected)
            this.list_meta.page = 1
            this.$emit('getItems')
        },
        setPage() {
            //this.set_list_meta_page(this.page)
            this.$emit('getItems')
        },
        setClint(client) {
            if ( client ) {
                this.filters.client_id = client.id
            }else {
                this.filters.client_id = null
            }
            
        },

        saldo ( sale ) {
            let saldo = Number(sale.attributes.total)
            for ( let payment of sale.relationships.payments ) {
                saldo = saldo - Number(payment.attributes.valor)
            }
            for ( let refund of sale.relationships.refunds ) {
                saldo = saldo + Number(refund.attributes.valor)
            }
            return saldo
        },

        saldo_confirmed ( sale ) {
            for ( let payment of sale.relationships.payments ) { 
                if ( !payment.attributes.is_confirmed ) { 
                    return false
                }
            }
            for ( let refund of sale.relationships.refunds ) {
                if ( !refund.attributes.is_confirmed ) {
                    return false
                }
            }
            return true
        },

    }
}
</script>

<style>

</style>