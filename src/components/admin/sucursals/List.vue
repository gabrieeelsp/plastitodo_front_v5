<template>
    <div>
        <v-row class="">
            <v-spacer></v-spacer>
            
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-text-field
                dense
                    v-model="filters.q"
                    label="Nombre"    
                    hide-details=""                            
                ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="1" class="d-flex align-center">
                <v-btn small
                    @click="$emit('getItems')"
                >Search</v-btn>
                
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
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Actions
                            </th>
                        
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="item in items_visibles"
                        :key="item.id"
                        >
                        <td>{{ item.id }}</td>
                        <td >{{ item.attributes.name }}</td>
                        <td>
                            <v-btn
                                icon
                                @click="setItem(item)"
                            >
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                        </td>
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
                        @input="list_meta.page = 1"
                        
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

    data () {
        return {
            show_images: false,
            filters: {
                q: '',
                is_ordered: null,
                is_stock_low: null
            },
            list_meta: {
                select_limit_items: [5, 10, 15, 20],
                page: 1,
                limit: 10,
            },
        }
    },

    computed: {
        ...mapGetters({
            items: 'sucursals_manager/sucursals',
        }),
        items_visibles: function () {
            return this.items.filter((i) => {

                if( i.attributes.name.toUpperCase().includes(this.filters.q.toUpperCase())) {
                    return true
                }
                return false
            })
        } ,

        cant_pages: function (){
            return Math.ceil(this.items_visibles.length / this.list_meta.limit)
        },
    },
    methods: {
        ...mapActions({
            set_item: 'sucursals_manager/set_item'
        }),
        setItem (item) {
            this.set_item(item)
            this.$router.replace({
                name: 'sucursal',
                params: {
                    id: item.id
                }
            })
        },
    
    }
}
</script>

<style>

</style>