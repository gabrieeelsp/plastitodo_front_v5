<template>
    <div>
        <v-row>
            <v-col cols="12" lg="6">
                <v-card color="blue darken-1" dark>
                    <v-card-title>
                        <span >Venta Total</span>
                    </v-card-title>
                    <v-card-text class="d-flex justify-end">
                        <span class="text-h5">{{ venta_total | money_string_arg }}</span>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" lg="6">
                <v-card color="green darken-1" dark>
                    <v-card-title>
                        <span >Facturacion </span> <span class="ml-2"> ( %{{ porc_facturacion }} )</span>
                    </v-card-title>
                    <v-card-text class="d-flex justify-end">
                        <span class="text-h5">{{ facturacion | money_string_arg }}</span>
                    </v-card-text>
                </v-card>
            </v-col>
            
        </v-row>
        
    </div>
</template>

<script>
export default {
    props: {
        venta_total: Number,
        facturacion: Number,
    }, 

    computed: {
        porc_facturacion: function () {
            const porc = ((this.facturacion / this.venta_total) *100 ).toFixed(2);
            return porc;
        }
    }
}

</script>