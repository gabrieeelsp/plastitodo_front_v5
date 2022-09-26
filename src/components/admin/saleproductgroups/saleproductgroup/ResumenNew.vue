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
            item_cache_new: 'saleproductgroups_manager/item_cache_new',
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
            store_item_new: 'saleproductgroups_manager/store_item_new',
            set_item: 'saleproductgroups_manager/set_item',
            set_reload_items: 'saleproductgroups_manager/set_reload_items',
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
                        this.set_item(null)
                        this.$router.push({
                            name: 'saleproductgroup',
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