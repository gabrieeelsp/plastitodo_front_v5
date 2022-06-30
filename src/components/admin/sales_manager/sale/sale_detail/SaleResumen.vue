<template>
    <div>
        <v-row class="mt-0">
            <v-col cols="7" class="d-flex align-start flex-column pb-0">
                <v-btn text @click="create_devolution" >CREAR DEVOLUCION</v-btn>
                <v-btn text @click="create_creditnote" >CREAR Nota de crédito</v-btn>
                <v-btn text @click="create_debitnote" >CREAR Nota de Débito</v-btn>
            </v-col>
            <v-col cols="5">
                <div class=" d-flex justify-end">
                    <span class="title ">Total:</span>
                    <span class="headline  blue--text darken-4 ml-1">{{ globalHelperFixeDecimalMoney(sale.attributes.total) | money_string }}</span>
                </div>
                <div class=" d-flex justify-space-between"
                >
                    <span class="subtitle-1">Pago Total:</span>
                    <span class="subtitle-1  blue--text darken-4 ml-1">({{ globalHelperFixeDecimalMoney(totalPagosSale) | money_string }})</span>
                </div>
                <div v-for="(devolution, index) in sale.relationships.devolutions" :key="index">

                
                    <div class=" d-flex justify-space-between" >
                        <span class="subtitle-1">Devolución #{{devolution.id}}:</span>
                        <span class="subtitle-1  blue--text darken-4 ml-1">({{ globalHelperFixeDecimalMoney(devolution.attributes.total) | money_string }})</span>
                    </div>
                </div >
                <div v-for="(creditnote, index) in sale.relationships.creditnotes" :key="'A' + index">                
                    <div class=" d-flex justify-space-between" >
                        <span class="subtitle-1">Nota de Crédito #{{creditnote.id}}:</span>
                        <span class="subtitle-1  blue--text darken-4 ml-1">({{ globalHelperFixeDecimalMoney(creditnote.attributes.total) | money_string }})</span>
                    </div>
                </div >
                <div v-for="(debitnote, index) in sale.relationships.debitnotes" :key="'B' + index">                
                    <div class=" d-flex justify-space-between" >
                        <span class="subtitle-1">Nota de Débito #{{debitnote.id}}:</span>
                        <span class="subtitle-1  blue--text darken-4 ml-1">{{ globalHelperFixeDecimalMoney(debitnote.attributes.total) | money_string }}</span>
                    </div>
                </div >
                <div v-if="totalRefundsSale != 0" class=" d-flex justify-space-between" >
                    <span class="subtitle-1">Reintegro:</span>
                    <span class="subtitle-1  blue--text darken-4 ml-1">{{ globalHelperFixeDecimalMoney(totalRefundsSale ) | money_string }}</span>
                </div>
                <div class=" d-flex justify-end">
                    <span class="title ">Saldo:</span>
                    <span class="headline  blue--text darken-4 ml-1">{{ globalHelperFixeDecimalMoney(saldoTotalSale) | money_string }}</span>
                </div>
            </v-col>
        </v-row>
        {{ sale.relationships.payments }}
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
export default {

    computed: {
        ...mapGetters({
            sale: 'sales_manager/sale',
            saldoTotalSale: 'sales_manager/saldoTotalSale',
            totalPagosSale: 'sales_manager/totalPagosSale',
            totalRefundsSale: 'sales_manager/totalRefundsSale',
        })
    },

    methods: {
        ...mapActions({
            new_devolution: 'sales_manager/new_devolution',
            new_creditnote: 'sales_manager/new_creditnote',
            new_debitnote: 'sales_manager/new_debitnote'
        }),

        async create_devolution () {
            await this.new_devolution()

            this.$emit('showDevolutionEditingDetailMethod')
        },
        create_creditnote () {
            this.new_creditnote ()
            this.$emit('showCreditnoteEditingDetailMethod')
        },
        create_debitnote () {
            this.new_debitnote ()
            this.$emit('showDebitnoteEditingDetailMethod')
        }
    }
}
</script>

<style>

</style>