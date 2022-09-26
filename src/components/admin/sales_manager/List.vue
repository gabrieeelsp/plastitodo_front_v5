<template>
    <div >

        <v-row>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <SelectClient 
                    label="Cliente"
                    @setClient="setClint"
                    :client="client"
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
                <SelectUser 
                    label="Usuario"
                    @setUser="setUser"
                    :user="user"
                />
            </v-col>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <DateRangePicker 
                    @setRangeDate="setRangeDate"
                    :date_from="date_from_default"
                    :date_to="date_to_default"
                />
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
                            Número
                        </th>

                        <th 
                            
                            class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                            Cliente
                        </th>
                        <th 
                            
                            class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                            Usruario
                        </th>
                        <th 
                            
                            class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                            Sucursal
                        </th>
                        <th 
                            style="width: 180px;"
                            class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                            Fecha
                        </th>
                        <th 
                            style="width: 180px;"
                            class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                            Comprobante
                        </th>
                        
                        <th 
                            style="width: 80px;"
                            class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                            Total
                        </th>
                        <th 
                            style="width: 80px;"
                            class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
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
                        v-for="sale in sales"
                        :key="sale.id"
                        >
                        <td>{{ sale.id }}</td>
                        <td v-if="sale.relationships.client">{{ sale.relationships.client.attributes.name }}</td>
                        <td v-else>---</td>
                        <td>{{ sale.relationships.user.attributes.name }}</td>
                        <td>{{ sale.relationships.sucursal.attributes.name }}</td>
                        <td class="text-right">{{ sale.attributes.created_at | luxon("dd-MM-yyyy HH:mm") }}</td>
                        <td>
                            <span v-if="sale.relationships.comprobante">{{ sale.relationships.comprobante.attributes.tipo }} {{ sale.relationships.comprobante.attributes.punto_venta | punto_venta_string }} - {{ sale.relationships.comprobante.attributes.numero | numero_factura_string }}</span>
                        </td>
                        <td class="text-right">{{ globalHelperFixeDecimalMoney(sale.attributes.total) | money_string }}</td>
                        <td class="text-right" :class="sale.attributes.saldo_sale > 0 ? 'red--text': ''" >
                            <v-badge  color="error" dot :value="!saldo_confirmed(sale)"  >
                                <span>{{ globalHelperFixeDecimalMoney(sale.attributes.saldo_sale) | money_string }}</span>
                            </v-badge>
                        </td>
                        <v-btn
                            icon
                            @click="showSalePage(sale.id)"
                        >
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>

        <v-row>
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
        {{ sales }}
    </div>
</template>

<script>

import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

import DateRangePicker from '@/components/admin/utils/DateRangePicker'
import SelectClient from '@/components/admin/clients/SelectClient'
import SelectUser from '@/components/admin/users/SelectUser'
export default {
    

    data () {
        return {

            //client_id: null,
            //date_from: null,
            date_to: null,
            user_id: null,

            
        }
    },

    computed: {
        ...mapGetters({
            sales: 'sales_manager/sales',
            client: 'sales_manager/client',
            user: 'sales_manager/user',
            date_from_default: 'sales_manager/date_from',
            date_to_default: 'sales_manager/date_to',

            list_meta: 'sales_manager/list_meta',

            sucursals_select: 'sucursals_manager/sucursals_select',
            filters: 'sales_manager/filters',
        })
    },
    components: {
        DateRangePicker,
        SelectClient,
        SelectUser
    },
    methods: {
        ...mapActions({
            set_list_meta_limt: 'sales_manager/set_list_meta_limt',
            set_list_meta_page: 'sales_manager/set_list_meta_page',
            set_client: 'sales_manager/set_client',
            set_user: 'sales_manager/set_user',

            set_date_from: 'sales_manager/set_date_from',
            set_date_to: 'sales_manager/set_date_to',
        }),


        

        setClint(id) {
            this.set_client(id)
        },
        setRangeDate(range) {
            if(range[1]) {
                this.date_from = range[0]
                this.date_to = range[1]
            
                this.set_date_from(this.date_from)
                this.set_date_to(this.date_to)
            }else {
                this.set_date_from(null)
                this.set_date_to(null)
            }
            
            
        },
        setLimit() {
            //this.set_list_meta_limt(this.limitSelected)
            this.$emit('getItems')
        },
        setPage() {
            //this.set_list_meta_page(this.page)
            this.$emit('getItems')
        },
        setUser(user) {
            this.set_user(user)
        },

        async showSalePage( sale_id ) {
            this.$emit('show_sale', sale_id)
               
        },
        saldo ( sale ) {
            let saldo = Number(sale.attributes.total)
            for ( let payment of sale.relationships.payments ) {
                saldo = saldo - Number(payment.attributes.valor)
                console.log('Payment: ' + payment.attributes.valor)
            }

            console.log('Payments: ' + saldo)
            for ( let refund of sale.relationships.refunds ) {
                saldo = saldo + Number(refund.attributes.valor)
                console.log('refund: ' + refund.attributes.valor)
            }
            console.log('refund: ' + saldo)
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