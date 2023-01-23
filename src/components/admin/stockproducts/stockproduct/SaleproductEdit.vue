<template>
  <div class="text-center">
    
    <v-dialog
      v-model="dialog"
      width="800"
      
    >
    
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="black"
          dark
          v-bind="attrs"
          v-on="on"
          icon
          small
          @click="onload"
        >
          <v-icon>mdi-application-edit-outline</v-icon>
        </v-btn>
      </template>
        <v-form @submit.prevent="submit" ref="form" v-model="valid" >
      <v-card v-if="subitem_cache">
        
        <v-card-title class="text-h6 grey lighten-2" >
          <span>{{ stockproduct.attributes.name }}</span>
        </v-card-title>

        <v-card-text class="pt-3">
            
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Nombre</span>
                </v-col>
                <v-col cols="12" sm="8"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="subitem_cache.attributes.name"
                        :rules="nameRules"
                        :error-messages="errorNameMessages"
                        @keydown="errorNameMessages = ''"
                    
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Rel/Venta</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        reverse
                        dense
                        v-model="subitem_cache.attributes.relacion_venta_stock"
                        :rules="relacion_venta_stockRules"
                        :error-messages="errorRelacion_venta_stockMessages"
                        @keydown="errorRelacion_venta_stockMessages = ''"
                       
                    ></v-text-field>
                </v-col>

            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Porc Minorista</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        reverse
                        dense
                        v-model="subitem_cache.attributes.porc_min"
                        :rules="porc_minRules"
                        :error-messages="errorPorc_minMessages"
                        @keydown="errorPorc_minMessages = ''"
                       
                    ></v-text-field>
                </v-col>

            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Porc Mayorista</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        reverse
                        dense
                        v-model="subitem_cache.attributes.porc_may"
                        :rules="porc_mayRules"
                        :error-messages="errorPorc_mayMessages"
                        @keydown="errorPorc_mayMessages = ''"
                       
                    ></v-text-field>
                </v-col>

            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Grupo</span>
                </v-col>
                <v-col cols="12" sm="7"  class=" pt-0 pb-0 d-flex">
                    <SelectSaleproductgroup
						:disabled="false"
						@setSaleproductgroup="setSaleproductgroup"

                        :saleproductgroup="subitem_cache.relationships.saleproductgroup"
					/>
                    
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-0 pb-0 d-flex justify-sm-end">
                    
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-checkbox
                        class="mt-1 mb-1"
                        v-model="subitem_cache.attributes.is_enable"
                        label="Habilitado"
                        color="green"
                        hide-details
                        ></v-checkbox>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-0 pb-0 d-flex justify-sm-end">
                    
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-checkbox
                        class="mt-1 mb-1"
                        v-model="subitem_cache.attributes.is_enable_web"
                        label="Habilitado WEB"
                        color="green"
                        hide-details
                        ></v-checkbox>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Descripción</span>
                </v-col>
                <v-col cols="12" sm="7"  class=" pt-0 pb-0">
                    <v-textarea
                        v-model="subitem_cache.attributes.comments"
                        counter="200"
                        :rules="commentsRules"
                        :error-messages="errorCommentsMessages"
                        @keydown="errorCommentsMessages = ''"

                        outlined
                    ></v-textarea>
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
            GuardaR
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SelectSaleproductgroup from '@/components/admin/saleproductgroups/SelectSaleproductgroup'
export default {
    created () {
        
    },
    components: {
        SelectSaleproductgroup,
    },

    props: {
        saleproduct:Object,
        stockproduct: Object
    },
    data () {
        return {
            dialog: false,
            valid: true,

            is_saving: false,
            nameRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
            ],
            errorNameMessages: '',

            relacion_venta_stockRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorRelacion_venta_stockMessages: '',

            porc_minRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorPorc_minMessages: '',

            porc_mayRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorPorc_mayMessages: '',

            commentsRules: [
                v => ( v.length < 200 ) ||"Exede el máximo permitido",
            ],
            errorCommentsMessages: '',
        }
    },
    computed: {
        ...mapGetters({
            subitem: 'stockproducts_manager/subitem',
            subitem_cache: 'stockproducts_manager/subitem_cache',

            subitem_ids_select: 'stockproducts_manager/subitem_ids_select',
        })
    },
    methods: {
        ...mapActions({
            'set_subitem': 'stockproducts_manager/set_subitem',
            'update_subitem': 'stockproducts_manager/update_subitem',
        }),
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true
                await this.update_subitem('saleproduct')
                    .then((resp) => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                        this.subitem.attributes.relacion_venta_stock = resp.data.data.attributes.relacion_venta_stock
                        this.subitem.attributes.porc_min = resp.data.data.attributes.porc_min
                        this.subitem.attributes.porc_may = resp.data.data.attributes.porc_may
                        this.subitem.attributes.name = this.subitem_cache.attributes.name
                        this.subitem.attributes.is_enable = this.subitem_cache.attributes.is_enable

                        this.subitem.attributes.is_enable_web = resp.data.data.attributes.is_enable_web

                        this.subitem.relationships.saleproductgroup = resp.data.data.relationships.saleproductgroup

                        this.subitem.attributes.comments = resp.data.data.attributes.comments

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
            this.set_subitem(this.saleproduct)
            if ( this.subitem.relationships.saleproductgroup ) {
                this.subitem_ids_select.saleproductgroup_id = this.subitem.relationships.saleproductgroup.id
            }
            
        },  

        setSaleproductgroup (saleproductgroup) { //console.log( saleproductgroup)
            if ( saleproductgroup ) {
                this.subitem_ids_select.saleproductgroup_id = saleproductgroup.id            
            }else {
                this.subitem_ids_select.saleproductgroup_id = 0
            }
        }
    }

}
</script>

<style>

</style>