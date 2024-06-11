<template>
    <div class="container">
        <div class="add-wrap">
            <!-- + 버튼을 클릭하면 addEntry 함수를 호출 -->
            <button class="add-entry" @click="addEntry">+</button>
            <table class="data-table">
                <thead>
                    <tr>
                        <th class="date-header">날짜</th>
                        <th class="content-header">내용</th>
                        <th class="amount-header">금액</th>
                        <th class="deposit-header">수입/지출</th>
                        <th class="category-header">카테고리</th>
                    </tr>
                </thead>
                <tbody class="entries">
                    <tr v-for="(entry, index) in entries" :key="index" class="entry">
                        <td><input v-model="entry.date" placeholder="날짜" required /></td>
                        <td><input v-model="entry.content" placeholder="내용" required /></td>
                        <td><input v-model="entry.amount" placeholder="금액" required /></td>
                        <td>
                            <select v-model="entry.deposit">
                                <option value="" selected>수입/지출 선택</option>
                                <option value="수입">수입</option>
                                <option value="지출">지출</option>
                            </select>
                        </td>
                        <td>
                            <select v-model="entry.category">
                                <option value="" selected>카테고리 선택</option>
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
            <!-- 저장 버튼을 클릭하면 saveEntry 함수를 호출 -->
            <button class="save-button" @click="saveEntry">저장</button>
        </div>
    </div>

</template>
<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
export default {
    setup() {
        // Vue Router를 사용하기 위해 useRouter를 가져옴
        const router = useRouter();

        // 입력된 항목들을 담을 배열
        const entries = ref([
            { date: '', content: '', amount: '', deposit: '', category: '' },
        ]);
        // 새로운 항목을 추가하는 함수
        const addEntry = () => {
            entries.value.push({ date: '', content: '', amount: '', deposit: '', category: '' });
        };

        // 입력된 항목들을 서버에 저장하는 함수
        const saveEntry = async () => {
            try {
                // 저장된 항목들을 담을 배열
                const savedEntries = []

                // 각 항목의 deposit 값을 true/false로 수정
                entries.value.forEach(entry => {
                    entry.deposit = entry.deposit === '수입' ? true : false;
                });

                // 각 항목을 순회하며 서버에 각각 저장
                for (const entry of entries.value) {
                    const response = await axios.post('http://localhost:3001/user1', entry);
                    savedEntries.push(response.data);
                }

                // 저장이 완료되면 콘솔에 저장된 항목들을 출력 및 성공 알림창
                console.log(savedEntries)
                alert('가계부가 추가되었습니다.');

                // Entries를 초기화
                entries.value = [{ date: '', content: '', amount: '', deposit: '', category: '' }];
                
                router.push(`/`);
            } catch (err) {
                console.error('Error saving entries:', err);
            }
        }
        return {
            entries, addEntry, saveEntry
        };
    }
}
</script>
<style scoped>
.container {
    height: 100vh;
}

.add-wrap {
    width: 90%;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th, .data-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}
.data-table th {
    background-color: rgba(251, 255, 156, 1);
    color: rgba(90, 91, 46, 1);
}

.add-entry {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
    background: rgba(251, 255, 156, 1);
    border-radius: 8px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
    float: right;
}

.save-button {
    width: 87px;
    height: 50px;
    background: rgba(251, 255, 156, 1);
    border-radius: 8px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
    float: right
}
</style>