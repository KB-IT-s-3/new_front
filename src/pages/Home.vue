<template>
  <div class="app">
    <header>
      <div class="header-title">
        <h1>My Budget Tracker</h1>
        <div class="user-info">
          <span>User</span>
        </div>
      </div>
    </header>
    <div class="chart-info">
      <div class="chart pie-chart">
        <button @click="showMonth('May')">5월 보기</button>
        <button @click="showMonth('June')">6월 보기</button>
        <Pie :chart-data="pieChartData" :options="chartOptions" />
      </div>
      <div class="chart bar-chart">
        <Bar :chart-data="barChartData" :options="chartOptions" />
      </div>
    </div>
    <div class="spending-info">
      <p>당신의 소비 금액은 {{ totalAmount }} 원 입니다.</p>
      <p>{{ remainingAmount }} 원 남았습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Pie, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import axios from 'axios';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const pieChartData = ref({
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: ['#FFCE56', '#FF6384', '#36A2EB', '#FFCD56', '#FF9F40']
  }]
});

const barChartData = ref({
  labels: [],
  datasets: [
    {
      label: '5월 소비',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    },
    {
      label: '6월 소비',
      data: [],
      backgroundColor: 'rgba(153, 102, 255, 0.5)',
      borderColor: 'rgba(153, 102, 255, 1)',
      borderWidth: 1
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      beginAtZero: true
    },
    y: {
      beginAtZero: true
    }
  }
});

const totalAmount = ref(0);
const remainingAmount = ref(1000000); // 예시로 1,000,000원을 설정
const selectedMonth = ref('May'); // 초기 선택 월은 5월로 설정

const processData = (data) => {
  console.log('Received data:', data); // 데이터 확인용 로그

  const categories = ['cafe', 'food', 'leisure', 'saving', 'shopping'];
  const categoryTotalsMay = { 'cafe': 0, 'food': 0, 'leisure': 0, 'saving': 0, 'shopping': 0 };
  const categoryTotalsJune = { 'cafe': 0, 'food': 0, 'leisure': 0, 'saving': 0, 'shopping': 0 };

  totalAmount.value = data.reduce((sum, entry) => sum + entry.amount, 0);
  remainingAmount.value -= totalAmount.value;

  data.forEach(entry => {
    const month = new Date(entry.date).getMonth() + 1; // 월 추출 (0부터 시작하므로 1을 더함)
    if (month === 5 && categoryTotalsMay[entry.category] !== undefined) {
      categoryTotalsMay[entry.category] += entry.amount;
    } else if (month === 6 && categoryTotalsJune[entry.category] !== undefined) {
      categoryTotalsJune[entry.category] += entry.amount;
    }
  });

  barChartData.value.labels = categories.map(category => category.charAt(0).toUpperCase() + category.slice(1));
  barChartData.value.datasets[0].data = Object.values(categoryTotalsMay);
  barChartData.value.datasets[1].data = Object.values(categoryTotalsJune);

  updatePieChart(selectedMonth.value, categoryTotalsMay, categoryTotalsJune);

  console.log('Pie chart data:', pieChartData.value); // 데이터 확인용 로그
  console.log('Bar chart data:', barChartData.value); // 데이터 확인용 로그
};

const updatePieChart = (month, totalsMay, totalsJune) => {
  const categories = ['cafe', 'food', 'leisure', 'saving', 'shopping'];
  if (month === 'May') {
    pieChartData.value.labels = categories.map(category => category.charAt(0).toUpperCase() + category.slice(1));
    pieChartData.value.datasets[0].data = Object.values(totalsMay);
  } else if (month === 'June') {
    pieChartData.value.labels = categories.map(category => category.charAt(0).toUpperCase() + category.slice(1));
    pieChartData.value.datasets[0].data = Object.values(totalsJune);
  }
};

const showMonth = (month) => {
  selectedMonth.value = month;
  const totalsMay = barChartData.value.datasets[0].data;
  const totalsJune = barChartData.value.datasets[1].data;
  updatePieChart(month, totalsMay, totalsJune);
};

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3001/user1');
    console.log('API response:', response.data); // 데이터 확인용 로그
    processData(response.data); // user1 데이터를 사용
  } catch (error) {
    console.error('Error fetching data:', error);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Inika&display=swap');
@import url('https://fonts.googleapis.com/css?family=Inter&display=swap');
@import url('https://fonts.googleapis.com/css?family=Anaheim&display=swap');

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', sans-serif;
  background-color: rgba(254, 255, 226, 1);
  height: 100vh;
  width: 100vw;
  padding: 20px;
  box-sizing: border-box;
}

.header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
}

h1 {
  font-family: 'Inika', serif;
  font-size: 36px;
  color: rgba(90, 91, 46, 1);
  margin: 0;
}

.user-info {
  background: rgba(251, 255, 156, 1);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  margin-left: 20px;
}

.user-info span {
  font-size: 25px;
  font-weight: 500;
  color: rgba(90, 91, 46, 1);
}

.chart-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  margin-bottom: 1px;
}

.chart {
  width: 40%;
  max-width: 500px;
  margin: 10px;
  height: 250px; /* 높이를 250px로 줄였습니다 */
}

.spending-info {
  background: rgba(255, 255, 255, 1);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  text-align: center;
  width: 100%;
  margin-top: 20px;
}

.spending-info p {
  font-size: 24px;
  font-family: 'Anaheim', sans-serif;
  margin: 10px 0;
}

button {
  margin-right: 10px;
  padding: 5px 10px;
  border: none;
  background-color: #ffcd56;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #ffcd56d1;
}

@media (max-width: 768px) {
  h1 {
    font-size: 24px;
  }

  .user-info span {
    font-size: 20px;
  }

  .chart-info {
    flex-direction: column;
    align-items: center;
  }

  .chart {
    width: 80%;
  }

  .spending-info p {
    font-size: 20px;
  }
}
</style>