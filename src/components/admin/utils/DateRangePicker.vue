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
                    v-model="dates"
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    v-on="on"
                    dense
                    
                    clearable
                    @click:clear="cancel"
                    readonly  
                    hide-details="true"
                    
                >

                </v-text-field>
            </template>
            <v-date-picker
                v-model="dates"
                no-title
                scrollable
                range
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
        if ( this.date_from && this.date_to) {
            this.dates[0] = this.date_from
            this.dates[1] = this.date_to
        }
    },
    data: () => ({
        menu: false,
        
        dates: [],
    }),
    props: {
        date_from: {
            default: null,
            type: String
        },
        date_to: {
            default: null,
            type: String
        }
    },  
    computed: {
      
    },
    methods: {
      accept () {
        this.$refs.menu.save(this.dates)
        this.$emit('setRangeDate', this.dates)
      },
      cancel () {
          this.dates = [],
          this.$emit('setRangeDate', []),
          this.menu = false
      }
    }
  }
</script>