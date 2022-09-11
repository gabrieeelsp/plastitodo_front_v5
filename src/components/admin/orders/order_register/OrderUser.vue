<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-end pt-1 pb-1">
                    <span class="font-weight-bold black--text">Usuario:</span>
                </v-col>
                <v-col cols="12" sm="8"  class="d-flex justify-start pt-1 pb-1">
                    <span v-if="orderActive.user" >{{ orderActive.user.name + ' ' + orderActive.user.surname }}</span>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-end pt-1 pb-1">
                    <span class="font-weight-bold black--text">Fecha:</span>
                </v-col>
                <v-col cols="12" sm="8"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ orderActive.created_at | luxon("dd-MM-yyyy HH:mm")  }}</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-end pt-1 pb-1">
                    <span class="font-weight-bold black--text">Estado:</span>
                </v-col>
                <v-col cols="12" sm="8"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ orderActive.state }}</span>
                </v-col>
            </v-row>
            <v-row v-if="orderActive.sale">
                <v-col cols="12" sm="4"  class="d-flex justify-end pt-1 pb-1">
                    <span class="font-weight-bold black--text">Venta:</span>
                </v-col>
                <v-col cols="12" sm="8"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ orderActive.sale.id  }} ( {{ orderActive.sale.attributes.created_at| luxon("dd-MM-yyyy HH:mm") }} )</span>
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