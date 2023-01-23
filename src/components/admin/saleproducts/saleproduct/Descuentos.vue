<template>
    <div v-if="item_cache">
        <v-form @submit.prevent="submit" ref="form" v-model="valid">
            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Nombre</span>
                </v-col>
                <v-col cols="12" sm="4"  class="d-flex align-center">
                    <span class=" text-body-1">{{ item_cache.attributes.name }}</span>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-sm-end align-center">
                    <span class="font-weight-bold black--text">Desde</span>
                </v-col>
                <v-col cols="12" sm="2"  class="d-flex align-center">
                    <v-menu
                        v-model="menu1"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                            v-model="computedDateFormatted_desde"
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            dense
                            hide-details=""
                            :disabled="user.role == 'VENDEDOR'"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="date_desde"
                            no-title
                            @input="input_desde"
                            :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                        ></v-date-picker>
                        </v-menu>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-sm-end align-center">
                    <span class="font-weight-bold black--text">Hasta</span>
                </v-col>
                <v-col cols="12" sm="2"  class="d-flex align-center">
                    <v-menu
                        v-model="menu2"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                        >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                            v-model="computedDateFormatted_hasta"
                            append-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                            dense
                            hide-details=""
                            :disabled="user.role == 'VENDEDOR'"
                            ></v-text-field>
                        </template>
                        <v-date-picker
                            v-model="date_hasta"
                            no-title
                            @input="input_hasta"
                            :min="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                        ></v-date-picker>
                        </v-menu>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Precio Min</span>
                </v-col>
                <v-col cols="12" sm="1"  class="d-flex justify-end align-center">
                    <span class=" text-body-1">{{ globalHelperFixeDecimalMoney(item_cache.attributes.precio_min) }}</span>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Desc Min</span>
                </v-col>
                <v-col cols="12" sm="1"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        reverse
                        dense
                        v-model="item_cache.attributes.desc_min"
                        :rules="desc_minRules"
                        :error-messages="errorDesc_minMessages"
                        @keydown="errorDesc_minMessages = ''"
                        :disabled="user.role == 'VENDEDOR'"
                       
                    ></v-text-field>
                </v-col>

                <v-col cols="12" sm="1"  class="pt-2 pb-0 d-flex justify-end">
                    <span>( {{ globalHelperFixeDecimalMoney(precio_min_desc) }} )</span>
                </v-col>

            </v-row>
            
            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Precio May</span>
                </v-col>
                <v-col cols="12" sm="1"  class="d-flex justify-end align-center">
                    <span class=" text-body-1">{{ globalHelperFixeDecimalMoney(item_cache.attributes.precio_may) }}</span>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Desc May</span>
                </v-col>
                <v-col cols="12" sm="1"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        reverse
                        dense
                        v-model="item_cache.attributes.desc_may"
                        :rules="desc_mayRules"
                        :error-messages="errorDesc_mayMessages"
                        @keydown="errorDesc_mayMessages = ''"
                        :disabled="user.role == 'VENDEDOR'"
                       
                    ></v-text-field>
                </v-col>

                <v-col cols="12" sm="1"  class="pt-2 pb-0 d-flex justify-end">
                    <span>( {{ globalHelperFixeDecimalMoney(precio_may_desc) }} )</span>
                </v-col>

            </v-row>
            


            <v-row>
                <v-spacer></v-spacer>
                <v-col class="d-flex" cols="8">
                    <v-btn
                        v-if="user.role != 'VENDEDOR'"
                        :loading="is_saving" 
                        type="submit"
                        color="success"
                    >Guardar</v-btn>
                    <v-btn class="ml-2"
                        v-if="user.role != 'VENDEDOR'"
                        @click="reset"
                        color="primary"
                    >Reset</v-btn>
                    
                </v-col>
            </v-row>


        </v-form>
            
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    mounted() {
        if ( this.item_cache.attributes.fecha_desc_desde && this.item_cache.attributes.fecha_desc_hasta ) {
            this.date_desde = this.item_cache.attributes.fecha_desc_desde.substr(0, 10)
            this.date_hasta = this.item_cache.attributes.fecha_desc_hasta.substr(0, 10)
        }
    },
    components: {

    },
    computed: {
        ...mapGetters({
            item_cache: 'saleproducts_manager/item_cache',
            item: 'saleproducts_manager/item',
            ids_select: 'saleproducts_manager/ids_select',
            user: 'auth/user',
        }),
        computedDateFormatted_desde () {
            return this.formatDate(this.date_desde)
        },
        computedDateFormatted_hasta () {
            return this.formatDate(this.date_hasta)
        },
        precio_min_desc: function ( ) {
            let num = ( this.item_cache.attributes.desc_min / 100 ).toFixed(10)
            num = 1 - Number(num)
            return (this.item_cache.attributes.precio_min * num).toFixed(10)
        },
        precio_may_desc: function ( ) {
            let num = ( this.item_cache.attributes.desc_may / 100 ).toFixed(10)
            num = 1 - Number(num)
            return (this.item_cache.attributes.precio_may * num).toFixed(10)
        },
    },
    data () {
        return {
            valid: true,
            is_saving: false,


            date_desde: null,
            menu1: false,

            date_hasta: null,
            menu2: false,

            //desc_min: 0,
            desc_minRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) >= 0 ) || "El valor debe ser mayor a 0",
            ],
            errorDesc_minMessages: '', 
            
            desc_mayRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) >= 0 ) || "El valor debe ser mayor a 0",
            ],
            errorDesc_mayMessages: '', 
            

        }
    },
    methods: {
        input_hasta () {
            this.menu2 = false
            this.item_cache.attributes.fecha_desc_hasta = this.date_hasta
        },
        input_desde () {
            this.menu1 = false
            this.item_cache.attributes.fecha_desc_desde = this.date_desde
        },
        formatDate (date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },
        ...mapActions({
            update_item_descuentos: 'saleproducts_manager/update_item_descuentos',
        }),
        reset () {

            this.item_cache.attributes.desc_min = this.item.attributes.desc_min
            this.item_cache.attributes.desc_may = this.item.attributes.desc_may

            this.date_desde = this.item.attributes.fecha_desc_desde.substr(0, 10)
            this.date_hasta = this.item.attributes.fecha_desc_hasta.substr(0, 10)

        },
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            
             this.validate()
            if ( this.valid ) {
                this.is_saving = true
                await this.update_item_descuentos(false)
                    .then((resp) => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });

                        this.item.attributes.desc_min = resp.data.data.attributes.desc_min
                        this.item.attributes.desc_may = resp.data.data.attributes.desc_may 

                        this.item.attributes.fecha_desc_desde = resp.data.data.attributes.fecha_desc_desde
                        this.item.attributes.fecha_desc_desde = resp.data.data.attributes.fecha_desc_hasta
                    })
                    .catch((error) => {
                        this.$toast.error('Se ha producido un error.', { timeout: 3000 });
                        console.log(error)
                    })
                    .finally(() => {
                        this.is_saving = false
                    })
            } 
        },
        
        
    }
}
</script>