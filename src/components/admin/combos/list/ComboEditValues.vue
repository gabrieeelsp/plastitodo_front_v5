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
                        <span>{{ globalHelperFixeDecimalMoney(precios_base.costo) }}</span>
                    </v-col>

                </v-row>
                <v-row>
                    <v-col cols="12" sm="5"  class="d-flex justify-sm-end align-center">
                        <span class="font-weight-bold black--text">Precio Lista Min</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class="d-flex align-center justify-end">
                        <span>{{ globalHelperFixeDecimalMoney(precios_base.precio_lista_min) }}</span>
                    </v-col>

                </v-row>

                <v-row>
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Desc Min</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class=" pt-0 pb-0 d-flex">
                        <v-text-field 
                        ref="precioMinTextField"
                            reverse
                            dense
                            v-model="item_cache.attributes.desc_min"
                            :rules="desc_minRules"
                            :error-messages="errorDesc_minMessages"
                            @keydown="errorDesc_minMessages = ''"
                            @focus="$event.target.select()"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="3"  class="d-flex align-center justify-end">
                        <span>( {{ globalHelperFixeDecimalMoney(precio_min) }} )</span>
                    </v-col>

                </v-row>
                <v-row>
                    <v-col cols="12" sm="5"  class="d-flex justify-sm-end align-center">
                        <span class="font-weight-bold black--text">Precio Lista May</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class="d-flex align-center justify-end">
                        <span>{{ globalHelperFixeDecimalMoney(precios_base.precio_lista_may) }}</span>
                    </v-col>

                </v-row>

                <v-row>
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Desc May</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class=" pt-0 pb-0 d-flex">
                        <v-text-field 
                            reverse
                            dense
                            v-model="item_cache.attributes.desc_may"
                            :rules="desc_mayRules"
                            :error-messages="errorDesc_mayMessages"
                            @keydown="errorDesc_mayMessages = ''"
                        
                        ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="3"  class="d-flex align-center justify-end">
                        <span>( {{ globalHelperFixeDecimalMoney(precio_may) }} )</span>
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
        combo:Object,
    },

    data () {
        return {
            dialog: false,
            valid: true,

            is_saving: false,

            desc_min: 0,
            desc_minRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorDesc_minMessages: '',  

            desc_may: 0,
            desc_mayRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorDesc_mayMessages: '', 
        }
    },
    computed: {
        ...mapGetters({
            item_cache: 'combos_manager/item_cache',
            item: 'combos_manager/item',
        }),
        precios_base: function ( ) {
            let costo = 0
            let precio_lista_min = 0
            let precio_lista_may = 0
            for ( let comboitem of this.item_cache.relationships.comboitems ) {

                let costo_max = 0
                let precio_list_min_max = 0
                let precio_list_may_max = 0
                for ( let saleproduct of comboitem.relationships.saleproducts ) {
                    if ( saleproduct.attributes.is_enable ) {
                        if (saleproduct.attributes.precio_min > precio_list_min_max ){
                            costo_max = saleproduct.relationships.stockproduct.attributes.costo * saleproduct.attributes.relacion_venta_stock
                            precio_list_min_max = precio_list_min_max + saleproduct.attributes.precio_min * saleproduct.attributes.relacion_venta_stock
                        }

                        if (saleproduct.attributes.precio_may > precio_list_may_max ){
                            costo_max = saleproduct.relationships.stockproduct.attributes.costo * saleproduct.attributes.relacion_venta_stock
                            precio_list_may_max = precio_list_may_max + saleproduct.attributes.precio_may * saleproduct.attributes.relacion_venta_stock
                        }
                    }
                    
                }
                
                costo = costo + costo_max * comboitem.attributes.cantidad
                precio_lista_min = precio_lista_min + precio_list_min_max * comboitem.attributes.cantidad
                precio_lista_may = precio_lista_may + precio_list_may_max * comboitem.attributes.cantidad

                costo_max = 0
                precio_list_min_max = 0
                precio_list_may_max = 0
            }

            return {
                costo: costo,
                precio_lista_min: precio_lista_min,
                precio_lista_may: precio_lista_may
            } 
        },
        
        precio_min: function ( ) {
            let num = ( this.item_cache.attributes.desc_min / 100 ).toFixed(10)
            num = 1- Number(num)
            return (this.precios_base.precio_lista_min * num).toFixed(10)
        },
        precio_may: function ( ) {
            let num = ( this.item_cache.attributes.desc_may / 100 ).toFixed(10)
            num = 1- Number(num)
            return (this.precios_base.precio_lista_may  * num).toFixed(10)
        }
    },
    methods: {
        ...mapActions({
            set_item: 'combos_manager/set_item',
            update_item_values: 'combos_manager/update_item_values',
        }),
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true
                await this.update_item_values()
                    .then((resp) => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                        
                        this.item.attributes.desc_min = resp.data.data.attributes.desc_min
                        this.item.attributes.desc_may = resp.data.data.attributes.desc_may
                        this.item.attributes.precio_min = resp.data.data.attributes.precio_min
                        this.item.attributes.precio_may = resp.data.data.attributes.precio_may
                        
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


        onload () {
            this.set_item(this.combo)
            

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