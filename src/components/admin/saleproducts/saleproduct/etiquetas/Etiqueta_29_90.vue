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
            var doc = new jsPDF('l', 'mm', [90, 29])
            var width = doc.internal.pageSize.getWidth()

            this.img = document.querySelector('img#barcode')
            //doc.addImage(this.img.src, 'png', 10 ,5, 70, 13)
            doc.addImage(this.img.src, 'png', 5 ,4, 50, 13)

            doc.setFontSize(7);
            doc.text(this.saleproduct.attributes.name, (width - 30 )/2, 23, { align: 'center' })

            doc.output('dataurlnewwindow');
        }
    }
}
</script>

<style>

</style>