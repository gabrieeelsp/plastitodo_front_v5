<template>
    <div>
        <selectClientModal 

                @set="selectClientModalSET"
                :btn_data="{
                    name:'Nuevo',
                    color: 'success' 
                }"
            />
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import selectClientModal from '@/components/admin/clients/selectClientModal'
export default {
    components: {
        selectClientModal,
    },
    data() {
        return {
            client_selected: null,
        }
    },

    methods: {

        ...mapActions({
            item_new: 'orders_manager/item_new',
            add_item: 'orders_manager/add_item',
            set_item: 'orders_manager/set_item'
        }),

        selectClientModalSET (item) {
            this.client_selected = item
            this.item_new({client_id: this.client_selected.id})
                .then((resp) => {
                    
                    this.add_item(resp.data.data)
                    this.set_item(resp.data.data)
                    this.$router.replace({
                        name: 'order',
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