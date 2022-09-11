<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Estado:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ purchaseorder.attributes.estado }}</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Usuario:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ user.attributes.name }}</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Fecha:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ purchaseorder.attributes.created_at | luxon('dd-MM-yyyy HH:mm') }}</span>
                </v-col>
            </v-row>
            
            
        </v-card-text>
    </v-card>   
</template>

<script>
export default {

    computed: {

    },
    props: {
        user:Object,
        purchaseorder: Object,
    }

}
</script>

<style>

</style>