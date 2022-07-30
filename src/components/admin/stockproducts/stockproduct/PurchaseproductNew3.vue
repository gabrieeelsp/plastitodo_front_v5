<template>
    <div>
        <selectSupplierModal 

            @set="selectSupplierModalSET"
            :btn_data="{
                name:'Nuevo',
                color: 'success' 
            }"
        />

        <PurchaseproductNewData
            v-if="supplier_selected && PurchaseproductNewDataVisible"
            :dialogVisible="PurchaseproductNewDataVisible"
            @close="PurchaseproductNewDataClose"

            :supplier="supplier_selected"
            :stockproduct="stockproduct"

            @reload_item="reload_item"
        />
    </div>
</template>

<script>
import selectSupplierModal from '@/components/admin/suppliers/selectSupplierModal'
import PurchaseproductNewData from '@/components/admin/stockproducts/stockproduct/PurchaseproductNewData'
export default {

    components: {
        selectSupplierModal,
        PurchaseproductNewData,
    },
    props: {
        stockproduct: Object
    },

    data() {
        return {
            supplier_selected: null,
            PurchaseproductNewDataVisible: false
        }
    },

    methods: {
        selectSupplierModalSET (item) {
            this.supplier_selected = item
            this.PurchaseproductNewDataVisible = true
        },

        PurchaseproductNewDataClose () {
            this.PurchaseproductNewDataVisible = false
            this.supplier_selected = null
            // other code
        },

        reload_item () {
            this.$emit('reload_item')
        },

    }

}
</script>

<style>

</style>