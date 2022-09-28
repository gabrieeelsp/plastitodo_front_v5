<template>
    <div v-if="caja">
        <v-row>
            <v-col sm="3">
                <v-row>
                    <v-col>
                        <v-card class="" outlined v-if="caja_edit" >
                            <v-card-title class="blue lighten-4 pt-1 pb-1 d-flex justify-center">
                                <span class="text-body-1 font-weight-medium">EFECTIVO</span>
                            </v-card-title>
                            <v-divider></v-divider>

                            <v-card-text class="pa-1">

                                <v-simple-table dense class="">
                                        <template v-slot:default>
                                        <tbody>
                                            <tr >
                                                <td class="pl-2">Dinero Inicial</td>
                                                <td class=""></td>
                                                <td class="text-right">{{ globalHelperFixeDecimalMoney(caja_edit.attributes.dinero_inicial) }}</td>
                                                <td class=""></td>
                                                
                                            </tr>
                                            <tr >
                                                <td class="pl-2">Ingreso</td>
                                                <td class=""></td>
                                                <td class="text-right">{{ globalHelperFixeDecimalMoney(ingreso_paymentmethod(1)) }}</td>
                                                <td class=""></td>
                                                
                                            </tr>
                                            <tr class="">
                                                <td class="pl-2">Egreso</td>
                                                <td></td>
                                                <td class="text-right">{{ globalHelperFixeDecimalMoney(egreso_paymentmethod(1)) }}</td>
                                                <td></td>
                                                
                                            </tr>
                                            <tr class="">
                                                <td class="pl-2">Saldo</td>
                                                <td></td>
                                                <td class="text-right">{{ globalHelperFixeDecimalMoney(saldo_paymentmethod(1)) }}</td>
                                                <td></td>
                                                
                                            </tr>
                                            <tr>
                                                <td class="pl-2">Recuento</td>
                                                <td></td>
                                                <td class="text-right">{{ globalHelperFixeDecimalMoney(recuento_efectivo) }}</td>
                                                <td style="width: 50px;" class="text-right pl-2 pr-2">
                                                    <v-btn small @click="showing = { id: 1, tipo: null, name:  null }">Ver</v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                        </template>
                                    </v-simple-table>
                                
                            </v-card-text>                    
                        </v-card>
                    </v-col>
                </v-row>
                <div v-for="paymentmethod of paymentmethods" :key="paymentmethod.id">
                    <v-row v-if="paymentmethod.id != 1 && show_paymentmethod(paymentmethod.id)">
                        <v-col>
                            <v-card class="" outlined >
                                <v-card-title class="blue lighten-4 pt-1 pb-1 d-flex justify-center">
                                    <span class="text-body-1 font-weight-medium">{{ paymentmethod.attributes.name }}</span>
                                </v-card-title>
                                <v-divider></v-divider>

                                <v-card-text class="pa-1">

                                    <v-simple-table class=""> 
                                        <template v-slot:default>
                                        <tbody>
                                            <tr class="">
                                                <td class="pl-2">Ingreso</td>
                                                <td class="text-right">{{ globalHelperFixeDecimalMoney(ingreso_paymentmethod(paymentmethod.id)) }}</td>
                                                <td class="text-right">{{ globalHelperFixeDecimalMoney(ingreso_paymentmethod_checked(paymentmethod.id)) }}</td>
                                                <td style="width: 50px;" class="text-right pl-2 pr-2">
                                                    <v-btn small @click="showing = { id: paymentmethod.id, tipo: 'Ingreso', name: paymentmethod.attributes.name }">Ver</v-btn>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="pl-2">Egreso</td>
                                                <td class="text-right">{{ globalHelperFixeDecimalMoney(egreso_paymentmethod(paymentmethod.id)) }}</td>
                                                <td class="text-right">{{ globalHelperFixeDecimalMoney(egreso_paymentmethod_checked(paymentmethod.id)) }}</td>
                                                <td style="width: 50px;" class="text-right pl-2 pr-2">
                                                    <v-btn small @click="showing = { id: paymentmethod.id, tipo: 'Egreso', name: paymentmethod.attributes.name }">Ver</v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                        </template>
                                    </v-simple-table>
                                </v-card-text>                    
                            </v-card>
                        </v-col>
                    </v-row>
                </div>
                
                
                
                             
            </v-col>
            <v-col sm="6">
                <v-card outlined v-if="showing.id == 1">
                    <v-card-title class="blue lighten-4 pt-1 pb-1 d-flex justify-center">
                        <span class="text-body-1 font-weight-medium">EFECTIVO [ Recuento ]</span>
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-card-text>                       
                        <v-row class="mt-1">
                            <v-col sm="6">
                                <v-row v-for="valor in valors_list.filter((i) => { return i.valor.attributes.name.startsWith('B')})" :key="'B'+valor.valor.id">
                                    <v-spacer></v-spacer>
                                    <v-col sm="7" class="d-flex align-center justify-start">
                                        <span>{{ valor.valor.attributes.name }}</span>
                                    </v-col>
                                    <v-col sm="4" class="pt-0 ">
                                        <v-text-field                                                    
                                            class="right-text-input"                                               
                                            type="number"
                                            dense
                                            v-model="valor.cantidad"
                                            hide-details=""
                                            @focus="$event.target.select()" 
                                        ></v-text-field>
                                    </v-col>
                                    
                                </v-row>
                            </v-col>
                            <v-col sm="6">
                                <v-row v-for="valor in valors_list.filter((i) => { return i.valor.attributes.name.startsWith('M')})" :key="'M'+valor.valor.id">
                                    
                                    <v-col sm="7" class="d-flex align-center justify-start">
                                        <span>{{ valor.valor.attributes.name }}</span>
                                    </v-col>
                                    <v-col sm="4" class="pt-0 ">
                                        <v-text-field    
                                            class="right-text-input"                                               
                                            type="number"
                                           
                                            dense
                                            v-model="valor.cantidad"
                                            hide-details=""
                                            @focus="$event.target.select()"                                            
                                        ></v-text-field>
                                    </v-col>
                                    
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>                    
                </v-card>
                <v-card outlined v-if="showing.id != 1">
                    <v-card-title class="blue lighten-4 pt-1 pb-1 d-flex justify-center">
                        <span class="text-body-1 font-weight-medium"> {{ showing.name}} [ {{ showing.tipo }} ]</span>
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-card-text>                       
                        <v-simple-table>
                            <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Fcha y Hora
                                    </th>
                                    <th class="text-left">
                                        Monto
                                    </th>
                                    <th style="width: 40px;" class="text-center">
                                        Verificado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="showing.tipo == 'Ingreso'">
                                    <tr v-for="item in caja_edit.relationships.payments.filter((i) => {
                                            return i.relationships.paymentmethod.id == showing.id
                                        })"
                                        :key="item.id" 
                                        :class="[(item.checked ) ? 'blue lighten-5': '']"
                                        >
                                        <td>{{ item.attributes.created_at | luxon }}</td>
                                        <td>{{ globalHelperFixeDecimalMoney(item.attributes.valor) }}</td>
                                        <td class="d-flex justify-center align-center pl-1 pt-0">
                                            <v-checkbox
                                            
                                                v-model="item.checked"
                                            ></v-checkbox>
                                        </td>
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr v-for="item in caja_edit.relationships.refunds.filter((i) => {
                                            return i.relationships.paymentmethod.id == showing.id
                                        })"
                                        :key="item.id" >
                                        <td>{{ item.attributes.created_at | luxon }}</td>
                                        <td>{{ globalHelperFixeDecimalMoney(item.attributes.valor) }}</td>
                                        <td class="d-flex justify-center align-center pl-1 pt-0">
                                            <v-checkbox
                                            
                                                v-model="item.checked"
                                            ></v-checkbox>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                            </template>
                        </v-simple-table>
                    </v-card-text>                    
                </v-card>
            </v-col>
            <v-col sm="3">
                <v-row>
                    <v-col>
                        <v-card class="" outlined v-if="caja_edit" >
                            <v-card-title class="blue lighten-4 pt-1 pb-1 d-flex justify-center">
                                <span class="text-body-1 font-weight-medium">Caja ( # {{ caja_edit.id }} )</span>
                            </v-card-title>
                            <v-divider></v-divider>

                            <v-card-text class="pa-1">

                                <v-simple-table dense class="">
                                        <template v-slot:default>
                                        <tbody>
                                            <tr >
                                                <td class="pl-2">Inicio</td>
                                                <td class=""></td>
                                                <td class="">{{ caja_edit.attributes.created_at | luxon("dd-MM-yyyy HH:mm")  }}</td>
                                                <td class=""></td>
                                                
                                            </tr>
                                            <tr >
                                                <td class="pl-2">Usuario</td>
                                                <td class=""></td>
                                                <td class="">{{ caja_edit.relationships.user.data.attributes.name }}</td>
                                                <td class=""></td>
                                                
                                            </tr>
                                            <tr class="">
                                                <td class="pl-2">Sucursal</td>
                                                <td></td>
                                                <td class="">{{ caja_edit.relationships.sucursal.data.attributes.name }}</td>
                                                <td></td>
                                                
                                            </tr>
                                            
                                        </tbody>
                                        </template>
                                    </v-simple-table>
                                
                            </v-card-text>                    
                        </v-card>
                    </v-col>
                </v-row>
                             
            </v-col>
        </v-row>    
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
export default {
    async created () {
        await this.buscar_caja()
        this.onload()

    },
    data () {
        return {
            showing: {
                id: 1,
                tipo: null,
                name: null
            },

        } 
    },
    computed: {
        ...mapGetters({
            caja: 'cajas_manager/caja',
            valors: 'valors_manager/valors',
            paymentmethods: 'paymentMethods_manager/paymentMethods',
            caja_edit: 'cajas_manager/caja_edit',
            valors_list: 'cajas_manager/valors_recuento',
        }),
        recuento_efectivo () {
            let recuento = 0
            for ( let valor of this.valors_list ) {
                recuento = recuento + valor.cantidad * valor.valor.attributes.valor
            }
            return recuento
        },
        ingreso_paymentmethod() {
            return paymentmethod_id => {
                let monto = 0
                if ( this.caja_edit && this.caja_edit.relationships.payments ) {
                    for ( let payment of this.caja_edit.relationships.payments ) {
                        if ( payment.relationships.paymentmethod.id == paymentmethod_id ) {
                            monto = monto + Number(payment.attributes.valor)
                        }
                    }
                }            
                return monto
            }

        },
        ingreso_paymentmethod_checked() {
            return paymentmethod_id => {
                let monto = 0
                if ( this.caja_edit && this.caja_edit.relationships.payments ) {
                    for ( let payment of this.caja_edit.relationships.payments ) {
                        if ( payment.relationships.paymentmethod.id == paymentmethod_id && payment.checked ) {
                            monto = monto + Number(payment.attributes.valor)
                        }
                    }
                }            
                return monto
            }

        },
        egreso_paymentmethod() {
            return paymentmethod_id => {
                let monto = 0
                if ( this.caja_edit && this.caja_edit.relationships.refunds ) {
                    for ( let refund of this.caja_edit.relationships.refunds ) {
                        if ( refund.relationships.paymentmethod.id == paymentmethod_id ) {
                            monto = monto + Number(refund.attributes.valor)
                        }
                    }
                }            
                return monto
            }
        },

        egreso_paymentmethod_checked() {
            return paymentmethod_id => {
                let monto = 0
                if ( this.caja_edit && this.caja_edit.relationships.refunds ) {
                    for ( let refund of this.caja_edit.relationships.refunds ) {
                        if ( refund.relationships.paymentmethod.id == paymentmethod_id && refund.checked ) {
                            monto = monto + Number(refund.attributes.valor)
                        }
                    }
                }            
                return monto
            }
        },

        saldo_paymentmethod() {
            return paymentmethod_id => {
                return Number(this.caja_edit.attributes.dinero_inicial) + this.ingreso_paymentmethod(paymentmethod_id) - this.egreso_paymentmethod(paymentmethod_id)
            }
        },

        show_paymentmethod() {
            return paymentmethod_id => {
                if ( this.caja_edit ) {
                    return this.caja_edit.relationships.payments.filter((i) => {
                        return i.relationships.paymentmethod.id == paymentmethod_id
                    }) != 0
                }
                
            }
        }
        
    },

    methods: {
        ...mapActions({
            set_caja_edit: 'cajas_manager/set_caja_edit',
            set_valors_recuento: 'cajas_manager/set_valors_recuento',
        }),
        async buscar_caja () {
            await axios.get(`cajas/${this.caja.id}`)
                .then((resp) => {
                    this.set_caja_edit(resp.data.data)
                    
                    
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        onload () {
            let list = []
            for ( let valor of this.valors ) {
                list.push({
                    valor: valor,
                    cantidad: 0
                })
            }

            this.set_valors_recuento ( list )

            for ( let payment of this.caja_edit.relationships.payments ) {
                this.$set(payment, 'checked', false)
            }

        }
    }
}
</script>

<style lang="scss">  
  tbody {
     tr:hover {
        background-color: transparent !important;
     }
  }
</style>