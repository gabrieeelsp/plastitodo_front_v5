<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      :width="dimension.width"
      
    >
      <template v-slot:activator="{ on, attrs }">
        <v-card class="">
        <v-img
            v-if="src"                                      
            class="white--text align-end mt-1 mb-1"
            height="100px"
            width="100px"
            :src="src"
            v-bind="attrs"
            v-on="on"
        >
        </v-img>
        
        <v-img
            v-else                                 
            class="white--text align-end mt-1 mb-1"
            height="100px"
            width="100px"
            :src="url_asset + 'images/image_default.jpg'"
            
        >
        </v-img>
        </v-card>
        </template>

        <v-img 
                v-if="dimension.width"    
                :width="dimension.width"                            
                :height="dimension.height"
                :src="src"
        >
        </v-img>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
  export default {
    created() {
        //this.ver()
        var image = new Image()            
        
        image.onload = function() {


            let rel_h = Number((window.innerHeight * this.proporcion / this.height).toFixed(2))
            let rel_w = Number((window.innerWidth * this.proporcion / this.width).toFixed(2))
            let rel = null
            if ( rel_h < rel_w ) {
              rel = rel_h
            }else {
              rel = rel_w
            }
            if ( rel > 1 ) {
              rel = 1
            }
            this.dimension=  {
                    width: (this.width * rel).toFixed(0),
                    height: (this.height * rel).toFixed(0)                    
                }

            console.log(this.num)
            
        }


        if ( this.src ) {
            image.src = this.src
        }else {
            image.src = 'http://localhost:8000/images/image_default.jpg'
        }

    },
    data () {
      return {
        dialog: false,
        proporcion: 0.8,
        num: 8,
        dimension: {
            height: null,
            width: null
        }
      }
    },
    props: {
        src: String,
    },
    computed: {
        ...mapGetters({
            url_asset: 'url_asset'
        }),
        
    },
    methods: {
        ver () {
            var image = new Image()
            if ( this.src ) {
                image.src = this.src
            }else {
                image.src = 'http://localhost:8000/images/image_default.jpg'
            }
            console.log(this.src)
            console.log('H_original: ' + image.height + ' W_original: ' + image.width )

            console.log('H_screen: ' + window.innerHeight + ' W_screen: ' + window.innerWidth )

            let rel_h = Number((window.innerHeight * this.proporcion / image.height).toFixed(2))
            let rel_w = Number((window.innerWidth * this.proporcion / image.width).toFixed(2))

            console.log('rel_h: ' + rel_h + ' rel_w: ' + rel_w )

            console.log(this.dimension)


            console.log('ppppp' + this.dimension_original)


        }
    }
    
  }
  
</script>