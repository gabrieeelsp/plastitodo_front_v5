<template>
  

    <v-dialog
      v-model="intDialogVisible"
      max-width="700"
    >
      <v-card>
        <v-card-title class="text-h5">
            <span class="">{{ item.name }}</span>
          
        </v-card-title>
        <v-form @submit.prevent="accept" ref="form" v-model="valid" >
        <v-card-text>
            

            <v-row class="">
                
                <v-col cols="12" sm="6">
                    <v-row class="">
                        <v-col class="pt-0">
                            <v-card class="">
                                <v-img
                                    v-if="item.image1"                                    
                                    class="white--text align-end"
                                    height="200px"
                                    :src="url_asset + item.image1"
                                >|
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
                    </v-row>
                    
                </v-col>
                <v-col cols="12" sm="6" class="">
                    
                        <v-row class="">
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
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        
                        <v-row>
                            <v-col class="d-flex justify-end">
                                <v-btn
                                    color="green darken-1"
                                    text
                                    @click="intDialogVisible = false"
                                >
                                    Cancelar
                                </v-btn>

                                <v-btn
                                    color="green darken-1"
                                    text
                                    type="submit"
                                >
                                    Aceptar
                                </v-btn>
                            </v-col>
                        </v-row>
                    
                </v-col>

            </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>


        </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  
</template>

<script>

  export default {
      mounted () {
        this.onload()
    },
    data () {
      return {

        url_asset: "http://localhost:8000/",

        cantidad: null,
        valid: true,
        cantidadRules: [
            v => ( v && v >= 0 ) || "Cantidad should be above 0",
        ],
        errorCantidadMessages: '',
      }
    },
    props: {
        dialogVisible: Boolean,
        item: Object
    
    },
    computed: {

        precio: function (){
             
            return 0
            

        },

        intDialogVisible: {
            get: function () {
                if (this.dialogVisible) {
                    
                // Some dialog initialization code could be placed here
                // because it is called only when this.dialogVisible changes
                }

                return this.dialogVisible
            },
            set: function (value) {
                    if (!value) {
                    this.$emit('close')
                    }
            }
        }
    },
    methods: {
        validate () {
            this.$refs.form.validate()
        },
        async accept() {
            this.validate()

            if ( this.valid ) {

                this.$emit('addItem', {
                    id: 'x'+(Math.floor(Math.random() * 100000) +1),
                    attributes: {
                        cantidad: this.cantidad,
                        is_recibido: false,

                    },
                    relationships: {
                        stockproduct: {
                            id: this.item.id,
                            attributes: {
                                name: this.item.attributes.name,
                                image: this.item.attributes.image,
                                is_stock_unitario_variable: this.item.attributes.is_stock_unitario_variable,
                                stock_aproximado_unidad: this.item.attributes.stock_aproximado_unidad,
                                is_prepared: false,
                            }
                        }
                    },
                    is_editing_cantidad: false,

                })
                                
            }
            
        },
        onload() {
            setTimeout(() => this.$refs.input_cantidad.$refs.input.focus(), 100); 
            
        },
    }
  }
</script>