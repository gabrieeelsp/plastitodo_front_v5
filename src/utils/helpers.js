import Vue from "vue"

Vue.mixin({
    methods: {
        globalHelperCalculaPrecio(costo, porcentaje, relacion) {
            let num = ( porcentaje / 100 ).toFixed(10)
            if ( num <= 2 ) { num = Number(num) + 1 }
            let unit = (costo * num).toFixed(10)
            return ( unit * relacion ).toFixed(10)
        },

        globalHelerAplicaDescuento(valor, descuento) {
            let num = ( (100 - descuento) / 100 ).toFixed(10)
            return ( valor * num ).toFixed(10)
        },

        globalHelperCalculaStock(stock, relacion) {
            let a = stock / relacion 
            return Number(a).toFixed(4)
        },

        globalHelperCalculaStockVariation(cantidad, relacion) {
            let a = cantidad * relacion 
            return Number(a).toFixed(4)
        },

        globalHelperFixeDecimalMoney(valor) {
            return Number(valor).toFixed(2)
        },
        globalHelperFixeDecimalCantidad(valor) {
            return Number(valor).toFixed(2)
        },
        globalHelperFixeDecimalPorcentaje(valor) {
            return Number(valor).toFixed(2)
        },

        globalHelperCalculaSubTotal(precio, cantidad) {
            return Number(precio * cantidad).toFixed(10)            
        },

        globalHelperCalculaSubTotalStockUnitario(precio, cantidad, stock_aproximado_unitario, cantidad_total) {
            
            if ( Number(cantidad_total) != 0 ) {
                return Number(precio * cantidad_total).toFixed(10) 
                
            }
            return Number(precio * cantidad * stock_aproximado_unitario).toFixed(10)            
        },

        globalHelperCalculaSaldoSale (sale) {
            let total = 0
            for ( let item of sale.relationships.payments) {
                total = total + Number(item.attributes.valor)
            }
            
            return sale.attributes.total - Number(total).toFixed(10)
        },

        globalHelperGetTotalFinalSale(sale) {
            
            let total = sale.attributes.total
            for (var devolution of sale.relationships.devolutions) {
                total = total - Number(devolution.attributes.total)
            }
            return Number(total).toFixed(10)
        },

        globalHelperGetTotalDevolution (devolution) {
            let total = 0
            for ( let item of devolution.relationships.devolutionitems) {
                if ( item.attributes.is_devolution_item ){
                    if( item.attributes.is_stock_unitario_kilo ) {
                        total = total + (item.attributes.precio * item.attributes.cantidad_total)
                    }else {
                        total = total + (item.attributes.precio * item.attributes.cantidad)
                    }
                }         
            }
            return total.toFixed(10)
        },

        globalHelperGetTotalRefound (devolution) {
            let total = 0
            for ( let item of devolution.relationships.refounds ) {
                total = total - Number(item.attributes.valor)
            }
            return total.toFixed(10)
        },



        globalHelperCalculaCosto(costo, relacion_venta_stock) {
            return Number(costo * relacion_venta_stock).toFixed(10)            
        },

        globalHelperCalculaPorcentaje(costo, precio) {
            let a = Number(precio / costo)
            a = a - 1
            return Number( a * 100 ).toFixed(10)            
        },

        globalHelperFixNumeroDocuento (num){
            let numero_format =  Intl.NumberFormat("en-US", {
                useGrouping: false,
                minimumIntegerDigits: 4
            })
            return numero_format.format(num)

        }

    },
})