<template>
    <div v-if="item_cache">
        <v-form @submit.prevent="submit" ref="form" v-model="valid"     >

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Condición frente al IVA</span>
                </v-col>
                <v-col cols="12" sm="3"  class=" pt-0 pb-0">
                    <v-select
                        dense
                        :menu-props="{ offsetY: true }"
                        :items="ivaconditions_select"
                        v-model="item_cache.relationships.ivacondition.id"
                        item-text="name"
                        item-value="id"
                    ></v-select>
                </v-col>

            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-0 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">
                        <v-select
                            class="select_doctype"
                            dense
                            :menu-props="{ offsetY: true }"
                            :items="doctypes_select"
                            v-model="item_cache.relationships.doctype.id"
                            item-text="name"
                            item-value="id"
                        ></v-select>

                    </span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.docnumber"
                       
                    ></v-text-field>
                </v-col>

            </v-row>
			
            <v-row v-if="item.attributes.tipo_persona == 'JURIDICA'">
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Nombre de Facturación</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.nombre_fact"
                       
                    ></v-text-field>
                </v-col>
            </v-row>
			<v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Dirección de Facturación</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.direccion_fact"
                       
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-0 pb-0 d-flex justify-sm-end">
                    
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-checkbox
                        class="mt-1 mb-1"
                        v-model="item_cache.attributes.is_fact_default"
                        label="Facturación por defecto"
                        color="green"
                        hide-details
                        ></v-checkbox>
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
export default {
    mounted() {
    
    },
    computed: {
        ...mapGetters({
            item_cache: 'clients_manager/item_cache',
            item: 'clients_manager/item',
			ids_select: 'clients_manager/ids_select',
			doctypes_select: 'doctypes_manager/doctypes_select',
            ivaconditions_select: 'ivaconditions_manager/ivaconditions_select',
        }),
		
    },
    data () {
        return {
            valid: true,
            is_saving: false,

        }
    },
    methods: {
        ...mapActions({
            update_item_facturacion: 'clients_manager/update_item_facturacion',
        }),
        reset () {
            if ( this.item.attributes.tipo_persona == 'FISICA' ) {
                this.item_cache.attributes.nombre_fact = this.item.attributes.nombre_fact
            }
			this.item_cache.relationships.ivacondition = this.item.relationships.ivacondition
            this.item_cache.relationships.doctype = this.item.relationships.doctype
            this.item_cache.attributes.docnumber = this.item.attributes.docnumber
			this.item_cache.attributes.direccion_fact = this.item.attributes.direccion_fact
            this.item_cache.attributes.is_fact_default = this.item.attributes.is_fact_default
        },
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true
                await this.update_item_facturacion()
                    .then((resp) => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                        if ( this.item.attributes.tipo_persona == 'FISICA' ) {
                            this.item.attributes.nombre_fact = this.item_cache.attributes.nombre_fact
                        }
						this.item.relationships.ivacondition = resp.data.data.relationships.ivacondition
                        this.item.relationships.doctype = resp.data.data.relationships.doctype
                        this.item.attributes.docnumber = this.item_cache.attributes.docnumber
						this.item.attributes.direccion_fact = this.item_cache.attributes.direccion_fact
                        this.item.attributes.is_fact_default = this.item_cache.attributes.is_fact_default
                        
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
    .select_doctype {
        width: 150px;
    }
</style>