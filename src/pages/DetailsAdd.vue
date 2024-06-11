<template>
    <div class="container">
        <div class="add-wrap">
            <button class="add-entry" @click="addEntry">+</button>
            <div class="header-bar">
                <span class="date-header">날짜</span>
                <span class="content-header">내용</span>
                <span class="amount-header">금액</span>
                <span class="type-header">수입/지출</span>
                <span class="category-header">카테고리</span>

            </div>
            <div class="entries">
                <div v-for="(entry, index) in entries" :key="index" class="entry">
                    <input v-model="entry.date" placeholder="날짜" />
                    <input v-model="entry.content" placeholder="내용" />
                    <input v-model="entry.amount" placeholder="금액" />
                    <input v-model="entry.type" placeholder="수입/지출" />
                    <select v-model="entry.category">
                        <option value="" selected>카테고리 선택</option>
                        <option value="외식">외식</option>
                        <option value="카페" selected>카페</option>
                        <option value="저축">저축</option>
                        <option value="레저">레저</option>
                        <option value="쇼핑">쇼핑</option>
                    </select>
                </div>
            </div>
            <button class="save-button">저장</button>
        </div>
    </div>

</template>
<script>
import { ref } from 'vue';
export default {
    setup() {
        const entries = ref([
            { date: '2024-06-10', content: '6월 급여', amount: '5,000,000', type: '수입', category: '급여' },
        ]);

        const addEntry = () => {
            entries.value.push({ date: '', content: '', amount: '', type: '', category: '' });
        };

        return {
            entries,
            addEntry
        };
    }
}
</script>
<style scoped>
.container {
    /* background: rgba(254, 255, 226, 1); */
}

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

.type-header,
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