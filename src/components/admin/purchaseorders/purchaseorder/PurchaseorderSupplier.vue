<template>
    <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" sm="3"  class="d-flex justify-start pt-1 pb-1">
                    <span>Proveedor:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <span>{{ supplier.attributes.name }}</span>
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
    },
    props: {
        supplier:Object
    }

}
</script>

<style>

</style>