<template>
    
        <v-dialog
          v-model="dialog"
          
          max-width="900"
        
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
                v-if="btn_data == null"
                
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
            <v-btn
                v-else
                :color="btn_data.color"
                small
                v-bind="attrs"
                v-on="on"
                @click="onload"
                :disabled="disabled"
                >
                {{ btn_data.name }}          
            </v-btn>
        
            
        </template>
        <v-card>
            <v-card-title>
                <v-row class="d-flex align-center">
                    <v-col cols="12" sm="3">
                        <span>Proveedor</span>
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
                            <td class="pl-1">{{ item.name }}</td>
                            
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
        disabled: Boolean,
        btn_data: Object
    },
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

      })
    },

    methods: {
        async getItems () {
            this.loadingTable = true,
            await axios.get('/get_suppliers_select', {
                params: {
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