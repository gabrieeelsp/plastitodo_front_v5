<template>
  <div class="pa-sm-3" v-if="item" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <template >                
                            <span class="text-h4 font-weight-light">Etiqueta: {{ item.attributes.name }}</span>
                        </template>
                        <div>
                        <v-tabs>
                            <v-tab @click="tab_showed = 'resumen'">Resumen</v-tab>
                            <v-tab @click="tab_showed = 'saleproducts'">Productos Venta</v-tab>
                        </v-tabs>
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <Resumen
                            v-if="tab_showed == 'resumen'"
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
            this.$router.replace({
                name: 'catalogos'
            })
        },
        buscar () {
            this.buscar_item(this.$route.params.id)
                .then((resp) => {
                    if ( !this.item ) {
                        this.set_item(resp.data.data)
                    }else {
                        this.$set(this.item.relationships, 'saleproducts', resp.data.data.relationships.saleproducts)
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