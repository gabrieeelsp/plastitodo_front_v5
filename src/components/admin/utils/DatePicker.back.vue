<template>
        <v-menu
        
            ref="menu"
            v-model="menu"
            min-width="auto"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            :close-on-click="false"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="date"
                    append-icon="mdi-calendar"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    
                    clearable
                    @click:clear="cancel"
                    readonly  
                    hide-details=""
                    
                >

                </v-text-field>
            </template>
            <v-date-picker
                v-model="date"
                no-title
                scrollable
                >
                <v-spacer></v-spacer>
                <v-btn
                    text
                    color="primary"
                    @click="cancel"
                >
                    Cancel
                </v-btn>
                <v-btn
                    text
                    color="primary"
                    @click="accept"
                >
                    OK
                </v-btn>
                </v-date-picker>
        </v-menu>

</template>

<script>

  export default {
    mounted () {
        if ( this.date_prop ) {
            this.date = this.date_prop
        }
    },
    data: () => ({
        menu: false,
        
        date: null,
    }),
    props: {
        date_prop: {
            default: null,
            type: String
        },
    },  
    computed: {
      
    },
    methods: {
      accept () {
        this.$refs.menu.save(this.date)
        this.$emit('setDate', this.date)
      },
      cancel () {
          this.date = null,
          this.$emit('setDate', null),
          this.menu = false
      }
    }
  }
</script>