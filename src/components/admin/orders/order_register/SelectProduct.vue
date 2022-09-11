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
import SelectProductModal from '@/components/admin/orders/order_register/selectProductModal.vue'
import selectProductCantidadModal from '@/components/admin/orders/order_register/selectProductCantidadModal.vue'
import selectProductCantidadCompletoModal from '@/components/admin/orders/order_register/selectProductCantidadCompletoModal'

import axios from 'axios'

import { mapGetters, mapActions } from 'vuex'
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
    computed: {
        ...mapGetters({
            orderActive: 'order_manager/orderActive',
        })
    },
    methods: {
        ...mapActions({
            add_item: 'order_manager/add_item',
            add_combo_item: 'order_manager/add_combo_item',
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

        sale_has_saleproduct ( saleproduct_id  ) {
            for ( let item of this.orderActive.items ) {
                if ( item.saleProductId == saleproduct_id ) {
                    return true
                }
            }
            return false
        },

        addItem (item) {
            this.selectProductCantidadModalVisible = false
            this.selectProductCantidadModalCompletoVisible = false
            this.itemSelected = null
            this.barcode = ''
            if ( !this.sale_has_saleproduct(item.saleProductId) ) {
                this.add_item(item)
            }else {
                this.$toast.error('El producto seleccionado ya se encuentra en la venta actual.', { timeout: 3000 });
            }
            this.setFocusBarcode()
        },

        sale_has_combo ( combo_id  ) {
            for ( let comboitem of this.orderActive.comboitems ) {
                if ( comboitem.comboId == combo_id ) {
                    return true
                }
            }
            return false
        },

        addComboItem (item) {
            this.selectProductCantidadModalVisible = false
            this.itemSelected = null
            if ( !this.sale_has_combo(item.comboId) ) {
                this.add_combo_item(item)
            }else {
                this.$toast.error('El Combo seleccionado ya se encuentra en la venta actual.', { timeout: 3000 });
            }
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