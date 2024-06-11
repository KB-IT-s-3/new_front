<template>
    <div class="container">
        <div class="add-wrap">
            <!-- + 버튼을 클릭하면 addEntry 함수를 호출 -->
            <button class="add-entry" @click="addEntry">+</button>
            <div class="header-bar">
                <!-- 각 항목의 헤더 -->
                <span class="date-header">날짜</span>
                <span class="content-header">내용</span>
                <span class="amount-header">금액</span>
                <span class="deposit-header">수입/지출</span>
                <span class="category-header">카테고리</span>

            </div>
            <div class="entries">
                <!-- entries 배열을 순회하며 입력 폼을 생성 -->
                <div v-for="(entry, index) in entries" :key="index" class="entry">
                    <input v-model="entry.date" placeholder="날짜" required />
                    <input v-model="entry.content" placeholder="내용" required />
                    <input v-model="entry.amount" placeholder="금액" required />
                    <select v-model="entry.deposit">
                        <!-- 수입/지출을 선택할 수 있는 드롭다운 -->
                        <option value="" selected>수입/지출 선택</option>
                        <option value="수입">수입</option>
                        <option value="지출">지출</option>
                    </select>
                    <select v-model="entry.category">
                        <!-- 카테고리를 선택할 수 있는 드롭다운 -->
                        <option value="" selected>카테고리 선택</option>
                        <option value="food">외식</option>
                        <option value="cafe">카페</option>
                        <option value="saving">저축</option>
                        <option value="leisure">레저</option>
                        <option value="shopping">쇼핑</option>
                    </select>
                </div>
            </div>
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
.add-wrap {
    width: 90%;
}

.header-bar {
    width: 100%;
    height: 64px;
    background: rgba(251, 255, 156, 1);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

.deposit-header,
.amount-header,
.date-header,
.content-header,
.category-header {
    color: rgba(90, 91, 46, 1);
    font-size: 20px;
    text-align: center;
}

.entries {
    width: 100%;
    position: relative;
    overflow: hidden;
}

.entry {
    display: flex;
    justify-content: space-around;
    margin-bottom: 5px;
}

.entry input {
    width: 100%;
    padding: 8px;
    font-size: 16px;
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