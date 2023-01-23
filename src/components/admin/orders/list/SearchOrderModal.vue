<template>
    
        <v-dialog
          v-model="dialog"
          
          max-width="900"
        
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn                
                small
                v-bind="attrs"
                v-on="on"
                @click="onload"
                :disabled="disabled"
                >           
                Buscar Pedido        
            </v-btn>

        
            
        </template>
        <v-card>
            <v-card-title>
                <v-row class="d-flex align-center">
                    
                    <v-col cols="12" sm="3" class="d-flex align-center">
                        <SelectClient 
                            label="Cliente"
                            @setClient="setClint"
                            :client="filters.client"
                        />
                    </v-col>
                    <v-col cols="12" sm="3" class="d-flex align-center">
                        <v-select
                            dense
                            :items="['EDITANDO', 'FINALIZADO', 'CONFIRMADO', 'EN PREPARACION', 'PREPARADO', 'FACTURADO', 'EN DISTRIBUCION', 'ENTREGADO']"
                            v-model="filters.state"
                            :menu-props="{ offsetY: true }"
                            hide-details=""
                            label="Estado"
                            clearable
                        >
                        </v-select>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" sm="2" class="d-flex align-end">
                        <v-btn small
                            @click="getItems"
                        >Search</v-btn>
                        
                    </v-col>
                    
                    
                </v-row>
                
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text >
                <v-row>
                    
                    <v-spacer></v-spacer>
                    <v-col cols="12" sm="6" md="5" class="">
                        
                    </v-col>
                    
                </v-row>
                
                <v-simple-table
                    fixed-header
                    height="600px"
                >
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                # 
                            </th> 
                            <th class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Descripción 
                            </th> 
                            <th class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Fecha Entrega 
                            </th>  
                            <th   
                            style="width: 70px;"                              
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Estado
                            </th>                           
                            <th class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Sucursal 
                            </th>  
                            
                            <th class="pr-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3" style="width: 100px;">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="item in items"
                            :key="item.id"
                        >   
                            <td>{{ item.id }}</td>
                            <template v-if="item.relationships.client.attributes.tipo_persona == 'FISICA'" >  
                                <td class="pl-1">{{ item.relationships.client.attributes.name }} {{ item.relationships.client.attributes.surname }}</td>              
                            </template>
                            <template v-else >                
                                <td class="pl-1">{{ item.relationships.client.attributes.name }}</td>
                            </template>

                            <td>{{ item.attributes.fecha_entrega_acordada | luxon("dd-MM-yyyy") }}</td>

                            <td class="text-center" >
                                <v-chip x-small class="ma-2 white--text" :color="color_state(item.attributes.state)" >{{ item.attributes.state }}</v-chip>
                            </td>
                            

                            <td v-if="item.relationships.sucursal" >{{ item.relationships.sucursal.attributes.name }}</td>
                            <td v-else>--------</td>
                            <td>
                                <v-btn
                                    small
                                    elevation="2"
                                    @click="set(item)"
                                >
                                    <v-icon small >
                                        mdi-pencil
                                    </v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table> 
                
            </v-card-text>            
        </v-card>
        </v-dialog>
    
</template>

<script>
import axios from 'axios'
import SelectClient from '@/components/admin/clients/SelectClient'
import { mapGetters } from 'vuex'
export default {
    components: {
        SelectClient,
    },

    props:{
        disabled: Boolean,
    },
    data () {
        return {

            dialog: false,
            items: [],
            loadingTable: false,

            filters: {
                client: null,
                state: null,
            }
        }
    },
    computed: {
        ...mapGetters({
            color_state: 'orders_manager/color_state',
        })
    },

    methods: {
        setClint(client) {
            this.filters.client = client
        },
        async getItems () {
            this.loadingTable = true,
            await axios.get('/orders', {
                params: {
                    client_id: this.filters.client ? this.filters.client.id : null,
                    state: this.filters.state,
                }
            }).then((result) => {
                
                this.items = result.data.data
                //console.log(result.data.data)
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loadingTable = false
            })           
        },
        onload() {
            this.items = []
            this.filters.client = null,
            this.filters.state = null,
            this.getItems()

        },

        set(item) {
            this.dialog = false
            this.$emit('set', item)    
        }
    }
}
</script>

<style>

</style>