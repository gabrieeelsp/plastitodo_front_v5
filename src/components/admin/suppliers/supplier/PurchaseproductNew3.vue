<template>
    <div>
        <SelectProductModal 

            @set="selectProductModalSET"
        />

        <PurchaseproductNewData
            v-if="stockproduct_selected && PurchaseproductNewDataVisible"
            :dialogVisible="PurchaseproductNewDataVisible"
            @close="PurchaseproductNewDataClose"

            :stockproduct="stockproduct_selected"
            :supplier="supplier"

            @reload_item="reload_item"
        />
    </div>
</template>

<script>
import SelectProductModal from '@/components/admin/stockproducts/selectProductModal'
import PurchaseproductNewData from '@/components/admin/suppliers/supplier/PurchaseproductNewData'
export default {

    components: {
        SelectProductModal,
        PurchaseproductNewData,
    },
    props: {
        supplier: Object
    },

    data() {
        return {
            stockproduct_selected: null,
            PurchaseproductNewDataVisible: false
        }
    },

    methods: {
        selectProductModalSET (item) {
            this.stockproduct_selected = item
            this.PurchaseproductNewDataVisible = true
        },

        PurchaseproductNewDataClose () {
            this.PurchaseproductNewDataVisible = false
            this.stockproduct_selected = null
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