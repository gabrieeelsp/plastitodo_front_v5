<template>
  

    <v-dialog
      v-model="intDialogVisible"
      max-width="900"
    >
      <v-card v-if="order">
        <v-card-title class="text-h5">

          
        </v-card-title>
        <v-card-text>
            <v-row>
                <v-spacer></v-spacer>
                <v-col cols="2">
                    <span> </span>
                </v-col>
                <v-col cols="3" class="text-right">
                    <span class="text-h6">Pedido: #{{ globalHelperFixNumeroDocuento(order.id) }}</span>
                </v-col>
            </v-row>

            <v-row class="">
                <v-col cols="12"  class="">
                    <ItemsOrderActive
                        :order="order"
                        :is_OrderStockUnitarioVariable="is_OrderStockUnitarioVariable"
                    />
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
import ItemsOrderActive from '@/components/admin/orders2/order_modal/ItemsOrderActive.vue'
  export default {
    mounted () {
        
    },
    data () {
        return {

        }
    },
    components: {
        ItemsOrderActive,
    },
    props: {
        dialogVisible: Boolean,
        order: Object,
    
    },
    computed: {
        ...mapGetters({
            url_asset: 'url_asset',
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

        is_OrderStockUnitarioVariable: function () {
            for ( let orderitem of this.order.relationships.orderitems) {
                if( orderitem.relationships.saleproduct.relationships.stockproduct.attributes.is_stock_unitario_variable ) {
                    return true
                }
            }
            return false
        },
    },
    methods: {
        

    }
  }
</script>