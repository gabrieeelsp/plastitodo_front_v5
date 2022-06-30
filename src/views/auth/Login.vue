<template>
    <div  >
        <v-container style="height: 100vh;" class="green lighten-5"   fluid app>
            <v-row style="height: 100vh;">
            <v-spacer></v-spacer>
            <v-col align-self="center" cols="10" sm="8" md="6" lg="4"  >
                <v-card  class="">
                <v-card-title  class="d-flex justify-center"  ><h1 class="text-h4 grey--text text--darken-1">Member Login</h1></v-card-title>
                <v-card-text class="mt-2"

                >
                
                    <LoginForm />
                </v-card-text>

                </v-card>
            </v-col>
            <v-spacer></v-spacer>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import LoginForm from '@/components/auth/LoginForm'
export default {
    components: {
        LoginForm
    }
}
</script>

<style>

</style>