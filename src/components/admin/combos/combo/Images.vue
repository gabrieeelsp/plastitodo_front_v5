<template>
    <div v-if="item_cache">

        <v-row>
            <v-col cols="12" sm="4"  class="d-flex justify-sm-end">
                <span class="font-weight-bold black--text">Imagen</span>
            </v-col>
            <v-col cols="12" sm="8"  class="">
                <template v-if="!image" >
                    <input type="file" accept="image/*" @change="uploadImage" />

                </template>
                <template v-else>
                    <div class="d-flex">
                        
                        <Photoswipe :options="{bgOpacity: 0.2}">
                        <v-card
                            v-pswp="image"
                            :style="getImageItemStyle(image.msrc)"
                            style="display: inline-block"
                        >
                        </v-card>
                        </Photoswipe>
                        
                        <v-btn
                            class="mt-1"
                                color="warning"
                                v-if="image"
                                text
                                @click="remove_image"
                                x-small
                                :loading="is_deleting"
                                >
                                Eliminar
                        </v-btn>
                    </div>
                    
                </template>               

            </v-col>
        </v-row>         

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
    mounted() {

        this.onload()
    },
    components: {
        
    },
    computed: {
        ...mapGetters({
            item_cache: 'combos_manager/item_cache',
            item: 'combos_manager/item',
        }),
    },
    data () {
        return {
            is_saving: false,

            image: null,

            is_deleting: false,            

        }
    },
    methods: {

        
        getImageItemStyle(src) {
            return {
                width: "150px",
                height: "150px",
                backgroundImage: `url(${src})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            };
        },

        
        volver() {
            this.$emit('volver')
        },

        async uploadImage(event) {

            let formData = new FormData();
            formData.append('image', event.target.files[0]);

            await axios.post(`combos/${this.item.id}/updload_image`,
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((resp) => {
                this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                this.item.attributes.image = resp.data.data.attributes.image
                this.item_cache.attributes.image = resp.data.data.attributes.image

                if ( this.item.attributes.image ) {
                    this.image = {
                        src:
                            this.item.attributes.image,
                        //size: "1792x1792",
                        msrc:
                            this.item.attributes.image,
                        //title: "this is dummy caption",
                    }
                }
            })

        },
        

        onload () {
            if ( this.item.attributes.image ) {
                this.image = {
                    src:
                        this.item.attributes.image,
                    //size: "1792x1792",
                    msrc:
                        this.item.attributes.image,
                    //title: "this is dummy caption",
                }
            }
        },
        async remove_image ( ) {
            this.is_deleting = true
            await axios.put(`combos/${this.item.id}/remove_image`)
                .then(() => {
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                    this.item.attributes.image = null
                    this.item_cache.attributes.image = null
                    this.image = null
                })
                .catch((error)  => {
                    console.log(error)
                })
                .finally(() => {
                    this.is_deleting = false
                })
        }
    }
}
</script>

<style>


</style>