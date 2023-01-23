<template>

    <v-autocomplete
      v-model="select"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      cache-items
      item-text="name"
      return-object
      @change="setItem"
      dense
      clearable
      :label="label"
      auto-select-first
      :disabled="disabled"
      hide-details=""
    ></v-autocomplete>

</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
  export default {
    mounted() {
        if(this.client){
            this.items = [this.client]
            this.select = this.items[0]
        }else {
            this.select = null
        }
    },

    data () {
      return {
        loading: false,
        items: [],
        search: null,
        select: null,        
      }
    },
    props: {
      label: {
        default: null,
        type: String
      },
      client: Object,
      disabled: Boolean
    },
    computed: {
      ...mapGetters({
        
      })
    },
    watch: {
      search (val) {
          if(val) {
            if(val.length > 0) {
                val && val !== this.select && this.querySelections(val)
            }  
          }                  
        },
        client() {
            if(this.client){
                this.items = [this.client]
                this.select = this.items[0]
            }else {
                this.select = null
            }
        }
    },
    methods: {
        async querySelections (v) {
            this.loading = true
            // Simulated ajax query
            await axios.get('/clients', {
                    params: {
                        'q': v,
                        'paginate': 0
                    }
                }).then((result) => {
                    //console.log(result.data.data)
                    this.items = []
                    for ( let item of result.data.data ) {
                        this.items.push({
                            name: item.attributes.surname + ' ' + item.attributes.name,
                            id: item.id
                            })
                    }

                    //console.log(this.items)
                })

            this.loading = false

        },
        setItem() {
          if(this.select){
            this.$emit("setClient",this.select)
          }else {
            this.$emit("setClient", null)
          }
            
        }
    },
  }
</script>

<style>

</style>