<template>
<div>
    <div v-show="false" >
        
        <VueQRCodeComponent 
            :text="qr_text" 
            :size="80" 
            id="qr_code2"
            error-level="L"
        ></VueQRCodeComponent>
    </div>
    
    
    
    <v-btn 
        block 
        small 
        @click="generateReport"
        :loading="is_generandoReporte"
    >
        Imprimir
    </v-btn>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import jsPDF from 'jspdf'
import VueQRCodeComponent from 'vue-qrcode-component'
import $ from "jquery";
export default {
    props: {
        items: Array,
        comboitems: Array,
        comprobante: Object,
        total: Number,
        tipo: String
    },
    components: {
        VueQRCodeComponent
    },
    computed: {
        ...mapGetters({
            ivaaliquots: 'ivaaliquots_manager/ivaaliquots'
        }),
        name_comprobante: function () {
            if ( this.comprobante.attributes.id_afip_tipo == 1 ) { return 'FACTURA'}
            if ( this.comprobante.attributes.id_afip_tipo == 2 ) { return 'NOTA DE DEBITO'}
            if ( this.comprobante.attributes.id_afip_tipo == 3 ) { return 'NOTA DE CREDITO'}

            if ( this.comprobante.attributes.id_afip_tipo == 6 ) { return 'FACTURA'}
            if ( this.comprobante.attributes.id_afip_tipo == 7 ) { return 'NOTA DE DEBITO'}
            if ( this.comprobante.attributes.id_afip_tipo == 8 ) { return 'NOTA DE CREDITO'}
            return null
        },

        discriminar_iva: function () {
            if ( this.comprobante.attributes.id_afip_tipo == 1 ) { return true }
            if ( this.comprobante.attributes.id_afip_tipo == 2 ) { return true }
            if ( this.comprobante.attributes.id_afip_tipo == 3 ) { return true }
            return null
        },
        
        qr_text: function () {
            let str_fecha_array = this.comprobante.attributes.created_at.replace(/ /g, "").split('/')
            
            let qr_text_64 = JSON.stringify({
                ver: 1,
                fecha: str_fecha_array[2] + '-' + str_fecha_array[1] + '-' + str_fecha_array[0],
                cuit: Number(this.comprobante.attributes.cuit_empresa),
                ptoVta: Number(this.comprobante.attributes.punto_venta),
                tipoCmp: Number(this.comprobante.attributes.id_afip_tipo),
                nroCmp: Number(this.comprobante.attributes.numero),
                importe: Number(this.total),
                moneda: 'PES',
                ctz: 1,
                tipoDocRec: Number(this.comprobante.attributes.doctype_id_afip_client),
                nroDocRec: Number(this.comprobante.attributes.docnumber_client),
                tipoCodAut: 'E',
                codAut: Number(this.comprobante.attributes.cae)
                
            })
            return 'https://www.afip.gob.ar/fe/qr/?p='+ btoa(qr_text_64)  
        }
    },
    data() {
        return {
            is_generandoReporte: false,

            fontFamily: 'times',
            cant_lineas_page: 10,
            line_height: 5,
            line_start: 90,
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
            var doc = new jsPDF('p', 'mm', [120, 80])

            this.emitir_comprobante(doc)
            
            this.is_generandoReporte = false
            doc.output('dataurlnewwindow');
        },
        emitir_comprobante(doc ) {

            //let cant_lineas = this.comprobanteItems.length + this.comprobanteComboItems.length


            this.line_number = 0            

            this.emitir_encabezado(doc)
            //this.emitir_sub_encabezado(doc)

            /* for ( let item of this.comprobanteItems ) {
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
                        this.emitir_sub_encabezado(doc)
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
                        this.emitir_sub_encabezado(doc)
                    }
                    
                }
            }

            this.emitir_pie(doc, page_number) */

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

            let h = (this.line_number * this.line_height) + this.line_start
            doc.text(item.name, 10, h, { align: 'left', });
            doc.text(this.fixeDecimalCantidad(item.cantidad), 140, h, { align: 'right', });
            
            doc.text(this.fixeDecimalMoney(item.precio), 162, h, { align: 'right', });
            doc.text(item.iva_name, 180, h, { align: 'right', });
            doc.text(this.fixeDecimalMoney(item.subtotal), 200, h, { align: 'right', });
            this.line_number = this.line_number + 1
        },
       

        emitir_pie(doc, page_number) {
            let rect_y = 210
            doc.rect(5, rect_y, 200, 35);
            doc.setFont(this.fontFamily, 'bold')
            doc.setFontSize(10)
            doc.text('Sub Total: ', 180, rect_y + 5, { align: 'right' })
            doc.text(this.fixeDecimalMoney(this.getSubTotal().toString()), 200, rect_y + 5, { align: 'right' })
            let h = rect_y + 10
            if ( this.discriminar_iva ) {
                doc.setFontSize(9)
                for ( let ivaaliquot of this.ivaaliquots ) {
                    if ( [3, 4, 5].includes(ivaaliquot.id)) {
                        doc.text('IVA ' + ivaaliquot.attributes.name + ' %: ', 180, h, { align: 'right' })
                        doc.text(this.fixeDecimalMoney(this.getImporteIva(ivaaliquot.id)), 200, h, { align: 'right' })
                        h = h + 5
                    }                
                }
            }
            
            doc.setFontSize(11)
            doc.text('TOTAL: ', 180, h + 1, { align: 'right' })
            doc.text(this.fixeDecimalMoney(this.total.toString()), 200, h + 1, { align: 'right' })

            let qr_y = 250

            let base64Image = $('#qr_code2 img').attr('src');
            doc.addImage(base64Image, 'png', 10, qr_y, 30, 30);

            doc.text('CAE N°: ', 160, qr_y + 2, {align: 'right'})
            doc.setFont(this.fontFamily, 'normal')
            doc.text(this.comprobante.attributes.cae, 162, qr_y +2)
            doc.setFont(this.fontFamily, 'bold')
            doc.text('Fecha de Vto. de CAE: ', 160, qr_y + 7, {align: 'right'})
            doc.setFont(this.fontFamily, 'normal')
            doc.text(this.comprobante.attributes.cae_fch_vto, 162, qr_y + 7)

            doc.setFont(this.fontFamily, 'italic')
            doc.setFontSize(12)
            doc.text('Comprobante Autorizado', 45, qr_y + 20)
            doc.setFontSize(8)
            doc.text('Esta Administración Federal no se responsabiliza por los datos ingresados en el detalle de la operación', 45, qr_y + 25)
            
            doc.text('Página ' + String(page_number) + ' de ' + this.cant_paginas, 200, qr_y + 26, { align: 'right'})

            var imgLogo = new Image()
            imgLogo.src = this.logo_afip
            doc.addImage(imgLogo, 'JPG', 44, qr_y - 2, 37, 18)
            
        },
        emitir_sub_encabezado( doc ) {
            doc.rect(5, 55, 200, 19);

            doc.setFont(this.fontFamily, 'bold')            
            doc.text(10, 60, this.comprobante.attributes.doctype_name_client + ': ')
            doc.setFont(this.fontFamily, 'normal')
            doc.text(20, 60, this.comprobante.attributes.docnumber_client)

            doc.setFont(this.fontFamily, 'bold')            
            doc.text(10, 65, 'Condición frente al iva: ')
            doc.setFont(this.fontFamily, 'bold')
            doc.text(45, 65, this.comprobante.attributes.ivacondition_name_client)

            doc.setFont(this.fontFamily, 'bold')            
            doc.text(10, 70, 'Condición de venta: ')
            doc.setFont(this.fontFamily, 'normal')
            doc.text(40, 70, this.comprobante.attributes.condicion_venta)

            doc.setFont(this.fontFamily, 'bold')            
            doc.text(80, 60, 'Apellido y Nombre / Razón Social: ')
            doc.setFont(this.fontFamily, 'normal')
            if ( this.comprobante.attributes.nombre_fact_client ) {
                doc.text(130, 60, this.comprobante.attributes.nombre_fact_client)
            }
            

            doc.setFont(this.fontFamily, 'bold')            
            doc.text(113, 65, 'Domicilio: ')
            doc.setFont(this.fontFamily, 'normal')
            if ( this.comprobante.attributes.direccion_fact_client ) {
                doc.text(130, 65, this.comprobante.attributes.direccion_fact_client)
            }

            doc.setFillColor('#F1EFEF')
            doc.rect(5, 76, 200, 8, 'F');
            doc.rect(5, 76, 200, 8);

            doc.text(10, 81, 'Producto' )
            doc.text(130, 81, 'Cantidad' )
            doc.text(153, 81, 'Precio' )
            doc.text(171, 81, '% iva' )
            doc.text(189, 81, 'Subtotal' )
        },
        emitir_encabezado( doc ) {

            /* let punto_venta_format =  Intl.NumberFormat("en-US", {
                useGrouping: false,
                minimumIntegerDigits: 4
            })

            let num_comp_format =  Intl.NumberFormat("en-US", {
                useGrouping: false,
                minimumIntegerDigits: 5
            }) */


            doc.setFontSize(10);
            doc.setFont(this.fontFamily, "bold")
            doc.text(10, 10, this.comprobante.attributes.nombre_empresa.toUpperCase())

            /*
            doc.rect(5, 15, 200, 38)
            doc.rect(97, 15, 16, 16)
            doc.setFontSize(25)
            doc.text(102, 24, this.comprobante.relationships.modelofact.name)
            doc.setFontSize(9)
            doc.text(100, 29, 'COD: ' + this.comprobante.attributes.id_afip_tipo)
            doc.line(105, 31, 105, 53)

            doc.text(120, 25, this.name_comprobante)

            doc.setFontSize(9)
            doc.text(10, 35, 'Razón Social:')
            doc.setFont(this.fontFamily, "normal")
        
            doc.text(30, 35, this.comprobante.attributes.razon_social_empresa.substring(0, 41))
            doc.text(30, 39, this.comprobante.attributes.razon_social_empresa.substring(42, this.comprobante.attributes.razon_social_empresa.lenght))
            doc.setFont(this.fontFamily, "bold")
            doc.text(10, 44, 'Domicilio Comercial:')
            doc.setFont(this.fontFamily, "normal")
            doc.text(40, 44, this.comprobante.attributes.domicilio_comercial_empresa)

            doc.setFont(this.fontFamily, "bold")
            doc.text(10, 49, 'Condición frente al IVA:')
            doc.text(45, 49, this.comprobante.attributes.ivacondition_name_empresa)

            doc.text(120, 30, 'Punto de Venta:')
            doc.text(150, 30, punto_venta_format.format(this.comprobante.attributes.punto_venta))

            doc.text(160, 30, 'Comp. Nro:')
            doc.text(180, 30, num_comp_format.format(this.comprobante.attributes.numero))

            doc.text(120, 35, 'Fecha de Emisión:')
            doc.text(150, 35, this.comprobante.attributes.created_at)
            doc.text(120, 40, 'Cuit:')
            doc.setFont(this.fontFamily, 'normal')
            doc.text(130, 40, this.comprobante.attributes.cuit_empresa)
            doc.setFont(this.fontFamily, 'bold')
            doc.text(120, 45, 'Ingresos Brutos:')
            doc.setFont(this.fontFamily, 'normal')
            doc.text(145, 45, this.comprobante.attributes.ing_brutos_empresa)
            doc.setFont(this.fontFamily, 'bold')
            doc.text(120, 50, 'Fecha de Inicio de Actividades:')
            doc.setFont(this.fontFamily, 'normal')
            doc.text(165, 50, this.comprobante.attributes.fecha_inicio_act_empresa) */
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