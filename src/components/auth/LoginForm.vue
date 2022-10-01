<template>
    <v-form @submit.prevent="submit" ref="form" v-model="valid" >   

        <v-text-field
            solo
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            prepend-inner-icon="mdi-email"
            
            :error-messages="errorEmailMessages"
            @keyup="errorEmailMessages = ''"
        ></v-text-field>

        <v-text-field
            solo
                v-model="password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                label="Enter your password"

                prepend-inner-icon="mdi-lock"
                @click:append="showPassword = !showPassword"
                
                :error-messages="errorPasswordMessages"
                @keyup="errorPasswordMessages = ''"
            ></v-text-field>
            
        <v-btn
            block
            color="success"
            type="submit"
            :loading="loading"
            :disabled="loading"
            >
            Login
        </v-btn>
        <router-link to="/">Home</router-link>


    </v-form>
</template>

<script>
import { mapActions, mapGetters  } from 'vuex'
export default {
    data: () => ({
        valid: true,
        //email: 'test@mail.com',
        email: '',
        emailRules: [
            v => !!v || 'E-mail is required',
            v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        errorEmailMessages: '',
        showPassword: false,
        //password: 'secret999',
        password: '',
        passwordRules: [
            v => !!v || 'Password is required',
        ],
        errorPasswordMessages: '',
        loading: false,
    }),
    computed: {
        ...mapGetters({
            is_empleado: 'auth/is_empleado',
        })
    },

    methods: {
        ...mapActions({
            signIn: 'auth/signIn',
        }),
        validate () {
            this.$refs.form.validate()
        },

        submit() {
            this.validate()
            if( this.valid ){
            this.loading = true
            this.signIn({ 'email': this.email, 'password': this.password })
                .then(() => {
                this.loading = false
                this.$toast.success("Wellcome!", {
                    timeout: 3000
                });

                if(this.is_empleado){
                    
                    this.$router.replace({
                        name: 'sucursal_selector'
                    })
                }else {
                    this.$router.replace({
                        name: 'home'
                    })
                }
                
            }).catch((error) => {
                this.loading = false
                if (error.response) {
                    
                    if ( error.response.status === 401) {
                        this.$toast.error('Email and Password does not match.', { timeout: 3000 });
                    }
                } else if (error.request) {
                    // client never received a response, or request never left
                    this.$toast.error('Network error connection.', { timeout: 3000 });
                } else {
                    // anything else
                }
            })
            }else{
                console.log('noooo')
            }
        }
    }
}
</script>

<style>

</style>