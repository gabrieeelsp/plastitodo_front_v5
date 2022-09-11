<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-end pt-1 pb-1">
                    <span>Saldo:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-end pt-1 pb-1">
                    <span class="text-body-1 font-weight-medium">$ {{ globalHelperFixeDecimalMoney(client.attributes.saldo) }}</span>
                </v-col>
            </v-row>   

            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-end pt-1 pb-1">
                    <span>Crédito:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-end pt-1 pb-1">
                    <span class="text-body-2 font-weight-medium">$ {{ globalHelperFixeDecimalMoney(client.attributes.credito_disponible) }}</span>
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
        client:Object,
    }

}
</script>

<style>

</style>