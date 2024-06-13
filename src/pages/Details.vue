<template>
  <div class="details">
    <div class="search">
      <input type="text" v-model="searchTerm" placeholder="검색" />
      <input type="date" v-model="startDate" placeholder="시작 날짜" />
      <span> ~ </span>
      <input type="date" v-model="endDate" placeholder="종료 날짜" />
      <select v-model="categoryFilter">
        <option value="">전체</option>
        <option value="food">외식</option>
        <option value="cafe">카페</option>
        <option value="saving">저축</option>
        <option value="leisure">레저</option>
        <option value="shopping">쇼핑</option>
      </select>
    </div>
    <table>
      <thead>
        <tr>
          <th>
            <input type="checkbox" v-model="selectAll" @change="toggleAll" />
          </th>
          <th>날짜</th>
          <th>내용</th>
          <th>금액</th>
          <th>수입/지출</th>
          <th>카테고리</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredItems" :key="index">
          <td><input type="checkbox" v-model="item.selected" /></td>
          <td>
            <input type="date" v-model="item.date">
          </td>
          <td>
            <input type="text" v-model="item.content">
          </td>
          <td>
            <input type="number" v-model="item.amount">
          </td>
          <td>
            <select v-model="item.deposit">
              <option :value="true">수입</option>
              <option :value="false">지출</option>
            </select>
          </td>
          <td>
            <select v-model="item.category">
              <option value="">카테고리 선택</option>
              <option v-for="category in getCategories(item.deposit)" :key="category.value" :value="category.value">
                {{ category.label }}
              </option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="totals">
      <span>지출: {{ totalExpense }}</span>
      <span>수입: {{ totalIncome }}</span>
    </div>
    <div class="actions">
      <button @click="updateItems">Update</button>
      <button @click="confirmDelete">Delete</button>
    </div>

    <!-- 모달 열기 버튼 -->

    <button @click="openModal">Modal</button>

    <div class="modal-wrap" v-show="modalOpen">
      <div class="modal-container">

        <DetailsAdd @entryAdded="handleEntryAdded" />
        <div class="modal-btn">
          <button @click="closeModal">닫기</button>
        </div>
      </div>
    </div>

    <img src="../../public/character.png" class="character">
  </div>
</template>

<script>
import { useUserStore } from "@/stores/userStore.js";
import axios from "axios";
import { computed, onMounted, reactive, ref } from 'vue';
import DetailsAdd from './DetailsAdd.vue';

export default {
  components: {
    DetailsAdd // DetailsAdd 컴포넌트를 등록합니다.
  },
  setup() {
    const userStore = useUserStore();
    const searchTerm = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const categoryFilter = ref("");
    const modalOpen  = ref(false);
    const selectAll = ref(false); // 전체 선택 체크박스 상태
    const sortOrder = ref("asc"); // 정렬 순서 상태
    const state = reactive({
      items: [],
    });

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

    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/${NowUser}`);
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
        .reduce((total, item) => total + item.amount, 0);
    });

    const totalIncome = computed(() => {
      return filteredItems.value
        .filter((item) => item.deposit)
        .reduce((total, item) => total + item.amount, 0);
    });

    const updateItems = async () => {
      for (const item of state.items) {
        await axios.put(`http://localhost:3000/${NowUser}/${item.id}`, item);
      }
      alert('수정되었습니다!');
    };

    const deleteItems = async () => {
      const selectedItems = state.items.filter((item) => item.selected);
      for (const item of selectedItems) {
        await axios.delete(`http://localhost:3000/${NowUser}/${item.id}`);
      }
      fetchData(); // Reload data
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

    

    const handleEntryAdded = () => {
      fetchData(); // 데이터 다시 로드
      closeModal(); // 모달 닫기
    };


    onMounted(fetchData);

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
      modalOpen
    };
  },
};
</script>

<style>
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
</style>