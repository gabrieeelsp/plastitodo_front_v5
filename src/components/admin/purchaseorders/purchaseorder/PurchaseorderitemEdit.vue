<template>
    <div class="text-center">
        <v-dialog
        v-model="dialog"
        width="580"
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn
            color="blue lighten-2"
            dark
            v-bind="attrs"
            v-on="on"
            icon
            small
            @click="onload"
            :disabled="disabled"
            >
            <v-icon>mdi-application-edit-outline</v-icon>
            </v-btn>
        </template>

        <v-card>
            <v-card-title class="text-h5 grey lighten-2">
                {{ purchaseorderitem.relationships.purchaseproduct.attributes.name }}
            </v-card-title>
            <v-form @submit.prevent="accept" ref="form" v-model="valid" id="updatePurchaseItemForm" >
                <v-card-text>
                

                    <v-row class="pt-2">
                        
                        <v-col cols="12" sm="6">
                            
                            <v-card class="">
                                <v-img
                                    v-if="purchaseorderitem.relationships.purchaseproduct.relationships.stockproduct.attributes.image"                                    
                                    class="white--text align-end"
                                    height="200px"
                                    :src="purchaseorderitem.relationships.purchaseproduct.relationships.stockproduct.attributes.image"
                                >
                                </v-img>
                                <v-img
                                    v-else                                    
                                    class="white--text align-end"
                                    height="200px"
                                    :src="url_asset + 'images/image_default.jpg'"
                                >
                                </v-img>
                            </v-card>
                                
                            
                        </v-col>
                        <v-col cols="12" sm="6" class="">
                            
                                <v-row class="mt-2">
                                    <v-col cols="12" sm="4"  class=" pb-0 d-flex justify-sm-start">
                                        <span class="font-weight-bold black--text">Cantidad</span>
                                    </v-col>
                                    <v-col cols="12" sm="8"  class=" pt-0 pb-0">
                                        <v-text-field
                                            class="right-text-input"
                                            dense
                                            type="number"
                                            v-model="cantidad"
                                            ref="input_cantidad"
                                            :rules="cantidadRules"
                                            :error-messages="errorCantidadMessages"
                                            @keydown="errorCantidadMessages = ''"
                                            @focus="$event.target.select()"
                                        ></v-text-field>
                                    </v-col>
                                </v-row>
                                
                                
                            
                        </v-col>

                    </v-row>
                </v-card-text>
            </v-form>
            <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="dialog = false"
                type="submit"
                form="updatePurchaseItemForm"
            >
                Aceptar
            </v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex/types/helpers';

export default {
    props: {
        purchaseorderitem: Object,
        disabled: Boolean
    },
    data () {
        return {
            dialog: false,
            // url_asset: "http://localhost:8000/",

            valid: true,
            cantidad: null,
            cantidadRules: [
                v => ( v && v >= 0 ) || "Cantidad should be above 0",
            ],
            errorCantidadMessages: '',
        }
    },
    computed: {
            ...mapGetters({
                url_asset: 'url_asset',
            })
        },
    methods: {
        onload() {
            this.cantidad = this.purchaseorderitem.attributes.cantidad
            setTimeout(() => this.$refs.input_cantidad.focus(), 200);   
        
        },
         

        validate () {
            this.$refs.form.validate()
        },
        async accept() {
            this.validate()
            if ( this.valid ) {
                this.$emit('setCantidad', {
                    id: this.purchaseorderitem.id,
                    cantidad: this.cantidad
                })
                this.dialog = false

                
            }
            
        },
    }


}
</script>

<style>

</style>