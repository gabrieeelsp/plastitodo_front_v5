<template>
  <div style="display: inline;">
    
    <v-dialog
      v-model="dialog"
      width="580"      
    >
    
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="success"
          dark
          v-bind="attrs"
          v-on="on"
          @click="onload"
          small
            
        >	
		Nuevo

        </v-btn>
      </template>
        <v-form @submit.prevent="submit" ref="form" v-model="valid" >
      <v-card v-if="combo">
        
        <v-card-title class="text-h6 grey lighten-2" >
          <span>{{ combo.attributes.name }}</span>
        </v-card-title>

        <v-card-text class="pt-3">
                <v-row>
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Nombre</span>
                    </v-col>
                    <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                        <v-text-field 
							ref="nameTextField"
                            dense
                            v-model="name"
                            :rules="nameRules"
                            :error-messages="errorNameMessages"
                            @keydown="errorNameMessages = ''"
                        
                        ></v-text-field>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Cantidad</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class=" pt-0 pb-0 d-flex">
                        <v-text-field 
                            reverse
                            dense
                            v-model="cantidad"
                            :rules="cantidadRules"
                            :error-messages="errorCantidadMessages"
                            @keydown="errorCantidadMessages = ''"
                            @focus="$event.target.select()"
                        ></v-text-field>
                    </v-col>

                </v-row>               
                
            
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"

            type="submit"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    created () {
        
    },

    props: {
      combo: Object
    },

    data () {
        return {
            dialog: false,
            valid: true,
            is_updategroup: true,
            is_saving: false,

            name: '',
            nameRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
            ],
            errorNameMessages: '',

            cantidad: 0,
            cantidadRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorCantidadMessages: '',  
        }
    },
    computed: {
        ...mapGetters({

        }),

    },
    methods: {
        ...mapActions({

        }),
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true

                this.$emit('comboitem_new', {
                    name: this.name,
                    cantidad: this.cantidad
                })
                this.dialog = false

            }   
        },


        onload () {
            this.name = ''
            this.cantidad = ''
            setTimeout(() => {
                this.setFocusName()
            }, 500)
        },
        setFocusName() {
            this.$refs.nameTextField.focus();
        },       
    }

}
</script>

<style>

</style>