<template>
    <div v-if="item_cache">

        <v-row>
            <v-col cols="12" sm="4"  class="d-flex justify-sm-end">
                <span class="font-weight-bold black--text">Imagen 1</span>
            </v-col>
            <v-col cols="12" sm="8"  class="">
                <template v-if="!image1" >
                    <input type="file" accept="image/*" @change="uploadImage1" />

                </template>
                <template v-else>
                    <div class="d-flex">
                        <Photoswipe :options="{bgOpacity: 0.5}">
                            <v-card class=""
                                v-pswp="image1"
                                :style="getImageItemStyle(image1.msrc)"
                                style="display: inline-block"
                                >
                        
                            </v-card>
                        </Photoswipe>
                        <v-btn
                            class="mt-1"
                                color="warning"
                                v-if="image1"
                                text
                                @click="remove_image(1)"
                                x-small
                                :loading="is_deleting_1"
                                >
                                Eliminar
                        </v-btn>
                    </div>
                    
                </template>               

            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" sm="4"  class="d-flex justify-sm-end">
                <span class="font-weight-bold black--text">Imagen 2</span>
            </v-col>
            <v-col cols="12" sm="4"  class="">
                <template v-if="!image2" >
                    <input type="file" accept="image/*" @change="uploadImage2" />

                </template>
                <template v-else>
                    
                    <div class="d-flex">
                        <Photoswipe :options="{bgOpacity: 0.5}">
                            <v-card class=""
                                v-pswp="image2"
                                :style="getImageItemStyle(image2.msrc)"
                                style="display: inline-block"
                                >
                        
                            </v-card>
                            
                        </Photoswipe>
                        <v-btn
                            class="mt-1"
                                color="warning"
                                v-if="image2"
                                text
                                @click="remove_image(2)"
                                x-small
                                :loading="is_deleting_2"
                                >
                                Eliminar
                        </v-btn>
                    </div>
                </template>               

            </v-col>
        </v-row>

        <v-row>
            <v-col cols="12" sm="4"  class="d-flex justify-sm-end align-center">
                <span class="font-weight-bold black--text">Imagen 3</span>
            </v-col>
            <v-col cols="12" sm="4" >
                <template v-if="!image3" >
                    <input type="file" accept="image/*" @change="uploadImage3" />
                </template>
                <template v-else>
                    
                    <div class="d-flex">
                        <Photoswipe :options="{bgOpacity: 0.5}">
                            <v-card class=""
                                v-pswp="image3"
                                :style="getImageItemStyle(image3.msrc)"
                                style="display: inline-block"
                                >
                        
                            </v-card>
                        </Photoswipe>
                        <v-btn
                            class="mt-1"
                                color="warning"
                                v-if="image3"
                                text
                                @click="remove_image(3)"
                                x-small
                                :loading="is_deleting_3"
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
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'

export default {
    mounted() {

        this.onload()
    },
    components: {
        
    },
    computed: {
        ...mapGetters({
            item_cache: 'saleproducts_manager/item_cache',
            item: 'saleproducts_manager/item',
        }),
    },
    data () {
        return {
            is_saving: false,

            image1: null,

            image2: null,

            image3: null,

            is_deleting_1: false,
            is_deleting_2: false,
            is_deleting_3: false,
            

        }
    },
    methods: {
        ...mapActions({
            update_item_resumen: 'saleproducts_manager/update_item_resumen',
        }),
        
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

        async uploadImage1(event) {

            let formData = new FormData();
            formData.append('image', event.target.files[0]);
            formData.append('order', 1);

            await axios.post(`saleproducts/${this.item.id}/updload_image`,
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((resp) => {
                this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                this.item.attributes.image1 = resp.data.data.attributes.image1
                this.item_cache.attributes.image1 = resp.data.data.attributes.image1

                if ( this.item.attributes.image1 ) {
                    this.image1 = {
                        src:
                            this.item.attributes.image1,
                        //size: "1792x1792",
                        msrc:
                            this.item.attributes.image1,
                        //title: "this is dummy caption",
                    }
                }
            })

        },
        async uploadImage2(event) {

            let formData = new FormData();
            formData.append('image', event.target.files[0]);
            formData.append('order', 2);

            await axios.post(`saleproducts/${this.item.id}/updload_image`,
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((resp) => {
                this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                this.item.attributes.image2 = resp.data.data.attributes.image2
                this.item_cache.attributes.image2 = resp.data.data.attributes.image2

                if ( this.item.attributes.image2 ) {
                    this.image2 = {
                        src: this.item.attributes.image2,
                        //size: "1792x1792",
                        msrc: this.item.attributes.image2,
                        //title: "this is dummy caption",
                    }
                }
            })

        },
        async uploadImage3(event) {

            let formData = new FormData();
            formData.append('image', event.target.files[0]);
            formData.append('order', 3);

            await axios.post(`saleproducts/${this.item.id}/updload_image`,
                formData,
                {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((resp) => {
                this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                this.item.attributes.image3 = resp.data.data.attributes.image3
                this.item_cache.attributes.image3 = resp.data.data.attributes.image3

                if ( this.item.attributes.image3 ) {
                    this.image3 = {
                        src:
                            this.item.attributes.image3,
                        //size: "1792x1792",
                        msrc:
                            this.item.attributes.image3,
                        //title: "this is dummy caption",
                    }
                }
            })

        },

        onload () {
            if ( this.item.attributes.image1 ) {
                this.image1 = {
                    src:
                        this.item.attributes.image1,
                    //size: "1792x1792",
                    msrc:
                        this.item.attributes.image1,
                    //title: "this is dummy caption",
                }
            }
            
            if ( this.item.attributes.image2 ) {
                this.image2 = {
                    src:
                        this.item.attributes.image2,
                    //size: "1792x1792",
                    msrc:
                        this.item.attributes.image2,
                    //title: "this is dummy caption",
                }
            }

            if ( this.item.attributes.image3 ) {
                this.image3 = {
                    src:
                        this.item.attributes.image3,
                    //size: "1792x1792",
                    msrc:
                        this.item.attributes.image3,
                    //title: "this is dummy caption",
                }
            }
        },
        async remove_image ( order ) {
            if ( order == 1 ) { this.is_deleting_1 = true }
            if ( order == 2 ) { this.is_deleting_2 = true }
            if ( order == 3 ) { this.is_deleting_3 = true }
            await axios.put(`saleproducts/${this.item.id}/remove_image`,{
                    order: order
                })
                .then(() => {
                    this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                    if ( order == 1 ) {
                        this.item.attributes.image1 = null
                        this.item_cache.attributes.image1 = null
                        this.image1 = null
                    }
                    if ( order == 2 ) {
                        this.item.attributes.image2 = null
                        this.item_cache.attributes.image2 = null
                        this.image2 = null
                    }
                    if ( order == 3 ) {
                        this.item.attributes.image3 = null
                        this.item_cache.attributes.image3 = null
                        this.image3 = null
                    }
                })
                .catch((error)  => {
                    console.log(error)
                })
                .finally(() => {
                    this.is_deleting_1 = false
                    this.is_deleting_2 = false
                    this.is_deleting_3 = false
                })
        }
    }
}
</script>

<style>


</style>