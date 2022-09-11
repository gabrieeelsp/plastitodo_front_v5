<template>
    <v-simple-table v-if="items" >
      <template v-slot:default>
          
          <tbody>
              <tr
                  v-for="(item, index) in items"
                  :key="index"
              >
                  <td class=" 'pl-1'" >{{ item.attributes.name }}</td>

                  <td class="pr-1">                                            
                      <v-btn small
                          @click="setSucursal(item)"
                          color="success"
                          elevation="2"
                          
                          outlined
                      >
                          Seleccionar
                      </v-btn>
                      
                      
                  </td>   
              </tr>
          </tbody>
      </template>
  </v-simple-table>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
export default {
    mounted() {
        this.getItems()
    }, 

    data: () => ({
        items: [],
        loading: false,
    }),

    methods: {
        ...mapActions({
            set_sucursal: 'sucursals_manager/set_sucursal',
            buscar_caja: 'cajas_manager/buscar_caja',
            set_caja: 'cajas_manager/set_caja',

            set_sales: 'sale_manager/set_sales',
        }),
        async getItems() {
            this.loading = true
            await axios.get('sucursals')
                .then((resp) => {
                    this.items = resp.data.data
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    this.loading = false
                })
        },

        async setSucursal (data) {
            this.set_sucursal({
                'id': data.id,
                'name': data.attributes.name
            })

            await this.buscar_caja()
                .then((resp) => {
                    this.set_caja(resp.data.data)
                }).catch((error) => {
                    console.log(error)
                    this.set_caja(null)
                })

            this.set_sales([])

            this.$router.replace({
                name: 'dashboard'
            })
        }
    }
}
</script>

<style>

</style>