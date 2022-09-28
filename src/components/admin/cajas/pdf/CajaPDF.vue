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
        caja: Object,
    },
    components: {
        
    },
    computed: {
        ...mapGetters({
                
        }),
    },
    data() {
        return {
            is_generandoReporte: false,

            fontFamily: 'helvetica',

        }
    },
    methods: {
        
        generateReport () { 
            this.is_generandoReporte = true            

            var doc = new jsPDF({
                orientation: 'landscape',
                format: 'a5'
            });
            

            this.emitir_comprobante(doc)

            this.is_generandoReporte = false
            doc.output('dataurlnewwindow');
        },
        emitir_comprobante(doc ) {

 

            doc.setFontSize(9)  


            let num_comp_format =  Intl.NumberFormat("en-US", {
                useGrouping: false,
                minimumIntegerDigits: 5
            })

            doc.setFontSize(14);
            doc.setFont(this.fontFamily, "bold")

            doc.text(165, 18, 'Caja:')            
            doc.text(200, 18, '# ' + num_comp_format.format(this.caja.id), { align: 'right', })

            doc.setFontSize(11);
            doc.setFont(this.fontFamily, "normal")

            doc.text(10, 23, 'Usuario:')            
            doc.text(50, 23, this.caja.relationships.user.data.attributes.name + ' ' + this.caja.relationships.user.data.attributes.surname)

            doc.text(10, 30, 'Sucursal:')            
            doc.text(50, 30, this.caja.relationships.sucursal.data.attributes.name )

            doc.text(10, 37, 'Fecha de Inicio:')            
            doc.text(50, 37, this.$luxon(this.caja.attributes.created_at, { output: "dd-MM-yyyy  HH:mm" }))

            doc.text(120, 37, 'Fecha de Cierre:')            
            doc.text(160, 37, this.$luxon(this.caja.attributes.close_at, { output: "dd-MM-yyyy  HH:mm" }))


            doc.text(10, 44, 'Efectivo Final:')            
            doc.text(81, 44, '$ ' + this.globalHelperFixeDecimalMoney(this.caja.attributes.dinero_final), {align: 'right'})

            
        },


        fixeDecimalCantidad(valor) {
            return Number(valor).toFixed(2)
        },


        fixeDecimalMoney(valor) {
            return Number(valor).toFixed(2)
        },


    }

}
</script>

<style>

</style>