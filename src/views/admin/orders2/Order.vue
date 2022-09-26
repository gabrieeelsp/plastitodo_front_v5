<template>
    <div class="pa-sm-3" v-if="item_cache">
        <v-row>
            <v-col cols="12" md="9">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <div class="">
                            <span class="text-h4 font-weight-light">Order Register</span>

                            
                        </div>
                        
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <v-row>
                            <v-col class="d-flex justify-end">
                                
                                <v-spacer></v-spacer>
                                

                                
                                <v-btn
                                        :disabled="!true"
                                        
                                        @click="saveOrder('GUARDAR')"
                                        color="success"
                                        class="ml-1"
                                        :loading="is_registrandoOrder"
                                    >
                                        
                                        Guardar
                                        <v-icon right>
                                            mdi-content-save-outline
                                        </v-icon>
                                    </v-btn>
                                
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-row class="">
                    <v-col cols="12">
                        <MenuClientOrder  />
                    </v-col>
                    <v-col cols="12">
                        <OrderUser />
                    </v-col>
                    <v-col cols="12">
                        
                    </v-col>
                    <v-col cols="12">
                        <SucursalOrder />
                    </v-col>
                    <v-col cols="12">
                        
                            
                        
                    </v-col>
                    <v-col cols="12">
                        <TotalOrder />
                    </v-col>
                </v-row>
                
            </v-col>

        </v-row>

    </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MenuClientOrder from '@/components/admin/orders2/order/MenuClientOrder'
import OrderUser from '@/components/admin/orders2/order/OrderUser'
import SucursalOrder from '@/components/admin/orders2/order/SucursalOrder.vue'
import TotalOrder from '@/components/admin/orders2/order/TotalOrder.vue'

export default {
    created() {
        if ( this.item == null ) {
            this.buscar_item(this.$route.params.id)
                .then((resp) => {
                    this.set_item(resp.data.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    },
    data() {
        return {
            is_registrandoOrder: false,
        }
    },
    components: {
        MenuClientOrder,
        OrderUser,
        SucursalOrder,
        TotalOrder,
    },
    computed: {
        ...mapGetters({
            item_cache: 'orders_manager/item_cache',
            item: 'orders_manager/item',
        })
    },
    methods: {
        ...mapActions({
            buscar_item: 'orders_manager/buscar_item',
            set_item: 'orders_manager/set_item',

            save_order: 'orders_manager/save_order',
        }),

        volver ( ) {
            this.$router.replace({
                name: 'orders'
            })
        },
        buscar () {
            this.buscar_item(this.$route.params.id)
                .then((resp) => {
                    this.set_item(resp.data.data)
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        async saveOrder(evento) {
            this.is_registrandoOrder = true
            await this.save_order(evento)
                .then(() => {
                    //console.log(resp.data.data)

                    //this.orderActive.created_at = resp.data.data.attributes.created_at                                    
                    
                    
                    //this.orderActive.state = resp.data.data.attributes.state                     

                    this.$toast.success('Los cambios se han registrado correctamente.', { timeout: 3000 });
                })  
                .catch((error) => {
                    console.log(error)
                    this.$toast.error(error.response.data.message, { timeout: 3000 });
                }).finally(() =>{
                    this.is_registrandoOrder = false
                })        
            
        },
    }
}
</script>

<style>

</style>