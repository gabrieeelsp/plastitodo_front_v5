<template>
  <div class="pa-sm-3" v-if="item" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center">
                                      
                        <span class="text-h4 font-weight-light">Gestión de Productos Stock</span>
                        
                        <div>
                        <v-tabs>
                            <v-tab @click="tab_showed = 'resumen'">Resumen</v-tab>
                            <v-tab @click="tab_showed = 'images'">Imágenes</v-tab>
                            <v-tab @click="tab_showed = 'saleproducts'">Productos Venta</v-tab>
                            <v-tab @click="tab_showed = 'purchaseproducts'">Productos Compra</v-tab>
                        </v-tabs>
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <Resumen
                            v-if="tab_showed == 'resumen'"
                            @volver="volver"
                        />
                        <Images
                            v-if="tab_showed == 'images'"
                            @volver="volver"
                        />
                        <Saleproducts
                            v-if="tab_showed == 'saleproducts'"
                            @volver="volver"
                            @reload_item="buscar"
                        />
                        <Purchaseproducts
                            v-if="tab_showed == 'purchaseproducts'"
                            @volver="volver"
                            @reload_item="buscar"
                        />
                        
                    </v-card-text>
                </v-card>
            </v-col>
            
        </v-row>
        
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Resumen from '@/components/admin/stockproducts/stockproduct/Resumen'
import Images from '@/components/admin/stockproducts/stockproduct/Images'
import Saleproducts from '@/components/admin/stockproducts/stockproduct/Saleproducts'
import Purchaseproducts from '@/components/admin/stockproducts/stockproduct/Purchaseproducts'

export default {
    created() {
        if ( this.item == null ) {
            this.buscar()
        }
    },
    data() {
        return {
            tab_showed: 'resumen'
        }
    },
    components: {
        Resumen,
        Images,
        Saleproducts,
        Purchaseproducts,
    },
    computed: {
        ...mapGetters({
            item: 'stockproducts_manager/item'
        })
    },
    methods: {
        ...mapActions({
            buscar_item: 'stockproducts_manager/buscar_item',
            set_item: 'stockproducts_manager/set_item',
        }),

        volver ( ) {
            this.$router.replace({
                name: 'stockproducts'
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
        }
    }
}
</script>

<style>

</style>