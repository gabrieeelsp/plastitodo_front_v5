<template>
    <div>
        <v-card>
            <v-card-title>
                <span>Ventas por Tipo de cliente</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <Doughnut :data="chartData" :options="chartOptions" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default {
    data () {
        return {
            chartData: {
                labels: [ 'Mayorista', 'Minorista'],
                datasets: [
                {
                    label: 'Venta',
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                    ],
                    hoverOffset: 4,
                    data: [this.venta_total_mayorista, this.venta_total_minorista]
                }
                ]
            },
            chartOptions: {
                responsive: true,
            }
        }
    },
    props: {
        venta_total_mayorista: Number,
        venta_total_minorista: Number,
    },
    components: {
        Doughnut,
    }
}
</script>