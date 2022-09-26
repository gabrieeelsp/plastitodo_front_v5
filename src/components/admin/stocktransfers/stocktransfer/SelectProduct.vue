<template>
    <div class="d-flex justify-start">
        
        <SelectProductModal 
            @set="selectProductModalSET"
            :disabled="disabled"
            />
        <selectProductCantidadModal
            v-if="itemSelected && selectProductCantidadModalVisible" 
            :item="itemSelected"
            :dialogVisible="selectProductCantidadModalVisible"
            @close="selectProductCantidadModalClose"
            @addItem="addItem"
             />

    </div>
</template>

<script>
import SelectProductModal from '@/components/admin/stocktransfers/stocktransfer/selectProductModal.vue'
import selectProductCantidadModal from '@/components/admin/stocktransfers/stocktransfer/selectProductCantidadModal.vue'

import { mapActions } from 'vuex'
export default {

    components: {
        SelectProductModal,
        selectProductCantidadModal,    
    },
    props: {
        disabled: Boolean
    },

    data () {
        return {
            selectProductCantidadModalVisible: false,
            itemSelected: null,

            barcode: '',
            selectProductCantidadModalCompletoVisible: false,
        }
    },
    methods: {
        ...mapActions({
            add_subitem: 'stocktransfers_manager/add_subitem',
        }),
        selectProductModalSET (item) {
            this.itemSelected = item
            this.selectProductCantidadModalVisible = true
        },
        selectProductCantidadModalClose () {
            this.selectProductCantidadModalVisible = false
            this.itemSelected = null
            this.setFocusBarcode()
            // other code
        },

        addItem (item) {console.log(item)
            this.selectProductCantidadModalVisible = false
            this.selectProductCantidadModalCompletoVisible = false
            this.itemSelected = null
            this.barcode = ''
            this.add_subitem(item)
        },

    }

}
</script>

<style>

</style>