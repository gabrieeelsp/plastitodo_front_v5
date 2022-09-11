<template>
    <div v-if="item_cache_new">
        <v-form @submit.prevent="submit" ref="form" v-model="valid"     >
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Nombre</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache_new.name"
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
                        v-model="item_cache_new.costo"
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
                        v-model="item_cache_new.ivaaliquot_id"
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
                        v-model="item_cache_new.is_stock_unitario_variable"
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
                        v-model="item_cache_new.stock_aproximado_unidad"
                        :rules="!item_cache_new.is_stock_unitario_variable ? [] : stock_aproximado_unidadRules"

                        :error-messages="errorStock_aproximado_unidadMessages"
                        @keydown="errorStock_aproximado_unidadMessages = ''"
                        :disabled="!item_cache_new.is_stock_unitario_variable"
                    ></v-text-field>
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
                        @click="volver"
                        color="warning"
                    >Cancelar</v-btn>
                    
                </v-col>
            </v-row>


        </v-form>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    
    computed: {
        ...mapGetters({
            item_cache_new: 'stockproducts_manager/item_cache_new',
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
            
            store_item_new: 'stockproducts_manager/store_item_new',
            set_reload_items: 'stockproducts_manager/set_reload_items',
        }),
        
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true
                await this.store_item_new()
                    .then((resp) => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                        this.set_reload_items ( true )
                        this.$router.push({
                            name: 'stockproduct',
                            params:  {
                                id: resp.data.data.id
                            }
                        })
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
        }
    }
}
</script>

<style>
    .select_ivaaliquot {
        width: 100px;

    }
</style>