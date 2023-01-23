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
                    <v-col cols="12" sm="5"  class="d-flex justify-sm-end align-center">
                        <span class="font-weight-bold black--text">Costo</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class="d-flex align-center justify-end">
                        <span>{{ globalHelperFixeDecimalMoney(costo) }}</span>
                    </v-col>

                </v-row>
                <v-row>
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Porc Min</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class=" pt-0 pb-0 d-flex">
                        <v-text-field 
                            ref="precioMinTextField"
                            reverse
                            dense
                            v-model="item_cache.attributes.porc_min"
                            :rules="porc_minRules"
                            :error-messages="errorPorc_minMessages"
                            @keydown="errorPorc_minMessages = ''"
                            @focus="$event.target.select()"
                        ></v-text-field>
                    </v-col>

                </v-row>

                <v-row>
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Precisión Min</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class=" pt-0 pb-0 d-flex">
                        <v-select
                            class="mt-0"
                                dense
                                :items="[{name: '-3', value: -3}, {name: '-2', value: -2}, {name: '-1', value: -1}, {name: '0', value: 0}, {name: '1', value: 1}, {name: '2', value: 2}, {name: '3', value: 3}]"
                                item-text="name"
                                item-value="value"
                                v-model="item_cache.attributes.precision_min"
                                :menu-props="{ offsetY: true }"
                                hide-details

                            >
                            </v-select>
                    </v-col>

                    <v-col cols="12" sm="3"  class="d-flex align-center justify-end">
                        <span>( {{ globalHelperFixeDecimalMoney(getPrecioMinDesc) }} )</span>
                    </v-col>

                </v-row>

                <v-row>
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Porc May</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class=" pt-0 pb-0 d-flex">
                        <v-text-field 
                            reverse
                            dense
                            v-model="item_cache.attributes.porc_may"
                            :rules="porc_mayRules"
                            :error-messages="errorPorc_mayMessages"
                            @keydown="errorPorc_mayMessages = ''"
                        
                        ></v-text-field>
                    </v-col>


                </v-row> 
                <v-row>
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Precisión May</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class=" pt-0 pb-0 d-flex">
                        <v-select
                            class="mt-0"
                                dense
                                :items="[{name: '-3', value: -3}, {name: '-2', value: -2}, {name: '-1', value: -1}, {name: '0', value: 0}, {name: '1', value: 1}, {name: '2', value: 2}, {name: '3', value: 3}]"
                                item-text="name"
                                item-value="value"
                                v-model="item_cache.attributes.precision_may"
                                :menu-props="{ offsetY: true }"
                                hide-details

                            >
                            </v-select>
                    </v-col>

                    <v-col cols="12" sm="3"  class="d-flex align-center justify-end">
                        <span>( {{ globalHelperFixeDecimalMoney(getPrecioMayDesc) }} )</span>
                    </v-col>

                </v-row> 

                <v-row v-if="item_cache.relationships.saleproductgroup">
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Grupo</span>
                    </v-col>
                    <v-col cols="12" sm="6"  class=" pt-0 pb-0 d-flex">
                        <v-text-field 
                            dense
                            :value="item_cache.relationships.saleproductgroup.attributes.name"
                            disabled
                        ></v-text-field>
                    </v-col>


                </v-row> 
                
                <v-row v-if="item_cache.relationships.saleproductgroup">
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
export default {
    created () {
    
    },

    props: {
        saleproduct:Object,
    },

    data () {
        return {
            dialog: false,
            valid: true,
            is_updategroup: true,
            is_saving: false,

            porc_min: 0,
            porc_minRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorPorc_minMessages: '',  

            porc_may: 0,
            porc_mayRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorPorc_mayMessages: '', 
        }
    },
    computed: {
        ...mapGetters({
            item_cache: 'saleproducts_manager/item_cache',
            item: 'saleproducts_manager/item',
        }),
        costo: function ( ) {
            return Number(this.item_cache.relationships.stockproduct.attributes.costo * this.item_cache.attributes.relacion_venta_stock).toFixed(10) 
        },
        precio_min: function ( ) {
            let num = ( this.item_cache.attributes.porc_min / 100 ).toFixed(10)
            if ( num <= 2 ) { num = Number(num) + 1 }
            return (this.costo * num).toFixed(10)
        },
        precio_may: function ( ) {
            let num = ( this.item_cache.attributes.porc_may / 100 ).toFixed(10)
            if ( num <= 2 ) { num = Number(num) + 1 }
            return (this.costo * num).toFixed(10)
        },
        getPrecioMinDesc: function ( ) {
            let precio =  Number(this.precio_min)
            let precision = 10 ** Number(this.item_cache.attributes.precision_min)

            return Math.round((precio + Number.EPSILON) * precision) / precision
        },
        getPrecioMayDesc: function ( ) {
            let precio =  Number(this.precio_may)
            let precision = 10 ** Number(this.item_cache.attributes.precision_may)

            return Math.round((precio + Number.EPSILON) * precision) / precision
        },
    },
    methods: {
        ...mapActions({
            set_item: 'saleproducts_manager/set_item',
            update_item_values: 'saleproducts_manager/update_item_values',
            update_values_items_group: 'saleproducts_manager/update_values_items_group',
        }),
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true

                if ( !this.item_cache.relationships.saleproductgroup ) {
                    this.is_updategroup = false
                }

                await this.update_item_values(this.is_updategroup)
                    .then((resp) => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                        if ( this.is_updategroup && this.item_cache.relationships.saleproductgroup ) {
                          this.update_values_items_group({
                            id: resp.data.data[0].relationships.saleproductgroup.id,
                            porc_min: resp.data.data[0].attributes.porc_min,
                            porc_may: resp.data.data[0].attributes.porc_may,
                            precio_min: resp.data.data[0].attributes.precio_min,
                            precio_may: resp.data.data[0].attributes.precio_may,
                            //precio_min: resp.data.data[0].attributes.precio_min,
                            precision_min: resp.data.data[0].attributes.precision_min,
                            precision_may: resp.data.data[0].attributes.precision_may,
                          })
                        }else {
                            this.item.attributes.porc_min = resp.data.data.attributes.porc_min
                            this.item.attributes.porc_may = resp.data.data.attributes.porc_may
                            this.item.attributes.precio_min = resp.data.data.attributes.precio_min
                            this.item.attributes.precio_may = resp.data.data.attributes.precio_may
                            this.item.attributes.precision_min = resp.data.data.attributes.precision_min
                            this.item.attributes.precision_may = resp.data.data.attributes.precision_may
                        }
                        
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

        onload () {
            this.set_item(this.saleproduct)
            

            setTimeout(() => {
                this.setFocusName()
            }, 200)
        },
        setFocusName() {
            this.$refs.precioMinTextField.focus();
        },  
        
        
    }

}
</script>

<style>

</style>