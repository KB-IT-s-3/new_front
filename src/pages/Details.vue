<template>
  <div class="details">
    <h1>My Budget Tracker</h1>
    <div class="search">
      <input type="text" v-model="searchTerm" placeholder="검색" />
      <input type="date" v-model="startDate" placeholder="시작 날짜" />
      <span> ~ </span>
      <input type="date" v-model="endDate" placeholder="종료 날짜" />
      <input type="text" v-model="category" placeholder="카테고리" />
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
            <input type="text" v-model="item.category">
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
        <button @click="deleteItems">Delete</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      searchTerm: "",
      startDate: "",
      endDate: "",
      category: "",
      userId: "user1", // 현재 사용자 ID를 지정
      items: [],
      selectAll: false, // 전체 선택 체크박스 상태
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) => {
        return (
          (!this.searchTerm || item.content.includes(this.searchTerm)) &&
          (!this.startDate ||
            new Date(item.date) >= new Date(this.startDate)) &&
          (!this.endDate || new Date(item.date) <= new Date(this.endDate)) &&
          (!this.category || item.category.includes(this.category))
        );
      });
    },
    totalExpense() {
      return this.filteredItems
        .filter((item) => !item.deposit)
        .reduce((total, item) => total + item.amount, 0);
    },
    totalIncome() {
      return this.filteredItems
        .filter((item) => item.deposit)
        .reduce((total, item) => total + item.amount, 0);
    },
  },
  methods: {
    async fetchData() {
      const response = await axios.get(`http://localhost:3000/${this.userId}`);
      this.items = response.data.map((item) => ({ ...item, selected: false }));
    },
    async updateItems() {
      for (const item of this.items) {
        await axios.put(`http://localhost:3000/${this.userId}/${item.id}`, item);
      }
      alert('Items updated successfully!');
    },
    async deleteItems() {
      // 선택된 항목만 삭제
      const selectedItems = this.items.filter((item) => item.selected);
      for (const item of selectedItems) {
        await axios.delete(`http://localhost:3000/${this.userId}/${item.id}`);
      }
      this.fetchData(); // 데이터 다시 불러오기
    },
    toggleAll() {
      this.filteredItems.forEach((item) => (item.selected = this.selectAll));
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style>
.details {
  text-align: left;
  background-color: #FEFFE2;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
