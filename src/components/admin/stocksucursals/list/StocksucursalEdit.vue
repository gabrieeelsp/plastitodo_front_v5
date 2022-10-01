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
        


        <v-card-text class="pt-3">
            
            <v-card outlined v-for="item of items" :key="item.id" class="mt-1" >
                <v-card-text >
                    <v-row>
                        <v-col><span>{{ item.sucursal.attributes.name }}</span></v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                            <span class="font-weight-bold black--text">Stock Min</span>
                        </v-col>
                        <v-col cols="12" sm="4"  class=" pt-0 pb-0 d-flex">
                            <v-text-field 
                                reverse
                                dense
                                v-model="item.stock_minimo"
                                :rules="numRules"
                            ></v-text-field>
                        </v-col>

                    </v-row> 
                    <v-row>
                        <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                            <span class="font-weight-bold black--text">Stock Max</span>
                        </v-col>
                        <v-col cols="12" sm="4"  class=" pt-0 pb-0 d-flex">
                            <v-text-field 
                                reverse
                                dense
                                v-model="item.stock_maximo"
                            
                            ></v-text-field>
                        </v-col>

                    </v-row> 

                </v-card-text>

            </v-card>    
                
                
            
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

            items: [],

            numRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ]
        }
    },
    computed: {
        ...mapGetters({
            sucursals: 'sucursals_manager/sucursals',
            sucursal_by_id: 'sucursals_manager/sucursal_by_id',
        }),
        
    },
    methods: {
        onload () {
            this.items = []
            for ( let stocksucursal of this.stockproduct.relationships.stocksucursals ) {
                this.items.push({
                    id: stocksucursal.id,
                    stock_minimo: stocksucursal.attributes.stock_minimo,
                    stock_maximo: stocksucursal.attributes.stock_maximo,
                    sucursal: this.sucursal_by_id(stocksucursal.attributes.sucursal_id),
                })
            }

        },
        ...mapActions({
            update_item_values: 'stocksucursals_manager/update_item_values',

        }),
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true
                await this.update_item_values(this.items)
                    .then(() => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                        this.$emit('reload_items');
                        
                        this.dialog = false
                    })
                    .catch((error) => {
                        this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                        console.log(error)
                    })
                    .finally(() => {
                        this.is_saving = false
                        
                    })
            }   
        },

        calculaPrecio(costo, porcentaje) {
            let num = ( porcentaje / 100 ).toFixed(10)
            if ( num <= 2 ) { num = Number(num) + 1 }
            return (costo * num).toFixed(10)
        },

        
             
    }

}
</script>

<style>

</style>