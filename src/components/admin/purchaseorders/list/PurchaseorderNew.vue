<template>
    <div>
        <selectSupplierModal 

                @set="selectSupplierModalSET"
                :btn_data="{
                    name:'Nuevo',
                    color: 'success' 
                }"
            />
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import selectSupplierModal from '@/components/admin/suppliers/selectSupplierModal'
export default {
    components: {
        selectSupplierModal,
    },
    data() {
        return {
            supplier_selected: null,
        }
    },

    methods: {

        ...mapActions({
            item_new: 'purchaseorders_manager/item_new',
            add_item: 'purchaseorders_manager/add_item',
            set_item: 'purchaseorders_manager/set_item'
        }),

        selectSupplierModalSET (item) {
            this.supplier_selected = item
            this.item_new({supplier_id: this.supplier_selected.id})
                .then((resp) => {
                    
                    this.add_item(resp.data.data)
                    this.set_item(resp.data.data)
                    this.$router.replace({
                        name: 'purchaseorder',
                        params: {
                            id: resp.data.data.id
                        }
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        },  

    }
}
</script>

<style>

</style>