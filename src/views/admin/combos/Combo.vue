<template>
  <div class="pa-sm-3" v-if="item" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center">
                                      
                        <span class="text-h4 font-weight-light">Gestión de Combos</span>
                        
                        <div>
                        <v-tabs>
                            <v-tab @click="tab_showed = 'resumen'">Resumen</v-tab>
                            <v-tab @click="tab_showed = 'images'">Imágenes</v-tab>
                            <v-tab @click="tab_showed = 'configuracion'">Configuración</v-tab>
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

                        <Configuracion
                            v-if="tab_showed == 'configuracion'"
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
import Resumen from '@/components/admin/combos/combo/Resumen'
import Images from '@/components/admin/combos/combo/Images'
import Configuracion from '@/components/admin/combos/combo/Configuracion'

export default {
    created() {
        if ( this.item == null ) {
            this.buscar()
        }
    },
    data() {
        return {
            tab_showed: 'resumen',
            
        }
    },
    components: {
        Resumen,
        Images,
        Configuracion
    },
    computed: {
        ...mapGetters({
            item: 'combos_manager/item',
            item_cache: 'combos_manager/item_cache',
        })
    },
    methods: {
        ...mapActions({
            buscar_item: 'combos_manager/buscar_item',
            set_item: 'combos_manager/set_item',
        }),

        volver ( ) {
            this.$router.replace({
                name: 'combos'
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
    }
}
</script>

<style>

</style>