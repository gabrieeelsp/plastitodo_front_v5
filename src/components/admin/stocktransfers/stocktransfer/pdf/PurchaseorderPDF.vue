<template>
<div>
    
    
    
    <v-btn 
        block 
        @click="generateReport"
        :loading="is_generandoReporte"
        text
        color="red"
    >
        PDF
    </v-btn>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import jsPDF from 'jspdf'
export default {
    props: {
        purchaseorder: Object,
    },
    components: {
        
    },
    computed: {
        ...mapGetters({
            empresa: 'empresa',
        }),
    },
    data() {
        return {
            is_generandoReporte: false,

            fontFamily: 'times',
            cant_lineas_page: 20,
            line_height: 7,
            line_start: 84,
            cant_paginas: 0,
            line_number: 1,

        }
    },
    methods: {
        generateReport () { 
            this.is_generandoReporte = true

            var doc = new jsPDF();


            this.emitir_comprobante(doc)

            this.is_generandoReporte = false
            doc.output('dataurlnewwindow');
        },
        emitir_comprobante(doc ) {

            let cant_lineas = this.purchaseorder.relationships.purchaseorderitems.lenght

            this.cant_paginas = Math.ceil( cant_lineas / this.cant_lineas_page )

            let page_number = 1
            this.line_number = 0   
            //doc.setFont(this.fontFamily, 'bold')

            this.emitir_encabezado(doc)

            doc.setFontSize(10)         
            
            for ( let item of this.purchaseorder.relationships.purchaseorderitems ) {
                if ( item.attributes.cantidad > 0 ) {
                    this.emitir_linea_item(doc, item)
                    if ( (this.line_number % this.cant_lineas_page) == 0) {
                        if ( page_number == this.cant_paginas ) {
                            break
                        }else {
                            doc.addPage()
                            page_number = page_number + 1
                            this.line_number = 0
                            this.emitir_encabezado(doc)
                        }
                        
                    }
                }
            }
            
        

        },
        emitir_linea_item(doc, item){
            let h = (this.line_number * this.line_height) + this.line_start
            if ( this.line_number % 2 == 0 ) {
                doc.setFillColor('#f7f7f7');
            }else {
                doc.setFillColor('#ebebeb');
            }

            doc.rect(8, h - this.line_height +2, 195, this.line_height, 'F')
            doc.setFillColor(null);    
            
            doc.text(item.relationships.purchaseproduct.attributes.name, 12, h, { align: 'left', });
            doc.text(this.fixeDecimalCantidad(item.attributes.cantidad), 196, h, { align: 'right', });
        
            this.line_number = this.line_number + 1
        },
       

        
        
        emitir_encabezado( doc ) {

            let numero_format =  Intl.NumberFormat("en-US", {
                useGrouping: false,
                minimumIntegerDigits: 4
            })
            doc.setFontSize(25)
            doc.text((this.empresa.attributes.name).toUpperCase(), 10, 15)
            doc.setFontSize(10)
            doc.text('Dirección: ' + this.empresa.attributes.domicilio_comercial, 12, 25)
            doc.text('CUIT: ' + this.empresa.attributes.cuit, 12, 30)



            doc.setFillColor('#919191');            
            doc.rect(105, 6, 98, 11, 'F')
            doc.setFontSize(20)
            doc.setFillColor(null);
            doc.setTextColor('#ffffff');
            doc.setFont(undefined, 'bold')
            doc.text('ORDEN DE COMPRA', 118, 14)
            doc.setFont(undefined, 'normal')

            doc.setTextColor(null);
            
            
            doc.setFontSize(10)
            doc.text('Nro: ' + numero_format.format(this.purchaseorder.id), 107 , 25)
            doc.text('Fecha: ' + this.$luxon(this.purchaseorder.attributes.created_at, { output: "dd-MM-yyyy" }), 107 , 30)

            doc.setFillColor('#919191');          
            doc.rect(10, 40, 85, 7, 'F')
            doc.setFontSize(13)
            doc.setFillColor(null);
            doc.setTextColor('#ffffff');
            doc.text('PROVEDOR', 41, 45)
            doc.setTextColor(null);

            doc.setFontSize(10)
            doc.text('Nombre: ' + this.purchaseorder.relationships.supplier.attributes.name, 12, 54)
            doc.text('Dirección: ' + this.purchaseorder.relationships.supplier.attributes.direccion, 12, 59)
            doc.text('Teléfono: ' + this.purchaseorder.relationships.supplier.attributes.telefono, 12, 64)
            doc.text('Email: ' + this.purchaseorder.relationships.supplier.attributes.email, 12, 69)


            doc.setFillColor('#919191');            
            doc.rect(105, 40, 98, 7, 'F')
            doc.setFontSize(13)
            doc.setFillColor(null);
            doc.setTextColor('#ffffff');
            doc.text('DIRECCIÓN DE ENTREGA', 125, 45)
            doc.setTextColor(null);

            doc.setFontSize(10)
            if ( this.purchaseorder.relationships.sucursal ) {
                doc.text('Sucursal: ' + this.purchaseorder.relationships.sucursal.attributes.name, 107, 54)
                doc.text('Dirección: ' + this.purchaseorder.relationships.sucursal.attributes.direccion, 107, 59)
                doc.text('Teléfono: ' + this.purchaseorder.relationships.sucursal.attributes.telefono, 107, 64)
            }else {
                doc.text('Sucursal: ' , 107, 54)
                doc.text('Dirección: ' , 107, 59)
                doc.text('Teléfono: ' , 107, 64)
            }
            




            doc.setFillColor('#919191');            
            doc.rect(8, 72, 195, 7, 'F')
            doc.setFontSize(11)
            doc.setFillColor(null);
            doc.setTextColor('#ffffff');
            doc.text('DESCRIPCIÓN', 15, 77)
            doc.text('CANTIDAD', 180, 77)

            doc.setTextColor(null);

            
        },


        fixeDecimalCantidad(valor) {
            return Number(valor).toFixed(2)
        },

        getSubTotal() {
            let total = 0
            for ( let item of this.comprobanteItems ) {
                total = total + item.subtotal
            }
            for ( let comboitem of this.comprobanteComboItems ) {
                total = total + comboitem.subtotal
            }
            return total          
        },
        fixeDecimalMoney(valor) {
            return Number(valor).toFixed(2)
        },

        roundHalfUp(value, decimals) {
           return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }
    }

}
</script>

<style>

</style>