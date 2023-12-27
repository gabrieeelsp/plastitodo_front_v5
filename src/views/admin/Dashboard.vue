<template>
  <div class="pa-sm-3" >
        <v-row>
            <v-col cols="12">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center">
                        <template>                
                            <span class="text-h4 font-weight-light">Dashboard Administrador</span>
                        </template>
                        <div>
                        <v-tabs>
                            <v-tab @click="tab_showed = 'today'">Hoy</v-tab>
                            <v-tab @click="tab_showed = 'month'">Mes</v-tab>
                        </v-tabs>
                        </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <Resumen
                            v-if="data"
                            :venta_total="data.venta_total"
                            :facturacion="data.facturacion"    
                        />
                    </v-card-text>
                </v-card>
            </v-col>
            
            
        </v-row>
        
    </div>
</template>

<script>
import axios from 'axios';
import Resumen from '@/components/admin/dashboard/Resumen'
export default {
    created() {
        this.loading = true;
        axios.get('/dashboard/ventas_dia')
            .then((resp) => {
                this.data = resp.data.dashboard;
                this.loading = false;
            })
    },
    data() {
        return {
            tab_showed: 'today',

            loading: false,
            data: null,
        }   
    },
    components: {
        Resumen,
    }
}
</script>

<style>

</style>