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
      <v-card v-if="item_cache">
        
        <v-card-title class="text-h6 grey lighten-2" >
          <span>{{ item_cache.attributes.name }}</span>
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
                            v-model="item_cache.attributes.costo"
                            :rules="costoRules"
                            :error-messages="errorCostoMessages"
                            @keydown="errorCostoMessages = ''"
                            @focus="$event.target.select()"
                        ></v-text-field>
                    </v-col>

                </v-row>
                <v-row>
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
            Guardas
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

            costoRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorCostoMessages: '',  
        }
    },
    computed: {
        ...mapGetters({
            item_cache: 'stockproducts_manager/item_cache',
            item: 'stockproducts_manager/item',
        }),
    },
    methods: {
        ...mapActions({
            set_item: 'stockproducts_manager/set_item',
            update_item_values: 'stockproducts_manager/update_item_values',
            update_costo_items_group: 'stockproducts_manager/update_costo_items_group',
        }),
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true
                await this.update_item_values(this.is_updategroup)
                    .then((resp) => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });

                        if ( this.is_updategroup && this.item_cache.relationships.stockproductgroup ) {
                          this.update_costo_items_group({
                            id: resp.data.data[0].relationships.stockproductgroup.id,
                            costo: resp.data.data[0].attributes.costo,
                            time_set_costo: resp.data.data[0].attributes.time_set_costo,
                          })
                        }else {
                            this.item.attributes.costo = resp.data.data.attributes.costo
                            this.item.attributes.time_set_costo = resp.data.data.attributes.time_set_costo
                            this.item_cache.attributes.time_set_costo = resp.data.data.attributes.time_set_costo
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
            this.set_item(this.stockproduct)
            setTimeout(() => {
                this.setFocusName()
            }, 200)
            
        },
        setFocusName() {
            this.$refs.costoTextField.focus();
        },
       
    }

}
</script>

<style>

</style>