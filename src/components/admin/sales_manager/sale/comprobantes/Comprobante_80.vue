<template>
<div>
    
    
    
    
    <v-btn 
        block 
        small 
        @click="generateReport"
        :loading="is_generandoReporte"
    >
        Ver
    </v-btn>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
export default {
    props: {
        items: Array,
        comboitems: Array,
        comprobante: Object,
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

            comprobanteItems: [],
            comprobanteComboItems: [],

        }
    },
    methods: {
        async generateReport () { 
            this.is_generandoReporte = true
            if ( this.tipo == 'sale') { this.ObtenerSaleItems() }
            if ( this.tipo == 'devolution') { this.ObtenerDevolutionItems() }
            if ( this.tipo == 'creditnote') { this.ObtenerCreditnoteItems() }
            if ( this.tipo == 'debitnote') { this.ObtenerDebitnoteItems() }


            console.log('total' + this.total)

            // enviar por axios
            await axios.post('http://localhost:8011/print_comprobante', this.emitir_comprobante())
                .then((resp) => {
                    console.log(resp)
                })
                .catch((error) => {
                    console.log(error)
                })

            this.is_generandoReporte = false
            
        },
        emitir_comprobante() {  
            console.log(this.comprobante)
            let json_items = []
            for ( let item of this.comprobanteItems ) {
                json_items.push({
                    name: item.name,
                    cantidad: this.fixeDecimalCantidad(item.cantidad),
                    precio: this.fixeDecimalMoney(item.precio),
                    iva_name: item.iva_name,
                    subtotal: this.fixeDecimalMoney(item.subtotal)
                })
            }
            

            let json_comboitems = []
            for ( let item of this.comprobanteComboItems ) {
                var name = ''
                if ( item.is_combo ) {
                    name = '[Combo] ' + item.name
                }else {
                    name = ' - ' + item.name
                }
                json_comboitems.push({
                    name: name,
                    cantidad: this.fixeDecimalCantidad(item.cantidad),
                    precio: this.fixeDecimalMoney(item.precio),
                    iva_name: item.iva_name,
                    subtotal: this.fixeDecimalMoney(item.subtotal)
                })
            }
            
            let json_ivaaliquots = []
            if ( this.discriminar_iva ) {
                for ( let ivaaliquot of this.ivaaliquots ) {
                    if ( [3, 4, 5].includes(ivaaliquot.id)) {
                        json_ivaaliquots.push({
                            name: 'IVA ' + ivaaliquot.attributes.name + ' %: ',
                            valor: this.fixeDecimalMoney(this.getImporteIva(ivaaliquot.id))
                        })
                    }                
                }
            }
            let json_comprobante = {
                
                //empresa
                nombre_empresa: this.comprobante.attributes.nombre_empresa,
                razon_social_empresa: this.comprobante.attributes.razon_social_empresa,
                domicilio_comercial_empresa: this.comprobante.attributes.domicilio_comercial_empresa,
                ivacondition_name_empresa: this.comprobante.attributes.ivacondition_name_empresa,
                tipo: this.comprobante.attributes.tipo,
                id_afip_tipo: (this.comprobante.attributes.id_afip_tipo).toString(),
                name_comprobante: this.name_comprobante,
                punto_venta: this.comprobante.attributes.punto_venta,
                numero: this.comprobante.attributes.numero,
                fecha: (this.comprobante.attributes.created_at).replace(/ /g, ""),
                cuit_empresa: this.comprobante.attributes.cuit_empresa,
                ing_brutos_empresa: this.comprobante.attributes.ing_brutos_empresa,
                fecha_inicio_act_empresa: this.comprobante.attributes.fecha_inicio_act_empresa,
                cae: this.comprobante.attributes.cae,
                cae_fch_vto: (this.comprobante.attributes.cae_fch_vto).replace(/ /g, ""),
                qr_text: this.qr_text,
                sub_total: this.fixeDecimalMoney(this.getSubTotal().toString()),
                total: (this.total).toString(),
                

                //cliente
                doctype_name_client: this.comprobante.attributes.doctype_name_client,
                docnumber_client: this.comprobante.attributes.docnumber_client,
                ivacondition_name_client: this.comprobante.attributes.ivacondition_name_client,
                condicion_venta: this.comprobante.attributes.condicion_venta,
                nombre_fact_client: this.comprobante.attributes.nombre_fact_client,
                direccion_fact_client: this.comprobante.attributes.direccion_fact_client,

                

                //items
                items: json_items,
                //comboitems
                comboitems: json_comboitems,
                //json_ivaaliquots
                ivaaliquots: json_ivaaliquots,


            }

            return json_comprobante
            

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