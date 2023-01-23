<template>
  <div style="display: inline;">
    
    <v-dialog
      v-model="dialog"
      width="580"
      
    >
    
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="black"
          dark
          v-bind="attrs"
          v-on="on"
          icon
          x-small
            @click="onload"
        >
          <v-icon>mdi-application-edit-outline</v-icon>
        </v-btn>
      </template>
        <v-form @submit.prevent="submit" ref="form" v-model="valid" >
      <v-card v-if="stockproduct">
        
        <v-card-title class="text-h6 grey lighten-2" >
          <span>{{ stockproduct.name }}</span>
        </v-card-title>

        <v-card-text class="pt-3">

                <v-row>
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Costo</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class=" pt-0 pb-0 d-flex">
                        <v-text-field 
                            ref="costoTextField"
                            reverse
                            dense
                            v-model="costo"
                            :rules="costoRules"
                            :error-messages="errorCostoMessages"
                            @keydown="errorCostoMessages = ''"
                            @focus="$event.target.select()"
                        ></v-text-field>
                    </v-col>

                </v-row>

                <v-row v-if="stockproductgroup">
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Grupo</span>
                    </v-col>
                    <v-col cols="12" sm="6"  class=" pt-0 pb-0 d-flex">
                        <v-text-field 
                            dense
                            :value="stockproductgroup.name"
                            disabled
                        ></v-text-field>
                    </v-col>


                </v-row> 
                <v-row v-if="stockproductgroup">
                    <v-col cols="12" sm="5"  class="pt-0 pb-0 d-flex justify-sm-end">
                        
                    </v-col>
                    <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                        <v-checkbox
                            class="mt-1 mb-1"
                            v-model="is_updategroup"
                            label="Actualizar Grupo"
                            color="green"
                            hide-details
                            ></v-checkbox>
                    </v-col>
                </v-row>
                
            
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            :loading="is_saving"
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
import axios from 'axios'
export default {
    created () {
        
    },

    props: {
        stockproduct:Object,
    },

    data () {
        return {
            dialog: false,
            valid: true,
            is_updategroup: true,
            is_saving: false,

            stockproductgroup: null,
            costo: 1,

            costoRules: [
                //v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorCostoMessages: '',  
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

                let attributes = {
                    costo: this.costo,
                }

                if ( !this.stockproductgroup ) {
                    this.is_updategroup = false
                }
            
                await axios.put(`stockproducts/${this.stockproduct.stockproduct_id}/update_values`, {
                    data: {
                        id: this.stockproduct.stockproduct_id,
                        update_group: this.is_updategroup,
                        type: 'stockproducts',
                        attributes: attributes,
                    }
                })
                .then((resp) => {
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                    if ( this.is_updategroup ) {
                        this.$emit('update_items_group', {
                            costo: resp.data.data[0].attributes.costo,
                            stockproductgroup_id: this.is_updategroup ? this.stockproductgroup.id : null
                        })
                    }else {
                        this.$emit('update_item', {
                            stockproduct_id: resp.data.data.id,
                            costo: resp.data.data.attributes.costo,
                            stockproductgroup_id: this.is_updategroup ? this.stockproductgroup.id : null
                        })
                    }
                    
                    
                })
                .catch((error) => {
                    this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                    console.log(error)
                })
                .finally(() => {
                    this.is_saving = false
                    this.dialog = false
                })
            }   
        },

        onload () {
            setTimeout(() => {
                this.setFocusName()
            }, 200)
            this.costo = this.stockproduct.precio_actual

            if ( this.stockproduct.stockproductgroup ) {
                this.stockproductgroup = {
                    id: this.stockproduct.stockproductgroup.id,
                    name: this.stockproduct.stockproductgroup.name,
                }
            }

            
            
        },
        setFocusName() {
            this.$refs.costoTextField.focus();
        },


       
    }

}
</script>

<style>

</style>