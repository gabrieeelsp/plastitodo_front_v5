<template>
    <div>
        <v-row >
            <v-col cols="12" >
                <v-simple-table class="">
                    <template v-slot:default>
                    <thead class="green lighten-5">
                        <tr>
                        <th style="width: 40px;"></th>
                        <th class="pl-1 text-left font-weight-bold text-subtitle-1 grey--text text--darken-2">
                            Descripción 
                        </th>
                        <th 
                            style="width: 100px;"
                            class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-2">
                            Valor
                        </th>
                        <th
                            style="width: 100px;"
                        class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-2">
                            Cantidad
                        </th>

                        <th
                            style="width: 100px;"
                        class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-2">
                            IVA
                        </th>
                        
                        <th 
                            style="width: 100px;"
                            class="pl-1 text-center font-weight-bold text-subtitle-1 grey--text text--darken-2">
                            SubTotal
                        </th>            
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="item in debitnote_editing.debitnoteItems"
                        :key="item.id"
                        :class="[(item.is_debitnote_item ) ? 'blue lighten-5': '']"
                        >
                        <td class=" d-flex align-center pl-1 pr-1 pt-0">
                            <v-checkbox
                            class="  mt-0 pt-0   "
                                v-model="item.is_debitnote_item"
                                hide-details=""
                            >                    
                            </v-checkbox>
                        </td>
                        <td>Ajuste al {{ item.ivaaliquot.attributes.name }}</td>

                        
                        <td
                            v-if="item.is_debitnote_item && item.is_editing"
                        >
                            <InputEditValue
                                :item="{
                                    id: item.id,
                                    value: item.valor,
                                }"                  

                                @close="item.is_editing = false"
                                @accept="set_value"
                            />
                        </td>
                        <td 
                            v-else
                            @dblclick="enable_editing_value(item)"
                            class="text-right"
                            >{{ globalHelperFixeDecimalMoney(item.valor) }}</td>
                        
                        <td 
                            class="text-right"
                            >1</td>
                        <td 
                            class="text-right"
                            >{{ item.ivaaliquot.attributes.name }}</td>
                                
                        <td class="text-right">{{ globalHelperFixeDecimalMoney(item.valor) }}</td>
                        
                        </tr>   


                    </tbody>
                    
                    </template>
                    
                </v-simple-table>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-btn 
                    @click="cancelar"
                >Cancelar</v-btn>
                <v-btn
                    class="ml-2"
                    :loading="is_saving" 
                    @click="submit"
                    :disabled="totalDebitnoteEditing <= 0"
                >Guardar</v-btn>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { mapGetters  } from 'vuex'
import InputEditValue from '@/components/admin/utils/InputEditValue'
export default {
    computed: {
        ...mapGetters({
			debitnote_editing: 'sales_manager/debitnote_editing',
            totalDebitnoteEditing: 'sales_manager/totalDebitnoteEditing',
		})
    },
    components: {
        InputEditValue
    },
    props: {
        is_saving: Boolean
    },

    methods: {
        set_value (item_resp) {
            for ( let item of this.debitnote_editing.debitnoteItems ) {
                if ( item.id == item_resp.id ) {
                    item.valor = item_resp.value
                    item.is_editing = false
                    break
                }
            }
        },
        enable_editing_value(item) {
            if ( item.is_debitnote_item ) {
                item.is_editing = true
            }
        },
        submit ( ) {
            this.$emit('guardar_debitnote')
        },
        cancelar ( ) {
            this.$emit('cancelar_debitnote')
        }
    }
	
}
</script>

<style>

</style>