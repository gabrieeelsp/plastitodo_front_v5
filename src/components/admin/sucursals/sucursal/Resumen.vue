<template>
    <div v-if="item_cache">
        <v-form @submit.prevent="submit" ref="form" v-model="valid"     >
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
                    <span class="font-weight-bold black--text">Dirección</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.direccion"
                       
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Telefono</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.telefono"
                       
                    ></v-text-field>
                </v-col>
            </v-row>  
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Whatsapp</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.telefono_movil"
                       
                    ></v-text-field>
                </v-col>
            </v-row>  
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Punto de Venta FE</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.punto_venta_fe"
                       
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
            item_cache: 'sucursals_manager/item_cache',
            item: 'sucursals_manager/item'
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

        }
    },
    methods: {
        ...mapActions({
            update_item_resumen: 'sucursals_manager/update_item_resumen',
        }),
        reset () {
            this.item_cache.attributes.name = this.item.attributes.name
            this.item_cache.attributes.direccion = this.item.attributes.direccion
            this.item_cache.attributes.telefono = this.item.attributes.telefono
            this.item_cache.attributes.telefono_movil = this.item.attributes.telefono_movil
            this.item_cache.attributes.punto_venta_fe = this.item.attributes.punto_venta_fe
        },
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true
                await this.update_item_resumen()
                    .then(() => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                        this.item.attributes.name = this.item_cache.attributes.name
                        this.item.attributes.direccion = this.item_cache.attributes.direccion
                        this.item.attributes.telefono = this.item_cache.attributes.telefono
                        this.item.attributes.telefono_movil = this.item_cache.attributes.telefono_movil
                        this.item.attributes.punto_venta_fe = this.item_cache.attributes.punto_venta_fe

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

</style>