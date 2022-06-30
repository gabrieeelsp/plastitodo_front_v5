<template>
    <v-text-field
        class="right-text-input "
        hide-details
        dense
        solo
        v-model="value"
        ref="cant"
        @keydown.enter="aceptar"
        @keydown.esc="close"
        @focus="$event.target.select()"
        
    ></v-text-field>    
</template>

<script>
export default {
    mounted () {
        this.onload()
    },
    props: {
        item: Object,
    },

    data () {
        return {
            value: 0
        }
    },

    methods: {
        onload() {
            this.value = this.item.value
            setTimeout(() => this.$refs.cant.$refs.input.focus(), 100); 
            
        },

        aceptar () {
            if( this.item.max_value ) {
                if ( Number(this.value) <= Number(this.item.max_value) ) {
                    this.$emit('accept', {
                        id: this.item.id,                        
                        value: this.value
                    }) 
                }
            }else {
                this.$emit('accept', {
                    id: this.item.id,                        
                    value: this.value
                }) 
            }
                     
            
        },
        close () {
            this.$emit('close')
        }
    }
}
</script>

<style>

</style>
