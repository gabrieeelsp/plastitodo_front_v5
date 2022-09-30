<template>
  <div class="pa-sm-3" v-if="item" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <template >                
                            <span class="text-h4 font-weight-light">Catalogo: {{ item.attributes.name }}</span>
                        </template>
                        <div>
                        <v-tabs>
                            <v-tab @click="tab_showed = 'resumen'">Resumen</v-tab>
                            <v-tab @click="tab_showed = 'saleproducts'">Productos Venta</v-tab>
                            <v-tab @click="tab_showed = 'clients'">Clientes</v-tab>
                        </v-tabs>
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <Resumen
                            v-if="tab_showed == 'resumen'"
                            @volver="volver"
                        />
                        <Saleproducts
                            v-if="tab_showed == 'saleproducts'"
                            @volver="volver"
                        />
                        <Clients
                            v-if="tab_showed == 'clients'"
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
import Resumen from '@/components/admin/catalogos/catalogo/Resumen'
import Saleproducts from '@/components/admin/catalogos/catalogo/Saleproducts.vue'
import Clients from '@/components/admin/catalogos/catalogo/Clients.vue'

export default {
    created() {
        if ( this.item == null || !this.item.relationships.saleproducts ) {
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
        Saleproducts,
        Clients,
    },
    computed: {
        ...mapGetters({
            item: 'catalogos_manager/item'
        })
    },
    methods: {
        ...mapActions({
            buscar_item: 'catalogos_manager/buscar_item',
            set_item: 'catalogos_manager/set_item',
        }),

        volver ( ) {
            this.item.relationships.saleproducts = null
            this.$router.replace({
                name: 'catalogos'
            })
        },
        buscar () {
            this.buscar_item(this.$route.params.id)
                .then((resp) => {
                    if ( !this.item ) {
                        //console.log(resp.data.data)
                        this.set_item(resp.data.data)
                    }else {
                        this.$set(this.item.relationships, 'saleproducts', resp.data.data.relationships.saleproducts)
                        this.$set(this.item.relationships, 'clients', resp.data.data.relationships.clients)
                    }

                    

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