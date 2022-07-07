<template>
    
        <v-dialog
          v-model="dialog"
          
          max-width="900"
        
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
            class="mt-1 ml-2"
            small
            v-bind="attrs"
            v-on="on"
            @click="onload"
            >           
            <v-icon>
                mdi-magnify
            </v-icon>            
        </v-btn>
            
        </template>
        <v-card>
            <v-card-title>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="3">
                        <span>Producto</span>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="12" sm="6">
                        <v-text-field
                            solo
                            label="Search"
                            append-icon="mdi-magnify"
                            dense
                            hide-details
                            v-model="q"
                            v-on:keyup.enter="getItems"
                            class="rounded-sm mb-1"
                            ref='search'
                        ></v-text-field>
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
                    height="300px"
                >
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                            Descripción 
                        </th>
                        <th  style="width: 30px;" class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                            Precio
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
                            <template v-if="item.tipo == 'saleproduct'">
                                <td class="pl-1">{{ item.name }}</td>
                                <td v-if="saleActive.client != null && saleActive.client.tipo == 'MAYORISTA'" class="text-right" >{{ globalHelperFixeDecimalMoney(globalHelperCalculaPrecio(item.valor_4, item.valor_2, item.valor_3)) }}</td>
                                <td v-else class="text-right" >{{ globalHelperFixeDecimalMoney(globalHelperCalculaPrecio(item.valor_4, item.valor_1, item.valor_3)) }}</td>
                                
                            </template>
                            <template v-if="item.tipo == 'combo'">
                                <td class="pl-1">{{ item.name }}</td>
                                <td v-if="saleActive.client != null && saleActive.client.tipo == 'MAYORISTA'" class="text-right" >{{ globalHelperFixeDecimalMoney(item.valor_2) }}</td>
                                <td v-else class="text-right" >{{ globalHelperFixeDecimalMoney(item.valor_1) }}</td>
                                
                            </template>
                            
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
import { mapGetters } from 'vuex'
export default {


    data () {
        return {
            dialog: false,
            items: [],
            loadingTable: false,
            q: '',
        }
    },
    computed: {
      ...mapGetters({
        saleActive: 'sale_manager/saleActive',
      })
    },

    methods: {
        async getItems () {
            this.loadingTable = true,
            await axios.get('/get_sale_products_venta', {
                params: {
                    'sucursal': 1,
                    'q': this.q,
                }
            }).then((result) => {
                this.items = result.data.data

                //console.log(this.items)
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.loadingTable = false
            })           
        },
        onload() {
            this.items = []
            this.q = ''
            this.getItems()
            setTimeout(() => this.$refs.search.$refs.input.focus(), 100); 

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