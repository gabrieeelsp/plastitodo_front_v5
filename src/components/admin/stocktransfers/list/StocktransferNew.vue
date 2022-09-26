<template>
    <div>
        <selectSucursalModal 

                @set="selectSucursalModalSET"
                :btn_data="{
                    name:'Nuevo',
                    color: 'success' 
                }"
            />
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import selectSucursalModal from '@/components/admin/sucursals/selectSucursalModal'
export default {
    components: {
        selectSucursalModal,
    },
    data() {
        return {
            sucursal_selected: null,
        }
    },

    methods: {

        ...mapActions({
            item_new: 'stocktransfers_manager/item_new',
            add_item: 'stocktransfers_manager/add_item',
            set_item: 'stocktransfers_manager/set_item'
        }),

        selectSucursalModalSET (item) {
            this.sucursal_selected = item
            this.item_new({sucursal_destino_id: this.sucursal_selected.id})
                .then((resp) => {
                    //console.log(resp.data.data)
                    this.add_item(resp.data.data)
                    this.set_item(resp.data.data)
                    this.$router.replace({
                        name: 'stocktransfer',
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