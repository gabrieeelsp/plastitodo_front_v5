<template>
    <div class="pa-sm-3" v-if="presupuestoActive">
        <v-row>
            <v-col cols="12" md="9">
                <v-card class="">
                    <v-card-title class="d-flex justify-space-between align-center pt-1 pb-1">                
                        <div class="">
                            <span class="text-h4 font-weight-light">Editor de PRESUPUESTOS</span>

                            
                        </div>
                        <div>
                                <v-btn
                                    v-for="presupuesto in presupuestos"
                                    :key="presupuesto.id"
                                    @click="set_presupuesto_active( presupuesto.id )"
                                    :depressed="presupuestoActive.id == presupuesto.id"
                                    
                                    class="mr-1">
                                    Presupuesto {{ presupuesto.id }}
                                </v-btn>

                                <v-btn
                                    @click="create_presupuesto()"
                                    class="mr-1">New
                                </v-btn>
                            </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text >
                        <v-row class="">
                            <v-col cols="12" class="">
                                <v-row>
                                    <v-col cols="8"> 
                                        <SelectProduct
                                            
                                         />

                                    </v-col>
                                </v-row>
                                
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <ItemsPresupuestoActive /> 
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="d-flex justify-end">
                                <PresupuestoPDF
                                    :presupuesto="presupuestoActive"
                                    class="mr-auto"
                                />
                                <v-spacer></v-spacer>
                                <v-btn
                                    @click="delete_presupuesto(presupuestoActive.id)"
                                    color="warning"
                                    text
                                >
                                    Cerrar
                                </v-btn>
                                
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="3">
                <v-row class="">
                    <v-col cols="12">
                        <MenuClientPresupuestoActive  />
                    </v-col>
                    
                    <v-col cols="12">
                        <TotalPresupuesto />
                    </v-col>
                    
                </v-row>
                
            </v-col>

        </v-row>
    </div>

</template>

<script>
import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'

import ItemsPresupuestoActive from '@/components/admin/presupuestos/presupuesto_register/ItemsPresupuestoActive.vue'
import MenuClientPresupuestoActive from '../../../components/admin/presupuestos/presupuesto_register/MenuClientPresupuestoActive.vue'
import SelectProduct from '@/components/admin/presupuestos/presupuesto_register/SelectProduct'
import PresupuestoPDF from '@/components/admin/presupuestos/pdf/PresupuestoPDF'

import TotalPresupuesto from '@/components/admin/presupuestos/presupuesto_register/TotalPresupuesto'






export default {

    mounted() {
        
        if ( this.presupuestos.length == 0 ) {
            this.new_presupuesto().then((presupuesto) => {
                this.presupuesto = presupuesto
            })
        }
        
    },
    components: {
        ItemsPresupuestoActive,
        MenuClientPresupuestoActive,
        SelectProduct,
        TotalPresupuesto,
        PresupuestoPDF,

        
    },
    data: () => ({

    }),
    computed: {
        ...mapGetters({
            presupuestos: 'presupuestos_manager/presupuestos',
            presupuestoActive: 'presupuestos_manager/presupuestoActive',

            cantItemsPresupuestoActive: 'presupuestos_manager/cantItemsPresupuestoActive',
            
        })
    },
    methods: {
        ...mapActions({
            new_presupuesto: 'presupuestos_manager/new_presupuesto',
            set_presupuesto_active: 'presupuestos_manager/set_presupuesto_active',
            remove_presupuesto: 'presupuestos_manager/remove_presupuesto',
        }),

        create_presupuesto () {
            this.new_presupuesto().then((presupuesto) => {
                this.presupuesto = presupuesto
            })
        },

        delete_presupuesto(presupuesto_id) {
            this.remove_presupuesto(presupuesto_id)
            if( this.presupuestos.length == 0){
                this.new_presupuesto()
            }else {
                const id = this.presupuestos[0].id
                this.set_presupuesto_active(id)
            }
        },
        
        
    }
}
</script>

<style>

</style>