<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-end pt-1 pb-1 align-center">
                    <span class="font-weight-bold black--text">Cant Bultos:</span>
                </v-col>
                <v-col cols="12" sm="8"  class="d-flex justify-start pt-1 pb-1 align-center">
                    <v-text-field
                        v-model="orderActive.cant_bultos"
                        
                        
                        dense
                    ></v-text-field>
                </v-col>
            </v-row>

            
            
        </v-card-text>
    </v-card>   
</template>

<script>
import { mapGetters } from 'vuex'
export default {

    computed: {
        ...mapGetters({
            orderActive: 'order_manager/orderActive'
        })
    }

}
</script>

<style>

</style>