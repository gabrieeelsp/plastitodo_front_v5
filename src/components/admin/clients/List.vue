<template>
    <div>
        <v-row class="">
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="[
                        {
                            name: 'MINORISTA',
                            id: 'MINORISTA'
                        },
                        {
                            name: 'MAYORISTA',
                            id: 'MAYORISTA'
                        }
                    ]"
                    item-text="name"
                    item-value="id"
                    v-model="filters.tipo"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Tipo de cliente"
                    clearable
                >
                </v-select>
            </v-col>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="ivaconditions_select"
                    item-text="name"
                    item-value="id"
                    v-model="filters.ivacondition_id"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Condición IVA"
                    clearable
                >
                </v-select>
            </v-col>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-text-field
                dense
                    v-model="filters.q"
                    label="Nombre"    
                    @keyup.enter="$emit('getItems')"    
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
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Tipo
                            </th>
                            <th                                 
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Iva
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
                        v-for="item in items"
                        :key="item.id"
                        >
                        <td>{{ item.id }}</td>
                        <td >{{ item.attributes.name }} <span v-if="item.attributes.tipo_persona == 'FISICA'">{{ item.attributes.surname }}</span></td>
                        <td>{{ item.attributes.tipo }}</td>
                        <td>{{ item.relationships.ivacondition.attributes.name }}</td>
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
                        @input="setLimit"
                    ></v-select>
                </div>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center justify-md-end  pt-1 pb-1">
                <v-pagination
                    v-model="list_meta.page"
                    :length="list_meta.last_page"
                    :total-visible="5"
                    @input="setPage"
                    :disabled="list_meta.last_page <2"
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

    computed: {
        ...mapGetters({
            items: 'clients_manager/items',
            filters: 'clients_manager/filters',
            ivaconditions_select: 'ivaconditions_manager/ivaconditions_select',

            list_meta: 'clients_manager/list_meta',
        })
    },
    methods: {
        ...mapActions({
            set_item: 'clients_manager/set_item'
        }),
        setItem (item) {
            this.set_item(item)
            this.$router.replace({
                name: 'client',
                params: {
                    id: item.id
                }
            })
        },

        setLimit() {
            //this.set_list_meta_limt(this.limitSelected)
            this.$emit('getItems')
        },
        setPage() {
            //this.set_list_meta_page(this.page)
            this.$emit('getItems')
        },
    }
}
</script>

<style>

</style>