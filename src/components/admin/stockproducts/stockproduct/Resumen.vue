<template>
    <div v-if="item_cache">
        <v-form @submit.prevent="submit" ref="form" v-model="valid">
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Nombre</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.name"
                        :rules="nameRules"
                        :error-messages="errorNameMessages"
                        @keydown="errorNameMessages = ''"
                       
                    ></v-text-field>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Costo</span>
                </v-col>
                <v-col cols="12" sm="2"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        reverse
                        dense
                        v-model="item_cache.attributes.costo"
                        :rules="costoRules"
                        :error-messages="errorCostoMessages"
                        @keydown="errorCostoMessages = ''"
                       
                    ></v-text-field>
                </v-col>

            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Iva</span>
                </v-col>
                <v-col cols="12" sm="2"  class=" pt-0 pb-0 d-flex">
                    
                    <v-select
                        class="select_ivaaliquot ml-2"
                        dense
                        :menu-props="{ offsetY: true }"
                        :items="ivaaliquots_select"
                        v-model="item_cache.relationships.ivaaliquot.id"
                        item-text="name"
                        item-value="id"
                    ></v-select>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-0 pb-0 d-flex justify-sm-end">
                    
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-checkbox
                        class="mt-1 mb-1"
                        v-model="item_cache.attributes.is_stock_unitario_variable"
                        label="Stock Unitario Variable"
                        color="green"
                        hide-details
                        ></v-checkbox>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Stock Aprox. Unitario</span>
                </v-col>
                <v-col cols="12" sm="2"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        reverse
                        dense
                        v-model="item_cache.attributes.stock_aproximado_unidad"
                        :rules="!item_cache.attributes.is_stock_unitario_variable ? [] : stock_aproximado_unidadRules"

                        :error-messages="errorStock_aproximado_unidadMessages"
                        @keydown="errorStock_aproximado_unidadMessages = ''"
                        :disabled="!item_cache.attributes.is_stock_unitario_variable"
                    ></v-text-field>
                </v-col>

            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Grupo</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0 d-flex">
                    <SelectStockproductgroup
						:disabled="false"
						@setStockproductgroup="setStockproductgroup"

                        :stockproductgroup="item.relationships.stockproductgroup"
					/>
                    
                </v-col>
            </v-row>

            <v-row>
                <v-spacer></v-spacer>
                <v-col class="d-flex" cols="8">
                    <v-btn
                        :loading="is_saving" 
                        type="submit"
                        color="success"
                    >Guardar</v-btn>
                    <v-btn class="ml-2"
                        @click="reset"
                        color="primary"
                    >Reset</v-btn>
                    <v-btn class="ml-auto"
                        color="primary"
                        @click="volver"
                    >Volver</v-btn>
                </v-col>
            </v-row>


        </v-form>

    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectStockproductgroup from '@/components/admin/stockproductgroups/SelectStockproductgroup'
export default {
    mounted() {
    },components: {
        SelectStockproductgroup
    },
    computed: {
        ...mapGetters({
            item_cache: 'stockproducts_manager/item_cache',
            item: 'stockproducts_manager/item',
            item_ids_select: 'stockproducts_manager/item_ids_select',
            ivaaliquots_select: 'ivaaliquots_manager/ivaaliquots_select',
        })
    },
    data () {
        return {
            valid: true,
            is_saving: false,
            nameRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
            ],
            errorNameMessages: '',

            costoRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorCostoMessages: '',

            stock_aproximado_unidadRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) > 0 ) || "El valor debe ser mayor a 0",
            ],
            errorStock_aproximado_unidadMessages: '',
        }
    },
    methods: {
        ...mapActions({
            update_item_resumen: 'stockproducts_manager/update_item_resumen',
        }),
        reset () {
            this.item_cache.attributes.name = this.item.attributes.name
            this.item_cache.attributes.costo = this.item.attributes.costo
            this.item_cache.relationships.ivaaliquot = this.item.relationships.ivaaliquot
            this.item_cache.attributes.is_stock_unitario_variable = this.item.attributes.is_stock_unitario_variable
            this.item_cache.attributes.stock_aproximado_unidad = this.item.attributes.stock_aproximado_unidad

            //this.item_cache.relationships.stockproductgroup = this.item.relationships.stockproductgroup
        },
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true
                await this.update_item_resumen()
                    .then((resp) => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                        this.item.attributes.name = this.item_cache.attributes.name
                        this.item.attributes.costo = resp.data.data.attributes.costo
                        this.item_cache.attributes.costo = resp.data.data.attributes.costo
                        this.item.relationships.ivaaliquot = resp.data.data.relationships.ivaaliquot
                        this.item.attributes.is_stock_unitario_variable = this.item_cache.attributes.is_stock_unitario_variable
                        this.item.attributes.stock_aproximado_unidad = resp.data.data.attributes.stock_aproximado_unidad,
                        this.item_cache.attributes.stock_aproximado_unidad = resp.data.data.attributes.stock_aproximado_unidad

                        this.item.relationships.stockproductgroup = resp.data.data.relationships.stockproductgroup
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
        volver() {
            this.$emit('volver')
        },

        setStockproductgroup (stockproductgroup) {
            if ( stockproductgroup ) {
                this.item_ids_select.stockproductgroup_id = stockproductgroup.id            
            }else {
                this.item_ids_select.stockproductgroup_id = 0
            }
        }
    }
}
</script>

<style>
    .select_ivaaliquot {
        width: 100px;

    }
</style>