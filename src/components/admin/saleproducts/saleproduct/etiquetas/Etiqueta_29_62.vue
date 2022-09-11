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
                <v-col cols="12" sm="3"  class="d-flex pa-0 mt-1">
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
                <v-col cols="12" sm="3"  class="d-flex pa-0">
                    <v-text-field 
                        reverse
                        dense
                        v-model="vencimiento"                     
                    ></v-text-field>
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
        }
    },
    methods: {
        imprimir () {
            var doc = new jsPDF('l', 'mm', [62, 29])
            var width = doc.internal.pageSize.getWidth()

            this.img = document.querySelector('img#barcode')

            for (let step = 1; step <= this.cantidad; step++) {

                doc.addImage(this.img.src, 'png', 6 ,3, 50, 11)

                doc.setFontSize(9);
                doc.text(this.saleproduct.attributes.barcode, (width)/2, 18, { align: 'center', maxWidth: width - 5 } )

                doc.setFontSize(8);
                doc.text(this.saleproduct.attributes.name, (width)/2, 22, { align: 'center', maxWidth: width - 5 } )

                if ( this.vencimiento != '' ) {
                    doc.setFontSize(8);
                    doc.text('Venc: ' + this.vencimiento, width - 5, 27, { align: 'right' } )
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