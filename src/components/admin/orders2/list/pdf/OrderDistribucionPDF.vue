<template>
    
        <v-dialog
          v-model="dialog"
          
          max-width="500"
        
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn                
                small
                v-bind="attrs"
                v-on="on"
                text
                color="success"
                @click="onload"
                >           
                    pdf ENVIOS    
            </v-btn>
        
            
        </template>
        <v-card>
            <v-card-title>
                
                
            </v-card-title>
            
            <v-card-text >
                <v-row class="">
                    <v-col cols="12" sm="4"  class=" d-flex justify-sm-end align-center">
                        <span class="font-weight-bold black--text">Sucursal: </span>
                    </v-col>
                    <v-col cols="12" sm="8"  class="d-flex justify-start align-center">
                        <v-select
                            dense
                            :items="sucursals_select"
                            item-text="name"
                            item-value="id"
                            v-model="sucursal_id"
                            :menu-props="{ offsetY: true }"
                            hide-details=""
                            clearable
                        >
                        </v-select>

                    </v-col>
                </v-row>
                <v-row class="">
                    <v-col cols="12" sm="4"  class=" d-flex justify-sm-end align-center">
                        <span class="font-weight-bold black--text">Turno: </span>
                    </v-col>
                    <v-col cols="12" sm="8"  class="d-flex justify-start align-center">
                        <v-select
                            dense
                            clearable
                            :items="deliveryshifts_select"
                            item-text="name"
                            item-value="id"
                            v-model="deliveryshift_id"
                            hide-details=""
                            :menu-props="{ offsetY: true }"
                        >

                        </v-select>

                    </v-col>
                </v-row>
                

                
                
            </v-card-text>  
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        :loading="is_generando"
                        @click="generar"
                    >
                        Generar
                    </v-btn>
                </v-card-actions>          
        </v-card>
        </v-dialog>
    
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import jsPDF from 'jspdf'
export default {
    
    props: {
        sucursal_id_default: Number,
    },
    data () {
        return {

            dialog: false,

            is_generando: false,

            orders: null,

            fontFamily: 'helvetica',

            cant_lineas_page: 5,
            line_height: 45,
            line_start: 50,
            cant_paginas: 0,
            line_number: 0,
            page_number: 1,


            deliveryshift_id: 1,
            sucursal_id: 1,
        }
    },
    computed: {
        ...mapGetters({
            empresa: 'empresa',
            deliveryshifts_select: 'deliveryshifts_manager/deliveryshifts_select',
            sucursals_select: 'sucursals_manager/sucursals_select',
            sucursal_by_id: 'sucursals_manager/sucursal_by_id',
        })
    },

    methods: {
        ...mapActions({
            buscar_orders_distribucion: 'orders_manager/buscar_item_distribucion',
        }),
        async generar ( ) {
            this.is_generando = true
            var doc = new jsPDF();
            
            await this.buscar()  
            //console.log(this.orders)        

            let cant_lineas = this.orders.length

            this.cant_paginas = Math.ceil( cant_lineas / this.cant_lineas_page )

            let page_number = 1
            this.line_number = 0 
            this.emitir_encabezado(doc)

            for ( let order of this.orders ) {
                this.emitir_order(doc, order)
                if ( (this.line_number % this.cant_lineas_page) == 0) {
                    this.emitir_pie(doc, page_number)
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

            this.is_generando = false
            //this.dialog = false
            doc.output('dataurlnewwindow');

        },

        emitir_order (doc, order) {
            let numero_format =  Intl.NumberFormat("en-US", {
                useGrouping: false,
                minimumIntegerDigits: 4
            })
            let numero_format_factura =  Intl.NumberFormat("en-US", {
                useGrouping: false,
                minimumIntegerDigits: 6
            })
            let numero_format_punto_venta =  Intl.NumberFormat("en-US", {
                useGrouping: false,
                minimumIntegerDigits: 3
            })
            let h = (this.line_number * this.line_height) + this.line_start
            
            doc.rect(8, h, 194, 39)
            doc.text('Pedido: ', 163, h + 8)
            doc.setFontSize(15)
            doc.text('# ' +numero_format.format(order.id), 197, h + 8, { align: 'right', })
            doc.setFontSize(11)
            doc.text('Cant Bultos:  ' , 163, h + 15)
            if ( order.attributes.cant_bultos != null ) {
                doc.text(Number(order.attributes.cant_bultos).toString() , 197, h + 15, { align: 'right', })
            }
            doc.text('Saldo: ', 163, h + 33)
            doc.text('$ ' + this.globalHelperFixeDecimalMoney(this.saldo(order.relationships.sale)), 197, h + 33, {align: 'right', })

            doc.text('Cliente: ' , 15, h + 8)
            if ( order.relationships.client.attributes.tipo_persona == 'FISICA' ) {
                doc.text(order.relationships.client.attributes.name+ ' ' + order.relationships.client.attributes.surname, 44, h + 8)
            } else {
                doc.text('Cliente: ' + order.relationships.client.attributes.name, 44, h + 8)
            }
            
            doc.text('Direccion: ', 15, h + 13)
            if ( order.relationships.client.attributes.direccion ) {
                doc.text(order.relationships.client.attributes.direccion, 44, h + 13)
            }
            
            if ( order.relationships.client.attributes.coments_direccion_client != null ) {
                doc.text('( ' + order.relationships.client.attributes.coments_direccion_client +' )', 44, h + 18, {align: 'left', maxWidth: 120 })
            }
                
            doc.text('Teléfono: ', 15, h + 28)
            if ( order.relationships.client.attributes.telefono != null ) {
                doc.text(order.relationships.client.attributes.telefono, 44, h + 23)
            }

            doc.text('Comprobantes: ', 15, h + 33)
            if ( order.relationships.sale.relationships.comprobante ) {
                doc.text('Factura ' + numero_format_punto_venta.format(order.relationships.sale.relationships.comprobante.attributes.punto_venta) + ' - ' + numero_format_factura.format(order.relationships.sale.relationships.comprobante.attributes.numero), 44, h + 33)
            }
            

            this.line_number = this.line_number + 1
        },

        emitir_pie ( doc, page_number ) {
            doc.text('Hoja ' + Number(page_number).toString() + ' de ' + Number(this.cant_paginas).toString(), 105, 288, {align: 'center'})

        },        

        emitir_encabezado (doc) {

            doc.setFontSize(25)
            doc.setFillColor('#00e069');

            doc.setFont(this.fontFamily, 'bold')
            doc.text(('PEDIDOS A ENVIAR').toUpperCase(), 8, 23)
            doc.setFont(this.fontFamily, 'normal')
            doc.setFontSize(16)
            doc.setTextColor(null);
            //doc.text((this.empresa.attributes.name).toUpperCase(), 202, 23, { align: 'right', })
            
            doc.setTextColor(null);

            doc.setFontSize(11)
            
            let l_h = 30
            if ( this.sucursal_id != null ) {
                doc.text('Sucursal:  ' + this.sucursal_by_id(this.sucursal_id).attributes.name, 8, l_h + 5)
            }else {
                doc.text('Sucursal:  Todas' , 8, l_h + 5)
            }
            
            doc.text('Fecha de emisión:  ' +new Date().toLocaleString(), 8, l_h + 10)
            
        },        

        async buscar () {
            await this.buscar_orders_distribucion({sucursal_id: this.sucursal_id, deliveryshift_id: this.deliveryshift_id})
                .then((resp) => {
                    this.orders = resp.data.data               

                })
                .catch((error) => {
                    console.log(error)
                })
        },

        onload ( ) {
            this.sucursal_id = this.sucursal_id_default
            this.deliveryshift_id = null
        },

        saldo ( sale ) {
            let saldo = Number(sale.attributes.total)
            for ( let payment of sale.relationships.payments ) {
                saldo = saldo - Number(payment.attributes.valor)
            }
            for ( let refund of sale.relationships.refunds ) {
                saldo = saldo + Number(refund.attributes.valor)
            }
            return saldo
        },
    }
}
</script>

<style>

</style>