<template>
    <div v-if="item_cache">
        <v-form @submit.prevent="submit" ref="form" v-model="valid">
            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Nombre</span>
                </v-col>
                <v-col cols="12" sm="4"  class="d-flex align-center">
                    <span class=" text-body-1">{{ item_cache.attributes.name }}</span>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-sm-end align-center">
                    <span class="font-weight-bold black--text">Costo</span>
                </v-col>
                <v-col cols="12" sm="1"  class="d-flex align-center justify-end">
                    <span>{{ globalHelperFixeDecimalMoney(costo) }}</span>
                </v-col>

            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Porc Min</span>
                </v-col>
                <v-col cols="12" sm="1"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        reverse
                        dense
                        v-model="item_cache.attributes.porc_min"
                        :rules="porc_minRules"
                        :error-messages="errorPorc_minMessages"
                        @keydown="errorPorc_minMessages = ''"
                       
                    ></v-text-field>
                </v-col>

                <v-col cols="12" sm="1"  class="d-flex align-center justify-end">
                    <span>( {{ globalHelperFixeDecimalMoney(precio_min) }} )</span>
                </v-col>

            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Porc May</span>
                </v-col>
                <v-col cols="12" sm="1"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        reverse
                        dense
                        v-model="item_cache.attributes.porc_may"
                        :rules="porc_mayRules"
                        :error-messages="errorPorc_mayMessages"
                        @keydown="errorPorc_mayMessages = ''"
                       
                    ></v-text-field>
                </v-col>

                <v-col cols="12" sm="1"  class="d-flex align-center justify-end">
                    <span>( {{ globalHelperFixeDecimalMoney(precio_may) }} )</span>
                </v-col>

            </v-row>   
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Bacode</span>
                </v-col>
                <v-col cols="12" sm="2"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        v-if="!item_cache.attributes.barcode"
                        dense
                        v-model="barcode"
                        @keydown.enter.prevent=""
                    ></v-text-field>
                    <template v-else>
                        <VueBarcode
                            :height="50"
                            :value="item_cache.attributes.barcode">
                            Show this if the rendering fails.
                        </VueBarcode>
                        <v-btn
                        class="mt-1"
                            color="warning"
                            
                            text
                            @click="item_cache.attributes.barcode = null; barcode = ''"
                            x-small
                            >
                            Eliminar
                        </v-btn>
                    </template>
                </v-col>

            </v-row> 
            <v-row v-if="item_cache.attributes.barcode">
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    
                </v-col>
                <v-col cols="12" sm="2"  class=" pt-0 pb-0 d-flex">
                    <Etiqueta_29_62
                        :saleproduct="item"
                    />
                </v-col>

            </v-row>   

            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-sm-end align-center">
                    <span class="font-weight-bold black--text">Tags</span>
                </v-col>
                <v-col cols="12" sm="4"  class="d-flex justify-start align-center">
                    <div>
                    <v-chip
                        v-for="tag in ids_select.tags" :key="tag.id"
                        class="mr-2"
                        close
                        :color="tag.color"
                        text-color="white"
                        small
                        @click:close="removeTag(tag.id)"
                        >
                        {{ tag.name }}
                    </v-chip>
                    </div>
                    <SelectTagModal
                        disable="false"
                        :btn_data="{name: null, icon: 'mdi-plus'}"

                        @set="addTag"
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
import VueBarcode from 'vue-barcode';
import Etiqueta_29_62 from '@/components/admin/saleproducts/saleproduct/etiquetas/Etiqueta_29_62'
import SelectTagModal from '@/components/admin/tags/selectTagModal'

export default {
    mounted() {
        //this.onload()
    },
    components: {
        VueBarcode,
        Etiqueta_29_62,
        SelectTagModal
    },
    computed: {
        ...mapGetters({
            item_cache: 'saleproducts_manager/item_cache',
            item: 'saleproducts_manager/item',
            ids_select: 'saleproducts_manager/ids_select'
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
        }
    },
    data () {
        return {
            valid: true,
            is_saving: false,
            nameRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
            ],
            errorNameMessages: '',

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
            
            barcode: '',

        }
    },
    methods: {
        ...mapActions({
            update_item_resumen: 'saleproducts_manager/update_item_resumen',
        }),
        reset () {
            this.item_cache.attributes.name = this.item.attributes.name
            this.item_cache.attributes.porc_min = this.item.attributes.porc_min
            this.item_cache.attributes.porc_may = this.item.attributes.porc_may
            this.item_cache.attributes.barcode = this.item.attributes.barcode

            this.ids_select.tags = []
            for ( let tag of this.item.relationships.tags ) {
                this.ids_select.tags.push({id: tag.id, name: tag.attributes.name, color: tag.attributes.color})
            }

        },
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true
                await this.update_item_resumen({
                    barcode: this.barcode
                })
                    .then((resp) => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });

                        this.item.attributes.porc_min = resp.data.data.attributes.porc_min
                        this.item.attributes.porc_may = resp.data.data.attributes.porc_may 
                        this.item.attributes.barcode = resp.data.data.attributes.barcode  
                        
                        this.item_cache.attributes.porc_min = resp.data.data.attributes.porc_min
                        this.item_cache.attributes.porc_may = resp.data.data.attributes.porc_may 
                        this.item_cache.attributes.barcode = resp.data.data.attributes.barcode   
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
        removeTag(id) {
            this.ids_select.tags = this.ids_select.tags.filter((i) => {
                return i.id != id
            })
        },
        addTag(tag_nuevo) {
            let add = true
            for ( let tag of this.ids_select.tags ) {
                if (tag.id == tag_nuevo.id ) {
                    add = false
                    break
                }
            }
            if ( add ) {
                this.ids_select.tags.push({id: tag_nuevo.id, name: tag_nuevo.name, color: tag_nuevo.color})
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