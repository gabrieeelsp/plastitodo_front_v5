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
            :disabled="disabled"
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
                    <v-col>
                        <v-checkbox
                            v-model="show_images"
                            label="Fotos"
                        ></v-checkbox> 
                    </v-col>
                    
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
                            <th v-if="show_images" style="width: 110px;" class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Foto
                            </th>
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
                            <td v-if="show_images" >
                                <v-row class="">
                                    <v-col class="pl-0" >
                                        <v-card class="">
                                            <v-img
                                                v-if="item.image1"
                                                class="white--text align-end mt-1 mb-1"
                                                height="100px"
                                                width="100px"
                                                :src="url_asset + item.image1"
                                            >
                                            </v-img>
                                            <v-img
                                                v-else
                                                class="white--text align-end mt-1 mb-1"
                                                height="100px"
                                                width="100px"
                                                :src="url_asset + 'images/image_default.jpg'"
                                            >
                                            </v-img>
                                            </v-card>
                                    </v-col>
                                </v-row>
                            </td>
                            
                            <template v-if="item.tipo == 'saleproduct'">
                                <template v-if="presupuestoActive.client != null && presupuestoActive.client.tipo == 'MAYORISTA'">
                                    <template v-if="Number(item.desc_may) != 0 && (new Date(item.fecha_desc_desde).getTime() <= new Date().getTime()) && (new Date(item.fecha_desc_hasta).getTime() >= new Date().getTime())">
                                        <td class="pl-1">{{ item.name }} [ Promo ]</td>
                                        <td class="text-right" >{{ globalHelperFixeDecimalMoney(globalHelerAplicaDescuento(item.precio_may, item.desc_may)) }}</td>
                                    </template>
                                    <template v-else>
                                        <td class="pl-1">{{ item.name }}</td>
                                        <td class="text-right" >{{ globalHelperFixeDecimalMoney(item.precio_may) }}</td>
                                    </template>
                                </template>

                                <template v-else >
                                    <template v-if="Number(item.desc_min) != 0 && (new Date(item.fecha_desc_desde).getTime() <= new Date().getTime()) && (new Date(item.fecha_desc_hasta).getTime() >= new Date().getTime())">
                                        <td class="pl-1">{{ item.name }} [ Promo ]</td>
                                        <td class="text-right" >{{ globalHelperFixeDecimalMoney(globalHelerAplicaDescuento(item.precio_min, item.desc_min)) }}</td>
                                    </template>
                                    <template v-else>
                                        <td class="pl-1">{{ item.name }}</td>
                                        <td class="text-right" >{{ globalHelperFixeDecimalMoney(item.precio_min) }}</td>
                                    </template>
                                </template>

                            </template>

                                
                            <template v-if="item.tipo == 'combo'">
                                <td class="pl-1">{{ item.name }}</td>
                                <td v-if="presupuestoActive.client != null && presupuestoActive.client.tipo == 'MAYORISTA'" class="text-right" >{{ globalHelperFixeDecimalMoney(item.precio_may) }}</td>
                                <td v-else class="text-right" >{{ globalHelperFixeDecimalMoney(item.precio_min) }}</td>
                                
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

    props:{
        disabled: Boolean
    },
    data () {
        return {
            show_images: false,

            dialog: false,
            items: [],
            loadingTable: false,
            q: '',
        }
    },
    computed: {
      ...mapGetters({
        presupuestoActive: 'presupuestos_manager/presupuestoActive',
        url_asset: 'url_asset',
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