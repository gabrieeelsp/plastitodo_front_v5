<template>
  <v-menu left bottom offset-y >
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on" >
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>

                    <v-list dense width="200">
                        <v-subheader class="grey lighten-3 d-flex justify-center"><span><b>Settings</b></span></v-subheader>
                        <v-list-item>
                            <v-list-item-icon class="mr-1">
                                <v-icon small >mdi-account</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content >
                                <v-list-item-title >Profile</v-list-item-title>
                            </v-list-item-content>
                            
                        </v-list-item>
                        <v-list-item                           
                            
                        >
                            <v-list-item-icon class="mr-1">
                                <v-icon small >mdi-crop</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content >
                                <v-list-item-title >Settings</v-list-item-title>
                            </v-list-item-content>
                            
                        </v-list-item>
                        <v-divider></v-divider>
                        <v-list-item

                            @click="signOut"
                            class=""
                        >
                            
                            <v-list-item-icon class="mr-1">
                                <v-icon small >mdi-logout</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content >
                                <v-list-item-title >Log out</v-list-item-title>
                            </v-list-item-content>
                            
                        </v-list-item>
                    </v-list>
                </v-menu>
</template>

<script>
import {  mapActions } from 'vuex'
export default {
    methods: {
        ...mapActions({
            signOutAction: 'auth/signOut'
        }),

        signOut () {            
            this.signOutAction().then(() => {
                this.$router.replace({
                    name: 'login'
                })
            })
            .catch((e) => {
                console.log(e)
            });           
        }
    }
}
</script>

<style>

</style>