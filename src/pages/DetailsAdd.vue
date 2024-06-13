<template>
    <div class="container" my-4>
        <div class="add-wrap">
            <!-- + 버튼을 클릭하면 addEntry 함수를 호출 -->
            <div class="button-row d-flex justify-content-end">
                <button class="btn btn-danger me-2" @click="deleteEntry">-</button>
                <button class="btn btn-primary" @click="addEntry">+</button>
            </div>
            <table class="table-bordered">
                <thead class="table-light">
                    <tr>
                        <th scope="col">날짜</th>
                        <th scope="col">내용</th>
                        <th scope="col">금액</th>
                        <th scope="col">수입/지출</th>
                        <th scope="col">카테고리</th>
                    </tr>
                </thead>
                <tbody class="entries">
                    <tr v-for="(entry, index) in entries" :key="index">
                        <td><input type="date" v-model="entry.date" class="form-control" placeholder="날짜" required /></td>
                        <td><input v-model="entry.content" placeholder="내용" class="form-control"  required /></td>
                        <td><input v-model="entry.amount" placeholder="금액" class="form-control" required /></td>
                        <td>
                            <select v-model="entry.deposit" @change="updateCategories(entry)" class="form-select">
                                <option value="" selected>수입/지출 선택</option>
                                <option value="수입">수입</option>
                                <option value="지출">지출</option>
                            </select>
                        </td>
                        <td>
                            <select v-model="entry.category" class="form-select">
                                <option value="" selected>카테고리 선택</option>
                                <option v-for="category in availableCategories[entry.deposit]" :value="category.value">{{ category.label }}</option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- 저장 버튼을 클릭하면 saveEntry 함수를 호출 -->
            <button id="save-button" @click="saveEntry" class="btn btn-success float-end">저장</button>
            
            <!-- Bootstrap 5 alert -->
            <div v-if="showAlert" class="alert alert-success alert-dismissible fade show mt-3" role="alert">
                가계부가 추가되었습니다.
                <button type="button" class="btn-close" @click="showAlert = false"></button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useUserStore } from "@/stores/userStore.js";

export default {
    setup() {
        // Vue Router를 사용하기 위해 useRouter를 가져옴
        const router = useRouter();
        const availableCategories = reactive({
            '수입': [
                { label: '용돈', value: 'yongdon' },
                { label: '월급', value: 'salary' },
                { label: '로또', value: 'Lotto' },
                { label: '기타', value: 'etc' }
            ],
            '지출': [
                { label: '외식', value: 'food' },
                { label: '카페', value: 'cafe' },
                { label: '저축', value: 'saving' },
                { label: '레저', value: 'leisure' },
                { label: '쇼핑', value: 'shopping' }
            ]
        });
        const userStore = useUserStore();
        const NowUser = ref(userStore.getUser());

        // 입력된 항목들을 담을 배열
        const entries = reactive([
            { date: '', content: '', amount: '', deposit: '', category: '' },
        ]);

        // 상태 변수: alert 표시 여부
        const showAlert = ref(false);

        // 새로운 항목을 추가하는 함수
        const addEntry = () => {
            entries.push({ date: '', content: '', amount: '', deposit: '', category: '' });
        };

        // 항목 삭제 함수
        const deleteEntry = () => {
            if (entries.length > 1) {
                entries.pop();
            } else {
                alert('삭제할 항목이 없습니다.');
            }
        };

        // 입력된 항목들을 서버에 저장하는 함수
        const saveEntry = async () => {
            try {
                const nonEmptyEntries = entries.filter(entry => {
                    return Object.values(entry).every(value => value.trim() != '');
                });

                if (nonEmptyEntries.length === 0) {
                    alert('입력된 데이터가 없습니다.');
                    return;
                }

                // 각 항목의 deposit 값을 true/false로 수정
                entries.forEach(entry => {
                    entry.deposit = entry.deposit === '수입' ? true : false;
                });

                // NowUser.id가 정의되었는지 확인
                if (!NowUser.value) {
                    console.error('User ID가 정의되지 않았습니다.');
                    return;
                }

                // 각 항목을 순회하며 빈 데이터가 아닌 경우에만 서버에 전송
                for (const entry of nonEmptyEntries) {
                    const response = await axios.post(`http://localhost:3000/${NowUser.value}`, entry);
                    // 저장된 항목들을 출력
                    console.log(response.data);
                }

                // 저장이 완료되면 알림창 표시
                showAlert.value = true;

                // Entries를 초기화해서 저장 후에는 입력한 데이터 삭제
                entries.splice(0, entries.length);
            } catch (err) {
                console.error('Error saving entries:', err);
            }
        };

        // 수입 선택 시 카테고리 초기화 함수
        const updateCategories = (entry) => {
            if (entry.deposit === '수입') {
                entry.category = '';
            }
        };

        return {
            entries,
            addEntry,
            deleteEntry,
            saveEntry,
            availableCategories,
            updateCategories,
            showAlert // showAlert 변수를 setup 함수 내에서 반환
        };
    }
};
</script>

<style scoped>
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

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th,
.data-table td {
    text-align: center;
}
</style>
