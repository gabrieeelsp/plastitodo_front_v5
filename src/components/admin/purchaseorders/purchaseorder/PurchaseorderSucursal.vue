<template>
    <v-card>
        <v-card-text>
            <v-row >
                <v-col cols="12" sm="3"  class="d-flex justify-start  pt-2 pb-1">
                    <span>Sucursal:</span>
                </v-col>
                <v-col cols="12" sm="9"  class="d-flex justify-start pt-1 pb-1">
                    <v-select
                        class="select_ivaaliquot ml-2"
                        dense
                        :menu-props="{ offsetY: true }"
                        :items="sucursals_select"
                        v-model="id"
                        item-text="name"
                        item-value="id"
                        @change="set_sucursal"
                        :disabled="item.attributes.estado != 'EDITANDO'"
                        
                    ></v-select>
                </v-col>
            </v-row>
            
            
            
        </v-card-text>
    </v-card>   
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    created() {
        if ( this.item.relationships.sucursal ) {
            this.id = this.item.relationships.sucursal.id
        }
    },
    data () {
        return {
            id: null,
        }
    },

    computed: {
        ...mapGetters({
            sucursals_select: 'sucursals_manager/sucursals_select',
            sucursals: 'sucursals_manager/sucursals',
            item: 'purchaseorders_manager/item',
        })
    },
    methods: {
        set_sucursal () {
            this.item.relationships.sucursal = this.sucursals.filter((i) => {
                if ( i.id == this.id ) {
                    return true
                }
                return false
            })[0]
        }
    }
}
</script>

<style>

</style>