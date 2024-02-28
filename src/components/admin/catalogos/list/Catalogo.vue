<template>
    <div>
        
        
        
        <v-btn 
            block 
            @click="generar"
            
            :loading='is_generando'
            color="primary"
        >
            {{ btn_text }}
        </v-btn>
    </div>
    </template>
    
    <script>
    
    import { mapGetters, mapActions } from 'vuex'
    import jsPDF from 'jspdf'
    export default {
        created() {
            if ( this.title ) {
                this.btn_text = this.title;
            }
        },
        props:{
            catalogo: Object,
            title: String,
        },
        data () {
            return {
    
                btn_text: 'Catalogo PDF',
                dialog: false,
                filename: '',
                
                is_generando: false,
    
                items: [],
                saleproducts: null,
                familias: null,
    
                fontFamily: 'helvetica',
    
                cant_min_productos_familia: 1,
    
                num_page: 0,
                y_inicial: 8,
                x_inicial: 7.4,
    
                product_width: 61.5,
                product_height: 88.5,
    
                product_x_sep: 6,
                product_y_sep: 4,
    
                cant_product_linea: 3,
                index_producto_linea: 0,
                cant_product_vert: 3,
                index_producto_vert: 0,
    
                caja_texto_producto_h: 12.3,
    
    
                logo_sin_stock: require('@/assets/sin_stock.png'),
    
            }
        },
        computed: {
            ...mapGetters({
                url_asset: 'url_asset',
            })
        },
    
        methods: {
            ...mapActions({
                buscar_item: 'catalogos_manager/buscar_item',
            }),
            async generar ( ) {
                this.is_generando = true
                this.num_page = 0
                this.index_producto_linea = 0
                this.index_producto_vert = 0
                var doc = new jsPDF();
                
                await this.buscar()
                
    
                if ( this.saleproducts ) {
                    this.getItems()        
                }else {
                    console.log('error')
                }  
                
                //console.log(this.familias)
    
                this.iniciar_pagina(doc, false)
    
                for ( let familia of Object.values(this.familias) ) {
                    
                    let cant_productos = 0
                    
                    for ( let grupo of familia.relationships.grupos ) {
                        cant_productos = cant_productos + grupo.relationships.saleproducts.length
                    }
                    //console.log('cant productos: ' + cant_productos)
                    //console.log('cant cant_min_productos_familia: ' + this.cant_min_productos_familia)
                    if ( cant_productos > this.cant_min_productos_familia ) {
                        if ( this.num_page != 0 ) {
                            this.add_pagina(doc, false)                       
                        }
                        this.num_page = this.num_page + 1
                        
                        this.print_familia(doc, familia)                    
                    }
                }
                
                this.is_generando = false
                this.dialog = false
                //doc.output('dataurlnewwindow', {filename: this.filename})
                doc.save(this.filename)
    
            },
    
            print_familia (doc, familia) {
    
                /* doc.setFont(this.fontFamily, 'italic')
                doc.setFontSize(16)
                doc.setTextColor(null)
                doc.text('Categorí­a', 10, 82)
                
                doc.setFont(this.fontFamily, 'normal')
                doc.setFontSize(35)
                //imprimir hoja de familia
                this.index_producto_linea = 0
                this.index_producto_vert = 0
    
                
    
                var img = new Image()
                if ( familia.attributes.image ) {
                    img.src = familia.attributes.image+ '?r=' + Math.floor(Math.random()*100000)
                    //img.crossOrigin = 'anonymous';
                    img.crossOrigin = "Anonymous";
                }else {
                    //img.src = 'https://picsum.photos/200/300'
    
                    img.src = this.url_asset + 'images/image_default.jpg'
                } 
                
    
                doc.addImage(img, 'JPG', 0, 100, 210, 100)  
    
                doc.setFillColor('#729fcf')
                doc.rect(0, 100, 210, 4, 'F')
    
                doc.rect(0, 200, 210, 4, 'F')
    
                doc.setTextColor(null)
                doc.text(familia.attributes.name, 10, 93)
    
                this.add_pagina(doc, false) */
                
                for ( let grupo of familia.relationships.grupos ) {
                    this.print_grupo(doc, grupo)
                }
    
            },
    
            print_grupo( doc, grupo ) {
                
                for ( let saleproduct of grupo.relationships.saleproducts ) {  
                    this.print_producto(doc, saleproduct)
                    if ( this.index_producto_linea == (this.cant_product_linea - 1 ) ) {
                        this.index_producto_linea = 0
                    
                        if ( this.index_producto_vert == (this.cant_product_vert -1 ) ) {
                            this.add_pagina(doc, false)
                            this.index_producto_vert = 0
                        }else {
                            this.index_producto_vert = this.index_producto_vert + 1           
                        }
                    
                    }else {
                        this.index_producto_linea = this.index_producto_linea + 1
                    }   
    
                }
    
            },
    
            print_producto (doc, saleproduct) {
                
                doc.setTextColor(null)
                doc.setFont(this.fontFamily, 'normal')
    
                let x = this.x_inicial + this.index_producto_linea * this.product_width + this.product_x_sep * this.index_producto_linea
    
                let y = this.y_inicial + this.index_producto_vert * this.product_height + this.product_y_sep * this.index_producto_vert
                doc.setDrawColor('#b4c7dc')
                doc.setFillColor('#fadee1')
                //doc.setFillColor('dfe9f4')
                doc.rect(x, y + this.product_height - this.caja_texto_producto_h, this.product_width, this.caja_texto_producto_h, 'F')
    
                doc.setFillColor(null)
                
                doc.setFontSize(9)
                doc.rect(x, y, this.product_width, this.product_height)
                doc.text(saleproduct.attributes.name, x + this.product_width / 2, y + this.product_height - this.caja_texto_producto_h + 6, {align: 'center', maxWidth: this.product_width - 3 })         
    
                doc.setTextColor('#729fcf')
                doc.setFontSize(14)
                doc.setFont(this.fontFamily, 'bold')
                if ( this.is_promo(saleproduct) ) {
                    doc.text('$ ' + this.globalHelperFixeDecimalMoney(this.globalHelerAplicaDescuento(saleproduct.attributes.precio_min, saleproduct.attributes.desc_min)), x + this.product_width - 3, y + this.product_height - this.caja_texto_producto_h - 3, { align: 'right'})
                }else {
                    doc.text('$ ' + this.globalHelperFixeDecimalMoney(saleproduct.attributes.precio_min), x + this.product_width - 3, y + this.product_height - this.caja_texto_producto_h - 3, { align: 'right'})
                }
                
                var img = new Image()
                if ( saleproduct.attributes.image1 ) {
                    const url = saleproduct.attributes.image1.replace('http:', 'https:') + '?r=' + Math.floor(Math.random()*100000)
                    img.src = url;
                    //img.crossOrigin = 'anonymous';
                    //img.crossOrigin = "Anonymous";
                }else {
                    //img.src = 'https://picsum.photos/200/300'
    
                    img.src = this.url_asset + 'images/image_default.jpg'
                } 
                //img.src = 'https://picsum.photos/200/300'
                
                
                
                doc.addImage(img, 'JPG', x +2, y + 2, this.product_width - 4, this.product_height - this.caja_texto_producto_h - 12)  
    
                // Sin Stock
    
                if ( saleproduct.relationships.stockproduct.attributes.stock <= 0 ) {
                    
    
                    var imgLogoSinStock = new Image()
                    imgLogoSinStock.src = this.logo_sin_stock
                    doc.addImage(imgLogoSinStock, 'PNG', x, y, 30, 30)
                }
    
                // promocion
                if ( this.is_promo(saleproduct) ) {                
                    doc.setTextColor('#c4c4c4')
                    doc.setFontSize(14)
                    doc.setFont(this.fontFamily, 'bold')
                    doc.text('$ ' + this.globalHelperFixeDecimalMoney(saleproduct.attributes.precio_min), x + this.product_width - 30, y + this.product_height - this.caja_texto_producto_h - 3, { align: 'right'} )
    
                    const textWidth = doc.getTextWidth('$ ' + this.globalHelperFixeDecimalMoney(saleproduct.attributes.precio_min))
                    doc.setDrawColor('#c4c4c4')
                    doc.line(x + this.product_width - 30 - textWidth, y + this.product_height - this.caja_texto_producto_h - 3 - 1.5, x + this.product_width - 30, y + this.product_height - this.caja_texto_producto_h - 3 - 1.5)
                }
    
            },
    
            add_pagina (doc, is_tapa) {
                doc.addPage()
                this.iniciar_pagina(doc, is_tapa)
                
            },
            iniciar_pagina (doc, is_tapa) {
    
                if ( is_tapa ) {
                    var width = doc.internal.pageSize.getWidth();
                    var height = doc.internal.pageSize.getHeight();
                    doc.setFillColor('#afe1fa')
                    doc.rect(0, 0, width, height, 'F')
                }
    
                doc.setFillColor('#d94d75')
                //doc.setFillColor('#729fcf')
                doc.rect(0, 0, 210, 5, 'F')
    
                doc.setFont(this.fontFamily, 'bold')
                doc.rect(0, 285, 210, 12, 'F')
                doc.setTextColor('#FFFFFF')
                doc.setFontSize(13)
                doc.text('@Plastitodorosario - WSP: +54 341 591-7300 - Baigorria 1306, Rosario', 105, 292, {align: 'center'})         
                doc.setFont(this.fontFamily, 'normal')
    
    
    
    
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
                
    
            },
    
            async buscar () {
                await this.buscar_item(this.catalogo.id)
                    .then((resp) => {
                        let date = new Date()
                        let fecha = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
                        this.filename = 'Catalogo_' + resp.data.data.attributes.name.replaceAll(' ', '_') + '_' + fecha + '.pdf'
                        this.saleproducts = resp.data.data.relationships.saleproducts                 
                        this.saleproducts.sort(function(a, b){
                            if(a.attributes.name < b.attributes.name) { return -1; }
                            if(a.attributes.name > b.attributes.name) { return 1; }
                            return 0;
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            },
    
            is_promo (item) {
                if ( item.attributes.fecha_desc_desde && (new Date(item.attributes.fecha_desc_desde).getTime() <= new Date().getTime()) && (new Date(item.attributes.fecha_desc_hasta).getTime() >= new Date().getTime()) ) {
                    return true;
                }
                return false;
            },
    
        }
    }
    </script>
    
    <style>
    
    </style>