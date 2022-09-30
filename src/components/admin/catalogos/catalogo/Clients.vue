<template>
    <div v-if="item">
        

        <v-row class="">
            <v-spacer></v-spacer>
            
            <v-col cols="12" sm="4" class="d-flex align-center">
                <v-text-field
                    dense
                    v-model="filters.q"
                    label="Nombre"       
                    hide-details=""
                    @input="list_meta.page = 1"                           
                ></v-text-field>
            </v-col>
            
            
        </v-row>
        
        <v-row>
            <v-col>
                <v-simple-table
                    dense
                >
                    <template v-slot:default>
                    <thead>
                        <tr>
                            <th 
                                style="width: 50px;"
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Id
                            </th>

                            <th 
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Nombre
                            </th>                           
                        
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="client in items_visibles"
                            :key="client.id"
                        >
                        <td>{{ client.id }}</td>
                        <td v-if="client.attributes.tipo_persona == 'FISICA'" >{{ client.attributes.name + ' ' + client.attributes.surname }}</td>
                        <td v-else>{{ client.attributes.name }}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </v-col>
        </v-row>
        <v-row>
            <v-spacer></v-spacer>
            <v-col cols="12" md="4" class="d-flex align-center justify-center justify-md-end   pt-1 pb-1">
                <span class=" font-weight-bold text-caption grey--text font-weight-light">Items per page:</span>
                <div style="width: 75px; ">                                
                    <v-select
                        :items="list_meta.select_limit_items"
                        v-model="list_meta.limit"
                        label="Standard"
                        hide-details=""
                        single-line
                        class="rounded-sm ml-1 text-caption font-weight-light"
                        solo
                        dense
                        
                    ></v-select>
                </div>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center justify-md-end  pt-1 pb-1">
                <v-pagination
                    v-model="list_meta.page"
                    :length="cant_pages"
                    :total-visible="5"
                    
                    :disabled="cant_pages <2"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                ></v-pagination>
            </v-col>
        </v-row>
        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    created() {
        
    },
    computed: {
        ...mapGetters({
            item: 'catalogos_manager/item',
        }),
        cant_pages: function (){
            return Math.ceil(this.items_search.length / this.list_meta.limit)
        },
        items_search: function () {
            return this.item.relationships.clients.filter((i) => {

                if( i.attributes.name.toUpperCase().includes(this.filters.q.toUpperCase()) || i.attributes.surname.toUpperCase().includes(this.filters.q.toUpperCase()) ) {
                        return true
                    }

                
                return false
            })
        } ,
        items_visibles: function () {
            let ini = (this.list_meta.page * this.list_meta.limit) - this.list_meta.limit
            let fin = (this.list_meta.page * this.list_meta.limit)
            

            return this.items_search.slice(ini, fin)
        }
    },
    components: {

    },
    data () {
        return {
            filters: {
                q: '',
            },
            list_meta: {
                select_limit_items: [5, 10, 15, 20],
                page: 1,
                limit: 10,
            },
        }
    },
    methods: {
        ...mapActions({
            
        }),
        
        nuevo_subitem () {

        },

        volver() {
            this.$emit('volver')
        },

        reload_item () {
            this.$emit('reload_item')
        },

    }
}
</script>

<style>
    
</style>