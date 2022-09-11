<template>
  <div class="pa-sm-3" v-if="item" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <span class="text-h4 font-weight-light">Sucursals: {{ item.attributes.name }}</span>
                        <div>
                        <v-tabs>
                            <v-tab @click="tab_showed = 'resumen'">Resumen</v-tab>
                            <v-tab @click="tab_showed = 'movimientos'">Movimientos Stock</v-tab>
                        </v-tabs>
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <Resumen
                            v-if="tab_showed == 'resumen'"
                            @volver="volver"
                        />
                        <Movimientos
                            v-if="tab_showed == 'movimientos'"
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
import Resumen from '@/components/admin/sucursals/sucursal/Resumen'
import Movimientos from '@/components/admin/sucursals/sucursal/Movimientos'
export default {
    created() {
        if ( this.item == null ) {
            this.buscar_item(this.$route.params.id)
                .then((resp) => {
                    this.set_item(resp)
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
        Movimientos
    },
    computed: {
        ...mapGetters({
            item: 'sucursals_manager/item'
        })
    },
    methods: {
        ...mapActions({
            buscar_item: 'sucursals_manager/buscar_item',
            set_item: 'sucursals_manager/set_item',
        }),

        volver ( ) {
            this.$router.replace({
                name: 'sucursals'
            })
        }
    }
}
</script>

<style>

</style>