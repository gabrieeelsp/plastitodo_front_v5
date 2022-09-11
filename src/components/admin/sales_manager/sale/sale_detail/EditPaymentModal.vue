<template>
  

    <v-dialog
      v-model="intDialogVisible"
      max-width="400"
    >
      <v-card>
        <v-card-title class="text-h5">
            
          
        </v-card-title>
        
        <v-card-text>
            <v-form @submit.prevent="accept" ref="form" v-model="valid" >
                <v-row>
                
                    <v-col cols="12" sm="6"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Método de Pago: </span>
                    </v-col>
                    <v-col cols="12" sm="6"  class=" pt-0 pb-0"> 
                        <v-select
                            v-model="select"
                            readonly
                            :items="paymentMethods"
                            item-text="attributes.name"
                            item-value="id"
                            label="Select"
                            persistent-hint
                            return-object
                            single-line
                            dense

                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span 
                            @click="valor = max_value"
                            class="font-weight-bold black--text">Valor ( max: {{ globalHelperFixeDecimalMoney(max_value) | money_string }} )</span>
                    </v-col>
                    <v-col cols="12" sm="6"  class=" pt-0 pb-0"> 
                        <v-text-field
                        
                            class="right-text-input"
                            ref="input_valor"
                            dense
                            v-model="valor"
                            :rules="valorRules"
                            :error-messages="errorValorMessages"
                            @keydown="errorValorMessages = ''"
                            type="number"
                            @focus="$event.target.select()"
                            @keyup.enter="accept"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-form>
            
          
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

            <v-btn
                color="warning"
                small
                @click="intDialogVisible = false"
            >
                Cancelar
            </v-btn>

            <v-btn
                color="success"
                @click="accept"
                type="submit"
                small
            >
                Aceptar
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  
</template>

<script>
import { mapGetters } from 'vuex'
export default {
      mounted () {
          
    },
    data () {
        return {
            max_value: 0,    
            select: { id: 1,  },
            valor: '',
            valid: true,

            valorRules: [
                v => ( v && v > 0 ) || "Valor should be above 0",
                v => ( v && v <= this.max_value ) || "Valor should be above Total Venta",
            ],
            errorValorMessages: '',
        }
    },
    props: {
        dialogVisible: Boolean,
        payment: Object
    
    },
    computed: {
        ...mapGetters({
            paymentMethods: 'paymentMethods_manager/paymentMethods',
            saldoTotalSale: 'sales_manager/saldoTotalSale',
			
		}),
        intDialogVisible: {
            get: function () {
                if (this.dialogVisible) {
                   this.onload()
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
        }
    },
    methods: {
        accept() {
            this.validate()
            if( this.valid ){
                this.$emit('updatePayment', {
                    id: this.payment.id,
                    paymentmethod_id: this.payment.relationships.paymentmethod.id,
                    valor: this.globalHelperFixeDecimalMoney(this.valor),
                })
            }
            
        },
        validate () {
            this.$refs.form.validate()
        },
        onload() {
            this.max_value = Number(this.saldoTotalSale) + Number(this.payment.attributes.valor)
            this.valor = this.payment.attributes.valor
            this.select = this.payment.relationships.paymentmethod.id
            setTimeout(() => this.$refs.input_valor.$refs.input.focus(), 100);
        }

    }
  }
</script>