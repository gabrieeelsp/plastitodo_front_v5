<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Sucursal:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ stocktransfer.relationships.sucursal_origen.attributes.name }}</span>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Usuario:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ stocktransfer.relationships.user_origen.attributes.name }}</span>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Fecha:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ stocktransfer.attributes.created_at | luxon('dd-MM-yyyy HH:mm') }}</span>
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
        stocktransfer: Object,
    }

}
</script>

<style>

</style>