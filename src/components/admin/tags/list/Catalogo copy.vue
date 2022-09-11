<template>
    
        <v-dialog
          v-model="dialog"
          
          max-width="500"
        
        >
        <template v-slot:activator="{ on, attrs }">
            <v-btn                
                small
                v-bind="attrs"
                v-on="on"
                icon
                color="success"
                >           
                <v-icon>
                    mdi-plus
                </v-icon>            
            </v-btn>
        
            
        </template>
        <v-card>
            <v-card-title>
                
                
            </v-card-title>
            
            <v-card-text >
                <v-row>
                    <v-col cols="12" sm="5"  class="d-flex justify-sm-end align-center">
                        <span class="font-weight-bold black--text">Tag</span>
                    </v-col>
                    <v-col cols="12" sm="3"  class="d-flex align-center justify-start ml-2">
                        <span>{{ tag.attributes.name }}</span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" sm="5"  class="pt-2 pb-0 d-flex justify-sm-end">
                        <span class="font-weight-bold black--text">Catálogo</span>
                    </v-col>
                    <v-col cols="12" sm="6"  class=" pt-0 pb-0 d-flex">                        
                        <v-select
                            class="select_ivaaliquot ml-2"
                            dense
                            :menu-props="{ offsetY: true }"
                            :items="catalogos"
                            v-model="catalogo"
                            item-text="name"
                            item-value="id"
                        ></v-select>
                    </v-col>
                </v-row>

                
                
            </v-card-text>  
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        :loading="is_generando"
                        @click="generar"
                    >
                        Generar
                    </v-btn>
                </v-card-actions>          
        </v-card>
        </v-dialog>
    
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import jsPDF from 'jspdf'
export default {

    props:{
        tag: Object
    },
    data () {
        return {

            dialog: false,

            catalogos: ['Lista', 'Imagenes 1', 'Imagenes 2'],
            catalogo: 'Lista',
            is_generando: false,

            items: [],
            saleproducts: null,
            familias: null,

            cant_min_productos_familia: 1,
            cant_min_productos_grupo: 2,

            num_page: 0,
            h: 7,
            x: 7.4,
            product_width: 61.5,
            product_height: 88.5,
            product_x_sep: 6,
            product_y_sep: 3,

            line_group_height: 12,
            cant_product_x_linea: 3,
            index_producto_linea: 0,
            index_producto_vert: 0,

        }
    },
    computed: {
      ...mapGetters({

      })
    },

    methods: {
        ...mapActions({
            buscar_item: 'tags_manager/buscar_item',
        }),
        async generar ( ) {
            this.num_page = 0
            this.cant_product_x_linea = 3
            this.index_producto_linea = 0
            var doc = new jsPDF();

            await this.buscar()


            if ( this.saleproducts ) {
                this.getItems()
        
            }else {

                console.log('error')
            }




            for ( let familia of Object.values(this.familias) ) {
                let cant_productos = 0
                this.h = 7
                
                for ( let grupo of familia.relationships.grupos ) {
                    cant_productos = cant_productos + grupo.relationships.saleproducts.length
                }
                if ( cant_productos > this.cant_min_productos_familia ) {
                    if ( this.num_page != 0 ) {
                        doc.addPage()
                        
                    }
                    this.num_page = this.num_page + 1
                    

                    this.print_familia(doc, familia)

                    
                }
            }


            doc.output('dataurlnewwindow');

            


        },

        print_familia (doc, familia) {
            //imprimir hoja de familia
            this.index_producto_linea = 0
            this.index_producto_vert = 0
            doc.text(familia.attributes.name, 10, 100)

            doc.addPage()
            
            for ( let grupo of familia.relationships.grupos ) {
                this.print_grupo(doc, grupo)
            }

        },

        print_grupo( doc, grupo ) {
            //this.index_producto_linea = 0
            
            doc.setFontSize(12)
            //doc.text(grupo.attributes.name, 10, this.h)
            //this.h = this.h + this.line_group_height
            
            for ( let saleproduct of grupo.relationships.saleproducts ) {  
                this.print_producto(doc, saleproduct)
            }

            //this.h = this.h + this.product_height
        },

        print_producto (doc, saleproduct) {

            let x = this.x + this.index_producto_linea * this.product_width + this.product_x_sep * this.index_producto_linea

            let y = this.h + this.index_producto_vert * this.product_height + this.product_y_sep * this.index_producto_vert
            
            doc.setFontSize(9)
            doc.rect(x, this.y, this.product_width, this.product_height)

            doc.text(saleproduct.attributes.name, x + this.product_width / 2, this.h + this.product_height - 10, {align: 'center', maxWidth: this.product_width - 10 })
            
            if ( this.index_producto_linea == (this.cant_product_x_linea - 1 ) ) {
                this.index_producto_linea = 0
                
                this.h = this.h + this.product_height + this.product_y_sep            
            }else {
                this.index_producto_linea = this.index_producto_linea + 1
            }           

        },

        getItems () {

            let grupos = {}
            let grupos_array = []
            this.familias = {}

            for ( let saleproduct of this.saleproducts ) {
                //console.log(saleproduct)
                if ( !saleproduct.relationships.saleproductgroup ) {
                    
                    saleproduct.relationships.saleproductgroup = {id: 'g' + saleproduct.id, attributes: {name: saleproduct.attributes.name}}
                }
                if ( !(saleproduct.relationships.saleproductgroup.id in grupos) ) {
                    //console.log('add' + saleproduct.relationships.saleproductgroup.id)
                    grupos[saleproduct.relationships.saleproductgroup.id] = saleproduct.relationships.saleproductgroup
                    grupos_array.push(saleproduct.relationships.saleproductgroup)
                }

                if ( !saleproduct.relationships.stockproduct.relationships.familia ) {
                    saleproduct.relationships.stockproduct.relationships.familia = {id: 0, attributes: {name: 'Varios'}}
                }
                if ( !(saleproduct.relationships.saleproductgroup.id in this.familias) ) {
                    this.familias[saleproduct.relationships.stockproduct.relationships.familia.id] = saleproduct.relationships.stockproduct.relationships.familia
                }
            }

            for (const [key, grupo] of Object.entries(grupos)) {
                grupo['relationships'] = []
                grupo['relationships']['saleproducts'] = this.saleproducts.filter((i) => {
                    return i.relationships.saleproductgroup.id == key
                })
            }

            for (const [key, familia] of Object.entries(this.familias)) {
                familia['relationships'] = []
                familia['relationships']['grupos'] = grupos_array.filter((i) => {
                    return i.relationships.saleproducts[0].relationships.stockproduct.relationships.familia.id == key
                })
            }





            //items_a.push({grupo: {id, nombre}, saleproduct: {id, nombre, precio}})
            //si grupo == null => crear un grupo con el nombre del saleproduct
            //los agrupo por grupo
            //grupos.push({id, nombre, saleproducts: [{id, nombre}, {id, nombre}]})

            //los agrupo por familia
            //familias.push({id, nombre, grupos:[{id, nombre, saleproducts:[{id, nombre}]}]})

            //  si hay productos sin familia agregar una familia  "Varios"

            // en una segunda pasada
            //  si el numero de productos en una familia es menor a un numero preestablecido eliminar la familia y agregar los productos a la familia "varios"



        },

        async buscar () {
            await this.buscar_item(this.tag.id)
                .then((resp) => {
                    this.saleproducts = resp.data.data.relationships.saleproducts                  

                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }
}
</script>

<style>

</style>