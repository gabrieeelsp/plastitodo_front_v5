<template>
    <v-card>
        <v-card-text>
            
            <v-row>
                <v-col cols="12" sm="12"  class="d-flex justify-start pt-1 pb-1">
                    <span>Comentarios:</span>
                </v-col>
                <v-col cols="12" sm="12"  class="d-flex justify-start pt-1 pb-1">
                    <v-textarea
                        v-model="item.attributes.comments"
                        counter="200"
                        :rules="commentsRules"
                        :error-messages="errorCommentsMessages"
                        @keydown="errorCommentsMessages = ''"
                        rows="5"
                        auto-grow
                        outlined

                        :disabled="item.attributes.estado == 'CONFIRMADO'"
                    ></v-textarea>
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
            item: 'stockmovements_manager/item',
        })
    },
}
</script>

<style>

</style>