<template>
    <v-simple-table class="">
        <template v-slot:default>
        <thead class="green lighten-5">
            <tr>
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
            v-for="item in creditnote.relationships.creditnoteitems"
            :key="item.id"
            >
            <td>Ajuste al {{ item.relationships.ivaaliquot.name }}</td>

            
            <td 
                class="text-right"
                >{{ globalHelperFixeDecimalMoney(item.attributes.valor) }}</td>
            
            <td 
                class="text-right"
                >1</td>
            <td 
                class="text-right"
                >{{ item.relationships.ivaaliquot.name }}</td>
                    
            <td class="text-right">{{ globalHelperFixeDecimalMoney(item.attributes.valor) }}</td>
            
            </tr>   


        </tbody>
        
        </template>
        
    </v-simple-table>
</template>

<script>
export default {
    props: {
        creditnote: Object
    }
	
}
</script>

<style>

</style>