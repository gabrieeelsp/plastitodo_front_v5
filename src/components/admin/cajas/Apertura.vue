<template>
    <div>
        <v-row>
            <v-col sm="3">
                <v-row>
                    <v-col>
                        <v-card class="" outlined >
                            <v-card-title class="blue lighten-4 pt-1 pb-1 d-flex justify-center">
                                <span class="text-body-1 font-weight-medium">EFECTIVO</span>
                            </v-card-title>
                            <v-divider></v-divider>

                            <v-card-text class="pa-1">

                                <v-simple-table dense class="">
                                        <template v-slot:default>
                                        <tbody>
                                            
                                            <tr>
                                                <td class="pl-2">Recuento</td>
                                                <td></td>
                                                <td class="text-right">{{ globalHelperFixeDecimalMoney(recuento_efectivo) }}</td>
                                                
                                            </tr>
                                        </tbody>
                                        </template>
                                    </v-simple-table>
                                
                            </v-card-text>                    
                        </v-card>
                    </v-col>
                </v-row>
                
                
                
                
                             
            </v-col>
            <v-col>
                <v-card outlined>
                    <v-card-title class="blue lighten-4 pt-1 pb-1 d-flex justify-center">
                        <span class="text-body-1 font-weight-medium">EFECTIVO [ Recuento ]</span>
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-card-text>                       
                        <v-row class="mt-1">
                            <v-col sm="6">
                                <v-row v-for="valor in valors_list.filter((i) => { return i.valor.attributes.name.startsWith('B')}).sort((a, b) => b.valor.attributes.valor - a.valor.attributes.valor)" :key="'B'+valor.valor.id">
                                    <v-spacer></v-spacer>
                                    <v-col sm="5" class="d-flex align-center justify-start">
                                        <span>{{ valor.valor.attributes.name }}</span>
                                    </v-col>
                                    <v-col sm="3" class="pt-0 ">
                                        <v-text-field                                                    
                                            class="right-text-input"                                               
                                            type="number"
                                            dense
                                            v-model="valor.cantidad"
                                            hide-details=""
                                            @focus="$event.target.select()" 
                                        ></v-text-field>
                                    </v-col>
                                    
                                </v-row>
                            </v-col>
                            <v-col sm="6">
                                <v-row v-for="valor in valors_list.filter((i) => { return i.valor.attributes.name.startsWith('M')}).sort((a, b) => b.valor.attributes.valor - a.valor.attributes.valor)" :key="'M'+valor.valor.id">
                                    
                                    <v-col sm="4" class="d-flex align-center justify-start">
                                        <span>{{ valor.valor.attributes.name }}</span>
                                    </v-col>
                                    <v-col sm="3" class="pt-0 ">
                                        <v-text-field    
                                            class="right-text-input"                                               
                                            type="number"                                           
                                            dense
                                            v-model="valor.cantidad"
                                            hide-details=""
                                            @focus="$event.target.select()"                                            
                                        ></v-text-field>
                                    </v-col>
                                    
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-card-text>                    
                </v-card>
                
            </v-col>

        </v-row>    
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    async created () {
        this.onload()

    },
    data () {
        return {
        } 
    },
    computed: {
        ...mapGetters({
            valors: 'valors_manager/valors',
            paymentmethods: 'paymentMethods_manager/paymentMethods',
            valors_list: 'cajas_manager/valors_recuento',
        }),
        recuento_efectivo () {
            let recuento = 0
            for ( let valor of this.valors_list ) {
                recuento = recuento + valor.cantidad * valor.valor.attributes.valor
            }
            return recuento
        },
        
    },

    methods: {
        ...mapActions({
            set_valors_recuento: 'cajas_manager/set_valors_recuento',
        }),

        onload () {
            let list = []
            for ( let valor of this.valors ) {
                list.push({
                    valor: valor,
                    cantidad: 0
                })
            }

            this.set_valors_recuento ( list )
        }
    }
}
</script>

<style lang="scss">  
  tbody {
     tr:hover {
        background-color: transparent !important;
     }
  }
</style>