<template>
    <div>
        <v-row class="">
            <v-col class="">
                <v-checkbox
                    class="mt-0 mb-1"
                    v-model="list_meta.show_images"
                    label="Fotos"
                    hide-details=""
                ></v-checkbox> 
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="[{name: 'Si', value: true}, {name: 'No', value: false}]"
                    item-text="name"
                    item-value="value"
                    v-model="filters.is_enable"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Habilitado"
                    clearable
                    @input="list_meta.page = 1"  
                >
                </v-select>
            </v-col>
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-select
                    dense
                    :items="[{name: 'Si', value: true}, {name: 'No', value: false}]"
                    item-text="name"
                    item-value="value"
                    v-model="filters.is_promo"
                    :menu-props="{ offsetY: true }"
                    hide-details=""
                    label="Promo"
                    clearable
                    @input="list_meta.page = 1"  
                >
                </v-select>
            </v-col>
            
            <v-col cols="12" sm="2" class="d-flex align-center">
                <v-text-field
                dense
                    v-model="filters.q"
                    label="Nombre"    
                    @keyup.enter="buscar_q"    
                    hide-details=""                            
                ></v-text-field>
            </v-col>
            
            <v-col cols="12" sm="1" class="d-flex align-center">
                <v-btn small
                    @click="buscar_q"
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
                            <th v-if="list_meta.show_images" style="width: 110px;" class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Foto
                            </th>
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
                                v-if="user.role != 'VENDEDOR'"
                                style="width: 100px;"   
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Costo
                            </th>
                            <th 
                                style="width: 100px;"   
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Pre-min
                            </th>
                            <th 
                                v-if="user.role != 'VENDEDOR'"
                                style="width: 100px;"   
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Porc-min
                            </th>
                            <th 
                                style="width: 100px;"   
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Pre-may
                            </th>
                            <th 
                                v-if="user.role != 'VENDEDOR'"
                                style="width: 100px;"   
                                class="pl-1 text-start font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Porc-may
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
                        <td v-if="list_meta.show_images" >
                            <v-row class="">
                                <v-col class="pl-0" >
                                    
                                    <Photoswipe
                                        v-if="item.attributes.image1"  
                                        :options="{bgOpacity: 0.5}">
                                        <v-card
                                            v-pswp="{
                                                src: item.attributes.image1,
                                                msrc: item.attributes.image1
                                            }"
                                            :style="getImageItemStyle(item.attributes.image1)"
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
                        <td>{{ item.id }}</td>
                        <td v-if="item.attributes.is_enable" >{{ item.attributes.name }}</td>
                        <td v-else class="text--disabled">{{ item.attributes.name }}</td>
                        
                        
                        
                        <td 
                            v-if="user.role != 'VENDEDOR'"
                            class="text-right">
                            
                            <span v-if="item.relationships.stockproduct.attributes.is_stock_unitario_variable">{{ globalHelperFixeDecimalMoney(globalHelperCalculaCostoStockUnitario(item.relationships.stockproduct.attributes.costo, item.attributes.relacion_venta_stock, item.relationships.stockproduct.attributes.stock_aproximado_unidad)) }}</span>
                            <span v-else>{{ globalHelperFixeDecimalMoney(globalHelperCalculaCosto(item.relationships.stockproduct.attributes.costo, item.attributes.relacion_venta_stock)) }}</span>
                        </td>
                        

                        <td class="text-right">{{ globalHelperFixeDecimalMoney(item.attributes.precio_min) }}</td>
                        
                        <td 
                            v-if="user.role != 'VENDEDOR'"
                            class="text-right">{{ globalHelperFixeDecimalPorcentaje(item.attributes.porc_min) }}</td>
                        <td class="text-right">{{ globalHelperFixeDecimalMoney(item.attributes.precio_may) }}</td>
                        <td 
                            v-if="user.role != 'VENDEDOR'"
                            class="text-right">{{ globalHelperFixeDecimalPorcentaje(item.attributes.porc_may) }}</td>
                        <td>
                            <v-btn
                                icon
                                @click="setItem(item)"
                            >
                                <v-icon>mdi-eye</v-icon>
                            </v-btn>
                            <SaleproductEditValues
                                v-if="user.role != 'VENDEDOR'"
                                :saleproduct="item"
                            />
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
import SaleproductEditValues from '@/components/admin/saleproducts/list/SaleproductEditValues'

export default {
    data: () => ({

    }),

    computed: {
        ...mapGetters({
            url_asset: 'url_asset',
            user: 'auth/user',
            items: 'saleproducts_manager/items',
            filters: 'saleproducts_manager/filters',
            list_meta: 'saleproducts_manager/list_meta',
        })
    },
    components: {
        SaleproductEditValues
    },
    methods: {
        ...mapActions({
            set_item: 'saleproducts_manager/set_item'
        }),
        setItem (item) {
            this.set_item(item)
            this.$router.replace({
                name: 'saleproduct',
                params: {
                    id: item.id
                }
            })
        },
        set_precio_item (item) {
            this.set_item (item)
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
        buscar_q() {
            this.list_meta.page = 1
            this.$emit('getItems')
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
        
    }
}
</script>

<style>

</style>