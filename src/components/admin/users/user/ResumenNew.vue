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
                    <span class="font-weight-bold black--text">Apellido</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache_new.surname"
                        :rules="surnameRules"
                        :error-messages="errorSurnameMessages"
                        @keydown="errorSurnameMessages = ''"
                       
                    ></v-text-field>
                </v-col>
            </v-row>
             
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Email</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache_new.email"
                       
                    ></v-text-field>
                </v-col>
            </v-row>     

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Password</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache_new.password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        @click:append="show1 = !show1"
                       
                    ></v-text-field>
                </v-col>
            </v-row> 
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Password Confirmation</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache_new.password_confirmation"
                        :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show2 ? 'text' : 'password'"
                        @click:append="show2 = !show2"
                       
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
            item_cache_new: 'users_manager/item_cache_new',
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

            surnameRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
            ],
            errorSurnameMessages: '',

            show1: false,
            show2: false,

        }
    },
    methods: {
        ...mapActions({    
            set_item: 'users_manager/set_item',        
            store_item_new: 'users_manager/store_item_new',
            set_reload_items: 'users_manager/set_reload_items',
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
                        //console.log(resp)
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                        this.set_reload_items ( true )
                        this.set_item(null)
                        this.$router.push({
                            name: 'user',
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