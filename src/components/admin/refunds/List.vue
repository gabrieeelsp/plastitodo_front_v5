<template>
    <div>
        <v-row class="">
            <v-spacer></v-spacer>

            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="[{name: 'Si', value: true}, {name: 'No', value: false}]"
                    item-text="name"
                    item-value="value"
                    v-model="filters.is_confirmed"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Confirmado"
                    clearable
                    @input="list_meta.page = 1"  
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
                                style="width: 160px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Fecha
                            </th>
                            <th 
                                style="width: 50px;"
                                class="pl-1 text-right font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Venta
                            </th>

                            <th 
                                class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Metodo
                            </th>
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Valor
                            </th>
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Estado
                            </th>
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
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
                        <td>{{ item.attributes.created_at | luxon('dd-MM-yyyy HH:mm') }}</td>
                        <td>{{ item.relationships.sale.id }}</td>
                        <td><span>{{ item.relationships.paymentmethod.name }}</span></td>
                        <td class="text-right" >{{ globalHelperFixeDecimalMoney(item.attributes.valor) | money_string }}</td>
                        <td class="text-center" >
                            <v-chip x-small class="ma-2 white--text" color="success" v-if="item.attributes.is_confirmed" >CONFIRMADO</v-chip>
                            <v-chip x-small class="ma-2 white--text" color="warning" v-else >NO CONFIRMADO</v-chip>
                        </td>
                        
                        <td class="text-center">
                            <v-btn
                                v-if="item.attributes.is_confirmed"
                                @click="no_confirm(item)"
                                small
                                color="warning"
                                icon
                                :disabled="!item.relationships.paymentmethod.requires_confirmation"
                            >
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                            <v-btn
                                v-if="!item.attributes.is_confirmed"
                                @click="confirm(item)"
                                small
                                color="success"
                                :disabled="!item.relationships.paymentmethod.requires_confirmation"
                            >
                                Confirmar
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
    
    components: {
        
    },
    data () {
        return {

        }
    },

    computed: {
        ...mapGetters({
            items: 'refunds_manager/items',
            filters: 'refunds_manager/filters',

            list_meta: 'refunds_manager/list_meta',
        })
    },
    methods: {
        ...mapActions({
            update_confirm: 'refunds_manager/update_confirm',
            update_no_confirm: 'refunds_manager/update_no_confirm',
        }),


        setLimit() {
            //this.set_list_meta_limt(this.limitSelected)
            this.list_meta.page = 1
            this.$emit('getItems')
        },
        setPage() {
            //this.set_list_meta_page(this.page)
            this.$emit('getItems')
        },
        setClint(client) {
            if ( client ) {
                this.filters.client_id = client.id
            }else {
                this.filters.client_id = null
            }
            
        },

        async confirm ( item ) {
            await this.update_confirm ( item.id )
                .then((resp) => {
                    for ( let refund of this.items ) {
                        if ( refund.id == item.id ) {
                            refund.attributes.is_confirmed = resp.data.data.attributes.is_confirmed
                        }
                    }
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                })
                .catch((error) => {
                    console.log(error)
                    this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                })
        },
        async no_confirm ( item ) {
            await this.update_no_confirm ( item.id )
                .then((resp) => {
                    for ( let refund of this.items ) {
                        if ( refund.id == item.id ) {
                            refund.attributes.is_confirmed = resp.data.data.attributes.is_confirmed
                        }
                    }
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                })
                .catch((error) => {
                    console.log(error)
                    this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                })
        }

    }
}
</script>

<style>

</style>