<template>
    <div class="d-flex justify-start">
        <v-text-field
            :disabled="disabled"
            
            dense
            ref="barcode_text"
            v-model="barcode"
            @keyup.enter="buscar_item"
        ></v-text-field>
        
        <SelectProductModal 
            :disabled="disabled"
            @set="selectProductModalSET"/>
        <selectProductCantidadModal
            v-if="itemSelected && selectProductCantidadModalVisible" 
            :item="itemSelected"
            :dialogVisible="selectProductCantidadModalVisible"
            @close="selectProductCantidadModalClose"
            @addItem="addItem"
            @addComboItem="addComboItem"
             />

        <selectProductCantidadCompletoModal
            :dialogVisible="selectProductCantidadModalCompletoVisible"
            :item="itemSelected"
            v-if="itemSelected && selectProductCantidadModalCompletoVisible" 
            @close="selectProductCantidadModalCompletoClose"
            @addItem="addItem"
        />
    </div>
</template>

<script>
import SelectProductModal from '@/components/admin/sales/sale_register/selectProductModal.vue'
import selectProductCantidadModal from '@/components/admin/sales/sale_register/selectProductCantidadModal.vue'
import selectProductCantidadCompletoModal from '@/components/admin/sales/sale_register/selectProductCantidadCompletoModal'

import axios from 'axios'

import { mapActions } from 'vuex'
export default {
    mounted() {
        this.onload()
    },
    components: {
        SelectProductModal,
        selectProductCantidadModal,
        selectProductCantidadCompletoModal
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
            add_item: 'sale_manager/add_item',
            add_combo_item: 'sale_manager/add_combo_item',
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

        addItem (item) {
            this.selectProductCantidadModalVisible = false
            this.selectProductCantidadModalCompletoVisible = false
            this.itemSelected = null
            this.barcode = ''
            this.add_item(item)
            this.setFocusBarcode()
        },

        addComboItem (item) {
            this.selectProductCantidadModalVisible = false
            this.itemSelected = null
            this.add_combo_item(item)
            this.setFocusBarcode()
        },

        selectProductModalCompletoSET (item) {
            this.itemSelected = item
            this.selectProductCantidadModalCompletoVisible = true
        },
        selectProductCantidadModalCompletoClose () {
            this.selectProductCantidadModalCompletoVisible = false
            this.itemSelected = null,
            this.barcode = ''
            this.setFocusBarcode()
            
            // other code
        },

        buscar_item () {
            if ( this.barcode != '' ) {
                axios.get('saleproducts/search_barcode', {
                    params: {
                        barcode: this.barcode
                    }
                })
                .then((resp) => {
                    this.selectProductModalCompletoSET(resp.data.data)
                })
                .catch(() => {
                    this.$toast.error('Código no reconocido.', { timeout: 3000 });
                    this.barcode = ''
                })
            }
            
            
        },
        onload () {           
            this.setFocusBarcode()
        },
        setFocusBarcode() {
            setTimeout(() => {
                this.$refs.barcode_text.focus();
            }, 200)
            
        }, 
    }

}
</script>

<style>

</style>