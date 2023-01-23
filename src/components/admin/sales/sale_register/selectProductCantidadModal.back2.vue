<template>
  

    <v-dialog
      v-model="intDialogVisible"
      max-width="900"
    >
      <v-card v-if="item.tipo != 'saleproduct' || saleproduct">
        <v-card-title class="text-h5">
            <span v-if="item.tipo == 'saleproduct'" class="">{{ saleproduct.attributes.name }}</span>
            <span v-else class="">{{ item.name }}</span>
        </v-card-title>
        <v-form @submit.prevent="accept" ref="form" v-model="valid" >
        <v-card-text>
            

            <v-row class="">
                
                <v-col cols="12" sm="6">
                    <v-row class="">
                        <v-col class="pt-0">
                            <v-card class="pa-0">
                                <v-img
                                    v-if="item.image1"                                    
                                    class="white--text align-end"
                                    
                                    :src="url_asset + item.image1"
                                >
                                </v-img>
                                <v-img
                                    v-else                                    
                                    class="white--text align-end"
                                    
                                    :src="url_asset + 'images/image_default.jpg'"
                                >
                                </v-img>
                            </v-card>
                        </v-col>
                    </v-row>
                    
                </v-col>
                <v-col cols="12" sm="6" class="">
                    
                        <v-row class="">
                            <v-col cols="12" sm="4"  class=" pb-0 d-flex justify-sm-start">
                                <span class="font-weight-bold black--text">Cantidad</span>
                            </v-col>
                            <v-col cols="12" sm="8"  class=" pt-0 pb-0">
                                <v-text-field
                                    class="right-text-input"
                                    dense
                                    type="number"
                                    v-model="cantidad"
                                    ref="input_cantidad"
                                    :rules="cantidadRules"
                                    :error-messages="errorCantidadMessages"
                                    @keydown="errorCantidadMessages = ''"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-start">
                                <span class="font-weight-bold black--text">Precio</span>
                            </v-col>
                            <v-col cols="12" sm="8"  class=" pt-0 pb-0">
                                <v-text-field
                                    class="right-text-input"
                                    dense
                                    type="number"
                                    v-model="precio"
                                    readonly
                                    
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        
                        <v-row>
                            <v-col class="d-flex justify-end">
                                <v-btn
                                    color="warning"
                                    text
                                    small
                                    @click="intDialogVisible = false"
                                >
                                    Cancelar
                                </v-btn>

                                <v-btn
                                    color="success"
                                    small
                                    type="submit"
                                    @click="accept"
                                >
                                    Aceptar
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-row v-if="saleproduct">
                            <v-col>
                                <div class="d-flex justify-space-between" v-for="saleproduct_sibling in saleproduct.relationships.stockproduct.relationships.saleproducts.filter((i) => { return i.id != saleproduct.id })" :key="saleproduct_sibling.id">
                                    <span>{{ saleproduct_sibling.attributes.name }}</span>
                                    <span>{{ precio_sibling(saleproduct_sibling) }}</span>
                                </div>
                            </v-col>
                        </v-row>
                    
                </v-col>

            </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>


        </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
  export default {
      mounted () {
        this.onload()
    },
    data () {
      return {
        cantidad: null,
        valid: true,
        cantidadRules: [
            v => ( v && v >= 0 ) || "Cantidad should be above 0",
        ],
        errorCantidadMessages: '',

        saleproduct: null,
      }
    },
    props: {
        dialogVisible: Boolean,
        item: Object
    
    },
    computed: {
        ...mapGetters({
            saleActive: 'sale_manager/saleActive',
            url_asset: 'url_asset',
        }),
        precio: function (){
            if ( this.item.tipo == 'saleproduct') {
                if ( this.is_promo ) {
                    if ( this.saleActive.client != null && this.saleActive.client.tipo == 'MAYORISTA' ) {
                        return this.globalHelperFixeDecimalMoney(this.globalHelerAplicaDescuento(this.saleproduct.attributes.precio_may, this.saleproduct.attributes.desc_may))
                    }
                    return this.globalHelperFixeDecimalMoney(this.globalHelerAplicaDescuento(this.saleproduct.attributes.precio_min, this.saleproduct.attributes.desc_min))    
                }
                if ( this.saleActive.client != null && this.saleActive.client.tipo == 'MAYORISTA' ) {
                    return this.globalHelperFixeDecimalMoney(this.saleproduct.attributes.precio_may)
                }
                return this.globalHelperFixeDecimalMoney(this.saleproduct.attributes.precio_min)
            }
            if ( this.item.tipo == 'combo') {
                if ( this.saleActive.client != null && this.saleActive.client.tipo == 'MAYORISTA' ) {
                    return this.globalHelperFixeDecimalMoney(this.item.precio_may)
                }
                return this.globalHelperFixeDecimalMoney(this.item.precio_min)
            }   
            return 0            

        },
        is_promo: function () {
            if ( this.saleproduct.attributes.fecha_desc_desde && (new Date(this.saleproduct.attributes.fecha_desc_desde).getTime() <= new Date().getTime()) && (new Date(this.saleproduct.attributes.fecha_desc_hasta).getTime() >= new Date().getTime()) ) {
                return true;
            }
            return false;
        },
        intDialogVisible: {
            get: function () {
                if (this.dialogVisible) {
                    
                // Some dialog initialization code could be placed here
                // because it is called only when this.dialogVisible changes
                }

                return this.dialogVisible
            },
            set: function (value) {
                    if (!value) {
                    this.$emit('close')
                    }
            }
        }
    },
    methods: {
        validate () {
            this.$refs.form.validate()
        },
        async accept() {
            this.validate()

            if ( this.valid ) {
                if ( this.item.tipo == 'saleproduct' ) {
                    
                    let name = this.saleproduct.attributes.name
                    if ( this.is_promo ) {
                        if ( this.saleActive.client != null && this.saleActive.client.tipo == 'MAYORISTA' ) {
                            name = name + ' [Promo - ' + Number(this.saleproduct.attributes.desc_may).toFixed(0) + ' %]'
                        }else {
                            name = name + ' [Promo - ' + Number(this.saleproduct.attributes.desc_min).toFixed(0) + ' %]'
                        }
                        
                    }

                    this.$emit('addItem', {
                        saleProductId: this.saleproduct.id,
                        name: name,
                        precio: this.precio,
                        stock: 0, //this.stock,
                        cantidad: this.cantidad,
                        image1: this.saleproduct.attributes.image1 ? this.url_asset + this.saleproduct.attributes.image1 : null,
                        image2: this.saleproduct.attributes.image2 ? this.url_asset + this.saleproduct.attributes.image2 : null,
                        image3: this.saleproduct.attributes.image3 ? this.url_asset + this.saleproduct.attributes.image3 : null,
                        is_editing_cantidad: false,
                        is_editing_precio: false,
                        is_stock_unitario_variable: Math.ceil(this.saleproduct.relationships.stockproduct.attributes.is_stock_unitario_variable, 0),
                        stock_aproximado_unidad: this.saleproduct.relationships.stockproduct.attributes.stock_aproximado_unidad,
                        cantidad_total: null,
                        is_editing_cantidad_total: false,
                        relacion_venta_stock: this.saleproduct.attributes.relacion_venta_stock

                    })
                }
                if ( this.item.tipo == 'combo' ) {

                    await axios.get('combos/' + this.item.id )
                        .then((resp) => {
                            //console.log(resp.data.data)
                            let combo = resp.data.data
                            let comboItems = []
                            for ( let itemCombo of combo.relationships.comboitems ) {
                                let saleproducts = []
                                let cantidad = 0
                                //if ( itemCombo.relationships.saleproducts.length == 1 ) {
                                if ( itemCombo.relationships.saleproducts.filter((i) => { return i.attributes.is_enable }).length == 1 ) {
                                    cantidad = this.cantidad * itemCombo.attributes.cantidad
                                }
                                for ( let saleproduct of itemCombo.relationships.saleproducts ) {
                                    if ( saleproduct.attributes.is_enable ) {
                                        let var_sale = {
                                            saleproductId: saleproduct.id,
                                            name: saleproduct.attributes.name,
                                            cantidad: Number(cantidad),
                                            image1: saleproduct.attributes.image1,
                                            //image1: this.url_asset + this.item.image1,
                                            //image2: this.url_asset + this.item.image2,
                                            //image3: this.url_asset + this.item.image3,
                                            is_editing_cantidad: false,
                                            barcode: saleproduct.attributes.barcode
                                        }
                                        saleproducts.push(var_sale)
                                        
                                    }                                    
                                }
                                comboItems.push({
                                    comboitemId: itemCombo.id,
                                    name: itemCombo.attributes.name,
                                    cantidad: itemCombo.attributes.cantidad,
                                    saleproducts: saleproducts,
                                    cantidad_combos: this.cantidad,
                                    is_editing_cantidades: false,
                                    name_filter: '',
                                    barcode_filter: '',
                                    is_complete () {
                                        let cant = 0
                                        for ( let saleproduct of this.saleproducts ) {
                                            cant = cant + Number(saleproduct.cantidad)
                                        }
                                        if ( cant  == Math.ceil(this.cantidad * this.cantidad_combos, 2) ) {
                                            return true
                                        }
                                        return false
                                    }
                                })
                            }
                            
                            this.$emit('addComboItem', {
                                comboId: combo.id,
                                name: combo.attributes.name,
                                precio: this.precio,
                                stock: 0, //this.stock,
                                cantidad: this.cantidad,
                                image1: this.url_asset + this.item.image1,
                                is_editing_cantidad: false,
                                comboItems: comboItems,
                                is_complete () {
                                        for ( let item of this.comboItems ) {
                                            if ( !item.is_complete() ) {
                                                return false
                                            }
                                        }
                                        return true
                                    }
                            })
                        })
                        .catch((error) => {
                            console.log(error)
                        })

                }


                
            }
            
        },
        async onload() {
            this.saleproduct = null
            if ( this.item.tipo == 'saleproduct' ) {
                await axios.get('s/' + this.item.id + '/g')
                    .then((resp) => {
                        this.saleproduct = resp.data.data
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }

            setTimeout(() => this.$refs.input_cantidad.$refs.input.focus(), 100); 
            
        },

        is_promo_sibling ( item ) {
            if ( item.attributes.fecha_desc_desde && (new Date(item.attributes.fecha_desc_desde).getTime() <= new Date().getTime()) && (new Date(item.attributes.fecha_desc_hasta).getTime() >= new Date().getTime()) ) {
                return true;
            }
            return false;
        },
        precio_sibling ( item ){
            if ( this.is_promo_sibling ( item ) ) {
                if ( this.saleActive.client != null && this.saleActive.client.tipo == 'MAYORISTA' ) {
                    return this.globalHelperFixeDecimalMoney(this.globalHelerAplicaDescuento(item.attributes.precio_may, item.attributes.desc_may))
                }
                return this.globalHelperFixeDecimalMoney(this.globalHelerAplicaDescuento(item.attributes.precio_min, item.attributes.desc_min))    
                }
            if ( this.saleActive.client != null && this.saleActive.client.tipo == 'MAYORISTA' ) {
                return this.globalHelperFixeDecimalMoney(item.attributes.precio_may)
            }
            return this.globalHelperFixeDecimalMoney(item.attributes.precio_min)             

        },
    }
  }
</script>