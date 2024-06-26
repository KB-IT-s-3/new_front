<template>
  <div class="app">
    <div class="chart-info">
      <div class="chart pie-chart">
        <button :class="{ active: selectedMonth.value === previousMonth.value }" @click.stop="showMonth(previousMonth)">
          지난달 보기
        </button>
        <button :class="{ active: selectedMonth.value === currentMonth.value }" @click.stop="showMonth(currentMonth)">이번
          달 보기
        </button>
        <Pie :chart-data="pieChartData" :options="chartOptions"/>
        <p v-if="selectedMonthName">{{ selectedMonthName }}의 지출 차트</p>
      </div>
      <div class="chart bar-chart">
        <Bar :chart-data="barChartData" :options="chartOptions"/>
      </div>
    </div>
    <div class="spending-info"
         @click="goToDetailsAdd"
         @mouseover="onMouseOver"
         @mouseleave="onMouseLeave">
      <p v-if="isHovered">너 돈 많아? 너 부자야? 돈을 또 썼다고?</p>
      <p v-else>
        당신의 지출 금액은 {{ totalAmount }} 원 입니다.<br>
        <span v-if="remainingAmount >= 0">수입 대비{{ remainingAmount }} 원 남았습니다.</span>
        <span v-else>수입 대비 {{ Math.abs(remainingAmount) }} 원 초과되었습니다.</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {Bar, Pie} from 'vue-chartjs';
import {useUserStore} from "@/stores/userStore";
import {ArcElement, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip} from 'chart.js';
import axios from 'axios';

const isHovered = ref(false);
ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

const router = useRouter();
const userStore = useUserStore();

const pieChartData = ref({
  labels: [],
  datasets: [{
    data: [0, 0, 0, 0, 1], // 빈 데이터
    backgroundColor: ['#673512', '#FF6384', '#36A2EB', '#FFCD56', '#FF9F40']
  }]
});

const selectedMonthName = ref('');

//소비 정리 부분 라우터 연결
const goToDetailsAdd = () => {
  router.push('/details');
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
      label: '지난달 지출',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    },
    {
      label: '이번 달 지출',
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
const remainingAmount = ref(0); // 초기 남은 금액 설정
const selectedMonth = ref(''); // 초기 선택 월은 빈 값으로 설정

// 현재 시각 기준으로 이번 달과 저번 달을 계산
const now = new Date();
const currentMonth = ref(now.getMonth() + 1); // 이번 달 (0부터 시작하므로 1을 더함)
const previousMonth = ref(now.getMonth() === 0 ? 12 : now.getMonth()); // 저번 달 (1월의 경우 12월로 설정)
const currentMonthName = ref(now.toLocaleString('default', {month: 'long'})); // 이번 달 이름
const previousMonthName = ref(new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleString('default', {month: 'long'})); // 저번 달 이름

const processData = (data) => {
  const categories = ['카페', '음식', '레저', '저축', '쇼핑'];
  const categoryTotalsPrevious = {'cafe': 0, 'food': 0, 'leisure': 0, 'saving': 0, 'shopping': 0};
  const categoryTotalsCurrent = {'cafe': 0, 'food': 0, 'leisure': 0, 'saving': 0, 'shopping': 0};

// 특정 월(6월)의 입금 내역과 지출 내역을 각각 필터링
  const depositDataCurrentMonth = data.filter(entry => entry.deposit !== false && new Date(entry.date).getMonth() + 1 === currentMonth.value);
  const expenseDataCurrentMonth = data.filter(entry => entry.deposit === false && new Date(entry.date).getMonth() + 1 === currentMonth.value);

  // 특정 월(6월)의 입금 내역의 총 금액 계산
  const totalDeposit = depositDataCurrentMonth.reduce((sum, entry) => sum + Number(entry.amount), 0);

  // 특정 월(6월)의 지출 내역의 총 금액 계산
  const totalExpenseCurrentMonth = expenseDataCurrentMonth.reduce((sum, entry) => sum + Number(entry.amount), 0);

  totalAmount.value = totalExpenseCurrentMonth;
  remainingAmount.value = totalDeposit - totalAmount.value;

  // 이전 달과 현재 달의 지출을 계산하여 카테고리별로 합산
  const expenseDataPreviousMonth = data.filter(entry => entry.deposit === false && new Date(entry.date).getMonth() + 1 === previousMonth.value);
  expenseDataPreviousMonth.forEach(entry => {
    if (categoryTotalsPrevious[entry.category] !== undefined) {
      categoryTotalsPrevious[entry.category] += Number(entry.amount);
    }
  });

  expenseDataCurrentMonth.forEach(entry => {
    if (categoryTotalsCurrent[entry.category] !== undefined) {
      categoryTotalsCurrent[entry.category] += Number(entry.amount);
    }
  });

  barChartData.value.labels = categories.map(category => category.charAt(0).toUpperCase() + category.slice(1));
  barChartData.value.datasets[0].data = Object.values(categoryTotalsPrevious);
  barChartData.value.datasets[1].data = Object.values(categoryTotalsCurrent);
};

const updatePieChart = (month, totalsPrevious, totalsCurrent) => {
  const categories = ['카페', '음식', '레저', '저축', '쇼핑'];
  if (month === previousMonth.value) {
    pieChartData.value.labels = categories.map(category => category.charAt(0).toUpperCase() + category.slice(1));
    pieChartData.value.datasets[0].data = Object.values(totalsPrevious);
    selectedMonthName.value = previousMonthName.value;
  } else if (month === currentMonth.value) {
    pieChartData.value.labels = categories.map(category => category.charAt(0).toUpperCase() + category.slice(1));
    pieChartData.value.datasets[0].data = Object.values(totalsCurrent);
    selectedMonthName.value = currentMonthName.value;
  } else {
    // 초기 상태에서 빈 차트를 표시하도록 설정
    pieChartData.value.labels = categories.map(category => category.charAt(0).toUpperCase() + category.slice(1));
    pieChartData.value.datasets[0].data = [0, 0, 0, 0, 0];
    selectedMonthName.value = '';
  }
};

const showMonth = (month) => {
  selectedMonth.value = month;
  const totalsPrevious = barChartData.value.datasets[0].data;
  const totalsCurrent = barChartData.value.datasets[1].data;
  updatePieChart(month, totalsPrevious, totalsCurrent);
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
  font-family: ‘Inika’, serif;
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
  justify-content: center;
  /* Center align the charts /
 gap: 20px; / Add gap between the charts */
  width: 100%;
  height: 100%;
  margin-bottom: 1px;
}

.chart {
  width: 45%;
  max-width: 500px;
  margin: 10px;
  height: 250px;
  /* 높이를 250px로 줄였습니다 /
 cursor: pointer; / 차트에 커서가 올라가면 포인터로 변경 */
}

.spending-info {
  position: absolute;
  bottom: 20px;
  background: rgba(255, 255, 255, 1);
  padding: 20px;
  border-radius: 100px;
  border: 2px solid black;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  text-align: center;
  width: 50%;
  cursor: pointer;
}

.spending-info p {
  font-size: 24px;
  font-family: ‘Anaheim’, sans-serif;
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

button.active {
  background-color: #ffaa00; /* 활성화된 버튼의 색상 */
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
    gap: 20px; /* 차트 사이의 간격을 유지 */
  }

  .chart {
    width: 100%;
    /* 작은 화면에서는 차트가 가로로 꽉 차도록 설정 /
   height: auto; / 차트의 높이를 자동으로 설정 */
  }

  .spending-info {
    width: 80%; /* 작은 화면에서는 spending-info의 가로 크기를 80%로 설정 */
  }

  .spending-info p {
    font-size: 20px;
  }
}
</style>