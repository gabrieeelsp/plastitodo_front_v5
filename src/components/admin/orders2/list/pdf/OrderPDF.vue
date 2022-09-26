<template>
<div>
    
    
    
    <v-btn 
         
        @click="generateReport"
        :loading="is_generandoReporte"
        text
        color="red"
    >
        PDF Pedido
    </v-btn>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import jsPDF from 'jspdf'

export default {
    props: {
        order: Object,
    },
    components: {
        
    },
    computed: {
        ...mapGetters({
            empresa: 'empresa',
            totalOrder: 'orders_manager/totalOrder',
            is_order_active_complete_total: 'orders_manager/is_order_active_complete_total',
            deliveryshift_by_id: 'deliveryshifts_manager/deliveryshift_by_id',
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
            cant = cant + this.order.relationships.orderitems.length
            for ( let comboitem of this.order.relationships.ordercomboitems ) {
                
                for ( let ordersaleproduct of comboitem.relationships.ordercombosaleproducts ) {
                    if ( Number(ordersaleproduct.attributes.cantidad) != 0 ) {
                        cant = cant +1
                    }
                }
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
            
            for ( let item of this.items_total ) {
                if ( item.cantidad > 0 ) {
                    if ( item.saleProductId ) {
                        this.emitir_linea_item(doc, item)
                    }
                    if ( item.comboId ) {
                        this.emitir_linea_comboitem(doc, item)
                    }
                    if ( item.saleproductId ) {
                        this.emitir_linea_comboitem_saleproduct(doc, item)
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
            }  
            this.emitir_pie(doc, page_number)     
        

        },

        onload () {
            for ( let item of this.order.relationships.orderitems ) {

                this.items_total.push({
                    saleProductId: item.relationships.saleproduct.id,
                    name: item.relationships.saleproduct.attributes.name,
                    precio: Number(item.attributes.precio),
                    cantidad: Number(item.attributes.cantidad),
                    cantidad_total: Number(item.attributes.cantidad_total),
                    is_stock_unitario_variable: item.relationships.saleproduct.relationships.stockproduct.attributes.is_stock_unitario_variable,
                    stock_aproximado_unidad: Number(item.relationships.saleproduct.relationships.stockproduct.attributes.stock_aproximado_unidad)
                })
            }
            
            for ( let comboitem of this.order.relationships.ordercomboitems ) {

                this.items_total.push({
                    comboId: comboitem.relationships.combo.id,
                    name: comboitem.relationships.combo.attributes.name,
                    precio: Number(comboitem.attributes.precio),
                    cantidad: Number(comboitem.attributes.cantidad)
                })
                for ( let ordersaleproduct of comboitem.relationships.ordercombosaleproducts ) {
                    this.items_total.push({
                        saleproductId: ordersaleproduct.relationships.saleproduct.id,
                        name: ordersaleproduct.relationships.saleproduct.attributes.name,
                        cantidad: Number(ordersaleproduct.attributes.cantidad)
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
            doc.text('$ ' + this.fixeDecimalMoney(this.totalOrder(this.order).toString()), 200, h + 1, { align: 'right' })
            doc.setFont(this.fontFamily, 'normal')
            doc.setFontSize(9)
            doc.text('*', 8, h + 1)
            doc.text('Precios Finales', 10, h + 1)
            
            if ( !this.is_order_active_complete_total ) {
                doc.text('*', 8, h + 8)
                doc.text('El imorte final es un valor aproximado porque existen articulos que deben pesarse al momento de la facturación', 10, h + 8, { align: 'left', maxWidth: 120})
            }
            

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

        emitir_linea_comboitem_saleproduct(doc, item){
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
            
            doc.text(Number(item.saleproductId).toString(), 20, h, { align: 'right', });
            doc.text('  * ' + item.name, 29, h, { align: 'left', });
            doc.text(this.fixeDecimalCantidad(item.cantidad), 177, h, { align: 'right', });
        
            this.line_number = this.line_number + 1
        },
       

        
        
        emitir_encabezado( doc ) {
            let numero_format =  Intl.NumberFormat("en-US", {
                useGrouping: false,
                minimumIntegerDigits: 4
            })

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
            if ( this.order.relationships.client.attributes.tipo_persona == 'FISICA' ) {
                doc.text('Cliente:  ' + this.order.relationships.client.attributes.name + ' ' + this.order.relationships.client.attributes.surname, 8, client_h)
            }else {
                doc.text('Cliente:  ' + this.order.relationships.client.attributes.name, 8, client_h)
            }
            
            if ( this.order.relationships.client.attributes.direccion ) {
                doc.text('Dirección:  ' + this.order.relationships.client.attributes.direccion, 8, client_h + 5)
            }else {
                doc.text('Dirección:  ', 8, client_h + 5)
            }

            if ( this.order.relationships.client.attributes.telefono ) {
                doc.text('Teléfono:  ' + this.order.relationships.client.attributes.telefono, 8, client_h + 10)
            }else {
                doc.text('Teléfono:  ', 8, client_h + 10)
            }
            client_h = client_h - 5
            
            doc.text('Pedido Nro:  ', 130, client_h, { align: 'left', })
            doc.text(numero_format.format(this.order.id), 202, client_h, { align: 'right', })
            doc.text('Fecha:  ', 130, client_h + 5, { align: 'left', })
            doc.text(this.$luxon(this.order.attributes.created_at, { output: "dd-MM-yyyy" }), 202, client_h + 5, { align: 'right', })

            doc.text('Entrega:  ', 130, client_h + 10, { align: 'left', })
            
            
            if ( Boolean(this.order.attributes.is_delivery) == false ) {
                doc.text( 'Retiro', 171, client_h + 10, { align: 'right', })
            }else {
                if ( this.order.attributes.fecha_entrega_acordada ) {
                    doc.text( this.$luxon(this.order.attributes.fecha_entrega_acordada, { output: "dd-MM-yyyy" }), 171, client_h + 10, { align: 'right', })
                    if ( this.order.relationships.deliveryshift && this.deliveryshift_by_id(this.order.relationships.deliveryshift.id) ) {
                        //doc.text('Horario:  ', 130, client_h + 15, { align: 'left', })
                        doc.text(this.deliveryshift_by_id(this.order.relationships.deliveryshift.id).attributes.description, 202, client_h + 10, { align: 'right', })
                    }
                }
            }            
            
            doc.text('Cant Bultos:  ', 130, client_h + 15, { align: 'left', })
            if ( this.order.attributes.cant_bultos ) {
                
                doc.text( Number(this.order.attributes.cant_bultos).toString(), 202, client_h + 15, { align: 'right', })
            }
            
            


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
                if ( Number(item.cantidad_total) != 0) {
                    return Number(item.precio * item.cantidad_total)
                }else {
                    return Number(item.precio * item.cantidad * item.stock_aproximado_unidad)
                }
                
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