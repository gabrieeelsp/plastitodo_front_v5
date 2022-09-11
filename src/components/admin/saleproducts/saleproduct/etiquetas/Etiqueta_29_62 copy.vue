<template>
  <div>
    <v-btn block small @click="imprimir">Imprimir Etiquetas</v-btn>
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
            JsBarcode: null,
            img: null,
        }
    },
    methods: {
        imprimir () {
            var doc = new jsPDF('l', 'mm', [62, 29])
            var width = doc.internal.pageSize.getWidth()

            this.img = document.querySelector('img#barcode')

            doc.addImage(this.img.src, 'png', 6 ,3, 50, 11)

            doc.setFontSize(9);
            doc.text(this.saleproduct.attributes.barcode, (width)/2, 18, { align: 'center', maxWidth: width - 5 } )

            doc.setFontSize(8);
            doc.text(this.saleproduct.attributes.name, (width)/2, 22, { align: 'center', maxWidth: width - 5 } )

            doc.setFontSize(8);
            doc.text('Venc: 08/2023', width - 5, 27, { align: 'right' } )

            doc.output('dataurlnewwindow');
        }
    }
}
</script>

<style>

</style>