<template>
	<div>
        <v-row class="">
            <v-col>
                <v-checkbox
                    v-model="show_images"
                    label="Fotos"
                ></v-checkbox> 
            </v-col>
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
                <v-simple-table>
                    <template v-slot:default>
                        <thead>
                            <tr>

                                <th v-if="show_images" style="width: 110px;" class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    Foto
                                </th>
                                <th class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    Producto 
                                </th>
                                <th
                                    style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    Cantidad
                                </th>
                                <th 
                                    style="width: 90px;"
                                    class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    Actions
                                </th>
                                <th 
                                    style="width: 28px;"
                                    class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                    
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="stockmovementitem in items_visibles" :key="stockmovementitem.id" 
                                :class="stockmovementitem.is_confirmado ? 'light-green lighten-4' : ''"
                            >
                                <td v-if="show_images" >
                                    <v-row class="">
                                        <v-col class="pl-0" >
                                            
                                            <Photoswipe
                                                v-if="stockmovementitem.relationships.stockproduct.attributes.image"  
                                                :options="{bgOpacity: 0.5}">
                                                <v-card
                                                    v-pswp="{
                                                        src: stockmovementitem.relationships.stockproduct.attributes.image,
                                                        msrc: stockmovementitem.relationships.stockproduct.attributes.image
                                                    }"
                                                    :style="getImageItemStyle(stockmovementitem.relationships.stockproduct.attributes.image)"
                                                    style="display: inline-block"
                                                >
                                                </v-card>
                                            </Photoswipe>

                                            <v-card v-else class="">
                                                <v-img                               
                                                    class="white--text align-end mt-1 mb-1"
                                                    height="100px"
                                                    width="100px"
                                                    :src="url_asset + 'images/image_default.jpg'"
                                                    
                                                >
                                                </v-img>
                                                
                                                </v-card>
                                        </v-col>
                                    </v-row>
                                </td>
                                
                                <td>{{ stockmovementitem.relationships.stockproduct.attributes.name }}

                                    <span v-if="stockmovementitem.relationships.stockproduct.attributes.is_stock_unitario_variable"> [ {{ globalHelperFixeDecimalCantidad(stockmovementitem.relationships.stockproduct.attributes.stock_aproximado_unidad) }} ]</span>
                                </td>
                                <td 
                                    class="text-right"
                                    >{{ globalHelperFixeDecimalCantidad(stockmovementitem.attributes.cantidad) }}</td>

                                
                                <td>
                                    <StockmovementitemEdit
                                        :stockmovementitem="stockmovementitem"
                                        @setCantidad="setCantidad"
                                        :disabled="item.attributes.estado == 'CONFIRMADO'"
                                    />
                                    <v-btn
                                            small
                                            icon
                                            color="red"
                                            @click="remove_subitem(stockmovementitem.id)"
                                            :disabled="item.attributes.estado == 'CONFIRMADO'"
                                        >
                                            <v-icon>mdi-delete-outline</v-icon>
                                    </v-btn>

                                </td>
                                <td>
                                    <v-checkbox
                                        class="mt-0 pr-0"
                                        hide-details=""
                                        
                                        v-model="stockmovementitem.is_confirmado"
                                    ></v-checkbox>
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
import StockmovementitemEdit from '@/components/admin/stockmovements/stockmovement/StockmovementitemEdit'

export default {
    mounted () {
        this.orderItems();
        for ( let stockmovement of this.item.relationships.stockmovementitems ) {
            this.$set(stockmovement, 'is_confirmado', false)
        }
    },

	computed: {
        ...mapGetters({
            item: 'stockmovements_manager/item',
            url_asset: 'url_asset',
        }),
        cant_pages: function (){
            return Math.ceil(this.items_search.length / this.list_meta.limit)
        },
        items_search: function () {
            return this.item.relationships.stockmovementitems.filter((i) => {

                if( i.relationships.stockproduct.attributes.name.toUpperCase().includes(this.filters.q.toUpperCase())) {
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
        StockmovementitemEdit,
    },
    data () {
        return {
            show_images: false,
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
        ...mapActions ({
            remove_subitem: 'stockmovements_manager/remove_subitem'
        }),
        setCantidad ( payload ) {

            for ( let stockmovementitem of this.item.relationships.stockmovementitems ) {
                if ( stockmovementitem.id == payload.id ) {
                    stockmovementitem.attributes.cantidad = payload.cantidad
                    break
                }
            }
        },

        orderItems () {
            this.item.relationships.stockmovementitems.sort((a, b) => {
                let fa = a.relationships.stockproduct.attributes.name.toLowerCase(),
                    fb = b.relationships.stockproduct.attributes.name.toLowerCase()

                if (fa < fb) {
                    return -1;
                }
                if (fa > fb) {
                    return 1;
                }
                return 0;
            });
        },

        getImageItemStyle(src) {
            return {
                width: "100px",
                height: "100px",
                backgroundImage: `url(${src})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                
            };
        },
    },
}
</script>

<style>


</style>