<template>
<div>

    
    
    
    <v-btn 
        block 
        small 
        @click="generateReport"
        :loading="is_generandoReporte"
    >
        Ver A5
    </v-btn>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import jsPDF from 'jspdf'


export default {
    props: {
        items: Array,
        comboitems: Array,
        sale: Object,
        total: Number,
        tipo: String
    },
    components: {
        
    },
    computed: {
        ...mapGetters({
            ivaaliquots: 'ivaaliquots_manager/ivaaliquots'
        }),
        name_comprobante: function () {
            if ( this.tipo == 'sale' ) { return 'PRESUPUESTO'}
            if ( this.tipo == 2 ) { return 'NOTA DE DEBITO'}
            if ( this.tipo == 3 ) { return 'NOTA DE CREDITO'}
            return null
        },

        discriminar_iva: function () {

            return null
        },
        

    },
    data() {
        return {
            is_generandoReporte: false,

            fontFamily: 'times',
            
            cant_lineas_page: 17,
            line_height: 5,
            line_start: 40,
            cant_paginas: 0,
            line_number: 0,

            comprobanteItems: [],
            comprobanteComboItems: [],

            logo_afip: require('@/assets/logo_afip.jpg'),
            

        }
    },
    methods: {
        generateReport () { 
            this.comprobanteItems = []
            this.comprobanteComboItems = []
            this.is_generandoReporte = true
            if ( this.tipo == 'sale') { this.ObtenerSaleItems() }
            if ( this.tipo == 'devolution') { this.ObtenerDevolutionItems() }
            if ( this.tipo == 'creditnote') { this.ObtenerCreditnoteItems() }
            if ( this.tipo == 'debitnote') { this.ObtenerDebitnoteItems() }
            var doc = new jsPDF({
                //orientation: 'landscape',
                //format: 'a5'
            });

            let comprobantes_titulos = ['ORIGINAL']
            let page_number = 1
            for ( let comprobante_titulo of comprobantes_titulos ) {
                this.emitir_comprobante(doc, comprobante_titulo)
                
                if ( page_number < comprobantes_titulos.length) {
                    doc.addPage()
                } 
                page_number = page_number + 1
                
            }
            this.is_generandoReporte = false
            doc.output('dataurlnewwindow');
        },
        emitir_comprobante(doc , titulo ) {

            let cant_lineas = this.comprobanteItems.length + this.comprobanteComboItems.length

            this.cant_paginas = Math.ceil( cant_lineas / this.cant_lineas_page )

            let page_number = 1
            this.line_number = 0            

            this.emitir_encabezado(doc, titulo)

            for ( let item of this.comprobanteItems ) {
                this.emitir_linea_item(doc, item)
                if ( (this.line_number % this.cant_lineas_page) == 0) {
                    this.emitir_pie(doc, page_number)
                    if ( page_number == this.cant_paginas ) {
                        break
                    }else {
                        doc.addPage()
                        page_number = page_number + 1
                        this.line_number = 0
                        this.emitir_encabezado(doc, titulo)
                        
                    }
                    
                }
            }

            for ( let item of this.comprobanteComboItems ) {
                this.emitir_linea_combo(doc, item)
                if ( (this.line_number % this.cant_lineas_page) == 0) {
                    this.emitir_pie(doc, page_number)
                    if ( page_number == this.cant_paginas ) {
                        break
                    }else {
                        doc.addPage()
                        page_number = page_number + 1
                        this.line_number = 0
                        this.emitir_encabezado(doc, titulo)
                        
                    }
                    
                }
            }




            this.emitir_pie(doc, page_number)

        },

        emitir_linea_combo(doc, item){

            let h = (this.line_number * this.line_height) + this.line_start
            if ( item.is_combo ) {
                doc.text('[Combo] ' + item.name, 10, h, { align: 'left', });
            }else {
                doc.text('* ' + item.name, 15, h, { align: 'left', });
            }
            
            doc.text(this.fixeDecimalCantidad(item.cantidad), 140, h, { align: 'right', });
            
            doc.text(this.fixeDecimalMoney(item.precio), 162, h, { align: 'right', });
            doc.text(item.iva_name, 180, h, { align: 'right', });
            doc.text(this.fixeDecimalMoney(item.subtotal), 200, h, { align: 'right', });
            this.line_number = this.line_number + 1
        },
        emitir_linea_item(doc, item){
            doc.setFont(this.fontFamily, 'normal')
            let h = (this.line_number * this.line_height) + this.line_start
            doc.text(item.name, 10, h, { align: 'left', });
            doc.text(this.fixeDecimalCantidad(item.cantidad), 140, h, { align: 'right', });
            
            doc.text(this.fixeDecimalMoney(item.precio), 162, h, { align: 'right', });
            doc.text(item.iva_name, 180, h, { align: 'right', });
            doc.text(this.fixeDecimalMoney(item.subtotal), 200, h, { align: 'right', });
            this.line_number = this.line_number + 1
        },
       

        emitir_pie(doc, page_number) {
            let rect_y = 120

            doc.setFont(this.fontFamily, 'bold')
            doc.setFontSize(10)

            let h = rect_y + 10

            
            doc.setFontSize(11)
            doc.text('TOTAL: ', 180, h + 5, { align: 'right' })
            doc.text('$ ' + this.fixeDecimalMoney(this.total.toString()), 200, h + 5, { align: 'right' })

            let qr_y = 120

            doc.setFont(this.fontFamily, 'normal')
            doc.text('Página ' + String(page_number) + ' de ' + this.cant_paginas, 105, qr_y + 26, { align: 'center'})
            
        },
        
        emitir_encabezado( doc ) {

            let num_comp_format =  Intl.NumberFormat("en-US", {
                useGrouping: false,
                minimumIntegerDigits: 5
            })


            doc.rect(97, 5, 16, 14)
            doc.setFontSize(25)
            doc.text(102, 14, 'X')
            doc.setFontSize(9)

            doc.setFontSize(21);
            doc.setFont(this.fontFamily, "bold")
            doc.text(20, 13, 'PLASTITODO')

            doc.text(120, 13, this.name_comprobante)

            doc.setFontSize(9)
            
            doc.setFont(this.fontFamily, 'normal')        
            doc.text(120, 18, 'Número:')
            
            doc.text(150, 18, num_comp_format.format(this.sale.id))

            doc.text(120, 23, 'Fecha de Emisión:')
            
            doc.text(150, 23, this.$luxon(this.sale.attributes.created_at, { output: "dd-MM-yyyy  HH:mm" }))

            doc.setFillColor('#F1EFEF')
            doc.rect(5, 27, 200, 8, 'F');
            doc.rect(5, 27, 200, 8);

            doc.text(10, 32, 'Producto' )
            doc.text(130, 32, 'Cantidad' )
            doc.text(153, 32, 'Precio' )
            doc.text(171, 32, '% iva' )
            doc.text(189, 32, 'Subtotal' )
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

        getImporteIva ( ivaaliquot_id ) {
            let total = 0
            for ( let item of this.comprobanteItems ) {
                if ( ivaaliquot_id == item.iva_id ) {
                    total = this.roundHalfUp(total + item.iva_valor, 4)
                }
            }
            for ( let item of this.comprobanteComboItems ) {
                if ( ivaaliquot_id == item.iva_id ) {
                    total = this.roundHalfUp(total + item.iva_valor, 4)
                }
            }
            return total
        },

        ObtenerSaleItems ( ) {
            
            for ( let item of this.items ) {
                let precio = 0
                let precio_base = 0
                if ( item.attributes.is_stock_unitario_variable ) {
                    precio_base = (( item.attributes.precio / item.attributes.stock_aproximado_unidad ) / item.attributes.relacion_venta_stock ) 
                    console.log(item.attributes.precio)
                }else {
                    precio_base = item.attributes.precio
                }

                
                if ( this.discriminar_iva ) {
                    precio = this.roundHalfUp(precio_base / ( this.roundHalfUp(1 + item.relationships.ivaaliquot.valor / 100, 4) ), 2)
                }else {
                    precio = this.roundHalfUp(precio_base, 2)
                }
                let cantidad = 0
                if ( item.attributes.is_stock_unitario_variable ) {
                    cantidad = item.attributes.cantidad_total
                }else {
                    cantidad = item.attributes.cantidad
                }

                let subtotal = 0
                if ( item.attributes.is_stock_unitario_variable ) {
                    subtotal = this.roundHalfUp(precio  * cantidad, 2)
                }else {
                    subtotal = this.roundHalfUp(precio * cantidad, 2)
                }
                

                this.comprobanteItems.push({
                    name: item.attributes.name,
                    precio: precio,
                    cantidad: cantidad,
                    subtotal: subtotal,
                    iva_valor: this.roundHalfUp(this.roundHalfUp(item.attributes.precio * cantidad - subtotal, 2), 2),
                    iva_id: item.relationships.ivaaliquot.id,
                    iva_name: item.relationships.ivaaliquot.name
                })
            }
            for ( let comboitem of this.comboitems ) {
                let precio = 0
                if ( this.discriminar_iva ) {
                    precio = this.roundHalfUp(comboitem.attributes.precio / ( this.roundHalfUp(1 + comboitem.relationships.ivaaliquot.valor / 100, 4) ), 2)
                }else {
                    precio = this.roundHalfUp(comboitem.attributes.precio, 2)
                }
                let subtotal = this.roundHalfUp(precio * comboitem.attributes.cantidad, 2)

                this.comprobanteComboItems.push({
                    name: comboitem.relationships.combo.name,
                    precio: precio,
                    cantidad: comboitem.attributes.cantidad,
                    subtotal: subtotal,
                    iva_valor: this.roundHalfUp(this.roundHalfUp(comboitem.attributes.precio * comboitem.attributes.cantidad - subtotal , 2), 2),
                    iva_id: comboitem.relationships.ivaaliquot.id,
                    iva_name: comboitem.relationships.ivaaliquot.name,

                    is_combo: true
                })
                
                for ( let item of comboitem.relationships.salecombosaleproducts ) {
                    this.comprobanteComboItems.push({
                        name: item.relationships.saleproduct.name,
                        precio: 0,
                        cantidad: item.attributes.cantidad,
                        subtotal: 0,
                        iva_valor: 0,
                        iva_id: comboitem.relationships.ivaaliquot.id,
                        iva_name: comboitem.relationships.ivaaliquot.name,

                        is_combo: false
                    })
                }
            }
            
        },

        ObtenerCreditnoteItems ( ) {
            
            for ( let item of this.items ) {
                let valor = 0
                if ( this.discriminar_iva ) {
                    valor = this.roundHalfUp(item.attributes.valor / ( this.roundHalfUp(1 + item.relationships.ivaaliquot.valor / 100, 4) ), 2)
                }else {
                    valor = this.roundHalfUp(item.attributes.valor, 2)
                }
                
                let subtotal = this.roundHalfUp(valor, 2)

                this.comprobanteItems.push({
                    name: 'Ajuste al ' + item.relationships.ivaaliquot.name,
                    precio: valor,
                    cantidad: 1,
                    subtotal: subtotal,
                    iva_valor: this.roundHalfUp(this.roundHalfUp(item.attributes.valor - subtotal, 2), 2),
                    iva_id: item.relationships.ivaaliquot.id,
                    iva_name: item.relationships.ivaaliquot.name
                })
            }
    
            
        },

        ObtenerDebitnoteItems ( ) {
            
            for ( let item of this.items ) {

                let valor = 0
                if ( this.discriminar_iva ) {
                    valor = this.roundHalfUp(item.attributes.valor / ( this.roundHalfUp(1 + item.relationships.ivaaliquot.valor / 100, 4) ), 2)
                }else {
                    valor = this.roundHalfUp(item.attributes.valor, 2)
                }
                
                let subtotal = this.roundHalfUp(valor, 2)

                this.comprobanteItems.push({
                    name: 'Ajuste al ' + item.relationships.ivaaliquot.name,
                    precio: valor,
                    cantidad: 1,
                    subtotal: subtotal,
                    iva_valor: this.roundHalfUp(this.roundHalfUp(item.attributes.valor - subtotal, 2), 2),
                    iva_id: item.relationships.ivaaliquot.id,
                    iva_name: item.relationships.ivaaliquot.name
                })
            }    
            
        },



        ObtenerDevolutionItems ( ) {
            
            for ( let item of this.items ) {
                let precio = 0
                if ( this.discriminar_iva ) {
                    precio = this.roundHalfUp(item.attributes.precio / ( this.roundHalfUp(1 + item.relationships.ivaaliquot.valor / 100, 4) ), 2)
                }else {
                    precio = this.roundHalfUp(item.attributes.precio, 2)
                }
                let cantidad = 0
                if ( item.attributes.is_stock_unitario_variable ) {
                    cantidad = item.attributes.cantidad_total
                }else {
                    cantidad = item.attributes.cantidad
                }
                let subtotal = this.roundHalfUp(precio * cantidad, 2)

                this.comprobanteItems.push({
                    name: item.attributes.name,
                    precio: precio,
                    cantidad: cantidad,
                    subtotal: subtotal,
                    iva_valor: this.roundHalfUp(this.roundHalfUp(item.attributes.precio * cantidad - subtotal, 2), 2),
                    iva_id: item.relationships.ivaaliquot.id,
                    iva_name: item.relationships.ivaaliquot.name
                })
            }
            for ( let comboitem of this.comboitems ) {
                let precio = 0
                if ( this.discriminar_iva ) {
                    precio = this.roundHalfUp(comboitem.attributes.precio / ( this.roundHalfUp(1 + comboitem.relationships.ivaaliquot.valor / 100, 4) ), 2)
                }else {
                    precio = this.roundHalfUp(comboitem.attributes.precio, 2)
                }
                let subtotal = this.roundHalfUp(precio * comboitem.attributes.cantidad, 2)

                this.comprobanteComboItems.push({
                    name: comboitem.attributes.name,
                    precio: precio,
                    cantidad: comboitem.attributes.cantidad,
                    subtotal: subtotal,
                    iva_valor: this.roundHalfUp(this.roundHalfUp(comboitem.attributes.precio * comboitem.attributes.cantidad - subtotal , 2), 2),
                    iva_id: comboitem.relationships.ivaaliquot.id,
                    iva_name: comboitem.relationships.ivaaliquot.name,

                    is_combo: true
                })
                
                for ( let item of comboitem.relationships.devolutioncombosaleproducts ) {
                    this.comprobanteComboItems.push({
                        name: item.attributes.name,
                        precio: 0,
                        cantidad: item.attributes.cantidad,
                        subtotal: 0,
                        iva_valor: 0,
                        iva_id: comboitem.relationships.ivaaliquot.id,
                        iva_name: comboitem.relationships.ivaaliquot.name,

                        is_combo: false
                    })
                }
            }

            
            
        },

        roundHalfUp(value, decimals) {
           return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
        }
    }

}
</script>

<style>

</style>