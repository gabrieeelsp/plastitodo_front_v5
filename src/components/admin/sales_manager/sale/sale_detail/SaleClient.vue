<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Cliente:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span v-if="sale.relationships.client">{{ sale.relationships.client.attributes.name }}</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Tipo:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span v-if="sale.relationships.client">{{ sale.relationships.client.attributes.tipo }}</span>
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
            sale: 'sales_manager/sale'
        })
    }

}
</script>

<style>

</style>