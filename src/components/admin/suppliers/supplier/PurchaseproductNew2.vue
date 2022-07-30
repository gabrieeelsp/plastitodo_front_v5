<template>
  

    <v-dialog
      v-model="intDialogVisible"
      max-width="700"
    >
      <v-card v-if="subitem_cache_new">
        
        <v-card-title class="text-h6 grey lighten-2" >
          <span>{{ supplier.attributes.name }}</span>
        </v-card-title>

        <v-card-text class="pt-3">
            
                <v-row>
                    <v-col cols="12" sm="3"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Nombre</span>
                    </v-col>
                    <v-col cols="12" sm="9"  class=" pt-0 pb-0">
                        <v-text-field 
                            dense
                            v-model="subitem_cache_new.name"
                            :rules="nameRules"
                            :error-messages="errorNameMessages"
                            @keydown="errorNameMessages = ''"
                        
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                <v-col cols="12" sm="3"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Rel/Compra</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        reverse
                        dense
                        v-model="subitem_cache_new.relacion_compra_stock"
                        :rules="relacion_compra_stockRules"
                        :error-messages="errorRelacion_compra_stockMessages"
                        @keydown="errorRelacion_compra_stockMessages = ''"
                       
                    ></v-text-field>
                </v-col>

            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-0 pb-0 d-flex justify-sm-end">
                    
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-checkbox
                        class="mt-1 mb-1"
                        v-model="subitem_cache_new.is_enable"
                        label="Habilitado"
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
    </v-dialog>
  
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

  export default {
      mounted () {
        this.onload()
    },
    data () {
      return {
        valid: true,
    
        is_saving: false,
        nameRules: [
            v => ( v && v.length > 0 ) || "Valor requerido",
        ],
        errorNameMessages: '',

        relacion_compra_stockRules: [
            v => ( v && v.length > 0 ) || "Valor requerido",
            v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
        ],
        errorRelacion_compra_stockMessages: '',

      }
    },
    props: {
        dialogVisible: Boolean,
        item: Object,
        supplier: Object,
    
    },
    computed: {
        ...mapGetters({
            subitem_cache_new: 'suppliers_manager/subitem_cache_new',
        }),
        
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
        ...mapActions({
            'new_subitem': 'suppliers_manager/new_subitem',
            'store_subitem_new': 'suppliers_manager/store_subitem_new',
        }),
        validate () {
            this.$refs.form.validate()
        },
        async accept() {
            
            
        },

        onload () {
            this.new_subitem()
        }
        
    }
  }
</script>