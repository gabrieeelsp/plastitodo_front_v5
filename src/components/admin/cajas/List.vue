<template>
    <div>
        <v-row class="">
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <SelectUser 
                    label="Usuario"
                    @setUser="setUser"
                    :user="filters.user"
                />
            </v-col>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="sucursals_select"
                    item-text="name"
                    item-value="id"
                    v-model="filters.sucursal_id"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Sucursal"
                    clearable
                >
                </v-select>
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
                                Usuario
                            </th>
                            <th 
                                style="width: 160px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Sucursal
                            </th>
                            <th 
                                style="width: 150px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Fecha
                            </th>
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Estado
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
                        <td >{{ item.relationships.user.data.attributes.name + ' ' + item.relationships.user.data.attributes.surname }}</td>
                        <td class="text-center">{{ item.relationships.sucursal.data.attributes.name }}</td>

                        <td class="text-center" >
                            <span>{{ item.attributes.created_at | luxon("dd-MM-yyyy HH:mm") }}</span>
                        </td>
                        <td class="text-center" >
                            <v-chip x-small class="ma-2 white--text" :color="colors_is_open(item.attributes.is_open)" >{{ item.attributes.is_open ? 'Abierta' : 'Cerrada' }}</v-chip>
                        </td>
                        
                        <td>
                            <v-btn
                                icon
                                @click="open_caja_modal(item)"
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
        <v-row v-show="user.role != 'VENDEDOR'">
            <v-col>

            </v-col>
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
                        :disabled="user.role == 'VENDEDOR'"
                    ></v-select>
                </div>
            </v-col>
            <v-col cols="12" md="4" class="d-flex align-center justify-center justify-md-end  pt-1 pb-1">
                <v-pagination
                    v-model="list_meta.page"
                    :length="list_meta.last_page"
                    :total-visible="5"
                    @input="setPage"
                    :disabled="list_meta.last_page <2 || user.role == 'VENDEDOR'"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                ></v-pagination>
            </v-col>
        </v-row>
        <ShowCajaModal 
            :dialogVisible="show_caja_modal"
            :caja="caja_showed"
            v-if="caja_showed && show_caja_modal" 
            @close="close_caja_modal"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectUser from '@/components/admin/users/SelectUser'
import ShowCajaModal from '@/components/admin/cajas/caja/ShowCajaModal.vue'


import axios from 'axios'
export default {
    
    components: {
        SelectUser,
        ShowCajaModal,
    },
    data () {
        return {
            caja_showed: null,
            show_caja_modal: false,
        }
    },

    computed: {
        ...mapGetters({
            items: 'cajas_manager/items',
            filters: 'cajas_manager/filters',

            list_meta: 'cajas_manager/list_meta',
            sucursals_select: 'sucursals_manager/sucursals_select',
            colors_is_open: 'cajas_manager/colors_is_open',

            user: 'auth/user',
        })
    },
    methods: {
        ...mapActions({
            set_item: 'cajas_manager/set_item'
        }),
        open_caja_modal (item) {
            axios.get(`cajas/${item.id}`)
                .then((resp) => {
                    console.log(resp.data.data)
                    //this.order_showed = resp.data.data
                    this.caja_showed = item
                    this.show_caja_modal = true
                })
            
        },
        close_caja_modal () {
            this.show_caja_modal = false
        },

        setLimit() {
            //this.set_list_meta_limt(this.limitSelected)
            this.list_meta.page = 1
            this.$emit('getItems')
        },
        setPage() {
            //this.set_list_meta_page(this.page)
            this.$emit('getItems')
        },
        setUser(user) {
            if ( user ) {
                this.filters.user_id = user.id
            }else {
                this.filters.user_id = null
            }            
        },

    }
}
</script>

<style>

</style>