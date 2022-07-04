<template>
<div>
  
  <v-btn
      @click="generarPDF"
    >
    generarPDF
    </v-btn>
</div>
</template>

<script>
import jsPDF from 'jspdf'
export default {
  data () {
    return {
      modelofact: {
        name: 'A'
      },
      empresa: {
        name: 'PLASTITODO'
      }
    }
  },
  methods: {
    generarPDF() {
      var doc = new jsPDF();
      doc.rect(5, 5, 200, 10);
      doc.setFont('normal', "bold")
      doc.text(92, 12, 'ORIGINAL')
      doc.rect(5, 15, 200, 100)
      doc.rect(99, 15, 12, 12)
      doc.setFontSize(20)
      doc.text(103, 23, this.modelofact.name)

      doc.setFontSize(25);
      doc.setFont('normal', "bold")
      doc.text(15, 25, this.empresa.name)
      console.log(doc.getFont())
      doc.output('dataurlnewwindow');
    }

        
  }
}
</script>

<style scoped>

</style>