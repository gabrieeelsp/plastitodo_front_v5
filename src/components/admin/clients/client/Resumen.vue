<template>
    <div v-if="item_cache">
        <v-form @submit.prevent="submit" ref="form" v-model="valid"     >
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Nombre</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.name"
                        :rules="nameRules"
                        :error-messages="errorNameMessages"
                        @keydown="errorNameMessages = ''"
                       
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row v-if="item.attributes.tipo_persona == 'FISICA'">
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Apellido</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.surname"
                        :rules="surnameRules"
                        :error-messages="errorSurnameMessages"
                        @keydown="errorSurnameMessages = ''"
                       
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Teléfono</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.telefono"
                       
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Dirección</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-text-field 
                        dense
                        v-model="item_cache.attributes.direccion"
                       
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Descripción</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-textarea
                        v-model="item_cache.attributes.coments_direccion_client"
                        counter="100"
                        :rules="commentsDireccionRules"
                        :error-messages="errorCommentsDireccionMessages"
                        @keydown="errorCommentsDireccionMessages = ''"
                        rows="2"
                        outlined
                        auto-grow
                    ></v-textarea>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Tipo</span>
                </v-col>
                <v-col cols="12" sm="3"  class=" pt-0 pb-0">
                    <v-select
                        dense
                        :menu-props="{ offsetY: true }"
                        :items="items_tipo"
                        v-model="item_cache.attributes.tipo"
                    ></v-select>
                </v-col>

            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Crédito</span>
                </v-col>
                <v-col cols="12" sm="2"  class=" pt-0 pb-0 d-flex">
                    <v-text-field 
                        reverse
                        dense
                        v-model="item_cache.attributes.credito_disponible"
                        :rules="creditoRules"
                        :error-messages="errorCreditoMessages"
                        @keydown="errorCreditoMessages = ''"
                       
                    ></v-text-field>
                </v-col>

            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="d-flex justify-sm-end align-center">
                    <span class="font-weight-bold black--text">Tags</span>
                </v-col>
                <v-col cols="12" sm="4"  class="d-flex justify-start align-center">
                    <div>
                    <v-chip
                        v-for="tag in ids_select.tags" :key="tag.id"
                        class="mr-2"
                        close
                        :color="tag.color"
                        text-color="white"
                        small
                        @click:close="removeTag(tag.id)"
                        >
                        {{ tag.name }}
                    </v-chip>
                    </div>
                    <SelectTagModal
                        disable="false"
                        :btn_data="{name: null, icon: 'mdi-plus'}"

                        @set="addTag"
                    />
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="4"  class="pt-2 pb-0 d-flex justify-sm-end">
                    <span class="font-weight-bold black--text">Comnentarios</span>
                </v-col>
                <v-col cols="12" sm="4"  class=" pt-0 pb-0">
                    <v-textarea
                        v-model="item_cache.attributes.coments_client"
                        counter="200"
                        :rules="commentsRules"
                        :error-messages="errorCommentsMessages"
                        @keydown="errorCommentsMessages = ''"
                        rows="2"
                        auto-grow
                        outlined
                    ></v-textarea>
                </v-col>
            </v-row>

            <v-row>
                <v-spacer></v-spacer>
                <v-col class="d-flex" cols="8">
                    <v-btn
                        :loading="is_saving" 
                        type="submit"
                        color="success"
                    >Guardar</v-btn>
                    <v-btn class="ml-2"
                        @click="reset"
                        color="primary"
                    >Reset</v-btn>
                    <v-btn class="ml-auto"
                        color="primary"
                        @click="volver"
                    >Volver</v-btn>
                </v-col>
            </v-row>


        </v-form>
        
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectTagModal from '@/components/admin/tags/selectTagModal'

export default {
    mounted() {
    },
    computed: {
        ...mapGetters({
            item_cache: 'clients_manager/item_cache',
            item: 'clients_manager/item',
            ids_select: 'clients_manager/ids_select'
        })
    },
    components: {
        SelectTagModal,
        
    },
    data () {
        return {
            valid: true,
            is_saving: false,
            nameRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
            ],
            errorNameMessages: '',

            commentsRules: [
                v => ( v.length < 200 ) ||"Exede el máximo permitido",
            ],
            errorCommentsMessages: '',

            commentsDireccionRules: [
                v => ( v.length < 100 ) ||"Exede el máximo permitido",
            ],
            errorCommentsDireccionMessages: '',

            surnameRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
            ],
            errorSurnameMessages: '',

            creditoRules: [
                v => ( v && v.length > 0 ) || "Valor requerido",
                v => ( v && Number(v) >= 0 ) || "El valor debe ser mayor a 0",
            ],
            errorCreditoMessages: '',

            items_tipo: ['MINORISTA', 'MAYORISTA'],
        }
    },
    methods: {
        ...mapActions({
            update_item_resumen: 'clients_manager/update_item_resumen',
        }),
        reset () {
            this.item_cache.attributes.name = this.item.attributes.name
            if ( this.item.attributes.tipo_persona == 'FISICA') {
                this.item_cache.attributes.surname = this.item.attributes.surname
            }
            this.item_cache.attributes.telefono = this.item.attributes.telefono
            this.item_cache.attributes.direccion = this.item.attributes.direccion
            this.item_cache.attributes.tipo = this.item.attributes.tipo
            this.item_cache.attributes.coments_client = this.item.attributes.coments_client
            this.item_cache.attributes.coments_direccion_client = this.item.attributes.coments_direccion_client

            this.item_cache.attributes.credito_disponible = this.item.attributes.credito_disponible

            this.ids_select.tags = []
            for ( let tag of this.item.relationships.tags ) {
                this.ids_select.tags.push({id: tag.id, name: tag.attributes.name, color: tag.attributes.color})
            }
        },
        validate () {
            this.$refs.form.validate()
        },

        async submit () {
            this.validate()
            if ( this.valid ) {
                this.is_saving = true
                await this.update_item_resumen()
                    .then(() => {
                        this.$toast.success('Los cambios se han guardado correctamente', { timeout: 3000 });
                        this.item.attributes.name = this.item_cache.attributes.name
                        if ( this.item.attributes.tipo_persona == 'FISICA') {
                            this.item.attributes.surname = this.item_cache.attributes.surname
                        }
                        this.item.attributes.telefono = this.item_cache.attributes.telefono
                        this.item.attributes.direccion = this.item_cache.attributes.direccion
                        this.item.attributes.tipo = this.item_cache.attributes.tipo
                        this.item.attributes.credito_disponible = this.item_cache.attributes.credito_disponible

                        this.item.attributes.coments_client = this.item_cache.attributes.coments_client
                        this.item.attributes.coments_direccion_client = this.item_cache.attributes.coments_direccion_client
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
        volver() {
            this.$emit('volver')
        },
        removeTag(id) {
            this.ids_select.tags = this.ids_select.tags.filter((i) => {
                return i.id != id
            })
        },
        addTag(tag_nuevo) {
            let add = true
            for ( let tag of this.ids_select.tags ) {
                if (tag.id == tag_nuevo.id ) {
                    add = false
                    break
                }
            }
            if ( add ) {
                this.ids_select.tags.push({id: tag_nuevo.id, name: tag_nuevo.name, color: tag_nuevo.color})
            }
        }
    }
}
</script>

<style>

</style>