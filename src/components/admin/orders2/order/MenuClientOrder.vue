<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-end pt-1 pb-1">
                    <span class="font-weight-bold black--text">Cliente:</span>
                </v-col>
                <v-col cols="12" sm="8"  class="d-flex justify-start pt-1 pb-1">
                    <span v-if="item.relationships.client.attributes.tipo_persona == 'FISICA'" >{{ item.relationships.client.attributes.name + ' ' + item.relationships.client.attributes.surname }}</span>
                    <span v-else >{{ item.relationships.client.attributes.name }}</span>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-end pt-1 pb-1">
                    <span class="font-weight-bold black--text">Tipo:</span>
                </v-col>
                <v-col cols="12" sm="8"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ item.relationships.client.attributes.tipo }}</span>
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