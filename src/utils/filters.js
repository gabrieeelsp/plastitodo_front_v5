import Vue from "vue"

Vue.filter("round2decimal", num => Number(num).toFixed(2))

Vue.filter("money_string", num => {
    let dollarUS =  Intl.NumberFormat("en-US", {
        style: "currency",
        currency:"USD",
        useGrouping: true,
        minimumFractionDigits: 2
    })
    return dollarUS.format(num)
    //return Intl.NumberFormat('en-US').format(num) 
})

Vue.filter("punto_venta_string", num => {
    let dollarUS =  Intl.NumberFormat("en-US", {
        useGrouping: false,
        minimumIntegerDigits: 4
    })
    return dollarUS.format(num)
})

Vue.filter("numero_factura_string", num => {
    let dollarUS =  Intl.NumberFormat("en-US", {
        useGrouping: false,
        minimumIntegerDigits: 5
    })
    return dollarUS.format(num)
})