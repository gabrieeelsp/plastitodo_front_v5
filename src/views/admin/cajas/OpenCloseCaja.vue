<template>
    <div>
        <div class="pa-sm-3" v-if="caja" >
            <v-row>
                <v-col cols="12" md="12">
                    <v-card class="">
                        <v-card-title class="d-flex justify-space-between align-center">                                   
                            <span class="text-h4 font-weight-light">Cierre de Caja</span>  
                            <v-btn color="primary" @click="cerrarCaja" >Cerrar Caja</v-btn>                      
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text >
                            <Cierre 

                            />
                        </v-card-text>
                    </v-card>
                </v-col>
                
            </v-row>
            
        </div>
        <div class="pa-sm-3" v-else >
            <v-row>
                <v-col cols="12" md="12">
                    <v-card class="">
                        <v-card-title class="d-flex justify-space-between align-center">                                   
                            <span class="text-h4 font-weight-light">Apertura de Caja</span>  
                            <v-btn color="success" @click="abrirCaja" >Abrir Caja</v-btn>                        
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text >
                            <Apertura 

                            />
                        </v-card-text>
                    </v-card>
                </v-col>
                
            </v-row>
            
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Cierre from '@/components/admin/cajas/Cierre'
import Apertura from '@/components/admin/cajas/Apertura'
export default {
    created() {
        
    },
    data() {
        return {
            
        }
    },
    components: {
        Cierre,
        Apertura,
    },
    computed: {
        ...mapGetters({
            caja: 'cajas_manager/caja',
            caja_edit: 'cajas_manager/caja_edit',
        })
    },
    methods: {
        ...mapActions({
            cerrar_caja: 'cajas_manager/cerrar_caja',
            abrir_caja: 'cajas_manager/abrir_caja',
            set_caja: 'cajas_manager/set_caja',
        }),

        async cerrarCaja () {
            await this.cerrar_caja()
                .then((resp) => {
                    console.log(resp.data.data)
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                    this.set_caja(null)
                })
                .catch((error) => {
                    console.log(error)
                    this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                })
        },

        async abrirCaja () {
            await this.abrir_caja()
                .then((resp) => {
                    console.log(resp.data.data)
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                    this.set_caja(resp.data.data)
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