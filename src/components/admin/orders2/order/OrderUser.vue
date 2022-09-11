<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-end pt-1 pb-1">
                    <span class="font-weight-bold black--text">Usuario:</span>
                </v-col>
                <v-col cols="12" sm="8"  class="d-flex justify-start pt-1 pb-1">
                    <span >{{ item.relationships.user.attributes.name + ' ' + item.relationships.user.attributes.surname }}</span>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-end pt-1 pb-1">
                    <span class="font-weight-bold black--text">Fecha:</span>
                </v-col>
                <v-col cols="12" sm="8"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ item.attributes.created_at | luxon("dd-MM-yyyy HH:mm")  }}</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-end pt-1 pb-1">
                    <span class="font-weight-bold black--text">Estado:</span>
                </v-col>
                <v-col cols="12" sm="8"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ item.attributes.state }}</span>
                </v-col>
            </v-row>
            <v-row v-if="item.relationships.sale">
                <v-col cols="12" sm="4"  class="d-flex justify-end pt-1 pb-1">
                    <span class="font-weight-bold black--text">Venta:</span>
                </v-col>
                <v-col cols="12" sm="8"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ item.relationships.sale.id  }} ( {{ item.relationships.sale.attributes.created_at| luxon("dd-MM-yyyy HH:mm") }} )</span>
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
            item: 'orders_manager/item'
        })
    }

}
</script>

<style>

</style>