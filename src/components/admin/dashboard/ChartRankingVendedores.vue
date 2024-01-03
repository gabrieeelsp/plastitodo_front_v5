<template>
    <div>
        <v-card>
            <v-card-title>
                <span>Ranking Vendedores</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                <Bar :data="chartData" :options="chartOptions" />
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  
    data() {
        return {
            
        }
    },
    props: {
        users: Array,
    },
    components: {
        Bar,
    },

    computed: {
        chartData() {
            return {
                labels: [...this.users].sort((a,b) => b.venta_total - a.venta_total).map((item) => item.name),
                datasets: [
                {
                    label: 'Venta total',
                    backgroundColor: '#f87979',
                    data: [...this.users].sort((a,b) => b.venta_total - a.venta_total).map((item) => item.venta_total)
                }
                ]
            }
        },
        chartOptions() { 
            return {
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false // Esto ocultará la leyenda
                    }
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0
                    }
                },
                //responsive: true,
                barThickness: 30,
                barPercentage: 0.9,
                categoryPercentage: 0.2,
            }
        }
    }


}
</script>