<template>
    <div class="pa-sm-3" v-if="item">
        <v-row>
            <v-col cols="12" md="9">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <div class="">
                            <span class="text-h4 font-weight-light">Orden de Compra</span>

                            
                        </div>
                        
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        
                        <v-row>
                            <v-col cols="12">
                                <ItemsPurchaseorder 
                                    v-if="item.relationships.purchaseorderitems"
                                /> 
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="d-flex justify-end">
                                <PurchaseorderPDF
                                    :purchaseorder="item"
                                    class="mr-auto"
                                />
                                <v-btn
                                    @click="delete_purchaseorder"
                                    color="warning"
                                    text
                                >
                                    Eliminar
                                </v-btn>
                                <v-btn                                    
                                    @click="save_purchaseorder"
                                    color="success"
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
                <v-row>
                    <v-col>
                        <PurchaseorderSupplier
                            :supplier="item.relationships.supplier"
                         />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <PurchaseorderUser
                            :user="item.relationships.user"
                         />
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <PurchaseorderTotal 
                            :purchaseorder="item"
                        />
                    </v-col>
                </v-row>
                
            </v-col>

        </v-row>

    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import ItemsPurchaseorder from '@/components/admin/purchaseorders/purchaseorder/ItemsPurchaseorder'
import PurchaseorderSupplier from '@/components/admin/purchaseorders/purchaseorder/PurchaseorderSupplier'
import PurchaseorderUser from '@/components/admin/purchaseorders/purchaseorder/PurchaseorderUser'
import PurchaseorderTotal from '@/components/admin/purchaseorders/purchaseorder/PurchaseorderTotal'
import PurchaseorderPDF from '@/components/admin/purchaseorders/purchaseorder/pdf/PurchaseorderPDF'
export default {
    created() {
        if ( !this.item || !this.item.relationships.purchaseorderitems ) {
            this.buscar()
        }
    },
    data() {
        return {
            is_registrandoOrder: false
        }
    },
    components: {
        ItemsPurchaseorder,
        PurchaseorderPDF,
        PurchaseorderUser,
        PurchaseorderSupplier,
        PurchaseorderTotal
    },
    computed: {
        ...mapGetters({
            item: 'purchaseorders_manager/item'
        })
    },
    methods: {
        ...mapActions({
            buscar_item: 'purchaseorders_manager/buscar_item',
            set_item: 'purchaseorders_manager/set_item',
            save_item: 'purchaseorders_manager/save_item',
            detele_item: 'purchaseorders_manager/detele_item',
            unset_item: 'purchaseorders_manager/unset_item',

        }),

        volver ( ) {
            this.$router.replace({
                name: 'purchaseorders'
            })
        },
        buscar () {
            this.buscar_item(this.$route.params.id)
                .then((resp) => {
                    if ( !this.item ) {
                        this.set_item(resp.data.data)
                    }else {
                        this.$set(this.item.relationships, 'purchaseorderitems', resp.data.data.relationships.purchaseorderitems)
                    }
                    
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        save_purchaseorder () {
            this.save_item()
                .then(() => {
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                })
                .catch((error) => {
                    console.log(error)
                    this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                })
        },
        delete_purchaseorder () {
            this.detele_item()
                .then(() => {
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 })
                    this.unset_item()
                    this.volver()
                })
                .catch((error) => {
                    console.log(error)
                    this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                })
        }
    }
}
</script>

<style>

</style>