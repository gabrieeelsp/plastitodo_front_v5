<template>
  

    <v-dialog
      v-model="intDialogVisible"
      max-width="900"
    >
      <v-card>
        <v-card-title class="text-h5">
            
          
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-col>
                    <v-simple-table v-if="items" >
                        <template v-slot:default>
                        <thead>
                            <tr>
                            <th class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Producto 
                            </th>
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Precio
                            </th>
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Actual
                            </th>
                            <th 
                                style="width: 100px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                %
                            </th>
                            <th 
                                style="width: 40px;"
                                class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-3">
                                Actualizar
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                            v-for="item in items.filter((i) => { return Number(i.precio) != Number(i.precio_actualizado) })"
                            :key="item.id"
                            :class="item.actualizar_precio ? 'light-green lighten-4' : ''"
                            >
                            <td>{{ item.name }}</td>
                            <td class="text-right">{{ globalHelperFixeDecimalMoney(item.precio) }}</td>
                            <td class="text-right">{{ globalHelperFixeDecimalMoney(item.precio_actualizado) }}</td>
                            <td class="text-right">{{ globalHelperFixeDecimalPorcentaje(get_porc_diferencia(item)) }}</td>
                            <td class="d-flex justify-center align-center" >
                                <v-checkbox
                                    class="mt-0 pr-0"
                                    hide-details=""
                                    
                                    v-model="item.actualizar_precio"
                                ></v-checkbox>
                            </td>
                            </tr>
                        </tbody>
                        </template>
                    </v-simple-table>
                </v-col>
            </v-row>
            

            <v-row class="">
                
                
                <v-col cols="12" sm="12" class="">
                        <v-row>
                            <v-col class="d-flex justify-end align-center">
                                <span class="display-1 blue--text darken-4">{{ globalHelperFixeDecimalMoney(total_order) | money_string }}</span>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="warning"
                                    text
                                    
                                    @click="intDialogVisible = false"
                                >
                                    Cancelar
                                </v-btn>

                                <v-btn
                                    color="success"
                                    
                                    type="submit"
                                    @click="accept"
                                >
                                    Aceptar
                                </v-btn>
                            </v-col>
                        </v-row>
                    
                </v-col>

            </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>


        </v-card-actions>

      </v-card>
    </v-dialog>
  
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
      mounted () {
        this.onLoad()
    },
    data () {
      return {
        items: null
      }
    },
    props: {
        dialogVisible: Boolean,
        order: Object
    
    },
    computed: {
        ...mapGetters({
            orderActive: 'order_manager/orderActive',
        }),
        
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
        },

        total_order: function ( ) {
            if ( this.items ) {
                let total = 0
                for (let item of this.items ) {
                    let precio = item.precio
                    if ( item.actualizar_precio ) {
                        precio = item.precio_actualizado
                    }
                    
                    if ( item.is_stock_unitario_variable && Number(item.cantidad_total) != 0 ) {
                        
                        total = total + Number(precio) * Number(item.cantidad_total)
                    }
                    if ( item.is_stock_unitario_variable && Number(item.cantidad_total) == 0 ) {
                        total = total + Number(precio) * Number(item.cantidad) * Number(item.stock_aproximado_unidad)
                    }
                    if ( !item.is_stock_unitario_variable ) {
                        total = total + Number(precio) * Number(item.cantidad)
                    }
                }
                return total
            }
            return 0
            
        }

        
    },
    methods: {
        
        accept ( ) {
            this.$emit('actualizar_precios', this.items)
            this.intDialogVisible = false
        },

        onLoad ( ) {
            this.items = []
            //console.log(this.order.relationships.ordercomboitems)
            for ( let item of this.order.relationships.orderitems ) {
                this.items.push({
                    tipo: 'saleproduct',
                    id: item.id,
                    name: item.attributes.name,
                    cantidad: item.attributes.cantidad,
                    cantidad_total: item.attributes.cantidad_total,
                    is_stock_unitario_variable: item.attributes.is_stock_unitario_variable,
                    stock_aproximado_unidad: item.attributes.stock_aproximado_unidad,
                    precio: item.attributes.precio,
                    precio_actualizado: this.precio_item(item),
                    actualizar_precio: false,
                })                
            }
            for ( let comboitem of this.order.relationships.ordercomboitems ) {
                this.items.push({
                    tipo: 'combo',
                    id: comboitem.id,
                    name: comboitem.relationships.combo.attributes.name,
                    cantidad: comboitem.attributes.cantidad,
                    precio: comboitem.attributes.precio,
                    precio_actualizado: this.precio_combo(comboitem),
                    actualizar_precio: false,
                })                
            }


            
        },

        precio_item (item){
            //console.log(item.relationships.saleproduct)
            
            if ( this.is_promo(item) ) { 
                if ( this.order.relationships.client.attributes.tipo == 'MAYORISTA' ) {
                    return this.globalHelperFixeDecimalMoney(this.globalHelerAplicaDescuento(item.relationships.saleproduct.attributes.precio_may, item.relationships.saleproduct.attributes.desc_may))
                }
                return this.globalHelperFixeDecimalMoney(this.globalHelerAplicaDescuento(item.relationships.saleproduct.attributes.precio_min, item.relationships.saleproduct.attributes.desc_min))    
            }
            
            if ( this.order.relationships.client.attributes.tipo == 'MAYORISTA' ) {
                return this.globalHelperFixeDecimalMoney(item.relationships.saleproduct.attributes.precio_may)
            }
            return this.globalHelperFixeDecimalMoney(item.relationships.saleproduct.attributes.precio_min)
            

        },
        get_porc_diferencia ( item ) {
            let porc =  (item.precio_actualizado / item.precio )
            return ( porc - 1 ) * 100
        },  
        is_promo (item) {
            if ( item.attributes.fecha_desc_desde && (new Date(item.attributes.fecha_desc_desde).getTime() <= new Date().getTime()) && (new Date(item.attributes.fecha_desc_hasta).getTime() >= new Date().getTime()) ) {
                return true;
            }
            return false;
        },

        precio_combo (item){            
            if ( this.order.relationships.client.attributes.tipo == 'MAYORISTA' ) {
                return this.globalHelperFixeDecimalMoney(item.relationships.combo.attributes.precio_may)
            }
            return this.globalHelperFixeDecimalMoney(item.relationships.combo.attributes.precio_min)
            

        },

    }
  }
</script>