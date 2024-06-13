<template lang="">
    <div class="Left">
        <img src="../../public/character.png" class="character">
    </div>
    <div class="Rignt">
        <ul>
            <li>아이디: <input type="text" v-model="id" /></li>
            <li>비밀번호: <input type="password" v-model="pwd" /></li>
            <li><button @click="loginSubmitHandler">로그인</button></li>
        </ul>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useUserStore } from "@/stores/userStore.js";
import { useRouter } from 'vue-router';
export default {
    setup() {
        let id = ref('');
        let pwd = ref('');
        const url = 'http://localhost:3002/UserList';
        const userStore = useUserStore();
        const router = useRouter()


        const loginSubmitHandler = async () => {
            try {
                const result = await requestList();
                const user = result.find(user => user.id === id.value && user.pwd === pwd.value);
                if (user) {
                    userStore.setUser(user);    
                    userStore.setLogin();
                    router.push('./home')
                    alert('로그인 성공');
                } else {
                    alert('아이디 또는 비밀번호가 일치하지 않습니다.');
                }
            } catch (error) {
                console.error('로그인 요청 중 에러 발생:', error);
                alert('로그인 요청 중 문제가 발생했습니다. 나중에 다시 시도하세요.');
            }
        };

        const requestList = async () => {
            const response = await axios.get(url);
            return response.data;
        };

        return { id, pwd, loginSubmitHandler };
    },
};
</script>

<style scoped>
ul {
    list-style-type: none;
    position:absolute;
    top:45%;
    left:68%;
}
.Left{
    width: 50%;
    height: 1200px;
    border-right: 1px solid rgba(90, 91, 46, 1);
    background: rgba(254, 255, 226, 1);
}
.Right{
    width: 50%;
    height: 1200px;
    
    position: relative;
    overflow: hidden;
}

.character{
    position:absolute;
    top:10%;
    left:35%;
}

</style>
