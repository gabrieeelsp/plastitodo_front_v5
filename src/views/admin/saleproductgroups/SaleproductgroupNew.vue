<template>
  <div class="pa-sm-3" v-if="item_cache_new" >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center">
                                      
                        <span class="text-h4 font-weight-light">Gestión de Grupos Productos Venta</span>
                        
                        <div>
                        <v-tabs>
                            <v-tab @click="tab_showed = 'resumen'">Resumen</v-tab>                            
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

import Resumen from '@/components/admin/saleproductgroups/saleproductgroup/ResumenNew'
import { mapActions, mapGetters } from 'vuex'
export default {
    mounted() {
        this.new_item()
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
            item_cache_new: 'saleproductgroups_manager/item_cache_new',
        })
    },
    methods: {
        ...mapActions({
            new_item: 'saleproductgroups_manager/new_item',
        }),
        volver ( ) {
            this.$router.replace({
                name: 'saleproductgroups'
            })
        }
    }
}
</script>

<style>

</style>