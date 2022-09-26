<template>
    <v-card>
        <v-card-text>

            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Estado:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ stocktransfer.attributes.estado }}</span>
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