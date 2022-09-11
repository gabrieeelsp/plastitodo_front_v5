<template>
    <div style="display: inline;" >
        <selectSaleProductModal
            :props_button="{icon: 'mdi-plus', button_icon: true, color: 'success'}"
            @set="addItem"
        />
    </div>
</template>

<script>
import selectSaleProductModal from '@/components/admin/saleproducts/selectSaleProductModal'
export default {
    props: {
        comboitem_id: Number
    },

    components: {
        selectSaleProductModal
    },
    methods: {
        addItem ( item ) {
            this.$emit('addSaleproduct', {
                comboitem_id: this.comboitem_id,
                saleproduct: item
            })
        }
    }

}
</script>

<style>

</style>