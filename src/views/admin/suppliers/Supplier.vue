<template>
  <div class="pa-sm-3" v-if="item" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <template >                
                            <span class="text-h4 font-weight-light">Proveedor: {{ item.attributes.name }}</span>
                        </template>
                        <div>
                        <v-tabs>
                            <v-tab @click="tab_showed = 'resumen'">Resumen</v-tab>
                            <v-tab @click="tab_showed = 'purchaseproducts'">Productos Compra</v-tab>
                            <v-tab @click="tab_showed = 'lista_precios'">Actualizar Lista</v-tab>
                        </v-tabs>
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <Resumen
                            v-if="tab_showed == 'resumen'"
                            @volver="volver"
                        />
                        <Purchaseproducts
                            v-if="tab_showed == 'purchaseproducts'"
                            @volver="volver"
                            @reload_item="buscar"
                        />
                        <ListaPrecios
                            v-if="tab_showed == 'lista_precios'"
                            @volver="volver"
                        />

                    </v-card-text>
                </v-card>
            </v-col>
            
        </v-row>
        
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Resumen from '@/components/admin/suppliers/supplier/Resumen'
import Purchaseproducts from '@/components/admin/suppliers/supplier/Purchaseproducts'
import ListaPrecios from '@/components/admin/suppliers/supplier/ListaPrecios'

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
            tab_showed: 'resumen'
        }
    },
    components: {
        Resumen,
        Purchaseproducts,
        ListaPrecios,
    },
    computed: {
        ...mapGetters({
            item: 'suppliers_manager/item'
        })
    },
    methods: {
        ...mapActions({
            buscar_item: 'suppliers_manager/buscar_item',
            set_item: 'suppliers_manager/set_item',
        }),

        volver ( ) {
            this.$router.replace({
                name: 'suppliers'
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