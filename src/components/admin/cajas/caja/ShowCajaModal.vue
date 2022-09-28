<template>
  

    <v-dialog
      v-model="intDialogVisible"
      max-width="900"
    >
      <v-card v-if="caja">
        <v-card-title class="text-h5">

          
        </v-card-title>
        <v-card-text>
            
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="2">
                    <span> </span>
                </v-col>
                <v-col cols="3" class="text-right">
                    <span class="text-h6">#{{ globalHelperFixNumeroDocuento(caja.id) }}</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6">
                    <v-row>
                        <v-col cols="3" class="pt-1 pb-1">
                            <span class="mt-0">Usuario:</span>
                        </v-col>
                        <v-col cols="8" class="pt-1 pb-1">
                            <span>{{ caja.relationships.user.data.attributes.name + ' ' + caja.relationships.user.data.attributes.surname }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="3" class="pt-1 pb-1">
                            <span>Apertura:</span>
                        </v-col>
                        <v-col cols="8" class="pt-1 pb-1">
                            <span>{{ caja.attributes.created_at | luxon("dd-MM-yyyy HH:mm") }}</span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="3" class="pt-1 pb-1">
                            <span>Cierre:</span>
                        </v-col>
                        <v-col cols="8" class="pt-1 pb-1">
                            <span>{{ caja.attributes.close_at | luxon("dd-MM-yyyy HH:mm") }}</span>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="6">
                    <v-row>
                        <v-col cols="3" class="pt-1 pb-1">
                            <span class="mt-0">Estado:</span>
                        </v-col>
                        <v-col cols="8" class="pt-1 pb-1">
                            <v-chip x-small class="white--text" :color="colors_is_open(caja.attributes.is_open)" >{{ caja.attributes.is_open ? 'Abierta' : 'Cerrada' }}</v-chip>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="3" class="pt-1 pb-1">
                            <span class="mt-0">Sucursal:</span>
                        </v-col>
                        <v-col cols="8" class="pt-1 pb-1">
                            <span>{{ caja.relationships.sucursal.data.attributes.name }}</span>
                        </v-col>
                    </v-row>
                    
                    
                </v-col>
    
            </v-row>
            <v-row>
                <v-col cols="6">
                    <v-row>
                        <v-col cols="3" class="pt-1 pb-1">
                            <span class="mt-0">Dinero Inicial:</span>
                        </v-col>
                        <v-col cols="8" class="pt-1 pb-1 d-flex justify-end">
                            <span>{{ globalHelperFixeDecimalMoney(caja.attributes.dinero_inicial) | money_string }}</span>
                        </v-col>
                    </v-row>
                    
                </v-col>
                <v-col cols="6">
                    <v-row>
                        <v-col cols="3" class="pt-1 pb-1">
                            <span class="mt-0">Dinero Final:</span>
                        </v-col>
                        <v-col cols="8" class="pt-1 pb-1 d-flex justify-end">
                            <span v-if="!caja.attributes.is_open">{{ globalHelperFixeDecimalMoney(caja.attributes.dinero_final) | money_string }}</span>
                        </v-col>
                    </v-row>

                    
                    
                </v-col>
    
            </v-row>
            <v-row>
                <v-col class="d-flex align-center">
                    <CajaPDF
                        v-if="!caja.attributes.is_open"
                        :caja="caja"
                    />
                </v-col>
                <v-spacer></v-spacer>
                <v-col cols="12" sm="4" class="d-flex align-center">
                    <v-select
                        dense
                        :items="payment_methods_select"
                        item-text="name"
                        item-value="id"
                        v-model="filters.paymentmethod_id"
                        :menu-props="{ offsetY: true }"
                        hide-details=""
                    >
                    </v-select>
                </v-col>
                <v-col cols="12" sm="4">
                    <v-radio-group v-model="filters.tipo" row dense>
                        <v-radio
                            label="Ingreso"
                            value="INGRESO"
                        ></v-radio>
                        <v-radio
                            label="Egreso"
                            value="EGRESO"
                        ></v-radio>
                        </v-radio-group>
                </v-col>
                
            </v-row>

            <v-row>
                <v-col>
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
                                    Confirmado
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in items"
                                :key="item.id" 
                                
                                >
                                <td>{{ item.attributes.created_at | luxon("dd-MM-yyyy HH:mm") }}</td>
                                <td>{{ globalHelperFixeDecimalMoney(item.attributes.valor) }}</td>
                                <td class="d-flex justify-center align-center pl-1 pt-0">
                                    <v-checkbox
                                        disabled
                                        v-model="item.attributes.is_confirmed"
                                    ></v-checkbox>
                                </td>
                            </tr>
                            
                            
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-col>
            </v-row>

            
            


        </v-card-text>


      </v-card>
    </v-dialog>
  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import CajaPDF from '@/components/admin/cajas/pdf/CajaPDF.vue'
  export default {
    mounted () {
        
    },
    data () {
        return {
            filters: {
                paymentmethod_id: 1,
                tipo: 'INGRESO',
            }
        }
    },
    components: {
        CajaPDF
    },
    props: {
        dialogVisible: Boolean,
        caja: Object,
    
    },
    computed: {
        ...mapGetters({
            colors_is_open: 'cajas_manager/colors_is_open',
            payment_methods_select: 'paymentMethods_manager/payment_methods_select',
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

        items () {
            if ( this.filters.tipo == 'INGRESO' ) {
                return this.caja.relationships.payments.filter((i) => {
                    return i.relationships.paymentmethod.id == this.filters.paymentmethod_id
                })
            }
            return this.caja.relationships.refunds.filter((i) => {
                return i.relationships.paymentmethod.id == this.filters.paymentmethod_id
            })
        }
    },
    methods: {
        ...mapActions({

        }),
        
        
    }
  }
</script>