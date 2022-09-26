<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Sucursal:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ stocktransfer.relationships.sucursal_destino.attributes.name }}</span>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Usuario:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span v-if="stocktransfer.relationships.user_destino">{{ stocktransfer.relationships.user_destino.attributes.name }}</span>
                </v-col>
            </v-row> 
            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Recibido:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ stocktransfer.attributes.recibido_at | luxon('dd-MM-yyyy HH:mm') }}</span>
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