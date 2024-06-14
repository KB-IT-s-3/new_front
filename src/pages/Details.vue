<template>
  <div class="details container mt-4">
    <div class="search row mb-3">
      <div class="col">
        <input type="text" v-model="searchTerm" class="form-control" placeholder="검색" />
      </div>
      <div class="col">
        <input type="date" v-model="startDate" class="form-control" placeholder="시작 날짜" />
      </div>
      <div class="col-auto d-flex align-items-center">
        <span> ~ </span>
      </div>
      <div class="col">
        <input type="date" v-model="endDate" class="form-control" placeholder="종료 날짜" />
      </div>
      <div class="col">
        <select v-model="categoryFilter" class="form-select">
          <option value="">전체</option>
          <option value="food">외식</option>
          <option value="cafe">카페</option>
          <option value="saving">저축</option>
          <option value="leisure">레저</option>
          <option value="shopping">쇼핑</option>
          <option value="yongdon">용돈</option>
          <option value="salary">월급</option>
          <option value="lotto">로또</option>
          <option value="etc">기타</option>
        </select>
      </div>
    </div>
    <table class="table table-hover">
      <thead class="thead-light">
        <tr>
          <th>
            <input type="checkbox" v-model="selectAll" @change="toggleAll" />
          </th>
          <th @click="toggleSortOrder">날짜</th>
          <th>내용</th>
          <th>금액</th>
          <th>수입/지출</th>
          <th>카테고리</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredItems" :key="index">
          <td><input type="checkbox" v-model="item.selected" /></td>
          <td><input type="date" v-model="item.date" class="form-control"></td>
          <td><input type="text" v-model="item.content" class="form-control"></td>
          <td><input type="number" v-model="item.amount" class="form-control"></td>
          <td>
            <select v-model="item.deposit" class="form-select">
              <option :value="true">수입</option>
              <option :value="false">지출</option>
            </select>
          </td>
          <td>
            <select v-model="item.category" class="form-select">
              <option value="">카테고리 선택</option>
              <option v-for="category in getCategories(item.deposit)" :key="category.value" :value="category.value">
                {{ category.label }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="totals d-flex justify-content-between my-3">
      <span class="expense-text">지출: <span class="amount">{{ totalExpense }}</span></span>
      <span class="income-text">수입: <span class="amount">{{ totalIncome }}</span></span>
    </div>
    <!-- 경고(alert) 알림을 위한 함수로 구현 -->
    <div v-if="showAlert" class="alert alert-warning alert-dismissible fade show custom-alert" role="alert">
      <strong>주의!</strong> {{ alertMessage }}
    </div>
    <div class="button-container d-flex justify-content-between">
      <button @click="openModal" class="btn btn-primary">Add</button>
      <div class="actions d-flex">
        <button @click="updateItems" class="btn btn-warning">Update</button>
        <button @click="confirmDelete" class="btn btn-danger">Delete</button>
      </div>
    </div>

    <!-- 모달 열기 버튼 -->
    <!-- <button @click="openModal" class="btn btn-primary">추가</button> -->
    <div class="modal-wrap" v-show="modalOpen">
      <div class="modal-container p-3">
        <DetailsAdd @entryAdded="handleEntryAdded" />
        <div class="modal-btn mt-3">
          <button @click="closeModal" class="btn btn-secondary">닫기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/stores/userStore.js";
import axios from "axios";
import { computed, onMounted, reactive, ref, watch } from 'vue';
import DetailsAdd from './DetailsAdd.vue';

export default {
  components: {
    // DetailsAdd 컴포넌트를 등록합니다.
    DetailsAdd
  },
  setup() {
    const userStore = useUserStore();
    const searchTerm = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const categoryFilter = ref("");
    const modalOpen = ref(false);
    const selectAll = ref(false); // 전체 선택 체크박스 상태
    const sortOrder = ref("asc"); // 정렬 순서 상태
    const state = reactive({
      items: [],
    });


    const showAlert = ref(false);
    const alertMessage = ref('');

    const availableCategories = reactive({
      수입: [
        { label: '용돈', value: 'yongdon' },
        { label: '월급', value: 'salary' },
        { label: '로또', value: 'lotto' },
        { label: '기타', value: 'etc' }
      ],
      지출: [
        { label: '외식', value: 'food' },
        { label: '카페', value: 'cafe' },
        { label: '저축', value: 'saving' },
        { label: '레저', value: 'leisure' },
        { label: '쇼핑', value: 'shopping' }
      ]
    });


    const NowUser = userStore.getUser();
    const NowUserTarget = userStore.getUserAll().target;

    const fetchData = async () => {
      try {
        const response = await axios.get(`https://2697-121-130-103-204.ngrok-free.app/${NowUser}`);
        state.items = response.data.map((item) => ({ ...item, selected: false }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const filteredItems = computed(() => {
      return state.items.filter((item) => {
        return (
          (!searchTerm.value || item.content.includes(searchTerm.value)) &&
          (!startDate.value || new Date(item.date) >= new Date(startDate.value)) &&
          (!endDate.value || new Date(item.date) <= new Date(endDate.value)) &&
          (!categoryFilter.value || item.category === categoryFilter.value)
        );
      }).sort((a, b) => {
        if (sortOrder.value === "asc") {
          return new Date(a.date) - new Date(b.date);
        } else {
          return new Date(b.date) - new Date(a.date);
        }
      });
    });

    const totalExpense = computed(() => {
      return filteredItems.value
        .filter((item) => !item.deposit)
        .reduce((total, item) => total + parseFloat(item.amount), 0);
    });

    const totalIncome = computed(() => {
      return filteredItems.value
        .filter((item) => item.deposit)
        .reduce((total, item) => total + parseFloat(item.amount), 0);
    });

    const updateItems = async () => {
      for (const item of state.items) {
        await axios.put(`https://2697-121-130-103-204.ngrok-free.app/${NowUser}/${item.id}`, item);
      }
      alert('수정되었습니다!');
      await fetchData();
      checkTargetExceeded();
    };

    const deleteItems = async () => {
      const selectedItems = state.items.filter((item) => item.selected);
      for (const item of selectedItems) {
        await axios.delete(`https://2697-121-130-103-204.ngrok-free.app/${NowUser}/${item.id}`);
      }
      await fetchData(); // Reload data
      checkTargetExceeded();
    };

    const toggleAll = () => {
      filteredItems.value.forEach((item) => (item.selected = selectAll.value));
    };

    const confirmDelete = () => {
      if (confirm("정말로 삭제하시겠습니까?")) {
        deleteItems();
      }
    };

    const getCategories = (isIncome) => {
      return isIncome ? availableCategories.수입 : availableCategories.지출;
    };

    const allCategories = computed(() => {
      return [...availableCategories.수입, ...availableCategories.지출];
    });

    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    };

    const openModal = () => {
      modalOpen.value = true;
    };

    const closeModal = () => {
      modalOpen.value = false;
    };

    const handleEntryAdded = async () => {
      await fetchData(); // 데이터 다시 로드
      checkTargetExceeded();
      closeModal(); // 모달 닫기
    };

    
    watch(()=>userStore.getTargetChange(),(newVal) => {
      if(newVal){
        checkTargetExceededAdd();
      }
      else{
        checkTargetExceededAdd();
      }
      
  })

    const checkTargetExceeded = () => {
      const totalExpensesValue = parseInt(totalExpense.value, 10);
      if (totalExpensesValue > NowUserTarget) {
        showAlert.value = true;
        alertMessage.value = `목표 금액 ${NowUserTarget}원을 ${totalExpensesValue - NowUserTarget}원 초과했습니다!`;
      }
      else {
        showAlert.value = false;
      }
    };

    const checkTargetExceededAdd = () => {
      const NewUserTarget = parseInt(userStore.getTargetValue(), 10);
      const totalExpensesValue = parseInt(totalExpense.value, 10);
      if (totalExpensesValue > NewUserTarget) {
        showAlert.value = true;
        alertMessage.value = `목표 금액 ${NewUserTarget}원을 ${totalExpensesValue - NewUserTarget}원 초과했습니다!`;
      }
      else {
        showAlert.value = false;
      }
    };


    onMounted(() => {
      fetchData();
      // 목표 금액 데이터 가져오기 (user_data.json에서 가져와서 target에 할당)
      axios.get(`https://3fed-121-130-103-204.ngrok-free.app/UserList`)
        .then(response => {
          checkTargetExceeded();
        })
        .catch(error => {
          console.error('Error fetching target data:', error);
        });
    }

  );

    // 반환
    return {
      searchTerm,
      startDate,
      endDate,
      categoryFilter,
      selectAll,
      state,
      filteredItems,
      totalExpense,
      totalIncome,
      updateItems,
      confirmDelete,
      toggleAll,
      getCategories,
      allCategories,
      toggleSortOrder,
      openModal,
      closeModal,
      handleEntryAdded,
      modalOpen,
      showAlert,
      alertMessage,
      checkTargetExceeded
    };
  },
};
</script>

<style>
body {
  background-color: rgba(254, 255, 226, 1);
  /* 페이지 전체의 배경색 설정 */
}

.details {
  text-align: left;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.character {
  width: 13%;
  position: absolute;
  top: 830px;
  left: 85%;

}

.search {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.totals {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.expense-text {
  color: red;
}

.income-text {
  color: blue;
}

.amount {
  color: black;
  border: 10px;
  padding: 2px 5px;
  border-radius: 4px;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #ffcd3c;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-wrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
}

/* modal or popup */
.modal-container {
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  background: #fafae6;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
}

.form-select {
  height: calc(2.25rem + 8px); /* 높이를 조정하여 다른 input 요소와 일치시킴 */
  padding: 0.375rem 0.75rem; /* 패딩을 조정하여 일관된 높이를 유지 */
  font-size: 1rem; /* 폰트 크기 조정 */
}

.custom-alert {
  width: 80%;
    margin: 0 0 10 0; 
}

@media (max-width: 1200px) {
  .custom-alert {
    width: 80%; 
  }
}

@media (max-width: 992px) {
  .custom-alert {
    width: 80%; 
  }
}

@media (max-width: 768px) {
  .custom-alert {
    width: 70%;
  }
}

@media (max-width: 576px) {
  .custom-alert {
    width: 60%
  }
}

</style>