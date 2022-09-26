<template>
  <div class="pa-sm-3" v-if="item" >
        <v-row>
            <v-col cols="12" md="9">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <template v-if="item.attributes.tipo_persona == 'FISICA'" >                
                            <span class="text-h4 font-weight-light">Cliente: {{ item.attributes.name }} {{ item.attributes.surname }}</span>
                        </template>
                        <template v-else >                
                            <span class="text-h4 font-weight-light">Cliente: {{ item.attributes.name }}</span>
                        </template>
                        <div>
                        <v-tabs>
                            <v-tab @click="tab_showed = 'resumen'">Resumen</v-tab>
                            <v-tab @click="tab_showed = 'facturacion'">Facturación</v-tab>
                            <v-tab @click="tab_showed = 'movimientos'">Movimientos</v-tab>
                        </v-tabs>
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <Resumen
                            v-if="tab_showed == 'resumen'"
                            @volver="volver"
                        />
                        <Facturacion
                            v-if="tab_showed == 'facturacion'"
                            @volver="volver"
                        />
                        <Movimientos
                            v-if="tab_showed == 'movimientos'"
                            @volver="volver"
                        />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-row>
                    <v-col>
                        <SaldoClient
                            :client="item"
                         />
                    </v-col>
                </v-row>
                
            </v-col>
            
        </v-row>
        
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Resumen from '@/components/admin/clients/client/Resumen'
import Facturacion from '@/components/admin/clients/client/Facturacion'
import Movimientos from '@/components/admin/clients/client/Movimientos'

import SaldoClient from '@/components/admin/clients/client/SaldoClient'
export default {
    created() {
        if ( this.item == null ) {
            this.buscar_item(this.$route.params.id)
                .then((resp) => {
                    this.set_item(resp.data.data)
                    console.log(resp.data.data)
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
        Facturacion,
        Movimientos,

        SaldoClient,
    },
    computed: {
        ...mapGetters({
            item: 'clients_manager/item'
        })
    },
    methods: {
        ...mapActions({
            buscar_item: 'clients_manager/buscar_item',
            set_item: 'clients_manager/set_item',
        }),

        volver ( ) {
            this.$router.replace({
                name: 'clients'
            })
        }
    }
}
</script>

<style>

</style>