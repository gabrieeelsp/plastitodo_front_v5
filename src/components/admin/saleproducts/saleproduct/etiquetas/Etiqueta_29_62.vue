<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            small
            v-bind="attrs"
            v-on="on"
        >
          Imprimir Etiquetas
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h6 grey lighten-2">
          {{ saleproduct.attributes.name }}
        </v-card-title>

        <v-card-text class="pt-3">
            <v-row>
                <v-col cols="12" sm="6"  class=" d-flex justify-sm-end align-center">
                    <span class="font-weight-bold black--text">Cantidad</span>
                </v-col>
                <v-col cols="12" sm="4"  class="d-flex pa-0 mt-1">
                    <v-text-field 
                        reverse
                        dense
                        v-model="cantidad"
                        :rules="cantidadRules"
                        :error-messages="errorCantidadMessages"
                        @keydown="errorCantidadMessages = ''"                       
                    ></v-text-field>
                </v-col>
            </v-row>
            
            <v-row>
                <v-col cols="12" sm="6"  class="d-flex justify-sm-end align-center">
                    <span class="font-weight-bold black--text">Vencimiento</span>
                </v-col>
                <v-col cols="12" sm="4"  class="d-flex align-center">
                    <v-menu
                        v-model="menu1"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                            v-model="computedDateFormatted"
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            dense
                            hide-details=""
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="date"
                            
                            @input="input_date"
                            :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                        ></v-date-picker>
                        </v-menu>
                </v-col>
            </v-row>
            
          
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            small
            @click="aceptar"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-show="false">
        <img id="barcode"/>
    </div>
    
  </div>
</template>

<script>

import jsPDF from 'jspdf'

export default {
    mounted() {
        this.JsBarcode = require('jsbarcode')
        this.JsBarcode("#barcode", this.saleproduct.attributes.barcode, {
            width:1,
            height: 20,
            displayValue: false,
            textMargin: 0,
            margin: 0,
        })
        
    },
    props: {
        saleproduct: Object
    },
    components: {
        
    },
    computed: {
        computedDateFormatted () {
            return this.formatDate(this.date)
        },
    },
    data () {
        return {
            is_generando: false,
            JsBarcode: null,
            img: null,
            dialog: false,
            cantidad: 1,
            cantidadRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorCantidadMessages: '', 

            vencimiento: '',
            menu1: false,
            date: null,
        }
    },
    methods: {
        input_date () {
            this.menu1 = false
            this.vencimiento = this.formatDate(this.date)
        },
        formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },

        imprimir () {
            var doc = new jsPDF('l', 'mm', [62, 29])
            var width = doc.internal.pageSize.getWidth()

            this.img = document.querySelector('img#barcode')

            for (let step = 1; step <= this.cantidad; step++) {

                doc.addImage(this.img.src, 'png', 6 ,3, 50, 8)

                doc.setFontSize(8);
                doc.text(this.saleproduct.attributes.barcode, (width)/2, 15, { align: 'center', maxWidth: width - 5 } )

                doc.setFontSize(8);
                doc.text(this.saleproduct.attributes.name, (width)/2, 19, { align: 'center', maxWidth: width - 5 } )

                if ( this.vencimiento != '' ) {
                    doc.setFontSize(8);
                    doc.text('Venc: ' + this.vencimiento, width - 5, 24, { align: 'right' } )
                }

                if ( this.cantidad != step ) {
                    doc.addPage()
                }
            }

            doc.output('dataurlnewwindow');
        },
        
        aceptar ( ) {
            this.is_generando = true
            this.imprimir()
            this.is_generando = false
            this.dialog = false
        }
    }
}
</script>

<style>

</style>