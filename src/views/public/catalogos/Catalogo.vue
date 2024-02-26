<template>
  <div class="pa-sm-3" v-if='item'  >
        <v-row>
            <v-col cols="12" md="12">
                <v-card class="">
                    
                    <v-card-text >
                        <Catalogo :catalogo="item" :title="'Catalogo ' +  item.attributes.name"></Catalogo>


                    </v-card-text>
                </v-card>
            </v-col>
            
        </v-row>
        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Catalogo from '@/components/admin/catalogos/list/Catalogo.vue'
export default {
    created() {
        this.key = this.$route.query.key;
        this.buscar()
    },
    mounted() {
        
    },
    data() {
        return {
            key: null,
        }
    },
    components: {
        Catalogo,
    },
    computed: {
        ...mapGetters({
            item: 'catalogos_manager/item',
        }),
    },
    methods: {
        ...mapActions({
            buscar_item: 'catalogos_manager/buscar_item_by_key',
            set_item: 'catalogos_manager/set_item',
        }),
        buscar () {
            this.buscar_item(this.key)
                .then((resp) => {
                    if ( !this.item ) {
                        //console.log(resp.data.data)
                        this.set_item(resp.data.data)
                    }else {
                        this.$set(this.item.relationships, 'saleproducts', resp.data.data.relationships.saleproducts)
                        this.$set(this.item.relationships, 'clients', resp.data.data.relationships.clients)
                    }

                    

                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
}
</script>

<style>

</style>