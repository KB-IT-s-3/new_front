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
              <option value="food">외식</option>
              <option value="cafe">카페</option>
              <option value="saving">저축</option>
              <option value="leisure">레저</option>
              <option value="shopping">쇼핑</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="totals">
      <span>출금: {{ totalExpense }}</span>
      <span>입금: {{ totalIncome }}</span>
    </div>
    <div class="actions">
      <button @click="updateItems">Update</button>
      <button @click="confirmDelete">Delete</button>
    </div>
    <img src="../../public/character.png" class="character">
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import axios from "axios";
import { useUserStore } from "@/stores/userStore.js";

export default {
  setup() {
    const userStore = useUserStore();
    const searchTerm = ref("");
    const startDate = ref("");
    const endDate = ref("");
    const categoryFilter = ref("");
    const selectAll = ref(false); // 전체 선택 체크박스 상태
    const state = reactive({
      items: [],
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
    };
  },
};
</script>

<style>
.details {
  height: 1200px;
  text-align: left;
  background-color: #FEFFE2;
  padding: 20px;
  border-radius: 8px; 
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.character{
    width: 13%;
    position: absolute;
    top: 780px;
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
</style>
