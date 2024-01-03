<template>
  <div class="pa-sm-3" >
        <v-row  >
            <v-col cols="12" >
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center">
                            <v-row>
                                <v-col cols="12" md="6">
                                    <template>                
                                        <span class="text-h4 font-weight-light">Dashboard</span>
                                    </template>
                                </v-col>
                                <v-col cols="8" md="4" class="d-flex align-center">
                                    <v-select
                                        dense
                                        :items="sucursals_select"
                                        item-text="name"
                                        item-value="id"
                                        v-model="sucursal_id"
                                        :menu-props="{ offsetY: true }"
                                        hide-details=""
                                        label="Sucursal"
                                        clearable
                                        
                                        :disabled="this.user.role !== 'ADMINISTRADOR'"
                                    >
                                    </v-select>
                                </v-col>
                                <v-col cols="4" md="2" class="d-flex justify-space-around">
                                    <v-btn @click="handleChangeRange('today')" :dark="range === 'today'" :color="range === 'today' ? 'blue darken-1' : ''">Hoy</v-btn>
                                    <v-btn @click="handleChangeRange('month')" :dark="range === 'month'" :color="range === 'month' ? 'blue darken-1' : ''">Mes</v-btn>
                                </v-col>
                            </v-row>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text  v-if="!data" class="d-flex justify-center">
                        <v-progress-circular
                            :width="3"
                            color="green"
                            indeterminate
                            style="margin-top: 30vh; margin-bottom: 30vh;"
                        ></v-progress-circular>
                    </v-card-text>
                    <v-card-text v-else >
                        <v-row>
                            <v-col>
                                <Resumen
                                    :venta_total="data.venta_total"
                                    :facturacion="data.facturacion"    
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" lg="4">
                                <ChartVentaPorTipoCliente 
                                    :venta_total_mayorista="data.venta_total_mayorista"
                                    :venta_total_minorista="data.venta_total_minorista"
                                />
                            </v-col>
                            <v-col cols="12" lg="8">
                                <ChartRankingVendedores 
                                    :users="data.users"
                                />
                            </v-col>
                        </v-row>
                        
                    </v-card-text>
                </v-card>
            </v-col>
            
            
        </v-row>
        
        
    </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

import Resumen from '@/components/admin/dashboard/Resumen';
import ChartVentaPorTipoCliente from '@/components/admin/dashboard/ChartVentaPorTipoCliente';
import ChartRankingVendedores from '@/components/admin/dashboard/ChartRankingVendedores';
export default {
    created() {
        if ( this.user.role !== 'ADMINISTRADOR') this.sucursal_id = this.sucursal.id;
        this.search();
    },
    data() {
        return {
            range: 'today',
            sucursal_id: null,
            loading: false,
            data: null,
        }   
    },
    components: {
        Resumen,
        ChartVentaPorTipoCliente,
        ChartRankingVendedores,
    },
    computed: {
        ...mapGetters({
            sucursal: 'sucursals_manager/sucursal',
            sucursals_select: 'sucursals_manager/sucursals_select',
            user: 'auth/user',            
        })
    },

    methods: {
        handleChangeRange(range){
            this.range = range;
            this.search();
        }, 
        search () {
            this.data = null;

            axios.get(`/dashboard/ventas_dia?range=${this.range}`)
                .then((resp) => {
                    this.data = resp.data.dashboard;
                })
        }
    }
}
</script>

<style>

</style>