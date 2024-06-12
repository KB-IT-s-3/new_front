<template>
  <div class="app">
    <div class="chart-info">
      <div class="chart pie-chart">
        <button @click.stop="showMonth('May')">5월 보기</button>
        <button @click.stop="showMonth('June')">6월 보기</button>
        <Pie :chart-data="pieChartData" :options="chartOptions" @click.stop="handleChartClick('pie')"/>
      </div>
      <div class="chart bar-chart" @click="handleChartClick('bar')">
        <Bar :chart-data="barChartData" :options="chartOptions"/>
      </div>
    </div>
    <div class="spending-info"
         @click="goToDetailsAdd"
         @mouseover="onMouseOver"
         @mouseleave="onMouseLeave"
    >
      <p v-if="isHovered">또 돈 쓸꺼야?</p>
      <p v-else>당신의 소비 금액은 {{ totalAmount }} 원 입니다.<br>{{ remainingAmount }} 원 남았습니다.</p>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {Pie, Bar} from 'vue-chartjs';
import {useUserStore} from "@/stores/userStore";
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

const isHovered = ref(false);
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const router = useRouter();
const userStore = useUserStore();

const pieChartData = ref({
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: ['#673512', '#FF6384', '#36A2EB', '#FFCD56', '#FF9F40']
  }]
});

//소비 정리 부분 라우터 연결
const goToDetailsAdd = () => {
  router.push('/detailsadd');
};
//커서 올라가면 바뀌도록 설정
const onMouseOver = () => {
  isHovered.value = true;
};

const onMouseLeave = () => {
  isHovered.value = false;
};

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
  const categories = ['cafe', 'food', 'leisure', 'saving', 'shopping'];
  const categoryTotalsMay = {'cafe': 0, 'food': 0, 'leisure': 0, 'saving': 0, 'shopping': 0};
  const categoryTotalsJune = {'cafe': 0, 'food': 0, 'leisure': 0, 'saving': 0, 'shopping': 0};

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

const handleChartClick = (type) => {
  router.push(`/details?chart=${type}`);
};

onMounted(async () => {
  try {
    const NowUser = userStore.getUser();
    if (!NowUser) {
      console.error('User is not defined');
      return;
    }
    //리터럴을 받을땐 백틱! `으로 할것
    const response = await axios.get(`http://localhost:3000/${NowUser}`);
    console.log(NowUser);
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
  justify-content: center; /* Center align the charts */
  gap: 20px; /* Add gap between the charts */
  width: 100%;
  height: 100%;
  margin-bottom: 1px;
}

.chart {
  width: 45%;
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
  width: 50%;
  margin-bottom: 100px;
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
    background-color: white;
    cursor: pointer;
  }

  .chart {
    width: 80%;
  }

  .spending-info p {
    font-size: 20px;
  }
}
</style>