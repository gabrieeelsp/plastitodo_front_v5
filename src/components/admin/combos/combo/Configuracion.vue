<template>
    <div v-if="item_cache">
        <v-row>
            <v-col class="6">
                <span class="text-h6 text--black font-weight-medium">{{ item_cache.attributes.name }}</span>
            </v-col>
        
                    
            <v-col sm="12">
                <v-row>
                    <v-col>
                        <v-simple-table style="border: 1px solid #cfcdcc"  >
                            <template v-slot:default>
                            <tbody>

                                <tr >
                                    <td style="width: 110px;" ><span >P-Lista-Min:</span></td>
                                    <td class="text-right">$ {{ globalHelperFixeDecimalMoney(getPrecioMinCombo) }}</td>
                                    <td style="width: 110px;" ><span >Desc-Min:</span></td>
                                    <td 
                                        style="width: 110px;"
                                        v-if="!item_cache.is_editing_desc_min" 
                                        class="text-right"
                                        @dblclick="item_cache.is_editing_desc_min = true"
                                        >% {{ globalHelperFixeDecimalPorcentaje(item_cache.attributes.desc_min) }}</td> 
                                    <td style="width: 110px;" v-else >
                                        <InputEditValue 
                                            :item="{
                                                id: 0,
                                                value: item_cache.attributes.desc_min
                                            }"

                                            @close="item.is_editing_desc_min = false"
                                            @accept="set_desc_min"
                                        />
                                    </td>
                                    <td style="width: 110px;" ><span >Precisión:</span></td>
                                    <td style="width: 120px;" class="text-right">
                                        <v-select
                                        class="mt-0"
                                            dense
                                            :items="[{name: '-3', value: -3}, {name: '-2', value: -2}, {name: '-1', value: -1}, {name: '0', value: 0}, {name: '1', value: 1}, {name: '2', value: 2}, {name: '3', value: 3}]"
                                            item-text="name"
                                            item-value="value"
                                            v-model="item_cache.attributes.precision_min"
                                            :menu-props="{ offsetY: true }"
                                            hide-details

                                        >
                                        </v-select>
                                    </td>  
                                    <td style="width: 110px;" ><span >Precio-Min:</span></td>
                                    <td class="text-body-1 text-right font-weight-medium">$ {{ globalHelperFixeDecimalMoney(getPrecioMinDescCombo) }}</td>                                        
                                </tr>
                                <tr >
                                    <td style="width: 110px;" ><span >P-Lista-May:</span></td>
                                    <td class="text-right">$ {{ globalHelperFixeDecimalMoney(getPrecioMayCombo) }}</td>
                                    <td style="width: 110px;" ><span >Desc-May:</span></td>
                                    <td 
                                        style="width: 110px;"
                                        v-if="!item_cache.is_editing_desc_may" 
                                        class="text-right"
                                        @dblclick="item_cache.is_editing_desc_may = true"
                                        >% {{ globalHelperFixeDecimalPorcentaje(item_cache.attributes.desc_may) }}</td> 
                                    <td style="width: 110px;" v-else >
                                        <InputEditValue 
                                            :item="{
                                                id: 0,
                                                value: item_cache.attributes.desc_may
                                            }"

                                            @close="item.is_editing_desc_may = false"
                                            @accept="set_desc_may"
                                        />
                                    </td>
                                    <td style="width: 110px;" ><span >Precisión:</span></td>
                                    <td style="width: 120px;" class="text-right">
                                        <v-select
                                        class="mt-0"
                                            dense
                                            :items="[{name: '-3', value: -3}, {name: '-2', value: -2}, {name: '-1', value: -1}, {name: '0', value: 0}, {name: '1', value: 1}, {name: '2', value: 2}, {name: '3', value: 3}]"
                                            item-text="name"
                                            item-value="value"
                                            v-model="item_cache.attributes.precision_may"
                                            :menu-props="{ offsetY: true }"
                                            hide-details

                                        >
                                        </v-select>
                                    </td>  
                                    <td style="width: 110px;" ><span >Precio-May:</span></td>
                                    <td class="text-body-1 text-right font-weight-medium">$ {{ globalHelperFixeDecimalMoney(getPrecioMayDescCombo) }}</td>                                        
                                </tr>

                            </tbody>
                            </template>
                        </v-simple-table>
                    </v-col>
                </v-row>
                            
            </v-col>
        </v-row>

        <v-row>
            <v-col class="ml-2 mr-2">
                <v-row>
                    <v-col class="d-flex justify-space-between align-center">
                        <span  class="text-subtitle-1 text--black font-weight-medium">Productos</span>
                        <ComboitemNewModal 
                            :combo="item_cache"

                            @comboitem_new="addComboitem"
                        />
                    </v-col>
                </v-row>
                <v-row >
                    <v-col>
                        <div v-for="comboitem in item_cache.relationships.comboitems" :key="comboitem.id" >
                            <v-simple-table style="border-top: 1px solid #cfcdcc"  >
                                <template v-slot:default>
                                <tbody>
                                    <tr >
                                        <td><span class="ml-3" :class="is_configuration_ok_comboitem(comboitem) ? '' : 'red--text'" > {{ comboitem.attributes.name }}</span></td>
                                        <td style="width: 100px;" class="text-right">{{ globalHelperFixeDecimalMoney(getPrecioMin(comboitem)) }}</td>
                                        <td style="width: 100px;" class="text-right">{{ globalHelperFixeDecimalMoney(getPrecioMay(comboitem)) }}</td>
                                            
                                        <td style="width: 100px;" class="text-right">{{ globalHelperFixeDecimalCantidad(comboitem.attributes.cantidad) }}</td>
                                        <td style="width: 95px;" class="pl-1 pr-1" >
                                            <div class="d-flex justify-end align-center">
                                                <v-btn small icon color="info" 
                                                    class=""
                                                    @click="comboitem.is_showing = !comboitem.is_showing"
                                                >
                                                    <v-icon>mdi-swap-vertical</v-icon>
                                                </v-btn>
                                                <ComboitemEditModal 
                                                    :comboitem="comboitem"

                                                    @comboitem_update="comboitem_update"
                                                />
                                                <ComboitemAddSaleproduct
                                                    :comboitem_id="comboitem.id"

                                                    @addSaleproduct="addSaleproduct"
                                                    
                                                />
                                            </div>
                                            
                                        </td>
                                        
                                    </tr>
                                </tbody>
                                </template>
                            </v-simple-table>
                            <v-expand-transition>
                            <div v-if="comboitem.is_showing">
                                <v-simple-table v-for="saleproduct in comboitem.relationships.saleproducts" :key="saleproduct.id">
                                    <template v-slot:default>
                                    <tbody>

                                        <tr >
                                            <td><span class="ml-6">* {{ saleproduct.attributes.name }}</span></td>
                                            <td style="width: 100px;" class="text-right">{{ globalHelperFixeDecimalMoney(saleproduct.attributes.precio_min) }}</td>
                                            <td style="width: 100px;" class="text-right">{{ globalHelperFixeDecimalMoney(saleproduct.attributes.precio_may) }}</td>
                                            <td style="width: 100px;" class="text-right" v-if="saleproduct.attributes.is_enable"><v-chip x-small class="mt-2 mb-2" color="success" >Enable</v-chip></td>
                                            <td style="width: 100px;" class="text-right" v-else><v-chip x-small class="mt-2 mb-2" color="warning" >Disable</v-chip></td>
        
                                            
                                            <td style="width: 95px;">
                                                <v-btn
                                                    icon
                                                    @click="saleproduct.attributes.is_enable = !saleproduct.attributes.is_enable"
                                                >
                                                    <v-icon>mdi-swap-horizontal</v-icon>
                                                </v-btn>
                                                
                                            </td>
                                            
                                        </tr>
                                    </tbody>
                                    </template>
                                </v-simple-table>
                            </div>
                            
                            </v-expand-transition>
                        </div>
                            
                 
                        
                        
                    </v-col>
                </v-row>
                

            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex justify-end">
                <v-btn                                    
                    @click="save_combo"
                    color="success"
                    :loading="is_saving"
                >                    
                    Guardar
                    <v-icon right>
                        mdi-content-save-outline
                    </v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import ComboitemNewModal from '@/components/admin/combos/combo/configuracion/ComboitemNewModal'
import ComboitemEditModal from '@/components/admin/combos/combo/configuracion/ComboitemEditModal'
import ComboitemAddSaleproduct from '@/components/admin/combos/combo/configuracion/ComboitemAddSaleproduct'
import InputEditValue from '@/components/admin/utils/InputEditValue'
export default {
    mounted() {
        this.$set(this.item_cache, 'is_editing_desc_min', false)
        this.$set(this.item_cache, 'is_editing_desc_may', false)
        for ( let comboitem of this.item_cache.relationships.comboitems ) {
            this.$set(comboitem, 'is_showing', false)
        }
    },
    data () {
        return {
            is_saving: false,
        }
    },

    computed: {
        ...mapGetters({
            item: 'combos_manager/item',
            item_cache: 'combos_manager/item_cache',
        }),


        getPrecioMinCombo ( ) {
            let precio = 0
            for ( let comboitem of this.item_cache.relationships.comboitems ) {
                precio = precio + this.getPrecioMin(comboitem)
            }
            return precio
        },
        getPrecioMayCombo ( ) {
            let precio = 0
            for ( let comboitem of this.item_cache.relationships.comboitems ) {
                precio = precio + this.getPrecioMay(comboitem)
            }
            return precio
        },
        getPrecioMinDescCombo ( ) {
            let precio =  this.getPrecioMinCombo * (1 - ( this.item_cache.attributes.desc_min / 100 ))
            let precision = 10 ** this.item_cache.attributes.precision_min

            return Math.round((precio + Number.EPSILON) * precision) / precision
        },
        getPrecioMayDescCombo ( ) {
            let precio =  this.getPrecioMayCombo * (1 - ( this.item_cache.attributes.desc_may / 100 ))
            let precision = 10 ** this.item_cache.attributes.precision_may

            return Math.round((precio + Number.EPSILON) * precision) / precision
        }

    },
    components: {
        
        ComboitemNewModal,
        ComboitemEditModal,
        ComboitemAddSaleproduct,
        InputEditValue,
    },

    methods: {
        ...mapActions({
            update_item_configuration: 'combos_manager/update_item_configuration',
        }),
        is_configuration_ok_comboitem ( comboitem ){
            for ( let saleproduct of comboitem.relationships.saleproducts ) {
                if ( saleproduct.attributes.is_enable ) {
                    return true
                }
            }
            return false
        },
        comboitem_update ( payload ) {
            for ( let comboitem of this.item_cache.relationships.comboitems ) {
                if ( comboitem.id == payload.comboitem_id ) {
                    comboitem.attributes.name = payload.name
                    comboitem.attributes.cantidad = payload.cantidad
                }
            }
        },
        async addSaleproduct ( payload ) {
            for ( let comboitem of this.item_cache.relationships.comboitems ) {
                if ( comboitem.id == payload.comboitem_id ) {
                    for ( let ci of this.item_cache.relationships.comboitems ) {
                        if ( this.comboitem_has_saleproduct( ci, payload.saleproduct.id ) ) {
                            this.$toast.error('El producto seleccionado ya se encuentra en el combo item.', { timeout: 3000 });
                            return null
                        }
                    }

                    await axios.get(`combos/get_saleproduct/${payload.saleproduct.id}`)
                        .then((resp) => {
                            console.log(resp.data.data)
                            if ( resp.data.data.relationships.stockproduct.attributes.is_stock_unitario_variable ) {
                                this.$toast.error('El producto seleccionado no se puede agregar a un Combo.', { timeout: 3000 });
                                return null
                            }
                            comboitem.relationships.saleproducts.push(resp.data.data)
                            comboitem.is_showing = true
                        })
                        .catch((error) => {
                            console.log(error)
                            this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                        })
                }
            }
        },

        comboitem_has_saleproduct ( comboitem, saleproduct_id ) {
            for ( let saleproduct of comboitem.relationships.saleproducts ) {
                if ( saleproduct.id == saleproduct_id ) {
                    return true
                }
            }
            return false
        },

        addComboitem ( payload ) {
            this.item_cache.relationships.comboitems.push({
                id: Math.floor(Math.random() * 100000) +1,
                type: "comboitems",
                attributes: {
                    name: payload.name, 
                    cantidad: payload.cantidad 
                }, 
                relationships: { 
                    saleproducts: [] 
                },
                is_showing: true
            })
        },


        getPrecioMin ( comboitem ) {
            let max = 0
            for ( let saleproduct of comboitem.relationships.saleproducts ) {
                if ( saleproduct.attributes.is_enable && saleproduct.attributes.precio_min > max ) {
                    max = saleproduct.attributes.precio_min
                }
            }
            return max * comboitem.attributes.cantidad
        },
        getPrecioMay ( comboitem ) {
            let max = 0
            for ( let saleproduct of comboitem.relationships.saleproducts ) {
                if ( saleproduct.attributes.is_enable && saleproduct.attributes.precio_may > max ) {
                    max = saleproduct.attributes.precio_may
                }
            }
            return max * comboitem.attributes.cantidad
        },

        set_desc_min ( itemEdited ) {
            this.item_cache.attributes.desc_min = itemEdited.value
            this.item_cache.is_editing_desc_min = false
        },
        set_desc_may ( itemEdited ) {
            this.item_cache.attributes.desc_may = itemEdited.value
            this.item_cache.is_editing_desc_may = false
        },

        save_combo () {
            this.is_saving = true
            this.update_item_configuration()
                .then((resp) => {
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                    this.item.relationships.comboitems = resp.data.data.relationships.comboitems
                    this.item.attributes.is_enable = resp.data.data.attributes.is_enable

                    this.item_cache.attributes.is_enable = resp.data.data.attributes.is_enable
                })
                .catch((error) => {
                    console.log(error)
                    this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                })
            this.is_saving = false
        },
        
    }

}
</script>

<style>

</style>