<template>
  

    <v-dialog
      v-model="intDialogVisible"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5">
            
          
        </v-card-title>
        
        <v-card-text>
            
          <v-row>
            <v-col cols="12" class="d-flex justify-space-between align-center">
              <span>Registrando Venta</span>
              <v-progress-circular
                v-if="is_registrandoVenta"
                indeterminate
                color="amber"
              ></v-progress-circular>
              <template v-if="!is_registrandoVenta">
                <v-icon large
                  v-if="!error_saving_message"
                  color="green"
                >
                  mdi-check
                </v-icon>
              
                <v-icon large
                  v-if="error_saving_message"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="d-flex justify-space-between align-center">
              <span>Emitiendo Factura</span>
              <v-progress-circular
                v-if="is_facturando"
                indeterminate
                color="amber"
              ></v-progress-circular>
              <template v-if="!is_facturando">
                <v-icon large
                  v-if="!error_facturando_message"
                  color="green"
                >
                  mdi-check
                </v-icon>
              
                <v-icon large
                  v-if="error_facturando_message"
                  color="red"
                >
                  mdi-alert-circle-outline
                </v-icon>
              </template>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-alert
          class="mt-2"
            v-if="error_saving_message"
            text
            prominent
            type="error"
            icon="mdi-cloud-alert"
          >
            {{ error_saving_message }}
          </v-alert>
          <v-alert
          class="mt-2"
            v-if="error_facturando_message"
            text
            prominent
            type="error"
            icon="mdi-cloud-alert"
          >
            {{ error_facturando_message }}
          </v-alert>
          
        </v-card-text>
      </v-card>
    </v-dialog>
  
</template>

<script>

export default {
    mounted () {
          
    },
    data () {
      return {

      }
    },
    props: {
        dialogVisible: Boolean,
        guardando_venta: Boolean,
        is_registrandoVenta: Boolean,
        error_saving_message: String,
        is_facturando: Boolean,
        error_facturando_message: String
    
    },
    computed: {
        intDialogVisible: {
            get: function () {
                if (this.dialogVisible) {
                // Some dialog initialization code could be placed here
                // because it is called only when this.dialogVisible changes
                }

                return this.dialogVisible
            },
            set: function (value) {
                    if (!value) {
                    this.$emit('close')
                    }
            }
        }
    },
    methods: {
        

    }
  }
</script>