<template>
    <div>
        <v-row>
            <v-col cols="12" class="d-flex justify-space-between">
                <div>
                        <v-btn @click="showSaleDetailMethod" text
                            :plain="!is_show_sale"
                         >Venta #{{ sale.id }}</v-btn>
                        <v-btn
                            v-for="(devolution, index) in sale.relationships.devolutions" :key="index"
                            text
                            color="red"
                            :plain="!(devolutionShowed && devolutionShowed.id == devolution.id)"
                            class="red--text "
                            @click="showDevolutionDetailMethod(devolution)"
                            
                        >
                            Devolucion #{{ devolution.id }}
                        </v-btn>
                        <v-btn
                            v-if="devolution_editing"
                            text
                            :plain="is_show_devolution_editing"
                            class="red--text text--lighten-2"
                            @click="showDevolutionEditingDetailMethod"
                        >
                            Nueva devolución
                        </v-btn>

                        <v-btn
                            v-for="(creditnote, index) in sale.relationships.creditnotes" :key="'A' + index"
                            text
                            color="red"
                            :plain="!(creditnoteShowed && creditnoteShowed.id == creditnote.id)"
                            class="red--text "
                            @click="showCreditnoteDetailMethod(creditnote)"
                            
                        >
                            Nota de Crédito #{{ creditnote.id }}
                        </v-btn>

                        <v-btn
                            v-if="creditnote_editing"
                            text
                            :plain="is_show_creditnote_editing"
                            class="red--text text--lighten-2"
                            @click="showCreditnoteEditingDetailMethod"
                        >
                            Nueva Nota de Crédito
                        </v-btn>

                        <v-btn
                            v-for="(debitnote, index) in sale.relationships.debitnotes" :key="'B' + index"
                            text
                            color="red"
                            :plain="!(debitnoteShowed && debitnoteShowed.id == debitnote.id)"
                            class="red--text "
                            @click="showDebitnoteDetailMethod(debitnote)"
                            
                        >
                            Nota de Débito #{{ debitnote.id }}
                        </v-btn>

                        <v-btn
                            v-if="debitnote_editing"
                            text
                            :plain="is_show_debitnote_editing"
                            class="red--text text--lighten-2"
                            @click="showDebitnoteEditingDetailMethod"
                        >
                            Nueva Nota de Débito
                        </v-btn>

                </div>
                <div>
                        <v-btn @click="volver" >Volver</v-btn>
                </div>
            </v-col>
        </v-row>
        <SaleDetail 
            v-if="is_show_sale"
            @showDevolutionEditingDetailMethod="showDevolutionEditingDetailMethod"
            @showCreditnoteEditingDetailMethod="showCreditnoteEditingDetailMethod"
            @showDebitnoteEditingDetailMethod="showDebitnoteEditingDetailMethod"
        />

        <DebitnoteDetail 
            v-if="is_show_debitnote"  
            :debitnote="debitnoteShowed"  
        />
        
        <CreditnoteDetail 
            v-if="is_show_creditnote"  
            :creditnote="creditnoteShowed"  
        />

        <DebitnoteEditingDetail 
            v-if="is_show_debitnote_editing"  
            @finalizar_debitnote='finalizar_debitnote'
            @cancelar_debitnote="cancelar_debitnote"
        />

        <CreditnoteEditingDetail 
            v-if="is_show_creditnote_editing"  
            @finalizar_creditnote='finalizar_creditnote'
            @cancelar_creditnote="cancelar_creditnote"
        />

        <DevolutionEditingDetail 
            v-if="is_show_devolution_editing"  
            @finalizar_devolution='finalizar_devolution'
            @cancelar_devolution="cancelar_devolution"
        />

        <DevolutionDetail 
            v-if="is_show_devolution"  
            :devolution="devolutionShowed"  
        />
        
        
    
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

import SaleDetail from '@/components/admin/sales_manager/sale/SaleDetail'

import DebitnoteDetail from '@/components/admin/sales_manager/sale/DebitnoteDetail'
import CreditnoteDetail from '@/components/admin/sales_manager/sale/CreditnoteDetail'
import DebitnoteEditingDetail from '@/components/admin/sales_manager/sale/DebitnoteEditingDetail'
import CreditnoteEditingDetail from '@/components/admin/sales_manager/sale/CreditnoteEditingDetail'
import DevolutionEditingDetail from '@/components/admin/sales_manager/sale/DevolutionEditingDetail'
import DevolutionDetail from '@/components/admin/sales_manager/sale/DevolutionDetail'

export default {
    data() {
        return {
            is_show_sale: true,
            is_show_devolution: false,
            is_show_devolution_editing: false,
            is_show_creditnote: false,
            is_show_creditnote_editing: false,
            is_show_debitnote: false,
            is_show_debitnote_editing: false,

            devolutionShowed: null,

            creditnoteShowed: null,

            debitnoteShowed: null
        }
    },
    computed: {
        ...mapGetters({
            sale: 'sales_manager/sale',
            devolution_editing: 'sales_manager/devolution_editing',
            creditnote_editing: 'sales_manager/creditnote_editing',
            debitnote_editing: 'sales_manager/debitnote_editing',
        }),
    },
    components: {
        SaleDetail,
        DebitnoteDetail,
        CreditnoteDetail,

        DebitnoteEditingDetail,
        CreditnoteEditingDetail,
        DevolutionEditingDetail,
        DevolutionDetail
    },
    methods: {
        ...mapActions({
            add_devolution: 'sales_manager/add_devolution',
            set_devolution_editing: 'sales_manager/set_devolution_editing',
            add_creditnote: 'sales_manager/add_creditnote',
            set_creditnote_editing: 'sales_manager/set_creditnote_editing',
            add_debitnote: 'sales_manager/add_debitnote',
            set_debitnote_editing: 'sales_manager/set_debitnote_editing',
        }),

        volver () {
            this.$emit('cancel_show_sale')
        },

        showSaleDetailMethod() {
            this.devolutionShowed = null
            this.is_show_devolution = false
            this.is_show_devolution_editing = false 
            this.is_show_creditnote_editing = false 
            this.is_show_creditnote = false
            this.is_show_debitnote_editing = false 
            this.is_show_debitnote = false
            this.is_show_sale = true            
        },

        showDevolutionDetailMethod(devolution) {
            //console.log(devolution)
            this.devolutionShowed = devolution
            this.is_show_sale = false
            this.is_show_devolution_editing = false 
            this.is_show_creditnote_editing = false
            this.is_show_creditnote = false
            this.is_show_debitnote_editing = false 
            this.is_show_debitnote = false
            this.is_show_devolution = true  
        },

        showDevolutionEditingDetailMethod() {
            this.is_show_sale = false
            this.is_show_devolution = false
            this.is_show_creditnote_editing = false
            this.is_show_creditnote = false
            this.is_show_debitnote_editing = false 
            this.is_show_debitnote = false
            this.is_show_devolution_editing = true           
        },
        
        finalizar_devolution ( devolution ) {
            this.add_devolution(devolution)
            
            this.devolutionShowed = devolution
            this.is_show_sale = false
            this.is_show_devolution_editing = false
            this.is_show_creditnote_editing = false
            this.is_show_creditnote = false
            this.is_show_debitnote_editing = false 
            this.is_show_debitnote = false
            this.set_devolution_editing ( null )
            this.is_show_devolution = true            
        },
        cancelar_devolution ( ) {
            this.showSaleDetailMethod()
            this.set_devolution_editing ( null )
 
        },

        showCreditnoteDetailMethod(creditnote) {
            //console.log(devolution)
            this.creditnoteShowed = creditnote
            this.is_show_sale = false
            this.is_show_devolution_editing = false 
            this.is_show_creditnote_editing = false
            this.is_show_devolution = false 
            this.is_show_debitnote_editing = false 
            this.is_show_debitnote = false
            this.is_show_creditnote = true
                       
        },

        showCreditnoteEditingDetailMethod() {
            this.is_show_sale = false
            this.is_show_devolution = false
            this.is_show_devolution_editing = false 
            this.is_show_creditnote = false
            this.is_show_debitnote_editing = false 
            this.is_show_debitnote = false
            this.is_show_creditnote_editing = true                     
        },

        cancelar_creditnote ( ) {
            this.showSaleDetailMethod()
            this.set_creditnote_editing ( null )
        },
        finalizar_creditnote ( creditnote ) {
            this.add_creditnote ( creditnote )
            
            this.creditnoteShowed = creditnote
            this.is_show_sale = false
            this.is_show_devolution = false
            this.is_show_devolution_editing = false
            this.is_show_creditnote_editing = false 
            this.is_show_debitnote_editing = false 
            this.is_show_debitnote = false
            this.set_creditnote_editing ( null )
            this.is_show_creditnote = true
                       
        },

        showDebitnoteDetailMethod(debitnote) {
            //console.log(devolution)
            this.debitnoteShowed = debitnote
            this.is_show_sale = false
            this.is_show_devolution_editing = false 
            this.is_show_creditnote_editing = false
            this.is_show_devolution = false 
            this.is_show_debitnote_editing = false 
            this.is_show_creditnote = false
            this.is_show_debitnote = true
                       
        },

        showDebitnoteEditingDetailMethod() {
            this.is_show_sale = false
            this.is_show_devolution = false
            this.is_show_devolution_editing = false 
            this.is_show_creditnote = false
            this.is_show_creditnote_editing = false 
            this.is_show_debitnote = false
            this.is_show_debitnote_editing = true                     
        },

        cancelar_debitnote ( ) {
            this.showSaleDetailMethod()
            this.set_debitnote_editing ( null )
        },
        finalizar_debitnote ( debitnote ) {
            this.add_debitnote ( debitnote )
            
            this.debitnoteShowed = debitnote
            this.is_show_sale = false
            this.is_show_devolution = false
            this.is_show_devolution_editing = false
            this.is_show_creditnote_editing = false 
            this.is_show_debitnote_editing = false 
            this.is_show_creditnote = false
            this.set_debitnote_editing ( null )
            this.is_show_debitnote = true
                       
        },
    }
}
</script>

<style>

</style>