<template>
<div>
    
    
    
    <v-btn 
         
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
        presupuesto: Object,
    },
    components: {
        
    },
    computed: {
        ...mapGetters({
            empresa: 'empresa',
            totalPresupuestoActive: 'presupuestos_manager/totalPresupuestoActive',
        }),
    },
    data() {
        return {
            is_generandoReporte: false,

            fontFamily: 'helvetica',
            cant_lineas_page: 21,
            line_height: 9,
            line_start: 75,
            cant_paginas: 0,
            line_number: 1,

            items_total: []
        }
    },
    methods: {
        get_cant_lineas ( ) {
            let cant = 0
            cant = cant + this.presupuesto.items.length
            for ( let comboitem of this.presupuesto.comboitems ) {                
                cant = cant + comboitem.comboItems.length                
            }
            return cant
        },
        generateReport () { 
            this.is_generandoReporte = true
            this.items_total = []
            this.onload()

            var doc = new jsPDF();
            

            this.emitir_comprobante(doc)

            this.is_generandoReporte = false
            doc.output('dataurlnewwindow');
        },
        emitir_comprobante(doc ) {

            let cant_lineas = this.get_cant_lineas()

            this.cant_paginas = Math.ceil( cant_lineas / this.cant_lineas_page ) 

            let page_number = 1
            this.line_number = 0   
            //doc.setFont(this.fontFamily, 'bold')

            this.emitir_encabezado(doc)

            doc.setFontSize(9)         
            console.log(this.items_total)
            for ( let item of this.items_total ) {
                
                if ( item.saleProductId ) {
                    this.emitir_linea_item(doc, item)
                }
                console.log(item)
                if ( item.comboId ) { 
                    this.emitir_linea_comboitem(doc, item)
                }
                if ( item.comboitemId ) { 
                    this.emitir_linea_comboitem_comboitem(doc, item)
                }
                
                if ( (this.line_number % this.cant_lineas_page) == 0) {
                    //this.emitir_pie(doc, page_number)
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
            this.emitir_pie(doc, page_number)     
        

        },

        onload () {
            for ( let item of this.presupuesto.items ) {

                this.items_total.push({
                    saleProductId: item.saleProductId,
                    name: item.name,
                    precio: Number(item.precio),
                    cantidad: Number(item.cantidad),
                    is_stock_unitario_variable: item.is_stock_unitario_variable,
                    stock_aproximado_unidad: Number(item.stock_aproximado_unidad)
                })
            }
            
            for ( let comboitem of this.presupuesto.comboitems ) {

                this.items_total.push({
                    comboId: comboitem.comboId,
                    name: comboitem.name,
                    precio: Number(comboitem.precio),
                    cantidad: Number(comboitem.cantidad)
                })
                for ( let comboItem of comboitem.comboItems ) {
                    this.items_total.push({
                        comboitemId: comboItem.comboitemId,
                        name: comboItem.name,
                        cantidad: Number(0)
                    })
                    
                }
            }

        },

        emitir_pie ( doc, page_number ) {
            
            let h = 270
            doc.setDrawColor(null)
            doc.line(154.5, h - 5, 200, h - 5)
            doc.setFontSize(11)
            doc.setFont(this.fontFamily, 'bold')
            doc.text('TOTAL: ', 170, h + 1, { align: 'right' })
            doc.text('$ ' + this.fixeDecimalMoney(this.totalPresupuestoActive), 200, h + 1, { align: 'right' })
            doc.setFont(this.fontFamily, 'normal')
            doc.setFontSize(9)
            doc.text('*', 8, h + 1)
            doc.text('Precios Finales', 10, h + 1)
            
            

            doc.text('Página ' + String(page_number) + ' de ' + this.cant_paginas, 105, h + 19, { align: 'center'})
        },
        emitir_linea_item(doc, item){
            let h = (this.line_number * this.line_height) + this.line_start
            if ( this.line_number % 2 == 0 ) {
                doc.setFillColor('#f7f7f7');
            }else {
                doc.setFillColor('#ebebeb');
            }


            //doc.rect(8, h - this.line_height +3, 195, this.line_height, 'F')

            doc.setDrawColor('#d4d4d4');
            doc.line(8, h + 3, 202, h + 3 )
            doc.setFillColor(null);    
            
            doc.text(Number(item.saleProductId).toString(), 20, h, { align: 'right', });
            doc.text(item.name, 29, h, { align: 'left', });
            doc.text(this.fixeDecimalMoney(item.precio), 157, h, { align: 'right', });
            doc.text(this.fixeDecimalCantidad(item.cantidad), 177, h, { align: 'right', });
            doc.text(this.fixeDecimalMoney(this.getSubtotal(item)), 199, h, { align: 'right', });
        
            this.line_number = this.line_number + 1
        },

        emitir_linea_comboitem(doc, item){
            
            let h = (this.line_number * this.line_height) + this.line_start
            if ( this.line_number % 2 == 0 ) {
                doc.setFillColor('#f7f7f7');
            }else {
                doc.setFillColor('#ebebeb');
            }


            //doc.rect(8, h - this.line_height +3, 195, this.line_height, 'F')
            doc.setDrawColor('#d4d4d4');
            doc.line(8, h + 3, 202, h + 3 )
            doc.setFillColor(null);    
            
            //doc.text(Number(item.combo).toString(), 20, h, { align: 'right', });
            doc.text('[PROMO] ' + item.name, 29, h, { align: 'left', });
            doc.text(this.fixeDecimalMoney(item.precio), 157, h, { align: 'right', });
            doc.text(this.fixeDecimalCantidad(item.cantidad), 177, h, { align: 'right', });
            doc.text(this.fixeDecimalMoney(this.getSubtotal_combo(item)), 199, h, { align: 'right', });
        
            this.line_number = this.line_number + 1

            
        },

        emitir_linea_comboitem_comboitem(doc, item){
            let h = (this.line_number * this.line_height) + this.line_start
            if ( this.line_number % 2 == 0 ) {
                doc.setFillColor('#f7f7f7');
            }else {
                doc.setFillColor('#ebebeb');
            }


            //doc.rect(8, h - this.line_height +3, 195, this.line_height, 'F')
            doc.setDrawColor('#d4d4d4');
            doc.line(8, h + 3, 202, h + 3 )
            doc.setFillColor(null);    
            
            //doc.text(Number(item.saleproductId).toString(), 20, h, { align: 'right', });
            doc.text('  * ' + item.name, 29, h, { align: 'left', });
            //doc.text(this.fixeDecimalCantidad(item.cantidad), 177, h, { align: 'right', });
        
            this.line_number = this.line_number + 1
        },
       

        
        
        emitir_encabezado( doc ) {


            doc.setFillColor('#f1f1f4');
            doc.triangle(0, 0, 0, 160, 210, 0, 'F' )

            doc.setFillColor('#3ba98d');
            doc.triangle(0, 0, 0, 40, 210, 0, 'F' )

            doc.triangle(140, 300, 210, 280, 210, 300, 'F' )

            doc.setTextColor('#ffffff');
            doc.setFontSize(25)
            doc.setFillColor('#00e069');

            doc.setFont(this.fontFamily, 'bold')
            doc.text(('PRESUPUESTO').toUpperCase(), 8, 23)
            doc.setFont(this.fontFamily, 'normal')
            doc.setFontSize(20)
            doc.setTextColor(null);
            doc.text((this.empresa.attributes.name).toUpperCase(), 202, 23, { align: 'right', })
            
            doc.setTextColor(null);

            doc.setFontSize(11)

            let client_h = 40
            if ( this.presupuesto.client ) {
                if ( this.presupuesto.client.tipo_persona == 'FISICA' ) {
                    doc.text('Cliente:  ' + this.presupuesto.client.name + ' ' + this.presupuesto.client.surname, 8, client_h)
                }else {
                    doc.text('Cliente:  ' + this.presupuesto.client.name, 8, client_h)
                }
            }
            
            
            client_h = client_h - 5
            
            doc.text('Presupuesto Nro:  ', 130, client_h, { align: 'left', })

            doc.text('Fecha:  ', 130, client_h + 5, { align: 'left', })
            doc.text((new Date()).toLocaleDateString('es-AR'), 202, client_h + 5, { align: 'right', })


            let h1 = 57
            doc.setFontSize(10)
            doc.setDrawColor(null)
            doc.rect(8, h1, 194, 9)
            doc.text('Código', 12, h1 + 6)
            doc.text('Descripción', 30, h1 + 6)
            doc.text('Precio', 144, h1 + 6)
            doc.text('Cantidad', 164, h1 + 6)
            doc.text('Subtotal', 198, h1 + 6, { align: 'right'})
        },


        fixeDecimalCantidad(valor) {
            return Number(valor).toFixed(2)
        },

        getSubtotal ( item ) {
            if ( item.is_stock_unitario_variable ) {
                return Number(item.precio * item.cantidad * item.stock_aproximado_unidad)
                
            }else {
                return Number(item.precio * item.cantidad)
            }
        },
        getSubtotal_combo ( item ) {
            return Number(item.precio * item.cantidad)

        },
        getTotal() {
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