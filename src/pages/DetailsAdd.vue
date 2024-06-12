<template>
    <div class="container">
        <div class="add-wrap">
            <!-- + 버튼을 클릭하면 addEntry 함수를 호출 -->
            <div class="button-row">
                <button class="delete-entry" @click="deleteEntry">-</button>
                <button class="add-entry" @click="addEntry">+</button>
            </div>
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
                        <td><input type="date" v-model="entry.date" placeholder="날짜" required /></td>
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
            <button id="save-button" @click="saveEntry" class="btn btn-success">저장</button>
        </div>
    </div>

</template>
<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from "@/stores/userStore.js";

export default {
    setup() {
        // Vue Router를 사용하기 위해 useRouter를 가져옴
        const router = useRouter();

        const userStore = useUserStore();;
        const NowUser = ref(userStore.getUser());

        // 입력된 항목들을 담을 배열
        const entries = ref([
            { date: '', content: '', amount: '', deposit: '', category: '' },
        ]);
        // 새로운 항목을 추가하는 함수
        const addEntry = () => {
            entries.value.push({ date: '', content: '', amount: '', deposit: '', category: '' });
        };

        const deleteEntry = () => {
            if (entries.value.length > 1) {
                entries.value.pop();
            } else {
                alert('삭제할 항목이 없습니다.');
            }
        };

        // 입력된 항목들을 서버에 저장하는 함수
        const saveEntry = async () => {
            try {
                // 저장된 항목들을 담을 배열
                const savedEntries = []

                const nonEmptyEntries = entries.value.filter(entry => {
                    return Object.values(entry).every(value => value.trim() != '')
                })

                if (nonEmptyEntries.length === 0) {
                    alert('입력된 데이터가 없습니다.');
                    return;
                }

                // 각 항목의 deposit 값을 true/false로 수정
                entries.value.forEach(entry => {
                    entry.deposit = entry.deposit === '수입' ? true : false;
                });

                // NowUser.id가 정의되었는지 확인
                if (!NowUser.value) {
                    console.error('User ID가 정의되지 않았습니다.');
                    return;
                }

                // 각 항목을 순회하며 빈 데이터가 아닌 경우에만 서버에 전송
                for (const entry of nonEmptyEntries) {
                    // ${NowUser.id}
                    const response = await axios.post(`http://localhost:3000/${NowUser.value}`, entry);
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
            entries, addEntry, deleteEntry, saveEntry
        };
    }
}
</script>
<style scoped>
.container {
    width: 100%;
    height: 1200px;
    background: rgba(254, 255, 226, 1);
}

.add-wrap {
    width: 100%;
    padding: 10px;
    display: flex;
    flex-direction: column;
}
.button-row {
    display: flex;
    margin-bottom: 10px;
    justify-content: flex-end;
}

.delete-entry {
    margin-right: 5px;
}

.add-entry {
    margin-left: 5px;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th,
.data-table td {
    width: 20%;
    border: 1px solid #ddd;
    text-align: center;
    display: inline-block;
}

.data-table th {
    background-color: rgba(251, 255, 156, 1);
    color: rgba(90, 91, 46, 1);
}

input,
select {
    width: 100%;
    height: 100%;
}



#save-button {
    width: 10%;
    align-self: flex-end;
}
</style>